/**
 * @module Player
 * @description 3D objects animation.
 *
 * @author [Andrej Hristoliubov]{@link https://anhr.github.io/AboutMe/}
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
	(factory((global.player = {})));
}(this, (function (exports) { 'use strict';

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

/**
* node.js version of the cookie.
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
var cookie = {
  set: set,
  setObject: setObject,
  get: get,
  getObject: getObject,
  copyObject: copyObject,
  defaultCookie: defaultCookie
};

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();





var defineProperty = function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};



var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

function ___$insertStyle(css) {
  if (!css) {
    return;
  }
  if (typeof window === 'undefined') {
    return;
  }
  var style = document.createElement('style');
  style.setAttribute('type', 'text/css');
  style.innerHTML = css;
  document.head.appendChild(style);
  return css;
}
function colorToString(color, forceCSSHex) {
  var colorFormat = color.__state.conversionName.toString();
  var r = Math.round(color.r);
  var g = Math.round(color.g);
  var b = Math.round(color.b);
  var a = color.a;
  var h = Math.round(color.h);
  var s = color.s.toFixed(1);
  var v = color.v.toFixed(1);
  if (forceCSSHex || colorFormat === 'THREE_CHAR_HEX' || colorFormat === 'SIX_CHAR_HEX') {
    var str = color.hex.toString(16);
    while (str.length < 6) {
      str = '0' + str;
    }
    return '#' + str;
  } else if (colorFormat === 'CSS_RGB') {
    return 'rgb(' + r + ',' + g + ',' + b + ')';
  } else if (colorFormat === 'CSS_RGBA') {
    return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
  } else if (colorFormat === 'HEX') {
    return '0x' + color.hex.toString(16);
  } else if (colorFormat === 'RGB_ARRAY') {
    return '[' + r + ',' + g + ',' + b + ']';
  } else if (colorFormat === 'RGBA_ARRAY') {
    return '[' + r + ',' + g + ',' + b + ',' + a + ']';
  } else if (colorFormat === 'RGB_OBJ') {
    return '{r:' + r + ',g:' + g + ',b:' + b + '}';
  } else if (colorFormat === 'RGBA_OBJ') {
    return '{r:' + r + ',g:' + g + ',b:' + b + ',a:' + a + '}';
  } else if (colorFormat === 'HSV_OBJ') {
    return '{h:' + h + ',s:' + s + ',v:' + v + '}';
  } else if (colorFormat === 'HSVA_OBJ') {
    return '{h:' + h + ',s:' + s + ',v:' + v + ',a:' + a + '}';
  }
  return 'unknown format';
}
var ARR_EACH = Array.prototype.forEach;
var ARR_SLICE = Array.prototype.slice;
var Common = {
  BREAK: {},
  extend: function extend(target) {
    this.each(ARR_SLICE.call(arguments, 1), function (obj) {
      var keys = this.isObject(obj) ? Object.keys(obj) : [];
      keys.forEach(function (key) {
        if (!this.isUndefined(obj[key])) {
          target[key] = obj[key];
        }
      }.bind(this));
    }, this);
    return target;
  },
  defaults: function defaults$$1(target) {
    this.each(ARR_SLICE.call(arguments, 1), function (obj) {
      var keys = this.isObject(obj) ? Object.keys(obj) : [];
      keys.forEach(function (key) {
        if (this.isUndefined(target[key])) {
          target[key] = obj[key];
        }
      }.bind(this));
    }, this);
    return target;
  },
  compose: function compose() {
    var toCall = ARR_SLICE.call(arguments);
    return function () {
      var args = ARR_SLICE.call(arguments);
      for (var i = toCall.length - 1; i >= 0; i--) {
        args = [toCall[i].apply(this, args)];
      }
      return args[0];
    };
  },
  each: function each(obj, itr, scope) {
    if (!obj) {
      return;
    }
    if (ARR_EACH && obj.forEach && obj.forEach === ARR_EACH) {
      obj.forEach(itr, scope);
    } else if (obj.length === obj.length + 0) {
      var key = void 0;
      var l = void 0;
      for (key = 0, l = obj.length; key < l; key++) {
        if (key in obj && itr.call(scope, obj[key], key) === this.BREAK) {
          return;
        }
      }
    } else {
      for (var _key in obj) {
        if (itr.call(scope, obj[_key], _key) === this.BREAK) {
          return;
        }
      }
    }
  },
  defer: function defer(fnc) {
    setTimeout(fnc, 0);
  },
  debounce: function debounce(func, threshold, callImmediately) {
    var timeout = void 0;
    return function () {
      var obj = this;
      var args = arguments;
      function delayed() {
        timeout = null;
        if (!callImmediately) func.apply(obj, args);
      }
      var callNow = callImmediately || !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(delayed, threshold);
      if (callNow) {
        func.apply(obj, args);
      }
    };
  },
  toArray: function toArray$$1(obj) {
    if (obj.toArray) return obj.toArray();
    return ARR_SLICE.call(obj);
  },
  isUndefined: function isUndefined(obj) {
    return obj === undefined;
  },
  isNull: function isNull(obj) {
    return obj === null;
  },
  isNaN: function (_isNaN) {
    function isNaN(_x) {
      return _isNaN.apply(this, arguments);
    }
    isNaN.toString = function () {
      return _isNaN.toString();
    };
    return isNaN;
  }(function (obj) {
    return isNaN(obj);
  }),
  isArray: Array.isArray || function (obj) {
    return obj.constructor === Array;
  },
  isObject: function isObject(obj) {
    return obj === Object(obj);
  },
  isNumber: function isNumber(obj) {
    return obj === obj + 0;
  },
  isString: function isString(obj) {
    return obj === obj + '';
  },
  isBoolean: function isBoolean(obj) {
    return obj === false || obj === true;
  },
  isFunction: function isFunction(obj) {
    return Object.prototype.toString.call(obj) === '[object Function]';
  }
};
var INTERPRETATIONS = [{
  litmus: Common.isString,
  conversions: {
    THREE_CHAR_HEX: {
      read: function read(original) {
        var test = original.match(/^#([A-F0-9])([A-F0-9])([A-F0-9])$/i);
        if (test === null) {
          return false;
        }
        return {
          space: 'HEX',
          hex: parseInt('0x' + test[1].toString() + test[1].toString() + test[2].toString() + test[2].toString() + test[3].toString() + test[3].toString(), 0)
        };
      },
      write: colorToString
    },
    SIX_CHAR_HEX: {
      read: function read(original) {
        var test = original.match(/^#([A-F0-9]{6})$/i);
        if (test === null) {
          return false;
        }
        return {
          space: 'HEX',
          hex: parseInt('0x' + test[1].toString(), 0)
        };
      },
      write: colorToString
    },
    CSS_RGB: {
      read: function read(original) {
        var test = original.match(/^rgb\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\)/);
        if (test === null) {
          return false;
        }
        return {
          space: 'RGB',
          r: parseFloat(test[1]),
          g: parseFloat(test[2]),
          b: parseFloat(test[3])
        };
      },
      write: colorToString
    },
    CSS_RGBA: {
      read: function read(original) {
        var test = original.match(/^rgba\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\)/);
        if (test === null) {
          return false;
        }
        return {
          space: 'RGB',
          r: parseFloat(test[1]),
          g: parseFloat(test[2]),
          b: parseFloat(test[3]),
          a: parseFloat(test[4])
        };
      },
      write: colorToString
    }
  }
}, {
  litmus: Common.isNumber,
  conversions: {
    HEX: {
      read: function read(original) {
        return {
          space: 'HEX',
          hex: original,
          conversionName: 'HEX'
        };
      },
      write: function write(color) {
        return color.hex;
      }
    }
  }
}, {
  litmus: Common.isArray,
  conversions: {
    RGB_ARRAY: {
      read: function read(original) {
        if (original.length !== 3) {
          return false;
        }
        return {
          space: 'RGB',
          r: original[0],
          g: original[1],
          b: original[2]
        };
      },
      write: function write(color) {
        return [color.r, color.g, color.b];
      }
    },
    RGBA_ARRAY: {
      read: function read(original) {
        if (original.length !== 4) return false;
        return {
          space: 'RGB',
          r: original[0],
          g: original[1],
          b: original[2],
          a: original[3]
        };
      },
      write: function write(color) {
        return [color.r, color.g, color.b, color.a];
      }
    }
  }
}, {
  litmus: Common.isObject,
  conversions: {
    RGBA_OBJ: {
      read: function read(original) {
        if (Common.isNumber(original.r) && Common.isNumber(original.g) && Common.isNumber(original.b) && Common.isNumber(original.a)) {
          return {
            space: 'RGB',
            r: original.r,
            g: original.g,
            b: original.b,
            a: original.a
          };
        }
        return false;
      },
      write: function write(color) {
        return {
          r: color.r,
          g: color.g,
          b: color.b,
          a: color.a
        };
      }
    },
    RGB_OBJ: {
      read: function read(original) {
        if (Common.isNumber(original.r) && Common.isNumber(original.g) && Common.isNumber(original.b)) {
          return {
            space: 'RGB',
            r: original.r,
            g: original.g,
            b: original.b
          };
        }
        return false;
      },
      write: function write(color) {
        return {
          r: color.r,
          g: color.g,
          b: color.b
        };
      }
    },
    HSVA_OBJ: {
      read: function read(original) {
        if (Common.isNumber(original.h) && Common.isNumber(original.s) && Common.isNumber(original.v) && Common.isNumber(original.a)) {
          return {
            space: 'HSV',
            h: original.h,
            s: original.s,
            v: original.v,
            a: original.a
          };
        }
        return false;
      },
      write: function write(color) {
        return {
          h: color.h,
          s: color.s,
          v: color.v,
          a: color.a
        };
      }
    },
    HSV_OBJ: {
      read: function read(original) {
        if (Common.isNumber(original.h) && Common.isNumber(original.s) && Common.isNumber(original.v)) {
          return {
            space: 'HSV',
            h: original.h,
            s: original.s,
            v: original.v
          };
        }
        return false;
      },
      write: function write(color) {
        return {
          h: color.h,
          s: color.s,
          v: color.v
        };
      }
    }
  }
}];
var result = void 0;
var toReturn = void 0;
var interpret = function interpret() {
  toReturn = false;
  var original = arguments.length > 1 ? Common.toArray(arguments) : arguments[0];
  Common.each(INTERPRETATIONS, function (family) {
    if (family.litmus(original)) {
      Common.each(family.conversions, function (conversion, conversionName) {
        result = conversion.read(original);
        if (toReturn === false && result !== false) {
          toReturn = result;
          result.conversionName = conversionName;
          result.conversion = conversion;
          return Common.BREAK;
        }
      });
      return Common.BREAK;
    }
  });
  return toReturn;
};
var tmpComponent = void 0;
var ColorMath = {
  hsv_to_rgb: function hsv_to_rgb(h, s, v) {
    var hi = Math.floor(h / 60) % 6;
    var f = h / 60 - Math.floor(h / 60);
    var p = v * (1.0 - s);
    var q = v * (1.0 - f * s);
    var t = v * (1.0 - (1.0 - f) * s);
    var c = [[v, t, p], [q, v, p], [p, v, t], [p, q, v], [t, p, v], [v, p, q]][hi];
    return {
      r: c[0] * 255,
      g: c[1] * 255,
      b: c[2] * 255
    };
  },
  rgb_to_hsv: function rgb_to_hsv(r, g, b) {
    var min = Math.min(r, g, b);
    var max = Math.max(r, g, b);
    var delta = max - min;
    var h = void 0;
    var s = void 0;
    if (max !== 0) {
      s = delta / max;
    } else {
      return {
        h: NaN,
        s: 0,
        v: 0
      };
    }
    if (r === max) {
      h = (g - b) / delta;
    } else if (g === max) {
      h = 2 + (b - r) / delta;
    } else {
      h = 4 + (r - g) / delta;
    }
    h /= 6;
    if (h < 0) {
      h += 1;
    }
    return {
      h: h * 360,
      s: s,
      v: max / 255
    };
  },
  rgb_to_hex: function rgb_to_hex(r, g, b) {
    var hex = this.hex_with_component(0, 2, r);
    hex = this.hex_with_component(hex, 1, g);
    hex = this.hex_with_component(hex, 0, b);
    return hex;
  },
  component_from_hex: function component_from_hex(hex, componentIndex) {
    return hex >> componentIndex * 8 & 0xFF;
  },
  hex_with_component: function hex_with_component(hex, componentIndex, value) {
    return value << (tmpComponent = componentIndex * 8) | hex & ~(0xFF << tmpComponent);
  }
};
var _typeof$1 = typeof Symbol === "function" && _typeof(Symbol.iterator) === "symbol" ? function (obj) {
  return typeof obj === 'undefined' ? 'undefined' : _typeof(obj);
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === 'undefined' ? 'undefined' : _typeof(obj);
};
var classCallCheck$1 = function classCallCheck$$1(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};
var createClass$1 = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();
var get$2 = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);
  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);
    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;
    if (getter === undefined) {
      return undefined;
    }
    return getter.call(receiver);
  }
};
var inherits$1 = function inherits$$1(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === 'undefined' ? 'undefined' : _typeof(superClass)));
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};
var possibleConstructorReturn$1 = function possibleConstructorReturn$$1(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return call && ((typeof call === 'undefined' ? 'undefined' : _typeof(call)) === "object" || typeof call === "function") ? call : self;
};
var Color = function () {
  function Color() {
    classCallCheck$1(this, Color);
    this.__state = interpret.apply(this, arguments);
    if (this.__state === false) {
      throw new Error('Failed to interpret color arguments');
    }
    this.__state.a = this.__state.a || 1;
  }
  createClass$1(Color, [{
    key: 'toString',
    value: function toString() {
      return colorToString(this);
    }
  }, {
    key: 'toHexString',
    value: function toHexString() {
      return colorToString(this, true);
    }
  }, {
    key: 'toOriginal',
    value: function toOriginal() {
      return this.__state.conversion.write(this);
    }
  }]);
  return Color;
}();
function defineRGBComponent(target, component, componentHexIndex) {
  Object.defineProperty(target, component, {
    get: function get$$1() {
      if (this.__state.space === 'RGB') {
        return this.__state[component];
      }
      Color.recalculateRGB(this, component, componentHexIndex);
      return this.__state[component];
    },
    set: function set$$1(v) {
      if (this.__state.space !== 'RGB') {
        Color.recalculateRGB(this, component, componentHexIndex);
        this.__state.space = 'RGB';
      }
      this.__state[component] = v;
    }
  });
}
function defineHSVComponent(target, component) {
  Object.defineProperty(target, component, {
    get: function get$$1() {
      if (this.__state.space === 'HSV') {
        return this.__state[component];
      }
      Color.recalculateHSV(this);
      return this.__state[component];
    },
    set: function set$$1(v) {
      if (this.__state.space !== 'HSV') {
        Color.recalculateHSV(this);
        this.__state.space = 'HSV';
      }
      this.__state[component] = v;
    }
  });
}
Color.recalculateRGB = function (color, component, componentHexIndex) {
  if (color.__state.space === 'HEX') {
    color.__state[component] = ColorMath.component_from_hex(color.__state.hex, componentHexIndex);
  } else if (color.__state.space === 'HSV') {
    Common.extend(color.__state, ColorMath.hsv_to_rgb(color.__state.h, color.__state.s, color.__state.v));
  } else {
    throw new Error('Corrupted color state');
  }
};
Color.recalculateHSV = function (color) {
  var result = ColorMath.rgb_to_hsv(color.r, color.g, color.b);
  Common.extend(color.__state, {
    s: result.s,
    v: result.v
  });
  if (!Common.isNaN(result.h)) {
    color.__state.h = result.h;
  } else if (Common.isUndefined(color.__state.h)) {
    color.__state.h = 0;
  }
};
Color.COMPONENTS = ['r', 'g', 'b', 'h', 's', 'v', 'hex', 'a'];
defineRGBComponent(Color.prototype, 'r', 2);
defineRGBComponent(Color.prototype, 'g', 1);
defineRGBComponent(Color.prototype, 'b', 0);
defineHSVComponent(Color.prototype, 'h');
defineHSVComponent(Color.prototype, 's');
defineHSVComponent(Color.prototype, 'v');
Object.defineProperty(Color.prototype, 'a', {
  get: function get$$1() {
    return this.__state.a;
  },
  set: function set$$1(v) {
    this.__state.a = v;
  }
});
Object.defineProperty(Color.prototype, 'hex', {
  get: function get$$1() {
    if (!this.__state.space !== 'HEX') {
      this.__state.hex = ColorMath.rgb_to_hex(this.r, this.g, this.b);
    }
    return this.__state.hex;
  },
  set: function set$$1(v) {
    this.__state.space = 'HEX';
    this.__state.hex = v;
  }
});
var Controller = function () {
  function Controller(object, property) {
    classCallCheck$1(this, Controller);
    this.initialValue = object[property];
    this.domElement = document.createElement('div');
    this.object = object;
    this.property = property;
    this.__onChange = undefined;
    this.__onFinishChange = undefined;
  }
  createClass$1(Controller, [{
    key: 'onChange',
    value: function onChange(fnc) {
      this.__onChange = fnc;
      return this;
    }
  }, {
    key: 'onFinishChange',
    value: function onFinishChange(fnc) {
      this.__onFinishChange = fnc;
      return this;
    }
  }, {
    key: 'setValue',
    value: function setValue(newValue) {
      this.object[this.property] = newValue;
      if (this.__onChange) {
        this.__onChange.call(this, newValue);
      }
      this.updateDisplay();
      return this;
    }
  }, {
    key: 'getValue',
    value: function getValue() {
      return this.object[this.property];
    }
  }, {
    key: 'updateDisplay',
    value: function updateDisplay() {
      return this;
    }
  }, {
    key: 'isModified',
    value: function isModified() {
      return this.initialValue !== this.getValue();
    }
  }]);
  return Controller;
}();
var EVENT_MAP = {
  HTMLEvents: ['change'],
  MouseEvents: ['click', 'mousemove', 'mousedown', 'mouseup', 'mouseover'],
  KeyboardEvents: ['keydown']
};
var EVENT_MAP_INV = {};
Common.each(EVENT_MAP, function (v, k) {
  Common.each(v, function (e) {
    EVENT_MAP_INV[e] = k;
  });
});
var CSS_VALUE_PIXELS = /(\d+(\.\d+)?)px/;
function cssValueToPixels(val) {
  if (val === '0' || Common.isUndefined(val)) {
    return 0;
  }
  var match = val.match(CSS_VALUE_PIXELS);
  if (!Common.isNull(match)) {
    return parseFloat(match[1]);
  }
  return 0;
}
var dom = {
  makeSelectable: function makeSelectable(elem, selectable) {
    if (elem === undefined || elem.style === undefined) return;
    elem.onselectstart = selectable ? function () {
      return false;
    } : function () {};
    elem.style.MozUserSelect = selectable ? 'auto' : 'none';
    elem.style.KhtmlUserSelect = selectable ? 'auto' : 'none';
    elem.unselectable = selectable ? 'on' : 'off';
  },
  makeFullscreen: function makeFullscreen(elem, hor, vert) {
    var vertical = vert;
    var horizontal = hor;
    if (Common.isUndefined(horizontal)) {
      horizontal = true;
    }
    if (Common.isUndefined(vertical)) {
      vertical = true;
    }
    elem.style.position = 'absolute';
    if (horizontal) {
      elem.style.left = 0;
      elem.style.right = 0;
    }
    if (vertical) {
      elem.style.top = 0;
      elem.style.bottom = 0;
    }
  },
  fakeEvent: function fakeEvent(elem, eventType, pars, aux) {
    var params = pars || {};
    var className = EVENT_MAP_INV[eventType];
    if (!className) {
      throw new Error('Event type ' + eventType + ' not supported.');
    }
    var evt = document.createEvent(className);
    switch (className) {
      case 'MouseEvents':
        {
          var clientX = params.x || params.clientX || 0;
          var clientY = params.y || params.clientY || 0;
          evt.initMouseEvent(eventType, params.bubbles || false, params.cancelable || true, window, params.clickCount || 1, 0, 0, clientX, clientY, false, false, false, false, 0, null);
          break;
        }
      case 'KeyboardEvents':
        {
          var init = evt.initKeyboardEvent || evt.initKeyEvent;
          Common.defaults(params, {
            cancelable: true,
            ctrlKey: false,
            altKey: false,
            shiftKey: false,
            metaKey: false,
            keyCode: undefined,
            charCode: undefined
          });
          init(eventType, params.bubbles || false, params.cancelable, window, params.ctrlKey, params.altKey, params.shiftKey, params.metaKey, params.keyCode, params.charCode);
          break;
        }
      default:
        {
          evt.initEvent(eventType, params.bubbles || false, params.cancelable || true);
          break;
        }
    }
    Common.defaults(evt, aux);
    elem.dispatchEvent(evt);
  },
  bind: function bind(elem, event, func, newBool) {
    var bool = newBool || false;
    if (elem.addEventListener) {
      elem.addEventListener(event, func, bool);
    } else if (elem.attachEvent) {
      elem.attachEvent('on' + event, func);
    }
    return dom;
  },
  unbind: function unbind(elem, event, func, newBool) {
    var bool = newBool || false;
    if (elem.removeEventListener) {
      elem.removeEventListener(event, func, bool);
    } else if (elem.detachEvent) {
      elem.detachEvent('on' + event, func);
    }
    return dom;
  },
  addClass: function addClass(elem, className) {
    if (elem.className === undefined) {
      elem.className = className;
    } else if (elem.className !== className) {
      var classes = elem.className.split(/ +/);
      if (classes.indexOf(className) === -1) {
        classes.push(className);
        elem.className = classes.join(' ').replace(/^\s+/, '').replace(/\s+$/, '');
      }
    }
    return dom;
  },
  removeClass: function removeClass(elem, className) {
    if (className) {
      if (elem.className === className) {
        elem.removeAttribute('class');
      } else {
        var classes = elem.className.split(/ +/);
        var index = classes.indexOf(className);
        if (index !== -1) {
          classes.splice(index, 1);
          elem.className = classes.join(' ');
        }
      }
    } else {
      elem.className = undefined;
    }
    return dom;
  },
  hasClass: function hasClass(elem, className) {
    return new RegExp('(?:^|\\s+)' + className + '(?:\\s+|$)').test(elem.className) || false;
  },
  getWidth: function getWidth(elem) {
    var style = getComputedStyle(elem);
    return cssValueToPixels(style['border-left-width']) + cssValueToPixels(style['border-right-width']) + cssValueToPixels(style['padding-left']) + cssValueToPixels(style['padding-right']) + cssValueToPixels(style.width);
  },
  getHeight: function getHeight(elem) {
    var style = getComputedStyle(elem);
    return cssValueToPixels(style['border-top-width']) + cssValueToPixels(style['border-bottom-width']) + cssValueToPixels(style['padding-top']) + cssValueToPixels(style['padding-bottom']) + cssValueToPixels(style.height);
  },
  getOffset: function getOffset(el) {
    var elem = el;
    var offset = { left: 0, top: 0 };
    if (elem.offsetParent) {
      do {
        offset.left += elem.offsetLeft;
        offset.top += elem.offsetTop;
        elem = elem.offsetParent;
      } while (elem);
    }
    return offset;
  },
  isActive: function isActive(elem) {
    return elem === document.activeElement && (elem.type || elem.href);
  }
};
var BooleanController = function (_Controller) {
  inherits$1(BooleanController, _Controller);
  function BooleanController(object, property) {
    classCallCheck$1(this, BooleanController);
    var _this2 = possibleConstructorReturn$1(this, (BooleanController.__proto__ || Object.getPrototypeOf(BooleanController)).call(this, object, property));
    var _this = _this2;
    _this2.__prev = _this2.getValue();
    _this2.__checkbox = document.createElement('input');
    _this2.__checkbox.setAttribute('type', 'checkbox');
    function onChange() {
      _this.setValue(!_this.__prev);
    }
    dom.bind(_this2.__checkbox, 'change', onChange, false);
    _this2.domElement.appendChild(_this2.__checkbox);
    _this2.updateDisplay();
    return _this2;
  }
  createClass$1(BooleanController, [{
    key: 'setValue',
    value: function setValue(v) {
      var toReturn = get$2(BooleanController.prototype.__proto__ || Object.getPrototypeOf(BooleanController.prototype), 'setValue', this).call(this, v);
      if (this.__onFinishChange) {
        this.__onFinishChange.call(this, this.getValue());
      }
      this.__prev = this.getValue();
      return toReturn;
    }
  }, {
    key: 'updateDisplay',
    value: function updateDisplay() {
      if (this.getValue() === true) {
        this.__checkbox.setAttribute('checked', 'checked');
        this.__checkbox.checked = true;
        this.__prev = true;
      } else {
        this.__checkbox.checked = false;
        this.__prev = false;
      }
      return get$2(BooleanController.prototype.__proto__ || Object.getPrototypeOf(BooleanController.prototype), 'updateDisplay', this).call(this);
    }
  }]);
  return BooleanController;
}(Controller);
var OptionController = function (_Controller) {
  inherits$1(OptionController, _Controller);
  function OptionController(object, property, opts) {
    classCallCheck$1(this, OptionController);
    var _this2 = possibleConstructorReturn$1(this, (OptionController.__proto__ || Object.getPrototypeOf(OptionController)).call(this, object, property));
    var options = opts;
    var _this = _this2;
    _this2.__select = document.createElement('select');
    if (Common.isArray(options)) {
      var map = {};
      Common.each(options, function (element) {
        map[element] = element;
      });
      options = map;
    }
    Common.each(options, function (value, key) {
      var opt = document.createElement('option');
      opt.innerHTML = key;
      opt.setAttribute('value', value);
      _this.__select.appendChild(opt);
    });
    _this2.updateDisplay();
    dom.bind(_this2.__select, 'change', function () {
      var desiredValue = this.options[this.selectedIndex].value;
      _this.setValue(desiredValue);
    });
    _this2.domElement.appendChild(_this2.__select);
    return _this2;
  }
  createClass$1(OptionController, [{
    key: 'setValue',
    value: function setValue(v) {
      var toReturn = get$2(OptionController.prototype.__proto__ || Object.getPrototypeOf(OptionController.prototype), 'setValue', this).call(this, v);
      if (this.__onFinishChange) {
        this.__onFinishChange.call(this, this.getValue());
      }
      return toReturn;
    }
  }, {
    key: 'updateDisplay',
    value: function updateDisplay() {
      if (dom.isActive(this.__select)) return this;
      this.__select.value = this.getValue();
      return get$2(OptionController.prototype.__proto__ || Object.getPrototypeOf(OptionController.prototype), 'updateDisplay', this).call(this);
    }
  }]);
  return OptionController;
}(Controller);
var StringController = function (_Controller) {
  inherits$1(StringController, _Controller);
  function StringController(object, property) {
    classCallCheck$1(this, StringController);
    var _this2 = possibleConstructorReturn$1(this, (StringController.__proto__ || Object.getPrototypeOf(StringController)).call(this, object, property));
    var _this = _this2;
    function onChange() {
      _this.setValue(_this.__input.value);
    }
    function onBlur() {
      if (_this.__onFinishChange) {
        _this.__onFinishChange.call(_this, _this.getValue());
      }
    }
    _this2.__input = document.createElement('input');
    _this2.__input.setAttribute('type', 'text');
    dom.bind(_this2.__input, 'keyup', onChange);
    dom.bind(_this2.__input, 'change', onChange);
    dom.bind(_this2.__input, 'blur', onBlur);
    dom.bind(_this2.__input, 'keydown', function (e) {
      if (e.keyCode === 13) {
        this.blur();
      }
    });
    _this2.updateDisplay();
    _this2.domElement.appendChild(_this2.__input);
    return _this2;
  }
  createClass$1(StringController, [{
    key: 'updateDisplay',
    value: function updateDisplay() {
      if (!dom.isActive(this.__input)) {
        this.__input.value = this.getValue();
      }
      return get$2(StringController.prototype.__proto__ || Object.getPrototypeOf(StringController.prototype), 'updateDisplay', this).call(this);
    }
  }]);
  return StringController;
}(Controller);
function numDecimals(x) {
  var _x = x.toString();
  if (_x.indexOf('.') > -1) {
    return _x.length - _x.indexOf('.') - 1;
  }
  return 0;
}
var NumberController = function (_Controller) {
  inherits$1(NumberController, _Controller);
  function NumberController(object, property, params) {
    classCallCheck$1(this, NumberController);
    var _this = possibleConstructorReturn$1(this, (NumberController.__proto__ || Object.getPrototypeOf(NumberController)).call(this, object, property));
    var _params = params || {};
    _this.__min = _params.min;
    _this.__max = _params.max;
    _this.__step = _params.step;
    if (Common.isUndefined(_this.__step)) {
      if (_this.initialValue === 0) {
        _this.__impliedStep = 1;
      } else {
        _this.__impliedStep = Math.pow(10, Math.floor(Math.log(Math.abs(_this.initialValue)) / Math.LN10)) / 10;
      }
    } else {
      _this.__impliedStep = _this.__step;
    }
    _this.__precision = numDecimals(_this.__impliedStep);
    return _this;
  }
  createClass$1(NumberController, [{
    key: 'setValue',
    value: function setValue(v) {
      var _v = v;
      if (this.__min !== undefined && _v < this.__min) {
        _v = this.__min;
      } else if (this.__max !== undefined && _v > this.__max) {
        _v = this.__max;
      }
      if (this.__step !== undefined && _v % this.__step !== 0) {
        _v = Math.round(_v / this.__step) * this.__step;
      }
      return get$2(NumberController.prototype.__proto__ || Object.getPrototypeOf(NumberController.prototype), 'setValue', this).call(this, _v);
    }
  }, {
    key: 'min',
    value: function min(minValue) {
      this.__min = minValue;
      return this;
    }
  }, {
    key: 'max',
    value: function max(maxValue) {
      this.__max = maxValue;
      return this;
    }
  }, {
    key: 'step',
    value: function step(stepValue) {
      this.__step = stepValue;
      this.__impliedStep = stepValue;
      this.__precision = numDecimals(stepValue);
      return this;
    }
  }]);
  return NumberController;
}(Controller);
function roundToDecimal(value, decimals) {
  var tenTo = Math.pow(10, decimals);
  return Math.round(value * tenTo) / tenTo;
}
var NumberControllerBox = function (_NumberController) {
  inherits$1(NumberControllerBox, _NumberController);
  function NumberControllerBox(object, property, params) {
    classCallCheck$1(this, NumberControllerBox);
    var _this2 = possibleConstructorReturn$1(this, (NumberControllerBox.__proto__ || Object.getPrototypeOf(NumberControllerBox)).call(this, object, property, params));
    _this2.__truncationSuspended = false;
    var _this = _this2;
    var prevY = void 0;
    function onChange() {
      var attempted = parseFloat(_this.__input.value);
      if (!Common.isNaN(attempted)) {
        _this.setValue(attempted);
      }
    }
    function onFinish() {
      if (_this.__onFinishChange) {
        _this.__onFinishChange.call(_this, _this.getValue());
      }
    }
    function onBlur() {
      onFinish();
    }
    function onMouseDrag(e) {
      var diff = prevY - e.clientY;
      _this.setValue(_this.getValue() + diff * _this.__impliedStep);
      prevY = e.clientY;
    }
    function onMouseUp() {
      dom.unbind(window, 'mousemove', onMouseDrag);
      dom.unbind(window, 'mouseup', onMouseUp);
      onFinish();
    }
    function onMouseDown(e) {
      dom.bind(window, 'mousemove', onMouseDrag);
      dom.bind(window, 'mouseup', onMouseUp);
      prevY = e.clientY;
    }
    _this2.__input = document.createElement('input');
    _this2.__input.setAttribute('type', 'text');
    dom.bind(_this2.__input, 'change', onChange);
    dom.bind(_this2.__input, 'blur', onBlur);
    dom.bind(_this2.__input, 'mousedown', onMouseDown);
    dom.bind(_this2.__input, 'keydown', function (e) {
      if (e.keyCode === 13) {
        _this.__truncationSuspended = true;
        this.blur();
        _this.__truncationSuspended = false;
        onFinish();
      }
    });
    _this2.updateDisplay();
    _this2.domElement.appendChild(_this2.__input);
    return _this2;
  }
  createClass$1(NumberControllerBox, [{
    key: 'updateDisplay',
    value: function updateDisplay() {
      this.__input.value = this.__truncationSuspended ? this.getValue() : roundToDecimal(this.getValue(), this.__precision);
      return get$2(NumberControllerBox.prototype.__proto__ || Object.getPrototypeOf(NumberControllerBox.prototype), 'updateDisplay', this).call(this);
    }
  }]);
  return NumberControllerBox;
}(NumberController);
function map(v, i1, i2, o1, o2) {
  return o1 + (o2 - o1) * ((v - i1) / (i2 - i1));
}
var NumberControllerSlider = function (_NumberController) {
  inherits$1(NumberControllerSlider, _NumberController);
  function NumberControllerSlider(object, property, min, max, step) {
    classCallCheck$1(this, NumberControllerSlider);
    var _this2 = possibleConstructorReturn$1(this, (NumberControllerSlider.__proto__ || Object.getPrototypeOf(NumberControllerSlider)).call(this, object, property, { min: min, max: max, step: step }));
    var _this = _this2;
    _this2.__background = document.createElement('div');
    _this2.__foreground = document.createElement('div');
    dom.bind(_this2.__background, 'mousedown', onMouseDown);
    dom.bind(_this2.__background, 'touchstart', onTouchStart);
    dom.addClass(_this2.__background, 'slider');
    dom.addClass(_this2.__foreground, 'slider-fg');
    function onMouseDown(e) {
      document.activeElement.blur();
      dom.bind(window, 'mousemove', onMouseDrag);
      dom.bind(window, 'mouseup', onMouseUp);
      onMouseDrag(e);
    }
    function onMouseDrag(e) {
      e.preventDefault();
      var bgRect = _this.__background.getBoundingClientRect();
      _this.setValue(map(e.clientX, bgRect.left, bgRect.right, _this.__min, _this.__max));
      return false;
    }
    function onMouseUp() {
      dom.unbind(window, 'mousemove', onMouseDrag);
      dom.unbind(window, 'mouseup', onMouseUp);
      if (_this.__onFinishChange) {
        _this.__onFinishChange.call(_this, _this.getValue());
      }
    }
    function onTouchStart(e) {
      if (e.touches.length !== 1) {
        return;
      }
      dom.bind(window, 'touchmove', onTouchMove);
      dom.bind(window, 'touchend', onTouchEnd);
      onTouchMove(e);
    }
    function onTouchMove(e) {
      var clientX = e.touches[0].clientX;
      var bgRect = _this.__background.getBoundingClientRect();
      _this.setValue(map(clientX, bgRect.left, bgRect.right, _this.__min, _this.__max));
    }
    function onTouchEnd() {
      dom.unbind(window, 'touchmove', onTouchMove);
      dom.unbind(window, 'touchend', onTouchEnd);
      if (_this.__onFinishChange) {
        _this.__onFinishChange.call(_this, _this.getValue());
      }
    }
    _this2.updateDisplay();
    _this2.__background.appendChild(_this2.__foreground);
    _this2.domElement.appendChild(_this2.__background);
    return _this2;
  }
  createClass$1(NumberControllerSlider, [{
    key: 'updateDisplay',
    value: function updateDisplay() {
      var pct = (this.getValue() - this.__min) / (this.__max - this.__min);
      this.__foreground.style.width = pct * 100 + '%';
      return get$2(NumberControllerSlider.prototype.__proto__ || Object.getPrototypeOf(NumberControllerSlider.prototype), 'updateDisplay', this).call(this);
    }
  }]);
  return NumberControllerSlider;
}(NumberController);
var FunctionController = function (_Controller) {
  inherits$1(FunctionController, _Controller);
  function FunctionController(object, property, text) {
    classCallCheck$1(this, FunctionController);
    var _this2 = possibleConstructorReturn$1(this, (FunctionController.__proto__ || Object.getPrototypeOf(FunctionController)).call(this, object, property));
    var _this = _this2;
    _this2.__button = document.createElement('div');
    _this2.__button.innerHTML = text === undefined ? 'Fire' : text;
    dom.bind(_this2.__button, 'click', function (e) {
      e.preventDefault();
      _this.fire();
      return false;
    });
    dom.addClass(_this2.__button, 'button');
    _this2.domElement.appendChild(_this2.__button);
    return _this2;
  }
  createClass$1(FunctionController, [{
    key: 'fire',
    value: function fire() {
      if (this.__onChange) {
        this.__onChange.call(this);
      }
      this.getValue().call(this.object);
      if (this.__onFinishChange) {
        this.__onFinishChange.call(this, this.getValue());
      }
    }
  }]);
  return FunctionController;
}(Controller);
var ColorController = function (_Controller) {
  inherits$1(ColorController, _Controller);
  function ColorController(object, property) {
    classCallCheck$1(this, ColorController);
    var _this2 = possibleConstructorReturn$1(this, (ColorController.__proto__ || Object.getPrototypeOf(ColorController)).call(this, object, property));
    _this2.__color = new Color(_this2.getValue());
    _this2.__temp = new Color(0);
    var _this = _this2;
    _this2.domElement = document.createElement('div');
    dom.makeSelectable(_this2.domElement, false);
    _this2.__selector = document.createElement('div');
    _this2.__selector.className = 'selector';
    _this2.__saturation_field = document.createElement('div');
    _this2.__saturation_field.className = 'saturation-field';
    _this2.__field_knob = document.createElement('div');
    _this2.__field_knob.className = 'field-knob';
    _this2.__field_knob_border = '2px solid ';
    _this2.__hue_knob = document.createElement('div');
    _this2.__hue_knob.className = 'hue-knob';
    _this2.__hue_field = document.createElement('div');
    _this2.__hue_field.className = 'hue-field';
    _this2.__input = document.createElement('input');
    _this2.__input.type = 'text';
    _this2.__input_textShadow = '0 1px 1px ';
    dom.bind(_this2.__input, 'keydown', function (e) {
      if (e.keyCode === 13) {
        onBlur.call(this);
      }
    });
    dom.bind(_this2.__input, 'blur', onBlur);
    dom.bind(_this2.__selector, 'mousedown', function () {
      dom.addClass(this, 'drag').bind(window, 'mouseup', function () {
        dom.removeClass(_this.__selector, 'drag');
      });
    });
    dom.bind(_this2.__selector, 'touchstart', function () {
      dom.addClass(this, 'drag').bind(window, 'touchend', function () {
        dom.removeClass(_this.__selector, 'drag');
      });
    });
    var valueField = document.createElement('div');
    Common.extend(_this2.__selector.style, {
      width: '122px',
      height: '102px',
      padding: '3px',
      backgroundColor: '#222',
      boxShadow: '0px 1px 3px rgba(0,0,0,0.3)'
    });
    Common.extend(_this2.__field_knob.style, {
      position: 'absolute',
      width: '12px',
      height: '12px',
      border: _this2.__field_knob_border + (_this2.__color.v < 0.5 ? '#fff' : '#000'),
      boxShadow: '0px 1px 3px rgba(0,0,0,0.5)',
      borderRadius: '12px',
      zIndex: 1
    });
    Common.extend(_this2.__hue_knob.style, {
      position: 'absolute',
      width: '15px',
      height: '2px',
      borderRight: '4px solid #fff',
      zIndex: 1
    });
    Common.extend(_this2.__saturation_field.style, {
      width: '100px',
      height: '100px',
      border: '1px solid #555',
      marginRight: '3px',
      display: 'inline-block',
      cursor: 'pointer'
    });
    Common.extend(valueField.style, {
      width: '100%',
      height: '100%',
      background: 'none'
    });
    linearGradient(valueField, 'top', 'rgba(0,0,0,0)', '#000');
    Common.extend(_this2.__hue_field.style, {
      width: '15px',
      height: '100px',
      border: '1px solid #555',
      cursor: 'ns-resize',
      position: 'absolute',
      top: '3px',
      right: '3px'
    });
    hueGradient(_this2.__hue_field);
    Common.extend(_this2.__input.style, {
      outline: 'none',
      textAlign: 'center',
      color: '#fff',
      border: 0,
      fontWeight: 'bold',
      textShadow: _this2.__input_textShadow + 'rgba(0,0,0,0.7)'
    });
    dom.bind(_this2.__saturation_field, 'mousedown', fieldDown);
    dom.bind(_this2.__saturation_field, 'touchstart', fieldDown);
    dom.bind(_this2.__field_knob, 'mousedown', fieldDown);
    dom.bind(_this2.__field_knob, 'touchstart', fieldDown);
    dom.bind(_this2.__hue_field, 'mousedown', fieldDownH);
    dom.bind(_this2.__hue_field, 'touchstart', fieldDownH);
    function fieldDown(e) {
      setSV(e);
      dom.bind(window, 'mousemove', setSV);
      dom.bind(window, 'touchmove', setSV);
      dom.bind(window, 'mouseup', fieldUpSV);
      dom.bind(window, 'touchend', fieldUpSV);
    }
    function fieldDownH(e) {
      setH(e);
      dom.bind(window, 'mousemove', setH);
      dom.bind(window, 'touchmove', setH);
      dom.bind(window, 'mouseup', fieldUpH);
      dom.bind(window, 'touchend', fieldUpH);
    }
    function fieldUpSV() {
      dom.unbind(window, 'mousemove', setSV);
      dom.unbind(window, 'touchmove', setSV);
      dom.unbind(window, 'mouseup', fieldUpSV);
      dom.unbind(window, 'touchend', fieldUpSV);
      onFinish();
    }
    function fieldUpH() {
      dom.unbind(window, 'mousemove', setH);
      dom.unbind(window, 'touchmove', setH);
      dom.unbind(window, 'mouseup', fieldUpH);
      dom.unbind(window, 'touchend', fieldUpH);
      onFinish();
    }
    function onBlur() {
      var i = interpret(this.value);
      if (i !== false) {
        _this.__color.__state = i;
        _this.setValue(_this.__color.toOriginal());
      } else {
        this.value = _this.__color.toString();
      }
    }
    function onFinish() {
      if (_this.__onFinishChange) {
        _this.__onFinishChange.call(_this, _this.__color.toOriginal());
      }
    }
    _this2.__saturation_field.appendChild(valueField);
    _this2.__selector.appendChild(_this2.__field_knob);
    _this2.__selector.appendChild(_this2.__saturation_field);
    _this2.__selector.appendChild(_this2.__hue_field);
    _this2.__hue_field.appendChild(_this2.__hue_knob);
    _this2.domElement.appendChild(_this2.__input);
    _this2.domElement.appendChild(_this2.__selector);
    _this2.updateDisplay();
    function setSV(e) {
      if (e.type.indexOf('touch') === -1) {
        e.preventDefault();
      }
      var fieldRect = _this.__saturation_field.getBoundingClientRect();
      var _ref = e.touches && e.touches[0] || e,
          clientX = _ref.clientX,
          clientY = _ref.clientY;
      var s = (clientX - fieldRect.left) / (fieldRect.right - fieldRect.left);
      var v = 1 - (clientY - fieldRect.top) / (fieldRect.bottom - fieldRect.top);
      if (v > 1) {
        v = 1;
      } else if (v < 0) {
        v = 0;
      }
      if (s > 1) {
        s = 1;
      } else if (s < 0) {
        s = 0;
      }
      _this.__color.v = v;
      _this.__color.s = s;
      _this.setValue(_this.__color.toOriginal());
      return false;
    }
    function setH(e) {
      if (e.type.indexOf('touch') === -1) {
        e.preventDefault();
      }
      var fieldRect = _this.__hue_field.getBoundingClientRect();
      var _ref2 = e.touches && e.touches[0] || e,
          clientY = _ref2.clientY;
      var h = 1 - (clientY - fieldRect.top) / (fieldRect.bottom - fieldRect.top);
      if (h > 1) {
        h = 1;
      } else if (h < 0) {
        h = 0;
      }
      _this.__color.h = h * 360;
      _this.setValue(_this.__color.toOriginal());
      return false;
    }
    return _this2;
  }
  createClass$1(ColorController, [{
    key: 'updateDisplay',
    value: function updateDisplay() {
      var i = interpret(this.getValue());
      if (i !== false) {
        var mismatch = false;
        Common.each(Color.COMPONENTS, function (component) {
          if (!Common.isUndefined(i[component]) && !Common.isUndefined(this.__color.__state[component]) && i[component] !== this.__color.__state[component]) {
            mismatch = true;
            return {};
          }
        }, this);
        if (mismatch) {
          Common.extend(this.__color.__state, i);
        }
      }
      Common.extend(this.__temp.__state, this.__color.__state);
      this.__temp.a = 1;
      var flip = this.__color.v < 0.5 || this.__color.s > 0.5 ? 255 : 0;
      var _flip = 255 - flip;
      Common.extend(this.__field_knob.style, {
        marginLeft: 100 * this.__color.s - 7 + 'px',
        marginTop: 100 * (1 - this.__color.v) - 7 + 'px',
        backgroundColor: this.__temp.toHexString(),
        border: this.__field_knob_border + 'rgb(' + flip + ',' + flip + ',' + flip + ')'
      });
      this.__hue_knob.style.marginTop = (1 - this.__color.h / 360) * 100 + 'px';
      this.__temp.s = 1;
      this.__temp.v = 1;
      linearGradient(this.__saturation_field, 'left', '#fff', this.__temp.toHexString());
      this.__input.value = this.__color.toString();
      Common.extend(this.__input.style, {
        backgroundColor: this.__color.toHexString(),
        color: 'rgb(' + flip + ',' + flip + ',' + flip + ')',
        textShadow: this.__input_textShadow + 'rgba(' + _flip + ',' + _flip + ',' + _flip + ',.7)'
      });
    }
  }]);
  return ColorController;
}(Controller);
var vendors = ['-moz-', '-o-', '-webkit-', '-ms-', ''];
function linearGradient(elem, x, a, b) {
  elem.style.background = '';
  Common.each(vendors, function (vendor) {
    elem.style.cssText += 'background: ' + vendor + 'linear-gradient(' + x + ', ' + a + ' 0%, ' + b + ' 100%); ';
  });
}
function hueGradient(elem) {
  elem.style.background = '';
  elem.style.cssText += 'background: -moz-linear-gradient(top,  #ff0000 0%, #ff00ff 17%, #0000ff 34%, #00ffff 50%, #00ff00 67%, #ffff00 84%, #ff0000 100%);';
  elem.style.cssText += 'background: -webkit-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);';
  elem.style.cssText += 'background: -o-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);';
  elem.style.cssText += 'background: -ms-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);';
  elem.style.cssText += 'background: linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);';
}
var ControllerFactory = function ControllerFactory(object, property) {
  var initialValue = object[property];
  if (Common.isArray(arguments[2]) || Common.isObject(arguments[2])) {
    return new OptionController(object, property, arguments[2]);
  }
  if (Common.isNumber(initialValue)) {
    if (Common.isNumber(arguments[2]) && Common.isNumber(arguments[3])) {
      if (Common.isNumber(arguments[4])) {
        return new NumberControllerSlider(object, property, arguments[2], arguments[3], arguments[4]);
      }
      return new NumberControllerSlider(object, property, arguments[2], arguments[3]);
    }
    if (Common.isNumber(arguments[4])) {
      return new NumberControllerBox(object, property, { min: arguments[2], max: arguments[3], step: arguments[4] });
    }
    return new NumberControllerBox(object, property, { min: arguments[2], max: arguments[3] });
  }
  if (Common.isString(initialValue)) {
    return new StringController(object, property);
  }
  if (Common.isFunction(initialValue)) {
    return new FunctionController(object, property, '');
  }
  if (Common.isBoolean(initialValue)) {
    return new BooleanController(object, property);
  }
  return null;
};
var CustomController = function (_Controller) {
  inherits$1(CustomController, _Controller);
  function CustomController(object, property) {
    classCallCheck$1(this, CustomController);
    var _this = possibleConstructorReturn$1(this, (CustomController.__proto__ || Object.getPrototypeOf(CustomController)).call(this, object, property));
    _this.arguments = {
      object: object, property: property, opts: Array.prototype.slice.call(arguments, 2)
    };
    if (object.property) _this.property = object.property(_this);
    return _this;
  }
  createClass$1(CustomController, [{
    key: 'controller',
    set: function set$$1(newController) {
      this._controller = newController;
    },
    get: function get$$1() {
      return this._controller;
    }
  }]);
  return CustomController;
}(Controller);
var css = {
  load: function load(url, indoc) {
    var doc = indoc || document;
    var link = doc.createElement('link');
    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.href = url;
    doc.getElementsByTagName('head')[0].appendChild(link);
  },
  inject: function inject(cssContent, indoc) {
    var doc = indoc || document;
    var injected = document.createElement('style');
    injected.type = 'text/css';
    injected.innerHTML = cssContent;
    var head = doc.getElementsByTagName('head')[0];
    try {
      head.appendChild(injected);
    } catch (e) {}
  }
};
var saveDialogContents = "<div id=\"dg-save\" class=\"dg dialogue\">\n\n  Here's the new load parameter for your <code>GUI</code>'s constructor:\n\n  <textarea id=\"dg-new-constructor\"></textarea>\n\n  <div id=\"dg-save-locally\">\n\n    <input id=\"dg-local-storage\" type=\"checkbox\"/> Automatically save\n    values to <code>localStorage</code> on exit.\n\n    <div id=\"dg-local-explain\">The values saved to <code>localStorage</code> will\n      override those passed to <code>dat.GUI</code>'s constructor. This makes it\n      easier to work incrementally, but <code>localStorage</code> is fragile,\n      and your friends may not see the same values you do.\n\n    </div>\n\n  </div>\n\n</div>";
function requestAnimationFrame(callback) {
  setTimeout(callback, 1000 / 60);
}
var requestAnimationFrame$1 = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || requestAnimationFrame;
var CenteredDiv = function () {
  function CenteredDiv() {
    classCallCheck$1(this, CenteredDiv);
    this.backgroundElement = document.createElement('div');
    Common.extend(this.backgroundElement.style, {
      backgroundColor: 'rgba(0,0,0,0.8)',
      top: 0,
      left: 0,
      display: 'none',
      zIndex: '1000',
      opacity: 0,
      WebkitTransition: 'opacity 0.2s linear',
      transition: 'opacity 0.2s linear'
    });
    dom.makeFullscreen(this.backgroundElement);
    this.backgroundElement.style.position = 'fixed';
    this.domElement = document.createElement('div');
    Common.extend(this.domElement.style, {
      position: 'fixed',
      display: 'none',
      zIndex: '1001',
      opacity: 0,
      WebkitTransition: '-webkit-transform 0.2s ease-out, opacity 0.2s linear',
      transition: 'transform 0.2s ease-out, opacity 0.2s linear'
    });
    document.body.appendChild(this.backgroundElement);
    document.body.appendChild(this.domElement);
    var _this = this;
    dom.bind(this.backgroundElement, 'click', function () {
      _this.hide();
    });
  }
  createClass$1(CenteredDiv, [{
    key: 'show',
    value: function show() {
      var _this = this;
      this.backgroundElement.style.display = 'block';
      this.domElement.style.display = 'block';
      this.domElement.style.opacity = 0;
      this.domElement.style.webkitTransform = 'scale(1.1)';
      this.layout();
      Common.defer(function () {
        _this.backgroundElement.style.opacity = 1;
        _this.domElement.style.opacity = 1;
        _this.domElement.style.webkitTransform = 'scale(1)';
      });
    }
  }, {
    key: 'hide',
    value: function hide() {
      var _this = this;
      var hide = function hide() {
        _this.domElement.style.display = 'none';
        _this.backgroundElement.style.display = 'none';
        dom.unbind(_this.domElement, 'webkitTransitionEnd', hide);
        dom.unbind(_this.domElement, 'transitionend', hide);
        dom.unbind(_this.domElement, 'oTransitionEnd', hide);
      };
      dom.bind(this.domElement, 'webkitTransitionEnd', hide);
      dom.bind(this.domElement, 'transitionend', hide);
      dom.bind(this.domElement, 'oTransitionEnd', hide);
      this.backgroundElement.style.opacity = 0;
      this.domElement.style.opacity = 0;
      this.domElement.style.webkitTransform = 'scale(1.1)';
    }
  }, {
    key: 'layout',
    value: function layout() {
      this.domElement.style.left = window.innerWidth / 2 - dom.getWidth(this.domElement) / 2 + 'px';
      this.domElement.style.top = window.innerHeight / 2 - dom.getHeight(this.domElement) / 2 + 'px';
    }
  }]);
  return CenteredDiv;
}();
var styleSheet = ___$insertStyle(".dg ul{list-style:none;margin:0;padding:0;width:100%;clear:both}.dg.ac{position:fixed;top:0;left:0;right:0;height:0;z-index:0}.dg:not(.ac) .main{overflow:hidden}.dg.main{-webkit-transition:opacity .1s linear;-o-transition:opacity .1s linear;-moz-transition:opacity .1s linear;transition:opacity .1s linear}.dg.main.taller-than-window{overflow-y:auto}.dg.main.taller-than-window .close-button{opacity:1;margin-top:-1px;border-top:1px solid #2c2c2c}.dg.main ul.closed .close-button{opacity:1 !important}.dg.main:hover .close-button,.dg.main .close-button.drag{opacity:1}.dg.main .close-button{-webkit-transition:opacity .1s linear;-o-transition:opacity .1s linear;-moz-transition:opacity .1s linear;transition:opacity .1s linear;border:0;line-height:19px;height:20px;cursor:pointer;text-align:center;background-color:#000}.dg.main .close-button.close-top{position:relative}.dg.main .close-button.close-bottom{position:absolute}.dg.main .close-button:hover{background-color:#111}.dg.a{float:right;margin-right:15px;overflow-y:visible}.dg.a.has-save>ul.close-top{margin-top:0}.dg.a.has-save>ul.close-bottom{margin-top:27px}.dg.a.has-save>ul.closed{margin-top:0}.dg.a .save-row{top:0;z-index:1002}.dg.a .save-row.close-top{position:relative}.dg.a .save-row.close-bottom{position:fixed}.dg li{-webkit-transition:height .1s ease-out;-o-transition:height .1s ease-out;-moz-transition:height .1s ease-out;transition:height .1s ease-out;-webkit-transition:overflow .1s linear;-o-transition:overflow .1s linear;-moz-transition:overflow .1s linear;transition:overflow .1s linear}.dg li:not(.folder){cursor:auto;height:27px;line-height:27px;padding:0 4px 0 5px}.dg li.folder{padding:0;border-left:4px solid rgba(0,0,0,0)}.dg li.title{cursor:pointer;margin-left:-4px}.dg .closed li:not(.title),.dg .closed ul li,.dg .closed ul li>*{height:0;overflow:hidden;border:0}.dg .cr{clear:both;padding-left:3px;height:27px;overflow:hidden}.dg .property-name{cursor:default;float:left;clear:left;width:40%;overflow:hidden;text-overflow:ellipsis}.dg .c{float:left;width:60%;position:relative}.dg .c input[type=text]{border:0;margin-top:4px;padding:3px;width:100%;float:right}.dg .has-slider input[type=text]{width:30%;margin-left:0}.dg .slider{float:left;width:66%;margin-left:-5px;margin-right:0;height:19px;margin-top:4px}.dg .slider-fg{height:100%}.dg .c input[type=checkbox]{margin-top:7px}.dg .c select{margin-top:5px}.dg .cr.function,.dg .cr.function .property-name,.dg .cr.function *,.dg .cr.boolean,.dg .cr.boolean *{cursor:pointer}.dg .cr.color{overflow:visible}.dg .selector{display:none;position:absolute;margin-left:-9px;margin-top:23px;z-index:10}.dg .c:hover .selector,.dg .selector.drag{display:block}.dg li.save-row{padding:0}.dg li.save-row .button{display:inline-block;padding:0px 6px}.dg.dialogue{background-color:#222;width:460px;padding:15px;font-size:13px;line-height:15px}#dg-new-constructor{padding:10px;color:#222;font-family:Monaco, monospace;font-size:10px;border:0;resize:none;box-shadow:inset 1px 1px 1px #888;word-wrap:break-word;margin:12px 0;display:block;width:440px;overflow-y:scroll;height:100px;position:relative}#dg-local-explain{display:none;font-size:11px;line-height:17px;border-radius:3px;background-color:#333;padding:8px;margin-top:10px}#dg-local-explain code{font-size:10px}#dat-gui-save-locally{display:none}.dg{color:#eee;font:11px 'Lucida Grande', sans-serif;text-shadow:0 -1px 0 #111}.dg.main::-webkit-scrollbar{width:5px;background:#1a1a1a}.dg.main::-webkit-scrollbar-corner{height:0;display:none}.dg.main::-webkit-scrollbar-thumb{border-radius:5px;background:#676767}.dg li:not(.folder){background:#1a1a1a;border-bottom:1px solid #2c2c2c}.dg li.save-row{line-height:25px;background:#dad5cb;border:0}.dg li.save-row select{margin-left:5px;width:108px}.dg li.save-row .button{margin-left:5px;margin-top:1px;border-radius:2px;font-size:9px;line-height:7px;padding:4px 4px 5px 4px;background:#c5bdad;color:#fff;text-shadow:0 1px 0 #b0a58f;box-shadow:0 -1px 0 #b0a58f;cursor:pointer}.dg li.save-row .button.gears{background:#c5bdad url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAANCAYAAAB/9ZQ7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAQJJREFUeNpiYKAU/P//PwGIC/ApCABiBSAW+I8AClAcgKxQ4T9hoMAEUrxx2QSGN6+egDX+/vWT4e7N82AMYoPAx/evwWoYoSYbACX2s7KxCxzcsezDh3evFoDEBYTEEqycggWAzA9AuUSQQgeYPa9fPv6/YWm/Acx5IPb7ty/fw+QZblw67vDs8R0YHyQhgObx+yAJkBqmG5dPPDh1aPOGR/eugW0G4vlIoTIfyFcA+QekhhHJhPdQxbiAIguMBTQZrPD7108M6roWYDFQiIAAv6Aow/1bFwXgis+f2LUAynwoIaNcz8XNx3Dl7MEJUDGQpx9gtQ8YCueB+D26OECAAQDadt7e46D42QAAAABJRU5ErkJggg==) 2px 1px no-repeat;height:7px;width:8px}.dg li.save-row .button:hover{background-color:#bab19e;box-shadow:0 -1px 0 #b0a58f}.dg li.folder{border-bottom:0}.dg li.title{padding-left:16px;background:#000 url(data:image/gif;base64,R0lGODlhBQAFAJEAAP////Pz8////////yH5BAEAAAIALAAAAAAFAAUAAAIIlI+hKgFxoCgAOw==) 6px 10px no-repeat;cursor:pointer;border-bottom:1px solid rgba(255,255,255,0.2)}.dg .closed li.title{background-image:url(data:image/gif;base64,R0lGODlhBQAFAJEAAP////Pz8////////yH5BAEAAAIALAAAAAAFAAUAAAIIlGIWqMCbWAEAOw==)}.dg .cr.boolean{border-left:3px solid #806787}.dg .cr.color{border-left:3px solid}.dg .cr.function{border-left:3px solid #e61d5f}.dg .cr.number{border-left:3px solid #2FA1D6}.dg .cr.number input[type=text]{color:#2FA1D6}.dg .cr.string{border-left:3px solid #1ed36f}.dg .cr.string input[type=text]{color:#1ed36f}.dg .cr.function:hover,.dg .cr.boolean:hover{background:#111}.dg .c input[type=text]{background:#303030;outline:none}.dg .c input[type=text]:hover{background:#3c3c3c}.dg .c input[type=text]:focus{background:#494949;color:#fff}.dg .c .slider{background:#303030;cursor:ew-resize}.dg .c .slider-fg{background:#2FA1D6;max-width:100%}.dg .c .slider:hover{background:#3c3c3c}.dg .c .slider:hover .slider-fg{background:#44abda}\n");
css.inject(styleSheet);
var CSS_NAMESPACE = 'dg';
var HIDE_KEY_CODE = 72;
var CLOSE_BUTTON_HEIGHT = 20;
var DEFAULT_DEFAULT_PRESET_NAME = 'Default';
var SUPPORTS_LOCAL_STORAGE = function () {
  try {
    return !!window.localStorage;
  } catch (e) {
    return false;
  }
}();
var SAVE_DIALOGUE = void 0;
var autoPlaceVirgin = true;
var autoPlaceContainer = void 0;
var hide = false;
var hideableGuis = [];
var GUI = function GUI(pars) {
  var _this = this;
  var params = pars || {};
  this.domElement = document.createElement('div');
  this.__ul = document.createElement('ul');
  this.domElement.appendChild(this.__ul);
  dom.addClass(this.domElement, CSS_NAMESPACE);
  this.__folders = {};
  this.__controllers = [];
  this.__rememberedObjects = [];
  this.__rememberedObjectIndecesToControllers = [];
  this.__listening = [];
  params = Common.defaults(params, {
    closeOnTop: false,
    autoPlace: true,
    width: GUI.DEFAULT_WIDTH
  });
  params = Common.defaults(params, {
    resizable: params.autoPlace,
    hideable: params.autoPlace
  });
  if (!Common.isUndefined(params.load)) {
    if (params.preset) {
      params.load.preset = params.preset;
    }
  } else {
    params.load = { preset: DEFAULT_DEFAULT_PRESET_NAME };
  }
  if (Common.isUndefined(params.parent) && params.hideable) {
    hideableGuis.push(this);
  }
  params.resizable = Common.isUndefined(params.parent) && params.resizable;
  if (params.autoPlace && Common.isUndefined(params.scrollable)) {
    params.scrollable = true;
  }
  var useLocalStorage = SUPPORTS_LOCAL_STORAGE && localStorage.getItem(getLocalStorageHash(this, 'isLocal')) === 'true';
  var saveToLocalStorage = void 0;
  var titleRow = void 0;
  Object.defineProperties(this, {
    parent: {
      get: function get$$1() {
        return params.parent;
      }
    },
    scrollable: {
      get: function get$$1() {
        return params.scrollable;
      }
    },
    autoPlace: {
      get: function get$$1() {
        return params.autoPlace;
      }
    },
    closeOnTop: {
      get: function get$$1() {
        return params.closeOnTop;
      }
    },
    preset: {
      get: function get$$1() {
        if (_this.parent) {
          return _this.getRoot().preset;
        }
        return params.load.preset;
      },
      set: function set$$1(v) {
        if (_this.parent) {
          _this.getRoot().preset = v;
        } else {
          params.load.preset = v;
        }
        setPresetSelectIndex(this);
        _this.revert();
      }
    },
    width: {
      get: function get$$1() {
        return params.width;
      },
      set: function set$$1(v) {
        params.width = v;
        setWidth(_this, v);
      }
    },
    name: {
      get: function get$$1() {
        return params.name;
      },
      set: function set$$1(v) {
        params.name = v;
        if (titleRow) {
          titleRow.innerHTML = params.name;
        }
      }
    },
    closed: {
      get: function get$$1() {
        return params.closed;
      },
      set: function set$$1(v) {
        params.closed = v;
        if (params.closed) {
          dom.addClass(_this.__ul, GUI.CLASS_CLOSED);
        } else {
          dom.removeClass(_this.__ul, GUI.CLASS_CLOSED);
        }
        this.onResize();
        if (_this.__closeButton) {
          _this.__closeButton.innerHTML = v ? GUI.TEXT_OPEN : GUI.TEXT_CLOSED;
        }
      }
    },
    load: {
      get: function get$$1() {
        return params.load;
      }
    },
    useLocalStorage: {
      get: function get$$1() {
        return useLocalStorage;
      },
      set: function set$$1(bool) {
        if (SUPPORTS_LOCAL_STORAGE) {
          useLocalStorage = bool;
          if (bool) {
            dom.bind(window, 'unload', saveToLocalStorage);
          } else {
            dom.unbind(window, 'unload', saveToLocalStorage);
          }
          localStorage.setItem(getLocalStorageHash(_this, 'isLocal'), bool);
        }
      }
    }
  });
  if (Common.isUndefined(params.parent)) {
    this.closed = params.closed || false;
    dom.addClass(this.domElement, GUI.CLASS_MAIN);
    dom.makeSelectable(this.domElement, false);
    if (SUPPORTS_LOCAL_STORAGE) {
      if (useLocalStorage) {
        _this.useLocalStorage = true;
        var savedGui = localStorage.getItem(getLocalStorageHash(this, 'gui'));
        if (savedGui) {
          params.load = JSON.parse(savedGui);
        }
      }
    }
    this.__closeButton = document.createElement('div');
    this.__closeButton.innerHTML = GUI.TEXT_CLOSED;
    dom.addClass(this.__closeButton, GUI.CLASS_CLOSE_BUTTON);
    if (params.closeOnTop) {
      dom.addClass(this.__closeButton, GUI.CLASS_CLOSE_TOP);
      this.domElement.insertBefore(this.__closeButton, this.domElement.childNodes[0]);
    } else {
      dom.addClass(this.__closeButton, GUI.CLASS_CLOSE_BOTTOM);
      this.domElement.appendChild(this.__closeButton);
    }
    dom.bind(this.__closeButton, 'click', function () {
      _this.closed = !_this.closed;
    });
  } else {
    if (params.closed === undefined) {
      params.closed = true;
    }
    var titleRowName = document.createTextNode(params.name);
    dom.addClass(titleRowName, 'controller-name');
    titleRow = addRow(_this, titleRowName);
    var onClickTitle = function onClickTitle(e) {
      e.preventDefault();
      _this.closed = !_this.closed;
      return false;
    };
    dom.addClass(this.__ul, GUI.CLASS_CLOSED);
    dom.addClass(titleRow, 'title');
    dom.bind(titleRow, 'click', onClickTitle);
    if (!params.closed) {
      this.closed = false;
    }
  }
  if (params.autoPlace) {
    if (Common.isUndefined(params.parent)) {
      if (autoPlaceVirgin) {
        autoPlaceContainer = document.createElement('div');
        dom.addClass(autoPlaceContainer, CSS_NAMESPACE);
        dom.addClass(autoPlaceContainer, GUI.CLASS_AUTO_PLACE_CONTAINER);
        document.body.appendChild(autoPlaceContainer);
        autoPlaceVirgin = false;
      }
      autoPlaceContainer.appendChild(this.domElement);
      dom.addClass(this.domElement, GUI.CLASS_AUTO_PLACE);
    }
    if (!this.parent) {
      setWidth(_this, params.width);
    }
  }
  this.__resizeHandler = function () {
    _this.onResizeDebounced();
  };
  dom.bind(window, 'resize', this.__resizeHandler);
  dom.bind(this.__ul, 'webkitTransitionEnd', this.__resizeHandler);
  dom.bind(this.__ul, 'transitionend', this.__resizeHandler);
  dom.bind(this.__ul, 'oTransitionEnd', this.__resizeHandler);
  this.onResize();
  if (params.resizable) {
    addResizeHandle(this);
  }
  saveToLocalStorage = function saveToLocalStorage() {
    if (SUPPORTS_LOCAL_STORAGE && localStorage.getItem(getLocalStorageHash(_this, 'isLocal')) === 'true') {
      localStorage.setItem(getLocalStorageHash(_this, 'gui'), JSON.stringify(_this.getSaveObject()));
    }
  };
  this.saveToLocalStorageIfPossible = saveToLocalStorage;
  function resetWidth() {
    var root = _this.getRoot();
    root.width += 1;
    Common.defer(function () {
      root.width -= 1;
    });
  }
  if (!params.parent) {
    resetWidth();
  }
};
GUI.toggleHide = function () {
  hide = !hide;
  Common.each(hideableGuis, function (gui) {
    gui.domElement.style.display = hide ? 'none' : '';
  });
};
GUI.CLASS_AUTO_PLACE = 'a';
GUI.CLASS_AUTO_PLACE_CONTAINER = 'ac';
GUI.CLASS_MAIN = 'main';
GUI.CLASS_CONTROLLER_ROW = 'cr';
GUI.CLASS_TOO_TALL = 'taller-than-window';
GUI.CLASS_CLOSED = 'closed';
GUI.CLASS_CLOSE_BUTTON = 'close-button';
GUI.CLASS_CLOSE_TOP = 'close-top';
GUI.CLASS_CLOSE_BOTTOM = 'close-bottom';
GUI.CLASS_DRAG = 'drag';
GUI.DEFAULT_WIDTH = 245;
GUI.TEXT_CLOSED = 'Close Controls';
GUI.TEXT_OPEN = 'Open Controls';
GUI._keydownHandler = function (e) {
  if (document.activeElement.type !== 'text' && (e.which === HIDE_KEY_CODE || e.keyCode === HIDE_KEY_CODE)) {
    GUI.toggleHide();
  }
};
dom.bind(window, 'keydown', GUI._keydownHandler, false);
Common.extend(GUI.prototype, {
  add: function add(object, property) {
    return _add(this, object, property, {
      factoryArgs: Array.prototype.slice.call(arguments, 2)
    });
  },
  addColor: function addColor(object, property) {
    return _add(this, object, property, {
      color: true
    });
  },
  remove: function remove(controller) {
    this.__ul.removeChild(controller.__li);
    this.__controllers.splice(this.__controllers.indexOf(controller), 1);
    var _this = this;
    Common.defer(function () {
      _this.onResize();
    });
  },
  destroy: function destroy() {
    if (this.parent) {
      throw new Error('Only the root GUI should be removed with .destroy(). ' + 'For subfolders, use gui.removeFolder(folder) instead.');
    }
    if (this.autoPlace) {
      autoPlaceContainer.removeChild(this.domElement);
    }
    var _this = this;
    Common.each(this.__folders, function (subfolder) {
      _this.removeFolder(subfolder);
    });
    dom.unbind(window, 'keydown', GUI._keydownHandler, false);
    removeListeners(this);
  },
  addFolder: function addFolder(name) {
    if (this.__folders[name] !== undefined) {
      throw new Error('You already have a folder in this GUI by the' + ' name "' + name + '"');
    }
    var newGuiParams = { name: name, parent: this };
    newGuiParams.autoPlace = this.autoPlace;
    if (this.load && this.load.folders && this.load.folders[name]) {
      newGuiParams.closed = this.load.folders[name].closed;
      newGuiParams.load = this.load.folders[name];
    }
    var gui = new GUI(newGuiParams);
    this.__folders[name] = gui;
    var li = addRow(this, gui.domElement);
    dom.addClass(li, 'folder');
    return gui;
  },
  removeFolder: function removeFolder(folder) {
    this.__ul.removeChild(folder.domElement.parentElement);
    delete this.__folders[folder.name];
    if (this.load && this.load.folders && this.load.folders[folder.name]) {
      delete this.load.folders[folder.name];
    }
    removeListeners(folder);
    var _this = this;
    Common.each(folder.__folders, function (subfolder) {
      folder.removeFolder(subfolder);
    });
    Common.defer(function () {
      _this.onResize();
    });
  },
  open: function open() {
    this.closed = false;
  },
  close: function close() {
    this.closed = true;
  },
  hide: function hide() {
    this.domElement.style.display = 'none';
  },
  show: function show() {
    this.domElement.style.display = '';
  },
  onResize: function onResize() {
    var root = this.getRoot();
    if (root.scrollable) {
      var top = dom.getOffset(root.__ul).top;
      var h = 0;
      Common.each(root.__ul.childNodes, function (node) {
        if (!(root.autoPlace && node === root.__save_row)) {
          h += dom.getHeight(node);
        }
      });
      if (window.innerHeight - top - CLOSE_BUTTON_HEIGHT < h) {
        dom.addClass(root.domElement, GUI.CLASS_TOO_TALL);
        root.__ul.style.height = window.innerHeight - top - CLOSE_BUTTON_HEIGHT + 'px';
      } else {
        dom.removeClass(root.domElement, GUI.CLASS_TOO_TALL);
        root.__ul.style.height = 'auto';
      }
    }
    if (root.__resize_handle) {
      Common.defer(function () {
        root.__resize_handle.style.height = root.__ul.offsetHeight + 'px';
      });
    }
    if (root.__closeButton) {
      root.__closeButton.style.width = root.width + 'px';
    }
  },
  onResizeDebounced: Common.debounce(function () {
    this.onResize();
  }, 50),
  remember: function remember() {
    if (Common.isUndefined(SAVE_DIALOGUE)) {
      SAVE_DIALOGUE = new CenteredDiv();
      SAVE_DIALOGUE.domElement.innerHTML = saveDialogContents;
    }
    if (this.parent) {
      throw new Error('You can only call remember on a top level GUI.');
    }
    var _this = this;
    Common.each(Array.prototype.slice.call(arguments), function (object) {
      if (_this.__rememberedObjects.length === 0) {
        addSaveMenu(_this);
      }
      if (_this.__rememberedObjects.indexOf(object) === -1) {
        _this.__rememberedObjects.push(object);
      }
    });
    if (this.autoPlace) {
      setWidth(this, this.width);
    }
  },
  getRoot: function getRoot() {
    var gui = this;
    while (gui.parent) {
      gui = gui.parent;
    }
    return gui;
  },
  getSaveObject: function getSaveObject() {
    var toReturn = this.load;
    toReturn.closed = this.closed;
    if (this.__rememberedObjects.length > 0) {
      toReturn.preset = this.preset;
      if (!toReturn.remembered) {
        toReturn.remembered = {};
      }
      toReturn.remembered[this.preset] = getCurrentPreset(this);
    }
    toReturn.folders = {};
    Common.each(this.__folders, function (element, key) {
      toReturn.folders[key] = element.getSaveObject();
    });
    return toReturn;
  },
  save: function save() {
    if (!this.load.remembered) {
      this.load.remembered = {};
    }
    this.load.remembered[this.preset] = getCurrentPreset(this);
    markPresetModified(this, false);
    this.saveToLocalStorageIfPossible();
  },
  saveAs: function saveAs(presetName) {
    if (!this.load.remembered) {
      this.load.remembered = {};
      this.load.remembered[DEFAULT_DEFAULT_PRESET_NAME] = getCurrentPreset(this, true);
    }
    this.load.remembered[presetName] = getCurrentPreset(this);
    this.preset = presetName;
    addPresetOption(this, presetName, true);
    this.saveToLocalStorageIfPossible();
  },
  revert: function revert(gui) {
    Common.each(this.__controllers, function (controller) {
      if (!this.getRoot().load.remembered) {
        controller.setValue(controller.initialValue);
      } else {
        recallSavedValue(gui || this.getRoot(), controller);
      }
      if (controller.__onFinishChange) {
        controller.__onFinishChange.call(controller, controller.getValue());
      }
    }, this);
    Common.each(this.__folders, function (folder) {
      folder.revert(folder);
    });
    if (!gui) {
      markPresetModified(this.getRoot(), false);
    }
  },
  listen: function listen(controller) {
    var init = this.__listening.length === 0;
    this.__listening.push(controller);
    if (init) {
      updateDisplays(this.__listening);
    }
  },
  updateDisplay: function updateDisplay() {
    Common.each(this.__controllers, function (controller) {
      controller.updateDisplay();
    });
    Common.each(this.__folders, function (folder) {
      folder.updateDisplay();
    });
  }
});
function addRow(gui, newDom, liBefore) {
  var li = document.createElement('li');
  if (newDom) {
    li.appendChild(newDom);
  }
  if (liBefore) {
    gui.__ul.insertBefore(li, liBefore);
  } else {
    gui.__ul.appendChild(li);
  }
  gui.onResize();
  return li;
}
function removeListeners(gui) {
  dom.unbind(window, 'resize', gui.__resizeHandler);
  if (gui.saveToLocalStorageIfPossible) {
    dom.unbind(window, 'unload', gui.saveToLocalStorageIfPossible);
  }
}
function markPresetModified(gui, modified) {
  var opt = gui.__preset_select[gui.__preset_select.selectedIndex];
  if (modified) {
    opt.innerHTML = opt.value + '*';
  } else {
    opt.innerHTML = opt.value;
  }
}
function augmentController(gui, li, controller) {
  controller.__li = li;
  controller.__gui = gui;
  Common.extend(controller, {
    options: function options(_options) {
      if (arguments.length > 1) {
        var nextSibling = controller.__li.nextElementSibling;
        controller.remove();
        return _add(gui, controller.object, controller.property, {
          before: nextSibling,
          factoryArgs: [Common.toArray(arguments)]
        });
      }
      if (Common.isArray(_options) || Common.isObject(_options)) {
        var _nextSibling = controller.__li.nextElementSibling;
        controller.remove();
        return _add(gui, controller.object, controller.property, {
          before: _nextSibling,
          factoryArgs: [_options]
        });
      }
    },
    name: function name(_name) {
      controller.__li.firstElementChild.firstElementChild.innerHTML = _name;
      return controller;
    },
    listen: function listen() {
      controller.__gui.listen(controller);
      return controller;
    },
    remove: function remove() {
      controller.__gui.remove(controller);
      return controller;
    }
  });
  if (controller instanceof NumberControllerSlider) {
    var box = new NumberControllerBox(controller.object, controller.property, { min: controller.__min, max: controller.__max, step: controller.__step });
    Common.each(['updateDisplay', 'onChange', 'onFinishChange', 'step', 'min', 'max'], function (method) {
      var pc = controller[method];
      var pb = box[method];
      controller[method] = box[method] = function () {
        var args = Array.prototype.slice.call(arguments);
        pb.apply(box, args);
        return pc.apply(controller, args);
      };
    });
    dom.addClass(li, 'has-slider');
    controller.domElement.insertBefore(box.domElement, controller.domElement.firstElementChild);
  } else if (controller instanceof NumberControllerBox) {
    var r = function r(returned) {
      if (Common.isNumber(controller.__min) && Common.isNumber(controller.__max)) {
        var oldName = controller.__li.firstElementChild.firstElementChild.innerHTML;
        var wasListening = controller.__gui.__listening.indexOf(controller) > -1;
        controller.remove();
        var newController = _add(gui, controller.object, controller.property, {
          before: controller.__li.nextElementSibling,
          factoryArgs: [controller.__min, controller.__max, controller.__step]
        });
        newController.name(oldName);
        if (wasListening) newController.listen();
        return newController;
      }
      return returned;
    };
    controller.min = Common.compose(r, controller.min);
    controller.max = Common.compose(r, controller.max);
  } else if (controller instanceof BooleanController) {
    dom.bind(li, 'click', function () {
      dom.fakeEvent(controller.__checkbox, 'click');
    });
    dom.bind(controller.__checkbox, 'click', function (e) {
      e.stopPropagation();
    });
  } else if (controller instanceof FunctionController) {
    dom.bind(li, 'click', function () {
      dom.fakeEvent(controller.__button, 'click');
    });
    dom.bind(li, 'mouseover', function () {
      dom.addClass(controller.__button, 'hover');
    });
    dom.bind(li, 'mouseout', function () {
      dom.removeClass(controller.__button, 'hover');
    });
  } else if (controller instanceof ColorController) {
    dom.addClass(li, 'color');
    controller.updateDisplay = Common.compose(function (val) {
      li.style.borderLeftColor = controller.__color.toString();
      return val;
    }, controller.updateDisplay);
    controller.updateDisplay();
  }
  controller.setValue = Common.compose(function (val) {
    if (gui.getRoot().__preset_select && controller.isModified()) {
      markPresetModified(gui.getRoot(), true);
    }
    return val;
  }, controller.setValue);
}
function recallSavedValue(gui, controller) {
  var root = gui.getRoot();
  var matchedIndex = root.__rememberedObjects.indexOf(controller.object);
  if (matchedIndex !== -1) {
    var controllerMap = root.__rememberedObjectIndecesToControllers[matchedIndex];
    if (controllerMap === undefined) {
      controllerMap = {};
      root.__rememberedObjectIndecesToControllers[matchedIndex] = controllerMap;
    }
    controllerMap[controller.property] = controller;
    if (root.load && root.load.remembered) {
      var presetMap = root.load.remembered;
      var preset = void 0;
      if (presetMap[gui.preset]) {
        preset = presetMap[gui.preset];
      } else if (presetMap[DEFAULT_DEFAULT_PRESET_NAME]) {
        preset = presetMap[DEFAULT_DEFAULT_PRESET_NAME];
      } else {
        return;
      }
      if (preset[matchedIndex] && preset[matchedIndex][controller.property] !== undefined) {
        var value = preset[matchedIndex][controller.property];
        controller.initialValue = value;
        controller.setValue(value);
      }
    }
  }
}
function _add(gui, object, property, params) {
  var customObject;
  if (object.arguments) {
    customObject = object;
    object = customObject.arguments.object;
    property = customObject.arguments.property;
    params = {
      factoryArgs: customObject.arguments.opts
    };
  }
  if (customObject === undefined && object[property] === undefined) {
    throw new Error('Object "' + object + '" has no property "' + property + '"');
  }
  var controller = void 0;
  if (params.color) {
    controller = new ColorController(object, property);
  } else if (customObject !== undefined && typeof customObject.property === "string") {
    controller = customObject;
  } else {
    var factoryArgs = [object, property].concat(params.factoryArgs);
    controller = ControllerFactory.apply(gui, factoryArgs);
  }
  if (controller === null) controller = customObject;else if (customObject !== undefined) customObject.controller = controller;
  if (params.before instanceof Controller) {
    params.before = params.before.__li;
  }
  recallSavedValue(gui, controller);
  dom.addClass(controller.domElement, 'c');
  var name = document.createElement('span');
  dom.addClass(name, 'property-name');
  if (customObject !== undefined && _typeof$1(customObject.property) === "object") {
    for (var propertyName in customObject.property) {
      name.appendChild(customObject.property[propertyName]);
    }
  } else name.innerHTML = controller.property;
  var container = document.createElement('div');
  container.appendChild(name);
  container.appendChild(controller.domElement);
  var li = addRow(gui, container, params.before);
  dom.addClass(li, GUI.CLASS_CONTROLLER_ROW);
  if (controller instanceof ColorController) {
    dom.addClass(li, 'color');
  } else {
    dom.addClass(li, _typeof$1(controller.getValue()));
  }
  augmentController(gui, li, controller);
  gui.__controllers.push(controller);
  return controller;
}
function getLocalStorageHash(gui, key) {
  return document.location.href + '.' + key;
}
function addPresetOption(gui, name, setSelected) {
  var opt = document.createElement('option');
  opt.innerHTML = name;
  opt.value = name;
  gui.__preset_select.appendChild(opt);
  if (setSelected) {
    gui.__preset_select.selectedIndex = gui.__preset_select.length - 1;
  }
}
function showHideExplain(gui, explain) {
  explain.style.display = gui.useLocalStorage ? 'block' : 'none';
}
function addSaveMenu(gui) {
  var div = gui.__save_row = document.createElement('li');
  dom.addClass(gui.domElement, 'has-save');
  gui.__ul.insertBefore(div, gui.__ul.firstChild);
  dom.addClass(div, 'save-row');
  var gears = document.createElement('span');
  gears.innerHTML = '&nbsp;';
  dom.addClass(gears, 'button gears');
  var button = document.createElement('span');
  button.innerHTML = 'Save';
  dom.addClass(button, 'button');
  dom.addClass(button, 'save');
  var button2 = document.createElement('span');
  button2.innerHTML = 'New';
  dom.addClass(button2, 'button');
  dom.addClass(button2, 'save-as');
  var button3 = document.createElement('span');
  button3.innerHTML = 'Revert';
  dom.addClass(button3, 'button');
  dom.addClass(button3, 'revert');
  var select = gui.__preset_select = document.createElement('select');
  if (gui.load && gui.load.remembered) {
    Common.each(gui.load.remembered, function (value, key) {
      addPresetOption(gui, key, key === gui.preset);
    });
  } else {
    addPresetOption(gui, DEFAULT_DEFAULT_PRESET_NAME, false);
  }
  dom.bind(select, 'change', function () {
    for (var index = 0; index < gui.__preset_select.length; index++) {
      gui.__preset_select[index].innerHTML = gui.__preset_select[index].value;
    }
    gui.preset = this.value;
  });
  div.appendChild(select);
  div.appendChild(gears);
  div.appendChild(button);
  div.appendChild(button2);
  div.appendChild(button3);
  if (SUPPORTS_LOCAL_STORAGE) {
    var explain = document.getElementById('dg-local-explain');
    var localStorageCheckBox = document.getElementById('dg-local-storage');
    var saveLocally = document.getElementById('dg-save-locally');
    saveLocally.style.display = 'block';
    if (localStorage.getItem(getLocalStorageHash(gui, 'isLocal')) === 'true') {
      localStorageCheckBox.setAttribute('checked', 'checked');
    }
    showHideExplain(gui, explain);
    dom.bind(localStorageCheckBox, 'change', function () {
      gui.useLocalStorage = !gui.useLocalStorage;
      showHideExplain(gui, explain);
    });
  }
  var newConstructorTextArea = document.getElementById('dg-new-constructor');
  dom.bind(newConstructorTextArea, 'keydown', function (e) {
    if (e.metaKey && (e.which === 67 || e.keyCode === 67)) {
      SAVE_DIALOGUE.hide();
    }
  });
  dom.bind(gears, 'click', function () {
    newConstructorTextArea.innerHTML = JSON.stringify(gui.getSaveObject(), undefined, 2);
    SAVE_DIALOGUE.show();
    newConstructorTextArea.focus();
    newConstructorTextArea.select();
  });
  dom.bind(button, 'click', function () {
    gui.save();
  });
  dom.bind(button2, 'click', function () {
    var presetName = prompt('Enter a new preset name.');
    if (presetName) {
      gui.saveAs(presetName);
    }
  });
  dom.bind(button3, 'click', function () {
    gui.revert();
  });
}
function addResizeHandle(gui) {
  var pmouseX = void 0;
  gui.__resize_handle = document.createElement('div');
  Common.extend(gui.__resize_handle.style, {
    width: '6px',
    marginLeft: '-3px',
    height: '200px',
    cursor: 'ew-resize',
    position: 'absolute'
  });
  function drag(e) {
    e.preventDefault();
    gui.width += pmouseX - e.clientX;
    gui.onResize();
    pmouseX = e.clientX;
    return false;
  }
  function dragStop() {
    dom.removeClass(gui.__closeButton, GUI.CLASS_DRAG);
    dom.unbind(window, 'mousemove', drag);
    dom.unbind(window, 'mouseup', dragStop);
  }
  function dragStart(e) {
    e.preventDefault();
    pmouseX = e.clientX;
    dom.addClass(gui.__closeButton, GUI.CLASS_DRAG);
    dom.bind(window, 'mousemove', drag);
    dom.bind(window, 'mouseup', dragStop);
    return false;
  }
  dom.bind(gui.__resize_handle, 'mousedown', dragStart);
  dom.bind(gui.__closeButton, 'mousedown', dragStart);
  gui.domElement.insertBefore(gui.__resize_handle, gui.domElement.firstElementChild);
}
function setWidth(gui, w) {
  gui.domElement.style.width = w + 'px';
  if (gui.__save_row && gui.autoPlace) {
    gui.__save_row.style.width = w + 'px';
  }
  if (gui.__closeButton) {
    gui.__closeButton.style.width = w + 'px';
  }
}
function getCurrentPreset(gui, useInitialValues) {
  var toReturn = {};
  Common.each(gui.__rememberedObjects, function (val, index) {
    var savedValues = {};
    var controllerMap = gui.__rememberedObjectIndecesToControllers[index];
    Common.each(controllerMap, function (controller, property) {
      savedValues[property] = useInitialValues ? controller.initialValue : controller.getValue();
    });
    toReturn[index] = savedValues;
  });
  return toReturn;
}
function setPresetSelectIndex(gui) {
  for (var index = 0; index < gui.__preset_select.length; index++) {
    if (gui.__preset_select[index].value === gui.preset) {
      gui.__preset_select.selectedIndex = index;
    }
  }
}
function updateDisplays(controllerArray) {
  if (controllerArray.length !== 0) {
    requestAnimationFrame$1.call(window, function () {
      updateDisplays(controllerArray);
    });
  }
  Common.each(controllerArray, function (c) {
    c.updateDisplay();
  });
}
var controllers = {
  Controller: Controller,
  BooleanController: BooleanController,
  OptionController: OptionController,
  StringController: StringController,
  NumberController: NumberController,
  NumberControllerBox: NumberControllerBox,
  NumberControllerSlider: NumberControllerSlider,
  FunctionController: FunctionController,
  ColorController: ColorController,
  CustomController: CustomController
};
var GUI$1 = GUI;

/**
 * Modify of the dat object.
 * @see {@link https://github.com/dataarts/dat.gui} about dat.gui
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
function dat() {}
if (typeof dat !== 'undefined') {
	var elNameAndTitle = function elNameAndTitle(el, name, title) {
		if (name === undefined) console.warn('elNameAndTitle: name = ' + name);
		el.innerHTML = name;
		if (title !== undefined) el.title = title;
	};
	dat.GUI = GUI$1;
	if (dat.controllerNameAndTitle === undefined) {
		dat.controllerNameAndTitle = function (controller, name, title) {
			elNameAndTitle(controller.__li.querySelector(".property-name"), name, title);
		};
	} else console.error('Duplicate dat.controllerNameAndTitle method.');
	if (dat.folderNameAndTitle === undefined) {
		dat.folderNameAndTitle = function (folder, name, title) {
			elNameAndTitle(folder.__ul.querySelector("li.title"), name, title);
		};
	} else console.error('Duplicate dat.folderNameAndTitle method.');
	if (dat.controllerZeroStep === undefined) {
		dat.controllerZeroStep = function (folder, object, property, onchange) {
			var controller = folder.add(object, property),
			    input = controller.__input;
			controller.__input = document.createElement('input');
			input.value = object[property];
			input.onchange = function (value) {
				object[property] = parseFloat(input.value);
				if (onchange !== undefined) onchange(object[property]);
			};
			controller.setValue = function (value) {
				input.value = object[property] = value;
			};
			return controller;
		};
	} else console.error('Duplicate dat.controllerZeroStep method.');
	if (dat.controllerSetValue === undefined) {
		dat.controllerSetValue = function (controller, index$$1) {
			controller.setValue(index$$1);
			controller.__li.querySelector('select').selectedIndex = index$$1;
		};
	} else console.error('Duplicate dat.controllerSetValue method.');
}

/**
* custom controller, allow to user to change a value step by step.
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
var UpDownController = {
	addButton: function addButton(innerHTML, options) {
		options = options || {};
		var button = document.createElement('span');
		button.innerHTML = innerHTML;
		if (options.title !== undefined) button.title = options.title;
		if (options.onclick !== undefined) {
			button.style.cursor = 'pointer';
			button.onclick = options.onclick;
		}
		if (options.onwheel !== undefined) {
			var onWheel = function onWheel(e) {
				e = e || window.event;
				var delta = e.deltaY || e.detail || e.wheelDelta;
				options.onwheel(delta);
			};
			button.style.cursor = 'n-resize';
			if (button.addEventListener) {
				if ('onwheel' in document) {
					button.addEventListener("wheel", onWheel);
				} else if ('onmousewheel' in document) {
					button.addEventListener("mousewheel", onWheel);
				} else {
					button.addEventListener("MozMousePixelScroll", onWheel);
				}
			} else {
				button.attachEvent("onmousewheel", onWheel);
			}
		}
		button.style.margin = '0px 2px';
		return button;
	}
};

/**
 * @module ScaleController
 * @description is dat.GUI graphical user interface controller for control of the scale of threejs 3D object
 *
 * @see {@link https://threejs.org/} about threejs
 * @see {@link https://github.com/dataarts/dat.gui} about dat.GUI
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
var ScaleController = function (_controllers$CustomCo) {
	inherits(ScaleController, _controllers$CustomCo);
	function ScaleController(_onclick, options) {
		classCallCheck(this, ScaleController);
		options = options || {};
		options.settings = options.settings || {};
		options.settings.zoomMultiplier = options.settings.zoomMultiplier || 1.1;
		var _this = possibleConstructorReturn(this, (ScaleController.__proto__ || Object.getPrototypeOf(ScaleController)).call(this, {
			multiplier: options.settings.zoomMultiplier,
			property: function property(customController) {
				var lang = {
					zoom: 'Zoom',
					in: 'in',
					out: 'out',
					wheelZoom: 'Scroll the mouse wheel to zoom'
				};
				var _languageCode = options.getLanguageCode === undefined ? 'en'
				: options.getLanguageCode();
				switch (_languageCode) {
					case 'ru':
						lang.zoom = 'Изменить';
						lang.in = 'увеличить';
						lang.out = 'уменьшить';
						lang.wheelZoom = 'Прокрутите колесико мыши для изменения масштаба';
						break;
					default:
						if (options.lang === undefined || options.lang.languageCode != _languageCode) break;
						Object.keys(options.lang).forEach(function (key) {
							if (lang[key] === undefined) return;
							lang[key] = options.lang[key];
						});
				}
				var buttons = {},
				    addButton = UpDownController.addButton;
				buttons.zoomLabel = addButton(lang.zoom, {
					title: lang.wheelZoom,
					onwheel: function onwheel(delta) {
						_onclick(customController, function (value, zoom) {
							if (delta > 0) value *= zoom;else value /= zoom;
							return value;
						});
					}
				});
				buttons.in = addButton('↑', {
					title: lang.in,
					onclick: function onclick() {
						_onclick(customController, function (value, zoom) {
							value *= zoom;
							return value;
						});
					}
				});
				buttons.out = addButton('↓', {
					title: lang.out,
					onclick: function onclick() {
						_onclick(customController, function (value, zoom) {
							value /= zoom;
							return value;
						});
					}
				});
				return buttons;
			}
		}, 'multiplier', 1.1, 10, 0.1));
		if (_this.property === undefined) console.error('init() returns ' + _this.property);
		return _this;
	}
	return ScaleController;
}(controllers.CustomController);

/**
 * PositionController is dat.GUI graphical user interface controller for control of the position of threejs 3D object
 *
 * @see {@link https://threejs.org/} about threejs
 * @see {@link https://github.com/dataarts/dat.gui} about dat.GUI
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
var PositionController = function (_controllers$CustomCo) {
				inherits(PositionController, _controllers$CustomCo);
				function PositionController(onclickController, options) {
								classCallCheck(this, PositionController);
								options = options || {};
								options.settings = options.settings || {};
								var settings = options.settings;
								options.min = options.min || 0.1;
								options.max = options.max || 10;
								settings.offset = settings.offset || 0.1;
								options.step = options.step || 0.1;
								var _this = possibleConstructorReturn(this, (PositionController.__proto__ || Object.getPrototypeOf(PositionController)).call(this, {
												offset: settings.offset,
												property: function property(customController) {
																var lang = {
																				offset: 'Offset',
																				add: 'add',
																				subtract: 'subtract',
																				wheelPosition: 'Scroll the mouse wheel to change the position'
																};
																var _languageCode = options.getLanguageCode === undefined ? 'en'
																: options.getLanguageCode();
																switch (_languageCode) {
																				case 'ru':
																								lang.offset = 'Сдвиг';
																								lang.add = 'добавить';
																								lang.subtract = 'вычесть';
																								lang.wheelPosition = 'Прокрутите колесико мыши для изменения позиции';
																								break;
																				default:
																								if (options.lang === undefined || options.lang.languageCode != _languageCode) break;
																								Object.keys(options.lang).forEach(function (key) {
																												if (lang[key] === undefined) return;
																												lang[key] = options.lang[key];
																								});
																}
																var buttons = {},
																    addButton = UpDownController.addButton;
																buttons.Label = addButton(lang.offset, {
																				title: lang.wheelPosition,
																				onwheel: function onwheel(delta) {
																								var shift = customController.controller.getValue();
																								onclickController(delta > 0 ? shift : -shift);
																				}
																});
																buttons.in = addButton('↑', {
																				title: lang.add,
																				onclick: function onclick() {
																								onclickController(customController.controller.getValue());
																				}
																});
																buttons.out = addButton('↓', {
																				title: lang.subtract,
																				onclick: function onclick() {
																								onclickController(-customController.controller.getValue());
																				}
																});
																return buttons;
												}
								}, 'offset', options.min, options.max, options.step));
								if (_this.property === undefined) console.error('init() returns ' + _this.property);
								return _this;
				}
				return PositionController;
}(controllers.CustomController);

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
loadScript.sync(currentScriptPath + '/colorpicker.css', optionsStyle);
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
		if (typeof THREE$1 === 'undefined') {
			console.error('Call ColorPicker.palette.setTHREE(THREE) first.');
			return;
		}
		if (value instanceof THREE$1.Color) return value;
		var c = this.hsv2rgb(value, min, max);
		if (c === undefined) c = { r: 255, g: 255, b: 255 };
		return new THREE$1.Color("rgb(" + c.r + ", " + c.g + ", " + c.b + ")");
	};
}
var THREE$1;
Palette.setTHREE = function (_THREE) {
	if (THREE$1) {
		if (!Object.is(THREE$1, _THREE)) console.error('Palette.setTHREE: duplicate THREE. Please use one instance of the THREE library.');
		return;
	}
	THREE$1 = _THREE;
};

/**
* @module ColorPicker
* @description Pure JavaScript color picker.
* @author Andrej Hristoliubov https://anhr.github.io/AboutMe/
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
var ColorPicker = {
  create: create,
  paletteIndexes: paletteIndexes,
  palette: Palette
};

/**
 * @module GuiSelectPoint
 *
 * @description A dat.gui based graphical user interface for select a point from the mesh.
 *
 * @see {@link https://github.com/anhr/dat.gui|dat.gui}, {@link https://threejs.org/docs/index.html#api/en/objects/Mesh|three.js mesh}.
 *
 * @author Andrej Hristoliubov. {@link https://anhr.github.io/AboutMe/|AboutMe}
 *
 * @copyright 2011 Data Arts Team, Google Creative Lab
 *
 * @license under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
*/
var THREE$2;
function GuiSelectPoint(_THREE, guiParams) {
	GuiSelectPoint.setTHREE(_THREE);
	guiParams = guiParams || {};
	var axesHelper = guiParams.axesHelper,
	    options = guiParams.options || (axesHelper ? axesHelper.options : undefined) || {
		scales: {
			x: {
				name: 'x',
				min: -1,
				max: 1
			},
			y: {
				name: 'y',
				min: -1,
				max: 1
			},
			z: {
				name: 'z',
				min: -1,
				max: 1
			}
		}
	},
	guiSelectPoint = this;
	var cFrustumPoints;
	var getLanguageCode = guiParams.getLanguageCode || function () {
		return 'en';
	};
	var lang = {
		meshs: 'Meshs',
		notSelected: 'Not selected',
		select: 'Select',
		position: 'Position',
		rotation: 'Rotation',
		points: 'Points',
		point: 'Point Local Position',
		pointTitle: 'The position attribute of the selected point',
		pointWorld: 'Point World Position',
		pointWorldTitle: 'The position of the selected point after scaling, moving and rotation of the mesh',
		mesh: 'Mesh',
		scale: 'Scale',
		color: 'Сolor',
		opacity: 'Opacity',
		opacityTitle: 'Float in the range of 0.0 - 1.0 indicating how transparent the material is. A value of 0.0 indicates fully transparent, 1.0 is fully opaque.',
		defaultButton: 'Default',
		defaultScaleTitle: 'Restore default 3d object scale.',
		defaultPositionTitle: 'Restore default 3d object position.',
		default3DObjectTitle: 'Restore default settings of all 3d objects.',
		defaultRotationTitle: 'Restore default 3d object rotation.',
		defaultLocalPositionTitle: 'Restore default local position.',
		moveGroup: 'Move Scene'
	};
	var _languageCode = getLanguageCode();
	switch (_languageCode) {
		case 'ru':
			lang.meshs = '3D объекты';
			lang.notSelected = 'Не выбран';
			lang.select = 'Выбрать';
			lang.position = 'Позиция';
			lang.rotation = 'Вращение';
			lang.points = 'Точки';
			lang.point = 'Локальная позиция точки';
			lang.pointTitle = 'Position attribute выбранной точки';
			lang.pointWorld = 'Абсолютная позиция точки';
			lang.pointWorldTitle = 'Позиция выбранной точки после масштабирования, перемещения и вращения 3D объекта';
			lang.mesh = '3D объект';
			lang.scale = 'Масштаб';
			lang.color = 'Цвет';
			lang.opacity = 'Непрозрачность';
			lang.opacityTitle = 'Число в диапазоне 0,0 - 1,0, указывающий, насколько прозрачен материал. Значение 0.0 означает полностью прозрачный, 1.0 - полностью непрозрачный.';
			lang.defaultButton = 'Восстановить';
			lang.defaultScaleTitle = 'Восстановить масштаб 3D объекта по умолчанию.';
			lang.defaultPositionTitle = 'Восстановить позицию 3D объекта по умолчанию.';
			lang.default3DObjectTitle = 'Восстановить настройки всех 3D объектов по умолчанию.';
			lang.defaultRotationTitle = 'Восстановить поворот 3D объекта по умолчанию.';
			lang.defaultLocalPositionTitle = 'Восстановить локальную позицию точки по умолчанию.';
			break;
		default:
			if (guiParams.lang === undefined || guiParams.lang.languageCode != _languageCode) break;
			Object.keys(guiParams.lang).forEach(function (key) {
				if (lang[key] === undefined) return;
				lang[key] = guiParams.lang[key];
			});
	}
	var f3DObjects,
	    fPoint,
	    cRestoreDefaultLocalPosition,
	    fPointWorld,
	    fPoints,
	    cMeshs,
	    fMesh,
	intersection,
	    _this = this,
	    cScaleX,
	    cScaleY,
	    cScaleZ,
	    cPosition = new THREE$2.Vector3(),
	    cRotations = new THREE$2.Vector3(),
	    cPoints,
	    selectedPointIndex = -1,
	    controllerX,
	    controllerY,
	    controllerZ,
	    controllerW,
	    cTrace,
	    cTraceAll,
	    controllerColor,
	    controllerOpacity,
	    controllerWorld = new THREE$2.Vector3(),
	    boSetMesh = false;
	if (options.arrayCloud)
		cFrustumPoints = new options.arrayCloud.cFrustumPointsF(_this);
	function dislayEl(controller, displayController) {
		if (controller === undefined) return;
		if (typeof displayController == "boolean") displayController = displayController ? 'block' : 'none';
		var el = controller.domElement;
		while (el.tagName.toUpperCase() !== "LI") {
			el = el.parentElement;
		}el.style.display = displayController;
	}
	function exposePosition(selectedPointIndex) {
		if (selectedPointIndex === undefined) selectedPointIndex = guiSelectPoint.getSelectedPointIndex();
		if (selectedPointIndex === -1) return;
		var mesh = cMeshs.__select.options[cMeshs.__select.options.selectedIndex].mesh,
		    position = getObjectPosition(mesh, selectedPointIndex);
		if (axesHelper !== undefined)
			axesHelper.exposePosition({ object: mesh, index: selectedPointIndex });
		if (controllerWorld.x) controllerWorld.x.setValue(position.x);
		if (controllerWorld.y) controllerWorld.y.setValue(position.y);
		if (controllerWorld.z) controllerWorld.z.setValue(position.z);
	}
	function setValue(controller, v) {
		if (!controller) return;
		var input = controller.domElement.querySelector('input'),
		    readOnly = input.readOnly;
		input.readOnly = false;
		controller.object[controller.property] = v;
		if (controller.__onChange) controller.__onChange.call(controller, v);
		controller.initialValue = v;
		controller.updateDisplay();
		input.readOnly = readOnly;
		return controller;
	}
	function setPosition(intersectionSelected) {
		var positionLocal = getObjectLocalPosition(intersectionSelected.object, intersectionSelected.index);
		setValue(controllerX, positionLocal.x);
		setValue(controllerY, positionLocal.y);
		setValue(controllerZ, positionLocal.z);
		var position = getObjectPosition(intersectionSelected.object, intersectionSelected.index);
		setValue(controllerWorld.x, position.x);
		setValue(controllerWorld.y, position.y);
		setValue(controllerWorld.z, position.z);
		var displayControllerW,
		    displayControllerColor,
		    displayControllerOpacity,
		    none = 'none',
		    block = 'block';
		if (typeof intersection.object.userData.arrayFuncs === "function") console.error('arrayFuncs === "function" under constraction');
		var func = intersectionSelected.object.userData.arrayFuncs ? intersectionSelected.object.userData.arrayFuncs[intersectionSelected.index] : undefined,
		    opasity,
		    color = func === undefined ? undefined : Array.isArray(func.w) || typeof func.w === "function" ? execFunc(func, 'w', group.userData.t, options.a, options.b) : func.w;
		if (color === undefined) {
			if (intersectionSelected.object.geometry.attributes.ca === undefined) console.warn('Under constraction. цвет frustumPoints не известен потому что он вычисляется в шейдере D:\My documents\MyProjects\webgl\three.js\GitHub\myThreejs\master\frustumPoints\vertex.c');else {
				var vColor = new THREE$2.Vector4().fromArray(intersectionSelected.object.geometry.attributes.ca.array, intersectionSelected.index * intersectionSelected.object.geometry.attributes.ca.itemSize);
				color = new THREE$2.Color(vColor.x, vColor.y, vColor.z);
				opasity = vColor.w;
			}
		}
		if (color instanceof THREE$2.Color) {
			displayControllerW = none;
			displayControllerColor = block;
			displayControllerOpacity = block;
			if (intersectionSelected.object.userData.arrayFuncs === undefined) {
				displayControllerColor = none;
				displayControllerOpacity = none;
			} else {
				var strColor = '#' + color.getHexString();
				controllerColor.initialValue = strColor;
				controllerColor.setValue(strColor);
				controllerColor.userData = { intersection: intersectionSelected };
				if (opasity !== undefined) {
					setValue(controllerOpacity, opasity);
				} else displayControllerOpacity = none;
				controllerOpacity.userData = { intersection: intersectionSelected };
			}
		} else {
			if (controllerW === undefined) displayControllerW = none;else {
				if (color === undefined) displayControllerW = none;else {
					setValue(controllerW, color);
					displayControllerW = block;
				}
			}
			displayControllerColor = none;
			displayControllerOpacity = none;
		}
		dislayEl(controllerW, displayControllerW);
		dislayEl(controllerColor, displayControllerColor);
		dislayEl(controllerOpacity, displayControllerOpacity);
		var boReadOnly = intersectionSelected.object.userData.boFrustumPoints === true ? true : false;
		if (controllerX) controllerX.domElement.querySelector('input').readOnly = boReadOnly;
		if (controllerY) controllerY.domElement.querySelector('input').readOnly = boReadOnly;
		if (controllerZ) controllerZ.domElement.querySelector('input').readOnly = boReadOnly;
		if (controllerW) controllerW.domElement.querySelector('input').readOnly = boReadOnly;
		controllerColor.domElement.querySelector('input').readOnly = boReadOnly;
		controllerOpacity.domElement.querySelector('input').readOnly = boReadOnly;
	}
	this.setMesh = function () {
		boSetMesh = true;
		setScaleControllers();
		setPositionControllers();
		setRotationControllers();
		exposePosition();
		boSetMesh = false;
	};
	this.setPosition = function (position, intersectionSelected) {
		for (var i = 0; i < cMeshs.__select.length; i++) {
			var option = cMeshs.__select[i];
			if (option.selected && Object.is(option.mesh, intersectionSelected.object)) {
				setPosition(intersectionSelected);
			}
		}
	};
	this.update = function () {
		var mesh = cMeshs.__select.options[cMeshs.__select.options.selectedIndex].mesh;
		if (!mesh) return;
		var index = this.getSelectedPointIndex();
		if (index === -1) return;
		var position = getObjectPosition(mesh, index);
		controllerWorld.x.setValue(position.x);
		controllerWorld.y.setValue(position.y);
		controllerWorld.z.setValue(position.z);
	};
	this.getMeshIndex = function (mesh) {
		if (mesh === undefined) return mesh;
		var index;
		for (index = 0; index < cMeshs.__select.options.length; index++) {
			var option = cMeshs.__select.options[index];
			if (Object.is(option.mesh, mesh)) return index;
		}
	};
	this.setIndexMesh = function (index, mesh) {
		if (index === undefined) return;
		cMeshs.__select.options[index].mesh = mesh;
		this.selectPoint(-1);
	};
	this.selectPoint = function (index) {
		cPoints.__onChange(index);
		cPoints.__select[index + 1].selected = true;
	};
	this.removeMesh = function (mesh) {
		var index = this.getMeshIndex(mesh),
		    selectedIndex = cMeshs.__select.selectedIndex;
		cMeshs.__select.remove(index);
		if (selectedIndex === index) {
			cPoints.__onChange(-1);
			_this.removePoints();
		}
	};
	this.addMesh = function (mesh) {
		for (var i = 0; i < cMeshs.__select.options.length; i++) {
			var option = cMeshs.__select.options[i];
			if (mesh.userData.boFrustumPoints && option.mesh !== undefined && option.mesh.userData.boFrustumPoints) return;
			if (option.mesh !== undefined && mesh.name !== '' &&
			option.mesh.name === mesh.name) {
				return;
			}
		}
		var opt = document.createElement('option');
		opt.innerHTML = cMeshs.__select.length + ' ' + (mesh.name === '' ? mesh.constructor.name : mesh.name);
		opt.mesh = mesh;
		mesh.userData.default = mesh.userData.default || {
			scale: new THREE$2.Vector3().copy(mesh.scale),
			position: mesh.position instanceof THREE$2.Vector3 ? new THREE$2.Vector3().copy(mesh.position) : mesh.position instanceof THREE$2.Vector4 ? new THREE$2.Vector4().copy(mesh.position) : undefined,
			rotation: new THREE$2.Euler().copy(mesh.rotation)
		};
		cMeshs.__select.appendChild(opt);
	};
	this.select = function (intersectionSelected) {
		var position = getObjectLocalPosition(intersectionSelected.object, intersectionSelected.index);
		if (f3DObjects === undefined) {
			console.error('Не знаю как сюда попасть');
		}
		var index = this.getMeshIndex(intersectionSelected.object);
		if (!index) return;
		if (cMeshs.__select[index].selected === false) {
			cMeshs.__select[index].selected = true;
			cMeshs.__onChange(index - 1);
		}
		this.selectPoint2 = function (selectedMesh) {
			if (intersectionSelected.index === undefined || isNaN(intersectionSelected.index)) return;
			if (selectedMesh !== undefined && !Object.is(intersectionSelected.object, selectedMesh)) return;
			if (!intersectionSelected.object.userData.boFrustumPoints) {
				cPoints.__select[intersectionSelected.index + 1].selected = true;
			} else {
				cFrustumPoints.pointIndexes(intersectionSelected.object.userData.pointIndexes(intersectionSelected.index));
			}
			var block = 'block';
			fPoint.domElement.style.display = block;
			fPointWorld.domElement.style.display = block;
			intersection = intersectionSelected;
			if (guiParams.setIntersection) guiParams.setIntersection(intersectionSelected);
			setPosition(intersectionSelected);
			var mesh = getMesh();
			var line = mesh.userData.arrayFuncs === undefined || typeof intersection.object.userData.arrayFuncs === "function" ? undefined : mesh.userData.arrayFuncs[intersectionSelected.index].line;
			if (cTrace) cTrace.setValue(line === undefined ? false : line.isVisible());
			cRestoreDefaultLocalPosition.domElement.parentElement.parentElement.style.display = intersection.object.userData.arrayFuncs === undefined ? 'none' : block;
		};
		this.selectPoint2();
	};
	this.isSelectedMesh = function (meshCur) {
		return getMesh() === meshCur;
	};
	this.getSelectedPointIndex = function () {
		if (cFrustumPoints !== undefined && cFrustumPoints.isDisplay() &&
		options.arrayCloud.frustumPoints && options.arrayCloud.frustumPoints.isDisplay()
		) {
				var selectedIndex = cFrustumPoints.getSelectedIndex();
				return selectedIndex === null ? -1 : selectedIndex;
			}
		if (cPoints === undefined) {
			if (selectedPointIndex === undefined) console.error('myThreejs.create.onloadScripts.init.guiSelectPoint.getSelectedPointIndex:  selectedPointIndex = ' + selectedPointIndex);
			return selectedPointIndex;
		}
		var index = cPoints.__select.selectedOptions[0].index;
		return index - 1;
	};
	function getMesh() {
		var selectedIndex = cMeshs.__select.options.selectedIndex;
		if (selectedIndex !== -1) return cMeshs.__select.options[cMeshs.__select.options.selectedIndex].mesh;
		return undefined;
	}
	function isNotSetControllers() {
		return getMesh() === undefined;
	}
	function setScaleControllers() {
		if (isNotSetControllers()) return;
		var mesh = getMesh();
		if (cScaleX) cScaleX.setValue(mesh.scale.x);
		if (cScaleY) cScaleY.setValue(mesh.scale.y);
		if (cScaleZ) cScaleZ.setValue(mesh.scale.z);
	}
	function setPositionControllers() {
		if (isNotSetControllers()) return;
		var mesh = getMesh();
		if (cPosition.x) cPosition.x.setValue(mesh.position.x);
		if (cPosition.y) cPosition.y.setValue(mesh.position.y);
		if (cPosition.z) cPosition.z.setValue(mesh.position.z);
	}
	function setRotationControllers() {
		if (isNotSetControllers()) return;
		var mesh = getMesh();
		if (cRotations.x) cRotations.x.setValue(mesh.rotation.x);
		if (cRotations.y) cRotations.y.setValue(mesh.rotation.y);
		if (cRotations.z) cRotations.z.setValue(mesh.rotation.z);
	}
	this.add = function (folder) {
		f3DObjects = folder.addFolder(lang.meshs);
		var mesh, buttonScaleDefault, buttonPositionDefault, buttonRotationDefault;
		cMeshs = f3DObjects.add({ Meshs: lang.notSelected }, 'Meshs', defineProperty({}, lang.notSelected, -1)).onChange(function (value) {
			value = parseInt(value);
			mesh = getMesh();
			var display;
			if (mesh === undefined) {
				display = 'none';
				mesh = undefined;
				if (axesHelper !== undefined) axesHelper.exposePosition(getObjectPosition(getMesh(), value));
			} else {
				var displayDefaultButtons = mesh.userData.default === undefined ? 'none' : 'block';
				buttonScaleDefault.domElement.parentElement.parentElement.style.display = displayDefaultButtons;
				buttonPositionDefault.domElement.parentElement.parentElement.style.display = displayDefaultButtons;
				buttonRotationDefault.domElement.parentElement.parentElement.style.display = displayDefaultButtons;
				display = 'block';
				var displayPoints = 'none',
				    displayFrustumPoints = 'block';
				cPoints.__onChange(-1);
				_this.removePoints();
				if (mesh.userData.controllers !== undefined) {
					mesh.userData.controllers();
				} else {
					displayPoints = 'block';
					displayFrustumPoints = 'none';
					for (var iPosition = 0; iPosition < mesh.geometry.attributes.position.count; iPosition++) {
						var opt = document.createElement('option'),
						    name = mesh.userData.arrayFuncs === undefined ? undefined : mesh.userData.pointName === undefined ? typeof mesh.userData.arrayFuncs === "function" ? undefined : mesh.userData.arrayFuncs[iPosition].name : mesh.userData.pointName(iPosition);
						opt.innerHTML = iPosition + (name === undefined ? '' : ' ' + name);
						opt.setAttribute('value', iPosition);
						cPoints.__select.appendChild(opt);
					}
				}
				cPoints.domElement.parentElement.parentElement.style.display = displayPoints;
				if (cTraceAll) cTraceAll.domElement.parentElement.parentElement.style.display = displayPoints;
				if (cFrustumPoints !== undefined) cFrustumPoints.display(displayFrustumPoints);
				setScaleControllers();
				setPositionControllers();
				setRotationControllers();
			}
			fMesh.domElement.style.display = display;
			if (mesh !== undefined && mesh.userData.traceAll !== undefined) cTraceAll.setValue(mesh.userData.traceAll);
		});
		dat.controllerNameAndTitle(cMeshs, lang.select);
		fMesh = f3DObjects.addFolder(lang.mesh);
		fMesh.domElement.style.display = 'none';
		fMesh.open();
		var fScale = fMesh.addFolder(lang.scale);
		fScale.add(new ScaleController(function (customController, action) {
			var zoom = customController.controller.getValue();
			mesh.scale.x = action(mesh.scale.x, zoom);
			mesh.scale.y = action(mesh.scale.y, zoom);
			mesh.scale.z = action(mesh.scale.z, zoom);
			mesh.needsUpdate = true;
			setScaleControllers();
			exposePosition();
			if (options.arrayCloud !== undefined && options.arrayCloud.frustumPoints !== undefined) options.arrayCloud.frustumPoints.updateCloudPoint(mesh);
		}, {
			settings: { zoomMultiplier: 1.1 },
			getLanguageCode: getLanguageCode
		}));
		var scale = new THREE$2.Vector3();
		function setScale(axesName, value) {
			mesh.scale[axesName] = value;
			mesh.needsUpdate = true;
			exposePosition();
			if (options.arrayCloud !== undefined && options.arrayCloud.frustumPoints !== undefined) options.arrayCloud.frustumPoints.updateCloudPoint(mesh);
		}
		if (options.scales.x) {
			cScaleX = dat.controllerZeroStep(fScale, scale, 'x', function (value) {
				setScale('x', value);
			});
			dat.controllerNameAndTitle(cScaleX, options.scales.x.name);
		}
		if (options.scales.y) {
			cScaleY = dat.controllerZeroStep(fScale, scale, 'y', function (value) {
				setScale('y', value);
			});
			dat.controllerNameAndTitle(cScaleY, options.scales.y.name);
		}
		if (options.scales.z) {
			cScaleZ = dat.controllerZeroStep(fScale, scale, 'z', function (value) {
				setScale('z', value);
			});
			dat.controllerNameAndTitle(cScaleZ, options.scales.z.name);
		}
		buttonScaleDefault = fScale.add({
			defaultF: function defaultF(value) {
				mesh.scale.copy(mesh.userData.default.scale);
				mesh.needsUpdate = true;
				setScaleControllers();
				exposePosition();
			}
		}, 'defaultF');
		dat.controllerNameAndTitle(buttonScaleDefault, lang.defaultButton, lang.defaultScaleTitle);
		var fPosition = fMesh.addFolder(lang.position);
		function addAxisControllers(name) {
			var scale = options.scales[name];
			if (!scale) return;
			var axesName = scale.name,
			    f = fPosition.addFolder(axesName);
			f.add(new PositionController(function (shift) {
				mesh.position[name] += shift;
				mesh.needsUpdate = true;
				setPositionControllers();
				exposePosition();
				if (options.arrayCloud !== undefined && options.arrayCloud.frustumPoints !== undefined) options.arrayCloud.frustumPoints.updateCloudPoint(mesh);
			}, { getLanguageCode: getLanguageCode }));
			function setPosition(value) {
				mesh.position[name] = value;
				mesh.needsUpdate = true;
				exposePosition();
			}
			var position = new THREE$2.Vector3();
			cPosition[name] = dat.controllerZeroStep(f, position, name, function (value) {
				setPosition(value);
			});
			dat.controllerNameAndTitle(cPosition[name], axesName);
		}
		addAxisControllers('x');
		addAxisControllers('y');
		addAxisControllers('z');
		buttonPositionDefault = fPosition.add({
			defaultF: function defaultF(value) {
				mesh.position.copy(mesh.userData.default.position);
				mesh.needsUpdate = true;
				setPositionControllers();
				exposePosition();
			}
		}, 'defaultF');
		dat.controllerNameAndTitle(buttonPositionDefault, lang.defaultButton, lang.defaultPositionTitle);
		var fRotation = fMesh.addFolder(lang.rotation);
		function addRotationControllers(name) {
			var scale = options.scales[name];
			if (!scale) return;
			cRotations[name] = fRotation.add(new THREE$2.Vector3(), name, 0, Math.PI * 2, 1 / 360).onChange(function (value) {
				var mesh = getMesh();
				if (!mesh.userData.boFrustumPoints) {
					mesh.rotation[name] = value;
					mesh.needsUpdate = true;
				}
				if (!boSetMesh) exposePosition();
				if (options.arrayCloud !== undefined && options.arrayCloud.frustumPoints !== undefined) options.arrayCloud.frustumPoints.updateCloudPoint(mesh);
			});
			dat.controllerNameAndTitle(cRotations[name], scale.name);
		}
		addRotationControllers('x');
		addRotationControllers('y');
		addRotationControllers('z');
		buttonRotationDefault = fRotation.add({
			defaultF: function defaultF(value) {
				mesh.rotation.copy(mesh.userData.default.rotation);
				mesh.needsUpdate = true;
				setRotationControllers();
				exposePosition();
			}
		}, 'defaultF');
		dat.controllerNameAndTitle(buttonRotationDefault, lang.defaultButton, lang.defaultRotationTitle);
		fPoints = fMesh.addFolder(lang.points);
		cPoints = fPoints.add({ Points: lang.notSelected }, 'Points', defineProperty({}, lang.notSelected, -1)).onChange(function (value) {
			value = parseInt(value);
			var display;
			if (value === -1) {
				display = 'none';
			} else {
				display = 'block';
				_this.select({ object: getMesh(), index: value });
			}
			if (axesHelper !== undefined) axesHelper.exposePosition(getObjectPosition(getMesh(), value));
			fPoint.domElement.style.display = display;
			fPointWorld.domElement.style.display = display;
		});
		cPoints.__select[0].selected = true;
		dat.controllerNameAndTitle(cPoints, lang.select);
		if (cFrustumPoints !== undefined) cFrustumPoints.create(fPoints, getLanguageCode());
		if (guiParams.myThreejs) guiParams.myThreejs.cFrustumPoints = cFrustumPoints;
		fPoint = fPoints.addFolder(lang.point);
		dat.folderNameAndTitle(fPoint, lang.point, lang.pointTitle);
		fPoint.domElement.style.display = 'none';
		fPointWorld = fPoints.addFolder(lang.pointWorld);
		dat.folderNameAndTitle(fPointWorld, lang.pointWorld, lang.pointWorldTitle);
		fPointWorld.domElement.style.display = 'none';
		fPointWorld.open();
		if (guiParams.pointsControls) cTraceAll = guiParams.pointsControls(fPoints, dislayEl, getMesh);
		dat.controllerNameAndTitle(f3DObjects.add({
			defaultF: function defaultF(value) {
				for (var i = 0; i < cMeshs.__select.options.length; i++) {
					var _mesh = cMeshs.__select.options[i].mesh;
					if (!_mesh) continue;
					_mesh.scale.copy(_mesh.userData.default.scale);
					_mesh.position.copy(_mesh.userData.default.position);
					_mesh.rotation.copy(_mesh.userData.default.rotation);
					_mesh.needsUpdate = true;
				}
				setScaleControllers();
				setPositionControllers();
				setRotationControllers();
				exposePosition();
			}
		}, 'defaultF'), lang.defaultButton, lang.default3DObjectTitle);
		addPointControllers();
	};
	this.setColorAttribute = function (attributes, i, color) {
		if (typeof color === "string") color = new THREE$2.Color(color);
		var colorAttribute = attributes.color || attributes.ca;
		if (colorAttribute === undefined) return;
		colorAttribute.setX(i, color.r);
		colorAttribute.setY(i, color.g);
		colorAttribute.setZ(i, color.b);
		colorAttribute.needsUpdate = true;
	};
	this.removePoints = function () {
		cPoints.domElement.querySelectorAll('select option').forEach(function (option) {
			return option.remove();
		});
		var opt = document.createElement('option');
		opt.innerHTML = lang.notSelected;
		opt.setAttribute('value', -1);
		cPoints.__select.appendChild(opt);
	};
	function addPointControllers() {
		function isReadOnlyController(controller) {
			if (controller.domElement.querySelector('input').readOnly) {
				if (controller.getValue() !== controller.initialValue) {
					if (controller.boSetValue === undefined) {
						controller.boSetValue = true;
						setValue(controller, controller.initialValue);
						controller.boSetValue = undefined;
						controller.initialValue = controller.getValue();
					}
				}
				return true;
			}
			return false;
		}
		function axesGui(axisName                     ) {
			var scale, controller;
			if (axisName === 'w') {
				if (options.scales.w === undefined) return;
				scale = options.scales.w;
				controller = fPoint.add({
					value: scale.min
				}, 'value', scale.min, scale.max, (scale.max - scale.min) / 100).onChange(function (value) {
					var color = options.palette.toColor(value, controller.__min, controller.__max),
					    attributes = intersection.object.geometry.attributes,
					    i = intersection.index;
					_this.setColorAttribute(attributes, i, color);
					attributes.position.setW(i, value);
					if (options.arrayCloud !== undefined && options.arrayCloud.frustumPoints !== undefined) options.arrayCloud.frustumPoints.updateCloudPointItem(intersection.object, intersection.index);
				});
				if (options.palette instanceof ColorPicker.palette) {
					controller.domElement.querySelector('.slider-fg').style.height = '40%';
					var elSlider = controller.domElement.querySelector('.slider');
					ColorPicker.create(elSlider, {
						palette: options.palette,
						style: {
						}
					});
				}
			} else {
				scale = axesHelper === undefined ? options.scales[axisName] :
				axesHelper.options ? axesHelper.options.scales[axisName] : undefined;
				if (scale) controller = fPoint.add({
					value: scale.min
				}, 'value', scale.min, scale.max, (scale.max - scale.min) / 100).onChange(function (value) {
					if (isReadOnlyController(controller)) return;
					var points = intersection.object,
					    axesId = axisName === 'x' ? 0 : axisName === 'y' ? 1 : axisName === 'z' ? 2 : axisName === 'w' ? 3 : console.error('axisName:' + axisName);
					points.geometry.attributes.position.array[axesId + intersection.index * points.geometry.attributes.position.itemSize] = value;
					points.geometry.attributes.position.needsUpdate = true;
					exposePosition(intersection.index);
					if (options.arrayCloud !== undefined && options.arrayCloud.frustumPoints !== undefined) options.arrayCloud.frustumPoints.updateCloudPointItem(points, intersection.index);
				});
			}
			if (scale) dat.controllerNameAndTitle(controller, scale.name);
			return controller;
		}
		controllerX = axesGui('x');
		controllerY = axesGui('y');
		controllerZ = axesGui('z');
		controllerW = axesGui('w');
		controllerColor = fPoint.addColor({
			color: '#FFFFFF'
		}, 'color').onChange(function (value) {
			if (isReadOnlyController(controllerColor)) return;
			if (controllerColor.userData === undefined) return;
			var intersection = controllerColor.userData.intersection;
			_this.setColorAttribute(intersection.object.geometry.attributes, intersection.index, value);
		});
		dat.controllerNameAndTitle(controllerColor, lang.color);
		controllerOpacity = fPoint.add({
			opasity: 1
		}, 'opasity', 0, 1, 0.01).onChange(function (opasity) {
			if (isReadOnlyController(controllerOpacity)) return;
			var intersection = controllerColor.userData.intersection;
			var points = intersection.object;
			if (points.geometry.attributes.ca === undefined) return;
			points.geometry.attributes.ca.array[3 + intersection.index * points.geometry.attributes.ca.itemSize] = opasity;
			points.geometry.attributes.ca.needsUpdate = true;
		});
		dat.controllerNameAndTitle(controllerOpacity, lang.opacity, lang.opacityTitle);
		if (guiParams.pointControls) cTrace = guiParams.pointControls(fPoint, dislayEl, getMesh, intersection);
		function axesWorldGui(axisName) {
			var scale = axesHelper === undefined ? options.scales[axisName] : axesHelper.options ? axesHelper.options.scales[axisName] : undefined;
			if (!scale) return;
			var controller = dat.controllerZeroStep(fPointWorld, { value: scale.min }, 'value');
			controller.domElement.querySelector('input').readOnly = true;
			dat.controllerNameAndTitle(controller, scale.name);
			return controller;
		}
		controllerWorld.x = axesWorldGui('x');
		controllerWorld.y = axesWorldGui('y');
		controllerWorld.z = axesWorldGui('z');
		cRestoreDefaultLocalPosition = fPoint.add({
			defaultF: function defaultF() {
				var positionDefault = intersection.object.userData.arrayFuncs[intersection.index];
				controllerX.setValue(typeof positionDefault.x === "function" ? positionDefault.x(group.userData.t, options.a, options.b) : positionDefault.x);
				controllerY.setValue(typeof positionDefault.y === "function" ? positionDefault.y(group.userData.t, options.a, options.b) : positionDefault.y);
				controllerZ.setValue(typeof positionDefault.z === "function" ? positionDefault.z(group.userData.t, options.a, options.b) : positionDefault.z === undefined ? 0 :
				positionDefault.z);
				if (positionDefault.w !== undefined) {
					if (positionDefault.w.r !== undefined) controllerColor.setValue('#' + new THREE$2.Color(positionDefault.w.r, positionDefault.w.g, positionDefault.w.b).getHexString());else if (typeof positionDefault.w === "function") setValue(controllerW, positionDefault.w(group.userData.t));else console.error('Restore default local position: Invalid W axis.');
				} else {
					controllerColor.setValue(controllerColor.initialValue);
					controllerOpacity.setValue(controllerOpacity.initialValue);
				}
			}
		}, 'defaultF');
		dat.controllerNameAndTitle(cRestoreDefaultLocalPosition, lang.defaultButton, lang.defaultLocalPositionTitle);
	}
	this.getFrustumPoints = function () {
		return cFrustumPoints;
	};
	this.windowRange = function (options) {
		pointLight1.windowRange(options.scales);
		pointLight2.windowRange(options.scales);
		controllerX.min(options.scales.x.min);
		controllerX.max(options.scales.x.max);
		controllerX.updateDisplay();
		controllerY.min(options.scales.y.min);
		controllerY.max(options.scales.y.max);
		controllerY.updateDisplay();
		controllerZ.min(options.scales.z.min);
		controllerZ.max(options.scales.z.max);
		controllerZ.updateDisplay();
		if (controllerW !== undefined) {
			controllerW.min(options.scales.w.min);
			controllerW.max(options.scales.w.max);
			controllerW.updateDisplay();
		}
	};
	return this;
}
function getObjectLocalPosition(object, index) {
	if (!THREE$2) {
		console.error('getObjectLocalPosition: call GuiSelectPoint.setTHREE( THREE ); first');
		return;
	}
	var attributesPosition = object.geometry.attributes.position,
	    position = attributesPosition.itemSize >= 4 ? new THREE$2.Vector4(0, 0, 0, 0) : new THREE$2.Vector3();
	position.fromArray(attributesPosition.array, index * attributesPosition.itemSize);
	return position;
}
function getWorldPosition(object, pos) {
	var position = pos.clone();
	function getPosition(object, pos) {
		var position = new THREE$2.Vector3(),
		    positionAngle = new THREE$2.Vector3();
		position = pos.clone();
		position.multiply(object.scale);
		positionAngle.copy(position);
		positionAngle.applyEuler(object.rotation);
		position.x = positionAngle.x;
		position.y = positionAngle.y;
		position.z = positionAngle.z;
		position.add(object.position);
		return position;
	}
	do {
		position = getPosition(object, position);
		object = object.parent;
	} while (object.parent);
	return position;
}
function getObjectPosition(object, index) {
	if (index === -1) return undefined;
	if (index === undefined) return object.position;
	return getWorldPosition(object, getObjectLocalPosition(object, index));
}
GuiSelectPoint.setTHREE = function (_THREE) {
	if (THREE$2) {
		if (!Object.is(THREE$2, _THREE)) console.error('GuiSelectPoint.setTHREE: duplicate THREE. Please use one instance of the THREE library.');
		return;
	}
	THREE$2 = _THREE;
};

