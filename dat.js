/**
 * Modify of the dat object.
 * @see {@link https://github.com/dataarts/dat.gui} about dat.gui
 *
 * @author [Andrej Hristoliubov]{@link https://github.com/anhr}
 *
 * @copyright 2011 Data Arts Team, Google Creative Lab
 *
 * @license under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */

if ( typeof dat !== 'undefined' ) {

	//dat.GUI is included into current project
	//See https://github.com/dataarts/dat.gui/blob/master/API.md about dat.GUI API.

	function elNameAndTitle( el, name, title ) {

		if ( name === undefined )
			console.warn( 'elNameAndTitle: name = ' + name );
		el.innerHTML = name;
		if ( title !== undefined )
			el.title = title;

	}

	if ( dat.controllerNameAndTitle === undefined ) {

		dat.controllerNameAndTitle = function ( controller, name, title ) {

			elNameAndTitle( controller.__li.querySelector( ".property-name" ), name, title );

		};

	} else console.error( 'Duplicate dat.controllerNameAndTitle method.' );

	if ( dat.folderNameAndTitle === undefined ) {

		dat.folderNameAndTitle = function ( folder, name, title ) {

			elNameAndTitle( folder.__ul.querySelector( "li.title" ), name, title );

		};

	} else console.error( 'Duplicate dat.folderNameAndTitle method.' );

	if ( dat.controllerZeroStep === undefined ) {

		//Solving of dat.gui NumberController Step bug.
		//See https://github.com/dataarts/dat.gui/issues/48 for details.
		//
		//folder: GUI or folder for new Controller.
		//object: The object to be manipulated. See https://github.com/dataarts/dat.gui/blob/master/API.md#GUI+add for details
		//property: The name of the property to be manipulated. See https://github.com/dataarts/dat.gui/blob/master/API.md#GUI+add for details
		//onchange: Callback function will be called if controller value was changed. Can be undefined.
		//
		//Example of using
		/*
		var gui = new dat.GUI();
		var object = { min: 123.456 }
		dat.controllerZeroStep( gui, object, 'min', function ( value ) {

			console.log( 'object.min = ' + object.min + ' value = ' + value );

		} );
		*/
		dat.controllerZeroStep = function ( folder, object, property, onchange ) {

			var controller = folder.add( object, property ),
				input = controller.__input;
			controller.__input = document.createElement( 'input' );
			input.value = object[property];
			input.onchange = function ( value ) {

				object[property] = parseFloat( input.value );

				if ( onchange !== undefined )
					onchange( object[property] );

			};
			controller.setValue = function ( value ) {

				input.value = object[property] = value;

			};
			return controller;

		};

	} else console.error( 'Duplicate dat.controllerZeroStep method.' );

	if ( dat.controllerSetValue === undefined ) {

		//for resolving of the bug
		//Testing:
		//select Surface in the Examples drop down menu of the webgl_math.html page.
		//Click mouse over any point.
		//Now you can see number of selected line in the Select Line drop down menu
		//	and number of selected point in the Select Point drop down menu.
		//Select "no select" in the Select Line drop down menu.
		//Click mouse over any point again.
		//Now you can see a bug: You see "no select" instead of number of selected line in the Select Line drop down menu.
		dat.controllerSetValue = function ( controller, index ) {

			controller.setValue( index );
			controller.__li.querySelector( 'select' ).selectedIndex = index;

		};

	} else console.error( 'Duplicate dat.controllerSetValue method.' );

}
