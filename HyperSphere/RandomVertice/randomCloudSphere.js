/**
 * @module RandomCloudCircle
 * @description Generates a cloud of random vertices near the opposite vertice in 2D hypersphere.
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

import RandomCloud from './randomCloud.js';
import RandomVertice from './randomVerticeSphere.js';
import * as utils from './utilsSphere.js'
import anglesRange from '../anglesRange.js'

const sRandomCloudSphere = 'RandomCloudSphere';
const π = Math.PI;

/**
 * Generates a cloud of random vertices near the opposite vertice in 2D hypersphere.
 * @class
 */
class RandomCloudSphere extends RandomCloud//Circle
{

	/**
	 * Generates a cloud of random vertices near the opposite vertice in 2D hypersphere.
	 * @param {object} [params={}] See the <b>params</b> of the <b>RandomVertice</b> constructor.
	 */
	constructor(params) {

		super(params);

		const anglesIdMax = 50,//Количество точек на окружности, расположенной на экваторе
			circlesCount = (anglesIdMax / 2) + 1,//количество окружностей
			k = 1 / (circlesCount - 1),//for params.random = k * circleId;
//			angleStep = (anglesRange.longitude.max - anglesRange.longitude.min) / anglesIdMax,//угол между соседними точками на окружности, расположенной на экваторе
			sin = Math.sin, cos = Math.cos, asin = Math.asin, atan = Math.atan, atan2 = Math.atan2,
			round = Math.round, random = Math.random, abs = Math.abs,
			range = anglesRange.latitude.range,// latitudeMax = anglesRange.latitude.max, latitudeMin = anglesRange.latitude.min,
			randomVertice = new RandomVertice(params),
/*			
			utilsCircle = {
					
				normalizeAngle: (angle) => {
				
					if (angle > latitudeMax) {

console.error('angle > ' + latitudeMax);							
						angle -= range;
						if (angle > latitudeMax)
							console.error('angle > ' + latitudeMax);
				
					} else {
				
						if (angle < latitudeMin) {
							
console.error('angle < ' + latitudeMin);
							angle += range;
							if (angle < latitudeMin)
								console.error('angle < ' + latitudeMin);

						}
				
					}
					return angle;
				
				},
				b: (arc) => {

					//for atan((random + 0.5) * b)
					return π / arc;
						
				}
			},
*/			
			verticesAngles = (boAllocateMemory) => {

				//Сфера случайных точек состоит из набора окружностей.
				
//				const k = 1 / (circlesCount - 1);
				const arc = boAllocateMemory ?
					π ://Когда выделяется память для облака случайных точек (boAllocateMemory = true), надо сделать максимальное расстояние между вершинами (arc = π).
						//В этом случае размер выделяемой памяти будет максимальным
					params.arc;
				this.circlesPointsCount = boAllocateMemory ? undefined : //Во время выделения памяти в массив this.verticesAngles добавляется новый item
					0;//в противном случае в массиве this.verticesAngles редактируется item с индексом this.circlesPointsCount
				let latitudePrev = 0;//широта предыдущей окружности
				for(let circleId = 0; circleId < circlesCount; circleId++){

					params.random = k * circleId;

					const rnd = (params.random === undefined ? Math.random() : params.random) - 0.5,
//						b = params.b ? params.b : utilsCircle.b(arc),//params),
						b = params.b ? params.b : utils.b(arc),//params),
						angle = (
								(
									//К аргументу atan добавляю 0.5 что бы график atan сместился влево на -0.5
									(atan(((
												(rnd === -0.5) &&//Первая точка окружности
												(b === Infinity) ? //Противоположные вершины совпадают
													0 ://Если сюда не поставить ноль, то p = NaN
													rnd
										   ) + 0.5) * b)) /
									atan((0.5 + 0.5) * b)//делим на tan(0.5 * b), что бы при минимальном rnd = -0.5 и максимальном rnd = 0.5, p получалось -1 и 1
								) * 2 - 1//центр графика арктангенса сдвигаю вниз на -1
							) *
							π / 2;//Умножаем на π/2 что бы при минимальном rnd = -0.5 и максимальном rnd = 0.5  углы попадали на полюса сферы т.е. получались от -π/2 до π/2.
							//Тем самым точки почти равномерно распределяются по окружности когда arc = π, тоесть вершина и противоположная вершина расположены на противоположных сторонах окружности

					if (isNaN(angle)) console.error(sRandomCloudSphere + ': get randomAngles. p = ' + p);
//					const latitude = utilsCircle.normalizeAngle(angle),
					const latitude = utils.normalizeAngle(angle),
						angleStep = abs(latitude - latitudePrev);//угол между соседними точками на окружности
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
					if (!boAllocateMemory && (circleAnglesCount > this.verticesAngles.length))
						circleAnglesCount = 1;//когда длинна дуги приближается к нулю, тоесть вершины совпадают, то angleStep стремится к нулю и circleAnglesCount стремится к бесконечности и массив this.verticesAngles переполняется.
												//Делаем один угол в окружности
					//console.log('latitude = ' + latitude + ', latitudePrev = ' + latitudePrev + ', circleAnglesCount = ' + circleAnglesCount);
					latitudePrev = latitude; 
					//console.log('boFirstOrLastCircle = ' + (boSouthernCircle || boNorthernCircle) + ', latitude = ' + latitude + ', latitudeMin = ' + latitudeMin + ', latitudeMax = ' + latitudeMax);
					
					for (let angleId = 0; angleId < circleAnglesCount; angleId++) {

						if (this.circlesPointsCount === undefined) this.verticesAngles.push(randomVertice.ZeroArray());//allocate memory
						else {//edit memory

							const randomVerticeAngles = [
	
								//latitude
								params.debug && params.debug.notRandomVertices ?
								
									latitude : //окружность расположна на одной широте
	
									//окружность расположна на случайной широте в диапазоне от latitude до latitude - angleStep. Нужно, что бы окружность случайных точек немного гуляла по широте от latitude до latitude - angleStep. Тогда поверхность сферы будет случайно заполнена точками.
									//Если это не делать то случайные точки будут располагаться слоями по широте.
									latitudeStep * (random() - 0.5) + latitudeMid,
	
								//longitude
								utils.normalizeAngle(
									(
										(
											params.debug && params.debug.notRandomVertices ?
	
												//Положение текущей точки зависит от порядкового номера точки angleId
												(circleAnglesCount === 0 ?
													 0 ://Эта точка расположена на полюсе
													 angleStep1 * angleId) :
											
												random()//случайное положение текущей точки
										) - 0.5//отнимаем 0.5 что бы диапазон возможных точек был между -0.5 и 0.5. Сразу такой диапазон нельзя вычислять потому что Math.random() имеет диапазон от 0 до 1
									) * π * 2//диапазон возможных углов от -0.5 до 0.5 мняем на диапазон от -π до π
								)
							];
							//console.log('randomVerticeAngles = ' + randomVerticeAngles.toString());
							
							if (this.circlesPointsCount >= this.verticesAngles.length) console.error(sRandomCloudSphere + '.verticesAngles: Allocate memory failed! this.circlesPointsCount = ' + this.circlesPointsCount + ' >= this.verticesAngles.length = ' + this.verticesAngles.length);

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
							const rotatePointWithEulerAngles = (latitude, longitude, α, β, γ) => {
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
								
								Object.defineProperty(arrayAngles, 'longitude', { get: () => { return arrayAngles[1]; }, });
								Object.defineProperty(arrayAngles, 'latitude' , { get: () => { return arrayAngles[0]; }, });
								
							    return arrayAngles;
							}

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
							const initialLatitude = randomVerticeAngles[0],
								initialLongitude = randomVerticeAngles[1],
							
							// Поворот
								α = 0,
								β = params.oppositeVertice.latitude - π / 2,
								γ = params.oppositeVertice.longitude - π / 2,
								rotated = rotatePointWithEulerAngles(initialLatitude, initialLongitude, α, β, γ);
							//this.verticesAngles[this.circlesPointsCount] = [rotated.latitude, rotated.longitude];
							this.verticesAngles[this.circlesPointsCount] = rotated;
							this.circlesPointsCount++;
							
						}
			
					}
					
				}
console.log('this.circlesPointsCount = ' + this.circlesPointsCount)
				delete params.random;
				delete params.b;
				
			};

		//Allocate this.verticesAngles memory
		verticesAngles(true);
		
		//overridden methods

		Object.defineProperty(this, 'randomAngles', {
			
			get: () => {

				verticesAngles(false);
/*				
				//Сфера состоит из набора окружностей.

				const atan = Math.atan, abs = Math.abs,
					range = anglesRange.latitude.range, latitudeMax = anglesRange.latitude.max, latitudeMin = anglesRange.latitude.min;
				
				const utilsCircle = {
					
					normalizeAngle: (angle) => {
					
						if (angle > latitudeMax) {

console.error('angle > ' + latitudeMax);							
							angle -= range;
							if (angle > latitudeMax)
								console.error('angle > ' + latitudeMax);
					
						} else {
					
							if (angle < latitudeMin) {
								
console.error('angle < ' + latitudeMin);
								angle += range;
								if (angle < latitudeMin)
									console.error('angle < ' + latitudeMin);

							}
					
						}
						return angle;
					
					},
					b: (params) => {

						//for atan((random + 0.5) * b)
						const arc = params.arc,
						
							//arc = π, b = 1 все точки почти равномерно распределяются по кругу. В идеале должна быть прямая линия между точками (random = -0.5, latitude = -π/2) и (random = 0.5, latitude = π/2)
								//На самом деле между этими точками проходит arctangens
							
							//arc = 0, b = infinity все точки стягиваются в одну точку. Горизонтальная прямая линия между точками (random = -0.5, latitude = π/2) и (random = 0.5, latitude = π/2).
								//atan(Infinity) = π/2
//							b = arc * a + c;
							b = π / arc;
						
						return b;
							
					}
				}
				
				//что бы не делать повторяющихся вычислений
				params.b = utilsCircle.b(params);
				
				const anglesCircle = (utils) => {
					
					const random = (params.random === undefined ? Math.random() : params.random) - 0.5,
						b = params.b ? params.b : utils.b(params),
						p = (
								(
									//К аргументу atan добавляю 0.5 что бы график atan сместился влево на -0.5
									(atan(((
												(random === -0.5) &&//Первая точка окружности
												(b === Infinity) ? //Противоположные вершины совпадают
													0 ://Если сюда не поставить ноль, то p = NaN
													random
										   ) + 0.5) * b)) /
									atan((0.5 + 0.5) * b)//делим на tan(0.5 * b), что бы при минимальном random = -0.5 и максимальном random = 0.5, p получалось -1 и 1
								) * 2 - 1//центр графика арктангенса сдвигаю вниз на -1
							) *
							π / 2;//Умножаем на π/2 что бы при минимальном random = -0.5 и максимальном random = 0.5  углы попадали на полюса сферы т.е. получались от -π/2 до π/2.
							//Тем самым точки почти равномерно распределяются по окружности когда arc = π, тоесть вершина и противоположная вершина расположены на противоположных сторонах окружности

					if (isNaN(p)) console.error(sRandomCloudSphere + ': get randomAngles. p = ' + p);
					let angle = p;// + params.oppositeVertice.longitude;
					
					angle = utils.normalizeAngle(angle);
//console.log('angle = ' + angle + ', random = ' + random)
					return angle;
					
				}
				const k = 1 / (circlesCount - 1);
				let latitudePrev = 0;//широта предыдущей окружности
				for(let circleId = 0; circleId < circlesCount; circleId++){

					params.random = k * circleId;
					const latitude = anglesCircle(utilsCircle),
						angleStep = abs(latitude - latitudePrev);//угол между соседними точками на окружности
//console.log('latitude = ' + latitude)
					//Количество точек на текущей окружности равно длинну окружности поделить на угол между соседними точками на окружности, расположенной на экваторе
					const circleAnglesCount = round(//найти ближайшее целое число
							cos(latitude) * //радиус текущей окружности
							2 * π / //длинна текущей окружности
							angleStep
						),
						angleStep1 = 1 / circleAnglesCount,
						boSouthernCircle = latitude - angleStep < anglesRange.latitude.min,
						boNorthernCircle = latitude + angleStep > anglesRange.latitude.max,
						latitudeMin = boSouthernCircle ? latitude : (angleStep * (0 - 0.5) + latitude),//Минимальная граница широты окружности
						latitudeMax = boNorthernCircle ? latitude : (angleStep * (1 - 0.5) + latitude),//Максимальная граница широты окружности
						latitudeStep = latitudeMax - latitudeMin,//Ширина широты окружности
						latitudeMid = latitudeMin + latitudeStep / 2;//Средняя широта окружности
					//console.log('latitude = ' + latitude + ', latitudePrev = ' + latitudePrev + ', circleAnglesCount = ' + circleAnglesCount);
					latitudePrev = latitude; 
					//console.log('boFirstOrLastCircle = ' + (boSouthernCircle || boNorthernCircle) + ', latitude = ' + latitude + ', latitudeMin = ' + latitudeMin + ', latitudeMax = ' + latitudeMax);
					
					for (let angleId = 0; angleId < circleAnglesCount; angleId++) {

						const randomVerticeAngles = [

							//latitude
							params.debug && params.debug.notRandomVertices ?
							
								latitude : //окружность расположна на одной широте

								//окружность расположна на случайной широте в диапазоне от latitude до latitude - angleStep. Нужно, что бы окружность случайных точек немного гуляла по широте от latitude до latitude - angleStep. Тогда поверхность сферы будет случайно заполнена точками.
								//Если это не делать то случайные точки будут располагаться слоями по широте.
								latitudeStep * (random() - 0.5) + latitudeMid,

							//longitude
							utils.normalizeAngle(
								(
									(
										params.debug && params.debug.notRandomVertices ?

											//Положение текущей точки зависит от порядкового номера точки angleId
											(circleAnglesCount === 0 ?
												 0 ://Эта точка расположена на полюсе
												 angleStep1 * angleId) :
										
											random()//случайное положение текущей точки
									) - 0.5//отнимаем 0.5 что бы диапазон возможных точек был между -0.5 и 0.5. Сразу такой диапазон нельзя вычислять потому что Math.random() имеет диапазон от 0 до 1
								) * π * 2//диапазон возможных углов от -0.5 до 0.5 мняем на диапазон от -π до π
							)
						];
						//console.log('randomVerticeAngles = ' + randomVerticeAngles.toString())
						this.verticesAngles.push(randomVerticeAngles);
			
					}
					
				}
				delete params.random;
				delete params.b;
*/				
				return this.verticesAngles;
				
			},
			
			set: (anglesNew) => { verticesAngles = anglesNew; },
			
		});
		
		/////////////////////////////overridden methods

		this.randomAngles;
		
	}

}
export default RandomCloudSphere;
