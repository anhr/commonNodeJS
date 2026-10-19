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
import WebGPUClient from '../webGPUClient.js'

const sThomsonAnalysisWebGPU = 'ThomsonAnalysisWebGPU';


// ============================================================================
// 2. WEBGPU-ОЦЕНЩИК (tiled reduction)
// ============================================================================

class WebGPUThomsonEvaluator extends WebGPUClient {

    constructor() {
		super();
    this.setElRow = () => {}
    this.createCProgress = () => {}
    this.setCurrentStep = () => {}
/*        
        this.device = null;
        this.tiledPipeline = null;
        this.initialized = false;
        this.initFailed = false;
        this.workgroupSize = 256;
*/        
    }
/*
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
        
        return true;
    }
*/
}

// ============================================================================
// 3. МОДУЛЬ-СИНГЛТОН И ГЛАВНАЯ ФУНКЦИЯ
// ============================================================================

//const _gpuEvaluator = new WebGPUThomsonEvaluator();

/**
 * Публичный способ узнать, доступен ли WebGPU.
 */
/*
export async function isAvailable(serverAddress) {
    return await _gpuEvaluator.init(serverAddress);
}

let rTimeResolver = null;

export function setRTimeResolver(fn) {
    rTimeResolver = fn;
}
*/
export default WebGPUThomsonEvaluator;
