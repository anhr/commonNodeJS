/**
 * @module RandomVerticeCircle
 * @description Generates a random vertice near the opposite vertice in 1D hypersphere.
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

import RandomVertice from './randomVertice.js';
import * as utils from '../utilsCircle.js'
//import Vertice from '../VerticeCircle.js'
import HyperSphere from '../circle.js';

//const sRandomVerticeCircle = 'RandomVerticeCircle';
const π = Math.PI, tan = Math.tan, random = Math.random;

/**
 * Generates a random vertice near the opposite vertice in 1D hypersphere.
 * @class
 * @extends RandomVertice
 */
class RandomVerticeCircle extends RandomVertice {

	/**
	 * Generates a random vertice near the opposite vertice in 1D hypersphere.
	 * @param {object} [params={}] See the <b>params</b> of the <a href="./module-RandomVertice-RandomVertice.html" target="_blank"><b>RandomVertice</b></a> constructor for details.
	 * @param {number} verticesCount count of vertices in the random vertices cloud.
	 */
	constructor(params={}, verticesCount) {

		super(params, verticesCount);

		let randomAngles;

/*		
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
*/		

		//overridden methods

/*		
		Object.defineProperty(this, 'angles', {
			
			get: () => { return randomAngles; },
			set: (anglesNew) => { randomAngles = anglesNew; },
			
		});
*/
		this.getAngles = () => { return randomAngles; }
		this.setAngles = (anglesNew) => { randomAngles = anglesNew; }
/*		
		Object.defineProperty(this, 'randomAngles', {
			
			get: () => {

				randomAngles = [[this.anglesCircle(utils)]];
				return randomAngles[0];
				
			},
			set: (anglesNew) => {},
			
		});
*/		
		this.getRandomAngles = () => {

			const R = 1, oppositeVertice = params.oppositeVertice;
			//strategy 3
			const distance = this.distance(random() * 2 * π * R, R);
			const result = { lon: distance + oppositeVertice.longitude }
			const angles = utils.angles([result.lon]);
			this.paramsVerticesAngles(angles);
			return this.angles;
/*			
			const longitude = this.anglesCircle(utils);
			if (randomAngles) {
				
				randomAngles[0].longitude = longitude;
				return randomAngles[0];
				
			}
			randomAngles = [[longitude]];
			return utils.angles(randomAngles[0]);
*/			
			
		}
		
		/////////////////////////////overridden methods

//		this.randomAngles;
		params.pointsCount = 0;
		this.verticesAngles(false);

	}
	
	//overridden methods
	
	ZeroArray() { return [0]; }
	Center(params) {

//		utils.angles(params.vertice);
		utils.angles(params.oppositeVertice);
		
	}
	get HyperSphere() { return HyperSphere; }
	
	/////////////////////////////overridden methods

}
export default RandomVerticeCircle;
