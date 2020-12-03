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

//import * as THREE from '../../three.js/dev/build/three.module.js';
//import { THREE } from './three.js';
//import * as THREE from 'https://threejs.org/build/three.module.js';
var THREE;

import PositionController from '../PositionController.js';
//import PositionController from 'https://raw.githack.com/anhr/commonNodeJS/master/PositionController.js';

import cookie from '../cookieNodeJS/cookie.js';
//import cookie from 'https://raw.githack.com/anhr/commonNodeJS/master/cookieNodeJS/cookie.js';

import { dat } from '../dat/dat.module.js';
//import { dat } from 'https://raw.githack.com/anhr/commonNodeJS/master/dat/dat.module.js';

import CreateFullScreenSettings from '../createFullScreenSettings.js';

//Attenttion!!! Save this file as UTF-8 for localization.

/**
 * StereoEffect
 * Uses dual PerspectiveCameras for Parallax Barrier https://en.wikipedia.org/wiki/Parallax_barrier effects
 * @param {THREE} _THREE {@link https://github.com/anhr/three.js|THREE}
 * @param {THREE.WebGLRenderer} renderer {@link https://threejs.org/docs/#api/en/renderers/WebGLRenderer|WebGL renderer}
 * @param {Object} [options] the following options are available.
 * @param {Object} [options.spatialMultiplex=spatialMultiplexsIndexs.Mono] spatial multiplex
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
 * 	Example - spatialMultiplex: spatialMultiplexsIndexs.Mono
 * </pre>
 * @param {THREE.PerspectiveCamera} [options.camera] Use the camera key if you want control cameras focus.
 * @param {Object} [options.far=10] Camera frustum far plane. The far key uses for correct calculation default values of Eye separation.
 * @param {Object} [options.stereoAspect=1] THREE.StereoCamera.aspect. Camera frustum aspect ratio.
 * @param {boolean} [options.rememberSize] true - remember default size of the canvas. Resize of the canvas to full screen for stereo mode and restore to default size if no stereo effacts.
 * @param {HTMLElement} [options.elParent] parent of the canvas.
 * Use only if you use {@link https://threejs.org/docs/index.html#api/en/core/Raycaster|THREE.Raycaster} (working out what objects in the 3d space the mouse is over)
 * and your canvas is not full screen.
 */
