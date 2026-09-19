/**
 * @module HyperSphere3D
 * @description 3 dimensional [hypersphere]{@link https://en.wikipedia.org/wiki/N-sphere}.
 * All the vertices form a [hypersphere]{@link https://en.wikipedia.org/wiki/N-sphere}.
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


import Sphere from './sphere.js';
import three from '../three.js'
import FibonacciSphereGeometry from '../FibonacciSphere/FibonacciSphereGeometry.js'
import anglesRange from './anglesRange.js'
import * as utils from './utilsHSphere.js'
import Position from './position.js'
import * as fileHandler from '../fileHandler.js';

const sHyperSphere3D = 'HyperSphere3D',
	π = Math.PI;

/**
 * 3 dimensional [hypersphere]{@link https://en.wikipedia.org/wiki/N-sphere}.
 * All the vertices form a [hypersphere]{@link https://en.wikipedia.org/wiki/N-sphere}.
 * @class
 * @extends Sphere
 */
class HyperSphere3D extends Sphere {

	/**
	 * @param {Options} options See <a href="../../../master/jsdoc/Options/Options.html" target="_blank">Options</a>.
	 * @param {object} [classSettings] <b>Circle</b> class settings. See <a href="./module-HyperSphere-HyperSphere.html" target="_blank">HyperSphere classSettings</a>.
	 **/
	constructor(options, classSettings) { super(options, classSettings); }

	//base methods

	save(fParent, settings) {
		if (!settings.object.geometry.positionsFileName) return;

		//Localization

		const lang = {
			save: 'Save',
			saveTitle: 'Save vertices to file',

			fileName: 'File name',
			fileExists: `File %s already exists. Replace it?`,
		};
		switch (settings.options.getLanguageCode()) {

			case 'ru'://Russian language
				lang.save = 'Сохранить';
				lang.saveTitle = 'Сохранить вершины в файл';
				
				lang.fileName = 'Имя файла';
				lang.fileExists = `Файл %s уже существует. Заменить его?`;
				break;
		}
		const fSave = fParent.addFolder( lang.save );
		three.dat.folderNameAndTitle( fSave, lang.save, lang.saveTitle );
/*		
		const myData = {
			fileName: settings.object.geometry.positionsFileName,//fileHandler.fileName,
		}
		fSave.add(myData, 'fileName').name(lang.fileName);
*/		
		fSave.add(settings.object.geometry, 'positionsFileName').name(lang.fileName);
		const btnSave = document.createElement('div');//'button');
		btnSave.textContent = '💾 ' + lang.save;
		btnSave.addEventListener('click', async () => {
			// 1. ПЕРВАЯ строчка в обработчике — запрос доступа к папке (жест пользователя сохраняется)
			const connected = await fileHandler.connectProjectDirectory();
			if (!connected) return;

			const fileName = settings.object.geometry.positionsFileName;//myData.fileName;//'positions.bin';

			// 2. Проверяем наличие файла (БЕЗ повторного вызова connectProjectDirectory внутри)
			const isSaved = await fileHandler.fileExists(fileName);
			if (isSaved) {
//				console.warn(`Файл "${fileName}" уже существует. Вычисления пропущены.`);
				if (!confirm(lang.fileExists.replace('%s', fileName)))
					return;
			}

			// 3. Извлекаем координаты и сохраняем
			//const positions = sourceObject.geometry.attributes.position.array;
			const position = settings.bufferGeometry.attributes.position, positionsArray = new Float32Array(position.array.length / settings.options.playerOptions.marks);
			for (let i = 0; i < positionsArray.length; i++)
				positionsArray[i] = position.array[i];
			await fileHandler.saveTraceToProjectDir(positionsArray, fileName);
		});
		
		//находим внутрений список ul папки fSave
		const folderUl = fSave.domElement.querySelector('ul') || fSave.domElement;

		// Оборачиваем кнопку в элемент списка <li>, чтобы не ломать верстку dat.GUI
		const li = document.createElement('li');
		li.className = 'cr function'; // стандартные классы dat.GUI для строчек элементов
		li.appendChild(btnSave);

		// Стилизуем btnSave, чтобы он занимал всю ширину строки и выглядел красиво
		Object.assign(btnSave.style, {
			cursor: 'pointer',
			width: '100%',
			height: '100%',
			padding: '4px 8px',
			boxSizing: 'border-box'
		});

		folderUl.appendChild(li);
	}
	planesGeometry(changedAngleId, aAngleControls, planeGeometry, longitudeId){

		const latitudeId = longitudeId - 1, altitudeId = latitudeId - 1;
		switch(changedAngleId){

			case altitudeId:
				planeGeometry(longitudeId);
				planeGeometry(latitudeId )
				break;
			case latitudeId:
			case longitudeId:
				planeGeometry(altitudeId);
				super.planesGeometry(changedAngleId, aAngleControls, planeGeometry, longitudeId); break;
			default: console.error(sHyperSphere3D + ': Update planes. Invalid changedAngleId = ' + changedAngleId);
				
		}
		
	}
	get axes() { return {

			//порядок размещения осей в декартовой системе координат
			//нужно что бы широта двигалась по оси y а долгота вращалась вокруг y
			indices: [3, 1, 2, 0],

		}
		
	}
	newHyperSphere(options, classSettings) { return new HyperSphere3D(options, classSettings); }
	get cookieName() { return '3DUniverse' + (this.classSettings.cookieName ? '_' + this.classSettings.cookieName : ''); }
	get altitudeRange() { return anglesRange.altitude; }
	setW() {

		const classSettings = this.classSettings, options = classSettings.settings.options;
		if (!options.scales) options.scales = {};
		if (!options.scales.w) options.scales.w = {};
		const w = options.scales.w;
		w.max = classSettings.rRange.max;
		w.min = classSettings.rRange.min;
		
		//Если не установить это значение, то будет неверно устанавливаться значение w в geometry.attributes.position
		//потому что в гиперсфере w в geometry.attributes.position это не цвет вершины, а координата
		//Для проверки открыть http://localhost/anhr/commonNodeJS/master/HyperSphere/Examples/hyperSphere.html
		//Выбрать вершину
		//сделать шаг проигрывтеля →
		//Исчезнет ошибка HyperSphere: Invalid vertice[2] sum = 0.6560590267181396. r = 1
		w.isColor = false;
		
	};
	get probabilityDensity() {

		const _this = this;
		return {

			sectorValueName: 'sectorVolume',
			sectorValue: (probabilityDensity, i) => {

				const sector = probabilityDensity[i], r = this.classSettings.r, hb = sector.hb, ht = sector.ht;
				
				//объем сегмента
				//https://en.wikipedia.org/wiki/Sphere
				//https://www.sjsu.edu/faculty/watkins/ndim.htm сводная таблица площади и объема для сфер разной размерности
				sector[this.probabilityDensity.sectorValueName] = Math.PI * Math.PI * r * r * (ht - hb);
				return sector[this.probabilityDensity.sectorValueName];

			},
			get unverseValue() {
				
				//https://www.sjsu.edu/faculty/watkins/ndim.htm
				//Dimension = 4. Bounding Area = 2ππRRR
				const r = _this.classSettings.r;
				return 2 * Math.PI * Math.PI * r * r * r//Bounding Area

			}

		}

	}
	defaultAngles() { return { count: 5, } }//random pentachoron https://en.wikipedia.org/wiki/5-cell

