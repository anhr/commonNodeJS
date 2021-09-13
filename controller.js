/**
 * View and edit some parameters on the web page.
 *
 * @author Andrej Hristoliubov https://anhr.github.io/AboutMe/
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
 * @param {Object} [options.value] controllers <b>value</b> or <b>innerHTML</b>.
 * @param {Function} [options.onchange] callback function is called if user has changed the controllers <b>value</b>.
 */
export function createController( settings, controllerId, name, options ) {

	if ( !settings ) return;

	//controller

	if ( typeof settings.controller === "string" ) settings.controller = document.getElementById( settings.controller );
	if ( !settings.controller ) {

		var controller = document.getElementById( controllerId );
		if ( !controller ) {

			controller = document.createElement( options.elementName ? options.elementName : 'input' );
			document.querySelector( 'body' ).appendChild( controller );

		}
		settings.controller = controller;

	}
	if ( options.value !== undefined ) {

		if( settings.controller.value !== undefined )
			settings.controller.value = options.value;//input element type
		else settings.controller.innerHTML = options.value;//other element types. For example span

	}
	if ( ( options.onchange !== undefined ) && settings.controller.onchange === null )
		settings.controller.onchange = options.onchange;
	if ( ( options.title !== undefined ) && settings.controller.title === '' )
		settings.controller.title = options.title;

	//name

	if ( settings.elName === false )
		return;

	if ( typeof settings.elName === "string" )
		settings.elName = document.getElementById( settings.elName );
	var str = '';
	if ( !settings.elName ) {

		settings.elName = document.createElement( 'span' );
		settings.controller.parentElement.insertBefore( settings.elName, settings.controller );
		str = ' = ';

	}
	if ( settings.elName.innerHTML !== '' )
		return;
	settings.elName.innerHTML = name() + str;

}

