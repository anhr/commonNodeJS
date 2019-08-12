/**
 * node.js version of the cookie.
 *
 * @author Andrej Hristoliubov https://anhr.github.io/AboutMe/
 *
 * Copyright 2011 Data Arts Team, Google Creative Lab
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */

/*Error:
CustomController.js:15 GET http://localhost/threejs/dat.gui/src/dat/controllers/Controller net::ERR_ABORTED 404 (Not Found)
CustomController.js:16 GET http://localhost/threejs/dat.gui/src/dat/controllers/ControllerFactory net::ERR_ABORTED 404 (Not Found)
*/
//import CustomController from '../../dat.gui/src/dat/controllers/CustomController.js';
//import CustomController from 'http://localhost/threejs/dat.gui/src/dat/controllers/CustomController.js';

//import { controllers } from '../../dat.gui/build/dat.gui.module.js';
//import { controllers } from 'http://localhost/threejs/dat.gui/build/dat.gui.module.js';
import { controllers } from 'https://raw.githack.com/anhr/dat.gui/master/build/dat.gui.module.js';

// Error: 'CustomController' is not exported by ..\..\dat.gui\build\dat.gui.module.js
//import { CustomController } from '../../dat.gui/build/dat.gui.module.js';

//import UpDownController from '../commonNodeJS/UpDownController.js';
//import UpDownController from './UpDownController.js';

/**
 * adds new button into controller
 * @param {string} innerHTML button name
 * @param {object} [options] followed options is available
 * @param {} [options.title] title of the button
 * @param {} [options.onclick] onclick event
 * @param {} [options.onWheel] onWheel event
 */
function addButton( innerHTML, options ) {

	options = options || {};
	var button = document.createElement( 'span' );
	button.innerHTML = innerHTML;
	if ( options.title !== undefined )
		button.title = options.title;
	if ( options.onclick !== undefined ) {

		button.style.cursor = 'pointer';
		button.onclick = options.onclick;

	}
	if ( options.onwheel !== undefined ) {

		button.style.cursor = 'n-resize';

		//https://learn.javascript.ru/mousewheel
		if ( button.addEventListener ) {
			if ( 'onwheel' in document ) {
				// IE9+, FF17+, Ch31+
				button.addEventListener( "wheel", onWheel );
			} else if ( 'onmousewheel' in document ) {
				// устаревший вариант события
				button.addEventListener( "mousewheel", onWheel );
			} else {
				// Firefox < 17
				button.addEventListener( "MozMousePixelScroll", onWheel );
			}
		} else { // IE8-
			button.attachEvent( "onmousewheel", onWheel );
		}

		function onWheel( e ) {
			e = e || window.event;

			// wheelDelta не дает возможность узнать количество пикселей
			var delta = e.deltaY || e.detail || e.wheelDelta;
			options.onwheel( delta );

		}

	}
	button.style.margin = '0px 2px';
	return button;

}

/*
class PositionController extends controllers.CustomController {

	constructor( onclickController ) {

		super( {

			offset: 0.1,
			property: property,

		}, 'offset', 0.1, 10, 0.1 );

	}

}
*/

var OrbitControlsGui = function ( gui, guiParams ) {
	
	guiParams = guiParams || {};

	//Localization

	var lang = {

		//Position
		offset: 'Offset',
		add: 'add',
		subtract: 'subtract',
		wheelPosition: 'Scroll the mouse wheel to change the position',

	};

	var _languageCode = guiParams.getLanguageCode === undefined ? function () {

		return 'en';//Default language is English

	} : guiParams.getLanguageCode();
	switch ( _languageCode ) {

		case 'ru'://Russian language

			//Position
			lang.offset = 'Сдвиг';
			lang.add = 'добавить';
			lang.subtract = 'вычесть';
			lang.wheelPosition = 'Прокрутите колесико мыши для изменения позиции';

			break;
		default://Custom language
			if ( ( guiParams.lang === undefined ) || ( guiParams.lang.languageCode != _languageCode ) )
				break;

			Object.keys( guiParams.lang ).forEach( function ( key ) {

				if ( lang[key] === undefined )
					return;
				lang[key] = guiParams.lang[key];

			} );

	}
	class PositionController extends controllers.CustomController {

		constructor( onclickController ) {

			super( {

				offset: 0.1,
				property: function ( customController ) {

					var buttons = {};//, addButton = UpDownController.addButton;
					buttons.Label = addButton( lang.offset, {

						title: lang.wheelPosition,
						onwheel: function ( delta ) {

							var shift = customController.controller.getValue();
							onclickController( delta > 0 ? shift : - shift );

						}

					} );
					buttons.in = addButton( '↑', {

						title: lang.add,
						onclick: function () {

							onclickController( customController.controller.getValue() );

						}

					} );
					buttons.out = addButton( '↓', {

						title: lang.subtract,
						onclick: function () {

							onclickController( - customController.controller.getValue() );

						}

					} );
					return buttons;

				},

			}, 'offset', 0.1, 10, 0.1 );
			if ( this.property === undefined )
				console.error( 'init() returns ' + this.property );

		}

	}
	//gui.add( { color: 3 }, 'color' );
	var positionController = new PositionController( function ( shift ) {

		console.warn( 'shift = ' + shift );

	} );
	gui.add( positionController );
//	gui.add( new PositionController() );
/*
	var positionController = gui.add( new PositionController( function ( shift ) {

		console.warn( 'shift = ' + shift );

	} ) ).onChange( function ( value ) {

		axes.positionOffset = value;
		options.cookie.setObject( cookieName, options.scales );

	} );
*/
}

export default OrbitControlsGui;