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
	 * @param {HTMLElement} elParent parent element
	 * @param {Function} step A function to be executed asynchronous during progress.
	 * @param {object} [settings={}] The following settings are available
	 * @param {string} [settings.sTitle=""] Progress bar title.
	 * @param {number} [settings.min="0"] The lowest value in the range of permitted values.
	 * @param {number} [settings.max="1"] The greatest value in the range of permitted values.
	 */
	constructor(elParent, step, settings = {}) {

		const elProgress = document.createElement( 'div' ),
			cProgress = document.createElement( 'input' ),
			elTitle = document.createElement( 'div' );
		elProgress.style.position = 'absolute';
		elProgress.style.top = 0;
		elProgress.style.left = 0;
		elProgress.style.backgroundColor = 'white';
		elProgress.style.margin = '2px';
		elProgress.style.padding = '2px';
		elTitle.innerHTML = settings.sTitle || '';
		elTitle.style.color = 'black';
		elProgress.appendChild( elTitle );
		cProgress.min = settings.min != undefined ? settings.min : "0";
		cProgress.max = settings.max != undefined ? settings.max : "1";
//		cProgress.max = object.geometry.index.count;
		cProgress.type = "range";
		cProgress.disabled = true;
		elProgress.appendChild( cProgress );
		elParent.appendChild( elProgress );
		this.setValue = (value) => { cProgress.value = value; }
		/**
		 * Execute the next step asynchronously.
		 */
		this.step = () => { window.setTimeout(() => { step() }, 0); }
		/**
		 * remove progress bar from your web page.
		 **/
		this.remove = () => { elProgress.remove(); };
		this.step();
	
		/**
		 * set new step function
		 */
		this.newStep = (value) => { step = value; }
		
		/**
		 * set new title
		 */
		this.title = (value) => { elTitle.innerHTML = value; }

	}

}

export default ProgressBar;
