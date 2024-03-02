/**
 * @module Universe2D
 * @description 2 dimensional universe.
 * All the vertices of the Universe2D form a sphere.
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


import Universe1D from './universe1D.js';
//import ProgressBar from '../../commonNodeJS/master/ProgressBar/ProgressBar.js'
import three from '../../commonNodeJS/master/three.js'

const sUniverse2D = 'Universe2D',
	π = Math.PI;

class Universe2D extends Universe1D {

	//base methods

	planesGeometry(changedAngleId, aAngleControls, planeGeometry, longitudeId){

		const latitudeId = longitudeId - 1;
		switch(changedAngleId){

			case latitudeId: planeGeometry(longitudeId); break;
			case longitudeId: planeGeometry( latitudeId); break;
			default: console.error(sUniverse2D + ': Update planes. Invalid changedAngleId = ' + changedAngleId);
				
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
	newUniverse(options, classSettings) { return new Universe2D(options, classSettings); }
	get cookieName(){ return '2DUniverse' + (this.classSettings.cookieName ? '_' + this.classSettings.cookieName : ''); }
	get probabilityDensity() {

		return {

			sectorValueName: 'sectorSquare',
			sectorValue: (probabilityDensity, i) => {

				const sector = probabilityDensity[i], r = this.classSettings.t, hb = sector.hb, ht = sector.ht;
				
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

			name: "2D universe",

		};

		const _languageCode = getLanguageCode();

		switch (_languageCode) {

			case 'ru'://Russian language

				lang.name = 'Двумерная вселенная';

				break;

		}
		return lang.name;
		
	}
	logUniverse2D() {

		if (!this.classSettings.debug) return;
		this.logUniverse();
		
	}

	intersection(color) {

		const THREE = three.THREE,
			classSettings = this.classSettings,
			t = classSettings.t,
			mesh = new THREE.GridHelper(2 * t, 10, color, color);
		mesh.rotation.x = Math.PI / 2;
		mesh.position.copy(new THREE.Vector3(0, 0, classSettings.intersection.position * t));
		return mesh;

	}

	//Overridden methods from base class

	get verticeEdgesLengthMax() { return 3/*6*/; }//нельзя добавлть новое ребро если у вершины уже 6 ребра
	get dimension() { return 3; }//space dimension
	get verticesCountMin() { return 4; }

	/**
	 * 2 dimensional universe.
	 * All the vertices of the Universe2D form a sphere.
	 * @param {Options} options See <a href="../../../commonNodeJS/master/jsdoc/Options/Options.html" target="_blank">Options</a>.
	 * @param {object} [classSettings] <b>Universe1D</b> class settings. See <a href="./module-Universe-Universe.html" target="_blank">Universe classSettings</a>.
	 **/
	constructor(options, classSettings) {

		classSettings.continue = () => this.logUniverse2D();
		super(options, classSettings);

	}

}
export default Universe2D;
