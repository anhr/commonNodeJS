/**
 * @module Player
 * @description 3D objects animation.
 * @author [Andrej Hristoliubov]{@link https://anhr.github.io/AboutMe/}
 * @copyright 2011 Data Arts Team, Google Creative Lab
 *
 * @license under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */

import cookie from '../../../cookieNodeJS/master/cookie.js';
//import cookie from 'https://raw.githack.com/anhr/cookieNodeJS/master/cookie.js';

import ScaleController from '../ScaleController.js';
import PositionController from '../PositionController.js';
import { dat } from '../dat/dat.module.js';

import { GuiSelectPoint, getObjectPosition } from '../guiSelectPoint/guiSelectPoint.js';
//import { GuiSelectPoint, getObjectPosition } from 'https://raw.githack.com/anhr/commonNodeJS/master/guiSelectPoint/guiSelectPoint.js';

import ColorPicker from '../../../colorpicker/master/colorpicker.js';//https://github.com/anhr/colorPicker
//import ColorPicker from 'https://raw.githack.com/anhr/colorpicker/master/colorpicker.js';
//ColorPicker.palette.setTHREE( THREE );

var settings;

/**
 * @callback onSelectScene
 * @description This function is called at each new step of the playing. See [Player]{@link https://raw.githack.com/anhr/commonNodeJS/master/player/jsdoc/module-Player.html#~Player} method.
 * @param {number} index current index of the scene of the animation
 * @param {number} t current time
 */

/**
 * @callback onChangeScaleT
 * @description User has updated the time settings. See [Player]{@link https://raw.githack.com/anhr/commonNodeJS/master/player/jsdoc/module-Player.html#~Player} method.
 * @param {object} scale the updated time settings
 */

/**
 * 3D objects animation.
 * @param {onSelectScene} onSelectScene This function is called at each new step of the playing. See [onSelectScene]{@link https://raw.githack.com/anhr/commonNodeJS/master/player/jsdoc/module-Player.html#~onSelectScene}.
 * @param {object} [options] followed options is available
 * @param {number} [options.settings] time settings.
 * @param {number} [options.settings.marks] Ticks count of the playing. Number of scenes of 3D objects animation. Default is 10
 * @param {number} [options.settings.interval] Ticks per seconds. Default is 1.
 * @param {number} [options.settings.min] Animation start time. Default is 0.
 * @param {number} [options.settings.max] Animation end time. Default is 1.
 * @param {boolean} [options.settings.repeat] true - Infinitely repeating 3D objects animation. Default is false.
 * @param {number} [options.settings.zoomMultiplier] zoom multiplier of the time. Default is 1.1.
 * @param {number} [options.settings.offset] offset of the time. Default is 0.1.
 * @param {onChangeScaleT} [options.onChangeScaleT] event. User has updated the time settings. See [onChangeScaleT]{@link https://raw.githack.com/anhr/commonNodeJS/master/player/jsdoc/module-Player.html#~onChangeScaleT}.
 * @param {object} [options.cookie] Your custom cookie function for saving and loading of the Player settings. Default cookie is not saving settings.
 */
