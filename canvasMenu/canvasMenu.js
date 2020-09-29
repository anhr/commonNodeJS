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

//Please download https://github.com/anhr/three.js to '../../DropdownMenu/master/' folder

/**
 * @callback onFullScreen
 * @param {boolean} fullScreen true - full screen mode of the canvas.
 * @param {HTMLElement} elContainer container of the canvas.
 */

/**
 * @callback onFullScreenToggle
 * @param {boolean} fullScreen true - full screen mode of the canvas.
 */

/**
 * Create [dropdown menu]{@link https://github.com/anhr/commonNodeJS/tree/master/DropdownMenu} for canvas in my [three.js]{@link https://threejs.org/} projects.
 * @param {HTMLElement|string} elContainer if the <b>HTMLElement</b>, is a container element for canvas. If the <b>string</b>, is id of a container element for canvas.
 * @param {object} [options] followed options is available
 * @param {Object} [options.stereoEffect] new [StereoEffect(...)]{@link https://github.com/anhr/commonNodeJS/blob/master/StereoEffect/README.md}.
 * @param {Object} [options.player] new [Player(...)]{@link https://raw.githack.com/anhr/commonNodeJS/master/player/jsdoc/index.html}. Playing of 3D ojbects in my projects.
 * @param {Object} [options.fullScreen] Add a "Full Screen" button
 * @param {onFullScreen} [options.fullScreen.onFullScreen] fullscreen mode of the canvas.
 * @param {onFullScreenToggle} [options.fullScreen.onFullScreenToggle] user toggled fullscreen mode of the canvas.
 * @param {THREE} [options.THREE] THREE {@link https://github.com/anhr/three.js|THREE}.
 */
