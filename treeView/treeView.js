/**
 * @module CanvasMenu
 * @description My [dropdown menu]{@link https://github.com/anhr/commonNodeJS/tree/master/DropdownMenu} for canvas in my [three.js]{@link https://threejs.org/} projects.
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

import three from '../three.js'
//import { lang } from '../controllerPlay/index.js';

//import { create as dropdownMenuCreate } from '../DropdownMenu/index.js';
import DropdownMenu from '../DropdownMenu/dropdownMenu.js';

//import StereoEffect from 'https://raw.githack.com/anhr/commonNodeJS/master/StereoEffect/StereoEffect.js';
import StereoEffect from '../StereoEffect/StereoEffect.js';

import CreateFullScreenSettings from '../createFullScreenSettings.js';
import Options from '../Options.js'

/**
 * @callback onFullScreenToggle
 * @param {boolean} fullScreen true - full screen mode of the canvas.
 */

class TreeView {

	/**
	 * @class Tree view with CSS and JavaScript. Thanks to [Learn how to create a tree view with CSS and JavaScript.]{@link https://www.w3schools.com/howto/howto_js_treeview.asp}
	 */
	constructor() {

		//https://www.w3schools.com/howto/howto_js_treeview.asp
		var toggler = document.getElementsByClassName( "caret" );
		var i;
		for ( i = 0; i < toggler.length; i++ ) {

			toggler[i].addEventListener( "click", function () {

				const elNested = this.parentElement.querySelector( ".nested" );
				elNested.classList.toggle( "active" );
				this.classList.toggle( "caret-down" );

				//если не выполнить эту команду, то меню на холсте будет состоять из двух строк
				if ( elNested.myThree ) elNested.myThree.setSize( 300, 150 );

			} );

		}
		/**
		 * Sets the size of the canvas
		 * @param {number} width width of the canvas
		 * @param {number} height height of the canvas
		 */
		this.setCanvas = function ( articleId, myThree, setting = {} ) {

			//если не выполнить эту команду, то холст будет пустой
			setting.size = setting.size || {};
			if ( setting.size.width === undefined ) setting.size.width = 300;
			if ( setting.size.height === undefined ) setting.size.height = 150;
			myThree.setSize( setting.size );
			document.getElementById( articleId ).myThree = myThree;

		}

	}

}
export default TreeView;
