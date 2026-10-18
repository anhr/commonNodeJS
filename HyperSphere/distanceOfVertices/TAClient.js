/**
 * @module ThomsonAnalysisWebGPU
 * @description GPU (WebGPU) ускорение анализа распределения точек (Thomson problem) на S^3.
 *
 * Архитектура: tiled reduction.
 *  - Каждая воркгруппа из TILE=256 потоков обрабатывает один тайл из TILE точек i
 *    для одного timeId t.
 *  - Внутри проходим по всем j, используя shared memory для координат.
 *  - Глобальные буферы только O(marks*N), без marks*N².
 *  - Радиус r индивидуален для каждого timeId (storage-буфер rArray).
 *
 * @license under the Apache License, Version 2.0
 */

import * as Spinner from '../../Spinner.js';

const sThomsonAnalysisWebGPU = 'ThomsonAnalysisWebGPU';

// ============================================================================
// 1. WGSL-ШЕЙДЕР: TILED REDUCTION
// ============================================================================

const tiledShaderWGSL = /* wgsl */`
/**
 * Tiled reduction для Thomson problem.
 *
 * Воркгруппа из TILE=256 потоков обрабатывает TILE точек i в одном timeId t.
 * Проходим по всем j, используя shared memory.
 *
 * ВАЖНО: workgroupBarrier() требует uniform control flow — все потоки воркгруппы
 * должны дойти до него. Поэтому ранний 'return' убран; выравнивание делается
 * через безопасные индексы и защиту записи в конце.
 */

const TILE : u32 = 256u;

struct Params {
    N     : u32,
    marks : u32,
    _pad1 : f32,
    _pad2 : f32,
};

@group(0) @binding(0) var<storage, read>       position       : array<f32>; // marks*N*4
@group(0) @binding(1) var<storage, read>       rArray         : array<f32>; // marks
@group(0) @binding(2) var<storage, read_write> energyPerPoint : array<f32>; // marks*N
@group(0) @binding(3) var<storage, read_write> minD2PerPoint  : array<f32>; // marks*N
@group(0) @binding(4) var<uniform>             params         : Params;

var<workgroup> sh_jx : array<f32, TILE>;
var<workgroup> sh_jy : array<f32, TILE>;
var<workgroup> sh_jz : array<f32, TILE>;
var<workgroup> sh_jw : array<f32, TILE>;
var<workgroup> sh_r  : f32;

@compute @workgroup_size(256, 1, 1)
fn main(
    @builtin(local_invocation_id) lid : vec3<u32>,
    @builtin(workgroup_id)        wid : vec3<u32>,
) {

    let lane    = lid.x;
    let tileIdx = wid.x;
    let t       = wid.y;

    let i = tileIdx * TILE + lane;

    // НЕ делаем ранний return. Все потоки идут до конца.
    let tSafe = select(t, 0u, t >= params.marks);

    if (lane == 0u) {
        sh_r = rArray[tSafe];
    }
    workgroupBarrier();

    let r  = sh_r;
    let r2 = r * r;

    let iSafe = select(i, 0u, i >= params.N);
    let tPosSafe = select(t, 0u, t >= params.marks);

    let myBase = tPosSafe * params.N * 4u + iSafe * 4u;
    let myX = position[myBase + 0u];
    let myY = position[myBase + 1u];
    let myZ = position[myBase + 2u];
    let myW = position[myBase + 3u];

    var sumInvD : f32 = 0.0;
    var minD2   : f32 = 1e30;

    var jChunkStart : u32 = 0u;
    loop {
        if (jChunkStart >= params.N) { break; }

        let myJ = jChunkStart + lane;
        if (myJ < params.N) {
            let jBase = tPosSafe * params.N * 4u + myJ * 4u;
            sh_jx[lane] = position[jBase + 0u];
            sh_jy[lane] = position[jBase + 1u];
            sh_jz[lane] = position[jBase + 2u];
            sh_jw[lane] = position[jBase + 3u];
        } else {
            sh_jx[lane] = 1e30;
            sh_jy[lane] = 1e30;
            sh_jz[lane] = 1e30;
            sh_jw[lane] = 1e30;
        }

        workgroupBarrier();

        let chunkEnd = min(TILE, params.N - jChunkStart);
        for (var k : u32 = 0u; k < chunkEnd; k = k + 1u) {
            let j = jChunkStart + k;

            if (j == i) { continue; }

            let dx = myX - sh_jx[k];
            let dy = myY - sh_jy[k];
            let dz = myZ - sh_jz[k];
            let dw = myW - sh_jw[k];

            let d2raw = dx*dx + dy*dy + dz*dz + dw*dw;
            let d2    = d2raw / r2;
            let d     = sqrt(d2);

            sumInvD = sumInvD + select(0.0, 1.0 / d, d > 1e-12);
            if (d2 < minD2) { minD2 = d2; }
        }

        workgroupBarrier();

        jChunkStart = jChunkStart + TILE;
    }

    if (i < params.N && t < params.marks) {
        let outIdx = t * params.N + i;
        energyPerPoint[outIdx] = sumInvD;
        minD2PerPoint[outIdx]  = minD2;
    }
}
`;

