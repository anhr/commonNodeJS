/**
 * ScaleController is dat.GUI graphical user interface controller for control of the scale of threejs 3D object
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

import { controllers } from '../../dat.gui/build/dat.gui.module.js';
import UpDownController from './UpDownController.js';

export default class ScaleController extends controllers.CustomController {

	/**
	 * dat.GUI graphical user interface controller for control of the scale of threejs 3D object
	 * @param {Event} onclick
	 * @param {object} [options] followed options is available:
	 * @param {number} [options.zoomMultiplier] control value. Default is 1.1
	 * @param {Function} [options.getLanguageCode] returns the "primary language" subtag of the version of the browser. Default returns "en" is English
	 */
	constructor( onclick, options ) {

		options = options || {};
		options.zoomMultiplier = options.zoomMultiplier || 1.1;

		super( {

			multiplier: options.zoomMultiplier,//1.1
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

