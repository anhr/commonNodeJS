/**
 * @module Sphere
 * @description 2 dimensional [hypersphere]{@link https://en.wikipedia.org/wiki/N-sphere}.
 * All the vertices form a sphere.
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


import Circle from './circle.js';
import three from '../three.js'
import RandomCloud from './RandomVertice/randomCloudSphere.js';
import anglesRange from './anglesRange.js'

const sSphere = 'Sphere',
	π = Math.PI;

/**
 * 2 dimensional [hypersphere]{@link https://en.wikipedia.org/wiki/N-sphere}.
 * All the vertices form a sphere.
 * @class
 * @extends Circle
 */
class Sphere extends Circle {

	/**
	 * @param {Options} options See <a href="../../../master/jsdoc/Options/Options.html" target="_blank">Options</a>.
	 * @param {object} [classSettings] <b>Circle</b> class settings. See <a href="./module-HyperSphere-HyperSphere.html" target="_blank">HyperSphere classSettings</a>.
	 **/
	constructor(options, classSettings) { super(options, classSettings); }

	//base methods

	planesGeometry(changedAngleId, aAngleControls, planeGeometry, longitudeId){

		const latitudeId = longitudeId - 1;
		switch(changedAngleId){

			case latitudeId: planeGeometry(longitudeId); break;
			case longitudeId: planeGeometry( latitudeId); break;
			default: console.error(sSphere + ': Update planes. Invalid changedAngleId = ' + changedAngleId);
				
		}
		
	}
	get axes() { return {

			//порядок размещения осей в декартовой системе координат
			//нужно что бы широта двигалась по оси y а долгота вращалась вокруг y
			indices: [1, 0, 2],//долгота вращается вокруг оси y. Широта двигается вдоль оси y. Вершины собираются по краям оси y
//			indices: [0, 1, 2],
			names: (getLanguageCode) => { return super.axes.names(getLanguageCode); }

		}

	}
	newHyperSphere(options, classSettings) { return new Sphere(options, classSettings); }
	get cookieName() { return 'Sphere' + (this.classSettings.cookieName ? '_' + this.classSettings.cookieName : ''); }
	get probabilityDensity() {

		return {

			sectorValueName: 'sectorSquare',
			sectorValue: (probabilityDensity, i) => {

				const sector = probabilityDensity[i], r = this.classSettings.r, hb = sector.hb, ht = sector.ht;
				
				//Площадь сегмента
				//https://allll.net/wiki/%D0%9F%D0%BB%D0%BE%D1%89%D0%B0%D0%B4%D1%8C_%D0%BF%D0%BE%D0%B2%D0%B5%D1%80%D1%85%D0%BD%D0%BE%D1%81%D1%82%D0%B8_%D1%88%D0%B0%D1%80%D0%BE%D0%B2%D0%BE%D0%B3%D0%BE_%D1%81%D0%B5%D0%B3%D0%BC%D0%B5%D0%BD%D1%82%D0%B0
				sector[this.probabilityDensity.sectorValueName] = 2 * Math.PI * r * (ht - hb);
				return sector[this.probabilityDensity.sectorValueName];

			},

		}

	}
	defaultAngles() { return { count: 4, } }//random pyramid
	pushRandomLatitude(verticeAngles) {

		//добиваемся равномерного распределения вершин по поверхности сферы
		const f = this.rotateLatitude === 0 ? Math.acos : Math.asin;
		verticeAngles.push(f(Math.random() * (Math.random() > 0.5 ? 1: -1)));
		
	}
	
	pushRandomAngle(verticeAngles) {

		this.pushRandomLatitude(verticeAngles);
		this.pushRandomLongitude(verticeAngles);

	}
	name( getLanguageCode ) {

		//Localization
		
		const lang = {

			name: "Sphere",

		};

		const _languageCode = getLanguageCode();

		switch (_languageCode) {

			case 'ru'://Russian language

				lang.name = 'Сфера';

				break;

		}
		return lang.name;
		
	}
	logSphere() {

		if (!this.classSettings.debug) return;
		this.logHyperSphere();
		
	}

	intersection(color) {

		const THREE = three.THREE,
			classSettings = this.classSettings,
			r = classSettings.r,
			mesh = new THREE.GridHelper(2 * r, 10, color, color);
		mesh.rotation.x = Math.PI / 2;
		mesh.position.copy(new THREE.Vector3(0, 0, classSettings.intersection.position * r));
		return mesh;

	}

