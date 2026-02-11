/**
 * @module HyperSphere3D
 * @description 3 dimensional [hypersphere]{@link https://en.wikipedia.org/wiki/N-sphere}.
 * All the vertices form a [hypersphere]{@link https://en.wikipedia.org/wiki/N-sphere}.
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


import Sphere from './sphere.js';
import three from '../three.js'
import FibonacciSphereGeometry from '../FibonacciSphere/FibonacciSphereGeometry.js'
import anglesRange from './anglesRange.js'
import RandomVertice from './RandomVertice/randomVerticeHSphere.js';
//import RandomCloud from './RandomVertice/randomCloudHSphere.js';
import * as utils from './utilsHSphere.js'
//import Vertice from './VerticeHypersphere.js'
import Position from './position.js'

const sHyperSphere3D = 'HyperSphere3D',
	π = Math.PI;

/**
 * 3 dimensional [hypersphere]{@link https://en.wikipedia.org/wiki/N-sphere}.
 * All the vertices form a [hypersphere]{@link https://en.wikipedia.org/wiki/N-sphere}.
 * @class
 * @extends Sphere
 */
class HyperSphere3D extends Sphere {

	/**
	 * @param {Options} options See <a href="../../../master/jsdoc/Options/Options.html" target="_blank">Options</a>.
	 * @param {object} [classSettings] <b>Circle</b> class settings. See <a href="./module-HyperSphere-HyperSphere.html" target="_blank">HyperSphere classSettings</a>.
	 **/
	constructor(options, classSettings) { super(options, classSettings); }

	//base methods

	planesGeometry(changedAngleId, aAngleControls, planeGeometry, longitudeId){

		const latitudeId = longitudeId - 1, altitudeId = latitudeId - 1;
		switch(changedAngleId){

			case altitudeId:
				planeGeometry(longitudeId);
				planeGeometry(latitudeId )
				break;
			case latitudeId:
			case longitudeId:
				planeGeometry(altitudeId);
				super.planesGeometry(changedAngleId, aAngleControls, planeGeometry, longitudeId); break;
			default: console.error(sHyperSphere3D + ': Update planes. Invalid changedAngleId = ' + changedAngleId);
				
		}
		
	}
	get axes() { return {

			//порядок размещения осей в декартовой системе координат
			//нужно что бы широта двигалась по оси y а долгота вращалась вокруг y
			indices: [3, 1, 2, 0],

		}
		
	}
	newHyperSphere(options, classSettings) { return new HyperSphere3D(options, classSettings); }
	get cookieName() { return '3DUniverse' + (this.classSettings.cookieName ? '_' + this.classSettings.cookieName : ''); }
	get altitudeRange() {

		return anglesRange.altitude;
/*		
		return {
			angleName: 'Altitude',
			min: 0, max: π,//Высота меняется в диапазоне 0 180 градусов. В центре гиперсферы вершины белого и  синего цвета по краям зеленого
		}
*/		
	}
	setW() {

		const classSettings = this.classSettings, options = classSettings.settings.options;
		if (!options.scales) options.scales = {};
		if (!options.scales.w) options.scales.w = {};
		const w = options.scales.w;
		w.max = classSettings.rRange.max;
		w.min = classSettings.rRange.min;
		
		//Если не установить это значение, то будет неверно устанавливаться значение w в geometry.attributes.position
		//потому что в гиперсфере w в geometry.attributes.position это не цвет вершины, а координата
		//Для проверки открыть http://localhost/anhr/commonNodeJS/master/HyperSphere/Examples/hyperSphere.html
		//Выбрать вершину
		//сделать шаг проигрывтеля →
		//Исчезнет ошибка HyperSphere: Invalid vertice[2] sum = 0.6560590267181396. r = 1
		w.isColor = false;
		
	};
	get probabilityDensity() {

		const _this = this;
		return {

			sectorValueName: 'sectorVolume',
			sectorValue: (probabilityDensity, i) => {

				const sector = probabilityDensity[i], r = this.classSettings.r, hb = sector.hb, ht = sector.ht;
				
				//объем сегмента
				//https://en.wikipedia.org/wiki/Sphere
				//https://www.sjsu.edu/faculty/watkins/ndim.htm сводная таблица площади и объема для сфер разной размерности
				sector[this.probabilityDensity.sectorValueName] = Math.PI * Math.PI * r * r * (ht - hb);
				return sector[this.probabilityDensity.sectorValueName];

			},
			get unverseValue() {
				
				//https://www.sjsu.edu/faculty/watkins/ndim.htm
				//Dimension = 4. Bounding Area = 2ππRRR
				const r = _this.classSettings.r;
				return 2 * Math.PI * Math.PI * r * r * r//Bounding Area

			}

		}

	}
	defaultAngles() { return { count: 5, } }//random pentachoron https://en.wikipedia.org/wiki/5-cell

