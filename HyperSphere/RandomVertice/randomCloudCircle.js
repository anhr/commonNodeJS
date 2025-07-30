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

import RandomCloud from './randomCloud.js';
import RandomVertice from './randomVerticeCircle.js';
import * as utils from './utilsCircle.js'

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

		super(params);

		const anglesIdMax = 100, randomVertice = new RandomVertice(params);
		
		//overridden methods
/*
		Object.defineProperty(this, 'angles', {
			
			get: () => { return this.verticesAngles; },
			set: (anglesNew) => { this.verticesAngles = anglesNew; },
			
		});
*/		
		
		Object.defineProperty(this, 'randomAngles', {
			
			get: () => {

				return this.anglesCircle(params, anglesIdMax, randomVertice, utils);
				
			},
			
			set: (anglesNew) => { verticesAngles = anglesNew; },
			
		});
		
		/////////////////////////////overridden methods

//		if (!params.noSetRandomAngles)
		this.randomAngles;
		
	}

}
export default RandomCloudCircle;
