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

	get verticeEdgesLengthMax() { return 4/*6*/; }//нельзя добавлть новое ребро если у вершины уже 6 ребра
	get dimension() { return 4; }//space dimension
	get verticesCountMin() { return 4; }
	/**
	 * @param {THREE.Scene} scene [THREE.Scene]{@link https://threejs.org/docs/index.html?q=sce#api/en/scenes/Scene}
	 * @param {Options} options See <a href="../../jsdoc/Options/Options.html" target="_blank">Options</a>.
	 * @param {object} randomVerticesSettings See <b>randomVerticesSettings</b> of the <a href="./module-HyperSphere-RandomVertices.html" target="_blank">RandomVertices</a> class.
	 * @returns new RandomVertices child class.
	 */
	newRandomVertices(scene, options, randomVerticesSettings) { return new RandomVertices(scene, options, randomVerticesSettings); }

}

class RandomVertices extends Sphere.RandomVertices {

	constructor(scene, options, randomVerticesSettings) {

		randomVerticesSettings.np = 6;//Количество окружностей в сфере, которые создаются из случайных точек для двумерной гиперсферы
//		randomVerticesSettings.spheresCount = 1;//7;//облако случайных точек делаю из 1 + spheresCount * 2 сфер, которые создаются из случайных точек для двумерной гиперсферы
		super(scene, options, randomVerticesSettings);
		this.class = HyperSphere3D;
		
	}

	//overridden methods

