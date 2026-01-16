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
/*
const array = [
	0.04,//1
	0.09,//2
	0.14,//3
	0.19,//4
	0.25,//5
	0.33,//6
	0.4,//7
	0.47,//8
	0.57,//9
	0.7,//10
	0.81,//11
	0.95,//12
	1.14,//13
	1.32,//14
	1.56,//15
	1.85,//16
	2.2,//17
	2.6,//18
	3.1,//19
	3.85,//20
	5,//21
	7,//22
	10,//23
	0,//24 последняя сфера. Состоит из одной точки. Этот множитель не влияет на ее положение
	0,//25
];
*/
/*
Есть массив с результатами измерений на языке javascript:
const array = [
	0.04,//1
	0.09,//2
	0.14,//3
	0.19,//4
	0.25,//5
	0.33,//6
	0.4,//7
	0.47,//8
	0.57,//9
	0.7,//10
	0.81,//11
	0.95,//12
	1.14,//13
	1.32,//14
	1.56,//15
	1.85,//16
	2.2,//17
	2.6,//18
	3.1,//19
	3.85,//20
	5,//21
	7,//22
	10,//23
];
Измерения были получены с небольшой случайной ошибкой из за которой кривая зависимости измерений от индекса текущего измерения в массиве array имеет случайное отклонение.
Нужно скорректировать эти измерения так, что бы кривая была более гладкой. При этом не нужно менять значение первого и последнего измерения. Показать новый массив array со сглаженными данными.
*/
//Сглаживание по методу https://chat.deepseek.com/a/chat/s/a8c614ed-b75e-4547-bf3d-d9c7a30dc025					
/*					
const array = [
   0.040, 0.093, 0.148, 0.205, 0.265,
   0.332, 0.401, 0.475, 0.561, 0.657,
   0.767, 0.899, 1.057, 1.242, 1.463,
   1.728, 2.046, 2.427, 2.894, 3.480,
   4.238, 5.243, 10.000, 0
]
*/
/*					
//1. α = 0.2 (сильное сглаживание)
const array = [
    0.0400, 0.0500, 0.0680, 0.0864, 0.1071,
    0.1367, 0.1653, 0.1963, 0.2340, 0.2792,
    0.3284, 0.3827, 0.4542, 0.5273, 0.6186,
    0.7289, 0.8631, 1.0175, 1.2140, 1.4612,
    1.7690, 2.4152, 10.0000, 0
]
*/
/*
//2. α = 0.3 (умеренное сглаживание, баланс)
const array = [
    0.0400, 0.0550, 0.0805, 0.1074, 0.1401,
    0.1831, 0.2222, 0.2665, 0.3216, 0.3871,
    0.4530, 0.5271, 0.6210, 0.7128, 0.8260,
    0.9642, 1.1389, 1.3412, 1.5879, 1.9085,
    2.3360, 3.1352, 10.0000, 0
]
*/
/*
//3. α = 0.4 (слабое сглаживание)
const array = [
    0.0400, 0.0600, 0.0920, 0.1232, 0.1619,
    0.2111, 0.2547, 0.3028, 0.3637, 0.4322,
    0.4957, 0.5674, 0.6625, 0.7465, 0.8527,
    0.9904, 1.1623, 1.3734, 1.6440, 2.0284,
    2.5770, 3.7462, 10.0000, 0
]
*/
/*
//4. α = 0.5 (очень слабое сглаживание)
const array = [
    0.0400, 0.0650, 0.1025, 0.1313, 0.1632,
    0.2032, 0.2416, 0.2823, 0.3317, 0.3860,
    0.4332, 0.4882, 0.5664, 0.6382, 0.7276,
    0.8389, 0.9757, 1.1409, 1.3560, 1.6893,
    2.2199, 3.4750, 10.0000, 0
]
*/
//https://gemini.google.com/app/bcf378e363b790b6
const array = [
	0.043,//0.04,//1
	0.09,//2
	0.14,//3
	0.195,//0.193,//4
	0.257,//5
	0.327,//6
	0.405,//0.4,//7
	0.49,//0.48,//8
	0.585,//0.58,//9
	0.693,//10
	0.82,//11
	0.967,//12
	1.137,//13
	1.34,//14
	1.577,//15
	1.87,//16
	2.217,//17
	2.633,//18
	3.183,//19
	3.983,//20
	5.283,//21
	7.333,//22
	10,//23
	0,//24
];
/* 
Имеется таблица:
circleId = 0 , y = 0.04
circleId = 1 , y = 0.09
circleId = 2 , y = 0.14
circleId = 3 , y = 0.19
circleId = 4 , y = 0.25
circleId = 5 , y = 0.33
circleId = 6 , y = 0.4
circleId = 7 , y = 0.47
circleId = 8 , y = 0.57
circleId = 9 , y = 0.7
circleId = 10 , y = 0.81
circleId = 11 , y = 0.95
circleId = 12 , y = 1.14
circleId = 13 , y = 1.32
circleId = 14 , y = 1.56
circleId = 15 , y = 1.85
circleId = 16 , y = 2.2
circleId = 17 , y = 2.6
circleId = 18 , y = 3.1
circleId = 19 , y = 3.85
circleId = 20 , y = 5
circleId = 21 , y = 7
circleId = 22 , y = 10
Найти элементарную функцияю y = F(circleId), которая наиболее точно воспроизводит эту таблицу.
Написать код на javascript для вычисления этой функции.
*/
					//https://chat.deepseek.com/a/chat/s/cf4977d1-3101-49c4-80de-e26ce5986d94
					//Выдает большую ошибку в конце диапазона
					/*
					function calculateY(circleId) {
					    // Функция: y = 0.028 * 1.2^circleId + 0.012
					    return 0.028 * Math.pow(1.2, circleId) + 0.012;
					}
					
					// Проверка для всех значений из таблицы
					function testFunction() {
					    const testData = [
					        {id: 0, y: 0.04},
					        {id: 1, y: 0.09},
					        {id: 2, y: 0.14},
					        {id: 3, y: 0.19},
					        {id: 4, y: 0.25},
					        {id: 5, y: 0.33},
					        {id: 6, y: 0.4},
					        {id: 7, y: 0.47},
					        {id: 8, y: 0.57},
					        {id: 9, y: 0.7},
					        {id: 10, y: 0.81},
					        {id: 11, y: 0.95},
					        {id: 12, y: 1.14},
					        {id: 13, y: 1.32},
					        {id: 14, y: 1.56},
					        {id: 15, y: 1.85},
					        {id: 16, y: 2.2},
					        {id: 17, y: 2.6},
					        {id: 18, y: 3.1},
					        {id: 19, y: 3.85},
					        {id: 20, y: 5},
					        {id: 21, y: 7},
					        {id: 22, y: 10}
					    ];
					
					    console.log("Проверка функции:");
					    console.log("circleId | Оригинал | Вычислено | Разница");
					    console.log("---------|----------|-----------|---------");
					
					    let totalError = 0;
					    
					    testData.forEach(item => {
					        const calculated = calculateY(item.id);
					        const difference = Math.abs(calculated - item.y);
					        totalError += difference;
					        
					        console.log(
					            item.id.toString().padStart(7) + " | " +
					            item.y.toFixed(2).padStart(8) + " | " +
					            calculated.toFixed(2).padStart(9) + " | " +
					            difference.toFixed(3).padStart(7)
					        );
					    });
					
					    console.log("\nСредняя абсолютная ошибка: " + (totalError / testData.length).toFixed(3));
					    console.log("Общая абсолютная ошибка: " + totalError.toFixed(3));
					}
					
					// Более точная версия с дополнительными параметрами
					function calculateYPrecise(circleId) {
					    // Функция: y = 0.026 * 1.22^circleId + 0.014
					    return 0.026 * Math.pow(1.22, circleId) + 0.014;
					}
					
					// Альтернативный вариант - полиномиальная аппроксимация
					function calculateYPolynomial(circleId) {
					    // Функция: y = 0.0002*x^3 + 0.007*x^2 + 0.028*x + 0.035
					    const x = circleId;
					    return 0.0002 * Math.pow(x, 3) + 0.007 * Math.pow(x, 2) + 0.028 * x + 0.035;
					}
					
					// Основная функция с выбором метода
					function F(circleId, method = 'precise') {
					    switch(method) {
					        case 'exponential':
					            return calculateY(circleId);
					        case 'precise':
					            return calculateYPrecise(circleId);
					        case 'polynomial':
					            return calculateYPolynomial(circleId);
					        default:
					            return calculateY(circleId);
					    }
					}
					
					// Пример использования
					console.log("Пример вычислений:");
					console.log("F(0) = " + F(0).toFixed(2)); // ≈ 0.04
					console.log("F(10) = " + F(10).toFixed(2)); // ≈ 0.81
					console.log("F(20) = " + F(20).toFixed(2)); // ≈ 5.00
					console.log("F(22) = " + F(22).toFixed(2)); // ≈ 10.00
					
					// Для тестирования раскомментируйте следующую строку:
					testFunction();
					*/
					//https://gemini.google.com/app/578961878f70ad71
					/**
					 * Вычисляет y с приоритетом точности на начальном отрезке (circleId 0-10)
					 * @param {number} circleId 
					 * @returns {number}
					 */