	//Overridden methods from base class

	normalizeAngles(angles){

		/*https://chat.deepseek.com/a/chat/s/26327d17-c346-476d-9199-a0814f3a7a0a
		Есть точка на поверхности сферы в полярной системе координат. Начало полярной системы координат находится в центре сферы.
		Положение точки обозначить как
		point.latitude - широта в диапазоне от -π/2 до π/2,
		point.longitude - долгота в диапазоне от -π до π,
		Пусть положение точки point задано за пределами допустимого диапазона углов.
		Написать функцию на javascript с названием normalize, которая нормализует положение точки point в допустимый диапазон.

		Как работает функция:

		Долгота нормализуется в диапазон [-π, π] с помощью операции взятия по модулю

		Широта сначала также нормализуется по модулю, но если она выходит за пределы [-π/2, π/2], то:

		Широта отражается относительно полюсов

		Долгота сдвигается на π (антиподальная точка)

		Долгота снова нормализуется после сдвига

		Это обеспечивает корректное отображение любой точки на поверхности сферы в допустимый диапазон координат.
		*/
		const normalize = (normalized) => {

/*
			// Создаем копию точки, чтобы не изменять оригинал
			const normalized = {
				latitude: point.latitude,
				longitude: point.longitude
			};
*/
			// Нормализация долготы в диапазон [-π, π]
			normalized.longitude = normalized.longitude % (2 * Math.PI);
			if (normalized.longitude > Math.PI) {
				normalized.longitude -= 2 * Math.PI;
			} else if (normalized.longitude < -Math.PI) {
				normalized.longitude += 2 * Math.PI;
			}

			// Нормализация широты в диапазон [-π/2, π/2]
			normalized.latitude = normalized.latitude % (2 * Math.PI);

			// Если широта выходит за пределы [-π/2, π/2], отражаем ее
			if (Math.abs(normalized.latitude) > Math.PI / 2) {
				if (normalized.latitude > 0) {
					normalized.latitude = Math.PI - normalized.latitude;
				} else {
					normalized.latitude = -Math.PI - normalized.latitude;
				}

				// После отражения, сдвигаем долготу на π
				normalized.longitude += Math.PI;

				// Снова нормализуем долготу после сдвига
				normalized.longitude = normalized.longitude % (2 * Math.PI);
				if (normalized.longitude > Math.PI) {
					normalized.longitude -= 2 * Math.PI;
				} else if (normalized.longitude < -Math.PI) {
					normalized.longitude += 2 * Math.PI;
				}
			}
/*
			// Нормализация долготы в диапазон [-π, π]
			const normalizedLongitude = () => {
				
				normalized.longitude = normalized.longitude % (anglesRange.longitude.range);//(2 * Math.PI);
				if (normalized.longitude > anglesRange.longitude.max)
					normalized.longitude -= anglesRange.longitude.range;//2 * Math.PI;
				else if (normalized.longitude < anglesRange.longitude.mi)
					normalized.longitude += anglesRange.longitude.range;

			}
			normalizedLongitude();

			// Нормализация широты в диапазон [-π/2, π/2]
			normalized.latitude = normalized.latitude % (2 * anglesRange.latitude.range);//(2 * Math.PI);

			// Если широта выходит за пределы [-π/2, π/2], отражаем ее
			if (Math.abs(normalized.latitude) > anglesRange.latitude.max) {
				
				if (normalized.latitude > 0) 
					normalized.latitude = Math.PI - normalized.latitude;
				else
					normalized.latitude = -Math.PI - normalized.latitude;

				// После отражения, сдвигаем долготу на π
				normalized.longitude += Math.PI;

				// Снова нормализуем долготу после сдвига
				normalizedLongitude();
				
			}
*/
//			return normalized;
		}

		// Тестовые случаи
		const point1DeepSeek = { latitude: 3, longitude: 5 }
		normalize(point1DeepSeek);
		console.log(point1DeepSeek);
		// {latitude: ~1.1416, longitude: ~-1.2832}

		const point2DeepSeek = { latitude: -2, longitude: 4 }
		normalize(point2DeepSeek);
		console.log(normalize(point2DeepSeek));
		// {latitude: ~-2, longitude: ~-2.2832}

		const point3DeepSeek = { latitude: Math.PI, longitude: 2 * Math.PI }
		normalize(point3DeepSeek);
		console.log(normalize(point3DeepSeek));
		// {latitude: ~0, longitude: ~0}

		const point4DeepSeek = { latitude: -3 * Math.PI / 2, longitude: -3 * Math.PI }
		normalize(point4DeepSeek);
		console.log(normalize(point4DeepSeek));
		// {latitude: ~0, longitude: ~0}

		//https://gemini.google.com/app/64aa493066e3b07e
		/**
		 * Нормализует широту и долготу точки в допустимые диапазоны.
		 * point.latitude: широта, от -π/2 до π/2
		 * point.longitude: долгота, от -π до π
		 * @param {object} point Объект с полями latitude и longitude.
		 * @param {number} point.latitude Текущая широта.
		 * @param {number} point.longitude Текущая долгота.
		 * @returns {object} Новый объект с нормализованными latitude и longitude.
		 */
		function normalizeGemini(point) {
			const PI = Math.PI;

			// 1. Нормализация долготы (longitude) в диапазон (-π, π]
			let normalizedLongitude = point.longitude % (2 * PI);
			if (normalizedLongitude > PI) {
				normalizedLongitude -= 2 * PI;
			} else if (normalizedLongitude <= -PI) {
				normalizedLongitude += 2 * PI;
			}
			// Примечание: Если нужно строго (-π, π), то случай -π обрабатывается как π,
			// но в геодезии обычно используют (-180, 180], что соответствует (-π, π].
			// Для строгого (-π, π) нужно поменять <= на < в последнем условии,
			// но при % (2 * PI) и последующих операциях крайние случаи обычно попадают в π или -π.
			// Если point.longitude изначально кратно 2*PI, то % даст 0, что корректно.

			// 2. Нормализация широты (latitude)
			let normalizedLatitude = point.latitude;

			// Сначала приводим широту к диапазону [-π/2, 3π/2] (или аналогичному),
			// чтобы учесть "переход через полюса".
			let revs = Math.floor((normalizedLatitude + PI / 2) / (2 * PI));
			let adjustedLatitude = normalizedLatitude - revs * 2 * PI;

			// Проверяем, в какой полуоборот попадает широта
			if (adjustedLatitude > PI / 2 && adjustedLatitude <= 3 * PI / 2) {
				// Переход через Северный полюс (π/2) или Южный полюс (-π/2 после приведения)

				// Меняем полушарие
				normalizedLatitude = PI - adjustedLatitude;

				// Также нужно сдвинуть долготу на π (180 градусов), т.к. мы перешли на противоположную сторону
				normalizedLongitude = normalizedLongitude + PI;

				// Повторная нормализация долготы после сдвига
				normalizedLongitude = normalizedLongitude % (2 * PI);
				if (normalizedLongitude > PI) {
					normalizedLongitude -= 2 * PI;
				} else if (normalizedLongitude <= -PI) { // Используем <= для включения -π в случай сдвига, если исходная была π
					normalizedLongitude += 2 * PI;
				}

			} else {
				// Широта уже в диапазоне [-π/2, π/2]
				normalizedLatitude = adjustedLatitude;
			}

			// Финальная проверка на крайние случаи (хотя должно быть уже корректно)
			// Ограничение широты:
			if (normalizedLatitude > PI / 2) {
				normalizedLatitude = PI / 2;
			} else if (normalizedLatitude < -PI / 2) {
				normalizedLatitude = -PI / 2;
			}

			return {
				latitude: normalizedLatitude,
				longitude: normalizedLongitude
			};
		}

		// Пример использования:
		const point1 = { latitude: 5 * Math.PI / 2 + 0.1, longitude: 3 * Math.PI }; // Широта больше π/2, Долгота больше π
		const normalized1 = normalizeGemini(point1);
		console.log(`Исходная: lat=${point1.latitude.toFixed(3)}, lon=${point1.longitude.toFixed(3)}`);
		console.log(`Нормализованная: lat=${normalized1.latitude.toFixed(3)} (~${Math.PI / 2 - 0.1}), lon=${normalized1.longitude.toFixed(3)} (~0)`);
		// Ожидаемый результат: lat: π/2 - 0.1 (полюс + обратный путь), lon: 0 (3π -> π -> -π -> 0)
		// После 2*π оборота: lat: π/2 + 0.1, lon: π.
		// Переход через полюс: new_lat = π - (π/2 + 0.1) = π/2 - 0.1. new_lon = π + π = 2π -> 0.

		const point2 = { latitude: -Math.PI, longitude: -5 * Math.PI / 2 }; // Широта меньше -π/2, Долгота меньше -π
		const normalized2 = normalizeGemini(point2);
		console.log(`\nИсходная: lat=${point2.latitude.toFixed(3)}, lon=${point2.longitude.toFixed(3)}`);
		console.log(`Нормализованная: lat=${normalized2.latitude.toFixed(3)} (~0), lon=${normalized2.longitude.toFixed(3)} (~-π/2)`);
		// Ожидаемый результат: lat: 0, lon: -π/2
		// После 2*π оборота: lat: -π, lon: -π/2.
		// Переход через полюс: lat: -π, adjusted = -π. revs = -1. adjustedLatitude = -π - (-1 * 2π) = π.
		// 0 < π/2 && π <= 3π/2. new_lat = π - π = 0. new_lon = -π/2 + π = π/2.

		const point3 = { latitude: 0, longitude: 2.5 * Math.PI };
		const normalized3 = normalizeGemini(point3);
		console.log(`\nИсходная: lat=${point3.latitude.toFixed(3)}, lon=${point3.longitude.toFixed(3)}`);
		console.log(`Нормализованная: lat=${normalized3.latitude.toFixed(3)} (~0), lon=${normalized3.longitude.toFixed(3)} (~π/2)`);
		// Ожидаемый результат: lat: 0, lon: 0.5π

		const point4 = { latitude: Math.PI / 2 + 0.1, longitude: 0 };
		const normalized4 = normalizeGemini(point4);
		console.log(`\nИсходная: lat=${point4.latitude.toFixed(3)}, lon=${point4.longitude.toFixed(3)}`);
		console.log(`Нормализованная: lat=${normalized4.latitude.toFixed(3)} (~π/2 - 0.1), lon=${normalized4.longitude.toFixed(3)} (~π)`);
		// Ожидаемый результат: lat: π/2 - 0.1, lon: π. (Переход через Северный полюс)

		const point5 = { latitude: -Math.PI / 2 - 0.1, longitude: Math.PI / 2 };
		const normalized5 = normalizeGemini(point5);
		console.log(`\nИсходная: lat=${point5.latitude.toFixed(3)}, lon=${point5.longitude.toFixed(3)}`);
		console.log(`Нормализованная: lat=${normalized5.latitude.toFixed(3)} (~-π/2 + 0.1), lon=${normalized5.longitude.toFixed(3)} (~-π/2)`);
		// Ожидаемый результат: lat: -π/2 + 0.1, lon: -π/2. (Переход через Южный полюс)

		angles.forEach((verticeAngles) => {

			
		});
		
	}
	get verticeEdgesLengthMax() { return 3/*6*/; }//нельзя добавлть новое ребро если у вершины уже 6 ребра
	get dimension() { return 3; }//space dimension
	get verticesCountMin() { return 4; }
	/**
	 * @param {THREE.Scene} scene [THREE.Scene]{@link https://threejs.org/docs/index.html?q=sce#api/en/scenes/Scene}
	 * @param {Options} options See <a href="../../jsdoc/Options/Options.html" target="_blank">Options</a>.
	 * @param {object} randomVerticesSettings See <b>randomVerticesSettings</b> of the <a href="./module-HyperSphere-RandomVertices.html" target="_blank">RandomVertices</a> class.
	 * @returns new RandomVertices child class.
	 */
	newRandomVertices(scene, options, randomVerticesSettings) { return new RandomVertices(scene, options, randomVerticesSettings); }
	get RandomCloud() { return RandomCloud; }

