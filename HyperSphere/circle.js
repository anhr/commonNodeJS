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

	randomVertices(middleVerticeAngles, scene, boCloud = false, boCreateHypersphere = true) {
		
		const classSettings = this.classSettings;
		if (!classSettings.randomArc) return;

		if (!this.params) this.params = {
				
				debug: classSettings.debug ? { notRandomVertices: true,} : false,
				classSettings: classSettings,//используется для вычисления случайной точки в RandomVerticeHSphere HyperSphereNavigator.calculateNewPoint
				
			}
		this.params.oppositeVertice = middleVerticeAngles;
		this.params.arc = this.arc;
		
		if (this.randomVertice && (boCloud === false) && (boCreateHypersphere === false)) this.randomVertice.params = this.params;//Делается очередной шаг проигрывателя и это уже не первая точка
		else {
			
			if (this.randomVertice) this.randomVertice.paramsVerticeOnChange();
			else this.randomVertice = new this.RandomVertice(this.params, 200);

		}
		if (boCreateHypersphere) {
			
			if (!this.hsRandomVertice) this.hsRandomVertice = this.randomVertice.getHyperSphere(classSettings, scene, this.middleVerticeColor);

		}
		
	}

	//Overridden methods from base class

	middlePosition(points, boCloud, boCreateHypersphere) {
	
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

			_this.randomVertices(middleVerticeAngles, _this.object3D.parent, boCloud, boCreateHypersphere);
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
	ZeroArray() { return [0]; }
	Vertice(angles) { return utils.angles(angles); }
	/**
	 * Converts a vertice position to vertice angles.
	 * @param {array} vertice array of the vertice axes
	 * @returns Vertice angles.
	 */
	vertice2angles(vertice) {

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

			// Вычисление угла (theta) в радианах
			// Math.atan2(y, x) корректно обрабатывает все квадранты.
			const theta = Math.atan2(vertice.y, vertice.x);

			return utils.angles([theta]);
			
		}

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
			const x = r * Math.cos(longitude);
			const y = r * Math.sin(longitude);

			return [ x, y ];
			
		}

		return polarToCartesian(r, angles);
		
	}
	get verticeEdgesLengthMax() { return 2; }//нельзя добавлть новое ребро если у вершины уже 2 ребра
	get dimension() { return 2; }//space dimension
	get verticesCountMin() { return 3; }

	/**
	 * @param {THREE.Scene} scene [THREE.Scene]{@link https://threejs.org/docs/index.html?q=sce#api/en/scenes/Scene}
	 * @param {Options} options See <a href="../../jsdoc/Options/Options.html" target="_blank">Options</a>.
	 * @param {object} randomVerticesSettings See <b>randomVerticesSettings</b> of the <a href="./module-HyperSphere-RandomVertices.html" target="_blank">RandomVertices</a> class.
	 * @returns new RandomVertices child class.
	 */
	newRandomVertices(scene, options, randomVerticesSettings) { return new RandomVertices(scene, options, randomVerticesSettings); }

	//overridden methods
	
	get RandomVertice() { return RandomVertice; }
	
	/////////////////////////////overridden methods
	
}

export default Circle;
