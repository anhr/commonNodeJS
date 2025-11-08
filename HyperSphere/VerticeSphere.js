/**
 * @module VerticeSphere
 * @description Adds a longitude and latitude property to the vertice angles array for the sphere hypersphere.
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
 * Adds a longitude and latitude property to the vertice angles array for the sphere hypersphere.
 * @param {array} vertice array of the vertice angles. Array length is 2. array[0] is latitude. array[1] is longitude.
 * @returns {array} Array with longitude and latitude property.
 */
const Vertice = (vertice) => {

	if (vertice.longitude != undefined) return;
	while (vertice.length < 2) vertice.push(0);
	Object.defineProperty(vertice, 'latitude', {

		get: () => { return vertice[0]; },
		set: (latitude) => {

			if (vertice[0] === latitude) return true;
			vertice[0] = latitude;
			return true;

		},

	});
	Object.defineProperty(vertice, 'longitude', {

		get: () => { return vertice[1]; },
		set: (longitude) => {

			if (vertice[1] === longitude) return true;
			vertice[1] = longitude;
			return true;

		},

	});
	return vertice;

}

export default Vertice;
