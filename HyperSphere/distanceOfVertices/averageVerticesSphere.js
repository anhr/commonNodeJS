/**
 * @module averageVerticesSphere
 * @description An iterative process in which, at each step, all vertices gradually move toward a position in which the vertices are at the maximum distance from each other on the sphere.
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
import averageVerticesBase from './averageVertices.js'
import * as utils from '../utilsSphere.js'
import { RandomVerticeSphere as RandomVertice } from '../RandomVertice/randomVerticeSphere.js';
/*
import ProgressBar from '../../ProgressBar/ProgressBar.js'

const sAverageVertices = 'averageVertices', π = Math.PI;

// Скорости точек (для инерции)
let velocities = [];
*/
const averageVertices = (data) => {

	averageVerticesBase(data, {

		a: 0.5,
		velocitiesInitValues: () => { return {x: 0, y: 0, z: 0 }; },
		setVelocities: (velociti, DAMPING, force) => {
			
			velociti.x = velociti.x * DAMPING + force.x;
			velociti.y = velociti.y * DAMPING + force.y;
			velociti.z = velociti.z * DAMPING + force.z;
			
		},
		anglesInitValues: [0, 0],
		utils: utils,
		RandomVertice: RandomVertice,
		p: 0.99,//Hyperbola parametr. See RandomVertice.calculateHyperbola
		force: () => { return {x: 0, y: 0, z: 0 }; },
		setForse: (force, d, dist, m) => { force.x += (d.x / dist) * m; force.y += (d.y / dist) * m; force.z += (d.z / dist) * m; },
		d: (p1, p2) => { return {x: p1.x - p2.x, y: p1.y - p2.y, z: p1.z - p2.z} },
		d2: (d) => { return d.x * d.x + d.y * d.y + d.z * d.z },
		angles: (angles) => { return [angles[0], angles[1]]; },
		
	});
/*
	const _this = data.this,
		classSettings = _this.classSettings,
		settings = classSettings.settings,
//		overriddenProperties = classSettings.overriddenProperties,
		angles = settings.object.geometry.angles,
//		userData = settings.bufferGeometry.userData,
		position = classSettings.settings.bufferGeometry.userData.position,
		options = data.options,
		t = data.t;
*/
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
	//20             0.05
	//1000          0.0001
	//5000          0.00001
	const a = 0.5;
	const REPULSION_STRENGTH = a / angles.length;//0.05; // Сила отталкивания. Чем меньше значение, тем слабее силы отталкивания между точками, и тем медленнее они двигаются
	const DAMPING = 0.95; // Демпфирование движения
	data.this.r; // Радиус сферы. Нужно что бы во вселенной в classSettings.settings.object.geometry.times был добавлен новый time. Это нужно что бы пользователь мышкой мог выбрать вершину в вселенной

	// Инициализируем скорости
	if (velocities.length === 0) velocities = new Array(angles.length).fill(null).map(() => ({ x: 0, y: 0, z: 0 }));

	
	// --- Итерационный процесс движения точек ---
	function iterationStep() {
		
		// Вычисляем силы отталкивания для каждой точки
		const forces = new Array(angles.length).fill(null).map(() => ({ x: 0, y: 0, z: 0 }));
		let timestamp = classSettings.debug ? window.performance.now() : undefined;

		// Для каждой пары точек
		let progressBar, i = 0;// verticeId = 0;
		const step = () => {
			
			progressBar.value = i;
			const userData = settings.bufferGeometry.userData;
			const pos1 = settings.overriddenProperties.position(position, i, userData);
			const angles1 = utils.cartesianToAngles(pos1);

			let pos2, angles2;
			for (let j = i + 1; j < angles.length; j++) {
				
				if (!pos2) {
					
					pos2 = settings.overriddenProperties.position(position, j, userData);
					angles2 = utils.cartesianToAngles(pos2);

				}

				// Вектор от i к j
				let dx = pos1.x - pos2.x;
				let dy = pos1.y - pos2.y;
				let dz = pos1.z - pos2.z;

				let dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

				const arc = π - hyperbola((dist / classSettings.overriddenProperties.r(settings.bufferGeometry.userData.timeId - 1) / 2) * π);
				userData.timeId--;//Во вселенной углы берутся из предыдушего шага проигрывателя
				const timeIdOld = settings.guiPoints ? settings.guiPoints.timeId : undefined;
				if (settings.guiPoints) settings.guiPoints.timeId = userData.timeId;
				const r = classSettings.overriddenProperties.rTime();
				
				// Случайное направление для точки i
				const noise1 = utils.anglesToCartesian(RandomVertice.get(arc, utils.angles([angles1[0], angles1[1]]), classSettings, RandomVertice), r);
					
				// Случайное направление для точки j (может быть противоположным для лучшего разведения)
				const noise2 = utils.anglesToCartesian(RandomVertice.get(arc, utils.angles([angles2[0], angles2[1]]), classSettings, RandomVertice), r);
				if (settings.guiPoints) settings.guiPoints.timeId = timeIdOld;
				userData.timeId++;

				// Применяем шум к позициям через скорости
				const antiDist = arc / π;
				if(antiDist < 0) console.error(sAverageVertices + ': iterationStep. Invalid antiDist = ' + antiDist);
				velocities[i].x += noise1.x * antiDist;
				velocities[i].y += noise1.y * antiDist;
				velocities[i].z += noise1.z * antiDist;
				
				velocities[j].x += noise2.x * antiDist;
				velocities[j].y += noise2.y * antiDist;
				velocities[j].z += noise2.z * antiDist;

				// Вектор от i к j
				dx = noise1.x - noise2.x;
				dy = noise1.y - noise2.y;
				dz = noise1.z - noise2.z;

				dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
				pos2 = undefined;
				
				// Сила обратно пропорциональна расстоянию
				const forceMagnitude = REPULSION_STRENGTH / (dist * dist);

				// Нормализуем вектор
				dx /= dist;
				dy /= dist;
				dz /= dist;

				const forcei = forces[i], forcesj = forces[j];

				// Применяем силу: отталкивание
				forcei.x += dx * forceMagnitude;
				forcei.y += dy * forceMagnitude;
				forcei.z += dz * forceMagnitude;

				forcesj.x -= dx * forceMagnitude;
				forcesj.y -= dy * forceMagnitude;
				forcesj.z -= dz * forceMagnitude;

			}
			i += 1;
			if (i >= angles.length) {

				progressBar.remove();

				if (classSettings.debug) classSettings.debug.logTimestamp('Play step. Average vertices. ', timestamp);

				// Применяем силы к точкам
				for (let i = 0; i < angles.length; i++) {

					const pos = settings.overriddenProperties.position(position, i, userData);
					const velocitie = velocities[i],
						force = forces[i];

					// Обновляем скорость с учетом силы и демпфирования
					velocitie.x = velocitie.x * DAMPING + force.x;
					velocitie.y = velocitie.y * DAMPING + force.y;
					velocitie.z = velocitie.z * DAMPING + force.z;

					const vertice = utils.cartesianToAngles({ x: pos.x + velocitie.x, y: pos.y + velocitie.y, z: pos.z + velocitie.z });
					settings.overriddenProperties.editVertice(data.timeId, vertice, angles, i);

				}

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
*/
	
}
/*
const hyperbola = RandomVertice.calculateHyperbola(0.99);
averageVertices.verticeProxy = (vertice) => { return vertice; }
*/
averageVertices.verticeProxy = averageVerticesBase.verticeProxy;
export default averageVertices;