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
			range = anglesRange.longitude.range,

			//parameters for b = arc * a + c,
			a = (1 / π) - 1, c = π,
			
			normalizeAngle = (angle) => {
					
				if (angle > π) {
					
					angle -= range;
					if (angle > π)
						console.error('angle > π')
					
				} else {
					
					if(angle < -π) angle += range;
					if (angle < -π)
						console.error('angle < -π')

				}
				return angle;

			};
		let randomAngles;

		//overridden methods

		Object.defineProperty(this, 'angles', {
			
			get: () => { return randomAngles; },
			set: (anglesNew) => { randomAngles = anglesNew; },
			
		});
		
		Object.defineProperty(this, 'randomAngles', {
			
			get: () => {

				const r = (params.r === undefined ? Math.random() : params.r) - 0.5,
					arc = Math.abs(normalizeAngle(params.vertice.longitude - params.oppositeVertice.longitude)),
					
					//arc = π, b = 1 все точки почти равномерно распределяются по кругу
					//arc = 0, b = π все точки стягиваются в одну точку
					//a = (1 / π) - 1, c = π
					b = arc * a + c,
					
					p = (
						tan(r * b) /
						tan(0.5 * b)//делим на tan(0.5 * b), что бы при минимальном и максимальном r, p получалось -1 и 1
					) *
					π;//Умножаем на π что бы при минимальном и максимальном r углы получались на противоположной от params.oppositeVertice.longitude стороне окружности.
						//Тем самым точки почти равномерно распределяются по окружности когда arc = π, тоесть вершина и противоположная вершина расположены на противоположных сторонах окружности
				
//				console.log('r = ' + r + ' p = ' + p);
				let angle = p + params.oppositeVertice.longitude;
				
				angle = normalizeAngle(angle);

				randomAngles = [[angle]];
				return randomAngles;
				
			},
			set: (anglesNew) => {},
			
		});
		
		/////////////////////////////overridden methods

		this.randomAngles;

	}
	
	//overridden methods
	
	ZeroArray() { return [0]; }
	Center(params) {
	
		const Vertice = (vertice) => {
		
			if (vertice.longitude != undefined) return;
			Object.defineProperty(vertice, 'longitude', {
				
				get: () => { return vertice[0]; },
				set: (longitude) => {
		
					if (vertice[0] === longitude) return true;
					vertice[0] = longitude;
//					if (params.randomVertices) params.randomVertices.changeCirclesPoints();
					return true;
		
				},
			
			});
		
		}
		Vertice(params.vertice);
		Vertice(params.oppositeVertice);
		
	}
/*	
	get angles() {
		
		return this.params.oppositeVertice;
		
	}
*/	
	
	/////////////////////////////overridden methods

}
export default RandomVerticeCircle;
