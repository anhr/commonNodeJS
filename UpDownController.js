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
					button.addEventListener( "wheel", onWheel );
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

}

export default UpDownController;