	///////////////////////////////Overridden methods from base class

}

class RandomVertices extends Circle.RandomVertices {

	constructor(scene, options, randomVerticesSettings){

		if (randomVerticesSettings.np === undefined) randomVerticesSettings.np = 36;
		super(scene, options, randomVerticesSettings);
		this.class = Sphere;
		
	}

	//overridden methods
	
	getHyperSphere(options, classSettings) {

		let circlesSphere;
		circlesSphere = new Sphere(options, classSettings);
		return circlesSphere;

	}
	getArcAngle(vertice, oppositeVertice)
	{
		
		//DeepSeek. вычислить угол между двумя точками на поверхности шара
		//векторы
		//A=(R,ϕ1,λ1 ) - vertice
		const ϕ1 = vertice[0], λ1 = vertice[1];
		//B=(R,ϕ2,λ2 ) - oppositeVertice
		const ϕ2 = oppositeVertice[0], λ2 = oppositeVertice[1];
		//где
		//ϕ — широта (от −90° до 90°),
		//λ — долгота (от −180° до 180°),
		const arccos = Math.acos, sin = Math.sin, cos = Math.cos;
		const θ = arccos(sin(ϕ1) * sin(ϕ2) + cos(ϕ1) * cos(ϕ2) * cos(λ1 - λ2));
		if (isNaN(θ)) console.error(sSphere + ': getArcAngle. Invalid θ = ' + θ);
		return θ;
		
	}
	oppositeVertice0(params, inaccurateLatitude) {

		let latitude = params.oppositeVertice.latitude;
		Object.defineProperty(params.oppositeVertice, '0', {

			get: () => { return latitude; },
			set: (latitudeNew) => {
	
				latitude = inaccurateLatitude(latitudeNew);
				return true;
	
			},
	
		});
		
	}
//	antipodeCenter(params, antipodeLatitude) { return [antipodeLatitude(params.oppositeVertice.latitude), params.oppositeVertice.longitude - π]; }
	zeroArray() { return [0, 0]; }
	onePointArea(d, np) {
		
		//Площадь сферы на которой в среднем будет находиться одна случайная точка.
		//Площадь сферы вычисляем из площади боковой поверхности цилиндра, поделенной на количество точек на окружности np
		//Цилиндр расположен на экваторе сферы так, чтобы его середина касалась экватора
		//Высота цилиндра в радианах равна d.
		const h = 2 * Math.tan(d / 2),//Высота цилиндра радиусом 1. См. https://en.wikipedia.org/wiki/Trigonometric_functions
			S = 2 * π * h;//Площадь боковой поверхности цилиндра радиусом 1
		return S / np;//Площадь сферы на которой в среднем будет находиться одна случайная точка.
		
	}
	numPoints(d, s, circleId, x) {
		
		//Для вычисления количества случайных точек numPoints около окружности, расположенной на расстоянии circleDistance радиан
		//я вычисляю площадь шарового пояса между параллелями S и делю ее на s площадь сферы на которой в среднем будет находиться одна случайная точка.
		const cos = Math.cos,
			h1 = cos(x),//расстояние от текущей окружности до центра шара
			hprev = cos((circleId - 1) * d),//расстояние от предыдущей окружности до центра шара
			h = h1 - hprev,//высота шарового пояса
			S = Math.abs(2 * π * h);//DeepSeek. площадь шарового пояса между параллелями
		return Math.round(S / s);//количество случайных точек около окружности, расположенной на расстоянии circleDistance радиан
		
	}
/*	
	center(params) {
		
		//center is antipode of the opposite vertice
		//Центр окружностей случайных точек center находится с противоположной от params.oppositeVertice стороны гиперсферы
		const antipodeLatitude = (latitude) => { return -latitude; },
//			center = params.randomVertices.antipodeCenter(params, antipodeLatitude);
			center = [antipodeLatitude(params.oppositeVertice.latitude), params.oppositeVertice.longitude - π];
		
		Object.defineProperty(center, 'lat', {
			
			get: () => { return center[0]; },
			set: (lat) => {
	
				params.oppositeVertice.latitude = antipodeLatitude(lat);
				return true;
	
			},
		
		});
		Object.defineProperty(center, 'lng', { get: () => { return center[1]; }, });
		return center;
		
	}
*/	
	getCirclePoint2D(circleDistance, params, options) {
		
		let newLat, newLng;
		const center = params.center, angle = 2 * π * (params.random ? Math.random() : options.i / options.numPoints), // Текущий угол в радианах
			lat = center.lat, lng = center.lng;
			
		if (circleDistance === 0) {

			//длинна дуги равна нулю. Координаты точки окружности противоположны координатам центра окружности
			newLat = - lat;
			newLng = lng + π;

		} else {

			// Формулы сферической тригонометрии
			newLat = Math.asin(
				Math.sin(lat) * Math.cos(circleDistance) +
				Math.cos(lat) * Math.sin(circleDistance) * Math.cos(angle)
			);

			newLng = lng + Math.atan2(
				Math.sin(angle) * Math.sin(circleDistance) * Math.cos(lat),
				Math.cos(circleDistance) - Math.sin(lat) * Math.sin(newLat)
			);

		}

		//Normalise angles
		if (newLng > π) newLng -= 2 * π;
		else if (newLng < -π) newLng += 2 * π;

		return [newLat, newLng];
	
	}
	getCirclePoint(circleDistance, params, options) { return this.getCirclePoint2D(circleDistance, params, options); }
	circlesCount(np) { return np; }//если количество окружностей равно количеству точек на окружности, то точки будут равномерно располагаться на гиперсфере
	getNumPoints(circleDistance, R, dCircleDistance) {
		
		return parseInt(
			2 * π * Math.sin(circleDistance / R)//длинна окружности для гиперсферы радиусом 1
			/ dCircleDistance
		);
		
	}
	