function Player( onSelectScene, options ) {

	options = options || {};
	settings = options.settings || {};
/*	
	options.min = options.min || 0;
	options.max = options.max || 1;
	options.marks = options.marks || 2;
	options.repeat = options.repeat || false;
	options.interval = options.interval || 25;
//	options.controllers = [];
*/
	settings.min = settings.min || 0;
	settings.max = settings.max || 1;
	settings.marks = settings.marks || 10;//2;
	settings.repeat = settings.repeat || false;
	settings.interval = settings.interval || 1;//25;
	settings.zoomMultiplier = settings.zoomMultiplier || 1.1;
	settings.offset = settings.offset || 0.1;
/*
	const axesDefault = JSON.parse( JSON.stringify( settings ) );
	Object.freeze( axesDefault );

	options.cookie = options.cookie || new cookie.defaultCookie();
*/
	var selectSceneIndex = 0,//-1;
		_this = this;

	function getTime() { return ( ( settings.max - settings.min ) / ( settings.marks - 1 ) ) * selectSceneIndex + settings.min; }

	/**
	 * select scene for playing
	 * @function Player.
	 * selectScene
	 * @param {number} index Index of the scene. Range from 0 to settings.marks - 1
	 */
	this.selectScene = function( index ) {

		if ( index >= settings.marks )
			index = 0;
		else if ( index < 0 )
			index = settings.marks - 1;
		if( selectSceneIndex > settings.marks )
			selectSceneIndex = settings.marks;
		while ( selectSceneIndex !== index ) {
			if ( selectSceneIndex < index )
				selectSceneIndex++;
			else selectSceneIndex--;
			onSelectScene( selectSceneIndex, getTime() );
		}

	}

	/**
	 * Go to next object 3D
	 * @function Player.
	 * next
	 */
	this.next = function() {

		_this.selectScene( selectSceneIndex + 1 );

	}

	/**
	 * Go to previous object 3D
	 * @function Player.
	 * prev
	 */
	this.prev = function () {

		_this.selectScene( selectSceneIndex - 1 );

	}
	/**
	 * Add controller into controllers array
	 * @function Player.
	 * pushController
	 * @param {controller} controller
	 */
	this.pushController = function ( controller ) {

		if ( ( controller.object !== undefined ) && ( controller.object.playRate !== undefined ) )
			controller.object.playRate = settings.interval;
		controllers.push( controller );

	}

	//Play/Pause

	this.controllers = [];
	var playing = false, controllers = this.controllers, time, timeNext,
		cookie = options.cookie, cookieName = 'Player' + ( options.cookieName || '' );

//	options.cookie.getObject( cookieName, settings, settings );

	function RenamePlayButtons() {

		controllers.forEach( function ( controller ) {

			controller.onRenamePlayButtons( playing );

		} );

	}

	function play() {

		if ( ( selectSceneIndex === -1 ) || ( selectSceneIndex === settings.marks ) ) {

			selectSceneIndex = 0;

		}
		onSelectScene( selectSceneIndex, getTime() );

	}

	function pause() {

		playing = false;
		RenamePlayButtons();

		time = undefined;

	}
	function isRepeat() {

		return settings.repeat;

	}

	function playNext() {

		selectSceneIndex++;
		if ( selectSceneIndex >= settings.marks ) {

			if ( isRepeat() )
				selectSceneIndex = 0;
			else {

				pause();
				return;

			}

		}
		play();

	}

	/**
	 * Animation of 3D object
	 * call from function animate()
	 */
/*
	this.animate = function () {

		if ( time === undefined )
			return;
		var timeCur = new Date().getTime();
		if ( isNaN( timeNext ) )
			console.error( 'Player.animate: timeNext = ' + timeNext );
		if ( timeCur < timeNext )
			return;
		while ( timeCur > timeNext ) timeNext += 1000 / settings.interval;
		playNext();

	}
*/
	/**
	 * User has clicked the Play ► / Pause ❚❚ button
	 * @function Player.
	 * play3DObject
	 */
	this.play3DObject = function() {

		if ( playing ) {

			pause();
			return;

		}

		playing = true;
		if ( selectSceneIndex >= settings.marks )
			selectSceneIndex = -1;
		playNext();
		RenamePlayButtons();
		controllers.forEach( function ( controller ) {

			if ( controller.controller !== undefined ) {

				settings.interval = controller.controller.getValue();
				return;

			}

		} );
/*		
		time = new Date().getTime();
		timeNext = time + 1000 / settings.interval;
*/		

		function step( timestamp ) {

			if ( playing )
				window.requestAnimationFrame( step );
			else time = undefined;

			if ( time === undefined ) {

				time = timestamp;
				timeNext = time + 1000 / settings.interval;
//				return;

			}
			if ( isNaN( timeNext ) )
				console.error( 'Player.animate: timeNext = ' + timeNext );
			if ( timestamp < timeNext )
				return;
			while ( timestamp > timeNext ) timeNext += 1000 / settings.interval;
/*			
			var timeCur = new Date().getTime();
			if ( isNaN( timeNext ) )
				console.error( 'Player.animate: timeNext = ' + timeNext );
			if ( timeCur < timeNext )
				return;
			while ( timeCur > timeNext ) timeNext += 1000 / settings.interval;
*/
			playNext();

		}
		window.requestAnimationFrame( step );

	}

	/**
	 * User has clicked the repeat ⥀ button
	 * @function Player.
	 * repeat
	 */
	this.repeat = function () {

		settings.repeat = !settings.repeat;
		this.onChangeRepeat( settings.repeat );

	}

	/**
	 * @function Player.
	 * getOptions
	 * @returns Player options.
	 */
	this.getOptions = function () { return options; }
	/**
	 * @function Player.
	 * getSettings
	 * @returns Player options.settings.
	 */
	this.getSettings = function () { return options.settings; }
	/**
	 * @function Player.
	 * getSelectSceneIndex
	 * @returns selected scene index.
	 */
	this.getSelectSceneIndex = function () { return selectSceneIndex; }


	function setSettings() {

		cookie.setObject( cookieName, options.settings );
		options.onChangeScaleT( options.settings );

	}

	/**
	 * User has changed the rate of changing of animation scenes per second.
	 * @function Player.
	 * onChangeTimerId
	 * @param {number} value new rate
	 */
	this.onChangeTimerId = function ( value ) {

		settings.interval = value;
		setSettings();

	}

	/**
	 * Event of the changing of the rate of changing of animation scenes per second.
	 * @function Player.
	 * onChangeRepeat
	 * @param {number} value new rate
	 */
	this.onChangeRepeat = function ( value ) {

		settings.repeat = value;
		this.controllers.forEach( function ( controller ) {

			controller.onChangeRepeat();

		} );

	}

	/**
	 * Adds a Player's controllers into [dat.gui]{@link https://github.com/anhr/dat.gui}.
	 * @function Player.
	 * gui
	 * @param {GUI} folder Player's folder
	 * @param {Function} [getLanguageCode] Your custom getLanguageCode() function.
	 * <pre>
	 * returns the "primary language" subtag of the language version of the browser.
	 * Examples: "en" - English language, "ru" Russian.
	 * See the "Syntax" paragraph of RFC 4646 {@link https://tools.ietf.org/html/rfc4646#section-2.1|rfc4646 2.1 Syntax} for details.
	 * Default returns the 'en' is English language.
	 * You can import { getLanguageCode } from 'commonNodeJS/master/lang.js';
	 */
	this.gui = function ( folder, getLanguageCode ) {

//		settings.t = scalesT;

		//Localization

		var lang = {

			player: 'Player',
			playerTitle: '3D objects animation.',

			min: 'Min',
			max: 'Max',

			marks: 'Frames',
			marksTitle: 'Player frames count',

			defaultButton: 'Default',
			defaultTitle: 'Restore default player settings.',

		};

		var languageCode = getLanguageCode === undefined ? 'en'//Default language is English
			: getLanguageCode();
		switch ( languageCode ) {

			case 'ru'://Russian language

				lang.player = 'Проигрыватель';
				lang.playerTitle = 'Анимация 3D объектов.';

				lang.min = 'Минимум';
				lang.max = 'Максимум';

				lang.marks = 'Кадры';
				lang.marksTitle = 'Количество кадров проигрывателя';

				lang.defaultButton = 'Восстановить';
				lang.defaultTitle = 'Восстановить настройки проигрывателя по умолчанию.';

				break;
			default://Custom language
				if ( ( options.lang === undefined ) || ( options.lang.languageCode != languageCode ) )
					break;

				Object.keys( options.lang ).forEach( function ( key ) {

					if ( lang[key] === undefined )
						return;
					lang[key] = options.lang[key];

				} );

		}

		//

		var fPlayer = folder.addFolder( lang.player );
		dat.folderNameAndTitle( fPlayer, lang.player, lang.playerTitle );

		var playController = this.PlayController;

		function scale() {

			var axes = options.settings, scaleControllers = {};
			function onclick( customController, action ) {

				var zoom = customController.controller.getValue();

				axes.min = action( axes.min, zoom );
				//						axes.min *= zoom;
				scaleControllers.min.setValue( axes.min );

				axes.max = action( axes.max, zoom );
				//						axes.max *= zoom;
				scaleControllers.max.setValue( axes.max );
				setSettings();
				
			}

			scaleControllers.folder = fPlayer.addFolder( axes.name );

//			let {default: ScaleController }  = await import('../../commonNodeJS/master/ScaleController.js');
			scaleControllers.scaleController = scaleControllers.folder.add( new ScaleController( onclick, 
				{ settings: options.settings, getLanguageCode: getLanguageCode, } ) ).onChange( function ( value ) {

				axes.zoomMultiplier = value;
//				options.cookie.setObject( cookieName, options.scales );
				setSettings();

			} );

//			let {default: PositionController }  = await import('../../commonNodeJS/master/PositionController.js');
			var positionController = new PositionController( function ( shift ) {

				//			console.warn( 'shift = ' + shift );
				onclick( positionController, function ( value, zoom ) {

					value += shift;//zoom;
					return value;

				} );

			}, { settings: options.settings, getLanguageCode: getLanguageCode, } );
			scaleControllers.positionController = scaleControllers.folder.add( positionController ).onChange( function ( value ) {

//				axes.positionOffset = value;
				axes.offset = value;
//				options.cookie.setObject( cookieName, options.scales );
				setSettings();

			} );

			//min
			scaleControllers.min = dat.controllerZeroStep( scaleControllers.folder, axes, 'min', function ( value ) {

				setSettings();

			} );
			dat.controllerNameAndTitle( scaleControllers.min, lang.min );

			//max
			scaleControllers.max = dat.controllerZeroStep( scaleControllers.folder, axes, 'max', function ( value ) {

				setSettings();

			} );
			dat.controllerNameAndTitle( scaleControllers.max, lang.max );

			//marks
			if ( axes.marks !== undefined ) {

				scaleControllers.marks = dat.controllerZeroStep( scaleControllers.folder, axes, 'marks', function ( value ) {

					setSettings();

				} );
				dat.controllerNameAndTitle( scaleControllers.marks, axes.marksName === undefined ? lang.marks : axes.marksName,
					axes.marksTitle === undefined ? lang.marksTitle : axes.marksTitle );

			}

			//Default button
			dat.controllerNameAndTitle( scaleControllers.folder.add( {

				defaultF: function ( value ) {

//					playController._controller.setValue( axesDefault.interval );
					playController.setValue( axesDefault.interval );
					
					axes.zoomMultiplier = axesDefault.zoomMultiplier;
					scaleControllers.scaleController.setValue( axes.zoomMultiplier );

					axes.offset = axesDefault.offset;
					scaleControllers.positionController.setValue( axes.offset );

					axes.min = axesDefault.min;
					scaleControllers.min.setValue( axes.min );

					axes.max = axesDefault.max;
					scaleControllers.max.setValue( axes.max );

					if ( axesDefault.marks !== undefined ) {

						axes.marks = axesDefault.marks;
						scaleControllers.marks.setValue( axes.marks );

					}

					setSettings();

//					onchangeWindowRange( windowRange, axes );

				},

			}, 'defaultF' ), lang.defaultButton, lang.defaultTitle );

		}
		scale();

	}

}
/**
 * execute function
 * @function Player.
 * execFunc
 * @param {THREE.Vector4} funcs
 * @param {string} axisName axis name
 * @param {number} t time
 * @param {number} a multiplier. Second parameter of the arrayFuncs item function. Default is 1.
 * @param {number} b addendum. Third parameter of the arrayFuncs item function. Default is 0.
 */