	getHyperSphere(options, classSettings) {

		let circlesSphere;
		circlesSphere = new HyperSphere3D(options, classSettings);
		return circlesSphere;

	}
	getArcAngle(vertice, oppositeVertice) {

		//DeepSeek. вычислить угол между двумя точками на поверхности 3D гиперсферы. Координаты точек указаны в радианах
		//векторы
		//A=(ψ1,θ1,ϕ1) - vertice
		const ψ1 = vertice[0], θ1 = vertice[1], ϕ1 = vertice[2];
		//B=(ψ1,θ1,ϕ1) - oppositeVertice
		const ψ2 = oppositeVertice[0], θ2 = oppositeVertice[1], ϕ2 = oppositeVertice[2];
		//где
		//ψ - высота
		//θ — широта (от −90° до 90°),
		//ϕ — долгота (от −180° до 180°),
		const arccos = Math.acos, sin = Math.sin, cos = Math.cos;
		const θ = arccos(cos(ψ1) * cos(ψ2) + sin(ψ1) * sin(ψ2) * (cos(θ1) * cos(θ2) + sin(θ1) * sin(θ2) * cos(ϕ1 - ϕ2)));
		if (isNaN(θ)) console.error(sHyperSphere3D + ': getArcAngle. Invalid θ = ' + θ);
		return θ;

	}
	oppositeVertice0(params, inaccurateLatitude) {

		const oppositeVertice = params.oppositeVertice;
		if (oppositeVertice.hasOwnProperty('0')) return;
		let altitude = oppositeVertice.altitude;
		Object.defineProperty(oppositeVertice, '0', {

			get: () => { return altitude; },
			set: (altitudeNew) => {

				altitude = altitudeNew;
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
/*
	center(params) {

		//center is antipode of the opposite vertice
		//Центр окружностей случайных точек center находится с противоположной от params.oppositeVertice стороны гиперсферы
		const antipodeLatitude = (latitude) => { return -latitude; },
			//			center = params.randomVertices.antipodeCenter(params, antipodeLatitude);
			center = [params.oppositeVertice.altitude, antipodeLatitude(params.oppositeVertice.latitude), params.oppositeVertice.longitude - π];

		Object.defineProperty(center, 'altitude', { get: () => { return center[0]; }, });
		Object.defineProperty(center, 'lat', {

			get: () => { return center[1]; },
			set: (lat) => {

				params.oppositeVertice.latitude = antipodeLatitude(lat);
				return true;

			},

		});
		Object.defineProperty(center, 'lng', { get: () => { return center[2]; }, });
		return center;

	}
*/	
	getCirclePoint(circleDistance, params, options) {

		const point2D = this.getCirclePoint2D(circleDistance, params, options);
		return [options.altitude, point2D[0], point2D[1]];
/*		
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
*/		

	}
	circlesCount(np) { return this.boCreateCirclesPoints ?
		np ://если количество окружностей равно количеству точек на окружности, то точки будут равномерно располагаться на гиперсфере
		this.aSpheres[this.circlesId].length + 1; }
	getNumPoints(circleDistance, R, dCircleDistance) {

		return parseInt(
			2 * π * Math.sin(circleDistance / R)//длинна окружности для гиперсферы радиусом 1
			/ dCircleDistance
		);

	}
//	pointIdErase(pointId) { return pointId === undefined ? 0 : pointId; }
	
	//Облако случайных точек это массив массивов случайноых точек сфер.
	//Создаем массив окружностей на сфере, на которой находится противоположная точка.
	//Во время ее создания запоминаем в aCirclesRadiusRadians радиусы всех окружностей в радианах.
	//Потом создаем массивы окружностей сфер, расположенных внутри и снаружи от сферы, на которой находится противоположная точка.
	//Каждый элемент массива окружностей сфер находится внутри или снаружи на расстоянии, которое было занесено в aCirclesRadiusRadians.
	aCirclesRadiusRadians = [];
	
	setCirclesCloud(randomVerticesSettings, params) {

		const aCirclesRadiusRadians = this.aCirclesRadiusRadians;
		randomVerticesSettings.spheresCount = 0
		
		//рисуем окружности вокруг противопрложной точки
		this.setCircles(0,//randomVerticesSettings.spheresCount,
						randomVerticesSettings.spheresCount, params.center.altitude, false, aCirclesRadiusRadians);
		randomVerticesSettings.spheresCount++;

		if (this.boCreateCirclesPoints) {

			//Выделяем место для точек в this.circlesPoints
			const aCircles0Params = this.aSpheres[0];
			for(let k = 1; k < aCircles0Params.length; k++) {
				
				const aCirclesParams = [];
				for(let i = k; i < aCircles0Params.length; i++) {
	
					const numPoints = aCircles0Params[i].numPoints;
					aCirclesParams.push({ numPoints: numPoints, });
					for(let j = 0; j < numPoints * 2; j++) this.circlesPoints.push(this.zeroArray());
	
				}
				this.aSpheres.push(aCirclesParams);

			}
			
		} else {
			
			//рисуем окружности внутри и снаружи от противоположной точки
			const altitude = params.center.altitude;
			for (let sphereId = aCirclesRadiusRadians.length - 1; sphereId >= 0; sphereId--) {
	
				const circlesRadius = aCirclesRadiusRadians[sphereId];
				if (circlesRadius === 0) continue;
				
				//рисуем окружности внутри от противоположной точки
				this.setCircles(undefined,//randomVerticesSettings.spheresCount,
								randomVerticesSettings.spheresCount, altitude - circlesRadius, false);
				randomVerticesSettings.spheresCount++;
				
				//рисуем окружности снаружи от противоположной точки
				this.setCircles(undefined,//randomVerticesSettings.spheresCount,
								randomVerticesSettings.spheresCount, altitude + circlesRadius, false);
				randomVerticesSettings.spheresCount++;
				
			}

		}
		this.createCirclesSphere();
	
	}
	setCirclesCloudOnePoint(randomVerticesSettings) { for (let sphereId = 0; sphereId < randomVerticesSettings.spheresCount; sphereId++) this.setCirclesOnePoint(sphereId); }

	/////////////////////////////overridden methods

}
/*
RandomVertices.Vertice = (vertice) => {

	if (vertice.longitude != undefined) return;
	Object.defineProperty(vertice, 'altitude', { get: () => { return vertice[0]; }, });
	Object.defineProperty(vertice, 'latitude', {
		
		get: () => { return vertice[1]; },
	
	});
	Object.defineProperty(vertice, 'longitude', { get: () => { return vertice[2]; }, });

}
*/
RandomVertices.ZeroArray = () => { return [0, 0, 0]; }
RandomVertices.getCenter = (params) => {

	//center is antipode of the opposite vertice
	//Центр окружностей случайных точек center находится с противоположной от params.oppositeVertice стороны гиперсферы
	const antipodeLatitude = (latitude) => { return -latitude; },
		//			center = params.randomVertices.antipodeCenter(params, antipodeLatitude);
		center = [params.oppositeVertice.altitude, antipodeLatitude(params.oppositeVertice.latitude), params.oppositeVertice.longitude - π];

	Object.defineProperty(center, 'altitude', { get: () => { return center[0]; }, });
	Object.defineProperty(center, 'lat', {

		get: () => { return center[1]; },
		set: (lat) => {

			params.oppositeVertice.latitude = antipodeLatitude(lat);
			return true;

		},

	});
	Object.defineProperty(center, 'lng', { get: () => { return center[2]; }, });
	return center;

}
RandomVertices.Center = (params, inaccurateLatitude) => {

	const Vertice = (vertice) => {
	
		if (vertice.longitude != undefined) return;
		Object.defineProperty(vertice, 'altitude', {
			
			get: () => { return vertice[0]; },
			set: (altitude) => {
	
				if (vertice[0] === altitude) return true;
				vertice[0] = altitude;
				if (params.randomVertices) {

					params.randomVertices.aCirclesRadiusRadians.length = 0;
					params.randomVertices.circlesPoints.length = 0;
					params.randomVertices.aSpheres.length = 0;
					params.randomVertices.setCirclesPoints();
//					params.randomVertices.changeCirclesPoints();

				}
				return true;
	
			},
		
		});
		Object.defineProperty(vertice, 'latitude', {
			
			get: () => { return vertice[1]; },
			set: (latitude) => {
	
				if (vertice[1] === latitude) return true;
				vertice[1] = latitude;
				if (params.randomVertices) params.randomVertices.changeCirclesPoints();
				return true;
	
			},
		
		});
		Object.defineProperty(vertice, 'longitude', {
			
			get: () => { return vertice[2]; },
			set: (longitude) => {
	
				if (vertice[2] === longitude) return true;
				vertice[2] = longitude;
				if (params.randomVertices) params.randomVertices.changeCirclesPoints();
				return true;
	
			},
		
		});
	
	}
	Vertice(params.vertice);
	Vertice(params.oppositeVertice);
	
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
				if (params.randomVertices) params.randomVertices.changeCirclesPoints();
				return true;

			},

		});
	if (center.lat === undefined)
		Object.defineProperty(center, 'lat', {

			get: () => { return center[1]; },
			set: (lat) => {

				if (center[1] === lat) return true;
				center[1] = lat;
				if (params.randomVertices) params.randomVertices.changeCirclesPoints();
				return true;

			},

		});
	if (center.lng === undefined)
		Object.defineProperty(center, 'lng', {

			get: () => { return center[2]; },
			set: (lng) => {

				if (center[2] === lng) return true;
				center[2] = lng;

				if (params.randomVertices) params.randomVertices.changeCirclesPoints();
				return true;

			},

		});
//console.warn('inaccurateLatitude(center.lat) was removed')
	//center.lat = inaccurateLatitude(center.lat);

}
HyperSphere3D.RandomVertices = RandomVertices;

export default HyperSphere3D;
