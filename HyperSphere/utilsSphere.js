/**
 * @module utilsSphere
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

import anglesRange from './anglesRange.js'
//import Vertice from './VerticeSphere.js'

const range = anglesRange.longitude.range, latitudeMax = anglesRange.latitude.max, latitudeMin = anglesRange.latitude.min, π = Math.PI;

/**
 * normalize a circle angle to range between anglesRange.longitude.min and anglesRange.longitude.max.
 * @param {float} angle angle for normalization.
 * @returns normalized angle.
 */
export const normalizeAngle = (angle) => {

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

/*https://gemini.google.com/app/fed6dc3ff178ba36
Задана точка на сфере в полярной системе координат. Начало координат находится в центре сферы.
Положение точки обозначить как
angles.longitude - долгота в диапазоне от -π до π.
angles.latitude - широта в диапазоне от -π/2 на южном полюсе до π/2 на северном полюсе.
Радиус сферы обозначить как r.
Долгота и широта может выходить за пределы заданного диапазона.
Вычислить координаты точки в декартовой системе координат.
Написать код на javascript
*/
/**
 * Вычисляет декартовы координаты (x, y, z) точки на сфере,
 * заданной в полярной системе координат (r, широта, долгота).
 *
 * Предполагается, что:
 * - Широта (latitude) находится в диапазоне от -π/2 (южный полюс) до π/2 (северный полюс).
 * - Долгота (longitude) находится в диапазоне от -π до π.
 * - Углы заданы в радианах.
 *
 * @param {object} angles - Объект с углами.
 * @param {number} angles.latitude - Широта (от -π/2 до π/2).
 * @param {number} angles.longitude - Долгота (от -π до π).
 * @param {number} [r=1] - Радиус сферы.
 * @returns {array} Массив с декартовыми координатами [x, y, z].
 */
export function anglesToCartesian(angles, r = 1) {

	const lat = angles.latitude;
	const lon = angles.longitude;
	if (lon === undefined) console.error(sSphere + ': a2v. longitude = ' + lon);

	// Сначала рассчитываем проекцию радиус-вектора на плоскость XY (r_xy)
	// r_xy = r * cos(latitude)
	const r_xy = r * Math.cos(lat);

	// Вычисляем декартовы координаты:
	// x = r_xy * cos(longitude) = r * cos(lat) * cos(lon)
	const x = r_xy * Math.cos(lon);

	// y = r_xy * sin(longitude) = r * cos(lat) * sin(lon)
	const y = r_xy * Math.sin(lon);

	// z = r * sin(latitude)
	const z = r * Math.sin(lat);

	//			return { x, y, z };
	return [x, y, z];

}

/*
// --- Примеры использования ---

// 1. Точка на экваторе (широта 0), вдоль оси X (долгота 0)
// Ожидаемый результат: { x: 10, y: 0, z: 0 }
const point1 = anglesToCartesian({ latitude: 0, longitude: 0 }, 10);
console.log("Point 1 (Equator, X-axis):", point1);

// 2. Северный полюс (широта π/2)
// Ожидаемый результат: { x: 0, y: 0, z: 5 } (приближенно)
const point2 = anglesToCartesian({ latitude: Math.PI / 2, longitude: Math.PI / 4 }, 5);
console.log("Point 2 (North Pole):", point2);

// 3. Точка с широтой 45° (π/4) и долготой 90° (π/2)
// Ожидаемый результат: { x: 0, y: ~7.07, z: ~7.07 }
const point3 = anglesToCartesian({ latitude: Math.PI / 4, longitude: Math.PI / 2 }, 10);
console.log("Point 3 (45° N, 90° E):", point3);
*/

/*https://gemini.google.com/app/0d61322aa801d5a5
Задана точка vertice на сфере в декартовой системе координат. Начало координат находится в центре сферы.
Положение точки обозначить как
x = vertice[0]
y = vertice[1]
z = vertice[2]
Вычислить координаты точки в полярной системе координат.
Углы в полярной системе координат обозначить как:
longitude - долгота в диапазоне от -π до π.
latitude - широта в диапазоне от -π/2 на южном полюсе до π/2 на северном полюсе.
Написать код на javascript
*/
/**
 * Преобразует декартовы координаты (x, y, z) в географические полярные координаты
 * (r, latitude, longitude).
 *
 * @param {number[]} vertice - Массив [x, y, z] декартовых координат.
 * @returns {{r: number, latitude: number, longitude: number}} Объект с полярными координатами в радианах.
 */
export function casterianToAngles(vertice) {

	/*	
		const x = vertice[0];
		const y = vertice[1];
		const z = vertice[2];
	*/
	const x = vertice.x;
	const y = vertice.y;
	const z = vertice.z;

	// 1. Вычисление радиуса (r)
	const r = Math.sqrt(x * x + y * y + z * z);

	// Обработка случая, когда точка находится в центре сферы (r = 0)
	if (r === 0) {
		return { r: 0, latitude: 0, longitude: 0 };
	}

	// 2. Вычисление широты (latitude)
	// Используем Math.asin(z/r). Результат в радианах [-PI/2, PI/2].
	const latitude = Math.asin(z / r);

	// 3. Вычисление долготы (longitude)
	// Используем Math.atan2(y, x). Результат в радианах (-PI, PI].
	const longitude = Math.atan2(y, x);

	//			return { r, latitude, longitude };
	return angles([latitude, longitude]);

}

/*
// --- Примеры использования ---

// Пример 1: Северный полюс (широта +90° или +PI/2)
const vertice1 = [0, 0, 10];
const polar1 = casterianToAngles(vertice1);
console.log(`Декартовы: [${vertice1}] -> r=${polar1.r}, lat=${polar1.latitude.toFixed(4)} (90°), lon=${polar1.longitude.toFixed(4)} (0°)`);

// Пример 2: Точка на экваторе (широта 0), долгота 45°
const vertice2 = [1, 1, 0];
const polar2 = casterianToAngles(vertice2);
console.log(`Декартовы: [${vertice2}] -> r=${polar2.r.toFixed(4)}, lat=${polar2.latitude.toFixed(4)} (0°), lon=${polar2.longitude.toFixed(4)} (45°)`);

// Пример 3: Южный полюс (широта -90° или -PI/2)
const vertice3 = [0, 0, -5];
const polar3 = casterianToAngles(vertice3);
console.log(`Декартовы: [${vertice3}] -> r=${polar3.r}, lat=${polar3.latitude.toFixed(4)} (-90°), lon=${polar3.longitude.toFixed(4)} (0°)`);
*/

/**
 * Adds a longitude and latitude property to the vertice angles array for the sphere hypersphere.
 * @param {array} vertice array of the vertice angles. Array length is 2. array[0] is latitude. array[1] is longitude.
 * @returns {array} Array with longitude and latitude property.
 */
export const angles = (vertice) => {

	if (vertice.longitude != undefined) return vertice;
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
