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
import anglesRange from '../anglesRange.js'
import * as utils from '../utilsHSphere.js'

const sRandomVertice = 'RandomVertice',
	sOver = ': Please, override %s method in your ' + sRandomVertice + ' child class.',
	π = Math.PI, random = Math.random, acos = Math.acos;
/**
 * Generates random angles between a vertice and its opposite vertice.
 * @class
 */
class RandomVertice {

	/**
	 * Generates random angles between a vertice and its opposite vertice.
	 * @param {object} [params={}] The following parameters are available.
	 * @param {Array} [params.vertice=[0, 0, 0]] First vertice of the arc between two vertices.
	 * @param {Array} [params.oppositeVertice=[0, 0, 0]] Second vertice of the arc between two vertices.
	 * @param {object} [params.debug] Debug mode.
	 * @param {object} [params.debug.notRandomVertices] true - replacing random vertices with strictly defined vertices.
	 * @param {boolean} boCloud=false true - generates a random vertice cloud.
	 */
	constructor(params={}, boCloud) {

if (boCloud === undefined) console.error('RandomVertice.constructor: under constraction')
	
		params.vertice ||= this.ZeroArray();
		params.oppositeVertice ||= this.ZeroArray();

		const _this = this;

		params.oppositeVertice = new Proxy( params.oppositeVertice, {

			set: (oppositeVertice, name, value) => {

				oppositeVertice[name] = value;
				switch (name) {
	
					case 'altitude':
					case 'latitude':
					case 'longitude':
						_this.oppositeVerticeOnChange();
						break;
						
				}
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
		this.oppositeVerticeOnChange = () => { this.verticesAngles(true); }
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
			const angles = this.resultAngles(result);
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
		this.verticesAngles = (editAngles = false) => {

			createHyperSphereNavigator();

			const oppositeVertice = params.oppositeVertice,
				startingPointParams = this.navigator.startingPointParams(
					oppositeVertice.latitude,
					oppositeVertice.longitude,
					oppositeVertice.altitude,
				);
			for (let i = 0; i < (boCloud ? 750 : 1); i++) {

				if (editAngles) params.editAnglesId = i;
				this.getRandomAngles(undefined, startingPointParams);

			}
			delete params.editAnglesId;

		};

		//overridden methods

		this.getAngles = () => { return params.verticesAngles; }
		this.setAngles = (anglesNew) => { params.verticesAngles = anglesNew; }
		
		/////////////////////////////overridden methods

	}
	circlesPointsCount;
	arc(arc) { return π - arc; }
	
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

	/**
	 * @param {any} lat
	 * @param {any} lon
	 * @param {any} alt
	*/
	startingPointParams(lat, lon, alt) {

		if (alt === undefined) alt = anglesRange.altitude.range / 2;
		if (lon === undefined) console.error('startingPointParams: under constraction');
		if (lat === undefined) console.error('startingPointParams: under constraction');
		
		// Исходная точка
		const P = this.anglesToCartesian(lat, lon, alt);

		// Касательный базис
		const [e1, e2, e3] = this.createTangentBasis(lat, lon, alt);

		return {

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
	 * @returns
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
		return this.cartesianToAngles(Q);
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
/*
// Примеры использования
function runExamples() {
	const navigator = new HyperSphereNavigator(1.0);
	
	console.log("=== Пример 1: Простое движение ===");
	const start1 = {lat: 0, lon: 0, alt: Math.PI/4}; // 45° altitude
	const distance1 = Math.PI/4; // 45° углового расстояния
	const eta1 = 0; // Двигаемся прямо по направлению e1
	const psi1 = 0;
	
	const result1 = navigator.calculateNewPoint(
		start1.lat, start1.lon, start1.alt, 
		distance1, eta1, psi1
	);
	
	console.log("Начальная точка:", start1);
	console.log("Расстояние:", distance1, "радиан");
	console.log("Новая точка:", {
		latitude: result1.latitude.toFixed(6),
		longitude: result1.longitude.toFixed(6),
		altitude: result1.altitude.toFixed(6)
	});
	
	// Проверка расстояния
	const checkDist1 = navigator.greatCircleDistance(
		start1.lat, start1.lon, start1.alt,
		result1.latitude, result1.longitude, result1.altitude
	);
	console.log("Проверка расстояния:", checkDist1.toFixed(6), 
				"(ожидается:", distance1.toFixed(6), ")");
	
	console.log("\n=== Пример 2: Движение под углом ===");
	const start2 = {lat: Math.PI/6, lon: Math.PI/4, alt: Math.PI/3};
	const distance2 = Math.PI/6; // 30°
	const eta2 = Math.PI/4; // 45° от вертикали
	const psi2 = Math.PI/2; // 90° азимут
	
	const result2 = navigator.calculateNewPoint(
		start2.lat, start2.lon, start2.alt,
		distance2, eta2, psi2
	);
	
	console.log("Начальная точка:", start2);
	console.log("Новая точка:", {
		latitude: (result2.latitude * 180/Math.PI).toFixed(2) + "°",
		longitude: (result2.longitude * 180/Math.PI).toFixed(2) + "°",
		altitude: (result2.altitude * 180/Math.PI).toFixed(2) + "°"
	});
	
	console.log("\n=== Пример 3: Большое расстояние ===");
	const start3 = {lat: 0, lon: 0, alt: 0.1};
	const distance3 = Math.PI/2; // 90°
	const eta3 = Math.PI/2; // Горизонтально
	const psi3 = 0;
	
	const result3 = navigator.calculateNewPoint(
		start3.lat, start3.lon, start3.alt,
		distance3, eta3, psi3
	);
	
	console.log("Начальная точка:", start3);
	console.log("Новая точка:", {
		latitude: (result3.latitude * 180/Math.PI).toFixed(2) + "°",
		longitude: (result3.longitude * 180/Math.PI).toFixed(2) + "°",
		altitude: (result3.altitude * 180/Math.PI).toFixed(2) + "°"
	});
	
	console.log("\n=== Пример 4: Крайние случаи ===");
	// Почти северный полюс
	const start4 = {lat: Math.PI/2 - 0.001, lon: 0, alt: 0.001};
	const distance4 = 0.1;
	const eta4 = 0;
	const psi4 = 0;
	
	try {
		const result4 = navigator.calculateNewPoint(
			start4.lat, start4.lon, start4.alt,
			distance4, eta4, psi4
		);
		
		console.log("Начальная точка (почти полюс):", start4);
		console.log("Новая точка:", {
			latitude: (result4.latitude * 180/Math.PI).toFixed(4) + "°",
			longitude: (result4.longitude * 180/Math.PI).toFixed(4) + "°",
			altitude: (result4.altitude * 180/Math.PI).toFixed(4) + "°"
		});
	} catch (e) {
		console.log("Ошибка в примере 4:", e.message);
	}
	
	// Визуализация в 3D проекции (первые 3 координаты)
	console.log("\n=== Декартовы координаты (первые 3 из 4) ===");
	console.log("Пример 1 - начальная:", 
				navigator.anglesToCartesian(start1.lat, start1.lon, start1.alt)
					.slice(0,3).map(v => v.toFixed(4)));
	console.log("Пример 1 - конечная:", 
				result1.cartesian.slice(0,3).map(v => v.toFixed(4)));
}
	
// Запуск примеров
runExamples();
	
// Функция для интерактивного тестирования
function testCustomPoint() {
	const navigator = new HyperSphereNavigator(1.0);
	
	// Пользовательский тест
	const testCase = {
		lat: Math.PI/4,    // 45°
		lon: Math.PI/6,    // 30°
		alt: Math.PI/3,    // 60°
		distance: 0.5,     // радиан
		eta: Math.PI/4,    // 45°
		psi: Math.PI/3     // 60°
	};
	
	const result = navigator.calculateNewPoint(
		testCase.lat, testCase.lon, testCase.alt,
		testCase.distance, testCase.eta, testCase.psi
	);
	
	console.log("\n=== Пользовательский тест ===");
	console.log("Входные параметры:", testCase);
	console.log("Результат:", {
		latitude: result.latitude.toFixed(6),
		longitude: result.longitude.toFixed(6),
		altitude: result.altitude.toFixed(6)
	});
	
	return result;
}
	
// Выполнить пользовательский тест
testCustomPoint();
*/
export default RandomVertice;