/*					
					function getCircleY(circleId) {
					    // Начальное значение (при circleId = 0)
					    const startValue = 0.04; 
					    // Коэффициент роста, подобранный под ваши данные
					    const growthRate = 0.252; 
					
					    const y = startValue * Math.exp(growthRate * circleId);
					
					    // Округление: для малых чисел до 2 знаков, для больших - до 1
					    return y < 1 ? Math.round(y * 100) / 100 : Math.round(y * 10) / 10;
					}
*/					

					/*
					// Проверка точности в начале:
					console.log('circleId = 0 y = ' + getCircleY(0));  // 0.04 (Точно)
					console.log('circleId = 1 y = ' + getCircleY(1));  // 0.05 (Близко к 0.09)
					console.log('circleId = 5 y = ' + getCircleY(5));  // 0.14 (Близко к 0.33)
					console.log('circleId = 22 y = ' + getCircleY(22)); // 10.3 (Близко к 10.0)
					*/
					/**
					 * Вычисляет y с помощью полинома 4-й степени.
					 * Этот метод значительно точнее в начале списка, чем простая экспонента.
					 */
/*					
					function calculateYPolynomial(x) {
					    // Коэффициенты полинома
					    const a = 0.000305;
					    const b = -0.00537;
					    const c = 0.0465;
					    const d = -0.048;
					    const e = 0.041; // Почти идеальное попадание в 0.04 при x=0
					
					    const y = (a * Math.pow(x, 4)) + 
					              (b * Math.pow(x, 3)) + 
					              (c * Math.pow(x, 2)) + 
					              (d * x) + 
					              e;
					
					    // Возвращаем с округлением до 2 знаков для малых и 1 знака для больших
					    return x < 10 ? Math.round(y * 100) / 100 : Math.round(y * 10) / 10;
					}
					
					// Демонстрация точности в начале:
					for (let i = 0; i <= 23; i++) {
					    console.log(`ID ${i}: Таблица = ?, Расчет = ${calculateYPolynomial(i)}`);
					}
*/
					/**
					 * Вычисляет y на основе circleId с высокой точностью на всем диапазоне.
					 * Используется аппроксимация полиномом 6-й степени.
					 */
					function calculateY(x) {
					    // Коэффициенты полинома
					    const c6 = 2.01633e-7;
					    const c5 = -1.02681e-5;
					    const c4 = 0.0002164;
					    const c3 = -0.001712;
					    const c2 = 0.01518;
					    const c1 = -0.01166;
					    const c0 = 0.0401; // Смещение для точности в начале (x=0)
					
					    const y = (c6 * Math.pow(x, 6)) +
					              (c5 * Math.pow(x, 5)) +
					              (c4 * Math.pow(x, 4)) +
					              (c3 * Math.pow(x, 3)) +
					              (c2 * Math.pow(x, 2)) +
					              (c1 * x) +
					              c0;
					
					    // Округляем до 2 знаков для сохранения стиля исходной таблицы
					    return Math.round(y * 100) / 100;
					}
					
					// Тест нескольких контрольных точек:
					console.log(`ID 0:  ${calculateY(0)}   (Ожидалось 0.04)`);
					console.log(`ID 5:  ${calculateY(5)}   (Ожидалось 0.33)`);
					console.log(`ID 10: ${calculateY(10)}  (Ожидалось 0.81)`);
					console.log(`ID 15: ${calculateY(15)}  (Ожидалось 1.85)`);
					console.log(`ID 22: ${calculateY(22)}  (Ожидалось 10.0)`);
					
/*					
for (let i = 0; i < array.length; i++){

	if ((i > 0) && (i < 6)) array[i] = (0.2 / 5) * i;
	if ((i > 5) && (i < 19)) {

		const a = (5 - 0.2) / 13, b = 0.2 - a * 6;
		array[i] = a * i + b;

	}
		
}
*/
/*					
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
*/
					const circleId = middleCirclesCount - circlesCount - 1;
const y = array[circleId];
//					const y = calculateY(circleId);
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
