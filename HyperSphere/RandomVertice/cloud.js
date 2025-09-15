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

	/**
	 * Generates a cloud of the vertices around opposite vertice.
	 * @param {object} [params={}] See the <b>params</b> of the <a href="./module-RandomVertice-RandomVertice.html" target="_blank"><b>RandomVertice</b></a> constructor for details.
	 */
	constructor(params) {

		params.verticesAngles.length = 0;
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
		
	}
//	verticesAngles = [];
//	circlesPointsCount;
	
	//overridden methods
	
	get angles() { console.error(sCloud + sOver.replace('%s', 'get angles')) }
	get randomAngles() { console.error(sCloud + sOver.replace('%s', 'get randomAngles')) }
	
	/////////////////////////////overridden methods

}
export default Cloud;
