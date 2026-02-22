/**
 * @module middleVerticesSphere
 * @description An iterative process in which, at each step, all vertices gradually move toward a position in which the vertices are at the maximum distance from each other.
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
import * as utils from '../utilsSphere.js'
import ProgressBar from '../../ProgressBar/ProgressBar.js'

const averageVertices = (data) => {

	const _this = data.this,
		classSettings = _this.classSettings,
		overriddenProperties = classSettings.overriddenProperties,
		vertices = overriddenProperties.vertices(),
		angles = classSettings.settings.object.geometry.angles,
		position = classSettings.settings.bufferGeometry.userData.position,
//		vertices = overriddenProperties.position0.angles;
		options = data.options,
		t = data.t;
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
	*/
	//https://chat.deepseek.com/a/chat/s/e808c17c-8258-4029-b70c-d65be630df03
	
	const REPULSION_STRENGTH = 0.05; // Сила отталкивания
	const DAMPING = 0.95; // Демпфирование движения
	const RADIUS = data.this.r; // Радиус сферы

	// Скорости точек (для инерции)
	let velocities = [];
	
	// Инициализируем скорости
	velocities = new Array(angles.length).fill(null).map(() => ({ x: 0, y: 0, z: 0 }));

	// Нормализация точки на сфере
	function normalizeToSphere(x, y, z) {
		const r = Math.sqrt(x*x + y*y + z*z);
		return {
			x: (x / r) * RADIUS,
			y: (y / r) * RADIUS,
			z: (z / r) * RADIUS
		};
	}
/*	
// Преобразование полярных координат в декартовы
function polarToCartesian(latitude, longitude) {
	return {
		x: RADIUS * Math.cos(latitude) * Math.cos(longitude),
		y: RADIUS * Math.sin(latitude),
		z: RADIUS * Math.cos(latitude) * Math.sin(longitude)
	};
}

// Преобразование декартовых координат в полярные
function cartesianToPolar(x, y, z) {
	const r = Math.sqrt(x*x + y*y + z*z);
	const latitude = Math.asin(y / r);
	const longitude = Math.atan2(z, x);
	return {
		latitude: latitude,
		longitude: longitude
	};
}
*/	
	//В полярной системе координат перепутаны оси y и z.
	const swapAxes = (pos) => { return { x: pos.x, y: pos.z, z: pos.y,} }
	
	// --- Итерационный процесс движения точек ---
	function iterationStep() {
		
//		if (!isAnimating) return;

		// Вычисляем силы отталкивания для каждой точки
		const forces = new Array(angles.length).fill(null).map(() => ({ x: 0, y: 0, z: 0 }));

		// Для каждой пары точек
		for (let i = 0; i < angles.length; i++) {

//const pos2 = polarToCartesian(angles[i].latitude, angles[i].longitude);
//			const pos1 = angles[i];
			
//			if (timeId === undefined) timeId = playerIndexCur;
//			userData.timeId = timeId;
			const pos1 = swapAxes(position[i]);
//			userData.timeId = playerIndexCur;

			for (let j = i + 1; j < angles.length; j++) {
				
//const pos2 = polarToCartesian(angles[j].latitude, angles[j].longitude);
				const pos2 = swapAxes(position[j]);

				// Вектор от i к j
				let dx = pos1.x - pos2.x;
				let dy = pos1.y - pos2.y;
				let dz = pos1.z - pos2.z;

				const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);

				if (dist < 0.001) continue;

				// Сила обратно пропорциональна расстоянию
				const forceMagnitude = REPULSION_STRENGTH / (dist * dist);

				// Нормализуем вектор
				dx /= dist;
				dy /= dist;
				dz /= dist;

				// Применяем силу: отталкивание
				forces[i].x += dx * forceMagnitude;
				forces[i].y += dy * forceMagnitude;
				forces[i].z += dz * forceMagnitude;

				forces[j].x -= dx * forceMagnitude;
				forces[j].y -= dy * forceMagnitude;
				forces[j].z -= dz * forceMagnitude;
			}
		}

		// Применяем силы к точкам
		for (let i = 0; i < angles.length; i++) {
			
//const pos = polarToCartesian(angles[i].latitude, angles[i].longitude);
			const pos = swapAxes(position[i]);

			// Обновляем скорость с учетом силы и демпфирования
			velocities[i].x = velocities[i].x * DAMPING + forces[i].x;
			velocities[i].y = velocities[i].y * DAMPING + forces[i].y;
			velocities[i].z = velocities[i].z * DAMPING + forces[i].z;

			// Обновляем позицию
			let newX = pos.x + velocities[i].x;
			let newY = pos.y + velocities[i].y;
			let newZ = pos.z + velocities[i].z;

			// Нормализуем на сферу
			const normalized = normalizeToSphere(newX, newY, newZ);
			
// Преобразуем обратно в полярные координаты
//const polar = cartesianToPolar(normalized.x, normalized.y, normalized.z);
			const polar = utils.casterianToAngles(swapAxes(normalized));
//			vertices.push(polar);
			angles[i] = polar;
/*			
			angles[i].latitude = polar.latitude;
			angles[i].longitude = polar.longitude;
*/			
console.log('qqqqq')
			
		}
		classSettings.settings.object.geometry.angles.needsUpdate;
		
	}
	let progressBar, verticeId = 0;
	const timestamp = classSettings.debug ? window.performance.now() : undefined,
		step = () => {

		progressBar.value = verticeId;
		const stepItem = () => {

			iterationStep();
			verticeId += 1;
			if (verticeId >= 0) {

				progressBar.remove();

				if (classSettings.debug) classSettings.debug.logTimestamp('Play step. ', timestamp);

				//Обновление текущей вершины без обновления холста для экономии времени
//				overriddenProperties.updateVertices(vertices);

				if (classSettings.debug) {

					classSettings.debug.logTimestamp('Copy vertices. ', timestamp);
					_this.logHyperSphere();

				}
				else _this.oldR = undefined;
				_this.onSelectSceneEnd(data.timeId);
				return true;

			}

		}
		if (!stepItem()) progressBar.step();

	};
	progressBar = new ProgressBar(options.renderer.domElement.parentElement, step, {

		sTitle: 't = ' + t + '<br> Average vertices',
		max: position.length - 1,

	});
	
}
averageVertices.verticeProxy = (vertice) => { return vertice; }
export default averageVertices;