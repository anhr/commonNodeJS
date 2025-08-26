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

//import RandomVertice from './randomVertice.js';
import RandomVertice from './randomVerticeV2.js';
import anglesRange from '../anglesRange.js'
import * as utils from './utilsSphere.js'
//import * as utilsCircle from './utilsCircle.js'

const sRandomVerticesSphere = 'RandomVerticesSphere',
	π = Math.PI, abs = Math.abs, round = Math.round, random = Math.random,
	sin = Math.sin, asin = Math.asin, cos = Math.cos, tan = Math.tan, atan = Math.atan, atan2 = Math.atan2,
	range = anglesRange.longitude.range;

/**
 * Generates a random vertice near the opposite vertice in 2D hypersphere.
 * @class
 * @extends RandomVertice
 */
class RandomVerticeSphere extends RandomVertice {

	/**
	 * Generates a random vertice near the opposite vertice in 2D hypersphere.
	 * @param {object} [params={}] See the <b>params</b> of the <b>RandomVertice</b> constructor.
	 */
	constructor(params, randomVerticeSettings = {}) {

		super(params);

		const arrayCircles = (randomVerticeSettings.mode != undefined) && (randomVerticeSettings.mode === randomVerticeSettings.modes.randomVertice) ? [] : undefined;
			
		if (params.arc === undefined) Object.defineProperty(params, 'arc', {
	
				get: () => {

					if (params.boAllocateMemory) return π;//Выделяется память для облака точек. arc нужно сделать максимально возможным то есть вершины расположены друг против друга. В этом случае выделяется максимальный объем памяти.
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
					const θ = arccos(sin(ϕ1) * sin(ϕ2) + cos(ϕ1) * cos(ϕ2) * cos(λ1 - λ2));
					if (isNaN(θ)) console.error(sSphere + ': getArcAngle. Invalid θ = ' + θ);
					return θ;
				
				},
		
			});
		
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
		this.longitude = (utils) =>
		{

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
					) * π //Умножаем на π что бы при минимальном rnd = 0 и максимальном rnd = 1 долгота получались от -π до π.
							//Тем самым точки почти равномерно распределяются по окружности когда arc = π, тоесть вершина и противоположная вершина расположены на противоположных сторонах окружности
			
			if (isNaN(angle)) console.error(sRandomVerticesSphere + '.anglesCircle: angle = ' + angle);
			return angle;
			
		}
		
		const anglesIdMax = 50,//Количество точек на окружности, расположенной на экваторе
			circlesCount = (anglesIdMax / 2) + 1,//количество окружностей
			k = 1 / (circlesCount - 1),//for params.random = k * circleId;
/*			
			sin = Math.sin, cos = Math.cos, asin = Math.asin, atan = Math.atan, atan2 = Math.atan2,
			round = Math.round, random = Math.random, abs = Math.abs,
			range = anglesRange.latitude.range,// latitudeMax = anglesRange.latitude.max, latitudeMin = anglesRange.latitude.min,
*/			
//			randomVertice = new RandomVerticeV3(params),
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
					γ = params.oppositeVertice.longitude - π / 2;
				return rotatePointWithEulerAngles(initialLatitude, initialLongitude, α, β, γ);
				
			},
			verticesAngles = (boAllocateMemory) => {

				//Сфера случайных точек состоит из набора окружностей.
				
/*				
				const arc = boAllocateMemory ?
					π ://Когда выделяется память для облака случайных точек (boAllocateMemory = true), надо сделать максимальное расстояние между вершинами (arc = π).
						//В этом случае размер выделяемой памяти будет максимальным
					params.arc;
*/					
				const arc = params.arc;
				this.circlesPointsCount = boAllocateMemory ? undefined : //Во время выделения памяти в массив this.verticesAngles добавляется новый item
					0;//в противном случае в массиве this.verticesAngles редактируется item с индексом this.circlesPointsCount
				let latitudePrev = 0;//широта предыдущей окружности
				for(let circleId = 0; circleId < circlesCount; circleId++){

					params.random = k * circleId;

//					const latitude = randomVertice.randomAngles.latitude,
					const latitude = this.latitude(utils),
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
					if (arrayCircles && !boAllocateMemory) arrayCircles.push({latitude: latitude, latitudeStep: latitudeStep, latitudeMid: latitudeMid, circleAnglesCount, circleAnglesCount, angleStep1: angleStep1});
					if (!boAllocateMemory && (circleAnglesCount > this.verticesAngles.length))
						circleAnglesCount = 1;//когда длинна дуги приближается к нулю, тоесть вершины совпадают, то angleStep стремится к нулю и circleAnglesCount стремится к бесконечности и массив this.verticesAngles переполняется.
												//Делаем один угол в окружности
					//console.log('latitude = ' + latitude + ', latitudePrev = ' + latitudePrev + ', circleAnglesCount = ' + circleAnglesCount);
					latitudePrev = latitude; 
					//console.log('boFirstOrLastCircle = ' + (boSouthernCircle || boNorthernCircle) + ', latitude = ' + latitude + ', latitudeMin = ' + latitudeMin + ', latitudeMax = ' + latitudeMax);
					
					for (let angleId = 0; angleId < circleAnglesCount; angleId++) {

//						if (this.circlesPointsCount === undefined) this.verticesAngles.push(this.ZeroArray());//allocate memory
						if (boAllocateMemory) this.verticesAngles.push(this.ZeroArray());//allocate memory
						else {//edit memory

							//getRandomVerticeAngles();
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
				delete params.random;
				delete params.b;
				
			};

		//Allocate this.verticesAngles memory
		params.boAllocateMemory = true;
		verticesAngles(params.boAllocateMemory);
		delete params.boAllocateMemory;
		
		let randomAngles;

		//overridden methods

		Object.defineProperty(this, 'angles', {
			
			get: () => { return randomAngles; },
			set: (anglesNew) => { randomAngles = anglesNew; },
			
		});
		
		Object.defineProperty(this, 'randomAngles', {
			
			get: () => {

				verticesAngles(false);
//				randomAngles = [[params.latitude != undefined ? params.latitude : this.latitude(utils), this.longitude(utils)]];
				const randomVerticeId = round(random() * (this.circlesPointsCount - 1));
//const randomVerticeId = 1;
				randomAngles = [this.verticesAngles[randomVerticeId]];
				const angles = randomAngles[0];

				if (arrayCircles) {
					
					let verticeId = 0;
					for (let circleId = 0; circleId < arrayCircles.length; circleId++) {
	
						const circle = arrayCircles[circleId];
						verticeId += circle.circleAnglesCount;
						if (verticeId >= randomVerticeId) {
	
							//случайная вершина находится на текущей окружности.
							const rotated = getRandomVerticeAngles(circle.latitude, circle.latitudeStep, circle.latitudeMid, circle.circleAnglesCount, circle.angleStep1, randomVerticeId - (verticeId - circle.circleAnglesCount));//verticeId - randomVerticeId);
							if (params.debug.notRandomVertices && ((rotated[0] != angles[0]) || (rotated[1] != angles[1]))) console.error(sRandomVerticesSphere + ': get randomAngles. rotated != angles');
							return rotated;
							
						}
	
					}
					console.error(sRandomVerticesSphere + ': get randomAngles. rotated was not found.');

				}
				return angles;
				
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

		this.randomAngles;

	}
	
	//overridden methods
	
	ZeroArray() { return [0, 0]; }
	Center(params) {
	
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
		Vertice(params.vertice);
		Vertice(params.oppositeVertice);
		
	}
	
	/////////////////////////////overridden methods

}
export default RandomVerticeSphere;