// ============================================================================
// 2. WEBGPU-ОЦЕНЩИК (tiled reduction)
// ============================================================================

class WebGPUThomsonEvaluator {

    constructor() {
        this.device = null;
        this.tiledPipeline = null;
        this.initialized = false;
        this.initFailed = false;
        this.workgroupSize = 256;
    }

    async init(serverAddress) {
        const setStatus = (message, code = 1) => {
            let color = "red", display = '';
            //See D:\My documents\MyProjects\webgl\three.js\GitHub\universe\main\hyperSphere\UniverseSocketServer\Program.cs
            switch (code) {
                case 0://error
                    socket.close();
                    break;
                case 1://Ready to work.
                    color = "black";
                    display = 'none';
                    break;
                case 2://Waiting for Hypersphere Universe Engine...
                    message += ' Please open <a href="../webGPUHUniverse.html" target="_blank" style="color: blue;">Hypersphere Universe Engine</a> page'
                    break;
                default: console.error(sWebGPU + '.compute: Invalud socket status code = ' + code);
            }
            stateText.innerHTML = message;
            stateText.style.color = color;
            btnCPU.style.display = display;
            btnClose.style.display = display;
        }
        
        const socket = new WebSocket(serverAddress);
        socket.binaryType = 'arraybuffer';
        
        // 1. Обработка ошибок (неверный адрес, отказ в соединении)
        socket.onerror = (error) => {
            setStatus('ERROR: Server unreachable or incorrect address. <a href="https://github.com/anhr/universe/blob/main/hyperSphere/HUniverseEngine.md" target="_blank" style="color: blue;">Help</a>.', 0);
            btnCPU.style.display = "";//сделать кнопку видимой
            btnClose.style.display = "";//сделать кнопку видимой
        };
    
        // 2. Обработка закрытия соединения (сервер отключился в процессе)
        socket.onclose = (event) => {
            if (typeof stateText === "undefined") return;
            if (event.wasClean) {
                stateText.innerText = event.reason ? event.reason : "The connection was closed successfully.";
                if (event.code === 4001) stateText.style.color = "#ff4444";  // Эта страница уже открыта
            } else {
                function rgbToHex(rgbString) {
                    // Находим числа. Если совпадений нет, вернется пустой массив [] вместо null
                    const rgb = rgbString.match(/\d+/g)?.map(Number) || [];
                    // Если это был не RGB формат (массив пустой или в нем не 3 числа)
                    if (rgb.length < 3) return rgbString;
                    
                    // Переводим каждое число в HEX и дополняем нулями слева, если нужно
                    return "#" + rgb.map(x => x.toString(16).padStart(2, '0')).join('');
                }
                const color = rgbToHex(stateText.style.color);
                if ((color != "#ff4444") && (color != "red")) {//Не маскировать сообщение об ошибке
                    let error = '';
                    if (event.code != 1006) {
                        const rfcLink = "https://datatracker.ietf.org/doc/html/rfc6455#section-7.4.1";
                        const mozillaLink = 'https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent/code'
                        const errorDetail = event.reason ? `Reason: ${event.reason}` : `Error Code: ${event.code}`;
                        error = ` ${errorDetail}. See RFC: ${rfcLink}, mozilla: ${mozillaLink}`;
                    }
                    const sMessage = `The connection was closed.` + error
    
                    stateText.innerText = sMessage;//"СВЯЗЬ ПРЕРВАНА (Сервер упал или ошибка сети).";
                    stateText.style.color = "#00ffcc";
                }
            }
        };
        // 3. Успешное подключение
        socket.onopen = () => {
            
        };
        socket.onmessage = (event) => {
            if (typeof event.data === 'string') {
                const data = JSON.parse(event.data);

                switch (data.type) {
                    case "STATUS":
                        setStatus(data.message, data.code);
                        if (data.code === 1) {
                            //Connection established. Ready to work.
                            socket.send(JSON.stringify(config));
                            socket.send(settings.bufferGeometry.attributes.position.array);
/*
                            const anglesItemSize = 4, initialAngles = new Float32Array(config.pointsPerStep * anglesItemSize), angles = settings.object.geometry.angles;
                            settings.bufferGeometry.userData.timeId--;//Углы вершин брать из предыдущего шага проигрывателя
                            for (let i = 0; i < config.pointsPerStep; i++) {
                                let index = i * anglesItemSize;
                                const vertuceAngles = angles[i];
                                initialAngles[index++] = vertuceAngles.latitude; initialAngles[index++] = vertuceAngles.longitude; initialAngles[index++] = vertuceAngles.altitude;
                            }
                            settings.bufferGeometry.userData.timeId++;
                            socket.send(initialAngles.buffer);
*/									
                        }
                        break;
                    case "PROGRESS":
                        currentStep = data.currentStep;
                        radiusPrev = data.radiusPrev;
                        updateDisplay();
                        hyperSphere.onSelectSceneEnd(currentStep);
                        break;
                    default: console.error(sWebGPU + ': socket message: Invalid data.type: ' + data.type);
                }
            } else if (typeof event.data === 'object') {
                //Vertices positions
                
                const posData = new Float32Array(event.data), count = config.totalSteps * config.pointsPerStep, THREE = MyThree.three.THREE, pointsPerStep = config.pointsPerStep;
                const position = settings.bufferGeometry.attributes.position;
                position.copyArray(posData); 
                position.needsUpdate = true;

                if (settings.debug && settings.debug.log) {
                    for (let i = 0; i < count; i++) {
                        const pointCur = new THREE.Vector4().fromBufferAttribute(position, i);
                        const pointAngles = utils.cartesianToPolar(pointCur);
                        console.log('Step:' + (parseInt(i / pointsPerStep)) + ' Point:' + i + '. x=' + pointCur.x + ' y=' + pointCur.y + ' z=' + pointCur.z + ' w=' + pointCur.w + ',alt=' + pointAngles.altitude + ' lat=' + pointAngles.latitude + ' lon=' + pointAngles.longitude);
                    }
                }

                //color
                let i = pointsPerStep;
                const progressTitle = 'Load vertices<br>Vertice %s / ' + count, progressBar = new ProgressBar(settings.options.renderer.domElement.parentElement, () => {
                    if (i >= count) {
                        progressBar.remove();
//								if (settings.onUniverseReady) settings.onUniverseReady();
                        return;
                    }
                    const attributeColor = settings.bufferGeometry.attributes.color;
                    const iEnd = i + 100000, times = settings.object.geometry.times, colorItemSize = attributeColor.itemSize;
                    let timesLength = times.length,
                        // time,Если я буду использовать time вместо times[timeId] то непонято почему time превращается в undefined при angles.count = 124875 и marks = 134 и если GPU выдает предупреждение: Binding size (267732000) of [Buffer (unlabeled)] is larger than the maximum storage buffer binding size (134217728). Не могу поймать этот момент

                        //Вершины группируются группами с одинаковым timeId.
                        //В этих группах цвет вершин одинаковый.
                        //Поэтому нет необходимости вычислять цвет каждой вершины.
                        //Вместо этого вычисляется цвет первой вершины в группе time.color = point, а цвет остальных вершин в группе приравнивается цвету первой вершины в группе.
                        timeIdGroup,
                        color;//Цвет текущей группы вершин
                    while ((i < iEnd) && (i < count)) {
                        const timeId = parseInt(i / config.pointsPerStep);
                        if (timeId >= timesLength) {
                            timesLength = times.length;
                        }
                        let index = i * colorItemSize;
                        const point = { x: posData[index++], y: posData[index++], z: posData[index++], w: posData[index++],};
                        if (
                            (timeIdGroup === undefined) ||//Первая группа вершин
                            (timeIdGroup != timeId)//Новая группа вершин
                        ) {
                            timeIdGroup = timeId;
                            times[timeId].color = point;
                            color = new THREE.Vector4().fromBufferAttribute(attributeColor, i);
                        } else attributeColor.setXYZW(i, color.x, color.y, color.z, color.w);
                        if (config.LOG) {
                            const angles = utils.cartesianToPolar(point, config.DEBUG_MODE);
                            const color = new MyThree.three.THREE.Vector4().fromBufferAttribute(attributeColor, i);
                            console.log('Step:' + (parseInt(timeId)) + ' Point:' + i + '. x=' + point.x + ' y=' + point.y + ' z=' + point.z + ' w=' + point.w + ',alt=' + angles.altitude + ' lat=' + angles.latitude + ' lon=' + angles.longitude);
                            console.log('color: x=' + color.x + ' y=' + color.y + ' z=' + color.z + ' w=' + color.w);
                        }
                        settings.options.player.setSelectSceneIndex(timeId);
                        i++;
                    }
                    
                    settings.overriddenProperties.setDrawRange(0, i);// * position.itemSize);
                    progressBar.value = i;
                    progressBar.title(progressTitle.replace('%s', i));
                    progressBar.step();
                }, {

                    sTitle: progressTitle,
                    max: count,

                });
                
                updateDisplay();
                socket.close();
                btnClose.style.display = "";//сделать кнопку видимой
                this.isDataReady = true;
//						if (config.onDataReady) config.onDataReady()
                if (settings.options.onDataReady) settings.options.onDataReady()
            } else console.error(sWebGPU + ': socket message: Invalid event.data type: ' + (typeof event.data));
        };
        
/*        
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

        const requiredLimits = {
            maxBufferSize: adapter.limits.maxBufferSize,
            maxStorageBufferBindingSize: adapter.limits.maxStorageBufferBindingSize,
            maxComputeWorkgroupsPerDimension: adapter.limits.maxComputeWorkgroupsPerDimension,
        };

        try {
            this.device = await adapter.requestDevice({ requiredLimits });
        } catch (e) {
            console.warn(sThomsonAnalysisWebGPU + ': requestDevice with requiredLimits failed:', e);
            try {
                this.device = await adapter.requestDevice();
            } catch (e2) {
                console.warn(sThomsonAnalysisWebGPU + ': requestDevice fallback failed:', e2);
                this.initFailed = true;
                return false;
            }
        }

        this.device.lost.then((info) => {
            console.warn(sThomsonAnalysisWebGPU + ': WebGPU device lost:', info.message);
            this.initialized = false;
            this.initFailed = true;
        });

        const module = this.device.createShaderModule({ code: tiledShaderWGSL });
        this.tiledPipeline = this.device.createComputePipeline({
            layout: 'auto',
            compute: { module, entryPoint: 'main' },
        });

        this.initialized = true;
*/        
        return true;
    }

