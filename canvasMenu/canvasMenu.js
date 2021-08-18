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

class CanvasMenu {

	/**
	 * @class Create [dropdown menu]{@link https://github.com/anhr/commonNodeJS/tree/master/DropdownMenu} for canvas in my [three.js]{@link https://threejs.org/} projects.
	 * @param {THREE.WebGLRenderer} renderer [WebGLRenderer]{@link https://threejs.org/docs/index.html#api/en/renderers/WebGLRenderer}
	 * @param {Object} [settings={}] the following settings are available
	 * @param {Array} [settings.menu] menu array. See <b>arrayMenu</b> of the [DropdownMenu.create]{@link https://raw.githack.com/anhr/commonNodeJS/master/DropdownMenu/jsdoc/module-DropdownMenu.html#~create}
	 * @param {Function} [settings.onOver] The event is fired at an Element when a pointing device (such as a mouse or trackpad) is used to move the cursor onto the element or one of its child elements.
	 * <pre>
	 * true - mouseenter event.
	 * false - mouseleave event.
	 * <pre>
	 *
	 * @param {Object} [settings.fullScreen] Add a "Full Screen" button
	 * @param {onFullScreen} settings.fullScreen.camera [THREE.PerspectiveCamera]{@link https://threejs.org/docs/index.html#api/en/cameras/PerspectiveCamera}.
	 * @param {onFullScreenToggle} [settings.fullScreen.onFullScreenToggle] user toggled fullscreen mode of the canvas.
	 * @param {boolean} [settings.fullScreen.fullScreen] true - default canvas size is full screen.
	 *
	 * @param {Options} [settings.options=new Options()] <a href="../../jsdoc/Options/Options.html" target="_blank">Options</a> instance. The following options are available.
	 * See <b>options</b> parameter of <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
	 * @param {Player} [settings.options.player] <a href="../../Player/jsdoc/index.html" target="_blank">Player</a> instance. Playing of 3D ojbects in my projects.
	 * @param {StereoEffect} [settings.options.stereoEffect] <a href="../../StereoEffect/jsdoc/index.html" target="_blank">StereoEffect</a> instance.
	 * @param {Function} [settings.options.getLanguageCode=language code of your browser] returns the "primary language" subtag of the version of the browser.
	 */
	constructor( renderer, settings = {} ) {

		if ( !three.isThree() ) {

			console.warn( 'CanvasMenu: Set THREE first.' )
			return;

		}
		const THREE = three.THREE;

//		settings = settings || {};
		settings.options = settings.options || new Options();
		const options = settings.options;
		if ( !options.boOptions ) {

			console.error( 'CanvasMenu: call options = new Options( options ) first' );
			return;

		}
		if ( options.canvasMenu === false ) return;
		options.canvasMenu = this;

		//Localization

		const lang = {
			fullScreen: 'Full Screen',
			nonFullScreen: 'Non Full Screen',
		}

//		const getLanguageCode = options.getLanguageCode || function () { return "en"; };
		const getLanguageCode = options.getLanguageCode;
		switch ( getLanguageCode() ) {

			case 'ru'://Russian language
				lang.prevSymbolTitle = 'Кадр назад';//'Go to previous animation scene',
				lang.playTitle = 'Проиграть';//'Play'
				lang.nextSymbolTitle = 'Кадр вперед';//'Go to next animation scene';
				lang.pauseTitle = 'Пауза';//'Pause',
				lang.repeatOn = 'Повторять проигрывание';
				lang.repeatOff = 'Остановить повтор проигрывания';
				lang.controllerTitle = 'Текущее время.';
				/*
										lang.fullScreen = 'На весь экран';
										lang.nonFullScreen = 'Восстановить размеры экрана';
				*/
				lang.stereoEffects = 'Стерео эффекты';
				lang.mono = 'Моно';
				lang.sideBySide = 'Слева направо';
				lang.topAndBottom = 'Сверху вниз';

				break;

		}

		if ( THREE && ( renderer instanceof THREE.WebGLRenderer !== true ) ) {

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
		settings.menu = settings.menu || [];

		/**
		 * Menu array
		 * @array canvasMenu.
		 * menu
		 * @see <b>arrayMenu</b> of the [DropdownMenu.create]{@link https://raw.githack.com/anhr/commonNodeJS/master/DropdownMenu/jsdoc/module-DropdownMenu.html#~create}
		 */
		this.menu = settings.menu;

		if ( settings.options.stereoEffect && settings.options.stereoEffect.createCanvasMenuItem )
			settings.options.stereoEffect.createCanvasMenuItem( this, { getLanguageCode: options.getLanguageCode } );

		if ( options.player ) { options.player.createCanvasMenuItem( this, getLanguageCode ); }

		CreateFullScreenSettings.RendererSetSize( renderer, this );

		//Full Screen button
		var fullScreenSettings;
		if ( settings.fullScreen !== undefined ) {

			if ( !settings.fullScreen.camera ) {

				console.error( 'CanvasMenu: settings.fullScreen.camera = ' + settings.fullScreen.camera );
				return;

			}
			fullScreenSettings = new CreateFullScreenSettings( THREE, renderer, settings.fullScreen.camera,
				{

					canvasMenu: this,
					fullScreen: settings.fullScreen,

				} );
			if ( settings.fullScreen.fullScreen !== false ) fullScreenSettings.setFullScreen();

			/**
			 * @param {StereoEffect} stereoEffect <a href="../../StereoEffect/jsdoc/index.html" target="_blank">StereoEffect</a>.
			 * @returns Set <b>stereoEffect</b> to <b>fullScreenSettings</b> and returns <a href="../../jsdoc/CreateFullScreenSettings/index.html" target="_blank">fullScreenSettings</a>.
			 */
			this.getFullScreenSettings = function ( stereoEffect ) {

				fullScreenSettings.setStereoEffect( stereoEffect );
				return fullScreenSettings;

			}
			/**
			 * @returns <b>true</b> if <b>canvas</b> is full screen.
			 */
			this.isFullScreen = function () { return fullScreenSettings.isFullScreen(); }
			/**
			 * Sets the full screen of the canvas.
			 * @param {boolean} fullScreen false - full screen of the canvas.
			 */
			this.setFullScreen = function ( fullScreen ) { return fullScreenSettings.setFullScreen( fullScreen ); }
			settings.menu.push( {

				style: 'float: right;',
				id: "menuButtonFullScreen",
				onclick: function ( event ) { fullScreenSettings.onclick(); }

			} );

		}

		//Play slider
		if ( options.player ) options.player.addSlider();

		const elMenu = DropdownMenu.create( settings.menu, {

			elParent: typeof elContainer === "string" ? document.getElementById( elContainer ) : elContainer,
			canvas: typeof elCanvas === "string" ? document.getElementById( elCanvas ) : elCanvas,
			decorations: 'Transparent',

		} );

		/**
		 * @param {string} selectors See CSS selectors in [HTML DOM querySelector() Method]{@link https://www.w3schools.com/jsref/met_document_queryselector.asp} for details.
		 * @returns First element that matches a specified CSS selector(s) in the <b>canvasMenu</b>.
		 */
		this.querySelector = function ( selectors ) { return elMenu.querySelector( selectors ); }
		elMenu.addEventListener( 'mouseenter', function ( event ) {

			settings.options.dat.mouseenter = true;
			if ( settings.onOver ) settings.onOver( true );

		} );
		elMenu.addEventListener( 'mouseleave', function ( event ) {

			settings.options.dat.mouseenter = false;
			if ( settings.onOver ) settings.onOver( false );

		} );
		if ( options.player ) options.player.addSliderEvents();// options.THREE );

		if ( settings.fullScreen ) {

			/**
			 * Sets the "Full Screen" button. Available only if <b>settings.fullScreen</b> is defined.
			 * @param {boolean} fullScreen true - non full screen.
			 * <p>false - full screen of the canvas.</p>
			 */
			this.setFullScreenButton = function ( fullScreen ) {

				if ( fullScreen === undefined ) fullScreen = settings.fullScreen.fullScreen;
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

			if (
				settings.options.stereoEffect &&
				settings.options.stereoEffect.settings &&
				( settings.options.stereoEffect.settings.spatialMultiplex !== StereoEffect.spatialMultiplexsIndexs.Mono )
			)
				this.setFullScreen( false );

		}

		/**
		 * Sets the size of the slider element of the player's menu.
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
		const size = { set: function ( width, height ) { this.x = width; this.y = height } };//new options.THREE.Vector2();
		renderer.getSize( size );
		this.setSize( size.x, size.y );

		if ( this.menu.length === 0 ) console.warn( 'CanvasMenu: menu is empty.' );

	}

}
export default CanvasMenu;
