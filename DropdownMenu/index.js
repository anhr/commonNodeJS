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

import loadScript from '../loadScriptNodeJS/loadScript.js';

var optionsStyle = {

	//style rel="stylesheet"
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
//console.warn( 'getCurrentScriptPath = ' + getCurrentScriptPath() );
var currentScriptPath = getCurrentScriptPath();
//Для D:\My documents\MyProjects\webgl\three.js\GitHub\commonNodeJS\master\DropdownMenu\build
var arrayPath = currentScriptPath.split( /(.*)(\/build)/ );
if ( arrayPath[2] === '/build' ) currentScriptPath = arrayPath[1];
//Для D:\My documents\MyProjects\webgl\three.js\GitHub\commonNodeJS\master\canvasMenu\build
arrayPath = currentScriptPath.split( /(.*)(\/canvasMenu)/ );
if ( arrayPath[2] === '/canvasMenu' ) currentScriptPath = arrayPath[1] + '/DropdownMenu';

//Attention! Load menu.css file before other css files for correctly priority of the styles
loadScript.sync( currentScriptPath + '/styles/menu.css', optionsStyle );
loadScript.sync( currentScriptPath + '/styles/Decorations/transparent.css', optionsStyle );
loadScript.sync( currentScriptPath + '/styles/Decorations/gradient.css', optionsStyle );
/*
loadScript.sync( 'https://raw.githack.com/anhr/DropdownMenu/master/styles/menu.css', optionsStyle );
loadScript.sync( 'https://raw.githack.com/anhr/DropdownMenu/master/styles/Decorations/transparent.css', optionsStyle );
loadScript.sync( 'https://raw.githack.com/anhr/DropdownMenu/master/styles/Decorations/gradient.css', optionsStyle );
*/

/**
 * Creates new menu
 * @param {Object[]} arrayMenu array of menu and submenu items. If string then menu item name. If object then options of the new menu item:
 * @param {String|HTMLElement} [arrayMenu.name] if string then menu item name. If HTMLElement then item element.
 * @param {String} [arrayMenu.title] menu item title.
 * @param {String} [arrayMenu.id] menu item identifier.
 * @param {String} [arrayMenu.style] menu item style. Example: "float: right;".
 * @param {Array} [arrayMenu.items] array of submenu items. Same as menu item.
 * @param {Function} [arrayMenu.onclick] function(event) called when user has clicked a menu item. event - event details.
 * @param {Object} [arrayMenu.drop] direction of drop of the submenu.
 * <pre>
 * Following directions is available:
 * If string then "up" - drop submenu to up. "left" - shift submenu to left.
 * If object then following members is available: "up: true" and "left: true".
 * </pre>
 * @param {boolean} [arrayMenu.drop.up] true - drop submenu to up.
 * @param {boolean} [arrayMenu.drop.left] true - shift submenu to left.
 * @param {boolean} [arrayMenu.radio] true - defines a radio menu item.
 * @param {boolean} [arrayMenu.checkbox] true - defines a checkbox menu item.
 * @param {boolean} [arrayMenu.checked] true - checked state of a checkbox or radio menu item.
 *
 * @param {Object} [options] followed options is available.
 * @param {HTMLElement} [options.elParent="body" element] Parent element of new menu.
 * @param {HTMLElement} [options.canvas] canvas element. Use if you want put a menu inside a canvas. See "button inside canvas" example below for details.
 * @param {String} [options.decorations] You can decorate your menu by a built-in style or use your custom style. Currently two built-in styles is available:
 * <pre>
 * 'Gradient' - use [gradient.css]{@link https://raw.githack.com/anhr/commonNodeJS/master/DropdownMenu/styles/Decorations/gradient.css} file for decoration.
 * 'Transparent' - use [transparent.css]{@link https://raw.githack.com/anhr/commonNodeJS/master/DropdownMenu/styles/Decorations/transparent.css} file for decoration.
 * Custom decoration:
 * 'Custom' please edit the [custom.css]{@link https://raw.githack.com/anhr/commonNodeJS/master/DropdownMenu/Examples/html/custom.css} file from my example if you want a custom decoration of your menu.
 * <pre>
 *
 * @example
 * 
	//button inside canvas
	<div class="container" id="containerDSE">
		<canvas id="canvas"></canvas>
	</div>
	<script>
	var elContainer = document.getElementById( "containerDSE" ),
	elCanvas = elContainer.querySelector( 'canvas' );

	DropdownMenu.create( [

		{

			name: 'Button',
			onclick: function ( event ) {

				var message = 'Button onclick';
				//console.log( message );
				alert( message )

			},

		},

	], {

		elParent: elContainer,
		canvas: elCanvas,
		decorations: 'Transparent',

	} );
	</script>
 *
 */
function create( arrayMenu, options ) {

	options = options || {};
	options.elParent = options.elParent || document.querySelector( 'body' );

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

		}
		options.canvas.onmousemove = function ( event ) {

			displayControls();

		}
		elMenu.onmousemove = function ( event ) {

			displayControls();

		}

	}
	options.elParent.appendChild( elMenu );

	arrayMenu.forEach( function ( menuItem ) {

		var dropdownChild = 'dropdown-child';
		function moveUpLeft( drop ) {

			setTimeout( function () {

				var display = elDropdownChild.style.display;
				elDropdownChild.style.display = 'block';
				if ( drop.up )
					elDropdownChild.style.top = '-' + ( elDropdownChild.offsetHeight/* + borderWidth*/ ) + 'px';
				else elDropdownChild.style.top = ( elMenuButton.offsetHeight/* - borderWidth + top*/ -1 ) + 'px';
				if ( drop.left )
					elDropdownChild.style.left = ( elMenuButton.offsetWidth - elDropdownChild.offsetWidth/* - borderWidth*/ ) + 'px';
				elDropdownChild.style.display = display;//'none';

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

					var str = typeof item === 'string' ?
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
				var name;
				if ( typeof itemItem === 'string' )
					name = itemItem;
				else {

					name = itemItem.name;
					elName.onclick = function ( event ) {

						if ( itemItem.radio === true ) {

//							console.log( 'radio onclick ' + elName.innerHTML );
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

//							console.log( 'checkbox onclick ' + elName.innerHTML );
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
							
					}

				}
				if ( itemItem.radio === true )
					elName.classList.add( 'radio' );
				if ( itemItem.checkbox === true )
					elName.classList.add( 'checkbox' );
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
							elDropdownChild.style.top = ( elMenuButton.offsetHeight/* - getMenuButtonBorderWidth()*/ - 1 ) + 'px';

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
export { create };
//export default create;
