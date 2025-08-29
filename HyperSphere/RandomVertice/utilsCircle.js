/**
 * @module utils
 * @description utilities which is used to calculate randomAngles for circle.
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

import anglesRange from '../anglesRange.js'

const π = Math.PI, range = anglesRange.longitude.range, longitudeMax = anglesRange.longitude.max, longitudeMin = anglesRange.longitude.min

/**
 * normalize a circle angle to range between anglesRange.longitude.min and anglesRange.longitude.max.
 * @param {float} angle angle for normalization.
 * @returns normalized angle.
 */
export const normalizeAngle = (angle) => {

	if (angle > longitudeMax) {

		angle -= range;
		if (angle > longitudeMax)
			console.error('angle > ' + longitudeMax);

	} else {

		if (angle < longitudeMin) angle += range;
		if (angle < longitudeMin)
			console.error('angle < ' + longitudeMin);

	}
	return angle;

}

//parameters for b = arc * a + c,
const a = (1 / π) - 1, c = π;

/**
 * The multiplier for calculating the tangent, which is used to calculate randomAngles.
 * @param {object} [params={}] See the <b>params</b> of the <a href="./module-RandomVertice-RandomVertice.html" target="_blank"><b>RandomVertice</b></a> constructor for details.
 * @returns multiplier.
 */
export const b = (params) => {
	
	const arc = params.arc != undefined ? params.arc : Math.abs(normalizeAngle(params.vertice.longitude - params.oppositeVertice.longitude)),
	
		//arc = π, b = 1 все точки почти равномерно распределяются по кругу
		//arc = 0, b = π все точки стягиваются в одну точку
		b = arc * a + c;
	
	return b;
		
}
