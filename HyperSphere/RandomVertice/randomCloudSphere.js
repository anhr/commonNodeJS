/**
 * @module RandomCloudSphere
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

//import RandomCloud from './randomCloud.js';
import RandomCloudBase from './randomCloudBase.js';
import { RandomVerticeSphere as RandomVertice } from './randomVerticeSphere.js';
import HyperSphere from '../sphere.js';

//const sRandomCloudSphere = 'RandomCloudSphere';
//const π = Math.PI;

/**
 * Generates a cloud of random vertices near the opposite vertice in 2D hypersphere.
 * @class
 * @extends RandomCloud
 */
class RandomCloudSphere extends RandomCloudBase
{

	/**
	 * Generates a cloud of random vertices near the opposite vertice in 2D hypersphere.
	 * @param {object} [params={}] See the <b>params</b> of the <a href="./module-RandomVertice-RandomVertice.html" target="_blank"><b>RandomVertice</b></a> constructor for details.
	 * @param {object} [boCloud] true - generates a random vertice cloud.
	 */
	constructor(params, boCloud) {

		super(params, boCloud);

		//overridden methods
		
		/////////////////////////////overridden methods
		
	}
	
	//overridden methods

	newRandomVertice(params, boCloud) { return new RandomVertice(params, boCloud, false); }
	getHyperSphere(options, classSettings, color) { return this.getHyperSphereBase(HyperSphere, options, classSettings, color); }
	verticesAngles(params, randomVertice, boAllocateMemory) {

		for (let anglesId = 0; anglesId < this.circlesPointsCount; anglesId++) {

			if (!boAllocateMemory) params.editAnglesId = anglesId;
			randomVertice.randomAngles;

		}
		delete params.editAnglesId;
		
	};
	
	/////////////////////////////overridden methods

}
export default RandomCloudSphere;
