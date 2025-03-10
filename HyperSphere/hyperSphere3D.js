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

class HyperSphere3D extends Sphere {

	/**
	 * 3 dimensional [hypersphere]{@link https://en.wikipedia.org/wiki/N-sphere}.
	 * All the vertices form a [hypersphere]{@link https://en.wikipedia.org/wiki/N-sphere}.
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
export default HyperSphere3D;
