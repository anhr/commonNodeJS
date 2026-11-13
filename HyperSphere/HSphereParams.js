/**
 * @module HUniverseParams
 * @description Parameters you can pass to HypersphericalUniverse class
 *
 * @author [Andrej Hristoliubov]{@link https://github.com/anhr}
 *
 * @copyright 2011 Data Arts Team, Google Creative Lab
 *
 * @license under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
*/

//import HypersphericalUniverse from '../hyperSphericalUniverse.js';
//import HypersphericalUniverse from '../build/hyperSphericalUniverse.module.js';
//import HypersphericalUniverse from '../build/hyperSphericalUniverse.module.min.js';
//import HypersphericalUniverse from 'https://raw.githack.com/anhr/universe/main/hyperSphere/hyperSphericalUniverse.js';
//import HypersphericalUniverse from 'https://raw.githack.com/anhr/universe/main/hyperSphere/build/hyperSphericalUniverse.module.js';
//import HypersphericalUniverse from 'https://raw.githack.com/anhr/universe/main/hyperSphere/build/hyperSphericalUniverse.module.min.js';
//if ( HypersphericalUniverse.default ) HypersphericalUniverse = HypersphericalUniverse.default;

import * as utils from './utilsHSphere.js'
import * as fileHandler from '../fileHandler.js';

