/**
 * set options
 *
 * @author Andrej Hristoliubov https://anhr.github.io/AboutMe/
 *
 * @copyright 2011 Data Arts Team, Google Creative Lab
 *
 * @license under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */

import ColorPicker from './colorpicker/colorpicker.js';
//import ColorPicker from 'https://raw.githack.com/anhr/commonNodeJS/master/colorpicker/colorpicker.js';

import three from './three.js'

//import { OrbitControls } from 'http://localhost/anhr/three.js/dev/examples/jsm/controls/OrbitControls.js';
import { OrbitControls } from '../../three.js/dev/examples/jsm/controls/OrbitControls.js';
//import { OrbitControls } from 'https://raw.githack.com/anhr/three.js/dev/examples/jsm/controls/OrbitControls.js';
//import { OrbitControls } from 'https://threejs.org/examples/jsm/controls/OrbitControls.js';

import Cookie from './cookieNodeJS/cookie.js';
//import Cookie from 'https://raw.githack.com/anhr/commonNodeJS/master/cookieNodeJS/cookie.js';
import cookie from './cookieNodeJS/cookie.js';
//import cookie from 'https://raw.githack.com/anhr/commonNodeJS/master/cookieNodeJS/cookie.js';

import { dat } from './dat/dat.module.js';
//import { dat } from 'https://raw.githack.com/anhr/commonNodeJS/master/dat/dat.module.js';

class SetOptions {

