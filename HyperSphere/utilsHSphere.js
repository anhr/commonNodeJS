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
/**
 * Преобразует декартовы координаты 4D (x, y, z, w) в гиперсферические.
 * * @param {number[]} vertice - Массив [x, y, z, w]
 * @returns {{altitude: number, latitude: number, longitude: number}} Объект с полярными координатами в радианах.
 */
export function cartesianToAngles(vertice) {
	const sSartesianToAngles = 'cartesianToAngles';
	const x = vertice[0];
	const y = vertice[1];
	const z = vertice[2];
	const w = vertice[3];

	// 1. Полный радиус гиперсферы
	const R = Math.sqrt(x * x + y * y + z * z + w * w);

	if (R === 0) {
		console.error(sSartesianToAngles + ': Under constraction');
//		return { r: 0, altitude: 0, latitude: 0, longitude: 0 };
		return angles([0, 0, 0]);
	}

	// 2. Вычисление Altitude (относительно оси W)
	// Диапазон [0, PI]
	const altitude = Math.acos(w / R);

	// Вычисляем радиус проекции в 3D пространстве (xyz)
	const rXYZ = Math.sqrt(x * x + y * y + z * z);

	// Если rXYZ близок к 0, значит точка лежит на оси W, 
	// и широта с долготой не определены (принимаем за 0)
	if (rXYZ < 1e-10) {
		console.error(sSartesianToAngles + ': Under constraction');
//		return { r: R, altitude, latitude: 0, longitude: 0 };
		return angles([altitude, 0, 0]);
	}

	// 3. Вычисление Latitude (аналогично 3D сфере)
	// Диапазон [-PI/2, PI/2]
	const latitude = Math.asin(z / rXYZ);

	// 4. Вычисление Longitude
	// Диапазон (-PI, PI]
	const longitude = Math.atan2(y, x);
/*
	return {
		r: R,
		altitude: altitude,
		latitude: latitude,
		longitude: longitude
	};
*/
	return angles([altitude, latitude, longitude]);
}

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