	pushRandomAngle(verticeAngles) {

		//https://en.wikipedia.org/wiki/3-sphere#Hyperspherical_coordinates
		
		//Altitude
		//добиваемся равномерного распределения вершин в объеме шара
		//исчезло уплотнение в ядре шара
		verticeAngles.push(Math.acos(Math.random() * (Math.random() > 0.5 ? 1: -1)));
		
		//добиваемся равномерного распределения вершин в объеме шара
		//исчезло уплотнение на оси через полюса по оси i
		this.pushRandomLatitude(verticeAngles);
		
		this.pushRandomLongitude(verticeAngles);

	}
	color() {}
	name( getLanguageCode ) {

		//Localization
		
		const lang = {

			name: "Hypersphere",

		};

		const _languageCode = getLanguageCode();

		switch (_languageCode) {

			case 'ru'://Russian language

				lang.name = 'Гиперсфера';

				break;

		}
		return lang.name;
		
	}

	intersection(color, scene) {

		const THREE = three.THREE,
			classSettings = this.classSettings,
			mesh = new THREE.Mesh(new FibonacciSphereGeometry(((classSettings.intersection.position + 1) / 2) * classSettings.r, 320),
				//new THREE.MeshBasicMaterial( { color: color, wireframe: true } )//сетка
				new THREE.MeshLambertMaterial( {//полупрозрачные грани

					color: color,//"lightgray",
					opacity: 0.2,
					transparent: true,
					side: THREE.DoubleSide//от этого ключа зависят точки пересечения объектов

				} )
			);
		
		const lights = [], lightsCount = 6;
		for (let i = 0; i < lightsCount; i++) lights.push(new THREE.DirectionalLight(color, i > 2 ? 1 : 0.5));

		lights[0].position.set(200, 0, 0);
		lights[1].position.set(0, 200, 0);
		lights[2].position.set(0, 0, 200);
		lights[3].position.set(-200, 0, 0);
		lights[4].position.set(0, -200, 0);
		lights[5].position.set(0, 0, -200);

		for (let i = 0; i < lightsCount; i++) scene.add(lights[i]);

		return mesh;
		
	}

	//Overridden methods from base class

	middlePosition(points, boCloud = false, boCreateHypersphere = true) {

		const _this = this;
		
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

/*					
					const settings = _this.classSettings.settings;
					const radius = _this.classSettings.overriddenProperties.r(settings.guiPoints ? settings.guiPoints.timeId : settings.options.player.getTimeId());
*/					
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

							/*
							// Проверяем, что нормаль действительно ортогональна
							console.log("Проверка ортогональности:");
							for (let i = 0; i < basis.length; i++) {
								const dot = dot4d(normal, basis[i]);
								console.log(`  Скалярное произведение с базисом ${i}: ${dot.toFixed(10)}`);
							}
							*/
						} else {
							normal = [a, b, c, d];
							const N = Math.sqrt(normSq);
							normal = [a / N, b / N, c / N, d / N];
						}

						// Радиус гиперсферы (расстояние от центра до любой точки)
						const R = radius;
//						const R = Math.sqrt(p1[0] * p1[0] + p1[1] * p1[1] + p1[2] * p1[2] + p1[3] * p1[3]);

