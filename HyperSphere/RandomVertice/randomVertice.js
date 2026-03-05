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

const sRandomVertice = 'RandomVertice',
	sOver = ': Please, override %s method in your ' + sRandomVertice + ' child class.',
	π = Math.PI, random = Math.random, acos = Math.acos;
/**
 * Generates random angles between a vertice and its opposite vertice.
 * @class
 */
class RandomVertice {

	/**
	 * Generates a cloud of random vertices around the opposite vertice.
	 * @param {object} [params={}] The following parameters are available.
	 * @param {float} [params.arc=0] Density distribution of a cloud of random vertices on a hypersphere. arc range from 0 to π.
	 * <pre>
	 *	arc = 0 A cloud of random vertices degenerates into a single point equal to the opposite vertice.
	 *	arc = π A cloud of random vertices is uniformly distributed over the entire surface of the hypersphere.
	 * </pre>
	 * @param {Array} [params.oppositeVertice=[altitude, latitude, longitude]] Opposite vertice position in polar coordinates.
	 * @param {object} [params.debug] Debug mode.
	 * @param {object} [params.debug.notRandomVertices] true - replacing random vertices with strictly defined vertices.
	 * @param {number} [verticesCount=1] count of vertices in the random vertices cloud.
	 */
	constructor(params={}, verticesCount = 1) {

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
		this.verticesAngles = (editAngles = false) => {

			const startingPointParams = this.navigator.startingPointParams();
			for (let i = 0; i < verticesCount; i++) {

				if (editAngles) params.editAnglesId = i;
				this.getRandomAngles(undefined, startingPointParams);

			}
			delete params.editAnglesId;

		};
		this.distance = (distance, R) => {
			
			let arc = params.arc;
			if (arc < 0) arc = 0;//Эта ошибка возникает потому что в GUI переменная arc округляется до 4 знаков
			
			/*Есть декартова система координат. Ось x обозначим как arc. Найди элементарную функцию которая неогранниченно растет в точке arc = 0 и равна нулю в точке arc = π.
			arc меняется только в диапазоне от 0 до π. arc это не угол.
			Написать код на javascript
			*/
			//https://chat.deepseek.com/a/chat/s/0b71542a-46a2-47e2-9888-f95f26f0fa37
			const y = 1 / arc - 1 / π;
			
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
//				r: classSettings.overriddenProperties.r(settings.guiPoints ? settings.guiPoints.timeId : options.player ? options.player.getTimeId() : 0),
				r: classSettings.overriddenProperties.rTime(),
				name: 'Random Cloud'
				
			});
	
	}
	
	/////////////////////////////overridden methods

}
RandomVertice.get = (arc, oppositeVertice, classSettings, RandomVertice) => {
	
	return new RandomVertice({
	
		arc: arc,
		oppositeVertice: oppositeVertice,
		classSettings: classSettings,//используется для вычисления случайной точки в RandomVerticeHSphere HyperSphereNavigator.calculateNewPoint
		
	}).angles[0];
	
}
/**
 *<pre>
 [Deepseek. Гипербола через три точки]{@link https://chat.deepseek.com/a/chat/s/1f8ddb5d-b9de-43d3-aa0d-3cfe49cd48a3}
Есть декартова система координат. Ось x обозначим как arc. Найди элементарную функцию гиперболы которая пересекает три точки:
(arc1 = 0, y1 = 0),
(arc2 = π / 100, y2 = π - π / 100),
(arc3 = π, y3 = π)
 arc меняется только в диапазоне от 0 до π. arc это не угол.
Написать код на javascript.

Tеперь для построения функции для нахождения коэффициентов гиперболы оставим только две крайних точки, первую и третью, уберем среднюю точку,
а вместо нее добавим некоторый параметр p, который будет меняться в диапазоне допустим от 0 до 1.
Если p = 0, то гипербола вырождется в прямую.
Если p = 1, то гипербола вырождется в два отрезка прямых:
   Первый отрезок: (arc1 = 0, y1 = 0), (arc2 = 0, y2 = π) вертикальная прямая из начала координат.
   Второй отрезок: (arc1 = 0, y1 = π), (arc2 = π, y2 = π) горизональная прямая.
Написать код на javascript.
Для визуализации примеров сделать [веб страницу]{@link https://raw.githack.com/anhr/commonNodeJS/master/HyperSphere/Examples/hyperbola.html}, в которой применить библиотеку three.js

 Функция для вычисления коэффициентов гиперболы по параметру p
 * </pre>
 * @param {float} p <pre>Параметр, который меняется в диапазоне от 0 до 1 и который используется для вычисления параметров гиперболы.
Если p = 0, то гипербола вырождется в прямую.
Если p = 1, то гипербола вырождется в два отрезка прямых:
   Первый отрезок: (arc1 = 0, y1 = 0), (arc2 = 0, y2 = π) вертикальная прямая из начала координат.
   Второй отрезок: (arc1 = 0, y1 = π), (arc2 = π, y2 = π) горизональная прямая.
 * </pre>
 */
