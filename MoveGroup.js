/**
 * @module MoveGroup
 *
 * @description change group's position, scale and rotation.
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

import ScaleController from './ScaleController.js';
import PositionController from './PositionController.js';
import { dat } from './dat/dat.module.js';

//import Cookie from '../../cookieNodeJS/master/cookie.js';
//import Cookie from 'https://raw.githack.com/anhr/cookieNodeJS/master/cookie.js';
import Cookie from 'https://raw.githack.com/anhr/commonNodeJS/master/cookieNodeJS/cookie.js';

/**
 * Change group's position, scale and rotation.
 * @param {THREE.Group|THREE.Screen} group THREE group or scene
 * @param {object} [options] followed options is available
 * @param {object} [options.scales] axes scales. See AxesHelper( ... ) for details. Default is {}
 * @param {Cookie} [options.cookie] Your custom cookie function for saving and loading of the MoveGroup settings. Default cookie is not saving settings.
 * @param {string} [options.cookieName] Name of the cookie is "MoveGroup" + options.cookieName. Default is undefined.
 */
export function MoveGroup( group, options ) {

	options = options || {};
	if ( options.axesHelper )
		options.scales = options.axesHelper.options.scales;
	else options.scales = options.scales || { x: {}, y: {}, z: {}, };
	

	const cookie = options.cookie || new Cookie.defaultCookie();
	const cookieName = 'MoveGroup' + ( options.cookieName ? '_' + options.cookieName : '' );
/*
	//Если я заморожу входной параметр options, то не смогу его модифицировать в другихчастях программы
	//Поэтому приходится делать копию options и ее замораживать
	const optionsDefault = JSON.parse( JSON.stringify( options ) );
	Object.freeze( optionsDefault );
	cookie.getObject( cookieName, options, optionsDefault );
*/
	const optionsGroup = {

		scale: group.scale,
		position: group.position,
		rotation: group.rotation,
		x: { zoomMultiplier: 1.2, offset: 0.1, },
		y: { zoomMultiplier: 1.2, offset: 0.1, },
		z: { zoomMultiplier: 1.2, offset: 0.1, },

	};
	const groupOptionsDefault = JSON.parse( JSON.stringify( optionsGroup ) );
	Object.freeze( groupOptionsDefault );
	cookie.getObject( cookieName, optionsGroup, groupOptionsDefault );

	//move group from cookie
	group.scale.copy( optionsGroup.scale );
	group.position.copy( optionsGroup.position );

	//Restore optionsGroup from group
	//Если не восстановить optionsGroup из group, то после перемещения group это не будет сохраняться в cookie
	optionsGroup.scale = group.scale;
	optionsGroup.position = group.position;

	function setDefault( axisName ) {

		let scale = options.scales[axisName];
		if ( !scale )
			return;
		options.scales[axisName].default = function(){

			const scalesControllers = options.scalesControllers[axisName];
			scalesControllers.scale.setValue( groupOptionsDefault.scale[axisName] );
			scalesControllers.scaleController.setValue( groupOptionsDefault[axisName].zoomMultiplier );
			scalesControllers.position.setValue( groupOptionsDefault.position[axisName] );
			scalesControllers.positionController.setValue( groupOptionsDefault[axisName].offset );
			scalesControllers.rotation.setValue( groupOptionsDefault.rotation['_' + axisName] );

		}

	}
	setDefault( 'x' );
	setDefault( 'y' );
	setDefault( 'z' );

	/**
	 * Add MoveGroup folder into {@link https://github.com/anhr/dat.gui|dat.gui}.
	 * @param {GUI} gui is [new dat.GUI(...)]{@link https://github.com/anhr/dat.gui}.
	 * @param {object} [guiParams] Followed parameters is allowed. Default is no parameters.
	 * @param {Function} [guiParams.getLanguageCode] Your custom getLanguageCode() function.
	 * returns the "primary language" subtag of the language version of the browser.
	 * Examples: "en" - English language, "ru" Russian.
	 * See the "Syntax" paragraph of RFC 4646 {@link https://tools.ietf.org/html/rfc4646#section-2.1|rfc4646 2.1 Syntax} for details.
	 * Default returns the 'en' is English language.
	 * You can import { getLanguageCode } from '../../commonNodeJS/master/lang.js';
	 * @param {object} [guiParams.lang] Object with localized language values
	 * @param {object} [guiParams.lang.moveGroup] use for rename of the MoveGroup folder. Default is 'Move Group'.
	 * @param {GuiSelectPoint} [guiParams.guiSelectPoint] A dat.gui based graphical user interface for select a point from the mesh.
	 * See [GuiSelectPoint]{@link https://raw.githack.com/anhr/commonNodeJS/master/guiSelectPoint/jsdoc/index.html} for details.
	 * Default is undefined.
	 */
	this.gui = function ( gui, guiParams ) {

		guiParams = guiParams || {};

		//Localization

		var lang = {

			moveGroup: 'Move Group',
			scale: 'Scale',
			position: 'Position',
			rotation: 'Rotation',

			defaultButton: 'Default',
			defaultTitle: 'Move group to default position.',

		};

		var languageCode = guiParams.getLanguageCode === undefined ? 'en'//Default language is English
			: guiParams.getLanguageCode();
		switch ( languageCode ) {

			case 'ru'://Russian language

				lang.moveGroup = 'Переместить группу'; scale
				lang.scale = 'Масштаб'; 
				lang.position = 'Позиция';
				lang.rotation = 'Вращение';

				lang.defaultButton = 'Восстановить';
				lang.defaultTitle = 'Переместить группу в исходное состояние.';

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

		if ( guiParams.lang )
			lang.moveGroup = guiParams.lang.moveGroup || lang.moveGroup;

		function axisZoom( axisName, action, zoom ) {

			var scale = options.scalesControllers[axisName].scale;
			if ( !scale )
				return;
			scale.setValue( action( scale.getValue(), zoom ) );
//			cookie.setObject( cookieName, optionsGroup );
			setSettings();

		}

		//

		//move group folder
		let fMoveGroup = gui.addFolder( lang.moveGroup );

		fMoveGroup.add( new ScaleController(
			function ( customController, action ) {

				let zoom = customController.controller.getValue();
				axisZoom( 'x', action, zoom );
				axisZoom( 'y', action, zoom );
				axisZoom( 'z', action, zoom );

			}, {

			settings: { zoomMultiplier: 1.1, },
			getLanguageCode: guiParams.getLanguageCode,

		} ) );

		function setSettings() {

			if ( options.axesHelper )
				options.axesHelper.updateAxes();
			if ( guiParams.guiSelectPoint )
				guiParams.guiSelectPoint.update();
			cookie.setObject( cookieName, optionsGroup );

		}

		function scale( axes,// windowRange,
			scaleControllers, axisName ) {

			if ( axes === undefined )
				return;//Not 3D AxesHelper
			axes.name = axes.name || axisName;

			function onclick( customController, action ) {

				var zoom = customController.controller.getValue();

				axisZoom( axisName, action, zoom );
/*
				if ( guiParams.axesHelper !== undefined )
					guiParams.axesHelper.updateDotLines();
*/

			}

			scaleControllers.folder = fMoveGroup.addFolder( axes.name );

			//Scale

			scaleControllers.scaleController = scaleControllers.folder.add( new ScaleController( onclick,
				{ settings: optionsGroup[axisName], getLanguageCode: guiParams.getLanguageCode, } ) ).onChange( function ( value ) {

					optionsGroup[axisName].zoomMultiplier = value;
//					cookie.setObject( cookieName, optionsGroup );
					setSettings();
/*
					if ( guiParams.axesHelper )
						guiParams.axesHelper.setSettings();
*/

				} );
			scaleControllers.scale = dat.controllerZeroStep( scaleControllers.folder, group.scale, axisName,
				function ( value ) { setSettings(); } );
			dat.controllerNameAndTitle( scaleControllers.scale, lang.scale );

			//Position

			var positionController = new PositionController( function ( shift ) {

				//			console.warn( 'shift = ' + shift );
				function onclick( customController, action ) {

					var offset = customController.controller.getValue();


					function axisOffset( axisName, action, offset ) {

						var position = options.scalesControllers[axisName].position;
						if ( !position )
							return;
						position.setValue( action( position.getValue(), offset ) );
//						cookie.setObject( cookieName, optionsGroup );
						setSettings();

					}
					axisOffset( axisName, action, offset );
/*
					if ( guiParams.axesHelper !== undefined )
						guiParams.axesHelper.updateDotLines();
*/

				}
				onclick( positionController, function ( value, zoom ) {

					value += shift;//zoom;
					return value;

				} );

			}, { settings: {}, getLanguageCode: guiParams.getLanguageCode, } );
			scaleControllers.positionController = scaleControllers.folder.add( positionController ).onChange( function ( value ) {

				optionsGroup[axisName].offset = value;
//				cookie.setObject( cookieName, optionsGroup );
				setSettings();

			} );
			scaleControllers.position = dat.controllerZeroStep( scaleControllers.folder, group.position, axisName,
				function ( value ) { setSettings(); } );
			dat.controllerNameAndTitle( scaleControllers.position, lang.position );

			//rotation

			scaleControllers.rotation = scaleControllers.folder.add( group.rotation, axisName, 0, Math.PI * 2, 1 / 360 ).
				onChange( function ( value ) { setSettings(); } );
			//						dat.controllerNameAndTitle( cRotations.x, options.scales.x.name );
			dat.controllerNameAndTitle( scaleControllers.rotation, lang.rotation );

			//Default button
			dat.controllerNameAndTitle( scaleControllers.folder.add( {

				defaultF: function ( value ) {

					axes.default();
/*
					if ( guiParams.axesHelper !== undefined )
						guiParams.axesHelper.updateDotLines();
*/

				},

			}, 'defaultF' ), lang.defaultButton, lang.defaultTitle );

		}
		options.scalesControllers = { x: {}, y: {}, z: {}, w: {} };//, t: {}, };
		function windowRange() {

			options.cookie.setObject( cookieName, options.scales );

		}
		if ( options.scales ) {

			scale( options.scales.x,
//				guiParams.axesHelper === undefined ? windowRange : guiParams.axesHelper.windowRangeX,
				options.scalesControllers.x, 'x' );
			scale( options.scales.y,
//				guiParams.axesHelper === undefined ? windowRange : guiParams.axesHelper.windowRangeY,
				options.scalesControllers.y, 'y' );
			scale( options.scales.z,
//				guiParams.axesHelper === undefined ? windowRange : guiParams.axesHelper.windowRangeZ,
				options.scalesControllers.z, 'z' );
			
		}

		//default button
		var defaultParams = {

			defaultF: function ( value ) {

				if (options.scales.x) options.scales.x.default();
				if (options.scales.y) options.scales.y.default();
				if (options.scales.z) options.scales.z.default();
				
			},

		};
		dat.controllerNameAndTitle( fMoveGroup.add( defaultParams, 'defaultF' ), lang.defaultButton, lang.defaultTitle );

	}

}
