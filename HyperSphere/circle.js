/**
 * @module Circle
 * @description 1 dimensional [hypersphere]{@link https://en.wikipedia.org/wiki/N-sphere}.
 * All the vertices form a circle.
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


import HyperSphere from './hyperSphere.js';
import three from '../three.js'
import RandomVertice from './RandomVertice/randomVerticeCircle.js';
import RandomCloud from './RandomVertice/randomCloudCircle.js';
//import Vertice from './VerticeCircle.js'
import * as utils from './utilsCircle.js'

const sCircle = 'Circle',
	π = Math.PI;

/**
 * 1 dimensional [hypersphere]{@link https://en.wikipedia.org/wiki/N-sphere}.
 * All the vertices form a circle.
 * @class
 * @extends HyperSphere
 */
class Circle extends HyperSphere {

	/**
	 * @param {Options} options See <a href="../../../master/jsdoc/Options/Options.html" target="_blank">Options</a>.
	 * @param {object} [classSettings] <b>Circle</b> class settings. See <a href="./module-HyperSphere-HyperSphere.html" target="_blank">HyperSphere classSettings</a>.
	 **/
	constructor(options, classSettings) {

		super(options, classSettings);
		this.logHyperSphere();

	}

	//base methods

	planesGeometry(){}
	get axes() { return {

			//порядок размещения осей в декартовой системе координат
			//нужно что бы широта двигалась по оси y а долгота вращалась вокруг y
			indices: [1, 0],

		}

	}
	newHyperSphere(options, classSettings) { return new Circle(options, classSettings); }
	get cookieName(){ return 'Circle' + (this.classSettings.cookieName ? '_' + this.classSettings.cookieName : ''); }
	get probabilityDensity(){
		
		return {

			sectorValueName: 'sectorLength',
			sectorValue: (probabilityDensity, i) => {
				
				const sector = probabilityDensity[i], r = this.classSettings.r, hb = sector.hb, ht = sector.ht,
					angle = (hb) => {

						const M = Math.sqrt(r * r - hb * hb);//Прилежащий катет прямоугольного треугольника
							return Math.atan(hb / M);//угол прямоугольного треугольника https://poschitat.online/ugly-pryamougolnogo-treugolnika						
						
					}
				sector[this.probabilityDensity.sectorValueName] = Math.abs(r * (angle(hb) - angle(ht)) * 2);//длинна дуги сектора https://mnogoformul.ru/dlina-dugi#:~:text=%D0%94%D0%BB%D0%B8%D0%BD%D0%B0%20%D0%B4%D1%83%D0%B3%D0%B8%20%D0%BF%D0%BE%D0%BB%D0%BD%D0%BE%D0%B9%20%D0%BE%D0%BA%D1%80%D1%83%D0%B6%D0%BD%D0%BE%D1%81%D1%82%D0%B8%20%D1%80%D0%B0%D0%B2%D0%BD%D0%B0,%2C%20%D0%B3%D0%B4%D0%B5%20r%20%2D%20%D1%80%D0%B0%D0%B4%D0%B8%D1%83%D1%81%20%D0%BE%D0%BA%D1%80%D1%83%D0%B6%D0%BD%D0%BE%D1%81%D1%82%D0%B8.
				return sector[this.probabilityDensity.sectorValueName];
				
			},
			
		}
		
	}
	defaultAngles() { return { count: 3, } }//random triangle
	pushRandomAngle(verticeAngles) { this.pushRandomLongitude(verticeAngles); }
	name(getLanguageCode) {

		//Localization
		
		const lang = {

			name: "Circle",

		};

		const _languageCode = getLanguageCode();

		switch (_languageCode) {

			case 'ru'://Russian language

				lang.name = 'Окружность';

				break;

		}
		return lang.name;
		
	}

