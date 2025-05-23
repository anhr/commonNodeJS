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
	get altitudeRange() { return {
		angleName: 'Altitude',
		min: 0, max: π,//Высота меняется в диапазоне 0 180 градусов. В центре гиперсферы вершины белого и  синего цвета по краям зеленого
	}}
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

	get verticeEdgesLengthMax() { return 4/*6*/; }//нельзя добавлть новое ребро если у вершины уже 6 ребра
	get dimension() { return 4; }//space dimension
	get verticesCountMin() { return 4; }

}

class RandomVertices extends Sphere.RandomVertices {

	constructor(scene, options, randomVerticesSettings) {

		randomVerticesSettings.np = 6;//Количество окружностей в сфере, которые создаются из случайных точек для двумерной гиперсферы
		randomVerticesSettings.spheresCount = 7;//облако случайных точек делаю из spheresCount сфер, которые создаются из случайных точек для двумерной гиперсферы
		super(scene, options, randomVerticesSettings);
		
		//overridden methods
		
		this.setCirclesCloud = (randomVerticesSettings) => {
	
			const altitudeStep = (Math.PI / 2) / (randomVerticesSettings.spheresCount - 1);
			for (let i = 0; i < randomVerticesSettings.spheresCount; i++) this.setCircles(altitudeStep * i);
		
		}

		//////////////////////////////overridden methods
		
	}

	//overridden methods

	getHyperSphere(options, classSettings) {

		let circlesSphere;
		circlesSphere = new HyperSphere3D(options, classSettings);
		return circlesSphere;

	}
	getArcAngle(vertice, oppositeVertice) {

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
	zeroArray() { return [0, 0, 0]; }
	onePointArea(d, np) {

		//объем шара в котором в среднем будет находиться одна случайная точка.
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
	getCirclePoint(circleDistance, params, options) {

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

		return [options.altitude, newLat, newLng];

	}
	circlesCount(np) { return np; }//если количество окружностей равно количеству точек на окружности, то точки будут равномерно располагаться на гиперсфере
	getNumPoints(circleDistance, R, dCircleDistance) {

		return parseInt(
			2 * π * Math.sin(circleDistance / R)//длинна окружности для гиперсферы радиусом 1
			/ dCircleDistance
		);

	}
	pointIdErase(pointId) { return pointId === undefined ? 0 : pointId; }

	/////////////////////////////overridden methods

}
RandomVertices.Center = (params, inaccurateLatitude) => {

	const center = params.center;
	if (center.length < 1) center.push(0);
	if (center.length < 2) center.push(0);
	if (center.length < 3) center.push(0);
	//	params.randomVertices.defineCenterCoordinates(params);
	if (center.altitude === undefined)
		Object.defineProperty(center, 'altitude', {

			get: () => { return center[0]; },
			set: (altitude) => {

				if (center[0] === altitude) return true;
				center[0] = altitude;
				if (params.randomVertices) {
					
console.warn('set altitude under constraction')
					params.randomVertices.changeCirclesPoints();

				}
				return true;

			},

		});
	if (center.lat === undefined)
		Object.defineProperty(center, 'lat', {

			get: () => { return center[1]; },
			set: (lat) => {

				if (center[1] === lat) return true;
				center[1] = lat;
				if (params.randomVertices){
					
console.warn('set lat under constraction')
					params.randomVertices.changeCirclesPoints();

				}
				return true;

			},

		});
	if (center.lng === undefined)
		Object.defineProperty(center, 'lng', {

			get: () => { return center[2]; },
			set: (lng) => {

				if (center[2] === lng) return true;
				center[2] = lng;

				if (params.randomVertices){

console.warn('set lng under constraction')					
					params.randomVertices.changeCirclesPoints();

				}
				return true;

			},

		});
console.warn('inaccurateLatitude(center.lat) was removed')
	//center.lat = inaccurateLatitude(center.lat);

}
HyperSphere3D.RandomVertices = RandomVertices;

export default HyperSphere3D;
