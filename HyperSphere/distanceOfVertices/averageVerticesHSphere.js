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

	averageVerticesBase(data, {

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

		force: () => { return {x: 0, y: 0, z: 0, w: 0 }; },
		setForse: (force, d, m) => { force.x += d.x * m; force.y += d.y * m; force.z += d.z * m; force.w += d.w * m; },
		d: (p1, p2) => { return {x: p1.x - p2.x, y: p1.y - p2.y, z: p1.z - p2.z, w: p1.w - p2.w} },
		d2: (d) => { return d.x * d.x + d.y * d.y + d.z * d.z + d.w * d.w },
		angles: (angles) => { return [angles[0], angles[1], angles[2]]; },
		vertice: (p, velocity) => { return { x: p.x + velocity.x, y: p.y + velocity.y, z: p.z + velocity.z, w: p.w + velocity.w } },
		forceVertice: (pt, forces, eta, velocities, BETA = 0.85, i) => {
			// Обновляем скорость v = BETA * v + eta * F
			velocities[i].x = BETA * velocities[i].x + eta * forces[i].x;
			velocities[i].y = BETA * velocities[i].y + eta * forces[i].y;
			velocities[i].z = BETA * velocities[i].z + eta * forces[i].z;
			velocities[i].w = BETA * velocities[i].w + eta * forces[i].w;

			data.this.getPoint(1, 2)
//			new window.__myThree__.three.THREE.Vector4() data.this.classSettings.settings
			
			const updated = {
				x: pt.x + eta * force.x,
				y: pt.y + eta * force.y,
				z: pt.z + eta * force.z,
				w: pt.w + eta * force.w
			};

			// Вычисление длины (модуля) 4D-вектора смещенной точки: mag = sqrt(x² + y² + z² + w²).
			const mag = Math.hypot(updated.x, updated.y, updated.z, updated.w);
			// Используется для нормализации вектора и его проекции обратно на гиперсферу радиусом R.
			//вектор силы F выталкивает точку по касательной или наружу, в результате чего она сходит с поверхности гиперсферы.
			//Ее расстояние от центра координат перестает быть равным радиусу R.
			//Без этой операции точки при каждом шаге итерации постепенно «разлетались» бы от центра, увеличивая свой радиус и нарушая геометрию задачи.
			//Ту же самую работу можно выполнить, сделав преобразование в полярную систему координат и обратно, но это займет больше времени и уменьшается точность на полюсах.
			const r = data.this.classSettings.overriddenProperties.rTime();
			return {
				x: (updated.x / mag) * r,
				y: (updated.y / mag) * r,
				z: (updated.z / mag) * r,
				w: (updated.w / mag) * r
			};
		},
		
	});
	
}
averageVertices.verticeProxy = averageVerticesBase.verticeProxy;
averageVertices.webGPU = { compute: (compute) => { compute() }};
export default averageVertices;