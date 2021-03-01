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

//import { lang } from '../index.js';
import { lang } from '../controllerPlay/index.js';

//import { create as dropdownMenuCreate } from '../DropdownMenu/index.js';
import DropdownMenu from '../DropdownMenu/dropdownMenu.js';

//import StereoEffect from 'https://raw.githack.com/anhr/commonNodeJS/master/StereoEffect/StereoEffect.js';
import StereoEffect from '../StereoEffect/StereoEffect.js';

import CreateFullScreenSettings from '../createFullScreenSettings.js';

/**
 * @callback onFullScreenToggle
 * @param {boolean} fullScreen true - full screen mode of the canvas.
 */

/**
 * Create [dropdown menu]{@link https://github.com/anhr/commonNodeJS/tree/master/DropdownMenu} for canvas in my [three.js]{@link https://threejs.org/} projects.
 * @param {THREE.WebGLRenderer} renderer [THREE.WebGLRenderer]{@link https://threejs.org/docs/index.html#api/en/renderers/WebGLRenderer}.
 * @param {object} [options] the following options are available
 * @param {Array} [options.menu] menu array. See <b>arrayMenu</b> of the [DropdownMenu.create]{@link https://raw.githack.com/anhr/commonNodeJS/master/DropdownMenu/jsdoc/module-DropdownMenu.html#~create}
 * @param {Object} [options.stereoEffect] new [StereoEffect(...)]{@link https://github.com/anhr/commonNodeJS/blob/master/StereoEffect/README.md}.
 * @param {Object} [options.player] new [Player(...)]{@link https://raw.githack.com/anhr/commonNodeJS/master/player/jsdoc/index.html}. Playing of 3D ojbects in my projects.
 * @param {Object} [options.fullScreen] Add a "Full Screen" button
 * @param {onFullScreen} options.fullScreen.camera [THREE.PerspectiveCamera]{@link https://threejs.org/docs/index.html#api/en/cameras/PerspectiveCamera}.
 * @param {THREE} options.fullScreen.THREE THREE {@link https://github.com/anhr/three.js|THREE}.
 * @param {onFullScreenToggle} [options.fullScreen.onFullScreenToggle] user toggled fullscreen mode of the canvas.
 * @param {Function} [options.getLanguageCode="en"] returns the "primary language" subtag of the version of the browser. Default returns "en" is English
 */
function CanvasMenu( renderer, options ) {
	
	options = options || {};
	
	if ( options.THREE && ( renderer instanceof options.THREE.WebGLRenderer !== true ) ){

		console.error( 'CanvasMenu: renderer is not THREE.WebGLRenderer' );
		return;
		
	}
	const elCanvas = renderer.domElement, elContainer = elCanvas.parentElement;
	if ( elContainer.tagName !== "DIV" ) {

		console.error( 'CanvasMenu: elContainer.tagName = ' + elContainer.tagName );
		return;

	}
	const container = "container";
	if ( !elContainer.classList.contains( "container" ) ) elContainer.classList.add( "container" );
	options.menu = options.menu || [];

	/**
	 * Menu array
	 * @array canvasMenu.
	 * menu
	 * @see <b>arrayMenu</b> of the [DropdownMenu.create]{@link https://raw.githack.com/anhr/commonNodeJS/master/DropdownMenu/jsdoc/module-DropdownMenu.html#~create}
	 */
	this.menu = options.menu;

	if ( options.stereoEffect !== undefined ) {

		options.stereoEffect.createCanvasMenuItem( this, { getLanguageCode: options.getLanguageCode } );

	}
	
	if ( options.player !== undefined ) { options.player.createCanvasMenuItem( this ); }

	CreateFullScreenSettings.RendererSetSize( renderer, this );

	//Full Screen button
	var fullScreenSettings;
	if ( options.fullScreen !== undefined ) {

		if ( !options.fullScreen.camera ) {

			console.error( 'CanvasMenu: options.fullScreen.camera = ' + options.fullScreen.camera );
			return;
			
		}
		fullScreenSettings = new CreateFullScreenSettings( options.fullScreen.THREE, renderer, options.fullScreen.camera,
			{

				canvasMenu: this,
				fullScreen: options.fullScreen,

			} );
		if ( options.fullScreen.fullScreen ) fullScreenSettings.setFullScreen();

		/**
		 * @function canvasMenu.
		 * getFullScreenSettings
		 * @param {StereoEffect} stereoEffect [StereoEffect]{@link https://github.com/anhr/commonNodeJS/blob/master/StereoEffect/README.md}.
		 * @returns Set <b>stereoEffect</b> to <b>fullScreenSettings</b> and returns <b>fullScreenSettings</b>.
		 */
		this.getFullScreenSettings = function( stereoEffect ) {

			fullScreenSettings.setStereoEffect( stereoEffect );
			return fullScreenSettings;

		}
		/**
		 * @function canvasMenu.
		 * isFullScreen
		 * @returns <b>true</b> if <b>canvas</b> is full screen.
		 */
		this.isFullScreen = function () { return fullScreenSettings.isFullScreen(); }
		/**
		 * Sets the full screen of the canvas.
		 * @function canvasMenu.
		 * setFullScreen
		 * @param {boolean} fullScreen false - full screen of the canvas.
		 */
		this.setFullScreen = function ( fullScreen ) { return fullScreenSettings.setFullScreen( fullScreen ); }
		options.menu.push( {

			style: 'float: right;',
			id: "menuButtonFullScreen",
			onclick: function ( event ) { fullScreenSettings.onclick(); }

		} );

	}

	//Play slider
	if ( options.player !== undefined ) options.player.addSlider();

	elMenu = DropdownMenu.create( options.menu, {

		elParent: typeof elContainer === "string" ? document.getElementById( elContainer) : elContainer,
		canvas: typeof elCanvas === "string" ? document.getElementById( elCanvas ) : elCanvas,
		decorations: 'Transparent',

	} );

	/**
	 * @function canvasMenu.
	 * querySelector
	 * @param {string} selectors See CSS selectors in [HTML DOM querySelector() Method]{@link https://www.w3schools.com/jsref/met_document_queryselector.asp} for details.
	 * @returns returns the first element that matches a specified CSS selector(s) in the canvasMenu.
	 */
	this.querySelector = function( selectors ){ return elMenu.querySelector( selectors ); }
	if ( options.onOver !== undefined ) {

		elMenu.addEventListener( 'mouseenter', function ( event ) { options.onOver( true ); });
		elMenu.addEventListener( 'mouseleave', function ( event ) { options.onOver( false ); } );
					
	}
	if ( options.player ) options.player.addSliderEvents();// options.THREE );

	if ( options.fullScreen ) {

		/**
		 * Sets the "Full Screen" button. Available only if <b>options.fullScreen</b> is defined.
		 * @function canvasMenu.
		 * setFullScreenButton
		 * @param {boolean} fullScreen true - non full screen.
		 * <p>false - full screen of the canvas.</p>
		 */
		this.setFullScreenButton = function ( fullScreen ) {

			if ( fullScreen === undefined ) fullScreen = options.fullScreen.fullScreen;
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

		}
		this.setFullScreenButton();

		if ( options.stereoEffect && ( options.stereoEffect.options.spatialMultiplex !== StereoEffect.spatialMultiplexsIndexs.Mono ) )
			this.setFullScreen( false );

	}

	/**
	 * Sets the size of the slider element of the player's menu.
	 * @function canvasMenu.
	 * setSize
	 * @param {Number} width width of the canvas
	 */
	this.setSize = function ( width ) {
		if ( elMenu === undefined )
			return;
		var itemWidth = 0, elSlider;
		//elMenu.childNodes.forEach( function ( menuItem )not compatible with IE 11
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

				elSlider = elSliderCur;//menuItem;
				itemWidth += styleWidth;

			}

		}

		if ( !elSlider )
			return;//no controllerPlay
		var sliderWidth = width - itemWidth;
		if ( sliderWidth > 0 ) {

			elSlider.parentElement.style.width = sliderWidth + 'px';

		}

	}
	/*Не выводится в jsdoc*
	 * Changes the "max" value of the slider of the player's menu. Moves [Player]{@link https://raw.githack.com/anhr/commonNodeJS/master/player/jsdoc/module-Player.html} to the first scene.
	 * @function canvasMenu.
	 * onChangeScale
	 * @param {Object} scale See <b>options.settings</b> of the [Player]{@link https://raw.githack.com/anhr/commonNodeJS/master/player/jsdoc/module-Player.html}.
	 */
