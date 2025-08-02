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

//const sRandomCloudSphere = 'RandomCloudSphere';
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
//			circlesCount = anglesIdMax / 2,//количество окружностей
			angleStep = (anglesRange.longitude.max - anglesRange.longitude.min) / anglesIdMax,//угол между соседними точками на окружности, расположенной на экваторе
			cos = Math.cos, round = Math.round, random = Math.random,//hStep = 2 / circlesCount, asin = Math.asin, sqrt = Math.sqrt, cos = Math.cos,
			randomVertice = new RandomVertice(params);
		
		//overridden methods

		
		Object.defineProperty(this, 'randomAngles', {
			
			get: () => {

				//Сфера состоит из набора окружностей.
				for(let latitude = anglesRange.latitude.min; latitude <= anglesRange.latitude.max; latitude += angleStep) {

					//Количество точек на текущей окружности равно длинну окружности поделить на угол между соседними точками на окружности, расположенной на экваторе
					const circleAnglesCount = round(//найти ближайшее целое число
							cos(latitude) *//радиус текущей окружности
							2 * π / //длинна текущей окружности
							angleStep//угол между соседними точками на окружности, расположенной на экваторе
						),
						angleStep1 = 1 / circleAnglesCount,
						boSouthernCircle = latitude - angleStep < anglesRange.latitude.min,
						boNorthernCircle = latitude + angleStep > anglesRange.latitude.max,
						latitudeMin = boSouthernCircle ? latitude : (angleStep * (0 - 0.5) + latitude),//Минимальная граница широты окружности
						latitudeMax = boNorthernCircle ? latitude : (angleStep * (1 - 0.5) + latitude),//Максимальная граница широты окружности
						latitudeStep = latitudeMax - latitudeMin,//Ширина широты окружности
						latitudeMid = latitudeMin + latitudeStep / 2;//Средняя широта окружности
					//console.log('boFirstOrLastCircle = ' + (boSouthernCircle || boNorthernCircle) + ', latitude = ' + latitude + ', latitudeMin = ' + latitudeMin + ', latitudeMax = ' + latitudeMax);
					
					for (let angleId = 0; angleId <= circleAnglesCount; angleId++) {

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
				
			},
			
			set: (anglesNew) => { verticesAngles = anglesNew; },
			
		});
		
		/////////////////////////////overridden methods

		this.randomAngles;
		
	}

}
export default RandomCloudSphere;