						//случайным образом из двух точек пересечения нормали с гиперсферой выбираем одну
						const scale = Math.random() > 0.5 ? R : -R;
						return [
							normal[0] * scale,
							normal[1] * scale,
							normal[2] * scale,
							normal[3] * scale
						];
						/*
						// Вычисляем две точки пересечения
						const scale = R; // normal уже нормализован
						const point1 = [
							normal[0] * scale,
							normal[1] * scale,
							normal[2] * scale,
							normal[3] * scale
						];
			
						const point2 = [
							normal[0] * -scale,
							normal[1] * -scale,
							normal[2] * -scale,
							normal[3] * -scale
						];
			
						return {
							normal: normal,
							radius: R,
							isDegenerate: isDegenerate,
							intersectionPoints: [point1, point2]
						};
						*/
					}

					/*
					// Тестовые функции
					function testNonDegenerate() {
						console.log("=== Тест 1: Невырожденный случай ===");
						const p1 = [1, 0, 0, 0];
						const p2 = [0, 1, 0, 0];
						const p3 = [0, 0, 1, 0];
						const p4 = [0, 0, 0, 1];
			
						const result = findIntersectionPoints4D(p1, p2, p3, p4);
						console.log("Нормаль:", result.normal.map(x => x.toFixed(4)));
						console.log("Точки пересечения:");
						console.log("  P+:", result.intersectionPoints[0].map(x => x.toFixed(4)));
						console.log("  P-:", result.intersectionPoints[1].map(x => x.toFixed(4)));
						console.log("Радиус:", result.radius.toFixed(4));
						console.log("Вырожденный?:", result.isDegenerate);
						console.log();
					}
			
					function testDegenerate1() {
						console.log("=== Тест 2: Вырожденный случай (3D подпространство) ===");
						// Все точки лежат в гиперплоскости w=0 (3D пространство)
						const p1 = [1, 0, 0, 0];
						const p2 = [0, 1, 0, 0];
						const p3 = [0, 0, 1, 0];
						const p4 = [0.5, 0.5, 0, 0]; // Тоже в w=0
			
						const result = findIntersectionPoints4D(p1, p2, p3, p4);
						console.log("Нормаль:", result.normal.map(x => x.toFixed(4)));
						console.log("Точки пересечения:");
						console.log("  P+:", result.intersectionPoints[0].map(x => x.toFixed(4)));
						console.log("  P-:", result.intersectionPoints[1].map(x => x.toFixed(4)));
						console.log("Радиус:", result.radius.toFixed(4));
						console.log("Вырожденный?:", result.isDegenerate);
						console.log();
					}
			
					function testDegenerate2() {
						console.log("=== Тест 3: Вырожденный случай (2D плоскость) ===");
						// Все точки лежат в плоскости z=0, w=0 (2D пространство)
						const p1 = [1, 0, 0, 0];
						const p2 = [0, 1, 0, 0];
						const p3 = [0.5, 0.5, 0, 0];
						const p4 = [-0.5, 0.5, 0, 0];
			
						const result = findIntersectionPoints4D(p1, p2, p3, p4);
						console.log("Нормаль:", result.normal.map(x => x.toFixed(4)));
						console.log("Точки пересечения:");
						console.log("  P+:", result.intersectionPoints[0].map(x => x.toFixed(4)));
						console.log("  P-:", result.intersectionPoints[1].map(x => x.toFixed(4)));
						console.log("Радиус:", result.radius.toFixed(4));
						console.log("Вырожденный?:", result.isDegenerate);
						console.log();
					}
			
					function testDegenerate3() {
						console.log("=== Тест 4: Вырожденный случай (1D линия) ===");
						// Все точки лежат на одной линии
						const p1 = [1, 0, 0, 0];
						const p2 = [2, 0, 0, 0];
						const p3 = [3, 0, 0, 0];
						const p4 = [4, 0, 0, 0];
			
						try {
							const result = findIntersectionPoints4D(p1, p2, p3, p4);
							console.log("Нормаль:", result.normal.map(x => x.toFixed(4)));
							console.log("Точки пересечения:");
							console.log("  P+:", result.intersectionPoints[0].map(x => x.toFixed(4)));
							console.log("  P-:", result.intersectionPoints[1].map(x => x.toFixed(4)));
							console.log("Радиус:", result.radius.toFixed(4));
							console.log("Вырожденный?:", result.isDegenerate);
						} catch (error) {
							console.log("Ошибка:", error.message);
						}
						console.log();
					}
			
					// Проверка, что точки действительно лежат на гиперсфере
					function verifyPoints(result) {
						console.log("Проверка расстояний от центра:");
						for (let i = 0; i < 2; i++) {
							const p = result.intersectionPoints[i];
							const dist = Math.sqrt(p[0] * p[0] + p[1] * p[1] + p[2] * p[2] + p[3] * p[3]);
							console.log(`  Точка ${i + 1}: расстояние = ${dist.toFixed(6)}, радиус = ${result.radius.toFixed(6)}`);
						}
					}
			
					// Запуск тестов
					console.log("=== Тестирование алгоритма для 4D гиперсферы ===\n");
					testNonDegenerate();
					testDegenerate1();
					testDegenerate2();
					testDegenerate3();		// Вычисление точек пересечения нормали со сферой
					*/

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

