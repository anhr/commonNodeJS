/**
 * @module Cloud
 * @description Generates a cloud of the vertices around opposite vertice.
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

const sCloud = 'Cloud',
	sOver = ': Please, override %s method in your ' + sCloud + ' child class.';
/**
 * Generates a cloud of the vertices around opposite vertice.
 * @class
 */
class Cloud {
	
	// * @param {class} RandomVertice RandomVerticeHyperSphere class for CloudHyperSphere child class or RandomVerticeSphere class for CloudSphere child class

	/**
	 * Generates a cloud of the vertices around opposite vertice.
	 * @param {object} params See the <b>params</b> of the <a href="./module-RandomVertice-RandomVertice.html" target="_blank"><b>RandomVertice</b></a> constructor for details.
	 */
	constructor(params) {

		if (params.verticesAngles) {
			
			if (params.altitude === undefined) {

				//Удалять облако только если облако это сфера. Для гиперсферры облако точек состоит из нескольких сфер. Поэтому точки сфер надо суммировать.
				
				params.verticesAngles.length = 0;
				params.pointsCount = 0;//Количество точек в облаке. Нужно для построения облака из нескольких сфер, то есть для построения гиперсферы. После построения облака совпадает с randomVertice.circlesPointsCount если облако состоит из одной сферы, тоесть облако это сфера.
				
			}

		}
		if (params.pointsCount === undefined) params.pointsCount = 0;
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
			
			const boUpdate = this.verticesAngles.length === 0 ? false : true;
	
			//что бы не делать повторяющихся вычислений
			params.b = utils.b(params);
			
			for (let i = 0; i <= anglesIdMax; i++) {
	
				if (params.debug && params.debug.notRandomVertices) params.random = (1 / anglesIdMax) * i;//для замены случайной точки на регулярную
				
				const randomVerticeAngles = randomVertice.randomAngles;
				if (boUpdate) this.verticesAngles[i] = randomVerticeAngles;
				else this.verticesAngles.push(randomVerticeAngles);
	
			}
			delete params.random;
			delete params.b;
			return this.verticesAngles;
			
		}
		Object.defineProperty(this, 'randomAngles', {
			
			get: () => {

				//сюда попадает только когда изменяется положение вершин и нужно обновить не случайное облако гиперсферы. Неслучайное облако гиперсферы создается при randomVerticeSettings.mode = randomVerticeSettings.modes.cloud = 0
/*				
				params.noCreateCloudSphere = true;//поэтому не нужно создавать новые облака сфер CloudSphere а брать их из arrayCloudSpheres, которые были созданы при создании неслучайного облака гиперсферы.
				params.boCloud = true;
				randomVertice.randomAngles;
				delete params.boCloud;
				delete params.noCreateCloudSphere;
*/	
				this.getRandomVerticeAngles(randomVertice, params);
				return randomVertice.angles;
				
			},
			
		});
		
//		this.randomVertice = new RandomVertice(params, true);
		const randomVertice = this.getRandomVertice(params);
		
	}
//	verticesAngles = [];
//	circlesPointsCount;
	
	//overridden methods
	
	get angles() { console.error(sCloud + sOver.replace('%s', 'get angles')) }
	get randomAngles() { console.error(sCloud + sOver.replace('%s', 'get randomAngles')) }
	getRandomVertice() { console.error(sCloud + sOver.replace('%s', 'getRandomVertice')) }
	getRandomVerticeAngles() { console.error(sCloud + sOver.replace('%s', 'getRandomVerticeAngles')) }
	
	/////////////////////////////overridden methods

}
export default Cloud;