Player.execFunc = function ( funcs, axisName, t, a, b ) {

	a = a || 1;
	b = b || 0;
	var func = funcs[axisName], typeofFuncs = typeof func;
	switch ( typeofFuncs ) {

		case "undefined":
			return undefined;
		case "function":
			return func( t, a, b );
		case "number":
			return func;
		case "object":
			if ( Array.isArray( func ) ) {

				if ( func.length === 0 ) {

					console.error( 'Player.execFunc: funcs["' + axisName + '"] array is empty' );
					return;

				}
				var a = func,
					l = func.length - 1,
					max = options.player.max,
					min = options.player.min,
					tStep = ( max - min ) / l,
					tStart = min, tStop = max,
					iStart = 0, iStop = l;
				for ( var i = 0; i < func.length; i++ ) {

					if ( tStep * i + min < t ) {

						iStart = i;
						iStop = i + 1;
						tStart = tStep * iStart + min;
						tStop = tStep * iStop + min;

					}

				}
				function execW( i ) {

					if ( typeof a[i] === "function" )
						return a[i]( t, a, b );
					if ( a[i] instanceof THREE.Color )
						return a[i];

				}
				if ( typeof a[iStart] !== "number" ) {

					if ( axisName === 'w' ) {

						return execW( iStart );

					}
					console.error( 'Player.execFunc: funcs["' + axisName + '"] array item ' + iStart + ' typeof = ' + ( typeof a[iStart] ) + ' is not number' );
					return;

				}
				if ( typeof a[iStop] !== "number" ) {

					if ( axisName === 'w' )
						return execW( iStop );
					console.error( 'Player.execFunc: funcs["' + axisName + '"] array item ' + iStop + ' typeof = ' + ( typeof a[iStop] ) + ' is not number' );
					return;

				}
				var x = ( a[iStop] - a[iStart] ) / ( tStop - tStart ),
					y = a[iStart] - x * tStart;
				return x * t + y;

			}
			if ( func.func )
				return func.func instanceof Function ? func.func( t, a, b ) : func.func;
			if ( axisName !== 'w' )
				console.error( 'Player.execFunc: funcs["' + axisName + '"] object is not array' );
			return;
		default:
			console.error( 'Player.execFunc: Invalud typeof funcs["' + axisName + '"]: ' + typeofFuncs );
	}
	return;

}

