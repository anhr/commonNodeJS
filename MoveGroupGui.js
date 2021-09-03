/**
 * @module MoveGroupGui
 *
 * @description Add MoveGroup folder into {@link https://github.com/anhr/dat.gui|dat.gui} for changing group's position, scale and rotation.
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

import three from './three.js'
import ScaleController from './ScaleController.js';
import PositionController from './PositionController.js';

//import Cookie from './cookieNodeJS/cookie.js';
//import Cookie from 'https://raw.githack.com/anhr/commonNodeJS/master/cookieNodeJS/cookie.js';

class MoveGroupGui {

	/**
	 * Add MoveGroup folder into {@link https://github.com/anhr/dat.gui|dat.gui} for changing group's position, scale and rotation.
	 * @param {THREE.Group|THREE.Scene} group [THREE.Group]{@link https://threejs.org/docs/index.html?q=group#api/en/objects/Group} or [THREE.Scene]{@link https://threejs.org/docs/index.html?q=sce#api/en/scenes/Scene} for moving.
	 * @param {object} options the following options are available.
	 * See the <b>options</b> parameter of the <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
	 * @param {object} [options.axesHelper] <a href="../../AxesHelper/jsdoc/index.html" target="_blank">AxesHelper</a>.
	 * @param {object} [options.scales] axes scales.
	 * See <b>options.scales</b> parameter of the <a href="../../AxesHelper/jsdoc/module-AxesHelper-AxesHelper.html" target="_blank">AxesHelper</a> class for details.
	 * @param {Cookie} [options.cookie] Your custom cookie function for saving and loading of the MoveGroup settings. Default cookie is not saving settings.
	 * @param {string} [options.cookieName] Name of the cookie is "MoveGroup" + options.cookieName.
	 * @param {GuiSelectPoint} [options.guiSelectPoint] A dat.gui based graphical user interface for select a point from the mesh.
	 * See <a href="../../guiSelectPoint/jsdoc/index.html" target="_blank">GuiSelectPoint</a> for details.
	 * @param {GUI} [guiParams.folder] is [dat.GUI]{@link https://github.com/anhr/dat.gui} parent folder.
	 * @param {object} [guiParams={}] Followed parameters is allowed.
	 * @param {object} [guiParams.lang] Object with localized language values
	 * @param {object} [guiParams.lang.moveGroup] use for rename of the MoveGroup folder. Default is 'Move Group'.
	 */
	constructor( group, options, guiParams = {} ) {

//		options = options || new Options();
		if ( !options.boOptions ) {

			console.error( 'MoveGroupGui: call options = new Options( options ) first' );
			return;

		}
		const gui = guiParams.folder || options.dat.gui;
		if ( !gui || options.dat.moveScene === false )
			return;
		if ( options.axesHelper && options.axesHelper.options )
			options.scales = options.axesHelper.options.scales;
		else options.scales = options.scales || { x: {}, y: {}, z: {}, };


//		const cookie = options.cookie || new Cookie.defaultCookie(),
		const cookie = options.dat.cookie,
			dat = three.dat,//options.dat.dat,
			cookieName = 'MoveGroup' + ( options.cookieName ? '_' + options.cookieName : '' ),
			optionsGroup = {

				scale: group.scale,
				position: group.position,
				rotation: group.rotation,
				x: { zoomMultiplier: 1.2, offset: 0.1, },
				y: { zoomMultiplier: 1.2, offset: 0.1, },
				z: { zoomMultiplier: 1.2, offset: 0.1, },

			},
			groupOptionsDefault = JSON.parse( JSON.stringify( optionsGroup ) );
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
			
			options.moveGroupGui = options.moveGroupGui || { scales: {} };
			options.moveGroupGui.scales[axisName] = options.moveGroupGui.scales[axisName] || {};
			options.moveGroupGui.scales[axisName].default = function () {

				const scalesControllers = options.scalesControllers[axisName];
				scalesControllers.scale.setValue( groupOptionsDefault.scale[axisName] );
				scalesControllers.scaleController.setValue( groupOptionsDefault[axisName].zoomMultiplier );
				scalesControllers.position.setValue( groupOptionsDefault.position[axisName] );
				scalesControllers.positionController.setValue( groupOptionsDefault[axisName].offset );
				scalesControllers.rotation.setValue( groupOptionsDefault.rotation['_' + axisName] );

			}
/*если я вставлю функцию в options.scales[axisName], то она исчезнет во время вызова
cookie.getObject( cookieName, options.scales, options.scales );
в AxesHelperGui и поэтому MoveGroupGui нельзя вызывать до AxesHelperGui.

			options.scales[axisName].default = function () {

				const scalesControllers = options.scalesControllers[axisName];
				scalesControllers.scale.setValue( groupOptionsDefault.scale[axisName] );
				scalesControllers.scaleController.setValue( groupOptionsDefault[axisName].zoomMultiplier );
				scalesControllers.position.setValue( groupOptionsDefault.position[axisName] );
				scalesControllers.positionController.setValue( groupOptionsDefault[axisName].offset );
				scalesControllers.rotation.setValue( groupOptionsDefault.rotation['_' + axisName] );

			}
*/			

		}
		setDefault( 'x' );
		setDefault( 'y' );
		setDefault( 'z' );

//		const guiParams = options;
//		this.gui = function ( gui, guiParams )
//		guiParams = guiParams || {};

		//Localization

		var lang = {

			moveGroup: 'Move Group',
			scale: 'Scale',
			position: 'Position',
			rotation: 'Rotation',

			defaultButton: 'Default',
			defaultTitle: 'Move group to default position.',

		};
/*
		var languageCode = guiParams.getLanguageCode === undefined ? 'en'//Default language is English
			: guiParams.getLanguageCode();
*/
		switch ( options.getLanguageCode() ) {

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
			if ( options.guiSelectPoint )
				options.guiSelectPoint.update();
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

					options.moveGroupGui.scales[axisName].default();
//					axes.default();

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

				if ( options.moveGroupGui.scales.x ) options.moveGroupGui.scales.x.default();
				if ( options.moveGroupGui.scales.y ) options.moveGroupGui.scales.y.default();
				if ( options.moveGroupGui.scales.z ) options.moveGroupGui.scales.z.default();
/*
				if ( options.scales.x ) options.scales.x.default();
				if ( options.scales.y ) options.scales.y.default();
				if ( options.scales.z ) options.scales.z.default();
*/				

			},

		};
		dat.controllerNameAndTitle( fMoveGroup.add( defaultParams, 'defaultF' ), lang.defaultButton, lang.defaultTitle );

	}

}
export default MoveGroupGui;