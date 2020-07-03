/**
 * OrbitControls graphical user interface
 * @see {@link three.js\examples\js\controls\OrbitControls.js} about OrbitControls
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
import { dat } from './dat.module.js';

/**
 * OrbitControls graphical user interface
 * @param {GUI} gui instance of the dat.GUI
 * @param {any} orbitControls
 * @param {object} [options] followed options is available:
 */
var OrbitControlsGui = function ( gui, orbitControls, options ) {
	
	if ( orbitControls === undefined )
		return;

	options = options || {};

	//scales

	options.scales = options.scales || {};

	if ( options.scales.x ) options.scales.x.name = options.scales.x.name || 'X';
	if ( options.scales.y ) options.scales.y.name = options.scales.y.name || 'Y';
	if ( options.scales.z ) options.scales.z.name = options.scales.z.name || 'Z';

	//Localization

	var lang = {

		orbitControls: 'Orbit controls',
		defaultButton: 'Default',
		defaultTitle: 'Restore default Orbit controls settings.',
		target: 'Target',

	};

	var _languageCode = options.getLanguageCode === undefined ? 'en'//Default language is English
		: options.getLanguageCode();
	switch ( _languageCode ) {

		case 'ru'://Russian language

			lang.defaultButton = 'Восстановить';
			lang.defaultTitle = 'Восстановить настройки Orbit controls по умолчанию.';

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

	var fOrbitControls = gui.addFolder( lang.orbitControls ),
		fX = !options.scales.x ? undefined : fOrbitControls.addFolder( options.scales.x.name ),
		fY = !options.scales.y ? undefined : fOrbitControls.addFolder( options.scales.y.name ),
		fZ = !options.scales.z ? undefined : fOrbitControls.addFolder( options.scales.z.name );

	function addTarget( folder, axisIndex ) {

		if ( !folder )
			return;

		function setTarget( value ) {

			if ( value === undefined )
				value = 0;
			orbitControls.target[axisIndex] = value;
			orbitControls.update();

			target.setValue( value );

		}

		folder.add( new PositionController( function ( shift ) {

			setTarget( orbitControls.target[axisIndex] + shift );

		} ) );

		//target
		var target = dat.controllerZeroStep( folder, orbitControls.target, axisIndex, function ( value ) {

			setTarget( value );

		} );
		dat.controllerNameAndTitle( target, lang.target );

		//Default button
		dat.controllerNameAndTitle( folder.add( {

			defaultF: function ( value ) {

				setTarget();

			},

		}, 'defaultF' ), lang.defaultButton, lang.defaultTitle );

		return target;

	}
	var targetX = addTarget( fX, 'x' ),
		targetY = addTarget( fY, 'y' ),
		targetZ = addTarget( fZ, 'z' );

	//Default button
	dat.controllerNameAndTitle( fOrbitControls.add( {

		defaultF: function ( value ) {

			orbitControls.target.x = 0;
			orbitControls.target.y = 0;
			orbitControls.target.z = 0;
			orbitControls.update();
			targetX.setValue( 0 );
			targetY.setValue( 0 );
			targetZ.setValue( 0 );

		},

	}, 'defaultF' ), lang.defaultButton, lang.defaultTitle );

}

export default OrbitControlsGui;