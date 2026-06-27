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

/**
 * Child function to override some base functions for sphere. See <b>overrides</b> parameter of the base <a href="./module-averageVertices.html" target="_blank">averageVertices</a> function.
 * @param {Object} data See <b>data</b> parameter of the base <a href="./module-averageVertices.html" target="_blank">averageVertices</a>
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
		vertice: (p, velociti) => { return { x: p.x + velociti.x, y: p.y + velociti.y, z: p.z + velociti.z } },
		
	});
	
}
averageVertices.verticeProxy = averageVerticesBase.verticeProxy;
export default averageVertices;