function palette() {

	var paletteDefault;
	this.get = function() {

		if ( !paletteDefault )
			paletteDefault = new ColorPicker.palette();
		return paletteDefault;

	}

}
palette = new palette();

/**
 * select a scene for playing
 * @function Player.
 * selectPlayScene
 * @param {THREE} THREE {@link https://github.com/anhr/three.js|THREE}
 * @param {THREE.Group} group [THREE.Group]{@link https://threejs.org/docs/index.html#api/en/objects/Group}
 * @param {number} t time
 * @param {number} index index of the time.
 * @param {object} [options] followed options is available
 * @param {boolean} [options.boPlayer] true - is not select play scene for mesh.userData.boFrustumPoints = true. Default is false.
 * @param {number} [options.a] multiplier. Second parameter of the arrayFuncs item function. Default is 1.
 * @param {number} [options.b] addendum. Third parameter of the arrayFuncs item function. Default is 0.
 * @param {object} [options.scales] axes scales. See {@link https://raw.githack.com/anhr/AxesHelper/master/jsdoc/module-AxesHelper.html|AxesHelper}. Default is {}
 * @param {object} [options.palette] See [ColorPicker.palette]{@link https://raw.githack.com/anhr/colorPicker/master/jsdoc/module-ColorPicker.html#~Palette}.
 * <pre>
 * Default is
 * new ColorPicker.palette();//palette: ColorPicker.paletteIndexes.BGRW 
 * Example:
 * new ColorPicker.palette( { palette: ColorPicker.paletteIndexes.bidirectional } );
 * </pre>
 * @param {object} [options.guiSelectPoint] See [GuiSelectPoint]{@link https://raw.githack.com/anhr/commonNodeJS/master/guiSelectPoint/jsdoc/module-GuiSelectPoint.html#~GuiSelectPoint}.
 * <pre>
 * Example:
 * new GuiSelectPoint();
 * </pre>
 */
