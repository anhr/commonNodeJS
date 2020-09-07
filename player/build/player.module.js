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

import { dat } from 'https://raw.githack.com/anhr/commonNodeJS/master/dat/dat.module.js';
import ScaleController from 'https://raw.githack.com/anhr/commonNodeJS/master/ScaleController.js';
import PositionController from 'https://raw.githack.com/anhr/commonNodeJS/master/PositionController.js';
import ColorPicker from 'https://raw.githack.com/anhr/colorpicker/master/colorpicker.js';

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
function dat$1() {}
if (typeof dat$1 !== 'undefined') {
	var elNameAndTitle = function elNameAndTitle(el, name, title) {
		if (name === undefined) console.warn('elNameAndTitle: name = ' + name);
		el.innerHTML = name;
		if (title !== undefined) el.title = title;
	};
	dat$1.GUI = GUI$1;
	if (dat$1.controllerNameAndTitle === undefined) {
		dat$1.controllerNameAndTitle = function (controller, name, title) {
			elNameAndTitle(controller.__li.querySelector(".property-name"), name, title);
		};
	} else console.error('Duplicate dat.controllerNameAndTitle method.');
	if (dat$1.folderNameAndTitle === undefined) {
		dat$1.folderNameAndTitle = function (folder, name, title) {
			elNameAndTitle(folder.__ul.querySelector("li.title"), name, title);
		};
	} else console.error('Duplicate dat.folderNameAndTitle method.');
	if (dat$1.controllerZeroStep === undefined) {
		dat$1.controllerZeroStep = function (folder, object, property, onchange) {
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
	if (dat$1.controllerSetValue === undefined) {
		dat$1.controllerSetValue = function (controller, index$$1) {
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
var ScaleController$1 = function (_controllers$CustomCo) {
	inherits(ScaleController$$1, _controllers$CustomCo);
	function ScaleController$$1(_onclick, options) {
		classCallCheck(this, ScaleController$$1);
		options = options || {};
		options.settings = options.settings || {};
		options.settings.zoomMultiplier = options.settings.zoomMultiplier || 1.1;
		var _this = possibleConstructorReturn(this, (ScaleController$$1.__proto__ || Object.getPrototypeOf(ScaleController$$1)).call(this, {
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
	return ScaleController$$1;
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
var PositionController$1 = function (_controllers$CustomCo) {
				inherits(PositionController$$1, _controllers$CustomCo);
				function PositionController$$1(onclickController, options) {
								classCallCheck(this, PositionController$$1);
								options = options || {};
								options.settings = options.settings || {};
								var settings = options.settings;
								options.min = options.min || 0.1;
								options.max = options.max || 10;
								settings.offset = settings.offset || 0.1;
								options.step = options.step || 0.1;
								var _this = possibleConstructorReturn(this, (PositionController$$1.__proto__ || Object.getPrototypeOf(PositionController$$1)).call(this, {
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
				return PositionController$$1;
}(controllers.CustomController);

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
var THREE$1;
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
	    cPosition = new THREE$1.Vector3(),
	    cRotations = new THREE$1.Vector3(),
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
	    controllerWorld = new THREE$1.Vector3(),
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
				var vColor = new THREE$1.Vector4().fromArray(intersectionSelected.object.geometry.attributes.ca.array, intersectionSelected.index * intersectionSelected.object.geometry.attributes.ca.itemSize);
				color = new THREE$1.Color(vColor.x, vColor.y, vColor.z);
				opasity = vColor.w;
			}
		}
		if (color instanceof THREE$1.Color) {
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
			scale: new THREE$1.Vector3().copy(mesh.scale),
			position: mesh.position instanceof THREE$1.Vector3 ? new THREE$1.Vector3().copy(mesh.position) : mesh.position instanceof THREE$1.Vector4 ? new THREE$1.Vector4().copy(mesh.position) : undefined,
			rotation: new THREE$1.Euler().copy(mesh.rotation)
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
		options.arrayCloud.frustumPoints.isDisplay()
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
		var scale = new THREE$1.Vector3();
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
			var position = new THREE$1.Vector3();
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
			cRotations[name] = fRotation.add(new THREE$1.Vector3(), name, 0, Math.PI * 2, 1 / 360).onChange(function (value) {
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
		if (typeof color === "string") color = new THREE$1.Color(color);
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
					if (positionDefault.w.r !== undefined) controllerColor.setValue('#' + new THREE$1.Color(positionDefault.w.r, positionDefault.w.g, positionDefault.w.b).getHexString());else if (typeof positionDefault.w === "function") setValue(controllerW, positionDefault.w(group.userData.t));else console.error('Restore default local position: Invalid W axis.');
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
	if (!THREE$1) {
		console.error('getObjectLocalPosition: call GuiSelectPoint.setTHREE( THREE ); first');
		return;
	}
	var attributesPosition = object.geometry.attributes.position,
	    position = attributesPosition.itemSize >= 4 ? new THREE$1.Vector4(0, 0, 0, 0) : new THREE$1.Vector3();
	position.fromArray(attributesPosition.array, index * attributesPosition.itemSize);
	return position;
}
function getWorldPosition$1(object, pos) {
	var position = pos.clone();
	function getPosition(object, pos) {
		var position = new THREE$1.Vector3(),
		    positionAngle = new THREE$1.Vector3();
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
	} while (object);
	return position;
}
function getObjectPosition(object, index) {
	if (index === -1) return undefined;
	if (index === undefined) return object.position;
	return getWorldPosition$1(object, getObjectLocalPosition(object, index));
}
GuiSelectPoint.setTHREE = function (_THREE) {
	if (THREE$1) {
		if (!Object.is(THREE$1, _THREE)) console.error('GuiSelectPoint.setTHREE: duplicate THREE. Please use one instance of the THREE library.');
		return;
	}
	THREE$1 = _THREE;
};

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
		if (typeof THREE$2 === 'undefined') {
			console.error('Call ColorPicker.palette.setTHREE(THREE) first.');
			return;
		}
		if (value instanceof THREE$2.Color) return value;
		var c = this.hsv2rgb(value, min, max);
		if (c === undefined) c = { r: 255, g: 255, b: 255 };
		return new THREE$2.Color("rgb(" + c.r + ", " + c.g + ", " + c.b + ")");
	};
}
var THREE$2;
Palette.setTHREE = function (_THREE) {
	if (THREE$2) {
		if (!Object.is(THREE$2, _THREE)) console.error('Palette.setTHREE: duplicate THREE. Please use one instance of the THREE library.');
		return;
	}
	THREE$2 = _THREE;
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
var ColorPicker$1 = {
  create: create,
  paletteIndexes: paletteIndexes,
  palette: Palette
};

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
var settings;
function Player(onSelectScene, options) {
	options = options || {};
	settings = options.settings || {};
	settings.min = settings.min || 0;
	settings.max = settings.max || 1;
	settings.marks = settings.marks || 2;
	settings.repeat = settings.repeat || false;
	settings.interval = settings.interval || 25;
	settings.zoomMultiplier = settings.zoomMultiplier || 1.1;
	settings.offset = settings.offset || 0.1;
	var selectSceneIndex = 0,
	_this = this;
	function getTime() {
		return (settings.max - settings.min) / (settings.marks - 1) * selectSceneIndex + settings.min;
	}
	this.selectScene = function (index) {
		if (index >= settings.marks) index = 0;else if (index < 0) index = settings.marks - 1;
		if (selectSceneIndex > settings.marks) selectSceneIndex = settings.marks;
		while (selectSceneIndex !== index) {
			if (selectSceneIndex < index) selectSceneIndex++;else selectSceneIndex--;
			onSelectScene(selectSceneIndex, getTime());
		}
	};
	this.next = function () {
		_this.selectScene(selectSceneIndex + 1);
	};
	this.prev = function () {
		_this.selectScene(selectSceneIndex - 1);
	};
	this.pushController = function (controller) {
		if (controller.object !== undefined && controller.object.playRate !== undefined) controller.object.playRate = settings.interval;
		controllers.push(controller);
	};
	this.controllers = [];
	var playing = false,
	    controllers = this.controllers,
	    time,
	    timeNext;
	function RenamePlayButtons() {
		controllers.forEach(function (controller) {
			controller.onRenamePlayButtons(playing);
		});
	}
	function play() {
		if (selectSceneIndex === -1 || selectSceneIndex === settings.marks) {
			selectSceneIndex = 0;
		}
		onSelectScene(selectSceneIndex, getTime());
	}
	function pause() {
		playing = false;
		RenamePlayButtons();
		time = undefined;
	}
	function isRepeat() {
		return settings.repeat;
	}
	function playNext() {
		selectSceneIndex++;
		if (selectSceneIndex >= settings.marks) {
			if (isRepeat()) selectSceneIndex = 0;else {
				pause();
				return;
			}
		}
		play();
	}
	this.animate = function () {
		if (time === undefined) return;
		var timeCur = new Date().getTime();
		if (isNaN(timeNext)) console.error('Player.animate: timeNext = ' + timeNext);
		if (timeCur < timeNext) return;
		while (timeCur > timeNext) {
			timeNext += 1000 / settings.interval;
		}playNext();
	};
	this.play3DObject = function () {
		if (playing) {
			pause();
			return;
		}
		playing = true;
		if (selectSceneIndex >= settings.marks) selectSceneIndex = -1;
		playNext();
		RenamePlayButtons();
		controllers.forEach(function (controller) {
			if (controller.controller !== undefined) {
				settings.interval = controller.controller.getValue();
				return;
			}
		});
		time = new Date().getTime();
		timeNext = time + 1000 / settings.interval;
	};
	this.repeat = function () {
		settings.repeat = !settings.repeat;
		this.onChangeRepeat(settings.repeat);
	};
	this.getOptions = function () {
		return options;
	};
	this.getSettings = function () {
		return options.settings;
	};
	this.getSelectSceneIndex = function () {
		return selectSceneIndex;
	};
	function setSettings() {
		cookie.setObject(cookieName, options.settings);
		options.onChangeScaleT(options.settings);
	}
	this.onChangeTimerId = function (value) {
		settings.interval = value;
		setSettings();
	};
	this.onChangeRepeat = function (value) {
		settings.repeat = value;
		this.controllers.forEach(function (controller) {
			controller.onChangeRepeat();
		});
	};
	this.gui = function (folder, getLanguageCode) {
		var lang = {
			player: 'Player',
			playerTitle: '3D objects animation.',
			min: 'Min',
			max: 'Max',
			marks: 'Frames',
			marksTitle: 'Player frames count',
			defaultButton: 'Default',
			defaultTitle: 'Restore default player settings.'
		};
		var languageCode = getLanguageCode === undefined ? 'en'
		: getLanguageCode();
		switch (languageCode) {
			case 'ru':
				lang.player = 'Проигрыватель';
				lang.playerTitle = 'Анимация 3D объектов.';
				lang.min = 'Минимум';
				lang.max = 'Максимум';
				lang.marks = 'Кадры';
				lang.marksTitle = 'Количество кадров проигрывателя';
				lang.defaultButton = 'Восстановить';
				lang.defaultTitle = 'Восстановить настройки проигрывателя по умолчанию.';
				break;
			default:
				if (options.lang === undefined || options.lang.languageCode != languageCode) break;
				Object.keys(options.lang).forEach(function (key) {
					if (lang[key] === undefined) return;
					lang[key] = options.lang[key];
				});
		}
		var fPlayer = folder.addFolder(lang.player);
		dat$1.folderNameAndTitle(fPlayer, lang.player, lang.playerTitle);
		var playController = this.PlayController;
		function scale() {
			var axes = options.settings,
			    scaleControllers = {};
			function onclick(customController, action) {
				var zoom = customController.controller.getValue();
				axes.min = action(axes.min, zoom);
				scaleControllers.min.setValue(axes.min);
				axes.max = action(axes.max, zoom);
				scaleControllers.max.setValue(axes.max);
				setSettings();
			}
			scaleControllers.folder = fPlayer.addFolder(axes.name);
			scaleControllers.scaleController = scaleControllers.folder.add(new ScaleController$1(onclick, { settings: options.settings, getLanguageCode: getLanguageCode })).onChange(function (value) {
				axes.zoomMultiplier = value;
				setSettings();
			});
			var positionController = new PositionController$1(function (shift) {
				onclick(positionController, function (value, zoom) {
					value += shift;
					return value;
				});
			}, { settings: options.settings, getLanguageCode: getLanguageCode });
			scaleControllers.positionController = scaleControllers.folder.add(positionController).onChange(function (value) {
				axes.offset = value;
				setSettings();
			});
			scaleControllers.min = dat$1.controllerZeroStep(scaleControllers.folder, axes, 'min', function (value) {
				setSettings();
			});
			dat$1.controllerNameAndTitle(scaleControllers.min, lang.min);
			scaleControllers.max = dat$1.controllerZeroStep(scaleControllers.folder, axes, 'max', function (value) {
				setSettings();
			});
			dat$1.controllerNameAndTitle(scaleControllers.max, lang.max);
			if (axes.marks !== undefined) {
				scaleControllers.marks = dat$1.controllerZeroStep(scaleControllers.folder, axes, 'marks', function (value) {
					setSettings();
				});
				dat$1.controllerNameAndTitle(scaleControllers.marks, axes.marksName === undefined ? lang.marks : axes.marksName, axes.marksTitle === undefined ? lang.marksTitle : axes.marksTitle);
			}
			dat$1.controllerNameAndTitle(scaleControllers.folder.add({
				defaultF: function defaultF(value) {
					playController.setValue(axesDefault.interval);
					axes.zoomMultiplier = axesDefault.zoomMultiplier;
					scaleControllers.scaleController.setValue(axes.zoomMultiplier);
					axes.offset = axesDefault.offset;
					scaleControllers.positionController.setValue(axes.offset);
					axes.min = axesDefault.min;
					scaleControllers.min.setValue(axes.min);
					axes.max = axesDefault.max;
					scaleControllers.max.setValue(axes.max);
					if (axesDefault.marks !== undefined) {
						axes.marks = axesDefault.marks;
						scaleControllers.marks.setValue(axes.marks);
					}
					setSettings();
				}
			}, 'defaultF'), lang.defaultButton, lang.defaultTitle);
		}
		scale();
	};
}
Player.execFunc = function (funcs, axisName, t, a, b) {
	a = a || 1;
	b = b || 0;
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
					if (typeof a[i] === "function") return a[i](t, a, b);
					if (a[i] instanceof THREE.Color) return a[i];
				};
				if (func.length === 0) {
					console.error('Player.execFunc: funcs["' + axisName + '"] array is empty');
					return;
				}
				var a = func,
				    l = func.length - 1,
				    max = options.player.max,
				    min = options.player.min,
				    tStep = (max - min) / l,
				    tStart = min,
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
				if (typeof a[iStart] !== "number") {
					if (axisName === 'w') {
						return execW(iStart);
					}
					console.error('Player.execFunc: funcs["' + axisName + '"] array item ' + iStart + ' typeof = ' + _typeof(a[iStart]) + ' is not number');
					return;
				}
				if (typeof a[iStop] !== "number") {
					if (axisName === 'w') return execW(iStop);
					console.error('Player.execFunc: funcs["' + axisName + '"] array item ' + iStop + ' typeof = ' + _typeof(a[iStop]) + ' is not number');
					return;
				}
				var x = (a[iStop] - a[iStart]) / (tStop - tStart),
				    y = a[iStart] - x * tStart;
				return x * t + y;
			}
			if (func.func) {
				return func.func(t, a, b);
			}
			if (axisName !== 'w') console.error('Player.execFunc: funcs["' + axisName + '"] object is not array');
			return;
		default:
			console.error('Player.execFunc: Invalud typeof funcs["' + axisName + '"]: ' + typeofFuncs);
	}
	return;
};
var paletteDefault = new ColorPicker$1.palette();
Player.selectPlayScene = function (THREE, group, t, index, options) {
	options.boPlayer = options.boPlayer || false;
	options = options || {};
	options.a = options.a || 1;
	options.b = options.b || 0;
	options.palette = options.palette || paletteDefault;
	options.scales = options.scales || {};
	group.userData.t = t;
	group.children.forEach(function (mesh) {
		if (
		!mesh.userData.player || options.boPlayer && mesh.userData.boFrustumPoints) return;
		delete mesh.geometry.boundingSphere;
		mesh.geometry.boundingSphere = null;
		if (mesh.userData.player.selectPlayScene) mesh.userData.player.selectPlayScene(t);
		function setAttributes(a, b) {
			var attributes = mesh.geometry.attributes,
			    arrayFuncs = mesh.userData.player.arrayFuncs;
			if (arrayFuncs === undefined) return;
			if (t === undefined) console.error('setPosition: t = ' + t);
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
				var min, max;
				if (options.scales.w !== undefined) {
					min = options.scales.w.min;max = options.scales.w.max;
				} else {
					max = value;
					min = max - 1;
				}
				if (typeof funcs.w === "function") {
					var value = funcs.w(t, a, b);
					attributes.position.setW(i, value);
					needsUpdate = true;
					if (options.palette) color = options.palette.toColor(value, min, max);
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
					if (mesh.material.vertexColors !== THREE.VertexColors) console.error('Player.selectPlayScene: Please set the vertexColors parameter of the THREE.PointsMaterial of your points to THREE.VertexColors. Example: vertexColors: THREE.PointsMaterial');
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
			}
		}
		setAttributes(options.a, options.b);
		var message = 'Player.selectPlayScene: invalid mesh.scale.';
		if (mesh.scale.x <= 0) console.error(message + 'x = ' + mesh.scale.x);
		if (mesh.scale.y <= 0) console.error(message + 'y = ' + mesh.scale.y);
		if (mesh.scale.z <= 0) console.error(message + 'z = ' + mesh.scale.z);
		if (!options.guiSelectPoint) return;
		options.guiSelectPoint.setMesh();
		var selectedPointIndex = options.guiSelectPoint.getSelectedPointIndex();
		if (selectedPointIndex !== -1 && options.guiSelectPoint.isSelectedMesh(mesh)) {
			var position = getObjectPosition(mesh, selectedPointIndex);
			options.guiSelectPoint.setPosition(position, {
				object: mesh,
				index: selectedPointIndex
			});
		}
	});
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
	optionsPoints.t = optionsPoints.t || 0;
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
			if (funcs.trace) {
				funcs.vector.line = new Player.traceLine(THREE, optionsPoints.group, options);
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
	optionsColor = optionsColor || {};
	optionsColor.palette = optionsColor.palette || paletteDefault;
	if (optionsColor.positions !== undefined && Array.isArray(arrayFuncs) && arrayFuncs.length !== optionsColor.positions.count) {
		console.error('getColors failed! arrayFuncs.length: ' + arrayFuncs.length + ' != positions.count: ' + optionsColor.positions.count);
		return optionsColor.colors;
	}
	optionsColor.colors = optionsColor.colors || [];
	var length = Array.isArray(arrayFuncs) ? arrayFuncs.length : optionsColor.positions.count;
	for (var i = 0; i < length; i++) {
		var funcs = Array.isArray(arrayFuncs) ? arrayFuncs[i] : undefined,
		    vector;
		if (funcs instanceof THREE.Vector4 ||
		optionsColor.positions.itemSize === 4
		) {
				var min, max;
				if (optionsColor.scale !== undefined) {
					min = optionsColor.scale.min;max = optionsColor.scale.max;
				} else {
					max = funcs instanceof THREE.Vector4 ? funcs.w : 1;
					min = max - 1;
				}
				var color = optionsColor.palette.toColor(funcs === undefined ? new THREE.Vector4().fromBufferAttribute(optionsColor.positions, i).w : funcs.w, min, max);
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
	if (!settings) {
		console.error('Player.traceLine: call Player(...) first.');
		return;
	}
	var MAX_POINTS = settings.marks,
	    line;
	this.addPoint = function (point, index, color) {
		if (line === undefined) {
			var geometry = new THREE.BufferGeometry();
			var positions = new Float32Array(MAX_POINTS * 3);
			geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
			var colors = new Float32Array(MAX_POINTS * 3);
			geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
			geometry.setDrawRange(index, index);
			line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ vertexColors: THREE.VertexColors }));
			line.visible = true;
			group.add(line);
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

export default Player;
//# sourceMappingURL=player.module.js.map
