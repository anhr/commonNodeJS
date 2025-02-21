/**
 * node.js version of the MyThree
 *
 * I use MyThree in my projects for displaying of my 3D objects in the canvas.
 *
 * @author Andrej Hristoliubov https://github.com/anhr/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */

/**
 * dat-gui JavaScript Controller Library
 * http://code.google.com/p/dat-gui
 *
 * Copyright 2011 Data Arts Team, Google Creative Lab
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */

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

function colorToString$1 (color, forceCSSHex) {
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
  defaults: function defaults(target) {
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
  toArray: function toArray(obj) {
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

var INTERPRETATIONS$1 = [
{
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
},
{
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
},
{
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
},
{
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

var _typeof$1 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











var classCallCheck$1 = function (instance, Constructor) {
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

var inherits$1 = function (subClass, superClass) {
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











var possibleConstructorReturn$1 = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var Color$1 = function () {
  function Color() {
    classCallCheck$1(this, Color);
    this.__state = interpret$1.apply(this, arguments);
    if (this.__state === false) {
      throw new Error('Failed to interpret color arguments');
    }
    this.__state.a = this.__state.a || 1;
  }
  createClass$1(Color, [{
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
var dom$1 = {
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
          evt.initMouseEvent(eventType, params.bubbles || false, params.cancelable || true, window, params.clickCount || 1, 0,
          0,
          clientX,
          clientY,
          false, false, false, false, 0, null);
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
    return dom$1;
  },
  unbind: function unbind(elem, event, func, newBool) {
    var bool = newBool || false;
    if (elem.removeEventListener) {
      elem.removeEventListener(event, func, bool);
    } else if (elem.detachEvent) {
      elem.detachEvent('on' + event, func);
    }
    return dom$1;
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
    return dom$1;
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
    return dom$1;
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
    dom$1.bind(_this2.__checkbox, 'change', onChange, false);
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
}(Controller$1);

var OptionController$1 = function (_Controller) {
  inherits$1(OptionController, _Controller);
  function OptionController(object, property, opts) {
    classCallCheck$1(this, OptionController);
    var _this2 = possibleConstructorReturn$1(this, (OptionController.__proto__ || Object.getPrototypeOf(OptionController)).call(this, object, property));
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
    dom$1.bind(_this2.__select, 'change', function () {
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
      if (dom$1.isActive(this.__select)) return this;
      this.__select.value = this.getValue();
      return get$2(OptionController.prototype.__proto__ || Object.getPrototypeOf(OptionController.prototype), 'updateDisplay', this).call(this);
    }
  }]);
  return OptionController;
}(Controller$1);

var StringController$1 = function (_Controller) {
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
    dom$1.bind(_this2.__input, 'keyup', onChange);
    dom$1.bind(_this2.__input, 'change', onChange);
    dom$1.bind(_this2.__input, 'blur', onBlur);
    dom$1.bind(_this2.__input, 'keydown', function (e) {
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
      if (!dom$1.isActive(this.__input)) {
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
  inherits$1(NumberController, _Controller);
  function NumberController(object, property, params) {
    classCallCheck$1(this, NumberController);
    var _this = possibleConstructorReturn$1(this, (NumberController.__proto__ || Object.getPrototypeOf(NumberController)).call(this, object, property));
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
  inherits$1(NumberControllerBox, _NumberController);
  function NumberControllerBox(object, property, params) {
    classCallCheck$1(this, NumberControllerBox);
    var _this2 = possibleConstructorReturn$1(this, (NumberControllerBox.__proto__ || Object.getPrototypeOf(NumberControllerBox)).call(this, object, property, params));
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
      dom$1.unbind(window, 'mousemove', onMouseDrag);
      dom$1.unbind(window, 'mouseup', onMouseUp);
      onFinish();
    }
    function onMouseDown(e) {
      dom$1.bind(window, 'mousemove', onMouseDrag);
      dom$1.bind(window, 'mouseup', onMouseUp);
      prevY = e.clientY;
    }
    _this2.__input = document.createElement('input');
    _this2.__input.setAttribute('type', 'text');
    dom$1.bind(_this2.__input, 'change', onChange);
    dom$1.bind(_this2.__input, 'blur', onBlur);
    dom$1.bind(_this2.__input, 'mousedown', onMouseDown);
    dom$1.bind(_this2.__input, 'keydown', function (e) {
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
  inherits$1(NumberControllerSlider, _NumberController);
  function NumberControllerSlider(object, property, min, max, step, newBool) {
    classCallCheck$1(this, NumberControllerSlider);
    var _this2 = possibleConstructorReturn$1(this, (NumberControllerSlider.__proto__ || Object.getPrototypeOf(NumberControllerSlider)).call(this, object, property, { min: min, max: max, step: step }));
    var _this = _this2;
    _this2.__background = document.createElement('div');
    _this2.__foreground = document.createElement('div');
    _this2.newBool = newBool;
    dom$1.bind(_this2.__background, 'mousedown', onMouseDown, newBool);
    dom$1.bind(_this2.__background, 'touchstart', onTouchStart);
    dom$1.addClass(_this2.__background, 'slider');
    dom$1.addClass(_this2.__foreground, 'slider-fg');
    function onMouseDown(e) {
      document.activeElement.blur();
      dom$1.bind(window, 'mousemove', onMouseDrag);
      dom$1.bind(window, 'mouseup', onMouseUp);
      onMouseDrag(e);
    }
    function onMouseDrag(e) {
      if (!_this.newBool) e.preventDefault();
      var bgRect = _this.__background.getBoundingClientRect();
      _this.setValue(map$1(e.clientX, bgRect.left, bgRect.right, _this.__min, _this.__max));
      return false;
    }
    function onMouseUp() {
      dom$1.unbind(window, 'mousemove', onMouseDrag);
      dom$1.unbind(window, 'mouseup', onMouseUp);
      if (_this.__onFinishChange) {
        _this.__onFinishChange.call(_this, _this.getValue());
      }
    }
    function onTouchStart(e) {
      if (e.touches.length !== 1) {
        return;
      }
      dom$1.bind(window, 'touchmove', onTouchMove);
      dom$1.bind(window, 'touchend', onTouchEnd);
      onTouchMove(e);
    }
    function onTouchMove(e) {
      var clientX = e.touches[0].clientX;
      var bgRect = _this.__background.getBoundingClientRect();
      _this.setValue(map$1(clientX, bgRect.left, bgRect.right, _this.__min, _this.__max));
    }
    function onTouchEnd() {
      dom$1.unbind(window, 'touchmove', onTouchMove);
      dom$1.unbind(window, 'touchend', onTouchEnd);
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
}(NumberController$1);

var FunctionController$1 = function (_Controller) {
  inherits$1(FunctionController, _Controller);
  function FunctionController(object, property, text) {
    classCallCheck$1(this, FunctionController);
    var _this2 = possibleConstructorReturn$1(this, (FunctionController.__proto__ || Object.getPrototypeOf(FunctionController)).call(this, object, property));
    var _this = _this2;
    _this2.__button = document.createElement('div');
    _this2.__button.innerHTML = text === undefined ? 'Fire' : text;
    dom$1.bind(_this2.__button, 'click', function (e) {
      e.preventDefault();
      _this.fire();
      return false;
    });
    dom$1.addClass(_this2.__button, 'button');
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
}(Controller$1);

var ColorController$1 = function (_Controller) {
    inherits$1(ColorController, _Controller);
    function ColorController(object, property) {
        classCallCheck$1(this, ColorController);
        var _this2 = possibleConstructorReturn$1(this, (ColorController.__proto__ || Object.getPrototypeOf(ColorController)).call(this, object, property));
        _this2.__color = new Color$1(_this2.getValue());
        _this2.__temp = new Color$1(0);
        var _this = _this2;
        _this2.domElement = document.createElement('div');
        dom$1.makeSelectable(_this2.domElement, false);
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
        dom$1.bind(_this2.__input, 'keydown', function (e) {
            if (e.keyCode === 13) {
                onBlur.call(this);
            }
        });
        dom$1.bind(_this2.__input, 'blur', onBlur);
        dom$1.bind(_this2.__selector, 'mousedown', function ()        {
            dom$1.addClass(this, 'drag').bind(window, 'mouseup', function ()        {
                dom$1.removeClass(_this.__selector, 'drag');
            });
        });
        dom$1.bind(_this2.__selector, 'touchstart', function ()        {
            dom$1.addClass(this, 'drag').bind(window, 'touchend', function ()        {
                dom$1.removeClass(_this.__selector, 'drag');
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
        dom$1.bind(_this2.__saturation_field, 'mousedown', fieldDown);
        dom$1.bind(_this2.__saturation_field, 'touchstart', fieldDown);
        dom$1.bind(_this2.__field_knob, 'mousedown', fieldDown);
        dom$1.bind(_this2.__field_knob, 'touchstart', fieldDown);
        dom$1.bind(_this2.__hue_field, 'mousedown', fieldDownH);
        dom$1.bind(_this2.__hue_field, 'touchstart', fieldDownH);
        function fieldDown(e) {
            setSV(e);
            dom$1.bind(window, 'mousemove', setSV);
            dom$1.bind(window, 'touchmove', setSV);
            dom$1.bind(window, 'mouseup', fieldUpSV);
            dom$1.bind(window, 'touchend', fieldUpSV);
        }
        function fieldDownH(e) {
            setH(e);
            dom$1.bind(window, 'mousemove', setH);
            dom$1.bind(window, 'touchmove', setH);
            dom$1.bind(window, 'mouseup', fieldUpH);
            dom$1.bind(window, 'touchend', fieldUpH);
        }
        function fieldUpSV() {
            dom$1.unbind(window, 'mousemove', setSV);
            dom$1.unbind(window, 'touchmove', setSV);
            dom$1.unbind(window, 'mouseup', fieldUpSV);
            dom$1.unbind(window, 'touchend', fieldUpSV);
            onFinish();
        }
        function fieldUpH() {
            dom$1.unbind(window, 'mousemove', setH);
            dom$1.unbind(window, 'touchmove', setH);
            dom$1.unbind(window, 'mouseup', fieldUpH);
            dom$1.unbind(window, 'touchend', fieldUpH);
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
    createClass$1(ColorController, [{
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
    } catch (e) {
    }
  }
};

var saveDialogContents$1 = "<div id=\"dg-save\" class=\"dg dialogue\">\n\n  Here's the new load parameter for your <code>GUI</code>'s constructor:\n\n  <textarea id=\"dg-new-constructor\"></textarea>\n\n  <div id=\"dg-save-locally\">\n\n    <input id=\"dg-local-storage\" type=\"checkbox\"/> Automatically save\n    values to <code>localStorage</code> on exit.\n\n    <div id=\"dg-local-explain\">The values saved to <code>localStorage</code> will\n      override those passed to <code>dat.GUI</code>'s constructor. This makes it\n      easier to work incrementally, but <code>localStorage</code> is fragile,\n      and your friends may not see the same values you do.\n\n    </div>\n\n  </div>\n\n</div>";

function requestAnimationFrame$2(callback) {
  setTimeout(callback, 1000 / 60);
}
var requestAnimationFrame$1$2 = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || requestAnimationFrame$2;

var CenteredDiv$1 = function () {
  function CenteredDiv() {
    classCallCheck$1(this, CenteredDiv);
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
    dom$1.makeFullscreen(this.backgroundElement);
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
    dom$1.bind(this.backgroundElement, 'click', function () {
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
        dom$1.unbind(_this.domElement, 'webkitTransitionEnd', hide);
        dom$1.unbind(_this.domElement, 'transitionend', hide);
        dom$1.unbind(_this.domElement, 'oTransitionEnd', hide);
      };
      dom$1.bind(this.domElement, 'webkitTransitionEnd', hide);
      dom$1.bind(this.domElement, 'transitionend', hide);
      dom$1.bind(this.domElement, 'oTransitionEnd', hide);
      this.backgroundElement.style.opacity = 0;
      this.domElement.style.opacity = 0;
      this.domElement.style.webkitTransform = 'scale(1.1)';
    }
  }, {
    key: 'layout',
    value: function layout() {
      this.domElement.style.left = window.innerWidth / 2 - dom$1.getWidth(this.domElement) / 2 + 'px';
      this.domElement.style.top = window.innerHeight / 2 - dom$1.getHeight(this.domElement) / 2 + 'px';
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
var GUI$1 = function GUI(pars) {
  var _this = this;
  var params = pars || {};
  this.domElement = document.createElement('div');
  this.__ul = document.createElement('ul');
  this.domElement.appendChild(this.__ul);
  dom$1.addClass(this.domElement, CSS_NAMESPACE$1);
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
  Object.defineProperties(this,
  {
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
          dom$1.addClass(_this.__ul, GUI.CLASS_CLOSED);
        } else {
          dom$1.removeClass(_this.__ul, GUI.CLASS_CLOSED);
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
            dom$1.bind(window, 'unload', saveToLocalStorage);
          } else {
            dom$1.unbind(window, 'unload', saveToLocalStorage);
          }
          localStorage.setItem(getLocalStorageHash$1(_this, 'isLocal'), bool);
        }
      }
    }
  });
  if (Common$1.isUndefined(params.parent)) {
    this.closed = params.closed || false;
    dom$1.addClass(this.domElement, GUI.CLASS_MAIN);
    dom$1.makeSelectable(this.domElement, false);
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
    dom$1.addClass(this.__closeButton, GUI.CLASS_CLOSE_BUTTON);
    if (params.closeOnTop) {
      dom$1.addClass(this.__closeButton, GUI.CLASS_CLOSE_TOP);
      this.domElement.insertBefore(this.__closeButton, this.domElement.childNodes[0]);
    } else {
      dom$1.addClass(this.__closeButton, GUI.CLASS_CLOSE_BOTTOM);
      this.domElement.appendChild(this.__closeButton);
    }
    dom$1.bind(this.__closeButton, 'click', function () {
      _this.closed = !_this.closed;
    });
  } else {
    if (params.closed === undefined) {
      params.closed = true;
    }
    var titleRowName = document.createTextNode(params.name);
    dom$1.addClass(titleRowName, 'controller-name');
    titleRow = addRow$1(_this, titleRowName);
    var onClickTitle = function onClickTitle(e) {
      e.preventDefault();
      _this.closed = !_this.closed;
      return false;
    };
    dom$1.addClass(this.__ul, GUI.CLASS_CLOSED);
    dom$1.addClass(titleRow, 'title');
    dom$1.bind(titleRow, 'click', onClickTitle);
    if (!params.closed) {
      this.closed = false;
    }
  }
  if (params.autoPlace) {
    if (Common$1.isUndefined(params.parent)) {
      if (autoPlaceVirgin$1) {
        autoPlaceContainer$1 = document.createElement('div');
        dom$1.addClass(autoPlaceContainer$1, CSS_NAMESPACE$1);
        dom$1.addClass(autoPlaceContainer$1, GUI.CLASS_AUTO_PLACE_CONTAINER);
        document.body.appendChild(autoPlaceContainer$1);
        autoPlaceVirgin$1 = false;
      }
      autoPlaceContainer$1.appendChild(this.domElement);
      dom$1.addClass(this.domElement, GUI.CLASS_AUTO_PLACE);
    }
    if (!this.parent) {
      setWidth$1(_this, params.width);
    }
  }
  this.__resizeHandler = function () {
    _this.onResizeDebounced();
  };
  dom$1.bind(window, 'resize', this.__resizeHandler);
  dom$1.bind(this.__ul, 'webkitTransitionEnd', this.__resizeHandler);
  dom$1.bind(this.__ul, 'transitionend', this.__resizeHandler);
  dom$1.bind(this.__ul, 'oTransitionEnd', this.__resizeHandler);
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
GUI$1.toggleHide = function () {
  hide$1 = !hide$1;
  Common$1.each(hideableGuis$1, function (gui) {
    gui.domElement.style.display = hide$1 ? 'none' : '';
  });
};
GUI$1.CLASS_AUTO_PLACE = 'a';
GUI$1.CLASS_AUTO_PLACE_CONTAINER = 'ac';
GUI$1.CLASS_MAIN = 'main';
GUI$1.CLASS_CONTROLLER_ROW = 'cr';
GUI$1.CLASS_TOO_TALL = 'taller-than-window';
GUI$1.CLASS_CLOSED = 'closed';
GUI$1.CLASS_CLOSE_BUTTON = 'close-button';
GUI$1.CLASS_CLOSE_TOP = 'close-top';
GUI$1.CLASS_CLOSE_BOTTOM = 'close-bottom';
GUI$1.CLASS_DRAG = 'drag';
GUI$1.DEFAULT_WIDTH = 245;
GUI$1.TEXT_CLOSED = 'Close Controls';
GUI$1.TEXT_OPEN = 'Open Controls';
GUI$1._keydownHandler = function (e) {
  if (document.activeElement.type !== 'text' && (e.which === HIDE_KEY_CODE$1 || e.keyCode === HIDE_KEY_CODE$1)) {
    GUI$1.toggleHide();
  }
};
dom$1.bind(window, 'keydown', GUI$1._keydownHandler, false);
Common$1.extend(GUI$1.prototype,
{
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
    dom$1.unbind(window, 'keydown', GUI$1._keydownHandler, false);
    removeListeners$1(this);
  },
  addFolder: function addFolder(name) {
    if (this.__folders[name] !== undefined) {
      throw new Error('You already have a folder in this GUI by the' + ' name "' + name + '"');
    }
    var newGuiParams = { name: name, parent: this };
    newGuiParams.autoPlace = this.autoPlace;
    if (this.load &&
    this.load.folders &&
    this.load.folders[name]) {
      newGuiParams.closed = this.load.folders[name].closed;
      newGuiParams.load = this.load.folders[name];
    }
    var gui = new GUI$1(newGuiParams);
    this.__folders[name] = gui;
    var li = addRow$1(this, gui.domElement);
    dom$1.addClass(li, 'folder');
    return gui;
  },
  removeFolder: function removeFolder(folder) {
    this.__ul.removeChild(folder.domElement.parentElement);
    delete this.__folders[folder.name];
    if (this.load &&
    this.load.folders &&
    this.load.folders[folder.name]) {
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
      var top = dom$1.getOffset(root.__ul).top;
      var h = 0;
      Common$1.each(root.__ul.childNodes, function (node) {
        if (!(root.autoPlace && node === root.__save_row)) {
          h += dom$1.getHeight(node);
        }
      });
      if (window.innerHeight - top - CLOSE_BUTTON_HEIGHT$1 < h) {
        dom$1.addClass(root.domElement, GUI$1.CLASS_TOO_TALL);
        root.__ul.style.height = window.innerHeight - top - CLOSE_BUTTON_HEIGHT$1 + 'px';
      } else {
        dom$1.removeClass(root.domElement, GUI$1.CLASS_TOO_TALL);
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
  dom$1.unbind(window, 'resize', gui.__resizeHandler);
  if (gui.saveToLocalStorageIfPossible) {
    dom$1.unbind(window, 'unload', gui.saveToLocalStorageIfPossible);
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
  Common$1.extend(controller,                                   {
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
    dom$1.addClass(li, 'has-slider');
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
    dom$1.bind(li, 'click', function () {
      dom$1.fakeEvent(controller.__checkbox, 'click');
    });
    dom$1.bind(controller.__checkbox, 'click', function (e) {
      e.stopPropagation();
    });
  } else if (controller instanceof FunctionController$1) {
    dom$1.bind(li, 'click', function () {
      dom$1.fakeEvent(controller.__button, 'click');
    });
    dom$1.bind(li, 'mouseover', function () {
      dom$1.addClass(controller.__button, 'hover');
    });
    dom$1.bind(li, 'mouseout', function () {
      dom$1.removeClass(controller.__button, 'hover');
    });
  } else if (controller instanceof ColorController$1) {
    dom$1.addClass(li, 'color');
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
  dom$1.addClass(controller.domElement, 'c');
  var name = document.createElement('span');
  dom$1.addClass(name, 'property-name');
  if (customObject !== undefined && _typeof$1(customObject.property) === "object") {
    for (var propertyName in customObject.property) {
      name.appendChild(customObject.property[propertyName]);
    }
  } else name.innerHTML = controller.property;
  var container = document.createElement('div');
  container.appendChild(name);
  container.appendChild(controller.domElement);
  var li = addRow$1(gui, container, params.before);
  dom$1.addClass(li, GUI$1.CLASS_CONTROLLER_ROW);
  if (controller instanceof ColorController$1) {
    dom$1.addClass(li, 'color');
  } else {
    dom$1.addClass(li, _typeof$1(controller.getValue()));
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
  dom$1.addClass(gui.domElement, 'has-save');
  gui.__ul.insertBefore(div, gui.__ul.firstChild);
  dom$1.addClass(div, 'save-row');
  var gears = document.createElement('span');
  gears.innerHTML = '&nbsp;';
  dom$1.addClass(gears, 'button gears');
  var button = document.createElement('span');
  button.innerHTML = 'Save';
  dom$1.addClass(button, 'button');
  dom$1.addClass(button, 'save');
  var button2 = document.createElement('span');
  button2.innerHTML = 'New';
  dom$1.addClass(button2, 'button');
  dom$1.addClass(button2, 'save-as');
  var button3 = document.createElement('span');
  button3.innerHTML = 'Revert';
  dom$1.addClass(button3, 'button');
  dom$1.addClass(button3, 'revert');
  var select = gui.__preset_select = document.createElement('select');
  if (gui.load && gui.load.remembered) {
    Common$1.each(gui.load.remembered, function (value, key) {
      addPresetOption$1(gui, key, key === gui.preset);
    });
  } else {
    addPresetOption$1(gui, DEFAULT_DEFAULT_PRESET_NAME$1, false);
  }
  dom$1.bind(select, 'change', function () {
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
    dom$1.bind(localStorageCheckBox, 'change', function () {
      gui.useLocalStorage = !gui.useLocalStorage;
      showHideExplain$1(gui, explain);
    });
  }
  var newConstructorTextArea = document.getElementById('dg-new-constructor');
  dom$1.bind(newConstructorTextArea, 'keydown', function (e) {
    if (e.metaKey && (e.which === 67 || e.keyCode === 67)) {
      SAVE_DIALOGUE$1.hide();
    }
  });
  dom$1.bind(gears, 'click', function () {
    newConstructorTextArea.innerHTML = JSON.stringify(gui.getSaveObject(), undefined, 2);
    SAVE_DIALOGUE$1.show();
    newConstructorTextArea.focus();
    newConstructorTextArea.select();
  });
  dom$1.bind(button, 'click', function () {
    gui.save();
  });
  dom$1.bind(button2, 'click', function () {
    var presetName = prompt('Enter a new preset name.');
    if (presetName) {
      gui.saveAs(presetName);
    }
  });
  dom$1.bind(button3, 'click', function () {
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
    dom$1.removeClass(gui.__closeButton, GUI$1.CLASS_DRAG);
    dom$1.unbind(window, 'mousemove', drag);
    dom$1.unbind(window, 'mouseup', dragStop);
  }
  function dragStart(e) {
    e.preventDefault();
    pmouseX = e.clientX;
    dom$1.addClass(gui.__closeButton, GUI$1.CLASS_DRAG);
    dom$1.bind(window, 'mousemove', drag);
    dom$1.bind(window, 'mouseup', dragStop);
    return false;
  }
  dom$1.bind(gui.__resize_handle, 'mousedown', dragStart);
  dom$1.bind(gui.__closeButton, 'mousedown', dragStart);
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
var GUI$1$1 = GUI$1;

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

	/**
	 * adds new button into controller
	 * @param {string} innerHTML button name
	 * @param {object} [options] the following options are available
	 * @param {String} [options.title] title of the button
	 * @param {Event} [options.onclick] onclick event
	 * @param {Event} [options.onWheel] onWheel event
	 */
	addButton: function ( innerHTML, options ) {

		options = options || {};
		var button = document.createElement( 'span' );
		button.innerHTML = innerHTML;
		if ( options.title !== undefined )
			button.title = options.title;
		if ( options.onclick !== undefined ) {

			button.style.cursor = 'pointer';
			button.onclick = options.onclick;

		}
		if ( options.onwheel !== undefined ) {

			button.style.cursor = 'n-resize';

			//https://learn.javascript.ru/mousewheel
			if ( button.addEventListener ) {
				if ( 'onwheel' in document ) {
					// IE9+, FF17+, Ch31+
					button.addEventListener( "wheel", onWheel, {
						
						passive: true//https://web.dev/i18n/ru/uses-passive-event-listeners/
					
					} );
				} else if ( 'onmousewheel' in document ) {
					// устаревший вариант события
					button.addEventListener( "mousewheel", onWheel );
				} else {
					// Firefox < 17
					button.addEventListener( "MozMousePixelScroll", onWheel );
				}
			} else { // IE8-
				button.attachEvent( "onmousewheel", onWheel );
			}

			function onWheel( e ) {
				e = e || window.event;

				// wheelDelta не дает возможность узнать количество пикселей
				var delta = e.deltaY || e.detail || e.wheelDelta;
				options.onwheel( delta );

			}

		}
		button.style.margin = '0px 2px';
		return button;

	},

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

class ScaleController extends controllers$1.CustomController {

	/**
	* @callback onclick
	* @param {ScaleController} customController this controller
	* @param {Function} action action( value, zoom ) function for multiply or divide value to zoom
	*/

	/**
	 * @description dat.GUI graphical user interface controller for control of the scale of threejs 3D object
	 * @param {onclick} onclick Called whenever user has clicked this controller.
	 * @param {object} [options] the following options are available:
	 * @param {object} [options.settings] settings.
	 * @param {number} [options.settings.zoomMultiplier] control value. Default is 1.1
	 * @param {Function} [options.getLanguageCode=language code of your browser] returns the "primary language" subtag of the version of the browser.
	 * @example 
//Add new ScaleController to the dat.GUI folder
folder.add( new ScaleController( function ( customController, action ) {

	var zoom = customController.controller.getValue();

	//Scale a THREE.Mesh object
	mesh.scale.x = action( mesh.scale.x, zoom );
	mesh.scale.y = action( mesh.scale.y, zoom );
	mesh.scale.z = action( mesh.scale.z, zoom );
	mesh.needsUpdate = true;

},
	{

		settings: { zoomMultiplier: 1.1, },
		getLanguageCode: getLanguageCode,

	} ) );
	 */
	constructor( onclick, options ) {

		options = options || {};
		options.settings = options.settings || {};
		options.settings.zoomMultiplier = options.settings.zoomMultiplier || 1.1;

		super( {

			multiplier: options.settings.zoomMultiplier,//1.1
			property: function ( customController ) {


				//Localization

				var lang = {

					//Zoom
					zoom: 'Zoom',
					in: 'in',
					out: 'out',
					wheelZoom: 'Scroll the mouse wheel to zoom',

				};

				var _languageCode = options.getLanguageCode === undefined ? 'en'//Default language is English
					: options.getLanguageCode();
				switch ( _languageCode ) {

					case 'ru'://Russian language

						//Zoom
						lang.zoom = 'Изменить';
						lang.in = 'увеличить';
						lang.out = 'уменьшить';
						lang.wheelZoom = 'Прокрутите колесико мыши для изменения масштаба';

						break;
					default://Custom language
						if ( ( options.lang === undefined ) || ( options.lang.languageCode != _languageCode ) )
							break;

						Object.keys( options.lang ).forEach( function ( key ) {

							if ( lang[key] === undefined )
								return;
							lang[key] = options.lang[key];

						} );

				}

				//

				var buttons = {},
					addButton = UpDownController.addButton;
				buttons.zoomLabel = addButton( lang.zoom, {

					title: lang.wheelZoom,//Scroll the mouse wheel to zoom
					onwheel: function ( delta ) {

						onclick( customController, function ( value, zoom ) {

							if ( delta > 0 )
								value *= zoom;
							else value /= zoom;
							return value;

						} );

					}

				} );
				buttons.in = addButton( '↑', {

					title: lang.in,
					onclick: function () {

						onclick( customController, function ( value, zoom ) {

							value *= zoom;
							return value;

						} );

					}

				} );
				buttons.out = addButton( '↓', {

					title: lang.out,
					onclick: function () {

						onclick( customController, function ( value, zoom ) {

							value /= zoom;
							return value;

						} );

					}

				} );
				return buttons;

			},

		}, 'multiplier', 1.1, 10, 0.1, options.newBool );
		if ( this.property === undefined )
			console.error( 'init() returns ' + this.property );

	}

}

/**
 * dat.GUI graphical user interface controllers for manipulate or multiplication of the object's property
 * @param {GUI} folder folder for new controllers
 * @param {Object} object The object to be manipulated
 * @param {String} property The name of the property to be manipulated
 * @param {function( value )} onChange Callback function that take the new  property of the object
 * @param {Object} [options] the following options are available
 * @param {object} [options.settings] settings.
 * @param {number} [options.settings.zoomMultiplier] control value. Default is 1.1
 * @param {Function} [options.getLanguageCode=language code of your browser] returns the "primary language" subtag of the version of the browser.
 * @param {String} [options.text] object's property name. Default is property name.
 * @param {String} [options.textTitle] object's property title. Default is not title,
 */
function ScaleControllers( folder, object, property, onChange, options ) {

	options = options || {};
	const dat = three$1.dat;
	var scaleController = folder.add( new ScaleController( function ( customController, action ) {

		var value = action( controller.getValue(), scaleController.getValue() );
		controller.setValue( value );
		onChange( value );

	},
		{

			getLanguageCode: options.getLanguageCode,
			settings: options.settings,

		} ) ).onChange( function ( value ) { scaleController.zoomMultiplier = value; } );
	var controller = dat.controllerZeroStep( folder, object, property, function ( value ) { onChange( value ); } );
	if ( options.text )
		dat.controllerNameAndTitle( controller, options.text, options.textTitle );

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

class PositionController extends controllers$1.CustomController {

	/**
	 * dat.GUI graphical user interface for control of the position of threejs 3D object.
	 * Base class <a href="../../dat.gui/CustomController/src/dat/controllers/CustomController.js" target="_blank">CustomController</a>
	 * @extends controllers.CustomController.
	 * @param {Event} onclickController
	 * @param {object} [options={}] the following options are available:
	 * @param {number} [options.settings={}] time settings.
	 * @param {number} [options.settings.offset=0.1] offset.
	 * @param {number} [options.min=0.1] Minimal offset.
	 * @param {number} [options.max=10] Maximal offset.
	 * @param {number} [options.step=0.1] step of offset.
	 * @param {Function} [options.getLanguageCode=language code of your browser] returns the "primary language" subtag of the version of the browser.
	 */
	constructor( onclickController, options ) {

		options = options || {};
		options.settings = options.settings || {}; 
		var settings = options.settings; 

		if ( options.min === undefined ) options.min = 0.1;
		if ( options.max === undefined ) options.max = 10;
		if ( settings.offset === undefined ) settings.offset = 0.1;
		if ( options.step === undefined ) options.step = 0.1;

		super( {

			offset: settings.offset,
			property: function ( customController ) {

				//Localization

				var lang = {

					//Position
					offset: 'Offset',
					add: 'add',
					subtract: 'subtract',
					wheelPosition: 'Scroll the mouse wheel to change the position',

				};

				var _languageCode = options.getLanguageCode === undefined ? 'en'//Default language is English
					: options.getLanguageCode();
				switch ( _languageCode ) {

					case 'ru'://Russian language

						//Position
						lang.offset = 'Сдвиг';
						lang.add = 'добавить';
						lang.subtract = 'вычесть';
						lang.wheelPosition = 'Прокрутите колесико мыши для изменения позиции';

						break;
					default://Custom language
						if ( ( options.lang === undefined ) || ( options.lang.languageCode != _languageCode ) )
							break;

						Object.keys( options.lang ).forEach( function ( key ) {

							if ( lang[key] === undefined )
								return;
							lang[key] = options.lang[key];

						} );

				}

				//

				var buttons = {}, addButton = UpDownController.addButton;
				buttons.Label = addButton( lang.offset, {

					title: lang.wheelPosition,
					onwheel: function ( delta ) {

						var shift = customController.controller.getValue();
						onclickController( delta > 0 ? shift : - shift );

					}

				} );
				buttons.in = addButton( '↑', {

					title: lang.add,
					onclick: function () {

						onclickController( customController.controller.getValue() );

					}

				} );
				buttons.out = addButton( '↓', {

					title: lang.subtract,
					onclick: function () {

						onclickController( - customController.controller.getValue() );

					}

				} );
				return buttons;

			},

		}, 'offset', options.min, options.max, options.step );
		if ( this.property === undefined )
			console.error( 'init() returns ' + this.property );

	}

}

/**
 * dat-gui JavaScript Controller Library
 * http://code.google.com/p/dat-gui
 *
 * Copyright 2011 Data Arts Team, Google Creative Lab
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */

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

function colorToString (color, forceCSSHex) {
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
  defaults: function defaults(target) {
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
  toArray: function toArray(obj) {
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

var INTERPRETATIONS = [
{
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
},
{
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
},
{
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
},
{
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







var get$1 = function get(object, property, receiver) {
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

var Color = function () {
  function Color() {
    classCallCheck(this, Color);
    this.__state = interpret.apply(this, arguments);
    if (this.__state === false) {
      throw new Error('Failed to interpret color arguments');
    }
    this.__state.a = this.__state.a || 1;
  }
  createClass(Color, [{
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
    classCallCheck(this, Controller);
    this.initialValue = object[property];
    this.domElement = document.createElement('div');
    this.object = object;
    this.property = property;
    this.__onChange = undefined;
    this.__onFinishChange = undefined;
  }
  createClass(Controller, [{
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
          evt.initMouseEvent(eventType, params.bubbles || false, params.cancelable || true, window, params.clickCount || 1, 0,
          0,
          clientX,
          clientY,
          false, false, false, false, 0, null);
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
  inherits(BooleanController, _Controller);
  function BooleanController(object, property) {
    classCallCheck(this, BooleanController);
    var _this2 = possibleConstructorReturn(this, (BooleanController.__proto__ || Object.getPrototypeOf(BooleanController)).call(this, object, property));
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
  createClass(BooleanController, [{
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
  inherits(OptionController, _Controller);
  function OptionController(object, property, opts) {
    classCallCheck(this, OptionController);
    var _this2 = possibleConstructorReturn(this, (OptionController.__proto__ || Object.getPrototypeOf(OptionController)).call(this, object, property));
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
  createClass(OptionController, [{
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
  inherits(StringController, _Controller);
  function StringController(object, property) {
    classCallCheck(this, StringController);
    var _this2 = possibleConstructorReturn(this, (StringController.__proto__ || Object.getPrototypeOf(StringController)).call(this, object, property));
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
  createClass(StringController, [{
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
  inherits(NumberController, _Controller);
  function NumberController(object, property, params) {
    classCallCheck(this, NumberController);
    var _this = possibleConstructorReturn(this, (NumberController.__proto__ || Object.getPrototypeOf(NumberController)).call(this, object, property));
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
  createClass(NumberController, [{
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
  inherits(NumberControllerBox, _NumberController);
  function NumberControllerBox(object, property, params) {
    classCallCheck(this, NumberControllerBox);
    var _this2 = possibleConstructorReturn(this, (NumberControllerBox.__proto__ || Object.getPrototypeOf(NumberControllerBox)).call(this, object, property, params));
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
  createClass(NumberControllerBox, [{
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
  inherits(NumberControllerSlider, _NumberController);
  function NumberControllerSlider(object, property, min, max, step, newBool) {
    classCallCheck(this, NumberControllerSlider);
    var _this2 = possibleConstructorReturn(this, (NumberControllerSlider.__proto__ || Object.getPrototypeOf(NumberControllerSlider)).call(this, object, property, { min: min, max: max, step: step }));
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
  createClass(NumberControllerSlider, [{
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
  inherits(FunctionController, _Controller);
  function FunctionController(object, property, text) {
    classCallCheck(this, FunctionController);
    var _this2 = possibleConstructorReturn(this, (FunctionController.__proto__ || Object.getPrototypeOf(FunctionController)).call(this, object, property));
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
  createClass(FunctionController, [{
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
    inherits(ColorController, _Controller);
    function ColorController(object, property) {
        classCallCheck(this, ColorController);
        var _this2 = possibleConstructorReturn(this, (ColorController.__proto__ || Object.getPrototypeOf(ColorController)).call(this, object, property));
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
        dom.bind(_this2.__selector, 'mousedown', function ()        {
            dom.addClass(this, 'drag').bind(window, 'mouseup', function ()        {
                dom.removeClass(_this.__selector, 'drag');
            });
        });
        dom.bind(_this2.__selector, 'touchstart', function ()        {
            dom.addClass(this, 'drag').bind(window, 'touchend', function ()        {
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
    createClass(ColorController, [{
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
  inherits(CustomController, _Controller);
  function CustomController(object, property) {
    classCallCheck(this, CustomController);
    var _this = possibleConstructorReturn(this, (CustomController.__proto__ || Object.getPrototypeOf(CustomController)).call(this, object, property));
    _this.arguments = {
      object: object, property: property, opts: Array.prototype.slice.call(arguments, 2)
    };
    if (object.property) _this.property = object.property(_this);
    return _this;
  }
  createClass(CustomController, [{
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
    } catch (e) {
    }
  }
};

var saveDialogContents = "<div id=\"dg-save\" class=\"dg dialogue\">\n\n  Here's the new load parameter for your <code>GUI</code>'s constructor:\n\n  <textarea id=\"dg-new-constructor\"></textarea>\n\n  <div id=\"dg-save-locally\">\n\n    <input id=\"dg-local-storage\" type=\"checkbox\"/> Automatically save\n    values to <code>localStorage</code> on exit.\n\n    <div id=\"dg-local-explain\">The values saved to <code>localStorage</code> will\n      override those passed to <code>dat.GUI</code>'s constructor. This makes it\n      easier to work incrementally, but <code>localStorage</code> is fragile,\n      and your friends may not see the same values you do.\n\n    </div>\n\n  </div>\n\n</div>";

function requestAnimationFrame$1(callback) {
  setTimeout(callback, 1000 / 60);
}
var requestAnimationFrame$1$1 = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || requestAnimationFrame$1;

var CenteredDiv = function () {
  function CenteredDiv() {
    classCallCheck(this, CenteredDiv);
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
  createClass(CenteredDiv, [{
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
  Object.defineProperties(this,
  {
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
Common.extend(GUI.prototype,
{
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
    if (this.load &&
    this.load.folders &&
    this.load.folders[name]) {
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
    if (this.load &&
    this.load.folders &&
    this.load.folders[folder.name]) {
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
  Common.extend(controller,                                   {
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
  if (customObject !== undefined && _typeof(customObject.property) === "object") {
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
    dom.addClass(li, _typeof(controller.getValue()));
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

/**
 * gets the position from the geometry.attributes.position of the object.
 * @param {THREE.Mesh} object
 * @param {number} index index of position in the object.geometry.attributes.position
 * @returns position
 */
function getObjectLocalPosition( object, index ) {

	const getPositionId = object.userData.myObject ? object.userData.myObject.guiPoints.getPositionId : undefined;
	if (getPositionId) index = getPositionId(index);
	const THREE = three$1.THREE,
		geometry = object.geometry,
		attributesPosition = geometry.attributes.position,
		itemSize = attributesPosition.itemSize,
		position = itemSize >= 4 ? new THREE.Vector4( 0, 0, 0, 0 ) : new THREE.Vector3(),
		drawRange = object.geometry.drawRange,
		offset = index * itemSize;
	if ( geometry.index === null ) {
		
		//Отображаются вершины
/*		
		let sError;
		if ( geometry.index === null ) {
			if ( ( drawRange.count != Infinity ) && ( ( index < drawRange.start ) || ( index >= ( drawRange.start + drawRange.count ) ) ) )
				sError = '';
		} else if ( ( drawRange.count != Infinity ) && ( ( offset < drawRange.start ) || ( offset >= ( drawRange.start + drawRange.count ) ) ) ){
			
			sError = '. offset = ' + offset;
	
		}
		if ( sError != undefined ) console.error( 'getObjectLocalPosition: index = ' + index + sError + ' is out of range = { start: ' + drawRange.start + ', count: ' + drawRange.count + ' }' );
*/		
		if ( ( drawRange.count != Infinity ) && ( ( index < drawRange.start ) || ( index >= ( drawRange.start + drawRange.count ) ) ) )
			console.error( 'getObjectLocalPosition: index = ' + index + ' is out of range = { start: ' + drawRange.start + ', count: ' + drawRange.count + ' }' );
		
	}
	position.fromArray( attributesPosition.array, offset );
	return position;

}

/**
 * gets position of the vector in world coordinates, taking into account the position, scale and rotation of the 3D object
 * @param {THREE.Object3D} object
 * @param {THREE.Vector3} pos local position
 * @returns world position 
 */
function getWorldPosition( object, pos ) {

	const THREE = three$1.THREE;
	var position = pos.clone();

	/*
		//https://stackoverflow.com/questions/11495089/how-to-get-the-absolute-position-of-a-vertex-in-three-js
		//Неудачная попытка вычислить абсолютную позицию точки
		object.updateMatrixWorld();
		position.applyMatrix4( object.matrixWorld );
	*/
	function getPosition( object, pos ) {

		var position = new THREE.Vector3(),
			positionAngle = new THREE.Vector3();
		position = pos.clone();
		position.multiply( object.scale );

		//rotation
		positionAngle.copy( position );
		positionAngle.applyEuler( object.rotation );
		position.x = positionAngle.x;
		position.y = positionAngle.y;
		position.z = positionAngle.z;

		position.add( object.position );
		return position;

	}
	do {

		position = getPosition( object, position );
		object = object.parent;

	} while ( object && object.parent );
	return position;

}

/**
 * gets the position from the geometry.attributes.position of the object in world coordinates.
 * @param {THREE.Mesh} object
 * @param {number} index index of position in the object.geometry.attributes.position
 * @returns position
 */
function getObjectPosition( object, index ) {

	if ( index === -1 )
		return undefined;
	if ( index === undefined )
		return object.position;
	return getWorldPosition( object, getObjectLocalPosition( object, index ) )
//	return getWorldPosition( object, getObjectLocalPosition( object, object.userData.myObject.guiPoints.getPositionId(index) ) )

}

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

const optionsStyle$1 = {

	tag: 'style'

};

//Thanks to https://stackoverflow.com/a/27369985/5175935
//Такая же функция есть в frustumPoints.js но если ее использовать то она будет возвращать путь на frustumPoints.js
const getCurrentScript$2 = function () {

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
const getCurrentScriptPath$2 = function () {
	const script = getCurrentScript$2(),
		path = script.substring( 0, script.lastIndexOf( '/' ) );
	return path;
};
const currentScriptPath$2 = getCurrentScriptPath$2();

loadScript.sync( currentScriptPath$2 + '/colorpicker.css', optionsStyle$1 );

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

}
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
 * @param {Object} options load an object from cookie into options.
 * @param {Object} [optionsDefault=options] copy to options this default object if named object is not exists in the cookie.
 */
function getObject( name, options, optionsDefault ) {

	//uncompatible with ND build
	//optionsDefault ||= options;
	
	if (optionsDefault === undefined) optionsDefault = options;
	new defaultCookie().getObject( name, options, copyObject( name, optionsDefault ) );

}
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
	var cookie_date = new Date();
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
				if (
					(option !== undefined) &&
					(typeof option !== 'function') &&
					
					//Ключь со значением Infinity превращается в null во время JSON преобразования.
					//Для проверки надо установить options.playerOptions.interval = Infinity
					//Поэтому оставляем старое значение options[key] = Infinity
					(option != null)
				)
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

		};

		/**
		 * Default cookie is not saving object's settings
		 */
		this.setObject = function () {

		};

		this.isTrue = function (defaultValue) {

			return defaultValue;

		};

	}

}

var cookie = /*#__PURE__*/Object.freeze({
  __proto__: null,
  isEnabled: isEnabled,
  set: set,
  setObject: setObject,
  get: get,
  getObject: getObject,
  copyObject: copyObject,
  remove: remove,
  defaultCookie: defaultCookie
});

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
function getLanguageCode() {

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

/**
 * @callback onFullScreenToggle
 * @param {boolean} fullScreen false - full screen mode of the canvas.
 */

/**
 * @class creates functions for resize of the canvas to fullscreen and restore to default size.
 * @param {THREE} THREE [THREE]{@link https://threejs.org/}
 * @param {THREE.WebGLRenderer} renderer [WebGLRenderer]{@link https://threejs.org/docs/index.html#api/en/renderers/WebGLRenderer}
 * @param {THREE.PerspectiveCamera} camera [PerspectiveCamera]{@link https://threejs.org/docs/index.html#api/en/cameras/PerspectiveCamera}
 * @param {object} options the following options are available:
 * @param {CanvasMenu} [options.canvasMenu] <a href="../../canvasMenu/jsdoc/index.html" target="_blank">CanvasMenu</a>
 * @param {StereoEffect} [options.stereoEffect] <a href="../../StereoEffect/jsdoc/index.html" target="_blank">StereoEffect</a> instance.
 * @param {object} [options.fullScreen] followed fullScreen methods available:
 * @param {onFullScreenToggle} [options.fullScreen.onFullScreenToggle] user toggled fullscreen mode of the canvas.
 */
function CreateFullScreenSettings( THREE, renderer, camera, options ) {

	var fullScreen = false, canvasMenu, stereoEffect;

	options.fullScreen = options.fullScreen || {};
	if ( options.canvasMenu ) canvasMenu = options.canvasMenu;
	if ( options.stereoEffect ) stereoEffect = options.stereoEffect;
	renderer.setSize( renderer.domElement.width, renderer.domElement.height );

	var style;

	/**
	 * @returns <b>true</b> if <b>canvas</b> is full screen.
	 */
	this.isFullScreen = function () { return fullScreen; };
	/**
	 * @param {StereoEffect} _stereoEffect <a href="../../StereoEffect/jsdoc/index.html" target="_blank">StereoEffect</a>.
	 */
	this.setStereoEffect = function ( _stereoEffect ) { stereoEffect = _stereoEffect; };
	/**
	 * Sets the full screen of the canvas.
	 * @param {boolean} [fullScreen=false] false - full screen of the canvas.
	 * @param {boolean} [boTimeout=false] true - set fullScreen after 0 msec timeout.
	 */
	this.setFullScreen = function ( fs = false, boTimeout = false ) {

		setTimeout( function () {

			//Если на веб странице один MyThree то по умолчанию он на всю страницу.
			//Если на веб странице больше одного MyThree то по умолчанию все MyThree не на всю страницу.
			//В противном случае если несколько MyThree на всю страницу то они будут накладываться друг на друга 
			//между ними произойдет путаница
			if ( boTimeout && options.fullScreen.arrayContainersLength && ( options.fullScreen.arrayContainersLength() > 1 ) )
				fs = true;
			const size = new THREE.Vector2();
			renderer.getSize( size );
			fullScreen = fs;
			if ( fullScreen ) {

				if ( style !== undefined ) {

					//restore size of the canvas
					renderer.setSize( style.sizeOriginal.x, style.sizeOriginal.y );
					renderer.domElement.style.position = style.position;
					renderer.domElement.style.left = style.left;
					renderer.domElement.style.top = style.top;
					renderer.domElement.style.width = style.width;
					renderer.domElement.style.height = style.height;

				}

			} else {

				if ( style === undefined ) {

					style = {

						sizeOriginal: new THREE.Vector2(),
						position: renderer.domElement.style.position,
						left: renderer.domElement.style.left,
						top: renderer.domElement.style.top,
						width: renderer.domElement.style.width,
						height: renderer.domElement.style.height,

					};
					renderer.getSize( style.sizeOriginal );
				}

				//Full screen of the canvas
				renderer.setSize( window.innerWidth, window.innerHeight );
				renderer.domElement.style.position = 'fixed';
				renderer.domElement.style.left = 0;
				renderer.domElement.style.top = 0;
				renderer.domElement.style.width = '100%';
				renderer.domElement.style.height = '100%';

			}

			if ( options.fullScreen.onFullScreenToggle !== undefined ) options.fullScreen.onFullScreenToggle( fullScreen );

			camera.aspect = size.x / size.y;
			camera.updateProjectionMatrix();
			fullScreen = !fullScreen;
			if ( canvasMenu && canvasMenu.setFullScreenButton ) canvasMenu.setFullScreenButton( fullScreen );
			CreateFullScreenSettings.RendererSetSize( renderer, options.canvasMenu );

		}, 0 );

	};
	/**
	 * User has clicked the "Full Screen" button on the <a href="../../canvasMenu/jsdoc/index.html" target="_blank">CanvasMenu</a>.
	 * @event
	 */
	this.onclick = function () {

		if (
			( stereoEffect !== undefined )
			&& ( parseInt( stereoEffect.settings.spatialMultiplex ) !== StereoEffect.spatialMultiplexsIndexs.Mono )
		) {

			stereoEffect.settings.spatialMultiplex = StereoEffect.spatialMultiplexsIndexs.Mono;

		}

		this.setFullScreen( fullScreen );
		return fullScreen;

	};

}
/** @namespace
 * @description set size of renderer.
 * @param {THREE.WebGLRenderer} renderer [THREE.WebGLRenderer]{@link https://threejs.org/docs/index.html#api/en/renderers/WebGLRenderer}.
 * @param {CanvasMenu} canvasMenu <a href="../../canvasMenu/jsdoc/index.html" target="_blank">CanvasMenu</a>
 */
CreateFullScreenSettings.RendererSetSize = function ( renderer, canvasMenu ){

	if ( renderer.setSizeOld )
		return;
		
	renderer.setSizeOld = renderer.setSize;
	renderer.setSize = function ( width, height, updateStyle ) {

		renderer.setSizeOld( width, height, updateStyle );
		const elCanvas = renderer.domElement, elContainer = elCanvas.parentElement;

		setTimeout( function () {

			elContainer.style.height = elCanvas.style.height;
			elContainer.style.width = elCanvas.style.width;
			elContainer.style.left = elCanvas.style.left;
			elContainer.style.top = elCanvas.style.top;
			elContainer.style.position = elCanvas.style.position;
			if ( canvasMenu ) canvasMenu.setSize( width, height );

		}, 0 );

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

/**
 * A sprite based text component.
 * @param {string|number} text The text to be displayed on the sprite. You can include a multiline text separated by "\r\n".
 * @param {THREE.Vector3} [position=new THREE.Vector3()] Position of the text.
 * @param {options} [options={}] the following options are available
 * @param {string} [options.name] Name of the <b>SpriteText</b> instance.
 * @param {THREE.Group} [options.group] Parent group of the SpriteText with common options.
 * See {@link https://github.com/anhr/SpriteText#groupuserdataoptionsspritetext---common-options-for-the-group-of-the-spritetext|common options for the group of the SpriteText}.
 * Default is undefined.
 * @param {number} [options.textHeight=0.04] The height of the text.
 * @param {number} [options.fov] Camera frustum vertical field of view, from bottom to top of view, in degrees.
 * {@link https://threejs.org/docs/index.html#api/en/cameras/PerspectiveCamera.fov|PerspectiveCamera.fov}
 * Set the fov option as camera.fov if you want to see text size is independent from camera.fov. The text height will be calculated as textHeight = fov * textHeight / 50
 * Default is undefined.
 * @param {boolean} [options.sizeAttenuation=false] Whether the size of the sprite is attenuated by the camera depth. (Perspective camera only.)
 * See {@link https://threejs.org/docs/index.html#api/en/materials/SpriteMaterial.sizeAttenuation|SpriteMaterial.sizeAttenuation}
 * @param {number} [options.rotation=0] The rotation of the sprite in radians.
 * See {@link https://threejs.org/docs/index.html#api/en/materials/SpriteMaterial.rotation|SpriteMaterial.rotation}
 * @param {string} [options.fontFace='Arial'] CSS font-family - specifies the font of the text.
 * @param {string[]} [options.fontFaces] array of fontFaces. Example ['Arial', 'Verdana', 'Times'].
 * @param {string} [options.fontColor='rgba(255, 255, 255, 1)'] RGBA object or RGB object or HEX value.
 *	Examples 'rgba(0, 0, 255, 0.5)', '#00FF00'.
 * @param {boolean} [options.bold=false] CSS font-weight. Equivalent of 700.
 * @param {boolean} [options.italic=false] CSS font-style.
 * @param {string} [options.fontProperties] Other font properties. The font property uses the same syntax as the CSS font property.
 * 	Default is empty string. Example "900", "oblique lighter".
 * @param {options} [options.rect={}] rectangle around the text.
 * @param {boolean} [options.rect.displayRect=false] true - the rectangle around the text is visible.
 * @param {string} [options.rect.backgroundColor='rgba(0, 0, 0, 0)' - black transparent] background color. RGBA object or RGB object or HEX value
 * <pre>
 * 	Examples 'rgba(0, 0, 255, 0.5)', '#00FF00'.
 * </pre>
 * @param {string} [options.rect.borderColor] border color. RGBA object or RGB object or HEX value. Default is same as options.fontColor 'rgba(255, 255, 255, 1)' - white.
 * @param {number} [options.rect.borderThickness=0 is invisible border] border thickness.
 * @param {number} [options.rect.borderRadius=0 is no radius] border corners radius.
 * @param {THREE.Vector2|object} [options.center] If <b>center.x</b> and <b>center.y</b> is defined, then it the text's anchor point.
 * <pre>
 * See {@link https://threejs.org/docs/index.html#api/en/objects/Sprite.center|Sprite.center}
 * 	A value of (0.5, 0.5) corresponds to the midpoint of the text.
 * 	A value of (0, 0) corresponds to the left lower corner of the text.
 * 	A value of (0, 1) corresponds to the left upper corner of the text.
 * 	
 * Otherwise, the center is calculated so that the text is always inside the canvas.
 * Please define <b>center.camera</b> and <b>center.canvas</b> for it. See below for details.
 * 
 * If <b>options.center</b> is not defined, center is left upper corner: <b>new THREE.Vector2( 0, 1 )</b>
 * </pre>
 * @param {THREE.PerspectiveCamera} [center.camera] [PerspectiveCamera]{@link https://threejs.org/docs/index.html#api/en/cameras/PerspectiveCamera}
 * @param {HTMLElement} [center.canvas] <b>canvas</b> element.
 * @see Thanks to {@link https://github.com/vasturiano/three-spritetext|three-spritetext}
 */
function SpriteText$1( text, position,	options = {} ) {

	if ( typeof text === 'number' ) text = text.toString();
	text = text.replaceAll( '\t', '  ' );
	
	const THREE = three$1.THREE;

	position = position || new THREE.Vector3( 0, 0, 0 );

	const sprite = new THREE.Sprite( new THREE.SpriteMaterial( {

		map: new THREE.Texture(),
		sizeAttenuation: options.sizeAttenuation !== undefined ? options.sizeAttenuation :
			false,//The size of the sprite is not attenuated by the camera depth. (Perspective camera only.)

	} ) );
	const canvas = document.createElement( 'canvas' );
	sprite.material.map.minFilter = THREE.LinearFilter;
	const fontSize = 90;
	const context = canvas.getContext( '2d' );

	if ( options.name ) sprite.name = options.name;

	sprite.userData.update = function ( /*optionsUpdate*/ ) {

		const optionsUpdate = {};
		if ( sprite.parent )
			updateOptions( sprite.parent, optionsUpdate );
		else if ( options.group )
			updateOptions( options.group, optionsUpdate );
		var textHeight = options.textHeight || optionsUpdate.textHeight || 0.04;
		const fov = options.fov || optionsUpdate.fov,
			sizeAttenuation = options.sizeAttenuation || optionsUpdate.sizeAttenuation || false,
			rotation = options.rotation || optionsUpdate.rotation || 0,
			fontFace = options.fontFace || optionsUpdate.fontFace || 'Arial',
			bold = options.bold || optionsUpdate.bold || false,
			italic = options.italic || optionsUpdate.italic || false,
			fontProperties = options.fontProperties || optionsUpdate.fontProperties || '',
			rect = options.rect || optionsUpdate.rect || {},
			color = 'rgba(255, 255, 255, 1)',
			fontColor = options.fontColor || optionsUpdate.fontColor || color,
			center = SpriteText$1.getCenter( options.center || optionsUpdate.center, position );
			
		if ( fov !== undefined )
			textHeight = fov * textHeight / 50;

		rect.displayRect = rect.displayRect || false;
		const borderThickness = rect.borderThickness ? rect.borderThickness : 5,
			font = `${fontProperties}${bold ? 'bold ' : ''}${italic ? 'italic ' : ''}${fontSize}px ${fontFace}`;

		context.font = font;

		var width = 0, linesCount = 1,
			lines;
		if ( typeof text === 'string' ) {

			linesCount = 0;
			lines = text.split( /\r\n|\r|\n/ );
			lines.forEach( function ( line ) {

				var lineWidth = context.measureText( line ).width;
				if ( width < lineWidth )
					width = lineWidth;
				linesCount += 1;

			} );

		} else width = context.measureText( text ).width;

		width += borderThickness * 2;

		const textWidth = width;
		canvas.width = textWidth;
		canvas.height = fontSize * linesCount + borderThickness * 2;

		context.font = font;

		//Rect
		//Thanks to http://stemkoski.github.io/Three.js/Sprite-Text-Labels.html
		if ( rect.displayRect ) {

			// background color
			context.fillStyle = rect.backgroundColor ? rect.backgroundColor : 'rgba(0, 0, 0, 1)';

			// border color
			context.strokeStyle = rect.borderColor ? rect.borderColor : fontColor;

			context.lineWidth = borderThickness;

			// function for drawing rounded rectangles
			function roundRect( ctx, x, y, w, h, r ) {

				ctx.beginPath();
				ctx.moveTo( x + r, y );
				ctx.lineTo( x + w - r, y );
				ctx.quadraticCurveTo( x + w, y, x + w, y + r );
				ctx.lineTo( x + w, y + h - r );
				ctx.quadraticCurveTo( x + w, y + h, x + w - r, y + h );
				ctx.lineTo( x + r, y + h );
				ctx.quadraticCurveTo( x, y + h, x, y + h - r );
				ctx.lineTo( x, y + r );
				ctx.quadraticCurveTo( x, y, x + r, y );
				ctx.closePath();
				ctx.fill();
				ctx.stroke();

			}
			roundRect( context,
				borderThickness / 2,
				borderThickness / 2,
				canvas.width - borderThickness,
				canvas.height - borderThickness,
				rect.borderRadius === undefined ? 0 : rect.borderRadius
			);

		}

		context.fillStyle = fontColor;
		context.textBaseline = 'bottom';
		if ( linesCount > 1 ) {
			for ( var i = 0; i < lines.length; i++ ) {

				const line = lines[i];
				context.fillText( line, borderThickness, canvas.height - ( ( lines.length - i - 1 ) * fontSize ) - borderThickness );

			}

		} else context.fillText( text, borderThickness, canvas.height - borderThickness );

		// Inject canvas into sprite
		sprite.material.map.image = canvas;
		sprite.material.map.needsUpdate = true;

		const th = textHeight * linesCount;// * angleDistance;
		sprite.scale.set( th * canvas.width / canvas.height, th );
		sprite.position.copy( position );
		sprite.center = center;

		//size attenuation. Whether the size of the sprite is attenuated by the camera depth. (Perspective camera only.) Default is false.
		//See https://threejs.org/docs/index.html#api/en/materials/SpriteMaterial.sizeAttenuation
		sprite.material.sizeAttenuation = sizeAttenuation;

		sprite.material.rotation = rotation;
		sprite.material.needsUpdate = true;

	};
	sprite.userData.update();

	sprite.userData.updateText = function ( _text ) {

		text = _text;
		const options = {};
		updateOptions( sprite.parent, options );
		sprite.userData.update( options );

	};
	if ( options.group ) options.group.add( sprite );
	else if ( three$1.group ) three$1.group.add( sprite );
	else if ( three$1.scene ) three$1.scene.add( sprite );

	sprite.userData.optionsSpriteText = options;

	return sprite;

}
/**
 * @namespace
 * @description Returns {@link https://threejs.org/docs/index.html#api/en/objects/Sprite.center|center}
 * @param {THREE.Vector2|object} center If <b>center.x</b> and <b>center.y</b> is defined, then it the text's anchor point.
 * <pre>
 * Otherwise, the center is calculated so that the text is always inside the canvas.
 * Please define <b>center.camera</b> and <b>center.canvas</b> for it. See below for details.
 * </pre>
 * @param {THREE.PerspectiveCamera} [center.camera] [PerspectiveCamera]{@link https://threejs.org/docs/index.html#api/en/cameras/PerspectiveCamera}
 * @param {HTMLElement} [center.canvas] <b>canvas</b> element.
 * @param {THREE.Vector3} [position] Position of the text. Uses only if <b>center.camera</b> and <b>center.canvas</b> is defined
 * @returns center. If <b>center</b> is not defined, returns the left upper corner: <b>new THREE.Vector2( 0, 1 )</b>;
 */
SpriteText$1.getCenter = function ( center = {}, position ) {

	const THREE = three$1.THREE;
	const canvas = center.canvas ? center.canvas : undefined;
	/**
	 * Converting World coordinates to Screen coordinates
	 * https://stackoverflow.com/questions/11586527/converting-world-coordinates-to-screen-coordinates-in-three-js-using-projection
	 */
	function worldToScreen() {

		const width = canvas.width, height = canvas.height,
			widthHalf = width / 2, heightHalf = height / 2;
//			pos = position.clone();
		const pos = new THREE.Vector3().copy( position );
		pos.project( center.camera );
		pos.x = ( pos.x * widthHalf ) + widthHalf;
		pos.y = - ( pos.y * heightHalf ) + heightHalf;
		return pos;

	}
	const screenPos = center.canvas ? worldToScreen() : undefined;
	return center instanceof THREE.Vector2 ||
		( ( typeof center === "object" ) && ( center.x !== undefined ) && ( center.y !== undefined )//При копироваении и при чтении из cockie THREE.Vector2 превращается в Object{x: x, y: y}
		) ? center : screenPos ?
			new THREE.Vector2( screenPos.x < ( canvas.width / 2 ) ? 0 : 1, screenPos.y < ( canvas.height / 2 ) ? 1 : 0 ) :
			new THREE.Vector2( 0, 1 );//Default is left upper corner

};

function updateOptions( group, options ) {

	if ( group.userData.optionsSpriteText )
		Object.keys( group.userData.optionsSpriteText ).forEach( function ( key ) {

			if ( options[key] === undefined )//Child options have more priority before parent options
				options[key] = group.userData.optionsSpriteText[key];

		} );
	while ( group.parent ) {

		group = group.parent;
		updateOptions( group, options );

	}

}

/**
 * @namespace
 * @description Call <b>SpriteText.updateSpriteTextGroup</b> if you want to update of the <b>options</b> of all <a href="module-SpriteText.html" target="_blank">SpriteText</a>, added in to <b>group</b> and all <b>child groups</b>.
 * @param {THREE.Group|THREE.Scene} group [group]{@link https://threejs.org/docs/index.html?q=gr#api/en/objects/Group} or [scene]{@link https://threejs.org/docs/index.html?q=sce#api/en/scenes/Scene} of the <b>SpriteText</b> and of all <b>child groups</b> of the <b>SpriteText</b> for which these settings will have an effect.
 * @example
<script>
	optionsSpriteText = {

		textHeight: 0.1,
		sizeAttenuation: false,

	}
	const fSpriteTextAll = SpriteTextGui( scene, options, {

		settings: { zoomMultiplier: 1.5, },
		options: optionsSpriteText

	} );

	//Change of the text height
	optionsSpriteText.textHeight = 0.2;

	//update of the options of all SpriteText, added in to group and all child groups
	SpriteText.updateSpriteTextGroup( group );

	//To do something...

	//Restore options.textHeight to 0.1
	fSpriteTextAll.userData.restore();
</script>
*/
SpriteText$1.updateSpriteTextGroup = function( group ) {

	const THREE = three$1.THREE;
	group.children.forEach( function ( spriteItem ) {

		if ( spriteItem instanceof THREE.Sprite ) {

			if ( spriteItem.userData.update !== undefined )
				spriteItem.userData.update();

		} //else if ( spriteItem instanceof THREE.Group )
			SpriteText$1.updateSpriteTextGroup( spriteItem );

	} );

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

class StereoEffect {

	/**
	 * @class
	 * Uses dual PerspectiveCameras for [Parallax Barrier]{@link https://en.wikipedia.org/wiki/Parallax_barrier} effects.
	 * @param {THREE.WebGLRenderer} renderer {@link https://threejs.org/docs/#api/en/renderers/WebGLRenderer|WebGL renderer}
	 * @param {Options} [options=new Options()] <a href="../../jsdoc/Options/Options.html" target="_blank">Options</a> instance.
	 * See <b>options</b> parameter of <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
	 * @param {Function} [options.getLanguageCode=language code of your browser] Your custom getLanguageCode() function.
	 * <pre>
	 * returns the "primary language" subtag of the language version of the browser.
	 * Examples: "en" - English language, "ru" Russian.
	 * See the {@link https://tools.ietf.org/html/rfc4646#section-2.1|Syntax} paragraph of RFC 4646 for details.
	 * </pre>
	 * @param {Object} [options.lang] Object with localized language values.
	 * @param {boolean} [options.dat.cookie] false - do not save to cookie the StereoEffects  settings
	 * @param {string} [options.dat.cookieName] Name of the cookie is "StereoEffect" + options.dat.cookieName.
	 * @param {boolean|Object} [options.stereoEffect] false - do not create a <b>StereoEffect</b> instance.
	 * <p>Or:</p>
	 * @param {number} [options.stereoEffect.spatialMultiplex=spatialMultiplexsIndexs.Mono] spatial multiplex
	 * <pre>
	 * See {@link https://en.wikipedia.org/wiki/DVB_3D-TV|DVB 3D-TV} for details
	 * 	Available values
	 *
	 * 		spatialMultiplexsIndexs.Mono - no stereo effacts
	 *
	 * 		spatialMultiplexsIndexs.SbS - 'Side by side' format just put the left and right images one next to the other.
	 * 			See https://en.wikipedia.org/wiki/DVB_3D-TV#Side_by_side for dretails
	 *
	 * 		spatialMultiplexsIndexs.TaB - 'Top and bottom' format put left and right images one above the other.
	 * 			See //https://en.wikipedia.org/wiki/DVB_3D-TV#Top_and_bottom for details
	 *
	 * 	Example - options.stereoEffect.spatialMultiplex: StereoEffect.spatialMultiplexsIndexs.Mono
	 * </pre>
	 * @param {THREE.PerspectiveCamera} [options.stereoEffect.camera] [PerspectiveCamera]{@link https://threejs.org/docs/index.html#api/en/cameras/PerspectiveCamera}. Use the <b>camera</b> key if you want control cameras focus.
	 * @param {Float} [options.stereoEffect.far=10] Camera frustum far plane. The <b>far</b> key uses for correct calculation default values of Eye separation.
	 * See <b>far</b> parameter of the [PerspectiveCamera]{@link https://threejs.org/docs/index.html?q=PerspectiveCamera#api/en/cameras/PerspectiveCamera.far}
	 * @param {Float} [options.stereoEffect.eyeSep=( new THREE.StereoCamera().eyeSep / 10 ) * options.stereoEffect.far] Eye separation.
	 * See [StereoCamera.eyeSep]{@link https://threejs.org/docs/index.html?q=StereoCamera#api/en/cameras/StereoCamera.eyeSep}.
	 * @param {Float} [options.stereoEffect.stereoAspect=1] [THREE.StereoCamera.aspect]{@link https://threejs.org/docs/index.html?q=StereoCamera#api/en/cameras/StereoCamera.aspect}. Camera frustum aspect ratio.
	 * @param {boolean} [options.stereoEffect.rememberSize] true - remember default size of the canvas. Resize of the canvas to full screen for stereo mode and restore to default size if no stereo effacts.
	 * @param {HTMLElement} [options.stereoEffect.elParent] parent of the canvas.
	 * Use only if you use {@link https://threejs.org/docs/index.html#api/en/core/Raycaster|THREE.Raycaster} (working out what objects in the 3d space the mouse is over)
	 * and your canvas is not full screen.
	 */
	constructor( renderer, options = new Options$1() ) {

		if ( !renderer ) {

			console.error( 'StereoEffect: renderer = ' + renderer );
			return;

		}

		if ( !options.boOptions ) {

			options = new Options$1( options );

		}
		if ( options.stereoEffect === false ) return;

		if( options.dat.gui ) options.dat.mouseenter = false;//true - мышка находится над gui или canvasMenu
				//В этом случае не надо обрабатывать событие elContainer 'pointerdown'
				//по которому выбирается точка на canvas.
				//В противном случае если пользователь щелкнет на gui, то он может случайно выбрать точку на canvas.
				//Тогда открывается папка Meshes и все органы управления сдвигаются вниз. Это неудобно.
				//И вообще нехорошо когда выбирается точка когда пользователь не хочет это делать.

		const THREE = three$1.THREE;
		assign$1();

		if ( !options.stereoEffect ) options.stereoEffect = {};

		const settings = options.stereoEffect;
		/**
		 * See <b>options.stereoEffect</b> parameter of the <b>StereoEffect</b> class above.
		 * */
		this.settings = settings;
		/**
		 * See <b>options</b> parameter of the <b>StereoEffect</b> class above.
		 * */
		this.options = options;

		options.stereoEffect = this;

		//Убрал spatialMultiplex: settings.spatialMultiplex !== undefined ? settings.spatialMultiplex : spatialMultiplexsIndexs.Mono,//SbS,
		//из const optionsDefault
		//Потому что будет ошибка 
		//THREE.StereoEffect.render: Invalid "Spatial  multiplex" parameter: NaN
		//если в приложении не используется StereoEffect.gui
		//и не определен settings.spatialMultiplex
		if ( settings.spatialMultiplex === undefined ) settings.spatialMultiplex = spatialMultiplexsIndexs.Mono;//SbS

		settings.stereo = new THREE.StereoCamera();
		settings.stereo.aspect = settings.stereoAspect || 1;//0.5;
		if ( settings.far === undefined )
			settings.far = new THREE.PerspectiveCamera().focus;
		settings.focus = settings.camera === undefined ? new THREE.PerspectiveCamera().focus :
			new THREE.Vector3().distanceTo( settings.camera.position );
		settings.zeroParallax = 0;
		settings.eyeSep = settings.eyeSep || ( new THREE.StereoCamera().eyeSep / 10 ) * settings.far;
		if ( settings.camera !== undefined )
			settings.camera.focus = settings.focus;

		/**
		 * Sets eye separation.
		 * @param {any} eyeSep See <b>options.stereoEffect.eyeSep</b> parameter of the <b>StereoEffect</b> class above.
		 */
		this.setEyeSeparation = function ( eyeSep ) {

			settings.stereo.eyeSep = eyeSep;

		};

		this.setEyeSeparation( settings.eyeSep );

		/**
		 * Convert mouse position to renderer coordinates.
		 * @returns <pre>
		 * {
		 *
		 *	getMousePosition:function
		 *
		 * }
		 * </pre>
		 */
		this.getRendererSize = function () {

			return Options$1.raycaster.EventListeners.getRendererSize( renderer, settings.elParent );

		};
		var fullScreenSettings;
		var spatialMultiplexCur;
		/**
		 * Render a scene or another type of object using a camera.
		 * @see [WebGLRenderer.render]{@link https://threejs.org/docs/index.html?q=WebGLRenderer#api/en/renderers/WebGLRenderer.render}
		 * @param {THREE.Scene} scene [Scene]{@link https://threejs.org/docs/index.html#api/en/scenes/Scene}.
		 * @param {THREE.Camera} camera [PerspectiveCamera]{@link https://threejs.org/docs/index.html?q=persp#api/en/cameras/PerspectiveCamera}.
		 */
		this.render = function ( scene, camera ) {

			const spatialMultiplex = parseInt( settings.spatialMultiplex );

			if ( settings.rememberSize && !fullScreenSettings ) {

				if ( _canvasMenu && _canvasMenu.getFullScreenSettings )
					fullScreenSettings = _canvasMenu.getFullScreenSettings( this );
				else fullScreenSettings = new CreateFullScreenSettings( THREE, renderer, camera,
					{
						canvasMenu: _canvasMenu,
						stereoEffect: this,

					} );

			}

			scene.updateMatrixWorld();

			if ( camera.parent === null ) camera.updateMatrixWorld();

			const size = new THREE.Vector2();
			renderer.getSize( size );

			if ( renderer.autoClear ) renderer.clear();
			renderer.setScissorTest( true );

			var xL, yL, widthL, heightL,
				xR, yR, widthR, heightR;
			const parallax = settings.zeroParallax;
			function setMultiplex( stereoEffect ) {

				if ( !fullScreenSettings || ( spatialMultiplexCur === spatialMultiplex ) )
					return false;
				spatialMultiplexCur = spatialMultiplex;
				if ( stereoEffect.setControllerSpatialMultiplex ) stereoEffect.setControllerSpatialMultiplex( spatialMultiplex );
				else if ( stereoEffect.setSpatialMultiplex ) stereoEffect.setSpatialMultiplex( spatialMultiplex );
				return true;

			}
			function setFullScreen( fullScreen, stereoEffect ) {

				if ( setMultiplex( stereoEffect ) )
					fullScreenSettings.setFullScreen( fullScreen );

			}

			switch ( spatialMultiplex ) {

				case spatialMultiplexsIndexs.Mono://Mono

					renderer.setScissor( 0, 0, size.width, size.height );
					renderer.setViewport( 0, 0, size.width, size.height );
					renderer.render( scene, camera );
					renderer.setScissorTest( false );

					//если оствить setFullScreen то canvas не перейдет в full screen
					//если в программе по умолчанию был задан full screen и используется canvasMenu
					//Для провероки
					//в файле "D:\My documents\MyProjects\webgl\three.js\GitHub\commonNodeJS\master\myThree\Examples\html\index.html"
					//	для new MyThree(...)
					//		установить canvasMenu: true,
					//		убрать canvas: { fullScreen: false, }. Тоесть по умолчанию canvas перейдет в full screen
					//открыть http://localhost/anhr/commonNodeJS/master/myThree/Examples/html/

					//setFullScreen( true, this );

					//если оставить setFullScreen то canvas не перейдет в full screen
					//если убрать setFullScreen то canvas перейдет в full screen
					//но тогда будет неправильно выбираться пункт меню stereo Effects в canvasMenu в случае, если 
					//Выбрать пункт "слева направо" меню stereo Effects в canvasMenu.
					//	включится стерео режим.
					//	canvas перейдет в full screen.
					//Выбрать пункт "Восстановить размеры экрана" меню stereo Effects в canvasMenu.
					//	canvas выйдет из full screen.
					//	стерео режим отключится
					//	НО! ОСТАНЕТСЯ ВЫБРАННЫМ пункт "слева направо" меню stereo Effects в canvasMenu.
					//Для решения проблемы вставил строку ниже

					if ( options.canvasMenu ) setMultiplex( this );
					else setFullScreen( true, this );

					//Теперь в режиме full screen при выборе пункта "Моно" меню stereo Effects в canvasMenu
					//canvas не выходит из full screen. Ну и фиг с ним.

					return;

				case spatialMultiplexsIndexs.SbS://'Side by side'

					const _width = size.width / 2;

					xL = 0 + parallax; yL = 0; widthL = _width; heightL = size.height;
					xR = _width - parallax; yR = 0; widthR = _width; heightR = size.height;

					setFullScreen( false, this );

					break;

				case spatialMultiplexsIndexs.TaB://'Top and bottom'

					xL = 0 + parallax; yL = 0; widthL = size.width; heightL = size.height / 2;
					xR = 0 - parallax; yR = size.height / 2; widthR = size.width; heightR = size.height / 2;

					setFullScreen( false, this );

					break;
				default: console.error( 'THREE.StereoEffect.render: Invalid "Spatial  multiplex" parameter: ' + spatialMultiplex );

			}

			settings.stereo.update( camera );

			renderer.setScissor( xL, yL, widthL, heightL );
			renderer.setViewport( xL, yL, widthL, heightL );
			renderer.render( scene, settings.stereo.cameraL );

			renderer.setScissor( xR, yR, widthR, heightR );
			renderer.setViewport( xR, yR, widthR, heightR );
			renderer.render( scene, settings.stereo.cameraR );

			renderer.setScissorTest( false );

		};

		//Localization
		function getLang( params ) {

			params = params || {};
			const _lang = {

				stereoEffects: 'Stereo effects',

				spatialMultiplexName: 'Spatial  multiplex',
				spatialMultiplexTitle: 'Choose a way to do spatial multiplex.',

				spatialMultiplexs: {
					'Mono': spatialMultiplexsIndexs.Mono,
					'Side by side': spatialMultiplexsIndexs.SbS, //https://en.wikipedia.org/wiki/DVB_3D-TV#Side_by_side
					'Top and bottom': spatialMultiplexsIndexs.TaB, //https://en.wikipedia.org/wiki/DVB_3D-TV#Top_and_bottom
				},

				eyeSeparationName: 'Eye separation',
				eyeSeparationTitle: 'The distance between left and right cameras.',

				focus: 'Focus',
				focusTitle: 'Object distance.',

				zeroParallaxName: 'Zero parallax',
				zeroParallaxTitle: 'Distance to objects with zero parallax.',

				defaultButton: 'Default',
				defaultTitle: 'Restore default stereo effects settings.',

			};

			const _languageCode = params.getLanguageCode === undefined ? 'en'//Default language is English
				: params.getLanguageCode();
			switch ( _languageCode ) {

				case 'ru'://Russian language

					_lang.stereoEffects = 'Стерео эффекты';//'Stereo effects'

					_lang.spatialMultiplexName = 'Мультиплекс';//'Spatial  multiplex'
					_lang.spatialMultiplexTitle = 'Выберите способ создания пространственного мультиплексирования.';

					_lang.spatialMultiplexs = {
						'Моно': spatialMultiplexsIndexs.Mono, //Mono
						'Слева направо': spatialMultiplexsIndexs.SbS, //https://en.wikipedia.org/wiki/DVB_3D-TV#Side_by_side
						'Сверху вниз': spatialMultiplexsIndexs.TaB, //https://en.wikipedia.org/wiki/DVB_3D-TV#Top_and_bottom
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
				default://Custom language
					if ( ( params.lang === undefined ) || ( params.lang._languageCode != _languageCode ) )
						break;

					Object.keys( params.lang ).forEach( function ( key ) {

						if ( _lang[key] === undefined )
							return;
						_lang[key] = params.lang[key];

					} );

			}
			return _lang;

		}

		/**
		 * Adds StereoEffects folder into dat.GUI.
		 * @see {@link https://github.com/anhr/dat.gui|dat.gui}.
		 * @param {Object} [guiParams={}] the following params are available.
		 * @param {GUI} [guiParams.dat] [dat.GUI()]{@link https://github.com/dataarts/dat.gui}.
		 * @param {GUI} [guiParams.folder] <b>StereoEffects</b> folder. See {@link https://github.com/anhr/dat.gui|dat.gui} for details
		 * @param {Function} [guiParams.onChangeMode] The event is fired if user has changed the stereo mode.
		 * <pre>
		 * parameter is new stereo mode.
		 * See the <b>settings.spatialMultiplex</b> parameter of the <b>StereoEffect</b> class for details.
		 * <pre>
		 * @param {number} [guiParams.scale=1] scale of allowed values.
		 */
		this.gui = function ( guiParams = {} ) {

			const gui = guiParams.folder || options.dat.gui;
			if ( !gui || options.dat.stereoEffectsGui === false )
				return;
			const dat = guiParams.dat || three$1.dat;//options.dat.dat;
			if ( guiParams === undefined ) guiParams = {};
			guiParams.scale = guiParams.scale || 1;
			const stereoEffect = options.dat.getCookieName( 'StereoEffect' ),
				_lang = getLang( { getLanguageCode: options.getLanguageCode, lang: options.lang } );
			
			const optionsDefault = {

				spatialMultiplex: settings.spatialMultiplex,
				eyeSep: ( new THREE.StereoCamera().eyeSep / 10 ) * settings.far,
				focus: settings.focus,
				zeroParallax: 0,

			};
			Object.freeze( optionsDefault );
			options.dat.cookie.getObject( stereoEffect, settings, optionsDefault );
			settings.spatialMultiplex = parseInt( settings.spatialMultiplex );

			if ( this.setSpatialMultiplex ) this.setSpatialMultiplex( settings.spatialMultiplex );

			//

			function displayControllers( value ) {

				const display = value == spatialMultiplexsIndexs.Mono ? 'none' : 'block';
				_fEyeSeparation.domElement.style.display = display;
				if ( _controllerCameraFocus !== undefined )
					_controllerCameraFocus.__li.style.display = display;
				_controllerDefaultF.__li.style.display = display;
				_controllerZeroParallax.__li.style.display = display;

			}

			const _fStereoEffects = gui.addFolder( _lang.stereoEffects );//Stero effects folder

			//Spatial multiplex
			const _controllerSpatialMultiplex = _fStereoEffects.add( settings, 'spatialMultiplex',
				_lang.spatialMultiplexs ).onChange( function ( value ) {

					value = parseInt( value );
					displayControllers( value );
					setObject( stereoEffect );
					if ( guiParams.onChangeMode )
						guiParams.onChangeMode( value );
					if ( menuItemStereoEffect )
						menuItemStereoEffect.select( value );

				} );
			dat.controllerNameAndTitle( _controllerSpatialMultiplex, _lang.spatialMultiplexName, _lang.spatialMultiplexTitle );
			this.setControllerSpatialMultiplex = function ( index ) {

				saveToCookie = false;
				_controllerSpatialMultiplex.setValue( index );
				saveToCookie = true;

			};

			//eyeSeparation
			//http://paulbourke.net/papers/vsmm2007/stereoscopy_workshop.pdf
			const _fEyeSeparation = _fStereoEffects.addFolder( _lang.eyeSeparationName );//Eye Separation
			dat.folderNameAndTitle( _fEyeSeparation, _lang.eyeSeparationName, _lang.eyeSeparationTitle );
			_fEyeSeparation.add( new PositionController( function ( shift ) {

				settings.eyeSep += shift;
				_controllerEyeSep.setValue( settings.eyeSep );

			}, { settings: { offset: 0.01 }, min: 0.0001, max: 0.01, step: 0.0001 }
			) );
			const _controllerEyeSep = dat.controllerZeroStep( _fEyeSeparation, settings.stereo, 'eyeSep', function ( value ) {

				settings.eyeSep = value;
				setObject( stereoEffect );

			} );
			dat.controllerNameAndTitle( _controllerEyeSep, _lang.eyeSeparationName, _lang.eyeSeparationTitle );

			if ( settings.camera !== undefined ) settings.camera.focus = settings.focus;
			
			var _controllerCameraFocus;
			if ( settings.camera ) {

				_controllerCameraFocus = _fStereoEffects.add( settings.camera,
					'focus', optionsDefault.focus / 10, optionsDefault.focus * 2, optionsDefault.focus / 1000 )
					.onChange( function ( value ) {

						settings.focus = value;
						setObject( stereoEffect );

					} );
				dat.controllerNameAndTitle( _controllerCameraFocus, _lang.focus, _lang.focusTitle );

			}

			//Zero parallax
			//http://paulbourke.net/papers/vsmm2007/stereoscopy_workshop.pdf
			const _minMax = ( 60 - ( 400 / 9 ) ) * guiParams.scale + 400 / 9;
			const _controllerZeroParallax = _fStereoEffects.add( settings, 'zeroParallax', - _minMax, _minMax )
				.onChange( function ( value ) {

					settings.zeroParallax = value;
					setObject( stereoEffect );

				} );
			dat.controllerNameAndTitle( _controllerZeroParallax, _lang.zeroParallaxName, _lang.zeroParallaxTitle );

			//default button
			const _controllerDefaultF = _fStereoEffects.add( {
				defaultF: function ( value ) {

					settings.stereo.eyeSep = optionsDefault.eyeSep;
					_controllerEyeSep.setValue( settings.stereo.eyeSep );

					if ( settings.camera ) {

						settings.camera.focus = optionsDefault.focus;
						_controllerCameraFocus.setValue( settings.camera.focus );

					}

					settings.zeroParallax = optionsDefault.zeroParallax;
					_controllerZeroParallax.setValue( settings.zeroParallax );

				},

			}, 'defaultF' );
			dat.controllerNameAndTitle( _controllerDefaultF, _lang.defaultButton, _lang.defaultTitle );

			displayControllers( settings.spatialMultiplex );

			var saveToCookie = true;
			/**
			 * sets an object into cookie.
			 * @param {string} name cookie name.
			 */
			function setObject( name ) {

				if ( !saveToCookie )
					return;
				const object = {};
				Object.keys( optionsDefault ).forEach( function ( key ) {

					object[key] = settings[key];

				} );
				options.dat.cookie.setObject( name, object );

			}
		};

		var _canvasMenu, menuItemStereoEffect;
		/**
		 * Adds a StereoEffect's menu item into [CanvasMenu]{@link https://github.com/anhr/commonNodeJS/tree/master/canvasMenu}.
		 * @param {CanvasMenu} [canvasMenu] [CanvasMenu]{@link https://github.com/anhr/commonNodeJS/tree/master/canvasMenu}.
		 * @param {Object} [params] the following params are available.
		 * @param {Function} [params.getLanguageCode=language code of your browser] Your custom getLanguageCode() function.
		 * <pre>
		   * returns the "primary language" subtag of the language version of the browser.
		 * Examples: "en" - English language, "ru" Russian.
		 * See the {@link https://tools.ietf.org/html/rfc4646#section-2.1|Syntax} paragraph of RFC 4646 for details.
		 * </pre>
		 */
		this.createCanvasMenuItem = function ( canvasMenu, params ) {

			_canvasMenu = canvasMenu;
			params = params || {};
			const _lang = getLang( { getLanguageCode: params.getLanguageCode, lang: params.lang } ),
				spatialMultiplexs = Object.keys( _lang.spatialMultiplexs );
			menuItemStereoEffect = {

				name: '⚭',
				title: _lang.stereoEffects,
				id: 'menuButtonStereoEffects',
				drop: 'up',
				items: [

					{
						name: spatialMultiplexs[spatialMultiplexsIndexs.Mono],//'Mono',
						id: 'menuButtonStereoEffectsMono',
						radio: true,
						checked: settings.spatialMultiplex === spatialMultiplexsIndexs.Mono,
						spatialMultiplex: spatialMultiplexsIndexs.Mono,
						onclick: function ( event ) {

							settings.spatialMultiplex = spatialMultiplexsIndexs.Mono;

						}
					},
					{
						name: spatialMultiplexs[spatialMultiplexsIndexs.SbS],//'Side by side',
						id: 'menuButtonStereoEffectsSbS',
						radio: true,
						checked: settings.spatialMultiplex === spatialMultiplexsIndexs.SbS,
						spatialMultiplex: spatialMultiplexsIndexs.SbS,
						onclick: function ( event ) {

							settings.spatialMultiplex = spatialMultiplexsIndexs.SbS;

						}
					},
					{
						name: spatialMultiplexs[spatialMultiplexsIndexs.TaB],//'Top and bottom',
						id: 'menuButtonStereoEffectsTaB',
						radio: true,
						checked: settings.spatialMultiplex === spatialMultiplexsIndexs.TaB,
						spatialMultiplex: spatialMultiplexsIndexs.TaB,
						onclick: function ( event ) {

							settings.spatialMultiplex = spatialMultiplexsIndexs.TaB;

						}
					},

				],

			};
			menuItemStereoEffect.select = function ( value ) {

				menuItemStereoEffect.items.forEach( function ( item ) {

					if ( item.spatialMultiplex === value ) {

						if ( !item.checked )
							item.elName.onclick( { target: item.elName } );

					}

				} );

			};
			this.setSpatialMultiplex = function ( index ) {

				menuItemStereoEffect.select( index );

			};
			canvasMenu.menu.push( menuItemStereoEffect );

		};

	}

}/**
 * Enumeration of available stereo modes. Available as <b>StereoEffect.spatialMultiplexsIndexs</b>.
 * @see {@link https://en.wikipedia.org/wiki/DVB_3D-TV|DVB 3D-TV} for details
 * @readonly
 * @enum {number}
 */
StereoEffect.spatialMultiplexsIndexs = {
	/** No stereo effect */
	Mono: 0,
	/** {@link https://en.wikipedia.org/wiki/DVB_3D-TV#Side_by_side|Side by side} */
	SbS: 1, //
	/** {@link https://en.wikipedia.org/wiki/DVB_3D-TV#Top_and_bottom|Top and bottom} */
	TaB: 2, //
};
Object.freeze( StereoEffect.spatialMultiplexsIndexs );
const spatialMultiplexsIndexs = StereoEffect.spatialMultiplexsIndexs;

/* * @namespace
 * @description Assigh setStereoEffect to [THREE.Raycaster]{@link https://threejs.org/docs/index.html#api/en/core/Raycaster}
 */
function assign$1() {

	const THREE = three$1.THREE;
	if ( new THREE.Raycaster().setStereoEffect )
		return;
		
	//Modifying of THREE.Raycaster for StereoEffect
	Object.assign( THREE.Raycaster.prototype, {

		/**
		 * @namespace
		 * @description Sets the <b>StereoEffect</b> settings to the {@link https://threejs.org/docs/#api/en/core/Raycaster|THREE.Raycaster}.
		 * Available as <b>THREE.Raycaster.setStereoEffect(...)</b>.
		 * @param {Object} [settings={}]
		 * @param {Options} [settings.options] See <a href="../../jsdoc/Options/Options.html" target="_blank">Options</a>.
		 * @param {THREE.PerspectiveCamera} settings.camera {@link https://threejs.org/docs/index.html#api/en/cameras/PerspectiveCamera|PerspectiveCamera}
		 * @param {THREE.Scene} [settings.scene] [Scene]{@link https://threejs.org/docs/index.html?q=Scene#api/en/scenes/Scene}
		 * @param {StereoEffect} [settings.stereoEffect=no stereo effects] stereoEffect.
		 * @param {THREE.WebGLRenderer} [settings.renderer=renderer parameter of THREE.StereoEffect] renderer. The {@link https://threejs.org/docs/#api/en/renderers/WebGLRenderer|WebGL renderer} displays your beautifully crafted scenes using WebGL.
		 * @param {boolean} [settings.raycasterEvents=true] true - add raycaster events: mousemove and pointerdown.
		 */
		setStereoEffect: function ( settings = {} ) {

			if ( settings.stereoEffect === false ) return;
			settings.raycasterEvents = settings.raycasterEvents === undefined ? true : settings.raycasterEvents;
			const camera = settings.camera, renderer = settings.renderer;

			if ( settings.raycasterEvents ){

				const mouse = new THREE.Vector2();
				window.addEventListener( 'mousemove', function ( event ) {

					// calculate mouse position in normalized device coordinates
					// (-1 to +1) for both components

					mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
					mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

					// update the picking ray with the camera and mouse position
					raycaster.setFromCamera( mouse, camera );

					raycaster.stereo.onDocumentMouseMove( event );

				}, false );
				window.addEventListener( 'pointerdown', function ( event ) {

					raycaster.stereo.onDocumentMouseDown( event );

				}, false );

			}

			const stereoEffect = settings.stereoEffect !== undefined ? settings.stereoEffect : typeof effect !== 'undefined' ? effect :
				new StereoEffect( renderer, settings.options ),
				raycaster = this,
				mouseL = new THREE.Vector2(),
				mouseR = new THREE.Vector2();
			var particles, //The object or array of objects to check for intersection with the ray. See THREE.Raycaster.intersectObject https://threejs.org/docs/index.html#api/en/core/Raycaster.intersectObject for details.
//				intersects, //An array of intersections is returned by THREE.Raycaster.intersectObject or THREE.Raycaster.intersectObjects.
				mouse; //Attention!!! Do not assign new THREE.Vector2() here
			//for prevention of invalid detection of intersection with zero point ( THREE.Vector3( 0, 0, 0 ) )
			//after opening of the web page and before user has moved mouse.

			function getMousePosition() {

				stereoEffect.getRendererSize().getMousePosition( mouse, event );

				function mousePosition( vectorName, b ) {

					mouseL.copy( mouse );
					mouseR.copy( mouse );
					const a = 0.5;

					mouseL[vectorName] += a;
					mouseL[vectorName] *= 2;

					mouseR[vectorName] -= a;
					mouseR[vectorName] *= 2;

					//zeroParallax
					const size = new THREE.Vector2();
					renderer.getSize( size );
					const zeroParallax = ( stereoEffect.settings.zeroParallax / size.x ) * b;
					mouseL.x -= zeroParallax;
					mouseR.x += zeroParallax;

				}
				switch ( parseInt( stereoEffect.settings.spatialMultiplex ) ) {

					case spatialMultiplexsIndexs.Mono:
						return;
					case spatialMultiplexsIndexs.SbS:
						mousePosition( 'x', 4 );
						break;
					case spatialMultiplexsIndexs.TaB:
						mousePosition( 'y', 2 );
						break;
					default: console.error( 'THREE.Raycaster.setStereoEffect.getMousePosition: Invalid effect.settings.spatialMultiplex = ' + effect.settings.spatialMultiplex );
						return;

				}

			}
			function intersection( optionsIntersection ) {

				if ( mouse === undefined )
					return;//User has not moved mouse
				function isIntersection() { Options$1.raycaster.intersectionsInOut( particles, raycaster, renderer, mouse, settings ); }
				if ( parseInt( stereoEffect.settings.spatialMultiplex ) !== spatialMultiplexsIndexs.Mono ) {

					const mouseCur = mouse;
					mouse = mouseL;
					raycaster.setFromCamera( mouseL, camera );
					if ( !isIntersection() ) {

						mouse = mouseR;
						raycaster.setFromCamera( mouseR, camera );
						isIntersection();

					}
					mouse = mouseCur;
					return;

				}
				raycaster.setFromCamera( mouse, camera );
				isIntersection();

			}

			/**
			 * @namespace
			 * @description
			 * <pre>
			 * [Raycaster]{@link https://threejs.org/docs/index.html#api/en/core/Raycaster} helper.
			 * Available as <b>raycaster.stereo</b>.
			 * <b>raycaster</b> is [Raycaster]{@link https://threejs.org/docs/index.html#api/en/core/Raycaster} instance.
			 * </pre>
			 * */
			this.stereo = {

				/**
				 * [mousemove]{@link https://developer.mozilla.org/en-US/docs/Web/API/Element/mousemove_event} event.
				 * User is moving of mouse over canvas.
				 * @param {object} event
				 */
				onDocumentMouseMove: function ( event ) {

					if ( particles === undefined )
						return;//The object or array of objects to check for intersection with the ray is not defined. See THREE.Raycaster.intersectObject https://threejs.org/docs/index.html#api/en/core/Raycaster.intersectObject for details.
					event.preventDefault();
					if ( mouse === undefined )
						mouse = new THREE.Vector2();
					getMousePosition();
					intersection();

				},
				/**
				 * <pre>
				 * Available as <b>raycaster.stereo.isAddedToParticles( particle )</b>.
				 * <b>raycaster</b> is [Raycaster]{@link https://threejs.org/docs/index.html#api/en/core/Raycaster} instance.
				 * </pre>
				 * @param {THREE.Mesh} particle The [Mech]{@link https://threejs.org/docs/index.html#api/en/objects/Mesh} or derived class instance for check is added to <b>particles</b>.
				 * @returns true if <b>particle</b> is added to <b>particles</b>.
				 */
				isAddedToParticles: function ( particle ) {

					if ( !particles )
						return false;
					return particles.includes( particle );

				},
				/**
				 * <pre>
				 * Adds new particle into array of objects to check for intersection with the ray.
				 * Available as <b>raycaster.stereo.addParticle( particle )</b>.
				 * <b>raycaster</b> is [Raycaster]{@link https://threejs.org/docs/index.html#api/en/core/Raycaster} instance.
				 * </pre>
				 * @see <b>objects</b> parameter of the [Raycaster.intersectObjects]{@link https://threejs.org/docs/index.html#api/en/core/Raycaster.intersectObjects} for details.
				 * @param {THREE.Mesh} particle The [Mech]{@link https://threejs.org/docs/index.html#api/en/objects/Mesh} or derived class instance for check for intersection with the ray.
				 */
				addParticle: function ( particle ) {

					if ( particles === undefined )
						particles = [];
					if ( this.isAddedToParticles( particle ) ) {

						console.error( 'Duplicate particle "' + particle.name + '"' );
						return;

					}
					particles.push( particle );

				},
				/**
				 * <pre>
				 * New array of objects to check for intersection with the ray.
				 * Available as <b>raycaster.stereo.addParticles( particles )</b>.
				 * <b>raycaster</b> is [Raycaster]{@link https://threejs.org/docs/index.html#api/en/core/Raycaster} instance.
				 * </pre>
				 * @see <b>objects</b> parameter of the [Raycaster.intersectObjects]{@link https://threejs.org/docs/index.html#api/en/core/Raycaster.intersectObjects} for details.
				 * @param {array} newParticles New array of objects to check for intersection with the ray.
				 */
				addParticles: function ( newParticles ) {

					if ( particles !== undefined ) {

						if ( !Array.isArray( particles ) ) {

							var particlesCur = particles;
							particles = [];
							particles.push( particlesCur );

						}
						particles.push( newParticles );
						return;

					}
					particles = newParticles;

				},
				/**
				 * <pre>
				 * Remove particle from array of objects to check for intersection with the ray.
				 * Available as <b>raycaster.stereo.removeParticle( particle )</b>.
				 * <b>raycaster</b> is [Raycaster]{@link https://threejs.org/docs/index.html#api/en/core/Raycaster} instance.
				 * </pre>
				 * @see <b>objects</b> parameter of the [Raycaster.intersectObjects]{@link https://threejs.org/docs/index.html#api/en/core/Raycaster.intersectObjects} for details.
				 * @param {THREE.Mesh} particle The [Mech]{@link https://threejs.org/docs/index.html#api/en/objects/Mesh} or derived class instance for removing from array of objects for check for intersection with the ray.
				 */
				removeParticle: function ( particle ) {

					for ( var i = 0; i < particles.length; i++ ) {

						if ( Object.is( particle, particles[i] ) ) {

							particles.splice( i, 1 );
							break;

						}

					}

				},
				/**
				 * <pre>
				 * remove array of objects to check for intersection with the ray.
				 * Available as <b>raycaster.stereo.removeParticles()</b>.
				 * <b>raycaster</b> is [Raycaster]{@link https://threejs.org/docs/index.html#api/en/core/Raycaster} instance.
				 * </pre>
				 * @see <b>objects</b> parameter of the [Raycaster.intersectObjects]{@link https://threejs.org/docs/index.html#api/en/core/Raycaster.intersectObjects} for details.
				 */
				removeParticles: function () { particles = undefined; },
				/**
				 * <pre>
				 * get position of intersected object
				 * Available as <b>raycaster.stereo.getPosition( intersection )</b>.
				 * <b>raycaster</b> is [Raycaster]{@link https://threejs.org/docs/index.html#api/en/core/Raycaster} instance.
				 * </pre>
				 * @param {object} intersection first item of array of intersections.
				 * @See [Raycaster.intersectObject]{@link https://threejs.org/docs/index.html#api/en/core/Raycaster.intersectObject} for details
				 */
				getPosition: function ( intersection ) {

					const attributesPosition = intersection.object.geometry.attributes.position;

					//Если опредедить как const, то при выполнении npm run build появится ошибка
					//(babel plugin) SyntaxError: D:/My documents/MyProjects/webgl/three.js/GitHub/commonNodeJS/master/StereoEffect/StereoEffect.js: "position" is read-only
					var position = attributesPosition.itemSize >= 4 ? new THREE.Vector4( 0, 0, 0, 0 ) : new THREE.Vector3();

					if ( intersection.index !== undefined ) {

						position.fromArray( attributesPosition.array, intersection.index * attributesPosition.itemSize );

						position.multiply( intersection.object.scale );

						position.add( intersection.object.position );

					} else position = intersection.object.position;
					return position;

				}

			};

		}

	} );

}
StereoEffect.assign = assign$1;
//import { getLanguageCode } from 'https://raw.githack.com/anhr/commonNodeJS/master/lang.js';

const lang$2 = {

	mesh: 'Mesh',
	pointName: 'Point Name',
	color: 'Сolor',
	opacity: 'Opacity',

};

switch ( getLanguageCode() ) {

	case 'ru'://Russian language
		lang$2.mesh = '3D объект';
		lang$2.pointName = 'Имя точки';
		lang$2.color = 'Цвет';
		lang$2.opacity = 'Непрозрачность';
		break;

}

/** @namespace
 * @description Creates the <a href="../../SpriteText/jsdoc" target="_blank">SpriteText</a> instance with information about point, intersected with mouse cursor.
 * @param {THREE.Raycaster.intersectObject} intersection See [intersection]{@link https://threejs.org/docs/index.html#api/en/core/Raycaster.intersectObject} for details.
 * @param {object} options The following options are available
 * @param {object} [options.scales] axes scales.
 * See <b>options.scales</b> parameter of the <a href="../../AxesHelper/jsdoc/module-AxesHelper-AxesHelper.html" target="_blank">AxesHelper</a> class for details.
 * @param {object} options.spriteOptions Options of the <b>SpriteText</b>.
 * See [SpriteText]{@link https://raw.githack.com/anhr/commonNodeJS/master/SpriteText/jsdoc/module-SpriteText..html} for details.
 * @returns <b>new SpriteText</b> with information about point, intersected with mouse cursor.
 */
StereoEffect.getTextIntersection = function ( intersection, options ) {

	const spriteText = Options$1.findSpriteTextIntersection( options.spriteOptions.group );
	if ( spriteText )
		return spriteText;
		
	const THREE = three$1.THREE,
		myObject = intersection.object.userData.myObject,
		guiPoints = myObject ? myObject.guiPoints : undefined,
		searchNearestEdgeVerticeId = guiPoints ? guiPoints.searchNearestEdgeVerticeId : undefined,
		verticeId = searchNearestEdgeVerticeId ? searchNearestEdgeVerticeId( intersection.index, intersection ) : undefined,
		position = getObjectPosition( intersection.object, verticeId != undefined ? verticeId : intersection.index ),
		scales = options.scales || {},
		isArrayFuncs = (
			( intersection.index !== undefined ) &&
			( intersection.object.userData.player !== undefined ) &&
			( intersection.object.userData.player.arrayFuncs !== undefined ) 
		),
		funcs = !isArrayFuncs ? undefined : intersection.object.userData.player.arrayFuncs,
		funcsIndex = () => { return funcs.intersection ? funcs.intersection(intersection.index) : funcs[intersection.index]; },
		func = ( funcs === undefined ) || ( typeof funcs === "function" ) ? undefined : funcs.intersection ? funcs.intersection(intersection.index) : funcs[intersection.index],
		pointName = isArrayFuncs && func ? func.name : undefined,
		color = !isArrayFuncs || ( func === undefined ) ?
			undefined :
			Array.isArray( func.w ) ?
				Player.execFunc( func, 'w', group.userData.t, options ) ://.a, options.b ) :
				func.w;

	if ( intersection.object.userData.onIntersection ) intersection.object.userData.onIntersection();
	const boXYZ = !scales.x &&  !scales.y &&  !scales.z;
//	options.spriteOptions.name = Options.findSpriteTextIntersection.spriteTextIntersectionName;
	options.spriteOptions.name = Options$1.findSpriteTextIntersection.spriteTextIntersectionName;
	return new SpriteText$1(

		//text
		/*lang.mesh + ': ' + */( intersection.object.name === '' ? intersection.object.type : intersection.object.name ) +
		( pointName === undefined ? '' : '\n'+ lang$2.pointName + ': ' + pointName ) +
		( intersection.index === undefined ? '' : '\nID: ' + ( verticeId != undefined ? verticeId : intersection.index ) ) + 
		( ( !boXYZ && !scales.x ) || ( scales.x && !scales.x.isAxis() ) ? '' :
			'\n\t' + ( ( scales.x && scales.x.name ) || ( scales.x.name === 0 ) ? scales.x.name : 'X' ) + ': ' + position.x ) +
		( ( !boXYZ && !scales.y ) || ( scales.y && !scales.y.isAxis() ) ? '' :
			'\n\t' + ( ( scales.y && scales.y.name ) || ( scales.y.name === 0 ) ? scales.y.name : 'Y' ) + ': ' + position.y ) +
		( ( !boXYZ && !scales.z ) || ( scales.z && !scales.z.isAxis() ) ? '' :
			'\n\t' + ( ( scales.z && scales.z.name ) || ( scales.z.name === 0 ) ? scales.z.name : 'Z' ) + ': ' + position.z ) + 
		(//w
			!isArrayFuncs ?
				'' :
				funcsIndex() instanceof THREE.Vector4 ||
					funcsIndex() instanceof THREE.Vector3 ||
					typeof funcs === "function" ?
					color instanceof THREE.Color ?
						'\n' + lang$2.color + ': ' + new THREE.Color( color.r, color.g, color.b ).getHexString() :
						position.w !== undefined ? '\n\t' + ( scales.w && scales.w.name ? scales.w.name : 'W' ) + ': ' + position.w : '' :
					''

		) +
		(//opacity
			( intersection.object.geometry.attributes.ca === undefined ) ||
				( intersection.object.geometry.attributes.ca.itemSize < 4 ) ?
				'' :
				'\n' + lang$2.opacity + ': ' + new THREE.Vector4().fromArray(

					intersection.object.geometry.attributes.ca.array,
					intersection.index * intersection.object.geometry.attributes.ca.itemSize

				).w
		) +
		(//Custom text
			intersection.object.userData.raycaster && intersection.object.userData.raycaster.text ? intersection.object.userData.raycaster.text( intersection ) : ''
		),
		intersection.pointSpriteText ? intersection.pointSpriteText : intersection.point,//position,
		options.spriteOptions
	);

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

/**
 * @description View and edit some parameters on the web page.
 * @param {Object} [settings] see <b>arrayFuncs.controllers[axisName]</b> parameter of <a href="./player/jsdoc/module-Player-Player.getPoints.html" target="_blank">Player.getPoints</a>
 * @param {HTMLElement|string} [settings.controller]
 * <pre>
 * HTMLElement - for viewing or editing of some value
 * string - id of HTMLElement
 * </pre>
 * @param {HTMLElement|string} [settings.elName]
 * <pre>
 * HTMLElement - name of value. See <b>settings.controller</b> above.
 * string - id of HTMLElement
 * </pre>
 * @param {string} controllerId id of controller if <b>settings.controller</b> is not defined.
 * @param {Function} name returns name of value.
 * @param {Object} options
 * @param {Object} [options.elementName='input'] controllers tag name if <b>settings.controller</b> is not defined.
 * @param {String} [options.value] controllers <b>value</b> or <b>innerHTML</b>.
 * @param {String} [options.axisName] axis name. For find element by ID.
 * @param {Function} [options.onchange] callback function is called if user has changed the controllers <b>value</b>.
 */
function createController( settings, controllerId, name, options ) {

	if ( !settings ) return;

	//controller

	if ( typeof settings.controller === "string" ) {

		const id = settings.controller;
		settings.controller = document.getElementById( settings.controller );
		if ( !settings.controller ) console.warn( 'createController: invalid settings.controller = "' + id + '"' );

	}
	if ( !settings.controller ) {

		if ( settings.controller === null ) console.warn( 'createController: invalid settings.controller = ' + settings.controller );
		var controller = document.getElementById( controllerId );
		if ( !controller ) {

			controller = document.createElement( options.elementName ? options.elementName : 'input' );
			document.querySelector( 'body' ).appendChild( controller );

		}
		settings.controller = controller;

	}
	function setControllerValue( value ) {

		if( settings.controller.value !== undefined )
			settings.controller.value = value;//input element type
		else settings.controller.innerHTML = value;//other element types. For example span

	}
	if ( options.value !== undefined )
		setControllerValue( options.value );
	if ( ( options.onchange !== undefined ) && settings.controller.onchange === null )
		settings.controller.onchange = options.onchange;
	if ( ( options.title !== undefined ) && settings.controller.title === '' )
		settings.controller.title = options.title;

	//slider
	if( settings.elSlider ) {

		if ( typeof settings.elSlider === "string" ) {

			const id = settings.elSlider;
			settings.elSlider = document.getElementById( settings.elSlider );
			if ( !settings.elSlider ) console.warn( 'createController: invalid settings.elSlider = "' + id + '"' );

		}
		if ( !settings.elSlider || ( settings.elSlider === true ) ) {

			if ( options.axisName ) settings.elSlider = document.getElementById( options.axisName + 'Slider' );
			if ( !settings.elSlider ) {

				settings.elSlider = document.createElement( 'div' );
				if ( settings.controller )
					settings.controller.parentElement.appendChild( settings.elSlider );
				else document.querySelector( 'body' ).appendChild( settings.elSlider );

			}

		}

		settings.boSetValue = true;
		//Horizontal Colorpicker with slider indicator
		if ( !settings.colorpicker ) {

			settings.colorpicker = ColorPicker$1.create( settings.elSlider, {

				//direction: false,
				duplicate: true,
				sliderIndicator: {
					callback: function ( c ) {

						if ( settings.boSetValue || !settings.controller ) return;
						const value = c.percent / 100;
						settings.controller.onchange( { currentTarget: { value: value } } );
						settings.controller.value = value;

					},
					value: options.value * 100,//percent

				},
				style: {

					border: '1px solid black',
					width: settings.controller.clientWidth + 'px',
					height: settings.controller.clientHeight + 'px',

				},
				onError: function ( message ) { alert( 'Horizontal Colorpicker with slider indicator error: ' + message ); }

			} );

			//Непонятно почему если это не сделать, то settings.elSlider не попадает под settings.controller
			//Сейчас после settings.controller ставлю <br>
			//settings.elSlider.style.display = 'none';
			//settings.elSlider.style.display = 'block';

		}
		if ( options.value !== undefined ) {

			var value = options.value * 100;
			if ( value < 0 ) value = 0;
			if ( value > 100 ) value = 100;
			settings.boSetValue = true;
			settings.colorpicker.setValue( value );
			settings.boSetValue = false;

		}
/*
		document.getElementById( 'enterValueHI' ).onclick = function () {

			settings.colorpicker.setValue( settings.controller.value );

		}
*/
		
	}

	//name

	if ( settings.elName === false )
		return;

	if ( settings.elName === null ) console.warn( 'createController: invalid settings.elName = ' + settings.elName );
	if ( typeof settings.elName === "string" ) {

		const id = settings.elName;
		settings.elName = document.getElementById( settings.elName );
		if ( !settings.elName ) console.warn( 'createController: invalid settings.elName = "' + id + '"' );

	}
	var str = '';
	if ( !settings.elName ) {

		if ( options.axisName ) settings.elName = document.getElementById( options.axisName + 'Name' );
		if ( !settings.elName ) {

			settings.elName = document.createElement( 'span' );
			settings.controller.parentElement.insertBefore( settings.elName, settings.controller );
			str = ' = ';

		}

	}
	if ( settings.elName.innerHTML !== '' )
		return;
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

class Options {

	/**
	 * Options of the canvas
	 * @param {Object} options See the <b>options</b> parameter of the <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
	 */
	constructor( options ) {

		const _this = this;
		options = options || {};
		if ( options.boOptions )
			return options;//duplucate new Options

		var lang;

		if ( options.a === undefined ) options.a = 1;
		if ( options.b === undefined ) options.b = 0;

		/**
		 * set the <b>scales.w</b> key of the <b>options</b>
		 * @param {Object} options
		 * @param {string} [options.scales.w.name="W"] axis name.
		 * @param {number} [options.scales.w.min=0] Minimum range of the <a href="../../colorpicker/jsdoc/index.html" target="_blank">color palette</a> index.
		 * @param {number} [options.scales.w.max=1] Maximum range of the <a href="../../colorpicker/jsdoc/index.html" target="_blank">color palette</a> index.
		 */
		this.setW = function ( optionsCur ) {

			optionsCur = optionsCur || options;
			optionsCur.scales = optionsCur.scales || {};
			optionsCur.scales.w;
			if ( !optionsCur.palette )
				_this.setPalette();// optionsCur );

			//максимальное значение шкалы w по умолчанию беру из THREE.Vector4
			//потому что в противном случае неверно будет отображаться цвет точки, заданной как THREE.Vector4()
//			scale.max = scale.max === undefined ? new three.THREE.Vector4().w : scale.max;

		};
		options.scales = options.scales || {};
		const boCreateScale = !options.scales.x && !options.scales.y && !options.scales.z;
		function setScale( axisName ) {

			//Не надо создавать ось потому что иначе будут создавться контролы для осей, которые не хочет видеть пользователь и будет рмсоватся пунктирная линия к не существующей оси если пользователь нажал на точку
			if ( boCreateScale )
				options.scales[axisName] = options.scales[axisName] || {};

			if ( !options.scales[axisName] )
				return;

/*
			options.scales[axisName].name = options.scales[axisName].name || axisName;
			options.scales[axisName].min = options.scales[axisName].min === undefined ? -1 : options.scales[axisName].min;
			options.scales[axisName].max = options.scales[axisName].max === undefined ? 1 : options.scales[axisName].max;
*/			

		}
		setScale( 'x' );
		setScale( 'y' );
		setScale( 'z' );
//		options.scales.setW = function () { _this.setW(); }
		options.point = options.point || {};
		if (options.point.size === undefined) options.point.size = 5.0;
		options.point.sizePointsMaterial = options.point.sizePointsMaterial || 100.0;

		/**
		 * set the <b>palette</b> key of the <b>options</b>.
		 * See <a href="../../colorpicker/jsdoc/module-ColorPicker-ColorPicker.html#palette" target="_blank">color palette</a>.
		 * @param {ColorPicker.palette} [palette] new palette.
		 */
		this.setPalette = function ( palette ) {

			if ( palette ) options.palette = palette;
			else if ( !options.palette ) options.palette = new ColorPicker$1.palette();

		};

		/**
		 * Create [OrbitControls]{@link https://threejs.org/docs/index.html#examples/en/controls/OrbitControls}
		 * @param {THREE.PerspectiveCamera} camera [PerspectiveCamera]{@link https://threejs.org/docs/index.html#api/en/cameras/PerspectiveCamera}. Use the <b>camera</b> key if you want control cameras focus.
		 * @param {THREE.WebGLRenderer} renderer [THREE.WebGLRenderer]{@link https://threejs.org/docs/index.html#api/en/renderers/WebGLRenderer}.
		 * @param {THREE.Scene} scene [THREE.Scene]{@link https://threejs.org/docs/index.html?q=sce#api/en/scenes/Scene}.
		 */
		this.createOrbitControls = function ( camera, renderer, scene ) {

			if ( options.orbitControls === false )
				return;

			const settings = options.orbitControls || {};
			_this.orbitControls = new three$1.OrbitControls( camera, renderer.domElement );
			if ( settings.enableRotate !== undefined ) _this.orbitControls.enableRotate = settings.enableRotate;
			_this.orbitControls.target.set( scene.position.x * 2, scene.position.y * 2, scene.position.z * 2 );
			_this.orbitControls.saveState();//For reset of the orbitControls settings in the CameraGui and OrbitControlsGui
			_this.orbitControls.update();

			if ( _this.frustumPoints )
				_this.orbitControls.addEventListener( 'change', function () { _this.frustumPoints.onChangeControls(); } );

		};

		/**
		 * Reset <a href="../../Player/jsdoc" target="_blank">Player</a> and restore [camera]{@link https://threejs.org/docs/index.html#api/en/cameras/PerspectiveCamera} position.
		 * @param {THREE.PerspectiveCamera} camera [PerspectiveCamera]{@link https://threejs.org/docs/index.html#api/en/cameras/PerspectiveCamera}.
		 * @param {THREE.Scene} scene [THREE.Scene]{@link https://threejs.org/docs/index.html?q=sce#api/en/scenes/Scene}.
		 */
		this.restoreSceneController = function ( camera, scene ) {

			if ( !three$1.dat || ( options.dat === false ) )//options.dat.dat
				return;
				
			//Localization

			const lang = {

				defaultButton: 'Default',
				defaultTitle: 'Reset player and restore camera position.',

			};

			switch ( this.getLanguageCode() ) {

				case 'ru'://Russian language

					lang.defaultButton = 'Восстановить';
					lang.defaultTitle = 'Восстановить положение камеры и проигрывателя.';

					break;

			}

			const scenePosition = new three$1.THREE.Vector3().copy( scene.position ),
				cameraPosition = new three$1.THREE.Vector3().copy( camera.position );

			three$1.dat.controllerNameAndTitle( options.dat.gui.add( {
				defaultF: function ( value ) {

					if ( options.player ) options.player.selectScene( options.playerOptions.selectSceneIndex );

					camera.position.copy( cameraPosition );
					scene.position.copy( scenePosition );
					if ( options.orbitControls !== false ) {

						options.orbitControls.target = new three$1.THREE.Vector3();
						options.orbitControls.object.position.copy( camera.position );
						options.orbitControls.update();

					}

				},

			}, 'defaultF' ), lang.defaultButton, lang.defaultTitle );

		};

		Object.defineProperties( this, {

			/**
			 * getter and setter
			 * <pre>
			 * 
			 * playerOptions = {
			 * 
			 *	min: 0,// Minimum range of the axis.
			 *	max: 1,// Maximum range of the axis.
			 *	marks: 10,// Ticks count of the playing. Number of scenes of 3D objects animation.
			 *		//Have effect for <b>max</b> is not Infinity.
			 *	dt: 0.1,// Step of the animation. Have effect only if <b>max</b> is infinity.
			 *	repeat: false,// true - Infinitely repeating 3D objects animation.
			 *	interval: 1,// Ticks per seconds.
			 *	zoomMultiplier: 1.1,// zoom multiplier of the time.
			 *	offset: 0.1,// offset of the time.
			 *	name: "",// name of the time.
			 *
			 * }
			 * </pre>
			 * @param {number} [playerOptions=0] Minimum range of the axis.
			 */
			playerOptions: {

				get: function () {

					options.playerOptions = options.playerOptions || {};
					const playerOptions = options.playerOptions;
					playerOptions.min = playerOptions.min || 0;
					if ( playerOptions.max === Infinity ) playerOptions.max = null;//Заменяю Infinity на null потому что из cockie Infinity читается как null
					if ( playerOptions.max !== null ) {

						if ( playerOptions.max === undefined ) playerOptions.max = 1;
						playerOptions.marks = playerOptions.marks || 10;//2;

					} else playerOptions.marks = null;
					if ( playerOptions.max === null ) playerOptions.dt = playerOptions.dt || 0.1;
					else playerOptions.dt = ( playerOptions.max - playerOptions.min ) / ( playerOptions.marks - 1 );
					playerOptions.repeat = playerOptions.repeat || false;
					playerOptions.interval = playerOptions.interval != undefined ? playerOptions.interval : 1;
					playerOptions.zoomMultiplier = playerOptions.zoomMultiplier || 1.1;
					playerOptions.offset = playerOptions.offset || 0.1;
					playerOptions.name = playerOptions.name || '';
					if ( !playerOptions.cameraTarget ) {

						const cameraTarget = new Player$2.cameraTarget();
						Object.defineProperties( playerOptions, {

							cameraTarget: {

								get: function () {

									return cameraTarget;

								},

							}

						} );

					}
					return options.playerOptions;

				},
				set: function ( playerOptions ) { options.playerOptions = playerOptions; },

			},

			/**
			 * getter
			 * <pre>
			 * See <b>options.a</b> parameter of the <a href="../../player/jsdoc/module-Player-Player.execFunc.html" target="_blank">Player.execFunc</a>.
			 * </pre>
			 **/
			a: {

				get: function () { return options.a; }

			},

			/**
			 * getter
			 * <pre>
			 * See <b>options.b</b> parameter of the <a href="../../player/jsdoc/module-Player-Player.execFunc.html" target="_blank">Player.execFunc</a>.
			 * </pre>
			 **/
			b: {

				get: function () { return options.b; }

			},

			/**
			 * getter and setter
			 * <pre>
			 * See the <b>options.dat</b> parameter of the <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
			 * dat = {
			 * 
			 *	gui: new [dat.GUI()]{@link https://github.com/dataarts/dat.gui} instance,
			 *		undefined - do not use dat-gui JavaScript Controller Library. [dat.gui]{@link https://github.com/dataarts/dat.gui}.
			 *	cookie: false,// do not save to cookie all user settings
			 *	cookieName:,// Name of the cookie.
			 *	axesHelperGui: false,// - do not adds a <a href="../../AxesHelper/jsdoc/module-AxesHelperGui.html" target="_blank">AxesHelperGui</a> into [dat.gui]{@link https://github.com/dataarts/dat.gui}.
			 *	stereoEffectsGui: false,// - do not adds <a href="../../StereoEffect/jsdoc/module-StereoEffect-StereoEffect.html#gui" target="_blank">Stereo Effects folder</a> into [dat.gui]{@link https://github.com/dataarts/dat.gui}.
			 *	folderPoint: false,// - do not adds <a href="../../jsdoc/folderPoint/FolderPoint.html" target="_blank">Point settings folder</a> into [dat.gui]{@link https://github.com/dataarts/dat.gui}.
			 *	playerGui: true,// - adds a <a href="../../player/jsdoc/module-Player.html#~Player.gui" target="_blank">Player controllers</a> into [dat.gui]{@link https://github.com/dataarts/dat.gui}.
			 *	guiSelectPoint: true,// - displays the <a href="../../guiSelectPoint/jsdoc/module-GuiSelectPoint.html" target="_blank">Select Point</a>. [dat.gui]{@link https://github.com/dataarts/dat.gui} based graphical user interface for select a point from the mesh.
			 *	guiFrustumPoints: true,// - Adds <a href="../../FrustumPoints/jsdoc/FrustumPoints.html#gui" target="_blank">Frustum Points folder</a> into [dat.gui]{@link https://github.com/dataarts/dat.gui}.
			 *	cameraGui: true,// - Adds <a href="../../jsdoc/CameraGui/module-CameraGui-CameraGui.html" target="_blank">Camera folder</a> into [dat.gui]{@link https://github.com/dataarts/dat.gui}.
			 *	moveScene: true,// - displays the <a href="../../jsdoc/MoveGroupGui/index.html" target="_blank">move group gui</a>.
			 *	spriteTextGui: true,// - displays the <a href="../../SpriteText/jsdoc/module-SpriteTextGui.html" target="_blank">SpriteTextGui</a>.
			 *
			 * }
			 * </pre>
			 **/
			dat: {

				get: function () {

					class Dat{

						/* *
						 * dat options
						 * @param {dat} dat [dat]{@link https://github.com/dataarts/dat.gui}
						 */
						constructor( dat ) {

							dat = dat || {};
							if ( dat.boDat )
								return dat;//duplucate new Options
							function guiParent() {

								//без elMyGuiContainer не будет скроллинга gui
								const elMyGuiContainer = document.createElement( 'div' );
								dat.parent.appendChild( elMyGuiContainer );
								elMyGuiContainer.appendChild( dat.gui.domElement );
								elMyGuiContainer.style.position = 'absolute';//оставляем gui в пределах canvas
								elMyGuiContainer.style.top = '0px';
								elMyGuiContainer.style.right = '0px';

							}
							Object.defineProperties( this, {


								/* *
								 * getter
								 * <pre>
								 * returns true if <b>dat</b> was converted by <b>new Dat( options );</b>
								 * </pre>
								 **/
								boDat: {

									get: function () { return true; },

								},

								/* *
								 * getter and setter
								 * <pre>
								 * [dat]{@link https://github.com/dataarts/dat.gui}
								 * </pre>
								 **/
								dat: {

									get: function () {

										console.warn('get dat depreacated. Use three.dat = dat.');
										return three$1.dat;

									},
									set: function ( dat ) {

										console.warn('Set dat depreacated. Use three.dat = dat.');
										if (

											dat.dat &&
											( dat.dat.constructor.name === dat.constructor.name ) &&
											( dat.dat.constructor.name !== 'Object' )

										)
											console.error( 'duplicate dat.' );
										dat.dat = dat;

									}

								},

								/* *
								 * getter
								 * <pre>
								 * Name of the cookie.
								 * </pre>
								 **/
								cookieName : {

									get: function () { return dat.cookieName ; },

								},

								/* *
								 * getter
								 * <pre>
								 * [dat.GUI()]{@link https://github.com/dataarts/dat.gui} instance.
								 * </pre>
								 **/
								gui: {

									get: function () {

										if ( !dat.gui && three$1.dat ) {

											//если сделать autoPlace: false то не будет скроллинга для gui
											dat.gui = new three$1.dat.GUI();// options.dat.parent ? { autoPlace: false, } : undefined );
											if ( options.dat.parent ) {

												guiParent();

											}

										}
										return dat.gui;

									},

								},
								cookie: {

									get: function () { return dat.cookie; },
									set: function ( cookie ) { dat.cookie = cookie; },

								},
								guiSelectPoint: {

									get: function () { return dat.guiSelectPoint; },
									set: function ( guiSelectPoint ) { dat.guiSelectPoint = guiSelectPoint; },

								},
								cameraGui: {

									get: function () { return dat.cameraGui; },
									set: function ( cameraGui ) { dat.cameraGui = cameraGui; },

								},
								playerGui: {

									get: function () { return dat.playerGui; },

								},
								orbitControlsGui: {

									get: function () { return dat.orbitControlsGui; },

								},
								axesHelperGui: {

									get: function () { return dat.axesHelperGui; },

								},
								playController: {

									get: function () { return dat.playController; },

								},
								stereoEffectsGui: {

									get: function () { return dat.playController; },

								},
								moveScene: {

									get: function () { return dat.moveScene; },

								},
								spriteTextGui: {

									get: function () { return dat.spriteTextGui; },

								},
								folderPoint: {

									get: function () { return dat.folderPoint; },
									set: function ( folderPoint ) { dat.folderPoint = folderPoint; },

								},
								pointLightGui: {

									get: function () { return dat.pointLightGui; },

								},
								parent: {

									get: function () { return dat.parent; },

								},

							} );

							//For debugging. Find a hidden keys
							for ( var propertyName in dat ) {

								if ( this[propertyName] === undefined ) console.error( 'Dat: dat.' + propertyName + ' key is hidden' );

							}

						}

					}
					if ( options.dat === false )
						return options.dat;
					options.dat = new Dat( options.dat );
					if ( options.dat.gui ) {

						//debug
						setTimeout( function () {

							const className = options.dat.gui.domElement.className;
							var guiCount = 0;
							options.dat.gui.domElement.parentElement.childNodes.forEach( function ( node ) {

								if ( node.className === className ) guiCount++;

							} );
							if ( guiCount > 1 )
								console.error( 'Options: duplicate dat.GUI' );

						}, 0 );

						options.dat.gui.domElement.addEventListener( 'mouseenter', function ( event ) { options.dat.mouseenter = true; } );
						options.dat.gui.domElement.addEventListener( 'mouseleave', function ( event ) { options.dat.mouseenter = false; } );

					}
					if ( options.dat.cookie === false ) options.dat.cookie = new cookie.defaultCookie();
					else if ( options.dat.cookie === undefined ) options.dat.cookie = cookie;
					options.dat.getCookieName = function ( cookieName = '' ) {

						const name = options.dat.cookieName ||
							( options.elContainer ?
								typeof options.elContainer === "object" ?
									options.elContainer.id :
									typeof options.elContainer === "string" ?
										options.elContainer :
										'' :
								'' );
						return cookieName + ( ( cookieName !== '' ) && ( name !== '' ) ? '_' : '' ) + name;

					};
					//axesHelperGui: false,
					//playerGui: false,
					//guiSelectPoint: false,
					//moveScene: false,
					//cameraGui: false,
					//stereoEffectsGui: false,
					//spriteTextGui: false,
					//folderPoint: false,
					return options.dat;

				},
				set: function ( dat ) { options.dat = dat; },

			},

			/**
			 * getter
			 * <pre>
			 * Your custom getLanguageCode() function.
			 * returns the "primary language" subtag of the language version of the browser.
			 * Examples: "en" - English language, "ru" Russian.
			 * See the "Syntax" paragraph of RFC 4646 {@link https://tools.ietf.org/html/rfc4646#section-2.1|rfc4646 2.1 Syntax} for details.
			 * Default returns the language code of your browser.
			 * </pre>
			 **/
			getLanguageCode: {

				get: function () {

					if ( typeof options.getLanguageCode === "string" )
						return function () {

							return options.getLanguageCode;

						}
					return options.getLanguageCode || getLanguageCode;

				}

			},

			/**
			 * getter and setter
			 * <pre>
			 * See <b>options.scales</b> parameter of the <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
			 * </pre>
			 **/
			scales: {

				get: function () {

					class Scales {

						/* *
						 * scales
						 * @param {object} scales
						 */
						constructor( scales ) {

							class Scale {

								/* *
								 * scale
								 * @param {object} scales
								 * @param {string} axisName. 'x' or 'y' or 'z'
								 */
								constructor( scales, axisName ) {

									let scale = scales[axisName];
//									scale = scale || {};
									this.isAxis = function () {

										if ( !scales || ( !scales.x && !scales.y && !scales.z ) || scale ) return true;
										return false;
										
									};
									const setScale = (callBack) => {

										if ( !scale ) {

											scales[axisName] = {};
											scale = scales[axisName];

										}
										callBack();
										scale.step = Math.abs( options.scales.w.min - options.scales.w.max ) / 100;
										if ( options.guiSelectPoint) options.guiSelectPoint.setAxisControl( 'w', scale );

									};
									Object.defineProperties( this, {

										/* *
										 * getter
										 * <pre>
										 * returns true if <b>scale</b> was converted by <b>new Scale( scale );</b>
										 * </pre>
										 **/
										boScale: { get: function () { return true; }, },
/*										
										isChangeColor : {
											
											get: () => { return scale ? scale.isChangeColor : undefined; },
											set: ( isChangeColor ) => { scale.isChangeColor = isChangeColor; },
										
										},
*/										
										isColor : {
											
											get: () => { return scale ? scale.isColor : undefined; },
											set: ( isColor ) => { scale.isColor = isColor; },
										
										},
										min: {

											get: () => {

												if ( !scale || !scale.min ) return axisName === 'w' ? 0 : -1;
												return scale.min;

											},
											set: ( min ) => { setScale( () => { scale.min = min; }); },

										},
										max: {

											get: function () {

												//максимальное значение шкалы w по умолчанию беру из THREE.Vector4
												//потому что в противном случае неверно будет отображаться цвет точки, заданной как THREE.Vector4()
												if ( !scale || !scale.max ) return axisName === 'w' ? new three$1.THREE.Vector4().w : 1;
												return scale.max;

											},
											set: ( max ) => { setScale( () => { scale.max = max; }); },

										},
										name: {

											get: function () {

												if ( !scale || ( scale.name === undefined ) ) return axisName;
												return scale.name;

											},
											set: function ( name ) {

												if ( scale ) {
													
													scale.name = name;
													if ( options.guiSelectPoint ) options.guiSelectPoint.setAxisName( axisName, name );

												}
												
											},

										},
										marks: {

											get: function () {

												if ( !scale ) return undefined;
												if ( !scale.marks ) scale.marks = 3;
												return scale.marks;

											},
//											set: function ( marks ) { scale.marks = marks; },

										},

									} );

									//For debugging. Find a hidden keys
									for ( var propertyName in scale ) {

										if ( this[propertyName] === undefined ) console.error( 'Options.Scales: scale.' + propertyName + ' key is hidden' );

									}

								}

							}
							const scalesObject = {

								x: new Scale( options.scales, 'x' ),
								y: new Scale( options.scales, 'y' ),
								z: new Scale( options.scales, 'z' ),
								w: new Scale( options.scales, 'w' ),

							};

							Object.defineProperties( this, {

								/* *
								 * getter
								 * <pre>
								 * returns true if <b>scales</b> was converted by <b>new Scales( scales );</b>
								 * </pre>
								 **/
								boScales: {

									get: function () { return true; },

								},
								x: {

									get: function () { return scalesObject.x; },
									set: function ( x ) {

										if ( x === undefined ) {

											delete scales.x;
											delete scalesObject.x;
											scalesObject.x = new Scale( scales, 'x' );

										} else scales.x = x;
										if ( options.guiSelectPoint ) options.guiSelectPoint.updateScale( 'x' );

									},

								},
								y: {

									get: function () { return scalesObject.y; },
									set: function ( y ) {

										if ( y === undefined ) {

											delete scales.y;
											delete scalesObject.y;
											scalesObject.y = new Scale( scales, 'y' );

										} else scales.y = y;
										if ( options.guiSelectPoint ) options.guiSelectPoint.updateScale( 'y' );

									},

								},
								z: {

									get: function () { return scalesObject.z; },
									set: function ( z ) {

										if ( z === undefined ) {

											delete scales.z;
											delete scalesObject.z;
											scalesObject.z = new Scale( scales, 'z' );

										} else scales.z = z;
										if ( options.guiSelectPoint ) options.guiSelectPoint.updateScale( 'z' );

									},

								},
								w: {

									get: function () { return scalesObject.w; },
									set: function ( w ) { scales.w = w; },

								},

								/* *
								 * getter
								 * <pre>
								 * setW
								 * </pre>
								 **/
								setW: {

									get: function () {

/*
										if ( !scales.setW ) scales.setW = _this.setW;
										return scales.setW;
*/
										return _this.setW;

									},

								},
								/* *
								 * getter and setter
								 * <pre>
								 * true - displays the label and scale of the axes.
								 * </pre>
								 **/
								display: {

									get: function () {

										if ( scales.display === undefined ) scales.display = true;
										return scales.display;

									},
									set: function ( display ) { scales.display = display; },

								},
								/* *
								 * getter and setter
								 * <pre>
								 * options of the text of the marks of AxesHelper
								 * </pre>
								 **/
								text: {

									get: function () {

										if ( scales.text === undefined ) scales.text = {};
										return scales.text;

									},
									set: function ( text ) { scales.text = text; },

								},
								/* *
								 * getter and setter
								 * <pre>
								 * Position of the axes intersection
								 * </pre>
								 **/
								posAxesIntersection: {

									get: function () { return scales.posAxesIntersection; },
									set: function ( posAxesIntersection ) { scales.posAxesIntersection = posAxesIntersection; },

								},

							} );

							//For debugging. Find a hidden keys
							for ( var propertyName in scales ) {

								if ( this[propertyName] === undefined ) console.error( 'Options: scales.' + propertyName + ' key is hidden' );

							}

						}

					}
					if ( !options.scales.boScales )
						options.scales = new Scales( options.scales );
					return options.scales;

				},
				set: function ( scales ) { options.scales = scales; }

			},

			/**
			 * getter
			 * <pre>
			 * Points сolor.
			 * See <b>options.palette</b> parameter of the <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
			 * </pre>
			 **/
			palette: {

				get: function () {

					if ( options.palette === undefined ) options.palette = true;

					switch ( typeof options.palette ) {

						case 'number':
							options.palette = new ColorPicker$1.palette( { palette: options.palette } );
							break;
						case 'boolean':
							if ( options.palette )
								options.palette = new ColorPicker$1.palette();// { palette: ColorPicker.paletteIndexes.BGYW } );
							break;
						case 'string':
							const color = new three$1.THREE.Color(options.palette);
							options.palette = new ColorPicker$1.palette( { palette: [{ percent: 0, r: color.r * 255, g: color.g * 255, b: color.b * 255, },] } );
							break;
						default: {

							//Это условие не выполняется корректро если использовать myThree.module.js или myThree.module.min.js вместо myThree.js
							//if ( options.palette instanceof ColorPicker.palette === false )
	   
							if ( Array.isArray( options.palette ) )
								options.palette = new ColorPicker$1.palette( { palette: options.palette } );//Custom palette
							else if ( !options.palette.isPalette() )
								console.error( 'MyThree: invalid typeof options.palette: ' + typeof options.palette );

						}

					}
					return options.palette;

				},

			},

			/**
			 * getter
			 * <pre>
			 * returns true if <b>options</b> was converted by <b>new Options( options );</b>
			 * </pre>
			 **/
			boOptions: {

				get: function () { return true;/*options.boOptions;*/ },

			},

			/**
			 * getter
			 * <pre>
			 * returns {
			 *
			 * 	size = 5.0; point size
			 * 	sizePointsMaterial = 100.0; The <b>size</b> property of the parameters of the [THREE.PointsMaterial]{@link https://threejs.org/docs/index.html?q=PointsMaterial#api/en/materials/PointsMaterial}.
			 *
			 * }
			 * </pre>
			 **/
			point: {

				get: function () {
					return {

						get size() { return options.point.size; },
						set size( size ) {

							if ( options.point.size === size ) return;
							options.point.size = size;
							if ( options.dat && options.dat.folderPoint ) options.dat.folderPoint.size.setValue( size );

						},

						get sizePointsMaterial() { return options.point.sizePointsMaterial; },
						set sizePointsMaterial( sizePointsMaterial ) { options.point.sizePointsMaterial = sizePointsMaterial;},

					};

				},

			},

			/**
			 * getter
			 * <pre>
			 * <b>SpriteText</b> options
			 * See <b>options</b> parameter of the <a href="../../SpriteText/jsdoc/module-SpriteText.html" target="_blank">SpriteText</a>.
			 * </pre>
			 **/
			spriteText: {

				get: function () {

					if ( options.spriteText ) return options.spriteText;
					return {};

				},

			},

			/**
			 * getter and setter
			 * [Raycaster]{@link https://threejs.org/docs/index.html#api/en/core/Raycaster}.
			 **/
			raycaster: {

				get: function () {

					if ( options.raycaster ) return options.raycaster;

				},
				set: function ( raycaster ) { options.raycaster = raycaster; }

			},

			/**
			 * getter and setter
			 * <pre>
			 * [PerspectiveCamera]{@link https://threejs.org/docs/index.html#api/en/cameras/PerspectiveCamera}.
			 * See <b>options.camera</b> parameter of the <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
			 * </pre>
			 **/
			camera: {

				get: function () {

					options.camera = options.camera || {};
					if ( !options.camera.position ) options.camera.position = new three$1.THREE.Vector3( 0.4, 0.4, 2 );
					if ( !options.camera.scale ) options.camera.scale = new three$1.THREE.Vector3( 1, 1, 1 );
					return options.camera;

				},
				set: function ( camera ) { options.camera = camera; }

			},

			/**
			 * getter
			 * <pre>
			 * Camera looking at selected point during playing. See the <b>cameraTarget</b> parameter of the <a href="../../player/jsdoc/module-Player-Player.cameraTarget.html#init" target="_blank">Player.cameraTarget.init(...)</a> function for details.
			 * See <b>options.cameraTarget</b> parameter of the <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
			 * </pre>
			 **/
			cameraTarget: {

				get: function () { return options.cameraTarget; },

			},

			/**
			 * getter
			 * <pre>
			 * The <b>HTMLElement</b>, contains a <b>canvas</b>.
			 * See <b>options.elContainer</b> parameter of the <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
			 * </pre>
			 **/
			elContainer: {

				get: function () { return options.elContainer; },

			},

			/**
			 * getter and setter
			 * <pre>
			 * true - use my <a href="../../canvasMenu/jsdoc/index.html" target="_blank">dropdown menu for canvas</a> in my version of [dat.gui]{@link https://github.com/anhr/dat.gui}.
			 * See <b>options.canvasMenu</b> parameter of the <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
			 * </pre>
			 **/
			canvasMenu: {

				get: function () { return options.canvasMenu; },
				set: function ( canvasMenu ) {

					if ( options.canvasMenu && ( options.canvasMenu !== true ) && ( options.canvasMenu !== false ) ) console.warn( 'Duplicate canvasMenu' );
					options.canvasMenu = canvasMenu;

				}

			},

			/**
			 * getter
			 * <pre>
			 * <b>canvas</b> properties.
			 * See <b>options.canvas</b> parameter of the <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
			 * </pre>
			 **/
			canvas: {

				get: function () {

					if ( options.canvas ) return options.canvas;
					return { fullScreen: true, }

				},

			},

			/**
			 * getter and setter
			 * <pre>
			 * Creates a <a href="../../frustumPoints/jsdoc/index.html" target="_blank">FrustumPoints</a> instance.
			 * See <b>options.frustumPoints</b> parameter of the <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
			 * </pre>
			 **/
			frustumPoints: {

				get: function () { return options.frustumPoints; },
				set: function ( frustumPoints ) {

					if (

						options.frustumPoints &&
						( options.frustumPoints.constructor.name === frustumPoints.constructor.name ) &&
						( options.frustumPoints.constructor.name !== 'Object' )

					)
						console.error( 'duplicate frustumPoints.' );
					options.frustumPoints = frustumPoints;

				}

			},

			/**
			 * getter and setter
			 * <pre>
			 * Use <a href="../../StereoEffect/jsdoc/index.html" target="_blank">StereoEffect</a>.
			 * See <b>options.stereoEffect</b> parameter of the <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
			 * </pre>
			 **/
			stereoEffect: {

				get: function () { return options.stereoEffect; },
				set: function ( stereoEffect ) {

					if (

						options.stereoEffect &&
						( options.stereoEffect.constructor.name === stereoEffect.constructor.name ) &&
						( options.stereoEffect.constructor.name !== 'Object' )

					)
						console.error( 'duplicate stereoEffect.' );
					options.stereoEffect = stereoEffect;

				}

			},

			/**
			 * getter and setter
			 * <pre>
			 * Use <a href="../../player/jsdoc/index.html" target="_blank">Player</a>.
			 * See <b>options.player</b> parameter of the <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
			 * </pre>
			 **/
			player: {

				get: function () { return options.player; },
				set: function ( player ) {

					if ( options.player ) console.error( 'duplicate player.' );
					options.player = player;

				}

			},

			/**
			 * getter
			 * <pre>
			 * current time of the <a href="../../player/jsdoc/index.html" target="_blank">Player</a>.
			 * </pre>
			 **/
			time: {

				get: function () {

					if ( options.player )
						return options.player.getTime();
					return 0;

				},

			},

			/**
			 * getter and setter
			 * <pre>
			 * Use <a href="../../axesHelper/jsdoc/index.html" target="_blank">AxesHelper</a>.
			 * See <b>options.axesHelper</b> parameter of the <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
			 * </pre>
			 **/
			axesHelper: {

				get: function () { return options.axesHelper; },
				set: function ( axesHelper ) {

					if ( options.axesHelper ) console.error( 'duplicate axesHelper.' );
					options.axesHelper = axesHelper;

				}

			},

			/**
			 * getter and setter
			 * <pre>
			 * Use <a href="../../canvasMenu/jsdoc/index.html" target="_blank">CanvasMenu</a>.
			 * See <b>options.canvasMenu</b> parameter of the <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
			 * </pre>
			 **/
			canvasMenu: {

				get: function () { return options.canvasMenu; },
				set: function ( canvasMenu ) {

					if ( options.canvasMenu ) console.error( 'duplicate canvasMenu.' );
					options.canvasMenu = canvasMenu;

				}

			},

			/**
			 * getter and setter
			 * <pre>
			 * Use [OrbitControls]{@link https://threejs.org/docs/index.html?q=orb#examples/en/controls/OrbitControls}.
			 * See <b>options.orbitControls</b> parameter of the <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
			 * </pre>
			 **/
			orbitControls: {

				get: function () { return options.orbitControls; },
				set: function ( orbitControls ) {

					if (

						options.orbitControls &&
						( options.orbitControls.constructor.name === orbitControls.constructor.name ) &&
						( options.orbitControls.constructor.name !== 'Object' )

					)
						console.error( 'duplicate orbitControls.' );
					options.orbitControls = orbitControls;

				}

			},

			/**
			 * getter returns 1
			 **/
			scale: {

				get: function () { return 1; },

			},

			/**
			 * getter
			 * <pre>
			 * Use <a href="../../jsdoc/pointLight/index.html" target="_blank">pointLight</a>.
			 * See <b>options.pointLight</b> parameter of the <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
			 * </pre>
			 **/
			pointLight: {

				get: function () { return options.pointLight; },

			},

			/**
			 * getter
			 * <pre>
			 * <a href="../../player/jsdoc/module-Player-Player.cameraTarget.html" target="_blank">Player.cameraTarget</a> class instance. Functions for camera for looking at selected point.
			 * </pre>
			 **/
			cameraTarget: {

				get: function () { return options.cameraTarget; },

			},

			/**
			 * getter and setter
			 * <pre>
			 * Mouse events listeners for [Raycaster]{@link https://threejs.org/docs/index.html?q=Raycaster#api/en/core/Raycaster} instance.
			 * See <a href="../../jsdoc/Options/Raycaster_EventListeners.html" target="_blank">EventListeners</a> class.
			 * </pre>
			 **/
			eventListeners: {

				get: function () {

					if ( options.eventListeners ) return options.eventListeners;
/*если я это оставлю, то не смогу определить, используется ли raycaster на этом canvas и нужно ли вызывать addParticle
для проверки создать MyPoints на пустом canvas
					return { addParticle: function(){

						console.error( 'Options.eventListeners.addParticle: call new Options.raycaster.EventListeners(...) first.' );
						
					}, }
*/					

				},
				set: function ( eventListeners ) {

					if ( options.eventListeners )
						console.error( 'duplicate eventListeners.' );
					options.eventListeners = eventListeners;

				}

			},

			/**
			 * getter and setter
			 * <pre>
			 * Use <a href="../../guiSelectPoint/jsdoc/" target="_blank">GuiSelectPoint</a>.
			 * </pre>
			 **/
			guiSelectPoint: {

				get: function () { return options.guiSelectPoint; },
				set: function ( guiSelectPoint ) {

					if ( options.guiSelectPoint && ( guiSelectPoint != undefined ) )
						console.error( 'duplicate guiSelectPoint.' );
					options.guiSelectPoint = guiSelectPoint;

				}

			},

			/**
			 * getter
			 * <pre>
			 * Controllers list.
			 * User can see and edit some parameters on the web page.
			 * <b>t</b>: Object for view and edit of the current <a href="../../player/jsdoc/index.html" target="_blank">Player</a> time.
			 * 
			 *	Keys:
			 *		<b>controller</b>:
			 *			<b>HTMLElement</b> for view and edit of the current <a href="../../player/jsdoc/index.html" target="_blank">Player</a> time
			 *			or <b>string</b> of <b>HTMLElement</b> id.
			 *		<b>elName</b>:
			 *			<b>HTMLElement</b> name of the time parameter. See <b>settings.options.playerOptions.name</b> parameter of <a href="../../player/jsdoc/module-Player-Player.html" target="_blank">Player</a>
			 *			or <b>string</b> of <b>HTMLElement</b> id.
			 * </pre>
			 *
			 * See <b>options.controllers</b> parameter of <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a>.
			 * </pre>
			 **/
			controllers: {//не засунул это в options.playerOptions потому что при чтение из cockie теряется HTMLElement

				get: function () {

					class Controllers{

						/* *
						 * dat options
						 * @param {dat} dat [dat]{@link https://github.com/dataarts/dat.gui}
						 */
						constructor( controllers ) {
							controllers = controllers || {};
							Object.defineProperties( this, {

								/* *
								 * getter
								 * <pre>
								 * returns true if <b>controllers</b> was converted by <b>new Controllers( controllers );</b>
								 * </pre>
								 **/
								boControllers: {

									get: function () { return true; },

								},

								/* *
								 * getter
								 * <pre>
								 * Object for view and edit of the current <a href="../../player/jsdoc/index.html" target="_blank">Player</a> time.
								 * Keys:
								 *	<b>controller</b>:
								 *		<b>HTMLElement</b> for view and edit of the current <a href="../../player/jsdoc/index.html" target="_blank">Player</a> time
								 *		or <b>string</b> of <b>HTMLElement</b> id.
								 *	<b>elName</b>:
								 *		<b>HTMLElement</b> name of the time parameter. See <b>settings.options.playerOptions.name</b> parameter of <a href="../../player/jsdoc/module-Player-Player.html" target="_blank">Player</a>
								 *		or <b>string</b> of <b>HTMLElement</b> id.
								 * </pre>
								 **/
								t: {

									get: function () {

										if ( controllers.t === null )
											console.error( 'options.controllers.t = ' + controllers.t );
										const elTime = document.getElementById( 'time' );
										if ( !controllers.t ) {

											if ( !elTime ) return;
											controllers.t = { elName: document.getElementById( 'tName' ), };

										}
										if ( !controllers.t.controller && elTime ) controllers.t.controller = elTime;
										if ( controllers.t ) {

											createController( controllers.t, 't',
												function () { return  options.playerOptions && options.playerOptions.name ? options.playerOptions.name : 't'; }, {

												onchange: function ( event ) {

													if ( !options.player ) {

														console.error( 'options.controllers.t.onchange: create Player instance first. ' + controllers.t.value );
														return;

													}
													if ( options.player.setTime( controllers.t.controller.value ) === false ) {

														alert( lang.timeAlert + controllers.t.controller.value );
														controllers.t.controller.focus();

													}

												},

											} );
											if ( ( typeof lang !== 'undefined' ) && ( controllers.t.controller.title === '' ) )
												controllers.t.controller.title = lang.controllerTTitle;
												
										}
										return controllers.t;

									},

								},

								/* *
								 * getter
								 * <pre>
								 * List of <a href="../../player/jsdoc/index.html" target="_blank">Player</a> buttons on the web page.
								 * Keys:
								 *	<b>buttonPrew</b>:
								 *		<b>HTMLElement</b> Previous players tick.
								 *		or <b>string</b> of <b>HTMLElement</b> id.
								 *	<b>buttonPlay</b>:
								 *		<b>HTMLElement</b> play or pause.
								 *		or <b>string</b> of <b>HTMLElement</b> id.
								 *	<b>buttonNext</b>:
								 *		<b>HTMLElement</b> Next players tick.
								 *		or <b>string</b> of <b>HTMLElement</b> id.
								 * </pre>
								 **/
								player: {

									get: function () { return controllers.player; },

								},

							} );

							//For debugging. Find a hidden keys
							for ( var propertyName in controllers ) {

								if ( this[propertyName] === undefined ) console.error( 'Controllers: controllers.' + propertyName + ' key is hidden' );

							}

						}

					}
					if ( boCreateControllers === undefined ) {

						boCreateControllers = true;
						const time = document.getElementById( 'time' ),
							prev = document.getElementById( 'prev' ),
							play = document.getElementById( 'play' ),
							next = document.getElementById( 'next' ),
							boPlayer = prev || play || next ? true : false,
							boControllers = time || boPlayer ? true : false;
						if ( !options.controllers && boControllers ) {

							options.controllers = { t: {} };
							if ( time ) options.controllers.t.controller = time;

						}
						if ( options.controllers ) {

							if ( !options.controllers.player && boPlayer ) options.controllers.player = {};
							if ( options.controllers.player ) {

								if ( !options.controllers.player.buttonPrev && prev ) options.controllers.player.buttonPrev = prev;
								if ( !options.controllers.player.buttonPlay && play ) options.controllers.player.buttonPlay = play;
								if ( !options.controllers.player.buttonNext && next ) options.controllers.player.buttonNext = next;

							}

						}

					}
					if ( options.controllers && !options.controllers.boControllers )
						options.controllers = new Controllers( options.controllers );
					return options.controllers;

				},

			},

			/**
			 * getter
			 * <pre>
			 * title
			 * </pre>
			 **/
			title: {

				get: function () { return options.title; }

			},

			/**
			 * getter and setter
			 * <pre>
			 * traces
			 * </pre>
			 **/
			traces: {

				get: () => { return options.traces; },
				set: ( traces ) => { options.traces = traces; }

			},

		} ); 

		//For debugging. Find a hidden keys
		for( var propertyName in options ) {

		   if ( this[propertyName] === undefined ) console.error( 'Options: options.' + propertyName + ' key is hidden' );

		}
		this.playerOptions.cameraTarget.init( this.cameraTarget, this, false );

		//Localization

		lang = {

			timeAlert: 'Invalid time fromat: ',
			controllerTTitle: 'Current time.',

		};
		switch ( this.getLanguageCode() ) {

			case 'ru'://Russian language

				lang.timeAlert = 'Неправильный формат времени: ';
				lang.controllerTTitle = 'Текущее время.';

				break;
			default://Custom language
				if ( ( options.lang === undefined ) || ( options.lang.languageCode != languageCode ) )
					break;

				Object.keys( options.lang ).forEach( function ( key ) {

					if ( lang[key] === undefined )
						return;
					lang[key] = options.lang[key];

				} );

		}

		if ( !three$1.options ) three$1.options = this;

	}

} 

/**
 * Finds on the [Scene]{@link https://threejs.org/docs/index.html?q=Scene#api/en/scenes/Scene} a child item of the "Sprite" type and "spriteTextIntersection" name.
 * @param {THREE.Scene} scene [Scene]{@link https://threejs.org/docs/index.html?q=Scene#api/en/scenes/Scene} instance.
 * @returns item of the "Sprite" type and "spriteTextIntersection" name or undefined.
 */
Options.findSpriteTextIntersection = function ( scene ) {

	var spriteTextIntersection;
	scene.children.forEach( function ( item ) {

		if ( ( item.type === "Sprite" ) && ( item.name === Options.findSpriteTextIntersection.spriteTextIntersectionName ) ) {

			spriteTextIntersection = item;
			return;

		}

	} );
	return spriteTextIntersection;

};
/**
 * @returns "spriteTextIntersection"
 * */
Options.findSpriteTextIntersection.spriteTextIntersectionName = 'spriteTextIntersection';

class Raycaster {

	/**
	 * [Raycaster]{@link https://threejs.org/docs/index.html#api/en/core/Raycaster} methods.
	 * */
	constructor() {

		var cursor;
		/**
		 * @description Displays a sprite text if you move mouse over an 3D object
		 * @param {Object} intersection See [.intersectObject]{@link https://threejs.org/docs/index.html#api/en/core/Raycaster.intersectObject} for details.
		 * @param {Options} options the following options are available.
		 * See the <b>options</b> parameter of the <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
		 * @param {object} [options.spriteText] spriteText options. See <a href="../../SpriteText/jsdoc/module-SpriteText.html" target="_blank">SpriteText</a> <b>options</b> parameter for details.
		 * @param {object} [options.scales] axes scales.
		 * See <b>options.scales</b> parameter of the <a href="../../AxesHelper/jsdoc/module-AxesHelper-AxesHelper.html" target="_blank">AxesHelper</a> class for details.
		 * @param {THREE.Scene} scene [Scene]{@link https://threejs.org/docs/index.html?q=sc#api/en/scenes/Scene}.
		 * @param {THREE.Camera} camera [PerspectiveCamera]{@link https://threejs.org/docs/index.html?q=persp#api/en/cameras/PerspectiveCamera}.
		 * @param {THREE.WebGLRenderer} renderer [WebGLRenderer]{@link https://threejs.org/docs/index.html?q=WebGLRenderer#api/en/renderers/WebGLRenderer} instance.
		 */
		this.onIntersection = function ( intersection, options, scene, camera, renderer ) {

			//во вселенной запретить выводить сообщение об ошибке, когда пользователь проводит мышку над вершиной.
			if ( intersection.object.userData.myObject ) intersection.object.userData.myObject.guiPoints.boMouseOver = true;
			
			const drawRange = intersection.object.geometry.drawRange;
			if ((intersection.index < drawRange.start) || ((drawRange.count != Infinity) && (intersection.index >= (drawRange.start + drawRange.count)))) return false;
			const canvas = renderer.domElement;
			if ( intersection.object.userData.isInfo !== undefined && !intersection.object.userData.isInfo() )
				return false;
			var spriteTextIntersection = Options.findSpriteTextIntersection( scene );
			if ( spriteTextIntersection && ( !intersection.pointSpriteText || ( intersection.object.userData.raycaster && intersection.object.userData.raycaster.text ) ) ) {
				
				scene.remove( spriteTextIntersection );
				spriteTextIntersection = undefined;

			}
			if ( spriteTextIntersection === undefined ) {

				options = new Options( options );
				const rect = options.spriteText.rect ? JSON.parse( JSON.stringify( options.spriteText.rect ) ) : {};
				rect.displayRect = true;
				rect.backgroundColor = 'rgba(0, 0, 0, 1)';
				spriteTextIntersection = StereoEffect.getTextIntersection( intersection, {

					scales: options.scales,
					spriteOptions: {

						textHeight: options.spriteText.textHeight,
						fontColor: options.spriteText.fontColor,
						rect: rect,
						group: scene,
						center: {

							camera: camera,
							canvas: canvas,

						}

					}

				} );
				spriteTextIntersection.scale.divide( scene.scale );
				scene.add( spriteTextIntersection );
				
				if ( cursor === undefined ) cursor = renderer.domElement.style.cursor;
				renderer.domElement.style.cursor = 'pointer';

			} else if ( intersection.pointSpriteText ) spriteTextIntersection.position.copy( intersection.pointSpriteText );
			return true;

		};

		/**
		 * @description Hides a sprite text if you move mouse out an object.
		 * @param {THREE.Scene} scene [Scene]{@link https://threejs.org/docs/index.html?q=sc#api/en/scenes/Scene}.
		 * @param {THREE.WebGLRenderer} renderer [WebGLRenderer]{@link https://threejs.org/docs/index.html?q=WebGLRenderer#api/en/renderers/WebGLRenderer} instance.
		 */
		this.onIntersectionOut = function ( scene, renderer ) {

			var detected = false;
			do {

				var spriteTextIntersection = Options.findSpriteTextIntersection( scene );
				if ( spriteTextIntersection !== undefined ) {

					scene.remove( spriteTextIntersection );
					if ( detected )
						console.error( 'Duplicate spriteTextIntersection' );
					detected = true;

				}

			} while ( spriteTextIntersection !== undefined )

			//во вселенной разрешить выводить сообщение об ошибке, когда пользователь проводит мышку над вершиной.
			intersectedObjects.forEach( ( intersectedObject ) => { if ( intersectedObject.object.userData.myObject )delete intersectedObject.object.userData.myObject.guiPoints.boMouseOver; } );			renderer.domElement.style.cursor = cursor;

		};
		/**
		 * @description The [pointerdown]{@link https://developer.mozilla.org/en-US/docs/Web/API/Document/pointerdown_event}
		 * event is fired when a pointer becomes active. For mouse, it is fired when the device transitions from no buttons depressed to at least one button depressed. For touch, it is fired when physical contact is made with the digitizer. For pen, it is fired when the stylus makes physical contact with the digitizer.
		 * @param {Object} intersection See [.intersectObject]{@link https://threejs.org/docs/index.html#api/en/core/Raycaster.intersectObject} for details.
		 * @param {Options} options the following options are available.
		 * @param {GuiSelectPoint} [options.guiSelectPoint] <a href="../../guiSelectPoint/jsdoc/index.html" target="_blank">GuiSelectPoint</a> instance was created.
		 * @param {AxesHelper} [options.axesHelper] <a href="../../AxesHelper/jsdoc/index.html" target="_blank">AxesHelper</a> instance was created.
		 */
		this.onMouseDown = function ( intersection, options ) {

			if ( ( intersection.object.userData.isInfo !== undefined ) && !intersection.object.userData.isInfo() )
				return;//No display information about frustum point
			if ( options.guiSelectPoint && intersection.object.userData.myObject) {
				
//				intersection.object.userData.myObject.guiPoints.verticeId = intersection.index;
				const guiPoints = intersection.object.userData.myObject.guiPoints, searchNearestEdgeVerticeId = guiPoints.searchNearestEdgeVerticeId;
				guiPoints.verticeId = searchNearestEdgeVerticeId ? searchNearestEdgeVerticeId(intersection.index, intersection) : intersection.index;

				//Заменить индекс ребра на индекс ближайшего конца ребра в гиперсфере
				//Если убрать эту строку, то неправильно отображается гиперсфера если с помощью мыши выбрать ребро
				//Для теста открыть http://localhost/anhr/commonNodeJS/master/HyperSphere/Examples/hyperSphere.html
				//Отобразить ребра
				//Щелкнуть мышом по ребру
				if ( ( guiPoints.isSetIntersectionIndex != false ) && ( guiPoints.verticeId != undefined ) ) intersection.index = guiPoints.verticeId;
				
				options.guiSelectPoint.select( intersection );
				
				const mesh = intersection.object;
				if ( mesh && mesh.userData.gui && mesh.userData.gui.reset ) mesh.userData.gui.reset( guiPoints.verticeId );

				//если не удалить guiPoints.verticeId, то будет неверно изменяться позиция вершины во вселенной
				//Для проверки открыть http://localhost/anhr/universe/main/hyperSphere/Examples/
				//Щелчком мыши выбрать вершину
				//Сделать один шаг проигрывателя, нажав →
				delete guiPoints.verticeId;
				
			} else {

				if ( intersection.object.userData.onMouseDown ) intersection.object.userData.onMouseDown( intersection );
				if ( options.axesHelper ) options.axesHelper.exposePosition( intersection );

			}

		};
		const intersectedObjects = [];
		var intersects;
		/**
		 * @description Intersection of the mouse pointer in or out of a 3D object.
		 * @param {Array} particles array of [Mechs]{@link https://threejs.org/docs/index.html#api/en/objects/Mesh} or derived class objects to check for intersection with the ray.
		 * See <a href="../../jsdoc/Options/Raycaster_EventListeners.html#addParticle" target="_blank">addParticle</a>.
		 * @param {THREE.Raycaster} raycaster [Raycaster]{@link https://threejs.org/docs/index.html?q=Ray#api/en/core/Raycaster}
		 * @param {THREE.WebGLRenderer} renderer [WebGLRenderer]{@link https://threejs.org/docs/index.html?q=Renderer#api/en/renderers/WebGLRenderer}
		 * @param {THREE.Vector2} mouse mouse position.
		 * @param {Object} [settings={}] the following settings are available
		 * @param {Options} [settings.options={}] <b>Options</b> instance
		 * @param {THREE.Camera} settings.camera [PerspectiveCamera]{@link https://threejs.org/docs/index.html?q=persp#api/en/cameras/PerspectiveCamera} instance
		 * @param {THREE.Scene} settings.scene [Scene]{@link https://threejs.org/docs/index.html?q=scene#api/en/scenes/Scene} instance.
		 * @returns Array of interseted with ray 3D objects. 
		 * See [intersectObjects]{@link https://threejs.org/docs/index.html?q=raycaster#api/en/core/Raycaster.intersectObjects}
		 * and [intersectObject]{@link https://threejs.org/docs/index.html?q=raycaster#api/en/core/Raycaster.intersectObject}.
		 */
		this.intersectionsInOut = function ( particles, raycaster, renderer, mouse, settings = {} ) {

			function getIntersects() {

				if ( particles === undefined )
					return;
				intersects = Array.isArray( particles ) ? raycaster.intersectObjects( particles ) : raycaster.intersectObject( particles );

			}
			getIntersects();
//			intersects.forEach( function ( intersection )
			for (let i = 0; i < intersects.length; i++){

				const intersection = intersects[i];
				
				//Когда создаем SpriteText с информацией об объекте, на которую наведена мышка,
				//иногда этот текст загораживается объектами, которые расположены ближе к камере
				//Для решения проблемы текст надо перенести ближе к камере
				const three = window.__myThree__.three;
				intersection.pointSpriteText = new three.THREE.Vector3();
				//Так и не понял почему в режиме стерео текст отображается в неправильном месте
				if ( settings.options.stereoEffect && ( settings.options.stereoEffect.settings.spatialMultiplex === StereoEffect.spatialMultiplexsIndexs.Mono ) )
					raycaster.ray.at( three.options.camera.near + (three.options.camera.far - three.options.camera.near)/1000, intersection.pointSpriteText );
				//Поэтому оставляю как было раньше
				else intersection.pointSpriteText = intersection.point;

				var boDetected = false;
				intersectedObjects.forEach( function ( intersectedObject ) {

					if ( intersectedObject.object === intersection.object ) {

						boDetected = true;
						return;

					}

				} );
				if ( !boDetected ) {

					intersectedObjects.push( intersection );

				}
				if (
					intersection &&
					intersection.object.userData.raycaster &&
					intersection.object.userData.raycaster.onIntersection
				) 
				intersection.object.userData.raycaster.onIntersection( intersection, mouse );
				else {

					if ( !settings.scene )
						console.error( 'THREE.Raycaster.setStereoEffect(): settings.scene = ' + settings.scene );
					else if (Options.raycaster.onIntersection( intersection, settings.options, settings.scene, settings.camera, renderer )) return;

				}

			}
			intersectedObjects.forEach( function ( intersectedObject ) {

				var boDetected = false;
				intersects.forEach( function ( intersection ) {

					if ( intersectedObject.object === intersection.object )
						boDetected = true;

				} );
				if ( !boDetected ) {

					if (
						intersectedObject.object.userData.raycaster &&
						intersectedObject.object.userData.raycaster.onIntersectionOut
					)
						intersectedObject.object.userData.raycaster.onIntersectionOut();
					else if ( settings.scene ) Options.raycaster.onIntersectionOut( settings.scene, renderer );

					intersectedObjects.splice( intersectedObjects.findIndex( v => v === intersectedObject ), 1 );

				}

			} );
			return intersects;

		};

		/**
		 * @class
		 */
		this.EventListeners = class {

			/**
			 * Create a mouse events listeners for [Raycaster]{@link https://threejs.org/docs/index.html#api/en/core/Raycaster} instance.
			 * <p>
			 * The following events are listening.
			 *	<ul>
			 *		<li><b>mousemove</b>. Is fired at an element when a pointing device (usually a mouse) is moved while the cursor's hotspot is inside it.
			 *			See [Element: mousemove event]{@link https://developer.mozilla.org/en-US/docs/Web/API/Element/mousemove_event}. </li>
			 *		<li><b>pointerdown</b>. Is fired when a pointer becomes active. For mouse, it is fired when the device transitions from no buttons depressed to at least one button depressed. For touch, it is fired when physical contact is made with the digitizer. For pen, it is fired when the stylus makes physical contact with the digitizer.
			 *			See [Document: pointerdown event]{@link https://developer.mozilla.org/en-US/docs/Web/API/Document/pointerdown_event}. </li>
			 *	</ul>
			 * </p>
			 * <p>
			 * You can customize your 3D object for following events by add <b>raycaster</b> property into [Object3D.userData]{@link https://threejs.org/docs/index.html?q=mes#api/en/core/Object3D.userData}.
			 *	<ul>
			 *		<li><b>onIntersection</b>. Callback function that take as input the [intersectObject]{@link https://threejs.org/docs/index.html#api/en/core/Raycaster.intersectObject}, and <b>mouse position</b>.
			 *			Fires after intersection of the mouse pointer with a 3D object. </li>
			 *		<li><b>onIntersectionOut</b>. Callback function.
			 *			Fires if mouse pointer leaves of intersection with the 3D object.</li>
			 *		<li><b>onMouseDown</b>. Callback function that take as input the [intersectObject]{@link https://threejs.org/docs/index.html#api/en/core/Raycaster.intersectObject}.
			 *			User has clicked over 3D object.</li>
			 *	</ul>
			 * </p>
			 * <pre>
			 * Example:<b>
cube.userData.raycaster = {

	onIntersection: function ( intersection, mouse ) {

		if ( cube.userData.currentHex === undefined )
			cube.userData.currentHex = cube.material.emissive.getHex();
		cube.material.emissive.setHex( 0xff0000 );
		Options.raycaster.onIntersection( intersection, options, group, camera, renderer );

	},
	onIntersectionOut: function () {

		if ( cube.userData.currentHex !== undefined )
			cube.material.emissive.setHex( cube.userData.currentHex );
		cube.userData.currentHex = undefined;
		Options.raycaster.onIntersectionOut( group, renderer );

	},
	onMouseDown: function ( intersection ) {

		alert( 'Clicked over cube.' );

	},

}
			 * </b></pre>
			 * @param {THREE.Camera} camera [PerspectiveCamera]{@link https://threejs.org/docs/index.html?q=persp#api/en/cameras/PerspectiveCamera} instance
			 * @param {THREE.WebGLRenderer} renderer [WebGLRenderer]{@link https://threejs.org/docs/index.html#api/en/renderers/WebGLRenderer} instance
			 * @param {Object} [settings={}] the following settings are available
			 * @param {Options} [settings.options={}] <b>Options</b> instance
			 * @param {number} [settings.threshold=0.03] Precision of the raycaster when intersecting objects, in world units.
			 * See [Raycaster.params]{@link https://threejs.org/docs/#api/en/core/Raycaster.params}.
			 */
			constructor( camera, renderer, settings = {} ) {

				var intersectedObject;//, intersects;
				const THREE = three$1.THREE, mouse = new THREE.Vector2(), particles = [],
					raycaster = new THREE.Raycaster(), options = settings.options || {};
				raycaster.params.Points.threshold = settings.threshold !== undefined ? settings.threshold : 0.03;
				raycaster.params.Line.threshold = raycaster.params.Points.threshold;

				if ( raycaster.setStereoEffect ) {

					//the precision of the raycaster when intersecting objects, in world units.
					//See https://threejs.org/docs/#api/en/core/Raycaster.params.

					raycaster.setStereoEffect( {

						options: settings.options,
						renderer: renderer,
						camera: camera,
						scene: settings.scene,
						stereoEffect: options.stereoEffect,
						raycasterEvents: false,

					} );

				}

				const domElement = options.renderer ? options.renderer.domElement : window;
				
				//Is fired at an element when a pointing device (usually a mouse) is moved while the cursor's hotspot is inside it.
				//See https://developer.mozilla.org/en-US/docs/Web/API/Element/mousemove_event
				domElement.addEventListener( 'mousemove', function ( event ) {

					if ( raycaster.stereo !== undefined ) {

						raycaster.stereo.onDocumentMouseMove( event );
						return;

					}

					Options.raycaster.EventListeners.getRendererSize( renderer ).getMousePosition( mouse, event );

					//Raycaster https://threejs.org/docs/index.html#api/en/core/Raycaster

					// update the picking ray with the camera and mouse position
					raycaster.setFromCamera( mouse, camera );
					// calculate objects intersecting the picking ray
					intersects = raycaster.intersectObjects( particles );
					if ( !intersects )
						return;
					if ( intersects.length === 0 ) {

						if ( intersectedObject ) {

							if ( intersectedObject.userData.raycaster && intersectedObject.userData.raycaster.onIntersectionOut )
								intersectedObject.userData.raycaster.onIntersectionOut();
							else Options.raycaster.onIntersectionOut( settings.scene, renderer );
							intersectedObject = undefined;

						}

					} else {

						const intersect = intersects[0], object = intersect.object;
						if ( object.userData.raycaster && object.userData.raycaster.onIntersection ) object.userData.raycaster.onIntersection( intersect, mouse );
						else Options.raycaster.onIntersection( intersect, options, settings.scene, camera, renderer );
						intersectedObject = object;

					}

				}, false );

				//ATTENTION!!! The 'mousedown' event is not fired you use new version of the OrbitControls.
				//See "OrbitControls: Implement Pointer events." commit https://github.com/mrdoob/three.js/commit/1422e36e9facbdc5f9d86cf6b97b005a2723a24a#diff-3285de3826a51619836a5c9adc6bee74
				//window.addEventListener( 'mousedown', function( event )
				//is fired when a pointer becomes active. For mouse, it is fired when the device transitions from no buttons depressed to at least one button depressed. For touch, it is fired when physical contact is made with the digitizer. For pen, it is fired when the stylus makes physical contact with the digitizer.
				//See https://developer.mozilla.org/en-US/docs/Web/API/Document/pointerdown_event
				domElement.addEventListener( 'pointerdown', function ( event ) {

					if ( raycaster === undefined )
						return;
					if ( intersects && ( intersects.length > 0 ) ) {

						const intersect = intersects[0];
						if ( intersect.object.userData.raycaster && intersect.object.userData.raycaster.onMouseDown )
							intersect.object.userData.raycaster.onMouseDown( intersect, event );//передаем состояние кнопок мыши
						else Options.raycaster.onMouseDown( intersect, options );

					}

				}, false );
				function isAddedToParticles( particle ) { return particles.includes( particle ); }				/**
				 * Adds new particle into array of objects to check for intersection with the ray.
				 * @see <b>objects</b> parameter of the [Raycaster.intersectObjects]{@link https://threejs.org/docs/index.html#api/en/core/Raycaster.intersectObjects} for details.
				 * @param {THREE.Mesh} particle The [Mech]{@link https://threejs.org/docs/index.html#api/en/objects/Mesh} or derived class instance for check for intersection with the ray.
				 */
				this.addParticle = function ( particle ) {

					if ( particle.userData.boFrustumPoints )
						return;
					if ( raycaster.stereo ) {

						raycaster.stereo.addParticle( particle );
						return;

					}
					if ( isAddedToParticles( particle ) ) {

						console.error( 'Duplicate particle "' + particle.name + '"' );
						return;

					}
					particles.push( particle );

				};
				/**
				 * Removes particle from array of objects to check for intersection with the ray.
				 * @see <b>objects</b> parameter of the [Raycaster.intersectObjects]{@link https://threejs.org/docs/index.html#api/en/core/Raycaster.intersectObjects} for details.
				 * @param {THREE.Mesh} particle The [Mech]{@link https://threejs.org/docs/index.html#api/en/objects/Mesh} for removing.
				 */
				this.removeParticle = function ( particle ) {

					if ( particle.userData.boFrustumPoints )
						return;
					if ( raycaster.stereo ) {

						raycaster.stereo.removeParticle( particle );
						return;

					}
					const index = particles.indexOf( particle );
					if ( index === -1 ) return;
					particles.splice( index, 1 );

				};

			}

			/**
			 * Convert mouse position to renderer coordinates.
			 * @param {THREE.WebGLRenderer} renderer [WebGLRenderer]{@link https://threejs.org/docs/index.html#api/en/renderers/WebGLRenderer}
			 * @param {HTMLElement} [el] parent of the <b>canvas</b>.
			 * @returns <pre>
			 * {
			 *
			 *	getMousePosition:function
			 *
			 * }
			 * </pre>
			 */
			static getRendererSize( renderer, el ) {

				el = el || renderer.domElement;
				({

					position: el.style.position,
					left: el.style.left,
					top: el.style.top,
					width: el.style.width,
					height: el.style.height,

				});
					const rect = el.getBoundingClientRect(),
					left = Math.round( rect.left ),
					top = Math.round( rect.top ),
					size = new three$1.THREE.Vector2();
				renderer.getSize( size );
				return {

					getMousePosition: function ( mouse, event ) {

						mouse.x = ( event.clientX / size.x ) * 2 - 1 - ( left / size.x ) * 2;
						mouse.y = - ( event.clientY / size.y ) * 2 + 1 + ( top / size.y ) * 2;

					},

				};

			}

		};

	}

}
/**@namespace
 * @description [Raycaster]{@link https://threejs.org/docs/index.html#api/en/core/Raycaster} methods.
 * @See <a href="./Raycaster.html" target="_blank">Raycaster</a> for details.
 * */
Options.raycaster = new Raycaster();

var Options$1 = Options;

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

/**
 * @callback onSelectScene
 * @description This function is called at each new step of the playing. See <b>settings.onSelectScene</b> parameter of the <a href="../../player/jsdoc/module-Player-Player.html" target="_blank">Player</a> class.
 * @param {number} index current index of the scene of the animation
 * @param {number} t current time
 */

/**
 * @callback onChangeScaleT
 * @description User has updated the time settings. See <b>settings.onChangeScaleT</b> parameter of the <a href="../../player/jsdoc/module-Player-Player.html" target="_blank">Player</a> class.
 * @param {object} scale the updated time settings
 */

class Player$1 {

	/**
	 * 3D objects animation.
	 * @class
	 * @param {THREE.Group|THREE.Scene} group [THREE.Group]{@link https://threejs.org/docs/index.html?q=group#api/en/objects/Group} or [THREE.Scene]{@link https://threejs.org/docs/index.html?q=sce#api/en/scenes/Scene} of the meshes for playing.
	 * @param {Object} [settings={}] the following settings are available
	 * 
	 * @param {Options} [settings.options=new Options()] <a href="../../jsdoc/Options/Options.html" target="_blank">Options</a> instance. The following options are available.
	 * See <b>options</b> parameter of <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
	 * @param {boolean} [settings.options.dat.playerGui] false - do not adds a <a href="../../player/jsdoc/module-Player-Player.html#gui" target="_blank">Player controllers</a> into [dat.gui]{@link https://github.com/dataarts/dat.gui}.
	 * @param {boolean} [settings.options.dat.playController] false - do not adds a <a href="../../player/jsdoc/module-Player-Player_PlayController_PlayController.html" target="_blank">PlayController</a> into [dat.gui]{@link https://github.com/dataarts/dat.gui}.
	 * @param {Object} [settings.options.playerOptions] Player settings.
	 * @param {number} [settings.options.playerOptions.min=0] Start time of the playing.
	 * @param {number} [settings.options.playerOptions.max=1] Stop time of the playing.
	 * @param {number} [settings.options.playerOptions.marks=10] Ticks count of the playing. Number of scenes of 3D objects animation.
	 * Have effect for <b>max</b> is not Infinity.
	 * @param {number} [settings.options.playerOptions.selectSceneIndex=0] current time index.
	 * <pre>
	 * Legal interval from 0 to to <b>marks - 1</b>.
	 * If <b>selectSceneIndex</b> = 0 then time = <b>min</b>.
	 * If <b>selectSceneIndex</b> = <b>marks - 1</b> then time = <b>max</b>.
	 * <pre>
	 * @param {number} [settings.options.playerOptions.dt=0.1] Step of the animation. Have effect only if <b>max</b> is infinity.
	 * @param {boolean} [settings.options.playerOptions.repeat=false] true - Infinitely repeating 3D objects animation.
	 * @param {number} [settings.options.playerOptions.interval=1] Ticks per seconds.
	 * @param {number} [settings.options.playerOptions.zoomMultiplier=1.1] zoom multiplier of the time.
	 * @param {number} [settings.options.playerOptions.offset=0.1] offset of the time.
	 * @param {number} [settings.options.playerOptions.name=""] name of the time.
	 * @param {boolean} [settings.options.player] false - do not create a <b>Player</b> instance.
	 *
	 * @param {onSelectScene} [settings.onSelectScene] This function is called at each new step of the playing. See <a href="../../player/jsdoc/module-Player.html#~onSelectScene" target="_blank">onSelectScene</a>.
	 * @param {onChangeScaleT} [settings.onChangeScaleT] event. User has updated the time settings. See <a href="../../player/jsdoc/module-Player.html#~onChangeScaleT" target="_blank">onChangeScaleT</a>.
	 * @param {FrustumPoints} [settings.frustumPoints] See <a href="../../frustumPoints/jsdoc/index.html" target="_blank">FrustumPoints</a>.
	 * Have effect only if <b>settings.options</b> is not defined.
	 * @param {THREE.PerspectiveCamera} settings.cameraTarget.camera [PerspectiveCamera]{@link https://threejs.org/docs/index.html#api/en/cameras/PerspectiveCamera}.
	 */
	constructor( group, settings={} ) {

		assign();

		if ( !settings.options && settings.frustumPoints ) settings.options = settings.frustumPoints.getOptions();
		settings.options = settings.options || new Options$1();
		const options = settings.options;
		if ( !options.boOptions ) {

			console.error( 'Player: call options = new Options( options ) first' );
			return;

		}

		if ( options.player === false ) return;

		options.boPlayer = options.boPlayer || false;

		//если тут создавать палитру то она не создастся если не создается плееер
		//palette = new palette();

		if ( options.player ) {

			console.error( 'Player: duplicate player.' );
			return;

		}
		options.player = this;

		settings.cameraTarget = settings.cameraTarget || {};

		/**
		 * @description This function is called at each new step of the playing.
		 * @param {number} [index=0] current index of the scene of the animation
		 */
		function onSelectScene( index ) {

			index = index || 0;
			const t = _this.getTime(index);
			Player$1.selectPlayScene( group, { t: t, index: index, options: settings.options } );
			_this.setIndex( index, ( options.playerOptions.name === '' ? '' : options.playerOptions.name + ': ' ) + t );
			if ( settings.onSelectScene ) _this.selectScenePause = settings.onSelectScene( index, t );
			if ( options.frustumPoints ) options.frustumPoints.updateCloudPoints();

		}

		//Теперь не нужно создавать color attribute на веб странице что бы цвет точек был верным еще до начала проигрывания
		//Кроме того трассировака начинается с нулевой точки
		setTimeout( function () { onSelectScene(); }, 0 );

		options.playerOptions.selectSceneIndex = options.playerOptions.selectSceneIndex || 0;
		var selectSceneIndex = options.playerOptions.selectSceneIndex;

		const _this = this;

		/**
		 * get time id
		 */
		this.getTimeId = function () { return selectSceneIndex; };
		
		/**
		 * get time
		 * @param {number} [timeId] Index of the time. The default is the time index of the selected scene.
		 */
		this.getTime = function (timeId) {

			const playerOptions = options.playerOptions, t = playerOptions.min + (timeId != undefined ? timeId : selectSceneIndex) * playerOptions.dt;
			if ( isNaN( t ) ) console.error( 'Player.getTime(): t = ' + t );
			if ( ( playerOptions.max !== null ) && ( t > playerOptions.max ) )
				console.error( 'Player.getTime(): t = ' + t + ' playerOptions.max = ' + playerOptions.max );
			if ( ( t < playerOptions.min ) && ( playerOptions.max !== null ) )
				console.error( 'Player.getTime(): t = ' + t + ' playerOptions.min = ' + playerOptions.min );
			return t;

		};

		/**
		 * set time
		 * @param {number} t time
		 * @returns false - invalid <b>t</b>.
		 */
		this.setTime = function ( t ) {

			return this.selectScene( parseInt( ( t - options.playerOptions.min ) / options.playerOptions.dt ) );

		};

		//массив индексов проигрывателя selectSceneIndex для функции onSelectScene
		//Этот массив заполняется когда пользователь нажал на scrollBar проигрывателя и когда очередной шаг проигрывателя выпоняется ассинхронно
		//В этом случае вызывается сразу несколько onSelectScene с разными индексами проигрывателя selectSceneIndex
		//Для того, что бы несколько onSelectScene не выполнялись одновременно сначала выполняется первый onSelectScene, а затем выпоняются остальные только когда выполнится предыдущий onSelectScene
		const aSelectSceneIndex = [];

		/**
		 * select scene for playing
		 * @param {number} index Index of the scene. Range from 0 to options.playerOptions.marks - 1
		 * @returns false - invalid <b>index</b>.
		 */
		this.selectScene = function ( index ) {

			//Пользователь передвинул slider проигрывателя, когда сцена вычисляется асинхронно.
			//Смотри пример http://localhost/anhr/universe/main/hyperSphere/Examples/ когда выполняется hyperSphere.middleVertices
			//В этом случает в aSelectSceneIndex добавляются новые идексы сцен. И дальше начинается путаница, в которой я не разобрался.
			if ( aSelectSceneIndex.length != 0 ) return;

			if ( index === undefined ) {

				onSelectScene( selectSceneIndex );
				return true;

			}
			if ( isNaN( index ) ) {

				console.error( 'Player.selectScene: index = ' + index );
				return false;
				
			}
			index = parseInt( index );
			if ( options.playerOptions.max !== null ) {

				if ( index >= options.playerOptions.marks )
					index = 0;
				else if ( index < 0 )
					index = options.playerOptions.marks - 1;
				if ( selectSceneIndex > options.playerOptions.marks )
					selectSceneIndex = options.playerOptions.marks;

			}
			while ( selectSceneIndex !== index ) {

				if ( selectSceneIndex < index )
					selectSceneIndex++;
				else selectSceneIndex--;
				if (this.selectScenePause === true) 
					//Пользователь нажал scrollBar проигрывателя и когда очередной шаг проигрывателя выпоняется ассинхронно
					//В этом случае сдедующий onSelectScene выполняется только когда выполнится предыдущий onSelectScene
					aSelectSceneIndex.push( selectSceneIndex );
				else onSelectScene( selectSceneIndex );

			}
			return true;

		};

		/**
		 * Go to next animation scene
		 */
		this.next = function () {

			_this.selectScene( selectSceneIndex + 1 );

		};

		/**
		 * Go to previous animation scene
		 */
		this.prev = function () {

			_this.selectScene( selectSceneIndex - 1 );

		};
		/**
		 * Add controller into controllers array
		 * @param {controller} controller
		 */
		this.pushController = function ( controller ) {

			if ( ( controller.object !== undefined ) && ( controller.object.playRate !== undefined ) )
				controller.object.playRate = options.playerOptions.min;
			this.controllers.push( controller );

		};

		//Play/Pause

		this.controllers = [];
		var playing = false, time, timeNext;

		function RenamePlayButtons() {

			options.player.controllers.forEach( function ( controller ) { if ( controller.onRenamePlayButtons ) controller.onRenamePlayButtons( playing ); } );

		}

		function play() {

			if (
				( selectSceneIndex === -1 ) ||
				(
					( selectSceneIndex === options.playerOptions.marks ) &&
					( options.playerOptions.max !== null )
				)
			) {

				selectSceneIndex = 0;

			}
			onSelectScene( selectSceneIndex );

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
			if ( ( options.playerOptions.max !== null ) && selectSceneIndex >= options.playerOptions.marks ) {

				if ( isRepeat() )
					selectSceneIndex = 0;
				else {

					//Для вычисления текущего времени в случае:
					//1. Запустить плеер и дождаться когда проигрывание остановится после достижения максимального времени
					//2. В guiSelectPoint выбрать точку, цвет которой зависит от времени
					//Тогда если убрать эту строку, то selectSceneIndex и время окажется за диапазоном допустимых значений
					//и цвет точки окажется неверным
					selectSceneIndex = options.playerOptions.marks - 1;

					pause();
					return;

				}

			}
			play();

		}

		function step(timestamp) {

			if (_this.selectScenePause) return;//При построении сцены был применен ProgressBar. Поэтому возврат из options.onSelectScene произошел еще до построения сцены. Нужно приостановить проигрывание, пока сцена не построится.
			if (playing)
				window.requestAnimationFrame(step);
			else time = undefined;

			if (time === undefined) {

				time = timestamp;
				timeNext = time + 1000 / options.playerOptions.interval;

			}
			if (isNaN(timeNext) || (timeNext === Infinity)) {

				console.error('Player.animate: timeNext = ' + timeNext);
				playing = false;

			}

			if ( (timestamp < timeNext) || !playing )
				return;
			const d = 1000 / options.playerOptions.interval;
			if (d > 0) while (timestamp > timeNext)
				timeNext += d;
			playNext();

		}

		/**
		 * User has clicked the Play ► / Pause ❚❚ button
		 */
		this.play3DObject = function () {

			if ( playing ) {

				pause();
				return;

			}

			playing = true;
			if ( ( options.playerOptions.max !== null ) && ( selectSceneIndex >= ( options.playerOptions.marks - 1 ) ) )
				selectSceneIndex = 0;//-1;
			playNext();
			RenamePlayButtons();

			window.requestAnimationFrame( step );

		};

		/**
		 * <pre>
		 *Continue playing asynchronously.
		 * Usual using if creating new scene to take long time.
		 * Please call it from <b>settings.options.onSelectScene()</b> function after asynchronously creating of the scene.
		 * Return true from <b>settings.options.onSelectScene()</b> function for pause of the playing.
		 * </pre>
		 * @see <a href="../../../../universe/main/jsdoc/" target="_blank">example</a>
		 */
		this.continue = () => {

			if (aSelectSceneIndex.length > 0) {

				onSelectScene(aSelectSceneIndex.shift());
				return;
				
			}
			_this.selectScenePause = false;
			window.requestAnimationFrame(step);
			
		};

		/**
		 * User has clicked the repeat ⥀ button
		 */
		this.repeat = function () {

			options.playerOptions.repeat = !options.playerOptions.repeat;
			this.onChangeRepeat( options.playerOptions.repeat );

		};

		/**
		 * @returns Player settings.
		 */
		this.getSettings = function () { return settings; };
		/**
		 * @returns selected scene index.
		 */
		this.getSelectSceneIndex = function () { return selectSceneIndex; };

		/**@namespace
		 * @descriptionUser has pressed the <b>Repeat</b> button of the <a href="../../player/jsdoc/module-Player-Player_PlayController_PlayController.html" target="_blank">Player.PlayController</a>.
		 * @param {boolean} value true - repeat is off
		 * <p>false - repeat is on</p>
		 */
		this.onChangeRepeat = function ( value ) {

			options.playerOptions.repeat = value;
			this.controllers.forEach( function ( controller ) { if ( controller.onChangeRepeat ) controller.onChangeRepeat(); } );

		};

		//Localization
		function getLang( params ) {

			params = params || {};
			const lang = {

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
				defaultTitle: 'Restore default player settings.',

			};

			const _languageCode = params.getLanguageCode === undefined ? 'en'//Default language is English
				: params.getLanguageCode();
			switch ( _languageCode ) {

				case 'ru'://Russian language

					lang.player = 'Проигрыватель';
					lang.playerTitle = 'Анимация 3D объектов.';

					lang.min = 'Минимум';
					lang.max = 'Максимум';
					lang.dt = 'Шаг';
					lang.dtTitle = 'Веремя между кадрами';

					lang.marks = 'Кадры';
					lang.marksTitle = 'Количество кадров проигрывателя';

					lang.interval = 'Темп',
					lang.intervalTitle = 'Скорость смены кадров в секунду.';

					lang.time = 'Время';

					lang.defaultButton = 'Восстановить';
					lang.defaultTitle = 'Восстановить настройки проигрывателя по умолчанию.';

					break;
				default://Custom language
					if ( ( params.lang === undefined ) || ( params.lang._languageCode != _languageCode ) )
						break;

					Object.keys( params.lang ).forEach( function ( key ) {

						if ( _lang[key] === undefined )
							return;
						_lang[key] = params.lang[key];

					} );

			}
			return lang;

		}

		//PlayController localization

		const lang = {

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
			topAndBottom: 'Top and bottom',

		};
		function localization( getLanguageCode ) {
			switch ( getLanguageCode() ) {

				case 'ru'://Russian language
					lang.prevSymbolTitle = 'Кадр назад';//'Go to previous animation scene',
					lang.playTitle = 'Проиграть';//'Play'
					lang.nextSymbolTitle = 'Кадр вперед';//'Go to next animation scene';
					lang.pauseTitle = 'Пауза';//'Pause',
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
		/** <a href="../../player/jsdoc/module-Player-Player_PlayController_PlayController.html" target="_blank">PlayController</a> localization
		* @param {Function} [getLanguageCode="en"] Your custom getLanguageCode() function.
		* <pre>
		* returns the "primary language" subtag of the language version of the browser.
		* Examples: "en" - English language, "ru" Russian.
		* See the {@link https://tools.ietf.org/html/rfc4646#section-2.1|rfc4646 2.1 Syntax} for details.
		* Default returns the 'en' is English language.
		* You can import { getLanguageCode } from '../../commonNodeJS/master/lang.js';
		* </pre>
	    * @returns Names and titles of the <b>PlayController</b> controls
		*/
		this.localization = function ( getLanguageCode = function() { return 'en' } ) {

			localization( getLanguageCode );
			return lang;

		};

		this.PlayController = class extends controllers.CustomController {

			/**
			 * @class playController class for using in my version of [dat.gui]{@link https://github.com/anhr/dat.gui} for animate of 3D objects in my projects.
			 * @extends dat.controllers.CustomController. See [CustomController.js]{@link https://github.com/anhr/commonNodeJS/blob/master/dat.gui/CustomController/src/dat/controllers/CustomController.js}
			 * @param {GUI} [gui] [new dat.GUI(...)]{@link https://github.com/anhr/dat.gui}. Folder for controller
			 */
			constructor( gui ) {

				const player = options.player, getLanguageCode = options.getLanguageCode;
				player.createControllersButtons( options );

				gui = gui || options.dat.gui;
				if ( !gui || options.dat.playController === false ) {

					super( {} );
					return;

				}

				localization( getLanguageCode );

				function addButton( innerHTML, title, onclick ) {

					const button = document.createElement( 'span' );
					button.innerHTML = innerHTML;
					button.title = title;
					button.style.cursor = 'pointer';
					button.style.margin = '0px 2px';
					button.onclick = onclick;
					return button;

				}

				var _renamePlayButtons, _renameRepeatButtons;//_selectScene, _repeat, _getGroup,
				const colorOff = 'rgb(255,255,255)', colorOn = 'rgb(128,128,128)';

				super( {

					playRate: 1,//Default play rate is 1 changes per second
					property: function ( customController ) {

						var buttons = {};
						function RenamePlayButtons( innerHTML, title ) {

							buttons.buttonPlay.innerHTML = innerHTML;
							buttons.buttonPlay.title = title;

						}
						_renamePlayButtons = RenamePlayButtons;

						buttons.buttonPrev = addButton( lang.prevSymbol, lang.prevSymbolTitle, player.prev );
						buttons.buttonPlay = addButton( playing ? lang.pause : lang.playSymbol,
							playing ? lang.pauseTitle : lang.playTitle, player.play3DObject );

						if ( player.getSettings().options.playerOptions.max !== null ) {

							//Repeat button

							function RenameRepeatButtons( isRepeat ) {

								var title, color;
								if ( isRepeat ) {

									title = lang.repeatOff;
									color = colorOff;

								} else {

									title = lang.repeatOn;
									color = colorOn;

								}

								if ( buttons.buttonRepeat.title === title )
									return;//stop of infinite recursive call

								buttons.buttonRepeat.title = title;
								buttons.buttonRepeat.style.color = color;

								player.onChangeRepeat( isRepeat );

							}
							_renameRepeatButtons = RenameRepeatButtons;
							function repeat( value ) {

								RenameRepeatButtons( buttons.buttonRepeat.title === lang.repeatOn );

							}
							var title, color;
							if ( player.getSettings().repeat ) {

								title = lang.repeatOff;
								color = colorOff;

							} else {

								title = lang.repeatOn;
								color = colorOn;

							}
							buttons.buttonRepeat = addButton( lang.repeat, title, repeat );
							buttons.buttonRepeat.style.color = color;

						}
						buttons.buttonNext = addButton( lang.nextSymbol, lang.nextSymbolTitle, player.next );

						return buttons;

					},

				}, 'playRate' );
				player.PlayController = this;
				this.lang = lang;
				
				/** @namespace
				 * @description Get array of THREE.Vector4 points. User has pressed the <b>Play</b> button. Rename the <b>Play</b> putton.
				 * @param {boolean} playing true - name is "❚❚"
				 * <p>false = name is "►"
				 */
				this.onRenamePlayButtons = function ( playing ) {

					var name, title;
					if ( playing ) {

						name = lang.pause;
						title = lang.pauseTitle;

					} else {

						name = lang.playSymbol;
						title = lang.playTitle;

					}
					_renamePlayButtons( name, title, true );

				};
				/** @namespace
				 * @description User has pressed the <b>Repeat</b> button.
				 */
				this.onChangeRepeat = function () {

					_renameRepeatButtons( player.getSettings().options.playerOptions.repeat );

				};
				player.pushController( this );
				/**
				 * @param {number} value current time of the playing
				 */
				this.setValue = function ( value ) {

					this._controller.domElement.childNodes[0].value = value;

				};

				const controler = gui.add( this );
				//что бы можно было вводить цифры после запятой
				controler.__truncationSuspended = true;

			}
			set controller( newController ) {

				this._controller = newController;
				this._controller.onChange( function ( value ) { options.player.setTime( value ); /*_this.onChange( value );*/ } );
				this._controller.domElement.title = this.lang.controllerTitle;

			}
			get controller() { return this._controller; }

		};

		/**
		 * Adds a Player's controllers into [dat.gui]{@link https://github.com/anhr/dat.gui}.
		 * @param {GUI} [folder] Player's folder
		 */
		this.gui = function ( folder ) {

			const cookie = options.dat.cookie,
				cookieName = options.dat.getCookieName( 'Player' ),
				getLanguageCode = options.getLanguageCode,
				dat = three$1.dat;// options.dat.dat;

			folder = folder || options.dat.gui;
			if ( !folder || options.dat.playerGui === false )
				return;

			function setDT() {

				if ( options.playerOptions.max === null ) options.playerOptions.dt = options.playerOptions.dt || 0.1;
				else options.playerOptions.dt = ( options.playerOptions.max - options.playerOptions.min ) / ( options.playerOptions.marks - 1 );

			}

			function setSettings() {

				setDT();
				cookie.setObject( cookieName, options.playerOptions );
				if ( settings.onChangeScaleT ) settings.onChangeScaleT( options.playerOptions );

			}
			function setMax() {

				if ( options.playerOptions.max !== null )
					options.playerOptions.max = options.playerOptions.min + options.playerOptions.dt * ( options.playerOptions.marks - 1 );

			}
			setMax();
			const axesDefault = {},
				lang = getLang( {

					getLanguageCode: getLanguageCode,

				} );
			Object.keys( options.playerOptions ).forEach( ( key ) => { axesDefault[key] = options.playerOptions[key]; } );
			Object.freeze( axesDefault );
			const max = options.playerOptions.max, marks = options.playerOptions.marks;// interval = options.playerOptions.interval,
			cookie.getObject( cookieName, options.playerOptions, axesDefault );
			if ( ( max === null ) || ( max === Infinity ) ||
				( options.playerOptions.max === null )//раньше на веб странице плеер был настроен на бесконечное проигрыванияе а сейчас проигрывание ограничено по времени
			) {

				options.playerOptions.max = max;
				options.playerOptions.marks = marks;

			}

			const fPlayer = folder.addFolder( lang.player );
			dat.folderNameAndTitle( fPlayer, lang.player, lang.playerTitle );

			function scale() {

				const axes = options.playerOptions,
					scaleControllers = {};
				function onclick( customController, action ) {

					var zoom = customController.controller.getValue();

					axes.min = action( axes.min, zoom );
					scaleControllers.min.setValue( axes.min );
					if ( axes.max ) {

						axes.max = action( axes.max, zoom );
						setDT();
						scaleControllers.max.setValue( axes.max );

					}

					setSettings();

				}

				scaleControllers.folder = fPlayer.addFolder( axes.name !== '' ? axes.name : lang.time );

				scaleControllers.scaleController = scaleControllers.folder.add( new ScaleController( onclick,
					{ settings: settings.options.playerOptions, getLanguageCode: getLanguageCode, } ) ).onChange( function ( value ) {

						axes.zoomMultiplier = value;
						setSettings();

					} );

				const positionController = new PositionController( function ( shift ) {

					onclick( positionController, function ( value, zoom ) {

						value += shift;
						return value;

					} );

				}, { settings: settings.options.playerOptions, getLanguageCode: getLanguageCode, } );
				scaleControllers.positionController = scaleControllers.folder.add( positionController ).onChange( function ( value ) {

					axes.offset = value;
					setSettings();

				} );

				//min
				scaleControllers.min = dat.controllerZeroStep( scaleControllers.folder, axes, 'min', function ( value ) { setSettings(); } );
				dat.controllerNameAndTitle( scaleControllers.min, lang.min );

				//max
				//axes.max сейчас используется исключитьельно для удобства пользовательского интерфейса
				//Вместо axes.max используется axes.dt
				setMax();
				if ( axes.max !== null ) {

					scaleControllers.max = dat.controllerZeroStep( scaleControllers.folder, axes, 'max', function ( value ) { setSettings(); } );
					dat.controllerNameAndTitle( scaleControllers.max, lang.max );

				} else {

					//dt
					scaleControllers.dt = dat.controllerZeroStep( scaleControllers.folder, axes, 'dt', function ( value ) { setSettings(); } );
					dat.controllerNameAndTitle( scaleControllers.dt, lang.dt, lang.dtTitle );

				}

				//marks
				if ( axes.marks ) {

					scaleControllers.marks = scaleControllers.folder.add( axes, 'marks' ).onChange( function ( value ) {

						axes.marks = parseInt( axes.marks );
						setSettings();
						const elSlider = getSliderElement();
						if ( elSlider ) elSlider.max = options.playerOptions.marks - 1;

					} );
					dat.controllerNameAndTitle( scaleControllers.marks, axes.marksName === undefined ? lang.marks : axes.marksName,
						axes.marksTitle === undefined ? lang.marksTitle : axes.marksTitle );

				}

				//Ticks per seconds.
				//settings.options.playerOptions.intervalOptions ||= {};uncompatible with myThree.js → ./build/myThree.js, ./build/myThree.module.js...
				if (!settings.options.playerOptions.intervalOptions) settings.options.playerOptions.intervalOptions = {};
				const intervalOptions = settings.options.playerOptions.intervalOptions;
				intervalOptions.min = intervalOptions.min != undefined ? intervalOptions.min : settings.options.playerOptions.interval < 1 ? settings.options.playerOptions.interval : 1;
				intervalOptions.max = intervalOptions.max === null ? Infinity : //Во время JSON преобразования Infinity превращается в null. Поэтому восстанавливаю обратно
					intervalOptions.max != undefined ? intervalOptions.max : settings.options.playerOptions.interval > 25 ? settings.options.playerOptions.interval : 25;
				if (intervalOptions.max === Infinity)
					scaleControllers.interval = scaleControllers.folder.add( settings.options.playerOptions, 'interval' ).onChange( function ( value ) {

						setSettings();

					} );
				else scaleControllers.interval = scaleControllers.folder.add( settings.options.playerOptions, 'interval', intervalOptions.min, intervalOptions.max, 1 ).onChange( function ( value ) {

						setSettings();
	
					} );
				dat.controllerNameAndTitle( scaleControllers.interval, lang.interval, lang.intervalTitle );

				//Default button
				dat.controllerNameAndTitle( scaleControllers.folder.add( {

					defaultF: function ( value ) {

						axes.zoomMultiplier = axesDefault.zoomMultiplier;
						scaleControllers.scaleController.setValue( axes.zoomMultiplier );

						axes.offset = axesDefault.offset;
						scaleControllers.positionController.setValue( axes.offset );

						axes.min = axesDefault.min;
						scaleControllers.min.setValue( axes.min );

						if ( scaleControllers.max ) {

							axes.max = axesDefault.max;
							setDT();
							scaleControllers.max.setValue( axes.max );

						}

						if ( scaleControllers.dt ) {

							axes.dt = axesDefault.dt;
							scaleControllers.dt.setValue( axes.dt );

						}

						if ( axesDefault.marks ) {

							axes.marks = axesDefault.marks;

							//scaleControllers.marks is undefined если программист сначала установил max: Infinity,
							//соханил Player in cookie, например изменил marks
							//удалил max: Infinity,
							//Нажал кнопку Default для проигрывателя
							if ( scaleControllers.marks )
								scaleControllers.marks.setValue( axes.marks );

						}

						axes.interval = axesDefault.interval;
						scaleControllers.interval.setValue( axes.interval );
						if ( ( axesDefault.interval > scaleControllers.interval.__max ) || ( axesDefault.interval < scaleControllers.interval.__min )) {
							
							scaleControllers.interval.domElement.childNodes[0].childNodes[0].value = axesDefault.interval;
							axes.interval = axesDefault.interval;

						}

						setSettings();

					},

				}, 'defaultF' ), lang.defaultButton, lang.defaultTitle );

			}
			scale();

		};

		/**
		 * Adds player buttons into web page.
		 * @param {Object} options the following options are available
		 * @param {Object} [options.controllers.player] player buttons, available from web page
		 * @param {HTMLElement|string} [options.controllers.player.buttonPrev="prev"] Go to previous animation scene.
		 * <pre>
		 * HTMLElement - <b>input</b> element of the "button" type.
		 * string - <b>id</b> of <b>input</b> element.
		 * </pre>
		 * @param {HTMLElement|string} [options.controllers.player.buttonPlay="play"] play or pause of the playing.
		 * <pre>
		 * HTMLElement - <b>input</b> element of the "button" type.
		 * string - <b>id</b> of <b>input</b> element.
		 * </pre>
		 * @param {HTMLElement|string} [options.controllers.player.buttonNext="next"] Go to next animation scene.
		 * <pre>
		 * HTMLElement - <b>input</b> element of the "button" type.
		 * string - <b>id</b> of <b>input</b> element.
		 * </pre>
		*/
		this.createControllersButtons = function ( options ) {

			if ( !options.controllers || !options.controllers.player ) return;
			const settings = options.controllers.player;

			//Previous button

			if ( settings.buttonPrev === null ) console.warn( 'Player.createControllersButtons: invalid options.controllers.player.buttonPrev = ' + settings.buttonPrev );
			if ( settings.buttonPrev ) {

				const buttonPrev = typeof settings.buttonPrev === 'string' ? document.getElementById( settings.buttonPrev ) : settings.buttonPrev;
				if ( buttonPrev === null ) console.warn( 'Player.createControllersButtons: invalid options.controllers.player.buttonPrev = ' + settings.buttonPrev );
				if ( buttonPrev ) {

					buttonPrev.value = lang.prevSymbol;
					buttonPrev.title = lang.prevSymbolTitle;
					buttonPrev.onclick = function ( event ) { if ( options.player ) options.player.prev(); };
					settings.buttonPrev = buttonPrev;

				}

			}

			//Play button
			
			if ( settings.buttonPlay === null ) console.warn( 'Player.createControllersButtons: invalid options.controllers.player.buttonPlay = ' + settings.buttonPlay );
			if ( settings.buttonPlay ) {

				const buttonPlay = typeof settings.buttonPlay === 'string' ? document.getElementById( settings.buttonPlay ) : settings.buttonPlay;
				if ( buttonPlay === null ) console.warn( 'Player.createControllersButtons: invalid options.controllers.player.buttonPlay = ' + settings.buttonPlay );
				if ( buttonPlay ) {

					buttonPlay.value = playing ? lang.pause : lang.playSymbol;
					buttonPlay.title = playing ? lang.pauseTitle : lang.playTitle;
					buttonPlay.onclick = function ( event ) { if ( options.player ) options.player.play3DObject(); };
					settings.buttonPlay = buttonPlay;

				}

			}

			//Next button

			if ( settings.buttonNext === null ) console.warn( 'Player.createControllersButtons: invalid options.controllers.player.buttonNext = ' + settings.buttonNext );
			if ( settings.buttonNext ) {

				const buttonNext = typeof settings.buttonNext === 'string' ? document.getElementById( settings.buttonNext ) : settings.buttonNext;
				if ( buttonNext === null ) console.warn( 'Player.createControllersButtons: invalid options.controllers.player.buttonNext = ' + settings.buttonNext );
				if ( buttonNext ) {

					buttonNext.value = lang.nextSymbol;
					buttonNext.title = lang.nextSymbolTitle;
					buttonNext.onclick = function ( event ) { if ( options.player ) options.player.next(); };
					settings.buttonNext = buttonNext;

				}

			}

		};

		var _canvasMenu;
		/**
		 * Adds a Player's menu item into [CanvasMenu]{@link https://github.com/anhr/commonNodeJS/tree/master/canvasMenu}.
		 * @param {CanvasMenu} canvasMenu [CanvasMenu]{@link https://github.com/anhr/commonNodeJS/tree/master/canvasMenu}.
		* @param {Function} [getLanguageCode="en"] Your custom getLanguageCode() function.
		* <pre>
		* returns the "primary language" subtag of the language version of the browser.
		* Examples: "en" - English language, "ru" Russian.
		* See the {@link https://tools.ietf.org/html/rfc4646#section-2.1|rfc4646 2.1 Syntax} for details.
		* Default returns the 'en' is English language.
		* You can import { getLanguageCode } from '../../commonNodeJS/master/lang.js';
		* </pre>
		*/
		this.createCanvasMenuItem = function ( canvasMenu, getLanguageCode = function() { return 'en' } ) {

			_canvasMenu = canvasMenu;

			const player = this, menu = canvasMenu.menu, lang = player.localization( getLanguageCode );

			//Previous button
			menu.push( {

				name: lang.prevSymbol,
				title: lang.prevSymbolTitle,
				onclick: function ( event ) { player.prev(); }

			} );

			//Play button
			menu.push( {

				name: playing ? lang.pause : lang.playSymbol,
				title: playing ? lang.pauseTitle : lang.playTitle,
				id: "menuButtonPlay",
				onclick: function ( event ) {

					player.play3DObject();

				}

			} );

			if ( options.playerOptions.max !== null ) {

				//Repeat button
				menu.push( {

					name: lang.repeat,
					title: this.getSettings().repeat ? lang.repeatOff : lang.repeatOn,
					id: "menuButtonRepeat",
					onclick: function ( event ) { player.repeat(); }

				} );

			}

			//Next button
			menu.push( {

				name: lang.nextSymbol,
				title: lang.nextSymbolTitle,
				onclick: function ( event ) { player.next(); }

			} );

			this.controllers.push( {

				/* *
				 * Renames the "Play" button of the player's menu.
				 * @param {boolean} playing <b>true</b> - pause.
				 * <p><b>false</b> - play</p>
				 */
				onRenamePlayButtons: function ( playing ) {

					var name, title;
					if ( playing ) {

						name = lang.pause;
						title = lang.pauseTitle;

					} else {

						name = lang.playSymbol;
						title = lang.playTitle;

					}
					const elMenuButtonPlay = canvasMenu.querySelector( '#menuButtonPlay' );
					elMenuButtonPlay.innerHTML = name;
					elMenuButtonPlay.title = title;
					if ( options.controllers && options.controllers.player && options.controllers.player.buttonPlay ) {

						options.controllers.player.buttonPlay.value = name;
						options.controllers.player.buttonPlay.title = title;

					}

				},

				/* *
				 * Changes "Repeat" button of the player's menu between <b>repeat Off</b> and <b>repeat On</b>.
				 */
				onChangeRepeat: function () {

					canvasMenu.querySelector( '#menuButtonRepeat' ).title = options.playerOptions.repeat ? lang.repeatOff : lang.repeatOn;

				}

			} );

		};

		/**
		 * Adds slider menu item into [CanvasMenu]{@link https://github.com/anhr/commonNodeJS/tree/master/canvasMenu}.
		 */
		this.addSlider = function () {

			if ( options.playerOptions.max === null )
				return;

			_canvasMenu.menu.push( {

				name: '<input type="range" min="0" max="' + ( options.playerOptions.marks - 1 ) + '" value="0" class="slider" id="sliderPosition">',
				style: 'float: right;',

			} );

		};

		function getSliderElement() { if ( _canvasMenu ) return _canvasMenu.querySelector( '#sliderPosition' ); }

		/**
		 * Adds an events into slider menu item of the [CanvasMenu]{@link https://github.com/anhr/commonNodeJS/tree/master/canvasMenu}.
		 * @returns slider element
		 */
		this.addSliderEvents = function () {

			const elSlider = getSliderElement();
			if ( elSlider ) {

				elSlider.onchange = function ( event ) { player.selectScene( parseInt( elSlider.value ) ); };
				elSlider.oninput = function ( event ) { player.selectScene( parseInt( elSlider.value ) ); };

				var pointerdown;
				const player = this;
				elSlider.addEventListener( 'pointerdown', e => { pointerdown = true; } );
				elSlider.addEventListener( 'pointerup', e => { pointerdown = false; } );
				elSlider.addEventListener( 'mousemove', e => {

					if ( !pointerdown )
						return;
					player.selectScene( ( options.playerOptions.marks - 1 ) * e.offsetX / elSlider.clientWidth );

				} );

			}
			return elSlider;

		};

		/**
		 * Sets <b>index</b> and <b>title</b> of the slider element of the player's menu.
		 * @param {string} index
		 * @param {string} title
		 */
		this.setIndex = function ( index, title ) {

			const t = this.getTime();
			if ( options.controllers && options.controllers.t )
				options.controllers.t.controller.value = t;
			if ( typeof this.PlayController === "object" ) this.PlayController.setValue( t );
			const elSlider = getSliderElement();
			if ( elSlider ) {

				elSlider.value = index;
				elSlider.title = title;

			}

		};

		/**
		 * Changes the "max" value of the slider of the player's menu. Moves <b>Player</b> to the first scene.
		 * @param {Object} scale See  <b>options.playerOptions</b> parameter of <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
		 */
		this.onChangeScale = function ( scale ) {

			getSliderElement().max = scale.marks - 1;
			this.selectScene( 0 );

		};

	}

}

/**
 * @class
 */
Player$1.cameraTarget = class {

	/**
	 * Functions for camera for looking at selected point.
	 */
	constructor() {

		const cameraTargetDefault = { boLook: false, },//По умолчанию не слежу за точкой
			_cameraTarget = {

				boLook: cameraTargetDefault.boLook,
				getDistanceToCamera() {

					if ( typeof this.distanceToCameraCur !== 'undefined' ) return this.distanceToCameraCur;
					return this.distanceToCamera;
					
				}
			};
		var _options;
		cameraTargetDefault.rotation = {};
		_cameraTarget.rotation = {};
		var boTarget = false,//true - target point was detected. For displaying of the console warning if duplicate target point was detected
			boPlayer = false;//true - была попытка получить camera из _options.player. Добавил что бы не выполнялась лишняя работа

		//Если определен ( boCameraTargetLook !== undefined ) , то явно было задано следить или не следить за точкой.
		//Тогда если есть точка, за которой надо следить ( cameraTarget.bodefault === false )
		//и явно не было задано следить или не следить заточкой  ( boCameraTargetLook === undefined ),
		//то надо следить за точкой ( cameraTargetDefault.boLook = true )
		var boCameraTargetLook;

		/**
		 * get camera target
		 * @param {Object} [options] See the <b>options</b> parameter of the <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
		 * @param {Object} [options.player] <a href="../../player/jsdoc/index.html" target="_blank">Player</a> instance.
		 */
		this.get = function ( options ) {

			if ( !options && !_options )
				console.error( 'Player.cameraTarget.get: options = ' + options );
			else if ( _options && options && !Object.is( _options, options ) )
				console.error( 'Player.cameraTarget.get: options is ambiguous' );
			_options = _options || options;
			if ( !_cameraTarget.camera && !boPlayer && _options.player ) {

				cameraTargetDefault.camera = _options.player.getSettings().cameraTarget.camera;
				if ( cameraTargetDefault.camera ) setCameraTarget();
				boPlayer = true;

			}
			if ( _cameraTarget.camera )
				return _cameraTarget;

		};

		/**
		 * Create default camera target
		 * @param {object} cameraTarget the following cameraTarget are available:
		 * @param {THREE.PerspectiveCamera} [cameraTarget.camera] [PerspectiveCamera]{@link https://threejs.org/docs/index.html#api/en/cameras/PerspectiveCamera}
		 * @param {boolean} [cameraTarget.boLook=false] true - camera look at the target.
		 * @param {THREE.Vector3} [cameraTarget.distanceToCamera] Distance from target point to camera.
		   * You can set the distance to the camera depending on the time.
		 * <pre>
		 *	Example 1: new THREE.Vector3( 0, 0, new Function( 't', 'return 2+t' ) )
		 *	Example 2: new THREE.Vector3( 0, 0,
		 *		[ { t: 0, v: 5 }, { t: 1, v: 2 }, { t: 10, v: 2 }, { t: 11, v: 5 } ] )
		 *	Default is camera.position.
		 * </pre>
		 * @param {object} [cameraTarget.rotation] rotation camera around point specified by an axis and an angle. Default is undefined - no rotation
		 * @param {number|function|array} [cameraTarget.rotation.angle=0] Angle of rotation in radians.
		 * <pre>
		 *   number. Example: Math.PI / 2 rotate to 90 degrees.
		 *   function. Example: new Function( 't', 'return 5*t' ).
		 *   array.
		 *     Example 1: [0, Math.PI]
		 *       0 is angle for t = min is start time of the playing.
		 *       Math.PI is rotate to 180 degrees
		 *         for t = max is time of the stopping of the playing.
		 *       If max time is infinity, then angle is for t = min.
		 *     Example 2: [{ t: 0, v: 0 }, { t: 1, v: Math.PI / 2 }
		 *       t is time,
		 *       v is angle for current t.
		 * </pre>
		 * @param {THREE.Vector3} [cameraTarget.rotation.axis] Axis of rotattion.
		 * <pre>
		 *   Example: new THREE.Vector3( 1, 0, 0 ) - rotate around x axis.
		 *   Default is rotate around y axis
		 * </pre>
		 * @param {Object} options See the <b>options</b> parameter of the <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
		 * @param {boolean} [boErrorMessage=true] false - Do not send an error message to the console if <b>cameraTarget.camera</b> is not defined.
		 */
		this.init = function ( cameraTarget, options, boErrorMessage = true ) {

			if ( !cameraTarget ) return;
			
			if ( !options && !_options )
				console.error( 'Player.cameraTarget.init: options = ' + options );
			else if ( _options && options && !Object.is( _options, options ) )
				console.error( 'Player.cameraTarget.init: options is ambiguous' );
			_options = _options || options;

			//cameraTargetDefault.boLook = false по умолчанию камера не смотритт на выбранную точку если:
			// 1 ни разу не вызывается init. Тоесть нет настроек cameraTargetDefault и нет ни однойточки, на которую смотрит камера
			// 2 cameraTarget.bodefault !== false и cameraTarget.boLook = false - программист явно запретил смотреть на точку

			//Если есть хоть одна точка, на которую должна смотреть камера cameraTarget.bodefault === false,
			//то для этой точки не устанавливаем playerCameraTarget.cameraTargetDefault
			//Другими словами если есть точка, на которую должна смотреть камера,
			//то камера будет на нее смотреть если нет запрета смотеть на точку - playerCameraTarget.cameraTargetDefault = false
			if ( cameraTarget.bodefault !== false ) {

				if ( boTarget )
					return;//Не надо устанавливать cameraTargetDefault после того,
				//как были устанвлены настройки cameraTargetDefault из точек
				//Иначе натройки точки не будут приоритетными

				if ( cameraTarget.boLook !== undefined ) {

					cameraTargetDefault.boLook = cameraTarget.boLook;
					boCameraTargetLook = cameraTarget.boLook;

				}

			} else if ( cameraTarget.boLook === true ) {

				//Есть точка, за которой надо следить

				if ( boTarget ) console.warn( 'playerCameraTarget().init(...): duplicate target point' );
				boTarget = true;

				if ( boCameraTargetLook === undefined )
					cameraTargetDefault.boLook = true;//запрета на слежение камерой за точкой не было и есть точка, за которой надо следить

			} else return;
			cameraTargetDefault.camera = cameraTargetDefault.camera ||
				cameraTarget.camera ||
				( _options.player ? _options.player.getSettings().cameraTarget.camera : undefined );
			if ( !cameraTargetDefault.camera && boErrorMessage ) {

				console.error( 'playerCameraTarget().init(...): cameraTargetDefault.camera = ' + cameraTargetDefault.camera );
				return;

			}
			cameraTargetDefault.distanceToCamera = cameraTargetDefault.distanceToCamera || cameraTarget.distanceToCamera;
			cameraTarget.rotation = cameraTarget.rotation || {};
			cameraTargetDefault.rotation.angle = cameraTargetDefault.rotation.angle || cameraTarget.rotation.angle;
			cameraTargetDefault.rotation.axis = cameraTargetDefault.rotation.axis || cameraTarget.rotation.axis;
			setCameraTarget( cameraTarget );

		};
		function setCameraTarget( cameraTarget ) {

			assign();

			if ( !cameraTarget )
				cameraTarget = cameraTargetDefault;//У выбранной для слежения точки нет cameraTarget
			if ( !_cameraTarget.boMaual ) {//если не делать эту проверку, то пользователь не сможет изменить вручную _cameraTarget.boLook когда выбрана точка, за которой надо следить

				if ( cameraTarget.boLook !== undefined )
					_cameraTarget.boLook = cameraTarget.boLook;
				else _cameraTarget.boLook = cameraTargetDefault.boLook;

			}
			cameraTargetDefault.camera = cameraTargetDefault.camera || cameraTarget.camera;
			_cameraTarget.camera = cameraTarget.camera || cameraTargetDefault.camera;

			//Если в программе не определены функции distanceToCamera (тоесть cameraTarget.distanceToCamera === undefined и cameraTargetDefault.distanceToCamera === undefined),
			//то при проигрывании каждый раз distanceToCamera будет равна camera.position
			//		_cameraTarget.distanceToCamera = cameraTarget.distanceToCamera || cameraTargetDefault.distanceToCamera || new THREE.Vector3().copy( cameraTargetDefault.camera.position );

			//Если в программе не определены функции distanceToCamera (тоесть cameraTarget.distanceToCamera === undefined и cameraTargetDefault.distanceToCamera === undefined),
			//То сначала _cameraTarget.distanceToCamera будет равна camera.position, а потом при проигрывании не будет меняться
			_cameraTarget.distanceToCamera =
				cameraTarget.distanceToCamera ||
				cameraTargetDefault.distanceToCamera ||
				_cameraTarget.distanceToCamera ||
				new THREE.Vector3().copy( cameraTargetDefault.camera.position );

			if ( !cameraTarget.rotation ) cameraTarget.rotation = {};
			if ( cameraTarget.rotation.angle !== undefined )
				_cameraTarget.rotation.angle = cameraTarget.rotation.angle;
			else _cameraTarget.rotation.angle = cameraTargetDefault.rotation.angle || 0;
			_cameraTarget.rotation.axis = cameraTarget.rotation.axis || cameraTargetDefault.rotation.axis || new THREE.Vector3( 0, 1, 0 );//Rotate around y axis

		}

		/**
		 * Change target.
		 * @param {THREE.Mesh} mesh [Mech]{@link https://threejs.org/docs/index.html#api/en/objects/Mesh} with selected point as target for camera.
		 * @param {number} i index of the point.
		 * @param {Options} [options] See <a href="../../jsdoc/Options/index.html" target="_blank">Options</a>.
		 */
		this.changeTarget = function ( mesh, i, options ) {

			assign();

			//Update cameraTarget
			const func = !mesh.userData.player || ( typeof mesh.userData.player.arrayFuncs === "function" ) ? {} :
				mesh.userData.player.arrayFuncs[mesh.userData.myObject.guiPoints.seletedIndex(i)];
			if ( func != undefined ) {
				
				if ( !func.cameraTarget )
					func.cameraTarget = { boLook: false };
				setCameraTarget( func.cameraTarget );

			}

			_options = _options || options;
			const cameraTarget = _options.playerOptions.cameraTarget.get( _options );

			if ( cameraTarget ) {

				if ( cameraTarget && cameraTarget.boLook ) {

					const target = getWorldPosition( mesh, new THREE.Vector3().fromArray( mesh.geometry.attributes.position.array, i * mesh.geometry.attributes.position.itemSize ) );
					cameraTarget.target = target;

				} else delete cameraTarget.target;

			}

		};
		/**
		 * Update camera settings.
		 * @param {Object} options See the <b>options</b> parameter of the <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
		 */
		this.setCameraTarget = function ( options ) {

			assign();

			var cameraTarget = options.playerOptions.cameraTarget.get( options );
			if ( !cameraTarget ) cameraTarget = cameraTarget || {};
			const camera = cameraTarget.camera;

			if ( !camera )
				return;//В этом приложении невозможно следить за точкой, потому что ни разу не была вызывана Player.cameraTarget.init()

			//На случай когда не определена ни одна точка как cameraTarget и пользователь поставил птичку в controllerCameraTarget
			if ( !cameraTarget.distanceToCamera )
				cameraTarget.distanceToCamera = new THREE.Vector3().copy( camera.position );

			if ( !cameraTarget.distanceToCameraCur )
				cameraTarget.distanceToCameraCur = new THREE.Vector3();

			const t = options.time,
				distanceToCamera = cameraTarget.distanceToCamera,
				distanceToCameraCur = new THREE.Vector3().copy( cameraTarget.distanceToCameraCur );
			cameraTarget.distanceToCameraCur.set(

				Player$1.execFunc( distanceToCamera, 'x', t, options ),
				Player$1.execFunc( distanceToCamera, 'y', t, options ),
				Player$1.execFunc( distanceToCamera, 'z', t, options )

			);

			if ( !cameraTarget.setCameraPosition )
				cameraTarget.setCameraPosition = function ( /*setCameraDefault*/ ) {

					var target = cameraTarget.target;

					//не менять позицию камеры если
					if (
						!cameraTarget.boLook ||//не следить за точкой
						(//или
							!target &&//нет точки, за которой надо следить
							cameraTarget.distanceToCameraCur.equals( distanceToCameraCur )//и не изменилось расстояние камеры до target
						)
					) {

						return;//Камере не нужно следить за выбранной точкой или ни одна точка не определена как target

					}
					
					distanceToCameraCur.copy( cameraTarget.distanceToCameraCur );
					const t = options.time;
					camera.position.copy( cameraTarget.distanceToCameraCur );
					camera.position.applyAxisAngle( cameraTarget.rotation.axis, Player$1.execFunc( cameraTarget.rotation, 'angle', t, options ) );
					if ( !target ) {

						if ( Player$1.orbitControls ) target = Player$1.orbitControls.target;
						else {

							//console.warn( 'Under constaction' );
							return;

						}

					}
					camera.position.add( target );
					camera.lookAt( target );
					if ( options.orbitControls ) {

						if ( !options.orbitControls.target.equals( target ) ) {

							options.orbitControls.target.copy( target );
							if ( options.orbitControlsGui )
								options.orbitControlsGui.setTarget( target );

						}
						if ( options.orbitControls._listeners )
							options.orbitControls._listeners.change[0]();//move frustumpoints

					}

				};

			if ( options.cameraGui ) options.cameraGui.update();

		};

	}

};

/** @namespace
 * @description execute function
 * @param {THREE.Vector4} funcs vector of the functions for executing.
 * @param {string} axisName axis name of the function for executing. Can be as "x", "y", "z", "w".
 * @param {number} t time. First parameter of the function for executing.
 * @param {object} [options={}] the following options are available:
 * @param {number} [options.a=1] multiplier. Second parameter of the function for executing.
 * @param {number} [options.b=0] addendum. Third parameter of the function for executing.
 * @returns function execution value.
 */
Player$1.execFunc = function ( funcs, axisName, t, options={} ) {

	var func = funcs[axisName];
	const a = options.a, b = options.b, typeofFuncs = typeof func;
	if ( typeof t === "undefined" ) t = options.playerOptions ? options.playerOptions.min : 0;
	switch ( typeofFuncs ) {

		case "undefined":
			return undefined;
		case "number":
			return func;
		case "string":
			func = new Function( 't', 'a', 'b', 'return ' + func );
		case "function":
			try {

				const res = func( t, a, b );
				if ( res === undefined )
					throw 'function returns ' + res;
				if ( !Array.isArray( res ) ) return res;
				else func = res;

			} catch( e ) {

				console.error( e );
				throw e;

			}
		case "object":
			if ( Array.isArray( func ) ) {

				if ( func.length === 0 ) {

					console.error( 'Player.execFunc: funcs["' + axisName + '"] array is empty' );
					return;

				}
				const a = func,
					l = func.length - 1,
					max = options.playerOptions.max === null ? Infinity : options.playerOptions.max,
					min = options.playerOptions.min,
					tStep = ( max - min ) / l;
				var tStart = min, tStop = max,
					iStart = 0, iStop = l;
				for ( var i = 0; i < func.length; i++ ) {

					if ( tStep * i + min < t ) {

						iStart = i;
						iStop = i + 1;
						tStart = tStep * iStart + min;
						tStop = tStep * iStop + min;

					}

				}
				function execW( i ) {

					if ( typeof a[i] === "function" )
						return a[i]( t, a, b );
					if ( a[i] instanceof THREE.Color )
						return a[i];

				}
				if ( typeof a[iStart] !== "number" ) {

					if ( axisName === 'w' ) {

						return execW( iStart );

					}
					if ( typeof a[iStart] === "object" ) {

						for ( var i = 0; i < func.length; i++ ){

							if ( i === ( func.length - 1 ) ) return a[i].v;

							iStart = i; iStop = i + 1;
							tStart = a[iStart].t; tStop = a[iStop].t;
							if ( ( tStart <= t ) && ( tStop > t ) ) {

								var x = ( a[iStop].v - a[iStart].v ) / ( tStop - tStart ),
									y = a[iStart].v - x * tStart;
								return x * t + y;

							}

						}
						console.error( 'Player.execFunc: value is not detected' );
						return;

					} else {

						console.error( 'Player.execFunc: funcs["' + axisName + '"] array item ' + iStart + ' typeof = ' + ( typeof a[iStart] ) + ' is not number' );
						return;

					}

				}
				if ( iStop >= func.length ) iStop = iStart;
				if ( typeof a[iStop] !== "number" ) {

					if ( axisName === 'w' )
						return execW( iStop );
					if ( typeof a[iStop] !== "object" ) {

						console.error( 'Player.execFunc: funcs["' + axisName + '"] array item ' + iStop + ' typeof = ' + ( typeof a[iStop] ) + ' is not number' );
						return;

					}

				}
				var x = ( a[iStop] - a[iStart] ) / ( tStop - tStart ),
					y = a[iStart] - x * tStart;
				if ( isNaN( x ) || isNaN( y ) ) console.error( 'Player.execFunc: invalid x = ' + x + ' or y = ' + y );
				return x * t + y;

			}
			if ( func.func )
				return func.func instanceof Function ? func.func( t, a, b ) : func.func;
			if ( axisName !== 'w' )
				console.error( 'Player.execFunc: funcs["' + axisName + '"] object is not array' );
			return func;
		default:
			console.error( 'Player.execFunc: Invalud typeof funcs["' + axisName + '"]: ' + typeofFuncs );
	}
	return;

};

var lang$1;

class Ids {

	constructor() {

		function addKeys( axisName ) {

			function keyValue( controllerId ) {

				const id = axisName + controllerId;
				return {

					get controllerId() { return this.boUsed ? undefined : id; },
					get elController() { return document.getElementById( this.controllerId ); },

					nameId: id + 'Name',
					get elName() { return document.getElementById( this.nameId ); },

				}

			}
			return {

				func: keyValue( 'Func' ),
				position: keyValue( 'Position' ),
				worldPosition: keyValue( 'WorldPosition' ),

			}

		}
		this.x = addKeys( 'x' );
		this.y = addKeys( 'y' );
		this.z = addKeys( 'z' );
		this.w = addKeys( 'w' );
		/*
			y: addKeys( 'y' ),
			z: addKeys( 'z' ),
			w: addKeys( 'w' ),
		*/

	}

}
var ids = new Ids();

/** @namespace
 * @description Select a scene for playing of the mesh
 * @param {THREE.Mesh} mesh [Mech]{@link https://threejs.org/docs/index.html#api/en/objects/Mesh} for playing.
 * @param {Object} [settings={}] the following settings are available
 * @param {number} [settings.t=0] time
 * @param {Object} [settings.options={ dat: false }] See the <b>options</b> parameter of the <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
 * @param {boolean} [settings.options.boPlayer] true - is not select play scene for mesh.userData.boFrustumPoints = true. Default is false.
 * @param {object} [settings.options.playerOptions] The <b>settings.options.playerOptions</b> parameter of the <a href="./module-Player-Player.html" target="_blank">Player</a> .
 * @param {number} [settings.options.a] multiplier. Second parameter of the arrayFuncs item function. Default is 1.
 * @param {number} [settings.options.b] addendum. Third parameter of the arrayFuncs item function. Default is 0.
 * @param {object} [settings.options.scales] axes scales.
 * See <b>options.scales</b> of the <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> for details.
 * @param {object} [settings.options.palette=new ColorPicker.palette();//palette: ColorPicker.paletteIndexes.BGYW] See <a href="../../colorPicker/jsdoc/module-ColorPicker.html#~Palette" target="_blank">ColorPicker.palette</a>.
 * @param {object} [settings.options.point={}] point settings. Applies to points with ShaderMaterial.
 * <pre>
 * See [ShaderMaterial]{@link https://threejs.org/docs/index.html#api/en/materials/ShaderMaterial} for details.
 * The size of the point seems constant and does not depend on the distance to the camera.
 * </pre>
 * @param {number} [settings.options.point.size=0.02] The apparent angular size of a point in radians.
*/
Player$1.selectMeshPlayScene = function ( mesh, settings = {} ) {

	assign();

	var t = settings.t, options = settings.options || { dat: false };

	options = new Options$1( options );
	if ( t === undefined ) t = options.playerOptions.min;
	options.scales.setW();
	if (

		!mesh.userData.player ||
		( options && options.boPlayer && mesh.userData.boFrustumPoints )

	)
		return;

	//Эти строки нужны что бы появлялся текст возле точки, если на нее наведена мышка
	//при условии, что до этого точка была передвинута с помошью проигрывателя.
	if ( mesh.geometry ) {//scene do not have geometry

		delete mesh.geometry.boundingSphere;
		mesh.geometry.boundingSphere = null;

	}

	if ( mesh.userData.player.selectPlayScene ) {

		mesh.userData.player.selectPlayScene( t );

		//если не приводить угол поворота в диапазон 0 - 360 градусов,
		//то угол поворота будет равен нулю или Math.PI * 2
		//когда пользователь выберет mesh в guiSelectPoint.js
		//потому что в органе управления угла поворота угол поворота ограничен 0 - 360 градусов,
		//смотри строку
		//cRotations[name] = fRotation.add( new THREE.Vector3(), name, 0, Math.PI * 2, 1 / 360 ).
		//в guiSelectPoint
		function setRotation( axisName ) {

			while ( mesh.rotation[axisName] < 0 ) mesh.rotation[axisName] += Math.PI * 2;
			while ( mesh.rotation[axisName] > Math.PI * 2 ) mesh.rotation[axisName] -= Math.PI * 2;

		}
		setRotation( 'x' );
		setRotation( 'y' );
		setRotation( 'z' );
		
	}

	function setAttributes( a, b ) {

		if ( !mesh.geometry || mesh.userData.nd )
			return;
			
		const attributes = mesh.geometry.attributes,
			arrayFuncs = mesh.userData.player.arrayFuncs;
		if ( arrayFuncs === undefined )
			return;
		if ( t === undefined )
			console.error( 'setPosition: t = ' + t );

		var min, max;
		if ( options && ( options.scales.w !== undefined ) ) {

			min = options.scales.w.min; max = options.scales.w.max;

		} else {

			max = value;
			min = max - 1;

		}

		if ( !mesh.userData.myObject || !mesh.userData.myObject.isSetPosition ) {

			const setPositionAttributeFromPoint = mesh.userData.myObject.setPositionAttributeFromPoint;
			for (var i = 0; i < arrayFuncs.length; i++) {

				var funcs = arrayFuncs[i], needsUpdate = false;
				const vertice = setPositionAttributeFromPoint ? [] : undefined;
				function setPosition(axisName, fnName) {

					var value = Player$1.execFunc(funcs, axisName, t, options);// a, b );
					if (value !== undefined) {

						if (setPositionAttributeFromPoint) vertice.push(value);
						else {
							
							attributes.position[fnName](i, value);
							needsUpdate = true;

						}

					}

				}
				setPosition('x', 'setX');
				setPosition('y', 'setY');
				setPosition('z', 'setZ');
				setPosition('w', 'setW');
				if (setPositionAttributeFromPoint) setPositionAttributeFromPoint(i, vertice);

				//если тут поставить var то цвет точки, которая определена как THREE.Vector3 будет равет цвету предыдущей точки
				//потому что перемнные типа var видны снаружи блока {}
				let color;

				function getColor() {

					if (mesh.userData.player.palette)
						color = mesh.userData.player.palette.toColor(value, min, max);
					else if (options.palette)
						color = options.palette.toColor(value, min, max);
					else {

						const c = { r: 255, g: 255, b: 255 };
						color = new THREE.Color("rgb(" + c.r + ", " + c.g + ", " + c.b + ")");
						return color;

					}

				}

				if (typeof funcs.w === "function") {

					var value = funcs.w(t, a, b);
					if (options.scales.w) {

						min = options.scales.w.min;
						max = options.scales.w.max;

					} else {

						console.warn('Player.selectMeshPlayScene: Кажется эти экстремумы заданы неверно');
						min = 0;
						max = 100;

					}
					if (attributes.position.itemSize >= 4)
						attributes.position.setW(i, value);
					needsUpdate = true;

					getColor();

				} else if (typeof funcs.w === "object") {

					if (funcs.w instanceof THREE.Color)
						color = funcs.w;
					else {

						var value = Player$1.execFunc(funcs, 'w', t, options);
						if (funcs.w.min !== undefined) min = funcs.w.min;
						if (funcs.w.max !== undefined) max = funcs.w.max;
						getColor();

					}

				}
				color = setColorAttibute(
					funcs.w === undefined ?
						new THREE.Vector4().w :
						typeof funcs.w === "number" ? funcs.w : Player$1.execFunc(funcs, 'w', t, options),
					mesh, i, color);
				if (needsUpdate)
					attributes.position.needsUpdate = true;

				if (funcs.trace && !funcs.line) {

					funcs.line = new Player$1.traceLine(options);
					funcs.trace = false;

				}
				if (funcs.line && funcs.line.addPoint)
					funcs.line.addPoint(mesh, i, color);
				if (funcs.cameraTarget && (funcs.cameraTarget.boLook === true))
					options.playerOptions.cameraTarget.changeTarget(mesh, i, options);

			}

		}

	}
	setAttributes( options ? options.a : 1, options ? options.b : 0 );
	const message = 'Player.selectMeshPlayScene: invalid mesh.scale.';
	if ( mesh.scale.x <= 0 ) console.error( message + 'x = ' + mesh.scale.x );
	if ( mesh.scale.y <= 0 ) console.error( message + 'y = ' + mesh.scale.y );
	if ( mesh.scale.z <= 0 ) console.error( message + 'z = ' + mesh.scale.z );

	function setColorAttibute( value, mesh, index , color ){

		if ( 
			//не менять цвет точки если позиция состоит из 3 значений
			//такая ситуация имеется в геометрических фигурах. Например в кубе
			( mesh.geometry.attributes.position.itemSize < 4 )// ||
			//( options.scales.w.isColor === false )//цвет точки не зависит от координаты w точки
		) return;

		if ( options.palette )
			color = options.palette.toColor( value, options.scales.w.min, options.scales.w.max );
		if (!color) return;
		const attributes = mesh.geometry.attributes, arrayFuncs = mesh.userData.player.arrayFuncs;
		if ( !Player$1.setColorAttribute( attributes, index, color ) && arrayFuncs[index] instanceof THREE.Vector4 ) {

			if ( mesh.userData.player && arrayFuncs ) {

				mesh.geometry.setAttribute( 'color',
					new THREE.Float32BufferAttribute( Player$1.getColors( arrayFuncs,
						{

							positions: attributes.position,
							options: options,

						} ), 4 ) );
				if ( !Player$1.setColorAttribute( attributes, index, color ) )
					console.error( 'Player.selectMeshPlayScene: the color attribute is not exists. Please use THREE.Vector3 instead THREE.Vector4 in the arrayFuncs or add "color" attribute' );

			} else console.error( 'Player.selectMeshPlayScene: set color attribute failed. Invalid mesh.userData.player.arrayFuncs' );

		}
		return color;

	}

	if ( mesh.userData.player && mesh.userData.player.arrayFuncs && mesh.userData.player.arrayFuncs instanceof Array )
		mesh.userData.player.arrayFuncs.forEach( function ( func, index ) {

			if ( func.controllers ) {

				//Localization

				if ( !lang$1 ) {
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

						positionAlert: 'Invalid position fromat: ',

					};
					switch ( options.getLanguageCode() ) {

						case 'ru'://Russian language

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
						default://Custom language
							if ( ( options.lang === undefined ) || ( options.lang.languageCode != languageCode ) )
								break;

							Object.keys( options.lang ).forEach( function ( key ) {

								if ( lang$1[key] === undefined )
									return;
								lang$1[key] = options.lang[key];

							} );

					}

				}

				const positionLocal = getObjectLocalPosition( mesh, index );
				function setPosition( value, axisName ) {

					const axesId = axisName === 'x' ? 0 : axisName === 'y' ? 1 : axisName === 'z' ? 2 : axisName === 'w' ? 3 : undefined;
					if ( axisName === 'w' ){

						setColorAttibute( value, mesh, index );
						if ( options.guiSelectPoint )
							options.guiSelectPoint.update();

					}

					const indexValue = axesId + mesh.geometry.attributes.position.itemSize * index,
						valueOld = mesh.geometry.attributes.position.array[ indexValue ];
					mesh.geometry.attributes.position.array[ indexValue ] = value;
					const axisControllers = func.controllers[axisName];
					if ( isNaN( mesh.geometry.attributes.position.array[ indexValue ] ) ) {

						alert( lang$1.positionAlert + value );
						const controller = axisControllers.position.controller;
						controller.focus();
						controller.value = valueOld;
						mesh.geometry.attributes.position.array[ indexValue ] = valueOld;
						return;
						
					}
					mesh.geometry.attributes.position.needsUpdate = true;
					if ( options.axesHelper )
						options.axesHelper.updateAxes();
					if ( options.guiSelectPoint )
						options.guiSelectPoint.update();
					if ( axisControllers.worldPosition && axisControllers.worldPosition.controller ) {

						const controller = axisControllers.worldPosition.controller;
						
						controller.innerHTML = getObjectPosition( mesh, index )[axisName];

					}

				}
				function createControllers( axisName ) {

					var axisControllers = func.controllers[axisName];
					if ( axisControllers === false ) return;
					const position = 'position';
					//если Controllers для текущей оси не определен а на веб странице есть Controllers для этой оси
					//то нужно создать axisControllers
					if ( !axisControllers && ( ids[axisName].func.elController || ids[axisName].position.elController || ids[axisName].worldPosition.elController ) ) {

						axisControllers = {};
						func.controllers[axisName] = axisControllers;

					}
					if ( !axisControllers ) return;
					//добавляем в axisControllers те Controllers, которые есть на веб странице для текущей оси
					function addKey( keyName ) {

						if ( !ids[axisName][keyName].elController ) return;
						if ( !axisControllers[keyName] ) {

							if ( !ids[axisName][keyName].boUsed ) {

								axisControllers[keyName] = {

									controller: ids[axisName][keyName].elController,
									elName: ids[axisName][keyName].elName ? ids[axisName][keyName].elName : false,

								};
								ids[axisName][keyName].boUsed = true;
								if ( ( keyName === position ) && ( axisName === 'w' ) )
									axisControllers[keyName].elSlider = true;

							} else console.warn( 'Player.selectMeshPlayScene createControllers: Same controller is using for different points. Controller ID is "' + ids[axisName][keyName].controllerId + '""' );

						}

					}
					addKey( 'func' );
					addKey( position );
					addKey( 'worldPosition' );

					createController( axisControllers.func, ids[axisName].func.controllerId, function () { return options.scales[axisName].name + ' = f(t)'; }, {

						value: func[axisName],
						title: axisName === 'x' ? lang$1.controllerXFunctionTitle : axisName === 'y' ? lang$1.controllerYFunctionTitle : axisName === 'z' ? lang$1.controllerZFunctionTitle : axisName === 'w' ? lang$1.controllerWFunctionTitle : '',
						onchange: function ( event ) {

							try {

								func[axisName] = event.currentTarget.value;
								const value = Player$1.execFunc( func, axisName, options.player.getTime(), options );
								if ( axisControllers.position && axisControllers.position.controller ) {

									const controller = axisControllers.position.controller;
									controller.onchange( { currentTarget: { value: value } } );
									controller.value = value;

								} else
									setPosition( value, axisName );
								if ( options.guiSelectPoint )
									options.guiSelectPoint.update();

							} catch ( e ) {

								alert( 'Axis: ' + options.scales[axisName].name + '. Function: "' + func[axisName] + '". ' + e );
								event.currentTarget.focus();

							}

						},

					} );

					//position
					createController( axisControllers.position, axisName + 'Position', function () { return options.scales[axisName].name; }, {

						value: positionLocal[axisName],
						title: axisName === 'x' ? lang$1.controllerXTitle : axisName === 'y' ? lang$1.controllerYTitle : axisName === 'z' ? lang$1.controllerZTitle : axisName === 'w' ? lang$1.controllerWTitle : '',
						onchange: function ( event ) { setPosition( event.currentTarget.value, axisName ); },
						axisName: axisName,

					} );

					//World position
					createController( axisControllers.worldPosition, axisName + 'WorldPosition', function () { return lang$1.controllerWorld + ' ' + options.scales[axisName].name; }, {

						value: getWorldPosition( mesh, positionLocal )[axisName],
						title: axisName === 'x' ? lang$1.controllerXWorldTitle : axisName === 'y' ? lang$1.controllerYWorldTitle : axisName === 'z' ? lang$1.controllerZWorldTitle : axisName === 'w' ? lang$1.controllerWTitle : '',

					} );

				}

				//point name
				if ( func.name ) {

					if ( !func.controllers.pointName ) func.controllers.pointName = 'pointName';
					const elPointName = typeof func.controllers.pointName === "string" ? document.getElementById( func.controllers.pointName ) : func.controllers.pointName ;
					if ( elPointName ) elPointName.innerHTML = func.name;

				}

				createControllers( 'x' );
				createControllers( 'y' );
				createControllers( 'z' );
				createControllers( 'w' );

			}

		} );

	if ( !options || !options.guiSelectPoint ) {

		if ( options.axesHelper ) options.axesHelper.movePosition();
		return;

	}

	options.guiSelectPoint.setMesh();

	var selectedPointIndex = options.guiSelectPoint.getSelectedPointIndex();
	if (
		( selectedPointIndex !== -1 )
		&& options.guiSelectPoint.isSelectedMesh( mesh )
		&& !mesh.userData.myObject.bufferGeometry//для этих графических объектов изменение позиции в gui происходит в MyObject.setPositionAttributeFromPoint
	) {

		options.guiSelectPoint.setPosition( {

			object: mesh,
			index: selectedPointIndex,

		} );

	}

};

/** @namespace
 * @description set color attribute
 * @param {Object} attributes [geometry.attributes]{@link https://threejs.org/docs/index.html?q=geometry#api/en/core/BufferGeometry.attributes} of the mesh
 * @param {number} i index of the color in the color attribute array.
 * @param {THREE.Color} color color.
 * @returns true - success
 * <p>false - colorAttribute was not detected.</p>
 */
Player$1.setColorAttribute = function ( attributes, i, color ) {

	if ( typeof color === "string" )
		color = new THREE.Color( color );
	const colorAttribute = attributes.color;// || attributes.ca;
	if ( colorAttribute === undefined )
		return false;
	colorAttribute.setX( i, color.r );
	colorAttribute.setY( i, color.g );
	colorAttribute.setZ( i, color.b );
	colorAttribute.needsUpdate = true;
	return true;

};

/** @namespace
 * @description Get array of THREE.Vector4 points.
 * @param {THREE.Vector4|THREE.Vector3|THREE.Vector2|object|array} arrayFuncs <b>points.geometry.attributes.position</b> array
 * <pre>
 * THREE.Vector4: 4D point.
 * THREE.Vector3: 3D point. w = 1. Default is white color
 * THREE.Vector2: 2D point. w = 1, z = 0. Default is white color
 * Vector's x, y, z, w is position of the point.
 * Can be as:
 * <ul>
 * <li>float - position of the point.</li>
 * Example: 0.5
 * <li>[float] - array of positions of the point.</li>
 * Example 1: [0.6, 0, -0.5]
 * 0.6 is positon for t = min is start time of the playing.
 * 0 is position for t = ( max - min ) / 2
 * -0.5 is positon for t = max is stop time of the playing.
 * If stop time of the playing is infinity, then position is equal to the first item of the array or 0.6 in the example 1.
 * 
 * Example 2: [{ t: 0, v: 0.6 }, { t: 1, v: -0.6 }]
 * Every item of array is object with:
 * t is time
 * v is position for current t.
 * <li>[Function]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function} - position of the point is function of the t.
 * Example: new Function( 't', 'a', 'b', 'return Math.sin(t*a*2*Math.PI)*0.5+b' )</li>
 * <li>string - text of the function.
 * Example: 'Math.sin(t*a*2*Math.PI)*0.5+b' )</li>
 * </ul>
 * <b>Vector.w</b> is index of the [palette]{@link https://github.com/anhr/commonNodeJS/tree/master/colorpicker}.
 * Default range of the <b>Vector.w</b> is from 0 to 1. You can change range by use an object:
 * {
 *   func: Vector.w
 *   max: new max value of tne Vector.w
 *   min: new min value of tne Vector.w
 * }
 * Example:
 * {
 *
 *   func: new Function( 't', 'return 1-2*t' ),
 *   min: -1,
 *   max: 1,
 *
 * }
 * <b>Vector.w</b> can be as [THREE.Color]{@link https://threejs.org/docs/index.html?q=colo#api/en/math/Color}. Example: new THREE.Color( "rgb(255, 127, 0)" )
 *
 * object: {
 *   vector: THREE.Vector4|THREE.Vector3|THREE.Vector2 - point position
 *   [name]: point name. Default is undefined.
 *   [trace]: true - displays the trace of the point movement. Default is undefined.
 *   
 *   //You can set the camera to look at a point. Use <b>cameraTarget</b> key for it.
 *   //ATTENTION!!! Only one point can have <b>cameraTarget</b> key!
 *   //   You will receive the 
 *   
 *   //      Player.getPoints: duplicate cameraTarget
 *   
 *   //   console warning if two or more points have <b>cameraTarget</b> key.
 *   //   Then only last point with <b>cameraTarget</b> key will be have an effect.
 *   [cameraTarget]: {
 *
 *      camera: [camera]{@link https://threejs.org/docs/index.html#api/en/cameras/PerspectiveCamera},
 *      
 *      //rotation camera around point specified by an axis and an angle. Default is undefined - no rotation
 *      [rotation]: {
 *      
 *         [angle]: number|function|array. Angle of rotation in radians.
 *            number. Example: Math.PI / 2 rotate to 90 degrees.
 *            function. Example: new Function( 't', 'return 5*t' ).
 *            array. Example 1: [0, Math.PI]
 *                  0 is angle for t = min is start time of the playing.
 *                  Math.PI is rotate to 180 degrees for t = max is time of the stopping of the playing.
 *                  If max time is infinity, then angle is for t = min.
 *               Example 2: [{ t: 0, v: 0 }, { t: 1, v: Math.PI / 2 }
 *                  t is time,
 *                  v is angle for current t.
 *            
 *            Default is 0
 *
 *         [axis]: THREE.Vector3. Axis of rotattion. Example: new THREE.Vector3( 1, 0, 0 ) - rotate around x axis.
 *            Default is new THREE.Vector3( 0, 1, 0 );//Rotate around y axis
 *            
 *      },
 *      
 *      [distanceToCamera]: <b>THREE.Vector3</b>. Distance from point to camera.
 *         You can set the distance to the camera depending on the time.
 *         Example 1: new THREE.Vector3( 0, 0, new Function( 't', 'return 2+t' ) )
 *         Example 2: new THREE.Vector3( 0, 0, [{ t: 0, v: 5 }, { t: 1, v: 2 }, { t: 10, v: 2 }, { t: 11, v: 5 }] )
 *         Default is camera.position.
 *      [orbitControls]: [OrbitControls]{@link https://threejs.org/docs/index.html#examples/en/controls/OrbitControls}. Change the <b>OrbitControl</b> setting during playing.
 *      [orbitControlsGui]: <a href="../../OrbitControls/jsdoc/index.html" target="_blank">OrbitControlsGui</a> instance;
 *
 *   },
 *   //Use controls on the web page for display and edit of the point values.
 *   [controllers]: {
 *   
 *      pointName: HTML element or id of element for point name
 *      
 *      //axisName is "x" or "y" or "z" or "w"
 *      [axisName]: {
 *
 *         //Function text controller
 *         func: {
 *         
 *            controller: HTMLElement - <b>input</b> element of function text
 *               or string - id of the <b>input</b> element. Default id is "[axisName]Func". Example: "xFunc".
 *            elName: HTMLElement - <b>span</b> element of the function name
 *               or string - id of the <b>span</b> element. Default id is "[axisName]FuncName". Example: "xFuncName".
 *               or false - name element is not exists.
 *
 *         }
 *
 *         //Point position controller
 *         position: {
 *
 *            controller: HTMLElement - <b>input</b> element of the point position
 *               or string - id of the <b>input</b> element. Default id is "[axisName]Position". Example: "xPosition".
 *            elName: HTMLElement - <b>span</b> element of the point position name
 *               or string - id of the <b>span</b> element. Default id is "[axisName]PositionName". Example: "xPositionName".
 *               or false - name element is not exists.
 *
 *         }
 *
 *         //World point position controller.
 *         worldPosition: {
 *
 *            controller: HTMLElement - <b>input</b> element of the world point position
 *               or string - id of the <b>input</b> element. Default id is "[axisName]WorldPosition". Example: "xWorldPosition".
 *            elName: HTMLElement - <b>span</b> element of the world point position name
 *               or string - id of the <b>span</b> element. Default id is "[axisName]WorldPositionName". Example: "xWorldPositionName".
 *               or false - name element is not exists.
 *
 *         }
 *
 *      }
 *
 *   },
 *
 * }
 * or
 * object: {
 *   x: x axis. Defauilt is 0.
 *   y: y axis. Defauilt is 0.
 *   z: z axis. Defauilt is 0.
 *   w: w axis. Defauilt is 0.
 * }
 *
 * array: [
 *   0: x axis. Defauilt is 0.
 *   1: y axis. Defauilt is 0.
 *   2: z axis. Defauilt is 0.
 *   3: w axis. Defauilt is 0.
 * ]
 * </pre>
 * @param {object} [optionsPoints] followed optionsPoints is available
 * @param {THREE.Group} [optionsPoints.group] {@link https://threejs.org/docs/index.html#api/en/objects/Group|Group}
 * or {@link https://threejs.org/docs/index.html#api/en/scenes/Scene|Scene}.
 * Use only if you want trace lines during playing. See <b>trace</b> of the <b>arrayFuncs</b> param above.
 * @param {number} [optionsPoints.t=0] first parameter of the <b>arrayFuncs</b> item function. Start time of animation.
 * @param {object} [optionsPoints.options] the following options are available
 * @param {number} [optionsPoints.options.a=1] multiplier. Second parameter of the <b>arrayFuncs</b> item function.
 * @param {number} [optionsPoints.options.b=0] addendum. Third parameter of the <b>arrayFuncs</b> item function.
 * @param {object} [optionsPoints.options.playerOptions] See <b>settings.options.playerOptions</b> parameter of the <a href="../../player/jsdoc/module-Player-Player.html" target="_blank">Player</a> class.
 * @returns array of <b>THREE.Vector4</b> points.
 */
Player$1.getPoints = function ( arrayFuncs, optionsPoints ) {

	assign();
	
	if ( !Array.isArray( arrayFuncs ) ) arrayFuncs = [ arrayFuncs ];
	
	optionsPoints = optionsPoints || {};
	if ( optionsPoints.t === undefined ) optionsPoints.t = optionsPoints.options && optionsPoints.options.player ? optionsPoints.options.player.getSettings().options.playerOptions.min : 0;
	const options = optionsPoints.options || new Options$1(),
		optionsDefault = new Options$1( { palette: options.palette } );
	options.setW( optionsDefault );
	const wDefault = optionsDefault.scales.w.max;//new THREE.Vector4().w;//1;//цвет точки по умолчанию равен цвету палитры для максимального значения value,
						//которе по умолчанияю равно 1 и определяется в Options class.
						//Палитра по умолчанию ColorPicker.paletteIndexes.BGYW
						//у которой цвет максимального значения value белый.
	for ( var i = 0; i < arrayFuncs.length; i++ ) {

		var item = arrayFuncs[i];
		if ( Array.isArray( item ) )
			arrayFuncs[i] = new THREE.Vector4(

				item[0] === undefined ? 0 : item[0],
				item[1] === undefined ? 0 : item[1],
				item[2] === undefined ? 0 : item[2],
				item[3] === undefined ? wDefault : item[3]

			);
		else if (

			( typeof item === "object" )
			&& ( item instanceof THREE.Vector2 === false )
			&& ( item instanceof THREE.Vector3 === false )
			&& ( item instanceof THREE.Vector4 === false )

		) {

			if ( ( item.vector === undefined ) )
				arrayFuncs[i] = new THREE.Vector4(

					item.x === undefined ? 0 : item.x,
					item.y === undefined ? 0 : item.y,
					item.z === undefined ? 0 : item.z,
					item.w === undefined ? 0 : item.w

				);
			else if (

				( item.vector instanceof THREE.Vector2 === true )
				|| ( item.vector instanceof THREE.Vector3 === true )
				|| ( item.vector instanceof THREE.Vector4 === true )

			) {

				if ( item.vector instanceof THREE.Vector2 === true )
					arrayFuncs[i].vector = new THREE.Vector3(

						item.vector.x === undefined ? 0 : item.vector.x,
						item.vector.y === undefined ? 0 : item.vector.y,
						item.vector.z === undefined ? 0 : item.vector.z,

					);

			} else {

				if ( item.vector.length === 4 )
					arrayFuncs[i].vector = new THREE.Vector4(

						item.vector[0] === undefined ? 0 : item.vector[0],
						item.vector[1] === undefined ? 0 : item.vector[1],
						item.vector[2] === undefined ? 0 : item.vector[2],
						item.vector[3] === undefined ? 0 : item.vector[3]

					);
				else if ( item.vector.length === 3 )

					arrayFuncs[i].vector = new THREE.Vector3(

						item.vector[0] === undefined ? 0 : item.vector[0],
						item.vector[1] === undefined ? 0 : item.vector[1],
						item.vector[2] === undefined ? 0 : item.vector[2],

					);
				else if ( item.vector.length < 3 )

					arrayFuncs[i].vector = new THREE.Vector4(

						item.vector[0] === undefined ? 0 : item.vector[0],
						item.vector[1] === undefined ? 0 : item.vector[1],

					);
				else console.error( 'Player.getPoints(...) falied! item.vector.length = ' + item.vector.length );

			}

		}

	}	const points = [];
	for ( var i = 0; i < arrayFuncs.length; i++ ) {

		var funcs = arrayFuncs[i];
		function getAxis( axisName ) {

			if ( typeof funcs === "number" )
				funcs = new THREE.Vector4( funcs, 0, 0, 0 );
			if ( ( funcs instanceof THREE.Vector2 ) || ( funcs instanceof THREE.Vector3 ) || ( funcs instanceof THREE.Vector4 ) ) {

				const value = Player$1.execFunc( funcs, axisName, optionsPoints.t, options );
				return value;

			}
			if ( funcs.vector === undefined ) {

				console.error( 'Player.getAxis().getPoints(): funcs.vector = ' + funcs.vector );
				return;

			}
			if ( funcs.name !== undefined )
				funcs.vector.name = funcs.name;

			if ( funcs.trace ) funcs.vector.trace = funcs.trace;
			if ( funcs.controllers ) funcs.vector.controllers = funcs.controllers;
			if ( funcs.cameraTarget ) {

				funcs.vector.cameraTarget = funcs.cameraTarget;
				delete funcs.cameraTarget;

			}
			arrayFuncs[i] = funcs.vector;
			funcs = funcs.vector;
			return Player$1.execFunc( funcs, axisName, optionsPoints.t, options );


		}
		const point = funcs.vector instanceof THREE.Vector3 === true ?
			new THREE.Vector3( getAxis( 'x' ), getAxis( 'y' ), getAxis( 'z' ) ) :
			new THREE.Vector4( getAxis( 'x' ), getAxis( 'y' ), getAxis( 'z' ), getAxis( 'w' ) );

		if ( funcs.cameraTarget ) {

			funcs.cameraTarget.bodefault = false;
			if ( funcs.cameraTarget.boLook === undefined ) funcs.cameraTarget.boLook = true;

			options.playerOptions.cameraTarget.init( funcs.cameraTarget, options );

		}
		points.push( point );

	}
	return points;

};
var boColorWarning = true;
/** @namespace
 * @description Get array of mesh colors.
 * @param {THREE.Vector4|THREE.Vector3|THREE.Vector2|object|array} arrayFuncs points.geometry.attributes.position array
 * <pre>
 * THREE.Vector4: 4D point.
 * THREE.Vector3: 3D point. w = 1. Default is white color
 * THREE.Vector2: 2D point. w = 1, z = 0. Default is white color
 * Vector's x, y, z, w is position of the point.
 * Can be as:
 * float - position of the point.
 * [float] - array of positions of the point.
 * [Function]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function} - position of the point is function of the t.
 * Example: new Function( 't', 'a', 'b', 'return Math.sin(t*a*2*Math.PI)*0.5+b' )
 *
 * Vector.w is index of the [palette]{@link https://github.com/anhr/commonNodeJS/tree/master/colorpicker}.
 * Default range of the Vector.w is from 0 to 1. You can change range by use an object:
 * {
 *   func: Vector.w
 *   max: new max value of tne Vector.w
 *   min: new min value of tne Vector.w
 * }
 * Example:
 * {
 *
 *   func: new Function( 't', 'return 1-2*t' ),
 *   min: -1,
 *   max: 1,
 *
 * }
 * Vector.w can be as THREE.Color. Example: new THREE.Color( "rgb(255, 127, 0)" )
 *
 * object: {
 *   vector: THREE.Vector4|THREE.Vector3|THREE.Vector2 - point position
 *   [name]: point name. Default is undefined.
 *   [trace]: true - displays the trace of the point movement. Default is undefined.
 * }
 * or
 * object: {
 *   x: x axis. Defauilt is 0.
 *   y: y axis. Defauilt is 0.
 *   z: z axis. Defauilt is 0.
 *   w: w axis. Defauilt is 0.
 * }
 *
 * array: [
 *   0: x axis. Defauilt is 0.
 *   1: y axis. Defauilt is 0.
 *   2: z axis. Defauilt is 0.
 *   3: w axis. Defauilt is 0.
 * ]
 * </pre>
 * @param {object} [optionsColor] the following options are available:
 * @param {object} [optionsColor.options] See the <b>options</b> parameter of the <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
 * @param {THREE.BufferAttribute} [optionsColor.positions] geometry.attributes.position of the new mesh.
 * @param {array} [optionsColor.colors=[]] array for mesh colors.
 * @param {array} [optionsColor.opacity] array of opacities of each geometry position. Each item of array is float value in the range of 0.0 - 1.0 indicating how transparent the material is. A value of 0.0 indicates fully transparent, 1.0 is fully opaque.
 * @returns array of mesh colors.
 */
Player$1.getColors = function ( arrayFuncs, optionsColor ) {

	assign();
	
	if ( !Array.isArray( arrayFuncs ) ) arrayFuncs = [ arrayFuncs ];

	optionsColor = optionsColor || {};
	optionsColor.options = optionsColor.options || {};
	
	if (
		( optionsColor.positions !== undefined ) &&
		Array.isArray( arrayFuncs ) &&
		( arrayFuncs.length !== optionsColor.positions.count )
	) {

		console.error( 'getColors failed! arrayFuncs.length: ' + arrayFuncs.length + ' != positions.count: ' + optionsColor.positions.count );
		return optionsColor.colors;

	}

	//не надо убирать const length. Иначе переполнится память
	const length = Array.isArray( arrayFuncs ) ? arrayFuncs.length : optionsColor.positions.count;

	optionsColor.colors = optionsColor.colors || [];
	const colors = [];
	if ( !optionsColor.options.palette )
		optionsColor.options.setPalette();

	for ( var i = 0; i < length; i++ ) {

		const iColor = 3 * i;
		if (iColor >= optionsColor.colors.length) {
			
			const funcs = Array.isArray( arrayFuncs ) ? arrayFuncs[i] : undefined;
			if (
				( funcs instanceof THREE.Vector4 ) ||//w of the funcs is color of the point
				( optionsColor.positions && ( optionsColor.positions.itemSize === 4 ) )//w position of the positions is color of the point
				) {
	
				let min, max;
				var w = funcs.w;
				if ( funcs.w instanceof Object && funcs.w.func ) {
	
					if ( funcs.w.max ) max = funcs.w.max;
					if ( funcs.w.min ) min = funcs.w.min;
					w = funcs.w.func;
	
				} else {
	
					optionsColor.options.setW();
					min = optionsColor.options.scales.w.min; max = optionsColor.options.scales.w.max;
	
				}
				if ( w instanceof Function && !optionsColor.options.player && boColorWarning ) {
	
					boColorWarning = false;
					
				}
				const t = optionsColor.options.playerOptions ? optionsColor.options.playerOptions.min : 0;
				var color = optionsColor.options.palette.toColor(
					funcs === undefined ?
						new THREE.Vector4().fromBufferAttribute( optionsColor.positions, i ).w :
						w instanceof Function ?
							w( t ) :
							typeof w === "string" ?
								Player$1.execFunc( funcs, 'w', t, optionsColor.options ) :
								w === undefined ? new THREE.Vector4().w : w,
					min, max );
				colors.push( color.r, color.g, color.b );
	
			} else if ( optionsColor.colors instanceof THREE.Float32BufferAttribute )
				new THREE.Vector3( 1, 1, 1 );
			else if (optionsColor.color != undefined) {

				const color = new THREE.Color(optionsColor.color);
				colors.push( color.r, color.g, color.b );//white
				
			} else colors.push( 1, 1, 1 );//white

		}
		else colors.push( optionsColor.colors[iColor], optionsColor.colors[iColor + 1], optionsColor.colors[iColor + 2] );

		//opacity
		if ( optionsColor.opacity instanceof Array )
			colors.push( i < optionsColor.opacity.length ? optionsColor.opacity[i] : 1 );
		else colors.push( 1 );

	}
	optionsColor.colors = colors;
	return optionsColor.colors;

};

/** @class */
Player$1.traceLine = class traceLine
{

	/**
	 * trace line of moving of the point during playing
	 * @param {object} options the following options are available
	 * @param {object} options.player See <a href="../../player/jsdoc/module-Player.html" target="_blank">Player</a>.
	 */
	constructor( options ) {

		var line;
		const arrayLines = [];//сюда добавляются линии когда max: Infinity,

		assign();

		if ( !options.player ) {

			return;

		}
		/**
		 * Is trace line visible?
		 * @returns true - trace line is visible.
		 * <p>false - trace line is not visible.</p>
		 */
		this.isVisible = function () {

			if ( !options.player )
				return false;//не запущен Player(...)

			if ( line ) return line.visible;
			if ( arrayLines.length === 0 ) return false;
			//сюда попадает когда t max is Infinity ( options.playerOptions.max === null ) и когда пользователь выбрал точку в guiSelectPoint у которой установлена трассировка
			return arrayLines[0].visible;

		};
		/**
		 * Show or hide trace line.
		 * @param {boolean} visible true - show trace line.
		 * <p>false - hide trace line.</p>
		 */
		this.visible = function ( visible ) {

			if ( !options.player )
				return false;//не запущен Player(...)

			if ( line ) {

				line.visible = visible;
				return;

			}
			//сюда попадает когда t max is Infinity (options.playerOptions.max === null) и когда пользователь в выбранной в guiSelectPoint  точке изменил галочку трассировки
			arrayLines.forEach( function ( line ) {

				line.visible = visible;

			} );

		};

		/**
		 * add point into trace line.
		 * @param {THREE.Mesh} mesh. See [Mech]{@link https://threejs.org/docs/index.html#api/en/objects/Mesh} for tracing.
		 * @param {number} index of the point for tracing.
		 * @param {THREE.Color} color. Line color. See [Color]{@link https://threejs.org/docs/index.html#api/en/math/Color}.
		 */
		this.addPoint = function ( mesh, index, color ) {

			const attributesPosition = mesh.geometry.attributes.position;
			var point = attributesPosition.itemSize >= 4 ? new THREE.Vector4( 0, 0, 0, 0 ) : new THREE.Vector3();
			point.fromArray( attributesPosition.array, index * attributesPosition.itemSize );

			//нельзя ставить const потому что привыполнении npm run build будет ошибка
			// (babel plugin) SyntaxError: D:/My documents/MyProjects/webgl/three.js/GitHub/commonNodeJS/master/player/player.js: "sceneIndex" is read-only
			var sceneIndex = options.player ? options.player.getSelectSceneIndex() : 0;

			if ( options.playerOptions.max === null ) {

				//Infinity play
				
				sceneIndex = Math.abs( sceneIndex );
				if ( sceneIndex < ( arrayLines.length - 1 ) ) {

					while ( sceneIndex < ( arrayLines.length - 1 ) ) {

						mesh.remove( arrayLines[arrayLines.length - 1] );
						arrayLines.pop();

					}
					return;

				}
				// geometry
				const geometry = new THREE.BufferGeometry(), MAX_POINTS = 2;

				// attributes
				const positions = new Float32Array( MAX_POINTS * 3 ); // 3 coordinates per point
				geometry.setAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
				const colors = new Float32Array( MAX_POINTS * 3 ); // 3 coordinates per point
				geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );

				const line = new THREE.Line( geometry, new THREE.LineBasicMaterial( { vertexColors: true } ) );
				//			group.add( line );
				mesh.add( line );

				//на случай когда пользователь изменил флажок трассировки
				//первая линия arrayLines[0] всегда имеет visible = true потому что сюда попадат только если установлена трассировка по умолчанию
				//или пользователь установил флаг трассировки
				if ( arrayLines[0] ) line.visible = arrayLines[0].visible;

				//point position
				point = new THREE.Vector3().copy( point );
				const itemSize = line.geometry.attributes.position.itemSize;
				point.toArray( line.geometry.attributes.position.array, 1 * itemSize );
				const point0 = arrayLines.length === 0 ? point :
					new THREE.Vector3().fromArray( arrayLines[arrayLines.length - 1].geometry.attributes.position.array, 1 * itemSize );
				point0.toArray( line.geometry.attributes.position.array, 0 * itemSize );
				line.geometry.attributes.position.needsUpdate = true;

				//point color
				if ( color === undefined )
					color = new THREE.Color( 1, 1, 1 );//White
				Player$1.setColorAttribute( line.geometry.attributes, 0, arrayLines.length === 0 ? color :
					new THREE.Color().fromArray( arrayLines[arrayLines.length - 1].geometry.attributes.color.array, 1 * itemSize ) );
				Player$1.setColorAttribute( line.geometry.attributes, 1, color );

				arrayLines.push( line );

				return;

			}
			if ( line === undefined ) {

				// geometry
				const geometry = new THREE.BufferGeometry();

				//Thanks to https://stackoverflow.com/questions/31399856/drawing-a-line-with-three-js-dynamically/31411794#31411794
				var MAX_POINTS;
				if ( options.playerOptions.max !== null ) {

					if ( options.playerOptions && options.playerOptions.marks )
						MAX_POINTS = options.playerOptions.marks;
					else if ( options.player && options.player.marks )
						MAX_POINTS = options.player.marks;
					else {

						console.error( 'Player.traceLine: MAX_POINTS = ' + MAX_POINTS + '. Create Player first or remove all trace = true from all items of the arrayFuncs' );
						return;

					}

				} else MAX_POINTS = sceneIndex + 1;

				// attributes
				const positions = new Float32Array( MAX_POINTS * 3 ); // 3 coordinates per point
				geometry.setAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
				const colors = new Float32Array( MAX_POINTS * 3 ); // 3 coordinates per point
				geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );

				// draw range
				geometry.setDrawRange( sceneIndex, sceneIndex );

				line = new THREE.Line( geometry, new THREE.LineBasicMaterial( {
					
					//неудачная попытка исправить frustumPoints после перехода на THREE.REVISION = "145dev"
					vertexColors: true,

					//THREE.Material: 'vertexColors' parameter is undefined.
					//vertexColors: THREE.VertexColors
				
				} ) );
				line.visible = true;
				mesh.add( line );

			}
			//Если не удалять boundingSphere
			//и если двигается камера от проигрывания или ее перемещает пользователь
			//то в некоторых случаях линию не будет видно даже если она не выходит из поля видимости
			//потому что она выходит за рамки frustupoints
			if ( line.geometry ) {//scene do not have geometry

				delete line.geometry.boundingSphere;
				line.geometry.boundingSphere = null;

			}

			//point position
			point = new THREE.Vector3().copy( point );
			point.toArray( line.geometry.attributes.position.array, sceneIndex * line.geometry.attributes.position.itemSize );
			line.geometry.attributes.position.needsUpdate = true;

			//point color
			if ( color === undefined )
				color = new THREE.Color( 1, 1, 1 );//White
			Player$1.setColorAttribute( line.geometry.attributes, sceneIndex, color );

			//set draw range
			var start = line.geometry.drawRange.start, count = sceneIndex + 1 - start;
			if ( start > sceneIndex ) {

				var stop = start + line.geometry.drawRange.count;
				start = sceneIndex;
				count = stop - start;

			}
			line.geometry.setDrawRange( start, count );

		};
		/**
		 * Remove trace line.
		 */
		this.remove = function () {

			if ( line === undefined )
				return;
			line.geometry.dispose();
			line.material.dispose();
			line.parent.remove( line );
			//		group.remove( line );

		};

	}

};

/** @namespace
 * @description get item size of the attribute of the mesh geometry
 * @param {array} arrayFuncs points.geometry.attributes.position array.
 * See arrayFuncs parametr of the <a href="../../player/jsdoc/module-Player-Player.getPoints.html" target="_blank">Player.getPoints(...)</a> for details.
 */
Player$1.getItemSize = function ( arrayFuncs ) {

	assign();

	for ( var i = 0; i < arrayFuncs.length; i++ ) {

		var func = arrayFuncs[i];
		if ( func instanceof THREE.Vector4 )
			return 4;

	}
	return 3;

};
/** @namespace
 * @description Select a scene for playing
 * @param {THREE.Group} group [THREE.Group]{@link https://threejs.org/docs/index.html#api/en/objects/Group}
 * @param {Object} [settings={}] the following settings are available.
 * @param {number} [settings.t=0] time
 * @param {number} [settings.index] index of the time.
 * @param {Object} [settings.options={}] See the <b>options</b> parameter of the <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
 */
Player$1.selectPlayScene = function ( group, settings = {} ) {

	const t = settings.t !== undefined ? settings.t : 0,
		index = settings.index !== undefined ? settings.index : undefined,
		options = settings.options || new Options$1();
	group.userData.index = index;
	group.userData.t = t;
	if (typeof options.player === "object") options.player.endSelect = () => {
		
		Player$1.selectMeshPlayScene( group, { t: t, options: options } );
		function selectMeshPlayScene( group ) {
	
			group.children.forEach( function ( mesh ) {
	
				if ( mesh instanceof THREE.Group ) selectMeshPlayScene( mesh );
				else Player$1.selectMeshPlayScene( mesh, { t: t, options: options } );
	
			} );
	
		}
		selectMeshPlayScene( group );
		options.playerOptions.cameraTarget.setCameraTarget( options );
		const cameraTarget = options.playerOptions.cameraTarget.get();
	
		//если index === undefined значит пользователь нажал кнопку 'Default' для восстановления положения камеры.
		//Значит надо вызвать camera.userData.default.setDefault()
		//
		//если index !== undefined значит проигрыватель вызывает очередной кадр и не нужно перемещать камеру в исходное положение
		//приуслвии что не выбрана ни одна точка как cameraTarget
		if ( cameraTarget && cameraTarget.setCameraPosition ) cameraTarget.setCameraPosition( index === undefined );
		
	};
	if ( !group.userData.endSelect && (typeof options.player === "object")) options.player.endSelect();

};
var THREE;
/* * @namespace
 * @description assign some THREE methods
 */
function assign( ) {

	if ( !three$1.isThree() ) {

		console.warn( 'Player: can not assign. Set THREE first.' );
		return;

	}
	THREE = three$1.THREE;
	Object.assign( THREE.BufferGeometry.prototype, {

		setFromPoints: function ( points, itemSize ) {

			itemSize = itemSize ||
				
				//for testing:
				//Open http://localhost/anhr/commonNodeJS/master/HyperSphere/Examples/hyperSphere.html
				//Set HyperSphere.classSettings.edges is not false - отображать ребра
				//Take one step of the player →
				points.itemSize ||
				
				3;
			var position = [];

			for ( var i = 0, l = points.length; i < l; i++ ) {

				var point = points[i];
				position.push( point.x, point.y, point.z || 0 );
				if ( itemSize >= 4 )
					position.push( point.w || 0 );

			}

			this.setAttribute( 'position', new THREE.Float32BufferAttribute( position, itemSize ) );

			return this;

		},

	} );

	//three.js\dev\src\math\Vector4.js
	Object.assign( THREE.Vector4.prototype, {

		multiply: function ( v ) {

			this.x *= v.x;
			this.y *= v.y;
			this.z *= v.z;
			if ( v.w !== undefined )
				this.w *= v.w;

			return this;

		},

	} );
	//three.js\dev\src\math\Vector4.js
	Object.assign( THREE.Vector4.prototype, {

		add: function ( v, w ) {

			if ( w !== undefined ) {

				console.warn( 'THREE.Vector4: .add() now only accepts one argument. Use .addVectors( a, b ) instead.' );
				return this.addVectors( v, w );

			}

			this.x += v.x;
			this.y += v.y;
			this.z += v.z;
			if ( v.w !== undefined )
				this.w += v.w;

			return this;

		},

	} );
	//three.js\dev\src\objects\Points.js
	Object.assign( THREE.Points.prototype, {

		raycast: function ( raycaster, intersects ) {

			const _inverseMatrix = new THREE.Matrix4();
			const _ray = new THREE.Ray();
			const _sphere = new THREE.Sphere();
			const _position = new THREE.Vector3();
			function testPoint( point, index, localThresholdSq, matrixWorld, raycaster, intersects, object ) {

				const rayPointDistanceSq = _ray.distanceSqToPoint( point );
				if ( rayPointDistanceSq < localThresholdSq ) {

					const intersectPoint = new THREE.Vector3();

					_ray.closestPointToPoint( point, intersectPoint );
					intersectPoint.applyMatrix4( matrixWorld );

					const distance = raycaster.ray.origin.distanceTo( intersectPoint );

					if ( distance < raycaster.near || distance > raycaster.far ) return;

					intersects.push( {

						distance: distance,
						distanceToRay: Math.sqrt( rayPointDistanceSq ),
						point: intersectPoint,
						index: index,
						face: null,
						object: object

					} );

				}

			}

			const geometry = this.geometry;
			const matrixWorld = this.matrixWorld;
			const threshold = raycaster.params.Points.threshold;

			// Checking boundingSphere distance to ray

			if ( geometry.boundingSphere === null ) geometry.computeBoundingSphere();

			_sphere.copy( geometry.boundingSphere );
			_sphere.applyMatrix4( matrixWorld );
			_sphere.radius += threshold;

			if ( raycaster.ray.intersectsSphere( _sphere ) === false ) return;

			//

			_inverseMatrix.copy( matrixWorld ).invert();
			
			_ray.copy( raycaster.ray ).applyMatrix4( _inverseMatrix );

			const localThreshold = threshold / ( ( this.scale.x + this.scale.y + this.scale.z ) / 3 );
			const localThresholdSq = localThreshold * localThreshold;

			if ( geometry.isBufferGeometry ) {

				const index = geometry.index;
				const attributes = geometry.attributes;
				const positions = attributes.position.array;
				const itemSize = attributes.position.itemSize;

				if ( index !== null ) {

					const indices = index.array;

					for ( let i = 0, il = indices.length; i < il; i++ ) {

						const a = indices[i];

						_position.fromArray( positions, a * itemSize );

						testPoint( _position, a, localThresholdSq, matrixWorld, raycaster, intersects, this );

					}

				} else {

					for ( let i = 0, l = positions.length / itemSize; i < l; i++ ) {

						_position.fromArray( positions, i * itemSize );

						testPoint( _position, i, localThresholdSq, matrixWorld, raycaster, intersects, this );

					}

				}

			} else {

				const vertices = geometry.vertices;

				for ( let i = 0, l = vertices.length; i < l; i++ ) {

					testPoint( vertices[i], i, localThresholdSq, matrixWorld, raycaster, intersects, this );

				}

			}

		},

	} );

}
//assign();
/**
 * @namespace
 * @description assign some THREE methods
 * */
Player$1.assign = function () { assign(); };

var Player$2 = Player$1;

/**
 * @module myObject
 * @description Base class for my threejs objects.
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

const sMyObject = 'MyObject';

/**
 * @class Base class for my threejs objects.
 * <pre>
 * Examples of child classes:
 *   <a href="../../getShaderMaterialPoints/jsdoc/module-getShaderMaterialPoints-getShaderMaterialPoints.html" target="_blank">getShaderMaterialPoints</a>,
 *   <a href="../../HyperSphere/jsdoc/module-HyperSphere-HyperSphere.html" target="_blank">HyperSphere</a>,
 *   <a href="../../myPoints/jsdoc/module-MyPoints-MyPoints.html" target="_blank">MyPoints</a>,
 *   <a href="../../nD/jsdoc/module-ND-ND.html" target="_blank">ND</a>.
 * </pre>
 */
class MyObject {

	/**
	 * 
	 * @param {object} settings See child class (<a href="../../nD/jsdoc/module-ND-ND.html" target="_blank">ND</a>, <a href="../../myPoints/jsdoc/module-MyPoints-MyPoints.html" target="_blank">MyPoints</a>) <b>settings.
	 * @param {any} vertices
	 */
	constructor(settings={}, vertices) {

		const _this = this;

		//иммитация наследования классов
		//settings.overriddenProperties ||= {};uncompatible with myThree.js → ./build/myThree.js, ./ build / myThree.module.js...
		if (!settings.overriddenProperties) settings.overriddenProperties = {};
		//settings.overriddenProperties.setDrawRange ||= (start, count) => { }uncompatible with myThree.js → ./build/myThree.js, ./ build / myThree.module.js...
		if (!settings.overriddenProperties.setDrawRange) settings.overriddenProperties.setDrawRange = (start, count) => { };
		settings.overriddenProperties.getPlayerTimesLength = () => { return 1; };
		if (!settings.overriddenProperties.positionOffsetId) settings.overriddenProperties.positionOffsetId = (positionId) => { return positionId; };
		
		if (settings.guiPoints) this.guiPoints = settings.guiPoints;

		settings.object = settings.object || {};
		settings.object.geometry = settings.object.geometry || {};

		this.isSetPosition = settings.isSetPosition;

		const timeId = (settings.options && settings.options.player) ? settings.options.player.getTimeId() : 0, geometry = settings.object.geometry,
			geometryPosition = geometry.position;
		if ((timeId === 0) && (!geometryPosition || !geometryPosition.isPositionProxy)) {

			geometry.position = new Proxy(geometryPosition || [], {
	
				get: (positions, name) => {
					
					const positionId = parseInt(name);
					if (!isNaN(positionId)) {
						
						return new Proxy(positions[positionId], {
	
							set: (position, name, value) => {
	
								const axisId = parseInt(name);
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
	
						case 'isPositionProxy': return true;
	
					}
					return positions[name];
					
				},
				
			});

		}
	
		const THREE = three$1.THREE;

		if (!settings.bufferGeometry) {
			
			settings.bufferGeometry = new THREE.BufferGeometry();
			Object.defineProperty(settings.bufferGeometry.userData, 'timeId', {

				get: () => { return 0; },
				set: (timeIdNew) => { },//ignore timeIdNew
				configurable: true,//https://stackoverflow.com/a/25518045/5175935

			});
			
		}
		/**
		 * [BufferGeometry]{@link https://threejs.org/docs/index.html?q=BufferGeometry#api/en/core/BufferGeometry} of the child graphical object.
		 */
		this.bufferGeometry = settings.bufferGeometry;

		if (vertices)
			//for for compatibility with ND
			//Что бы можно было менять позицию и цвет вершины
			if (!settings.object.geometry.position) settings.object.geometry.position = vertices;
		
		//Эту строку нельзя использовать потому что во вселенной будет ошибка
		//TypeError: classSettings.overriddenProperties.position0.angles[verticeId].middleVertice is not a function
		//если:
		//Открыть http://localhost/anhr/universe/main/hyperSphere/Examples/ что бы не было видно ребер classSettings.edges.project = true
		//Сделать один шаг проигрывателя: нажать →
		//Сделать ребра невидимыми: Поставить галочку Гиперсфера\Ребро\Отображать.
		//Сделать один шаг проигрывателя: нажать →
		//Это происходить потому что когда проигрыватель находится не в начальном положении timeId > 0, то в settings.object.geometry.position попадают вершины не из начального времени
		//			settings.object.geometry.position = settings.object.geometry.position || vertices;

		/**
		 * Determines the part of the child graphical object geometry to render. See [BufferGeometry.drawRange]{@link https://threejs.org/docs/index.html?q=BufferGeometry#api/en/core/BufferGeometry.drawRange}.
		 * @param {number} start Identifier of the start vertice to render.
		 * @param {number} count Count of vertices to render.
		 */
		this.setVerticesRange = (start, count) => {
			
			const bufferGeometry = settings.bufferGeometry, position = bufferGeometry.attributes.position;
			
			//Когда bufferGeometry.index != null, и отображаются вершины,
			//то в drawRange задается диапазон видимых вершин без учета размера каждой вершины bufferGeometry.attributes.positionю.itemSize
			const itemSize = ((position && (bufferGeometry.index != null)) ? position.itemSize : 1);
			
			this.setDrawRange(start * itemSize, count * itemSize, bufferGeometry.drawRange.types.vertices);//https://threejs.org/docs/index.html?q=BufferGeometry#api/en/core/BufferGeometry.setDrawRange
			
		};
		/**
		 * Determines the part of edges of the child graphical object geometry to render. See [BufferGeometry.drawRange]{@link https://threejs.org/docs/index.html?q=BufferGeometry#api/en/core/BufferGeometry.drawRange}.
		 * @param {number} [start=0] Identifier of the start edge to render.
		 * @param {number} [timeId] Time identifier of the <a href="../../player/jsdoc/module-Player-Player.html" target="_blank">player</a> that determines of the end edge to render.
		 */
		this.setEdgesRange = (start = 0, timeId) => {

			const drawRange = settings.bufferGeometry.drawRange;
			start = start != undefined ? start : drawRange.start;
			const timeEdgesLength = settings.object.geometry.indices[0].timeEdgesCount * 2;
			this.setDrawRange(timeEdgesLength * start, timeEdgesLength * (((timeId != undefined) ? timeId : settings.options.player.getTimeId() + 1) - start), drawRange.types.edges);
		
		};
		/**
		 * Determines the part of vertices or edges of the child graphical object geometry to render. See [BufferGeometry.drawRange]{@link https://threejs.org/docs/index.html?q=BufferGeometry#api/en/core/BufferGeometry.drawRange}.
		 * @param {number} start Identifier of the start vertice or edge to render.
		 * @param {number} count Count of vertices or edges to render.
		 * @param {number} type For debug. 0 - vertices draw range. 1 - edge's draw range.
		 */
		this.setDrawRange = (start, count, type) => {

			if (settings.debug) {
				
				if (type != undefined) settings.bufferGeometry.drawRange.type = type;
				else console.error(sMyObject + ': setDrawRange(...). Invalid type = ' + type);
				if (!Number.isInteger(start) || ((count != Infinity) && !Number.isInteger(count))) console.error(sMyObject + ': setDrawRange(...). Invalid drawRange = { start: ' + start + ', count: ' + count + ' }');
				
			}
			settings.overriddenProperties.setDrawRange(start, count);
		
		};
		const getPlayerTimesLength = () => { return settings.overriddenProperties.getPlayerTimesLength(); };

		//Для отладки
		const setDrawRangeTypes = () => {

			settings.bufferGeometry.drawRange.types = { vertices: 0, edges: 1 };
			//settings.bufferGeometry.drawRange.type = settings.bufferGeometry.drawRange.types.vertices Установлен диапазон видимых вершин
			//settings.bufferGeometry.drawRange.type = settings.bufferGeometry.drawRange.types.edges Установлен диапазон видимых ребер

		};

		const createPositionAttribute = (pointLength, pointsLength) => {

			//https://stackoverflow.com/questions/31399856/drawing-a-line-with-three-js-dynamically/31411794#31411794
			const isRCount = settings.object.geometry.rCount != undefined, MAX_POINTS = isRCount ?
				//резервирую место для вершин, которые появятся по мере проигрывания player.
				//Это случается когда во вселенной вычисляется очередной шаг по времени. Тоесть пользователь нажал ► или →
				pointLength * pointsLength * settings.object.geometry.rCount :
				settings.object.geometry.MAX_POINTS;

			setDrawRangeTypes();
			
			if (MAX_POINTS != undefined) this.setVerticesRange(0, isRCount ?
				pointLength * pointsLength * getPlayerTimesLength()://зарезервировано место для вершин вселенной с разным радиусом
				//Имеются ребра. В этом случае settings.bufferGeometry.drawRange.count определяет количество отображаемых ребер
				//Сейчас ребра еще не созданы. Поэтому settings.bufferGeometry.drawRange будет установлено после вызова this.setDrawRange
				Infinity//pointsLength * 2 - 1
				);
			if (isRCount) settings.bufferGeometry.userData.drawRange = () => { return settings.bufferGeometry.drawRange; };
			const positions = new Float32Array((MAX_POINTS != undefined ? MAX_POINTS : pointsLength) * pointLength);
			settings.bufferGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, pointLength));
			settings.bufferGeometry.userData.positionOffsetId = (positionId) => { return this.positionOffsetId(positionId) };
			settings.bufferGeometry.userData.position = new Proxy(settings.bufferGeometry.attributes.position, {
	
				get: (position, name) => {
	
					const positionId = parseInt(name);
					if (!isNaN(positionId)) {

						const positionOffset = this.positionOffset(position, positionId),
							array = position.array;
						const verticeProxy = new Proxy([], {

							get: (vertice, name) => {
								
								const axisId = parseInt(name);
								if (!isNaN(axisId)) {

									if (axisId >= position.itemSize) {
										
										//console.error(sMyObject + ': get position axis failed. Invalid axisId = ' + axisId);
										return;

									}
									return array[positionOffset + axisId];
									
								}
								switch (name) {

									case 'forEach': return (item) => {

										for (let axisId = 0; axisId < position.itemSize; axisId++) item(array[positionOffset + axisId], axisId);
											
									}
									case 'length': return position.itemSize;
									case 'toJSON': return (item) => {

										let res = '[';
										verticeProxy.forEach(axis => { res += axis + ', '; });
										return res.substring(0, res.length-2) + ']';
											
									}
									case 'x': return array[positionOffset + 0];
									case 'y': return array[positionOffset + 1];
									case 'z': return array[positionOffset + 2];
									case 'w': {

										if (position.itemSize < 4) return;
										return array[positionOffset + 3];

									}

									//для вывода углов на консоль
									//Если оставить эту строку, то будет исключение в строке
									//return new Proxy(timeAngles[verticeId]
									//в файле hyperSphere.js потому что в массиве timeAngles нет углов с индексом verticeId
									//Для проверки открыть http://localhost/anhr/universe/main/hyperSphere/Examples/
									//Нажать ► проигрывателя
									case 'angles': return settings.object.geometry.times[vertice.timeId][positionId];
									case 'edges':  return settings.object.geometry.times[0][positionId].edges;
									case 'vector':
										const vector = vertice.vector;
										if (vector) {

											console.error('Under constraction');
											return vector;
											
										}
										{//hide vertice
											//для совместимости с Player.getPoints.
											//Открыть вселенную http://localhost/anhr/universe/main/hyperSphere/Examples/ с отображением ребер classSettings.edges.project != false
											//Сделать один шаг проигрывателя. Появятся ребра для вселенной с новым временем.
											//Убрать галочку "Гиперсфера.Вершины.Ребро.Отображать"classSettings.edges.project = false что бы реьа заменить на вершины
											const vertice = verticeProxy;
											switch(vertice.length){

												case 3: return new THREE.Vector3(vertice[0], vertice[1], vertice[2]);
												case 4: return new THREE.Vector4(vertice[0], vertice[1], vertice[2], vertice[3]);
													
											}
											console.error(sMyObject + ': get vertice.vector failed. Invalid vertice.length = ' + vertice.length);
											
										}
										return vertice[name];
				
								}
								if (_this.getPositionItem) {

									const res = _this.getPositionItem(verticeProxy, name);
									if (res != undefined) return res;

								}
								return vertice[name];
								
							},
							set: (vertice, name, value) => {

								//edit vertice in http://localhost/anhr/commonNodeJS/master/nD/Examples/ for testing
								const axisId = parseInt(name);
								if (!isNaN(axisId)) {

									array[positionOffset + axisId] = value;
									return true;
									
								}
								vertice[name] = value;
								return true;
								
							}
							
						});
						return verticeProxy;
	
					}
					switch (name) {
	
						case 'length': return position.count;
						case 'itemSize': return position.itemSize;
	
					}
					console.error(sMyObject + ': get settings.bufferGeometry.userData.position. Invalid name: ' + name);
					return position[name];
	
				}
	
			});			

			//color
			if (_this.setW) _this.setW();
			const itemSize = settings.object.geometry.opacity ? 4 : 3, colors = new Float32Array((MAX_POINTS != undefined ? MAX_POINTS : pointsLength) * itemSize);
			if (itemSize === 4){

				let colorId = itemSize - 1;
				const opacity = settings.object.geometry.opacity;
				//set opacity
				while(colorId < colors.length) {

					colors[colorId] = opacity;
					colorId += itemSize;
					
				}
			}
			settings.bufferGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, itemSize));

		};
		/**
		 * Sets the [BufferGeometry]{@link https://threejs.org/docs/index.html?q=BufferGeometry#api/en/core/BufferGeometry} position attribute from <b>points</b> array.
		 * @param {Array} points Points array.
		 * @param {boolean} boCreatePositionAttribute true - replace old position attribute to new if it exists.
		 */
		this.setPositionAttributeFromPoints = (points, boCreatePositionAttribute) => {

			const bufferAttributes = settings.bufferAttributes, bufferGeometry = settings.bufferGeometry;
			if (bufferAttributes) {

				Object.keys(bufferAttributes).forEach((key) => {

					if (bufferGeometry.attributes[key]) console.error(sMyObject + '.setPositionAttributeFromPoints: Duplicated attribute: ' + key);
					bufferGeometry.setAttribute(key, bufferAttributes[key]);
					
				} );
				settings.overriddenProperties.setTracesIndices(bufferGeometry);
				setDrawRangeTypes();
				return;
				
			}
			if (boCreatePositionAttribute) delete bufferGeometry.attributes.position;
			if (!bufferGeometry.attributes.position) {
				
				createPositionAttribute(
					this.pointLength ? this.pointLength() :
						points[0].w === undefined ? 3 : 4,
					points.length);
				const boLog = this.classSettings && (this.classSettings.debug != undefined) && (this.classSettings.debug != false) && (this.classSettings.debug.log != false);
				for (let timeId = 0; timeId < getPlayerTimesLength(); timeId++) {
					
					if (boLog) console.log('timeId = ' + timeId);
					for (let i = 0; i < points.length; i++) {

						const vertice = this.setPositionAttributeFromPoint(i, undefined, timeId);
						if (boLog) console.log('\tvertice[' + i + '] = ' + JSON.stringify(vertice));

					}
					if (boLog) console.log('');

				}

			}
			return bufferGeometry;
			
		};
		/**
		 * Vertice color.
		 * @param {number} i Vertice identifier.
		 * @param {Array} vertice Vertice axis array.
		 * @param {number} timeId Time identifier of the <a href="../../player/jsdoc/module-Player-Player.html" target="_blank">player</a> that determines current vertice color.
		 */
		this.verticeColor = (i, vertice, timeId) => {

			const colors = settings.object.geometry.colors;
			if (colors) {
				
				const colorsId = i * 3;
				if (colors[colorsId] != undefined)
					return [colors[colorsId], colors[colorsId + 1], colors[colorsId + 2]];
				
			}
			const color = settings.object.color;
			if (typeof color === "function") return color(timeId);
			if ((color != undefined) && (typeof color != 'object')) return new THREE.Color(_this.color());
			//Вершина не имеет 4 координаты. Установить цвет вершины по умолчанию
			const getDefaultColor = () => { return new THREE.Color(_this.color()); };
			let w;
			if (vertice) w = vertice.w;
			else if (!_this.getPoint) {

				const position = _this.bufferGeometry.attributes.position;
				if (position.itemSize != 4) return getDefaultColor();
				w = new THREE.Vector4().fromBufferAttribute(position, i).w;

			}
			else w = _this.getPoint(i).w;
			if (w === undefined) return getDefaultColor();
			return w;

		};
		/**
		 * Gets a position data.
		 * @param {number} i Vertice identifier for <b>timeId</b> = 0.
		 * @param {number} timeId Time identifier of the <a href="../../player/jsdoc/module-Player-Player.html" target="_blank">player</a> that determines current position data.
		 * @return position data object. Object properties:
		 * <pre>
		 *   verticeId: Vertice identifier for current <b>timeId</b>.
		 *   itemSize: Size of the position axis array.
		 *   positionBlockLength: Positions count for current time.
		 *   positionId: <b>verticeId</b> * <b>itemSize</b>.
		 * <pre>
		 */
		this.getPositionData = (i, timeId) => {

			//Во вселенной, когда пользователь щелкает по вершине, то индекс вершины i будет равен положению вершины в attributes.position
			//а должен быть равен индексу вершины для текущего времени.
			if (_this.guiPoints && _this.guiPoints.verticeId) {
				
				i = _this.guiPoints.verticeId;
				timeId = _this.guiPoints.timeId;

			}
			i = parseInt(i);
			
			if (timeId === undefined) timeId = 0;
			if (i === undefined) console.error(sMyObject + '.getPositionData. Invalid i = ' + i);
			const userData = settings.bufferGeometry.userData,
				positionBlockLength = userData.positionBlockLength === undefined ? 0 : userData.positionBlockLength,
				itemSize = settings.bufferGeometry.attributes.position.itemSize,
				verticeId = positionBlockLength * timeId + i;
			return {

				verticeId: verticeId,
				itemSize: itemSize,
				positionBlockLength: positionBlockLength,
				positionId: verticeId * itemSize,

			}
			
		};
		/**
		 * Sets the [BufferGeometry]{@link https://threejs.org/docs/index.html?q=BufferGeometry#api/en/core/BufferGeometry} position attribute from <b>vertice</b>.
		 * @param {number} i Vertice identifier for <b>timeId</b> = 0.
		 * @param {Array} [vertice] Vertice axis array for current <b>timeId</b>.
		 * @param {number} timeId Time identifier of the <a href="../../player/jsdoc/module-Player-Player.html" target="_blank">player</a> that determines current vertice.
		 */
		this.setPositionAttributeFromPoint = (i, vertice, timeId) => {

			//Position attribute
			
			vertice = vertice || _this.getPoint(i, timeId);
			const attributes = settings.bufferGeometry.attributes, positionData = this.getPositionData(i, timeId),
				positionBlockLength = positionData.positionBlockLength;
			let itemSize = positionData.itemSize, positionId = positionData.positionId, array = attributes.position.array;
			                  array [positionId] = vertice.x != undefined ? vertice.x : vertice[0] != undefined ? vertice[0] : 0;
			if (itemSize > 1) array [++positionId] = vertice.y != undefined ? vertice.y : vertice[1] != undefined ? vertice[1] : 0;
			if (itemSize > 2) array [++positionId] = vertice.z != undefined ? vertice.z : vertice[2] != undefined ? vertice[2] : 0;
			const w = vertice.w != undefined ? vertice.w : vertice[3];
			if (itemSize > 3) array [++positionId] = w;

			const drawRange = settings.bufferGeometry.drawRange;
			if ((drawRange.count === Infinity) || (((drawRange.start + drawRange.count) * ((settings.bufferGeometry.index === null) ? itemSize : 1)) < positionId)){

//				this.setVerticesRange(drawRange.start, (positionId - drawRange.start + 1) / itemSize);
				this.setVerticesRange(drawRange.start, (positionId + 1) / itemSize - drawRange.start);
				if (!Number.isInteger(drawRange.count) && (drawRange.count != Infinity)) console.error(sMyObject + '.setPositionAttributeFromPoint failed. Invalid drawRange.count = ' + drawRange.count);

			}

			//gui
			const guiSelectPoint = settings.options.guiSelectPoint,
				object3D = this.object3D;
			if (guiSelectPoint && (guiSelectPoint.getSelectedPointIndexShort() === i) && guiSelectPoint.isSelectedMesh(object3D)) {
				
				guiSelectPoint.setPosition( { index: i, object: object3D });
				if (object3D && object3D.userData.gui) object3D.userData.gui.reset();//в hyperSphere обновить выделенные ребра, среднюю вершину и плоскости вращения углов

			}

			//Color attribute

			itemSize = attributes.color.itemSize;
			let colorId = i * itemSize + (timeId === undefined ? 0 : positionBlockLength * timeId * itemSize);
			array = attributes.color.array;
			const verticeColor = this.verticeColor(i, vertice, timeId);
			if (typeof verticeColor === 'number'){

				if (settings.options) {
					
					const wScale = settings.options.scales.w;
					Player$2.setColorAttribute(attributes, i + (timeId === undefined ? 0 : positionBlockLength * timeId), settings.options.palette.toColor(verticeColor, wScale.min, wScale.max));

				}
				colorId += attributes.color.itemSize - 1;
				
			} else if (Array.isArray(verticeColor)) verticeColor.forEach(item => array[colorId++] = item);
			else if (verticeColor instanceof THREE.Color) {

				array [colorId++] = verticeColor.r;
				array [colorId++] = verticeColor.g;
				array [colorId++] = verticeColor.b;
				
			}
			else console.error(sMyObject + '.setPositionAttributeFromPoint: Invalid verticeColor = ' + verticeColor);

			//opacity
			if (attributes.color.itemSize > 3) this.verticeOpacity(i);

			return vertice;
			
		};
		/**
		 * Vertice opacity.
		 * @param {number} i Vertice identifier.
		 * @param {Boolean} [transparent] See [transparent]{@link https://threejs.org/docs/index.html?q=LineBasicMaterial#api/en/materials/Material.transparent}.
		 * @param {number} [opacity] See [opacity]{@link https://threejs.org/docs/index.html?q=LineBasicMaterial#api/en/materials/Material.opacity}.
		 */
		this.verticeOpacity = (i, transparent, opacity) => {

			const color = settings.bufferGeometry.attributes.color;
			if (color.itemSize != 4) {

				console.error(sMyObject + '.verticeOpacity: Invalid color.itemSize = ' + color.itemSize);
				return;

			}
			const array = color.array;
			const verticeOpacity = settings.object.geometry.opacity ? settings.object.geometry.opacity[i] : undefined;
			array[color.itemSize * i + 3] = transparent ? opacity : verticeOpacity === undefined ? 1 : verticeOpacity;
			color.needsUpdate = true;

		};
		/**
		 * Opacity for all vertices.
		 * @param {Array} [transparent] See [transparent]{@link https://threejs.org/docs/index.html?q=LineBasicMaterial#api/en/materials/Material.transparent}.
		 * @param {number} [opacity] See [opacity]{@link https://threejs.org/docs/index.html?q=LineBasicMaterial#api/en/materials/Material.opacity}.
		 */
		this.verticesOpacity = (transparent, opacity) => {
			
			const color = settings.bufferGeometry.attributes.color;
			if ( color && ( color.itemSize > 3 ) ) {

				for ( let i = 0; i < color.count; i++ ) { this.verticeOpacity(i, transparent, opacity); }

			} else {

				const object3D = _this.object3D;
				if (object3D) {
					
					object3D.material.transparent = transparent;
					object3D.material.opacity = transparent ? opacity : 1;
					object3D.material.needsUpdate = true;//for THREE.REVISION = "145dev"

				} else console.error(sMyObject + '.verticesOpacity: Invalid object3D');
				
			}
	
		};
		/**
		 * @return The child graphical object color or <a href="../../player/jsdoc/module-Player-Player.html" target="_blank">player</a> time if graphical object color is not defined.
		 */
		this.color = () => {
	
			const color = settings.object.color != undefined ? settings.object.color : settings.pointsOptions != undefined ? settings.pointsOptions.color : undefined;
			return (color != undefined) ? 
				(typeof color === "function") ? color() : color :
				this.defaultColor;//'lime';
		
		};
		/**
		 * @param {number} positionId Position identifier for start time.
		 * @returns Offset of the position identifier for current time.
		 */
		this.positionOffsetId = (positionId) => {

/*			
			const settings = this.classSettings.settings;
			return settings.bufferGeometry.userData.timeId * settings.object.geometry.angles.length + positionId;
*/			
			return settings.overriddenProperties.positionOffsetId(positionId);
			
		};
		
	}
	
	//base methods

	/**
	 * Returns 'white'.
	 */
	get defaultColor() { return 'white'; }
	/**
	 * Returns <b>true</b> if a child graphical object can be transparent.
	 */
	get isOpacity() {

		if (this.bufferGeometry.attributes.color && (this.bufferGeometry.attributes.color.itemSize > 3)) {
			
			if (!this.object3D.material.transparent) console.error(sMyObject + '.isOpacity: invalid this.object3D.material.transparent = ' + this.object3D.material.transparent);
			return true;

		}
		return false;
	
	}
	/**
	 * @param {object} position [BufferGeometry]{@link https://threejs.org/docs/index.html?q=BufferGeometry#api/en/core/BufferGeometry} <b>position</b> attribute of the child graphical object.
	 * @param {number} positionId Position identifier for start time.
	 * @returns Offset of the position in the <b>position</b> attribute for current time.
	 */
	positionOffset(position, positionId) {

		return this.positionOffsetId(positionId) * position.itemSize;
/*		
		const settings = this.classSettings.settings;
		return (settings.bufferGeometry.userData.timeId * settings.object.geometry.angles.length + positionId) * position.itemSize;
*/		
		
	}

}

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

//Thanks to https://stackoverflow.com/a/27369985/5175935
//Такая же функция есть в frustumPoints.js но если ее использовать то она будет возвращать путь на frustumPoints.js
const getCurrentScript$1 = function () {

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
const getCurrentScriptPath$1 = function () {
	const script = getCurrentScript$1(),
		path = script.substring( 0, script.lastIndexOf( '/' ) );
	return path;
};
const currentScriptPath$1 = getCurrentScriptPath$1(),
	_vertex_text = {

		array: [],
		setItem: function ( path, text ) { this.array.push( { path: path, text: text } ); },
		getItem: function ( path ) {

			for ( var i = 0; i < this.array.length; i++ ) { if ( this.array[i].path === path ) return this.array[i].text; }

		}

	},
	_fragment_text = {

		array: [],
		setItem: function ( path, text ) { this.array.push( { path: path, text: text } ); },
		getItem: function ( path ) {

			for ( var i = 0; i < this.array.length; i++ ) { if ( this.array[i].path === path ) return this.array[i].text; }

		}

	};

/**
 * Gets [THREE.Points]{@link https://threejs.org/docs/index.html?q=Points#api/en/objects/Points} with [THREE.ShaderMaterial]{@link https://threejs.org/docs/index.html?q=ShaderMaterial#api/en/materials/ShaderMaterial} material.
 * Extends <a href="../../jsdoc/MyObject/module-myObject-MyObject.html" target="_blank">MyObject</a>.
 * @class
 * @extends MyObject
 */
class getShaderMaterialPoints extends MyObject {

	/**
	 * Gets [THREE.Points]{@link https://threejs.org/docs/index.html?q=Points#api/en/objects/Points} with [THREE.ShaderMaterial]{@link https://threejs.org/docs/index.html?q=ShaderMaterial#api/en/materials/ShaderMaterial} material
	 * @param {THREE.Group|THREE.Scene} group [THREE.Group]{@link https://threejs.org/docs/index.html?q=group#api/en/objects/Group} or [THREE.Scene]{@link https://threejs.org/docs/index.html?q=sce#api/en/scenes/Scene}.
	 * @param {array} arrayFuncs <b>points.geometry.attributes.position</b> array.
	 * See <b>arrayFuncs</b> parametr of the <a href="../../player/jsdoc/module-Player-Player.getPoints.html" target="_blank">Player.getPoints(...)</a> for details.
	 * @param {function(THREE.Points)} onReady Callback function that take as input the new THREE.Points.
	 * @param {object} [settings={}]
	 * @param {number} [settings.tMin=0] start time. Uses for playing of the points.
	 * @param {object} [settings.pointsOptions] points options.
	 * See <b>settings.pointsOptions</b> of <a href="../../MyPoints/jsdoc/module-MyPoints.html" target="_blank">MyPoints</a> for details.
	 * @param {object} [settings.options={}] see <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> <b>options</b> parameter for details
	 * @param {Object} [settings.options.point] point options.
	 * See <a href="../../jsdoc/Options/Options.html#point" target="_blank">Options get point</a> member for details.
	 * @param {number} [settings.options.scales] Axis scales.
	 * See  <b>options.scales</b> of the <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> for details.
	 * @param {object} [settings.options.scales.w] w axis scale.
	 * See <a href="../../jsdoc/Options/Options.html#setW" target="_blank">Options.setW(options)</a> for details.
	*/
	constructor(group, arrayFuncs, onReady, settings = {}) {

		super(settings, arrayFuncs);

		const THREE = three$1.THREE, tMin = settings.pointsOptions === undefined ?
			settings.tMin === undefined ? 0 : settings.tMin :
			settings.pointsOptions.tMin === undefined ? 0 : settings.pointsOptions.tMin;

		settings.options = settings.options || new Options$1();

		settings.pointsOptions = settings.pointsOptions || {};

		//Эту строку нужно вызывать до создания точек THREE.Points
		//что бы вызывалась моя версия THREE.BufferGeometry().setFromPoints для создания geometry c itemSize = 4
		//потому что в противном случае при добавлени этих точек в FrustumPoints.pushArrayCloud() координата w будет undefined
		Player$2.assign();

		var geometry;
		if (arrayFuncs instanceof THREE.BufferGeometry) {

			geometry = arrayFuncs;
			arrayFuncs = [];
			for (var i = 0; i < geometry.attributes.position.count; i++)
				arrayFuncs.push(new THREE.Vector3().fromBufferAttribute(geometry.attributes.position, i));

		} else if (typeof arrayFuncs === 'function')
			geometry = arrayFuncs();
		else {

			if (settings.pointsOptions.bufferGeometry)
				geometry = settings.pointsOptions.bufferGeometry;
			else {
				
				const points = arrayFuncs != undefined ? Player$2.getPoints(arrayFuncs, { options: settings.options, group: group, t: tMin, }) : undefined;
				this.getPoint = (i) => { return points[i]; };
				geometry = this.setPositionAttributeFromPoints(points);

			}

		}
		const indexArrayCloud = settings.pointsOptions.frustumPoints ? settings.pointsOptions.frustumPoints.pushArrayCloud(geometry) : undefined;//индекс массива точек в FrustumPoints.arrayCloud которые принадлежат этому points
/*
		if ((settings.pointsOptions === undefined) || !settings.pointsOptions.boFrustumPoints) {

			//если не делать эту проверку, то будет неправильный цвет точки, если не задана палитра и шкала w
			if (!settings.options.scales.w) settings.options.scales.setW();
			geometry.setAttribute(
				'color',
				new THREE.Float32BufferAttribute(Player.getColors
				(arrayFuncs,
					{

						color: settings.pointsOptions.color,
						colors: settings.pointsOptions.colors,
						opacity: settings.pointsOptions === undefined ? undefined : settings.pointsOptions.opacity,
						positions: geometry.attributes.position,
						options: settings.options,

					}),
				4));

		}
*/		

		const texture = new THREE.TextureLoader().load(currentScriptPath$1 + "/textures/point.png",
			function (texture) { }, function () { }, function () { console.error('THREE.TextureLoader: error'); });
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;

		const uniforms = {

			pointTexture: { value: texture },

			pointSize: {

				value: (settings.pointsOptions !== undefined) && (settings.pointsOptions.shaderMaterial !== undefined) && (settings.pointsOptions.shaderMaterial.point !== undefined) ?
					settings.pointsOptions.shaderMaterial.point.size :
					settings.options.point.size

			},

		};

		var cloud;
		if ((settings.pointsOptions !== undefined) && (settings.pointsOptions.uniforms !== undefined))
			cloud = settings.pointsOptions.uniforms(uniforms);


		/**
		 * Loading of the vertex and fragment contents from external files.
		 * Thanks to https://stackoverflow.com/a/48188509/5175935
		 * @param {function()} onLoad Callback function that called after success loading.
		 * */
		function loadShaderText(onload, path) {

			const shaderText = {};

			/**
			 * This is a basic asyncronous shader loader for THREE.js.
			 * Thanks to https://www.davideaversa.it/2016/10/three-js-shader-loading-external-file/
			 * https://github.com/THeK3nger/threejs-async-shaders-example
			 * 
			 * It uses the built-in THREE.js async loading capabilities to load shaders from files!
			 * 
			 * `onProgress` and `onError` are stadard TREE.js stuff. Look at 
			 * https://threejs.org/examples/webgl_loader_obj.html for an example. 
			 * 
			 * @param {String} vertex_url URL to the vertex shader code.
			 * @param {String} fragment_url URL to fragment shader code
			 * @param {function(String, String)} onLoad Callback function(vertex, fragment) that take as input the loaded vertex and fragment contents.
			 * @param {object} [options] the following options are available
			 * @param {function(event)} [options.onProgress] Callback for the `onProgress` event.
			 * @param {function(event)} [options.onError] Callback for the `onError` event.
			 */
			function ShaderLoader(vertex_url, fragment_url, onLoad, options) {

				options = options || {};

				var vertex_text = _vertex_text.getItem(vertex_url);
				function loadFragment() {

					const fragment_text = _fragment_text.getItem(fragment_url);
					if (!fragment_text) {

						//load fragment.c file
						const fragment_loader = new THREE.FileLoader(THREE.DefaultLoadingManager);
						fragment_loader.setResponseType('text');
						fragment_loader.load(fragment_url, function (fragment_text) {

							_fragment_text.setItem(fragment_url, fragment_text);
							onLoad(vertex_text, fragment_text);

						}, options.onProgress, options.onError);

					} else onLoad(vertex_text, fragment_text);

				}
				if (!vertex_text) {

					//load vertex.c file
					const vertex_loader = new THREE.FileLoader(THREE.DefaultLoadingManager);
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
			ShaderLoader(path.vertex, path.fragment,
				function (vertex, fragment) {

					shaderText.vertex = vertex;
					shaderText.fragment = fragment;
					onload(shaderText);

				},
				{

					onError: function (event) {

						console.error(event.srcElement.responseURL + ' status = ' + event.srcElement.status + ' ' + event.srcElement.statusText);

					}

				}

			);

		}

		loadShaderText(function (shaderText) {

			//See description of the
			//const int cloudPointsWidth = %s;
			//in the \frustumPoints\vertex.c
			if (cloud !== undefined) {

				cloud.editShaderText(shaderText);

			}

			const points = new THREE.Points(geometry, new THREE.ShaderMaterial({

				//See https://threejs.org/examples/webgl_custom_attributes_points2.html
				//D: \My documents\MyProjects\webgl\three.js\GitHub\three.js\dev\examples\webgl_custom_attributes_points2.html
				//OpenGL Shading Language https://www.khronos.org/opengl/wiki/OpenGL_Shading_Language
				//Обзор спецификации GLSL ES 2.0 http://a-gro-pro.blogspot.com/2013/06/glsl-es-20.html
				//Open GL 4. Язык шейдеров. Книга рецептов http://www.cosmic-rays.ru/books61/2015ShadingLanguage.pdf
				//OpenGL® 4.5 Reference Pages. Ключевые слова по алфавиту https://www.khronos.org/registry/OpenGL-Refpages/gl4/

				uniforms: uniforms,
				vertexShader: shaderText.vertex,
				fragmentShader: shaderText.fragment,
				transparent: true,

			}));
			points.userData.shaderMaterial = settings.pointsOptions === undefined ? settings.shaderMaterial : settings.pointsOptions.shaderMaterial;
			if (settings.options.saveMeshDefault !== undefined)
				settings.options.saveMeshDefault(points);
			if ((settings.pointsOptions) && (settings.pointsOptions.frustumPoints))
				points.userData.cloud = { indexArray: indexArrayCloud, };
			points.userData.shaderMaterial = settings.pointsOptions === undefined ? settings.shaderMaterial : settings.pointsOptions.shaderMaterial;
			onReady(points);

			//Convert all points with cloud and shaderMaterial from local to world positions
			// i.e. calculate scales, positions and rotation of the points.
			//Converting of all points with cloud, but not shaderMaterial see updateCloudPoint in the frustumPoints.create function
			if (points.userData.boFrustumPoints) {

				settings.pointsOptions.group.children.forEach(function (mesh) {

					settings.options.frustumPoints.updateCloudPoint(mesh);

				});

			}

			//нужно что бы обновились точки в frustumPoints
			if (points.material.uniforms.palette !== undefined)
				points.material.uniforms.palette.value.needsUpdate = true;
			if (points.material.uniforms.cloudPoints !== undefined)
				points.material.uniforms.cloudPoints.value.needsUpdate = true;
			//Player.selectMeshPlayScene(points, { options: settings.options });
			//Что бы камера смотрела на выбранную точку сразу после запуска приложения
			const cameraTarget = settings.options.playerOptions.cameraTarget.get(settings.options);
			if (cameraTarget && cameraTarget.setCameraPosition) cameraTarget.setCameraPosition();

		}, settings.pointsOptions === undefined ? undefined : settings.pointsOptions.path);

	}

}

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

/**
 * Creating the new [THREE.Points]{@link https://threejs.org/docs/index.html?q=poi#api/en/objects/Points} and adding it into group. Extends <a href="../../jsdoc/MyObject/module-myObject-MyObject.html" target="_blank">MyObject</a>.
 * @class
 * @extends MyObject
 */
class MyPoints extends MyObject {

	/**
	 * Creating the new [THREE.Points]{@link https://threejs.org/docs/index.html?q=poi#api/en/objects/Points} and adding it into group.
	 * @param {array} arrayFuncs <b>points.geometry.attributes.position</b> array.
	 * See <b>arrayFuncs</b> parametr of the <a href="../../player/jsdoc/module-Player-Player.getPoints.html" target="_blank">Player.getPoints(...)</a> for details.
	 * @param {THREE.Group} [group] [Group]{@link https://threejs.org/docs/index.html?q=grou#api/en/objects/Group} for new points.
	 * Default is <b><a href="../../jsdoc/three/Three.html" target="_blank">three</a>.scene</b>
	 * @param {object} [settings={}] the following settings are available
	 * @param {object|Options} [settings.options=new Options()] the following options are available.
	 * See the <b>options</b> parameter of the <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
	 * @param {Object} [settings.options.point] point options.
	 * See <a href="../../jsdoc/Options/global.html#point" target="_blank">Options.point</a> for details.
	 * @param {object} [settings.options.scales.w] followed w axis scale params is available
	 * @param {object} [settings.options.scales.w.min=0] Minimal range of the [color palette]{@link https://github.com/anhr/commonNodeJS/tree/master/colorpicker}.
	 * @param {object} [settings.options.scales.w.max=1] Maximal range of the [color palette]{@link https://github.com/anhr/commonNodeJS/tree/master/colorpicker}.
	 * @param {object} [settings.options.palette=new ColorPicker.palette();//palette: ColorPicker.paletteIndexes.BGYW] See <a href="../../colorPicker/jsdoc/module-ColorPicker.html#~Palette" target="_blank">ColorPicker.palette</a>.
	 * <pre>
	 * Example:
	 * <b>new ColorPicker.palette( { palette: ColorPicker.paletteIndexes.bidirectional } );</b>
	 * </pre>
	 * @param {GuiSelectPoint} [settings.options.guiSelectPoint] A [dat.gui]{@link https://github.com/anhr/dat.gui} based graphical user interface for select a point from the mesh.
	 * See <a href="../../guiSelectPoint/jsdoc/index.html" target="_blank">GuiSelectPoint</a> for details.
	 * @param {object} [settings.options.raycaster] Followed [raycaster]{@link https://threejs.org/docs/index.html#api/en/core/Raycaster} options is available.
	 * @param {Function(particle)} [settings.options.raycaster.addParticle] Callback function that take as input the <b>new THREE.Points</b>.
	 * Add new particle into array of objects to check for intersection with the ray. See [THREE.Raycaster.intersectObject]{@link https://threejs.org/docs/index.html#api/en/core/Raycaster.intersectObject} for details.
	 * @param {Function(particle)} [settings.options.raycaster.removeParticle] Callback function that take as input the <b>new THREE.Points</b>.
	 * Remove particle from array of objects to check for intersection with the ray. See [THREE.Raycaster.intersectObject]{@link https://threejs.org/docs/index.html#api/en/core/Raycaster.intersectObject} for details.
	 * @param {object} [settings.pointsOptions={}] followed points options is availablee:
	 * @param {FrustumPoints} [settings.pointsOptions.frustumPoints] Include this points into array of points with cloud. See <a href="../../frustumPoints/jsdoc/index.html" target="_blank">FrustumPoints</a>.
	 * @param {number} [settings.pointsOptions.tMin=0] start time. Uses for playing of the points..
	 * @param {string} [settings.pointsOptions.name=""] Name of the points. Used for displaying of items of the <b>Select</b> drop down control of the <b>Meshes</b> folder of the [dat.gui]{@link https://github.com/anhr/dat.gui}.
	 * @param {object|boolean} [settings.pointsOptions.shaderMaterial] creates the [THREE.Points]{@link https://threejs.org/docs/index.html?q=poi#api/en/objects/Points} with [THREE.ShaderMaterial]{@link https://threejs.org/docs/index.html#api/en/materials/ShaderMaterial} material.
	 * The size of the each point of the <b>THREE.Points</b> seems the same on canvas
	 * because I reduce the size of the points closest to the camera and increase the size of the points farthest to the camera.
	 * <p>false - no shaderMaterial.
	 * @param {object} [settings.pointsOptions.shaderMaterial.point]
	 * @param {number} [settings.pointsOptions.shaderMaterial.point.size] point size.
	 * @param {THREE.Vector3} [settings.pointsOptions.position=new THREE.Vector3( 0, 0, 0 )] position of the points.
	 * <pre>
	 * Vector's x, y, z is position of the points.
	 * Can be as:
	 * float - position of the points.
	 * [float] - array of positions of the points.
	 * Function - position of the points is function of the t. Example:
	 *	<b>new Function( 't', 'return 0.1 + t' )</b>
	 * </pre>
	 * Example:
	 * @param {Array} [settings.pointsOptions.colors] Array of colors for the each vertex.
	 * <pre>
	 * Every vertex is associated with 3 values of the <b>colors</b> array.
	 * Each value of the <b>colors</b> array is red or green or blue color of the particular vertex in range from 0 to 1.
	 * 
	 * 0 is no color.
	 * 1 is full color.
	 * 
	 * For example:
	 * settings.object.geometry.colors: [
	 * 	1, 0, 0,//red color of the <b>position[0]</b> vertex.
	 * 	0, 1, 0,//green color of the <b>position[1]</b> vertex.
	 * 	0, 0, 1,//blue color of the <b>position[2]</b> vertex.
	 * 	1, 1, 1,//white color of the <b>position[3]</b> vertex.
	 * ],
	 * Have effect only if <b>arrayFuncs</b> points are not <b>THREE.Vector4</b> type. See <b>arrayFuncs</b> parametr of the <a href="../../player/jsdoc/module-Player-Player.getPoints.html" target="_blank">Player.getPoints(...)</a> for details.
	 * </pre>
	 * @param {String|number} [settings.pointsOptions.color='lime'] color of points.
	 * <pre>
	 * String - color name. See list of available color names in the <b>_colorKeywords</b> object in the [Color.js]{@link https://github.com/mrdoob/three.js/blob/dev/src/math/Color.js} file.
	 * number - color [Hex triplet]{@link https://en.wikipedia.org/wiki/Web_colors#Hex_triplet}. Example: 0x0000ff - blue color.
	 * Have effect only if <b>settings.pointsOptions.colors</b> are not defined.
	 * <pre>
	 * @param {boolean|array} [settings.pointsOptions.opacity] 
	 * <pre>
	 * boolean -
	 *	If true then opacity of the point is depend from distance to all meshes points from the group with defined <b>mesh.userData.cloud</b>.
	 *	See <b>optionsColor.opacity</b> parameter of the <a href="../../player/jsdoc/module-Player-Player.getColors.html" target="_blank">Player.getColors(...)</a>ions.getColors for details.
	 * array -
	 *	Array of opacities of each position of the points.
	 *	Each item of array is float value in the range of 0.0 - 1.0 indicating how transparent the material is.
	 *	A value of 0.0 indicates fully transparent, 1.0 is fully opaque.
	 * @param {THREE.Vector3} [settings.pointsOptions.scale=new THREE.Vector3( 1, 1, 1 )] scale of the points.
	 * <pre>
	 * Vector's x, y, z is scale of the points.
	 * Can be as:
	 * float - scale of the points.
	 * [float] - array of scales of the points.
	 * Function - scale of the points is function of the t. Example:
	 *	<b>new Function( 't', 'return 1.1 + t' )</b>
	 * </pre>
	 * Example:
	 * <b>new THREE.Vector3 ( new Function( 't', 'return 1 + t' ), 1, 1)</b>
	 * @param {THREE.Vector3} [settings.pointsOptions.rotation=new THREE.Vector3( 0, 0, 0 )] rotation of the points.
	 * <pre>
	 * Vector's x, y, z is rotation of the points.
	 * Can be as:
	 * float - rotation of the points.
	 * [float] - array of rotations of the points.
	 * Function - rotation of the points is function of the t. Example:
	 *	<b>new Function( 't', 'return Math.PI / 2 + t * Math.PI * 2' )</b>
	 * </pre>
	 * Example:
	 * <b>new THREE.Vector3 ( new Function( 't', 'return Math.PI / 2 + t * Math.PI * 2' ), 0, 0)</b>
	 * @param {function} [settings.pointsOptions.onReady] Callback function that take as input the <b>new THREE.Points</b>.
	 * Fires after creating of the points.
	 * <pre>
	 * function( points )
	 *	<b>points</b> - [Points]{@link https://threejs.org/docs/index.html?q=Poin#api/en/objects/Points}.
	 *	Call the <b>points.userData.opacity(opacity)</b> function if you want to change the opacity of the points.
	 *		The <b>opacity</b> parameter is float in the range of 0.0 - 1.0 indicating how transparent the points is.
	 *		A value of 0.0 indicates fully transparent, 1.0 is fully opaque.
	 * </pre>
	 * @param {object} [settings.pointsOptions.raycaster] Followed [raycaster]{@link https://threejs.org/docs/index.html#api/en/core/Raycaster} options is available.
	 * @param {Function(intersection, mouse)} [settings.pointsOptions.raycaster.onIntersection] Callback function that take as input the <b>[intersectObject]{@link https://threejs.org/docs/index.html#api/en/core/Raycaster.intersectObject} </b>, and <b>mouse position</b>.
	 * Fires after intersection of the mouse pointer with a point.
	 * @param {Function()} [settings.pointsOptions.raycaster.onIntersectionOut] Callback function.
	 * Fires if mouse pointer leaves of intersection with the point.
	 * @param {Function(intersection)} [settings.pointsOptions.raycaster.onMouseDown] Callback function that take as input the <b>[intersectObject]{@link https://threejs.org/docs/index.html#api/en/core/Raycaster.intersectObject} </b>.
	 * User has clicked over point.
	 * @param {object} [settings.pointsOptions.elements] Followed elements can display on the web page
	 * @param {HTMLElement|string} [settings.pointsOptions.elements.pointsName] Display of the <b>settings.pointsOptions.name</b> on the web page.
	 * <pre>
	 * HTMLElement - element for displaying.
	 * string - <b>id</b> of the element.
	 * </pre>
	 */
	constructor(arrayFuncs, group, settings) {

		super(settings, arrayFuncs);

		const _this = this;
		
		const THREE = three$1.THREE;

		group = group || three$1.scene;

		if ((arrayFuncs === undefined) && !settings.bufferGeometry.attributes.position) console.error('MyPoints: Vertices was not defined');
		if (
			(arrayFuncs != undefined) &&//вершины заданы в settings.bufferGeometry
			(typeof arrayFuncs != 'function') && (arrayFuncs.length === 0)
		)
			arrayFuncs.push(new THREE.Vector3());

		settings.pointsOptions = settings.pointsOptions || {};
		const pointsOptions = settings.pointsOptions;
		settings.options = settings.options || new Options$1();
		var options = settings.options;
		if (!options.boOptions) options = new Options$1(options);
		pointsOptions.tMin = pointsOptions.tMin || 0;
		pointsOptions.name = pointsOptions.name || '';
		pointsOptions.position = pointsOptions.position || new THREE.Vector3(0, 0, 0);
		pointsOptions.scale = pointsOptions.scale || new THREE.Vector3(1, 1, 1);
		pointsOptions.rotation = pointsOptions.rotation || new THREE.Vector3();
		pointsOptions.group = group;

		//points name
		if (pointsOptions.name !== '' && pointsOptions.elements) {

			if (pointsOptions.elements.pointsName === null) console.warn('MyPoints: Points name element is not exists');
			if (!pointsOptions.elements.pointsName) pointsOptions.elements.pointsName = 'pointsName';
			const elPointsName = typeof pointsOptions.elements.pointsName === "string" ?
				document.getElementById(pointsOptions.elements.pointsName) : pointsOptions.elements.pointsName;
			if (elPointsName) elPointsName.innerHTML = pointsOptions.name;
			else console.warn('MyPoints: Element with id: "' + pointsOptions.elements.pointsName + '" is not exists');

		}

		//Эту строку нужно вызывать до создания точек THREE.Points
		//что бы вызывалась моя версия THREE.BufferGeometry().setFromPoints для создания geometry c itemSize = 4
		//потому что в противном случае при добавлени этих точек в FrustumPoints.pushArrayCloud() координата w будет undefined
		Player$2.assign();

		if (pointsOptions.shaderMaterial !== false)
			new getShaderMaterialPoints(group, arrayFuncs,function (points) { Points(points); }, {

				options: options,
				pointsOptions: pointsOptions,
				object: { geometry: { position: settings.object.geometry.position, opacity: settings.object.geometry.opacity } },
				bufferGeometry: settings.bufferGeometry,

			});
		else {

			let buffer;
			if ( typeof arrayFuncs === 'function' ) buffer = arrayFuncs();
			else {

				const points = Player$2.getPoints(arrayFuncs, { options: options, group: group, t: pointsOptions.tMin });
				this.getPoint = (i) => { return points[i]; };
				buffer = this.setPositionAttributeFromPoints( points );

			}
			const points = new THREE.Points( buffer,
				new THREE.PointsMaterial({

					size: options.point.size / options.point.sizePointsMaterial,

					//THREE.Material: 'vertexColors' parameter is undefined.
					//vertexColors: THREE.VertexColors,
					vertexColors: true,
					transparent: settings.pointsOptions.opacity ?
						true ://установлена прозрачность вершин
						undefined,

				})

			);

			if (pointsOptions.frustumPoints)
				points.userData.cloud = {

					indexArray: pointsOptions.frustumPoints.pushArrayCloud(points.geometry),//индекс массива точек в FrustumPoints.arrayCloud которые принадлежат этому points

				};
			Points(points);

		}
		function Points(points) {

			_this.object3D = points;
			points.name = pointsOptions.name;//'Wave';
			if (pointsOptions.pointIndexes !== undefined)
				points.userData.pointIndexes = function (pointIndex) { return pointsOptions.pointIndexes(pointIndex); };
			if (pointsOptions.pointName !== undefined)
				points.userData.pointName = function (pointIndex) { return pointsOptions.pointName(pointIndex); };
			if (pointsOptions.controllers !== undefined) {

				points.userData.addControllers = pointsOptions.addControllers;
				points.userData.controllers = function ( /*cFrustumPoints*/) { return pointsOptions.controllers( /*cFrustumPoints*/); };

			}
			if (settings.pointsOptions.raycaster) points.userData.raycaster = settings.pointsOptions.raycaster;
			var arrayFuncsPlayer;
			if (arrayFuncs instanceof THREE.BufferGeometry) {

				arrayFuncsPlayer = [];
				for (var i = 0; i < arrayFuncs.attributes.position.count; i++)
					arrayFuncsPlayer.push(new THREE.Vector3().fromBufferAttribute(arrayFuncs.attributes.position, i));

			} else arrayFuncsPlayer = arrayFuncs;
			points.userData.player = {

				arrayFuncs: arrayFuncsPlayer,
				selectPlayScene: function (t) {

					setPositions(t);
					setScales(t);
					setRotations(t);

				}

			};
			function setPositions(t) {

				t = t || pointsOptions.tMin;
				function setPosition(axisName) {

					points.position[axisName] = typeof pointsOptions.position[axisName] === "function" ?
						pointsOptions.position[axisName](t, options.a, options.b) :
						pointsOptions.position[axisName];

				}
				setPosition('x');
				setPosition('y');
				setPosition('z');

			}
			setPositions();
			function setScales(t) {

				t = t || pointsOptions.tMin;
				function setScale(axisName) {

					points.scale[axisName] = typeof pointsOptions.scale[axisName] === "function" ?
						pointsOptions.scale[axisName](t, options.a, options.b) :
						pointsOptions.scale[axisName];

				}
				setScale('x');
				setScale('y');
				setScale('z');

			}
			setScales();
			function setRotations(t) {

				t = t || pointsOptions.tMin;
				function setRotation(axisName) {

					points.rotation[axisName] = typeof pointsOptions.rotation[axisName] === "function" ?
						pointsOptions.rotation[axisName](t, options.a, options.b) :
						pointsOptions.rotation[axisName];
					while (points.rotation[axisName] < 0) points.rotation[axisName] += Math.PI * 2;
					while (points.rotation[axisName] > Math.PI * 2) points.rotation[axisName] -= Math.PI * 2;

				}
				setRotation('x');
				setRotation('y');
				setRotation('z');

			}
			setRotations();
			group.add(points);

			points.userData.myObject = _this;
			points.userData.opacity = (opacity) => { _this.verticesOpacity(false, opacity); };

			if (pointsOptions.boFrustumPoints) points.userData.boFrustumPoints = pointsOptions.boFrustumPoints;
			if (options.guiSelectPoint) options.guiSelectPoint.addMesh(points);
			if (options.eventListeners) options.eventListeners.addParticle(points);
			if (pointsOptions.onReady !== undefined) pointsOptions.onReady(points);

			if (!points.userData.boFrustumPoints && options.raycaster && options.raycaster.addParticle)
				options.raycaster.addParticle(points);

		}

	}

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

var optionsStyle = {

	//style rel="stylesheet"
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
//console.warn( 'getCurrentScriptPath = ' + getCurrentScriptPath() );
var currentScriptPath = getCurrentScriptPath();
//Для D:\My documents\MyProjects\webgl\three.js\GitHub\commonNodeJS\master\DropdownMenu\build
var arrayPath = currentScriptPath.split( /(.*)(\/build)/ );
if ( arrayPath[2] === '/build' ) currentScriptPath = arrayPath[1];
//Для D:\My documents\MyProjects\webgl\three.js\GitHub\commonNodeJS\master\canvasMenu\build
arrayPath = currentScriptPath.split( /(.*)(\/canvasMenu)/ );
if ( arrayPath[2] === '/canvasMenu' ) currentScriptPath = arrayPath[1] + '/DropdownMenu';

//Attention! Load menu.css file before other css files for correctly priority of the styles
loadScript.sync( currentScriptPath + '/styles/menu.css', optionsStyle );//move dat.gui into canvas
loadScript.sync( currentScriptPath + '/styles/gui.css', optionsStyle );//move dat.gui into canvas
loadScript.sync( currentScriptPath + '/styles/Decorations/transparent.css', optionsStyle );
loadScript.sync( currentScriptPath + '/styles/Decorations/gradient.css', optionsStyle );

/**
 * Creates new menu
 * @param {Array} arrayMenu array of menu and submenu items. If array item is string then menu item name. If array item is object then options of the new menu item:
 * @param {String|HTMLElement} [arrayMenu.name] if string then menu item name. If HTMLElement then item element.
 * @param {String} [arrayMenu.title] menu item title.
 * @param {String} [arrayMenu.id] menu item identifier.
 * @param {String} [arrayMenu.style] menu item style. Example: "float: right;".
 * @param {Array} [arrayMenu.items] array of submenu items. Same as menu item.
 * @param {Function} [arrayMenu.onclick] <b>function(event)</b> called when user has clicked a menu item. event - event details.
 * @param {Object} [arrayMenu.drop] direction of drop of the submenu.
 * <pre>
 * Following directions is available:
 * If string then "up" - drop submenu to up. "left" - shift submenu to left.
 * If object then following members is available:
 * </pre>
 * @param {boolean} [arrayMenu.drop.up] true - drop submenu to up.
 * @param {boolean} [arrayMenu.drop.left] true - shift submenu to left.
 * @param {boolean} [arrayMenu.radio] true - defines a radio menu item.
 * @param {boolean} [arrayMenu.checkbox] true - defines a checkbox menu item.
 * @param {boolean} [arrayMenu.checked] true - checked state of a checkbox or radio menu item.
 *
 * @param {Object} [options] the following options are available.
 * @param {HTMLElement} [options.elParent="body" element] Parent element of new menu.
 * @param {HTMLElement} [options.canvas] <b>canvas</b> element. Use if you want put a menu inside a canvas. Use [CanvasMenu]{@link https://github.com/anhr/commonNodeJS/tree/master/canvasMenu} instead <b>DropdownMenu</b> for it.
 * @param {String} [options.decorations] You can decorate your menu by a built-in style or use your custom style. Currently two built-in styles is available:
 * <pre>
 * 'Gradient' - use [gradient.css]{@link https://raw.githack.com/anhr/commonNodeJS/master/DropdownMenu/styles/Decorations/gradient.css} file for decoration.
 * 'Transparent' - use [transparent.css]{@link https://raw.githack.com/anhr/commonNodeJS/master/DropdownMenu/styles/Decorations/transparent.css} file for decoration.
 * Custom decoration:
 * 'Custom' please edit the [custom.css]{@link https://raw.githack.com/anhr/commonNodeJS/master/DropdownMenu/Examples/html/custom.css} file from my example if you want a custom decoration of your menu.
 * <pre>
 */
function create( arrayMenu, options ) {

	options = options || {};
	options.elParent = options.elParent || document.querySelector( 'body' );
	switch ( options.decorations ) {

		case 'Gradient':
		case 'Transparent':
		case 'Custom':
		case undefined:
			break;
		default: console.error( 'DropdownMenu.create: Invalid options.decorations: ' + options.decorations );
	}

	//create menu element
	var elMenu = document.createElement( 'menu' );
	if ( options.elParent.classList.contains( "container" ) )
		elMenu.className = 'controls';

	var timeoutControls;
	function displayControls() {

		elMenu.style.opacity = 1;
		clearTimeout( timeoutControls );
		timeoutControls = setTimeout( function () {

			elMenu.style.opacity = 0;

		}, 5000 );

	}
	if ( options.canvas ) {

		elMenu.style.opacity = 0;
		options.canvas.onmouseout = function ( event ) {

			elMenu.style.opacity = 0;

		};
		options.canvas.onmousemove = function ( event ) {

			displayControls();

		};
		elMenu.onmousemove = function ( event ) {

			displayControls();

		};

	}
	options.elParent.appendChild( elMenu );

	arrayMenu.forEach( function ( menuItem ) {

		var dropdownChild = 'dropdown-child';
		function moveUpLeft( drop ) {

			setTimeout( function () {

				var display = elDropdownChild.style.display;
				elDropdownChild.style.display = 'block';
				if ( drop.up )
					elDropdownChild.style.top = '-' + ( elDropdownChild.offsetHeight ) + 'px';
				else elDropdownChild.style.top = ( elMenuButton.offsetHeight -1 ) + 'px';
				if ( drop.left )
					elDropdownChild.style.left = ( elMenuButton.offsetWidth - elDropdownChild.offsetWidth ) + 'px';
				elDropdownChild.style.display = display;

			}, 0 );

		}


		//Create menuButton class element
		var elMenuButton = document.createElement( 'span' );
		elMenuButton.className =
			'menuButton' + ( options.decorations === undefined ? '' : ' menuButton' + options.decorations );

		if ( menuItem.style !== undefined )
			elMenuButton.style.cssText = menuItem.style;

		if ( menuItem.radio !== undefined )
			elMenuButton.style.cssText = menuItem.style;

		if ( menuItem.onclick !== undefined )
			elMenuButton.onclick = menuItem.onclick;
		if ( menuItem.id !== undefined )
			elMenuButton.id = menuItem.id;

		var name;
		if ( typeof menuItem === 'string' )
			name = menuItem;
		else {

			name = menuItem.name;

			if ( menuItem.id )
				elMenuButton.id = menuItem.id;
			if ( menuItem.title )
				elMenuButton.title = menuItem.title;

		}

		//Create name span
		switch ( typeof name ) {
			case "object":
				elMenuButton.appendChild( name );
				break;
			case "string":
			case "undefined":
				elMenuButton.innerHTML = name;
				break;
			default: console.error( 'Invalid typeof name: ' + typeof name );
		}

		//Create dropdown-child items
		if ( menuItem.items ) {

			var elDropdownChild = document.createElement( 'span' );
			elDropdownChild.className = dropdownChild + ' ' + dropdownChild + ( options.decorations === undefined ? 'Default' : options.decorations );
			elDropdownChild.title = '';
			elMenuButton.appendChild( elDropdownChild );

			//for compatibility with firefox
//			getMenuButtonBorderWidth();

			menuItem.items.forEach( function ( itemItem ) {

				//Create name span
				var elName = document.createElement( 'nobr' ),
					classChecked = 'checked';
				function getItemName(item) {

					const str = typeof item === 'string' ?
						item :
							item.radio === true ?
							( item.checked ? '◉' : '◎' ) + ' ' + item.name
							: item.checkbox === true ? ( item.checked ? '☑' : '☐' ) + ' ' + item.name : item.name;//✓🗹
					//console.log(str);
					return str;

				}
				function getElementFromEvent( event ) {
					if ( !event ) event = window.event;//for IE6
					return event.target || event.srcElement;
				}
				if ( typeof itemItem === 'string' )
					;
				else {

					itemItem.name;
					elName.onclick = function ( event ) {

						if ( itemItem.radio === true ) {

							menuItem.items.forEach( function ( item ) {

								if ( item.radio === true ) {

									if ( getElementFromEvent( event ) === item.elName ) {

										item.checked = true;
										item.elName.classList.add( classChecked );

									} else {

										item.checked = false;
										item.elName.classList.remove( classChecked );

									}
									item.elName.innerHTML = getItemName( item );

								}

							} );

						} else if ( itemItem.checkbox === true ) {

							if ( itemItem.checked === true ) {

								itemItem.elName.classList.add( classChecked );

							} else {

								itemItem.elName.classList.remove( classChecked );

							}
							itemItem.checked = !itemItem.checked;
							itemItem.elName.innerHTML = getItemName( itemItem );

						}
						if ( itemItem.onclick )
							itemItem.onclick( event );
							
					};

				}
				if ( itemItem.radio === true )
					elName.classList.add( 'radio' );
				if ( itemItem.checkbox === true )
					elName.classList.add( 'checkbox' );
				if ( itemItem.id )
					elName.id = itemItem.id;
				if ( itemItem.title )
					elName.title = itemItem.title;
				elName.innerHTML = getItemName( itemItem );

				if ( itemItem.checked === true )
					elName.classList.add( classChecked );

				elDropdownChild.appendChild( elName );
				if ( typeof itemItem !== "string")
					itemItem.elName = elName;

			} );

			if ( typeof menuItem.drop === 'object' ) {

				moveUpLeft( menuItem.drop );

			} else {

				switch ( menuItem.drop ) {

					case 'up':
						moveUpLeft( {

							up: true,

						} );
						break;
					case 'left':
						moveUpLeft( {

							left: true,

						} );
						break;
					case undefined:
						setTimeout( function () {

							elDropdownChild.style.left = '-' + elMenuButton.clientWidth + 'px';
							elDropdownChild.style.top = ( elMenuButton.offsetHeight - 1 ) + 'px';

						}, 0 );
						break;
					default: console.error( 'Invalid menuItem.drop: ' + menuItem.drop );

				}

			}

		}

		elMenu.appendChild( elMenuButton );

	} );
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
/**
 * Creates a drop down menu in your javaScript code.
 */
var DropdownMenu = {

    create: create,

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

/**
 * @callback onFullScreenToggle
 * @param {boolean} fullScreen true - full screen mode of the canvas.
 */

class CanvasMenu {

	/**
	 * @class Create [dropdown menu]{@link https://github.com/anhr/commonNodeJS/tree/master/DropdownMenu} for canvas in my [three.js]{@link https://threejs.org/} projects.
	 * @param {THREE.WebGLRenderer} renderer [WebGLRenderer]{@link https://threejs.org/docs/index.html#api/en/renderers/WebGLRenderer}
	 * @param {Object} [settings={}] the following settings are available
	 * @param {Array} [settings.menu] menu array. See <b>arrayMenu</b> of the [DropdownMenu.create]{@link https://raw.githack.com/anhr/commonNodeJS/master/DropdownMenu/jsdoc/module-DropdownMenu.html#~create}
	 * @param {Function} [settings.onOver] The event is fired at an Element when a pointing device (such as a mouse or trackpad) is used to move the cursor onto the element or one of its child elements.
	 * <pre>
	 * true - mouseenter event.
	 * false - mouseleave event.
	 * </pre>
	 *
	 * @param {Object} [settings.fullScreen] Add a "Full Screen" button
	 * <p>
	 * Full screen of the canvas see <b>settings.options.canvas.fullScreen</b>.
	 * </p>
	 * @param {onFullScreen} settings.fullScreen.camera [THREE.PerspectiveCamera]{@link https://threejs.org/docs/index.html#api/en/cameras/PerspectiveCamera}.
	 * @param {onFullScreenToggle} [settings.fullScreen.onFullScreenToggle] user toggled fullscreen mode of the canvas.
	 *
	 * @param {Options} [settings.options=new Options()] <a href="../../jsdoc/Options/Options.html" target="_blank">Options</a> instance. The following options are available.
	 * See <b>options</b> parameter of <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
	 * @param {Player} [settings.options.player] <a href="../../Player/jsdoc/index.html" target="_blank">Player</a> instance. Playing of 3D ojbects in my projects.
	 * @param {StereoEffect} [settings.options.stereoEffect] <a href="../../StereoEffect/jsdoc/index.html" target="_blank">StereoEffect</a> instance.
	 * @param {boolean} [settings.options.canvas.fullScreen] Default canvas is full screen. false - no full screen
	 * @param {Function} [settings.options.getLanguageCode=language code of your browser] returns the "primary language" subtag of the version of the browser.
	 */
	constructor( renderer, settings = {} ) {

		if ( !three$1.isThree() ) {

			console.warn( 'CanvasMenu: Set THREE first.' );
			return;

		}
		const THREE = three$1.THREE;

		settings.options = settings.options || new Options$1();
		const options = settings.options;
		if ( !options.boOptions ) {

			console.error( 'CanvasMenu: call options = new Options( options ) first' );
			return;

		}
		if ( options.canvasMenu === false ) return;
		options.canvasMenu = this;

		//Localization

		const lang = {
			fullScreen: 'Full Screen',
			nonFullScreen: 'Non Full Screen',
		};

		const getLanguageCode = options.getLanguageCode;
		switch ( getLanguageCode() ) {

			case 'ru'://Russian language
				lang.prevSymbolTitle = 'Кадр назад';//'Go to previous animation scene',
				lang.playTitle = 'Проиграть';//'Play'
				lang.nextSymbolTitle = 'Кадр вперед';//'Go to next animation scene';
				lang.pauseTitle = 'Пауза';//'Pause',
				lang.repeatOn = 'Повторять проигрывание';
				lang.repeatOff = 'Остановить повтор проигрывания';
				lang.controllerTitle = 'Текущее время.';
				lang.stereoEffects = 'Стерео эффекты';
				lang.mono = 'Моно';
				lang.sideBySide = 'Слева направо';
				lang.topAndBottom = 'Сверху вниз';

				break;

		}

		if ( THREE && ( renderer instanceof THREE.WebGLRenderer !== true ) ) {

			console.error( 'CanvasMenu: renderer is not THREE.WebGLRenderer' );
			return;

		}
		const elCanvas = renderer.domElement, elContainer = elCanvas.parentElement;
		if ( elContainer.tagName !== "DIV" ) {

			console.error( 'CanvasMenu: elContainer.tagName = ' + elContainer.tagName );
			return;

		}
		const container = "container";
		if ( !elContainer.classList.contains( container ) ) elContainer.classList.add( container );
		settings.menu = settings.menu || [];

		/**
		 * Menu array
		 * @array canvasMenu.
		 * menu
		 * @see <b>arrayMenu</b> of the [DropdownMenu.create]{@link https://raw.githack.com/anhr/commonNodeJS/master/DropdownMenu/jsdoc/module-DropdownMenu.html#~create}
		 */
		this.menu = settings.menu;

		if ( settings.options.stereoEffect && settings.options.stereoEffect.createCanvasMenuItem )
			settings.options.stereoEffect.createCanvasMenuItem( this, { getLanguageCode: options.getLanguageCode } );

		if ( options.player ) { options.player.createCanvasMenuItem( this, getLanguageCode ); }

		CreateFullScreenSettings.RendererSetSize( renderer, this );

		//Full Screen button
		var fullScreenSettings;
		if ( settings.fullScreen !== undefined ) {

			if ( !settings.fullScreen.camera ) {

				console.error( 'CanvasMenu: settings.fullScreen.camera = ' + settings.fullScreen.camera );
				return;

			}
			fullScreenSettings = new CreateFullScreenSettings( THREE, renderer, settings.fullScreen.camera,
				{

					canvasMenu: this,
					fullScreen: settings.fullScreen,

				} );
			if ( options.canvas.fullScreen !== false )
				fullScreenSettings.setFullScreen( false, true );

			/**
			 * @param {StereoEffect} stereoEffect <a href="../../StereoEffect/jsdoc/index.html" target="_blank">StereoEffect</a>.
			 * @returns Set <b>stereoEffect</b> to <b>fullScreenSettings</b> and returns <a href="../../jsdoc/CreateFullScreenSettings/index.html" target="_blank">fullScreenSettings</a>.
			 */
			this.getFullScreenSettings = function ( stereoEffect ) {

				fullScreenSettings.setStereoEffect( stereoEffect );
				return fullScreenSettings;

			};
			/**
			 * @returns <b>true</b> if <b>canvas</b> is full screen.
			 */
			this.isFullScreen = function () { return fullScreenSettings.isFullScreen(); };
			/**
			 * Sets the full screen of the canvas.
			 * @param {boolean} fullScreen false - full screen of the canvas.
			 */
			this.setFullScreen = function ( fullScreen ) { return fullScreenSettings.setFullScreen( fullScreen ); };
			if (!options.canvas.noButtonFullScreen)
				settings.menu.push( {
	
					style: 'float: right;',
					id: "menuButtonFullScreen",
					onclick: function ( event ) { fullScreenSettings.onclick(); }
	
				} );

		}

		//Play slider
		if ( options.player ) options.player.addSlider();

		const elMenu = DropdownMenu.create( settings.menu, {

			elParent: typeof elContainer === "string" ? document.getElementById( elContainer ) : elContainer,
			canvas: typeof elCanvas === "string" ? document.getElementById( elCanvas ) : elCanvas,
			decorations: 'Transparent',

		} );

		/**
		 * @param {string} selectors See CSS selectors in [HTML DOM querySelector() Method]{@link https://www.w3schools.com/jsref/met_document_queryselector.asp} for details.
		 * @returns First element that matches a specified CSS selector(s) in the <b>canvasMenu</b>.
		 */
		this.querySelector = function ( selectors ) { return elMenu.querySelector( selectors ); };
		elMenu.addEventListener( 'mouseenter', function ( event ) {

			if ( settings.options.dat ) settings.options.dat.mouseenter = true;
			if ( settings.onOver ) settings.onOver( true );

		} );
		elMenu.addEventListener( 'mouseleave', function ( event ) {

			if ( settings.options.dat ) settings.options.dat.mouseenter = false;
			if ( settings.onOver ) settings.onOver( false );

		} );
		if ( options.player ) options.player.addSliderEvents();// options.THREE );

		if ( settings.fullScreen ) {

			/**
			 * Sets the "Full Screen" button. Available only if <b>settings.fullScreen</b> is defined.
			 * @param {boolean} fullScreen true - non full screen.
			 * <p>false - full screen of the canvas.</p>
			 */
			this.setFullScreenButton = function ( fullScreen ) {

				if ( fullScreen === undefined ) {

					if ( options.canvas.fullScreen === false )
						fullScreen = false;
					else fullScreen = true;

				}
				const elMenuButtonFullScreen = elContainer.querySelector( '#menuButtonFullScreen' );//document.getElementById( 'menuButtonFullScreen' );
				if ( elMenuButtonFullScreen === null )
					return true;
				if ( fullScreen ) {

					elMenuButtonFullScreen.innerHTML = '⤦';
					elMenuButtonFullScreen.title = lang.nonFullScreen;

				} else {

					elMenuButtonFullScreen.innerHTML = '⤢';
					elMenuButtonFullScreen.title = lang.fullScreen;

				}
				return true;

			};
			this.setFullScreenButton();

			if (
				settings.options.stereoEffect &&
				settings.options.stereoEffect.settings &&
				( settings.options.stereoEffect.settings.spatialMultiplex !== StereoEffect.spatialMultiplexsIndexs.Mono )
			)
				this.setFullScreen( false );

		}

		/**
		 * Sets the size of the slider element of the player's menu.
		 * @param {Number} width width of the canvas
		 */
		this.setSize = function ( width ) {
			if ( elMenu === undefined )
				return;
			var itemWidth = 0, elSlider;
			for ( var i = 0; i < elMenu.childNodes.length; i++ ) {

				var menuItem = elMenu.childNodes[i];
				var computedStyle = window.getComputedStyle( menuItem ),
					styleWidth =
						parseInt( computedStyle["margin-left"] ) +
						parseInt( computedStyle["margin-right"] ) +
						parseInt( computedStyle["padding-left"] ) +
						parseInt( computedStyle["padding-right"] )
					;
				var elSliderCur = menuItem.querySelector( '.slider' );
				if ( elSliderCur === null )
					itemWidth += menuItem.offsetWidth + styleWidth;
				else {

					elSlider = elSliderCur;
					itemWidth += styleWidth;

				}

			}

			if ( !elSlider )
				return;//no controllerPlay
			var sliderWidth = width - itemWidth;
			if ( sliderWidth > 0 ) {

				elSlider.parentElement.style.width = sliderWidth + 'px';

			}

		};
		const size = { set: function ( width, height ) { this.x = width; this.y = height; } };
		renderer.getSize( size );
		this.setSize( size.x, size.y );

		if ( this.menu.length === 0 ) console.warn( 'CanvasMenu: menu is empty.' );

	}

}

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
function clearThree$1( obj ) {
	while ( obj.children.length > 0 ) {
		clearThree$1( obj.children[0] );
		obj.remove( obj.children[0] );
	}
	if ( obj.geometry ) {

		if ( obj.geometry.attributes !== undefined )
			Object.keys( obj.geometry.attributes ).forEach( prop => {

				obj.geometry.deleteAttribute( prop );

			} );
		obj.geometry.dispose();

	}

	if ( obj.material ) {
		//in case of map, bumpMap, normalMap, envMap ...
		Object.keys( obj.material ).forEach( prop => {

			if ( !obj.material[prop] )
				return
			if ( typeof obj.material[prop].dispose === 'function' )
				obj.material[prop].dispose();

		} );
		if ( obj.material.uniforms !== undefined )
			obj.material.uniforms.pointTexture.value.dispose();//Texture
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

class AxesHelper {

	/**
	 * An axis object to visualize the 1, 2 or 3 axes.
	 * @param {THREE.Group|THREE.Scene} group [THREE.Group]{@link https://threejs.org/docs/index.html?q=group#api/en/objects/Group} or [THREE.Scene]{@link https://threejs.org/docs/index.html?q=sce#api/en/scenes/Scene}.
	 * @param {object} [options=new Options()] the following options are available.
	 * See the <b>options</b> parameter of the <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
	 * @param {boolean} [options.axesHelper] false - do not create a <b>AxesHelper</b> instance.
	 * @param {object} [options.scales={}] axes scales.
	 *
	 * @param {object} [options.scales[axis]] axes options. <b>axis</b> is "x" or "y" or "z".
	 * @param {string} [options.scales[axis].name="X" or "Y" or "Z" or "W"] axis name.
	 * @param {number} [options.scales[axis].min=-1] Minimum range of the axis.
	 * @param {number} [options.scales[axis].max=1] Maximum range of the axis.
	 * @param {number} [options.scales[axis].marks=3] Number of scale marks.
	 * @param {number} [options.scales[axis].zoomMultiplier=1.1] zoom multiplier.
	 * @param {number} [options.scales[axis].offset=0.1] position offset.
	 *
	 * @param {THREE.Vector3} [options.scales.posAxesIntersection=new THREE.Vector3()] Position of the axes intersection.
	 * @param {boolean} [options.scales.display=true] true - displays the label and scale of the axes.
	 * @param {object} [options.scales.color='rgba(255, 255, 255, 0.5)'] axes color. Available color names see [THREE.Color]{@link https://threejs.org/docs/index.html?q=color#api/en/math/Color}.NAMES.
	 * @param {object} [options.scales.text={}] followed options of the text of the marks is available
	 * @param {boolean} [options.scales.text.precision=4] Formats a scale marks into a specified length.
	 * @param {number} [options.scales.text.textHeight=0.04] The height of the text.
	 * @param {object} [options.scales.text.rect={}] rectangle around the text.
	 * @param {boolean} [options.scales.text.rect.displayRect=true] true - the rectangle around the text is visible.
	 * @param {number} [options.scales.text.rect.borderRadius=15]
	 * @param {THREE.PerspectiveCamera} [options.camera] [PerspectiveCamera]{@link https://threejs.org/docs/index.html#api/en/cameras/PerspectiveCamera}. Use the camera key if you want control cameras focus.
	 * Set the camera if you want to see text size is independent from camera.fov. The text height will be calculated as textHeight = camera.fov * textHeight / 50
	 * See https://threejs.org/docs/index.html#api/en/cameras/PerspectiveCamera.fov about camera.fov.
	 * Default is undefined. Default camera.fov is 50.
	*/
	constructor( group, options ) {

		const THREE = three$1.THREE;
		//Этот вызов нужен на случай, когда в приложении import из guiSelectPoint.js происходит из разных файлов. Например
		//В одном месте
		//import { GuiSelectPoint, getObjectPosition } from 'https://raw.githack.com/anhr/commonNodeJS/master/guiSelectPoint/guiSelectPoint.js';
		//а в другом месте
		//import { GuiSelectPoint, getObjectPosition } from '../../../commonNodeJS/master/guiSelectPoint/guiSelectPoint.js';
		//Тогда в приложении будет два экземпляра guiSelectPoint.js
		//Для обоих экземпляров guiSelectPoint.js надо установить отдельный THREE
		//	GuiSelectPoint.setTHREE( THREE );

		const axesHelper = this;

		options = options || new Options$1();
		if ( !options.boOptions ) {

			console.error( 'AxesHelper: call options = new Options( options ) first' );
			return;

		}
		if ( options.axesHelper === false ) return;

		options.camera.fov = options.camera.fov || 50;

		options.scales = options.scales || {};
		options.scales.color = options.scales.color || 'rgba(255, 255, 255, 0.5)';//'white';//0xffffff;
/*		
		options.scales.display = options.scales.display !== undefined ? options.scales.display : true;
		options.scales.text = options.scales.text || {};
*/		
		options.scales.text.textHeight = options.scales.text.textHeight || 0.04;//Please specify the textHeight if you want the changing of the text height is available in gui.
		options.scales.text.precision = options.scales.text.precision || 4;
		options.scales.text.rect = options.scales.text.rect || {};
		options.scales.text.rect.displayRect = options.scales.text.rect.displayRect !== undefined ? options.scales.text.rect.displayRect : true;
		options.scales.text.rect.borderRadius = options.scales.text.rect.borderRadius !== undefined ? options.scales.text.rect.borderRadius : 15;
		function setScale( axisName ) {

			const scale = options.scales[axisName];
			if ( !scale ) return;
//			if ( scale.marks === undefined ) scale.marks = 3;
			if ( scale.offset === undefined ) scale.offset = 0.1;
			if ( scale.zoomMultiplier === undefined ) scale.zoomMultiplier = 1.1;

		}
		setScale( 'x' );
		setScale( 'y' );
		setScale( 'z' );

		/**
		 * See the <b>options</b> parameter of the <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
		 * */
		this.options = options;

		const groupAxesHelper = new THREE.Group();
		groupAxesHelper.userData.optionsSpriteText = {

			fontColor: options.scales.color,
			textHeight: options.scales.text.textHeight,
			fov: options.camera.fov,
			rect: options.scales.text.rect,

		};
		group.add( groupAxesHelper );

		options.scales.posAxesIntersection = options.scales.posAxesIntersection || new THREE.Vector3();//For moving of the axes intersection to the center of the canvas ( to the camera focus )

		/**
		 * create axis
		 * @param {string} axisName axis name
		 */
		this.createAxis = function ( axisName ) {

			const group = new THREE.Group();
			group.visible = options.scales.display;

			const scale = options.scales[axisName];
			if ( !scale.isAxis() )
				return;

			var color = options.scales.color, opacity = 1;
			try {

				var array = options.scales.color.split( /rgba\(\.*/ )[1].split( /\)/ )[0].split( /, */ );
				color = 'rgb(' + array[0] + ', ' + array[1] + ', ' + array[2] + ')';
				if ( array[3] !== undefined )
					opacity = array[3];

			} catch ( e ) { }
			const lineAxis = new THREE.Line( new THREE.BufferGeometry().setFromPoints( [

				//Begin vertice of the axis
				new THREE.Vector3(

					//X
					axisName !== 'x' ? 0
						: !options.scales.x ? 0//X axis is not exists
							: options.scales.x.min,//begin of the X axix
					//Y
					axisName !== 'y' ? 0
						: !options.scales.y ? 0//Y axis is not exists
							: options.scales.y.min,//begin of the Y axix
					//Z
					axisName !== 'z' ? 0
						: !options.scales.z ? 0//Z axis is not exists
							: options.scales.z.min,//begin of the Z axix

				),
				//end vertice of the axis
				new THREE.Vector3(

					//X
					axisName !== 'x' ? 0
						: !options.scales.x ? 0//X axis is not exists
							: options.scales.x.max,//end of the X axix
					//Y
					axisName !== 'y' ? 0
						: !options.scales.y ? 0//Y axis is not exists
							: options.scales.y.max,//end of the Y axix
					//Z
					axisName !== 'z' ? 0
						: !options.scales.z ? 0//Z axis is not exists
							: options.scales.z.max,//end of the Z axix

				),
			] ), new THREE.LineBasicMaterial( { color: color, opacity: opacity, transparent: true, } ) );
			//moving of the axes intersection to the center of the canvas ( to the camera focus ) munus posAxesIntersection
			if ( axisName !== 'x' ) lineAxis.position.x = options.scales.posAxesIntersection.x;
			if ( axisName !== 'y' ) lineAxis.position.y = options.scales.posAxesIntersection.y;
			if ( axisName !== 'z' ) lineAxis.position.z = options.scales.posAxesIntersection.z;
			lineAxis.add( group );
			lineAxis.userData.axisName = axisName;
			groupAxesHelper.add( lineAxis );

			if ( scale.marks !== undefined ) {

				const SpriteMark = function (
					position,
				) {

					position = position || new THREE.Vector3( 0, 0, 0 );
					const sizeAttenuation = false;


					const sprite = new THREE.Sprite( new THREE.SpriteMaterial( {

						map: new THREE.Texture(),
						sizeAttenuation: sizeAttenuation,

					} ) );
					const canvas = document.createElement( 'canvas' );
					sprite.material.map.minFilter = THREE.LinearFilter;
					const context = canvas.getContext( '2d' );

					function update() {

						const center = new THREE.Vector2(

							//x
							axisName !== 'y' ? 0.5 ://For x and z axes риска не сдвигается
								0,//For y axes риска сдвигается вправо

							//y
							axisName === 'y' ? 0.5 ://For y axes риска не сдвигается
								1//For x and z axes риска сдвигается вниз

						);
						var width = 3;//, linesCount = 1,
						context.fillStyle = options.scales.color;//'rgba(0, 255, 0, 1)';
						context.fillRect( 0, 0, canvas.width, canvas.height );

						// Inject canvas into sprite
						sprite.material.map.image = canvas;
						sprite.material.map.needsUpdate = true;

						if ( axisName === 'y' ) {

							sprite.scale.x = ( width * ( canvas.width / canvas.height ) ) / canvas.width;
							sprite.scale.y = 1 / canvas.height;

						} else {

							sprite.scale.x = 1 / canvas.width;
							sprite.scale.y = width / canvas.height;

						}

						sprite.scale.x *= options.camera.fov / ( 50 * 2 );
						sprite.scale.y *= options.camera.fov / ( 50 * 2 );

						sprite.position.copy( position );
						sprite.center = center;

						//size attenuation. Whether the size of the sprite is attenuated by the camera depth. (Perspective camera only.) Default is false.
						//See https://threejs.org/docs/index.html#api/en/materials/SpriteMaterial.sizeAttenuation
						sprite.material.sizeAttenuation = sizeAttenuation;

						sprite.material.needsUpdate = true;

						function getTextPrecision() {

							return options.scales.text.precision !== undefined ? text.toPrecision( options.scales.text.precision ) : text.toString();

						}
						var text = ( axisName === 'x' ? position.x : axisName === 'y' ? position.y : position.z );
						function getCenterX() {

							const a = ( 0.013 - 0.05 ) / 15, b = 0.013 - 17 * a;
							return - width * ( getTextPrecision().length * a + b );

						}
						const spriteText = new SpriteText$1(
							getTextPrecision(),
							new THREE.Vector3(
								position.x,
								position.y,
								position.z,
							), {

							group: group,
							rotation: axisName === 'y' ? 0 : - Math.PI / 2,
							center: new THREE.Vector2(

								getCenterX(),//текст по оси y сдвигается вправо
								//текст по оси x и z сдвигается вниз

								axisName === 'x' ? 1 ://текст по оси x сдвигается влево
									0,//текст по оси z сдвигается вправо,
								//текст по оси y сдвигается вверх

							),

						} );
						spriteText.userData.updatePrecision = function () {

							spriteText.userData.updateText( text.toPrecision( options.scales.text.precision ) );
							spriteText.center.x = getCenterX();

						};
						group.add( spriteText );

					}					update();
					return sprite;

				};
				const max = scale.max,
					min = scale.min,
					d = ( max - min ) / ( scale.marks - 1 );
				for ( var i = 0; i < scale.marks; i++ ) {

					const pos = i * d + min;
					group.add( new SpriteMark( new THREE.Vector3(
						axisName === 'x' ? pos : 0,
						axisName === 'y' ? pos : 0,
						axisName === 'z' ? pos : 0,
					) ) );

				}
			}

			//Axis name
			var axisNameOptions = {

				center: new THREE.Vector2(
					axisName === 'y' ? 1.1 : -0.1,
					axisName === 'y' ? 0 : -0.1
				),
				group: group,

			};
//			scale.name = scale.name || axisName;
			group.add( new SpriteText$1(
				scale.name,
				new THREE.Vector3(
					axisName === 'x' ? scale.max : 0,
					axisName === 'y' ? scale.max : 0,
					axisName === 'z' ? scale.max : 0,
				), axisNameOptions ) );
			group.add( new SpriteText$1(
				scale.name,
				new THREE.Vector3(
					axisName === 'x' ? scale.min : 0,
					axisName === 'y' ? scale.min : 0,
					axisName === 'z' ? scale.min : 0,
				), axisNameOptions ) );

		};
		this.createAxis( 'x' );
		this.createAxis( 'y' );
		this.createAxis( 'z' );
		if ( groupAxesHelper.children.length === 0 )
			console.warn( 'AxesHelper: Define at least one axis.' );

		//dotted lines
		function dotLines( _scene ) {

			var lineX, lineY, lineZ, scene = _scene,
				groupDotLines, intersection;
			this.remove = function () {

				if ( groupDotLines === undefined )
					return;

				//clear memory
				//
				//Если это не делать, то со временем может произойти событие webglcontextlost
				//https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/webglcontextlost_event
				//
				//for testing
				//	open http://localhost/threejs/nodejs/controllerPlay/Examples/html/ page
				//	select a point
				//	open dat.gui
				//	in the PlayController:
				//		click the ⥀ button
				//		Rate of changing of animation scenes per second to 25
				//		click the ► play button
				//	Now you can see animation of the scene
				//	In the Windows open Resource Monitor
				//		Open the Memory tab
				//		The Commit(KB) for chrome.exe do not increasing about 20 minutes.
				clearThree$1( groupDotLines );

				scene.remove( groupDotLines );
				groupDotLines = undefined;
				lineX = undefined;
				lineY = undefined;
				lineZ = undefined;

			};
			function createGroup() {

				dotLines.remove();
				groupDotLines = new THREE.Group();
				scene.add( groupDotLines );

			}
			function verticeAxis( axisName ) { return ( options.scales.posAxesIntersection[axisName] - group.position[axisName] ) / group.scale[axisName]; }
			function getDashSize() { return 0.05 / ( Math.max( Math.max( group.scale.x, group.scale.y ), group.scale.z ) ); }
			this.dottedLines = function ( _intersection ) {

				intersection = _intersection;
				const pointVertice = intersection instanceof THREE.Vector4 || intersection instanceof THREE.Vector3 ? intersection : getObjectPosition( intersection.object, intersection.index );
				if ( groupDotLines !== undefined ) {

					function dottedLine( axisName ) {

						var line;
						switch ( axisName ) {

							case 'x':
								line = lineX;
								break;
							case 'y':
								line = lineY;
								break;
							case 'z':
								line = lineZ;
								break;
							default: console.error( 'AxesHelper.dotLines.dottedLines.dottedLine: axesId = ' + axesId );
								return;

						}
						if ( !line )
							return;//Current axis is not exists
						var lineVertices = line.geometry.attributes.position.array;
						lineVertices[0] = axisName === 'x' ? pointVertice.x :
							verticeAxis( 'x' );//group.position.x, group.scale.x );
						lineVertices[1] = axisName === 'y' ? pointVertice.y :
							verticeAxis( 'y' );//group.position.y, group.scale.y );
						lineVertices[2] = axisName === 'z' ? pointVertice.z :
							verticeAxis( 'z' );//group.position.z, group.scale.z );

						lineVertices[3] = pointVertice.x;
						lineVertices[4] = pointVertice.y;
						lineVertices[5] = pointVertice.z;

						var size = getDashSize();
						line.material.dashSize = size;
						line.material.gapSize = size;

						line.geometry.attributes.position.needsUpdate = true;

					}
					dottedLine( 'x' );
					dottedLine( 'y' );
					dottedLine( 'z' );
					return;

				}

				createGroup();

				function dottedLine( axisName ) {

					if ( !options.scales[axisName].isAxis() )
						return;
					var lineVertices = [
						new THREE.Vector3().copy( options.scales.posAxesIntersection ),
						pointVertice,
					];
					lineVertices[0].x = axisName === 'x' ? lineVertices[1].x : verticeAxis( 'x' );
					lineVertices[0].y = axisName === 'y' ? lineVertices[1].y : verticeAxis( 'y' );
					lineVertices[0].z = axisName === 'z' ? lineVertices[1].z : verticeAxis( 'z' );

					var size = getDashSize();
					if ( options.colorsHelper === undefined )
						options.colorsHelper = 0x80;
					var line = new THREE.LineSegments( new THREE.BufferGeometry().setFromPoints( lineVertices ),
						new THREE.LineDashedMaterial( {
							color: 'rgb(' + options.colorsHelper + ', ' + options.colorsHelper + ', ' + options.colorsHelper + ')',
							dashSize: size, gapSize: size
						} ) );
					line.computeLineDistances();
					groupDotLines.add( line );
					return line;

				}
				lineX = dottedLine( 'x' );
				lineY = dottedLine( 'y' );
				lineZ = dottedLine( 'z' );

			};
			this.update = function () {

				if ( ( groupDotLines === undefined ) || ( intersection === undefined ) )
					return;

				this.dottedLines( intersection );

			};
			this.movePointAxes = function ( axesId, value ) {

				var line;
				switch ( axesId ) {

					case mathBox.axesEnum.x:
						line = lineX;
						break;
					case mathBox.axesEnum.y:
						line = lineY;
						break;
					case mathBox.axesEnum.z:
						line = lineZ;
						break;
					default: console.error( 'point.userData.movePointAxes: invalid axesId: ' + axesId );
						return;

				}
				if ( line === undefined )
					return;
				line.geometry.attributes.position.array[axesId + 3] = value;

				lineX.geometry.attributes.position.array[axesId] = value;
				lineY.geometry.attributes.position.array[axesId] = value;
				lineZ.geometry.attributes.position.array[axesId] = value;

				lineX.geometry.attributes.position.needsUpdate = true;
				lineY.geometry.attributes.position.needsUpdate = true;
				lineZ.geometry.attributes.position.needsUpdate = true;

			};

		}
		dotLines = new dotLines( group );

		var _intersection;
		/**
		* Expose position on axes.
		* @param {THREE.Vector3|object} intersection position or intersection. See {@link https://threejs.org/docs/index.html#api/en/core/Raycaster|Raycaster} for detail.
		*/
		this.exposePosition = function ( intersection ) {

			_intersection = intersection;
			if ( intersection === undefined ) {

				_intersection = undefined;
				dotLines.remove();
				return;

			}
			dotLines.dottedLines( intersection );

		};
		/**
		* move exposed position on axes.
		*/
		this.movePosition = function () {

			if ( !_intersection  )
				return;
			this.exposePosition( _intersection );

		};

		/**
		 * get group
		 * @returns {@link https://threejs.org/docs/index.html#api/en/objects/Group|Group}
		 */
		this.getGroup = function () { return groupAxesHelper; };

		/**
		 * update axes
		 */
		this.updateAxes = function () {

			function updateAxis( axisName ) {

				groupAxesHelper.children.forEach( function ( group ) {

					if ( group.userData.axisName !== axisName )
						return;
					groupAxesHelper.remove( group );
					axesHelper.createAxis( axisName );

				} );

			}
			updateAxis( 'x' );
			updateAxis( 'y' );
			updateAxis( 'z' );
			dotLines.update();

		};
		options.axesHelper = this;

	}

}

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
//import { SpriteText } from 'https://raw.githack.com/anhr/commonNodeJS/master/SpriteText/SpriteText.js';

//Каждый экземляр SpriteTextGui должен иметь униканое cookieName.
//Иначе если пользователь сделает какое то изменеие в SpriteTextGui, то это изменеие отразится 
//в других экземлярах SpriteTextGui после перезанрузки веб страницы. В частности могут появиться ненужные органы управления
var _spriteTextGuiCount = 0;

/**
 * Adds SpriteText settings folder into dat.gui.
 * @param {THREE.Group|THREE.Scene|THREE.Sprite} group [THREE.Group]{@link https://threejs.org/docs/index.html?q=group#api/en/objects/Group} or [THREE.Scene]{@link https://threejs.org/docs/index.html?q=sce#api/en/scenes/Scene} of the <b>SpriteText</b> and of all child groups of the <b>SpriteText</b> for which these settings will have an effect.
 * Or Sprite returned from <a href="../../AxesHelper/jsdoc/index.html" target="_blank">new SpriteText(...)</a>.
 *
 * @param {Options} [options] See the <b>options</b> parameter of the <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
 * @param {object} [options.dat] use dat-gui JavaScript Controller Library. [dat.gui]{@link https://github.com/dataarts/dat.gui}.
 * @param {GUI} [options.dat.dat] [dat.GUI()]{@link https://github.com/dataarts/dat.gui}.
 * @param {boolean} [options.dat.cookie] false - do not save to cookie all user settings
 * @param {string} [options.dat.cookieName] Name of the cookie.
 * @param {boolean} [options.dat.guiSelectPoint] false - do not displays <b>GuiSelectPoint</b>.
 * @param {Function} [options.getLanguageCode=language code of your browser] Your custom getLanguageCode() function.
 * <pre>
 * returns the "primary language" subtag of the language version of the browser.
 * Examples: "en" - English language, "ru" Russian.
 * See the "Syntax" paragraph of RFC 4646 {@link https://tools.ietf.org/html/rfc4646#section-2.1|rfc4646 2.1 Syntax} for details.
 * You can import { getLanguageCode } from '../../commonNodeJS/master/lang.js';
 * </pre>
 * @param {object} [guiParams={}] Followed parameters is allowed. Default is no parameters
 * @param {GUI} [guiParams.folder] <b>SpriteTextGui</b> folder. See {@link https://github.com/anhr/dat.gui|dat.gui} for details
 * @param {GUI} [guiParams.parentFolder] parent folder, returned by {@link https://github.com/dataarts/dat.gui/blob/master/API.md#GUI+addFolder|gui.addFolder(name)}
 * @param {string} [guiParams.optionsSpriteText] See <b>options</b> of <a href="module-SpriteText.html" target="_blank">SpriteText</a>. Default is <b>group.userData.optionsSpriteText</b> or no options
 * @param {string} [guiParams.spriteFolder] sprite folder name. Default is lang.spriteText
 * @param {string} [guiParams.settings] See <b>options.settings</b> of <a href="../../jsdoc/ScaleController/module-ScaleController-ScaleController.html" target="_blank">ScaleControllers</a> settings
 * @returns {GUI} sprite folder
 */
function SpriteTextGui( group, options, guiParams = {} ) {

	options = new Options$1( options );
	const gui = guiParams.folder || options.dat.gui;
	if ( !gui || options.dat.spriteTextGui === false )
		return;
	const optionsSpriteText = guiParams.optionsSpriteText || group.userData.optionsSpriteText || {},
		THREE = three$1.THREE,
		dat = three$1.dat;//options.dat.dat;

	if ( Object.keys(optionsSpriteText).length === 0 ) console.warn( 'SpriteTextGui: optionsSpriteText is empty.' );
		
	if ( THREE.Color.NAMES[optionsSpriteText.fontColor] ) {

		const color = new THREE.Color( optionsSpriteText.fontColor );
		optionsSpriteText.fontColor = 'rgba(' + color.r * 255 + ',' + color.g * 255 + ',' + color.b * 255 + ',1)';

	}
	const optionsDefault = JSON.parse( JSON.stringify( optionsSpriteText ) );
	Object.freeze( optionsDefault );

	//Localization

	const lang = {

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
		defaultTitle: 'Restore default Sprite Text settings.',

	};
	switch ( options.getLanguageCode() ) {

		case 'ru'://Russian language

			lang.spriteText = 'Текстовый спрайт';//'Sprite Text'
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
		default://Custom language
			if ( ( guiParams.lang === undefined ) || ( guiParams.lang.languageCode != _languageCode ) )
				break;

			Object.keys( guiParams.lang ).forEach( function ( key ) {

				if ( lang[key] === undefined )
					return;
				lang[key] = guiParams.lang[key];

			} );

	}

	guiParams.spriteFolder = guiParams.spriteFolder || lang.spriteText;
	_spriteTextGuiCount++;
	const cookieName = options.dat.getCookieName( 'SpriteText' + _spriteTextGuiCount ),
		cookie = options.dat.cookie,
		optionsGroup = optionsSpriteText.group;
	cookie.getObject( cookieName, optionsSpriteText, optionsSpriteText );
	optionsSpriteText.group = optionsGroup;
	if ( group instanceof THREE.Sprite !== true ) {

		if ( group.userData.optionsSpriteText === undefined )
			group.userData.optionsSpriteText = optionsSpriteText;
		else if ( guiParams.optionsSpriteText !== undefined ) console.warn( 'SpriteTextGui: duplicate group.userData.optionsSpriteText' );

	}

	//updateSpriteText function is repeatedly called during restore settings to default values.
	//See fSpriteText.userData.restore() function for details.
	//I have set to false before restoring and set to true again and called function once after restoring for resolving of problem.
	var boUpdateSpriteText = true;
	function updateSpriteText( noSave ) {

		if ( !boUpdateSpriteText )
			return;
		SpriteText$1.updateSpriteTextGroup( group );
		if ( group.userData.update )
			group.userData.update();// optionsSpriteText );

		if ( controllerFont !== undefined )
			controllerFont.setValue( optionsSpriteText.font );

		if ( !noSave )
			cookie.setObject( cookieName, optionsSpriteText );

	}

	if ( !guiParams.hasOwnProperty( 'parentFolder' ) )
		guiParams.parentFolder = gui;

	//Sprite folder
	const fSpriteText = guiParams.parentFolder.addFolder( guiParams.spriteFolder );
	dat.folderNameAndTitle( fSpriteText, guiParams.spriteFolder, lang.spriteTextTitle );

	//Sprite text height
	const textHeight = 'textHeight';
	if ( optionsSpriteText.hasOwnProperty( textHeight ) && ( optionsSpriteText[textHeight] !== undefined ) ) {

		ScaleControllers( fSpriteText, optionsSpriteText, textHeight, function () { updateSpriteText(); }, {

			text: lang.textHeight, textTitle: lang.textHeightTitle,
			getLanguageCode: guiParams.getLanguageCode,
			settings: guiParams.settings,

		} );

	}

	//font  face
	if ( optionsSpriteText.fontFace !== undefined ) {

		dat.controllerNameAndTitle(
			fSpriteText.add( optionsSpriteText, 'fontFace' ).onChange( function ( value ) {

				updateSpriteText();

			} ), lang.fontFace );

	}

	//font faces
	if ( optionsSpriteText.fontFaces !== undefined ) {

		dat.controllerNameAndTitle(
			fSpriteText.add( optionsSpriteText, 'fontFace', optionsSpriteText.fontFaces ).onChange( function ( value ) {

				updateSpriteText();

			} ), lang.fontFaces, lang.fontFaceTitle );

	}

	//bold
	if ( optionsSpriteText.hasOwnProperty( 'bold' ) ) {

		dat.controllerNameAndTitle(
			fSpriteText.add( optionsSpriteText, 'bold' ).onChange( function ( value ) {

				updateSpriteText();

			} ), lang.bold );

	}

	//italic
	if ( optionsSpriteText.hasOwnProperty( 'italic' ) ) {

		dat.controllerNameAndTitle(
			fSpriteText.add( optionsSpriteText, 'italic' ).onChange( function ( value ) {

				updateSpriteText();

			} ), lang.italic );

	}

	//rotation
	const rotation = 'rotation';
	if ( optionsSpriteText.hasOwnProperty( rotation ) ) {

		var min = 0,
			max = Math.PI * 2;
		dat.controllerNameAndTitle(
			fSpriteText.add( optionsSpriteText, rotation, min, max, ( max - min ) / 360 ).onChange( function ( value ) {

				updateSpriteText();

			} ), lang.rotation, lang.rotationTitle );

	}

	//font properties
	if ( optionsSpriteText.hasOwnProperty( 'fontProperties' ) ) {

		dat.controllerNameAndTitle(
			fSpriteText.add( optionsSpriteText, 'fontProperties' ).onChange( function ( value ) {

				updateSpriteText();

			} ), lang.fontProperties, lang.fontPropertiesTitle );

	}

	//font style
	if ( optionsSpriteText.hasOwnProperty( 'font' ) ) {

		var controllerFont = fSpriteText.add( optionsSpriteText, 'font' );
		controllerFont.__input.readOnly = true;
		dat.controllerNameAndTitle( controllerFont, lang.fontStyle, lang.fontStyleTitle );

	}

	//text rectangle
	if ( optionsSpriteText.hasOwnProperty( 'rect' ) ) {

		if ( optionsSpriteText.rect.displayRect === undefined ) optionsSpriteText.rect.displayRect = false;
		dat.controllerNameAndTitle( fSpriteText.add( optionsSpriteText.rect, 'displayRect' ).onChange( function ( value ) {

			updateSpriteText();
			fRect.domElement.style.display = optionsSpriteText.rect.displayRect ? 'block' : 'none';

		} ), lang.displayRect, lang.displayRectTitle );
		const fRect = fSpriteText.addFolder( lang.displayRect );//'Border'
		fRect.domElement.style.display = optionsSpriteText.rect.displayRect ? 'block' : 'none';

		//border thickness
		const borderThickness = 'borderThickness';
		if ( optionsSpriteText.rect.hasOwnProperty( borderThickness ) ) {

			dat.controllerNameAndTitle(
				fRect.add( optionsSpriteText.rect, borderThickness, 1, optionsSpriteText.rect.borderThickness * 30, 1 ).onChange( function ( value ) {

					updateSpriteText();

				} ), lang.borderThickness );

		}

		//border сolor
		const borderColor = 'borderColor';
		if ( optionsSpriteText.rect.hasOwnProperty( borderColor ) ) {

			dat.controllerNameAndTitle( fRect.addColor( optionsSpriteText.rect, borderColor ).onChange( function ( value ) {

				updateSpriteText();

			} ), lang.borderColor );

		}

		//background color
		const backgroundColor = 'backgroundColor';
		if ( optionsSpriteText.rect.hasOwnProperty( backgroundColor ) ) {

			dat.controllerNameAndTitle( fRect.addColor( optionsSpriteText.rect, backgroundColor ).onChange( function ( value ) {

				updateSpriteText();

			} ), lang.backgroundColor );

		}

		//border radius
		const borderRadius = 'borderRadius';
		if ( optionsSpriteText.rect.hasOwnProperty( borderRadius ) ) {

			dat.controllerNameAndTitle(
				fRect.add( optionsSpriteText.rect, borderRadius, 0, 100, 1 ).onChange( function ( value ) {

					updateSpriteText();

				} ), lang.borderRadius );

		}

	}

	//font сolor
	if ( optionsSpriteText.hasOwnProperty( 'fontColor' ) ) {

		dat.controllerNameAndTitle( fSpriteText.addColor( optionsSpriteText, 'fontColor' ).onChange( function ( value ) {

			updateSpriteText();

		} ), lang.fontColor );

	}

	//anchor. https://threejs.org/docs/index.html#api/en/objects/Sprite.center
	if ( optionsSpriteText.hasOwnProperty( 'center' ) ) {

		optionsSpriteText.center = SpriteText$1.getCenter( optionsSpriteText.center );

		//anchor folder
		const fAnchor = fSpriteText.addFolder( 'center' );
		dat.folderNameAndTitle( fAnchor, lang.anchor, lang.anchorTitle );

		//anchor x
		fAnchor.add( optionsSpriteText.center, 'x', 0, 1, 0.1 ).onChange( function ( value ) {

			updateSpriteText();

		} );

		//anchor y
		fAnchor.add( optionsSpriteText.center, 'y', 0, 1, 0.1 ).onChange( function ( value ) {

			updateSpriteText();

		} );

	}

	//size attenuation. Whether the size of the sprite is attenuated by the camera depth. (Perspective camera only.) Default is false.
	//See https://threejs.org/docs/index.html#api/en/materials/SpriteMaterial.sizeAttenuation
	const sizeAttenuation = 'sizeAttenuation';
	if ( optionsSpriteText.hasOwnProperty( sizeAttenuation ) && ( optionsSpriteText[sizeAttenuation] !== undefined ) ) {

		dat.controllerNameAndTitle( fSpriteText.add( optionsSpriteText, sizeAttenuation ).onChange( function ( value ) {

			updateSpriteText();

		} ), lang.sizeAttenuation, lang.sizeAttenuationTitle );

	}

	//default button
	fSpriteText.userData = {

		options: options,
		restore: function ( value ) {

			boUpdateSpriteText = false;
			function setValues( folder, key, optionsDefault ) {

				folder.__controllers.forEach( function ( controller ) {

					if ( controller.property !== key ) {

						if ( typeof optionsDefault[key] !== "object" )
							return;
						Object.keys( optionsDefault[key] ).forEach( function ( optionKey ) {

							if ( controller.property !== optionKey )
								return;
							controller.setValue( optionsDefault[key][optionKey] );

						} );
						return;

					}
					controller.setValue( optionsDefault[key] );

				} );

			}

			Object.keys( optionsDefault ).forEach( function ( key ) {

				setValues( fSpriteText, key, optionsDefault );
				if ( typeof optionsDefault[key] === "object" ) {

					Object.keys( optionsDefault[key] ).forEach( function ( keyObject ) {

						Object.keys( fSpriteText.__folders ).forEach( function ( keyFolder ) {

							setValues( fSpriteText.__folders[keyFolder], keyObject, optionsDefault[key] );

						} );

					} );

				}

				Object.keys( fSpriteText.__folders ).forEach( function ( keyFolder ) {

					if ( keyFolder !== key )
						return;
					Object.keys( optionsDefault[keyFolder] ).forEach( function ( key ) {

						setValues( fSpriteText.__folders[keyFolder], key, optionsDefault[keyFolder] );

					} );

				} );

			} );

			boUpdateSpriteText = true;
			updateSpriteText();

		}

	};
	const defaultParams = { defaultF: fSpriteText.userData.restore, };
	if ( optionsDefault === undefined ) console.error( 'SpriteTextGui: optionsDefault = ' + optionsDefault );
	dat.controllerNameAndTitle( fSpriteText.add( defaultParams, 'defaultF' ), lang.defaultButton, lang.defaultTitle );

	updateSpriteText( true );

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

/**
 * Adds <a href="../../AxesHelper/jsdoc/module-AxesHelper-AxesHelper.html" target="_blank">AxesHelper</a> settings folder into {@link https://github.com/anhr/dat.gui|dat.gui}.
 * An axis object to visualize axes.
 * @param {Options} options Followed parameters is allowed.
 * See the <b>options</b> parameter of the <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
 * @param {boolean} [options.dat.axesHelperGui] false - do not adds <b>AxesHelperGui</b> into [dat.gui]{@link https://github.com/dataarts/dat.gui}.
 * @param {AxesHelper} [options.axesHelper is <a href="./module-AxesHelper-AxesHelper.html" target="_blank">AxesHelper</a> instance.
 * @param {Function} [options.getLanguageCode=language code of your browser] Your custom getLanguageCode() function.
 * <pre>
 * returns the "primary language" subtag of the language version of the browser.
 * Examples: "en" - English language, "ru" Russian.
 * See the "Syntax" paragraph of RFC 4646 {@link https://tools.ietf.org/html/rfc4646#section-2.1|rfc4646 2.1 Syntax} for details.
 * You can import { getLanguageCode } from '../../commonNodeJS/master/lang.js';
 * </pre>
 * @param {cookie} [options.cookie] Your custom cookie function for saving and loading of the AxesHelper settings.
 * <pre>
 * See [cookieNodeJS]{@link https://github.com/anhr/commonNodeJS/tree/master/cookieNodeJS}.
 * Default cookie is not saving settings.
 * </pre>
 * @param {string} [options.cookieName] Name of the cookie is "AxesHelper" + options.cookieName.
 * @param {GUI} [gui] is [new dat.GUI(...)]{@link https://github.com/anhr/dat.gui}.
*/
function AxesHelperGui( options, gui ) {

	if ( !options.boOptions ) {

		console.error( 'AxesHelperGui: call options = new Options( options ) first' );
		return;

	}
	gui = gui || options.dat.gui;
	if ( !gui || ( options.dat === false ) || ( options.dat.axesHelperGui === false ) )
		return;
	if ( options.axesHelper === false )
		return;
	if ( !options.axesHelper ) {

		console.error( 'AxesHelperGui: create AxesHelper instance first' );
		return;

	}
	
	const THREE = three$1.THREE, dat = three$1.dat;

	const scalesDefault = JSON.parse( JSON.stringify( options.scales ) ),
		groupAxesHelper = options.axesHelper.getGroup();
	scalesDefault.posAxesIntersection = new THREE.Vector3().copy(options.scales.posAxesIntersection);
	Object.freeze( scalesDefault );

	options = options || {};

	//Localization

	const lang = {

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
		defaultAxesIntersectionTitle: 'Restore default axes intersection.',

	};
	switch ( options.getLanguageCode() ){

		case 'ru'://Russian language

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

			lang.axesIntersection = 'Начало координат',

			lang.defaultButton = 'Восстановить';
			lang.defaultTitle = 'Восстановить настройки осей координат по умолчанию.';
			lang.defaultAxesIntersectionTitle = 'Восстановить начало координат по умолчанию.';

			break;
		default://Custom language
			if ( ( options.lang === undefined ) || ( options.lang.languageCode != languageCode ) )
				break;

			Object.keys( options.lang ).forEach( function ( key ) {

				if ( lang[key] === undefined )
					return;
				lang[key] = options.lang[key];

			} );

	}

	const cookie = options.dat.cookie,
		cookieName = options.dat.getCookieName( 'AxesHelper' );
	cookie.getObject( cookieName, options.scales, options.scales );

	function setSettings() {

		cookie.setObject( cookieName, options.scales );

	}

	//AxesHelper folder
	const fAxesHelper = gui.addFolder( lang.axesHelper );

	//scales folder
	const fScales = fAxesHelper.addFolder( lang.scales );

	//display scales

	const controllerDisplayScales = fScales.add( options.scales, 'display' ).onChange( function ( value ) {

		groupAxesHelper.children.forEach( function ( group ) {

			group.children.forEach( function ( group ) {

				group.visible = value;

			} );

		} );
		displayControllers();
		setSettings();
			

	} );
	dat.controllerNameAndTitle( controllerDisplayScales, lang.displayScales, lang.displayScalesTitle );

	var controllerPrecision;
	if ( options.scales.text.precision !== undefined ) {

		controllerPrecision = fScales.add( options.scales.text, 'precision', 2, 17, 1 ).onChange( function ( value ) {

			function updateSpriteTextGroup( group ) {

				group.children.forEach( function ( spriteItem ) {

					if ( spriteItem instanceof THREE.Sprite ) {

						if ( spriteItem.userData.updatePrecision !== undefined )
							spriteItem.userData.updatePrecision();

					} else if ( ( spriteItem instanceof THREE.Group ) || ( spriteItem instanceof THREE.Line ) )
						updateSpriteTextGroup( spriteItem );

				} );

			}
			updateSpriteTextGroup( groupAxesHelper );
			setSettings();

		} );
		dat.controllerNameAndTitle( controllerPrecision, lang.precision, lang.precisionTitle );

	}

	const fSpriteText = typeof SpriteTextGui === "undefined" ? undefined : SpriteTextGui( groupAxesHelper, {

		dat: {

			gui: options.dat.gui,
			cookieName: 'AxesHelper_' + options.dat.getCookieName(),

		},

	}, {

		parentFolder: fScales,

	} );

	//Axes intersection folder

	const fAxesIntersection = fAxesHelper.addFolder( lang.axesIntersection ),
		axesIntersectionControllers = { x: {}, y: {}, z: {} };
	function axesIntersection( axisName ) {

		const scale = options.scales[axisName];
		if ( !scale.isAxis() )
			return;

		const scaleControllers = axesIntersectionControllers[axisName];

		scaleControllers.controller = fAxesIntersection.add( {

			value: options.scales.posAxesIntersection[axisName],

		}, 'value',
			scale.min,
			scale.max,
			( scale.max - scale.min ) / 100 ).
			onChange( function ( value ) {

				options.scales.posAxesIntersection[axisName] = value;
				options.axesHelper.updateAxes();
				setSettings();

			} );
		dat.controllerNameAndTitle( scaleControllers.controller, scale.name );

	}
	axesIntersection( 'x' );
	axesIntersection( 'y' );
	axesIntersection( 'z' );

	//default button Axes intersection 
	var defaultParams = {

		defaultF: function ( value ) {
			
			axesIntersectionControllers.x.controller.setValue( scalesDefault.posAxesIntersection.x );
			axesIntersectionControllers.y.controller.setValue( scalesDefault.posAxesIntersection.y );
			axesIntersectionControllers.z.controller.setValue( scalesDefault.posAxesIntersection.z );

		},

	};
	dat.controllerNameAndTitle( fAxesIntersection.add( defaultParams, 'defaultF' ), lang.defaultButton, lang.defaultAxesIntersectionTitle );

	fAxesHelper.add( new ScaleController(
		function ( customController, action ) {

			function zoom( zoom, action ) {

				function axesZoom( axes, scaleControllers ) {

					if ( axes === undefined )
						return;//not 3D axesHelper

					axes.min = action( axes.min, zoom );
					scaleControllers.min.setValue( axes.min );

					axes.max = action( axes.max, zoom );
					scaleControllers.max.setValue( axes.max );
					scaleControllers.onchangeWindowRange();

				}

				axesZoom( options.scales.x, scalesControllers.x );
				axesZoom( options.scales.y, scalesControllers.y );
				axesZoom( options.scales.z, scalesControllers.z );

			}
			zoom( customController.controller.getValue(), action );

		}, {

		settings: { zoomMultiplier: 1.1, },
		getLanguageCode: options.getLanguageCode,

	} ) ).onChange( function ( value ) {

		console.warn( 'ScaleController.onChange' );

	} );

	function scale( axisName ) {

		const axes = options.scales[axisName];
		if ( axes === undefined )
			return;

		const scaleControllers = scalesControllers[axisName],
			axesDefault = scalesDefault[axisName];

		Object.freeze( axesDefault );

		function updateAxis() {

			groupAxesHelper.children.forEach( function ( group ) {

				if ( group.userData.axisName !== axisName )
					return;
				groupAxesHelper.remove( group );
				options.axesHelper.createAxis( axisName );

			} );

		}
		scaleControllers.updateAxis = updateAxis;

		function onchangeWindowRange() {

			updateAxis();
			setSettings();

		}
		scaleControllers.onchangeWindowRange = onchangeWindowRange;
		
		function onclick( customController, action ) {

			var zoom = customController.controller.getValue();

			axes.min = action( axes.min, zoom );
			scaleControllers.min.setValue( axes.min );

			axes.max = action( axes.max, zoom );
			scaleControllers.max.setValue( axes.max );

			onchangeWindowRange();

		}

		scaleControllers.folder = fAxesHelper.addFolder( axes.name );

		scaleControllers.scaleController = scaleControllers.folder.add( new ScaleController( onclick,
			{ settings: axes, getLanguageCode: options.getLanguageCode, } ) ).onChange( function ( value ) {

				axes.zoomMultiplier = value;
				setSettings();

			} );

		var positionController = new PositionController( function ( shift ) {

			onclick( positionController, function ( value, zoom ) {

				value += shift;
				return value;

			} );

		}, { settings: axes, getLanguageCode: options.getLanguageCode, } );
		scaleControllers.positionController = scaleControllers.folder.add( positionController ).onChange( function ( value ) {

			axes.offset = value;
			setSettings();

		} );

		//min
		scaleControllers.min = dat.controllerZeroStep( scaleControllers.folder, axes, 'min', function ( value ) {

			onchangeWindowRange();

		} );
		dat.controllerNameAndTitle( scaleControllers.min, lang.min );

		//max
		scaleControllers.max = dat.controllerZeroStep( scaleControllers.folder, axes, 'max', function ( value ) {

			onchangeWindowRange();

		} );
		dat.controllerNameAndTitle( scaleControllers.max, lang.max );

		//marks
		if ( axes.marks !== undefined ) {//w axis do not have marks

			scaleControllers.marks = dat.controllerZeroStep( scaleControllers.folder, axes, 'marks', function ( value ) {

				onchangeWindowRange();

			} );
			dat.controllerNameAndTitle( scaleControllers.marks, axes.marksName === undefined ? lang.marks : axes.marksName,
				axes.marksTitle === undefined ? lang.marksTitle : axes.marksTitle );

		}

		//Default button
		scaleControllers.defaultButton = scaleControllers.folder.add( {

			defaultF: function ( value ) {

				axes.min = axesDefault.min;
				scaleControllers.min.setValue( axes.min );

				axes.max = axesDefault.max;
				scaleControllers.max.setValue( axes.max );

				axes.zoomMultiplier = axesDefault.zoomMultiplier;
				scaleControllers.scaleController.setValue( axes.zoomMultiplier );

				axes.offset = axesDefault.offset;
				scaleControllers.positionController.setValue( axes.offset );

				if ( axesDefault.marks !== undefined ) {

					axes.marks = axesDefault.marks;
					scaleControllers.marks.setValue( axes.marks );

				}

				onchangeWindowRange();

			},

		}, 'defaultF' );
		dat.controllerNameAndTitle(scaleControllers.defaultButton , lang.defaultButton, lang.defaultTitle );

	}
	const scalesControllers = { x: {}, y: {}, z: {} };//, w: {} };//, t: {}, };
	scale('x');
	scale('y');
	scale('z');

	//default button
	var defaultParams = {

		defaultF: function ( value ) {

			controllerDisplayScales.setValue( scalesDefault.display );
			if ( controllerPrecision !== undefined )
				controllerPrecision.setValue( scalesDefault.text.precision );
			fSpriteText.userData.restore();
			function defaulAxis( axisName ) {

				if ( scalesControllers[axisName].defaultButton )
					scalesControllers[axisName].defaultButton.object.defaultF();

			}
			defaulAxis( 'x' );
			defaulAxis( 'y' );
			defaulAxis( 'z' );

		},

	};
	dat.controllerNameAndTitle( fAxesHelper.add( defaultParams, 'defaultF' ), lang.defaultButton, lang.defaultTitle );
		
	function displayControllers() {

		var display = options.scales.display ? 'block' : 'none';
		if ( fSpriteText !== undefined )
			fSpriteText.domElement.style.display = display;
		if ( controllerPrecision !== undefined )	
			controllerPrecision.domElement.parentElement.parentElement.style.display = display;

	}
	displayControllers();
	
	if ( scalesControllers.x.updateAxis ) scalesControllers.x.updateAxis();
	if ( scalesControllers.y.updateAxis ) scalesControllers.y.updateAxis();
	if ( scalesControllers.z.updateAxis ) scalesControllers.z.updateAxis();

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

class OrbitControlsGui {

	/**
	 * OrbitControls graphical user interface
	 * @param {Options} options See <a href="../../jsdoc/Options/Options.html" target="_blank">Options</a>.
	 * The following options are available.
	 * See the <b>options</b> parameter of the <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
	 * @param {boolean} [options.dat.orbitControlsGui] false - do not adds <b>OrbitControlsGui</b> into [dat.gui]{@link https://github.com/dataarts/dat.gui}.
	 * @param {OrbitControls} [options.orbitControls] [OrbitControls]{@link https://threejs.org/docs/index.html#examples/en/controls/OrbitControls}.
	 * Call <a href="../../jsdoc/Options/Options.html#createOrbitControls" target="_blank">Options.createOrbitControls(...)</a> for define of the <b>options.orbitControls</b>.
	 * @param {object} [options.scales] axes scales.
	 * See <b>options.scales</b> of the <a href="../../AxesHelper/jsdoc/module-AxesHelper-AxesHelper.html" target="_blank">AxesHelper</a>.
	 * @param {Function} [options.getLanguageCode=language code of your browser] returns the "primary language" subtag of the version of the browser.
	 * @param {GUI} [gui] is [new dat.GUI(...)]{@link https://github.com/anhr/dat.gui}.
	 */
	constructor( options, gui ) {

		if ( !options.boOptions ) {

			console.error( 'OrbitControlsGui: call options = new Options( options ) first' );
			return;

		}
		gui = gui || options.dat.gui;
		if ( !gui || !options.orbitControls || options.dat.orbitControlsGui === false )
			return;
		const dat = three$1.dat,//options.dat.dat,
			orbitControls = options.orbitControls;
		options.orbitControlsGui = this;

		orbitControls.addEventListener( 'change', function () {

			//console.log( 'orbitControls.target: ' + orbitControls.target.x + ' ' + orbitControls.target.y + ' ' + orbitControls.target.z )
			if ( targetX ) targetX.setValue( orbitControls.target.x );
			if ( targetY ) targetY.setValue( orbitControls.target.y );
			if ( targetZ ) targetZ.setValue( orbitControls.target.z );
			/*
			console.warn('camera.position = ' + camera.position.x + ' ' + camera.position.y + ' ' + camera.position.z
				+ '\r\ncamera.quaternion = ' + camera.quaternion.x + ' ' + camera.quaternion.y + ' ' + camera.quaternion.z
				+ '\r\ncamera.scale = ' + camera.scale.x + ' ' + camera.scale.y + ' ' + camera.scale.z
				);
			*/

		} );

		//Localization

		const lang = {

			orbitControls: 'Orbit Controls',
			defaultButton: 'Default',
			defaultTitle: 'Restore default Orbit controls settings.',
			target: 'Target',

		};

		const _languageCode = options.getLanguageCode === undefined ? 'en'//Default language is English
			: options.getLanguageCode();
		switch ( _languageCode ) {

			case 'ru'://Russian language

				lang.defaultButton = 'Восстановить';
				lang.defaultTitle = 'Восстановить настройки Orbit controls по умолчанию.';

				break;
			default://Custom language
				if ( ( options.lang === undefined ) || ( options.lang.languageCode != _languageCode ) )
					break;

				Object.keys( options.lang ).forEach( function ( key ) {

					if ( lang[key] === undefined )
						return;
					lang[key] = options.lang[key];

				} );

		}

		const fOrbitControls = gui.addFolder( lang.orbitControls ),
			fX = !options.scales.x ? undefined : fOrbitControls.addFolder( options.scales.x.name ),
			fY = !options.scales.y ? undefined : fOrbitControls.addFolder( options.scales.y.name ),
			fZ = !options.scales.z ? undefined : fOrbitControls.addFolder( options.scales.z.name );

		function addTarget( folder, axisIndex ) {

			if ( !folder )
				return;

			function setTarget( value ) {

				if ( value === undefined )
					value = 0;
				orbitControls.target[axisIndex] = value;
				orbitControls.update();

				target.setValue( value );

			}

			folder.add( new PositionController( function ( shift ) {

				setTarget( orbitControls.target[axisIndex] + shift );

			} ) );

			//target
			const target = dat.controllerZeroStep( folder, orbitControls.target, axisIndex, function ( value ) {

				setTarget( value );

			} );
			dat.controllerNameAndTitle( target, lang.target );

			//Default button
			dat.controllerNameAndTitle( folder.add( {

				defaultF: function ( value ) {

					setTarget();

				},

			}, 'defaultF' ), lang.defaultButton, lang.defaultTitle );

			return target;

		}
		const targetX = addTarget( fX, 'x' ),
			targetY = addTarget( fY, 'y' ),
			targetZ = addTarget( fZ, 'z' );

		//Default button
		dat.controllerNameAndTitle( fOrbitControls.add( {

			defaultF: function ( value ) {

				orbitControls.reset();
				/*
							orbitControls.target.x = 0;
							orbitControls.target.y = 0;
							orbitControls.target.z = 0;
							orbitControls.update();
				*/
				targetX.setValue( orbitControls.target.x );
				targetY.setValue( orbitControls.target.y );
				targetZ.setValue( orbitControls.target.z );

			},

		}, 'defaultF' ), lang.defaultButton, lang.defaultTitle );
		/**
		* Set camera [target]{@link https://threejs.org/docs/index.html#examples/en/controls/OrbitControls.target}.
		* @param {THREE.Vector3} target new camera [target]{@link https://threejs.org/docs/index.html#examples/en/controls/OrbitControls.target}
		*/
		this.setTarget = function ( target ) {

			if ( targetX ) targetX.setValue( target.x );
			if ( targetY ) targetY.setValue( target.y );
			if ( targetZ ) targetZ.setValue( target.z );

		};

	}

}

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
function dat() { }if ( typeof dat !== 'undefined' ) {

	//dat.GUI is included into current project
	//See https://github.com/dataarts/dat.gui/blob/master/API.md about dat.GUI API.
	dat.GUI = GUI$1$1;

	function elNameAndTitle( el, name, title ) {

		if ( name === undefined )
			console.warn( 'elNameAndTitle: name = ' + name );
		el.innerHTML = name;
		if ( title !== undefined )
			el.title = title;

	}

	if ( dat.controllerNameAndTitle === undefined ) {

		dat.controllerNameAndTitle = function ( controller, name, title ) {

			elNameAndTitle( controller.__li.querySelector( ".property-name" ), name, title );

		};

	} else console.error( 'Duplicate dat.controllerNameAndTitle method.' );

	if ( dat.folderNameAndTitle === undefined ) {

		dat.folderNameAndTitle = function ( folder, name, title ) {

			elNameAndTitle( folder.__ul.querySelector( "li.title" ), name, title );

		};

	} else console.error( 'Duplicate dat.folderNameAndTitle method.' );

	if ( dat.controllerZeroStep === undefined ) {

		//Solving of dat.gui NumberController Step bug.
		//See https://github.com/dataarts/dat.gui/issues/48 for details.
		//
		//folder: GUI or folder for new Controller.
		//object: The object to be manipulated. See https://github.com/dataarts/dat.gui/blob/master/API.md#GUI+add for details
		//property: The name of the property to be manipulated. See https://github.com/dataarts/dat.gui/blob/master/API.md#GUI+add for details
		//onchange: Callback function will be called if controller value was changed. Can be undefined.
		//
		//Example of using
		/*
		var gui = new dat.GUI();
		var object = { min: 123.456 }
		dat.controllerZeroStep( gui, object, 'min', function ( value ) {

			console.log( 'object.min = ' + object.min + ' value = ' + value );

		} );
		*/
		dat.controllerZeroStep = function ( folder, object, property, onchange ) {

			if ( typeof object[property] !== "number" ) console.warn( 'typeof object[property] = ' + typeof object[property] );
			var controller = folder.add( object, property ),
				input = controller.__input;
			controller.__input = document.createElement( 'input' );
			input.value = object[property];
			input.onchange = function ( value ) {

				object[property] = parseFloat( input.value );

				if ( onchange !== undefined )
					onchange( object[property] );

			};
			controller.setValue = function ( value, boOnChange ) {

				input.value = object[property] = value;

				//нужно в CameraGui когда пользователь редактирует функцию расстояния от камеры до цели
				if ( boOnChange && onchange )
					onchange( object[property] );

			};
			return controller;

		};

	} else console.error( 'Duplicate dat.controllerZeroStep method.' );

	if ( dat.controllerSetValue === undefined ) {

		//for resolving of the bug
		//Testing:
		//select Surface in the Examples drop down menu of the webgl_math.html page.
		//Click mouse over any point.
		//Now you can see number of selected line in the Select Line drop down menu
		//	and number of selected point in the Select Point drop down menu.
		//Select "no select" in the Select Line drop down menu.
		//Click mouse over any point again.
		//Now you can see a bug: You see "no select" instead of number of selected line in the Select Line drop down menu.
		dat.controllerSetValue = function ( controller, index ) {

			controller.setValue( index );
			controller.__li.querySelector( 'select' ).selectedIndex = index;

		};

	} else console.error( 'Duplicate dat.controllerSetValue method.' );

}
/*
var datModifier = {
}
export default datModifier;
*/

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

class functionsFolder {

	/**
	 * Adds the [Functions]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function} folder into [dat.gui]{@link https://github.com/anhr/dat.gui}.
	 * @param {GUI} fParent parent folder for functions folder.
	 * @param {Object} scales [AxesHelper]{@link https://raw.githack.com/anhr/AxesHelper/master/jsdoc/module-AxesHelper.html} options.scales for details.
	 * @param {Function} onFinishChange callback function is called every time, when user have entered new value of the function and the function controller is lost of the focus.
	 * <pre>
	 * parameter value is new value of the function.
	 * </pre>
	 * @param {Options} options <a href="../../jsdoc/Options/Options.html" target="_blank">Options</a> instance. The following options are available.
	 * See the <b>options</b> parameter of the <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
	 * @param {Function} [options.getLanguageCode=language code of your browser] returns the "primary language" subtag of the version of the browser.
	 * @param {object} [vector] Vector with initial text of the function
	 * @param {string} [vector.x] text of the x axis function
	 * @param {string} [vector.y] text of the y axis function
	 * @param {string} [vector.z] text of the z axis function
	*/
	constructor( fParent, onFinishChange, options, vector ) {

		if ( !options.boOptions ) {

			console.error( 'functionsFolder: call options = new Options( options ) first' );
			return;

		}
		const dat = three$1.dat,
			THREE = three$1.THREE,
			scales = options.scales;
		const _this = this;
		var boError = false,//true - обнаружена ошибка ввода. Нужно вывести сообщение об ошибке и вернуть фокус на поле управления
			boAlert = false;//предотвращает бесконечный вывод сообщения об ошибке

		//Localization

		const lang = {

			functions: 'Functions',

			defaultButton: 'Default',
			defaultTitle: 'Restore default functions.',

		};

		const _languageCode = options.getLanguageCode === undefined ? 'en'//Default language is English
			: options.getLanguageCode();

		switch ( _languageCode ) {

			case 'ru'://Russian language

				lang.functions = 'Функции';

				lang.defaultButton = 'Восстановить';
				lang.defaultTitle = 'Восстановить функции.';

				break;
			default://Custom language
				if ( ( options.lang === undefined ) || ( options.lang.languageCode != _languageCode ) )
					break;

				Object.keys( options.lang ).forEach( function ( key ) {

					if ( lang[key] === undefined )
						return;
					lang[key] = options.lang[key];

				} );

		}

		if ( vector ) {

			vector.x = getFuncText( vector.x );
			vector.y = getFuncText( vector.y );
			vector.z = getFuncText( vector.z );

		} else vector = { x: '', y: '', z: '', };

		const fFunctions = fParent.addFolder( lang.functions ),

			//onFinishChange вызывается даже если vector не изменился. Поэтому такой onFinishChange пропускается
			vectorCur = {

				x: vector.x,
				y: vector.y,
				z: vector.z,
				w: vector.w,

			},
			cFunctions = {};
		function createControl( axisName ) {

			if ( vector[axisName] === undefined )
				return;
			cFunctions[axisName] = fFunctions.add( vector, axisName ).onFinishChange( function ( value ) {

				__onFinishChange( value, axisName, vectorCur );

			} );
			dat.controllerNameAndTitle( cFunctions[axisName], getAxisName( axisName ) );

		}
		function getAxisName( axisName ) { return scales[axisName] && scales[axisName].name ? scales[axisName].name : axisName; }
		createControl( 'x' );
		createControl( 'y' );
		createControl( 'z' );
		createControl( 'w' );

		//Default scale button
		const buttonDefault = fFunctions.add( {

			defaultF: function ( value ) {

			},

		}, 'defaultF' );
		dat.controllerNameAndTitle( buttonDefault, lang.defaultButton, lang.defaultTitle );

		function getFuncText( func ) {

			if ( func === undefined )
				return;
			if ( typeof func === 'object' ) {

				if ( func instanceof THREE.Color ) return func.getStyle();
				if ( Array.isArray( func ) ) return JSON.stringify( func )
				func = func.func ? func.func : func;

			}
			const typeofFunc = typeof func;
			switch ( typeofFunc ) {

				case 'number':
					func = func.toString();//если это не делать будет создан NumberControllerBox, ктороый не позволяет вводить float
				case 'string':
					return func;
				case 'function':
					return func.toString().split( /return (.*)/ )[1];
				default: console.error( 'functionsFolder.getFuncText(...): typeof func = ' + typeofFunc );
					return;
			}

		}
		function __onFinishChange( value, axisName, vectorCur ) {

			if ( ( vectorCur[axisName] === value ) && !boError )
				return;
			try {

				boError = false;
				vectorCur[axisName] = value;
				var func;
				const typeofValue = typeof value;
				switch ( typeofValue ) {

					case 'string':

						var float = parseFloat( value );
						if ( float.toString() !== value ) {

							const color = value.replace( /\s/g, "" ).split( /rgb\((\d+),(\d+),(\d+)\)/ );
							if ( color.length === 5 ) func = new THREE.Color( value );
							else {

								var array;
								try {

									array = JSON.parse( value );

								} catch ( e ) { }
								if ( Array.isArray( array ) ) func = array;
								else {

									func = new Function( 't', 'a', 'b', 'return ' + value );

								}

							}

						} else func = float;
						break;

					case 'number':

						func = value;
						break;

					default:
						console.error( 'onFinishChange( ' + value + ' ): invalid type = ' + typeofValue );
						return;

				}

				//Новое значение введено правильно
				onFinishChange( func, axisName, value );
				boAlert = false;

			} catch ( e ) {

				if ( !boAlert ) {

					alert( 'Axis: ' + getAxisName( axisName ) + '. Function: "' + value + '". ' + e );
					boAlert = true;

				}
				_this.setFocus( axisName );

			}

		}

		/**
		 * set the function text
		 * @param {object} _vector vector of the axis functions.
		 * @param {object} _vector.x x axis function.
		 * @param {object} _vector.y y axis function.
		 * @param {object} _vector.z z axis function.
		 */
		this.setFunction = function ( _vector ) {

			_vector = _vector || options.vector;
			if ( !_vector )
				return;

			const vector = {

				x: _vector ? getFuncText( _vector.x ) : '',
				y: _vector ? getFuncText( _vector.y ) : '',
				z: _vector ? getFuncText( _vector.z ) : '',
				w: _vector ? getFuncText( _vector.w ) : '',

			},
				//onFinishChange вызывается даже если vector не изменился. Поэтому такой onFinishChange пропускается
				vectorCur = {

					x: vector.x,
					y: vector.y,
					z: vector.z,
					w: vector.w,

				};
			if ( !_vector.vectorDefault )
				_vector.vectorDefault = {

					x: vector.x,
					y: vector.y,
					z: vector.z,
					w: vector.w,

				};
			function setVectorAxis( axisName ) {

				if ( _vector[axisName] === undefined )
					return;
				cFunctions[axisName].__onFinishChange = function ( value ) {

					__onFinishChange( value, axisName, vectorCur );

				};
				vector[axisName] = getFuncText( _vector[axisName] );
				cFunctions[axisName].setValue( vector[axisName] );
				vectorCur[axisName] = vector[axisName];

			}
			setVectorAxis( 'x' );
			setVectorAxis( 'y' );
			var dislay = false;
			if ( _vector.z ) {

				setVectorAxis( 'z' );
				dislay = true;

			}
			buttonDefault.object.defaultF = function ( value ) {

				function setValue( axisName ) {

					if ( !cFunctions[axisName] )
						return;
					cFunctions[axisName].setValue( _vector.vectorDefault[axisName] );
					cFunctions[axisName].__onFinishChange( _vector.vectorDefault[axisName] );

				}
				setValue( 'x' );
				setValue( 'y' );
				setValue( 'z' );
				setValue( 'w' );

			};
			function dislayEl( controller, displayController ) {

				if ( controller === undefined )
					return;
				if ( typeof displayController === "boolean" )
					displayController = displayController ? 'block' : 'none';
				var el = controller.domElement;
				while ( el.tagName.toUpperCase() !== "LI" ) el = el.parentElement;
				el.style.display = displayController;

			}
			dislayEl( cFunctions.z, dislay );
			setVectorAxis( 'w' );

		};
		this.setFunction();

		/**
		 * Display functions folder
		 * @param {string|boolean} display 'block' or true - functions folder is visible.
		 * <p>'none' or false - functions folder is hide.</p>
		 */
		this.displayFolder = function ( display ) {

			fFunctions.domElement.style.display = typeof display === "boolean" ?
				display ? 'block' : 'none' :
				display;

		};
		/**
		* set focus to controller
		* @param {string} axisName Name of the axis of the controller
		*/
		this.setFocus = function ( axisName ) {

			cFunctions[axisName].domElement.childNodes[0].focus();
			boError = true;

		};
		/**
		* update the values of the controllers of the functions
		*/
		this.update = function ( newVector ) {

			function updateAxis( axisName ) {

				if ( cFunctions[axisName].getValue() === newVector[axisName] )
					return;
				cFunctions[axisName].setValue( newVector[axisName] );

			}
			updateAxis( 'x' );
			updateAxis( 'y' );
			updateAxis( 'z' );
			updateAxis( 'w' );

		};

	}

}

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

const none = 'none', block = 'block';

class GuiSelectPoint {

	/**
	 * @class A dat.gui based graphical user interface for select a point from the mesh.
	 * @param {Options} options See the <b>options</b> parameter of the <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
	 * @param {GUI} [options.dat.dat] [dat.GUI()]{@link https://github.com/dataarts/dat.gui}.
	 * @param {boolean|Object} [options.dat.guiSelectPoint] false - do not displays <b>GuiSelectPoint</b>.
	 * @param {Function} [options.dat.guiSelectPoint.point] Callback function to create custom controllers for each point of selected mesh with custom controllers.
	 * <pre>
	 * parameter <b>options</b> See <b>options</b> parameter of <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
	 * parameter <b>dat</b> [dat.GUI()]{@link https://github.com/dataarts/dat.gui}.
	 * parameter <b>fParent</b> parent folder.
	 * example <b>point: function ( options, dat, fMesh ) { return new FermatSpiral.gui( options, dat, fMesh ); },</b>
	 * </pre>
	 * @param {boolean} [options.dat.guiSelectPoint.boDisplayVerticeID] true - display on the scene the point ID near to the point.
	 * @param {AxesHelper} [options.axesHelper] An axis object to visualize axes.
	 * See <a href="../../AxesHelper/jsdoc/index.html" target="_blank">AxesHelper</a>.
	 * @param {Function} [options.getLanguageCode=language code of your browser] Your custom getLanguageCode() function.
	 * <pre>
	 * returns the "primary language" subtag of the language version of the browser.
	 * Examples: "en" - English language, "ru" Russian.
	 * See the "Syntax" paragraph of RFC 4646 {@link https://tools.ietf.org/html/rfc4646#section-2.1|rfc4646 2.1 Syntax} for details.
	 * You can import { getLanguageCode } from '../../commonNodeJS/master/lang.js';
	 * </pre>
	 * @param {object} [options.lang] Object with localized language values
	 * @param {object} [guiParams={}] Followed parameters is allowed.
	 * @param {object} [guiParams.cameraTarget] camera looking at selected point during playing. See the <b>cameraTarget</b> parameter of the <a href="../../player/jsdoc/module-Player-Player.cameraTarget.html#init" target="_blank">Player.cameraTarget.init(...)</a> function for details.
	 * @param {THREE.PerspectiveCamera} guiParams.cameraTarget.camera [PerspectiveCamera]{@link https://threejs.org/docs/index.html#api/en/cameras/PerspectiveCamera}.
	 * @param {Function} [guiParams.pointControls] pointControls( fPoint, dislayEl, getMesh ) Adds the trace "Display the trace of the point movement" control checkbox into gui.
	 * <pre>
	 * fPoint - parent folder for new control.
	 * dislayEl( conrtol, true or false ) - function for dislay or hide of the control.
	 * getMesh() returns the mesh, selected in the GuiSelectPoint.
	 * Default is undefined.
	 * </pre>
	 * @param {Function} [guiParams.pointsControls] pointsControls( fPoints, dislayEl, getMesh ) Adds the trace "Display the trace of the movement of all points of the mesh." control checkbox into gui.
	 * <pre>
	 * fPoints - parent folder for new control.
	 * dislayEl( conrtol, true or false ) - function for dislay or hide of the control.
	 * getMesh() returns the mesh, selected in the GuiSelectPoint.
	 * Default is undefined.
	 * </pre>
	 * @param {Function} [guiParams.setIntersection] setIntersection( intersection ) sets the intersection value of myThreejs. Default is undefined
	 * @example
	import GuiSelectPoint from 'https://raw.githack.com/anhr/commonNodeJS/master/guiSelectPoint/guiSelectPoint.js';

	new GuiSelectPoint( options );
	options.guiSelectPoint.add();
	options.guiSelectPoint.addMesh( points );
	 */
	constructor( options, guiParams = {} ) {

		const guiSelectPoint = this, THREE = three$1.THREE, folders = {};

		if ( !options.boOptions ) {

			console.error( 'GuiSelectPoint: call options = new Options( options ) first' );
			return;

		}
		if ( ( options.dat.guiSelectPoint === false ) || !options.dat.gui ) {

			//заменяем все функции на пустышки
			this.add = function ( gui ) { };
			this.addMesh = function ( points ) { };
			this.select = function ( intersect ) { };
			return;

		}

		const dat = three$1.dat;//options.dat.dat;

		//Player changes the guiSelectPoint control's values during playing
		options.guiSelectPoint = guiSelectPoint;

		var cFrustumPoints;

		//Localization

		const getLanguageCode = options.getLanguageCode;

		const lang = {

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

			moveGroup: 'Move Scene',

		};

		const _languageCode = getLanguageCode();

		switch ( _languageCode ) {

			case 'ru'://Russian language

				lang.meshs = '3D объекты';
				lang.notSelected = 'Не выбран';
				lang.select = 'Выбрать';
				lang.position = 'Позиция';
				lang.rotation = 'Вращение';
				lang.points = 'Точки';

				lang.displayVerticeID = 'Номера точек';
				lang.displayVerticeIDTitle = 'На сцене возле каждой точки показать ее идентификатор';

				lang.cameraTarget = 'Следить';
				lang.cameraTargetTitle = 'Выберите эту точку, за которой следит камера.',

				lang.point = 'Локальная позиция точки';
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

		}

		var f3DObjects, fPoint, cRestoreDefaultLocalPosition, fPointWorld, fPoints, cMeshs, fMesh,// mesh,
			intersection,
			cScaleX, cScaleY, cScaleZ,
			cPoints, selectedPointIndex = -1,
			cX, cY, cZ, cW, cTrace, cTraceAll, cColor, cOpacity, cCameraTarget,
			funcFolder,
			boSetMesh = false,//Для предотвращения лишних вызовов exposePosition если выбрать точку и передвинуть камеру с помошью OrbitControls,
			fRotation,
			cCustom;//Custom point controllers
		const _this = this, cPosition = new THREE.Vector3(), cRotations = new THREE.Vector3(), cWorld = new THREE.Vector3();
		function displayPointControllers( display ) {

			fPointWorld.domElement.style.display = display;
			fPoint.domElement.style.display = display;
			if ( cCameraTarget ) {

				const mesh = getMesh();
				cCameraTarget.domElement.parentElement.parentElement.style.display = mesh && mesh.userData.boFrustumPoints ?
					'none' ://Камера не может следить за frustumPoints
					display;

			}

		}
		if ( options.frustumPoints )
			cFrustumPoints = new options.frustumPoints.guiSelectPoint();
		//сейчас exposePosition вызывается только один раз из this.setMesh
		function getLiEl(controller) {

			var el = controller.domElement;
			while (el.tagName.toUpperCase() !== "LI") el = el.parentElement;
			return el;

		}

		//dislay element

		function dislayEl( controller, displayController ) {

			if ( controller === undefined )
				return;
			if ( typeof displayController === "boolean" )
				displayController = displayController ? 'block' : 'none';
			else if ( displayController === undefined )
				displayController = 'none';
			else if ( typeof displayController !== "string" )
				displayController = 'block';
			getLiEl(controller).style.display = displayController;

		}
		function isDislayEl( controller ) {

			if ( controller === undefined )
				return;
			return getLiEl(controller).style.display === none ? false : true;

		}

		//readOnly controller

		const getInputEl =  ( controller ) => { return controller ? controller.domElement.querySelector( 'input' ) : undefined; },
			readOnlyEl = ( controller, boReadOnly ) => {

			const element = getInputEl( controller );
			if ( element ) element.readOnly = boReadOnly;
		
		},
			isReadOnlyEl = ( controller ) => {
			
			const element = getInputEl( controller );
			if ( element ) return element.readOnly;
		
		},
			isReadOnlyController = (controller) => {

			if (controller.boSetValue) return true;
			if (isReadOnlyEl(controller)) {

				if (controller.getValue() !== controller.initialValue) {

					if (controller.boSetValue === undefined) {

						controller.boSetValue = true;
						setValue(controller, controller.initialValue);
						controller.boSetValue = undefined;
						controller.initialValue = controller.getValue();//Эта строка нужна в случае когда новое зачения невозможно установиь точно таким же, как initialValue
						//Иначе перепонится стек

					}

				}
				return true;

			}
			return false;

		};

		function exposePosition( selectedPointIndex ) {

			if ( selectedPointIndex === undefined )
				selectedPointIndex = guiSelectPoint.getSelectedPointIndex();//Эта строка слишком медленно выполняется если число точек frustumPoints велико
			//Поэтому selectedPointIndex беру из intersection.index индекс точки, над которй щелнул мышью
			if ( selectedPointIndex === -1 )
				return;

			const mesh = cMeshs.__select.options[cMeshs.__select.options.selectedIndex].mesh,
				position = getObjectPosition( mesh, selectedPointIndex );

			if ( ( options.axesHelper !== undefined ) )

				// && ( ( mesh.userData.isInfo === undefined ) || ( mesh.userData.isInfo() ) ) )
				//если делать эту проверку, то будут неправильно отображаться пунктирные линии для frustumPoints точки
				//когда в настройках frustumPoints не стоит галочка info
				//когда в gui пользователь выбрал точку frustumPoints из списка '3D objects'(этот пункт будет недоступен когда я уберу frustumPoints из списка '3D objects' когда в настройках frustumPoints не стоит галочка info)
				//и когда пользователь передвигает камеру с помощью orbitControls

				if ( ( options.axesHelper !== false ) && ( options.axesHelper !== undefined ) )
					options.axesHelper.exposePosition( { object: mesh, index: selectedPointIndex } );

			if ( cWorld.x ) cWorld.x.setValue( position.x );
			if ( cWorld.y ) cWorld.y.setValue( position.y );
			if ( cWorld.z ) cWorld.z.setValue( position.z );

			//Возможно не надо делать такую глубокую проверку. Не тестировал
			if(
				mesh.userData.player &&
				mesh.userData.player.arrayFuncs
			) {

				const selectedPoint = mesh.userData.player.arrayFuncs[mesh.userData.myObject.guiPoints.seletedIndex(selectedPointIndex)];
				if(
					selectedPoint &&
					selectedPoint.controllers
				) {
					
					const controllers = mesh.userData.player.arrayFuncs[selectedPointIndex].controllers;
					if ( controllers.x && controllers.x.controller ) controllers.x.controller.value = position.x;
					if ( controllers.y && controllers.y.controller ) controllers.y.controller.value = position.y;
					if ( controllers.z && controllers.z.controller ) controllers.z.controller.value = position.z;
				}

			}

		}
		this.exposePosition = exposePosition;
		function setValue( controller, v ) {

			if ( !controller )
				return;
			const input = getInputEl( controller ),//controller.domElement.querySelector( 'input' ),
				readOnly = input.readOnly;
			input.readOnly = false;
			controller.object[controller.property] = v;
			if ( controller.__onChange )
				controller.__onChange.call( controller, v );
			controller.initialValue = v;
			controller.updateDisplay();
			input.readOnly = readOnly;
			return controller;

		}
		var wLimitsDefault;
		/**
		 * Sets local position controllers to read-only
		 * @param {boolean} boReadOnly true is read-only
		 */
		this.setReadOnlyPosition = function ( boReadOnly ) {

			readOnlyEl( cX, boReadOnly );
			readOnlyEl( cY, boReadOnly );
			readOnlyEl( cZ, boReadOnly );
			readOnlyEl( cW, boReadOnly );

		};
		function setPosition(intersectionSelected) {

			const player = intersectionSelected.object.userData.player;

			var boDisplayFuncFolder = 'none';
			if (player && player.arrayFuncs) {

				const mesh = getMesh();
				funcFolder.setFunction(player.arrayFuncs[mesh.userData.myObject.guiPoints.seletedIndex(intersectionSelected.index)]);
				boDisplayFuncFolder = 'block';

			}
			funcFolder.displayFolder(boDisplayFuncFolder);
			/*Для установки cCameraTarget после выбора точки. Если это оставить то неправильно учтанавливается галочка cCameraTarget если:
			1 устанвить cCameraTarget для выбранной точки
			2 запустить плеер
			3 уброать cCameraTarget
			4 запустить плеер. Снова установиться cCameraTarget
			*/
			if (cCameraTarget) {

				options.playerOptions.cameraTarget.changeTarget(intersectionSelected.object, intersectionSelected.index);
				cCameraTarget.updateDisplay();

			}

			const positionLocal = _this.getObjectLocalPosition(intersectionSelected);
			setValue(cX, positionLocal.x);
			setValue(cY, positionLocal.y);
			setValue(cZ, positionLocal.z);

			const gui = intersectionSelected.object.userData.gui;
			if (gui) intersectionSelected.index = gui.hyperSphere.searchNearestEdgeVerticeId(intersectionSelected.index, intersectionSelected);
			const intersectionSelectedIndex = intersectionSelected.index;
			if (intersectionSelected.object.userData.gui) {

				const guiPoints = intersectionSelected.object.userData.myObject.guiPoints;
				guiPoints.getVerticeId(intersectionSelectedIndex);
				gui.setValues(intersectionSelectedIndex, guiPoints.timeAngles);

			}

			const position = _this.getObjectPosition(intersectionSelected.object, intersectionSelected.index);
			setValue(cWorld.x, position.x);
			setValue(cWorld.y, position.y);
			setValue(cWorld.z, position.z);

			var displayControllerW, displayControllerColor;//, displayControllerOpacity;
			if (intersection.object.userData.player && (typeof intersection.object.userData.player.arrayFuncs === "function")) ;
			const func = player && player.arrayFuncs ? 
					player.arrayFuncs.intersection ?
						player.arrayFuncs.intersection(intersectionSelected.index) :
						player.arrayFuncs[intersectionSelected.index] :
					undefined,
				attributes = intersectionSelected.object.geometry.attributes;
			if (!attributes.color) {

				displayControllerW = none;
				displayControllerColor = none;

			} else {

				const setColorControl = (color) => {
					
					const strColor = '#' + color.getHexString();
					//Сначала надо установить initialValue потому что для FrustumPoints я устанвил readOnly для cColor.
					//В этом случае я не могу отобразить цвет следующей точки FrustumPoints потому что в режиме readOnly
					//при изменении цвета восстанвливается старый цвет из initialValue.
					cColor.initialValue = strColor;
					cColor.userData = { intersection: intersectionSelected, };
					cColor.setValue(strColor);
					
				};
				if (attributes.position.itemSize < 4) {

					if (
						intersectionSelected.object.material.vertexColors === true ||
						(intersectionSelected.object.material instanceof THREE.ShaderMaterial === true)
					) {
						
						displayControllerW = none;
						displayControllerColor = block;
						setColorControl( new THREE.Color().fromBufferAttribute(attributes.color, intersectionSelected.index) );

					}
					
				} else {

					function isWObject() { return (typeof func.w === 'object') && (func.w instanceof THREE.Color === false); }
					const mesh = getMesh(), verticeColor = mesh.userData.myObject ?
						mesh.userData.myObject.verticeColor(intersectionSelectedIndex) :
						undefined;
					var color = (func === undefined) || (!attributes.color && !attributes.ca) ?
						undefined :
						Array.isArray(func.w) || (typeof func.w === "function") ?
							Player$2.execFunc(func, 'w', options.time, options) :
							isWObject() ?
								Player$2.execFunc(func.w, 'func', options.time, options) :
								typeof func.w === "string" ?
									Player$2.execFunc(func, 'w', options.time, options) :
									verticeColor != undefined ?
										verticeColor :
										func.w;
					if (Array.isArray(color)) color = new THREE.Color(color[0], color[1], color[2]);
					if (color instanceof THREE.Color) {

						displayControllerW = none;
						displayControllerColor = block;

						//color
						if (intersectionSelected.object.userData.player.arrayFuncs === undefined) {

							displayControllerColor = none;

						} else {

							setColorControl(color);
							cOpacity.userData = { intersection: intersectionSelected, };

						}

					} else {

						if ( cW === undefined )
							displayControllerW = none;
						else {

							if ( color === undefined )
								displayControllerW = none;
							else {
								
								if ( options.scales.w.isColor != false ) {

									if (!wLimitsDefault) {
	
										wLimitsDefault = {
	
											min: cW.__min,
											max: cW.__max,
	
										};
	
									}
									if (isWObject()) {
	
										cW.min(func.w.min !== 'undefined' ? func.w.min : wLimitsDefault.min);
										cW.max(func.w.max !== 'undefined' ? func.w.max : wLimitsDefault.max);
										if ((cW.__min !== 'undefined') && (cW.__max !== 'undefined'))
											cW.step((cW.__max - cW.__min) / 100);
	
									} else {
	
										cW.min(wLimitsDefault.min);
										cW.max(wLimitsDefault.max);
	
									}

								}
								setValue(cW, color);
								displayControllerW = block;

							}

						}
						displayControllerColor = none;

					}

				}

			}
			dislayEl( cW, displayControllerW );
			dislayEl( cColor, displayControllerColor );

			const mesh = getMesh(), boReadOnly = intersectionSelected.object.userData.boFrustumPoints === true ? true : mesh.userData.gui && mesh.userData.gui.isLocalPositionReadOnly ? true : false,
				attributeColor = mesh.geometry.attributes.color,
				boOpacity = attributeColor ?
					(
						( attributeColor.itemSize === 4 ) &&
							(
								( mesh.userData.myObject && mesh.userData.myObject.isOpacity ) ||
								( mesh.material.transparent && mesh.material.vertexColors )
							)
					) :
					false;
			dislayEl( cOpacity, boOpacity ? block : none );
			if ( boOpacity ) {

				if ( attributeColor.itemSize != 4 ) console.error( 'GuiSelectPoint.setPosition: Invalid mesh.geometry.attributes.color.itemSize = ' + attributeColor.itemSize);
				cOpacity.initialValue = attributeColor.array[intersectionSelected.index * attributeColor.itemSize + 3];
				cOpacity.setValue( cOpacity.initialValue );

			}
			_this.setReadOnlyPosition(boReadOnly);
			readOnlyEl( cColor, boReadOnly );
			readOnlyEl( cOpacity, boReadOnly );
			funcFolder.displayFolder( !boReadOnly );

		}
		/**
		 * Specify a maximum, minimum and step value for [NumberController]{@link https://github.com/dataarts/dat.gui/blob/master/API.md#NumberController}.
		 * 
		 * @param {String} axis axis. Currently 'w' axis is available only.
		 * @param {object} scale The following <b>NumberController</b> properties are available:
		 * @param {object} [scale.min] Minimum allowed value.
		 * @param {object} [scale.max] Maximum allowed value.
		 * @param {object} [scale.step] Increment by which to change value.
		 */
		this.setAxisControl = function ( axis, scale ) {

			switch( axis ) {

				case 'w': 
					if ( scale.min != undefined ) cW.min(scale.min);
					if ( scale.max != undefined ) cW.max(scale.max);
					if ( scale.step != undefined ) cW.step(scale.step);
					break;
				default: console.error( 'GuiSelectPoint.setAxisControl. Invalid axis: '  + axis);
					
			}
			
		};
		/**
		 * sets axis name of the controllers
		 * @param {String} axis axis. 'x' or 'y' or 'z'.
		 * @param {String} name new axis name
		 */
		this.setAxisName = function ( axis, name ) {

			//position
			cPosition[axis].name( name );
			folders.position[axis].name = name;

			//scale
			const cScale = axis === 'x' ? cScaleX : axis === 'y' ? cScaleY : axis === 'z' ? cScaleZ : undefined;
			cScale.name( name );

			//rotation
			const cRotation = cRotations[axis];
			if ( cRotation.name ) cRotation.name( name );

		};
		/**Sets controllers to position, scale and rotation of the mesh.  If AxesHelper is exist, expose the mesh to the axes. */
		this.setMesh = function () {

			boSetMesh = true;
			setScaleControllers();
			setPositionControllers();
			setRotationControllers();
			exposePosition();
			boSetMesh = false;

		};
		/**
		 * Sets controllers to position, scale and rotation of the mesh.  If AxesHelper is exist, expose the mesh to the axes.
		 * @param intersectionSelected [THREE.Raycaster.intersectObject]{@link https://threejs.org/docs/index.html#api/en/core/Raycaster.intersectObject}
		 */
		this.setPosition = function ( intersectionSelected ) {

			for ( var i = 0; i < cMeshs.__select.length; i++ ) {

				var option = cMeshs.__select[i];
				if ( option.selected && Object.is( option.mesh, intersectionSelected.object ) ) setPosition( intersectionSelected );

			}

		};
		/**
		 * update the values of the controllers of the world position
		 */
		this.update = function ( boSetInitialValue = false ) {

			const selectedItem = cMeshs.__select.options[cMeshs.__select.options.selectedIndex];
			if ( !selectedItem ) return;
			const mesh = selectedItem.mesh;
			if ( !mesh ) return;
			const index = this.getSelectedPointIndex();
			if ( index === -1 ) return;
			const position = getObjectPosition( mesh, index );
			if( cWorld.x ) cWorld.x.setValue( position.x );
			if( cWorld.y ) cWorld.y.setValue( position.y );
			if( cWorld.z ) cWorld.z.setValue( position.z );
			if( cW && ( position instanceof THREE.Vector4 )) cW.setValue( position.w );

			const positionLocal = getObjectLocalPosition( mesh, index );
			if ( boSetInitialValue ) {
				
				if( cX ) cX.initialValue = positionLocal.x;
				if( cY ) cY.initialValue = positionLocal.y;
				if( cZ ) cZ.initialValue = positionLocal.z;
				if( cW ) cW.initialValue = positionLocal.w;
				
			}
			if( cX ) cX.setValue( positionLocal.x );
			if( cY ) cY.setValue( positionLocal.y );
			if( cZ ) cZ.setValue( positionLocal.z );

			funcFolder.update( mesh.userData.player.arrayFuncs[index] );

		};
		/**
		 * get index of the mesh in the cMeshs controller
		 * @param {THREE.Mesh} mesh [Mech]{@link https://threejs.org/docs/index.html#api/en/objects/Mesh}
		 * @returns index of selectred mesh.
		 */
		this.getMeshIndex = function ( mesh ) {

			if ( mesh === undefined )
				return mesh;
			var index;// = intersectionSelected.object.userData.index;
			for ( index = 0; index < cMeshs.__select.options.length; index++ ) {

				var option = cMeshs.__select.options[index];
				if ( Object.is( option.mesh, mesh ) )
					return index;

			}
			//Сюда попадает когда Mesh проверяется с помощью THREE.Raycaster находится ли он под мышью, но этот Mesh не внесен в список GuiSelectPoint

		};
		/**
		 * Set a mesh in the mesh's list control
		 * @param {number} index index of the mesh in the mesh's list control
		 * @param {THREE.Mesh} mesh new [Mech]{@link https://threejs.org/docs/index.html#api/en/objects/Mesh}
		 */
		this.setIndexMesh = function ( index, mesh ) {

			if ( index === undefined )
				return;
			cMeshs.__select.options[index].mesh = mesh;
			this.selectPoint( -1 );

		};
		/**
		 * Selects a point in the points list control
		 * @param {number} index index of the point in the points list control
		 */
		this.selectPoint = function ( index ) {

			cPoints.__onChange( index );
			cPoints.__select[index + 1].selected = true;

		};
		/**
		 * Removes a mesh from the select point GUI
		 * @param {THREE.Mesh} mesh [Mech]{@link https://threejs.org/docs/index.html#api/en/objects/Mesh} for removing.
		 * @param {boolean} [boHideF3DObjects=true] true - hide the 'Meshes' folder if no any mesh exists in the meshs dropdown menu.
		 */
		this.removeMesh = function ( mesh, boHideF3DObjects = true ) {

			const index = this.getMeshIndex( mesh ),
				selectedIndex = cMeshs.__select.selectedIndex;
			if ( index === undefined ) return;
			cMeshs.__select.remove( index );
			if ( selectedIndex === index ) {

				cPoints.__onChange( -1 );
				_this.removePoints();
				cMeshs.__onChange( -1 );

			}

			if ( ( cMeshs.__select.options.length < 2 ) && boHideF3DObjects ) f3DObjects.domElement.style.display = 'none';

		};

		const arrayMeshs = [];//сюда попадают все mesh в случае, когда this.addMesh вызывается до вызова this.add
		//тоесть когда GuiSelectPoint еще не добавлен в dat.gui

		/**
		 * Adds new mesh into select point GUI
		 * @param {THREE.Mesh} mesh new [Mech]{@link https://threejs.org/docs/index.html#api/en/objects/Mesh}.
		 */
		this.addMesh = function ( mesh ) {

			if ( !mesh.parent ) {

				console.error( 'GuiSelectPoint.addMesh: Add mesh into scene first.' );
				return;

			}

			//mesh.userData.myObject ||= uncompatible with myThree.js → ./build/myThree.js, ./ build / myThree.module.js...
			if (!mesh.userData.myObject) mesh.userData.myObject = {

				verticeColor: () => {},
				verticeOpacity: () => {},
				
			};
			//mesh.userData.myObject.guiPoints ||= uncompatible with myThree.js → ./build/myThree.js, ./ build / myThree.module.js...
			if (!mesh.userData.myObject.guiPoints) mesh.userData.myObject.guiPoints = {

				seletedIndex: (guiIndexStr) => { return guiIndexStr; },
				setControllers: (index) => {},
				getPositionId: (index) => { return index; },
				getVerticeId: (index) => { return index; },
				create: (fPoints, cPoints, cTrace, cTraceAll, count) => {

					for ( var iPosition = mesh.geometry.drawRange.start; iPosition < count; iPosition++ ) {
		
						const opt = document.createElement( 'option' ),
							name = mesh.userData.player && mesh.userData.player.arrayFuncs ? mesh.userData.player.arrayFuncs[iPosition].name : '';
						opt.innerHTML = iPosition + ( name === undefined ? '' : ' ' + name );
						opt.setAttribute( 'value', iPosition );//Эта строка нужна в случае когда пользователь отменил выбор точки. Иначе при движении камеры будут появляться пунктирные линии, указвающие на несуществующую точку
						cPoints.__select.appendChild( opt );
		
					}
					
				},
				getValue: (cPoints) => { return cPoints.__select.selectedOptions[0].index - 1; },
				onChangeAngle: (verticeId, angleId, angle) => { }
				
			};

			if ( !f3DObjects ) this.add();
			f3DObjects.domElement.style.display = 'block';
			
			if ( !cMeshs ) {

				//Test for duplicate item
				for ( var i = 0; i < arrayMeshs.length; i++ ) {

					if ( arrayMeshs[i].uuid === mesh.uuid ) {

						console.error( 'guiSelectPoint.addMesh: Duplicate mesh: ' + mesh.name );
						return;

					}

				}

				arrayMeshs.push( mesh );
				return;

			}

			//Test for duplicate item
			for ( var i = 0; i < cMeshs.__select.options.length; i++ ) {

				var option = cMeshs.__select.options[i];
				if ( mesh.userData.boFrustumPoints && ( option.mesh !== undefined ) && option.mesh.userData.boFrustumPoints )
					return;//duplicate FrustumPoints. Сюда попадает когда пользователь меняет количество слоев или Y точек в FrustumPoints.
				if (
					( option.mesh !== undefined ) &&
					( option.mesh.uuid === mesh.uuid )
				) {

					console.error( 'guiSelectPoint.addMesh(...): Duplicate mesh.' );
					return;

				}

			}
			const opt = document.createElement( 'option' );
			opt.innerHTML = cMeshs.__select.length + ' ' + ( mesh.name === '' ? mesh.constructor.name : mesh.name );
			opt.mesh = mesh;
			mesh.userData.default = mesh.userData.default || {

				scale: new THREE.Vector3().copy( mesh.scale ),
				position: mesh.position instanceof THREE.Vector3 ?
					new THREE.Vector3().copy( mesh.position ) :
					mesh.position instanceof THREE.Vector4 ? new THREE.Vector4().copy( mesh.position ) : undefined,
				rotation: new THREE.Euler().copy( mesh.rotation ),

			};
			cMeshs.__select.appendChild( opt );
			displayVerticeID( mesh );

		};
		this.getObjectLocalPosition = (intersectionSelected) => { return getObjectLocalPosition( intersectionSelected.object, intersectionSelected.index ); };
		this.getObjectPosition = (object, index) => { return getObjectPosition( object, index); };
		/**
		 * User has selected a point
		 * @param {Object} intersectionSelected See [intersectObject]{@link https://threejs.org/docs/index.html#api/en/core/Raycaster.intersectObject}
		 */
		this.select = function ( intersectionSelected ) {

			intersection = undefined;
			let intersectionSelectedIndex = intersectionSelected.index;
			if ( (intersectionSelectedIndex === undefined) || isNaN( intersectionSelectedIndex ) ) {

				//Пользователь нажал мышкой на LineSegments
				const geometryIndex = intersectionSelected.object.geometry.index;
				intersectionSelectedIndex =  geometryIndex.getX(intersectionSelected.indexNew);
				intersectionSelected.object.userData.myObject.guiPoints.verticeId = intersectionSelectedIndex;
				intersectionSelected.index = intersectionSelectedIndex;

			}
			const myObject = intersectionSelected.object.userData.myObject;
			if ( !myObject.getPositionData ) 
				myObject.getPositionData = ( index ) => { return { verticeId: index, positionId: index * intersectionSelected.object.geometry.attributes.position.itemSize } };

			//f3DObjects.close();//если тут не закрывать папку, то ингода прорпадает скроллинг окна dat.GUI
			//for testing:
			//Open https://raw.githack.com/anhr/myThreejs/master/Examples/html/
			//Set browser window height about 500 pixels.
			//Click Full Screen button.
			//Open Controls
			//Click a point.The "Meshes" folder opens and you can see the scrolling of the dat.gui window.

			//select mesh
			const index = this.getMeshIndex( intersectionSelected.object );
			if ( !index )
				return;//Сюда попадает когда Mesh проверяется с помощью THREE.Raycaster находится ли он под мышью, но этот Mesh не внесен в список GuiSelectPoint
			if ( cMeshs.__select[index].selected === false ) {

				cMeshs.__select[index].selected = true;
				cMeshs.__onChange( index - 1, intersectionSelected );

			} else {

				if (myObject.guiPoints.setIntersection) myObject.guiPoints.setIntersection(intersectionSelected);
				if (myObject.guiPoints.changeControllers) myObject.guiPoints.changeControllers();
				
				if ( cCustom ) {

					const mesh = getMesh();
					cCustom.object(intersectionSelected.event && intersectionSelected.event.button === 0 ?
							mesh :
							undefined,//Пользователь нажал не левую кнопку мыши. Надо восстановить выбранный nD объект
						dat, options);

				}

			}

			this.selectPoint2 = function ( selectedMesh ) {

				//сделал эту проверку потому что не могу придумать как удалить intersectionSelectedIndex когда пользователь вручную сменил mesh
				if ( ( selectedMesh !== undefined ) && !Object.is( intersectionSelected.object, selectedMesh ) )
					return;//Сначала пользователь выбрал точку с помошщью мыши
				//Потом сменил Meshes/Select

				if ( !intersectionSelected.object.userData.boFrustumPoints ) {

					//fPoints.open();много времени на открытие когда много точек
					const myObject = intersectionSelected.object.userData.myObject, guiPoints = myObject ? myObject.guiPoints : undefined, verticeId = guiPoints ? guiPoints.verticeId : undefined,
						point = cPoints.__select[(verticeId? verticeId : intersectionSelectedIndex) + 1];
					if ( point ) point.selected = true;

				} else {//FrustumPoints

					cFrustumPoints.pointIndexes( intersectionSelected.object.userData.pointIndexes( intersectionSelectedIndex ) );

				}
				const block = 'block';
				displayPointControllers( block );
				intersection = intersectionSelected;
				if ( guiParams.setIntersection )
					guiParams.setIntersection( intersectionSelected );
				setPosition( intersectionSelected );

				const mesh = getMesh(), arrayFuncs = mesh.userData.player.arrayFuncs,
					line = !mesh.userData.player ||
						( mesh.userData.player.arrayFuncs === undefined ) ||
						( typeof intersection.object.userData.player.arrayFuncs === "function" ) ?
						undefined :
						intersectionSelectedIndex != undefined ?
							( arrayFuncs.intersection ? arrayFuncs.intersection( intersectionSelectedIndex ) : arrayFuncs[intersectionSelectedIndex] ).line ://You can not trace points if you do not defined the mesh.userData.player.arrayFuncs
							undefined;
				if ( cTrace )
					cTrace.setValue( ( line === undefined ) ?
						false : line.isVisible() );

				cRestoreDefaultLocalPosition.domElement.parentElement.parentElement.style.display =
					!intersection.object.userData.player || ( intersection.object.userData.player.arrayFuncs === undefined ) ?
						'none' : block;

			};
			this.selectPoint2( undefined );

		};
		/**
		 * Is mesh selected in the GuiSelectPoint?
		 * @param {THREE.Mesh} meshCur [Mech]{@link https://threejs.org/docs/index.html#api/en/objects/Mesh} to be tested
		 * @returns true if <b>meshCur</b> is selected.
		 */
		this.isSelectedMesh = function ( meshCur ) { return getMesh() === meshCur };
		/**
		 * @returns index of the selected point or -1 if point is not selected.
		 */
		this.getSelectedPointIndexShort = () => { return cPoints.__select.selectedIndex - 1 };
		/**
		 * @returns index of the selected point or -1 if mesh is not selected or if point is not selected.
		 */
		this.getSelectedPointIndex = function () {

			if ( ( cFrustumPoints !== undefined ) &&
				cFrustumPoints.isDisplay() &&//FrustumPoints folder is visible
				options.frustumPoints &&
				options.frustumPoints.isDisplay()//The cDisplay checkbox of the frustumPoints' is checked
			) {

				var selectedIndex = cFrustumPoints.getSelectedIndex();
				return selectedIndex === null ? - 1 : selectedIndex;

			}
			if ( cPoints === undefined ) {
				return selectedPointIndex;//options.dat !== true and gui === undefined. Do not use dat.gui

			}
			const mesh = getMesh();
			if ( !mesh ) return -1; //не выбран 3d объект.
			return mesh.userData.myObject.guiPoints.getValue(cPoints);

		};
		function getMesh() {

			if ( !cMeshs ) {

				console.error( 'GuiSelectPoint().getSelectedPointIndex().getMesh(): call GuiSelectPoint.add(); first.' );
				return undefined;

			}
			const selectedIndex = cMeshs.__select.options.selectedIndex;
			if ( selectedIndex !== -1 )
				return cMeshs.__select.options[cMeshs.__select.options.selectedIndex].mesh;
			return undefined;

		}
		function isNotSetControllers() {

			return ( getMesh() === undefined );

		}
		function setScaleControllers() {

			if ( isNotSetControllers() )
				return;
			const mesh = getMesh();
			if ( cScaleX ) cScaleX.setValue( mesh.scale.x );
			if ( cScaleY ) cScaleY.setValue( mesh.scale.y );
			if ( cScaleZ ) cScaleZ.setValue( mesh.scale.z );

		}
		function setPositionControllers() {

			if ( isNotSetControllers() )
				return;
			const mesh = getMesh();
			if ( cPosition.x ) cPosition.x.setValue( mesh.position.x );
			if ( cPosition.y ) cPosition.y.setValue( mesh.position.y );
			if ( cPosition.z ) cPosition.z.setValue( mesh.position.z );

		}
		function setRotationControllers() {

			if ( isNotSetControllers() )
				return;
			const mesh = getMesh();
			const setValue = ( controller, angle ) => {

				if ( ( angle < controller.__min ) || ( angle > controller.__max ) ) console.error( 'GuiSelectPoint.setRotationControllers(): Invalid angle = ' + angle + ' range. Available range from ' + controller.__min + ' to ' + controller.__max );
				controller.setValue( angle );
				
			};
			if ( cRotations.x ) setValue( cRotations.x, mesh.rotation.x );
			if ( cRotations.y ) setValue( cRotations.y, mesh.rotation.y );
			if ( cRotations.z ) setValue( cRotations.z, mesh.rotation.z );

		}
		function visibleTraceLine( intersection, value, getMesh ) {

			if ( !intersection || !intersection.object.userData.player || intersection.object.userData.player.arrayFuncs === undefined )
				return;
			const arrayFuncs = intersection.object.userData.player.arrayFuncs;
			var index = intersection.index || 0,
				point = arrayFuncs.intersection ? arrayFuncs.intersection(index) : arrayFuncs[index],
				line = point === undefined ? undefined : point.line;
			if ( ( line !== undefined ) )
				line.visible( value );
			if ( !value )
				return;
			if ( point.line !== undefined )
				return;
			point.line = new Player$2.traceLine( options );

			//color
			var color = intersection.object.geometry.attributes.color;
			if ( color === undefined )
				color = new THREE.Color( 0xffffff );//white
			else {

				var vector = new THREE.Vector3().fromArray( color.array, index * color.itemSize );
				color = new THREE.Color( vector.x, vector.y, vector.z );

			}

			point.line.addPoint(

				getMesh(), index,
				color

			);

		}

		this.updateScale = function ( axisName ) {

			const none = 'none', block = 'block', display = options.scales[axisName].isAxis() ? block : none;
			
			//Rotation

			const boX = options.scales['x'].isAxis(),
				 boY = options.scales['y'].isAxis(),
				 boZ = options.scales['z'].isAxis();
			var n = 0;//space dimension
			if ( boX ) n++;
			if ( boY ) n++;
			if ( boZ ) n++;
			switch ( n ) {

				case 1:
					if ( fRotation ) fRotation.domElement.style.display = none;
					break;
				case 2:
					fRotation.domElement.style.display = block;
					if ( boX && cRotations.x.domElement ) cRotations.x.domElement.parentElement.parentElement.style.display = none;
					if ( boY && cRotations.y.domElement ) cRotations.y.domElement.parentElement.parentElement.style.display = none;
					if ( boZ && cRotations.z.domElement ) cRotations.z.domElement.parentElement.parentElement.style.display = none;
					break;
				default: console.error( 'GuiSelectPoint.updateScale: Invalid space dimension = ' + n );
					return;

			}
			
			if ( !folders.position[axisName] ) {

				if ( options.scales[axisName].isAxis() ) console.error( 'GuiSelectPoint.updateScale: Under constraction.' );
				return;

			}
			
			//position

			folders.position[axisName].domElement.style.display = display;
			cWorld[axisName].domElement.parentElement.parentElement.style.display = display;

			//Scale, point local position

			var c, cScale;
			switch(axisName) {

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
				default: console.error('GuiSelectPoint.updateScale: Invalid axis name: ' + axisName);
					return;

			}
			c.domElement.parentElement.parentElement.style.display = display;
			cScale.domElement.parentElement.parentElement.style.display = display;

		};
		function displayVerticeID( object ) {

			if ( object.userData.boFrustumPoints ) return;
			if ( !options.dat.guiSelectPoint.boDisplayVerticeID ) {

				for ( var i = object.children.length - 1; i >= 0; i-- ) {

					const child = object.children[i];
					if ( child.type === 'Sprite' ) object.remove( child );

				}
				return;

			}
			if (!object.geometry) return;//Probably this is Group
			let gp = object.geometry.attributes.position;
			object.updateMatrixWorld();
			const drawRange = object.geometry.drawRange, count = (drawRange.count === Infinity) ? gp.count : drawRange.start + drawRange.count;
			for ( let i = drawRange.start; i < count; i++ ) {

				let p = new THREE.Vector3().fromBufferAttribute( gp, i ); // set p from `position`
				//						object.localToWorld(p); // p has wordl coords
				const spriteText = new SpriteText$1( i, p, { group: object } );
				spriteText.userData.pointID = i;

			}

		}

		function addPoints( mesh, intersectionSelected ) {

			//https://threejs.org/docs/index.html?q=buffer#api/en/core/BufferGeometry.setDrawRange
			const count = mesh.geometry.userData.drawRange ?
				mesh.geometry.userData.drawRange().count ://Во вселенной задал диапазон видимых вершин
				mesh.geometry.index === null ?
					 //геометрия не индексирована. Значит mesh.geometry.drawRange.count указывает на количество видимых вершин
					 (mesh.geometry.drawRange.count + mesh.geometry.drawRange.start) > mesh.geometry.attributes.position.count ?
						 mesh.geometry.attributes.position.count ://диапазон вершин больше количества вершин
						 mesh.geometry.drawRange.count + mesh.geometry.drawRange.start//добавлять только вершины, которые вошли в заданный диапазон
					 :
					 //геометрия индексирована. mesh.geometry.drawRange.count указывает на количество индексов, которые нужно рисовать
					 mesh.geometry.attributes.position.count;//По умолчанию все вершины видно
			mesh.userData.myObject.guiPoints.create( fPoints, cPoints, cTrace, cTraceAll, count, intersectionSelected );

		}

		function createPlayerArrayFuncs( mesh ) {

			if ( !mesh || mesh.userData.boFrustumPoints  || ( mesh.userData.player && mesh.userData.player.boArrayFuncs === false ) ) return;
			if ( !mesh.userData.player ) mesh.userData.player = {};
			if ( !mesh.userData.player.arrayFuncs && mesh.geometry ) {

				const position = mesh.geometry.attributes.position;
				mesh.userData.player.arrayFuncs = [];
				for ( var i = 0; i < position.count; i++ ) {

					const vector = new THREE.Vector4().fromArray( mesh.geometry.attributes.position.array, i * position.itemSize );

					mesh.userData.player.arrayFuncs.push( vector );

				}

			}

		}

		/**
		 * Adds select point GUI into dat.gui folder
		 * @param {GUI} [folder] [dat.gui]{@link https://github.com/anhr/dat.gui} folder.
		 */
		this.add = function ( folder ) {

			folder = folder || options.dat.gui;
			if ( !folder )
				return;//gui не создан
			f3DObjects = folder.addFolder( lang.meshs );
			f3DObjects.domElement.style.display = 'none';
			var mesh, buttonScaleDefault, buttonPositionDefault, buttonRotationDefault;

			cMeshs = f3DObjects.add( { Meshs: lang.notSelected }, 'Meshs', { [lang.notSelected]: -1 } ).onChange( function ( value, intersectionSelected ) {

				value = parseInt( value );

				cPoints.__onChange( -1 );//сбросить настройки точки
				
				if (mesh && mesh.userData.myObject.guiPoints.resetControllers) mesh.userData.myObject.guiPoints.resetControllers();
				
				mesh = getMesh();

				const none = 'none', block = 'block';
				if (fPoint.fCustomPoint) {

					fPoint.removeFolder(fPoint.fCustomPoint);
					delete fPoint.fCustomPoint;
					
				}
				if ( mesh && mesh.userData.gui ) { fPoint.fCustomPoint = mesh.userData.gui.addControllers( fPoint, {
					
					readOnlyEl: readOnlyEl,
					isReadOnlyController: isReadOnlyController,
				
				} ); }
				
				if ( cCustom ) cCustom.object( mesh, dat, value === -1 );

				createPlayerArrayFuncs( mesh );

				var display;
				if ( mesh === undefined ) {

					display = none;
					mesh = undefined;
					if (( options.axesHelper !== undefined ) && ( options.axesHelper !== false ))
						options.axesHelper.exposePosition( getObjectPosition( getMesh(), value ) );

				} else {

					const displayDefaultButtons = mesh.userData.default === undefined ? none : block;
					buttonScaleDefault.domElement.parentElement.parentElement.style.display = displayDefaultButtons;
					buttonPositionDefault.domElement.parentElement.parentElement.style.display = displayDefaultButtons;
					if ( buttonRotationDefault ) buttonRotationDefault.domElement.parentElement.parentElement.style.display = displayDefaultButtons;

					display = block;
					var displayPoints = none, displayFrustumPoints = block;

					cPoints.__onChange( -1 );
					_this.removePoints();

					if ( mesh.userData.controllers !== undefined ) {

						//FrustumPoints
						mesh.userData.controllers();

					} else {

						displayPoints = block;
						displayFrustumPoints = none;

						if ( mesh.geometry && mesh.geometry.attributes ) {
							addPoints( mesh, intersectionSelected );
							if (mesh.userData.myObject && mesh.userData.myObject.guiPoints && mesh.userData.myObject.guiPoints.pointsStyleDisplay)
								displayPoints = mesh.userData.myObject.guiPoints.pointsStyleDisplay;

						}

					}
					dislayEl( cPoints, displayPoints );
					if ( cTraceAll )
						dislayEl( cTraceAll, (cTraceAll.userData && cTraceAll.userData.display) ? cTraceAll.userData.display : options.player ? displayPoints : false );
					if ( cFrustumPoints !== undefined )
						cFrustumPoints.display( displayFrustumPoints );
					setScaleControllers();
					setPositionControllers();
					setRotationControllers();
					orbitControlsOptions = undefined;

				}
				fMesh.domElement.style.display = display;

				if ( ( mesh !== undefined ) && ( mesh.userData.traceAll !== undefined ) )
					cTraceAll.setValue( mesh.userData.traceAll );

			} );
			dat.controllerNameAndTitle( cMeshs, lang.select );

			fMesh = f3DObjects.addFolder( lang.mesh );
			fMesh.domElement.style.display = 'none';
			fMesh.open();

			//Scale

			const fScale = fMesh.addFolder( lang.scale );
			fScale.add( new ScaleController( function ( customController, action ) {

				const zoom = customController.controller.getValue();
				mesh.scale.x = action( mesh.scale.x, zoom );
				mesh.scale.y = action( mesh.scale.y, zoom );
				mesh.scale.z = action( mesh.scale.z, zoom );
				mesh.needsUpdate = true;

				setScaleControllers();
				exposePosition();
				if ( options.frustumPoints )
					options.frustumPoints.updateCloudPoint( mesh );

			},
				{

					settings: { zoomMultiplier: 1.1, },
					getLanguageCode: getLanguageCode,
					newBool: true,

				} ) );
			const scale = new THREE.Vector3();
			function setScale( axisName, value ) {

				mesh.scale[axisName] = value;
				mesh.needsUpdate = true;
				exposePosition();
				if ( options.frustumPoints )
					options.frustumPoints.updateCloudPoint( mesh );

			}
			if ( options.scales.x.isAxis() ) {

				cScaleX = dat.controllerZeroStep( fScale, scale, 'x', function ( value ) { setScale( 'x', value ); } );
				dat.controllerNameAndTitle( cScaleX, options.scales.x.name );

			}
			if ( options.scales.y.isAxis() ) {

				cScaleY = dat.controllerZeroStep( fScale, scale, 'y', function ( value ) { setScale( 'y', value ); } );
				dat.controllerNameAndTitle( cScaleY, options.scales.y.name );

			}
			if ( options.scales.z.isAxis() ) {

				cScaleZ = dat.controllerZeroStep( fScale, scale, 'z', function ( value ) { setScale( 'z', value ); } );
				dat.controllerNameAndTitle( cScaleZ, options.scales.z.name );

			}

			//Default scale button
			buttonScaleDefault = fScale.add( {

				defaultF: function ( value ) {

					mesh.scale.copy( mesh.userData.default.scale );
					mesh.needsUpdate = true;

					setScaleControllers();
					exposePosition();

				},

			}, 'defaultF' );
			dat.controllerNameAndTitle( buttonScaleDefault, lang.defaultButton, lang.defaultScaleTitle );

			//Position

			const fPosition = fMesh.addFolder( lang.position );

			function addAxisControllers( name ) {

				const scale = options.scales[name];
				if ( !scale.isAxis() )
					return;
				const axisName = scale.name,
					f = fPosition.addFolder( axisName );
				folders.position = folders.position || {};
				folders.position[axisName] = f;
				f.add( new PositionController( function ( shift ) {

					mesh.position[name] += shift;
					mesh.needsUpdate = true;

					setPositionControllers();
					exposePosition();
					if ( options.frustumPoints )
						options.frustumPoints.updateCloudPoint( mesh );

				}, { getLanguageCode: getLanguageCode, } ) );

				function setPosition( value ) {

					mesh.position[name] = value;
					mesh.needsUpdate = true;
					exposePosition();

				}
				const position = new THREE.Vector3();

				cPosition[name] = dat.controllerZeroStep( f, position, name, function ( value ) { setPosition( value ); } );
				dat.controllerNameAndTitle( cPosition[name], axisName );

			}
			addAxisControllers( 'x' );
			addAxisControllers( 'y' );
			addAxisControllers( 'z' );

			//Restore default position.
			buttonPositionDefault = fPosition.add( {

				defaultF: function ( value ) {

					mesh.position.copy( mesh.userData.default.position );
					mesh.needsUpdate = true;

					setPositionControllers();
					exposePosition();

				},

			}, 'defaultF' );
			dat.controllerNameAndTitle( buttonPositionDefault, lang.defaultButton, lang.defaultPositionTitle );

			//rotation

			function addRotationFolder() {

				const boX = options.scales.x.isAxis(),
					boY = options.scales.y.isAxis(),
					boZ = options.scales.z.isAxis();
				var n = 0;//space dimension
				if ( boX ) n++;
				if ( boY ) n++;
				if ( boZ ) n++;
				if ( n === 1 ) return;
				fRotation = fMesh.addFolder( lang.rotation );
				function addRotationControllers( name ) {

					const scale = options.scales[name];
					cRotations[name] = fRotation.add( new THREE.Vector3(), name, 0, Math.PI * 2, 0.01 ).
						onChange( function ( value ) {

							const mesh = getMesh();
							if ( !mesh.userData.boFrustumPoints ) {

								mesh.rotation[name] = value;
								mesh.needsUpdate = true;

							}

							if ( !boSetMesh )
								exposePosition();
							if ( options.frustumPoints !== undefined )
								options.frustumPoints.updateCloudPoint( mesh );

						} );
					dat.controllerNameAndTitle( cRotations[name], scale.name );

				}
				switch ( n ) {

					case 2:
						addRotationControllers( !boX ? 'x' : !boY ? 'y' : 'z' );
						break;
					case 3:
						addRotationControllers( 'x' );
						addRotationControllers( 'y' );
						addRotationControllers( 'z' );
						break;
					default: console.error( 'GuiSelectPoint.updateScale: Invalid space dimension = ' + n );
						return;

				}

				//Default rotation button
				buttonRotationDefault = fRotation.add( {

					defaultF: function ( value ) {

						mesh.rotation.copy( mesh.userData.default.rotation );
						mesh.needsUpdate = true;

						setRotationControllers();
						exposePosition();

					},

				}, 'defaultF' );
				dat.controllerNameAndTitle( buttonRotationDefault, lang.defaultButton, lang.defaultRotationTitle );

			}
			addRotationFolder();

			//Points

			fPoints = fMesh.addFolder( lang.points );

			let oldMesh;//Нужен когда пользователь сменил выбранный графический объект и когда надо сбрость настройки вершины предыдущего горафического объекта
			cPoints = fPoints.add( { Points: lang.notSelected }, 'Points', { [lang.notSelected]: -1 } );
			cPoints.onChange( function ( pointId ) {

				pointId = parseInt( pointId );
				if (isNaN(pointId)){

					const onchange = this.__select[this.__select.selectedIndex].onchange;
					if(onchange) onchange();
					else console.error('GuiSelectPoint: cPoints.onChange. Under constraction');//во вселенной выбрать все точки для текущего времени проигрывателя
					return;
					
				}
				var display;
				let mesh = getMesh();
				if ( mesh && mesh.userData.gui && mesh.userData.gui.reset ) oldMesh = mesh;
				if ( pointId === -1 ) display = 'none';
				else {

					display = 'block';
					const bufferGeometry = mesh.userData.myObject.bufferGeometry;
					let intersection;
					if (bufferGeometry) {
						
						const userData = bufferGeometry.userData, oldTimeId = userData.timeId;
						userData.timeId = mesh.userData.myObject.guiPoints.timeId;
						const point = userData.position[pointId];
						pointId = userData.positionOffsetId(pointId);
						userData.timeId = oldTimeId;
	/*					
	const attributesPosition = mesh.geometry.attributes.position;
		point = new THREE.Vector3().fromBufferAttribute(attributesPosition, pointId);
	*/	
						intersection = {
							
							object: mesh,
							index: pointId,
							point: point,
							nearestEdgeVerticeId: pointId,//если не задать это значение, то index будет интерпретироваться как индекс ребра и программа в ребре будет искать индекс вершины, ближайшей к point
							//Для проверки открыть http://localhost/anhr/commonNodeJS/master/HyperSphere/Examples/hyperSphere.html
							//С помошю gui выбрать вершину
							//С помошю gui поменять углы вершины
							
						};
						const setIntersectionProperties = mesh.userData.myObject.guiPoints.setIntersectionProperties;
						if (setIntersectionProperties) setIntersectionProperties(intersection);

					} else intersection = {
						
						object: mesh,
						index: pointId,
						
					};
					_this.select(intersection);

				}
				if ( ( options.axesHelper !== false ) && ( options.axesHelper !== undefined ) )
					options.axesHelper.exposePosition( getObjectPosition(
						mesh, pointId//((pointId != -1) ? mesh.userData.myObject.guiPoints.positionOffset : 0) + pointId
					) );
				displayPointControllers( display );
				if ( !mesh || !mesh.userData.gui || !mesh.userData.gui.reset) mesh = oldMesh;
				if ( mesh && mesh.userData.gui && mesh.userData.gui.reset ) mesh.userData.gui.reset( pointId );

			} );
			cPoints.__select[0].selected = true;
			dat.controllerNameAndTitle( cPoints, lang.select );

			if ( cFrustumPoints !== undefined )
				cFrustumPoints.create( fPoints, getLanguageCode() );
			if ( guiParams.myThreejs )
				guiParams.myThreejs.cFrustumPoints = cFrustumPoints;

			//display vertice ID
			
			options.dat.guiSelectPoint = options.dat.guiSelectPoint || {};
			options.dat.guiSelectPoint.boDisplayVerticeID = options.dat.guiSelectPoint.boDisplayVerticeID || false;
			const cDisplayVerticeID = f3DObjects.add( options.dat.guiSelectPoint, 'boDisplayVerticeID' ).onChange( function ( value ) {
				
				for ( var i = 1; i < cMeshs.__select.options.length; i++ ) {

					var option = cMeshs.__select.options[i];
					if ( option.mesh === undefined ) {

						console.error( 'guiSelectPoint: cDisplayVerticeID.onChange. Invalud option.mesh' );
						continue;

					}
					displayVerticeID( option.mesh );//getMesh() );

				}
				
			} );
			dat.controllerNameAndTitle( cDisplayVerticeID, lang.displayVerticeID, lang.displayVerticeIDTitle );
			
			//Custom point controllers 

			if ( options.dat && options.dat.guiSelectPoint && options.dat.guiSelectPoint.point ) cCustom = options.dat.guiSelectPoint.point( options, dat, fMesh );

			//Camera target
			// Может устанвливаться только если создан проигрыватель options.player,
			//потому что при установке птички 'Look' - Следить, вызывается options.player.selectScene()
			if ( options.player ) {

				var orbitControlsOptions;
				if ( guiParams.cameraTarget ) options.playerOptions.cameraTarget.init( guiParams.cameraTarget, options );
				const playerCameraTarget = options.playerOptions.cameraTarget.get( options );
				if ( playerCameraTarget ) {

					cCameraTarget = fPoints.add( playerCameraTarget, 'boLook' ).onChange( function ( boLook ) {

						const mesh = getMesh();
						if ( mesh.userData.boFrustumPoints ) {

							if ( boLook ) {

								console.warn( 'guiSelectPoint.cCameraTarget.onChange(...). The camera can not look at the frustum point.' );
								cCameraTarget.setValue( false );

							}
							return;

						}
						if ( !mesh.userData.player ) {

							mesh.userData.player = { arrayFuncs: [] };
							for ( var i = 0; i < mesh.geometry.attributes.position.count; i++ ) {

								mesh.userData.player.arrayFuncs.push( new THREE.Vector3().fromArray( mesh.geometry.attributes.position.array,
									i * mesh.geometry.attributes.position.itemSize ) );

							}

						}
						const index = mesh.userData.boFrustumPoints ? cFrustumPoints.getSelectedIndex() : cPoints.__select.options.selectedIndex - 1,
							point = typeof mesh.userData.player.arrayFuncs === "function" ?
								new THREE.Vector3().fromArray( mesh.userData.player.arrayFuncs().attributes.position.array, index * 3 ) :
								mesh.userData.player.arrayFuncs !== undefined ? mesh.userData.player.arrayFuncs[index] :
									new THREE.Vector3().fromArray( mesh.geometry.attributes.position.array, index * 3 );

						//remove boLook from all points
						for ( var i = 0; i < cMeshs.__select.options.length; i++ ) {

							const mesh = cMeshs.__select.options[i].mesh;
							if ( !mesh || !mesh.userData.player || !mesh.userData.player.arrayFuncs )
								continue;
							const arrayFuncs = mesh.userData.player.arrayFuncs;
							for ( var j = 0; j < arrayFuncs.length; j++ )
								if ( arrayFuncs[j].cameraTarget ) arrayFuncs[j].cameraTarget.boLook = false;

						}
						if ( point.cameraTarget ) point.cameraTarget.boLook = boLook;
						if ( options.player ) options.player.selectScene();
						if ( options.cameraGui ) options.cameraGui.look( boLook );
						if ( boLook ) {

							if ( !point.cameraTarget ) {

								if ( playerCameraTarget.boLook === undefined ) Player$2.cameraTarget2.boLook = false;

								if ( !orbitControlsOptions ) orbitControlsOptions = {};
								if ( !orbitControlsOptions.target )
									orbitControlsOptions.target = new THREE.Vector3();
								if ( options.orbitControls )
									orbitControlsOptions.target.copy( options.orbitControls.target );

								options.playerOptions.cameraTarget.changeTarget( mesh, index );

							}
							return;

						}

						//Если точка имеет индивидуальную cameraTarget, то камера будет следить по этим настройкам
						if ( guiParams.cameraTarget ) guiParams.cameraTarget.camera.userData.cameraTargetPoint = point.cameraTarget;

						if ( options.orbitControls ) options.orbitControls.reset();

						if ( orbitControlsOptions ) {

							if ( getCameraTarget() )
								return;

							if ( Player$2.orbitControls )
								Player$2.orbitControls.target.copy( orbitControlsOptions.target );
							guiParams.cameraTarget.camera.lookAt( orbitControlsOptions.target );
							point.cameraTarget = undefined;

						}

					} );
					dat.controllerNameAndTitle( cCameraTarget, lang.cameraTarget, lang.cameraTargetTitle );

				}

			}

			//Points attribute position
			fPoint = fPoints.addFolder( lang.point );
			dat.folderNameAndTitle( fPoint, lang.point, lang.pointTitle );

			//Points world position
			fPointWorld = fPoints.addFolder( lang.pointWorld );
			dat.folderNameAndTitle( fPointWorld, lang.pointWorld, lang.pointWorldTitle );
			//fPointWorld.open();

			displayPointControllers( 'none' );

			if ( guiParams.pointsControls ) {

				guiParams.pointsControls( fPoints, dislayEl, getMesh );

			}
			//options.traces ||= uncompatible with myThree.js → ./build/myThree.js, ./ build / myThree.module.js...
			if (!options.traces) options.traces = {

				boTraces: false,
				onChange: ( value ) => {

					var mesh = getMesh();
					mesh.userData.traceAll = value;
					for ( var i = 0; i < mesh.geometry.attributes.position.count; i++ ) visibleTraceLine( { object: mesh, index: i }, value, getMesh );
					cTrace.setValue( value );
					
				},
				
			};
			cTraceAll = fPoints.add( options.traces, 'boTraces' ).onChange( ( value ) => { options.traces.onChange( value ); } );
			dat.controllerNameAndTitle( cTraceAll, lang.trace, lang.traceAllTitle );
			dislayEl( cTraceAll, options.player );

			//Restore default settings of all 3d objects button.
			dat.controllerNameAndTitle( f3DObjects.add( {

				defaultF: function ( value ) {

					for ( var i = 0; i < cMeshs.__select.options.length; i++ ) {

						const mesh = cMeshs.__select.options[i].mesh;
						if ( !mesh )
							continue;
						mesh.scale.copy( mesh.userData.default.scale );
						mesh.position.copy( mesh.userData.default.position );
						mesh.rotation.copy( mesh.userData.default.rotation );
						mesh.needsUpdate = true;

					}
					setScaleControllers();
					setPositionControllers();
					setRotationControllers();
					exposePosition();
					if ( options.frustumPoints )
						options.frustumPoints.onChangeControls();

				},

			}, 'defaultF' ), lang.defaultButton, lang.default3DObjectTitle );
			addPointControllers();

			while ( arrayMeshs.length > 0 ) {

				this.addMesh( arrayMeshs[arrayMeshs.length - 1] );
				arrayMeshs.pop();

			}

		};
		/**Removes all points from points list control. */
		this.removePoints = function () {

			//thanks to https://stackoverflow.com/a/48780352/5175935
			cPoints.domElement.querySelectorAll( 'select option' ).forEach( option => option.remove() );
			const opt = document.createElement( 'option' );
			opt.innerHTML = lang.notSelected;
			opt.setAttribute( 'value', -1 );//Эта строка нужна в случае когда пользователь отменил выбор точки. Иначе при движении камеры будут появляться пунктирные линии, указвающие на несуществующую точку
			cPoints.__select.appendChild( opt );

		};
		/**Updates points in the points list control. */
		this.updatePoints = function () {

			const boDisplayVerticeID = options.dat.guiSelectPoint.boDisplayVerticeID,
				mesh = getMesh();

			//убрать с холста идентификаторы точек
			if ( boDisplayVerticeID ) {

				options.dat.guiSelectPoint.boDisplayVerticeID = false;
				displayVerticeID( mesh );

			}

			cPoints.__onChange( -1 );
			this.removePoints();
			mesh.userData.player.arrayFuncs.length = 0;
			delete mesh.userData.player.arrayFuncs;
			createPlayerArrayFuncs( mesh );
			addPoints( mesh );

			//восстановить идентификаторы точек
			if ( boDisplayVerticeID ) {

				options.dat.guiSelectPoint.boDisplayVerticeID = true;
				displayVerticeID( mesh );

			}

			if ( mesh.userData.nd ) mesh.userData.nd.update();

		};
		function addPointControllers() {

			//Point's attribute position axes controllers

			function axesGui( axisName ) {

				var scale, controller;
				if ( axisName === 'w' ) {

					//W axis

					options.scales.setW();
					scale = options.scales.w;
					function onChange( value ) {

						const attributes = intersection.object.geometry.attributes,
							i = intersection.index;
						if ( attributes.position.itemSize < 4 ) {

							console.error( 'guiSelectPoint.addPointControllers().axesGui().controller.onChange(): attributes.position.itemSize = ' + attributes.position.itemSize );
							return;//Точка не имеет цвета. Например это вершина куба. Надо скрыть оган управления координатой w

						}
						if ( options.palette ) Player$2.setColorAttribute( attributes, i, options.palette.toColor( value, controller.__min, controller.__max ) );
						if ( options.scales.w.isColor != false )
							attributes.position.setW( i, value );

						if ( options.frustumPoints )
							options.frustumPoints.updateCloudPointItem( intersection.object, intersection.index );

					}
					if ( ( scale.min !== undefined ) && ( scale.max !== undefined ) ) {

						controller = fPoint.add( { value: scale.min, }, 'value', scale.min, scale.max, ( scale.max - scale.min ) / 100 ).onChange( function ( value ) {

							if ( isReadOnlyController( controller ) ) return;
							onChange( value );

						} );
						if ( ( options.scales.w.isColor != false ) && ( options.palette instanceof ColorPicker$1.palette ) ) {

							controller.domElement.querySelector( '.slider-fg' ).style.height = '40%';
							const elSlider = controller.domElement.querySelector( '.slider' );
							ColorPicker$1.create( elSlider, {

								palette: options.palette,
								style: {

									//border: '2px solid #303030',
									width: '65%',//Непонятно почему без этой строи не видно палиры в http://localhost/anhr/egocentricUniverse/master/Examples/3D.html
									//height: elSlider.offsetHeight / 2,//'50%',

								},
								//onError: function ( message ) { alert( 'Colorpicker error: ' + message ); }

							} );

						}

					} else
						controller = fPoint.add( { value: 0, }, 'value' ).onChange( function ( value ) { onChange( value ); } );

				} else {

					scale = ( options.axesHelper === undefined ) || ( options.axesHelper === false ) ? options.scales[axisName] : //если я буду использовать эту строку то экстремумы шкал буду устанавливатся по умолчанию а не текущие
						options.axesHelper.options ? options.axesHelper.options.scales[axisName] : undefined;
					if ( scale.isAxis() )
						controller = fPoint.add( { value: scale.min, }, 'value', scale.min, scale.max, ( scale.max - scale.min ) / 1000 ).onChange( function ( value ) {

								const points = intersection.object;

								if ( isReadOnlyController( controller ) ) return;
								
								const axesId = axisName === 'x' ? 0 : axisName === 'y' ? 1 : axisName === 'z' ? 2 : axisName === 'w' ? 3 : console.error('axisName:' + axisName);
								points.geometry.attributes.position.array[axesId + points.userData.myObject.getPositionData(intersection.index).positionId] = value;
								points.geometry.attributes.position.needsUpdate = true;

								exposePosition( intersection.index );

								if ( options.frustumPoints )
									options.frustumPoints.updateCloudPointItem( points, intersection.index );

							} );

				}
				if ( controller )
					dat.controllerNameAndTitle( controller, scale.name );
				return controller;

			}
			cX = axesGui( 'x' );
			cY = axesGui( 'y' );
			cZ = axesGui( 'z' );
			cW = axesGui( 'w' );
			cColor = fPoint.addColor( { color: '#FFFFFF', }, 'color' ).
				onChange( function ( value ) {

					//for testing
					//Go to http://localhost/anhr/commonNodeJS/master/player/Examples/
					//Select 3 Ponts' 3D object
					//Select a point 2
					//Open 'Point's local position'
					//Change 'color'
					
					if ( isReadOnlyController( cColor ) ) return;
					if ( cColor.userData === undefined ) return;
					var intersection = cColor.userData.intersection;
					Player$2.setColorAttribute( intersection.object.geometry.attributes, intersection.index, value );

				} );
			dat.controllerNameAndTitle( cColor, options.scales.w ? options.scales.w.name : lang.color );
			cOpacity = fPoint.add( { opasity: 1, }, 'opasity', 0, 1, 0.01 ).onChange( function ( opasity ) {

					if ( isReadOnlyController( cOpacity ) )
						return;
					const mesh = getMesh();
					if (mesh.userData.myObject) {
						
						mesh.userData.myObject.verticeOpacity(intersection.index, true, opasity);
						return;

					}
					if (!mesh.material.transparent) {

						console.error( 'GuiSelectPoint: cOpacity.onChange. Invalid mesh.material.transparent = ' + mesh.material.transparent);
						return;
						
					}
					if (!mesh.material.vertexColors) {

						console.error( 'GuiSelectPoint: cOpacity.onChange. Invalid mesh.material.vertexColors = ' + mesh.material.vertexColors);
						return;
						
					}
					const color = mesh.geometry.attributes.color;
					if (color.itemSize < 4) return;
					color.array[3 + intersection.index * color.itemSize] = opasity;
					color.needsUpdate = true;

				} );
			dat.controllerNameAndTitle( cOpacity, lang.opacity, lang.opacityTitle );

			//options.trace ||= uncompatible with myThree.js → ./build/myThree.js, ./ build / myThree.module.js...
			if (!options.trace) options.trace = { onChange: (value) => { visibleTraceLine(intersection, value, getMesh); }, };
			cTrace = fPoint.add( { boTrace: false, }, 'boTrace' ).onChange( function ( value ) { options.trace.onChange( value, cPoints.__select.selectedIndex - 1 ); } );
			dat.controllerNameAndTitle( cTrace, lang.trace, lang.traceTitle ); //guiParams
			dislayEl( cTrace, options.player );

			if ( guiParams.pointControls ) guiParams.pointControls( fPoint, dislayEl, getMesh, intersection );

			//Point's world position axes controllers

			function axesWorldGui( axisName ) {

				const scale = ( options.axesHelper === undefined ) || ( options.axesHelper === false ) ? options.scales[axisName] :
					options.axesHelper.options ? options.axesHelper.options.scales[axisName] : undefined;
				if ( !scale.isAxis() )
					return;
				const controller = dat.controllerZeroStep( fPointWorld, { value: scale.min, }, 'value' );
				readOnlyEl( controller, true );
				dat.controllerNameAndTitle( controller, scale.name );
				return controller;

			}
			cWorld.x = axesWorldGui( 'x' );
			cWorld.y = axesWorldGui( 'y' );
			cWorld.z = axesWorldGui( 'z' );

			//Restore default local position.
			cRestoreDefaultLocalPosition = fPoint.add( {

				defaultF: function () {

					const positionDefault = intersection.object.userData.player.arrayFuncs[intersection.index],
						t = options.time,
						setDefaultValue = ( control, value ) => {
							
							if ( !control ) return;
							control.setValue(
								typeof value === "function" ?
									value( t, options.a, options.b ) :
									typeof value === "string" ?
										Player$2.execFunc( { w: value } , 'w', options.time, options ) :
										value
							);
							
						};
					setDefaultValue( cX, positionDefault.x );
					setDefaultValue( cY, positionDefault.y );
					setDefaultValue( cZ, positionDefault.z === undefined ? 0 ://default Z axis of 2D point is 0
							positionDefault.z );

					if ( isDislayEl( cOpacity ) ) cOpacity.setValue( cOpacity.initialValue );
					if ( isDislayEl( cColor ) && !isReadOnlyEl( cColor ) ) cColor.setValue( cColor.initialValue );
					
					if ( positionDefault.w !== undefined ) {

						if ( positionDefault.w.r !== undefined )
							cColor.setValue( '#' +
								new THREE.Color( positionDefault.w.r, positionDefault.w.g, positionDefault.w.b ).getHexString() );
						else if ( typeof positionDefault.w === "function" ) {

							setValue( cW, positionDefault.w( t ) );
							return;

						} else if ( positionDefault.w.func ) {

							setValue( cW, positionDefault.w.func( t ) );
							return;

						}
						const float = parseFloat( positionDefault.w );
						if ( float === positionDefault.w ) {

							if ( isDislayEl( cW ) ) setValue( cW, positionDefault.w );
							
						} else if ( typeof positionDefault.w  === "string") {
							
							setValue( cW, Player$2.execFunc( positionDefault , 'w', options.time, options ) );
							return;
							
						} else console.error( 'Restore default local position: Invalid W axis.' );

					} else cColor.setValue( cColor.initialValue );

				},

			}, 'defaultF' );
			dat.controllerNameAndTitle( cRestoreDefaultLocalPosition, lang.defaultButton, lang.defaultLocalPositionTitle );

			funcFolder = new functionsFolder( fPoint, function ( func, axisName, value ) {

				const mesh = getMesh(),
					index = cPoints.__select.options.selectedIndex - 1,
					funcs = mesh.userData.player.arrayFuncs[index];
				funcs[axisName] = func;

				var parent = mesh.parent, t = 0;
				while ( parent ) {

					if ( parent.userData.t ) {

						t = parent.userData.t;
						break;

					}
					parent = parent.parent;

				}
				var controller;
				switch ( axisName ) {

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
						if ( func instanceof THREE.Color ) {

							cColor.setValue( '#' + func.getHexString() );
							return;

						}
						controller = cW;
						break;
					default: console.error( 'GuiSelectPoint new functionsFolder onFinishChange: axisName = ' + axisName );
						return;

				}
				setValue( controller, Player$2.execFunc( funcs, axisName, t, options ) );

				if ( funcs.controllers ) {

					//обновить органы управления на веб странице
					const controllerObject = funcs.controllers[axisName];
					if ( controllerObject && controllerObject.func && controllerObject.func.controller )
						controllerObject.func.controller.value = value;
					
				}

			}, options, { x: '', y: '', z: '', w: '' } );

		}
		/**
		 * get frustum points.
		 */
		this.getFrustumPoints = function () { return cFrustumPoints; };
		return this;

	}

}

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

//import Cookie from './cookieNodeJS/cookie.js';
//import Cookie from 'https://raw.githack.com/anhr/commonNodeJS/master/cookieNodeJS/cookie.js';

class MoveGroupGui {

	/**
	 * Add MoveGroup folder into {@link https://github.com/anhr/dat.gui|dat.gui} for changing group's position, scale and rotation.
	 * @param {THREE.Group|THREE.Scene} group [THREE.Group]{@link https://threejs.org/docs/index.html?q=group#api/en/objects/Group} or [THREE.Scene]{@link https://threejs.org/docs/index.html?q=sce#api/en/scenes/Scene} for moving.
	 * @param {object} options the following options are available.
	 * See the <b>options</b> parameter of the <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
	 * @param {object} [options.axesHelper] <a href="../../AxesHelper/jsdoc/index.html" target="_blank">AxesHelper</a>.
	 * @param {object} [options.scales] axes scales.
	 * See <b>options.scales</b> parameter of the <a href="../../AxesHelper/jsdoc/module-AxesHelper-AxesHelper.html" target="_blank">AxesHelper</a> class for details.
	 * @param {Cookie} [options.cookie] Your custom cookie function for saving and loading of the MoveGroup settings. Default cookie is not saving settings.
	 * @param {string} [options.cookieName] Name of the cookie is "MoveGroup" + options.cookieName.
	 * @param {GuiSelectPoint} [options.guiSelectPoint] A dat.gui based graphical user interface for select a point from the mesh.
	 * See <a href="../../guiSelectPoint/jsdoc/index.html" target="_blank">GuiSelectPoint</a> for details.
	 * @param {GUI} [guiParams.folder] is [dat.GUI]{@link https://github.com/anhr/dat.gui} parent folder.
	 * @param {object} [guiParams={}] Followed parameters is allowed.
	 * @param {object} [guiParams.lang] Object with localized language values
	 * @param {object} [guiParams.lang.moveGroup] use for rename of the MoveGroup folder. Default is 'Move Group'.
	 */
	constructor( group, options, guiParams = {} ) {

		if ( !options.boOptions ) {

			console.error( 'MoveGroupGui: call options = new Options( options ) first' );
			return;

		}
		const gui = guiParams.folder || options.dat.gui;
		if ( !gui || options.dat.moveScene === false )
			return;
		if ( options.axesHelper && options.axesHelper.options )
			options.scales = options.axesHelper.options.scales;
		else options.scales = options.scales || { x: {}, y: {}, z: {}, };


//		const cookie = options.cookie || new Cookie.defaultCookie(),
		const cookie = options.dat.cookie,
			dat = three$1.dat,//options.dat.dat,
			cookieName = 'MoveGroup' + ( options.cookieName ? '_' + options.cookieName : '' ),
			optionsGroup = {

				scale: group.scale,
				position: group.position,
				rotation: group.rotation,
				x: { zoomMultiplier: 1.2, offset: 0.1, },
				y: { zoomMultiplier: 1.2, offset: 0.1, },
				z: { zoomMultiplier: 1.2, offset: 0.1, },

			},
			groupOptionsDefault = JSON.parse( JSON.stringify( optionsGroup ) );
		Object.freeze( groupOptionsDefault );
		cookie.getObject( cookieName, optionsGroup, groupOptionsDefault );

		//move group from cookie
		group.scale.copy( optionsGroup.scale );
		group.position.copy( optionsGroup.position );

		//Restore optionsGroup from group
		//Если не восстановить optionsGroup из group, то после перемещения group это не будет сохраняться в cookie
		optionsGroup.scale = group.scale;
		optionsGroup.position = group.position;

		function setDefault( axisName ) {

			let scale = options.scales[axisName];
			if ( !scale )
				return;
			
			options.moveGroupGui = options.moveGroupGui || { scales: {} };
			options.moveGroupGui.scales[axisName] = options.moveGroupGui.scales[axisName] || {};
			options.moveGroupGui.scales[axisName].default = function () {

				const scalesControllers = options.scalesControllers[axisName];
				scalesControllers.scale.setValue( groupOptionsDefault.scale[axisName] );
				scalesControllers.scaleController.setValue( groupOptionsDefault[axisName].zoomMultiplier );
				scalesControllers.position.setValue( groupOptionsDefault.position[axisName] );
				scalesControllers.positionController.setValue( groupOptionsDefault[axisName].offset );
				scalesControllers.rotation.setValue( groupOptionsDefault.rotation['_' + axisName] );

			};

		}
		setDefault( 'x' );
		setDefault( 'y' );
		setDefault( 'z' );

		//Localization

		var lang = {

			moveGroup: 'Move Group',
			scale: 'Scale',
			position: 'Position',
			rotation: 'Rotation',

			defaultButton: 'Default',
			defaultTitle: 'Move group to default position.',

		};
		switch ( options.getLanguageCode() ) {

			case 'ru'://Russian language

				lang.moveGroup = 'Переместить группу';				lang.scale = 'Масштаб';
				lang.position = 'Позиция';
				lang.rotation = 'Вращение';

				lang.defaultButton = 'Восстановить';
				lang.defaultTitle = 'Переместить группу в исходное состояние.';

				break;
			default://Custom language
				if ( ( options.lang === undefined ) || ( options.lang.languageCode != languageCode ) )
					break;

				Object.keys( options.lang ).forEach( function ( key ) {

					if ( lang[key] === undefined )
						return;
					lang[key] = options.lang[key];

				} );

		}

		if ( guiParams.lang )
			lang.moveGroup = guiParams.lang.moveGroup || lang.moveGroup;

		function axisZoom( axisName, action, zoom ) {

			var scale = options.scalesControllers[axisName].scale;
			if ( !scale )
				return;
			scale.setValue( action( scale.getValue(), zoom ) );
			setSettings();

		}

		//move group folder
		let fMoveGroup = gui.addFolder( lang.moveGroup );

		fMoveGroup.add( new ScaleController(
			function ( customController, action ) {

				let zoom = customController.controller.getValue();
				axisZoom( 'x', action, zoom );
				axisZoom( 'y', action, zoom );
				axisZoom( 'z', action, zoom );

			}, {

			settings: { zoomMultiplier: 1.1, },
			getLanguageCode: guiParams.getLanguageCode,

		} ) );

		function setSettings() {

			if ( options.axesHelper )
				options.axesHelper.updateAxes();
			if ( options.guiSelectPoint )
				options.guiSelectPoint.update();
			cookie.setObject( cookieName, optionsGroup );

		}

		function scale( axes, scaleControllers, axisName ) {

/*
			if ( axes === undefined )
				return;//Not 3D AxesHelper
			axes.name = axes.name || axisName;
*/			
			if ( !axes.isAxis() ) return;//Not 3D AxesHelper

			function onclick( customController, action ) {

				var zoom = customController.controller.getValue();

				axisZoom( axisName, action, zoom );

			}

			scaleControllers.folder = fMoveGroup.addFolder( axes.name );

			//Scale

			scaleControllers.scaleController = scaleControllers.folder.add( new ScaleController( onclick,
				{ settings: optionsGroup[axisName], getLanguageCode: guiParams.getLanguageCode, } ) ).onChange( function ( value ) {

					optionsGroup[axisName].zoomMultiplier = value;
					setSettings();

				} );
			scaleControllers.scale = dat.controllerZeroStep( scaleControllers.folder, group.scale, axisName,
				function ( value ) { setSettings(); } );
			dat.controllerNameAndTitle( scaleControllers.scale, lang.scale );

			//Position

			var positionController = new PositionController( function ( shift ) {

				function onclick( customController, action ) {

					var offset = customController.controller.getValue();


					function axisOffset( axisName, action, offset ) {

						var position = options.scalesControllers[axisName].position;
						if ( !position )
							return;
						position.setValue( action( position.getValue(), offset ) );
						setSettings();

					}
					axisOffset( axisName, action, offset );

				}
				onclick( positionController, function ( value, zoom ) {

					value += shift;
					return value;

				} );

			}, { settings: {}, getLanguageCode: guiParams.getLanguageCode, } );
			scaleControllers.positionController = scaleControllers.folder.add( positionController ).onChange( function ( value ) {

				optionsGroup[axisName].offset = value;
				setSettings();

			} );
			scaleControllers.position = dat.controllerZeroStep( scaleControllers.folder, group.position, axisName,
				function ( value ) { setSettings(); } );
			dat.controllerNameAndTitle( scaleControllers.position, lang.position );

			//rotation

			scaleControllers.rotation = scaleControllers.folder.add( group.rotation, axisName, 0, Math.PI * 2, 1 / 360 ).
				onChange( function ( value ) { setSettings(); } );
			dat.controllerNameAndTitle( scaleControllers.rotation, lang.rotation );

			//Default button
			dat.controllerNameAndTitle( scaleControllers.folder.add( {

				defaultF: function ( value ) {

					options.moveGroupGui.scales[axisName].default();

				},

			}, 'defaultF' ), lang.defaultButton, lang.defaultTitle );

		}
		options.scalesControllers = { x: {}, y: {}, z: {}, w: {} };//, t: {}, };
		if ( options.scales ) {

			scale( options.scales.x,
				options.scalesControllers.x, 'x' );
			scale( options.scales.y,
				options.scalesControllers.y, 'y' );
			scale( options.scales.z,
				options.scalesControllers.z, 'z' );

		}

		//default button
		var defaultParams = {

			defaultF: function ( value ) {

				if ( options.moveGroupGui.scales.x ) options.moveGroupGui.scales.x.default();
				if ( options.moveGroupGui.scales.y ) options.moveGroupGui.scales.y.default();
				if ( options.moveGroupGui.scales.z ) options.moveGroupGui.scales.z.default();

			},

		};
		dat.controllerNameAndTitle( fMoveGroup.add( defaultParams, 'defaultF' ), lang.defaultButton, lang.defaultTitle );

	}

}

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

class CameraGui {

	/**
	 * [Camera]{@link https://threejs.org/docs/index.html#api/en/cameras/PerspectiveCamera} settings graphical user interface
	 * @param {THREE.PerspectiveCamera} camera [PerspectiveCamera]{@link https://threejs.org/docs/index.html#api/en/cameras/PerspectiveCamera}
	 * @param {Options} options See the <b>options</b> parameter of the <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
	 * The following options are available.
	 * @param {OrbitControls} [options.orbitControls] [OrbitControls]{@link https://threejs.org/docs/index.html#examples/en/controls/OrbitControls}.
	 * @param {Function} [options.getLanguageCode=language code of your browser] returns the "primary language" subtag of the version of the browser.
	 * @param {object} [options.scales={}] axes scales.
	 * See the <b>options.scales</b> parameter of the <a href="../../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
	 * @param {GUI} [gui] is [new dat.GUI(...)]{@link https://github.com/anhr/dat.gui} parent folder.
	*/
	constructor( camera, options, gui ) {

		if ( !options.boOptions ) {

			console.error( 'CameraGui: call options = new Options( options ) first' );
			return;

		}
		gui = gui || options.dat.gui;
		if ( !gui || options.dat.cameraGui === false )
			return;
		const dat = three$1.dat;//options.dat.dat,
			three$1.THREE;
		options.cameraGui = this;

		//Обновить значения органов управления когда пользователь с помощью мыши передвинул камеру
		if ( options.orbitControls )
			options.orbitControls.addEventListener( 'change', function () {

				update();

			} );

		//Localization

		const lang = {

			camera: 'Camera',

			position: 'Position',
			positionTitle: 'Camera position',

			distanceToCamera: 'Distance',
			distanceToCameraTitle: 'Distance from the camera to the point at which the camera is looking',

			look: 'Look',
			lookTitle: 'Camera is look at a selected point during playing.',

			defaultButton: 'Default',
			defaultTitle: 'Restore default camera settings.',

		};
		switch ( options.getLanguageCode() ) {

			case 'ru'://Russian language

				lang.camera = 'Камера';

				lang.position = 'Позиция';
				lang.positionTitle = 'Позиция камеры';

				lang.distanceToCamera = 'Расстояние';
				lang.distanceToCameraTitle = 'Расстояние между камерой и точкой, на которую она смотрит.',

				lang.look = 'Следить';
				lang.lookTitle = 'Камера следит за выбранной точкой во время проигрывания.';

				lang.defaultButton = 'Восстановить';
				lang.defaultTitle = 'Восстановить настройки камеры по умолчанию.';

				break;
			default://Custom language
				if ( ( options.lang === undefined ) || ( options.lang.languageCode != _languageCode ) )
					break;

				Object.keys( options.lang ).forEach( function ( key ) {

					if ( lang[key] === undefined )
						return;
					lang[key] = options.lang[key];

				} );

		}

		const fCamera = gui.addFolder( lang.camera ),
			fPosition = fCamera.addFolder( lang.position ),
			controllersPosition = {

				x: options.scales.x ? dat.controllerZeroStep( fPosition, camera.position, 'x', function ( value ) {

					camera.position.x = value;

				} ) : undefined,
				y: options.scales.y ? dat.controllerZeroStep( fPosition, camera.position, 'y', function ( value ) {

					camera.position.y = value;

				} ) : undefined,

				z: options.scales.z ? dat.controllerZeroStep( fPosition, camera.position, 'z', function ( value ) {

					camera.position.z = value;

				} ) : undefined,

			};
		dat.folderNameAndTitle( fPosition, lang.position, lang.positionTitle );
		if ( controllersPosition.x ) dat.controllerNameAndTitle( controllersPosition.x, options.scales.x.name );
		if ( controllersPosition.y ) dat.controllerNameAndTitle( controllersPosition.y, options.scales.y.name );
		if ( controllersPosition.z ) dat.controllerNameAndTitle( controllersPosition.z, options.scales.z.name );

		var controllersDistance, defaultDistance, funcFolder, controllerLook;

		//Camera target
		// Может устанвливаться только если создан проигрыватель options.player,
		//потому что при установке птички 'Look' - Следить в guiSelectPoint, вызывается options.player.selectScene()
		if ( options.player ) {

			options.playerOptions.cameraTarget.init( { camera: camera }, options );
			const cameraTarget = options.playerOptions.cameraTarget.get();
			controllerLook = fCamera.add( cameraTarget, 'boLook' ).onChange( function ( boLook ) {

				if ( options.player ) {

					cameraTarget.boMaual = true;
					options.player.selectScene();
					cameraTarget.boMaual = false;

				}
				if ( boLook )
					return;
				if ( options.orbitControls )
					options.orbitControls.reset();//обязательно вызвать controls.saveState();

			} );
			dat.controllerNameAndTitle( controllerLook, lang.look, lang.lookTitle );

			const fDistanceToCamera = fCamera.addFolder( lang.distanceToCamera ),
				distance = {

					x: Player$2.execFunc( cameraTarget.distanceToCamera, 'x', undefined, options ),
					y: Player$2.execFunc( cameraTarget.distanceToCamera, 'y', undefined, options ),
					z: Player$2.execFunc( cameraTarget.distanceToCamera, 'z', undefined, options ),

				};

			function setDistance( axisName, value ) {

				if ( isNaN( value ) ) return;
				if ( camera.userData.cameraTarget ) camera.userData.cameraTarget.distanceToCameraCur[axisName] = value;
				cameraTarget.distanceToCameraCur[axisName] = value;
				cameraTarget.setCameraPosition();
				update();

			}
			controllersDistance = {

				x: dat.controllerZeroStep( fDistanceToCamera, distance, 'x', function ( value ) {

					setDistance( 'x', value );

				} ),
				y: dat.controllerZeroStep( fDistanceToCamera, distance, 'y', function ( value ) {

					setDistance( 'y', value );

				} ),

				z: dat.controllerZeroStep( fDistanceToCamera, distance, 'z', function ( value ) {

					setDistance( 'z', value );

				} ),

			};
			defaultDistance = { x: distance.x, y: distance.y, z: distance.z };
			dat.folderNameAndTitle( fDistanceToCamera, lang.distanceToCamera, lang.distanceToCameraTitle );
			if ( options.scales.x ) dat.controllerNameAndTitle( controllersDistance.x, options.scales.x.name );
			if ( options.scales.y ) dat.controllerNameAndTitle( controllersDistance.y, options.scales.y.name );
			if ( options.scales.z ) dat.controllerNameAndTitle( controllersDistance.z, options.scales.z.name );

			funcFolder = new functionsFolder( fDistanceToCamera, function ( func, axisName ) {

				const cameraTarget = options.playerOptions.cameraTarget.get();
				cameraTarget.distanceToCamera[axisName] = func;
				const value = Player$2.execFunc( cameraTarget.distanceToCamera, axisName, options.time );
				controllersDistance[axisName].setValue( value, true );
				options.playerOptions.cameraTarget.init( { camera: camera }, options );

			}, options, cameraTarget.distanceToCamera );

		}

		//Default button
		const defaultPosition = { x: camera.position.x, y: camera.position.y, z: camera.position.z },
			defaultTarget = options.orbitControls ?
				{

					x: options.orbitControls.target.x,
					y: options.orbitControls.target.y,
					z: options.orbitControls.target.z,

				} :
				{ x: 0, y: 0, z: 0 };//default camera look at zero coordinate
		dat.controllerNameAndTitle( fCamera.add( {

			defaultF: function ( value ) {

				controllersPosition.x.setValue( defaultPosition.x );
				controllersPosition.y.setValue( defaultPosition.y );
				controllersPosition.z.setValue( defaultPosition.z );

				camera.position.copy( defaultPosition );
				camera.lookAt( defaultTarget );
				if ( options.orbitControls ) {

					options.orbitControls.target.copy( defaultTarget );
					options.orbitControls.update();

				}

				if ( controllersDistance ) {

					controllersDistance.x.setValue( defaultDistance.x );
					controllersDistance.y.setValue( defaultDistance.y );
					controllersDistance.z.setValue( defaultDistance.z );

				}

			},

		}, 'defaultF' ), lang.defaultButton, lang.defaultTitle );

		function update() {

			const cameraTarget = options.playerOptions.cameraTarget.get( options );
			
			if ( controllersPosition.x ) controllersPosition.x.setValue( camera.position.x );
			if ( controllersPosition.y ) controllersPosition.y.setValue( camera.position.y );
			if ( controllersPosition.z ) controllersPosition.z.setValue( camera.position.z );

			if ( controllersDistance ) {

				const distanceToCamera = cameraTarget.getDistanceToCamera();
				if ( controllersDistance.x ) controllersDistance.x.setValue( distanceToCamera.x );
				if ( controllersDistance.y ) controllersDistance.y.setValue( distanceToCamera.y );
				if ( controllersDistance.z ) controllersDistance.z.setValue( distanceToCamera.z );

			}
			if ( funcFolder ) funcFolder.setFunction( cameraTarget.distanceToCamera );

		}

		/**
			* Update camera controls.
			*/
		this.update = function () { update(); };
		/**
			* Look at selected point
			* @param {boolean} [boLook=true] true - look at selected point
			*/
		this.look = function ( boLook = true ) {

//				if ( controllerLook && ( controllerLook.getValue() !== boLook ) )
			if ( controllerLook ) {

//					controllerLook.setValue( boLook );
				controllerLook.object[controllerLook.property] = boLook;
				controllerLook.updateDisplay();


			}

		};

	}

}

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

/**
 * @callback setSize
 * @description Set size of the point
 * @param {number} value new size.
 * */

/**
 * GUI for changing point settings.
 * @param {Object} point point options.
 * @param {number} point.size point size.
 * @param {setSize} setSize Set size of the point
 * @param {Options} options See the <b>options</b> parameter of the <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
 * @param {Object} [settings={}] the following settings are available
 * @param {GUI} [settings.folder] parent folder. See [GUI]{@link https://github.com/anhr/dat.gui}.
 * @param {Object} [settings.defaultPoint={}] default point options. Restore point options if user has clicked "Default" button
 * @param {number} [settings.defaultPoint.size=point.size] point size.
 * @param {number} [settings.PCOptions={}] See options parameter of the <a href="../../jsdoc/PositionController/PositionController.html" target="_blank">PositionController</a>
 * @param {Object} [settings.PCOptions.min=0.01] Minimal offset.
 * @param {Object} [settings.PCOptions.max=1] Maximal offset.
 * @param {Object} [settings.PCOptions.step=0.01] step of offset.
 * @param {Object} [settings.PCOptions.settings={}] time settings.
 * @param {Object} [settings.PCOptions.settings.offset=1]
 */
class FolderPoint {

	constructor( point, setSize, options, settings = {} ) {

		const dat = three$1.dat;
		if ( !options.boOptions ) {

			console.error( 'FolderPoint: call options = new Options( options ) first' );
			return;

		}
		const gui = settings.folder || options.dat.gui;
		if ( !gui || options.dat.folderPoint === false )
			return;

		options.dat.folderPoint = this;

		//Localization

		const lang = {

			pointSettings: 'Point',

			size: 'Size',
			sizeTitle: 'Size of the point with "ShaderMaterial" material',

			defaultButton: 'Default',
			defaultPointTitle: 'Restore point.',

		};

		switch ( options.getLanguageCode() ) {

			case 'ru'://Russian language
				lang.pointSettings = 'Точка';

				lang.size = 'Размер';
				lang.sizeTitle = 'Размер точки с материалом типа "ShaderMaterial"';

				lang.defaultButton = 'Восстановить';
				lang.defaultPointTitle = 'Восстановить точку';

				break;

		}
		const defaultPoint = settings.defaultPoint || {};
		if ( defaultPoint.size === undefined ) defaultPoint.size = point.size;

		const PCOptions = settings.PCOptions || {};

		if ( PCOptions.min === undefined ) PCOptions.min = 0.01;
		if ( PCOptions.max === undefined ) PCOptions.max = 1;
		PCOptions.settings = PCOptions.settings || {};
		if ( PCOptions.settings.offset === undefined ) PCOptions.settings.offset = 1;//0.1;
		if ( PCOptions.step === undefined ) PCOptions.step = 0.01;
		PCOptions.getLanguageCode = PCOptions.getLanguageCode || settings.getLanguageCode || options.getLanguageCode;

		var fPoint = gui.addFolder( lang.pointSettings ),
			fSize = fPoint.addFolder( lang.size );
		dat.folderNameAndTitle( fSize, lang.size, lang.sizeTitle );
		this.display = function ( display ) { fPoint.domElement.style.display = display; };

		fSize.add( new PositionController( function ( shift ) { setSize( point.size + shift ); }, PCOptions ) );

		//size
		this.size = dat.controllerZeroStep( fSize, point, 'size', function ( value ) {

			setSize( value );

		} );
		dat.controllerNameAndTitle( this.size, lang.size, lang.sizeTitle );

		//point default button
		dat.controllerNameAndTitle( fPoint.add( {

			defaultF: function ( value ) {

				setSize( defaultPoint.size );

			},

		}, 'defaultF' ), lang.defaultButton, lang.defaultPointTitle );

	}

}

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

	notHiddingFrustumPoints: true, //Точки не скрываются когда пересчитываются их координаты когда пользователь поворачивает сцену
	//notMoveFrustumPoints: true,//Точки двигаются относительно камеры вместе с остальными 3D объектами когда пользователь поворачивает сцену
	//linesiInMono: true,//Возможность показать линии в отсутсвии стерео режима

};
//Standard normal distributionю. Нормальное распределение
//https://en.wikipedia.org/wiki/Normal_distribution
function getStandardNormalDistribution( x ) {

	const standardDeviation = 0.1;//чем больше среднеквадратическое отклонение, тем шире пик нормального распределения
	const res = Math.exp( -0.5 * x * x / ( standardDeviation * standardDeviation ) );// / Math.sqrt( 2 * Math.PI );
	//console.warn( 'x = ' + x + ' y = ' + res );
	return res;

}

class FrustumPoints
{
	/**
	 * Create a `FrustumPoints` instance.
	 * @param {THREE.PerspectiveCamera} camera [PerspectiveCamera]{@link https://threejs.org/docs/index.html#api/en/cameras/PerspectiveCamera}
	 * @param {THREE.Group} group [group]{@link https://threejs.org/docs/index.html?q=Gro#api/en/objects/Group} of objects to which a new FrustumPoints will be added
	 * @param {DOM} canvas The Graphics [Canvas]{@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas} element to draw graphics and animations.
	 * @param {object} [settings={}] the following settings are available
	 * @param {Options} [settings.options=new Options()] <a href="../../jsdoc/Options/Options.html" target="_blank">Options</a> instance. The following options are available.
	 * See <b>options</b> parameter of <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
	 * @param {boolean|OrbitControls} [settings.options.orbitControls] <pre>false - do not add the [OrbitControls]{@link https://threejs.org/docs/index.html#examples/en/controls/OrbitControls}. Allow the camera to orbit around a target.
	 * Or <b>OrbitControls</b> instance.
	 * </pre>
	 * @param {object} [settings.options.dat] use dat-gui JavaScript Controller Library. [dat.gui]{@link https://github.com/dataarts/dat.gui}.
	 * See <b>options.dat</b> parameter of <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
	 * @param {object} [settings.options.scales] axes scales.
	 * See <b>options.scales</b> parameter of <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
	 * @param {boolean|GuiSelectPoint} [settings.options.guiSelectPoint] <pre>false - do not displays the <a href="../../guiSelectPoint/jsdoc/module-GuiSelectPoint.html" target="_blank">Select Point</a>. [dat.gui]{@link https://github.com/dataarts/dat.gui} based graphical user interface for select a point from the mesh.
	 * Or <b>GuiSelectPoint</b> instance.
	 * </pre>
	 * @param {object} [settings.options.raycaster] for [Raycaster]{@link https://threejs.org/docs/index.html#api/en/core/Raycaster}.
	 * @param {MyThree.ColorPicker.palette|boolean|number} [settings.options.palette] Points сolor.
	 * See <b>options.palette</b> parameter of <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
	 * @param {Function|string} [settings.options.getLanguageCode=language code of your browser] Your custom <b>getLanguageCode()</b> function or language code string.
	 * See <b>options.getLanguageCode</b> parameter of <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
	 * @param {boolean|AxesHelper} [settings.options.axesHelper] <pre>false - do not add the <a href="../../AxesHelper/jsdoc/index.html" target="_blank">AxesHelper</a>.
	 * Or <b>AxesHelper</b> instance.
	 * </pre>
	 * @param {object} [settings.options.frustumPoints] <b>FrustumPoints</b> options. undefined - do not create a <b>FrustumPoints</b> instance.
	 * @param {object} [settings.options.frustumPoints.point={}] points options.
	 * @param {number} [settings.options.frustumPoints.point.size=0] Size of each frustum point.
	 * @param {boolean} [settings.options.frustumPoints.display=true] true - display frustum points.
	 * @param {boolean} [settings.options.frustumPoints.info=false] true - display information about frustum point if user move mouse over or click this point.
	 *
	 * @param {object} [settings.options.frustumPoints.stereo] stereo mode options
	 * @param {number} [settings.options.frustumPoints.stereo.hide=0] Hide the nearby to the camera points in percentage to all points for more comfortable visualisation.
	 * @param {number} [settings.options.frustumPoints.stereo.opacity=0.3] Float in the range of 0.0 - 1.0 indicating how transparent the lines is. A value of 0.0 indicates fully transparent, 1.0 is fully opaque.
	 *
	 * @param {number} [settings.options.frustumPoints.zCount=50] The count of layers of the frustum of the camera's field of view.
	 * @param {number} [settings.options.frustumPoints.yCount=30] The count of vertical points for each z level of the  frustum of the camera's field of view.
	 *
	 * @param {number} [settings.options.frustumPoints.near=0] Shift of the frustum layer near to the camera in percents.
	 * <pre>
	 * 0 percents - no shift.
	 * 100 percents - ближний к камере слой усеченной пирамиды приблизился к дальнему от камеры слою усеченной пирамиды.
	 * </pre>
	 * @param {number} [settings.options.frustumPoints.far=0] Shift of the frustum layer far to the camera in percents.
	 * <pre>
	 * 0 percents - no shift.
	 * 100 percents - дальний от камеры слоем усеченной пирамиды приблизился к ближнему к камере слою усеченной пирамиды.
	 * </pre>
	 * @param {number} [settings.options.frustumPoints.base=100] Scale of the base of the frustum points in percents.
	 * <pre>
	 * 0 base is null
	 * 100 no scale
	 * </pre>
	 * @param {boolean} [settings.options.frustumPoints.square=false] true - Square base of the frustum points.
	 */
	constructor( camera, group, canvas, settings = {} ) {

		const THREE = three$1.THREE;
		settings.options = settings.options || new Options$1();
		const options = settings.options;
		if ( !options.boOptions ) {

			console.error( 'FrustumPoints: call options = new Options( options ) first' );
			return;

		}
		if ( !options.frustumPoints ) return;

		//Непонятно почему frustumPoints не видны если не выполнить эту команду
		//https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/webglcontextlost_event
		this.gl = canvas.getContext('webgl');

		this.getOptions = function () { return options; };
		const optionsShaderMaterial = options.frustumPoints;
		options.frustumPoints = this;

		const _arrayCloud = [];//Массив координат точек, имеющих облако вокруг себя
							//координаты точек сгруппированы в группы отдельно для каждого THREE.Points
		var _guiSelectPoint, _names, _points;
		_arrayCloud.getCloudsCount = function () {

			var count = 0;
			for ( var i = 0; i < _arrayCloud.length; i++ ) {

				var arrayVectors = _arrayCloud[i];
				count += arrayVectors.length;

			}
			return count;

		};

		/**
		 * Pushes to clouds array all points from <b>geometry.attributes.position</b>
		 * @param {THREE.BufferGeometry|THREE.Points} geometry [THREE.BufferGeometry]{@link https://threejs.org/docs/index.html?q=BufferGeometry#api/en/core/BufferGeometry}
		 * or [THREE.Points]{@link https://threejs.org/docs/index.html?q=Poin#api/en/objects/Points}
		 * @returns index of the new array item
		 */
		this.pushArrayCloud = function ( geometry ) {

			var points;
			if ( geometry.geometry ) {

				points = geometry;
				geometry = geometry.geometry;

			}
			if ( geometry.attributes.position.itemSize !== 4 ) {

				console.error( 'FrustumPoints.pushArrayCloud: Invalid geometry.attributes.position.itemSize = ' + geometry.attributes.position.itemSize );
				return;
				
			}

			//Массив точек, имеющих облако _arrayCloud, разбил на группы points
			//В каждой группе points содержатся все точки, из одного mesh
			//Это сделал потому что если одновременно имеются точки с 
			// shaderMaterial и без shaderMaterial, то порядок добавления точек в _arrayCloud
			// Не совпадает с порядком расположения mesh в group
			// потому что точки без shaderMaterial добавляются сразу после создания
			// а точки с shaderMaterial добаляются только после вызова loadShaderText в function getShaderMaterialPoints
			const index = _arrayCloud.getCloudsCount(),
				arrayPoints = [];
			_arrayCloud.push( arrayPoints );
			for ( var i = 0; i < geometry.attributes.position.count; i++ ) {

				const point = new THREE.Vector4().fromArray( geometry.attributes.position.array, i * geometry.attributes.position.itemSize );

				//Здесь коррекитровка point.w не имеет эффекта. Она коррекитруется в FrustumPoints.cloud.updateMesh
//				point.w *= options.scales.w.max;

				arrayPoints.push( point );

			}
			if ( points ) points.userData.cloud = { indexArray: index, };
			return index;

		};

		/** create points
		 * @param {THREE.WebGLRenderer} renderer [THREE.WebGLRenderer]{@link https://threejs.org/docs/index.html#api/en/renderers/WebGLRenderer}.
		 */
		this.create = function ( renderer ) {

			//если нет точек с облаком, то облако нужно создавать что бы его было видно в guiSelectPoint
			//однако в этом случае в консоли появятся сообщения:
			//
			//warning X3557: loop only executes for 0 iteration(s), consider removing [loop]
			//warning X3557: loop doesn't seem to do anything, consider removing [loop]
			//WebGL: INVALID_OPERATION: texImage2D: ArrayBufferView not big enough for request
			//
			//Это означает что из D:\My documents\MyProjects\webgl\three.js\GitHub\commonNodeJS\master\frustumPoints\vertex.c
			//нужно удалить цикл
			//for ( float i = 0.; i < cloudPointsWidth; i++ )
			//
			if ( _arrayCloud.length === 0 )
				return undefined;//нет точек с облаком. Поэтому нет смысла создавать frustumPoints

			const shaderMaterial = {}, zeroPoint = new THREE.Vector3(), cameraDistanceDefault = camera.position.distanceTo( zeroPoint ), _this = this,// lines = []
				groupFrustumPoints = new THREE.Group();

			settings.optionsShaderMaterial = settings.optionsShaderMaterial || {};

			optionsShaderMaterial.point = optionsShaderMaterial.point || {};
			optionsShaderMaterial.point.size = optionsShaderMaterial.point.size || 0.01;//Size of each frustum point

			optionsShaderMaterial.display = optionsShaderMaterial.display === undefined ? true : optionsShaderMaterial.display;//true - display frustum points
			optionsShaderMaterial.info = optionsShaderMaterial.info !== undefined ? optionsShaderMaterial.info : false;//true - display information about frustum point if user move mouse over or click this point.

			//Stereo
			optionsShaderMaterial.stereo = optionsShaderMaterial.stereo || {};
			optionsShaderMaterial.stereo.hide = optionsShaderMaterial.stereo.hide || 0;//Hide the nearby to the camera points in percentage to all points for more comfortable visualisation.
			optionsShaderMaterial.stereo.opacity = optionsShaderMaterial.stereo.opacity || 0.3;//Float in the range of 0.0 - 1.0 indicating how transparent the lines is. A value of 0.0 indicates fully transparent, 1.0 is fully opaque.'

			optionsShaderMaterial.zCount = optionsShaderMaterial.zCount || 50;//The count of layers of the frustum of the camera's field of view.
			optionsShaderMaterial.yCount = optionsShaderMaterial.yCount || 30;//The count of vertical points for each z level of the  frustum of the camera's field of view.

			//изменение размеров усеченной пирамиды FrustumPoints

			optionsShaderMaterial.near = optionsShaderMaterial.near || 0;//Shift of the frustum layer near to the camera in percents.
			//0 percents - no shift.
			//100 percents - ближний к камере слой усеченной пирамиды приблизился к дальнему от камеры слою усеченной пирамиды
			optionsShaderMaterial.far = optionsShaderMaterial.far || 0;//Shift of the frustum layer far to the camera in percents.
			//0 percents - no shift.
			//100 percents - дальний от камеры слоем усеченной пирамиды приблизился к ближнему к камере слою усеченной пирамиды
			optionsShaderMaterial.base = optionsShaderMaterial.base || 100;//Scale of the base of the frustum points in percents.
			//0 base is null
			//100 no scale
			optionsShaderMaterial.square = optionsShaderMaterial.square !== undefined ? optionsShaderMaterial.square : false; //true - Square base of the frustum points.

			const cookie = options.dat.cookie,
				cookieName = options.dat ? options.dat.getCookieName( 'FrustumPoints' ) : 'FrustumPoints';

			Object.freeze( optionsShaderMaterial );
			if ( cookie ) cookie.getObject( cookieName, shaderMaterial, optionsShaderMaterial );

			//оставить shaderMaterial.stereo по умолчанию потому что сейчас lines не использую
			//и возможно в cookie сохранились зачения shaderMaterial.stereo от старых версий этой программы
			//		shaderMaterial.stereo.lines = optionsShaderMaterial.stereo.lines;
			if ( shaderMaterial.stereo ) {

				shaderMaterial.stereo.hide = optionsShaderMaterial.stereo.hide;
				shaderMaterial.stereo.opacity = optionsShaderMaterial.stereo.opacity;

			}

			var cloud = function () {

				var uniforms;
				var distanceTableWidth;//distanceTable points count
				this.create = function ( _uniforms ) {

					uniforms = _uniforms;

					//индекс палитры надо пересчитывать в зависимости от min and max key of the options.scales.w
					//В D:\My documents\MyProjects\webgl\three.js\GitHub\commonNodeJS\master\frustumPoints\vertex.c
					//сначала вычисляется paletteIndex,
					//который равен сумме индексов цветов всех точек cloudPoint.w 
					//помноженное на растояние fDistance от точки имеющей облако до текущей точки frustumPoint.
					//Индексы cloudPoint.w находятся в диапазоне min and max key of the options.scales.w
					//paletteIndex это координата x в палитре palette в D:\My documents\MyProjects\webgl\three.js\GitHub\commonNodeJS\master\frustumPoints\vertex.c
					//которая имеет тип sampler2D https://www.khronos.org/opengl/wiki/Sampler_(GLSL)#Sampler_types
					//которая имеет текстуру 2D texture.
					//Диапазон paletteIndex должен быть в предплах от 0 до 1 https://www.khronos.org/opengl/wiki/Sampler_(GLSL)#Texture_coordinates
					//Получаем пропорции:
					//Если w = options.scales.w.min то paletteIndex = 0.
					//Если w = options.scales.w.max то paletteIndex = 1.
					if ( !options.scales.w ) options.scales.setW();
					const max = options.scales.w.max, min = options.scales.w.min;
					//w = ( w - min ) / ( max - min ) = w / ( max - min ) - min / ( max - min ) = w / (1+1) + 1 / (1+1) = w * 0.5 + 0.5 ;
					uniforms.paletteA = { value: 1 / ( max - min ) };//0.5 };
					uniforms.paletteB = { value: - min / ( max - min ) };//0.5 };

					//array of all points with cloud
					this.cloudPoints = new this.addUniforms( THREE.RGBAFormat, _arrayCloud.getCloudsCount(), 'cloudPoints' );

					//function of distance between points. Use for creating of the cloud around point
					//distanceTable is THREE.DataTexture
					//	width = distanceTableWidth( distanceTable points count )
					//	height = 2
					//THREE.DataTexture contains two lines:
					//	Every line have x from 0 to width - 1
					//	First line (y = 0) is function of distance
					//	Second line (y = 1) is distance from cloud point to frustum point
					//Такая структура distanceTable позволяет неравномерно распределять точки по дистанции
					//Если function of distance меняется быстро, то надо наставить побольше точек
					//Если function of distance почти не меняется, точек можно поставить поменьше
					//Это позволит поставить последнюю точку на достаточно большой дистанции
					//и таким образом можно учитывать малое влияние облака на большом расстоянии.
					distanceTableWidth = 256;//distanceTable points count
					const pointLength = 2;//Every point contains two coordinates
					new this.addUniforms( THREE.LuminanceFormat,//RGFormat,//RGBFormat,
						distanceTableWidth, 'distanceTable', {

						height: pointLength,
						onReady: function ( data, itemSize, updateItem ) {

							//debug
							//var linePoints = [];
							////////////////////////////
							var fDistancePrev, x = 0;
							const dDistanceMax = 0.035;
							var dx = 0.5 / ( distanceTableWidth - 1 ); const ddx = 1.001;
							//dx = 0.00196078431372549
							//ddx	xmax
							//1.001	0.5686435272529023 y = 9.515363374066325e-8
							//var dx = 1.5 / ( distanceTableWidth - 1 ); const ddx = 1.001;
							//dx = 0.0058823529411764705
							//ddx	xmax
							//1.001	1.686899158126089 y = 1.614196454247848e-62
							//1.01	5.688013140820184
							//1.05	11783.008823594038
							//1.1	285390429.9744771
							//var dx = 2/ ( distanceTableWidth - 1 ); const ddx = 1.001;
							//dx = 0.00784313725490196
							//ddx	xmax
							//1.001	2.2149519380160148 y = 2.932926014021469e-107
							//1.01	7.0082200110085715
							//1.05	12925.219146819716
							//1.1	314479812.6420277
							//var dx = 20/ ( distanceTableWidth - 1 ); const ddx = 1.1;
							//dx = 0.0784313725490196
							//ddx	xmax
							//1.001	22.56677751344284 y = 0
							//1.1	11942365647.747343 y = 0
							for ( var i = 0; i < distanceTableWidth; i++ ) {

								var fDistance = getStandardNormalDistribution( x );
								//console.warn( 'dx = ' + dx );
								x += dx;
								if ( fDistancePrev !== undefined ) {

									if ( Math.abs( fDistancePrev - fDistance ) > dDistanceMax )
										dx /= ddx;
									else dx *= ddx;

								}
								fDistancePrev = fDistance;

								updateItem( i, fDistance );//function of distance
								updateItem( i + distanceTableWidth, x );//distance from cloud point to frustum point

								//debug
								//if ( linePoints !== undefined )
								//	linePoints.push( new THREE.Vector3( x, fDistance, 0 ) );
								////////////////////////////

							}

							//debug
							/*
							if ( linePoints !== undefined ) {

								//group.add( new THREE.Line( new THREE.BufferGeometry().setFromPoints( linePoints ), new THREE.LineBasicMaterial( {
								//	color: 0x0000ff
								//} ) ) );
								group.add( new THREE.Points( new THREE.BufferGeometry().setFromPoints( linePoints ),
									new THREE.PointsMaterial( { color: 0xffffff, alphaTest: 0.5 } ) ) );

							}
							*/
							////////////////////////////

						}

					} );

				};
				this.addUniforms = function ( format, width, key, optionsAddUniforms ) {

					optionsAddUniforms = optionsAddUniforms || {};
					//format = RGBAFormat,//LuminanceFormat,//Available formats https://threejs.org/docs/index.html#api/en/constants/Textures
					//D:\My documents\MyProjects\webgl\three.js\GitHub\three.js\dev\src\constants.js
					const itemSize = format === THREE.RGBAFormat ? 4 : format === THREE.RGBFormat ? 3 : format === THREE.LuminanceFormat ? 1 : NaN;
					const height = optionsAddUniforms.height || 1,//format === THREE.LuminanceFormat ? 1 : 2,
						size = width * height,
						type = THREE.FloatType,
						data = type === THREE.FloatType ? new Float32Array( itemSize * size ) : new Uint8Array( itemSize * size );
					/*Uncaught TypeError: Right-hand side of 'instanceof' is not callable
					if( !this instanceof cloud )
						console.error('');
					*/
					if ( this.addUniforms !== undefined )
						console.error( 'Please use "new this.addUniforms(...)"' );
					this.updateItem = function ( i, vector ) {

						var x, y, z, w;
						if ( typeof vector === "number" )
							x = vector;
						else if ( vector.x === undefined ) {

							x = vector.r;
							y = vector.g;
							z = vector.b;
							
							w = 1;//remove warning : THREE.WebGLRenderer: THREE.RGBFormat has been removed. Use THREE.RGBAFormat instead. https://github.com/mrdoob/three.js/pull/23228

						} else {

							x = vector.x;
							y = vector.y;
							z = vector.z;
							if ( isNaN( vector.w ) )
								console.error( 'frustumPoints.create.cloud.addUniforms.updateItem: vector.w = ' + vector.w + '. Probably you use THREE.Color for w coordinate of the point with cloud.' );

							/*
							//w это координата x в палитре palette в D:\My documents\MyProjects\webgl\three.js\GitHub\commonNodeJS\master\frustumPoints\vertex.c
							//которая имеет тип sampler2D https://www.khronos.org/opengl/wiki/Sampler_(GLSL)#Sampler_types
							//которая имеет текстуру 2D texture.
							//Диапазон w должен быть в предплах от 0 до 1 https://www.khronos.org/opengl/wiki/Sampler_(GLSL)#Texture_coordinates
							//Получаем пропорции:
							//Если vector.w = options.scales.w.min то w = 0.
							//Если vector.w = options.scales.w.max то w = 1.
							const max = options.scales.w.max, min = options.scales.w.min;
							w = ( vector.w - min ) / ( max - min );
							*/
							w = vector.w;

						}
						const vectorSize = y === undefined ? 1 : z === undefined ? 2 : w === undefined ? 3 : 4,
							stride = i * itemSize;
						if ( vectorSize !== itemSize )
							console.error( 'frustumPoints.create.cloud.addUniforms.updateItem: vectorSize = ' + vectorSize + ' !== itemSize = ' + itemSize );
						data[stride] = x;
						if ( itemSize > 1 ) {

							data[stride + 1] = y;
							if ( itemSize > 2 ) {

								data[stride + 2] = z;
								if ( itemSize > 3 )
									data[stride + 3] = w;

							}

						}

					};

					if ( optionsAddUniforms.onReady !== undefined )
						optionsAddUniforms.onReady( data, itemSize, this.updateItem );

					uniforms[key] = {

						value: new THREE.DataTexture( data,
							width, height, format, type )

					};
					uniforms[key].value.needsUpdate = true;

					return itemSize;

				};
				this.editShaderText = function ( shaderText ) {

					var scloudPointsWidth = 0;
					for ( var i = 0; i < _arrayCloud.length; i++ ) {

						var arrayVectors = _arrayCloud[i];
						scloudPointsWidth += arrayVectors.length;

					}
					shaderText.vertex = shaderText.vertex.replace( '%scloudPointsWidth', scloudPointsWidth + '.' );
					shaderText.vertex = shaderText.vertex.replace( '%distanceTableWidth', distanceTableWidth + '.' );

				};
				this.updateMesh = function ( mesh ) {

					if (
						( mesh.userData.cloud === undefined )
						|| !this.cloudPoints//Пользователь убрал галочку в 'Display' - 'Display or hide Frustum Points.'
					)
						return;
					for ( var i = 0; i < mesh.geometry.attributes.position.count; i++ ) {

						const point = new THREE.Vector4().fromArray( mesh.geometry.attributes.position.array, i * mesh.geometry.attributes.position.itemSize );
						this.cloudPoints.updateItem( mesh.userData.cloud.indexArray + i, getWorldPosition( mesh, point ) );

					}

				};

			};
			cloud = new cloud();
			group.add( groupFrustumPoints );

			function setPointsParams() {

				function set() {

					if ( !_points )
						return;
					_points.position.copy( camera.position );
					_points.rotation.set( camera.rotation.x, camera.rotation.y, camera.rotation.z );
					var scale = camera.position.distanceTo( zeroPoint ) / cameraDistanceDefault;
					_points.scale.x = scale;
					_points.scale.y = scale;
					_points.scale.z = scale;

				}
				set();
				/*
				console.warn( '_points.position: ' + _points.position.x + ' ' + _points.position.y + ' ' + _points.position.z +
				' _points.scale: ' + _points.scale.x + ' ' + _points.scale.y + ' ' + _points.scale.z +
				' _points.rotation: ' + _points.rotation.x + ' ' + _points.rotation.y + ' ' + _points.rotation.z );
				*/
				if ( options.guiSelectPoint ) options.guiSelectPoint.setMesh();

			}
			function update( onReady ) {

				if ( _points === undefined ) {

					progress( onReady );

				}

			}
			/**
			 * The user has moved the camera
			 * @event
			 * */
			this.onChangeControls = function () {

				if ( !debug.notMoveFrustumPoints ) {

					_this.update();

				}

			};
			function progress( onReady ) {

				if ( !shaderMaterial.display )
					return;

				const cameraPerspectiveHelper = new THREE.CameraHelper( camera );

				var array, indexArray = 0;

				function getPoint( pointName ) {

					var points = cameraPerspectiveHelper.pointMap[pointName],
						position = cameraPerspectiveHelper.geometry.attributes.position;
					return new THREE.Vector3().fromArray( position.array, points[0] * position.itemSize )

				}

				//near точки ближней к камере плоскости усеченной пирамиды
				const point_n1 = getPoint( 'n1' ),
					point_n2 = getPoint( 'n2' ),
					point_n3 = getPoint( 'n3' );

				//far точки основания пирамиды

				const point_f1 = getPoint( 'f1' ),
					point_f2 = getPoint( 'f2' ),
					point_f3 = getPoint( 'f3' );

				//изменение размеров усеченной пирамиды FrustumPoints

				//Scale of the base of the frustum points.
				point_n1.x = ( point_n1.x * shaderMaterial.base ) / 100;
				point_n2.x = ( point_n2.x * shaderMaterial.base ) / 100;
				point_n3.x = ( point_n3.x * shaderMaterial.base ) / 100;
				point_n1.y = ( point_n1.y * shaderMaterial.base ) / 100;
				point_n2.y = ( point_n2.y * shaderMaterial.base ) / 100;
				point_n3.y = ( point_n3.y * shaderMaterial.base ) / 100;
				point_f1.x = ( point_f1.x * shaderMaterial.base ) / 100;
				point_f2.x = ( point_f2.x * shaderMaterial.base ) / 100;
				point_f3.x = ( point_f3.x * shaderMaterial.base ) / 100;
				point_f1.y = ( point_f1.y * shaderMaterial.base ) / 100;
				point_f2.y = ( point_f2.y * shaderMaterial.base ) / 100;
				point_f3.y = ( point_f3.y * shaderMaterial.base ) / 100;

				//Square base of the frustum points.
				if ( shaderMaterial.square ) {

					point_n1.x /= camera.aspect;
					point_n2.x /= camera.aspect;
					point_n3.x /= camera.aspect;
					point_f1.x /= camera.aspect;
					point_f2.x /= camera.aspect;
					point_f3.x /= camera.aspect;

				}

				const pointn1x = point_n1.x, pointn2x = point_n2.x, pointn3x = point_n3.x,
					pointn1y = point_n1.y, pointn2y = point_n2.y, pointn3y = point_n3.y,
					pointn1z = point_n1.z;
				//Shift of the frustum layer near to the camera
				point_n1.x = point_n1.x + ( ( point_f1.x - point_n1.x ) * shaderMaterial.near ) / 100;
				point_n2.x = point_n2.x + ( ( point_f2.x - point_n2.x ) * shaderMaterial.near ) / 100;
				point_n3.x = point_n3.x + ( ( point_f3.x - point_n3.x ) * shaderMaterial.near ) / 100;
				point_n1.y = point_n1.y + ( ( point_f1.y - point_n1.y ) * shaderMaterial.near ) / 100;
				point_n2.y = point_n2.y + ( ( point_f2.y - point_n2.y ) * shaderMaterial.near ) / 100;
				point_n3.y = point_n3.y + ( ( point_f3.y - point_n3.y ) * shaderMaterial.near ) / 100;
				point_n1.z = point_n2.z = point_n3.z = point_n1.z + ( ( point_f1.z - point_n1.z ) * shaderMaterial.near ) / 100;
				//Shift of the frustum layer far to the camera
				point_f1.x = point_f1.x + ( ( pointn1x - point_f1.x ) * shaderMaterial.far ) / 100;
				point_f2.x = point_f2.x + ( ( pointn2x - point_f2.x ) * shaderMaterial.far ) / 100;
				point_f3.x = point_f3.x + ( ( pointn3x - point_f3.x ) * shaderMaterial.far ) / 100;
				point_f1.y = point_f1.y + ( ( pointn1y - point_f1.y ) * shaderMaterial.far ) / 100;
				point_f2.y = point_f2.y + ( ( pointn2y - point_f2.y ) * shaderMaterial.far ) / 100;
				point_f3.y = point_f3.y + ( ( pointn3y - point_f3.y ) * shaderMaterial.far ) / 100;
				point_f1.z = point_f2.z = point_f3.z = point_f1.z + ( ( pointn1z - point_f1.z ) * shaderMaterial.far ) / 100;

				const pointStart = new THREE.Vector3().copy( point_n1 );
				const zCount = shaderMaterial.zCount,
					zStep = ( point_f1.z - point_n1.z ) / ( ( zCount - 1 ) * ( zCount - 1 ) );

				//смещение по оси x
				var zx = 0;
				const yCount = shaderMaterial.yCount,
					xCount = yCount * ( shaderMaterial.square ? 1 : parseInt( camera.aspect ) );
				var zy = 0;//смещение по оси y

				//You can see the Chrome memory crash if you has set very big shaderMaterial.zCount or  shaderMaterial.yCount. (about 900000).
				//Unfortunately you cannot to catch memory crash. https://stackoverflow.com/questions/44531357/how-to-catch-and-handle-chrome-memory-crash
				//Instead I temporary set shaderMaterial.zCount to default value and restore it after creating of all z levels.
				//Now you can see default shaderMaterial.zCount after memory crash and reloading of the wab page.
				shaderMaterial.zCount = optionsShaderMaterial.zCount;
				shaderMaterial.yCount = optionsShaderMaterial.yCount;

				const zStart = parseInt( ( zCount * shaderMaterial.stereo.hide ) / 100 ),
					zEnd = zStart + zCount - 1;
				function Z( z ) {

					//console.warn( 'z ' + z );
					const ynStep = ( point_n3.y - point_n1.y ) / ( yCount - 1 ),
						yfStep = ( point_f3.y - point_f1.y ) / ( yCount - 1 ),
						yStep = ( ( yfStep - ynStep ) / ( ( zCount - 1 ) * ( zCount - 1 ) ) ) * z * z + ynStep,
						sqrtZCount = parseInt( Math.sqrt( zCount ) ),
						yzStep = yStep / ( sqrtZCount + parseInt( Math.sqrt( zCount - ( sqrtZCount * sqrtZCount ) ) ) ),//координату точки надо немного сдвинуть в зависимости от z что бы точки не накладывались друг на друга

						xnStep = ( point_n2.x - point_n1.x ) / ( xCount - 1 ),
						xfStep = ( point_f2.x - point_f1.x ) / ( xCount - 1 ),
						xStep = ( ( xfStep - xnStep ) / ( ( zCount - 1 ) * ( zCount - 1 ) ) ) * z * z + xnStep,
						xzStep = xStep / parseInt( Math.sqrt( zCount ) );//координату точки надо немного сдвинуть в зависимости от z что бы точки не накладывались друг на друга
					pointStart.y = - yStep * ( yCount - 1 ) / 2;
					pointStart.x = - xStep * ( xCount - 1 ) / 2;
					for ( var y = 0; y < yCount; y++ ) {

						for ( var x = 0; x < xCount; x++ )
							if ( z >= zStart ) {

								function addPoint( point ) {

									_names.push(

										x === 0 ?
											y === 0 ? { y: y, z: z } : { y: y } :
											x

									);
									array[indexArray] = point.x;
									indexArray++;
									array[indexArray] = point.y;
									indexArray++;
									array[indexArray] = point.z;
									indexArray++;

								}
								addPoint( new THREE.Vector3(

									pointStart.x + xStep * x + xzStep * zx,
									pointStart.y + yStep * y + yzStep * zy,
									pointStart.z + zStep * z * z

								) );

							}

					}
					zx++;
					if ( zx >= parseInt( Math.sqrt( zCount ) ) ) {

						zx = 0;
						zy++;

					}

				}
				function eachZ( zStart, zEnd ) {

					if ( zStart > zEnd )
						return;
					Z( zStart );
					if ( zStart >= zEnd )
						return;
					Z( zEnd );
					var zMid = parseInt( ( zStart + zEnd ) / 2 );
					if ( zMid === zStart )
						return;//for testing set 'Z Count' = 6
					Z( zMid );
					eachZ( zStart + 1, zMid - 1 );
					eachZ( zMid + 1, zEnd - 1 );

				}

				//For Chrome memory crash see above.
				shaderMaterial.zCount = zCount;
				shaderMaterial.yCount = yCount;

				//если оставить эту строку то когда произойдет переполнение памяти, веб страница вечно будет не открываться
				//for testing set 'Z Count' = 100 and 'Y count' = 1000
				//saveSettings();

				removePoints( true );

				const itemSize = 3;
				_this.pointIndexes = function ( pointIndex ) {

					if ( _names === undefined ) {

						console.error( '_names = ' + _names );//сюда попадает в отладочной версии
						return undefined;

					}
					var name = _names[pointIndex], x, y, z, index = pointIndex;
					function getObject() {

						index--;
						while ( ( index >= 0 ) && ( typeof _names[index] !== "object" ) )
							index--;
						name = _names[index];

					}
					function getZ() {

						while ( ( index >= 0 ) && ( name.z === undefined ) )
							getObject();

					}
					if ( typeof name === "object" ) {

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

				//Thanks to https://stackoverflow.com/a/27369985/5175935
				//Такая же функция есть в myPoints.js но если ее использовать то она будет возвращать путь на myPoints.js
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
				//console.warn( 'getCurrentScriptPath = ' + getCurrentScriptPath() );
				var path = getCurrentScriptPath();
				var cameraPositionDefault = new THREE.Vector3( camera.position.x, camera.position.y, camera.position.z );
				var cameraQuaternionDefault = new THREE.Vector4( camera.quaternion.x, camera.quaternion.y, camera.quaternion.z, camera.quaternion.w );

				//сделал это приравниванеие что бы избежать двойного создания массива точек frustumPoints MyThree.MyPoints(...)
				//Если это произойдет, то непонятно почему для каждой точки будет создано два облака
				//Одно облако верное
				//Второе находится строго между точкой и камерой
				//Второе облако можно увидеть если повернуть камеру с помощью orbitControl
				//Сюда попадает по второму разу если вызвать stereoEffect.gui(...)
				_points = false;

				new MyPoints( function () {

					var geometry = new THREE.BufferGeometry(),
						geometryLength = ( zEnd - zStart + 1 ) * xCount * yCount;

					array = new Float32Array( geometryLength * itemSize );
					indexArray = 0;
					_names = null;
					_names = [];

					eachZ( zStart, zEnd );

					geometry.setAttribute( 'position', new THREE.BufferAttribute( array, itemSize ) );

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
						pointIndexes: function ( pointIndex ) { return _this.pointIndexes( pointIndex ); },
						path: {

							vertex: path + '/frustumPoints/vertex.c',

						},
						pointName: function ( pointIndex ) {

							var indexes = _this.pointIndexes( pointIndex );
							if ( indexes === undefined )
								return indexes;
							return 'x = ' + indexes.x + ', y = ' + indexes.y + ', z = ' + ( indexes.z + zStart ) + ', i = ' + pointIndex;

						},
						controllers: function () {

							if ( _guiSelectPoint ) _guiSelectPoint.appendChild( { xCount: xCount, yCount: yCount, zCount: zCount, } );

						},
						uniforms: function ( uniforms ) {

							cloud.create( uniforms );

							//rotate the quaternion vector to 180 degrees
							cameraQuaternionDefault.x = - cameraQuaternionDefault.x;
							cameraQuaternionDefault.y = - cameraQuaternionDefault.y;
							cameraQuaternionDefault.z = - cameraQuaternionDefault.z;

							cameraPositionDefault.applyQuaternion( cameraQuaternionDefault );

							uniforms.cameraPositionDefault = { value: cameraPositionDefault };
							uniforms.cameraQuaternion = { value: camera.quaternion };

							//palette
							//ВНИМАНИЕ!!! Для того, что бы палитра передалась в vertex надо добавить
							//points.material.uniforms.palette.value.needsUpdate = true;
							//в getShaderMaterialPoints.loadShaderText

							
							new cloud.addUniforms(THREE.RGBAFormat, 256, 'palette', {

								onReady: function ( data, itemSize, updateItem ) {

									options.scales.setW();
									const min = options.scales.w.min, max = options.scales.w.max;
									const size = data.length / itemSize;
									for ( var i = 0; i < size; i++ )
										updateItem( i, options.palette.toColor( ( max - min ) * i / ( size - 1 ) + min, min, max ) );

								}

							} );
							return cloud;

						},
						onReady: function ( points ) {

							_points = points;
							_points.userData.isInfo = function () { return shaderMaterial.info; };

							if ( shaderMaterial.info && options.raycaster )
								options.raycaster.addParticle( _points );

							if ( !shaderMaterial.display )
								removePoints();
							pointOpacity = _points === undefined ?
								1.0 :
								_points.userData.shaderMaterial === undefined ? shaderMaterial.point.opacity : _points.userData.shaderMaterial.point.opacity;

							if ( onReady !== undefined )
								onReady();//Пользователь изменил настройки frustumPoints

							//когда задан параметр cameraTarget у MyThree то нужно передвинуть frustumPoints после того как созданы points
							_this.update();

							if ( options.guiSelectPoint ) options.guiSelectPoint.addMesh( _points );

						},

					}

				} );

			}
			update();
			var pointOpacity;
			/** Moves frustum points in front of the camera. */
			this.update = function ( onReady ) {

				update( onReady );

				//Эта команда нужна в случае изменения размера окна браузера когда canvas на весь экран
				setPointsParams();

				var cameraQuaternionDefault = new THREE.Vector4( camera.quaternion.x, camera.quaternion.y, camera.quaternion.z, camera.quaternion.w );

				if ( !_points )
					return;//User has changed 'Z Count' of the frustumPoints

				_points.material.uniforms.cameraPositionDefault.value.copy( camera.position );

				//rotate the quaternion vector to 180 degrees
				cameraQuaternionDefault.x = - cameraQuaternionDefault.x;
				cameraQuaternionDefault.y = - cameraQuaternionDefault.y;
				cameraQuaternionDefault.z = - cameraQuaternionDefault.z;

				_points.material.uniforms.cameraPositionDefault.value.applyQuaternion( cameraQuaternionDefault );

			};
			/** 
			 *  @returns true - frustum points is created and visible.
			 *  <p>false - frustum points have been removed.</p>
			 * */
			this.isDisplay = function () { return shaderMaterial.display; };
			/** Updates the cloud's points according new position of the all points of the all meshes
			 * of the group of objects to which a new FrustumPoints has been added. */
			this.updateCloudPoints = function () {

				group.children.forEach( function ( mesh ) {

					if ( !mesh.userData.cloud )
						return;
					if ( mesh.geometry.attributes.position.itemSize !== 4 ) {

						console.error( 'mesh.geometry.attributes.position.itemSize = ' + mesh.geometry.attributes.position.itemSize );
						return;

					}
					cloud.updateMesh( mesh );

				} );
				needsUpdate();

			};
			function needsUpdate() {

				if ( _points )
					_points.material.uniforms.cloudPoints.value.needsUpdate = true;

			}
			/**
			 * 
			 * @param {THREE.Mesh} mesh [Mech]{@link https://threejs.org/docs/index.html#api/en/objects/Mesh}
			 */
			this.updateCloudPoint = function ( mesh ) {

				cloud.updateMesh( mesh );
				needsUpdate();

			};
			/**
			 * The user has changed selected point.
			 * @event
			 * @param {THREE.Points} points [Points]{@link https://threejs.org/docs/index.html?q=Poin#api/en/objects/Points}
			 * @param {number} i index of the point from <b>points</b> for udating
			 */
			this.updateCloudPointItem = function ( points, i ) {

				if ( points.userData.cloud === undefined )
					return;
				if ( points.geometry.attributes.position.itemSize !== 4 )
					console.error( 'points.geometry.attributes.position.itemSize = ' + points.geometry.attributes.position.itemSize );
				cloud.cloudPoints.updateItem( points.userData.cloud.indexArray + i,
					getWorldPosition( points,
						new THREE.Vector4().fromArray( points.geometry.attributes.position.array, i * points.geometry.attributes.position.itemSize ) ),
					true );
				needsUpdate();

			};

			//Convert all points with cloud, but not shaderMaterial from local to world positions
			// i.e. calculate scales, positions and rotation of the points.
			//Converting of all points with cloud and shaderMaterial see getShaderMaterialPoints function in the myPoints.js file
			//		this.updateCloudPoints();

			function removePoints( notRemoveMesh ) {

				if ( _points === undefined )
					return;
				if ( !notRemoveMesh && options.guiSelectPoint )
					options.guiSelectPoint.removeMesh( _points );//не удаляю frustumPoints из списка Meshes потому что сюда попадает только если пользователь изменил число точек frustumPoints.
				//В этом случае создается новый frustumPoints, который надо присоеденить к старому frustumPoints из списка Meshes.
				//Если я удалю frustumPoints из списка Meshes а потом добавлю туда новый frustumPoints,
				//то изменится индекс frustumPoints в списке Meshes
				//и тогда неверно будет выполняться function update() в frustumPoints и как результат буде неверный список Ponts списке Meshes
				//for testing
				//Select in the canvas any point, but not frustum point.
				//Now you can see your selected point in the in the Meshes/Points/Select list in the gui.
				//Change Settings/Frustum Points/Z count in the gui.
				//Now your selected point is deselected.
				//Select in the canvas your point again.
				//Now yiou can see "Cannot read property 'selected' of undefined" error message in the console.
				//Try to select your point in the gui. You can not to do it because your point is not exists in the Meshes/Points/Select list. Instead you see all Frustum Points in the Meshs/Points/Select list.

				group.remove( _points );
				renderer.renderLists.dispose();
				clearThree$1( _points );
				_points = undefined;

			}
			/** Called from animate loop for rendering.
			 * @see {@link https://threejs.org/docs/index.html?q=animate#manual/en/introduction/Creating-a-scene|Rendering the scene}*/
			this.animate = function () {

				if (
					!_points ||
					( _points.userData.shaderMaterial === undefined ) ||
					(
						( pointOpacity === _points.userData.shaderMaterial.point.opacity ) )
				) {

					return false;

				}
				pointOpacity = _points.userData.shaderMaterial.point.opacity;
				_points.material.uniforms.opacity.value = _points.userData.shaderMaterial.point.opacity;
				return true;

			};

			/** update "frustum points" item in the <a href="../../guiSelectPoint/jsdoc/index.html" target="_blank">GuiSelectPoint</a>.*/
			this.updateGuiSelectPoint = function () {


				//Не помню почему не удаляю старый points из списка cMeshs, но если так делать, то будут какие то запутанные косяки.
				//Поэтому не удаляю points из списка cMeshs а только получаю индекс points в этом списке.
				const index = options.guiSelectPoint ? options.guiSelectPoint.getMeshIndex( _points ) : undefined;

				update();

				//затем заменяю указатель на старый points в списке cMeshs на новый.
				if ( index ) options.guiSelectPoint.setIndexMesh( index, _points );

			};

			/**
			* @callback FolderPoint
			* @param {object} folder parent folder
			* @param {function} setSettings save points setting to the cookie
			*/

			/**
			 * Adds FrustumPoints folder into dat.GUI.
			 * See [dat.GUI API]{@link https://github.com/dataarts/dat.gui/blob/master/API.md}.
			 * @param {object} [folder] parent folder
			 */
			this.gui = function ( folder ) {

				const dat = three$1.dat;//options.dat.dat;

				folder = folder || options.dat.gui;
				if ( !folder || options.dat.guiFrustumPoints === false )
					return;

				//Localization

				const lang = {

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
					yCountTitle: "The count of vertical points for each z level of the  frustum of the camera's field of view.",

				};
				switch ( options.getLanguageCode() ) {

					case 'ru'://Russian language

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
					default://Custom language
						if ( ( options.lang === undefined ) || ( options.lang.languageCode != languageCode ) )
							break;

						Object.keys( options.lang ).forEach( function ( key ) {

							if ( lang[key] === undefined )
								return;
							lang[key] = options.lang[key];

						} );

				}

				function saveSettings() {

					cookie.setObject( cookieName, shaderMaterial );

				}
				const fFrustumPoints = folder.addFolder( lang.frustumPoints );
				dat.folderNameAndTitle( fFrustumPoints, lang.frustumPoints, lang.frustumPointsTitle );

				function displayControllers( value ) {

					var display = value ? 'block' : 'none';
					folderPoint.display( display );
					cZCount.__li.style.display = display;
					cYCount.__li.style.display = display;

				}
				//Display frustumPoints
				const cDisplay = fFrustumPoints.add( shaderMaterial, 'display' ).onChange( function ( value ) {

					if ( shaderMaterial.display ) {

						update();

					} else {

						if ( options.raycaster ) options.raycaster.removeParticle( _points );
						removePoints();

					}
					displayControllers( shaderMaterial.display );
					saveSettings();

				} );
				dat.controllerNameAndTitle( cDisplay, lang.display, lang.displayTitle );

				//FrustumPoints info.
				//Display information about frustum point if user move mouse over or click this point.
				const cInfo = !options.raycaster ? undefined : fFrustumPoints.add( shaderMaterial, 'info' ).onChange( function ( value ) {

					if ( _points === undefined ) {

						saveSettings();
						return;

					}
					if ( shaderMaterial.info ) {

						if ( options.raycaster ) options.raycaster.addParticle( _points );
						
					} else {

						if ( options.guiSelectPoint ) options.guiSelectPoint.selectPoint( -1 );
						if ( options.raycaster ) options.raycaster.removeParticle( _points );

					}
					saveSettings();

				} );
				if ( cInfo ) dat.controllerNameAndTitle( cInfo, lang.info, lang.infoTitle );

				//Shift of the frustum layer near to the camera in percents
				const cNear = fFrustumPoints.add( shaderMaterial, 'near', 0, 100, 1 ).onChange( function ( value ) { update(); } );
				dat.controllerNameAndTitle( cNear, lang.near, lang.nearTitle );

				//Shift of the frustum layer far to the camera in percents
				const cFar = fFrustumPoints.add( shaderMaterial, 'far', 0, 100, 1 ).onChange( function ( value ) { update(); } );
				dat.controllerNameAndTitle( cFar, lang.far, lang.farTitle );

				//Scale of the base of the frustum points in percents.
				const cBase = fFrustumPoints.add( shaderMaterial, 'base', 0, 100, 1 ).onChange( function ( value ) { update(); } );
				dat.controllerNameAndTitle( cBase, lang.base, lang.baseTitle );

				//Square base of the frustum points.
				const cSquare = fFrustumPoints.add( shaderMaterial, 'square' ).onChange( function ( value ) { update(); } );
				dat.controllerNameAndTitle( cSquare, lang.square, lang.squareTitle );

				const folderPoint = new FolderPoint( shaderMaterial.point, function ( value ) {

					//Не помню зачем это написал
					if ( value === undefined ) {

						console.warn( 'under constraction' );

					}
					if ( value < 0 )
						value = 0;

					_points.material.uniforms.pointSize.value = value;

					folderPoint.size.setValue( value );
					shaderMaterial.point.size = value;
					saveSettings();

				}, new Options$1( { dat: {gui: options.dat.gui } } ), {

					folder: fFrustumPoints,
					defaultPoint: { size: 0.01 },
					PCOptions: {

						settings: { offset: 0.1 },
						max: 0.1,

					},

				} );

				var toUpdate = true,//Когда пользователь нажимает кнопку Default надо установить toUpdate = false
					//что бы несколько раз не вызывался _this.update(); чтобы быстрее работало
					canUpdate = true,
					_this = this;

				function update() {

					if ( !toUpdate || !canUpdate )
						return;
					canUpdate = false;

					//Не помню почему не удаляю старый points из списка cMeshs, но если так делать, то будут какие то запутанные косяки.
					//Поэтому не удаляю points из списка cMeshs а только получаю индекс points в этом списке.
					const index = options.guiSelectPoint ? options.guiSelectPoint.getMeshIndex( _points ) : undefined;

					if ( options.raycaster ) options.raycaster.removeParticle( _points );
					removePoints( true );

					_this.update( function () {

						//затем заменяю указатель на старый points в списке cMeshs на новый.
						if ( options.guiSelectPoint ) options.guiSelectPoint.setIndexMesh( index, _points );

						saveSettings();
						canUpdate = true;

						_points.userData.controllers();

					} );

				}

				//zCount
				const cZCount = fFrustumPoints.add( shaderMaterial, 'zCount' ).min( 3 ).step( 1 ).onChange( function ( value ) { update(); } );
				dat.controllerNameAndTitle( cZCount, lang.zCount, lang.zCountTitle );

				//yCount
				const cYCount = fFrustumPoints.add( shaderMaterial, 'yCount' ).min( 3 ).step( 1 ).onChange( function ( value ) { update(); } );
				dat.controllerNameAndTitle( cYCount, lang.yCount, lang.yCountTitle );

				//Default button
				dat.controllerNameAndTitle( fFrustumPoints.add( {

					defaultF: function ( value ) {

						toUpdate = false;

						cDisplay.setValue( optionsShaderMaterial.display );
						if ( cInfo ) cInfo.setValue( optionsShaderMaterial.info );

						cNear.setValue( optionsShaderMaterial.near );
						cFar.setValue( optionsShaderMaterial.far );
						cBase.setValue( optionsShaderMaterial.base );
						cSquare.setValue( optionsShaderMaterial.square );

						folderPoint.size.setValue( optionsShaderMaterial.point.size );

						cZCount.setValue( optionsShaderMaterial.zCount );
						cYCount.setValue( optionsShaderMaterial.yCount );

						toUpdate = true;
						update();
						saveSettings();

					},

				}, 'defaultF' ), lang.defaultButton, lang.defaultTitle );
				displayControllers( shaderMaterial.display );

			};
			return this;

		};

		/** @class [GUI]{@link https://github.com/anhr/dat.gui} for select a frustum point.
		 *  Uses in the <a href="../../guiSelectPoint/jsdoc/index.html" target="_blank">guiSelectPoint</a>.
		 */
		this.guiSelectPoint = function () {

			var cFrustumPointsX = null, cFrustumPointsY = null, cFrustumPointsZ = null;
			_guiSelectPoint = this;
			/**
			 * create controls
			 * @param {GUI} fPoints parent folder. See [GUI]{@link https://github.com/anhr/dat.gui}.
			 * @param {string} languageCode Localization. The "primary language" subtag of the language version of the browser.
			 * <pre>
			 * Examples: "en" - English language, "ru" Russian.
			 * See the {@link https://tools.ietf.org/html/rfc4646#section-2.1|rfc4646 2.1 Syntax} for details.
			 * </pre>
			 */
			this.create = function ( fPoints, languageCode ) {

				const dat = three$1.dat;//options.dat.dat;
				function frustumPointsControl( name ) {


					//Localization

					const lang = {

						notSelected: 'Not selected',

					};

					switch ( languageCode ) {

						case 'ru'://Russian language
							lang.notSelected = 'Не выбран';

							break;

					}

					const controller = fPoints.add( { Points: lang.notSelected }, 'Points', { [lang.notSelected]: -1 } ).onChange( function ( value ) {

						const index = _guiSelectPoint.getSelectedIndex();
						if ( index === null ) {

							if ( options.axesHelper ) options.axesHelper.exposePosition();
							return;

						}
						options.guiSelectPoint.select( { object: _points, index: index } );

					} );
					controller.__select[0].selected = true;
					//Не стоит переименовывать шкалы потому что шкала frustumPoints не совпадает со общей шкалой
					//			dat.controllerNameAndTitle( controller, scales[name].name ? scales[name].name : name );
					dat.controllerNameAndTitle( controller, name );
					return controller;

				}

				cFrustumPointsX = frustumPointsControl( 'x' );
				cFrustumPointsY = frustumPointsControl( 'y' );
				cFrustumPointsZ = frustumPointsControl( 'z' );

			};

			/**
			 * Append new item into controller
			 * @param {object} count Count of points in the FrustumPoints
			 * @param {number} count.xCount Count of rows of the points in the x axis
			 * @param {number} count.yCount Count of rows of the points in the y axis
			 * @param {number} count.zCount Count of layers of the points in the z axis
			 */
			this.appendChild = function ( count ) {

				function appendChild( cFrustumPoint, count ) {

					//thanks to https://stackoverflow.com/a/48780352/5175935
					cFrustumPoint.domElement.querySelectorAll( 'select option' ).forEach( option => { if ( option.value != '-1' ) option.remove(); } );

					for ( var i = 0; i < count; i++ ) {

						var opt = document.createElement( 'option' );
						opt.innerHTML = i;
						cFrustumPoint.__select.appendChild( opt );

					}
					cFrustumPoint.setValue( -1 );//если не выбрать ни одной точки,
						//то при повторном выборе frustumPoints в списке cMeshs выберется точка, которая была выбрана прошлый раз.
						//Но индекс этой выбранной точки почему то не будет выбран в cFrustumPoints
						//Для проверки
						//выбрать точку frustumPoints в guiSelectPoint. Если есть оси кооддинат, то от выбранной точки появятся пунктирные линии.
						//Выбрать точку не frustumPoints в guiSelectPoint.
						//Опять выбрать точку frustumPoints в guiSelectPoint. Раньше появлялись пунктирные линии, но в огранах управления почемуто это точка не выбиралась.

				}
				appendChild( cFrustumPointsX, count.xCount );
				appendChild( cFrustumPointsY, count.yCount );
				appendChild( cFrustumPointsZ, count.zCount );

			};
			/**
			 * Sets to the controls the indexes of the selected frustum point.
			 * @param {object} index
			 * @param {object} index.x index of the x row of selected frustum point
			 * @param {object} index.y index of the y row of selected frustum point
			 * @param {object} index.z index of the z layer of selected frustum point
			 */
			this.pointIndexes = function ( index ) {

				if ( index === undefined )
					return;//Сюда попадает в отладочной версии когда не заданы имена точек
				if ( parseInt( cFrustumPointsX.getValue() ) !== index.x )
					cFrustumPointsX.setValue( index.x );
				if ( parseInt( cFrustumPointsY.getValue() ) !== index.y )
					cFrustumPointsY.setValue( index.y );
				if ( parseInt( cFrustumPointsZ.getValue() ) !== index.z )
					cFrustumPointsZ.setValue( index.z );

			};
			/**
			 * @returns frustum point index selected by user from controls.
			 * <p>null if user have not selected any point.</p>
			 */
			this.getSelectedIndex = function () {

				if ( _names === undefined ) {

					console.warn( 'Сюда попадает во время отладки когда не задаю имени каждой точки или когда the cDisplay checkbox of the frustumPoints is not checked' );
					return null;

				}
				const x = parseInt( cFrustumPointsX.getValue() ),
					y = parseInt( cFrustumPointsY.getValue() ),
					z = parseInt( cFrustumPointsZ.getValue() );
				if ( isNaN( x ) || ( x === -1 ) || isNaN( y ) || ( y === -1 ) || isNaN( z ) || ( z === -1 ) )
					return null;
				for ( var i = 0; i < _names.length; i++ ) {

					var name = _names[i];
					if ( ( typeof name !== "object" ) || ( name.z === undefined ) || ( name.z !== z ) )
						continue;
					for ( ; i < _names.length; i++ ) {

						name = _names[i];
						if ( ( typeof name !== "object" ) || ( name.y !== y ) )
							continue;
						for ( ; i < _names.length; i++ ) {

							name = _names[i];
							if ( typeof name === "object" ) {

								if ( ( x === 0 ) && ( name.y === y ) ) {

									//Сюда попадает когда в guiSelectPoint пользователь выбрал frustum Point с коодинатами 0,0,0,
									return i;

								}

							}
							if ( name === x ) {

								//console.warn( 'x = ' + x + ', y = ' + y + ', z = ' + z + ', i = ' + i );
								return i;

							}

						}

					}

				}
				console.error( 'FrustumPoints.selectPoint: not selected' );
				return null;

			};
			/**
			 * Display or hide the <b>FrustumPoints</b> controls.
			 * @param {string} display 'block' - display
			 * <p>'none' - hide</p>
			 */
			this.display = function ( display ) {

				cFrustumPointsX.domElement.parentElement.parentElement.style.display = display;
				cFrustumPointsY.domElement.parentElement.parentElement.style.display = display;
				cFrustumPointsZ.domElement.parentElement.parentElement.style.display = display;

			};
			/**
			 * Is FrustumPoints controls visible?
			 * @returns true - FrustumPoints controls is visible.
			 * */
			this.isDisplay = function () {

				if (
					( cFrustumPointsX.domElement.parentElement.parentElement.style.display !== cFrustumPointsY.domElement.parentElement.parentElement.style.display )
					|| ( cFrustumPointsX.domElement.parentElement.parentElement.style.display !== cFrustumPointsZ.domElement.parentElement.parentElement.style.display )
				)
					console.error( 'cFrustumPointsF.isDisplay failed!' );
				return cFrustumPointsX.domElement.parentElement.parentElement.style.display !== 'none';

			};

		};

		//делаю затычки на случай пустого _arrayCloud = [] массива координат точек, имеющих облако вокруг себя.
		//Другими словми если в программе нет ни одной точки с облаком вокруг себя.
		//В этом случае точки FrustumPoints не создаются
		this.gui = function () { console.warn( 'FrustumPoints.gui(): First, call FrustumPoints.pushArrayCloud(...) for push a points to the clouds array and call FrustumPoints.create(...).' ); };
		this.animate = function () { };
		this.updateGuiSelectPoint = function () { };
		this.isDisplay = function () { };
		this.onChangeControls = function () { };
		this.updateCloudPoints = function () { };
		this.updateCloudPoint = function () { };
		this.updateCloudPointItem = function () { };

	}

 }

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

class pointLight {

	/**
	 * A light that gets emitted from a single point in all directions.
	 * @see [PointLight]{@link https://threejs.org/docs/index.html?q=pointLight#api/en/lights/PointLight}
	 * @param {THREE.Group|THREE.Scene} scene [Group]{@link https://threejs.org/docs/index.html?q=gr#api/en/objects/Group} or [Scene]{@link https://threejs.org/docs/index.html?q=sce#api/en/scenes/Scene} of the <b>pointLight</b>.
	 * @param {object} [settings={}] the following settings are available
	 * @param {Options} [settings.options=new Options()] <a href="../../jsdoc/Options/Options.html" target="_blank">Options</a> instance. The following options are available.
	 * See <b>options</b> parameter of <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
	 * @param {boolean} [settings.options.pointLight] false - do not use <b>pointLight</b>.
	 * @param {object} [settings.options.dat] use dat-gui JavaScript Controller Library. [dat.gui]{@link https://github.com/dataarts/dat.gui}.
	 * See <b>options.dat</b> parameter of <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
	 * @param {object} [settings.options.dat.pointLightGui] false - do not adds a <b>pointLight</b> folder. Have effect only if <b>options.pointLight !== false</b>.
	 * @param {number} [settings.options.scale] is 1
	 * @param {THREE.Vector3} [settings.position] light position. Default is zero position.
	 */
	constructor( scene, settings = {} ) {

		const options = new Options$1( settings.options );
		if ( options.pointLight === false ) {

			this.add = function (){ };
			this.controls = function (){ };
			return;

		}

		const dat = three$1.dat,
			THREE = three$1.THREE,
			strLight = 'mathBoxLight',
			controllers = {},
			multiplier = 2 * options.scale,//options.scale is 1
			position = settings.position || new THREE.Vector3();// 0.5 * options.scale, 0.5 * options.scale, 0.5 * options.scale );
		const light = new THREE.PointLight( 0xffffff, 1 );
		light.position.copy( position );
		light.name = strLight;
		scene.add( light );
		/**
		 * Adds the folder of the light settings into [gui]{@link https://github.com/anhr/dat.gui}.
		 * @param {object} [guiParams={}] Followed parameters is allowed.
		 * @param {THREE.Group|THREE.Scene} [guiParams.group] [Group]{@link https://threejs.org/docs/index.html?q=gr#api/en/objects/Group} or [Scene]{@link https://threejs.org/docs/index.html?q=sce#api/en/scenes/Scene} of the light point.
		 * @param {GUI} [guiParams.folder] parent folder
		 * @param {string} [guiParams.folderName] folder name
		 */
		this.controls = function ( guiParams = {} ) {

			const group = guiParams.group || scene, folder = guiParams.folder || options.dat.gui, folderName = guiParams.folderName;

			if ( folder === undefined || ( options.dat.pointLightGui === false ) )
				return;

			//Localization

			const lang = {

				light: 'Light',
				displayLight: 'Display',
				displayLightTitle: 'Display or hide the light source.',

				defaultButton: 'Default',
				restoreLightTitle: 'Restore position of the light source',

			};
			switch ( options.getLanguageCode() ) {

				case 'ru'://Russian language

					lang.light = 'Свет';
					lang.displayLight = 'Показать';
					lang.displayLightTitle = 'Показать или скрыть источник света.';

					lang.defaultButton = 'Восстановить';
					lang.restoreLightTitle = 'Восстановить положение источника света';

					break;
				default://Custom language
					if ( ( options.lang === undefined ) || ( options.lang.languageCode != _languageCode ) )
						break;

					Object.keys( options.lang ).forEach( function ( key ) {

						if ( lang[key] === undefined )
							return;
						lang[key] = options.lang[key];

					} );

			}

			const scales = options.scales, fLight = folder.addFolder( folderName || lang.light );
			var lightSource;

			//displayLight
			dat.controllerNameAndTitle( fLight.add( { display: false }, 'display' ).onChange( function ( value ) {

				if ( value ) {

					new MyPoints( light.position, group, { pointsOptions: {

						onReady( points ) { lightSource = points; }

					} } );

				} else {

					group.remove( lightSource );
					//delete lightSource;//Parsing error: Deleting local variable in strict mode
					lightSource = undefined;

				}

			} ), lang.displayLight, lang.displayLightTitle );

			//move light
			function guiLightAxis( axesName ) {

				const scale = scales[axesName];
				if ( !scale )
					return;
				controllers[axesName] =
					fLight.add( light.position, axesName, scale.min * multiplier, scale.max * multiplier )
						.onChange( function ( value ) {

							if ( lightSource === undefined )
								return;

							const i = 0,
								itemSize = lightSource.geometry.attributes.position.itemSize,
								point = new THREE.Vector3().fromArray( lightSource.geometry.attributes.position.array, i * itemSize );
							point[axesName] = value;
							point.toArray( lightSource.geometry.attributes.position.array, i * itemSize );
							//										lightSource.geometry.attributes.position.array[axesId] = value;
							lightSource.geometry.attributes.position.needsUpdate = true;

						} );
				dat.controllerNameAndTitle( controllers[axesName], scale.name );

			}
			guiLightAxis( 'x' );
			guiLightAxis( 'y' );
			guiLightAxis( 'z' );

			var restore = {

				restore: function () {

					controllers.x.setValue( position.x );
					controllers.y.setValue( position.y );
					controllers.z.setValue( position.z );

				}
			};
			dat.controllerNameAndTitle( fLight.add( restore, 'restore' ), lang.defaultButton, lang.restoreLightTitle );

		};
		return this;

	}

}

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

class ProgressBar {

	/**
	 * set new value of the progress bar
	 */
	set value(value) { this.setValue(value); }

	/**
	 * Creates a [progress bar element]{@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/range} on your web page.
	 * @param {HTMLElement} [elParent] parent element. <b>ProgressBar</b> is not visible if <b>elParent</b> is undefined.
	 * @param {Function} step The <b>step(progressBar, i)</b> function to be executed asynchronous during progress.
	 * <pre>
	 * parameter <b>progressBar</b>: this ProgressBar instance.
	 * parameter <b>i</b>: current iteration index.
	 * parameter <b>params</b>: User defined parameters that can passed from <b>params</b> of the <b><a href="#step">step</a></b> method.
	 * </pre>
	 * @param {object} [settings={}] The following settings are available
	 * @param {string} [settings.sTitle=""] Progress bar title.
	 * @param {number} [settings.min=0] The lowest value in the range of permitted values.
	 * @param {number} [settings.max=1] The greatest value in the range of permitted values.
	 * @param {number} [settings.iterationCount] Count of calling of the <b>step</b> function from <b>settings.min</b> to <b>settings.iterationCount</b>.
	 * @param {number} [settings.timeoutPeriod=0] You can call the <b>step</b> function asynchronous or directly.
	 * Directly calling of the <b>step</b> function decreases the execute time but your web page froze during executing.
	 * For example if <b>timeoutPeriod</b> parameter is 3, then the <b>step</b> function will be called 3 times directly and one time asynchronous.
	 * If <b>timeoutPeriod</b> parameter is 0, then the <b>step</b> function will be called permanently as asynchronous.
	 */
	constructor(elParent, step, settings = {}) {

		let cProgress, elProgress, elTitle;
		if (elParent) {
			
			elTitle = document.createElement('div');
			elProgress = document.createElement('div');
			cProgress = document.createElement('input'),
			elProgress.style.backgroundColor = 'white';
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
	
			let elcontainer;
			const containerName = 'ProgressContainer';
			for (let i = 0; i < elParent.children.length; i++) {
	
				const child = elParent.children[i];
				if (child.name && (child.name === containerName)) {
	
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
			const elRow = document.createElement('tr');
			elRow.appendChild(elProgress);
			elcontainer.appendChild(elRow);

		}
		this.setValue = (value) => { if (cProgress) cProgress.value = value; };
		
		if (settings.timeoutPeriod === undefined) settings.timeoutPeriod = 0;
		let timeoutPeriod = settings.timeoutPeriod;//таймер можно запускать через определенный период что бы экономилось время выполнения
		let i = settings.iterationCount != undefined ? settings.min : undefined;
		
		/**
		 * Execute the next step asynchronously.
		 * @param {Object} [params] User defined parameters that will be passed to the <b>params</b> of the <b>step</b> function of the <b>ProgressBar</b> constructor.
		 */
		this.step = (params) => {

			const iteration = () => {
				
				step(this, i, params);
				if (i === undefined) return;
				this.value = i;
				i++;
				if (i < settings.iterationCount)
					this.step();
				else this.remove();
				
			};
			if (timeoutPeriod < settings.timeoutPeriod) {

				timeoutPeriod++;
				iteration();
				
			} else {
				
				timeoutPeriod = 0;
				window.setTimeout(() => {
					
					iteration();
				
				}, 0);

			}
			//window.requestAnimationFrame(step);//время выполнения увеличивается на треть

		};
		/**
		 * remove progress bar from your web page.
		 **/
		this.remove = () => { if (elProgress) elProgress.parentElement.remove(); };
  
		this.step();

		/**
		 * set new step function
		 * @param {function} stepFunction New step function. See the ProgressBar constructor's <b>step</b> parameter.
		 */
		this.newStep = (stepFunction) => { step = stepFunction; };

		/**
		 * set new title
		 * @param {string} newTitle
		 */
		this.title = (newTitle) => { elTitle.innerHTML = newTitle; };

	}

}

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

//debug
//import { SpriteText } from '../SpriteText/SpriteText.js'

class Intersections {

	/**
	 * Creates an intersection lines for graphic objects.
	 * @param {THREE.Mesh} object [graphic object]{@link https://threejs.org/docs/index.html#api/en/objects/Mesh} for which the intersection lines with other objects will be obtained.
	 * @param {THREE.Mesh|array} intersectMeshList <b>THREE.Mesh</b> - [Mech]{@link https://threejs.org/docs/index.html#api/en/objects/Mesh}, which intersects with <b>object</b>.
	 * <pre>
	 * <b>array</b> - array of intersect graphic objects. Every item is:
	 *	<b>THREE.Mesh</b> - [Mech]{@link https://threejs.org/docs/index.html#api/en/objects/Mesh}, which intersects with <b>object</b>.
	 *	or <b>object</b> - object keys is:
	 *		<b>mesh</b> - [Mech]{@link https://threejs.org/docs/index.html#api/en/objects/Mesh}, which intersects with <b>object</b>.
	 *		<b>color</b> - intersection lines [color]{@link https://en.wikipedia.org/wiki/Web_colors#Hex_triplet}.
	 *			Examples: <b>0xffffff</b>, <b>'yellow'</b>. Default is white.
	 * <pre>
	 * @param {object} [settings] the following settings are available:
	 * @param {THREE.Scene} [settings.scene] [THREE.Scene]{@link https://threejs.org/docs/index.html?q=sce#api/en/scenes/Scene}.
	 * @param {THREE.WebGLRenderer} [settings.renderer] [THREE.WebGLRenderer]{@link https://threejs.org/docs/index.html?q=WebGLRenderer#api/en/renderers/WebGLRenderer}.
	 * @param {function} [settings.onReady] Callback function that called if intersection lines is ready and that take as input an array of all intersect lines.
	 * <pre>
	 * <b>function( intersectionLines )</b>
	 *	<b>intersectionLines</b> - array of all intersect lines.
	 *	Every item of array is object. Object keys is:
	 *		<b>mesh</b> - [Mech]{@link https://threejs.org/docs/index.html#api/en/objects/Mesh}, which intersects with <b>object</b>.
	 *		<b>points</b> - array of [points]{@link https://threejs.org/docs/index.html?q=Vect#api/en/math/Vector3} of intersection line.
	 *		<b>color</b> - intersection line color.
	 *			Default is white.
	 * </pre>
	 */
	constructor( object, intersectMeshList, settings = {} ) {

		const THREE = three$1.THREE, options = three$1.options || {}, scene = settings.scene || three$1.group;
		if ( object instanceof THREE.Mesh === false ) object = object.mesh;
		const positions =  object.geometry.attributes.position;

		if ( !Array.isArray( intersectMeshList ) ) intersectMeshList = [intersectMeshList];
		const collidableMeshList = [], arrayIntersectLinesColor = [];
		intersectMeshList.forEach( function ( item ) {

			if ( item instanceof THREE.Mesh ) {

				collidableMeshList.push( item );
				arrayIntersectLinesColor.push( 0xffffff );//white

			} else {

				collidableMeshList.push( item.mesh );
				arrayIntersectLinesColor.push( item.color || 0xffffff );

			}

		} );

		//У некоторых геометрических фигур нет object.geometry.index. Например THREE.TetrahedronGeometry
		if ( !object.geometry.index ) {

			const array = [];
			for ( var i = 0; i < positions.count; i++ ) array.push( i );
			object.geometry.index = new THREE.Uint16BufferAttribute( array, 1 );

		}

		//debug
		//var currentdate = new Date();

		//ищщем точки, которые совпадают или почти совпадают с небольшой погрешностью
		//что бы у них был одинаковый индекс
		for ( let i = 1; i < object.geometry.index.count; i++ ) {

			const point1 = new THREE.Vector3().fromBufferAttribute( positions, object.geometry.index.array[i] );
			//console.log( 'index: ' + object.geometry.index.array[i] );
			//console.log( point1 );
			for ( let j = i - 1; j >= 0; j-- ) {

				const point2 = new THREE.Vector3().fromBufferAttribute( positions, object.geometry.index.array[j] );

				// @returns
				// 	0 координаты совпадают
				// 	1 коодинаты с маленьким отклонением
				// 	4 коодинаты с большим отклонением
				function Delta( a, b ) {

					const d = Math.abs( a - b );
					if ( d === 0 ) return 0;
					//					if ( ( d > 0 ) && ( d <= 7.347880586115415e-16 ) ) return 1;
					//				if ( ( d > 0 ) && ( d <= 3.1840817637818772e-15 ) ) return 1;
					//				if ( ( d > 0 ) && ( d <= 3.394278283598952e-15 ) ) return 1;//use THREE.SphereGeometry for testing
					if ( ( d > 0 ) && ( d <= 4e-15 ) ) return 1;//use THREE.SphereGeometry for testing
					//					if ( ( d > 0 ) && ( d <= 3.e-10 ) ) return 1;
					return 4;

				}
				const res = Delta( point2.x, point1.x ) + Delta( point2.y, point1.y ) + Delta( point2.z, point1.z );
				//0 координаты совпадают
				//1,2,3 одна, две или три коодинаты с маленьким отклонением. Остальные совпадают.
				//4 есть хоть одна коодината с большим отклонением
				//if ( ( res > 0 ) && ( res < 4 ) )
				if ( res < 4 ) {

					object.geometry.index.array[i] = object.geometry.index.array[j];
					break;

				}

			}

		}
		function arrayIntersectionsPush( intersection, array ) {

			const point1 = intersection.point;
			for ( var i = 0; i < array.length; i++ ) {

				function isSameAxis( axis1, axis2 ) { return axis1 === axis2 }
				const point2 = array[i].point;
				if ( isSameAxis( point1.x, point2.x ) && isSameAxis( point1.y, point2.y ) && isSameAxis( point1.z, point2.z ) )
					return;//не надо добавлять точки с одинаковым положением

			}
			array.push( intersection );

		}

		//точки пересечения одного тела с другим могут образовывать несколько замкнутых линий ( Loops ).
		//Например пересечение тора с плоскостью.
		//Здесь перечислены все обнруженные Loops точек пересечения.
		const intersectionLines = [],

			//Список граней, имеющих линии пересечения. Нужен что бы во врнмя построения линий пересечения не искать по всем граням.
			arrayIntersectFaces = [];

		const edges = [];//список ребер
		//Заполнить список ребер
		for ( var index = 0; index < object.geometry.index.count; index += 3 ) {

			class Edge {

				constructor( index, index2 ) {

					function Vertex( index ) {

						//debug
						if ( typeof SpriteText !== "undefined" ) var spriteText;

						return {

							get index() {

								if ( index >= object.geometry.index.array.length )
									index = 0;//сюда попадает когда ищу индекс второй точки ребра edge.vertex2
								//и когда ребро последнее в объекте.
								//Я предполагаю что вторая точка ребра edge.vertex2 это первая точка в object.geometry.index
								//Для проверки использовать const geometry = new THREE.BufferGeometry();
								const i = object.geometry.index.array[index];
								if ( i === undefined )
									console.error( 'Intersections.createIntersections.Edge.Vertex: i = ' + i );
								return i;

							},
							get pointLocal() {

								const vertex = positions.itemSize === 3 ? new THREE.Vector3() : positions.itemSize === 4 ? new THREE.Vector3() : undefined;
								return vertex.fromBufferAttribute( positions, this.index );

							},
							get point() {

								const point = this.pointLocal.applyMatrix4( object.matrix );

								//debug
								if ( typeof SpriteText !== "undefined" && !spriteText ) {

									spriteText = new SpriteText( this.index, this.pointLocal );
									object.add( spriteText );

								}

								return point;

							},

						}

					}					var vertex1, vertex2, collisionResultsOriginPoint, intersectionObject;

					//индексы точек пересечения, положение которых совпадает с положением точек пересечения на соседних ребрах грани.
					//Эти точи пересечения надо игнорировать, что бы количество точек пересечения на грани было четным.
					//Подробности в Face.intersections
					const arraySpliceIntersection = [],
						array = [];//только точки пересечения, которые нужно учитывать

					this.spliceIntersection = function ( index, uuid ) {

						arraySpliceIntersection.push( { index: index, uuid: uuid, } );
						array.length = 0;

					};

					Object.defineProperties( this, {

						intersection: {
							get: function () {

								if ( !collisionResultsOriginPoint ) {

									const direction = this.vertex2.point.clone().sub( this.vertex1.point ).clone().normalize(),
										rayOriginPoint = new THREE.Raycaster( this.vertex1.point, direction, 0,
											this.vertex2.point.distanceTo( this.vertex1.point ) );

									//debug
									//Если это не делать, то получу ошибку
									//three.module.js:28094 THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.
									//когда new Intersections вызывается несколько раз с разными object
									//и когда SpriteText используется для указания индекса вершины
									if ( typeof SpriteText !== "undefined" ) rayOriginPoint.camera = options.camera;

									//array - список точек пересечения, возвращенный THREE.Raycaster.intersectObjects
									//collisionResultsOriginPoint.length === 0 пересечений не обнаружено
									//undefined - точка пересечения еще не вычислялась
									//collisionResultsOriginPoint[i] = false - уже добавлен в arrayIntersectLine
									collisionResultsOriginPoint = rayOriginPoint.intersectObjects( collidableMeshList );//, false );//recursive = false на тот случай когда для отладки в пересекаемые объекты добавляю текст с номером вершины

									if ( !this.faces )
										console.error( 'edge ' + this.vertex1.index + ' ' + this.vertex2.index + ' intersects ' + collisionResultsOriginPoint.length );

								}
								var res;
								if ( this.intersectionObject ) {

									if ( array.length === 0 ) {

										//Надо вывести только точки пересечения с объектом this.intersectionObject
										//и если в начале или конце соседнего ребра нет точки пересечения с такми же положением
										const intersectionObject = this.intersectionObject;
										collisionResultsOriginPoint.forEach( function ( intersection, index ) {

											if ( intersection.object.uuid === intersectionObject.uuid ) {

													arrayIntersectionsPush( intersection, array );

											}

										} );
										//не добавлять точку пересечения в array если в другом ребре грани есть точка пересечения с тем же положением
										if ( arraySpliceIntersection.length > 1 )
											console.error( 'under construction' );//надо рассотировать arraySpliceIntersection так что бы из array сначала удалялись элементы с наибольшим индексом. Иначе не те элементы будут удаляться
										for ( var i = 0; i < arraySpliceIntersection.length; i++ ) {

											if ( arraySpliceIntersection[i].uuid === intersectionObject.uuid )
												array.splice( arraySpliceIntersection[i].index, 1 );

										}

									}
									res = array;

								} else res = collisionResultsOriginPoint;
								return res;

							},
							set: function ( intersection ) {

								//debug
								this.vertex1.update = undefined;
								this.vertex2.update = undefined;

								collisionResultsOriginPoint = intersection;

							},

						},
						intersectionObject: {

							get: function () { return intersectionObject; },
							set: function ( intersectionObjectNew ) {

								intersectionObject = intersectionObjectNew;
								arraySpliceIntersection.length = 0;
								array.length = 0;

							},

						},
						vertex1: {

							get: function () {

								if ( !vertex1 )
									vertex1 = Vertex( index );
								return vertex1;
							}

						},
						vertex2: {

							get: function () {

								if ( !vertex2 )
									vertex2 = Vertex( index2 );
								return vertex2;

							}

						},

					} );

					this.isCollision = function () { return collisionResultsOriginPoint.length > 0; };
					this.isSame = function ( edge ) {

						//Если сделать const boSame
						//то появится ошибка
						//[!] (babel plugin) SyntaxError: D:/My documents/MyProjects/webgl/three.js/GitHub/commonNodeJS/master/Intersections/Intersections.js: "boSame" is read-only
						//во время создания файлов myThree\build
						//npm run build
						var boSame = ( ( this.vertex1.index === edge.vertex1.index ) && ( this.vertex2.index === edge.vertex2.index ) ) ||
							( ( this.vertex1.index === edge.vertex2.index ) && ( this.vertex2.index === edge.vertex1.index ) );
						if ( boSame === undefined ) boSame = false;
						return boSame;

					};

				}

			}
			var edge = new Edge( index, index + 1 );
			edges.push( edge );
			edge = new Edge( index + 1, index + 2 );
			edges.push( edge );

			//Если поменять порядок индексов, то в edges появятся одинаковые ребра,
			//которые будут отличатся только переставленными edge.vector1 и edge.vector2
			//а это приведет к тому что в некоторых случаях не будет пересечения с объектом
			//если ребро пересекается с объектом одним из концов непонятно почему.
			//Как результат, могут появиться разрывы в линии пересечения.
			//Для проверки в примере установить plane( 'plane', new THREE.PlaneGeometry( 30, 30 ) ).rotation.y = Math.PI / 2;
			//и const objGeom = new THREE.DodecahedronGeometry( 10, 0 );
			//и obj.position.z = 8.9;
			edge = new Edge( index, index + 2 );
			edges.push( edge );

		}

		//список граней
		const faces = [];

		//Progress window
		const renderer = options.renderer || settings.renderer;
//		var elProgress, cProgress;
		let progressBar;
		if ( renderer ) {

			const elCanvas = renderer.domElement, elContainer = elCanvas.parentElement;
			if ( elContainer.tagName !== "DIV" ) {

				console.error( 'Intersections: elContainer.tagName = ' + elContainer.tagName );
				return;

			}
			const container = "container";
			if ( !elContainer.classList.contains( container ) ) elContainer.classList.add( container );
			const lang = { progressTitle: 'Intersections preparing.<br>Wait please...', };
			switch ( options.getLanguageCode() ) {

				case 'ru'://Russian language

					lang.progressTitle = 'Подготовка пересечений.<br>Пожалуйста подождите...';

					break;

			}
			progressBar = new ProgressBar(elContainer, step, {

				sTitle: lang.progressTitle,
				max: object.geometry.index.count,
				
			});
/*			
			elProgress = document.createElement( 'div' );
			cProgress = document.createElement( 'input' );
			const elTitle = document.createElement( 'div' );
			elProgress.style.position = 'absolute';
			elProgress.style.top = 0;
			elProgress.style.left = 0;
			elProgress.style.backgroundColor = 'white';
			elProgress.style.margin = '2px';
			elProgress.style.padding = '2px';
			const lang = { progressTitle: 'Intersections preparing.<br>Wait please...', };
			switch ( options.getLanguageCode() ) {

				case 'ru'://Russian language

					lang.progressTitle = 'Подготовка пересечений.<br>Пожалуйста подождите...';

					break;

			}
			elTitle.innerHTML = lang.progressTitle;
			elTitle.style.color = 'black';
			elProgress.appendChild( elTitle );
			cProgress.min = "0";
			cProgress.max = object.geometry.index.count;
			cProgress.type = "range";
			cProgress.disabled = true;
			elProgress.appendChild( cProgress );
			elContainer.appendChild( elProgress );
*/   

		}

		//Заполнить список граней
		index = 0;
		function step( timestamp ) {

/*			
			if ( cProgress )
				cProgress.value = index;
*/	
			if (progressBar) progressBar.value = index;
			if ( index >= object.geometry.index.count ) {

/*				
				if ( elProgress )
					elProgress.remove();
*/	 
				progressBar.remove();
				boCreateIntersections = true;
				setTimeout( function () { createIntersections(); }, 0 );//Таймаут нужен что бы установился matrixWorld объектов из collidableMeshList.
				return;

			}

			class Face {

				/* *
				 * [Face]{@link https://threejs.org/docs/index.html?q=Fa#examples/en/math/convexhull/Face}
				 * @param {number} index index of vertices of the face <b>from object.geometry.index</b>
				 * @param {number} id identifier of the face in the <b>faces</b> array.
				 */
				constructor( index ) {

					const vectorIndex = new THREE.Vector3(),
						arrayIntersectLines = [];//линии пересечения грани. каждый элемент содержит ребро и индекс начала и конца линии пересечения
					vectorIndex.fromBufferAttribute( object.geometry.index, index );
					Object.defineProperties( this, {


						faceEdges: { get: function () { return faceEdges; } },//прилегающие к грани ребра
						id: { get: function () { return vectorIndex; } },

						//for debugging
						name: { get: function () { return 'Face ' + vectorIndex.x + ', ' + vectorIndex.y + ', ' + vectorIndex.z; } },

						vertices: {

							get: function () {

								return {

									vertex1: faceEdges.edge1.vertex1,
									vertex2: faceEdges.edge1.vertex2,
									get vertex3() {

										if ( !faceEdges.edge3 ) {

											console.error( 'faceEdges.edge3 = ' + faceEdges.edge3 );
											if ( faceEdges.edge1.vertex1.index === faceEdges.edge2.vertex1.index )
												return faceEdges.edge2.vertex2;
											if ( faceEdges.edge1.vertex1.index === faceEdges.edge2.vertex2.index )
												return faceEdges.edge2.vertex1;
											if ( faceEdges.edge1.vertex2.index === faceEdges.edge2.vertex1.index )
												return faceEdges.edge2.vertex2;
											if ( faceEdges.edge1.vertex2.index === faceEdges.edge2.vertex2.index )
												return faceEdges.edge2.vertex1;
											return;

										}
										return ( faceEdges.edge1.vertex1.index !== faceEdges.edge3.vertex1.index ) &&
											( faceEdges.edge1.vertex2.index !== faceEdges.edge3.vertex1.index ) ?
											faceEdges.edge3.vertex1 : faceEdges.edge3.vertex2;

									},

								}

							}

						}

					} );
					//прилегающие к грани ребра
					function emtyIntersection() {
						return {

							intersection: [],
							isSame: function () { return true; },

						}
					}
					const intersectionEdges = {};//список ребер, имеющих пересечения
					//список всех ребер грани
					const faceEdges = {

						set edge1( edge1 ) { intersectionEdges.edge1 = edge1; },
						get edge1() {

							if ( intersectionEdges.edge1 ) return intersectionEdges.edge1;
							return emtyIntersection();

						},
						set edge2( edge2 ) { intersectionEdges.edge2 = edge2; },
						get edge2() {

							if ( intersectionEdges.edge2 ) return intersectionEdges.edge2;
							return emtyIntersection();

						},
						set edge3( edge3 ) { intersectionEdges.edge3 = edge3; },
						get edge3() {

							if ( intersectionEdges.edge3 ) return intersectionEdges.edge3;
							return emtyIntersection();

						},
						get intersectionObjects() {

							const intersectionObjects = [];
							function getObects( intersections ) {

								intersections.forEach( function ( intersection ) {

									var boAdded = false;
									for ( var i = 0; i < intersectionObjects.length; i++ ) {

										if ( intersection.object.uuid === intersectionObjects[i].uuid ) {

											boAdded = true;
											break;

										}

									}
									if ( !boAdded ) intersectionObjects.push( intersection.object );

								} );

							}
							getObects( faceEdges.edge1.intersection );
							getObects( faceEdges.edge2.intersection );
							getObects( faceEdges.edge3.intersection );
							return intersectionObjects;

						},
						set intersectionObject( intersectionObject ) {

							faceEdges.edge1.intersectionObject = intersectionObject;
							faceEdges.edge2.intersectionObject = intersectionObject;
							faceEdges.edge3.intersectionObject = intersectionObject;

						},
						get intersectionObject() { return faceEdges.edge1.intersectionObject; },

					}; 

					//Каждый face имеет три вершины vectorIndex
					//в этом цикле из списка всех ребер edges, полученных из object.geometry.index,
					//для face ищем три ребра faceEdges.edge1, faceEdges.edge2, faceEdges.edge3
					//и для каждого ребра ищем два face, которым принадлежит это ребро edge.faces.face1 и edge.faces.face2
					for ( var i = edges.length - 1; i >= 0; i-- ) {

						const edge = edges[i],
							vertex1Index = edge.vertex1.index,//object.geometry.index.array[edge.vertex1.index],
							vertex2Index = edge.vertex2.index;//object.geometry.index.array[edge.vertex2.index];
						function setFace( face ) {

							if ( !edge.faces ) edge.faces = {};
							if ( !edge.faces.face1 ) edge.faces.face1 = face;
							else if ( !edge.faces.face2 ) {

								edge.faces.face2 = face;
								//edges2.pop();

							} else console.error( 'Face: too many edge.faces' );

						}
						if (
							( vectorIndex.x === vertex1Index ) && ( vectorIndex.y === vertex2Index ) ||
							( vectorIndex.x === vertex2Index ) && ( vectorIndex.y === vertex1Index )
						) {

							if ( !faceEdges.edge1.isSame( edge ) ) console.error( 'Face: duplicate faceEdges.edge1' );
							else {

								faceEdges.edge1 = edge;
								setFace( this );

							}

						} else if (
							( vectorIndex.z === vertex1Index ) && ( vectorIndex.y === vertex2Index ) ||
							( vectorIndex.z === vertex2Index ) && ( vectorIndex.y === vertex1Index )
						) {

							const boSame = faceEdges.edge2.isSame( edge );
							if ( !boSame ) console.error( 'Face: duplicate faceEdges.edge2' );
							else {

								faceEdges.edge2 = edge;
								setFace( this );

							}

						} else if (
							( vectorIndex.z === vertex1Index ) && ( vectorIndex.x === vertex2Index ) ||
							( vectorIndex.z === vertex2Index ) && ( vectorIndex.x === vertex1Index )
						) {

							if ( !faceEdges.edge3.isSame( edge ) ) console.error( 'Face: duplicate faceEdges.edge3' );
							else {

								faceEdges.edge3 = edge;
								setFace( this );

							}

						}

					}

					this.isCollision = function () {

						return faceEdges.edge1.intersection.length || faceEdges.edge2.intersection.length || faceEdges.edge3.intersection.length;

					};

					this.nextIntersectPoint = function ( point ) {

						for ( var i = 0; i < arrayIntersectLines.length; i++ ) {

							function returnPoint( point ) {

								arrayIntersectLines.splice( i, 1 );
								return point;

							}
							const intersectLine = arrayIntersectLines[i],
								uuid = point.uuid;
							if (
								point.edge.isSame( intersectLine.point1.edge ) &&
								( point.intersectionIndex === intersectLine.point1.intersectionIndex ) &&
								( uuid === intersectLine.point1.uuid )
							)
								return returnPoint( intersectLine.point2 );
							else if (
								point.edge.isSame( intersectLine.point2.edge ) &&
								( point.intersectionIndex === intersectLine.point2.intersectionIndex ) &&
								( uuid === intersectLine.point2.uuid )
							)
								return returnPoint( intersectLine.point1 );

						}

					};
					this.intersectLines = function () { return arrayIntersectLines; };
					//если эта грань имеет пересечения с объектом, то строим линии пересечения грани с объектом
					this.intersections = function () {

						//список объектов пересечения 
						//Внимание! Нельзя удадять intersectionObjects потому что размер массива faceEdges.intersectionObjects меняется при
						//изменении faceEdges.intersectionObject и тогда могут быть пропущены некторые линии пересечения грани с объектом
						const intersectionObjects = faceEdges.intersectionObjects;

						//Для каждого объекта пересечения делаем отдельные линии пересечения
						for ( var iIntersectionObject = 0; iIntersectionObject < intersectionObjects.length; iIntersectionObject++ ) {

							//Линии переаечения начинаем строить с faceEdges.edge1.vertex1.
							faceEdges.intersectionObject = intersectionObjects[iIntersectionObject];
							if ( !this.isCollision() )
								continue;//не пересекается

							//Надо убрать точки пересечения с одинаковыми координатами но в разных ребрах.
							//Это может произойти если начало или конец ребра пересекается с объектом
							//Тогда одна и таже точка будет в начале одного ребра и в конце другого
							//и количество точек будет нечетным. А это означает что грань вроде бы попала на край объекта
							//а я не рисую линию пересечения на краю объекта потому что не знаю как это делать
							for ( var i = faceEdges.edge1.intersection.length - 1; i >= 0; i-- ) {

								for ( var j = faceEdges.edge2.intersection.length - 1; j >= 0; j-- ) {

									if ( ( faceEdges.edge1.intersection.length > i ) && ( faceEdges.edge2.intersection.length > j ) &&
											equals( faceEdges.edge1.intersection[i].point, faceEdges.edge2.intersection[j].point ) )
										faceEdges.edge2.spliceIntersection( j, faceEdges.intersectionObject.uuid );
									for ( var k = faceEdges.edge3.intersection.length - 1; k >= 0; k-- ) {

										if ( ( faceEdges.edge1.intersection.length > i ) && ( faceEdges.edge3.intersection.length > k ) &&
												equals( faceEdges.edge1.intersection[i].point, faceEdges.edge3.intersection[k].point ) )
											faceEdges.edge3.spliceIntersection( k, faceEdges.intersectionObject.uuid );
										if ( ( faceEdges.edge2.intersection.length > j ) && ( faceEdges.edge3.intersection.length > k ) &&
												equals( faceEdges.edge2.intersection[j].point, faceEdges.edge3.intersection[k].point ) )
											faceEdges.edge3.spliceIntersection( k, faceEdges.intersectionObject.uuid );

									}

								}

							}

							function isOdd( num ) { return num % 2; }
							function isOddOrZero( num ) { return isOdd( num ); }

							function arrayIntersectionsPushEdge( vertexIndex, edge ) {

								switch ( vertexIndex ) {

									case edge.vertex1.index:

										for ( var i = 0; i < edge.intersection.length; i++ )
											arrayPushEdge( edge, i );
										break;

									case edge.vertex2.index:

										for ( var i = edge.intersection.length - 1; i >= 0; i-- )
											arrayPushEdge( edge, i );
										break;

									default: console.error( 'Face.intersections: arrayIntersections push failed!' );

								}

							}
							function arrayIntersectionsPushEdge3( vertexIndex ) { arrayIntersectionsPushEdge( vertexIndex, faceEdges.edge3 ); }
							function arrayIntersectionsPushEdge2( vertexIndex ) { arrayIntersectionsPushEdge( vertexIndex, faceEdges.edge2 ); }
							
							const arrayIntersections = [];//Все точки пересечения, начиная с faceEdges.edge1
							function arrayPushEdge( edge, intersectionIndex )
							{
								const intersection = edge.intersection[intersectionIndex];
								arrayIntersections.push( {

									get edge() { return edge; },
									get intersectionIndex() { return intersectionIndex; },
									get uuid() { return intersection.object.uuid; },
									get faces() { return edge.faces; },
									get point() { return intersection.point; },
									get intersection() { return intersection; },

								} );
							}
							var lastEdge;//ребро, которое имеет общую точку с faceEdges.edge1.vertex1
							for ( var i = 0; i < faceEdges.edge1.intersection.length; i++ )
								arrayPushEdge( faceEdges.edge1, i );
							switch ( faceEdges.edge1.vertex2.index ) {

								case faceEdges.edge2.vertex1.index:

									lastEdge = faceEdges.edge3;
									//первая точка пересечения в faceEdges.edge2.intersection находтся ближе к faceEdges.edge1.vertex2
									for ( var i = 0; i < faceEdges.edge2.intersection.length; i++ )
										arrayPushEdge( faceEdges.edge2, i );
									arrayIntersectionsPushEdge3( faceEdges.edge2.vertex2.index );
									break;

								case faceEdges.edge2.vertex2.index:

									lastEdge = faceEdges.edge3;
									//первая точка пересечения в faceEdges.edge2.intersection находтся дальше от faceEdges.edge1.vertex2
									for ( var i = faceEdges.edge2.intersection.length - 1; i >= 0; i-- )
										arrayPushEdge( faceEdges.edge2, i );
									arrayIntersectionsPushEdge3( faceEdges.edge2.vertex1.index );
									break;

								case faceEdges.edge3.vertex1.index:

									lastEdge = faceEdges.edge2;
									//первая точка пересечения в faceEdges.edge3.intersection находтся ближе к faceEdges.edge1.vertex2
									for ( var i = 0; i < faceEdges.edge3.intersection.length; i++ )
										arrayPushEdge( faceEdges.edge3, i );
									arrayIntersectionsPushEdge2( faceEdges.edge3.vertex2.index );
									break;

								case faceEdges.edge3.vertex2.index:

									lastEdge = faceEdges.edge2;
									//первая точка пересечения в faceEdges.edge3.intersection находтся дальше от faceEdges.edge1.vertex2
									for ( var i = faceEdges.edge3.intersection.length - 1; i >= 0; i-- )
										arrayPushEdge( faceEdges.edge3, i );
									arrayIntersectionsPushEdge2( faceEdges.edge3.vertex1.index );
									break;

								default: console.error( 'Face.intersections: arrayIntersections push failed!' );

							}
							const intersectionCount = arrayIntersections.length;
							if ( isOdd( intersectionCount ) ) {

								//console.log( 'Нечетное количество точек пересечения. Край объекта' );
								continue;

							}
							function addIntersectLine( point1, point2 ) { arrayIntersectLines.push( { point1: point1, point2: point2 } ); }

							//Найти в списке граней, имеющих линии пересечения список граней для текущего объекта пересечения faceEdges.intersectionObject
							let arrayMesh;
							for ( var i = 0; i < arrayIntersectFaces.length; i++ ) {

								if ( arrayIntersectFaces[i].mesh.uuid === faceEdges.intersectionObject.uuid ) {

									arrayMesh = arrayIntersectFaces[i];
									break;

								}

							}
							//Если этого списка нет, то добавить его
							if ( !arrayMesh ) {

								arrayMesh = [];
								arrayMesh.mesh = faceEdges.intersectionObject;
								arrayIntersectFaces.push( arrayMesh );

							}
							arrayMesh.push( this );

							if ( intersectionCount === 2 )
								addIntersectLine( arrayIntersections[0], arrayIntersections[1] );
							else if ( !isOddOrZero( faceEdges.edge1.intersection.length ) || !isOddOrZero( lastEdge.intersection.length ) ) {

								//faceEdges.edge1.vertex1 нахоится снаружи объекта.

								//Возможно грань персекается с вершиной объекта в которой сходится 3 грани.
								//Другими словами грань как бы надета на вершину пирамиды
								var boDetected = false;
								if ( intersectionCount === 6 ) {

									function equalFaces( face1, face2 ) { return ( face1.a === face2.a ) && ( face1.b === face2.b ) && ( face1.c === face2.c ); }
									if (
										equalFaces( arrayIntersections[0].intersection.face, arrayIntersections[5].intersection.face ) &&
										equalFaces( arrayIntersections[1].intersection.face, arrayIntersections[2].intersection.face ) &&
										equalFaces( arrayIntersections[3].intersection.face, arrayIntersections[4].intersection.face )
									) {

										addIntersectLine( arrayIntersections[0], arrayIntersections[5] );
										addIntersectLine( arrayIntersections[1], arrayIntersections[2] );
										addIntersectLine( arrayIntersections[3], arrayIntersections[4] );
										boDetected = true;

									} else if (
										equalFaces( arrayIntersections[0].intersection.face, arrayIntersections[1].intersection.face ) &&
										equalFaces( arrayIntersections[2].intersection.face, arrayIntersections[3].intersection.face ) &&
										equalFaces( arrayIntersections[4].intersection.face, arrayIntersections[5].intersection.face )
									) {

										console.error( 'under constraction' );
										addIntersectLine( arrayIntersections[0], arrayIntersections[1] );
										addIntersectLine( arrayIntersections[2], arrayIntersections[3] );
										addIntersectLine( arrayIntersections[4], arrayIntersections[5] );
										boDetected = true;

									}

								}
								if ( !boDetected ) {

									//Тогда первую линию пересечения проводим через ближайшие к faceEdges.edge1.vertex1 точки пересечения
									//console.log( faceEdges.intersectionObject.name + ' faceEdges.edge1.vertex1 нахоится снаружи объекта.' );
									for ( var i = 0; i < intersectionCount / 2; i++ )
										addIntersectLine( arrayIntersections[i], arrayIntersections[intersectionCount - 1 - i] );

								}

							} else {

								//faceEdges.edge1.vertex1 нахоится внутри объекта.
								//Тогда сегметы линий пересечения делаем последовательно из точек arrayIntersections
								//console.log( faceEdges.intersectionObject.name + ' faceEdges.edge1.vertex1 нахоится внутри объекта.' );
								for ( var i = 0; i < intersectionCount; i += 2 )
									addIntersectLine( arrayIntersections[i], arrayIntersections[i + 1] );

							}

						}
						faceEdges.intersectionObject = undefined;

					};

				}

			}
			faces.push( new Face( index, faces.length ) );

			index += 3;
//			setTimeout( function () { step(); }, 0 );
			progressBar.step();

		}
//		setTimeout( function () { step(); }, 0 );

		function equals( point1, point2 ) {

			return point1.distanceTo( point2 ) <= 9.0e-10;//8.881784197001252e-16;

		}

		var boCreateIntersections = false;
		function createIntersections() {

			if ( !boCreateIntersections ) return;

			arrayIntersectFaces.length = 0;

			//Удалить линии пересечения
			for ( var i = intersectionLines.length - 1; i >= 0; i-- ) {

				//https://stackoverflow.com/a/68004442/5175935
				function removeObject3D( object3D ) {

					if ( !( object3D instanceof THREE.Object3D ) ) return false;

					// for better memory management and performance
					object3D.geometry.dispose();
					if ( object3D.material instanceof Array ) {
						// for better memory management and performance
						object3D.material.forEach( material => material.dispose() );
					} else {
						// for better memory management and performance
						object3D.material.dispose();
					}
					object3D.removeFromParent(); // the parent might be the scene or another Object3D, but it is sure to be removed this way
					return true;

				}
				const arrayIntersectLine = intersectionLines[i];
				if ( arrayIntersectLine.intersectLine ) {

					removeObject3D( arrayIntersectLine.intersectLine );
					if ( options.guiSelectPoint ) options.guiSelectPoint.removeMesh( arrayIntersectLine.intersectLine );
					arrayIntersectLine.intersectLine = null;

				}
				if ( arrayIntersectLine.intersectPoints ) {

					removeObject3D( arrayIntersectLine.intersectPoints );
					if ( options.guiSelectPoint ) options.guiSelectPoint.removeMesh( arrayIntersectLine.intersectPoints );
					arrayIntersectLine.intersectPoints = null;

				}
				intersectionLines.pop();

			}

			//ищем точки пересечения
			edges.forEach( function ( edge ) {

				edge.intersection = undefined;
				edge.intersection;

			} );

			//Строим линии пересечения с гранью
			faces.forEach( function ( face ) { face.intersections(); } );

			//строим линию пересечения с объектом
			arrayIntersectFaces.forEach( function ( meshLines ) {

				meshLines.forEach( function ( face ) {

					const arrayIntersectLines = face.intersectLines();
					for ( var i = arrayIntersectLines.length - 1; i >= 0; i-- ) {

						const line = arrayIntersectLines[i];
						if ( !line )
							continue;
						if ( meshLines.mesh.uuid !== line.point1.uuid )
							continue;
						arrayIntersectLines.splice( i, 1 );
						const points = [line.point1.point];
						var point = line.point2, faceNext = face,
							boPush = true;//false - добавлять новую точку в начало points
						while ( true ) {

							if ( boPush ) {

								if ( !equals( points[points.length - 1], point.point ) )//не добавлять две одинаковые точки подряд
									points.push( point.point );

							} else {

								if ( !equals( points[0], point.point ) )//не добавлять две одинаковые точки подряд
									points.unshift( point.point );

							}
							const faces = point.faces;
							if ( faceNext.id.equals( faces.face1.id ) )
								faceNext = faces.face2;
							else if ( faceNext.id.equals( faces.face2.id ) )
								faceNext = faces.face1;
							else console.error( 'Intersections.createIntersections: get twin face failed' );
							if ( !faceNext )
								break;
							var pointEnd = point;
							point = faceNext.nextIntersectPoint( point );
							if ( !point ) {

								const vertexId = equals( pointEnd.point, pointEnd.edge.vertex1.point ) ?
									pointEnd.edge.vertex1.index : equals( pointEnd.point, pointEnd.edge.vertex2.point ) ?
										pointEnd.edge.vertex2.index : undefined;
								faceNext = undefined;
								if ( vertexId ) {

									//Текущая точка линии пересечения не находится на соседней грани 
									//и совпадает с одной из вершин ребра pointEnd.edge.
									//Поэтому продолжение линии пересечения надо искать на гранях, имеющих общие вершины с pointEnd.edge
									for ( var iIntersectFaces = 0; iIntersectFaces < arrayIntersectFaces.length; iIntersectFaces++ ) {

										if ( pointEnd.uuid !== arrayIntersectFaces[iIntersectFaces].mesh.uuid )
											continue;
										for ( var jIntersectFaces = 0; jIntersectFaces < arrayIntersectFaces[iIntersectFaces].length; jIntersectFaces++ ) {

											const face = arrayIntersectFaces[iIntersectFaces][jIntersectFaces];
											if (
												( face.faceEdges.edge1.vertex1.index === vertexId ) ||
												( face.faceEdges.edge1.vertex2.index === vertexId ) ||
												( face.faceEdges.edge2.vertex1.index === vertexId ) ||
												( face.faceEdges.edge2.vertex2.index === vertexId ) ||
												( face.faceEdges.edge3.vertex1.index === vertexId ) ||
												( face.faceEdges.edge3.vertex2.index === vertexId )
											) {

												const intersectLines = face.intersectLines();
												for ( var k = 0; k < intersectLines.length; k++ ) {

													const line2 = intersectLines[k];
													if ( equals( pointEnd.point, line2.point1.point ) )
														point = line2.point1;
													else if ( equals( pointEnd.point, line2.point2.point ) )
														point = line2.point2;
													if ( point ) {

														faceNext = face;
														point = faceNext.nextIntersectPoint( point );
														break;

													}

												}
												if ( faceNext ) break;//обнаружена грань, имеющая общую вершину с pointEnd.edge

											}

										}
										if ( faceNext ) break;

									}

								}
								if ( !faceNext ) {

									//не нашел ни одной грани у которой точка пересечения проходит через вершину и равна последней точке в points
									//Может быть линию персечения нужно достроить с другого конца первой точки?
									pointEnd = line.point1;
									const face1IntersectLines = pointEnd.faces.face1.intersectLines(),
										face = face1IntersectLines.length ? pointEnd.faces.face1 : pointEnd.faces.face2,
										intersectLines = face.intersectLines();
									for ( var iIntersectLines = 0; iIntersectLines < intersectLines.length; iIntersectLines++ ) {

										const intersectLine = intersectLines[iIntersectLines];
										if (
											( intersectLine.point1.uuid === pointEnd.uuid ) &&
											intersectLine.point1.edge.isSame( pointEnd.edge ) &&
											( intersectLine.point1.intersectionIndex === pointEnd.intersectionIndex )
										)
											point = intersectLine.point1;
										else if (
											( intersectLine.point2.uuid === pointEnd.uuid ) &&
											intersectLine.point2.edge.isSame( pointEnd.edge ) &&
											( intersectLine.point2.intersectionIndex === pointEnd.intersectionIndex )
										)
											point = intersectLine.point2;
										if ( point ) {

											//обнаружена грань, имеющая линию пересечения, которая является продолжением первой точки линии пересечения
											faceNext = face;
											point = faceNext.nextIntersectPoint( point );
											boPush = false;
											break;

										}

									}
									if ( !faceNext ) break;

								}

							}

						}
						if ( points.length > 1 ) {//не добавлять линию с количеством точек меньше 2

							var color = 0xffffff;
							for ( var i = 0; i < collidableMeshList.length; i++ ) {

								if ( collidableMeshList[i].uuid === meshLines.mesh.uuid ) {

									color = arrayIntersectLinesColor[i];
									break;

								}

							}

							const arrayIntersectLine = {

								intersectLine: new THREE.Line( new THREE.BufferGeometry().setFromPoints( points ),
									new THREE.LineBasicMaterial( { color: color } ) ),
								mesh: meshLines.mesh,//с этим объектом пересекается
								color: color,
								points: points,

							};
							intersectionLines.push( arrayIntersectLine );
							scene.add( arrayIntersectLine.intersectLine );
							if ( options.guiSelectPoint ) {

								arrayIntersectLine.intersectLine.name =
									( arrayIntersectLine.mesh.name === '' ? intersectionLines.length : arrayIntersectLine.mesh.name ) +
									'-' + ( object.name === '' ? 'intersection' : object.name );
								options.guiSelectPoint.addMesh( arrayIntersectLine.intersectLine );

							}

						}

					}

				} );

			} );
			if ( settings.onReady ) settings.onReady( intersectionLines );

		}
//		setTimeout( function () { createIntersections(); }, 0 );//Таймаут нужен что бы установился matrixWorld объектов из collidableMeshList.
		//Иначе линии пересечения будут строиться без учета реального положения, повррота и масштаба объектов из collidableMeshList.

		//список всех объектов, которые могут перемещаться и сталкиваться
		const arrayMovingObjects = [object];
		collidableMeshList.forEach( function ( object ) { arrayMovingObjects.push( object ); } );
		arrayMovingObjects.forEach( function ( object ) {

			object.userData.position = object.position.clone();
			object.userData.rotation = object.rotation.clone();
			object.userData.scale = object.scale.clone();

		} );
		function movingObjects() {

			for ( var i = 0; i < arrayMovingObjects.length; i++ ) {

				const object = arrayMovingObjects[i];
				if (
					!object.userData.position.equals( object.position ) ||
					!object.userData.rotation.equals( object.rotation ) ||
					!object.userData.scale.equals( object.scale )
				) {

					object.userData.position = object.position.clone();
					object.userData.rotation = object.rotation.clone();
					object.userData.scale = object.scale.clone();

					createIntersections();

					break;

				}

			}
			window.requestAnimationFrame( movingObjects );

		}
		window.requestAnimationFrame( movingObjects );

	}

}

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

class TreeView {

	/**
	 * @class Tree view with CSS and JavaScript. Thanks to [Learn how to create a tree view with CSS and JavaScript.]{@link https://www.w3schools.com/howto/howto_js_treeview.asp}
	 * @param {object} [settings={}] the following settings are available:
	 * @param {boolean} [settings.animate] true - allows you to open/close a tree branch smoothly.
	 * @param {string} [settings.paddingInlineStart="40px"] right shift of the tree branch. Example: "10px"
	 * @param {boolean} [settings.cookie] true - remember the open/close tree branch state after closing of the web page.
	 */
	constructor( settings = {} ) {

		//https://www.w3schools.com/howto/howto_js_treeview.asp

		const toggler = document.getElementsByClassName( "caret" ), cookieName = 'TreeView_';
		var i, id = 1;
		for ( i = 0; i < toggler.length; i++ ) {

			const elNested = toggler[i].parentElement.querySelector( ".nested" ),
				boHide = elNested.classList.contains('hide');
			if ( settings.animate !== undefined ) {
				
				elNested.style.display = boHide ? 'none' : 'block';
				elNested.classList.add( 'b-toggle' );

			}
			if ( settings.paddingInlineStart !== undefined ) elNested.style.paddingInlineStart = settings.paddingInlineStart;
			let boBranchOpen = settings.open ? settings.open : false;
			if ( settings.cookie ) {

				if ( elNested.id === '' ) {
					
					const branchId = 'branch_' + id;
					id++;
					if ( document.getElementById( branchId ) ) console.error( 'duplicate branch id: ' + branchId );
					else elNested.id = branchId;

				}
				switch( cookie.get( cookieName + elNested.id ) ) {

					case 'false': boBranchOpen = false; break;
					case 'true': boBranchOpen = true; break;
					case '': break;
					default: console.error( 'TreeView: Invalid cookie value' );
						
				}
				
			}
			if ( ( boBranchOpen !== undefined ) && ( boBranchOpen === boHide ) ) {
				
				elNested.classList.toggle( "hide" );
				elNested.classList.toggle( "active" );
				elNested.style.display = boHide ? 'block' : 'none';

			}
			if ( !elNested.classList.contains('hide') ) {
				
				const classList = elNested.parentElement.querySelector( ".caret" ).classList;
				if ( !classList.contains( "caret-down" ) ) classList.toggle( "caret-down" );

			}
			toggler[i].addEventListener( "click", function () {

				const elNested = this.parentElement.querySelector( ".nested" );

				//если не менять elNested.style.display то в режиме animation при закрытии ветки ветка будет невидима,
				//но она будет загораживать часть нижних веток и поэтому открывать и закрывать нижние ветки можно будет только если щелкнуть в левой части ветки
				//elNested.boTimeout нужен что бы не было ложного срабатывания setTimeout когда пользователь быстро закрыл и снова открыл ветку
				if ( elNested.classList.contains( 'hide' ) ) {
					
					elNested.style.display = 'block';
					elNested.boTimeout = false;
					
				} else {
					
					elNested.boTimeout = true;
					setTimeout( function() { if ( elNested.boTimeout ) elNested.style.display = 'none'; }, 1000 );

				}
/*				
					boHide = elNested.classList.contains( 'hide' );
				elNested.style.display = boHide ? 'block' : 'none';
				setTimeout( function () { elNested.style.display = boHide ? 'none' : 'block'; }, 1000 );
*/
				elNested.classList.toggle( "hide" );
				elNested.classList.toggle( "active" );
				elNested.style.maxHeight = this.parentElement.querySelector( ".active" ) ? elNested.offsetHeight + 'px' : '';
				this.classList.toggle( "caret-down" );

				if ( settings.cookie )
					cookie.set( cookieName + elNested.id, !elNested.classList.contains( 'hide' ) );

				//если не выполнить эту команду, то меню на холсте будет состоять из двух строк
				if ( elNested.myThree ) elNested.myThree.setSize();// 300, 150 );

			} );

		}
		/**
		 * Sets a canvas in the tree branch
		 * @param {number} branchId tree branch identifier
		 * @param {MyThree} myThree <a href="../../myThree/jsdoc/index.html" target="_blank">MyThree</a> instance.
		 * @param {object} [settings={}] the following settings are available:
		 * @param {number} [settings.width=300] width of the canvas
		 * @param {number} [settings.height=150] height of the canvas
		 */
		this.setCanvas = function ( branchId, myThree, settings = {} ) {

			//если не выполнить эту команду, то холст будет пустой
			settings.size = settings.size || {};
			if ( settings.size.width === undefined ) settings.size.width = 300;
			if ( settings.size.height === undefined ) settings.size.height = 150;
			myThree.setSize( settings.size );
			document.getElementById( branchId ).myThree = myThree;

		};

	}

}

/**
 * @module MyThree
 * @description I use MyThree in my projects for displaying of my 3D objects in the canvas.
 *
 * @author [Andrej Hristoliubov]{@link https://github.com/anhr}
 * 
 * @copyright 2011 Data Arts Team, Google Creative Lab
 *
 * @license under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 */
if (typeof dat !== 'undefined')
	three$1.dat = dat;

function arrayContainersF() {

	const array = [];
	this.push = function (elContainer) {

		array.push(elContainer);

	};
	this.display = function (elContainer, fullScreen) {

		array.forEach(function (itemElContainer) {

			itemElContainer.style.display = (itemElContainer === elContainer) || !fullScreen ? 'block' : 'none';

		});

	};
	Object.defineProperties(this, {

		/**
		 * getter
		 */
		length: {

			get: function () {

				return array.length;

			},

		},

	});

}const arrayContainers = new arrayContainersF();

/*
 * if you asynhronous creates two or more myThreejs same time, then you will receive the error message:
 * 
 * Uncaught ReferenceError: WEBGL is not defined
 * 
 * For resolving of the issue I have remembers myThreejs parameters in the arrayCreates
 * and creates next myThreejs only after creating of previous myThreejs.
 */
var arrayCreates = [];

/**
 * @callback createXDobjects
 * @param {THREE.Group} group [group]{@link https://threejs.org/docs/index.html?q=Gro#api/en/objects/Group} of objects to which a new XD object will be added
 * @param {Options} options See <a href="../../jsdoc/Options/index.html" target="_blank">Options</a>. Followed parameters is allowed.
 * @param {THREE.PerspectiveCamera} [options.camera] [PerspectiveCamera]{@link https://threejs.org/docs/index.html#api/en/cameras/PerspectiveCamera}.
 * @param {object} [options.frustumPoints] <a href="../../frustumPoints/jsdoc/index.html" target="_blank">FrustumPoints</a> instance.
 * @param {object} [options.point] point settings. See <b>options.point</b> parameter of <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> for details.
 * @param {Player} [options.player] <a href="../../Player/jsdoc/index.html" target="_blank">Player</a> instance. Playing of 3D ojbects in my projects.
 * @param {GuiSelectPoint} [options.guiSelectPoint] <a href="../../guiSelectPoint/jsdoc/index.html" target="_blank">GuiSelectPoint</a> instance.
 * @param {Options.raycaster.EventListeners} [options.eventListeners] <a href="../../jsdoc/Options/Raycaster_EventListeners.html" target="_blank">Options.raycaster.EventListeners</a> instance.
 * Mouse events listeners for [Raycaster]{@link https://threejs.org/docs/index.html?q=Raycaster#api/en/core/Raycaster} instance.
 * @param {THREE.WebGLRenderer} [options.renderer] [WebGLRenderer]{@link https://threejs.org/docs/index.html#api/en/renderers/WebGLRenderer}
*/

class MyThree {

	/**
	 * @description I use MyThree in my projects for displaying of my 3D objects in the canvas.
	 * @param {createXDobjects} [createXDobjects] <a href="../../myThree/jsdoc/module-MyThree.html#~createXDobjects" target="_blank">callback</a> creates my 3D objects.
	 * @param {Object} [options] See <a href="../../jsdoc/Options/Options.html" target="_blank">Options</a>.
	 * The following options are available:
	 * @param {HTMLElement|string} [options.elContainer=document.getElementById( "containerDSE" ) or a new div element, child of body] If an HTMLElement, then a HTMLElement, contains a canvas and HTMLElement with id="iframe-goes-in-here" for gui.
	 * <pre>
	 * If a string, then is id of the HTMLElement.
	 * Examples of the <b>elContainer</b>:
	 * <b>&lt;div class="container" id="containerDSE"&gt;
	 * 	&lt;canvas id="canvas" style="background-color:black"&gt;&lt;/canvas&gt;
	 * &lt;/div&gt</b>;
	 * or
	 * <b>&lt;div class="container" id="containerDSE"&gt;
	 * &lt;/div&gt;</b>
	 * New canvas is created inside of the div tag.
	 * </pre>
	 * 
	 * @param {THREE.PerspectiveCamera} [options.camera] [PerspectiveCamera]{@link https://threejs.org/docs/index.html#api/en/cameras/PerspectiveCamera}.
	 * @param {THREE.Vector3} [options.camera.position=new THREE.Vector3( 0.4, 0.4, 2 )] camera position.
	 * @param {THREE.Vector3} [options.camera.scale=new THREE.Vector3( 1, 1, 1 )] camera scale.
	 * @param {Number} [options.camera.fov=70] Camera frustum vertical field of view. See [fov]{@link https://threejs.org/docs/?q=PerspectiveCamera#api/en/cameras/PerspectiveCamera.fov}.
	 * @param {Number} [options.camera.aspect=window.innerWidth / window.innerHeight] Camera frustum aspect ratio. See [aspect]{@link https://threejs.org/docs/?q=PerspectiveCamera#api/en/cameras/PerspectiveCamera.aspect}.
	 * @param {Number} [options.camera.near=0.01] Camera frustum near plane. See [near]{@link https://threejs.org/docs/?q=PerspectiveCamera#api/en/cameras/PerspectiveCamera.near}.
	 * @param {Number} [options.camera.far=10] Camera frustum far plane. See [far]{@link https://threejs.org/docs/?q=PerspectiveCamera#api/en/cameras/PerspectiveCamera.far}.
	 * 
	 * @param {THREE.Scene} [options.scene] [Scene]{@link https://threejs.org/docs/index.html#api/en/scenes/Scene}.
	 * @param {THREE.Vector3} [options.scene.position=new THREE.Vector3( 0, 0, 0 )] scene position.
	 * @param {boolean|object} [options.orbitControls] false - do not add the [OrbitControls]{@link https://threejs.org/docs/index.html#examples/en/controls/OrbitControls}. Allow the camera to orbit around a target.
	 * <pre>
	 * or
	 * </pre>
	 * @param {boolean} [options.orbitControls.enableRotate=true] Enable or disable horizontal and vertical rotation of the camera.
	 * @param {boolean} [options.axesHelper] false - do not add the <a href="../../AxesHelper/jsdoc/index.html" target="_blank">AxesHelper</a>.
	 * @param {boolean} [options.canvasMenu] false - do not create a <a href="../../canvasMenu/jsdoc/index.html" target="_blank">canvasMenu</a> instance.
	 * @param {boolean} [options.stereoEffect] false - do not use <a href="../../StereoEffect/jsdoc/index.html" target="_blank">StereoEffect</a>.
	 * @param {boolean|Object} [options.pointLight] false - do not use <a href="../../jsdoc/pointLight/index.html" target="_blank">pointLight</a>.
	 * @param {Object} [options.pointLight.pointLight1] First <b>pointLight</b> settings.
	 * @param {THREE.Vector3} [options.pointLight.pointLight1.position] <b>pointLight</b> position.
	 * @param {Object} [options.pointLight.pointLight2] Second <b>pointLight</b> settings.
	 * @param {THREE.Vector3} [options.pointLight.pointLight2.position] <b>pointLight</b> position.
	 * @param {object} [options.spriteText] spriteText options. See <a href="../../SpriteText/jsdoc/module-SpriteText.html" target="_blank">SpriteText</a> <b>options</b> parameter for details.
	 *
	 * @param {boolean} [options.player] false - do not create a <a href="../../player/jsdoc/index.html" target="_blank">Player</a> instance.
	 * @param {object} [options.playerOptions] See <b>settings.options.playerOptions</b> parameter of the <a href="../../player/jsdoc/module-Player-Player.html" target="_blank">Player</a>.
	 *
	 * @param {Function|string} [options.getLanguageCode=language code of your browser] Your custom <b>getLanguageCode()</b> function or language code string.
	 * <pre>
	 * returns the "primary language" subtag of the language version of the browser.
	 * Examples: "en" - English language, "ru" Russian.
	 * See the {@link https://tools.ietf.org/html/rfc4646#section-2.1|rfc4646 2.1 Syntax} for details.
	 * You can import { getLanguageCode } from '../../commonNodeJS/master/lang.js';
	 * Currently available follow language code strings:
	 *	"en" - English language,
	 *	"ru" - Russian.
	 * </pre>
	 * @param {object|boolean} [options.dat] use dat-gui JavaScript Controller Library. [dat.gui]{@link https://github.com/dataarts/dat.gui}.
	 * <p>false - do not use dat-gui.</p>
	 * @param {GUI} options.dat.dat [dat.GUI()]{@link https://github.com/dataarts/dat.gui}.
	 * @param {GUI} [options.dat.gui] new [dat.GUI()]{@link https://github.com/dataarts/dat.gui} instance.
	 * <p>
	 * undefined - do not use <b>dat-gui JavaScript Controller Library<b>. [dat.gui]{@link https://github.com/dataarts/dat.gui}.
	 * </p>
	 * @param {HTMLtag} [options.dat.parent] Parent of the canvas. Use if you want to see <b>dat.gui</b> inside of the canvas if canvas is not full screen.
	 * @param {boolean} [options.dat.cookie] false - do not save to cookie all user settings
	 * @param {string} [options.dat.cookieName] Name of the cookie.
	 * @param {boolean} [options.dat.orbitControlsGui] false - do not adds a <a href="../../OrbitControls/jsdoc/" target="_blank">OrbitControlsGui</a> into [dat.gui]{@link https://github.com/dataarts/dat.gui}.
	 * @param {boolean} [options.dat.axesHelperGui] false - do not adds a <a href="../../AxesHelper/jsdoc/module-AxesHelperGui.html" target="_blank">AxesHelperGui</a> into [dat.gui]{@link https://github.com/dataarts/dat.gui}.
	 * @param {boolean} [options.dat.playerGui] false - do not adds a <a href="../../player/jsdoc/module-Player-Player.html#gui" target="_blank">Player controllers</a> into [dat.gui]{@link https://github.com/dataarts/dat.gui}.
	 * @param {boolean} [options.dat.playController] false - do not adds a <a href="../../player/jsdoc/module-Player-Player_PlayController_PlayController.html" target="_blank">PlayController</a> into [dat.gui]{@link https://github.com/dataarts/dat.gui}.
	 * @param {boolean} [options.dat.stereoEffectsGui] false - do not adds <a href="../../StereoEffect/jsdoc/module-StereoEffect-StereoEffect.html#gui" target="_blank">Stereo Effects folder</a> into [dat.gui]{@link https://github.com/dataarts/dat.gui}.
	 * @param {boolean|Object} [options.dat.guiSelectPoint] false - do not displays the <a href="../../guiSelectPoint/jsdoc/module-GuiSelectPoint.html" target="_blank">Select Point</a>. [dat.gui]{@link https://github.com/dataarts/dat.gui} based graphical user interface for select a point from the mesh.
	 * @param {Function} [options.dat.guiSelectPoint.point] Callback function to create custom controllers for each point of selected mesh with custom controllers.
	 * <pre>
	 * parameter <b>options</b> See <b>options</b> parameter above.
	 * parameter <b>dat</b> [dat.GUI()]{@link https://github.com/dataarts/dat.gui}.
	 * parameter <b>fParent</b> parent folder.
	 * example <b>point: function ( options, dat, fMesh ) { return new FermatSpiral.gui( options, dat, fMesh ); },</b>
	 * </pre>
	 * @param {boolean} [options.dat.guiSelectPoint.boDisplayVerticeID] true - display on the scene the point ID near to the point.
	 * @param {boolean} [options.dat.guiFrustumPoints] false - do not adds <a href="../../FrustumPoints/jsdoc/FrustumPoints.html#gui" target="_blank">Frustum Points folder</a> into [dat.gui]{@link https://github.com/dataarts/dat.gui}.
	 * @param {boolean} [options.dat.cameraGui] false - do not adds <a href="../../jsdoc/CameraGui/module-CameraGui-CameraGui.html" target="_blank">Camera folder</a> into [dat.gui]{@link https://github.com/dataarts/dat.gui}.
	 * @param {object} [options.dat.moveScene] false - do not displays the <a href="../../jsdoc/MoveGroupGui/index.html" target="_blank">move group gui</a>.
	 * @param {object} [options.dat.spriteTextGui] false - do not displays the <a href="../../SpriteText/jsdoc/module-SpriteTextGui.html" target="_blank">SpriteTextGui</a>.
	 * @param {object} [options.dat.folderPoint] false - do not adds a <a href="../../jsdoc/folderPoint" target="_blank">Point settings</a> folder.
	 * @param {object} [options.dat.pointLightGui] false - do not adds a [PointLight]{@link https://threejs.org/docs/index.html?q=PointLight#api/en/lights/PointLight} folder.
	 * @param {object} [options.cameraTarget] camera looking at selected point during playing. See the <b>cameraTarget</b> parameter of the <a href="../../player/jsdoc/module-Player-Player.cameraTarget.html#init" target="_blank">Player.cameraTarget.init(...)</a> function for details.
	 * @param {object} [options.frustumPoints] Creates a <a href="../../frustumPoints/jsdoc/index.html" target="_blank">FrustumPoints</a> instance.
	 * See <b>settings.options.frustumPoints</b> parameter of <a href="../../frustumPoints/jsdoc/FrustumPoints.html" target="_blank">FrustumPoints</a> class.
	 * @param {MyThree.ColorPicker.palette|boolean|number|String} [options.palette=true] Points сolor.
	 * <pre>
	 * <b>MyThree.ColorPicker.palette</b> - is <b>new ColorPicker.palette( ... )</b>
	 * See <a href="../../colorpicker/jsdoc/index.html" target="_blank">ColorPicker</a> for details.
	 * <b>boolean</b>: true - <b>new ColorPicker.palette( { palette: ColorPicker.paletteIndexes.BGYW } )</b>;
	 * <b>number</b>: is <b>MyThree.ColorPicker.paletteIndexes</b>. See <a href="../../colorpicker/jsdoc/module-ColorPicker.html#~paletteIndexes" target="_blank">ColorPicker.paletteIndexes</a> for details.
	 * <b>String</b> - color name. See list of available color names in the <b>_colorKeywords</b> object in the [Color.js]{@link https://github.com/mrdoob/three.js/blob/dev/src/math/Color.js} file. Example: 'red'.
	 * See <a href="../../jsdoc/Options/Options.html#setPalette" target="_blank">Options.setPalette</a>.
	 * </pre>
	 * @param {object} [options.canvas] <b>canvas</b> properties
	 * @param {number} [options.canvas.width] width of the canvas
	 * @param {number} [options.canvas.height] height of the canvas
	 * @param {boolean} [options.canvas.fullScreen] default is full screen. false - no full screen
	 * @param {boolean} [options.canvas.noButtonFullScreen] true - hide Full Screen button. default - Full Screen button is visible.
	 * @param {number} [options.a=1] Can be use as 'a' parameter of the <b>Function</b>. See <b>options.a</b> parameter of the <a href="../../player/jsdoc/module-Player-Player.execFunc.html" target="_blank">Player.execFunc</a>.
	 * @param {number} [options.b=0] Can be use as 'b' parameter of the <b>Function</b>. See <b>options.b</b> parameter of the <a href="../../player/jsdoc/module-Player-Player.execFunc.html" target="_blank">Player.execFunc</a>.
	 * @param {object} [options.point] point settings. See <a href="../../jsdoc/Options/global.html#point" target="_blank">Options.point</a> for details.
	 * @param {object} [options.stats] Use JavaScript Performance Monitor. [stats]{@link https://github.com/mrdoob/stats.js/} .
	 * @param {object} [options.scales] axes scales.
	 * See <b>options.scales</b> of the <a href="../../AxesHelper/jsdoc/module-AxesHelper-AxesHelper.html" target="_blank">AxesHelper</a>.
	 *
	 * @param {object} [options.scales.w] <b>w</b> axis options. See <a href="../../jsdoc/Options/Options.html#setW" target="_blank">Options.setW(options)</a> <b>options.scales.w</b> for details.
	 * @param {object} [options.controllers] Controllers list.
	 * <pre>
	 * User can see and edit some parameters on the web page.
	 * See <a href="../../jsdoc/Options/global.html#controllers" target="_blank">controllers</a> of the <b>Options</b>.
	 * </pre>
	 * @param {Object} [options.controllers.t] current <a href="../../player/jsdoc/index.html" target="_blank">Player</a> time.
	 * @param {HTMLElement|string} [options.controllers.t.controller='time'] <b>input</b> element of current <a href="../../player/jsdoc/index.html" target="_blank">Player</a> time
	 * or <b>id</b> of the time <b>input</b> element.
	 * @param {HTMLElement|string} [options.controllers.t.elName='tName'] <b>span</b> element of the <b>Player</b> time name. See <b>settings.options.playerOptions.name</b > parameter of <a href = "../../player/jsdoc/module-Player-Player.html" target = "_blank" >Player</a>
	 * <pre>
	 * or <b>id</b> of the <b>span</b> element.
	 * </pre>
	 * @param {Object} [options.controllers.player] <a href="../../player/jsdoc/index.html" target="_blank">Player's</a> buttons on the web page.
	 * See <a href="../../player/jsdoc/module-Player-Player.html#createControllersButtons" target="_blank">player.createControllersButtons(options)</a> for details.
	 * @param {HTMLElement|string} [options.controllers.player.prev='prev'] <b>input</b> element of the button type. Go to previous animation scene.
	 * <pre>
	 * or element <b>id</b>.
	 * </pre>
	 * @param {HTMLElement|string} [options.controllers.player.play='play'] <b>input</b> element of the button type. Start/stop of the playing.
	 * <pre>
	 * or element <b>id</b>.
	 * </pre>
	 * @param {HTMLElement|string} [options.controllers.player.next='next'] <b>input</b> element of the button type. Go to next animation scene.
	 * <pre>
	 * or element <b>id</b>.
	 * </pre>
	 * @param {event} [options.onSelectScene] New time of the <a href="../../player/jsdoc/index.html" target="_blank">Player</a>.
	 * @param {string} [options.title] text in the top left corner of the canvas.
	 */
	constructor(createXDobjects, options) {

		options = options || {};

		const THREE = three$1.THREE;

		var myThreejs = this;

		arrayCreates.push({

			createXDobjects: createXDobjects,
			options: options,

		});
		if (arrayCreates.length > 1)
			return;

		var camera, group, scene, canvas;

		var elContainer = options.elContainer === undefined ? document.getElementById("containerDSE") :
			typeof options.elContainer === "string" ? document.getElementById(options.elContainer) : options.elContainer;
		if (elContainer === null) {

			if (typeof options.elContainer === "string")
				console.warn('The ' + options.elContainer + ' element was not detected.');
			elContainer = document.createElement('div');
			document.querySelector('body').appendChild(elContainer);

		}
		arrayContainers.push(elContainer);
		if (!elContainer.querySelector('canvas')) {

			elContainer.innerHTML = '';
			const elDiv = document.createElement('div');
			elDiv.className = 'container';
			elDiv.appendChild(document.createElement('canvas'));
			elContainer.appendChild(elDiv);
			elContainer = elDiv;

		}

		if (three$1.dat && (options.dat !== false)) {

			options.dat = options.dat || {};
			options.dat.parent = elContainer;

		}

		if (options.title) {

			const elDiv = document.createElement('div');
			elDiv.style.position = 'absolute';
			elDiv.style.top = '0px';
			elDiv.style.color = 'white';
			elDiv.style.padding = '3px';
			elDiv.innerHTML = options.title;
			elContainer.appendChild(elDiv);

		}

		options = new Options$1(options);

		/**
		* Save scale, position and rotation to the userData.default of the mesh
		* @param {THREE.Object3D} mesh
		*/
		options.saveMeshDefault = function (mesh) {

			mesh.userData.default = mesh.userData.default || {};

			mesh.userData.default.scale = new THREE.Vector3();
			mesh.userData.default.scale.copy(mesh.scale);

			mesh.userData.default.position = new THREE.Vector3();
			mesh.userData.default.position.copy(mesh.position);

			mesh.userData.default.rotation = new THREE.Euler();
			mesh.userData.default.rotation.copy(mesh.rotation);

		};

		//point size
		const defaultPoint = {};

			//uses only if stereo effects does not exists
			new THREE.Vector2();

		var renderer,

			//перенес в options.dat
			//mouseenter = false,//true - мышка находится над gui или canvasMenu
			//В этом случае не надо обрабатывать событие elContainer 'pointerdown'
			//по которому выбирается точка на canvas.
			//В противном случае если пользователь щелкнет на gui, то он может случайно выбрать точку на canvas.
			//Тогда открывается папка Meshes и все органы управления сдвигаются вниз. Это неудобно.
			//И вообще нехорошо когда выбирается точка когда пользователь не хочет это делать.

			fOptions,//canvasMenu,  axesHelper,// INTERSECTED = [], scale = options.scale, colorsHelper = 0x80,
			rendererSizeDefault, cameraPosition,//gui, fullScreen,

			//point size
			pointSize,

			stats,

			//https://www.khronos.org/webgl/wiki/HandlingContextLost
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
		//https://www.khronos.org/webgl/wiki/HandlingContextLost

		const elImg = elContainer.querySelector('img');
		if (elImg) elContainer.removeChild(elImg);

		if (typeof WebGLDebugUtils !== 'undefined')
			canvas = WebGLDebugUtils.makeLostContextSimulatingCanvas(canvas);

		//https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/webglcontextlost_event
		canvas.addEventListener("webglcontextlost", function (event) {

			event.preventDefault();
			if (requestId !== undefined)
				window.cancelAnimationFrame(requestId);
			else console.error('myThreejs.create.onloadScripts: requestId = ' + requestId);
			clearThree(scene);

			//Не могу выполнить npm run build Получаю ошибку
			//(babel plugin) SyntaxError: D:/My documents/MyProjects/webgl/three.js/GitHub/commonNodeJS/master/myThree/myThree.js: "raycaster" is read-only
			//				raycaster = undefined;

			rendererSizeDefault.onFullScreenToggle(true);
			alert(lang.webglcontextlost);

		}, false);
		canvas.addEventListener("webglcontextrestored", function () {

			console.warn('webglcontextrestored');
			init();
			animate();

		}, false);

		//

		init();
		animate();

		function init() {

			// CAMERA

			camera = new THREE.PerspectiveCamera(options.camera.fov || 70,
				options.camera.aspect || window.innerWidth / window.innerHeight,
				options.camera.near || 0.01,
				options.camera.far || 10);
			camera.position.copy(options.camera.position);
			camera.scale.copy(options.camera.scale);

			//для возврата созданной камеры обратно в код, который вызвал new MyThree
			//В частности это используется для создания точки, за которой будет следить камера
			options.camera = camera;

			options.point.sizePointsMaterial = 100;//size of points with material is not ShaderMaterial is options.point.size / options.point.sizePointsMaterial

			//добавляю camera.userData.default что бы изменять положение камеры во время проигрывания
			if (options.cameraTarget) {

				options.cameraTarget.camera = camera;
				options.playerOptions.cameraTarget.init(options.cameraTarget, options);

			}

			// SCENE

			scene = new THREE.Scene();
			scene.background = new THREE.Color(0x000000);
			scene.fog = new THREE.Fog(0x000000, 250, 1400);
			scene.userData.optionsSpriteText = {

				textHeight: 0.04,
				//fov: camera.fov,
				/*
				rect: {
	
					displayRect: true,
					borderRadius: 15,
	
				},
				*/

			};

			group = new THREE.Group();
			scene.add(group);

			const gl = new FrustumPoints(camera, group, canvas, {

				options: options,

			}).gl;

			//

			renderer = new THREE.WebGLRenderer({

				antialias: true,
				canvas: canvas,
				context: gl,

			});

			//если не выполнить эту команду то в http://localhost/anhr/commonNodeJS/master/fermatSpiral/Examples/
			//холст будет не на весь экран потомучто там не используется меню
			renderer.setSize(window.innerWidth, window.innerHeight);

			options.renderer = renderer;

			options.cursor = renderer.domElement.style.cursor;

			if (options.stereoEffect !== false) {

				options.stereoEffect = options.stereoEffect || {};
				options.stereoEffect.rememberSize = true;//remember default size of the canvas. Resize of the canvas to full screen for stereo mode and restore to default size if no stereo effacts.

			}
			new StereoEffect(renderer, options);
			options.eventListeners = new Options$1.raycaster.EventListeners(camera, renderer, { options: options, scene: scene, });

			function removeTraceLines() {

				group.children.forEach(function (mesh) {

					if ((mesh.userData.player === undefined) || (mesh.userData.player.arrayFuncs === undefined) || (typeof mesh.userData.player.arrayFuncs === "function"))
						return;
					mesh.userData.player.arrayFuncs.forEach(function (vector) {

						if (vector.line === undefined)
							return;
						vector.line.remove();
						vector.line = new Player$2.traceLine(options);

					});

				});

			}

			//Light

			new pointLight(scene, {

				options: options,
				position: options.pointLight && options.pointLight.pointLight1 && options.pointLight.pointLight1.position ? options.pointLight.pointLight1.position :
					new THREE.Vector3(2 * options.scale, 2 * options.scale, 2 * options.scale),

			});
			const pointLight2 = new pointLight(scene, {

				options: options,
				position: options.pointLight && options.pointLight.pointLight2 && options.pointLight.pointLight2.position ? options.pointLight.pointLight2.position :
					new THREE.Vector3(-2 * options.scale, -2 * options.scale, -2 * options.scale),

			});

			//

			//dat-gui JavaScript Controller Library
			//https://github.com/dataarts/dat.gui
			if ((options.dat.gui)) {

				//for debugging
				if (typeof WebGLDebugUtils !== "undefined")
					options.dat.gui.add({

						loseContext: function (value) {

							canvas.loseContext();
							//https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/webglcontextlost_event
							//gl.getExtension( 'WEBGL_lose_context' ).loseContext();

						},

					}, 'loseContext');

				//Close gui window
				if (options.dat.gui.__closeButton.click !== undefined)//for compatibility with Safari 5.1.7 for Windows
					options.dat.gui.__closeButton.click();

			}

			new Player$2(group, {

				onSelectScene: function (index, t) {

					options.boPlayer = true;
					if (options.frustumPoints !== undefined) options.frustumPoints.updateCloudPoints();
					if (options.onSelectScene !== undefined) return options.onSelectScene(index, t);
					return false;//По умолчанию сдедующий шаг проигрывателя выполняется немедленно

				},
				options: options,
				cameraTarget: { camera: camera, },
				onChangeScaleT: function (scale) {

					if (options.player !== undefined)
						options.player.onChangeScale(scale);
					removeTraceLines();

				},

			});
			if (options.player) new options.player.PlayController();// gui );//, getLanguageCode );

			if (options.dat.gui) {

				fOptions = options.dat.gui.addFolder(lang.settings);
				fOptions.id = 'fOptions';//for hyperSphere
				if (options.player)
					options.player.gui(fOptions);

			}

			//Settings for all SpriteText added to scene and child groups
			if (fOptions)
				SpriteTextGui(scene, options, {

					//settings: { zoomMultiplier: 1.5, },
					folder: fOptions,
					options: {

						//rotation: 0,
						//textHeight: 0.1 * scale,//0.05,
						textHeight: 0.05,

						//Camera frustum vertical field of view, from bottom to top of view, in degrees. Default is 50.
						//Вертикальное поле обзора камеры, снизу вверх, в градусах.
						//Если добавить эту настройку, то видимый размер текста не будет зависить от изменения camera.fov.
						//Тогда textHeight будет вычисляться как options.fov * textHeight / 50
						//Если не определить поле textHeight (см. выше) то textHeight = 0.04,
						fov: camera.fov,

						//sizeAttenuation: false,//true,//Whether the size of the sprite is attenuated by the camera depth. (Perspective camera only.) Default is false.

					}

				});

			if (options.stereoEffect) {

				options.stereoEffect.gui({

					folder: fOptions,
					onChangeMode: function (mode) {

						switch (mode) {

							case StereoEffect.spatialMultiplexsIndexs.Mono:
								break;
							case StereoEffect.spatialMultiplexsIndexs.SbS:
							case StereoEffect.spatialMultiplexsIndexs.TaB:
								break;
							default: console.error('myThreejs: Invalid spatialMultiplexIndex = ' + mode);
								return;

						}
						if (options.frustumPoints !== undefined)
							options.frustumPoints.updateGuiSelectPoint();

					},

				});

			}

			function getRendererSize() {

				({

					position: renderer.domElement.style.position,
					left: renderer.domElement.style.left,
					top: renderer.domElement.style.top,
					width: renderer.domElement.style.width,
					height: renderer.domElement.style.height,

				});
					var sizeOriginal = new THREE.Vector2();
				renderer.getSize(sizeOriginal);
				return {

					onFullScreenToggle: function (fs) {

						arrayContainers.display(elContainer.parentElement, !fs);

					},

				};

			}			rendererSizeDefault = getRendererSize();

			renderer.setSize((options.canvas !== undefined) && (options.canvas.width !== undefined) ? options.canvas.width : canvas.clientWidth,
				(options.canvas !== undefined) && (options.canvas.height !== undefined) ? options.canvas.height : canvas.clientHeight);

			//CanvasMenu вызываю после renderer.setSize
			//потому что если задан options.canvas.fullScreen = true,
			//то CanvasMenu изменяет размер renderer до fullScreen
			new CanvasMenu(renderer, {

				fullScreen: {

					fullScreen: options.canvas.fullScreen,
					camera: camera,
					arrayContainersLength: function () { return arrayContainers.length; },
					onFullScreenToggle: function (fullScreen) {

						rendererSizeDefault.onFullScreenToggle(fullScreen);

						//скрыть controllers.w.position.elSlider of arrayFuncs типа colorpicker если canvas на весь экран
						//иначе colorpicker будет виден в canvas
						function onFullScreenToggle(group, fullScreen) {

							//если не делать этот setTimeout и если canvas по умолчанию на весь экран, то сквозь canvas будет видна палтра elSlider
							//которую я рисую на веб станице если в настройках точек будет указана
							setTimeout(function () {

								function recursion(children) {

									children.forEach(function (mesh) {

										recursion(mesh.children);
										if (mesh instanceof THREE.Group) {

											onFullScreenToggle(mesh, fullScreen);
											return;

										}
										if ((mesh.userData.player === undefined) || (mesh.userData.player.arrayFuncs === undefined) || (typeof mesh.userData.player.arrayFuncs === "function"))
											return;
										mesh.userData.player.arrayFuncs.forEach(function (vector) {

											if (vector.controllers && vector.controllers.w && vector.controllers.w.position && vector.controllers.w.position.elSlider)
												vector.controllers.w.position.elSlider.style.display = fullScreen ? 'block' : 'none';
											if (vector.line === undefined)
												return;
											vector.line.remove();
											vector.line = new Player$2.traceLine(options);

										});

									});

								}
								recursion(group.children);

							}, 0);

						}
						onFullScreenToggle(scene, fullScreen);

					},

				},
				options: options,

			});

			//use orbit controls allow the camera to orbit around a target. https://threejs.org/docs/index.html#examples/en/controls/OrbitControls
			options.createOrbitControls(camera, renderer, scene);

			if (fOptions) {

				new GuiSelectPoint(options, {

					cameraTarget: {

						camera: camera,
						orbitControls: options.orbitControls,//controls,

					},
					//displays the trace of the movement of all points of the mesh
					pointsControls: function (fPoints, dislayEl, getMesh) { },
					//displays the trace of the point movement
					pointControls: function (fPoint, dislayEl, getMesh) { },

				});
				if (options.guiSelectPoint) options.guiSelectPoint.add();

			}

			defaultPoint.size = options.point.size;

			const pointName = options.dat ? options.dat.getCookieName('Point') : 'Point';
			if (options.dat) options.dat.cookie.getObject(pointName, options.point, options.point);
			three$1.group = group;

			if (createXDobjects) createXDobjects(group, options);

			//вызываю после createXDobjects для того что бы была возможность редактировать настройки AxesHelper. Например в классе nD
			new AxesHelper(scene, options);

			if (options.frustumPoints) options.frustumPoints.create(renderer);

			//На случай когда указана точка, за которой следит камера и когда Player не создан
			if (!options.player) {

				Player$2.selectPlayScene(group, { options: options });//, Player.getTime(), 0 );

			}
			options.boPlayer = false;

			//default setting for each 3D object
			group.children.forEach(function (mesh) {

				options.saveMeshDefault(mesh);

			});
			if (options.dat.gui) {

				AxesHelperGui(options, fOptions);

				new MoveGroupGui(group, options, {

					folder: fOptions,

				});

				//OrbitControls gui

				if (options.orbitControls !== false) {

					new OrbitControlsGui(options, fOptions);

				}

				//camera gui

				new CameraGui(camera, options, fOptions);

				// light

				pointLight2.controls({ group: group, folder: fOptions, folderName: lang.light + ' 2' });

				//point

				const folderPoint = new FolderPoint(options.point, function (value) {

					if (value === undefined)
						value = options.point.size;
					if (value < 0)
						value = 0;
					group.children.forEach(function (mesh) {

						if ((mesh.type !== 'Points') || mesh.userData.boFrustumPoints)
							return;
						if (mesh.material.uniforms === undefined)
							mesh.material.size = value / options.point.sizePointsMaterial;//PointsMaterial
						else mesh.material.uniforms.pointSize.value = value;//shaderMaterial

					});
					folderPoint.size.setValue(value);
					options.point.size = value;
					options.dat.cookie.setObject(pointName, options.point);

				}, options, {

					folder: fOptions,
					defaultPoint: defaultPoint,

				});

				//Frustum points
				if (options.frustumPoints)// && options.dat.guiFrustumPoints )
					options.frustumPoints.gui(fOptions);

				options.restoreSceneController(camera, scene);

			}

			//https://github.com/mrdoob/stats.js/
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
			if (isFullScreen())
				size = new THREE.Vector2(window.innerWidth, window.innerHeight);
			else {

				size = new THREE.Vector2();
				renderer.getSize(size);

			}
			camera.aspect = size.x / size.y;
			camera.updateProjectionMatrix();

			renderer.setSize(size.x, size.y);
			if (options.frustumPoints !== undefined)
				options.frustumPoints.update();

		}
		function animate() {

			if (stats !== undefined)
				stats.begin();

			requestId = requestAnimationFrame(animate);

			render();

			if (stats !== undefined)
				stats.end();

		}
		function render() {

			if (!options.stereoEffect || !options.stereoEffect.render)
				renderer.render(scene, camera);
			else options.stereoEffect.render(scene, camera);
			if (cameraPosition === undefined)
				cameraPosition = new THREE.Vector3();
			if (pointSize === undefined)
				pointSize = options.point.size;
			if (
				!cameraPosition.equals(camera.position) ||
				(pointSize != options.point.size) ||
				((options.frustumPoints !== undefined) && options.frustumPoints.animate())
			) {

				cameraPosition.copy(camera.position);
				pointSize = options.point.size;

				group.children.forEach(function (mesh) {

					if (mesh instanceof THREE.Points === false)
						return;

					if (mesh.geometry.attributes.size === undefined) {

						mesh.material.size = pointSize / options.point.sizePointsMaterial;
						return;

					}
					if (options.point.opacity !== undefined)
						mesh.material.uniforms.opacity.value = options.point.opacity;

					//scale
					var scale = myPoints.getGlobalScale(mesh);
					var cameraPosition = new THREE.Vector3(camera.position.x / scale.x, camera.position.y / scale.y, camera.position.z / scale.z);
					scale = (scale.x + scale.y + scale.z) / 3;

					//set size of points with ShaderMaterial
					//https://threejs.org/docs/index.html#api/en/materials/ShaderMaterial
					//Example https://threejs.org/examples/?q=points#webgl_custom_attributes_points2

					//points with ShaderMaterial
					for (var i = 0; i < mesh.geometry.attributes.position.count; i++) {

						var position = getObjectPosition(mesh, i),//getObjectLocalPosition( mesh, i ),
							position3d = new THREE.Vector3(position.x, position.y, position.z),
							distance = position3d.distanceTo(cameraPosition),
							y = 1;
						//дальние точки очень маленькие
						//	angle = cameraPosition.angleTo( position3d ),
						//	cameraFov = ( Math.PI / 180 ) * 0.5 * camera.fov,
						//	y = 1 - 0.4 * ( angle / cameraFov );

						mesh.geometry.attributes.size.setX(i, Math.tan(

							mesh.userData.shaderMaterial.point !== undefined &&
								mesh.userData.shaderMaterial.point.size !== undefined ?
								mesh.userData.shaderMaterial.point.size : options.point.size

						) * distance * scale * y);
						mesh.geometry.attributes.size.needsUpdate = true;

					}


				});

			}

		}

		/**
		 * Sets the size of the canvas
		 * @param {number|object} width width of the canvas.
		 * <pre>
		 * If <b>width</b> is object, followed keys is available:
		 * </pre>
		 * @param {number} width.width width of the canvas
		 * @param {number} width.height height of the canvas
		 * @param {number} height height of the canvas
		 */
		this.setSize = function (width, height) {

			if (typeof width === "object") {

				height = width.height;
				width = width.width;

			}
			if (width === undefined) {

				//Используется в treeView.js для открытия ветки с холстом
				const target = {
					set: function (width, height) {

						renderer.setSize(width, height);

					}
				};
				renderer.getSize(target);
				return;

			}
			renderer.setSize(width, height);

		};

		arrayCreates.shift();
		var params = arrayCreates.shift();
		if (params === undefined)
			return;
		myThreejs.create(params.createXDobjects, params.options);

	}

}

MyThree.release = 'v1.4';

//Localization

const lang = {

	defaultButton: 'Default',

	settings: 'Settings',
	webglcontextlost: 'The user agent has detected that the drawing buffer associated with a WebGLRenderingContext object has been lost.',

	light: 'Light',

	opacity: 'Opacity',

};

switch (getLanguageCode()) {

	case 'ru'://Russian language

		lang.defaultButton = 'Восстановить';
		lang.name = 'Имя';
		lang.settings = 'Настройки';
		lang.webglcontextlost = 'Пользовательский агент обнаружил, что буфер рисунка, связанный с объектом WebGLRenderingContext, потерян.';

		lang.light = 'Свет';

		lang.opacity = 'Непрозрачность';
		break;

}

/** @namespace
 * @description Creating the new [THREE.Points]{@link https://threejs.org/docs/index.html?q=poi#api/en/objects/Points} and adding it into group.
 * @see <a href="../../myPoints/jsdoc/index.html" target="_blank">MyPoints</a>.
 */
MyThree.MyPoints = MyPoints;

/** @namespace */
MyThree.StereoEffect = {

	/**
	 * Enumeration of available stereo modes.
	 * @see <a href="../../StereoEffect/jsdoc/module-StereoEffect.html#~spatialMultiplexsIndexs" target="_blank">StereoEffect.spatialMultiplexsIndexs</a> for details.
	 * @inner
	 */
	spatialMultiplexsIndexs: StereoEffect.spatialMultiplexsIndexs,

};
/** @namespace
 * @description Pure JavaScript color picker.
 * @see <a href="../../colorpicker/jsdoc/index.html" target="_blank">ColorPicker</a>.
 */
MyThree.ColorPicker = ColorPicker$1;

/** @namespace
 * @description gets position of the vector in world coordinates, taking into account the position, scale and rotation of the 3D object
 * @param {THREE.Object3D} object
 * @param {THREE.Vector3} pos local position
 * @returns world position
 * @see <a href="../../guiSelectPoint/jsdoc/module-GuiSelectPoint.html#~getWorldPosition" target="_blank">getWorldPosition</a>.
 */
MyThree.getWorldPosition = getWorldPosition;

/** @namespace
 * @description Limits angles of rotations of the mesh between 0 and 360 degrees.
 * @param {THREE.Euler} rotation angles for limitation
 */
MyThree.limitAngles = function (rotation) {

	function limitAngle(axisName) {

		while (rotation[axisName] > Math.PI * 2)
			rotation[axisName] -= Math.PI * 2;

	}
	limitAngle('x');
	limitAngle('y');
	limitAngle('z');

};

/** @namespace
 * @description 3D objects animation.
 * @see <a href="../../Player/jsdoc/index.html" target="_blank">Player</a> class.
 */
MyThree.Player = Player$2;

/** @namespace
 * @description class for [THREE]{@link https://github.com/anhr/three.js} and [dat.GUI(...)]{@link https://github.com/anhr/dat.gui} variables.
 * @see <a href="../../jsdoc/three/index.html" target="_blank">three</a> class.
 */
MyThree.three = three$1;

/** @namespace
 * @description Options.
 * @see <a href="../../jsdoc/Options/index.html" target="_blank">Options</a> class.
 */
MyThree.Options = Options$1;

window.__myThree__ = window.__myThree__ || {};
if (window.__myThree__.boMyThree)
	console.error('myThree: duplicate myThree. Please use one instance of the myThree class.');
window.__myThree__.boMyThree = true;
/** @namespace
 * @description Creates an intersection line for graphic objects.
 * @see <a href="../../intersections/jsdoc/index.html" target="_blank">Intersections</a>.
 */
MyThree.Intersections = Intersections;
MyThree.TreeView = TreeView;

export { MyThree as default };
//# sourceMappingURL=myThree.module.js.map