/*	 
	this.onChangeScale = function ( scale ) {

		if ( options.player === undefined )
			return;
		elSlider.max = scale.marks - 1;
		options.player.selectScene( 0 );

	}
*/	
	/*не выводится в jsdoc*
	 * Sets the [SteroEffect]{@link https://github.com/anhr/commonNodeJS/blob/master/StereoEffect/README.md} mode.
	 * @function canvasMenu.
	 * setSpatialMultiplexs
	 * @param {number} mode Available modes see in [StereoEffect.spatialMultiplexsIndexs]{@link https://raw.githack.com/anhr/commonNodeJS/master/StereoEffect/jsdoc/module-StereoEffect.html#~spatialMultiplexsIndexs}.
	 */
/*	 
	this.setSpatialMultiplexs = function ( mode ) {

		menuItemStereoEffect.items.forEach( function ( item ) {

			if ( item.spatialMultiplex === mode ) {

				if ( !item.checked ) {

					item.elName.onclick( { target: item.elName });

				}

			}

		} );

	}
*/	
	/*не выводится в jsdoc*
	 * Sets the [Player]{@link https://raw.githack.com/anhr/commonNodeJS/master/player/jsdoc/module-Player.html}.
	 * @function canvasMenu.
	 * setPlayer
	 * @param {Player} player [Player]{@link https://raw.githack.com/anhr/commonNodeJS/master/player/jsdoc/module-Player.html}.
	 */
	/*
	this.setPlayer = function ( player ) {

		options.player = player;
		player.controllers.push( this );
		elSlider.value = 0;

	}
	*/
	if ( options.player !== undefined )
		options.player.pushController( this );
	var elMenu;//, elSlider;//, sliderTitle = lang.animateSceneId;//'Animate scene id ';
/*
	if ( fullScreenSettings )
		fullScreenSettings.setFullScreen( true );
*/
/*
		fullScreenSettings.setSize( ( elCanvas !== undefined ) && ( elCanvas.width !== undefined ) ? elCanvas.width : elCanvas.clientWidth,
			( elCanvas !== undefined ) && ( elCanvas.height !== undefined ) ? elCanvas.height : elCanvas.clientHeight );
*/
	const size = { set: function( width, height ) { this.x = width; this.y = height } };//new options.THREE.Vector2();
	renderer.getSize( size );
	this.setSize( size.x, size.y );

}
export default CanvasMenu;
