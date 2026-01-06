/**
 * @module RandomVerticeSphere
 * @description Generates a random vertice near the opposite vertice in 2D hypersphere.
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

import RandomVertice from './randomVertice.js';
import anglesRange from '../anglesRange.js'
import * as utils from '../utilsSphere.js'
//import Vertice from '../VerticeSphere.js'
import Position from '../position.js'
//import anglesToCartesian from '../anglesToCasterianSphere.js'
//import casterianToAngles from '../casterianToAnglesSphere.js'
//import { anglesToCartesian, casterianToAngles } from '../utilsSphere.js'
import three from '../../three.js'


const sRandomVerticesSphere = 'RandomVerticesSphere',
	π = Math.PI, abs = Math.abs, round = Math.round, random = Math.random,
	sin = Math.sin, asin = Math.asin, cos = Math.cos, tan = Math.tan, atan = Math.atan, atan2 = Math.atan2;
//	range = anglesRange.longitude.range;
export const anglesIdMax = 50;//Количество точек на окружности, расположенной на экваторе

/**
 * Generates a random vertice near the opposite vertice in 2D hypersphere.
 * @class
 * @extends RandomVertice
 */
export class RandomVerticeSphere extends RandomVertice {

	/**
	 * Generates a random vertice near the opposite vertice in 2D hypersphere.
	 * @param {object} [params={}] See the <b>params</b> of the <a href="./module-RandomVertice-RandomVertice.html" target="_blank"><b>RandomVertice</b></a> constructor for details.
	 * @param {boolean} [boCloud=false] true - generates a random vertice cloud.
	 * @param {boolean} [boInitRandomAngles=true] true - init random angles.
	 */
	constructor(params={}, boCloud = false, boInitRandomAngles = true) {

		super(params);

		this.Euler(params);
		
		const arrayCircles = boCloud ? undefined : [];
			
//		if (params.arc === undefined)
		if (!params.boArcIsdefined) {

			params.boArcIsdefined = true;
			let arc = params.arc;
			Object.defineProperty(params, 'arc', {
	
				get: () => {

					if (params.boAllocateMemory) return π;//Выделяется память для облака точек. arc нужно сделать максимально возможным то есть вершины расположены друг против друга. В этом случае выделяется максимальный объем памяти.
					let θ;
					if (arc === undefined) {
						
						const vertice = params.vertice, oppositeVertice = params.oppositeVertice;
						
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
						θ = arccos(sin(ϕ1) * sin(ϕ2) + cos(ϕ1) * cos(ϕ2) * cos(λ1 - λ2));
						if (isNaN(θ)) console.error(sRandomVerticesSphere + ': getArcAngle. Invalid θ = ' + θ);

					} else θ = arc;
					return this.arc(θ);
				
				},
				set: (arcNew) => {
		
					if (arc === undefined) console.error(sRandomVerticesSphere + ': set params.arc. Invalid arc = ' + arc);
					else arc = arcNew;
					return true;
		
				},
		
			});

		}
		
		this.latitude = (utils) => {

			const rnd = (params.random === undefined ? random() : params.random),//rng range from 0 to 1
				b = params.b ? params.b : utils.b(params),
				angle = (
						(
							(atan((
										(rnd === 0) &&//Первая точка окружности
										(b === Infinity) ? //Противоположные вершины совпадают
											1 ://Если сюда не поставить 1, то angle = NaN
											rnd
								   ) * b)) /
							atan(b)//делим на tan(b), что бы при минимальном rnd = 0 и максимальном rnd = 1, p получалось -1 и 1
						) * 2 - 1//центр графика арктангенса сдвигаю вниз на -1
					) * π / 2//Умножаем на π/2 что бы при минимальном rnd = 0 и максимальном rnd = 1  углы попадали на полюса сферы т.е. широта получались от -π/2 до π/2.
							//Тем самым точки почти равномерно распределяются по окружности когда arc = π, тоесть вершина и противоположная вершина расположены на противоположных сторонах окружности
			
			if (isNaN(angle)) console.error(sRandomVerticesSphere + '.anglesCircle: angle = ' + angle);
			return angle;
			
		}
		
		const circlesCount = params.circlesCount != undefined ? params.circlesCount : round(//найти ближайшее целое число
				(anglesIdMax / 2) + 1),//количество окружностей
			k = 1 / (circlesCount - 1),//for params.random = k * circleId;
			getRandomVerticeAnglesParams = (latitude, angleStep) => {

				//Количество точек на текущей окружности равно длинну окружности поделить на угол между соседними точками на окружности, расположенной на экваторе
				let circleAnglesCount = round(//найти ближайшее целое число
						cos(latitude) *//радиус текущей окружности
						2 * π / //длинна текущей окружности
						angleStep
					);
				const angleStep1 = 1 / circleAnglesCount,
					boSouthernCircle = latitude - angleStep < anglesRange.latitude.min,
					boNorthernCircle = latitude + angleStep > anglesRange.latitude.max,
					latitudeMin = boSouthernCircle ? latitude : (angleStep * (0 - 0.5) + latitude),//Минимальная граница широты окружности
					latitudeMax = boNorthernCircle ? latitude : (angleStep * (1 - 0.5) + latitude),//Максимальная граница широты окружности
					latitudeStep = latitudeMax - latitudeMin,//Ширина широты окружности
					latitudeMid = latitudeMin + latitudeStep / 2;//Средняя широта окружности
				if (
					(circleAnglesCount === 0) ||//добавить по одной точке на полюсах
					(
						!params.boAllocateMemory &&
						(
							!arrayCircles && 
							(circleAnglesCount > params.verticesAngles.length)
						) || (
							arrayCircles &&//Вычисляется одна случайная точка. Т.е. randomVerticeSettings.mode = randomVerticeSettings.modes.randomVertice = 1
							(circleAnglesCount === Infinity)
						)
					)
				)
					circleAnglesCount = 1;//когда длинна дуги приближается к нулю, тоесть вершины совпадают, то angleStep стремится к нулю и circleAnglesCount стремится к бесконечности и массив this.verticesAngles переполняется.
											//или когда окружность находится на полюсе т.е. circleAnglesCount === 0
											//Делаем один угол в окружности
				return { angleStep1, latitudeMin, latitudeMax, latitudeStep, latitudeMid, boSouthernCircle, boNorthernCircle, circleAnglesCount };

			},
			getRandomVerticeAngles = (latitude, latitudeStep, latitudeMid, circleAnglesCount, angleStep1, angleId, euler) => {
				
				const randomVerticeAngles = [

					//latitude
					params.debug && params.debug.notRandomVertices ?
					
						latitude : //окружность расположна на одной широте

						//окружность расположна на случайной широте в диапазоне от latitude до latitude - latitudeStep. Нужно, что бы окружность случайных точек немного гуляла по широте от latitude до latitude - angleStep. Тогда поверхность сферы будет случайно заполнена точками.
						//Если это не делать то случайные точки будут располагаться слоями по широте.
						latitudeStep * (random() - 0.5) + latitudeMid,

					//longitude
					utils.normalizeAngle(
						(
							(
								params.debug && params.debug.notRandomVertices ?

									//Положение текущей точки зависит от порядкового номера точки angleId
									(
										circleAnglesCount === 1 ?
										 0 ://Эта точка расположена на полюсе
										 angleStep1 * angleId
									) :
								
									random()//случайное положение текущей точки
							) - 0.5//отнимаем 0.5 что бы диапазон возможных точек был между -0.5 и 0.5. Сразу такой диапазон нельзя вычислять потому что Math.random() имеет диапазон от 0 до 1
						) * π * 2//диапазон возможных углов от -0.5 до 0.5 мняем на диапазон от -π до π
					)
				];
				//console.log('randomVerticeAngles = ' + randomVerticeAngles.toString());

				//Когда вычисляется одна точка arrayCircles != undefined или randomVerticeSettings.mode = randomVerticeSettings.modes.randomVertice = 1 то this.verticesAngles пустой
				if (!arrayCircles && (this.circlesPointsCount >= params.verticesAngles.length)) console.error(sRandomVerticesSphere + '.verticesAngles: Allocate memory failed! this.circlesPointsCount = ' + this.circlesPointsCount + ' >= params.verticesAngles.length = ' + params.verticesAngles.length);

				//rotate angles

				const initialLatitude = randomVerticeAngles[0],
					initialLongitude = randomVerticeAngles[1];
				
				const cartesian = utils.anglesToCartesian({ latitude: initialLatitude, longitude: initialLongitude });
//				const rotated = casterianToAngles(new three.THREE.Vector3(cartesian[0], cartesian[1], cartesian[2]).applyEuler(euler));
				let rotated = utils.casterianToAngles(new three.THREE.Vector3(cartesian[0], cartesian[1], cartesian[2]).clone().applyQuaternion(euler));
				if (params.hyperSphere) rotated = params.hyperSphere.vertice(rotated);
				
				/*Есть точка на поверхности сферы в полярной системе координат. Начало полярной системы координат находится в центре сферы.
				Написать на javascript исходный код поворота этой точки на произвольный угол с использованием углов Эйлера.
				Полярный угол должен быть в диапазоне от π/2 на северном полюсе до -π/2 на южном полюсе. Азимутальный угол должен быть в диапазоне от -π до π.
				Результат поворота должен быть в полярной системе коодинат.
				*/

				/**
				 * Поворот точки на поверхности сферы с использованием углов Эйлера
				 * @param {number} latitude - Полярный угол (θ) в диапазоне [-π/2, π/2]
				 * @param {number} longitude - Азимутальный угол (φ) в диапазоне [-π, π]
				 * @param {number} α - Угол Эйлера вокруг оси Z (поворот по Z). Поворот вокруг собственной оси
				 * @param {number} β - Угол Эйлера вокруг оси X (поворот по X)
				 * @param {number} γ - Угол Эйлера вокруг оси Z (поворот по Z)
				 * @returns {Object} Новые полярные координаты {latitude, longitude}
				 */
/*				
				const rotatePointWithEulerAngles = (latitude, longitude, α, β, γ) => {

//const cartesian = anglesToCartesian({latitude: latitude, longitude: longitude})
					// 1. Преобразование полярных координат в декартовы
					const x = cos(latitude) * cos(longitude),
						y = cos(latitude) * sin(longitude),
						z = sin(latitude),
					
					// 2. Применение поворотов с использованием углов Эйлера (Z-X-Z)
					// Поворот α вокруг оси Z
						x1 = α === 0 ? x : x * cos(α) - y * sin(α),
						y1 = α === 0 ? y : x * sin(α) + y * cos(α),
						z1 = z,
					
					// Поворот β вокруг новой оси X
						x2 = x1,
						y2 = y1 * cos(β) - z1 * sin(β),
						z2 = y1 * sin(β) + z1 * cos(β),
					
					// Поворот γ вокруг новой оси Z
						x3 = x2 * cos(γ) - y2 * sin(γ),
						y3 = x2 * sin(γ) + y2 * cos(γ),
						z3 = z2,
					
					// 3. Преобразование обратно в полярные координаты
						newLatitude = asin(z3), // В диапазоне [-π/2, π/2]
						newLongitude = atan2(y3, x3), // В диапазоне [-π, π]

						arrayAngles = [newLatitude, newLongitude];

					if (params.hyperSphere) return params.hyperSphere.vertice(arrayAngles);
					else utils.angles(arrayAngles);
					
					return arrayAngles;
				}
				console.error('debug');
*/
				/*
				// Пример использования:
				const initialLatitude = Math.PI/4; // 45 градусов от экватора
				const initialLongitude = Math.PI/2; // 90 градусов восточной долготы
				
				// Поворот на 30 градусов по всем осям Эйлера
				const α = Math.PI/6; // 30 градусов
				const β = Math.PI/6;  // 30 градусов
				const γ = Math.PI/6; // 30 градусов
				
				const rotated = rotatePointWithEulerAngles(
					initialLatitude, initialLongitude, α, β, γ
				);
				
				console.log("Исходные координаты:", {
					polar: initialLatitude,
					azimuthal: initialLongitude
				});
				console.log("После поворота:", rotated);
				*/
/*				
				// Поворот
				const α = 0,
					β = params.oppositeVertice.latitude - π / 2,
					γ = params.oppositeVertice.longitude - π / 2;
				const rotatedOld = rotatePointWithEulerAngles(initialLatitude, initialLongitude, α, β, γ);
*/				
				return rotated;
				
			},
			verticesAngles = (boAllocateMemory) => {

				//Сфера случайных точек состоит из набора окружностей.
				
//				const arc = params.arc;
				this.circlesPointsCount = boAllocateMemory ? undefined : //Во время выделения памяти в массив this.verticesAngles добавляется новый item
					0;//в противном случае в массиве this.verticesAngles редактируется item с индексом this.circlesPointsCount
				let latitudePrev = 0;//широта предыдущей окружности
				const euler = !boAllocateMemory && params.Euler ? params.Euler() : undefined;
				for(let circleId = 0; circleId < circlesCount; circleId++){

					params.random = k * circleId;

					const latitude = this.latitude(utils);
					if (
						!boAllocateMemory &&//Не выделяется память
						params.hyperSphere &&//Создается облако гиперсферы случайных точек. Состоит из массива сфер на разной высоте. Сейчас создается сфера на высоте противоположной вершины params.oppositeVertice.altitude.
						!params.hyperSphere.middleSphere.boNoAddALatitude//Это первая сфера. Для остальных сфер не нужно добавлять широту в aLatitude потому что они будут дублироваться
					)
						params.hyperSphere.middleSphere.aLatitude.push(latitude);//Создается сфера для облака случайных точек гиперсферы, которая находится на высоте противоположной вершины params.oppositeVertice.altitude = params.altitude
					const angleStep = abs(latitude - latitudePrev),//угол между соседними точками на окружности
						randomVerticeAnglesParams = getRandomVerticeAnglesParams(latitude, angleStep);
					latitudePrev = latitude; 
					if (arrayCircles && !boAllocateMemory) {

						const circleAnglesCount = randomVerticeAnglesParams.circleAnglesCount;
						arrayCircles.push({ latitude, angleStep, latitudeStep: randomVerticeAnglesParams.latitudeStep, latitudeMid: randomVerticeAnglesParams.latitudeMid, circleAnglesCount });
						this.circlesPointsCount += circleAnglesCount;
						continue;

					}
					const angleStep1 = randomVerticeAnglesParams.angleStep1,
						latitudeStep = randomVerticeAnglesParams.latitudeStep,//Ширина широты окружности
						latitudeMid = randomVerticeAnglesParams.latitudeMid,//Средняя широта окружности
						circleAnglesCount = randomVerticeAnglesParams.circleAnglesCount;
					
					for (let angleId = 0; angleId < circleAnglesCount; angleId++) {

						if (boAllocateMemory) params.verticesAngles.push(this.ZeroArray());//allocate memory
						else {//edit memory

							const rotated = getRandomVerticeAngles(latitude, latitudeStep, latitudeMid, circleAnglesCount, angleStep1, angleId, euler);
							params.verticesAngles[params.pointsCount] = rotated;
							params.pointsCount++;
							this.circlesPointsCount++;
							
						}
			
					}
					
				}
				delete params.random;
				delete params.b;
				
			};

		if (!arrayCircles) {//не выделять this.verticesAngles если нужно вычислить одну случайную точку randomVerticeSettings.mode = randomVerticeSettings.modes.randomVertice = 1
			
			//Allocate this.verticesAngles memory
			params.boAllocateMemory = true;
			verticesAngles(params.boAllocateMemory);
			delete params.boAllocateMemory;

		}

		//overridden methods

/*		
		Object.defineProperty(this, 'angles', {
			
			get: () => { return params.verticesAngles; },
			set: (anglesNew) => { params.verticesAngles = anglesNew; },
			
		});
*/
		this.getAngles = () => { return params.verticesAngles; }
		this.setAngles = (anglesNew) => { params.verticesAngles = anglesNew; }
/*		
		Object.defineProperty(this, 'randomAngles', {

			get: () => {

				if (arrayCircles) arrayCircles.length = 0;
				verticesAngles(false);
				const randomVerticeId = round(random() * (this.circlesPointsCount - 1))

				if (arrayCircles) return this.getRandomAngle(randomVerticeId);
				else return this.angles;

			},
			set: (anglesNew) => { },

		});
*/		
		this.getRandomAngles = () => {
			
			if (arrayCircles) arrayCircles.length = 0;
			verticesAngles(false);
			params.verticesAngles.needsUpdate;
			const randomVerticeId = round(random() * (this.circlesPointsCount - 1))

			if (arrayCircles) return this.getRandomAngle(randomVerticeId);
			else return this.angles;
			
		}

		Object.defineProperty(this, 'сirclesParams', {
			
			get: () => {

				if (arrayCircles) arrayCircles.length = 0;
				verticesAngles(false);
				return arrayCircles;
				
			},
			set: (anglesNew) => {},
			
		});
		this.getRandomAngle = (randomVerticeId) => {

			let verticeId = 0;
			const euler = params.Euler ? params.Euler() : undefined;
			for (let circleId = 0; circleId < arrayCircles.length; circleId++) {
	
				const circle = arrayCircles[circleId];
				verticeId += circle.circleAnglesCount;
				if (verticeId >= randomVerticeId) {
	
					//случайная вершина находится на текущей окружности.
					const randomVerticeAnglesParams = getRandomVerticeAnglesParams(circle.latitude, circle.angleStep),
						rotated = getRandomVerticeAngles(circle.latitude, circle.latitudeStep, circle.latitudeMid, circle.circleAnglesCount, randomVerticeAnglesParams.angleStep1, randomVerticeId - (verticeId - circle.circleAnglesCount), euler);

					if (params.editAnglesId === undefined) {
						
						params.verticesAngles.push(rotated);
						params.pointsCount++;
						
					} else params.verticesAngles[params.editAnglesId] = rotated;
					return this.angles;
					
				}
	
			}
			console.error(sRandomVerticesSphere + '.getRandomAngle. Random vertice was not found.');
			
		}
		
		Object.defineProperty(this, 'cloud', {
			
			get: () => {

				verticesAngles(false);
				return params.verticesAngles;
				
			},
			
		});
		
		/////////////////////////////overridden methods

		if (arrayCircles) {

			//Когда создается облако случайных точек randomVerticeSettings.mode = randomVerticeSettings.modes.randomCloud = 2, то boInitRandomAngles = false и не нужно инициализировать случайные точки для экономии времени.
			//Если создается одна случайная точка randomVerticeSettings.mode = randomVerticeSettings.modes.randomVertice = 1, то boInitRandomAngles = true и нужно инициализировать случайные точки.
			//Иначе при изменении положения вершины или противоположной вершины почему то появляется несколько случайных точек.
			if (boInitRandomAngles) {

				params.pointsCount = 0;
				this.randomAngles;//Вычислить случайную точку если нужна одна случайная точка т.е. randomVerticeSettings.mode = randomVerticeSettings.modes.randomVertice = 1 или randomVerticeSettings.mode = randomVerticeSettings.modes.randomCloud = 2
				params.editAnglesId = 0;

			}
			
		} else verticesAngles(false);//Вычислить облако случайных точек

	}
	
