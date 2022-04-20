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

import cookie from '../cookieNodeJS/cookie.js';

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
			if ( settings.cookie ) {

				if ( elNested.id === '' ) {
					
					const branchId = 'branch_' + id;
					id++;
					if ( document.getElementById( branchId ) ) console.error( 'duplicate branch id: ' + branchId );
					else elNested.id = branchId;

				}
				var boBranchOpen;
				switch( cookie.get( cookieName + elNested.id ) ) {

					case 'false': boBranchOpen = false; break;
					case 'true': boBranchOpen = true; break;
					case '': break;
					default: console.error( 'TreeView: Invalid cookie value' );
						
				}
				if ( ( boBranchOpen !== undefined ) && ( boBranchOpen === boHide ) ) {
					
					elNested.classList.toggle( "hide" );
					elNested.classList.toggle( "active" );
					elNested.style.display = boHide ? 'block' : 'none';

				}
				
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

		}

	}

}
export default TreeView;
