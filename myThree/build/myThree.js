/**
 * node.js version of the MyThree
 *
 * I use MyThree in my projects for displaying of my 3D objects in the canvas.
 *
 * @author Andrej Hristoliubov https://anhr.github.io/AboutMe/
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
	(factory((global.MyThree = {})));
}(this, (function (exports) { 'use strict';

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
var get$1 = function get$$1(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);
  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);
    if (parent === null) {
      return undefined;
    } else {
      return get$$1(parent, property, receiver);
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
      elem.addEventListener(event, func, {
        passive: bool
      });
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
      var toReturn = get$1(BooleanController.prototype.__proto__ || Object.getPrototypeOf(BooleanController.prototype), 'setValue', this).call(this, v);
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
      return get$1(BooleanController.prototype.__proto__ || Object.getPrototypeOf(BooleanController.prototype), 'updateDisplay', this).call(this);
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
      var toReturn = get$1(OptionController.prototype.__proto__ || Object.getPrototypeOf(OptionController.prototype), 'setValue', this).call(this, v);
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
      return get$1(OptionController.prototype.__proto__ || Object.getPrototypeOf(OptionController.prototype), 'updateDisplay', this).call(this);
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
      return get$1(StringController.prototype.__proto__ || Object.getPrototypeOf(StringController.prototype), 'updateDisplay', this).call(this);
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
      return get$1(NumberController.prototype.__proto__ || Object.getPrototypeOf(NumberController.prototype), 'setValue', this).call(this, _v);
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
      return get$1(NumberControllerBox.prototype.__proto__ || Object.getPrototypeOf(NumberControllerBox.prototype), 'updateDisplay', this).call(this);
    }
  }]);
  return NumberControllerBox;
}(NumberController);
function map(v, i1, i2, o1, o2) {
  return o1 + (o2 - o1) * ((v - i1) / (i2 - i1));
}
var NumberControllerSlider = function (_NumberController) {
  inherits$1(NumberControllerSlider, _NumberController);
  function NumberControllerSlider(object, property, min, max, step, newBool) {
    classCallCheck$1(this, NumberControllerSlider);
    var _this2 = possibleConstructorReturn$1(this, (NumberControllerSlider.__proto__ || Object.getPrototypeOf(NumberControllerSlider)).call(this, object, property, { min: min, max: max, step: step }));
    var _this = _this2;
    _this2.__background = document.createElement('div');
    _this2.__foreground = document.createElement('div');
    _this2.newBool = newBool;
    dom.bind(_this2.__background, 'mousedown', onMouseDown, newBool);
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
      if (!_this.newBool) e.preventDefault();
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
      return get$1(NumberControllerSlider.prototype.__proto__ || Object.getPrototypeOf(NumberControllerSlider.prototype), 'updateDisplay', this).call(this);
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
        return new NumberControllerSlider(object, property, arguments[2], arguments[3], arguments[4], arguments[5]);
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
function requestAnimationFrame$1(callback) {
  setTimeout(callback, 1000 / 60);
}
var requestAnimationFrame$1$1 = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || requestAnimationFrame$1;
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
    requestAnimationFrame$1$1.call(window, function () {
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
 * custom controller, allow to user to change a value step by step.
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
					button.addEventListener("wheel", onWheel, {
						passive: true
					});
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
var _THREE;
var _dat;
var _Three;
var Three = function () {
					function Three() {
										classCallCheck(this, Three);
					}
					createClass(Three, [{
										key: 'THREE',
										set: function set$$1(THREE) {
															if (_THREE) {
																				if (!Object.is(THREE, _THREE)) console.error('three: duplicate THREE. Please use one instance of the THREE library.');
																				return;
															}
															_THREE = THREE;
															_Three = this;
															var
															Float32BufferAttribute = THREE.Float32BufferAttribute,
															    Line3 = THREE.Line3,
															    Plane = THREE.Plane,
															    Triangle = THREE.Triangle,
															    Vector3 = THREE.Vector3;
															function ConvexHull() {
																				var Visible = 0;
																				var Deleted = 1;
																				var _v1 = new Vector3();
																				var _line3 = new Line3();
																				var _plane = new Plane();
																				var _closestPoint = new Vector3();
																				var _triangle = new Triangle();
																				var ConvexHull = function () {
																									function ConvexHull() {
																														classCallCheck(this, ConvexHull);
																														this.tolerance = -1;
																														this.faces = [];
																														this.newFaces = [];
																														this.assigned = new VertexList();
																														this.unassigned = new VertexList();
																														this.vertices = [];
																									}
																									createClass(ConvexHull, [{
																														key: 'setFromPoints',
																														value: function setFromPoints(points) {
																																			if (Array.isArray(points) !== true) {
																																								console.error('THREE.ConvexHull: Points parameter is not an array.');
																																			}
																																			if (points.length < 4) {
																																								console.error('THREE.ConvexHull: The algorithm needs at least four points.');
																																			}
																																			this.makeEmpty();
																																			for (var i = 0, l = points.length; i < l; i++) {
																																								this.vertices.push(new VertexNode(points[i]));
																																			}
																																			this.compute();
																																			return this;
																														}
																									}, {
																														key: 'setFromObject',
																														value: function setFromObject(object) {
																																			var points = [];
																																			object.updateMatrixWorld(true);
																																			object.traverse(function (node) {
																																								var geometry = node.geometry;
																																								if (geometry !== undefined) {
																																													if (geometry.isGeometry) {
																																																		console.error('THREE.ConvexHull no longer supports Geometry. Use THREE.BufferGeometry instead.');
																																																		return;
																																													} else if (geometry.isBufferGeometry) {
																																																		var attribute = geometry.attributes.position;
																																																		if (attribute !== undefined) {
																																																							for (var i = 0, l = attribute.count; i < l; i++) {
																																																												var point = new Vector3();
																																																												point.fromBufferAttribute(attribute, i).applyMatrix4(node.matrixWorld);
																																																												points.push(point);
																																																							}
																																																		}
																																													}
																																								}
																																			});
																																			return this.setFromPoints(points);
																														}
																									}, {
																														key: 'containsPoint',
																														value: function containsPoint(point) {
																																			var faces = this.faces;
																																			for (var i = 0, l = faces.length; i < l; i++) {
																																								var face = faces[i];
																																								if (face.distanceToPoint(point) > this.tolerance) return false;
																																			}
																																			return true;
																														}
																									}, {
																														key: 'intersectRay',
																														value: function intersectRay(ray, target) {
																																			var faces = this.faces;
																																			var tNear = -Infinity;
																																			var tFar = Infinity;
																																			for (var i = 0, l = faces.length; i < l; i++) {
																																								var face = faces[i];
																																								var vN = face.distanceToPoint(ray.origin);
																																								var vD = face.normal.dot(ray.direction);
																																								if (vN > 0 && vD >= 0) return null;
																																								var t = vD !== 0 ? -vN / vD : 0;
																																								if (t <= 0) continue;
																																								if (vD > 0) {
																																													tFar = Math.min(t, tFar);
																																								} else {
																																													tNear = Math.max(t, tNear);
																																								}
																																								if (tNear > tFar) {
																																													return null;
																																								}
																																			}
																																			if (tNear !== -Infinity) {
																																								ray.at(tNear, target);
																																			} else {
																																								ray.at(tFar, target);
																																			}
																																			return target;
																														}
																									}, {
																														key: 'intersectsRay',
																														value: function intersectsRay(ray) {
																																			return this.intersectRay(ray, _v1) !== null;
																														}
																									}, {
																														key: 'makeEmpty',
																														value: function makeEmpty() {
																																			this.faces = [];
																																			this.vertices = [];
																																			return this;
																														}
																									}, {
																														key: 'addVertexToFace',
																														value: function addVertexToFace(vertex, face) {
																																			vertex.face = face;
																																			if (face.outside === null) {
																																								this.assigned.append(vertex);
																																			} else {
																																								this.assigned.insertBefore(face.outside, vertex);
																																			}
																																			face.outside = vertex;
																																			return this;
																														}
																									}, {
																														key: 'removeVertexFromFace',
																														value: function removeVertexFromFace(vertex, face) {
																																			if (vertex === face.outside) {
																																								if (vertex.next !== null && vertex.next.face === face) {
																																													face.outside = vertex.next;
																																								} else {
																																													face.outside = null;
																																								}
																																			}
																																			this.assigned.remove(vertex);
																																			return this;
																														}
																									}, {
																														key: 'removeAllVerticesFromFace',
																														value: function removeAllVerticesFromFace(face) {
																																			if (face.outside !== null) {
																																								var start = face.outside;
																																								var end = face.outside;
																																								while (end.next !== null && end.next.face === face) {
																																													end = end.next;
																																								}
																																								this.assigned.removeSubList(start, end);
																																								start.prev = end.next = null;
																																								face.outside = null;
																																								return start;
																																			}
																														}
																									}, {
																														key: 'deleteFaceVertices',
																														value: function deleteFaceVertices(face, absorbingFace) {
																																			var faceVertices = this.removeAllVerticesFromFace(face);
																																			if (faceVertices !== undefined) {
																																								if (absorbingFace === undefined) {
																																													this.unassigned.appendChain(faceVertices);
																																								} else {
																																													var vertex = faceVertices;
																																													do {
																																																		var nextVertex = vertex.next;
																																																		var distance = absorbingFace.distanceToPoint(vertex.point);
																																																		if (distance > this.tolerance) {
																																																							this.addVertexToFace(vertex, absorbingFace);
																																																		} else {
																																																							this.unassigned.append(vertex);
																																																		}
																																																		vertex = nextVertex;
																																													} while (vertex !== null);
																																								}
																																			}
																																			return this;
																														}
																									}, {
																														key: 'resolveUnassignedPoints',
																														value: function resolveUnassignedPoints(newFaces) {
																																			if (this.unassigned.isEmpty() === false) {
																																								var vertex = this.unassigned.first();
																																								do {
																																													var nextVertex = vertex.next;
																																													var maxDistance = this.tolerance;
																																													var maxFace = null;
																																													for (var i = 0; i < newFaces.length; i++) {
																																																		var face = newFaces[i];
																																																		if (face.mark === Visible) {
																																																							var distance = face.distanceToPoint(vertex.point);
																																																							if (distance > maxDistance) {
																																																												maxDistance = distance;
																																																												maxFace = face;
																																																							}
																																																							if (maxDistance > 1000 * this.tolerance) break;
																																																		}
																																													}
																																													if (maxFace !== null) {
																																																		this.addVertexToFace(vertex, maxFace);
																																													}
																																													vertex = nextVertex;
																																								} while (vertex !== null);
																																			}
																																			return this;
																														}
																									}, {
																														key: 'computeExtremes',
																														value: function computeExtremes() {
																																			var min = new Vector3();
																																			var max = new Vector3();
																																			var minVertices = [];
																																			var maxVertices = [];
																																			for (var i = 0; i < 3; i++) {
																																								minVertices[i] = maxVertices[i] = this.vertices[0];
																																			}
																																			min.copy(this.vertices[0].point);
																																			max.copy(this.vertices[0].point);
																																			for (var _i = 0, l = this.vertices.length; _i < l; _i++) {
																																								var vertex = this.vertices[_i];
																																								var point = vertex.point;
																																								for (var j = 0; j < 3; j++) {
																																													if (point.getComponent(j) < min.getComponent(j)) {
																																																		min.setComponent(j, point.getComponent(j));
																																																		minVertices[j] = vertex;
																																													}
																																								}
																																								for (var _j = 0; _j < 3; _j++) {
																																													if (point.getComponent(_j) > max.getComponent(_j)) {
																																																		max.setComponent(_j, point.getComponent(_j));
																																																		maxVertices[_j] = vertex;
																																													}
																																								}
																																			}
																																			this.tolerance = 3 * Number.EPSILON * (Math.max(Math.abs(min.x), Math.abs(max.x)) + Math.max(Math.abs(min.y), Math.abs(max.y)) + Math.max(Math.abs(min.z), Math.abs(max.z)));
																																			return { min: minVertices, max: maxVertices };
																														}
																									}, {
																														key: 'computeInitialHull',
																														value: function computeInitialHull() {
																																			var vertices = this.vertices;
																																			var extremes = this.computeExtremes();
																																			var min = extremes.min;
																																			var max = extremes.max;
																																			var maxDistance = 0;
																																			var index = 0;
																																			for (var i = 0; i < 3; i++) {
																																								var distance = max[i].point.getComponent(i) - min[i].point.getComponent(i);
																																								if (distance > maxDistance) {
																																													maxDistance = distance;
																																													index = i;
																																								}
																																			}
																																			var v0 = min[index];
																																			var v1 = max[index];
																																			var v2 = void 0;
																																			var v3 = void 0;
																																			maxDistance = 0;
																																			_line3.set(v0.point, v1.point);
																																			for (var _i2 = 0, l = this.vertices.length; _i2 < l; _i2++) {
																																								var vertex = vertices[_i2];
																																								if (vertex !== v0 && vertex !== v1) {
																																													_line3.closestPointToPoint(vertex.point, true, _closestPoint);
																																													var _distance = _closestPoint.distanceToSquared(vertex.point);
																																													if (_distance > maxDistance) {
																																																		maxDistance = _distance;
																																																		v2 = vertex;
																																													}
																																								}
																																			}
																																			maxDistance = -1;
																																			_plane.setFromCoplanarPoints(v0.point, v1.point, v2.point);
																																			for (var _i3 = 0, _l = this.vertices.length; _i3 < _l; _i3++) {
																																								var _vertex = vertices[_i3];
																																								if (_vertex !== v0 && _vertex !== v1 && _vertex !== v2) {
																																													var _distance2 = Math.abs(_plane.distanceToPoint(_vertex.point));
																																													if (_distance2 > maxDistance) {
																																																		maxDistance = _distance2;
																																																		v3 = _vertex;
																																													}
																																								}
																																			}
																																			var faces = [];
																																			if (_plane.distanceToPoint(v3.point) < 0) {
																																								faces.push(Face.create(v0, v1, v2), Face.create(v3, v1, v0), Face.create(v3, v2, v1), Face.create(v3, v0, v2));
																																								for (var _i4 = 0; _i4 < 3; _i4++) {
																																													var j = (_i4 + 1) % 3;
																																													faces[_i4 + 1].getEdge(2).setTwin(faces[0].getEdge(j));
																																													faces[_i4 + 1].getEdge(1).setTwin(faces[j + 1].getEdge(0));
																																								}
																																			} else {
																																								faces.push(Face.create(v0, v2, v1), Face.create(v3, v0, v1), Face.create(v3, v1, v2), Face.create(v3, v2, v0));
																																								for (var _i5 = 0; _i5 < 3; _i5++) {
																																													var _j2 = (_i5 + 1) % 3;
																																													faces[_i5 + 1].getEdge(2).setTwin(faces[0].getEdge((3 - _i5) % 3));
																																													faces[_i5 + 1].getEdge(0).setTwin(faces[_j2 + 1].getEdge(1));
																																								}
																																			}
																																			for (var _i6 = 0; _i6 < 4; _i6++) {
																																								this.faces.push(faces[_i6]);
																																			}
																																			for (var _i7 = 0, _l2 = vertices.length; _i7 < _l2; _i7++) {
																																								var _vertex2 = vertices[_i7];
																																								if (_vertex2 !== v0 && _vertex2 !== v1 && _vertex2 !== v2 && _vertex2 !== v3) {
																																													maxDistance = this.tolerance;
																																													var maxFace = null;
																																													for (var _j3 = 0; _j3 < 4; _j3++) {
																																																		var _distance3 = this.faces[_j3].distanceToPoint(_vertex2.point);
																																																		if (_distance3 > maxDistance) {
																																																							maxDistance = _distance3;
																																																							maxFace = this.faces[_j3];
																																																		}
																																													}
																																													if (maxFace !== null) {
																																																		this.addVertexToFace(_vertex2, maxFace);
																																													}
																																								}
																																			}
																																			return this;
																														}
																									}, {
																														key: 'reindexFaces',
																														value: function reindexFaces() {
																																			var activeFaces = [];
																																			for (var i = 0; i < this.faces.length; i++) {
																																								var face = this.faces[i];
																																								if (face.mark === Visible) {
																																													activeFaces.push(face);
																																								}
																																			}
																																			this.faces = activeFaces;
																																			return this;
																														}
																									}, {
																														key: 'nextVertexToAdd',
																														value: function nextVertexToAdd() {
																																			if (this.assigned.isEmpty() === false) {
																																								var eyeVertex = void 0,
																																								    maxDistance = 0;
																																								var eyeFace = this.assigned.first().face;
																																								var vertex = eyeFace.outside;
																																								do {
																																													var distance = eyeFace.distanceToPoint(vertex.point);
																																													if (distance > maxDistance) {
																																																		maxDistance = distance;
																																																		eyeVertex = vertex;
																																													}
																																													vertex = vertex.next;
																																								} while (vertex !== null && vertex.face === eyeFace);
																																								return eyeVertex;
																																			}
																														}
																									}, {
																														key: 'computeHorizon',
																														value: function computeHorizon(eyePoint, crossEdge, face, horizon) {
																																			this.deleteFaceVertices(face);
																																			face.mark = Deleted;
																																			var edge = void 0;
																																			if (crossEdge === null) {
																																								edge = crossEdge = face.getEdge(0);
																																			} else {
																																								edge = crossEdge.next;
																																			}
																																			do {
																																								var twinEdge = edge.twin;
																																								var oppositeFace = twinEdge.face;
																																								if (oppositeFace.mark === Visible) {
																																													if (oppositeFace.distanceToPoint(eyePoint) > this.tolerance) {
																																																		this.computeHorizon(eyePoint, twinEdge, oppositeFace, horizon);
																																													} else {
																																																		horizon.push(edge);
																																													}
																																								}
																																								edge = edge.next;
																																			} while (edge !== crossEdge);
																																			return this;
																														}
																									}, {
																														key: 'addAdjoiningFace',
																														value: function addAdjoiningFace(eyeVertex, horizonEdge) {
																																			var face = Face.create(eyeVertex, horizonEdge.tail(), horizonEdge.head());
																																			this.faces.push(face);
																																			face.getEdge(-1).setTwin(horizonEdge.twin);
																																			return face.getEdge(0);
																														}
																									}, {
																														key: 'addNewFaces',
																														value: function addNewFaces(eyeVertex, horizon) {
																																			this.newFaces = [];
																																			var firstSideEdge = null;
																																			var previousSideEdge = null;
																																			for (var i = 0; i < horizon.length; i++) {
																																								var horizonEdge = horizon[i];
																																								var sideEdge = this.addAdjoiningFace(eyeVertex, horizonEdge);
																																								if (firstSideEdge === null) {
																																													firstSideEdge = sideEdge;
																																								} else {
																																													sideEdge.next.setTwin(previousSideEdge);
																																								}
																																								this.newFaces.push(sideEdge.face);
																																								previousSideEdge = sideEdge;
																																			}
																																			firstSideEdge.next.setTwin(previousSideEdge);
																																			return this;
																														}
																									}, {
																														key: 'addVertexToHull',
																														value: function addVertexToHull(eyeVertex) {
																																			var horizon = [];
																																			this.unassigned.clear();
																																			this.removeVertexFromFace(eyeVertex, eyeVertex.face);
																																			this.computeHorizon(eyeVertex.point, null, eyeVertex.face, horizon);
																																			this.addNewFaces(eyeVertex, horizon);
																																			this.resolveUnassignedPoints(this.newFaces);
																																			return this;
																														}
																									}, {
																														key: 'cleanup',
																														value: function cleanup() {
																																			this.assigned.clear();
																																			this.unassigned.clear();
																																			this.newFaces = [];
																																			return this;
																														}
																									}, {
																														key: 'compute',
																														value: function compute() {
																																			var vertex = void 0;
																																			this.computeInitialHull();
																																			while ((vertex = this.nextVertexToAdd()) !== undefined) {
																																								this.addVertexToHull(vertex);
																																			}
																																			this.reindexFaces();
																																			this.cleanup();
																																			return this;
																														}
																									}]);
																									return ConvexHull;
																				}();
																				this.ConvexHull = ConvexHull;
																				var Face = function () {
																									function Face() {
																														classCallCheck(this, Face);
																														this.normal = new Vector3();
																														this.midpoint = new Vector3();
																														this.area = 0;
																														this.constant = 0;
																														this.outside = null;
																														this.mark = Visible;
																														this.edge = null;
																									}
																									createClass(Face, [{
																														key: 'getEdge',
																														value: function getEdge(i) {
																																			var edge = this.edge;
																																			while (i > 0) {
																																								edge = edge.next;
																																								i--;
																																			}
																																			while (i < 0) {
																																								edge = edge.prev;
																																								i++;
																																			}
																																			return edge;
																														}
																									}, {
																														key: 'compute',
																														value: function compute() {
																																			var a = this.edge.tail();
																																			var b = this.edge.head();
																																			var c = this.edge.next.head();
																																			_triangle.set(a.point, b.point, c.point);
																																			_triangle.getNormal(this.normal);
																																			_triangle.getMidpoint(this.midpoint);
																																			this.area = _triangle.getArea();
																																			this.constant = this.normal.dot(this.midpoint);
																																			return this;
																														}
																									}, {
																														key: 'distanceToPoint',
																														value: function distanceToPoint(point) {
																																			return this.normal.dot(point) - this.constant;
																														}
																									}], [{
																														key: 'create',
																														value: function create(a, b, c) {
																																			var face = new Face();
																																			var e0 = new HalfEdge(a, face);
																																			var e1 = new HalfEdge(b, face);
																																			var e2 = new HalfEdge(c, face);
																																			e0.next = e2.prev = e1;
																																			e1.next = e0.prev = e2;
																																			e2.next = e1.prev = e0;
																																			face.edge = e0;
																																			return face.compute();
																														}
																									}]);
																									return Face;
																				}();
																				var HalfEdge = function () {
																									function HalfEdge(vertex, face) {
																														classCallCheck(this, HalfEdge);
																														this.vertex = vertex;
																														this.prev = null;
																														this.next = null;
																														this.twin = null;
																														this.face = face;
																									}
																									createClass(HalfEdge, [{
																														key: 'head',
																														value: function head() {
																																			return this.vertex;
																														}
																									}, {
																														key: 'tail',
																														value: function tail() {
																																			return this.prev ? this.prev.vertex : null;
																														}
																									}, {
																														key: 'length',
																														value: function length() {
																																			var head = this.head();
																																			var tail = this.tail();
																																			if (tail !== null) {
																																								return tail.point.distanceTo(head.point);
																																			}
																																			return -1;
																														}
																									}, {
																														key: 'lengthSquared',
																														value: function lengthSquared() {
																																			var head = this.head();
																																			var tail = this.tail();
																																			if (tail !== null) {
																																								return tail.point.distanceToSquared(head.point);
																																			}
																																			return -1;
																														}
																									}, {
																														key: 'setTwin',
																														value: function setTwin(edge) {
																																			this.twin = edge;
																																			edge.twin = this;
																																			return this;
																														}
																									}]);
																									return HalfEdge;
																				}();
																				var VertexNode = function VertexNode(point) {
																									classCallCheck(this, VertexNode);
																									this.point = point;
																									this.prev = null;
																									this.next = null;
																									this.face = null;
																				};
																				var VertexList = function () {
																									function VertexList() {
																														classCallCheck(this, VertexList);
																														this.head = null;
																														this.tail = null;
																									}
																									createClass(VertexList, [{
																														key: 'first',
																														value: function first() {
																																			return this.head;
																														}
																									}, {
																														key: 'last',
																														value: function last() {
																																			return this.tail;
																														}
																									}, {
																														key: 'clear',
																														value: function clear() {
																																			this.head = this.tail = null;
																																			return this;
																														}
																									}, {
																														key: 'insertBefore',
																														value: function insertBefore(target, vertex) {
																																			vertex.prev = target.prev;
																																			vertex.next = target;
																																			if (vertex.prev === null) {
																																								this.head = vertex;
																																			} else {
																																								vertex.prev.next = vertex;
																																			}
																																			target.prev = vertex;
																																			return this;
																														}
																									}, {
																														key: 'insertAfter',
																														value: function insertAfter(target, vertex) {
																																			vertex.prev = target;
																																			vertex.next = target.next;
																																			if (vertex.next === null) {
																																								this.tail = vertex;
																																			} else {
																																								vertex.next.prev = vertex;
																																			}
																																			target.next = vertex;
																																			return this;
																														}
																									}, {
																														key: 'append',
																														value: function append(vertex) {
																																			if (this.head === null) {
																																								this.head = vertex;
																																			} else {
																																								this.tail.next = vertex;
																																			}
																																			vertex.prev = this.tail;
																																			vertex.next = null;
																																			this.tail = vertex;
																																			return this;
																														}
																									}, {
																														key: 'appendChain',
																														value: function appendChain(vertex) {
																																			if (this.head === null) {
																																								this.head = vertex;
																																			} else {
																																								this.tail.next = vertex;
																																			}
																																			vertex.prev = this.tail;
																																			while (vertex.next !== null) {
																																								vertex = vertex.next;
																																			}
																																			this.tail = vertex;
																																			return this;
																														}
																									}, {
																														key: 'remove',
																														value: function remove(vertex) {
																																			if (vertex.prev === null) {
																																								this.head = vertex.next;
																																			} else {
																																								vertex.prev.next = vertex.next;
																																			}
																																			if (vertex.next === null) {
																																								this.tail = vertex.prev;
																																			} else {
																																								vertex.next.prev = vertex.prev;
																																			}
																																			return this;
																														}
																									}, {
																														key: 'removeSubList',
																														value: function removeSubList(a, b) {
																																			if (a.prev === null) {
																																								this.head = b.next;
																																			} else {
																																								a.prev.next = b.next;
																																			}
																																			if (b.next === null) {
																																								this.tail = a.prev;
																																			} else {
																																								b.next.prev = a.prev;
																																			}
																																			return this;
																														}
																									}, {
																														key: 'isEmpty',
																														value: function isEmpty() {
																																			return this.head === null;
																														}
																									}]);
																									return VertexList;
																				}();
															}
															this.ConvexHull = new ConvexHull().ConvexHull;
															var Vector2 = three.THREE.Vector2,
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
															var EventDispatcher = function () {
																				function EventDispatcher() {
																									classCallCheck(this, EventDispatcher);
																				}
																				createClass(EventDispatcher, [{
																									key: 'addEventListener',
																									value: function addEventListener(type, listener) {
																														if (this._listeners === undefined) this._listeners = {};
																														var listeners = this._listeners;
																														if (listeners[type] === undefined) {
																																			listeners[type] = [];
																														}
																														if (listeners[type].indexOf(listener) === -1) {
																																			listeners[type].push(listener);
																														}
																									}
																				}, {
																									key: 'hasEventListener',
																									value: function hasEventListener(type, listener) {
																														if (this._listeners === undefined) return false;
																														var listeners = this._listeners;
																														return listeners[type] !== undefined && listeners[type].indexOf(listener) !== -1;
																									}
																				}, {
																									key: 'removeEventListener',
																									value: function removeEventListener(type, listener) {
																														if (this._listeners === undefined) return;
																														var listeners = this._listeners;
																														var listenerArray = listeners[type];
																														if (listenerArray !== undefined) {
																																			var index = listenerArray.indexOf(listener);
																																			if (index !== -1) {
																																								listenerArray.splice(index, 1);
																																			}
																														}
																									}
																				}, {
																									key: 'dispatchEvent',
																									value: function dispatchEvent(event) {
																														if (this._listeners === undefined) return;
																														var listeners = this._listeners;
																														var listenerArray = listeners[event.type];
																														if (listenerArray !== undefined) {
																																			event.target = this;
																																			var array = listenerArray.slice(0);
																																			for (var i = 0, l = array.length; i < l; i++) {
																																								array[i].call(this, event);
																																			}
																																			event.target = null;
																														}
																									}
																				}]);
																				return EventDispatcher;
															}();
															var _id = 0;
															var _m1 =              new Matrix4();
															var _obj =              new Object3D();
															var _offset =              new Vector3();
															var _box =              new Box3();
															var _boxMorphTargets =              new Box3();
															var _vector =              new Vector3();
															var BufferGeometry = function (_EventDispatcher) {
																				inherits(BufferGeometry, _EventDispatcher);
																				function BufferGeometry() {
																									classCallCheck(this, BufferGeometry);
																									var _this = possibleConstructorReturn(this, (BufferGeometry.__proto__ || Object.getPrototypeOf(BufferGeometry)).call(this));
																									Object.defineProperty(_this, 'id', { value: _id++ });
																									_this.uuid = MathUtils.generateUUID();
																									_this.name = '';
																									_this.type = 'BufferGeometry';
																									_this.index = null;
																									_this.attributes = {};
																									_this.morphAttributes = {};
																									_this.morphTargetsRelative = false;
																									_this.groups = [];
																									_this.boundingBox = null;
																									_this.boundingSphere = null;
																									_this.drawRange = { start: 0, count: Infinity };
																									_this.userData = {};
																									return _this;
																				}
																				createClass(BufferGeometry, [{
																									key: 'getIndex',
																									value: function getIndex() {
																														return this.index;
																									}
																				}, {
																									key: 'setIndex',
																									value: function setIndex(index) {
																														if (Array.isArray(index)) {
																																			this.index = new (arrayMax(index) > 65535 ? Uint32BufferAttribute : Uint16BufferAttribute)(index, 1);
																														} else {
																																			this.index = index;
																														}
																														return this;
																									}
																				}, {
																									key: 'getAttribute',
																									value: function getAttribute(name) {
																														return this.attributes[name];
																									}
																				}, {
																									key: 'setAttribute',
																									value: function setAttribute(name, attribute) {
																														this.attributes[name] = attribute;
																														return this;
																									}
																				}, {
																									key: 'deleteAttribute',
																									value: function deleteAttribute(name) {
																														delete this.attributes[name];
																														return this;
																									}
																				}, {
																									key: 'hasAttribute',
																									value: function hasAttribute(name) {
																														return this.attributes[name] !== undefined;
																									}
																				}, {
																									key: 'addGroup',
																									value: function addGroup(start, count) {
																														var materialIndex = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
																														this.groups.push({
																																			start: start,
																																			count: count,
																																			materialIndex: materialIndex
																														});
																									}
																				}, {
																									key: 'clearGroups',
																									value: function clearGroups() {
																														this.groups = [];
																									}
																				}, {
																									key: 'setDrawRange',
																									value: function setDrawRange(start, count) {
																														this.drawRange.start = start;
																														this.drawRange.count = count;
																									}
																				}, {
																									key: 'applyMatrix4',
																									value: function applyMatrix4(matrix) {
																														var position = this.attributes.position;
																														if (position !== undefined) {
																																			position.applyMatrix4(matrix);
																																			position.needsUpdate = true;
																														}
																														var normal = this.attributes.normal;
																														if (normal !== undefined) {
																																			var normalMatrix = new Matrix3().getNormalMatrix(matrix);
																																			normal.applyNormalMatrix(normalMatrix);
																																			normal.needsUpdate = true;
																														}
																														var tangent = this.attributes.tangent;
																														if (tangent !== undefined) {
																																			tangent.transformDirection(matrix);
																																			tangent.needsUpdate = true;
																														}
																														if (this.boundingBox !== null) {
																																			this.computeBoundingBox();
																														}
																														if (this.boundingSphere !== null) {
																																			this.computeBoundingSphere();
																														}
																														return this;
																									}
																				}, {
																									key: 'applyQuaternion',
																									value: function applyQuaternion(q) {
																														_m1.makeRotationFromQuaternion(q);
																														this.applyMatrix4(_m1);
																														return this;
																									}
																				}, {
																									key: 'rotateX',
																									value: function rotateX(angle) {
																														_m1.makeRotationX(angle);
																														this.applyMatrix4(_m1);
																														return this;
																									}
																				}, {
																									key: 'rotateY',
																									value: function rotateY(angle) {
																														_m1.makeRotationY(angle);
																														this.applyMatrix4(_m1);
																														return this;
																									}
																				}, {
																									key: 'rotateZ',
																									value: function rotateZ(angle) {
																														_m1.makeRotationZ(angle);
																														this.applyMatrix4(_m1);
																														return this;
																									}
																				}, {
																									key: 'translate',
																									value: function translate(x, y, z) {
																														_m1.makeTranslation(x, y, z);
																														this.applyMatrix4(_m1);
																														return this;
																									}
																				}, {
																									key: 'scale',
																									value: function scale(x, y, z) {
																														_m1.makeScale(x, y, z);
																														this.applyMatrix4(_m1);
																														return this;
																									}
																				}, {
																									key: 'lookAt',
																									value: function lookAt(vector) {
																														_obj.lookAt(vector);
																														_obj.updateMatrix();
																														this.applyMatrix4(_obj.matrix);
																														return this;
																									}
																				}, {
																									key: 'center',
																									value: function center() {
																														this.computeBoundingBox();
																														this.boundingBox.getCenter(_offset).negate();
																														this.translate(_offset.x, _offset.y, _offset.z);
																														return this;
																									}
																				}, {
																									key: 'setFromPoints',
																									value: function setFromPoints(points) {
																														var position = [];
																														for (var i = 0, l = points.length; i < l; i++) {
																																			var point = points[i];
																																			position.push(point.x, point.y, point.z || 0);
																														}
																														this.setAttribute('position', new Float32BufferAttribute(position, 3));
																														return this;
																									}
																				}, {
																									key: 'computeBoundingBox',
																									value: function computeBoundingBox() {
																														if (this.boundingBox === null) {
																																			this.boundingBox = new Box3();
																														}
																														var position = this.attributes.position;
																														var morphAttributesPosition = this.morphAttributes.position;
																														if (position && position.isGLBufferAttribute) {
																																			console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".', this);
																																			this.boundingBox.set(new Vector3(-Infinity, -Infinity, -Infinity), new Vector3(+Infinity, +Infinity, +Infinity));
																																			return;
																														}
																														if (position !== undefined) {
																																			this.boundingBox.setFromBufferAttribute(position);
																																			if (morphAttributesPosition) {
																																								for (var i = 0, il = morphAttributesPosition.length; i < il; i++) {
																																													var morphAttribute = morphAttributesPosition[i];
																																													_box.setFromBufferAttribute(morphAttribute);
																																													if (this.morphTargetsRelative) {
																																																		_vector.addVectors(this.boundingBox.min, _box.min);
																																																		this.boundingBox.expandByPoint(_vector);
																																																		_vector.addVectors(this.boundingBox.max, _box.max);
																																																		this.boundingBox.expandByPoint(_vector);
																																													} else {
																																																		this.boundingBox.expandByPoint(_box.min);
																																																		this.boundingBox.expandByPoint(_box.max);
																																													}
																																								}
																																			}
																														} else {
																																			this.boundingBox.makeEmpty();
																														}
																														if (isNaN(this.boundingBox.min.x) || isNaN(this.boundingBox.min.y) || isNaN(this.boundingBox.min.z)) {
																																			console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.', this);
																														}
																									}
																				}, {
																									key: 'computeBoundingSphere',
																									value: function computeBoundingSphere() {
																														if (this.boundingSphere === null) {
																																			this.boundingSphere = new Sphere();
																														}
																														var position = this.attributes.position;
																														var morphAttributesPosition = this.morphAttributes.position;
																														if (position && position.isGLBufferAttribute) {
																																			console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".', this);
																																			this.boundingSphere.set(new Vector3(), Infinity);
																																			return;
																														}
																														if (position) {
																																			var center = this.boundingSphere.center;
																																			_box.setFromBufferAttribute(position);
																																			if (morphAttributesPosition) {
																																								for (var i = 0, il = morphAttributesPosition.length; i < il; i++) {
																																													var morphAttribute = morphAttributesPosition[i];
																																													_boxMorphTargets.setFromBufferAttribute(morphAttribute);
																																													if (this.morphTargetsRelative) {
																																																		_vector.addVectors(_box.min, _boxMorphTargets.min);
																																																		_box.expandByPoint(_vector);
																																																		_vector.addVectors(_box.max, _boxMorphTargets.max);
																																																		_box.expandByPoint(_vector);
																																													} else {
																																																		_box.expandByPoint(_boxMorphTargets.min);
																																																		_box.expandByPoint(_boxMorphTargets.max);
																																													}
																																								}
																																			}
																																			_box.getCenter(center);
																																			var maxRadiusSq = 0;
																																			for (var _i8 = 0, _il = position.count; _i8 < _il; _i8++) {
																																								_vector.fromBufferAttribute(position, _i8);
																																								maxRadiusSq = Math.max(maxRadiusSq, center.distanceToSquared(_vector));
																																			}
																																			if (morphAttributesPosition) {
																																								for (var _i9 = 0, _il2 = morphAttributesPosition.length; _i9 < _il2; _i9++) {
																																													var _morphAttribute = morphAttributesPosition[_i9];
																																													var morphTargetsRelative = this.morphTargetsRelative;
																																													for (var j = 0, jl = _morphAttribute.count; j < jl; j++) {
																																																		_vector.fromBufferAttribute(_morphAttribute, j);
																																																		if (morphTargetsRelative) {
																																																							_offset.fromBufferAttribute(position, j);
																																																							_vector.add(_offset);
																																																		}
																																																		maxRadiusSq = Math.max(maxRadiusSq, center.distanceToSquared(_vector));
																																													}
																																								}
																																			}
																																			this.boundingSphere.radius = Math.sqrt(maxRadiusSq);
																																			if (isNaN(this.boundingSphere.radius)) {
																																								console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.', this);
																																			}
																														}
																									}
																				}, {
																									key: 'computeTangents',
																									value: function computeTangents() {
																														var index = this.index;
																														var attributes = this.attributes;
																														if (index === null || attributes.position === undefined || attributes.normal === undefined || attributes.uv === undefined) {
																																			console.error('THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)');
																																			return;
																														}
																														var indices = index.array;
																														var positions = attributes.position.array;
																														var normals = attributes.normal.array;
																														var uvs = attributes.uv.array;
																														var nVertices = positions.length / 3;
																														if (attributes.tangent === undefined) {
																																			this.setAttribute('tangent', new BufferAttribute(new Float32Array(4 * nVertices), 4));
																														}
																														var tangents = attributes.tangent.array;
																														var tan1 = [],
																														    tan2 = [];
																														for (var i = 0; i < nVertices; i++) {
																																			tan1[i] = new Vector3();
																																			tan2[i] = new Vector3();
																														}
																														var vA = new Vector3(),
																														    vB = new Vector3(),
																														    vC = new Vector3(),
																														    uvA = new Vector2(),
																														    uvB = new Vector2(),
																														    uvC = new Vector2(),
																														    sdir = new Vector3(),
																														    tdir = new Vector3();
																														function handleTriangle(a, b, c) {
																																			vA.fromArray(positions, a * 3);
																																			vB.fromArray(positions, b * 3);
																																			vC.fromArray(positions, c * 3);
																																			uvA.fromArray(uvs, a * 2);
																																			uvB.fromArray(uvs, b * 2);
																																			uvC.fromArray(uvs, c * 2);
																																			vB.sub(vA);
																																			vC.sub(vA);
																																			uvB.sub(uvA);
																																			uvC.sub(uvA);
																																			var r = 1.0 / (uvB.x * uvC.y - uvC.x * uvB.y);
																																			if (!isFinite(r)) return;
																																			sdir.copy(vB).multiplyScalar(uvC.y).addScaledVector(vC, -uvB.y).multiplyScalar(r);
																																			tdir.copy(vC).multiplyScalar(uvB.x).addScaledVector(vB, -uvC.x).multiplyScalar(r);
																																			tan1[a].add(sdir);
																																			tan1[b].add(sdir);
																																			tan1[c].add(sdir);
																																			tan2[a].add(tdir);
																																			tan2[b].add(tdir);
																																			tan2[c].add(tdir);
																														}
																														var groups = this.groups;
																														if (groups.length === 0) {
																																			groups = [{
																																								start: 0,
																																								count: indices.length
																																			}];
																														}
																														for (var _i10 = 0, il = groups.length; _i10 < il; ++_i10) {
																																			var group = groups[_i10];
																																			var start = group.start;
																																			var count = group.count;
																																			for (var j = start, jl = start + count; j < jl; j += 3) {
																																								handleTriangle(indices[j + 0], indices[j + 1], indices[j + 2]);
																																			}
																														}
																														var tmp = new Vector3(),
																														    tmp2 = new Vector3();
																														var n = new Vector3(),
																														    n2 = new Vector3();
																														function handleVertex(v) {
																																			n.fromArray(normals, v * 3);
																																			n2.copy(n);
																																			var t = tan1[v];
																																			tmp.copy(t);
																																			tmp.sub(n.multiplyScalar(n.dot(t))).normalize();
																																			tmp2.crossVectors(n2, t);
																																			var test = tmp2.dot(tan2[v]);
																																			var w = test < 0.0 ? -1.0 : 1.0;
																																			tangents[v * 4] = tmp.x;
																																			tangents[v * 4 + 1] = tmp.y;
																																			tangents[v * 4 + 2] = tmp.z;
																																			tangents[v * 4 + 3] = w;
																														}
																														for (var _i11 = 0, _il3 = groups.length; _i11 < _il3; ++_i11) {
																																			var _group = groups[_i11];
																																			var _start = _group.start;
																																			var _count = _group.count;
																																			for (var _j4 = _start, _jl = _start + _count; _j4 < _jl; _j4 += 3) {
																																								handleVertex(indices[_j4 + 0]);
																																								handleVertex(indices[_j4 + 1]);
																																								handleVertex(indices[_j4 + 2]);
																																			}
																														}
																									}
																				}, {
																									key: 'computeVertexNormals',
																									value: function computeVertexNormals() {
																														var index = this.index;
																														var positionAttribute = this.getAttribute('position');
																														if (positionAttribute !== undefined) {
																																			var normalAttribute = this.getAttribute('normal');
																																			if (normalAttribute === undefined) {
																																								normalAttribute = new BufferAttribute(new Float32Array(positionAttribute.count * 3), 3);
																																								this.setAttribute('normal', normalAttribute);
																																			} else {
																																								for (var i = 0, il = normalAttribute.count; i < il; i++) {
																																													normalAttribute.setXYZ(i, 0, 0, 0);
																																								}
																																			}
																																			var pA = new Vector3(),
																																			    pB = new Vector3(),
																																			    pC = new Vector3();
																																			var nA = new Vector3(),
																																			    nB = new Vector3(),
																																			    nC = new Vector3();
																																			var cb = new Vector3(),
																																			    ab = new Vector3();
																																			if (index) {
																																								for (var _i12 = 0, _il4 = index.count; _i12 < _il4; _i12 += 3) {
																																													var vA = index.getX(_i12 + 0);
																																													var vB = index.getX(_i12 + 1);
																																													var vC = index.getX(_i12 + 2);
																																													pA.fromBufferAttribute(positionAttribute, vA);
																																													pB.fromBufferAttribute(positionAttribute, vB);
																																													pC.fromBufferAttribute(positionAttribute, vC);
																																													cb.subVectors(pC, pB);
																																													ab.subVectors(pA, pB);
																																													cb.cross(ab);
																																													nA.fromBufferAttribute(normalAttribute, vA);
																																													nB.fromBufferAttribute(normalAttribute, vB);
																																													nC.fromBufferAttribute(normalAttribute, vC);
																																													nA.add(cb);
																																													nB.add(cb);
																																													nC.add(cb);
																																													normalAttribute.setXYZ(vA, nA.x, nA.y, nA.z);
																																													normalAttribute.setXYZ(vB, nB.x, nB.y, nB.z);
																																													normalAttribute.setXYZ(vC, nC.x, nC.y, nC.z);
																																								}
																																			} else {
																																								for (var _i13 = 0, _il5 = positionAttribute.count; _i13 < _il5; _i13 += 3) {
																																													pA.fromBufferAttribute(positionAttribute, _i13 + 0);
																																													pB.fromBufferAttribute(positionAttribute, _i13 + 1);
																																													pC.fromBufferAttribute(positionAttribute, _i13 + 2);
																																													cb.subVectors(pC, pB);
																																													ab.subVectors(pA, pB);
																																													cb.cross(ab);
																																													normalAttribute.setXYZ(_i13 + 0, cb.x, cb.y, cb.z);
																																													normalAttribute.setXYZ(_i13 + 1, cb.x, cb.y, cb.z);
																																													normalAttribute.setXYZ(_i13 + 2, cb.x, cb.y, cb.z);
																																								}
																																			}
																																			this.normalizeNormals();
																																			normalAttribute.needsUpdate = true;
																														}
																									}
																				}, {
																									key: 'merge',
																									value: function merge(geometry, offset) {
																														if (!(geometry && geometry.isBufferGeometry)) {
																																			console.error('THREE.BufferGeometry.merge(): geometry not an instance of THREE.BufferGeometry.', geometry);
																																			return;
																														}
																														if (offset === undefined) {
																																			offset = 0;
																																			console.warn('THREE.BufferGeometry.merge(): Overwriting original geometry, starting at offset=0. ' + 'Use BufferGeometryUtils.mergeBufferGeometries() for lossless merge.');
																														}
																														var attributes = this.attributes;
																														for (var key in attributes) {
																																			if (geometry.attributes[key] === undefined) continue;
																																			var attribute1 = attributes[key];
																																			var attributeArray1 = attribute1.array;
																																			var attribute2 = geometry.attributes[key];
																																			var attributeArray2 = attribute2.array;
																																			var attributeOffset = attribute2.itemSize * offset;
																																			var length = Math.min(attributeArray2.length, attributeArray1.length - attributeOffset);
																																			for (var i = 0, j = attributeOffset; i < length; i++, j++) {
																																								attributeArray1[j] = attributeArray2[i];
																																			}
																														}
																														return this;
																									}
																				}, {
																									key: 'normalizeNormals',
																									value: function normalizeNormals() {
																														var normals = this.attributes.normal;
																														for (var i = 0, il = normals.count; i < il; i++) {
																																			_vector.fromBufferAttribute(normals, i);
																																			_vector.normalize();
																																			normals.setXYZ(i, _vector.x, _vector.y, _vector.z);
																														}
																									}
																				}, {
																									key: 'toNonIndexed',
																									value: function toNonIndexed() {
																														function convertBufferAttribute(attribute, indices) {
																																			var array = attribute.array;
																																			var itemSize = attribute.itemSize;
																																			var normalized = attribute.normalized;
																																			var array2 = new array.constructor(indices.length * itemSize);
																																			var index = 0,
																																			    index2 = 0;
																																			for (var i = 0, l = indices.length; i < l; i++) {
																																								if (attribute.isInterleavedBufferAttribute) {
																																													index = indices[i] * attribute.data.stride + attribute.offset;
																																								} else {
																																													index = indices[i] * itemSize;
																																								}
																																								for (var j = 0; j < itemSize; j++) {
																																													array2[index2++] = array[index++];
																																								}
																																			}
																																			return new BufferAttribute(array2, itemSize, normalized);
																														}
																														if (this.index === null) {
																																			console.warn('THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed.');
																																			return this;
																														}
																														var geometry2 = new BufferGeometry();
																														var indices = this.index.array;
																														var attributes = this.attributes;
																														for (var name in attributes) {
																																			var attribute = attributes[name];
																																			var newAttribute = convertBufferAttribute(attribute, indices);
																																			geometry2.setAttribute(name, newAttribute);
																														}
																														var morphAttributes = this.morphAttributes;
																														for (var _name in morphAttributes) {
																																			var morphArray = [];
																																			var morphAttribute = morphAttributes[_name];
																																			for (var i = 0, il = morphAttribute.length; i < il; i++) {
																																								var _attribute = morphAttribute[i];
																																								var _newAttribute = convertBufferAttribute(_attribute, indices);
																																								morphArray.push(_newAttribute);
																																			}
																																			geometry2.morphAttributes[_name] = morphArray;
																														}
																														geometry2.morphTargetsRelative = this.morphTargetsRelative;
																														var groups = this.groups;
																														for (var _i14 = 0, l = groups.length; _i14 < l; _i14++) {
																																			var group = groups[_i14];
																																			geometry2.addGroup(group.start, group.count, group.materialIndex);
																														}
																														return geometry2;
																									}
																				}, {
																									key: 'toJSON',
																									value: function toJSON() {
																														var data = {
																																			metadata: {
																																								version: 4.5,
																																								type: 'BufferGeometry',
																																								generator: 'BufferGeometry.toJSON'
																																			}
																														};
																														data.uuid = this.uuid;
																														data.type = this.type;
																														if (this.name !== '') data.name = this.name;
																														if (Object.keys(this.userData).length > 0) data.userData = this.userData;
																														if (this.parameters !== undefined) {
																																			var parameters = this.parameters;
																																			for (var key in parameters) {
																																								if (parameters[key] !== undefined) data[key] = parameters[key];
																																			}
																																			return data;
																														}
																														data.data = { attributes: {} };
																														var index = this.index;
																														if (index !== null) {
																																			data.data.index = {
																																								type: index.array.constructor.name,
																																								array: Array.prototype.slice.call(index.array)
																																			};
																														}
																														var attributes = this.attributes;
																														for (var _key in attributes) {
																																			var attribute = attributes[_key];
																																			data.data.attributes[_key] = attribute.toJSON(data.data);
																														}
																														var morphAttributes = {};
																														var hasMorphAttributes = false;
																														for (var _key2 in this.morphAttributes) {
																																			var attributeArray = this.morphAttributes[_key2];
																																			var array = [];
																																			for (var i = 0, il = attributeArray.length; i < il; i++) {
																																								var _attribute2 = attributeArray[i];
																																								array.push(_attribute2.toJSON(data.data));
																																			}
																																			if (array.length > 0) {
																																								morphAttributes[_key2] = array;
																																								hasMorphAttributes = true;
																																			}
																														}
																														if (hasMorphAttributes) {
																																			data.data.morphAttributes = morphAttributes;
																																			data.data.morphTargetsRelative = this.morphTargetsRelative;
																														}
																														var groups = this.groups;
																														if (groups.length > 0) {
																																			data.data.groups = JSON.parse(JSON.stringify(groups));
																														}
																														var boundingSphere = this.boundingSphere;
																														if (boundingSphere !== null) {
																																			data.data.boundingSphere = {
																																								center: boundingSphere.center.toArray(),
																																								radius: boundingSphere.radius
																																			};
																														}
																														return data;
																									}
																				}, {
																									key: 'clone',
																									value: function clone() {
																														return new this.constructor().copy(this);
																									}
																				}, {
																									key: 'copy',
																									value: function copy(source) {
																														this.index = null;
																														this.attributes = {};
																														this.morphAttributes = {};
																														this.groups = [];
																														this.boundingBox = null;
																														this.boundingSphere = null;
																														var data = {};
																														this.name = source.name;
																														var index = source.index;
																														if (index !== null) {
																																			this.setIndex(index.clone(data));
																														}
																														var attributes = source.attributes;
																														for (var name in attributes) {
																																			var attribute = attributes[name];
																																			this.setAttribute(name, attribute.clone(data));
																														}
																														var morphAttributes = source.morphAttributes;
																														for (var _name2 in morphAttributes) {
																																			var array = [];
																																			var morphAttribute = morphAttributes[_name2];
																																			for (var i = 0, l = morphAttribute.length; i < l; i++) {
																																								array.push(morphAttribute[i].clone(data));
																																			}
																																			this.morphAttributes[_name2] = array;
																														}
																														this.morphTargetsRelative = source.morphTargetsRelative;
																														var groups = source.groups;
																														for (var _i15 = 0, _l3 = groups.length; _i15 < _l3; _i15++) {
																																			var group = groups[_i15];
																																			this.addGroup(group.start, group.count, group.materialIndex);
																														}
																														var boundingBox = source.boundingBox;
																														if (boundingBox !== null) {
																																			this.boundingBox = boundingBox.clone();
																														}
																														var boundingSphere = source.boundingSphere;
																														if (boundingSphere !== null) {
																																			this.boundingSphere = boundingSphere.clone();
																														}
																														this.drawRange.start = source.drawRange.start;
																														this.drawRange.count = source.drawRange.count;
																														this.userData = source.userData;
																														if (source.parameters !== undefined) this.parameters = Object.assign({}, source.parameters);
																														return this;
																									}
																				}, {
																									key: 'dispose',
																									value: function dispose() {
																														this.dispatchEvent({ type: 'dispose' });
																									}
																				}]);
																				return BufferGeometry;
															}(EventDispatcher);
															BufferGeometry.prototype.isBufferGeometry = true;
															var ConvexGeometry = function (_BufferGeometry) {
																				inherits(ConvexGeometry, _BufferGeometry);
																				function ConvexGeometry(points) {
																									classCallCheck(this, ConvexGeometry);
																									var _this2 = possibleConstructorReturn(this, (ConvexGeometry.__proto__ || Object.getPrototypeOf(ConvexGeometry)).call(this));
																									var vertices = [];
																									var normals = [];
																									if (ConvexHull === undefined) {
																														console.error('THREE.ConvexBufferGeometry: ConvexBufferGeometry relies on ConvexHull');
																									}
																									var convexHull = new _Three.ConvexHull().setFromPoints(points);
																									var faces = convexHull.faces;
																									for (var i = 0; i < faces.length; i++) {
																														var face = faces[i];
																														var edge = face.edge;
																														do {
																																			var point = edge.head().point;
																																			vertices.push(point.x, point.y, point.z);
																																			normals.push(face.normal.x, face.normal.y, face.normal.z);
																																			edge = edge.next;
																														} while (edge !== face.edge);
																									}
																									_this2.setAttribute('position', new Float32BufferAttribute(vertices, 3));
																									_this2.setAttribute('normal', new Float32BufferAttribute(normals, 3));
																									return _this2;
																				}
																				return ConvexGeometry;
															}(BufferGeometry);
															this.ConvexGeometry = ConvexGeometry;
															var
															MOUSE = three.THREE.MOUSE,
															    Quaternion = three.THREE.Quaternion,
															    Spherical = three.THREE.Spherical,
															    TOUCH = three.THREE.TOUCH;
															var _changeEvent = { type: 'change' };
															var _startEvent = { type: 'start' };
															var _endEvent = { type: 'end' };
															var OrbitControls = function (_EventDispatcher2) {
																				inherits(OrbitControls, _EventDispatcher2);
																				function OrbitControls(object, domElement) {
																									classCallCheck(this, OrbitControls);
																									var _this3 = possibleConstructorReturn(this, (OrbitControls.__proto__ || Object.getPrototypeOf(OrbitControls)).call(this));
																									if (domElement === undefined) console.warn('THREE.OrbitControls: The second parameter "domElement" is now mandatory.');
																									if (domElement === document) console.error('THREE.OrbitControls: "document" should not be used as the target "domElement". Please use "renderer.domElement" instead.');
																									_this3.object = object;
																									_this3.domElement = domElement;
																									_this3.domElement.style.touchAction = 'none';
																									_this3.enabled = true;
																									_this3.target = new Vector3();
																									_this3.minDistance = 0;
																									_this3.maxDistance = Infinity;
																									_this3.minZoom = 0;
																									_this3.maxZoom = Infinity;
																									_this3.minPolarAngle = 0;
																									_this3.maxPolarAngle = Math.PI;
																									_this3.minAzimuthAngle = -Infinity;
																									_this3.maxAzimuthAngle = Infinity;
																									_this3.enableDamping = false;
																									_this3.dampingFactor = 0.05;
																									_this3.enableZoom = true;
																									_this3.zoomSpeed = 1.0;
																									_this3.enableRotate = true;
																									_this3.rotateSpeed = 1.0;
																									_this3.enablePan = true;
																									_this3.panSpeed = 1.0;
																									_this3.screenSpacePanning = true;
																									_this3.keyPanSpeed = 7.0;
																									_this3.autoRotate = false;
																									_this3.autoRotateSpeed = 2.0;
																									_this3.keys = { LEFT: 'ArrowLeft', UP: 'ArrowUp', RIGHT: 'ArrowRight', BOTTOM: 'ArrowDown' };
																									_this3.mouseButtons = { LEFT: MOUSE.ROTATE, MIDDLE: MOUSE.DOLLY, RIGHT: MOUSE.PAN };
																									_this3.touches = { ONE: TOUCH.ROTATE, TWO: TOUCH.DOLLY_PAN };
																									_this3.target0 = _this3.target.clone();
																									_this3.position0 = _this3.object.position.clone();
																									_this3.zoom0 = _this3.object.zoom;
																									_this3._domElementKeyEvents = null;
																									_this3.getPolarAngle = function () {
																														return spherical.phi;
																									};
																									_this3.getAzimuthalAngle = function () {
																														return spherical.theta;
																									};
																									_this3.getDistance = function () {
																														return this.object.position.distanceTo(this.target);
																									};
																									_this3.listenToKeyEvents = function (domElement) {
																														domElement.addEventListener('keydown', onKeyDown);
																														this._domElementKeyEvents = domElement;
																									};
																									_this3.saveState = function () {
																														scope.target0.copy(scope.target);
																														scope.position0.copy(scope.object.position);
																														scope.zoom0 = scope.object.zoom;
																									};
																									_this3.reset = function () {
																														scope.target.copy(scope.target0);
																														scope.object.position.copy(scope.position0);
																														scope.object.zoom = scope.zoom0;
																														scope.object.updateProjectionMatrix();
																														scope.dispatchEvent(_changeEvent);
																														scope.update();
																														state = STATE.NONE;
																									};
																									_this3.update = function () {
																														var offset = new Vector3();
																														var quat = new Quaternion().setFromUnitVectors(object.up, new Vector3(0, 1, 0));
																														var quatInverse = quat.clone().invert();
																														var lastPosition = new Vector3();
																														var lastQuaternion = new Quaternion();
																														var twoPI = 2 * Math.PI;
																														return function update() {
																																			var position = scope.object.position;
																																			offset.copy(position).sub(scope.target);
																																			offset.applyQuaternion(quat);
																																			spherical.setFromVector3(offset);
																																			if (scope.autoRotate && state === STATE.NONE) {
																																								rotateLeft(getAutoRotationAngle());
																																			}
																																			if (scope.enableDamping) {
																																								spherical.theta += sphericalDelta.theta * scope.dampingFactor;
																																								spherical.phi += sphericalDelta.phi * scope.dampingFactor;
																																			} else {
																																								spherical.theta += sphericalDelta.theta;
																																								spherical.phi += sphericalDelta.phi;
																																			}
																																			var min = scope.minAzimuthAngle;
																																			var max = scope.maxAzimuthAngle;
																																			if (isFinite(min) && isFinite(max)) {
																																								if (min < -Math.PI) min += twoPI;else if (min > Math.PI) min -= twoPI;
																																								if (max < -Math.PI) max += twoPI;else if (max > Math.PI) max -= twoPI;
																																								if (min <= max) {
																																													spherical.theta = Math.max(min, Math.min(max, spherical.theta));
																																								} else {
																																													spherical.theta = spherical.theta > (min + max) / 2 ? Math.max(min, spherical.theta) : Math.min(max, spherical.theta);
																																								}
																																			}
																																			spherical.phi = Math.max(scope.minPolarAngle, Math.min(scope.maxPolarAngle, spherical.phi));
																																			spherical.makeSafe();
																																			spherical.radius *= scale;
																																			spherical.radius = Math.max(scope.minDistance, Math.min(scope.maxDistance, spherical.radius));
																																			if (scope.enableDamping === true) {
																																								scope.target.addScaledVector(panOffset, scope.dampingFactor);
																																			} else {
																																								scope.target.add(panOffset);
																																			}
																																			offset.setFromSpherical(spherical);
																																			offset.applyQuaternion(quatInverse);
																																			position.copy(scope.target).add(offset);
																																			scope.object.lookAt(scope.target);
																																			if (scope.enableDamping === true) {
																																								sphericalDelta.theta *= 1 - scope.dampingFactor;
																																								sphericalDelta.phi *= 1 - scope.dampingFactor;
																																								panOffset.multiplyScalar(1 - scope.dampingFactor);
																																			} else {
																																								sphericalDelta.set(0, 0, 0);
																																								panOffset.set(0, 0, 0);
																																			}
																																			scale = 1;
																																			if (zoomChanged || lastPosition.distanceToSquared(scope.object.position) > EPS || 8 * (1 - lastQuaternion.dot(scope.object.quaternion)) > EPS) {
																																								scope.dispatchEvent(_changeEvent);
																																								lastPosition.copy(scope.object.position);
																																								lastQuaternion.copy(scope.object.quaternion);
																																								zoomChanged = false;
																																								return true;
																																			}
																																			return false;
																														};
																									}();
																									_this3.dispose = function () {
																														scope.domElement.removeEventListener('contextmenu', onContextMenu);
																														scope.domElement.removeEventListener('pointerdown', onPointerDown);
																														scope.domElement.removeEventListener('pointercancel', onPointerCancel);
																														scope.domElement.removeEventListener('wheel', onMouseWheel);
																														scope.domElement.removeEventListener('pointermove', onPointerMove);
																														scope.domElement.removeEventListener('pointerup', onPointerUp);
																														if (scope._domElementKeyEvents !== null) {
																																			scope._domElementKeyEvents.removeEventListener('keydown', onKeyDown);
																														}
																									};
																									var scope = _this3;
																									var STATE = {
																														NONE: -1,
																														ROTATE: 0,
																														DOLLY: 1,
																														PAN: 2,
																														TOUCH_ROTATE: 3,
																														TOUCH_PAN: 4,
																														TOUCH_DOLLY_PAN: 5,
																														TOUCH_DOLLY_ROTATE: 6
																									};
																									var state = STATE.NONE;
																									var EPS = 0.000001;
																									var spherical = new Spherical();
																									var sphericalDelta = new Spherical();
																									var scale = 1;
																									var panOffset = new Vector3();
																									var zoomChanged = false;
																									var rotateStart = new Vector2();
																									var rotateEnd = new Vector2();
																									var rotateDelta = new Vector2();
																									var panStart = new Vector2();
																									var panEnd = new Vector2();
																									var panDelta = new Vector2();
																									var dollyStart = new Vector2();
																									var dollyEnd = new Vector2();
																									var dollyDelta = new Vector2();
																									var pointers = [];
																									var pointerPositions = {};
																									function getAutoRotationAngle() {
																														return 2 * Math.PI / 60 / 60 * scope.autoRotateSpeed;
																									}
																									function getZoomScale() {
																														return Math.pow(0.95, scope.zoomSpeed);
																									}
																									function rotateLeft(angle) {
																														sphericalDelta.theta -= angle;
																									}
																									function rotateUp(angle) {
																														sphericalDelta.phi -= angle;
																									}
																									var panLeft = function () {
																														var v = new Vector3();
																														return function panLeft(distance, objectMatrix) {
																																			v.setFromMatrixColumn(objectMatrix, 0);
																																			v.multiplyScalar(-distance);
																																			panOffset.add(v);
																														};
																									}();
																									var panUp = function () {
																														var v = new Vector3();
																														return function panUp(distance, objectMatrix) {
																																			if (scope.screenSpacePanning === true) {
																																								v.setFromMatrixColumn(objectMatrix, 1);
																																			} else {
																																								v.setFromMatrixColumn(objectMatrix, 0);
																																								v.crossVectors(scope.object.up, v);
																																			}
																																			v.multiplyScalar(distance);
																																			panOffset.add(v);
																														};
																									}();
																									var pan = function () {
																														var offset = new Vector3();
																														return function pan(deltaX, deltaY) {
																																			var element = scope.domElement;
																																			if (scope.object.isPerspectiveCamera) {
																																								var position = scope.object.position;
																																								offset.copy(position).sub(scope.target);
																																								var targetDistance = offset.length();
																																								targetDistance *= Math.tan(scope.object.fov / 2 * Math.PI / 180.0);
																																								panLeft(2 * deltaX * targetDistance / element.clientHeight, scope.object.matrix);
																																								panUp(2 * deltaY * targetDistance / element.clientHeight, scope.object.matrix);
																																			} else if (scope.object.isOrthographicCamera) {
																																								panLeft(deltaX * (scope.object.right - scope.object.left) / scope.object.zoom / element.clientWidth, scope.object.matrix);
																																								panUp(deltaY * (scope.object.top - scope.object.bottom) / scope.object.zoom / element.clientHeight, scope.object.matrix);
																																			} else {
																																								console.warn('WARNING: OrbitControls encountered an unknown camera type - pan disabled.');
																																								scope.enablePan = false;
																																			}
																														};
																									}();
																									function dollyOut(dollyScale) {
																														if (scope.object.isPerspectiveCamera) {
																																			scale /= dollyScale;
																														} else if (scope.object.isOrthographicCamera) {
																																			scope.object.zoom = Math.max(scope.minZoom, Math.min(scope.maxZoom, scope.object.zoom * dollyScale));
																																			scope.object.updateProjectionMatrix();
																																			zoomChanged = true;
																														} else {
																																			console.warn('WARNING: OrbitControls encountered an unknown camera type - dolly/zoom disabled.');
																																			scope.enableZoom = false;
																														}
																									}
																									function dollyIn(dollyScale) {
																														if (scope.object.isPerspectiveCamera) {
																																			scale *= dollyScale;
																														} else if (scope.object.isOrthographicCamera) {
																																			scope.object.zoom = Math.max(scope.minZoom, Math.min(scope.maxZoom, scope.object.zoom / dollyScale));
																																			scope.object.updateProjectionMatrix();
																																			zoomChanged = true;
																														} else {
																																			console.warn('WARNING: OrbitControls encountered an unknown camera type - dolly/zoom disabled.');
																																			scope.enableZoom = false;
																														}
																									}
																									function handleMouseDownRotate(event) {
																														rotateStart.set(event.clientX, event.clientY);
																									}
																									function handleMouseDownDolly(event) {
																														dollyStart.set(event.clientX, event.clientY);
																									}
																									function handleMouseDownPan(event) {
																														panStart.set(event.clientX, event.clientY);
																									}
																									function handleMouseMoveRotate(event) {
																														rotateEnd.set(event.clientX, event.clientY);
																														rotateDelta.subVectors(rotateEnd, rotateStart).multiplyScalar(scope.rotateSpeed);
																														var element = scope.domElement;
																														rotateLeft(2 * Math.PI * rotateDelta.x / element.clientHeight);
																														rotateUp(2 * Math.PI * rotateDelta.y / element.clientHeight);
																														rotateStart.copy(rotateEnd);
																														scope.update();
																									}
																									function handleMouseMoveDolly(event) {
																														dollyEnd.set(event.clientX, event.clientY);
																														dollyDelta.subVectors(dollyEnd, dollyStart);
																														if (dollyDelta.y > 0) {
																																			dollyOut(getZoomScale());
																														} else if (dollyDelta.y < 0) {
																																			dollyIn(getZoomScale());
																														}
																														dollyStart.copy(dollyEnd);
																														scope.update();
																									}
																									function handleMouseMovePan(event) {
																														panEnd.set(event.clientX, event.clientY);
																														panDelta.subVectors(panEnd, panStart).multiplyScalar(scope.panSpeed);
																														pan(panDelta.x, panDelta.y);
																														panStart.copy(panEnd);
																														scope.update();
																									}
																									function handleMouseWheel(event) {
																														if (event.deltaY < 0) {
																																			dollyIn(getZoomScale());
																														} else if (event.deltaY > 0) {
																																			dollyOut(getZoomScale());
																														}
																														scope.update();
																									}
																									function handleKeyDown(event) {
																														var needsUpdate = false;
																														switch (event.code) {
																																			case scope.keys.UP:
																																								pan(0, scope.keyPanSpeed);
																																								needsUpdate = true;
																																								break;
																																			case scope.keys.BOTTOM:
																																								pan(0, -scope.keyPanSpeed);
																																								needsUpdate = true;
																																								break;
																																			case scope.keys.LEFT:
																																								pan(scope.keyPanSpeed, 0);
																																								needsUpdate = true;
																																								break;
																																			case scope.keys.RIGHT:
																																								pan(-scope.keyPanSpeed, 0);
																																								needsUpdate = true;
																																								break;
																														}
																														if (needsUpdate) {
																																			event.preventDefault();
																																			scope.update();
																														}
																									}
																									function handleTouchStartRotate() {
																														if (pointers.length === 1) {
																																			rotateStart.set(pointers[0].pageX, pointers[0].pageY);
																														} else {
																																			var x = 0.5 * (pointers[0].pageX + pointers[1].pageX);
																																			var y = 0.5 * (pointers[0].pageY + pointers[1].pageY);
																																			rotateStart.set(x, y);
																														}
																									}
																									function handleTouchStartPan() {
																														if (pointers.length === 1) {
																																			panStart.set(pointers[0].pageX, pointers[0].pageY);
																														} else {
																																			var x = 0.5 * (pointers[0].pageX + pointers[1].pageX);
																																			var y = 0.5 * (pointers[0].pageY + pointers[1].pageY);
																																			panStart.set(x, y);
																														}
																									}
																									function handleTouchStartDolly() {
																														var dx = pointers[0].pageX - pointers[1].pageX;
																														var dy = pointers[0].pageY - pointers[1].pageY;
																														var distance = Math.sqrt(dx * dx + dy * dy);
																														dollyStart.set(0, distance);
																									}
																									function handleTouchStartDollyPan() {
																														if (scope.enableZoom) handleTouchStartDolly();
																														if (scope.enablePan) handleTouchStartPan();
																									}
																									function handleTouchStartDollyRotate() {
																														if (scope.enableZoom) handleTouchStartDolly();
																														if (scope.enableRotate) handleTouchStartRotate();
																									}
																									function handleTouchMoveRotate(event) {
																														if (pointers.length == 1) {
																																			rotateEnd.set(event.pageX, event.pageY);
																														} else {
																																			var position = getSecondPointerPosition(event);
																																			var x = 0.5 * (event.pageX + position.x);
																																			var y = 0.5 * (event.pageY + position.y);
																																			rotateEnd.set(x, y);
																														}
																														rotateDelta.subVectors(rotateEnd, rotateStart).multiplyScalar(scope.rotateSpeed);
																														var element = scope.domElement;
																														rotateLeft(2 * Math.PI * rotateDelta.x / element.clientHeight);
																														rotateUp(2 * Math.PI * rotateDelta.y / element.clientHeight);
																														rotateStart.copy(rotateEnd);
																									}
																									function handleTouchMovePan(event) {
																														if (pointers.length === 1) {
																																			panEnd.set(event.pageX, event.pageY);
																														} else {
																																			var position = getSecondPointerPosition(event);
																																			var x = 0.5 * (event.pageX + position.x);
																																			var y = 0.5 * (event.pageY + position.y);
																																			panEnd.set(x, y);
																														}
																														panDelta.subVectors(panEnd, panStart).multiplyScalar(scope.panSpeed);
																														pan(panDelta.x, panDelta.y);
																														panStart.copy(panEnd);
																									}
																									function handleTouchMoveDolly(event) {
																														var position = getSecondPointerPosition(event);
																														var dx = event.pageX - position.x;
																														var dy = event.pageY - position.y;
																														var distance = Math.sqrt(dx * dx + dy * dy);
																														dollyEnd.set(0, distance);
																														dollyDelta.set(0, Math.pow(dollyEnd.y / dollyStart.y, scope.zoomSpeed));
																														dollyOut(dollyDelta.y);
																														dollyStart.copy(dollyEnd);
																									}
																									function handleTouchMoveDollyPan(event) {
																														if (scope.enableZoom) handleTouchMoveDolly(event);
																														if (scope.enablePan) handleTouchMovePan(event);
																									}
																									function handleTouchMoveDollyRotate(event) {
																														if (scope.enableZoom) handleTouchMoveDolly(event);
																														if (scope.enableRotate) handleTouchMoveRotate(event);
																									}
																									function onPointerDown(event) {
																														if (scope.enabled === false) return;
																														if (pointers.length === 0) {
																																			scope.domElement.setPointerCapture(event.pointerId);
																																			scope.domElement.addEventListener('pointermove', onPointerMove);
																																			scope.domElement.addEventListener('pointerup', onPointerUp);
																														}
																														addPointer(event);
																														if (event.pointerType === 'touch') {
																																			onTouchStart(event);
																														} else {
																																			onMouseDown(event);
																														}
																									}
																									function onPointerMove(event) {
																														if (scope.enabled === false) return;
																														if (event.pointerType === 'touch') {
																																			onTouchMove(event);
																														} else {
																																			onMouseMove(event);
																														}
																									}
																									function onPointerUp(event) {
																														if (scope.enabled === false) return;
																														if (event.pointerType === 'touch') {
																																			onTouchEnd();
																														} else {
																																			onMouseUp(event);
																														}
																														removePointer(event);
																														if (pointers.length === 0) {
																																			scope.domElement.releasePointerCapture(event.pointerId);
																																			scope.domElement.removeEventListener('pointermove', onPointerMove);
																																			scope.domElement.removeEventListener('pointerup', onPointerUp);
																														}
																									}
																									function onPointerCancel(event) {
																														removePointer(event);
																									}
																									function onMouseDown(event) {
																														var mouseAction = void 0;
																														switch (event.button) {
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
																																								mouseAction = -1;
																														}
																														switch (mouseAction) {
																																			case MOUSE.DOLLY:
																																								if (scope.enableZoom === false) return;
																																								handleMouseDownDolly(event);
																																								state = STATE.DOLLY;
																																								break;
																																			case MOUSE.ROTATE:
																																								if (event.ctrlKey || event.metaKey || event.shiftKey) {
																																													if (scope.enablePan === false) return;
																																													handleMouseDownPan(event);
																																													state = STATE.PAN;
																																								} else {
																																													if (scope.enableRotate === false) return;
																																													handleMouseDownRotate(event);
																																													state = STATE.ROTATE;
																																								}
																																								break;
																																			case MOUSE.PAN:
																																								if (event.ctrlKey || event.metaKey || event.shiftKey) {
																																													if (scope.enableRotate === false) return;
																																													handleMouseDownRotate(event);
																																													state = STATE.ROTATE;
																																								} else {
																																													if (scope.enablePan === false) return;
																																													handleMouseDownPan(event);
																																													state = STATE.PAN;
																																								}
																																								break;
																																			default:
																																								state = STATE.NONE;
																														}
																														if (state !== STATE.NONE) {
																																			scope.dispatchEvent(_startEvent);
																														}
																									}
																									function onMouseMove(event) {
																														if (scope.enabled === false) return;
																														switch (state) {
																																			case STATE.ROTATE:
																																								if (scope.enableRotate === false) return;
																																								handleMouseMoveRotate(event);
																																								break;
																																			case STATE.DOLLY:
																																								if (scope.enableZoom === false) return;
																																								handleMouseMoveDolly(event);
																																								break;
																																			case STATE.PAN:
																																								if (scope.enablePan === false) return;
																																								handleMouseMovePan(event);
																																								break;
																														}
																									}
																									function onMouseUp(event) {
																														scope.dispatchEvent(_endEvent);
																														state = STATE.NONE;
																									}
																									function onMouseWheel(event) {
																														if (scope.enabled === false || scope.enableZoom === false || state !== STATE.NONE && state !== STATE.ROTATE) return;
																														event.preventDefault();
																														scope.dispatchEvent(_startEvent);
																														handleMouseWheel(event);
																														scope.dispatchEvent(_endEvent);
																									}
																									function onKeyDown(event) {
																														if (scope.enabled === false || scope.enablePan === false) return;
																														handleKeyDown(event);
																									}
																									function onTouchStart(event) {
																														trackPointer(event);
																														switch (pointers.length) {
																																			case 1:
																																								switch (scope.touches.ONE) {
																																													case TOUCH.ROTATE:
																																																		if (scope.enableRotate === false) return;
																																																		handleTouchStartRotate();
																																																		state = STATE.TOUCH_ROTATE;
																																																		break;
																																													case TOUCH.PAN:
																																																		if (scope.enablePan === false) return;
																																																		handleTouchStartPan();
																																																		state = STATE.TOUCH_PAN;
																																																		break;
																																													default:
																																																		state = STATE.NONE;
																																								}
																																								break;
																																			case 2:
																																								switch (scope.touches.TWO) {
																																													case TOUCH.DOLLY_PAN:
																																																		if (scope.enableZoom === false && scope.enablePan === false) return;
																																																		handleTouchStartDollyPan();
																																																		state = STATE.TOUCH_DOLLY_PAN;
																																																		break;
																																													case TOUCH.DOLLY_ROTATE:
																																																		if (scope.enableZoom === false && scope.enableRotate === false) return;
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
																														if (state !== STATE.NONE) {
																																			scope.dispatchEvent(_startEvent);
																														}
																									}
																									function onTouchMove(event) {
																														trackPointer(event);
																														switch (state) {
																																			case STATE.TOUCH_ROTATE:
																																								if (scope.enableRotate === false) return;
																																								handleTouchMoveRotate(event);
																																								scope.update();
																																								break;
																																			case STATE.TOUCH_PAN:
																																								if (scope.enablePan === false) return;
																																								handleTouchMovePan(event);
																																								scope.update();
																																								break;
																																			case STATE.TOUCH_DOLLY_PAN:
																																								if (scope.enableZoom === false && scope.enablePan === false) return;
																																								handleTouchMoveDollyPan(event);
																																								scope.update();
																																								break;
																																			case STATE.TOUCH_DOLLY_ROTATE:
																																								if (scope.enableZoom === false && scope.enableRotate === false) return;
																																								handleTouchMoveDollyRotate(event);
																																								scope.update();
																																								break;
																																			default:
																																								state = STATE.NONE;
																														}
																									}
																									function onTouchEnd(event) {
																														scope.dispatchEvent(_endEvent);
																														state = STATE.NONE;
																									}
																									function onContextMenu(event) {
																														if (scope.enabled === false) return;
																														event.preventDefault();
																									}
																									function addPointer(event) {
																														pointers.push(event);
																									}
																									function removePointer(event) {
																														delete pointerPositions[event.pointerId];
																														for (var i = 0; i < pointers.length; i++) {
																																			if (pointers[i].pointerId == event.pointerId) {
																																								pointers.splice(i, 1);
																																								return;
																																			}
																														}
																									}
																									function trackPointer(event) {
																														var position = pointerPositions[event.pointerId];
																														if (position === undefined) {
																																			position = new Vector2();
																																			pointerPositions[event.pointerId] = position;
																														}
																														position.set(event.pageX, event.pageY);
																									}
																									function getSecondPointerPosition(event) {
																														var pointer = event.pointerId === pointers[0].pointerId ? pointers[1] : pointers[0];
																														return pointerPositions[pointer.pointerId];
																									}
																									scope.domElement.addEventListener('contextmenu', onContextMenu);
																									scope.domElement.addEventListener('pointerdown', onPointerDown);
																									scope.domElement.addEventListener('pointercancel', onPointerCancel);
																									scope.domElement.addEventListener('wheel', onMouseWheel, { passive: false });
																									_this3.update();
																									return _this3;
																				}
																				return OrbitControls;
															}(EventDispatcher);
															this.OrbitControls = OrbitControls;
										}
										,
										get: function get$$1() {
															if (_THREE === undefined) console.error('three: invalid _THREE = ' + _THREE + '. Call three.THREE = THREE first.');
															return _THREE;
										}
					}, {
										key: 'dat',
										set: function set$$1(dat) {
															if (_dat) {
																				if (!Object.is(dat, _dat)) console.error('three: duplicate dat. Please use one instance of the dat library.');
																				return;
															}
															_dat = dat;
										}
										,
										get: function get$$1() {
															return _dat;
										}
					}]);
					return Three;
}();
var three;
window.__myThree__ = window.__myThree__ || {};
if (window.__myThree__.three) {
					three = window.__myThree__.three;
} else {
					three = new Three();
					three.isThree = function () {
										return _THREE;
					};
					window.__myThree__.three = three;
}
var three$1 = three;

/**
 * @module ScaleController
 * @description is dat.GUI graphical user interface controller for control of the scale of threejs 3D object
 *
 * @see {@link https://threejs.org/} about threejs
 * @see {@link https://github.com/dataarts/dat.gui} about dat.GUI
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
		}, 'multiplier', 1.1, 10, 0.1, options.newBool));
		if (_this.property === undefined) console.error('init() returns ' + _this.property);
		return _this;
	}
	return ScaleController;
}(controllers.CustomController);
function ScaleControllers(folder, object, property, onChange, options) {
	options = options || {};
	var dat = three$1.dat;
	var scaleController = folder.add(new ScaleController(function (customController, action) {
		var value = action(controller.getValue(), scaleController.getValue());
		controller.setValue(value);
		onChange(value);
	}, {
		getLanguageCode: options.getLanguageCode,
		settings: options.settings
	})).onChange(function (value) {
		scaleController.zoomMultiplier = value;
	});
	var controller = dat.controllerZeroStep(folder, object, property, function (value) {
		onChange(value);
	});
	if (options.text) dat.controllerNameAndTitle(controller, options.text, options.textTitle);
}

/**
 * PositionController is dat.GUI graphical user interface controller for control of the position of threejs 3D object
 *
 * @see {@link https://threejs.org/} about threejs
 * @see {@link https://github.com/dataarts/dat.gui} about dat.GUI
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
var PositionController = function (_controllers$CustomCo) {
				inherits(PositionController, _controllers$CustomCo);
				function PositionController(onclickController, options) {
								classCallCheck(this, PositionController);
								options = options || {};
								options.settings = options.settings || {};
								var settings = options.settings;
								if (options.min === undefined) options.min = 0.1;
								if (options.max === undefined) options.max = 10;
								if (settings.offset === undefined) settings.offset = 0.1;
								if (options.step === undefined) options.step = 0.1;
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
var get$2 = function get$$1(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);
  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);
    if (parent === null) {
      return undefined;
    } else {
      return get$$1(parent, property, receiver);
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
      elem.addEventListener(event, func, {
        passive: bool
      });
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
      var toReturn = get$2(OptionController.prototype.__proto__ || Object.getPrototypeOf(OptionController.prototype), 'setValue', this).call(this, v);
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
      return get$2(OptionController.prototype.__proto__ || Object.getPrototypeOf(OptionController.prototype), 'updateDisplay', this).call(this);
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
      return get$2(StringController.prototype.__proto__ || Object.getPrototypeOf(StringController.prototype), 'updateDisplay', this).call(this);
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
      return get$2(NumberControllerBox.prototype.__proto__ || Object.getPrototypeOf(NumberControllerBox.prototype), 'updateDisplay', this).call(this);
    }
  }]);
  return NumberControllerBox;
}(NumberController$1);
function map$1(v, i1, i2, o1, o2) {
  return o1 + (o2 - o1) * ((v - i1) / (i2 - i1));
}
var NumberControllerSlider$1 = function (_NumberController) {
  inherits$2(NumberControllerSlider, _NumberController);
  function NumberControllerSlider(object, property, min, max, step, newBool) {
    classCallCheck$2(this, NumberControllerSlider);
    var _this2 = possibleConstructorReturn$2(this, (NumberControllerSlider.__proto__ || Object.getPrototypeOf(NumberControllerSlider)).call(this, object, property, { min: min, max: max, step: step }));
    var _this = _this2;
    _this2.__background = document.createElement('div');
    _this2.__foreground = document.createElement('div');
    _this2.newBool = newBool;
    dom$1$1.bind(_this2.__background, 'mousedown', onMouseDown, newBool);
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
      if (!_this.newBool) e.preventDefault();
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
      return get$2(NumberControllerSlider.prototype.__proto__ || Object.getPrototypeOf(NumberControllerSlider.prototype), 'updateDisplay', this).call(this);
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
        return new NumberControllerSlider$1(object, property, arguments[2], arguments[3], arguments[4], arguments[5]);
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
function requestAnimationFrame$2(callback) {
  setTimeout(callback, 1000 / 60);
}
var requestAnimationFrame$1$2 = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || requestAnimationFrame$2;
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
 * get position functions library
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
function getObjectLocalPosition(object, index) {
	var THREE = three$1.THREE;
	var attributesPosition = object.geometry.attributes.position,
	    position = attributesPosition.itemSize >= 4 ? new THREE.Vector4(0, 0, 0, 0) : new THREE.Vector3();
	position.fromArray(attributesPosition.array, index * attributesPosition.itemSize);
	return position;
}
function getWorldPosition(object, pos) {
	var THREE = three$1.THREE;
	var position = pos.clone();
	function getPosition(object, pos) {
		var position = new THREE.Vector3(),
		    positionAngle = new THREE.Vector3();
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
	} while (object && object.parent);
	return position;
}
function getObjectPosition(object, index) {
	if (index === -1) return undefined;
	if (index === undefined) return object.position;
	return getWorldPosition(object, getObjectLocalPosition(object, index));
}

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
			ErrorMessage('XMLHttpRequest: Invalid url: ' + this.url);
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
	if (options.async === true) console.warn('Load file asynchronously is deprecated. Please use fetch.');
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
	}, options.async === undefined ? false : true
	);
	return response;
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
function async$1(src, options) {
	options = options || {};
	options.appendTo = options.appendTo || document.getElementsByTagName('head')[0];
	options.onload = options.onload || function () {};
	var isrc;
	function async$$1(srcAsync) {
		function next() {
			if (src instanceof Array && isrc < src.length - 1) {
				isrc++;
				async$$1(src[isrc]);
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
		async$$1(src[isrc]);
	} else async$$1(src);
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
  async: async$1
};

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
var ColorPicker =
function ColorPicker() {
	classCallCheck(this, ColorPicker);
	var _this = this;
	this.paletteIndexes = {
		BGYW: 0,
		monochrome: 1,
		bidirectional: 2,
		rainbow: 3
	};
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
	this.create = function (elSliderWrapper, options) {
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
		var palette = options.palette instanceof this.palette ? options.palette : new this.palette(options);
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
					xmlns: svgNS,
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
	};
	this.palette = function (options) {
		function paletteitem(percent, r, g, b) {
			return {
				percent: percent,
				r: r,
				g: g,
				b: b
			};
		}
		options = options || {};
		if (options.palette === undefined) options.palette = _this.paletteIndexes.BGYW;
		this.getPaletteIndex = function () {
			return options.palette;
		};
		var arrayPalette = [new paletteitem(0, 0x00, 0x00, 0xFF),
		new paletteitem(33, 0x00, 0xFF, 0x00),
		new paletteitem(66, 0xFF, 0xFF, 0x00),
		new paletteitem(100, 0xFF, 0xFF, 0xFF)];
		switch (_typeof(options.palette)) {
			case 'number':
				switch (options.palette) {
					case _this.paletteIndexes.BGYW:
						break;
					case _this.paletteIndexes.monochrome:
						var arrayPalette = [new paletteitem(0, 0x00, 0x00, 0x00),
						new paletteitem(100, 0xFF, 0xFF, 0xFF)];
						break;
					case _this.paletteIndexes.bidirectional:
						var arrayPalette = [new paletteitem(0, 0xff, 0x30, 0x30),
						new paletteitem(50, 0x30, 0x30, 0x30),
						new paletteitem(100, 0x30, 0xFF, 0x30)];
						break;
					case _this.paletteIndexes.rainbow:
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
		this.isPalette = function () {
			return true;
		};
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
			if (isNaN(percent)) {
				percent = max;
			}
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
			var THREE = three$1.THREE;
			if (value instanceof THREE.Color) return value;
			var c = this.hsv2rgb(value, min, max);
			if (c === undefined) c = { r: 255, g: 255, b: 255 };
			return new THREE.Color("rgb(" + c.r + ", " + c.g + ", " + c.b + ")");
		};
	};
};
ColorPicker = new ColorPicker();
var ColorPicker$1 = ColorPicker;

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
function isEnabled() {
	return navigator.cookieEnabled;
}
function set$1(name, value, cookie_date) {
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
	set$1(name, JSON.stringify(object));
}
function get$3(name, defaultValue) {
	if (!isEnabled()) {
		consoleCookieEnabled();
		return;
	}
	var results = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
	if (results) {
		var result = results[2],
		    type = typeof defaultValue === 'undefined' ? 'undefined' : _typeof(defaultValue);
		return type === "number" ?
		result % 1 === 0 ? parseInt(result) : parseFloat(result) : type === "boolean" ?
		result === 'true' ? true : false : unescape(result);
	}
	if (typeof defaultValue == 'undefined') return '';
	return defaultValue;
}
function getObject(name, options, optionsDefault) {
	if (optionsDefault === undefined) optionsDefault = options;
	new defaultCookie().getObject(name, options, copyObject(name, optionsDefault));
}
function copyObject(name, objectDefault) {
	return JSON.parse(get$3(name, JSON.stringify(objectDefault)));
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
var defaultCookie = function defaultCookie(name) {
	classCallCheck(this, defaultCookie);
	this.get = function (defaultValue) {
		return defaultValue;
	};
	this.set = function () {};
	this.getObject = function (name, options, optionsDefault) {
		if (!optionsDefault) return;
		Object.keys(optionsDefault).forEach(function (key) {
			var option = optionsDefault[key];
			if (option !== undefined && typeof option !== 'function') options[key] = JSON.parse(JSON.stringify(option));
		});
	};
	this.copyObject = function (name, objectDefault) {
		return JSON.parse(JSON.stringify(objectDefault));
	};
	this.setObject = function () {};
	this.isTrue = function (defaultValue) {
		return defaultValue;
	};
};



var cookie = Object.freeze({
	isEnabled: isEnabled,
	set: set$1,
	setObject: setObject,
	get: get$3,
	getObject: getObject,
	copyObject: copyObject,
	remove: remove,
	defaultCookie: defaultCookie
});

/**
* node.js version of the cookie.
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
 * @module CreateFullScreenSettings
 * @description creates functions for resize of the canvas to fullscreen and restore to default size.
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
function CreateFullScreenSettings(THREE, renderer, camera, options) {
	var fullScreen = false,
	    canvasMenu,
	    stereoEffect;
	options.fullScreen = options.fullScreen || {};
	if (options.canvasMenu) canvasMenu = options.canvasMenu;
	if (options.stereoEffect) stereoEffect = options.stereoEffect;
	renderer.setSize(renderer.domElement.width, renderer.domElement.height);
	var style;
	this.isFullScreen = function () {
		return fullScreen;
	};
	this.setStereoEffect = function (_stereoEffect) {
		stereoEffect = _stereoEffect;
	};
	this.setFullScreen = function () {
		var fs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
		var boTimeout = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
		setTimeout(function () {
			if (boTimeout && options.fullScreen.arrayContainersLength && options.fullScreen.arrayContainersLength() > 1) fs = true;
			var size = new THREE.Vector2();
			renderer.getSize(size);
			fullScreen = fs;
			if (fullScreen) {
				if (style !== undefined) {
					renderer.setSize(style.sizeOriginal.x, style.sizeOriginal.y);
					renderer.domElement.style.position = style.position;
					renderer.domElement.style.left = style.left;
					renderer.domElement.style.top = style.top;
					renderer.domElement.style.width = style.width;
					renderer.domElement.style.height = style.height;
				}
			} else {
				if (style === undefined) {
					style = {
						sizeOriginal: new THREE.Vector2(),
						position: renderer.domElement.style.position,
						left: renderer.domElement.style.left,
						top: renderer.domElement.style.top,
						width: renderer.domElement.style.width,
						height: renderer.domElement.style.height
					};
					renderer.getSize(style.sizeOriginal);
				}
				renderer.setSize(window.innerWidth, window.innerHeight);
				renderer.domElement.style.position = 'fixed';
				renderer.domElement.style.left = 0;
				renderer.domElement.style.top = 0;
				renderer.domElement.style.width = '100%';
				renderer.domElement.style.height = '100%';
			}
			if (options.fullScreen.onFullScreenToggle !== undefined) options.fullScreen.onFullScreenToggle(fullScreen);
			camera.aspect = size.x / size.y;
			camera.updateProjectionMatrix();
			fullScreen = !fullScreen;
			if (canvasMenu && canvasMenu.setFullScreenButton) canvasMenu.setFullScreenButton(fullScreen);
			CreateFullScreenSettings.RendererSetSize(renderer, options.canvasMenu);
		}, 0);
	};
	this.onclick = function () {
		if (stereoEffect !== undefined && parseInt(stereoEffect.settings.spatialMultiplex) !== StereoEffect.spatialMultiplexsIndexs.Mono) {
			stereoEffect.settings.spatialMultiplex = StereoEffect.spatialMultiplexsIndexs.Mono;
		}
		this.setFullScreen(fullScreen);
		return fullScreen;
	};
}
CreateFullScreenSettings.RendererSetSize = function (renderer, canvasMenu) {
	if (renderer.setSizeOld) return;
	renderer.setSizeOld = renderer.setSize;
	renderer.setSize = function (width, height, updateStyle) {
		renderer.setSizeOld(width, height, updateStyle);
		var elCanvas = renderer.domElement,
		    elContainer = elCanvas.parentElement;
		setTimeout(function () {
			elContainer.style.height = elCanvas.style.height;
			elContainer.style.width = elCanvas.style.width;
			elContainer.style.left = elCanvas.style.left;
			elContainer.style.top = elCanvas.style.top;
			elContainer.style.position = elCanvas.style.position;
			if (canvasMenu) canvasMenu.setSize(width, height);
		}, 0);
	};
};

/**
 * @module SpriteText
 * @description A sprite based text component. Text that always faces towards the camera.
 * @see {@link https://threejs.org/docs/index.html#api/en/objects/Sprite|THREE.Sprite}
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
function SpriteText$1(text, position) {
	var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
	var THREE = three$1.THREE;
	position = position || new THREE.Vector3(0, 0, 0);
	var sprite = new THREE.Sprite(new THREE.SpriteMaterial({
		map: new THREE.Texture(),
		sizeAttenuation: options.sizeAttenuation !== undefined ? options.sizeAttenuation : false
	}));
	var canvas = document.createElement('canvas');
	sprite.material.map.minFilter = THREE.LinearFilter;
	var fontSize = 90;
	var context = canvas.getContext('2d');
	if (options.name) sprite.name = options.name;
	sprite.userData.update = function ()                  {
		var optionsUpdate = {};
		if (sprite.parent) updateOptions(sprite.parent, optionsUpdate);else if (options.group) updateOptions(options.group, optionsUpdate);
		var textHeight = options.textHeight || optionsUpdate.textHeight || 0.04;
		var fov = options.fov || optionsUpdate.fov,
		    sizeAttenuation = options.sizeAttenuation || optionsUpdate.sizeAttenuation || false,
		    rotation = options.rotation || optionsUpdate.rotation || 0,
		    fontFace = options.fontFace || optionsUpdate.fontFace || 'Arial',
		    bold = options.bold || optionsUpdate.bold || false,
		    italic = options.italic || optionsUpdate.italic || false,
		    fontProperties = options.fontProperties || optionsUpdate.fontProperties || '',
		    rect = options.rect || optionsUpdate.rect || {},
		    color = 'rgba(255, 255, 255, 1)',
		    fontColor = options.fontColor || optionsUpdate.fontColor || color,
		    center = SpriteText$1.getCenter(options.center || optionsUpdate.center, position);
		if (fov !== undefined) textHeight = fov * textHeight / 50;
		rect.displayRect = rect.displayRect || false;
		var borderThickness = rect.borderThickness ? rect.borderThickness : 5,
		    font = '' + fontProperties + (bold ? 'bold ' : '') + (italic ? 'italic ' : '') + fontSize + 'px ' + fontFace;
		context.font = font;
		var width = 0,
		    linesCount = 1,
		    lines;
		if (typeof text === 'string') {
			linesCount = 0;
			lines = text.split(/\r\n|\r|\n/);
			lines.forEach(function (line) {
				var lineWidth = context.measureText(line).width;
				if (width < lineWidth) width = lineWidth;
				linesCount += 1;
			});
		} else width = context.measureText(text).width;
		width += borderThickness * 2;
		var textWidth = width;
		canvas.width = textWidth;
		canvas.height = fontSize * linesCount + borderThickness * 2;
		context.font = font;
		if (rect.displayRect) {
			var roundRect = function roundRect(ctx, x, y, w, h, r) {
				ctx.beginPath();
				ctx.moveTo(x + r, y);
				ctx.lineTo(x + w - r, y);
				ctx.quadraticCurveTo(x + w, y, x + w, y + r);
				ctx.lineTo(x + w, y + h - r);
				ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
				ctx.lineTo(x + r, y + h);
				ctx.quadraticCurveTo(x, y + h, x, y + h - r);
				ctx.lineTo(x, y + r);
				ctx.quadraticCurveTo(x, y, x + r, y);
				ctx.closePath();
				ctx.fill();
				ctx.stroke();
			};
			context.fillStyle = rect.backgroundColor ? rect.backgroundColor : 'rgba(0, 0, 0, 1)';
			context.strokeStyle = rect.borderColor ? rect.borderColor : fontColor;
			context.lineWidth = borderThickness;
			roundRect(context, borderThickness / 2, borderThickness / 2, canvas.width - borderThickness, canvas.height - borderThickness, rect.borderRadius === undefined ? 0 : rect.borderRadius);
		}
		context.fillStyle = fontColor;
		context.textBaseline = 'bottom';
		if (linesCount > 1) {
			for (var i = 0; i < lines.length; i++) {
				var line = lines[i];
				context.fillText(line, borderThickness, canvas.height - (lines.length - i - 1) * fontSize - borderThickness);
			}
		} else context.fillText(text, borderThickness, canvas.height - borderThickness);
		sprite.material.map.image = canvas;
		sprite.material.map.needsUpdate = true;
		var th = textHeight * linesCount;
		sprite.scale.set(th * canvas.width / canvas.height, th);
		sprite.position.copy(position);
		sprite.center = center;
		sprite.material.sizeAttenuation = sizeAttenuation;
		sprite.material.rotation = rotation;
		sprite.material.needsUpdate = true;
	};
	sprite.userData.update();
	sprite.userData.updateText = function (_text) {
		text = _text;
		var options = {};
		updateOptions(sprite.parent, options);
		sprite.userData.update(options);
	};
	if (options.group) options.group.add(sprite);else if (three$1.group) three$1.group.add(sprite);else if (three$1.scene) three$1.scene.add(sprite);
	sprite.userData.optionsSpriteText = options;
	return sprite;
}
SpriteText$1.getCenter = function () {
	var center = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	var position = arguments[1];
	var THREE = three$1.THREE;
	var canvas = center.canvas ? center.canvas : undefined;
	function worldToScreen() {
		var width = canvas.width,
		    height = canvas.height,
		    widthHalf = width / 2,
		    heightHalf = height / 2;
		var pos = new THREE.Vector3().copy(position);
		pos.project(center.camera);
		pos.x = pos.x * widthHalf + widthHalf;
		pos.y = -(pos.y * heightHalf) + heightHalf;
		return pos;
	}
	var screenPos = center.canvas ? worldToScreen() : undefined;
	return center instanceof THREE.Vector2 || (typeof center === 'undefined' ? 'undefined' : _typeof(center)) === "object" && center.x !== undefined && center.y !== undefined
	? center : screenPos ? new THREE.Vector2(screenPos.x < canvas.width / 2 ? 0 : 1, screenPos.y < canvas.height / 2 ? 1 : 0) : new THREE.Vector2(0, 1);
};
function updateOptions(group, options) {
	if (group.userData.optionsSpriteText) Object.keys(group.userData.optionsSpriteText).forEach(function (key) {
		if (options[key] === undefined)
			options[key] = group.userData.optionsSpriteText[key];
	});
	while (group.parent) {
		group = group.parent;
		updateOptions(group, options);
	}
}
SpriteText$1.updateSpriteTextGroup = function (group) {
	var THREE = three$1.THREE;
	group.children.forEach(function (spriteItem) {
		if (spriteItem instanceof THREE.Sprite) {
			if (spriteItem.userData.update !== undefined) spriteItem.userData.update();
		}
		SpriteText$1.updateSpriteTextGroup(spriteItem);
	});
};

/**
 * @module StereoEffect
 * @description Uses dual PerspectiveCameras for Parallax Barrier effects.
 * @see About {@link https://en.wikipedia.org/wiki/Parallax_barrier|Parallax barrier}.
 *
 * @author [Andrej Hristoliubov]{@link https://github.com/anhr}
 * @author {@link http://alteredqualia.com/|alteredq}
 * @author {@link http://mrdoob.com/|mrdoob}
 * @author {@link http://aleksandarrodic.com/|arodic}
 * @author {@link http://fonserbc.github.io/|fonserbc}
 *
 * @copyright 2011 Data Arts Team, Google Creative Lab
 *
 * @license under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
*/
var StereoEffect =
function StereoEffect(renderer) {
	var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Options();
	classCallCheck(this, StereoEffect);
	if (!renderer) {
		console.error('StereoEffect: renderer = ' + renderer);
		return;
	}
	if (!options.boOptions) {
		options = new Options(options);
	}
	if (options.stereoEffect === false) return;
	if (options.dat.gui) options.dat.mouseenter = false;
	var THREE = three$1.THREE;
	assign();
	if (!options.stereoEffect) options.stereoEffect = {};
	var settings = options.stereoEffect;
	this.settings = settings;
	this.options = options;
	options.stereoEffect = this;
	if (settings.spatialMultiplex === undefined) settings.spatialMultiplex = spatialMultiplexsIndexs.Mono;
	settings.stereo = new THREE.StereoCamera();
	settings.stereo.aspect = settings.stereoAspect || 1;
	if (settings.far === undefined) settings.far = new THREE.PerspectiveCamera().focus;
	settings.focus = settings.camera === undefined ? new THREE.PerspectiveCamera().focus : new THREE.Vector3().distanceTo(settings.camera.position);
	settings.zeroParallax = 0;
	settings.eyeSep = settings.eyeSep || new THREE.StereoCamera().eyeSep / 10 * settings.far;
	if (settings.camera !== undefined) settings.camera.focus = settings.focus;
	this.setEyeSeparation = function (eyeSep) {
		settings.stereo.eyeSep = eyeSep;
	};
	this.setEyeSeparation(settings.eyeSep);
	this.getRendererSize = function () {
		return Options.raycaster.EventListeners.getRendererSize(renderer, settings.elParent);
	};
	var fullScreenSettings;
	var spatialMultiplexCur;
	this.render = function (scene, camera) {
		var spatialMultiplex = parseInt(settings.spatialMultiplex);
		if (settings.rememberSize && !fullScreenSettings) {
			if (_canvasMenu && _canvasMenu.getFullScreenSettings) fullScreenSettings = _canvasMenu.getFullScreenSettings(this);else fullScreenSettings = new CreateFullScreenSettings(THREE, renderer, camera, {
				canvasMenu: _canvasMenu,
				stereoEffect: this
			});
		}
		scene.updateMatrixWorld();
		if (camera.parent === null) camera.updateMatrixWorld();
		var size = new THREE.Vector2();
		renderer.getSize(size);
		if (renderer.autoClear) renderer.clear();
		renderer.setScissorTest(true);
		var xL, yL, widthL, heightL, xR, yR, widthR, heightR;
		var parallax = settings.zeroParallax;
		function setMultiplex(stereoEffect) {
			if (!fullScreenSettings || spatialMultiplexCur === spatialMultiplex) return false;
			spatialMultiplexCur = spatialMultiplex;
			if (stereoEffect.setControllerSpatialMultiplex) stereoEffect.setControllerSpatialMultiplex(spatialMultiplex);else if (stereoEffect.setSpatialMultiplex) stereoEffect.setSpatialMultiplex(spatialMultiplex);
			return true;
		}
		function setFullScreen(fullScreen, stereoEffect) {
			if (setMultiplex(stereoEffect)) fullScreenSettings.setFullScreen(fullScreen);
		}
		switch (spatialMultiplex) {
			case spatialMultiplexsIndexs.Mono:
				renderer.setScissor(0, 0, size.width, size.height);
				renderer.setViewport(0, 0, size.width, size.height);
				renderer.render(scene, camera);
				renderer.setScissorTest(false);
				if (options.canvasMenu) setMultiplex(this);else setFullScreen(true, this);
				return;
			case spatialMultiplexsIndexs.SbS:
				var _width = size.width / 2;
				xL = 0 + parallax;yL = 0;widthL = _width;heightL = size.height;
				xR = _width - parallax;yR = 0;widthR = _width;heightR = size.height;
				setFullScreen(false, this);
				break;
			case spatialMultiplexsIndexs.TaB:
				xL = 0 + parallax;yL = 0;widthL = size.width;heightL = size.height / 2;
				xR = 0 - parallax;yR = size.height / 2;widthR = size.width;heightR = size.height / 2;
				setFullScreen(false, this);
				break;
			default:
				console.error('THREE.StereoEffect.render: Invalid "Spatial  multiplex" parameter: ' + spatialMultiplex);
		}
		settings.stereo.update(camera);
		renderer.setScissor(xL, yL, widthL, heightL);
		renderer.setViewport(xL, yL, widthL, heightL);
		renderer.render(scene, settings.stereo.cameraL);
		renderer.setScissor(xR, yR, widthR, heightR);
		renderer.setViewport(xR, yR, widthR, heightR);
		renderer.render(scene, settings.stereo.cameraR);
		renderer.setScissorTest(false);
	};
	function getLang(params) {
		params = params || {};
		var _lang = {
			stereoEffects: 'Stereo effects',
			spatialMultiplexName: 'Spatial  multiplex',
			spatialMultiplexTitle: 'Choose a way to do spatial multiplex.',
			spatialMultiplexs: {
				'Mono': spatialMultiplexsIndexs.Mono,
				'Side by side': spatialMultiplexsIndexs.SbS,
				'Top and bottom': spatialMultiplexsIndexs.TaB
			},
			eyeSeparationName: 'Eye separation',
			eyeSeparationTitle: 'The distance between left and right cameras.',
			focus: 'Focus',
			focusTitle: 'Object distance.',
			zeroParallaxName: 'Zero parallax',
			zeroParallaxTitle: 'Distance to objects with zero parallax.',
			defaultButton: 'Default',
			defaultTitle: 'Restore default stereo effects settings.'
		};
		var _languageCode = params.getLanguageCode === undefined ? 'en'
		: params.getLanguageCode();
		switch (_languageCode) {
			case 'ru':
				_lang.stereoEffects = 'Стерео эффекты';
				_lang.spatialMultiplexName = 'Мультиплекс';
				_lang.spatialMultiplexTitle = 'Выберите способ создания пространственного мультиплексирования.';
				_lang.spatialMultiplexs = {
					'Моно': spatialMultiplexsIndexs.Mono,
					'Слева направо': spatialMultiplexsIndexs.SbS,
					'Сверху вниз': spatialMultiplexsIndexs.TaB
				};
				_lang.eyeSeparationName = 'Развод камер';
				_lang.eyeSeparationTitle = 'Расстояние между левой и правой камерами.';
				_lang.focus = 'Фокус';
				_lang.focusTitle = 'Расстояние до объекта.';
				_lang.zeroParallaxName = 'Параллакс 0';
				_lang.zeroParallaxTitle = 'Расстояние до объектов с нулевым параллаксом.';
				_lang.defaultButton = 'Восстановить';
				_lang.defaultTitle = 'Восстановить настройки стерео эффектов по умолчанию.';
				break;
			default:
				if (params.lang === undefined || params.lang._languageCode != _languageCode) break;
				Object.keys(params.lang).forEach(function (key) {
					if (_lang[key] === undefined) return;
					_lang[key] = params.lang[key];
				});
		}
		return _lang;
	}
	this.gui = function () {
		var guiParams = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
		var gui = guiParams.folder || options.dat.gui;
		if (!gui || options.dat.stereoEffectsGui === false) return;
		var dat = guiParams.dat || three$1.dat;
		if (guiParams === undefined) guiParams = {};
		guiParams.scale = guiParams.scale || 1;
		var stereoEffect = options.dat.getCookieName('StereoEffect'),
		    _lang = getLang({ getLanguageCode: options.getLanguageCode, lang: options.lang });
		var optionsDefault = {
			spatialMultiplex: settings.spatialMultiplex,
			eyeSep: new THREE.StereoCamera().eyeSep / 10 * settings.far,
			focus: settings.focus,
			zeroParallax: 0
		};
		Object.freeze(optionsDefault);
		options.dat.cookie.getObject(stereoEffect, settings, optionsDefault);
		settings.spatialMultiplex = parseInt(settings.spatialMultiplex);
		if (this.setSpatialMultiplex) this.setSpatialMultiplex(settings.spatialMultiplex);
		function displayControllers(value) {
			var display = value == spatialMultiplexsIndexs.Mono ? 'none' : 'block';
			_fEyeSeparation.domElement.style.display = display;
			if (_controllerCameraFocus !== undefined) _controllerCameraFocus.__li.style.display = display;
			_controllerDefaultF.__li.style.display = display;
			_controllerZeroParallax.__li.style.display = display;
		}
		var _fStereoEffects = gui.addFolder(_lang.stereoEffects);
		var _controllerSpatialMultiplex = _fStereoEffects.add(settings, 'spatialMultiplex', _lang.spatialMultiplexs).onChange(function (value) {
			value = parseInt(value);
			displayControllers(value);
			setObject(stereoEffect);
			if (guiParams.onChangeMode) guiParams.onChangeMode(value);
			if (menuItemStereoEffect) menuItemStereoEffect.select(value);
		});
		dat.controllerNameAndTitle(_controllerSpatialMultiplex, _lang.spatialMultiplexName, _lang.spatialMultiplexTitle);
		this.setControllerSpatialMultiplex = function (index) {
			saveToCookie = false;
			_controllerSpatialMultiplex.setValue(index);
			saveToCookie = true;
		};
		var _fEyeSeparation = _fStereoEffects.addFolder(_lang.eyeSeparationName);
		dat.folderNameAndTitle(_fEyeSeparation, _lang.eyeSeparationName, _lang.eyeSeparationTitle);
		_fEyeSeparation.add(new PositionController(function (shift) {
			settings.eyeSep += shift;
			_controllerEyeSep.setValue(settings.eyeSep);
		}, { settings: { offset: 0.01 }, min: 0.0001, max: 0.01, step: 0.0001 }));
		var _controllerEyeSep = dat.controllerZeroStep(_fEyeSeparation, settings.stereo, 'eyeSep', function (value) {
			settings.eyeSep = value;
			setObject(stereoEffect);
		});
		dat.controllerNameAndTitle(_controllerEyeSep, _lang.eyeSeparationName, _lang.eyeSeparationTitle);
		if (settings.camera !== undefined) settings.camera.focus = settings.focus;
		var _controllerCameraFocus;
		if (settings.camera) {
			_controllerCameraFocus = _fStereoEffects.add(settings.camera, 'focus', optionsDefault.focus / 10, optionsDefault.focus * 2, optionsDefault.focus / 1000).onChange(function (value) {
				settings.focus = value;
				setObject(stereoEffect);
			});
			dat.controllerNameAndTitle(_controllerCameraFocus, _lang.focus, _lang.focusTitle);
		}
		var _minMax = (60 - 400 / 9) * guiParams.scale + 400 / 9;
		var _controllerZeroParallax = _fStereoEffects.add(settings, 'zeroParallax', -_minMax, _minMax).onChange(function (value) {
			settings.zeroParallax = value;
			setObject(stereoEffect);
		});
		dat.controllerNameAndTitle(_controllerZeroParallax, _lang.zeroParallaxName, _lang.zeroParallaxTitle);
		var _controllerDefaultF = _fStereoEffects.add({
			defaultF: function defaultF(value) {
				settings.stereo.eyeSep = optionsDefault.eyeSep;
				_controllerEyeSep.setValue(settings.stereo.eyeSep);
				if (settings.camera) {
					settings.camera.focus = optionsDefault.focus;
					_controllerCameraFocus.setValue(settings.camera.focus);
				}
				settings.zeroParallax = optionsDefault.zeroParallax;
				_controllerZeroParallax.setValue(settings.zeroParallax);
			}
		}, 'defaultF');
		dat.controllerNameAndTitle(_controllerDefaultF, _lang.defaultButton, _lang.defaultTitle);
		displayControllers(settings.spatialMultiplex);
		var saveToCookie = true;
		function setObject(name) {
			if (!saveToCookie) return;
			var object = {};
			Object.keys(optionsDefault).forEach(function (key) {
				object[key] = settings[key];
			});
			options.dat.cookie.setObject(name, object);
		}
	};
	var _canvasMenu, menuItemStereoEffect;
	this.createCanvasMenuItem = function (canvasMenu, params) {
		_canvasMenu = canvasMenu;
		params = params || {};
		var _lang = getLang({ getLanguageCode: params.getLanguageCode, lang: params.lang }),
		    spatialMultiplexs = Object.keys(_lang.spatialMultiplexs);
		menuItemStereoEffect = {
			name: '⚭',
			title: _lang.stereoEffects,
			id: 'menuButtonStereoEffects',
			drop: 'up',
			items: [{
				name: spatialMultiplexs[spatialMultiplexsIndexs.Mono],
				id: 'menuButtonStereoEffectsMono',
				radio: true,
				checked: settings.spatialMultiplex === spatialMultiplexsIndexs.Mono,
				spatialMultiplex: spatialMultiplexsIndexs.Mono,
				onclick: function onclick(event) {
					settings.spatialMultiplex = spatialMultiplexsIndexs.Mono;
				}
			}, {
				name: spatialMultiplexs[spatialMultiplexsIndexs.SbS],
				id: 'menuButtonStereoEffectsSbS',
				radio: true,
				checked: settings.spatialMultiplex === spatialMultiplexsIndexs.SbS,
				spatialMultiplex: spatialMultiplexsIndexs.SbS,
				onclick: function onclick(event) {
					settings.spatialMultiplex = spatialMultiplexsIndexs.SbS;
				}
			}, {
				name: spatialMultiplexs[spatialMultiplexsIndexs.TaB],
				id: 'menuButtonStereoEffectsTaB',
				radio: true,
				checked: settings.spatialMultiplex === spatialMultiplexsIndexs.TaB,
				spatialMultiplex: spatialMultiplexsIndexs.TaB,
				onclick: function onclick(event) {
					settings.spatialMultiplex = spatialMultiplexsIndexs.TaB;
				}
			}]
		};
		menuItemStereoEffect.select = function (value) {
			menuItemStereoEffect.items.forEach(function (item) {
				if (item.spatialMultiplex === value) {
					if (!item.checked) item.elName.onclick({ target: item.elName });
				}
			});
		};
		this.setSpatialMultiplex = function (index) {
			menuItemStereoEffect.select(index);
		};
		canvasMenu.menu.push(menuItemStereoEffect);
	};
};

StereoEffect.spatialMultiplexsIndexs = {
	Mono: 0,
	SbS: 1,
	TaB: 2
};
Object.freeze(StereoEffect.spatialMultiplexsIndexs);
var spatialMultiplexsIndexs = StereoEffect.spatialMultiplexsIndexs;
function assign() {
	var THREE = three$1.THREE;
	if (new THREE.Raycaster().setStereoEffect) return;
	Object.assign(THREE.Raycaster.prototype, {
		setStereoEffect: function setStereoEffect() {
			var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
			if (settings.stereoEffect === false) return;
			settings.raycasterEvents = settings.raycasterEvents === undefined ? true : settings.raycasterEvents;
			var camera = settings.camera,
			    renderer = settings.renderer;
			if (settings.raycasterEvents) {
				var _mouse = new THREE.Vector2();
				window.addEventListener('mousemove', function (event) {
					_mouse.x = event.clientX / window.innerWidth * 2 - 1;
					_mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
					raycaster.setFromCamera(_mouse, camera);
					raycaster.stereo.onDocumentMouseMove(event);
				}, false);
				window.addEventListener('pointerdown', function (event) {
					raycaster.stereo.onDocumentMouseDown(event);
				}, false);
			}
			var stereoEffect = settings.stereoEffect !== undefined ? settings.stereoEffect : typeof effect !== 'undefined' ? effect : new StereoEffect(renderer, settings.options),
			    raycaster = this,
			    mouseL = new THREE.Vector2(),
			    mouseR = new THREE.Vector2();
			var particles,
			mouse;
			function getMousePosition() {
				stereoEffect.getRendererSize().getMousePosition(mouse, event);
				function mousePosition(vectorName, b) {
					mouseL.copy(mouse);
					mouseR.copy(mouse);
					var a = 0.5;
					mouseL[vectorName] += a;
					mouseL[vectorName] *= 2;
					mouseR[vectorName] -= a;
					mouseR[vectorName] *= 2;
					var size = new THREE.Vector2();
					renderer.getSize(size);
					var zeroParallax = stereoEffect.settings.zeroParallax / size.x * b;
					mouseL.x -= zeroParallax;
					mouseR.x += zeroParallax;
				}
				switch (parseInt(stereoEffect.settings.spatialMultiplex)) {
					case spatialMultiplexsIndexs.Mono:
						return;
					case spatialMultiplexsIndexs.SbS:
						mousePosition('x', 4);
						break;
					case spatialMultiplexsIndexs.TaB:
						mousePosition('y', 2);
						break;
					default:
						console.error('THREE.Raycaster.setStereoEffect.getMousePosition: Invalid effect.settings.spatialMultiplex = ' + effect.settings.spatialMultiplex);
						return;
				}
			}
			function intersection(optionsIntersection) {
				if (mouse === undefined) return;
				optionsIntersection = optionsIntersection || settings;
				function isIntersection() {
					Options.raycaster.intersectionsInOut(particles, raycaster, renderer, mouse, settings);
				}
				if (parseInt(stereoEffect.settings.spatialMultiplex) !== spatialMultiplexsIndexs.Mono) {
					var mouseCur = mouse;
					mouse = mouseL;
					raycaster.setFromCamera(mouseL, camera);
					if (!isIntersection()) {
						mouse = mouseR;
						raycaster.setFromCamera(mouseR, camera);
						isIntersection();
					}
					mouse = mouseCur;
					return;
				}
				raycaster.setFromCamera(mouse, camera);
				isIntersection();
			}
			this.stereo = {
				onDocumentMouseMove: function onDocumentMouseMove(event) {
					if (particles === undefined) return;
					event.preventDefault();
					if (mouse === undefined) mouse = new THREE.Vector2();
					getMousePosition();
					intersection();
				},
				isAddedToParticles: function isAddedToParticles(particle) {
					if (!particles) return false;
					return particles.includes(particle);
				},
				addParticle: function addParticle(particle) {
					if (particles === undefined) particles = [];
					if (this.isAddedToParticles(particle)) {
						console.error('Duplicate particle "' + particle.name + '"');
						return;
					}
					particles.push(particle);
				},
				addParticles: function addParticles(newParticles) {
					if (particles !== undefined) {
						if (!Array.isArray(particles)) {
							var particlesCur = particles;
							particles = [];
							particles.push(particlesCur);
						}
						particles.push(newParticles);
						return;
					}
					particles = newParticles;
				},
				removeParticle: function removeParticle(particle) {
					for (var i = 0; i < particles.length; i++) {
						if (Object.is(particle, particles[i])) {
							particles.splice(i, 1);
							break;
						}
					}
				},
				removeParticles: function removeParticles() {
					particles = undefined;
				},
				getPosition: function getPosition(intersection) {
					var attributesPosition = intersection.object.geometry.attributes.position;
					var position = attributesPosition.itemSize >= 4 ? new THREE.Vector4(0, 0, 0, 0) : new THREE.Vector3();
					if (intersection.index !== undefined) {
						position.fromArray(attributesPosition.array, intersection.index * attributesPosition.itemSize);
						position.multiply(intersection.object.scale);
						position.add(intersection.object.position);
					} else position = intersection.object.position;
					return position;
				}
			};
		}
	});
}
StereoEffect.assign = assign;
var lang = {
	mesh: 'Mesh',
	pointName: 'Point Name',
	color: 'Сolor',
	opacity: 'Opacity'
};
switch (getLanguageCode()) {
	case 'ru':
		lang.mesh = '3D объект';
		lang.pointName = 'Имя точки';
		lang.color = 'Цвет';
		lang.opacity = 'Непрозрачность';
		break;
}
StereoEffect.getTextIntersection = function (intersection, options) {
	var spriteText = Options.findSpriteTextIntersection(options.spriteOptions.group);
	if (spriteText) return spriteText;
	var THREE = three$1.THREE;
	var position = getObjectPosition(intersection.object, intersection.index),
	    scales = options.scales || {},
	    isArrayFuncs = intersection.index !== undefined && intersection.object.userData.player !== undefined && intersection.object.userData.player.arrayFuncs !== undefined,
	    funcs = !isArrayFuncs ? undefined : intersection.object.userData.player.arrayFuncs,
	    func = funcs === undefined || typeof funcs === "function" ? undefined : funcs[intersection.index],
	    pointName = isArrayFuncs && func ? func.name : undefined,
	    color = !isArrayFuncs || func === undefined ? undefined : Array.isArray(func.w) ? Player.execFunc(func, 'w', group.userData.t, options) :
	func.w;
	if (intersection.object.userData.onIntersection) intersection.object.userData.onIntersection();
	var boXYZ = !scales.x && !scales.y && !scales.z;
	options.spriteOptions.name = Options.findSpriteTextIntersection.spriteTextIntersectionName;
	options.spriteOptions.name = Options.findSpriteTextIntersection.spriteTextIntersectionName;
	return new SpriteText$1(
	lang.mesh + ': ' + (intersection.object.name === '' ? intersection.object.type : intersection.object.name) + (pointName === undefined ? '' : '\n' + lang.pointName + ': ' + pointName) + (!boXYZ && !scales.x || scales.x && !scales.x.isAxis() ? '' : '\n' + (scales.x && scales.x.name || scales.x.name === 0 ? scales.x.name : 'X') + ': ' + position.x) + (!boXYZ && !scales.y || scales.y && !scales.y.isAxis() ? '' : '\n' + (scales.y && scales.y.name || scales.y.name === 0 ? scales.y.name : 'Y') + ': ' + position.y) + (!boXYZ && !scales.z || scales.z && !scales.z.isAxis() ? '' : '\n' + (scales.z && scales.z.name || scales.z.name === 0 ? scales.z.name : 'Z') + ': ' + position.z) + (
	!isArrayFuncs ? '' : funcs[intersection.index] instanceof THREE.Vector4 || funcs[intersection.index] instanceof THREE.Vector3 || typeof funcs === "function" ? color instanceof THREE.Color ? '\n' + lang.color + ': ' + new THREE.Color(color.r, color.g, color.b).getHexString() : position.w !== undefined ? '\n' + (scales.w && scales.w.name ? scales.w.name : 'W') + ': ' + position.w : '' : '') + (
	intersection.object.geometry.attributes.ca === undefined || intersection.object.geometry.attributes.ca.itemSize < 4 ? '' : '\n' + lang.opacity + ': ' + new THREE.Vector4().fromArray(intersection.object.geometry.attributes.ca.array, intersection.index * intersection.object.geometry.attributes.ca.itemSize).w) + (
	intersection.object.userData.raycaster && intersection.object.userData.raycaster.text ? intersection.object.userData.raycaster.text(intersection                                                    ) : ''), intersection.pointSpriteText ? intersection.pointSpriteText : intersection.point,
	options.spriteOptions);
};

/**
 * View and edit some parameters on the web page.
 *
 * @author [Andrej Hristoliubov]{@link https://github.com/anhr}
 * Thanks to https://stackoverflow.com/a/11900218/5175935
 *
 * @copyright 2011 Data Arts Team, Google Creative Lab
 *
 * @license under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */
function createController(settings, controllerId, name, options) {
	if (!settings) return;
	if (typeof settings.controller === "string") {
		var id = settings.controller;
		settings.controller = document.getElementById(settings.controller);
		if (!settings.controller) console.warn('createController: invalid settings.controller = "' + id + '"');
	}
	if (!settings.controller) {
		if (settings.controller === null) console.warn('createController: invalid settings.controller = ' + settings.controller);
		var controller = document.getElementById(controllerId);
		if (!controller) {
			controller = document.createElement(options.elementName ? options.elementName : 'input');
			document.querySelector('body').appendChild(controller);
		}
		settings.controller = controller;
	}
	function setControllerValue(value) {
		if (settings.controller.value !== undefined) settings.controller.value = value;
		else settings.controller.innerHTML = value;
	}
	if (options.value !== undefined) setControllerValue(options.value);
	if (options.onchange !== undefined && settings.controller.onchange === null) settings.controller.onchange = options.onchange;
	if (options.title !== undefined && settings.controller.title === '') settings.controller.title = options.title;
	if (settings.elSlider) {
		if (typeof settings.elSlider === "string") {
			var _id = settings.elSlider;
			settings.elSlider = document.getElementById(settings.elSlider);
			if (!settings.elSlider) console.warn('createController: invalid settings.elSlider = "' + _id + '"');
		}
		if (!settings.elSlider || settings.elSlider === true) {
			if (options.axisName) settings.elSlider = document.getElementById(options.axisName + 'Slider');
			if (!settings.elSlider) {
				settings.elSlider = document.createElement('div');
				if (settings.controller) settings.controller.parentElement.appendChild(settings.elSlider);else document.querySelector('body').appendChild(settings.elSlider);
			}
		}
		settings.boSetValue = true;
		if (!settings.colorpicker) {
			settings.colorpicker = ColorPicker$1.create(settings.elSlider, {
				duplicate: true,
				sliderIndicator: {
					callback: function callback(c) {
						if (settings.boSetValue || !settings.controller) return;
						var value = c.percent / 100;
						settings.controller.onchange({ currentTarget: { value: value } });
						settings.controller.value = value;
					},
					value: options.value * 100
				},
				style: {
					border: '1px solid black',
					width: settings.controller.clientWidth + 'px',
					height: settings.controller.clientHeight + 'px'
				},
				onError: function onError(message) {
					alert('Horizontal Colorpicker with slider indicator error: ' + message);
				}
			});
		}
		if (options.value !== undefined) {
			var value = options.value * 100;
			if (value < 0) value = 0;
			if (value > 100) value = 100;
			settings.boSetValue = true;
			settings.colorpicker.setValue(value);
			settings.boSetValue = false;
		}
	}
	if (settings.elName === false) return;
	if (settings.elName === null) console.warn('createController: invalid settings.elName = ' + settings.elName);
	if (typeof settings.elName === "string") {
		var _id2 = settings.elName;
		settings.elName = document.getElementById(settings.elName);
		if (!settings.elName) console.warn('createController: invalid settings.elName = "' + _id2 + '"');
	}
	var str = '';
	if (!settings.elName) {
		if (options.axisName) settings.elName = document.getElementById(options.axisName + 'Name');
		if (!settings.elName) {
			settings.elName = document.createElement('span');
			settings.controller.parentElement.insertBefore(settings.elName, settings.controller);
			str = ' = ';
		}
	}
	if (settings.elName.innerHTML !== '') return;
	settings.elName.innerHTML = name() + str;
}

/**
 * options of the canvas
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
var boCreateControllers;
var Options =
function Options(options) {
			var _Object$definePropert;
			classCallCheck(this, Options);
			var _this = this;
			options = options || {};
			if (options.boOptions) return options;
			var lang;
			if (options.a === undefined) options.a = 1;
			if (options.b === undefined) options.b = 0;
			this.setW = function (optionsCur) {
						optionsCur = optionsCur || options;
						optionsCur.scales = optionsCur.scales || {};
						var scale = optionsCur.scales.w;
						if (!optionsCur.palette) _this.setPalette();
			};
			options.scales = options.scales || {};
			var boCreateScale = !options.scales.x && !options.scales.y && !options.scales.z;
			function setScale(axisName) {
						if (boCreateScale) options.scales[axisName] = options.scales[axisName] || {};
						if (!options.scales[axisName]) return;
			}
			setScale('x');
			setScale('y');
			setScale('z');
			options.point = options.point || {};
			if (options.point.size === undefined) options.point.size = 5.0;
			options.point.sizePointsMaterial = options.point.sizePointsMaterial || 100.0;
			this.setPalette = function (palette) {
						if (palette) options.palette = palette;else if (!options.palette) options.palette = new ColorPicker$1.palette();
			};
			this.createOrbitControls = function (camera, renderer, scene) {
						if (options.orbitControls === false) return;
						var settings = options.orbitControls || {};
						_this.orbitControls = new three$1.OrbitControls(camera, renderer.domElement);
						if (settings.enableRotate !== undefined) _this.orbitControls.enableRotate = settings.enableRotate;
						_this.orbitControls.target.set(scene.position.x * 2, scene.position.y * 2, scene.position.z * 2);
						_this.orbitControls.saveState();
						_this.orbitControls.update();
						if (_this.frustumPoints) _this.orbitControls.addEventListener('change', function () {
									_this.frustumPoints.onChangeControls();
						});
			};
			this.restoreSceneController = function (camera, scene) {
						if (!three$1.dat || options.dat === false)
									return;
						var lang = {
									defaultButton: 'Default',
									defaultTitle: 'Reset player and restore camera position.'
						};
						switch (this.getLanguageCode()) {
									case 'ru':
												lang.defaultButton = 'Восстановить';
												lang.defaultTitle = 'Восстановить положение камеры и проигрывателя.';
												break;
						}
						var scenePosition = new three$1.THREE.Vector3().copy(scene.position),
						    cameraPosition = new three$1.THREE.Vector3().copy(camera.position);
						three$1.dat.controllerNameAndTitle(options.dat.gui.add({
									defaultF: function defaultF(value) {
												if (options.player) options.player.selectScene(options.playerOptions.selectSceneIndex);
												camera.position.copy(cameraPosition);
												scene.position.copy(scenePosition);
												if (options.orbitControls !== false) {
															options.orbitControls.target = new three$1.THREE.Vector3();
															options.orbitControls.object.position.copy(camera.position);
															options.orbitControls.update();
												}
									}
						}, 'defaultF'), lang.defaultButton, lang.defaultTitle);
			};
			Object.defineProperties(this, (_Object$definePropert = {
						playerOptions: {
									get: function get$$1() {
												options.playerOptions = options.playerOptions || {};
												var playerOptions = options.playerOptions;
												playerOptions.min = playerOptions.min || 0;
												if (playerOptions.max === Infinity) playerOptions.max = null;
												if (playerOptions.max !== null) {
															if (playerOptions.max === undefined) playerOptions.max = 1;
															playerOptions.marks = playerOptions.marks || 10;
												} else playerOptions.marks = null;
												if (playerOptions.max === null) playerOptions.dt = playerOptions.dt || 0.1;else playerOptions.dt = (playerOptions.max - playerOptions.min) / (playerOptions.marks - 1);
												playerOptions.repeat = playerOptions.repeat || false;
												playerOptions.interval = playerOptions.interval || 1;
												playerOptions.zoomMultiplier = playerOptions.zoomMultiplier || 1.1;
												playerOptions.offset = playerOptions.offset || 0.1;
												playerOptions.name = playerOptions.name || '';
												if (!playerOptions.cameraTarget) {
															var cameraTarget = new Player$1.cameraTarget();
															Object.defineProperties(playerOptions, {
																		cameraTarget: {
																					get: function get$$1() {
																								return cameraTarget;
																					}
																		}
															});
												}
												return options.playerOptions;
									},
									set: function set$$1(playerOptions) {
												options.playerOptions = playerOptions;
									}
						},
						a: {
									get: function get$$1() {
												return options.a;
									}
						},
						b: {
									get: function get$$1() {
												return options.b;
									}
						},
						dat: {
									get: function get$$1() {
												var Dat =
												function Dat(dat) {
															classCallCheck(this, Dat);
															dat = dat || {};
															if (dat.boDat) return dat;
															function guiParent() {
																		var elMyGuiContainer = document.createElement('div');
																		dat.parent.appendChild(elMyGuiContainer);
																		elMyGuiContainer.appendChild(dat.gui.domElement);
																		elMyGuiContainer.style.position = 'absolute';
																		elMyGuiContainer.style.top = '0px';
																		elMyGuiContainer.style.right = '0px';
															}
															Object.defineProperties(this, {
																		boDat: {
																					get: function get$$1() {
																								return true;
																					}
																		},
																		dat: {
																					get: function get$$1() {
																								console.warn('get dat depreacated. Use three.dat = dat.');
																								return three$1.dat;
																					},
																					set: function set$$1(dat) {
																								console.warn('Set dat depreacated. Use three.dat = dat.');
																								if (dat.dat && dat.dat.constructor.name === dat.constructor.name && dat.dat.constructor.name !== 'Object') console.error('duplicate dat.');
																								dat.dat = dat;
																					}
																		},
																		cookieName: {
																					get: function get$$1() {
																								return dat.cookieName;
																					}
																		},
																		gui: {
																					get: function get$$1() {
																								if (!dat.gui && three$1.dat) {
																											dat.gui = new three$1.dat.GUI();
																											if (options.dat.parent) {
																														guiParent();
																											}
																								}
																								return dat.gui;
																					}
																		},
																		cookie: {
																					get: function get$$1() {
																								return dat.cookie;
																					},
																					set: function set$$1(cookie$$1) {
																								dat.cookie = cookie$$1;
																					}
																		},
																		guiSelectPoint: {
																					get: function get$$1() {
																								return dat.guiSelectPoint;
																					},
																					set: function set$$1(guiSelectPoint) {
																								dat.guiSelectPoint = guiSelectPoint;
																					}
																		},
																		cameraGui: {
																					get: function get$$1() {
																								return dat.cameraGui;
																					},
																					set: function set$$1(cameraGui) {
																								dat.cameraGui = cameraGui;
																					}
																		},
																		playerGui: {
																					get: function get$$1() {
																								return dat.playerGui;
																					}
																		},
																		orbitControlsGui: {
																					get: function get$$1() {
																								return dat.orbitControlsGui;
																					}
																		},
																		axesHelperGui: {
																					get: function get$$1() {
																								return dat.axesHelperGui;
																					}
																		},
																		playController: {
																					get: function get$$1() {
																								return dat.playController;
																					}
																		},
																		stereoEffectsGui: {
																					get: function get$$1() {
																								return dat.playController;
																					}
																		},
																		moveScene: {
																					get: function get$$1() {
																								return dat.moveScene;
																					}
																		},
																		spriteTextGui: {
																					get: function get$$1() {
																								return dat.spriteTextGui;
																					}
																		},
																		folderPoint: {
																					get: function get$$1() {
																								return dat.folderPoint;
																					},
																					set: function set$$1(folderPoint) {
																								dat.folderPoint = folderPoint;
																					}
																		},
																		pointLightGui: {
																					get: function get$$1() {
																								return dat.pointLightGui;
																					}
																		},
																		parent: {
																					get: function get$$1() {
																								return dat.parent;
																					}
																		}
															});
															for (var propertyName in dat) {
																		if (this[propertyName] === undefined) console.error('Dat: dat.' + propertyName + ' key is hidden');
															}
												};
												if (options.dat === false) return options.dat;
												options.dat = new Dat(options.dat);
												if (options.dat.gui) {
															setTimeout(function () {
																		var className = options.dat.gui.domElement.className;
																		var guiCount = 0;
																		options.dat.gui.domElement.parentElement.childNodes.forEach(function (node) {
																					if (node.className === className) guiCount++;
																		});
																		if (guiCount > 1) console.error('Options: duplicate dat.GUI');
															}, 0);
															options.dat.gui.domElement.addEventListener('mouseenter', function (event) {
																		options.dat.mouseenter = true;
															});
															options.dat.gui.domElement.addEventListener('mouseleave', function (event) {
																		options.dat.mouseenter = false;
															});
												}
												if (options.dat.cookie === false) options.dat.cookie = new cookie.defaultCookie();else if (options.dat.cookie === undefined) options.dat.cookie = cookie;
												options.dat.getCookieName = function () {
															var cookieName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
															var name = options.dat.cookieName || (options.elContainer ? _typeof(options.elContainer) === "object" ? options.elContainer.id : typeof options.elContainer === "string" ? options.elContainer : '' : '');
															return cookieName + (cookieName !== '' && name !== '' ? '_' : '') + name;
												};
												return options.dat;
									},
									set: function set$$1(dat) {
												options.dat = dat;
									}
						},
						getLanguageCode: {
									get: function get$$1() {
												if (typeof options.getLanguageCode === "string") return function () {
															return options.getLanguageCode;
												};
												return options.getLanguageCode || getLanguageCode;
									}
						},
						scales: {
									get: function get$$1() {
												var Scales =
												function Scales(scales) {
															classCallCheck(this, Scales);
															var Scale =
															function Scale(scales, axisName) {
																		classCallCheck(this, Scale);
																		var scale = scales[axisName];
																		this.isAxis = function () {
																					if (!scales || !scales.x && !scales.y && !scales.z || scale) return true;
																					return false;
																		};
																		var setScale = function setScale(callBack) {
																					if (!scale) {
																								scales[axisName] = {};
																								scale = scales[axisName];
																					}
																					callBack();
																					scale.step = Math.abs(options.scales.w.min - options.scales.w.max) / 100;
																					if (options.guiSelectPoint) options.guiSelectPoint.setAxisControl('w', scale);
																		};
																		Object.defineProperties(this, {
																					boScale: {
																								get: function get$$1() {
																											return true;
																								}
																					},
																					min: {
																								get: function get$$1() {
																											if (!scale || !scale.min) return axisName === 'w' ? 0 : -1;
																											return scale.min;
																								},
																								set: function set$$1(min) {
																											setScale(function () {
																														scale.min = min;
																											});
																								}
																					},
																					max: {
																								get: function get$$1() {
																											if (!scale || !scale.max) return axisName === 'w' ? new three$1.THREE.Vector4().w : 1;
																											return scale.max;
																								},
																								set: function set$$1(max) {
																											setScale(function () {
																														scale.max = max;
																											});
																								}
																					},
																					name: {
																								get: function get$$1() {
																											if (!scale || scale.name === undefined) return axisName;
																											return scale.name;
																								},
																								set: function set$$1(name) {
																											if (scale) {
																														scale.name = name;
																														if (options.guiSelectPoint) options.guiSelectPoint.setAxisName(axisName, name);
																											}
																								}
																					},
																					marks: {
																								get: function get$$1() {
																											if (!scale) return undefined;
																											if (!scale.marks) scale.marks = 3;
																											return scale.marks;
																								}
																					}
																		});
																		for (var propertyName in scale) {
																					if (this[propertyName] === undefined) console.error('Options.Scales: scale.' + propertyName + ' key is hidden');
																		}
															};
															var scalesObject = {
																		x: new Scale(options.scales, 'x'),
																		y: new Scale(options.scales, 'y'),
																		z: new Scale(options.scales, 'z'),
																		w: new Scale(options.scales, 'w')
															};
															Object.defineProperties(this, {
																		boScales: {
																					get: function get$$1() {
																								return true;
																					}
																		},
																		x: {
																					get: function get$$1() {
																								return scalesObject.x;
																					},
																					set: function set$$1(x) {
																								if (x === undefined) {
																											delete scales.x;
																											delete scalesObject.x;
																											scalesObject.x = new Scale(scales, 'x');
																								} else scales.x = x;
																								if (options.guiSelectPoint) options.guiSelectPoint.updateScale('x');
																					}
																		},
																		y: {
																					get: function get$$1() {
																								return scalesObject.y;
																					},
																					set: function set$$1(y) {
																								if (y === undefined) {
																											delete scales.y;
																											delete scalesObject.y;
																											scalesObject.y = new Scale(scales, 'y');
																								} else scales.y = y;
																								if (options.guiSelectPoint) options.guiSelectPoint.updateScale('y');
																					}
																		},
																		z: {
																					get: function get$$1() {
																								return scalesObject.z;
																					},
																					set: function set$$1(z) {
																								if (z === undefined) {
																											delete scales.z;
																											delete scalesObject.z;
																											scalesObject.z = new Scale(scales, 'z');
																								} else scales.z = z;
																								if (options.guiSelectPoint) options.guiSelectPoint.updateScale('z');
																					}
																		},
																		w: {
																					get: function get$$1() {
																								return scalesObject.w;
																					},
																					set: function set$$1(w) {
																								scales.w = w;
																					}
																		},
																		setW: {
																					get: function get$$1() {
																								return _this.setW;
																					}
																		},
																		display: {
																					get: function get$$1() {
																								if (scales.display === undefined) scales.display = true;
																								return scales.display;
																					},
																					set: function set$$1(display) {
																								scales.display = display;
																					}
																		},
																		text: {
																					get: function get$$1() {
																								if (scales.text === undefined) scales.text = {};
																								return scales.text;
																					},
																					set: function set$$1(text) {
																								scales.text = text;
																					}
																		},
																		posAxesIntersection: {
																					get: function get$$1() {
																								return scales.posAxesIntersection;
																					},
																					set: function set$$1(posAxesIntersection) {
																								scales.posAxesIntersection = posAxesIntersection;
																					}
																		}
															});
															for (var propertyName in scales) {
																		if (this[propertyName] === undefined) console.error('Options: scales.' + propertyName + ' key is hidden');
															}
												};
												if (!options.scales.boScales) options.scales = new Scales(options.scales);
												return options.scales;
									},
									set: function set$$1(scales) {
												options.scales = scales;
									}
						},
						palette: {
									get: function get$$1() {
												if (options.palette === undefined) options.palette = true;
												switch (_typeof(options.palette)) {
															case 'number':
																		options.palette = new ColorPicker$1.palette({ palette: options.palette });
																		break;
															case 'boolean':
																		if (options.palette) options.palette = new ColorPicker$1.palette();
																		break;
															case 'string':
																		var color = new three$1.THREE.Color(options.palette);
																		options.palette = new ColorPicker$1.palette({ palette: [{ percent: 0, r: color.r * 255, g: color.g * 255, b: color.b * 255 }] });
																		break;
															default:
																		{
																					if (Array.isArray(options.palette)) options.palette = new ColorPicker$1.palette({ palette: options.palette });
																					else if (!options.palette.isPalette()) console.error('MyThree: invalid typeof options.palette: ' + _typeof(options.palette));
																		}
												}
												return options.palette;
									}
						},
						boOptions: {
									get: function get$$1() {
												return true;
									}
						},
						point: {
									get: function get$$1() {
												return {
															get size() {
																		return options.point.size;
															},
															set size(size) {
																		if (options.point.size === size) return;
																		options.point.size = size;
																		if (options.dat && options.dat.folderPoint) options.dat.folderPoint.size.setValue(size);
															},
															get sizePointsMaterial() {
																		return options.point.sizePointsMaterial;
															},
															set sizePointsMaterial(sizePointsMaterial) {
																		options.point.sizePointsMaterial = sizePointsMaterial;
															}
												};
									}
						},
						spriteText: {
									get: function get$$1() {
												if (options.spriteText) return options.spriteText;
												return {};
									}
						},
						raycaster: {
									get: function get$$1() {
												if (options.raycaster) return options.raycaster;
									},
									set: function set$$1(raycaster) {
												options.raycaster = raycaster;
									}
						},
						camera: {
									get: function get$$1() {
												options.camera = options.camera || {};
												if (!options.camera.position) options.camera.position = new three$1.THREE.Vector3(0.4, 0.4, 2);
												if (!options.camera.scale) options.camera.scale = new three$1.THREE.Vector3(1, 1, 1);
												return options.camera;
									},
									set: function set$$1(camera) {
												options.camera = camera;
									}
						},
						cameraTarget: {
									get: function get$$1() {
												return options.cameraTarget;
									}
						},
						elContainer: {
									get: function get$$1() {
												return options.elContainer;
									}
						},
						canvasMenu: {
									get: function get$$1() {
												return options.canvasMenu;
									},
									set: function set$$1(canvasMenu) {
												if (options.canvasMenu && options.canvasMenu !== true && options.canvasMenu !== false) console.warn('Duplicate canvasMenu');
												options.canvasMenu = canvasMenu;
									}
						},
						canvas: {
									get: function get$$1() {
												if (options.canvas) return options.canvas;
												return { fullScreen: true };
									}
						},
						frustumPoints: {
									get: function get$$1() {
												return options.frustumPoints;
									},
									set: function set$$1(frustumPoints) {
												if (options.frustumPoints && options.frustumPoints.constructor.name === frustumPoints.constructor.name && options.frustumPoints.constructor.name !== 'Object') console.error('duplicate frustumPoints.');
												options.frustumPoints = frustumPoints;
									}
						},
						stereoEffect: {
									get: function get$$1() {
												return options.stereoEffect;
									},
									set: function set$$1(stereoEffect) {
												if (options.stereoEffect && options.stereoEffect.constructor.name === stereoEffect.constructor.name && options.stereoEffect.constructor.name !== 'Object') console.error('duplicate stereoEffect.');
												options.stereoEffect = stereoEffect;
									}
						},
						player: {
									get: function get$$1() {
												return options.player;
									},
									set: function set$$1(player) {
												if (options.player) console.error('duplicate player.');
												options.player = player;
									}
						},
						time: {
									get: function get$$1() {
												if (options.player) return options.player.getTime();
												return 0;
									}
						},
						axesHelper: {
									get: function get$$1() {
												return options.axesHelper;
									},
									set: function set$$1(axesHelper) {
												if (options.axesHelper) console.error('duplicate axesHelper.');
												options.axesHelper = axesHelper;
									}
						}
			}, defineProperty(_Object$definePropert, 'canvasMenu', {
						get: function get$$1() {
									return options.canvasMenu;
						},
						set: function set$$1(canvasMenu) {
									if (options.canvasMenu) console.error('duplicate canvasMenu.');
									options.canvasMenu = canvasMenu;
						}
			}), defineProperty(_Object$definePropert, 'orbitControls', {
						get: function get$$1() {
									return options.orbitControls;
						},
						set: function set$$1(orbitControls) {
									if (options.orbitControls && options.orbitControls.constructor.name === orbitControls.constructor.name && options.orbitControls.constructor.name !== 'Object') console.error('duplicate orbitControls.');
									options.orbitControls = orbitControls;
						}
			}), defineProperty(_Object$definePropert, 'scale', {
						get: function get$$1() {
									return 1;
						}
			}), defineProperty(_Object$definePropert, 'pointLight', {
						get: function get$$1() {
									return options.pointLight;
						}
			}), defineProperty(_Object$definePropert, 'cameraTarget', {
						get: function get$$1() {
									return options.cameraTarget;
						}
			}), defineProperty(_Object$definePropert, 'eventListeners', {
						get: function get$$1() {
									if (options.eventListeners) return options.eventListeners;
						},
						set: function set$$1(eventListeners) {
									if (options.eventListeners) console.error('duplicate eventListeners.');
									options.eventListeners = eventListeners;
						}
			}), defineProperty(_Object$definePropert, 'guiSelectPoint', {
						get: function get$$1() {
									return options.guiSelectPoint;
						},
						set: function set$$1(guiSelectPoint) {
									if (options.guiSelectPoint && guiSelectPoint != undefined) console.error('duplicate guiSelectPoint.');
									options.guiSelectPoint = guiSelectPoint;
						}
			}), defineProperty(_Object$definePropert, 'controllers', {
						get: function get$$1() {
									var Controllers =
									function Controllers(controllers) {
												classCallCheck(this, Controllers);
												controllers = controllers || {};
												Object.defineProperties(this, {
															boControllers: {
																		get: function get$$1() {
																					return true;
																		}
															},
															t: {
																		get: function get$$1() {
																					if (controllers.t === null) console.error('options.controllers.t = ' + controllers.t);
																					var elTime = document.getElementById('time');
																					if (!controllers.t) {
																								if (!elTime) return;
																								controllers.t = { elName: document.getElementById('tName') };
																					}
																					if (!controllers.t.controller && elTime) controllers.t.controller = elTime;
																					if (controllers.t) {
																								createController(controllers.t, 't', function () {
																											return options.playerOptions && options.playerOptions.name ? options.playerOptions.name : 't';
																								}, {
																											onchange: function onchange(event) {
																														if (!options.player) {
																																	console.error('options.controllers.t.onchange: create Player instance first. ' + controllers.t.value);
																																	return;
																														}
																														if (options.player.setTime(controllers.t.controller.value) === false) {
																																	alert(lang.timeAlert + controllers.t.controller.value);
																																	controllers.t.controller.focus();
																														}
																											}
																								});
																								if (typeof lang !== 'undefined' && controllers.t.controller.title === '') controllers.t.controller.title = lang.controllerTTitle;
																					}
																					return controllers.t;
																		}
															},
															player: {
																		get: function get$$1() {
																					return controllers.player;
																		}
															}
												});
												for (var propertyName in controllers) {
															if (this[propertyName] === undefined) console.error('Controllers: controllers.' + propertyName + ' key is hidden');
												}
									};
									if (boCreateControllers === undefined) {
												boCreateControllers = true;
												var time = document.getElementById('time'),
												    prev = document.getElementById('prev'),
												    play = document.getElementById('play'),
												    next = document.getElementById('next'),
												    boPlayer = prev || play || next ? true : false,
												    boControllers = time || boPlayer ? true : false;
												if (!options.controllers && boControllers) {
															options.controllers = { t: {} };
															if (time) options.controllers.t.controller = time;
												}
												if (options.controllers) {
															if (!options.controllers.player && boPlayer) options.controllers.player = {};
															if (options.controllers.player) {
																		if (!options.controllers.player.buttonPrev && prev) options.controllers.player.buttonPrev = prev;
																		if (!options.controllers.player.buttonPlay && play) options.controllers.player.buttonPlay = play;
																		if (!options.controllers.player.buttonNext && next) options.controllers.player.buttonNext = next;
															}
												}
									}
									if (options.controllers && !options.controllers.boControllers) options.controllers = new Controllers(options.controllers);
									return options.controllers;
						}
			}), defineProperty(_Object$definePropert, 'title', {
						get: function get$$1() {
									return options.title;
						}
			}), _Object$definePropert));
			for (var propertyName in options) {
						if (this[propertyName] === undefined) console.error('Options: options.' + propertyName + ' key is hidden');
			}
			this.playerOptions.cameraTarget.init(this.cameraTarget, this, false);
			lang = {
						timeAlert: 'Invalid time fromat: ',
						controllerTTitle: 'Current time.'
			};
			switch (this.getLanguageCode()) {
						case 'ru':
									lang.timeAlert = 'Неправильный формат времени: ';
									lang.controllerTTitle = 'Текущее время.';
									break;
						default:
									if (options.lang === undefined || options.lang.languageCode != languageCode) break;
									Object.keys(options.lang).forEach(function (key) {
												if (lang[key] === undefined) return;
												lang[key] = options.lang[key];
									});
			}
			if (!three$1.options) three$1.options = this;
};
Options.findSpriteTextIntersection = function (scene) {
			var spriteTextIntersection;
			scene.children.forEach(function (item) {
						if (item.type === "Sprite" && item.name === Options.findSpriteTextIntersection.spriteTextIntersectionName) {
									spriteTextIntersection = item;
									return;
						}
			});
			return spriteTextIntersection;
};
Options.findSpriteTextIntersection.spriteTextIntersectionName = 'spriteTextIntersection';
var Raycaster =
function Raycaster() {
			classCallCheck(this, Raycaster);
			var cursor;
			this.onIntersection = function (intersection, options, scene, camera, renderer) {
						var canvas = renderer.domElement;
						if (intersection.object.userData.isInfo !== undefined && !intersection.object.userData.isInfo()) return;
						var spriteTextIntersection = Options.findSpriteTextIntersection(scene);
						if (spriteTextIntersection && (!intersection.pointSpriteText || intersection.object.userData.raycaster && intersection.object.userData.raycaster.text)) {
									scene.remove(spriteTextIntersection);
									spriteTextIntersection = undefined;
						}
						if (spriteTextIntersection === undefined) {
									options = new Options(options);
									var rect = options.spriteText.rect ? JSON.parse(JSON.stringify(options.spriteText.rect)) : {};
									rect.displayRect = true;
									rect.backgroundColor = 'rgba(0, 0, 0, 1)';
									spriteTextIntersection = StereoEffect.getTextIntersection(intersection, {
												scales: options.scales,
												spriteOptions: {
															textHeight: options.spriteText.textHeight,
															fontColor: options.spriteText.fontColor,
															rect: rect,
															group: scene,
															center: {
																		camera: camera,
																		canvas: canvas
															}
												}
									});
									spriteTextIntersection.scale.divide(scene.scale);
									scene.add(spriteTextIntersection);
									if (cursor === undefined) cursor = renderer.domElement.style.cursor;
									renderer.domElement.style.cursor = 'pointer';
						} else if (intersection.pointSpriteText) spriteTextIntersection.position.copy(intersection.pointSpriteText);
			};
			this.onIntersectionOut = function (scene, renderer) {
						var detected = false;
						do {
									var spriteTextIntersection = Options.findSpriteTextIntersection(scene);
									if (spriteTextIntersection !== undefined) {
												scene.remove(spriteTextIntersection);
												if (detected) console.error('Duplicate spriteTextIntersection');
												detected = true;
									}
						} while (spriteTextIntersection !== undefined);
						renderer.domElement.style.cursor = cursor;
			};
			this.onMouseDown = function (intersection, options) {
						if (intersection.object.userData.isInfo !== undefined && !intersection.object.userData.isInfo()) return;
						if (options.guiSelectPoint) options.guiSelectPoint.select(intersection);else {
									if (intersection.object.userData.onMouseDown) intersection.object.userData.onMouseDown(intersection);
									if (options.axesHelper) options.axesHelper.exposePosition(intersection);
						}
			};
			var intersectedObjects = [];
			var intersects;
			this.intersectionsInOut = function (particles, raycaster, renderer, mouse) {
						var settings = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
						function getIntersects() {
									if (particles === undefined) return;
									intersects = Array.isArray(particles) ? raycaster.intersectObjects(particles) : raycaster.intersectObject(particles);
						}
						getIntersects();
						intersects.forEach(function (intersection) {
									var three = window.__myThree__.three;
									intersection.pointSpriteText = new three.THREE.Vector3();
									if (settings.options.stereoEffect && settings.options.stereoEffect.settings.spatialMultiplex === StereoEffect.spatialMultiplexsIndexs.Mono) raycaster.ray.at(three.options.camera.near + (three.options.camera.far - three.options.camera.near) / 1000, intersection.pointSpriteText);
									else intersection.pointSpriteText = intersection.point;
									var boDetected = false;
									intersectedObjects.forEach(function (intersectedObject) {
												if (intersectedObject.object === intersection.object) {
															boDetected = true;
															return;
												}
									});
									if (!boDetected) {
												intersectedObjects.push(intersection);
									}
									if (intersection && intersection.object.userData.raycaster && intersection.object.userData.raycaster.onIntersection) {
												intersection.object.userData.raycaster.onIntersection(intersection, mouse);
									} else {
												if (!settings.scene) console.error('THREE.Raycaster.setStereoEffect(): settings.scene = ' + settings.scene);else Options.raycaster.onIntersection(intersection, settings.options, settings.scene, settings.camera, renderer);
									}
						});
						intersectedObjects.forEach(function (intersectedObject) {
									var boDetected = false;
									intersects.forEach(function (intersection) {
												if (intersectedObject.object === intersection.object) boDetected = true;
									});
									if (!boDetected) {
												if (intersectedObject.object.userData.raycaster && intersectedObject.object.userData.raycaster.onIntersectionOut) intersectedObject.object.userData.raycaster.onIntersectionOut();else if (settings.scene) Options.raycaster.onIntersectionOut(settings.scene, renderer);
												intersectedObjects.splice(intersectedObjects.findIndex(function (v) {
															return v === intersectedObject;
												}), 1);
									}
						});
						return intersects;
			};
			this.EventListeners = function () {
						function _class(camera, renderer) {
									var settings = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
									classCallCheck(this, _class);
									var intersectedObject;
									var THREE = three$1.THREE,
									    mouse = new THREE.Vector2(),
									    particles = [],
									    raycaster = new THREE.Raycaster(),
									    options = settings.options || {};
									raycaster.params.Points.threshold = settings.threshold !== undefined ? settings.threshold : 0.03;
									raycaster.params.Line.threshold = raycaster.params.Points.threshold;
									if (raycaster.setStereoEffect) {
												raycaster.setStereoEffect({
															options: settings.options,
															renderer: renderer,
															camera: camera,
															scene: settings.scene,
															stereoEffect: options.stereoEffect,
															raycasterEvents: false
												});
									}
									var domElement = options.renderer ? options.renderer.domElement : window;
									domElement.addEventListener('mousemove', function (event) {
												if (raycaster.stereo !== undefined) {
															raycaster.stereo.onDocumentMouseMove(event);
															return;
												}
												Options.raycaster.EventListeners.getRendererSize(renderer).getMousePosition(mouse, event);
												raycaster.setFromCamera(mouse, camera);
												intersects = raycaster.intersectObjects(particles);
												if (!intersects) return;
												if (intersects.length === 0) {
															if (intersectedObject) {
																		if (intersectedObject.userData.raycaster && intersectedObject.userData.raycaster.onIntersectionOut) intersectedObject.userData.raycaster.onIntersectionOut();else Options.raycaster.onIntersectionOut(settings.scene, renderer);
																		intersectedObject = undefined;
															}
												} else {
															var intersect = intersects[0],
															    object = intersect.object;
															if (object.userData.raycaster && object.userData.raycaster.onIntersection) object.userData.raycaster.onIntersection(intersect, mouse);else Options.raycaster.onIntersection(intersect, options, settings.scene, camera, renderer);
															intersectedObject = object;
												}
									}, false);
									domElement.addEventListener('pointerdown', function (event) {
												if (raycaster === undefined) return;
												if (intersects && intersects.length > 0) {
															var intersect = intersects[0];
															if (intersect.object.userData.raycaster && intersect.object.userData.raycaster.onMouseDown) intersect.object.userData.raycaster.onMouseDown(intersect, event);
															else Options.raycaster.onMouseDown(intersect, options);
												}
									}, false);
									function isAddedToParticles(particle) {
												return particles.includes(particle);
									}
									this.addParticle = function (particle) {
												if (particle.userData.boFrustumPoints) return;
												if (raycaster.stereo) {
															raycaster.stereo.addParticle(particle);
															return;
												}
												if (isAddedToParticles(particle)) {
															console.error('Duplicate particle "' + particle.name + '"');
															return;
												}
												particles.push(particle);
									};
									this.removeParticle = function (particle) {
												if (particle.userData.boFrustumPoints) return;
												if (raycaster.stereo) {
															raycaster.stereo.removeParticle(particle);
															return;
												}
												var index = particles.indexOf(particle);
												if (index === -1) return;
												particles.splice(index, 1);
									};
						}
						createClass(_class, null, [{
									key: 'getRendererSize',
									value: function getRendererSize(renderer, el) {
												el = el || renderer.domElement;
												var style = {
															position: el.style.position,
															left: el.style.left,
															top: el.style.top,
															width: el.style.width,
															height: el.style.height
												},
												    rect = el.getBoundingClientRect(),
												    left = Math.round(rect.left),
												    top = Math.round(rect.top),
												    size = new three$1.THREE.Vector2();
												renderer.getSize(size);
												return {
															getMousePosition: function getMousePosition(mouse, event) {
																		mouse.x = event.clientX / size.x * 2 - 1 - left / size.x * 2;
																		mouse.y = -(event.clientY / size.y) * 2 + 1 + top / size.y * 2;
															}
												};
									}
						}]);
						return _class;
			}();
};
Options.raycaster = new Raycaster();

/**
 * @module Player
 * @description 3D objects animation.
 * @author [Andrej Hristoliubov]{@link https://github.com/anhr}
 * @copyright 2011 Data Arts Team, Google Creative Lab
 *
 * @license under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */
var Player$1 =
function Player(group) {
			var settings = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
			classCallCheck(this, Player);
			assign$1();
			if (!settings.options && settings.frustumPoints) settings.options = settings.frustumPoints.getOptions();
			settings.options = settings.options || new Options();
			var options = settings.options;
			if (!options.boOptions) {
						console.error('Player: call options = new Options( options ) first');
						return;
			}
			if (options.player === false) return;
			options.boPlayer = options.boPlayer || false;
			if (options.player) {
						console.error('Player: duplicate player.');
						return;
			}
			options.player = this;
			settings.cameraTarget = settings.cameraTarget || {};
			function onSelectScene(index) {
						index = index || 0;
						var t = _this.getTime();
						Player.selectPlayScene(group, { t: t, index: index, options: settings.options });
						_this.setIndex(index, (options.playerOptions.name === '' ? '' : options.playerOptions.name + ': ') + t);
						if (settings.onSelectScene) _this.selectScenePause = settings.onSelectScene(index, t);
						if (options.frustumPoints) options.frustumPoints.updateCloudPoints();
			}
			setTimeout(function () {
						onSelectScene();
			}, 0);
			options.playerOptions.selectSceneIndex = options.playerOptions.selectSceneIndex || 0;
			var selectSceneIndex = options.playerOptions.selectSceneIndex;
			var _this = this;
			this.getTime = function () {
						var playerOptions = options.playerOptions,
						    t = playerOptions.min + selectSceneIndex * playerOptions.dt;
						if (isNaN(t)) console.error('Player.getTime(): t = ' + t);
						if (playerOptions.max !== null && t > playerOptions.max) console.error('Player.getTime(): t = ' + t + ' playerOptions.max = ' + playerOptions.max);
						if (t < playerOptions.min && playerOptions.max !== null) console.error('Player.getTime(): t = ' + t + ' playerOptions.min = ' + playerOptions.min);
						return t;
			};
			this.setTime = function (t) {
						return this.selectScene(parseInt((t - options.playerOptions.min) / options.playerOptions.dt));
			};
			this.selectScene = function (index) {
						if (index === undefined) {
									onSelectScene(selectSceneIndex);
									return true;
						}
						if (isNaN(index)) {
									console.error('Player.selectScene: index = ' + index);
									return false;
						}
						index = parseInt(index);
						if (options.playerOptions.max !== null) {
									if (index >= options.playerOptions.marks) index = 0;else if (index < 0) index = options.playerOptions.marks - 1;
									if (selectSceneIndex > options.playerOptions.marks) selectSceneIndex = options.playerOptions.marks;
						}
						while (selectSceneIndex !== index) {
									if (selectSceneIndex < index) selectSceneIndex++;else selectSceneIndex--;
									onSelectScene(selectSceneIndex);
						}
						return true;
			};
			this.next = function () {
						_this.selectScene(selectSceneIndex + 1);
			};
			this.prev = function () {
						_this.selectScene(selectSceneIndex - 1);
			};
			this.pushController = function (controller) {
						if (controller.object !== undefined && controller.object.playRate !== undefined) controller.object.playRate = options.playerOptions.min;
						this.controllers.push(controller);
			};
			this.controllers = [];
			var playing = false,
			    time,
			    timeNext;
			function RenamePlayButtons() {
						options.player.controllers.forEach(function (controller) {
									if (controller.onRenamePlayButtons) controller.onRenamePlayButtons(playing);
						});
			}
			function play() {
						if (selectSceneIndex === -1 || selectSceneIndex === options.playerOptions.marks && options.playerOptions.max !== null) {
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
						return options.playerOptions.repeat;
			}
			function playNext() {
						selectSceneIndex++;
						if (options.playerOptions.max !== null && selectSceneIndex >= options.playerOptions.marks) {
									if (isRepeat()) selectSceneIndex = 0;else {
												selectSceneIndex = options.playerOptions.marks - 1;
												pause();
												return;
									}
						}
						play();
			}
			function step(timestamp) {
						if (_this.selectScenePause) return;
						if (playing) window.requestAnimationFrame(step);else time = undefined;
						if (time === undefined) {
									time = timestamp;
									timeNext = time + 1000 / options.playerOptions.interval;
						}
						if (isNaN(timeNext) || timeNext === Infinity) {
									console.error('Player.animate: timeNext = ' + timeNext);
									playing = false;
						}
						if (timestamp < timeNext) return;
						while (timestamp > timeNext) {
									timeNext += 1000 / options.playerOptions.interval;
						}playNext();
			}
			this.play3DObject = function () {
						if (playing) {
									pause();
									return;
						}
						playing = true;
						if (options.playerOptions.max !== null && selectSceneIndex >= options.playerOptions.marks - 1) selectSceneIndex = 0;
						playNext();
						RenamePlayButtons();
						window.requestAnimationFrame(step);
			};
			this.continue = function () {
						_this.selectScenePause = false;
						window.requestAnimationFrame(step);
			};
			this.repeat = function () {
						options.playerOptions.repeat = !options.playerOptions.repeat;
						this.onChangeRepeat(options.playerOptions.repeat);
			};
			this.getSettings = function () {
						return settings;
			};
			this.getSelectSceneIndex = function () {
						return selectSceneIndex;
			};
			this.onChangeRepeat = function (value) {
						options.playerOptions.repeat = value;
						this.controllers.forEach(function (controller) {
									if (controller.onChangeRepeat) controller.onChangeRepeat();
						});
			};
			function getLang(params) {
						params = params || {};
						var lang = {
									player: 'Player',
									playerTitle: '3D objects animation.',
									min: 'Min',
									max: 'Max',
									dt: 'Step',
									dtTitle: 'Time between frames',
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
												lang.player = 'Проигрыватель';
												lang.playerTitle = 'Анимация 3D объектов.';
												lang.min = 'Минимум';
												lang.max = 'Максимум';
												lang.dt = 'Шаг';
												lang.dtTitle = 'Веремя между кадрами';
												lang.marks = 'Кадры';
												lang.marksTitle = 'Количество кадров проигрывателя';
												lang.interval = 'Темп', lang.intervalTitle = 'Скорость смены кадров в секунду.';
												lang.time = 'Время';
												lang.defaultButton = 'Восстановить';
												lang.defaultTitle = 'Восстановить настройки проигрывателя по умолчанию.';
												break;
									default:
												if (params.lang === undefined || params.lang._languageCode != _languageCode) break;
												Object.keys(params.lang).forEach(function (key) {
															if (_lang[key] === undefined) return;
															_lang[key] = params.lang[key];
												});
						}
						return lang;
			}
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
						stereoEffects: 'Stereo effects',
						mono: 'Mono',
						sideBySide: 'Side by side',
						topAndBottom: 'Top and bottom'
			};
			function localization(getLanguageCode) {
						switch (getLanguageCode()) {
									case 'ru':
												lang.prevSymbolTitle = 'Кадр назад';
												lang.playTitle = 'Проиграть';
												lang.nextSymbolTitle = 'Кадр вперед';
												lang.pauseTitle = 'Пауза';
												lang.repeatOn = 'Повторять проигрывание';
												lang.repeatOff = 'Остановить повтор проигрывания';
												lang.controllerTitle = 'Текущее время.';
												lang.stereoEffects = 'Стерео эффекты';
												lang.mono = 'Моно';
												lang.sideBySide = 'Слева направо';
												lang.topAndBottom = 'Сверху вниз';
												break;
						}
			}
			this.localization = function () {
						var getLanguageCode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {
									return 'en';
						};
						localization(getLanguageCode);
						return lang;
			};
			this.PlayController = function (_controllers$CustomCo) {
						inherits(_class, _controllers$CustomCo);
						function _class(gui) {
									classCallCheck(this, _class);
									var player = options.player,
									    getLanguageCode = options.getLanguageCode;
									player.createControllersButtons(options);
									gui = gui || options.dat.gui;
									if (!gui || options.dat.playController === false) {
												var _this2 = possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this, {}));
												return possibleConstructorReturn(_this2);
									}
									localization(getLanguageCode);
									function addButton(innerHTML, title, onclick) {
												var button = document.createElement('span');
												button.innerHTML = innerHTML;
												button.title = title;
												button.style.cursor = 'pointer';
												button.style.margin = '0px 2px';
												button.onclick = onclick;
												return button;
									}
									var _renamePlayButtons, _renameRepeatButtons;
									var colorOff = 'rgb(255,255,255)',
									    colorOn = 'rgb(128,128,128)';
									var _this2 = possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this, {
												playRate: 1,
												property: function property(customController) {
															var buttons = {};
															function RenamePlayButtons(innerHTML, title) {
																		buttons.buttonPlay.innerHTML = innerHTML;
																		buttons.buttonPlay.title = title;
															}
															_renamePlayButtons = RenamePlayButtons;
															buttons.buttonPrev = addButton(lang.prevSymbol, lang.prevSymbolTitle, player.prev);
															buttons.buttonPlay = addButton(playing ? lang.pause : lang.playSymbol, playing ? lang.pauseTitle : lang.playTitle, player.play3DObject);
															if (player.getSettings().options.playerOptions.max !== null) {
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
																		if (player.getSettings().repeat) {
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
															return buttons;
												}
									}, 'playRate'));
									player.PlayController = _this2;
									_this2.lang = lang;
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
												_renameRepeatButtons(player.getSettings().options.playerOptions.repeat);
									};
									player.pushController(_this2);
									_this2.setValue = function (value) {
												this._controller.domElement.childNodes[0].value = value;
									};
									var controler = gui.add(_this2);
									controler.__truncationSuspended = true;
									return possibleConstructorReturn(_this2);
						}
						createClass(_class, [{
									key: 'controller',
									set: function set$$1(newController) {
												this._controller = newController;
												this._controller.onChange(function (value) {
															options.player.setTime(value);
												});
												this._controller.domElement.title = this.lang.controllerTitle;
									},
									get: function get$$1() {
												return this._controller;
									}
						}]);
						return _class;
			}(controllers$1.CustomController);
			this.gui = function (folder) {
						var cookie = options.dat.cookie,
						    cookieName = options.dat.getCookieName('Player'),
						    getLanguageCode = options.getLanguageCode,
						    dat = three$1.dat;
						folder = folder || options.dat.gui;
						if (!folder || options.dat.playerGui === false) return;
						function setDT() {
									if (options.playerOptions.max === null) options.playerOptions.dt = options.playerOptions.dt || 0.1;else options.playerOptions.dt = (options.playerOptions.max - options.playerOptions.min) / (options.playerOptions.marks - 1);
						}
						function setSettings() {
									setDT();
									cookie.setObject(cookieName, options.playerOptions);
									if (settings.onChangeScaleT) settings.onChangeScaleT(options.playerOptions);
						}
						function setMax() {
									if (options.playerOptions.max !== null) options.playerOptions.max = options.playerOptions.min + options.playerOptions.dt * (options.playerOptions.marks - 1);
						}
						setMax();
						var axesDefault = JSON.parse(JSON.stringify(options.playerOptions)),
						    lang = getLang({
									getLanguageCode: getLanguageCode
						});
						Object.freeze(axesDefault);
						var max = options.playerOptions.max,
						    marks = options.playerOptions.marks;
						cookie.getObject(cookieName, options.playerOptions, options.playerOptions);
						if (max === null || max === Infinity || options.playerOptions.max === null
						) {
												options.playerOptions.max = max;
												options.playerOptions.marks = marks;
									}
						var fPlayer = folder.addFolder(lang.player);
						dat.folderNameAndTitle(fPlayer, lang.player, lang.playerTitle);
						function scale() {
									var axes = options.playerOptions,
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
									scaleControllers.folder = fPlayer.addFolder(axes.name !== '' ? axes.name : lang.time);
									scaleControllers.scaleController = scaleControllers.folder.add(new ScaleController(onclick, { settings: settings.options.playerOptions, getLanguageCode: getLanguageCode })).onChange(function (value) {
												axes.zoomMultiplier = value;
												setSettings();
									});
									var positionController = new PositionController(function (shift) {
												onclick(positionController, function (value, zoom) {
															value += shift;
															return value;
												});
									}, { settings: settings.options.playerOptions, getLanguageCode: getLanguageCode });
									scaleControllers.positionController = scaleControllers.folder.add(positionController).onChange(function (value) {
												axes.offset = value;
												setSettings();
									});
									scaleControllers.min = dat.controllerZeroStep(scaleControllers.folder, axes, 'min', function (value) {
												setSettings();
									});
									dat.controllerNameAndTitle(scaleControllers.min, lang.min);
									setMax();
									if (axes.max !== null) {
												scaleControllers.max = dat.controllerZeroStep(scaleControllers.folder, axes, 'max', function (value) {
															setSettings();
												});
												dat.controllerNameAndTitle(scaleControllers.max, lang.max);
									} else {
												scaleControllers.dt = dat.controllerZeroStep(scaleControllers.folder, axes, 'dt', function (value) {
															setSettings();
												});
												dat.controllerNameAndTitle(scaleControllers.dt, lang.dt, lang.dtTitle);
									}
									if (axes.marks) {
												scaleControllers.marks = scaleControllers.folder.add(axes, 'marks').onChange(function (value) {
															axes.marks = parseInt(axes.marks);
															setSettings();
															var elSlider = getSliderElement();
															if (elSlider) elSlider.max = options.playerOptions.marks - 1;
												});
												dat.controllerNameAndTitle(scaleControllers.marks, axes.marksName === undefined ? lang.marks : axes.marksName, axes.marksTitle === undefined ? lang.marksTitle : axes.marksTitle);
									}
									scaleControllers.interval = scaleControllers.folder.add(settings.options.playerOptions, 'interval', 1, 25, 1).onChange(function (value) {
												setSettings();
									});
									dat.controllerNameAndTitle(scaleControllers.interval, lang.interval, lang.intervalTitle);
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
																		if (scaleControllers.marks) scaleControllers.marks.setValue(axes.marks);
															}
															axes.interval = axesDefault.interval;
															scaleControllers.interval.setValue(axes.interval);
															setSettings();
												}
									}, 'defaultF'), lang.defaultButton, lang.defaultTitle);
						}
						scale();
			};
			this.createControllersButtons = function (options) {
						if (!options.controllers || !options.controllers.player) return;
						var settings = options.controllers.player;
						if (settings.buttonPrev === null) console.warn('Player.createControllersButtons: invalid options.controllers.player.buttonPrev = ' + settings.buttonPrev);
						if (settings.buttonPrev) {
									var buttonPrev = typeof settings.buttonPrev === 'string' ? document.getElementById(settings.buttonPrev) : settings.buttonPrev;
									if (buttonPrev === null) console.warn('Player.createControllersButtons: invalid options.controllers.player.buttonPrev = ' + settings.buttonPrev);
									if (buttonPrev) {
												buttonPrev.value = lang.prevSymbol;
												buttonPrev.title = lang.prevSymbolTitle;
												buttonPrev.onclick = function (event) {
															if (options.player) options.player.prev();
												};
												settings.buttonPrev = buttonPrev;
									}
						}
						if (settings.buttonPlay === null) console.warn('Player.createControllersButtons: invalid options.controllers.player.buttonPlay = ' + settings.buttonPlay);
						if (settings.buttonPlay) {
									var buttonPlay = typeof settings.buttonPlay === 'string' ? document.getElementById(settings.buttonPlay) : settings.buttonPlay;
									if (buttonPlay === null) console.warn('Player.createControllersButtons: invalid options.controllers.player.buttonPlay = ' + settings.buttonPlay);
									if (buttonPlay) {
												buttonPlay.value = playing ? lang.pause : lang.playSymbol;
												buttonPlay.title = playing ? lang.pauseTitle : lang.playTitle;
												buttonPlay.onclick = function (event) {
															if (options.player) options.player.play3DObject();
												};
												settings.buttonPlay = buttonPlay;
									}
						}
						if (settings.buttonNext === null) console.warn('Player.createControllersButtons: invalid options.controllers.player.buttonNext = ' + settings.buttonNext);
						if (settings.buttonNext) {
									var buttonNext = typeof settings.buttonNext === 'string' ? document.getElementById(settings.buttonNext) : settings.buttonNext;
									if (buttonNext === null) console.warn('Player.createControllersButtons: invalid options.controllers.player.buttonNext = ' + settings.buttonNext);
									if (buttonNext) {
												buttonNext.value = lang.nextSymbol;
												buttonNext.title = lang.nextSymbolTitle;
												buttonNext.onclick = function (event) {
															if (options.player) options.player.next();
												};
												settings.buttonNext = buttonNext;
									}
						}
			};
			var _canvasMenu;
			this.createCanvasMenuItem = function (canvasMenu) {
						var getLanguageCode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {
									return 'en';
						};
						_canvasMenu = canvasMenu;
						var player = this,
						    menu = canvasMenu.menu,
						    lang = player.localization(getLanguageCode);
						menu.push({
									name: lang.prevSymbol,
									title: lang.prevSymbolTitle,
									onclick: function onclick(event) {
												player.prev();
									}
						});
						menu.push({
									name: playing ? lang.pause : lang.playSymbol,
									title: playing ? lang.pauseTitle : lang.playTitle,
									id: "menuButtonPlay",
									onclick: function onclick(event) {
												player.play3DObject();
									}
						});
						if (options.playerOptions.max !== null) {
									menu.push({
												name: lang.repeat,
												title: this.getSettings().repeat ? lang.repeatOff : lang.repeatOn,
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
						this.controllers.push({
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
												if (options.controllers && options.controllers.player && options.controllers.player.buttonPlay) {
															options.controllers.player.buttonPlay.value = name;
															options.controllers.player.buttonPlay.title = title;
												}
									},
									onChangeRepeat: function onChangeRepeat() {
												canvasMenu.querySelector('#menuButtonRepeat').title = options.playerOptions.repeat ? lang.repeatOff : lang.repeatOn;
									}
						});
			};
			this.addSlider = function () {
						if (options.playerOptions.max === null) return;
						_canvasMenu.menu.push({
									name: '<input type="range" min="0" max="' + (options.playerOptions.marks - 1) + '" value="0" class="slider" id="sliderPosition">',
									style: 'float: right;'
						});
			};
			function getSliderElement() {
						if (_canvasMenu) return _canvasMenu.querySelector('#sliderPosition');
			}
			this.addSliderEvents = function () {
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
												_player.selectScene((options.playerOptions.marks - 1) * e.offsetX / elSlider.clientWidth);
									});
						}
						return elSlider;
			};
			this.setIndex = function (index, title) {
						var t = this.getTime();
						if (options.controllers && options.controllers.t) options.controllers.t.controller.value = t;
						if (_typeof(this.PlayController) === "object") this.PlayController.setValue(t);
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
};
Player$1.cameraTarget = function () {
			function _class2() {
						classCallCheck(this, _class2);
						var cameraTargetDefault = { boLook: false },
						_cameraTarget = {
									boLook: cameraTargetDefault.boLook,
									getDistanceToCamera: function getDistanceToCamera() {
												if (typeof this.distanceToCameraCur !== 'undefined') return this.distanceToCameraCur;
												return this.distanceToCamera;
									}
						};
						var _options;
						cameraTargetDefault.rotation = {};
						_cameraTarget.rotation = {};
						var boTarget = false,
						boPlayer = false;
						var boCameraTargetLook;
						this.get = function (options) {
									if (!options && !_options) console.error('Player.cameraTarget.get: options = ' + options);else if (_options && options && !Object.is(_options, options)) console.error('Player.cameraTarget.get: options is ambiguous');
									_options = _options || options;
									if (!_cameraTarget.camera && !boPlayer && _options.player) {
												cameraTargetDefault.camera = _options.player.getSettings().cameraTarget.camera;
												if (cameraTargetDefault.camera) setCameraTarget();
												boPlayer = true;
									}
									if (_cameraTarget.camera) return _cameraTarget;
						};
						this.init = function (cameraTarget, options) {
									var boErrorMessage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
									if (!cameraTarget) return;
									if (!options && !_options) console.error('Player.cameraTarget.init: options = ' + options);else if (_options && options && !Object.is(_options, options)) console.error('Player.cameraTarget.init: options is ambiguous');
									_options = _options || options;
									if (cameraTarget.bodefault !== false) {
												if (boTarget) return;
												if (cameraTarget.boLook !== undefined) {
															cameraTargetDefault.boLook = cameraTarget.boLook;
															boCameraTargetLook = cameraTarget.boLook;
												}
									} else if (cameraTarget.boLook === true) {
												if (boTarget) console.warn('playerCameraTarget().init(...): duplicate target point');
												boTarget = true;
												if (boCameraTargetLook === undefined) cameraTargetDefault.boLook = true;
									} else return;
									cameraTargetDefault.camera = cameraTargetDefault.camera || cameraTarget.camera || (_options.player ? _options.player.getSettings().cameraTarget.camera : undefined);
									if (!cameraTargetDefault.camera && boErrorMessage) {
												console.error('playerCameraTarget().init(...): cameraTargetDefault.camera = ' + cameraTargetDefault.camera);
												return;
									}
									cameraTargetDefault.distanceToCamera = cameraTargetDefault.distanceToCamera || cameraTarget.distanceToCamera;
									cameraTarget.rotation = cameraTarget.rotation || {};
									cameraTargetDefault.rotation.angle = cameraTargetDefault.rotation.angle || cameraTarget.rotation.angle;
									cameraTargetDefault.rotation.axis = cameraTargetDefault.rotation.axis || cameraTarget.rotation.axis;
									setCameraTarget(cameraTarget);
						};
						function setCameraTarget(cameraTarget) {
									assign$1();
									if (!cameraTarget) cameraTarget = cameraTargetDefault;
									if (!_cameraTarget.boMaual) {
												if (cameraTarget.boLook !== undefined) _cameraTarget.boLook = cameraTarget.boLook;else _cameraTarget.boLook = cameraTargetDefault.boLook;
									}
									cameraTargetDefault.camera = cameraTargetDefault.camera || cameraTarget.camera;
									_cameraTarget.camera = cameraTarget.camera || cameraTargetDefault.camera;
									_cameraTarget.distanceToCamera = cameraTarget.distanceToCamera || cameraTargetDefault.distanceToCamera || _cameraTarget.distanceToCamera || new THREE.Vector3().copy(cameraTargetDefault.camera.position);
									if (!cameraTarget.rotation) cameraTarget.rotation = {};
									if (cameraTarget.rotation.angle !== undefined) _cameraTarget.rotation.angle = cameraTarget.rotation.angle;else _cameraTarget.rotation.angle = cameraTargetDefault.rotation.angle || 0;
									_cameraTarget.rotation.axis = cameraTarget.rotation.axis || cameraTargetDefault.rotation.axis || new THREE.Vector3(0, 1, 0);
						}
						this.changeTarget = function (mesh, i, options) {
									assign$1();
									var func = !mesh.userData.player || typeof mesh.userData.player.arrayFuncs === "function" ? {} : mesh.userData.player.arrayFuncs[i];
									if (!func.cameraTarget) func.cameraTarget = { boLook: false };
									setCameraTarget(func.cameraTarget);
									_options = _options || options;
									var cameraTarget = _options.playerOptions.cameraTarget.get(_options);
									if (cameraTarget) {
												if (cameraTarget && cameraTarget.boLook) {
															var target = getWorldPosition(mesh, new THREE.Vector3().fromArray(mesh.geometry.attributes.position.array, i * mesh.geometry.attributes.position.itemSize));
															cameraTarget.target = target;
												} else delete cameraTarget.target;
									}
						};
						this.setCameraTarget = function (options) {
									assign$1();
									var cameraTarget = options.playerOptions.cameraTarget.get(options);
									if (!cameraTarget) cameraTarget = cameraTarget || {};
									var camera = cameraTarget.camera;
									if (!camera) return;
									if (!cameraTarget.distanceToCamera) cameraTarget.distanceToCamera = new THREE.Vector3().copy(camera.position);
									if (!cameraTarget.distanceToCameraCur) cameraTarget.distanceToCameraCur = new THREE.Vector3();
									var t = options.time,
									    distanceToCamera = cameraTarget.distanceToCamera,
									    distanceToCameraCur = new THREE.Vector3().copy(cameraTarget.distanceToCameraCur);
									cameraTarget.distanceToCameraCur.set(Player$1.execFunc(distanceToCamera, 'x', t, options), Player$1.execFunc(distanceToCamera, 'y', t, options), Player$1.execFunc(distanceToCamera, 'z', t, options));
									if (!cameraTarget.setCameraPosition) cameraTarget.setCameraPosition = function ()                     {
												var target = cameraTarget.target;
												if (!cameraTarget.boLook ||
												!target &&
												cameraTarget.distanceToCameraCur.equals(distanceToCameraCur)
												) {
																		return;
															}
												distanceToCameraCur.copy(cameraTarget.distanceToCameraCur);
												var t = options.time;
												camera.position.copy(cameraTarget.distanceToCameraCur);
												camera.position.applyAxisAngle(cameraTarget.rotation.axis, Player$1.execFunc(cameraTarget.rotation, 'angle', t, options));
												if (!target) {
															if (Player$1.orbitControls) target = Player$1.orbitControls.target;else {
																		return;
															}
												}
												camera.position.add(target);
												camera.lookAt(target);
												if (options.orbitControls) {
															if (!options.orbitControls.target.equals(target)) {
																		options.orbitControls.target.copy(target);
																		if (options.orbitControlsGui) options.orbitControlsGui.setTarget(target);
															}
															if (options.orbitControls._listeners) options.orbitControls._listeners.change[0]();
												}
									};
									if (options.cameraGui) options.cameraGui.update();
						};
			}
			return _class2;
}();
Player$1.execFunc = function (funcs, axisName, t) {
			var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
			var func = funcs[axisName];
			var a = options.a,
			    b = options.b,
			    typeofFuncs = typeof func === 'undefined' ? 'undefined' : _typeof(func);
			if (typeof t === "undefined") t = options.playerOptions ? options.playerOptions.min : 0;
			switch (typeofFuncs) {
						case "undefined":
									return undefined;
						case "number":
									return func;
						case "string":
									func = new Function('t', 'a', 'b', 'return ' + func);
						case "function":
									try {
												var res = func(t, a, b);
												if (res === undefined) throw 'function returns ' + res;
												if (!Array.isArray(res)) return res;else func = res;
									} catch (e) {
												console.error(e);
												throw e;
												return;
									}
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
												    max = options.playerOptions.max === null ? Infinity : options.playerOptions.max,
												    min = options.playerOptions.min,
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
									return func;
						default:
									console.error('Player.execFunc: Invalud typeof funcs["' + axisName + '"]: ' + typeofFuncs);
			}
			return;
};
var lang$1;
var Ids = function Ids() {
			classCallCheck(this, Ids);
			function addKeys(axisName) {
						function keyValue(controllerId) {
									var id = axisName + controllerId;
									return {
												get controllerId() {
															return this.boUsed ? undefined : id;
												},
												get elController() {
															return document.getElementById(this.controllerId);
												},
												nameId: id + 'Name',
												get elName() {
															return document.getElementById(this.nameId);
												}
									};
						}
						return {
									func: keyValue('Func'),
									position: keyValue('Position'),
									worldPosition: keyValue('WorldPosition')
						};
			}
			this.x = addKeys('x');
			this.y = addKeys('y');
			this.z = addKeys('z');
			this.w = addKeys('w');
};
var ids = new Ids();
Player$1.selectMeshPlayScene = function (mesh) {
			var settings = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
			assign$1();
			var t = settings.t,
			    options = settings.options || { dat: false };
			options = new Options(options);
			if (t === undefined) t = options.playerOptions.min;
			options.scales.setW();
			if (!mesh.userData.player || options && options.boPlayer && mesh.userData.boFrustumPoints) return;
			if (mesh.geometry) {
						delete mesh.geometry.boundingSphere;
						mesh.geometry.boundingSphere = null;
			}
			if (mesh.userData.player.selectPlayScene) {
						var setRotation = function setRotation(axisName) {
									while (mesh.rotation[axisName] < 0) {
												mesh.rotation[axisName] += Math.PI * 2;
									}while (mesh.rotation[axisName] > Math.PI * 2) {
												mesh.rotation[axisName] -= Math.PI * 2;
									}
						};
						mesh.userData.player.selectPlayScene(t);
						setRotation('x');
						setRotation('y');
						setRotation('z');
			}
			function setAttributes(a, b) {
						if (!mesh.geometry || mesh.userData.nd) return;
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
						var _loop = function _loop() {
									funcs = arrayFuncs[i];
									needsUpdate = false;
									function setPosition(axisName, fnName) {
												var value = Player$1.execFunc(funcs, axisName, t, options);
												if (value !== undefined) {
															attributes.position[fnName](i, value);
															needsUpdate = true;
												}
									}
									setPosition('x', 'setX');
									setPosition('y', 'setY');
									setPosition('z', 'setZ');
									setPosition('w', 'setW');
									var color = void 0;
									function getColor() {
												if (mesh.userData.player.palette) color = mesh.userData.player.palette.toColor(value, min, max);else if (options.palette) color = options.palette.toColor(value, min, max);else {
															var c = { r: 255, g: 255, b: 255 };
															color = new THREE.Color("rgb(" + c.r + ", " + c.g + ", " + c.b + ")");
															return color;
												}
									}
									if (typeof funcs.w === "function") {
												value = funcs.w(t, a, b);
												if (options.scales.w) {
															min = options.scales.w.min;
															max = options.scales.w.max;
												} else {
															console.warn('Player.selectMeshPlayScene: Кажется эти экстремумы заданы неверно');
															min = 0;
															max = 100;
												}
												if (attributes.position.itemSize >= 4) attributes.position.setW(i, value);
												needsUpdate = true;
												getColor();
									} else if (_typeof(funcs.w) === "object") {
												if (funcs.w instanceof THREE.Color) color = funcs.w;else {
															value = Player$1.execFunc(funcs, 'w', t, options);
															if (funcs.w.min !== undefined) min = funcs.w.min;
															if (funcs.w.max !== undefined) max = funcs.w.max;
															getColor();
												}
									}
									color = setColorAttibute(funcs.w === undefined ? new THREE.Vector4().w : typeof funcs.w === "number" ? funcs.w : Player$1.execFunc(funcs, 'w', t, options), mesh, i, color);
									if (needsUpdate) attributes.position.needsUpdate = true;
									if (funcs.trace && !funcs.line) {
												funcs.line = new Player$1.traceLine(options);
												funcs.trace = false;
									}
									if (funcs.line && funcs.line.addPoint) funcs.line.addPoint(mesh, i, color);
									if (funcs.cameraTarget && funcs.cameraTarget.boLook === true) options.playerOptions.cameraTarget.changeTarget(mesh, i, options);
						};
						for (var i = 0; i < arrayFuncs.length; i++) {
									var funcs, needsUpdate;
									var value;
									var value;
									_loop();
						}
			}
			setAttributes(options ? options.a : 1, options ? options.b : 0);
			var message = 'Player.selectMeshPlayScene: invalid mesh.scale.';
			if (mesh.scale.x <= 0) console.error(message + 'x = ' + mesh.scale.x);
			if (mesh.scale.y <= 0) console.error(message + 'y = ' + mesh.scale.y);
			if (mesh.scale.z <= 0) console.error(message + 'z = ' + mesh.scale.z);
			function setColorAttibute(value, mesh, index, color) {
						if (mesh.geometry.attributes.position.itemSize < 4) return;
						if (options.palette) color = options.palette.toColor(value, options.scales.w.min, options.scales.w.max);
						if (!color) return;
						var attributes = mesh.geometry.attributes,
						    arrayFuncs = mesh.userData.player.arrayFuncs;
						if (!Player$1.setColorAttribute(attributes, index, color) && arrayFuncs[index] instanceof THREE.Vector4) {
									if (mesh.userData.player && arrayFuncs) {
												mesh.geometry.setAttribute('color', new THREE.Float32BufferAttribute(Player$1.getColors(arrayFuncs, {
															positions: attributes.position,
															options: options
												}), 4));
												if (!Player$1.setColorAttribute(attributes, index, color)) console.error('Player.selectMeshPlayScene: the color attribute is not exists. Please use THREE.Vector3 instead THREE.Vector4 in the arrayFuncs or add "color" attribute');
									} else console.error('Player.selectMeshPlayScene: set color attribute failed. Invalid mesh.userData.player.arrayFuncs');
						}
						return color;
			}
			if (mesh.userData.player && mesh.userData.player.arrayFuncs && mesh.userData.player.arrayFuncs instanceof Array) mesh.userData.player.arrayFuncs.forEach(function (func, index) {
						if (func.controllers) {
									var setPosition = function setPosition(value, axisName) {
												var axesId = axisName === 'x' ? 0 : axisName === 'y' ? 1 : axisName === 'z' ? 2 : axisName === 'w' ? 3 : undefined;
												if (axisName === 'w') {
															setColorAttibute(value, mesh, index);
															if (options.guiSelectPoint) options.guiSelectPoint.update();
												}
												var indexValue = axesId + mesh.geometry.attributes.position.itemSize * index,
												    valueOld = mesh.geometry.attributes.position.array[indexValue];
												mesh.geometry.attributes.position.array[indexValue] = value;
												var axisControllers = func.controllers[axisName];
												if (isNaN(mesh.geometry.attributes.position.array[indexValue])) {
															alert(lang$1.positionAlert + value);
															var controller = axisControllers.position.controller;
															controller.focus();
															controller.value = valueOld;
															mesh.geometry.attributes.position.array[indexValue] = valueOld;
															return;
												}
												mesh.geometry.attributes.position.needsUpdate = true;
												if (options.axesHelper) options.axesHelper.updateAxes();
												if (options.guiSelectPoint) options.guiSelectPoint.update();
												if (axisControllers.worldPosition && axisControllers.worldPosition.controller) {
															var _controller = axisControllers.worldPosition.controller;
															_controller.innerHTML = getObjectPosition(mesh, index)[axisName];
												}
									};
									var createControllers = function createControllers(axisName) {
												var axisControllers = func.controllers[axisName];
												if (axisControllers === false) return;
												var position = 'position';
												if (!axisControllers && (ids[axisName].func.elController || ids[axisName].position.elController || ids[axisName].worldPosition.elController)) {
															axisControllers = {};
															func.controllers[axisName] = axisControllers;
												}
												if (!axisControllers) return;
												function addKey(keyName) {
															if (!ids[axisName][keyName].elController) return;
															if (!axisControllers[keyName]) {
																		if (!ids[axisName][keyName].boUsed) {
																					axisControllers[keyName] = {
																								controller: ids[axisName][keyName].elController,
																								elName: ids[axisName][keyName].elName ? ids[axisName][keyName].elName : false
																					};
																					ids[axisName][keyName].boUsed = true;
																					if (keyName === position && axisName === 'w') axisControllers[keyName].elSlider = true;
																		} else console.warn('Player.selectMeshPlayScene createControllers: Same controller is using for different points. Controller ID is "' + ids[axisName][keyName].controllerId + '""');
															}
												}
												addKey('func');
												addKey(position);
												addKey('worldPosition');
												createController(axisControllers.func, ids[axisName].func.controllerId, function () {
															return options.scales[axisName].name + ' = f(t)';
												}, {
															value: func[axisName],
															title: axisName === 'x' ? lang$1.controllerXFunctionTitle : axisName === 'y' ? lang$1.controllerYFunctionTitle : axisName === 'z' ? lang$1.controllerZFunctionTitle : axisName === 'w' ? lang$1.controllerWFunctionTitle : '',
															onchange: function onchange(event) {
																		try {
																					func[axisName] = event.currentTarget.value;
																					var value = Player$1.execFunc(func, axisName, options.player.getTime(), options);
																					if (axisControllers.position && axisControllers.position.controller) {
																								var controller = axisControllers.position.controller;
																								controller.onchange({ currentTarget: { value: value } });
																								controller.value = value;
																					} else setPosition(value, axisName);
																					if (options.guiSelectPoint) options.guiSelectPoint.update();
																		} catch (e) {
																					alert('Axis: ' + options.scales[axisName].name + '. Function: "' + func[axisName] + '". ' + e);
																					event.currentTarget.focus();
																		}
															}
												});
												createController(axisControllers.position, axisName + 'Position', function () {
															return options.scales[axisName].name;
												}, {
															value: positionLocal[axisName],
															title: axisName === 'x' ? lang$1.controllerXTitle : axisName === 'y' ? lang$1.controllerYTitle : axisName === 'z' ? lang$1.controllerZTitle : axisName === 'w' ? lang$1.controllerWTitle : '',
															onchange: function onchange(event) {
																		setPosition(event.currentTarget.value, axisName);
															},
															axisName: axisName
												});
												createController(axisControllers.worldPosition, axisName + 'WorldPosition', function () {
															return lang$1.controllerWorld + ' ' + options.scales[axisName].name;
												}, {
															value: getWorldPosition(mesh, positionLocal)[axisName],
															title: axisName === 'x' ? lang$1.controllerXWorldTitle : axisName === 'y' ? lang$1.controllerYWorldTitle : axisName === 'z' ? lang$1.controllerZWorldTitle : axisName === 'w' ? lang$1.controllerWTitle : ''
												});
									};
									if (!lang$1) {
												lang$1 = {
															controllerXTitle: 'X position',
															controllerYTitle: 'Y position',
															controllerZTitle: 'Z position',
															controllerWTitle: 'color index',
															controllerWorld: 'World',
															controllerXWorldTitle: 'X world position',
															controllerYWorldTitle: 'Y world position',
															controllerZWorldTitle: 'Z world position',
															controllerWWorldTitle: 'color index',
															controllerXFunctionTitle: 'X = f(t)',
															controllerYFunctionTitle: 'Y = f(t)',
															controllerZFunctionTitle: 'Z = f(t)',
															controllerWFunctionTitle: 'W = f(t)',
															positionAlert: 'Invalid position fromat: '
												};
												switch (options.getLanguageCode()) {
															case 'ru':
																		lang$1.controllerXTitle = 'Позиция X';
																		lang$1.controllerYTitle = 'Позиция Y';
																		lang$1.controllerZTitle = 'Позиция Z';
																		lang$1.controllerWTitle = 'Индекс цвета';
																		lang$1.controllerWorld = 'Абсолютный';
																		lang$1.controllerXWorldTitle = 'Абсолютная позиция X';
																		lang$1.controllerYWorldTitle = 'Абсолютная позиция Y';
																		lang$1.controllerZWorldTitle = 'Абсолютная позиция Z';
																		lang$1.controllerWWorldTitle = 'Индекс цвета';
																		lang$1.positionAlert = 'Неправильный формат позиции точки: ';
																		break;
															default:
																		if (options.lang === undefined || options.lang.languageCode != languageCode) break;
																		Object.keys(options.lang).forEach(function (key) {
																					if (lang$1[key] === undefined) return;
																					lang$1[key] = options.lang[key];
																		});
												}
									}
									var positionLocal = getObjectLocalPosition(mesh, index);
									if (func.name) {
												if (!func.controllers.pointName) func.controllers.pointName = 'pointName';
												var elPointName = typeof func.controllers.pointName === "string" ? document.getElementById(func.controllers.pointName) : func.controllers.pointName;
												if (elPointName) elPointName.innerHTML = func.name;
									}
									createControllers('x');
									createControllers('y');
									createControllers('z');
									createControllers('w');
						}
			});
			if (!options || !options.guiSelectPoint) {
						if (options.axesHelper) options.axesHelper.movePosition();
						return;
			}
			options.guiSelectPoint.setMesh();
			var selectedPointIndex = options.guiSelectPoint.getSelectedPointIndex();
			if (selectedPointIndex !== -1 && options.guiSelectPoint.isSelectedMesh(mesh)) {
						options.guiSelectPoint.setPosition({
									object: mesh,
									index: selectedPointIndex
						});
			}
};
Player$1.setColorAttribute = function (attributes, i, color) {
			if (typeof color === "string") color = new THREE.Color(color);
			var colorAttribute = attributes.color || attributes.ca;
			if (colorAttribute === undefined) return false;
			colorAttribute.setX(i, color.r);
			colorAttribute.setY(i, color.g);
			colorAttribute.setZ(i, color.b);
			colorAttribute.needsUpdate = true;
			return true;
};
Player$1.getPoints = function (arrayFuncs, optionsPoints) {
			assign$1();
			if (!Array.isArray(arrayFuncs)) arrayFuncs = [arrayFuncs];
			optionsPoints = optionsPoints || {};
			if (optionsPoints.t === undefined) optionsPoints.t = optionsPoints.options && optionsPoints.options.player ? optionsPoints.options.player.getSettings().options.playerOptions.min : 0;
			var options = optionsPoints.options || new Options(),
			    optionsDefault = new Options({ palette: options.palette });
			options.setW(optionsDefault);
			var wDefault = optionsDefault.scales.w.max;
			for (var i = 0; i < arrayFuncs.length; i++) {
						var item = arrayFuncs[i];
						if (Array.isArray(item)) arrayFuncs[i] = new THREE.Vector4(item[0] === undefined ? 0 : item[0], item[1] === undefined ? 0 : item[1], item[2] === undefined ? 0 : item[2], item[3] === undefined ? wDefault : item[3]);else if ((typeof item === 'undefined' ? 'undefined' : _typeof(item)) === "object" && item instanceof THREE.Vector2 === false && item instanceof THREE.Vector3 === false && item instanceof THREE.Vector4 === false) {
									if (item.vector === undefined) arrayFuncs[i] = new THREE.Vector4(item.x === undefined ? 0 : item.x, item.y === undefined ? 0 : item.y, item.z === undefined ? 0 : item.z, item.w === undefined ? 0 : item.w);else if (item.vector instanceof THREE.Vector2 === true || item.vector instanceof THREE.Vector3 === true || item.vector instanceof THREE.Vector4 === true) {
												if (item.vector instanceof THREE.Vector2 === true) arrayFuncs[i].vector = new THREE.Vector3(item.vector.x === undefined ? 0 : item.vector.x, item.vector.y === undefined ? 0 : item.vector.y, item.vector.z === undefined ? 0 : item.vector.z);
									} else {
												if (item.vector.length === 4) arrayFuncs[i].vector = new THREE.Vector4(item.vector[0] === undefined ? 0 : item.vector[0], item.vector[1] === undefined ? 0 : item.vector[1], item.vector[2] === undefined ? 0 : item.vector[2], item.vector[3] === undefined ? 0 : item.vector[3]);else if (item.vector.length === 3) arrayFuncs[i].vector = new THREE.Vector3(item.vector[0] === undefined ? 0 : item.vector[0], item.vector[1] === undefined ? 0 : item.vector[1], item.vector[2] === undefined ? 0 : item.vector[2]);else if (item.vector.length < 3) arrayFuncs[i].vector = new THREE.Vector4(item.vector[0] === undefined ? 0 : item.vector[0], item.vector[1] === undefined ? 0 : item.vector[1]);else console.error('Player.getPoints(...) falied! item.vector.length = ' + item.vector.length);
									}
						}
			}
			var points = [];
			for (var i = 0; i < arrayFuncs.length; i++) {
						var getAxis = function getAxis(axisName) {
									if (typeof funcs === "number") funcs = new THREE.Vector4(funcs, 0, 0, 0);
									if (funcs instanceof THREE.Vector2 || funcs instanceof THREE.Vector3 || funcs instanceof THREE.Vector4) {
												var value = Player$1.execFunc(funcs, axisName, optionsPoints.t, options);
												return value;
									}
									if (funcs.vector === undefined) {
												console.error('Player.getAxis().getPoints(): funcs.vector = ' + funcs.vector);
												return;
									}
									if (funcs.name !== undefined) funcs.vector.name = funcs.name;
									if (funcs.trace) funcs.vector.trace = funcs.trace;
									if (funcs.controllers) funcs.vector.controllers = funcs.controllers;
									if (funcs.cameraTarget) {
												funcs.vector.cameraTarget = funcs.cameraTarget;
												delete funcs.cameraTarget;
									}
									arrayFuncs[i] = funcs.vector;
									funcs = funcs.vector;
									return Player$1.execFunc(funcs, axisName, optionsPoints.t, options);
						};
						var funcs = arrayFuncs[i];
						var point = funcs.vector instanceof THREE.Vector3 === true ? new THREE.Vector3(getAxis('x'), getAxis('y'), getAxis('z')) : new THREE.Vector4(getAxis('x'), getAxis('y'), getAxis('z'), getAxis('w'));
						if (funcs.cameraTarget) {
									funcs.cameraTarget.bodefault = false;
									if (funcs.cameraTarget.boLook === undefined) funcs.cameraTarget.boLook = true;
									options.playerOptions.cameraTarget.init(funcs.cameraTarget, options);
						}
						points.push(point);
			}
			return points;
};
var boColorWarning = true;
Player$1.getColors = function (arrayFuncs, optionsColor) {
			assign$1();
			if (!Array.isArray(arrayFuncs)) arrayFuncs = [arrayFuncs];
			optionsColor = optionsColor || {};
			optionsColor.options = optionsColor.options || {};
			if (optionsColor.positions !== undefined && Array.isArray(arrayFuncs) && arrayFuncs.length !== optionsColor.positions.count) {
						console.error('getColors failed! arrayFuncs.length: ' + arrayFuncs.length + ' != positions.count: ' + optionsColor.positions.count);
						return optionsColor.colors;
			}
			var length = Array.isArray(arrayFuncs) ? arrayFuncs.length : optionsColor.positions.count;
			optionsColor.colors = optionsColor.colors || [];
			var colors = [];
			if (!optionsColor.options.palette) optionsColor.options.setPalette();
			for (var i = 0; i < length; i++) {
						var iColor = 3 * i;
						if (iColor >= optionsColor.colors.length) {
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
															} else {
																		optionsColor.options.setW();
																		min = optionsColor.options.scales.w.min;max = optionsColor.options.scales.w.max;
															}
															if (w instanceof Function && !optionsColor.options.player && boColorWarning) {
																		boColorWarning = false;
															}
															var t = optionsColor.options.playerOptions ? optionsColor.options.playerOptions.min : 0;
															var color = optionsColor.options.palette.toColor(funcs === undefined ? new THREE.Vector4().fromBufferAttribute(optionsColor.positions, i).w : w instanceof Function ? w(t) : typeof w === "string" ? Player$1.execFunc(funcs, 'w', t, optionsColor.options) : w === undefined ? new THREE.Vector4().w : w, min, max);
															colors.push(color.r, color.g, color.b);
												} else if (optionsColor.colors instanceof THREE.Float32BufferAttribute) vector = new THREE.Vector3(1, 1, 1);else if (optionsColor.color != undefined) {
												var _color = new THREE.Color(optionsColor.color);
												colors.push(_color.r, _color.g, _color.b);
									} else colors.push(1, 1, 1);
						} else colors.push(optionsColor.colors[iColor], optionsColor.colors[iColor + 1], optionsColor.colors[iColor + 2]);
						if (optionsColor.opacity instanceof Array) colors.push(i < optionsColor.opacity.length ? optionsColor.opacity[i] : 1);else colors.push(1);
			}
			optionsColor.colors = colors;
			return optionsColor.colors;
};
Player$1.traceLine =
function traceLine(options) {
			classCallCheck(this, traceLine);
			var line;
			var arrayLines = [];
			assign$1();
			if (!options.player) {
						return;
			}
			this.isVisible = function () {
						if (!options.player) return false;
						if (line) return line.visible;
						if (arrayLines.length === 0) return false;
						return arrayLines[0].visible;
			};
			this.visible = function (visible) {
						if (!options.player) return false;
						if (line) {
									line.visible = visible;
									return;
						}
						arrayLines.forEach(function (line) {
									line.visible = visible;
						});
			};
			this.addPoint = function (mesh, index, color) {
						var attributesPosition = mesh.geometry.attributes.position;
						var point = attributesPosition.itemSize >= 4 ? new THREE.Vector4(0, 0, 0, 0) : new THREE.Vector3();
						point.fromArray(attributesPosition.array, index * attributesPosition.itemSize);
						var sceneIndex = options.player ? options.player.getSelectSceneIndex() : 0;
						if (options.playerOptions.max === null) {
									sceneIndex = Math.abs(sceneIndex);
									if (sceneIndex < arrayLines.length - 1) {
												while (sceneIndex < arrayLines.length - 1) {
															mesh.remove(arrayLines[arrayLines.length - 1]);
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
									var _line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ vertexColors: true }));
									mesh.add(_line);
									if (arrayLines[0]) _line.visible = arrayLines[0].visible;
									point = new THREE.Vector3().copy(point);
									var itemSize = _line.geometry.attributes.position.itemSize;
									point.toArray(_line.geometry.attributes.position.array, 1 * itemSize);
									var point0 = arrayLines.length === 0 ? point : new THREE.Vector3().fromArray(arrayLines[arrayLines.length - 1].geometry.attributes.position.array, 1 * itemSize);
									point0.toArray(_line.geometry.attributes.position.array, 0 * itemSize);
									_line.geometry.attributes.position.needsUpdate = true;
									if (color === undefined) color = new THREE.Color(1, 1, 1);
									Player$1.setColorAttribute(_line.geometry.attributes, 0, arrayLines.length === 0 ? color : new THREE.Color().fromArray(arrayLines[arrayLines.length - 1].geometry.attributes.color.array, 1 * itemSize));
									Player$1.setColorAttribute(_line.geometry.attributes, 1, color);
									arrayLines.push(_line);
									return;
						}
						if (line === undefined) {
									var _geometry = new THREE.BufferGeometry();
									var MAX_POINTS;
									if (options.playerOptions.max !== null) {
												if (options.playerOptions && options.playerOptions.marks) MAX_POINTS = options.playerOptions.marks;else if (options.player && options.player.marks) MAX_POINTS = options.player.marks;else {
															console.error('Player.traceLine: MAX_POINTS = ' + MAX_POINTS + '. Create Player first or remove all trace = true from all items of the arrayFuncs');
															return;
												}
									} else MAX_POINTS = sceneIndex + 1;
									var _positions = new Float32Array(MAX_POINTS * 3);
									_geometry.setAttribute('position', new THREE.BufferAttribute(_positions, 3));
									var _colors = new Float32Array(MAX_POINTS * 3);
									_geometry.setAttribute('color', new THREE.Float32BufferAttribute(_colors, 3));
									_geometry.setDrawRange(sceneIndex, sceneIndex);
									line = new THREE.Line(_geometry, new THREE.LineBasicMaterial({
												vertexColors: true
									}));
									line.visible = true;
									mesh.add(line);
						}
						if (line.geometry) {
									delete line.geometry.boundingSphere;
									line.geometry.boundingSphere = null;
						}
						point = new THREE.Vector3().copy(point);
						point.toArray(line.geometry.attributes.position.array, sceneIndex * line.geometry.attributes.position.itemSize);
						line.geometry.attributes.position.needsUpdate = true;
						if (color === undefined) color = new THREE.Color(1, 1, 1);
						Player$1.setColorAttribute(line.geometry.attributes, sceneIndex, color);
						var start = line.geometry.drawRange.start,
						    count = sceneIndex + 1 - start;
						if (start > sceneIndex) {
									var stop = start + line.geometry.drawRange.count;
									start = sceneIndex;
									count = stop - start;
						}
						line.geometry.setDrawRange(start, count);
			};
			this.remove = function () {
						if (line === undefined) return;
						line.geometry.dispose();
						line.material.dispose();
						line.parent.remove(line);
			};
};
Player$1.getItemSize = function (arrayFuncs) {
			assign$1();
			for (var i = 0; i < arrayFuncs.length; i++) {
						var func = arrayFuncs[i];
						if (func instanceof THREE.Vector4) return 4;
			}
			return 3;
};
Player$1.selectPlayScene = function (group) {
			var settings = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
			var t = settings.t !== undefined ? settings.t : 0,
			    index = settings.index !== undefined ? settings.index : undefined,
			    options = settings.options || new Options();
			group.userData.t = t;
			Player$1.selectMeshPlayScene(group, { t: t, options: options });
			function selectMeshPlayScene(group) {
						group.children.forEach(function (mesh) {
									if (mesh instanceof THREE.Group) selectMeshPlayScene(mesh);else Player$1.selectMeshPlayScene(mesh, { t: t, options: options });
						});
			}
			selectMeshPlayScene(group);
			options.playerOptions.cameraTarget.setCameraTarget(options);
			var cameraTarget = options.playerOptions.cameraTarget.get();
			if (cameraTarget && cameraTarget.setCameraPosition) cameraTarget.setCameraPosition(index === undefined);
};
var THREE;
function assign$1() {
			if (!three$1.isThree()) {
						console.warn('Player: can not assign. Set THREE first.');
						return;
			}
			THREE = three$1.THREE;
			Object.assign(THREE.BufferGeometry.prototype, {
						setFromPoints: function setFromPoints(points, itemSize) {
									itemSize = itemSize || 3;
									var position = [];
									for (var i = 0, l = points.length; i < l; i++) {
												var point = points[i];
												position.push(point.x, point.y, point.z || 0);
												if (itemSize >= 4) position.push(point.w || 0);
									}
									this.setAttribute('position', new THREE.Float32BufferAttribute(position, itemSize));
									return this;
						}
			});
			Object.assign(THREE.Vector4.prototype, {
						multiply: function multiply(v) {
									this.x *= v.x;
									this.y *= v.y;
									this.z *= v.z;
									if (v.w !== undefined) this.w *= v.w;
									return this;
						}
			});
			Object.assign(THREE.Vector4.prototype, {
						add: function add(v, w) {
									if (w !== undefined) {
												console.warn('THREE.Vector4: .add() now only accepts one argument. Use .addVectors( a, b ) instead.');
												return this.addVectors(v, w);
									}
									this.x += v.x;
									this.y += v.y;
									this.z += v.z;
									if (v.w !== undefined) this.w += v.w;
									return this;
						}
			});
			Object.assign(THREE.Points.prototype, {
						raycast: function raycast(raycaster, intersects) {
									var _inverseMatrix = new THREE.Matrix4();
									var _ray = new THREE.Ray();
									var _sphere = new THREE.Sphere();
									var _position = new THREE.Vector3();
									function testPoint(point, index, localThresholdSq, matrixWorld, raycaster, intersects, object) {
												var rayPointDistanceSq = _ray.distanceSqToPoint(point);
												if (rayPointDistanceSq < localThresholdSq) {
															var intersectPoint = new THREE.Vector3();
															_ray.closestPointToPoint(point, intersectPoint);
															intersectPoint.applyMatrix4(matrixWorld);
															var distance = raycaster.ray.origin.distanceTo(intersectPoint);
															if (distance < raycaster.near || distance > raycaster.far) return;
															intersects.push({
																		distance: distance,
																		distanceToRay: Math.sqrt(rayPointDistanceSq),
																		point: intersectPoint,
																		index: index,
																		face: null,
																		object: object
															});
												}
									}
									var geometry = this.geometry;
									var matrixWorld = this.matrixWorld;
									var threshold = raycaster.params.Points.threshold;
									if (geometry.boundingSphere === null) geometry.computeBoundingSphere();
									_sphere.copy(geometry.boundingSphere);
									_sphere.applyMatrix4(matrixWorld);
									_sphere.radius += threshold;
									if (raycaster.ray.intersectsSphere(_sphere) === false) return;
									_inverseMatrix.copy(matrixWorld).invert();
									_ray.copy(raycaster.ray).applyMatrix4(_inverseMatrix);
									var localThreshold = threshold / ((this.scale.x + this.scale.y + this.scale.z) / 3);
									var localThresholdSq = localThreshold * localThreshold;
									if (geometry.isBufferGeometry) {
												var index = geometry.index;
												var attributes = geometry.attributes;
												var positions = attributes.position.array;
												var itemSize = attributes.position.itemSize;
												if (index !== null) {
															var indices = index.array;
															for (var i = 0, il = indices.length; i < il; i++) {
																		var a = indices[i];
																		_position.fromArray(positions, a * itemSize);
																		testPoint(_position, a, localThresholdSq, matrixWorld, raycaster, intersects, this);
															}
												} else {
															for (var _i = 0, l = positions.length / itemSize; _i < l; _i++) {
																		_position.fromArray(positions, _i * itemSize);
																		testPoint(_position, _i, localThresholdSq, matrixWorld, raycaster, intersects, this);
															}
												}
									} else {
												var vertices = geometry.vertices;
												for (var _i2 = 0, _l = vertices.length; _i2 < _l; _i2++) {
															testPoint(vertices[_i2], _i2, localThresholdSq, matrixWorld, raycaster, intersects, this);
												}
									}
						}
			});
}
Player$1.assign = function () {
			assign$1();
};

/**
 * @module myObject
 * @description base class for my threejs objects
 * @author [Andrej Hristoliubov]{@link https://github.com/anhr}
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
var sMyObject = 'MyObject';
var MyObject = function () {
	function MyObject() {
		var _this2 = this;
		var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
		var vertices = arguments[1];
		classCallCheck(this, MyObject);
		var _this = this;
		settings.object = settings.object || {};
		settings.object.geometry = settings.object.geometry || {};
		if (!settings.object.geometry.position || !settings.object.geometry.position.isPositionProxy) settings.object.geometry.position = new Proxy(settings.object.geometry.position || [], {
			get: function get$$1(positions, name) {
				var positionId = parseInt(name);
				if (!isNaN(positionId)) {
					return new Proxy(positions[positionId], {
						set: function set$$1(position, name, value) {
							var axisId = parseInt(name);
							if (!isNaN(axisId)) {
								position[axisId] = value;
								settings.bufferGeometry.userData.position[positionId][axisId] = value;
								return true;
							}
							position[name] = value;
							return true;
						}
					});
				}
				switch (name) {
					case 'isPositionProxy':
						return true;
				}
				return positions[name];
			}
		});
		var THREE = three$1.THREE;
		if (!settings.bufferGeometry) settings.bufferGeometry = new THREE.BufferGeometry();
		this.bufferGeometry = settings.bufferGeometry;
		if (vertices)
			settings.object.geometry.position = settings.object.geometry.position || vertices;
		var createPositionAttribute = function createPositionAttribute(pointLength, pointsLength) {
			var MAX_POINTS = settings.object.geometry.MAX_POINTS;
			if (MAX_POINTS != undefined) settings.bufferGeometry.setDrawRange(0, pointsLength * 2 - 1);
			var positions = new Float32Array((MAX_POINTS != undefined ? MAX_POINTS : pointsLength) * pointLength);
			settings.bufferGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, pointLength));
			settings.bufferGeometry.userData.position = new Proxy(settings.bufferGeometry.attributes.position, {
				get: function get$$1(position, name) {
					var positionId = parseInt(name);
					if (!isNaN(positionId)) {
						var positionOffset = positionId * position.itemSize,
						    array = position.array;
						var positionItem = new Proxy([], {
							get: function get$$1(vertice, name) {
								var axisId = parseInt(name);
								if (!isNaN(axisId)) {
									if (axisId >= position.itemSize) {
										return;
									}
									return array[positionOffset + axisId];
								}
								switch (name) {
									case 'forEach':
										return function (item) {
											for (var _axisId = 0; _axisId < position.itemSize; _axisId++) {
												item(array[positionOffset + _axisId], _axisId);
											}
										};
									case 'length':
										return position.itemSize;
									case 'toJSON':
										return function (item) {
											var res = '[';
											positionItem.forEach(function (axis) {
												res += axis + ', ';
											});
											return res.substring(0, res.length - 2) + ']';
										};
									case 'x':
										return array[positionOffset + 0];
									case 'y':
										return array[positionOffset + 1];
									case 'z':
										return array[positionOffset + 2];
									case 'w':
										{
											if (position.itemSize < 4) return;
											return array[positionOffset + 3];
										}
								}
								return vertice[name];
							},
							set: function set$$1(vertice, name, value) {
								var axisId = parseInt(name);
								if (!isNaN(axisId)) {
									array[positionOffset + axisId] = value;
									return true;
								}
								vertice[name] = value;
								return true;
							}
						});
						return positionItem;
					}
					switch (name) {
						case 'length':
							return position.count;
					}
					console.error(sMyObject + ': get settings.bufferGeometry.userData.position. Invalid name: ' + name);
					return position[name];
				}
			});
			if (_this.setW) _this.setW();
			var itemSize = settings.object.geometry.opacity ? 4 : 3,
			    colors = new Float32Array((MAX_POINTS != undefined ? MAX_POINTS : pointsLength) * itemSize);
			settings.bufferGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, itemSize));
		};
		this.setPositionAttributeFromPoints = function (points, boCreatePositionAttribute) {
			if (boCreatePositionAttribute) delete settings.bufferGeometry.attributes.position;
			if (!settings.bufferGeometry.attributes.position) {
				createPositionAttribute(_this2.pointLength ? _this2.pointLength() : points[0].w === undefined ? 3 : 4, points.length);
				for (var i = 0; i < points.length; i++) {
					_this2.setPositionAttributeFromPoint(i);
				}
			}
			return settings.bufferGeometry;
		};
		this.verticeColor = function (i, vertice) {
			var colors = settings.object.geometry.colors;
			var colorsId = i * 3;
			if (colors && colors[colorsId] != undefined) return [colors[colorsId], colors[colorsId + 1], colors[colorsId + 2]];
			var color = settings.object.color;
			if (color != undefined && (typeof color === 'undefined' ? 'undefined' : _typeof(color)) != 'object') {
				return new THREE.Color(_this.color());
			}
			var getDefaultColor = function getDefaultColor() {
				return new THREE.Color(_this.color());
			};
			var w = void 0;
			if (vertice) w = vertice.w;else if (!_this.getPoint) {
				var position = _this.bufferGeometry.attributes.position;
				if (position.itemSize != 4) return getDefaultColor();
				w = new THREE.Vector4().fromBufferAttribute(position, i).w;
			} else w = _this.getPoint(i).w;
			if (w === undefined) return getDefaultColor();
			return w;
		};
		this.setPositionAttributeFromPoint = function (i, vertice) {
			var attributes = settings.bufferGeometry.attributes,
			    position = attributes.position,
			    itemSize = position.itemSize;
			vertice = vertice || _this.getPoint(i);
			var positionId = i * itemSize,
			    array = position.array;
			array[positionId++] = vertice.x != undefined ? vertice.x : vertice[0] != undefined ? vertice[0] : 0;
			if (itemSize > 1) array[positionId++] = vertice.y != undefined ? vertice.y : vertice[1] != undefined ? vertice[1] : 0;
			if (itemSize > 2) array[positionId++] = vertice.z != undefined ? vertice.z : vertice[2] != undefined ? vertice[2] : 0;
			var w = vertice.w;
			if (itemSize > 3) array[positionId] = w;
			var colorId = i * attributes.color.itemSize;
			array = attributes.color.array;
			var verticeColor = _this2.verticeColor(i, vertice);
			if (typeof verticeColor === 'number') {
				if (settings.options) {
					var wScale = settings.options.scales.w;
					Player$1.setColorAttribute(attributes, i, settings.options.palette.toColor(w, wScale.min, wScale.max));
				}
				colorId += attributes.color.itemSize - 1;
			} else if (Array.isArray(verticeColor)) verticeColor.forEach(function (item) {
				return array[colorId++] = item;
			});else if (verticeColor instanceof THREE.Color) {
				array[colorId++] = verticeColor.r;
				array[colorId++] = verticeColor.g;
				array[colorId++] = verticeColor.b;
			} else console.error(sMyObject + '.setPositionAttributeFromPoint: Invalid verticeColor = ' + verticeColor);
			if (attributes.color.itemSize > 3) _this2.verticeOpacity(i);
		};
		this.verticeOpacity = function (i, transparent, opacity) {
			var color = settings.bufferGeometry.attributes.color;
			if (color.itemSize != 4) {
				console.error(sMyObject + '.verticeOpacity: Invalid color.itemSize = ' + color.itemSize);
				return;
			}
			var array = color.array;
			var verticeOpacity = settings.object.geometry.opacity ? settings.object.geometry.opacity[i] : undefined;
			array[color.itemSize * i + 3] = transparent ? opacity : verticeOpacity === undefined ? 1 : verticeOpacity;
			color.needsUpdate = true;
		};
		this.verticesOpacity = function (transparent, opacity) {
			var color = settings.bufferGeometry.attributes.color;
			if (color && color.itemSize > 3) {
				for (var i = 0; i < color.count; i++) {
					_this2.verticeOpacity(i, transparent, opacity);
				}
			} else {
				var object3D = _this.object3D;
				if (object3D) {
					object3D.material.transparent = transparent;
					object3D.material.opacity = transparent ? opacity : 1;
					object3D.material.needsUpdate = true;
				} else console.error(sMyObject + '.verticesOpacity: Invalid object3D');
			}
		};
		this.color = function () {
			var color = settings.object.color != undefined ? settings.object.color : settings.pointsOptions != undefined ? settings.pointsOptions.color : undefined;
			return color != undefined ? color : _this2.defaultColor;
		};
	}
	createClass(MyObject, [{
		key: 'defaultColor',
		get: function get$$1() {
			return 'white';
		}
	}, {
		key: 'isOpacity',
		get: function get$$1() {
			if (this.bufferGeometry.attributes.color.itemSize > 3) {
				if (!this.object3D.material.transparent) console.error(sMyObject + '.isOpacity: invalid this.object3D.material.transparent = ' + this.object3D.material.transparent);
				return true;
			}
			return false;
		}
	}]);
	return MyObject;
}();

/**
 * @module getShaderMaterialPoints
 * @description get THREE.Points with THREE.ShaderMaterial material
 * @author [Andrej Hristoliubov]{@link https://github.com/anhr}
 * @copyright 2011 Data Arts Team, Google Creative Lab
 *
 * @license under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */
var getCurrentScript$1 = function getCurrentScript() {
	if (document.currentScript && document.currentScript.src !== '') return document.currentScript.src;
	var scripts = document.getElementsByTagName('script'),
	    str = scripts[scripts.length - 1].src;
	if (str !== '') return src;
	return new Error().stack.match(/(https?:[^:]*)/)[0];
};
var getCurrentScriptPath$1 = function getCurrentScriptPath() {
	var script = getCurrentScript$1(),
	    path = script.substring(0, script.lastIndexOf('/'));
	return path;
};
var currentScriptPath$1 = getCurrentScriptPath$1();
var _vertex_text = {
	array: [],
	setItem: function setItem(path, text) {
		this.array.push({ path: path, text: text });
	},
	getItem: function getItem(path) {
		for (var i = 0; i < this.array.length; i++) {
			if (this.array[i].path === path) return this.array[i].text;
		}
	}
};
var _fragment_text = {
	array: [],
	setItem: function setItem(path, text) {
		this.array.push({ path: path, text: text });
	},
	getItem: function getItem(path) {
		for (var i = 0; i < this.array.length; i++) {
			if (this.array[i].path === path) return this.array[i].text;
		}
	}
};
var getShaderMaterialPoints = function (_MyObject) {
	inherits(getShaderMaterialPoints, _MyObject);
	function getShaderMaterialPoints(group, arrayFuncs, onReady) {
		var settings = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
		classCallCheck(this, getShaderMaterialPoints);
		var _this = possibleConstructorReturn(this, (getShaderMaterialPoints.__proto__ || Object.getPrototypeOf(getShaderMaterialPoints)).call(this, settings, arrayFuncs));
		var THREE = three$1.THREE,
		    tMin = settings.pointsOptions === undefined ? settings.tMin === undefined ? 0 : settings.tMin : settings.pointsOptions.tMin === undefined ? 0 : settings.pointsOptions.tMin;
		settings.options = settings.options || new Options();
		settings.pointsOptions = settings.pointsOptions || {};
		Player$1.assign();
		var geometry;
		if (arrayFuncs instanceof THREE.BufferGeometry) {
			geometry = arrayFuncs;
			arrayFuncs = [];
			for (var i = 0; i < geometry.attributes.position.count; i++) {
				arrayFuncs.push(new THREE.Vector3().fromBufferAttribute(geometry.attributes.position, i));
			}
		} else if (typeof arrayFuncs === 'function') geometry = arrayFuncs();else {
			if (settings.pointsOptions.bufferGeometry) geometry = settings.pointsOptions.bufferGeometry;else {
				var points = Player$1.getPoints(arrayFuncs, { options: settings.options, group: group, t: tMin });
				_this.getPoint = function (i) {
					return points[i];
				};
				geometry = _this.setPositionAttributeFromPoints(points);
			}
		}
		var indexArrayCloud = settings.pointsOptions.frustumPoints ? settings.pointsOptions.frustumPoints.pushArrayCloud(geometry) : undefined;
		var texture = new THREE.TextureLoader().load(currentScriptPath$1 + "/textures/point.png", function (texture) {}, function () {}, function () {
			console.error('THREE.TextureLoader: error');
		});
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		var uniforms = {
			pointTexture: { value: texture },
			pointSize: {
				value: settings.pointsOptions !== undefined && settings.pointsOptions.shaderMaterial !== undefined && settings.pointsOptions.shaderMaterial.point !== undefined ? settings.pointsOptions.shaderMaterial.point.size : settings.options.point.size
			}
		};
		var cloud;
		if (settings.pointsOptions !== undefined && settings.pointsOptions.uniforms !== undefined) cloud = settings.pointsOptions.uniforms(uniforms);
		function loadShaderText(onload, path) {
			var shaderText = {};
			function ShaderLoader(vertex_url, fragment_url, onLoad, options) {
				options = options || {};
				var vertex_text = _vertex_text.getItem(vertex_url);
				function loadFragment() {
					var fragment_text = _fragment_text.getItem(fragment_url);
					if (!fragment_text) {
						var fragment_loader = new THREE.FileLoader(THREE.DefaultLoadingManager);
						fragment_loader.setResponseType('text');
						fragment_loader.load(fragment_url, function (fragment_text) {
							_fragment_text.setItem(fragment_url, fragment_text);
							onLoad(vertex_text, fragment_text);
						}, options.onProgress, options.onError);
					} else onLoad(vertex_text, fragment_text);
				}
				if (!vertex_text) {
					var vertex_loader = new THREE.FileLoader(THREE.DefaultLoadingManager);
					vertex_loader.setResponseType('text');
					vertex_loader.load(vertex_url, function (vertex_text_new) {
						_vertex_text.setItem(vertex_url, vertex_text_new);
						vertex_text = vertex_text_new;
						loadFragment();
					}, options.onProgress, options.onError);
				} else {
					loadFragment();
				}
			}
			path = path || {};
			path.vertex = path.vertex || currentScriptPath$1 + "/getShaderMaterialPoints/vertex.c";
			path.fragment = path.fragment || currentScriptPath$1 + "/getShaderMaterialPoints/fragment.c";
			ShaderLoader(path.vertex, path.fragment, function (vertex, fragment) {
				shaderText.vertex = vertex;
				shaderText.fragment = fragment;
				onload(shaderText);
			}, {
				onError: function onError(event) {
					console.error(event.srcElement.responseURL + ' status = ' + event.srcElement.status + ' ' + event.srcElement.statusText);
				}
			});
		}
		loadShaderText(function (shaderText) {
			if (cloud !== undefined) {
				cloud.editShaderText(shaderText);
			}
			var points = new THREE.Points(geometry, new THREE.ShaderMaterial({
				uniforms: uniforms,
				vertexShader: shaderText.vertex,
				fragmentShader: shaderText.fragment,
				transparent: true
			}));
			points.userData.shaderMaterial = settings.pointsOptions === undefined ? settings.shaderMaterial : settings.pointsOptions.shaderMaterial;
			if (settings.options.saveMeshDefault !== undefined) settings.options.saveMeshDefault(points);
			if (settings.pointsOptions && settings.pointsOptions.frustumPoints) points.userData.cloud = { indexArray: indexArrayCloud };
			points.userData.shaderMaterial = settings.pointsOptions === undefined ? settings.shaderMaterial : settings.pointsOptions.shaderMaterial;
			onReady(points);
			if (points.userData.boFrustumPoints) {
				settings.pointsOptions.group.children.forEach(function (mesh) {
					settings.options.frustumPoints.updateCloudPoint(mesh);
				});
			}
			if (points.material.uniforms.palette !== undefined) points.material.uniforms.palette.value.needsUpdate = true;
			if (points.material.uniforms.cloudPoints !== undefined) points.material.uniforms.cloudPoints.value.needsUpdate = true;
			var cameraTarget = settings.options.playerOptions.cameraTarget.get(settings.options);
			if (cameraTarget && cameraTarget.setCameraPosition) cameraTarget.setCameraPosition();
		}, settings.pointsOptions === undefined ? undefined : settings.pointsOptions.path);
		return _this;
	}
	return getShaderMaterialPoints;
}(MyObject);

/**
 * @module MyPoints
 * @description Array of my points.
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
var MyPoints = function (_MyObject) {
				inherits(MyPoints, _MyObject);
				function MyPoints(arrayFuncs, group, settings) {
								classCallCheck(this, MyPoints);
								var _this2 = possibleConstructorReturn(this, (MyPoints.__proto__ || Object.getPrototypeOf(MyPoints)).call(this, settings, arrayFuncs));
								var _this = _this2;
								var THREE = three$1.THREE;
								group = group || three$1.scene;
								if (typeof arrayFuncs !== 'function' && arrayFuncs.length === 0) arrayFuncs.push(new THREE.Vector3());
								settings.pointsOptions = settings.pointsOptions || {};
								var pointsOptions = settings.pointsOptions;
								settings.options = settings.options || new Options();
								var options = settings.options;
								if (!options.boOptions) options = new Options(options);
								pointsOptions.tMin = pointsOptions.tMin || 0;
								pointsOptions.name = pointsOptions.name || '';
								pointsOptions.position = pointsOptions.position || new THREE.Vector3(0, 0, 0);
								pointsOptions.scale = pointsOptions.scale || new THREE.Vector3(1, 1, 1);
								pointsOptions.rotation = pointsOptions.rotation || new THREE.Vector3();
								pointsOptions.group = group;
								if (pointsOptions.name !== '' && pointsOptions.elements) {
												if (pointsOptions.elements.pointsName === null) console.warn('MyPoints: Points name element is not exists');
												if (!pointsOptions.elements.pointsName) pointsOptions.elements.pointsName = 'pointsName';
												var elPointsName = typeof pointsOptions.elements.pointsName === "string" ? document.getElementById(pointsOptions.elements.pointsName) : pointsOptions.elements.pointsName;
												if (elPointsName) elPointsName.innerHTML = pointsOptions.name;else console.warn('MyPoints: Element with id: "' + pointsOptions.elements.pointsName + '" is not exists');
								}
								Player$1.assign();
								if (pointsOptions.shaderMaterial !== false) new getShaderMaterialPoints(group, arrayFuncs, function (points) {
												Points(points);
								}, {
												options: options,
												pointsOptions: pointsOptions,
												object: { geometry: { position: settings.object.geometry.position, opacity: settings.object.geometry.opacity } },
												bufferGeometry: settings.bufferGeometry
								});else {
												var buffer = void 0;
												if (typeof arrayFuncs === 'function') buffer = arrayFuncs();else {
																var _points = Player$1.getPoints(arrayFuncs, { options: options, group: group, t: pointsOptions.tMin });
																_this2.getPoint = function (i) {
																				return _points[i];
																};
																buffer = _this2.setPositionAttributeFromPoints(_points);
												}
												var points = new THREE.Points(buffer, new THREE.PointsMaterial({
																size: options.point.size / options.point.sizePointsMaterial,
																vertexColors: true,
																transparent: settings.pointsOptions.opacity ? true :
																undefined
												}));
												if (pointsOptions.frustumPoints) points.userData.cloud = {
																indexArray: pointsOptions.frustumPoints.pushArrayCloud(points.geometry)
												};
												Points(points);
								}
								function Points(points) {
												_this.object3D = points;
												points.name = pointsOptions.name;
												if (pointsOptions.pointIndexes !== undefined) points.userData.pointIndexes = function (pointIndex) {
																return pointsOptions.pointIndexes(pointIndex);
												};
												if (pointsOptions.pointName !== undefined) points.userData.pointName = function (pointIndex) {
																return pointsOptions.pointName(pointIndex);
												};
												if (pointsOptions.controllers !== undefined) {
																points.userData.addControllers = pointsOptions.addControllers;
																points.userData.controllers = function ()                   {
																				return pointsOptions.controllers();
																};
												}
												if (settings.pointsOptions.raycaster) points.userData.raycaster = settings.pointsOptions.raycaster;
												var arrayFuncsPlayer;
												if (arrayFuncs instanceof THREE.BufferGeometry) {
																arrayFuncsPlayer = [];
																for (var i = 0; i < arrayFuncs.attributes.position.count; i++) {
																				arrayFuncsPlayer.push(new THREE.Vector3().fromBufferAttribute(arrayFuncs.attributes.position, i));
																}
												} else arrayFuncsPlayer = arrayFuncs;
												points.userData.player = {
																arrayFuncs: arrayFuncsPlayer,
																selectPlayScene: function selectPlayScene(t) {
																				setPositions(t);
																				setScales(t);
																				setRotations(t);
																}
												};
												function setPositions(t) {
																t = t || pointsOptions.tMin;
																function setPosition(axisName) {
																				points.position[axisName] = typeof pointsOptions.position[axisName] === "function" ? pointsOptions.position[axisName](t, options.a, options.b) : pointsOptions.position[axisName];
																}
																setPosition('x');
																setPosition('y');
																setPosition('z');
												}
												setPositions();
												function setScales(t) {
																t = t || pointsOptions.tMin;
																function setScale(axisName) {
																				points.scale[axisName] = typeof pointsOptions.scale[axisName] === "function" ? pointsOptions.scale[axisName](t, options.a, options.b) : pointsOptions.scale[axisName];
																}
																setScale('x');
																setScale('y');
																setScale('z');
												}
												setScales();
												function setRotations(t) {
																t = t || pointsOptions.tMin;
																function setRotation(axisName) {
																				points.rotation[axisName] = typeof pointsOptions.rotation[axisName] === "function" ? pointsOptions.rotation[axisName](t, options.a, options.b) : pointsOptions.rotation[axisName];
																				while (points.rotation[axisName] < 0) {
																								points.rotation[axisName] += Math.PI * 2;
																				}while (points.rotation[axisName] > Math.PI * 2) {
																								points.rotation[axisName] -= Math.PI * 2;
																				}
																}
																setRotation('x');
																setRotation('y');
																setRotation('z');
												}
												setRotations();
												group.add(points);
												points.userData.myObject = _this;
												points.userData.opacity = function (opacity) {
																_this.verticesOpacity(false, opacity);
												};
												if (pointsOptions.boFrustumPoints) points.userData.boFrustumPoints = pointsOptions.boFrustumPoints;
												if (options.guiSelectPoint) options.guiSelectPoint.addMesh(points);
												if (options.eventListeners) options.eventListeners.addParticle(points);
												if (pointsOptions.onReady !== undefined) pointsOptions.onReady(points);
												if (!points.userData.boFrustumPoints && options.raycaster && options.raycaster.addParticle) options.raycaster.addParticle(points);
								}
								return _this2;
				}
				return MyPoints;
}(MyObject);

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
var optionsStyle$1 = {
	tag: 'style'
};var getCurrentScript$2 = function getCurrentScript() {
	if (document.currentScript && document.currentScript.src !== '') return document.currentScript.src;
	var scripts = document.getElementsByTagName('script'),
	    str = scripts[scripts.length - 1].src;
	if (str !== '') return src;
	return new Error().stack.match(/(https?:[^:]*)/)[0];
};
var getCurrentScriptPath$2 = function getCurrentScriptPath() {
	var script = getCurrentScript$2(),
	    path = script.substring(0, script.lastIndexOf('/'));
	return path;
};
var currentScriptPath$2 = getCurrentScriptPath$2();
var arrayPath = currentScriptPath$2.split(/(.*)(\/build)/);
if (arrayPath[2] === '/build') currentScriptPath$2 = arrayPath[1];
arrayPath = currentScriptPath$2.split(/(.*)(\/canvasMenu)/);
if (arrayPath[2] === '/canvasMenu') currentScriptPath$2 = arrayPath[1] + '/DropdownMenu';
loadScript.sync(currentScriptPath$2 + '/styles/menu.css', optionsStyle$1);
loadScript.sync(currentScriptPath$2 + '/styles/gui.css', optionsStyle$1);
loadScript.sync(currentScriptPath$2 + '/styles/Decorations/transparent.css', optionsStyle$1);
loadScript.sync(currentScriptPath$2 + '/styles/Decorations/gradient.css', optionsStyle$1);
function create(arrayMenu, options) {
	options = options || {};
	options.elParent = options.elParent || document.querySelector('body');
	switch (options.decorations) {
		case 'Gradient':
		case 'Transparent':
		case 'Custom':
		case undefined:
			break;
		default:
			console.error('DropdownMenu.create: Invalid options.decorations: ' + options.decorations);
	}
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
				if (drop.up) elDropdownChild.style.top = '-' + elDropdownChild.offsetHeight + 'px';else elDropdownChild.style.top = elMenuButton.offsetHeight - 1 + 'px';
				if (drop.left) elDropdownChild.style.left = elMenuButton.offsetWidth - elDropdownChild.offsetWidth + 'px';
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
				if (itemItem.id) elName.id = itemItem.id;
				if (itemItem.title) elName.title = itemItem.title;
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
							elDropdownChild.style.top = elMenuButton.offsetHeight - 1 + 'px';
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
var DropdownMenu = {
  create: create
};

/**
 * @module CanvasMenu
 * @description My [dropdown menu]{@link https://github.com/anhr/commonNodeJS/tree/master/DropdownMenu} for canvas in my [three.js]{@link https://threejs.org/} projects.
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
var CanvasMenu =
function CanvasMenu(renderer) {
		var settings = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
		classCallCheck(this, CanvasMenu);
		if (!three$1.isThree()) {
				console.warn('CanvasMenu: Set THREE first.');
				return;
		}
		var THREE = three$1.THREE;
		settings.options = settings.options || new Options();
		var options = settings.options;
		if (!options.boOptions) {
				console.error('CanvasMenu: call options = new Options( options ) first');
				return;
		}
		if (options.canvasMenu === false) return;
		options.canvasMenu = this;
		var lang = {
				fullScreen: 'Full Screen',
				nonFullScreen: 'Non Full Screen'
		};
		var getLanguageCode = options.getLanguageCode;
		switch (getLanguageCode()) {
				case 'ru':
						lang.prevSymbolTitle = 'Кадр назад';
						lang.playTitle = 'Проиграть';
						lang.nextSymbolTitle = 'Кадр вперед';
						lang.pauseTitle = 'Пауза';
						lang.repeatOn = 'Повторять проигрывание';
						lang.repeatOff = 'Остановить повтор проигрывания';
						lang.controllerTitle = 'Текущее время.';
						lang.stereoEffects = 'Стерео эффекты';
						lang.mono = 'Моно';
						lang.sideBySide = 'Слева направо';
						lang.topAndBottom = 'Сверху вниз';
						break;
		}
		if (THREE && renderer instanceof THREE.WebGLRenderer !== true) {
				console.error('CanvasMenu: renderer is not THREE.WebGLRenderer');
				return;
		}
		var elCanvas = renderer.domElement,
		    elContainer = elCanvas.parentElement;
		if (elContainer.tagName !== "DIV") {
				console.error('CanvasMenu: elContainer.tagName = ' + elContainer.tagName);
				return;
		}
		var container = "container";
		if (!elContainer.classList.contains(container)) elContainer.classList.add(container);
		settings.menu = settings.menu || [];
		this.menu = settings.menu;
		if (settings.options.stereoEffect && settings.options.stereoEffect.createCanvasMenuItem) settings.options.stereoEffect.createCanvasMenuItem(this, { getLanguageCode: options.getLanguageCode });
		if (options.player) {
				options.player.createCanvasMenuItem(this, getLanguageCode);
		}
		CreateFullScreenSettings.RendererSetSize(renderer, this);
		var fullScreenSettings;
		if (settings.fullScreen !== undefined) {
				if (!settings.fullScreen.camera) {
						console.error('CanvasMenu: settings.fullScreen.camera = ' + settings.fullScreen.camera);
						return;
				}
				fullScreenSettings = new CreateFullScreenSettings(THREE, renderer, settings.fullScreen.camera, {
						canvasMenu: this,
						fullScreen: settings.fullScreen
				});
				if (options.canvas.fullScreen !== false) fullScreenSettings.setFullScreen(false, true);
				this.getFullScreenSettings = function (stereoEffect) {
						fullScreenSettings.setStereoEffect(stereoEffect);
						return fullScreenSettings;
				};
				this.isFullScreen = function () {
						return fullScreenSettings.isFullScreen();
				};
				this.setFullScreen = function (fullScreen) {
						return fullScreenSettings.setFullScreen(fullScreen);
				};
				if (!options.canvas.noButtonFullScreen) settings.menu.push({
						style: 'float: right;',
						id: "menuButtonFullScreen",
						onclick: function onclick(event) {
								fullScreenSettings.onclick();
						}
				});
		}
		if (options.player) options.player.addSlider();
		var elMenu = DropdownMenu.create(settings.menu, {
				elParent: typeof elContainer === "string" ? document.getElementById(elContainer) : elContainer,
				canvas: typeof elCanvas === "string" ? document.getElementById(elCanvas) : elCanvas,
				decorations: 'Transparent'
		});
		this.querySelector = function (selectors) {
				return elMenu.querySelector(selectors);
		};
		elMenu.addEventListener('mouseenter', function (event) {
				if (settings.options.dat) settings.options.dat.mouseenter = true;
				if (settings.onOver) settings.onOver(true);
		});
		elMenu.addEventListener('mouseleave', function (event) {
				if (settings.options.dat) settings.options.dat.mouseenter = false;
				if (settings.onOver) settings.onOver(false);
		});
		if (options.player) options.player.addSliderEvents();
		if (settings.fullScreen) {
				this.setFullScreenButton = function (fullScreen) {
						if (fullScreen === undefined) {
								if (options.canvas.fullScreen === false) fullScreen = false;else fullScreen = true;
						}
						var elMenuButtonFullScreen = elContainer.querySelector('#menuButtonFullScreen');
						if (elMenuButtonFullScreen === null) return true;
						if (fullScreen) {
								elMenuButtonFullScreen.innerHTML = '⤦';
								elMenuButtonFullScreen.title = lang.nonFullScreen;
						} else {
								elMenuButtonFullScreen.innerHTML = '⤢';
								elMenuButtonFullScreen.title = lang.fullScreen;
						}
						return true;
				};
				this.setFullScreenButton();
				if (settings.options.stereoEffect && settings.options.stereoEffect.settings && settings.options.stereoEffect.settings.spatialMultiplex !== StereoEffect.spatialMultiplexsIndexs.Mono) this.setFullScreen(false);
		}
		this.setSize = function (width) {
				if (elMenu === undefined) return;
				var itemWidth = 0,
				    elSlider;
				for (var i = 0; i < elMenu.childNodes.length; i++) {
						var menuItem = elMenu.childNodes[i];
						var computedStyle = window.getComputedStyle(menuItem),
						    styleWidth = parseInt(computedStyle["margin-left"]) + parseInt(computedStyle["margin-right"]) + parseInt(computedStyle["padding-left"]) + parseInt(computedStyle["padding-right"]);
						var elSliderCur = menuItem.querySelector('.slider');
						if (elSliderCur === null) itemWidth += menuItem.offsetWidth + styleWidth;else {
								elSlider = elSliderCur;
								itemWidth += styleWidth;
						}
				}
				if (!elSlider) return;
				var sliderWidth = width - itemWidth;
				if (sliderWidth > 0) {
						elSlider.parentElement.style.width = sliderWidth + 'px';
				}
		};
		var size = { set: function set$$1(width, height) {
						this.x = width;this.y = height;
				} };
		renderer.getSize(size);
		this.setSize(size.x, size.y);
		if (this.menu.length === 0) console.warn('CanvasMenu: menu is empty.');
};

/**
 * Remove all child objects of the object and call dispose on their geometry, material and texture.
 *
 * Thanks to https://stackoverflow.com/a/48768960/5175935
 *
 * @author [Andrej Hristoliubov]{@link https://github.com/anhr}
 * @author [欧阳维杰]{@link https://stackoverflow.com/users/6045817/%e6%ac%a7%e9%98%b3%e7%bb%b4%e6%9d%b0}
 *
 * @copyright 2011 Data Arts Team, Google Creative Lab
 *
 * @license under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */
function clearThree$1(obj) {
	while (obj.children.length > 0) {
		clearThree$1(obj.children[0]);
		obj.remove(obj.children[0]);
	}
	if (obj.geometry) {
		if (obj.geometry.attributes !== undefined) Object.keys(obj.geometry.attributes).forEach(function (prop) {
			obj.geometry.deleteAttribute(prop);
		});
		obj.geometry.dispose();
	}
	if (obj.material) {
		Object.keys(obj.material).forEach(function (prop) {
			if (!obj.material[prop]) return;
			if (typeof obj.material[prop].dispose === 'function') obj.material[prop].dispose();
		});
		if (obj.material.uniforms !== undefined) obj.material.uniforms.pointTexture.value.dispose();
		obj.material.dispose();
	}
}

/**
 * @module AxesHelper
 * @description An axis object to visualize the 1, 2 or 3 axes.
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
var AxesHelper =
function AxesHelper(group, options) {
	classCallCheck(this, AxesHelper);
	var THREE = three$1.THREE;
	var axesHelper = this;
	options = options || new Options();
	if (!options.boOptions) {
		console.error('AxesHelper: call options = new Options( options ) first');
		return;
	}
	if (options.axesHelper === false) return;
	options.camera.fov = options.camera.fov || 50;
	options.scales = options.scales || {};
	options.scales.color = options.scales.color || 'rgba(255, 255, 255, 0.5)';
	options.scales.text.textHeight = options.scales.text.textHeight || 0.04;
	options.scales.text.precision = options.scales.text.precision || 4;
	options.scales.text.rect = options.scales.text.rect || {};
	options.scales.text.rect.displayRect = options.scales.text.rect.displayRect !== undefined ? options.scales.text.rect.displayRect : true;
	options.scales.text.rect.borderRadius = options.scales.text.rect.borderRadius !== undefined ? options.scales.text.rect.borderRadius : 15;
	function setScale(axisName) {
		var scale = options.scales[axisName];
		if (!scale) return;
		if (scale.offset === undefined) scale.offset = 0.1;
		if (scale.zoomMultiplier === undefined) scale.zoomMultiplier = 1.1;
	}
	setScale('x');
	setScale('y');
	setScale('z');
	this.options = options;
	var groupAxesHelper = new THREE.Group();
	groupAxesHelper.userData.optionsSpriteText = {
		fontColor: options.scales.color,
		textHeight: options.scales.text.textHeight,
		fov: options.camera.fov,
		rect: options.scales.text.rect
	};
	group.add(groupAxesHelper);
	options.scales.posAxesIntersection = options.scales.posAxesIntersection || new THREE.Vector3();
	this.createAxis = function (axisName) {
		var group = new THREE.Group();
		group.visible = options.scales.display;
		var scale = options.scales[axisName];
		if (!scale.isAxis()) return;
		var color = options.scales.color,
		    opacity = 1;
		try {
			var array = options.scales.color.split(/rgba\(\.*/)[1].split(/\)/)[0].split(/, */);
			color = 'rgb(' + array[0] + ', ' + array[1] + ', ' + array[2] + ')';
			if (array[3] !== undefined) opacity = array[3];
		} catch (e) {}
		var lineAxis = new THREE.Line(new THREE.BufferGeometry().setFromPoints([
		new THREE.Vector3(
		axisName !== 'x' ? 0 : !options.scales.x ? 0
		: options.scales.x.min,
		axisName !== 'y' ? 0 : !options.scales.y ? 0
		: options.scales.y.min,
		axisName !== 'z' ? 0 : !options.scales.z ? 0
		: options.scales.z.min),
		new THREE.Vector3(
		axisName !== 'x' ? 0 : !options.scales.x ? 0
		: options.scales.x.max,
		axisName !== 'y' ? 0 : !options.scales.y ? 0
		: options.scales.y.max,
		axisName !== 'z' ? 0 : !options.scales.z ? 0
		: options.scales.z.max)]
		), new THREE.LineBasicMaterial({ color: color, opacity: opacity, transparent: true }));
		if (axisName !== 'x') lineAxis.position.x = options.scales.posAxesIntersection.x;
		if (axisName !== 'y') lineAxis.position.y = options.scales.posAxesIntersection.y;
		if (axisName !== 'z') lineAxis.position.z = options.scales.posAxesIntersection.z;
		lineAxis.add(group);
		lineAxis.userData.axisName = axisName;
		groupAxesHelper.add(lineAxis);
		if (scale.marks !== undefined) {
			var SpriteMark = function SpriteMark(position) {
				position = position || new THREE.Vector3(0, 0, 0);
				var sizeAttenuation = false;
				var sprite = new THREE.Sprite(new THREE.SpriteMaterial({
					map: new THREE.Texture(),
					sizeAttenuation: sizeAttenuation
				}));
				var canvas = document.createElement('canvas');
				sprite.material.map.minFilter = THREE.LinearFilter;
				var context = canvas.getContext('2d');
				function update() {
					var center = new THREE.Vector2(
					axisName !== 'y' ? 0.5 :
					0,
					axisName === 'y' ? 0.5 :
					1
					);
					var width = 3;
					context.fillStyle = options.scales.color;
					context.fillRect(0, 0, canvas.width, canvas.height);
					sprite.material.map.image = canvas;
					sprite.material.map.needsUpdate = true;
					if (axisName === 'y') {
						sprite.scale.x = width * (canvas.width / canvas.height) / canvas.width;
						sprite.scale.y = 1 / canvas.height;
					} else {
						sprite.scale.x = 1 / canvas.width;
						sprite.scale.y = width / canvas.height;
					}
					sprite.scale.x *= options.camera.fov / (50 * 2);
					sprite.scale.y *= options.camera.fov / (50 * 2);
					sprite.position.copy(position);
					sprite.center = center;
					sprite.material.sizeAttenuation = sizeAttenuation;
					sprite.material.needsUpdate = true;
					function getTextPrecision() {
						return options.scales.text.precision !== undefined ? text.toPrecision(options.scales.text.precision) : text.toString();
					}
					var text = axisName === 'x' ? position.x : axisName === 'y' ? position.y : position.z;
					function getCenterX() {
						var a = (0.013 - 0.05) / 15,
						    b = 0.013 - 17 * a;
						return -width * (getTextPrecision().length * a + b);
					}
					var spriteText = new SpriteText$1(getTextPrecision(), new THREE.Vector3(position.x, position.y, position.z), {
						group: group,
						rotation: axisName === 'y' ? 0 : -Math.PI / 2,
						center: new THREE.Vector2(getCenterX(),
						axisName === 'x' ? 1 :
						0)
					});
					spriteText.userData.updatePrecision = function () {
						spriteText.userData.updateText(text.toPrecision(options.scales.text.precision));
						spriteText.center.x = getCenterX();
					};
					group.add(spriteText);
				}
				update();
				return sprite;
			};
			var max = scale.max,
			    min = scale.min,
			    d = (max - min) / (scale.marks - 1);
			for (var i = 0; i < scale.marks; i++) {
				var pos = i * d + min;
				group.add(new SpriteMark(new THREE.Vector3(axisName === 'x' ? pos : 0, axisName === 'y' ? pos : 0, axisName === 'z' ? pos : 0)));
			}
		}
		var axisNameOptions = {
			center: new THREE.Vector2(axisName === 'y' ? 1.1 : -0.1, axisName === 'y' ? 0 : -0.1),
			group: group
		};group.add(new SpriteText$1(scale.name, new THREE.Vector3(axisName === 'x' ? scale.max : 0, axisName === 'y' ? scale.max : 0, axisName === 'z' ? scale.max : 0), axisNameOptions));
		group.add(new SpriteText$1(scale.name, new THREE.Vector3(axisName === 'x' ? scale.min : 0, axisName === 'y' ? scale.min : 0, axisName === 'z' ? scale.min : 0), axisNameOptions));
	};
	this.createAxis('x');
	this.createAxis('y');
	this.createAxis('z');
	if (groupAxesHelper.children.length === 0) console.warn('AxesHelper: Define at least one axis.');
	function dotLines(_scene) {
		var lineX,
		    lineY,
		    lineZ,
		    scene = _scene,
		    groupDotLines,
		    intersection;
		this.remove = function () {
			if (groupDotLines === undefined) return;
			clearThree$1(groupDotLines);
			scene.remove(groupDotLines);
			groupDotLines = undefined;
			lineX = undefined;
			lineY = undefined;
			lineZ = undefined;
		};
		function createGroup() {
			dotLines.remove();
			groupDotLines = new THREE.Group();
			scene.add(groupDotLines);
		}
		function verticeAxis(axisName) {
			return (options.scales.posAxesIntersection[axisName] - group.position[axisName]) / group.scale[axisName];
		}
		function getDashSize() {
			return 0.05 / Math.max(Math.max(group.scale.x, group.scale.y), group.scale.z);
		}
		this.dottedLines = function (_intersection) {
			intersection = _intersection;
			var pointVertice = intersection instanceof THREE.Vector4 || intersection instanceof THREE.Vector3 ? intersection : getObjectPosition(intersection.object, intersection.index);
			if (groupDotLines !== undefined) {
				var _dottedLine = function _dottedLine(axisName) {
					var line;
					switch (axisName) {
						case 'x':
							line = lineX;
							break;
						case 'y':
							line = lineY;
							break;
						case 'z':
							line = lineZ;
							break;
						default:
							console.error('AxesHelper.dotLines.dottedLines.dottedLine: axesId = ' + axesId);
							return;
					}
					if (!line) return;
					var lineVertices = line.geometry.attributes.position.array;
					lineVertices[0] = axisName === 'x' ? pointVertice.x : verticeAxis('x');
					lineVertices[1] = axisName === 'y' ? pointVertice.y : verticeAxis('y');
					lineVertices[2] = axisName === 'z' ? pointVertice.z : verticeAxis('z');
					lineVertices[3] = pointVertice.x;
					lineVertices[4] = pointVertice.y;
					lineVertices[5] = pointVertice.z;
					var size = getDashSize();
					line.material.dashSize = size;
					line.material.gapSize = size;
					line.geometry.attributes.position.needsUpdate = true;
				};
				_dottedLine('x');
				_dottedLine('y');
				_dottedLine('z');
				return;
			}
			createGroup();
			function dottedLine(axisName) {
				if (!options.scales[axisName].isAxis()) return;
				var lineVertices = [new THREE.Vector3().copy(options.scales.posAxesIntersection), pointVertice];
				lineVertices[0].x = axisName === 'x' ? lineVertices[1].x : verticeAxis('x');
				lineVertices[0].y = axisName === 'y' ? lineVertices[1].y : verticeAxis('y');
				lineVertices[0].z = axisName === 'z' ? lineVertices[1].z : verticeAxis('z');
				var size = getDashSize();
				if (options.colorsHelper === undefined) options.colorsHelper = 0x80;
				var line = new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(lineVertices), new THREE.LineDashedMaterial({
					color: 'rgb(' + options.colorsHelper + ', ' + options.colorsHelper + ', ' + options.colorsHelper + ')',
					dashSize: size, gapSize: size
				}));
				line.computeLineDistances();
				groupDotLines.add(line);
				return line;
			}
			lineX = dottedLine('x');
			lineY = dottedLine('y');
			lineZ = dottedLine('z');
		};
		this.update = function () {
			if (groupDotLines === undefined || intersection === undefined) return;
			this.dottedLines(intersection);
		};
		this.movePointAxes = function (axesId, value) {
			var line;
			switch (axesId) {
				case mathBox.axesEnum.x:
					line = lineX;
					break;
				case mathBox.axesEnum.y:
					line = lineY;
					break;
				case mathBox.axesEnum.z:
					line = lineZ;
					break;
				default:
					console.error('point.userData.movePointAxes: invalid axesId: ' + axesId);
					return;
			}
			if (line === undefined) return;
			line.geometry.attributes.position.array[axesId + 3] = value;
			lineX.geometry.attributes.position.array[axesId] = value;
			lineY.geometry.attributes.position.array[axesId] = value;
			lineZ.geometry.attributes.position.array[axesId] = value;
			lineX.geometry.attributes.position.needsUpdate = true;
			lineY.geometry.attributes.position.needsUpdate = true;
			lineZ.geometry.attributes.position.needsUpdate = true;
		};
	}
	dotLines = new dotLines(group);
	var _intersection;
	this.exposePosition = function (intersection) {
		_intersection = intersection;
		if (intersection === undefined) {
			_intersection = undefined;
			dotLines.remove();
			return;
		}
		dotLines.dottedLines(intersection);
	};
	this.movePosition = function () {
		if (!_intersection) return;
		this.exposePosition(_intersection);
	};
	this.getGroup = function () {
		return groupAxesHelper;
	};
	this.updateAxes = function () {
		function updateAxis(axisName) {
			groupAxesHelper.children.forEach(function (group) {
				if (group.userData.axisName !== axisName) return;
				groupAxesHelper.remove(group);
				axesHelper.createAxis(axisName);
			});
		}
		updateAxis('x');
		updateAxis('y');
		updateAxis('z');
		dotLines.update();
	};
	options.axesHelper = this;
};

/**
 * @module SpriteTextGui
 * @description Adds SpriteText settings folder into {@link https://github.com/anhr/dat.gui|dat.gui}.
 * @see {@link https://github.com/anhr/SpriteText|SpriteText}
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
var _spriteTextGuiCount = 0;
function SpriteTextGui(group, options) {
	var guiParams = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
	options = new Options(options);
	var gui = guiParams.folder || options.dat.gui;
	if (!gui || options.dat.spriteTextGui === false) return;
	var optionsSpriteText = guiParams.optionsSpriteText || group.userData.optionsSpriteText || {},
	    THREE = three$1.THREE,
	    dat = three$1.dat;
	if (Object.keys(optionsSpriteText).length === 0) console.warn('SpriteTextGui: optionsSpriteText is empty.');
	if (THREE.Color.NAMES[optionsSpriteText.fontColor]) {
		var color = new THREE.Color(optionsSpriteText.fontColor);
		optionsSpriteText.fontColor = 'rgba(' + color.r * 255 + ',' + color.g * 255 + ',' + color.b * 255 + ',1)';
	}
	var optionsDefault = JSON.parse(JSON.stringify(optionsSpriteText));
	Object.freeze(optionsDefault);
	var lang = {
		spriteText: 'Sprite Text',
		spriteTextTitle: 'Settings for text that always faces towards the camera.',
		text: 'Text',
		textTitle: 'The text to be displayed on the sprite.',
		textHeight: 'Height',
		textHeightTitle: 'Text Height.',
		fontFace: 'Font Face',
		fontFaces: 'Font Faces',
		fontFaceTitle: 'Choose text font.',
		bold: 'Bold',
		italic: 'Italic',
		rotation: 'Rotation',
		rotationTitle: 'Sprite rotation',
		fontProperties: 'Font Properties',
		fontPropertiesTitle: 'Other font properties. The font property uses the same syntax as the CSS font property.',
		fontStyle: 'Font Style',
		fontStyleTitle: 'Text style being used when drawing text. Read only.',
		displayRect: 'Border',
		displayRectTitle: 'Display a border around the text.',
		borderColor: 'Border Color',
		backgroundColor: 'Background Color',
		borderRadius: 'Border Radius',
		borderThickness: 'Border Thickness',
		fontColor: 'Font Color',
		anchor: 'Anchor',
		anchorTitle: 'The text anchor point.',
		sizeAttenuation: 'Size Attenuation',
		sizeAttenuationTitle: 'Whether the size of the sprite is attenuated by the camera depth. (Perspective camera only.)',
		defaultButton: 'Default',
		defaultTitle: 'Restore default Sprite Text settings.'
	};
	switch (options.getLanguageCode()) {
		case 'ru':
			lang.spriteText = 'Текстовый спрайт';
			lang.spriteTextTitle = 'Настройки для текста, который всегда обращен к камере.';
			lang.text = 'Текст';
			lang.textTitle = 'Текст, который будет отображен в спрайте.';
			lang.textHeight = 'Высота';
			lang.textHeightTitle = 'Высота текста.';
			lang.fontFace = 'Имя шрифта';
			lang.fontFaces = 'Имена шрифтов';
			lang.fontFaceTitle = 'Выберите шрифта текста.';
			lang.bold = 'Жирный';
			lang.italic = 'Наклонный';
			lang.rotation = 'Вращение';
			lang.rotationTitle = 'Вращение текстового спрайта';
			lang.fontProperties = 'Дополнительно';
			lang.fontPropertiesTitle = 'Дополнительные свойства шрифта. Свойство шрифта использует тот же синтаксис, что и свойство шрифта CSS.';
			lang.fontStyle = 'Стиль шрифта';
			lang.fontStyleTitle = 'Стиль шрифта, используемый при рисовании текста. Не редактируется.';
			lang.displayRect = 'Рамка';
			lang.displayRectTitle = 'Отобразить рамку вокруг текста.';
			lang.borderColor = 'Цвет рамки';
			lang.backgroundColor = 'Цвет фона';
			lang.borderRadius = 'Зкругление углов';
			lang.borderThickness = 'Толщина рамки';
			lang.fontColor = 'Цвет шрифта';
			lang.anchor = 'Якорь';
			lang.anchorTitle = 'Точка привязки текста.';
			lang.sizeAttenuation = 'Размер';
			lang.sizeAttenuationTitle = 'Будет ли размер спрайта зависеть от расстояния до камеры. (Только перспективная камера.)';
			lang.defaultButton = 'Восстановить';
			lang.defaultTitle = 'Восстановить настройки текстового спрайта по умолчанию.';
			break;
		default:
			if (guiParams.lang === undefined || guiParams.lang.languageCode != _languageCode) break;
			Object.keys(guiParams.lang).forEach(function (key) {
				if (lang[key] === undefined) return;
				lang[key] = guiParams.lang[key];
			});
	}
	guiParams.spriteFolder = guiParams.spriteFolder || lang.spriteText;
	_spriteTextGuiCount++;
	var cookieName = options.dat.getCookieName('SpriteText' + _spriteTextGuiCount),
	    cookie = options.dat.cookie,
	    optionsGroup = optionsSpriteText.group;
	cookie.getObject(cookieName, optionsSpriteText, optionsSpriteText);
	optionsSpriteText.group = optionsGroup;
	if (group instanceof THREE.Sprite !== true) {
		if (group.userData.optionsSpriteText === undefined) group.userData.optionsSpriteText = optionsSpriteText;else if (guiParams.optionsSpriteText !== undefined) console.warn('SpriteTextGui: duplicate group.userData.optionsSpriteText');
	}
	var boUpdateSpriteText = true;
	function updateSpriteText(noSave) {
		if (!boUpdateSpriteText) return;
		SpriteText$1.updateSpriteTextGroup(group);
		if (group.userData.update) group.userData.update();
		if (controllerFont !== undefined) controllerFont.setValue(optionsSpriteText.font);
		if (!noSave) cookie.setObject(cookieName, optionsSpriteText);
	}
	if (!guiParams.hasOwnProperty('parentFolder')) guiParams.parentFolder = gui;
	var fSpriteText = guiParams.parentFolder.addFolder(guiParams.spriteFolder);
	dat.folderNameAndTitle(fSpriteText, guiParams.spriteFolder, lang.spriteTextTitle);
	var textHeight = 'textHeight';
	if (optionsSpriteText.hasOwnProperty(textHeight) && optionsSpriteText[textHeight] !== undefined) {
		ScaleControllers(fSpriteText, optionsSpriteText, textHeight, function () {
			updateSpriteText();
		}, {
			text: lang.textHeight, textTitle: lang.textHeightTitle,
			getLanguageCode: guiParams.getLanguageCode,
			settings: guiParams.settings
		});
	}
	if (optionsSpriteText.fontFace !== undefined) {
		dat.controllerNameAndTitle(fSpriteText.add(optionsSpriteText, 'fontFace').onChange(function (value) {
			updateSpriteText();
		}), lang.fontFace);
	}
	if (optionsSpriteText.fontFaces !== undefined) {
		dat.controllerNameAndTitle(fSpriteText.add(optionsSpriteText, 'fontFace', optionsSpriteText.fontFaces).onChange(function (value) {
			updateSpriteText();
		}), lang.fontFaces, lang.fontFaceTitle);
	}
	if (optionsSpriteText.hasOwnProperty('bold')) {
		dat.controllerNameAndTitle(fSpriteText.add(optionsSpriteText, 'bold').onChange(function (value) {
			updateSpriteText();
		}), lang.bold);
	}
	if (optionsSpriteText.hasOwnProperty('italic')) {
		dat.controllerNameAndTitle(fSpriteText.add(optionsSpriteText, 'italic').onChange(function (value) {
			updateSpriteText();
		}), lang.italic);
	}
	var rotation = 'rotation';
	if (optionsSpriteText.hasOwnProperty(rotation)) {
		var min = 0,
		    max = Math.PI * 2;
		dat.controllerNameAndTitle(fSpriteText.add(optionsSpriteText, rotation, min, max, (max - min) / 360).onChange(function (value) {
			updateSpriteText();
		}), lang.rotation, lang.rotationTitle);
	}
	if (optionsSpriteText.hasOwnProperty('fontProperties')) {
		dat.controllerNameAndTitle(fSpriteText.add(optionsSpriteText, 'fontProperties').onChange(function (value) {
			updateSpriteText();
		}), lang.fontProperties, lang.fontPropertiesTitle);
	}
	if (optionsSpriteText.hasOwnProperty('font')) {
		var controllerFont = fSpriteText.add(optionsSpriteText, 'font');
		controllerFont.__input.readOnly = true;
		dat.controllerNameAndTitle(controllerFont, lang.fontStyle, lang.fontStyleTitle);
	}
	if (optionsSpriteText.hasOwnProperty('rect')) {
		if (optionsSpriteText.rect.displayRect === undefined) optionsSpriteText.rect.displayRect = false;
		dat.controllerNameAndTitle(fSpriteText.add(optionsSpriteText.rect, 'displayRect').onChange(function (value) {
			updateSpriteText();
			fRect.domElement.style.display = optionsSpriteText.rect.displayRect ? 'block' : 'none';
		}), lang.displayRect, lang.displayRectTitle);
		var fRect = fSpriteText.addFolder(lang.displayRect);
		fRect.domElement.style.display = optionsSpriteText.rect.displayRect ? 'block' : 'none';
		var borderThickness = 'borderThickness';
		if (optionsSpriteText.rect.hasOwnProperty(borderThickness)) {
			dat.controllerNameAndTitle(fRect.add(optionsSpriteText.rect, borderThickness, 1, optionsSpriteText.rect.borderThickness * 30, 1).onChange(function (value) {
				updateSpriteText();
			}), lang.borderThickness);
		}
		var borderColor = 'borderColor';
		if (optionsSpriteText.rect.hasOwnProperty(borderColor)) {
			dat.controllerNameAndTitle(fRect.addColor(optionsSpriteText.rect, borderColor).onChange(function (value) {
				updateSpriteText();
			}), lang.borderColor);
		}
		var backgroundColor = 'backgroundColor';
		if (optionsSpriteText.rect.hasOwnProperty(backgroundColor)) {
			dat.controllerNameAndTitle(fRect.addColor(optionsSpriteText.rect, backgroundColor).onChange(function (value) {
				updateSpriteText();
			}), lang.backgroundColor);
		}
		var borderRadius = 'borderRadius';
		if (optionsSpriteText.rect.hasOwnProperty(borderRadius)) {
			dat.controllerNameAndTitle(fRect.add(optionsSpriteText.rect, borderRadius, 0, 100, 1).onChange(function (value) {
				updateSpriteText();
			}), lang.borderRadius);
		}
	}
	if (optionsSpriteText.hasOwnProperty('fontColor')) {
		dat.controllerNameAndTitle(fSpriteText.addColor(optionsSpriteText, 'fontColor').onChange(function (value) {
			updateSpriteText();
		}), lang.fontColor);
	}
	if (optionsSpriteText.hasOwnProperty('center')) {
		optionsSpriteText.center = SpriteText$1.getCenter(optionsSpriteText.center);
		var fAnchor = fSpriteText.addFolder('center');
		dat.folderNameAndTitle(fAnchor, lang.anchor, lang.anchorTitle);
		fAnchor.add(optionsSpriteText.center, 'x', 0, 1, 0.1).onChange(function (value) {
			updateSpriteText();
		});
		fAnchor.add(optionsSpriteText.center, 'y', 0, 1, 0.1).onChange(function (value) {
			updateSpriteText();
		});
	}
	var sizeAttenuation = 'sizeAttenuation';
	if (optionsSpriteText.hasOwnProperty(sizeAttenuation) && optionsSpriteText[sizeAttenuation] !== undefined) {
		dat.controllerNameAndTitle(fSpriteText.add(optionsSpriteText, sizeAttenuation).onChange(function (value) {
			updateSpriteText();
		}), lang.sizeAttenuation, lang.sizeAttenuationTitle);
	}
	fSpriteText.userData = {
		options: options,
		restore: function restore(value) {
			boUpdateSpriteText = false;
			function setValues(folder, key, optionsDefault) {
				folder.__controllers.forEach(function (controller) {
					if (controller.property !== key) {
						if (_typeof(optionsDefault[key]) !== "object") return;
						Object.keys(optionsDefault[key]).forEach(function (optionKey) {
							if (controller.property !== optionKey) return;
							controller.setValue(optionsDefault[key][optionKey]);
						});
						return;
					}
					controller.setValue(optionsDefault[key]);
				});
			}
			Object.keys(optionsDefault).forEach(function (key) {
				setValues(fSpriteText, key, optionsDefault);
				if (_typeof(optionsDefault[key]) === "object") {
					Object.keys(optionsDefault[key]).forEach(function (keyObject) {
						Object.keys(fSpriteText.__folders).forEach(function (keyFolder) {
							setValues(fSpriteText.__folders[keyFolder], keyObject, optionsDefault[key]);
						});
					});
				}
				Object.keys(fSpriteText.__folders).forEach(function (keyFolder) {
					if (keyFolder !== key) return;
					Object.keys(optionsDefault[keyFolder]).forEach(function (key) {
						setValues(fSpriteText.__folders[keyFolder], key, optionsDefault[keyFolder]);
					});
				});
			});
			boUpdateSpriteText = true;
			updateSpriteText();
		}
	};
	var defaultParams = { defaultF: fSpriteText.userData.restore };
	if (optionsDefault === undefined) console.error('SpriteTextGui: optionsDefault = ' + optionsDefault);
	dat.controllerNameAndTitle(fSpriteText.add(defaultParams, 'defaultF'), lang.defaultButton, lang.defaultTitle);
	updateSpriteText(true);
	return fSpriteText;
}

/**
 * @module AxesHelperGui
 * @description Adds <a href="../../AxesHelper/jsdoc/module-AxesHelper-AxesHelper.html" target="_blank">AxesHelper</a> settings folder into {@link https://github.com/anhr/dat.gui|dat.gui}.
 * @see {@link https://github.com/anhr/AxesHelper|AxesHelper}
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
function AxesHelperGui(options, gui) {
	if (!options.boOptions) {
		console.error('AxesHelperGui: call options = new Options( options ) first');
		return;
	}
	gui = gui || options.dat.gui;
	if (!gui || options.dat === false || options.dat.axesHelperGui === false) return;
	if (options.axesHelper === false) return;
	if (!options.axesHelper) {
		console.error('AxesHelperGui: create AxesHelper instance first');
		return;
	}
	var THREE = three$1.THREE,
	    dat = three$1.dat;
	var scalesDefault = JSON.parse(JSON.stringify(options.scales)),
	    groupAxesHelper = options.axesHelper.getGroup();
	scalesDefault.posAxesIntersection = new THREE.Vector3().copy(options.scales.posAxesIntersection);
	Object.freeze(scalesDefault);
	options = options || {};
	var lang = {
		axesHelper: 'Axes Helper',
		scales: 'Scales',
		displayScales: 'Display',
		displayScalesTitle: 'Display or hide axes scales.',
		precision: 'Precision',
		precisionTitle: 'Formats a number to a specified length.',
		min: 'Min',
		max: 'Max',
		marks: 'Marks',
		marksTitle: 'Number of scale marks',
		axesIntersection: 'Axes Intersection',
		defaultButton: 'Default',
		defaultTitle: 'Restore default Axes Helper settings.',
		defaultAxesIntersectionTitle: 'Restore default axes intersection.'
	};
	switch (options.getLanguageCode()) {
		case 'ru':
			lang.axesHelper = 'Оси координат';
			lang.scales = 'Шкалы';
			lang.displayScales = 'Показать';
			lang.displayScalesTitle = 'Показать или скрыть шкалы осей координат.';
			lang.precision = 'Точность';
			lang.precisionTitle = 'Ограничить количество цифр в числе.';
			lang.min = 'Минимум';
			lang.max = 'Максимум';
			lang.marks = 'Риски';
			lang.marksTitle = 'Количество отметок на шкале';
			lang.axesIntersection = 'Начало координат', lang.defaultButton = 'Восстановить';
			lang.defaultTitle = 'Восстановить настройки осей координат по умолчанию.';
			lang.defaultAxesIntersectionTitle = 'Восстановить начало координат по умолчанию.';
			break;
		default:
			if (options.lang === undefined || options.lang.languageCode != languageCode) break;
			Object.keys(options.lang).forEach(function (key) {
				if (lang[key] === undefined) return;
				lang[key] = options.lang[key];
			});
	}
	var cookie = options.dat.cookie,
	    cookieName = options.dat.getCookieName('AxesHelper');
	cookie.getObject(cookieName, options.scales, options.scales);
	function setSettings() {
		cookie.setObject(cookieName, options.scales);
	}
	var fAxesHelper = gui.addFolder(lang.axesHelper);
	var fScales = fAxesHelper.addFolder(lang.scales);
	var controllerDisplayScales = fScales.add(options.scales, 'display').onChange(function (value) {
		groupAxesHelper.children.forEach(function (group) {
			group.children.forEach(function (group) {
				group.visible = value;
			});
		});
		displayControllers();
		setSettings();
	});
	dat.controllerNameAndTitle(controllerDisplayScales, lang.displayScales, lang.displayScalesTitle);
	var controllerPrecision;
	if (options.scales.text.precision !== undefined) {
		controllerPrecision = fScales.add(options.scales.text, 'precision', 2, 17, 1).onChange(function (value) {
			function updateSpriteTextGroup(group) {
				group.children.forEach(function (spriteItem) {
					if (spriteItem instanceof THREE.Sprite) {
						if (spriteItem.userData.updatePrecision !== undefined) spriteItem.userData.updatePrecision();
					} else if (spriteItem instanceof THREE.Group || spriteItem instanceof THREE.Line) updateSpriteTextGroup(spriteItem);
				});
			}
			updateSpriteTextGroup(groupAxesHelper);
			setSettings();
		});
		dat.controllerNameAndTitle(controllerPrecision, lang.precision, lang.precisionTitle);
	}
	var fSpriteText = typeof SpriteTextGui === "undefined" ? undefined : SpriteTextGui(groupAxesHelper, {
		dat: {
			gui: options.dat.gui,
			cookieName: 'AxesHelper_' + options.dat.getCookieName()
		}
	}, {
		parentFolder: fScales
	});
	var fAxesIntersection = fAxesHelper.addFolder(lang.axesIntersection),
	    axesIntersectionControllers = { x: {}, y: {}, z: {} };
	function axesIntersection(axisName) {
		var scale = options.scales[axisName];
		if (!scale.isAxis()) return;
		var scaleControllers = axesIntersectionControllers[axisName];
		scaleControllers.controller = fAxesIntersection.add({
			value: options.scales.posAxesIntersection[axisName]
		}, 'value', scale.min, scale.max, (scale.max - scale.min) / 100).onChange(function (value) {
			options.scales.posAxesIntersection[axisName] = value;
			options.axesHelper.updateAxes();
			setSettings();
		});
		dat.controllerNameAndTitle(scaleControllers.controller, scale.name);
	}
	axesIntersection('x');
	axesIntersection('y');
	axesIntersection('z');
	var defaultParams = {
		defaultF: function defaultF(value) {
			axesIntersectionControllers.x.controller.setValue(scalesDefault.posAxesIntersection.x);
			axesIntersectionControllers.y.controller.setValue(scalesDefault.posAxesIntersection.y);
			axesIntersectionControllers.z.controller.setValue(scalesDefault.posAxesIntersection.z);
		}
	};
	dat.controllerNameAndTitle(fAxesIntersection.add(defaultParams, 'defaultF'), lang.defaultButton, lang.defaultAxesIntersectionTitle);
	fAxesHelper.add(new ScaleController(function (customController, action) {
		function zoom(zoom, action) {
			function axesZoom(axes, scaleControllers) {
				if (axes === undefined) return;
				axes.min = action(axes.min, zoom);
				scaleControllers.min.setValue(axes.min);
				axes.max = action(axes.max, zoom);
				scaleControllers.max.setValue(axes.max);
				scaleControllers.onchangeWindowRange();
			}
			axesZoom(options.scales.x, scalesControllers.x);
			axesZoom(options.scales.y, scalesControllers.y);
			axesZoom(options.scales.z, scalesControllers.z);
		}
		zoom(customController.controller.getValue(), action);
	}, {
		settings: { zoomMultiplier: 1.1 },
		getLanguageCode: options.getLanguageCode
	})).onChange(function (value) {
		console.warn('ScaleController.onChange');
	});
	function scale(axisName) {
		var axes = options.scales[axisName];
		if (axes === undefined) return;
		var scaleControllers = scalesControllers[axisName],
		    axesDefault = scalesDefault[axisName];
		Object.freeze(axesDefault);
		function updateAxis() {
			groupAxesHelper.children.forEach(function (group) {
				if (group.userData.axisName !== axisName) return;
				groupAxesHelper.remove(group);
				options.axesHelper.createAxis(axisName);
			});
		}
		scaleControllers.updateAxis = updateAxis;
		function onchangeWindowRange() {
			updateAxis();
			setSettings();
		}
		scaleControllers.onchangeWindowRange = onchangeWindowRange;
		function onclick(customController, action) {
			var zoom = customController.controller.getValue();
			axes.min = action(axes.min, zoom);
			scaleControllers.min.setValue(axes.min);
			axes.max = action(axes.max, zoom);
			scaleControllers.max.setValue(axes.max);
			onchangeWindowRange(windowRange, axes);
		}
		scaleControllers.folder = fAxesHelper.addFolder(axes.name);
		scaleControllers.scaleController = scaleControllers.folder.add(new ScaleController(onclick, { settings: axes, getLanguageCode: options.getLanguageCode })).onChange(function (value) {
			axes.zoomMultiplier = value;
			setSettings();
		});
		var positionController = new PositionController(function (shift) {
			onclick(positionController, function (value, zoom) {
				value += shift;
				return value;
			});
		}, { settings: axes, getLanguageCode: options.getLanguageCode });
		scaleControllers.positionController = scaleControllers.folder.add(positionController).onChange(function (value) {
			axes.offset = value;
			setSettings();
		});
		scaleControllers.min = dat.controllerZeroStep(scaleControllers.folder, axes, 'min', function (value) {
			onchangeWindowRange(windowRange);
		});
		dat.controllerNameAndTitle(scaleControllers.min, lang.min);
		scaleControllers.max = dat.controllerZeroStep(scaleControllers.folder, axes, 'max', function (value) {
			onchangeWindowRange(windowRange);
		});
		dat.controllerNameAndTitle(scaleControllers.max, lang.max);
		if (axes.marks !== undefined) {
			scaleControllers.marks = dat.controllerZeroStep(scaleControllers.folder, axes, 'marks', function (value) {
				onchangeWindowRange(windowRange);
			});
			dat.controllerNameAndTitle(scaleControllers.marks, axes.marksName === undefined ? lang.marks : axes.marksName, axes.marksTitle === undefined ? lang.marksTitle : axes.marksTitle);
		}
		scaleControllers.defaultButton = scaleControllers.folder.add({
			defaultF: function defaultF(value) {
				axes.min = axesDefault.min;
				scaleControllers.min.setValue(axes.min);
				axes.max = axesDefault.max;
				scaleControllers.max.setValue(axes.max);
				axes.zoomMultiplier = axesDefault.zoomMultiplier;
				scaleControllers.scaleController.setValue(axes.zoomMultiplier);
				axes.offset = axesDefault.offset;
				scaleControllers.positionController.setValue(axes.offset);
				if (axesDefault.marks !== undefined) {
					axes.marks = axesDefault.marks;
					scaleControllers.marks.setValue(axes.marks);
				}
				onchangeWindowRange(windowRange, axes);
			}
		}, 'defaultF');
		dat.controllerNameAndTitle(scaleControllers.defaultButton, lang.defaultButton, lang.defaultTitle);
	}
	var scalesControllers = { x: {}, y: {}, z: {} };
	function windowRange() {
		setSettings();
	}
	scale('x');
	scale('y');
	scale('z');
	var defaultParams = {
		defaultF: function defaultF(value) {
			controllerDisplayScales.setValue(scalesDefault.display);
			if (controllerPrecision !== undefined) controllerPrecision.setValue(scalesDefault.text.precision);
			fSpriteText.userData.restore();
			function defaulAxis(axisName) {
				if (scalesControllers[axisName].defaultButton) scalesControllers[axisName].defaultButton.object.defaultF();
			}
			defaulAxis('x');
			defaulAxis('y');
			defaulAxis('z');
		}
	};
	dat.controllerNameAndTitle(fAxesHelper.add(defaultParams, 'defaultF'), lang.defaultButton, lang.defaultTitle);
	function displayControllers() {
		var display = options.scales.display ? 'block' : 'none';
		if (fSpriteText !== undefined) fSpriteText.domElement.style.display = display;
		if (controllerPrecision !== undefined) controllerPrecision.domElement.parentElement.parentElement.style.display = display;
	}
	displayControllers();
	if (scalesControllers.x.updateAxis) scalesControllers.x.updateAxis();
	if (scalesControllers.y.updateAxis) scalesControllers.y.updateAxis();
	if (scalesControllers.z.updateAxis) scalesControllers.z.updateAxis();
}

/**
 * @module OrbitControlsGui
 * @description [OrbitControls]{@link https://threejs.org/docs/index.html#examples/en/controls/OrbitControls} graphical user interface
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
var OrbitControlsGui =
function OrbitControlsGui(options, gui) {
			classCallCheck(this, OrbitControlsGui);
			if (!options.boOptions) {
						console.error('OrbitControlsGui: call options = new Options( options ) first');
						return;
			}
			gui = gui || options.dat.gui;
			if (!gui || !options.orbitControls || options.dat.orbitControlsGui === false) return;
			var dat = three$1.dat,
			orbitControls = options.orbitControls;
			options.orbitControlsGui = this;
			orbitControls.addEventListener('change', function () {
						if (targetX) targetX.setValue(orbitControls.target.x);
						if (targetY) targetY.setValue(orbitControls.target.y);
						if (targetZ) targetZ.setValue(orbitControls.target.z);
			});
			var lang = {
						orbitControls: 'Orbit Controls',
						defaultButton: 'Default',
						defaultTitle: 'Restore default Orbit controls settings.',
						target: 'Target'
			};
			var _languageCode = options.getLanguageCode === undefined ? 'en'
			: options.getLanguageCode();
			switch (_languageCode) {
						case 'ru':
									lang.defaultButton = 'Восстановить';
									lang.defaultTitle = 'Восстановить настройки Orbit controls по умолчанию.';
									break;
						default:
									if (options.lang === undefined || options.lang.languageCode != _languageCode) break;
									Object.keys(options.lang).forEach(function (key) {
												if (lang[key] === undefined) return;
												lang[key] = options.lang[key];
									});
			}
			var fOrbitControls = gui.addFolder(lang.orbitControls),
			    fX = !options.scales.x ? undefined : fOrbitControls.addFolder(options.scales.x.name),
			    fY = !options.scales.y ? undefined : fOrbitControls.addFolder(options.scales.y.name),
			    fZ = !options.scales.z ? undefined : fOrbitControls.addFolder(options.scales.z.name);
			function addTarget(folder, axisIndex) {
						if (!folder) return;
						function setTarget(value) {
									if (value === undefined) value = 0;
									orbitControls.target[axisIndex] = value;
									orbitControls.update();
									target.setValue(value);
						}
						folder.add(new PositionController(function (shift) {
									setTarget(orbitControls.target[axisIndex] + shift);
						}));
						var target = dat.controllerZeroStep(folder, orbitControls.target, axisIndex, function (value) {
									setTarget(value);
						});
						dat.controllerNameAndTitle(target, lang.target);
						dat.controllerNameAndTitle(folder.add({
									defaultF: function defaultF(value) {
												setTarget();
									}
						}, 'defaultF'), lang.defaultButton, lang.defaultTitle);
						return target;
			}
			var targetX = addTarget(fX, 'x'),
			    targetY = addTarget(fY, 'y'),
			    targetZ = addTarget(fZ, 'z');
			dat.controllerNameAndTitle(fOrbitControls.add({
						defaultF: function defaultF(value) {
									orbitControls.reset();
									targetX.setValue(orbitControls.target.x);
									targetY.setValue(orbitControls.target.y);
									targetZ.setValue(orbitControls.target.z);
						}
			}, 'defaultF'), lang.defaultButton, lang.defaultTitle);
			this.setTarget = function (target) {
						if (targetX) targetX.setValue(target.x);
						if (targetY) targetY.setValue(target.y);
						if (targetZ) targetZ.setValue(target.z);
			};
};

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
			if (typeof object[property] !== "number") console.warn('typeof object[property] = ' + _typeof(object[property]));
			var controller = folder.add(object, property),
			    input = controller.__input;
			controller.__input = document.createElement('input');
			input.value = object[property];
			input.onchange = function (value) {
				object[property] = parseFloat(input.value);
				if (onchange !== undefined) onchange(object[property]);
			};
			controller.setValue = function (value, boOnChange) {
				input.value = object[property] = value;
				if (boOnChange && onchange) onchange(object[property]);
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
 * @module functionsFolder
 * @description Adds the [Functions]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function} folder into [dat.gui]{@link https://github.com/anhr/dat.gui}.
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
var functionsFolder =
function functionsFolder(fParent, onFinishChange, options, vector) {
			classCallCheck(this, functionsFolder);
			if (!options.boOptions) {
						console.error('functionsFolder: call options = new Options( options ) first');
						return;
			}
			var dat = three$1.dat,
			    THREE = three$1.THREE,
			    scales = options.scales;
			var _this = this;
			var boError = false,
			boAlert = false;
			var lang = {
						functions: 'Functions',
						defaultButton: 'Default',
						defaultTitle: 'Restore default functions.'
			};
			var _languageCode = options.getLanguageCode === undefined ? 'en'
			: options.getLanguageCode();
			switch (_languageCode) {
						case 'ru':
									lang.functions = 'Функции';
									lang.defaultButton = 'Восстановить';
									lang.defaultTitle = 'Восстановить функции.';
									break;
						default:
									if (options.lang === undefined || options.lang.languageCode != _languageCode) break;
									Object.keys(options.lang).forEach(function (key) {
												if (lang[key] === undefined) return;
												lang[key] = options.lang[key];
									});
			}
			if (vector) {
						vector.x = getFuncText(vector.x);
						vector.y = getFuncText(vector.y);
						vector.z = getFuncText(vector.z);
			} else vector = { x: '', y: '', z: '' };
			var fFunctions = fParent.addFolder(lang.functions),
			vectorCur = {
						x: vector.x,
						y: vector.y,
						z: vector.z,
						w: vector.w
			},
			    cFunctions = {};
			function createControl(axisName) {
						if (vector[axisName] === undefined) return;
						cFunctions[axisName] = fFunctions.add(vector, axisName).onFinishChange(function (value) {
									__onFinishChange(value, axisName, vectorCur);
						});
						dat.controllerNameAndTitle(cFunctions[axisName], getAxisName(axisName));
			}
			function getAxisName(axisName) {
						return scales[axisName] && scales[axisName].name ? scales[axisName].name : axisName;
			}
			createControl('x');
			createControl('y');
			createControl('z');
			createControl('w');
			var buttonDefault = fFunctions.add({
						defaultF: function defaultF(value) {}
			}, 'defaultF');
			dat.controllerNameAndTitle(buttonDefault, lang.defaultButton, lang.defaultTitle);
			function getFuncText(func) {
						if (func === undefined) return;
						if ((typeof func === 'undefined' ? 'undefined' : _typeof(func)) === 'object') {
									if (func instanceof THREE.Color) return func.getStyle();
									if (Array.isArray(func)) return JSON.stringify(func);
									func = func.func ? func.func : func;
						}
						var typeofFunc = typeof func === 'undefined' ? 'undefined' : _typeof(func);
						switch (typeofFunc) {
									case 'number':
												func = func.toString();
									case 'string':
												return func;
									case 'function':
												return func.toString().split(/return (.*)/)[1];
									default:
												console.error('functionsFolder.getFuncText(...): typeof func = ' + typeofFunc);
												return;
						}
			}
			function __onFinishChange(value, axisName, vectorCur) {
						if (vectorCur[axisName] === value && !boError) return;
						try {
									boError = false;
									vectorCur[axisName] = value;
									var func;
									var typeofValue = typeof value === 'undefined' ? 'undefined' : _typeof(value);
									switch (typeofValue) {
												case 'string':
															var float = parseFloat(value);
															if (float.toString() !== value) {
																		var color = value.replace(/\s/g, "").split(/rgb\((\d+),(\d+),(\d+)\)/);
																		if (color.length === 5) func = new THREE.Color(value);else {
																					var array;
																					try {
																								array = JSON.parse(value);
																					} catch (e) {}
																					if (Array.isArray(array)) func = array;else {
																								func = new Function('t', 'a', 'b', 'return ' + value);
																					}
																		}
															} else func = float;
															break;
												case 'number':
															func = value;
															break;
												default:
															console.error('onFinishChange( ' + value + ' ): invalid type = ' + typeofValue);
															return;
									}
									onFinishChange(func, axisName, value);
									boAlert = false;
						} catch (e) {
									if (!boAlert) {
												alert('Axis: ' + getAxisName(axisName) + '. Function: "' + value + '". ' + e);
												boAlert = true;
									}
									_this.setFocus(axisName);
						}
			}
			this.setFunction = function (_vector) {
						_vector = _vector || options.vector;
						if (!_vector) return;
						var vector = {
									x: _vector ? getFuncText(_vector.x) : '',
									y: _vector ? getFuncText(_vector.y) : '',
									z: _vector ? getFuncText(_vector.z) : '',
									w: _vector ? getFuncText(_vector.w) : ''
						},
						vectorCur = {
									x: vector.x,
									y: vector.y,
									z: vector.z,
									w: vector.w
						};
						if (!_vector.vectorDefault) _vector.vectorDefault = {
									x: vector.x,
									y: vector.y,
									z: vector.z,
									w: vector.w
						};
						function setVectorAxis(axisName) {
									if (_vector[axisName] === undefined) return;
									cFunctions[axisName].__onFinishChange = function (value) {
												__onFinishChange(value, axisName, vectorCur);
									};
									vector[axisName] = getFuncText(_vector[axisName]);
									cFunctions[axisName].setValue(vector[axisName]);
									vectorCur[axisName] = vector[axisName];
						}
						setVectorAxis('x');
						setVectorAxis('y');
						var dislay = false;
						if (_vector.z) {
									setVectorAxis('z');
									dislay = true;
						}
						buttonDefault.object.defaultF = function (value) {
									function setValue(axisName) {
												if (!cFunctions[axisName]) return;
												cFunctions[axisName].setValue(_vector.vectorDefault[axisName]);
												cFunctions[axisName].__onFinishChange(_vector.vectorDefault[axisName]);
									}
									setValue('x');
									setValue('y');
									setValue('z');
									setValue('w');
						};
						function dislayEl(controller, displayController) {
									if (controller === undefined) return;
									if (typeof displayController === "boolean") displayController = displayController ? 'block' : 'none';
									var el = controller.domElement;
									while (el.tagName.toUpperCase() !== "LI") {
												el = el.parentElement;
									}el.style.display = displayController;
						}
						dislayEl(cFunctions.z, dislay);
						setVectorAxis('w');
			};
			this.setFunction();
			this.displayFolder = function (display) {
						fFunctions.domElement.style.display = typeof display === "boolean" ? display ? 'block' : 'none' : display;
			};
			this.setFocus = function (axisName) {
						cFunctions[axisName].domElement.childNodes[0].focus();
						boError = true;
			};
			this.update = function (newVector) {
						function updateAxis(axisName) {
									if (cFunctions[axisName].getValue() === newVector[axisName]) return;
									cFunctions[axisName].setValue(newVector[axisName]);
						}
						updateAxis('x');
						updateAxis('y');
						updateAxis('z');
						updateAxis('w');
			};
};

/**
 * @module GuiSelectPoint
 *
 * @description A dat.gui based graphical user interface for select a point from the mesh.
 *
 * @see {@link https://github.com/anhr/dat.gui|dat.gui}, {@link https://threejs.org/docs/index.html#api/en/objects/Mesh|three.js mesh}.
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
var none = 'none';
var block = 'block';
var GuiSelectPoint =
function GuiSelectPoint(options) {
			var guiParams = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
			classCallCheck(this, GuiSelectPoint);
			var guiSelectPoint = this,
			    THREE = three$1.THREE,
			    folders = {};
			if (!options.boOptions) {
						console.error('GuiSelectPoint: call options = new Options( options ) first');
						return;
			}
			if (options.dat.guiSelectPoint === false || !options.dat.gui) {
						this.add = function (gui) {};
						this.addMesh = function (points) {};
						this.select = function (intersect) {};
						return;
			}
			var dat = three$1.dat;
			options.guiSelectPoint = guiSelectPoint;
			var cFrustumPoints;
			var getLanguageCode = options.getLanguageCode;
			var lang = {
						meshs: 'Meshes',
						notSelected: 'Not selected',
						select: 'Select',
						position: 'Position',
						rotation: 'Rotation',
						points: 'Points',
						displayVerticeID: 'Point ID',
						displayVerticeIDTitle: 'Display on the scene the point ID near to the point',
						cameraTarget: 'Look',
						cameraTargetTitle: 'Choose this point the camera is looking at.',
						point: 'Point Local Position',
						pointTitle: 'The position attribute of the selected point',
						trace: 'Trace',
						traceTitle: 'Display the trace of the point movement.',
						traceAllTitle: 'Display the trace of the movement of all points of the mesh.',
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
									lang.displayVerticeID = 'Номера точек';
									lang.displayVerticeIDTitle = 'На сцене возле каждой точки показать ее идентификатор';
									lang.cameraTarget = 'Следить';
									lang.cameraTargetTitle = 'Выберите эту точку, за которой следит камера.', lang.point = 'Локальная позиция точки';
									lang.pointTitle = 'Position attribute выбранной точки';
									lang.trace = 'Трек';
									lang.traceTitle = 'Показать трек перемещения точки.';
									lang.traceAllTitle = 'Показать трек перемещения всех точек выбранного 3D объекта.';
									lang.pointWorld = 'Абсолютная позиция точки';
									lang.pointWorldTitle = 'Позиция выбранной точки после масштабирования, перемещения и вращения 3D объекта';
									lang.mesh = '3D объект';
									lang.scale = 'Масштаб';
									lang.color = 'Цвет';
									lang.opacity = 'Непрозрачность';
									lang.opacityTitle = 'Число в диапазоне 0,0 - 1,0, указывающее, насколько прозрачен материал. Значение 0.0 означает полностью прозрачный, 1.0 - полностью непрозрачный.';
									lang.defaultButton = 'Восстановить';
									lang.defaultScaleTitle = 'Восстановить масштаб 3D объекта по умолчанию.';
									lang.defaultPositionTitle = 'Восстановить позицию 3D объекта по умолчанию.';
									lang.default3DObjectTitle = 'Восстановить настройки всех 3D объектов по умолчанию.';
									lang.defaultRotationTitle = 'Восстановить поворот 3D объекта по умолчанию.';
									lang.defaultLocalPositionTitle = 'Восстановить локальную позицию точки по умолчанию.';
									break;
						default:
			}
			var f3DObjects,
			    fPoint,
			    cRestoreDefaultLocalPosition,
			    fPointWorld,
			    fPoints,
			    cMeshs,
			    fMesh,
			intersection,
			    cScaleX,
			    cScaleY,
			    cScaleZ,
			    cPoints,
			    selectedPointIndex = -1,
			    cX,
			    cY,
			    cZ,
			    cW,
			    cTrace,
			    cTraceAll,
			    cColor,
			    cOpacity,
			    cCameraTarget,
			    funcFolder,
			    boSetMesh = false,
			fRotation,
			    cCustom;
			var _this = this,
			    cPosition = new THREE.Vector3(),
			    cRotations = new THREE.Vector3(),
			    cWorld = new THREE.Vector3();
			function displayPointControllers(display) {
						fPointWorld.domElement.style.display = display;
						fPoint.domElement.style.display = display;
						if (cCameraTarget) {
									var mesh = getMesh();
									cCameraTarget.domElement.parentElement.parentElement.style.display = mesh && mesh.userData.boFrustumPoints ? 'none' :
									display;
						}
			}
			if (options.frustumPoints) cFrustumPoints = new options.frustumPoints.guiSelectPoint();
			function getLiEl(controller) {
						var el = controller.domElement;
						while (el.tagName.toUpperCase() !== "LI") {
									el = el.parentElement;
						}return el;
			}
			function dislayEl(controller, displayController) {
						if (controller === undefined) return;
						if (typeof displayController === "boolean") displayController = displayController ? 'block' : 'none';else if (displayController === undefined) displayController = 'none';else if (typeof displayController !== "string") displayController = 'block';
						getLiEl(controller).style.display = displayController;
			}
			function isDislayEl(controller) {
						if (controller === undefined) return;
						return getLiEl(controller).style.display === none ? false : true;
			}
			var getInputEl = function getInputEl(controller) {
						return controller ? controller.domElement.querySelector('input') : undefined;
			};
			var readOnlyEl = function readOnlyEl(controller, boReadOnly) {
						var element = getInputEl(controller);
						if (element) element.readOnly = boReadOnly;
			};
			var isReadOnlyEl = function isReadOnlyEl(controller) {
						var element = getInputEl(controller);
						if (element) return element.readOnly;
			};
			function exposePosition(selectedPointIndex) {
						if (selectedPointIndex === undefined) selectedPointIndex = guiSelectPoint.getSelectedPointIndex();
						if (selectedPointIndex === -1) return;
						var mesh = cMeshs.__select.options[cMeshs.__select.options.selectedIndex].mesh,
						    position = getObjectPosition(mesh, selectedPointIndex);
						if (options.axesHelper !== undefined)
									if (options.axesHelper !== false && options.axesHelper !== undefined) options.axesHelper.exposePosition({ object: mesh, index: selectedPointIndex });
						if (cWorld.x) cWorld.x.setValue(position.x);
						if (cWorld.y) cWorld.y.setValue(position.y);
						if (cWorld.z) cWorld.z.setValue(position.z);
						if (mesh.userData.player && mesh.userData.player.arrayFuncs) {
									var selectedPoint = mesh.userData.player.arrayFuncs[selectedPointIndex];
									if (selectedPoint && selectedPoint.controllers) {
												var controllers = mesh.userData.player.arrayFuncs[selectedPointIndex].controllers;
												if (controllers.x && controllers.x.controller) controllers.x.controller.value = position.x;
												if (controllers.y && controllers.y.controller) controllers.y.controller.value = position.y;
												if (controllers.z && controllers.z.controller) controllers.z.controller.value = position.z;
									}
						}
			}
			this.exposePosition = exposePosition;
			function setValue(controller, v) {
						if (!controller) return;
						var input = getInputEl(controller),
						readOnly = input.readOnly;
						input.readOnly = false;
						controller.object[controller.property] = v;
						if (controller.__onChange) controller.__onChange.call(controller, v);
						controller.initialValue = v;
						controller.updateDisplay();
						input.readOnly = readOnly;
						return controller;
			}
			var wLimitsDefault;
			this.setReadOnlyPosition = function (boReadOnly) {
						readOnlyEl(cX, boReadOnly);
						readOnlyEl(cY, boReadOnly);
						readOnlyEl(cZ, boReadOnly);
						readOnlyEl(cW, boReadOnly);
			};
			function setPosition(intersectionSelected) {
						var player = intersectionSelected.object.userData.player;
						var boDisplayFuncFolder = 'none';
						if (player && player.arrayFuncs) {
									funcFolder.setFunction(player.arrayFuncs[intersectionSelected.index]);
									boDisplayFuncFolder = 'block';
						}
						funcFolder.displayFolder(boDisplayFuncFolder);
						if (cCameraTarget) {
									options.playerOptions.cameraTarget.changeTarget(intersectionSelected.object, intersectionSelected.index);
									cCameraTarget.updateDisplay();
						}
						var positionLocal = getObjectLocalPosition(intersectionSelected.object, intersectionSelected.index);
						setValue(cX, positionLocal.x);
						setValue(cY, positionLocal.y);
						setValue(cZ, positionLocal.z);
						if (intersectionSelected.object.userData.gui) intersectionSelected.object.userData.gui.setValues(intersectionSelected.index);
						var position = getObjectPosition(intersectionSelected.object, intersectionSelected.index);
						setValue(cWorld.x, position.x);
						setValue(cWorld.y, position.y);
						setValue(cWorld.z, position.z);
						var displayControllerW, displayControllerColor;
						if (intersection.object.userData.player && typeof intersection.object.userData.player.arrayFuncs === "function") {
						}
						var func = player && player.arrayFuncs ? player.arrayFuncs[intersectionSelected.index] : undefined,
						    attributes = intersectionSelected.object.geometry.attributes;
						if (!attributes.color) {
									displayControllerW = none;
									displayControllerColor = none;
						} else {
									var setColorControl = function setColorControl(color) {
												var strColor = '#' + color.getHexString();
												cColor.initialValue = strColor;
												cColor.userData = { intersection: intersectionSelected };
												cColor.setValue(strColor);
									};
									if (attributes.position.itemSize < 4) {
												if (intersectionSelected.object.material.vertexColors === true || intersectionSelected.object.material instanceof THREE.ShaderMaterial === true) {
															displayControllerW = none;
															displayControllerColor = block;
															setColorControl(new THREE.Color().fromBufferAttribute(attributes.color, intersectionSelected.index));
												}
									} else {
												var isWObject = function isWObject() {
															return _typeof(func.w) === 'object' && func.w instanceof THREE.Color === false;
												};
												var _mesh = getMesh(),
												    verticeColor = _mesh.userData.myObject ? _mesh.userData.myObject.verticeColor(intersectionSelected.index) : undefined;
												var color = func === undefined || !attributes.color && !attributes.ca ? undefined : Array.isArray(func.w) || typeof func.w === "function" ? Player$1.execFunc(func, 'w', options.time, options) : isWObject() ? Player$1.execFunc(func.w, 'func', options.time, options) : typeof func.w === "string" ? Player$1.execFunc(func, 'w', options.time, options) : verticeColor != undefined ? verticeColor : func.w;
												if (Array.isArray(color)) color = new THREE.Color(color[0], color[1], color[2]);
												if (color instanceof THREE.Color) {
															displayControllerW = none;
															displayControllerColor = block;
															if (intersectionSelected.object.userData.player.arrayFuncs === undefined) {
																		displayControllerColor = none;
															} else {
																		setColorControl(color);
																		cOpacity.userData = { intersection: intersectionSelected };
															}
												} else {
															if (cW === undefined) displayControllerW = none;else {
																		if (color === undefined) displayControllerW = none;else {
																					if (!wLimitsDefault) {
																								wLimitsDefault = {
																											min: cW.__min,
																											max: cW.__max
																								};
																					}
																					if (isWObject()) {
																								cW.min(func.w.min !== 'undefined' ? func.w.min : wLimitsDefault.min);
																								cW.max(func.w.max !== 'undefined' ? func.w.max : wLimitsDefault.max);
																								if (cW.__min !== 'undefined' && cW.__max !== 'undefined') cW.step((cW.__max - cW.__min) / 100);
																					} else {
																								cW.min(wLimitsDefault.min);
																								cW.max(wLimitsDefault.max);
																					}
																					setValue(cW, color);
																					displayControllerW = block;
																		}
															}
															displayControllerColor = none;
												}
									}
						}
						dislayEl(cW, displayControllerW);
						dislayEl(cColor, displayControllerColor);
						var mesh = getMesh(),
						    boReadOnly = intersectionSelected.object.userData.boFrustumPoints === true ? true : mesh.userData.gui && mesh.userData.gui.isLocalPositionReadOnly ? true : false,
						    boOpacity = mesh.userData.myObject && mesh.userData.myObject.isOpacity || mesh.material.transparent && mesh.material.vertexColors,
						    attributeColor = mesh.geometry.attributes.color;
						dislayEl(cOpacity, boOpacity ? block : none);
						if (boOpacity) {
									if (attributeColor.itemSize != 4) console.error('GuiSelectPoint.setPosition: Invalid mesh.geometry.attributes.color.itemSize = ' + attributeColor.itemSize);
									cOpacity.initialValue = attributeColor.array[intersectionSelected.index * attributeColor.itemSize + 3];
									cOpacity.setValue(cOpacity.initialValue);
						}
						_this.setReadOnlyPosition(boReadOnly);
						readOnlyEl(cColor, boReadOnly);
						readOnlyEl(cOpacity, boReadOnly);
						funcFolder.displayFolder(!boReadOnly);
			}
			this.setAxisControl = function (axis, scale) {
						switch (axis) {
									case 'w':
												if (scale.min != undefined) cW.min(scale.min);
												if (scale.max != undefined) cW.max(scale.max);
												if (scale.step != undefined) cW.step(scale.step);
												break;
									default:
												console.error('GuiSelectPoint.setAxisControl. Invalid axis: ' + axis);
						}
			};
			this.setAxisName = function (axis, name) {
						cPosition[axis].name(name);
						folders.position[axis].name = name;
						var cScale = axis === 'x' ? cScaleX : axis === 'y' ? cScaleY : axis === 'z' ? cScaleZ : undefined;
						cScale.name(name);
						var cRotation = cRotations[axis];
						if (cRotation.name) cRotation.name(name);
			};
			this.setMesh = function () {
						boSetMesh = true;
						setScaleControllers();
						setPositionControllers();
						setRotationControllers();
						exposePosition();
						boSetMesh = false;
			};
			this.setPosition = function (intersectionSelected) {
						for (var i = 0; i < cMeshs.__select.length; i++) {
									var option = cMeshs.__select[i];
									if (option.selected && Object.is(option.mesh, intersectionSelected.object)) {
												setPosition(intersectionSelected);
									}
						}
			};
			this.update = function () {
						var boSetInitialValue = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
						var selectedItem = cMeshs.__select.options[cMeshs.__select.options.selectedIndex];
						if (!selectedItem) return;
						var mesh = selectedItem.mesh;
						if (!mesh) return;
						var index = this.getSelectedPointIndex();
						if (index === -1) return;
						var position = getObjectPosition(mesh, index);
						if (cWorld.x) cWorld.x.setValue(position.x);
						if (cWorld.y) cWorld.y.setValue(position.y);
						if (cWorld.z) cWorld.z.setValue(position.z);
						if (cW && position instanceof THREE.Vector4) cW.setValue(position.w);
						var positionLocal = getObjectLocalPosition(mesh, index);
						if (boSetInitialValue) {
									if (cX) cX.initialValue = positionLocal.x;
									if (cY) cY.initialValue = positionLocal.y;
									if (cZ) cZ.initialValue = positionLocal.z;
									if (cW) cW.initialValue = positionLocal.w;
						}
						if (cX) cX.setValue(positionLocal.x);
						if (cY) cY.setValue(positionLocal.y);
						if (cZ) cZ.setValue(positionLocal.z);
						funcFolder.update(mesh.userData.player.arrayFuncs[index]);
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
						var boHideF3DObjects = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
						var index = this.getMeshIndex(mesh),
						    selectedIndex = cMeshs.__select.selectedIndex;
						if (index === undefined) return;
						cMeshs.__select.remove(index);
						if (selectedIndex === index) {
									cPoints.__onChange(-1);
									_this.removePoints();
									cMeshs.__onChange(-1);
						}
						if (cMeshs.__select.options.length < 2 && boHideF3DObjects) f3DObjects.domElement.style.display = 'none';
			};
			var arrayMeshs = [];
			this.addMesh = function (mesh) {
						if (!mesh.parent) {
									console.error('GuiSelectPoint.addMesh: Add mesh into scene first.');
									return;
						}
						if (!f3DObjects) this.add();
						f3DObjects.domElement.style.display = 'block';
						if (!cMeshs) {
									for (var i = 0; i < arrayMeshs.length; i++) {
												if (arrayMeshs[i].uuid === mesh.uuid) {
															console.error('guiSelectPoint.addMesh: Duplicate mesh: ' + mesh.name);
															return;
												}
									}
									arrayMeshs.push(mesh);
									return;
						}
						for (var i = 0; i < cMeshs.__select.options.length; i++) {
									var option = cMeshs.__select.options[i];
									if (mesh.userData.boFrustumPoints && option.mesh !== undefined && option.mesh.userData.boFrustumPoints) return;
									if (option.mesh !== undefined && option.mesh.uuid === mesh.uuid) {
												console.error('guiSelectPoint.addMesh(...): Duplicate mesh.');
												return;
									}
						}
						var opt = document.createElement('option');
						opt.innerHTML = cMeshs.__select.length + ' ' + (mesh.name === '' ? mesh.constructor.name : mesh.name);
						opt.mesh = mesh;
						mesh.userData.default = mesh.userData.default || {
									scale: new THREE.Vector3().copy(mesh.scale),
									position: mesh.position instanceof THREE.Vector3 ? new THREE.Vector3().copy(mesh.position) : mesh.position instanceof THREE.Vector4 ? new THREE.Vector4().copy(mesh.position) : undefined,
									rotation: new THREE.Euler().copy(mesh.rotation)
						};
						cMeshs.__select.appendChild(opt);
						displayVerticeID(mesh);
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
						} else if (cCustom) {
									var mesh = getMesh();
									cCustom.object(intersectionSelected.event && intersectionSelected.event.button === 0 ? mesh : undefined,
									dat, options);
						}
						this.selectPoint2 = function (selectedMesh) {
									if (intersectionSelected.index === undefined || isNaN(intersectionSelected.index)) return;
									if (selectedMesh !== undefined && !Object.is(intersectionSelected.object, selectedMesh)) return;
									if (!intersectionSelected.object.userData.boFrustumPoints) {
												var point = cPoints.__select[intersectionSelected.index + 1];
												if (point) point.selected = true;
									} else {
												cFrustumPoints.pointIndexes(intersectionSelected.object.userData.pointIndexes(intersectionSelected.index));
									}
									var block = 'block';
									displayPointControllers(block);
									intersection = intersectionSelected;
									if (guiParams.setIntersection) guiParams.setIntersection(intersectionSelected);
									setPosition(intersectionSelected);
									var mesh = getMesh();
									var line = !mesh.userData.player || mesh.userData.player.arrayFuncs === undefined || typeof intersection.object.userData.player.arrayFuncs === "function" ? undefined : mesh.userData.player.arrayFuncs[intersectionSelected.index].line;
									if (cTrace) cTrace.setValue(line === undefined ? false : line.isVisible());
									cRestoreDefaultLocalPosition.domElement.parentElement.parentElement.style.display = !intersection.object.userData.player || intersection.object.userData.player.arrayFuncs === undefined ? 'none' : block;
						};
						this.selectPoint2(undefined);
			};
			this.isSelectedMesh = function (meshCur) {
						return getMesh() === meshCur;
			};
			this.getSelectedPointIndex = function () {
						if (cFrustumPoints !== undefined && cFrustumPoints.isDisplay() &&
						options.frustumPoints && options.frustumPoints.isDisplay()
						) {
												var selectedIndex = cFrustumPoints.getSelectedIndex();
												return selectedIndex === null ? -1 : selectedIndex;
									}
						if (cPoints === undefined) {
									if (selectedPointIndex === undefined) console.error('myThreejs.create.onloadScripts.init.guiSelectPoint.getSelectedPointIndex:  selectedPointIndex = ' + selectedPointIndex);
									return selectedPointIndex;
						}
						if (!getMesh()) return -1;
						var index = cPoints.__select.selectedOptions[0].index;
						return index - 1;
			};
			function getMesh() {
						if (!cMeshs) {
									console.error('GuiSelectPoint().getSelectedPointIndex().getMesh(): call GuiSelectPoint.add(); first.');
									return undefined;
						}
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
						var setValue = function setValue(controller, angle) {
									if (angle < controller.__min || angle > controller.__max) console.error('GuiSelectPoint.setRotationControllers(): Invalid angle = ' + angle + ' range. Available range from ' + controller.__min + ' to ' + controller.__max);
									controller.setValue(angle);
						};
						if (cRotations.x) setValue(cRotations.x, mesh.rotation.x);
						if (cRotations.y) setValue(cRotations.y, mesh.rotation.y);
						if (cRotations.z) setValue(cRotations.z, mesh.rotation.z);
			}
			function visibleTraceLine(intersection, value, getMesh) {
						if (!intersection || !intersection.object.userData.player || intersection.object.userData.player.arrayFuncs === undefined) return;
						var index = intersection.index || 0,
						    point = intersection.object.userData.player.arrayFuncs[index],
						    line = point === undefined ? undefined : point.line;
						if (line !== undefined) line.visible(value);
						if (!value) return;
						if (point.line !== undefined) return;
						point.line = new Player$1.traceLine(options);
						var color = intersection.object.geometry.attributes.color;
						if (color === undefined) color = new THREE.Color(0xffffff);
						else {
												var vector = new THREE.Vector3().fromArray(color.array, index * color.itemSize);
												color = new THREE.Color(vector.x, vector.y, vector.z);
									}
						point.line.addPoint(getMesh(), index, color);
			}
			this.updateScale = function (axisName) {
						var none = 'none',
						    block = 'block',
						    display = options.scales[axisName].isAxis() ? block : none;
						var boX = options.scales['x'].isAxis(),
						    boY = options.scales['y'].isAxis(),
						    boZ = options.scales['z'].isAxis();
						var n = 0;
						if (boX) n++;
						if (boY) n++;
						if (boZ) n++;
						switch (n) {
									case 1:
												if (fRotation) fRotation.domElement.style.display = none;
												break;
									case 2:
												fRotation.domElement.style.display = block;
												if (boX && cRotations.x.domElement) cRotations.x.domElement.parentElement.parentElement.style.display = none;
												if (boY && cRotations.y.domElement) cRotations.y.domElement.parentElement.parentElement.style.display = none;
												if (boZ && cRotations.z.domElement) cRotations.z.domElement.parentElement.parentElement.style.display = none;
												break;
									default:
												console.error('GuiSelectPoint.updateScale: Invalid space dimension = ' + n);
												return;
						}
						if (!folders.position[axisName]) {
									if (options.scales[axisName].isAxis()) console.error('GuiSelectPoint.updateScale: Under constraction.');
									return;
						}
						folders.position[axisName].domElement.style.display = display;
						cWorld[axisName].domElement.parentElement.parentElement.style.display = display;
						var c, cScale;
						switch (axisName) {
									case 'x':
												c = cX;
												cScale = cScaleX;
												break;
									case 'y':
												c = cY;
												cScale = cScaleY;
												break;
									case 'z':
												c = cZ;
												cScale = cScaleZ;
												break;
									default:
												console.error('GuiSelectPoint.updateScale: Invalid axis name: ' + axisName);
												return;
						}
						c.domElement.parentElement.parentElement.style.display = display;
						cScale.domElement.parentElement.parentElement.style.display = display;
			};
			function displayVerticeID(object) {
						if (object.userData.boFrustumPoints) return;
						if (!options.dat.guiSelectPoint.boDisplayVerticeID) {
									for (var i = object.children.length - 1; i >= 0; i--) {
												var child = object.children[i];
												if (child.type === 'Sprite') object.remove(child);
									}
									return;
						}
						if (!object.geometry) return;
						var gp = object.geometry.attributes.position;
						object.updateMatrixWorld();
						for (var _i = 0; _i < gp.count; _i++) {
									var p = new THREE.Vector3().fromBufferAttribute(gp, _i);
									var spriteText = new SpriteText$1(_i, p, { group: object });
									spriteText.userData.pointID = _i;
						}
			}
			function addPoints(mesh) {
						for (var iPosition = 0; iPosition < mesh.geometry.attributes.position.count; iPosition++) {
									var opt = document.createElement('option'),
									    name = mesh.userData.player && mesh.userData.player.arrayFuncs ? mesh.userData.player.arrayFuncs[iPosition].name : '';
									opt.innerHTML = iPosition + (name === undefined ? '' : ' ' + name);
									opt.setAttribute('value', iPosition);
									cPoints.__select.appendChild(opt);
						}
			}
			function createPlayerArrayFuncs(mesh) {
						if (!mesh || mesh.userData.boFrustumPoints) return;
						if (!mesh.userData.player) mesh.userData.player = {};
						if (!mesh.userData.player.arrayFuncs && mesh.geometry) {
									var position = mesh.geometry.attributes.position;
									mesh.userData.player.arrayFuncs = [];
									for (var i = 0; i < position.count; i++) {
												var vector = new THREE.Vector4().fromArray(mesh.geometry.attributes.position.array, i * position.itemSize);
												mesh.userData.player.arrayFuncs.push(vector);
									}
						}
			}
			this.add = function (folder) {
						folder = folder || options.dat.gui;
						if (!folder) return;
						f3DObjects = folder.addFolder(lang.meshs);
						f3DObjects.domElement.style.display = 'none';
						var mesh, buttonScaleDefault, buttonPositionDefault, buttonRotationDefault;
						cMeshs = f3DObjects.add({ Meshs: lang.notSelected }, 'Meshs', defineProperty({}, lang.notSelected, -1)).onChange(function (value) {
									value = parseInt(value);
									cPoints.__onChange(-1);
									mesh = getMesh();
									var none = 'none',
									    block = 'block';
									if (fPoint.fCustomPoint) {
												fPoint.removeFolder(fPoint.fCustomPoint);
												delete fPoint.fCustomPoint;
									}
									if (mesh && mesh.userData.gui) {
												fPoint.fCustomPoint = mesh.userData.gui.addControllers(fPoint);
									}
									if (cCustom) cCustom.object(mesh, dat, value === -1);
									createPlayerArrayFuncs(mesh);
									var display;
									if (mesh === undefined) {
												display = none;
												mesh = undefined;
												if (options.axesHelper !== undefined) options.axesHelper.exposePosition(getObjectPosition(getMesh(), value));
									} else {
												var displayDefaultButtons = mesh.userData.default === undefined ? none : block;
												buttonScaleDefault.domElement.parentElement.parentElement.style.display = displayDefaultButtons;
												buttonPositionDefault.domElement.parentElement.parentElement.style.display = displayDefaultButtons;
												if (buttonRotationDefault) buttonRotationDefault.domElement.parentElement.parentElement.style.display = displayDefaultButtons;
												display = block;
												var displayPoints = none,
												    displayfPoints = none,
												    displayFrustumPoints = block;
												cPoints.__onChange(-1);
												_this.removePoints();
												if (mesh.userData.controllers !== undefined) {
															mesh.userData.controllers();
												} else {
															displayPoints = block;
															displayFrustumPoints = none;
															if (mesh.geometry && mesh.geometry.attributes) {
																		addPoints(mesh);
															}
												}
												dislayEl(cPoints, displayPoints);
												if (cTraceAll) {
															dislayEl(cTraceAll, options.player ? displayPoints : false);
												}
												if (cFrustumPoints !== undefined) cFrustumPoints.display(displayFrustumPoints);
												setScaleControllers();
												setPositionControllers();
												setRotationControllers();
												orbitControlsOptions = undefined;
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
									if (options.frustumPoints) options.frustumPoints.updateCloudPoint(mesh);
						}, {
									settings: { zoomMultiplier: 1.1 },
									getLanguageCode: getLanguageCode,
									newBool: true
						}));
						var scale = new THREE.Vector3();
						function setScale(axisName, value) {
									mesh.scale[axisName] = value;
									mesh.needsUpdate = true;
									exposePosition();
									if (options.frustumPoints) options.frustumPoints.updateCloudPoint(mesh);
						}
						if (options.scales.x.isAxis()) {
									cScaleX = dat.controllerZeroStep(fScale, scale, 'x', function (value) {
												setScale('x', value);
									});
									dat.controllerNameAndTitle(cScaleX, options.scales.x.name);
						}
						if (options.scales.y.isAxis()) {
									cScaleY = dat.controllerZeroStep(fScale, scale, 'y', function (value) {
												setScale('y', value);
									});
									dat.controllerNameAndTitle(cScaleY, options.scales.y.name);
						}
						if (options.scales.z.isAxis()) {
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
									if (!scale.isAxis()) return;
									var axisName = scale.name,
									    f = fPosition.addFolder(axisName);
									folders.position = folders.position || {};
									folders.position[axisName] = f;
									f.add(new PositionController(function (shift) {
												mesh.position[name] += shift;
												mesh.needsUpdate = true;
												setPositionControllers();
												exposePosition();
												if (options.frustumPoints) options.frustumPoints.updateCloudPoint(mesh);
									}, { getLanguageCode: getLanguageCode }));
									function setPosition(value) {
												mesh.position[name] = value;
												mesh.needsUpdate = true;
												exposePosition();
									}
									var position = new THREE.Vector3();
									cPosition[name] = dat.controllerZeroStep(f, position, name, function (value) {
												setPosition(value);
									});
									dat.controllerNameAndTitle(cPosition[name], axisName);
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
						function addRotationFolder() {
									var boX = options.scales.x.isAxis(),
									    boY = options.scales.y.isAxis(),
									    boZ = options.scales.z.isAxis();
									var n = 0;
									if (boX) n++;
									if (boY) n++;
									if (boZ) n++;
									if (n === 1) return;
									fRotation = fMesh.addFolder(lang.rotation);
									function addRotationControllers(name) {
												var scale = options.scales[name];
												cRotations[name] = fRotation.add(new THREE.Vector3(), name, 0, Math.PI * 2, 0.01).onChange(function (value) {
															var mesh = getMesh();
															if (!mesh.userData.boFrustumPoints) {
																		mesh.rotation[name] = value;
																		mesh.needsUpdate = true;
															}
															if (!boSetMesh) exposePosition();
															if (options.frustumPoints !== undefined) options.frustumPoints.updateCloudPoint(mesh);
												});
												dat.controllerNameAndTitle(cRotations[name], scale.name);
									}
									switch (n) {
												case 2:
															addRotationControllers(!boX ? 'x' : !boY ? 'y' : 'z');
															break;
												case 3:
															addRotationControllers('x');
															addRotationControllers('y');
															addRotationControllers('z');
															break;
												default:
															console.error('GuiSelectPoint.updateScale: Invalid space dimension = ' + n);
															return;
									}
									buttonRotationDefault = fRotation.add({
												defaultF: function defaultF(value) {
															mesh.rotation.copy(mesh.userData.default.rotation);
															mesh.needsUpdate = true;
															setRotationControllers();
															exposePosition();
												}
									}, 'defaultF');
									dat.controllerNameAndTitle(buttonRotationDefault, lang.defaultButton, lang.defaultRotationTitle);
						}
						addRotationFolder();
						fPoints = fMesh.addFolder(lang.points);
						var oldMesh = void 0;
						cPoints = fPoints.add({ Points: lang.notSelected }, 'Points', defineProperty({}, lang.notSelected, -1)).onChange(function (pointId) {
									pointId = parseInt(pointId);
									var display;
									var mesh = getMesh();
									if (mesh && mesh.userData.gui && mesh.userData.gui.reset) oldMesh = mesh;
									if (pointId === -1) display = 'none';else {
												display = 'block';
												_this.select({ object: mesh, index: pointId });
									}
									if (options.axesHelper !== false && options.axesHelper !== undefined) options.axesHelper.exposePosition(getObjectPosition(mesh, pointId));
									displayPointControllers(display);
									if (!mesh || !mesh.userData.gui || !mesh.userData.gui.reset) mesh = oldMesh;
									if (mesh && mesh.userData.gui && mesh.userData.gui.reset) mesh.userData.gui.reset(pointId);
						});
						cPoints.__select[0].selected = true;
						dat.controllerNameAndTitle(cPoints, lang.select);
						if (cFrustumPoints !== undefined) cFrustumPoints.create(fPoints, getLanguageCode());
						if (guiParams.myThreejs) guiParams.myThreejs.cFrustumPoints = cFrustumPoints;
						options.dat.guiSelectPoint = options.dat.guiSelectPoint || {};
						options.dat.guiSelectPoint.boDisplayVerticeID = options.dat.guiSelectPoint.boDisplayVerticeID || false;
						var cDisplayVerticeID = f3DObjects.add(options.dat.guiSelectPoint, 'boDisplayVerticeID').onChange(function (value) {
									for (var i = 1; i < cMeshs.__select.options.length; i++) {
												var option = cMeshs.__select.options[i];
												if (option.mesh === undefined) {
															console.error('guiSelectPoint: cDisplayVerticeID.onChange. Invalud option.mesh');
															continue;
												}
												displayVerticeID(option.mesh);
									}
						});
						dat.controllerNameAndTitle(cDisplayVerticeID, lang.displayVerticeID, lang.displayVerticeIDTitle);
						if (options.dat && options.dat.guiSelectPoint && options.dat.guiSelectPoint.point) cCustom = options.dat.guiSelectPoint.point(options, dat, fMesh);
						if (options.player) {
									var orbitControlsOptions;
									if (guiParams.cameraTarget) options.playerOptions.cameraTarget.init(guiParams.cameraTarget, options);
									var playerCameraTarget = options.playerOptions.cameraTarget.get(options);
									if (playerCameraTarget) {
												cCameraTarget = fPoints.add(playerCameraTarget, 'boLook').onChange(function (boLook) {
															var mesh = getMesh();
															if (mesh.userData.boFrustumPoints) {
																		if (boLook) {
																					console.warn('guiSelectPoint.cCameraTarget.onChange(...). The camera can not look at the frustum point.');
																					cCameraTarget.setValue(false);
																		}
																		return;
															}
															if (!mesh.userData.player) {
																		mesh.userData.player = { arrayFuncs: [] };
																		for (var i = 0; i < mesh.geometry.attributes.position.count; i++) {
																					mesh.userData.player.arrayFuncs.push(new THREE.Vector3().fromArray(mesh.geometry.attributes.position.array, i * mesh.geometry.attributes.position.itemSize));
																		}
															}
															var index = mesh.userData.boFrustumPoints ? cFrustumPoints.getSelectedIndex() : cPoints.__select.options.selectedIndex - 1,
															    point = typeof mesh.userData.player.arrayFuncs === "function" ? new THREE.Vector3().fromArray(mesh.userData.player.arrayFuncs().attributes.position.array, index * 3) : mesh.userData.player.arrayFuncs !== undefined ? mesh.userData.player.arrayFuncs[index] : new THREE.Vector3().fromArray(mesh.geometry.attributes.position.array, index * 3);
															for (var i = 0; i < cMeshs.__select.options.length; i++) {
																		var _mesh2 = cMeshs.__select.options[i].mesh;
																		if (!_mesh2 || !_mesh2.userData.player || !_mesh2.userData.player.arrayFuncs) continue;
																		var arrayFuncs = _mesh2.userData.player.arrayFuncs;
																		for (var j = 0; j < arrayFuncs.length; j++) {
																					if (arrayFuncs[j].cameraTarget) arrayFuncs[j].cameraTarget.boLook = false;
																		}
															}
															if (point.cameraTarget) point.cameraTarget.boLook = boLook;
															if (options.player) options.player.selectScene();
															if (options.cameraGui) options.cameraGui.look(boLook);
															if (boLook) {
																		if (!point.cameraTarget) {
																					if (playerCameraTarget.boLook === undefined) Player$1.cameraTarget2.boLook = false;
																					if (!orbitControlsOptions) orbitControlsOptions = {};
																					if (!orbitControlsOptions.target) orbitControlsOptions.target = new THREE.Vector3();
																					if (options.orbitControls) orbitControlsOptions.target.copy(options.orbitControls.target);
																					options.playerOptions.cameraTarget.changeTarget(mesh, index);
																		}
																		return;
															}
															if (guiParams.cameraTarget) guiParams.cameraTarget.camera.userData.cameraTargetPoint = point.cameraTarget;
															if (options.orbitControls) options.orbitControls.reset();
															if (orbitControlsOptions) {
																		if (getCameraTarget()) return;
																		if (Player$1.orbitControls) Player$1.orbitControls.target.copy(orbitControlsOptions.target);
																		guiParams.cameraTarget.camera.lookAt(orbitControlsOptions.target);
																		point.cameraTarget = undefined;
															}
												});
												dat.controllerNameAndTitle(cCameraTarget, lang.cameraTarget, lang.cameraTargetTitle);
									}
						}
						fPoint = fPoints.addFolder(lang.point);
						dat.folderNameAndTitle(fPoint, lang.point, lang.pointTitle);
						fPointWorld = fPoints.addFolder(lang.pointWorld);
						dat.folderNameAndTitle(fPointWorld, lang.pointWorld, lang.pointWorldTitle);
						fPointWorld.open();
						displayPointControllers('none');
						if (guiParams.pointsControls) {
									guiParams.pointsControls(fPoints, dislayEl, getMesh);
						}
						cTraceAll = fPoints.add({ trace: false }, 'trace').onChange(function (value) {
									var mesh = getMesh();
									mesh.userData.traceAll = value;
									for (var i = 0; i < mesh.geometry.attributes.position.count; i++) {
												visibleTraceLine({ object: mesh, index: i }, value, getMesh);
									}cTrace.setValue(value);
						});
						dat.controllerNameAndTitle(cTraceAll, lang.trace, lang.traceAllTitle);
						dislayEl(cTraceAll, options.player);
						dat.controllerNameAndTitle(f3DObjects.add({
									defaultF: function defaultF(value) {
												for (var i = 0; i < cMeshs.__select.options.length; i++) {
															var _mesh3 = cMeshs.__select.options[i].mesh;
															if (!_mesh3) continue;
															_mesh3.scale.copy(_mesh3.userData.default.scale);
															_mesh3.position.copy(_mesh3.userData.default.position);
															_mesh3.rotation.copy(_mesh3.userData.default.rotation);
															_mesh3.needsUpdate = true;
												}
												setScaleControllers();
												setPositionControllers();
												setRotationControllers();
												exposePosition();
												if (options.frustumPoints) options.frustumPoints.onChangeControls();
									}
						}, 'defaultF'), lang.defaultButton, lang.default3DObjectTitle);
						addPointControllers();
						while (arrayMeshs.length > 0) {
									this.addMesh(arrayMeshs[arrayMeshs.length - 1]);
									arrayMeshs.pop();
						}
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
			this.updatePoints = function () {
						var boDisplayVerticeID = options.dat.guiSelectPoint.boDisplayVerticeID,
						    mesh = getMesh();
						if (boDisplayVerticeID) {
									options.dat.guiSelectPoint.boDisplayVerticeID = false;
									displayVerticeID(mesh);
						}
						cPoints.__onChange(-1);
						this.removePoints();
						mesh.userData.player.arrayFuncs.length = 0;
						delete mesh.userData.player.arrayFuncs;
						createPlayerArrayFuncs(mesh);
						addPoints(mesh);
						if (boDisplayVerticeID) {
									options.dat.guiSelectPoint.boDisplayVerticeID = true;
									displayVerticeID(mesh);
						}
						if (mesh.userData.nd) mesh.userData.nd.update();
			};
			function addPointControllers() {
						function isReadOnlyController(controller) {
									if (controller.boSetValue) return true;
									if (isReadOnlyEl(controller)) {
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
						function axesGui(axisName) {
									var scale, controller;
									if (axisName === 'w') {
												var onChange = function onChange(value) {
															var attributes = intersection.object.geometry.attributes,
															    i = intersection.index;
															if (attributes.position.itemSize < 4) {
																		console.error('guiSelectPoint.addPointControllers().axesGui().controller.onChange(): attributes.position.itemSize = ' + attributes.position.itemSize);
																		return;
															}
															if (options.palette) Player$1.setColorAttribute(attributes, i, options.palette.toColor(value, controller.__min, controller.__max));
															attributes.position.setW(i, value);
															if (options.frustumPoints) options.frustumPoints.updateCloudPointItem(intersection.object, intersection.index);
												};
												options.scales.setW();
												scale = options.scales.w;
												if (scale.min !== undefined && scale.max !== undefined) {
															controller = fPoint.add({ value: scale.min }, 'value', scale.min, scale.max, (scale.max - scale.min) / 100).onChange(function (value) {
																		if (isReadOnlyController(controller)) return;
																		onChange(value);
															});
															if (options.palette instanceof ColorPicker$1.palette) {
																		controller.domElement.querySelector('.slider-fg').style.height = '40%';
																		var elSlider = controller.domElement.querySelector('.slider');
																		ColorPicker$1.create(elSlider, {
																					palette: options.palette,
																					style: {
																								width: '65%'
																					}
																		});
															}
												} else controller = fPoint.add({ value: 0 }, 'value').onChange(function (value) {
															onChange(value);
												});
									} else {
												scale = options.axesHelper === undefined || options.axesHelper === false ? options.scales[axisName] :
												options.axesHelper.options ? options.axesHelper.options.scales[axisName] : undefined;
												if (scale.isAxis()) controller = fPoint.add({ value: scale.min }, 'value', scale.min, scale.max, (scale.max - scale.min) / 100).onChange(function (value) {
															var points = intersection.object;
															if (isReadOnlyController(controller)) return;
															var axesId = axisName === 'x' ? 0 : axisName === 'y' ? 1 : axisName === 'z' ? 2 : axisName === 'w' ? 3 : console.error('axisName:' + axisName);
															points.geometry.attributes.position.array[axesId + intersection.index * points.geometry.attributes.position.itemSize] = value;
															points.geometry.attributes.position.needsUpdate = true;
															exposePosition(intersection.index);
															if (options.frustumPoints) options.frustumPoints.updateCloudPointItem(points, intersection.index);
												});
									}
									if (controller) dat.controllerNameAndTitle(controller, scale.name);
									return controller;
						}
						cX = axesGui('x');
						cY = axesGui('y');
						cZ = axesGui('z');
						cW = axesGui('w');
						cColor = fPoint.addColor({ color: '#FFFFFF' }, 'color').onChange(function (value) {
									if (isReadOnlyController(cColor)) return;
									if (cColor.userData === undefined) return;
									var intersection = cColor.userData.intersection;
									Player$1.setColorAttribute(intersection.object.geometry.attributes, intersection.index, value);
						});
						dat.controllerNameAndTitle(cColor, options.scales.w ? options.scales.w.name : lang.color);
						cOpacity = fPoint.add({ opasity: 1 }, 'opasity', 0, 1, 0.01).onChange(function (opasity) {
									if (isReadOnlyController(cOpacity)) return;
									var mesh = getMesh();
									if (mesh.userData.myObject) {
												mesh.userData.myObject.verticeOpacity(intersection.index, true, opasity);
												return;
									}
									if (!mesh.material.transparent) {
												console.error('GuiSelectPoint: cOpacity.onChange. Invalid mesh.material.transparent = ' + mesh.material.transparent);
												return;
									}
									if (!mesh.material.vertexColors) {
												console.error('GuiSelectPoint: cOpacity.onChange. Invalid mesh.material.vertexColors = ' + mesh.material.vertexColors);
												return;
									}
									var color = mesh.geometry.attributes.color;
									if (color.itemSize < 4) return;
									color.array[3 + intersection.index * color.itemSize] = opasity;
									color.needsUpdate = true;
						});
						dat.controllerNameAndTitle(cOpacity, lang.opacity, lang.opacityTitle);
						cTrace = fPoint.add({ trace: false }, 'trace').onChange(function (value) {
									visibleTraceLine(intersection, value, getMesh);
						});
						dat.controllerNameAndTitle(cTrace, lang.trace, lang.traceTitle);
						dislayEl(cTrace, options.player);
						if (guiParams.pointControls) {
									guiParams.pointControls(fPoint, dislayEl, getMesh, intersection);
						}
						function axesWorldGui(axisName) {
									var scale = options.axesHelper === undefined || options.axesHelper === false ? options.scales[axisName] : options.axesHelper.options ? options.axesHelper.options.scales[axisName] : undefined;
									if (!scale.isAxis()) return;
									var controller = dat.controllerZeroStep(fPointWorld, { value: scale.min }, 'value');
									readOnlyEl(controller, true);
									dat.controllerNameAndTitle(controller, scale.name);
									return controller;
						}
						cWorld.x = axesWorldGui('x');
						cWorld.y = axesWorldGui('y');
						cWorld.z = axesWorldGui('z');
						cRestoreDefaultLocalPosition = fPoint.add({
									defaultF: function defaultF() {
												var positionDefault = intersection.object.userData.player.arrayFuncs[intersection.index],
												    t = options.time,
												    setDefaultValue = function setDefaultValue(control, value) {
															if (!control) return;
															control.setValue(typeof value === "function" ? value(t, options.a, options.b) : typeof value === "string" ? Player$1.execFunc({ w: value }, 'w', options.time, options) : value);
												};
												setDefaultValue(cX, positionDefault.x);
												setDefaultValue(cY, positionDefault.y);
												setDefaultValue(cZ, positionDefault.z === undefined ? 0 :
												positionDefault.z);
												if (isDislayEl(cOpacity)) cOpacity.setValue(cOpacity.initialValue);
												if (isDislayEl(cColor) && !isReadOnlyEl(cColor)) cColor.setValue(cColor.initialValue);
												if (positionDefault.w !== undefined) {
															if (positionDefault.w.r !== undefined) cColor.setValue('#' + new THREE.Color(positionDefault.w.r, positionDefault.w.g, positionDefault.w.b).getHexString());else if (typeof positionDefault.w === "function") {
																		setValue(cW, positionDefault.w(t));
																		return;
															} else if (positionDefault.w.func) {
																		setValue(cW, positionDefault.w.func(t));
																		return;
															}
															var float = parseFloat(positionDefault.w);
															if (float === positionDefault.w) {
																		if (isDislayEl(cW)) setValue(cW, positionDefault.w);
															} else if (typeof positionDefault.w === "string") {
																		setValue(cW, Player$1.execFunc(positionDefault, 'w', options.time, options));
																		return;
															} else console.error('Restore default local position: Invalid W axis.');
												} else cColor.setValue(cColor.initialValue);
									}
						}, 'defaultF');
						dat.controllerNameAndTitle(cRestoreDefaultLocalPosition, lang.defaultButton, lang.defaultLocalPositionTitle);
						funcFolder = new functionsFolder(fPoint, function (func, axisName, value) {
									var mesh = getMesh(),
									    index = cPoints.__select.options.selectedIndex - 1,
									    funcs = mesh.userData.player.arrayFuncs[index];
									funcs[axisName] = func;
									var parent = mesh.parent,
									    t = 0;
									while (parent) {
												if (parent.userData.t) {
															t = parent.userData.t;
															break;
												}
												parent = parent.parent;
									}
									var controller;
									switch (axisName) {
												case 'x':
															controller = cX;
															break;
												case 'y':
															controller = cY;
															break;
												case 'z':
															controller = cZ;
															break;
												case 'w':
															if (func instanceof THREE.Color) {
																		cColor.setValue('#' + func.getHexString());
																		return;
															}
															controller = cW;
															break;
												default:
															console.error('GuiSelectPoint new functionsFolder onFinishChange: axisName = ' + axisName);
															return;
									}
									setValue(controller, Player$1.execFunc(funcs, axisName, t, options));
									if (funcs.controllers) {
												var controllerObject = funcs.controllers[axisName];
												if (controllerObject && controllerObject.func && controllerObject.func.controller) controllerObject.func.controller.value = value;
									}
						}, options, { x: '', y: '', z: '', w: '' });
			}
			this.getFrustumPoints = function () {
						return cFrustumPoints;
			};
			return this;
};

/**
 * @module MoveGroupGui
 *
 * @description Add MoveGroup folder into {@link https://github.com/anhr/dat.gui|dat.gui} for changing group's position, scale and rotation.
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
var MoveGroupGui =
function MoveGroupGui(group, options) {
			var guiParams = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
			classCallCheck(this, MoveGroupGui);
			if (!options.boOptions) {
						console.error('MoveGroupGui: call options = new Options( options ) first');
						return;
			}
			var gui = guiParams.folder || options.dat.gui;
			if (!gui || options.dat.moveScene === false) return;
			if (options.axesHelper && options.axesHelper.options) options.scales = options.axesHelper.options.scales;else options.scales = options.scales || { x: {}, y: {}, z: {} };
			var cookie = options.dat.cookie,
			    dat = three$1.dat,
			cookieName = 'MoveGroup' + (options.cookieName ? '_' + options.cookieName : ''),
			    optionsGroup = {
						scale: group.scale,
						position: group.position,
						rotation: group.rotation,
						x: { zoomMultiplier: 1.2, offset: 0.1 },
						y: { zoomMultiplier: 1.2, offset: 0.1 },
						z: { zoomMultiplier: 1.2, offset: 0.1 }
			},
			    groupOptionsDefault = JSON.parse(JSON.stringify(optionsGroup));
			Object.freeze(groupOptionsDefault);
			cookie.getObject(cookieName, optionsGroup, groupOptionsDefault);
			group.scale.copy(optionsGroup.scale);
			group.position.copy(optionsGroup.position);
			optionsGroup.scale = group.scale;
			optionsGroup.position = group.position;
			function setDefault(axisName) {
						var scale = options.scales[axisName];
						if (!scale) return;
						options.moveGroupGui = options.moveGroupGui || { scales: {} };
						options.moveGroupGui.scales[axisName] = options.moveGroupGui.scales[axisName] || {};
						options.moveGroupGui.scales[axisName].default = function () {
									var scalesControllers = options.scalesControllers[axisName];
									scalesControllers.scale.setValue(groupOptionsDefault.scale[axisName]);
									scalesControllers.scaleController.setValue(groupOptionsDefault[axisName].zoomMultiplier);
									scalesControllers.position.setValue(groupOptionsDefault.position[axisName]);
									scalesControllers.positionController.setValue(groupOptionsDefault[axisName].offset);
									scalesControllers.rotation.setValue(groupOptionsDefault.rotation['_' + axisName]);
						};
			}
			setDefault('x');
			setDefault('y');
			setDefault('z');
			var lang = {
						moveGroup: 'Move Group',
						scale: 'Scale',
						position: 'Position',
						rotation: 'Rotation',
						defaultButton: 'Default',
						defaultTitle: 'Move group to default position.'
			};
			switch (options.getLanguageCode()) {
						case 'ru':
									lang.moveGroup = 'Переместить группу';
									lang.scale = 'Масштаб';
									lang.position = 'Позиция';
									lang.rotation = 'Вращение';
									lang.defaultButton = 'Восстановить';
									lang.defaultTitle = 'Переместить группу в исходное состояние.';
									break;
						default:
									if (options.lang === undefined || options.lang.languageCode != languageCode) break;
									Object.keys(options.lang).forEach(function (key) {
												if (lang[key] === undefined) return;
												lang[key] = options.lang[key];
									});
			}
			if (guiParams.lang) lang.moveGroup = guiParams.lang.moveGroup || lang.moveGroup;
			function axisZoom(axisName, action, zoom) {
						var scale = options.scalesControllers[axisName].scale;
						if (!scale) return;
						scale.setValue(action(scale.getValue(), zoom));
						setSettings();
			}
			var fMoveGroup = gui.addFolder(lang.moveGroup);
			fMoveGroup.add(new ScaleController(function (customController, action) {
						var zoom = customController.controller.getValue();
						axisZoom('x', action, zoom);
						axisZoom('y', action, zoom);
						axisZoom('z', action, zoom);
			}, {
						settings: { zoomMultiplier: 1.1 },
						getLanguageCode: guiParams.getLanguageCode
			}));
			function setSettings() {
						if (options.axesHelper) options.axesHelper.updateAxes();
						if (options.guiSelectPoint) options.guiSelectPoint.update();
						cookie.setObject(cookieName, optionsGroup);
			}
			function scale(axes, scaleControllers, axisName) {
						if (!axes.isAxis()) return;
						function onclick(customController, action) {
									var zoom = customController.controller.getValue();
									axisZoom(axisName, action, zoom);
						}
						scaleControllers.folder = fMoveGroup.addFolder(axes.name);
						scaleControllers.scaleController = scaleControllers.folder.add(new ScaleController(onclick, { settings: optionsGroup[axisName], getLanguageCode: guiParams.getLanguageCode })).onChange(function (value) {
									optionsGroup[axisName].zoomMultiplier = value;
									setSettings();
						});
						scaleControllers.scale = dat.controllerZeroStep(scaleControllers.folder, group.scale, axisName, function (value) {
									setSettings();
						});
						dat.controllerNameAndTitle(scaleControllers.scale, lang.scale);
						var positionController = new PositionController(function (shift) {
									function onclick(customController, action) {
												var offset = customController.controller.getValue();
												function axisOffset(axisName, action, offset) {
															var position = options.scalesControllers[axisName].position;
															if (!position) return;
															position.setValue(action(position.getValue(), offset));
															setSettings();
												}
												axisOffset(axisName, action, offset);
									}
									onclick(positionController, function (value, zoom) {
												value += shift;
												return value;
									});
						}, { settings: {}, getLanguageCode: guiParams.getLanguageCode });
						scaleControllers.positionController = scaleControllers.folder.add(positionController).onChange(function (value) {
									optionsGroup[axisName].offset = value;
									setSettings();
						});
						scaleControllers.position = dat.controllerZeroStep(scaleControllers.folder, group.position, axisName, function (value) {
									setSettings();
						});
						dat.controllerNameAndTitle(scaleControllers.position, lang.position);
						scaleControllers.rotation = scaleControllers.folder.add(group.rotation, axisName, 0, Math.PI * 2, 1 / 360).onChange(function (value) {
									setSettings();
						});
						dat.controllerNameAndTitle(scaleControllers.rotation, lang.rotation);
						dat.controllerNameAndTitle(scaleControllers.folder.add({
									defaultF: function defaultF(value) {
												options.moveGroupGui.scales[axisName].default();
									}
						}, 'defaultF'), lang.defaultButton, lang.defaultTitle);
			}
			options.scalesControllers = { x: {}, y: {}, z: {}, w: {} };
			if (options.scales) {
						scale(options.scales.x, options.scalesControllers.x, 'x');
						scale(options.scales.y, options.scalesControllers.y, 'y');
						scale(options.scales.z, options.scalesControllers.z, 'z');
			}
			var defaultParams = {
						defaultF: function defaultF(value) {
									if (options.moveGroupGui.scales.x) options.moveGroupGui.scales.x.default();
									if (options.moveGroupGui.scales.y) options.moveGroupGui.scales.y.default();
									if (options.moveGroupGui.scales.z) options.moveGroupGui.scales.z.default();
						}
			};
			dat.controllerNameAndTitle(fMoveGroup.add(defaultParams, 'defaultF'), lang.defaultButton, lang.defaultTitle);
};

/**
 * @module CameraGui
 * @description [Camera]{@link https://threejs.org/docs/index.html#api/en/cameras/PerspectiveCamera} graphical user interface.
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
var CameraGui =
function CameraGui(camera, options, gui) {
				classCallCheck(this, CameraGui);
				if (!options.boOptions) {
								console.error('CameraGui: call options = new Options( options ) first');
								return;
				}
				gui = gui || options.dat.gui;
				if (!gui || options.dat.cameraGui === false) return;
				var dat = three$1.dat,
				THREE = three$1.THREE;
				options.cameraGui = this;
				if (options.orbitControls) options.orbitControls.addEventListener('change', function () {
								update();
				});
				var lang = {
								camera: 'Camera',
								position: 'Position',
								positionTitle: 'Camera position',
								distanceToCamera: 'Distance',
								distanceToCameraTitle: 'Distance from the camera to the point at which the camera is looking',
								look: 'Look',
								lookTitle: 'Camera is look at a selected point during playing.',
								defaultButton: 'Default',
								defaultTitle: 'Restore default camera settings.'
				};
				switch (options.getLanguageCode()) {
								case 'ru':
												lang.camera = 'Камера';
												lang.position = 'Позиция';
												lang.positionTitle = 'Позиция камеры';
												lang.distanceToCamera = 'Расстояние';
												lang.distanceToCameraTitle = 'Расстояние между камерой и точкой, на которую она смотрит.', lang.look = 'Следить';
												lang.lookTitle = 'Камера следит за выбранной точкой во время проигрывания.';
												lang.defaultButton = 'Восстановить';
												lang.defaultTitle = 'Восстановить настройки камеры по умолчанию.';
												break;
								default:
												if (options.lang === undefined || options.lang.languageCode != _languageCode) break;
												Object.keys(options.lang).forEach(function (key) {
																if (lang[key] === undefined) return;
																lang[key] = options.lang[key];
												});
				}
				var fCamera = gui.addFolder(lang.camera),
				    fPosition = fCamera.addFolder(lang.position),
				    controllersPosition = {
								x: options.scales.x ? dat.controllerZeroStep(fPosition, camera.position, 'x', function (value) {
												camera.position.x = value;
								}) : undefined,
								y: options.scales.y ? dat.controllerZeroStep(fPosition, camera.position, 'y', function (value) {
												camera.position.y = value;
								}) : undefined,
								z: options.scales.z ? dat.controllerZeroStep(fPosition, camera.position, 'z', function (value) {
												camera.position.z = value;
								}) : undefined
				};
				dat.folderNameAndTitle(fPosition, lang.position, lang.positionTitle);
				if (controllersPosition.x) dat.controllerNameAndTitle(controllersPosition.x, options.scales.x.name);
				if (controllersPosition.y) dat.controllerNameAndTitle(controllersPosition.y, options.scales.y.name);
				if (controllersPosition.z) dat.controllerNameAndTitle(controllersPosition.z, options.scales.z.name);
				var controllersDistance, defaultDistance, funcFolder, controllerLook;
				if (options.player) {
								var setDistance = function setDistance(axisName, value) {
												if (isNaN(value)) return;
												if (camera.userData.cameraTarget) camera.userData.cameraTarget.distanceToCameraCur[axisName] = value;
												cameraTarget.distanceToCameraCur[axisName] = value;
												cameraTarget.setCameraPosition();
												update();
								};
								options.playerOptions.cameraTarget.init({ camera: camera }, options);
								var cameraTarget = options.playerOptions.cameraTarget.get();
								controllerLook = fCamera.add(cameraTarget, 'boLook').onChange(function (boLook) {
												if (options.player) {
																cameraTarget.boMaual = true;
																options.player.selectScene();
																cameraTarget.boMaual = false;
												}
												if (boLook) return;
												if (options.orbitControls) options.orbitControls.reset();
								});
								dat.controllerNameAndTitle(controllerLook, lang.look, lang.lookTitle);
								var fDistanceToCamera = fCamera.addFolder(lang.distanceToCamera),
								    distance = {
												x: Player$1.execFunc(cameraTarget.distanceToCamera, 'x', undefined, options),
												y: Player$1.execFunc(cameraTarget.distanceToCamera, 'y', undefined, options),
												z: Player$1.execFunc(cameraTarget.distanceToCamera, 'z', undefined, options)
								};
								controllersDistance = {
												x: dat.controllerZeroStep(fDistanceToCamera, distance, 'x', function (value) {
																setDistance('x', value);
												}),
												y: dat.controllerZeroStep(fDistanceToCamera, distance, 'y', function (value) {
																setDistance('y', value);
												}),
												z: dat.controllerZeroStep(fDistanceToCamera, distance, 'z', function (value) {
																setDistance('z', value);
												})
								};
								defaultDistance = { x: distance.x, y: distance.y, z: distance.z };
								dat.folderNameAndTitle(fDistanceToCamera, lang.distanceToCamera, lang.distanceToCameraTitle);
								if (options.scales.x) dat.controllerNameAndTitle(controllersDistance.x, options.scales.x.name);
								if (options.scales.y) dat.controllerNameAndTitle(controllersDistance.y, options.scales.y.name);
								if (options.scales.z) dat.controllerNameAndTitle(controllersDistance.z, options.scales.z.name);
								funcFolder = new functionsFolder(fDistanceToCamera, function (func, axisName) {
												var cameraTarget = options.playerOptions.cameraTarget.get();
												cameraTarget.distanceToCamera[axisName] = func;
												var value = Player$1.execFunc(cameraTarget.distanceToCamera, axisName, options.time);
												controllersDistance[axisName].setValue(value, true);
												options.playerOptions.cameraTarget.init({ camera: camera }, options);
								}, options, cameraTarget.distanceToCamera);
				}
				var defaultPosition = { x: camera.position.x, y: camera.position.y, z: camera.position.z },
				    defaultTarget = options.orbitControls ? {
								x: options.orbitControls.target.x,
								y: options.orbitControls.target.y,
								z: options.orbitControls.target.z
				} : { x: 0, y: 0, z: 0 };
				dat.controllerNameAndTitle(fCamera.add({
								defaultF: function defaultF(value) {
												controllersPosition.x.setValue(defaultPosition.x);
												controllersPosition.y.setValue(defaultPosition.y);
												controllersPosition.z.setValue(defaultPosition.z);
												camera.position.copy(defaultPosition);
												camera.lookAt(defaultTarget);
												if (options.orbitControls) {
																options.orbitControls.target.copy(defaultTarget);
																options.orbitControls.update();
												}
												if (controllersDistance) {
																controllersDistance.x.setValue(defaultDistance.x);
																controllersDistance.y.setValue(defaultDistance.y);
																controllersDistance.z.setValue(defaultDistance.z);
												}
								}
				}, 'defaultF'), lang.defaultButton, lang.defaultTitle);
				function update() {
								var cameraTarget = options.playerOptions.cameraTarget.get(options);
								if (controllersPosition.x) controllersPosition.x.setValue(camera.position.x);
								if (controllersPosition.y) controllersPosition.y.setValue(camera.position.y);
								if (controllersPosition.z) controllersPosition.z.setValue(camera.position.z);
								if (controllersDistance) {
												var distanceToCamera = cameraTarget.getDistanceToCamera();
												if (controllersDistance.x) controllersDistance.x.setValue(distanceToCamera.x);
												if (controllersDistance.y) controllersDistance.y.setValue(distanceToCamera.y);
												if (controllersDistance.z) controllersDistance.z.setValue(distanceToCamera.z);
								}
								if (funcFolder) funcFolder.setFunction(cameraTarget.distanceToCamera);
				}
				this.update = function () {
								update();
				};
				this.look = function () {
								var boLook = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
								if (controllerLook) {
												controllerLook.object[controllerLook.property] = boLook;
												controllerLook.updateDisplay();
								}
				};
};

/**
 * FolderPoint
 *
 * GUI for changing point settings.
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
var FolderPoint = function FolderPoint(point, setSize, options) {
		var settings = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
		classCallCheck(this, FolderPoint);
		var dat = three$1.dat;
		if (!options.boOptions) {
				console.error('FolderPoint: call options = new Options( options ) first');
				return;
		}
		var gui = settings.folder || options.dat.gui;
		if (!gui || options.dat.folderPoint === false) return;
		options.dat.folderPoint = this;
		var lang = {
				pointSettings: 'Point',
				size: 'Size',
				sizeTitle: 'Size of the point with "ShaderMaterial" material',
				defaultButton: 'Default',
				defaultPointTitle: 'Restore point.'
		};
		switch (options.getLanguageCode()) {
				case 'ru':
						lang.pointSettings = 'Точка';
						lang.size = 'Размер';
						lang.sizeTitle = 'Размер точки с материалом типа "ShaderMaterial"';
						lang.defaultButton = 'Восстановить';
						lang.defaultPointTitle = 'Восстановить точку';
						break;
		}
		var defaultPoint = settings.defaultPoint || {};
		if (defaultPoint.size === undefined) defaultPoint.size = point.size;
		var PCOptions = settings.PCOptions || {};
		if (PCOptions.min === undefined) PCOptions.min = 0.01;
		if (PCOptions.max === undefined) PCOptions.max = 1;
		PCOptions.settings = PCOptions.settings || {};
		if (PCOptions.settings.offset === undefined) PCOptions.settings.offset = 1;
		if (PCOptions.step === undefined) PCOptions.step = 0.01;
		PCOptions.getLanguageCode = PCOptions.getLanguageCode || settings.getLanguageCode || options.getLanguageCode;
		var fPoint = gui.addFolder(lang.pointSettings),
		    fSize = fPoint.addFolder(lang.size);
		dat.folderNameAndTitle(fSize, lang.size, lang.sizeTitle);
		this.display = function (display) {
				fPoint.domElement.style.display = display;
		};
		fSize.add(new PositionController(function (shift) {
				setSize(point.size + shift);
		}, PCOptions));
		this.size = dat.controllerZeroStep(fSize, point, 'size', function (value) {
				setSize(value);
		});
		dat.controllerNameAndTitle(this.size, lang.size, lang.sizeTitle);
		dat.controllerNameAndTitle(fPoint.add({
				defaultF: function defaultF(value) {
						setSize(defaultPoint.size);
				}
		}, 'defaultF'), lang.defaultButton, lang.defaultPointTitle);
};

/**
 * frustumPoints
 *
 * Array of points, statically fixed in front of the camera.
 * I use frustumPoints for displaying of the clouds around points.
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
var debug = {
				notHiddingFrustumPoints: true
};
function getStandardNormalDistribution(x) {
				var standardDeviation = 0.1;
				var res = Math.exp(-0.5 * x * x / (standardDeviation * standardDeviation));
				return res;
}
var FrustumPoints =
function FrustumPoints(camera, group, canvas) {
				var settings = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
				classCallCheck(this, FrustumPoints);
				var THREE = three$1.THREE;
				settings.options = settings.options || new Options();
				var options = settings.options;
				if (!options.boOptions) {
								console.error('FrustumPoints: call options = new Options( options ) first');
								return;
				}
				if (!options.frustumPoints) return;
				this.gl = canvas.getContext('webgl');
				this.getOptions = function () {
								return options;
				};
				var optionsShaderMaterial = options.frustumPoints;
				options.frustumPoints = this;
				var _arrayCloud = [];
				var _guiSelectPoint, _names, _points;
				_arrayCloud.getCloudsCount = function () {
								var count = 0;
								for (var i = 0; i < _arrayCloud.length; i++) {
												var arrayVectors = _arrayCloud[i];
												count += arrayVectors.length;
								}
								return count;
				};
				this.pushArrayCloud = function (geometry) {
								var points;
								if (geometry.geometry) {
												points = geometry;
												geometry = geometry.geometry;
								}
								if (geometry.attributes.position.itemSize !== 4) {
												console.error('FrustumPoints.pushArrayCloud: Invalid geometry.attributes.position.itemSize = ' + geometry.attributes.position.itemSize);
												return;
								}
								var index = _arrayCloud.getCloudsCount(),
								    arrayPoints = [];
								_arrayCloud.push(arrayPoints);
								for (var i = 0; i < geometry.attributes.position.count; i++) {
												var point = new THREE.Vector4().fromArray(geometry.attributes.position.array, i * geometry.attributes.position.itemSize);
												arrayPoints.push(point);
								}
								if (points) points.userData.cloud = { indexArray: index };
								return index;
				};
				this.create = function (renderer) {
								if (_arrayCloud.length === 0) return undefined;
								var shaderMaterial = {},
								    zeroPoint = new THREE.Vector3(),
								    cameraDistanceDefault = camera.position.distanceTo(zeroPoint),
								    _this = this,
								groupFrustumPoints = new THREE.Group();
								settings.optionsShaderMaterial = settings.optionsShaderMaterial || {};
								optionsShaderMaterial.point = optionsShaderMaterial.point || {};
								optionsShaderMaterial.point.size = optionsShaderMaterial.point.size || 0.01;
								optionsShaderMaterial.display = optionsShaderMaterial.display === undefined ? true : optionsShaderMaterial.display;
								optionsShaderMaterial.info = optionsShaderMaterial.info !== undefined ? optionsShaderMaterial.info : false;
								optionsShaderMaterial.stereo = optionsShaderMaterial.stereo || {};
								optionsShaderMaterial.stereo.hide = optionsShaderMaterial.stereo.hide || 0;
								optionsShaderMaterial.stereo.opacity = optionsShaderMaterial.stereo.opacity || 0.3;
								optionsShaderMaterial.zCount = optionsShaderMaterial.zCount || 50;
								optionsShaderMaterial.yCount = optionsShaderMaterial.yCount || 30;
								optionsShaderMaterial.near = optionsShaderMaterial.near || 0;
								optionsShaderMaterial.far = optionsShaderMaterial.far || 0;
								optionsShaderMaterial.base = optionsShaderMaterial.base || 100;
								optionsShaderMaterial.square = optionsShaderMaterial.square !== undefined ? optionsShaderMaterial.square : false;
								var cookie = options.dat.cookie,
								    cookieName = options.dat ? options.dat.getCookieName('FrustumPoints') : 'FrustumPoints';
								Object.freeze(optionsShaderMaterial);
								if (cookie) cookie.getObject(cookieName, shaderMaterial, optionsShaderMaterial);
								if (shaderMaterial.stereo) {
												shaderMaterial.stereo.hide = optionsShaderMaterial.stereo.hide;
												shaderMaterial.stereo.opacity = optionsShaderMaterial.stereo.opacity;
								}
								var cloud = function cloud() {
												var uniforms;
												var distanceTableWidth;
												this.create = function (_uniforms) {
																uniforms = _uniforms;
																if (!options.scales.w) options.scales.setW();
																var max = options.scales.w.max,
																    min = options.scales.w.min;
																uniforms.paletteA = { value: 1 / (max - min) };
																uniforms.paletteB = { value: -min / (max - min) };
																this.cloudPoints = new this.addUniforms(THREE.RGBAFormat, _arrayCloud.getCloudsCount(), 'cloudPoints');
																distanceTableWidth = 256;
																var pointLength = 2;
																new this.addUniforms(THREE.LuminanceFormat,
																distanceTableWidth, 'distanceTable', {
																				height: pointLength,
																				onReady: function onReady(data, itemSize, updateItem) {
																								var fDistancePrev,
																								    x = 0;
																								var dDistanceMax = 0.035;
																								var dx = 0.5 / (distanceTableWidth - 1);var ddx = 1.001;
																								for (var i = 0; i < distanceTableWidth; i++) {
																												var fDistance = getStandardNormalDistribution(x);
																												x += dx;
																												if (fDistancePrev !== undefined) {
																																if (Math.abs(fDistancePrev - fDistance) > dDistanceMax) dx /= ddx;else dx *= ddx;
																												}
																												fDistancePrev = fDistance;
																												updateItem(i, fDistance);
																												updateItem(i + distanceTableWidth, x);
																								}
																				}
																});
												};
												this.addUniforms = function (format, width, key, optionsAddUniforms) {
																optionsAddUniforms = optionsAddUniforms || {};
																var itemSize = format === THREE.RGBAFormat ? 4 : format === THREE.RGBFormat ? 3 : format === THREE.LuminanceFormat ? 1 : NaN;
																var height = optionsAddUniforms.height || 1,
																size = width * height,
																    type = THREE.FloatType,
																    data = type === THREE.FloatType ? new Float32Array(itemSize * size) : new Uint8Array(itemSize * size);
																if (this.addUniforms !== undefined) console.error('Please use "new this.addUniforms(...)"');
																this.updateItem = function (i, vector) {
																				var x, y, z, w;
																				if (typeof vector === "number") x = vector;else if (vector.x === undefined) {
																								x = vector.r;
																								y = vector.g;
																								z = vector.b;
																								w = 1;
																				} else {
																								x = vector.x;
																								y = vector.y;
																								z = vector.z;
																								if (isNaN(vector.w)) console.error('frustumPoints.create.cloud.addUniforms.updateItem: vector.w = ' + vector.w + '. Probably you use THREE.Color for w coordinate of the point with cloud.');
																								w = vector.w;
																				}
																				var vectorSize = y === undefined ? 1 : z === undefined ? 2 : w === undefined ? 3 : 4,
																				    stride = i * itemSize;
																				if (vectorSize !== itemSize) console.error('frustumPoints.create.cloud.addUniforms.updateItem: vectorSize = ' + vectorSize + ' !== itemSize = ' + itemSize);
																				data[stride] = x;
																				if (itemSize > 1) {
																								data[stride + 1] = y;
																								if (itemSize > 2) {
																												data[stride + 2] = z;
																												if (itemSize > 3) data[stride + 3] = w;
																								}
																				}
																};
																if (optionsAddUniforms.onReady !== undefined) optionsAddUniforms.onReady(data, itemSize, this.updateItem);
																uniforms[key] = {
																				value: new THREE.DataTexture(data, width, height, format, type)
																};
																uniforms[key].value.needsUpdate = true;
																return itemSize;
												};
												this.editShaderText = function (shaderText) {
																var scloudPointsWidth = 0;
																for (var i = 0; i < _arrayCloud.length; i++) {
																				var arrayVectors = _arrayCloud[i];
																				scloudPointsWidth += arrayVectors.length;
																}
																shaderText.vertex = shaderText.vertex.replace('%scloudPointsWidth', scloudPointsWidth + '.');
																shaderText.vertex = shaderText.vertex.replace('%distanceTableWidth', distanceTableWidth + '.');
												};
												this.updateMesh = function (mesh) {
																if (mesh.userData.cloud === undefined || !this.cloudPoints
																) return;
																for (var i = 0; i < mesh.geometry.attributes.position.count; i++) {
																				var point = new THREE.Vector4().fromArray(mesh.geometry.attributes.position.array, i * mesh.geometry.attributes.position.itemSize);
																				this.cloudPoints.updateItem(mesh.userData.cloud.indexArray + i, getWorldPosition(mesh, point));
																}
												};
								};
								cloud = new cloud();
								group.add(groupFrustumPoints);
								function setPointsParams() {
												function set$$1() {
																if (!_points) return;
																_points.position.copy(camera.position);
																_points.rotation.set(camera.rotation.x, camera.rotation.y, camera.rotation.z);
																var scale = camera.position.distanceTo(zeroPoint) / cameraDistanceDefault;
																_points.scale.x = scale;
																_points.scale.y = scale;
																_points.scale.z = scale;
												}
												set$$1();
												if (options.guiSelectPoint) options.guiSelectPoint.setMesh();
								}
								function update(onReady) {
												if (_points === undefined) {
																progress(onReady);
												}
								}
								this.onChangeControls = function () {
												if (!debug.notHiddingFrustumPoints) {
																if (timeoutControls === undefined) {
																				group.remove(_points);
																				group.remove(groupFrustumPoints);
																				options.raycaster.removeParticle(_points);
																}
																clearTimeout(timeoutControls);
																timeoutControls = setTimeout(function () {
																				group.add(groupFrustumPoints);
																				if (shaderMaterial.info) options.raycaster.addParticle(_points);
																				clearTimeout(timeoutControls);
																				timeoutControls = undefined;
																				if (!debug.notMoveFrustumPoints) {
																								_this.update();
																				}
																}, 500);
												} else if (!debug.notMoveFrustumPoints) {
																_this.update();
												}
								};
								function progress(_onReady) {
												if (!shaderMaterial.display) return;
												var cameraPerspectiveHelper = new THREE.CameraHelper(camera);
												var array,
												    indexArray = 0;
												function getPoint(pointName) {
																var points = cameraPerspectiveHelper.pointMap[pointName],
																    position = cameraPerspectiveHelper.geometry.attributes.position;
																return new THREE.Vector3().fromArray(position.array, points[0] * position.itemSize);
												}
												var point_n1 = getPoint('n1'),
												    point_n2 = getPoint('n2'),
												    point_n3 = getPoint('n3');
												var point_f1 = getPoint('f1'),
												    point_f2 = getPoint('f2'),
												    point_f3 = getPoint('f3');
												point_n1.x = point_n1.x * shaderMaterial.base / 100;
												point_n2.x = point_n2.x * shaderMaterial.base / 100;
												point_n3.x = point_n3.x * shaderMaterial.base / 100;
												point_n1.y = point_n1.y * shaderMaterial.base / 100;
												point_n2.y = point_n2.y * shaderMaterial.base / 100;
												point_n3.y = point_n3.y * shaderMaterial.base / 100;
												point_f1.x = point_f1.x * shaderMaterial.base / 100;
												point_f2.x = point_f2.x * shaderMaterial.base / 100;
												point_f3.x = point_f3.x * shaderMaterial.base / 100;
												point_f1.y = point_f1.y * shaderMaterial.base / 100;
												point_f2.y = point_f2.y * shaderMaterial.base / 100;
												point_f3.y = point_f3.y * shaderMaterial.base / 100;
												if (shaderMaterial.square) {
																point_n1.x /= camera.aspect;
																point_n2.x /= camera.aspect;
																point_n3.x /= camera.aspect;
																point_f1.x /= camera.aspect;
																point_f2.x /= camera.aspect;
																point_f3.x /= camera.aspect;
												}
												var pointn1x = point_n1.x,
												    pointn2x = point_n2.x,
												    pointn3x = point_n3.x,
												    pointn1y = point_n1.y,
												    pointn2y = point_n2.y,
												    pointn3y = point_n3.y,
												    pointn1z = point_n1.z;
												point_n1.x = point_n1.x + (point_f1.x - point_n1.x) * shaderMaterial.near / 100;
												point_n2.x = point_n2.x + (point_f2.x - point_n2.x) * shaderMaterial.near / 100;
												point_n3.x = point_n3.x + (point_f3.x - point_n3.x) * shaderMaterial.near / 100;
												point_n1.y = point_n1.y + (point_f1.y - point_n1.y) * shaderMaterial.near / 100;
												point_n2.y = point_n2.y + (point_f2.y - point_n2.y) * shaderMaterial.near / 100;
												point_n3.y = point_n3.y + (point_f3.y - point_n3.y) * shaderMaterial.near / 100;
												point_n1.z = point_n2.z = point_n3.z = point_n1.z + (point_f1.z - point_n1.z) * shaderMaterial.near / 100;
												point_f1.x = point_f1.x + (pointn1x - point_f1.x) * shaderMaterial.far / 100;
												point_f2.x = point_f2.x + (pointn2x - point_f2.x) * shaderMaterial.far / 100;
												point_f3.x = point_f3.x + (pointn3x - point_f3.x) * shaderMaterial.far / 100;
												point_f1.y = point_f1.y + (pointn1y - point_f1.y) * shaderMaterial.far / 100;
												point_f2.y = point_f2.y + (pointn2y - point_f2.y) * shaderMaterial.far / 100;
												point_f3.y = point_f3.y + (pointn3y - point_f3.y) * shaderMaterial.far / 100;
												point_f1.z = point_f2.z = point_f3.z = point_f1.z + (pointn1z - point_f1.z) * shaderMaterial.far / 100;
												var pointStart = new THREE.Vector3().copy(point_n1);
												var zCount = shaderMaterial.zCount,
												    zStep = (point_f1.z - point_n1.z) / ((zCount - 1) * (zCount - 1));
												var zx = 0;
												var yCount = shaderMaterial.yCount,
												    xCount = yCount * (shaderMaterial.square ? 1 : parseInt(camera.aspect));
												var zy = 0;
												shaderMaterial.zCount = optionsShaderMaterial.zCount;
												shaderMaterial.yCount = optionsShaderMaterial.yCount;
												var zStart = parseInt(zCount * shaderMaterial.stereo.hide / 100),
												    zEnd = zStart + zCount - 1;
												function Z(z) {
																var ynStep = (point_n3.y - point_n1.y) / (yCount - 1),
																    yfStep = (point_f3.y - point_f1.y) / (yCount - 1),
																    yStep = (yfStep - ynStep) / ((zCount - 1) * (zCount - 1)) * z * z + ynStep,
																    sqrtZCount = parseInt(Math.sqrt(zCount)),
																    yzStep = yStep / (sqrtZCount + parseInt(Math.sqrt(zCount - sqrtZCount * sqrtZCount))),
																xnStep = (point_n2.x - point_n1.x) / (xCount - 1),
																    xfStep = (point_f2.x - point_f1.x) / (xCount - 1),
																    xStep = (xfStep - xnStep) / ((zCount - 1) * (zCount - 1)) * z * z + xnStep,
																    xzStep = xStep / parseInt(Math.sqrt(zCount));
																pointStart.y = -yStep * (yCount - 1) / 2;
																pointStart.x = -xStep * (xCount - 1) / 2;
																for (var y = 0; y < yCount; y++) {
																				for (var x = 0; x < xCount; x++) {
																								if (z >= zStart) {
																												var addPoint = function addPoint(point) {
																																_names.push(x === 0 ? y === 0 ? { y: y, z: z } : { y: y } : x);
																																array[indexArray] = point.x;
																																indexArray++;
																																array[indexArray] = point.y;
																																indexArray++;
																																array[indexArray] = point.z;
																																indexArray++;
																												};
																												addPoint(new THREE.Vector3(pointStart.x + xStep * x + xzStep * zx, pointStart.y + yStep * y + yzStep * zy, pointStart.z + zStep * z * z));
																								}
																				}
																}
																zx++;
																if (zx >= parseInt(Math.sqrt(zCount))) {
																				zx = 0;
																				zy++;
																}
												}
												function eachZ(zStart, zEnd) {
																if (zStart > zEnd) return;
																Z(zStart);
																if (zStart >= zEnd) return;
																Z(zEnd);
																var zMid = parseInt((zStart + zEnd) / 2);
																if (zMid === zStart) return;
																Z(zMid);
																eachZ(zStart + 1, zMid - 1);
																eachZ(zMid + 1, zEnd - 1);
												}
												shaderMaterial.zCount = zCount;
												shaderMaterial.yCount = yCount;
												removePoints(true);
												var itemSize = 3;
												_this.pointIndexes = function (pointIndex) {
																if (_names === undefined) {
																				console.error('_names = ' + _names);
																				return undefined;
																}
																var name = _names[pointIndex],
																    x,
																    y,
																    z,
																    index = pointIndex;
																function getObject() {
																				index--;
																				while (index >= 0 && _typeof(_names[index]) !== "object") {
																								index--;
																				}name = _names[index];
																}
																function getZ() {
																				while (index >= 0 && name.z === undefined) {
																								getObject();
																				}
																}
																if ((typeof name === 'undefined' ? 'undefined' : _typeof(name)) === "object") {
																				x = 0;
																				y = name.y;
																				getZ();
																				z = name.z;
																} else {
																				x = name;
																				getObject();
																				y = name.y;
																				getZ();
																				z = name.z;
																}
																return { x: x, y: y, z: z };
												};
												var getCurrentScript = function getCurrentScript() {
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
												var path = getCurrentScriptPath();
												var cameraPositionDefault = new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z);
												var cameraQuaternionDefault = new THREE.Vector4(camera.quaternion.x, camera.quaternion.y, camera.quaternion.z, camera.quaternion.w);
												_points = false;
												new MyPoints(function () {
																var geometry = new THREE.BufferGeometry(),
																    geometryLength = (zEnd - zStart + 1) * xCount * yCount;
																array = new Float32Array(geometryLength * itemSize);
																indexArray = 0;
																_names = null;
																_names = [];
																eachZ(zStart, zEnd);
																geometry.setAttribute('position', new THREE.BufferAttribute(array, itemSize));
																return geometry;
												}, group, {
																options: options,
																pointsOptions: {
																				name: 'frustum points',
																				shaderMaterial: shaderMaterial,
																				boFrustumPoints: true,
																				position: camera.position,
																				scale: camera.scale,
																				rotation: camera.rotation,
																				opacity: true,
																				pointIndexes: function pointIndexes(pointIndex) {
																								return _this.pointIndexes(pointIndex);
																				},
																				path: {
																								vertex: path + '/frustumPoints/vertex.c'
																				},
																				pointName: function pointName(pointIndex) {
																								var indexes = _this.pointIndexes(pointIndex);
																								if (indexes === undefined) return indexes;
																								return 'x = ' + indexes.x + ', y = ' + indexes.y + ', z = ' + (indexes.z + zStart) + ', i = ' + pointIndex;
																				},
																				controllers: function controllers() {
																								if (_guiSelectPoint) _guiSelectPoint.appendChild({ xCount: xCount, yCount: yCount, zCount: zCount });
																				},
																				uniforms: function uniforms(_uniforms2) {
																								cloud.create(_uniforms2);
																								cameraQuaternionDefault.x = -cameraQuaternionDefault.x;
																								cameraQuaternionDefault.y = -cameraQuaternionDefault.y;
																								cameraQuaternionDefault.z = -cameraQuaternionDefault.z;
																								cameraPositionDefault.applyQuaternion(cameraQuaternionDefault);
																								_uniforms2.cameraPositionDefault = { value: cameraPositionDefault };
																								_uniforms2.cameraQuaternion = { value: camera.quaternion };
																								new cloud.addUniforms(THREE.RGBAFormat, 256, 'palette', {
																												onReady: function onReady(data, itemSize, updateItem) {
																																options.scales.setW();
																																var min = options.scales.w.min,
																																    max = options.scales.w.max;
																																var size = data.length / itemSize;
																																for (var i = 0; i < size; i++) {
																																				updateItem(i, options.palette.toColor((max - min) * i / (size - 1) + min, min, max));
																																}
																												}
																								});
																								return cloud;
																				},
																				onReady: function onReady(points) {
																								_points = points;
																								_points.userData.isInfo = function () {
																												return shaderMaterial.info;
																								};
																								if (shaderMaterial.info && options.raycaster) options.raycaster.addParticle(_points);
																								if (!shaderMaterial.display) removePoints();
																								pointOpacity = _points === undefined ? 1.0 : _points.userData.shaderMaterial === undefined ? shaderMaterial.point.opacity : _points.userData.shaderMaterial.point.opacity;
																								if (_onReady !== undefined) _onReady();
																								_this.update();
																								if (options.guiSelectPoint) options.guiSelectPoint.addMesh(_points);
																				}
																}
												});
								}
								update();
								var pointOpacity;
								this.update = function (onReady) {
												update(onReady);
												setPointsParams();
												var cameraQuaternionDefault = new THREE.Vector4(camera.quaternion.x, camera.quaternion.y, camera.quaternion.z, camera.quaternion.w);
												if (!_points) return;
												_points.material.uniforms.cameraPositionDefault.value.copy(camera.position);
												cameraQuaternionDefault.x = -cameraQuaternionDefault.x;
												cameraQuaternionDefault.y = -cameraQuaternionDefault.y;
												cameraQuaternionDefault.z = -cameraQuaternionDefault.z;
												_points.material.uniforms.cameraPositionDefault.value.applyQuaternion(cameraQuaternionDefault);
								};
								this.isDisplay = function () {
												return shaderMaterial.display;
								};
								this.updateCloudPoints = function () {
												group.children.forEach(function (mesh) {
																if (!mesh.userData.cloud) return;
																if (mesh.geometry.attributes.position.itemSize !== 4) {
																				console.error('mesh.geometry.attributes.position.itemSize = ' + mesh.geometry.attributes.position.itemSize);
																				return;
																}
																cloud.updateMesh(mesh);
												});
												needsUpdate();
								};
								function needsUpdate() {
												if (_points) _points.material.uniforms.cloudPoints.value.needsUpdate = true;
								}
								this.updateCloudPoint = function (mesh) {
												cloud.updateMesh(mesh);
												needsUpdate();
								};
								this.updateCloudPointItem = function (points, i) {
												if (points.userData.cloud === undefined) return;
												if (points.geometry.attributes.position.itemSize !== 4) console.error('points.geometry.attributes.position.itemSize = ' + points.geometry.attributes.position.itemSize);
												cloud.cloudPoints.updateItem(points.userData.cloud.indexArray + i, getWorldPosition(points, new THREE.Vector4().fromArray(points.geometry.attributes.position.array, i * points.geometry.attributes.position.itemSize)), true);
												needsUpdate();
								};
								function removePoints(notRemoveMesh) {
												if (_points === undefined) return;
												if (!notRemoveMesh && options.guiSelectPoint) options.guiSelectPoint.removeMesh(_points);
												group.remove(_points);
												renderer.renderLists.dispose();
												clearThree$1(_points);
												_points = undefined;
								}
								this.animate = function () {
												if (!_points || _points.userData.shaderMaterial === undefined || pointOpacity === _points.userData.shaderMaterial.point.opacity) {
																return false;
												}
												pointOpacity = _points.userData.shaderMaterial.point.opacity;
												_points.material.uniforms.opacity.value = _points.userData.shaderMaterial.point.opacity;
												return true;
								};
								this.updateGuiSelectPoint = function () {
												var index = options.guiSelectPoint ? options.guiSelectPoint.getMeshIndex(_points) : undefined;
												update();
												if (index) options.guiSelectPoint.setIndexMesh(index, _points);
								};
								this.gui = function (folder) {
												var dat = three$1.dat;
												folder = folder || options.dat.gui;
												if (!folder || options.dat.guiFrustumPoints === false) return;
												var lang = {
																frustumPoints: 'Frustum Points',
																frustumPointsTitle: 'A cloud of the fixed points in front of the camera for describe the properties of space.',
																display: 'Display',
																displayTitle: 'Display or hide Frustum Points.',
																info: 'Information',
																infoTitle: 'Display information about frustum point if user move mouse over or click this point.',
																stereo: 'Stereo',
																stereoTitle: 'Frustum Points setting for stereo mode of the canvas',
																hide: 'Hide Nearby Points',
																hideTitle: 'Hide the nearby to the camera points in percentage to all points for more comfortable visualisation.',
																opacity: 'Opacity',
																opacityTitle: 'Float in the range of 0.0 - 1.0 indicating how transparent the lines is. A value of 0.0 indicates fully transparent, 1.0 is fully opaque.',
																near: 'Near Layer',
																nearTitle: 'Shift of the frustum layer near to the camera in percents.',
																far: 'Far Layer',
																farTitle: 'Shift of the frustum layer far to the camera in percents.',
																base: 'Scale',
																baseTitle: 'Scale of the base of the frustum points in percents.',
																square: 'Square Base',
																squareTitle: 'Square base of the frustum points.',
																defaultButton: 'Default',
																defaultTitle: 'Restore default Frustum Points settings.',
																zCount: 'Z Count',
																zCountTitle: "The count of layers of the frustum of the camera's field of view.",
																yCount: 'Y Count',
																yCountTitle: "The count of vertical points for each z level of the  frustum of the camera's field of view."
												};
												switch (options.getLanguageCode()) {
																case 'ru':
																				lang.frustumPoints = 'Неподвижные точки';
																				lang.frustumPointsTitle = 'Облако точек перед камерой для описания свойств пространства';
																				lang.display = 'Показать';
																				lang.displayTitle = 'Показать или скрыть неподвижные точки.';
																				lang.info = 'Информация';
																				lang.infoTitle = 'Отображать информацию о неподвижной точке, если пользователь наведет курсор мыши или щелкнет эту точку.';
																				lang.stereo = 'Стерео';
																				lang.stereoTitle = 'Настройки неподвижных точек для стерео режима холста';
																				lang.hide = 'Близкие точки';
																				lang.hideTitle = 'Скрыть близкие к камере точки в процентах ко всем точкам для более удобной визуализации.';
																				lang.opacity = 'Непрозрачность';
																				lang.opacityTitle = 'Число в диапазоне 0.0 - 1.0, указывающее, насколько прозрачены линии. Значение 0.0 означает полностью прозрачный, 1.0 - полностью непрозрачный.';
																				lang.near = 'Ближний слой';
																				lang.nearTitle = 'Смещение ближайшего к камере слоя точек в процентах.';
																				lang.far = 'Дальний слой';
																				lang.farTitle = 'Смещение дальнего от камеры слоя точек в процентах.';
																				lang.base = 'Масштаб';
																				lang.baseTitle = 'Масштаб неподвижных точек в процентах.';
																				lang.square = 'Квадратное основание';
																				lang.squareTitle = 'Неподвиждые точки образуют пирамиду с квадратным основанием.';
																				lang.defaultButton = 'Восстановить';
																				lang.defaultTitle = 'Восстановить настройки неподвижных точек.';
																				lang.zCount = 'Z cлои';
																				lang.zCountTitle = 'Количество слоев усеченной пирамиды, образующей поле зрения камеры';
																				lang.yCount = 'Y точки';
																				lang.yCountTitle = "Количество вертикальных точек в каждом слое усеченной пирамиды, образующей поле зрения камеры.";
																				break;
																default:
																				if (options.lang === undefined || options.lang.languageCode != languageCode) break;
																				Object.keys(options.lang).forEach(function (key) {
																								if (lang[key] === undefined) return;
																								lang[key] = options.lang[key];
																				});
												}
												function saveSettings() {
																cookie.setObject(cookieName, shaderMaterial);
												}
												var fFrustumPoints = folder.addFolder(lang.frustumPoints);
												dat.folderNameAndTitle(fFrustumPoints, lang.frustumPoints, lang.frustumPointsTitle);
												function displayControllers(value) {
																var display = value ? 'block' : 'none';
																folderPoint.display(display);
																cZCount.__li.style.display = display;
																cYCount.__li.style.display = display;
												}
												var cDisplay = fFrustumPoints.add(shaderMaterial, 'display').onChange(function (value) {
																if (shaderMaterial.display) {
																				update();
																} else {
																				if (options.raycaster) options.raycaster.removeParticle(_points);
																				removePoints();
																}
																displayControllers(shaderMaterial.display);
																saveSettings();
												});
												dat.controllerNameAndTitle(cDisplay, lang.display, lang.displayTitle);
												var cInfo = !options.raycaster ? undefined : fFrustumPoints.add(shaderMaterial, 'info').onChange(function (value) {
																if (_points === undefined) {
																				saveSettings();
																				return;
																}
																if (shaderMaterial.info) {
																				if (options.raycaster) options.raycaster.addParticle(_points);
																} else {
																				if (options.guiSelectPoint) options.guiSelectPoint.selectPoint(-1);
																				if (options.raycaster) options.raycaster.removeParticle(_points);
																}
																saveSettings();
												});
												if (cInfo) dat.controllerNameAndTitle(cInfo, lang.info, lang.infoTitle);
												var cNear = fFrustumPoints.add(shaderMaterial, 'near', 0, 100, 1).onChange(function (value) {
																update();
												});
												dat.controllerNameAndTitle(cNear, lang.near, lang.nearTitle);
												var cFar = fFrustumPoints.add(shaderMaterial, 'far', 0, 100, 1).onChange(function (value) {
																update();
												});
												dat.controllerNameAndTitle(cFar, lang.far, lang.farTitle);
												var cBase = fFrustumPoints.add(shaderMaterial, 'base', 0, 100, 1).onChange(function (value) {
																update();
												});
												dat.controllerNameAndTitle(cBase, lang.base, lang.baseTitle);
												var cSquare = fFrustumPoints.add(shaderMaterial, 'square').onChange(function (value) {
																update();
												});
												dat.controllerNameAndTitle(cSquare, lang.square, lang.squareTitle);
												var folderPoint = new FolderPoint(shaderMaterial.point, function (value) {
																if (value === undefined) {
																				console.warn('under constraction');
																}
																if (value < 0) value = 0;
																_points.material.uniforms.pointSize.value = value;
																folderPoint.size.setValue(value);
																shaderMaterial.point.size = value;
																saveSettings();
												}, new Options({ dat: { gui: options.dat.gui } }), {
																folder: fFrustumPoints,
																defaultPoint: { size: 0.01 },
																PCOptions: {
																				settings: { offset: 0.1 },
																				max: 0.1
																}
												});
												var toUpdate = true,
												canUpdate = true,
												    _this = this;
												function update() {
																if (!toUpdate || !canUpdate) return;
																canUpdate = false;
																var index = options.guiSelectPoint ? options.guiSelectPoint.getMeshIndex(_points) : undefined;
																if (options.raycaster) options.raycaster.removeParticle(_points);
																removePoints(true);
																_this.update(function () {
																				if (options.guiSelectPoint) options.guiSelectPoint.setIndexMesh(index, _points);
																				saveSettings();
																				canUpdate = true;
																				_points.userData.controllers();
																});
												}
												var cZCount = fFrustumPoints.add(shaderMaterial, 'zCount').min(3).step(1).onChange(function (value) {
																update();
												});
												dat.controllerNameAndTitle(cZCount, lang.zCount, lang.zCountTitle);
												var cYCount = fFrustumPoints.add(shaderMaterial, 'yCount').min(3).step(1).onChange(function (value) {
																update();
												});
												dat.controllerNameAndTitle(cYCount, lang.yCount, lang.yCountTitle);
												dat.controllerNameAndTitle(fFrustumPoints.add({
																defaultF: function defaultF(value) {
																				toUpdate = false;
																				cDisplay.setValue(optionsShaderMaterial.display);
																				if (cInfo) cInfo.setValue(optionsShaderMaterial.info);
																				cNear.setValue(optionsShaderMaterial.near);
																				cFar.setValue(optionsShaderMaterial.far);
																				cBase.setValue(optionsShaderMaterial.base);
																				cSquare.setValue(optionsShaderMaterial.square);
																				folderPoint.size.setValue(optionsShaderMaterial.point.size);
																				cZCount.setValue(optionsShaderMaterial.zCount);
																				cYCount.setValue(optionsShaderMaterial.yCount);
																				toUpdate = true;
																				update();
																				saveSettings();
																}
												}, 'defaultF'), lang.defaultButton, lang.defaultTitle);
												displayControllers(shaderMaterial.display);
								};
								return this;
				};
				this.guiSelectPoint = function () {
								var cFrustumPointsX = null,
								    cFrustumPointsY = null,
								    cFrustumPointsZ = null;
								_guiSelectPoint = this;
								this.create = function (fPoints, languageCode) {
												var dat = three$1.dat;
												function frustumPointsControl(name) {
																var lang = {
																				notSelected: 'Not selected'
																};
																switch (languageCode) {
																				case 'ru':
																								lang.notSelected = 'Не выбран';
																								break;
																}
																var controller = fPoints.add({ Points: lang.notSelected }, 'Points', defineProperty({}, lang.notSelected, -1)).onChange(function (value) {
																				var index = _guiSelectPoint.getSelectedIndex();
																				if (index === null) {
																								if (options.axesHelper) options.axesHelper.exposePosition();
																								return;
																				}
																				options.guiSelectPoint.select({ object: _points, index: index });
																});
																controller.__select[0].selected = true;
																dat.controllerNameAndTitle(controller, name);
																return controller;
												}
												cFrustumPointsX = frustumPointsControl('x');
												cFrustumPointsY = frustumPointsControl('y');
												cFrustumPointsZ = frustumPointsControl('z');
								};
								this.appendChild = function (count) {
												function appendChild(cFrustumPoint, count) {
																cFrustumPoint.domElement.querySelectorAll('select option').forEach(function (option) {
																				if (option.value != '-1') option.remove();
																});
																for (var i = 0; i < count; i++) {
																				var opt = document.createElement('option');
																				opt.innerHTML = i;
																				cFrustumPoint.__select.appendChild(opt);
																}
																cFrustumPoint.setValue(-1);
												}
												appendChild(cFrustumPointsX, count.xCount);
												appendChild(cFrustumPointsY, count.yCount);
												appendChild(cFrustumPointsZ, count.zCount);
								};
								this.pointIndexes = function (index) {
												if (index === undefined) return;
												if (parseInt(cFrustumPointsX.getValue()) !== index.x) cFrustumPointsX.setValue(index.x);
												if (parseInt(cFrustumPointsY.getValue()) !== index.y) cFrustumPointsY.setValue(index.y);
												if (parseInt(cFrustumPointsZ.getValue()) !== index.z) cFrustumPointsZ.setValue(index.z);
								};
								this.getSelectedIndex = function () {
												if (_names === undefined) {
																console.warn('Сюда попадает во время отладки когда не задаю имени каждой точки или когда the cDisplay checkbox of the frustumPoints is not checked');
																return null;
												}
												var x = parseInt(cFrustumPointsX.getValue()),
												    y = parseInt(cFrustumPointsY.getValue()),
												    z = parseInt(cFrustumPointsZ.getValue());
												if (isNaN(x) || x === -1 || isNaN(y) || y === -1 || isNaN(z) || z === -1) return null;
												for (var i = 0; i < _names.length; i++) {
																var name = _names[i];
																if ((typeof name === 'undefined' ? 'undefined' : _typeof(name)) !== "object" || name.z === undefined || name.z !== z) continue;
																for (; i < _names.length; i++) {
																				name = _names[i];
																				if ((typeof name === 'undefined' ? 'undefined' : _typeof(name)) !== "object" || name.y !== y) continue;
																				for (; i < _names.length; i++) {
																								name = _names[i];
																								if ((typeof name === 'undefined' ? 'undefined' : _typeof(name)) === "object") {
																												if (x === 0 && name.y === y) {
																																return i;
																												}
																								}
																								if (name === x) {
																												return i;
																								}
																				}
																}
												}
												console.error('FrustumPoints.selectPoint: not selected');
												return null;
								};
								this.display = function (display) {
												cFrustumPointsX.domElement.parentElement.parentElement.style.display = display;
												cFrustumPointsY.domElement.parentElement.parentElement.style.display = display;
												cFrustumPointsZ.domElement.parentElement.parentElement.style.display = display;
								};
								this.isDisplay = function () {
												if (cFrustumPointsX.domElement.parentElement.parentElement.style.display !== cFrustumPointsY.domElement.parentElement.parentElement.style.display || cFrustumPointsX.domElement.parentElement.parentElement.style.display !== cFrustumPointsZ.domElement.parentElement.parentElement.style.display) console.error('cFrustumPointsF.isDisplay failed!');
												return cFrustumPointsX.domElement.parentElement.parentElement.style.display !== 'none';
								};
				};
				this.gui = function () {
								console.warn('FrustumPoints.gui(): First, call FrustumPoints.pushArrayCloud(...) for push a points to the clouds array and call FrustumPoints.create(...).');
				};
				this.animate = function () {};
				this.updateGuiSelectPoint = function () {};
				this.isDisplay = function () {};
				this.onChangeControls = function () {};
				this.updateCloudPoints = function () {};
				this.updateCloudPoint = function () {};
				this.updateCloudPointItem = function () {};
};

/**
 * @module pointLight
 * @description A light that gets emitted from a single point in all directions.
 * @see [PointLight]{@link https://threejs.org/docs/index.html?q=pointLight#api/en/lights/PointLight}
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
var pointLight =
function pointLight(scene) {
			var settings = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
			classCallCheck(this, pointLight);
			var options = new Options(settings.options);
			if (options.pointLight === false) {
						this.add = function () {};
						this.controls = function () {};
						return;
			}
			var dat = three$1.dat,
			    THREE = three$1.THREE,
			    strLight = 'mathBoxLight',
			    controllers = {},
			    multiplier = 2 * options.scale,
			position = settings.position || new THREE.Vector3();
			var light = new THREE.PointLight(0xffffff, 1);
			light.position.copy(position);
			light.name = strLight;
			scene.add(light);
			this.controls = function () {
						var guiParams = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
						var group = guiParams.group || scene,
						    folder = guiParams.folder || options.dat.gui,
						    folderName = guiParams.folderName;
						if (folder === undefined || options.dat.pointLightGui === false) return;
						var lang = {
									light: 'Light',
									displayLight: 'Display',
									displayLightTitle: 'Display or hide the light source.',
									defaultButton: 'Default',
									restoreLightTitle: 'Restore position of the light source'
						};
						switch (options.getLanguageCode()) {
									case 'ru':
												lang.light = 'Свет';
												lang.displayLight = 'Показать';
												lang.displayLightTitle = 'Показать или скрыть источник света.';
												lang.defaultButton = 'Восстановить';
												lang.restoreLightTitle = 'Восстановить положение источника света';
												break;
									default:
												if (options.lang === undefined || options.lang.languageCode != _languageCode) break;
												Object.keys(options.lang).forEach(function (key) {
															if (lang[key] === undefined) return;
															lang[key] = options.lang[key];
												});
						}
						var scales = options.scales,
						    fLight = folder.addFolder(folderName || lang.light);
						var lightSource;
						dat.controllerNameAndTitle(fLight.add({ display: false }, 'display').onChange(function (value) {
									if (value) {
												new MyPoints(light.position, group, { pointsOptions: {
																		onReady: function onReady(points) {
																					lightSource = points;
																		}
															} });
									} else {
												group.remove(lightSource);
												lightSource = undefined;
									}
						}), lang.displayLight, lang.displayLightTitle);
						function guiLightAxis(axesName) {
									var scale = scales[axesName];
									if (!scale) return;
									controllers[axesName] = fLight.add(light.position, axesName, scale.min * multiplier, scale.max * multiplier).onChange(function (value) {
												if (lightSource === undefined) return;
												var i = 0,
												    itemSize = lightSource.geometry.attributes.position.itemSize,
												    point = new THREE.Vector3().fromArray(lightSource.geometry.attributes.position.array, i * itemSize);
												point[axesName] = value;
												point.toArray(lightSource.geometry.attributes.position.array, i * itemSize);
												lightSource.geometry.attributes.position.needsUpdate = true;
									});
									dat.controllerNameAndTitle(controllers[axesName], scale.name);
						}
						guiLightAxis('x');
						guiLightAxis('y');
						guiLightAxis('z');
						var restore = {
									restore: function restore() {
												controllers.x.setValue(position.x);
												controllers.y.setValue(position.y);
												controllers.z.setValue(position.z);
									}
						};
						dat.controllerNameAndTitle(fLight.add(restore, 'restore'), lang.defaultButton, lang.restoreLightTitle);
			};
			return this;
};

/**
 * @module ProgressBar
 * @description Creates a [progress bar element]{@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/range} on your web page.
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
var ProgressBar = function () {
	createClass(ProgressBar, [{
		key: 'value',
		set: function set$$1(value) {
			this.setValue(value);
		}
	}]);
	function ProgressBar(elParent, step) {
		var _this = this;
		var settings = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
		classCallCheck(this, ProgressBar);
		var cProgress = void 0,
		    elProgress = void 0,
		    elTitle = void 0;
		if (elParent) {
			elTitle = document.createElement('div');
			elProgress = document.createElement('div');
			cProgress = document.createElement('input'), elProgress.style.backgroundColor = 'white';
			elProgress.style.margin = '2px';
			elProgress.style.padding = '2px';
			elTitle.innerHTML = settings.sTitle || '';
			elTitle.style.color = 'black';
			elProgress.appendChild(elTitle);
			if (settings.min === undefined) settings.min = 0;
			cProgress.min = settings.min;
			cProgress.max = settings.max != undefined ? settings.max : settings.iterationCount != undefined ? settings.iterationCount : 1;
			cProgress.type = "range";
			cProgress.disabled = true;
			elProgress.appendChild(cProgress);
			var elcontainer = void 0;
			var containerName = 'ProgressContainer';
			for (var _i = 0; _i < elParent.children.length; _i++) {
				var child = elParent.children[_i];
				if (child.name && child.name === containerName) {
					elcontainer = child;
					break;
				}
			}
			if (!elcontainer) {
				elcontainer = document.createElement('table');
				elcontainer.name = containerName;
				elcontainer.style.position = 'absolute';
				elcontainer.style.top = 0;
				elcontainer.style.left = 0;
				elParent.appendChild(elcontainer);
			}
			var elRow = document.createElement('tr');
			elRow.appendChild(elProgress);
			elcontainer.appendChild(elRow);
		}
		this.setValue = function (value) {
			if (cProgress) cProgress.value = value;
		};
		if (settings.timeoutPeriod === undefined) settings.timeoutPeriod = 0;
		var timeoutPeriod = settings.timeoutPeriod;
		var i = settings.iterationCount != undefined ? settings.min : undefined;
		this.step = function (params) {
			var iteration = function iteration() {
				step(_this, i, params);
				if (i === undefined) return;
				_this.value = i;
				i++;
				if (i < settings.iterationCount) _this.step();else _this.remove();
			};
			if (timeoutPeriod < settings.timeoutPeriod) {
				timeoutPeriod++;
				iteration();
			} else {
				timeoutPeriod = 0;
				window.setTimeout(function () {
					iteration();
				}, 0);
			}
		};
		this.remove = function () {
			if (elProgress) elProgress.parentElement.remove();
		};
		this.step();
		this.newStep = function (stepFunction) {
			step = stepFunction;
		};
		this.title = function (newTitle) {
			elTitle.innerHTML = newTitle;
		};
	}
	return ProgressBar;
}();

/**
 * @module Intersections
 * @description Creates an intersection lines for graphic objects.
 * @author [Andrej Hristoliubov]{@link https://github.com/anhr}
 *
 * @copyright 2011 Data Arts Team, Google Creative Lab
 *
 * @license under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * @see [How to detect collision in three.js?]{@link https://newbedev.com/how-to-detect-collision-in-three-js}
 * @see [Collision detection example]{@link http://stemkoski.github.io/Three.js/Collision-Detection.html}
 * @see [Three JS - Find all points where a mesh intersects a plane]{@link https://stackoverflow.com/questions/42348495/three-js-find-all-points-where-a-mesh-intersects-a-plane}
*/
var Intersections =
function Intersections(object, intersectMeshList) {
	var settings = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
	classCallCheck(this, Intersections);
	var THREE = three$1.THREE,
	    options = three$1.options || {},
	    scene = settings.scene || three$1.group;
	if (object instanceof THREE.Mesh === false) object = object.mesh;
	var positions = object.geometry.attributes.position;
	if (!Array.isArray(intersectMeshList)) intersectMeshList = [intersectMeshList];
	var collidableMeshList = [],
	    arrayIntersectLinesColor = [];
	intersectMeshList.forEach(function (item) {
		if (item instanceof THREE.Mesh) {
			collidableMeshList.push(item);
			arrayIntersectLinesColor.push(0xffffff);
		} else {
			collidableMeshList.push(item.mesh);
			arrayIntersectLinesColor.push(item.color || 0xffffff);
		}
	});
	if (!object.geometry.index) {
		var array = [];
		for (var i = 0; i < positions.count; i++) {
			array.push(i);
		}object.geometry.index = new THREE.Uint16BufferAttribute(array, 1);
	}
	for (var _i = 1; _i < object.geometry.index.count; _i++) {
		var point1 = new THREE.Vector3().fromBufferAttribute(positions, object.geometry.index.array[_i]);
		for (var j = _i - 1; j >= 0; j--) {
			var Delta = function Delta(a, b) {
				var d = Math.abs(a - b);
				if (d === 0) return 0;
				if (d > 0 && d <= 4e-15) return 1;
				return 4;
			};
			var point2 = new THREE.Vector3().fromBufferAttribute(positions, object.geometry.index.array[j]);
			var res = Delta(point2.x, point1.x) + Delta(point2.y, point1.y) + Delta(point2.z, point1.z);
			if (res < 4) {
				object.geometry.index.array[_i] = object.geometry.index.array[j];
				break;
			}
		}
	}
	function arrayIntersectionsPush(intersection, array) {
		var point1 = intersection.point;
		for (var i = 0; i < array.length; i++) {
			var isSameAxis = function isSameAxis(axis1, axis2) {
				return axis1 === axis2;
			};
			var _point = array[i].point;
			if (isSameAxis(point1.x, _point.x) && isSameAxis(point1.y, _point.y) && isSameAxis(point1.z, _point.z)) return;
		}
		array.push(intersection);
	}
	var intersectionLines = [],
	arrayIntersectFaces = [];
	var edges = [];
	for (var index = 0; index < object.geometry.index.count; index += 3) {
		var Edge = function Edge(index, index2) {
			classCallCheck(this, Edge);
			function Vertex(index) {
				if (typeof SpriteText !== "undefined") var spriteText;
				return {
					get index() {
						if (index >= object.geometry.index.array.length) index = 0;
						var i = object.geometry.index.array[index];
						if (i === undefined) console.error('Intersections.createIntersections.Edge.Vertex: i = ' + i);
						return i;
					},
					get pointLocal() {
						var vertex = positions.itemSize === 3 ? new THREE.Vector3() : positions.itemSize === 4 ? new THREE.Vector3() : undefined;
						return vertex.fromBufferAttribute(positions, this.index);
					},
					get point() {
						var point = this.pointLocal.applyMatrix4(object.matrix);
						if (typeof SpriteText !== "undefined" && !spriteText) {
							spriteText = new SpriteText(this.index, this.pointLocal);
							object.add(spriteText);
						}
						return point;
					}
				};
			}
			var vertex1, vertex2, collisionResultsOriginPoint, intersectionObject;
			var arraySpliceIntersection = [],
			    array = [];
			this.spliceIntersection = function (index, uuid) {
				arraySpliceIntersection.push({ index: index, uuid: uuid });
				array.length = 0;
			};
			Object.defineProperties(this, {
				intersection: {
					get: function get$$1() {
						if (!collisionResultsOriginPoint) {
							var direction = this.vertex2.point.clone().sub(this.vertex1.point).clone().normalize(),
							    rayOriginPoint = new THREE.Raycaster(this.vertex1.point, direction, 0, this.vertex2.point.distanceTo(this.vertex1.point));
							if (typeof SpriteText !== "undefined") rayOriginPoint.camera = options.camera;
							collisionResultsOriginPoint = rayOriginPoint.intersectObjects(collidableMeshList);
							if (!this.faces) console.error('edge ' + this.vertex1.index + ' ' + this.vertex2.index + ' intersects ' + collisionResultsOriginPoint.length);
						}
						var res;
						if (this.intersectionObject) {
							if (array.length === 0) {
								var _intersectionObject = this.intersectionObject;
								collisionResultsOriginPoint.forEach(function (intersection, index) {
									if (intersection.object.uuid === _intersectionObject.uuid) {
										arrayIntersectionsPush(intersection, array);
									}
								});
								if (arraySpliceIntersection.length > 1) console.error('under construction');
								for (var i = 0; i < arraySpliceIntersection.length; i++) {
									if (arraySpliceIntersection[i].uuid === _intersectionObject.uuid) array.splice(arraySpliceIntersection[i].index, 1);
								}
							}
							res = array;
						} else res = collisionResultsOriginPoint;
						return res;
					},
					set: function set$$1(intersection) {
						this.vertex1.update = undefined;
						this.vertex2.update = undefined;
						collisionResultsOriginPoint = intersection;
					}
				},
				intersectionObject: {
					get: function get$$1() {
						return intersectionObject;
					},
					set: function set$$1(intersectionObjectNew) {
						intersectionObject = intersectionObjectNew;
						arraySpliceIntersection.length = 0;
						array.length = 0;
					}
				},
				vertex1: {
					get: function get$$1() {
						if (!vertex1) vertex1 = Vertex(index);
						return vertex1;
					}
				},
				vertex2: {
					get: function get$$1() {
						if (!vertex2) vertex2 = Vertex(index2);
						return vertex2;
					}
				}
			});
			this.isCollision = function () {
				return collisionResultsOriginPoint.length > 0;
			};
			this.isSame = function (edge) {
				var boSame = this.vertex1.index === edge.vertex1.index && this.vertex2.index === edge.vertex2.index || this.vertex1.index === edge.vertex2.index && this.vertex2.index === edge.vertex1.index;
				if (boSame === undefined) boSame = false;
				return boSame;
			};
		};
		var edge = new Edge(index, index + 1);
		edges.push(edge);
		edge = new Edge(index + 1, index + 2);
		edges.push(edge);
		edge = new Edge(index, index + 2);
		edges.push(edge);
	}
	var faces = [];
	var renderer = options.renderer || settings.renderer;
	var progressBar = void 0;
	if (renderer) {
		var elCanvas = renderer.domElement,
		    elContainer = elCanvas.parentElement;
		if (elContainer.tagName !== "DIV") {
			console.error('Intersections: elContainer.tagName = ' + elContainer.tagName);
			return;
		}
		var container = "container";
		if (!elContainer.classList.contains(container)) elContainer.classList.add(container);
		var lang = { progressTitle: 'Intersections preparing.<br>Wait please...' };
		switch (options.getLanguageCode()) {
			case 'ru':
				lang.progressTitle = 'Подготовка пересечений.<br>Пожалуйста подождите...';
				break;
		}
		progressBar = new ProgressBar(elContainer, step, {
			sTitle: lang.progressTitle,
			max: object.geometry.index.count
		});
	}
	index = 0;
	function step(timestamp) {
		if (progressBar) progressBar.value = index;
		if (index >= object.geometry.index.count) {
			progressBar.remove();
			boCreateIntersections = true;
			setTimeout(function () {
				createIntersections();
			}, 0);
			return;
		}
		var Face =
		function Face(index) {
			var _this2 = this;
			classCallCheck(this, Face);
			var vectorIndex = new THREE.Vector3(),
			    arrayIntersectLines = [];
			vectorIndex.fromBufferAttribute(object.geometry.index, index);
			Object.defineProperties(this, {
				faceEdges: { get: function get$$1() {
						return faceEdges;
					} },
				id: { get: function get$$1() {
						return vectorIndex;
					} },
				name: { get: function get$$1() {
						return 'Face ' + vectorIndex.x + ', ' + vectorIndex.y + ', ' + vectorIndex.z;
					} },
				vertices: {
					get: function get$$1() {
						return {
							vertex1: faceEdges.edge1.vertex1,
							vertex2: faceEdges.edge1.vertex2,
							get vertex3() {
								if (!faceEdges.edge3) {
									console.error('faceEdges.edge3 = ' + faceEdges.edge3);
									if (faceEdges.edge1.vertex1.index === faceEdges.edge2.vertex1.index) return faceEdges.edge2.vertex2;
									if (faceEdges.edge1.vertex1.index === faceEdges.edge2.vertex2.index) return faceEdges.edge2.vertex1;
									if (faceEdges.edge1.vertex2.index === faceEdges.edge2.vertex1.index) return faceEdges.edge2.vertex2;
									if (faceEdges.edge1.vertex2.index === faceEdges.edge2.vertex2.index) return faceEdges.edge2.vertex1;
									return;
								}
								return faceEdges.edge1.vertex1.index !== faceEdges.edge3.vertex1.index && faceEdges.edge1.vertex2.index !== faceEdges.edge3.vertex1.index ? faceEdges.edge3.vertex1 : faceEdges.edge3.vertex2;
							}
						};
					}
				}
			});
			function emtyIntersection() {
				return {
					intersection: [],
					isSame: function isSame() {
						return true;
					}
				};
			}
			var intersectionEdges = {};
			var faceEdges = {
				set edge1(edge1) {
					intersectionEdges.edge1 = edge1;
				},
				get edge1() {
					if (intersectionEdges.edge1) return intersectionEdges.edge1;
					return emtyIntersection();
				},
				set edge2(edge2) {
					intersectionEdges.edge2 = edge2;
				},
				get edge2() {
					if (intersectionEdges.edge2) return intersectionEdges.edge2;
					return emtyIntersection();
				},
				set edge3(edge3) {
					intersectionEdges.edge3 = edge3;
				},
				get edge3() {
					if (intersectionEdges.edge3) return intersectionEdges.edge3;
					return emtyIntersection();
				},
				get intersectionObjects() {
					var intersectionObjects = [];
					function getObects(intersections) {
						intersections.forEach(function (intersection) {
							var boAdded = false;
							for (var i = 0; i < intersectionObjects.length; i++) {
								if (intersection.object.uuid === intersectionObjects[i].uuid) {
									boAdded = true;
									break;
								}
							}
							if (!boAdded) intersectionObjects.push(intersection.object);
						});
					}
					getObects(faceEdges.edge1.intersection);
					getObects(faceEdges.edge2.intersection);
					getObects(faceEdges.edge3.intersection);
					return intersectionObjects;
				},
				set intersectionObject(intersectionObject) {
					faceEdges.edge1.intersectionObject = intersectionObject;
					faceEdges.edge2.intersectionObject = intersectionObject;
					faceEdges.edge3.intersectionObject = intersectionObject;
				},
				get intersectionObject() {
					return faceEdges.edge1.intersectionObject;
				}
			};
			var _loop = function _loop() {
				var edge = edges[i],
				    vertex1Index = edge.vertex1.index,
				vertex2Index = edge.vertex2.index;
				function setFace(face) {
					if (!edge.faces) edge.faces = {};
					if (!edge.faces.face1) edge.faces.face1 = face;else if (!edge.faces.face2) {
						edge.faces.face2 = face;
					} else console.error('Face: too many edge.faces');
				}
				if (vectorIndex.x === vertex1Index && vectorIndex.y === vertex2Index || vectorIndex.x === vertex2Index && vectorIndex.y === vertex1Index) {
					if (!faceEdges.edge1.isSame(edge)) console.error('Face: duplicate faceEdges.edge1');else {
						faceEdges.edge1 = edge;
						setFace(_this2);
					}
				} else if (vectorIndex.z === vertex1Index && vectorIndex.y === vertex2Index || vectorIndex.z === vertex2Index && vectorIndex.y === vertex1Index) {
					var boSame = faceEdges.edge2.isSame(edge);
					if (!boSame) console.error('Face: duplicate faceEdges.edge2');else {
						faceEdges.edge2 = edge;
						setFace(_this2);
					}
				} else if (vectorIndex.z === vertex1Index && vectorIndex.x === vertex2Index || vectorIndex.z === vertex2Index && vectorIndex.x === vertex1Index) {
					if (!faceEdges.edge3.isSame(edge)) console.error('Face: duplicate faceEdges.edge3');else {
						faceEdges.edge3 = edge;
						setFace(_this2);
					}
				}
			};
			for (var i = edges.length - 1; i >= 0; i--) {
				_loop();
			}
			this.isCollision = function () {
				return faceEdges.edge1.intersection.length || faceEdges.edge2.intersection.length || faceEdges.edge3.intersection.length;
			};
			this.nextIntersectPoint = function (point) {
				for (var i = 0; i < arrayIntersectLines.length; i++) {
					var returnPoint = function returnPoint(point) {
						arrayIntersectLines.splice(i, 1);
						return point;
					};
					var intersectLine = arrayIntersectLines[i],
					    uuid = point.uuid;
					if (point.edge.isSame(intersectLine.point1.edge) && point.intersectionIndex === intersectLine.point1.intersectionIndex && uuid === intersectLine.point1.uuid) return returnPoint(intersectLine.point2);else if (point.edge.isSame(intersectLine.point2.edge) && point.intersectionIndex === intersectLine.point2.intersectionIndex && uuid === intersectLine.point2.uuid) return returnPoint(intersectLine.point1);
				}
			};
			this.intersectLines = function () {
				return arrayIntersectLines;
			};
			this.intersections = function () {
				var _this = this;
				var intersectionObjects = faceEdges.intersectionObjects;
				var _loop2 = function _loop2() {
					faceEdges.intersectionObject = intersectionObjects[iIntersectionObject];
					if (!_this.isCollision()) return 'continue';
					for (i = faceEdges.edge1.intersection.length - 1; i >= 0; i--) {
						for (j = faceEdges.edge2.intersection.length - 1; j >= 0; j--) {
							if (faceEdges.edge1.intersection.length > i && faceEdges.edge2.intersection.length > j && equals(faceEdges.edge1.intersection[i].point, faceEdges.edge2.intersection[j].point)) faceEdges.edge2.spliceIntersection(j, faceEdges.intersectionObject.uuid);
							for (k = faceEdges.edge3.intersection.length - 1; k >= 0; k--) {
								if (faceEdges.edge1.intersection.length > i && faceEdges.edge3.intersection.length > k && equals(faceEdges.edge1.intersection[i].point, faceEdges.edge3.intersection[k].point)) faceEdges.edge3.spliceIntersection(k, faceEdges.intersectionObject.uuid);
								if (faceEdges.edge2.intersection.length > j && faceEdges.edge3.intersection.length > k && equals(faceEdges.edge2.intersection[j].point, faceEdges.edge3.intersection[k].point)) faceEdges.edge3.spliceIntersection(k, faceEdges.intersectionObject.uuid);
							}
						}
					}
					function isOdd(num) {
						return num % 2;
					}
					function isOddOrZero(num) {
						return isOdd(num);
					}
					function arrayIntersectionsPushEdge(vertexIndex, edge) {
						switch (vertexIndex) {
							case edge.vertex1.index:
								for (var i = 0; i < edge.intersection.length; i++) {
									arrayPushEdge(edge, i);
								}break;
							case edge.vertex2.index:
								for (var i = edge.intersection.length - 1; i >= 0; i--) {
									arrayPushEdge(edge, i);
								}break;
							default:
								console.error('Face.intersections: arrayIntersections push failed!');
						}
					}
					function arrayIntersectionsPushEdge3(vertexIndex) {
						arrayIntersectionsPushEdge(vertexIndex, faceEdges.edge3);
					}
					function arrayIntersectionsPushEdge2(vertexIndex) {
						arrayIntersectionsPushEdge(vertexIndex, faceEdges.edge2);
					}
					var arrayIntersections = [];
					function arrayPushEdge(edge, intersectionIndex) {
						var intersection = edge.intersection[intersectionIndex];
						arrayIntersections.push({
							get edge() {
								return edge;
							},
							get intersectionIndex() {
								return intersectionIndex;
							},
							get uuid() {
								return intersection.object.uuid;
							},
							get faces() {
								return edge.faces;
							},
							get point() {
								return intersection.point;
							},
							get intersection() {
								return intersection;
							}
						});
					}
					for (i = 0; i < faceEdges.edge1.intersection.length; i++) {
						arrayPushEdge(faceEdges.edge1, i);
					}switch (faceEdges.edge1.vertex2.index) {
						case faceEdges.edge2.vertex1.index:
							lastEdge = faceEdges.edge3;
							for (i = 0; i < faceEdges.edge2.intersection.length; i++) {
								arrayPushEdge(faceEdges.edge2, i);
							}arrayIntersectionsPushEdge3(faceEdges.edge2.vertex2.index);
							break;
						case faceEdges.edge2.vertex2.index:
							lastEdge = faceEdges.edge3;
							for (i = faceEdges.edge2.intersection.length - 1; i >= 0; i--) {
								arrayPushEdge(faceEdges.edge2, i);
							}arrayIntersectionsPushEdge3(faceEdges.edge2.vertex1.index);
							break;
						case faceEdges.edge3.vertex1.index:
							lastEdge = faceEdges.edge2;
							for (i = 0; i < faceEdges.edge3.intersection.length; i++) {
								arrayPushEdge(faceEdges.edge3, i);
							}arrayIntersectionsPushEdge2(faceEdges.edge3.vertex2.index);
							break;
						case faceEdges.edge3.vertex2.index:
							lastEdge = faceEdges.edge2;
							for (i = faceEdges.edge3.intersection.length - 1; i >= 0; i--) {
								arrayPushEdge(faceEdges.edge3, i);
							}arrayIntersectionsPushEdge2(faceEdges.edge3.vertex1.index);
							break;
						default:
							console.error('Face.intersections: arrayIntersections push failed!');
					}
					var intersectionCount = arrayIntersections.length;
					if (isOdd(intersectionCount)) {
						return 'continue';
					}
					function addIntersectLine(point1, point2) {
						arrayIntersectLines.push({ point1: point1, point2: point2 });
					}
					var arrayMesh = void 0;
					for (i = 0; i < arrayIntersectFaces.length; i++) {
						if (arrayIntersectFaces[i].mesh.uuid === faceEdges.intersectionObject.uuid) {
							arrayMesh = arrayIntersectFaces[i];
							break;
						}
					}
					if (!arrayMesh) {
						arrayMesh = [];
						arrayMesh.mesh = faceEdges.intersectionObject;
						arrayIntersectFaces.push(arrayMesh);
					}
					arrayMesh.push(_this);
					if (intersectionCount === 2) addIntersectLine(arrayIntersections[0], arrayIntersections[1]);else if (!isOddOrZero(faceEdges.edge1.intersection.length) || !isOddOrZero(lastEdge.intersection.length)) {
						boDetected = false;
						if (intersectionCount === 6) {
							var equalFaces = function equalFaces(face1, face2) {
								return face1.a === face2.a && face1.b === face2.b && face1.c === face2.c;
							};
							if (equalFaces(arrayIntersections[0].intersection.face, arrayIntersections[5].intersection.face) && equalFaces(arrayIntersections[1].intersection.face, arrayIntersections[2].intersection.face) && equalFaces(arrayIntersections[3].intersection.face, arrayIntersections[4].intersection.face)) {
								addIntersectLine(arrayIntersections[0], arrayIntersections[5]);
								addIntersectLine(arrayIntersections[1], arrayIntersections[2]);
								addIntersectLine(arrayIntersections[3], arrayIntersections[4]);
								boDetected = true;
							} else if (equalFaces(arrayIntersections[0].intersection.face, arrayIntersections[1].intersection.face) && equalFaces(arrayIntersections[2].intersection.face, arrayIntersections[3].intersection.face) && equalFaces(arrayIntersections[4].intersection.face, arrayIntersections[5].intersection.face)) {
								console.error('under constraction');
								addIntersectLine(arrayIntersections[0], arrayIntersections[1]);
								addIntersectLine(arrayIntersections[2], arrayIntersections[3]);
								addIntersectLine(arrayIntersections[4], arrayIntersections[5]);
								boDetected = true;
							}
						}
						if (!boDetected) {
							for (i = 0; i < intersectionCount / 2; i++) {
								addIntersectLine(arrayIntersections[i], arrayIntersections[intersectionCount - 1 - i]);
							}
						}
					} else {
						for (i = 0; i < intersectionCount; i += 2) {
							addIntersectLine(arrayIntersections[i], arrayIntersections[i + 1]);
						}
					}
				};
				for (var iIntersectionObject = 0; iIntersectionObject < intersectionObjects.length; iIntersectionObject++) {
					var i;
					var j;
					var k;
					var lastEdge;
					var i;
					var i;
					var i;
					var i;
					var i;
					var i;
					var boDetected;
					var i;
					var i;
					var _ret2 = _loop2();
					if (_ret2 === 'continue') continue;
				}
				faceEdges.intersectionObject = undefined;
			};
		};
		faces.push(new Face(index, faces.length));
		index += 3;
		progressBar.step();
	}
	function equals(point1, point2) {
		return point1.distanceTo(point2) <= 9.0e-10;
	}
	var boCreateIntersections = false;
	function createIntersections() {
		if (!boCreateIntersections) return;
		arrayIntersectFaces.length = 0;
		for (var i = intersectionLines.length - 1; i >= 0; i--) {
			var removeObject3D = function removeObject3D(object3D) {
				if (!(object3D instanceof THREE.Object3D)) return false;
				object3D.geometry.dispose();
				if (object3D.material instanceof Array) {
					object3D.material.forEach(function (material) {
						return material.dispose();
					});
				} else {
					object3D.material.dispose();
				}
				object3D.removeFromParent();
				return true;
			};
			var arrayIntersectLine = intersectionLines[i];
			if (arrayIntersectLine.intersectLine) {
				removeObject3D(arrayIntersectLine.intersectLine);
				if (options.guiSelectPoint) options.guiSelectPoint.removeMesh(arrayIntersectLine.intersectLine);
				arrayIntersectLine.intersectLine = null;
			}
			if (arrayIntersectLine.intersectPoints) {
				removeObject3D(arrayIntersectLine.intersectPoints);
				if (options.guiSelectPoint) options.guiSelectPoint.removeMesh(arrayIntersectLine.intersectPoints);
				arrayIntersectLine.intersectPoints = null;
			}
			intersectionLines.pop();
		}
		edges.forEach(function (edge) {
			edge.intersection = undefined;
			edge.intersection;
		});
		faces.forEach(function (face) {
			face.intersections();
		});
		arrayIntersectFaces.forEach(function (meshLines) {
			meshLines.forEach(function (face) {
				var arrayIntersectLines = face.intersectLines();
				for (var i = arrayIntersectLines.length - 1; i >= 0; i--) {
					var line = arrayIntersectLines[i];
					if (!line) continue;
					if (meshLines.mesh.uuid !== line.point1.uuid) continue;
					arrayIntersectLines.splice(i, 1);
					var points = [line.point1.point];
					var point = line.point2,
					    faceNext = face,
					    boPush = true;
					while (true) {
						if (boPush) {
							if (!equals(points[points.length - 1], point.point))
								points.push(point.point);
						} else {
							if (!equals(points[0], point.point))
								points.unshift(point.point);
						}
						var _faces = point.faces;
						if (faceNext.id.equals(_faces.face1.id)) faceNext = _faces.face2;else if (faceNext.id.equals(_faces.face2.id)) faceNext = _faces.face1;else console.error('Intersections.createIntersections: get twin face failed');
						if (!faceNext) break;
						var pointEnd = point;
						point = faceNext.nextIntersectPoint(point);
						if (!point) {
							var vertexId = equals(pointEnd.point, pointEnd.edge.vertex1.point) ? pointEnd.edge.vertex1.index : equals(pointEnd.point, pointEnd.edge.vertex2.point) ? pointEnd.edge.vertex2.index : undefined;
							faceNext = undefined;
							if (vertexId) {
								for (var iIntersectFaces = 0; iIntersectFaces < arrayIntersectFaces.length; iIntersectFaces++) {
									if (pointEnd.uuid !== arrayIntersectFaces[iIntersectFaces].mesh.uuid) continue;
									for (var jIntersectFaces = 0; jIntersectFaces < arrayIntersectFaces[iIntersectFaces].length; jIntersectFaces++) {
										var _face = arrayIntersectFaces[iIntersectFaces][jIntersectFaces];
										if (_face.faceEdges.edge1.vertex1.index === vertexId || _face.faceEdges.edge1.vertex2.index === vertexId || _face.faceEdges.edge2.vertex1.index === vertexId || _face.faceEdges.edge2.vertex2.index === vertexId || _face.faceEdges.edge3.vertex1.index === vertexId || _face.faceEdges.edge3.vertex2.index === vertexId) {
											var intersectLines = _face.intersectLines();
											for (var k = 0; k < intersectLines.length; k++) {
												var line2 = intersectLines[k];
												if (equals(pointEnd.point, line2.point1.point)) point = line2.point1;else if (equals(pointEnd.point, line2.point2.point)) point = line2.point2;
												if (point) {
													faceNext = _face;
													point = faceNext.nextIntersectPoint(point);
													break;
												}
											}
											if (faceNext) break;
										}
									}
									if (faceNext) break;
								}
							}
							if (!faceNext) {
								pointEnd = line.point1;
								var face1IntersectLines = pointEnd.faces.face1.intersectLines(),
								    _face2 = face1IntersectLines.length ? pointEnd.faces.face1 : pointEnd.faces.face2,
								    _intersectLines = _face2.intersectLines();
								for (var iIntersectLines = 0; iIntersectLines < _intersectLines.length; iIntersectLines++) {
									var intersectLine = _intersectLines[iIntersectLines];
									if (intersectLine.point1.uuid === pointEnd.uuid && intersectLine.point1.edge.isSame(pointEnd.edge) && intersectLine.point1.intersectionIndex === pointEnd.intersectionIndex) point = intersectLine.point1;else if (intersectLine.point2.uuid === pointEnd.uuid && intersectLine.point2.edge.isSame(pointEnd.edge) && intersectLine.point2.intersectionIndex === pointEnd.intersectionIndex) point = intersectLine.point2;
									if (point) {
										faceNext = _face2;
										point = faceNext.nextIntersectPoint(point);
										boPush = false;
										break;
									}
								}
								if (!faceNext) break;
							}
						}
					}
					if (points.length > 1) {
						var color = 0xffffff;
						for (var i = 0; i < collidableMeshList.length; i++) {
							if (collidableMeshList[i].uuid === meshLines.mesh.uuid) {
								color = arrayIntersectLinesColor[i];
								break;
							}
						}
						var _arrayIntersectLine = {
							intersectLine: new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), new THREE.LineBasicMaterial({ color: color })),
							mesh: meshLines.mesh,
							color: color,
							points: points
						};
						intersectionLines.push(_arrayIntersectLine);
						scene.add(_arrayIntersectLine.intersectLine);
						if (options.guiSelectPoint) {
							_arrayIntersectLine.intersectLine.name = (_arrayIntersectLine.mesh.name === '' ? intersectionLines.length : _arrayIntersectLine.mesh.name) + '-' + (object.name === '' ? 'intersection' : object.name);
							options.guiSelectPoint.addMesh(_arrayIntersectLine.intersectLine);
						}
					}
				}
			});
		});
		if (settings.onReady) settings.onReady(intersectionLines);
	}
	var arrayMovingObjects = [object];
	collidableMeshList.forEach(function (object) {
		arrayMovingObjects.push(object);
	});
	arrayMovingObjects.forEach(function (object) {
		object.userData.position = object.position.clone();
		object.userData.rotation = object.rotation.clone();
		object.userData.scale = object.scale.clone();
	});
	function movingObjects() {
		for (var i = 0; i < arrayMovingObjects.length; i++) {
			var _object = arrayMovingObjects[i];
			if (!_object.userData.position.equals(_object.position) || !_object.userData.rotation.equals(_object.rotation) || !_object.userData.scale.equals(_object.scale)) {
				_object.userData.position = _object.position.clone();
				_object.userData.rotation = _object.rotation.clone();
				_object.userData.scale = _object.scale.clone();
				createIntersections();
				break;
			}
		}
		window.requestAnimationFrame(movingObjects);
	}
	window.requestAnimationFrame(movingObjects);
};

/**
 * @module TreeView
 * @description Tree view with CSS and JavaScript. Thanks to [Learn how to create a tree view with CSS and JavaScript.]{@link https://www.w3schools.com/howto/howto_js_treeview.asp}
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
var TreeView =
function TreeView() {
	var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	classCallCheck(this, TreeView);
	var toggler = document.getElementsByClassName("caret"),
	    cookieName = 'TreeView_';
	var i,
	    id = 1;
	for (i = 0; i < toggler.length; i++) {
		var elNested = toggler[i].parentElement.querySelector(".nested"),
		    boHide = elNested.classList.contains('hide');
		if (settings.animate !== undefined) {
			elNested.style.display = boHide ? 'none' : 'block';
			elNested.classList.add('b-toggle');
		}
		if (settings.paddingInlineStart !== undefined) elNested.style.paddingInlineStart = settings.paddingInlineStart;
		var boBranchOpen = settings.open ? settings.open : false;
		if (settings.cookie) {
			if (elNested.id === '') {
				var branchId = 'branch_' + id;
				id++;
				if (document.getElementById(branchId)) console.error('duplicate branch id: ' + branchId);else elNested.id = branchId;
			}
			switch (cookie.get(cookieName + elNested.id)) {
				case 'false':
					boBranchOpen = false;break;
				case 'true':
					boBranchOpen = true;break;
				case '':
					break;
				default:
					console.error('TreeView: Invalid cookie value');
			}
		}
		if (boBranchOpen !== undefined && boBranchOpen === boHide) {
			elNested.classList.toggle("hide");
			elNested.classList.toggle("active");
			elNested.style.display = boHide ? 'block' : 'none';
		}
		if (!elNested.classList.contains('hide')) {
			var classList = elNested.parentElement.querySelector(".caret").classList;
			if (!classList.contains("caret-down")) classList.toggle("caret-down");
		}
		toggler[i].addEventListener("click", function () {
			var elNested = this.parentElement.querySelector(".nested");
			if (elNested.classList.contains('hide')) {
				elNested.style.display = 'block';
				elNested.boTimeout = false;
			} else {
				elNested.boTimeout = true;
				setTimeout(function () {
					if (elNested.boTimeout) elNested.style.display = 'none';
				}, 1000);
			}
			elNested.classList.toggle("hide");
			elNested.classList.toggle("active");
			elNested.style.maxHeight = this.parentElement.querySelector(".active") ? elNested.offsetHeight + 'px' : '';
			this.classList.toggle("caret-down");
			if (settings.cookie) cookie.set(cookieName + elNested.id, !elNested.classList.contains('hide'));
			if (elNested.myThree) elNested.myThree.setSize();
		});
	}
	this.setCanvas = function (branchId, myThree) {
		var settings = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
		settings.size = settings.size || {};
		if (settings.size.width === undefined) settings.size.width = 300;
		if (settings.size.height === undefined) settings.size.height = 150;
		myThree.setSize(settings.size);
		document.getElementById(branchId).myThree = myThree;
	};
};

/**
 * @module MyThree
 * @description I use MyThree in my projects for displaying of my 3D objects in the canvas.
 * @copyright 2011 Data Arts Team, Google Creative Lab
 *
 * @license under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 */
if (typeof dat !== 'undefined') three$1.dat = dat;
function arrayContainersF() {
			var array = [];
			this.push = function (elContainer) {
						array.push(elContainer);
			};
			this.display = function (elContainer, fullScreen) {
						array.forEach(function (itemElContainer) {
									itemElContainer.style.display = itemElContainer === elContainer || !fullScreen ? 'block' : 'none';
						});
			};
			Object.defineProperties(this, {
						length: {
									get: function get$$1() {
												return array.length;
									}
						}
			});
}
var arrayContainers = new arrayContainersF();
var arrayCreates = [];
var MyThree =
function MyThree(createXDobjects, options) {
			classCallCheck(this, MyThree);
			options = options || {};
			var THREE = three$1.THREE;
			var myThreejs = this;
			arrayCreates.push({
						createXDobjects: createXDobjects,
						options: options
			});
			if (arrayCreates.length > 1) return;
			var camera, group, scene, canvas;
			var elContainer = options.elContainer === undefined ? document.getElementById("containerDSE") : typeof options.elContainer === "string" ? document.getElementById(options.elContainer) : options.elContainer;
			if (elContainer === null) {
						if (typeof options.elContainer === "string") console.warn('The ' + options.elContainer + ' element was not detected.');
						elContainer = document.createElement('div');
						document.querySelector('body').appendChild(elContainer);
			}
			arrayContainers.push(elContainer);
			if (!elContainer.querySelector('canvas')) {
						elContainer.innerHTML = '';
						var elDiv = document.createElement('div');
						elDiv.className = 'container';
						elDiv.appendChild(document.createElement('canvas'));
						elContainer.appendChild(elDiv);
						elContainer = elDiv;
			}
			if (three$1.dat && options.dat !== false) {
						options.dat = options.dat || {};
						options.dat.parent = elContainer;
			}
			if (options.title) {
						var _elDiv = document.createElement('div');
						_elDiv.style.position = 'absolute';
						_elDiv.style.top = '0px';
						_elDiv.style.color = 'white';
						_elDiv.style.padding = '3px';
						_elDiv.innerHTML = options.title;
						elContainer.appendChild(_elDiv);
			}
			options = new Options(options);
			options.saveMeshDefault = function (mesh) {
						mesh.userData.default = mesh.userData.default || {};
						mesh.userData.default.scale = new THREE.Vector3();
						mesh.userData.default.scale.copy(mesh.scale);
						mesh.userData.default.position = new THREE.Vector3();
						mesh.userData.default.position.copy(mesh.position);
						mesh.userData.default.rotation = new THREE.Euler();
						mesh.userData.default.rotation.copy(mesh.rotation);
			};
			var defaultPoint = {},
			mouse = new THREE.Vector2();
			var renderer,
			fOptions,
			rendererSizeDefault, cameraPosition,
			pointSize, stats,
			requestId;
			canvas = elContainer.querySelector('canvas');
			if (!canvas) {
						canvas = document.createElement('canvas');
						elContainer.appendChild(canvas);
			}
			function isFullScreen() {
						if (options.canvasMenu) return options.canvasMenu.isFullScreen();
						if (options.canvas) return options.canvas.fullScreen !== false;
						return true;
			}
			var elImg = elContainer.querySelector('img');
			if (elImg) elContainer.removeChild(elImg);
			if (typeof WebGLDebugUtils !== 'undefined') canvas = WebGLDebugUtils.makeLostContextSimulatingCanvas(canvas);
			canvas.addEventListener("webglcontextlost", function (event) {
						event.preventDefault();
						if (requestId !== undefined) window.cancelAnimationFrame(requestId);else console.error('myThreejs.create.onloadScripts: requestId = ' + requestId);
						clearThree(scene);
						rendererSizeDefault.onFullScreenToggle(true);
						alert(lang$2.webglcontextlost);
			}, false);
			canvas.addEventListener("webglcontextrestored", function () {
						console.warn('webglcontextrestored');
						init();
						animate();
			}, false);
			init();
			animate();
			function init() {
						camera = new THREE.PerspectiveCamera(options.camera.fov || 70, options.camera.aspect || window.innerWidth / window.innerHeight, options.camera.near || 0.01, options.camera.far || 10);
						camera.position.copy(options.camera.position);
						camera.scale.copy(options.camera.scale);
						options.camera = camera;
						options.point.sizePointsMaterial = 100;
						if (options.cameraTarget) {
									options.cameraTarget.camera = camera;
									options.playerOptions.cameraTarget.init(options.cameraTarget, options);
						}
						scene = new THREE.Scene();
						scene.background = new THREE.Color(0x000000);
						scene.fog = new THREE.Fog(0x000000, 250, 1400);
						scene.userData.optionsSpriteText = {
									textHeight: 0.04
						};
						group = new THREE.Group();
						scene.add(group);
						var gl = new FrustumPoints(camera, group, canvas, {
									options: options
						}).gl;
						renderer = new THREE.WebGLRenderer({
									antialias: true,
									canvas: canvas,
									context: gl
						});
						renderer.setSize(window.innerWidth, window.innerHeight);
						options.renderer = renderer;
						options.cursor = renderer.domElement.style.cursor;
						if (options.stereoEffect !== false) {
									options.stereoEffect = options.stereoEffect || {};
									options.stereoEffect.rememberSize = true;
						}
						new StereoEffect(renderer, options);
						options.eventListeners = new Options.raycaster.EventListeners(camera, renderer, { options: options, scene: scene });
						function removeTraceLines() {
									group.children.forEach(function (mesh) {
												if (mesh.userData.player === undefined || mesh.userData.player.arrayFuncs === undefined || typeof mesh.userData.player.arrayFuncs === "function") return;
												mesh.userData.player.arrayFuncs.forEach(function (vector) {
															if (vector.line === undefined) return;
															vector.line.remove();
															vector.line = new Player$1.traceLine(options);
												});
									});
						}
						var pointLight1 = new pointLight(scene, {
									options: options,
									position: options.pointLight && options.pointLight.pointLight1 && options.pointLight.pointLight1.position ? options.pointLight.pointLight1.position : new THREE.Vector3(2 * options.scale, 2 * options.scale, 2 * options.scale)
						});
						var pointLight2 = new pointLight(scene, {
									options: options,
									position: options.pointLight && options.pointLight.pointLight2 && options.pointLight.pointLight2.position ? options.pointLight.pointLight2.position : new THREE.Vector3(-2 * options.scale, -2 * options.scale, -2 * options.scale)
						});
						if (options.dat.gui) {
									if (typeof WebGLDebugUtils !== "undefined") options.dat.gui.add({
												loseContext: function loseContext(value) {
															canvas.loseContext();
												}
									}, 'loseContext');
									if (options.dat.gui.__closeButton.click !== undefined)
												options.dat.gui.__closeButton.click();
						}
						new Player$1(group, {
									onSelectScene: function onSelectScene(index, t) {
												options.boPlayer = true;
												if (options.frustumPoints !== undefined) options.frustumPoints.updateCloudPoints();
												if (options.onSelectScene !== undefined) return options.onSelectScene(index, t);
									},
									options: options,
									cameraTarget: { camera: camera },
									onChangeScaleT: function onChangeScaleT(scale) {
												if (options.player !== undefined) options.player.onChangeScale(scale);
												removeTraceLines();
									}
						});
						if (options.player) new options.player.PlayController();
						if (options.dat.gui) {
									fOptions = options.dat.gui.addFolder(lang$2.settings);
									if (options.player) options.player.gui(fOptions);
						}
						if (fOptions) SpriteTextGui(scene, options, {
									folder: fOptions,
									options: {
												textHeight: 0.05,
												fov: camera.fov
									}
						});
						if (options.stereoEffect) {
									options.stereoEffect.gui({
												folder: fOptions,
												onChangeMode: function onChangeMode(mode) {
															switch (mode) {
																		case StereoEffect.spatialMultiplexsIndexs.Mono:
																					break;
																		case StereoEffect.spatialMultiplexsIndexs.SbS:
																		case StereoEffect.spatialMultiplexsIndexs.TaB:
																					break;
																		default:
																					console.error('myThreejs: Invalid spatialMultiplexIndex = ' + mode);
																					return;
															}
															if (options.frustumPoints !== undefined) options.frustumPoints.updateGuiSelectPoint();
												}
									});
						}
						function getRendererSize() {
									var style = {
												position: renderer.domElement.style.position,
												left: renderer.domElement.style.left,
												top: renderer.domElement.style.top,
												width: renderer.domElement.style.width,
												height: renderer.domElement.style.height
									},
									    sizeOriginal = new THREE.Vector2();
									renderer.getSize(sizeOriginal);
									return {
												onFullScreenToggle: function onFullScreenToggle(fs) {
															arrayContainers.display(elContainer.parentElement, !fs);
												}
									};
						}
						rendererSizeDefault = getRendererSize();
						renderer.setSize(options.canvas !== undefined && options.canvas.width !== undefined ? options.canvas.width : canvas.clientWidth, options.canvas !== undefined && options.canvas.height !== undefined ? options.canvas.height : canvas.clientHeight);
						new CanvasMenu(renderer, {
									fullScreen: {
												fullScreen: options.canvas.fullScreen,
												camera: camera,
												arrayContainersLength: function arrayContainersLength() {
															return arrayContainers.length;
												},
												onFullScreenToggle: function onFullScreenToggle(fullScreen) {
															rendererSizeDefault.onFullScreenToggle(fullScreen);
															function onFullScreenToggle(group, fullScreen) {
																		setTimeout(function () {
																					function recursion(children) {
																								children.forEach(function (mesh) {
																											recursion(mesh.children);
																											if (mesh instanceof THREE.Group) {
																														onFullScreenToggle(mesh, fullScreen);
																														return;
																											}
																											if (mesh.userData.player === undefined || mesh.userData.player.arrayFuncs === undefined || typeof mesh.userData.player.arrayFuncs === "function") return;
																											mesh.userData.player.arrayFuncs.forEach(function (vector) {
																														if (vector.controllers && vector.controllers.w && vector.controllers.w.position && vector.controllers.w.position.elSlider) vector.controllers.w.position.elSlider.style.display = fullScreen ? 'block' : 'none';
																														if (vector.line === undefined) return;
																														vector.line.remove();
																														vector.line = new Player$1.traceLine(options);
																											});
																								});
																					}
																					recursion(group.children);
																		}, 0);
															}
															onFullScreenToggle(scene, fullScreen);
												}
									},
									options: options
						});
						options.createOrbitControls(camera, renderer, scene);
						if (fOptions) {
									new GuiSelectPoint(options, {
												cameraTarget: {
															camera: camera,
															orbitControls: options.orbitControls
												},
												pointsControls: function pointsControls(fPoints, dislayEl, getMesh) {},
												pointControls: function pointControls(fPoint, dislayEl, getMesh) {}
									});
									if (options.guiSelectPoint) options.guiSelectPoint.add();
						}
						defaultPoint.size = options.point.size;
						var pointName = options.dat ? options.dat.getCookieName('Point') : 'Point';
						if (options.dat) options.dat.cookie.getObject(pointName, options.point, options.point);
						three$1.group = group;
						if (createXDobjects) createXDobjects(group, options);
						new AxesHelper(scene, options);
						if (options.frustumPoints) options.frustumPoints.create(renderer);
						if (!options.player) {
									Player$1.selectPlayScene(group, { options: options });
						}
						options.boPlayer = false;
						group.children.forEach(function (mesh) {
									options.saveMeshDefault(mesh);
						});
						if (options.dat.gui) {
									AxesHelperGui(options, fOptions);
									new MoveGroupGui(group, options, {
												folder: fOptions
									});
									if (options.orbitControls !== false) {
												new OrbitControlsGui(options, fOptions);
									}
									new CameraGui(camera, options, fOptions);
									pointLight1.controls({ group: group, folder: fOptions, folderName: lang$2.light + ' 1' });
									pointLight2.controls({ group: group, folder: fOptions, folderName: lang$2.light + ' 2' });
									var folderPoint = new FolderPoint(options.point, function (value) {
												if (value === undefined) value = options.point.size;
												if (value < 0) value = 0;
												group.children.forEach(function (mesh) {
															if (mesh.type !== 'Points' || mesh.userData.boFrustumPoints) return;
															if (mesh.material.uniforms === undefined) mesh.material.size = value / options.point.sizePointsMaterial;
															else mesh.material.uniforms.pointSize.value = value;
												});
												folderPoint.size.setValue(value);
												options.point.size = value;
												options.dat.cookie.setObject(pointName, options.point);
									}, options, {
												folder: fOptions,
												defaultPoint: defaultPoint
									});
									if (options.frustumPoints)
												options.frustumPoints.gui(fOptions);
									options.restoreSceneController(camera, scene);
						}
						if (options.stats !== undefined) {
									try {
												stats = new Stats();
												elContainer.appendChild(stats.dom);
									} catch (e) {
												console.error(e + ". Please import Stats from '../../../three.js/dev/examples/jsm/libs/stats.module.js';");
									}
						}
						window.addEventListener('resize', onResize, false);
			}
			function onResize() {
						var size;
						if (isFullScreen()) size = new THREE.Vector2(window.innerWidth, window.innerHeight);else {
									size = new THREE.Vector2();
									renderer.getSize(size);
						}
						camera.aspect = size.x / size.y;
						camera.updateProjectionMatrix();
						renderer.setSize(size.x, size.y);
						if (options.frustumPoints !== undefined) options.frustumPoints.update();
			}
			function animate() {
						if (stats !== undefined) stats.begin();
						requestId = requestAnimationFrame(animate);
						render();
						if (stats !== undefined) stats.end();
			}
			function render() {
						if (!options.stereoEffect || !options.stereoEffect.render) renderer.render(scene, camera);else options.stereoEffect.render(scene, camera);
						if (cameraPosition === undefined) cameraPosition = new THREE.Vector3();
						if (pointSize === undefined) pointSize = options.point.size;
						if (!cameraPosition.equals(camera.position) || pointSize != options.point.size || options.frustumPoints !== undefined && options.frustumPoints.animate()) {
									cameraPosition.copy(camera.position);
									pointSize = options.point.size;
									group.children.forEach(function (mesh) {
												if (mesh instanceof THREE.Points === false) return;
												if (mesh.geometry.attributes.size === undefined) {
															mesh.material.size = pointSize / options.point.sizePointsMaterial;
															return;
												}
												if (options.point.opacity !== undefined) mesh.material.uniforms.opacity.value = options.point.opacity;
												var scale = myPoints.getGlobalScale(mesh);
												var cameraPosition = new THREE.Vector3(camera.position.x / scale.x, camera.position.y / scale.y, camera.position.z / scale.z);
												scale = (scale.x + scale.y + scale.z) / 3;
												for (var i = 0; i < mesh.geometry.attributes.position.count; i++) {
															var position = getObjectPosition(mesh, i),
															position3d = new THREE.Vector3(position.x, position.y, position.z),
															    distance = position3d.distanceTo(cameraPosition),
															    y = 1;
															mesh.geometry.attributes.size.setX(i, Math.tan(mesh.userData.shaderMaterial.point !== undefined && mesh.userData.shaderMaterial.point.size !== undefined ? mesh.userData.shaderMaterial.point.size : options.point.size) * distance * scale * y);
															mesh.geometry.attributes.size.needsUpdate = true;
												}
									});
						}
			}
			this.setSize = function (width, height) {
						if ((typeof width === 'undefined' ? 'undefined' : _typeof(width)) === "object") {
									height = width.height;
									width = width.width;
						}
						if (width === undefined) {
									var target = { set: function set$$1(width, height) {
															renderer.setSize(width, height);
												} };
									renderer.getSize(target);
									return;
						}
						renderer.setSize(width, height);
			};
			arrayCreates.shift();
			var params = arrayCreates.shift();
			if (params === undefined) return;
			myThreejs.create(params.createXDobjects, params.options);
};
MyThree.release = 'v1.3';
var lang$2 = {
			defaultButton: 'Default',
			settings: 'Settings',
			webglcontextlost: 'The user agent has detected that the drawing buffer associated with a WebGLRenderingContext object has been lost.',
			light: 'Light',
			opacity: 'Opacity'
};
switch (getLanguageCode()) {
			case 'ru':
						lang$2.defaultButton = 'Восстановить';
						lang$2.name = 'Имя';
						lang$2.settings = 'Настройки';
						lang$2.webglcontextlost = 'Пользовательский агент обнаружил, что буфер рисунка, связанный с объектом WebGLRenderingContext, потерян.';
						lang$2.light = 'Свет';
						lang$2.opacity = 'Непрозрачность';
						break;
}
MyThree.MyPoints = MyPoints;
MyThree.StereoEffect = {
			spatialMultiplexsIndexs: StereoEffect.spatialMultiplexsIndexs
};MyThree.ColorPicker = ColorPicker$1;
MyThree.getWorldPosition = getWorldPosition;
MyThree.limitAngles = function (rotation) {
			function limitAngle(axisName) {
						while (rotation[axisName] > Math.PI * 2) {
									rotation[axisName] -= Math.PI * 2;
						}
			}
			limitAngle('x');
			limitAngle('y');
			limitAngle('z');
};
MyThree.Player = Player$1;
MyThree.three = three$1;
MyThree.Options = Options;
window.__myThree__ = window.__myThree__ || {};
if (window.__myThree__.boMyThree) console.error('myThree: duplicate myThree. Please use one instance of the myThree class.');
window.__myThree__.boMyThree = true;
MyThree.Intersections = Intersections;
MyThree.TreeView = TreeView;

exports['default'] = MyThree;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=myThree.js.map
