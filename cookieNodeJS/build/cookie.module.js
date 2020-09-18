/**
 * node.js version of the cookie.
 * Cookies let you store user information in web pages.
 *
 * @author Andrej Hristoliubov https://anhr.github.io/AboutMe/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */

/**
 * @module cookie
 * @description node.js version of the cookie.
 * Cookies let you store user information in web pages.
 * @see {@link https://www.w3schools.com/js/js_cookies.asp}
 *
 * @author Andrej Hristoliubov https://anhr.github.io/AboutMe/
 *
 * @copyright 2011 Data Arts Team, Google Creative Lab
 *
 * @license under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */
function isEnabled() {
	return navigator.cookieEnabled;
}
function set(name, value, cookie_date) {
	if (!isEnabled()) {
		consoleCookieEnabled();
		return;
	}
	value = value.toString();
	if (cookie_date === undefined) {
		cookie_date = new Date();
		cookie_date.setTime(cookie_date.getTime() + 1000 * 60 * 60 * 24 * 365);
	}
	document.cookie = name + "=" + value + (typeof settings == 'undefined' ? '' : settings) + "; expires=" + cookie_date.toGMTString();
	if (document.cookie === '') console.error('document.cookie is empty');
}
function setObject(name, object) {
	set(name, JSON.stringify(object));
}
function get(name, defaultValue) {
	if (!isEnabled()) {
		consoleCookieEnabled();
		return;
	}
	var results = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
	if (results) return unescape(results[2]);
	if (typeof defaultValue == 'undefined') return '';
	return defaultValue;
}
function getObject(name, options, optionsDefault) {
	new defaultCookie().getObject(name, options, copyObject(name, optionsDefault));
}
function copyObject(name, objectDefault) {
	return JSON.parse(get(name, JSON.stringify(objectDefault)));
}
function remove(name) {
	if (!isEnabled()) {
		consoleCookieEnabled();
		return;
	}
	var cookie_date = new Date();
	cookie_date.setTime(cookie_date.getTime() - 1);
	document.cookie = name += "=; expires=" + cookie_date.toGMTString();
}
function consoleCookieEnabled() {
	console.error('navigator.cookieEnabled = ' + navigator.cookieEnabled);
}
function defaultCookie(name) {
	this.get = function (defaultValue) {
		return defaultValue;
	};
	this.set = function () {};
	this.getObject = function (name, options, optionsDefault) {
		if (!optionsDefault) return;
		Object.keys(optionsDefault).forEach(function (key) {
			var option = optionsDefault[key];
			if (option !== undefined) options[key] = JSON.parse(JSON.stringify(option));
		});
	};
	this.copyObject = function (name, objectDefault) {
		return JSON.parse(JSON.stringify(objectDefault));
	};
	this.setObject = function () {};
	this.isTrue = function (defaultValue) {
		return defaultValue;
	};
}

export { isEnabled, set, setObject, get, getObject, copyObject, remove, defaultCookie };
//# sourceMappingURL=cookie.module.js.map
