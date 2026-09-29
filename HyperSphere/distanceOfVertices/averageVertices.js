/**
 * @module averageVertices
 * @description An iterative process in which, at each step, all vertices gradually move toward a position in which the vertices are at the maximum distance from each other.
 * See [Thomson Problem]{@link https://en.wikipedia.org/wiki/Thomson_problem}.
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

import ProgressBar from '../../ProgressBar/ProgressBar.js'
import Player from '../../player/player.js'

const sAverageVertices = 'averageVertices', π = Math.PI;

//силы отталкивания
//let forces = [];

/**
 * Base function for an iterative process in which, at each step, all vertices gradually move toward a position in which the vertices are at the maximum distance from each other.
 * See [Thomson Problem]{@link https://en.wikipedia.org/wiki/Thomson_problem}.
 * @param {Object} data averageVertices data
 * @param {Object} data.options See the <b>options</b> parameter of the <a href="../../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
 * @param {float} data.t Current time.
 * @param {number} data.timeId player time id.
 * @param {Object} data.this n dimensional <a href="../../../HyperSphere/jsdoc/module-HyperSphere-HyperSphere.html" target="_blank">hypersphere</a> graphical object.
 * @param {Object} overrides overridden functions
 */
const averageVertices = (data, overrides) => {

	const _this = data.this, classSettings = _this.classSettings, config = classSettings.compute.config;
	const settings = classSettings.settings,
		angles = settings.object.geometry.angles,
		position = classSettings.settings.bufferGeometry.userData.position,
		options = data.options,
		t = data.t,
		hyperbola = overrides.RandomVertice.calculateHyperbola(config.p);//overrides.p);
	/*
Написать функцию на языке javascript.
Задан массив : const angles = [].
В этот массив добавить несколько  точек, случайно расположенных на поверхности сферы в полярной системе координат. Начало координат находится в центре сферы.
Каждая точка имеет вид: const angles = {
   latitude: latitude,//широта в диапазоне от -π/2 до π/2
   longitude: longitude//долгота в диапазоне от -π до π
}
Количество точек задано параметром функции verticesCount.
Разработать итерационный процесс, на каждом шаге которого все точки постепенно движутся в положение, при котором точки окажутся на максимальном удалении друг от друга.
Создать веб страницу, на которой будет визуально отображаться движение точек в процессе итерации.
На веб странице использовать библиотеку three.js для визуализации движения точек.
В полярной системе координат latitude - широта  меняется в диапазоне от -π/2 до π/2 и longitude - долгота в диапазоне от -π до π.
В декартовой системе координат ось z проходит через северный и южный полюс.
Не вращать сцену во время рендеринга.
Переименовать массив точек в полярных координатах из vertices в angles
	*/
	//https://chat.deepseek.com/a/chat/s/e808c17c-8258-4029-b70c-d65be630df03
/*
https://chat.deepseek.com/share/3c99m2cgtvacj7e5on
Заменить сферу на гиперсферу в 4D простанстве.
Тогда каждая точка имеет вид: const angles = {
   latitude: latitude,//широта в диапазоне от -π/2 до π/2
   longitude: longitude//долгота в диапазоне от -π до π
   altitude: altitude//в диапазоне от 0 до π
}
*/	

/*	
	//angles.length REPULSION_STRENGTH
	//3             0.05
	//1000          0.0001
//	const a = (0.05 + 0.0001) / (3 + 1000), b = a * 1000 - 0.0001, REPULSION_STRENGTH = a * angles.length + b;//0.0001;//0.05; // Сила отталкивания. Чем меньше значение, тем слабее силы отталкивания между точками, и тем медленнее они двигаются
*/
	//angles.length REPULSION_STRENGTH
	//20             0.05
	//1000          0.0001
	//5000          0.00001
//	const a = overrides.a;//0.5;
//	if (config.REPULSION_STRENGTH === undefined) config.REPULSION_STRENGTH = a / angles.length;// Сила отталкивания. Чем меньше значение, тем слабее силы отталкивания между точками, и тем медленнее они двигаются
//	const REPULSION_STRENGTH = a / angles.length;//0.05; // Сила отталкивания. Чем меньше значение, тем слабее силы отталкивания между точками, и тем медленнее они двигаются
//	const DAMPING = 0.95; // Демпфирование движения
	data.this.r; // Радиус сферы. Нужно что бы во вселенной в classSettings.settings.object.geometry.times был добавлен новый time. Это нужно что бы пользователь мышкой мог выбрать вершину в вселенной

	// Инициализируем силы ооталкивания
	//if (forces.length === 0) forces = new Array(angles.length).fill(null).map(() => (overrides.velocitiesInitValues()));

	const N = angles.length;	
	const velocities = Array.from({ length: N }, () => (overrides.velocitiesInitValues()));//{x: 0, y: 0, z: 0, w: 0 }
	const colors = [];
	
	for (let timeId = 1; timeId < options.playerOptions.marks; timeId++) {
		const verticeColor = settings.object.color(timeId), wScale = settings.options.scales.w;
		colors.push(settings.options.palette.toColor(verticeColor, wScale.min, wScale.max));
	}

	// --- Итерационный процесс движения точек ---
	function iterationStep() {

//		const anglesTemp = new Array(angles.length).fill(null).map(() => (overrides.anglesInitValues));
		
		let timestamp = classSettings.debug ? window.performance.now() : undefined;

		// Для каждой пары точек
		let progressBar, i = 0;
		const userData = settings.bufferGeometry.userData;
		
		// 1. Вычисляем новый радиус на текущем шаге (от 0.1 до 1.0)
/*		
		const nextR = 0.1 + (1.0 - 0.1) * (step / totalSteps);
		const rRatio = nextR / currentR; // Коэффициент масштабирования пространства
*/
		const currentR = classSettings.overriddenProperties.rTime(data.timeId - 1);
		const nextR = classSettings.overriddenProperties.rTime();
		const rRatio = nextR / currentR; // Коэффициент масштабирования пространства

		// Масштабируем прошлую скорость под новый размер пространства
		for (let i = 0; i < N; i++) {
			velocities[i].x *= rRatio;
			velocities[i].y *= rRatio;
			velocities[i].z *= rRatio;
			velocities[i].w *= rRatio;
		}

		// Динамический шаг ETA
		const eta = config.ETA_0 != undefined ? config.ETA_0 * 
			Math.pow(_this.classSettings.overriddenProperties.rTime(_this.classSettings.settings.bufferGeometry.userData.timeId - 1), 3) : undefined;
		const forces = Array.from({ length: N }, () => (overrides.velocitiesInitValues()));//{x: 0, y: 0, z: 0, w: 0 }
		const utils = overrides.utils;
		const RandomVertice = overrides.RandomVertice;
		const step = () => {
			
			progressBar.value = i;
			const p1 = settings.overriddenProperties.position(position, i, userData);

//			const force = overrides.force();
			for (
				let j = i + 1;
				j < N; j++) {
				
				if (i === j) continue;
				const p2 = settings.overriddenProperties.position(position, j, userData);
				const angles2 = utils.cartesianToPolar(p2);

				// Вектор от i к j
				let d = overrides.d(p1, p2);//{ return {x: p1.x - p2.x, y: p1.y - p2.y, z: p1.z - p2.z, w: p1.w - p2.w} },
/*
				const d2 = overrides.d2(d);
				let dist = Math.sqrt(d2);
*/
				if (config.RANDOM_POINTS != 0) {
					//вычисляем случайную точку
					const arc = π - hyperbola((dist / classSettings.overriddenProperties.r(settings.bufferGeometry.userData.timeId - 1) / 2) * π);
					userData.timeId--;//Во вселенной углы берутся из предыдушего шага проигрывателя
					const timeIdOld = settings.guiPoints ? settings.guiPoints.timeId : undefined;
					if (settings.guiPoints) settings.guiPoints.timeId = userData.timeId;
					const r = classSettings.overriddenProperties.rTime();
						
					// Случайное направление для точки j (может быть противоположным для лучшего разведения)
					const noise2 = utils.polarToCartesian(RandomVertice.get(arc, utils.angles(overrides.angles(angles2)), classSettings, RandomVertice), r);
					
					if (settings.guiPoints) settings.guiPoints.timeId = timeIdOld;
					userData.timeId++;
	
					// Вектор от i к j
					d = overrides.d(p1, noise2);//{ return {x: p1.x - p2.x, y: p1.y - p2.y, z: p1.z - p2.z, w: p1.w - p2.w} },
/*
					const d2 = overrides.d2(d);
					dist = Math.sqrt(d2);
*/					
				}
				const d2 = overrides.d2(d);//{ return d.x * d.x + d.y * d.y + d.z * d.z + d.w * d.w },
				const dist = Math.sqrt(d2);
				if (dist === 0) {

					console.error(sAverageVertices + ': step. Invalid dist = ' + dist);
					return;
					
				}
				
				// Сила обратно пропорциональна расстоянию
//				const m = config.REPULSION_STRENGTH / (d2 * dist);
				const m = 1 / (d2 * dist);

				// Применяем силу к точке i (отталкивание от j)
				overrides.setForse(forces[i], d, m);//{ force.x += (d.x / dist) * m; force.y += (d.y / dist) * m; force.z += (d.z / dist) * m; force.w += (d.w / dist) * m; },
				
				// Применяем протипоположную силу к точке j (3-й закон Ньютона)
				overrides.setForse(forces[j], d, -m);//{ force.x += (d.x / dist) * m; force.y += (d.y / dist) * m; force.z += (d.z / dist) * m; force.w += (d.w / dist) * m; },

			}

//			overrides.setVelocities(forces[i], config.DAMPING, force);
			
//			anglesTemp[i] = utils.cartesianToPolar(overrides.vertice(p1, forces[i]));
			
			i += 1;
			if (i >= angles.length) {

				progressBar.remove();

				if (eta) {
					
					// Применяем силы к точкам
					const positionBlockLength = angles.length
					const color = colors[data.timeId - 1];
					//console.log('timeId = ' + data.timeId + ', ', color);
					for (let i = 0; i < positionBlockLength; i++) {

						//устанавливаем новую позицию вершины без преобразования ее в полярную систему коодинат.
						//Это не вызывает накопление погрешности, потому что в overrides.forceVertice используется нормализация вектора и его проекции обратно на гиперсферу радиусом R.
						overrides.forceVertice(settings.overriddenProperties.position(position, i, userData), forces[i], eta, velocities[i], classSettings.compute.config.BETA, i);
						Player.setColorAttribute(settings.bufferGeometry.attributes, i + positionBlockLength * data.timeId, color);
/*						
data.this.setPositionAttributeFromPoint(i, 
	overrides.forceVertice(settings.overriddenProperties.position(position, i, userData), forces[i], eta, velocities[i], classSettings.compute.config.BETA, i),
	data.timeId
);
*/
/*
						const pos = settings.overriddenProperties.position(position, i, userData);
						const force = forces[i];
						const vertice = utils.cartesianToPolar(overrides.forceVertice(pos, force, eta));
						settings.overriddenProperties.editVertice(data.timeId, vertice, angles, i);
*/	
					}
					const attributePosition = settings.bufferGeometry.attributes.position;
					attributePosition.needsUpdate = true;
					const drawRange = settings.bufferGeometry.drawRange;
					data.this.setVerticesRange(drawRange.start, attributePosition.count - drawRange.start);
/*					
					if ((drawRange.count === Infinity) || (((drawRange.start + drawRange.count) * ((settings.bufferGeometry.index === null) ? itemSize : 1)) < positionId)){
		
						this.setVerticesRange(drawRange.start, (positionId + 1) / itemSize - drawRange.start);
						if (!Number.isInteger(drawRange.count) && (drawRange.count != Infinity)) console.error(sMyObject + '.setPositionAttributeFromPoint failed. Invalid drawRange.count = ' + drawRange.count);
		
					}
*/					
				}
				if (classSettings.debug) classSettings.debug.logTimestamp('Play step. Average vertices. ', timestamp);
//				if (angles.length != anglesTemp.length) console.error(sAverageVertices + ': iterationStep. angles.length != anglesTemp.length');
				
				const timeIdOld = settings.guiPoints ? settings.guiPoints.timeId : undefined;
				if (settings.guiPoints) settings.guiPoints.timeId = undefined;
				if (settings.debug && settings.debug.log) {
					for (let i = 0; i < angles.length; i++) {
						const pointCur = settings.bufferGeometry.userData.position[i];
						const pointAngles = utils.cartesianToPolar(pointCur);
						console.log('Step:' + data.timeId + ' Point:' + (data.timeId * angles.length + i) + '. x=' + pointCur.x + ' y=' + pointCur.y + ' z=' + pointCur.z + ' w=' + pointCur.w + ',alt=' + pointAngles.altitude + ' lat=' + pointAngles.latitude + ' lon=' + pointAngles.longitude);
					}
				}
/*
				for (let i = 0; i < angles.length; i++) {
					angles[i] = anglesTemp[i];
					if (settings.debug && settings.debug.log) {
						const pointCur = settings.bufferGeometry.userData.position[i];
						const pointAngles = utils.cartesianToPolar(pointCur);
						console.log('Step:' + data.timeId + ' Point:' + (data.timeId * angles.length + i) + '. x=' + pointCur.x + ' y=' + pointCur.y + ' z=' + pointCur.z + ' w=' + pointCur.w + ',alt=' + pointAngles.altitude + ' lat=' + pointAngles.latitude + ' lon=' + pointAngles.longitude);
					}
				}
*/
				if (settings.guiPoints) settings.guiPoints.timeId = timeIdOld;

				_this.bufferGeometry.attributes.position.needsUpdate = true
				
				_this.onSelectSceneEnd(data.timeId);

			} else progressBar.step();

		}
		progressBar = new ProgressBar(options.renderer.domElement.parentElement, step, {

			sTitle: 't = ' + t + '<br> Average vertices',
			max: settings.object.geometry.angles.length - 1,
			
			//for 1000 vertices:
			//timeoutPeriod: 0,//time: Play step. Average vertices. 5.481899999976158 sec.
			timeoutPeriod: 10,//time: Play step. Average vertices. 1.2975 sec.
			//timeoutPeriod: 100,//time: Play step. Average vertices. 0.9053000000119209 sec.

		});

	}
	iterationStep();
	
}
//const hyperbola = RandomVertice.calculateHyperbola(0.99);
averageVertices.verticeProxy = (vertice) => { return vertice; }
export default averageVertices;