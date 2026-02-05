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
//import RandomCloudSphere from './randomCloudSphere.js';
//import getHyperSphere from './getHyperSphere.js'
import HyperSphere from '../hyperSphere3D.js';

const sRandomVerticesHyperSphere = 'RandomVerticesHSphere',
	π = Math.PI, round = Math.round, random = Math.random,//abs = Math.abs, 
	//cos = Math.cos, sin = Math.sin,
	atan = Math.atan, acos = Math.acos;// asin = Math.asin, atan2 = Math.atan2,

/**
 * Generates a random vertice near the opposite vertice in 3D hypersphere.
 * @class
 * @extends RandomVertice
 */
class RandomVerticeHSphere extends RandomVertice {

	// * @param {boolean} [boCloud=false] true - generates a random vertice cloud.
	
	/**
	 * Generates a random vertice near the opposite vertice in 3D hypersphere.
	 * @param {object} [params={}] See the <b>params</b> of the <a href="./module-RandomVertice-RandomVertice.html" target="_blank"><b>RandomVertice</b></a> constructor for details.
	 * @param {number} verticesCount count of vertices in the random vertices cloud.
	 */
	constructor(params, verticesCount/*, boRandomVertice = true*/) {

		super(params, verticesCount);

/*		
		const arraySpheres = boCloud ? undefined : [],//Массив с параметрами сфер, из которых состоит гиперсфера. Создается когда нужно облако случайных или неслучайных средних точек.
			arrayCloudSpheres = arraySpheres ? undefined : [];//Массив сфер RandomCloudSphere, из которых состоит гиперсфера.
*/			
			
		if (!params.boArcIsdefined) {

			params.boArcIsdefined = true;
			let arc = params.arc;
			Object.defineProperty(params, 'arc', {
	
				get: () => {

					if (params.boAllocateMemory) return π;//Выделяется память для облака точек. arc нужно сделать максимально возможным то есть вершины расположены друг против друга. В этом случае выделяется максимальный объем памяти.
					let centralAngle;
					if (arc === undefined) {

						console.error(sRandomVerticesHyperSphere + ': get params.arc. Invalid arc = ' + arc);
//						const vertice = params.vertice, oppositeVertice = params.oppositeVertice;
	
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
/*						
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
*/							
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
						
//						centralAngle = calculateCentralAngle(vertice, oppositeVertice);
	
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
					this.verticesAngles(true);
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
			//Применяется в params.circleLatitudeMultiplier. Перенес сюда для оптимизации производительности. https://chat.deepseek.com/a/chat/s/4efba92b-7b32-41d3-89b1-3b2f4a3b0ac8
			//https://gemini.google.com/app/bcf378e363b790b6	
			aLatitudeMultipliers = [
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
			createHyperSphereNavigator = () => {

				this.navigator = new HyperSphereNavigator();

			};
*/			
		
		let randomAngles;

		/*
		Есть точка на поверхности 3-мерной гиперсферы встроенной в 4-мерное евклидово пространство в полярной системе координат.
		R - радиус гиперсферы. 
		Положение точки определено ее углами:
		latitude - широта в диапазоне от -π/2 до π/2.
		longitude - долгота в диапазоне от -π до π.
		altitude - высота в диапазоне от 0 до π.
		Начало координат находится в центре гиперсферы. Вычислить другую точку на гиперсфере, которая находится на определенном растоянии и под определенными углами от заданной точки.
		*/
		//https://chat.deepseek.com/a/chat/s/de1d7524-faab-4e09-bb49-2be8848ae401

		class HyperSphereNavigator {
			constructor(radius = 1.0) {
				this.R = radius;
			}

			// 1. Преобразование углов в декартовы координаты на гиперсфере
			anglesToCartesian(latitude, longitude, altitude) {
				const a = altitude;                 // altitude ∈ [0, π]
				const b = Math.PI / 2 - latitude;     // b ∈ [0, π]
				const c = longitude;                // longitude ∈ [-π, π]

				const x1 = this.R * Math.cos(a);
				const x2 = this.R * Math.sin(a) * Math.cos(b);
				const x3 = this.R * Math.sin(a) * Math.sin(b) * Math.cos(c);
				const x4 = this.R * Math.sin(a) * Math.sin(b) * Math.sin(c);

				return [x1, x2, x3, x4];
			}

			// 2. Создание ортонормированного базиса в касательном пространстве
			createTangentBasis(latitude, longitude, altitude) {
				const a = altitude;
				const b = Math.PI / 2 - latitude;
				const c = longitude;

				// e1 - направление увеличения altitude
				const e1 = [
					-Math.sin(a),
					Math.cos(a) * Math.cos(b),
					Math.cos(a) * Math.sin(b) * Math.cos(c),
					Math.cos(a) * Math.sin(b) * Math.sin(c)
				];
				// Нормализация e1 (уже единичный, но для точности)
				const norm_e1 = Math.sqrt(e1.reduce((sum, val) => sum + val * val, 0));
				const e1_norm = e1.map(v => v / norm_e1);

				// e2 - направление увеличения b (уменьшения latitude)
				const e2_raw = [
					0,
					-Math.sin(a) * Math.sin(b),
					Math.sin(a) * Math.cos(b) * Math.cos(c),
					Math.sin(a) * Math.cos(b) * Math.sin(c)
				];
				const norm_e2 = Math.sqrt(e2_raw.reduce((sum, val) => sum + val * val, 0));
				const e2_norm = norm_e2 > 1e-10 ? e2_raw.map(v => v / norm_e2) : [0, 0, 0, 0];

				// e3 - направление увеличения longitude
				const e3_raw = [
					0,
					0,
					-Math.sin(a) * Math.sin(b) * Math.sin(c),
					Math.sin(a) * Math.sin(b) * Math.cos(c)
				];
				const norm_e3 = Math.sqrt(e3_raw.reduce((sum, val) => sum + val * val, 0));
				const e3_norm = norm_e3 > 1e-10 ? e3_raw.map(v => v / norm_e3) : [0, 0, 0, 0];

				return [e1_norm, e2_norm, e3_norm];
			}

			/**
			 * Обратная функция распределения для равномерной выборки на S³
			 * Для равномерного распределения на 3-сфере от северного полюса:
			 * Плотность: f(θ) ∝ sin³(θ), где θ = distance/R
			 * CDF: F(θ) = (3θ - 3sinθcosθ + 2sin³θ) / 4
			 * Здесь используем численное решение обратной функции
			 */
			inverseCDF_S3(u) {
				// u ∈ [0, 1] равномерно
				// Ищем θ такой, что CDF(θ) = u, θ ∈ [0, π]

				// Численное решение методом бисекции
				let low = 0;
				let high = Math.PI;
				const tolerance = 1e-10;
				const maxIterations = 100;

				for (let i = 0; i < maxIterations; i++) {
					const mid = (low + high) / 2;
					const cdfValue = this.CDF_S3(mid);

					if (Math.abs(cdfValue - u) < tolerance) {
						return mid;
					}

					if (cdfValue < u) {
						low = mid;
					} else {
						high = mid;
					}
				}

				return (low + high) / 2;
			}

			/**
			 * Функция распределения (CDF) для расстояния на S³
			 */
			CDF_S3(theta) {
				// CDF(θ) = (3θ - 3sinθcosθ + 2sin³θ) / 4
				const sinTheta = Math.sin(theta);
				const cosTheta = Math.cos(theta);
				const sin3Theta = sinTheta * sinTheta * sinTheta;

				return (3 * theta - 3 * sinTheta * cosTheta + 2 * sin3Theta) / 4;
			}

			startingPointParams() {

				const oppositeVertice = params.oppositeVertice,
					lat = oppositeVertice.latitude, lon = oppositeVertice.longitude, alt = oppositeVertice.altitude;
				if (alt === undefined) alt = anglesRange.altitude.range / 2;
				if (lon === undefined) console.error('startingPointParams: under constraction');
				if (lat === undefined) console.error('startingPointParams: under constraction');

				// Исходная точка
				const P = this.anglesToCartesian(lat, lon, alt);

				// Касательный базис
				const [e1, e2, e3] = this.createTangentBasis(lat, lon, alt);

				return {

					P: P,
					e1: e1,
					e2: e2,
					e3: e3,

				}

			}

			/**
			 * Вычисление новой точки
			 * @param {object} startingPointParams see startingPointParams above.
			 * @param {any} distance геодезическое расстояние. Диапазон значений: 0 ≤ distance ≤ πR
			 * @param {any} eta первый угол направления (полярный угол). Определяет наклон направления движения относительно "вертикали" в касательном пространстве.
			 * Аналог "широты" направления или "угла места".
			 * Диапазон значений: 0 ≤ eta ≤ π
			 * @param {any} psi второй угол направления (азимутальный угол)
			 * Назначение:
			 * Определяет азимут направления движения в горизонтальной плоскости касательного пространства
			 * Задает вращение вокруг оси e1
			 * Диапазон значений:
			 * Необходимый и достаточный: 0 ≤ psi < 2π
			 * Но обычно достаточно: -π ≤ psi ≤ π (как в коде)
			 * @returns
			 */
			calculateNewPoint(startingPointParams, distance, eta, psi) {
				// Исходная точка
				//		const P = this.anglesToCartesian(lat, lon, alt);
				const P = startingPointParams.P;

				// Касательный базис
				//		const [e1, e2, e3] = this.createTangentBasis(lat, lon, alt);
				const [e1, e2, e3] = [startingPointParams.e1, startingPointParams.e2, startingPointParams.e3];

				// Направляющий вектор в касательном пространстве
				const u = [0, 0, 0, 0];
				for (let i = 0; i < 4; i++) {
					u[i] = Math.cos(eta) * e1[i] +
						Math.sin(eta) * Math.cos(psi) * e2[i] +
						Math.sin(eta) * Math.sin(psi) * e3[i];
				}

				// Угловое расстояние
				const delta = distance / this.R;

				// Экспоненциальное отображение
				const Q = [0, 0, 0, 0];
				for (let i = 0; i < 4; i++) {
					Q[i] = Math.cos(delta) * P[i] + this.R * Math.sin(delta) * u[i];
				}

				// Обратное преобразование в углы
				return this.cartesianToAngles(Q);
			}

			// 4. Преобразование декартовых координат в углы
			cartesianToAngles(Q) {
				const [q1, q2, q3, q4] = Q;

				// altitude
				let altitude = Math.acos(q1 / this.R);
				if (isNaN(altitude)) altitude = 0;

				// latitude и longitude
				let latitude, longitude;

				const sinA = Math.sin(altitude);
				if (Math.abs(sinA) < 1e-10) {
					// Случай полюса
					latitude = 0;
					longitude = 0;
				} else {
					// b'
					let b = Math.acos(q2 / (this.R * sinA));
					if (isNaN(b)) b = 0;

					latitude = Math.PI / 2 - b;

					// longitude
					longitude = Math.atan2(q4, q3);
				}

				// Приведение longitude к диапазону [-π, π]
				if (longitude > Math.PI) longitude -= 2 * Math.PI;
				if (longitude < -Math.PI) longitude += 2 * Math.PI;

				return {
					latitude,
					longitude,
					altitude,
					//cartesian: Q
				};
			}

			// 5. Вычисление расстояния между двумя точками на гиперсфере
			greatCircleDistance(lat1, lon1, alt1, lat2, lon2, alt2) {
				const P1 = this.anglesToCartesian(lat1, lon1, alt1);
				const P2 = this.anglesToCartesian(lat2, lon2, alt2);

				let dot = 0;
				for (let i = 0; i < 4; i++) {
					dot += P1[i] * P2[i];
				}
				dot /= (this.R * this.R);

				// Обеспечиваем численную стабильность
				dot = Math.max(-1, Math.min(1, dot));

				const angle = Math.acos(dot);
				return this.R * angle;
			}
		}
		/*
		// Примеры использования
		function runExamples() {
			const navigator = new HyperSphereNavigator(1.0);
			
			console.log("=== Пример 1: Простое движение ===");
			const start1 = {lat: 0, lon: 0, alt: Math.PI/4}; // 45° altitude
			const distance1 = Math.PI/4; // 45° углового расстояния
			const eta1 = 0; // Двигаемся прямо по направлению e1
			const psi1 = 0;
			
			const result1 = navigator.calculateNewPoint(
				start1.lat, start1.lon, start1.alt, 
				distance1, eta1, psi1
			);
			
			console.log("Начальная точка:", start1);
			console.log("Расстояние:", distance1, "радиан");
			console.log("Новая точка:", {
				latitude: result1.latitude.toFixed(6),
				longitude: result1.longitude.toFixed(6),
				altitude: result1.altitude.toFixed(6)
			});
			
			// Проверка расстояния
			const checkDist1 = navigator.greatCircleDistance(
				start1.lat, start1.lon, start1.alt,
				result1.latitude, result1.longitude, result1.altitude
			);
			console.log("Проверка расстояния:", checkDist1.toFixed(6), 
						"(ожидается:", distance1.toFixed(6), ")");
			
			console.log("\n=== Пример 2: Движение под углом ===");
			const start2 = {lat: Math.PI/6, lon: Math.PI/4, alt: Math.PI/3};
			const distance2 = Math.PI/6; // 30°
			const eta2 = Math.PI/4; // 45° от вертикали
			const psi2 = Math.PI/2; // 90° азимут
			
			const result2 = navigator.calculateNewPoint(
				start2.lat, start2.lon, start2.alt,
				distance2, eta2, psi2
			);
			
			console.log("Начальная точка:", start2);
			console.log("Новая точка:", {
				latitude: (result2.latitude * 180/Math.PI).toFixed(2) + "°",
				longitude: (result2.longitude * 180/Math.PI).toFixed(2) + "°",
				altitude: (result2.altitude * 180/Math.PI).toFixed(2) + "°"
			});
			
			console.log("\n=== Пример 3: Большое расстояние ===");
			const start3 = {lat: 0, lon: 0, alt: 0.1};
			const distance3 = Math.PI/2; // 90°
			const eta3 = Math.PI/2; // Горизонтально
			const psi3 = 0;
			
			const result3 = navigator.calculateNewPoint(
				start3.lat, start3.lon, start3.alt,
				distance3, eta3, psi3
			);
			
			console.log("Начальная точка:", start3);
			console.log("Новая точка:", {
				latitude: (result3.latitude * 180/Math.PI).toFixed(2) + "°",
				longitude: (result3.longitude * 180/Math.PI).toFixed(2) + "°",
				altitude: (result3.altitude * 180/Math.PI).toFixed(2) + "°"
			});
			
			console.log("\n=== Пример 4: Крайние случаи ===");
			// Почти северный полюс
			const start4 = {lat: Math.PI/2 - 0.001, lon: 0, alt: 0.001};
			const distance4 = 0.1;
			const eta4 = 0;
			const psi4 = 0;
			
			try {
				const result4 = navigator.calculateNewPoint(
					start4.lat, start4.lon, start4.alt,
					distance4, eta4, psi4
				);
				
				console.log("Начальная точка (почти полюс):", start4);
				console.log("Новая точка:", {
					latitude: (result4.latitude * 180/Math.PI).toFixed(4) + "°",
					longitude: (result4.longitude * 180/Math.PI).toFixed(4) + "°",
					altitude: (result4.altitude * 180/Math.PI).toFixed(4) + "°"
				});
			} catch (e) {
				console.log("Ошибка в примере 4:", e.message);
			}
			
			// Визуализация в 3D проекции (первые 3 координаты)
			console.log("\n=== Декартовы координаты (первые 3 из 4) ===");
			console.log("Пример 1 - начальная:", 
						navigator.anglesToCartesian(start1.lat, start1.lon, start1.alt)
							.slice(0,3).map(v => v.toFixed(4)));
			console.log("Пример 1 - конечная:", 
						result1.cartesian.slice(0,3).map(v => v.toFixed(4)));
		}
			
		// Запуск примеров
		runExamples();
			
		// Функция для интерактивного тестирования
		function testCustomPoint() {
			const navigator = new HyperSphereNavigator(1.0);
			
			// Пользовательский тест
			const testCase = {
				lat: Math.PI/4,    // 45°
				lon: Math.PI/6,    // 30°
				alt: Math.PI/3,    // 60°
				distance: 0.5,     // радиан
				eta: Math.PI/4,    // 45°
				psi: Math.PI/3     // 60°
			};
			
			const result = navigator.calculateNewPoint(
				testCase.lat, testCase.lon, testCase.alt,
				testCase.distance, testCase.eta, testCase.psi
			);
			
			console.log("\n=== Пользовательский тест ===");
			console.log("Входные параметры:", testCase);
			console.log("Результат:", {
				latitude: result.latitude.toFixed(6),
				longitude: result.longitude.toFixed(6),
				altitude: result.altitude.toFixed(6)
			});
			
			return result;
		}
			
		// Выполнить пользовательский тест
		testCustomPoint();
		*/
		this.navigator = new HyperSphereNavigator();

		//overridden methods
/*
		this.verticesAngles = (editAngles = false) => {

//			createHyperSphereNavigator();

			const startingPointParams = this.navigator.startingPointParams();
			for (let i = 0; i < (boCloud ? 750 : 1); i++) {

				if (editAngles) params.editAnglesId = i;
				this.getRandomAngles(undefined, startingPointParams);

			}
			delete params.editAnglesId;

		};
*/		
/*
		verticesAngles = (editAngles = false) => {

			if (boRandomVertice) {

				createHyperSphereNavigator();

				const oppositeVertice = params.oppositeVertice,
					startingPointParams = this.navigator.startingPointParams(
						oppositeVertice.latitude,
						oppositeVertice.longitude,
						oppositeVertice.altitude,
					);
				for (let i = 0; i < (boCloud ? 750 : 1); i++) {

					if (editAngles) params.editAnglesId = i;
					this.getRandomAngles(undefined, startingPointParams);

				}

			} else {

				let i = 0;
				for (let iDistance = 0; iDistance < 1; iDistance += 0.1) {

					//первый угол направления (полярный угол).
					for (let iEta = 0; iEta < 1; iEta += 0.1) {

						//второй угол направления (азимутальный угол)
						for (let iPsi = 0; iPsi < 1; iPsi += 0.1) {

							if (editAngles) {

								params.editAnglesId = i;
								i++

							}
							this.getRandomAngles({ iDistance: iDistance, iEta: iEta, iPsi: iPsi });

						}

					}

				}

			}
			delete params.editAnglesId;

		};
*/
/*		
		Object.defineProperty(this, 'angles', {
			
			get: () => { return params.verticesAngles; },
			set: (anglesNew) => { params.verticesAngles = anglesNew; },
			
		});
*/
/*
		this.getAngles = () => { return params.verticesAngles; }
		this.setAngles = (anglesNew) => { params.verticesAngles = anglesNew; }
*/
//		this.paramsVerticeOnChange = () => { this.verticesAngles(true); }
		this.getRandomAngles = (point, startingPointParams) => {

//			if (!this.navigator) createHyperSphereNavigator();

			// Правильное распределение для равномерного покрытия:
			// Вероятность попасть в сферическую шапочку радиуса d пропорциональна sin^3(d/R)
//			const distance = this.navigator.R * this.navigator.inverseCDF_S3(random()) / (1+ 100 * random()); // см. объяснение ниже
			const R = this.navigator.R, distance = this.distance(R * this.navigator.inverseCDF_S3(random()), R);

			if (!startingPointParams) {

/*				
				const oppositeVertice = params.oppositeVertice;
				startingPointParams = this.navigator.startingPointParams(
						oppositeVertice.latitude,
						oppositeVertice.longitude,
						oppositeVertice.altitude,
					)
*/					
				startingPointParams = this.navigator.startingPointParams();
					
			}
			const result = this.navigator.calculateNewPoint(
					startingPointParams,
					distance,//0.5,//random() * this.navigator.R * π,//distance максимальная дистанция находится на противоположной стороне гиперсферы
					point ? point.iEta : acos(2 * random() - 1),//eta. первый угол направления (полярный угол). 0 ≤ eta ≤ π
					(point ? point.iPsi : random()) * 2 * π//psi. второй угол направления (азимутальный угол). 0 ≤ psi < 2π или -π ≤ psi ≤ π
				);
			const angles = utils.angles([result.altitude, result.latitude, result.longitude]);
			this.paramsVerticesAngles(angles);
			return this.angles;
			
		}
		
		Object.defineProperty(this, 'cloud', {
			
			get: () => {

				verticesAngles(false);
				return this.verticesAngles;
				
			},
			
		});
		
		/////////////////////////////overridden methods

		params.pointsCount = 0;
		this.verticesAngles(false);
/*		
		if (!arraySpheres) {//не выделять this.verticesAngles если нужно вычислить одну случайную точку randomVerticeSettings.mode = randomVerticeSettings.modes.randomVertice = 1

			params.pointsCount = 0;
			this.verticesAngles(false);
//			delete params.hyperSphere.circleLatitudeMultiplierRes;

		} else {
			
//			if (boInitRandomAngles) {

			params.pointsCount = 0;
			this.randomAngles;//Вычислить случайную точку если нужна одна случайная точка т.е. randomVerticeSettings.mode = randomVerticeSettings.modes.randomVertice = 1 или randomVerticeSettings.mode = randomVerticeSettings.modes.randomCloud = 2
			params.editAnglesId = 0;

//			}
			
		}
*/		

	}
	
	//overridden methods
	
	ZeroArray() { return [0, 0, 0]; }
	Center(params) {
	
//		utils.angles(params.vertice);
		utils.angles(params.oppositeVertice);
		
	}
//	resultAngles(result) { return utils.angles([result.altitude, result.latitude, result.longitude]); }
/*	
	getHyperSphere(classSettings, scene, middleVerticeColor) {
		
		const debug = {
					
				probabilityDensity: false,
				middleVertice: false,
				log: false,
				
			},
			settings = classSettings.settings,
			options = settings.options;
		return getHyperSphere(
			HyperSphere,
			options,
			scene,
			this,
			{
				
				debug: debug,
				r: classSettings.overriddenProperties.r(settings.guiPoints ? settings.guiPoints.timeId : options.player ? options.player.getTimeId() : 0),
				name: 'Random Cloud'
				
			});
	
	}
*/	
	get HyperSphere() { return HyperSphere; }
	
	/////////////////////////////overridden methods

}
export default RandomVerticeHSphere;