function ___$insertStyle$1(css) {
  if (!css) {
    return;
  }
  if (typeof window === 'undefined') {
    return;
  }
  var style = document.createElement('style');
  style.setAttribute('type', 'text/css');
  style.innerHTML = css;
  document.head.appendChild(style);
  return css;
}
function colorToString$1(color, forceCSSHex) {
  var colorFormat = color.__state.conversionName.toString();
  var r = Math.round(color.r);
  var g = Math.round(color.g);
  var b = Math.round(color.b);
  var a = color.a;
  var h = Math.round(color.h);
  var s = color.s.toFixed(1);
  var v = color.v.toFixed(1);
  if (forceCSSHex || colorFormat === 'THREE_CHAR_HEX' || colorFormat === 'SIX_CHAR_HEX') {
    var str = color.hex.toString(16);
    while (str.length < 6) {
      str = '0' + str;
    }
    return '#' + str;
  } else if (colorFormat === 'CSS_RGB') {
    return 'rgb(' + r + ',' + g + ',' + b + ')';
  } else if (colorFormat === 'CSS_RGBA') {
    return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
  } else if (colorFormat === 'HEX') {
    return '0x' + color.hex.toString(16);
  } else if (colorFormat === 'RGB_ARRAY') {
    return '[' + r + ',' + g + ',' + b + ']';
  } else if (colorFormat === 'RGBA_ARRAY') {
    return '[' + r + ',' + g + ',' + b + ',' + a + ']';
  } else if (colorFormat === 'RGB_OBJ') {
    return '{r:' + r + ',g:' + g + ',b:' + b + '}';
  } else if (colorFormat === 'RGBA_OBJ') {
    return '{r:' + r + ',g:' + g + ',b:' + b + ',a:' + a + '}';
  } else if (colorFormat === 'HSV_OBJ') {
    return '{h:' + h + ',s:' + s + ',v:' + v + '}';
  } else if (colorFormat === 'HSVA_OBJ') {
    return '{h:' + h + ',s:' + s + ',v:' + v + ',a:' + a + '}';
  }
  return 'unknown format';
}
var ARR_EACH$1 = Array.prototype.forEach;
var ARR_SLICE$1 = Array.prototype.slice;
var Common$1 = {
  BREAK: {},
  extend: function extend(target) {
    this.each(ARR_SLICE$1.call(arguments, 1), function (obj) {
      var keys = this.isObject(obj) ? Object.keys(obj) : [];
      keys.forEach(function (key) {
        if (!this.isUndefined(obj[key])) {
          target[key] = obj[key];
        }
      }.bind(this));
    }, this);
    return target;
  },
  defaults: function defaults$$1(target) {
    this.each(ARR_SLICE$1.call(arguments, 1), function (obj) {
      var keys = this.isObject(obj) ? Object.keys(obj) : [];
      keys.forEach(function (key) {
        if (this.isUndefined(target[key])) {
          target[key] = obj[key];
        }
      }.bind(this));
    }, this);
    return target;
  },
  compose: function compose() {
    var toCall = ARR_SLICE$1.call(arguments);
    return function () {
      var args = ARR_SLICE$1.call(arguments);
      for (var i = toCall.length - 1; i >= 0; i--) {
        args = [toCall[i].apply(this, args)];
      }
      return args[0];
    };
  },
  each: function each(obj, itr, scope) {
    if (!obj) {
      return;
    }
    if (ARR_EACH$1 && obj.forEach && obj.forEach === ARR_EACH$1) {
      obj.forEach(itr, scope);
    } else if (obj.length === obj.length + 0) {
      var key = void 0;
      var l = void 0;
      for (key = 0, l = obj.length; key < l; key++) {
        if (key in obj && itr.call(scope, obj[key], key) === this.BREAK) {
          return;
        }
      }
    } else {
      for (var _key in obj) {
        if (itr.call(scope, obj[_key], _key) === this.BREAK) {
          return;
        }
      }
    }
  },
  defer: function defer(fnc) {
    setTimeout(fnc, 0);
  },
  debounce: function debounce(func, threshold, callImmediately) {
    var timeout = void 0;
    return function () {
      var obj = this;
      var args = arguments;
      function delayed() {
        timeout = null;
        if (!callImmediately) func.apply(obj, args);
      }
      var callNow = callImmediately || !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(delayed, threshold);
      if (callNow) {
        func.apply(obj, args);
      }
    };
  },
  toArray: function toArray$$1(obj) {
    if (obj.toArray) return obj.toArray();
    return ARR_SLICE$1.call(obj);
  },
  isUndefined: function isUndefined(obj) {
    return obj === undefined;
  },
  isNull: function isNull(obj) {
    return obj === null;
  },
  isNaN: function (_isNaN) {
    function isNaN(_x) {
      return _isNaN.apply(this, arguments);
    }
    isNaN.toString = function () {
      return _isNaN.toString();
    };
    return isNaN;
  }(function (obj) {
    return isNaN(obj);
  }),
  isArray: Array.isArray || function (obj) {
    return obj.constructor === Array;
  },
  isObject: function isObject(obj) {
    return obj === Object(obj);
  },
  isNumber: function isNumber(obj) {
    return obj === obj + 0;
  },
  isString: function isString(obj) {
    return obj === obj + '';
  },
  isBoolean: function isBoolean(obj) {
    return obj === false || obj === true;
  },
  isFunction: function isFunction(obj) {
    return Object.prototype.toString.call(obj) === '[object Function]';
  }
};
var INTERPRETATIONS$1 = [{
  litmus: Common$1.isString,
  conversions: {
    THREE_CHAR_HEX: {
      read: function read(original) {
        var test = original.match(/^#([A-F0-9])([A-F0-9])([A-F0-9])$/i);
        if (test === null) {
          return false;
        }
        return {
          space: 'HEX',
          hex: parseInt('0x' + test[1].toString() + test[1].toString() + test[2].toString() + test[2].toString() + test[3].toString() + test[3].toString(), 0)
        };
      },
      write: colorToString$1
    },
    SIX_CHAR_HEX: {
      read: function read(original) {
        var test = original.match(/^#([A-F0-9]{6})$/i);
        if (test === null) {
          return false;
        }
        return {
          space: 'HEX',
          hex: parseInt('0x' + test[1].toString(), 0)
        };
      },
      write: colorToString$1
    },
    CSS_RGB: {
      read: function read(original) {
        var test = original.match(/^rgb\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\)/);
        if (test === null) {
          return false;
        }
        return {
          space: 'RGB',
          r: parseFloat(test[1]),
          g: parseFloat(test[2]),
          b: parseFloat(test[3])
        };
      },
      write: colorToString$1
    },
    CSS_RGBA: {
      read: function read(original) {
        var test = original.match(/^rgba\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\)/);
        if (test === null) {
          return false;
        }
        return {
          space: 'RGB',
          r: parseFloat(test[1]),
          g: parseFloat(test[2]),
          b: parseFloat(test[3]),
          a: parseFloat(test[4])
        };
      },
      write: colorToString$1
    }
  }
}, {
  litmus: Common$1.isNumber,
  conversions: {
    HEX: {
      read: function read(original) {
        return {
          space: 'HEX',
          hex: original,
          conversionName: 'HEX'
        };
      },
      write: function write(color) {
        return color.hex;
      }
    }
  }
}, {
  litmus: Common$1.isArray,
  conversions: {
    RGB_ARRAY: {
      read: function read(original) {
        if (original.length !== 3) {
          return false;
        }
        return {
          space: 'RGB',
          r: original[0],
          g: original[1],
          b: original[2]
        };
      },
      write: function write(color) {
        return [color.r, color.g, color.b];
      }
    },
    RGBA_ARRAY: {
      read: function read(original) {
        if (original.length !== 4) return false;
        return {
          space: 'RGB',
          r: original[0],
          g: original[1],
          b: original[2],
          a: original[3]
        };
      },
      write: function write(color) {
        return [color.r, color.g, color.b, color.a];
      }
    }
  }
}, {
  litmus: Common$1.isObject,
  conversions: {
    RGBA_OBJ: {
      read: function read(original) {
        if (Common$1.isNumber(original.r) && Common$1.isNumber(original.g) && Common$1.isNumber(original.b) && Common$1.isNumber(original.a)) {
          return {
            space: 'RGB',
            r: original.r,
            g: original.g,
            b: original.b,
            a: original.a
          };
        }
        return false;
      },
      write: function write(color) {
        return {
          r: color.r,
          g: color.g,
          b: color.b,
          a: color.a
        };
      }
    },
    RGB_OBJ: {
      read: function read(original) {
        if (Common$1.isNumber(original.r) && Common$1.isNumber(original.g) && Common$1.isNumber(original.b)) {
          return {
            space: 'RGB',
            r: original.r,
            g: original.g,
            b: original.b
          };
        }
        return false;
      },
      write: function write(color) {
        return {
          r: color.r,
          g: color.g,
          b: color.b
        };
      }
    },
    HSVA_OBJ: {
      read: function read(original) {
        if (Common$1.isNumber(original.h) && Common$1.isNumber(original.s) && Common$1.isNumber(original.v) && Common$1.isNumber(original.a)) {
          return {
            space: 'HSV',
            h: original.h,
            s: original.s,
            v: original.v,
            a: original.a
          };
        }
        return false;
      },
      write: function write(color) {
        return {
          h: color.h,
          s: color.s,
          v: color.v,
          a: color.a
        };
      }
    },
    HSV_OBJ: {
      read: function read(original) {
        if (Common$1.isNumber(original.h) && Common$1.isNumber(original.s) && Common$1.isNumber(original.v)) {
          return {
            space: 'HSV',
            h: original.h,
            s: original.s,
            v: original.v
          };
        }
        return false;
      },
      write: function write(color) {
        return {
          h: color.h,
          s: color.s,
          v: color.v
        };
      }
    }
  }
}];
var result$1 = void 0;
var toReturn$1 = void 0;
var interpret$1 = function interpret() {
  toReturn$1 = false;
  var original = arguments.length > 1 ? Common$1.toArray(arguments) : arguments[0];
  Common$1.each(INTERPRETATIONS$1, function (family) {
    if (family.litmus(original)) {
      Common$1.each(family.conversions, function (conversion, conversionName) {
        result$1 = conversion.read(original);
        if (toReturn$1 === false && result$1 !== false) {
          toReturn$1 = result$1;
          result$1.conversionName = conversionName;
          result$1.conversion = conversion;
          return Common$1.BREAK;
        }
      });
      return Common$1.BREAK;
    }
  });
  return toReturn$1;
};
var tmpComponent$1 = void 0;
var ColorMath$1 = {
  hsv_to_rgb: function hsv_to_rgb(h, s, v) {
    var hi = Math.floor(h / 60) % 6;
    var f = h / 60 - Math.floor(h / 60);
    var p = v * (1.0 - s);
    var q = v * (1.0 - f * s);
    var t = v * (1.0 - (1.0 - f) * s);
    var c = [[v, t, p], [q, v, p], [p, v, t], [p, q, v], [t, p, v], [v, p, q]][hi];
    return {
      r: c[0] * 255,
      g: c[1] * 255,
      b: c[2] * 255
    };
  },
  rgb_to_hsv: function rgb_to_hsv(r, g, b) {
    var min = Math.min(r, g, b);
    var max = Math.max(r, g, b);
    var delta = max - min;
    var h = void 0;
    var s = void 0;
    if (max !== 0) {
      s = delta / max;
    } else {
      return {
        h: NaN,
        s: 0,
        v: 0
      };
    }
    if (r === max) {
      h = (g - b) / delta;
    } else if (g === max) {
      h = 2 + (b - r) / delta;
    } else {
      h = 4 + (r - g) / delta;
    }
    h /= 6;
    if (h < 0) {
      h += 1;
    }
    return {
      h: h * 360,
      s: s,
      v: max / 255
    };
  },
  rgb_to_hex: function rgb_to_hex(r, g, b) {
    var hex = this.hex_with_component(0, 2, r);
    hex = this.hex_with_component(hex, 1, g);
    hex = this.hex_with_component(hex, 0, b);
    return hex;
  },
  component_from_hex: function component_from_hex(hex, componentIndex) {
    return hex >> componentIndex * 8 & 0xFF;
  },
  hex_with_component: function hex_with_component(hex, componentIndex, value) {
    return value << (tmpComponent$1 = componentIndex * 8) | hex & ~(0xFF << tmpComponent$1);
  }
};
var _typeof$2 = typeof Symbol === "function" && _typeof(Symbol.iterator) === "symbol" ? function (obj) {
  return typeof obj === 'undefined' ? 'undefined' : _typeof(obj);
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === 'undefined' ? 'undefined' : _typeof(obj);
};
var classCallCheck$2 = function classCallCheck$$1(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};
var createClass$2 = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();
var get$3 = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);
  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);
    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;
    if (getter === undefined) {
      return undefined;
    }
    return getter.call(receiver);
  }
};
var inherits$2 = function inherits$$1(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === 'undefined' ? 'undefined' : _typeof(superClass)));
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};
var possibleConstructorReturn$2 = function possibleConstructorReturn$$1(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return call && ((typeof call === 'undefined' ? 'undefined' : _typeof(call)) === "object" || typeof call === "function") ? call : self;
};
var Color$1 = function () {
  function Color() {
    classCallCheck$2(this, Color);
    this.__state = interpret$1.apply(this, arguments);
    if (this.__state === false) {
      throw new Error('Failed to interpret color arguments');
    }
    this.__state.a = this.__state.a || 1;
  }
  createClass$2(Color, [{
    key: 'toString',
    value: function toString() {
      return colorToString$1(this);
    }
  }, {
    key: 'toHexString',
    value: function toHexString() {
      return colorToString$1(this, true);
    }
  }, {
    key: 'toOriginal',
    value: function toOriginal() {
      return this.__state.conversion.write(this);
    }
  }]);
  return Color;
}();
function defineRGBComponent$1(target, component, componentHexIndex) {
  Object.defineProperty(target, component, {
    get: function get$$1() {
      if (this.__state.space === 'RGB') {
        return this.__state[component];
      }
      Color$1.recalculateRGB(this, component, componentHexIndex);
      return this.__state[component];
    },
    set: function set$$1(v) {
      if (this.__state.space !== 'RGB') {
        Color$1.recalculateRGB(this, component, componentHexIndex);
        this.__state.space = 'RGB';
      }
      this.__state[component] = v;
    }
  });
}
function defineHSVComponent$1(target, component) {
  Object.defineProperty(target, component, {
    get: function get$$1() {
      if (this.__state.space === 'HSV') {
        return this.__state[component];
      }
      Color$1.recalculateHSV(this);
      return this.__state[component];
    },
    set: function set$$1(v) {
      if (this.__state.space !== 'HSV') {
        Color$1.recalculateHSV(this);
        this.__state.space = 'HSV';
      }
      this.__state[component] = v;
    }
  });
}
Color$1.recalculateRGB = function (color, component, componentHexIndex) {
  if (color.__state.space === 'HEX') {
    color.__state[component] = ColorMath$1.component_from_hex(color.__state.hex, componentHexIndex);
  } else if (color.__state.space === 'HSV') {
    Common$1.extend(color.__state, ColorMath$1.hsv_to_rgb(color.__state.h, color.__state.s, color.__state.v));
  } else {
    throw new Error('Corrupted color state');
  }
};
Color$1.recalculateHSV = function (color) {
  var result = ColorMath$1.rgb_to_hsv(color.r, color.g, color.b);
  Common$1.extend(color.__state, {
    s: result.s,
    v: result.v
  });
  if (!Common$1.isNaN(result.h)) {
    color.__state.h = result.h;
  } else if (Common$1.isUndefined(color.__state.h)) {
    color.__state.h = 0;
  }
};
Color$1.COMPONENTS = ['r', 'g', 'b', 'h', 's', 'v', 'hex', 'a'];
defineRGBComponent$1(Color$1.prototype, 'r', 2);
defineRGBComponent$1(Color$1.prototype, 'g', 1);
defineRGBComponent$1(Color$1.prototype, 'b', 0);
defineHSVComponent$1(Color$1.prototype, 'h');
defineHSVComponent$1(Color$1.prototype, 's');
defineHSVComponent$1(Color$1.prototype, 'v');
Object.defineProperty(Color$1.prototype, 'a', {
  get: function get$$1() {
    return this.__state.a;
  },
  set: function set$$1(v) {
    this.__state.a = v;
  }
});
Object.defineProperty(Color$1.prototype, 'hex', {
  get: function get$$1() {
    if (!this.__state.space !== 'HEX') {
      this.__state.hex = ColorMath$1.rgb_to_hex(this.r, this.g, this.b);
    }
    return this.__state.hex;
  },
  set: function set$$1(v) {
    this.__state.space = 'HEX';
    this.__state.hex = v;
  }
});
var Controller$1 = function () {
  function Controller(object, property) {
    classCallCheck$2(this, Controller);
    this.initialValue = object[property];
    this.domElement = document.createElement('div');
    this.object = object;
    this.property = property;
    this.__onChange = undefined;
    this.__onFinishChange = undefined;
  }
  createClass$2(Controller, [{
    key: 'onChange',
    value: function onChange(fnc) {
      this.__onChange = fnc;
      return this;
    }
  }, {
    key: 'onFinishChange',
    value: function onFinishChange(fnc) {
      this.__onFinishChange = fnc;
      return this;
    }
  }, {
    key: 'setValue',
    value: function setValue(newValue) {
      this.object[this.property] = newValue;
      if (this.__onChange) {
        this.__onChange.call(this, newValue);
      }
      this.updateDisplay();
      return this;
    }
  }, {
    key: 'getValue',
    value: function getValue() {
      return this.object[this.property];
    }
  }, {
    key: 'updateDisplay',
    value: function updateDisplay() {
      return this;
    }
  }, {
    key: 'isModified',
    value: function isModified() {
      return this.initialValue !== this.getValue();
    }
  }]);
  return Controller;
}();
var EVENT_MAP$1 = {
  HTMLEvents: ['change'],
  MouseEvents: ['click', 'mousemove', 'mousedown', 'mouseup', 'mouseover'],
  KeyboardEvents: ['keydown']
};
var EVENT_MAP_INV$1 = {};
Common$1.each(EVENT_MAP$1, function (v, k) {
  Common$1.each(v, function (e) {
    EVENT_MAP_INV$1[e] = k;
  });
});
var CSS_VALUE_PIXELS$1 = /(\d+(\.\d+)?)px/;
function cssValueToPixels$1(val) {
  if (val === '0' || Common$1.isUndefined(val)) {
    return 0;
  }
  var match = val.match(CSS_VALUE_PIXELS$1);
  if (!Common$1.isNull(match)) {
    return parseFloat(match[1]);
  }
  return 0;
}
var dom$1$1 = {
  makeSelectable: function makeSelectable(elem, selectable) {
    if (elem === undefined || elem.style === undefined) return;
    elem.onselectstart = selectable ? function () {
      return false;
    } : function () {};
    elem.style.MozUserSelect = selectable ? 'auto' : 'none';
    elem.style.KhtmlUserSelect = selectable ? 'auto' : 'none';
    elem.unselectable = selectable ? 'on' : 'off';
  },
  makeFullscreen: function makeFullscreen(elem, hor, vert) {
    var vertical = vert;
    var horizontal = hor;
    if (Common$1.isUndefined(horizontal)) {
      horizontal = true;
    }
    if (Common$1.isUndefined(vertical)) {
      vertical = true;
    }
    elem.style.position = 'absolute';
    if (horizontal) {
      elem.style.left = 0;
      elem.style.right = 0;
    }
    if (vertical) {
      elem.style.top = 0;
      elem.style.bottom = 0;
    }
  },
  fakeEvent: function fakeEvent(elem, eventType, pars, aux) {
    var params = pars || {};
    var className = EVENT_MAP_INV$1[eventType];
    if (!className) {
      throw new Error('Event type ' + eventType + ' not supported.');
    }
    var evt = document.createEvent(className);
    switch (className) {
      case 'MouseEvents':
        {
          var clientX = params.x || params.clientX || 0;
          var clientY = params.y || params.clientY || 0;
          evt.initMouseEvent(eventType, params.bubbles || false, params.cancelable || true, window, params.clickCount || 1, 0, 0, clientX, clientY, false, false, false, false, 0, null);
          break;
        }
      case 'KeyboardEvents':
        {
          var init = evt.initKeyboardEvent || evt.initKeyEvent;
          Common$1.defaults(params, {
            cancelable: true,
            ctrlKey: false,
            altKey: false,
            shiftKey: false,
            metaKey: false,
            keyCode: undefined,
            charCode: undefined
          });
          init(eventType, params.bubbles || false, params.cancelable, window, params.ctrlKey, params.altKey, params.shiftKey, params.metaKey, params.keyCode, params.charCode);
          break;
        }
      default:
        {
          evt.initEvent(eventType, params.bubbles || false, params.cancelable || true);
          break;
        }
    }
    Common$1.defaults(evt, aux);
    elem.dispatchEvent(evt);
  },
  bind: function bind(elem, event, func, newBool) {
    var bool = newBool || false;
    if (elem.addEventListener) {
      elem.addEventListener(event, func, bool);
    } else if (elem.attachEvent) {
      elem.attachEvent('on' + event, func);
    }
    return dom$1$1;
  },
  unbind: function unbind(elem, event, func, newBool) {
    var bool = newBool || false;
    if (elem.removeEventListener) {
      elem.removeEventListener(event, func, bool);
    } else if (elem.detachEvent) {
      elem.detachEvent('on' + event, func);
    }
    return dom$1$1;
  },
  addClass: function addClass(elem, className) {
    if (elem.className === undefined) {
      elem.className = className;
    } else if (elem.className !== className) {
      var classes = elem.className.split(/ +/);
      if (classes.indexOf(className) === -1) {
        classes.push(className);
        elem.className = classes.join(' ').replace(/^\s+/, '').replace(/\s+$/, '');
      }
    }
    return dom$1$1;
  },
  removeClass: function removeClass(elem, className) {
    if (className) {
      if (elem.className === className) {
        elem.removeAttribute('class');
      } else {
        var classes = elem.className.split(/ +/);
        var index = classes.indexOf(className);
        if (index !== -1) {
          classes.splice(index, 1);
          elem.className = classes.join(' ');
        }
      }
    } else {
      elem.className = undefined;
    }
    return dom$1$1;
  },
  hasClass: function hasClass(elem, className) {
    return new RegExp('(?:^|\\s+)' + className + '(?:\\s+|$)').test(elem.className) || false;
  },
  getWidth: function getWidth(elem) {
    var style = getComputedStyle(elem);
    return cssValueToPixels$1(style['border-left-width']) + cssValueToPixels$1(style['border-right-width']) + cssValueToPixels$1(style['padding-left']) + cssValueToPixels$1(style['padding-right']) + cssValueToPixels$1(style.width);
  },
  getHeight: function getHeight(elem) {
    var style = getComputedStyle(elem);
    return cssValueToPixels$1(style['border-top-width']) + cssValueToPixels$1(style['border-bottom-width']) + cssValueToPixels$1(style['padding-top']) + cssValueToPixels$1(style['padding-bottom']) + cssValueToPixels$1(style.height);
  },
  getOffset: function getOffset(el) {
    var elem = el;
    var offset = { left: 0, top: 0 };
    if (elem.offsetParent) {
      do {
        offset.left += elem.offsetLeft;
        offset.top += elem.offsetTop;
        elem = elem.offsetParent;
      } while (elem);
    }
    return offset;
  },
  isActive: function isActive(elem) {
    return elem === document.activeElement && (elem.type || elem.href);
  }
};
var BooleanController$1 = function (_Controller) {
  inherits$2(BooleanController, _Controller);
  function BooleanController(object, property) {
    classCallCheck$2(this, BooleanController);
    var _this2 = possibleConstructorReturn$2(this, (BooleanController.__proto__ || Object.getPrototypeOf(BooleanController)).call(this, object, property));
    var _this = _this2;
    _this2.__prev = _this2.getValue();
    _this2.__checkbox = document.createElement('input');
    _this2.__checkbox.setAttribute('type', 'checkbox');
    function onChange() {
      _this.setValue(!_this.__prev);
    }
    dom$1$1.bind(_this2.__checkbox, 'change', onChange, false);
    _this2.domElement.appendChild(_this2.__checkbox);
    _this2.updateDisplay();
    return _this2;
  }
  createClass$2(BooleanController, [{
    key: 'setValue',
    value: function setValue(v) {
      var toReturn = get$3(BooleanController.prototype.__proto__ || Object.getPrototypeOf(BooleanController.prototype), 'setValue', this).call(this, v);
      if (this.__onFinishChange) {
        this.__onFinishChange.call(this, this.getValue());
      }
      this.__prev = this.getValue();
      return toReturn;
    }
  }, {
    key: 'updateDisplay',
    value: function updateDisplay() {
      if (this.getValue() === true) {
        this.__checkbox.setAttribute('checked', 'checked');
        this.__checkbox.checked = true;
        this.__prev = true;
      } else {
        this.__checkbox.checked = false;
        this.__prev = false;
      }
      return get$3(BooleanController.prototype.__proto__ || Object.getPrototypeOf(BooleanController.prototype), 'updateDisplay', this).call(this);
    }
  }]);
  return BooleanController;
}(Controller$1);
var OptionController$1 = function (_Controller) {
  inherits$2(OptionController, _Controller);
  function OptionController(object, property, opts) {
    classCallCheck$2(this, OptionController);
    var _this2 = possibleConstructorReturn$2(this, (OptionController.__proto__ || Object.getPrototypeOf(OptionController)).call(this, object, property));
    var options = opts;
    var _this = _this2;
    _this2.__select = document.createElement('select');
    if (Common$1.isArray(options)) {
      var map = {};
      Common$1.each(options, function (element) {
        map[element] = element;
      });
      options = map;
    }
    Common$1.each(options, function (value, key) {
      var opt = document.createElement('option');
      opt.innerHTML = key;
      opt.setAttribute('value', value);
      _this.__select.appendChild(opt);
    });
    _this2.updateDisplay();
    dom$1$1.bind(_this2.__select, 'change', function () {
      var desiredValue = this.options[this.selectedIndex].value;
      _this.setValue(desiredValue);
    });
    _this2.domElement.appendChild(_this2.__select);
    return _this2;
  }
  createClass$2(OptionController, [{
    key: 'setValue',
    value: function setValue(v) {
      var toReturn = get$3(OptionController.prototype.__proto__ || Object.getPrototypeOf(OptionController.prototype), 'setValue', this).call(this, v);
      if (this.__onFinishChange) {
        this.__onFinishChange.call(this, this.getValue());
      }
      return toReturn;
    }
  }, {
    key: 'updateDisplay',
    value: function updateDisplay() {
      if (dom$1$1.isActive(this.__select)) return this;
      this.__select.value = this.getValue();
      return get$3(OptionController.prototype.__proto__ || Object.getPrototypeOf(OptionController.prototype), 'updateDisplay', this).call(this);
    }
  }]);
  return OptionController;
}(Controller$1);
var StringController$1 = function (_Controller) {
  inherits$2(StringController, _Controller);
  function StringController(object, property) {
    classCallCheck$2(this, StringController);
    var _this2 = possibleConstructorReturn$2(this, (StringController.__proto__ || Object.getPrototypeOf(StringController)).call(this, object, property));
    var _this = _this2;
    function onChange() {
      _this.setValue(_this.__input.value);
    }
    function onBlur() {
      if (_this.__onFinishChange) {
        _this.__onFinishChange.call(_this, _this.getValue());
      }
    }
    _this2.__input = document.createElement('input');
    _this2.__input.setAttribute('type', 'text');
    dom$1$1.bind(_this2.__input, 'keyup', onChange);
    dom$1$1.bind(_this2.__input, 'change', onChange);
    dom$1$1.bind(_this2.__input, 'blur', onBlur);
    dom$1$1.bind(_this2.__input, 'keydown', function (e) {
      if (e.keyCode === 13) {
        this.blur();
      }
    });
    _this2.updateDisplay();
    _this2.domElement.appendChild(_this2.__input);
    return _this2;
  }
  createClass$2(StringController, [{
    key: 'updateDisplay',
    value: function updateDisplay() {
      if (!dom$1$1.isActive(this.__input)) {
        this.__input.value = this.getValue();
      }
      return get$3(StringController.prototype.__proto__ || Object.getPrototypeOf(StringController.prototype), 'updateDisplay', this).call(this);
    }
  }]);
  return StringController;
}(Controller$1);
function numDecimals$1(x) {
  var _x = x.toString();
  if (_x.indexOf('.') > -1) {
    return _x.length - _x.indexOf('.') - 1;
  }
  return 0;
}
var NumberController$1 = function (_Controller) {
  inherits$2(NumberController, _Controller);
  function NumberController(object, property, params) {
    classCallCheck$2(this, NumberController);
    var _this = possibleConstructorReturn$2(this, (NumberController.__proto__ || Object.getPrototypeOf(NumberController)).call(this, object, property));
    var _params = params || {};
    _this.__min = _params.min;
    _this.__max = _params.max;
    _this.__step = _params.step;
    if (Common$1.isUndefined(_this.__step)) {
      if (_this.initialValue === 0) {
        _this.__impliedStep = 1;
      } else {
        _this.__impliedStep = Math.pow(10, Math.floor(Math.log(Math.abs(_this.initialValue)) / Math.LN10)) / 10;
      }
    } else {
      _this.__impliedStep = _this.__step;
    }
    _this.__precision = numDecimals$1(_this.__impliedStep);
    return _this;
  }
  createClass$2(NumberController, [{
    key: 'setValue',
    value: function setValue(v) {
      var _v = v;
      if (this.__min !== undefined && _v < this.__min) {
        _v = this.__min;
      } else if (this.__max !== undefined && _v > this.__max) {
        _v = this.__max;
      }
      if (this.__step !== undefined && _v % this.__step !== 0) {
        _v = Math.round(_v / this.__step) * this.__step;
      }
      return get$3(NumberController.prototype.__proto__ || Object.getPrototypeOf(NumberController.prototype), 'setValue', this).call(this, _v);
    }
  }, {
    key: 'min',
    value: function min(minValue) {
      this.__min = minValue;
      return this;
    }
  }, {
    key: 'max',
    value: function max(maxValue) {
      this.__max = maxValue;
      return this;
    }
  }, {
    key: 'step',
    value: function step(stepValue) {
      this.__step = stepValue;
      this.__impliedStep = stepValue;
      this.__precision = numDecimals$1(stepValue);
      return this;
    }
  }]);
  return NumberController;
}(Controller$1);
function roundToDecimal$1(value, decimals) {
  var tenTo = Math.pow(10, decimals);
  return Math.round(value * tenTo) / tenTo;
}
var NumberControllerBox$1 = function (_NumberController) {
  inherits$2(NumberControllerBox, _NumberController);
  function NumberControllerBox(object, property, params) {
    classCallCheck$2(this, NumberControllerBox);
    var _this2 = possibleConstructorReturn$2(this, (NumberControllerBox.__proto__ || Object.getPrototypeOf(NumberControllerBox)).call(this, object, property, params));
    _this2.__truncationSuspended = false;
    var _this = _this2;
    var prevY = void 0;
    function onChange() {
      var attempted = parseFloat(_this.__input.value);
      if (!Common$1.isNaN(attempted)) {
        _this.setValue(attempted);
      }
    }
    function onFinish() {
      if (_this.__onFinishChange) {
        _this.__onFinishChange.call(_this, _this.getValue());
      }
    }
    function onBlur() {
      onFinish();
    }
    function onMouseDrag(e) {
      var diff = prevY - e.clientY;
      _this.setValue(_this.getValue() + diff * _this.__impliedStep);
      prevY = e.clientY;
    }
    function onMouseUp() {
      dom$1$1.unbind(window, 'mousemove', onMouseDrag);
      dom$1$1.unbind(window, 'mouseup', onMouseUp);
      onFinish();
    }
    function onMouseDown(e) {
      dom$1$1.bind(window, 'mousemove', onMouseDrag);
      dom$1$1.bind(window, 'mouseup', onMouseUp);
      prevY = e.clientY;
    }
    _this2.__input = document.createElement('input');
    _this2.__input.setAttribute('type', 'text');
    dom$1$1.bind(_this2.__input, 'change', onChange);
    dom$1$1.bind(_this2.__input, 'blur', onBlur);
    dom$1$1.bind(_this2.__input, 'mousedown', onMouseDown);
    dom$1$1.bind(_this2.__input, 'keydown', function (e) {
      if (e.keyCode === 13) {
        _this.__truncationSuspended = true;
        this.blur();
        _this.__truncationSuspended = false;
        onFinish();
      }
    });
    _this2.updateDisplay();
    _this2.domElement.appendChild(_this2.__input);
    return _this2;
  }
  createClass$2(NumberControllerBox, [{
    key: 'updateDisplay',
    value: function updateDisplay() {
      this.__input.value = this.__truncationSuspended ? this.getValue() : roundToDecimal$1(this.getValue(), this.__precision);
      return get$3(NumberControllerBox.prototype.__proto__ || Object.getPrototypeOf(NumberControllerBox.prototype), 'updateDisplay', this).call(this);
    }
  }]);
  return NumberControllerBox;
}(NumberController$1);
function map$1(v, i1, i2, o1, o2) {
  return o1 + (o2 - o1) * ((v - i1) / (i2 - i1));
}
var NumberControllerSlider$1 = function (_NumberController) {
  inherits$2(NumberControllerSlider, _NumberController);
  function NumberControllerSlider(object, property, min, max, step) {
    classCallCheck$2(this, NumberControllerSlider);
    var _this2 = possibleConstructorReturn$2(this, (NumberControllerSlider.__proto__ || Object.getPrototypeOf(NumberControllerSlider)).call(this, object, property, { min: min, max: max, step: step }));
    var _this = _this2;
    _this2.__background = document.createElement('div');
    _this2.__foreground = document.createElement('div');
    dom$1$1.bind(_this2.__background, 'mousedown', onMouseDown);
    dom$1$1.bind(_this2.__background, 'touchstart', onTouchStart);
    dom$1$1.addClass(_this2.__background, 'slider');
    dom$1$1.addClass(_this2.__foreground, 'slider-fg');
    function onMouseDown(e) {
      document.activeElement.blur();
      dom$1$1.bind(window, 'mousemove', onMouseDrag);
      dom$1$1.bind(window, 'mouseup', onMouseUp);
      onMouseDrag(e);
    }
    function onMouseDrag(e) {
      e.preventDefault();
      var bgRect = _this.__background.getBoundingClientRect();
      _this.setValue(map$1(e.clientX, bgRect.left, bgRect.right, _this.__min, _this.__max));
      return false;
    }
    function onMouseUp() {
      dom$1$1.unbind(window, 'mousemove', onMouseDrag);
      dom$1$1.unbind(window, 'mouseup', onMouseUp);
      if (_this.__onFinishChange) {
        _this.__onFinishChange.call(_this, _this.getValue());
      }
    }
    function onTouchStart(e) {
      if (e.touches.length !== 1) {
        return;
      }
      dom$1$1.bind(window, 'touchmove', onTouchMove);
      dom$1$1.bind(window, 'touchend', onTouchEnd);
      onTouchMove(e);
    }
    function onTouchMove(e) {
      var clientX = e.touches[0].clientX;
      var bgRect = _this.__background.getBoundingClientRect();
      _this.setValue(map$1(clientX, bgRect.left, bgRect.right, _this.__min, _this.__max));
    }
    function onTouchEnd() {
      dom$1$1.unbind(window, 'touchmove', onTouchMove);
      dom$1$1.unbind(window, 'touchend', onTouchEnd);
      if (_this.__onFinishChange) {
        _this.__onFinishChange.call(_this, _this.getValue());
      }
    }
    _this2.updateDisplay();
    _this2.__background.appendChild(_this2.__foreground);
    _this2.domElement.appendChild(_this2.__background);
    return _this2;
  }
  createClass$2(NumberControllerSlider, [{
    key: 'updateDisplay',
    value: function updateDisplay() {
      var pct = (this.getValue() - this.__min) / (this.__max - this.__min);
      this.__foreground.style.width = pct * 100 + '%';
      return get$3(NumberControllerSlider.prototype.__proto__ || Object.getPrototypeOf(NumberControllerSlider.prototype), 'updateDisplay', this).call(this);
    }
  }]);
  return NumberControllerSlider;
}(NumberController$1);
var FunctionController$1 = function (_Controller) {
  inherits$2(FunctionController, _Controller);
  function FunctionController(object, property, text) {
    classCallCheck$2(this, FunctionController);
    var _this2 = possibleConstructorReturn$2(this, (FunctionController.__proto__ || Object.getPrototypeOf(FunctionController)).call(this, object, property));
    var _this = _this2;
    _this2.__button = document.createElement('div');
    _this2.__button.innerHTML = text === undefined ? 'Fire' : text;
    dom$1$1.bind(_this2.__button, 'click', function (e) {
      e.preventDefault();
      _this.fire();
      return false;
    });
    dom$1$1.addClass(_this2.__button, 'button');
    _this2.domElement.appendChild(_this2.__button);
    return _this2;
  }
  createClass$2(FunctionController, [{
    key: 'fire',
    value: function fire() {
      if (this.__onChange) {
        this.__onChange.call(this);
      }
      this.getValue().call(this.object);
      if (this.__onFinishChange) {
        this.__onFinishChange.call(this, this.getValue());
      }
    }
  }]);
  return FunctionController;
}(Controller$1);
var ColorController$1 = function (_Controller) {
  inherits$2(ColorController, _Controller);
  function ColorController(object, property) {
    classCallCheck$2(this, ColorController);
    var _this2 = possibleConstructorReturn$2(this, (ColorController.__proto__ || Object.getPrototypeOf(ColorController)).call(this, object, property));
    _this2.__color = new Color$1(_this2.getValue());
    _this2.__temp = new Color$1(0);
    var _this = _this2;
    _this2.domElement = document.createElement('div');
    dom$1$1.makeSelectable(_this2.domElement, false);
    _this2.__selector = document.createElement('div');
    _this2.__selector.className = 'selector';
    _this2.__saturation_field = document.createElement('div');
    _this2.__saturation_field.className = 'saturation-field';
    _this2.__field_knob = document.createElement('div');
    _this2.__field_knob.className = 'field-knob';
    _this2.__field_knob_border = '2px solid ';
    _this2.__hue_knob = document.createElement('div');
    _this2.__hue_knob.className = 'hue-knob';
    _this2.__hue_field = document.createElement('div');
    _this2.__hue_field.className = 'hue-field';
    _this2.__input = document.createElement('input');
    _this2.__input.type = 'text';
    _this2.__input_textShadow = '0 1px 1px ';
    dom$1$1.bind(_this2.__input, 'keydown', function (e) {
      if (e.keyCode === 13) {
        onBlur.call(this);
      }
    });
    dom$1$1.bind(_this2.__input, 'blur', onBlur);
    dom$1$1.bind(_this2.__selector, 'mousedown', function () {
      dom$1$1.addClass(this, 'drag').bind(window, 'mouseup', function () {
        dom$1$1.removeClass(_this.__selector, 'drag');
      });
    });
    dom$1$1.bind(_this2.__selector, 'touchstart', function () {
      dom$1$1.addClass(this, 'drag').bind(window, 'touchend', function () {
        dom$1$1.removeClass(_this.__selector, 'drag');
      });
    });
    var valueField = document.createElement('div');
    Common$1.extend(_this2.__selector.style, {
      width: '122px',
      height: '102px',
      padding: '3px',
      backgroundColor: '#222',
      boxShadow: '0px 1px 3px rgba(0,0,0,0.3)'
    });
    Common$1.extend(_this2.__field_knob.style, {
      position: 'absolute',
      width: '12px',
      height: '12px',
      border: _this2.__field_knob_border + (_this2.__color.v < 0.5 ? '#fff' : '#000'),
      boxShadow: '0px 1px 3px rgba(0,0,0,0.5)',
      borderRadius: '12px',
      zIndex: 1
    });
    Common$1.extend(_this2.__hue_knob.style, {
      position: 'absolute',
      width: '15px',
      height: '2px',
      borderRight: '4px solid #fff',
      zIndex: 1
    });
    Common$1.extend(_this2.__saturation_field.style, {
      width: '100px',
      height: '100px',
      border: '1px solid #555',
      marginRight: '3px',
      display: 'inline-block',
      cursor: 'pointer'
    });
    Common$1.extend(valueField.style, {
      width: '100%',
      height: '100%',
      background: 'none'
    });
    linearGradient$1(valueField, 'top', 'rgba(0,0,0,0)', '#000');
    Common$1.extend(_this2.__hue_field.style, {
      width: '15px',
      height: '100px',
      border: '1px solid #555',
      cursor: 'ns-resize',
      position: 'absolute',
      top: '3px',
      right: '3px'
    });
    hueGradient$1(_this2.__hue_field);
    Common$1.extend(_this2.__input.style, {
      outline: 'none',
      textAlign: 'center',
      color: '#fff',
      border: 0,
      fontWeight: 'bold',
      textShadow: _this2.__input_textShadow + 'rgba(0,0,0,0.7)'
    });
    dom$1$1.bind(_this2.__saturation_field, 'mousedown', fieldDown);
    dom$1$1.bind(_this2.__saturation_field, 'touchstart', fieldDown);
    dom$1$1.bind(_this2.__field_knob, 'mousedown', fieldDown);
    dom$1$1.bind(_this2.__field_knob, 'touchstart', fieldDown);
    dom$1$1.bind(_this2.__hue_field, 'mousedown', fieldDownH);
    dom$1$1.bind(_this2.__hue_field, 'touchstart', fieldDownH);
    function fieldDown(e) {
      setSV(e);
      dom$1$1.bind(window, 'mousemove', setSV);
      dom$1$1.bind(window, 'touchmove', setSV);
      dom$1$1.bind(window, 'mouseup', fieldUpSV);
      dom$1$1.bind(window, 'touchend', fieldUpSV);
    }
    function fieldDownH(e) {
      setH(e);
      dom$1$1.bind(window, 'mousemove', setH);
      dom$1$1.bind(window, 'touchmove', setH);
      dom$1$1.bind(window, 'mouseup', fieldUpH);
      dom$1$1.bind(window, 'touchend', fieldUpH);
    }
    function fieldUpSV() {
      dom$1$1.unbind(window, 'mousemove', setSV);
      dom$1$1.unbind(window, 'touchmove', setSV);
      dom$1$1.unbind(window, 'mouseup', fieldUpSV);
      dom$1$1.unbind(window, 'touchend', fieldUpSV);
      onFinish();
    }
    function fieldUpH() {
      dom$1$1.unbind(window, 'mousemove', setH);
      dom$1$1.unbind(window, 'touchmove', setH);
      dom$1$1.unbind(window, 'mouseup', fieldUpH);
      dom$1$1.unbind(window, 'touchend', fieldUpH);
      onFinish();
    }
    function onBlur() {
      var i = interpret$1(this.value);
      if (i !== false) {
        _this.__color.__state = i;
        _this.setValue(_this.__color.toOriginal());
      } else {
        this.value = _this.__color.toString();
      }
    }
    function onFinish() {
      if (_this.__onFinishChange) {
        _this.__onFinishChange.call(_this, _this.__color.toOriginal());
      }
    }
    _this2.__saturation_field.appendChild(valueField);
    _this2.__selector.appendChild(_this2.__field_knob);
    _this2.__selector.appendChild(_this2.__saturation_field);
    _this2.__selector.appendChild(_this2.__hue_field);
    _this2.__hue_field.appendChild(_this2.__hue_knob);
    _this2.domElement.appendChild(_this2.__input);
    _this2.domElement.appendChild(_this2.__selector);
    _this2.updateDisplay();
    function setSV(e) {
      if (e.type.indexOf('touch') === -1) {
        e.preventDefault();
      }
      var fieldRect = _this.__saturation_field.getBoundingClientRect();
      var _ref = e.touches && e.touches[0] || e,
          clientX = _ref.clientX,
          clientY = _ref.clientY;
      var s = (clientX - fieldRect.left) / (fieldRect.right - fieldRect.left);
      var v = 1 - (clientY - fieldRect.top) / (fieldRect.bottom - fieldRect.top);
      if (v > 1) {
        v = 1;
      } else if (v < 0) {
        v = 0;
      }
      if (s > 1) {
        s = 1;
      } else if (s < 0) {
        s = 0;
      }
      _this.__color.v = v;
      _this.__color.s = s;
      _this.setValue(_this.__color.toOriginal());
      return false;
    }
    function setH(e) {
      if (e.type.indexOf('touch') === -1) {
        e.preventDefault();
      }
      var fieldRect = _this.__hue_field.getBoundingClientRect();
      var _ref2 = e.touches && e.touches[0] || e,
          clientY = _ref2.clientY;
      var h = 1 - (clientY - fieldRect.top) / (fieldRect.bottom - fieldRect.top);
      if (h > 1) {
        h = 1;
      } else if (h < 0) {
        h = 0;
      }
      _this.__color.h = h * 360;
      _this.setValue(_this.__color.toOriginal());
      return false;
    }
    return _this2;
  }
  createClass$2(ColorController, [{
    key: 'updateDisplay',
    value: function updateDisplay() {
      var i = interpret$1(this.getValue());
      if (i !== false) {
        var mismatch = false;
        Common$1.each(Color$1.COMPONENTS, function (component) {
          if (!Common$1.isUndefined(i[component]) && !Common$1.isUndefined(this.__color.__state[component]) && i[component] !== this.__color.__state[component]) {
            mismatch = true;
            return {};
          }
        }, this);
        if (mismatch) {
          Common$1.extend(this.__color.__state, i);
        }
      }
      Common$1.extend(this.__temp.__state, this.__color.__state);
      this.__temp.a = 1;
      var flip = this.__color.v < 0.5 || this.__color.s > 0.5 ? 255 : 0;
      var _flip = 255 - flip;
      Common$1.extend(this.__field_knob.style, {
        marginLeft: 100 * this.__color.s - 7 + 'px',
        marginTop: 100 * (1 - this.__color.v) - 7 + 'px',
        backgroundColor: this.__temp.toHexString(),
        border: this.__field_knob_border + 'rgb(' + flip + ',' + flip + ',' + flip + ')'
      });
      this.__hue_knob.style.marginTop = (1 - this.__color.h / 360) * 100 + 'px';
      this.__temp.s = 1;
      this.__temp.v = 1;
      linearGradient$1(this.__saturation_field, 'left', '#fff', this.__temp.toHexString());
      this.__input.value = this.__color.toString();
      Common$1.extend(this.__input.style, {
        backgroundColor: this.__color.toHexString(),
        color: 'rgb(' + flip + ',' + flip + ',' + flip + ')',
        textShadow: this.__input_textShadow + 'rgba(' + _flip + ',' + _flip + ',' + _flip + ',.7)'
      });
    }
  }]);
  return ColorController;
}(Controller$1);
var vendors$1 = ['-moz-', '-o-', '-webkit-', '-ms-', ''];
function linearGradient$1(elem, x, a, b) {
  elem.style.background = '';
  Common$1.each(vendors$1, function (vendor) {
    elem.style.cssText += 'background: ' + vendor + 'linear-gradient(' + x + ', ' + a + ' 0%, ' + b + ' 100%); ';
  });
}
function hueGradient$1(elem) {
  elem.style.background = '';
  elem.style.cssText += 'background: -moz-linear-gradient(top,  #ff0000 0%, #ff00ff 17%, #0000ff 34%, #00ffff 50%, #00ff00 67%, #ffff00 84%, #ff0000 100%);';
  elem.style.cssText += 'background: -webkit-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);';
  elem.style.cssText += 'background: -o-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);';
  elem.style.cssText += 'background: -ms-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);';
  elem.style.cssText += 'background: linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);';
}
var ControllerFactory$1 = function ControllerFactory(object, property) {
  var initialValue = object[property];
  if (Common$1.isArray(arguments[2]) || Common$1.isObject(arguments[2])) {
    return new OptionController$1(object, property, arguments[2]);
  }
  if (Common$1.isNumber(initialValue)) {
    if (Common$1.isNumber(arguments[2]) && Common$1.isNumber(arguments[3])) {
      if (Common$1.isNumber(arguments[4])) {
        return new NumberControllerSlider$1(object, property, arguments[2], arguments[3], arguments[4]);
      }
      return new NumberControllerSlider$1(object, property, arguments[2], arguments[3]);
    }
    if (Common$1.isNumber(arguments[4])) {
      return new NumberControllerBox$1(object, property, { min: arguments[2], max: arguments[3], step: arguments[4] });
    }
    return new NumberControllerBox$1(object, property, { min: arguments[2], max: arguments[3] });
  }
  if (Common$1.isString(initialValue)) {
    return new StringController$1(object, property);
  }
  if (Common$1.isFunction(initialValue)) {
    return new FunctionController$1(object, property, '');
  }
  if (Common$1.isBoolean(initialValue)) {
    return new BooleanController$1(object, property);
  }
  return null;
};
var CustomController$1 = function (_Controller) {
  inherits$2(CustomController, _Controller);
  function CustomController(object, property) {
    classCallCheck$2(this, CustomController);
    var _this = possibleConstructorReturn$2(this, (CustomController.__proto__ || Object.getPrototypeOf(CustomController)).call(this, object, property));
    _this.arguments = {
      object: object, property: property, opts: Array.prototype.slice.call(arguments, 2)
    };
    if (object.property) _this.property = object.property(_this);
    return _this;
  }
  createClass$2(CustomController, [{
    key: 'controller',
    set: function set$$1(newController) {
      this._controller = newController;
    },
    get: function get$$1() {
      return this._controller;
    }
  }]);
  return CustomController;
}(Controller$1);
var css$1 = {
  load: function load(url, indoc) {
    var doc = indoc || document;
    var link = doc.createElement('link');
    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.href = url;
    doc.getElementsByTagName('head')[0].appendChild(link);
  },
  inject: function inject(cssContent, indoc) {
    var doc = indoc || document;
    var injected = document.createElement('style');
    injected.type = 'text/css';
    injected.innerHTML = cssContent;
    var head = doc.getElementsByTagName('head')[0];
    try {
      head.appendChild(injected);
    } catch (e) {}
  }
};
var saveDialogContents$1 = "<div id=\"dg-save\" class=\"dg dialogue\">\n\n  Here's the new load parameter for your <code>GUI</code>'s constructor:\n\n  <textarea id=\"dg-new-constructor\"></textarea>\n\n  <div id=\"dg-save-locally\">\n\n    <input id=\"dg-local-storage\" type=\"checkbox\"/> Automatically save\n    values to <code>localStorage</code> on exit.\n\n    <div id=\"dg-local-explain\">The values saved to <code>localStorage</code> will\n      override those passed to <code>dat.GUI</code>'s constructor. This makes it\n      easier to work incrementally, but <code>localStorage</code> is fragile,\n      and your friends may not see the same values you do.\n\n    </div>\n\n  </div>\n\n</div>";
function requestAnimationFrame$1$1(callback) {
  setTimeout(callback, 1000 / 60);
}
var requestAnimationFrame$1$2 = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || requestAnimationFrame$1$1;
var CenteredDiv$1 = function () {
  function CenteredDiv() {
    classCallCheck$2(this, CenteredDiv);
    this.backgroundElement = document.createElement('div');
    Common$1.extend(this.backgroundElement.style, {
      backgroundColor: 'rgba(0,0,0,0.8)',
      top: 0,
      left: 0,
      display: 'none',
      zIndex: '1000',
      opacity: 0,
      WebkitTransition: 'opacity 0.2s linear',
      transition: 'opacity 0.2s linear'
    });
    dom$1$1.makeFullscreen(this.backgroundElement);
    this.backgroundElement.style.position = 'fixed';
    this.domElement = document.createElement('div');
    Common$1.extend(this.domElement.style, {
      position: 'fixed',
      display: 'none',
      zIndex: '1001',
      opacity: 0,
      WebkitTransition: '-webkit-transform 0.2s ease-out, opacity 0.2s linear',
      transition: 'transform 0.2s ease-out, opacity 0.2s linear'
    });
    document.body.appendChild(this.backgroundElement);
    document.body.appendChild(this.domElement);
    var _this = this;
    dom$1$1.bind(this.backgroundElement, 'click', function () {
      _this.hide();
    });
  }
  createClass$2(CenteredDiv, [{
    key: 'show',
    value: function show() {
      var _this = this;
      this.backgroundElement.style.display = 'block';
      this.domElement.style.display = 'block';
      this.domElement.style.opacity = 0;
      this.domElement.style.webkitTransform = 'scale(1.1)';
      this.layout();
      Common$1.defer(function () {
        _this.backgroundElement.style.opacity = 1;
        _this.domElement.style.opacity = 1;
        _this.domElement.style.webkitTransform = 'scale(1)';
      });
    }
  }, {
    key: 'hide',
    value: function hide() {
      var _this = this;
      var hide = function hide() {
        _this.domElement.style.display = 'none';
        _this.backgroundElement.style.display = 'none';
        dom$1$1.unbind(_this.domElement, 'webkitTransitionEnd', hide);
        dom$1$1.unbind(_this.domElement, 'transitionend', hide);
        dom$1$1.unbind(_this.domElement, 'oTransitionEnd', hide);
      };
      dom$1$1.bind(this.domElement, 'webkitTransitionEnd', hide);
      dom$1$1.bind(this.domElement, 'transitionend', hide);
      dom$1$1.bind(this.domElement, 'oTransitionEnd', hide);
      this.backgroundElement.style.opacity = 0;
      this.domElement.style.opacity = 0;
      this.domElement.style.webkitTransform = 'scale(1.1)';
    }
  }, {
    key: 'layout',
    value: function layout() {
      this.domElement.style.left = window.innerWidth / 2 - dom$1$1.getWidth(this.domElement) / 2 + 'px';
      this.domElement.style.top = window.innerHeight / 2 - dom$1$1.getHeight(this.domElement) / 2 + 'px';
    }
  }]);
  return CenteredDiv;
}();
var styleSheet$1 = ___$insertStyle$1(".dg ul{list-style:none;margin:0;padding:0;width:100%;clear:both}.dg.ac{position:fixed;top:0;left:0;right:0;height:0;z-index:0}.dg:not(.ac) .main{overflow:hidden}.dg.main{-webkit-transition:opacity .1s linear;-o-transition:opacity .1s linear;-moz-transition:opacity .1s linear;transition:opacity .1s linear}.dg.main.taller-than-window{overflow-y:auto}.dg.main.taller-than-window .close-button{opacity:1;margin-top:-1px;border-top:1px solid #2c2c2c}.dg.main ul.closed .close-button{opacity:1 !important}.dg.main:hover .close-button,.dg.main .close-button.drag{opacity:1}.dg.main .close-button{-webkit-transition:opacity .1s linear;-o-transition:opacity .1s linear;-moz-transition:opacity .1s linear;transition:opacity .1s linear;border:0;line-height:19px;height:20px;cursor:pointer;text-align:center;background-color:#000}.dg.main .close-button.close-top{position:relative}.dg.main .close-button.close-bottom{position:absolute}.dg.main .close-button:hover{background-color:#111}.dg.a{float:right;margin-right:15px;overflow-y:visible}.dg.a.has-save>ul.close-top{margin-top:0}.dg.a.has-save>ul.close-bottom{margin-top:27px}.dg.a.has-save>ul.closed{margin-top:0}.dg.a .save-row{top:0;z-index:1002}.dg.a .save-row.close-top{position:relative}.dg.a .save-row.close-bottom{position:fixed}.dg li{-webkit-transition:height .1s ease-out;-o-transition:height .1s ease-out;-moz-transition:height .1s ease-out;transition:height .1s ease-out;-webkit-transition:overflow .1s linear;-o-transition:overflow .1s linear;-moz-transition:overflow .1s linear;transition:overflow .1s linear}.dg li:not(.folder){cursor:auto;height:27px;line-height:27px;padding:0 4px 0 5px}.dg li.folder{padding:0;border-left:4px solid rgba(0,0,0,0)}.dg li.title{cursor:pointer;margin-left:-4px}.dg .closed li:not(.title),.dg .closed ul li,.dg .closed ul li>*{height:0;overflow:hidden;border:0}.dg .cr{clear:both;padding-left:3px;height:27px;overflow:hidden}.dg .property-name{cursor:default;float:left;clear:left;width:40%;overflow:hidden;text-overflow:ellipsis}.dg .c{float:left;width:60%;position:relative}.dg .c input[type=text]{border:0;margin-top:4px;padding:3px;width:100%;float:right}.dg .has-slider input[type=text]{width:30%;margin-left:0}.dg .slider{float:left;width:66%;margin-left:-5px;margin-right:0;height:19px;margin-top:4px}.dg .slider-fg{height:100%}.dg .c input[type=checkbox]{margin-top:7px}.dg .c select{margin-top:5px}.dg .cr.function,.dg .cr.function .property-name,.dg .cr.function *,.dg .cr.boolean,.dg .cr.boolean *{cursor:pointer}.dg .cr.color{overflow:visible}.dg .selector{display:none;position:absolute;margin-left:-9px;margin-top:23px;z-index:10}.dg .c:hover .selector,.dg .selector.drag{display:block}.dg li.save-row{padding:0}.dg li.save-row .button{display:inline-block;padding:0px 6px}.dg.dialogue{background-color:#222;width:460px;padding:15px;font-size:13px;line-height:15px}#dg-new-constructor{padding:10px;color:#222;font-family:Monaco, monospace;font-size:10px;border:0;resize:none;box-shadow:inset 1px 1px 1px #888;word-wrap:break-word;margin:12px 0;display:block;width:440px;overflow-y:scroll;height:100px;position:relative}#dg-local-explain{display:none;font-size:11px;line-height:17px;border-radius:3px;background-color:#333;padding:8px;margin-top:10px}#dg-local-explain code{font-size:10px}#dat-gui-save-locally{display:none}.dg{color:#eee;font:11px 'Lucida Grande', sans-serif;text-shadow:0 -1px 0 #111}.dg.main::-webkit-scrollbar{width:5px;background:#1a1a1a}.dg.main::-webkit-scrollbar-corner{height:0;display:none}.dg.main::-webkit-scrollbar-thumb{border-radius:5px;background:#676767}.dg li:not(.folder){background:#1a1a1a;border-bottom:1px solid #2c2c2c}.dg li.save-row{line-height:25px;background:#dad5cb;border:0}.dg li.save-row select{margin-left:5px;width:108px}.dg li.save-row .button{margin-left:5px;margin-top:1px;border-radius:2px;font-size:9px;line-height:7px;padding:4px 4px 5px 4px;background:#c5bdad;color:#fff;text-shadow:0 1px 0 #b0a58f;box-shadow:0 -1px 0 #b0a58f;cursor:pointer}.dg li.save-row .button.gears{background:#c5bdad url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAANCAYAAAB/9ZQ7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAQJJREFUeNpiYKAU/P//PwGIC/ApCABiBSAW+I8AClAcgKxQ4T9hoMAEUrxx2QSGN6+egDX+/vWT4e7N82AMYoPAx/evwWoYoSYbACX2s7KxCxzcsezDh3evFoDEBYTEEqycggWAzA9AuUSQQgeYPa9fPv6/YWm/Acx5IPb7ty/fw+QZblw67vDs8R0YHyQhgObx+yAJkBqmG5dPPDh1aPOGR/eugW0G4vlIoTIfyFcA+QekhhHJhPdQxbiAIguMBTQZrPD7108M6roWYDFQiIAAv6Aow/1bFwXgis+f2LUAynwoIaNcz8XNx3Dl7MEJUDGQpx9gtQ8YCueB+D26OECAAQDadt7e46D42QAAAABJRU5ErkJggg==) 2px 1px no-repeat;height:7px;width:8px}.dg li.save-row .button:hover{background-color:#bab19e;box-shadow:0 -1px 0 #b0a58f}.dg li.folder{border-bottom:0}.dg li.title{padding-left:16px;background:#000 url(data:image/gif;base64,R0lGODlhBQAFAJEAAP////Pz8////////yH5BAEAAAIALAAAAAAFAAUAAAIIlI+hKgFxoCgAOw==) 6px 10px no-repeat;cursor:pointer;border-bottom:1px solid rgba(255,255,255,0.2)}.dg .closed li.title{background-image:url(data:image/gif;base64,R0lGODlhBQAFAJEAAP////Pz8////////yH5BAEAAAIALAAAAAAFAAUAAAIIlGIWqMCbWAEAOw==)}.dg .cr.boolean{border-left:3px solid #806787}.dg .cr.color{border-left:3px solid}.dg .cr.function{border-left:3px solid #e61d5f}.dg .cr.number{border-left:3px solid #2FA1D6}.dg .cr.number input[type=text]{color:#2FA1D6}.dg .cr.string{border-left:3px solid #1ed36f}.dg .cr.string input[type=text]{color:#1ed36f}.dg .cr.function:hover,.dg .cr.boolean:hover{background:#111}.dg .c input[type=text]{background:#303030;outline:none}.dg .c input[type=text]:hover{background:#3c3c3c}.dg .c input[type=text]:focus{background:#494949;color:#fff}.dg .c .slider{background:#303030;cursor:ew-resize}.dg .c .slider-fg{background:#2FA1D6;max-width:100%}.dg .c .slider:hover{background:#3c3c3c}.dg .c .slider:hover .slider-fg{background:#44abda}\n");
css$1.inject(styleSheet$1);
var CSS_NAMESPACE$1 = 'dg';
var HIDE_KEY_CODE$1 = 72;
var CLOSE_BUTTON_HEIGHT$1 = 20;
var DEFAULT_DEFAULT_PRESET_NAME$1 = 'Default';
var SUPPORTS_LOCAL_STORAGE$1 = function () {
  try {
    return !!window.localStorage;
  } catch (e) {
    return false;
  }
}();
var SAVE_DIALOGUE$1 = void 0;
var autoPlaceVirgin$1 = true;
var autoPlaceContainer$1 = void 0;
var hide$1 = false;
var hideableGuis$1 = [];
var GUI$1$1 = function GUI(pars) {
  var _this = this;
  var params = pars || {};
  this.domElement = document.createElement('div');
  this.__ul = document.createElement('ul');
  this.domElement.appendChild(this.__ul);
  dom$1$1.addClass(this.domElement, CSS_NAMESPACE$1);
  this.__folders = {};
  this.__controllers = [];
  this.__rememberedObjects = [];
  this.__rememberedObjectIndecesToControllers = [];
  this.__listening = [];
  params = Common$1.defaults(params, {
    closeOnTop: false,
    autoPlace: true,
    width: GUI.DEFAULT_WIDTH
  });
  params = Common$1.defaults(params, {
    resizable: params.autoPlace,
    hideable: params.autoPlace
  });
  if (!Common$1.isUndefined(params.load)) {
    if (params.preset) {
      params.load.preset = params.preset;
    }
  } else {
    params.load = { preset: DEFAULT_DEFAULT_PRESET_NAME$1 };
  }
  if (Common$1.isUndefined(params.parent) && params.hideable) {
    hideableGuis$1.push(this);
  }
  params.resizable = Common$1.isUndefined(params.parent) && params.resizable;
  if (params.autoPlace && Common$1.isUndefined(params.scrollable)) {
    params.scrollable = true;
  }
  var useLocalStorage = SUPPORTS_LOCAL_STORAGE$1 && localStorage.getItem(getLocalStorageHash$1(this, 'isLocal')) === 'true';
  var saveToLocalStorage = void 0;
  var titleRow = void 0;
  Object.defineProperties(this, {
    parent: {
      get: function get$$1() {
        return params.parent;
      }
    },
    scrollable: {
      get: function get$$1() {
        return params.scrollable;
      }
    },
    autoPlace: {
      get: function get$$1() {
        return params.autoPlace;
      }
    },
    closeOnTop: {
      get: function get$$1() {
        return params.closeOnTop;
      }
    },
    preset: {
      get: function get$$1() {
        if (_this.parent) {
          return _this.getRoot().preset;
        }
        return params.load.preset;
      },
      set: function set$$1(v) {
        if (_this.parent) {
          _this.getRoot().preset = v;
        } else {
          params.load.preset = v;
        }
        setPresetSelectIndex$1(this);
        _this.revert();
      }
    },
    width: {
      get: function get$$1() {
        return params.width;
      },
      set: function set$$1(v) {
        params.width = v;
        setWidth$1(_this, v);
      }
    },
    name: {
      get: function get$$1() {
        return params.name;
      },
      set: function set$$1(v) {
        params.name = v;
        if (titleRow) {
          titleRow.innerHTML = params.name;
        }
      }
    },
    closed: {
      get: function get$$1() {
        return params.closed;
      },
      set: function set$$1(v) {
        params.closed = v;
        if (params.closed) {
          dom$1$1.addClass(_this.__ul, GUI.CLASS_CLOSED);
        } else {
          dom$1$1.removeClass(_this.__ul, GUI.CLASS_CLOSED);
        }
        this.onResize();
        if (_this.__closeButton) {
          _this.__closeButton.innerHTML = v ? GUI.TEXT_OPEN : GUI.TEXT_CLOSED;
        }
      }
    },
    load: {
      get: function get$$1() {
        return params.load;
      }
    },
    useLocalStorage: {
      get: function get$$1() {
        return useLocalStorage;
      },
      set: function set$$1(bool) {
        if (SUPPORTS_LOCAL_STORAGE$1) {
          useLocalStorage = bool;
          if (bool) {
            dom$1$1.bind(window, 'unload', saveToLocalStorage);
          } else {
            dom$1$1.unbind(window, 'unload', saveToLocalStorage);
          }
          localStorage.setItem(getLocalStorageHash$1(_this, 'isLocal'), bool);
        }
      }
    }
  });
  if (Common$1.isUndefined(params.parent)) {
    this.closed = params.closed || false;
    dom$1$1.addClass(this.domElement, GUI.CLASS_MAIN);
    dom$1$1.makeSelectable(this.domElement, false);
    if (SUPPORTS_LOCAL_STORAGE$1) {
      if (useLocalStorage) {
        _this.useLocalStorage = true;
        var savedGui = localStorage.getItem(getLocalStorageHash$1(this, 'gui'));
        if (savedGui) {
          params.load = JSON.parse(savedGui);
        }
      }
    }
    this.__closeButton = document.createElement('div');
    this.__closeButton.innerHTML = GUI.TEXT_CLOSED;
    dom$1$1.addClass(this.__closeButton, GUI.CLASS_CLOSE_BUTTON);
    if (params.closeOnTop) {
      dom$1$1.addClass(this.__closeButton, GUI.CLASS_CLOSE_TOP);
      this.domElement.insertBefore(this.__closeButton, this.domElement.childNodes[0]);
    } else {
      dom$1$1.addClass(this.__closeButton, GUI.CLASS_CLOSE_BOTTOM);
      this.domElement.appendChild(this.__closeButton);
    }
    dom$1$1.bind(this.__closeButton, 'click', function () {
      _this.closed = !_this.closed;
    });
  } else {
    if (params.closed === undefined) {
      params.closed = true;
    }
    var titleRowName = document.createTextNode(params.name);
    dom$1$1.addClass(titleRowName, 'controller-name');
    titleRow = addRow$1(_this, titleRowName);
    var onClickTitle = function onClickTitle(e) {
      e.preventDefault();
      _this.closed = !_this.closed;
      return false;
    };
    dom$1$1.addClass(this.__ul, GUI.CLASS_CLOSED);
    dom$1$1.addClass(titleRow, 'title');
    dom$1$1.bind(titleRow, 'click', onClickTitle);
    if (!params.closed) {
      this.closed = false;
    }
  }
  if (params.autoPlace) {
    if (Common$1.isUndefined(params.parent)) {
      if (autoPlaceVirgin$1) {
        autoPlaceContainer$1 = document.createElement('div');
        dom$1$1.addClass(autoPlaceContainer$1, CSS_NAMESPACE$1);
        dom$1$1.addClass(autoPlaceContainer$1, GUI.CLASS_AUTO_PLACE_CONTAINER);
        document.body.appendChild(autoPlaceContainer$1);
        autoPlaceVirgin$1 = false;
      }
      autoPlaceContainer$1.appendChild(this.domElement);
      dom$1$1.addClass(this.domElement, GUI.CLASS_AUTO_PLACE);
    }
    if (!this.parent) {
      setWidth$1(_this, params.width);
    }
  }
  this.__resizeHandler = function () {
    _this.onResizeDebounced();
  };
  dom$1$1.bind(window, 'resize', this.__resizeHandler);
  dom$1$1.bind(this.__ul, 'webkitTransitionEnd', this.__resizeHandler);
  dom$1$1.bind(this.__ul, 'transitionend', this.__resizeHandler);
  dom$1$1.bind(this.__ul, 'oTransitionEnd', this.__resizeHandler);
  this.onResize();
  if (params.resizable) {
    addResizeHandle$1(this);
  }
  saveToLocalStorage = function saveToLocalStorage() {
    if (SUPPORTS_LOCAL_STORAGE$1 && localStorage.getItem(getLocalStorageHash$1(_this, 'isLocal')) === 'true') {
      localStorage.setItem(getLocalStorageHash$1(_this, 'gui'), JSON.stringify(_this.getSaveObject()));
    }
  };
  this.saveToLocalStorageIfPossible = saveToLocalStorage;
  function resetWidth() {
    var root = _this.getRoot();
    root.width += 1;
    Common$1.defer(function () {
      root.width -= 1;
    });
  }
  if (!params.parent) {
    resetWidth();
  }
};
GUI$1$1.toggleHide = function () {
  hide$1 = !hide$1;
  Common$1.each(hideableGuis$1, function (gui) {
    gui.domElement.style.display = hide$1 ? 'none' : '';
  });
};
GUI$1$1.CLASS_AUTO_PLACE = 'a';
GUI$1$1.CLASS_AUTO_PLACE_CONTAINER = 'ac';
GUI$1$1.CLASS_MAIN = 'main';
GUI$1$1.CLASS_CONTROLLER_ROW = 'cr';
GUI$1$1.CLASS_TOO_TALL = 'taller-than-window';
GUI$1$1.CLASS_CLOSED = 'closed';
GUI$1$1.CLASS_CLOSE_BUTTON = 'close-button';
GUI$1$1.CLASS_CLOSE_TOP = 'close-top';
GUI$1$1.CLASS_CLOSE_BOTTOM = 'close-bottom';
GUI$1$1.CLASS_DRAG = 'drag';
GUI$1$1.DEFAULT_WIDTH = 245;
GUI$1$1.TEXT_CLOSED = 'Close Controls';
GUI$1$1.TEXT_OPEN = 'Open Controls';
GUI$1$1._keydownHandler = function (e) {
  if (document.activeElement.type !== 'text' && (e.which === HIDE_KEY_CODE$1 || e.keyCode === HIDE_KEY_CODE$1)) {
    GUI$1$1.toggleHide();
  }
};
dom$1$1.bind(window, 'keydown', GUI$1$1._keydownHandler, false);
Common$1.extend(GUI$1$1.prototype, {
  add: function add(object, property) {
    return _add$1(this, object, property, {
      factoryArgs: Array.prototype.slice.call(arguments, 2)
    });
  },
  addColor: function addColor(object, property) {
    return _add$1(this, object, property, {
      color: true
    });
  },
  remove: function remove(controller) {
    this.__ul.removeChild(controller.__li);
    this.__controllers.splice(this.__controllers.indexOf(controller), 1);
    var _this = this;
    Common$1.defer(function () {
      _this.onResize();
    });
  },
  destroy: function destroy() {
    if (this.parent) {
      throw new Error('Only the root GUI should be removed with .destroy(). ' + 'For subfolders, use gui.removeFolder(folder) instead.');
    }
    if (this.autoPlace) {
      autoPlaceContainer$1.removeChild(this.domElement);
    }
    var _this = this;
    Common$1.each(this.__folders, function (subfolder) {
      _this.removeFolder(subfolder);
    });
    dom$1$1.unbind(window, 'keydown', GUI$1$1._keydownHandler, false);
    removeListeners$1(this);
  },
  addFolder: function addFolder(name) {
    if (this.__folders[name] !== undefined) {
      throw new Error('You already have a folder in this GUI by the' + ' name "' + name + '"');
    }
    var newGuiParams = { name: name, parent: this };
    newGuiParams.autoPlace = this.autoPlace;
    if (this.load && this.load.folders && this.load.folders[name]) {
      newGuiParams.closed = this.load.folders[name].closed;
      newGuiParams.load = this.load.folders[name];
    }
    var gui = new GUI$1$1(newGuiParams);
    this.__folders[name] = gui;
    var li = addRow$1(this, gui.domElement);
    dom$1$1.addClass(li, 'folder');
    return gui;
  },
  removeFolder: function removeFolder(folder) {
    this.__ul.removeChild(folder.domElement.parentElement);
    delete this.__folders[folder.name];
    if (this.load && this.load.folders && this.load.folders[folder.name]) {
      delete this.load.folders[folder.name];
    }
    removeListeners$1(folder);
    var _this = this;
    Common$1.each(folder.__folders, function (subfolder) {
      folder.removeFolder(subfolder);
    });
    Common$1.defer(function () {
      _this.onResize();
    });
  },
  open: function open() {
    this.closed = false;
  },
  close: function close() {
    this.closed = true;
  },
  hide: function hide() {
    this.domElement.style.display = 'none';
  },
  show: function show() {
    this.domElement.style.display = '';
  },
  onResize: function onResize() {
    var root = this.getRoot();
    if (root.scrollable) {
      var top = dom$1$1.getOffset(root.__ul).top;
      var h = 0;
      Common$1.each(root.__ul.childNodes, function (node) {
        if (!(root.autoPlace && node === root.__save_row)) {
          h += dom$1$1.getHeight(node);
        }
      });
      if (window.innerHeight - top - CLOSE_BUTTON_HEIGHT$1 < h) {
        dom$1$1.addClass(root.domElement, GUI$1$1.CLASS_TOO_TALL);
        root.__ul.style.height = window.innerHeight - top - CLOSE_BUTTON_HEIGHT$1 + 'px';
      } else {
        dom$1$1.removeClass(root.domElement, GUI$1$1.CLASS_TOO_TALL);
        root.__ul.style.height = 'auto';
      }
    }
    if (root.__resize_handle) {
      Common$1.defer(function () {
        root.__resize_handle.style.height = root.__ul.offsetHeight + 'px';
      });
    }
    if (root.__closeButton) {
      root.__closeButton.style.width = root.width + 'px';
    }
  },
  onResizeDebounced: Common$1.debounce(function () {
    this.onResize();
  }, 50),
  remember: function remember() {
    if (Common$1.isUndefined(SAVE_DIALOGUE$1)) {
      SAVE_DIALOGUE$1 = new CenteredDiv$1();
      SAVE_DIALOGUE$1.domElement.innerHTML = saveDialogContents$1;
    }
    if (this.parent) {
      throw new Error('You can only call remember on a top level GUI.');
    }
    var _this = this;
    Common$1.each(Array.prototype.slice.call(arguments), function (object) {
      if (_this.__rememberedObjects.length === 0) {
        addSaveMenu$1(_this);
      }
      if (_this.__rememberedObjects.indexOf(object) === -1) {
        _this.__rememberedObjects.push(object);
      }
    });
    if (this.autoPlace) {
      setWidth$1(this, this.width);
    }
  },
  getRoot: function getRoot() {
    var gui = this;
    while (gui.parent) {
      gui = gui.parent;
    }
    return gui;
  },
  getSaveObject: function getSaveObject() {
    var toReturn = this.load;
    toReturn.closed = this.closed;
    if (this.__rememberedObjects.length > 0) {
      toReturn.preset = this.preset;
      if (!toReturn.remembered) {
        toReturn.remembered = {};
      }
      toReturn.remembered[this.preset] = getCurrentPreset$1(this);
    }
    toReturn.folders = {};
    Common$1.each(this.__folders, function (element, key) {
      toReturn.folders[key] = element.getSaveObject();
    });
    return toReturn;
  },
  save: function save() {
    if (!this.load.remembered) {
      this.load.remembered = {};
    }
    this.load.remembered[this.preset] = getCurrentPreset$1(this);
    markPresetModified$1(this, false);
    this.saveToLocalStorageIfPossible();
  },
  saveAs: function saveAs(presetName) {
    if (!this.load.remembered) {
      this.load.remembered = {};
      this.load.remembered[DEFAULT_DEFAULT_PRESET_NAME$1] = getCurrentPreset$1(this, true);
    }
    this.load.remembered[presetName] = getCurrentPreset$1(this);
    this.preset = presetName;
    addPresetOption$1(this, presetName, true);
    this.saveToLocalStorageIfPossible();
  },
  revert: function revert(gui) {
    Common$1.each(this.__controllers, function (controller) {
      if (!this.getRoot().load.remembered) {
        controller.setValue(controller.initialValue);
      } else {
        recallSavedValue$1(gui || this.getRoot(), controller);
      }
      if (controller.__onFinishChange) {
        controller.__onFinishChange.call(controller, controller.getValue());
      }
    }, this);
    Common$1.each(this.__folders, function (folder) {
      folder.revert(folder);
    });
    if (!gui) {
      markPresetModified$1(this.getRoot(), false);
    }
  },
  listen: function listen(controller) {
    var init = this.__listening.length === 0;
    this.__listening.push(controller);
    if (init) {
      updateDisplays$1(this.__listening);
    }
  },
  updateDisplay: function updateDisplay() {
    Common$1.each(this.__controllers, function (controller) {
      controller.updateDisplay();
    });
    Common$1.each(this.__folders, function (folder) {
      folder.updateDisplay();
    });
  }
});
function addRow$1(gui, newDom, liBefore) {
  var li = document.createElement('li');
  if (newDom) {
    li.appendChild(newDom);
  }
  if (liBefore) {
    gui.__ul.insertBefore(li, liBefore);
  } else {
    gui.__ul.appendChild(li);
  }
  gui.onResize();
  return li;
}
function removeListeners$1(gui) {
  dom$1$1.unbind(window, 'resize', gui.__resizeHandler);
  if (gui.saveToLocalStorageIfPossible) {
    dom$1$1.unbind(window, 'unload', gui.saveToLocalStorageIfPossible);
  }
}
function markPresetModified$1(gui, modified) {
  var opt = gui.__preset_select[gui.__preset_select.selectedIndex];
  if (modified) {
    opt.innerHTML = opt.value + '*';
  } else {
    opt.innerHTML = opt.value;
  }
}
function augmentController$1(gui, li, controller) {
  controller.__li = li;
  controller.__gui = gui;
  Common$1.extend(controller, {
    options: function options(_options) {
      if (arguments.length > 1) {
        var nextSibling = controller.__li.nextElementSibling;
        controller.remove();
        return _add$1(gui, controller.object, controller.property, {
          before: nextSibling,
          factoryArgs: [Common$1.toArray(arguments)]
        });
      }
      if (Common$1.isArray(_options) || Common$1.isObject(_options)) {
        var _nextSibling = controller.__li.nextElementSibling;
        controller.remove();
        return _add$1(gui, controller.object, controller.property, {
          before: _nextSibling,
          factoryArgs: [_options]
        });
      }
    },
    name: function name(_name) {
      controller.__li.firstElementChild.firstElementChild.innerHTML = _name;
      return controller;
    },
    listen: function listen() {
      controller.__gui.listen(controller);
      return controller;
    },
    remove: function remove() {
      controller.__gui.remove(controller);
      return controller;
    }
  });
  if (controller instanceof NumberControllerSlider$1) {
    var box = new NumberControllerBox$1(controller.object, controller.property, { min: controller.__min, max: controller.__max, step: controller.__step });
    Common$1.each(['updateDisplay', 'onChange', 'onFinishChange', 'step', 'min', 'max'], function (method) {
      var pc = controller[method];
      var pb = box[method];
      controller[method] = box[method] = function () {
        var args = Array.prototype.slice.call(arguments);
        pb.apply(box, args);
        return pc.apply(controller, args);
      };
    });
    dom$1$1.addClass(li, 'has-slider');
    controller.domElement.insertBefore(box.domElement, controller.domElement.firstElementChild);
  } else if (controller instanceof NumberControllerBox$1) {
    var r = function r(returned) {
      if (Common$1.isNumber(controller.__min) && Common$1.isNumber(controller.__max)) {
        var oldName = controller.__li.firstElementChild.firstElementChild.innerHTML;
        var wasListening = controller.__gui.__listening.indexOf(controller) > -1;
        controller.remove();
        var newController = _add$1(gui, controller.object, controller.property, {
          before: controller.__li.nextElementSibling,
          factoryArgs: [controller.__min, controller.__max, controller.__step]
        });
        newController.name(oldName);
        if (wasListening) newController.listen();
        return newController;
      }
      return returned;
    };
    controller.min = Common$1.compose(r, controller.min);
    controller.max = Common$1.compose(r, controller.max);
  } else if (controller instanceof BooleanController$1) {
    dom$1$1.bind(li, 'click', function () {
      dom$1$1.fakeEvent(controller.__checkbox, 'click');
    });
    dom$1$1.bind(controller.__checkbox, 'click', function (e) {
      e.stopPropagation();
    });
  } else if (controller instanceof FunctionController$1) {
    dom$1$1.bind(li, 'click', function () {
      dom$1$1.fakeEvent(controller.__button, 'click');
    });
    dom$1$1.bind(li, 'mouseover', function () {
      dom$1$1.addClass(controller.__button, 'hover');
    });
    dom$1$1.bind(li, 'mouseout', function () {
      dom$1$1.removeClass(controller.__button, 'hover');
    });
  } else if (controller instanceof ColorController$1) {
    dom$1$1.addClass(li, 'color');
    controller.updateDisplay = Common$1.compose(function (val) {
      li.style.borderLeftColor = controller.__color.toString();
      return val;
    }, controller.updateDisplay);
    controller.updateDisplay();
  }
  controller.setValue = Common$1.compose(function (val) {
    if (gui.getRoot().__preset_select && controller.isModified()) {
      markPresetModified$1(gui.getRoot(), true);
    }
    return val;
  }, controller.setValue);
}
function recallSavedValue$1(gui, controller) {
  var root = gui.getRoot();
  var matchedIndex = root.__rememberedObjects.indexOf(controller.object);
  if (matchedIndex !== -1) {
    var controllerMap = root.__rememberedObjectIndecesToControllers[matchedIndex];
    if (controllerMap === undefined) {
      controllerMap = {};
      root.__rememberedObjectIndecesToControllers[matchedIndex] = controllerMap;
    }
    controllerMap[controller.property] = controller;
    if (root.load && root.load.remembered) {
      var presetMap = root.load.remembered;
      var preset = void 0;
      if (presetMap[gui.preset]) {
        preset = presetMap[gui.preset];
      } else if (presetMap[DEFAULT_DEFAULT_PRESET_NAME$1]) {
        preset = presetMap[DEFAULT_DEFAULT_PRESET_NAME$1];
      } else {
        return;
      }
      if (preset[matchedIndex] && preset[matchedIndex][controller.property] !== undefined) {
        var value = preset[matchedIndex][controller.property];
        controller.initialValue = value;
        controller.setValue(value);
      }
    }
  }
}
function _add$1(gui, object, property, params) {
  var customObject;
  if (object.arguments) {
    customObject = object;
    object = customObject.arguments.object;
    property = customObject.arguments.property;
    params = {
      factoryArgs: customObject.arguments.opts
    };
  }
  if (customObject === undefined && object[property] === undefined) {
    throw new Error('Object "' + object + '" has no property "' + property + '"');
  }
  var controller = void 0;
  if (params.color) {
    controller = new ColorController$1(object, property);
  } else if (customObject !== undefined && typeof customObject.property === "string") {
    controller = customObject;
  } else {
    var factoryArgs = [object, property].concat(params.factoryArgs);
    controller = ControllerFactory$1.apply(gui, factoryArgs);
  }
  if (controller === null) controller = customObject;else if (customObject !== undefined) customObject.controller = controller;
  if (params.before instanceof Controller$1) {
    params.before = params.before.__li;
  }
  recallSavedValue$1(gui, controller);
  dom$1$1.addClass(controller.domElement, 'c');
  var name = document.createElement('span');
  dom$1$1.addClass(name, 'property-name');
  if (customObject !== undefined && _typeof$2(customObject.property) === "object") {
    for (var propertyName in customObject.property) {
      name.appendChild(customObject.property[propertyName]);
    }
  } else name.innerHTML = controller.property;
  var container = document.createElement('div');
  container.appendChild(name);
  container.appendChild(controller.domElement);
  var li = addRow$1(gui, container, params.before);
  dom$1$1.addClass(li, GUI$1$1.CLASS_CONTROLLER_ROW);
  if (controller instanceof ColorController$1) {
    dom$1$1.addClass(li, 'color');
  } else {
    dom$1$1.addClass(li, _typeof$2(controller.getValue()));
  }
  augmentController$1(gui, li, controller);
  gui.__controllers.push(controller);
  return controller;
}
function getLocalStorageHash$1(gui, key) {
  return document.location.href + '.' + key;
}
function addPresetOption$1(gui, name, setSelected) {
  var opt = document.createElement('option');
  opt.innerHTML = name;
  opt.value = name;
  gui.__preset_select.appendChild(opt);
  if (setSelected) {
    gui.__preset_select.selectedIndex = gui.__preset_select.length - 1;
  }
}
function showHideExplain$1(gui, explain) {
  explain.style.display = gui.useLocalStorage ? 'block' : 'none';
}
function addSaveMenu$1(gui) {
  var div = gui.__save_row = document.createElement('li');
  dom$1$1.addClass(gui.domElement, 'has-save');
  gui.__ul.insertBefore(div, gui.__ul.firstChild);
  dom$1$1.addClass(div, 'save-row');
  var gears = document.createElement('span');
  gears.innerHTML = '&nbsp;';
  dom$1$1.addClass(gears, 'button gears');
  var button = document.createElement('span');
  button.innerHTML = 'Save';
  dom$1$1.addClass(button, 'button');
  dom$1$1.addClass(button, 'save');
  var button2 = document.createElement('span');
  button2.innerHTML = 'New';
  dom$1$1.addClass(button2, 'button');
  dom$1$1.addClass(button2, 'save-as');
  var button3 = document.createElement('span');
  button3.innerHTML = 'Revert';
  dom$1$1.addClass(button3, 'button');
  dom$1$1.addClass(button3, 'revert');
  var select = gui.__preset_select = document.createElement('select');
  if (gui.load && gui.load.remembered) {
    Common$1.each(gui.load.remembered, function (value, key) {
      addPresetOption$1(gui, key, key === gui.preset);
    });
  } else {
    addPresetOption$1(gui, DEFAULT_DEFAULT_PRESET_NAME$1, false);
  }
  dom$1$1.bind(select, 'change', function () {
    for (var index = 0; index < gui.__preset_select.length; index++) {
      gui.__preset_select[index].innerHTML = gui.__preset_select[index].value;
    }
    gui.preset = this.value;
  });
  div.appendChild(select);
  div.appendChild(gears);
  div.appendChild(button);
  div.appendChild(button2);
  div.appendChild(button3);
  if (SUPPORTS_LOCAL_STORAGE$1) {
    var explain = document.getElementById('dg-local-explain');
    var localStorageCheckBox = document.getElementById('dg-local-storage');
    var saveLocally = document.getElementById('dg-save-locally');
    saveLocally.style.display = 'block';
    if (localStorage.getItem(getLocalStorageHash$1(gui, 'isLocal')) === 'true') {
      localStorageCheckBox.setAttribute('checked', 'checked');
    }
    showHideExplain$1(gui, explain);
    dom$1$1.bind(localStorageCheckBox, 'change', function () {
      gui.useLocalStorage = !gui.useLocalStorage;
      showHideExplain$1(gui, explain);
    });
  }
  var newConstructorTextArea = document.getElementById('dg-new-constructor');
  dom$1$1.bind(newConstructorTextArea, 'keydown', function (e) {
    if (e.metaKey && (e.which === 67 || e.keyCode === 67)) {
      SAVE_DIALOGUE$1.hide();
    }
  });
  dom$1$1.bind(gears, 'click', function () {
    newConstructorTextArea.innerHTML = JSON.stringify(gui.getSaveObject(), undefined, 2);
    SAVE_DIALOGUE$1.show();
    newConstructorTextArea.focus();
    newConstructorTextArea.select();
  });
  dom$1$1.bind(button, 'click', function () {
    gui.save();
  });
  dom$1$1.bind(button2, 'click', function () {
    var presetName = prompt('Enter a new preset name.');
    if (presetName) {
      gui.saveAs(presetName);
    }
  });
  dom$1$1.bind(button3, 'click', function () {
    gui.revert();
  });
}
function addResizeHandle$1(gui) {
  var pmouseX = void 0;
  gui.__resize_handle = document.createElement('div');
  Common$1.extend(gui.__resize_handle.style, {
    width: '6px',
    marginLeft: '-3px',
    height: '200px',
    cursor: 'ew-resize',
    position: 'absolute'
  });
  function drag(e) {
    e.preventDefault();
    gui.width += pmouseX - e.clientX;
    gui.onResize();
    pmouseX = e.clientX;
    return false;
  }
  function dragStop() {
    dom$1$1.removeClass(gui.__closeButton, GUI$1$1.CLASS_DRAG);
    dom$1$1.unbind(window, 'mousemove', drag);
    dom$1$1.unbind(window, 'mouseup', dragStop);
  }
  function dragStart(e) {
    e.preventDefault();
    pmouseX = e.clientX;
    dom$1$1.addClass(gui.__closeButton, GUI$1$1.CLASS_DRAG);
    dom$1$1.bind(window, 'mousemove', drag);
    dom$1$1.bind(window, 'mouseup', dragStop);
    return false;
  }
  dom$1$1.bind(gui.__resize_handle, 'mousedown', dragStart);
  dom$1$1.bind(gui.__closeButton, 'mousedown', dragStart);
  gui.domElement.insertBefore(gui.__resize_handle, gui.domElement.firstElementChild);
}
function setWidth$1(gui, w) {
  gui.domElement.style.width = w + 'px';
  if (gui.__save_row && gui.autoPlace) {
    gui.__save_row.style.width = w + 'px';
  }
  if (gui.__closeButton) {
    gui.__closeButton.style.width = w + 'px';
  }
}
function getCurrentPreset$1(gui, useInitialValues) {
  var toReturn = {};
  Common$1.each(gui.__rememberedObjects, function (val, index) {
    var savedValues = {};
    var controllerMap = gui.__rememberedObjectIndecesToControllers[index];
    Common$1.each(controllerMap, function (controller, property) {
      savedValues[property] = useInitialValues ? controller.initialValue : controller.getValue();
    });
    toReturn[index] = savedValues;
  });
  return toReturn;
}
function setPresetSelectIndex$1(gui) {
  for (var index = 0; index < gui.__preset_select.length; index++) {
    if (gui.__preset_select[index].value === gui.preset) {
      gui.__preset_select.selectedIndex = index;
    }
  }
}
function updateDisplays$1(controllerArray) {
  if (controllerArray.length !== 0) {
    requestAnimationFrame$1$2.call(window, function () {
      updateDisplays$1(controllerArray);
    });
  }
  Common$1.each(controllerArray, function (c) {
    c.updateDisplay();
  });
}
var controllers$1 = {
  Controller: Controller$1,
  BooleanController: BooleanController$1,
  OptionController: OptionController$1,
  StringController: StringController$1,
  NumberController: NumberController$1,
  NumberControllerBox: NumberControllerBox$1,
  NumberControllerSlider: NumberControllerSlider$1,
  FunctionController: FunctionController$1,
  ColorController: ColorController$1,
  CustomController: CustomController$1
};