    /**
     * Батч-вычисление метрик для всех timeId.
     */
/*    
    async evaluateBatch({ positionData, rArray, marks, N }) {

        const device = this.device;
        const WG = this.workgroupSize;

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

        const perPointCount = marks * N;
        const energyBuf = device.createBuffer({
            size: perPointCount * 4,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
        });
        const minD2Buf = device.createBuffer({
            size: perPointCount * 4,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
        });

        const uniformBuf = device.createBuffer({
            size: 16,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });
        {
            const buf = new ArrayBuffer(16);
            new Uint32Array(buf, 0, 2).set([N, marks]);
            device.queue.writeBuffer(uniformBuf, 0, buf);
        }

        const bind = device.createBindGroup({
            layout: this.tiledPipeline.getBindGroupLayout(0),
            entries: [
                { binding: 0, resource: { buffer: posBuffer } },
                { binding: 1, resource: { buffer: rBuffer } },
                { binding: 2, resource: { buffer: energyBuf } },
                { binding: 3, resource: { buffer: minD2Buf } },
                { binding: 4, resource: { buffer: uniformBuf } },
            ],
        });

        const encoder = device.createCommandEncoder();
        {
            const pass = encoder.beginComputePass();
            pass.setPipeline(this.tiledPipeline);
            pass.setBindGroup(0, bind);
            pass.dispatchWorkgroups(Math.ceil(N / WG), marks, 1);
            pass.end();
        }

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

        await readEnergy.mapAsync(GPUMapMode.READ);
        await readMinD2.mapAsync(GPUMapMode.READ);

        const energyArr = new Float32Array(readEnergy.getMappedRange().slice(0));
        const minD2Arr = new Float32Array(readMinD2.getMappedRange().slice(0));

        readEnergy.unmap();
        readMinD2.unmap();

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

            results[t] = { totalEnergy, meanD, variance, stdDev, deviationPercent };
        }

        [posBuffer, rBuffer, energyBuf, minD2Buf, uniformBuf, readEnergy, readMinD2]
            .forEach(b => b.destroy());

        return results;
    }
*/    
}

