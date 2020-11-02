/**
 * @module AxesHelperGui
 * @description Adds AxesHelper settings folder into {@link https://github.com/anhr/dat.gui|dat.gui}.
 * @see {@link https://github.com/anhr/AxesHelper|AxesHelper}
 *
 * @author {@link https://anhr.github.io/AboutMe/|Andrej Hristoliubov}
 *
 * @copyright 2011 Data Arts Team, Google Creative Lab
 *
 * @license under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
*/

import ScaleController from '../../commonNodeJS/master/ScaleController.js';//https://github.com/anhr/commonNodeJS
//import ScaleController from 'https://raw.githack.com/anhr/commonNodeJS/master/ScaleController.js';

import PositionController from '../../commonNodeJS/master/PositionController.js';//https://github.com/anhr/commonNodeJS
//import PositionController from 'https://raw.githack.com/anhr/commonNodeJS/master/PositionController.js';

import Cookie from '../../commonNodeJS/master/cookieNodeJS/cookie.js';//https://github.com/anhr/commonNodeJS/tree/master/cookieNodeJS
//import Cookie from 'https://raw.githack.com/anhr/cookieNodeJS/master/cookie.js';
//import Cookie from 'https://raw.githack.com/anhr/commonNodeJS/master/cookieNodeJS/cookie.js';

import { SpriteText } from '../../SpriteText/master/SpriteText.js';//https://github.com/anhr/SpriteText
//import { SpriteText } from 'https://raw.githack.com/anhr/SpriteText/master/SpriteText.js';

import { SpriteTextGui } from '../../SpriteText/master/SpriteTextGui.js';//https://github.com/anhr/SpriteText
//import { SpriteTextGui } from 'https://raw.githack.com/anhr/SpriteText/master/SpriteTextGui.js';

import { dat } from '../../commonNodeJS/master/dat/dat.module.js';//https://github.com/anhr/commonNodeJS
//import { dat } from 'https://raw.githack.com/anhr/commonNodeJS/master/dat/dat.module.js';

//import clearThree from '../../commonNodeJS/master/clearThree.js';//https://github.com/anhr/commonNodeJS
//import clearThree from 'https://raw.githack.com/anhr/commonNodeJS/master/clearThree.js';


