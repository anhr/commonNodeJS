/**
 * @module RandomCloudHSphere
 * @description Generates a cloud of random vertices near the opposite vertice in 3D hypersphere.
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

//import RandomCloud from './randomCloud.js';
import RandomCloudBase from './randomCloudBase.js';
import RandomVertice from './randomVerticeHSphere.js';
import HyperSphere from '../hyperSphere3D.js';
import RandomCloudSphere from './randomCloudSphere.js';

//const sRandomCloudHSphere = 'RandomCloudHSphere';
//const π = Math.PI;

/**
 * Generates a cloud of random vertices near the opposite vertice in 3D hypersphere.
 * @class
 * @extends RandomCloud
 */
class RandomCloudHSphere extends RandomCloudBase
{

	/**
	 * Generates a cloud of random vertices near the opposite vertice in 3D hypersphere.
	 * @param {object} [params={}] See the <b>params</b> of the <a href="./module-RandomVertice-RandomVertice.html" target="_blank"><b>RandomVertice</b></a> constructor for details.
	 * @param {object} [boCloud=false] true - generates a random vertice cloud.
	 */
	constructor(params, boCloud = true) { super(params, boCloud); }
	
	//overridden methods
	
	newRandomVertice(params, boCloud) { return new RandomVertice(params, boCloud, false); }
	getHyperSphere(options, classSettings, color) { return this.getHyperSphereBase(HyperSphere, options, classSettings, color); }
	verticesAngles(params, randomVertice, boAllocateMemory) {
		
		params.CloudSphere = RandomCloudSphere;
		for (let anglesId = 0; anglesId < this.circlesPointsCount; anglesId++) {

			console.log('anglesId = ' + anglesId);
			if (!boAllocateMemory) params.editAnglesId = anglesId;
			params.noCreateCloudSphere = true;//поэтому не нужно создавать новые облака сфер CloudSphere а брать их из arrayCloudSpheres.
			randomVertice.randomAngles;
			delete params.noCreateCloudSphere;

		}
		delete params.CloudSphere;
		delete params.editAnglesId;
		
	}
	
	/////////////////////////////overridden methods

}
export default RandomCloudHSphere;
