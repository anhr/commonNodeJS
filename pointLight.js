/**
 * @module pointLight
 * @description A light that gets emitted from a single point in all directions.
 * @see [PointLight]{@link https://threejs.org/docs/index.html?q=pointLight#api/en/lights/PointLight}
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

import three from './three.js'
import MyPoints from './myPoints/myPoints.js';
import Options from './Options.js'

class pointLight {

	/**
	 * A light that gets emitted from a single point in all directions.
	 * @see [PointLight]{@link https://threejs.org/docs/index.html?q=pointLight#api/en/lights/PointLight}
	 * @param {THREE.Group|THREE.Scene} scene [Group]{@link https://threejs.org/docs/index.html?q=gr#api/en/objects/Group} or [Scene]{@link https://threejs.org/docs/index.html?q=sce#api/en/scenes/Scene} of the <b>pointLight</b>.
	 * @param {object} [settings={}] the following settings are available
	 * @param {Options} [settings.options=new Options()] <a href="../../jsdoc/Options/Options.html" target="_blank">Options</a> instance. The following options are available.
	 * See <b>options</b> parameter of <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
	 * @param {boolean} [settings.options.pointLight] false - do not use <b>pointLight</b>.
	 * @param {object} [settings.options.dat] use dat-gui JavaScript Controller Library. [dat.gui]{@link https://github.com/dataarts/dat.gui}.
	 * See <b>options.dat</b> parameter of <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
	 * @param {object} [settings.options.dat.pointLightGui] false - do not adds a <b>pointLight</b> folder. Have effect only if <b>options.pointLight !== false</b>.
	 * @param {number} [settings.options.scale] is 1
	 * @param {THREE.Vector3} [settings.position] light position. Default is zero position.
	 */
	constructor( scene, settings = {} ) {

		const options = new Options( settings.options );
		if ( options.pointLight === false ) {

			this.add = function (){ }
			this.controls = function (){ }
			return;

		}

		const dat = three.dat,
			THREE = three.THREE,
			strLight = 'mathBoxLight',
			controllers = {},
			multiplier = 2 * options.scale,//options.scale is 1
			position = settings.position || new THREE.Vector3();// 0.5 * options.scale, 0.5 * options.scale, 0.5 * options.scale );
		const light = new THREE.PointLight( 0xffffff, 1 );
		light.position.copy( position );
		light.name = strLight;
		scene.add( light );
		/**
		 * Adds the folder of the light settings into [gui]{@link https://github.com/anhr/dat.gui}.
		 * @param {object} [guiParams={}] Followed parameters is allowed.
		 * @param {THREE.Group|THREE.Scene} [guiParams.group] [Group]{@link https://threejs.org/docs/index.html?q=gr#api/en/objects/Group} or [Scene]{@link https://threejs.org/docs/index.html?q=sce#api/en/scenes/Scene} of the light point.
		 * @param {GUI} [guiParams.folder] parent folder
		 * @param {string} [guiParams.folderName] folder name
		 */
		this.controls = function ( guiParams = {} ) {

			const group = guiParams.group || scene, folder = guiParams.folder || options.dat.gui, folderName = guiParams.folderName;

			if ( folder === undefined || ( options.dat.pointLightGui === false ) )
				return;

			//Localization

			const lang = {

				light: 'Light',
				displayLight: 'Display',
				displayLightTitle: 'Display or hide the light source.',

				defaultButton: 'Default',
				restoreLightTitle: 'Restore position of the light source',

			};
			switch ( options.getLanguageCode() ) {

				case 'ru'://Russian language

					lang.light = 'Свет';
					lang.displayLight = 'Показать';
					lang.displayLightTitle = 'Показать или скрыть источник света.';

					lang.defaultButton = 'Восстановить';
					lang.restoreLightTitle = 'Восстановить положение источника света';

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

			const scales = options.scales, fLight = folder.addFolder( folderName || lang.light );
			var lightSource;

			//displayLight
			dat.controllerNameAndTitle( fLight.add( { display: false }, 'display' ).onChange( function ( value ) {

				if ( value ) {

					MyPoints( light.position, group, { pointsOptions: {

						onReady( points ) { lightSource = points; }

					} } );

				} else {

					group.remove( lightSource );
					//delete lightSource;//Parsing error: Deleting local variable in strict mode
					lightSource = undefined;

				}

			} ), lang.displayLight, lang.displayLightTitle );

			//move light
			function guiLightAxis( axesName ) {

				const scale = scales[axesName];
				if ( !scale )
					return;
				controllers[axesName] =
					fLight.add( light.position, axesName, scale.min * multiplier, scale.max * multiplier )
						.onChange( function ( value ) {

							if ( lightSource === undefined )
								return;

							const i = 0,
								itemSize = lightSource.geometry.attributes.position.itemSize,
								point = new THREE.Vector3().fromArray( lightSource.geometry.attributes.position.array, i * itemSize );
							point[axesName] = value;
							point.toArray( lightSource.geometry.attributes.position.array, i * itemSize );
							//										lightSource.geometry.attributes.position.array[axesId] = value;
							lightSource.geometry.attributes.position.needsUpdate = true;

						} );
				dat.controllerNameAndTitle( controllers[axesName], scale.name );

			}
			guiLightAxis( 'x' );
			guiLightAxis( 'y' );
			guiLightAxis( 'z' );

			var restore = {

				restore: function () {

					controllers.x.setValue( position.x );
					controllers.y.setValue( position.y );
					controllers.z.setValue( position.z );

				}
			};
			dat.controllerNameAndTitle( fLight.add( restore, 'restore' ), lang.defaultButton, lang.restoreLightTitle );

		};
		return this;

	}

}

export default pointLight;