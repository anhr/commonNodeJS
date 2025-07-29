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
import anglesRange from '../anglesRange.js'
import * as utils from './utilsSphere.js'

const sRandomVerticesCircle = 'RandomVerticesCircle';
/**
 * Generates a random vertice near the opposite vertice in 1D hypersphere.
 * @class
 */
class RandomVerticeCircle extends RandomVertice {

	/**
	 * Generates a random vertice near the opposite vertice in 1D hypersphere.
	 * @param {object} [params={}] See the <b>params</b> of the <b>RandomVertice</b> constructor.
	 */
	constructor(params) {

		super(params);

		const π = Math.PI, tan = Math.tan,
			range = anglesRange.longitude.range;
		let randomAngles;

		//overridden methods

		Object.defineProperty(this, 'angles', {
			
			get: () => { return randomAngles; },
			set: (anglesNew) => { randomAngles = anglesNew; },
			
		});
		
		Object.defineProperty(this, 'randomAngles', {
			
			get: () => {

				const r = (params.random === undefined ? Math.random() : params.random) - 0.5,
					b = params.b ? params.b : utils.b(params),
/*					
					arc = params.arc != undefined ? params.arc : Math.abs(normalizeAngle(params.vertice.longitude - params.oppositeVertice.longitude)),
					
					//arc = π, b = 1 все точки почти равномерно распределяются по кругу
					//arc = 0, b = π все точки стягиваются в одну точку
					//a = (1 / π) - 1, c = π
					b = arc * a + c,
*/					
					p = (
						tan(r * b) /
						tan(0.5 * b)//делим на tan(0.5 * b), что бы при минимальном и максимальном r, p получалось -1 и 1
					) *
					π;//Умножаем на π что бы при минимальном и максимальном r углы получались на противоположной от params.oppositeVertice.longitude стороне окружности.
						//Тем самым точки почти равномерно распределяются по окружности когда arc = π, тоесть вершина и противоположная вершина расположены на противоположных сторонах окружности
				
//				console.log('r = ' + r + ' p = ' + p);
				let longitude = p + params.oppositeVertice.longitude;
				
				longitude = utils.normalizeAngle(longitude);

				randomAngles = [[0, longitude]];
				return randomAngles;
				
			},
			set: (anglesNew) => {},
			
		});
		
		/////////////////////////////overridden methods

		this.randomAngles;

	}
	
	//overridden methods
	
	ZeroArray() { return [0, 0]; }
	Center(params) {
	
		const Vertice = (vertice) => {
		
			if (vertice.longitude != undefined) return;
			while (vertice.length < 2) vertice.push(0);
			Object.defineProperty(vertice, 'longitude', {
				
				get: () => { return vertice[1]; },
				set: (longitude) => {
		
					if (vertice[1] === longitude) return true;
					vertice[1] = longitude;
					return true;
		
				},
			
			});
			Object.defineProperty(vertice, 'latitude', {
				
				get: () => { return vertice[0]; },
				set: (latitude) => {
		
					if (vertice[0] === latitude) return true;
					vertice[0] = latitude;
					return true;
		
				},
			
			});
		
		}
		Vertice(params.vertice);
		Vertice(params.oppositeVertice);
		
	}
	
	/////////////////////////////overridden methods

}
export default RandomVerticeCircle;