Player.selectPlayScene = function ( THREE, group, t, index, options ) {

	ColorPicker.palette.setTHREE(THREE);
	
	options = options || {};

	options.boPlayer = options.boPlayer || false;

	options.a = options.a || 1;
	options.b = options.b || 0;

	options.palette = options.palette || palette.get();//paletteDefault;

	options.scales = options.scales || {};
	
	group.userData.t = t;
	group.children.forEach( function ( mesh ) {

		if (

//			( mesh.userData.selectPlayScene === undefined ) ||
			!mesh.userData.player ||
			( options.boPlayer && mesh.userData.boFrustumPoints )

		)
			return;

		//Эти строки нужны что бы появлялся текст возле точки, если на нее наведена мышка
		//при условии, что до этого точка была передвинута с помошью проигрывателя.
		delete mesh.geometry.boundingSphere;
		mesh.geometry.boundingSphere = null;

		if ( mesh.userData.player.selectPlayScene )
			mesh.userData.player.selectPlayScene( t );

		function setAttributes( a, b ) {

			var attributes = mesh.geometry.attributes,
				arrayFuncs = mesh.userData.player.arrayFuncs;
			if ( arrayFuncs === undefined )
				return;
			if ( t === undefined )
				console.error( 'setPosition: t = ' + t );

			var min, max;
			if ( options.scales.w !== undefined ) {

				min = options.scales.w.min; max = options.scales.w.max;

			} else {

				max = value;
				min = max - 1;

			}

			for ( var i = 0; i < arrayFuncs.length; i++ ) {

				var funcs = arrayFuncs[i], needsUpdate = false;
				function setPosition( axisName, fnName ) {

					var value = Player.execFunc( funcs, axisName, t, a, b );
					if ( value !== undefined ) {

						attributes.position[fnName]( i, value );
						needsUpdate = true;

					}

				}
				setPosition( 'x', 'setX' );
				setPosition( 'y', 'setY' );
				setPosition( 'z', 'setZ' );
				let color;
/*
				var boSetColorAttribute = true;
				if ( typeof funcs.w === "function" ) {

					var value = funcs.w( t, a, b );
					attributes.position.setW( i, value );
					needsUpdate = true;

//					color = palette.toColor( value, min, max );
					color = options.palette.toColor( value, min, max );

				} else if ( typeof funcs.w === "object" ) {

					if ( funcs.w instanceof THREE.Color )
						color = funcs.w;
					else color = palette.toColor( execFunc( funcs, 'w', t, a, b ), min, max );

				} else if ( ( typeof funcs.w === "number" ) && options.palette )
					color = options.palette.toColor( funcs.w, min, max );
				else {

					boSetColorAttribute = false;

				}
				if ( boSetColorAttribute )
					Player.setColorAttribute( attributes, i, color );
*/
				if ( typeof funcs.w === "function" ) {

					var value = funcs.w( t, a, b );
					attributes.position.setW( i, value );
					needsUpdate = true;

					if ( options.palette )
						color = options.palette.toColor( value, min, max );

				} else if ( typeof funcs.w === "object" ) {

					if ( funcs.w instanceof THREE.Color )
						color = funcs.w;
					else if ( options.palette ) {

						if ( typeof funcs.w === 'object' ) {

							if ( funcs.w.min ) min = funcs.w.min;
							if ( funcs.w.max ) max = funcs.w.max;
							
						}
						color = options.palette.toColor( Player.execFunc( funcs, 'w', t, a, b ), min, max );

					}

				} else if ( ( typeof funcs.w === "number" ) && options.palette )
					color = options.palette.toColor( funcs.w, min, max );
				if ( color ) {

					if ( ! mesh.material instanceof THREE.ShaderMaterial && mesh.material.vertexColors !== THREE.VertexColors )
						console.error( 'Player.selectPlayScene: Please set the vertexColors parameter of the THREE.PointsMaterial of your points to THREE.VertexColors. Example: vertexColors: THREE.VertexColors' );
					if ( ! Player.setColorAttribute( attributes, i, color ) && funcs instanceof THREE.Vector4 ) {

						//console.error( 'Player.selectPlayScene: the color attribute is not exists. Please use THREE.Vector3 instead THREE.Vector4 in the arrayFuncs or add "color" or "ca" attribute' );
						mesh.geometry.setAttribute( 'color',
							new THREE.Float32BufferAttribute( Player.getColors( THREE, arrayFuncs,
								{
									positions: mesh.geometry.attributes.position,
									scale: { min: min, max: max },
									palette: options.palette,

								} ), 3 ) );
						if ( ! Player.setColorAttribute( attributes, i, color ) )
							console.error( 'Player.selectPlayScene: the color attribute is not exists. Please use THREE.Vector3 instead THREE.Vector4 in the arrayFuncs or add "color" attribute' );

					}

				}
				if ( needsUpdate )
					attributes.position.needsUpdate = true;

				if ( funcs.line !== undefined )
					funcs.line.addPoint( getObjectPosition( mesh, i ), index, color );

			};

		}
		setAttributes( options.a, options.b );
		var message = 'Player.selectPlayScene: invalid mesh.scale.';
		if ( mesh.scale.x <= 0 ) console.error( message + 'x = ' + mesh.scale.x );
		if ( mesh.scale.y <= 0 ) console.error( message + 'y = ' + mesh.scale.y );
		if ( mesh.scale.z <= 0 ) console.error( message + 'z = ' + mesh.scale.z );

		if ( !options.guiSelectPoint )
			return;

		options.guiSelectPoint.setMesh();

		var selectedPointIndex = options.guiSelectPoint.getSelectedPointIndex();
		if ( ( selectedPointIndex !== -1 ) && options.guiSelectPoint.isSelectedMesh( mesh ) ) {

			var position = getObjectPosition( mesh, selectedPointIndex );
/*
			if ( axesHelper !== undefined )
				axesHelper.exposePosition( position );
*/
//			if ( gui !== undefined )
			options.guiSelectPoint.setPosition( position, {

				object: mesh,
				index: selectedPointIndex,

			} );

		}

	} );

}

/**
 * set color attribute 
 * @function Player.
 * setColorAttribute
 * @param {Object} attributes geometry.attributes of the mesh
 * @param {number} i index of the arrayFuncs.
 * @param {THREE.Color} color color.
 * @returns true - success
 * <p>false - colorAttribute was not detected.</p>
 */
Player.setColorAttribute = function ( attributes, i, color ) {

	if ( typeof color === "string" )
		color = new THREE.Color( color );
	var colorAttribute = attributes.color || attributes.ca;
	if ( colorAttribute === undefined )
		return false;
	colorAttribute.setX( i, color.r );
	colorAttribute.setY( i, color.g );
	colorAttribute.setZ( i, color.b );
	colorAttribute.needsUpdate = true;
	return true;

}
/*
 * @param {[THREE.Vector4|THREE.Vector3|THREE.Vector2]} arrayFuncs points.geometry.attributes.position array
 */

/**
 * Get array of THREE.Vector4 points.
 * @function Player.
 * getPoints
 * @param {THREE} THREE {@link https://github.com/anhr/three.js|THREE}
 * @param {THREE.Vector4|THREE.Vector3|THREE.Vector2|object|array} arrayFuncs points.geometry.attributes.position array
 * <pre>
 * THREE.Vector4: 4D point.
 * THREE.Vector3: 3D point. w = 1. Default is white color
 * THREE.Vector2: 2D point. w = 1, z = 0. Default is white color
 * Vector's x, y, z, w is position of the point.
 * Can be as:
 * float - position of the point.
 * [float] - array of positions of the point.
 * [Function]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function} - position of the point is function of the t.
 * Example: new Function( 't', 'a', 'b', 'return Math.sin(t*a*2*Math.PI)*0.5+b' )
 * 
 * Vector.w is index of the [palette]{@link https://github.com/anhr/colorPicker}.
 * Default range of the Vector.w is from 0 to 100. You can change range by use an object:
 * {
 *   func: Vector.w
 *   max: new max value of tne Vector.w
 *   min: new min value of tne Vector.w
 * }
 * Example:
 * {
 *
 *   func: new Function( 't', 'return 1-2*t' ),
 *   min: -1,
 *   max: 1,
 *
 * }
 * Vector.w can be as THREE.Color. Example: new THREE.Color( "rgb(255, 127, 0)" )
 *
 * object: {
 *   vector: THREE.Vector4|THREE.Vector3|THREE.Vector2 - point position
 *   [name]: point name. Default is undefined.
 *   [trace]: true - displays the trace of the point movement. Default is undefined.
 * }
 * or
 * object: {
 *   x: x axis. Defauilt is 0.
 *   y: y axis. Defauilt is 0.
 *   z: z axis. Defauilt is 0.
 *   w: w axis. Defauilt is 0.
 * }
 *
 * array: [
 *   0: x axis. Defauilt is 0.
 *   1: y axis. Defauilt is 0.
 *   2: z axis. Defauilt is 0.
 *   3: w axis. Defauilt is 0.
 * ]
 * </pre>
 * @param {object} [optionsPoints] followed optionsPoints is available
 * @param {THREE.Group} [optionsPoints.group] {@link https://threejs.org/docs/index.html#api/en/objects/Group|Group}
 * or {@link https://threejs.org/docs/index.html#api/en/scenes/Scene|Scene}.
 * Use only if you want trace lines during playing. See trace of the arrayFuncs param above.
 * Default is undefined.
 * @param {number} [optionsPoints.t] first parameter of the arrayFuncs item function. Start time of animation. Default is 0.
 * @param {object} [optionsPoints.options] followed options is available
 * @param {number} [optionsPoints.options.a] multiplier. Second parameter of the arrayFuncs item function. Default is 1.
 * @param {number} [optionsPoints.options.b] addendum. Third parameter of the arrayFuncs item function. Default is 0.
 * @param {object} [optionsPoints.options.player] See Player method above.
 * @returns array of THREE.Vector4 points.
 */
