/**
 * options of the canvas
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

//При выполнении npm run build получаю ошибку
//(babel plugin) ReferenceError: Unknown plugin "external-helpers" specified in "base" at 1, attempted to resolve relative to "D:\\My documents\\MyProjects\\webgl\\three.js\\GitHub\\three.js\\dev\\examples\\jsm"
//import { WEBGL } from '../../three.js/dev/examples/jsm/WebGL.js';

import { WEBGL } from './WebGL.js';
//import { WEBGL } from 'https://raw.githack.com/anhr/three.js/dev/examples/jsm/WebGL.js';

//for testing open FireFox and read https://support.biodigital.com/hc/en-us/articles/218322977-How-to-turn-on-WebGL-in-my-browser#h_01EJW3MGDF7KH3PH6TG2DE13H6
if ( WEBGL.isWebGLAvailable() === false ) {

	document.body.appendChild( WEBGL.getWebGLErrorMessage() );
	alert( WEBGL.getWebGLErrorMessage().innerHTML );

}

import ColorPicker from './colorpicker/colorpicker.js';
//import ColorPicker from 'https://raw.githack.com/anhr/commonNodeJS/master/colorpicker/colorpicker.js';

import three from './three.js'

import { OrbitControls, createEventDispatcher } from './OrbitControls/OrbitControls.js';
//import { OrbitControls } from '../../three.js/dev/examples/jsm/controls/OrbitControls.js';
//import { OrbitControls } from 'http://localhost/anhr/three.js/dev/examples/jsm/controls/OrbitControls.js';
//import { OrbitControls } from 'https://raw.githack.com/anhr/three.js/dev/examples/jsm/controls/OrbitControls.js';
//import { OrbitControls } from 'https://threejs.org/examples/jsm/controls/OrbitControls.js';

//для сщздания пустого cookie который ничего не запоминает
import Cookie from './cookieNodeJS/cookie.js';
//import Cookie from 'https://raw.githack.com/anhr/commonNodeJS/master/cookieNodeJS/cookie.js';

import cookie from './cookieNodeJS/cookie.js';
//import cookie from 'https://raw.githack.com/anhr/commonNodeJS/master/cookieNodeJS/cookie.js';

//import { dat } from './dat/dat.module.js';
//import { dat } from 'https://raw.githack.com/anhr/commonNodeJS/master/dat/dat.module.js';

import { getLanguageCode } from './lang.js';
//import { getLanguageCode } from 'https://raw.githack.com/anhr/commonNodeJS/master/lang.js';

import Player from './player/player.js';
import StereoEffect from './StereoEffect/StereoEffect.js';

class Options {

	/**
	 * options of the canvas
	 * @param {Object} options See the <b>options</b> parameter of the <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
	 */
	constructor( options ) {

		const _this = this;
		options = options || {};
		if ( options.boOptions )
			return options;//duplucate new Options
//		options.boOptions = true;

		if ( options.a === undefined ) options.a = 1;
		if ( options.b === undefined ) options.b = 0;

		/* *
		 * See the <b>options</b> parameter of the <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
		 * */
//		this.options = options;
		/**
		 * set the <b>scales.w</b> key of the <b>options</b>
		 * @param {Object} options
		 * @param {string} [options.scales.w.name="W"] axis name.
		 * @param {number} [options.scales.w.min=0] Minimum range of the <a href="../../colorpicker/jsdoc/index.html" target="_blank">color palette</a> index.
		 * @param {number} [options.scales.w.max=1] Maximum range of the <a href="../../colorpicker/jsdoc/index.html" target="_blank">color palette</a> index.
		 */
		this.setW = function ( optionsCur ) {

			optionsCur = optionsCur || options;
			const axisName = 'w';
			optionsCur.scales = optionsCur.scales || {};
			optionsCur.scales.w = optionsCur.scales.w || {};
			const scale = optionsCur.scales.w;
			scale.name = scale.name || axisName;
			if ( !optionsCur.palette )
				this.setPalette( optionsCur );

			scale.min = scale.min === undefined ? 0 : scale.min;

			//максимальное значение шкалы w по умолчанию беру из THREE.Vector4
			//потому что в противном случае неверно будет отображаться цвет точки, заданной как THREE.Vector4()
			scale.max = scale.max === undefined ? new three.THREE.Vector4().w : scale.max;

		}
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
//			if ( callBack ) callBack( options.scales[axisName] );

		}
		setScale( 'x' );
		setScale( 'y' );
		setScale( 'z' );
		options.scales.setW = function () { _this.setW(); }
		options.point = options.point || {};
		options.point.size = options.point.size || 5.0;
		options.point.sizePointsMaterial = options.point.sizePointsMaterial || 100.0;

		/**
		 * set the <b>palette</b> key of the <b>options</b>.
		 * See <a href="../../colorpicker/jsdoc/module-ColorPicker-ColorPicker.html#palette" target="_blank">color palette</a>.
		 */
		this.setPalette = function () {

			if ( options.palette )
				return;
			options.palette = new ColorPicker.palette();//ColorPicker.paletteIndexes.BGRW 

		}

		/**
		 * Create [OrbitControls]{@link https://threejs.org/docs/index.html#examples/en/controls/OrbitControls}
		 * @param {THREE.PerspectiveCamera} camera [PerspectiveCamera]{@link https://threejs.org/docs/index.html#api/en/cameras/PerspectiveCamera}. Use the <b>camera</b> key if you want control cameras focus.
		 * @param {THREE.WebGLRenderer} renderer [THREE.WebGLRenderer]{@link https://threejs.org/docs/index.html#api/en/renderers/WebGLRenderer}.
		 * @param {THREE.Scene} scene [THREE.Scene]{@link https://threejs.org/docs/index.html?q=sce#api/en/scenes/Scene}.
		 */
		this.createOrbitControls = function ( camera, renderer, scene ) {

/*
			if ( options.orbitControls !== false ) options.orbitControls = options.orbitControls || {};
			if ( !options.orbitControls )
				return;
*/
			if ( options.orbitControls === false )
				return;
/*
			if ( _this.orbitControls ) {

				console.error( 'Options.createOrbitControls: duplicate orbitControls.' );
				return;
				
			}
*/			

			createEventDispatcher();
			_this.orbitControls = new OrbitControls( camera, renderer.domElement );
/*непонятно зачем это
			if ( _this.orbitControls.settings ) console.error( 'OrbitControls.settings = ' + controls.settings );
			_this.orbitControls.settings = options.orbitControls;
*/
			_this.orbitControls.target.set( scene.position.x * 2, scene.position.y * 2, scene.position.z * 2 );
			_this.orbitControls.saveState();//For reset of the orbitControls settings in the CameraGui and OrbitControlsGui
			_this.orbitControls.update();

		}

		/**
		 * Reset <a href="../../Player/jsdoc" target="_blank">Player</a> and restore [camera]{@link https://threejs.org/docs/index.html#api/en/cameras/PerspectiveCamera} position.
		 * @param {THREE.PerspectiveCamera} camera [PerspectiveCamera]{@link https://threejs.org/docs/index.html#api/en/cameras/PerspectiveCamera}.
		 * @param {THREE.Scene} scene [THREE.Scene]{@link https://threejs.org/docs/index.html?q=sce#api/en/scenes/Scene}.
		 */
		this.restoreSceneController = function ( camera, scene ) {

			if ( !three.dat )//options.dat.dat
				return;
				
			//Localization

			const lang = {

				defaultButton: 'Default',
				defaultTitle: 'Reset player and restore camera position.',

			};

			switch ( this.getLanguageCode() ) {

				case 'ru'://Russian language

					lang.defaultButton = 'Восстановить';
					lang.defaultTitle = 'Восстановить положение сцены и проирывателя.';

					break;

			}

			const scenePosition = new three.THREE.Vector3().copy( scene.position ),
				cameraPosition = new three.THREE.Vector3().copy( camera.position );

			three.dat.controllerNameAndTitle( options.dat.gui.add( {
				defaultF: function ( value ) {

					if ( options.player ) options.player.setTime( options.playerOptions.min );

//					camera.position.copy( camera.userData.default.options.position );
					camera.position.copy( cameraPosition );
					scene.position.copy( scenePosition );
					//scene.position.add( options.axesHelper.position );
					//						scene.position.add( options.scene.position );
					//scene.position.copy( options.scene.position );
					if ( options.orbitControls !== false ) {

						options.orbitControls.target = new three.THREE.Vector3();
						options.orbitControls.object.position.copy( camera.position );
						options.orbitControls.update();

					}
					/*						
											controls.target = new THREE.Vector3();
											controls.object.position.copy( camera.position );
											controls.update();
					*/
					/*							
												Player.selectPlayScene( group, { options: options } );
												removeTraceLines();
					*/

				},

			}, 'defaultF' ), lang.defaultButton, lang.defaultTitle );

		}

		Object.defineProperties( this, {

			/**
			 * getter and setter
			 * <pre>
			 * 
			 * playerOptions = {
			 * 
			 *	min: 0,// Minimum range of the axis.
			 *	max: 1,// Maximum range of the axis.
			 *	marks: 10,// Ticks count of the playing. Number of scenes of 3D objects animation.
			 *		//Have effect for <b>max</b> is not Infinity.
			 *	dt: 0.1,// Step of the animation. Have effect only if <b>max</b> is infinity.
			 *	repeat: false,// true - Infinitely repeating 3D objects animation.
			 *	interval: 1,// Ticks per seconds.
			 *	zoomMultiplier: 1.1,// zoom multiplier of the time.
			 *	offset: 0.1,// offset of the time.
			 *	name: "",// name of the time.
			 *
			 * }
			 * </pre>
			 * @param {number} [playerOptions=0] Minimum range of the axis.
			 */
			playerOptions: {

				get: function () {

//					const options = this.options;
					options.playerOptions = options.playerOptions || {};
					const playerOptions = options.playerOptions;
					playerOptions.min = playerOptions.min || 0;
					if ( playerOptions.max === Infinity ) playerOptions.max = null;//Заменяю Infinity на null потому что из cockie Infinity читается как null
					if ( playerOptions.max !== null ) {

						if ( playerOptions.max === undefined ) playerOptions.max = 1;
						playerOptions.marks = playerOptions.marks || 10;//2;

					} else playerOptions.marks = null;
					if ( playerOptions.max === null ) playerOptions.dt = playerOptions.dt || 0.1;
					else playerOptions.dt = ( playerOptions.max - playerOptions.min ) / ( playerOptions.marks - 1 );
					playerOptions.repeat = playerOptions.repeat || false;
					playerOptions.interval = playerOptions.interval || 1;//25;
					playerOptions.zoomMultiplier = playerOptions.zoomMultiplier || 1.1;
					playerOptions.offset = playerOptions.offset || 0.1;
					playerOptions.name = playerOptions.name || '';
					if ( !playerOptions.cameraTarget ) {

						const cameraTarget = new Player.cameraTarget();
						Object.defineProperties( playerOptions, {

							cameraTarget: {

								get: function () {

									return cameraTarget;

								},

							}

						} );

					}
					return options.playerOptions;

				},
				set: function ( playerOptions ) { options.playerOptions = playerOptions; },

			},

			/**
			 * getter
			 * <pre>
			 * See <b>options.a</b> parameter of the <a href="../../player/jsdoc/module-Player-Player.execFunc.html" target="_blank">Player.execFunc</a>.
			 * </pre>
			 **/
			a: {

				get: function () { return options.a; }

			},

			/**
			 * getter
			 * <pre>
			 * See <b>options.b</b> parameter of the <a href="../../player/jsdoc/module-Player-Player.execFunc.html" target="_blank">Player.execFunc</a>.
			 * </pre>
			 **/
			b: {

				get: function () { return options.b; }

			},

			/**
			 * getter and setter
			 * <pre>
			 * See the <b>options.dat</b> parameter of the <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
			 * dat = {
			 * 
			 *	gui: new [dat.GUI()]{@link https://github.com/dataarts/dat.gui} instance,
			 *		undefined - do not use dat-gui JavaScript Controller Library. [dat.gui]{@link https://github.com/dataarts/dat.gui}.
			 *	cookie: false,// do not save to cookie all user settings
			 *	cookieName:,// Name of the cookie.
			 *	axesHelperGui: false,// - do not adds a <a href="../../AxesHelper/jsdoc/module-AxesHelperGui.html" target="_blank">AxesHelperGui</a> into [dat.gui]{@link https://github.com/dataarts/dat.gui}.
			 *	stereoEffectsGui: false,// - do not adds <a href="../../StereoEffect/jsdoc/module-StereoEffect-StereoEffect.html#gui" target="_blank">Stereo Effects folder</a> into [dat.gui]{@link https://github.com/dataarts/dat.gui}.
			 *	playerGui: true,// - adds a <a href="../../player/jsdoc/module-Player.html#~Player.gui" target="_blank">Player controllers</a> into [dat.gui]{@link https://github.com/dataarts/dat.gui}.
			 *	guiSelectPoint: true,// - displays the <a href="../../guiSelectPoint/jsdoc/module-GuiSelectPoint.html" target="_blank">Select Point</a>. [dat.gui]{@link https://github.com/dataarts/dat.gui} based graphical user interface for select a point from the mesh.
			 *	guiFrustumPoints: true,// - Adds <a href="../../FrustumPoints/jsdoc/FrustumPoints.html#gui" target="_blank">Frustum Points folder</a> into [dat.gui]{@link https://github.com/dataarts/dat.gui}.
			 *	cameraGui: true,// - Adds <a href="../../jsdoc/CameraGui/module-CameraGui-CameraGui.html" target="_blank">Camera folder</a> into [dat.gui]{@link https://github.com/dataarts/dat.gui}.
			 *	moveScene: true,// - displays the <a href="../../jsdoc/MoveGroupGui/index.html" target="_blank">move group gui</a>.
			 *	spriteTextGui: true,// - displays the <a href="../../SpriteText/jsdoc/module-SpriteTextGui.html" target="_blank">SpriteTextGui</a>.
			 *
			 * }
			 * </pre>
			 **/
			dat: {

				get: function () {

					class Dat{

						/* *
						 * dat options
						 * @param {dat} dat [dat]{@link https://github.com/dataarts/dat.gui}
						 */
						constructor( dat ) {

							dat = dat || {};
							if ( dat.boDat )
								return dat;//duplucate new Options
							Object.defineProperties( this, {


								/* *
								 * getter
								 * <pre>
								 * returns true if <b>dat</b> was converted by <b>new Dat( options );</b>
								 * </pre>
								 **/
								boDat: {

									get: function () { return true; },

								},

								/* *
								 * getter and setter
								 * <pre>
								 * [dat]{@link https://github.com/dataarts/dat.gui}
								 * </pre>
								 **/
								dat: {

									get: function () {

										console.warn('get dat depreacated. Use three.dat = dat.');
										return three.dat;
//										return dat.dat;

									},
									set: function ( dat ) {

										console.warn('Set dat depreacated. Use three.dat = dat.');
										if (

											dat.dat &&
											( dat.dat.constructor.name === dat.constructor.name ) &&
											( dat.dat.constructor.name !== 'Object' )

										)
											console.error( 'duplicate dat.' );
										dat.dat = dat;

									}

								},

								/* *
								 * getter
								 * <pre>
								 * Name of the cookie.
								 * </pre>
								 **/
								cookieName : {

									get: function () { return dat.cookieName ; },

								},

								/* *
								 * getter
								 * <pre>
								 * [dat.GUI()]{@link https://github.com/dataarts/dat.gui} instance.
								 * </pre>
								 **/
								gui: {

									get: function () {

										if ( !dat.gui && three.dat ) dat.gui = new three.dat.GUI();
										return dat.gui;

									},

								},
								cookie: {

									get: function () { return dat.cookie; },
									set: function ( cookie ) { dat.cookie = cookie; },

								},
								guiSelectPoint: {

									get: function () { return dat.guiSelectPoint; },
									set: function ( guiSelectPoint ) { dat.guiSelectPoint = guiSelectPoint; },

								},
								cameraGui: {

									get: function () { return dat.cameraGui; },
									set: function ( cameraGui ) { dat.cameraGui = cameraGui; },

								},

							} );

							//For debugging. Find a hidden keys
							for ( var propertyName in dat ) {

								if ( this[propertyName] === undefined ) console.error( 'Dat: dat.' + propertyName + ' key is hidden' );

							}

						}

					}
					options.dat = new Dat( options.dat );
//					options.dat.gui = options.dat.gui || new dat.GUI();
//					if ( !options.dat.gui && options.dat.dat ) options.dat.gui = new options.dat.dat.GUI();
					if ( options.dat.gui ) {

						const className = options.dat.gui.domElement.className;
						var guiCount = 0;
						options.dat.gui.domElement.parentElement.childNodes.forEach( function ( node ) {

							if ( node.className === className ) guiCount++;

						} );
						if ( guiCount > 1 )
							console.error( 'Options: duplicate dat.GUI' );

						options.dat.gui.domElement.addEventListener( 'mouseenter', function ( event ) { options.dat.mouseenter = true; } );
						options.dat.gui.domElement.addEventListener( 'mouseleave', function ( event ) { options.dat.mouseenter = false; } );

					}
					if ( options.dat.cookie === false ) options.dat.cookie = new Cookie.defaultCookie();
					else if ( options.dat.cookie === undefined ) options.dat.cookie = cookie;
//					options.dat.cookie = options.dat.cookie !== false ? cookie : new Cookie.defaultCookie();
					options.dat.getCookieName = function ( cookieName = '' ) {

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
					//stereoEffectsGui: false,
					//spriteTextGui: false,
					//folderPoint: false,
					return options.dat;

				},
				set: function ( dat ) { options.dat = dat; },
/*
				cookieName: {

					get: function ( cookieName = '' ) {

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

				},
*/

			},

			/**
			 * getter
			 * <pre>
			 * Your custom getLanguageCode() function.
			 * returns the "primary language" subtag of the language version of the browser.
			 * Examples: "en" - English language, "ru" Russian.
			 * See the "Syntax" paragraph of RFC 4646 {@link https://tools.ietf.org/html/rfc4646#section-2.1|rfc4646 2.1 Syntax} for details.
			 * Default returns the language code of your browser.
			 * </pre>
			 **/
			getLanguageCode: {

				get: function () {

					if ( typeof options.getLanguageCode === "string" )
						return function () {

/*
							if ( !this || !this.options )
								return 'en';//English language
*/
							return options.getLanguageCode;

						}
					return options.getLanguageCode || getLanguageCode;

				}

			},

			/**
			 * getter and setter
			 * <pre>
			 * See <b>options.scales</b> parameter of the <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
			 * </pre>
			 **/
			scales: {

				get: function () { return options.scales; },
				set: function ( scales ) { options.scales = scales; }

			},

			/**
			 * getter
			 * <pre>
			 * Points сolor.
			 * See <b>options.palette</b> parameter of the <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
			 * </pre>
			 **/
			palette: {

				get: function () {

					if ( options.palette !== undefined ) {

						switch ( typeof options.palette ) {

							case 'number':
								options.palette = new ColorPicker.palette( { palette: options.palette } );
								break;
							case 'boolean':
								if ( options.palette )
									options.palette = new ColorPicker.palette();// { palette: ColorPicker.paletteIndexes.BGRW } );
								break;
							default: {

								if ( options.palette instanceof ColorPicker.palette === false )
									console.error( 'MyThree: invalid typeof options.palette: ' + typeof options.palette );

							}

						}

					}
					return options.palette;

				},

			},

			/**
			 * getter
			 * <pre>
			 * returns true if <b>options</b> was converted by <b>new Options( options );</b>
			 * </pre>
			 **/
			boOptions: {

				get: function () { return true;/*options.boOptions;*/ },

			},

			/**
			 * getter
			 * <pre>
			 * returns {
			 *
			 * 	size = 5.0; point size
			 * 	sizePointsMaterial = 100.0; The <b>size</b> property of the parameters of the [THREE.PointsMaterial]{@link https://threejs.org/docs/index.html?q=PointsMaterial#api/en/materials/PointsMaterial}.
			 *
			 * }
			 * </pre>
			 **/
			point: {

				get: function () { return options.point; },

			},

			/**
			 * getter
			 * <pre>
			 * <b>SpriteText</b> options
			 * See <b>options</b> parameter of the <a href="../../SpriteText/jsdoc/module-SpriteText.html" target="_blank">SpriteText</a>.
			 * </pre>
			 **/
			spriteText: {

				get: function () {

					if ( options.spriteText ) return options.spriteText;
					return {};

				},

			},

			/**
			 * getter and setter
			 * [Raycaster]{@link https://threejs.org/docs/index.html#api/en/core/Raycaster}.
			 **/
			raycaster: {

				get: function () {

					if ( options.raycaster ) return options.raycaster;

				},
				set: function ( raycaster ) { options.raycaster = raycaster; }

			},

			/**
			 * getter and setter
			 * <pre>
			 * [PerspectiveCamera]{@link https://threejs.org/docs/index.html#api/en/cameras/PerspectiveCamera}.
			 * See <b>options.camera</b> parameter of the <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
			 * </pre>
			 **/
			camera: {

				get: function () {

					options.camera = options.camera || {};
/*					
					options.camera.position = options.camera.position || new three.THREE.Vector3( 0.4, 0.4, 2 );
					options.camera.scale = options.camera.scale || new three.THREE.Vector3( 1, 1, 1 );
*/					
					if ( !options.camera.position ) options.camera.position = new three.THREE.Vector3( 0.4, 0.4, 2 );
					if ( !options.camera.scale ) options.camera.scale = new three.THREE.Vector3( 1, 1, 1 );
					return options.camera;

				},
				set: function ( camera ) { options.camera = camera; }

			},

			/**
			 * getter
			 * <pre>
			 * Camera looking at selected point during playing. See the <b>cameraTarget</b> parameter of the <a href="../../player/jsdoc/module-Player-Player.cameraTarget.html#init" target="_blank">Player.cameraTarget.init(...)</a> function for details.
			 * See <b>options.cameraTarget</b> parameter of the <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
			 * </pre>
			 **/
			cameraTarget: {

				get: function () { return options.cameraTarget; },

			},

			/**
			 * getter
			 * <pre>
			 * The <b>HTMLElement</b>, contains a <b>canvas</b>.
			 * See <b>options.elContainer</b> parameter of the <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
			 * </pre>
			 **/
			elContainer: {

				get: function () { return options.elContainer; },

			},

			/**
			 * getter and setter
			 * <pre>
			 * true - use my <a href="../../canvasMenu/jsdoc/index.html" target="_blank">dropdown menu for canvas</a> in my version of [dat.gui]{@link https://github.com/anhr/dat.gui}.
			 * See <b>options.canvasMenu</b> parameter of the <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
			 * </pre>
			 **/
			canvasMenu: {

				get: function () { return options.canvasMenu; },
				set: function ( canvasMenu ) {

					if ( options.canvasMenu && ( options.canvasMenu !== true ) && ( options.canvasMenu !== false ) ) console.warn( 'Duplicate canvasMenu' );
					options.canvasMenu = canvasMenu;

				}

			},

			/**
			 * getter
			 * <pre>
			 * <b>canvas</b> properties.
			 * See <b>options.canvas</b> parameter of the <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
			 * </pre>
			 **/
			canvas: {

				get: function () { return options.canvas; },

			},

			/**
			 * getter and setter
			 * <pre>
			 * Creates a <a href="../../frustumPoints/jsdoc/index.html" target="_blank">FrustumPoints</a> instance.
			 * See <b>options.frustumPoints</b> parameter of the <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
			 * </pre>
			 **/
			frustumPoints: {

				get: function () { return options.frustumPoints; },
				set: function ( frustumPoints ) {

					if (

						options.frustumPoints &&
						( options.frustumPoints.constructor.name === frustumPoints.constructor.name ) &&
						( options.frustumPoints.constructor.name !== 'Object' )

					)
						console.error( 'duplicate frustumPoints.' );
					options.frustumPoints = frustumPoints;

				}

			},

			/**
			 * getter and setter
			 * <pre>
			 * Use <a href="../../StereoEffect/jsdoc/index.html" target="_blank">StereoEffect</a>.
			 * See <b>options.stereoEffect</b> parameter of the <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
			 * </pre>
			 **/
			stereoEffect: {

				get: function () { return options.stereoEffect; },
				set: function ( stereoEffect ) {

					if (

						options.stereoEffect &&
						( options.stereoEffect.constructor.name === stereoEffect.constructor.name ) &&
						( options.stereoEffect.constructor.name !== 'Object' )

					)
						console.error( 'duplicate stereoEffect.' );
					options.stereoEffect = stereoEffect;

				}

			},

			/**
			 * getter and setter
			 * <pre>
			 * Use <a href="../../player/jsdoc/index.html" target="_blank">Player</a>.
			 * See <b>options.player</b> parameter of the <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
			 * </pre>
			 **/
			player: {

				get: function () { return options.player; },
				set: function ( player ) {

					if ( options.player ) console.error( 'duplicate player.' );
					options.player = player;

				}

			},

			/**
			 * getter and setter
			 * <pre>
			 * Use <a href="../../axesHelper/jsdoc/index.html" target="_blank">AxesHelper</a>.
			 * See <b>options.axesHelper</b> parameter of the <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
			 * </pre>
			 **/
			axesHelper: {

				get: function () { return options.axesHelper; },
				set: function ( axesHelper ) {

					if ( options.axesHelper ) console.error( 'duplicate axesHelper.' );
					options.axesHelper = axesHelper;

				}

			},

			/**
			 * getter and setter
			 * <pre>
			 * Use <a href="../../canvasMenu/jsdoc/index.html" target="_blank">CanvasMenu</a>.
			 * See <b>options.canvasMenu</b> parameter of the <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
			 * </pre>
			 **/
			canvasMenu: {

				get: function () { return options.canvasMenu; },
				set: function ( canvasMenu ) {

					if ( options.canvasMenu ) console.error( 'duplicate canvasMenu.' );
					options.canvasMenu = canvasMenu;

				}

			},

			/**
			 * getter and setter
			 * <pre>
			 * Use [OrbitControls]{@link https://threejs.org/docs/index.html?q=orb#examples/en/controls/OrbitControls}.
			 * See <b>options.orbitControls</b> parameter of the <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
			 * </pre>
			 **/
			orbitControls: {

				get: function () { return options.orbitControls; },
				set: function ( orbitControls ) {

					if (

						options.orbitControls &&
						( options.orbitControls.constructor.name === orbitControls.constructor.name ) &&
						( options.orbitControls.constructor.name !== 'Object' )

					)
						console.error( 'duplicate orbitControls.' );
					options.orbitControls = orbitControls;

				}

			},

			/**
			 * getter returns 1
			 **/
			scale: {

				get: function () { return 1; },

			},

			/**
			 * getter
			 * <pre>
			 * Use <a href="../../jsdoc/pointLight/index.html" target="_blank">pointLight</a>.
			 * See <b>options.pointLight</b> parameter of the <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
			 * </pre>
			 **/
			pointLight: {

				get: function () { return options.pointLight; },

			},

			/**
			 * getter
			 * <pre>
			 * <a href="../../player/jsdoc/module-Player-Player.cameraTarget.html" target="_blank">Player.cameraTarget</a> class instance. Functions for camera for looking at selected point.
			 * </pre>
			 **/
			cameraTarget: {

				get: function () { return options.cameraTarget; },

			},

		} );

		//For debugging. Find a hidden keys
		for( var propertyName in options ) {

		   if ( this[propertyName] === undefined ) console.error( 'Options: options.' + propertyName + ' key is hidden' );

		}

	}

} 

