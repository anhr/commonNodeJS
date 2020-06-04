/**
 * AxesHelper graphical user interface
 * @see {@link three.js\src\helpers\AxesHelper.js} about AxesHelper
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

import PositionController from './PositionController.js';
import ScaleController from './ScaleController.js';

//https://threejs.org/docs/#manual/en/introduction/Import-via-modules
//import { SpriteTextGui, AxesHelperOptions } from '../../three.js/dev/build/three.module.js';//'http://localhost/threejs/three.js/build/three.module.js';
//import { SpriteTextGui } from '../../nodejs/three.js';
import { SpriteTextGui } from '../../myThreejs/master/three.js';

/**
 * @callback cookie
 * @param {string} name name of the cookie is 'axes'
 */

/**
 * AxesHelper graphical user interface
 * @see {@link three.js\src\helpers\AxesHelper.js} about AxesHelper
 * @param {GUI} gui instance of the dat.GUI
 * @param {object} [guiSelectPoint] gui select point conrtollers. See function guiSelectPoint() for details
 * @param {object} [guiParams] gui options
 * @param {boolean} [guiParams.remember] true - remember in cocies of current user settings. Default is false.
 * @param {AxesHelper} [guiParams.axesHelper] instance of the AxesHelper. Deafault is undefuned.
 * @param {object} [guiParams.options] Use only if guiParams.axesHelper is undefined.
 * @param {cookie} [guiParams.cookie] Your custom cookie function for saving and loading of the AxesHelper settings. Default cookie is not saving settings.
 */
