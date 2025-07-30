/**
 * @module RandomCloud
 * @description Generates a cloud of the random vertices around opposite vertice.
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

import * as utils from './utilsCircle.js'

const sRandomCloud = 'RandomCloud',
	sOver = ': Please, override %s method in your ' + sRandomCloud + ' child class.';
/**
 * Generates a cloud of the random vertices around opposite vertice.
 * @class
 */
class RandomCloud {

	/**
	 * Generates a cloud of the random vertices around opposite vertice.
	 */
	constructor() { }
//	randomVerticesAngles = [];
	verticesAngles = [];
	anglesCircle = (params, anglesIdMax, randomVertice) => {
		
		const boUpdate = this.verticesAngles.length === 0 ? false : true;

		//что бы не делать повторяющихся вычислений
		params.b = utils.b(params);
//				params.arc = Math.abs(normalizeAngle(params.vertice.longitude - params.oppositeVertice.longitude));
		
		for (let i = 0; i <= anglesIdMax; i++) {

			if (params.debug && params.debug.notRandomVertices) params.random = (1 / anglesIdMax) * i;//для замены случайной точки на регулярную
			
			const randomVerticeAngles = randomVertice.randomAngles;
			if (boUpdate) this.verticesAngles[i] = randomVerticeAngles;
			else this.verticesAngles.push(randomVerticeAngles);

		}
		delete params.random;
		delete params.b;
		return this.verticesAngles;
	}
	
	//overridden methods
	
	get angles() { console.error(sRandomCloud + sOver.replace('%s', 'get angles')) }
	get randomAngles() { console.error(sRandomCloud + sOver.replace('%s', 'get randomAngles')) }
	
	/////////////////////////////overridden methods

}
export default RandomCloud;