	intersection(color) {

		const THREE = three.THREE,
			classSettings = this.classSettings,
			settings = classSettings.settings,
			options = settings.options,
			r = classSettings.r,
			ip = classSettings.intersection.position,//координата сечения
			mesh = new THREE.Line( new THREE.BufferGeometry().setFromPoints( [
				new THREE.Vector3( options.scales.x.min * r, 0, 0 ), new THREE.Vector3( options.scales.x.max * r, 0, 0 )
			] ), new THREE.LineBasicMaterial( { color: color } ) ),
			vectors = settings.object.geometry.position;
		mesh.position.copy(new THREE.Vector3(0, ip * r, 0));

		//длинна дуги
		const angle = (leg) => Math.asin(leg / r),
			ai = angle(ip);//угол наклона точки пересечения окружности с линией сечения
		vectors.forEach(vector => {

			const a = angle(vector.y) - ai;//угол между векторами текущей вершины и точки пересечения
			console.log(a);
		})
		return mesh;
		
	}

	randomVertices(middleVerticeAngles) {
		
		const classSettings = this.classSettings;
		if (!classSettings.randomArc) return;

		const params = {
				
				//vertice: angles,
				oppositeVertice: middleVerticeAngles,
				arc: this.arc,
				debug: classSettings.debug ? { notRandomVertices: true,} : false,
				
			}
		if (this.randomVertice) this.randomVertice.params = params;
		else {
			
			this.randomVertice = new this.RandomCloud(params);
			this.hsRandomVertice = this.randomVertice.getHyperSphere(classSettings.settings.options, classSettings, this.middleVerticeColor);

		}
		
	}

	//Overridden methods from base class

