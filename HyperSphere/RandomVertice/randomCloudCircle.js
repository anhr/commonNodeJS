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
import HyperSphere from '../circle.js';

const sRandomCloudCircle = 'RandomCloudCircle';
/**
 * Generates a cloud of random vertices near the opposite vertice in 1D hypersphere.
 * @class
 * @extends RandomCloud
 */
class RandomCloudCircle extends RandomCloud {

	/**
	 * Generates a cloud of random vertices near the opposite vertice in 1D hypersphere.
	 * @param {object} [params={}] See the <b>params</b> of the <a href="./module-RandomVertice-RandomVertice.html" target="_blank"><b>RandomVertice</b></a> constructor for details.
	 */
	constructor(params={}) {

		super(params);

		const anglesIdMax = 100, randomVertice = new RandomVertice(params);
		
		Object.defineProperty(this, 'params', {
			
//			get: () => { return this.anglesCircle(anglesIdMax, randomVertice, utils); },
			set: (paramsNew) => {

				params.arc = paramsNew.arc;
				params.oppositeVertice = paramsNew.oppositeVertice;
				this.randomAngles;
			
			},
			
		});
		
		//overridden methods
		
		Object.defineProperty(this, 'randomAngles', {
			
			get: () => { return this.anglesCircle(anglesIdMax, randomVertice, utils); },
			set: (anglesNew) => { verticesAngles = anglesNew; },
			
		});
		
		/////////////////////////////overridden methods

		this.randomAngles;
		
	}
	
	//overridden methods
	
	getHyperSphere(options, classSettings, color) { return this.getHyperSphereBase(HyperSphere, options, classSettings, color); }
	
	/////////////////////////////overridden methods

}
export default RandomCloudCircle;
