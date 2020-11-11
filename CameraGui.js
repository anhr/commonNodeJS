/**
 * [Camera]{@link https://threejs.org/docs/index.html#api/en/cameras/PerspectiveCamera} graphical user interface
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

//import PositionController from './PositionController.js';
import { dat } from './dat/dat.module.js';

/**
 * Camera graphical user interface
 * @param {GUI} gui is [new dat.GUI(...)]{@link https://github.com/anhr/dat.gui}.
 * @param {THREE.PerspectiveCamera} camera [PerspectiveCamera]{@link https://threejs.org/docs/index.html#api/en/cameras/PerspectiveCamera}
 * @param {object} [options] the following options are available:
 * @param {object} [options.scales={}] axes scales.
*/
var CameraGui = function ( gui, camera, options ) {

/*
	if ( camera === undefined )
		return;
*/

	options = options || {};

	//Localization

	var lang = {

		camera: 'Camera',
		defaultButton: 'Default',
		defaultTitle: 'Restore default camera settings.',

	};

	var _languageCode = options.getLanguageCode === undefined ? 'en'//Default language is English
		: options.getLanguageCode();
	switch ( _languageCode ) {

		case 'ru'://Russian language

			lang.camera = 'Камера',
			lang.defaultButton = 'Восстановить';
			lang.defaultTitle = 'Восстановить настройки камеры по умолчанию.';

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

	var fCamera = gui.addFolder( lang.camera );

	//Default button
	dat.controllerNameAndTitle( fCamera.add( {

		defaultF: function ( value ) {


		},

	}, 'defaultF' ), lang.defaultButton, lang.defaultTitle );

}

export default CameraGui;