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
import * as utils from '../../HyperSphere/utilsHSphere.js'

const sAverageVertices = 'averageVertices', π = Math.PI;
let velocities;

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
	data.this.r; // Радиус сферы. Нужно что бы во вселенной в classSettings.settings.object.geometry.times был добавлен новый time. Это нужно что бы пользователь мышкой мог выбрать вершину в вселенной

	const positionBlockLength = angles.length;	
	const itemSize = overrides.itemSize;

	// Выделяем память под скорости и силы на основе длины блока и размера элемента
	if (!velocities) velocities = new Float32Array(positionBlockLength * itemSize);//{x: 0, y: 0, z: 0, w: 0 }
	/**
	 * Извлечение скорости одной точки из velocities по её индексу
	 * @param {number} index интекс точки
	 * @returns скорость в формате x, y, z, w
	 */
	const getVelocity = (index) => { return overrides.getPoint(index, velocities); };
	
	// Выделяем память под силы
	const forces = new Float32Array(positionBlockLength * itemSize);
	/**
	 * Извлечение силы одной точки из forces по её индексу
	 * @param {number} index интекс точки
	 * @returns скорость в формате x, y, z, w
	 */
	function getForce(index) { return overrides.getPoint(index, forces); }

	const positionArray = position.array;
	/**
	 * Извлечение координат одной точки из positionArray по её индексу
	 * @param {number} i интекс точки
	 * @param {number} [timeId = data.timeId] интекс времени или интекс текущей итерации
	 * @returns скорость в формате x, y, z, w
	 */
	function getPoint(i, timeId = data.timeId) {
		const overriddenProperties = data.this.classSettings.overriddenProperties;
		return overriddenProperties.getVerticePosition(i, overriddenProperties.getPositionTimeId(timeId));
//		return overrides.getPoint(index, positionArray);
	}

	function verifyVertice(pt, targetRadius, epsilon = 1e-6) {
		if (!settings.debug) return;
		const dist = overrides.dist(pt);
//			const dist = Math.hypot(pt.x, pt.y, pt.z, pt.w);

		if (Math.abs(dist - targetRadius) > epsilon) {
			console.warn(`Точка отклонилась от гиперсферы! R = ${dist}, ожидалось = ${targetRadius}`);
			return false;
		}
		return true;
	}
	/**
	 * Проверка принадлежности точек из глобального positionArray гиперсфере заданной с определенной точностью
	 */
	function verifyHyperSphere(targetRadius) {
		if (!settings.debug) return;
		for (let i = 0; i < positionBlockLength; i++) {
			if (!verifyVertice(getPoint(i, data.timeId - 1), targetRadius)) return false;
/*			
			const pt = getPoint(i, data.timeId - 1);
			const dist = overrides.dist(pt);
//			const dist = Math.hypot(pt.x, pt.y, pt.z, pt.w);

			if (Math.abs(dist - targetRadius) > epsilon) {
				console.warn(`Точка #${i} отклонилась от гиперсферы! R = ${dist}, ожидалось = ${targetRadius}`);
				return false;
			}
*/			
		}
		return true;
	}
	verifyHyperSphere(classSettings.overriddenProperties.rTime(data.timeId - 1));
