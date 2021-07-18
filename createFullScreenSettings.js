/**
 * @module CreateFullScreenSettings
 * @description creates functions for resize of the canvas to fullscreen and restore to default size.
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

//import StereoEffect from 'https://raw.githack.com/anhr/commonNodeJS/master/StereoEffect/StereoEffect.js';
import StereoEffect from './StereoEffect/StereoEffect.js';

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
	this.isFullScreen = function () { return fullScreen; }
	/**
	 * @param {StereoEffect} _stereoEffect <a href="../../StereoEffect/jsdoc/index.html" target="_blank">StereoEffect</a>.
	 */
	this.setStereoEffect = function ( _stereoEffect ) { stereoEffect = _stereoEffect; }
	/**
	 * Sets the full screen of the canvas.
	 * @param {boolean} [fullScreen=false] false - full screen of the canvas.
	 */
	this.setFullScreen = function ( fs=false ) {

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

				}
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

	}
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

	}

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

}
export default CreateFullScreenSettings;