RandomVertice.calculateHyperbola = (p) => {

	// Крайние случаи
	if (p === 0) {
		// Прямая линия: y = x (через точки (0,0) и (π,π))
		return (arc) => { return arc; }
/*		
		return {
			type: 'line',
			a: 1,
			b: 0,
			equation: 'y = x'
		};
*/		
	}

	if (p === 1) {
		// Два отрезка: вертикальный и горизонтальный
		return (arc) => {

			if (arc === 0 ) return 0
			return π;
			
		}
/*		
		return {
			type: 'segments',
			segments: [
				{ from: { x: 0, y: 0 }, to: { x: 0, y: π } },  // вертикальный
				{ from: { x: 0, y: PI }, to: { x: PI, y: π } } // горизонтальный
			],
			equation: 'Вертикальный и горизонтальный отрезки'
		};
*/		
	}

	// Общий случай: гипербола вида y = a/(x - h) + k
	// У нас есть две точки: (0,0) и (π,π)
	// и дополнительное условие: при x = 0, y = 0
	// при x = π, y = π

	// Из точки (0,0): 0 = a/(0 - h) + k => k = a/h

	// Из точки (π,π): π = a/(π - h) + a/h

	// Вводим параметр p для контроля кривизны
	// Будем использовать p для определения положения асимптоты h
	// При p -> 0: h -> -∞ (гипербола вырождается в прямую)
	// При p -> 1: h -> 0 (гипербола вырождается в вертикальную линию)

	// Свяжем h с p: h = - (1-p)/p * C, где C некоторая константа
	// Чтобы при p=1, h=0; при p=0, h=-∞
	// Возьмем C = π/2 для хорошей визуализации

	const C = π / 2;

	// Избегаем деления на ноль при p=0 (уже обработано выше)
	let h;
	if (p < 0.001) {
		// Для очень малых p используем линейную аппроксимацию
		h = -C / p;
	} else {
		h = -C * (1 - p) / p;
	}

	// Вычисляем a из уравнения π = a/(π - h) + a/h
	// a = π / (1/(π - h) + 1/h) = π / ((h + π - h)/(h(π - h))) = π * h(π - h) / π = h(π - h)
	// Упростим: a = h * (PI - h)

	const a = h * (π - h);

	// Вычисляем k
	const k = a / h;

	return (x) => {

		// Гипербола
//		const { a, h, k } = hyperbola;
	
		// Генерируем точки слева от асимптоты (если асимптота слева от 0)
		// В нашем случае h всегда отрицательное, так что асимптота слева от 0
//		for (let i = 0; i <= numPoints; i++) {
//			const x = (i / numPoints) * PI;
		// Проверяем, что не попадаем в асимптоту
		if (Math.abs(x - h) < 0.001) {

			console.error(sRandomVertice + ': calculateHyperbola. Under consraction');
			return x;
//			continue;

		}
		return a / (x - h) + k;
/*
		const y = a / (x - h) + k;
		// Ограничиваем y для визуализации
		if (isFinite(y) && y >= -1 && y <= PI + 1) {
			points.push(new THREE.Vector3(x, y, 0));
		}
*/			
//		}
		
	}
/*
	return {
		type: 'hyperbola',
		a: a,
		h: h,
		k: k,
		equation: `y = ${a.toFixed(4)}/(x - ${h.toFixed(4)}) + ${k.toFixed(4)}`
	};
*/

}
export default RandomVertice;
