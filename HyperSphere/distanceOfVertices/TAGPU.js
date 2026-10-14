/**
 * @module ThomsonAnalysisWebGPU
 * @description GPU (WebGPU) ускорение анализа распределения точек (Thomson problem) на S^3.
 * Заменяет последовательный цикл for (timeId) в graphFolderChild на батч-вычисления на GPU.
 *
 * Ключевые особенности:
 *  - Индивидуальный радиус r для каждого timeId (storage-буфер rArray).
 *  - Два прохода: distance (marks*N*N потоков) и reduce (marks*N потоков).
 *  - На CPU выгружаются только marks*N значений (energyPerPoint, minD2PerPoint).
 *  - Автоматический CPU-fallback, если WebGPU недоступен или падает.
 *
 * @license under the Apache License, Version 2.0
 */

const sThomsonAnalysisWebGPU = 'ThomsonAnalysisWebGPU';

// ============================================================================
// 1. WGSL-ШЕЙДЕРЫ
// ============================================================================

/**
 * Ядро попарных расстояний.
 * Поток (i, j, t) читает position[t][i], position[t][j], нормирует на rArray[t],
 * пишет inv_d и d2 в pairInvD[t][i][j] и pairD2[t][i][j].
 */
const distanceShaderWGSL = /* wgsl */`
struct Params {
    N         : u32,   // точек на шаг
    marks     : u32,   // число шагов (timeId)
    _pad1     : f32,
    _pad2     : f32,
};

@group(0) @binding(0) var<storage, read>       position : array<f32>; // marks*N*4
@group(0) @binding(1) var<storage, read>       rArray   : array<f32>; // marks
@group(0) @binding(2) var<storage, read_write> pairInvD : array<f32>; // marks*N*N
@group(0) @binding(3) var<storage, read_write> pairD2   : array<f32>; // marks*N*N
@group(0) @binding(4) var<uniform>             params   : Params;

@compute @workgroup_size(16, 16, 1)
fn main(@builtin(global_invocation_id) gid : vec3<u32>) {

    let i = gid.x;
    let j = gid.y;
    let t = gid.z;

    if (i >= params.N || j >= params.N || t >= params.marks) { return; }

    let base = t * params.N * 4u;
    let i0 = base + i * 4u;
    let j0 = base + j * 4u;

    let dx = position[i0 + 0u] - position[j0 + 0u];
    let dy = position[i0 + 1u] - position[j0 + 1u];
    let dz = position[i0 + 2u] - position[j0 + 2u];
    let dw = position[i0 + 3u] - position[j0 + 3u];

    let d2raw = dx*dx + dy*dy + dz*dz + dw*dw;

    let r  = rArray[t];
    let r2 = r * r;
    let d2 = d2raw / r2;

    let idx = (t * params.N + i) * params.N + j;

    if (i == j) {
        pairInvD[idx] = 0.0;
        pairD2[idx]   = 0.0;
    } else {
        let d = sqrt(d2);
        pairInvD[idx] = select(0.0, 1.0 / d, d > 1e-12);
        pairD2[idx]   = d2;
    }
}
`;

/**
 * Ядро редукции по j.
 * Поток (i, t) суммирует pairInvD[t][i][*] -> energyPerPoint[t*N+i],
 * находит min(pairD2[t][i][*]) -> minD2PerPoint[t*N+i].
 */
const reduceShaderWGSL = /* wgsl */`
struct Params {
    N     : u32,
    marks : u32,
    _pad1 : f32,
    _pad2 : f32,
};

@group(0) @binding(0) var<storage, read>       pairInvD        : array<f32>;
@group(0) @binding(1) var<storage, read>       pairD2          : array<f32>;
@group(0) @binding(2) var<storage, read_write> energyPerPoint  : array<f32>; // marks*N
@group(0) @binding(3) var<storage, read_write> minD2PerPoint   : array<f32>; // marks*N
@group(0) @binding(4) var<uniform>             params          : Params;

@compute @workgroup_size(256, 1, 1)
fn main(@builtin(global_invocation_id) gid : vec3<u32>) {

    let t = gid.y;
    let i = gid.x;

    if (i >= params.N || t >= params.marks) { return; }

    let rowBase = (t * params.N + i) * params.N;

    var sumInvD : f32 = 0.0;
    var minD2   : f32 = 1e30;

    for (var j : u32 = 0u; j < params.N; j = j + 1u) {
        if (j == i) { continue; }
        let invd = pairInvD[rowBase + j];
        let d2   = pairD2[rowBase + j];
        sumInvD = sumInvD + invd;
        if (d2 < minD2) { minD2 = d2; }
    }

    let outIdx = t * params.N + i;
    energyPerPoint[outIdx] = sumInvD;
    minD2PerPoint[outIdx]  = minD2;
}
`;

