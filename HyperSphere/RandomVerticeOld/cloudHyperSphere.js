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
import RandomVertice from './randomVerticeHSphere.js';
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

		params.CloudSphere = CloudSphere;
		
		super(params, RandomVertice);

		Object.defineProperty(this, 'verticesAngles', {
			
			get: () => { return randomVertice.verticesAngles; },
			set: (anglesNew) => { randomVertice.verticesAngles = anglesNew; },
		
		});
		Object.defineProperty(this, 'circlesPointsCount', { get: () => { return randomVertice.circlesPointsCount; }, });
		
	}
	
	//overridden methods
	
	getRandomVertice(params) { return new RandomVertice(params, true); }
	getRandomVerticeAngles(randomVertice, params) {

		params.noCreateCloudSphere = true;//поэтому не нужно создавать новые облака сфер CloudSphere а брать их из arrayCloudSpheres, которые были созданы при создании неслучайного облака гиперсферы.
		params.boCloud = true;
		randomVertice.randomAngles;
		delete params.boCloud;
		delete params.noCreateCloudSphere;
		
	}

	/////////////////////////////overridden methods
	
}
export default CloudHyperSphere;
