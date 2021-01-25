/**
 * @module functionsFolder
 * @description Adds the [Functions]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function} folder into [dat.gui]{@link https://github.com/anhr/dat.gui}.
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

import { dat } from './dat/dat.module.js';

/**
 * Adds the [Functions]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function} folder into [dat.gui]{@link https://github.com/anhr/dat.gui}.
 * @param {GUI} fParent parent folder for functions folder.
 * @param {Object} scales [AxesHelper]{@link https://raw.githack.com/anhr/AxesHelper/master/jsdoc/module-AxesHelper.html} options.scales for details.
 * @param {Function} onFinishChange callback function is called every time, when user have entered new value of the function and the function controller is lost of the focus.
 * <pre>
 * parameter value is new value of the function.
 * </pre>
 * @param {object} [options] the following options are available:
 * @param {Function} [options.getLanguageCode="en"] returns the "primary language" subtag of the version of the browser. Default returns "en" is English
 * @param {object} [options.vector] Vector with initial text of the function
 * @param {object} [options.vector.x] text of the x axis function
 * @param {object} [options.vector.y] text of the y axis function
 * @param {object} [options.vector.z] text of the z axis function
*/
const functionsFolder = function ( fParent, scales, onFinishChange, options = {} ) {

//	const _this = this;

	//Localization

	const getLanguageCode = options.getLanguageCode || function () { return 'en'; };

	const lang = {

		functions: 'Functions',

		defaultButton: 'Default',
		defaultTitle: 'Restore default functions.',

	};

	const _languageCode = getLanguageCode();

	switch ( _languageCode ) {

		case 'ru'://Russian language

			lang.functions = 'Функции';

			lang.defaultButton = 'Восстановить';
			lang.defaultTitle = 'Восстановить функции.';

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

	const fFunctions = fParent.addFolder( lang.functions ),
		vector = {

			x: options.vector ? getFuncText( options.vector.x ) : '',
			y: options.vector ? getFuncText( options.vector.y ) : '',
			z: options.vector ? getFuncText( options.vector.z ) : '',
			w: options.vector ? getFuncText( options.vector.w ) : '',

		},
		//onFinishChange вызывается даже если vector не изменился. Поэтому такой onFinishChange пропускается
		vectorCur = {

			x: vector.x,
			y: vector.y,
			z: vector.z,
			w: vector.w,

		},
		vectorDefault = {

			x: vector.x,
			y: vector.y,
			z: vector.z,
			w: vector.w,

		},
		cFunctions = { };
	function createControl( axisName ) {

		if ( vector[axisName] === undefined )
			return;
		cFunctions[axisName] = fFunctions.add( vector, axisName ).onFinishChange( function ( value ) {

			if ( vectorCur[axisName] === value )
				return;
			vectorCur[axisName] = value;
			var float = parseFloat( value );
			if ( float.toString() !== value ) float = NaN;
			var func;
			if ( isNaN(float) ) {

//				const color = value.replace(/\s/g, "").toLowerCase().split( /rgb\((\d+),(\d+),(\d+)\)/ );
				const color = value.replace(/\s/g, "").split( /rgb\((\d+),(\d+),(\d+)\)/ );
				if ( color.length === 5 ) func = new options.THREE.Color( value );
				else func = new Function( 't', 'a', 'b', 'return ' + value );

			} else func = float;
			onFinishChange( func, axisName );
//			onFinishChange( isNaN(float) ? new Function( 't', 'a', 'b', 'return ' + value ) : float, axisName );

		} );
		dat.controllerNameAndTitle( cFunctions[axisName], scales[axisName] && scales[axisName].name ? scales[axisName].name : axisName );

	}
	createControl( 'x' );
	createControl( 'y' );
	createControl( 'z' );
	createControl( 'w' );

	//Default scale button
	const buttonDefault = fFunctions.add( {

		defaultF: function ( value ) {

/*
			cFunctions.x.setValue( vectorDefault.x );
			cFunctions.y.setValue( vectorDefault.y );
			cFunctions.z.setValue( vectorDefault.z );
*/
			function setValue( axisName ) {

				cFunctions[axisName].setValue( vectorDefault[axisName] );
				cFunctions[axisName].__onFinishChange( vectorDefault[axisName] );

			}
			setValue( 'x' );
			setValue( 'y' );
			setValue( 'z' );
			setValue( 'w' );
/*
			_this.setFunction(vectorDefault);
			onFinishChange( vectorDefault.x, 'x' );
			onFinishChange( vectorDefault.y, 'y' );
			onFinishChange( vectorDefault.z, 'z' );
*/			

		},

	}, 'defaultF' );
	dat.controllerNameAndTitle( buttonDefault, lang.defaultButton, lang.defaultTitle );

	function getFuncText ( func ) {

		if ( func === undefined )
			return;
		if ( typeof func === 'object' ) {

			if ( func instanceof options.THREE.Color ) return func.getStyle();
			func = func.func ? func.func : func;

		}
		const typeofFunc = typeof func;
		switch ( typeofFunc ) {

			case 'number':
			case 'string':
				return func;
			case 'function':
				return func.toString().split( /return (.*)/ )[1];
			default: console.error( 'functionsFolder.getFuncText(...): typeof func = ' + typeofFunc );
				return;
		}
/*		
		const res = func.toString().split( /return (.*)/ )[1] || '';
		if ( res === '' )
			return func;
		return res;
*/		

	}
	/**
	 * set the function text
	 * @function functionsFolder.
	 * setFunction
	 * @param {object} _vector vector of the axis functions.
	 * @param {object} _vector.x x axis function.
	 * @param {object} _vector.y y axis function.
	 * @param {object} _vector.z z axis function.
	 * @param {boolean} boDefault true - copy from _vector to vectorDefault
	 */
	this.setFunction = function ( _vector, boDefault ) {

		function setVectorAxis( axisName ) {

			if ( !_vector[axisName] )
				return;
			vector[axisName] = getFuncText( _vector[axisName] );
			cFunctions[axisName].setValue( vector[axisName] );
			vectorCur[axisName] = vector[axisName];
			if ( boDefault )
				vectorDefault[axisName] = vector[axisName];

		}
		setVectorAxis( 'x' );
		setVectorAxis( 'y' );
		var dislay = false;
		if ( _vector.z ) {

			setVectorAxis( 'z' );
			dislay = true;

		}
		function dislayEl( controller, displayController ) {

			if ( controller === undefined )
				return;
			if ( typeof displayController === "boolean" )
				displayController = displayController ? 'block' : 'none';
			var el = controller.domElement;
			while ( el.tagName.toUpperCase() !== "LI" ) el = el.parentElement;
			el.style.display = displayController;

		}
		dislayEl( cFunctions.z, dislay );
		setVectorAxis( 'w' );

	}
	/**
	 * Display functions folder
	 * @function functionsFolder.
	 * displayFolder
	 * @param {string} display display is 'block' - functions folder is visible.
	 * <pre>
	 * 'none' - functions folder is hide.
	 * </pre>
	 */
	this.displayFolder = function ( display ) { fFunctions.domElement.style.display = display; }
	 /**
	 * set focus to controller
	 * @function functionsFolder.
	 * setFocus
	 * @param {string} axisName Name of the axis of the controller
	 */
	this.setFocus = function ( axisName ) { cFunctions[axisName].domElement.childNodes[0].focus(); }

}

export default functionsFolder;