// ============================================================================
// 2. ТЕОРЕТИЧЕСКИЙ МИНИМУМ ЭНЕРГИИ
// ============================================================================

/**
 * Returns the exact or approximate theoretical minimum of Thomson energy
 * for N points on a unit 4D hypersphere (chordal distance, 1/d potential).
 */
/*
export function getTheoreticalMinEnergy4D(N) {
    switch (N) {
        case 0:
        case 1: return 0;
        case 2: return 0.5;
        case 3: return 3 / Math.sqrt(3);
        case 4: return 6 / Math.sqrt(8 / 3);
        case 5: return 10 / Math.sqrt(5 / 4);
        case 6: return (3 / 2.0) + (12 / Math.sqrt(2));
        case 7: return 14.45322;
        case 8: return (4 / 2.0) + (24 / Math.sqrt(2));
        case 24:
            return 12 * (1 / 2.0 + 8 / 1.0 + 12 / Math.sqrt(2) + 2 / Math.sqrt(3));
        case 120: {
            const phi = (1 + Math.sqrt(5)) / 2;
            return 60 * (
                1 / 2.0 +
                12 / phi +
                20 / Math.sqrt(3) +
                12 * phi +
                30 / Math.sqrt(2) +
                20 * (phi / Math.sqrt(3)) +
                12 * (Math.pow(phi, 2) / Math.sqrt(5))
            );
        }
    }

    const leadingTerm = (4 / (3 * Math.PI)) * (N * (N - 1)) / 2;
    const correction = -0.67 * Math.pow(N, 4 / 3);
    const calculatedEnergy = leadingTerm + correction;

    const absolutePhysicalFloor = N * 0.25;
    if (calculatedEnergy < absolutePhysicalFloor) {
        console.error(sThomsonAnalysisWebGPU +
            `: [getTheoreticalMinEnergy4D] Asymptotic evaluation failed for N = ${N}. ` +
            `Calculated energy (${calculatedEnergy.toFixed(4)}) is below the physical limit ` +
            `(${absolutePhysicalFloor}). Add "case ${N}:" for an exact solution.`);
        return absolutePhysicalFloor;
    }
    return calculatedEnergy * 2;
}
*/
// ============================================================================
// 3. WEBGPU-ОЦЕНЩИК
// ============================================================================

class WebGPUThomsonEvaluator {

    constructor() {
        this.device = null;
        this.distancePipeline = null;
        this.reducePipeline = null;
        this.initialized = false;
        this.initFailed = false;
    }

    async init() {
        if (this.initialized) return true;
        if (this.initFailed) return false;

        if (typeof navigator === 'undefined' || !navigator.gpu) {
            console.warn(sThomsonAnalysisWebGPU + ': WebGPU не поддерживается, CPU fallback.');
            this.initFailed = true;
            return false;
        }

        let adapter;
        try {
            adapter = await navigator.gpu.requestAdapter();
        } catch (e) {
            console.warn(sThomsonAnalysisWebGPU + ': requestAdapter failed:', e);
            this.initFailed = true;
            return false;
        }
        if (!adapter) {
            console.warn(sThomsonAnalysisWebGPU + ': WebGPU adapter не найден, CPU fallback.');
            this.initFailed = true;
            return false;
        }

        try {
            this.device = await adapter.requestDevice();
        } catch (e) {
            console.warn(sThomsonAnalysisWebGPU + ': requestDevice failed:', e);
            this.initFailed = true;
            return false;
        }

        // Обработка потери устройства
        this.device.lost.then((info) => {
            console.warn(sThomsonAnalysisWebGPU + ': WebGPU device lost:', info.message);
            this.initialized = false;
            this.initFailed = true;
        });

        const distModule = this.device.createShaderModule({ code: distanceShaderWGSL });
        this.distancePipeline = this.device.createComputePipeline({
            layout: 'auto',
            compute: { module: distModule, entryPoint: 'main' },
        });

        const redModule = this.device.createShaderModule({ code: reduceShaderWGSL });
        this.reducePipeline = this.device.createComputePipeline({
            layout: 'auto',
            compute: { module: redModule, entryPoint: 'main' },
        });

        this.initialized = true;
        return true;
    }