/**
 * Finds on the [Scene]{@link https://threejs.org/docs/index.html?q=Scene#api/en/scenes/Scene} a child item of the "Sprite" type and "spriteTextIntersection" name.
 * @param {THREE.Scene} scene [Scene]{@link https://threejs.org/docs/index.html?q=Scene#api/en/scenes/Scene} instance.
 * @returns item of the "Sprite" type and "spriteTextIntersection" name or undefined.
 */
Options.findSpriteTextIntersection = function ( scene ) {

	var spriteTextIntersection;
	scene.children.forEach( function ( item ) {

		if ( ( item.type === "Sprite" ) && ( item.name === Options.findSpriteTextIntersection.spriteTextIntersectionName ) ) {

			spriteTextIntersection = item;
			return;

		}

	} );
	return spriteTextIntersection;

}
/**
 * @returns "spriteTextIntersection"
 * */
Options.findSpriteTextIntersection.spriteTextIntersectionName = 'spriteTextIntersection';
/**
 * [Raycaster]{@link https://threejs.org/docs/index.html#api/en/core/Raycaster} methods:
 * <pre>
 * <a href="./Options.raycaster.onIntersection.html" target="_blank">onIntersection(...)</a>.
 * <a href="./Options.raycaster.onIntersectionOut.html" target="_blank">onIntersectionOut(...)</a>.
 * <a href="./Options.raycaster.onMouseDown.html" target="_blank">onMouseDown(...)</a>.
 * </pre>
 * */