Player.getPoints = function ( THREE, arrayFuncs, optionsPoints ) {

	GuiSelectPoint.setTHREE( THREE );
	
	optionsPoints = optionsPoints || {};
	optionsPoints.t = optionsPoints.t || 0;
	const options = optionsPoints.options || {},
		a = options.a || 1,
		b = options.b || 0;
/*	
	if ( t === undefined )
		console.error( 'getPoints: t = ' + t );
*/
	for ( var i = 0; i < arrayFuncs.length; i++ ) {

		var item = arrayFuncs[i];
		if ( Array.isArray( item ) )
			arrayFuncs[i] = new THREE.Vector4(

				item[0] === undefined ? 0 : item[0],
				item[1] === undefined ? 0 : item[1],
				item[2] === undefined ? 0 : item[2],
				item[3] === undefined ? 0 : item[3]

			);
		else if (

			( typeof item === "object" )
			&& ( item instanceof THREE.Vector2 === false )
			&& ( item instanceof THREE.Vector3 === false )
			&& ( item instanceof THREE.Vector4 === false )

		) {

			if ( ( item.vector === undefined ) )
				arrayFuncs[i] = new THREE.Vector4(

					item.x === undefined ? 0 : item.x,
					item.y === undefined ? 0 : item.y,
					item.z === undefined ? 0 : item.z,
					item.w === undefined ? 0 : item.w

				);
			else if (

				( item.vector instanceof THREE.Vector2 === true )
				|| ( item.vector instanceof THREE.Vector3 === true )
				|| ( item.vector instanceof THREE.Vector4 === true )

			) {

				if ( item.vector instanceof THREE.Vector2 === true )
					arrayFuncs[i].vector = new THREE.Vector3(

						item.vector.x === undefined ? 0 : item.vector.x,
						item.vector.y === undefined ? 0 : item.vector.y,
						item.vector.z === undefined ? 0 : item.vector.z,

					);
/*
				arrayFuncs[i].vector = new THREE.Vector4(

					item.vector.x === undefined ? 0 : item.vector.x,
					item.vector.y === undefined ? 0 : item.vector.y,
					item.vector.z === undefined ? 0 : item.vector.z,
					item.vector.w === undefined ? undefined : item.vector.w

				);
*/				

			} else {

				if ( item.vector.length === 4 )
					arrayFuncs[i].vector = new THREE.Vector4(

						item.vector[0] === undefined ? 0 : item.vector[0],
						item.vector[1] === undefined ? 0 : item.vector[1],
						item.vector[2] === undefined ? 0 : item.vector[2],
						item.vector[3] === undefined ? 0 : item.vector[3]

					);
				else if ( item.vector.length === 3 )

					arrayFuncs[i].vector = new THREE.Vector3(

						item.vector[0] === undefined ? 0 : item.vector[0],
						item.vector[1] === undefined ? 0 : item.vector[1],
						item.vector[2] === undefined ? 0 : item.vector[2],

					);
				else console.error( 'options.getPoints(...) falied! item.vector.length = ' + item.vector.length );

			}

		}

	};
	var points = [];
	for ( var i = 0; i < arrayFuncs.length; i++ ) {

		var funcs = arrayFuncs[i];
		function getAxis( axisName ) {

			if ( typeof funcs === "number" )
				funcs = new THREE.Vector4( funcs, 0, 0, 0 );
			if ( ( funcs instanceof THREE.Vector2 ) || ( funcs instanceof THREE.Vector3 ) || ( funcs instanceof THREE.Vector4 ) ) {

				return Player.execFunc( funcs, axisName, optionsPoints.t, a, b );

			}
			if ( funcs.vector === undefined ) {

				console.error( 'options.getPoints: funcs.vector = ' + funcs.vector );
				return;

			}
			if ( funcs.name !== undefined )
				funcs.vector.name = funcs.name;
			if ( funcs.trace ) {

/*
				if ( options.player === undefined )
					console.warn( 'Please define the options.player for displays the trace of the point movement.' );
				else {

					funcs.vector.line = new Player.traceLine( THREE, group, options );

				}
*/				
				funcs.vector.line = new Player.traceLine( THREE, optionsPoints.group, options );

			}
			arrayFuncs[i] = funcs.vector;
			funcs = funcs.vector;
			return Player.execFunc( funcs, axisName, optionsPoints.t, a, b );


		}
		var point = funcs.vector instanceof THREE.Vector3 === true ?
			new THREE.Vector3( getAxis( 'x' ), getAxis( 'y' ), getAxis( 'z' ) ) :
			new THREE.Vector4( getAxis( 'x' ), getAxis( 'y' ), getAxis( 'z' ), getAxis( 'w' ) );

		if ( funcs.w === undefined )
			point.w = {};//Если тут поставить NaN то в points.geometry.attributes.position.array он преобразуется в 0.
		//Тогда в gui появится ненужный орган управления controllerW
		//от балды поставил пустой объект что бы при создании points.geometry.attributes.position.array
		//это зачение преобразвалось в NaN.

		points.push( point );

	}
	return points;

}
//	* @param { number } [optionsColor.t] first parameter of the arrayFuncs item function.Start time of animation.Default is 0.

