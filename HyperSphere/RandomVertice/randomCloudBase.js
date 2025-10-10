/**
 * @module RandomCloudBase
 * @description Generates a cloud of the random vertices around opposite vertice. Base class for RandomCloudSphere and RandomCloudHSphere
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

//import getHyperSphere from './getHyperSphere.js'
import RandomCloud from './randomCloud.js';


//const sRandomCloudBase = 'RandomCloudBase',
//	sOver = ': Please, override %s method in your ' + sRandomCloudBase + ' child class.';
/**
 * Generates a cloud of the random vertices around opposite vertice. Base class for RandomCloudSphere and RandomCloudHSphere
 * @class
 */
class RandomCloudBase extends RandomCloud {

	/**
	 * Generates a cloud of the random vertices around opposite vertice. Base class for RandomCloudSphere and RandomCloudHSphere
	 * @param {object} params See the <b>params</b> of the <a href="./module-RandomVertice-RandomVertice.html" target="_blank"><b>RandomVertice</b></a> constructor for details.
	 * @param {boolean} boCloud true - generates a random vertice cloud.
	 */
	constructor(params, boCloud) {

		super(params);
		this.circlesPointsCount = 750;//количество точек в облаке
		let boAllocateMemory = false;
		const randomVertice = this.newRandomVertice(params, boCloud);
		Object.defineProperty(this, 'randomAngles', {
			
			get: () => {

				this.verticesAngles(params, randomVertice, boAllocateMemory);
				return params.verticesAngles;
				
			},
			
			set: (anglesNew) => { verticesAngles = anglesNew; },
			
		});
		this.getRandomAngle = (randomVerticeId) => { return randomVertice.getRandomAngle(randomVerticeId); }
		if (params.hyperSphere) {

			//Этот экземпляр RandomCloudSphereBase вызывается из RandomVerticeHyperSphere когда создается гиперсфера. Гиперсфера состоит из набора сфер.
			//Для каждой сферы создается только массив RandomVerticeSphere.arrayCircles в котором хранятся парамерты отдельной окружности.
			//Сами окружности, которые хранятся в verticesAngles создавать не надо.
			
			Object.defineProperty(this, 'sphereAnglesCount', { get: () => {

				let sphereAnglesCount = 0;
				randomVertice.сirclesParams.forEach((circle) => { sphereAnglesCount += circle.circleAnglesCount; });
				return sphereAnglesCount;
			
			}, });
			
		} else {
			
			boAllocateMemory = true;
			this.randomAngles;
			boAllocateMemory = false;

		}
	}

}
export default RandomCloudBase;
