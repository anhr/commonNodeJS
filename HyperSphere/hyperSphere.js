/**
 * @module HyperSphere
 * @description Base class for n dimensional [hypersphere]{@link https://en.wikipedia.org/wiki/N-sphere}.
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


import ND from '../nD/nD.js';
//Эти строки не позволяют выполнить команду npm run build
//import ND from '../nD/build/nD.module.js';
//import ND from '../nD/build/nD.module.min.js';
//import ND from 'https://raw.githack.com/anhr/commonNodeJS/master/nD/nD.js';
//import ND from 'https://raw.githack.com/anhr/commonNodeJS/master/nD/build/nD.module.js';
//import ND from 'https://raw.githack.com/anhr/commonNodeJS/master/nD/build/nD.module.min.js';

//если использовать эту строку, появится ошибка:
//Error: Illegal reassignment to import 'ND'
//При выполнении npm run build
//if (ND.default) ND = ND.default;

//Когда хочу вывести на холст точки вместо ребер то использую MyPoints вместо ND
//При этом ребра не создаются что дает экономию времени
import MyPoints from '../myPoints/myPoints.js';
import ColorPicker from '../colorpicker/colorpicker.js';

//Получаю ошибку
//myThree: duplicate myThree. Please use one instance of the myThree class.
//если на веб странце импортировать import MyThree from '../../../commonNodeJS/master/myThree/build/myThree.module.js';
//import MyThree from '../myThree/myThree.js';
import three from '../three.js'

import ProgressBar from '../ProgressBar/ProgressBar.js'
//import WebGPU from '../../../WebGPU/master/WebGPU.js';
import PositionController from '../PositionController.js';
import MyObject from '../myObject.js'

const sHyperSphere = 'HyperSphere', sOverride = sHyperSphere + ': Please override the %s method in your child class.',
	π = Math.PI, pi = Math.PI;

/**
 * Base class for n dimensional [hypersphere]{@link https://en.wikipedia.org/wiki/N-sphere}. Extends <a href="../../jsdoc/MyObject/module-myObject-MyObject.html" target="_blank">MyObject</a>.
 * @class
 * @extends MyObject
 */
class HyperSphere extends MyObject {

