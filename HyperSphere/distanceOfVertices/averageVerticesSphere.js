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
В полярной системе координат latitude - широта  меняется в диапазоне от -π/2 до π/2 и longitude - долгота в диапазоне от -π до π.
В декартовой системе координат ось z проходит через северный и южный полюс.
Не вращать сцену во время рендеринга.
Переименовать массив точек в полярных координатах из vertices в angles
	*/
	//https://chat.deepseek.com/a/chat/s/e808c17c-8258-4029-b70c-d65be630df03

/*	
	//angles.length REPULSION_STRENGTH
	//3             0.05
	//1000          0.0001
//	const a = (0.05 + 0.0001) / (3 + 1000), b = a * 1000 - 0.0001, REPULSION_STRENGTH = a * angles.length + b;//0.0001;//0.05; // Сила отталкивания. Чем меньше значение, тем слабее силы отталкивания между точками, и тем медленнее они двигаются
*/
	//angles.length REPULSION_STRENGTH
	//0             0.05
	//1000          0.0001
	const a = (0.0001 - 0.05) / 1000, b = 0.05, REPULSION_STRENGTH = a * angles.length + b;//0.0001;//0.05; // Сила отталкивания. Чем меньше значение, тем слабее силы отталкивания между точками, и тем медленнее они двигаются
	const DAMPING = 0.95; // Демпфирование движения
	const RADIUS = data.this.r; // Радиус сферы

	// Скорости точек (для инерции)
	let velocities = [];
	
	// Инициализируем скорости
	velocities = new Array(angles.length).fill(null).map(() => ({ x: 0, y: 0, z: 0 }));

/*	
	// Преобразование полярных координат в декартовы
	// Ось Z направлена через полюса, широта от -π/2 до π/2, долгота от -π до π
	function polarToCartesian(latitude, longitude) {
		return {
			x: RADIUS * Math.cos(latitude) * Math.cos(longitude),
			y: RADIUS * Math.cos(latitude) * Math.sin(longitude),
			z: RADIUS * Math.sin(latitude)
		};
	}

	// Преобразование декартовых координат в полярные
	function cartesianToPolar(x, y, z) {
		const r = Math.sqrt(x * x + y * y + z * z);
		const latitude = Math.asin(z / r); // z - высота (ось через полюса)
		const longitude = Math.atan2(y, x); // y/x для долготы
		return {
			latitude: latitude,
			longitude: longitude
		};
	}

	// Нормализация точки на сфере
	function normalizeToSphere(x, y, z) {
		const r = Math.sqrt(x * x + y * y + z * z);
		return {
			x: (x / r) * RADIUS,
			y: (y / r) * RADIUS,
			z: (z / r) * RADIUS
		};
	}
*/
	
	// --- Итерационный процесс движения точек ---
	function iterationStep() {
		
//		if (!isAnimating) return;

		// Вычисляем силы отталкивания для каждой точки
		const forces = new Array(angles.length).fill(null).map(() => ({ x: 0, y: 0, z: 0 }));
		let timestamp = classSettings.debug ? window.performance.now() : undefined;

		// Для каждой пары точек
		for (let i = 0; i < angles.length; i++) {
			
//			const pos1 = polarToCartesian(angles[i].latitude, angles[i].longitude);
			const pos1 = position[i];

			for (let j = i + 1; j < angles.length; j++) {
				
//				const pos2 = polarToCartesian(angles[j].latitude, angles[j].longitude);
				const pos2 = position[j];

				// Вектор от i к j
				let dx = pos1.x - pos2.x;
				let dy = pos1.y - pos2.y;
				let dz = pos1.z - pos2.z;

				const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

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
		if (classSettings.debug) classSettings.debug.logTimestamp('Для каждой пары точек. ', timestamp);
		timestamp = classSettings.debug ? window.performance.now() : undefined;

		// Применяем силы к точкам
		for (let i = 0; i < angles.length; i++) {
			
//			const pos = polarToCartesian(angles[i].latitude, angles[i].longitude);
			const pos = position[i];

			// Обновляем скорость с учетом силы и демпфирования
			velocities[i].x = velocities[i].x * DAMPING + forces[i].x;
			velocities[i].y = velocities[i].y * DAMPING + forces[i].y;
			velocities[i].z = velocities[i].z * DAMPING + forces[i].z;

/*			
			// Обновляем позицию
			let newX = pos.x + velocities[i].x;
			let newY = pos.y + velocities[i].y;
			let newZ = pos.z + velocities[i].z;
			
			// Нормализуем на сферу
			const normalized = normalizeToSphere(newX, newY, newZ);

			// Преобразуем обратно в полярные координаты
			const polar = cartesianToPolar(normalized.x, normalized.y, normalized.z);
			angles[i] = polar;
*/			
			angles[i] = utils.casterianToAngles({ x: pos.x + velocities[i].x, y: pos.y + velocities[i].y, z: pos.z + velocities[i].z });
/*			
			angles[i].latitude = polar.latitude;
			angles[i].longitude = polar.longitude;
*/			
		}
		if (classSettings.debug) classSettings.debug.logTimestamp('Применяем силы к точкам. ', timestamp);
/*
		// Обновляем визуализацию
		updateVisualization();

		iteration++;
		document.getElementById('iteration').innerHTML = `Итерация: ${iteration}`;
*/
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

				if (classSettings.debug) classSettings.debug.logTimestamp('Play step. Average vertices.', timestamp);

				//Обновление текущей вершины без обновления холста для экономии времени
//				overriddenProperties.updateVertices(vertices);

/*				
				if (classSettings.debug) {

					classSettings.debug.logTimestamp('Average vertices. ', timestamp);
					_this.logHyperSphere();

				}
				else _this.oldR = undefined;
*/
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