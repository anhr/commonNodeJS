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

			name: "HyperSphere",

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

}

class RandomVertices extends Circle.RandomVertices {

	constructor(scene, options, randomVerticesSettings){

		randomVerticesSettings.np = 36;
		super(scene, options, randomVerticesSettings);
		
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

		return [newLat, newLng];
	
	}
	circlesCount(np) { return np; }//если количество окружностей равно количеству точек на окружности, то точки будут равномерно располагаться на гиперсфере
	getNumPoints(circleDistance, R, dCircleDistance) {
		
		return parseInt(
			2 * π * Math.sin(circleDistance / R)//длинна окружности для гиперсферы радиусом 1
			/ dCircleDistance
		);
		
	}
	
	/////////////////////////////overridden methods
	
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
	
				center[0] = lat;
				if (params.randomVertices) params.randomVertices.changeCirclesPoints();
				return true;
	
			},
	
		});
	if (center.lng === undefined)
		Object.defineProperty(center, 'lng', {
	
			get: () => { return center[1]; },
			set: (lng) => {
	
				center[1] = lng;
				if (params.randomVertices) params.randomVertices.changeCirclesPoints();
				return true;
	
			},

		});
	center.lat = inaccurateLatitude(center.lat);
	
}
Sphere.RandomVertices = RandomVertices;

export default Sphere;
