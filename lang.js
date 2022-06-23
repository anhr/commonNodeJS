/**
 * @module Localization.
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
 * returns the "primary language" subtag of the version of the browser.
 * See the "Syntax" paragraph of RFC 4646 https://tools.ietf.org/html/rfc4646#section-2.1 for details.
 */
export function getLanguageCode() {

	//returns the language version of the browser.
	function _getLocale() {

		if ( !navigator ) {

			console.error( "getLocale() failed! !navigator" );
			return "";

		}

		if (
			( navigator.languages !== undefined )
			&& ( typeof navigator.languages !== 'unknown' )//for IE6
			&& ( navigator.languages.length > 0 )
		)
			return navigator.languages[0];//Chrome

		//IE
		if ( navigator.language ) {

			return navigator.language;

		} else if ( navigator.browserLanguage ) {

			return navigator.browserLanguage;

		} else if ( navigator.systemLanguage ) {

			return navigator.systemLanguage;

		} else if ( navigator.userLanguage ) {

			return navigator.userLanguage;

		}

		console.error( "getLocale() failed!" );
		return "";

	}

	return _getLocale().toLowerCase().match( /([a-z]+)(?:-([a-z]+))?/ )[1];

};

