/**
 * @module utilsHyperSphere
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

import anglesRange from '../anglesRange.js'

const π = Math.PI,
	latitudeRange = anglesRange.latitude.range, latitudeMax = anglesRange.latitude.max, latitudeMin = anglesRange.latitude.min,
	longitudeRange = anglesRange.longitude.range, longitudeMax = anglesRange.longitude.max, longitudeMin = anglesRange.longitude.min;

/**
 * normalize a latitude to range between anglesRange.longitude.min and anglesRange.longitude.max.
 * @param {float} angle angle for normalization.
 * @returns normalized angle.
 */
export const normalizeLatitude = (angle) => {

	if (angle > latitudeMax) {

//console.error('angle > ' + latitudeMax);							
		angle -= range;
		if (angle > latitudeMax)
			console.error('angle > ' + latitudeMax);

	} else {

		if (angle < latitudeMin) {
			
//console.error('angle < ' + latitudeMin);
			angle += range;
			if (angle < latitudeMin)
				console.error('angle < ' + latitudeMin);

		}

	}
	return angle;

}
//parameters for b = arc * a + c,
//const a = (1 / π) - 1, c = π;

/**
 * The multiplier for calculating the tangent, which is used to calculate randomAngles.
 * @param {object} [params={}] See the <b>params</b> of the <a href="./module-RandomVertice-RandomVertice.html" target="_blank"><b>RandomVertice</b></a> constructor for details.
 * @returns multiplier.
 */
export const b = (params) => {

	//for atan((random + 0.5) * b)
	return π / params.arc;
		
}
