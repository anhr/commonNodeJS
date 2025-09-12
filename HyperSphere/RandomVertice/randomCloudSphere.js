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

import RandomCloud from './randomCloud.js';
//import RandomVertice from './randomVerticeSphere.js';
import { RandomVerticeSphere as RandomVertice } from './randomVerticeSphere.js';
import * as utils from './utilsSphere.js'
import anglesRange from '../anglesRange.js'
import HyperSphere from '../sphere.js';

const sRandomCloudSphere = 'RandomCloudSphere';
const π = Math.PI;

/**
 * Generates a cloud of random vertices near the opposite vertice in 2D hypersphere.
 * @class
 * @extends RandomCloud
 */
class RandomCloudSphere extends RandomCloud
{

	/**
	 * Generates a cloud of random vertices near the opposite vertice in 2D hypersphere.
	 * @param {object} [params={}] See the <b>params</b> of the <a href="./module-RandomVertice-RandomVertice.html" target="_blank"><b>RandomVertice</b></a> constructor for details.
	 * @param {object} [boCloud=false] true - generates a random vertice cloud.
	 */
	constructor(params, boCloud) {

		super(params);

/*		
		const anglesIdMax = 50,//Количество точек на окружности, расположенной на экваторе
			circlesCount = (anglesIdMax / 2) + 1,//количество окружностей
			k = 1 / (circlesCount - 1),//for params.random = k * circleId;
			sin = Math.sin, cos = Math.cos, asin = Math.asin, atan = Math.atan, atan2 = Math.atan2,
			round = Math.round, random = Math.random, abs = Math.abs,
			range = anglesRange.latitude.range,// latitudeMax = anglesRange.latitude.max, latitudeMin = anglesRange.latitude.min,
*/			
		this.circlesPointsCount = 750;//количество точек в облаке
		const randomVertice = new RandomVertice(params, boCloud, false),
			verticesAngles = (/*boAllocateMemory*/) => {

//				params.range = π;
				for (let anglesId = 0; anglesId < this.circlesPointsCount; anglesId++) {

					const randomAngles = randomVertice.randomAngles;
					if (boAllocateMemory) this.verticesAngles.push(randomAngles[0]);
					else this.verticesAngles[anglesId] = randomAngles[0];

				}
				
			};

		//Allocate this.verticesAngles memory
//		verticesAngles(true);
		
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
/*		
		//Localization

		const lang = {

			name: 'Middle vertice cloud',
			
		}

		switch (options.getLanguageCode()) {

			case 'ru'://Russian language

				lang.name = 'Облако средней точки';

				break;
			default://Custom language

		}
		
		let hsRandomVertice;
		hsRandomVertice = new HyperSphere(options, {

			boRemove: false,//Если не установить этот флаг, то при замене старого hsRandomVertice на новый будут удаляться все гиперсферы на scene. То есть удалится hsVertices
			r: classSettings.r,
			edges: false,
			//randomArc: true,
			projectParams: { scene: classSettings.projectParams.scene, },
//				debug: debug,
			debug: classSettings.debug,
			//debug: false,
			settings: {

				object: {

					name: this.getHyperSphereName(options),//lang.name,
					color: color,
					geometry: this,//randomVertice,

				},
				overriddenProperties: { setDrawRange: (start, count) => { if (hsRandomVertice) hsRandomVertice.bufferGeometry.setDrawRange(start, count); } },

			},

		});
		return hsRandomVertice;
*/		
		
	}
	
	/////////////////////////////overridden methods

}
export default RandomCloudSphere;