	/////////////////////////////overridden methods
	
}
/*
RandomVertices.Vertice = (vertice) => {

	if (vertice.longitude != undefined) return;
	Object.defineProperty(vertice, 'latitude', {
		
		get: () => { return vertice[0]; },
		set: (latitude) => {

			vertice[0] = latitude;
			return true;

		},
	
	});
	Object.defineProperty(vertice, 'longitude', { get: () => { return vertice[1]; }, });

}
*/
RandomVertices.ZeroArray = () => { return [0, 0]; }
RandomVertices.getCenter = (params) => {
	
	//center is antipode of the opposite vertice
	//Центр окружностей случайных точек center находится с противоположной от params.oppositeVertice стороны гиперсферы
	const antipodeLatitude = (latitude) => { return -latitude; },
//			center = params.randomVertices.antipodeCenter(params, antipodeLatitude);
		center = [antipodeLatitude(params.oppositeVertice.latitude), params.oppositeVertice.longitude - π];
	
	Object.defineProperty(center, 'lat', {
		
		get: () => { return center[0]; },
		set: (lat) => {

			params.oppositeVertice.latitude = antipodeLatitude(lat);
			return true;

		},
	
	});
	Object.defineProperty(center, 'lng', { get: () => { return center[1]; }, });
	return center;
	
}
RandomVertices.Center = (params, inaccurateLatitude) => {

	const center = params.center;
	if (center.length < 1) center.push(0);
	if (center.length < 2) center.push(0);
//	params.randomVertices.defineCenterCoordinates(params);
	if (center.lat === undefined)
		Object.defineProperty(center, 'lat', {
	
			get: () => { return center[0]; },
			set: (lat) => {

				if (center[0] === lat) return true;
				center[0] = lat;
				if (params.randomVertices) params.randomVertices.changeCirclesPoints();
				return true;
	
			},
	
		});
	if (center.lng === undefined)
		Object.defineProperty(center, 'lng', {
	
			get: () => { return center[1]; },
			set: (lng) => {
	
				if (center[1] === lng) return true;
				center[1] = lng;
				if (params.randomVertices) params.randomVertices.changeCirclesPoints();
				return true;
	
			},

		});
	center.lat = inaccurateLatitude(center.lat);
	
	const Vertice = (vertice) => {
	
		if (vertice.longitude != undefined) return;
		Object.defineProperty(vertice, 'latitude', {
			
			get: () => { return vertice[0]; },
			set: (latitude) => {
	
				if (vertice[0] === latitude) return true;
				vertice[0] = latitude;
				if (params.randomVertices) params.randomVertices.changeCirclesPoints();
				return true;
	
			},
		
		});
		Object.defineProperty(vertice, 'longitude', {
			
			get: () => { return vertice[1]; },
			set: (longitude) => {
	
				if (vertice[1] === longitude) return true;
				vertice[1] = longitude;
				if (params.randomVertices) params.randomVertices.changeCirclesPoints();
				return true;
	
			},
		
		});
	
	}
	Vertice(params.vertice);
	Vertice(params.oppositeVertice);
	
}
Sphere.RandomVertices = RandomVertices;

export default Sphere;