const classSettings = {
	compute: {
		//isUseCPU: true,
		//serverAddress: 'ws://localhost:5000/ws',
		config: {

			//Select one:

			RANDOM_POINTS: 0,//Случайная точка не вычисляется. Вместо этого возвращается PSEUDO_RANDOM.

			//Вычисляется случайное число.
			//В GPU для получения случайного числа применяется хеширование(Hashing).Простой генератор псевдослучайных чисел(PCG).Permuted Congruential Generator(Перемешанный конгруэнтный генератор).
			//Этот метод лучше всего вычисляет случайное число, но требует много времени на вычисления если не оптимизировать Google Chrome.
			//Инструкция по оптимизации находится в Technical Guide: Enabling High-Performance GPU for Google Chrome https://github.com/anhr/universe/blob/main/hyperSphere/HUniverseEngine.md#technical-guide-enabling-high-performance-gpu-for-google-chrome Инструкцию по оттимизации смотри в D:\My documents\MyProjects\webgl\three.js\GitHub\universe\main\hyperSphere\webGPUHUniverse.js
			//Значение по умолчанию
			//RANDOM_POINTS: 1,

			//PSEUDO_RANDOM: 1,//Have effect only if RANDOM_POINTS: 0. Available range from 0 to 1. Default 0.5

			//ВНИМАНИЕ!!! Этот параметр устарел. используйте ETA_0
			//Damping is a velocity reduction factor applied at each iteration step.
			//It simulates friction or energy dissipation in the system.
			//Without damping, particles would oscillate indefinitely around equilibrium positions, never stabilizing.
			//Valid DAMPING value range:
			//  0 - Heavy damping, quick stopping. Fast stabilization, no oscillations
			//  1 - No damping. Not recommended for production
			//Default 0.95.
			//See https://chat.deepseek.com/share/azo3y7zgc6hov7mlfp for details.
//			DAMPING: 0.95,

			/**
			 * ETA (Estimated Time Advance / Step Ratio) — нормализованный безразмерный 
			 * коэффициент шага интегрирования по времени (Learning Rate).
			 * 
			 * ФИЗИЧЕСКИЙ СМЫЛ И ВЯЗКОСТЬ:
			 * Модель описывает движение зарядов в режиме сильного трения (Overdamped Dynamics / 
			 * аристотелева механика v = μ * F), где инерция пренебрежимо мала.
			 * 
			 * ETA_0 обратно пропорционален вязкости среды γ (ETA_0 ~ 1/γ):
			 * - Меньше ETA_0 -> выше вязкость среды (медленное, но очень устойчивое движение).
			 * - Больше ETA_0 -> ниже вязкость среды (быстрый спуск, но риск осцилляций).
			 *
			 * ДИАПАЗОНЫ И ЭНЕРГИЯ:
			 * - Допустимый диапазон ETA_0: (0.0, 0.05] (для метода Euler).
			 *   • ETA_0 -> 0 : Среда бесконечно вязкая, движение замирает.
			 *   • ETA_0 > 0.05 : Трение недостаточно, возникают численные осцилляции 
			 *                    и неустойчивость (расходимость).
			 * - Потеря энергии: В этой численной модели ВСЯ потенциальная энергия Кулоновского 
			 *   отталкивания полностью диссипирует (переходит в "тепло" / вязкое трение).
			 * - Численная задержка ("без тепла"): Энергия не диссипирует только при ETA_0 = 0, 
			 *   но тогда система статична. При попытке добавить инерцию (m * a = F - γ*v) 
			 *   без вязкого затухания точки начнут бесконечно колебаться вокруг 
			 *   минимума энергии, как пружинный маятник.
			 *
			 * МАСШТАБИРОВАНИЕ ОТ РАДИУСА РАДИУСА S^3:
			 * Чтобы сохранить характерное относительное смещение при изменении R:
			 * F ~ 1/R^2 (силы вырастают при уменьшении радиуса)
			 * ETA(R) = ETA_0 * R^3
			 * default 0.01
			 */
			//ETA_0: 0,

			// коэффициент сохранения импульса (затухания инерции).
			// Определяет, какая доля скорости с прошлого шага сохраняется на текущем.
			//
			// Минимальное значение: 0.0
			// - Полное отсутствие инерции (классический градиентный спуск).
			// Максимальное значение: < 1.0 (обычно до 0.99)
			// - Чем ближе к 1.0, тем сильнее инерция и «тяжелее» точки.
			// - BETA = 0.85–0.90: умеренно сильная инерция, ускоряет преодоление плато и помогает проходить локальные минимумы.
			// - BETA >= 0.99: запредельная инерция, точки начинают бесконечно осциллировать и долго «раскачиваться».
			// По умолчанию 0.85
			//BETA: 0.99,

			//Сила отталкивания. Чем меньше значение, тем слабее силы отталкивания между точками, и тем медленнее они двигаются

			SIGMA: 0.1,//ширина облака неопределённости в единицах радиуса гиперсферы R (то есть безразмерная, SIGMA = σ/R). По смыслу — это доля радиуса, на которую «размазана» точка.
			//SIGMA = 0	идеальная (детерминированная) модель. шум отключён; точные совпадения вызывают сообщение об ошибке
			//~1e-1 ≤ SIGMA ≤ ~1	шум сравним с расстоянием между точками	точки «размазаны» по сфере; антиподы не достигаются как детерминированное состояние; итог — больцмановское распределение, а не минимум энергии
			//SIGMA > 1	шум больше радиуса	физически бессмысленно: «облако» выходит за пределы сферы; модель теряет смысл
			
//deprecated
//REPULSION_STRENGTH: 1,//10,//По умолчанию не определено и зависит от количества вершин REPULSION_STRENGTH = config.a / classSettings.settings.object.geometry.angles.length.
				//a: 50,//имеет эффект только если не определен REPULSION_STRENGTH. Default 50


				//Hyperbola parametr. See RandomVertice.calculateHyperbola
				//p: 0 Прямая линия: y = x (через точки (0,0) и (π,π)).
				//p: 1 Два отрезка: вертикальный и горизонтальный
				//0 < p < 1 Гипербола. График гиперболы млжно посмотреть на http://localhost/anhr/commonNodeJS/master/HyperSphere/Examples/hyperbola.html
				p: 1,//0.99,//Default 0

				//LOG: true,//log to console all calculated vertices. Default undefined. Внимание!!! отнимает много времени во время итерации
			},
	},
	/*
	intersection: {

		position: 1,
		//color: 'red',

	},
	*/
	onSelectScene: (hyperSphere, timeId, t) => {

		//				if (hyperSphere.middleVertices) return hyperSphere.middleVertices(timeId, t);
		if (hyperSphere.distanceOfVertices) return hyperSphere.distanceOfVertices(timeId, t);

	},

	//Have effect only if 3DUniverse cookie is empty
	/*
	edges: {

		project: false,//Doesn't project edges onto canvas
		creationMethod: HypersphericalUniverse.edgesCreationMethod.Random,

	},
	*/
	edges: false,
	//boTraces: true,
	//r: 0.1,
	/*
	rRange: {

		min: -10,
		max: 25

	},
	*/
	debug: {

		probabilityDensity: false,
		middleVertice: false,
		log: false,//нет значения по умолчанию. Надо явно задавать
		edges: false,
		random: () => { return 0.5 },//replacing random vertices with strictly defined vertices.

	},
	//debug: false,
	settings: {

		noGetMaxPairsFloat32Length: true,
		object: {

			//name: 'edges',
			//color: 'red',
			//color: 0xffffff,
			geometry: {

				//positionsFileName: 'positions500.bin',
				//Tesseract https://en.wikipedia.org/wiki/Tesseract
				//Please set indices.edges for tesseract
				angles: [
					//cube 1
					[Math.PI / 2, Math.PI * 1 / 4, Math.PI * 1 / 4],
					[Math.PI / 2, Math.PI * 1 / 4, Math.PI * 3 / 4],
					[Math.PI / 2, Math.PI * 1 / 4, - Math.PI * 3 / 4],
					[Math.PI / 2, Math.PI * 1 / 4, - Math.PI * 1 / 4],
					[Math.PI / 2, - Math.PI * 1 / 4, - Math.PI * 1 / 4],
					[Math.PI / 2, - Math.PI * 1 / 4, Math.PI * 1 / 4],
					[Math.PI / 2, - Math.PI * 1 / 4, Math.PI * 3 / 4],
					[Math.PI / 2, - Math.PI * 1 / 4, - Math.PI * 3 / 4],
					//cube 2
					[Math.PI / 4, Math.PI * 1 / 4, Math.PI * 1 / 4],
					[Math.PI / 4, Math.PI * 1 / 4, Math.PI * 3 / 4],
					[Math.PI / 4, Math.PI * 1 / 4, - Math.PI * 3 / 4],
					[Math.PI / 4, Math.PI * 1 / 4, - Math.PI * 1 / 4],
					[Math.PI / 4, - Math.PI * 1 / 4, - Math.PI * 1 / 4],
					[Math.PI / 4, - Math.PI * 1 / 4, Math.PI * 1 / 4],
					[Math.PI / 4, - Math.PI * 1 / 4, Math.PI * 3 / 4],
					[Math.PI / 4, - Math.PI * 1 / 4, - Math.PI * 3 / 4],
				],

					//test for angles range
					angles: [
						//vertice 0
						[
							0,//Altitude
							Math.PI / 4,//Latitude
							0,//Longitude
						],
						//vertice 1
						[
							//Math.PI / 2,//Altitude
							-1 * Math.PI / 4,//Altitude

							Math.PI / 4,//Latitude
							//Math.PI * 3 / 4,//Latitude invalid range from -π/2 to π/2
							//Math.PI * (1 / 4 + 2),//Latitude invalid range from -π/2 to π/2

							0,//Longitude
							//Math.PI * 2,//Longitude invalid range from -π to π
						],
						//vertice 2
						[
							2 * Math.PI / 4,//Altitude
							Math.PI / 4,//Latitude
							0,//Longitude
						],
						//vertice 3
						[
							3 * Math.PI / 4,//Altitude
							Math.PI / 4,//Latitude
							0,//Longitude
						],
						//vertice 4
						[
							4 * Math.PI / 4,//Altitude
							Math.PI / 4,//Latitude
							0,//Longitude
						],
						//vertice 5
						[
							5 * Math.PI / 4,//Altitude
							Math.PI / 4,//Latitude
							0,//Longitude
						],
						//vertice 6
						[
							9 * Math.PI / 4,//Altitude
							Math.PI / 4,//Latitude
							0,//Longitude
						],
					],

						//pentahedroid https://en.wikipedia.org/wiki/5-cell
						times2://не забыть поставить дополнительные квадратные скобки
				[
					//Player index is 0 is hyperpyramid
					[[], [Math.PI / 2, Math.PI / 2], [
						Math.PI / 2,
						- Math.PI / 6,
						Math.PI * 0,
						//1,//error: Universe: Invalid classSettings.settings.object.geometry.times[0][2].length = 4. Every vertice is limited to 3 angles.
					], [Math.PI / 2, - Math.PI / 6, Math.PI * 2 * 1 / 3], [Math.PI / 2, - Math.PI / 6, - Math.PI * 2 * 1 / 3],],
					//{ count: 5, },

					//Player index is 1
					//[],
					[[1, 2, 3]],
					//[[], [Math.PI / 2, Math.PI / 2], [Math.PI / 2, - Math.PI / 6, Math.PI * 0,], [Math.PI / 2, - Math.PI / 6, Math.PI * 2 * 1 / 3],[Math.PI / 2, - Math.PI / 6, - Math.PI * 2 * 1 / 3], ]
					/*
					{
						count: 7,
					},
					*/
				],
					//hyperpyramid
					angles:
				[
					[],//vertice[0] = [0,0,0,1] angles = [0,0,0] edges = [0]
					[Math.PI / 2, Math.PI / 2],//vertice[1] = [0,1,0,6.123233995736766e-17] angles = [1.5707963267948966,1.5707963267948966,0] edges = [0,1,6]
					[
						Math.PI / 2,//Altitude
						- Math.PI / 6,//Latitude
						Math.PI * 0,//Longitude
					],//vertice[2] = [0,-0.4999999999999998,-0.8660254037844387,6.123233995736766e-17] angles = [1.5707963267948966,-0.5235987755982988,0] edges = [1,2,5,7]
					[Math.PI / 2, - Math.PI / 6, Math.PI * 2 * 1 / 3],//vertice[3] = [-0.7500000000000001,-0.4999999999999998,0.4330127018922192,6.123233995736766e-17] angles = [1.5707963267948966,-0.5235987755982988,2.0943951023931953] edges = [2,3,6,8]
					[Math.PI / 2, - Math.PI / 6, - Math.PI * 2 * 1 / 3],//vertice[4] = [0.7500000000000001,-0.4999999999999998,0.4330127018922192,6.123233995736766e-17] angles = [1.5707963267948966,-0.5235987755982988,-2.0943951023931953] edges = [3,4,7,9]
				],
					angles: [
						//[0, 0, 0],//0
						//[Math.PI / 1, Math.PI / 19, Math.PI / 10],//0. Эта вершина лежит на оси W потомучто Altitude = Math.PI. Это приводит к тому что в функции cartesianToPolar величина rXYZ < 1e-10 и широта с долготой не определены (принимаем за 0)
						[Math.PI / 1.5, Math.PI / 19, Math.PI / 10],//0.
						[Math.PI / 2, Math.PI / 20, Math.PI / 11],//1
						[Math.PI / 3, Math.PI / 21, Math.PI / 2],//2
						[Math.PI / 4, Math.PI / 22, -Math.PI / 2],//3
						[Math.PI / 5, Math.PI / 23, Math.PI],//4
					],
					angles: [
						[Math.PI / 1.55, Math.PI / 19, Math.PI / 10],//0.
						[Math.PI / 1.5, Math.PI / 19, Math.PI / 10],//1.
					],
					angles: [
						//[0, 0, 0],//0
						//[Math.PI / 1, Math.PI / 19, Math.PI / 10],//0. Эта вершина лежит на оси W потомучто Altitude = Math.PI. Это приводит к тому что в функции cartesianToPolar величина rXYZ < 1e-10 и широта с долготой не определены (принимаем за 0)
						[Math.PI / 1.5, Math.PI / 19, Math.PI / 10],//0.[2.0943951023931953, 0.16534698176788384, 0.3141592653589793]
						[Math.PI / 2, Math.PI / 20, Math.PI / 11],//1
						[Math.PI / 3, Math.PI / 21, Math.PI / 2],//2
						[Math.PI / 4, Math.PI / 22, -Math.PI / 2],//3
						[Math.PI / 5, Math.PI / 23, Math.PI],//4
					],
					//angles: { count: 50, },
						//angles: { count: 500000, },//недостаточно памяти при количестве шагов плеера 1000
						//angles: { count: 124875, },//выделяется максимально возможное количество памяти при шагов плеера 134. ВНИМАНИЕ!!! Использовать с осторожностью. Вебстраница сильно зависает.

						//Для тестирования GPU при условии, что adapter.requestDevice() вызывается без аргуметов.
						//В этом случае базовый лимит WebGPU по умолчанию для всех устройств в мире равен 268435456 (256 MB).
						//Выделяется максимально возможное количество памяти при шагов плеера равном 250.
						//В настояшее время я выделяю памяти больше базового лимита. Смотри async function initWebGPU(idx) в D:\My documents\MyProjects\webgl\three.js\GitHub\universe\main\hyperSphere\webGPUHUniverse.html
						//angles: { count: 67109, },//выделяется максимально возможное количество памяти при шагов плеера 1001. ВНИМАНИЕ!!! Использовать с осторожностью. Вебстраница сильно зависает.

						//angles: angles,
						/*
						colors: [
							1, 0, 0,//red
							0, 1, 0,//green
							0, 0, 1,//blue
							//1, 1, 1,//white
						],
						*/
						//opacity: [1, 0.2],
						indices: {

					edges: { count: 6, },
					/*
					//Tesseract
					edges: [
						//cube 1
						[0,1], [1,2], [2,3], [3,0],
						[4,5], [5,6], [6,7], [7,4],
						[0,5], [1,6], [2,7], [3,4],
						//cube 2
						[ 8,9 ], [ 9,10], [10,11], [11,8 ],
						[12,13], [13,14], [14,15], [15,12],
						[ 8,13], [ 9,14], [10,15], [11,12],
						//cube 1 to //cube 2
						[ 0,8], [ 1,9], [2,10], [3,11],
						[ 4,12], [ 5,13], [6,14], [7,15],
					],
					*/

				}
			}
		}
	}
}
const myThreeOptions = {
	//axesHelper: false,
	scales: { z: { min: -1, max: 1 } },
	scene: { scale: { x: 1, y: 1, z: 1 }},
	playerOptions: {

		//marks: 100,
		//marks: 750,//при количестве вершин равном 124875 GPU зависает и перезапускается с предупреждением: A valid external Instance reference no longer exists.
		//marks: 1000,//недостаточно памяти при количестве вершин равном 500000

		//при количестве вершин равном 124875 получаю предупреждение:
		//ID3D12Device:: GetDeviceRemovedReason failed with DXGI_ERROR_DEVICE_HUNG(0x887A0006)
		//    - While handling unexpected error type Internal when allowed errors are(Validation|DeviceLost).
		//		at CheckHRESULTImpl(..\..\third_party\dawn\src\dawn\native\d3d\D3DError.cpp: 121)
		//
		//Backend messages:
		//* Device removed reason: DXGI_ERROR_DEVICE_HUNG(0x887A0006).
		//
		//В этом случае надо добавить TdrDelay в реестр Windows
		//marks: 250,

		//Для тестирования GPU при условии, что adapter.requestDevice() вызывается без аргуметов.
		//В этом случае базовый лимит WebGPU по умолчанию для всех устройств в мире равен 268435456 (256 MB).
		//Выделяется максимально возможное количество памяти при количестве вершин равном 124875.
		//В настояшее время я выделяю памяти больше базового лимита. Смотри async function initWebGPU(idx) в D:\My documents\MyProjects\webgl\three.js\GitHub\universe\main\hyperSphere\webGPUHUniverse.html
		//marks: 134,

		//min: 1,
		//max: 1,
		//interval: 30,
		/*
		intervalOptions: {

			//min: 0,
			max: 10,//Infinity,

		},
		*/

	}
}
const loadPositions = async () => {
	const geometry = classSettings.settings.object.geometry;
	if (!geometry.positionsFileName) return;
	const THREE = window.__myThree__.three.THREE;
	try {
		// Получаем массив координат из файла
		const positions = await fileHandler.loadBinary('./' + geometry.positionsFileName)
		const timesCount = myThreeOptions.playerOptions.marks === undefined ? 10 : myThreeOptions.playerOptions.marks,
			itemSize = 4,
			verticesCount = positions.length / itemSize,
			positionLengt = verticesCount * timesCount;
		const bufferGeometry =
			//undefined;
			//	new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(positionLengt * itemSize).fill(1, 0, itemSize * verticesCount), itemSize));
			new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(positionLengt * itemSize), itemSize));
		/*
		classSettings.settings.bufferGeometry = bufferGeometry;
		if (classSettings.settings.bufferGeometry && classSettings.settings.bufferGeometry.attributes.position)
			delete classSettings.settings.object.geometry.angles;
		*/
		if (bufferGeometry) {
			const positionsArray = bufferGeometry.attributes.position.array;
			for (let i = 0; i < positions.length; i++)
				positionsArray[i] = positions[i];
			delete geometry.angles;
			geometry.angles = [];
			for (let verticeId = 0; verticeId < verticesCount; verticeId++)
				geometry.angles.push(utils.cartesianToPolar(new THREE.Vector4().fromBufferAttribute(bufferGeometry.attributes.position, verticeId), true));
		}

	} catch (error) {
		let errorMessage = 'Failed to load: ' + error, sHelp = '';
		switch (error.code) {
			case 404: sHelp =
				`<!-- white-space: nowrap запрещает перенос строк, заставляя окно растягиваться -->
<ul style="padding-left: 20px; line-height: 1.6; white-space: nowrap;">
    <li>Rename file name in <b>classSettings.settings.object.geometry.positionsFileName</b>.</li>
    <li>Select <b>"`+ error.baseUrl + `"</b> folder.<br>Go to <b>Settings/Hypersphere/Save</b> in the right top corner of the canvas for it.</li>
</ul>`;
		}
/*
		function showAutoWidthModal() {
			const dialog = document.createElement('dialog');

			// Базовые стили для аккуратного вида
			dialog.style.padding = '20px';
			dialog.style.borderRadius = '8px';
			dialog.style.border = '1px solid #ccc';
			dialog.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';

			// ВАЖНО: убираем ограничение maxWidth и ставим width: max-content
			dialog.style.width = 'max-content';
			dialog.style.maxWidth = '90vw'; // Защита от выхода за границы экрана (90% ширины экрана)

			dialog.innerHTML = `
<h3 style="margin-top: 0; color: #333;">` + errorMessage + `</h3>
`+ sHelp + `
    
<div style="text-align: right; margin-top: 15px;">
    <button id="closeModalBtn" style="padding: 6px 12px; cursor: pointer;">Close</button>
</div>
`;

			document.body.appendChild(dialog);

			dialog.querySelector('#closeModalBtn').addEventListener('click', () => {
				dialog.close();
				dialog.remove();
			});

			dialog.showModal();
		}

		// Запуск функции
		showAutoWidthModal();
*/
		// Возвращаем Promise, чтобы await приостанавливал выполнение loadPositions
		function showAutoWidthModal() {
			return new Promise((resolve) => {
				const dialog = document.createElement('dialog');

				// Базовые стили для аккуратного вида
				dialog.style.padding = '20px';
				dialog.style.borderRadius = '8px';
				dialog.style.border = '1px solid #ccc';
				dialog.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';

				// ВАЖНО: убираем ограничение maxWidth и ставим width: max-content
				dialog.style.width = 'max-content';
				dialog.style.maxWidth = '90vw'; // Защита от выхода за границы экрана (90% ширины экрана)

				dialog.innerHTML = `
<h3 style="margin-top: 0; color: #333;">` + errorMessage + `</h3>
`+ sHelp + `
    
<div style="text-align: right; margin-top: 15px;">
    <button id="closeModalBtn" style="padding: 6px 12px; cursor: pointer;">Close</button>
</div>
`;

				document.body.appendChild(dialog);

				dialog.querySelector('#closeModalBtn').addEventListener('click', () => {
					dialog.close();
					dialog.remove();
					resolve(); // <-- РАЗРЕШАЕМ Promise ТОЛЬКО ПРИ НАЖАТИИ КНОПКИ
				});

				dialog.showModal();
			});
		}

		// Ждем, пока пользователь нажмет "CLOSE"
		await showAutoWidthModal();
	}
	/*	
		const verticesCount = 5,
			timesCount = myThreeOptions.playerOptions.marks === undefined ? 10 : myThreeOptions.playerOptions.marks,
			positionLengt = verticesCount * timesCount,
			itemSize = 4;
	*/

}
export { classSettings, myThreeOptions, loadPositions };