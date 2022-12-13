/**
 * @module cookie
 * @description node.js version of the cookie.
 * Cookies let you store user information in web pages.
 * @see {@link https://www.w3schools.com/js/js_cookies.asp}
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

export { isEnabled, set, setObject, get, getObject, copyObject, remove, defaultCookie };

/**
 * Is the cookie enabled in your web browser?
 * @returns {boolean} true if cookie enabled
 * 
 * @example
	var isCookieEnabled = cookie.isEnabled('age', 25);
 */
function isEnabled() {

	return navigator.cookieEnabled;
	//Enable cookie
	//Chrome: Settings/Show advanced settings.../Privacy/Content settings.../Cookies/Allow local data to be set

}

/**
 * Set a cookie.
 * @param {string} name cookie name.
 * @param {any} value cookie value.
 * @param {Date} [cookie_date] expiry date (in UTC time). Optional.
 * @example
	cookie.set('age', 25);
 */
function set( name, value, cookie_date ) {

	if ( !isEnabled() ) {

		consoleCookieEnabled();
		return;

	}
	value = value.toString();
	//http://ruseller.com/lessons.php?rub=28&id=593
	if ( cookie_date === undefined ) {

		cookie_date = new Date();  // Curent date and time
		cookie_date.setTime( cookie_date.getTime() + 1000 * 60 * 60 * 24 * 365 );//expiry date is one year

	}
	document.cookie = name + "=" + value + ( ( typeof settings == 'undefined' ) ? '' : settings ) + "; expires=" + cookie_date.toGMTString();
	if ( document.cookie === '' )
		console.error( 'document.cookie is empty' );

}

/**
 * sets an object into cookie.
 * @param {string} name cookie name.
 * @param {any} object an object for saving into cookie.
 */
function setObject( name, object ) {

	set( name, JSON.stringify( object ) );

};

/**
 * Get a cookie.
 * @param {string} name cookie name.
 * @param {any} [defaultValue] cookie default value. Optional.
 * @returns {string} cookie value or defaultValue if cookie was not found.
 * @example
	var age = cookie.get('age', 25);
 */
function get( name, defaultValue ) {

	if ( !isEnabled() ) {

		consoleCookieEnabled();
		return;

	}
	//http://ruseller.com/lessons.php?rub=28&id=593
	var results = document.cookie.match( '(^|;) ?' + name + '=([^;]*)(;|$)' );

	if ( results ) {
		
		const result = results[2], type = typeof defaultValue;
		return type === "number" ?//number
				result % 1 === 0 ? parseInt(result) : parseFloat(result) :
			type === "boolean" ?//boolean
				result === 'true' ? true : false :
			unescape( result );//string

	}
	if ( typeof defaultValue == 'undefined' )
		return '';
	return defaultValue;

}

/**
 * gets an object from cookie.
 * @param {string} name name of the object.
 * @param {any} options load an object from cookie into options.
 * @param {Object} optionsDefault copy to options this default object if named object is not exists in the cookie.
 */
function getObject( name, options, optionsDefault ) {

	new defaultCookie().getObject( name, options, copyObject( name, optionsDefault ) );

};

/**
 * gets an object from cookie and returns a copy of object.
 * @param {string} name name of the object.
 * @param {Object} objectDefault copy to options this default object if named object is not exists in the cookie.
 * @returns copy of object from cookie.
 */
function copyObject( name, objectDefault ) {

	return JSON.parse( get( name, JSON.stringify( objectDefault ) ) );

}

/**
 * Remove cookie
 * @param {string} name cookie name.
 */
function remove( name ) {

	if ( !isEnabled() ) {

		consoleCookieEnabled();
		return;

	}
	//http://ruseller.com/lessons.php?rub=28&id=593
	var cookie_date = new Date();  // ������� ���� � �����
	cookie_date.setTime( cookie_date.getTime() - 1 );
	document.cookie = name += "=; expires=" + cookie_date.toGMTString();

}

function consoleCookieEnabled() {

	console.error( 'navigator.cookieEnabled = ' + navigator.cookieEnabled );

}

/**
 * Default cookie is not saving settings
 * @param {any} name is not using
 */
class defaultCookie {

	constructor(name) {
		/**
		 * Default cookie is not loading settings
		 * @param {any} defaultValue
		 * @returns defaultValue
		 */
		this.get = function (defaultValue) {

			return defaultValue;

		};

		/**
		 * Default cookie is not saving settings
		 */
		this.set = function () {

		};

		/**
		 * Default cookie is not loading objects
		 * @param {string} name is not using
		 * @param {any} options load an object from optionsDefault into options
		 * @param {Object} optionsDefault source object
		 */
		this.getObject = function (name, options, optionsDefault) {

			if (!optionsDefault)
				return;//object's settings is not saving
			Object.keys(optionsDefault).forEach(function (key) {

				//I cannot modify options[key] if optionsDefault is read only and options[key] is not copy of optionsDefault[key]
				//options[key] = optionsDefault[key];
				//copy key
				var option = optionsDefault[key];
				if ((option !== undefined) && (typeof option !== 'function'))
					options[key] = JSON.parse(JSON.stringify(option));

			});

		};

		/**
		 * copy and returns an object from objectDefault
		 * @param {string} name is not using
		 * @param {any} objectDefault source object
		 */
		this.copyObject = function (name, objectDefault) {

			return JSON.parse(JSON.stringify(objectDefault));

		}

		/**
		 * Default cookie is not saving object's settings
		 */
		this.setObject = function () {

		};

		this.isTrue = function (defaultValue) {

			return defaultValue;

		};

	}

};