/**
 * Adds AxesHelper settings folder into {@link https://github.com/anhr/dat.gui|dat.gui}.
 * @param {AxesHelper} axesHelper is [new AxesHelper(...)]{@link https://raw.githack.com/anhr/AxesHelper/master/jsdoc/module-AxesHelper.html}.
 * An axis object to visualize axes.
 * @param {GUI} gui is [new dat.GUI(...)]{@link https://github.com/anhr/dat.gui}.
 * @param {object} [guiParams] Followed parameters is allowed. Default is no parameters.
 * @param {Function} [guiParams.getLanguageCode] Your custom getLanguageCode() function.
 * <pre>
 * returns the "primary language" subtag of the language version of the browser.
 * Examples: "en" - English language, "ru" Russian.
 * See the "Syntax" paragraph of RFC 4646 {@link https://tools.ietf.org/html/rfc4646#section-2.1|rfc4646 2.1 Syntax} for details.
 * Default returns the 'en' is English language.
 * You can import { getLanguageCode } from '../../commonNodeJS/master/lang.js';
 * </pre>
 * @param {object} [guiParams.lang] Object with localized language values
 * @param {string} [guiParams.axesHelperFolder=lang.axesHelper] AxesHelper folder name.
 * @param {cookie} [guiParams.cookie] Your custom cookie function for saving and loading of the AxesHelper settings.
 * <pre>
 * See [cookieNodeJS]{@link https://github.com/anhr/commonNodeJS/tree/master/cookieNodeJS}.
 * Default cookie is not saving settings.
 * </pre>
 * @param {string} [guiParams.cookieName] Name of the cookie is "AxesHelper" + guiParams.cookieName.
 * @example
AxesHelperGui( axesHelper, gui, {

	cookie: cookie,
	cookieName: 'mySettings',

	//Localize of the scales folder to Azerbaijani language
	getLanguageCode: function() { return 'az'; },
	lang: { scales: 'tərəzi', languageCode: 'az' },

} );
*/
export function AxesHelperGui( axesHelper, gui, guiParams ) {

	const THREE = axesHelper.getTHREE();
	if ( !THREE ) {

		console.error( 'AxesHelperGui: THREE = ' + THREE );
		return;

	}
	SpriteText.setTHREE( THREE );

	const options = axesHelper.options,
		optionsDefault = JSON.parse( JSON.stringify( options ) ),
		groupAxesHelper = axesHelper.getGroup();
	Object.freeze( optionsDefault );

	guiParams = guiParams || {};

	//Localization

	const lang = {

		axesHelper: 'Axes Helper',

		scales: 'Scales',

		displayScales: 'Display',
		displayScalesTitle: 'Display or hide axes scales.',

		precision: 'Precision',
		precisionTitle: 'Formats a number to a specified length.',

		min: 'Min',
		max: 'Max',
			
		marks: 'Marks',
		marksTitle: 'Number of scale marks',

		axesIntersection: 'Axes Intersection',

		defaultButton: 'Default',
		defaultTitle: 'Restore default Axes Helper settings.',
		defaultAxesIntersectionTitle: 'Restore default axes intersection.',

	};

	const languageCode = guiParams.getLanguageCode === undefined ? 'en'//Default language is English
		: guiParams.getLanguageCode();
	switch ( languageCode ) {

		case 'ru'://Russian language

			lang.axesHelper = 'Оси координат';

			lang.scales = 'Шкалы';

			lang.displayScales = 'Показать';
			lang.displayScalesTitle = 'Показать или скрыть шкалы осей координат.';

			lang.precision = 'Точность';
			lang.precisionTitle = 'Ограничить количество цифр в числе.';

			lang.min = 'Минимум';
			lang.max = 'Максимум';
				
			lang.marks = 'Риски';
			lang.marksTitle = 'Количество отметок на шкале';

			lang.axesIntersection = 'Начало координат',

			lang.defaultButton = 'Восстановить';
			lang.defaultTitle = 'Восстановить настройки осей координат по умолчанию.';
			lang.defaultAxesIntersectionTitle = 'Восстановить начало координат по умолчанию.';

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

	guiParams.axesHelperFolder = guiParams.axesHelperFolder || lang.axesHelper;
	const cookieName = guiParams.cookieName || guiParams.axesHelperFolder,
		cookie = guiParams.cookie || new Cookie.defaultCookie();
	cookie.getObject( cookieName, options, options );

	function setSettings() { cookie.setObject( cookieName, options ); }

	//AxesHelper folder
	const fAxesHelper = gui.addFolder( lang.axesHelper );

	//scales folder
	const fScales = fAxesHelper.addFolder( lang.scales );

	//display scales

	const controllerDisplayScales = fScales.add( options.scales, 'display' ).onChange( function ( value ) {

		groupAxesHelper.children.forEach( function ( group ) {

			group.children.forEach( function ( group ) {

				group.visible = value;

			} );

		} );
		displayControllers();
		setSettings();
			

	} );
	dat.controllerNameAndTitle( controllerDisplayScales, lang.displayScales, lang.displayScalesTitle );

	var controllerPrecision;
	if ( options.scales.text.precision !== undefined ) {

		controllerPrecision = fScales.add( options.scales.text, 'precision', 2, 17, 1 ).onChange( function ( value ) {

			function updateSpriteTextGroup( group ) {

				group.children.forEach( function ( spriteItem ) {

					if ( spriteItem instanceof THREE.Sprite ) {

						if ( spriteItem.userData.updatePrecision !== undefined )
							spriteItem.userData.updatePrecision();

					} else if ( ( spriteItem instanceof THREE.Group ) || ( spriteItem instanceof THREE.Line ) )
						updateSpriteTextGroup( spriteItem );

				} );

			}
			updateSpriteTextGroup( groupAxesHelper );
			setSettings();

		} )
		dat.controllerNameAndTitle( controllerPrecision, lang.precision, lang.precisionTitle );

	}

	const fSpriteText = typeof SpriteTextGui === "undefined" ? undefined : SpriteTextGui( SpriteText, gui, groupAxesHelper, {

		getLanguageCode: guiParams.getLanguageCode,
		cookie: cookie,
		cookieName: 'SpriteText_' + cookieName,
		parentFolder: fScales,

	} );

	//Axes intersection folder

	const fAxesIntersection = fAxesHelper.addFolder( lang.axesIntersection ),
		axesIntersectionControllers = { x: {}, y: {}, z: {} };//, w: {} };//, t: {}, };
	function axesIntersection( axisName ) {

		const scale = options.scales[axisName];
		if ( scale === undefined )
			return;

		const scaleControllers = axesIntersectionControllers[axisName];

		scaleControllers.controller = fAxesIntersection.add( {

			value: options.posAxesIntersection[axisName],

		}, 'value',
			scale.min,
			scale.max,
			( scale.max - scale.min ) / 100 ).
			onChange( function ( value ) {

				options.posAxesIntersection[axisName] = value;
/*				
				if ( axisName !== 'x' ) scalesControllers.x.updateAxis();
				if ( axisName !== 'y' ) scalesControllers.y.updateAxis();
				if ( axisName !== 'z' ) scalesControllers.z.updateAxis();
*/				
				axesHelper.updateAxes();
				setSettings();

			} );
		dat.controllerNameAndTitle( scaleControllers.controller, scale.name );

	}
	axesIntersection( 'x' );
	axesIntersection( 'y' );
	axesIntersection( 'z' );
	//default button Axes intersection 
	var defaultParams = {

		defaultF: function ( value ) {

			axesIntersectionControllers.x.controller.setValue( optionsDefault.posAxesIntersection.x );
			axesIntersectionControllers.y.controller.setValue( optionsDefault.posAxesIntersection.y );
			axesIntersectionControllers.z.controller.setValue( optionsDefault.posAxesIntersection.z );
/*			
			options.posAxesIntersection = JSON.parse( JSON.stringify( optionsDefault.posAxesIntersection ) ),
			scalesControllers.x.updateAxis();
			scalesControllers.y.updateAxis();
			scalesControllers.z.updateAxis();
			setSettings();
*/			

		},

	};
	dat.controllerNameAndTitle( fAxesIntersection.add( defaultParams, 'defaultF' ), lang.defaultButton, lang.defaultAxesIntersectionTitle );

	fAxesHelper.add( new ScaleController(
		function ( customController, action ) {

			function zoom( zoom, action ) {

				function axesZoom( axes, scaleControllers ) {

					if ( axes === undefined )
						return;//not 3D axesHelper

					axes.min = action( axes.min, zoom );
					scaleControllers.min.setValue( axes.min );

					axes.max = action( axes.max, zoom );
					scaleControllers.max.setValue( axes.max );
					scaleControllers.onchangeWindowRange();

				}

				axesZoom( options.scales.x, scalesControllers.x );
				axesZoom( options.scales.y, scalesControllers.y );
				axesZoom( options.scales.z, scalesControllers.z );

			}
			zoom( customController.controller.getValue(), action );

		}, {

		settings: { zoomMultiplier: 1.1, },
		getLanguageCode: guiParams.getLanguageCode,

	} ) ).onChange( function ( value ) {

		console.warn( 'ScaleController.onChange' );

	} );

	function scale( axisName ) {

		const axes = options.scales[axisName];
		if ( axes === undefined )
			return;

		const scaleControllers = scalesControllers[axisName],
			axesDefault = optionsDefault.scales[axisName];

		Object.freeze( axesDefault );

		function updateAxis() {

			groupAxesHelper.children.forEach( function ( group ) {

				if ( group.userData.axisName !== axisName )
					return;
				groupAxesHelper.remove( group );
				axesHelper.createAxis( axisName );

			} );

		}
		scaleControllers.updateAxis = updateAxis;

		function onchangeWindowRange() {

			updateAxis();
			setSettings();

		}
		scaleControllers.onchangeWindowRange = onchangeWindowRange;
		
		function onclick( customController, action ) {

			var zoom = customController.controller.getValue();

			axes.min = action( axes.min, zoom );
			scaleControllers.min.setValue( axes.min );

			axes.max = action( axes.max, zoom );
			scaleControllers.max.setValue( axes.max );

			onchangeWindowRange( windowRange, axes );

		}

		scaleControllers.folder = fAxesHelper.addFolder( axes.name );

		scaleControllers.scaleController = scaleControllers.folder.add( new ScaleController( onclick,
			{ settings: axes, getLanguageCode: guiParams.getLanguageCode, } ) ).onChange( function ( value ) {

				axes.zoomMultiplier = value;
				setSettings();

			} );

		var positionController = new PositionController( function ( shift ) {

			onclick( positionController, function ( value, zoom ) {

				value += shift;
				return value;

			} );

		}, { settings: axes, getLanguageCode: guiParams.getLanguageCode, } );
		scaleControllers.positionController = scaleControllers.folder.add( positionController ).onChange( function ( value ) {

			axes.offset = value;
			setSettings();

		} );

		//min
		scaleControllers.min = dat.controllerZeroStep( scaleControllers.folder, axes, 'min', function ( value ) {

			onchangeWindowRange( windowRange );

		} );
		dat.controllerNameAndTitle( scaleControllers.min, lang.min );

		//max
		scaleControllers.max = dat.controllerZeroStep( scaleControllers.folder, axes, 'max', function ( value ) {

			onchangeWindowRange( windowRange );

		} );
		dat.controllerNameAndTitle( scaleControllers.max, lang.max );

		//marks
		if ( axes.marks !== undefined ) {//w axis do not have marks

			scaleControllers.marks = dat.controllerZeroStep( scaleControllers.folder, axes, 'marks', function ( value ) {

				onchangeWindowRange( windowRange );

			} );
			dat.controllerNameAndTitle( scaleControllers.marks, axes.marksName === undefined ? lang.marks : axes.marksName,
				axes.marksTitle === undefined ? lang.marksTitle : axes.marksTitle );

		}

		//Default button
		scaleControllers.defaultButton = scaleControllers.folder.add( {

			defaultF: function ( value ) {

				axes.min = axesDefault.min;
				scaleControllers.min.setValue( axes.min );

				axes.max = axesDefault.max;
				scaleControllers.max.setValue( axes.max );

				axes.zoomMultiplier = axesDefault.zoomMultiplier;
				scaleControllers.scaleController.setValue( axes.zoomMultiplier );

				axes.offset = axesDefault.offset;
				scaleControllers.positionController.setValue( axes.offset );

				if ( axesDefault.marks !== undefined ) {

					axes.marks = axesDefault.marks;
					scaleControllers.marks.setValue( axes.marks );

				}

				onchangeWindowRange( windowRange, axes );

			},

		}, 'defaultF' );
		dat.controllerNameAndTitle(scaleControllers.defaultButton , lang.defaultButton, lang.defaultTitle );

	}
	const scalesControllers = { x: {}, y: {}, z: {} };//, w: {} };//, t: {}, };
	function windowRange() {

		setSettings();

	}
	scale('x');
	scale('y');
	scale('z');
//	scale('w');

	//default button
	var defaultParams = {

		defaultF: function ( value ) {

			controllerDisplayScales.setValue( optionsDefault.scales.display );
			if ( controllerPrecision !== undefined )
				controllerPrecision.setValue( optionsDefault.scales.text.precision );
			fSpriteText.userData.restore();
			function defaulAxis( axisName ) {

				if ( scalesControllers[axisName].defaultButton )
					scalesControllers[axisName].defaultButton.object.defaultF();

			}
			defaulAxis( 'x' );
			defaulAxis( 'y' );
			defaulAxis( 'z' );

		},

	};
	dat.controllerNameAndTitle( fAxesHelper.add( defaultParams, 'defaultF' ), lang.defaultButton, lang.defaultTitle );
		
	function displayControllers() {

		var display = options.scales.display ? 'block' : 'none';
		if ( fSpriteText !== undefined )
			fSpriteText.domElement.style.display = display;
		if ( controllerPrecision !== undefined )	
			controllerPrecision.domElement.parentElement.parentElement.style.display = display;

	}
	displayControllers();
	
	if ( scalesControllers.x.updateAxis ) scalesControllers.x.updateAxis();
	if ( scalesControllers.y.updateAxis ) scalesControllers.y.updateAxis();
	if ( scalesControllers.z.updateAxis ) scalesControllers.z.updateAxis();

}
