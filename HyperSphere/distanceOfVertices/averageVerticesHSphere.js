/**
 * @module averageVerticesHSphere
 * @description An iterative process in which, at each step, all vertices gradually move toward a position in which the vertices are at the maximum distance from each other on the hypersphere.
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
import * as utils from '../utilsHSphere.js'
import RandomVertice from '../RandomVertice/randomVerticeHSphere.js';
/*
import ProgressBar from '../../ProgressBar/ProgressBar.js'

const sAverageVertices = 'averageVertices', π = Math.PI;

// Скорости точек (для инерции)
let velocities = [];
*/
const averageVertices = (data) => {

	averageVerticesBase(data, {

		a: 50,
		velocitiesInitValues: () => { return {x: 0, y: 0, z: 0, w: 0 }; },
		setVelocities: (velociti, DAMPING, force) => {
			
			velociti.x = velociti.x * DAMPING + force.x;
			velociti.y = velociti.y * DAMPING + force.y;
			velociti.z = velociti.z * DAMPING + force.z;
			velociti.w = velociti.w * DAMPING + force.w;
			
		},
		anglesInitValues: [0, 0, 0],
		utils: utils,
		RandomVertice: RandomVertice,
		p: 1,//Hyperbola parametr. See RandomVertice.calculateHyperbola
		force: () => { return {x: 0, y: 0, z: 0, w: 0 }; },
		setForse: (force, d, dist, m) => { force.x += (d.x / dist) * m; force.y += (d.y / dist) * m; force.z += (d.z / dist) * m; force.w += (d.w / dist) * m; },
		d: (p1, p2) => { return {x: p1.x - p2.x, y: p1.y - p2.y, z: p1.z - p2.z, w: p1.w - p2.w} },
		d2: (d) => { return d.x * d.x + d.y * d.y + d.z * d.z + d.w * d.w },
		angles: (angles) => { return [angles[0], angles[1], angles[2]]; },
		vertice: (p, velociti) => { return { x: p.x + velociti.x, y: p.y + velociti.y, z: p.z + velociti.z, w: p.w + velociti.w } },
		
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
//	userData.timeId = timeId;
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

https://chat.deepseek.com/share/3c99m2cgtvacj7e5on
Заменить сферу на гиперсферу в 4D простанстве.
Тогда каждая точка имеет вид: const angles = {
   latitude: latitude,//широта в диапазоне от -π/2 до π/2
   longitude: longitude//долгота в диапазоне от -π до π
   altitude: altitude//в диапазоне от 0 до π
}
	*/
	//https://chat.deepseek.com/a/chat/s/e808c17c-8258-4029-b70c-d65be630df03

/*
	//angles.length REPULSION_STRENGTH
	//20             0.05
	//1000          0.0001
	//5000          0.00001
	const a = 50;//0.5;
	const REPULSION_STRENGTH = a / angles.length;//0.05; // Сила отталкивания. Чем меньше значение, тем слабее силы отталкивания между точками, и тем медленнее они двигаются
	const DAMPING = 0.95; // Демпфирование движения
	data.this.r; // Радиус сферы. Нужно что бы во вселенной в classSettings.settings.object.geometry.times был добавлен новый time. Это нужно что бы пользователь мышкой мог выбрать вершину в вселенной

	// Инициализируем скорости
	if (velocities.length === 0) velocities = new Array(angles.length).fill(null).map(() => ({ x: 0, y: 0, z: 0, w: 0 }));

	// --- Итерационный процесс движения точек ---
	function iterationStep() {
		
		const anglesTemp = new Array(angles.length).fill(null).map(() => ({ x: 0, y: 0, z: 0, w: 0 }));
		const newRadius = classSettings.overriddenProperties.r(settings.bufferGeometry.userData.timeId - 1);

		let timestamp = classSettings.debug ? window.performance.now() : undefined;

		// Для каждой пары точек
		let progressBar, i = 0;// verticeId = 0;
		const step = () => {
			
			progressBar.value = i;
			const userData = settings.bufferGeometry.userData;
			const p1 = settings.overriddenProperties.position(position, i, userData);
			const angles1 = utils.cartesianToAngles(p1);

			let fx = 0, fy = 0, fz = 0, fw = 0;
			for (
//				let j = i + 1;
				let j = 0;//перебитаем все вершины для совместимости алгоритмов итерации на CPU и GPU. Для объяснения найти "во время выполнения шага итерации на CPU цикл" по ссылке https://gemini.google.com/share/94f727cf6035
				j < angles.length; j++) {
				
				if (i === j) continue;

				const p2 = settings.overriddenProperties.position(position, j, userData);
				const angles2 = utils.cartesianToAngles(p2);

				// Вектор от i к j
				let dx = p1.x - p2.x;
				let dy = p1.y - p2.y;
				let dz = p1.z - p2.z;
				let dw = p1.w - p2.w;

				let dist = Math.sqrt(dx * dx + dy * dy + dz * dz + dw * dw);

				const arc = π - hyperbola((dist / newRadius / 2) * π);
				userData.timeId--;//Во вселенной углы берутся из предыдушего шага проигрывателя
				const timeIdOld = settings.guiPoints ? settings.guiPoints.timeId : undefined;
				if (settings.guiPoints) settings.guiPoints.timeId = userData.timeId;
				const r = classSettings.overriddenProperties.rTime();
				
				// Случайное направление для точки i
				const noise1 = utils.anglesToCartesian(RandomVertice.get(arc, utils.angles([angles1[0], angles1[1], angles1[2]]), classSettings, RandomVertice), r);
					
				// Случайное направление для точки j (может быть противоположным для лучшего разведения)
				const noise2 = utils.anglesToCartesian(RandomVertice.get(arc, utils.angles([angles2[0], angles2[1], angles2[2]]), classSettings, RandomVertice), r);
				if (settings.guiPoints) settings.guiPoints.timeId = timeIdOld;
				userData.timeId++;


				// Вектор от i к j
				dx = noise1.x - noise2.x;
				dy = noise1.y - noise2.y;
				dz = noise1.z - noise2.z;
				dw = noise1.w - noise2.w;

				const d2 = dx * dx + dy * dy + dz * dz + dw * dw;// + 1e-6;
				dist = Math.sqrt(d2);
				
				// Сила обратно пропорциональна расстоянию
				const m = REPULSION_STRENGTH / d2;
				
				fx += (dx / dist) * m;
				fy += (dy / dist) * m;
				fz += (dz / dist) * m;
				fw += (dw / dist) * m;

			}
			
			velocities[i].x = velocities[i].x * DAMPING + fx;
			velocities[i].y = velocities[i].y * DAMPING + fy;
			velocities[i].z = velocities[i].z * DAMPING + fz;
			velocities[i].w = velocities[i].w * DAMPING + fw;
			
			anglesTemp[i] = utils.cartesianToAngles({
				x: p1.x + velocities[i].x, y: p1.y + velocities[i].y, z: p1.z + velocities[i].z, w: p1.w + velocities[i].w
			});
			
			i += 1;
			if (i >= angles.length) {

				progressBar.remove();

				if (classSettings.debug) classSettings.debug.logTimestamp('Play step. Average vertices. ', timestamp);

				if (angles.length != anglesTemp.length) console.error(sAverageVertices + ': iterationStep. angles.length != anglesTemp.length');
				for (let i = 0; i < angles.length; i++) angles[i] = anglesTemp[i];

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
const hyperbola = RandomVertice.calculateHyperbola(1);//0.99);
averageVertices.verticeProxy = (vertice) => { return vertice; }
*/
averageVertices.verticeProxy = averageVerticesBase.verticeProxy;
export default averageVertices;