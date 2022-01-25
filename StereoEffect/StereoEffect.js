/**
 * @module StereoEffect
 * @description Uses dual PerspectiveCameras for Parallax Barrier effects.
 * @see About {@link https://en.wikipedia.org/wiki/Parallax_barrier|Parallax barrier}.
 * 
 * @author {@link https://anhr.github.io/AboutMe/|Andrej Hristoliubov}
 * @author {@link http://alteredqualia.com/|alteredq}
 * @author {@link http://mrdoob.com/|mrdoob}
 * @author {@link http://aleksandarrodic.com/|arodic}
 * @author {@link http://fonserbc.github.io/|fonserbc}
 *
 * @copyright 2011 Data Arts Team, Google Creative Lab
 *
 * @license under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
*/

import three from '../three.js'

import PositionController from '../PositionController.js';
//import PositionController from 'https://raw.githack.com/anhr/commonNodeJS/master/PositionController.js';

import CreateFullScreenSettings from '../createFullScreenSettings.js';
import Options from '../Options.js'

class StereoEffect {

	/**
	 * @class
	 * Uses dual PerspectiveCameras for [Parallax Barrier]{@link https://en.wikipedia.org/wiki/Parallax_barrier} effects.
	 * @param {THREE.WebGLRenderer} renderer {@link https://threejs.org/docs/#api/en/renderers/WebGLRenderer|WebGL renderer}
	 * @param {Options} [options=new Options()] <a href="../../jsdoc/Options/Options.html" target="_blank">Options</a> instance.
	 * See <b>options</b> parameter of <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
	 * @param {Function} [options.getLanguageCode=language code of your browser] Your custom getLanguageCode() function.
	 * <pre>
	 * returns the "primary language" subtag of the language version of the browser.
	 * Examples: "en" - English language, "ru" Russian.
	 * See the {@link https://tools.ietf.org/html/rfc4646#section-2.1|Syntax} paragraph of RFC 4646 for details.
	 * </pre>
	 * @param {Object} [options.lang] Object with localized language values.
	 * @param {boolean} [options.dat.cookie] false - do not save to cookie the StereoEffects  settings
	 * @param {string} [options.dat.cookieName] Name of the cookie is "StereoEffect" + options.dat.cookieName.
	 * @param {boolean|Object} [options.stereoEffect] false - do not create a <b>StereoEffect</b> instance.
	 * <p>Or:</p>
	 * @param {number} [options.stereoEffect.spatialMultiplex=spatialMultiplexsIndexs.Mono] spatial multiplex
	 * <pre>
	 * See {@link https://en.wikipedia.org/wiki/DVB_3D-TV|DVB 3D-TV} for details
	 * 	Available values
	 *
	 * 		spatialMultiplexsIndexs.Mono - no stereo effacts
	 *
	 * 		spatialMultiplexsIndexs.SbS - 'Side by side' format just put the left and right images one next to the other.
	 * 			See https://en.wikipedia.org/wiki/DVB_3D-TV#Side_by_side for dretails
	 *
	 * 		spatialMultiplexsIndexs.TaB - 'Top and bottom' format put left and right images one above the other.
	 * 			See //https://en.wikipedia.org/wiki/DVB_3D-TV#Top_and_bottom for details
	 *
	 * 	Example - options.stereoEffect.spatialMultiplex: StereoEffect.spatialMultiplexsIndexs.Mono
	 * </pre>
	 * @param {THREE.PerspectiveCamera} [options.stereoEffect.camera] [PerspectiveCamera]{@link https://threejs.org/docs/index.html#api/en/cameras/PerspectiveCamera}. Use the <b>camera</b> key if you want control cameras focus.
	 * @param {Float} [options.stereoEffect.far=10] Camera frustum far plane. The <b>far</b> key uses for correct calculation default values of Eye separation.
	 * See <b>far</b> parameter of the [PerspectiveCamera]{@link https://threejs.org/docs/index.html?q=PerspectiveCamera#api/en/cameras/PerspectiveCamera.far}
	 * @param {Float} [options.stereoEffect.eyeSep=( new THREE.StereoCamera().eyeSep / 10 ) * options.stereoEffect.far] Eye separation.
	 * See [StereoCamera.eyeSep]{@link https://threejs.org/docs/index.html?q=StereoCamera#api/en/cameras/StereoCamera.eyeSep}.
	 * @param {Float} [options.stereoEffect.stereoAspect=1] [THREE.StereoCamera.aspect]{@link https://threejs.org/docs/index.html?q=StereoCamera#api/en/cameras/StereoCamera.aspect}. Camera frustum aspect ratio.
	 * @param {boolean} [options.stereoEffect.rememberSize] true - remember default size of the canvas. Resize of the canvas to full screen for stereo mode and restore to default size if no stereo effacts.
	 * @param {HTMLElement} [options.stereoEffect.elParent] parent of the canvas.
	 * Use only if you use {@link https://threejs.org/docs/index.html#api/en/core/Raycaster|THREE.Raycaster} (working out what objects in the 3d space the mouse is over)
	 * and your canvas is not full screen.
	 */
	constructor( renderer, options = new Options() ) {

		if ( !renderer ) {

			console.error( 'StereoEffect: renderer = ' + renderer );
			return;

		}

		if ( !options.boOptions ) {

			options = new Options( options );

		}
		if ( options.stereoEffect === false ) return;

		if( options.dat.gui ) options.dat.mouseenter = false;//true - мышка находится над gui или canvasMenu
				//В этом случае не надо обрабатывать событие elContainer 'pointerdown'
				//по которому выбирается точка на canvas.
				//В противном случае если пользователь щелкнет на gui, то он может случайно выбрать точку на canvas.
				//Тогда открывается папка Meshes и все органы управления сдвигаются вниз. Это неудобно.
				//И вообще нехорошо когда выбирается точка когда пользователь не хочет это делать.

		const THREE = three.THREE;
		assign();

		if ( !options.stereoEffect ) options.stereoEffect = {};

		const settings = options.stereoEffect;
		/**
		 * See <b>options.stereoEffect</b> parameter of the <b>StereoEffect</b> class above.
		 * */
		this.settings = settings;
		/**
		 * See <b>options</b> parameter of the <b>StereoEffect</b> class above.
		 * */
		this.options = options;

		options.stereoEffect = this;

		//Убрал spatialMultiplex: settings.spatialMultiplex !== undefined ? settings.spatialMultiplex : spatialMultiplexsIndexs.Mono,//SbS,
		//из const optionsDefault
		//Потому что будет ошибка 
		//THREE.StereoEffect.render: Invalid "Spatial  multiplex" parameter: NaN
		//если в приложении не используется StereoEffect.gui
		//и не определен settings.spatialMultiplex
		if ( settings.spatialMultiplex === undefined ) settings.spatialMultiplex = spatialMultiplexsIndexs.Mono;//SbS

		settings.stereo = new THREE.StereoCamera();
		settings.stereo.aspect = settings.stereoAspect || 1;//0.5;
		if ( settings.far === undefined )
			settings.far = new THREE.PerspectiveCamera().focus;
		settings.focus = settings.camera === undefined ? new THREE.PerspectiveCamera().focus :
			new THREE.Vector3().distanceTo( settings.camera.position );
		settings.zeroParallax = 0;
		settings.eyeSep = settings.eyeSep || ( new THREE.StereoCamera().eyeSep / 10 ) * settings.far;
		if ( settings.camera !== undefined )
			settings.camera.focus = settings.focus;

		/**
		 * Sets eye separation.
		 * @param {any} eyeSep See <b>options.stereoEffect.eyeSep</b> parameter of the <b>StereoEffect</b> class above.
		 */
		this.setEyeSeparation = function ( eyeSep ) {

			settings.stereo.eyeSep = eyeSep;

		};

		this.setEyeSeparation( settings.eyeSep );

		/**
		 * Convert mouse position to renderer coordinates.
		 * @returns <pre>
		 * {
		 *
		 *	getMousePosition:function
		 *
		 * }
		 * </pre>
		 */
		this.getRendererSize = function () {

			return Options.raycaster.EventListeners.getRendererSize( renderer, settings.elParent );

		};
		var fullScreenSettings;
		var spatialMultiplexCur;
		/**
		 * Render a scene or another type of object using a camera.
		 * @see [WebGLRenderer.render]{@link https://threejs.org/docs/index.html?q=WebGLRenderer#api/en/renderers/WebGLRenderer.render}
		 * @param {THREE.Scene} scene [Scene]{@link https://threejs.org/docs/index.html#api/en/scenes/Scene}.
		 * @param {THREE.Camera} camera [PerspectiveCamera]{@link https://threejs.org/docs/index.html?q=persp#api/en/cameras/PerspectiveCamera}.
		 */
		this.render = function ( scene, camera ) {

			const spatialMultiplex = parseInt( settings.spatialMultiplex );

			if ( settings.rememberSize && !fullScreenSettings ) {

				if ( _canvasMenu && _canvasMenu.getFullScreenSettings )
					fullScreenSettings = _canvasMenu.getFullScreenSettings( this );
				else fullScreenSettings = new CreateFullScreenSettings( THREE, renderer, camera,
					{
						canvasMenu: _canvasMenu,
						stereoEffect: this,

					} );

			}

			scene.updateMatrixWorld();

			if ( camera.parent === null ) camera.updateMatrixWorld();

			const size = new THREE.Vector2();
			renderer.getSize( size );

			if ( renderer.autoClear ) renderer.clear();
			renderer.setScissorTest( true );

			var xL, yL, widthL, heightL,
				xR, yR, widthR, heightR;
			const parallax = settings.zeroParallax;
			function setMultiplex( stereoEffect ) {

				if ( !fullScreenSettings || ( spatialMultiplexCur === spatialMultiplex ) )
					return false;
				spatialMultiplexCur = spatialMultiplex;
				if ( stereoEffect.setControllerSpatialMultiplex ) stereoEffect.setControllerSpatialMultiplex( spatialMultiplex );
				else if ( stereoEffect.setSpatialMultiplex ) stereoEffect.setSpatialMultiplex( spatialMultiplex );
				return true;

			}
			function setFullScreen( fullScreen, stereoEffect ) {

				if ( setMultiplex( stereoEffect ) )
					fullScreenSettings.setFullScreen( fullScreen );

			}

			switch ( spatialMultiplex ) {

				case spatialMultiplexsIndexs.Mono://Mono

					renderer.setScissor( 0, 0, size.width, size.height );
					renderer.setViewport( 0, 0, size.width, size.height );
					renderer.render( scene, camera );
					renderer.setScissorTest( false );

					//если оствить setFullScreen то canvas не перейдет в full screen
					//если в программе по умолчанию был задан full screen и используется canvasMenu
					//Для провероки
					//в файле "D:\My documents\MyProjects\webgl\three.js\GitHub\commonNodeJS\master\myThree\Examples\html\index.html"
					//	для new MyThree(...)
					//		установить canvasMenu: true,
					//		убрать canvas: { fullScreen: false, }. Тоесть по умолчанию canvas перейдет в full screen
					//открыть http://localhost/anhr/commonNodeJS/master/myThree/Examples/html/

					//setFullScreen( true, this );

					//если оставить setFullScreen то canvas не перейдет в full screen
					//если убрать setFullScreen то canvas перейдет в full screen
					//но тогда будет неправильно выбираться пункт меню stereo Effects в canvasMenu в случае, если 
					//Выбрать пункт "слева направо" меню stereo Effects в canvasMenu.
					//	включится стерео режим.
					//	canvas перейдет в full screen.
					//Выбрать пункт "Восстановить размеры экрана" меню stereo Effects в canvasMenu.
					//	canvas выйдет из full screen.
					//	стерео режим отключится
					//	НО! ОСТАНЕТСЯ ВЫБРАННЫМ пункт "слева направо" меню stereo Effects в canvasMenu.
					//Для решения проблемы вставил строку ниже

					if ( options.canvasMenu ) setMultiplex( this );
					else setFullScreen( true, this );

					//Теперь в режиме full screen при выборе пункта "Моно" меню stereo Effects в canvasMenu
					//canvas не выходит из full screen. Ну и фиг с ним.

					return;

				case spatialMultiplexsIndexs.SbS://'Side by side'

					const _width = size.width / 2;

					xL = 0 + parallax; yL = 0; widthL = _width; heightL = size.height;
					xR = _width - parallax; yR = 0; widthR = _width; heightR = size.height;

					setFullScreen( false, this );

					break;

				case spatialMultiplexsIndexs.TaB://'Top and bottom'

					xL = 0 + parallax; yL = 0; widthL = size.width; heightL = size.height / 2;
					xR = 0 - parallax; yR = size.height / 2; widthR = size.width; heightR = size.height / 2;

					setFullScreen( false, this );

					break;
				default: console.error( 'THREE.StereoEffect.render: Invalid "Spatial  multiplex" parameter: ' + spatialMultiplex );

			}

			settings.stereo.update( camera );

			renderer.setScissor( xL, yL, widthL, heightL );
			renderer.setViewport( xL, yL, widthL, heightL );
			renderer.render( scene, settings.stereo.cameraL );

			renderer.setScissor( xR, yR, widthR, heightR );
			renderer.setViewport( xR, yR, widthR, heightR );
			renderer.render( scene, settings.stereo.cameraR );

			renderer.setScissorTest( false );

		};

		//Localization
		function getLang( params ) {

			params = params || {};
			const _lang = {

				stereoEffects: 'Stereo effects',

				spatialMultiplexName: 'Spatial  multiplex',
				spatialMultiplexTitle: 'Choose a way to do spatial multiplex.',

				spatialMultiplexs: {
					'Mono': spatialMultiplexsIndexs.Mono,
					'Side by side': spatialMultiplexsIndexs.SbS, //https://en.wikipedia.org/wiki/DVB_3D-TV#Side_by_side
					'Top and bottom': spatialMultiplexsIndexs.TaB, //https://en.wikipedia.org/wiki/DVB_3D-TV#Top_and_bottom
				},

				eyeSeparationName: 'Eye separation',
				eyeSeparationTitle: 'The distance between left and right cameras.',

				focus: 'Focus',
				focusTitle: 'Object distance.',

				zeroParallaxName: 'Zero parallax',
				zeroParallaxTitle: 'Distance to objects with zero parallax.',

				defaultButton: 'Default',
				defaultTitle: 'Restore default stereo effects settings.',

			};

			const _languageCode = params.getLanguageCode === undefined ? 'en'//Default language is English
				: params.getLanguageCode();
			switch ( _languageCode ) {

				case 'ru'://Russian language

					_lang.stereoEffects = 'Стерео эффекты';//'Stereo effects'

					_lang.spatialMultiplexName = 'Мультиплекс';//'Spatial  multiplex'
					_lang.spatialMultiplexTitle = 'Выберите способ создания пространственного мультиплексирования.';

					_lang.spatialMultiplexs = {
						'Моно': spatialMultiplexsIndexs.Mono, //Mono
						'Слева направо': spatialMultiplexsIndexs.SbS, //https://en.wikipedia.org/wiki/DVB_3D-TV#Side_by_side
						'Сверху вниз': spatialMultiplexsIndexs.TaB, //https://en.wikipedia.org/wiki/DVB_3D-TV#Top_and_bottom
					};

					_lang.eyeSeparationName = 'Развод камер';
					_lang.eyeSeparationTitle = 'Расстояние между левой и правой камерами.';

					_lang.focus = 'Фокус';
					_lang.focusTitle = 'Расстояние до объекта.';

					_lang.zeroParallaxName = 'Параллакс 0';
					_lang.zeroParallaxTitle = 'Расстояние до объектов с нулевым параллаксом.';

					_lang.defaultButton = 'Восстановить';
					_lang.defaultTitle = 'Восстановить настройки стерео эффектов по умолчанию.';

					break;
				default://Custom language
					if ( ( params.lang === undefined ) || ( params.lang._languageCode != _languageCode ) )
						break;

					Object.keys( params.lang ).forEach( function ( key ) {

						if ( _lang[key] === undefined )
							return;
						_lang[key] = params.lang[key];

					} );

			}
			return _lang;

		}

		/**
		 * Adds StereoEffects folder into dat.GUI.
		 * @see {@link https://github.com/anhr/dat.gui|dat.gui}.
		 * @param {Object} [guiParams={}] the following params are available.
		 * @param {GUI} [guiParams.dat] [dat.GUI()]{@link https://github.com/dataarts/dat.gui}.
		 * @param {GUI} [guiParams.folder] <b>StereoEffects</b> folder. See {@link https://github.com/anhr/dat.gui|dat.gui} for details
		 * @param {Function} [guiParams.onChangeMode] The event is fired if user has changed the stereo mode.
		 * <pre>
		 * parameter is new stereo mode.
		 * See the <b>settings.spatialMultiplex</b> parameter of the <b>StereoEffect</b> class for details.
		 * <pre>
		 * @param {number} [guiParams.scale=1] scale of allowed values.
		 */
		this.gui = function ( guiParams = {} ) {

			const gui = guiParams.folder || options.dat.gui;
			if ( !gui || options.dat.stereoEffectsGui === false )
				return;
			const dat = guiParams.dat || three.dat;//options.dat.dat;
			if ( guiParams === undefined ) guiParams = {};
			guiParams.scale = guiParams.scale || 1;
			const stereoEffect = options.dat.getCookieName( 'StereoEffect' ),
				_lang = getLang( { getLanguageCode: options.getLanguageCode, lang: options.lang } );
			
			const optionsDefault = {

				spatialMultiplex: settings.spatialMultiplex,
				eyeSep: ( new THREE.StereoCamera().eyeSep / 10 ) * settings.far,
				focus: settings.focus,
				zeroParallax: 0,

			}
			Object.freeze( optionsDefault );
			options.dat.cookie.getObject( stereoEffect, settings, optionsDefault );
			settings.spatialMultiplex = parseInt( settings.spatialMultiplex );

			if ( this.setSpatialMultiplex ) this.setSpatialMultiplex( settings.spatialMultiplex );

			//

			function displayControllers( value ) {

				const display = value == spatialMultiplexsIndexs.Mono ? 'none' : 'block';
				_fEyeSeparation.domElement.style.display = display;
				if ( _controllerCameraFocus !== undefined )
					_controllerCameraFocus.__li.style.display = display;
				_controllerDefaultF.__li.style.display = display;
				_controllerZeroParallax.__li.style.display = display;

			}

			const _fStereoEffects = gui.addFolder( _lang.stereoEffects );//Stero effects folder

			//Spatial multiplex
			const _controllerSpatialMultiplex = _fStereoEffects.add( settings, 'spatialMultiplex',
				_lang.spatialMultiplexs ).onChange( function ( value ) {

					value = parseInt( value );
					displayControllers( value );
					setObject( stereoEffect );
					if ( guiParams.onChangeMode )
						guiParams.onChangeMode( value );
					if ( menuItemStereoEffect )
						menuItemStereoEffect.select( value )

				} );
			dat.controllerNameAndTitle( _controllerSpatialMultiplex, _lang.spatialMultiplexName, _lang.spatialMultiplexTitle );
			this.setControllerSpatialMultiplex = function ( index ) {

				saveToCookie = false;
				_controllerSpatialMultiplex.setValue( index );
				saveToCookie = true;

			}

			//eyeSeparation
			//http://paulbourke.net/papers/vsmm2007/stereoscopy_workshop.pdf
			const _fEyeSeparation = _fStereoEffects.addFolder( _lang.eyeSeparationName );//Eye Separation
			dat.folderNameAndTitle( _fEyeSeparation, _lang.eyeSeparationName, _lang.eyeSeparationTitle );
			_fEyeSeparation.add( new PositionController( function ( shift ) {

				settings.eyeSep += shift;
				_controllerEyeSep.setValue( settings.eyeSep );

			}, { settings: { offset: 0.01 }, min: 0.0001, max: 0.01, step: 0.0001 }
			) );
			const _controllerEyeSep = dat.controllerZeroStep( _fEyeSeparation, settings.stereo, 'eyeSep', function ( value ) {

				settings.eyeSep = value;
				setObject( stereoEffect );

			} );
			dat.controllerNameAndTitle( _controllerEyeSep, _lang.eyeSeparationName, _lang.eyeSeparationTitle );

			if ( settings.camera !== undefined ) settings.camera.focus = settings.focus;
			
			var _controllerCameraFocus;
			if ( settings.camera ) {

				_controllerCameraFocus = _fStereoEffects.add( settings.camera,
					'focus', optionsDefault.focus / 10, optionsDefault.focus * 2, optionsDefault.focus / 1000 )
					.onChange( function ( value ) {

						settings.focus = value;
						setObject( stereoEffect );

					} );
				dat.controllerNameAndTitle( _controllerCameraFocus, _lang.focus, _lang.focusTitle );

			}

			//Zero parallax
			//http://paulbourke.net/papers/vsmm2007/stereoscopy_workshop.pdf
			const _minMax = ( 60 - ( 400 / 9 ) ) * guiParams.scale + 400 / 9;
			const _controllerZeroParallax = _fStereoEffects.add( settings, 'zeroParallax', - _minMax, _minMax )
				.onChange( function ( value ) {

					settings.zeroParallax = value;
					setObject( stereoEffect );

				} );
			dat.controllerNameAndTitle( _controllerZeroParallax, _lang.zeroParallaxName, _lang.zeroParallaxTitle );

			//default button
			const _controllerDefaultF = _fStereoEffects.add( {
				defaultF: function ( value ) {

					settings.stereo.eyeSep = optionsDefault.eyeSep;
					_controllerEyeSep.setValue( settings.stereo.eyeSep );

					if ( settings.camera ) {

						settings.camera.focus = optionsDefault.focus;
						_controllerCameraFocus.setValue( settings.camera.focus );

					}

					settings.zeroParallax = optionsDefault.zeroParallax;
					_controllerZeroParallax.setValue( settings.zeroParallax );

				},

			}, 'defaultF' );
			dat.controllerNameAndTitle( _controllerDefaultF, _lang.defaultButton, _lang.defaultTitle );

			displayControllers( settings.spatialMultiplex );

			var saveToCookie = true;
			/**
			 * sets an object into cookie.
			 * @param {string} name cookie name.
			 */
			function setObject( name ) {

				if ( !saveToCookie )
					return;
				const object = {};
				Object.keys( optionsDefault ).forEach( function ( key ) {

					object[key] = settings[key];

				} );
				options.dat.cookie.setObject( name, object );

			};

		};

		var _canvasMenu, menuItemStereoEffect;
		/**
		 * Adds a StereoEffect's menu item into [CanvasMenu]{@link https://github.com/anhr/commonNodeJS/tree/master/canvasMenu}.
		 * @param {CanvasMenu} [canvasMenu] [CanvasMenu]{@link https://github.com/anhr/commonNodeJS/tree/master/canvasMenu}.
		 * @param {Object} [params] the following params are available.
		 * @param {Function} [params.getLanguageCode=language code of your browser] Your custom getLanguageCode() function.
		 * <pre>
		   * returns the "primary language" subtag of the language version of the browser.
		 * Examples: "en" - English language, "ru" Russian.
		 * See the {@link https://tools.ietf.org/html/rfc4646#section-2.1|Syntax} paragraph of RFC 4646 for details.
		 * </pre>
		   * @param {Object} [guiParams.lang] Object with localized language values.
		 */
		this.createCanvasMenuItem = function ( canvasMenu, params ) {

			_canvasMenu = canvasMenu;
			params = params || {};
			const _lang = getLang( { getLanguageCode: params.getLanguageCode, lang: params.lang } ),
				spatialMultiplexs = Object.keys( _lang.spatialMultiplexs );
			menuItemStereoEffect = {

				name: '⚭',
				title: _lang.stereoEffects,
				id: 'menuButtonStereoEffects',
				drop: 'up',
				items: [

					{
						name: spatialMultiplexs[spatialMultiplexsIndexs.Mono],//'Mono',
						id: 'menuButtonStereoEffectsMono',
						radio: true,
						checked: settings.spatialMultiplex === spatialMultiplexsIndexs.Mono,
						spatialMultiplex: spatialMultiplexsIndexs.Mono,
						onclick: function ( event ) {

							settings.spatialMultiplex = spatialMultiplexsIndexs.Mono;

						}
					},
					{
						name: spatialMultiplexs[spatialMultiplexsIndexs.SbS],//'Side by side',
						id: 'menuButtonStereoEffectsSbS',
						radio: true,
						checked: settings.spatialMultiplex === spatialMultiplexsIndexs.SbS,
						spatialMultiplex: spatialMultiplexsIndexs.SbS,
						onclick: function ( event ) {

							settings.spatialMultiplex = spatialMultiplexsIndexs.SbS;

						}
					},
					{
						name: spatialMultiplexs[spatialMultiplexsIndexs.TaB],//'Top and bottom',
						id: 'menuButtonStereoEffectsTaB',
						radio: true,
						checked: settings.spatialMultiplex === spatialMultiplexsIndexs.TaB,
						spatialMultiplex: spatialMultiplexsIndexs.TaB,
						onclick: function ( event ) {

							settings.spatialMultiplex = spatialMultiplexsIndexs.TaB;

						}
					},

				],

			}
			menuItemStereoEffect.select = function ( value ) {

				menuItemStereoEffect.items.forEach( function ( item ) {

					if ( item.spatialMultiplex === value ) {

						if ( !item.checked )
							item.elName.onclick( { target: item.elName } );

					}

				} );

			}
			this.setSpatialMultiplex = function ( index ) {

				menuItemStereoEffect.select( index );

			}
			canvasMenu.menu.push( menuItemStereoEffect );

		}

	}

};
/**
 * Enumeration of available stereo modes. Available as <b>StereoEffect.spatialMultiplexsIndexs</b>.
 * @see {@link https://en.wikipedia.org/wiki/DVB_3D-TV|DVB 3D-TV} for details
 * @readonly
 * @enum {number}
 */
