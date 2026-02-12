/**
 * @module utilsHSphere
 * @description utilities which is used to calculate randomAngles for hypersphere.
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

//const range = anglesRange.longitude.range, latitudeMax = anglesRange.latitude.max, latitudeMin = anglesRange.latitude.min, π = Math.PI;

/**
 * Adds a longitude, latitude and altitude property to the vertice angles array for the hypersphere.
 * @param {array} vertice array of the vertice angles. Array length is 3. array[0] is altitude. array[1] is latitude. array[2] is longitude.
 * @returns {array} Array with longitude and latitude property.
 */
export const angles = (vertice, altitude) => {

	if (vertice.longitude != undefined) return vertice;
	while (vertice.length < 3) vertice.unshift((vertice.length === 2) && (altitude != undefined) ? altitude : 0);
	Object.defineProperty(vertice, 'altitude', {

		get: () => { return vertice[0]; },
		set: (altitude) => {

			if (vertice[0] === altitude) return true;
			vertice[0] = altitude;
			return true;

		},

	});
	Object.defineProperty(vertice, 'latitude', {

		get: () => { return vertice[1]; },
		set: (latitude) => {

			if (vertice[1] === latitude) return true;
			vertice[1] = latitude;
			return true;

		},

	});
	Object.defineProperty(vertice, 'longitude', {

		get: () => { return vertice[2]; },
		set: (longitude) => {

			if (vertice[2] === longitude) return true;
			vertice[2] = longitude;
			return true;

		},

	});
	return vertice;

}
