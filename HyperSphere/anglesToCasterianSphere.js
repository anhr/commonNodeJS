/**
 * @module anglesToCasterianSphere
 * @description Converts polar coordinates of a point on a sphere to Cartesian coordinates.
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
function anglesToCartesian(angles, r=1) {

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

export default anglesToCartesian;
