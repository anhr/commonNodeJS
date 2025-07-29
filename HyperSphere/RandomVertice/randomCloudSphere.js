/**
 * @module RandomCloudCircle
 * @description Generates a cloud of random vertices near the opposite vertice in 2D hypersphere.
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

import RandomCloud from './RandomCloud.js';
import RandomVertice from './randomVerticeSphere.js';
import * as utils from './utilsSphere.js'

//const sRandomCloudSphere = 'RandomCloudSphere';
/**
 * Generates a cloud of random vertices near the opposite vertice in 2D hypersphere.
 * @class
 */
class RandomCloudSphere extends RandomCloud {

	/**
	 * Generates a cloud of random vertices near the opposite vertice in 2D hypersphere.
	 * @param {object} [params={}] See the <b>params</b> of the <b>RandomVertice</b> constructor.
	 */
	constructor(params) {

		super();

		const anglesIdMax = 100, randomVertice = new RandomVertice(params);
		let randomVerticesAngles = [];
		
		//overridden methods

		Object.defineProperty(this, 'angles', {
			
			get: () => { return randomVerticesAngles; },
			set: (anglesNew) => { randomVerticesAngles = anglesNew; },
			
		});
		
		Object.defineProperty(this, 'randomAngles', {
			
			get: () => {

				const boUpdate = randomVerticesAngles.length === 0 ? false : true;

				//что бы не делать повторяющихся вычислений
				params.b = utils.b(params);

params.latitude = 1;
				
				for (let i = 0; i <= anglesIdMax; i++) {

					if (params.debug && params.debug.notRandomVertices) params.random = (1 / anglesIdMax) * i;//для замены случайной точки на регулярную
					
					const randomVerticeAngles = randomVertice.randomAngles;
					if (boUpdate) randomVerticesAngles[i] = randomVerticeAngles;
					else randomVerticesAngles.push(randomVerticeAngles);

				}
				delete params.random;
				delete params.b;
				return randomVerticesAngles;
				
			},
			
			set: (anglesNew) => { randomVerticesAngles = anglesNew; },
			
		});
		
		/////////////////////////////overridden methods

		this.randomAngles;
		
	}

}
export default RandomCloudSphere;