/**
 * @module Localization.
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
function getLanguageCode() {
		function _getLocale() {
				if (!navigator) {
						console.error("getLocale() failed! !navigator");
						return "";
				}
				if (navigator.languages !== undefined && typeof navigator.languages !== 'unknown'
				&& navigator.languages.length > 0) return navigator.languages[0];
				if (navigator.language) {
						return navigator.language;
				} else if (navigator.browserLanguage) {
						return navigator.browserLanguage;
				} else if (navigator.systemLanguage) {
						return navigator.systemLanguage;
				} else if (navigator.userLanguage) {
						return navigator.userLanguage;
				}
				console.error("getLocale() failed!");
				return "";
		}
		return _getLocale().toLowerCase().match(/([a-z]+)(?:-([a-z]+))?/)[1];
}

/**
 * @module PlayController
 * @description PlayController class for using in my version of dat.gui(https://github.com/anhr/dat.gui) for playing of 3D objects in my projects.
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
var lang = {
	prevSymbol: '←',
	prevSymbolTitle: 'Go to previous animation scene',
	nextSymbol: '→',
	nextSymbolTitle: 'Go to next animation scene',
	playSymbol: '►',
	playTitle: 'Play',
	pause: '❚❚',
	pauseTitle: 'Pause',
	repeat: '⥀',
	repeatOn: 'Turn repeat on',
	repeatOff: 'Turn repeat off',
	controllerTitle: 'Current time.',
	fullScreen: 'Full Screen',
	nonFullScreen: 'Non Full Screen',
	stereoEffects: 'Stereo effects',
	mono: 'Mono',
	sideBySide: 'Side by side',
	topAndBottom: 'Top and bottom'
};
switch (getLanguageCode()) {
	case 'ru':
		lang.prevSymbolTitle = 'Кадр назад';
		lang.playTitle = 'Проиграть';
		lang.nextSymbolTitle = 'Кадр вперед';
		lang.pauseTitle = 'Пауза';
		lang.repeatOn = 'Повторять проигрывание';
		lang.repeatOff = 'Остановить повтор проигрывания';
		lang.controllerTitle = 'Текущее время.';
		lang.fullScreen = 'На весь экран';
		lang.nonFullScreen = 'Восстановить размеры экрана';
		lang.stereoEffects = 'Стерео эффекты';
		lang.mono = 'Моно';
		lang.sideBySide = 'Слева направо';
		lang.topAndBottom = 'Сверху вниз';
		break;
}
function addButton(innerHTML, title, onclick) {
	var button = document.createElement('span');
	button.innerHTML = innerHTML;
	button.title = title;
	button.style.cursor = 'pointer';
	button.style.margin = '0px 2px';
	button.onclick = onclick;
	return button;
}
var PlayController = function (_controllers$CustomCo) {
	inherits(PlayController, _controllers$CustomCo);
	function PlayController(player, gui) {
		classCallCheck(this, PlayController);
		var _getGroup, _selectScene, _renamePlayButtons, _renameRepeatButtons;
		var colorOff = 'rgb(255,255,255)',
		    colorOn = 'rgb(128,128,128)';
		var _this2 = possibleConstructorReturn(this, (PlayController.__proto__ || Object.getPrototypeOf(PlayController)).call(this, {
			playRate: 1,
			property: function property(customController) {
				var buttons = {};
				function RenamePlayButtons(innerHTML, title) {
					buttons.buttonPlay.innerHTML = innerHTML;
					buttons.buttonPlay.title = title;
				}
				_renamePlayButtons = RenamePlayButtons;
				buttons.buttonPrev = addButton(lang.prevSymbol, lang.prevSymbolTitle, player.prev);
				buttons.buttonPlay = addButton(lang.playSymbol, lang.playTitle, player.play3DObject);
				if (player.getOptions().settings.max !== null) {
					var RenameRepeatButtons = function RenameRepeatButtons(isRepeat) {
						var title, color;
						if (isRepeat) {
							title = lang.repeatOff;
							color = colorOff;
						} else {
							title = lang.repeatOn;
							color = colorOn;
						}
						if (buttons.buttonRepeat.title === title) return;
						buttons.buttonRepeat.title = title;
						buttons.buttonRepeat.style.color = color;
						player.onChangeRepeat(isRepeat);
					};
					var repeat = function repeat(value) {
						RenameRepeatButtons(buttons.buttonRepeat.title === lang.repeatOn);
					};
					_renameRepeatButtons = RenameRepeatButtons;
					var title, color;
					if (player.getOptions().repeat) {
						title = lang.repeatOff;
						color = colorOff;
					} else {
						title = lang.repeatOn;
						color = colorOn;
					}
					buttons.buttonRepeat = addButton(lang.repeat, title, repeat);
					buttons.buttonRepeat.style.color = color;
				}
				buttons.buttonNext = addButton(lang.nextSymbol, lang.nextSymbolTitle, player.next);
				function getGroup() {
					return group;
				}
				_getGroup = getGroup;
				return buttons;
			}
		}, 'playRate'));
		player.PlayController = _this2;
		_this2.onRenamePlayButtons = function (playing) {
			var name, title;
			if (playing) {
				name = lang.pause;
				title = lang.pauseTitle;
			} else {
				name = lang.playSymbol;
				title = lang.playTitle;
			}
			_renamePlayButtons(name, title, true);
		};
		_this2.onChangeRepeat = function () {
			_renameRepeatButtons(player.getOptions().settings.repeat);
		};
		player.pushController(_this2);
		_this2.onChange = function (value) {
			player.setTime(value);
		};
		_this2.getGroup = function () {
			return _getGroup();
		};
		_this2.selectScene = function (index) {
			_selectScene(parseInt(index));
		};
		_this2.setValue = function (value) {
			this._controller.domElement.childNodes[0].value = value;
		};
		var controler = gui.add(_this2);
		controler.__truncationSuspended = true;
		return _this2;
	}
	createClass(PlayController, [{
		key: 'controller',
		set: function set(newController) {
			this._controller = newController;
			var _this = this;
			this._controller.onChange(function (value) {
				_this.onChange(value);
			});
			this._controller.domElement.title = lang.controllerTitle;
		},
		get: function get() {
			return this._controller;
		}
	}]);
	return PlayController;
}(controllers$1.CustomController);

/**
 * @module Player
 * @description 3D objects animation.
 * @author [Andrej Hristoliubov]{@link https://anhr.github.io/AboutMe/}
 * @copyright 2011 Data Arts Team, Google Creative Lab
 *
 * @license under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */
