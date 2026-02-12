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
import { RandomVerticeSphere as RandomVertice } from './RandomVertice/randomVerticeSphere.js';
import * as utils from './utilsSphere.js'
import Position from './position.js'

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

	middlePosition(points, boCloud, boCreateHypersphere) {

		const _this = this;
		
		//https://chat.deepseek.com/a/chat/s/24dea3aa-eccd-4e97-a3e3-3f3ff0631de6
		/*
		Заданы несколько точек на поверхности сферы в декартовой системе координат. Начало координат в центре сферы.
		Найти точку на поверхности сферы, равноудаленную от заданных точек.
		Написать код на javascript.
		*/
		/**
		 * Находит точку на поверхности сферы (с центром в начале координат),
		 * которая приблизительно равноудалена от заданных точек.
		 * @param {Array<Array<number>>} points - Массив точек [x, y, z]
		 * @returns {Array<number>} Точка на сфере [x, y, z] или null, если точки не заданы
		 */
		function findEquidistantPoint(points) {
			
			if (!points || points.length === 0) {
				console.error(sSphere + ': findEquidistantPoint. Должна быть задана хотя бы одна точка');
				return;
			}

			// Суммируем все векторы точек
			let sumVector = [0, 0, 0];
			for (const point of points) {
				sumVector[0] += point[0];
				sumVector[1] += point[1];
				sumVector[2] += point[2];
			}
			
			// Радиус сферы
			const sphereRadius = _this.r;

			// Нормализуем сумму, чтобы получить точку на сфере
			const [x, y, z] = sumVector;
			const length = Math.sqrt(x * x + y * y + z * z);
			_this.setArc(sphereRadius, 1 - length / points.length);
			
			let middleVertice;//, middleVerticeAngles;

			if (length < 7e-17) {

				// Все точки в начале координат или их сумма нулевая, то есть все три противоположные вершины образуют равнобедренный треугольник на плоскости, проходящей через центр сферы

				const THREE = three.THREE;
				const oppositeVertices = points;

				//http://localhost/anhr/commonNodeJS/master/HyperSphere/Examples/NormalSphere.html

				// Заданные три точки на сфере (в декартовых координатах)
				if (oppositeVertices.length != 3) console.error(sSphere + ': findEquidistantPoint. Invalid oppositeVertices.length = ' + oppositeVertices.length);
				const oppositeVerticeA = oppositeVertices[0];
				const pointA = new THREE.Vector3(oppositeVerticeA.x, oppositeVerticeA.y, oppositeVerticeA.z);//(3, 4, 0);
				const oppositeVerticeB = oppositeVertices[1];
				const pointB = new THREE.Vector3(oppositeVerticeB.x, oppositeVerticeB.y, oppositeVerticeB.z);//(0, 3, -4);
				const oppositeVerticeC = oppositeVertices[2];
				const pointC = new THREE.Vector3(oppositeVerticeC.x, oppositeVerticeC.y, oppositeVerticeC.z);//(-3, -4, 0);

				// Функция для построения плоскости по трем точкам
				function createPlaneFromPoints(p1, p2, p3) {

					// Вычисляем нормаль плоскости через векторное произведение
					const v1 = new THREE.Vector3().subVectors(p2, p1);
					const v2 = new THREE.Vector3().subVectors(p3, p1);
					const normal = new THREE.Vector3().crossVectors(v1, v2).normalize();
					return normal;

				}

				// Функция для вычисления точек пересечения нормали со сферой
				function findSphereNormalIntersections(normal, radius) {
					// Нормаль уже проходит через центр сферы (начало координат)
					// Уравнение пересечения: |t * normal| = radius
					// t = ±radius (так как normal - единичный вектор)

					return normal.clone().multiplyScalar(Math.random() > 0.5 ? radius : -radius);

				}
				const normal = createPlaneFromPoints(pointA, pointB, pointC);

				// Вычисление точек пересечения нормали со сферой
				middleVertice = findSphereNormalIntersections(normal, sphereRadius);

			} else middleVertice = [x / length, y / length, z / length];

			_this.randomVertices(_this.vertice2angles(middleVertice), _this.object3D.parent, boCloud, boCreateHypersphere);
			return middleVertice;
			
		}

		const result = findEquidistantPoint(points);
		return result;

	}
	ZeroArray() { return [0, 0]; }
	Vertice(angles) { return utils.angles(angles); }
	/**
	 * Converts a vertice position to vertice angles.
	 * @param {array} vertice array of the vertice axes
	 * @returns Vertice angles.
	 */
	vertice2angles(vertice) { return utils.casterianToAngles(Position(vertice)); }
	a2v(angles, r = 1) { return utils.anglesToCartesian(angles, r); }
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
	get RandomVertice() { return RandomVertice; }

	///////////////////////////////Overridden methods from base class

}

export default Sphere;