StereoEffect.spatialMultiplexsIndexs = {
	/** No stereo effect */
	Mono: 0,
	/** {@link https://en.wikipedia.org/wiki/DVB_3D-TV#Side_by_side|Side by side} */
	SbS: 1, //
	/** {@link https://en.wikipedia.org/wiki/DVB_3D-TV#Top_and_bottom|Top and bottom} */
	TaB: 2, //
}
Object.freeze( StereoEffect.spatialMultiplexsIndexs );
const spatialMultiplexsIndexs = StereoEffect.spatialMultiplexsIndexs;

/* * @namespace
 * @description Assigh setStereoEffect to [THREE.Raycaster]{@link https://threejs.org/docs/index.html#api/en/core/Raycaster}
 */
function assign() {

	const THREE = three.THREE;
	if ( new THREE.Raycaster().setStereoEffect )
		return;
		
	//Modifying of THREE.Raycaster for StereoEffect
	Object.assign( THREE.Raycaster.prototype, {

		/**
		 * @namespace
		 * @description Sets the <b>StereoEffect</b> settings to the {@link https://threejs.org/docs/#api/en/core/Raycaster|THREE.Raycaster}.
		 * Available as <b>THREE.Raycaster.setStereoEffect(...)</b>.
		 * @param {Object} [settings]
		 * @param {Options} [settings.options] See <a href="../../jsdoc/Options/Options.html" target="_blank">Options</a>.
		 * @param {THREE.PerspectiveCamera} settings.camera {@link https://threejs.org/docs/index.html#api/en/cameras/PerspectiveCamera|PerspectiveCamera}
		 * @param {THREE.Scene} [settings.scene] [Scene]{@link https://threejs.org/docs/index.html?q=Scene#api/en/scenes/Scene}
		 * @param {StereoEffect} [settings.stereoEffect=no stereo effects] stereoEffect.
		 * @param {THREE.WebGLRenderer} [settings.renderer=renderer parameter of THREE.StereoEffect] renderer. The {@link https://threejs.org/docs/#api/en/renderers/WebGLRenderer|WebGL renderer} displays your beautifully crafted scenes using WebGL.
		 * @param {boolean} [settings.raycasterEvents=true] true - add raycaster events: mousemove and pointerdown.
		 */
		setStereoEffect: function ( settings ) {

			settings = settings || {};
			settings.raycasterEvents = settings.raycasterEvents === undefined ? true : settings.raycasterEvents;
			const camera = settings.camera, renderer = settings.renderer;

			if ( settings.raycasterEvents ){

				const mouse = new THREE.Vector2();
				window.addEventListener( 'mousemove', function ( event ) {

					// calculate mouse position in normalized device coordinates
					// (-1 to +1) for both components

					mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
					mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

					// update the picking ray with the camera and mouse position
					raycaster.setFromCamera( mouse, camera );

					raycaster.stereo.onDocumentMouseMove( event );

				}, false );
				window.addEventListener( 'pointerdown', function ( event ) {

					raycaster.stereo.onDocumentMouseDown( event );

				}, false );

			}

			const stereoEffect = settings.stereoEffect !== undefined ? settings.stereoEffect : typeof effect !== 'undefined' ? effect :
				new StereoEffect( renderer, settings.options ),
				raycaster = this,
				mouseL = new THREE.Vector2(),
				mouseR = new THREE.Vector2();
			var particles, //The object or array of objects to check for intersection with the ray. See THREE.Raycaster.intersectObject https://threejs.org/docs/index.html#api/en/core/Raycaster.intersectObject for details.
//				intersects, //An array of intersections is returned by THREE.Raycaster.intersectObject or THREE.Raycaster.intersectObjects.
				mouse; //Attention!!! Do not assign new THREE.Vector2() here
			//for prevention of invalid detection of intersection with zero point ( THREE.Vector3( 0, 0, 0 ) )
			//after opening of the web page and before user has moved mouse.

			function getMousePosition() {

				stereoEffect.getRendererSize().getMousePosition( mouse, event );

				function mousePosition( vectorName, b ) {

					mouseL.copy( mouse );
					mouseR.copy( mouse );
					const a = 0.5;

					mouseL[vectorName] += a;
					mouseL[vectorName] *= 2;

					mouseR[vectorName] -= a;
					mouseR[vectorName] *= 2;

					//zeroParallax
					const size = new THREE.Vector2();
					renderer.getSize( size );
					const zeroParallax = ( stereoEffect.settings.zeroParallax / size.x ) * b;
					mouseL.x -= zeroParallax;
					mouseR.x += zeroParallax;

				}
				switch ( parseInt( stereoEffect.settings.spatialMultiplex ) ) {

					case spatialMultiplexsIndexs.Mono:
						return;
					case spatialMultiplexsIndexs.SbS:
						mousePosition( 'x', 4 );
						break;
					case spatialMultiplexsIndexs.TaB:
						mousePosition( 'y', 2 );
						break;
					default: console.error( 'THREE.Raycaster.setStereoEffect.getMousePosition: Invalid effect.settings.spatialMultiplex = ' + effect.settings.spatialMultiplex );
						return;

				}

			}
			function intersection( optionsIntersection ) {

				if ( mouse === undefined )
					return;//User has not moved mouse

				optionsIntersection = optionsIntersection || settings;
				function isIntersection() {

//					intersects = Options.raycaster.intersectionsInOut( particles, raycaster, renderer, mouse, settings );
					Options.raycaster.intersectionsInOut( particles, raycaster, renderer, mouse, settings );

				}
				if ( parseInt( stereoEffect.settings.spatialMultiplex ) !== spatialMultiplexsIndexs.Mono ) {

					const mouseCur = mouse;
					mouse = mouseL;
					raycaster.setFromCamera( mouseL, camera );
					if ( !isIntersection() ) {

						mouse = mouseR;
						raycaster.setFromCamera( mouseR, camera );
						isIntersection();

					}
					mouse = mouseCur;
					return;

				}
				raycaster.setFromCamera( mouse, camera );
				isIntersection();

			}

			/**
			 * @namespace
			 * @description
			 * <pre>
			 * [Raycaster]{@link https://threejs.org/docs/index.html#api/en/core/Raycaster} helper.
			 * Available as <b>raycaster.stereo</b>.
			 * <b>raycaster</b> is [Raycaster]{@link https://threejs.org/docs/index.html#api/en/core/Raycaster} instance.
			 * </pre>
			 * */
			this.stereo = {

				/**
				 * [mousemove]{@link https://developer.mozilla.org/en-US/docs/Web/API/Element/mousemove_event} event.
				 * User is moving of mouse over canvas.
				 * @param {object} event
				 */
				onDocumentMouseMove: function ( event ) {

					if ( particles === undefined )
						return;//The object or array of objects to check for intersection with the ray is not defined. See THREE.Raycaster.intersectObject https://threejs.org/docs/index.html#api/en/core/Raycaster.intersectObject for details.
					event.preventDefault();
					if ( mouse === undefined )
						mouse = new THREE.Vector2();
					getMousePosition();
					intersection();

				},
				/**
				 * <pre>
				 * Available as <b>raycaster.stereo.isAddedToParticles( particle )</b>.
				 * <b>raycaster</b> is [Raycaster]{@link https://threejs.org/docs/index.html#api/en/core/Raycaster} instance.
				 * </pre>
				 * @param {THREE.Mesh} particle The [Mech]{@link https://threejs.org/docs/index.html#api/en/objects/Mesh} or derived class instance for check is added to <b>particles</b>.
				 * @returns true if <b>particle</b> is added to <b>particles</b>.
				 */
				isAddedToParticles: function ( particle ) {

					if ( !particles )
						return false;
					return particles.includes( particle );

				},
				/**
				 * <pre>
				 * Adds new particle into array of objects to check for intersection with the ray.
				 * Available as <b>raycaster.stereo.addParticle( particle )</b>.
				 * <b>raycaster</b> is [Raycaster]{@link https://threejs.org/docs/index.html#api/en/core/Raycaster} instance.
				 * </pre>
				 * @see <b>objects</b> parameter of the [Raycaster.intersectObjects]{@link https://threejs.org/docs/index.html#api/en/core/Raycaster.intersectObjects} for details.
				 * @param {THREE.Mesh} particle The [Mech]{@link https://threejs.org/docs/index.html#api/en/objects/Mesh} or derived class instance for check for intersection with the ray.
				 */
				addParticle: function ( particle ) {

					if ( particles === undefined )
						particles = [];
					if ( this.isAddedToParticles( particle ) ) {

						console.error( 'Duplicate particle "' + particle.name + '"' );
						return;

					}
					particles.push( particle );

				},
				/**
				 * <pre>
				 * New array of objects to check for intersection with the ray.
				 * Available as <b>raycaster.stereo.addParticles( particles )</b>.
				 * <b>raycaster</b> is [Raycaster]{@link https://threejs.org/docs/index.html#api/en/core/Raycaster} instance.
				 * </pre>
				 * @see <b>objects</b> parameter of the [Raycaster.intersectObjects]{@link https://threejs.org/docs/index.html#api/en/core/Raycaster.intersectObjects} for details.
				 * @param {array} newParticles New array of objects to check for intersection with the ray.
				 */
				addParticles: function ( newParticles ) {

					if ( particles !== undefined ) {

						if ( !Array.isArray( particles ) ) {

							var particlesCur = particles;
							particles = [];
							particles.push( particlesCur );

						}
						particles.push( newParticles );
						return;

					}
					particles = newParticles;

				},
				/**
				 * <pre>
				 * Remove particle from array of objects to check for intersection with the ray.
				 * Available as <b>raycaster.stereo.removeParticle( particle )</b>.
				 * <b>raycaster</b> is [Raycaster]{@link https://threejs.org/docs/index.html#api/en/core/Raycaster} instance.
				 * </pre>
				 * @see <b>objects</b> parameter of the [Raycaster.intersectObjects]{@link https://threejs.org/docs/index.html#api/en/core/Raycaster.intersectObjects} for details.
				 * @param {THREE.Mesh} particle The [Mech]{@link https://threejs.org/docs/index.html#api/en/objects/Mesh} or derived class instance for removing from array of objects for check for intersection with the ray.
				 */
				removeParticle: function ( particle ) {

					for ( var i = 0; i < particles.length; i++ ) {

						if ( Object.is( particle, particles[i] ) ) {

							particles.splice( i, 1 );
							break;

						}

					}

				},
				/**
				 * <pre>
				 * remove array of objects to check for intersection with the ray.
				 * Available as <b>raycaster.stereo.removeParticles()</b>.
				 * <b>raycaster</b> is [Raycaster]{@link https://threejs.org/docs/index.html#api/en/core/Raycaster} instance.
				 * </pre>
				 * @see <b>objects</b> parameter of the [Raycaster.intersectObjects]{@link https://threejs.org/docs/index.html#api/en/core/Raycaster.intersectObjects} for details.
				 */
				removeParticles: function () { particles = undefined; },
				/**
				 * <pre>
				 * get position of intersected object
				 * Available as <b>raycaster.stereo.getPosition( intersection )</b>.
				 * <b>raycaster</b> is [Raycaster]{@link https://threejs.org/docs/index.html#api/en/core/Raycaster} instance.
				 * </pre>
				 * @param {object} intersection first item of array of intersections.
				 * @See [Raycaster.intersectObject]{@link https://threejs.org/docs/index.html#api/en/core/Raycaster.intersectObject} for details
				 */
				getPosition: function ( intersection ) {

					const attributesPosition = intersection.object.geometry.attributes.position;

					//Если опредедить как const, то при выполнении npm run build появится ошибка
					//(babel plugin) SyntaxError: D:/My documents/MyProjects/webgl/three.js/GitHub/commonNodeJS/master/StereoEffect/StereoEffect.js: "position" is read-only
					var position = attributesPosition.itemSize >= 4 ? new THREE.Vector4( 0, 0, 0, 0 ) : new THREE.Vector3();

					if ( intersection.index !== undefined ) {

						position.fromArray( attributesPosition.array, intersection.index * attributesPosition.itemSize );

						position.multiply( intersection.object.scale );

						position.add( intersection.object.position );

					} else position = intersection.object.position;
					return position;

				}

			};

		}

	} );

}
StereoEffect.assign = assign;