//					return Position(point);

				} else {

					// Нормализуем векторы
					middleVertice = centroid.map(coord => coord / norm);
//					const result = centroid.map(coord => coord / norm);
	
					/*
					// 3. Проверяем расстояния до всех точек
					const distances = points.map(point =>
						this.calculateDistance(result, point)
					);
	
					console.log('Расстояния до заданных точек:', distances);
					*/
	
//					return result;

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

		/*
		// Пример использования
		function example() {
			try {
				// Пример для 3D сферы (обычной сферы)
				console.log('Пример 1: 3D сфера');
				const points3D = [
					[1, 0, 0],
					[0, 1, 0],
					[0, 0, 1]
				];

				const result3D = HypersphereEquidistantPoint.findEquidistantPoint(points3D);
				console.log('Точка на сфере:', result3D);
				console.log('Норма:', Math.sqrt(result3D.reduce((sum, val) => sum + val * val, 0)));

				// Пример для 4D гиперсферы
				console.log('\nПример 2: 4D гиперсфера');
				const points4D = [
					[1, 0, 0, 0],
					[0, 1, 0, 0],
					[0, 0, 1, 0],
					[0, 0, 0, 1]
				];

				const result4D = HypersphereEquidistantPoint.findEquidistantPoint(points4D);
				console.log('Точка на гиперсфере:', result4D);
				console.log('Норма:', Math.sqrt(result4D.reduce((sum, val) => sum + val * val, 0)));

				// Пример с симметричными точками
				console.log('\nПример 3: Симметричные точки');
				const symmetricPoints = [
					//[1, 0, 0],
					//[-1, 0, 0],
					//[0, 1, 0],
					//[0, -1, 0]
					
					[1, 0, 0, 0],
					[-1, 0, 0, 0],
					[0, 1, 0, 0],
					[0, -1, 0, 0]
				];

				const resultSymmetric = HypersphereEquidistantPoint.findEquidistantPoint(symmetricPoints);
				console.log('Точка на сфере:', resultSymmetric);
				console.log('Норма:', Math.sqrt(resultSymmetric.reduce((sum, val) => sum + val * val, 0)));

				// Проверка расстояний
				const distances = symmetricPoints.map(point =>
					HypersphereEquidistantPoint.calculateDistance(resultSymmetric, point)
				);
				console.log('Расстояния до каждой точки:', distances);

				return {
					'3D_example': result3D,
					'4D_example': result4D,
					'symmetric_example': resultSymmetric
				};

			} catch (error) {
				console.error('Ошибка:', error.message);
			}
		}

		// Запуск примера
		example();
		*/

/*		
		// Экспорт класса для использования в других модулях
		if (typeof module !== 'undefined' && module.exports) {
			module.exports = HypersphereEquidistantPoint;
		}
*/		
		return HypersphereEquidistantPoint.findEquidistantPoint(points, boCloud, boCreateHypersphere);

	}
	ZeroArray() { return [0, 0, 0]; }
	Vertice(angles) { return utils.angles(angles); }
	/**
	 * Converts a vertice position to vertice angles.
	 * @param {array} vertice array of the vertice axes
	 * @returns Vertice angles.
	 */
	vertice2angles(vertice) {

		/*https://chat.deepseek.com/a/chat/s/5c55507d-4660-4e04-8920-0e1c791a9c3c
		Задана точка vertice на 3D гиперсфере в декартовой системе координат. Начало координат находится в центре сферы.
		Положение точки обозначить как
		x = vertice[0]
		y = vertice[1]
		z = vertice[2]
		w = vertice[3]
		Вычислить координаты точки в полярной системе координат.
		Углы в полярной системе координат обозначить как:
		longitude - долгота (азимутальный угол)  в диапазоне от -π до π,
		latitude - широта (зенитный угол) в диапазоне -π/2 на южном полюсе до π/2 на северном полюсе.,
		altitude - полярный угол от оси W  в диапазоне от 0 до π.
		Радиус сферы обозначить как r.
		Написать код на javascript.
		*/
		function cartesianToPolar4D(vertice) {

//			const [x, y, z, w] = vertice;
			const x = vertice.x, y = vertice.y, z = vertice.z, w = vertice.w;

			// Вычисляем радиус сферы
			const r = Math.sqrt(x * x + y * y + z * z + w * w);

			// Если радиус равен 0, возвращаем нулевые координаты
			if (r === 0) {

/*
				return {
					longitude: 0,
					latitude: 0,
					altitude: 0,
					radius: 0
				};
*/
				return utils.angles([0, 0, 0]);

			}

			// Вычисляем altitude (угол от оси W) в диапазоне [0, π]
			const altitude = Math.acos(w / r);

			// Проекция на 3D пространство (x,y,z)
			const r_xyz = Math.sqrt(x * x + y * y + z * z);

			// Вычисляем latitude (широта) в диапазоне [-π/2, π/2]
			let latitude;
			if (r_xyz === 0) {
				// Если проекция на (x,y,z) равна 0, точка на полюсе W-оси
				latitude = (w >= 0) ? Math.PI / 2 : -Math.PI / 2;
			} else {
				latitude = Math.asin(z / r_xyz);
			}

			// Проекция на плоскость (x,y)
			const r_xy = Math.sqrt(x * x + y * y);

			// Вычисляем longitude (долгота) в диапазоне [-π, π]
			let longitude;
			if (r_xy === 0) {
				// Если проекция на (x,y) равна 0, долгота не определена, устанавливаем 0
				longitude = 0;
			} else {
				longitude = Math.atan2(y, x);
				// atan2 уже возвращает значение в диапазоне [-π, π]
			}

/*
			return {
				longitude: longitude,    // долгота [-π, π]
				latitude: latitude,      // широта [-π/2, π/2]  
				altitude: altitude,      // полярный угол от оси W [0, π]
				radius: r               // радиус сферы
			};
*/
			return utils.angles([altitude, latitude, longitude]);

		}
/*
		// Пример использования:
		const vertice2 = [1, 0, 0, 0];  // Точка на гиперсфере
		const polarCoords = cartesianToPolar4D(vertice2);

		console.log("Декартовы координаты:", vertice2);
		console.log("Полярные координаты:");
		console.log("Долгота (longitude):", polarCoords.longitude);
		console.log("Широта (latitude):", polarCoords.latitude);
		console.log("Полярный угол (altitude):", polarCoords.altitude);
		console.log("Радиус (radius):", polarCoords.radius);
*/		
		return cartesianToPolar4D(Position(vertice));

	}
	a2v(angles, r) {

		/*https://chat.deepseek.com/a/chat/s/831d9a90-2396-4b09-b548-288415124814
		Задана точка на 3D гиперсфере в полярной системе координат. Начало координат находится в центре 3D гиперсферы.
		Положение точки обозначить как
		angles.longitude - долгота (азимутальный угол)  в диапазоне от -π до π,
		angles.latitude - широта (зенитный угол) в диапазоне -π/2 на южном полюсе до π/2 на северном полюсе.,
		angles.altitude - полярный угол от оси W  в диапазоне от 0 до π.
		Радиус сферы обозначить как r.
		Долгота, широта и полярный угол могут выходить за пределы заданного диапазона.
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
		 * @param {number} r - Радиус сферы.
		 * @param {object} angles - Объект с углами.
		 * @param {number} angles.latitude - Широта (от -π/2 до π/2).
		 * @param {number} angles.longitude - Долгота (от -π до π).
		 * @returns {array} Массив с декартовыми координатами [x, y, z].
		 */
/*		
		function polarToCartesian(angles, r) {
			// Нормализуем углы к стандартным диапазонам
			const normalizedLon = normalizeAngle(angles.longitude, anglesRange.longitude.min, anglesRange.longitude.max);
			const normalizedLat = normalizeAngle(angles.latitude,  anglesRange.latitude.min, anglesRange.latitude.max);
			const normalizedAlt = normalizeAngle(angles.altitude,  anglesRange.altitude.min,  anglesRange.altitude.max);

			// Вычисляем декартовы координаты
			const x = r * Math.sin(normalizedAlt) * Math.cos(normalizedLat) * Math.cos(normalizedLon);
			const y = r * Math.sin(normalizedAlt) * Math.cos(normalizedLat) * Math.sin(normalizedLon);
			const z = r * Math.sin(normalizedAlt) * Math.sin(normalizedLat);
			const w = r * Math.cos(normalizedAlt);

//			return { x, y, z, w };
			return [ x, y, z, w ];
		}

		function normalizeAngle(angle, min, max) {
			const range = max - min;

			// Приводим угол к диапазону [min, max)
			let normalized = angle;
			while (normalized < min) {
				normalized += range;
			}
			while (normalized >= max) {
				normalized -= range;
			}

			return normalized;
		}
*/
		// Альтернативная версия с более простой нормализацией
		function polarToCartesian(angles, r) {

/*			
			// Используем остаток от деления для нормализации
			const lon = ((angles.longitude + Math.PI) % (2 * Math.PI)) - Math.PI;
			const lat = ((angles.latitude + Math.PI / 2) % Math.PI) - Math.PI / 2;
			const alt = angles.altitude % Math.PI;
*/			
			const lon = angles.longitude;
			const lat = angles.latitude;
			const alt = angles.altitude;

			// Вычисляем декартовы координаты
			const x = r * Math.sin(alt) * Math.cos(lat) * Math.cos(lon);
			const y = r * Math.sin(alt) * Math.cos(lat) * Math.sin(lon);
			const z = r * Math.sin(alt) * Math.sin(lat);
			const w = r * Math.cos(alt);

//			return { x, y, z, w };
			return [ x, y, z, w ];
		}
/*		
		// Пример использования
		const angles2 = {
			longitude: Math.PI / 4,    // 45°
			//latitude: Math.PI / 6,     // 30°
			latitude: Math.PI / 2 + 0.1,//out of range
			altitude: Math.PI / 3      // 60°
		};
		const radius = 1;

		const coords2 = Position(polarToCartesian(angles2, radius));
		console.log('Декартовы координаты:', coords2);
		const angles3 = this.vertice2angles(coords2);
		const coords3 = Position(polarToCartesian(angles2, radius));

		// Проверка: расстояние от начала координат должно быть равно радиусу
		const distance = Math.sqrt(coords.x ** 2 + coords.y ** 2 + coords.z ** 2 + coords.w ** 2);
		console.log('Расстояние от центра:', distance); // Должно быть равно radius
*/		
		return polarToCartesian(angles, r);

	}
	get verticeEdgesLengthMax() { return 4/*6*/; }//нельзя добавлть новое ребро если у вершины уже 6 ребра
	get dimension() { return 4; }//space dimension
	get verticesCountMin() { return 4; }
