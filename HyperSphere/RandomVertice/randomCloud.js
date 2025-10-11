/**
 * @module RandomCloud
 * @description Generates a cloud of the random vertices around opposite vertice. Base class for <b>RandomCloudCircle</b> and <b>RandomCloudBase</b>.
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
 * Generates a cloud of the random vertices around opposite vertice. Base class for <b>RandomCloudCircle</b> and <b>RandomCloudBase</b>.
 * @class
 */
class RandomCloud {

	/**
	 * Generates a cloud of the random vertices around opposite vertice. Base class for <b>RandomCloudCircle</b> and <b>RandomCloudBase</b>.
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
		Object.defineProperty(this, 'angles', {
			
			get: () => { return params.verticesAngles; },
			set: (anglesNew) => { params.verticesAngles = anglesNew; },
			
		});
		this.anglesCircle = (anglesIdMax, randomVertice, utils) => {
			
			const boUpdate = params.verticesAngles.length === 0 ? false : true;
	
			//что бы не делать повторяющихся вычислений
			params.b = utils.b(params);
			
			for (let i = 0; i <= anglesIdMax; i++) {
	
				if (params.debug && params.debug.notRandomVertices) params.random = (1 / anglesIdMax) * i;//для замены случайной точки на регулярную
				
				const randomVerticeAngles = randomVertice.randomAngles;
				if (boUpdate) params.verticesAngles[i] = randomVerticeAngles;
				else params.verticesAngles.push(randomVerticeAngles);
	
			}
			delete params.random;
			delete params.b;
			return params.verticesAngles;
			
		}
		
	}
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
		
	}
	
	//overridden methods
	
	get angles() { console.error(sRandomCloud + sOver.replace('%s', 'get angles')) }
	get randomAngles() { console.error(sRandomCloud + sOver.replace('%s', 'get randomAngles')) }
	getHyperSphere() { console.error(sRandomCloud + sOver.replace('%s', 'getHyperSphere()')) }
	
	/////////////////////////////overridden methods

}
export default RandomCloud;
