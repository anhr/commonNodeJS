/**
 * @module RandomCloudCircle
 * @description Generates a cloud of random vertices near the opposite vertice in 1D hypersphere.
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
import RandomVertice from './randomVerticeCircle.js';

const sRandomCloudCircle = 'RandomCloudCircle';
/**
 * Generates a cloud of random vertices near the opposite vertice in 1D hypersphere.
 * @class
 */
class RandomCloudCircle extends RandomCloud {

	/**
	 * Generates a cloud of random vertices near the opposite vertice in 1D hypersphere.
	 * @param {object} [params={}] See the <b>params</b> of the <b>RandomVertice</b> constructor.
	 */
	constructor(params) {

		super();

		const anglesIdMax = 100, randomVerticesAngles = [], randomVertice = new RandomVertice(params);
		
		//overridden methods
		
		Object.defineProperty(this, 'angles', {
			
			get: function() {

				const boUpdate = randomVerticesAngles.length === 0 ? false : true;
				for (let i = 0; i < anglesIdMax; i++) {

					params.r = (1 / anglesIdMax) * i;//для замены случайной точки на регулярную
					const randomVerticeAngles = randomVertice.angles;
					if (boUpdate)
						randomVerticesAngles[i] = randomVerticeAngles
					else randomVerticesAngles.push(randomVerticeAngles);

				}
				return randomVerticesAngles;
				
			},
			
		});
		
		/////////////////////////////overridden methods
		
	}
	
	//overridden methods
/*	
	get angles() {
		
		return 1;
		
	}
*/	
	/////////////////////////////overridden methods

}
export default RandomCloudCircle;
