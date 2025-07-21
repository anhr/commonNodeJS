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

		const π = Math.PI, min = anglesRange.longitude.min, max  = anglesRange.longitude.max, range = anglesRange.longitude.range, b = 100, a = (1 - b)/π;

		//случайные углы вычисляются только с одной стороны от params.oppositeVertice.
		//Поэтому случайные углы разделяю на две части.
		//В каждой части диапазон случайных углов уменьшаю в два раза.
		//Случайным образом выбираем direction - какую часть вычисляем сначала.
		//Это нужно для того, чтобы при вычислении randomVertice, без вычисления облака случайных вершин, randomVertice случайно оказывалась с разных сторон от params.oppositeVertice.
		//let direction = Math.random() > 0.5 ? 1 : -1;
		
		//overridden methods
		
		Object.defineProperty(this, 'angles', {
			
			get: function() {

				const r = params.r === undefined ? Math.random() : params.r,//, a = max - min, b = min;
					arc = params.vertice.longitude - params.oppositeVertice.longitude,
/*					
					p = Math.pow(r, 1 / (a * Math.abs(arc) + b));
				console.log('r = ' + r + ' p = ' + p);
				let angle = (direction * range * p)
					/ 2//В каждой части случайных углов диапазон случайных углов уменьшаю в два раза
					+ params.oppositeVertice.longitude - π;
				direction = -direction;
*/				
//					p = Math.atan(r - 0.5) * (0.5 / Math.atan(0.5));
					d = a * Math.abs(arc) + b,
					p = Math.atan((r - 0.5) * d) * ((0.5 + d / (2 * b)) / Math.atan(0.5 * d));
//					p = Math.atan((r - 0.5) * d) * (0.5 / Math.atan(0.5 * d));
//					p = Math.atan((r - 0.5) * d) * (1 / Math.atan(0.5 * d));
				console.log('r = ' + r + ' p = ' + p);
				let angle = range * p + params.oppositeVertice.longitude;
				
				//normalize angle
				if (angle > π) angle -= range;
				else if(angle < -π) angle += range;
				
				return [[angle]];
				
			},
			
		});
		
		/////////////////////////////overridden methods

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