    /**
     * Батч-вычисление метрик для всех timeId.
     *
     * @param {object} opts
     * @param {Float32Array} opts.positionData  — marks*N*4 координат (x,y,z,w)
     * @param {Float32Array} opts.rArray        — marks радиусов
     * @param {number}       opts.marks
     * @param {number}       opts.N
     * @returns {Promise<Array<object>>} массив метрик по timeId
     */
    async evaluateBatch({ positionData, rArray, marks, N }) {

        const device = this.device;

        // ---- Буферы ----
        const posBuffer = device.createBuffer({
            size: positionData.byteLength,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
        });
        device.queue.writeBuffer(posBuffer, 0, positionData);

        const rBuffer = device.createBuffer({
            size: rArray.byteLength,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
        });
        device.queue.writeBuffer(rBuffer, 0, rArray);

        const pairCount = marks * N * N;
        const pairInvDSize = pairCount * 4;
        const pairD2Size = pairCount * 4;

        const pairInvDBuffer = device.createBuffer({
            size: pairInvDSize,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
        });
        const pairD2Buffer = device.createBuffer({
            size: pairD2Size,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
        });

        const perPointCount = marks * N;
        const energyBuf = device.createBuffer({
            size: perPointCount * 4,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
        });
        const minD2Buf = device.createBuffer({
            size: perPointCount * 4,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
        });

        // uniform distance
        const distUniform = device.createBuffer({
            size: 16,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });
        {
            const buf = new ArrayBuffer(16);
            new Uint32Array(buf, 0, 2).set([N, marks]);
            new Float32Array(buf, 8, 2).set([0, 0]);
            device.queue.writeBuffer(distUniform, 0, buf);
        }

        // uniform reduce
        const redUniform = device.createBuffer({
            size: 16,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });
        {
            const buf = new ArrayBuffer(16);
            new Uint32Array(buf, 0, 2).set([N, marks]);
            device.queue.writeBuffer(redUniform, 0, buf);
        }

        // ---- Bind groups ----
        const distBind = device.createBindGroup({
            layout: this.distancePipeline.getBindGroupLayout(0),
            entries: [
                { binding: 0, resource: { buffer: posBuffer } },
                { binding: 1, resource: { buffer: rBuffer } },
                { binding: 2, resource: { buffer: pairInvDBuffer } },
                { binding: 3, resource: { buffer: pairD2Buffer } },
                { binding: 4, resource: { buffer: distUniform } },
            ],
        });
        const redBind = device.createBindGroup({
            layout: this.reducePipeline.getBindGroupLayout(0),
            entries: [
                { binding: 0, resource: { buffer: pairInvDBuffer } },
                { binding: 1, resource: { buffer: pairD2Buffer } },
                { binding: 2, resource: { buffer: energyBuf } },
                { binding: 3, resource: { buffer: minD2Buf } },
                { binding: 4, resource: { buffer: redUniform } },
            ],
        });

        // ---- Команды ----
        const encoder = device.createCommandEncoder();

        {
            const pass = encoder.beginComputePass();
            pass.setPipeline(this.distancePipeline);
            pass.setBindGroup(0, distBind);
            pass.dispatchWorkgroups(Math.ceil(N / 16), Math.ceil(N / 16), marks);
            pass.end();
        }

        {
            const pass = encoder.beginComputePass();
            pass.setPipeline(this.reducePipeline);
            pass.setBindGroup(0, redBind);
            pass.dispatchWorkgroups(Math.ceil(N / 256), marks, 1);
            pass.end();
        }

        // ---- Staging буферы для чтения ----
        const readEnergy = device.createBuffer({
            size: perPointCount * 4,
            usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
        });
        const readMinD2 = device.createBuffer({
            size: perPointCount * 4,
            usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
        });
        encoder.copyBufferToBuffer(energyBuf, 0, readEnergy, 0, perPointCount * 4);
        encoder.copyBufferToBuffer(minD2Buf, 0, readMinD2, 0, perPointCount * 4);

        device.queue.submit([encoder.finish()]);

        // ---- Чтение ----
        await readEnergy.mapAsync(GPUMapMode.READ);
        await readMinD2.mapAsync(GPUMapMode.READ);

        const energyArr = new Float32Array(readEnergy.getMappedRange().slice(0));
        const minD2Arr = new Float32Array(readMinD2.getMappedRange().slice(0));

        readEnergy.unmap();
        readMinD2.unmap();

        // ---- CPU-финализация O(marks*N) ----
        const results = new Array(marks);

        for (let t = 0; t < marks; t++) {
            const off = t * N;

            let totalEnergy = 0;
            let sumMinD = 0;
            const minDs = new Float64Array(N);

            for (let i = 0; i < N; i++) {
                totalEnergy += energyArr[off + i];
                const md = Math.sqrt(minD2Arr[off + i]);
                minDs[i] = md;
                sumMinD += md;
            }
            totalEnergy /= 2;

            const meanD = sumMinD / N;

            let variance = 0;
            for (let i = 0; i < N; i++) {
                const diff = minDs[i] - meanD;
                variance += diff * diff;
            }
            variance /= N;

            const stdDev = Math.sqrt(variance);
            const deviationPercent = meanD > 0 ? (stdDev / meanD) * 100 : 0;
/*
            const tmin = getTheoreticalMinEnergy4D(N);
            const totalEnergyPercent =
                totalEnergy.toFixed(4) +
                ` of ${tmin.toFixed(4)} ` +
                (((totalEnergy - tmin) / tmin) * 100).toFixed(1) + '%';
*/

            results[t] = {
                totalEnergy,
                meanD,
                variance,
                stdDev,
                deviationPercent,
//                totalEnergyPercent,
            };
        }

        // ---- Освобождение ----
        [posBuffer, rBuffer, pairInvDBuffer, pairD2Buffer, energyBuf, minD2Buf,
            distUniform, redUniform, readEnergy, readMinD2].forEach(b => b.destroy());

        return results;
    }
}

