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

		const elProgress = document.createElement('div'),
			cProgress = document.createElement('input'),
			elTitle = document.createElement('div');
		//		elProgress.style.position = 'absolute';
		//		elProgress.style.top = 0;
		//		elProgress.style.left = 0;
		elProgress.style.backgroundColor = 'white';
		elProgress.style.margin = '2px';
		elProgress.style.padding = '2px';
		elTitle.innerHTML = settings.sTitle || '';
		elTitle.style.color = 'black';
		elProgress.appendChild(elTitle);
		cProgress.min = settings.min != undefined ? settings.min : "0";
		cProgress.max = settings.max != undefined ? settings.max : "1";
		//		cProgress.max = object.geometry.index.count;
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
			//			elcontainer.style.display = 'flex';//https://ru.stackoverflow.com/questions/1016963/%D0%A0%D0%B0%D1%81%D0%BF%D0%BE%D0%BB%D0%BE%D0%B6%D0%B8%D1%82%D1%8C-%D1%8D%D0%BB%D0%B5%D0%BC%D0%B5%D0%BD%D1%82%D1%8B-%D0%B2-%D1%81%D1%82%D0%BE%D0%BB%D0%B1%D0%B5%D1%86
			elcontainer.style.position = 'absolute';
			elcontainer.style.top = 0;
			elcontainer.style.left = 0;
			elParent.appendChild(elcontainer);

		}
		const elRow = document.createElement('tr');
		elRow.appendChild(elProgress);
		elcontainer.appendChild(elRow);
		this.setValue = (value) => { cProgress.value = value; }
		
		if (settings.timeoutPeriod === undefined) settings.timeoutPeriod = 0;
		let timeoutPeriod = settings.timeoutPeriod;//таймер можно запускать через определенный период что бы экономилось время выполнения
		
		/**
		 * Execute the next step asynchronously.
		 */
		this.step = () => {

			if (timeoutPeriod < settings.timeoutPeriod) {

				timeoutPeriod++;
				step();
				
			} else {
				
				timeoutPeriod = 0;
				window.setTimeout(() => { step() }, 0);

			}
			//window.requestAnimationFrame(step);//время выполнения увеличивается на треть

		}
		/**
		 * remove progress bar from your web page.
		 **/
		this.remove = () => { elProgress.parentElement.remove(); };
  
		this.step();

		/**
		 * set new step function
		 * @param {function} stepFunction New step function. See the ProgressBar constructor's "step" parameter.
		 */
		this.newStep = (stepFunction) => { step = stepFunction; }

		/**
		 * set new title
		 * @param {string} newTitle
		 */
		this.title = (newTitle) => { elTitle.innerHTML = newTitle; }

	}

}

export default ProgressBar;