	/**
	 * Base class for n dimensional [hypersphere]{@link https://en.wikipedia.org/wiki/N-sphere}.
	 * @param {Options} options See <a href="../../../master/jsdoc/Options/Options.html" target="_blank">Options</a>.
	 * @param {object} [classSettings] <b>HyperSphere</b> class settings.
	 * @param {object} [classSettings.intersection] HyperSphere intersection.
	 * <pre>
	 *	For Circle intersector is line.
	 *	For Sphere intersector is plane.
	 *	For HyperSphere intersector is sphere.
	 * </pre>
	 * @param {float} [classSettings.intersection.position=0.0] Position of the intersector.
	 * <pre>
	 *	For Circle <b>position</b> is Y coordinate of the intersection line.
	 *	For Sphere <b>position</b> is Z coordinate of the intersection plane.
	 *	For HyperSphere <b>position</b> is radius of the intersection sphere.
	 * </pre>
	 * @param {number|string} [classSettings.intersection.color=0x0000FF] Color of the intersector. Example: 'red'.
	 * @param {object} [classSettings.projectParams] Parameters of project the hypersphere onto the canvas.
	 * @param {THREE.Scene} classSettings.projectParams.scene [THREE.Scene]{@link https://threejs.org/docs/index.html?q=sce#api/en/scenes/Scene}
	 * @param {object} [classSettings.projectParams.params={}] The following parameters are available
	 * @param {object} [classSettings.projectParams.params.center={x: 0.0, y: 0.0, z: 0.0}] center of the hypersphere
	 * @param {float} [classSettings.projectParams.params.center.x=0.0] X axis of the center
	 * @param {float} [classSettings.projectParams.params.center.y=0.0] Y axis of the center
	 * @param {float} [classSettings.projectParams.params.center.z=0.0] Z axis of the center
	 * @param {float} [classSettings.r=1.0] HyperSphere radius.
	 * @param {boolean|object} [classSettings.edges={}] HyperSphere edges
	 * <pre>
	 *	false - Doesn't create edges to reduce the creation time of the hypersphere
	 * </pre>
	 * @param {boolean} [classSettings.edges.project=true] false - Doesn't project edges onto canvas
	 * @param {enum} [classSettings.edges.creationMethod=edgesCreationMethod.Random] method for creating edges. See <a href="./module-HyperSphere-HyperSphere.html#.edgesCreationMethod" target="_blank">edgesCreationMethod</a>
	 * @param {boolean} [classSettings.randomArc=false] true - creates a random arc between two vertice.
	 * @param {Function} [classSettings.onSelectScene] Callback function that called after <a href="../../player/jsdoc/module-Player-Player.html" target="_blank">Player</a> time was changed.
	 * <pre>
	 * parameter <b>hyperSphere</b> <a href="../../HyperSphere/jsdoc/" target="_blank">HyperSphere</a> object.
	 * parameter <b>timeId</b> <a href="../../player/jsdoc/module-Player-Player.html" target="_blank">Player</a> index.
	 * parameter <b>t</b> current time.
	 * Also see <a href="../../player/jsdoc/module-Player.html#~onSelectScene" target="_blank">onSelectScene</a> type definition.
	 * </pre>
	 * @param {Function} [classSettings.onAddControllers] Сallback function that is called when the user has selected a hypersphere. You can add new controllers to the 'Advansed' folder.
	 * <pre>
	 * parameter <b>fAdvansed</b> 'Advansed' folder.
	 * </pre>
	 * @param {object} [classSettings.settings] The following settings are available
	 * @param {object} [classSettings.settings.object] HyperSphere object.
	 * @param {String} [classSettings.settings.object.name] name of hypersphere.
	 * @param {String|number} [classSettings.settings.object.color='lime'] color of edges or vertices.
	 * <pre>
	 * String - color name. See list of available color names in the <b>_colorKeywords</b> object in the [Color.js]{@link https://github.com/mrdoob/three.js/blob/dev/src/math/Color.js} file.
	 * number - color [Hex triplet]{@link https://en.wikipedia.org/wiki/Web_colors#Hex_triplet}. Example: 0x0000ff - blue color.
	 * Default color is lime for <a href="./module-Circle-Circle.html" target="_blank">Circle</a> and <a href="./module-Sphere-Sphere.html" target="_blank">Sphere</a>.
	 * Default color of vertice of the <a href="./module-HyperSphere3D-HyperSphere3D.html" target="_blank">Hypersphere3D</a> is depends from the altitude angle of the vertice according the <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">options.palette</a> parameter.
	 * See <b>classSettings.settings.object.geometry.angles</b> for details. For example if <b>options.palette</b> is <b>MyThree.ColorPicker.paletteIndexes.BGYW</b>, then:
	 * <table>
		 <tr><td>Vertice Altitude</td><td>Vertice Color</td></tr>
		 <tr><td>0</td><td>white</td></tr>
		 <tr><td>π / 2</td><td>lime</td></tr>
		 <tr><td>π</td><td>blue</td></tr>
		</table>
	 * <b>MyThree.ColorPicker.paletteIndexes.BGYW</b> palette parameter is default.
	 * Note: You can define color of the each vertice separately in the <b>classSettings.settings.object.geometry.colors</b> parameter.
	 * <pre>
	 * @param {object} [classSettings.settings.object.geometry] HyperSphere geometry.
	 * @param {array|object} [classSettings.settings.object.geometry.angles] n-dimensional hypersphere vertice angles.
	 * <pre>
	 * array - array of vertex angles.
	 *	Every item of array is n-dimensional array of vertex angles.
	 *	
	 *	All the vertices of the <b><a href="module-Circle.html" target="_blank">Circle</a></b> form a circle.
	 *	For <b><a href="module-Circle.html" target="_blank">Circle</a></b> every vertice is array of one angle.
	 *		Vertex angle is the longitude of the circle of the hypersphere in the range from <b>- π</b> to <b>π</b>.
	 *		Vertex angle is angle of rotation around of <b>Z</b> axis in 3D space.
	 *		Angle is begin from <b>X = 0, Y = 1</b>.
	 *		Every vertex is <b>[
				Math.cos(θ),//x
				Math.sin(θ)//y
			]</b> array. <b>θ</b> is vertex angle.
	 *		Example of Circle with three vertices is triangle:
	 *		<b>classSettings.settings.object.geometry.angles: angles: [
	 *			[],                 //vertice[0] = [0                   ,1]
	 *			[Math.PI * 2 / 3],  //vertice[1] = [0.8660254037844387	,-0.4999999999999998]
	 *			[- Math.PI * 2 / 3] //vertice[2] = [-0.8660254037844387	,-0.4999999999999998]
	 *		]</b>,
	 *		
	 *	All the vertices of the <b><a href="module-Sphere.html" target="_blank">Sphere</a></b> form a sphere.
	 *	For <b><a href="module-Sphere.html" target="_blank">Sphere</a></b> every vertice is array of two angles.
	 *		The first vertex angle is the latitude of the sphere of the hypersphere in the range from <b>- π / 2</b> to <b>π / 2</b>.
	 *		Zero latitude is located at the equator.
	 *		
	 *		The second vertex angle is the longitude of the sphere of the hypersphere in the range from <b>- π</b> to <b>π</b>.
	 *		The second vertex angle is angle of rotation of the cross section around of <b>Y</b> axis.
	 *		
	 *		Example of Sphere with 4 vertices is pyramid:
	 *		<b>classSettings.settings.object.geometry.angles: [
	 *		
	 *			[ Math.PI / 2,  0                  ],//vertice[0] = [ 0                 , 1  , 0   ]
	 *			[-Math.PI / 6,  Math.PI * 2 * 0 / 3],//vertice[1] = [-0.8660254037844387,-0.5, 0   ]
	 *			[-Math.PI / 6,  Math.PI * 2 * 1 / 3],//vertice[2] = [ 0.4330127018922192,-0.5,-0.75]
	 *			[-Math.PI / 6, -Math.PI * 2 * 1 / 3,//vertice[3] = [ 0.4330127018922195,-0.5, 0.75]
	 *			
	 *		]</b>,
	 *		
	 *	All the vertices of the <a href="module-HyperSphere3D.html" target="_blank">HyperSphere3D</a></b> form a [hypersphere]{@link https://en.wikipedia.org/wiki/N-sphere}.
	 *	For <b><a href="module-HyperSphere3D.html" target="_blank">HyperSphere3D</a></b> every vertice is array of three angles.
	 *		The first vertex angle is the altitude of the hypersphere of the hypersphere in the range from <b>0</b> to <b>π / 2</b>.
	 *		Zero altitude is located at the center of the hypersphere.
	 *		
	 *		The second vertex angle is the latitude of the hypersphere of the hypersphere in the range from <b>- π / 2</b> to <b>π / 2</b>.
	 *		Zero latitude is located at the equator.
	 *		
	 *		The third vertex angle is the longitude of the hypersphere of the hypersphere in the range from <b>- π</b> to <b>π</b>.
	 *		The third vertex angle is angle of rotation of the cross section around of <b>Y</b> axis.
	 *		
	 *		Example of HyperSphere with 5 vertices is [pentahedroid]{@link https://en.wikipedia.org/wiki/5-cell}:
	 *		<b>classSettings.settings.object.geometry.angles: [
	 *			[],
	 *			[Math.PI / 2, Math.PI / 2],
	 *			[
	 *				  Math.PI / 2,//Altitude
	 *				- Math.PI / 6,//Latitude
	 *				  Math.PI * 0,//Longitude
	 *			],
	 *			[Math.PI / 2, - Math.PI / 6,   Math.PI * 2 * 1 / 3],
	 *			[Math.PI / 2, - Math.PI / 6, - Math.PI * 2 * 1 / 3],
			]</b>,
	 * object - see below:
	 * </pre>
	 * @param {number} [classSettings.settings.object.geometry.angles.count=3|4|5] Count of vertices with random position.
	 * <pre>
	 * Default values:
	 *	3 for <b><a href="module-Circle.html" target="_blank">Circle</a></b> - triangle.
	 *	4 for <b><a href="module-Sphere.html" target="_blank">Sphere</a></b> - pyramid.
	 *	5 for <b><a href="module-HyperSphere3D.html" target="_blank">HyperSphere3D</a></b> - [pentahedroid]{@link https://en.wikipedia.org/wiki/5-cell}.
	 * </pre>
	 * @param {array} [classSettings.settings.object.geometry.times] array of vertices angles for different player <a href="../../player/jsdoc/module-Player-Player.html" target="_blank">Player</a> times. See <b>angles</b> above.
	 * <pre>
	 * See <a href="../../player/jsdoc/module-Player.html#~onSelectScene" target="_blank">Player.onSelectScene</a> for details.
	 * Every item of the array is array of vertices angles for current <b>Player</b> time.
	 * <b>times</b> have priority before <b>angles</b>.
	 * </pre>
	 * @param {array} [classSettings.settings.object.geometry.colors] array of colors of vertices.
	 * <pre>
 	 * Color of the each vertice is group of three (RGB) items of the colors array in range from 0 to 1. See [THREE.Color]{@link https://threejs.org/docs/?q=Color#api/en/math/Color} for details.
	 * Example:
	 * [
	 * 	1, 0, 0,//First vertice is red.
	 * 	0, 1, 0,//Second vertice green.
	 * 	0, 0, 1,//Third vertice blue.
	 * ]
	 * </pre>
	 * Note: Color of vertice is defined in the <b>classSettings.settings.object.color</b> parameter if it not exists in the colors array.
	 * @param {array} [classSettings.settings.object.geometry.opacity] array of opacities of each vertice. Each item of array is float value in the range of 0.0 - 1.0 indicating how transparent the material is. A value of 0.0 indicates fully transparent, 1.0 is fully opaque.
	 * @param {object} [classSettings.settings.object.geometry.indices] Array of <b>indices</b> of edges of hypersphere.
	 * @param {array|object} [classSettings.settings.object.geometry.indices.edges] HyperSphere edges.
	 * <pre>
	 * array - array of edges.
	 *	Every edge is array of indices of vertices from
	 *	<b>classSettings.settings.object.geometry.position</b>
	 *	Example: <b>[[0,1], [1,2], [2,0]],//triangle</b>
	 * object - see below:
	 * </pre>
	 * @param {number} [classSettings.settings.object.geometry.indices.edges.count=3] edges count.
	 * @param {boolean|object} [classSettings.debug=false] Debug mode.
	 * <pre>
	 *	true - Diagnoses your code and display detected errors to console.
	 *	object - Diagnoses your code and display detected errors to console.
	 * </pre>
	 * @param {boolean|Array} [classSettings.debug.probabilityDensity=[]] Probability density of distribution of vertices over the surface of the hypersphere.
	 * <pre>
	 *	false - do not calculate probability density.
	 *	[] - calculate probability density.
	 * </pre>
	 * @param {boolean} [classSettings.debug.testVertice=true]
	 * <pre>
	 * Test of converting of the vertice coordinates from Cartesian Coordinates to Polar Coordinates
	 * and Polar Coordinates to Cartesian Coordinates
	 * and display detected errors to console.
	 * </pre>
	 * @param {boolean} [classSettings.debug.middleVertice=true] Middle vertice log.
	 * @param {boolean} [classSettings.debug.log=true] Vertices and edges log.
	 * @param {boolean} [classSettings.debug.edges=true] Edges log. Have effect if <b>log = true</b> only
	 * @param {Function} [classSettings.continue] Callback function that called after hypersphere edges was created.
	 * @param {boolean} [classSettings.boRemove] false - do not delete the previous hypersphere while projecting a new hypersphere on scene.
	 * @param {boolean} [classSettings.boGui] false - do not include hypersphere GUI.
	 * @param {object} [classSettings.overriddenProperties] Overridden properties. The following properties can be override:
	 * @param {Function} [classSettings.overriddenProperties.oppositeVertice] Returns the opposite vertice.
	 * <pre>
	 * parameter <b>oppositeAngleId</b>. Opposite vertice identifier.
	 * parameter <b>timeId</b>. <a href="../../player/jsdoc/module-Player-Player.html" target="_blank">Player</a> index is current time identifier.
	 * </pre>
	 * @param {Array} [classSettings.overriddenProperties.position] Returns an array of vertice positions.
	 * @param {Array} [classSettings.overriddenProperties.position0] Returns an array of vertice positions for the <a href="../../player/jsdoc/module-Player-Player.html" target="_blank">Player</a>'s start time.
	 * See <b>settings.options.playerOptions.min</b> of the <a href="../../player/jsdoc/module-Player-Player.html" target="_blank">Player</a>.
	 * @param {Function} [classSettings.overriddenProperties.updateVertices] Update vertices.
	 * <pre>
	 * parameter <b>vertices</b>. Array of new vertices angles.
	 * </pre>
	 * @param {Function} [classSettings.overriddenProperties.vertices] Returns an empty array of vertices.
	 * @param {Function} [classSettings.overriddenProperties.r] Returns a hypersphere radius.
	 * <pre>
	 * parameter <b>timeId</b>. <a href="../../player/jsdoc/module-Player-Player.html" target="_blank">Player</a> index is time identifier.
	 * </pre>
	 * @param {Function} [classSettings.overriddenProperties.pushMiddleVertice] pushes a middle vertice into time angles array.
	 * <pre>
	 * parameter <b>timeId</b>. <a href="../../player/jsdoc/module-Player-Player.html" target="_blank">Player</a> index is time identifier.
	 * parameter <b>middleVertice</b>. Array of the middle vertice angles to push.
	 * </pre>
	 * @param {Function} [classSettings.overriddenProperties.angles] Returns a vertice angles array.
	 * <pre>
	 * parameter <b>anglesId</b>. Vertice identifier.
	 * parameter <b>timeId</b>. <a href="../../player/jsdoc/module-Player-Player.html" target="_blank">Player</a> index is time identifier.
	 * </pre>
	 * @param {Function} [classSettings.overriddenProperties.verticeAngles] Returns a vertice angles.
	 * <pre>
	 * parameter <b>anglesCur</b>. Array of the vertice angles.
	 * parameter <b>verticeId</b>. Vertice index.
	 * </pre>
	 * @param {Function} [classSettings.overriddenProperties.verticeText] Returns a vertice text if user is move mouse over vertice.
	 * <pre>
	 * parameter <b>intersection</b>.
	 * parameter <b>text</b>. Callback function, what returns a vertice text.
	 * </pre>
	 * @param {Function} [classSettings.overriddenProperties.text] Returns a part of the vertice text.
	 **/
	constructor(options, classSettings = {}) {

		if (!classSettings.onSelectScene) classSettings.onSelectScene = (hyperSphere, timeId, t) => { if (this.middleVertices) return this.middleVertices(timeId, t); }
		//for playing in http://localhost/anhr/commonNodeJS/master/HyperSphere/Examples/hyperSphere.html

		//Eсли options.onSelectScene уже существует, значит на холсте уже есть гиперсфера. Это бывает, когда создается случайная дуга HyperSphere classSettings.randomArc = true
		//Тогда если переопределить options.onSelectScene, то при выполнении шага проигрывателя options.onSelectScene будет вызываться для случайной дуги а не для гиперсферы вселенной.
		if (!options.onSelectScene) options.onSelectScene = (index, t) => {

			if (classSettings.onSelectScene) return classSettings.onSelectScene(this, index, t);
			else if (this.middleVertices) return hyperSphere.middleVertices(index, t);
			return true;//Сдедующий шаг проигрывателя выполняется только после посторения всех вершин без временной задержки
		
		}
		classSettings.settings = classSettings.settings || {};
		if (classSettings.debug) classSettings.settings.debug = classSettings.debug;
		classSettings.settings.options = options;
		if (classSettings.settings.guiPoints) classSettings.settings.guiPoints.setIntersectionProperties = (intersection) => {
			
			intersection.nearestEdgeVerticeId = intersection.index;//если не задать это значение, то index будет интерпретироваться как индекс ребра и программа в ребре будет искать индекс вершины, ближайшей к point
			//Для проверки открыть http://localhost/anhr/universe/main/hyperSphere/Examples/
			//Сделать один шаг проигрывателя →
			//С помошю gui выбрать вершину
			//Выбрать "Средняя" для вычисления среднего зачения этой вершины исходя из положения противоположных вершин: opposite vertices
							
		};
		super( classSettings.settings );
		Object.defineProperty(classSettings.settings.bufferGeometry.userData, 'positionBlockLength', {

			get: () => { return classSettings.settings.object.geometry.angles.length; },

		});
		this.rotateLatitude = - π / 2;//Поворачиваем широту на 90 градусов что бы начало координат широты находилось на экваторе;
		const _this = this, THREE = three.THREE;
		if (classSettings.debug === undefined) classSettings.debug = true;
		if (classSettings.debug === true) classSettings.debug = {};
		if (classSettings.debug) {

			classSettings.debug.timestamp = window.performance.now();
			classSettings.debug.logTimestamp = (text = '', timestamp) =>
				console.log('time: ' + text + ((window.performance.now() - (timestamp ? timestamp : classSettings.debug.timestamp)) / 1000) + ' sec.');
			if (classSettings.debug.testVertice != false) classSettings.debug.testVertice = true;
			if (classSettings.debug.middleVertice != false) classSettings.debug.middleVertice = true;

		}
		if (classSettings.projectParams.scene)
			classSettings.projectParams.scene.userData = new Proxy(classSettings.projectParams.scene.userData, {
	
				set: (userData, name, value) => {
	
					switch (name) {
	
						case 't':
							classSettings.settings.bufferGeometry.userData.timeId = userData.index;
							break;
							
					}
					userData[name] = value;
					return true;
	
				}
				
			});
		
		this.classSettings = classSettings;

		let edgesOld;
		if (classSettings.edges != false) {//Если в настройках запрещены ребра, то не брать настройки ребер из cookie
			
			const cookieOptions = {};
			if (options.dat) options.dat.cookie.getObject(this.cookieName, cookieOptions);
			
			edgesOld = cookieOptions.edgesOld || { project: true, };
			if (classSettings.overriddenProperties && !classSettings.overriddenProperties.edges) classSettings.overriddenProperties.edges = () => { return false; };
			classSettings.edges = ((cookieOptions.edges === false) && classSettings.overriddenProperties) ? classSettings.overriddenProperties.edges() : cookieOptions.edges || classSettings.edges;
//			classSettings.edges = classSettings.edges === false ? classSettings.overriddenProperties.edges() : classSettings.edges;
			if (classSettings.edges != false) classSettings.edges = classSettings.edges || {};
			if ((classSettings.edges != false) && (classSettings.edges.project === undefined)) classSettings.edges.project = true;

		}
		if (classSettings.r === undefined) classSettings.r = 1;
		//Нельзя менять радиус гиперсферы
		Object.defineProperty( classSettings, "r", { writable: false, });//classSettings.r freeze. https://stackoverflow.com/a/10843598/5175935

		classSettings.rRange = classSettings.rRange || {};
		if (classSettings.rRange.min === undefined) classSettings.rRange.min = -1;
		if (classSettings.rRange.max === undefined) classSettings.rRange.max = 1;
		classSettings.settings = classSettings.settings || {};
		const settings = classSettings.settings;
		settings.object = settings.object || {};
		settings.object.name = settings.object.name || this.name(options.getLanguageCode);

		//не получается сменить имя оси
		//if (options.scales.w.name === 'w') options.scales.w.name = 't';

		settings.object.geometry = settings.object.geometry || {};

		//for debug
		//для 2D гиперсферы это плотность вероятности распределения вершин по поверхности сферы в зависимости от третьей координаты вершины z = vertice.[2]
		//Плотности разбил на несколько диапазонов в зависимости от третьей координаты вершины z = vertice.[2]
		//Разбил сферу на sc = 5 сегментов от 0 до 4.
		//Границы сегментов вычисляю по фомулам:
		//Высота сегмента hs = d / sc = 2 / 5 = 0.4
		//Нижняя граница сегмента hb = hs * i - r
		//Верхняя граница сегмента ht = hs * (i + 1) - r
		//где r = 1 - радиус сферыб d = 2 * r = 2 - диаметр сферы, i - индекс сегмента
		if (classSettings.debug && (classSettings.debug.probabilityDensity != false)) classSettings.debug.probabilityDensity = [];
		const probabilityDensity = classSettings.debug.probabilityDensity;
		if (probabilityDensity) {

			for (let i = 0; i < 5; i++) probabilityDensity.push({ count: 0, });
			probabilityDensity.options = { d: classSettings.r * 2, };
			probabilityDensity.options.sc = probabilityDensity.length;//Количество сегментов
			probabilityDensity.options.hs = probabilityDensity.options.d / probabilityDensity.options.sc;//Высота сегмента
			let sectorsValue = 0;
			probabilityDensity.forEach((sector, i) => {

				sector.hb = probabilityDensity.options.hs * i - classSettings.r;//Нижняя граница сегмента
				sector.ht = probabilityDensity.options.hs * (i + 1) - classSettings.r;//Верхняя граница сегмента
				sectorsValue += _this.probabilityDensity.sectorValue(probabilityDensity, i);

			});
			let unverseValue = this.probabilityDensity.unverseValue;
			if (unverseValue === undefined) {

				unverseValue = π;
				const r = classSettings.r;
				for (let i = 0; i < (_this.dimension - 1); i++) unverseValue *= 2 * r;

			}
			if (unverseValue != sectorsValue) console.error(sHyperSphere + ': Unverse value = ' + unverseValue + '. Sectors value = ' + sectorsValue);

		}
		settings.object.geometry.angles = settings.object.geometry.angles || this.defaultAngles();
		const anglesObject2Array = () => {
			
			const geometryAngles = settings.object.geometry.angles;
			if (geometryAngles instanceof Array) return;
			const angles = [];
			Object.keys(geometryAngles).forEach((key) => angles[key] = geometryAngles[key]);
			settings.object.geometry.angles = angles;
			
		}
		(classSettings.anglesObject2Array || anglesObject2Array)();
		
		settings.object.geometry.angles = new Proxy(settings.object.geometry.angles || this.defaultAngles(), {

			get: (angles, name) => {

				const verticeId = parseInt(name);
				if (!isNaN(verticeId)) {

					if (verticeId >= angles.length) {

						console.error(sHyperSphere + ': get vertice angles failed! verticeId = ' + verticeId + ' is great angles.length = ' + angles.length);
						return;
						
					}
					const length = _this.dimension - 1;
					const sLongitude = 'longitude', longitudeShift = 1,
						sLatitude = 'latitude', latitudeShift = 2,
						sAltitude = 'altitude', altitudeShift = 3;
					return new Proxy(angles[verticeId], {

						get: (verticeAngles, name) => {

							const angleId = parseInt(name);
							if (!isNaN(angleId)) {

								if (angleId >= verticeAngles.length) return 0.0;
								let angle = verticeAngles[angleId];
								return angle;

							}
							switch (name) {

/*									
								case sLongitude: return verticeAngles[verticeAngles.length - longitudeShift];
								case sLatitude: return verticeAngles[verticeAngles.length - latitudeShift];
								case sAltitude: return verticeAngles[verticeAngles.length - altitudeShift];
*/								
								case sLongitude: {
									
									const id = length - longitudeShift;
									return id < verticeAngles.length ? verticeAngles[id] : 0;

								}
								case sLatitude: {
									
									const id = length - latitudeShift;
									return id < verticeAngles.length ? verticeAngles[id] : 0;

								}
								case sAltitude: {
									
									const id = length - altitudeShift;
									return id < verticeAngles.length ? verticeAngles[id] : 0;

								}
								case 'length': return length;
								case 'forEach': return (item) => {
								
									for (let axisId = 0; axisId < length; axisId++) item(verticeAngles[axisId] != undefined ? verticeAngles[axisId] : 0, axisId);

								}
								case 'returnSub': return (angles) => {

									if (verticeAngles.length != angles.length) console.error('sHyperSphere: settings.object.geometry.angles sub failed! Invalid angles.length = ' + angles.length);
									const res = [];
									verticeAngles.forEach((verticeAngle, Id) => res.push(verticeAngle - angles[Id]));
									return res;
									
								}

							}
							return verticeAngles[name];

						},
						set: (verticeAngles, name, value) => {

							const angleId = parseInt(name);
							if (!isNaN(angleId)) {

								const angle = value;
//								if (angleId >= verticeAngles.length)
								if (angleId >= length)
								{

									console.error(sHyperSphere + ': set vertice angles failed! angleId = ' + angleId + ' is great of verticeAngles.length = ' + verticeAngles.length);
									return false;
								}
								if (verticeAngles[angleId] != angle) {

									const range = angles.ranges[angleId];
									if ((angle < range.min) || (angle > range.max)) console.error(sHyperSphere + ': Set angle[' + angleId + '] = ' + angle + ' of the vertice ' + verticeId + ' is out of range from ' + range.min + ' to ' + range.max);

									verticeAngles[angleId] = angle;

									//если тут обновлять вершину то каждая вершина будет обноляться несколько раз в зависимости от количества углов. Сейчас вершина обновляется после обновления всех углов вершины
									if(_this.isSetPositionAttributeFromPoint != false) {
										
										_this.setPositionAttributeFromPoint(verticeId);//обновляем только одну ось в декартовой системе координат
										_this.bufferGeometry.attributes.position.needsUpdate = true;

									}
									
									//если тут обновлять гиперсферу, то будет тратиться лишнее время, когда одновременно изменяется несколько вершин
									//Сейчас я сначала изменяю все вершины, а потом обновляю гиперсферу
									//_this.update(verticeId);

								}

							} else {

								switch (name) {

									case sLongitude: verticeAngles[verticeAngles.length - longitudeShift] = value; return true;
									case sLatitude: verticeAngles[verticeAngles.length - latitudeShift] = value; return true;
									case sAltitude: verticeAngles[verticeAngles.length - altitudeShift] = value; return true;
										
								}
								verticeAngles[name] = value;

							}
							return true;

						}

					});

				}
				switch (name) {

					case 'pushRandomAngle': return () => {

						const verticeAngles = [];
						_this.pushRandomAngle(verticeAngles);
						angles.push(verticeAngles);

					}
					case 'push': return (verticeAngles) => {

						for (let angleId = 0; angleId < verticeAngles.length; angleId++) {

							const angle = verticeAngles[angleId], range = angles.ranges[angleId];
							if ((angle < range.min) || (angle > range.max)) console.error(sHyperSphere + ': Vertice angle[' + angleId + '] = ' + angle + ' is out of range from ' + range.min + ' to ' + range.max);

						}
						angles.push(verticeAngles);

					}
					case 'guiLength': return angles.length;
					case 'player': return this.anglesPlayer();

				}
				return angles[name];

			},
			//set settings.object.geometry.angles
			set: (aAngles, name, value) => {

				switch (name) {

					case 'guiLength'://изменилось количество вершин
						if (value < 2) return true;
						const angles = settings.object.geometry.angles;
						for (let i = aAngles.length; i < value; i++) angles.pushRandomAngle();//add vertices
						aAngles.length = value;//remove vertice

						//update buffer
						this.setPositionAttributeFromPoints(angles, true);
						aAngles.length = value;//remove vertices
						if (classSettings.edges) {//Для экономии времени не добавляю ребра если на холст вывожу только вершины

							_this.removeMesh();
							_this.pushEdges();

						}
						else _this.project();
						return true;
					case 'length':
						console.warn(sHyperSphere + ': set geometry.angles.length. Use guiLength instead')
						return true;

				}
				const i = parseInt(name);
				if (!isNaN(i)) {

					aAngles[i] = value;
//					const object = _this.object();
					const object = _this.object3D;
					if (object) {
						
						object.userData.myObject.setPositionAttributeFromPoint(i, _this.angles2Vertice(value));
						_this.bufferGeometry.attributes.position.needsUpdate = true;

					}

				}
				else aAngles[name] = value;
				return true;

			}

		});
		this.anglesPlayer = (timeId) => {

			const playerProxy = new Proxy({}, {
						
				get: (player, name) => {

					switch (name) {

						case 'id': return timeId != undefined ? timeId : classSettings.settings.options.player ? classSettings.settings.options.player.getTimeId() : 0;
						case 't': return classSettings.settings.options.player.getTime(timeId);
						case 'r': return playerProxy.t * classSettings.r;
							
					}
					return player[name];
					
				},
				
			});
			return playerProxy;
			
		}
		{//hide angles
			
			const angles = settings.object.geometry.angles;
	
			//Angles range
			angles.ranges = [];
			for (let angleId = 0; angleId < this.dimension - 1; angleId++) {
	
				const range = {}
				switch (this.dimension - 2 - angleId) {
	
					case 0:
						range.angleName = 'Longitude';
						range.min = - π;
						range.max = π;
						break;
					case 1:
						range.angleName = 'Latitude';
						range.min = 0 + this.rotateLatitude;//- π / 2;
						range.max = π + this.rotateLatitude;//π / 2;
						break;
					case 2:
						range.angleName = this.altitudeRange.angleName;//'Altitude';
						range.min = this.altitudeRange.min;//0;
						range.max = this.altitudeRange.max;//π / 2;
						break;
					default: console.error(sHyperSphere + ': vertice angles ranges. Invalid angleId = ' + angleId);
	
				}
				angles.ranges.push(range);
	
			}
	
			//angles[0][0] = 10;//error hyperSphere.js:548 HyperSphere: Set angle[0] = 10 of the vertice 0 is out of range from -1.5707963267948966 to 1.5707963267948966
			if (angles.count != undefined)
				for (let i = angles.length; i < angles.count; i++) angles.pushRandomAngle();

		}
		settings.object.geometry.position = new Proxy(settings.object.geometry.position || [], {

			get: (target, name) => {

				let _position = settings.object.geometry.angles;
				let i = parseInt(name);
				if (!isNaN(i)) {

					if (settings.object.geometry.times){} else {

						if (i > _position.length) console.error(sHyperSphere + ': position get. Invalid index = ' + i + ' position.length = ' + _position.length);
						else if (i === _position.length)
							settings.object.geometry.angles.pushRandomAngle();

					}
					const _vertice = _position[i],
						//anglesPlayer = settings.object.geometry.angles.player,
						//timeId = anglesPlayer.id,
						timeId = _position.player.id,
						// r = anglesPlayer.r;
						angle2Vertice = () => {

							const vertice = _this.angles2Vertice(i, timeId);
							if (classSettings.debug) {
	
								const sum = vertice.radius, r = classSettings.overriddenProperties.r(timeId);
								if (Math.abs(sum - r) > 9.5e-8)
									console.error(sHyperSphere + ': Invalid vertice[' + i + '] sum = ' + sum + '. r = ' + r);
	
							}
							return vertice;
	
						}
					return new Proxy(angle2Vertice(), {

						get: (vertice, name) => {

							switch (name) {

/*									
								//дуга между вершинами
								case 'arcTo': return (verticeTo) => {

									//Calculate the arc length between two points over a hyper-sphere
									//Reference: https://www.physicsforums.com/threads/calculate-the-arc-length-between-two-points-over-a-hyper-sphere.658661/post-4196208
									const a = vertice, b = verticeTo, R = 1, acos = Math.acos;
									let ab = 0;//dot product
									for (let i = 0; i < a.length; i++) ab += a[i] * b[i];
									return R * acos(ab / (R * R))

								}
*/								
								//расстояние между вершинами по прямой в декартовой системе координат
								//Если надо получить расстояние между вершинами по дуге в полярной системе координат, то надо вызвать 
								//classSettings.settings.object.geometry.position.angles[verticeId].distanceTo
								case 'distanceTo': return (verticeTo) => {

									if (verticeTo.length != vertice.length) {

										console.error(sHyperSphere + ': vertice.distanceTo. Invalid vertice.length.');
										return;

									}
									let distance = 0;
									vertice.forEach((axis, i) => distance += Math.pow(axis - verticeTo[i], 2));
									return Math.sqrt(distance);

								}
								case 'edges':

									_vertice.edges = _vertice.edges || new Proxy([], {

										get: (edges, name) => {

											switch (name) {

												case 'push': return (edgeId, verticeId) => {

													const sPush = sHyperSphere + ': Vertice' + (verticeId === undefined ? '' : '[' + verticeId + ']') + '.edges.push(' + edgeId + '):';

													if (edges.length >= _this.verticeEdgesLength) {

														console.error(sPush + ' invalid edges.length = ' + edges.length);
														return;

													}
													//find for duplicate edgeId
													for (let j = 0; j < edges.length; j++) {

														if (edges[j] === edgeId) {

															console.error(sPush + ' duplicate edgeId: ' + edgeId);
															return;

														}

													}

													edges.push(edgeId);

												}

											}
											return edges[name];

										},
									});
									return _vertice.edges;

								case 'angles': return _vertice;
								case 'vector':
									//для совместимости с Player.getPoints. Туда попадает когда хочу вывести на холст точки вместо ребер и использую дя этого MyPoints вместо ND
									const vertice2 = vertice[2], vertice3 = vertice[3];
									//Если вернуть THREE.Vector4 то будет неправильно отображаться цвет точки
									if (vertice3 === undefined)
										return new three.THREE.Vector3(vertice[0], vertice[1], vertice2 === undefined ? 0 : vertice2);
									return new three.THREE.Vector4(vertice[0], vertice[1], vertice2 === undefined ? 0 : vertice2, vertice3 === undefined ? 1 : vertice3);
								case 'x': return vertice[0];
								case 'y': return vertice[1];
								case 'z': return vertice[2];
								case 'w': return vertice[3];//для совместимости с Player.getColors. Туда попадает когда хочу вывести на холст точки вместо ребер и использую для этого MyPoints вместо ND
								case 'toJSON': return (item) => {

									let res = '[';
									vertice.forEach(axis => { res += axis + ', ' })
									return res.substring(0, res.length-2) + ']';
										
								}
								case 'timeId': return timeId;

							}
							if (!isNaN(parseInt(name))) return vertice[name] === undefined ? 0 : vertice[name];
							return vertice[name];

						},
						set: (vertice, name, value) => {

							switch (name) {

								case 'edges':
									_vertice[name] = value;
									if (value === undefined) delete _vertice[name];
									return true;

							}
							vertice[name] = value;
							return true;

						}

					});

				}
				switch (name) {

					case 'angles': return new Proxy(_position, {

						get: (angles, name) => {

							switch (name) {

								case 'length': return angles.length;
								case 'player': return angles.player;

							}
							const verticeId = parseInt(name);
							if (isNaN(verticeId)) {

								console.error(sHyperSphere + ': Get vertice angles failed. Invalid verticeId = ' + verticeId);
								return;

							}
							const vertice = new Proxy(angles[name], {

								get: (angles, name) => {

									switch (name) {

										case 'middleVertice': return (oppositeVerticesId = vertice.oppositeVerticesId, timeId, boPushMiddleVertice = true) => {

											//find middle vertice between opposite vertices

											//Среднее значение углов
											//ссылка не работает https://wiki5.ru/wiki/Mean_of_circular_quantities#Mean_of_angles
											//https://en.wikipedia.org/wiki/Circular_mean

											//массив для хранения сумм декартовых координат противоположных вершин
											//для 1D гиперсферы это: aSum[0] = x, aSum[1] = y.
											//для 2D гиперсферы это: aSum[0] = x, aSum[1] = y, aSum[2] = z.
											//для 3D гиперсферы это: aSum[0] = x, aSum[1] = y, aSum[2] = z, aSum[3] = w.
											const aSum = [];

											const oppositeVertices = [];
											oppositeVerticesId.forEach(oppositeAngleId => {

												const oppositeVertice = classSettings.overriddenProperties.oppositeVertice(oppositeAngleId, timeId);
												oppositeVertice.forEach((axis, i) => {

													if (aSum[i] === undefined) aSum[i] = 0;
													aSum[i] += axis
												
												});
												oppositeVertices.push(oppositeVertice);

											});
/*
											let sum = 0;
											for (let i = 0; i < _this.dimension; i ++) sum += aSum[i];
*/
											let isZero = true;
											for (let i = 0; i < _this.dimension; i ++) {
												
												if(aSum[i] != 0) {

													isZero = false;
													break;
													
												};

											}
											
											//if (isZero === 0) {

												//В этом случае средняя вершина не определена
												//для 1D гиперсферы. Противополжные вершины находятся ровно на противоположных сторонах окружности.
													//Средняя вершина, находится посередине одной из двух дуг, соеденяющих проитвоположные вершины.
												//для 2D гиперсферы это .
												//для 3D гиперсферы это .
												//Думаю тут надо применить вероятностный метод определения средней вершины
											//}
											
											const middleVertice = isZero ? _this.getRandomMiddleAngles(oppositeVertices) : _this.vertice2angles(aSum);
											if (classSettings.debug && classSettings.debug.middleVertice) {

												console.log('opposite to vertice[' + verticeId + '] vertices:');
												oppositeVerticesId.forEach(oppositeVerticeId => {

													const verticeAngles = position[oppositeVerticeId].angles;
													console.log('vertice[' + oppositeVerticeId + '] anlges: ' + JSON.stringify(verticeAngles));

												});
												console.log('Middle vertice ' + JSON.stringify(_this.angles2Vertice(middleVertice, timeId)) + ' angles: ' + JSON.stringify(middleVertice));

											}
											const geometry = settings.object.geometry;
											if (boPushMiddleVertice) classSettings.overriddenProperties.pushMiddleVertice(timeId, middleVertice);
											return middleVertice;

										}
										//идентификаторы всех вершин, которые связаны с текущей вершиной через ребра
										case 'oppositeVerticesId': return new Proxy(angles.edges, {

											get: (verticeEdges, name) => {

												const i = parseInt(name);
												if (!isNaN(i)) {

													const edge = settings.object.geometry.indices.edges[verticeEdges[i]];
													if (verticeId === edge[0]) return edge[1];
													if (verticeId === edge[1]) return edge[0];
													console.error(sHyperSphere + ': Get oppositeVerticesId failed.');
													return;

												}
												return verticeEdges[name];

											}

										});

									}
									return angles[name];

								},

							});
							return vertice;

						},
						set: (angles, name, value) => {

							const verticeId = parseInt(name);
							if (!isNaN(verticeId)) {

								const verticeAngles = angles[verticeId];
								if (classSettings.debug && ((verticeAngles.length != (_this.dimension - 1)) || (value.length != (_this.dimension - 1)))) console.error(sHyperSphere + ': Set vertice[' + verticeId + '] angles failed. Invalid angles count.')
								this.isSetPositionAttributeFromPoint = false;
								for (let j = 0; j < value.length; j++) verticeAngles[j] = value[j];
								delete this.isSetPositionAttributeFromPoint;
								this.setPositionAttributeFromPoint(verticeId);//обновляем geometry.attributes

							} else angles[name] = value;
							return true;

						}
						
					});
					case 'count': return _position.count === undefined ? _position.length : _position.count;
					case 'forEach': return (item) => {

						const pos = classSettings.overriddenProperties.position;
						for (let verticeId = 0; verticeId < pos.length; verticeId++) item(pos[verticeId], verticeId);
					
					}
					case 'length': return _position.length;
					case 'push': return (position) => { console.error(sHyperSphere + ': deprecated push vertice. Use "settings.object.geometry.angles.pushRandomAngle()" instead.'); };

					//for debug
					case 'test': return () => {

						if (!classSettings.debug) return;

						_position.forEach((verticeAngles, verticeId) => {

							/*
							//for testing please uncommet the "//test for angles range" in the http://localhost/anhr/commonNodeJS/master/HyperSphere/Examples/hyperSphere.html page
							let sLog = 'vertice[' + verticeId + '] angles test:\n   verticeAngles[';
							verticeAngles.forEach(angle => sLog = sLog + angle + ', ');
							sLog = sLog + ']\nnormalizedAngles['
							_this.normalizeVerticeAngles(verticeAngles).forEach(angle => sLog = sLog + angle + ', ');
							console.log(sLog + ']');
							*/
							
							for (let angleId = 0; angleId < verticeAngles.length; angleId++) {

								const angle = verticeAngles[angleId];
								const range = settings.object.geometry.angles.ranges[angleId];
								if ((angle < range.min) || (angle > range.max)) {
									
									console.error(sHyperSphere + ': ' + range.angleName + ' angle[' + angleId + '] = ' + angle + ' of the vertice ' + verticeId + ' is out of range from ' + range.min + ' to ' + range.max);
									_position[verticeId] = _this.normalizeVerticeAngles(verticeAngles);

								}

							}
							
							const vertice = settings.object.geometry.position[verticeId], strVerticeId = 'geometry.position[' + verticeId + ']'
							_this.TestVertice(vertice, strVerticeId);
							vertice.edges.forEach(edgeId => {

								if (typeof edgeId !== "number") console.error(sHyperSphere + ': position.test()', strVerticeId = 'position(' + verticeId + ')' + '. ' + strVerticeId + '. Invalid edgeId = ' + edgeId);

							});

						})
					}

				}
				return target[name];//Обращение к settings.object.geometry.position Proxy низшего уровня

			},
			//set settings.object.geometry.position
			set: (target, name, value) => {

				const _position = settings.object.geometry.angles;
				const i = parseInt(name);
				if (!isNaN(i)) {

					if (value instanceof Array === true) {//для совместимости с Player.getPoints. Туда попадает когда хочу вывести на холст точки вместо ребер и использую дя этого MyPoints вместо ND

						console.warn(sHyperSphere + ': Set vertice was deprecated. Use set angle instead.')
						const angles = this.vertice2angles(value);
						if (classSettings.debug) {

							const angles2vertice = this.angles2Vertice(angles);
							if (angles2vertice.length != value.length) console.error(sHyperSphere + ': Set vertice failed. angles2vertice.length = ' + angles2vertice.length + ' is not equal value.length = ' + value.length);
							const d = 0;
							angles2vertice.forEach((axis, i) => { if (Math.abs(axis - value[i]) > d) console.error(sHyperSphere + ': Set vertice failed. axis = ' + axis + ' is not equal to value[' + i + '] = ' + value[i]) });

						}
						settings.object.geometry.position[i].angles(angles);

					}

				} else _position[name] = value;
				return true;

			}

		});
		const position = settings.object.geometry.position;
		
		//иммитация наследования классов
		classSettings.settings.overriddenProperties.positionOffsetId = (positionId) => {
			
			const settings = classSettings.settings;
			return settings.bufferGeometry.userData.timeId * settings.object.geometry.angles.length + positionId;
			
		}
		if (!classSettings.overriddenProperties) classSettings.overriddenProperties = {};
		const overriddenProperties = classSettings.overriddenProperties;
		if (!overriddenProperties.oppositeVertice) overriddenProperties.oppositeVertice = (oppositeAngleId) => { return position[oppositeAngleId]; }
		if (!overriddenProperties.position) Object.defineProperty(overriddenProperties, 'position', { get: () => { return position; }, });
		if (!overriddenProperties.position0) Object.defineProperty(overriddenProperties, 'position0', { get: () => { return position; }, });
		if (!overriddenProperties.updateVertices) overriddenProperties.updateVertices = (vertices) => {

			if (vertices.length != position.length) console.error(sHyperSphere + ': classSettings.overriddenProperties.updateVertices(). Invalid vertices.length = ' + vertices.length);
			for (let verticeId = 0; verticeId < position.length; verticeId++)
				position.angles[verticeId] = vertices[verticeId];
			this.bufferGeometry.attributes.position.needsUpdate = true;
			
		}
		if (!overriddenProperties.vertices) overriddenProperties.vertices = () => { return []; }
		if (!overriddenProperties.r) overriddenProperties.r = (timeId) => { return classSettings.r; }
		if (!overriddenProperties.pushMiddleVertice) overriddenProperties.pushMiddleVertice = () => {}
		if (!overriddenProperties.angles) overriddenProperties.angles = (anglesId) => { return classSettings.settings.object.geometry.angles[anglesId]; }
		if (!overriddenProperties.verticeAngles) overriddenProperties.verticeAngles = (anglesCur, verticeId) => { return anglesCur[verticeId]; }
		if (!overriddenProperties.verticeText) overriddenProperties.verticeText = (intersection, text) => { return text(classSettings.settings.object.geometry.angles,  this.searchNearestEdgeVerticeId(intersection.index, intersection)); }
		if (!overriddenProperties.text) overriddenProperties.text = () => { return ''; }
		if (!overriddenProperties.onSelectSceneEndSetDrawRange) overriddenProperties.onSelectSceneEndSetDrawRange = (timeId) => {}

		//нужно для classSettings.settings.object.geometry.times в проекте universe
		//В этом случае нужно знать количество углов вершины еще до того как будет получена Universe.hyperSphere.dimension
		classSettings.dimension = this.dimension;

		this.pointLength = () => { return this.dimension > 2 ? this.dimension : 3; }//itemSize of the buiffer.attributes.position должен быть больше 2. Иначе при копировании из буфера в THREE.Vector3 координата z = undefined
		this.getPoint = (anglesId, timeId) => {

			const r = classSettings.overriddenProperties.r(timeId),
				angles = typeof anglesId === "number" ? classSettings.overriddenProperties.angles(anglesId, timeId) : anglesId,
				a2v = (angles) => {
	
					//https://en.wikipedia.org/wiki/N-sphere#Spherical_coordinates
					const n = this.dimension, φ = [],//angles,
						x = [], cos = Math.cos, sin = Math.sin;
					if (angles.length != (n - 1)) console.error(sHyperSphere + ': getPoint. angles.length != ' + (n - 1));
					//нужно для того, чтобы начало координат широты находилось на экваторе
					for (let i = 0; i < angles.length; i++) {
		
						const rotateLatitude = this.getRotateLatitude(i);
						φ.push((rotateLatitude === 0 ? 1 : - 1) * angles[i] - rotateLatitude);//Для широты меняем знак угола что бы положительная широта была в северном полушарии
		
					}
		
					//добавляем оси
					
					for (let index = 0; index < n; index++) {
		
						let axis = r;
						const i = this.axes.indices[index],
							mulCount = //количество множителей для данной оси
							i < (n - 1) ?
								i + 1: //на один больше порядкового номера оси
								i;//или равно порядковому номеру оси если это последняя ось
						for (let j = 0; j < mulCount; j++) {
		
							if(j === (mulCount - 1)){
		
								//Это последний множитель для текущей оси
								if (i != (n - 1)) {
									
									//Это не последняя ось
									axis *= cos(φ[j]);
									continue;
		
								}
								
							}
							axis *= sin(φ[j]);
		
						}
						x.push(axis);
		
					}
					return x;
		
				}
			//angles.forEach((angle, i) => { console.log('angle[' + i + '] = ' + angle) })
			const vertice = a2v(angles);
			if (this.classSettings.debug && this.classSettings.debug.testVertice){
	
				const vertice2angles = this.vertice2angles(vertice),
					angles2vertice = a2v(vertice2angles);
				const value = vertice;
				if (angles2vertice.length != value.length) console.error(sHyperSphere + ': Set vertice failed. angles2vertice.length = ' + angles2vertice.length + ' is not equal value.length = ' + value.length);
				const d = 7e-16;
				angles2vertice.forEach((axis, i) => { if(Math.abs(axis - value[i]) > d) console.error(sHyperSphere + ': Set vertices[' + anglesId + '] failed. axis = ' + axis + ' is not equal to value[' + i + '] = ' + value[i]) } );
				
			}
			const proxyVertice = new Proxy(vertice, {

				get: (vertice, name) => {

					switch (name) {

						case 'x': return vertice[0];
						case 'y': return vertice[1];
						case '2':
						case 'z':
							const axisZ = vertice[2];
							return axisZ != undefined ? axisZ : 0;//В двумерной гиперсфере (окружности) координата Z = 0
						case 'w': return vertice[3];
						case 'length':
							const length = vertice.length;
							return length > 2 ? length : 3;
						case 'forEach': return (item) => { for (let verticeId = 0; verticeId < proxyVertice.length; verticeId++) item(proxyVertice[verticeId], verticeId); }

					}
					return vertice[name];

				},

			});
			return proxyVertice;
		
		}

		this.searchNearestEdgeVerticeId = (verticeId, intersection) => {

			if (!classSettings.edges.project) return verticeId;
			if (intersection.nearestEdgeVerticeId != undefined) return intersection.nearestEdgeVerticeId;
			const array = intersection ? intersection.object.geometry.index.array : undefined, edge = array ? [array[intersection.index], array[intersection.index + 1]] : [];
			let minDistance = Infinity;//, pointId;
			const position = intersection.object.geometry.attributes.position,
				point = intersection.point ? intersection.point : new THREE.Vector3().fromBufferAttribute(position, intersection.index),
				distance = (i) => {
				
				const pointIndex = edge[i],
					distance = point.distanceTo(new THREE.Vector3().fromBufferAttribute(position, pointIndex));
				if (minDistance > distance) {

					minDistance = distance;
					intersection.nearestEdgeVerticeId = pointIndex;

				}

			}
			distance(0);
			distance(1);
			return intersection.nearestEdgeVerticeId;

		}
		this.getRotateLatitude = (i) => i === (this.dimension - 3) ? this.rotateLatitude : 0;
		this.setPositionAttributeFromPoints(settings.object.geometry.angles);//itemSize of the buiffer.attributes.position должен быть больше 2. Иначе при копировании из буфера в THREE.Vector3 координата z = undefined

		settings.object.geometry.indices = settings.object.geometry.indices || [];
		if (!(settings.object.geometry.indices instanceof Array)) {

			const indices = [];
			Object.keys(settings.object.geometry.indices).forEach((key) => indices[key] = settings.object.geometry.indices[key]);
			settings.object.geometry.indices = indices;

		}
		const indices = settings.object.geometry.indices;
		indices[0] = indices[0] || [];
		if (indices.edges)
			if (indices.edges instanceof Array) {

				indices[0] = indices.edges;
				indices[0].count = indices.edges.length;

			} else {

				const edges = indices[0];
				Object.keys(indices.edges).forEach((key) => edges[key] = indices.edges[key]);
				indices.edges = edges;

			}
		indices.edges = new Proxy(indices[0], {

			get: (_edges, name) => {

				const edgeId = parseInt(name);
				if (!isNaN(edgeId)) {

					let edge = _edges[edgeId];
					return edge;

				}
				const setVertice = (edge, edgeVerticeId, verticeId, edgeId) => {

					if (verticeId >= position.length) verticeId = 0;
					const vertice = position[verticeId];//push random vertice if not exists
					if (edgeVerticeId != undefined) edge[edgeVerticeId] = verticeId;

					vertice.edges.push(edgeId === undefined ? _edges.length : edgeId, verticeId);

				}
				switch (name) {

					case 'setVertices': return () => {

						if (_edges.length > 0) _this.boTestVertice = false;

					}
					case 'push': return (edge = []) => {

						let vertice0Id = edge[0] === undefined ? _edges.length : edge[0],
							vertice1Id = edge[1] === undefined ? _edges.length + 1 : edge[1];
						const sPushEdge = ': Push edge. '
						if ((vertice0Id >= position.length) || (vertice1Id >= position.length)) {

							console.error(sHyperSphere + sPushEdge + 'edge[' + vertice0Id + ', ' + vertice1Id + ']. Invalid vertice range from 0 to ' + (position.length - 1));
							return;

						}
						if ((position[vertice0Id].edges.length >= _this.verticeEdgesLength) || (position[vertice1Id].edges.length >= _this.verticeEdgesLength))
							return;//Не добавлять новое ребро если у его вершин количество ребер больше или равно _this.verticeEdgesLength
						setVertice(edge, 0, vertice0Id);
						setVertice(edge, 1, vertice1Id);
						if (classSettings.debug) {

							if (edge.length != 2) console.error(sHyperSphere + sPushEdge + 'Invalid edge.length = ' + edge.length);
							else if (edge[0] === edge[1]) console.error(sHyperSphere + sPushEdge + 'edge = [' + edge + '] Duplicate vertices.');
							_edges.forEach((edgeCur, i) => { if (((edgeCur[0] === edge[0]) && (edgeCur[1] === edge[1])) || ((edgeCur[0] === edge[1]) && (edgeCur[1] === edge[0]))) console.error(sHyperSphere + sPushEdge + 'edges[' + i + ']. Duplicate edge[' + edge + ']') });

						}

						return _edges.push(edge);

					}
					case 'pushEdges': return (edge = []) => {

						_edges.count = _edges.count || 3;
						for (let i = 0; i < _edges.count; i++) {

							const edge = _edges[i];
							if (edge) {

								setVertice(edge, 0, edge[0], i);
								setVertice(edge, 1, edge[1], i);

							} else {

								if (i === (_edges.count - 1)) indices.edges.push([settings.object.geometry.position.length - 1, 0])//loop edges
								else indices.edges.push();

							}

						}

					}

				}
				return _edges[name];

			},
			//set indices.edges
			set: (_edges, name, value) => {

				switch (name) {

					case 'length':
						const position = settings.object.geometry.position;
						for (let i = value; i < settings.object.geometry.position.length; i++) position[i].edges = undefined;//delete position[i].edges;
						break;

				}
				_edges[name] = value;
				return true;

			}

		});
		indices.edges.setVertices();

		this.getPositionItem = (vertice, name) => {

			switch (name) {

				case 'radius': 
					let r = 0;
					vertice.forEach(axis => r += axis * axis);
					return Math.sqrt(r);

			}

		}

		this.axisName = (angleId) => {

			//Localization

			const lang = [

				'Altitude',
				'Latitude',
				'Longitude',

			]

			switch (options.getLanguageCode()) {

				case 'ru'://Russian language

					lang[0] = 'Высота';
					lang[1] = 'Широта';
					lang[2] = 'Долгота';
					break;

			}
			return lang[angleId + 4 - _this.dimension];

		}

		//Localization

		const getLanguageCode = options.getLanguageCode;

		const lang = {

			advansed: 'Advansed',

			angles: 'Angles',
			anglesTitle: 'Polar coordinates.',

			angle: 'Angle',

			edges: 'Edges',
			edgesTitle: 'Edges indexes of the vertice',
			oppositeVertice: 'Opposite vertice',

			highlightEdges: 'Highlight',
			highlightEdgesTitle: 'Highlight edges of the vertice.',

			middleVertice: 'Middle vertice',
			middleVerticeTitle: 'Find middle vertice between opposite vertices.',

			plane: 'Plane',
			planes: 'Planes',
			planesTitle: 'Planes of rotation of angles.',

			radius: 'Radius',
			radiusTitle: 'Hypersphere radius.',

			defaultButton: 'Default',
			defaultAnglesTitle: 'Restore default angles.',

			notSelected: 'not selected',
			arc: 'Arc',

			pointId: "Point Id",
			edgeId: "Edge Id",

		};

		const _languageCode = getLanguageCode();

		switch (_languageCode) {

			case 'ru'://Russian language

				lang.advansed = 'Дополнительно';

				lang.angles = 'Углы';
				lang.anglesTitle = 'Полярные координаты.';

				lang.angle = 'Угол';

				lang.edges = 'Ребра';
				lang.edgesTitle = 'Индексы ребер, имеющих эту вершину';
				lang.oppositeVertice = 'Противоположная вершина';

				lang.highlightEdges = 'Выделить';
				lang.highlightEdgesTitle = 'Выделить ребра этой вершины.';

				lang.middleVertice = 'Средняя';
				lang.middleVerticeTitle = 'Найти среднюю вершину между противоположными вершинами.';

				lang.plane = 'Плоскость';
				lang.planes = 'Плоскости';
				lang.planesTitle = 'Плоскости вращения углов.';

				lang.radius = 'Радиус';
				lang.radiusTitle = 'Радиус гиперсферы.';

				lang.defaultButton = 'Восстановить';
				lang.defaultAnglesTitle = 'Восстановить углы по умолчанию';

				lang.notSelected = 'Не выбрано';
				lang.arc = 'Дуга';

				lang.pointId = 'Индекс вершины';
				lang.edgeId = 'Индекс ребра';

				break;
			default://Custom language

		}

		//Эту функцию надо содать до вызова this.pushEdges(); потому что когда используется MyPoints для вывода на холст вершин вместо ребер,
		//вызывается this.project вместо this.pushEdges()
		/**
		 * Projects the hypersphere onto the canvas.
		 * @param {THREE.Scene} scene [THREE.Scene]{@link https://threejs.org/docs/index.html?q=sce#api/en/scenes/Scene}
		 * @param {object} [params={}] The following parameters are available
		 * @param {object} [params.center={x: 0.0, y: 0.0, z: 0.0}] center of the hypersphere
		 * @param {float} [params.center.x=0.0] X axis of the center
		 * @param {float} [params.center.y=0.0] Y axis of the center
		 * @param {float} [params.center.z=0.0] Z axis of the center
		 */
		this.project = (scene, params = {}) => {

			if (scene) {

				_this.classSettings.projectParams = _this.classSettings.projectParams || {};
				_this.classSettings.projectParams.scene = scene;

			} else scene = _this.classSettings.projectParams.scene;

			let nd, myPoints;
			/**
			 * Is the edges displaying on the canvas?
			 * @returns True - yes. False - otherwise.
			 */
			this.isDisplayEdges = () => { return nd != undefined; }
this.object = () => {

	console.warn(sHyperSphere + ': this.object() a was deprecated. Use this.object3D instead')
	return nd && nd.object3D ? nd.object3D : myPoints ? myPoints : undefined;

}
			Object.defineProperty(this, 'object3D', {

				get: () => { return nd && nd.object3D ? nd.object3D : myPoints ? myPoints : undefined; },

			});
			const aAngleControls = [];

			this.objectOpacity = 0.3;
			this.opacity = (transparent = true, opacity = this.objectOpacity) => {

				if (!nd) myPoints.userData.opacity(transparent ? opacity : 1);
//				else nd.opacity(nd.object3D, transparent, opacity);
				else nd.object3Dopacity = opacity;

			}

			const removeObject = (object) => {

				if (!object) return;
				scene.remove(object);
//				if (options.guiSelectPoint) options.guiSelectPoint.removeMesh(object);

			}

			//remove previous hypersphere
			this.remove = (scene) => {

				if (classSettings.boRemove === false) return;
				for (var i = scene.children.length - 1; i >= 0; i--) {

					const child = scene.children[i];
					this.remove(child);
					removeObject(child);

				}

			}
			this.remove(scene);
			this.removeHyperSphere = () => {

//				const object = _this.object();
				const object = _this.object3D;
				if (nd) nd = undefined;
				if (myPoints) myPoints = undefined;
				removeObject(object);

			}
			this.removeMesh = () => {

				settings.object.geometry.indices.edges.length = 0;
				_this.remove(classSettings.projectParams.scene);
				if (nd) nd = undefined;
				if (myPoints) myPoints = undefined;

			}

			this.Test();

			this.color();

			if (this.setW) this.setW();

			this.update = (verticeId, changedAngleId, timeId) => {

				const points = nd && (nd.object3D.visible === true) ? nd.object3D : myPoints;
				/*
				const vertice = settings.object.geometry.position[verticeId];
				this.setPositionAttributeFromPoint(verticeId, vertice, timeId);
				*/
				this.bufferGeometry.attributes.position.needsUpdate = true;
				this.bufferGeometry.attributes.color.needsUpdate = true;
				if (settings.options.axesHelper)
					settings.options.axesHelper.updateAxes();
				const guiSelectPoint = settings.options.guiSelectPoint;
				if (guiSelectPoint) {

					guiSelectPoint.update(true);
					guiSelectPoint.exposePosition();
					const setControl = (control) => {

						if (!control || !control.getValue()) return;
						control.setValue(false);
						control.setValue(true);

					}
					setControl(aAngleControls.cHighlightEdges);
					setControl(aAngleControls.cMiddleVertice);

					if (aAngleControls.cross) {

						aAngleControls.cross.position.copy(settings.object.geometry.position[aAngleControls.oppositeVerticeId]);
						if (aAngleControls.cross.position.z === undefined) aAngleControls.cross.position.z = 0;

					}

					if (aAngleControls.arc) aAngleControls.createArc();

					if (aAngleControls.planes) aAngleControls.planes.update(changedAngleId);

					const position = settings.bufferGeometry.userData.position[verticeId];
					aAngleControls.cRadius.setValue(position.radius);

				}

			}
			this.projectGeometry = () => {
				const raycaster = {
					text: (intersection) => {

						return classSettings.overriddenProperties.verticeText(intersection, (angles, index) => {

							let text = //'\n' + lang.angles + ':'
								classSettings.overriddenProperties.text(/*tab*/'', angles, lang)
								+ '\n' + lang.pointId + ': ' + index
								+ '\n' + lang.angles + ':'
							angles[index].forEach((axisAngle, angleId) => { text += '\n\t' + this.axisName(angleId) + ': ' + axisAngle })
							return text;

						});

					},
				}
				this.line = (settings, r = 1) => {

					const options = classSettings.settings.options;
					settings.object.geometry.indices ||= {};
					settings.object.geometry.indices.edges ||= false;
					return this.newHyperSphere(
						//Если не делать копию classSettings.settings.options, то изменится classSettings.settings.options.scales.w.min и max,
						//что приведет к неправильному цвету вершины в universe при ее ручном изменении
						{

							player: options.player,
							getLanguageCode: options.getLanguageCode,
							guiSelectPoint: options.guiSelectPoint,
							renderer: options.renderer,
							palette: options.palette,
							setPalette: options.setPalette,
							scales: options.scales,
							point: { size: options.point.size, }
							
						},
						{

							cookieName: settings.cookieName,
							boRemove: false,
							boGui: false,
							edges: settings.edges === undefined ? {

								project: settings.randomArc ? false : true,//Если линия создается в виде ребер, то отображать ребра на холсте
								creationMethod: HyperSphere.edgesCreationMethod.Random,

							} : settings.edges,
							projectParams: { scene: classSettings.projectParams.scene, },
//							r: r * classSettings.r,
							r: classSettings.overriddenProperties.r(classSettings.settings.guiPoints ? classSettings.settings.guiPoints.timeId : 0),
							debug: classSettings.debug,
							settings: {

								object: {

									name: settings.object.name,
									color: settings.object.color,
									geometry: {

										MAX_POINTS: settings.object.geometry.MAX_POINTS,
										angles: settings.object.geometry.angles,
										opacity: settings.object.geometry.opacity,
										indices: {

											edges: settings.object.geometry.indices.edges,

										}

									}

								}

							},

						});

				}
				const intersection = (parent) => {

					{//hide userData
						
//						const userData = this.object().userData;
						const userData = this.object3D.userData;
						userData.player = userData.player || {};//for ND
						userData.player.boArrayFuncs = false;//не создавать массив userData.player.arrayFuncs потому что точки объекта буду получать из this.object3D.geometry.attributes.position
						userData.player.arrayFuncs = new Proxy([], {

							get: (arrayFuncs, name) => {

								const verticeId = parseInt(name);
								if (!isNaN(verticeId)) {

//									const position = this.object().geometry.attributes.position;
									const position = this.object3D.geometry.attributes.position;
									return (
										position.itemSize === 4 ?
											new THREE.Vector4() :
											position.itemSize === 3 ?
												new THREE.Vector3() :
												undefined//console.error(sHyperSphere + ': get arrayFuncs item failed! Invalid position.itemSize = ' + position.itemSize)
									).fromBufferAttribute(position, verticeId);
									
								}
								return arrayFuncs[name];
								
							},
							
						});
						
					}
					if (!classSettings.intersection) return;

					if (classSettings.intersection.position === undefined) classSettings.intersection.position = 0;
					const mesh = this.intersection(classSettings.intersection.color === undefined ? "lightgray" ://0x0000FF : //blue
						classSettings.intersection.color, scene);

					//Localization

					const lang = {

						intersector: 'Intersector',

					};

					switch (options.getLanguageCode()) {

						case 'ru'://Russian language

							lang.intersector = 'Сечение';

							break;

					}
					mesh.name = lang.intersector;
					parent.add(mesh);
					if (options.guiSelectPoint) options.guiSelectPoint.addMesh(mesh);

				},
					guiSelectPoint = settings.options.guiSelectPoint,
					gui = (object) => {

						const anglesDefault = [];
						object.userData.gui = {

							get isLocalPositionReadOnly() { return true; },
							get hyperSphere() { return _this; },
							setValues: (verticeId, anglesCur) => {

								//пользователь выбрал вершину

/*бесконечный цикл
								const guiPoints = settings.guiPoints;
								guiPoints.verticeId = 0;
								guiPoints.getVerticeId(parseInt(verticeId));
								verticeId = guiPoints.verticeId;
*/								
								verticeId = parseInt(verticeId);

								let boPushDefaultAngles = true;
								if (verticeId != aAngleControls.verticeId) anglesDefault.length = 0;
								else boPushDefaultAngles = false;//Пользователь отредактировал угол в gui. Не надо изменять anglesDefault
								
								if (!anglesCur) anglesCur = settings.object.geometry.angles;
								const verticeAngles = classSettings.overriddenProperties.verticeAngles(anglesCur, verticeId);

								for (let i = (aAngleControls.cEdges.__select.length - 1); i > 0; i--)
									aAngleControls.cEdges.__select.remove(i);
								_display(aAngleControls.fOppositeVertice.domElement, false);

								if (verticeAngles.edges) {

									const edges = settings.object.geometry.indices.edges;
									const timeVerticeId = settings.guiPoints ? settings.guiPoints.getVerticeId(parseInt(verticeId)) : verticeId;
									verticeAngles.edges.forEach(edgeId => {

										const opt = document.createElement('option'),
											edge = edges[edgeId];
										opt.innerHTML = '(' + edgeId + ') ' + timeVerticeId + ', ' + (
											edge[0] === timeVerticeId ?
												edge[1] : edge[1] === timeVerticeId ?
													edge[0] :
													console.error(sHyperSphere + ': Vertice edges GUI. Invalid edge vertices: ' + edge)
										);
										opt.setAttribute('value', edgeId);
										aAngleControls.cEdges.__select.appendChild(opt);

									});

									//Не нужно показывать список ребер, выреление ребер и среднюю вершину для этой вершины если у вершины нет ребер
									//У вершины нет ребер если пользователь убрал галочку в 'Ребра' в настройках гиперсферы
									const boDisplay = verticeAngles.edges.length === 0 ? false : true;
									_display(aAngleControls.cEdges.domElement.parentElement.parentElement, boDisplay);
									_display(aAngleControls.cHighlightEdges.domElement.parentElement.parentElement, boDisplay);
									_display(aAngleControls.cMiddleVertice.domElement.parentElement.parentElement, boDisplay);

								}

								aAngleControls.verticeId = classSettings.settings.guiPoints && (classSettings.settings.guiPoints.verticeId != undefined) ? classSettings.settings.guiPoints.verticeId : verticeId;

								//если оставить эту линию то если угол выходит за пределы допустимого,
								//то этот угол автоматически возвращается в пределы допустимого с помощью органа управления gui
								//Но это не отображается на изображении гиперсферы
								//_this.isUpdate = false;

								for (let i = 0; i < verticeAngles.length; i++) {

									const angle = verticeAngles[i], cAngle = aAngleControls[i], min = cAngle.__min, max = cAngle.__max;

									//Не изменять позицию вершины когда устанавливаются углы вершины потому
									//что вычисление позиции вершины в зависимости от ее углов приводит к небольшим погрешностям,
									//которые приводят к повлению ошибки
									//Для проверки закоментитвать строку ниже.
									//Открыть http://localhost/anhr/commonNodeJS/master/HyperSphere/Examples/hyperSphere.html
									//Сделать один шаг проигрывателя →
									//Выбрать вершину 3
									//Сделать один шаг проигрывателя →
									//Появится ошибка:
									//HyperSphere: Invalid vertice[2] sum = 0.999078566893569. r = 1
									cAngle.boSetPosition = false;
									
									cAngle.setValue(angle);
									delete cAngle.boSetPosition;
									
									if ((angle < min) || (angle > max)) {

										//Localization

										const lang = {

											error: '%n = %s  of the %v vertice is out of range from %min to %max',

										};

										switch (options.getLanguageCode()) {

											case 'ru'://Russian language

												lang.error = '%n = %s вершины %v выходит из допустимого диапазона от %min до %max';

												break;

										}

										const sError = lang.error.replace('%s', angle).
											replace('%n', cAngle.__li.querySelector(".property-name").innerHTML).
											replace('%v', verticeId).
											replace('%min', min).
											replace('%max', max);
										console.error(sError);
										//alert(sError);

									}
									if (boPushDefaultAngles) anglesDefault.push(angle);

								}

							},
							reset: (verticeId) => {

								const resetControl = (control) => {

									if (!control) return;
									const boValue = control.getValue();
									control.setValue(false);
									if ((verticeId != -1) && boValue) control.setValue(boValue);

								};
								resetControl(aAngleControls.cHighlightEdges);
								resetControl(aAngleControls.cMiddleVertice);
								resetControl(aAngleControls.cPlanes);

								if (aAngleControls.removeCross) aAngleControls.removeCross();
								if (aAngleControls.removeArc) aAngleControls.removeArc();

							},
							addControllers: (fParent, readOnly) => {

								settings.options.guiSelectPoint.setReadOnlyPosition(true);
								const geometry = settings.object.geometry,
									position = geometry.position,
									edges = geometry.indices.edges,
									dat = three.dat,
									fAdvansed = fParent.addFolder(lang.advansed),
									arcColor = 'magenta';
;

								//Angles

								const createAnglesControls = (fParent, aAngleControls, anglesDefault) => {

									const fAngles = fParent.addFolder(lang.angles);
									dat.folderNameAndTitle(fAngles, lang.angles, lang.anglesTitle);
									for (let angleId = 0; angleId < (_this.dimension - 1); angleId++) {

										const angles = settings.object.geometry.angles,
											range = angles.ranges[angleId],
											cAngle = fAngles.add({ angle: 0, }, 'angle', range.min, range.max, 2 * π / 360).onChange((angle) => {

												if (cAngle.boSetPosition === false) return;
//												const guiPoints = _this.object().userData.myObject.guiPoints;
												const guiPoints = _this.object3D.userData.myObject.guiPoints;
												guiPoints.verticeId = undefined;
												const verticeAngles = classSettings.overriddenProperties.verticeAngles(guiPoints.timeAngles || angles, aAngleControls.verticeId);
												if (verticeAngles[angleId] === angle) return;
												verticeAngles[angleId] = angle;
												_this.setPositionAttributeFromPoint(aAngleControls.verticeId, undefined, guiPoints.timeId);
												_this.update(aAngleControls.verticeId, angleId, guiPoints.timeId);
	
											});
										dat.controllerNameAndTitle(cAngle, this.axisName(angleId));

										aAngleControls.push(cAngle); 

									}

									//Restore default angles.
									const cRestoreDefaultAngles = fAngles.add({

										defaultF: () => {
											
											aAngleControls.forEach((cAngle, i) => cAngle.setValue(anglesDefault[i]));
											settings.options.guiSelectPoint.update(true);
										
										},

									}, 'defaultF');
									dat.controllerNameAndTitle(cRestoreDefaultAngles, lang.defaultButton, lang.defaultAnglesTitle);

									return fAngles;

								}
								createAnglesControls(fAdvansed, aAngleControls, anglesDefault);

								aAngleControls.cRadius = fAdvansed.add({ verticeRadius: options.player ? options.player.getTime() : 0, }, 'verticeRadius', options.scales.w.min, options.scales.w.max, (options.scales.w.max - options.scales.w.min)/100).onChange((verticeRadius) => {

									if (readOnly.isReadOnlyController(aAngleControls.cRadius)) return;
									console.log('verticeRadius = ' + verticeRadius);

								});
								dat.controllerNameAndTitle(aAngleControls.cRadius, lang.radius, lang.radiusTitle);
								readOnly.readOnlyEl(aAngleControls.cRadius, true);
								const randomVertices = !classSettings.randomArc ? undefined : this.newRandomVertices(this.object3D, options, {
					
									//np: 360,
									R: this.classSettings.r,
									color: arcColor,
									name: lang.arc,
									debug: true,
								
								});
									
								//Edges

								aAngleControls.cEdges = fAdvansed.add({ Edges: lang.notSelected }, 'Edges', { [lang.notSelected]: -1 }).onChange((edgeId) => {

									edgeId = parseInt(edgeId);
									_display(aAngleControls.fOppositeVertice.domElement, edgeId === -1 ? false : true);
									aAngleControls.removeArc = () => {

										if (aAngleControls.arc && aAngleControls.arc.removeHyperSphere) aAngleControls.arc.removeHyperSphere();
										aAngleControls.arc = undefined;

									}
									aAngleControls.removeCross = () => {

										if (aAngleControls.cross) classSettings.projectParams.scene.remove(aAngleControls.cross);
										aAngleControls.cross = undefined;
//										if (randomVertices) randomVertices.removeOnePointArray();

									}
									let boTransparent;
									if (edgeId === -1) {

										aAngleControls.removeCross();
										aAngleControls.removeArc();
										aEdgeAngleControls.verticeId = undefined;
										boTransparent = false;

									} else {

										const sChangeVerticeEdge = ': Change vertice edge. ',
											edge = edges[edgeId],
											oppositeVerticeId = edge[0] === aAngleControls.verticeId ? edge[1] : edge[1] === aAngleControls.verticeId ? edge[0] : console.error(sHyperSphere + sChangeVerticeEdge + 'Invalid edge vertices: ' + edge),
											oppositeVertice = position[oppositeVerticeId],
											oppositeVerticeAngles = oppositeVertice.angles;
										if (oppositeVerticeAngles.length != aEdgeAngleControls.length) console.error(sHyperSphere + sChangeVerticeEdge + 'Invalid opposite vertice angles length = ' + oppositeVerticeAngles.length);
										aEdgeAngleControls.verticeId = oppositeVerticeId;
										edgeAnglesDefault.length = 0;
										for (let i = 0; i < oppositeVerticeAngles.length; i++) {

											const angle = oppositeVerticeAngles[i],
												cAngle = aEdgeAngleControls[i];
											cAngle.boSetPosition = false;
											cAngle.setValue(angle);
											delete cAngle.boSetPosition;
											edgeAnglesDefault.push(angle);

										}

										//рисуем крестик на противоположной вершине выбранного ребра
										aAngleControls.removeCross();
										vertices.length = 0;
										if (settings.guiPoints) settings.bufferGeometry.userData.selectedTimeId = settings.guiPoints.timeId;
										const crossSize = 0.05;
										pushVertice([0, 0, crossSize]);
										pushVertice([0, 0, -crossSize]);
										pushVertice([-crossSize, -crossSize, 0]);
										pushVertice([crossSize, crossSize, 0]);
										pushVertice([crossSize, -crossSize, 0]);
										pushVertice([-crossSize, crossSize, 0]);
										aAngleControls.cross = addObject2Scene(vertices, 'white');
										aAngleControls.cross.position.copy(oppositeVertice);
										if (aAngleControls.cross.position.z === undefined) aAngleControls.cross.position.z = 0;
										aAngleControls.oppositeVerticeId = oppositeVerticeId;
										aAngleControls.MAX_POINTS = 1 + 2 * 2 * 2 * 2;// * 2 * 2 * 2;//17;//количество вершин дуги когда угол между крайними вершинами дуги 180 градусов. https://stackoverflow.com/questions/31399856/drawing-a-line-with-three-js-dynamically/31411794#31411794

										//Create arc between edge's vertices i.e between vertice and opposite vertice.
										aAngleControls.createArc = () => {

											const arcAngles = [],//массив вершин в полярной системе координат, которые образуют дугу
												vertice = position[aAngleControls.verticeId];
											if (classSettings.randomArc) {

												const params = {

													vertice: vertice.angles,
													oppositeVertice: oppositeVerticeAngles,
													R: classSettings.overriddenProperties.r(options.player.getTimeId()),
													HyperSphere: randomVertices.class,

													//for debug
													random: false,
													onePoint: false,
													onePointArray: false,
													
												}
												if (aAngleControls.arc) randomVertices.changeCirclesPoints(params);
												else aAngleControls.arc = params.random === false ? randomVertices.determinedVertices(params) : randomVertices.createOnePointArray(params);
												return;
												
											}
											let verticeId = 0;
											//если не копировать каждый угол в отделности, то в новой вершине останутся старые ребра
											const copyVertice = (vertice) => {

													const verticeAngles = _this.vertice2angles(vertice)
													if (aAngleControls.arc) {

														aAngleControls.arc.classSettings.settings.object.geometry.angles[verticeId] = verticeAngles;
														aAngleControls.arc.object3D.geometry.drawRange.type = this.bufferGeometry.drawRange.types.edges;//строка выше портит drawRange.type
														verticeId++;

													} else arcAngles.push(verticeAngles);

												},
												arcVerticesCount = 2,
												d = π / arcVerticesCount,
												cd = 1 / Math.sin(d),//Поправка для координат вершин что бы они равномерно располагались по дуге
												//дуга между вершинами
												arcTo = (verticeTo, vertice) => {
				
													//Calculate the arc length between two points over a hyper-sphere
													//Reference: https://www.physicsforums.com/threads/calculate-the-arc-length-between-two-points-over-a-hyper-sphere.658661/post-4196208
													const a = vertice, b = verticeTo, R = 1, acos = Math.acos;
													let ab = 0;//dot product
													for (let i = 0; i < a.length; i++) ab += a[i] * b[i];
//													return R * acos(ab / (R * R));
													const arcValue = R * acos(ab / (R * R));
													if (!classSettings.randomArc) return arcValue;
													let randomArcValue = randomAngle(arcValue);
													/*
													if (classSettings.debug) {

														console.log(sHyperSphere + ': arcTo. arcValue = ' + arcValue);
														for (let i = 0; i < 10; i++) {
															
															randomArcValue = randomAngle(arcValue);
															console.log('  randomArcValue = ' + randomArcValue);

														}

													}
													*/
													return randomArcValue;
				
												},
												distance = arcTo(oppositeVertice, vertice),
												arcCount = distance * (aAngleControls.MAX_POINTS - 1) / π;
											//Не получилось равномерно разделить дугу на части.
											//Если начало и конец дуги расположены напротив друг друга на окружности или на сфере или на 4D hypersphere
											//то все вершины стягиваются к началу и концу дуги за исключением вершины, расположенной посередине дуги
											//Поэтому вершины на дуге получаю путем деления дуги на пополам. Полученные половинки снова делю пополам и т.д.
											let maxLevel = 1;//на сколько частей делить дугу.
											//если maxLevel = 1 то дуга делится на 2 части с одной вершиной посередине
											//если maxLevel = 2 то дуга делится на 4 части с тремя вершинами посередине
											//если maxLevel = 3 то дуга делится на 8 частей с 7 вершинами посередине
											//Таким образом дугу можно разделит только на 2 в степени maxLevel частей
											let count = 2;
											while (count <= arcCount) {

												count *= 2;
												maxLevel++;

											}
/*											
											const verticeAngles = this.vertice2angles(vertice);
											if (this.dimension === 2) {

												oppositeVertice = this.angles2Vertice([verticeAngles[0] + distance]);
												
											}
											else console.error(sHyperSphere + ': aAngleControls.createArc. this.dimension = ' + this.dimension + ' Under constraction')
*/											
											let level = 1;//текущий уровень деления дуги
											copyVertice(vertice);
											let i = 0;
											let halfArcParams = { vertice: vertice, oppositeVertice: oppositeVertice, level: level };
											if (aAngleControls.progressBar) aAngleControls.progressBar.boStop = true;
											aAngleControls.progressBar = new ProgressBar(
												undefined,//settings.options.renderer.domElement.parentElement,
												(progressBar, index, callback) => {

													if (progressBar.boStop) {

														//Этот процес вычисления дуги нужно остановить потому что начался другой процесс вычисления дуги
														progressBar.remove();
														return;

													}

													progressBar.value = i;
													i++;

													//делить дугу на две части

													if (callback) halfArcParams = callback;
													const vertice = halfArcParams.vertice,
														oppositeVertice = halfArcParams.oppositeVertice;
													let level = halfArcParams.level;

													const arcVerticeStep = [];//Шаги, с которым изменяются углы при построении дуги в полярной системе координат
													for (let k = 0; k < vertice.length; k++)
														arcVerticeStep.push((oppositeVertice[k] - vertice[k]) / arcVerticesCount);
													const arcVerice = [];//Координаты вершины в полярной системе координат
													for (let j = 0; j < vertice.length; j++) arcVerice.push(vertice[j] + arcVerticeStep[j] * cd);
													level++;
													if (level <= maxLevel) {

														//если не делать это преобразование,
														//то когда начало и конец дуги находятся на противоположных концах гиперсферы,
														//средняя точка попадает в центр окружности или сферы или гиперсферы,
														//а это находится вне гиперсферы.
														//В этом случае все вершины дуги, кроме средней вершины, стягиваются к началу или концу дуги.
														const halfVertice = _this.angles2Vertice(_this.vertice2angles(arcVerice));

														progressBar.step({

															vertice: vertice, oppositeVertice: halfVertice, level: level,
															next: { vertice: halfVertice, oppositeVertice: oppositeVertice, level: level, next: halfArcParams.next }

														});

													} else {

														if (halfArcParams.next)
															progressBar.step(halfArcParams.next);
														copyVertice(arcVerice);
														copyVertice(oppositeVertice);
														if (!halfArcParams.next) {

															if (aAngleControls.arc) {

																const arc = aAngleControls.arc, geometry = arc.object3D.geometry;
																if (geometry.attributes.position.count < verticeId) console.error(sHyperSphere + '.aAngleControls.createArc: Invalid geometry.attributes.position.count = ' + geometry.attributes.position.count);
//																this.setEdgesRange();
																if (arc.isDisplayEdges()) geometry.setDrawRange(0, verticeId * 2 - 1);//Кличество ребер
																else {

																	geometry.setDrawRange(0, verticeId);
//																	arc.setVerticesRange(0, verticeId);

																}
																//if (classSettings.debug) console.log(' maxLevel = ' + maxLevel + ' position.count = ' + aAngleControls.arc.object3D.geometry.attributes.position.count + ' drawRange.count = ' + arc.object3D.geometry.drawRange.count + ' Vertices count = ' + verticeId);
																geometry.attributes.position.needsUpdate = true;
																geometry.attributes.color.needsUpdate = true;

															} else {

																if (this.child) this.child.arc(aAngleControls, lang, arcAngles);
																else {
																	
//																	console.error(sHyperSphere + ': Непонятно когда сюда попадает')
																	const arcEdges = [];
																	for (let i = 0; i < (aAngleControls.MAX_POINTS - 1); i++) arcEdges.push([i, i + 1]);
																	aAngleControls.arc = this.line({
																	
																		cookieName: 'arc',//если не задать cookieName, то настройки дуги будут браться из настроек гиперсферы
																		//edges: false,
																		randomArc: classSettings.randomArc,
																		object: {
																	
																			name: lang.arc,
																			color: arcColor,
																			geometry: {
																	
																				MAX_POINTS: aAngleControls.MAX_POINTS,
																				angles: arcAngles,
																				//opacity: 0.3,
																				indices: {
																	
																					edges: arcEdges,
																	
																				}
																	
																			}
																	
																		},
																	
																	});

																}

															}
															/*
															if (classSettings.debug) {
																
																console.log(sHyperSphere + ': createArc. maxLevel = ' + maxLevel + ' position.count = ' + aAngleControls.arc.object3D.geometry.attributes.position.count + ' drawRange.count = ' + aAngleControls.arc.object3D.geometry.drawRange.count + ' Vertices count = ' + verticeId);
//																const distance = arcTo(position[aAngleControls.oppositeVerticeId], position[aAngleControls.verticeId]);
																let vertice, distanceDebug = 0;
																const position = aAngleControls.arc.classSettings.settings.object.geometry.position;
																for (let i = 0; i < (verticeId === 0 ? position.length : verticeId); i++) {

																	const verticeCur = position[i];
																	if (vertice)
																		distanceDebug += vertice.distanceTo(verticeCur);
																	vertice = verticeCur;

																}
																console.log(sHyperSphere + ': createArc. distance = ' + distance + ' distanceDebug = ' + distanceDebug + ' error = ' + (distanceDebug - distance) + ' arcAngles.length = ' + arcAngles.length);

															}
															*/
															progressBar.remove();
															aAngleControls.progressBar = undefined;

														}

													}

												}, {

												sTitle: 'Long time iteration process',
												max: maxLevel * maxLevel - 2,

											});

										}
										aAngleControls.createArc();
										boTransparent = true;

									}
									_this.opacity(boTransparent);


								});
								aAngleControls.cEdges.__select[0].selected = true;
								dat.controllerNameAndTitle(aAngleControls.cEdges, lang.edges, lang.edgesTitle);
								const aEdgeAngleControls = [], edgeAnglesDefault = [];
								aAngleControls.fOppositeVertice = fAdvansed.addFolder(lang.oppositeVertice);
								_display(aAngleControls.fOppositeVertice.domElement, false);
								createAnglesControls(aAngleControls.fOppositeVertice, aEdgeAngleControls, edgeAnglesDefault);

								const itemSize = this.bufferGeometry.attributes.position.itemSize,
									vertices = [],
									pushVertice = (vertice) => {

										vertice.forEach(axis => vertices.push(axis))
										for (let i = vertice.length; i < itemSize; i++) vertices.push(0);

										//Каждая вершина должна иметь не меньше 3 координат что бы не поучить ошибку:
										//THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values. 
										for (let i = 0; i < (3 - itemSize); i++) vertices.push(0);

									},
									addObject2Scene = (vertices, color) => {

										const buffer = new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), itemSize > 3 ? itemSize : 3)),
											lineSegments = new THREE.LineSegments(buffer, new THREE.LineBasicMaterial({ color: color, }));
										classSettings.projectParams.scene.add(lineSegments);
										return lineSegments;

									}

								//highlight edges Подсветить ребра для этой вершины

								let oppositeVerticeEdges;
								aAngleControls.cHighlightEdges = fAdvansed.add({ boHighlightEdges: false }, 'boHighlightEdges').onChange((boHighlightEdges) => {

									_this.opacity(boHighlightEdges);
									if (boHighlightEdges) {

										const verticeId = aAngleControls.verticeId,
											angles = position.angles[verticeId];
										vertices.length = 0;
										angles.edges.forEach(edgeId => {

											const edge = geometry.indices.edges[edgeId];
											edge.forEach(edgeVerticeId => { pushVertice(position[edgeVerticeId]); });

										});
										oppositeVerticeEdges = addObject2Scene(vertices, 'white');

									} else {

										if (oppositeVerticeEdges) classSettings.projectParams.scene.remove(oppositeVerticeEdges);
										oppositeVerticeEdges = undefined;

									}

								});
								dat.controllerNameAndTitle(aAngleControls.cHighlightEdges, lang.highlightEdges, lang.highlightEdgesTitle);

								//Middle vertice

								let middleVerticeEdges;
								aAngleControls.cMiddleVertice = fAdvansed.add({ boMiddleVertice: false }, 'boMiddleVertice').onChange((boMiddleVertice) => {

									_this.opacity(boMiddleVertice);
									if (boMiddleVertice) {

										const verticeId = aAngleControls.verticeId,
											angles = classSettings.overriddenProperties.position0.angles[verticeId],
											oppositeVerticesId = angles.oppositeVerticesId,
											settings = classSettings.settings,
											timeId = settings.guiPoints ? settings.guiPoints.timeId : options.player.getTimeId(),
											middleVertice = _this.angles2Vertice(angles.middleVertice(oppositeVerticesId, timeId + 1, false), timeId),
											userData = settings.bufferGeometry.userData;
										
										userData.selectedTimeId = timeId;//Для корректной работы position[oppositeVerticeId] когда во вселенной пользователь выбрал вершину не на последнем времени проигрывателя.
										//Для проверки открыть http://localhost/anhr/universe/main/hyperSphere/Examples/
										//Сделать два шага проигрывателя, нажав →
										//Выбрать вершину не на последнем шаге проигрывателя
										//Вычислить средее значение вершины, пометив пункт "Средняя"
										
										vertices.length = 0;
										oppositeVerticesId.forEach(oppositeVerticeId => {

											pushVertice(middleVertice);
											pushVertice(position[oppositeVerticeId]);

										});
										delete userData.selectedTimeId;
										middleVerticeEdges = addObject2Scene(vertices, 'blue');

									} else {

										if (middleVerticeEdges) classSettings.projectParams.scene.remove(middleVerticeEdges);
										middleVerticeEdges = undefined;

									}

								});
								dat.controllerNameAndTitle(aAngleControls.cMiddleVertice, lang.middleVertice, lang.middleVerticeTitle);

								//Planes of rotation of angles.

								aAngleControls.cPlanes = fAdvansed.add({ boPlanes: false }, 'boPlanes').onChange((boPlanes) => {

									if (!boPlanes) {

										if (aAngleControls.planes) aAngleControls.planes.forEach((plane) => plane.removeHyperSphere())
										aAngleControls.planes = undefined;
										return;

									}

									const vertice = position.angles[aAngleControls.verticeId],
										longitudeId = this.dimension - 2, latitudeId = longitudeId - 1, altitudeId = latitudeId - 1;
									const planeGeometry = (verticeAngleId, planeAngles) => {

										const plane = aAngleControls.planes ? aAngleControls.planes[verticeAngleId] : undefined;
										planeAngles = planeAngles || plane.classSettings.settings.object.geometry.angles;
										let planeVerticeId = 0;

										let start, stop;
										switch (verticeAngleId) {

											case latitudeId:
											case longitudeId:
												start = -π; stop = π;
												break;
											case altitudeId:
												const altitudeRange = settings.object.geometry.angles.ranges[verticeAngleId];
												start = altitudeRange.min; stop = altitudeRange.max;
												break;
											default: console.error(sHyperSphere + ': Planes of rotation of angles. Invalid verticeAngleId = ' + verticeAngleId);

										}
										for (let i = start; i <= stop; i = i + (π / 20)) {

											const planeAngle = [];
											const vertice = position.angles[aAngleControls.verticeId];
											for (let verticeAngleId = 0; verticeAngleId < vertice.length; verticeAngleId++) planeAngle.push(vertice[verticeAngleId]);
											planeAngle[verticeAngleId] = i;

											//if (this.classSettings.debug) console.log(sHyperSphere + ': ' + settings.object.geometry.angles.ranges[verticeAngleId].angleName + '. VerticeId = ' + planeAngles.length);
											planeAngles[planeVerticeId++] = this.normalizeVerticeAngles(planeAngle);

										}
//										if (plane) plane.object().geometry.attributes.position.needsUpdate = true;
										if (plane) plane.object3D.geometry.attributes.position.needsUpdate = true;

									}
									for (let verticeAngleId = 0; verticeAngleId < vertice.length; verticeAngleId++) {

										const planeAngles = [], angleName = settings.object.geometry.angles.ranges[verticeAngleId].angleName;
										planeGeometry(verticeAngleId, planeAngles);
										const planeEdges = [];
										for (let i = 0; i < (planeAngles.length - 1); i++) planeEdges.push([i, i + 1]);
										if (!aAngleControls.planes) {

											aAngleControls.planes = [];
											aAngleControls.planes.update = (changedAngleId) => { this.planesGeometry(changedAngleId, aAngleControls, planeGeometry, longitudeId); }

										}
										aAngleControls.planes[verticeAngleId] = this.line({

											cookieName: 'plane_' + verticeAngleId,//если не задать cookieName, то настройки дуги будут браться из настроек гиперсферы
											object: {

												name: angleName,
												color: 'white',
												geometry: {

													angles: planeAngles,
													opacity: 0.3,
													indices: { edges: planeEdges, }

												}

											},

										}, position.angles.player.t);
										const plane = aAngleControls.planes[verticeAngleId];
										plane.opacity();

									}

								});
								dat.controllerNameAndTitle(aAngleControls.cPlanes, lang.planes, lang.planesTitle);

								if (classSettings.onAddControllers) classSettings.onAddControllers(fAdvansed);
									
								return fAdvansed;

							},

						}

					};
				if ((classSettings.edges != false) && classSettings.edges.project) {

					if (myPoints) {

						myPoints.visible = false;
						if (options.eventListeners) options.eventListeners.removeParticle(myPoints);
						if (guiSelectPoint) {

							guiSelectPoint.removeMesh(myPoints, false);
							myPoints.children.forEach(child => guiSelectPoint.removeMesh(child, false));

						}

					}
					if (nd) {

						nd.object3D.visible = true;
						if (options.eventListeners) options.eventListeners.addParticle(nd.object3D);
						if (guiSelectPoint) {

							guiSelectPoint.addMesh(nd.object3D);
							nd.object3D.children.forEach(child => guiSelectPoint.addMesh(child));

						}

					} else {

						settings.scene = scene;
						if ((settings.object.geometry.indices.edges.length === 0)) this.pushEdges();
						else {

							if ((settings.object.geometry.position[0].length > 3) && (!settings.object.color)) settings.object.color = {};//Color of vertice from palette
							nd = new ND(this.dimension, settings);

							nd.guiPoints.searchNearestEdgeVerticeId = this.searchNearestEdgeVerticeId;

							nd.object3D.userData.raycaster = raycaster;
							
							params.center = params.center || {}
							nd.object3D.position.x = params.center.x || 0;
							nd.object3D.position.y = params.center.y || 0;
							nd.object3D.position.z = params.center.z || 0;

							gui(nd.object3D);

							intersection(nd.object3D);

							if (this.onSelectScene) this.onSelectScene();

						}

					}

				} else {

					if (nd) {

						nd.object3D.visible = false;
						if (options.eventListeners) options.eventListeners.removeParticle(nd.object3D);
						if (guiSelectPoint) {

							guiSelectPoint.removeMesh(nd.object3D);
							nd.object3D.children.forEach(child => guiSelectPoint.removeMesh(child, false));

						}

					}
					if (myPoints) {

						if (myPoints.visible != true) {

							myPoints.visible = true;
							if (options.eventListeners) options.eventListeners.addParticle(myPoints);
							if (guiSelectPoint) {

								guiSelectPoint.addMesh(myPoints);
								myPoints.children.forEach(child => guiSelectPoint.addMesh(child));

							}

						}

					} else {

					const points = undefined;

						//for debug
						//Выводим углы вместо вершин. Нужно для отладки равномерного распределения вершин в гиперсфре
						//См. randomPosition()
						/*
						points = [];
						settings.object.geometry.position.forEach(vertive => points.push(vertive.angles));
						*/

						if (
							(classSettings.settings.object.color != undefined) &&
							(typeof classSettings.settings.object.color != "object") &&
							(typeof classSettings.settings.object.color != "function")
						) {

							const color = new three.THREE.Color(classSettings.settings.object.color);
							classSettings.settings.options.setPalette(new ColorPicker.palette({ palette: [{ percent: 0, r: color.r * 255, g: color.g * 255, b: color.b * 255, },] }));

						}
						new MyPoints(points, scene, {

							pointsOptions: {

								name: settings.object.name,
								color: this.color(),//settings.object.color,
								colors: settings.object.geometry.colors,
								opacity: settings.object.geometry.opacity,
								onReady: (points) => {

									myPoints = points;
									myPoints.userData.raycaster = raycaster;
									gui(myPoints);
									intersection(points);

								},
								guiPoints: settings.guiPoints,
								//shaderMaterial: false,

							},
							options: settings.options,
							object: settings.object,
							bufferGeometry: settings.bufferGeometry,
							isPositionControllerReadOnly: true,
							isSetPosition: settings.isSetPosition,
							guiPoints: settings.guiPoints,

						});

					}

				}

			}
			this.projectGeometry();

			//шаг проигрывателя player
			//Вычислем middle vertices
			this.middleVertices = (timeId, t) => {

				if (timeId === 0) return;//не вычисляется средняя точка когда проигрыватель в начале
				const geometry = settings.object.geometry, position = geometry.position, edges = geometry.indices.edges;
				if (edges.length === 0) {

					//Create edges
					this.onSelectScene = () => {

						//Непонятно как сюда попадает
						options.onSelectScene(/*index,*/ t);
						delete this.onSelectScene;

					}
					if (cEdges) cEdges.setValue(true);
					else {

						//нет ручной настройки
						classSettings.edges = cookieOptions.edgesOld || edgesOld;
						_this.projectGeometry();

					}
					return;

				}
				let progressBar, verticeId = 0;
				if ((typeof WebGPU != 'undefined') && WebGPU.isSupportWebGPU()) {

					const firstMatrix = [
							[1, 2, 3, 4],
							[5, 6, 7, 8]
						],
						secondMatrix = [
							[1, 2],
							[3, 4],
							[5, 6],
							[7, 8],
						];
					new WebGPU({

						input: { matrices: [firstMatrix, secondMatrix] },

						//shaderCode: shaderCode,
						shaderCodeFile: '../Shader.c',

						results: [

							{

								count: firstMatrix.length * secondMatrix[0].length +

									//result matrix has reserved three elements in the head of the matrix for size of the matrix.
									//First element is dimension of result matrix.
									//Second element is rows count of the matrix.
									//Third element is columns count of the matrix.
									//See settings.size of out2Matrix method in https://raw.githack.com/anhr/WebGPU/master/jsdoc/module-WebGPU-WebGPU.html
									3,
								out: out => {

									console.log('out:');
									console.log(new Float32Array(out));
									const matrix = WebGPU.out2Matrix(out);
									console.log('matrix:');
									console.log(matrix);

								}

							},
						],

					});

				}
				const overriddenProperties = classSettings.overriddenProperties,
					vertices = overriddenProperties.vertices(),
					timestamp = classSettings.debug ? window.performance.now() : undefined,
					step = () => {

						progressBar.value = verticeId;
						const stepItem = () => {

							const vertice = overriddenProperties.position0.angles[verticeId].middleVertice(undefined, timeId);
							if (vertices) vertices.push(vertice);
							verticeId += 1;
							if (verticeId >= position.length) {

								progressBar.remove();

								if (classSettings.debug) classSettings.debug.logTimestamp('Play step. ', timestamp);

								//Обновление текущей вершины без обновления холста для экономии времени
								overriddenProperties.updateVertices(vertices);

								if (classSettings.debug) {

									classSettings.debug.logTimestamp('Copy vertices. ', timestamp);
									this.logHyperSphere();

								}
								else this.oldR = undefined;
								this.onSelectSceneEnd(timeId);
								return true;

							}
							//options.player.continue();

						}
						if (!stepItem()) progressBar.step();

					},
					bufferGeometry = classSettings.settings.bufferGeometry,
					drawRange = bufferGeometry.drawRange,
					sTakeMiddleVertices = 'Take middle vertices';
				if (classSettings.debug.log != false) console.log('\ntimeId = ' + timeId + '. ' + sTakeMiddleVertices + '.')

				//Установить drawRange что бы не появлялась ошибка
				//HyperSphere.angles2Vertice: anglesId = 2. positionId = 28 is out of range from 0 to 24
				this.setVerticesRange(drawRange.start,
					((drawRange.start + drawRange.count) / (bufferGeometry.index != null ? bufferGeometry.attributes.position.itemSize : 1)) + position.length);
				
				progressBar = new ProgressBar(options.renderer.domElement.parentElement, step, {

					sTitle: 't = ' + t + '<br> ' + sTakeMiddleVertices,
					max: position.length - 1,

				});
				return true;//player pause

			}

			if (classSettings.debug)
				classSettings.debug.logTimestamp('Project. ');

		}
		this.onSelectSceneEnd = (timeId) => {

			classSettings.overriddenProperties.onSelectSceneEndSetDrawRange(timeId);
			
			//Если не установить это значение, то будет неверно устанавливаться значение w в 
			options.player.endSelect();
			
			options.player.continue();
			
		}
		if (classSettings.mode === undefined) classSettings.mode = 0;//решил оставить режим, в котором сначала добавляются ребра а потом уже создаются вершины для них
		switch (classSettings.mode) {

			//connect vertices by edges
			case 0:

				//default vertices
				if (this.verticesCountMin === undefined) {

					console.error(sHyperSphere + ': Please define verticesCountMin in your child class.');
					break;

				}
				const count = position.count === undefined ? this.verticesCountMin : position.count;
				if (count < 2) {

					//Сюда попадает когда вычисляется единичная случайная точка
					//Для проверки в файле http://localhost/anhr/commonNodeJS/master/HyperSphere/Examples/circleOnSphere.html
					//установить params.op = true - создать одну случайную точку
					//Запустить http://localhost/anhr/commonNodeJS/master/HyperSphere/Examples/circleOnSphere.html
					//console.error(sHyperSphere + ': Invalid classSettings.settings.object.geometry.position.count < 2');
					//return;

				}

				if (probabilityDensity) {

					//для 2D гиперсферы это плотность вероятности распределения вершин по поверхости сферы в зависимости от третьей координаты вершины z = vertice.[2]
					//Плотности разбил на несколько диапазонов в зависимости от третьей координаты вершины z = vertice.[2]
					//Разбил сферу на sc = 5 сегментов от 0 до 4.
					//Границы сегментов вычисляю по фомулам:
					//Высота сегмента hs = d / sc = 2 / 5 = 0.4
					//Нижняя граница hb = hs * i - r
					//Верхняя граница ht = hs * (i + 1) - r
					//где r = 1 - радиус сферыб d = 2 * r = 2 - диаметр сферы, i - индекс сегмента
					//0. From -1 to -0.6
					//1. From -0.6 to -0.2
					//2. From -0.2 to 0.2
					//3. From 0.2 to 0.6
					//4. From 0.6 to 1
					console.log('');
					console.log('Probability density.');
					const table = [];
					probabilityDensity.forEach((segment, segmentId) => {

						segment.density = segment.count / segment[_this.probabilityDensity.sectorValueName];//segment.square;
						segment.height = segment.ht - segment.hb;
						table.push(segment);

					})
					const sectorValueName = _this.probabilityDensity.sectorValueName;
					if (!sectorValueName) console.error(sHyperSphere + ': Invalid sectorValueName = ' + sectorValueName);
					console.table(table, ['count', 'hb', 'ht', 'height', sectorValueName, 'density']);
					console.log('');
					classSettings.debug.logTimestamp('Push positions. ');

				}
				this.pushEdges = () => {

					const geometry = this.classSettings.settings.object.geometry, edges = geometry.indices.edges, position = geometry.position;

					//Localization

					const lang = { progressTitle: "Creating edges.<br>Vertice's edges %s from " + this.verticeEdgesLength, };

					switch (settings.options.getLanguageCode()) {

						case 'ru'://Russian language

							lang.progressTitle = 'Создание ребер.<br>Ребер у вершины %s из ' + this.verticeEdgesLength;
							break;

					}

					if (classSettings.edges.creationMethod === undefined) classSettings.edges.creationMethod = edgesCreationMethod.Random;
					switch (classSettings.edges.creationMethod) {

						case edgesCreationMethod.Random:
							let verticeEdgesCur = 1, verticeId = 0,
								boCompleted = false;//Кажется это не нужно
							const progressBar = new ProgressBar(settings.options.renderer.domElement.parentElement, () => {

								const nextVertice = () => {

									progressBar.value = verticeId;

									//цикл поиска вершины, в которую можно добавить еще одно ребро
									const verticeIdStart = verticeId;
									do {

										verticeId++;
										if (verticeId >= position.length) {

											verticeEdgesCur++;
											progressBar.title(lang.progressTitle.replace('%s', verticeEdgesCur + 1));
											if (verticeEdgesCur >= this.verticeEdgesLength) {

												if (this.projectGeometry) this.projectGeometry();
												if (classSettings.debug) classSettings.debug.logTimestamp('Push edges. ');
												progressBar.remove();
												const edges = settings.object.geometry.indices[0], times = settings.object.geometry.times;
												edges.timeEdgesCount = edges.length;
												if (times) {

													const timeVerticesCount = settings.object.geometry.times[0].length;
													for (let timeId = 1; timeId < settings.object.geometry.rCount; timeId++){
	
														const  shift = timeVerticesCount * timeId;
														for (let edgeId = 0; edgeId < edges.timeEdgesCount; edgeId++) {
	
															const edge = edges[edgeId];
															edges.push([edge[0] + shift, edge[1] + shift]);
	
														}
															
													}

												}
												if (this.classSettings.projectParams) this.project(this.classSettings.projectParams.scene, this.classSettings.projectParams.params);
												if (times && classSettings.edges.project)
													this.setEdgesRange();
												if (classSettings.overriddenProperties.project) classSettings.overriddenProperties.project();
												boCompleted = true;
												return;

											}
											verticeId = 0;

										}

									} while ((position[verticeId].edges.length >= this.verticeEdgesLength) && (verticeIdStart != verticeId));
									progressBar.step();

								}
								if (boCompleted) return;
								let oppositeVerticeId = verticeId + 1;
								if (oppositeVerticeId >= position.length) oppositeVerticeId = 0;
								//Поиск вершины у которой ребер меньше максимального количества ребер и у которой нет нового ребра
								const oppositeVerticeIdFirst = oppositeVerticeId;
								while (true) {

									const oppositeVerticeEdges = position[oppositeVerticeId].edges;
									if (oppositeVerticeEdges.length < this.verticeEdgesLength) {

										//поиск нового ребра в списке ребер этой вершины
										let boContinue = false;
										for (let oppositeVerticeEdgeId = 0; oppositeVerticeEdgeId < oppositeVerticeEdges.length; oppositeVerticeEdgeId++) {

											const oppositeVerticeEdge = edges[oppositeVerticeEdges[oppositeVerticeEdgeId]];
											if (
												(oppositeVerticeEdge[0] === verticeId) && (oppositeVerticeEdge[1] === oppositeVerticeId) ||
												(oppositeVerticeEdge[1] === verticeId) && (oppositeVerticeEdge[0] === oppositeVerticeId)
											) {

												boContinue = true;//это ребро уже существует
												break;

											}

										}
										if (boContinue) {

											oppositeVerticeId++;
											if (oppositeVerticeId >= position.length) oppositeVerticeId = 0;
											continue;//Новое ребро уже есть в текущей вершине. Перейти на следующую вершину

										}
										break;//нашел противоположное ребро

									} else {

										oppositeVerticeId++;
										if (oppositeVerticeId >= position.length) oppositeVerticeId = 0;

									}
									if (oppositeVerticeIdFirst === oppositeVerticeId) break;

								}

								//Возможно был пройден полный круг поиска противолположной вершины и ничего найдено не было
								if (verticeId != oppositeVerticeId) edges.push([verticeId, oppositeVerticeId]);

								nextVertice();

							}, {

								sTitle: lang.progressTitle.replace('%s', verticeEdgesCur + 1),
								max: position.length,
								timeoutPeriod: 3,

							});
							break;
						default: console.error(sHyperSphere + ': pushEdges. Invalid classSettings.edges.creationMethod = ' + classSettings.edges.creationMethod);

					}

				}
				this._verticeEdgesLength = this.verticeEdgesLengthMax;

				if (
					classSettings.edges &&
					(classSettings.settings.object.geometry.indices.edges.length === 0)//ребер нет
				) this.pushEdges();//Для экономии времени не добавляю ребра если на холст вывожу только вершины
				else if (this.classSettings.projectParams) this.project(this.classSettings.projectParams.scene, this.classSettings.projectParams.params);

				break;

			case 1: indices.edges.pushEdges(); break;//push edges. сначала добавляются ребра а потом уже создаются вершины для них
			default: console.error(sHyperSphere + ': Unknown mode: ' + classSettings.mode); return;

		}

		let cEdges;
		if (options.dat && options.dat.gui && (classSettings.boGui != false)) {

			const getLanguageCode = options.getLanguageCode;

			//Localization

			const lang = {

				vertices: 'Vertices',
				verticesCount: 'Count',
				verticesCountTitle: 'Vertices count',

				edges: 'Edges',
				edgesTitle: 'Create edges',

				edge: 'Edge',

				verticeEdgesCountTitle: 'Количество ребер у вершины',

				project: 'Project',
				projectTitle: 'Project edges onto canvas',

			};

			const _languageCode = getLanguageCode();

			switch (_languageCode) {

				case 'ru'://Russian language

					lang.vertices = 'Вершины';
					lang.verticesCount = 'Количество';
					lang.verticesCountTitle = 'Количество вершин';

					lang.edges = 'Ребра';
					lang.edgesTitle = 'Создать ребра';

					lang.edge = 'Ребро';

					lang.verticeEdgesCountTitle = 'Количество ребер у вершины';

					lang.project = 'Отображать';
					lang.projectTitle = 'Отображать ребра на холсте';

					break;

			}

			const folders = options.dat.gui.__folders;
			let fParent;
			Object.keys(folders).forEach((key) => {

				const folder = folders[key], id = folder.id;
				if (id && (id === 'fOptions')) fParent = folder;

			});
			const name = this.name(getLanguageCode);
			if (fParent.__folders[name]) return;//на холсте несколько гиперсфер
			const fHyperSphere = fParent.addFolder(name), dat = three.dat;
			const addSettingsFolder = classSettings.overriddenProperties.addSettingsFolder;
			if (addSettingsFolder) addSettingsFolder(fParent, getLanguageCode);

			//vertices

			const fVertices = fHyperSphere.addFolder(lang.vertices);
			fVertices.add(new PositionController((shift) => { cVerticesCount.setValue(settings.object.geometry.angles.length + shift); },
				{ settings: { offset: 1, }, min: 1, max: 1000, step: 1, getLanguageCode: options.getLanguageCode }));

			//Vertices count
			const cVerticesCount = dat.controllerZeroStep(fVertices, settings.object.geometry.angles, 'guiLength');
			dat.controllerNameAndTitle(cVerticesCount, lang.verticesCount, lang.verticesCountTitle);

			//vertice edges

			const fVerticeEdges = fVertices.addFolder(lang.edges);
			fVerticeEdges.add(new PositionController((shift) => { cVerticeEdgesCount.setValue(this.verticeEdgesLength + shift); },
				{ settings: { offset: 1, }, min: 1, max: 10, step: 1, getLanguageCode: options.getLanguageCode }));

			//Vertice edges count
			const cVerticeEdgesCount = dat.controllerZeroStep(fVerticeEdges, this, 'verticeEdgesLength');
			dat.controllerNameAndTitle(cVerticeEdgesCount, lang.verticesCount, lang.verticeEdgesCountTitle);

			//edges

			const objectEdges = { boEdges: ((typeof classSettings.edges) === 'object') || (classSettings.edges === true) ? true : false },
				setCockie = () => { options.dat.cookie.setObject(_this.cookieName, { edges: classSettings.edges, edgesOld: edgesOld, }); };
			if (!classSettings.overriddenProperties.isEdgesOnly) classSettings.overriddenProperties.isEdgesOnly = () => { return false; }
			cEdges = fHyperSphere.add(objectEdges, 'boEdges').onChange((boEdges) => {

				if (boEdges) {

					classSettings.edges = edgesOld;
					if (!classSettings.edges) classSettings.edges = { project: false, }
					cProject.setValue(classSettings.edges.project);

				} else {

					if (classSettings.overriddenProperties.isEdgesOnly()) {

						cEdges.setValue(true);
						return;

					}
					edgesOld = classSettings.edges;
					classSettings.edges = false;

				}

				displayEdge();
				_this.projectGeometry();
				setCockie();

			});
			const fEdge = fHyperSphere.addFolder(lang.edge),
				objectEdge = { boProject: ((typeof classSettings.edges) === 'object') ? classSettings.edges.project : false },
				cProject = fEdge.add(objectEdge, 'boProject').onChange((boProject) => {

					if (classSettings.edges.project === boProject) return;
					classSettings.edges.project = boProject;
					_this.projectGeometry();
					setCockie();

				}),
				displayEdge = () => { _display(fEdge.domElement, classSettings.edges); };
			displayEdge();
			dat.controllerNameAndTitle(cEdges, lang.edges, lang.edgesTitle);
			dat.controllerNameAndTitle(cProject, lang.project, lang.projectTitle);

		}
		this._verticeEdgesLength;
		this.boTestVertice = true;

	}

	/**
	 * get default color is 'lime'
	 */
	get defaultColor() { return 'lime'; }

	/**
	 * get hyper sphere angles. See <b>classSettings.settings.object.geometry.angles</b> parameter of the <b>hyperSphere</b> constructor.
	 */
	get angles() {

		//без разницы какую строку выбрать
		return this.classSettings.settings.object.geometry.angles;
		//return this.classSettings.settings.object.geometry.position.angles
	
	}
	/**
	 * set hyper sphere angles. See <b>classSettings.settings.object.geometry.angles</b> parameter of the <b>hyperSphere</b> constructor.
	 */
	set angles(anglesNew) {

		if (this.classSettings.settings.object.geometry.angles.length != anglesNew.length) {

			console.error(sHyperSphere + ': set angles. Invalid anglesNew.length = ' + anglesNew.length);
			return;
		}
		this.classSettings.settings.object.geometry.angles.forEach((angles, anglesId) => {

			const anglesNewItem = anglesNew[anglesId];
			angles.forEach((angle, angleId) => { angles[angleId] = anglesNewItem[angleId] });
			
		})

	}

	get verticeEdgesLength() { return this._verticeEdgesLength; }
