/**
 * node.js version of the load JavaScript file
 * @author Andrej Hristoliubov https://anhr.github.io/AboutMe/
 *
 * Thanks to:
 *http://javascript.ru/forum/events/21439-dinamicheskaya-zagruzka-skriptov.html
 *https://learn.javascript.ru/onload-onerror
 *
 * @copyright 2011 Data Arts Team, Google Creative Lab
 *
 * @license under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */

//Please download https://github.com/anhr/loadFileNodeJS into ../loadFileNodeJS folder
import { sync as loadFileSync, escapeHtml } from '../loadFileNodeJS/index.js';

/**
 * @callback onerror
 * @param {string} str - error details
 */

/**
 * Synchronous load JavaScript file
 * @param {string} src URL of an external script file.
 * @param {Object} [options] followed options is available. Optional.
 * @param {Function} [options.onload] function () The onload event occurs when a script has been loaded. Optional.
 * @param {onerror} [options.onerror] function ( str ) The onerror event occurs when an error has been occured. Optional.
 * @param {string}[options.appendTo] The node to which the new script will be append. Optional. Default is head node
 * @param {Object|string}[options.tag] The script's tag attributes (Object) or tag type (string). Optional.
 * Available tag types:
 *	'style' - load a style file (.css extension)
 * @param {string} [options.tag.name] tag name. Default is 'script'
 * @param {Object} [options.tag.attribute] tag attribute. Optional.
 * @param {string} options.tag.attribute.name attribute name. Default is 'type'
 * @param {string} options.tag.attribute.value attribute value. Default is 'text/javascript'
 *
 * @example
 * 
	//Simplest example. Append script into head node.
	loadScript.sync( 'sync.js' );

 * @example
 * 
	//onload, onerror events. Append script into "appendto" element
	loadScript.sync( 'sync.js',
		{
			onload: function ( response ) {

				var str = 'file has been loaded successfully';
				console.log( str );

			},
			onerror: function ( str, e ) {

				elSync2Res.style.color = 'red';

			},
			appendTo: document.getElementById( "appendto" ),
		},
	);
 *
 * @example
 *
	//Append style into head node.
	loadScript.sync( "controls.css",
	{
		//style rel="stylesheet"
		tag: {

			name: 'style',
			attribute: {

				name: 'rel',
				value: 'stylesheet',

			}

		}

	} );

 */
function sync( src, options ) {

	options = options || {};
	options.onload = options.onload || function () { };
	options.onerror = options.onerror || function () { };
	options.appendTo = options.appendTo || document.getElementsByTagName( 'head' )[0];

	if ( isScriptExists( options.appendTo, src ) ) {

		//options.onerror( 'duplicate downloading of the ' + src + ' file' );
		options.onload();
		return;

	}

	if ( src instanceof Array ) {

		var error,
			optionsItem = {

				appendTo: options.appendTo,
				tag: options.tag,
				onload: function ( response, url ) {
				
					console.log( 'loadScript.sync.onload: ' + url );
				
				},
				onerror: function ( str ) {

					options.onerror( str );
					error = str;

				},

			};
		for ( var i = 0; i < src.length; i++ ) {

			var item = src[ i ];
			loadScriptBase( function ( script ) {

				script.setAttribute( "id", item );
				script.innerHTML = loadFileSync( item, optionsItem );

			}, optionsItem );
			if ( error !== undefined )
				break;

		};
		if ( error === undefined )
			options.onload();

	} else loadScriptBase( function ( script ) {

		script.setAttribute( "id", src );
		script.innerHTML = loadFileSync( src, options );

	}, options );

}

/**
 * @callback onerrorasync
 * @param {string} str - error details
 * @param {Object} e - event
 */

