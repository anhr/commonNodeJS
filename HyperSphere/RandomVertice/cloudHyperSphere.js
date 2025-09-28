/**
 * @module CloudHyperSphere
 * @description Generates a cloud of vertices near the opposite vertice in 3D hypersphere.
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

import Cloud from './cloud.js';
//import { RandomVerticeSphere as RandomVertice } from './randomVerticeSphere.js';
import RandomVertice from './randomVerticeHyperSphere.js';
import * as utils from './utilsSphere.js'
import anglesRange from '../anglesRange.js'
import CloudSphere from './cloudSphere.js';

//const sCloudHyperSphere = 'CloudHyperSphere';
//const π = Math.PI;

/**
 * Generates a cloud of vertices near the opposite vertice in 3D hypersphere.
 * @class
 * @extends Cloud
 */
class CloudHyperSphere extends Cloud
{

	/**
	 * Generates a cloud of vertices near the opposite vertice in 3D hypersphere.
	 * @param {object} [params={}] See the <b>params</b> of the <a href="./module-RandomVertice-RandomVertice.html" target="_blank"><b>RandomVertice</b></a> constructor for details.
	 */
	constructor(params) {

		super(params);

//		params.boCloudSphere = true;
		params.CloudSphere = CloudSphere;
		const randomVertice = new RandomVertice(params, true);
//		delete params.boCloudSphere;
		delete params.CloudSphere;
		Object.defineProperty(this, 'verticesAngles', {
			
			get: () => { return randomVertice.verticesAngles; },
			set: (anglesNew) => { randomVertice.verticesAngles = anglesNew; },
		
		});
		Object.defineProperty(this, 'circlesPointsCount', { get: () => { return randomVertice.circlesPointsCount; }, });
		Object.defineProperty(this, 'randomAngles', {
			
			get: () => {

				randomVertice.randomAngles;
				this.verticesAngles = randomVertice.cloud;
				return this.verticesAngles;
				
			},
			
		});
		
	}

}
export default CloudHyperSphere;
