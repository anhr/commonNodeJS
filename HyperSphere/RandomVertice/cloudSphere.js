/**
 * @module CloudSphere
 * @description Generates a cloud of vertices near the opposite vertice in 2D hypersphere.
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

//import RandomCloud from './randomCloud.js';
import Cloud from './cloud.js';
//import RandomVertice from './randomVerticeSphere.js';
import { RandomVerticeSphere as RandomVertice } from './randomVerticeSphere.js';
import * as utils from './utilsSphere.js'
import anglesRange from '../anglesRange.js'

const sCloudSphere = 'CloudSphere';
const π = Math.PI;

/**
 * Generates a cloud of vertices near the opposite vertice in 2D hypersphere.
 * @class
 * @extends Cloud
 */
class CloudSphere extends Cloud
{

	/**
	 * Generates a cloud of vertices near the opposite vertice in 2D hypersphere.
	 * @param {object} [params={}] See the <b>params</b> of the <a href="./module-RandomVertice-RandomVertice.html" target="_blank"><b>RandomVertice</b></a> constructor for details.
	 */
	constructor(params) {

		super(params);

		const randomVertice = new RandomVertice(params, true);
//		this.verticesAngles = randomVertice.cloud;
		Object.defineProperty(this, 'verticesAngles', {
			
			get: () => { return randomVertice.verticesAngles; },
			set: (anglesNew) => { randomVertice.verticesAngles = anglesNew; },
		
		});
		Object.defineProperty(this, 'circlesPointsCount', { get: () => { return randomVertice.circlesPointsCount; }, });
/*
		const anglesIdMax = 50,//Количество точек на окружности, расположенной на экваторе
			circlesCount = (anglesIdMax / 2) + 1,//количество окружностей
			k = 1 / (circlesCount - 1),//for params.random = k * circleId;
			sin = Math.sin, cos = Math.cos, asin = Math.asin, atan = Math.atan, atan2 = Math.atan2,
			round = Math.round, random = Math.random, abs = Math.abs,
			range = anglesRange.latitude.range,// latitudeMax = anglesRange.latitude.max, latitudeMin = anglesRange.latitude.min,
			randomVertice = new RandomVertice(params),
			verticesAngles = (boAllocateMemory) => {

				//Сфера случайных точек состоит из набора окружностей.
				
				const arc = params.arc;
				this.circlesPointsCount = boAllocateMemory ? undefined : //Во время выделения памяти в массив this.verticesAngles добавляется новый item
					0;//в противном случае в массиве this.verticesAngles редактируется item с индексом this.circlesPointsCount
				let latitudePrev = 0;//широта предыдущей окружности
				for(let circleId = 0; circleId < circlesCount; circleId++){

					params.random = k * circleId;

//					const latitude = randomVertice.anglesCircle(utils),
//					const latitude = randomVertice.randomAngles[1],
					const latitude = randomVertice.randomAngles.latitude,
						angleStep = abs(latitude - latitudePrev);//угол между соседними точками на окружности
//					if (angleStep === 0) continue;//широта окружности и предыдущей окружности совпадают
					//Количество точек на текущей окружности равно длинну окружности поделить на угол между соседними точками на окружности, расположенной на экваторе
					let circleAnglesCount = round(//найти ближайшее целое число
							cos(latitude) * //радиус текущей окружности
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
*/		
		
		//overridden methods

/*		
		Object.defineProperty(this, 'randomAngles', {
			
			get: () => {

				verticesAngles(false);
				return this.verticesAngles;
				
			},
			
			set: (anglesNew) => { verticesAngles = anglesNew; },
			
		});
*/
		Object.defineProperty(this, 'randomAngles', {
			
			get: () => {

				randomVertice.randomAngles;
				return randomVertice.angles;
/*				
				this.verticesAngles = randomVertice.cloud;
				return this.verticesAngles;
*/				
				
			},
			
		});
		
		/////////////////////////////overridden methods

		if (params.hyperSphere) {

			//Этот экземпляр CloudSphere вызывается из RandomVerticeHyperSphere когда создается гиперсфера. Гиперсфера состоит из набора сфер.
			
			Object.defineProperty(this, 'sphereAnglesCount', { get: () => { return randomVertice.circlesPointsCount }, });
			
		}
		
//		this.randomAngles;
		
	}

}
export default CloudSphere;
