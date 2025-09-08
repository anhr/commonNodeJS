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
import anglesRange from '../anglesRange.js'
import * as utils from './utilsSphere.js'
import RandomCloud from './randomCloudSphere.js';

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
	 */
	constructor(params, boCloud = false) {

		super(params);

//		const arrayCircles = boCloud ? undefined : [];
		const arraySpheres = boCloud ? undefined : [];
			
		if (params.arc === undefined) Object.defineProperty(params, 'arc', {
	
				get: () => {

					if (params.boAllocateMemory) return π;//Выделяется память для облака точек. arc нужно сделать максимально возможным то есть вершины расположены друг против друга. В этом случае выделяется максимальный объем памяти.
					const vertice = params.vertice, oppositeVertice = params.oppositeVertice;

					/*
					gemini.google.com
					Вычислить центральный угол между двумя точками на поверхности 3-мерной гиперсферы. Координаты точек заданы в полярной системе координат в радианах. Начало координат широты находится на экваторе. Писать все формулы в одну строку.

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
					const calculateCentralAngle = (point1, point2) => {
					  const { latitude: lat1, longitude: lon1, altitude: alt1 } = point1;
					  const { latitude: lat2, longitude: lon2, altitude: alt2 } = point2;
					
					  const cosDelta = Math.cos(lat1) * Math.cos(lat2) * Math.cos(lon1 - lon2) * Math.cos(alt1 - alt2) + Math.sin(lat1) * Math.sin(lat2);
					
					  // Ограничиваем значение, чтобы избежать ошибок с плавающей точкой
					  const clampedCosDelta = Math.max(-1, Math.min(1, cosDelta));
					  
					  return Math.acos(clampedCosDelta);
					}
					const centralAngle = calculateCentralAngle(vertice, oppositeVertice);

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
										(rnd === 0) &&//Первая точка окружности
										(b === Infinity) ? //Противоположные вершины совпадают
											1 ://Если сюда не поставить 1, то angle = NaN
											rnd
								   ) * b)) /
							atan(b)//делим на tan(b), что бы при минимальном rnd = 0 и максимальном rnd = 1, p получалось -1 и 1
						) * 2 - 1//центр графика арктангенса сдвигаю вниз на -1
					) * π / 2//Умножаем на π/2 что бы при минимальном rnd = 0 и максимальном rnd = 1  углы попадали на полюса сферы т.е. широта получались от -π/2 до π/2.
							//Тем самым точки почти равномерно распределяются по окружности когда arc = π, тоесть вершина и противоположная вершина расположены на противоположных сторонах окружности
			
			if (isNaN(angle)) console.error(sRandomVerticesHyperSphere + '.anglesCircle: angle = ' + angle);
			return angle;
			
		}

		const randomCloud = new RandomCloud(params);
		
		const anglesIdMax = 50,//Количество точек на окружности, расположенной на экваторе
			circlesCount = (anglesIdMax / 2) + 1,//количество окружностей
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
							(circleAnglesCount > this.verticesAngles.length)
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
			getRandomVerticeAngles = (latitude, latitudeStep, latitudeMid, circleAnglesCount, angleStep1, angleId) => {
				
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

				//Сфера случайных точек состоит из набора окружностей.
				
				const arc = params.arc;
				this.circlesPointsCount = boAllocateMemory ? undefined : //Во время выделения памяти в массив this.verticesAngles добавляется новый item
					0;//в противном случае в массиве this.verticesAngles редактируется item с индексом this.circlesPointsCount
				let latitudePrev = 0;//широта предыдущей окружности
				for(let circleId = 0; circleId < circlesCount; circleId++){

					params.random = k * circleId;

					const latitude = this.latitude(utils),
						angleStep = abs(latitude - latitudePrev),//угол между соседними точками на окружности
						randomVerticeAnglesParams = getRandomVerticeAnglesParams(latitude, angleStep);
					latitudePrev = latitude; 
					if (arrayCircles && !boAllocateMemory) {

						const circleAnglesCount = randomVerticeAnglesParams.circleAnglesCount;
						arrayCircles.push({ latitude, angleStep, latitudeStep: randomVerticeAnglesParams.latitudeStep, latitudeMid: randomVerticeAnglesParams.latitudeMid, circleAnglesCount });
						this.circlesPointsCount += circleAnglesCount;
						continue;

					}
					const angleStep1 = randomVerticeAnglesParams.angleStep1,
						boSouthernCircle = randomVerticeAnglesParams.boSouthernCircle,
						boNorthernCircle = randomVerticeAnglesParams.boNorthernCircle,
						latitudeMin = randomVerticeAnglesParams.latitudeMin,//Минимальная граница широты окружности
						latitudeMax = randomVerticeAnglesParams.latitudeMax,//Максимальная граница широты окружности
						latitudeStep = randomVerticeAnglesParams.latitudeStep,//Ширина широты окружности
						latitudeMid = randomVerticeAnglesParams.latitudeMid,//Средняя широта окружности
						circleAnglesCount = randomVerticeAnglesParams.circleAnglesCount;
					//console.log('latitude = ' + latitude + ', latitudePrev = ' + latitudePrev + ', circleAnglesCount = ' + circleAnglesCount);
					//console.log('boFirstOrLastCircle = ' + (boSouthernCircle || boNorthernCircle) + ', latitude = ' + latitude + ', latitudeMin = ' + latitudeMin + ', latitudeMax = ' + latitudeMax);
					
					for (let angleId = 0; angleId < circleAnglesCount; angleId++) {

						if (boAllocateMemory) this.verticesAngles.push(this.ZeroArray());//allocate memory
						else {//edit memory

							const rotated = getRandomVerticeAngles(latitude, latitudeStep, latitudeMid, circleAnglesCount, angleStep1, angleId);
							this.verticesAngles[this.circlesPointsCount] = rotated;
							this.circlesPointsCount++;
							
						}
			
					}
					
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
					
					let verticeId = 0;
					for (let circleId = 0; circleId < arraySpheres.length; circleId++) {
	
						const circle = arraySpheres[circleId];
						verticeId += circle.circleAnglesCount;
						if (verticeId >= randomVerticeId) {
	
							//случайная вершина находится на текущей окружности.
							const randomVerticeAnglesParams = getRandomVerticeAnglesParams(circle.latitude, circle.angleStep),
								rotated = getRandomVerticeAngles(circle.latitude, circle.latitudeStep, circle.latitudeMid, circle.circleAnglesCount, randomVerticeAnglesParams.angleStep1, randomVerticeId - (verticeId - circle.circleAnglesCount));//verticeId - randomVerticeId);
							if (randomAngles) {
								
								this.angles[0] = rotated;
								//randomAngles[0] = rotated;
								
							}else randomAngles = [rotated];
							return this.angles;
							
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

		if (arraySpheres) this.randomAngles;//Вычислить случайную точку если нужна одна случайная точка т.е. randomVerticeSettings.mode = randomVerticeSettings.modes.randomVertice = 1
		else verticesAngles(false);//Вычислить облако случайных точек

	}
	
	//overridden methods
	
	ZeroArray() { return [0, 0, 0]; }
	Center(params) {
	
		Vertice(params.vertice);
		Vertice(params.oppositeVertice);
		
	}
	
	/////////////////////////////overridden methods

}
const Vertice = (vertice) => {

	if (vertice.longitude != undefined) return;
	while (vertice.length < 3) vertice.push(0);
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
