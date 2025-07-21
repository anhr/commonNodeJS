/**
 * @module RandomCloud
 * @description Generates a cloud of the random vertices around opposite vertice.
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
const sRandomCloud = 'RandomCloud',
	sOver = ': Please, override %s method in your ' + sRandomCloud + ' child class.';
/**
 * Generates a cloud of the random vertices around opposite vertice.
 * @class
 */
class RandomCloud {

	/**
	 * Generates a cloud of the random vertices around opposite vertice.
	 */
	constructor(params) {

	}
	
	//overridden methods
	
	get angles() { console.error(sRandomVertice + sOver.replace('%s', 'get angles')) }
	
	/////////////////////////////overridden methods

}
export default RandomCloud;
