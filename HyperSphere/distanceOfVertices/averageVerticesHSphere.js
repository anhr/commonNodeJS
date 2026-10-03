/**
 * @module averageVerticesHSphere
 * @description An iterative process known as [Thomson problem]{@link https://en.wikipedia.org/wiki/Thomson_problem} in which, at each step, all vertices gradually move toward a position in which the vertices are at the maximum distance from each other on the hypersphere.
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

/**
 * Child function to override some base functions for hypersphere. See <b>overrides</b> parameter of the base <a href="./module-averageVertices.html" target="_blank">averageVertices</a> function.
 * @param {Object} data See <b>data</b> parameter of the base <a href="./module-averageVertices.html" target="_blank">averageVertices</a>
 */
const averageVertices = (data) => {
	let velocities;
	averageVerticesBase(data, {

//		setVelocities: (velocitiesNew) => { velocities = velocitiesNew; },
		/**
		 * Извлечение одной точки из массива по её индексу
		 * @param {number} index интекс точки
		 * @param {array} массив с точками
		 * @returns точка в формате {x, y, z, w}
		 */
		getPoint(index, array) {
			const offset = index * this.itemSize;
			return {
				get x() { return array[offset + 0]; },
				set x(value) { array[offset + 0] = value; },

				get y() { return array[offset + 1]; },
				set y(value) { array[offset + 1] = value; },

				get z() { return array[offset + 2]; },
				set z(value) { array[offset + 2] = value; },

				get w() { return array[offset + 3]; },
				set w(value) { array[offset + 3] = value; },
			};
		},
		get itemSize() { return 4; },
		velocitiesInitValues: () => { return {x: 0, y: 0, z: 0, w: 0 }; },
/*		
		setVelocities: (velociti, DAMPING, force) => {
			
			velociti.x = velociti.x * DAMPING + force.x;
			velociti.y = velociti.y * DAMPING + force.y;
			velociti.z = velociti.z * DAMPING + force.z;
			velociti.w = velociti.w * DAMPING + force.w;
			
		},
*/		
		anglesInitValues: [0, 0, 0],
		utils: utils,
		RandomVertice: RandomVertice,

		force: () => { return {x: 0, y: 0, z: 0, w: 0 }; },
		setForse: (forces, d, m, iStride) => {
//			force.x += d.x * m; force.y += d.y * m; force.z += d.z * m; force.w += d.w * m;
			forces[iStride] += d.x * m;
			forces[iStride + 1] += d.y * m;
			forces[iStride + 2] += d.z * m;
			forces[iStride + 3] += d.w * m;
		},
		d: (p1, p2) => { return {x: p1.x - p2.x, y: p1.y - p2.y, z: p1.z - p2.z, w: p1.w - p2.w} },
		d2: (d) => { return d.x * d.x + d.y * d.y + d.z * d.z + d.w * d.w },
		dist: (pt) => { return Math.hypot(pt.x, pt.y, pt.z, pt.w); },
		angles: (angles) => { return [angles[0], angles[1], angles[2]]; },
		vertice: (p, velocity) => { return { x: p.x + velocity.x, y: p.y + velocity.y, z: p.z + velocity.z, w: p.w + velocity.w } },
		forceVertice: (pt, force, eta, velocity, BETA = 0.85, i) => {
			// Обновляем скорость v = BETA * v + eta * F
			velocity.x = BETA * velocity.x + eta * force.x;
			velocity.y = BETA * velocity.y + eta * force.y;
			velocity.z = BETA * velocity.z + eta * force.z;
			velocity.w = BETA * velocity.w + eta * force.w;
			
			// Смещение координаты
			const updated = {
				x: pt.x + velocity.x,
				y: pt.y + velocity.y,
				z: pt.z + velocity.z,
				w: pt.w + velocity.w
			};
			const nextR = data.this.classSettings.overriddenProperties.rTime();

			// Вычисление длины (модуля) 4D-вектора смещенной точки: mag = sqrt(x² + y² + z² + w²).
			const mag = Math.hypot(updated.x, updated.y, updated.z, updated.w);
			// Используется для нормализации вектора и его проекции обратно на гиперсферу радиусом R.
			//вектор силы F выталкивает точку по касательной или наружу, в результате чего она сходит с поверхности гиперсферы.
			//Ее расстояние от центра координат перестает быть равным радиусу R.
			//Без этой операции точки при каждом шаге итерации постепенно «разлетались» бы от центра, увеличивая свой радиус и нарушая геометрию задачи.
			//Ту же самую работу можно выполнить, сделав преобразование в полярную систему координат и обратно, но это займет больше времени и уменьшается точность на полюсах.
//data.this.getPoint(1, 2)
			const cartesian = data.this.classSettings.overriddenProperties.getVerticePosition(i, data.timeId);
			cartesian.x = (updated.x / mag) * nextR;
			cartesian.y = (updated.y / mag) * nextR;
			cartesian.z = (updated.z / mag) * nextR;
			cartesian.w = (updated.w / mag) * nextR;
		},
		
	});
	
}
averageVertices.verticeProxy = averageVerticesBase.verticeProxy;
averageVertices.webGPU = { compute: (compute) => { compute() }};
export default averageVertices;