	//overridden methods
	
	ZeroArray() { return [0, 0]; }
	Euler(params) {

//		if (!params) return;
		params.Euler = () => {

			const r = 1;//радиус может быть любой this.r;//this.classSettings.r;

			/*
Заданы две произвольные точки position0 и position1 на поверхности сферы в декартовой системе координат. Начало координат находится в центре сферы.
Вычислить кватернионы, применяя которые можно точку position0 переместить в точку position1.
Обрабатать случай, когда точка близка к полюсам.
Написать пример, в котором вычисляется точка rotatedPosition как применение вычисленных кватернионов к точке position0.
rotatedPosition должна получиться равной position1.
Затем точку rotatedPosition повернуть обратно так, что бы она снова оказалась в положении точки position0.
Написать код на Javascript.
Применить библиотеку three.js.
			*/
			//https://giga.chat/agents/019a5d95-ab99-7c86-a31c-610dad03b054/sessions/019ac367-b6d9-748f-a904-2bca5017e564
			// Импортируем необходимую библиотеку
			//			import * as THREE from 'https://cdn.skypack.dev/three';
			const THREE = three.THREE;

			// Начальные точки
			//			let position0 = new THREE.Vector3(1, 0, 0); // первая точка на сфере
			//			let position1 = new THREE.Vector3(0, 1, 0); // вторая точка на сфере
//			const position = this.classSettings.settings.object.geometry.position, p0 = position[0], p1 = position[1];
			const p1 = Position(utils.anglesToCartesian(params.oppositeVertice, r));
			//			let position0 = new THREE.Vector3(p0.x, p0.y, p0.z); // первая точка на сфере
			const position0 = new THREE.Vector3(0, 0, r); // первая точка на сфере
			const position1 = new THREE.Vector3(p1.x, p1.y, p1.z); // вторая точка на сфере

			// Функция, возвращающая кватернион, переносящий position0 в position1
			function getRotationQuaternion(v0, v1) {
				// Убедимся, что точки являются единичными векторами (находятся на поверхности сферы)
				v0.normalize();
				v1.normalize();

				// Векторное произведение даёт нам ось вращения
				let axis = new THREE.Vector3().crossVectors(v0, v1);

				// Особый случай: точки равны или диаметрально противоположны
				if (axis.lengthSq() < Number.EPSILON) {
					if (v0.dot(v1) >= 0) {
						// Вектора одинаковы, значит никакого вращения не требуется
						return new THREE.Quaternion().identity();
					} else {
						// Диаметральные противоположные точки, используем специальную ось вращения
						// Можно выбрать любую фиксированную ось, отличную от направления обоих векторов
						axis.set(0, 1, 0); // ось Y, можно выбрать любую удобную ось
					}
				} else {
					// Иначе используем найденную ось вращения
					axis.normalize();
				}

				// Получаем угол между векторами
				let angle = v0.angleTo(v1);

				// Строим кватернион
				return new THREE.Quaternion().setFromAxisAngle(axis, angle);
			}

			// Расчёт кватерниона для перемещения точки position0 в position1
			const forwardQuaternion = getRotationQuaternion(position0, position1);

			/*Проверка

			console.log("position0:", position0.toArray());
			console.log("position1:", position1.toArray());
			
			// Перемещаем точку position0 с помощью кватерниона
			const rotatedPosition = position0.clone().applyQuaternion(forwardQuaternion);

			// Проверка результата (должна получиться точка position1)
			console.log("Повернутая позиция:", rotatedPosition.toArray());

			// Возвращаемся обратно, создавая инверсный кватернион
			const backwardQuaternion = forwardQuaternion.clone().invert();

			// Поворачиваем обратно
			const backPosition = rotatedPosition.clone().applyQuaternion(backwardQuaternion);

			// Проверка возвращения обратно (должна стать равна position0)
			console.log("Возвращённая позиция:", backPosition.toArray());
			*/
			return forwardQuaternion;
			/*
Заданы две произвольные точки position1 и position2 на поверхности сферы в декартовой системе координат. Начало координат находится в центре сферы.
Радиус сферы r.
Положение точек обозначить как
position1.x
position1.y
position1.z

position2.x
position2.y
position2.z
Вычислить углы Эйлера, применяя которые можно точку position1 переместить в точку position2.
Обрабатать случай, когда точка близка к полюсам.
Написать пример, в котором вычисляется точка rotatedPosition как применение вычисленных углов Эйлера к точке position1.
rotatedPosition должна получиться равной position2.
Затем точку rotatedPosition повернуть обратно так, что бы она снова оказалась в положении точки position1.
Написать код на Javascript.
Применить библиотеку three.js.
			*/
			//https://giga.chat/agents/019a5d95-ab99-7c86-a31c-610dad03b054/sessions/019ac2e3-afcf-72c3-ac94-808023192cf3
			/*https://chat.deepseek.com/a/chat/s/d4122bcc-0fa5-4cc3-b9c0-a1eb2cca6154
			Есть две точки на поверхости сферы.
			Название первой точки: vertice.
			Название второй точки: oppositeVertice.
			Как вычислить углы Эйлера, с помощию которых можно переместить точку 1 в точку 2? Написать пример на Javascript
			*/
			/**
			 * Вычисляет углы Эйлера для поворота точки A в точку B на поверхности сферы
			 * @param {Array} oppositeVertice - Координаты второй точки [x, y, z]
			 * @param {Array} [vertice=[0, 0, r]] - Координаты первой точки [x, y, z]. По умолчанию северный полюс
			 * @returns {Object} Объект с углами Эйлера в радианах и градусах
			 */
			/*
						function calculateEulerAngles(oppositeVertice, vertice=[0, 0, r]) {
							
							// Нормализуем векторы (предполагаем, что они уже на поверхности единичной сферы)
							const v1 = normalize(vertice);
							const v2 = normalize(oppositeVertice);
			
							// Вычисляем ось вращения (векторное произведение)
							const axis = crossProduct(v1, v2);
			
							// Если точки совпадают или противоположны, возвращаем нулевые углы
							if (magnitude(axis) < 1e-10) {
								// Проверяем, являются ли точки противоположными
								if (dotProduct(v1, v2) < -0.999) {
									// Для противоположных точек выбираем произвольную ось вращения
									return {
										alpha: Math.PI,
										beta: 0,
										gamma: 0,
										alphaDeg: 180,
										betaDeg: 0,
										gammaDeg: 0
									};
								}
								return {
									alpha: 0,
									beta: 0,
									gamma: 0,
									alphaDeg: 0,
									betaDeg: 0,
									gammaDeg: 0
								};
							}
			
							// Нормализуем ось вращения
							const axisNorm = normalize(axis);
			
							// Вычисляем угол вращения (скалярное произведение)
							const cosAngle = dotProduct(v1, v2);
							const angle = Math.acos(Math.max(-1, Math.min(1, cosAngle)));
			
							// Преобразуем ось вращения в углы Эйлера (ZYX конвенция)
							// Сначала вычисляем матрицу вращения из оси и угла
							const rotationMatrix = axisAngleToRotationMatrix(axisNorm, angle);
			
							// Затем преобразуем матрицу вращения в углы Эйлера
							const eulerAngles = rotationMatrixToEulerZYX(rotationMatrix);
			
							return {
								alpha: eulerAngles.alpha,
								beta: eulerAngles.beta,
								gamma: eulerAngles.gamma,
							};
						}
			
						// Вспомогательные функции
			
						function normalize(v) {
							const mag = magnitude(v);
							return [v[0] / mag, v[1] / mag, v[2] / mag];
						}
			
						function magnitude(v) {
							return Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
						}
			
						function dotProduct(a, b) {
							return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
						}
			
						function crossProduct(a, b) {
							return [
								a[1] * b[2] - a[2] * b[1],
								a[2] * b[0] - a[0] * b[2],
								a[0] * b[1] - a[1] * b[0]
							];
						}
			
						function axisAngleToRotationMatrix(axis, angle) {
							const [x, y, z] = axis;
							const c = Math.cos(angle);
							const s = Math.sin(angle);
							const t = 1 - c;
			
							return [
								[t * x * x + c, t * x * y - s * z, t * x * z + s * y],
								[t * x * y + s * z, t * y * y + c, t * y * z - s * x],
								[t * x * z - s * y, t * y * z + s * x, t * z * z + c]
							];
						}
			
						function rotationMatrixToEulerZYX(matrix) {
							const [m00, m01, m02] = matrix[0];
							const [m10, m11, m12] = matrix[1];
							const [m20, m21, m22] = matrix[2];
			
							let alpha, beta, gamma;
			
							if (Math.abs(m20) < 0.999999) {
								beta = Math.atan2(-m20, Math.sqrt(m00 * m00 + m10 * m10));
								alpha = Math.atan2(m10, m00);
								gamma = Math.atan2(m21, m22);
							} else {
								// Сингулярность (gimbal lock)
								alpha = Math.atan2(-m01, m11);
								beta = -Math.PI / 2 * Math.sign(m20);
								gamma = 0;
							}
			
							return { alpha, beta, gamma };
						}
						const THREE = three.THREE;
						const position = this.classSettings.settings.object.geometry.position;
			//			const vertice = position[0];
			//			const vertice = [0, 0, this.classSettings.r];
			//			const oppositeVertice = position[1];
						const euler = calculateEulerAngles(position[1]);//vertice);
						const eulerTHREE = new THREE.Euler(euler.gamma, euler.beta, euler.alpha, 'ZYX');
			*/

			/*
			// Пример использования
			//const vertice = this.a2v(utils.angles([0.1, 0.2]));//[1, 0, 0];
			//const oppositeVertice = this.a2v(utils.angles([0.4, 0.5]));//[0, 1, 0];


			console.log('Углы Эйлера (радианы):');
			console.log(`alpha: ${euler.alpha.toFixed(4)}`);
			console.log(`beta: ${euler.beta.toFixed(4)}`);
			console.log(`gamma: ${euler.gamma.toFixed(4)}`);

			// Проверка: применяем поворот к исходной точке
			function applyEulerRotation(point, alpha, beta, gamma) {
				
//				const [x, y, z] = point;
				const x = point.x, y = point.y, z = point.z;

				// Поворот вокруг Z (alpha)
				const x1 = x * Math.cos(alpha) - y * Math.sin(alpha);
				const y1 = x * Math.sin(alpha) + y * Math.cos(alpha);
				const z1 = z;

				// Поворот вокруг Y (beta)
				const x2 = x1 * Math.cos(beta) + z1 * Math.sin(beta);
				const y2 = y1;
				const z2 = -x1 * Math.sin(beta) + z1 * Math.cos(beta);

				// Поворот вокруг X (gamma)
				const x3 = x2;
				const y3 = y2 * Math.cos(gamma) - z2 * Math.sin(gamma);
				const z3 = y2 * Math.sin(gamma) + z2 * Math.cos(gamma);

				return [x3, y3, z3];
			}

			const rotatedPoint = applyEulerRotation(
				vertice,
				euler.alpha,
				euler.beta,
				euler.gamma
			);

			const verticeTHREE = new THREE.Vector3(vertice[0], vertice[1], vertice[2]);
			verticeTHREE.applyEuler(eulerTHREE);

			console.log('\nПроверка:');
			console.log('Исходная точка: x= ' + vertice.x + ' y = ' + vertice.y + ' z = ' + vertice.z);
//			console.log('Целевая точка:', oppositeVertice);
			console.log('Целевая точка: x= ' + oppositeVertice.x + ' y = ' + oppositeVertice.y + ' z = ' + oppositeVertice.z);
			console.log('После поворота THREE:', verticeTHREE);
			console.log('После поворота:', rotatedPoint);
			*/
			//			return eulerTHREE;

		}

	}
	Center(params) {

/*		
		const Vertice = (vertice) => {
		
			if (vertice.longitude != undefined) return;
			while (vertice.length < 2) vertice.push(0);
			Object.defineProperty(vertice, 'longitude', {
				
				get: () => { return vertice[1]; },
				set: (longitude) => {
		
					if (vertice[1] === longitude) return true;
					vertice[1] = longitude;
					return true;
		
				},
			
			});
			Object.defineProperty(vertice, 'latitude', {
				
				get: () => { return vertice[0]; },
				set: (latitude) => {
		
					if (vertice[0] === latitude) return true;
					vertice[0] = latitude;
					return true;
		
				},
			
			});
		
		}
*/		
		utils.angles(params.vertice);
		utils.angles(params.oppositeVertice);
		
	}
	
	/////////////////////////////overridden methods

}
