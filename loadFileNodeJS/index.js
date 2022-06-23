/**
 * node.js version of the synchronous download of the file.
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
	}

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
	}

	this.XMLHttpRequestStart = function ( onreadystatechange, async ) {

		this.XMLHttpRequestStop();//For compatibility with IE Windows Phone

		this.req.onreadystatechange = onreadystatechange;

		//ATTENTION!!! do not works in IE
		if ( "onerror" in this.req ) {
			this.req.onerror = function ( event ) {
				ErrorMessage( "XMLHttpRequest error. url: " + this.url, false, false );
			}
		}

		this.XMLHttpRequestReStart( async );
	}

	this.getUrl = function () {
		if ( ( typeof this.url == 'undefined' ) || ( this.url == null ) ) {
			this.url = "XMLHttpRequest.xml";
		}
		return this.url + ( this.params ? this.params : "" );
	}

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
					}
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
			ErrorMessage( e.message + " url: " + this.url, false, false );
		}
	}

	this.XMLHttpRequestStop = function () {
		//console.log("XMLHttpRequestStop(...)");
		if ( this.req == null )
			return;
		this.req.abort();
	}

	this.ProcessReqChange = function ( processStatus200 ) {
		var req = this.req;
		if ( ( typeof isIE === 'undefined' ) || !isIE ) {
			//console.log("processReqChange(); req.statusText: " + req.statusText + ". req.status = " + req.status + ". req.readyState = " + req.readyState + ". req.responseText: " + req.responseText);
		}
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
				break;
		}//switch(req.readyState)
		return true;
	}

	this.processStatus200Error = function () {
		var error = this.GetElementText( 'error', true );
		if ( error ) {
			ErrorMessage( error );
			return true;
		}
		return false;
	}

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
	}

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
 * Synchronous load file
 * @param {string} url URL of an external file.
 * @param {Object} [options] the following options are available.
 * @param {Function} [options.onload] function () The onload event occurs when a script has been loaded. Optional.
 * @param {onerror} [options.onerror] function ( str ) The onerror event occurs when an error has been occured. Optional.
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
function sync( url, options ) {

	options = options || {};
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
		, false//Synchronous mode

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

export { sync, escapeHtml };
