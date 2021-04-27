/**
 * set options
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

import ColorPicker from './colorpicker/colorpicker.js';
//import ColorPicker from 'https://raw.githack.com/anhr/commonNodeJS/master/colorpicker/colorpicker.js';

class SetOptions {

	/**set options */
	constructor() {

		/**
		 * set the scales key of the options
		 * @param {Object} options
		 */
		this.setScales = function ( options ) {

			options.scales = options.scales || {};
			const boCreateScale = !options.scales.x && !options.scales.y && !options.scales.z;
			function setScale( axisName ) {

				//Не надо создавать ось потому что иначе будут создавться контролы для осей, которые не хочет видеть пользователь и будет рмсоватся пунктирная линия к не существующей оси если пользователь нажал на точку
				if ( boCreateScale )
					options.scales[axisName] = options.scales[axisName] || {};

				if ( !options.scales[axisName] )
					return;

				options.scales[axisName].name = options.scales[axisName].name || axisName;
				options.scales[axisName].min = options.scales[axisName].min === undefined ? -1 : options.scales[axisName].min;
				options.scales[axisName].max = options.scales[axisName].max === undefined ? 1 : options.scales[axisName].max;

			}
			setScale( 'x' );
			setScale( 'y' );
			setScale( 'z' );
			options.scales.setW = function () {

				const axisName = 'w';
				options.scales.w = options.scales.w || {};
				const scale = options.scales.w;
				scale.name = scale.name || axisName;
				if ( options.palette instanceof ColorPicker.palette ) {

					scale.min = scale.min === undefined ? 0 : scale.min;
					scale.max = scale.max === undefined ? 1 : scale.max;

				}
				/*				
						const axisName = 'w';
						options.scales[axisName] = {};
						setScale( axisName );
				*/

			}

		}
		/**
		 * set the palette key of the options
		 * @param {Object} options
		 */
		this.setPalette = function ( options ) {

			if ( options.palette )
				return;
			options.palette = new ColorPicker.palette();//ColorPicker.paletteIndexes.BGRW 

		}

	}

}
const setOptions = new SetOptions();
export default setOptions;