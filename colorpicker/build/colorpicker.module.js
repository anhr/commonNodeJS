/**
 * ColorPicker - pure JavaScript color picker.
 *
 * @author Andrej Hristoliubov https://github.com/anhr
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */

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
 * three class for [THREE]{@link https://github.com/anhr/three.js} and [dat.GUI(...)]{@link https://github.com/anhr/dat.gui} variables.
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

/*если импортировать THREE, то при "npm run build" получу ошибку
 * (babel plugin) ReferenceError: Unknown plugin "external-helpers" specified in "base" at 1, attempted to resolve relative to 
//import * as THREE from 'https://threejs.org/build/three.module.js';
//import * as THREE from '../../../../../three.js/dev/build/three.module.min.js';
//import * as THREE from '../../three.js/dev/build/three.module.js';
//import * as THREE from '../../three.js/dev/src/Three.js';
//import * as THREE from 'https://raw.githack.com/anhr/three.js/dev/build/three.module.js';
//import * as THREE from 'https://raw.githack.com/anhr/three.js/dev/build/three.module.min.js';
*/

var _THREE, _dat, _Three;

class Three {

	/**
	 * class for [THREE]{@link https://github.com/anhr/three.js} and [dat]{@link https://github.com/dataarts/dat.gui} instances.
	 * */
	constructor() {}
	/**
	 * set [THREE]{@link https://github.com/anhr/three.js}
	 */
	set THREE( THREE ) {

		if ( _THREE ) {

			if ( !Object.is( THREE, _THREE ) )
				console.error( 'three: duplicate THREE. Please use one instance of the THREE library.' );
			return;

		}
		_THREE = THREE;
		_Three = this;

		const //BufferGeometry = THREE.BufferGeometry,
			Float32BufferAttribute = THREE.Float32BufferAttribute,
			Line3 = THREE.Line3,
			Plane = THREE.Plane,
			Triangle = THREE.Triangle,
			Vector3 = THREE.Vector3;

		function ConvexHull() {

			const Visible = 0;
			const Deleted = 1;

			const _v1 = new Vector3();
			const _line3 = new Line3();
			const _plane = new Plane();
			const _closestPoint = new Vector3();
			const _triangle = new Triangle();

			class ConvexHull {

				constructor() {

					this.tolerance = - 1;

					this.faces = []; // the generated faces of the convex hull
					this.newFaces = []; // this array holds the faces that are generated within a single iteration

					// the vertex lists work as follows:
					//
					// let 'a' and 'b' be 'Face' instances
					// let 'v' be points wrapped as instance of 'Vertex'
					//
					//     [v, v, ..., v, v, v, ...]
					//      ^             ^
					//      |             |
					//  a.outside     b.outside
					//
					this.assigned = new VertexList();
					this.unassigned = new VertexList();

					this.vertices = []; 	// vertices of the hull (internal representation of given geometry data)

				}

				setFromPoints( points ) {

					if ( Array.isArray( points ) !== true ) {

						console.error( 'THREE.ConvexHull: Points parameter is not an array.' );

					}

					if ( points.length < 4 ) {

						console.error( 'THREE.ConvexHull: The algorithm needs at least four points.' );

					}

					this.makeEmpty();

					for ( let i = 0, l = points.length; i < l; i++ ) {

						this.vertices.push( new VertexNode( points[i] ) );

					}

					this.compute();

					return this;

				}

				setFromObject( object ) {

					const points = [];

					object.updateMatrixWorld( true );

					object.traverse( function ( node ) {

						const geometry = node.geometry;

						if ( geometry !== undefined ) {

							if ( geometry.isGeometry ) {

								console.error( 'THREE.ConvexHull no longer supports Geometry. Use THREE.BufferGeometry instead.' );
								return;

							} else if ( geometry.isBufferGeometry ) {

								const attribute = geometry.attributes.position;

								if ( attribute !== undefined ) {

									for ( let i = 0, l = attribute.count; i < l; i++ ) {

										const point = new Vector3();

										point.fromBufferAttribute( attribute, i ).applyMatrix4( node.matrixWorld );

										points.push( point );

									}

								}

							}

						}

					} );

					return this.setFromPoints( points );

				}

				containsPoint( point ) {

					const faces = this.faces;

					for ( let i = 0, l = faces.length; i < l; i++ ) {

						const face = faces[i];

						// compute signed distance and check on what half space the point lies

						if ( face.distanceToPoint( point ) > this.tolerance ) return false;

					}

					return true;

				}

				intersectRay( ray, target ) {

					// based on "Fast Ray-Convex Polyhedron Intersection"  by Eric Haines, GRAPHICS GEMS II

					const faces = this.faces;

					let tNear = - Infinity;
					let tFar = Infinity;

					for ( let i = 0, l = faces.length; i < l; i++ ) {

						const face = faces[i];

						// interpret faces as planes for the further computation

						const vN = face.distanceToPoint( ray.origin );
						const vD = face.normal.dot( ray.direction );

						// if the origin is on the positive side of a plane (so the plane can "see" the origin) and
						// the ray is turned away or parallel to the plane, there is no intersection

						if ( vN > 0 && vD >= 0 ) return null;

						// compute the distance from the ray’s origin to the intersection with the plane

						const t = ( vD !== 0 ) ? ( - vN / vD ) : 0;

						// only proceed if the distance is positive. a negative distance means the intersection point
						// lies "behind" the origin

						if ( t <= 0 ) continue;

						// now categorized plane as front-facing or back-facing

						if ( vD > 0 ) {

							//  plane faces away from the ray, so this plane is a back-face

							tFar = Math.min( t, tFar );

						} else {

							// front-face

							tNear = Math.max( t, tNear );

						}

						if ( tNear > tFar ) {

							// if tNear ever is greater than tFar, the ray must miss the convex hull

							return null;

						}

					}

					// evaluate intersection point

					// always try tNear first since its the closer intersection point

					if ( tNear !== - Infinity ) {

						ray.at( tNear, target );

					} else {

						ray.at( tFar, target );

					}

					return target;

				}

				intersectsRay( ray ) {

					return this.intersectRay( ray, _v1 ) !== null;

				}

				makeEmpty() {

					this.faces = [];
					this.vertices = [];

					return this;

				}

				// Adds a vertex to the 'assigned' list of vertices and assigns it to the given face

				addVertexToFace( vertex, face ) {

					vertex.face = face;

					if ( face.outside === null ) {

						this.assigned.append( vertex );

					} else {

						this.assigned.insertBefore( face.outside, vertex );

					}

					face.outside = vertex;

					return this;

				}

				// Removes a vertex from the 'assigned' list of vertices and from the given face

				removeVertexFromFace( vertex, face ) {

					if ( vertex === face.outside ) {

						// fix face.outside link

						if ( vertex.next !== null && vertex.next.face === face ) {

							// face has at least 2 outside vertices, move the 'outside' reference

							face.outside = vertex.next;

						} else {

							// vertex was the only outside vertex that face had

							face.outside = null;

						}

					}

					this.assigned.remove( vertex );

					return this;

				}

				// Removes all the visible vertices that a given face is able to see which are stored in the 'assigned' vertext list

				removeAllVerticesFromFace( face ) {

					if ( face.outside !== null ) {

						// reference to the first and last vertex of this face

						const start = face.outside;
						let end = face.outside;

						while ( end.next !== null && end.next.face === face ) {

							end = end.next;

						}

						this.assigned.removeSubList( start, end );

						// fix references

						start.prev = end.next = null;
						face.outside = null;

						return start;

					}

				}

				// Removes all the visible vertices that 'face' is able to see

				deleteFaceVertices( face, absorbingFace ) {

					const faceVertices = this.removeAllVerticesFromFace( face );

					if ( faceVertices !== undefined ) {

						if ( absorbingFace === undefined ) {

							// mark the vertices to be reassigned to some other face

							this.unassigned.appendChain( faceVertices );


						} else {

							// if there's an absorbing face try to assign as many vertices as possible to it

							let vertex = faceVertices;

							do {

								// we need to buffer the subsequent vertex at this point because the 'vertex.next' reference
								// will be changed by upcoming method calls

								const nextVertex = vertex.next;

								const distance = absorbingFace.distanceToPoint( vertex.point );

								// check if 'vertex' is able to see 'absorbingFace'

								if ( distance > this.tolerance ) {

									this.addVertexToFace( vertex, absorbingFace );

								} else {

									this.unassigned.append( vertex );

								}

								// now assign next vertex

								vertex = nextVertex;

							} while ( vertex !== null );

						}

					}

					return this;

				}

				// Reassigns as many vertices as possible from the unassigned list to the new faces

				resolveUnassignedPoints( newFaces ) {

					if ( this.unassigned.isEmpty() === false ) {

						let vertex = this.unassigned.first();

						do {

							// buffer 'next' reference, see .deleteFaceVertices()

							const nextVertex = vertex.next;

							let maxDistance = this.tolerance;

							let maxFace = null;

							for ( let i = 0; i < newFaces.length; i++ ) {

								const face = newFaces[i];

								if ( face.mark === Visible ) {

									const distance = face.distanceToPoint( vertex.point );

									if ( distance > maxDistance ) {

										maxDistance = distance;
										maxFace = face;

									}

									if ( maxDistance > 1000 * this.tolerance ) break;

								}

							}

							// 'maxFace' can be null e.g. if there are identical vertices

							if ( maxFace !== null ) {

								this.addVertexToFace( vertex, maxFace );

							}

							vertex = nextVertex;

						} while ( vertex !== null );

					}

					return this;

				}

				// Computes the extremes of a simplex which will be the initial hull

				computeExtremes() {

					const min = new Vector3();
					const max = new Vector3();

					const minVertices = [];
					const maxVertices = [];

					// initially assume that the first vertex is the min/max

					for ( let i = 0; i < 3; i++ ) {

						minVertices[i] = maxVertices[i] = this.vertices[0];

					}

					min.copy( this.vertices[0].point );
					max.copy( this.vertices[0].point );

					// compute the min/max vertex on all six directions

					for ( let i = 0, l = this.vertices.length; i < l; i++ ) {

						const vertex = this.vertices[i];
						const point = vertex.point;

						// update the min coordinates

						for ( let j = 0; j < 3; j++ ) {

							if ( point.getComponent( j ) < min.getComponent( j ) ) {

								min.setComponent( j, point.getComponent( j ) );
								minVertices[j] = vertex;

							}

						}

						// update the max coordinates

						for ( let j = 0; j < 3; j++ ) {

							if ( point.getComponent( j ) > max.getComponent( j ) ) {

								max.setComponent( j, point.getComponent( j ) );
								maxVertices[j] = vertex;

							}

						}

					}

					// use min/max vectors to compute an optimal epsilon

					this.tolerance = 3 * Number.EPSILON * (
						Math.max( Math.abs( min.x ), Math.abs( max.x ) ) +
						Math.max( Math.abs( min.y ), Math.abs( max.y ) ) +
						Math.max( Math.abs( min.z ), Math.abs( max.z ) )
					);

					return { min: minVertices, max: maxVertices };

				}

				// Computes the initial simplex assigning to its faces all the points
				// that are candidates to form part of the hull

				computeInitialHull() {

					const vertices = this.vertices;
					const extremes = this.computeExtremes();
					const min = extremes.min;
					const max = extremes.max;

					// 1. Find the two vertices 'v0' and 'v1' with the greatest 1d separation
					// (max.x - min.x)
					// (max.y - min.y)
					// (max.z - min.z)

					let maxDistance = 0;
					let index = 0;

					for ( let i = 0; i < 3; i++ ) {

						const distance = max[i].point.getComponent( i ) - min[i].point.getComponent( i );

						if ( distance > maxDistance ) {

							maxDistance = distance;
							index = i;

						}

					}

					const v0 = min[index];
					const v1 = max[index];
					let v2;
					let v3;

					// 2. The next vertex 'v2' is the one farthest to the line formed by 'v0' and 'v1'

					maxDistance = 0;
					_line3.set( v0.point, v1.point );

					for ( let i = 0, l = this.vertices.length; i < l; i++ ) {

						const vertex = vertices[i];

						if ( vertex !== v0 && vertex !== v1 ) {

							_line3.closestPointToPoint( vertex.point, true, _closestPoint );

							const distance = _closestPoint.distanceToSquared( vertex.point );

							if ( distance > maxDistance ) {

								maxDistance = distance;
								v2 = vertex;

							}

						}

					}

					// 3. The next vertex 'v3' is the one farthest to the plane 'v0', 'v1', 'v2'

					maxDistance = - 1;
					_plane.setFromCoplanarPoints( v0.point, v1.point, v2.point );

					for ( let i = 0, l = this.vertices.length; i < l; i++ ) {

						const vertex = vertices[i];

						if ( vertex !== v0 && vertex !== v1 && vertex !== v2 ) {

							const distance = Math.abs( _plane.distanceToPoint( vertex.point ) );

							if ( distance > maxDistance ) {

								maxDistance = distance;
								v3 = vertex;

							}

						}

					}

					const faces = [];

					if ( _plane.distanceToPoint( v3.point ) < 0 ) {

						// the face is not able to see the point so 'plane.normal' is pointing outside the tetrahedron

						faces.push(
							Face.create( v0, v1, v2 ),
							Face.create( v3, v1, v0 ),
							Face.create( v3, v2, v1 ),
							Face.create( v3, v0, v2 )
						);

						// set the twin edge

						for ( let i = 0; i < 3; i++ ) {

							const j = ( i + 1 ) % 3;

							// join face[ i ] i > 0, with the first face

							faces[i + 1].getEdge( 2 ).setTwin( faces[0].getEdge( j ) );

							// join face[ i ] with face[ i + 1 ], 1 <= i <= 3

							faces[i + 1].getEdge( 1 ).setTwin( faces[j + 1].getEdge( 0 ) );

						}

					} else {

						// the face is able to see the point so 'plane.normal' is pointing inside the tetrahedron

						faces.push(
							Face.create( v0, v2, v1 ),
							Face.create( v3, v0, v1 ),
							Face.create( v3, v1, v2 ),
							Face.create( v3, v2, v0 )
						);

						// set the twin edge

						for ( let i = 0; i < 3; i++ ) {

							const j = ( i + 1 ) % 3;

							// join face[ i ] i > 0, with the first face

							faces[i + 1].getEdge( 2 ).setTwin( faces[0].getEdge( ( 3 - i ) % 3 ) );

							// join face[ i ] with face[ i + 1 ]

							faces[i + 1].getEdge( 0 ).setTwin( faces[j + 1].getEdge( 1 ) );

						}

					}

					// the initial hull is the tetrahedron

					for ( let i = 0; i < 4; i++ ) {

						this.faces.push( faces[i] );

					}

					// initial assignment of vertices to the faces of the tetrahedron

					for ( let i = 0, l = vertices.length; i < l; i++ ) {

						const vertex = vertices[i];

						if ( vertex !== v0 && vertex !== v1 && vertex !== v2 && vertex !== v3 ) {

							maxDistance = this.tolerance;
							let maxFace = null;

							for ( let j = 0; j < 4; j++ ) {

								const distance = this.faces[j].distanceToPoint( vertex.point );

								if ( distance > maxDistance ) {

									maxDistance = distance;
									maxFace = this.faces[j];

								}

							}

							if ( maxFace !== null ) {

								this.addVertexToFace( vertex, maxFace );

							}

						}

					}

					return this;

				}

				// Removes inactive faces

				reindexFaces() {

					const activeFaces = [];

					for ( let i = 0; i < this.faces.length; i++ ) {

						const face = this.faces[i];

						if ( face.mark === Visible ) {

							activeFaces.push( face );

						}

					}

					this.faces = activeFaces;

					return this;

				}

				// Finds the next vertex to create faces with the current hull

				nextVertexToAdd() {

					// if the 'assigned' list of vertices is empty, no vertices are left. return with 'undefined'

					if ( this.assigned.isEmpty() === false ) {

						let eyeVertex, maxDistance = 0;

						// grap the first available face and start with the first visible vertex of that face

						const eyeFace = this.assigned.first().face;
						let vertex = eyeFace.outside;

						// now calculate the farthest vertex that face can see

						do {

							const distance = eyeFace.distanceToPoint( vertex.point );

							if ( distance > maxDistance ) {

								maxDistance = distance;
								eyeVertex = vertex;

							}

							vertex = vertex.next;

						} while ( vertex !== null && vertex.face === eyeFace );

						return eyeVertex;

					}

				}

				// Computes a chain of half edges in CCW order called the 'horizon'.
				// For an edge to be part of the horizon it must join a face that can see
				// 'eyePoint' and a face that cannot see 'eyePoint'.

				computeHorizon( eyePoint, crossEdge, face, horizon ) {

					// moves face's vertices to the 'unassigned' vertex list

					this.deleteFaceVertices( face );

					face.mark = Deleted;

					let edge;

					if ( crossEdge === null ) {

						edge = crossEdge = face.getEdge( 0 );

					} else {

						// start from the next edge since 'crossEdge' was already analyzed
						// (actually 'crossEdge.twin' was the edge who called this method recursively)

						edge = crossEdge.next;

					}

					do {

						const twinEdge = edge.twin;
						const oppositeFace = twinEdge.face;

						if ( oppositeFace.mark === Visible ) {

							if ( oppositeFace.distanceToPoint( eyePoint ) > this.tolerance ) {

								// the opposite face can see the vertex, so proceed with next edge

								this.computeHorizon( eyePoint, twinEdge, oppositeFace, horizon );

							} else {

								// the opposite face can't see the vertex, so this edge is part of the horizon

								horizon.push( edge );

							}

						}

						edge = edge.next;

					} while ( edge !== crossEdge );

					return this;

				}

				// Creates a face with the vertices 'eyeVertex.point', 'horizonEdge.tail' and 'horizonEdge.head' in CCW order

				addAdjoiningFace( eyeVertex, horizonEdge ) {

					// all the half edges are created in ccw order thus the face is always pointing outside the hull

					const face = Face.create( eyeVertex, horizonEdge.tail(), horizonEdge.head() );

					this.faces.push( face );

					// join face.getEdge( - 1 ) with the horizon's opposite edge face.getEdge( - 1 ) = face.getEdge( 2 )

					face.getEdge( - 1 ).setTwin( horizonEdge.twin );

					return face.getEdge( 0 ); // the half edge whose vertex is the eyeVertex


				}

				//  Adds 'horizon.length' faces to the hull, each face will be linked with the
				//  horizon opposite face and the face on the left/right

				addNewFaces( eyeVertex, horizon ) {

					this.newFaces = [];

					let firstSideEdge = null;
					let previousSideEdge = null;

					for ( let i = 0; i < horizon.length; i++ ) {

						const horizonEdge = horizon[i];

						// returns the right side edge

						const sideEdge = this.addAdjoiningFace( eyeVertex, horizonEdge );

						if ( firstSideEdge === null ) {

							firstSideEdge = sideEdge;

						} else {

							// joins face.getEdge( 1 ) with previousFace.getEdge( 0 )

							sideEdge.next.setTwin( previousSideEdge );

						}

						this.newFaces.push( sideEdge.face );
						previousSideEdge = sideEdge;

					}

					// perform final join of new faces

					firstSideEdge.next.setTwin( previousSideEdge );

					return this;

				}

				// Adds a vertex to the hull

				addVertexToHull( eyeVertex ) {

					const horizon = [];

					this.unassigned.clear();

					// remove 'eyeVertex' from 'eyeVertex.face' so that it can't be added to the 'unassigned' vertex list

					this.removeVertexFromFace( eyeVertex, eyeVertex.face );

					this.computeHorizon( eyeVertex.point, null, eyeVertex.face, horizon );

					this.addNewFaces( eyeVertex, horizon );

					// reassign 'unassigned' vertices to the new faces

					this.resolveUnassignedPoints( this.newFaces );

					return this;

				}

				cleanup() {

					this.assigned.clear();
					this.unassigned.clear();
					this.newFaces = [];

					return this;

				}

				compute() {

					let vertex;

					this.computeInitialHull();

					// add all available vertices gradually to the hull

					while ( ( vertex = this.nextVertexToAdd() ) !== undefined ) {

						this.addVertexToHull( vertex );

					}

					this.reindexFaces();

					this.cleanup();

					return this;

				}

			}
			this.ConvexHull = ConvexHull;

			//

			class Face {

				constructor() {

					this.normal = new Vector3();
					this.midpoint = new Vector3();
					this.area = 0;

					this.constant = 0; // signed distance from face to the origin
					this.outside = null; // reference to a vertex in a vertex list this face can see
					this.mark = Visible;
					this.edge = null;

				}

				static create( a, b, c ) {

					const face = new Face();

					const e0 = new HalfEdge( a, face );
					const e1 = new HalfEdge( b, face );
					const e2 = new HalfEdge( c, face );

					// join edges

					e0.next = e2.prev = e1;
					e1.next = e0.prev = e2;
					e2.next = e1.prev = e0;

					// main half edge reference

					face.edge = e0;

					return face.compute();

				}

				getEdge( i ) {

					let edge = this.edge;

					while ( i > 0 ) {

						edge = edge.next;
						i--;

					}

					while ( i < 0 ) {

						edge = edge.prev;
						i++;

					}

					return edge;

				}

				compute() {

					const a = this.edge.tail();
					const b = this.edge.head();
					const c = this.edge.next.head();

					_triangle.set( a.point, b.point, c.point );

					_triangle.getNormal( this.normal );
					_triangle.getMidpoint( this.midpoint );
					this.area = _triangle.getArea();

					this.constant = this.normal.dot( this.midpoint );

					return this;

				}

				distanceToPoint( point ) {

					return this.normal.dot( point ) - this.constant;

				}

			}

			// Entity for a Doubly-Connected Edge List (DCEL).

			class HalfEdge {


				constructor( vertex, face ) {

					this.vertex = vertex;
					this.prev = null;
					this.next = null;
					this.twin = null;
					this.face = face;

				}

				head() {

					return this.vertex;

				}

				tail() {

					return this.prev ? this.prev.vertex : null;

				}

				length() {

					const head = this.head();
					const tail = this.tail();

					if ( tail !== null ) {

						return tail.point.distanceTo( head.point );

					}

					return - 1;

				}

				lengthSquared() {

					const head = this.head();
					const tail = this.tail();

					if ( tail !== null ) {

						return tail.point.distanceToSquared( head.point );

					}

					return - 1;

				}

				setTwin( edge ) {

					this.twin = edge;
					edge.twin = this;

					return this;

				}

			}

			// A vertex as a double linked list node.

			class VertexNode {

				constructor( point ) {

					this.point = point;
					this.prev = null;
					this.next = null;
					this.face = null; // the face that is able to see this vertex

				}

			}

			// A double linked list that contains vertex nodes.

			class VertexList {

				constructor() {

					this.head = null;
					this.tail = null;

				}

				first() {

					return this.head;

				}

				last() {

					return this.tail;

				}

				clear() {

					this.head = this.tail = null;

					return this;

				}

				// Inserts a vertex before the target vertex

				insertBefore( target, vertex ) {

					vertex.prev = target.prev;
					vertex.next = target;

					if ( vertex.prev === null ) {

						this.head = vertex;

					} else {

						vertex.prev.next = vertex;

					}

					target.prev = vertex;

					return this;

				}

				// Inserts a vertex after the target vertex

				insertAfter( target, vertex ) {

					vertex.prev = target;
					vertex.next = target.next;

					if ( vertex.next === null ) {

						this.tail = vertex;

					} else {

						vertex.next.prev = vertex;

					}

					target.next = vertex;

					return this;

				}

				// Appends a vertex to the end of the linked list

				append( vertex ) {

					if ( this.head === null ) {

						this.head = vertex;

					} else {

						this.tail.next = vertex;

					}

					vertex.prev = this.tail;
					vertex.next = null; // the tail has no subsequent vertex

					this.tail = vertex;

					return this;

				}

				// Appends a chain of vertices where 'vertex' is the head.

				appendChain( vertex ) {

					if ( this.head === null ) {

						this.head = vertex;

					} else {

						this.tail.next = vertex;

					}

					vertex.prev = this.tail;

					// ensure that the 'tail' reference points to the last vertex of the chain

					while ( vertex.next !== null ) {

						vertex = vertex.next;

					}

					this.tail = vertex;

					return this;

				}

				// Removes a vertex from the linked list

				remove( vertex ) {

					if ( vertex.prev === null ) {

						this.head = vertex.next;

					} else {

						vertex.prev.next = vertex.next;

					}

					if ( vertex.next === null ) {

						this.tail = vertex.prev;

					} else {

						vertex.next.prev = vertex.prev;

					}

					return this;

				}

				// Removes a list of vertices whose 'head' is 'a' and whose 'tail' is b

				removeSubList( a, b ) {

					if ( a.prev === null ) {

						this.head = b.next;

					} else {

						a.prev.next = b.next;

					}

					if ( b.next === null ) {

						this.tail = a.prev;

					} else {

						b.next.prev = a.prev;

					}

					return this;

				}

				isEmpty() {

					return this.head === null;

				}

			}

		}
		this.ConvexHull = new ConvexHull().ConvexHull;

/*
		import { Vector3 } from '../math/Vector3.js';
		import { Vector2 } from '../math/Vector2.js';
		import { Box3 } from '../math/Box3.js';
		import { EventDispatcher } from './EventDispatcher.js';
		import { BufferAttribute, Float32BufferAttribute, Uint16BufferAttribute, Uint32BufferAttribute } from './BufferAttribute.js';
		import { Sphere } from '../math/Sphere.js';
		import { Object3D } from './Object3D.js';
		import { Matrix4 } from '../math/Matrix4.js';
		import { Matrix3 } from '../math/Matrix3.js';
		import * as MathUtils from '../math/MathUtils.js';
		import { arrayMax } from '../utils.js';
*/
		const Vector2 = three.THREE.Vector2,
			Box3 = three.THREE.Box3,

			BufferAttribute = three.THREE.BufferAttribute,
			Uint16BufferAttribute = three.THREE.Uint16BufferAttribute,
			Uint32BufferAttribute = three.THREE.Uint32BufferAttribute,

			Sphere = three.THREE.Sphere,
			Object3D = three.THREE.Object3D,
			Matrix4 = three.THREE.Matrix4,
			Matrix3 = three.THREE.Matrix3,
			arrayMax = three.THREE.arrayMax,
			MathUtils = three.THREE.MathUtils;

		/**
		 * https://github.com/mrdoob/eventdispatcher.js/
		 */

		class EventDispatcher {

			addEventListener( type, listener ) {

				if ( this._listeners === undefined ) this._listeners = {};

				const listeners = this._listeners;

				if ( listeners[type] === undefined ) {

					listeners[type] = [];

				}

				if ( listeners[type].indexOf( listener ) === - 1 ) {

					listeners[type].push( listener );

				}

			}

			hasEventListener( type, listener ) {

				if ( this._listeners === undefined ) return false;

				const listeners = this._listeners;

				return listeners[type] !== undefined && listeners[type].indexOf( listener ) !== - 1;

			}

			removeEventListener( type, listener ) {

				if ( this._listeners === undefined ) return;

				const listeners = this._listeners;
				const listenerArray = listeners[type];

				if ( listenerArray !== undefined ) {

					const index = listenerArray.indexOf( listener );

					if ( index !== - 1 ) {

						listenerArray.splice( index, 1 );

					}

				}

			}

			dispatchEvent( event ) {

				if ( this._listeners === undefined ) return;

				const listeners = this._listeners;
				const listenerArray = listeners[event.type];

				if ( listenerArray !== undefined ) {

					event.target = this;

					// Make a copy, in case listeners are removed while iterating.
					const array = listenerArray.slice( 0 );

					for ( let i = 0, l = array.length; i < l; i++ ) {

						array[i].call( this, event );

					}

					event.target = null;

				}

			}

		}

		let _id = 0;

		const _m1 = /*@__PURE__*/ new Matrix4();
		const _obj = /*@__PURE__*/ new Object3D();
		const _offset = /*@__PURE__*/ new Vector3();
		const _box = /*@__PURE__*/ new Box3();
		const _boxMorphTargets = /*@__PURE__*/ new Box3();
		const _vector = /*@__PURE__*/ new Vector3();

		//Не могу брать BufferGeometry из three.THREE потому что тогда получу ошибку
		//Uncaught TypeError: Class constructor BufferGeometry cannot be invoked without 'new'
		//если буду использовать библиотеку 'myThree/build/myThree.module.js'
		class BufferGeometry extends EventDispatcher {

			constructor() {

				super();

				Object.defineProperty( this, 'id', { value: _id++ } );

				this.uuid = MathUtils.generateUUID();

				this.name = '';
				this.type = 'BufferGeometry';

				this.index = null;
				this.attributes = {};

				this.morphAttributes = {};
				this.morphTargetsRelative = false;

				this.groups = [];

				this.boundingBox = null;
				this.boundingSphere = null;

				this.drawRange = { start: 0, count: Infinity };

				this.userData = {};

			}

			getIndex() {

				return this.index;

			}

			setIndex( index ) {

				if ( Array.isArray( index ) ) {

					this.index = new ( arrayMax( index ) > 65535 ? Uint32BufferAttribute : Uint16BufferAttribute )( index, 1 );

				} else {

					this.index = index;

				}

				return this;

			}

			getAttribute( name ) {

				return this.attributes[name];

			}

			setAttribute( name, attribute ) {

				this.attributes[name] = attribute;

				return this;

			}

			deleteAttribute( name ) {

				delete this.attributes[name];

				return this;

			}

			hasAttribute( name ) {

				return this.attributes[name] !== undefined;

			}

			addGroup( start, count, materialIndex = 0 ) {

				this.groups.push( {

					start: start,
					count: count,
					materialIndex: materialIndex

				} );

			}

			clearGroups() {

				this.groups = [];

			}

			setDrawRange( start, count ) {

				this.drawRange.start = start;
				this.drawRange.count = count;

			}

			applyMatrix4( matrix ) {

				const position = this.attributes.position;

				if ( position !== undefined ) {

					position.applyMatrix4( matrix );

					position.needsUpdate = true;

				}

				const normal = this.attributes.normal;

				if ( normal !== undefined ) {

					const normalMatrix = new Matrix3().getNormalMatrix( matrix );

					normal.applyNormalMatrix( normalMatrix );

					normal.needsUpdate = true;

				}

				const tangent = this.attributes.tangent;

				if ( tangent !== undefined ) {

					tangent.transformDirection( matrix );

					tangent.needsUpdate = true;

				}

				if ( this.boundingBox !== null ) {

					this.computeBoundingBox();

				}

				if ( this.boundingSphere !== null ) {

					this.computeBoundingSphere();

				}

				return this;

			}

			applyQuaternion( q ) {

				_m1.makeRotationFromQuaternion( q );

				this.applyMatrix4( _m1 );

				return this;

			}

			rotateX( angle ) {

				// rotate geometry around world x-axis

				_m1.makeRotationX( angle );

				this.applyMatrix4( _m1 );

				return this;

			}

			rotateY( angle ) {

				// rotate geometry around world y-axis

				_m1.makeRotationY( angle );

				this.applyMatrix4( _m1 );

				return this;

			}

			rotateZ( angle ) {

				// rotate geometry around world z-axis

				_m1.makeRotationZ( angle );

				this.applyMatrix4( _m1 );

				return this;

			}

			translate( x, y, z ) {

				// translate geometry

				_m1.makeTranslation( x, y, z );

				this.applyMatrix4( _m1 );

				return this;

			}

			scale( x, y, z ) {

				// scale geometry

				_m1.makeScale( x, y, z );

				this.applyMatrix4( _m1 );

				return this;

			}

			lookAt( vector ) {

				_obj.lookAt( vector );

				_obj.updateMatrix();

				this.applyMatrix4( _obj.matrix );

				return this;

			}

			center() {

				this.computeBoundingBox();

				this.boundingBox.getCenter( _offset ).negate();

				this.translate( _offset.x, _offset.y, _offset.z );

				return this;

			}

			setFromPoints( points ) {

				const position = [];

				for ( let i = 0, l = points.length; i < l; i++ ) {

					const point = points[i];
					position.push( point.x, point.y, point.z || 0 );

				}

				this.setAttribute( 'position', new Float32BufferAttribute( position, 3 ) );

				return this;

			}

			computeBoundingBox() {

				if ( this.boundingBox === null ) {

					this.boundingBox = new Box3();

				}

				const position = this.attributes.position;
				const morphAttributesPosition = this.morphAttributes.position;

				if ( position && position.isGLBufferAttribute ) {

					console.error( 'THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".', this );

					this.boundingBox.set(
						new Vector3( - Infinity, - Infinity, - Infinity ),
						new Vector3( + Infinity, + Infinity, + Infinity )
					);

					return;

				}

				if ( position !== undefined ) {

					this.boundingBox.setFromBufferAttribute( position );

					// process morph attributes if present

					if ( morphAttributesPosition ) {

						for ( let i = 0, il = morphAttributesPosition.length; i < il; i++ ) {

							const morphAttribute = morphAttributesPosition[i];
							_box.setFromBufferAttribute( morphAttribute );

							if ( this.morphTargetsRelative ) {

								_vector.addVectors( this.boundingBox.min, _box.min );
								this.boundingBox.expandByPoint( _vector );

								_vector.addVectors( this.boundingBox.max, _box.max );
								this.boundingBox.expandByPoint( _vector );

							} else {

								this.boundingBox.expandByPoint( _box.min );
								this.boundingBox.expandByPoint( _box.max );

							}

						}

					}

				} else {

					this.boundingBox.makeEmpty();

				}

				if ( isNaN( this.boundingBox.min.x ) || isNaN( this.boundingBox.min.y ) || isNaN( this.boundingBox.min.z ) ) {

					console.error( 'THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.', this );

				}

			}

			computeBoundingSphere() {

				if ( this.boundingSphere === null ) {

					this.boundingSphere = new Sphere();

				}

				const position = this.attributes.position;
				const morphAttributesPosition = this.morphAttributes.position;

				if ( position && position.isGLBufferAttribute ) {

					console.error( 'THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".', this );

					this.boundingSphere.set( new Vector3(), Infinity );

					return;

				}

				if ( position ) {

					// first, find the center of the bounding sphere

					const center = this.boundingSphere.center;

					_box.setFromBufferAttribute( position );

					// process morph attributes if present

					if ( morphAttributesPosition ) {

						for ( let i = 0, il = morphAttributesPosition.length; i < il; i++ ) {

							const morphAttribute = morphAttributesPosition[i];
							_boxMorphTargets.setFromBufferAttribute( morphAttribute );

							if ( this.morphTargetsRelative ) {

								_vector.addVectors( _box.min, _boxMorphTargets.min );
								_box.expandByPoint( _vector );

								_vector.addVectors( _box.max, _boxMorphTargets.max );
								_box.expandByPoint( _vector );

							} else {

								_box.expandByPoint( _boxMorphTargets.min );
								_box.expandByPoint( _boxMorphTargets.max );

							}

						}

					}

					_box.getCenter( center );

					// second, try to find a boundingSphere with a radius smaller than the
					// boundingSphere of the boundingBox: sqrt(3) smaller in the best case

					let maxRadiusSq = 0;

					for ( let i = 0, il = position.count; i < il; i++ ) {

						_vector.fromBufferAttribute( position, i );

						maxRadiusSq = Math.max( maxRadiusSq, center.distanceToSquared( _vector ) );

					}

					// process morph attributes if present

					if ( morphAttributesPosition ) {

						for ( let i = 0, il = morphAttributesPosition.length; i < il; i++ ) {

							const morphAttribute = morphAttributesPosition[i];
							const morphTargetsRelative = this.morphTargetsRelative;

							for ( let j = 0, jl = morphAttribute.count; j < jl; j++ ) {

								_vector.fromBufferAttribute( morphAttribute, j );

								if ( morphTargetsRelative ) {

									_offset.fromBufferAttribute( position, j );
									_vector.add( _offset );

								}

								maxRadiusSq = Math.max( maxRadiusSq, center.distanceToSquared( _vector ) );

							}

						}

					}

					this.boundingSphere.radius = Math.sqrt( maxRadiusSq );

					if ( isNaN( this.boundingSphere.radius ) ) {

						console.error( 'THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.', this );

					}

				}

			}

			computeTangents() {

				const index = this.index;
				const attributes = this.attributes;

				// based on http://www.terathon.com/code/tangent.html
				// (per vertex tangents)

				if ( index === null ||
					attributes.position === undefined ||
					attributes.normal === undefined ||
					attributes.uv === undefined ) {

					console.error( 'THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)' );
					return;

				}

				const indices = index.array;
				const positions = attributes.position.array;
				const normals = attributes.normal.array;
				const uvs = attributes.uv.array;

				const nVertices = positions.length / 3;

				if ( attributes.tangent === undefined ) {

					this.setAttribute( 'tangent', new BufferAttribute( new Float32Array( 4 * nVertices ), 4 ) );

				}

				const tangents = attributes.tangent.array;

				const tan1 = [], tan2 = [];

				for ( let i = 0; i < nVertices; i++ ) {

					tan1[i] = new Vector3();
					tan2[i] = new Vector3();

				}

				const vA = new Vector3(),
					vB = new Vector3(),
					vC = new Vector3(),

					uvA = new Vector2(),
					uvB = new Vector2(),
					uvC = new Vector2(),

					sdir = new Vector3(),
					tdir = new Vector3();

				function handleTriangle( a, b, c ) {

					vA.fromArray( positions, a * 3 );
					vB.fromArray( positions, b * 3 );
					vC.fromArray( positions, c * 3 );

					uvA.fromArray( uvs, a * 2 );
					uvB.fromArray( uvs, b * 2 );
					uvC.fromArray( uvs, c * 2 );

					vB.sub( vA );
					vC.sub( vA );

					uvB.sub( uvA );
					uvC.sub( uvA );

					const r = 1.0 / ( uvB.x * uvC.y - uvC.x * uvB.y );

					// silently ignore degenerate uv triangles having coincident or colinear vertices

					if ( !isFinite( r ) ) return;

					sdir.copy( vB ).multiplyScalar( uvC.y ).addScaledVector( vC, - uvB.y ).multiplyScalar( r );
					tdir.copy( vC ).multiplyScalar( uvB.x ).addScaledVector( vB, - uvC.x ).multiplyScalar( r );

					tan1[a].add( sdir );
					tan1[b].add( sdir );
					tan1[c].add( sdir );

					tan2[a].add( tdir );
					tan2[b].add( tdir );
					tan2[c].add( tdir );

				}

				let groups = this.groups;

				if ( groups.length === 0 ) {

					groups = [{
						start: 0,
						count: indices.length
					}];

				}

				for ( let i = 0, il = groups.length; i < il; ++i ) {

					const group = groups[i];

					const start = group.start;
					const count = group.count;

					for ( let j = start, jl = start + count; j < jl; j += 3 ) {

						handleTriangle(
							indices[j + 0],
							indices[j + 1],
							indices[j + 2]
						);

					}

				}

				const tmp = new Vector3(), tmp2 = new Vector3();
				const n = new Vector3(), n2 = new Vector3();

				function handleVertex( v ) {

					n.fromArray( normals, v * 3 );
					n2.copy( n );

					const t = tan1[v];

					// Gram-Schmidt orthogonalize

					tmp.copy( t );
					tmp.sub( n.multiplyScalar( n.dot( t ) ) ).normalize();

					// Calculate handedness

					tmp2.crossVectors( n2, t );
					const test = tmp2.dot( tan2[v] );
					const w = ( test < 0.0 ) ? - 1.0 : 1.0;

					tangents[v * 4] = tmp.x;
					tangents[v * 4 + 1] = tmp.y;
					tangents[v * 4 + 2] = tmp.z;
					tangents[v * 4 + 3] = w;

				}

				for ( let i = 0, il = groups.length; i < il; ++i ) {

					const group = groups[i];

					const start = group.start;
					const count = group.count;

					for ( let j = start, jl = start + count; j < jl; j += 3 ) {

						handleVertex( indices[j + 0] );
						handleVertex( indices[j + 1] );
						handleVertex( indices[j + 2] );

					}

				}

			}

			computeVertexNormals() {

				const index = this.index;
				const positionAttribute = this.getAttribute( 'position' );

				if ( positionAttribute !== undefined ) {

					let normalAttribute = this.getAttribute( 'normal' );

					if ( normalAttribute === undefined ) {

						normalAttribute = new BufferAttribute( new Float32Array( positionAttribute.count * 3 ), 3 );
						this.setAttribute( 'normal', normalAttribute );

					} else {

						// reset existing normals to zero

						for ( let i = 0, il = normalAttribute.count; i < il; i++ ) {

							normalAttribute.setXYZ( i, 0, 0, 0 );

						}

					}

					const pA = new Vector3(), pB = new Vector3(), pC = new Vector3();
					const nA = new Vector3(), nB = new Vector3(), nC = new Vector3();
					const cb = new Vector3(), ab = new Vector3();

					// indexed elements

					if ( index ) {

						for ( let i = 0, il = index.count; i < il; i += 3 ) {

							const vA = index.getX( i + 0 );
							const vB = index.getX( i + 1 );
							const vC = index.getX( i + 2 );

							pA.fromBufferAttribute( positionAttribute, vA );
							pB.fromBufferAttribute( positionAttribute, vB );
							pC.fromBufferAttribute( positionAttribute, vC );

							cb.subVectors( pC, pB );
							ab.subVectors( pA, pB );
							cb.cross( ab );

							nA.fromBufferAttribute( normalAttribute, vA );
							nB.fromBufferAttribute( normalAttribute, vB );
							nC.fromBufferAttribute( normalAttribute, vC );

							nA.add( cb );
							nB.add( cb );
							nC.add( cb );

							normalAttribute.setXYZ( vA, nA.x, nA.y, nA.z );
							normalAttribute.setXYZ( vB, nB.x, nB.y, nB.z );
							normalAttribute.setXYZ( vC, nC.x, nC.y, nC.z );

						}

					} else {

						// non-indexed elements (unconnected triangle soup)

						for ( let i = 0, il = positionAttribute.count; i < il; i += 3 ) {

							pA.fromBufferAttribute( positionAttribute, i + 0 );
							pB.fromBufferAttribute( positionAttribute, i + 1 );
							pC.fromBufferAttribute( positionAttribute, i + 2 );

							cb.subVectors( pC, pB );
							ab.subVectors( pA, pB );
							cb.cross( ab );

							normalAttribute.setXYZ( i + 0, cb.x, cb.y, cb.z );
							normalAttribute.setXYZ( i + 1, cb.x, cb.y, cb.z );
							normalAttribute.setXYZ( i + 2, cb.x, cb.y, cb.z );

						}

					}

					this.normalizeNormals();

					normalAttribute.needsUpdate = true;

				}

			}

			merge( geometry, offset ) {

				if ( !( geometry && geometry.isBufferGeometry ) ) {

					console.error( 'THREE.BufferGeometry.merge(): geometry not an instance of THREE.BufferGeometry.', geometry );
					return;

				}

				if ( offset === undefined ) {

					offset = 0;

					console.warn(
						'THREE.BufferGeometry.merge(): Overwriting original geometry, starting at offset=0. '
						+ 'Use BufferGeometryUtils.mergeBufferGeometries() for lossless merge.'
					);

				}

				const attributes = this.attributes;

				for ( const key in attributes ) {

					if ( geometry.attributes[key] === undefined ) continue;

					const attribute1 = attributes[key];
					const attributeArray1 = attribute1.array;

					const attribute2 = geometry.attributes[key];
					const attributeArray2 = attribute2.array;

					const attributeOffset = attribute2.itemSize * offset;
					const length = Math.min( attributeArray2.length, attributeArray1.length - attributeOffset );

					for ( let i = 0, j = attributeOffset; i < length; i++ , j++ ) {

						attributeArray1[j] = attributeArray2[i];

					}

				}

				return this;

			}

			normalizeNormals() {

				const normals = this.attributes.normal;

				for ( let i = 0, il = normals.count; i < il; i++ ) {

					_vector.fromBufferAttribute( normals, i );

					_vector.normalize();

					normals.setXYZ( i, _vector.x, _vector.y, _vector.z );

				}

			}

			toNonIndexed() {

				function convertBufferAttribute( attribute, indices ) {

					const array = attribute.array;
					const itemSize = attribute.itemSize;
					const normalized = attribute.normalized;

					const array2 = new array.constructor( indices.length * itemSize );

					let index = 0, index2 = 0;

					for ( let i = 0, l = indices.length; i < l; i++ ) {

						if ( attribute.isInterleavedBufferAttribute ) {

							index = indices[i] * attribute.data.stride + attribute.offset;

						} else {

							index = indices[i] * itemSize;

						}

						for ( let j = 0; j < itemSize; j++ ) {

							array2[index2++] = array[index++];

						}

					}

					return new BufferAttribute( array2, itemSize, normalized );

				}

				//

				if ( this.index === null ) {

					console.warn( 'THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed.' );
					return this;

				}

				const geometry2 = new BufferGeometry();

				const indices = this.index.array;
				const attributes = this.attributes;

				// attributes

				for ( const name in attributes ) {

					const attribute = attributes[name];

					const newAttribute = convertBufferAttribute( attribute, indices );

					geometry2.setAttribute( name, newAttribute );

				}

				// morph attributes

				const morphAttributes = this.morphAttributes;

				for ( const name in morphAttributes ) {

					const morphArray = [];
					const morphAttribute = morphAttributes[name]; // morphAttribute: array of Float32BufferAttributes

					for ( let i = 0, il = morphAttribute.length; i < il; i++ ) {

						const attribute = morphAttribute[i];

						const newAttribute = convertBufferAttribute( attribute, indices );

						morphArray.push( newAttribute );

					}

					geometry2.morphAttributes[name] = morphArray;

				}

				geometry2.morphTargetsRelative = this.morphTargetsRelative;

				// groups

				const groups = this.groups;

				for ( let i = 0, l = groups.length; i < l; i++ ) {

					const group = groups[i];
					geometry2.addGroup( group.start, group.count, group.materialIndex );

				}

				return geometry2;

			}

			toJSON() {

				const data = {
					metadata: {
						version: 4.5,
						type: 'BufferGeometry',
						generator: 'BufferGeometry.toJSON'
					}
				};

				// standard BufferGeometry serialization

				data.uuid = this.uuid;
				data.type = this.type;
				if ( this.name !== '' ) data.name = this.name;
				if ( Object.keys( this.userData ).length > 0 ) data.userData = this.userData;

				if ( this.parameters !== undefined ) {

					const parameters = this.parameters;

					for ( const key in parameters ) {

						if ( parameters[key] !== undefined ) data[key] = parameters[key];

					}

					return data;

				}

				// for simplicity the code assumes attributes are not shared across geometries, see #15811

				data.data = { attributes: {} };

				const index = this.index;

				if ( index !== null ) {

					data.data.index = {
						type: index.array.constructor.name,
						array: Array.prototype.slice.call( index.array )
					};

				}

				const attributes = this.attributes;

				for ( const key in attributes ) {

					const attribute = attributes[key];

					data.data.attributes[key] = attribute.toJSON( data.data );

				}

				const morphAttributes = {};
				let hasMorphAttributes = false;

				for ( const key in this.morphAttributes ) {

					const attributeArray = this.morphAttributes[key];

					const array = [];

					for ( let i = 0, il = attributeArray.length; i < il; i++ ) {

						const attribute = attributeArray[i];

						array.push( attribute.toJSON( data.data ) );

					}

					if ( array.length > 0 ) {

						morphAttributes[key] = array;

						hasMorphAttributes = true;

					}

				}

				if ( hasMorphAttributes ) {

					data.data.morphAttributes = morphAttributes;
					data.data.morphTargetsRelative = this.morphTargetsRelative;

				}

				const groups = this.groups;

				if ( groups.length > 0 ) {

					data.data.groups = JSON.parse( JSON.stringify( groups ) );

				}

				const boundingSphere = this.boundingSphere;

				if ( boundingSphere !== null ) {

					data.data.boundingSphere = {
						center: boundingSphere.center.toArray(),
						radius: boundingSphere.radius
					};

				}

				return data;

			}

			clone() {

				return new this.constructor().copy( this );

			}

			copy( source ) {

				// reset

				this.index = null;
				this.attributes = {};
				this.morphAttributes = {};
				this.groups = [];
				this.boundingBox = null;
				this.boundingSphere = null;

				// used for storing cloned, shared data

				const data = {};

				// name

				this.name = source.name;

				// index

				const index = source.index;

				if ( index !== null ) {

					this.setIndex( index.clone( data ) );

				}

				// attributes

				const attributes = source.attributes;

				for ( const name in attributes ) {

					const attribute = attributes[name];
					this.setAttribute( name, attribute.clone( data ) );

				}

				// morph attributes

				const morphAttributes = source.morphAttributes;

				for ( const name in morphAttributes ) {

					const array = [];
					const morphAttribute = morphAttributes[name]; // morphAttribute: array of Float32BufferAttributes

					for ( let i = 0, l = morphAttribute.length; i < l; i++ ) {

						array.push( morphAttribute[i].clone( data ) );

					}

					this.morphAttributes[name] = array;

				}

				this.morphTargetsRelative = source.morphTargetsRelative;

				// groups

				const groups = source.groups;

				for ( let i = 0, l = groups.length; i < l; i++ ) {

					const group = groups[i];
					this.addGroup( group.start, group.count, group.materialIndex );

				}

				// bounding box

				const boundingBox = source.boundingBox;

				if ( boundingBox !== null ) {

					this.boundingBox = boundingBox.clone();

				}

				// bounding sphere

				const boundingSphere = source.boundingSphere;

				if ( boundingSphere !== null ) {

					this.boundingSphere = boundingSphere.clone();

				}

				// draw range

				this.drawRange.start = source.drawRange.start;
				this.drawRange.count = source.drawRange.count;

				// user data

				this.userData = source.userData;

				// geometry generator parameters

				if ( source.parameters !== undefined ) this.parameters = Object.assign( {}, source.parameters );

				return this;

			}

			dispose() {

				this.dispatchEvent( { type: 'dispose' } );

			}

		}

		BufferGeometry.prototype.isBufferGeometry = true;
		/*
		import {
			BufferGeometry,
			Float32BufferAttribute
		} from '../../../build/three.module.js';
		*/
		//import { ConvexHull } from '../math/ConvexHull.js';
		//ConvexGeometry

		class ConvexGeometry extends BufferGeometry {

			constructor( points ) {

				super();

				// buffers

				const vertices = [];
				const normals = [];

				if ( ConvexHull === undefined ) {

					console.error( 'THREE.ConvexBufferGeometry: ConvexBufferGeometry relies on ConvexHull' );

				}

				const convexHull = new _Three.ConvexHull().setFromPoints( points );

				// generate vertices and normals

				const faces = convexHull.faces;

				for ( let i = 0; i < faces.length; i++ ) {

					const face = faces[i];
					let edge = face.edge;

					// we move along a doubly-connected edge list to access all face points (see HalfEdge docs)

					do {

						const point = edge.head().point;

						vertices.push( point.x, point.y, point.z );
						normals.push( face.normal.x, face.normal.y, face.normal.z );

						edge = edge.next;

					} while ( edge !== face.edge );

				}

				// build geometry

				this.setAttribute( 'position', new Float32BufferAttribute( vertices, 3 ) );
				this.setAttribute( 'normal', new Float32BufferAttribute( normals, 3 ) );

			}

		}
		this.ConvexGeometry = ConvexGeometry;

		const //EventDispatcher = three.THREE.EventDispatcher,
			MOUSE = three.THREE.MOUSE,
			Quaternion = three.THREE.Quaternion,
			Spherical = three.THREE.Spherical,
			TOUCH = three.THREE.TOUCH;
//			Vector2 = three.THREE.Vector2,
//			Vector3 = three.THREE.Vector3;

		// This set of controls performs orbiting, dollying (zooming), and panning.
		// Unlike TrackballControls, it maintains the "up" direction object.up (+Y by default).
		//
		//    Orbit - left mouse / touch: one-finger move
		//    Zoom - middle mouse, or mousewheel / touch: two-finger spread or squish
		//    Pan - right mouse, or left mouse + ctrl/meta/shiftKey, or arrow keys / touch: two-finger move

		const _changeEvent = { type: 'change' };
		const _startEvent = { type: 'start' };
		const _endEvent = { type: 'end' };

		class OrbitControls extends EventDispatcher {

			constructor( object, domElement ) {

				super();

				if ( domElement === undefined ) console.warn( 'THREE.OrbitControls: The second parameter "domElement" is now mandatory.' );
				if ( domElement === document ) console.error( 'THREE.OrbitControls: "document" should not be used as the target "domElement". Please use "renderer.domElement" instead.' );

				this.object = object;
				this.domElement = domElement;
				this.domElement.style.touchAction = 'none'; // disable touch scroll

				// Set to false to disable this control
				this.enabled = true;

				// "target" sets the location of focus, where the object orbits around
				this.target = new Vector3();

				// How far you can dolly in and out ( PerspectiveCamera only )
				this.minDistance = 0;
				this.maxDistance = Infinity;

				// How far you can zoom in and out ( OrthographicCamera only )
				this.minZoom = 0;
				this.maxZoom = Infinity;

				// How far you can orbit vertically, upper and lower limits.
				// Range is 0 to Math.PI radians.
				this.minPolarAngle = 0; // radians
				this.maxPolarAngle = Math.PI; // radians

				// How far you can orbit horizontally, upper and lower limits.
				// If set, the interval [ min, max ] must be a sub-interval of [ - 2 PI, 2 PI ], with ( max - min < 2 PI )
				this.minAzimuthAngle = - Infinity; // radians
				this.maxAzimuthAngle = Infinity; // radians

				// Set to true to enable damping (inertia)
				// If damping is enabled, you must call controls.update() in your animation loop
				this.enableDamping = false;
				this.dampingFactor = 0.05;

				// This option actually enables dollying in and out; left as "zoom" for backwards compatibility.
				// Set to false to disable zooming
				this.enableZoom = true;
				this.zoomSpeed = 1.0;

				// Set to false to disable rotating
				this.enableRotate = true;
				this.rotateSpeed = 1.0;

				// Set to false to disable panning
				this.enablePan = true;
				this.panSpeed = 1.0;
				this.screenSpacePanning = true; // if false, pan orthogonal to world-space direction camera.up
				this.keyPanSpeed = 7.0;	// pixels moved per arrow key push

				// Set to true to automatically rotate around the target
				// If auto-rotate is enabled, you must call controls.update() in your animation loop
				this.autoRotate = false;
				this.autoRotateSpeed = 2.0; // 30 seconds per orbit when fps is 60

				// The four arrow keys
				this.keys = { LEFT: 'ArrowLeft', UP: 'ArrowUp', RIGHT: 'ArrowRight', BOTTOM: 'ArrowDown' };

				// Mouse buttons
				this.mouseButtons = { LEFT: MOUSE.ROTATE, MIDDLE: MOUSE.DOLLY, RIGHT: MOUSE.PAN };

				// Touch fingers
				this.touches = { ONE: TOUCH.ROTATE, TWO: TOUCH.DOLLY_PAN };

				// for reset
				this.target0 = this.target.clone();
				this.position0 = this.object.position.clone();
				this.zoom0 = this.object.zoom;

				// the target DOM element for key events
				this._domElementKeyEvents = null;

				//
				// public methods
				//

				this.getPolarAngle = function () {

					return spherical.phi;

				};

				this.getAzimuthalAngle = function () {

					return spherical.theta;

				};

				this.getDistance = function () {

					return this.object.position.distanceTo( this.target );

				};

				this.listenToKeyEvents = function ( domElement ) {

					domElement.addEventListener( 'keydown', onKeyDown );
					this._domElementKeyEvents = domElement;

				};

				this.saveState = function () {

					scope.target0.copy( scope.target );
					scope.position0.copy( scope.object.position );
					scope.zoom0 = scope.object.zoom;

				};

				this.reset = function () {

					scope.target.copy( scope.target0 );
					scope.object.position.copy( scope.position0 );
					scope.object.zoom = scope.zoom0;

					scope.object.updateProjectionMatrix();
					scope.dispatchEvent( _changeEvent );

					scope.update();

					state = STATE.NONE;

				};

				// this method is exposed, but perhaps it would be better if we can make it private...
				this.update = function () {

					const offset = new Vector3();

					// so camera.up is the orbit axis
					const quat = new Quaternion().setFromUnitVectors( object.up, new Vector3( 0, 1, 0 ) );
					const quatInverse = quat.clone().invert();

					const lastPosition = new Vector3();
					const lastQuaternion = new Quaternion();

					const twoPI = 2 * Math.PI;

					return function update() {

						const position = scope.object.position;

						offset.copy( position ).sub( scope.target );

						// rotate offset to "y-axis-is-up" space
						offset.applyQuaternion( quat );

						// angle from z-axis around y-axis
						spherical.setFromVector3( offset );

						if ( scope.autoRotate && state === STATE.NONE ) {

							rotateLeft( getAutoRotationAngle() );

						}

						if ( scope.enableDamping ) {

							spherical.theta += sphericalDelta.theta * scope.dampingFactor;
							spherical.phi += sphericalDelta.phi * scope.dampingFactor;

						} else {

							spherical.theta += sphericalDelta.theta;
							spherical.phi += sphericalDelta.phi;

						}

						// restrict theta to be between desired limits

						let min = scope.minAzimuthAngle;
						let max = scope.maxAzimuthAngle;

						if ( isFinite( min ) && isFinite( max ) ) {

							if ( min < - Math.PI ) min += twoPI; else if ( min > Math.PI ) min -= twoPI;

							if ( max < - Math.PI ) max += twoPI; else if ( max > Math.PI ) max -= twoPI;

							if ( min <= max ) {

								spherical.theta = Math.max( min, Math.min( max, spherical.theta ) );

							} else {

								spherical.theta = ( spherical.theta > ( min + max ) / 2 ) ?
									Math.max( min, spherical.theta ) :
									Math.min( max, spherical.theta );

							}

						}

						// restrict phi to be between desired limits
						spherical.phi = Math.max( scope.minPolarAngle, Math.min( scope.maxPolarAngle, spherical.phi ) );

						spherical.makeSafe();


						spherical.radius *= scale;

						// restrict radius to be between desired limits
						spherical.radius = Math.max( scope.minDistance, Math.min( scope.maxDistance, spherical.radius ) );

						// move target to panned location

						if ( scope.enableDamping === true ) {

							scope.target.addScaledVector( panOffset, scope.dampingFactor );

						} else {

							scope.target.add( panOffset );

						}

						offset.setFromSpherical( spherical );

						// rotate offset back to "camera-up-vector-is-up" space
						offset.applyQuaternion( quatInverse );

						position.copy( scope.target ).add( offset );

						scope.object.lookAt( scope.target );

						if ( scope.enableDamping === true ) {

							sphericalDelta.theta *= ( 1 - scope.dampingFactor );
							sphericalDelta.phi *= ( 1 - scope.dampingFactor );

							panOffset.multiplyScalar( 1 - scope.dampingFactor );

						} else {

							sphericalDelta.set( 0, 0, 0 );

							panOffset.set( 0, 0, 0 );

						}

						scale = 1;

						// update condition is:
						// min(camera displacement, camera rotation in radians)^2 > EPS
						// using small-angle approximation cos(x/2) = 1 - x^2 / 8

						if ( zoomChanged ||
							lastPosition.distanceToSquared( scope.object.position ) > EPS ||
							8 * ( 1 - lastQuaternion.dot( scope.object.quaternion ) ) > EPS ) {

							scope.dispatchEvent( _changeEvent );

							lastPosition.copy( scope.object.position );
							lastQuaternion.copy( scope.object.quaternion );
							zoomChanged = false;

							return true;

						}

						return false;

					};

				}();

				this.dispose = function () {

					scope.domElement.removeEventListener( 'contextmenu', onContextMenu );

					scope.domElement.removeEventListener( 'pointerdown', onPointerDown );
					scope.domElement.removeEventListener( 'pointercancel', onPointerCancel );
					scope.domElement.removeEventListener( 'wheel', onMouseWheel );

					scope.domElement.removeEventListener( 'pointermove', onPointerMove );
					scope.domElement.removeEventListener( 'pointerup', onPointerUp );


					if ( scope._domElementKeyEvents !== null ) {

						scope._domElementKeyEvents.removeEventListener( 'keydown', onKeyDown );

					}

					//scope.dispatchEvent( { type: 'dispose' } ); // should this be added here?

				};

				//
				// internals
				//

				const scope = this;

				const STATE = {
					NONE: - 1,
					ROTATE: 0,
					DOLLY: 1,
					PAN: 2,
					TOUCH_ROTATE: 3,
					TOUCH_PAN: 4,
					TOUCH_DOLLY_PAN: 5,
					TOUCH_DOLLY_ROTATE: 6
				};

				let state = STATE.NONE;

				const EPS = 0.000001;

				// current position in spherical coordinates
				const spherical = new Spherical();
				const sphericalDelta = new Spherical();

				let scale = 1;
				const panOffset = new Vector3();
				let zoomChanged = false;

				const rotateStart = new Vector2();
				const rotateEnd = new Vector2();
				const rotateDelta = new Vector2();

				const panStart = new Vector2();
				const panEnd = new Vector2();
				const panDelta = new Vector2();

				const dollyStart = new Vector2();
				const dollyEnd = new Vector2();
				const dollyDelta = new Vector2();

				const pointers = [];
				const pointerPositions = {};

				function getAutoRotationAngle() {

					return 2 * Math.PI / 60 / 60 * scope.autoRotateSpeed;

				}

				function getZoomScale() {

					return Math.pow( 0.95, scope.zoomSpeed );

				}

				function rotateLeft( angle ) {

					sphericalDelta.theta -= angle;

				}

				function rotateUp( angle ) {

					sphericalDelta.phi -= angle;

				}

				const panLeft = function () {

					const v = new Vector3();

					return function panLeft( distance, objectMatrix ) {

						v.setFromMatrixColumn( objectMatrix, 0 ); // get X column of objectMatrix
						v.multiplyScalar( - distance );

						panOffset.add( v );

					};

				}();

				const panUp = function () {

					const v = new Vector3();

					return function panUp( distance, objectMatrix ) {

						if ( scope.screenSpacePanning === true ) {

							v.setFromMatrixColumn( objectMatrix, 1 );

						} else {

							v.setFromMatrixColumn( objectMatrix, 0 );
							v.crossVectors( scope.object.up, v );

						}

						v.multiplyScalar( distance );

						panOffset.add( v );

					};

				}();

				// deltaX and deltaY are in pixels; right and down are positive
				const pan = function () {

					const offset = new Vector3();

					return function pan( deltaX, deltaY ) {

						const element = scope.domElement;

						if ( scope.object.isPerspectiveCamera ) {

							// perspective
							const position = scope.object.position;
							offset.copy( position ).sub( scope.target );
							let targetDistance = offset.length();

							// half of the fov is center to top of screen
							targetDistance *= Math.tan( ( scope.object.fov / 2 ) * Math.PI / 180.0 );

							// we use only clientHeight here so aspect ratio does not distort speed
							panLeft( 2 * deltaX * targetDistance / element.clientHeight, scope.object.matrix );
							panUp( 2 * deltaY * targetDistance / element.clientHeight, scope.object.matrix );

						} else if ( scope.object.isOrthographicCamera ) {

							// orthographic
							panLeft( deltaX * ( scope.object.right - scope.object.left ) / scope.object.zoom / element.clientWidth, scope.object.matrix );
							panUp( deltaY * ( scope.object.top - scope.object.bottom ) / scope.object.zoom / element.clientHeight, scope.object.matrix );

						} else {

							// camera neither orthographic nor perspective
							console.warn( 'WARNING: OrbitControls encountered an unknown camera type - pan disabled.' );
							scope.enablePan = false;

						}

					};

				}();

				function dollyOut( dollyScale ) {

					if ( scope.object.isPerspectiveCamera ) {

						scale /= dollyScale;

					} else if ( scope.object.isOrthographicCamera ) {

						scope.object.zoom = Math.max( scope.minZoom, Math.min( scope.maxZoom, scope.object.zoom * dollyScale ) );
						scope.object.updateProjectionMatrix();
						zoomChanged = true;

					} else {

						console.warn( 'WARNING: OrbitControls encountered an unknown camera type - dolly/zoom disabled.' );
						scope.enableZoom = false;

					}

				}

				function dollyIn( dollyScale ) {

					if ( scope.object.isPerspectiveCamera ) {

						scale *= dollyScale;

					} else if ( scope.object.isOrthographicCamera ) {

						scope.object.zoom = Math.max( scope.minZoom, Math.min( scope.maxZoom, scope.object.zoom / dollyScale ) );
						scope.object.updateProjectionMatrix();
						zoomChanged = true;

					} else {

						console.warn( 'WARNING: OrbitControls encountered an unknown camera type - dolly/zoom disabled.' );
						scope.enableZoom = false;

					}

				}

				//
				// event callbacks - update the object state
				//

				function handleMouseDownRotate( event ) {

					rotateStart.set( event.clientX, event.clientY );

				}

				function handleMouseDownDolly( event ) {

					dollyStart.set( event.clientX, event.clientY );

				}

				function handleMouseDownPan( event ) {

					panStart.set( event.clientX, event.clientY );

				}

				function handleMouseMoveRotate( event ) {

					rotateEnd.set( event.clientX, event.clientY );

					rotateDelta.subVectors( rotateEnd, rotateStart ).multiplyScalar( scope.rotateSpeed );

					const element = scope.domElement;

					rotateLeft( 2 * Math.PI * rotateDelta.x / element.clientHeight ); // yes, height

					rotateUp( 2 * Math.PI * rotateDelta.y / element.clientHeight );

					rotateStart.copy( rotateEnd );

					scope.update();

				}

				function handleMouseMoveDolly( event ) {

					dollyEnd.set( event.clientX, event.clientY );

					dollyDelta.subVectors( dollyEnd, dollyStart );

					if ( dollyDelta.y > 0 ) {

						dollyOut( getZoomScale() );

					} else if ( dollyDelta.y < 0 ) {

						dollyIn( getZoomScale() );

					}

					dollyStart.copy( dollyEnd );

					scope.update();

				}

				function handleMouseMovePan( event ) {

					panEnd.set( event.clientX, event.clientY );

					panDelta.subVectors( panEnd, panStart ).multiplyScalar( scope.panSpeed );

					pan( panDelta.x, panDelta.y );

					panStart.copy( panEnd );

					scope.update();

				}

				function handleMouseWheel( event ) {

					if ( event.deltaY < 0 ) {

						dollyIn( getZoomScale() );

					} else if ( event.deltaY > 0 ) {

						dollyOut( getZoomScale() );

					}

					scope.update();

				}

				function handleKeyDown( event ) {

					let needsUpdate = false;

					switch ( event.code ) {

						case scope.keys.UP:
							pan( 0, scope.keyPanSpeed );
							needsUpdate = true;
							break;

						case scope.keys.BOTTOM:
							pan( 0, - scope.keyPanSpeed );
							needsUpdate = true;
							break;

						case scope.keys.LEFT:
							pan( scope.keyPanSpeed, 0 );
							needsUpdate = true;
							break;

						case scope.keys.RIGHT:
							pan( - scope.keyPanSpeed, 0 );
							needsUpdate = true;
							break;

					}

					if ( needsUpdate ) {

						// prevent the browser from scrolling on cursor keys
						event.preventDefault();

						scope.update();

					}


				}

				function handleTouchStartRotate() {

					if ( pointers.length === 1 ) {

						rotateStart.set( pointers[0].pageX, pointers[0].pageY );

					} else {

						const x = 0.5 * ( pointers[0].pageX + pointers[1].pageX );
						const y = 0.5 * ( pointers[0].pageY + pointers[1].pageY );

						rotateStart.set( x, y );

					}

				}

				function handleTouchStartPan() {

					if ( pointers.length === 1 ) {

						panStart.set( pointers[0].pageX, pointers[0].pageY );

					} else {

						const x = 0.5 * ( pointers[0].pageX + pointers[1].pageX );
						const y = 0.5 * ( pointers[0].pageY + pointers[1].pageY );

						panStart.set( x, y );

					}

				}

				function handleTouchStartDolly() {

					const dx = pointers[0].pageX - pointers[1].pageX;
					const dy = pointers[0].pageY - pointers[1].pageY;

					const distance = Math.sqrt( dx * dx + dy * dy );

					dollyStart.set( 0, distance );

				}

				function handleTouchStartDollyPan() {

					if ( scope.enableZoom ) handleTouchStartDolly();

					if ( scope.enablePan ) handleTouchStartPan();

				}

				function handleTouchStartDollyRotate() {

					if ( scope.enableZoom ) handleTouchStartDolly();

					if ( scope.enableRotate ) handleTouchStartRotate();

				}

				function handleTouchMoveRotate( event ) {

					if ( pointers.length == 1 ) {

						rotateEnd.set( event.pageX, event.pageY );

					} else {

						const position = getSecondPointerPosition( event );

						const x = 0.5 * ( event.pageX + position.x );
						const y = 0.5 * ( event.pageY + position.y );

						rotateEnd.set( x, y );

					}

					rotateDelta.subVectors( rotateEnd, rotateStart ).multiplyScalar( scope.rotateSpeed );

					const element = scope.domElement;

					rotateLeft( 2 * Math.PI * rotateDelta.x / element.clientHeight ); // yes, height

					rotateUp( 2 * Math.PI * rotateDelta.y / element.clientHeight );

					rotateStart.copy( rotateEnd );

				}

				function handleTouchMovePan( event ) {

					if ( pointers.length === 1 ) {

						panEnd.set( event.pageX, event.pageY );

					} else {

						const position = getSecondPointerPosition( event );

						const x = 0.5 * ( event.pageX + position.x );
						const y = 0.5 * ( event.pageY + position.y );

						panEnd.set( x, y );

					}

					panDelta.subVectors( panEnd, panStart ).multiplyScalar( scope.panSpeed );

					pan( panDelta.x, panDelta.y );

					panStart.copy( panEnd );

				}

				function handleTouchMoveDolly( event ) {

					const position = getSecondPointerPosition( event );

					const dx = event.pageX - position.x;
					const dy = event.pageY - position.y;

					const distance = Math.sqrt( dx * dx + dy * dy );

					dollyEnd.set( 0, distance );

					dollyDelta.set( 0, Math.pow( dollyEnd.y / dollyStart.y, scope.zoomSpeed ) );

					dollyOut( dollyDelta.y );

					dollyStart.copy( dollyEnd );

				}

				function handleTouchMoveDollyPan( event ) {

					if ( scope.enableZoom ) handleTouchMoveDolly( event );

					if ( scope.enablePan ) handleTouchMovePan( event );

				}

				function handleTouchMoveDollyRotate( event ) {

					if ( scope.enableZoom ) handleTouchMoveDolly( event );

					if ( scope.enableRotate ) handleTouchMoveRotate( event );

				}

				//
				// event handlers - FSM: listen for events and reset state
				//

				function onPointerDown( event ) {

					if ( scope.enabled === false ) return;

					if ( pointers.length === 0 ) {

						scope.domElement.setPointerCapture( event.pointerId );

						scope.domElement.addEventListener( 'pointermove', onPointerMove );
						scope.domElement.addEventListener( 'pointerup', onPointerUp );

					}

					//

					addPointer( event );

					if ( event.pointerType === 'touch' ) {

						onTouchStart( event );

					} else {

						onMouseDown( event );

					}

				}

				function onPointerMove( event ) {

					if ( scope.enabled === false ) return;

					if ( event.pointerType === 'touch' ) {

						onTouchMove( event );

					} else {

						onMouseMove( event );

					}

				}

				function onPointerUp( event ) {

					if ( scope.enabled === false ) return;

					if ( event.pointerType === 'touch' ) {

						onTouchEnd();

					} else {

						onMouseUp();

					}

					removePointer( event );

					//

					if ( pointers.length === 0 ) {

						scope.domElement.releasePointerCapture( event.pointerId );

						scope.domElement.removeEventListener( 'pointermove', onPointerMove );
						scope.domElement.removeEventListener( 'pointerup', onPointerUp );

					}

				}

				function onPointerCancel( event ) {

					removePointer( event );

				}

				function onMouseDown( event ) {

					let mouseAction;

					switch ( event.button ) {

						case 0:

							mouseAction = scope.mouseButtons.LEFT;
							break;

						case 1:

							mouseAction = scope.mouseButtons.MIDDLE;
							break;

						case 2:

							mouseAction = scope.mouseButtons.RIGHT;
							break;

						default:

							mouseAction = - 1;

					}

					switch ( mouseAction ) {

						case MOUSE.DOLLY:

							if ( scope.enableZoom === false ) return;

							handleMouseDownDolly( event );

							state = STATE.DOLLY;

							break;

						case MOUSE.ROTATE:

							if ( event.ctrlKey || event.metaKey || event.shiftKey ) {

								if ( scope.enablePan === false ) return;

								handleMouseDownPan( event );

								state = STATE.PAN;

							} else {

								if ( scope.enableRotate === false ) return;

								handleMouseDownRotate( event );

								state = STATE.ROTATE;

							}

							break;

						case MOUSE.PAN:

							if ( event.ctrlKey || event.metaKey || event.shiftKey ) {

								if ( scope.enableRotate === false ) return;

								handleMouseDownRotate( event );

								state = STATE.ROTATE;

							} else {

								if ( scope.enablePan === false ) return;

								handleMouseDownPan( event );

								state = STATE.PAN;

							}

							break;

						default:

							state = STATE.NONE;

					}

					if ( state !== STATE.NONE ) {

						scope.dispatchEvent( _startEvent );

					}

				}

				function onMouseMove( event ) {

					if ( scope.enabled === false ) return;

					switch ( state ) {

						case STATE.ROTATE:

							if ( scope.enableRotate === false ) return;

							handleMouseMoveRotate( event );

							break;

						case STATE.DOLLY:

							if ( scope.enableZoom === false ) return;

							handleMouseMoveDolly( event );

							break;

						case STATE.PAN:

							if ( scope.enablePan === false ) return;

							handleMouseMovePan( event );

							break;

					}

				}

				function onMouseUp( event ) {

					scope.dispatchEvent( _endEvent );

					state = STATE.NONE;

				}

				function onMouseWheel( event ) {

					if ( scope.enabled === false || scope.enableZoom === false || ( state !== STATE.NONE && state !== STATE.ROTATE ) ) return;

					event.preventDefault();

					scope.dispatchEvent( _startEvent );

					handleMouseWheel( event );

					scope.dispatchEvent( _endEvent );

				}

				function onKeyDown( event ) {

					if ( scope.enabled === false || scope.enablePan === false ) return;

					handleKeyDown( event );

				}

				function onTouchStart( event ) {

					trackPointer( event );

					switch ( pointers.length ) {

						case 1:

							switch ( scope.touches.ONE ) {

								case TOUCH.ROTATE:

									if ( scope.enableRotate === false ) return;

									handleTouchStartRotate();

									state = STATE.TOUCH_ROTATE;

									break;

								case TOUCH.PAN:

									if ( scope.enablePan === false ) return;

									handleTouchStartPan();

									state = STATE.TOUCH_PAN;

									break;

								default:

									state = STATE.NONE;

							}

							break;

						case 2:

							switch ( scope.touches.TWO ) {

								case TOUCH.DOLLY_PAN:

									if ( scope.enableZoom === false && scope.enablePan === false ) return;

									handleTouchStartDollyPan();

									state = STATE.TOUCH_DOLLY_PAN;

									break;

								case TOUCH.DOLLY_ROTATE:

									if ( scope.enableZoom === false && scope.enableRotate === false ) return;

									handleTouchStartDollyRotate();

									state = STATE.TOUCH_DOLLY_ROTATE;

									break;

								default:

									state = STATE.NONE;

							}

							break;

						default:

							state = STATE.NONE;

					}

					if ( state !== STATE.NONE ) {

						scope.dispatchEvent( _startEvent );

					}

				}

				function onTouchMove( event ) {

					trackPointer( event );

					switch ( state ) {

						case STATE.TOUCH_ROTATE:

							if ( scope.enableRotate === false ) return;

							handleTouchMoveRotate( event );

							scope.update();

							break;

						case STATE.TOUCH_PAN:

							if ( scope.enablePan === false ) return;

							handleTouchMovePan( event );

							scope.update();

							break;

						case STATE.TOUCH_DOLLY_PAN:

							if ( scope.enableZoom === false && scope.enablePan === false ) return;

							handleTouchMoveDollyPan( event );

							scope.update();

							break;

						case STATE.TOUCH_DOLLY_ROTATE:

							if ( scope.enableZoom === false && scope.enableRotate === false ) return;

							handleTouchMoveDollyRotate( event );

							scope.update();

							break;

						default:

							state = STATE.NONE;

					}

				}

				function onTouchEnd( event ) {

					scope.dispatchEvent( _endEvent );

					state = STATE.NONE;

				}

				function onContextMenu( event ) {

					if ( scope.enabled === false ) return;

					event.preventDefault();

				}

				function addPointer( event ) {

					pointers.push( event );

				}

				function removePointer( event ) {

					delete pointerPositions[event.pointerId];

					for ( let i = 0; i < pointers.length; i++ ) {

						if ( pointers[i].pointerId == event.pointerId ) {

							pointers.splice( i, 1 );
							return;

						}

					}

				}

				function trackPointer( event ) {

					let position = pointerPositions[event.pointerId];

					if ( position === undefined ) {

						position = new Vector2();
						pointerPositions[event.pointerId] = position;

					}

					position.set( event.pageX, event.pageY );

				}

				function getSecondPointerPosition( event ) {

					const pointer = ( event.pointerId === pointers[0].pointerId ) ? pointers[1] : pointers[0];

					return pointerPositions[pointer.pointerId];

				}

				//

				scope.domElement.addEventListener( 'contextmenu', onContextMenu );

				scope.domElement.addEventListener( 'pointerdown', onPointerDown );
				scope.domElement.addEventListener( 'pointercancel', onPointerCancel );
				scope.domElement.addEventListener( 'wheel', onMouseWheel, { passive: false } );

				// force an update at start

				this.update();

			}

		}
		this.OrbitControls = OrbitControls;

/*
		// This set of controls performs orbiting, dollying (zooming), and panning.
		// Unlike TrackballControls, it maintains the "up" direction object.up (+Y by default).
		// This is very similar to OrbitControls, another set of touch behavior
		//
		//    Orbit - right mouse, or left mouse + ctrl/meta/shiftKey / touch: two-finger rotate
		//    Zoom - middle mouse, or mousewheel / touch: two-finger spread or squish
		//    Pan - left mouse, or arrow keys / touch: one-finger move
	
		class MapControls extends OrbitControls {
	
			constructor( object, domElement ) {
	
				super( object, domElement );
	
				this.screenSpacePanning = false; // pan orthogonal to world-space direction camera.up
	
				this.mouseButtons.LEFT = MOUSE.PAN;
				this.mouseButtons.RIGHT = MOUSE.ROTATE;
	
				this.touches.ONE = TOUCH.PAN;
				this.touches.TWO = TOUCH.DOLLY_ROTATE;
	
			}
	
		}
*/

	}
	/**
	 * get [THREE]{@link https://github.com/anhr/three.js}
	 */
	get THREE() {

		if ( _THREE === undefined )
			console.error( 'three: invalid _THREE = ' + _THREE + '. Call three.THREE = THREE first.' );
		return _THREE;

	}
	/**
	 * set [dat]{@link https://github.com/dataarts/dat.gui}
	 */
	set dat( dat ) {

		if ( _dat ) {

			if ( !Object.is( dat, _dat ) )
				console.error( 'three: duplicate dat. Please use one instance of the dat library.' );
			return;

		}
		_dat = dat;

	}
	/**
	 * get [dat]{@link https://github.com/dataarts/dat.gui}
	 */
	get dat() {

/*Неверно срабатывает когда dat не импортирован
		if ( _dat === undefined && !boSetDat )
			console.error( 'three: invalid _dat = ' + _dat + '. Call three.dat = dat first.' );
*/			
		return _dat;

	}

}

var three;
window.__myThree__ = window.__myThree__ || {};
if ( window.__myThree__.three ) {

	//сюда попадает если использовать './commonNodeJS/master/player/build/player.module.js'
	three = window.__myThree__.three;

} else {

	three = new Three();
	three.isThree = function(){ return _THREE; };
	window.__myThree__.three = three;

}

var three$1 = three;

/**
 * @module ColorPicker
 * @description Pure JavaScript color picker.
 * @author [Andrej Hristoliubov]{@link https://github.com/anhr}
 *
 * Thanks to https://github.com/DavidDurman/FlexiColorPicker
 *
 * @copyright 2011 Data Arts Team, Google Creative Lab
 *
 * @license under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */

const optionsStyle = {

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
const currentScriptPath = getCurrentScriptPath();

loadScript.sync( currentScriptPath + '/colorpicker.css', optionsStyle );

const type = ( window.SVGAngle || document.implementation.hasFeature( "http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1" ) ? "SVG" : "VML" ),
	svgNS = 'http://www.w3.org/2000/svg';
var uniqID = 0;

class ColorPicker {

	/**Pure JavaScript color picker.
	 * @class
	 * @see [FlexiColorPicker]{@link https://github.com/DavidDurman/FlexiColorPicker}
	 * */
	constructor() {

		const _this = this;
		/**
		 * enumeration of available palettes.
		 * @readonly
		 * @enum {number}
		 */
		this.paletteIndexes = {

			/** <a href="../Example/index.html#BGYW" target="_blank">blue, green, yellow, white</a> palette. This is the default palette*/
			BGYW: 0,
			/** <a href="../Example/index.html#Monochrome" target="_blank">monochrome</a> palette */
			monochrome: 1,
			/** <a href="../Example/index.html#Bidirectional" target="_blank">red, black, green</a> palette */
			bidirectional: 2,//
			/** <a href="../Example/index.html#rainbow" target="_blank">rainbow</a> palette */
			rainbow: 3,

		};

		function CreateSVGElement( el, attrs, children ) {

			el = document.createElementNS( svgNS, el );
			for ( var key in attrs )
				el.setAttribute( key, attrs[key] );
			if ( Object.prototype.toString.call( children ) != '[object Array]' ) children = [children];
			var i = 0, len = ( children[0] && children.length ) || 0;
			for ( ; i < len; i++ )
				el.appendChild( children[i] );
			return el;
		}

//		var boCreated = false;
		/**
		 * @callback callback
		 * @description Called whenever the color is changed provided chosen color in RGB HEX format. See options.sliderIndicator.callback param of the create method.
		 * @param {object} c color
		 * @param {string} c.hex A hexadecimal color is specified with: #RRGGBB, where the RR (red), GG (green) and BB (blue)
		 * <pre>
		 * hexadecimal integers specify the components of the color. All values must be between 00 and FF.
		 * Example #00ff00
		 * </pre>
		 * @param {number} c.r red of RGB color value. Must be between 0 and 255.
		 * @param {number} c.g green of RGB color value. Must be between 0 and 255.
		 * @param {number} c.b blue of RGB color value. Must be between 0 and 255.
		 * @param {number} percent position of the mouse pointer in the percents. See details in options.direction param
		 */

		/**
		 * @callback onError
		 * @param {string} message error message
		 */

		/**
		 * creates an instance of ColorPicker
		 * @param {string|HTMLElement} elSliderWrapper id of the ColorPicker element or ColorPicker element
		 * @param {object} [options] followed options is availablee
		 * @param {paletteIndexes|object[]|Palette} [options.palette] Palette index or palette array or Palette. The following indexes are available:
		 * <pre>
		 * <a href="../Example/index.html#BGYW" target="_blank">ColorPicker.paletteIndexes.BGYW</a>: 0 - blue, green, yellow, white palette.
		 * <a href="../Example/index.html#Monochrome" target="_blank">ColorPicker.paletteIndexes.monochrome</a>: 1,
		 * <a href="../Example/index.html#Bidirectional" target="_blank">ColorPicker.paletteIndexes.bidirectional</a>: 2,//red, black, green
		 * <a href="../Example/index.html#rainbow" target="_blank">ColorPicker.paletteIndexes.rainbow</a>: 3,
		 * Default is paletteIndexes.BGYW index.
		 * Example of palette array:
		[
			{ percent: 0, r: 0, g: 0, b: 0, },
			{ percent: 10, r: 0xff, g: 255, b: 0xff, },
			{ percent: 100, r: 0xff, g: 255, b: 0xff, },
		]
		 * Palette see function Palette( options ) for details
		 * </pre>
		 * @param {object} [options.orientation] orientation of the element. Available "horizontal" or "vertical" orientation
		 * @param {object} [options.direction] true - position of the mouse pointer relative left side for 'horizontal' slider
		 * or bottom side for 'vertical' slider in the percents.
		 * <p>
		 * false - position of the mouse pointer relative right side for 'horizontal' slider
		 * or relative top side for 'vertical' slider in the percents.
		 * </p>
		 * Default is true.
		 * @param {object} [options.style] style statements
		 * @param {object} [options.style.width] width of the element. Default is 200px for options.orientation = "horizontal"
		 * and 30px for options.orientation = "vertical".
		 * @param {object} [options.style.height] height of the element. Default is 30px for options.orientation = "horizontal"
		 * and 200px for options.orientation = "vertical".
		 * @param {string} [options.style.border] elSliderWrapper border. Example: '1px solid black'
		 * @param {object} [options.sliderIndicator] adds a slider-indicator element for choose by mouse a color from palette.
		 * Default is undefuned
		 * @param {callback} [options.sliderIndicator.callback] Called whenever the color is changed provided chosen color in RGB HEX format.
		 * @param {number} [options.sliderIndicator.value] Initial position of the slider indicator in percent. Default is 0.
		 * @param {onError} [options.onError] Called whenever an error has occurred.
		 * @param {boolean} [options.duplicate] true - allow to create two or more palettes on your web page.
		 */
		this.create = function( elSliderWrapper, options ) {

			options = options || {};
			options.orientation = options.orientation || 'horizontal';

			function isHorizontal() { return options.orientation === "horizontal"; }

			if ( options.direction === undefined )
				options.direction = true;
			options.style = options.style || {};
			//		options.style.width = options.style.width || ( isHorizontal() ? '200px' : '30px' );
			options.style.width = options.style.width || ( isHorizontal() ? 200 : 30 );
			options.style.height = options.style.height || ( isHorizontal() ? 30 : 200 );

			options.onError = options.onError || function () { };

			if ( elSliderWrapper instanceof HTMLElement !== true ) {

				if ( typeof elSliderWrapper !== "string" ) {

					console.error( 'ColorPicker.create: invalid elSliderWrapper = ' + elSliderWrapper );
					return;

				}
				elSliderWrapper = document.getElementById( elSliderWrapper );
				if ( elSliderWrapper === null ) {

					console.error( 'ColorPicker.create: invalid elSliderWrapper = ' + elSliderWrapper );
					return;

				}

			}
			elSliderWrapper.classList.add( 'slider-wrapper' );
			for ( var style in options.style ) {

				elSliderWrapper.style[style] = options.style[style];

			}

			const palette = options.palette instanceof this.palette ? options.palette : new this.palette( options );
			var slide;
			function getSlideHeight() {

				if ( typeof options.style.height === "string" )
					return parseInt( options.style.height );
				return options.style.height;

			}
			function getSlideWidth() { return slide.clientWidth; }
			/**
			 * sets color from palette
			 * @param {number} value coordinate of color from palette in percent
			 * @param {number} position coordinate of color from palette
			 */
			function setValue( value, position ) {

				if ( slideIndicator === undefined ) {

					console.error( 'Set value of this instance of the ColorPicker is impossible because options.sliderIndicator is not defined.' );
					return;

				}
				const c = palette.hsv2rgb( value );
				if ( c === undefined ) {

					console.error( 'ColorPicker.setValue: invalud c = ' + c );
					return;

				}

				value = c.percent;
				if ( position === undefined )
					position = isHorizontal() ?
						( getSlideWidth() * value ) / 100 :
						getSlideHeight() - ( getSlideHeight() * ( options.direction ? value : 100 - value ) ) / 100;
				positionIndicators( position );
				if ( options.sliderIndicator.callback !== undefined ) {

					//console.warn( 'callback: ' + c.percent + ' percent c.hex = ' + c.hex );
					options.sliderIndicator.callback( c );

				}

			}

			var slideIndicator;
			if ( options.sliderIndicator !== undefined ) {

				slideIndicator = document.createElement( 'div' );
				slideIndicator.className = 'slider-indicator';
				if ( isHorizontal() )
					slideIndicator.style.width = '10px';
				else slideIndicator.style.height = '10px';
				elSliderWrapper.appendChild( slideIndicator );
				slideIndicator.style.pointerEvents = 'none';

			}

			/**
			 * Helper to position indicators.
			 * @param {number} position Coordinates of the mouse cursor in the slide area.
			 */
			function positionIndicators( position ) {

				if ( slideIndicator === undefined )
					return;

				if ( isHorizontal() ) {

					if ( ( position < 0 ) || ( position > getSlideWidth() ) ) {

						console.error( 'ColorPicker.positionIndicators: Invalid position = ' + position );
						return;

					}
					slideIndicator.style.top = '0px';
					slideIndicator.style.left = ( ( options.direction ? position : getSlideWidth() - position ) - slideIndicator.offsetWidth / 2 ) + 'px';

				} else {

					if ( ( position < 0 ) || ( position > getSlideHeight() ) ) {

						console.error( 'ColorPicker.positionIndicators: Invalid position = ' + position );
						return;

					}
					slideIndicator.style.left = '0px';
					slideIndicator.style.top = ( position - slideIndicator.offsetHeight / 2 ) + 'px';

				}

			}
			if ( type == 'SVG' ) {

				try {

					const linearGradient = 'linearGradient';
					slide = CreateSVGElement( 'svg', {
//						xmlns: 'http://www.w3.org/2000/svg',
						xmlns: svgNS,
						version: '1.1',
						width: isHorizontal() ? '100%' : options.style.width,
						height: options.style.height,
					},
						[
							CreateSVGElement( 'defs', {},
								CreateSVGElement( linearGradient, {

									id: 'gradient-hsv-' + uniqID,
									x1: isHorizontal() && options.direction ? '100%' : '0%',
									y1: !isHorizontal() && !options.direction ? '100%' : '0%',
									x2: isHorizontal() && !options.direction ? '100%' : '0%',
									y2: !isHorizontal() && options.direction ? '100%' : '0%',

								},
									palette.getPalette()
								)
							),
							CreateSVGElement( 'rect', { x: '0', y: '0', width: '100%', height: '100%', fill: 'url(#gradient-hsv-' + uniqID + ')' } )
						]
					);
					if ( slideIndicator !== undefined ) {

						slide.style.cursor = isHorizontal() ? 'e-resize' : 's-resize';
						slideIndicator.style.cursor = slide.style.cursor;

					}
				} catch ( e ) {

					//I can not get 
					// slide.querySelector( linearGradient );
					//in Safari 5.1.7 browser for Windows
					//Instead I see the error message:
					// 'null' is not an object( evaluating 'hsvGradient.id = 'gradient - hsv - ' + uniqID' )
					console.error( 'Create SVG element failed! ' + e.message );

				}

				elSliderWrapper.appendChild( slide );
				elSliderWrapper.style.height = getSlideHeight() + 'px';

				if ( slideIndicator !== undefined ) {

					if ( isHorizontal() )
						slideIndicator.style.height = ( parseInt( options.style.height ) - 2 ) + 'px';
					else slideIndicator.style.width = ( parseInt( options.style.width ) - 2 ) + 'px';

					options.sliderIndicator.value = options.sliderIndicator.value || 0;
					setValue( options.sliderIndicator.value );

				}
				uniqID++;

			} else {

				console.error( 'Under constraction' );

			}

			function mouseMove( mouse ) {

				//for IE
				mouse.x = parseInt( mouse.x );
				mouse.y = parseInt( mouse.y );

				var position, size, value;
				if ( isHorizontal() ) {

					position = mouse.x;
					size = getSlideWidth() - 1;

					if ( position >= getSlideWidth() )
						position = size;
					value = ( position * 100 ) / size;
					if ( !options.direction ) {

						value = 100 - value;
						position = size - position;

					}

				} else {

					position = mouse.y;
					size = getSlideHeight() - 1;

					if ( position >= getSlideHeight() )
						position = size;
					value = ( 1 - position / size ) * 100;
					if ( !options.direction ) {

						value = 100 - value;

					}

				}
				setValue( value, position );

			}
			if ( slideIndicator !== undefined ) {

				var mouseout = false;

				/**
				 * Return click event handler for the slider.
				 * Sets picker background color and calls options.sliderIndicator.callback if provided.
				 */
				function slideListener() {

					return function ( evt ) {

						if ( mouseout )
							return;

						evt = evt || window.event;

						/**
						 * Return mouse position relative to the element el.
						 */
						function mousePosition( evt ) {
							// IE:
							if ( window.event && window.event.contentOverflow !== undefined ) {
								return { x: window.event.offsetX, y: window.event.offsetY };
							}
							// Webkit:
							if ( evt.offsetX !== undefined && evt.offsetY !== undefined ) {
								return { x: evt.offsetX, y: evt.offsetY };
							}
							// Firefox:
							var wrapper = evt.target.parentNode.parentNode;
							return { x: evt.layerX - wrapper.offsetLeft, y: evt.layerY - wrapper.offsetTop };
						}

						mouseMove( mousePosition( evt ) );

					}
				}
				function addEventListener( element, event, listener ) {

					if ( element === null )
						return;

					if ( element.attachEvent ) {

						element.attachEvent( 'on' + event, listener );

					} else if ( element.addEventListener ) {

						element.addEventListener( event, listener, false );
					}
				}

				addEventListener( slide, 'click', slideListener() );

				/**
				 * @callback listener
				*/

				/**
				 * Enable drag&drop color selection.
				 * @param {object} ctx ColorPicker instance.
				 * @param {listener} listener Function that will be called whenever mouse is dragged over the element with event object as argument.
				 */
				function enableDragging( ctx, listener ) {

					var element = slide;

					//Touchscreen support

					addEventListener( element, 'touchstart', function ( evt ) { } );
					addEventListener( element, 'touchmove', function ( evt ) {

						evt.preventDefault();

						var rect = evt.srcElement.getBoundingClientRect(),
							x = ( evt.touches[0].clientX - rect.left ),
							y = ( evt.touches[0].clientY - rect.top );
						if ( x < 0 ) x = 0;
						if ( y < 0 ) y = 0;
						mouseMove( { x: x, y: y } );

					} );
					addEventListener( element, 'touchend', function ( evt ) {


					} );

					//mouse support
					addEventListener( element, 'mousedown', function ( evt ) {

						const mouseup = 'mouseup', mousemove = 'mousemove';
						function onMouseUp() {

							//console.warn( mouseup );
							function removeEventListener( element, event, listener ) {

								if ( element === null )
									return;

								if ( element.detachEvent ) {

									element.detachEvent( 'on' + event, listener );

								} else if ( element.removeEventListener ) {

									element.removeEventListener( event, listener, false );

								}
							}
							removeEventListener( window, mouseup, onMouseUp );
							removeEventListener( window, mousemove, listener );

						}
						addEventListener( window, mouseup, onMouseUp );
						addEventListener( window, mousemove, listener );

					} );
					addEventListener( element, 'mouseout', function ( evt ) { mouseout = true; } );
					addEventListener( element, 'mouseover', function ( evt ) { mouseout = false; } );
				}
				enableDragging( this, slideListener() );

			}

			return {

				setValue: setValue,

			};
		};
		/**
		 * create palette
		 * @param {object} [options] the following options are available
		 * @param {paletteIndexes|object[]} [options.palette] Palette index or palette array. The following indexes are available:
		 * <pre>
		 * paletteIndexes.BGYW: 0 - blue, green, yellow, white palette.
		 * paletteIndexes.monochrome: 1,
		 * paletteIndexes.bidirectional: 2,//red, black, green
		 * paletteIndexes.rainbow: 3,
		 * Default is paletteIndexes.BGYW index.
		 * Example of palette array:
		[
			{ percent: 0, r: 0, g: 0, b: 0, },
			{ percent: 10, r: 0xff, g: 255, b: 0xff, },
			{ percent: 100, r: 0xff, g: 255, b: 0xff, },
		]
		* </pre>
		*/
		this.palette = function( options ) {


			function paletteitem( percent, r, g, b ) {

				return {

					percent: percent,
					r: r,
					g: g,
					b: b,

				}

			}

			options = options || {};
			if ( options.palette === undefined )
				options.palette = _this.paletteIndexes.BGYW;
			
			/**
			 * @returns Index of palette.
			 * <pre>
			 * 0 - <a href="../Example/index.html#BGYW" target="_blank">BGYW</a>
			 * 1 - <a href="../Example/index.html#Monochrome" target="_blank">monochrome</a>
			 * 2 - <a href="../Example/index.html#Bidirectional" target="_blank">bidirectional</a>
			 * 3 - <a href="../Example/index.html#rainbow" target="_blank">rainbow</a>
			 * </pre>
			 * */
			this.getPaletteIndex = function () { return options.palette; };

			var arrayPalette = [

				new paletteitem( 0, 0x00, 0x00, 0xFF ),//blue
				new paletteitem( 33, 0x00, 0xFF, 0x00 ),//green
				new paletteitem( 66, 0xFF, 0xFF, 0x00 ),//yellow
				new paletteitem( 100, 0xFF, 0xFF, 0xFF ),//white

			];
			switch ( typeof options.palette ) {

				case 'number':
					switch ( options.palette ) {

						case _this.paletteIndexes.BGYW:
							break;//default palette
						case _this.paletteIndexes.monochrome:
							var arrayPalette = [

								new paletteitem( 0, 0x00, 0x00, 0x00 ),//blach
								new paletteitem( 100, 0xFF, 0xFF, 0xFF ),//white

							];
							break;
						case _this.paletteIndexes.bidirectional:
							var arrayPalette = [
								new paletteitem( 0, 0xff, 0x30, 0x30 ),//red
								new paletteitem( 50, 0x30, 0x30, 0x30 ),//gray
								new paletteitem( 100, 0x30, 0xFF, 0x30 ),//green

							];
							break;
						case _this.paletteIndexes.rainbow:
							var arrayPalette = [

								new paletteitem( 0, 0xff, 0x32, 0x32 ),
								new paletteitem( 16, 0xfc, 0xf5, 0x28 ),
								new paletteitem( 32, 0x28, 0xfc, 0x28 ),
								new paletteitem( 50, 0x28, 0xfc, 0xf8 ),
								new paletteitem( 66, 0x27, 0x2e, 0xf9 ),
								new paletteitem( 82, 0xff, 0x28, 0xfb ),
								new paletteitem( 100, 0xff, 0x32, 0x32 ),

							];
							break;
						default: console.error( 'ColorPicker.create.Palette: invalid options.palette = ' + options.palette );

					}
					break;
				case "object":
					if ( Array.isArray( options.palette ) ) {

						//Custom palette
						arrayPalette = options.palette;
						break;

					}
				default:
					var message = 'invalid options.palette = ' + options.palette;
					console.error( 'ColorPicker.create.Palette: ' + message );
					options.onError( message );

			}
			/**
			* @returns true
			*/
			this.isPalette = function () { return true; };
			/**
			* @returns {object[]} palette array
			*/
			this.getPalette = function () {

				const palette = [];
				arrayPalette.forEach( function ( item ) {

					palette.unshift( CreateSVGElement( 'stop', {

						offset: ( 100 - item.percent ) + '%', 'stop-color': '#'
							//Thanks to https://stackoverflow.com/a/13240395/5175935
							+ ( "0" + ( Number( item.r ).toString( 16 ) ) ).slice( -2 ).toUpperCase()
							+ ( "0" + ( Number( item.g ).toString( 16 ) ) ).slice( -2 ).toUpperCase()
							+ ( "0" + ( Number( item.b ).toString( 16 ) ) ).slice( -2 ).toUpperCase(),
						'stop-opacity': '1'

					} ) );

				} );
				return palette;

			};
			/**
			* converts a percent or value from min to max  to object with r, g, b, hex and percent.
			* @param {number} stringPercent coordinate of color from palette in percent or value from min to max
			* @param {number} [min] min stringPercent.
			* @param {number} [max] max stringPercent.
			* @returns {object} object with r, g, b, hex and percent
			*/
			this.hsv2rgb = function ( stringPercent, min, max ) {

				var percent = parseFloat( stringPercent );
				if ( isNaN( percent ) ) {

					//Сюда попадает из http://localhost/anhr/egocentricUniverse/master/Examples/3D.html
					//Когда вместо случайного выбора вершин задаю их вручную и при этом не указываю координату w вершины
					percent = max;
/*					
					console.error( 'ColorPicker.palette.hsv2rgb: stringPercent = ' + stringPercent );
					return;
*/	 
					
				}
				if ( min !== undefined && max !== undefined )
					percent = ( 100 / ( max - min ) ) * ( percent - min );
				var lastPalette = arrayPalette[arrayPalette.length - 1];
				if ( lastPalette.percent !== 100 ) {

					//not compatible with Safari for Windows
					//var lastItem = Object.assign( {}, arrayPalette[arrayPalette.length - 1] );

					const lastItem = {};
					Object.keys( lastPalette ).forEach( function ( key ) {

						lastItem[key] = lastPalette[key];

					} );
					lastItem.percent = 100;
					arrayPalette.push( lastItem );

				}
				var itemPrev;
				for ( var i = 0; i < arrayPalette.length; i++ ) {

					const item = arrayPalette[i];
					if ( itemPrev === undefined )
						itemPrev = item;
					if ( ( ( percent >= itemPrev.percent ) && ( percent <= item.percent ) ) ) {

						function color( percentPrev, prev, percentItem, item ) {

							var percentD = percentItem - percentPrev;
							if ( percentD === 0 )
								return prev;
							return Math.round( prev + ( ( item - prev ) / percentD ) * ( percent - percentPrev ) );

						}
						const r = color( itemPrev.percent, itemPrev.r, item.percent, item.r ),
							g = color( itemPrev.percent, itemPrev.g, item.percent, item.g ),
							b = color( itemPrev.percent, itemPrev.b, item.percent, item.b );
						return {

							r: r,
							g: g,
							b: b,
							hex: "#" + ( 16777216 | b | ( g << 8 ) | ( r << 16 ) ).toString( 16 ).slice( 1 ),
							percent: percent

						};

					}
					itemPrev = item;

				}
				if ( options.onError !== undefined )
					options.onError( 'Invalid color value of the ColorPicker: ' + stringPercent );

			};

			/**
			* converts a value in percentages to color.
			* @param {number} value coordinate of color from palette in percent. Default value range from 0 to 100.
			* @param {number} [min] minimal value
			* @param {number} [max] maximal value
			* @returns {THREE.Color} [color]{@link https://threejs.org/docs/index.html?q=Colo#api/en/math/Color}
			*/
			this.toColor = function ( value, min, max ) {

				const THREE = three$1.THREE;
				if ( value instanceof THREE.Color )
					return value;
				var c = this.hsv2rgb( value, min, max );
				if ( c === undefined )
					c = { r: 255, g: 255, b: 255 };
				return new THREE.Color( "rgb(" + c.r + ", " + c.g + ", " + c.b + ")" );

			};

//			boCreated = true;

		};
	}
}
ColorPicker = new ColorPicker();
var ColorPicker$1 = ColorPicker;

export { ColorPicker$1 as default };
//# sourceMappingURL=colorpicker.module.js.map