/**
 * Get array of mesh colors.
 * @function Player.
 * getColors
 * @param {THREE} THREE {@link https://github.com/anhr/three.js|THREE}
 * @param {THREE.Vector4|THREE.Vector3|THREE.Vector2|object|array} arrayFuncs points.geometry.attributes.position array
 * <pre>
 * THREE.Vector4: 4D point.
 * THREE.Vector3: 3D point. w = 1. Default is white color
 * THREE.Vector2: 2D point. w = 1, z = 0. Default is white color
 * Vector's x, y, z, w is position of the point.
 * Can be as:
 * float - position of the point.
 * [float] - array of positions of the point.
 * [Function]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function} - position of the point is function of the t.
 * Example: new Function( 't', 'a', 'b', 'return Math.sin(t*a*2*Math.PI)*0.5+b' )
 *
 * Vector.w is index of the [palette]{@link https://github.com/anhr/colorPicker}.
 * Default range of the Vector.w is from 0 to 100. You can change range by use an object:
 * {
 *   func: Vector.w
 *   max: new max value of tne Vector.w
 *   min: new min value of tne Vector.w
 * }
 * Example:
 * {
 *
 *   func: new Function( 't', 'return 1-2*t' ),
 *   min: -1,
 *   max: 1,
 *
 * }
 * Vector.w can be as THREE.Color. Example: new THREE.Color( "rgb(255, 127, 0)" )
 *
 * object: {
 *   vector: THREE.Vector4|THREE.Vector3|THREE.Vector2 - point position
 *   [name]: point name. Default is undefined.
 *   [trace]: true - displays the trace of the point movement. Default is undefined.
 * }
 * or
 * object: {
 *   x: x axis. Defauilt is 0.
 *   y: y axis. Defauilt is 0.
 *   z: z axis. Defauilt is 0.
 *   w: w axis. Defauilt is 0.
 * }
 *
 * array: [
 *   0: x axis. Defauilt is 0.
 *   1: y axis. Defauilt is 0.
 *   2: z axis. Defauilt is 0.
 *   3: w axis. Defauilt is 0.
 * ]
 * </pre>
 * @param {object} [optionsColor] followed options is available:
 * @param {object} [optionsColor.palette] [color palette]{@link https://github.com/anhr/colorPicker}.
 * @param {object} [optionsColor.scale]
 * @param {object} [optionsColor.scale.min] Minimal range of the [color palette]{@link https://github.com/anhr/colorPicker}.
 * <p>Default is undefined. Minimal palette range is 0.</p>
 * @param {object} [optionsColor.scale.max] Maximal range of the [color palette]{@link https://github.com/anhr/colorPicker}.
 * <p>Default is undefined. Maximal palette range is 100</p>
 * @param {THREE.BufferAttribute} [optionsColor.positions] geometry.attributes.position of the new mesh. Default is undefined.
 * @param {array} [optionsColor.colors] array for mesh colors. Default is undefined.
 * @param {boolean} [optionsColor.opacity] if true then opacity of the point is depend from distance to all  meshes points from the group with defined mesh.userData.cloud. Default is undefined.
 * @returns array of mesh colors.
 */
