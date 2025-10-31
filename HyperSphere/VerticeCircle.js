/**
 * @module VerticeCircle
 * @description Adds a longitude property to the vertice angles array for the circle hypersphere.
 * All the vertices form a circle.
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

/**
 * Adds a longitude property to the vertice angles array for the circle hypersphere.
 * @param {array} vertice array of the vertice angles. Array length is 1. array[0] is longitude.
 * @returns {array} Array with longitude property.
 */
const Vertice = (vertice) => {

	if (vertice.longitude != undefined) return;
	if (vertice.length === 0) vertice.push(0);
	Object.defineProperty(vertice, 'longitude', {

		get: () => { return vertice[0]; },
		set: (longitude) => {

			if (vertice[0] === longitude) return true;
			vertice[0] = longitude;
			return true;

		},

	});
	return vertice;

}

export default Vertice;
