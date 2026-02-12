/**
 * @module RandomVerticeHSphere
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
import * as utils from '../utilsHSphere.js'
//import RandomCloudSphere from './randomCloudSphere.js';
//import getHyperSphere from './getHyperSphere.js'
import HyperSphere from '../hyperSphere3D.js';

const sRandomVerticesHyperSphere = 'RandomVerticesHSphere',
	π = Math.PI, round = Math.round, random = Math.random,//abs = Math.abs, 
	//cos = Math.cos, sin = Math.sin,
	atan = Math.atan, acos = Math.acos;// asin = Math.asin, atan2 = Math.atan2,

/**
 * Generates a random vertice near the opposite vertice in 3D hypersphere.
 * @class
 * @extends RandomVertice
 */
class RandomVerticeHSphere extends RandomVertice {

	// * @param {boolean} [boCloud=false] true - generates a random vertice cloud.
	
	/**
	 * Generates a random vertice near the opposite vertice in 3D hypersphere.
	 * @param {object} [params={}] See the <b>params</b> of the <a href="./module-RandomVertice-RandomVertice.html" target="_blank"><b>RandomVertice</b></a> constructor for details.
	 * @param {number} verticesCount count of vertices in the random vertices cloud.
	 */
	constructor(params, verticesCount/*, boRandomVertice = true*/) {

		super(params, verticesCount);
/*
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
*/		
		
		let randomAngles;

		/*
		Есть точка на поверхности 3-мерной гиперсферы встроенной в 4-мерное евклидово пространство в полярной системе координат.
		R - радиус гиперсферы. 
		Положение точки определено ее углами:
		latitude - широта в диапазоне от -π/2 до π/2.
		longitude - долгота в диапазоне от -π до π.
		altitude - высота в диапазоне от 0 до π.
		Начало координат находится в центре гиперсферы. Вычислить другую точку на гиперсфере, которая находится на определенном растоянии и под определенными углами от заданной точки.
		*/
		//https://chat.deepseek.com/a/chat/s/de1d7524-faab-4e09-bb49-2be8848ae401

		class HyperSphereNavigator {
			constructor(radius = 1.0) {
				this.R = radius;
			}

			// 1. Преобразование углов в декартовы координаты на гиперсфере
			anglesToCartesian(latitude, longitude, altitude) {
				const a = altitude;                 // altitude ∈ [0, π]
				const b = Math.PI / 2 - latitude;     // b ∈ [0, π]
				const c = longitude;                // longitude ∈ [-π, π]

				const x1 = this.R * Math.cos(a);
				const x2 = this.R * Math.sin(a) * Math.cos(b);
				const x3 = this.R * Math.sin(a) * Math.sin(b) * Math.cos(c);
				const x4 = this.R * Math.sin(a) * Math.sin(b) * Math.sin(c);

				return [x1, x2, x3, x4];
			}

			// 2. Создание ортонормированного базиса в касательном пространстве
			createTangentBasis(latitude, longitude, altitude) {
				const a = altitude;
				const b = Math.PI / 2 - latitude;
				const c = longitude;

				// e1 - направление увеличения altitude
				const e1 = [
					-Math.sin(a),
					Math.cos(a) * Math.cos(b),
					Math.cos(a) * Math.sin(b) * Math.cos(c),
					Math.cos(a) * Math.sin(b) * Math.sin(c)
				];
				// Нормализация e1 (уже единичный, но для точности)
				const norm_e1 = Math.sqrt(e1.reduce((sum, val) => sum + val * val, 0));
				const e1_norm = e1.map(v => v / norm_e1);

				// e2 - направление увеличения b (уменьшения latitude)
				const e2_raw = [
					0,
					-Math.sin(a) * Math.sin(b),
					Math.sin(a) * Math.cos(b) * Math.cos(c),
					Math.sin(a) * Math.cos(b) * Math.sin(c)
				];
				const norm_e2 = Math.sqrt(e2_raw.reduce((sum, val) => sum + val * val, 0));
				const e2_norm = norm_e2 > 1e-10 ? e2_raw.map(v => v / norm_e2) : [0, 0, 0, 0];

				// e3 - направление увеличения longitude
				const e3_raw = [
					0,
					0,
					-Math.sin(a) * Math.sin(b) * Math.sin(c),
					Math.sin(a) * Math.sin(b) * Math.cos(c)
				];
				const norm_e3 = Math.sqrt(e3_raw.reduce((sum, val) => sum + val * val, 0));
				const e3_norm = norm_e3 > 1e-10 ? e3_raw.map(v => v / norm_e3) : [0, 0, 0, 0];

				return [e1_norm, e2_norm, e3_norm];
			}

			/**
			 * Обратная функция распределения для равномерной выборки на S³
			 * Для равномерного распределения на 3-сфере от северного полюса:
			 * Плотность: f(θ) ∝ sin³(θ), где θ = distance/R
			 * CDF: F(θ) = (3θ - 3sinθcosθ + 2sin³θ) / 4
			 * Здесь используем численное решение обратной функции
			 */
			inverseCDF_S3(u) {
				// u ∈ [0, 1] равномерно
				// Ищем θ такой, что CDF(θ) = u, θ ∈ [0, π]

				// Численное решение методом бисекции
				let low = 0;
				let high = Math.PI;
				const tolerance = 1e-10;
				const maxIterations = 100;

				for (let i = 0; i < maxIterations; i++) {
					const mid = (low + high) / 2;
					const cdfValue = this.CDF_S3(mid);

					if (Math.abs(cdfValue - u) < tolerance) {
						return mid;
					}

					if (cdfValue < u) {
						low = mid;
					} else {
						high = mid;
					}
				}

				return (low + high) / 2;
			}

			/**
			 * Функция распределения (CDF) для расстояния на S³
			 */
			CDF_S3(theta) {
				// CDF(θ) = (3θ - 3sinθcosθ + 2sin³θ) / 4
				const sinTheta = Math.sin(theta);
				const cosTheta = Math.cos(theta);
				const sin3Theta = sinTheta * sinTheta * sinTheta;

				return (3 * theta - 3 * sinTheta * cosTheta + 2 * sin3Theta) / 4;
			}

			startingPointParams() {

				const oppositeVertice = params.oppositeVertice,
					lat = oppositeVertice.latitude, lon = oppositeVertice.longitude, alt = oppositeVertice.altitude;
/*				
				if (alt === undefined) alt = anglesRange.altitude.range / 2;
				if (lon === undefined) console.error('startingPointParams: under constraction');
				if (lat === undefined) console.error('startingPointParams: under constraction');
*/				

				// Исходная точка
				const P = this.anglesToCartesian(lat, lon, alt);

				// Касательный базис
				const [e1, e2, e3] = this.createTangentBasis(lat, lon, alt);

				return {

					lat: lat,
					alt: alt,
					P: P,
					e1: e1,
					e2: e2,
					e3: e3,

				}

			}

			/**
			 * Вычисление новой точки
			 * @param {object} startingPointParams see startingPointParams above.
			 * @param {any} distance геодезическое расстояние. Диапазон значений: 0 ≤ distance ≤ πR
			 * @param {any} eta первый угол направления (полярный угол). Определяет наклон направления движения относительно "вертикали" в касательном пространстве.
			 * Аналог "широты" направления или "угла места".
			 * Диапазон значений: 0 ≤ eta ≤ π
			 * @param {any} psi второй угол направления (азимутальный угол)
			 * Назначение:
			 * Определяет азимут направления движения в горизонтальной плоскости касательного пространства
			 * Задает вращение вокруг оси e1
			 * Диапазон значений:
			 * Необходимый и достаточный: 0 ≤ psi < 2π
			 * Но обычно достаточно: -π ≤ psi ≤ π (как в коде)
			 * @returns координаты новой точки в полярной системе координат
			 */
			calculateNewPoint(startingPointParams, distance, eta, psi) {
				// Исходная точка
				//		const P = this.anglesToCartesian(lat, lon, alt);
				const P = startingPointParams.P;

				// Касательный базис
				//		const [e1, e2, e3] = this.createTangentBasis(lat, lon, alt);
				const [e1, e2, e3] = [startingPointParams.e1, startingPointParams.e2, startingPointParams.e3];

				// Направляющий вектор в касательном пространстве
				const u = [0, 0, 0, 0];
				for (let i = 0; i < 4; i++) {
					u[i] = Math.cos(eta) * e1[i] +
						Math.sin(eta) * Math.cos(psi) * e2[i] +
						Math.sin(eta) * Math.sin(psi) * e3[i];
				}

				// Угловое расстояние
				const delta = distance / this.R;

				// Экспоненциальное отображение
				const Q = [0, 0, 0, 0];
				for (let i = 0; i < 4; i++) {
					Q[i] = Math.cos(delta) * P[i] + this.R * Math.sin(delta) * u[i];
				}

				// Обратное преобразование в углы
				const angles = this.cartesianToAngles(Q);

				if (Math.abs((Math.abs(startingPointParams.lat) - π / 2)) < 1e-12) angles.longitude = random() * 2 * π - π;//Противоположная вершина находится на полюсе
				return angles;
			}

			// 4. Преобразование декартовых координат в углы
			cartesianToAngles(Q) {
				const [q1, q2, q3, q4] = Q;

				// altitude
				let altitude = Math.acos(q1 / this.R);
				if (isNaN(altitude)) altitude = 0;

				// latitude и longitude
				let latitude, longitude;

				const sinA = Math.sin(altitude);
				if (Math.abs(sinA) < 1e-10) {
					// Случай полюса
					latitude = 0;
					longitude = 0;
				} else {
					// b'
					let b = Math.acos(q2 / (this.R * sinA));
					if (isNaN(b)) b = 0;

					latitude = Math.PI / 2 - b;

					// longitude
					longitude = Math.atan2(q4, q3);
				}

				// Приведение longitude к диапазону [-π, π]
				if (longitude > Math.PI) longitude -= 2 * Math.PI;
				if (longitude < -Math.PI) longitude += 2 * Math.PI;

				return {
					latitude,
					longitude,
					altitude,
					//cartesian: Q
				};
			}

			// 5. Вычисление расстояния между двумя точками на гиперсфере
			greatCircleDistance(lat1, lon1, alt1, lat2, lon2, alt2) {
				const P1 = this.anglesToCartesian(lat1, lon1, alt1);
				const P2 = this.anglesToCartesian(lat2, lon2, alt2);

				let dot = 0;
				for (let i = 0; i < 4; i++) {
					dot += P1[i] * P2[i];
				}
				dot /= (this.R * this.R);

				// Обеспечиваем численную стабильность
				dot = Math.max(-1, Math.min(1, dot));

				const angle = Math.acos(dot);
				return this.R * angle;
			}
		}

		//overridden methods
		
		this.navigator = new HyperSphereNavigator();
		this.getRandomAngles = (point, startingPointParams) => {

			// Правильное распределение для равномерного покрытия:
			// Вероятность попасть в сферическую шапочку радиуса d пропорциональна sin^3(d/R)
			const R = this.navigator.R, distance = this.distance(R * this.navigator.inverseCDF_S3(random()), R) * 2;

			if (!startingPointParams) startingPointParams = this.navigator.startingPointParams();
			const result = this.navigator.calculateNewPoint(
					startingPointParams,
					distance,//0.5,//random() * this.navigator.R * π,//distance максимальная дистанция находится на противоположной стороне гиперсферы
					point ? point.iEta : acos(2 * random() - 1),//eta. первый угол направления (полярный угол). 0 ≤ eta ≤ π
					(point ? point.iPsi : random()) * 2 * π//psi. второй угол направления (азимутальный угол). 0 ≤ psi < 2π или -π ≤ psi ≤ π
				);
			const angles = utils.angles([result.altitude, result.latitude, result.longitude]);
			this.paramsVerticesAngles(angles);
			return this.angles;
			
		}
		
		Object.defineProperty(this, 'cloud', {
			
			get: () => {

				verticesAngles(false);
				return this.verticesAngles;
				
			},
			
		});
		
		/////////////////////////////overridden methods

		params.pointsCount = 0;
		this.verticesAngles(false);

	}
	
	//overridden methods
	
	ZeroArray() { return [0, 0, 0]; }
	Center(params) { utils.angles(params.oppositeVertice); }
	get HyperSphere() { return HyperSphere; }
	
	/////////////////////////////overridden methods

}
export default RandomVerticeHSphere;
