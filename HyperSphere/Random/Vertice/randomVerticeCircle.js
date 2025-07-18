/**
 * @module RandomVertice
 * @description Generates random angles between a vertice and its opposite vertice in 1D hypersphere.
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

const sRandomVerticesCircle = 'RandomVerticesCircle';
/**
 * Generates random angles between a vertice and its opposite vertice in 1D hypersphere.
 * @class
 */
class RandomVerticeCircle extends RandomVertice {

	/**
	 * Generates random angles between a vertice and its opposite vertice in 1D hypersphere.
	 */
	constructor(params) {

		super(params);

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
	
	get angles() {
		
		return this.params.oppositeVertice;
		
	}
	
	/////////////////////////////overridden methods

}
export default RandomVerticeCircle;
