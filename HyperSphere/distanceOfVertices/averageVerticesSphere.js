/**
 * @module middleVerticesSphere
 * @description Moves vertices to the middle position of the opposite vertices of the vertice edges for sphere
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

import averageVertices from './averageVertices.js'
import three from '../../three.js'
import { RandomVerticeSphere as RandomVertice } from '../RandomVertice/randomVerticeSphere.js';

averageVertices.RandomVertice = RandomVertice;
averageVertices.averageDistance = (points, boCloud, boCreateHypersphere, _this) => {
 
 //https://chat.deepseek.com/a/chat/s/24dea3aa-eccd-4e97-a3e3-3f3ff0631de6
 /*
 Заданы несколько точек на поверхности сферы в декартовой системе координат. Начало координат в центре сферы.
 Найти точку на поверхности сферы, равноудаленную от заданных точек.
 Написать код на javascript.
 */
 /**
  * Находит точку на поверхности сферы (с центром в начале координат),
  * которая приблизительно равноудалена от заданных точек.
  * @param {Array<Array<number>>} points - Массив точек [x, y, z]
  * @returns {Array<number>} Точка на сфере [x, y, z] или null, если точки не заданы
  */
 function findEquidistantPoint(points) {
	 
	if (!points || points.length === 0) {
		console.error(sSphere + ': findEquidistantPoint. Должна быть задана хотя бы одна точка');
		return;
	}
 
	// Суммируем все векторы точек
	let sumVector = [0, 0, 0];
	for (const point of points) {
		sumVector[0] += point[0];
		sumVector[1] += point[1];
		sumVector[2] += point[2];
	}
	 
	// Радиус сферы
	const sphereRadius = _this.r;
 
	// Нормализуем сумму, чтобы получить точку на сфере
	const [x, y, z] = sumVector;
	const length = Math.sqrt(x * x + y * y + z * z);
	_this.setArc(sphereRadius, 1 - length / points.length);
	 
	let middleVertice;//, middleVerticeAngles;
 
	if (length < 7e-17) {
 
		// Все точки в начале координат или их сумма нулевая, то есть все три противоположные вершины образуют равнобедренный треугольник на плоскости, проходящей через центр сферы
 
		const THREE = three.THREE;
		const oppositeVertices = points;
 
		//http://localhost/anhr/commonNodeJS/master/HyperSphere/Examples/NormalSphere.html
 
		// Заданные три точки на сфере (в декартовых координатах)
		if (oppositeVertices.length != 3) console.error(sSphere + ': findEquidistantPoint. Invalid oppositeVertices.length = ' + oppositeVertices.length);
		const oppositeVerticeA = oppositeVertices[0];
		const pointA = new THREE.Vector3(oppositeVerticeA.x, oppositeVerticeA.y, oppositeVerticeA.z);//(3, 4, 0);
		const oppositeVerticeB = oppositeVertices[1];
		const pointB = new THREE.Vector3(oppositeVerticeB.x, oppositeVerticeB.y, oppositeVerticeB.z);//(0, 3, -4);
		const oppositeVerticeC = oppositeVertices[2];
		const pointC = new THREE.Vector3(oppositeVerticeC.x, oppositeVerticeC.y, oppositeVerticeC.z);//(-3, -4, 0);
 
		// Функция для построения плоскости по трем точкам
		function createPlaneFromPoints(p1, p2, p3) {
 
			// Вычисляем нормаль плоскости через векторное произведение
			const v1 = new THREE.Vector3().subVectors(p2, p1);
			const v2 = new THREE.Vector3().subVectors(p3, p1);
			const normal = new THREE.Vector3().crossVectors(v1, v2).normalize();
			return normal;
 
		}
 
		// Функция для вычисления точек пересечения нормали со сферой
		function findSphereNormalIntersections(normal, radius) {
			// Нормаль уже проходит через центр сферы (начало координат)
			// Уравнение пересечения: |t * normal| = radius
			// t = ±radius (так как normal - единичный вектор)
 
			return normal.clone().multiplyScalar(Math.random() > 0.5 ? radius : -radius);
 
		}
		const normal = createPlaneFromPoints(pointA, pointB, pointC);
 
		// Вычисление точек пересечения нормали со сферой
		middleVertice = findSphereNormalIntersections(normal, sphereRadius);
 
	} else middleVertice = [x / length, y / length, z / length];
 
	averageVertices.randomVertices(_this.vertice2angles(middleVertice), _this.object3D.parent, boCloud, boCreateHypersphere, _this, RandomVertice);
	return middleVertice;
	 
	}
	return findEquidistantPoint(points);

}
export default averageVertices;