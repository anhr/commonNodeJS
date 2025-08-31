/**
 * @module RandomVertice
 * @description Generates random angles between a vertice and its opposite vertice.
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

const sRandomVertice = 'RandomVertice',
	sOver = ': Please, override %s method in your ' + sRandomVertice + ' child class.';
/**
 * Generates random angles between a vertice and its opposite vertice.
 * @class
 */
class RandomVertice {

	/**
	 * Generates random angles between a vertice and its opposite vertice.
	 * @param {object} [params={}] The following parameters are available.
	 * @param {Array} [params.vertice=[0, 0, 0]] First vertice of the arc between two vertices.
	 * @param {Array} [params.oppositeVertice=[0, 0, 0]] Second vertice of the arc between two vertices.
	 * @param {object} [params.debug] Debug mode.
	 * @param {object} [params.debug.notRandomVertices] true - replacing random vertices with strictly defined vertices.
	 */
	constructor(params={}) {

		params.vertice ||= this.ZeroArray();
		params.oppositeVertice ||= this.ZeroArray();
		this.Center(params);
/*
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
*/		
		
	}
	verticesAngles = [];
	circlesPointsCount;
	
	//overridden methods
	
	get angles() { console.error(sRandomCloud + sOver.replace('%s', 'get angles')) }
	get randomAngles() { console.error(sRandomCloud + sOver.replace('%s', 'get randomAngles')) }
	
	/////////////////////////////overridden methods

}
export default RandomVertice;