	pushRandomAngle(verticeAngles) {

		//https://en.wikipedia.org/wiki/3-sphere#Hyperspherical_coordinates
		
		//Altitude
		//добиваемся равномерного распределения вершин в объеме шара
		//исчезло уплотнение в ядре шара
		verticeAngles.push(Math.acos(Math.random() * (Math.random() > 0.5 ? 1: -1)));
		
		//добиваемся равномерного распределения вершин в объеме шара
		//исчезло уплотнение на оси через полюса по оси i
		this.pushRandomLatitude(verticeAngles);
		
		this.pushRandomLongitude(verticeAngles);

	}
	color() {}
	name( getLanguageCode ) {

		//Localization
		
		const lang = {

			name: "Hypersphere",

		};

		const _languageCode = getLanguageCode();

		switch (_languageCode) {

			case 'ru'://Russian language

				lang.name = 'Гиперсфера';

				break;

		}
		return lang.name;
		
	}

	intersection(color, scene) {

		const THREE = three.THREE,
			classSettings = this.classSettings,
			mesh = new THREE.Mesh(new FibonacciSphereGeometry(((classSettings.intersection.position + 1) / 2) * classSettings.r, 320),
				//new THREE.MeshBasicMaterial( { color: color, wireframe: true } )//сетка
				new THREE.MeshLambertMaterial( {//полупрозрачные грани

					color: color,//"lightgray",
					opacity: 0.2,
					transparent: true,
					side: THREE.DoubleSide//от этого ключа зависят точки пересечения объектов

				} )
			);
		
		const lights = [], lightsCount = 6;
		for (let i = 0; i < lightsCount; i++) lights.push(new THREE.DirectionalLight(color, i > 2 ? 1 : 0.5));

		lights[0].position.set(200, 0, 0);
		lights[1].position.set(0, 200, 0);
		lights[2].position.set(0, 0, 200);
		lights[3].position.set(-200, 0, 0);
		lights[4].position.set(0, -200, 0);
		lights[5].position.set(0, 0, -200);

		for (let i = 0; i < lightsCount; i++) scene.add(lights[i]);

		return mesh;
		
	}