	middlePosition(points) {
	
		const _this = this;
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

/*			
			const settings = _this.classSettings.settings;
			const radius = _this.classSettings.overriddenProperties.r(settings.guiPoints ? settings.guiPoints.timeId : settings.options.player.getTimeId());
*/				
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
//			_this.arc = π * (radius - length);

			let middleVertice, middleVerticeAngles;
			
			if (length < 1e-10) {

				//Противоположные вершины расположены на противоположных краях окружности. В этом случае с равной вероятностью средняя вершина может распологаться с одной или с другой половины окружности.
				middleVerticeAngles = utils.angles([((_this.vertice2angles(points[0])[0] + _this.vertice2angles(points[1])[0]) / 2) + (Math.random() > 0.5 ? 0 : π)])
				middleVertice = _this.a2v(middleVerticeAngles, radius);
//				return _this.a2v(_this.getRandomMiddleAngles(points), radius);
				
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

			_this.randomVertices(middleVerticeAngles);
/*			
			const classSettings = _this.classSettings;
			if (classSettings.randomArc) {

				const params = {
						
						//vertice: angles,
						oppositeVertice: middleVerticeAngles,
						arc: _this.arc,
						debug: classSettings.debug ? { notRandomVertices: true,} : false,
						
					}
				if (_this.randomVertice) _this.randomVertice.params = params;
				else {
					
					_this.randomVertice = new _this.RandomCloud(params);
					_this.hsRandomVertice = _this.randomVertice.getHyperSphere(classSettings.settings.options, classSettings, _this.middleVerticeColor);

				}
				
			}
*/			
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
		
		/**
		 * Альтернативный метод: решает задачу минимизации методом градиентного спуска
		 */
		/*
		function findEquidistantPointGradient(points, learningRate = 0.01, iterations = 1000) {
			if (!points || points.length === 0) {
				return null;
			}
	
			const radius = Math.sqrt(points[0].x * points[0].x + points[0].y * points[0].y);
	
			// Начинаем со случайной точки на окружности
			let angle = Math.random() * 2 * Math.PI;
			let point = {
				x: radius * Math.cos(angle),
				y: radius * Math.sin(angle)
			};
	
			// Градиентный спуск
			for (let i = 0; i < iterations; i++) {
				// Вычисляем градиент функции стоимости
				let gradX = 0;
				let gradY = 0;
		
				// Вычисляем среднее расстояние
				const distances = points.map(p => {
					const dx = p.x - point.x;
					const dy = p.y - point.y;
					return Math.sqrt(dx * dx + dy * dy);
				});
		
				const meanDistance = distances.reduce((sum, d) => sum + d, 0) / distances.length;
		
				// Вычисляем градиент
				for (let j = 0; j < points.length; j++) {
					const dx = point.x - points[j].x;
					const dy = point.y - points[j].y;
					const distance = distances[j];
			
					if (distance > 1e-10) {
						const diff = distance - meanDistance;
						gradX += diff * (dx / distance);
						gradY += diff * (dy / distance);
					}
				}
		
				// Обновляем точку (двигаемся против градиента)
				point.x -= learningRate * gradX;
				point.y -= learningRate * gradY;
		
				// Проецируем обратно на окружность
				const length = Math.sqrt(point.x * point.x + point.y * point.y);
				point.x = point.x * radius / length;
				point.y = point.y * radius / length;
		
				// Уменьшаем learning rate
				learningRate *= 0.995;
			}
	
			return point;
		}
		*/
		/*
		// Пример использования
		function example() {
			// Создаем тестовые точки на окружности радиуса 5
			const radius = 5;
			const points = [
				{ x: 5, y: 0 },
				{ x: 3, y: 4 },
				{ x: -4, y: 3 },
				{ x: -3, y: -4 }
			];
	
			console.log('Исходные точки:', points);
	
			// Метод 1: через среднее направление
			const result1 = findEquidistantPointOnCircle(points);
			console.log('Метод среднего направления:', result1);
	
			// Метод 2: градиентный спуск
			const result2 = findEquidistantPointGradient(points);
			console.log('Градиентный спуск:', result2);
	
			// Проверяем расстояния
			if (result1) {
				console.log('\nПроверка для метода 1:');
				points.forEach((p, i) => {
					const dx = p.x - result1.x;
					const dy = p.y - result1.y;
					const distance = Math.sqrt(dx * dx + dy * dy);
					console.log(`Расстояние до точки ${i}: ${distance.toFixed(4)}`);
				});
			}
		}

		// Запуск примера
		example();
		*/
		return findEquidistantPointOnCircle(points);

	}
	ZeroArray() { return [0]; }
/*	
	Euler(params) {

		return;//в одномерной гиперсфере углы Эйлена не используются потому что поворот вершины делается на угол params.oppositeVertice.longitude
		
	}
*/	
	Vertice(angles) { return utils.angles(angles); }
	/**
	 * Converts a vertice position to vertice angles.
	 * @param {array} vertice array of the vertice axes
	 * @returns Vertice angles.
	 */
	vertice2angles(vertice) {

/*		
		const x = [],//для разных размерностей гиперсферы координаты вершины расположены в разном порядке в соответствии с this.axes.indices
		for (let index = 0; index < vertice.length; index++) x.push(vertice[this.axes.indices[index]]);
*/
		/*https://gemini.google.com/app/5f9589d755b1c43f
		Задана точка на окружности в декартовой системе координат. Начало координат находится в центре окружности.
		Положение точки обозначить как vertice.x и vertice.y
		Вычислить координаты точки в полярной системе координат.
		Написать код на javascript
		*/
		/**
		 * Преобразует декартовы координаты (x, y) в полярные координаты (r, theta).
		 * Центр окружности предполагается в начале координат (0, 0).
		 *
		 * @param {object|array} vertice - Объект или массив с декартовыми координатами.
		 * @param {number} vertice.x - Координата X точки.
		 * @param {number} vertice.y - Координата Y точки.
		 * @param {object} circle - Circle class instance.
		 * @returns {array} Масcив с полярными координатами: [theta: угол в радианах ]
		 */
		function cartesianToPolar(vertice, circle) {

			if (Array.isArray(vertice) && (vertice.x === undefined))
				vertice = { x: vertice[0], y: vertice[1] }
//				vertice = { x: vertice[circle.axes.indices[0]], y: vertice[circle.axes.indices[1]] }

			// Вычисление угла (theta) в радианах
			// Math.atan2(y, x) корректно обрабатывает все квадранты.
			const theta = Math.atan2(vertice.y, vertice.x);
//			const theta = Math.atan2(vertice.x, vertice.y);

			return utils.angles([theta]);
			
		}

		/*
		// --- Пример использования ---

		const vertice1 = {
			x: 3,
			y: 4
		};

		const polarCoordinates = cartesianToPolar(vertice1);

		console.log(`Декартовы координаты: (${vertice1.x}, ${vertice1.y})`);
		console.log(`Полярные координаты:`);
		console.log(`  Радиус (r): ${polarCoordinates.r}`);
		console.log(`  Угол (theta) в радианах: ${polarCoordinates.theta}`);

		// Для справки: перевод радиан в градусы
		const angleInDegrees = polarCoordinates.theta * (180 / Math.PI);
		console.log(`  Угол (theta) в градусах: ${angleInDegrees}`);


		// --- Дополнительный пример (второй квадрант) ---

		const vertice2 = {
			x: -2,
			y: 2
		};

		const polarCoordinates2 = cartesianToPolar(vertice2);

		console.log("\n-------------------------");
		console.log(`Декартовы координаты: (${vertice2.x}, ${vertice2.y})`);
		console.log(`Полярные координаты:`);
		console.log(`  Радиус (r): ${polarCoordinates2.r}`);
		console.log(`  Угол (theta) в радианах: ${polarCoordinates2.theta}`);
		console.log(`  Угол (theta) в градусах: ${polarCoordinates2.theta * (180 / Math.PI)}`);	
		*/
		return cartesianToPolar(vertice, this);

	}
		
	a2v(angles, r){

		if(r === undefined) console.error(sCircle + ': a2v. r = ' + r);
		/*https://gemini.google.com/app/1d5ef1a7e3d3d45f
		Задана точка на окружности в полярной системе координат. Начало координат находится в центре окружности.
		Положение точки обозначить как
		angles.longitude - долгота в диапазоне от -π до π.
		Радиус окружности обозначить как r.
		Долгота может выходить из заданного диапазона.
		Вычислить координаты точки в декартовой системе координат.
		Написать код на javascript
		*/
		/**
		 * Вычисляет декартовы координаты (x, y) точки,
		 * заданной в полярной системе координат (r, angles.longitude).
		 * Начало координат находится в центре окружности.
		 *
		 * @param {number} r Радиус окружности.
		 * @param {object} angles Объект, содержащий долготу.
		 * @param {number} angles.longitude Долгота в радианах (может выходить за пределы [-π, π]).
		 * @returns {{x: number, y: number}} Объект с декартовыми координатами x и y.
		 */
		function polarToCartesian(r, angles) {
			
			const longitude = angles.longitude;
			if ((longitude === undefined) || isNaN(longitude)) console.error(sCircle + ': a2v. longitude = ' + longitude);

			// Вычисление декартовых координат
			// Math.cos() и Math.sin() корректно обрабатывают углы вне диапазона [-π, π]
			const x = r * Math.cos(longitude);
			const y = r * Math.sin(longitude);

//			return { x: x, y: y };
//			return [ y, x ];
			return [ x, y ];
			
		}

		/*
		// --- Пример использования ---

		const radius = 5;
		const position1 = { longitude: Math.PI / 2 }; // Долгота: π/2 (90 градусов)
		const position2 = { longitude: 3 * Math.PI };   // Долгота: 3π (то же, что π)
		const position3 = { longitude: -0.5 };        // Долгота: -0.5 радиан

		const coords1 = polarToCartesian(radius, position1);
		const coords2 = polarToCartesian(radius, position2);
		const coords3 = polarToCartesian(radius, position3);

		console.log(`\n**Пример 1: r=${radius}, longitude=${position1.longitude} (90°)**`);
		//console.log(`x: ${coords1.x.toFixed(4)}, y: ${coords1.y.toFixed(4)}`);
		console.log(coords1);
		// Ожидаемый результат: x ≈ 0, y = 5

		console.log(`\n**Пример 2: r=${radius}, longitude=${position2.longitude} (540°)**`);
		//console.log(`x: ${coords2.x.toFixed(4)}, y: ${coords2.y.toFixed(4)}`);
		console.log(coords2);
		// Ожидаемый результат: x = -5, y ≈ 0 (3π эквивалентно π)

		console.log(`\n**Пример 3: r=${radius}, longitude=${position3.longitude}**`);
		//console.log(`x: ${coords3.x.toFixed(4)}, y: ${coords3.y.toFixed(4)}`);
		console.log(coords3);
		// Ожидаемый результат: x ≈ 4.7766, y ≈ -2.3971
		*/
//		return polarToCartesian(r, utils.angles(angles));
		return polarToCartesian(r, angles);
		
	}
/*	
	normalizeAngles(angles){

		angles.forEach((verticeAngles) => {

			verticeAngles.longitude = verticeAngles.longitude % (anglesRange.longitude.range);//(2 * Math.PI);
			if (verticeAngles.longitude > anglesRange.longitude.max)
				verticeAngles.longitude -= anglesRange.longitude.range;//2 * Math.PI;
			else if (verticeAngles.longitude < anglesRange.longitude.min)
				verticeAngles.longitude += anglesRange.longitude.range;//2 * Math.PI;
			
		});
		
	}
*/	
	get verticeEdgesLengthMax() { return 2; }//нельзя добавлть новое ребро если у вершины уже 2 ребра
	get dimension() { return 2; }//space dimension
	get verticesCountMin() { return 3; }
/*
	getRandomMiddleAngles(oppositeVertices) {

		return utils.angles([((this.vertice2angles(oppositeVertices[0])[0] + this.vertice2angles(oppositeVertices[1])[0]) / 2) + (Math.random() > 0.5 ? 0 : π)]);
		
	}
*/	
	/**
	 * @param {THREE.Scene} scene [THREE.Scene]{@link https://threejs.org/docs/index.html?q=sce#api/en/scenes/Scene}
	 * @param {Options} options See <a href="../../jsdoc/Options/Options.html" target="_blank">Options</a>.
	 * @param {object} randomVerticesSettings See <b>randomVerticesSettings</b> of the <a href="./module-HyperSphere-RandomVertices.html" target="_blank">RandomVertices</a> class.
	 * @returns new RandomVertices child class.
	 */
	newRandomVertices(scene, options, randomVerticesSettings) { return new RandomVertices(scene, options, randomVerticesSettings); }

	//overridden methods
	
	get RandomVertice() { return RandomVertice; }
	get RandomCloud() { return RandomCloud; }
	
	/////////////////////////////overridden methods
	
}

class RandomVertices extends HyperSphere.RandomVertices {

