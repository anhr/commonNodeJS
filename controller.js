/**
 * View and edit some parameters on the web page.
 *
 * @author [Andrej Hristoliubov]{@link https://github.com/anhr}
 * Thanks to https://stackoverflow.com/a/11900218/5175935
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

/**
 * @description View and edit some parameters on the web page.
 * @param {Object} [settings] see <b>arrayFuncs.controllers[axisName]</b> parameter of <a href="./player/jsdoc/module-Player-Player.getPoints.html" target="_blank">Player.getPoints</a>
 * @param {HTMLElement|string} [settings.controller]
 * <pre>
 * HTMLElement - for viewing or editing of some value
 * string - id of HTMLElement
 * </pre>
 * @param {HTMLElement|string} [settings.elName]
 * <pre>
 * HTMLElement - name of value. See <b>settings.controller</b> above.
 * string - id of HTMLElement
 * </pre>
 * @param {string} controllerId id of controller if <b>settings.controller</b> is not defined.
 * @param {Function} name returns name of value.
 * @param {Object} options
 * @param {Object} [options.elementName='input'] controllers tag name if <b>settings.controller</b> is not defined.
 * @param {String} [options.value] controllers <b>value</b> or <b>innerHTML</b>.
 * @param {String} [options.axisName] axis name. For find element by ID.
 * @param {Function} [options.onchange] callback function is called if user has changed the controllers <b>value</b>.
 */
export function createController( settings, controllerId, name, options ) {

	if ( !settings ) return;

	//controller

	if ( typeof settings.controller === "string" ) {

		const id = settings.controller;
		settings.controller = document.getElementById( settings.controller );
		if ( !settings.controller ) console.warn( 'createController: invalid settings.controller = "' + id + '"' );

	}
	if ( !settings.controller ) {

		if ( settings.controller === null ) console.warn( 'createController: invalid settings.controller = ' + settings.controller );
		var controller = document.getElementById( controllerId );
		if ( !controller ) {

			controller = document.createElement( options.elementName ? options.elementName : 'input' );
			document.querySelector( 'body' ).appendChild( controller );

		}
		settings.controller = controller;

	}
	function setControllerValue( value ) {

		if( settings.controller.value !== undefined )
			settings.controller.value = value;//input element type
		else settings.controller.innerHTML = value;//other element types. For example span

	}
	if ( options.value !== undefined )
		setControllerValue( options.value );
	if ( ( options.onchange !== undefined ) && settings.controller.onchange === null )
		settings.controller.onchange = options.onchange;
	if ( ( options.title !== undefined ) && settings.controller.title === '' )
		settings.controller.title = options.title;

	//slider
	if( settings.elSlider ) {

		if ( typeof settings.elSlider === "string" ) {

			const id = settings.elSlider;
			settings.elSlider = document.getElementById( settings.elSlider );
			if ( !settings.elSlider ) console.warn( 'createController: invalid settings.elSlider = "' + id + '"' );

		}
		if ( !settings.elSlider || ( settings.elSlider === true ) ) {

			if ( options.axisName ) settings.elSlider = document.getElementById( options.axisName + 'Slider' );
			if ( !settings.elSlider ) {

				settings.elSlider = document.createElement( 'div' );
				if ( settings.controller )
					settings.controller.parentElement.appendChild( settings.elSlider );
				else document.querySelector( 'body' ).appendChild( settings.elSlider );

			}

		}

		settings.boSetValue = true;
		//Horizontal Colorpicker with slider indicator
		if ( !settings.colorpicker ) {

			settings.colorpicker = ColorPicker.create( settings.elSlider, {

				//direction: false,
				duplicate: true,
				sliderIndicator: {
					callback: function ( c ) {

						if ( settings.boSetValue || !settings.controller ) return;
						const value = c.percent / 100;
						settings.controller.onchange( { currentTarget: { value: value } } );
						settings.controller.value = value;

					},
					value: options.value * 100,//percent

				},
				style: {

					border: '1px solid black',
					width: settings.controller.clientWidth + 'px',
					height: settings.controller.clientHeight + 'px',

				},
				onError: function ( message ) { alert( 'Horizontal Colorpicker with slider indicator error: ' + message ); }

			} );

			//Непонятно почему если это не сделать, то settings.elSlider не попадает под settings.controller
			//Сейчас после settings.controller ставлю <br>
			//settings.elSlider.style.display = 'none';
			//settings.elSlider.style.display = 'block';

		}
		if ( options.value !== undefined ) {

			var value = options.value * 100;
			if ( value < 0 ) value = 0;
			if ( value > 100 ) value = 100;
			settings.boSetValue = true;
			settings.colorpicker.setValue( value );
			settings.boSetValue = false;

		}
/*
		document.getElementById( 'enterValueHI' ).onclick = function () {

			settings.colorpicker.setValue( settings.controller.value );

		}
*/
		
	}

	//name

	if ( settings.elName === false )
		return;

	if ( settings.elName === null ) console.warn( 'createController: invalid settings.elName = ' + settings.elName );
	if ( typeof settings.elName === "string" ) {

		const id = settings.elName;
		settings.elName = document.getElementById( settings.elName );
		if ( !settings.elName ) console.warn( 'createController: invalid settings.elName = "' + id + '"' );

	}
	var str = '';
	if ( !settings.elName ) {

		if ( options.axisName ) settings.elName = document.getElementById( options.axisName + 'Name' );
		if ( !settings.elName ) {

			settings.elName = document.createElement( 'span' );
			settings.controller.parentElement.insertBefore( settings.elName, settings.controller );
			str = ' = ';

		}

	}
	if ( settings.elName.innerHTML !== '' )
		return;
	settings.elName.innerHTML = name() + str;

}