/*сейчас цвета устанавливаются в universe.js
	const colors = [];
	
	for (let timeId = 1; timeId < options.playerOptions.marks; timeId++) {
		const verticeColor = settings.object.color(timeId), wScale = settings.options.scales.w;
		colors.push(settings.options.palette.toColor(verticeColor, wScale.min, wScale.max));
	}
*/	

	const THREE = window.__myThree__.three.THREE;

	const isGetSPositionArray = false;
	if (isGetSPositionArray) {
		//Делаем строку, которую удобно будет использовать для создания массива цветов в зависимости от текущего времени на странице http://localhost/anhr/universe/main/hyperSphere/Examples/tomsonExample.html
		const sColors = '[' + colors.map(color => {
			const properties = Object.entries(color).map(([key, value]) => `${key}: ${value}`).join(', ');
			return `{${properties}},`;
		}).join('\n') + ']'; // Соединяем объекты через перенос строки для читаемости
		console.log('sColors: ' + sColors);
	
		//Делаем строку, которую удобно будет использовать для создания массива розиций на странице http://localhost/anhr/universe/main/hyperSphere/Examples/tomsonExample.html
		const positionArray = settings.bufferGeometry.attributes.position.array;
		let sPositionArray = '[\n';
		for (let i = 0, line = 0; i < positionArray.length; i++, line++) {
			sPositionArray += positionArray[i] + ',';
			if (line >= 3) {
				line = -1;
				sPositionArray += '\n';
			}
		}
		sPositionArray += '\n]';
		console.log('sPositionArray: ' + sPositionArray);
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

		// 1. In-place масштабирование скоростей при изменении радиуса пространства
		for (let k = 0; k < velocities.length; k++) {
			velocities[k] *= rRatio;
		}

		// Динамический шаг ETA
//		const eta = (config.ETA_0 != undefined ? config.ETA_0 : 0.01) * 
		const eta = config.ETA_0 * 
			Math.pow(_this.classSettings.overriddenProperties.rTime(_this.classSettings.settings.bufferGeometry.userData.timeId - 1), 3);
		forces.fill(0); // Сброс сил перед новым шагом
		const RandomVertice = overrides.RandomVertice;
		const step = () => {
			
			progressBar.value = i;
			const pi = settings.overriddenProperties.position(position, i, userData);
			for (
				let j = i + 1;
				j < positionBlockLength; j++) {
				
				if (i === j) continue;
				const pj = settings.overriddenProperties.position(position, j, userData);
//				const angles2 = utils.cartesianToPolar(p2);

				// Вектор от i к j
				let d = overrides.d(pi, pj);//{ return {x: p1.x - p2.x, y: p1.y - p2.y, z: p1.z - p2.z, w: p1.w - p2.w} },
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
					const noisej = utils.polarToCartesian(RandomVertice.get(arc, utils.angles(overrides.angles(angles2)), classSettings, RandomVertice), r);
					
					if (settings.guiPoints) settings.guiPoints.timeId = timeIdOld;
					userData.timeId++;
	
					// Вектор от i к j
					d = overrides.d(pi, noisej);//{ return {x: p1.x - p2.x, y: p1.y - p2.y, z: p1.z - p2.z, w: p1.w - p2.w} },
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
				overrides.setForse(forces, d, m, i * itemSize);//{ force.x += d.x * m; force.y += d.y * m; force.z += d.z * m; force.w += d.w * m; },
				
				// Применяем протипоположную силу к точке j (3-й закон Ньютона)
				overrides.setForse(forces, d, -m, j * itemSize);//{ force.x += d.x * m; force.y += d.y * m; force.z += d.z * m; force.w += d.w * m; },

			}

//			overrides.setVelocities(forces[i], config.DAMPING, force);
			
//			anglesTemp[i] = utils.cartesianToPolar(overrides.vertice(p1, forces[i]));
			
			i += 1;
			if (i >= angles.length) {

				progressBar.remove();

				// Применяем силы к точкам
//				const color = colors[data.timeId - 1];
				//console.log('timeId = ' + data.timeId + ', ', color);
				// 3. Обновление скоростей и позиций in-place прямо в глобальном positionArray
				for (let i = 0; i < positionBlockLength; i++) {

					//устанавливаем новую позицию вершины без преобразования ее в полярную систему коодинат.
					//Это не вызывает накопление погрешности, потому что в overrides.forceVertice используется нормализация вектора и его проекции обратно на гиперсферу радиусом R.
					overrides.forceVertice(getPoint(i, data.timeId - 1), getPoint(i), getForce(i), eta, getVelocity(i), classSettings.compute.config.BETA, verifyVertice);
//					Player.setColorAttribute(settings.bufferGeometry.attributes, i + positionBlockLength * data.timeId, color);
/*					
console.warn('Under constraction')						
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