/**
 * Asynchronous load JavaScript file
 * @param {string|string[]} src URL of an external script file or array of the script file names.
 * @param {Object} [options] followed options is available. Optional.
 * @param {Function} [options.onload] function () The onload event occurs when a script has been loaded. Optional.
 * @param {onerrorasync} [options.onerror] function ( str, e ) The onerror event occurs when an error has been occured. Optional.
 * @param {string}[options.appendTo] The node to which the new script will be append. Optional. Default is head node
 * @param {Object}[options.tag] The script's tag attributes. Optional.
 * @param {string} options.tag.name tag name. Default is 'script'
 * @param {Object} [options.tag.attribute] tag attribute. Optional.
 * @param {string} options.tag.attribute.name attribute name. Default is 'type'
 * @param {string} options.tag.attribute.value attribute value. Default is 'text/javascript'
*
 * @example
 * 
	//Simplest example. Append script into head node.
	loadScript.async( "JavaScript.js);
 * 
 * @example
 *
	//onload, onerror events. Append script into "appendto" element
	loadScript.async( "JavaScript.js",
	{
 		onload: function () {
 
 			var str = 'file has been loaded successfully';
 			console.log( str );
 
 		},
 		onerror: function ( str, e ) {
 
 			console.error( str );
 
 		},
 		appendTo: document.getElementById( "appendto" ),
 
 	}
 
  );
 *
 * @example
 *
	//loading of array of JavaScript files. Append script into head node.
	loadScript.async( [
 		"JavaScript1.js",
 		"JavaScript2.js",
 	],
 	{
 		onload: function () {
 
 			var str = 'file has been loaded successfully';
 			console.log( str );
 
 		},
 		onerror: function ( str, e ) {
 
 			console.error( str );
 
 		},
 
 	}
 
  );
 */
function async( src, options ) {

	options = options || {};
	options.appendTo = options.appendTo || document.getElementsByTagName( 'head' )[ 0 ];
	options.onload = options.onload || function () {};

	var isrc;

	function async( srcAsync ) {

		function next() {

			if ( src instanceof Array && ( isrc < ( src.length - 1 ) ) ) {

				isrc++;
				async( src[isrc] );

			} else options.onload();

		}

		if ( isScriptExists( options.appendTo, srcAsync, options.onload ) ) {

			next();
			return;

		}

		loadScriptBase( function ( script ) {

			script.setAttribute( "id", srcAsync );

			function _onload() {

				console.log( 'loadScript.async.onload() ' + srcAsync );
				if ( options.onload !== undefined ) {

					next();
/*
					if ( src instanceof Array && ( isrc < ( src.length - 1 ) ) ) {

						isrc++;
						async( src[isrc] );

					} else options.onload();
*/

				}

			}

			if ( script.readyState && ! script.onload ) {

				// IE, Opera
				script.onreadystatechange = function () {

					if ( script.readyState == "complete" ) {

						// �� ������ �������� loaded
						if ( options.onload !== undefined ) options.onload(); // (2)

					}

					if ( script.readyState == "loaded" ) {

						setTimeout( options.onload, 0 ); // (1)

						// ������� ����������, ����� �� �������� �� complete
						this.onreadystatechange = null;

					}

				};

			} else {

				// Rest
				script.onload = _onload;

				script.onerror = function ( e ) {

					var str = 'loadScript: "' + this.src + '" failed';
					if ( options.onerror !== undefined )
						options.onerror( str, e );
					console.error( str );

				};

			}

			script.src = srcAsync;

		}, options );

	}

	if ( src instanceof Array ) {

		isrc = 0;
		async( src[ isrc ] );

	} else async( src );

}

function loadScriptBase( callback, options ) {

	options.tag = options.tag || {};
	if ( typeof options.tag === "string" ) {

		switch ( options.tag ) {

			case 'style':
				options.tag = {

					name: 'style',
					attribute: {

						name: 'rel',
						value: 'stylesheet',

					}

				}
				break;
			default: console.error( 'Invalid options.tag: ' + options.tag );
				return;
		}

	}

	options.tag.name = options.tag.name || 'script';
	var script = document.createElement( options.tag.name );

	options.tag.attribute = options.tag.attribute || {};
	options.tag.attribute.name = options.tag.attribute.name || "type";
	options.tag.attribute.value = options.tag.attribute.value || 'text/javascript';
	script.setAttribute( options.tag.attribute.name, options.tag.attribute.value );

	callback( script );
	options.appendTo.appendChild( script );

}

function isScriptExists( elParent, srcAsync, onload ) {

	var scripts = elParent.querySelectorAll( 'script' );
	for ( var i = 0; i < scripts.length; i++ ) {

		var child = scripts[i];
		if ( child.id === srcAsync ) {

/*
			if ( onload !== undefined )
				onload();
*/
			return true;

		}

	}
	return false;

}

export { async, sync, escapeHtml };
