/**
 * @module middleVerticesCircle
 * @description Moves vertices to the middle position of the opposite vertices of the vertice edges for circle
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

import middleVertices from './middleVertices.js'
import RandomVertice from '../RandomVertice/randomVerticeCircle.js';
import * as utils from '../utilsCircle.js'

const π = Math.PI;

middleVertices.RandomVertice = RandomVertice;
middleVertices.middlePosition = (points, boCloud, boCreateHypersphere, _this) => {

	//https://chat.deepseek.com/a/chat/s/348ed591-765f-4ab2-8924-a3546b62ef24
	/*
	Заданы несколько точек на поверхности окружности в декартовой системе координат. Начало координат в центре окружности.
	Найти точку на поверхности окружности, равноудаленную от заданных точек. Написать код на javascript.
	*/
	/**
	 * Находит точку на окружности, равноудаленную от заданных точек
	 * @param {Array} points - Массив точек вида [{x, y}, {x, y}, ...]
	 * @returns {Object} Точка на окружности {x, y} или null, если решение не найдено
	 */
	function findEquidistantPointOnCircle(points) {

		if (!points || points.length === 0) {
			console.error(sCircle + ': findEquidistantPointOnCircle. No points');
			return null;
		}

		const radius = _this.r;

		/*
		// 1. Проверяем, что все точки лежат на окружности
		const radius = Math.sqrt(points[0].x * points[0].x + points[0].y * points[0].y);
	
		for (let i = 1; i < points.length; i++) {
			const r = Math.sqrt(points[i].x * points[i].x + points[i].y * points[i].y);
			if (Math.abs(r - radius) > 1e-10) {
				console.warn('Не все точки лежат на окружности одного радиуса!');
				return null;
			}
		}
		*/

		// 2. Если только одна точка, возвращаем диаметрально противоположную
		if (points.length === 1) {
			console.error(sCircle + ': findEquidistantPointOnCircle. Если только одна точка, возвращаем диаметрально противоположную');
			return {
				x: -points[0].x,
				y: -points[0].y
			};
		}

		// 3. Вычисляем среднее направление (центр масс точек)
		let sumX = 0;
		let sumY = 0;

		for (const point of points) {
			sumX += point.x;
			sumY += point.y;
		}

		const avgX = sumX / points.length;
		const avgY = sumY / points.length;

		// 4. Нормализуем вектор среднего направления к длине радиуса
		const length = Math.sqrt(avgX * avgX + avgY * avgY);
		_this.setArc(radius, radius - length);

		let middleVertice, middleVerticeAngles;

		if (length < 1e-10) {

			//Противоположные вершины расположены на противоположных краях окружности. В этом случае с равной вероятностью средняя вершина может распологаться с одной или с другой половины окружности.
			middleVerticeAngles = utils.angles([((_this.vertice2angles(points[0])[0] + _this.vertice2angles(points[1])[0]) / 2) + (Math.random() > 0.5 ? 0 : π)])
			middleVertice = _this.a2v(middleVerticeAngles, radius);

		} else {

			const scale = radius / length;
			const result = {
				x: avgX * scale,
				y: avgY * scale
			};

			// 5. Также проверяем противоположную точку (она тоже может быть решением)
			const opposite = {
				x: -result.x,
				y: -result.y
			};

			// 6. Выбираем точку с минимальной дисперсией расстояний
			middleVertice = selectBetterPoint(result, opposite, points);
			middleVerticeAngles = _this.vertice2angles(middleVertice);

		}

		middleVertices.randomVertices(middleVerticeAngles, _this.object3D.parent, boCloud, boCreateHypersphere, _this, RandomVertice);
//		_this.randomVertices(middleVerticeAngles, _this.object3D.parent, boCloud, boCreateHypersphere);
		return middleVertice;

	}

	/**
	 * Выбирает точку с меньшей дисперсией расстояний до заданных точек
	 */
	function selectBetterPoint(point1, point2, points) {
		const variance1 = calculateDistanceVariance(point1, points);
		const variance2 = calculateDistanceVariance(point2, points);

		return variance1 <= variance2 ? point1 : point2;
	}

	/**
	 * Вычисляет дисперсию расстояний от точки до всех заданных точек
	 */
	function calculateDistanceVariance(point, points) {
		const distances = points.map(p => {
			const dx = p.x - point.x;
			const dy = p.y - point.y;
			return Math.sqrt(dx * dx + dy * dy);
		});

		const mean = distances.reduce((sum, d) => sum + d, 0) / distances.length;
		const variance = distances.reduce((sum, d) => sum + Math.pow(d - mean, 2), 0) / distances.length;

		return variance;
	}

	return findEquidistantPointOnCircle(points);

}
export default middleVertices;