	constructor(scene, options, randomVerticesSettings) {

		if (randomVerticesSettings.np === undefined) randomVerticesSettings.np = 2;//Каждая окружность пересекает одномерную гиперсферу в двух точках.
		super(scene, options, randomVerticesSettings);
		this.class = Circle;
	}

	//overridden methods

	getHyperSphere(options, classSettings) {

		let circlesSphere;
		circlesSphere = new Circle(options, classSettings);
		return circlesSphere;

	}
	getArcAngle(vertice, oppositeVertice)
	{
		
		//векторы
		//A=(R,λ1 ) - vertice
		const λ1 = vertice[0];
		//B=(R,λ2 ) - oppositeVertice
		const λ2 = oppositeVertice[0];
		//где
		//λ — долгота (от −180° до 180°),
		const θ = λ1 - λ2;
		if (isNaN(θ)) console.error(sCircle + ': getArcAngle. Invalid θ = ' + θ);
		return θ;
		
	}
	oppositeVertice0() {}
//	antipodeCenter(params, antipodeLatitude) { return [params.oppositeVertice.longitude - π]; }
	zeroArray() { return utils.angles([0]); }
	onePointArea(d, np) {
		//Длинна отрезка одномерной гиперсферы на которой в среднем будет находиться одна случайная точка.
		return d / np;//Длинна отрезка одномерной гиперсферы вычисляем из длинны окружности одномерной гиперсферы, поделенной на количество точек на окружности np
		//d: расстояние между окружностями в радианах при условии, что окружности равномерно расположены на одномерной гиперсфере
		//окружность пересекает одномерную гиперсферу в двух точках
		
	}
	numPoints(d, s) {

		//Внимание! В одномерной гиперсфере окружность вырождается в точку
/*		
		//Для вычисления количества случайных точек numPoints около окружности, расположенной на расстоянии circleDistance радиан
		//я вычисляю высоту шарового пояса между параллелями h и делю ее на s - длинну отрезка одномерной гиперсферы на которой в среднем будет находиться одна случайная точка. См. onePointArea(...)
		const cos = Math.cos,
			h1 = cos(x),//расстояние от текущей окружности до центра шара
			hprev = cos((circleId - 1) * d),//расстояние от предыдущей окружности до центра шара
			h = h1 - hprev;//высота шарового пояса
		return Math.abs(Math.round(h / s));//количество случайных точек около окружности, расположенной на расстоянии circleDistance радиан
*/
		return Math.round(d / s);//количество случайных точек около окружности, расположенной на расстоянии circleDistance радиан
		
	}
/*	
	center(params) {
		
		//center is antipode of the opposite vertice
		//Центр окружностей случайных точек center находится с противоположной от params.oppositeVertice стороны гиперсферы
//		const center = params.randomVertices.antipodeCenter(params, antipodeLatitude);
		const center = [params.oppositeVertice.longitude - π];
		Object.defineProperty(center, 'lng', { get: () => { return center[0]; }, });
		return center;
		
	}
*/	
	getCirclePoint(circleDistance, params) {

		let newLng = params.center.lng - circleDistance * g_sign - (circleDistance === 0 ?
																	π ://расстояние между вершинами гиперсферы params.arc = 0. Нужно переместить точку на противовоположную позицию
																	0);
		
		//Каждая окружность пересекает одномерную гиперсферу в двух точках.
		//Из этих двух точек по очереди выбирается точка справа или слева от заданной долготы params.center.lng
		g_sign *= -1;

		//Normalise angles
		if (newLng > π) newLng -= 2 * π;
		else if (newLng < -π) newLng += 2 * π;
		
		return utils.angles([newLng]);
	
	}
	circlesCount(np) { return 36; }
	getNumPoints(circleDistance, R, dCircleDistance, np) {

		if (dCircleDistance === 0) return NaN;//Расстояние между окружностями равно нулю. Значит расстояние между вершинами гиперсферы params.arc = 0. Возвращаем NaN потому что в этом случае в окружности делаю одну точку.
		return np;
	
	}
//	pointIdErase() { return 0; }
	setCirclesCloud() {
		
		this.setCircles(0);
		this.createCirclesSphere();
	
	}
	setCirclesCloudOnePoint() { this.setCirclesOnePoint() }
//	altitudeDifference() { return undefined }

