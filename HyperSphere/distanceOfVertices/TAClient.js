/**
 * @module ThomsonAnalysisWebGPU
 * @description GPU (WebGPU) ускорение анализа распределения точек [Thomson Problem]{@link https://en.wikipedia.org/wiki/Thomson_problem} на S^3.
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
	    this.webGPUPage = () => { return '<a href="../webGPUTA.html" target="_blank" style="color: blue;">Thomson Analysis Engine</a>'; }
	    this.pageType = () => { return 'mainThomsonAnalysis'; }
        this.name = () => { return ' Thomson Analysis' }
        this.setElRow = () => {}
        this.createCProgress = () => {}
        this.setCurrentStep = () => {}
    }
}
export default WebGPUThomsonEvaluator;
