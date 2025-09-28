/**
 * @module RandomVerticeHyperSphere
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
import * as utils from './utilsHyperSphere.js'
//import RandomCloud from './randomCloudHyperSphere.js';
//import RandomCloudSphere from './randomCloudSphere.js';
//import CloudSphere from './cloudSphere.js';

const sRandomVerticesHyperSphere = 'RandomVerticesHyperSphere',
	π = Math.PI, abs = Math.abs, round = Math.round, random = Math.random,
	sin = Math.sin, asin = Math.asin, cos = Math.cos, tan = Math.tan, atan = Math.atan, atan2 = Math.atan2,
	range = anglesRange.longitude.range;

/**
 * Generates a random vertice near the opposite vertice in 3D hypersphere.
 * @class
 * @extends RandomVertice
 */
class RandomVerticeHyperSphere extends RandomVertice {

	/**
	 * Generates a random vertice near the opposite vertice in 3D hypersphere.
	 * @param {object} [params={}] See the <b>params</b> of the <a href="./module-RandomVertice-RandomVertice.html" target="_blank"><b>RandomVertice</b></a> constructor for details.
	 * @param {object} [boCloud=false] true - generates a random vertice cloud.
	 * @param {boolean} [boInitRandomAngles=true] true - init random angles.
	 */
	constructor(params, boCloud = false, boInitRandomAngles = true) {

		super(params);

//		const arrayCircles = boCloud ? undefined : [];
		const arraySpheres = boCloud ? undefined : [];
			
		if (params.arc === undefined) Object.defineProperty(params, 'arc', {
	
				get: () => {

					if (params.boAllocateMemory) return π;//Выделяется память для облака точек. arc нужно сделать максимально возможным то есть вершины расположены друг против друга. В этом случае выделяется максимальный объем памяти.
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
					const calculateCentralAngle = (point1, point2) => {
					  const { latitude: lat1, longitude: lon1, altitude: alt1 } = point1;
					  const { latitude: lat2, longitude: lon2, altitude: alt2 } = point2;
					
					  const cosDelta = Math.cos(lat1) * Math.cos(lat2) * Math.cos(lon1 - lon2) * Math.cos(alt1 - alt2) + Math.sin(lat1) * Math.sin(lat2);
					
					  // Ограничиваем значение, чтобы избежать ошибок с плавающей точкой
					  const clampedCosDelta = Math.max(-1, Math.min(1, cosDelta));
					  
					  return Math.acos(clampedCosDelta);
					}
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
					  const {
					    latitude: lat1,
					    longitude: lon1,
					    altitude: alt1
					  } = point1;
					  const {
					    latitude: lat2,
					    longitude: lon2,
					    altitude: alt2
					  } = point2;
					
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
					
					const centralAngle = calculateCentralAngle(vertice, oppositeVertice);

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
					return centralAngle;
					/*
					// Тестовый пример
					const point1 = {
					  latitude: 0.5, // 28.6 градуса
					  longitude: 1.0, // 57.3 градуса
					  altitude: 1.5, // 85.9 градуса
					};
					
					const point2 = {
					  latitude: 0.8, // 45.8 градуса
					  longitude: 1.2, // 68.8 градуса
					  altitude: 1.7, // 97.4 градуса
					};
					
					const angleInRadians = calculateCentralAngle(point1, point2);
					const angleInDegrees = angleInRadians * 180 / Math.PI;
					
					console.log(`Центральный угол в радианах: ${angleInRadians}`);
					console.log(`Центральный угол в градусах: ${angleInDegrees}`);
					*/
					/*					
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
					const θ = arccos(sin(ϕ1) * sin(ϕ2) + cos(ϕ1) * cos(ϕ2) * cos(λ1 - λ2));
					if (isNaN(θ)) console.error(sSphere + ': getArcAngle. Invalid θ = ' + θ);
					return θ;
*/					
				
				},
		
			});
		
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

//		const anglesIdMax = 50,//Количество точек на окружности, расположенной на экваторе
		const spheresCount = round(//найти ближайшее целое число
				(anglesIdMax / 2) + 1),//количество окружностей
			k = spheresCount === 1 ? 1 : 1 / (spheresCount - 1),//for params.random = k * circleId;
			getRandomVerticeAnglesParams = (altitude, angleStep) => {

				params.hyperSphere = {

					rotate: (point, rotationAngles) => {

					/*https://https://gemini.google.com/app/45b136829aad53e4
					Есть точка на поверхности 3-мерной гиперсферы встроенной в 4-мерное евклидово пространство в полярной системе координат. Начало полярной системы координат находится в центре сферы.

					Положение точки обозначить как
					point.latitude - широта (зенитный угол) в диапазоне от -π/2 до π/2,
					point.longitude - долгота (азимутальный угол)  в диапазоне от -π до π,
					point.altitude - полярный угол от оси W  в диапазоне от 0 до π.

					Написать на javascript исходный код поворота этой точки на произвольный угол с использованием углов Эйлера. Включить в исходный код пример использования.
					Результат поворота должен быть в полярной системе коодинат. Положение точки и результат поворота измеряется в радианах.
					*/
					/**
					 * Преобразует полярные координаты в 4D декартовы.
					 * @param {number} latitude - Широта (зенитный угол), от -PI/2 до PI/2.
					 * @param {number} longitude - Долгота (азимутальный угол), от -PI до PI.
					 * @param {number} altitude - Полярный угол от оси W, от 0 до PI.
					 * @returns {{x: number, y: number, z: number, w: number}} - 4D декартовы координаты.
					 */
					function toCartesian4D(latitude, longitude, altitude) {
					    const cosAlt = Math.cos(altitude);
					    const sinAlt = Math.sin(altitude);
					    const cosLat = Math.cos(latitude);
					    const sinLat = Math.sin(latitude);
					    const cosLong = Math.cos(longitude);
					    const sinLong = Math.sin(longitude);
					
					    return {
					        x: cosLong * cosLat * sinAlt,
					        y: sinLong * cosLat * sinAlt,
					        z: sinLat * sinAlt,
					        w: cosAlt
					    };
					}
					
					/**
					 * Преобразует 4D декартовы координаты в полярные.
					 * @param {{x: number, y: number, z: number, w: number}} point - 4D декартовы координаты.
					 * @returns {{latitude: number, longitude: number, altitude: number}} - Полярные координаты.
					 */
					function toPolar4D(point) {
					    const { x, y, z, w } = point;
					    const altitude = Math.acos(w);
					
					    if (altitude === 0) {
					        // Случай, когда точка находится на оси W.
/*							
					        return {
					            latitude: 0,
					            longitude: 0,
					            altitude: 0
					        };
*/
							return Vertice([0, 0, 0]);
					    }
					
					    const sinAlt = Math.sin(altitude);
					    const latitude = Math.asin(z / sinAlt);
					    const longitude = Math.atan2(y, x);
					
//					    return { latitude, longitude, altitude };
						return Vertice([altitude, latitude, longitude]);
						
					}
					
					/**
					 * Поворачивает точку на 3-мерной гиперсфере с использованием углов Эйлера.
					 * @param {{latitude: number, longitude: number, altitude: number}} point - Полярные координаты точки.
					 * @param {{xy: number, xz: number, yz: number}} eulerAngles - Углы поворота в радианах для плоскостей XY, XZ и YZ.
					 * @returns {{latitude: number, longitude: number, altitude: number}} - Повернутая точка в полярных координатах.
					 */
					function rotatePoint(point, eulerAngles) {
					    let { x, y, z, w } = toCartesian4D(point.latitude, point.longitude, point.altitude);
					
					    // Матрица поворота для плоскости XY (поворот вокруг оси ZW)
					    const cosXY = Math.cos(eulerAngles.xy);
					    const sinXY = Math.sin(eulerAngles.xy);
					    const newX = x * cosXY - y * sinXY;
					    const newY = x * sinXY + y * cosXY;
					    x = newX;
					    y = newY;
					
					    // Матрица поворота для плоскости XZ (поворот вокруг оси YW)
					    const cosXZ = Math.cos(eulerAngles.xz);
					    const sinXZ = Math.sin(eulerAngles.xz);
					    const newX2 = x * cosXZ - z * sinXZ;
					    const newZ = x * sinXZ + z * cosXZ;
					    x = newX2;
					    z = newZ;
					
					    // Матрица поворота для плоскости YZ (поворот вокруг оси XW)
					    const cosYZ = Math.cos(eulerAngles.yz);
					    const sinYZ = Math.sin(eulerAngles.yz);
					    const newY2 = y * cosYZ - z * sinYZ;
					    const newZ2 = y * sinYZ + z * cosYZ;
					    y = newY2;
					    z = newZ2;
					
					    return toPolar4D({ x, y, z, w });
					}

					/*
					// Пример использования
					const myPoint = {
					    latitude: Math.PI / 4,    // 45 градусов
					    longitude: Math.PI / 2,   // 90 градусов
					    altitude: Math.PI / 3     // 60 градусов
					};
					
					const rotationAngles = {
					    xy: Math.PI / 6,    // Поворот на 30 градусов в плоскости XY
					    xz: Math.PI / 4,    // Поворот на 45 градусов в плоскости XZ
					    yz: -Math.PI / 3    // Поворот на -60 градусов в плоскости YZ
					};
					
					const rotatedPoint = rotatePoint(myPoint, rotationAngles);
					
					console.log('Начальная точка:', myPoint);
					console.log('Повернутая точка:', rotatedPoint);
					*/
					const eulerAngles = {
					    xy: rotationAngles.latitude,    // Поворот в плоскости XY
					    xz: rotationAngles.longitude,    // Поворот в плоскости XZ
					    yz: rotationAngles.altitude    // Поворот в плоскости YZ
					};
					return rotatePoint(Vertice(point, params.altitude), eulerAngles);
					
					},
					verticesAngles: this.verticesAngles,

				}
				params.verticesAngles.boNoNew = true;
//				const cloudSphere = params.boCloudSphere ? new CloudSphere(params) : new RandomCloudSphere(params);
				const cloudSphere = new params.CloudSphere(params);
				delete params.verticesAngles.boNoNew;
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
//							(sphereAnglesCount > this.verticesAngles.length)
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
			getRandomVerticeAngles = (altitude, altitudeStep, altitudeMid, circleAnglesCount, angleStep1, angleId) => {
				
				const randomVerticeAngles = [

					//altitude
					params.debug && params.debug.notRandomVertices ?
					
						altitude : //сфера расположна на одной высоте

						//сфера расположна на случайной высоте в диапазоне от altitude до latitude - altitudeStep. Нужно, что бы сфера случайных точек немного гуляла по высоте от latitude до altitude - altitudeStep. Тогда поверхность гиперсферы будет случайно заполнена точками.
						//Если это не делать то случайные точки будут располагаться слоями по высоте.
						altitudeStep * (random() - 0.5) + altitudeMid,

					//latitude
					utils.normalizeLatitude(
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
						) * π//диапазон возможных углов от -0.5 до 0.5 мняем на диапазон от -π / 2 до π / 2
					),
/*					
					params.debug && params.debug.notRandomVertices ?
					
						latitude : //окружность расположна на одной широте

						//окружность расположна на случайной широте в диапазоне от latitude до latitude - angleStep. Нужно, что бы окружность случайных точек немного гуляла по широте от latitude до latitude - angleStep. Тогда поверхность сферы будет случайно заполнена точками.
						//Если это не делать то случайные точки будут располагаться слоями по широте.
						latitudeStep * (random() - 0.5) + latitudeMid,
*/						

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
				if (!arrayCircles && (this.circlesPointsCount >= this.verticesAngles.length)) console.error(sRandomVerticesHyperSphere + '.verticesAngles: Allocate memory failed! this.circlesPointsCount = ' + this.circlesPointsCount + ' >= this.verticesAngles.length = ' + this.verticesAngles.length);

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
					γ = params.oppositeVertice.longitude - π / 2;
				return rotatePointWithEulerAngles(initialLatitude, initialLongitude, α, β, γ);
				
			},
			verticesAngles = (boAllocateMemory) => {

				//Гиперсфера случайных точек состоит из набора сфер.
				
				const arc = params.arc;
				this.circlesPointsCount = boAllocateMemory ? undefined : //Во время выделения памяти в массив params.verticesAngles добавляется новый item
					0;//в противном случае в массиве params.verticesAngles редактируется item с индексом this.circlesPointsCount
				let altitudePrev = 0;//высота предыдущей сферы
				for(
					let sphereId = 0;
//sphereId < 1;//для отладки делаем одну сферу
					sphereId < spheresCount;
					sphereId++
				){

					params.random = k * sphereId;

					const altitude = this.altitude(utils),
						angleStep = abs(altitude - altitudePrev),//угол между соседними точками на сфере
						randomVerticeAnglesParams = getRandomVerticeAnglesParams(altitude, angleStep);
					if (arraySpheres && !boAllocateMemory) {

						const sphereAnglesCount = randomVerticeAnglesParams.sphereAnglesCount;
if ((altitudePrev < params.oppositeVertice.altitude) && (altitude >= params.oppositeVertice.altitude))
						arraySpheres.push({ altitude, angleStep, altitudeStep: randomVerticeAnglesParams.altitudeStep, altitudeMid: randomVerticeAnglesParams.altitudeMid, sphereAnglesCount, cloudSphere: randomVerticeAnglesParams.cloudSphere, });
						this.circlesPointsCount += sphereAnglesCount;
						altitudePrev = altitude; 
						continue;

					}
					const angleStep1 = randomVerticeAnglesParams.angleStep1,
//						boSouthernSphere = randomVerticeAnglesParams.boSouthernSphere,
//						boNorthernSphere = randomVerticeAnglesParams.boNorthernSphere,
//						altitudeMin = randomVerticeAnglesParams.altitudeMin,//Минимальная граница широты окружности
//						altitudeMax = randomVerticeAnglesParams.altitudeMax,//Максимальная граница широты окружности
						altitudeStep = randomVerticeAnglesParams.altitudeStep,//Ширина широты окружности
						altitudeMid = randomVerticeAnglesParams.altitudeMid,//Средняя широта окружности
						sphereAnglesCount = randomVerticeAnglesParams.sphereAnglesCount;
					//console.log('altitude = ' + altitude + ', altitudePrev = ' + altitudePrev + ', sphereAnglesCount = ' + sphereAnglesCount);
					//console.log('boFirstOrLastCircle = ' + (boSouthernSphere || boNorthernSphere) + ', latitude = ' + latitude + ', altitudeMin = ' + altitudeMin + ', altitudeMax = ' + altitudeMax);
					altitudePrev = altitude; 
/*					
					for (let angleId = 0; angleId < sphereAnglesCount; angleId++) {

						if (boAllocateMemory) params.verticesAngles.push(this.ZeroArray());
						else {//edit memory

							const rotated = getRandomVerticeAngles(altitude, altitudeStep, altitudeMid, sphereAnglesCount, angleStep1, angleId);
							params.verticesAngles[this.circlesPointsCount] = rotated;
							this.circlesPointsCount++;
							
						}
			
					}
*/					
					
				}
				delete params.random;
				delete params.b;
				
			};

		if (!arraySpheres) {//не выделять this.verticesAngles если нужно вычислить одну случайную точку randomVerticeSettings.mode = randomVerticeSettings.modes.randomVertice = 1
			
			//Allocate this.verticesAngles memory
			params.boAllocateMemory = true;
			verticesAngles(params.boAllocateMemory);
			delete params.boAllocateMemory;

		}
		
		let randomAngles;

		//overridden methods

		Object.defineProperty(this, 'angles', {
			
			get: () => { return randomAngles; },
			set: (anglesNew) => { randomAngles = anglesNew; },
			
		});
		
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
//						verticeId += sphere.randomCloudSphere.sphereAnglesCount;
						if (verticeId >= randomVerticeId) {
	
							//случайная вершина находится на текущей сфере.

							params.altitude = sphere.altitude;
							sphere.cloudSphere.getRandomAngle(randomVerticeId - verticeIdPrev);
							delete params.altitude;
//							return this.verticesAngles;
							return params.verticesAngles;
							
						}
	
					}
					console.error(sRandomVerticesHyperSphere + ': get randomAngles. rotated was not found.');

				} else {
					
					this.angles = this.verticesAngles;
					return this.angles;

				}
				
			},
			set: (anglesNew) => {},
			
		});
		
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
			if (boInitRandomAngles)
				this.randomAngles;//Вычислить случайную точку если нужна одна случайная точка т.е. randomVerticeSettings.mode = randomVerticeSettings.modes.randomVertice = 1 или randomVerticeSettings.mode = randomVerticeSettings.modes.randomCloud = 2
			
		} else verticesAngles(false);//Вычислить облако случайных точек

	}
	
	//overridden methods
	
	ZeroArray() { return [0, 0, 0]; }
	Center(params) {
	
		Vertice(params.vertice);
		Vertice(params.oppositeVertice);
		
	}
	
	/////////////////////////////overridden methods

}
const Vertice = (vertice, altitude) => {

	if (vertice.longitude != undefined) return;
	while (vertice.length < 3)
		vertice.unshift((vertice.length === 2) && (altitude != undefined) ? altitude : 0);
//		vertice.push(0);
	Object.defineProperty(vertice, 'longitude', {
		
		get: () => { return vertice[2]; },
		set: (longitude) => {

			if (vertice[2] === longitude) return true;
			vertice[2] = longitude;
			return true;

		},
	
	});
	Object.defineProperty(vertice, 'latitude', {
		
		get: () => { return vertice[1]; },
		set: (latitude) => {

			if (vertice[1] === latitude) return true;
			vertice[1] = latitude;
			return true;

		},
	
	});
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
RandomVerticeHyperSphere.Vertice = Vertice;
export default RandomVerticeHyperSphere;
