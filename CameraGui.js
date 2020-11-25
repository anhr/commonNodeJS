/**
 * @module CameraGui
 * @description [Camera]{@link https://threejs.org/docs/index.html#api/en/cameras/PerspectiveCamera} graphical user interface.
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

//import PositionController from './PositionController.js';
import { dat } from './dat/dat.module.js';

//import Player from './player/player.js';
//import Player from 'https://raw.githack.com/anhr/commonNodeJS/master/player/player.js';

/**
 * Camera graphical user interface
 * @param {GUI} gui is [new dat.GUI(...)]{@link https://github.com/anhr/dat.gui}.
 * @param {THREE.PerspectiveCamera} camera [PerspectiveCamera]{@link https://threejs.org/docs/index.html#api/en/cameras/PerspectiveCamera}
 * @param {object} [options] the following options are available:
 * @param {OrbitControls} [options.orbitControls] [OrbitControls]{@link https://threejs.org/docs/index.html#examples/en/controls/OrbitControls}.
 * @param {object} [options.scales={}] axes scales.
 * See [AxesHelper(...)]{@link https://raw.githack.com/anhr/commonNodeJS/master/AxesHelper/jsdoc/module-AxesHelper.html} options.scales for details.
 * @param {Function} [options.getLanguageCode="en"] returns the "primary language" subtag of the version of the browser. Default returns "en" is English
*/
var CameraGui = function ( gui, camera, options ) {

/*
	if ( camera === undefined )
		return;
*/

	options = options || {};

	//scales

	options.scales = options.scales || {};

	options.scales.x = options.scales.x || {};
	options.scales.x.name = options.scales.x.name || 'X';

	options.scales.y = options.scales.y || {};
	options.scales.y.name = options.scales.y.name || 'Y';

	options.scales.z = options.scales.z || {};
	options.scales.z.name = options.scales.z.name || 'Z';

	//

	if ( options.orbitControls )
		options.orbitControls.addEventListener( 'change', function () {

			update();

		} );

	//Localization

	const lang = {

		camera: 'Camera',

		position: 'Position',
		positionTitle: 'Camera position',

		distanceToCamera: 'Distance',
		distanceToCameraTitle: 'Distance from the camera to the point at which the camera is looking',

		look: 'Look',
		lookTitle: 'Camera is look at a selected point during playing.',

		defaultButton: 'Default',
		defaultTitle: 'Restore default camera settings.',

	};

	const _languageCode = options.getLanguageCode === undefined ? 'en'//Default language is English
		: options.getLanguageCode();
	switch ( _languageCode ) {

		case 'ru'://Russian language

			lang.camera = 'Камера';

			lang.position = 'Позиция';
			lang.positionTitle = 'Позиция камеры';

			lang.distanceToCamera = 'Расстояние';
			lang.distanceToCameraTitle = 'Расстояние между камерой и точкой, на которую она смотрит.',

			lang.look = 'Следить';
			lang.lookTitle = 'Камера следит за выбранной точкой во время проигрывания.';

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

	const fCamera = gui.addFolder( lang.camera ),
		fPosition = fCamera.addFolder( lang.position ),
		controllersPosition = {

			x: dat.controllerZeroStep( fPosition, camera.position, 'x', function ( value ) {

				camera.position.x = value;

			} ),
			y: dat.controllerZeroStep( fPosition, camera.position, 'y', function ( value ) {

				camera.position.y = value;

			} ),

			z: dat.controllerZeroStep( fPosition, camera.position, 'z', function ( value ) {

				camera.position.z = value;

			} ),

		};
	dat.folderNameAndTitle( fPosition, lang.position, lang.positionTitle );
	dat.controllerNameAndTitle( controllersPosition.x, options.scales.x.name );
	dat.controllerNameAndTitle( controllersPosition.y, options.scales.y.name );
	dat.controllerNameAndTitle( controllersPosition.z, options.scales.z.name );

	var controllersDistance, defaultDistance;
	if ( camera.userData.cameraTarget ) {

		const Player = camera.userData.cameraTarget.Player,
			controllerLook = fCamera.add( camera.userData.cameraTarget, 'boLook' ).onChange( function ( value ) { } ),
			fDistanceToCamera = fCamera.addFolder( lang.distanceToCamera ),
			distance = {

				x: Player.execFunc( camera.userData.cameraTarget.distanceToCamera, 'x' ),
				y: Player.execFunc( camera.userData.cameraTarget.distanceToCamera, 'y' ),
				z: Player.execFunc( camera.userData.cameraTarget.distanceToCamera, 'z' ),
				
			};
		dat.controllerNameAndTitle( controllerLook, lang.look, lang.lookTitle );
		function setDistance(){

			camera.userData.cameraTarget.setCameraPosition( camera.userData.cameraTarget.target );
			update();
				
		}
		controllersDistance = {

			x: dat.controllerZeroStep( fDistanceToCamera, distance, 'x', function ( value ) {

				camera.userData.cameraTarget.distanceToCameraCur.x = value;
				setDistance();

			} ),
			y: dat.controllerZeroStep( fDistanceToCamera, distance, 'y', function ( value ) {

				camera.userData.cameraTarget.distanceToCameraCur.y = value;
				setDistance();

			} ),

			z: dat.controllerZeroStep( fDistanceToCamera, distance, 'z', function ( value ) {

				camera.userData.cameraTarget.distanceToCameraCur.z = value;
				setDistance();

			} ),

		};
		defaultDistance = { x: distance.x, y: distance.y, z: distance.z };
		dat.folderNameAndTitle( fDistanceToCamera, lang.distanceToCamera, lang.distanceToCameraTitle );
		dat.controllerNameAndTitle( controllersDistance.x, options.scales.x.name );
		dat.controllerNameAndTitle( controllersDistance.y, options.scales.y.name );
		dat.controllerNameAndTitle( controllersDistance.z, options.scales.z.name );
	
	}

	//Default button
	const defaultPosition = { x: camera.position.x, y: camera.position.y, z: camera.position.z },
		defaultTarget = options.orbitControls ?
		{

			x: options.orbitControls.target.x,
			y: options.orbitControls.target.y,
			z: options.orbitControls.target.z,

		} :
		undefined;
	dat.controllerNameAndTitle( fCamera.add( {

		defaultF: function ( value ) {

			controllersPosition.x.setValue( defaultPosition.x );
			controllersPosition.y.setValue( defaultPosition.y );
			controllersPosition.z.setValue( defaultPosition.z );

			camera.position.copy( defaultPosition );
			camera.lookAt( defaultTarget );
			if ( options.orbitControls ) {

				options.orbitControls.target.copy( defaultTarget );
				options.orbitControls.update();

			}

			controllersDistance.x.setValue( defaultDistance.x );
			controllersDistance.y.setValue( defaultDistance.y );
			controllersDistance.z.setValue( defaultDistance.z );

		},

	}, 'defaultF' ), lang.defaultButton, lang.defaultTitle );

	function update(){

		controllersPosition.x.setValue( camera.position.x );
		controllersPosition.y.setValue( camera.position.y );
		controllersPosition.z.setValue( camera.position.z );

		if ( controllersDistance ) {

			controllersDistance.x.setValue( camera.userData.cameraTarget.distanceToCameraCur.x );
			controllersDistance.y.setValue( camera.userData.cameraTarget.distanceToCameraCur.y );
			controllersDistance.z.setValue( camera.userData.cameraTarget.distanceToCameraCur.z );

		}

	}
	if ( this ) {

		/**
		 * Update camera controls.
		 * @function CameraGui.
		 * update
		 */
		this.update = function () { update(); }
		if ( camera.userData.cameraTarget ) camera.userData.cameraTarget.cameraGui = this;

	}

}

export default CameraGui;