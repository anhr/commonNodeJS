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


import loadScript from '../loadScriptNodeJS/loadScript.js';
//import loadScript from 'https://raw.githack.com/anhr/commonNodeJS/master/loadScriptNodeJS/loadScript.js';

import three from '../three.js'

const optionsStyle = {

	tag: 'style'

}

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
const currentScriptPath = getCurrentScriptPath();

loadScript.sync( currentScriptPath + '/colorpicker.css', optionsStyle );

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

		}

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

			options.onError = options.onError || function () { }

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

			};

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
				};

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
		}
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
			this.getPaletteIndex = function () { return options.palette; }

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
			this.isPalette = function () { return true; }
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

			}
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

			}

			/**
			* converts a value in percentages to color.
			* @param {number} value coordinate of color from palette in percent. Default value range from 0 to 100.
			* @param {number} [min] minimal value
			* @param {number} [max] maximal value
			* @returns {THREE.Color} [color]{@link https://threejs.org/docs/index.html?q=Colo#api/en/math/Color}
			*/
			this.toColor = function ( value, min, max ) {

				const THREE = three.THREE;
				if ( value instanceof THREE.Color )
					return value;
				var c = this.hsv2rgb( value, min, max );
				if ( c === undefined )
					c = { r: 255, g: 255, b: 255 }
				return new THREE.Color( "rgb(" + c.r + ", " + c.g + ", " + c.b + ")" );

			}

//			boCreated = true;

		}
	}
}
ColorPicker = new ColorPicker();
export default ColorPicker;
