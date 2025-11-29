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
import Vertice from './VerticeHypersphere.js'
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

	ZeroArray() { return [0, 0, 0]; }
	Euler(params) {

		if (!params) return;
		params.Euler = () => {

			const position = this.classSettings.settings.object.geometry.position[0];
			const oppositePosition = this.classSettings.settings.object.geometry.position[1];
			/*
Заданы две произвольные точки position0 и position1 на поверхности гиперсферы в декартовой системе координат. Начало координат находится в центре гиперсферы.
Вычислить кватернионы, применяя которые можно точку position0 переместить в точку position1.
Обрабатать случай, когда точка близка к полюсам.
Написать пример, в котором вычисляется точка rotatedPosition как применение вычисленных кватернионов к точке position0.
rotatedPosition должна получиться равной position1.
Затем точку rotatedPosition повернуть обратно так, что бы она снова оказалась в положении точки position0.
Написать код на Javascript.
Применить библиотеку three.js.
			*/
			/*
Заданы две произвольные точки position1 и position2 на гиперсфере в декартовой системе координат. Начало координат находится в центре сферы.
Радиус сферы r.
Положение точек обозначить как
position1.x
position1.y
position1.z
position1.w

position2.x
position2.y
position2.z
position2.w
Вычислить кватернионы, применяя которые можно точку position1 переместить в точку position2.
Обрабатать случай, когда точка близка к полюсам.
Написать пример, в котором вычисляется точка rotatedPosition как применение вычисленных кватернионов к точке position1. rotatedPosition должна получиться равной position2. Затем точку rotatedPosition повернуть обратно так, что бы она снова оказалась в положении точки position1.
Написать код на Javascript.
			*/

			//https://giga.chat/agents/019a5d95-ab99-7c86-a31c-610dad03b054/sessions/019abe55-f302-718d-aa7c-f959d9618342
			/*
			class Quaternion {
				constructor(w, x, y, z) {
					this.w = w || 0;
					this.x = x || 0;
					this.y = y || 0;
					this.z = z || 0;
				}

				conjugate() { return new Quaternion(this.w, -this.x, -this.y, -this.z); }

				multiply(q) {
					let w = this.w * q.w - this.x * q.x - this.y * q.y - this.z * q.z,
						x = this.w * q.x + this.x * q.w + this.y * q.z - this.z * q.y,
						y = this.w * q.y - this.x * q.z + this.y * q.w + this.z * q.x,
						z = this.w * q.z + this.x * q.y - this.y * q.x + this.z * q.w;

					return new Quaternion(w, x, y, z);
				}

				rotate(v) {
					const qv = new Quaternion(0, v.x, v.y, v.z);
					const p = this.multiply(qv).multiply(this.conjugate());
					return { x: p.x, y: p.y, z: p.z };
				}
			}

			class Vector4 {
				constructor(x, y, z, w) {
					this.x = x || 0;
					this.y = y || 0;
					this.z = z || 0;
					this.w = w || 0;
				}

				dot(other) {
					return this.x * other.x + this.y * other.y + this.z * other.z + this.w * other.w;
				}

				normalize() {
					const len = Math.sqrt(this.dot(this));
					if (len > 0) {
						this.x /= len;
						this.y /= len;
						this.z /= len;
						this.w /= len;
					}
					return this;
				}
			}

			// Функция расчета кватерниона вращения
			function createRotationQuaternion(p1, p2) {
				// Найдем угол между векторами
				const cosTheta = p1.dot(p2);
				const theta = Math.acos(cosTheta);

				// Случай, когда точки почти совпадают
				if (Math.abs(theta) < Number.EPSILON) {
					return new Quaternion(1, 0, 0, 0); // Нет поворота
				}

				// Особый случай: анти-полярная ось
				if (Math.abs(theta - Math.PI) < Number.EPSILON) {
					// В таком случае выбираем ортогональный вектор произвольно
					let axis = new Vector4(-p1.y, p1.x, 0, 0); // Возможны варианты выбора
					axis.normalize();
					return new Quaternion(Math.cos(theta / 2), axis.x * Math.sin(theta / 2), axis.y * Math.sin(theta / 2), axis.z * Math.sin(theta / 2));
				}

				// Общий случай: находим нормальный вектор между p1 и p2
				let crossProduct = new Vector4(
					p1.y * p2.z - p1.z * p2.y,
					p1.z * p2.x - p1.x * p2.z,
					p1.x * p2.y - p1.y * p2.x,
					0
				);
				crossProduct.normalize();

				// Кватернион поворота
				return new Quaternion(Math.cos(theta / 2), crossProduct.x * Math.sin(theta / 2), crossProduct.y * Math.sin(theta / 2), crossProduct.z * Math.sin(theta / 2));
			}

			// Определяем наши точки на сфере
			const position1 = new Vector4(1, 0, 0, 0); // Первая точка
			const position2 = new Vector4(0, 1, 0, 0); // Вторая точка

			// Создание кватерниона вращения
			const rotationQ = createRotationQuaternion(position1, position2);

			// Применение кватерниона к первой точке
			const rotatedPosition = rotationQ.rotate({ x: position1.x, y: position1.y, z: position1.z });

			// Выведем позицию после вращения
			console.log('Rotated Position:', rotatedPosition);

			// Вернем точку обратно
			const reverseRotationQ = rotationQ.conjugate(); // Инверсия кватерниона
			const originalPosition = reverseRotationQ.rotate(rotatedPosition);

			// Печать оригинальной точки после обратного вращения
			console.log('Original Position After Reverse Rotation:', originalPosition);
			*/
			/*
			{//hide parameters
				// Подключаем three.js
				//			import * as THREE from 'https://cdn.skypack.dev/three';
				const THREE = three.THREE;

				// Радиус сферы
				const radius = 1;

				// Точки на поверхности сферы
				const position1 = new THREE.Vector4(1, 0, 0, 0); // пример первой точки
				const position2 = new THREE.Vector4(0, 1, 0, 0); // пример второй точки

				// Преобразуем четырехмерные координаты в трёхмерные (игнорируем w-компоненту)
				const vector3_1 = new THREE.Vector3(position1.x, position1.y, position1.z);
				const vector3_2 = new THREE.Vector3(position2.x, position2.y, position2.z);

				// Нормализуем оба вектора
				vector3_1.normalize();
				vector3_2.normalize();

				// Создаем единичный кватернион поворота
				let quaternion = new THREE.Quaternion().setFromUnitVectors(vector3_1, vector3_2);

				// Применяем кватернион к первой точке
				const rotatedVector = vector3_1.clone().applyQuaternion(quaternion);

				console.log("Rotated Position:", rotatedVector.toArray());

				// Обратное вращение
				const inverseQuaternion = quaternion.clone().invert();

				// Возвращаемся в исходное положение
				const originalVector = rotatedVector.clone().applyQuaternion(inverseQuaternion);

				console.log("Original Position after rotation back:", originalVector.toArray());

			}
			*/
			//https://giga.chat/agents/019a5d95-ab99-7c86-a31c-610dad03b054/sessions/019ab994-9b82-7046-a55e-36beaba7aa56
			/*
			{//hide parameters
				class Quaternion {
					constructor(w, x, y, z) {
						this.w = w || 0;
						this.x = x || 0;
						this.y = y || 0;
						this.z = z || 0;
					}

					static fromPoint(x, y, z, w) {
						return new Quaternion(w, x, y, z);
					}

					conjugate() {
						return new Quaternion(this.w, -this.x, -this.y, -this.z);
					}

					multiply(other) {
						const a = this.w * other.w - this.x * other.x - this.y * other.y - this.z * other.z,
							b = this.w * other.x + this.x * other.w + this.y * other.z - this.z * other.y,
							c = this.w * other.y - this.x * other.z + this.y * other.w + this.z * other.x,
							d = this.w * other.z + this.x * other.y - this.y * other.x + this.z * other.w;
						return new Quaternion(a, b, c, d);
					}

					toArray() {
						return [this.w, this.x, this.y, this.z];
					}

					static fromArray(arr) {
						return new Quaternion(...arr);
					}

					toEulerAngles() {
						const { w, x, y, z } = this;
						const sqw = w * w;
						const sqx = x * x;
						const sqy = y * y;
						const sqz = z * z;

						// Проверка на возможное попадание в зону полярного насыщения
						if (sqx + sqy + sqz <= Number.EPSILON && sqw > 0.5) {
							console.warn("Near pole singularity!");
							return [0, Math.PI / 2, 0]; // Возврат фиксированных значений при попадании в область замков
						}

						const heading = Math.atan2(2 * (w * x + y * z), 1 - 2 * (sqx + sqy)),
							attitude = Math.asin(Math.max(-1, Math.min(1, 2 * (w * y - x * z)))), // Ограничиваем диапазон асинуса
							bank = Math.atan2(2 * (w * z + x * y), 1 - 2 * (sqy + sqz));

						return [heading, attitude, bank]; // Возвращаем в порядке (Yaw, Pitch, Roll)
					}
				}

				// Примеры функций вращения
				function rotateByEuler(point, eulerAngles) {
					const qFromEuler = (angles) => {
						const [h, p, b] = angles;
						const ch = Math.cos(h / 2),
							sh = Math.sin(h / 2),
							cp = Math.cos(p / 2),
							sp = Math.sin(p / 2),
							cb = Math.cos(b / 2),
							sb = Math.sin(b / 2);
						return new Quaternion(
							ch * cp * cb + sh * sp * sb,
							sh * cp * cb - ch * sp * sb,
							ch * sp * cb + sh * cp * sb,
							ch * cp * sb - sh * sp * cb
						);
					};

					const rotator = qFromEuler(eulerAngles);
					const pointAsQuat = Quaternion.fromPoint(point.x, point.y, point.z, point.w);
					const rotatedPoint = rotator.multiply(pointAsQuat).multiply(rotator.conjugate());
					return rotatedPoint.toArray().slice(1); // Отсекаем компоненту w
				}

				// Демонстрационный пример
				(() => {
					const oppositePosition = { x: 1, y: 0, z: 0, w: 0 }; // Пример противоположной позиции
					const position = { x: 0, y: 1, z: 0, w: 0 }; // Исходная позиция

					// Создание кватернионов из точек
					const posQuat = Quaternion.fromPoint(position.x, position.y, position.z, position.w);
					const oppoQuat = Quaternion.fromPoint(oppositePosition.x, oppositePosition.y, oppositePosition.z, oppositePosition.w);

					// Вычисление кватерниона вращения
					const rotationQuat = oppoQuat.multiply(posQuat.conjugate());

					// Расчет углов Эйлера
					const eulerAngles = rotationQuat.toEulerAngles();

					// Прямой поворот
					const rotatedPosition = rotateByEuler(position, eulerAngles);

					// Теперь попробуем вернуть точку обратно
					const reverseEulers = eulerAngles.map(angle => -angle);
					const finalPosition = rotateByEuler(rotatedPosition, reverseEulers);

					console.log(`Начальное положение: ${JSON.stringify(position)}`);
					console.log(`Отражённое положение: ${JSON.stringify(rotatedPosition)}`);
					console.log(`Вернувшееся положение: ${JSON.stringify(finalPosition)}`);
				})();

			}
			*/

			//https://chat.deepseek.com/a/chat/s/9c3cfe82-b29b-49c2-a3a2-a3c03076010e
			/*
			{//hide parameters
				class Vector4 {
					constructor(x, y, z, w) {
						this.x = x;
						this.y = y;
						this.z = z;
						this.w = w;
					}

					length() {
						return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
					}

					normalize() {
						const len = this.length();
						if (len === 0) return new Vector4(0, 0, 0, 0);
						return new Vector4(this.x / len, this.y / len, this.z / len, this.w / len);
					}

					dot(other) {
						return this.x * other.x + this.y * other.y + this.z * other.z + this.w * other.w;
					}

					add(other) {
						return new Vector4(this.x + other.x, this.y + other.y, this.z + other.z, this.w + other.w);
					}

					subtract(other) {
						return new Vector4(this.x - other.x, this.y - other.y, this.z - other.z, this.w - other.w);
					}

					multiply(scalar) {
						return new Vector4(this.x * scalar, this.y * scalar, this.z * scalar, this.w * scalar);
					}

					cross4D(other) {
						// 4D cross product (returns 6 components, but we'll use it for quaternion construction)
						return [
							this.y * other.z - this.z * other.y,
							this.z * other.w - this.w * other.z,
							this.w * other.x - this.x * other.w,
							this.x * other.y - this.y * other.x,
							this.x * other.z - this.z * other.x,
							this.y * other.w - this.w * other.y
						];
					}

					toString() {
						return `(${this.x.toFixed(4)}, ${this.y.toFixed(4)}, ${this.z.toFixed(4)}, ${this.w.toFixed(4)})`;
					}
				}

				class Quaternion {
					constructor(w, x, y, z) {
						this.w = w;
						this.x = x;
						this.y = y;
						this.z = z;
					}

					conjugate() {
						return new Quaternion(this.w, -this.x, -this.y, -this.z);
					}

					multiply(other) {
						return new Quaternion(
							this.w * other.w - this.x * other.x - this.y * other.y - this.z * other.z,
							this.w * other.x + this.x * other.w + this.y * other.z - this.z * other.y,
							this.w * other.y - this.x * other.z + this.y * other.w + this.z * other.x,
							this.w * other.z + this.x * other.y - this.y * other.x + this.z * other.w
						);
					}

					multiplyVector4(v) {
						// Convert Vector4 to quaternion with w=0
						const vQuat = new Quaternion(0, v.x, v.y, v.z);
						const result = this.multiply(vQuat).multiply(this.conjugate());
						return new Vector4(result.x, result.y, result.z, v.w); // Preserve w component
					}

					normalize() {
						const len = Math.sqrt(this.w * this.w + this.x * this.x + this.y * this.y + this.z * this.z);
						if (len === 0) return new Quaternion(1, 0, 0, 0);
						return new Quaternion(this.w / len, this.x / len, this.y / len, this.z / len);
					}

					toString() {
						return `(${this.w.toFixed(4)} + ${this.x.toFixed(4)}i + ${this.y.toFixed(4)}j + ${this.z.toFixed(4)}k)`;
					}
				}

				// Функция для вычисления кватерниона поворота между двумя точками на гиперсфере
				function calculateRotationQuaternion(position1, position2, radius = 1) {
					// Нормализуем точки (они уже должны быть на сфере радиуса r)
					const p1 = position1.normalize();
					const p2 = position2.normalize();

					const dotProduct = p1.dot(p2);

					// Обработка случая, когда точки близки к полюсам (почти параллельны или антипараллельны)
					if (Math.abs(dotProduct - 1) < 1e-10) {
						// Точки совпадают или очень близки - возвращаем единичный кватернион
						return new Quaternion(1, 0, 0, 0);
					}

					if (Math.abs(dotProduct + 1) < 1e-10) {
						// Точки противоположны - нужен поворот на 180 градусов
						// Находим перпендикулярную ось
						let axis;
						if (Math.abs(p1.x) > 1e-10) {
							axis = new Vector4(0, 1, 0, 0); // Используем ось Y
						} else if (Math.abs(p1.y) > 1e-10) {
							axis = new Vector4(0, 0, 1, 0); // Используем ось Z
						} else if (Math.abs(p1.z) > 1e-10) {
							axis = new Vector4(0, 0, 0, 1); // Используем ось W
						} else {
							axis = new Vector4(1, 0, 0, 0); // Используем ось X
						}

						// Создаем кватернион поворота на 180 градусов
						return new Quaternion(0, axis.x, axis.y, axis.z).normalize();
					}

					// Вычисляем ось вращения в 4D (используем обобщенную формулу)
					const crossTerms = p1.cross4D(p2);

					// Для 4D используем бикватернионный подход - упрощаем до 3D вращения
					// в плоскости, содержащей обе точки и начало координат
					const angle = Math.acos(Math.min(1, Math.max(-1, dotProduct)));

					// Используем проекцию на 3D подпространство для вычисления оси вращения
					const axis3D = new Vector4(
						p1.y * p2.z - p1.z * p2.y,
						p1.z * p2.x - p1.x * p2.z,
						p1.x * p2.y - p1.y * p2.x,
						0
					).normalize();

					const sinHalfAngle = Math.sin(angle / 2);
					const cosHalfAngle = Math.cos(angle / 2);

					return new Quaternion(
						cosHalfAngle,
						axis3D.x * sinHalfAngle,
						axis3D.y * sinHalfAngle,
						axis3D.z * sinHalfAngle
					).normalize();
				}

				// Функция для применения кватерниона к точке
				function rotatePoint(position, quaternion) {
					return quaternion.multiplyVector4(position);
				}

				// Пример использования
				function example() {
					console.log("=== Пример вращения на гиперсфере ===\n");

					// Задаем радиус сферы
					const radius = 1.0;

					// Создаем две произвольные точки на гиперсфере
					const position1 = new Vector4(0.5, 0.5, 0.5, 0.5).normalize().multiply(radius);
					const position2 = new Vector4(-0.5, 0.5, -0.5, 0.5).normalize().multiply(radius);

					console.log("Исходная точка position1:", position1.toString());
					console.log("Целевая точка position2:", position2.toString());

					// Вычисляем кватернион поворота
					const rotationQuaternion = calculateRotationQuaternion(position1, position2, radius);
					console.log("\nКватернион поворота:", rotationQuaternion.toString());

					// Применяем кватернион к position1
					const rotatedPosition = rotatePoint(position1, rotationQuaternion);
					console.log("Повернутая точка rotatedPosition:", rotatedPosition.toString());

					// Проверяем, что rotatedPosition равна position2 (с учетом погрешности)
					const error = rotatedPosition.subtract(position2).length();
					console.log("Ошибка после поворота:", error.toFixed(10));

					// Вычисляем обратный кватернион
					const inverseQuaternion = rotationQuaternion.conjugate().normalize();
					console.log("\nОбратный кватернион:", inverseQuaternion.toString());

					// Поворачиваем обратно
					const backToPosition1 = rotatePoint(rotatedPosition, inverseQuaternion);
					console.log("Точка после обратного поворота:", backToPosition1.toString());

					// Проверяем, что вернулись к position1
					const backError = backToPosition1.subtract(position1).length();
					console.log("Ошибка после обратного поворота:", backError.toFixed(10));

					// Тестируем особые случаи
					console.log("\n=== Тестирование особых случаев ===");

					// Случай 1: Точки совпадают
					console.log("\n1. Точки совпадают:");
					const samePoint = new Vector4(1, 0, 0, 0);
					const quatSame = calculateRotationQuaternion(samePoint, samePoint);
					console.log("Кватернион:", quatSame.toString());

					// Случай 2: Точки противоположны
					console.log("\n2. Точки противоположны:");
					const oppositePoint = new Vector4(-1, 0, 0, 0);
					const quatOpposite = calculateRotationQuaternion(samePoint, oppositePoint);
					console.log("Кватернион:", quatOpposite.toString());

					const rotatedOpposite = rotatePoint(samePoint, quatOpposite);
					console.log("Результат поворота:", rotatedOpposite.toString());
				}

				// Запускаем пример
				example();

			}
			*/

			//https://gemini.google.com/app/ed964951dba0c8be
			{//hide parameters
				/**
				 * Класс для работы с 4D-векторами (точками на гиперсфере).
				 */
				class Vector4 {
					constructor(x, y, z, w) {
						this.x = x;
						this.y = y;
						this.z = z;
						this.w = w;
					}

					// Длина вектора
					length() {
						return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
					}

					// Нормализация вектора
					normalize() {
						const len = this.length();
						if (len === 0) return new Vector4(0, 0, 0, 0);
						return new Vector4(this.x / len, this.y / len, this.z / len, this.w / len);
					}

					// Скалярное произведение в 4D
					dot(v) {
						return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w;
					}

					// Векторное произведение в 3D-подпространстве (для оси вращения)
					cross3(v) {
						// Мы используем только x, y, z координаты для оси вращения, 
						// так как кватернион вращения определен в 3D.
						const x = this.y * v.z - this.z * v.y;
						const y = this.z * v.x - this.x * v.z;
						const z = this.x * v.y - this.y * v.x;
						// Координата w остается 0 для чистого кватерниона оси
						return new Vector4(x, y, z, 0);
					}
				}

				/**
				 * Класс для работы с кватернионами.
				 * Формат: q = (w, x, y, z)
				 */
				class Quaternion {
					constructor(w, x, y, z) {
						this.w = w; // Скалярная часть
						this.x = x; // Векторная часть x
						this.y = y; // Векторная часть y
						this.z = z; // Векторная часть z
					}

					// Нормализация кватерниона
					normalize() {
						const len = Math.sqrt(this.w * this.w + this.x * this.x + this.y * this.y + this.z * this.z);
						if (len === 0) return new Quaternion(1, 0, 0, 0);
						return new Quaternion(this.w / len, this.x / len, this.y / len, this.z / len);
					}

					// Сопряженный кватернион (для обратного поворота)
					conjugate() {
						return new Quaternion(this.w, -this.x, -this.y, -this.z);
					}

					// Умножение кватернионов: q1 * q2
					multiply(q2) {
						// q1 = (w1, v1), q2 = (w2, v2)
						// q1 * q2 = (w1*w2 - v1.v2, w1*v2 + w2*v1 + v1 x v2)
						const w1 = this.w, x1 = this.x, y1 = this.y, z1 = this.z;
						const w2 = q2.w, x2 = q2.x, y2 = q2.y, z2 = q2.z;

						const w = w1 * w2 - x1 * x2 - y1 * y2 - z1 * z2;
						const x = w1 * x2 + x1 * w2 + y1 * z2 - z1 * y2;
						const y = w1 * y2 - x1 * z2 + y1 * w2 + z1 * x2;
						const z = w1 * z2 + x1 * y2 - y1 * x2 + z1 * w2;

						return new Quaternion(w, x, y, z);
					}

					// Применение кватерниона к 4D-точке (вектору)
					// Поворот: v_out = q * v_in * q_inv
					rotate(v) {
						// v_in - чистый кватернион: v_in = (0, v.x, v.y, v.z)
						// Для 4D-вектора, мы должны использовать (0, v.x, v.y, v.z, v.w) - это уже не стандартный кватернион.
						// Для сохранения 4D-координаты w в процессе вращения, 
						// мы представляем v как кватернион q_v = (v.w, v.x, v.y, v.z)
						// и применяем rotation (q * q_v * q_inv)

						// v_in как кватернион
						const q_v = new Quaternion(v.w, v.x, v.y, v.z);

						// q_inv = q.conjugate() / |q|^2. Для нормализованного q, |q|^2 = 1.
						const q_inv = this.conjugate();

						// q * q_v
						const temp = this.multiply(q_v);

						// (q * q_v) * q_inv
						const q_out = temp.multiply(q_inv);

						// Результат: rotated_v = (q_out.w, q_out.x, q_out.y, q_out.z)
						return new Vector4(q_out.x, q_out.y, q_out.z, q_out.w);
					}
				}

				/**
				 * Вычисляет кватернион, который поворачивает v1 в v2.
				 * @param {Vector4} v1 - Начальная точка (вектор).
				 * @param {Vector4} v2 - Конечная точка (вектор).
				 * @returns {Quaternion} - Кватернион вращения.
				 */
				function rotationQuaternion(v1, v2) {
					const u1 = v1.normalize();
					const u2 = v2.normalize();
					const epsilon = 1e-6; // Порог для сравнения с нулем

					// 1. Скалярное произведение и угол
					const cosTheta = u1.dot(u2);

					// 2. Обработка вырожденных случаев
					if (cosTheta > 1.0 - epsilon) {
						// v1 и v2 совпадают (или очень близки).
						// Единичный кватернион (нет вращения).
						return new Quaternion(1, 0, 0, 0);
					}

					// Случай, когда точки на противоположных полюсах (theta = PI)
					if (cosTheta < -1.0 + epsilon) {
						// Оси вращения нет (векторное произведение = 0).
						// Выбираем любую ось, перпендикулярную u1, например, (1, 0, 0, 0)
						// (с учетом, что мы вращаем в 3D-подпространстве).

						// Попытка найти ось, перпендикулярную u1 (только x, y, z части)
						let axis;
						const u1_xyz = new Vector4(u1.x, u1.y, u1.z, 0);

						// Находим наименьшую компоненту u1, чтобы использовать другую компоненту
						// для создания перпендикулярного вектора.
						if (Math.abs(u1.x) < 0.5 && Math.abs(u1.y) < 0.5) {
							// Ось (0, 0, 1, 0)
							axis = new Vector4(-u1.y, u1.x, 0, 0).normalize();
						} else {
							// Ось (0, 1, 0, 0)
							axis = new Vector4(0, -u1.z, u1.y, 0).normalize();
						}

						// Quaternion = cos(PI/2) + n * sin(PI/2) = 0 + n * 1 = n
						return new Quaternion(0, axis.x, axis.y, axis.z).normalize();
					}

					// 3. Общий случай (вычисление оси и угла)

					// Векторное произведение 3D-частей для получения оси вращения (в 3D-подпространстве)
					const axis_unnormalized = u1.cross3(u2);

					// Нормализация оси
					const axis = axis_unnormalized.normalize();

					// Угол theta = arccos(cosTheta)
					const angle = Math.acos(cosTheta);

					// 4. Построение кватерниона
					const halfAngle = angle / 2;
					const s = Math.sin(halfAngle);

					const w = Math.cos(halfAngle);
					const x = axis.x * s;
					const y = axis.y * s;
					const z = axis.z * s;

					return new Quaternion(w, x, y, z).normalize();
				}

				// -------------------------
				//           ПРИМЕР
				// -------------------------

				// Радиус сферы
				//const r = 5.0;

				// Точка 1: на оси X
				const position1 = new Vector4(position.x, position.y, position.z, position.w);//new Vector4(r, 0, 0, 0);

				// Точка 2: на оси Y
				const position2 = new Vector4(oppositePosition.x, oppositePosition.y, oppositePosition.z, oppositePosition.w);//new Vector4(0, r, 0, 0);

				console.log("--- Исходные данные ---");
				//console.log(`Radius (r): ${r}`);
				console.log(`position1: (${position1.x}, ${position1.y}, ${position1.z}, ${position1.w})`);
				console.log(`position2: (${position2.x}, ${position2.y}, ${position2.z}, ${position2.w})`);

				// 1. Вычисление кватерниона для поворота position1 в position2
				const q_rotation = rotationQuaternion(position1, position2);

				console.log("\n--- Результат вычисления ---");
				console.log(`Кватернион вращения (q): (${q_rotation.w.toFixed(4)}, ${q_rotation.x.toFixed(4)}, ${q_rotation.y.toFixed(4)}, ${q_rotation.z.toFixed(4)})`);

				// 2. Применение кватерниона к position1 (position1 -> rotatedPosition)
				const rotatedPosition = q_rotation.rotate(position1);

				console.log("\n--- Прямое вращение ---");
				console.log(`rotatedPosition (q * p1 * q_inv):`);
				console.log(`  x: ${rotatedPosition.x} (Ожидалось: ${position2.x})`);
				console.log(`  y: ${rotatedPosition.y} (Ожидалось: ${position2.y})`);
				console.log(`  z: ${rotatedPosition.z} (Ожидалось: ${position2.z})`);
				console.log(`  w: ${rotatedPosition.w} (Ожидалось: ${position2.w})`);

				// 3. Вычисление обратного кватерниона (q_inv)
				const q_inverse = q_rotation.conjugate().normalize();

				console.log("\n--- Обратное вращение ---");
				console.log(`Обратный кватернион (q_inv): (${q_inverse.w.toFixed(4)}, ${q_inverse.x.toFixed(4)}, ${q_inverse.y.toFixed(4)}, ${q_inverse.z.toFixed(4)})`);

				// 4. Обратное вращение rotatedPosition (rotatedPosition -> backToPosition1)
				const backToPosition1 = q_inverse.rotate(rotatedPosition);

				console.log(`backToPosition1 (q_inv * rotatedPosition * q):`);
				console.log(`  x: ${backToPosition1.x} (Ожидалось: ${position1.x})`);
				console.log(`  y: ${backToPosition1.y} (Ожидалось: ${position1.y})`);
				console.log(`  z: ${backToPosition1.z} (Ожидалось: ${position1.z})`);
				console.log(`  w: ${backToPosition1.w} (Ожидалось: ${position1.w})`);

			}
			/*
Заданы две точки oppositePosition и position на 3D гиперсфере в декартовой системе координат. Начало координат находится в центре сферы.
Радиус сферы r.
Положение точек обозначить как
oppositePosition.x
oppositePosition.y
oppositePosition.z
oppositePosition.w

position.x
position.y
position.z
position.w
Вычислить углы Эйлера, применяя которые можно точку position переместить в точку oppositePosition.
Обрабатать случай, когда точка близка к полюсам.
Написать пример, в котором вычисляется точка rotatedPosition как поворот точки position на углы Эйлера. Затем точку rotatedPosition повернуть обратно так, что бы она снова оказалась в положении точки position.
Написать код на Javascript.
			*/

/*
			//https://giga.chat/agents/019a5d95-ab99-7c86-a31c-610dad03b054/sessions/019ab994-9b82-7046-a55e-36beaba7aa56

			class Quaternion {
				constructor(w, x, y, z) {
					this.w = w || 0;
					this.x = x || 0;
					this.y = y || 0;
					this.z = z || 0;
				}

				static fromPoint(x, y, z, w) {
					return new Quaternion(w, x, y, z);
				}

				conjugate() {
					return new Quaternion(this.w, -this.x, -this.y, -this.z);
				}

				multiply(other) {
					const a = this.w * other.w - this.x * other.x - this.y * other.y - this.z * other.z,
						b = this.w * other.x + this.x * other.w + this.y * other.z - this.z * other.y,
						c = this.w * other.y - this.x * other.z + this.y * other.w + this.z * other.x,
						d = this.w * other.z + this.x * other.y - this.y * other.x + this.z * other.w;
					return new Quaternion(a, b, c, d);
				}

				toArray() {
					return [this.w, this.x, this.y, this.z];
				}

				static fromArray(arr) {
					return new Quaternion(...arr);
				}

				toEulerAngles() {
					const { w, x, y, z } = this;
					const sqw = w * w;
					const sqx = x * x;
					const sqy = y * y;
					const sqz = z * z;

					// Проверка на возможное попадание в зону полярного насыщения
					if (sqx + sqy + sqz <= Number.EPSILON && sqw > 0.5) {
						console.warn("Near pole singularity!");
						return [0, Math.PI / 2, 0]; // Возврат фиксированных значений при попадании в область замков
					}

					const heading = Math.atan2(2 * (w * x + y * z), 1 - 2 * (sqx + sqy)),
						attitude = Math.asin(Math.max(-1, Math.min(1, 2 * (w * y - x * z)))), // Ограничиваем диапазон асинуса
						bank = Math.atan2(2 * (w * z + x * y), 1 - 2 * (sqy + sqz));

					return [heading, attitude, bank]; // Возвращаем в порядке (Yaw, Pitch, Roll)
				}
			}

			// Примеры функций вращения
			function rotateByEuler(point, eulerAngles) {
				const qFromEuler = (angles) => {
					const [h, p, b] = angles;
					const ch = Math.cos(h / 2),
						sh = Math.sin(h / 2),
						cp = Math.cos(p / 2),
						sp = Math.sin(p / 2),
						cb = Math.cos(b / 2),
						sb = Math.sin(b / 2);
					return new Quaternion(
						ch * cp * cb + sh * sp * sb,
						sh * cp * cb - ch * sp * sb,
						ch * sp * cb + sh * cp * sb,
						ch * cp * sb - sh * sp * cb
					);
				};

				const rotator = qFromEuler(eulerAngles);
				const pointAsQuat = Quaternion.fromPoint(point.x, point.y, point.z, point.w);
				const rotatedPoint = rotator.multiply(pointAsQuat).multiply(rotator.conjugate());
				return rotatedPoint.toArray().slice(1); // Отсекаем компоненту w
			}

			// Демонстрационный пример
			(() => {
				const oppositePosition = { x: 1, y: 0, z: 0, w: 0 }; // Пример противоположной позиции
				const position = { x: 0, y: 1, z: 0, w: 0 }; // Исходная позиция

				// Создание кватернионов из точек
				const posQuat = Quaternion.fromPoint(position.x, position.y, position.z, position.w);
				const oppoQuat = Quaternion.fromPoint(oppositePosition.x, oppositePosition.y, oppositePosition.z, oppositePosition.w);

				// Вычисление кватерниона вращения
				const rotationQuat = oppoQuat.multiply(posQuat.conjugate());

				// Расчет углов Эйлера
				const eulerAngles = rotationQuat.toEulerAngles();

				// Прямой поворот
				const rotatedPosition = rotateByEuler(position, eulerAngles);

				// Теперь попробуем вернуть точку обратно
				const reverseEulers = eulerAngles.map(angle => -angle);
				const finalPosition = rotateByEuler(rotatedPosition, reverseEulers);

				console.log(`Начальное положение: ${JSON.stringify(position)}`);
				console.log(`Отражённое положение: ${JSON.stringify(rotatedPosition)}`);
				console.log(`Вернувшееся положение: ${JSON.stringify(finalPosition)}`);
this.vertice2angles(rotatedPosition)
			})();
*/
/*
			//https://chat.deepseek.com/a/chat/s/9c3cfe82-b29b-49c2-a3a2-a3c03076010e
			class HyperSphereRotation {
				constructor(radius = 1) {
					this.radius = radius;
					this.epsilon = 1e-10; // для обработки численной погрешности
				}

				// Нормализация вектора
				normalize(vector) {
					const [x, y, z, w] = vector;
					const length = Math.sqrt(x * x + y * y + z * z + w * w);
					if (length < this.epsilon) return [0, 0, 0, 0];
					return [x / length, y / length, z / length, w / length];
				}

				// Скалярное произведение 4D векторов
				dot4D(v1, v2) {
					return v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2] + v1[3] * v2[3];
				}

				// Векторное произведение в 3D (для первых трех координат)
				cross3D(v1, v2) {
					return [
						v1[1] * v2[2] - v1[2] * v2[1],
						v1[2] * v2[0] - v1[0] * v2[2],
						v1[0] * v2[1] - v1[1] * v2[0]
					];
				}

				// Вычисление углов Эйлера для поворота из position в oppositePosition
				calculateEulerAngles(oppositePosition, position) {
					const opp = this.normalize(oppositePosition);
					const pos = this.normalize(position);

					const [x1, y1, z1, w1] = opp;
					const [x2, y2, z2, w2] = pos;

					// Проверка близости к полюсам (ось W)
					const w1Abs = Math.abs(w1);
					const w2Abs = Math.abs(w2);

					if (w1Abs > 1 - this.epsilon || w2Abs > 1 - this.epsilon) {
						console.log("Точка близка к полюсу, используется специальная обработка");
						return this.handlePoleCase(opp, pos);
					}

					// Вычисляем углы Эйлера
					// Угол вращения вокруг оси W (азимутальный угол)
					const phi = Math.atan2(y1, x1) - Math.atan2(y2, x2);

					// Угол вращения вокруг оси, лежащей в плоскости XY (зенитный угол)
					const theta = Math.acos(z1 / Math.sqrt(1 - w1 * w1)) - Math.acos(z2 / Math.sqrt(1 - w2 * w2));

					// Угол вращения в гиперплоскости (четвертое измерение)
					const psi = Math.asin(w1) - Math.asin(w2);

					return { phi, theta, psi };
				}

				// Обработка случая близости к полюсам
				handlePoleCase(opp, pos) {
					const [x1, y1, z1, w1] = opp;
					const [x2, y2, z2, w2] = pos;

					// Если обе точки близки к полюсам, используем простой поворот
					if (Math.abs(w1) > 1 - this.epsilon && Math.abs(w2) > 1 - this.epsilon) {
						// Точки на противоположных полюсах
						if (w1 * w2 < 0) {
							return { phi: Math.PI, theta: Math.PI, psi: 0 };
						} else {
							return { phi: 0, theta: 0, psi: 0 };
						}
					}

					// Общий случай обработки полюсов
					const phi = Math.atan2(y1, x1);
					const theta = Math.acos(z1 / Math.sqrt(1 - w1 * w1));

					return { phi, theta, psi: 0 };
				}

				// Поворот точки с использованием углов Эйлера
				rotatePoint(position, eulerAngles) {
					const { phi, theta, psi } = eulerAngles;
					const [x, y, z, w] = position;

					// Поворот вокруг оси W (четвертая координата)
					const cosPsi = Math.cos(psi);
					const sinPsi = Math.sin(psi);
					const wRotated = w * cosPsi - Math.sqrt(x * x + y * y + z * z) * sinPsi;
					const scale3D = w * sinPsi + Math.sqrt(x * x + y * y + z * z) * cosPsi;

					// Нормализуем 3D компонент
					const length3D = Math.sqrt(x * x + y * y + z * z);
					if (length3D < this.epsilon) {
						return [0, 0, 0, wRotated];
					}

					const x3 = x / length3D * scale3D;
					const y3 = y / length3D * scale3D;
					const z3 = z / length3D * scale3D;

					// Поворот в 3D пространстве (вокруг оси Z)
					const cosPhi = Math.cos(phi);
					const sinPhi = Math.sin(phi);
					const xRotated = x3 * cosPhi - y3 * sinPhi;
					const yRotated = x3 * sinPhi + y3 * cosPhi;
					const zRotated = z3;

					// Поворот в 3D пространстве (вокруг новой оси Y)
					const cosTheta = Math.cos(theta);
					const sinTheta = Math.sin(theta);
					const xFinal = xRotated * cosTheta - zRotated * sinTheta;
					const zFinal = xRotated * sinTheta + zRotated * cosTheta;

					return [xFinal, yRotated, zFinal, wRotated];
				}

				// Обратный поворот (противоположные углы)
				inverseRotation(eulerAngles) {
					const { phi, theta, psi } = eulerAngles;
					return {
						phi: -phi,
						theta: -theta,
						psi: -psi
					};
				}
			}

			// Пример использования
			function demonstrateRotation() {
				const sphere = new HyperSphereRotation();

				// Задаем исходные точки
				const oppositePosition = [0.5, 0.5, 0.5, 0.5];
				const position = [0.3, 0.4, 0.5, 0.6];

				console.log("Исходная точка position:", position);
				console.log("Целевая точка oppositePosition:", oppositePosition);

				// Вычисляем углы Эйлера для поворота из position в oppositePosition
				const eulerAngles = sphere.calculateEulerAngles(oppositePosition, position);
				console.log("Углы Эйлера:", eulerAngles);

				// Поворачиваем точку position на вычисленные углы
				const rotatedPosition = sphere.rotatePoint(position, eulerAngles);
				console.log("Повернутая точка rotatedPosition:", rotatedPosition);

				// Вычисляем обратные углы
				const inverseAngles = sphere.inverseRotation(eulerAngles);
				console.log("Обратные углы Эйлера:", inverseAngles);

				// Поворачиваем rotatedPosition обратно
				const backToPosition = sphere.rotatePoint(rotatedPosition, inverseAngles);
				console.log("Точка после обратного поворота:", backToPosition);

				// Проверяем точность
				const distance = Math.sqrt(
					Math.pow(backToPosition[0] - position[0], 2) +
					Math.pow(backToPosition[1] - position[1], 2) +
					Math.pow(backToPosition[2] - position[2], 2) +
					Math.pow(backToPosition[3] - position[3], 2)
				);

				console.log("Расстояние между исходной и восстановленной точкой:", distance);

				return {
					original: position,
					target: oppositePosition,
					rotated: rotatedPosition,
					restored: backToPosition,
					accuracy: distance
				};
			}

			// Дополнительный пример с точками близкими к полюсам
			function demonstratePoleCase() {
				const sphere = new HyperSphereRotation();

				console.log("\n--- Пример с точками близкими к полюсам ---");

				// Точки близкие к северному полюсу (w ≈ 1)
				const northPole = [0.001, 0.001, 0.001, 0.999];
				const positionNearPole = [0.1, 0.2, 0.3, 0.8];

				console.log("Точка near pole:", positionNearPole);
				console.log("Северный полюс:", northPole);

				const eulerAngles = sphere.calculateEulerAngles(northPole, positionNearPole);
				console.log("Углы Эйлера для полюсного случая:", eulerAngles);

				const rotated = sphere.rotatePoint(positionNearPole, eulerAngles);
				console.log("Повернутая к полюсу точка:", rotated);
			}

			// Запуск примеров
			const result1 = demonstrateRotation();
			demonstratePoleCase();
*/

		}
		
	}
	Vertice(angles) { return Vertice(angles); }
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
				return Vertice([0, 0, 0]);

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
			return Vertice([altitude, latitude, longitude]);

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
		return cartesianToPolar4D(vertice);

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
	/**
	 * @param {THREE.Scene} scene [THREE.Scene]{@link https://threejs.org/docs/index.html?q=sce#api/en/scenes/Scene}
	 * @param {Options} options See <a href="../../jsdoc/Options/Options.html" target="_blank">Options</a>.
	 * @param {object} randomVerticesSettings See <b>randomVerticesSettings</b> of the <a href="./module-HyperSphere-RandomVertices.html" target="_blank">RandomVertices</a> class.
	 * @returns new RandomVertices child class.
	 */
	newRandomVertices(scene, options, randomVerticesSettings) { return new RandomVertices(scene, options, randomVerticesSettings); }

}