Player.getColors = function ( THREE, arrayFuncs, optionsColor ) {
/*
	if ( t === undefined )
		console.error( 'getColors: t = ' + t );
*/
	ColorPicker.palette.setTHREE(THREE);
	optionsColor = optionsColor || {};
	optionsColor.palette = optionsColor.palette || palette.get();//paletteDefault;
	
	if (
		( optionsColor.positions !== undefined ) &&
		Array.isArray( arrayFuncs ) &&
		( arrayFuncs.length !== optionsColor.positions.count )
	) {

		console.error( 'getColors failed! arrayFuncs.length: ' + arrayFuncs.length + ' != positions.count: ' + optionsColor.positions.count );
		return optionsColor.colors;

	}
	optionsColor.colors = optionsColor.colors || [];
	var length = Array.isArray( arrayFuncs ) ? arrayFuncs.length : optionsColor.positions.count;

	for( var i = 0; i < length; i++ ) {

		var funcs = Array.isArray(arrayFuncs) ? arrayFuncs[i] : undefined,
			vector;
		if (
			( funcs instanceof THREE.Vector4 ) ||//w of the funcs is color of the point
			( optionsColor.positions.itemSize === 4 )//w position of the positions is color of the point
			) {

			var min, max, w = funcs.w;
			if ( optionsColor.scale !== undefined ) {

				min = optionsColor.scale.min; max = optionsColor.scale.max;

			} else {

				if ( funcs.w instanceof Object ) {

					if ( funcs.w.max ) max = funcs.w.max;
					if ( funcs.w.min ) min = funcs.w.min;
					w = funcs.w.func;
					
				} else {

					max = funcs instanceof THREE.Vector4 ? funcs.w : 1;
					min = max - 1;

				}

			}
/*
			var color = optionsColor.palette.toColor(
				funcs === undefined ?
					new THREE.Vector4().fromBufferAttribute( optionsColor.positions, i ).w :
					funcs.w instanceof Function ?
						funcs.w( settings.min ) :
						funcs.w,
//						funcs.w instanceof Object ? funcs.w.func : funcs.w,
				min, max );
*/
			if ( w instanceof Function && ! settings ) {

				console.error( 'Player.getColors: create Player first or remove all functions from all THREE.Vector4.w items of the arrayFuncs' );
				return;
				
			}
			var color = optionsColor.palette.toColor(
				funcs === undefined ?
					new THREE.Vector4().fromBufferAttribute( optionsColor.positions, i ).w :
					w instanceof Function ?
						w( settings.min ) :
						w,
				min, max );
			optionsColor.colors.push( color.r, color.g, color.b );

		} else if ( optionsColor.colors instanceof THREE.Float32BufferAttribute )
			vector = new THREE.Vector3( 1, 1, 1 );
		else optionsColor.colors.push( 1, 1, 1 );//white

		//opacity
		if ( optionsColor.opacity !== undefined ) {

			var opacity = 0,
				standardNormalDistributionZero = getStandardNormalDistribution( 0 );
			group.children.forEach( function ( mesh ) {

				if ( !mesh.userData.cloud )
					return;
				for ( var iMesh = 0; iMesh < mesh.geometry.attributes.position.count; iMesh++ ) {

					var position = getObjectPosition( mesh, iMesh );
					opacity += getStandardNormalDistribution(
						getWorldPosition(//myThreejs.getWorldPosition(
							camera, new THREE.Vector3().fromBufferAttribute( optionsColor.positions, i )
						).distanceTo( position ) * 5
					) / standardNormalDistributionZero;

				}

			} );

			if ( debug.opacity !== undefined )
				opacity = debug.opacity;

			if ( optionsColor.colors instanceof THREE.Float32BufferAttribute ) {

				optionsColor.colors.setXYZW( i, vector.x, vector.y, vector.z, opacity );

			}
			else optionsColor.colors.push( opacity );

		} else optionsColor.colors.push( 1 );

	}
	return optionsColor.colors;

}

/**
 * trace line of moving of the point during playing
 * @function Player.
 * traceLine
 * @param {THREE} THREE {@link https://github.com/anhr/three.js|THREE}
 * @param {THREE.Group} group {@link https://threejs.org/docs/index.html#api/en/objects/Group|Group} or {@link https://threejs.org/docs/index.html#api/en/scenes/Scene|Scene}.
 * @param {object} options followed options is available
 * @param {object} options.player See Player function above.
 */
Player.traceLine = function ( THREE, group, options ) {

	if ( !group ) {

		console.error( 'Player.traceLine: Define optionsPoints.group of the Player.getPoints first.' );
		return;
		
	}
/*
	if ( !settings ) {

		console.error( 'Player.traceLine: call Player(...) first.' );
		return;
		
	}
*/
	//Thanks to https://stackoverflow.com/questions/31399856/drawing-a-line-with-three-js-dynamically/31411794#31411794
//	var MAX_POINTS = options.player.marks,
	var MAX_POINTS,// = settings.marks,
		line;//, drawCount = 0;
	if ( settings && settings.marks )
		MAX_POINTS = settings.marks;
	else if ( options.player && options.player.marks )
		MAX_POINTS = options.player.marks;
	else {

		console.error( 'Player.traceLine: MAX_POINTS = ' + MAX_POINTS + '. Create Player first or remove all trace = true from all items of the arrayFuncs' );
		return;

	}
	this.addPoint = function ( point, index, color ) {

		if ( line === undefined ) {


			// geometry
			var geometry = new THREE.BufferGeometry();

			// attributes
			var positions = new Float32Array( MAX_POINTS * 3 ); // 3 vertices per point
			geometry.setAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
			var colors = new Float32Array( MAX_POINTS * 3 ); // 3 vertices per point
			geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );

			// draw range
			geometry.setDrawRange( index, index );

			line = new THREE.Line( geometry, new THREE.LineBasicMaterial( { vertexColors: THREE.VertexColors } ) );
			line.visible = true;
			group.add( line );

		}

		//point position
		point = new THREE.Vector3().copy( point );
		point.toArray( line.geometry.attributes.position.array, index * line.geometry.attributes.position.itemSize );
		line.geometry.attributes.position.needsUpdate = true;

		//point color
		if ( color === undefined )
			color = new THREE.Color( 1, 1, 1 );//White
		Player.setColorAttribute( line.geometry.attributes, index, color );

		//set draw range
		var start = line.geometry.drawRange.start, count = index + 1 - start;
		if ( start > index ) {

			var stop = start + line.geometry.drawRange.count;
			start = index;
			count = stop - start;

		}
		line.geometry.setDrawRange( start, count );

	}
	/**
	 * Show or hide trace line.
	 * @function Player.traceLine.
	 * visible
	 * @param {boolean} visible true - show trace line.
	 * <p>false - hide trace line.</p>
	 */
	this.visible = function ( visible ) { line.visible = visible; }
	/**
	 * Is trace line visible?
	 * @function Player.traceLine.
	 * isVisible
	 * @returns true - trace line is visible.
	 * <p>false - trace line is not visible.</p>
	 */
	this.isVisible = function () { return line.visible; }
	/**
	 * Remove trace line.
	 * @function Player.traceLine.
	 * remove
	 */
	this.remove = function () {

		if ( line === undefined )
			return;
		line.geometry.dispose();
		line.material.dispose();
		group.remove( line );

	}

}

export default Player;
