/**
 * @module RandomCloudHyperSphere
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

import RandomCloud from './randomCloud.js';
import RandomVertice from './randomVerticeHyperSphere.js';
//import * as utils from './utilsSphere.js'
//import anglesRange from '../anglesRange.js'
import HyperSphere from '../sphere.js';

//const sRandomCloudHyperSphere = 'RandomCloudHyperSphere';
const π = Math.PI;

/**
 * Generates a cloud of random vertices near the opposite vertice in 3D hypersphere.
 * @class
 * @extends RandomCloud
 */
class RandomCloudHyperSphere extends RandomCloud
{

	/**
	 * Generates a cloud of random vertices near the opposite vertice in 3D hypersphere.
	 * @param {object} [params={}] See the <b>params</b> of the <a href="./module-RandomVertice-RandomVertice.html" target="_blank"><b>RandomVertice</b></a> constructor for details.
	 * @param {object} [boCloud=false] true - generates a random vertice cloud.
	 */
	constructor(params, boCloud) {

		super(params);

		this.circlesPointsCount = 750;//количество точек в облаке
		const randomVertice = new RandomVertice(params, boCloud, false),
			verticesAngles = () => {

				for (let anglesId = 0; anglesId < this.circlesPointsCount; anglesId++) {

					const randomAngles = randomVertice.randomAngles;
/*					
					if (boAllocateMemory)this.verticesAngles.push(randomAngles[0]);
					else this.verticesAngles[anglesId] = randomAngles[0];
*/					
					if (boAllocateMemory) params.verticesAngles.push(randomAngles[0]);
					else params.verticesAngles[anglesId] = randomAngles[0];
						

				}

				
			};

		//overridden methods

		Object.defineProperty(this, 'randomAngles', {
			
			get: () => {

				verticesAngles();//false);
				return this.verticesAngles;
				
			},
			
			set: (anglesNew) => { verticesAngles = anglesNew; },
			
		});
		
		/////////////////////////////overridden methods

		let boAllocateMemory = true;
		this.randomAngles;
		boAllocateMemory = false;
		
	}
	
	//overridden methods
	
	getHyperSphere(options, classSettings, color) {

		return this.getHyperSphereBase(HyperSphere, options, classSettings, color);
		
	}
	
	/////////////////////////////overridden methods

}
export default RandomCloudHyperSphere;