	/**Set <b>options</b> keys.
	 * See the <b>options</b> parameter of the <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
	 */
	constructor() {

		const _this = this;
		/**
		 * set the <b>scales.w</b> key of the <b>options</b>
		 * @param {Object} options
		 * @param {string} [options.scales.w.name="W"] axis name.
		 * @param {number} [options.scales.w.min=0] Minimum range of the <a href="../../colorpicker/jsdoc/index.html" target="_blank">color palette</a> index.
		 * @param {number} [options.scales.w.max=1] Maximum range of the <a href="../../colorpicker/jsdoc/index.html" target="_blank">color palette</a> index.
		 */
		this.setW = function ( options ) {

			const axisName = 'w';
			options.scales = options.scales || {};
			options.scales.w = options.scales.w || {};
			const scale = options.scales.w;
			scale.name = scale.name || axisName;
			if ( !options.palette )
				this.setPalette( options );
//			if ( options.palette instanceof ColorPicker.palette ) {

			scale.min = scale.min === undefined ? 0 : scale.min;

			//максимальное значение шкалы w по умолчанию беру из THREE.Vector4
			//потому что в противном случае неверно будет отображаться цвет точки, заданной как THREE.Vector4()
			scale.max = scale.max === undefined ? new three.THREE.Vector4().w : scale.max;

//			}

		}
		/**
		 * set the <b>scales</b> key of the <b>options</b>
		 * @param {Object} options
		 * @param {Object} [options.scales={}] point.
		 * @param {Object} [options.scales[axis]] <b>x</b> or <b>y</b> or <b>z</b> or <b>w</b>.
		 * @param {string} [options.scales[axis].name="X" or "Y" or "Z" or "W"] axis name.
		 * @param {number} [options.scales[axis].min=-1] Minimum range of the axis.
		 * @param {number} [options.scales[axis].max=1] Maximum range of the axis.
		 * @param {function} [callBack] <b>callback(scale)</b> function is called for all axis. <b>scale</b> is scale for current axis.
		 */
		this.setScales = function ( options, callBack ) {

			options.scales = options.scales || {};
			const boCreateScale = !options.scales.x && !options.scales.y && !options.scales.z;
			function setScale( axisName ) {

				//Не надо создавать ось потому что иначе будут создавться контролы для осей, которые не хочет видеть пользователь и будет рмсоватся пунктирная линия к не существующей оси если пользователь нажал на точку
				if ( boCreateScale )
					options.scales[axisName] = options.scales[axisName] || {};

				if ( !options.scales[axisName] )
					return;

				options.scales[axisName].name = options.scales[axisName].name || axisName;
				options.scales[axisName].min = options.scales[axisName].min === undefined ? -1 : options.scales[axisName].min;
				options.scales[axisName].max = options.scales[axisName].max === undefined ? 1 : options.scales[axisName].max;
				if ( callBack ) callBack( options.scales[axisName] );

			}
			setScale( 'x' );
			setScale( 'y' );
			setScale( 'z' );
			options.scales.setW = function() { _this.setW( options ); }
			
		}

		/**
		 * set the <b>point</b> key of the <b>options</b>
		 * @param {Object} options
		 * @param {Object} [options.point={}] point.
		 * @param {number} [options.point.size=5.0] point size.
		 * @param {number} [options.point.sizePointsMaterial=100.0] The <b>size</b> property of the parameters of the [THREE.PointsMaterial]{@link https://threejs.org/docs/index.html?q=PointsMaterial#api/en/materials/PointsMaterial}.
		 */
		this.setPoint = function ( options ) {

			options.point = options.point || {};
			options.point.size = options.point.size || 5.0;
			options.point.sizePointsMaterial = options.point.sizePointsMaterial || 100.0;

		}

		/**
		 * set the <b>playerOptions</b> key of the <b>options</b>. <b>playerOptions</b> is <b>settings.playerOptions</b> parameter of the <a href="../../player/jsdoc/module-Player-Player.html" target="_blank">Player</a>.
		 * @param {any} options
		 * @param {number} [options.playerOptions.min=0] Minimum range of the axis.
		 * @param {number} [options.playerOptions.max=1] Maximum range of the axis.
		 * @param {number} [options.playerOptions.max=1] Maximum range of the axis.
		 * @param {number} [options.playerOptions.marks=10] Ticks count of the playing. Number of scenes of 3D objects animation.
		 * Have effect for <b>max</b> is not Infinity.
		 * @param {number} [options.playerOptions.dt=0.1] Step of the animation. Have effect only if <b>max</b> is infinity.
		 * @param {boolean} [options.playerOptions.repeat=false] true - Infinitely repeating 3D objects animation.
		 * @param {number} [options.playerOptions.interval=1] Ticks per seconds.
		 * @param {number} [options.playerOptions.zoomMultiplier=1.1] zoom multiplier of the time.
		 * @param {number} [options.playerOptions.offset=0.1] offset of the time.
		 * @param {string} [options.playerOptions.name=""] name of the time.
		 */
		this.setPlayerOptions = function ( options = {} ) {

			options.playerOptions = options.playerOptions || {};
			const playerOptions = options.playerOptions;
			playerOptions.min = playerOptions.min || 0;
			if ( playerOptions.max === Infinity ) playerOptions.max = null;//Заменяю Infinity на null потому что из cockie Infinity читается как null
			if ( playerOptions.max !== null ) {

				if ( playerOptions.max === undefined ) playerOptions.max = 1;
				playerOptions.marks = playerOptions.marks || 10;//2;

			} else playerOptions.marks = null;
//			setPlayerDT( playerOptions );
			if ( playerOptions.max === null ) playerOptions.dt = playerOptions.dt || 0.1;
			else playerOptions.dt = ( playerOptions.max - playerOptions.min ) / ( playerOptions.marks - 1 );
			playerOptions.repeat = playerOptions.repeat || false;
			playerOptions.interval = playerOptions.interval || 1;//25;
			playerOptions.zoomMultiplier = playerOptions.zoomMultiplier || 1.1;
			playerOptions.offset = playerOptions.offset || 0.1;
			playerOptions.name = playerOptions.name || '';

		}

		/**
		 * set the <b>palette</b> key of the <b>options</b>.
		 * See <a href="../../colorpicker/jsdoc/module-ColorPicker-ColorPicker.html#palette" target="_blank">color palette</a>.
		 * @param {Object} options
		 */
		this.setPalette = function ( options ) {

			if ( options.palette )
				return;
			options.palette = new ColorPicker.palette();//ColorPicker.paletteIndexes.BGRW 

		}

		/**
		 * Create [OrbitControls]{@link https://threejs.org/docs/index.html#examples/en/controls/OrbitControls}
		 * @param {THREE.PerspectiveCamera} camera [PerspectiveCamera]{@link https://threejs.org/docs/index.html#api/en/cameras/PerspectiveCamera}. Use the <b>camera</b> key if you want control cameras focus.
		 * @param {THREE.WebGLRenderer} renderer [THREE.WebGLRenderer]{@link https://threejs.org/docs/index.html#api/en/renderers/WebGLRenderer}.
		 * @param {THREE.Scene} scene [THREE.Scene]{@link https://threejs.org/docs/index.html?q=sce#api/en/scenes/Scene}.
		 * @param {object} [options={}] the following options are available.
		 * See the <b>options</b> parameter of the <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
		 * @param {Object|boolean} [options.orbitControls={}] {} - use [OrbitControls]{@link https://threejs.org/docs/index.html#examples/en/controls/OrbitControls} allow the camera to orbit around a target.
		 * See the <b>options.orbitControls</b> parameter of the <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
		 * <pre>
		 * false - no orbit controls.
		 * </pre>
		 */
		this.orbitControls = function ( camera, renderer, scene, options = {} ) {

			if ( options.orbitControls !== false ) options.orbitControls = options.orbitControls || {};
			if ( !options.orbitControls )
				return;
			const settings = options.orbitControls;
			options.orbitControls = new OrbitControls( camera, renderer.domElement );
			if ( options.orbitControls.settings ) console.error( 'OrbitControls.settings = ' + controls.settings );
			options.orbitControls.settings = settings;
			options.orbitControls.target.set( scene.position.x * 2, scene.position.y * 2, scene.position.z * 2 );
			options.orbitControls.saveState();//For reset of the orbitControls settings in the CameraGui and OrbitControlsGui
			options.orbitControls.update();

		}

		/**
		 * Use dat-gui JavaScript Controller Library. [dat.gui]{@link https://github.com/dataarts/dat.gui}.
		 * @param {Object} options See the <b>options.dat</b> parameter of the <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
		 * @param {object|boolean} [options.dat] false - do not use dat-gui JavaScript Controller Library. [dat.gui]{@link https://github.com/dataarts/dat.gui}.
		 * @param {GUI} [options.dat.gui] new [dat.GUI()]{@link https://github.com/dataarts/dat.gui} instance
		 * @param {boolean} [options.dat.cookie] false - do not save to cookie all user settings
		 * @param {string} [options.dat.cookieName] Name of the cookie.
		 * @param {boolean} [options.dat.axesHelperGui] false - do not adds a <a href="../../AxesHelper/jsdoc/module-AxesHelperGui.html" target="_blank">AxesHelperGui</a> into [dat.gui]{@link https://github.com/dataarts/dat.gui}.
		 * @param {boolean} [options.dat.playerGui=true] true - adds a <a href="../../player/jsdoc/module-Player.html#~Player.gui" target="_blank">Player controllers</a> into [dat.gui]{@link https://github.com/dataarts/dat.gui}.
		 * @param {boolean} [options.dat.guiSelectPoint=true] true - displays the <a href="../../guiSelectPoint/jsdoc/module-GuiSelectPoint.html" target="_blank">Select Point</a>. [dat.gui]{@link https://github.com/dataarts/dat.gui} based graphical user interface for select a point from the mesh.
		 * @param {boolean} [options.dat.guiStereoEffect=true] true - Adds <a href="../../StereoEffect/jsdoc/module-StereoEffect-StereoEffect.html#gui" target="_blank">Stereo Effects folder</a> into [dat.gui]{@link https://github.com/dataarts/dat.gui}.
		 * @param {boolean} [options.dat.guiFrustumPoints=true] true - Adds <a href="../../FrustumPoints/jsdoc/FrustumPoints.html#gui" target="_blank">Frustum Points folder</a> into [dat.gui]{@link https://github.com/dataarts/dat.gui}.
		 * @param {boolean} [options.dat.cameraGui=true] true - Adds <a href="../../jsdoc/CameraGui/module-CameraGui-CameraGui.html" target="_blank">Camera folder</a> into [dat.gui]{@link https://github.com/dataarts/dat.gui}.
		 * @param {object} [options.dat.moveScene={}] true - displays the <a href="../../jsdoc/MoveGroupGui/index.html" target="_blank">move group gui</a>.
		 */
		this.setDat = function ( options ) {

			if ( options.dat === false )
				return;
			options.dat = options.dat || {};
			options.dat.gui = options.dat.gui || new dat.GUI();
			//cookie: false,
			options.dat.cookie = options.dat.cookie !== false ? cookie : new Cookie.defaultCookie();
			options.dat.getCookieName = function( cookieName='' ) {

				const name = options.dat.cookieName ||
					( options.elContainer ?
						typeof options.elContainer === "object" ?
						options.elContainer.id :
						typeof options.elContainer === "string" ?
							options.elContainer :
							'' :
						'' );
				return cookieName + ( ( cookieName !== '' ) && ( name !== '' ) ? '_' : '' ) + name;

			}
			//axesHelperGui: false,
			//playerGui: false,
			//guiSelectPoint: false,
			//moveScene: false,
			//cameraGui: false,
			//guiStereoEffect: false,

		}
//		this._dat = {};

	}
/*	
	get dat() { return this._dat; }
	set dat( options ) {

		this._dat = options.dat || {};

	}
*/	

}
const setOptions = new SetOptions();
export default setOptions;