//Localization

import { getLanguageCode } from '../lang.js';
//import { getLanguageCode } from 'https://raw.githack.com/anhr/commonNodeJS/master/lang.js';

const lang = {

	mesh: 'Mesh',
	pointName: 'Point Name',
	color: 'Сolor',
	opacity: 'Opacity',

};

switch ( getLanguageCode() ) {

	case 'ru'://Russian language
		lang.mesh = '3D объект';
		lang.pointName = 'Имя точки';
		lang.color = 'Цвет';
		lang.opacity = 'Непрозрачность';
		break;

}

import { SpriteText } from '../SpriteText/SpriteText.js';
//import { SpriteText } from 'https://raw.githack.com/anhr/commonNodeJS/master/SpriteText/SpriteText.js';

import { getObjectPosition } from '../getPosition.js';

/** @namespace
 * @description Creates the <a href="../../SpriteText/jsdoc" target="_blank">SpriteText</a> instance with information about point, intersected with mouse cursor.
 * @param {THREE.Raycaster.intersectObject} intersection See [intersection]{@link https://threejs.org/docs/index.html#api/en/core/Raycaster.intersectObject} for details.
 * @param {object} options The following options are available
 * @param {object} [options.scales] axes scales.
 * See <b>options.scales</b> parameter of the <a href="../../AxesHelper/jsdoc/module-AxesHelper-AxesHelper.html" target="_blank">AxesHelper</a> class for details.
 * @param {object} options.spriteOptions Options of the <b>SpriteText</b>.
 * See [SpriteText]{@link https://raw.githack.com/anhr/commonNodeJS/master/SpriteText/jsdoc/module-SpriteText..html} for details.
 * @returns <b>new SpriteText</b> with information about point, intersected with mouse cursor.
 */
