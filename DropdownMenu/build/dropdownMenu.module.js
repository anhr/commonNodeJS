/**
 * node.js version of the DropdownMenu
 * @author Andrej Hristoliubov https://anhr.github.io/AboutMe/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */

/**
 * node.js version of the synchronous download of the file.
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
function myRequest(options) {
	this.loadXMLDoc = function () {
		var req;
		if (window.XMLHttpRequest) {
			req = new XMLHttpRequest();
			if (!req) throw "new XMLHttpRequest() failed!";
		} else if (window.ActiveXObject) {
			req = this.NewActiveXObject();
			if (!req) throw "NewActiveXObject() failed!";
		} else throw "myRequest.loadXMLDoc(...) failed!";
		return req;
	};
	this.NewActiveXObject = function () {
		try {
			return new ActiveXObject("Msxml2.XMLHTTP.6.0");
		} catch (e) {}
		try {
			return new ActiveXObject("Msxml2.XMLHTTP.3.0");
		} catch (e) {}
		try {
			return new ActiveXObject("Msxml2.XMLHTTP");
		} catch (e) {}
		try {
			return new ActiveXObject("Microsoft.XMLHTTP");
		} catch (e) {}
		ErrorMessage('This browser does not support XMLHttpRequest. Probably, your security settings do not allow Web sites to use ActiveX controls installed on your computer. Refresh your Web page to find out the current status of your Web page or enable the "Initialize and script ActiveX controls not marked as safe" and "Run Active X controls and plug-ins" of the Security settings of the Internet zone of your browser.');
		return null;
	};
	this.XMLHttpRequestStart = function (onreadystatechange, async) {
		this.XMLHttpRequestStop();
		this.req.onreadystatechange = onreadystatechange;
		if ("onerror" in this.req) {
			this.req.onerror = function (event) {
				ErrorMessage("XMLHttpRequest error. url: " + this.url, false, false);
			};
		}
		this.XMLHttpRequestReStart(async);
	};
	this.getUrl = function () {
		if (typeof this.url == 'undefined' || this.url == null) {
			this.url = "XMLHttpRequest.xml";
		}
		return this.url + (this.params ? this.params : "");
	};
	this.XMLHttpRequestReStart = function (async) {
		try {
			if (typeof async == 'undefined') async = true;
			this.req.open("GET", this.getUrl(), async);
			if (async) {
				var timeout = (60 + 30) * 1000;
				if ("timeout" in this.req)
					this.req.timeout = timeout;
				if ("ontimeout" in this.req) this.req.ontimeout = function () {
					ErrorMessage('XMLHttpRequest timeout', false, false);
				};else {
					clearTimeout(this.timeout_id_SendReq);
					this.timeout_id_SendReq = setTimeout(function () {
						ErrorMessage('XMLHttpRequest timeout 2', false, false);
					}, timeout);
				}
			}
			this.req.send(null);
		} catch (e) {
			ErrorMessage(e.message + " url: " + this.url, false, false);
		}
	};
	this.XMLHttpRequestStop = function () {
		if (this.req == null) return;
		this.req.abort();
	};
	this.ProcessReqChange = function (processStatus200) {
		var req = this.req;
		switch (req.readyState) {
			case 4:
				{
					if (typeof req.status == "unknown") {
						consoleError('typeof XMLHttpRequest status == "unknown"');
						return true;
					}
					if (req.status == 200)
						{
							clearTimeout(this.timeout_id_SendReq);
							return processStatus200(this);
						}
					else {
							ErrorMessage("Invalid XMLHttpRequest status : " + req.status + " url: " + this.url);
						}
				}
				break;
			case 1:
			case 2:
			case 3:
				break;
			case 0:
			default:
				throw "processReqChange(); req.readyState = " + req.readyState;
				break;
		}
		return true;
	};
	this.processStatus200Error = function () {
		var error = this.GetElementText('error', true);
		if (error) {
			ErrorMessage(error);
			return true;
		}
		return false;
	};
	this.GetElementText = function (tagName, noDisplayErrorMessage) {
		var xmlhttp = this.req;
		if (!xmlhttp.responseXML) {
			if (noDisplayErrorMessage != true) ErrorMessage('GetXMLElementText(xmlhttp, ' + tagName + '); xmlhttp.responseXML is null.\nxmlhttp.responseText:\n' + xmlhttp.responseText);
			return null;
		}
		var element = xmlhttp.responseXML.getElementsByTagName(tagName);
		if (element.length == 0) {
			if (noDisplayErrorMessage != true) ErrorMessage('GetXMLElementText(xmlhttp, "' + tagName + '"); element.length == ' + element.length);
			return "";
		}
		var text = "";
		for (var i = 0; i < element.length; i++) {
			if (typeof element[i].textContent == 'undefined') {
				if (typeof element[i].text == 'undefined') {
					ErrorMessage('GetXMLElementText(xmlhttp, ' + tagName + '); element[' + i + '].text) == undefined');
					return '';
				}
				if (text != "") text += " ";
				text += element[i].text;
			} else text += element[i].textContent;
		}
		return text;
	};
	if (options.data) {
		this.req = options.data.req;
		this.url = options.data.url;
		this.params = options.data.params;
	} else {
		try {
			this.req = this.loadXMLDoc();
		} catch (e) {
			var message;
			if (typeof e.message == 'undefined') message = e;else message = e.message;
			ErrorMessage("Your browser is too old and is not compatible with our site.\n\n" + window.navigator.appName + " " + window.navigator.appVersion + "\n\n" + message);
			return;
		}
	}
	if (!this.req) {
		consoleError("Invalid myRequest.req: " + this.req);
		return;
	}
	function ErrorMessage(error) {
		console.error(error);
		options.onerror(error);
	}
}
function sync(url, options) {
	options = options || {};
	options.onload = options.onload || function () {};
	options.onerror = options.onerror || function () {};
	var response,
	    request = new myRequest(options);
	request.url = url;
	request.XMLHttpRequestStart(function () {
		request.ProcessReqChange(function (myRequest) {
			if (myRequest.processStatus200Error()) return;
			response = myRequest.req.responseText;
			options.onload(response, url);
			return;
		});
	}, false
	);
	return response;
}

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
function sync$1(src, options) {
	options = options || {};
	options.onload = options.onload || function () {};
	options.onerror = options.onerror || function () {};
	options.appendTo = options.appendTo || document.getElementsByTagName('head')[0];
	if (isScriptExists(options.appendTo, src)) {
		options.onload();
		return;
	}
	if (src instanceof Array) {
		var error,
		    optionsItem = {
			appendTo: options.appendTo,
			tag: options.tag,
			onload: function onload(response, url) {
				console.log('loadScript.sync.onload: ' + url);
			},
			onerror: function onerror(str) {
				options.onerror(str);
				error = str;
			}
		};
		for (var i = 0; i < src.length; i++) {
			var item = src[i];
			loadScriptBase(function (script) {
				script.setAttribute("id", item);
				script.innerHTML = sync(item, optionsItem);
			}, optionsItem);
			if (error !== undefined) break;
		}
		if (error === undefined) options.onload();
	} else loadScriptBase(function (script) {
		script.setAttribute("id", src);
		script.innerHTML = sync(src, options);
	}, options);
}
function async(src, options) {
	options = options || {};
	options.appendTo = options.appendTo || document.getElementsByTagName('head')[0];
	options.onload = options.onload || function () {};
	var isrc;
	function async(srcAsync) {
		function next() {
			if (src instanceof Array && isrc < src.length - 1) {
				isrc++;
				async(src[isrc]);
			} else options.onload();
		}
		if (isScriptExists(options.appendTo, srcAsync, options.onload)) {
			next();
			return;
		}
		loadScriptBase(function (script) {
			script.setAttribute("id", srcAsync);
			function _onload() {
				console.log('loadScript.async.onload() ' + srcAsync);
				if (options.onload !== undefined) {
					next();
				}
			}
			if (script.readyState && !script.onload) {
				script.onreadystatechange = function () {
					if (script.readyState == "complete") {
						if (options.onload !== undefined) options.onload();
					}
					if (script.readyState == "loaded") {
						setTimeout(options.onload, 0);
						this.onreadystatechange = null;
					}
				};
			} else {
				script.onload = _onload;
				script.onerror = function (e) {
					var str = 'loadScript: "' + this.src + '" failed';
					if (options.onerror !== undefined) options.onerror(str, e);
					console.error(str);
				};
			}
			script.src = srcAsync;
		}, options);
	}
	if (src instanceof Array) {
		isrc = 0;
		async(src[isrc]);
	} else async(src);
}
function loadScriptBase(callback, options) {
	options.tag = options.tag || {};
	if (typeof options.tag === "string") {
		switch (options.tag) {
			case 'style':
				options.tag = {
					name: 'style',
					attribute: {
						name: 'rel',
						value: 'stylesheet'
					}
				};
				break;
			default:
				console.error('Invalid options.tag: ' + options.tag);
				return;
		}
	}
	options.tag.name = options.tag.name || 'script';
	var script = document.createElement(options.tag.name);
	options.tag.attribute = options.tag.attribute || {};
	options.tag.attribute.name = options.tag.attribute.name || "type";
	options.tag.attribute.value = options.tag.attribute.value || 'text/javascript';
	script.setAttribute(options.tag.attribute.name, options.tag.attribute.value);
	callback(script);
	options.appendTo.appendChild(script);
}
function isScriptExists(elParent, srcAsync, onload) {
	var scripts = elParent.querySelectorAll('script');
	for (var i = 0; i < scripts.length; i++) {
		var child = scripts[i];
		if (child.id === srcAsync) {
			return true;
		}
	}
	return false;
}

var loadScript = {
  sync: sync$1,
  async: async
};

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

/**
 * @module DropdownMenu
 * @description Creates a drop down menu in your javaScript code.
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
var optionsStyle = {
	tag: 'style'
};var getCurrentScript = function getCurrentScript() {
	if (document.currentScript && document.currentScript.src !== '') return document.currentScript.src;
	var scripts = document.getElementsByTagName('script'),
	    str = scripts[scripts.length - 1].src;
	if (str !== '') return src;
	return new Error().stack.match(/(https?:[^:]*)/)[0];
};
var getCurrentScriptPath = function getCurrentScriptPath() {
	var script = getCurrentScript(),
	    path = script.substring(0, script.lastIndexOf('/'));
	return path;
};
var currentScriptPath = getCurrentScriptPath();
var arrayPath = currentScriptPath.split(/(.*)(\/build)/);
if (arrayPath[2] === '/build') currentScriptPath = arrayPath[1];
arrayPath = currentScriptPath.split(/(.*)(\/canvasMenu)/);
if (arrayPath[2] === '/canvasMenu') currentScriptPath = arrayPath[1] + '/DropdownMenu';
loadScript.sync(currentScriptPath + '/styles/menu.css', optionsStyle);
loadScript.sync(currentScriptPath + '/styles/Decorations/transparent.css', optionsStyle);
loadScript.sync(currentScriptPath + '/styles/Decorations/gradient.css', optionsStyle);
function DropdownMenu(arrayMenu, options) {
	options = options || {};
	options.elParent = options.elParent || document.querySelector('body');
	var elMenu = document.createElement('menu');
	if (options.elParent.classList.contains("container")) elMenu.className = 'controls';
	var timeoutControls;
	function displayControls() {
		elMenu.style.opacity = 1;
		clearTimeout(timeoutControls);
		timeoutControls = setTimeout(function () {
			elMenu.style.opacity = 0;
		}, 5000);
	}
	if (options.canvas) {
		elMenu.style.opacity = 0;
		options.canvas.onmouseout = function (event) {
			elMenu.style.opacity = 0;
		};
		options.canvas.onmousemove = function (event) {
			displayControls();
		};
		elMenu.onmousemove = function (event) {
			displayControls();
		};
	}
	options.elParent.appendChild(elMenu);
	arrayMenu.forEach(function (menuItem) {
		var dropdownChild = 'dropdown-child';
		function moveUpLeft(drop) {
			setTimeout(function () {
				var display = elDropdownChild.style.display;
				elDropdownChild.style.display = 'block';
				if (drop.up) elDropdownChild.style.top = '-' + elDropdownChild.offsetHeight                    + 'px';else elDropdownChild.style.top = elMenuButton.offsetHeight                          - 1 + 'px';
				if (drop.left) elDropdownChild.style.left = elMenuButton.offsetWidth - elDropdownChild.offsetWidth                    + 'px';
				elDropdownChild.style.display = display;
			}, 0);
		}
		var elMenuButton = document.createElement('span');
		elMenuButton.className = 'menuButton' + (options.decorations === undefined ? '' : ' menuButton' + options.decorations);
		if (menuItem.style !== undefined) elMenuButton.style.cssText = menuItem.style;
		if (menuItem.radio !== undefined) elMenuButton.style.cssText = menuItem.style;
		if (menuItem.onclick !== undefined) elMenuButton.onclick = menuItem.onclick;
		if (menuItem.id !== undefined) elMenuButton.id = menuItem.id;
		var name;
		if (typeof menuItem === 'string') name = menuItem;else {
			name = menuItem.name;
			if (menuItem.id) elMenuButton.id = menuItem.id;
			if (menuItem.title) elMenuButton.title = menuItem.title;
		}
		switch (typeof name === 'undefined' ? 'undefined' : _typeof(name)) {
			case "object":
				elMenuButton.appendChild(name);
				break;
			case "string":
			case "undefined":
				elMenuButton.innerHTML = name;
				break;
			default:
				console.error('Invalid typeof name: ' + (typeof name === 'undefined' ? 'undefined' : _typeof(name)));
		}
		if (menuItem.items) {
			var elDropdownChild = document.createElement('span');
			elDropdownChild.className = dropdownChild + ' ' + dropdownChild + (options.decorations === undefined ? 'Default' : options.decorations);
			elDropdownChild.title = '';
			elMenuButton.appendChild(elDropdownChild);
			menuItem.items.forEach(function (itemItem) {
				var elName = document.createElement('nobr'),
				    classChecked = 'checked';
				function getItemName(item) {
					var str = typeof item === 'string' ? item : item.radio === true ? (item.checked ? '◉' : '◎') + ' ' + item.name : item.checkbox === true ? (item.checked ? '☑' : '☐') + ' ' + item.name : item.name;
					return str;
				}
				function getElementFromEvent(event) {
					if (!event) event = window.event;
					return event.target || event.srcElement;
				}
				var name;
				if (typeof itemItem === 'string') name = itemItem;else {
					name = itemItem.name;
					elName.onclick = function (event) {
						if (itemItem.radio === true) {
							menuItem.items.forEach(function (item) {
								if (item.radio === true) {
									if (getElementFromEvent(event) === item.elName) {
										item.checked = true;
										item.elName.classList.add(classChecked);
									} else {
										item.checked = false;
										item.elName.classList.remove(classChecked);
									}
									item.elName.innerHTML = getItemName(item);
								}
							});
						} else if (itemItem.checkbox === true) {
							if (itemItem.checked === true) {
								itemItem.elName.classList.add(classChecked);
							} else {
								itemItem.elName.classList.remove(classChecked);
							}
							itemItem.checked = !itemItem.checked;
							itemItem.elName.innerHTML = getItemName(itemItem);
						}
						if (itemItem.onclick) itemItem.onclick(event);
					};
				}
				if (itemItem.radio === true) elName.classList.add('radio');
				if (itemItem.checkbox === true) elName.classList.add('checkbox');
				elName.innerHTML = getItemName(itemItem);
				if (itemItem.checked === true) elName.classList.add(classChecked);
				elDropdownChild.appendChild(elName);
				if (typeof itemItem !== "string") itemItem.elName = elName;
			});
			if (_typeof(menuItem.drop) === 'object') {
				moveUpLeft(menuItem.drop);
			} else {
				switch (menuItem.drop) {
					case 'up':
						moveUpLeft({
							up: true
						});
						break;
					case 'left':
						moveUpLeft({
							left: true
						});
						break;
					case undefined:
						setTimeout(function () {
							elDropdownChild.style.left = '-' + elMenuButton.clientWidth + 'px';
							elDropdownChild.style.top = elMenuButton.offsetHeight                                   - 1 + 'px';
						}, 0);
						break;
					default:
						console.error('Invalid menuItem.drop: ' + menuItem.drop);
				}
			}
		}
		elMenu.appendChild(elMenuButton);
	});
	return elMenu;
}

export default DropdownMenu;
//# sourceMappingURL=dropdownMenu.module.js.map