const sRandomVertices = 'RandomVertices'
class RandomVertices extends Sphere.RandomVertices {

	constructor(scene, options, randomVerticesSettings) {

		if (randomVerticesSettings.np === undefined) randomVerticesSettings.np = 6;//Количество окружностей в сфере, которые создаются из случайных точек для двумерной гиперсферы
//		randomVerticesSettings.spheresCount = 1;//7;//облако случайных точек делаю из 1 + spheresCount * 2 сфер, которые создаются из случайных точек для двумерной гиперсферы
		if (randomVerticesSettings.debug && (typeof randomVerticesSettings.debug === 'object') && randomVerticesSettings.debug.oneCircles && (randomVerticesSettings.debug.oneCircles.altitudeShift === undefined)) randomVerticesSettings.debug.oneCircles.altitudeShift = 0;
		super(scene, options, randomVerticesSettings);
		this.class = HyperSphere3D;
		
	}

	//overridden methods

	updateCirclesRadiusRadians(changeCirclesPoints, params){
		
		this.aCirclesRadiusRadians.length = 0;
		this.aCirclesRadiusRadians.boUpdate = true;
		changeCirclesPoints(params);
		this.aCirclesRadiusRadians.boUpdate = undefined;
		
	}
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
		const alpha = cos(ψ1) * cos(ψ2) + sin(ψ1) * sin(ψ2) * (cos(θ1) * cos(θ2) + sin(θ1) * sin(θ2) * cos(ϕ1 - ϕ2));
		let θ = arccos(alpha);
		if (isNaN(θ)) {

			if (alpha - 1 < 3e-16) θ = 0;//alpha не может быть больше 1, но иногда alpha вычисляется с небольшой погрешностью 1.0000000000000002, которая нарушает это правило
			else console.error(sRandomVertices + ': getArcAngle. Invalid θ = ' + θ);

		}
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
		
