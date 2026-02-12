/**
 * @module RandomVerticeCircle
 * @description Generates a random vertice near the opposite vertice in 1D hypersphere.
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

import RandomVertice from './randomVertice.js';
import * as utils from '../utilsCircle.js'
import HyperSphere from '../circle.js';

//const sRandomVerticeCircle = 'RandomVerticeCircle';
const π = Math.PI, tan = Math.tan, random = Math.random;

/**
 * Generates a random vertice near the opposite vertice in 1D hypersphere.
 * @class
 * @extends RandomVertice
 */
class RandomVerticeCircle extends RandomVertice {

	/**
	 * Generates a random vertice near the opposite vertice in 1D hypersphere.
	 * @param {object} [params={}] See the <b>params</b> of the <a href="./module-RandomVertice-RandomVertice.html" target="_blank"><b>RandomVertice</b></a> constructor for details.
	 * @param {number} verticesCount count of vertices in the random vertices cloud.
	 */
	constructor(params={}, verticesCount) {

		super(params, verticesCount);

		let randomAngles;

		//overridden methods

		this.getRandomAngles = () => {

			const R = 1, oppositeVertice = params.oppositeVertice;
			//strategy 3
			const distance = this.distance((random() * 2 * π - π) * R, R);
			const result = { lon: distance + oppositeVertice.longitude }
			const angles = utils.angles([result.lon]);
			this.paramsVerticesAngles(angles);
			return this.angles;
			
		}
		
		/////////////////////////////overridden methods

		params.pointsCount = 0;
		this.verticesAngles(false);

	}
	
	//overridden methods
	
	ZeroArray() { return [0]; }
	Center(params) { utils.angles(params.oppositeVertice); }
	get HyperSphere() { return HyperSphere; }
	
	/////////////////////////////overridden methods

}
export default RandomVerticeCircle;
