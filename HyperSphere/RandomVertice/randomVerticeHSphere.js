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

	// * @param {boolean} [boInitRandomAngles=true] true - init random angles.
	
	/**
	 * Generates a random vertice near the opposite vertice in 3D hypersphere.
	 * @param {object} [params={}] See the <b>params</b> of the <a href="./module-RandomVertice-RandomVertice.html" target="_blank"><b>RandomVertice</b></a> constructor for details.
	 * @param {boolean} [boCloud=false] true - generates a random vertice cloud.
	 */
	constructor(params, boCloud = false, boRandomVertice = true) {

		super(params, boCloud);

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
					verticesAngles(true);
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
				
				const classSettings = params.classSettings,
					settings = classSettings.settings,
					radius = classSettings.overriddenProperties.r(settings.guiPoints ? settings.guiPoints.timeId : settings.options.player === false ? 0 : settings.options.player.getTimeId());
				this.navigator = new HyperSphereNavigator(radius);
				
			},
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
		
		let randomAngles;

		//overridden methods

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
/*
		this.oppositeVerticeOnChange = () => { this.verticesAngles(true); }
		this.getRandomAngles = (point, startingPointParams) => {

			if (!this.navigator) createHyperSphereNavigator();

			// Правильное распределение для равномерного покрытия:
			// Вероятность попасть в сферическую шапочку радиуса d пропорциональна sin^3(d/R)
			const distance = this.navigator.R * this.navigator.inverseCDF_S3(random()) / (1+ 100 * random()); // см. объяснение ниже

			if (!startingPointParams) {
				
				const oppositeVertice = params.oppositeVertice;
				startingPointParams = this.navigator.startingPointParams(
						oppositeVertice.latitude,
						oppositeVertice.longitude,
						oppositeVertice.altitude,
					)
					
			}
			const result = this.navigator.calculateNewPoint(
					startingPointParams,
					distance,//0.5,//random() * this.navigator.R * π,//distance максимальная дистанция находится на противоположной стороне гиперсферы
					point ? point.iEta : acos(2 * random() - 1),//eta. первый угол направления (полярный угол). 0 ≤ eta ≤ π
					(point ? point.iPsi : random()) * 2 * π//psi. второй угол направления (азимутальный угол). 0 ≤ psi < 2π или -π ≤ psi ≤ π
				);
			const angles = utils.angles([result.altitude, result.latitude, result.longitude]);
			if (params.editAnglesId === undefined) {
				
				params.verticesAngles.push(angles);
				params.pointsCount++;

			} else {
				
				params.verticesAngles[params.editAnglesId] = angles;
				params.verticesAngles.needsUpdate;

			}
			return this.angles;
			
		}
*/
		
		Object.defineProperty(this, 'cloud', {
			
			get: () => {

				verticesAngles(false);
				return this.verticesAngles;
				
			},
			
		});
		
		/////////////////////////////overridden methods

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

	}
	
	//overridden methods
	
	ZeroArray() { return [0, 0, 0]; }
	Center(params) {
	
		utils.angles(params.vertice);
		utils.angles(params.oppositeVertice);
		
	}
	resultAngles(result) { return utils.angles([result.altitude, result.latitude, result.longitude]); }
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