/*
	set verticeEdgesLength(length) {

		this._verticeEdgesLength = length;
		if (this.removeMesh) this.removeMesh();
		this.pushEdges();

	}
*/

	//base methods

	/**
	 * Push random longitude into vertice angles
	 * @param {array} verticeAngles vertice angles
	 */
	pushRandomLongitude(verticeAngles) {

		const ranges = this.classSettings.settings.object.geometry.angles.ranges, longitudeRange = ranges[ranges.length - 1];
		verticeAngles.push(Math.random() * (longitudeRange.max - longitudeRange.min) + longitudeRange.min);
		
	}
	/**
	 * Base method that returns a name of the hyper sphere in the child classes.
	 * @returns a console error if your call this method directly.
	 */
	name() { console.error(sOverride.replace('%s', 'name')); }
	/**
	 * Base method that returns a RandomVertices child class.
	 * @returns a console error if your call this method directly.
	 */
	newRandomVertices() { console.error(sOverride.replace('%s', 'newRandomVertices')); }

	/////////////////////////////////////base methods

	/**
	 * Writes to console an important information about hyper sphere, that can help you for debugging.
	 */
	logHyperSphere() {

		if (!this.classSettings.debug || (this.classSettings.debug.log === false)) return;
		console.log(this.cookieName);
		let i = 0, progressBarValue = 0,
			log = 0;//position log
		const settings = this.classSettings.settings, geometry = settings.object.geometry, position = geometry.position, edges = geometry.indices.edges,
			sLogHyperSphere = sHyperSphere + ': logHyperSphere()',
			progressBar = new ProgressBar(settings.options.renderer.domElement.parentElement, () => {

				switch (log){
					case 0://vertices log
						const vertice = position[i];
						console.log('vertice[' + i + '] = ' + JSON.stringify(vertice) + ', timeId = ' + vertice.timeId + ', angles = ' + JSON.stringify(vertice.angles) + ' edges = ' + JSON.stringify(vertice.edges) + ' r = ' + vertice.radius);
						break;
					case 1://edges log
						const edge = edges[i];
						console.log('edges[' + i + '] = ' + JSON.stringify(edge))
						break;
					default: console.error(sLogHyperSphere + '. Invalid log = ' + log);
				}
				progressBar.value = progressBarValue;
				progressBarValue++;
				i++;
				switch (log){
					case 0://position log
						if (i === position.length) {

							if (this.classSettings.debug.edges === false) {
								
								progressBar.remove();
								break;

							}
							log++;//edges log
							i = 0;

						}
						progressBar.step();
						break;
					case 1://edges log
						if (i >= edges.length) {
							
							progressBar.remove();
							this.oldR = undefined;
							if (this.classSettings.debug)
								this.classSettings.debug.logTimestamp('Geometry log. ');
							
						} else progressBar.step();
						break;
					default: console.error(sLogHyperSphere + '. Invalid log = ' + log);
				}
				
			}, {

			sTitle: 'Geometry log',
			max: position.length - 1 + edges.length - 1,

		});
		
	}
	/**
	 * <pre>
	 * Writes a console error, if any vertices angle is out of the angles range. Normalizes a vertices angle to available range, if out of the angles range is occures.
	 * Writes a console error, if identifier of any edge of the vertices is incorrect.
	 * </pre>
	 */
	Test(){

		if (!this.classSettings.debug) return;
		
		const geometry = this.classSettings.settings.object.geometry;
		geometry.position.test();

		//for future using
		if (geometry.indices.faces) geometry.indices.faces.test();
		
	}
	/**
	 * Writes a console error, if vertice edges count is incorrect.
	 * @param {object} vertice vertice for testing
	 * @param {string} strVerticeId name of the vertice Id
	 */
	TestVertice(vertice, strVerticeId){

		if (!this.boTestVertice) return;
		if (this.classSettings.edges === false) return;
		if (vertice.edges.length < (this.verticeEdgesLength - 1))//Допускается количество ребер на одно меньше максимального значения потому что при опреденном количестве вершин для некоротых вершин не хватает противоположных вершин
			console.error(sHyperSphere + ': Test(). Invalid ' + strVerticeId + '.edges.length = ' + vertice.edges.length);
		
	}
	/**
	 * Converts a vertice angles to vertice position.
	 * @param {number|array} anglesId 
	 * <pre>
	 * number: vertice id
	 * array: array of the vertice angles
	 * </pre>
	 * @param {number} timeId player time id
	 * @returns Vertice position.
	 */
	angles2Vertice(anglesId, timeId) {

		if (typeof anglesId != "number")
			return this.getPoint(anglesId, timeId);

		if (this.classSettings.debug) {
				
			if (anglesId >= this.bufferGeometry.userData.position.length) console.error(sHyperSphere + '.angles2Vertice: Invalid anglesId = ' + anglesId);
			//Пока что не вижу случая, когда надо получить position за пределами this.bufferGeometry.drawRange
			else {

				const bufferGeometry = this.bufferGeometry, drawRange = bufferGeometry.drawRange;
				if (drawRange.type === drawRange.types.vertices) {
						
					const count = bufferGeometry.drawRange.count, start = bufferGeometry.drawRange.start,
						offset = this.positionOffset(this.bufferGeometry.attributes.position, anglesId);
					let sError;
					if (bufferGeometry.index === null) {

						const positionId = offset / bufferGeometry.attributes.position.itemSize;
						if ((positionId >= (count + start)) || (positionId < start))
							sError = '. positionId = ' + positionId;
							
					} else {
							
						if ((offset >= (count + start)) || (offset < start))
							sError = '. offset = ' + offset;

					}
					if ( sError != undefined ) console.error(sHyperSphere + '.angles2Vertice: anglesId = ' + anglesId + sError + ' is out of range from ' + start + ' to ' + (count + start));

				}

			}

		}
		const userData = this.classSettings.settings.bufferGeometry.userData, playerIndexCur = userData.timeId;
		if (timeId === undefined) timeId = playerIndexCur;
		userData.timeId = timeId;
		const vertice = this.bufferGeometry.userData.position[anglesId];
		userData.timeId = playerIndexCur;
		return vertice;

	}
	/**
	 * Converts a vertice position to vertice angles.
	 * @param {array} vertice array of the vertice axes
	 * @returns Vertice angles.
	 */
	vertice2angles(vertice) {
		
		//https://en.wikipedia.org/wiki/N-sphere#Spherical_coordinates
		//тангенс — отношение стороны противолежащего катета vertice[1] к стороне прилежащегоvertice[0], (tg или tan);
		const x = [],//для разных размерностей гиперсферы координаты вершины расположены в разном порядке в соответствии с this.axes.indices
			n = this.dimension - 1, φ = [], atan2 = Math.atan2, sqrt = Math.sqrt;

		if (vertice.length <= n) {

			console.error(sHyperSphere + ': vertice2angles. Invalid vertice.length = ' + vertice.length);
			return;
			
		}

		for (let index = 0; index < vertice.length; index++) x.push(vertice[this.axes.indices[index]]);

		for (let i = 0; i < n; i++) {

			const axes = {};
			if (i === (n - 1)) {
				
				axes.y = x[n]; axes.x = x[n - 1];
				
			} else {
				
				let sum = 0;
				for(let j = (i + 1); j <= n; j++) sum += x[j] * x[j];
				axes.y = sqrt(sum); axes.x = x[i];

			}
			const rotateLatitude = this.getRotateLatitude(i);
			φ.push((rotateLatitude === 0 ? 1 : -1) * atan2(axes.y, axes.x) - rotateLatitude);//Для широты меняем знак угола что бы положительная широта была в северном полушарии
			
			
		}

		//установить углы так, что бы они влезли допустимый диапазон органов управления углов, когда пользователь захочет посмотреть или изменить эти углы
		const longitudeId = φ.length - 1, latitudeId = longitudeId - 1, altitudeId = latitudeId - 1,
			ranges = this.classSettings.settings.object.geometry.angles.ranges;
		let latitude = φ[latitudeId], longitude = φ[longitudeId], altitude = φ[altitudeId];
		if (altitude != undefined) {//у одномерной и двумернй гиперсферы нет высоты

			const altitudeRange = ranges[altitudeId];
			if (altitude > altitudeRange.max) {//π / 2
				
			} else if (altitude < altitudeRange.min) {//0
				
				console.error('Under constraction')
				altitude -= π;
	
			}
			φ[altitudeId] = altitude;
			
		}
		if (latitude != undefined) {//у одномерной гиперсферы нет широты
			
			const latitudeRange = ranges[latitudeId];//, longitudeRange = ranges[longitudeId];
			if (latitude > latitudeRange.max) {//π / 2
				
				latitude = π - latitude;
	
				//долготу развернуть на 180 градусов
				if (longitude > 0) longitude -= π;
				else if (longitude < 0) longitude += π;
				
			} else if (latitude < latitudeRange.min) {//- π / 2
				
				console.error('Under constraction')
				latitude -= π;
	
			}
			φ[latitudeId] = latitude;
			φ[longitudeId] = longitude;

		}
		
		return φ;

	}
	/**
	 * Normalizes a vertices angles to available range, if out of the angles range is occures.
	 * @param {array} verticeAngles vertice angles
	 * @returns Normalized a vertices angles.
	 */
	normalizeVerticeAngles(verticeAngles){ return this.vertice2angles(this.angles2Vertice(verticeAngles)); }

}

