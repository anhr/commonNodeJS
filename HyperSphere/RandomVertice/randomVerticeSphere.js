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

import RandomVertice from './randomVertice.js';
import * as utils from '../utilsSphere.js'
import HyperSphere from '../sphere.js';


const sRandomVerticesSphere = 'RandomVerticesSphere',
	π = Math.PI, round = Math.round, random = Math.random,// abs = Math.abs,
	cos = Math.cos;//, atan = Math.atan, sin = Math.sin, asin = Math.asin, tan = Math.tan, atan2 = Math.atan2;
export const anglesIdMax = 50;//Количество точек на окружности, расположенной на экваторе

/**
 * Generates a random vertice near the opposite vertice in 2D hypersphere.
 * @class
 * @extends RandomVertice
 */
export class RandomVerticeSphere extends RandomVertice {

	/**
	 * Generates a random vertice near the opposite vertice in 2D hypersphere.
	 * @param {object} [params={}] See the <b>params</b> of the <a href="./module-RandomVertice-RandomVertice.html" target="_blank"><b>RandomVertice</b></a> constructor for details.
	 * @param {object} [params.circlesCount] Count of the circles in the sphere.
	 * @param {number} verticesCount count of vertices in the random vertices cloud.
	 */
	constructor(params={}, verticesCount) {

		super(params, verticesCount);

		/*
Есть точка на поверхности сферы в полярной системе координат.
R - радиус сферы. 
Положение точки определено ее углами:
latitude - широта в диапазоне от -π/2 до π/2.
longitude - долгота в диапазоне от -π до π.
Начало координат находится в центре сферы. Вычислить координаты другой точки на сфере, которая находится на определенном растоянии и под определенным углом от заданной точки.
		*/
		//https://chat.deepseek.com/a/chat/s/e304455b-5714-4923-88f5-6ac9c6adee40
		/**
		 * Вычисляет точку на сфере, находящуюся на заданном расстоянии и азимуте от исходной точки
		 * @param {number} latA - Широта исходной точки в радианах [-π/2, π/2]
		 * @param {number} lonA - Долгота исходной точки в радианах [-π, π]
		 * @param {number} R - Радиус сферы
		 * @param {number} distance - Расстояние по поверхности сферы (в тех же единицах, что и R)
		 * @param {number} azimuth - Азимут (направление) в радианах, отсчитывается от севера по часовой стрелке [0, 2π]
		 * @returns {Object} Объект с координатами {lat, lon, x, y, z}
		 */
		const calculatePointOnSphere = (latA, lonA, R, distance, azimuth) => {
			if (distance > (2 * π * R)) console.error(sRandomVerticesSphere + '.calculatePointOnSphere. Invalid distance = ' + distance);
			// Обработка нулевого расстояния
			if (Math.abs(distance) < 1e-12) {
				return {
					lat: latA,
					lon: lonA,
				};
			}

			// Центральный угол
			const gamma = distance / R;

			// Обработка антиподной точки
			if (Math.abs(gamma - Math.PI) < 1e-12) {
				const latB = -latA;
				const lonB = lonA + Math.PI;
				// Нормализация долготы
				const normalizedLon = ((lonB + Math.PI) % (2 * Math.PI) - Math.PI);

				return {
					lat: latB,
					lon: normalizedLon,
				};
			}

			// Проверка на полюса
			const isNorthPole = Math.abs(latA - Math.PI / 2) < 1e-12;
			const isSouthPole = Math.abs(latA + Math.PI / 2) < 1e-12;

			// Если исходная точка на полюсе
			if (isNorthPole || isSouthPole) {
				
				return {
					
					lat: Math.asin(random() * 2 - 1),
					lon: random() * π * 2,//lonB,

				}

			}

			// Общий случай (не полюс)

			// Единичный вектор точки A
			const cosLatA = Math.cos(latA);
			const sinLatA = Math.sin(latA);
			const cosLonA = Math.cos(lonA);
			const sinLonA = Math.sin(lonA);

			const a_x = cosLatA * cosLonA;
			const a_y = cosLatA * sinLonA;
			const a_z = sinLatA;

			// Векторы севера и востока
			const N_x = -sinLatA * cosLonA;
			const N_y = -sinLatA * sinLonA;
			const N_z = cosLatA;

			const E_x = -sinLonA;
			const E_y = cosLonA;
			const E_z = 0;

			// Вектор направления D
			const cosAz = Math.cos(azimuth);
			const sinAz = Math.sin(azimuth);

			const D_x = cosAz * N_x + sinAz * E_x;
			const D_y = cosAz * N_y + sinAz * E_y;
			const D_z = cosAz * N_z + sinAz * E_z;

			// Единичный вектор точки B
			const cosGamma = Math.cos(gamma);
			const sinGamma = Math.sin(gamma);

			const b_x = cosGamma * a_x + sinGamma * D_x;
			const b_y = cosGamma * a_y + sinGamma * D_y;
			const b_z = cosGamma * a_z + sinGamma * D_z;

			// Декартовы координаты
			const xB = R * b_x;
			const yB = R * b_y;
			const zB = R * b_z;

			// Сферические координаты
			// Используем atan2 для численной устойчивости при малых значениях
			let latB, lonB;

			// Вычисление широты
			latB = Math.asin(b_z);

			// Вычисление долготы с обработкой сингулярностей
			const xyNorm = Math.sqrt(b_x * b_x + b_y * b_y);
			if (xyNorm < 1e-12) {
				// Точка близка к полюсу
				lonB = 0; // Произвольно выбираем 0
			} else {
				lonB = Math.atan2(b_y, b_x);
			}

			// Нормализация долготы в диапазон [-π, π]
			if (lonB > Math.PI) lonB -= 2 * Math.PI;
			if (lonB < -Math.PI) lonB += 2 * Math.PI;

			return {
				lat: latB,
				lon: lonB,
			};
		}


		//overridden methods

		this.getRandomAngles = () => {

			/*
Написать на javascript код, который будет использовать функцию calculatePointOnSphere для вычисления случайных точек на поверхности сферы, таким образом,
что бы эти случайные точки были равномерно распределены по поверхности сферы.
			*/
			//https://chat.deepseek.com/a/chat/s/e304455b-5714-4923-88f5-6ac9c6adee40

			/**
			* Метод 5: Использование calculatePointOnSphere для равномерного покрытия
			* с движением от полюсов и экватора
			*/

			const R = 1, TWO_PI = 2 * π, oppositeVertice = params.oppositeVertice;
			//strategy 3
			const distance = this.distance(Math.acos(1 - 2 * random()) * R, R);
			const result = calculatePointOnSphere(
				oppositeVertice.latitude,//Math.asin(2 * Math.random() - 1),//lat
				oppositeVertice.longitude,//Math.random() * TWO_PI - π,//lon
				R,
				distance,
				random() * TWO_PI//azimuth
			);
			const angles = utils.angles([result.lat, result.lon]);
			this.paramsVerticesAngles(angles);
			return this.angles;
			
		}
		
		/////////////////////////////overridden methods

		params.pointsCount = 0;
		this.verticesAngles(false);

	}
	
	//overridden methods
	
	ZeroArray() { return [0, 0]; }
	Center(params) { utils.angles(params.oppositeVertice); }
	get HyperSphere() { return HyperSphere; }
	
	/////////////////////////////overridden methods

}