		np - //если количество окружностей равно количеству точек на окружности, то точки будут равномерно располагаться на гиперсфере
		(this.circlesCountDelta != undefined ?
			this.circlesCountDelta ://количество окружностей  нужно уменьшить если окружности находятся внутри или снаружи противоположной вершины.
			0
		):
		
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
		this.aCirclesRadiusRadians.boUpdate ||= this.boCreateCirclesPoints;
		this.setCircles(0, randomVerticesSettings.spheresCount, params.center.altitude);
		this.aCirclesRadiusRadians.boUpdate = undefined;
		if (this.boCreateCirclesPoints) {

			//Выделяем место для точек в this.circlesPoints
			for(let k = 1; k < this.aSpheres[0].length; k++) this.setCircles(0, k, params.center.altitude);
			
		} else {

			//рисуем окружности внутри и снаружи от противоположной точки
			const altitude = params.center.altitude;

			if (!randomVerticesSettings.debug || !randomVerticesSettings.debug.oneCircles)//Во время отладки не рисуем окружности внутри и снаружи от противоположной точки чтобы лучше можно было разглядеть окружности возле противоположной  вершины
				for (let sphereId = 1; sphereId < this.aSpheres.length; sphereId++) {
	
					randomVerticesSettings.spheresCount = sphereId;//Возможно эта строка не нужна
	
					
					const x = this.aSpheres.length - sphereId - 1;
					
					const circlesRadius = aCirclesRadiusRadians[x];// + y;
					if (circlesRadius === 0) {
	
						console.error(sRandomVertices + '.setCirclesCloud: circlesRadius === 0');
						continue;
	
					}
/*					
					const getAltitudeShiftMax = (inCircles) => {

						return this.aCirclesRadiusRadians[sphereId - 1] * inCircles;
						
					}
					circlesPointsOptions.altitudeShiftMaxIn = getAltitudeShiftMax(1);
					circlesPointsOptions.altitudeShiftMaxOut = getAltitudeShiftMax(-1);
*/					
//					circlesPointsOptions.altitudeShiftMax = this.aCirclesRadiusRadians[sphereId - 1];
//					this.aSpheres[sphereId - 1].altitudeShiftMax = this.aCirclesRadiusRadians[sphereId - 1];
					this.setCircles(undefined, sphereId, altitude - circlesRadius, sphereId);//рисуем окружности внутри от противоположной точки
					this.setCircles(undefined, sphereId, altitude + circlesRadius, sphereId);//рисуем окружности снаружи от противоположной точки
					
				}

		}
		this.createCirclesSphere();
	
	}
	setCirclesCloudOnePoint(randomVerticesSettings) { for (let sphereId = 0; sphereId < randomVerticesSettings.spheresCount; sphereId++) this.setCirclesOnePoint(sphereId); }
	pushCirclesRadiusRadians(options, i, abc, R, getCirclePoint, numPoints, params) {

		const aCirclesRadiusRadians = this.aCirclesRadiusRadians;
		if (aCirclesRadiusRadians && (
				(
					aCirclesRadiusRadians.boUpdate &&//изменяется дуга между вершинами. Например когда пользователь изменил коодинату вершины 
					(options.circlesPointsCount === 0)//рисуем окружности вокруг противопрложной точки
				)||
//				this.boCreateCirclesPoints
				(this.boCreateCirclesPoints && aCirclesRadiusRadians.boUpdate)
			) && (i === 0)) {

			const boCreateCirclesPoints = this.boCreateCirclesPoints;
			this.boCreateCirclesPoints = false;
			const b = abc.b, circleDistance = (b === 0 ? 0 ://дуга между вершинами гиперсферы равна нулю. Значит радиус окружности вокруг вершины тоже равен нулю
				abc.a / (aCirclesRadiusRadians.x + b) + abc.c) * R;
			this.boCreateCirclesPoints = boCreateCirclesPoints;
			aCirclesRadiusRadians.push(this.getArcAngle(getCirclePoint({ i: i, numPoints: numPoints, circleDistance: circleDistance, altitude: options.altitude }), params.oppositeVertice)); //Запомнить расстояние между нулевой точкой каждой окружности и противоположной вершиной, равное радиусу окружности в радианах.

		}
	}
	circlesRadiusRadiansSetX(x) { this.aCirclesRadiusRadians.x = x; }
	getAltitudeShift(debug, circleIdMax, options, params) {

		const circleId = options.circleId;
//		if (!debug || !debug.oneCircles || (debug.oneCircles.altitudeShift === undefined)) return 0;
		if (debug && debug.oneCircles && !debug.oneCircles.altitudeShiftIsDefined){

			let altitudeShift = debug.oneCircles.altitudeShift;
			Object.defineProperty(debug.oneCircles, 'altitudeShift', {
				
				get: () => { return altitudeShift; },
				set: (altitudeShiftNew) => {
		
					if (altitudeShift === altitudeShiftNew) return true;
					altitudeShift = altitudeShiftNew;
					if (params.randomVertices) params.randomVertices.changeCirclesPoints();
					return true;
		
				},
			
			});
			debug.oneCircles.altitudeShiftIsDefined = true;
			
		}
		if (circleIdMax === 1) return 0;//В текушей сфере всего одна окружность. Ее не нужно сдвигать.
/*		
		const altitudeShiftMax = debug.oneCircles && debug.oneCircles.altitudeShift ? debug.oneCircles.altitudeShift : options.sphereId != undefined ?
				this.aCirclesRadiusRadians[options.sphereId - 1] * 1 * (
					options.altitude - params.center.altitude < 0 ?
						1 ://рисуем окружности внутри от противоположной точки
						-1//рисуем окружности снаружи от противоположной точки
				) :
				0,
*/				
//		const altitudeShiftMax = ((options.sphereId === undefined) ? 0 : this.aSpheres[options.sphereId - 1].altitudeShiftMax * 
		const altitudeShiftMax = ((options.sphereId === undefined) ? 0 : this.aSpheres[options.sphereId].altitudeShiftMax * 
									(options.altitude - params.center.altitude < 0 ?
										-1 ://рисуем окружности внутри от противоположной точки
										1//рисуем окружности снаружи от противоположной точки
								 )) || 0,
			a = altitudeShiftMax / (1 - 1 / (circleIdMax * circleIdMax * circleIdMax)), b = altitudeShiftMax - a;
		let altitudeShift = a / (circleId * circleId * circleId) + b;
//altitudeShift = 0;
		if (options.sphereId != undefined) {
			
			const aSphere = this.aSpheres[options.sphereId];
			if (aSphere.altitudeShiftMax === undefined) {

/*				
				aSphere.altitudeShift = altitudeShift;
				Object.defineProperty(aSphere, 'altitudeShift', {
			
					get: () => { return altitudeShift; },
					set: (altitudeShiftNew) => {
			
						if (altitudeShift === altitudeShiftNew) return true;
						altitudeShift = altitudeShiftNew;
						params.randomVertices.changeCirclesPoints();
						return true;
			
					},
			
				});
*/				
				let altitudeShiftMax;
//				aSphere.altitudeShiftMax = altitudeShiftMax;
				Object.defineProperty(aSphere, 'altitudeShiftMax', {
			
					get: () => {

						if (altitudeShiftMax === undefined) altitudeShiftMax = 0;//this.aCirclesRadiusRadians[options.sphereId - 1]
						return altitudeShiftMax;
					
					},
					set: (altitudeShiftMaxNew) => {

//						const boAltitudeShiftMaxIsUndefined = altitudeShiftMax === undefined;
						if (altitudeShiftMax === altitudeShiftMaxNew) return true;
						altitudeShiftMax = altitudeShiftMaxNew;
//						if (!boAltitudeShiftMaxIsUndefined)
						params.randomVertices.changeCirclesPoints();
						this.circlesSphere.setVerticesRange(this.verticesRange.start, this.verticesRange.count);
						return true;
			
					},
			
				});
//				aSphere.altitudeShiftIsDefined = true;}

			}

		}
		return altitudeShift;
	
	}
	verticesRange = {
		
		start: 0,
		count: 0,

	}
	gui(fParent, getLanguageCode = () => { return 'en' }, dat = { controllerNameAndTitle: () => {}}) {

		//Localization

		const lang = {

			notSelected: 'not selected',

			randomVertices: 'Random vertices',
			
			spheres: 'Spheres',
			spheresTitle: 'Spheres of the random vertices',

			altitudeShift: 'Altitude Shift Max',
			altitudeShiftTitle: 'Altitude Shift Max',
		
		};

		const _languageCode = getLanguageCode();

		switch (_languageCode) {

			case 'ru'://Russian language

				lang.notSelected = 'Не выбрана';
				
				lang.randomVertices = 'Случайные вершины';
				
				lang.spheres = 'Сферы';
				lang.spheresTitle = 'Сферы случайных вершин';

				lang.altitudeShiftMax = 'Поправка высоты';
				lang.altitudeShiftTitleMax = 'Поправка высоты';

				break;
			default://Custom language

		}

//		const sR = 'r', sL = 'l';
		let aSphere;
		const fRandomVertices = fParent.addFolder(lang.randomVertices),
			cSpheres = fRandomVertices.add({ Spheres: lang.notSelected }, 'Spheres', { [lang.notSelected]: -1 }).onChange((value) => {

				const sphereId = parseInt(value);
				let boDisplay = false;
				this.verticesRange.start = 0;
				this.verticesRange.count = 0;
				if (sphereId != -1) {

					boDisplay = true;
					this.aSpheres[sphereId].forEach((circle) => this.verticesRange.count += circle.numPoints);
					if (sphereId != 0) {
						
						this.verticesRange.count *= 2;
						this.aSpheres[0].forEach((circle) => this.verticesRange.start += circle.numPoints);
						for(let i = 1; i < sphereId; i++) {
	
							let sphereNumPoints = 0;
							this.aSpheres[i].forEach((circle) => sphereNumPoints += circle.numPoints);
							this.verticesRange.start += 2 * sphereNumPoints;
	
						}

					}
					aSphere = this.aSpheres[sphereId];
					if (aSphere.altitudeShiftMax != undefined) cAltitudeShiftMax.setValue(aSphere.altitudeShiftMax);
					else boDisplay = false;

				} else {

					for(let i = 0; i < this.aSpheres.length; i++) {
					
						this.aSpheres[i].forEach((circle) => this.verticesRange.count += circle.numPoints);
						if (i != 0) this.aSpheres[i].forEach((circle) => this.verticesRange.count += circle.numPoints);//Все ненулевые сферы (сферы, которые не проходят через противоположную вершину) повторяются два раза - внутри и снаружи противоположной вершины

					}

				}
				_display(cAltitudeShiftMax.domElement.parentNode.parentNode, boDisplay);
				this.circlesSphere.setVerticesRange(this.verticesRange.start, this.verticesRange.count);
				
			});
		cSpheres.__select[0].selected = true;
		dat.controllerNameAndTitle(cSpheres, lang.spheres, lang.spheresTitle);
		const cAltitudeShiftMax = fRandomVertices.add({altitudeShiftMax: 0}, 'altitudeShiftMax', 0, 0.1, 0.0001).onChange((altitudeShiftMax) => { aSphere.altitudeShiftMax = altitudeShiftMax; });
		dat.controllerNameAndTitle(cAltitudeShiftMax, lang.altitudeShiftMax, lang.altitudeShiftTitleMax);
		_display(cAltitudeShiftMax.domElement.parentNode.parentNode, false);
		
		this.cSpheresAppendChild = () => {

			if (this.aSpheres.length === 0) return;
			const appendItem = (innerHTML, value = innerHTML) => {
				
				const opt = document.createElement('option');
				opt.innerHTML = innerHTML;
				opt.setAttribute('value', value);
				cSpheres.__select.appendChild(opt);
				
			};
			let itemId = 0;
			appendItem(itemId++);
			for (; itemId < this.aSpheres.length; itemId++) { appendItem(itemId); }
					
		}
		
	}

	/////////////////////////////overridden methods

}
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

const _display = (element, boDisplay) => { element.style.display = boDisplay === false ? 'none' : 'block'; }