	/////////////////////////////overridden methods

}

let g_sign = 1;

RandomVertices.ZeroArray = () => { return [0]; }
RandomVertices.getCenter = (params) => {
	
	//center is antipode of the opposite vertice
	//Центр окружностей случайных точек center находится с противоположной от params.oppositeVertice стороны гиперсферы
//		const center = params.randomVertices.antipodeCenter(params, antipodeLatitude);
	const center = [params.oppositeVertice.longitude - π];
	Object.defineProperty(center, 'lng', { get: () => { return center[0]; }, });
	return center;
	
}
RandomVertices.Center = (params) => {

	const center = params.center;
	if (center.length < 1) center.push(0);
	if (center.lng === undefined)
		Object.defineProperty(center, 'lng', {
	
			get: () => { return center[0]; },
			set: (lng) => {
	
				if (center[0] === lng) return true;
				center[0] = lng;
				if (params.randomVertices) params.randomVertices.changeCirclesPoints();
				return true;
	
			},

		});
	const Vertice = (vertice) => {
	
		if (vertice.longitude != undefined) return;
		Object.defineProperty(vertice, 'longitude', {
			
			get: () => { return vertice[0]; },
			set: (longitude) => {
	
				if (vertice[0] === longitude) return true;
				vertice[0] = longitude;
				if (params.randomVertices) params.randomVertices.changeCirclesPoints();
				return true;
	
			},
		
		});
	
	}
	utils.angles(params.vertice);
	utils.angles(params.oppositeVertice);
	
}
Circle.RandomVertices = RandomVertices;

export default Circle;
