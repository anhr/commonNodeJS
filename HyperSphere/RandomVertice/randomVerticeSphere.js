/**
 * @module RandomVerticeCircle
 * @description Generates a random vertice near the opposite vertice in 2D hypersphere.
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

const sRandomVerticesSphere = 'RandomVerticesSphere';
/**
 * Generates a random vertice near the opposite vertice in 2D hypersphere.
 * @class
 */
class RandomVerticeSphere extends RandomVertice {

	/**
	 * Generates a random vertice near the opposite vertice in 2D hypersphere.
	 * @param {object} [params={}] See the <b>params</b> of the <b>RandomVertice</b> constructor.
	 */
	constructor(params) {

		super(params);

		if (params.arc === undefined) Object.defineProperty(params, 'arc', {
	
				get: () => {
					
					const vertice = params.vertice, oppositeVertice = params.oppositeVertice;
	//				return params.randomVertices.getArcAngle(vertice, oppositeVertice);
					
					//DeepSeek. вычислить угол между двумя точками на поверхности шара
					//векторы
					//A=(R,ϕ1,λ1 ) - vertice
					const ϕ1 = vertice[0], λ1 = vertice[1];
					//B=(R,ϕ2,λ2 ) - oppositeVertice
					const ϕ2 = oppositeVertice[0], λ2 = oppositeVertice[1];
					//где
					//ϕ — широта (от −90° до 90°),
					//λ — долгота (от −180° до 180°),
					const arccos = Math.acos, sin = Math.sin, cos = Math.cos;
					const θ = arccos(sin(ϕ1) * sin(ϕ2) + cos(ϕ1) * cos(ϕ2) * cos(λ1 - λ2));
					if (isNaN(θ)) console.error(sSphere + ': getArcAngle. Invalid θ = ' + θ);
					return θ;
				
				},
		
			});
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

				randomAngles = [[params.latitude != undefined ? params.latitude : 0, this.anglesCircle(utils)]];
				return randomAngles[0];
				
			},
			set: (anglesNew) => {},
			
		});
		
		/////////////////////////////overridden methods

//		this.randomAngles;

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
export default RandomVerticeSphere;
