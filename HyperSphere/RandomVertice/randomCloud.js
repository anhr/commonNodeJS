/**
 * @module RandomCloud
 * @description Generates a cloud of the random vertices around opposite vertice.
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

import getHyperSphere from './getHyperSphere.js'

const sRandomCloud = 'RandomCloud',
	sOver = ': Please, override %s method in your ' + sRandomCloud + ' child class.';
/**
 * Generates a cloud of the random vertices around opposite vertice.
 * @class
 */
class RandomCloud {

	/**
	 * Generates a cloud of the random vertices around opposite vertice.
	 * @param {object} [params={}] See the <b>params</b> of the <a href="./module-RandomVertice-RandomVertice.html" target="_blank"><b>RandomVertice</b></a> constructor for details.
	 */
	constructor(params) {

		if (params.verticesAngles && (params.altitude === undefined)) {
			
			//Удалять облако только если облако это сфера. Для гиперсферры облако точек состоит из нескольких сфер. Поэтому точки сфер надо суммировать.
			
			params.verticesAngles.length = 0;
			params.pointsCount = 0;//Количество точек в облаке. Нужно для построения облака из нескольких сфер, то есть для построения гиперсферы. После построения облака совпадает с randomVertice.circlesPointsCount если облако состоит из одной сферы, тоесть облако это сфера.

		}
		if (params.pointsCount === undefined) params.pointsCount = 0;
		
		if (params.verticesAngles && !params.verticesAngles.boNoNew) params.verticesAngles.length = 0;
//		params.editAnglesId = undefined;//если оставить эту строку, то в режиме отображения одной случайной точки randomVerticeSettings.mode = randomVerticeSettings.modes.randomVertice = 1 при каждом изменении положения вершины будет добавляться новая точка
		Object.defineProperty(this, 'angles', {
			
			get: () => {

				return params.verticesAngles;
//				return this.verticesAngles;
			
			},
			set: (anglesNew) => {

				params.verticesAngles = anglesNew;
//				this.verticesAngles = anglesNew;
			
			},
			
		});
		this.anglesCircle = (anglesIdMax, randomVertice, utils) => {
			
//			const boUpdate = this.verticesAngles.length === 0 ? false : true;
			const boUpdate = params.verticesAngles.length === 0 ? false : true;
	
			//что бы не делать повторяющихся вычислений
			params.b = utils.b(params);
			
			for (let i = 0; i <= anglesIdMax; i++) {
	
				if (params.debug && params.debug.notRandomVertices) params.random = (1 / anglesIdMax) * i;//для замены случайной точки на регулярную
				
				const randomVerticeAngles = randomVertice.randomAngles;
/*				
				if (boUpdate) this.verticesAngles[i] = randomVerticeAngles;
				else this.verticesAngles.push(randomVerticeAngles);
*/				
				if (boUpdate) params.verticesAngles[i] = randomVerticeAngles;
				else params.verticesAngles.push(randomVerticeAngles);
	
			}
			delete params.random;
			delete params.b;
//			return this.verticesAngles;
			return params.verticesAngles;
			
		}
		
	}
//	verticesAngles = [];
	circlesPointsCount;
	getHyperSphereBase(HyperSphere, options, classSettings, color) {

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

		return getHyperSphere(HyperSphere, options, classSettings.projectParams.scene, this, { debug: classSettings.debug, r: classSettings.r, name: lang.name, color: color });
/*		
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

					name: lang.name,
					color: color,
					geometry: this,//randomVertice,

				},
				overriddenProperties: { setDrawRange: (start, count) => { if (hsRandomVertice) hsRandomVertice.bufferGeometry.setDrawRange(start, count); } },

			},

		});
		return hsRandomVertice;
*/		
		
	}
	
	//overridden methods
	
	get angles() { console.error(sRandomCloud + sOver.replace('%s', 'get angles')) }
	get randomAngles() { console.error(sRandomCloud + sOver.replace('%s', 'get randomAngles')) }
	getHyperSphere() { console.error(sRandomCloud + sOver.replace('%s', 'getHyperSphere()')) }
	
	/////////////////////////////overridden methods

}
export default RandomCloud;
