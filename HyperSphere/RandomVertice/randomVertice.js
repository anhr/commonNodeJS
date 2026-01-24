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
	π = Math.PI;
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

		const _this = this;

		params.oppositeVertice = new Proxy( params.oppositeVertice, {

			set: (oppositeVertice, name, value) => {

				switch (name) {
	
					case 'altitude':
					case 'latitude':
					case 'longitude':
						oppositeVertice[name] = value;
						_this.oppositeVerticeOnChange();
						return true;
						
				}
				oppositeVertice[name] = value;
				return true;
	
			},
			
		});
		
		if (params.verticesAngles && !params.verticesAngles.boNoNew) params.verticesAngles.length = 0;
		params.verticesAngles ||= [];
		
		this.Center(params);
		Object.defineProperty(this, 'angles', {
			
			get: () => { return this.getAngles(); },
			set: (anglesNew) => { this.setAngles(anglesNew); },
			
		});
		Object.defineProperty(this, 'randomAngles', {

			get: () => { return this.getRandomAngles(); },
			set: (anglesNew) => { },

		});
		
	}
	circlesPointsCount;
	arc(arc) { return π - arc; }
	
	//overridden methods
	
	get angles() { console.error(sRandomCloud + sOver.replace('%s', 'get angles')) }
	get randomAngles() { console.error(sRandomCloud + sOver.replace('%s', 'get randomAngles')) }
	
	/////////////////////////////overridden methods

}
export default RandomVertice;
