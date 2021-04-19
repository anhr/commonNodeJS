/**
 * @module OrbitControlsGui
 * @description [OrbitControls]{@link https://threejs.org/docs/index.html#examples/en/controls/OrbitControls} graphical user interface
 *
 * @author [Andrej Hristoliubov]{@link https://anhr.github.io/AboutMe/}
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
import { dat } from './dat/dat.module.js';

class OrbitControlsGui {

	/**
	 * OrbitControls graphical user interface
	 * @param {GUI} gui is [new dat.GUI(...)]{@link https://github.com/anhr/dat.gui}.
	 * @param {OrbitControls} orbitControls [OrbitControls]{@link https://threejs.org/docs/index.html#examples/en/controls/OrbitControls}
	 * @param {object} [options={}] the following options are available:
	 * @param {object} [options.scales={}] axes scales.
	 * See [AxesHelper(...)]{@link https://raw.githack.com/anhr/commonNodeJS/master/AxesHelper/jsdoc/module-AxesHelper.html} options.scales for details.
	 * @param {Function} [options.getLanguageCode="en"] returns the "primary language" subtag of the version of the browser. Default returns "en" is English
	 */
	constructor( gui, orbitControls, options ) {

		if ( orbitControls === undefined )
			return;

		options = options || {};

		//scales

		options.scales = options.scales || {};

		if ( options.scales.x ) options.scales.x.name = options.scales.x.name || 'X';
		if ( options.scales.y ) options.scales.y.name = options.scales.y.name || 'Y';
		if ( options.scales.z ) options.scales.z.name = options.scales.z.name || 'Z';

		orbitControls.addEventListener( 'change', function () {

			//console.log( 'orbitControls.target: ' + orbitControls.target.x + ' ' + orbitControls.target.y + ' ' + orbitControls.target.z )
			if ( targetX ) targetX.setValue( orbitControls.target.x );
			if ( targetY ) targetY.setValue( orbitControls.target.y );
			if ( targetZ ) targetZ.setValue( orbitControls.target.z );
			/*
			console.warn('camera.position = ' + camera.position.x + ' ' + camera.position.y + ' ' + camera.position.z
				+ '\r\ncamera.quaternion = ' + camera.quaternion.x + ' ' + camera.quaternion.y + ' ' + camera.quaternion.z
				+ '\r\ncamera.scale = ' + camera.scale.x + ' ' + camera.scale.y + ' ' + camera.scale.z
				);
			*/

		} );

		//Localization

		const lang = {

			orbitControls: 'Orbit Controls',
			defaultButton: 'Default',
			defaultTitle: 'Restore default Orbit controls settings.',
			target: 'Target',

		};

		const _languageCode = options.getLanguageCode === undefined ? 'en'//Default language is English
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

		const fOrbitControls = gui.addFolder( lang.orbitControls ),
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
			const target = dat.controllerZeroStep( folder, orbitControls.target, axisIndex, function ( value ) {

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
		const targetX = addTarget( fX, 'x' ),
			targetY = addTarget( fY, 'y' ),
			targetZ = addTarget( fZ, 'z' );

		//Default button
		dat.controllerNameAndTitle( fOrbitControls.add( {

			defaultF: function ( value ) {

				orbitControls.reset();
				/*
							orbitControls.target.x = 0;
							orbitControls.target.y = 0;
							orbitControls.target.z = 0;
							orbitControls.update();
				*/
				targetX.setValue( orbitControls.target.x );
				targetY.setValue( orbitControls.target.y );
				targetZ.setValue( orbitControls.target.z );

			},

		}, 'defaultF' ), lang.defaultButton, lang.defaultTitle );
//		if ( this )
		/**
		* Set camera [target]{@link https://threejs.org/docs/index.html#examples/en/controls/OrbitControls.target}.
		* @param {THREE.Vector3} target new camera [target]{@link https://threejs.org/docs/index.html#examples/en/controls/OrbitControls.target}
		*/
		this.setTarget = function ( target ) {

			targetX.setValue( target.x );
			targetY.setValue( target.y );
			targetZ.setValue( target.z );

		}

	}

}

export default OrbitControlsGui;