const edgesCreationMethod = {
	
	Random: 0,//'Random',
	NearestVertice: 1,//'NearestVertice',
	
}
Object.freeze(edgesCreationMethod);
/**
 * Enums a methods for creating edges:
 * <pre>
 * Random: every vertice of the edge have random position.
 * NearestVertice: Vertices of the edge have nearest position.
 * </pre>
 * */
HyperSphere.edgesCreationMethod = edgesCreationMethod;

/**
 * <a href="../../../master/nD/jsdoc/" target="_blank">ND</a>
 * */
HyperSphere.ND = ND;

class RandomArc {

	constructor() {

/*		
		const PI = Math.PI;
		const angles = [], anglesCount = 100, d = 2 * PI / (anglesCount - 1);
		for (let i = 0; i < anglesCount; i++) {

			const x = i * d;
			angles.push([x, Math.sin(x) + x]);
			
		}
*/
/*		
		//Normal distribution https://en.wikipedia.org/wiki/Normal_distribution
		//(Math.PI/0.7978845608028654)*(1/(0.5*Math.sqrt(2*Math.PI)))*Math.exp(-Math.pow(2*Math.PI*t - Math.PI,2)/(2*Math.pow(0.5,2)))
		const angles = [], anglesCount = 101, d = 2 * π / (anglesCount - 1),
			μ = π, σ = 0.5;
		for (let i = 0; i < anglesCount; i++) {

			const x = i * d;
			angles.push([(π/0.7978845608028654)*(1/(σ*Math.sqrt(2*π)))*Math.exp(-Math.pow(x - μ,2)/(2*σ*σ)), x]);
			
		}
*/		
		//Normal distribution https://en.wikipedia.org/wiki/Normal_distribution
		//1 - (1/(0.5*Math.sqrt(2*Math.PI)))*Math.exp(-Math.pow(2*Math.PI*t - Math.PI,2)/(2*Math.pow(0.5,2)))
/*		
0.5*Math.sqrt(2*Math.PI)*Math.exp(-Math.pow(2*Math.PI*t-Math.PI+Math.PI/32,2)/(2*Math.pow(0.5,2)))-
0.5*Math.sqrt(2*Math.PI)*Math.exp(-Math.pow(2*Math.PI*t-Math.PI-Math.PI/32,2)/(2*Math.pow(0.5,2)))+
2*Math.PI*t-Math.PI
*/
/*		
		const angles = [], anglesCount = 101, d = 2 * π / (anglesCount - 1),
			μ = π, σ = 0.5;
		for (let i = 0; i < anglesCount; i++) {

//			const x = i * d;
//			angles.push([1-(1/(σ*Math.sqrt(2*π)))*Math.exp(-Math.pow(x - μ,2)/(2*σ*σ)), x]);
			
			const t = i * d - π;
//			angles.push([t, t]);
			angles.push([
				0.5*Math.sqrt(2*π)*Math.exp(-Math.pow(t+π/32,2)/(2*Math.pow(0.5,2)))-
				0.5*Math.sqrt(2*π)*Math.exp(-Math.pow(t-π/32,2)/(2*Math.pow(0.5,2)))+
				t,
				t]);
			
		}
*/		
		/*
		const angles = [
				[-4*π/4, -4*π/4],
				[-3*π/4, -3*π/4],
				[-(2/1)*π/4, -2*π/4],
				[-(1/1)*π/4, -1*π/4],
				
				[0*π/4, 0*π/4],
				
				[(1/1)*π/4, 1*π/4],
				[(2/1)*π/4, 2*π/4],
				[3*π/4, 3*π/4],
				[4*π/4, 4*π/4],
			];
		*/
		
		// Интервал [0, 2π]
		const start = -π,
			end = π;
/*		
		// Количество строк
		const numRows = 100,
		
		// Шаг между значениями x
			step = (end - start) / (numRows - 1); // Учитываем включение конечной точки
		
		// Вычисляем и выводим значения
		for (let i = 0; i < numRows; i++) {
			
		    const x = start + i * step; // Вычисляем x
		    const y = Math.sin(x) + x;    // Вычисляем y
			//angles.push([x, y]);
			
		}
*/		
		this.randomAngle = (arcValue) => {

			if ((arcValue < start) || (arcValue > end)) console.error(sHyperSphere + ': randomAngle. Invalid arcValue = ' + arcValue + ' range from ' + start + ' to ' + end);
			/*
			for (let i = 0; i < angles.length; i ++) {

				const angle = angles[i];
				if (angle[1] >= arcValue) {

//					arcValue = angle[0];
//					arcValue = (angle[0] + angles[i + 1][0]) / 2;
					if (i === 0) {
						
						arcValue = angle[0];
						
					} else {

						const angleDelta = angles[i - 1],
							a = (angle[0] - angleDelta[0]) / (angle[1] - angleDelta[1]),
							b = angleDelta[0] - a * angleDelta[1],
							x = arcValue,
							y = a * x + b;
						arcValue = y;
//						arcValue = (c1 + c2) / 2;
//						arcValue = (angle[0] + angles[i - 1][0]) / 2;

					}
					break;
					
				}
				
			}
			*/
/*			
			//Normal distribution https://en.wikipedia.org/wiki/Normal_distribution https://skillbox.ru/media/code/o-normalnom-raspredelenii-prostymi-slovami/
			const //x = arcValue / 2.3,//При коэффициенте 3.35 случайный разброс дуги равен половине окружности когда дуга arcValue = π / 2
				//Надеюсь при таком коэфициенте раздрос дуги будет занимать всю окружность при arcValue = π
				//Для проверки открыть http://localhost/anhr/commonNodeJS/master/HyperSphere/Examples/circle.html с четырьмя вершинами
				//Выбрать вершину 0
				//Выбрать 'Point local position'/'Advansed'/'Edges' = 0(0.1)
				//Точки случайного разброса дуги розового цвета будут распеделены от вершины 0 = π / 4 = 0.7853981633974483 до вершины 2 = 5 * π / 4 = (5 * π / 4) - 2 * π = -2.3561944901923453
				//
				//При коэффициенте 2.3 случайный разброс дуги равен всей окружности когда дуга arcValue = π
				
				μ = 0.1,
				σ = 0.2,//При σ = 0.4 сто процентов случайных дуг будет совпадать с дугой arcValue при arcValue = 0
				sqrt = Math.sqrt, exp = Math.exp, pow = Math.pow, pi = Math.PI,
				x = Math.random() - 0.5;
			return arcValue + 1/(  σ*sqrt(2*pi))*exp((-1/2)*pow((x-μ)/  σ,2) )-1/(0.5*sqrt(2*pi))*exp((-1/2)*pow((x+μ)/σ,   2));
			//                1/(0.5*sqrt(2*pi))*exp((-1/2)*   ((x-1)/0.5)^2))-1/(0.5*sqrt(2*pi))*exp((-1/2)*   ((x+1)/0.5)^2)
//			return arcValue + 2*π*(Math.random() - 0.5)*(1-(1/(  σ*Math.sqrt(2*π      )))*Math.exp(-Math.pow(                 x +μ,2)/(2*Math.pow(  σ,2))))
			//                                           1-(1/(0.4*Math.sqrt(2*Math.PI)))*Math.exp(-Math.pow(2*Math.PI*t-Math.PI+0,2)/(2*Math.pow(0.4,2)))
*/
//			return 20*π*Math.pow(0.5*(Math.random() - 0.5),3)
//			return arcValue + 2 * arcValue * (Math.random() - 0.5);
			return arcValue + (2/π) * arcValue * arcValue * (Math.random() - 0.5);
//			return arcValue + Math.abs(arcValue * (0.01 - 0.1)/π + 0.1) * Math.sin(arcValue / 2)/(Math.random() - 0.5);
//			return arcValue + 0.1 * Math.sin(arcValue / 2)/(Math.random() - 0.5);
//			return arcValue + 0.01 * Math.cos(arcValue / 2)/(Math.random() - 0.5) + 2 * π * Math.sin(arcValue / 2) * (Math.random() - 0.5);
//			return 1/(Math.random() - 0.5);
//			return 2 * π * Math.cos(arcValue / 2);
//			return 2 * π * Math.sin(arcValue * (Math.random() - 0.5) * π / 2);
//			return arcValue + 2 * π * (Math.random() - 0.5) * Math.sin(arcValue / 2);
//			return arcValue + 2 * π * (1/(Math.random() - 0.5)) * Math.sin(arcValue / 2);
			//(2*Math.PI*t-Math.PI)+2 * Math.PI * (Math.random() - 0.5) * Math.sin((2*Math.PI*t-Math.PI) / 2)
//			return π * Math.sin(arcValue / 2) * Math.random() * 2;
		
		};
		
	}
		
}
const randomArc = new RandomArc();
HyperSphere.randomAngle = randomArc.randomAngle;