function CanvasMenu( elContainer, options ) {
	

	const elCanvas = elContainer.querySelector( 'canvas' );

	options = options || {};

/*
	if ( options.THREE == undefined )
		options.THREE = THREE;
	if ( typeof options.THREE === "undefined" ) {

		console.error( 'menuPlay.create: THREE = ' + THREE );
		return;

	}
*/
	var stereoEffect, spatialMultiplexsIndexs;
	if ( options.stereoEffect !== undefined ) {

		spatialMultiplexsIndexs = options.stereoEffect.spatialMultiplexsIndexs;
		stereoEffect = options.stereoEffect.stereoEffect;

	}

	const menu = [];
	var menuItemStereoEffect;

	//stereoEffect
	if ( options.stereoEffect ) {

		menuItemStereoEffect = {

			name: '⚭',
			title: lang.stereoEffects,//'Stereo effects',
			id: 'menuButtonStereoEffects',
			drop: 'up',
			items: [

				{
					name: lang.mono,//'Mono',
					radio: true,
					checked: true,
					spatialMultiplex: spatialMultiplexsIndexs.Mono,
					onclick: function ( event ) {

						if ( stereoEffect.setSpatialMultiplex !== undefined )
							stereoEffect.setSpatialMultiplex( spatialMultiplexsIndexs.Mono );
						else stereoEffect.options.spatialMultiplex = spatialMultiplexsIndexs.Mono;

					}
				},
				{
					name: lang.sideBySide,//'Side by side',
					radio: true,
					spatialMultiplex: spatialMultiplexsIndexs.SbS,
					onclick: function ( event ) {

						if ( stereoEffect.setSpatialMultiplex !== undefined )
							stereoEffect.setSpatialMultiplex( spatialMultiplexsIndexs.SbS );
						else stereoEffect.options.spatialMultiplex = spatialMultiplexsIndexs.SbS;
						//						setFullScreenButton( true );
						if ( options.fullScreen && options.fullScreen.onFullScreen )
							options.fullScreen.onFullScreen( true );

					}
				},
				{
					name: lang.topAndBottom,//'Top and bottom',
					radio: true,
					spatialMultiplex: spatialMultiplexsIndexs.TaB,
					onclick: function ( event ) {

						if ( stereoEffect.setSpatialMultiplex !== undefined )
							stereoEffect.setSpatialMultiplex( spatialMultiplexsIndexs.TaB );
						else stereoEffect.options.spatialMultiplex = spatialMultiplexsIndexs.TaB;
						//						setFullScreenButton( true );
						if ( options.onFullScreen )
							options.onFullScreen( true );

					}
				},

			],

		}
		menu.push( menuItemStereoEffect );

	}

	if ( options.player !== undefined ) {

		//Previous button
		menu.push( {

			name: lang.prevSymbol,
			title: lang.prevSymbolTitle,
			onclick: function ( event ) {

				options.player.prev();

			}

		} );

		//Play button
		menu.push( {

			name: lang.playSymbol,
			title: lang.playTitle,
			id: "menuButtonPlay",
			onclick: function ( event ) {

				options.player.play3DObject();
//				playController.play();

			}

		} );

		//Repeat button
		menu.push( {

			name: lang.repeat,
			title: options.player.getOptions().repeat ? lang.repeatOff : lang.repeatOn,
			id: "menuButtonRepeat",
			onclick: function ( event ) {

//				playController.repeat();
				options.player.repeat();

			}

		} );

		//Next button
		menu.push( {

			name: lang.nextSymbol,
			title: lang.nextSymbolTitle,
			onclick: function ( event ) {

				options.player.next();

			}

		} );

	}

	//Full Screen button
	var fullScreenSettings;
	if ( options.fullScreen !== undefined ) {

		if ( !options.fullScreen.renderer ) {

			console.error( 'CanvasMenu: options.fullScreen.renderer = ' + options.fullScreen.renderer );
			return;
			
		}
		if ( !options.fullScreen.camera ) {

			console.error( 'CanvasMenu: options.fullScreen.camera = ' + options.fullScreen.camera );
			return;
			
		}

		function createFullScreenSettings( canvasMenu ) {

			var fullScreen = false, style;
			this.isFullScreen = function () { return fullScreen; }
			this.setFullScreen = function ( fs ) {

				const size = new options.THREE.Vector2();
				options.fullScreen.renderer.getSize( size );
				fullScreen = fs;
				if ( fullScreen ) {

					if ( style !== undefined ) {

						//restore size of the canvas
						options.fullScreen.renderer.setSize( style.sizeOriginal.x, style.sizeOriginal.y );
						options.fullScreen.renderer.domElement.style.position = style.position;
						options.fullScreen.renderer.domElement.style.left = style.left;
						options.fullScreen.renderer.domElement.style.top = style.top;
						options.fullScreen.renderer.domElement.style.width = style.width;
						options.fullScreen.renderer.domElement.style.height = style.height;

					}

				} else {

					if ( style === undefined ) {

						style = {

							sizeOriginal: new options.THREE.Vector2(),
							position: options.fullScreen.renderer.domElement.style.position,
							left: options.fullScreen.renderer.domElement.style.left,
							top: options.fullScreen.renderer.domElement.style.top,
							width: options.fullScreen.renderer.domElement.style.width,
							height: options.fullScreen.renderer.domElement.style.height,

						}
						options.fullScreen.renderer.getSize( style.sizeOriginal );
					}

					//Full screen of the canvas
					options.fullScreen.renderer.setSize( window.innerWidth, window.innerHeight );
					options.fullScreen.renderer.domElement.style.position = 'fixed';
					options.fullScreen.renderer.domElement.style.left = 0;
					options.fullScreen.renderer.domElement.style.top = 0;
					options.fullScreen.renderer.domElement.style.width = '100%';
					options.fullScreen.renderer.domElement.style.height = '100%';

				}
				options.fullScreen.camera.aspect = size.x / size.y;
				options.fullScreen.camera.updateProjectionMatrix();
				fullScreen = !fullScreen;
				canvasMenu.setFullScreenButton( fullScreen );

			}
			this.onclick = function () {

				if (
					( options.stereoEffect !== undefined )
					&& ( parseInt( stereoEffect.options.spatialMultiplex ) !== spatialMultiplexsIndexs.Mono )
				) {

					alert( 'You can not change the fullscreen mode of the canvas if stereo effect mode is stereo.' );
					return false;//do not change the fullscreen mode of the canvas if stereo effect is stereo

				}
				if ( options.fullScreen.onFullScreenToggle !== undefined ) {

					options.fullScreen.onFullScreenToggle( fullScreen );
/*
					var res = options.onFullScreenToggle( fullScreen );
					if ( res === undefined ) {

						console.error( 'onFullScreenToggle: please return an object' );
						return false;

					}
					if ( res.renderer === undefined ) {

						console.error( 'onFullScreenToggle: please return an object.renderer' );
						return false;

					}
*/

				}

//				this.setFullScreen( res, fullScreen );
				this.setFullScreen( fullScreen );
				return fullScreen;

			}

		}
		fullScreenSettings = new createFullScreenSettings( this );
		this.isFullScreen = function () { return fullScreenSettings.isFullScreen(); }
		this.setFullScreen = function ( fullScreen ) { return fullScreenSettings.setFullScreen( fullScreen ); }
		menu.push( {

			style: 'float: right;',
			id: "menuButtonFullScreen",
			onclick: function ( event ) {

				fullScreenSettings.onclick();

			}

		} );

	}

	//Play slider
	if ( options.player !== undefined ) {

		menu.push( {

			name: '<input type="range" min="0" max="' + ( options.player.getSettings().marks - 1 ) + '" value="0" class="slider" id="sliderPosition">',
			style: 'float: right;',
//			title: sliderTitle + 0,

		} );

	}

	elMenu = DropdownMenu.create( menu, {

		elParent: typeof elContainer === "string" ? document.getElementById( elContainer) : elContainer,
		canvas: typeof elCanvas === "string" ? document.getElementById( elCanvas ) : elCanvas,
		decorations: 'Transparent',

	} );
	if ( options.onOver !== undefined ) {

		elMenu.addEventListener( 'mouseenter', function(event) { options.onOver( true ); });
		elMenu.addEventListener( 'mouseleave', function ( event ) { options.onOver( false ); } );
					
	}
	elSlider = elMenu.querySelector( '#sliderPosition' );
	if ( elSlider !== null ) {

		elSlider.onchange = function ( event ) {

			options.player.selectScene( parseInt( elSlider.value ) );

		};
		elSlider.oninput = function ( event ) {

			options.player.selectScene( parseInt( elSlider.value ) );

		};

	}

	this.setFullScreenButton = function( fullScreen ) {

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
//	this.setFullScreenButton = setFullScreenButton;
	this.setFullScreenButton();

	/**
	 * sets size of the slider element of the menu
	 * @param {Number} width width of the canvas
	 * @param {Number} height height of the canvas
	 */
	this.setSize = function ( width, height ) {
		if ( elMenu === undefined )
			return;
		var itemWidth = 0;
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

		if ( elSlider === null )
			return;//no controllerPlay
		var sliderWidth = width - itemWidth;
		if ( sliderWidth > 0 ) {

			elSlider.parentElement.style.width = sliderWidth + 'px';

		}

	}
	this.setIndex = function ( index, title ) {

		elSlider.value = index;
//		elSlider.title = sliderTitle + t;
		elSlider.title = title;

	}
	this.onRenamePlayButtons = function ( playing ) {

		var name, title;
		if ( playing ) {

			name = lang.pause;
			title = lang.pauseTitle;

		} else {

			name = lang.playSymbol;
			title = lang.playTitle;

		}
		const elMenuButtonPlay = elMenu.querySelector( '#menuButtonPlay' );
		elMenuButtonPlay.innerHTML = name;
		elMenuButtonPlay.title = title;
//		_renamePlayButtons( name, title, true );

	}
	this.onChangeRepeat = function () {

		const elMenuButtonRepeat = elMenu.querySelector( '#menuButtonRepeat' );
		elMenuButtonRepeat.title = options.player.getOptions().repeat ? lang.repeatOff : lang.repeatOn;

	}
	this.onChangeScale = function ( scale ) {

		if ( options.player === undefined )
			return;
/*			
		var optionsPlayer = options.player.getOptions();
		optionsPlayer.marks = scale.marks;
		optionsPlayer.min = scale.min;
		optionsPlayer.max = scale.max;
		elSlider.max = optionsPlayer.marks - 1;
*/		
		elSlider.max = scale.marks - 1;
		options.player.selectScene( 0 );
//		this.setIndex( 0, scale.name + ': ' + scale.min );

	}
	this.setSpatialMultiplexs = function ( mode, res ) {

		menuItemStereoEffect.items.forEach( function ( item ) {

			if ( item.spatialMultiplex === mode ) {

				if ( !item.checked ) {

					item.elName.onclick( { target: item.elName });

				}

			}

		} );
		if( fullScreenSettings && ( mode !== spatialMultiplexsIndexs.Mono ) )
			fullScreenSettings.setFullScreen( false );

	}
	this.setPlayer = function ( player ) {

		options.player = player;
		player.controllers.push( this );
		elSlider.value = 0;

	}
	if ( options.player !== undefined )
		options.player.pushController( this );
	var elMenu, elSlider;//, sliderTitle = lang.animateSceneId;//'Animate scene id ';

}
export default CanvasMenu;
