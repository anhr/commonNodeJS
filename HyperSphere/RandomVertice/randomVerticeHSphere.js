/**
 * @module RandomVerticeHSphere
 * @description Generates a random vertice near the opposite vertice in 3D hypersphere.
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
import { anglesIdMax } from './randomVerticeSphere.js';
import anglesRange from '../anglesRange.js'
import * as utils from '../utilsHSphere.js'
import RandomCloudSphere from './randomCloudSphere.js';
//import Vertice from '../VerticeHypersphere.js'

const sRandomVerticesHyperSphere = 'RandomVerticesHyperSphere',
	π = Math.PI, abs = Math.abs, round = Math.round, random = Math.random,
//	sin = Math.sin, cos = Math.cos, asin = Math.asin, atan2 = Math.atan2,
	atan = Math.atan;

/**
 * Generates a random vertice near the opposite vertice in 3D hypersphere.
 * @class
 * @extends RandomVertice
 */
class RandomVerticeHSphere extends RandomVertice {

	/**
	 * Generates a random vertice near the opposite vertice in 3D hypersphere.
	 * @param {object} [params={}] See the <b>params</b> of the <a href="./module-RandomVertice-RandomVertice.html" target="_blank"><b>RandomVertice</b></a> constructor for details.
	 * @param {object} [boCloud=false] true - generates a random vertice cloud.
	 * @param {boolean} [boInitRandomAngles=true] true - init random angles.
	 */
	constructor(params, boCloud = false, boInitRandomAngles = true) {

		super(params);

		const arraySpheres = boCloud ? undefined : [],//Массив с параметрами сфер, из которых состоит гиперсфера. Создается когда нужно облако случайных или неслучайных средних точек.
			arrayCloudSpheres = arraySpheres ? undefined : [];//Массив сфер RandomCloudSphere, из которых состоит гиперсфера.
			
		if (!params.boArcIsdefined) {

			params.boArcIsdefined = true;
			let arc = params.arc;
			Object.defineProperty(params, 'arc', {
	
				get: () => {

					if (params.boAllocateMemory) return π;//Выделяется память для облака точек. arc нужно сделать максимально возможным то есть вершины расположены друг против друга. В этом случае выделяется максимальный объем памяти.
					let centralAngle;
					if (arc === undefined) {
						
						const vertice = params.vertice, oppositeVertice = params.oppositeVertice;
	
						/*
						gemini.google.com
						Вычислить центральный угол между двумя точками на поверхности 3-мерной гиперсферы. Координаты точек заданы в полярной системе координат в радианах.
						Начало координат широты находится на экваторе. Писать все формулы в одну строку.
	
						Обозначим координаты двух точек на поверхности 3-мерной гиперсферы радиуса R в полярной системе координат:
						Точка 1: (ψ1,θ1,ϕ1), где ψ1 - гиперширота, θ1 - гипердолгота, ϕ1 - обычная долгота.
						Точка 2: (ψ2,θ2,ϕ2).
						Начало координат широты находится на экваторе.
						Для 3-мерной гиперсферы (вложенной в 4-мерное евклидово пространство) координаты (x,y,z,w) в декартовой системе координат можно выразить через полярные координаты:
						x=Rcosψcosθcosϕ
						y=Rcosψcosθsinϕ
						z=Rcosψsinθ
						w=Rsinψ
						Центральный угол Δω между двумя точками на поверхности гиперсферы может быть найден с помощью скалярного произведения векторов, направленных из центра гиперсферы к этим точкам.
						Эти векторы имеют длину R.
						v1 =(x1,y1,z1,w1)
						v2 =(x2,y2,z2,w2)
						v1 ⋅ v2 =∣v1∣∣v2∣cos(Δω)=R*R cos(Δω)
						cos(Δω)= (v1 ⋅ 2)/(R * R) =(x1 x2+y1y2+z1 z2+w1 w2)/(R * R)
						Подставляя выражения для декартовых координат через полярные:
						cos(Δω)=cosψ1 cosψ2 cosθ1 cosθ2 cosϕ1 cosϕ2 +cosψ1 cosψ2 cosθ1 cosθ2 sinϕ1 sinϕ2 +cosψ1 cosψ2 sinθ1 sinθ2 +sinψ1 sinψ2
						Сгруппируем слагаемые:
						cos(Δω)=cosψ1 cosψ2 cosθ1 cosθ2 (cosϕ1 cosϕ2 +sinϕ1 sinϕ2)+cosψ1 cosψ2 sinθ1 sinθ2 +sinψ1 sinψ2
						Используя тригонометрические тождества cos(A−B)=cosAcosB+sinAsinB:
						cos(Δω)=cosψ1 cosψ2 cosθ1 cosθ2 cos(ϕ1−ϕ2)+cosψ1 cosψ2 sinθ1 sinθ2+sinψ1 sinψ2
						Сгруппируем первые два слагаемых:
						cos(Δω)=cosψ1 cosψ2 (cosθ1 cosθ2 cos(ϕ1 −ϕ2)+sinθ1 sinθ2)+sinψ1 sinψ2
						Это выражение не очень удобное. Перегруппируем по-другому:
						cos(Δω)=cosψ1 cosψ2 (cosθ1 cosθ2 cos(ϕ1 −ϕ2)+sinθ1 sinθ2)+sinψ1 sinψ2 cos(Δω)=(cosψ1 cosθ1 cosϕ1)(cosψ2 cosθ2 cosϕ2)+(cosψ1 cosθ1 sinϕ1)(cosψ2 cosθ2 sinϕ2)+(cosψ1 sinθ1)(cosψ2 sinθ2)+(sinψ1)(sinψ2)
						Используем cos(A−B)=cosAcosB+sinAsinB:
						cos(Δω)=cosψ1 cosψ2 cosθ1 cosθ2 cos(ϕ1 −ϕ2)+cosψ1 cosψ2 sinθ1 sinθ2+sinψ1 sinψ2
						cos(Δω)=cosψ1 cosψ2(cosθ1 cosθ2 cos(ϕ1 −ϕ2)+sinθ1 sinθ2)+sinψ1 sinψ2
						cos(Δω)=cosψ1 cosψ2 cos(Δθ)+sinψ1 sinψ2 ,
						где
						cos(Δθ)=cosθ1 cosθ2 cos(ϕ1 −ϕ2)+sinθ1 sinθ2.
						cos(Δθ)=cosθ1 cosθ2 cos(ϕ1 −ϕ2)+sinθ1 sinθ2 =cosθ1 cosθ2 cos(Δϕ)+sinθ1 sinθ2.
						cos(Δω)=cosψ1 cosψ2 cosθ1 cosθ2 cos(ϕ1 −ϕ2)+cosψ1 cosψ2 sinθ1 sinθ2 +sinψ1 sinψ2.
						cos(Δω)=cosψ1 cosψ2 (cosθ1 cosθ2 cos(ϕ1 −ϕ2)+sinθ1 sinθ2)+sinψ1 sinψ2.
						cos(Δω)=cosψ1 cosψ2 cos(θ1−2)+sinψ1 sinψ2,
						где
						cos(θ1−2)=cosθ1 cosθ2 cos(ϕ1 −ϕ2)+sinθ1 sinθ2.
						Используем формулу cos(A−B)=cosAcosB+sinAsinB:
						cos(Δω)=cosψ1 cosψ2 cosθ1 cosθ2 cos(ϕ1 −ϕ2)+cosψ1 cosψ2 sinθ1 sinθ2 +sinψ1 sinψ2.
						Используем формулу cos(α1)cos(α2)+sin(α1)sin(α2)=cos(α1−α2).
						cos(Δω)=cosψ1 cosψ2 (cosθ1 cosθ2 cos(ϕ1 −ϕ2)+sinθ1 sinθ2)+sinψ1 sinψ2.
						cos(Δω)=cosψ1 cosψ2 cos(θ1 −θ2)+sinψ1 sinψ2.
						Это неверно, т.к. ϕ тоже участвует.
						Правильная формула:
						cos(Δω)=sinψ1 sinψ2 +cosψ1 cosψ2 sinθ1 sinθ2 +cosψ1 cosψ2 cosθ1 cosθ2 cos(ϕ1 −ϕ2).
						cos(Δω)=sinψ1 sinψ2 +cosψ1 cosψ2 (sinθ1 sinθ2+cosθ1 cosθ2 cos(ϕ1 −ϕ2)).
						cos(Δω)=sinψ1 sinψ2 +cosψ1 cosψ2 cos(θ1 −θ2),
						где
						cos(θ1 −θ2) это не то, что нужно.
						Центральный угол Δω между двумя точками на поверхности 3-мерной гиперсферы с координатами (ψ1,θ1,ϕ) и (ψ2,θ2,ϕ2) равен arccos(sinψ1 sinψ2+cosψ1 cosψ2 cos(θ1 −θ2))
						если ϕ не участвует, но она есть.
						cos(Δω)=sinψ1 sinψ2 +cosψ1 cosψ2 cos(θ1 −θ2) - это формула для 2-сферы (вложенной в 3-мерное пространство).
						На 3-мерной гиперсфере (в 4-мерном пространстве) центральный угол можно вычислить по формуле:
						cos(Δω)=sinψ1 sinψ2 +cosψ1 cosψ2 sinθ1 sinθ2 +cosψ1 cosψ2 cosθ1 cosθ2 cos(ϕ1 −ϕ2).
						Эту формулу можно упростить, сгруппировав слагаемые.
						cos(Δω)=sinψ1 sinψ2 +cosψ1 cosψ2(sinθ1 sinθ2 +cosθ1 cosθ2 cos(ϕ1 −ϕ2)).
						cos(Δω)=sinψ1 sinψ2 +cosψ1 cosψ2(cosθ1 cosθ2 cos(ϕ1 −ϕ2)+sinθ1 sinθ2).
						cos(Δω)=sinψ1 sinψ2 +cosψ1 cosψ2 cos(γ),
						где
						cos(γ)=cosθ1 cosθ2 cos(ϕ1 −ϕ2)+sinθ1 sinθ2.
						cos(γ)=cosθ1 cosθ2 cosΔϕ+sinθ1 sinθ2.
						Тогда:
						Δω=arccos(sinψ1 sinψ2 +cosψ1 cosψ2 (cosθ1 cosθ2 cos(ϕ1 −ϕ2)+sinθ1 sinθ2)).					
						
						*/
						/**
						 * Вычисляет центральный угол между двумя точками на поверхности 3-мерной гиперсферы.
						 * Координаты заданы в радианах.
						 * @param {object} point1 - Первая точка с координатами.
						 * @param {number} point1.latitude - Широта (зенитный угол).
						 * @param {number} point1.longitude - Долгота (азимутальный угол).
						 * @param {number} point1.altitude - Полярный угол от оси W.
						 * @param {object} point2 - Вторая точка с координатами.
						 * @param {number} point2.latitude - Широта (зенитный угол).
						 * @param {number} point2.longitude - Долгота (азимутальный угол).
						 * @param {number} point2.altitude - Полярный угол от оси W.
						 * @returns {number} Центральный угол в радианах.
						 */
						/*
						function toRadians(degrees) {
						  return degrees * Math.PI / 180;
						}
						*/
						/*https://gemini.google.com/
						Вычислить центральный угол между двумя точками на поверхности 3-мерной гиперсферы встроенной в 4-мерное евклидово пространство.
						Координаты точек заданы в полярной системе координат в радианах. Положение точек обозначим как
						point.latitude - широта (зенитный угол) в диапазоне от -π/2 до π/2,
						point.longitude - долгота (азимутальный угол)  в диапазоне от -π до π,
						point.altitude - полярный угол от оси W  в диапазоне от 0 до π.
						Писать все формулы в одну строку.
						*/
						const calculateCentralAngle = (point1, point2) => {
	
							let {
	
								latitude: lat1,
								longitude: lon1,
								altitude: alt1
	
							} = point1;
							lat1 += π / 2;
							let {
	
								latitude: lat2,
								longitude: lon2,
								altitude: alt2
	
							} = point2;
							lat2 += π / 2;
						
							// Convert degrees to radians if necessary
							// Assuming input is already in radians based on the prompt
							// const lat1Rad = toRadians(lat1);
							// const lon1Rad = toRadians(lon1);
							// const alt1Rad = toRadians(alt1);
							// const lat2Rad = toRadians(lat2);
							// const lon2Rad = toRadians(lon2);
							// const alt2Rad = toRadians(alt2);
						
							const cosDeltaLambda = Math.cos(lat1) * Math.cos(lat2) + Math.sin(lat1) * Math.sin(lat2) * Math.cos(lon1 - lon2);
						
							const cosTheta = Math.cos(alt1) * Math.cos(alt2) + Math.sin(alt1) * Math.sin(alt2) * cosDeltaLambda;
						
							// Ensure the value is within the valid range for acos to avoid NaN errors
							const clampedCosTheta = Math.max(-1, Math.min(1, cosTheta));
						
							// The central angle in radians
							const centralAngle = Math.acos(clampedCosTheta);
						
							return centralAngle;
	
						}
						/*
						// Example usage with points in radians
						const point1 = {
						  latitude: 0,
						  longitude: 0,
						  altitude: 0
						};
						const point2 = {
						  latitude: Math.PI / 2,
						  longitude: Math.PI / 2,
						  altitude: Math.PI / 2
						};
						
						const angle = calculateCentralAngle(point1, point2);
						console.log(`Центральный угол между точками в радианах: ${angle}`);
						console.log(`Центральный угол между точками в градусах: ${angle * 180 / Math.PI}`);
						*/
						
						centralAngle = calculateCentralAngle(vertice, oppositeVertice);
	
						/*
						if (params.debug) {
	
							//DeepSeek
							function hyperSphereCentralAngle(alt1, lat1, lon1, alt2, lat2, lon2) {
							    return Math.acos(Math.cos(alt1)*Math.cos(alt2)*Math.cos(lat1)*Math.cos(lat2)*Math.cos(lon1 - lon2) + 
							                    Math.cos(alt1)*Math.cos(alt2)*Math.sin(lat1)*Math.sin(lat2) + 
							                    Math.sin(alt1)*Math.sin(alt2));
							}
							
							// Тестовый пример
							const lat1 = vertice.latitude, long1 = vertice.longitude, alt1 = vertice.altitude;
							const lat2 = oppositeVertice.latitude, long2 = oppositeVertice.longitude, alt2 = oppositeVertice.altitude;
							const angle = hyperSphereCentralAngle(lat1, long1, alt1, lat2, long2, alt2);
							if (angle != centralAngle) console.error(sRandomVerticesHyperSphere + ': get params.arc. centralAngle = ' + centralAngle + ' != angle = ' + angle);
	
						}
						*/
	
					} else centralAngle = arc;
					return this.arc(centralAngle);
				
				},
				set: (arcNew) => {
		
					if (arc === undefined) console.error(sRandomVerticesHyperSphere + ': set params.arc. Invalid arc = ' + arc);
					else arc = arcNew;
					return true;
		
				},
		
			});

		}
		
		this.altitude = (utils) => {

			const rnd = (params.random === undefined ? random() : params.random),//rng range from 0 to 1
				b = params.b ? params.b : utils.b(params),
				angle = (
						(
							(atan((
										(rnd === 0) &&//Первая точка сферы
										(b === Infinity) ? //Противоположные вершины совпадают
											1 ://Если сюда не поставить 1, то angle = NaN
											rnd
								   ) * b)) /
							atan(b)//делим на tan(b), что бы при минимальном rnd = 0 и максимальном rnd = 1, p получалось -1 и 1
						) * 2 - 1//центр графика арктангенса сдвигаю вниз на -1
					) * π / 2 + π / 2//Умножаем на π/2 и плюс π / 2 что бы при минимальном rnd = 0 и максимальном rnd = 1  углы попадали на полюса гиперсферы т.е. радиус сферы равен 0 и высота получались от 0 до π.
							//Тем самым точки почти равномерно распределяются по сфере когда arc = π, тоесть вершина и противоположная вершина расположены на противоположных сторонах гиперсферы
			
			if (isNaN(angle)) console.error(sRandomVerticesHyperSphere + '.anglesCircle: angle = ' + angle);
			return angle;
			
		}

		const spheresCount = round(//найти ближайшее целое число
			(anglesIdMax / 2) + 1),//количество окружностей
			k = spheresCount === 1 ? 1 : 1 / (spheresCount - 1),//for params.random = k * circleId;
			createCloudSphere = (altitude) => {

				params.verticesAngles.boNoNew = true;
				params.altitude = altitude;
				const cloudSphere = params.CloudSphere ? new params.CloudSphere(params) : new RandomCloudSphere(params, params.boCloud);
				if (arrayCloudSpheres) {

					//Создается облако случайных или неслучайных средних точек

					arrayCloudSpheres.push(cloudSphere);

					params.speresPointsCount ||= [];//массив индексов первых точек сфер, из которых состоит гиперсфера. Нужен для выделения одной из сфер и скрытия остальных сфер, когда пользователь вручную выбрал сферу
					//Не создается, когда нужна одна случайная средняя точка.

					params.speresPointsCount.push(params.pointsCount);

				}
				delete params.altitude;
				delete params.verticesAngles.boNoNew;
				return cloudSphere;

			},
			getRandomVerticeAnglesParams = (altitude, angleStep) => {

				params.hyperSphere = {

					//Облако гиперсферы случайных точек состоит из массива сфер на разной высоте.
					//Сначала содается сфера на высоте противоположной вершины params.oppositeVertice.altitude.
					//Затем сверху и снизу от этой сферы создаются остальные сферы.
					//Высота каждой сферы равна params.oppositeVertice.altitude плюс/минус aLatitude[i]. Где i - индекс сферы
					middleSphere: {//Параметры сферы на высоте противоположной вершины params.oppositeVertice.altitude.

						aLatitude: [],//массив широт окружностей, из которых состоит средняя сфера middleSphere в диапазне от -π/2 до π/2

					},
					
					vertice: (point) => { return utils.angles([...point], params.altitude); },
					verticesAngles: this.verticesAngles,

				}
				const cloudSphere = createCloudSphere(altitude);
/*
				params.verticesAngles.boNoNew = true;
				params.altitude = altitude;
				const cloudSphere = params.CloudSphere ? new params.CloudSphere(params) : new RandomCloudSphere(params, params.boCloud);
				if (arrayCloudSpheres) {

					//Создается облако случайных или неслучайных средних точек
					
					arrayCloudSpheres.push(cloudSphere);

					params.speresPointsCount ||= [];//массив индексов первых точек сфер, из которых состоит гиперсфера. Нужен для выделения одной из сфер и скрытия остальных сфер, когда пользователь вручную выбрал сферу
													//Не создается, когда нужна одна случайная средняя точка.

					params.speresPointsCount.push(params.pointsCount);

				}
				delete params.altitude;
				delete params.verticesAngles.boNoNew;
*/
				//Количество точек на текущей сфере равно сумме количества точек на каждой окружности, находящейся на сфере
				let sphereAnglesCount = cloudSphere.sphereAnglesCount;
				const angleStep1 = 1 / sphereAnglesCount,
					boSouthernSphere = altitude - angleStep < anglesRange.altitude.min,
					boNorthernSphere = altitude + angleStep > anglesRange.altitude.max,
					altitudeMin = boSouthernSphere ? altitude : (angleStep * (0 - 0.5) + altitude),//Минимальная граница высоты сферы
					altitudeMax = boNorthernSphere ? altitude : (angleStep * (1 - 0.5) + altitude),//Максимальная граница высоты сферы
					altitudeStep = altitudeMax - altitudeMin,//Ширина высоты сферы
					altitudeMid = altitudeMin + altitudeStep / 2;//Средняя высота сферы
				if (
					(sphereAnglesCount === 0) ||//добавить по одной точке на полюсах
					(
						!params.boAllocateMemory &&
						(
							!arraySpheres && 
							(sphereAnglesCount > params.verticesAngles.length)
						) || (
							arraySpheres &&//Вычисляется одна случайная точка. Т.е. randomVerticeSettings.mode = randomVerticeSettings.modes.randomVertice = 1
							(sphereAnglesCount === Infinity)
						)
					)
				)
					sphereAnglesCount = 1;//когда длинна дуги приближается к нулю, тоесть вершины совпадают, то angleStep стремится к нулю и sphereAnglesCount стремится к бесконечности и массив this.verticesAngles переполняется.
											//или когда сфера находится на полюсе т.е. sphereAnglesCount === 0
											//Делаем один угол на сфере
				return { angleStep1, altitudeMin, altitudeMax, altitudeStep, altitudeMid, boSouthernSphere, boNorthernSphere, sphereAnglesCount, cloudSphere };

			},
			verticesAngles = (boAllocateMemory) => {

				//Гиперсфера случайных точек состоит из набора сфер.
				
//				const arc = params.arc;
				this.circlesPointsCount = boAllocateMemory ? undefined : //Во время выделения памяти в массив params.verticesAngles добавляется новый item
					0;//в противном случае в массиве params.verticesAngles редактируется item с индексом this.circlesPointsCount
				let altitudePrev = 0;//высота предыдущей сферы
				if (params.noCreateCloudSphere) {

					//обновляется гиперсфера после изменения положения вершин
					
					params.pointsCount = 0;
					params.speresPointsCount.length = 0;

				}
				const sphereId = Math.round(spheresCount / 2);
				params.random = k * sphereId;

//				const altitude = this.altitude(utils),
				const altitude = params.oppositeVertice.altitude,
					angleStep = abs(altitude - altitudePrev),//угол между соседними точками на сфере
					randomVerticeAnglesParams = params.noCreateCloudSphere ? undefined : getRandomVerticeAnglesParams(altitude, angleStep);
				if (arraySpheres && !boAllocateMemory) {

					const sphereAnglesCount = randomVerticeAnglesParams.sphereAnglesCount;
					arraySpheres.push({ altitude, angleStep, altitudeStep: randomVerticeAnglesParams.altitudeStep, altitudeMid: randomVerticeAnglesParams.altitudeMid, sphereAnglesCount, cloudSphere: randomVerticeAnglesParams.cloudSphere, });
					this.circlesPointsCount += sphereAnglesCount;
					altitudePrev = altitude; 

				}
				else if (!randomVerticeAnglesParams) {

					//обновляется гиперсфера после изменения положения вершин
					
					params.altitude = altitude;
//					arrayCloudSpheres[sphereId].randomAngles;
arrayCloudSpheres[0].randomAngles;
					delete params.altitude;
					
					params.speresPointsCount.push(params.pointsCount);
					
				}

				const aLatitude = params.hyperSphere.middleSphere.aLatitude,
					middleCirclesCount = aLatitude.length;//Количество окружностей в сфере, которая находится на высоте противоположной точки.
				
				//Присоздании облака случайных точек гиперсферы широту каждой окружности текущей сферы надо умножить на некоторый коэфициент что бы облако случайных точек приоблело сферическую форму
				params.circleLatitudeMultiplier = (circlesCount) => {

					//График множителя к широте текущей окружности сферы имеет форму окружности.
					//где по иси x отложено количество окружностей в текущей сфере circlesCount
					//а по оси y - множитель к широте текущей окружности сферы
					//Центр этой окружности лежит посередине между минимальным и максимальны количеством окружностей в текущей сфере.
					//Когда количество окружностей в текущей сфере circlesCount минимально или максимально, то множитель к широте текущей окружности должен быть равен 1. Тоесть широта не должна изменяться
					//Во всех остальных случая множитель к широте текущей окружности должен быть больше 1. Тоесть широта должна увеличиваться.
/*					
					const iMin = 2, ccMin = aLatitude[iMin],//минимальное количество окружностей на сфере. Если сделать меньше то выдаст ошибку
						ccMax = aLatitude[middleCirclesCount - 1],//Максимальное количество окружностей на сфере.
						r = (ccMax - ccMin) / 2,//Радиус окружности по которой вычисляется множитель к широте текущей окружности сферы
//						x = aLatitude[middleCirclesCount - circlesCount + iMin - 1] - r - ccMin;
						x = aLatitude[circlesCount] - r - ccMin;
					let y = Math.sqrt( r * r - x * x);
					if (isNaN(y)) y = 0;//Приходится делать эту проверку из за погрешности вычислений
					y *= 10;
*/					
//						y = Math.sqrt( r * r - (aLatitude[circlesCount] - r - ccMin) ** 2) / r;//поделить на радиус окружности, что бы множитель не был слишком большим
/*						
					const ccMin = 2,//минимальное количество окружностей на сфере. Если сделать меньше то выдаст ошибку
						ccMax = middleCirclesCount - 1,//Максимальное количество окружностей на сфере.
						r = (ccMax - ccMin) / 2,//Радиус окружности по которой вычисляется множитель к широте текущей окружности сферы
						y = Math.sqrt( r * r - (circlesCount - r - ccMin) ** 2) / r;//поделить на радиус окружности, что бы множитель не был слишком большим
*/
/*
const array = [
	0,//0
	0,//1
	0,//2
	0,//3
	0,//4
	0,//5
	0,//6
	0,//7
	0,//8
	0,//9
	0,//10
	0,//11
	0,//12
	0,//13
	0,//14
	0,//15
	0,//16
	0,//17
	0,//18
	0,//19
	0,//20
	0,//21
	0,//22
	0,//23
	0,//24
	0,//25
];
*/
/*					
for (let i = 0; i < array.length; i++){

	if ((i > 0) && (i < 6)) array[i] = (0.2 / 5) * i;
	if ((i > 5) && (i < 19)) {

		const a = (5 - 0.2) / 13, b = 0.2 - a * 6;
		array[i] = a * i + b;

	}
		
}
*/
const array = [];
//for (let i = 0; i < params.hyperSphere.middleSphere.aLatitude.length; i++) array.push(0);
const line = (options = {}) => {

	const start = options.start || { i: 0, y: 0}, stop = options.stop || { i: params.hyperSphere.middleSphere.aLatitude.length - 3, y: 0},
		a = (stop.y - start.y)/(stop.i - start.i), b = start.y - start.i * a;
	for (let i = start.i; i < stop.i; i++) array.push(a * i + b);
	
}
let point1 = { i: 5, y: 0.3 };
line({ stop: point1 });
let point2 = { i: 14, y: 1 };
line({ start: point1, stop: point2 });
point1 = point2;
point2 = { i: 20, y: 5 };
line({ start: point1, stop: point2 });
line({ start: point2 });
array.push(0);
const circleId = middleCirclesCount - circlesCount - 1;
const y = array[circleId];
console.log('circleId = ' + circleId + ' , y = ' + y)
					return 1 + y;
					
				};
				
				params.hyperSphere.middleSphere.boNoAddALatitude = true;//Не добавлять новую широту в params.hyperSphere.middleSphere.aLatitude потому что они будут дублироваться с первой сферой
				
				for (let latitudeId = middleCirclesCount - 2;
					 latitudeId > 0;//если latitudeId === 0 то в сфере будет всего одна окружность. В этом случае невозможно вычислить latitude, на которой расположена эта окружность.
//latitudeId >= params.hyperSphere.middleSphere.aLatitude.length - 2;
					 latitudeId--){

					//Количество окружностей в текущей сфере равно количесту окружностей на средей сфере params.hyperSphere.middleSphere.aLatitude.length минус индекс текущей сферы
					//Таким образом последняя сфера будет иметь одну окружность
					params.circlesCount = latitudeId + 1;
					
					createCloudSphere(params.oppositeVertice.altitude + params.hyperSphere.middleSphere.aLatitude[latitudeId] - π / 2);
					
				}
				delete params.circlesCount;
				delete params.circleLatitudeMultiplier;
				delete params.random;
				delete params.b;
				
			};

		if (!arraySpheres) {//не выделять this.verticesAngles если нужно вычислить одну случайную точку randomVerticeSettings.mode = randomVerticeSettings.modes.randomVertice = 1
			
			//Allocate this.verticesAngles memory
/*			
			params.boAllocateMemory = true;
			verticesAngles(params.boAllocateMemory);
			delete params.boAllocateMemory;
*/			
			verticesAngles(true);

		}
		
		let randomAngles;

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

				if (arraySpheres) arraySpheres.length = 0;
				verticesAngles(false);
				const randomVerticeId = round(random() * (this.circlesPointsCount - 1))

				if (arraySpheres) {
					
					let verticeId = 0, verticeIdPrev;
					for (let sphereId = 0; sphereId < arraySpheres.length; sphereId++) {
	
						const sphere = arraySpheres[sphereId];
						verticeIdPrev = verticeId;
						verticeId += sphere.sphereAnglesCount;
						if (verticeId >= randomVerticeId) {
	
							//случайная вершина находится на текущей сфере.

							params.altitude = sphere.altitude;
							sphere.cloudSphere.getRandomAngle(randomVerticeId - verticeIdPrev);
							delete params.altitude;
							return params.verticesAngles;
							
						}
	
					}
					console.error(sRandomVerticesHyperSphere + ': get randomAngles. rotated was not found.');

				} else {
					
					this.angles = params.verticesAngles;
					return this.angles;

				}
				
			},
			set: (anglesNew) => {},
			
		});
