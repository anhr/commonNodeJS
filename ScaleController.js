/**
 * @module ScaleController
 * is dat.GUI graphical user interface controller for control of the scale of threejs 3D object
 * 
 * @see {@link https://threejs.org/} about threejs
 * @see {@link https://github.com/dataarts/dat.gui} about dat.GUI
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

//import { controllers } from '../../dat.gui/CustomController/build/dat.gui.module.js';
import { controllers } from './dat/dat.gui.module.js';
import { dat } from './dat/dat.module.js';
import UpDownController from './UpDownController.js';

class ScaleController extends controllers.CustomController {

	/**
	* @callback onclick
	* @param {ScaleController} customController this controller
	* @param {Function} action action( value, zoom ) function for multiply or divide value to zoom
	*/

	/**
	 * dat.GUI graphical user interface controller for control of the scale of threejs 3D object
	 * @param {onclick} onclick Called whenever user has clicked this controller.
	 * @param {object} [options] followed options is available:
	 * @param {object} [options.settings] settings.
	 * @param {number} [options.settings.zoomMultiplier] control value. Default is 1.1
	 * @param {Function} [options.getLanguageCode] returns the "primary language" subtag of the version of the browser. Default returns "en" is English
	 * @example 
//Add new ScaleController to the dat.GUI folder
folder.add( new ScaleController( function ( customController, action ) {

	var zoom = customController.controller.getValue();

	//Scale a THREE.Mesh object
	mesh.scale.x = action( mesh.scale.x, zoom );
	mesh.scale.y = action( mesh.scale.y, zoom );
	mesh.scale.z = action( mesh.scale.z, zoom );
	mesh.needsUpdate = true;

},
	{

		settings: { zoomMultiplier: 1.1, },
		getLanguageCode: getLanguageCode,

	} ) );
	 */
	constructor( onclick, options ) {

		options = options || {};
		options.settings = options.settings || {};
		options.settings.zoomMultiplier = options.settings.zoomMultiplier || 1.1;

		super( {

			multiplier: options.settings.zoomMultiplier,//1.1
			property: function ( customController ) {


				//Localization

				var lang = {

					//Zoom
					zoom: 'Zoom',
					in: 'in',
					out: 'out',
					wheelZoom: 'Scroll the mouse wheel to zoom',

				};

				var _languageCode = options.getLanguageCode === undefined ? 'en'//Default language is English
					: options.getLanguageCode();
				switch ( _languageCode ) {

					case 'ru'://Russian language

						//Zoom
						lang.zoom = 'Изменить';
						lang.in = 'увеличить';
						lang.out = 'уменьшить';
						lang.wheelZoom = 'Прокрутите колесико мыши для изменения масштаба';

						break;
					default://Custom language
						if ( ( options.lang === undefined ) || ( options.lang.languageCode != _languageCode ) )
							break;

						Object.keys( options.lang ).forEach( function ( key ) {

							if ( lang[key] === undefined )
								return;
							lang[key] = options.lang[key];

						} );

				}

				//

				var buttons = {},
					addButton = UpDownController.addButton;
				buttons.zoomLabel = addButton( lang.zoom, {

					title: lang.wheelZoom,//Scroll the mouse wheel to zoom
					onwheel: function ( delta ) {

						onclick( customController, function ( value, zoom ) {

							if ( delta > 0 )
								value *= zoom;
							else value /= zoom;
							return value;

						} );

					}

				} );
				buttons.in = addButton( '↑', {

					title: lang.in,
					onclick: function () {

						onclick( customController, function ( value, zoom ) {

							value *= zoom;
							return value;

						} );

					}

				} );
				buttons.out = addButton( '↓', {

					title: lang.out,
					onclick: function () {

						onclick( customController, function ( value, zoom ) {

							value /= zoom;
							return value;

						} );

					}

				} );
				return buttons;

			},

		}, 'multiplier', 1.1, 10, 0.1 );
		if ( this.property === undefined )
			console.error( 'init() returns ' + this.property );

	}

}
export default ScaleController;

/**
 * dat.GUI graphical user interface controllers for manipulate or multiplication of the object's property
 * @param {GUI} folder folder for new controllers
 * @param {Object} object The object to be manipulated
 * @param {String} property The name of the property to be manipulated
 * @param {function( value )} onChange Callback function that take the new  property of the object
 * @param {Object} [options] followed options is available
 * @param {object} [options.settings] settings.
 * @param {number} [options.settings.zoomMultiplier] control value. Default is 1.1
 * @param {Function} [options.getLanguageCode] returns the "primary language" subtag of the version of the browser. Default returns "en" is English
 * @param {String} [options.text] object's property name. Default is property name.
 * @param {String} [options.textTitle] object's property title. Default is not title,
 */
function ScaleControllers( folder, object, property, onChange, options ) {

	options = options || {};
	var scaleController = folder.add( new ScaleController( function ( customController, action ) {

		var value = action( controller.getValue(), scaleController.getValue() );
		controller.setValue( value );
		onChange( value );

	},
		{

			getLanguageCode: options.getLanguageCode,
			settings: options.settings,

		} ) ).onChange( function ( value ) { scaleController.zoomMultiplier = value; } );
	var controller = dat.controllerZeroStep( folder, object, property, function ( value ) { onChange( value ); } );
	if ( options.text )
		dat.controllerNameAndTitle( controller, options.text, options.textTitle );

}
export { ScaleControllers };
