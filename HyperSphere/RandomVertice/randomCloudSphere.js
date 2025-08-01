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

		const anglesIdMax = 20,//Количество точек на окружности, расположенной на экваторе
			circlesCount = anglesIdMax / 2,//количество окружностей
			angleStep = (anglesRange.longitude.max - anglesRange.longitude.min) / anglesIdMax,//угол между соседними точками на окружности, расположенной на экваторе
			cos = Math.cos, round = Math.round,//hStep = 2 / circlesCount, asin = Math.asin, sqrt = Math.sqrt, cos = Math.cos,
			randomVertice = new RandomVertice(params);
		
		//overridden methods

		
		Object.defineProperty(this, 'randomAngles', {
			
			get: () => {

				//Сфера состоит из набора окружностей.
				//Каждая окружность находится на расстоянии h от центра сферы
				const anglesCircle = (circleAnglesCount) => {

//						const boUpdate = this.verticesAngles.length === 0 ? false : true;
					const boUpdate = false;
/*			
					//что бы не делать повторяющихся вычислений
					params.b = utils.b(params);
*/					
					const angleCircle = () => {
						
						const random = (params.random === undefined ? Math.random() : params.random) - 0.5;
/*							
							b = params.b ? params.b : utils.b(params),
							p = (
								tan(random * b) /
								tan(0.5 * b)//делим на tan(0.5 * b), что бы при минимальном и максимальном random, p получалось -1 и 1
							) *
							π;//Умножаем на π что бы при минимальном и максимальном r углы получались на противоположной от params.oppositeVertice.longitude стороне окружности.
								//Тем самым точки почти равномерно распределяются по окружности когда arc = π, тоесть вершина и противоположная вершина расположены на противоположных сторонах окружности
						
						let angle = p;// + params.oppositeVertice.longitude;
*/
						let angle = random * π * 2;
						
						angle = utils.normalizeAngle(angle);
						return angle;
						
					}
					
					const getRandomAngles = () => {

//							const randomAngles = [[params.latitude != undefined ? params.latitude : 0, this.anglesCircle(utils)]];
						const randomAngles = [[params.latitude != undefined ? params.latitude : 0, angleCircle()]];
						return randomAngles[0];
						
					}
					
					for (let angleId = 0; angleId <= circleAnglesCount; angleId++) {
			
						if (params.debug && params.debug.notRandomVertices) params.random = circleAnglesCount === 0 ? 0 : (1 / circleAnglesCount) * angleId;//для замены случайной точки на регулярную
						
//							const randomVerticeAngles = randomVertice.randomAngles;
						const randomVerticeAngles = getRandomAngles();
						if (boUpdate) this.verticesAngles[i] = randomVerticeAngles;
						else this.verticesAngles.push(randomVerticeAngles);
			
					}
					delete params.random;
					delete params.b;
//						return this.verticesAngles;
					
				};
/*				
				for(let h = -1; h <= 1; h += hStep) {

					params.latitude = asin(h);
//					this.anglesCircle(anglesIdMax, randomVertice, utils);
//					const circleRadius = cos(params.latitude);
					const circleRadius = sqrt(1 - h * h);
					anglesCircle(parseInt(circleRadius * 2 * π / hStep));
					
				}
*/				
				for(params.latitude = anglesRange.latitude.min; params.latitude <= anglesRange.latitude.max; params.latitude += angleStep) {

					const circleRadius = cos(params.latitude);//радиус текущей окружности
					anglesCircle(round(circleRadius * 2 * π / angleStep));//количество точек на текущей окружности равно длинну окружности поделить на угол между соседними точками на окружности, расположенной на экваторе
					
				}
				delete params.latitude;
/*				
params.latitude = 1;
				return this.anglesCircle(anglesIdMax, randomVertice, utils);
*/				
				
			},
			
			set: (anglesNew) => { verticesAngles = anglesNew; },
			
		});
		
		/////////////////////////////overridden methods

		this.randomAngles;
		
	}

}
export default RandomCloudSphere;