	//Overridden methods from base class

	ZeroArray() { return [0, 0, 0]; }
	Vertice(angles) { return utils.angles(angles); }
	/**
	 * Converts a vertice position to vertice angles.
	 * @param {array} vertice array of the vertice axes
	 * @returns Vertice angles.
	 */
	vertice2angles(vertice) {

		/*https://chat.deepseek.com/a/chat/s/5c55507d-4660-4e04-8920-0e1c791a9c3c
		Задана точка vertice на 3D гиперсфере в декартовой системе координат. Начало координат находится в центре сферы.
		Положение точки обозначить как
		x = vertice[0]
		y = vertice[1]
		z = vertice[2]
		w = vertice[3]
		Вычислить координаты точки в полярной системе координат.
		Углы в полярной системе координат обозначить как:
		longitude - долгота (азимутальный угол)  в диапазоне от -π до π,
		latitude - широта (зенитный угол) в диапазоне -π/2 на южном полюсе до π/2 на северном полюсе.,
		altitude - полярный угол от оси W  в диапазоне от 0 до π.
		Радиус сферы обозначить как r.
		Написать код на javascript.
		*/
		function cartesianToPolar4D(vertice) {

			const x = vertice.x, y = vertice.y, z = vertice.z, w = vertice.w;

			// Вычисляем радиус сферы
			const r = Math.sqrt(x * x + y * y + z * z + w * w);

			// Если радиус равен 0, возвращаем нулевые координаты
			if (r === 0) {

				return utils.angles([0, 0, 0]);

			}

			// Вычисляем altitude (угол от оси W) в диапазоне [0, π]
			const altitude = Math.acos(w / r);

			// Проекция на 3D пространство (x,y,z)
			const r_xyz = Math.sqrt(x * x + y * y + z * z);

			// Вычисляем latitude (широта) в диапазоне [-π/2, π/2]
			let latitude;
			if (r_xyz === 0) {
				// Если проекция на (x,y,z) равна 0, точка на полюсе W-оси
				latitude = (w >= 0) ? Math.PI / 2 : -Math.PI / 2;
			} else {
				latitude = Math.asin(z / r_xyz);
			}

			// Проекция на плоскость (x,y)
			const r_xy = Math.sqrt(x * x + y * y);

			// Вычисляем longitude (долгота) в диапазоне [-π, π]
			let longitude;
			if (r_xy === 0) {
				// Если проекция на (x,y) равна 0, долгота не определена, устанавливаем 0
				longitude = 0;
			} else {
				longitude = Math.atan2(y, x);
				// atan2 уже возвращает значение в диапазоне [-π, π]
			}

			return utils.angles([altitude, latitude, longitude]);

		}
		return cartesianToPolar4D(Position(vertice));

	}
	a2v(angles, r = this.r) { return utils.polarToCartesian(angles, r, this.classSettings.debug); }
	get verticeEdgesLengthMax() { return 4/*6*/; }//нельзя добавлть новое ребро если у вершины уже 6 ребра
	get dimension() { return 4; }//space dimension
	get verticesCountMin() { return 4; }

	/* *
	 * @param {THREE.Scene} scene [THREE.Scene]{@link https://threejs.org/docs/index.html?q=sce#api/en/scenes/Scene}
	 * @param {Options} options See <a href="../../jsdoc/Options/Options.html" target="_blank">Options</a>.
	 * @param {object} randomVerticesSettings See <b>randomVerticesSettings</b> of the <a href="./module-HyperSphere-RandomVertices.html" target="_blank">RandomVertices</a> class.
	 * @returns new RandomVertices child class.
	 */
//	newRandomVertices(scene, options, randomVerticesSettings) { return new RandomVertices(scene, options, randomVerticesSettings); }
	get RandomVertice() { return RandomVertice; }

}

export default HyperSphere3D;

const _display = (element, boDisplay) => { element.style.display = boDisplay === false ? 'none' : 'block'; }