const sRandomVertices = 'RandomVertices';
/**
 * Random vertices
 * @class
 */
class RandomVertices {
/*
	 * @param {float} [randomVerticesSettings.params.arc=0.5] длинна дуги, соединяющей две вершины гиперсферы в радианах.
	 * @param {array} [randomVerticesSettings.params.center=[]] центр окружности, пересекающей сферу или вершина гиперсферы, вокруг которой будет облако вероятностей.
	 * @param {float} [randomVerticesSettings.params.center[0]=0] Altitude.
	 * @param {float} [randomVerticesSettings.params.center[1]=0] Latitude.
	 * @param {float} [randomVerticesSettings.params.center[2]=0] Longitude.
*/	 

	/**
	 * Random vertices
	 * @param {THREE.Group} scene [group]{@link https://threejs.org/docs/index.html?q=Gro#api/en/objects/Group} of objects to which a new <b>random vertices</b> object will be added.
	 * @param {Options} options See <a href="../../jsdoc/Options/index.html" target="_blank">Options</a>.
	 * @param {object} [randomVerticesSettings={}] The following settings are available.
	 * @param {number} [randomVerticesSettings.R=1] Hypersphere radius.
	 * @param {number} [randomVerticesSettings.np=36] numPoints. Number of vertices on a circle.
	 * @param {number} [randomVerticesSettings.name=''] Name of random vertices.
	 * @param {object} [randomVerticesSettings.params={}] The following parameters are available.
	 * @param {Array} [randomVerticesSettings.params.paramsNew.vertice=[0, 0, 0]] First vertice of the <b>arc</b>.
	 * @param {Array} [randomVerticesSettings.params.oppositeVertice=[0, 0, 0]] Second vertice of the <b>arc</b>.
	 * @param {boolean} [randomVerticesSettings.params.random=true] random arrangement of circles vertices.
	 * @param {boolean} [randomVerticesSettings.params.onePoint=false] true - получить одну случайную точку не вычисляя остальные случайные точки.
	 * @param {boolean} [randomVerticesSettings.params.onePointArray=false] true - array of the one points.
	 */
	constructor(scene, options, randomVerticesSettings = {}){

		const _this = this;

		randomVerticesSettings.name ||= 'Random Vertices';
		
		//Во вселенной радиус гиперсферы может меняться
		let R = randomVerticesSettings.R === undefined ? 1 : randomVerticesSettings.R, np = randomVerticesSettings.np === undefined ? 36 : randomVerticesSettings.np;

		let circlesPointsCount;
		const getCirclePoint = (options) => {

			circleDistancePrev = options.circleDistancePrev != undefined ? options.circleDistancePrev : circleDistancePrev;
			const circleDistance = (params.random ? (options.circleDistance - circleDistancePrev) * Math.random() + circleDistancePrev : options.circleDistance) / R; // Расстояние до окружности по дуге в радианах

			return this.getCirclePoint(circleDistance, params, options);

		}
		const editPoints = (points, point, options) => {

			options ||= {};
//			point ||= [0, 0];
			point ||= this.zeroArray();
			if ((options.pointId === undefined) || boCreateCirclesPoints)
			{

				points.push(point);
				return;

			}
			if (points.length > options.pointId) {

				points[options.pointId] = point;
				options.pointId++;

			} else console.error('getCirclePointsRadians: Invalid options.pointId = ' + options.pointId);

		}

		/**
		 * DeepSeek: Окружность на сфере (расчеты в радианах) — JavaScript
		 * Генерирует точки окружности на сфере (в радианах)
		 * @param {object} [options] options.
		 * @param {number} [options.circleDistance=0.5] - Расстояние до окружности по дуге в радианах для гиперсферы радиусом 1
		 * @param {number} [options.numPoints=36] - Количество точек
		 * @param {number} [options.points=[]] - points array
		 * @returns {Array} Массив точек [ 0 широта (рад), 1 долгота (рад) ]
		 */
		const getCirclePointsRadians = (options = {}, aCirclesRadiusRadians) => {

			if (options.circleDistance === undefined) options.circleDistance = 0.5;
			if (options.numPoints === undefined) options.numPoints = np;
			let numPoints = options.numPoints;
			if (isNaN(numPoints)) numPoints = 1;//numPoints = NaN при длинне дуги между вершинами гиперсферы params.arc = 0. Диамерт окружности, пересекающей гиперсферу равен нулю. Создаем одну точку.
			options.points ||= [];
			const points = options.points;

			for (let i = 0; i < numPoints; i++) {

				let point;
				if (!boCreateCirclesPoints) {
					
					point = getCirclePoint({ i: i, numPoints: numPoints, circleDistance: options.circleDistance, altitude: options.altitude });
/*					
					if (aCirclesRadiusRadians && (i === 0)) 
						aCirclesRadiusRadians.push(this.getArcAngle(point, params.oppositeVertice)); //Запомнить расстояние между нулевой точкой каждой окружности и противоположной вершиной, равное радиусу окружности в радианах.
*/						
					
				} else {

					if (aCirclesRadiusRadians && (i === 0)) {

						boCreateCirclesPoints = false;
						const b = abc.b, circleDistance = (b === 0 ? 0 ://дуга между вершинами гиперсферы равна нулю. Значит радиус окружности вокруг вершины тоже равен нулю
						abc.a / (aCirclesRadiusRadians.x + abc.b) + abc.c) * R;
						boCreateCirclesPoints = true;
						aCirclesRadiusRadians.push(this.getArcAngle(getCirclePoint({ i: i, numPoints: numPoints, circleDistance: circleDistance, altitude: options.altitude }), params.oppositeVertice)); //Запомнить расстояние между нулевой точкой каждой окружности и противоположной вершиной, равное радиусу окружности в радианах.

					}
					point = this.zeroArray();//создается пустой массив максимального размера
					if (edges) {

						const pointsLength = points.length;
						if (pointsLength > 1) edges.push([pointsLength - 2, pointsLength - 1]);

					}

				}
				editPoints(points, point, options);
				circlesPointsCount++;

			}

			return points;
		}
		let params;//Параметры, которые может менять пользователь
		const changeCirclesPoints = (paramsNew) => {

			if (paramsNew) {
				
				params = paramsNew;
				params.randomVertices ||= this;
				RandomVertices.params(params);

			}
			if (!params.onePoint) {

				this.setCirclesCloud(randomVerticesSettings, params);
				return;

			}

			if (boCreateCirclesPoints) {

				this.setCirclesCloudOnePoint(randomVerticesSettings);
/*				
				//размер circlesPoints массива всех точек окружностей
				const pointsCount = params.onePointArray ? abc.circlesCount * np ://если надо содать массив из единично создаваемых точек
						1,//массив состоит из одной точки
					
					options = pointsCount === 1 ? { pointId: 0, pointsCount: pointsCount } : undefined;
				for (let i = 0; i < pointsCount; i++) editPoints(circlesPoints, undefined, options);
*/				
				return;

			}

			const editPointsOptions = { pointId: 0, }
//			const abc = setAbc();
			const aNumPoints = [];//массив с количеством точек numPoints для каждой окружности. Нужен для того, что бы случайно выбрать окружность при вычислении одиночной случайной точки
			//заполнить aNumPoints
			circlesPointsCount = 0;

//			const onePointArea = OnePointArea();
			const b = abc.b, a = abc.a, c = abc.c, d = abc.d, s = abc.s;
			for (let circleId = 1; circleId < abc.circlesCount; circleId++) {

				const x = circleId * d,
					circleDistance = (b === 0 ? 0 ://дуга между вершинами гиперсферы равна нулю. Значит радиус окружности вокруг вершины тоже равен нулю
						a / (x + b) + c) * R;
				const numPoints = this.numPoints(d, s, circleId, x);
				
				circlesPointsCount += numPoints;
				aNumPoints.push({ circlesPointsCount: circlesPointsCount, circleDistance: circleDistance });

			}
			
			//вычислить одну случайную точку без необходимости вычисления всех остальных случайных точек
			//Нужно для сокращения времени вычислений, когда надо всего одну случайную точку
			const getOnePoint = (/*onePointArea*/) => {

				circleDistancePrev = 0;//Положение предыдущего кольца

				if (circlesSphere) circlesPoints = circlesSphere.angles;

				const randomPointId = Math.round(Math.random() * circlesPointsCount);//Идентификатор случайной точки
				//Найти окружность, в которую попадает случайная точка randomPointId
				for (let circleId = 0; circleId < abc.circlesCount; circleId++) {

					const circleParams = aNumPoints.length > 0 ? aNumPoints[circleId] :

						//params.arc = 0. Все окружности стянуты в одну точку params.center и имеют диаметр равный нулю
						//Так же получается, что randomPointId = 0 потому что circlesPointsCount = 0
						//Поэтому circleParams делаем таким, что бы случайная точка point оказалась равной params.center
						{ circlesPointsCount: 1, circleDistance: 0 };
					if (circleParams.circlesPointsCount >= randomPointId) {

						const point = getCirclePoint({
							
							circleDistance: circleParams.circleDistance,
							circleDistancePrev: circleId === 0 ? circleParams.circleDistance : aNumPoints[circleId - 1].circleDistance,
						
						});
						editPoints(circlesPoints, point, editPointsOptions);
						if (!params.onePointArray) circlesPointsCount = editPointsOptions.pointId;
						break;

					}

				}

			}
			for (let i = 0; i < circlesPoints.length; i++) getOnePoint();//onePointArea);

		}
		const abc = {

			//Deepseek Вычислить a, d, c в уравнении y=a/(x+b)+c точностью до 8 знаков при условии:
			//Эта формула нужна для вычисления радиуса окружности radius
	
			//найти элементарную функцию для массива точек (0.1,0.0033995189605183543),(0.5,0.11673555173106497),(1,0.8759691969420544),(1.5,15.890654938344866)
			//(0.027*exp(3*x)+2.718*(x^4))*0.8
			
			//коэфициенты для формулы circleDistance = a / (x + b) + c, уголовое расстояние для окружности для гиперсферы радиусом 1
			get b() {
				
				const exp = Math.exp, pow = Math.pow,
					k = 15.890654938344866 / 16.163337545114086,//Умножить b на этот множитель что бы b = 15.890654938344866 при arc = 1.5
		
		//			arc = params.arc / 2,//В этом случае точки не совсем равномерно распределяются по гиперсфере когда вершины расположены на противоположных концах гиперсферы
					arc = boCreateCirclesPoints ?
						π ://надо установить максимальную длинну дуги во время создания массива точек окружностей, что бы массив поучился максимальной длинный
						params.arc,
					
					//коэфициенты для формулы circleDistance = a / (x + b) + c, уголовое расстояние для окружности для гиперсферы радиусом 1
					b = (0.027 * (exp(3 * arc)
						- 1//отнимаю единицу что бы график выходил из нуля
						) + 2.718 * pow(arc, 4)) * k;//Так b зависит от длинны дуги, что бы плотность вероятностей распределялась от равномерной при arc = π/2 до сводящейся в точку при arc = 0
				return b;
				
			},
			get a() {

				const b = this.b;
				return -b * (pi + b);
				
			},
			get c() { return -this.a / this.b; },
			
			get circlesCount() { return (!boCreateCirclesPoints) && (this.b === 0) ? 2 : _this.circlesCount(np); },
			get d() { return pi / (this.circlesCount - 1); },//расстояние между окружностями в радианах при условии, что окружности равномерно расположены на сфере
			get s() { return _this.onePointArea(this.d, np); },//Площадь сферы на которой в среднем будет находиться одна случайная точка.
			
		}
/*		
		const setAbc = () => {

			//Deepseek Вычислить a, d, c в уравнении y=a/(x+b)+c точностью до 8 знаков при условии:
			//Эта формула нужна для вычисления радиуса окружности radius
	
			//найти элементарную функцию для массива точек (0.1,0.0033995189605183543),(0.5,0.11673555173106497),(1,0.8759691969420544),(1.5,15.890654938344866)
			//10*(x^3)-10*(x^2)+x залазит в отрицательный y
			//(0.027*exp(3*x)+2.718*(x^4))*0.8
			const exp = Math.exp, pow = Math.pow,
				k = 15.890654938344866 / 16.163337545114086,//Умножить b на этот множитель что бы b = 15.890654938344866 при arc = 1.5
	
	//			arc = params.arc / 2,//В этом случае точки не совсем равномерно распределяются по гиперсфере когда вершины расположены на противоположных концах гиперсферы
				arc = params.arc,
				
				//коэфициенты для формулы circleDistance = a / (x + b) + c, уголовое расстояние для окружности для гиперсферы радиусом 1
				b = (0.027 * (exp(3 * arc)
					- 1//отнимаю единицу что бы график выходил из нуля
					) + 2.718 * pow(arc, 4)) * k,//Так b зависит от длинны дуги, что бы плотность вероятностей распределялась от равномерной при arc = π/2 до сводящейся в точку при arc = 0
				a = -b * (pi + b),
				c = -a / b,
				
				circlesCount = (!boCreateCirclesPoints) && (b === 0) ? 2 : this.circlesCount(np),
				d = pi / (circlesCount - 1),//расстояние между окружностями в радианах при условии, что окружности равномерно расположены на сфере
				s = this.onePointArea(d, np);//Площадь сферы на которой в среднем будет находиться одна случайная точка.
			return {
				
				a: a, b: b, c: c,
				circlesCount: circlesCount,
				d: d, s: s,
				
			}
			
		};
		//			setAbc();
*/		

		//есть три точки (0,0), (0,75,2.4), (π,π)
		//y≈ -1.17280918/(x+0.33708757)+3.47926296
		//const b = 0.33708757, a = -1.17280918, c = 3.47926296;

		//есть три точки (0,0), (0,π), (π,π)
		//для заданных точек решение не существует.

		//есть три точки (0,0), (0.1,π-0.1), (π,π)
		//const b = 0.01/(pi-0.2), a = -b*(pi+b), c = -a/b;
		//const a = -0.010691460521266596, b = 0.0033995189605183543, c = 3.1449921725503116;

		//есть три точки (0,0), (0.5,π-0.5), (π,π)
		//const b = 1/(4*pi-4), a = -b*(pi+b), c = -a/b;
		//const a = -0.3803627407690211, b = 0.11673555173106497, c = 3.258328205320858;

		//есть три точки (0,0), (1,π-1), (π,π)
		//const b = 1/(pi-2), a = -b*(pi+b), c = -a/b;
		//const a = -3.5192604278754165, b = 0.8759691969420544, c = 4.017561850531847;

		//есть три точки (0,0), (1.5,π-1.5), (π,π)
		//Почти равномерное распределение
		//const b = 2.25/(pi-3), a = -b*(pi+b), c = -a/b;
		//const a = -302.4348791845787, b = 15.890654938344866, c = 19.03224759193466;

		//есть три точки (0,0), (π/2,π/2), (π,π)
		//Равномерное распределение
		//Не существует функции вида y = a/(x+b)+c, которая проходила бы через все три заданные точки одновременно.

		//////////////////////////////////////////Deepseek

		const createCirclesSphere = () => {

//			circlesPointsOptions.pointId = this.pointIdErase(circlesPointsOptions.pointId);
//			circlesPointsOptions.pointId = 0;
			if (!circlesSphere && !boCreateCirclesPoints && (circlesPoints.length != 0)) {

				circlesSphere = this.getHyperSphere(options, {

						r: R,
						edges: false,
						randomArc: true,
						projectParams: {

							scene: scene,

						},
						//r: 0.5,
						debug: debug ? {

							probabilityDensity: false,
							middleVertice: false,
							log: false,

						} : false,
						//debug: false,
						settings: {

							object: {

								name: randomVerticesSettings.name || '',
								color: randomVerticesSettings.color,
								geometry: {

									angles: circlesPoints,
									indices: { edges: edges },

								},

							},
							overriddenProperties: {
								setDrawRange: (start, count) => {

									if (circlesSphere) circlesSphere.bufferGeometry.setDrawRange(start, count);

								}

							},

						},

					});

			}

			if (circlesSphere) circlesSphere.setVerticesRange(0, circlesPointsCount);
			
		}
		let circlesSphere, boCreateCirclesPoints;
		const circlesPointsOptions = {};
		Object.defineProperties(this, {
			circlesSphere: {
				get: () => { return circlesSphere; },
				set: (circlesSphereNew) => {

					circlesSphere = circlesSphereNew;
					return true;

				}
			}
		});
		let circleDistancePrev,//Положение предыдущего кольца
			circlesPoints = [];//точки всех окружностей
		const debug = randomVerticesSettings.debug || false, edges = debug ? [] : undefined,
			aSpheres = [];//массив сфер в трехмерной гиперсфере. Каждый элемент массива это массив окружностей в текущей сфере. каждый елемент массива окружностей содержит параметры окружности
							//Для двумерной и одномерной гиперсферы когда sphereId = undefined, массив сфер содержит один элемент с массивом окружностей.
/*			
			getCirclesArray = (sphereId) => {
				
				const circlesId = sphereId === undefined ? 0 : sphereId;
				if (aSpheres.length <= circlesId) aSpheres.push([]);
				return aSpheres[circlesId];
				
			}
*/			
		this.setCircles = (circlesPointsCountNew, circlesIdNew, altitude, boNoCreateCirclesSphere, aCirclesRadiusRadians) => {

			circleDistancePrev = 0;//Положение предыдущего кольца
			if (circlesPointsCountNew != undefined) circlesPointsCount = circlesPointsCountNew;
//			if ((sphereId === undefined) || (sphereId === 0)) circlesPointsCount = 0;
			const cos = Math.cos,
				a = abc.a, b = abc.b, c = abc.c, d = abc.d,
//				aCircles = getCirclesArray(sphereId);
//				circlesId = sphereId === undefined ? 0 : sphereId;
				circlesId = circlesIdNew === undefined ? 0 : circlesIdNew;
			if (aSpheres.length <= circlesId) aSpheres.push([]);
			const aCircles = aSpheres[circlesId];
			circlesPointsOptions.altitude = altitude;//this.altitudeDifference(sphereId, params);
			for (let circleId = 1; circleId < abc.circlesCount; circleId++) {

				const x = circleId * d,
					circleDistance = (b === 0 ? 0 ://дуга между вершинами гиперсферы равна нулю. Значит радиус окружности вокруг вершины тоже равен нулю
						a / (x + b) + c) * R,
					xPrev = (circleId - 1) * d;//prev point
				circleDistancePrev = (b === 0 ? 0 ://дуга между вершинами гиперсферы равна нулю. Значит радиус окружности вокруг вершины тоже равен нулю
					a / (xPrev + b) + c) * R;
				if (circlesSphere) circlesPointsOptions.points = circlesSphere.angles;
				else circlesPointsOptions.points = circlesPoints;
				circlesPointsOptions.circleDistance = circleDistance;
				const dCircleDistance = (circleDistance - circleDistancePrev) / R;
				if (boCreateCirclesPoints) {
					
					circlesPointsOptions.numPoints = this.getNumPoints(circleDistance, R, dCircleDistance, np);
					aCircles.push({ numPoints: circlesPointsOptions.numPoints, });

				} else circlesPointsOptions.numPoints = aCircles[circleId - 1].numPoints;
				//console.log('circleId = ' + circleId + ', circleDistance1 = ' + circleDistance1 + ', numPoints = ' + circlesPointsOptions.numPoints)
				if (aCirclesRadiusRadians) aCirclesRadiusRadians.x = x;
				getCirclePointsRadians(circlesPointsOptions, aCirclesRadiusRadians);

			}
			//console.log('circlesPointsCount = ' + circlesPointsCount);
//			if ((sphereId === undefined)  || ((sphereId + 1) === randomVerticesSettings.spheresCount)) createCirclesSphere();
			if (!boNoCreateCirclesSphere) createCirclesSphere();

		}
		this.setCirclesOnePoint = (sphereId) => {

			//размер circlesPoints массива всех точек окружностей
			const pointsCount = params.onePointArray ? abc.circlesCount * np ://если надо содать массив из единично создаваемых точек
					1,//массив состоит из одной точки
				
				options = pointsCount === 1 ? { pointId: 0, pointsCount: pointsCount } : undefined;
			for (let i = 0; i < pointsCount; i++) editPoints(circlesPoints, undefined, options);

		}
		const setCirclesPoints = (/*arc*/) => {

			//заполнить circlesPoints максимально возможный массив точек всех окружностей 
			boCreateCirclesPoints = true;
//			params.arc = pi;
			changeCirclesPoints();

			//создать окружности
			boCreateCirclesPoints = false;
//			params.arc = arc;
			circlesPointsOptions.pointId = 0;
			changeCirclesPoints();

		}
		const setCirclesOnePoints = () => {

			//заполнить circlesPoints максимально возможный массив точек всех окружностей 
			boCreateCirclesPoints = true;
			changeCirclesPoints();

			//создать окружности
			boCreateCirclesPoints = false;
			changeCirclesPoints();

		}
		this.determinedVertices = (paramsNew) => { 

			params ||= paramsNew;
			if (params.onePoint) {

				console.warn(sRandomVertices + ': Please, define params.onePoint = false');
				params.onePoint = false;
				
			}
			params.randomVertices = this;
			RandomVertices.params(params);
			setCirclesPoints();//params.arc);
			return circlesSphere;
//			return circlesPoints;
			
		}
		this.randomVertice = (paramsNew) => { this.determinedVertices(paramsNew); }
		const removeCirclesSphere = () => {
			
			circlesPoints = [];
			if (!circlesSphere) return;
			if (circlesSphere.object3D) circlesSphere.object3D.parent.remove(circlesSphere.object3D);
			circlesSphere = undefined;
			
		}
		/**
		 * Сall this method for the <b>randomVerticesSettings.params.random</b> change to take effect.
		 */
		this.onChangeRandom = (paramsNew) => {
			
			params ||= paramsNew;
			removeCirclesSphere();
			setCirclesPoints();// params.arc);
			createCirclesSphere();
		
		}
		/**
		 * Сall this method for the <b>randomVerticesSettings.params.onePoint</b> change to take effect
		 * or if <b>randomVerticesSettings.params.onePointArray</b> was changed to false.
		 * @param {Object} paramsNew See <b>randomVerticesSettings.params</b> of the constructor for details.
		 */
		this.onChangeOnePoint = (paramsNew) => {
			
			params ||= paramsNew;
			this.onChangeRandom();
		
		}
		this.removeOnePointArray = () => { removeCirclesSphere(); }
		/**
		 * Creates an array of the random points from one random point.
		 * @param {Object} paramsNew See <b>randomVerticesSettings.params</b> of the constructor for details.
		 * You can set <b>vertice</b> and <b>oppositeVertice</b> parameters instead <b>arc</b> and <b>center</b>. See below:
		 * @param {Array} [paramsNew.vertice] First vertice of the <b>arc</b>.
		 * @param {Array} [paramsNew.oppositeVertice] Second vertice of the <b>arc</b>.
		 * @returns <a href="../jsdoc/module-HyperSphere-HyperSphere.html" target="_blank">HyperSphere</a>, what contains created points array.
		 */
		this.createOnePointArray = (paramsNew) => {
			
			params ||= paramsNew;
			if (params.R != undefined) R = params.R;
			params.randomVertices = this;
			RandomVertices.params(params);
//			params.randomVertices = this;
			removeCirclesSphere();
			if (params.onePointArray) {

				if (!params.onePoint) {

					console.warn(sRandomVertices + ': Please, define params.onePoint = true');
					params.onePoint = true;
					
				}
				setCirclesOnePoints();

			}
			else if (params.onePoint) this.randomVertice();
			createCirclesSphere();
			return circlesSphere;
		
		}
		/**
		 * Сall this method for the <b>randomVerticesSettings.params.arc</b> change to take effect.
		 * @param {Object} paramsNew See <b>paramsNew</b> of the <b>createOnePointArray</b> method for details.
		 */
		this.changeCirclesPoints = (params) => {
			
			circlesPointsOptions.pointId = 0;
			changeCirclesPoints(params);
		
		}

	}
	//overridden methods