/*
	getRandomMiddleAngles(oppositeVertices) {
		
		//https://chat.deepseek.com/a/chat/s/85a1d029-0033-437b-a750-c58f9590bd4c

//		Дана сфера. На поверхности сферы заданы три точки в декартовой системе координат. Начало координат находится в центре сферы.
//Построить плоскость, проходящую через заданные три точки.
//Построить нормаль к этой плоскости такую, что бы она проходила через центр сферы.
//Вычислить координаты двух точек, в которых норамль пересекается с данной сферой.

//		Сделать подобные вычисления для гиперсферы в 4 - мерном пространстве(n = 4).Теперь уже заданы не три, а черыте точки на гиперсфере.Написать код на javascript.

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
				for (let j = 0; j < basis.length; j++)
				{
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

				// Проверяем, что нормаль действительно ортогональна
				//console.log("Проверка ортогональности:");
				//for (let i = 0; i < basis.length; i++) {
				//	const dot = dot4d(normal, basis[i]);
				//	console.log(`  Скалярное произведение с базисом ${i}: ${dot.toFixed(10)}`);
				//}

			} else {
				normal = [a, b, c, d];
				const N = Math.sqrt(normSq);
				normal = [a / N, b / N, c / N, d / N];
			}

			// Радиус гиперсферы (расстояние от центра до любой точки)
			const R = Math.sqrt(p1[0] * p1[0] + p1[1] * p1[1] + p1[2] * p1[2] + p1[3] * p1[3]);

			//случайным образом из двух точек пересечения нормали с гиперсферой выбираем одну
			const scale = Math.random() > 0.5 ? R : -R;
			return [
				normal[0] * scale,
				normal[1] * scale,
				normal[2] * scale,
				normal[3] * scale
			];

			//// Вычисляем две точки пересечения
			//const scale = R; // normal уже нормализован
			//const point1 = [
			//	normal[0] * scale,
			//	normal[1] * scale,
			//	normal[2] * scale,
			//	normal[3] * scale
			//];

			//const point2 = [
			//	normal[0] * -scale,
			//	normal[1] * -scale,
			//	normal[2] * -scale,
			//	normal[3] * -scale
			//];

			//return {
			//	normal: normal,
			//	radius: R,
			//	isDegenerate: isDegenerate,
			//	intersectionPoints: [point1, point2]
			//};

		}

		// Тестовые функции
		//function testNonDegenerate() {
		//	console.log("=== Тест 1: Невырожденный случай ===");
		//	const p1 = [1, 0, 0, 0];
		//	const p2 = [0, 1, 0, 0];
		//	const p3 = [0, 0, 1, 0];
		//	const p4 = [0, 0, 0, 1];

		//	const result = findIntersectionPoints4D(p1, p2, p3, p4);
		//	console.log("Нормаль:", result.normal.map(x => x.toFixed(4)));
		//	console.log("Точки пересечения:");
		//	console.log("  P+:", result.intersectionPoints[0].map(x => x.toFixed(4)));
		//	console.log("  P-:", result.intersectionPoints[1].map(x => x.toFixed(4)));
		//	console.log("Радиус:", result.radius.toFixed(4));
		//	console.log("Вырожденный?:", result.isDegenerate);
		//	console.log();
		//}

		//function testDegenerate1() {
		//	console.log("=== Тест 2: Вырожденный случай (3D подпространство) ===");
		//	// Все точки лежат в гиперплоскости w=0 (3D пространство)
		//	const p1 = [1, 0, 0, 0];
		//	const p2 = [0, 1, 0, 0];
		//	const p3 = [0, 0, 1, 0];
		//	const p4 = [0.5, 0.5, 0, 0]; // Тоже в w=0

		//	const result = findIntersectionPoints4D(p1, p2, p3, p4);
		//	console.log("Нормаль:", result.normal.map(x => x.toFixed(4)));
		//	console.log("Точки пересечения:");
		//	console.log("  P+:", result.intersectionPoints[0].map(x => x.toFixed(4)));
		//	console.log("  P-:", result.intersectionPoints[1].map(x => x.toFixed(4)));
		//	console.log("Радиус:", result.radius.toFixed(4));
		//	console.log("Вырожденный?:", result.isDegenerate);
		//	console.log();
		//}

		//function testDegenerate2() {
		//	console.log("=== Тест 3: Вырожденный случай (2D плоскость) ===");
		//	// Все точки лежат в плоскости z=0, w=0 (2D пространство)
		//	const p1 = [1, 0, 0, 0];
		//	const p2 = [0, 1, 0, 0];
		//	const p3 = [0.5, 0.5, 0, 0];
		//	const p4 = [-0.5, 0.5, 0, 0];

		//	const result = findIntersectionPoints4D(p1, p2, p3, p4);
		//	console.log("Нормаль:", result.normal.map(x => x.toFixed(4)));
		//	console.log("Точки пересечения:");
		//	console.log("  P+:", result.intersectionPoints[0].map(x => x.toFixed(4)));
		//	console.log("  P-:", result.intersectionPoints[1].map(x => x.toFixed(4)));
		//	console.log("Радиус:", result.radius.toFixed(4));
		//	console.log("Вырожденный?:", result.isDegenerate);
		//	console.log();
		//}

		//function testDegenerate3() {
		//	console.log("=== Тест 4: Вырожденный случай (1D линия) ===");
		//	// Все точки лежат на одной линии
		//	const p1 = [1, 0, 0, 0];
		//	const p2 = [2, 0, 0, 0];
		//	const p3 = [3, 0, 0, 0];
		//	const p4 = [4, 0, 0, 0];

		//	try {
		//		const result = findIntersectionPoints4D(p1, p2, p3, p4);
		//		console.log("Нормаль:", result.normal.map(x => x.toFixed(4)));
		//		console.log("Точки пересечения:");
		//		console.log("  P+:", result.intersectionPoints[0].map(x => x.toFixed(4)));
		//		console.log("  P-:", result.intersectionPoints[1].map(x => x.toFixed(4)));
		//		console.log("Радиус:", result.radius.toFixed(4));
		//		console.log("Вырожденный?:", result.isDegenerate);
		//	} catch (error) {
		//		console.log("Ошибка:", error.message);
		//	}
		//	console.log();
		//}

		//// Проверка, что точки действительно лежат на гиперсфере
		//function verifyPoints(result) {
		//	console.log("Проверка расстояний от центра:");
		//	for (let i = 0; i < 2; i++) {
		//		const p = result.intersectionPoints[i];
		//		const dist = Math.sqrt(p[0] * p[0] + p[1] * p[1] + p[2] * p[2] + p[3] * p[3]);
		//		console.log(`  Точка ${i + 1}: расстояние = ${dist.toFixed(6)}, радиус = ${result.radius.toFixed(6)}`);
		//	}
		//}

		//// Запуск тестов
		//console.log("=== Тестирование алгоритма для 4D гиперсферы ===\n");
		//testNonDegenerate();
		//testDegenerate1();
		//testDegenerate2();
		//testDegenerate3();		// Вычисление точек пересечения нормали со сферой

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
		return this.vertice2angles(Position([point[0], point[1], point[2], point[3]]));
		
	}
*/
	/**
	 * @param {THREE.Scene} scene [THREE.Scene]{@link https://threejs.org/docs/index.html?q=sce#api/en/scenes/Scene}
	 * @param {Options} options See <a href="../../jsdoc/Options/Options.html" target="_blank">Options</a>.
	 * @param {object} randomVerticesSettings See <b>randomVerticesSettings</b> of the <a href="./module-HyperSphere-RandomVertices.html" target="_blank">RandomVertices</a> class.
	 * @returns new RandomVertices child class.
	 */
	newRandomVertices(scene, options, randomVerticesSettings) { return new RandomVertices(scene, options, randomVerticesSettings); }
	get RandomVertice() { return RandomVertice; }
//	get RandomCloud() { return RandomCloud; }

}

//const sRandomVertices = 'RandomVertices'

export default HyperSphere3D;

const _display = (element, boDisplay) => { element.style.display = boDisplay === false ? 'none' : 'block'; }
