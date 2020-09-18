/**
 * ColorPicker - pure JavaScript color picker.
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
 * @module ColorPicker
 * @description Pure JavaScript color picker.
 * @author [Andrej Hristoliubov]{@link https://anhr.github.io/AboutMe/}
 * @See Thanks to [FlexiColorPicker]{@link https://github.com/DavidDurman/FlexiColorPicker}
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
};loadScript.sync('/anhr/colorpicker/master/colorpicker.css', optionsStyle);
var type = window.SVGAngle || document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1") ? "SVG" : "VML";
var svgNS = 'http://www.w3.org/2000/svg';
var uniqID = 0;
var paletteIndexes = {
	BGRW: 0,
	monochrome: 1,
	bidirectional: 2,
	rainbow: 3
};function create(elSliderWrapper, options) {
	options = options || {};
	options.orientation = options.orientation || 'horizontal';
	function isHorizontal() {
		return options.orientation === "horizontal";
	}
	if (options.direction === undefined) options.direction = true;
	options.style = options.style || {};
	options.style.width = options.style.width || (isHorizontal() ? 200 : 30);
	options.style.height = options.style.height || (isHorizontal() ? 30 : 200);
	options.onError = options.onError || function () {};
	if (elSliderWrapper instanceof HTMLElement !== true) {
		if (typeof elSliderWrapper !== "string") {
			console.error('ColorPicker.create: invalid elSliderWrapper = ' + elSliderWrapper);
			return;
		}
		elSliderWrapper = document.getElementById(elSliderWrapper);
		if (elSliderWrapper === null) {
			console.error('ColorPicker.create: invalid elSliderWrapper = ' + elSliderWrapper);
			return;
		}
	}
	elSliderWrapper.classList.add('slider-wrapper');
	for (var style in options.style) {
		elSliderWrapper.style[style] = options.style[style];
	}
	var palette = options.palette instanceof Palette ? options.palette : new Palette(options);
	var slide;
	function getSlideHeight() {
		if (typeof options.style.height === "string") return parseInt(options.style.height);
		return options.style.height;
	}
	function getSlideWidth() {
		return slide.clientWidth;
	}
	function setValue(value, position) {
		if (slideIndicator === undefined) {
			console.error('Set value of this instance of the ColorPicker is impossible because options.sliderIndicator is not defined.');
			return;
		}
		var c = palette.hsv2rgb(value);
		if (c === undefined) {
			console.error('ColorPicker.setValue: invalud c = ' + c);
			return;
		}
		value = c.percent;
		if (position === undefined) position = isHorizontal() ? getSlideWidth() * value / 100 : getSlideHeight() - getSlideHeight() * (options.direction ? value : 100 - value) / 100;
		positionIndicators(position);
		if (options.sliderIndicator.callback !== undefined) {
			options.sliderIndicator.callback(c);
		}
	}
	var slideIndicator;
	if (options.sliderIndicator !== undefined) {
		slideIndicator = document.createElement('div');
		slideIndicator.className = 'slider-indicator';
		if (isHorizontal()) slideIndicator.style.width = '10px';else slideIndicator.style.height = '10px';
		elSliderWrapper.appendChild(slideIndicator);
		slideIndicator.style.pointerEvents = 'none';
	}
	function positionIndicators(position) {
		if (slideIndicator === undefined) return;
		if (isHorizontal()) {
			if (position < 0 || position > getSlideWidth()) {
				console.error('ColorPicker.positionIndicators: Invalid position = ' + position);
				return;
			}
			slideIndicator.style.top = '0px';
			slideIndicator.style.left = (options.direction ? position : getSlideWidth() - position) - slideIndicator.offsetWidth / 2 + 'px';
		} else {
			if (position < 0 || position > getSlideHeight()) {
				console.error('ColorPicker.positionIndicators: Invalid position = ' + position);
				return;
			}
			slideIndicator.style.left = '0px';
			slideIndicator.style.top = position - slideIndicator.offsetHeight / 2 + 'px';
		}
	}
	if (type == 'SVG') {
		try {
			var linearGradient = 'linearGradient';
			slide = CreateSVGElement('svg', {
				xmlns: 'http://www.w3.org/2000/svg',
				version: '1.1',
				width: isHorizontal() ? '100%' : options.style.width,
				height: options.style.height
			}, [CreateSVGElement('defs', {}, CreateSVGElement(linearGradient, {
				id: 'gradient-hsv-' + uniqID,
				x1: isHorizontal() && options.direction ? '100%' : '0%',
				y1: !isHorizontal() && !options.direction ? '100%' : '0%',
				x2: isHorizontal() && !options.direction ? '100%' : '0%',
				y2: !isHorizontal() && options.direction ? '100%' : '0%'
			}, palette.getPalette())), CreateSVGElement('rect', { x: '0', y: '0', width: '100%', height: '100%', fill: 'url(#gradient-hsv-' + uniqID + ')' })]);
			if (slideIndicator !== undefined) {
				slide.style.cursor = isHorizontal() ? 'e-resize' : 's-resize';
				slideIndicator.style.cursor = slide.style.cursor;
			}
		} catch (e) {
			console.error('Create SVG element failed! ' + e.message);
		}
		elSliderWrapper.appendChild(slide);
		elSliderWrapper.style.height = getSlideHeight() + 'px';
		if (slideIndicator !== undefined) {
			if (isHorizontal()) slideIndicator.style.height = parseInt(options.style.height) - 2 + 'px';else slideIndicator.style.width = parseInt(options.style.width) - 2 + 'px';
			options.sliderIndicator.value = options.sliderIndicator.value || 0;
			setValue(options.sliderIndicator.value);
		}
		uniqID++;
	} else {
		console.error('Under constraction');
	}
	function mouseMove(mouse) {
		mouse.x = parseInt(mouse.x);
		mouse.y = parseInt(mouse.y);
		var position, size, value;
		if (isHorizontal()) {
			position = mouse.x;
			size = getSlideWidth() - 1;
			if (position >= getSlideWidth()) position = size;
			value = position * 100 / size;
			if (!options.direction) {
				value = 100 - value;
				position = size - position;
			}
		} else {
			position = mouse.y;
			size = getSlideHeight() - 1;
			if (position >= getSlideHeight()) position = size;
			value = (1 - position / size) * 100;
			if (!options.direction) {
				value = 100 - value;
			}
		}
		setValue(value, position);
	}
	if (slideIndicator !== undefined) {
		var slideListener = function slideListener() {
			return function (evt) {
				if (mouseout) return;
				evt = evt || window.event;
				function mousePosition(evt) {
					if (window.event && window.event.contentOverflow !== undefined) {
						return { x: window.event.offsetX, y: window.event.offsetY };
					}
					if (evt.offsetX !== undefined && evt.offsetY !== undefined) {
						return { x: evt.offsetX, y: evt.offsetY };
					}
					var wrapper = evt.target.parentNode.parentNode;
					return { x: evt.layerX - wrapper.offsetLeft, y: evt.layerY - wrapper.offsetTop };
				}
				mouseMove(mousePosition(evt));
			};
		};
		var addEventListener = function addEventListener(element, event, listener) {
			if (element === null) return;
			if (element.attachEvent) {
				element.attachEvent('on' + event, listener);
			} else if (element.addEventListener) {
				element.addEventListener(event, listener, false);
			}
		};
		var enableDragging = function enableDragging(ctx, listener) {
			var element = slide;
			addEventListener(element, 'touchstart', function (evt) {});
			addEventListener(element, 'touchmove', function (evt) {
				evt.preventDefault();
				var rect = evt.srcElement.getBoundingClientRect(),
				    x = evt.touches[0].clientX - rect.left,
				    y = evt.touches[0].clientY - rect.top;
				if (x < 0) x = 0;
				if (y < 0) y = 0;
				mouseMove({ x: x, y: y });
			});
			addEventListener(element, 'touchend', function (evt) {});
			addEventListener(element, 'mousedown', function (evt) {
				var mouseup = 'mouseup',
				    mousemove = 'mousemove';
				function onMouseUp() {
					function removeEventListener(element, event, listener) {
						if (element === null) return;
						if (element.detachEvent) {
							element.detachEvent('on' + event, listener);
						} else if (element.removeEventListener) {
							element.removeEventListener(event, listener, false);
						}
					}
					removeEventListener(window, mouseup, onMouseUp);
					removeEventListener(window, mousemove, listener);
				}
				addEventListener(window, mouseup, onMouseUp);
				addEventListener(window, mousemove, listener);
			});
			addEventListener(element, 'mouseout', function (evt) {
				mouseout = true;
			});
			addEventListener(element, 'mouseover', function (evt) {
				mouseout = false;
			});
		};
		var mouseout = false;
		addEventListener(slide, 'click', slideListener());
		enableDragging(this, slideListener());
	}
	return {
		setValue: setValue
	};
}
function CreateSVGElement(el, attrs, children) {
	el = document.createElementNS(svgNS, el);
	for (var key in attrs) {
		el.setAttribute(key, attrs[key]);
	}if (Object.prototype.toString.call(children) != '[object Array]') children = [children];
	var i = 0,
	    len = children[0] && children.length || 0;
	for (; i < len; i++) {
		el.appendChild(children[i]);
	}return el;
}
function Palette(options) {
	function paletteitem(percent, r, g, b) {
		return {
			percent: percent,
			r: r,
			g: g,
			b: b
		};
	}
	options = options || {};
	if (options.palette === undefined) options.palette = paletteIndexes.BGRW;
	var arrayPalette = [new paletteitem(0, 0x00, 0x00, 0xFF),
	new paletteitem(33, 0x00, 0xFF, 0x00),
	new paletteitem(66, 0xFF, 0xFF, 0x00),
	new paletteitem(100, 0xFF, 0xFF, 0xFF)];
	switch (_typeof(options.palette)) {
		case 'number':
			switch (options.palette) {
				case paletteIndexes.BGRW:
					break;
				case paletteIndexes.monochrome:
					var arrayPalette = [new paletteitem(0, 0x00, 0x00, 0x00),
					new paletteitem(100, 0xFF, 0xFF, 0xFF)];
					break;
				case paletteIndexes.bidirectional:
					var arrayPalette = [new paletteitem(0, 0xff, 0x30, 0x30),
					new paletteitem(50, 0x30, 0x30, 0x30),
					new paletteitem(100, 0x30, 0xFF, 0x30)];
					break;
				case paletteIndexes.rainbow:
					var arrayPalette = [new paletteitem(0, 0xff, 0x32, 0x32), new paletteitem(16, 0xfc, 0xf5, 0x28), new paletteitem(32, 0x28, 0xfc, 0x28), new paletteitem(50, 0x28, 0xfc, 0xf8), new paletteitem(66, 0x27, 0x2e, 0xf9), new paletteitem(82, 0xff, 0x28, 0xfb), new paletteitem(100, 0xff, 0x32, 0x32)];
					break;
				default:
					console.error('ColorPicker.create.Palette: invalid options.palette = ' + options.palette);
			}
			break;
		case "object":
			if (Array.isArray(options.palette)) {
				arrayPalette = options.palette;
				break;
			}
		default:
			var message = 'invalid options.palette = ' + options.palette;
			console.error('ColorPicker.create.Palette: ' + message);
			options.onError(message);
	}
	this.getPalette = function () {
		var palette = [];
		arrayPalette.forEach(function (item) {
			palette.unshift(CreateSVGElement('stop', {
				offset: 100 - item.percent + '%', 'stop-color': '#'
				+ ("0" + Number(item.r).toString(16)).slice(-2).toUpperCase() + ("0" + Number(item.g).toString(16)).slice(-2).toUpperCase() + ("0" + Number(item.b).toString(16)).slice(-2).toUpperCase(),
				'stop-opacity': '1'
			}));
		});
		return palette;
	};
	this.hsv2rgb = function (stringPercent, min, max) {
		var percent = parseFloat(stringPercent);
		if (min !== undefined && max !== undefined) percent = 100 / (max - min) * (percent - min);
		var lastPalette = arrayPalette[arrayPalette.length - 1];
		if (lastPalette.percent !== 100) {
			var lastItem = {};
			Object.keys(lastPalette).forEach(function (key) {
				lastItem[key] = lastPalette[key];
			});
			lastItem.percent = 100;
			arrayPalette.push(lastItem);
		}
		var itemPrev;
		for (var i = 0; i < arrayPalette.length; i++) {
			var item = arrayPalette[i];
			if (itemPrev === undefined) itemPrev = item;
			if (percent >= itemPrev.percent && percent <= item.percent) {
				var color = function color(percentPrev, prev, percentItem, item) {
					var percentD = percentItem - percentPrev;
					if (percentD === 0) return prev;
					return Math.round(prev + (item - prev) / percentD * (percent - percentPrev));
				};
				var r = color(itemPrev.percent, itemPrev.r, item.percent, item.r),
				    g = color(itemPrev.percent, itemPrev.g, item.percent, item.g),
				    b = color(itemPrev.percent, itemPrev.b, item.percent, item.b);
				return {
					r: r,
					g: g,
					b: b,
					hex: "#" + (16777216 | b | g << 8 | r << 16).toString(16).slice(1),
					percent: percent
				};
			}
			itemPrev = item;
		}
		if (options.onError !== undefined) options.onError('Invalid color value of the ColorPicker: ' + stringPercent);
	};
	this.toColor = function (value, min, max) {
		if (typeof THREE === 'undefined') {
			console.error('Call ColorPicker.palette.setTHREE(THREE) first.');
			return;
		}
		if (value instanceof THREE.Color) return value;
		var c = this.hsv2rgb(value, min, max);
		if (c === undefined) c = { r: 255, g: 255, b: 255 };
		return new THREE.Color("rgb(" + c.r + ", " + c.g + ", " + c.b + ")");
	};
}
var THREE;
Palette.setTHREE = function (_THREE) {
	if (THREE) {
		if (!Object.is(THREE, _THREE)) console.error('Palette.setTHREE: duplicate THREE. Please use one instance of the THREE library.');
		return;
	}
	THREE = _THREE;
};

export { paletteIndexes, create, Palette };
//# sourceMappingURL=colorpicker.module.js.map
