/**
 * @module CloudSphere
 * @description Generates a cloud of vertices near the opposite vertice in 2D hypersphere.
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
import { RandomVerticeSphere as RandomVertice } from './randomVerticeSphere.js';
//import * as utils from './utilsSphere.js'
//import anglesRange from '../anglesRange.js'

const sCloudSphere = 'CloudSphere';
const π = Math.PI;

/**
 * Generates a cloud of vertices near the opposite vertice in 2D hypersphere.
 * @class
 * @extends Cloud
 */
class CloudSphere extends Cloud
{

	/**
	 * Generates a cloud of vertices near the opposite vertice in 2D hypersphere.
	 * @param {object} [params={}] See the <b>params</b> of the <a href="./module-RandomVertice-RandomVertice.html" target="_blank"><b>RandomVertice</b></a> constructor for details.
	 */
	constructor(params) {

		super(params);

		const randomVertice = new RandomVertice(params, true);
		Object.defineProperty(this, 'verticesAngles', {
			
			get: () => { return randomVertice.verticesAngles; },
			set: (anglesNew) => { randomVertice.verticesAngles = anglesNew; },
		
		});
		Object.defineProperty(this, 'circlesPointsCount', { get: () => { return randomVertice.circlesPointsCount; }, });
		
		//overridden methods
/*
		Object.defineProperty(this, 'randomAngles', {
			
			get: () => {

				if (params.altitude === undefined) params.pointsCount = 0;//обнулять только если обновляется облако сферы, которое находится в составе облака гиперсферы. Тоесть если создается облако сферы а не облако гиперсферы
				randomVertice.randomAngles;
				return randomVertice.angles;
				
			},
			
		});
*/		
		
		/////////////////////////////overridden methods

		if (params.hyperSphere) {

			//Этот экземпляр CloudSphere вызывается из RandomVerticeHyperSphere когда создается гиперсфера. Гиперсфера состоит из набора сфер.
			
			Object.defineProperty(this, 'sphereAnglesCount', { get: () => { return randomVertice.circlesPointsCount }, });
			
		}
		
	}
	//overridden methods
	
	getRandomVertice(params) { return new RandomVertice(params, true); }
	getRandomVerticeAngles(randomVertice, params) {

		if (params.altitude === undefined) params.pointsCount = 0;//обнулять только если обновляется облако сферы, которое находится в составе облака гиперсферы. Тоесть если создается облако сферы а не облако гиперсферы
		randomVertice.randomAngles;
		
	}

	/////////////////////////////overridden methods

}
export default CloudSphere;
