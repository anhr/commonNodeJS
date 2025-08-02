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

		const anglesIdMax = 200,//Количество точек на окружности, расположенной на экваторе
			circlesCount = anglesIdMax / 2,//количество окружностей
			angleStep = (anglesRange.longitude.max - anglesRange.longitude.min) / anglesIdMax,//угол между соседними точками на окружности, расположенной на экваторе
			cos = Math.cos, round = Math.round,//hStep = 2 / circlesCount, asin = Math.asin, sqrt = Math.sqrt, cos = Math.cos,
			randomVertice = new RandomVertice(params);
		
		//overridden methods

		
		Object.defineProperty(this, 'randomAngles', {
			
			get: () => {

				//Сфера состоит из набора окружностей.
				for(let latitude = anglesRange.latitude.min; latitude <= anglesRange.latitude.max; latitude += angleStep) {

					const circleRadius = cos(latitude);//радиус текущей окружности
					const circleAnglesCount = round(circleRadius * 2 * π / angleStep);//количество точек на текущей окружности равно длинну окружности поделить на угол между соседними точками на окружности, расположенной на экваторе
					for (let angleId = 0; angleId <= circleAnglesCount; angleId++) {

/*						
						const random = params.debug && params.debug.notRandomVertices ? (circleAnglesCount === 0 ? 0 : (1 / circleAnglesCount) * angleId) : undefined;//для замены случайной точки на регулярную
						const randomVerticeAngles = [latitude, utils.normalizeAngle(((random === undefined ? Math.random() : random) - 0.5) * π * 2)];
*/						
						const randomVerticeAngles = [latitude, utils.normalizeAngle(((params.debug && params.debug.notRandomVertices ? (circleAnglesCount === 0 ? 0 : (1 / circleAnglesCount) * angleId) : Math.random()) - 0.5) * π * 2)];
						this.verticesAngles.push(randomVerticeAngles);
			
					}
					
				}
//				delete params.latitude;
				
			},
			
			set: (anglesNew) => { verticesAngles = anglesNew; },
			
		});
		
		/////////////////////////////overridden methods

		this.randomAngles;
		
	}

}
export default RandomCloudSphere;