Options.raycaster = {

	cursor: undefined,
	/** @namespace
	 * @description Displays a sprite text if you move mouse over an 3D object
	 * @param {Object} intersection See [.intersectObject]{@link https://threejs.org/docs/index.html#api/en/core/Raycaster.intersectObject} for details.
	 * @param {Options} options the following options are available.
	 * See the <b>options</b> parameter of the <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
	 * @param {object} [options.spriteText] spriteText options. See <a href="../../SpriteText/jsdoc/module-SpriteText.html" target="_blank">SpriteText</a> <b>options</b> parameter for details.
	 * @param {object} [options.scales] axes scales.
	 * See <b>options.scales</b> parameter of the <a href="../../AxesHelper/jsdoc/module-AxesHelper-AxesHelper.html" target="_blank">AxesHelper</a> class for details.
	 * @param {THREE.Scene} scene [Scene]{@link https://threejs.org/docs/index.html?q=sc#api/en/scenes/Scene}.
	 * @param {THREE.Camera} camera [PerspectiveCamera]{@link https://threejs.org/docs/index.html?q=persp#api/en/cameras/PerspectiveCamera}.
	 * @param {canvas} canvas [canvas]{@link https://www.w3schools.com/tags/tag_canvas.asp} tag.
	 * @param {THREE.WebGLRenderer} renderer [WebGLRenderer]{@link https://threejs.org/docs/index.html?q=WebGLRenderer#api/en/renderers/WebGLRenderer} instance.
	 */
	onIntersection: function ( intersection, options, scene, camera, canvas, renderer ) {

		if ( intersection.object.userData.isInfo !== undefined && !intersection.object.userData.isInfo() )
			return;
		var spriteTextIntersection = Options.findSpriteTextIntersection( scene );
		if ( spriteTextIntersection === undefined ) {


			const rect = options.spriteText.rect ? JSON.parse( JSON.stringify( options.spriteText.rect ) ) : {};
			rect.displayRect = true;
			rect.backgroundColor = 'rgba(0, 0, 0, 1)';
			spriteTextIntersection = StereoEffect.getTextIntersection( intersection, {

				scales: options.scales,
				spriteOptions: {

					textHeight: options.spriteText.textHeight,
					fontColor: options.spriteText.fontColor,
					rect: rect,
					group: scene,
					center: {

						camera: camera,
						canvas: canvas,

					}

				}

			} );
			spriteTextIntersection.name = Options.findSpriteTextIntersection.spriteTextIntersectionName;
			spriteTextIntersection.scale.divide( scene.scale );
			scene.add( spriteTextIntersection );

		} else spriteTextIntersection.position.copy( intersection.point );

		this.cursor = renderer.domElement.style.cursor;
		renderer.domElement.style.cursor = 'pointer';

	},

	/** @namespace
	 * @description Hides a sprite text if you move mouse out an object.
	 * @param {THREE.Scene} scene [Scene]{@link https://threejs.org/docs/index.html?q=sc#api/en/scenes/Scene}.
	 * @param {THREE.WebGLRenderer} renderer [WebGLRenderer]{@link https://threejs.org/docs/index.html?q=WebGLRenderer#api/en/renderers/WebGLRenderer} instance.
	 */
	onIntersectionOut: function ( scene, renderer ) {

		var detected = false;
		do {

			var spriteTextIntersection = Options.findSpriteTextIntersection( scene );
			if ( spriteTextIntersection !== undefined ) {

				scene.remove( spriteTextIntersection );
				if ( detected )
					console.error( 'Duplicate spriteTextIntersection' );
				detected = true;

			}

		} while ( spriteTextIntersection !== undefined )

		renderer.domElement.style.cursor = this.cursor;

	},
	/** @namespace
	 * @description The [pointerdown]{@link https://developer.mozilla.org/en-US/docs/Web/API/Document/pointerdown_event}
	 * event is fired when a pointer becomes active. For mouse, it is fired when the device transitions from no buttons depressed to at least one button depressed. For touch, it is fired when physical contact is made with the digitizer. For pen, it is fired when the stylus makes physical contact with the digitizer.
	 * @param {Object} intersection See [.intersectObject]{@link https://threejs.org/docs/index.html#api/en/core/Raycaster.intersectObject} for details.
	 * @param {Options} options the following options are available.
	 * @param {GuiSelectPoint} [options.guiSelectPoint] <a href="../../guiSelectPoint/jsdoc/index.html" target="_blank">GuiSelectPoint</a> instance was created.
	 * @param {AxesHelper} [options.axesHelper] <a href="../../AxesHelper/jsdoc/index.html" target="_blank">AxesHelper</a> instance was created.
	 */
	onMouseDown: function ( intersection, options ) {

		if ( ( intersection.object.userData.isInfo !== undefined ) && !intersection.object.userData.isInfo() )
			return;//No display information about frustum point
		if ( options.guiSelectPoint )
			options.guiSelectPoint.select( intersection );
		else if ( options.axesHelper )
			options.axesHelper.exposePosition( intersection );
/*infinity loop
		if ( options.raycaster.onMouseDown )
			options.raycaster.onMouseDown( intersection );
*/			

	},

}
export default Options;