	getHyperSphere() { console.error(sRandomVertices + sOver.replace('%s', 'getHyperSphere')); }
	getArcAngle() { console.error(sRandomVertices + sOver.replace('%s', 'getArcAngle')); }
	oppositeVertice0() { console.error(sRandomVertices + sOver.replace('%s', 'oppositeVertice0')); }
//	antipodeCenter() { console.error(sRandomVertices + sOver.replace('%s', 'antipodeCenter')); }
//	defineCenterCoordinates() { console.error(sRandomVertices + sOver.replace('%s', 'defineCenterCoordinates')); }
	zeroArray() { console.error(sRandomVertices + sOver.replace('%s', 'zeroArray')); }
	onePointArea() { console.error(sRandomVertices + sOver.replace('%s', 'onePointArea')); }
	numPoints() { console.error(sRandomVertices + sOver.replace('%s', 'numPoints')); }
//	center() { console.error(sRandomVertices + sOver.replace('%s', 'center')); }
	getCirclePoint() { console.error(sRandomVertices + sOver.replace('%s', 'getCirclePoint')); }
	setCenterLength() { console.error(sRandomVertices + sOver.replace('%s', 'setCenterLength')); }
	circlesCount() { console.error(sRandomVertices + sOver.replace('%s', 'circlesCount')); }
	getNumPoints() { console.error(sRandomVertices + sOver.replace('%s', 'getNumPoints')); }
	setCirclesCloud() { console.error(sRandomVertices + sOver.replace('%s', 'setCirclesCloud')); }
	setCirclesCloudOnePoint() { console.error(sRandomVertices + sOver.replace('%s', 'setCirclesCloudOnePoint')); }
//	pointIdErase() { console.error(sRandomVertices + sOver.replace('%s', 'pointIdErase')); }

