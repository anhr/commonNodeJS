/**
 * @module utilsCircle
 * @description utilities which is used to calculate randomAngles for sphere.
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

//import anglesRange from './anglesRange.js'
import Position from './position.js'

//const π = Math.PI, range = anglesRange.longitude.range, longitudeMax = anglesRange.longitude.max, longitudeMin = anglesRange.longitude.min;

/**
 * Converts polar coordinates of a point on a circle to Cartesian coordinates.
 * 
 * @param {Object} value - The object containing the angular position.
 * @param {number} value.longitude - The angular position (theta) of the point in radians.
 * @param {number} r - The radius of the circle.
 * @returns {number[]} An array containing the Cartesian coordinates [x, y].
 */
export function polarToCartesian({ longitude }, r) {
	// Property 'longitude' is extracted directly from the first argument
	const x = r * Math.cos(longitude);
	const y = r * Math.sin(longitude);

//	return [x, y];
	return Position([x, y]);
}
/**
 * Converts Cartesian coordinates to polar coordinates, returning only the angle.
 * 
 * @param {Object} coordinates - The object containing Cartesian coordinates.
 * @param {number} coordinates.x - The horizontal coordinate.
 * @param {number} coordinates.y - The vertical coordinate.
 * @returns {Object} An object containing the angular position 'longitude' in radians.
 */
export function cartesianToPolar({ x, y }) {
	// Calculate the angle (theta) in radians, ranging from -PI to PI
	const longitude = Math.atan2(y, x);

//	return { longitude };
	return angles([longitude]);
}

/**
 * Adds a longitude property to the vertice angles array for the circle hypersphere.
 * @param {array} vertice array of the vertice angles. Array length is 1. array[0] is longitude.
 * @returns {array} Array with longitude property.
 */
export const angles = (vertice) => {

	if (vertice.longitude != undefined) return vertice;
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

