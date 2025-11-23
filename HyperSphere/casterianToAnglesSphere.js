/**
 * @module casterianToAnglesSphere
 * @description Converts Cartesian coordinates of a point on a sphere to polar coordinates.
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

import Vertice from './VerticeSphere.js'

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
function casterianToAngles(vertice) {

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
	return Vertice([latitude, longitude]);

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
//return cartesianToGeographicPolar(vertice);

export default casterianToAngles;
