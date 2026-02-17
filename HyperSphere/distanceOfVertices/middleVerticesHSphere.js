/**
 * @module middleVerticesHSphere
 * @description Moves vertices to the middle position of the opposite vertices of the vertice edges for hupersphere
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
//import three from '../../three.js'

middleVertices.middlePosition = (points, boCloud, boCreateHypersphere, _this) => {
 
	//https://chat.deepseek.com/a/chat/s/8024be13-9782-4432-b29b-7c318db972d0
	/*
	Заданы несколько точек на поверхности гиперсферы в декартовой системе координат. Начало координат в центре гиперсферы.
	Найти точку на поверхности гиперсферы, равноудаленную от заданных точек.
	Написать код на javascript.
	*/
	class HypersphereEquidistantPoint {
		/**
		 * Находит точку на гиперсфере, равноудаленную от заданных точек
		 * @param {Array<Array<number>>} points - Массив точек на гиперсфере
		 * @param {boolean} [boCloud=false] true - generates a random vertice cloud.
		 * @param {boolean} [boCreateHypersphere=true] true - creates a random vertices hypersphere.
		 * @returns {Array<number>} Точка на гиперсфере, равноудаленная от заданных
		 */
		static findEquidistantPoint(points, boCloud = false, boCreateHypersphere = true) {

			const n = points[0].length; // Размерность пространства
			const radius = _this.r;

			if (_this.classSettings.debug) {

				if (!points || points.length === 0) {
					console.error(sHyperSphere3D + ': findEquidistantPoint. Должна быть задана хотя бы одна точка');
					return;
				}

				// Проверка, что все точки имеют одинаковую размерность
				for (let point of points) {
					if (point.length !== n) {
						console.error(sHyperSphere3D + ': findEquidistantPoint. Все точки должны иметь одинаковую размерность');
						return;
					}
				}

			}

			// 1. Находим среднее арифметическое всех точек (центроид)
			const centroid = new Array(n).fill(0);

			for (let i = 0; i < n; i++) {
				for (let j = 0; j < points.length; j++) {
					centroid[i] += points[j][i];
				}
				centroid[i] /= points.length;
			}

			// 2. Нормализуем, чтобы получить точку на гиперсфере
			const norm = Math.sqrt(centroid.reduce((sum, val) => sum + val * val, 0));

			_this.setArc(radius, 1 - norm);

			let middleVertice;

			if (norm < 7e-17) {

				// центроид в начале координат

				const oppositeVertices = points;

				//https://chat.deepseek.com/a/chat/s/85a1d029-0033-437b-a750-c58f9590bd4c
				/*
				Дана сфера. На поверхности сферы заданы три точки в декартовой системе координат. Начало координат находится в центре сферы.
		Построить плоскость, проходящую через заданные три точки.
		Построить нормаль к этой плоскости такую, что бы она проходила через центр сферы.
		Вычислить координаты двух точек, в которых норамль пересекается с данной сферой.
				*/
				/*
				Сделать подобные вычисления для гиперсферы в 4-мерном пространстве (n=4). Теперь уже заданы не три, а черыте точки на гиперсфере. Написать код на javascript.
				*/
				// Функция вычисления определителя 3x3
				// Функция вычисления определителя 3x3
				function det3x3(m) {
					return m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1])
						- m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0])
						+ m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);
				}

				// Скалярное произведение в 4D
				function dot4d(a, b) {
					return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
				}

				// Вычитание векторов в 4D
				function sub4d(a, b) {
					return [a[0] - b[0], a[1] - b[1], a[2] - b[2], a[3] - b[3]];
				}

				// Норма вектора в 4D
				function norm4d(v) {
					return Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2] + v[3] * v[3]);
				}

				// Нормализация вектора в 4D
				function normalize4d(v) {
					const n = norm4d(v);
					if (n < 1e-12) return v;
					return [v[0] / n, v[1] / n, v[2] / n, v[3] / n];
				}

				// Проекция вектора u на вектор v
				function project4d(u, v) {
					const scale = dot4d(u, v) / dot4d(v, v);
					return [v[0] * scale, v[1] * scale, v[2] * scale, v[3] * scale];
				}

				// Ортогонализация Грама-Шмидта для набора векторов
				function gramSchmidt4d(vectors) {
					const basis = [];

					for (let i = 0; i < vectors.length; i++) {
						let v = vectors[i].slice();

						// Вычитаем проекции на все предыдущие базисные векторы
						//				for (let j = 0; j < i; j++)
						for (let j = 0; j < basis.length; j++) {
							const proj = project4d(v, basis[j]);
							v = sub4d(v, proj);
						}

						// Если вектор не нулевой, добавляем в базис
						if (norm4d(v) > 1e-10) {
							basis.push(normalize4d(v));
						}
					}

					return basis;
				}

				// Генерация случайного вектора в 4D
				function randomVector4d() {
					// Генерируем случайные числа с нормальным распределением
					// для равномерного распределения на сфере
					let v = [
						Math.random() - 0.5,
						Math.random() - 0.5,
						Math.random() - 0.5,
						Math.random() - 0.5
					];

					// Немного вариативности
					const n = norm4d(v);
					if (n > 1e-12) {
						v = [v[0] / n, v[1] / n, v[2] / n, v[3] / n];
					}

					return v;
				}

				// Находит случайную нормаль, ортогональную заданному подпространству
				function findRandomNormal(subspaceBasis) {
					// Начинаем со случайного вектора
					let normal = randomVector4d();

					// Делаем его ортогональным ко всем векторам базиса подпространства
					for (const basisVec of subspaceBasis) {
						const proj = project4d(normal, basisVec);
						normal = sub4d(normal, proj);
					}

					// Нормализуем
					const n = norm4d(normal);
					if (n < 1e-12) {
						// Случай, когда случайный вектор лежит в подпространстве
						// Попробуем другой подход: найдем любой вектор, не входящий в span
						for (let attempt = 0; attempt < 10; attempt++) {
							normal = randomVector4d();
							let isOrthogonal = true;
							for (const basisVec of subspaceBasis) {
								if (Math.abs(dot4d(normal, basisVec)) > 0.1) {
									isOrthogonal = false;
									break;
								}
							}
							if (isOrthogonal && norm4d(normal) > 1e-10) {
								return normalize4d(normal);
							}
						}

						// Если не получилось, возьмем стандартный базисный вектор
						// и сделаем его ортогональным
						normal = [1, 0, 0, 0];
						for (const basisVec of subspaceBasis) {
							const proj = project4d(normal, basisVec);
							normal = sub4d(normal, proj);
						}
					}

					return normalize4d(normal);
				}

				// Основная функция
				function findIntersectionPoints4D(p1, p2, p3, p4) {
					// Проверка размерности
					if (p1.length !== 4 || p2.length !== 4 || p3.length !== 4 || p4.length !== 4) {
						console.error(sHyperSphere3D + ": findIntersectionPoints4D. Все точки должны быть 4-мерными [x,y,z,w]");
						return;
					}

					// Вычисляем векторы из p1 к другим точкам
					const v1 = sub4d(p2, p1);
					const v2 = sub4d(p3, p1);
					const v3 = sub4d(p4, p1);

					// Вычисляем компоненты нормали как миноры 3x3
					const a = det3x3([
						[v1[1], v1[2], v1[3]],
						[v2[1], v2[2], v2[3]],
						[v3[1], v3[2], v3[3]]
					]);

					const b = -det3x3([
						[v1[0], v1[2], v1[3]],
						[v2[0], v2[2], v2[3]],
						[v3[0], v3[2], v3[3]]
					]);

					const c = det3x3([
						[v1[0], v1[1], v1[3]],
						[v2[0], v2[1], v2[3]],
						[v3[0], v3[1], v3[3]]
					]);

					const d = -det3x3([
						[v1[0], v1[1], v1[2]],
						[v2[0], v2[1], v2[2]],
						[v3[0], v3[1], v3[2]]
					]);

					// Проверка на вырожденность
					const normSq = a * a + b * b + c * c + d * d;
					let normal;
					let isDegenerate = false;

					if (normSq < 1e-12) {

						//Вырожденный случай: точки лежат в подпространстве меньшей размерности
						isDegenerate = true;
						//console.log("Вырожденный случай: точки лежат в подпространстве меньшей размерности");
						//console.log("Будет выбрана случайная нормаль");

						// Находим базис подпространства, содержащего точки
						const vectors = [v1, v2, v3];
						const basis = gramSchmidt4d(vectors);

						//console.log(`Размерность подпространства: ${basis.length}`);

						// Выбираем случайную нормаль, ортогональную этому подпространству
						normal = findRandomNormal(basis);

					} else {
						normal = [a, b, c, d];
						const N = Math.sqrt(normSq);
						normal = [a / N, b / N, c / N, d / N];
					}

					// Радиус гиперсферы (расстояние от центра до любой точки)
					const R = radius;

					//случайным образом из двух точек пересечения нормали с гиперсферой выбираем одну
					const scale = Math.random() > 0.5 ? R : -R;
					return [
						normal[0] * scale,
						normal[1] * scale,
						normal[2] * scale,
						normal[3] * scale
					];
				}

				const point = findIntersectionPoints4D(
					[
						oppositeVertices[0][0],
						oppositeVertices[0][1],
						oppositeVertices[0][2],
						oppositeVertices[0][3],
					],
					[
						oppositeVertices[1][0],
						oppositeVertices[1][1],
						oppositeVertices[1][2],
						oppositeVertices[1][3],
					],
					[
						oppositeVertices[2][0],
						oppositeVertices[2][1],
						oppositeVertices[2][2],
						oppositeVertices[2][3],
					],
					[
						oppositeVertices[3][0],
						oppositeVertices[3][1],
						oppositeVertices[3][2],
						oppositeVertices[3][3],
					],
				);

				middleVertice = Position(point);


			} else {

				// Нормализуем векторы
				middleVertice = centroid.map(coord => coord / norm);

			}
			_this.randomVertices(_this.vertice2angles(middleVertice), _this.object3D.parent, boCloud, boCreateHypersphere);
			return middleVertice;

		}

		/**
		 * Вычисляет расстояние между двумя точками на гиперсфере (хордальное расстояние)
		 * @param {Array<number>} point1 
		 * @param {Array<number>} point2 
		 * @returns {number} Расстояние
		 */
		static calculateDistance(point1, point2) {
			let sum = 0;
			for (let i = 0; i < point1.length; i++) {
				const diff = point1[i] - point2[i];
				sum += diff * diff;
			}
			return Math.sqrt(sum);
		}

		/**
		 * Вычисляет сферическое (угловое) расстояние между точками
		 * @param {Array<number>} point1 
		 * @param {Array<number>} point2 
		 * @returns {number} Угол в радианах
		 */
		static calculateAngularDistance(point1, point2) {
			let dot = 0;
			for (let i = 0; i < point1.length; i++) {
				dot += point1[i] * point2[i];
			}
			// Ограничиваем dot для избежания ошибок округления
			dot = Math.max(-1, Math.min(1, dot));
			return Math.acos(dot);
		}

		/**
		 * Альтернативный метод: через минимизацию суммы квадратов расстояний
		 * @param {Array<Array<number>>} points 
		 * @param {number} iterations - Количество итераций для градиентного спуска
		 * @returns {Array<number>}
		 */
		static findEquidistantPointGradient(points, iterations = 1000) {
			const n = points[0].length;

			// Начинаем со случайной точки на гиперсфере
			let point = this.randomPointOnHypersphere(n);

			const learningRate = 0.01;

			for (let iter = 0; iter < iterations; iter++) {
				// Вычисляем градиент функции потерь
				const gradient = new Array(n).fill(0);

				for (let p of points) {
					const dist = this.calculateDistance(point, p);
					for (let i = 0; i < n; i++) {
						gradient[i] += (point[i] - p[i]) / (dist + 1e-10);
					}
				}

				// Обновляем точку
				for (let i = 0; i < n; i++) {
					point[i] -= learningRate * gradient[i];
				}

				// Проецируем обратно на гиперсферу
				const norm = Math.sqrt(point.reduce((sum, val) => sum + val * val, 0));
				for (let i = 0; i < n; i++) {
					point[i] /= norm;
				}

				// Уменьшаем learning rate
				if (iter % 100 === 0 && iter > 0) {
					learningRate *= 0.9;
				}
			}

			return point;
		}

		/**
		 * Генерирует случайную точку на гиперсфере
		 * @param {number} dimension - Размерность
		 * @returns {Array<number>}
		 */
		static randomPointOnHypersphere(dimension) {
			const point = new Array(dimension);
			let sum = 0;

			// Генерируем случайные нормальные числа
			for (let i = 0; i < dimension; i++) {
				point[i] = Math.random() * 2 - 1;
				sum += point[i] * point[i];
			}

			// Нормализуем
			const norm = Math.sqrt(sum);
			return point.map(coord => coord / norm);
		}
	}

	return HypersphereEquidistantPoint.findEquidistantPoint(points, boCloud, boCreateHypersphere);

}
export default middleVertices;