var AxesHelperGui = function ( gui, guiSelectPoint, guiParams ) {

//	var cookieName = AxesHelperOptions.cookieName;//'AxesHelper';

	guiParams = guiParams || {};
	guiParams.remember = guiParams.remember || false;

	var options = guiParams.axesHelper === undefined ? guiParams.options : guiParams.axesHelper.options || {};
	if ( guiParams.cookie !== undefined )
		options.cookie = guiParams.cookie;

	//scales

	var optionsDefault;
	if ( guiParams.axesHelper !== undefined )
		optionsDefault = guiParams.axesHelper.optionsDefault;
	else {

		var scalesOptions = AxesHelperOptions.getScalesOptions( options );//, AxesHelperOptions.cookieName );
		optionsDefault = scalesOptions.optionsDefault;

	}

	//Localization

	var lang = {

		axesHelper: 'Axes Helper',

		scales: 'Scales',

		displayScales: 'Display',
		displayScalesTitle: 'Display or hide axes scales.',

		min: 'Min',
		max: 'Max',

		marks: 'Marks',
		marksTitle: 'Number of scale marks',

		defaultButton: 'Default',
		defaultTitle: 'Restore default Axes Helper settings.',

		//Zoom
		zoom: 'Zoom',
		in: 'in',
		out: 'out',
		wheelZoom: 'Scroll the mouse wheel to zoom',

		precision: 'Precision',
		precisionTitle: 'Formats a number to a specified length.',

	};

	var languageCode = guiParams.getLanguageCode === undefined ? 'en'//Default language is English
		: guiParams.getLanguageCode();
	switch ( languageCode ) {

		case 'ru'://Russian language

			lang.axesHelper = 'Оси координат'; //'Axes Helper'

			lang.scales = 'Шкалы';//'Scales',

			lang.displayScales = 'Показать';
			lang.displayScalesTitle = 'Показать или скрыть шкалы осей координат.';

			lang.min = 'Минимум';
			lang.max = 'Максимум';

			lang.marks = 'Риски';
			lang.marksTitle = 'Количество отметок на шкале';

			lang.defaultButton = 'Восстановить';
			lang.defaultTitle = 'Восстановить настройки осей координат по умолчанию.';

			//Zoom
			lang.zoom = 'Масштаб';
			lang.in = 'увеличить';
			lang.out = 'уменьшить';
			lang.wheelZoom = 'Прокрутите колесико мыши для изменения масштаба';

			lang.precision = 'Точность';
			lang.precisionTitle = 'Ограничить количество цифр в числе.';

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

	if ( guiParams.remember )
		gui.remember( options );

	//AxesHelper folder
	var fAxesHelper = gui.addFolder( lang.axesHelper );

	//scales folder
	var fScales;

	//display scales
	function displayControllers( value ) {

		var display = value ? 'block' : 'none';
		if ( fSpriteText !== undefined )
			fSpriteText.domElement.style.display = display;
		controllerPrecision.domElement.parentElement.parentElement.style.display = display;
/*шкалы осей показывать даже если нет осей координат
		options.scalesControllers.x.folder.domElement.style.display = display;
		options.scalesControllers.y.folder.domElement.style.display = display;
		options.scalesControllers.z.folder.domElement.style.display = display;
*/

	}

	var controllerDisplayScales;
	if ( guiParams.axesHelper !== undefined ) {

		fScales = fAxesHelper.addFolder( lang.scales );
		controllerDisplayScales = fScales.add( options.scales, 'display' ).onChange( function ( value ) {

			if ( guiParams.axesHelper !== undefined )
				guiParams.axesHelper.displayScales( value );
			displayControllers( value );
//			options.cookie.setObject( cookieName, options.scales );
			guiParams.axesHelper.setSettings();

		} );
		dat.controllerNameAndTitle( controllerDisplayScales, lang.displayScales, lang.displayScalesTitle );
	}

	function onchangeWindowRange( windowRange, scale ) {

		if ( options.scene !== undefined ) {

			var scene = options.scene, scales = options.scales;

			scene.scale.x = 2 / Math.abs( scales.x.min - scales.x.max );
			scene.scale.y = 2 / Math.abs( scales.y.min - scales.y.max );
			scene.scale.z = 2 / Math.abs( scales.z.min - scales.z.max );

			scene.position.x = - ( scales.x.min + scales.x.max ) / 2;
			scene.position.y = - ( scales.y.min + scales.y.max ) / 2;
			scene.position.z = - ( scales.z.min + scales.z.max ) / 2;
			scene.position.multiply( scene.scale );

		}
		if ( guiParams.axesHelper !== undefined)
			guiParams.axesHelper.onchangeWindowRange();
		if ( windowRange !== undefined )
			windowRange( scale );
		guiSelectPoint.windowRange( options );

	}
	fAxesHelper.add( new ScaleController(
		function ( customController, action ) {

			function zoom( zoom, action ) {

				var axesHelper = guiParams.axesHelper;

				function axesZoom( axes, scaleControllers, windowRange ) {

					axes.min = action( axes.min, zoom );
					scaleControllers.min.setValue( axes.min );

					axes.max = action( axes.max, zoom );
					scaleControllers.max.setValue( axes.max );
					onchangeWindowRange( windowRange, axes );

				}

				axesZoom( options.scales.x, options.scalesControllers.x, axesHelper === undefined ? undefined : axesHelper.windowRangeX );
				axesZoom( options.scales.y, options.scalesControllers.y, axesHelper === undefined ? undefined : axesHelper.windowRangeY );
				axesZoom( options.scales.z, options.scalesControllers.z, axesHelper === undefined ? undefined : axesHelper.windowRangeZ );

				if ( axesHelper !== undefined )
					axesHelper.updateDotLines();

			}
			zoom( customController.controller.getValue(), action );

		}, {

			settings: { zoomMultiplier: 1.1, },
			getLanguageCode: guiParams.getLanguageCode,

		} ) ).onChange( function ( value ) {

			console.warn( 'ScaleController.onChange' );

		} );

	function scale( axes, windowRange, scaleControllers, axesDefault ) {

		Object.freeze( axesDefault );

		function onclick( customController, action ) {

			var zoom = customController.controller.getValue();

			axes.min = action( axes.min, zoom );
			scaleControllers.min.setValue( axes.min );

			axes.max = action( axes.max, zoom );
			scaleControllers.max.setValue( axes.max );

			onchangeWindowRange( windowRange, axes );

			if ( guiParams.axesHelper !== undefined )
				guiParams.axesHelper.updateDotLines();

		}

		scaleControllers.folder = fAxesHelper.addFolder( axes.name );

		scaleControllers.scaleController = scaleControllers.folder.add( new ScaleController( onclick,
			{ settings: axes, getLanguageCode: guiParams.getLanguageCode, } ) ).onChange( function ( value ) {

			axes.zoomMultiplier = value;
//			options.cookie.setObject( cookieName, options.scales );
			guiParams.axesHelper.setSettings();

		} );

		var positionController = new PositionController( function ( shift ) {

			onclick( positionController, function ( value, zoom ) {

				value += shift;//zoom;
				return value;

			} );

		}, { settings: axes, getLanguageCode: guiParams.getLanguageCode, } );
		scaleControllers.positionController = scaleControllers.folder.add( positionController ).onChange( function ( value ) {

			axes.offset = value;
//			options.cookie.setObject( cookieName, options.scales );
			guiParams.axesHelper.setSettings();

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

				windowRange();

			} );
			dat.controllerNameAndTitle( scaleControllers.marks, axes.marksName === undefined ? lang.marks : axes.marksName,
				axes.marksTitle === undefined ? lang.marksTitle : axes.marksTitle );

		}

		//Default button
		dat.controllerNameAndTitle( scaleControllers.folder.add( {

			defaultF: function ( value ) {

				axes.min = axesDefault.min;
				scaleControllers.min.setValue( axes.min );

				axes.max = axesDefault.max;
				scaleControllers.max.setValue( axes.max );
				/*Думаю неудобно когда zoomMultiplier и offset устанавливаются в значение по умолчанию когда
				 * пользватель решил восстановить предельные значаеия по одной из осей
				axes.zoomMultiplier = axesDefault.zoomMultiplier;
				scaleControllers.scaleController.setValue( axes.zoomMultiplier );

				axes.offset = axesDefault.offset;
				scaleControllers.positionController.setValue( axes.offset );
				*/

				if ( axesDefault.marks !== undefined ) {

					axes.marks = axesDefault.marks;
					scaleControllers.marks.setValue( axes.marks );

				}

				onchangeWindowRange( windowRange, axes );

				if ( guiParams.axesHelper !== undefined )
					guiParams.axesHelper.updateDotLines();

			},

		}, 'defaultF' ), lang.defaultButton, lang.defaultTitle );

	}
	options.scalesControllers = { x: {}, y: {}, z: {}, w: {} };//, t: {}, };
	function windowRange() {

		options.cookie.setObject( cookieName, options.scales );

	}
	scale( options.scales.x,
		guiParams.axesHelper === undefined ? windowRange : guiParams.axesHelper.windowRangeX,
		options.scalesControllers.x, optionsDefault.scales.x );
	scale( options.scales.y,
		guiParams.axesHelper === undefined ? windowRange : guiParams.axesHelper.windowRangeY,
		options.scalesControllers.y, optionsDefault.scales.y );
	scale( options.scales.z,
		guiParams.axesHelper === undefined ? windowRange : guiParams.axesHelper.windowRangeZ,
		options.scalesControllers.z, optionsDefault.scales.z );
	if ( options.scales.w !== undefined ) {
		scale( options.scales.w, windowRange, options.scalesControllers.w, optionsDefault.scales.w );
	}

	var controllerPrecision;

	//default button
	var defaultParams = {

		defaultF: function ( value ) {

			if ( typeof controllerNegativeAxes !== 'undefined' ) {

				controllerNegativeAxes.setValue( optionsDefault.negativeAxes );

			}
			if ( controllerDisplayScales !== undefined )
				controllerDisplayScales.setValue( optionsDefault.scales.display );
			controllerPrecision.setValue( optionsDefault.scales.precision );
			function restore( scaleControllers, scale, windowRange ) {

				scaleControllers.min.setValue( scale.min );
				scaleControllers.max.setValue( scale.max );
				scaleControllers.marks.setValue( scale.marks );
				scaleControllers.scaleController.setValue( scale.zoomMultiplier );
				scaleControllers.positionController.setValue( scale.offset );
				onchangeWindowRange( windowRange, scale);

			}
			var axesHelper = guiParams.axesHelper;
			restore( options.scalesControllers.x, optionsDefault.scales.x, axesHelper === undefined ? undefined : axesHelper.windowRangeX );
			restore( options.scalesControllers.y, optionsDefault.scales.y, axesHelper === undefined ? undefined : axesHelper.windowRangeY );
			restore( options.scalesControllers.z, optionsDefault.scales.z, axesHelper === undefined ? undefined : axesHelper.windowRangeZ );
//			restore( options.scalesControllers.t, optionsDefault.scales.t, axesHelper === undefined ? undefined : axesHelper.windowRangeT );
		},

	};

	if ( guiParams.axesHelper !== undefined ) {

		controllerPrecision = fScales.add( options.scales, 'precision', 2, 17, 1 ).onChange( function ( value ) {

			guiParams.axesHelper.arraySpriteText.forEach( function ( sprite ) {

				if ( sprite.options.textDefault === undefined )
					return;
				sprite.options.text = parseFloat( sprite.options.textDefault.toPrecision( value ) );
				sprite.update( sprite.options );

			} );
			//			options.cookie.setObject( cookieName, options.scales );
			guiParams.axesHelper.setSettings();

		} )
		dat.controllerNameAndTitle( controllerPrecision, lang.precision, lang.precisionTitle );

		var fSpriteText = SpriteTextGui( gui, guiParams.axesHelper.arraySpriteText,
			{

				parentFolder: fScales,
				getLanguageCode: function () {

					return languageCode;

				},

			} );

		displayControllers( options.scales.display );

	}

	dat.controllerNameAndTitle( fAxesHelper.add( defaultParams, 'defaultF' ), lang.defaultButton, lang.defaultTitle );

}
export default AxesHelperGui;