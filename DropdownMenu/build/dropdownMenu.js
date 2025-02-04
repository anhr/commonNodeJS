/**
 * node.js version of the DropdownMenu
 *
 * @author Andrej Hristoliubov https://github.com/anhr/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.dropdownMenu = {}));
})(this, (function (exports) { 'use strict';

	/**
	 * node.js version of the download of the file.
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

	//The myRequest is cross-browser XMLHttpRequest wrapper.
	function myRequest( options ) {

		this.loadXMLDoc = function () {
			var req;

			if ( window.XMLHttpRequest ) {
				req = new XMLHttpRequest();
				if ( !req )
					throw "new XMLHttpRequest() failed!"
			}
			else if ( window.ActiveXObject ) {
				req = this.NewActiveXObject();
				if ( !req )
					throw "NewActiveXObject() failed!"
			}
			else throw "myRequest.loadXMLDoc(...) failed!";
			return req;
		};

		this.NewActiveXObject = function () {
			try { return new ActiveXObject( "Msxml2.XMLHTTP.6.0" ); }
			catch ( e ) { }
			try { return new ActiveXObject( "Msxml2.XMLHTTP.3.0" ); }
			catch ( e ) { }
			try { return new ActiveXObject( "Msxml2.XMLHTTP" ); }
			catch ( e ) { }
			try { return new ActiveXObject( "Microsoft.XMLHTTP" ); }
			catch ( e ) { }
			ErrorMessage( 'This browser does not support XMLHttpRequest. Probably, your security settings do not allow Web sites to use ActiveX controls installed on your computer. Refresh your Web page to find out the current status of your Web page or enable the "Initialize and script ActiveX controls not marked as safe" and "Run Active X controls and plug-ins" of the Security settings of the Internet zone of your browser.' );
			return null;
		};

		this.XMLHttpRequestStart = function ( onreadystatechange, async ) {

			this.XMLHttpRequestStop();//For compatibility with IE Windows Phone

			this.req.onreadystatechange = onreadystatechange;

			//ATTENTION!!! do not works in IE
			if ( "onerror" in this.req ) {
				this.req.onerror = function ( event ) {
					ErrorMessage( "XMLHttpRequest error. url: " + this.url);
				};
			}

			this.XMLHttpRequestReStart( async );
		};

		this.getUrl = function () {
			
			if ( ( typeof this.url == 'undefined' ) || ( this.url == null ) ) {

				//непонятно зачем это засунул
	//			this.url = "XMLHttpRequest.xml";
				
				ErrorMessage( 'XMLHttpRequest: Invalid url: ' + this.url );
				
			}
			return this.url + ( this.params ? this.params : "" );
			
		};

		this.XMLHttpRequestReStart = function ( async ) {
			try {
				if ( typeof async == 'undefined' )
					async = true;
				this.req.open( "GET", this.getUrl(), async );
				if ( async ) {
					var timeout = ( 60 + 30 ) * 1000;//Внимание!!! Задержка должна быть больше CSocketWaitEvent::WaitResponse
					if ( "timeout" in this.req )//for IE6
						this.req.timeout = timeout;
					if ( "ontimeout" in this.req )
						this.req.ontimeout = function () {
							ErrorMessage( 'XMLHttpRequest timeout', false, false );
						};
					else {//for Safari, IE6
						clearTimeout( this.timeout_id_SendReq );
						this.timeout_id_SendReq = setTimeout( function () {
							ErrorMessage( 'XMLHttpRequest timeout 2', false, false );
						}
							, timeout );
						//console.log("setTimeout this.req.timeout_id_SendReq = " + this.req.timeout_id_SendReq);
					}
				}
				this.req.send( null );
			} catch ( e ) {
				ErrorMessage( e.message + " url: " + this.url);
			}
		};

		this.XMLHttpRequestStop = function () {
			//console.log("XMLHttpRequestStop(...)");
			if ( this.req == null )
				return;
			this.req.abort();
		};

		this.ProcessReqChange = function ( processStatus200 ) {
			var req = this.req;
			if ( ( typeof isIE === 'undefined' ) || !isIE ) ;
			// only if req shows "complete"
			//http://www.w3schools.com/ajax/ajax_xmlhttprequest_onreadystatechange.asp
			//http://xmlhttprequest.ru/w3c
			switch ( req.readyState ) {
				case 4://request finished and response is ready
					{
						if ( typeof req.status == "unknown" ) {//IE5 timeout
							consoleError( 'typeof XMLHttpRequest status == "unknown"' );
							return true;
						}
						//Я не могу вставлять switch один в другой
						if ( req.status == 200 )//OK)
						{
							clearTimeout( this.timeout_id_SendReq );
							return processStatus200( this );
						}//200://OK
						else {
							ErrorMessage( "Invalid XMLHttpRequest status : " + req.status + " url: " + this.url );
						}
					}
					break;
				case 1://server connection established
				case 2://request received
				case 3://processing request
					break;
				//		case 404:
				case 0://request not initialized
				default:
					throw "processReqChange(); req.readyState = " + req.readyState;
			}//switch(req.readyState)
			return true;
		};

		this.processStatus200Error = function () {
			var error = this.GetElementText( 'error', true );
			if ( error ) {
				ErrorMessage( error );
				return true;
			}
			return false;
		};

		this.GetElementText = function ( tagName, noDisplayErrorMessage ) {
			var xmlhttp = this.req;
			if ( !xmlhttp.responseXML ) {
				if ( noDisplayErrorMessage != true )
					ErrorMessage( 'GetXMLElementText(xmlhttp, ' + tagName + '); xmlhttp.responseXML is null.\nxmlhttp.responseText:\n' + xmlhttp.responseText );
				return null;
			}
			var element = xmlhttp.responseXML.getElementsByTagName( tagName );

			//ATTENTION!!! For IE set the content-type m_HttpResponse.SetContentType("text/xml");

			if ( element.length == 0 ) {
				if ( noDisplayErrorMessage != true )
					ErrorMessage( 'GetXMLElementText(xmlhttp, "' + tagName + '"); element.length == ' + element.length );
				return "";
			}
			var text = "";
			for ( var i = 0; i < element.length; i++ ) {
				if ( typeof ( element[i].textContent ) == 'undefined' ) {
					if ( typeof ( element[i].text ) == 'undefined' ) {
						ErrorMessage( 'GetXMLElementText(xmlhttp, ' + tagName + '); element[' + i + '].text) == undefined' );
						return '';
					}
					if ( text != "" )
						text += " ";
					text += element[i].text;//IE
				}
				else text += element[i].textContent;//Chrome
			}
			return text;
		};

		if ( options.data ) {
			this.req = options.data.req;
			this.url = options.data.url;
			this.params = options.data.params;
		} else {
			try {
				this.req = this.loadXMLDoc();
			} catch ( e ) {
				var message;
				if ( typeof e.message == 'undefined' )
					message = e;
				else message = e.message;
				ErrorMessage( "Your browser is too old and is not compatible with our site.\n\n"
					+ window.navigator.appName + " " + window.navigator.appVersion + "\n\n" + message );
				return;
			}
		}
		if ( !this.req ) {
			consoleError( "Invalid myRequest.req: " + this.req );
			return;
		}

		function ErrorMessage( error ) {

			console.error( error );
			options.onerror( error );

		}

	}

	/**
	 * @callback onerror
	 * @param {string} str - error details
	 */

	/**
	 * Load file synchronously
	 * @param {string} url URL of an external file.
	 * @param {Object} [options] the following options are available.
	 * @param {Function} [options.onload] function () The onload event occurs when a script has been loaded.
	 * @param {onerror} [options.onerror] function ( str ) The onerror event occurs when an error has been occured.
	 * @param {boolean} [options.async=false] true - load file asynchronously. You can use <b>async</b> method instead.
	 * @returns {string} file content
	 * @example
	 * 
		//Simplest example.
		document.getElementById( "elID" ).innerHTML = loadFile.sync('element.html');
	 *
	 * @example
	 *
		//onload, onerror events.
		document.getElementById( "elID").innerHTML = loadFile.sync( 'element.html',
		{
			onload: function ( response ) {

				var str = 'file has been loaded successfully';
				console.log( str );

			},
			onerror: function ( str, e ) {

				console.error( str );

			},
		}, );
	 */
	function sync$1( url, options ) {

		options = options || {};
		if (options.async === true) console.warn('Load file asynchronously is deprecated. Please use fetch.');
		options.onload = options.onload || function () { };
		options.onerror = options.onerror || function () { };

		var response,
			request = new myRequest( options );
		request.url = url;
		request.XMLHttpRequestStart(

			function () {//onreadystatechange

				request.ProcessReqChange( function ( myRequest ) {//processStatus200

					if ( myRequest.processStatus200Error() )
						return;
					response = myRequest.req.responseText;
					//console.log( 'loadFile.sync.onload() ' + url );
					options.onload( response, url );
					return;

				} );

			}
			, options.async === undefined ? false : true//Synchronous mode

		);
		//console.log( 'sync(' + url + ')' );
		return response;

	}

	/**
	 * display a text to HTML
	 * @param {string} str source text
	 * @returns {string} escaped text
	 */
	function escapeHtml( str ) {

		return str.replace( /[&<>"'\/]/g, function ( s ) {

			var entityMap = {

				"&": "&amp;",
				"<": "&lt;",
				">": "&gt;",
				'"': '&quot;',
				"'": '&#39;',
				"/": '&#x2F;'

			};

			return entityMap[s];

		} );
	}

	/**
	 * node.js version of the load JavaScript file
	 * @author [Andrej Hristoliubov]{@link https://github.com/anhr}
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

	/**
	 * @callback onerror
	 * @param {string} str - error details
	 */

	/**
	 * Synchronous load JavaScript file
	 * @param {string} src URL of an external script file.
	 * @param {Object} [options] the following options are available.
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
					script.innerHTML = sync$1( item, optionsItem );

				}, optionsItem );
				if ( error !== undefined )
					break;

			}		if ( error === undefined )
				options.onload();

		} else loadScriptBase( function ( script ) {

			script.setAttribute( "id", src );
			script.innerHTML = sync$1( src, options );

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
	 * @param {Object} [options] the following options are available.
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

					}

				}

				if ( script.readyState && ! script.onload ) {

					// IE, Opera
					script.onreadystatechange = function () {

						if ( script.readyState == "complete" ) {

							if ( options.onload !== undefined ) options.onload();

						}

						if ( script.readyState == "loaded" ) {

							setTimeout( options.onload, 0 );

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

					};
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

				return true;

			}

		}
		return false;

	}

	/**
	 * node.js version of download of the scripts.
	 * 
	 * @author [Andrej Hristoliubov]{@link https://github.com/anhr}
	 *
	 * Copyright 2011 Data Arts Team, Google Creative Lab
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 */

	var loadScript = {

		sync: sync,
		async: async,
		escapeHtml: escapeHtml,

	};

	/**
	 * @module DropdownMenu
	 * @description Creates a drop down menu in your javaScript code.
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

	var optionsStyle = {

		//style rel="stylesheet"
		tag: 'style'

	};

	//Thanks to https://stackoverflow.com/a/27369985/5175935
	//Такая же функция есть в frustumPoints.js но если ее использовать то она будет возвращать путь на frustumPoints.js
	const getCurrentScript = function () {

		if ( document.currentScript && ( document.currentScript.src !== '' ) )
			return document.currentScript.src;
		const scripts = document.getElementsByTagName( 'script' ),
			str = scripts[scripts.length - 1].src;
		if ( str !== '' )
			return src;
		//Thanks to https://stackoverflow.com/a/42594856/5175935
		return new Error().stack.match( /(https?:[^:]*)/ )[0];

	};
	//Thanks to https://stackoverflow.com/a/27369985/5175935
	const getCurrentScriptPath = function () {
		const script = getCurrentScript(),
			path = script.substring( 0, script.lastIndexOf( '/' ) );
		return path;
	};
	//console.warn( 'getCurrentScriptPath = ' + getCurrentScriptPath() );
	var currentScriptPath = getCurrentScriptPath();
	//Для D:\My documents\MyProjects\webgl\three.js\GitHub\commonNodeJS\master\DropdownMenu\build
	var arrayPath = currentScriptPath.split( /(.*)(\/build)/ );
	if ( arrayPath[2] === '/build' ) currentScriptPath = arrayPath[1];
	//Для D:\My documents\MyProjects\webgl\three.js\GitHub\commonNodeJS\master\canvasMenu\build
	arrayPath = currentScriptPath.split( /(.*)(\/canvasMenu)/ );
	if ( arrayPath[2] === '/canvasMenu' ) currentScriptPath = arrayPath[1] + '/DropdownMenu';

	//Attention! Load menu.css file before other css files for correctly priority of the styles
	loadScript.sync( currentScriptPath + '/styles/menu.css', optionsStyle );//move dat.gui into canvas
	loadScript.sync( currentScriptPath + '/styles/gui.css', optionsStyle );//move dat.gui into canvas
	loadScript.sync( currentScriptPath + '/styles/Decorations/transparent.css', optionsStyle );
	loadScript.sync( currentScriptPath + '/styles/Decorations/gradient.css', optionsStyle );

	/**
	 * Creates new menu
	 * @param {Array} arrayMenu array of menu and submenu items. If array item is string then menu item name. If array item is object then options of the new menu item:
	 * @param {String|HTMLElement} [arrayMenu.name] if string then menu item name. If HTMLElement then item element.
	 * @param {String} [arrayMenu.title] menu item title.
	 * @param {String} [arrayMenu.id] menu item identifier.
	 * @param {String} [arrayMenu.style] menu item style. Example: "float: right;".
	 * @param {Array} [arrayMenu.items] array of submenu items. Same as menu item.
	 * @param {Function} [arrayMenu.onclick] <b>function(event)</b> called when user has clicked a menu item. event - event details.
	 * @param {Object} [arrayMenu.drop] direction of drop of the submenu.
	 * <pre>
	 * Following directions is available:
	 * If string then "up" - drop submenu to up. "left" - shift submenu to left.
	 * If object then following members is available:
	 * </pre>
	 * @param {boolean} [arrayMenu.drop.up] true - drop submenu to up.
	 * @param {boolean} [arrayMenu.drop.left] true - shift submenu to left.
	 * @param {boolean} [arrayMenu.radio] true - defines a radio menu item.
	 * @param {boolean} [arrayMenu.checkbox] true - defines a checkbox menu item.
	 * @param {boolean} [arrayMenu.checked] true - checked state of a checkbox or radio menu item.
	 *
	 * @param {Object} [options] the following options are available.
	 * @param {HTMLElement} [options.elParent="body" element] Parent element of new menu.
	 * @param {HTMLElement} [options.canvas] <b>canvas</b> element. Use if you want put a menu inside a canvas. Use [CanvasMenu]{@link https://github.com/anhr/commonNodeJS/tree/master/canvasMenu} instead <b>DropdownMenu</b> for it.
	 * @param {String} [options.decorations] You can decorate your menu by a built-in style or use your custom style. Currently two built-in styles is available:
	 * <pre>
	 * 'Gradient' - use [gradient.css]{@link https://raw.githack.com/anhr/commonNodeJS/master/DropdownMenu/styles/Decorations/gradient.css} file for decoration.
	 * 'Transparent' - use [transparent.css]{@link https://raw.githack.com/anhr/commonNodeJS/master/DropdownMenu/styles/Decorations/transparent.css} file for decoration.
	 * Custom decoration:
	 * 'Custom' please edit the [custom.css]{@link https://raw.githack.com/anhr/commonNodeJS/master/DropdownMenu/Examples/html/custom.css} file from my example if you want a custom decoration of your menu.
	 * <pre>
	 */
	function create( arrayMenu, options ) {

		options = options || {};
		options.elParent = options.elParent || document.querySelector( 'body' );
		switch ( options.decorations ) {

			case 'Gradient':
			case 'Transparent':
			case 'Custom':
			case undefined:
				break;
			default: console.error( 'DropdownMenu.create: Invalid options.decorations: ' + options.decorations );
		}

		//create menu element
		var elMenu = document.createElement( 'menu' );
		if ( options.elParent.classList.contains( "container" ) )
			elMenu.className = 'controls';

		var timeoutControls;
		function displayControls() {

			elMenu.style.opacity = 1;
			clearTimeout( timeoutControls );
			timeoutControls = setTimeout( function () {

				elMenu.style.opacity = 0;

			}, 5000 );

		}
		if ( options.canvas ) {

			elMenu.style.opacity = 0;
			options.canvas.onmouseout = function ( event ) {

				elMenu.style.opacity = 0;

			};
			options.canvas.onmousemove = function ( event ) {

				displayControls();

			};
			elMenu.onmousemove = function ( event ) {

				displayControls();

			};

		}
		options.elParent.appendChild( elMenu );

		arrayMenu.forEach( function ( menuItem ) {

			var dropdownChild = 'dropdown-child';
			function moveUpLeft( drop ) {

				setTimeout( function () {

					var display = elDropdownChild.style.display;
					elDropdownChild.style.display = 'block';
					if ( drop.up )
						elDropdownChild.style.top = '-' + ( elDropdownChild.offsetHeight ) + 'px';
					else elDropdownChild.style.top = ( elMenuButton.offsetHeight -1 ) + 'px';
					if ( drop.left )
						elDropdownChild.style.left = ( elMenuButton.offsetWidth - elDropdownChild.offsetWidth ) + 'px';
					elDropdownChild.style.display = display;

				}, 0 );

			}


			//Create menuButton class element
			var elMenuButton = document.createElement( 'span' );
			elMenuButton.className =
				'menuButton' + ( options.decorations === undefined ? '' : ' menuButton' + options.decorations );

			if ( menuItem.style !== undefined )
				elMenuButton.style.cssText = menuItem.style;

			if ( menuItem.radio !== undefined )
				elMenuButton.style.cssText = menuItem.style;

			if ( menuItem.onclick !== undefined )
				elMenuButton.onclick = menuItem.onclick;
			if ( menuItem.id !== undefined )
				elMenuButton.id = menuItem.id;

			var name;
			if ( typeof menuItem === 'string' )
				name = menuItem;
			else {

				name = menuItem.name;

				if ( menuItem.id )
					elMenuButton.id = menuItem.id;
				if ( menuItem.title )
					elMenuButton.title = menuItem.title;

			}

			//Create name span
			switch ( typeof name ) {
				case "object":
					elMenuButton.appendChild( name );
					break;
				case "string":
				case "undefined":
					elMenuButton.innerHTML = name;
					break;
				default: console.error( 'Invalid typeof name: ' + typeof name );
			}

			//Create dropdown-child items
			if ( menuItem.items ) {

				var elDropdownChild = document.createElement( 'span' );
				elDropdownChild.className = dropdownChild + ' ' + dropdownChild + ( options.decorations === undefined ? 'Default' : options.decorations );
				elDropdownChild.title = '';
				elMenuButton.appendChild( elDropdownChild );

				//for compatibility with firefox
	//			getMenuButtonBorderWidth();

				menuItem.items.forEach( function ( itemItem ) {

					//Create name span
					var elName = document.createElement( 'nobr' ),
						classChecked = 'checked';
					function getItemName(item) {

						const str = typeof item === 'string' ?
							item :
								item.radio === true ?
								( item.checked ? '◉' : '◎' ) + ' ' + item.name
								: item.checkbox === true ? ( item.checked ? '☑' : '☐' ) + ' ' + item.name : item.name;//✓🗹
						//console.log(str);
						return str;

					}
					function getElementFromEvent( event ) {
						if ( !event ) event = window.event;//for IE6
						return event.target || event.srcElement;
					}
					if ( typeof itemItem === 'string' )
						;
					else {

						itemItem.name;
						elName.onclick = function ( event ) {

							if ( itemItem.radio === true ) {

								menuItem.items.forEach( function ( item ) {

									if ( item.radio === true ) {

										if ( getElementFromEvent( event ) === item.elName ) {

											item.checked = true;
											item.elName.classList.add( classChecked );

										} else {

											item.checked = false;
											item.elName.classList.remove( classChecked );

										}
										item.elName.innerHTML = getItemName( item );

									}

								} );

							} else if ( itemItem.checkbox === true ) {

								if ( itemItem.checked === true ) {

									itemItem.elName.classList.add( classChecked );

								} else {

									itemItem.elName.classList.remove( classChecked );

								}
								itemItem.checked = !itemItem.checked;
								itemItem.elName.innerHTML = getItemName( itemItem );

							}
							if ( itemItem.onclick )
								itemItem.onclick( event );
								
						};

					}
					if ( itemItem.radio === true )
						elName.classList.add( 'radio' );
					if ( itemItem.checkbox === true )
						elName.classList.add( 'checkbox' );
					if ( itemItem.id )
						elName.id = itemItem.id;
					if ( itemItem.title )
						elName.title = itemItem.title;
					elName.innerHTML = getItemName( itemItem );

					if ( itemItem.checked === true )
						elName.classList.add( classChecked );

					elDropdownChild.appendChild( elName );
					if ( typeof itemItem !== "string")
						itemItem.elName = elName;

				} );

				if ( typeof menuItem.drop === 'object' ) {

					moveUpLeft( menuItem.drop );

				} else {

					switch ( menuItem.drop ) {

						case 'up':
							moveUpLeft( {

								up: true,

							} );
							break;
						case 'left':
							moveUpLeft( {

								left: true,

							} );
							break;
						case undefined:
							setTimeout( function () {

								elDropdownChild.style.left = '-' + elMenuButton.clientWidth + 'px';
								elDropdownChild.style.top = ( elMenuButton.offsetHeight - 1 ) + 'px';

							}, 0 );
							break;
						default: console.error( 'Invalid menuItem.drop: ' + menuItem.drop );

					}

				}

			}

			elMenu.appendChild( elMenuButton );

		} );
		return elMenu;

	}

	/**
	 * @module DropdownMenu
	 * @description Creates a drop down menu in your javaScript code.
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
	/**
	 * Creates a drop down menu in your javaScript code.
	 */
	var DropdownMenu = {

	    create: create,

	};

	exports["default"] = DropdownMenu;

	Object.defineProperty(exports, '__esModule', { value: true });

}));