StereoEffect.getTextIntersection = function ( intersection, options ) {

	const spriteText = Options.findSpriteTextIntersection( options.spriteOptions.group );
	if ( spriteText )
		return spriteText;
		
	const THREE = three.THREE;
	const position = getObjectPosition( intersection.object, intersection.index ),
		scales = options.scales || {},
		isArrayFuncs = (
			( intersection.index !== undefined ) &&
			( intersection.object.userData.player !== undefined ) &&
			( intersection.object.userData.player.arrayFuncs !== undefined ) 
		),
		funcs = !isArrayFuncs ? undefined : intersection.object.userData.player.arrayFuncs,
		func = ( funcs === undefined ) || ( typeof funcs === "function" ) ? undefined : funcs[intersection.index],
		pointName = isArrayFuncs && func ? func.name : undefined,
		color = !isArrayFuncs || ( func === undefined ) ?
			undefined :
			Array.isArray( func.w ) ?
				Player.execFunc( func, 'w', group.userData.t, options ) ://.a, options.b ) :
				func.w;

	const boXYZ = !scales.x &&  !scales.y &&  !scales.z;
	options.spriteOptions.name = Options.findSpriteTextIntersection.spriteTextIntersectionName;
	return new SpriteText(

		//text
		lang.mesh + ': ' + ( intersection.object.name === '' ? intersection.object.type : intersection.object.name ) +
		( pointName === undefined ? '' : '\n'+ lang.pointName + ': ' + pointName ) +
		( ( !boXYZ && !scales.x ) || ( scales.x && !scales.x.isAxis() ) ? '' :
			'\n' + ( ( scales.x && scales.x.name ) || ( scales.x.name === 0 ) ? scales.x.name : 'X' ) + ': ' + position.x ) +
		( ( !boXYZ && !scales.y ) || ( scales.y && !scales.y.isAxis() ) ? '' :
			'\n' + ( ( scales.y && scales.y.name ) || ( scales.y.name === 0 ) ? scales.y.name : 'Y' ) + ': ' + position.y ) +
		( ( !boXYZ && !scales.z ) || ( scales.z && !scales.z.isAxis() ) ? '' :
			'\n' + ( ( scales.z && scales.z.name ) || ( scales.z.name === 0 ) ? scales.z.name : 'Z' ) + ': ' + position.z ) + 
		(//w
			!isArrayFuncs ?
				'' :
				funcs[intersection.index] instanceof THREE.Vector4 ||
					funcs[intersection.index] instanceof THREE.Vector3 ||
					typeof funcs === "function" ?
					color instanceof THREE.Color ?
						'\n' + lang.color + ': ' + new THREE.Color( color.r, color.g, color.b ).getHexString() :
						position.w !== undefined ? '\n' + ( scales.w && scales.w.name ? scales.w.name : 'W' ) + ': ' + position.w : '' :
					''

		) +
		(//opacity
			( intersection.object.geometry.attributes.ca === undefined ) ||
				( intersection.object.geometry.attributes.ca.itemSize < 4 ) ?
				'' :
				'\n' + lang.opacity + ': ' + new THREE.Vector4().fromArray(

					intersection.object.geometry.attributes.ca.array,
					intersection.index * intersection.object.geometry.attributes.ca.itemSize

				).w
		),
		intersection.pointSpriteText,//position
		options.spriteOptions
	);

}

export default StereoEffect;