// ============================================================================
// 4. МОДУЛЬ-СИНГЛТОН И ГЛАВНАЯ ФУНКЦИЯ
// ============================================================================

const _gpuEvaluator = new WebGPUThomsonEvaluator();

/**
 * Резолвер радиуса по timeId. Передаётся из graphFolderChild,
 * чтобы GPU-модуль не зависел от classSettings.
 * @type {function(number): number | null}
 */
let rTimeResolver = null;

/**
 * Устанавливает резолвер радиуса.
 * @param {function(number): number} fn
 */
export function setRTimeResolver(fn) {
    rTimeResolver = fn;
}

/**
 * Батч-аналог цикла for (timeId) в graphFolderChild.
 * Все timeId считаются ОДНИМ вызовом GPU. Результаты записываются в aTomsonAnalysisRes[timeId].
 *
 * @param {object} opts
 * @param {number}   opts.marks
 * @param {number}   opts.pointsPerStep
 * @param {Float32BufferAttribute} opts.position
 * @param {object[]} opts.aTomsonAnalysisRes  — массив-приёмник (индексируется timeId)
 * @param {HTMLElement} [opts.elStep]
 * @param {Function} [opts.timeIdController]
 * @param {Function} [opts.cpuFallbackFn]     — async (timeId, params) => result
 * @param {number}   [opts.offsetPerStep]     — смещение в position на один timeId (по умолчанию pointsPerStep*4)
 * @returns {Promise<object[]>}
 */
export async function evaluateDistributionBatch({
    marks, pointsPerStep, position, aTomsonAnalysisRes,
    elStep, timeIdController, cpuFallbackFn, offsetPerStep,
}) {
    const N = pointsPerStep;
    const stride = offsetPerStep ?? (N * 4);

    // ---- Готовим единый Float32Array координат marks*N*4 ----
    const posArray = new Float32Array(marks * N * 4);
    const src = position.array;

    for (let t = 0; t < marks; t++) {
        const srcOff = t * stride;
        const dstOff = t * N * 4;
        // защита от выхода за границы
        const len = Math.min(N * 4, src.length - srcOff);
        if (len > 0) posArray.set(src.subarray(srcOff, srcOff + len), dstOff);
    }

    // ---- Готовим массив радиусов ----
    const rArray = new Float32Array(marks);
    for (let t = 0; t < marks; t++) {
        const r = rTimeResolver ? rTimeResolver(t) : 1;
        rArray[t] = (typeof r === 'number' && r > 0) ? r : 1;
    }

    // ---- Пробуем GPU ----
    const ok = await _gpuEvaluator.init();
/*    
console.error('Under constraction');
const ok = false;
await _gpuEvaluator.init();
*/

    let results = null;
    if (ok) {
        try {
            if (elStep) {
                const msg = 'WebGPU batch evaluation...';
                elStep instanceof HTMLElement ? elStep.innerText = msg : elStep.name(msg);
            }
            results = await _gpuEvaluator.evaluateBatch({
                positionData: posArray,
                rArray,
                marks,
                N,
            });
        } catch (e) {
            console.error(sThomsonAnalysisWebGPU + ': GPU evaluation failed, fallback to CPU:', e);
            results = null;
        }
    }

    // ---- CPU fallback ----
    if (!results) {
        if (!cpuFallbackFn) {
            console.error(sThomsonAnalysisWebGPU + ': WebGPU unavailable and no cpuFallbackFn provided.');
            return aTomsonAnalysisRes;
        }
        if (elStep) {
            const msg = 'WebGPU unavailable — CPU fallback...';
            elStep instanceof HTMLElement ? elStep.innerText = msg : elStep.name(msg);
        }
        results = [];
        for (let t = 0; t < marks; t++) {
            if (timeIdController) timeIdController.name('Time ID: ' + t + ' / ' + marks);
            results[t] = await cpuFallbackFn(t);
        }
    }

    // ---- Записываем результаты ----
    for (let t = 0; t < marks; t++) {
        aTomsonAnalysisRes[t] = results[t];
        if (timeIdController) timeIdController.name('Time ID: ' + t + ' / ' + marks);
    }

    return aTomsonAnalysisRes;
}