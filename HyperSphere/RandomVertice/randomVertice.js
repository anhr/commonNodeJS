/**
 * @module RandomVertice
 * @description Generates random angles between a vertice and its opposite vertice.
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

import getHyperSphere from './getHyperSphere.js'
//import anglesRange from '../anglesRange.js'
//import * as utils from '../utilsHSphere.js'

const sRandomVertice = 'RandomVertice',
	sOver = ': Please, override %s method in your ' + sRandomVertice + ' child class.',
	π = Math.PI, random = Math.random, acos = Math.acos;
/**
 * Generates random angles between a vertice and its opposite vertice.
 * @class
 */
class RandomVertice {

	 //* @param {boolean} boCloud=false true - generates a random vertice cloud.
	/**
	 * Generates random angles between a vertice and its opposite vertice.
	 * @param {object} [params={}] The following parameters are available.
	 * @param {Array} [params.vertice=[0, 0, 0]] First vertice of the arc between two vertices.
	 * @param {Array} [params.oppositeVertice=[0, 0, 0]] Second vertice of the arc between two vertices.
	 * @param {object} [params.debug] Debug mode.
	 * @param {object} [params.debug.notRandomVertices] true - replacing random vertices with strictly defined vertices.
	 * @param {number} [verticesCount=1] count of vertices in the random vertices cloud.
	 */
	constructor(params={}, verticesCount = 1) {

//		params.vertice ||= this.ZeroArray();
		if (params.arc === undefined) params.arc = 0;
			
		if (!params.boArcIsdefined) {

			params.boArcIsdefined = true;
			let arc = params.arc;
			Object.defineProperty(params, 'arc', {
	
				get: () => { return arc; },
				set: (arcNew) => {
		
					if (arc === undefined) console.error(sRandomVertice + ': set params.arc. Invalid arc = ' + arc);
					else arc = arcNew;
					this.verticesAngles(true);
					return true;
		
				},
		
			});

		}
		
		params.oppositeVertice ||= this.ZeroArray();

		const _this = this;

		const setVertice = (vertice, name, value) => {
			
			vertice[name] = value;
			switch (name) {

				case 'altitude':
				case 'latitude':
				case 'longitude':
					_this.paramsVerticeOnChange();
					break;
					
			}
			
		}
/*		
		params.vertice = new Proxy( params.vertice, {

			set: (vertice, name, value) => {

				setVertice(vertice, name, value);
				return true;
	
			},
			
		});
*/			
		params.oppositeVertice = new Proxy( params.oppositeVertice, {

			set: (oppositeVertice, name, value) => {

				setVertice(oppositeVertice, name, value);
				return true;
	
			},
			
		});
		
		if (params.verticesAngles && !params.verticesAngles.boNoNew) params.verticesAngles.length = 0;
		params.verticesAngles ||= [];
		
		this.Center(params);
		Object.defineProperty(this, 'angles', {
			
			get: () => { return this.getAngles(); },
			set: (anglesNew) => { this.setAngles(anglesNew); },
			
		});
		Object.defineProperty(this, 'randomAngles', {

			get: () => { return this.getRandomAngles(); },
			set: (anglesNew) => { },

		});
		this.paramsVerticeOnChange = () => { this.verticesAngles(true); }
/*
		this.getRandomAngles = (point, startingPointParams) => {

			if (!this.navigator) createHyperSphereNavigator();

			// Правильное распределение для равномерного покрытия:
			// Вероятность попасть в сферическую шапочку радиуса d пропорциональна sin^3(d/R)
			const distance = this.navigator.R * this.navigator.inverseCDF_S3(random()) / (1 + 100 * random()); // см. объяснение ниже

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
				distance,//distance максимальная дистанция находится на противоположной стороне гиперсферы
				point ? point.iEta : acos(2 * random() - 1),//eta. первый угол направления (полярный угол). 0 ≤ eta ≤ π
				(point ? point.iPsi : random()) * 2 * π//psi. второй угол направления (азимутальный угол). 0 ≤ psi < 2π или -π ≤ psi ≤ π
			);
//			const angles = this.resultAngles(result);
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
		const createHyperSphereNavigator = () => {

			const classSettings = params.classSettings,
				settings = classSettings.settings,
				radius = classSettings.overriddenProperties.r(settings.guiPoints ? settings.guiPoints.timeId : settings.options.player === false ? 0 : settings.options.player.getTimeId());
			this.navigator = new HyperSphereNavigator(radius);

		}
*/
		this.verticesAngles = (editAngles = false) => {

//			createHyperSphereNavigator();

			const startingPointParams = this.navigator.startingPointParams();
//			for (let i = 0; i < (boCloud ? 750 : 1); i++)
			for (let i = 0; i < verticesCount; i++) {

				if (editAngles) params.editAnglesId = i;
				this.getRandomAngles(undefined, startingPointParams);

			}
			delete params.editAnglesId;

		};
		this.distance = (distance, R) => {
			
//			let arc = π - params.arc;
			let arc = params.arc;
			if (arc < 0) arc = 0;//Эта ошибка возникает потому что в GUI переменная arc округляется до 4 знаков
			
			/*Есть декартова система координат. Ось x обозначим как arc. Найди элементарную функцию которая неогранниченно растет в точке arc = 0 и равна нулю в точке arc = π.
			arc меняется только в диапазоне от 0 до π. arc это не угол.
			Написать код на javascript
			*/
			//https://chat.deepseek.com/a/chat/s/0b71542a-46a2-47e2-9888-f95f26f0fa37
			const y = 1 / arc - 1 / π;
//if (y < 0) console.log(y)
			
			return distance / (1 + (y * R * random()));
			
		}
		this.paramsVerticesAngles = (angles) => {
			
			if (params.editAnglesId === undefined) {
				
				params.verticesAngles.push(angles);
				params.pointsCount++;
				return;

			}
			params.verticesAngles[params.editAnglesId] = angles;
			params.verticesAngles.needsUpdate;
			
		}
		this.getAngles = () => { return params.verticesAngles; }
		this.setAngles = (anglesNew) => { params.verticesAngles = anglesNew; }
		
		//overridden methods

		this.navigator = { startingPointParams: () => {}, }
		
		/////////////////////////////overridden methods

	}
	circlesPointsCount;
//	arc(arc) { return π - arc; }
	
	//overridden methods
	
	get angles() { console.error(sRandomCloud + sOver.replace('%s', 'get angles')) }
	get randomAngles() { console.error(sRandomCloud + sOver.replace('%s', 'get randomAngles')) }
	getHyperSphere(classSettings, scene, middleVerticeColor) {
		
		const debug = {
					
				probabilityDensity: false,
				middleVertice: false,
				log: false,
				
			},
			settings = classSettings.settings,
			options = settings.options;
		return getHyperSphere(
			this.HyperSphere,
			options,
			scene,
			this,
			{
				
				debug: debug,
				r: classSettings.overriddenProperties.r(settings.guiPoints ? settings.guiPoints.timeId : options.player ? options.player.getTimeId() : 0),
				name: 'Random Cloud'
				
			});
	
	}
	
	/////////////////////////////overridden methods

}
export default RandomVertice;
