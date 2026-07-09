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

import Position from './position.js'

//const range = anglesRange.longitude.range, latitudeMax = anglesRange.latitude.max, latitudeMin = anglesRange.latitude.min, π = Math.PI;
/*https://gemini.google.com/app/fed6dc3ff178ba36
Задана точка на сфере в полярной системе координат. Начало координат находится в центре сферы.
Положение точки обозначить как
angles.longitude - долгота в диапазоне от -π до π.
angles.latitude - широта в диапазоне от -π/2 на южном полюсе до π/2 на северном полюсе.
Радиус сферы обозначить как r.
Долгота и широта может выходить за пределы заданного диапазона.
Вычислить координаты точки в декартовой системе координат.
Написать код на javascript

Заменить сферу на гиперсферу.
Тогда в положении точки появится новый угол altitude в диапазоне от 0 до π.
Также появится новая координата точки w = vertice[3] в декартовой системе координат.
*/
const sAnglesToCartesian = 'polarToCartesian';
/**
 * Вычисляет 4D декартовы координаты (x, y, z, w) точки на гиперсфере.
 * @param {object} angles - Объект с углами в радианах.
 * @param {float} angles.latitude - Широта (от -π/2 до π/2).
 * @param {float} angles.longitude - Долгота (от -π до π).
 * @param {float} angles.altitude - Угол в 4-е измерение (от 0 до π).
 * @param {float} [r=1] - Радиус гиперсферы.
 * @param {object|boolean} [debug] - debug = object Выводит на консоль сообщение об ошибке если координаты вычислились не корректно.
 * @returns {array} Массив с декартовыми координатами [x, y, z, w].
 */
export function polarToCartesian(angles, r=1, debug) {
	const lat = angles.latitude;
	const lon = angles.longitude;
	const alt = angles.altitude;

	// Вычисляем компоненту, которая проецируется на 3D-подпространство (x, y, z)
	const r_xyz = r * Math.sin(alt);

	// Координата в четвертом измерении
	const w = r * Math.cos(alt);

	// Стандартные сферические координаты, но масштабированные r_xyz
	const x = r_xyz * Math.cos(lat) * Math.cos(lon);
	const y = r_xyz * Math.cos(lat) * Math.sin(lon);
	const z = r_xyz * Math.sin(lat);
	
	if(debug && (isNaN(x) || isNaN(y) || isNaN(z) || isNaN(w))) console.error(sAnglesToCartesian + ': Invalid cartesian: x = ' + x + ', y = ' + y + ', z = ' + z + ', w = ' + w);

//	return { x, y, z, w };
	return Position([x, y, z, w]);
}
/*
// --- Пример ---
const params = {
	latitude: Math.PI / 6,   // 30 градусов
	longitude: Math.PI / 4,  // 45 градусов
	altitude: Math.PI / 3    // 60 градусов
};

const coords4D = hypersphereToCartesian(100, params);
console.log("4D Coordinates:", coords4D);
*/
/*
Результат будет примерно:
{
  x: 61.23,
  y: 61.23,
  z: 43.30,
  w: 50.00
}
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
Написать код на javascript.

Заменить сферу на гиперсферу.
Тогда в положении точки появится новая координата w = vertice[3].
Также появится новый угол в полярной системе координат altitude в диапазоне от 0 до π.
*/
const sCartesianToAngles = 'cartesianToPolar';
/**
 * Преобразует декартовы координаты 4D (x, y, z, w) в гиперсферические.
 * @param {object} vertice - объект x, y, z, w декартовых координат.
 * @param {object|boolean} [debug] - debug = object Выводит на консоль сообщение об ошибке если углы вычислились не корректно.
 * @returns {{altitude: number, latitude: number, longitude: number}} Объект с полярными координатами в радианах.
 */
export function cartesianToPolar(vertice, debug) {
	const x = vertice.x;
	const y = vertice.y;
	const z = vertice.z;
	const w = vertice.w;
	const r = Math.sqrt(x * x + y * y + z * z + w * w);

	// altitude рассчитывается корректно через acos (от 0 до PI)
	const altitude = Math.acos(w / r);

	// Считаем длину проекции на плоскость XY для определения четверти широты
	const rXY = Math.sqrt(x * x + y * y);

	let latitude, longitude;

	//точка в 4D-пространстве оказывается на самой оси W (то есть её декартовы координаты x = 0, y = 0, z = 0), её проекция на всё трехмерное пространство XYZ сжимается в сингулярную точку — ноль.
	if (rXY < 0.0001 && Math.abs(z) < 0.0001) {
		latitude = 0;
		longitude = 0;
	} else {
		// Math.atan2(z, rXY) сохраняет правильный знак и четверть широты
		latitude = Math.atan2(z, rXY);
		longitude = Math.atan2(y, x);
	}

	if (debug && (isNaN(altitude) || isNaN(latitude) || isNaN(longitude))) console.error(sCartesianToAngles + ': Invalid angles: altitude = ' + altitude + ', latitude = ' + latitude + ', longitude = ' + longitude);
	return angles([altitude, latitude, longitude]);
//	return { latitude, longitude, altitude };
}
/*
export function cartesianToPolar(vertice, debug) {

	const x = vertice.x;//, xx = x * x;
	const y = vertice.y;//, yy = y * y;
	const z = vertice.z;//, zz = z * z;
	const w = vertice.w;//, ww = w * w;
	const xyz = x * x + y * y + z * z;

	// 1. Полный радиус гиперсферы
	const R = Math.sqrt(xyz + w * w);

	if (R < 1e-10) {
		console.error(sCartesianToAngles + ': Under constraction');
//		return { r: 0, altitude: 0, latitude: 0, longitude: 0 };
		return angles([0, 0, 0]);
	}

	// 2. Вычисление Altitude (относительно оси W)
	// Диапазон [0, PI]
	const altitude = Math.acos(w / R);

	// Вычисляем радиус проекции в 3D пространстве (xyz)
	const rXYZ = Math.sqrt(xyz);

	// Если rXYZ близок к 0, значит точка лежит на оси W, 
	// и широта с долготой не определены (принимаем за 0)
	if (rXYZ < 1e-10) {
		return angles([altitude, 0, 0]);
	}

	// 3. Вычисление Latitude (аналогично 3D сфере)
	// Диапазон [-PI/2, PI/2]
	const latitude = Math.asin(z / rXYZ);

	// 4. Вычисление Longitude
	// Диапазон (-PI, PI]
	const longitude = Math.atan2(y, x);
	
	if(debug && (isNaN(altitude) || isNaN(latitude) || isNaN(longitude))) console.error(sCartesianToAngles + ': Invalid angles: altitude = ' + altitude + ', latitude = ' + latitude + ', longitude = ' + longitude);
	return angles([altitude, latitude, longitude]);
}
*/

/*
// --- Тест ---
const vertice = [1, 1, 1, 1]; // Точка "в углу" 4D куба
const result = cartesianToHyperspherical(vertice);

console.log("Результаты (в радианах):", result);
console.log(`Altitude: ${(result.altitude * 180 / Math.PI).toFixed(2)}°`);
console.log(`Latitude: ${(result.latitude * 180 / Math.PI).toFixed(2)}°`);
console.log(`Longitude: ${(result.longitude * 180 / Math.PI).toFixed(2)}°`);
*/
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
