/**
 * @module utils
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

import anglesRange from '../anglesRange.js'

const range = anglesRange.longitude.range, π = Math.PI;

/**
 * normalize a circle angle to range between anglesRange.longitude.min and anglesRange.longitude.max.
 * @param {float} angle angle for normalization.
 * @returns normalized angle.
 */
export const normalizeAngle = (angle) => {

	if (angle > π) {

		angle -= range;
		if (angle > π)
			console.error('angle > π')

	} else {

		if (angle < -π) angle += range;
		if (angle < -π)
			console.error('angle < -π')

	}
	return angle;

}
//parameters for b = arc * a + c,
const a = (1 / π) - 1, c = π;

/**
 * The multiplier for calculating the tangent, which is used to calculate randomAngles.
 * @param {object} [params={}] See the <b>params</b> of the <b>RandomVertice</b> constructor.
 * @returns multiplier.
 */
export const b = (params) => {
	
	const getArcAngle = (vertice, oppositeVertice) => {
		
		//DeepSeek. вычислить угол между двумя точками на поверхности шара
		//векторы
		//A=(R,ϕ1,λ1 ) - vertice
		const ϕ1 = vertice[0], λ1 = vertice[1];
		//B=(R,ϕ2,λ2 ) - oppositeVertice
		const ϕ2 = oppositeVertice[0], λ2 = oppositeVertice[1];
		//где
		//ϕ — широта (от −90° до 90°),
		//λ — долгота (от −180° до 180°),
		const arccos = Math.acos, sin = Math.sin, cos = Math.cos;
		const θ = arccos(sin(ϕ1) * sin(ϕ2) + cos(ϕ1) * cos(ϕ2) * cos(λ1 - λ2));
		if (isNaN(θ)) console.error(sSphere + ': getArcAngle. Invalid θ = ' + θ);
		return θ;
		
	}
	const arc = params.arc != undefined ? params.arc : Math.abs(normalizeAngle(getArcAngle(params.vertice, params.oppositeVertice))),
	
		//arc = π, b = 1 все точки почти равномерно распределяются по кругу
		//arc = 0, b = π все точки стягиваются в одну точку
		b = arc * a + c;
	
	return b;
		
}
