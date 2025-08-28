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
	sOver = ': Please, override %s method in your ' + sRandomVertice + ' child class.',
	π = Math.PI, tan = Math.tan;
			
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
	constructor(params) {

		params.vertice ||= this.ZeroArray();
		params.oppositeVertice ||= this.ZeroArray();
		this.Center(params);
		
		//overridden methods
		
		this.anglesCircle = (utils) => {
			
			const random = (params.random === undefined ? Math.random() : params.random) - 0.5,
				b = params.b ? params.b : utils.b(params),
				p = (
					tan(random * b) /
					tan(0.5 * b)//делим на tan(0.5 * b), что бы при минимальном и максимальном random, p получалось -1 и 1
				) *
				π;//Умножаем на π что бы при минимальном и максимальном random углы получались на противоположной от params.oppositeVertice.longitude стороне окружности.
					//Тем самым точки почти равномерно распределяются по окружности когда arc = π, тоесть вершина и противоположная вершина расположены на противоположных сторонах окружности
			
			let angle = p + params.oppositeVertice.longitude;
			
			angle = utils.normalizeAngle(angle);
			return angle;
			
		}
		
		/////////////////////////////overridden methods
		
	}
	
	//overridden methods
	
	get angles() { console.error(sRandomVertice + sOver.replace('%s', 'get angles')) }
	
	/////////////////////////////overridden methods

}
export default RandomVertice;
