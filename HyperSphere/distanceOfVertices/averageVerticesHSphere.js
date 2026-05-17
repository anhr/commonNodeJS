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

		//Hyperbola parametr. See RandomVertice.calculateHyperbola
		//p: 0.99,
		p: 0,//Прямая линия: y = x (через точки (0,0) и (π,π))
		//p: 1,// Два отрезка: вертикальный и горизонтальный
		
		force: () => { return {x: 0, y: 0, z: 0, w: 0 }; },
		setForse: (force, d, dist, m) => { force.x += (d.x / dist) * m; force.y += (d.y / dist) * m; force.z += (d.z / dist) * m; force.w += (d.w / dist) * m; },
		d: (p1, p2) => { return {x: p1.x - p2.x, y: p1.y - p2.y, z: p1.z - p2.z, w: p1.w - p2.w} },
		d2: (d) => { return d.x * d.x + d.y * d.y + d.z * d.z + d.w * d.w },
		angles: (angles) => { return [angles[0], angles[1], angles[2]]; },
		vertice: (p, velociti) => { return { x: p.x + velociti.x, y: p.y + velociti.y, z: p.z + velociti.z, w: p.w + velociti.w } },
		
	});
	
}
averageVertices.verticeProxy = averageVerticesBase.verticeProxy;
averageVertices.webGPU = { compute: (compute) => { compute() }};
export default averageVertices;