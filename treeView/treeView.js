/**
 * @module TreeView
 * @description Tree view with CSS and JavaScript. Thanks to [Learn how to create a tree view with CSS and JavaScript.]{@link https://www.w3schools.com/howto/howto_js_treeview.asp}
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

class TreeView {

	/**
	 * @class Tree view with CSS and JavaScript. Thanks to [Learn how to create a tree view with CSS and JavaScript.]{@link https://www.w3schools.com/howto/howto_js_treeview.asp}
	 * @param {object} [settings={}] the following settings are available:
	 * @param {boolean} [settings.animate] true - allows you to open a tree branch smoothly.
	 * @param {string} [settings.paddingInlineStart="40px"] right shift of the tree branch. Example: "10px"
	 */
	constructor( settings = {} ) {

		//https://www.w3schools.com/howto/howto_js_treeview.asp

		var toggler = document.getElementsByClassName( "caret" );
		var i;
		for ( i = 0; i < toggler.length; i++ ) {

			const elNested = toggler[i].parentElement.querySelector( ".nested" );
			if ( settings.animate !== undefined ) elNested.classList.add( 'b-toggle' );
			if ( settings.paddingInlineStart !== undefined ) elNested.style.paddingInlineStart = settings.paddingInlineStart;
			toggler[i].addEventListener( "click", function () {

				const elNested = this.parentElement.querySelector( ".nested" );
				elNested.classList.toggle( "hide" );
				elNested.classList.toggle( "active" );
				elNested.style.maxHeight = this.parentElement.querySelector( ".active" ) ? elNested.offsetHeight + 'px' : '';
				this.classList.toggle( "caret-down" );

				//если не выполнить эту команду, то меню на холсте будет состоять из двух строк
				if ( elNested.myThree ) elNested.myThree.setSize();// 300, 150 );

			} );

		}
		/**
		 * Sets a canvas in the tree branch
		 * @param {number} articleId tree branch identifier
		 * @param {MyThree} myThree <a href="../../myThree/jsdoc/index.html" target="_blank">MyThree</a> instance.
		 * @param {object} [settings={}] the following settings are available:
		 * @param {number} [settings.width=300] width of the canvas
		 * @param {number} [settings.height=150] height of the canvas
		 */
		this.setCanvas = function ( articleId, myThree, settings = {} ) {

			//если не выполнить эту команду, то холст будет пустой
			settings.size = settings.size || {};
			if ( settings.size.width === undefined ) settings.size.width = 300;
			if ( settings.size.height === undefined ) settings.size.height = 150;
			myThree.setSize( settings.size );
			document.getElementById( articleId ).myThree = myThree;

		}

	}

}
export default TreeView;