*/		
		this.getRandomAngles = () => {
			
			if (arraySpheres) arraySpheres.length = 0;
			verticesAngles(false);
			const randomVerticeId = round(random() * (this.circlesPointsCount - 1))

			if (arraySpheres) {
				
				let verticeId = 0, verticeIdPrev;
				for (let sphereId = 0; sphereId < arraySpheres.length; sphereId++) {

					const sphere = arraySpheres[sphereId];
					verticeIdPrev = verticeId;
					verticeId += sphere.sphereAnglesCount;
					if (verticeId >= randomVerticeId) {

						//случайная вершина находится на текущей сфере.

						params.altitude = sphere.altitude;
						sphere.cloudSphere.getRandomAngle(randomVerticeId - verticeIdPrev);
						delete params.altitude;
						return params.verticesAngles;
						
					}

				}
				console.error(sRandomVerticesHyperSphere + ': get randomAngles. rotated was not found.');

			} else {
				
				this.angles = params.verticesAngles;
				return this.angles;

			}
			
		}
		
		Object.defineProperty(this, 'cloud', {
			
			get: () => {

				verticesAngles(false);
				return this.verticesAngles;
				
			},
			
		});
		
		/////////////////////////////overridden methods

		if (arraySpheres) {
			
			//Когда создается облако случайных точек randomVerticeSettings.mode = randomVerticeSettings.modes.randomCloud = 2, то boInitRandomAngles = false и не нужно инициализировать случайные точки для экономии времени.
			//Если создается одна случайная точка randomVerticeSettings.mode = randomVerticeSettings.modes.randomVertice = 1, то boInitRandomAngles = true и нужно инициализировать случайные точки.
			//Иначе при изменении положения вершины или противоположной вершины почему то появляется несколько случайных точек.
			if (boInitRandomAngles) {

				params.pointsCount = 0;
				this.randomAngles;//Вычислить случайную точку если нужна одна случайная точка т.е. randomVerticeSettings.mode = randomVerticeSettings.modes.randomVertice = 1 или randomVerticeSettings.mode = randomVerticeSettings.modes.randomCloud = 2
				params.editAnglesId = 0;

			}
			
		}

	}
	
	//overridden methods
	
	ZeroArray() { return [0, 0, 0]; }
	Center(params) {
	
		utils.angles(params.vertice);
		utils.angles(params.oppositeVertice);
		
	}
	
	/////////////////////////////overridden methods

}
const VerticeObjectToArray = (verticeObject) => { return utils.angles([verticeObject.altitude, verticeObject.latitude, verticeObject.longitude]); }
/*
const Vertice = (vertice, altitude) => {

//	if (vertice.longitude != undefined) return;
	while (vertice.length < 3)
		vertice.unshift((vertice.length === 2) && (altitude != undefined) ? altitude : 0);
	if (vertice.longitude === undefined)
		Object.defineProperty(vertice, 'longitude', {
			
			get: () => { return vertice[2]; },
			set: (longitude) => {
	
				if (vertice[2] === longitude) return true;
				vertice[2] = longitude;
				return true;
	
			},
		
		});
	if (vertice.latitude === undefined)
		Object.defineProperty(vertice, 'latitude', {
			
			get: () => { return vertice[1]; },
			set: (latitude) => {
	
				if (vertice[1] === latitude) return true;
				vertice[1] = latitude;
				return true;
	
			},
		
		});
	if (vertice.altitude === undefined)
		Object.defineProperty(vertice, 'altitude', {
			
			get: () => { return vertice[0]; },
			set: (altitude) => {
	
				if (vertice[0] === altitude) return true;
				vertice[0] = altitude;
				return true;
	
			},
		
		});
	return vertice;

}
*/
//RandomVerticeHSphere.Vertice = Vertice;
export default RandomVerticeHSphere;