var settings$1;
var selectPlaySceneOptions;
function Player(THREE, group, options) {
	options = options || {};
	selectPlaySceneOptions = options.selectPlaySceneOptions;
	selectPlaySceneOptions = selectPlaySceneOptions || {};
	selectPlaySceneOptions.boPlayer = selectPlaySceneOptions.boPlayer || false;
	selectPlaySceneOptions.a = options.a || 1;
	selectPlaySceneOptions.b = options.b || 0;
	selectPlaySceneOptions.scales = selectPlaySceneOptions.scales || {};
	settings$1 = options.settings || {};
	assignSettings();
	function selectPlayScene(group, t, index, options) {
		ColorPicker.palette.setTHREE(THREE);
		options = options || {};
		group.userData.t = t;
		Player.selectMeshPlayScene(THREE, group, t, index);
		group.children.forEach(function (mesh) {
			Player.selectMeshPlayScene(THREE, mesh, t, index);
		});
	}
	function onSelectScene(index) {
		index = index || 0;
		var t = getTime();
		selectPlayScene(group, t, index, options.selectPlaySceneOptions);
		_this.setIndex(index, (settings$1.name === '' ? '' : settings$1.name + ': ') + t);
		if (options.onSelectScene) options.onSelectScene(index, t);
	}
	setTimeout(function () {
		onSelectScene();
	}, 0);
	var selectSceneIndex = 0;
	var _this = this;
	function getTime() {
		var res = settings$1.min + selectSceneIndex * settings$1.dt;
		if (isNaN(res)) console.error('Player.getTime(): res = ' + res);
		return res;
	}
	this.setTime = function (t) {
		this.selectScene(parseInt((t - settings$1.min) / settings$1.dt));
	};
	this.selectScene = function (index) {
		index = parseInt(index);
		if (settings$1.max !== null) {
			if (index >= settings$1.marks) index = 0;else if (index < 0) index = settings$1.marks - 1;
			if (selectSceneIndex > settings$1.marks) selectSceneIndex = settings$1.marks;
		}
		while (selectSceneIndex !== index) {
			if (selectSceneIndex < index) selectSceneIndex++;else selectSceneIndex--;
			onSelectScene(selectSceneIndex);
		}
	};
	this.next = function () {
		_this.selectScene(selectSceneIndex + 1);
	};
	this.prev = function () {
		_this.selectScene(selectSceneIndex - 1);
	};
	this.pushController = function (controller) {
		if (controller.object !== undefined && controller.object.playRate !== undefined) controller.object.playRate = settings$1.min;
		controllers.push(controller);
	};
	this.controllers = [];
	var playing = false,
	    time,
	    timeNext;
	var controllers = this.controllers;
	function RenamePlayButtons() {
		controllers.forEach(function (controller) {
			if (controller.onRenamePlayButtons) controller.onRenamePlayButtons(playing);
		});
	}
	function play() {
		if (selectSceneIndex === -1 || selectSceneIndex === settings$1.marks) {
			selectSceneIndex = 0;
		}
		onSelectScene(selectSceneIndex);
	}
	function pause() {
		playing = false;
		RenamePlayButtons();
		time = undefined;
	}
	function isRepeat() {
		return settings$1.repeat;
	}
	function playNext() {
		selectSceneIndex++;
		if (settings$1.max !== null && selectSceneIndex >= settings$1.marks) {
			if (isRepeat()) selectSceneIndex = 0;else {
				pause();
				return;
			}
		}
		play();
	}
	this.play3DObject = function () {
		if (playing) {
			pause();
			return;
		}
		playing = true;
		if (settings$1.max !== null && selectSceneIndex >= settings$1.marks) selectSceneIndex = -1;
		playNext();
		RenamePlayButtons();
		function step(timestamp) {
			if (playing) window.requestAnimationFrame(step);else time = undefined;
			if (time === undefined) {
				time = timestamp;
				timeNext = time + 1000 / settings$1.interval;
			}
			if (isNaN(timeNext) || timeNext === Infinity) {
				console.error('Player.animate: timeNext = ' + timeNext);
				playing = false;
			}
			if (timestamp < timeNext) return;
			while (timestamp > timeNext) {
				timeNext += 1000 / settings$1.interval;
			}playNext();
		}
		window.requestAnimationFrame(step);
	};
	this.repeat = function () {
		settings$1.repeat = !settings$1.repeat;
		this.onChangeRepeat(settings$1.repeat);
	};
	this.getOptions = function () {
		return options;
	};
	this.getSelectSceneIndex = function () {
		return selectSceneIndex;
	};
	this.onChangeRepeat = function (value) {
		settings$1.repeat = value;
		this.controllers.forEach(function (controller) {
			if (controller.onChangeRepeat) controller.onChangeRepeat();
		});
	};
	function getLang(params) {
		params = params || {};
		var lang$$1 = {
			player: 'Player',
			playerTitle: '3D objects animation.',
			min: 'Min',
			max: 'Max',
			dt: 'Step',
			marks: 'Frames',
			marksTitle: 'Player frames count',
			interval: 'Rate',
			intervalTitle: 'Rate of changing of animation scenes per second.',
			time: 'Time',
			defaultButton: 'Default',
			defaultTitle: 'Restore default player settings.'
		};
		var _languageCode = params.getLanguageCode === undefined ? 'en'
		: params.getLanguageCode();
		switch (_languageCode) {
			case 'ru':
				lang$$1.player = 'Проигрыватель';
				lang$$1.playerTitle = 'Анимация 3D объектов.';
				lang$$1.min = 'Минимум';
				lang$$1.max = 'Максимум';
				lang$$1.dt = 'Шаг';
				lang$$1.marks = 'Кадры';
				lang$$1.marksTitle = 'Количество кадров проигрывателя';
				lang$$1.interval = 'Темп', lang$$1.intervalTitle = 'Скорость смены кадров в секунду.';
				lang$$1.time = 'Время';
				lang$$1.defaultButton = 'Восстановить';
				lang$$1.defaultTitle = 'Восстановить настройки проигрывателя по умолчанию.';
				break;
			default:
				if (params.lang === undefined || params.lang._languageCode != _languageCode) break;
				Object.keys(params.lang).forEach(function (key) {
					if (_lang[key] === undefined) return;
					_lang[key] = params.lang[key];
				});
		}
		return lang$$1;
	}
	this.gui = function (folder) {
		var guiParams = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
		guiParams.getLanguageCode = guiParams.getLanguageCode || function () {
			return "en";
		};
		guiParams.cookie = guiParams.cookie || new cookie.defaultCookie();
		guiParams.cookieName = guiParams.cookieName || '';
		var cookie$$1 = guiParams.cookie,
		    cookieName = 'Player' + guiParams.cookieName;
		function setSettings() {
			setDT();
			cookie$$1.setObject(cookieName, settings$1);
			if (options.onChangeScaleT) options.onChangeScaleT(settings$1);
		}
		setMax();
		var axesDefault = JSON.parse(JSON.stringify(settings$1)),
		    lang$$1 = getLang({
			getLanguageCode: guiParams.getLanguageCode
		});
		Object.freeze(axesDefault);
		var max = settings$1.max;
		cookie$$1.getObject(cookieName, settings$1, settings$1);
		if (max === null || max === Infinity) {
			settings$1.max = max;
		}
		var fPlayer = folder.addFolder(lang$$1.player);
		dat.folderNameAndTitle(fPlayer, lang$$1.player, lang$$1.playerTitle);
		function scale() {
			var axes = settings$1,
			scaleControllers = {};
			function onclick(customController, action) {
				var zoom = customController.controller.getValue();
				axes.min = action(axes.min, zoom);
				scaleControllers.min.setValue(axes.min);
				if (axes.max) {
					axes.max = action(axes.max, zoom);
					setDT();
					scaleControllers.max.setValue(axes.max);
				}
				setSettings();
			}
			scaleControllers.folder = fPlayer.addFolder(axes.name !== '' ? axes.name : lang$$1.time);
			scaleControllers.scaleController = scaleControllers.folder.add(new ScaleController(onclick, { settings: options.settings, getLanguageCode: guiParams.getLanguageCode })).onChange(function (value) {
				axes.zoomMultiplier = value;
				setSettings();
			});
			var positionController = new PositionController(function (shift) {
				onclick(positionController, function (value, zoom) {
					value += shift;
					return value;
				});
			}, { settings: options.settings, getLanguageCode: guiParams.getLanguageCode });
			scaleControllers.positionController = scaleControllers.folder.add(positionController).onChange(function (value) {
				axes.offset = value;
				setSettings();
			});
			scaleControllers.min = dat.controllerZeroStep(scaleControllers.folder, axes, 'min', function (value) {
				setSettings();
			});
			dat.controllerNameAndTitle(scaleControllers.min, lang$$1.min);
			setMax();
			if (axes.max !== null) {
				scaleControllers.max = dat.controllerZeroStep(scaleControllers.folder, axes, 'max', function (value) {
					setSettings();
				});
				dat.controllerNameAndTitle(scaleControllers.max, lang$$1.max);
			} else {
				scaleControllers.dt = dat.controllerZeroStep(scaleControllers.folder, axes, 'dt', function (value) {
					setSettings();
				});
				dat.controllerNameAndTitle(scaleControllers.dt, lang$$1.dt);
			}
			if (axes.marks) {
				scaleControllers.marks = scaleControllers.folder.add(axes, 'marks').onChange(function (value) {
					axes.marks = parseInt(axes.marks);
					setSettings();
					var elSlider = getSliderElement();
					if (elSlider) elSlider.max = settings$1.marks - 1;
				});
				dat.controllerNameAndTitle(scaleControllers.marks, axes.marksName === undefined ? lang$$1.marks : axes.marksName, axes.marksTitle === undefined ? lang$$1.marksTitle : axes.marksTitle);
			}
			scaleControllers.interval = scaleControllers.folder.add(options.settings, 'interval', 1, 25, 1).onChange(function (value) {
				setSettings();
			});
			dat.controllerNameAndTitle(scaleControllers.interval, lang$$1.interval, lang$$1.intervalTitle);
			dat.controllerNameAndTitle(scaleControllers.folder.add({
				defaultF: function defaultF(value) {
					axes.zoomMultiplier = axesDefault.zoomMultiplier;
					scaleControllers.scaleController.setValue(axes.zoomMultiplier);
					axes.offset = axesDefault.offset;
					scaleControllers.positionController.setValue(axes.offset);
					axes.min = axesDefault.min;
					scaleControllers.min.setValue(axes.min);
					if (scaleControllers.max) {
						axes.max = axesDefault.max;
						setDT();
						scaleControllers.max.setValue(axes.max);
					}
					if (scaleControllers.dt) {
						axes.dt = axesDefault.dt;
						scaleControllers.dt.setValue(axes.dt);
					}
					if (axesDefault.marks) {
						axes.marks = axesDefault.marks;
						scaleControllers.marks.setValue(axes.marks);
					}
					axes.interval = axesDefault.interval;
					scaleControllers.interval.setValue(axes.interval);
					setSettings();
				}
			}, 'defaultF'), lang$$1.defaultButton, lang$$1.defaultTitle);
		}
		scale();
	};
	var _canvasMenu;
	this.createCanvasMenuItem = function (canvasMenu) {
		_canvasMenu = canvasMenu;
		var player = this,
		    menu = canvasMenu.menu;
		menu.push({
			name: lang.prevSymbol,
			title: lang.prevSymbolTitle,
			onclick: function onclick(event) {
				player.prev();
			}
		});
		menu.push({
			name: lang.playSymbol,
			title: lang.playTitle,
			id: "menuButtonPlay",
			onclick: function onclick(event) {
				player.play3DObject();
			}
		});
		if (settings$1.max !== null) {
			menu.push({
				name: lang.repeat,
				title: this.getOptions().repeat ? lang.repeatOff : lang.repeatOn,
				id: "menuButtonRepeat",
				onclick: function onclick(event) {
					player.repeat();
				}
			});
		}
		menu.push({
			name: lang.nextSymbol,
			title: lang.nextSymbolTitle,
			onclick: function onclick(event) {
				player.next();
			}
		});
		controllers.push({
			onRenamePlayButtons: function onRenamePlayButtons(playing) {
				var name, title;
				if (playing) {
					name = lang.pause;
					title = lang.pauseTitle;
				} else {
					name = lang.playSymbol;
					title = lang.playTitle;
				}
				var elMenuButtonPlay = canvasMenu.querySelector('#menuButtonPlay');
				elMenuButtonPlay.innerHTML = name;
				elMenuButtonPlay.title = title;
			},
			onChangeRepeat: function onChangeRepeat() {
				canvasMenu.querySelector('#menuButtonRepeat').title = settings$1.repeat ? lang.repeatOff : lang.repeatOn;
			}
		});
	};
	this.addSlider = function () {
		if (settings$1.max === null) return;
		_canvasMenu.menu.push({
			name: '<input type="range" min="0" max="' + (Player.getSettings().marks - 1) + '" value="0" class="slider" id="sliderPosition">',
			style: 'float: right;'
		});
	};
	function getSliderElement() {
		if (_canvasMenu) return _canvasMenu.querySelector('#sliderPosition');
	}
	this.addSliderEvents = function ()          {
		var elSlider = getSliderElement();
		if (elSlider) {
			elSlider.onchange = function (event) {
				_player.selectScene(parseInt(elSlider.value));
			};
			elSlider.oninput = function (event) {
				_player.selectScene(parseInt(elSlider.value));
			};
			var pointerdown;
			var _player = this;
			elSlider.addEventListener('pointerdown', function (e) {
				pointerdown = true;
			});
			elSlider.addEventListener('pointerup', function (e) {
				pointerdown = false;
			});
			elSlider.addEventListener('mousemove', function (e) {
				if (!pointerdown) return;
				_player.selectScene((settings$1.marks - 1) * e.offsetX / elSlider.clientWidth);
			});
		}
		return elSlider;
	};
	this.setIndex = function (index, title) {
		if (this.PlayController) this.PlayController.setValue(getTime());
		var elSlider = getSliderElement();
		if (elSlider) {
			elSlider.value = index;
			elSlider.title = title;
		}
	};
	this.onChangeScale = function (scale) {
		getSliderElement().max = scale.marks - 1;
		this.selectScene(0);
	};
}
Player.execFunc = function (funcs, axisName, t) {
	var a = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
	var b = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
	var func = funcs[axisName],
	    typeofFuncs = typeof func === 'undefined' ? 'undefined' : _typeof(func);
	switch (typeofFuncs) {
		case "undefined":
			return undefined;
		case "function":
			return func(t, a, b);
		case "number":
			return func;
		case "object":
			if (Array.isArray(func)) {
				var execW = function execW(i) {
					if (typeof _a[i] === "function") return _a[i](t, _a, b);
					if (_a[i] instanceof THREE.Color) return _a[i];
				};
				if (func.length === 0) {
					console.error('Player.execFunc: funcs["' + axisName + '"] array is empty');
					return;
				}
				var _a = func,
				    l = func.length - 1,
				    max = settings$1.max === null ? Infinity : settings$1.max,
				    min = settings$1.min,
				    tStep = (max - min) / l;
				var tStart = min,
				    tStop = max,
				    iStart = 0,
				    iStop = l;
				for (var i = 0; i < func.length; i++) {
					if (tStep * i + min < t) {
						iStart = i;
						iStop = i + 1;
						tStart = tStep * iStart + min;
						tStop = tStep * iStop + min;
					}
				}
				if (typeof _a[iStart] !== "number") {
					if (axisName === 'w') {
						return execW(iStart);
					}
					if (_typeof(_a[iStart]) === "object") {
						for (var i = 0; i < func.length; i++) {
							if (i === func.length - 1) return _a[i].v;
							iStart = i;iStop = i + 1;
							tStart = _a[iStart].t;tStop = _a[iStop].t;
							if (tStart <= t && tStop > t) {
								var x = (_a[iStop].v - _a[iStart].v) / (tStop - tStart),
								    y = _a[iStart].v - x * tStart;
								return x * t + y;
							}
						}
						console.error('Player.execFunc: value is not detected');
						return;
					} else {
						console.error('Player.execFunc: funcs["' + axisName + '"] array item ' + iStart + ' typeof = ' + _typeof(_a[iStart]) + ' is not number');
						return;
					}
				}
				if (iStop >= func.length) iStop = iStart;
				if (typeof _a[iStop] !== "number") {
					if (axisName === 'w') return execW(iStop);
					if (_typeof(_a[iStop]) !== "object") {
						console.error('Player.execFunc: funcs["' + axisName + '"] array item ' + iStop + ' typeof = ' + _typeof(_a[iStop]) + ' is not number');
						return;
					}
				}
				var x = (_a[iStop] - _a[iStart]) / (tStop - tStart),
				    y = _a[iStart] - x * tStart;
				if (isNaN(x) || isNaN(y)) console.error('Player.execFunc: invalid x = ' + x + ' or y = ' + y);
				return x * t + y;
			}
			if (func.func) return func.func instanceof Function ? func.func(t, a, b) : func.func;
			if (axisName !== 'w') console.error('Player.execFunc: funcs["' + axisName + '"] object is not array');
			return;
		default:
			console.error('Player.execFunc: Invalud typeof funcs["' + axisName + '"]: ' + typeofFuncs);
	}
	return;
};
function palette() {
	var paletteDefault;
	this.get = function () {
		if (selectPlaySceneOptions && selectPlaySceneOptions.palette) return selectPlaySceneOptions.palette;
		if (!paletteDefault) paletteDefault = new ColorPicker.palette();
		return paletteDefault;
	};
}
palette = new palette();
Player.selectMeshPlayScene = function (THREE, mesh, t, index, options) {
	if (t === undefined) t = Player.getSettings().min;
	index = index || 0;
	options = options || selectPlaySceneOptions;
	if (!mesh.userData.player || options && options.boPlayer && mesh.userData.boFrustumPoints) return;
	if (mesh.geometry) {
		delete mesh.geometry.boundingSphere;
		mesh.geometry.boundingSphere = null;
	}
	if (mesh.userData.player.selectPlayScene) mesh.userData.player.selectPlayScene(t);
	function setAttributes(a, b) {
		if (!mesh.geometry) return;
		var attributes = mesh.geometry.attributes,
		    arrayFuncs = mesh.userData.player.arrayFuncs;
		if (arrayFuncs === undefined) return;
		if (t === undefined) console.error('setPosition: t = ' + t);
		var min, max;
		if (options && options.scales.w !== undefined) {
			min = options.scales.w.min;max = options.scales.w.max;
		} else {
			max = value;
			min = max - 1;
		}
		for (var i = 0; i < arrayFuncs.length; i++) {
			var setPosition = function setPosition(axisName, fnName) {
				var value = Player.execFunc(funcs, axisName, t, a, b);
				if (value !== undefined) {
					attributes.position[fnName](i, value);
					needsUpdate = true;
				}
			};
			var funcs = arrayFuncs[i],
			    needsUpdate = false;
			setPosition('x', 'setX');
			setPosition('y', 'setY');
			setPosition('z', 'setZ');
			var color = void 0;
			if (typeof funcs.w === "function") {
				var value = funcs.w(t, a, b);
				attributes.position.setW(i, value);
				needsUpdate = true;
				if (mesh.userData.player.palette) color = mesh.userData.player.palette.toColor(value, min, max);else if (options.palette) color = options.palette.toColor(value, min, max);
			} else if (_typeof(funcs.w) === "object") {
				if (funcs.w instanceof THREE.Color) color = funcs.w;else if (options.palette) {
					if (_typeof(funcs.w) === 'object') {
						if (funcs.w.min) min = funcs.w.min;
						if (funcs.w.max) max = funcs.w.max;
					}
					color = options.palette.toColor(Player.execFunc(funcs, 'w', t, a, b), min, max);
				}
			} else if (typeof funcs.w === "number" && options.palette) color = options.palette.toColor(funcs.w, min, max);
			if (color) {
				if (!mesh.material instanceof THREE.ShaderMaterial && mesh.material.vertexColors !== THREE.VertexColors) console.error('Player.selectPlayScene: Please set the vertexColors parameter of the THREE.PointsMaterial of your points to THREE.VertexColors. Example: vertexColors: THREE.VertexColors');
				if (!Player.setColorAttribute(attributes, i, color) && funcs instanceof THREE.Vector4) {
					mesh.geometry.setAttribute('color', new THREE.Float32BufferAttribute(Player.getColors(THREE, arrayFuncs, {
						positions: mesh.geometry.attributes.position,
						scale: { min: min, max: max },
						palette: options.palette
					}), 3));
					if (!Player.setColorAttribute(attributes, i, color)) console.error('Player.selectPlayScene: the color attribute is not exists. Please use THREE.Vector3 instead THREE.Vector4 in the arrayFuncs or add "color" attribute');
				}
			}
			if (needsUpdate) attributes.position.needsUpdate = true;
			if (funcs.line !== undefined) funcs.line.addPoint(getObjectPosition(mesh, i), index, color);
			if (funcs.cameraTarget) {
				(function () {
					var camera = funcs.cameraTarget.camera;
					camera.userData.cameraTarget.setCameraPosition = function (target) {
						camera.position.copy(camera.userData.cameraTarget.distanceToCameraCur);
						if (camera.userData.cameraTarget.rotation) camera.position.applyAxisAngle(camera.userData.cameraTarget.rotation.axis, Player.execFunc(camera.userData.cameraTarget.rotation, 'angle', t));
						camera.position.add(target);
						camera.lookAt(target);
						if (camera.userData.cameraTarget.orbitControls) {
							camera.userData.cameraTarget.orbitControls.target.copy(target);
							if (camera.userData.cameraTarget.orbitControlsGui) camera.userData.cameraTarget.orbitControlsGui.setTarget(target);
						}
					};
					if (!camera.userData.cameraTarget.distanceToCameraCur) camera.userData.cameraTarget.distanceToCameraCur = new THREE.Vector3();
					camera.userData.cameraTarget.distanceToCameraCur.set(Player.execFunc(camera.userData.cameraTarget.distanceToCamera, 'x', t), Player.execFunc(camera.userData.cameraTarget.distanceToCamera, 'y', t), Player.execFunc(camera.userData.cameraTarget.distanceToCamera, 'z', t));
					var target = getWorldPosition(mesh, new THREE.Vector3().fromArray(mesh.geometry.attributes.position.array, i * mesh.geometry.attributes.position.itemSize));
					camera.userData.cameraTarget.target = target;
					camera.userData.cameraTarget.setCameraPosition(target);
					if (camera.userData.cameraTarget.cameraGui) camera.userData.cameraTarget.cameraGui.update();
				})();
			}
		}
	}
	setAttributes(options ? options.a : 1, options ? options.b : 0);
	var message = 'Player.selectPlayScene: invalid mesh.scale.';
	if (mesh.scale.x <= 0) console.error(message + 'x = ' + mesh.scale.x);
	if (mesh.scale.y <= 0) console.error(message + 'y = ' + mesh.scale.y);
	if (mesh.scale.z <= 0) console.error(message + 'z = ' + mesh.scale.z);
	if (!options.guiSelectPoint) return;
	options.guiSelectPoint.setMesh();
	var selectedPointIndex = options.guiSelectPoint.getSelectedPointIndex();
	if (selectedPointIndex !== -1 && options.guiSelectPoint.isSelectedMesh(mesh)) {
		options.guiSelectPoint.setPosition(getObjectPosition(mesh, selectedPointIndex), {
			object: mesh,
			index: selectedPointIndex
		});
	}
};
Player.setColorAttribute = function (attributes, i, color) {
	if (typeof color === "string") color = new THREE.Color(color);
	var colorAttribute = attributes.color || attributes.ca;
	if (colorAttribute === undefined) return false;
	colorAttribute.setX(i, color.r);
	colorAttribute.setY(i, color.g);
	colorAttribute.setZ(i, color.b);
	colorAttribute.needsUpdate = true;
	return true;
};
Player.getPoints = function (THREE, arrayFuncs, optionsPoints) {
	GuiSelectPoint.setTHREE(THREE);
	optionsPoints = optionsPoints || {};
	if (optionsPoints.t === undefined) optionsPoints.t = 0;
	var options = optionsPoints.options || {},
	    a = options.a || 1,
	    b = options.b || 0;
	for (var i = 0; i < arrayFuncs.length; i++) {
		var item = arrayFuncs[i];
		if (Array.isArray(item)) arrayFuncs[i] = new THREE.Vector4(item[0] === undefined ? 0 : item[0], item[1] === undefined ? 0 : item[1], item[2] === undefined ? 0 : item[2], item[3] === undefined ? 0 : item[3]);else if ((typeof item === 'undefined' ? 'undefined' : _typeof(item)) === "object" && item instanceof THREE.Vector2 === false && item instanceof THREE.Vector3 === false && item instanceof THREE.Vector4 === false) {
			if (item.vector === undefined) arrayFuncs[i] = new THREE.Vector4(item.x === undefined ? 0 : item.x, item.y === undefined ? 0 : item.y, item.z === undefined ? 0 : item.z, item.w === undefined ? 0 : item.w);else if (item.vector instanceof THREE.Vector2 === true || item.vector instanceof THREE.Vector3 === true || item.vector instanceof THREE.Vector4 === true) {
				if (item.vector instanceof THREE.Vector2 === true) arrayFuncs[i].vector = new THREE.Vector3(item.vector.x === undefined ? 0 : item.vector.x, item.vector.y === undefined ? 0 : item.vector.y, item.vector.z === undefined ? 0 : item.vector.z);
			} else {
				if (item.vector.length === 4) arrayFuncs[i].vector = new THREE.Vector4(item.vector[0] === undefined ? 0 : item.vector[0], item.vector[1] === undefined ? 0 : item.vector[1], item.vector[2] === undefined ? 0 : item.vector[2], item.vector[3] === undefined ? 0 : item.vector[3]);else if (item.vector.length === 3) arrayFuncs[i].vector = new THREE.Vector3(item.vector[0] === undefined ? 0 : item.vector[0], item.vector[1] === undefined ? 0 : item.vector[1], item.vector[2] === undefined ? 0 : item.vector[2]);else console.error('options.getPoints(...) falied! item.vector.length = ' + item.vector.length);
			}
		}
	}
	var points = [];
	for (var i = 0; i < arrayFuncs.length; i++) {
		var getAxis = function getAxis(axisName) {
			if (typeof funcs === "number") funcs = new THREE.Vector4(funcs, 0, 0, 0);
			if (funcs instanceof THREE.Vector2 || funcs instanceof THREE.Vector3 || funcs instanceof THREE.Vector4) {
				return Player.execFunc(funcs, axisName, optionsPoints.t, a, b);
			}
			if (funcs.vector === undefined) {
				console.error('options.getPoints: funcs.vector = ' + funcs.vector);
				return;
			}
			if (funcs.name !== undefined) funcs.vector.name = funcs.name;
			if (funcs.trace) funcs.vector.line = new Player.traceLine(THREE, optionsPoints.group, options);
			if (funcs.cameraTarget) {
				funcs.vector.cameraTarget = funcs.cameraTarget;
				var _camera = funcs.vector.cameraTarget.camera;
				_camera.userData.cameraTarget = _camera.userData.cameraTarget || {};
				_camera.userData.cameraTarget.Player = _camera.userData.cameraTarget.Player || Player;
				if (_camera.userData.cameraTarget.ready) console.warn('Player.getPoints: duplicate cameraTarget');
				_camera.userData.cameraTarget.ready = true;
				_camera.userData.cameraTarget.distanceToCamera = funcs.vector.cameraTarget.distanceToCamera || _camera.userData.cameraTarget.distanceToCamera || new THREE.Vector3().copy(_camera.position);
				_camera.userData.cameraTarget.rotation = funcs.cameraTarget.rotation || _camera.userData.cameraTarget.rotation;
				if (_camera.userData.cameraTarget.rotation) {
					if (_camera.userData.cameraTarget.rotation.angle === undefined) _camera.userData.cameraTarget.rotation.angle = new Function('t', 'return t');
					_camera.userData.cameraTarget.rotation.axis = _camera.userData.cameraTarget.rotation.axis || new THREE.Vector3(0, 1, 0);
				}
			}
			arrayFuncs[i] = funcs.vector;
			funcs = funcs.vector;
			return Player.execFunc(funcs, axisName, optionsPoints.t, a, b);
		};
		var funcs = arrayFuncs[i];
		var point = funcs.vector instanceof THREE.Vector3 === true ? new THREE.Vector3(getAxis('x'), getAxis('y'), getAxis('z')) : new THREE.Vector4(getAxis('x'), getAxis('y'), getAxis('z'), getAxis('w'));
		if (funcs.w === undefined) point.w = {};
		points.push(point);
	}
	return points;
};
Player.getColors = function (THREE, arrayFuncs, optionsColor) {
	ColorPicker.palette.setTHREE(THREE);
	optionsColor = optionsColor || {};
	optionsColor.palette = optionsColor.palette || palette.get();
	if (optionsColor.positions !== undefined && Array.isArray(arrayFuncs) && arrayFuncs.length !== optionsColor.positions.count) {
		console.error('getColors failed! arrayFuncs.length: ' + arrayFuncs.length + ' != positions.count: ' + optionsColor.positions.count);
		return optionsColor.colors;
	}
	optionsColor.colors = optionsColor.colors || [];
	var length = Array.isArray(arrayFuncs) ? arrayFuncs.length : optionsColor.positions.count;
	for (var i = 0; i < length; i++) {
		var funcs = Array.isArray(arrayFuncs) ? arrayFuncs[i] : undefined;
		var vector;
		if (funcs instanceof THREE.Vector4 ||
		optionsColor.positions && optionsColor.positions.itemSize === 4
		) {
				var min = void 0,
				    max = void 0;
				var w = funcs.w;
				if (funcs.w instanceof Object && funcs.w.func) {
					if (funcs.w.max) max = funcs.w.max;
					if (funcs.w.min) min = funcs.w.min;
					w = funcs.w.func;
				} else if (optionsColor.scale !== undefined) {
					min = optionsColor.scale.min;max = optionsColor.scale.max;
				} else {
					if (funcs instanceof THREE.Vector4) {
						if (typeof funcs.w === 'function') {
							max = 100;
							min = 0;
						} else {
							console.warn('Кажется тут ошибка. Диапазон по умолчанию должен быть от 0 до 100');
							max = funcs.w;
							min = max - 1;
						}
					} else {}
				}
				if (w instanceof Function && !settings$1) {
					console.error('Player.getColors: remove all functions from all THREE.Vector4.w items of the arrayFuncs.');
					console.error(' 	Or create Player.');
					console.error('	If you use MyPoints for create of the points, please add Player: Player into settings parameter of the MyPoints function after creating of the Player.');
					return;
				}
				var color = optionsColor.palette.toColor(funcs === undefined ? new THREE.Vector4().fromBufferAttribute(optionsColor.positions, i).w : w instanceof Function ? w(settings$1.min) : w, min, max);
				optionsColor.colors.push(color.r, color.g, color.b);
			} else if (optionsColor.colors instanceof THREE.Float32BufferAttribute) vector = new THREE.Vector3(1, 1, 1);else optionsColor.colors.push(1, 1, 1);
		if (optionsColor.opacity !== undefined) {
			var opacity = 0,
			    standardNormalDistributionZero = getStandardNormalDistribution(0);
			group.children.forEach(function (mesh) {
				if (!mesh.userData.cloud) return;
				for (var iMesh = 0; iMesh < mesh.geometry.attributes.position.count; iMesh++) {
					var position = getObjectPosition(mesh, iMesh);
					opacity += getStandardNormalDistribution(getWorldPosition(
					camera, new THREE.Vector3().fromBufferAttribute(optionsColor.positions, i)).distanceTo(position) * 5) / standardNormalDistributionZero;
				}
			});
			if (debug.opacity !== undefined) opacity = debug.opacity;
			if (optionsColor.colors instanceof THREE.Float32BufferAttribute) {
				optionsColor.colors.setXYZW(i, vector.x, vector.y, vector.z, opacity);
			} else optionsColor.colors.push(opacity);
		} else optionsColor.colors.push(1);
	}
	return optionsColor.colors;
};
Player.traceLine = function (THREE, group, options) {
	if (!group) {
		console.error('Player.traceLine: Define optionsPoints.group of the Player.getPoints first.');
		return;
	}
	if (!settings$1) {
		console.error('Player.traceLine: Remove all trace: true from arrayFunc parameter of the MyPoints or getShaderMaterialPoints method.');
		console.error('	Or call Player(...).');
		console.error('	If you use getShaderMaterialPoints or MyPoints for create of the points, please add Player: Player into settings parameter of the getShaderMaterialPoints or MyPoints method after creating of the Player.');
		return;
	}
	var line;
	var arrayLines = [];
	this.addPoint = function (point, index, color) {
		if (settings$1.max === null) {
			index = Math.abs(index);
			if (index < arrayLines.length - 1) {
				while (index < arrayLines.length - 1) {
					group.remove(arrayLines[arrayLines.length - 1]);
					arrayLines.pop();
				}
				return;
			}
			var geometry = new THREE.BufferGeometry(),
			    _MAX_POINTS = 2;
			var positions = new Float32Array(_MAX_POINTS * 3);
			geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
			var colors = new Float32Array(_MAX_POINTS * 3);
			geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
			var _line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ vertexColors: THREE.VertexColors }));
			group.add(_line);
			point = new THREE.Vector3().copy(point);
			var itemSize = _line.geometry.attributes.position.itemSize;
			point.toArray(_line.geometry.attributes.position.array, 1 * itemSize);
			var point0 = arrayLines.length === 0 ? point : new THREE.Vector3().fromArray(arrayLines[arrayLines.length - 1].geometry.attributes.position.array, 1 * itemSize);
			point0.toArray(_line.geometry.attributes.position.array, 0 * itemSize);
			_line.geometry.attributes.position.needsUpdate = true;
			if (color === undefined) color = new THREE.Color(1, 1, 1);
			Player.setColorAttribute(_line.geometry.attributes, 0, arrayLines.length === 0 ? color : new THREE.Color().fromArray(arrayLines[arrayLines.length - 1].geometry.attributes.color.array, 1 * itemSize));
			Player.setColorAttribute(_line.geometry.attributes, 1, color);
			arrayLines.push(_line);
			return;
		}
		if (line === undefined) {
			var _geometry = new THREE.BufferGeometry();
			var MAX_POINTS;
			if (settings$1.max !== null) {
				if (settings$1 && settings$1.marks) MAX_POINTS = settings$1.marks;else if (options.player && options.player.marks) MAX_POINTS = options.player.marks;else {
					console.error('Player.traceLine: MAX_POINTS = ' + MAX_POINTS + '. Create Player first or remove all trace = true from all items of the arrayFuncs');
					return;
				}
			} else MAX_POINTS = index + 1;
			var _positions = new Float32Array(MAX_POINTS * 3);
			_geometry.setAttribute('position', new THREE.BufferAttribute(_positions, 3));
			var _colors = new Float32Array(MAX_POINTS * 3);
			_geometry.setAttribute('color', new THREE.Float32BufferAttribute(_colors, 3));
			_geometry.setDrawRange(index, index);
			line = new THREE.Line(_geometry, new THREE.LineBasicMaterial({ vertexColors: THREE.VertexColors }));
			line.visible = true;
			group.add(line);
		}
		if (line.geometry) {
			delete line.geometry.boundingSphere;
			line.geometry.boundingSphere = null;
		}
		if (line.geometry) {
			delete line.geometry.boundingSphere;
			line.geometry.boundingSphere = null;
		}
		point = new THREE.Vector3().copy(point);
		point.toArray(line.geometry.attributes.position.array, index * line.geometry.attributes.position.itemSize);
		line.geometry.attributes.position.needsUpdate = true;
		if (color === undefined) color = new THREE.Color(1, 1, 1);
		Player.setColorAttribute(line.geometry.attributes, index, color);
		var start = line.geometry.drawRange.start,
		    count = index + 1 - start;
		if (start > index) {
			var stop = start + line.geometry.drawRange.count;
			start = index;
			count = stop - start;
		}
		line.geometry.setDrawRange(start, count);
	};
	this.visible = function (visible) {
		line.visible = visible;
	};
	this.isVisible = function () {
		return line.visible;
	};
	this.remove = function () {
		if (line === undefined) return;
		line.geometry.dispose();
		line.material.dispose();
		group.remove(line);
	};
};
function setDT() {
	if (settings$1.max === null) settings$1.dt = settings$1.dt || 0.1;else settings$1.dt = (settings$1.max - settings$1.min) / (settings$1.marks - 1);
}
function setMax() {
	if (settings$1.max !== null) settings$1.max = settings$1.min + settings$1.dt * (settings$1.marks - 1);
}
function assignSettings() {
	settings$1 = settings$1 || {};
	settings$1.min = settings$1.min || 0;
	if (settings$1.max === Infinity) settings$1.max = null;
	if (settings$1.max !== null) {
		if (settings$1.max === undefined) settings$1.max = 1;
		settings$1.marks = settings$1.marks || 10;
	} else settings$1.marks = null;
	setDT();
	settings$1.repeat = settings$1.repeat || false;
	settings$1.interval = settings$1.interval || 1;
	settings$1.zoomMultiplier = settings$1.zoomMultiplier || 1.1;
	settings$1.offset = settings$1.offset || 0.1;
	settings$1.name = settings$1.name || '';
}
Player.getSettings = function () {
	if (!settings$1) {
		assignSettings();
	}
	return settings$1;
};

exports['default'] = Player;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=player.js.map