function StereoEffect( _THREE, renderer, options ) {

	if( !renderer ) {

		console.error( 'StereoEffect: renderer = ' + renderer );
		return;
		
	}
	setTHREE( _THREE );
	const _this = this;

	options = options || {};
	this.options = options;

	//Убрал spatialMultiplex: options.spatialMultiplex !== undefined ? options.spatialMultiplex : spatialMultiplexsIndexs.Mono,//SbS,
	//из const optionsDefault
	//Потому что будет ошибка 
	//THREE.StereoEffect.render: Invalid "Spatial  multiplex" parameter: NaN
	//если в приложении не используется StereoEffect.gui
	//и не определен options.spatialMultiplex
	if ( options.spatialMultiplex === undefined ) options.spatialMultiplex = spatialMultiplexsIndexs.Mono;//SbS

	options.stereo = new THREE.StereoCamera();
	options.stereo.aspect = options.stereoAspect || 1;//0.5;
	if ( options.far === undefined )
		options.far = new THREE.PerspectiveCamera().focus;
	options.focus = options.camera === undefined ? new THREE.PerspectiveCamera().focus :
		new THREE.Vector3().distanceTo( options.camera.position );
	options.zeroParallax = 0;
	options.eyeSep = options.eyeSep || ( new THREE.StereoCamera().eyeSep / 10 ) * options.far;
	if ( options.camera !== undefined )
		options.camera.focus = options.focus;

	this.setEyeSeparation = function ( eyeSep ) {

		options.stereo.eyeSep = eyeSep;

	};

	this.setEyeSeparation( options.eyeSep );

	this.getRendererSize = function () {

		const el = options.elParent || renderer.domElement,
			style = {

				position: el.style.position,
				left: el.style.left,
				top: el.style.top,
				width: el.style.width,
				height: el.style.height,

			},
			rect = el.getBoundingClientRect(),
			left = Math.round( rect.left ),
			top = Math.round( rect.top ),
			size = new THREE.Vector2();
		renderer.getSize( size );
		return {

			getMousePosition: function ( mouse, event ) {

				mouse.x = ( event.clientX / size.x ) * 2 - 1 - ( left / size.x ) * 2;
				mouse.y = - ( event.clientY / size.y ) * 2 + 1 + ( top / size.y ) * 2;

			},

		};

	};
	var fullScreenSettings;
	var spatialMultiplexCur;
	this.render = function ( scene, camera ) {

		const spatialMultiplex = parseInt( options.spatialMultiplex );

		if ( options.rememberSize && !fullScreenSettings ) { 

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
		const parallax = options.zeroParallax;
		function setFullScreen( fullScreen, stereoEffect ){

			if ( !fullScreenSettings || ( spatialMultiplexCur === spatialMultiplex ) )
				return;
			fullScreenSettings.setFullScreen( fullScreen );
			spatialMultiplexCur = spatialMultiplex;
			if ( stereoEffect.setControllerSpatialMultiplex ) stereoEffect.setControllerSpatialMultiplex( spatialMultiplex );
			else if ( stereoEffect.setSpatialMultiplex ) stereoEffect.setSpatialMultiplex( spatialMultiplex );

		}

		switch ( spatialMultiplex ) {

			case spatialMultiplexsIndexs.Mono://Mono

				renderer.setScissor( 0, 0, size.width, size.height );
				renderer.setViewport( 0, 0, size.width, size.height );
				renderer.render( scene, camera );
				renderer.setScissorTest( false );

				setFullScreen( true, this );

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

		options.stereo.update( camera );

		renderer.setScissor( xL, yL, widthL, heightL );
		renderer.setViewport( xL, yL, widthL, heightL );
		renderer.render( scene, options.stereo.cameraL );

		renderer.setScissor( xR, yR, widthR, heightR );
		renderer.setViewport( xR, yR, widthR, heightR );
		renderer.render( scene, options.stereo.cameraR );

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
	 * @function this.
	 * gui
	 * @see {@link https://github.com/anhr/dat.gui|dat.gui}.
	 * @param {GUI} gui dat.GUI object.
	 * @param {Object} options See options of StereoEffect above for details.
	 * @param {Object} [guiParams] the following params are available.
	 * @param {Function} [guiParams.getLanguageCode] Your custom getLanguageCode() function.
	 * <pre>
 	 * returns the "primary language" subtag of the language version of the browser.
	 * Examples: "en" - English language, "ru" Russian.
	 * See the {@link https://tools.ietf.org/html/rfc4646#section-2.1|Syntax} paragraph of RFC 4646 for details.
	 * Default returns the 'en' is English language.
	 * </pre>
 	 * @param {Object} [guiParams.lang] Object with localized language values.
	 * @param {number} [guiParams.scale] scale of allowed values. Default is 1.
	 * @param {Object} [guiParams.cookie] Your custom cookie function for saving and loading of the StereoEffects settings. Default cookie is not saving settings.
	 * @param {cookie} [guiParams.cookieName] Name of the cookie is "StereoEffect" + options.cookieName. Default is undefined.
	 */
	this.gui = function ( gui, guiParams ) {

		if ( gui === undefined )
			return;
		if ( guiParams === undefined ) guiParams = {};
		guiParams.scale = guiParams.scale || 1;

		const _lang = getLang( { getLanguageCode: guiParams.getLanguageCode, lang: guiParams.lang } );

		const stereoEffect = 'StereoEffect' + ( guiParams.cookieName || '' );
		guiParams.cookie = guiParams.cookie || new cookie.defaultCookie();
		const optionsDefault = {

			//spatialMultiplex: options.spatialMultiplex !== undefined ? options.spatialMultiplex : spatialMultiplexsIndexs.Mono,//SbS,
			spatialMultiplex: options.spatialMultiplex,
			eyeSep: ( new THREE.StereoCamera().eyeSep / 10 ) * options.far,
			focus: options.focus,
			zeroParallax: 0,

		}
		Object.freeze( optionsDefault );
		guiParams.cookie.getObject( stereoEffect, options, optionsDefault );
		options.spatialMultiplex = parseInt( options.spatialMultiplex );

		if ( this.setSpatialMultiplex ) this.setSpatialMultiplex( options.spatialMultiplex );

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
		const _controllerSpatialMultiplex = _fStereoEffects.add( options, 'spatialMultiplex',
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
		this.setControllerSpatialMultiplex = function( index ) { _controllerSpatialMultiplex.setValue( index ); }

		//eyeSeparation
		//http://paulbourke.net/papers/vsmm2007/stereoscopy_workshop.pdf
		const _fEyeSeparation = _fStereoEffects.addFolder( _lang.eyeSeparationName );//Eye Separation
		dat.folderNameAndTitle( _fEyeSeparation, _lang.eyeSeparationName, _lang.eyeSeparationTitle );
		_fEyeSeparation.add( new PositionController( function ( shift ) {

			options.eyeSep += shift;
			_controllerEyeSep.setValue( options.eyeSep );

		}, { settings: { offset: 0.01 }, min: 0.0001, max: 0.01, step: 0.0001 }
		) );
		const _controllerEyeSep = dat.controllerZeroStep( _fEyeSeparation, options.stereo, 'eyeSep', function ( value ) {

			options.eyeSep = value;
			setObject( stereoEffect );

		} );
		dat.controllerNameAndTitle( _controllerEyeSep, _lang.eyeSeparationName, _lang.eyeSeparationTitle );

		//camera.focus
		options.camera.focus = options.focus;
		var _controllerCameraFocus;
		if ( options.camera ) {

			_controllerCameraFocus = _fStereoEffects.add( options.camera,
				'focus', optionsDefault.focus / 10, optionsDefault.focus * 2, optionsDefault.focus / 1000 )
				.onChange( function ( value ) {

					//					options.camera.focus = value;
					options.focus = value;
					setObject( stereoEffect );

				} );
			dat.controllerNameAndTitle( _controllerCameraFocus, _lang.focus, _lang.focusTitle );

		}

		//Zero parallax
		//http://paulbourke.net/papers/vsmm2007/stereoscopy_workshop.pdf
		const _minMax = ( 60 - ( 400 / 9 ) ) * guiParams.scale + 400 / 9;
		const _controllerZeroParallax = _fStereoEffects.add( options, 'zeroParallax', - _minMax, _minMax )
			.onChange( function ( value ) {

				options.zeroParallax = value;
				setObject( stereoEffect );

			} );
		dat.controllerNameAndTitle( _controllerZeroParallax, _lang.zeroParallaxName, _lang.zeroParallaxTitle );

		//default button
		const _controllerDefaultF = _fStereoEffects.add( {
			defaultF: function ( value ) {

				options.stereo.eyeSep = optionsDefault.eyeSep;
				_controllerEyeSep.setValue( options.stereo.eyeSep );

				if ( options.camera ) {

					options.camera.focus = optionsDefault.focus;
					_controllerCameraFocus.setValue( options.camera.focus );

					options.zeroParallax = optionsDefault.zeroParallax;
					_controllerZeroParallax.setValue( options.zeroParallax );

				}

			},

		}, 'defaultF' );
		dat.controllerNameAndTitle( _controllerDefaultF, _lang.defaultButton, _lang.defaultTitle );

		displayControllers( options.spatialMultiplex );

		/**
		 * sets an object into cookie.
		 * @param {string} name cookie name.
		 */
		function setObject( name ) {

			const object = {};
			Object.keys( optionsDefault ).forEach( function ( key ) {

				object[key] = options[key];

			} );
			guiParams.cookie.setObject( name, object );

		};

	};

	var _canvasMenu, menuItemStereoEffect;
	/**
	 * Adds a StereoEffect's menu item into [CanvasMenu]{@link https://github.com/anhr/commonNodeJS/tree/master/canvasMenu}.
	 * @function StereoEffect.
	 * createCanvasMenuItem
	 * @param {CanvasMenu} [canvasMenu] [CanvasMenu]{@link https://github.com/anhr/commonNodeJS/tree/master/canvasMenu}.
	 * @param {Object} [params] the following params are available.
	 * @param {Function} [params.getLanguageCode] Your custom getLanguageCode() function.
	 * <pre>
 	 * returns the "primary language" subtag of the language version of the browser.
	 * Examples: "en" - English language, "ru" Russian.
	 * See the {@link https://tools.ietf.org/html/rfc4646#section-2.1|Syntax} paragraph of RFC 4646 for details.
	 * Default returns the 'en' is English language.
	 * </pre>
 	 * @param {Object} [guiParams.lang] Object with localized language values.
	 */
	this.createCanvasMenuItem = function ( canvasMenu, params ) {

		_canvasMenu = canvasMenu;
		params = params || {};
		const _lang = getLang( { getLanguageCode: params.getLanguageCode, lang: params.lang } ),
			spatialMultiplexs = Object.keys(_lang.spatialMultiplexs);
		menuItemStereoEffect = {

			name: '⚭',
			title: _lang.stereoEffects,//'Stereo effects',
			id: 'menuButtonStereoEffects',
			drop: 'up',
			items: [

				{
					name: spatialMultiplexs[spatialMultiplexsIndexs.Mono],//'Mono',
					id: 'menuButtonStereoEffectsMono',
					radio: true,
					checked: options.spatialMultiplex === spatialMultiplexsIndexs.Mono,
					spatialMultiplex: spatialMultiplexsIndexs.Mono,
					onclick: function ( event ) {

						options.spatialMultiplex = spatialMultiplexsIndexs.Mono;

					}
				},
				{
					name: spatialMultiplexs[spatialMultiplexsIndexs.SbS],//'Side by side',
					id: 'menuButtonStereoEffectsSbS',
					radio: true,
					checked: options.spatialMultiplex === spatialMultiplexsIndexs.SbS,
					spatialMultiplex: spatialMultiplexsIndexs.SbS,
					onclick: function ( event ) {

						options.spatialMultiplex = spatialMultiplexsIndexs.SbS;
						//if ( canvasMenu.setFullScreen ) canvasMenu.setFullScreen( false );

					}
				},
				{
					name: spatialMultiplexs[spatialMultiplexsIndexs.TaB],//'Top and bottom',
					id: 'menuButtonStereoEffectsTaB',
					radio: true,
					checked: options.spatialMultiplex === spatialMultiplexsIndexs.TaB,
					spatialMultiplex: spatialMultiplexsIndexs.TaB,
					onclick: function ( event ) {

						options.spatialMultiplex = spatialMultiplexsIndexs.TaB;

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

};

/**
 * Enumeration of available stereo modes. Available as <b>StereoEffect.spatialMultiplexsIndexs</b>.
 * @see {@link https://en.wikipedia.org/wiki/DVB_3D-TV|DVB 3D-TV} for details
 * @readonly
 * @enum {number}
 */
const spatialMultiplexsIndexs = {
	/** No stereo effect */
	Mono: 0,
	/** {@link https://en.wikipedia.org/wiki/DVB_3D-TV#Side_by_side|Side by side} */
	SbS: 1, //
	/** {@link https://en.wikipedia.org/wiki/DVB_3D-TV#Top_and_bottom|Top and bottom} */
	TaB: 2, //
}
Object.freeze( spatialMultiplexsIndexs );
StereoEffect.spatialMultiplexsIndexs = spatialMultiplexsIndexs;

/**
 * set THREE for StereoEffect. Assigh setStereoEffect to [THREE.Raycaster]{@link https://threejs.org/docs/index.html#api/en/core/Raycaster}
 * @function StereoEffect.
 * setTHREE
 * @param {THREE} THREE {@link https://github.com/anhr/three.js|THREE}
 */
function setTHREE( _THREE ) {

	if ( THREE ) {

		if ( !Object.is( THREE, _THREE ) )
			console.error( 'setTHREE: duplicate THREE. Please use one instance of the THREE library.' )
		return;

	}
	THREE = _THREE;

	//Modifying of THREE.Raycaster for StereoEffect
	Object.assign( THREE.Raycaster.prototype, {

		/**
		 * sets StereoEffect options to the {@link https://threejs.org/docs/#api/en/core/Raycaster|THREE.Raycaster}
		 * @function THREE.Raycaster.
		 * setStereoEffect
		 * @param {Object} [options]
		 * @param {THREE.PerspectiveCamera} options.camera {@link https://threejs.org/docs/index.html#api/en/cameras/PerspectiveCamera|PerspectiveCamera}
		 * @param {StereoEffect} [options.stereoEffect=no stereo effects] stereoEffect.
		 * @param {THREE.WebGLRenderer} [options.renderer=renderer parameter of THREE.StereoEffect] renderer. The {@link https://threejs.org/docs/#api/en/renderers/WebGLRenderer|WebGL renderer} displays your beautifully crafted scenes using WebGL.
		 * @param {boolean} [options.raycasterEvents=true] true - add raycaster events: mousemove and pointerdown.
		 */
		setStereoEffect: function ( options ) {

			options = options || {};
			options.raycasterEvents = options.raycasterEvents === undefined ? true : options.raycasterEvents;
			const camera = options.camera, renderer = options.renderer;

			if ( options.raycasterEvents ){

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

			const stereoEffect = options.stereoEffect !== undefined ? options.stereoEffect : typeof effect !== 'undefined' ? effect :
				new StereoEffect( THREE, renderer, {

					spatialMultiplex: spatialMultiplexsIndexs.Mono, //.SbS,
					far: camera ? camera.far : undefined,
					camera: camera,
					stereoAspect: 1,

				} ),
				raycaster = this,
				mouseL = new THREE.Vector2(),
				mouseR = new THREE.Vector2();
			var particles, //The object or array of objects to check for intersection with the ray. See THREE.Raycaster.intersectObject https://threejs.org/docs/index.html#api/en/core/Raycaster.intersectObject for details.
				intersects, //An array of intersections is returned by THREE.Raycaster.intersectObject or THREE.Raycaster.intersectObjects.
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
					const zeroParallax = ( stereoEffect.options.zeroParallax / size.x ) * b;
					mouseL.x -= zeroParallax;
					mouseR.x += zeroParallax;

				}
				switch ( parseInt( stereoEffect.options.spatialMultiplex ) ) {

					case spatialMultiplexsIndexs.Mono:
						return;
					case spatialMultiplexsIndexs.SbS:
						mousePosition( 'x', 4 );
						break;
					case spatialMultiplexsIndexs.TaB:
						mousePosition( 'y', 2 );
						break;
					default: console.error( 'THREE.Raycaster.setStereoEffect.getMousePosition: Invalid effect.options.spatialMultiplex = ' + effect.options.spatialMultiplex );
						return;

				}

			}
			function getIntersects() {

				if ( particles === undefined )
					return;
				intersects = Array.isArray( particles ) ? raycaster.intersectObjects( particles ) : raycaster.intersectObject( particles );

			}
			var intersectedObject = undefined;
			function intersection( optionsIntersection ) {

				if ( mouse === undefined )
					return;//User has not moved mouse

				optionsIntersection = optionsIntersection || options;
				function isIntersection() {

					getIntersects();
					if ( intersectedObject && ( intersects.length === 0 ) ) {

						intersectedObject.userData.raycaster.onIntersectionOut();
						intersectedObject = undefined;

					}
					else if ( !intersectedObject ) {

						var intersection = intersects[0];
						if (
							intersection &&
							intersection.object.userData.raycaster &&
							intersection.object.userData.raycaster.onIntersection
						) {

							intersection.object.userData.raycaster.onIntersection( intersection, mouse );
							intersectedObject = intersection.object;

						}

					}
					return intersects.length > 0;

				}
				if ( parseInt( stereoEffect.options.spatialMultiplex ) !== spatialMultiplexsIndexs.Mono ) {

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

			this.stereo = {

				onDocumentMouseMove: function ( event ) {

					if ( particles === undefined )
						return;//The object or array of objects to check for intersection with the ray is not defined. See THREE.Raycaster.intersectObject https://threejs.org/docs/index.html#api/en/core/Raycaster.intersectObject for details.
					event.preventDefault();
					if ( mouse === undefined )
						mouse = new THREE.Vector2();
					getMousePosition();
					intersection();

				},
				onDocumentMouseDown: function ( event ) {

					if ( intersects && intersects.length > 0 ) {

						if ( intersects[0].object.userData.raycaster ) {

							const intersect = intersects[0];
							intersect.object.userData.raycaster.onMouseDown( intersect );

						}

					}

				},
				isAddedToParticles: function ( particle ) { return particles.includes( particle ); },
				addParticle: function ( particle ) {

					if ( particles === undefined )
						particles = [];
					if ( this.isAddedToParticles() ) {

						console.error( 'Duplicate particle "' + particle.name + '"' );
						return;

					}
					particles.push( particle );

				},
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
				removeParticle: function ( particle ) {

					for ( var i = 0; i < particles.length; i++ ) {

						if ( Object.is( particle, particles[i] ) ) {

							particles.splice( i, 1 );
							break;

						}

					}

				},
				removeParticles: function () { particles = undefined; },
				//get position of intersected object
				//intersection: fi(rst item of array of intersections. See THREE.Raycaster.intersectObject for details
				getPosition: function ( intersection/*, noscale*/ ) {

					const attributesPosition = intersection.object.geometry.attributes.position,
						position = attributesPosition.itemSize >= 4 ? new THREE.Vector4( 0, 0, 0, 0 ) : new THREE.Vector3();
					if ( intersection.index !== undefined ) {

						position.fromArray( attributesPosition.array, intersection.index * attributesPosition.itemSize );

						position.multiply( intersection.object.scale );

						position.add( intersection.object.position );

					} else position = intersection.object.position;
					return position;

				}

			};
			//		var stereo = this.stereo;

		}

	} );

}
StereoEffect.setTHREE = setTHREE;

//export { StereoEffect, spatialMultiplexsIndexs };
export default StereoEffect;