	////////////////////////////////////////overridden methods
	
}
const sOver = ': Please, override %s method in your ' + sRandomVertices + ' child class.';
RandomVertices.params = (params) => {

	if (params.random === undefined) params.random = true;
	if (params.onePoint === undefined) params.onePoint = true;
	if (params.onePointArray === undefined) params.onePointArray = true;
//	if (params.center) console.warn(sRandomVertices + '.params: deprecated parameter params.center. Use params.oppositeVertice.')
	const RandomVertices = params.HyperSphere.RandomVertices;
	params.vertice ||= RandomVertices.ZeroArray();
//	RandomVertices.Vertice(params.vertice);
	params.oppositeVertice ||= RandomVertices.ZeroArray();
//	RandomVertices.Vertice(params.oppositeVertice);

	//если вершина находится на полюсах, то случайное распределение вершин получается не случайным непонятно по какой причине
	//Для этого немного отклоняю вершину от полюса
	const inaccurateLatitude = (lat) => {
	
		const precision = 1e-14;
		if (lat > 0) {
			
			if ((pi / 2 - lat) <= precision) lat -= precision;
	
		} else if ((pi / 2 + lat) <= precision) lat += precision;
		return lat;
	
	}
	
//	if (params.vertice) {

	if (params.randomVertices) params.randomVertices.oppositeVertice0(params, inaccurateLatitude);

//	if (params.arc) console.warn(sRandomVertices + '.params: deprecated parameter params.arc. Use params.vertice and params.oppositeVertice.')
	if (params.arc === undefined)
		Object.defineProperty(params, 'arc', {
	
			get: () => {
				
				const vertice = params.vertice, oppositeVertice = params.oppositeVertice;
				return params.randomVertices.getArcAngle(vertice, oppositeVertice);
			
			},

	});
	if (params.center === undefined)
		Object.defineProperty(params, 'center', {
	
			get: () => {

//				return params.randomVertices.center(params);
				return params.HyperSphere.RandomVertices.getCenter(params);
			
			},
	
		});
	
//	}
	params.center ||= [];
	params.HyperSphere.RandomVertices.Center(params, inaccurateLatitude);
//	if (params.arc === undefined) params.arc = 0.5;
	
}
RandomVertices.Center = () => { console.error(sRandomVertices + ': Please, override RandomVertices.Center method.'); }
HyperSphere.RandomVertices = RandomVertices;

export default HyperSphere;

const _display = (element, boDisplay) => { element.style.display = boDisplay === false ? 'none' : 'block'; }