// ============================================================================
// 3. МОДУЛЬ-СИНГЛТОН И ГЛАВНАЯ ФУНКЦИЯ
// ============================================================================

const _gpuEvaluator = new WebGPUThomsonEvaluator();

/**
 * Публичный способ узнать, доступен ли WebGPU.
 */
export async function isAvailable(serverAddress) {
    return await _gpuEvaluator.init(serverAddress);
}

let rTimeResolver = null;

export function setRTimeResolver(fn) {
    rTimeResolver = fn;
}

/**
 * Батч-вычисление метрик для всех timeId на GPU.
 *
 * ВАЖНО: эта функция НЕ делает CPU-fallback сама.
 * Если GPU недоступен или явно указан useCPU=true — возвращает null.
 *
 * @param {object} opts
 * @param {number}   opts.marks
 * @param {number}   opts.pointsPerStep
 * @param {Float32BufferAttribute} opts.position
 * @param {object[]} opts.aTomsonAnalysisRes
 * @param {HTMLElement} [opts.elStep]
 * @param {Function} [opts.timeIdController]
 * @param {number}   [opts.offsetPerStep]
 * @param {boolean}  [opts.useCPU=false]
 * @param {boolean}  [opts.showSpinner=true] — показывать крутящееся колесо
 * @returns {Promise<object[]|null>}
 */
/*
export async function evaluateDistributionBatch({
    marks, pointsPerStep, position, aTomsonAnalysisRes,
    elStep, timeIdController, offsetPerStep, useCPU = false, showSpinner: boShowSpinner = true,
}) {
    if (useCPU) return null;

    const N = pointsPerStep;
    const stride = offsetPerStep ?? (N * 4);

    // ---- Готовим единый Float32Array координат marks*N*4 ----
    const posArray = new Float32Array(marks * N * 4);
    const src = position.array;

    for (let t = 0; t < marks; t++) {
        const srcOff = t * stride;
        const dstOff = t * N * 4;
        const len = Math.min(N * 4, src.length - srcOff);
        if (len > 0) posArray.set(src.subarray(srcOff, srcOff + len), dstOff);
    }

    // ---- Массив радиусов (индивидуально для каждого timeId) ----
    const rArray = new Float32Array(marks);
    for (let t = 0; t < marks; t++) {
        const r = rTimeResolver ? rTimeResolver(t) : 1;
        rArray[t] = (typeof r === 'number' && r > 0) ? r : 1;
    }

    // ---- Пробуем GPU ----
    const ok = await _gpuEvaluator.init();
    if (!ok) {
        return null;
    }

    let results = null;
    if (boShowSpinner) Spinner.show();
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
        console.error(sThomsonAnalysisWebGPU + ': GPU evaluation failed:', e);
        return null;
    } finally {
        if (boShowSpinner) Spinner.hide();
    }

    // ---- Записываем результаты ----
    for (let t = 0; t < marks; t++) {
        aTomsonAnalysisRes[t] = results[t];
        if (timeIdController) timeIdController.name('Time ID: ' + t + ' / ' + marks);
    }

    return aTomsonAnalysisRes;
}
*/