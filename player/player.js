/**
 * @module Player
 * @description 3D objects animation.
 * @author [Andrej Hristoliubov]{@link https://anhr.github.io/AboutMe/}
 * @copyright 2011 Data Arts Team, Google Creative Lab
 *
 * @license under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */

import cookie from '../cookieNodeJS/cookie.js';
//import cookie from 'https://raw.githack.com/anhr/commonNodeJS/master/cookieNodeJS/cookie.js';

import ScaleController from '../ScaleController.js';
import PositionController from '../PositionController.js';
import { dat } from '../dat/dat.module.js';

import { GuiSelectPoint, getObjectPosition } from '../guiSelectPoint/guiSelectPoint.js';
//import { GuiSelectPoint, getObjectPosition } from 'https://raw.githack.com/anhr/commonNodeJS/master/guiSelectPoint/guiSelectPoint.js';

import ColorPicker from '../colorpicker/colorpicker.js';
//import ColorPicker from 'https://raw.githack.com/anhr/commonNodeJS/master/colorpicker/colorpicker.js';
//ColorPicker.palette.setTHREE( THREE );

import { lang } from '../controllerPlay/index.js';

//import { SpriteText } from '../../../SpriteText/master/SpriteText.js';//https://github.com/anhr/SpriteText

import Cookie from '../cookieNodeJS/cookie.js';//https://github.com/anhr/commonNodeJS/tree/master/cookieNodeJS
//import Cookie from 'https://raw.githack.com/anhr/cookieNodeJS/master/cookie.js';
//import Cookie from 'https://raw.githack.com/anhr/commonNodeJS/master/cookieNodeJS/cookie.js';

var settings,

	//сделал общим для всех плееров потому что в getShaderMaterialPoints вызывается Player.selectMeshPlayScene
	//что бы установить начальные точки. Т.е. установить цвет и положение точек.
	//Начальные точки в getShaderMaterialPoints устанавливаются отдельно потому что в getShaderMaterialPoints точки создаются в отдельной нити
	//потому что сначала загружаются Shader файлы. Поэтому когда вызывается setTimeout( function () { onSelectScene(); }, 0 );
	//что бы цвет точек был верным еще до начала проигрывания, точки из getShaderMaterialPoints еще не добавлены в группу для проигрывания.
	//Кроме того цвет точек в getShaderMaterialPoints задается аттрибутом 'ca' а не 'color'.
	selectPlaySceneOptions;

/**
 * @callback onSelectScene
 * @description This function is called at each new step of the playing. See [Player]{@link https://raw.githack.com/anhr/commonNodeJS/master/player/jsdoc/module-Player.html#~Player} method.
 * @param {number} index current index of the scene of the animation
 * @param {number} t current time
 */

/**
 * @callback onChangeScaleT
 * @description User has updated the time settings. See [Player]{@link https://raw.githack.com/anhr/commonNodeJS/master/player/jsdoc/module-Player.html#~Player} method.
 * @param {object} scale the updated time settings
 */

/**
 * 3D objects animation.
 * @param {THREE} THREE {@link https://github.com/anhr/three.js|THREE}
 * @param {THREE.Group|THREE.Scene} group THREE group or scene of the meshes  for playing.
 * @param {object} [options] the following options are available
 * @param {object} [options.selectPlaySceneOptions] See [Player.selectPlayScene]{@link https://raw.githack.com/anhr/commonNodeJS/master/player/jsdoc/module-Player.html#~Player.selectPlayScene} options parameter.
 * @param {onSelectScene} [options.onSelectScene] This function is called at each new step of the playing. See [onSelectScene]{@link https://raw.githack.com/anhr/commonNodeJS/master/player/jsdoc/module-Player.html#~onSelectScene}.
 * @param {onChangeScaleT} [options.onChangeScaleT] event. User has updated the time settings. See [onChangeScaleT]{@link https://raw.githack.com/anhr/commonNodeJS/master/player/jsdoc/module-Player.html#~onChangeScaleT}.
 * @param {object} [options.cookie] Your custom cookie function for saving and loading of the Player settings. Default cookie is not saving settings.
 * @param {number} [options.settings] time settings.
 * @param {number} [options.settings.marks=10] Ticks count of the playing. Number of scenes of 3D objects animation.
 * @param {number} [options.settings.interval=1] Ticks per seconds.
 * @param {number} [options.settings.min=0] Animation start time.
 * @param {number} [options.settings.max=1] Animation end time. Set to null if you want to play to infinity.
 * @param {number} [options.settings.dt=0.1] Step of the animation. Have effect only if options.settings.max is null.
 * @param {boolean} [options.settings.repeat=false] true - Infinitely repeating 3D objects animation.
 * @param {number} [options.settings.zoomMultiplier=1.1] zoom multiplier of the time.
 * @param {number} [options.settings.offset=0.1] offset of the time.
 * @param {string} [options.settings.name=""] name of the time.
 */
function Player( THREE, group, options ) {

	options = options || {};

	selectPlaySceneOptions = options.selectPlaySceneOptions;
	selectPlaySceneOptions = selectPlaySceneOptions || {};
	selectPlaySceneOptions.boPlayer = selectPlaySceneOptions.boPlayer || false;

	selectPlaySceneOptions.a = options.a || 1;
	selectPlaySceneOptions.b = options.b || 0;
	/*
		palette = options.selectPlaySceneOptions.palette;
		options.palette = options.palette || palette || paletteDefault.get();//paletteDefault;
	*/
	selectPlaySceneOptions.scales = selectPlaySceneOptions.scales || {};

	//если тут создавать палитру то она не создастся если не создается плееер
	//palette = new palette();

	settings = options.settings || {};
	assignSettings();
/*
	function setDT() { settings.dt = ( settings.max - settings.min ) / ( settings.marks - 1 ); }
	function setMax() { settings.max = settings.min + settings.dt * ( settings.marks - 1 ); }
	settings.min = settings.min || 0;
	settings.max = settings.max || 1;
//	settings.dt = settings.dt || 0.1;
	settings.marks = settings.marks || 10;//2;
	setDT();
	settings.repeat = settings.repeat || false;
	settings.interval = settings.interval || 1;//25;
	settings.zoomMultiplier = settings.zoomMultiplier || 1.1;
	settings.offset = settings.offset || 0.1;
	settings.name = settings.name || '';
*/

	var boSelectFirstScene = true;
	/**
	 * @description This function is called at each new step of the playing.
	 * @param {number} [index=0] current index of the scene of the animation
	 */
	function onSelectScene( index ) {

		index = index || 0;
		const t = getTime();
/*сейчас это не нужно потому что я запускаю onSelectScene через setTimeout сразуже после создпния Player с selectSceneIndex = 0
		//Когда установлен "trace: true" в arrayFuncs во время старта проигрывания нужно один раз вызвать "onSelectScene" с "selectSceneIndex = 0"
		//Иначе линия трассировка будет начинаться со второй точки
		if ( boSelectFirstScene ) {

			boSelectFirstScene = false;
			const selectSceneIndexCur = selectSceneIndex;
			selectSceneIndex = 0;
			onSelectScene( selectSceneIndex );//, getTime() );
			selectSceneIndex = selectSceneIndexCur;

		}
*/
		Player.selectPlayScene( THREE, group, t, index, options.selectPlaySceneOptions );
		_this.setIndex( index, ( settings.name === '' ? '' : settings.name + ': ' ) + t );
		if ( options.onSelectScene ) options.onSelectScene( index, t );

	}

	//Теперь не нужно создавать color attribute на веб странице что бы цвет точек был верным еще до начала проигрывания
	//Кроме того трассировака начинается с нулевой точки
	setTimeout( function () { onSelectScene(); }, 0 );

	var selectSceneIndex = 0;
	const _this = this;

	function getTime() {

//		const res = ( ( settings.max - settings.min ) / ( settings.marks - 1 ) ) * selectSceneIndex + settings.min;
		const res = settings.min + selectSceneIndex * settings.dt;
		if ( isNaN( res ) ) console.error( 'Player.getTime(): res = ' + res );
		return res;

	}
	this.setTime = function( t ) {

//		this.selectScene( parseInt( ( t - settings.min ) * ( ( settings.marks - 1 ) / ( settings.max - settings.min ) ) ) );
		this.selectScene( parseInt( ( t - settings.min ) / settings.dt ) );

	}

	/**
	 * select scene for playing
	 * @function Player.
	 * selectScene
	 * @param {number} index Index of the scene. Range from 0 to settings.marks - 1
	 */
	this.selectScene = function( index ) {

		index = parseInt( index );
		if ( settings.max !== null ) {

			if ( index >= settings.marks )
				index = 0;
			else if ( index < 0 )
				index = settings.marks - 1;
			if( selectSceneIndex > settings.marks )
				selectSceneIndex = settings.marks;

		}
		while ( selectSceneIndex !== index ) {

			if ( selectSceneIndex < index )
				selectSceneIndex++;
			else selectSceneIndex--;
/*
			const t = getTime();
			onSelectScene( selectSceneIndex, t );
*/
			onSelectScene( selectSceneIndex );
			
		}

	}

	/**
	 * Go to next object 3D
	 * @function Player.
	 * next
	 */
	this.next = function() {

		_this.selectScene( selectSceneIndex + 1 );

	}

	/**
	 * Go to previous object 3D
	 * @function Player.
	 * prev
	 */
	this.prev = function () {

		_this.selectScene( selectSceneIndex - 1 );

	}
	/**
	 * Add controller into controllers array
	 * @function Player.
	 * pushController
	 * @param {controller} controller
	 */
	this.pushController = function ( controller ) {

		if ( ( controller.object !== undefined ) && ( controller.object.playRate !== undefined ) )
			controller.object.playRate = settings.min;
		controllers.push( controller );

	}

	//Play/Pause

	this.controllers = [];
	var playing = false, time, timeNext;
	const controllers = this.controllers,
		cookie = options.cookie || new Cookie.defaultCookie(), cookieName = 'Player' + ( options.cookieName || '' );

	function RenamePlayButtons() {

		controllers.forEach( function ( controller ) { if (controller.onRenamePlayButtons) controller.onRenamePlayButtons( playing ); } );

	}

	function play() {

		if ( ( selectSceneIndex === -1 ) || ( selectSceneIndex === settings.marks ) ) {

			selectSceneIndex = 0;

		}
		onSelectScene( selectSceneIndex );//, getTime() );

	}

	function pause() {

		playing = false;
		RenamePlayButtons();

		time = undefined;

	}
	function isRepeat() {

		return settings.repeat;

	}

	function playNext() {

		selectSceneIndex++;
		if ( ( settings.max !== null ) && selectSceneIndex >= settings.marks ) {

			if ( isRepeat() )
				selectSceneIndex = 0;
			else {

				pause();
				return;

			}

		}
		play();

	}

	/**
	 * User has clicked the Play ► / Pause ❚❚ button
	 * @function Player.
	 * play3DObject
	 */
	this.play3DObject = function() {

		if ( playing ) {

			pause();
			return;

		}

		playing = true;
		if ( ( settings.max !== null ) && ( selectSceneIndex >= settings.marks ) )
			selectSceneIndex = -1;
		playNext();
		RenamePlayButtons();
/*Не припомню зачем это
		controllers.forEach( function ( controller ) {

			if ( controller.controller !== undefined ) {

				settings.interval = controller.controller.getValue();
				return;

			}

		} );
*/

		function step( timestamp ) {

			if ( playing )
				window.requestAnimationFrame( step );
			else time = undefined;

			if ( time === undefined ) {

				time = timestamp;
				timeNext = time + 1000 / settings.interval;

			}
			if ( isNaN( timeNext ) || ( timeNext === Infinity ) ) {

				console.error( 'Player.animate: timeNext = ' + timeNext );
				playing = false;

			}

			if ( timestamp < timeNext )
				return;
			while ( timestamp > timeNext ) timeNext += 1000 / settings.interval;
			playNext();

		}
		window.requestAnimationFrame( step );

	}

	/**
	 * User has clicked the repeat ⥀ button
	 * @function Player.
	 * repeat
	 */
	this.repeat = function () {

		settings.repeat = !settings.repeat;
		this.onChangeRepeat( settings.repeat );

	}

	/**
	 * @function Player.
	 * getOptions
	 * @returns Player options.
	 */
	this.getOptions = function () { return options; }
	/**
	 * @function Player.
	 * getSettings
	 * @returns Player options.settings.
	 */
	//this.getSettings = function () { return settings; }
	/**
	 * @function Player.
	 * getSelectSceneIndex
	 * @returns selected scene index.
	 */
	this.getSelectSceneIndex = function () { return selectSceneIndex; }


	function setSettings() {

		setDT();
		cookie.setObject( cookieName, options.settings );
		if ( options.onChangeScaleT ) options.onChangeScaleT( options.settings );

	}

	/**
	 * User has changed the rate of changing of animation scenes per second.
	 * @function Player.
	 * onChangeTimerId
	 * @param {number} value new rate
	 */
	this.onChangeTimerId = function ( value ) {

		settings.interval = value;
		setSettings();

	}

	/**
	 * Event of the changing of the rate of changing of animation scenes per second.
	 * @function Player.
	 * onChangeRepeat
	 * @param {number} value new rate
	 */
	this.onChangeRepeat = function ( value ) {

		settings.repeat = value;
		this.controllers.forEach( function ( controller ) { if ( controller.onChangeRepeat ) controller.onChangeRepeat(); } );

	}

	//Localization
	function getLang( params ) {

		params = params || {};
		const lang = {

			player: 'Player',
			playerTitle: '3D objects animation.',

			min: 'Min',
			max: 'Max',
			dt: 'Step',

			marks: 'Frames',
			marksTitle: 'Player frames count',

			interval: 'Rate',
			intervalTitle: 'Rate of changing of animation scenes per second.',

			time: 'Time',

			defaultButton: 'Default',
			defaultTitle: 'Restore default player settings.',

		};

		const _languageCode = params.getLanguageCode === undefined ? 'en'//Default language is English
			: params.getLanguageCode();
		switch ( _languageCode ) {

			case 'ru'://Russian language

				lang.player = 'Проигрыватель';
				lang.playerTitle = 'Анимация 3D объектов.';

				lang.min = 'Минимум';
				lang.max = 'Максимум';
				lang.dt = 'Шаг';

				lang.marks = 'Кадры';
				lang.marksTitle = 'Количество кадров проигрывателя';

				lang.interval = 'Темп',
				lang.intervalTitle = 'Скорость смены кадров в секунду.';

				lang.time = 'Время';

				lang.defaultButton = 'Восстановить';
				lang.defaultTitle = 'Восстановить настройки проигрывателя по умолчанию.';

				break;
			default://Custom language
				if ( ( params.lang === undefined ) || ( params.lang._languageCode != _languageCode ) )
					break;

				Object.keys( params.lang ).forEach( function ( key ) {

					if ( _lang[key] === undefined )
						return;
					_lang[key] = params.lang[key];

				} );

		}
		return lang;

	}

	/**
	 * Adds a Player's controllers into [dat.gui]{@link https://github.com/anhr/dat.gui}.
	 * @function Player.
	 * gui
	 * @param {GUI} folder Player's folder
	 * @param {Function} [getLanguageCode="en"] Your custom getLanguageCode() function.
	 * <pre>
	 * returns the "primary language" subtag of the language version of the browser.
	 * Examples: "en" - English language, "ru" Russian.
	 * See the "Syntax" paragraph of RFC 4646 {@link https://tools.ietf.org/html/rfc4646#section-2.1|rfc4646 2.1 Syntax} for details.
	 * Default returns the 'en' is English language.
	 * You can import { getLanguageCode } from 'commonNodeJS/master/lang.js';
	 */
	this.gui = function ( folder, getLanguageCode ) {

		setMax();
		const axesDefault = JSON.parse( JSON.stringify( settings ) ),
			lang = getLang( {

			getLanguageCode: getLanguageCode,
			//lang: guiParams.lang

		} );
		Object.freeze( axesDefault );
		options.cookie.getObject( cookieName, settings, settings );

		const fPlayer = folder.addFolder( lang.player );
		dat.folderNameAndTitle( fPlayer, lang.player, lang.playerTitle );

		function scale() {

			const axes = settings,//options.settings,
				scaleControllers = {};
			function onclick( customController, action ) {

				var zoom = customController.controller.getValue();

				axes.min = action( axes.min, zoom );
				scaleControllers.min.setValue( axes.min );
/*
				axes.dt = action( axes.dt, zoom );
				scaleControllers.dt.setValue( axes.dt );
*/
				if ( axes.max ) {

					axes.max = action( axes.max, zoom );
					setDT();
					scaleControllers.max.setValue( axes.max );
					
				}
				
				setSettings();
				
			}

			scaleControllers.folder = fPlayer.addFolder( axes.name !== '' ? axes.name : lang.time );

			scaleControllers.scaleController = scaleControllers.folder.add( new ScaleController( onclick, 
				{ settings: options.settings, getLanguageCode: getLanguageCode, } ) ).onChange( function ( value ) {

				axes.zoomMultiplier = value;
				setSettings();

			} );

			const positionController = new PositionController( function ( shift ) {

				onclick( positionController, function ( value, zoom ) {

					value += shift;//zoom;
					return value;

				} );

			}, { settings: options.settings, getLanguageCode: getLanguageCode, } );
			scaleControllers.positionController = scaleControllers.folder.add( positionController ).onChange( function ( value ) {

				axes.offset = value;
				setSettings();

			} );

			//min
			scaleControllers.min = dat.controllerZeroStep( scaleControllers.folder, axes, 'min', function ( value ) { setSettings(); } );
			dat.controllerNameAndTitle( scaleControllers.min, lang.min );

/*
			//max
			scaleControllers.max = dat.controllerZeroStep( scaleControllers.folder, axes, 'max', function ( value ) { setSettings(); } );
			dat.controllerNameAndTitle( scaleControllers.max, lang.max );
*/
			//max
			//axes.max сейчас используется исключитьельно для удобства пользовательского интерфейса
			//Вместо axes.max используется axes.dt
			setMax();
			if ( axes.max !== null ) {

				scaleControllers.max = dat.controllerZeroStep( scaleControllers.folder, axes, 'max', function ( value ) { setSettings(); } );
				dat.controllerNameAndTitle( scaleControllers.max, lang.max );

			} else {

				//dt
				scaleControllers.dt = dat.controllerZeroStep( scaleControllers.folder, axes, 'dt', function ( value ) { setSettings(); } );
				dat.controllerNameAndTitle( scaleControllers.dt, lang.dt );

			}

			//marks
			if ( axes.marks ) {

//				scaleControllers.marks = dat.controllerZeroStep( scaleControllers.folder, axes, 'marks', function ( value ) { setSettings(); } );
				scaleControllers.marks = scaleControllers.folder.add( axes, 'marks' ).onChange( function ( value ) {

					axes.marks = parseInt( axes.marks );
					setSettings();
/*					
					if ( line ) {

						group.remove( line );
						line = undefined;
						
					}
*/					
					const elSlider = getSliderElement();
					if ( elSlider ) elSlider.max = settings.marks - 1;

				} );
				dat.controllerNameAndTitle( scaleControllers.marks, axes.marksName === undefined ? lang.marks : axes.marksName,
					axes.marksTitle === undefined ? lang.marksTitle : axes.marksTitle );

			}

			//Ticks per seconds.
			scaleControllers.interval = scaleControllers.folder.add( options.settings, 'interval', 1, 25, 1 ).onChange( function ( value ) {

				setSettings();

			} );
			dat.controllerNameAndTitle( scaleControllers.interval, lang.interval, lang.intervalTitle );

			//Default button
			dat.controllerNameAndTitle( scaleControllers.folder.add( {

				defaultF: function ( value ) {

//					if ( _this.PlayController ) _this.PlayController.setValue( axesDefault.interval );
					
					axes.zoomMultiplier = axesDefault.zoomMultiplier;
					scaleControllers.scaleController.setValue( axes.zoomMultiplier );

					axes.offset = axesDefault.offset;
					scaleControllers.positionController.setValue( axes.offset );

					axes.min = axesDefault.min;
					scaleControllers.min.setValue( axes.min );

					if ( scaleControllers.max ) {

						axes.max = axesDefault.max;
						setDT();
						scaleControllers.max.setValue( axes.max );

					}

					if ( scaleControllers.dt ) {

						axes.dt = axesDefault.dt;
						scaleControllers.dt.setValue( axes.dt );

					}

					if ( axesDefault.marks ) {

						axes.marks = axesDefault.marks;
						scaleControllers.marks.setValue( axes.marks );

					}

					axes.interval = axesDefault.interval;
					scaleControllers.interval.setValue( axes.interval );

					setSettings();

				},

			}, 'defaultF' ), lang.defaultButton, lang.defaultTitle );

		}
		scale();

	}

	var _canvasMenu;
	/**
	 * Adds a Player's menu item into [CanvasMenu]{@link https://github.com/anhr/commonNodeJS/tree/master/canvasMenu}.
	 * @function Player.
	 * createCanvasMenuItem
	 * @param {CanvasMenu} canvasMenu [CanvasMenu]{@link https://github.com/anhr/commonNodeJS/tree/master/canvasMenu}.
	 */
	this.createCanvasMenuItem = function ( canvasMenu ) {

		_canvasMenu = canvasMenu;
		const player = this, menu = canvasMenu.menu;

		//Previous button
		menu.push( {

			name: lang.prevSymbol,
			title: lang.prevSymbolTitle,
			onclick: function ( event ) { player.prev(); }

		} );

		//Play button
		menu.push( {

			name: lang.playSymbol,
			title: lang.playTitle,
			id: "menuButtonPlay",
			onclick: function ( event ) { player.play3DObject(); }

		} );

		if ( settings.max !== null ) {

			//Repeat button
			menu.push( {

				name: lang.repeat,
				title: this.getOptions().repeat ? lang.repeatOff : lang.repeatOn,
				id: "menuButtonRepeat",
				onclick: function ( event ) { player.repeat(); }

			} );

		}

		//Next button
		menu.push( {

			name: lang.nextSymbol,
			title: lang.nextSymbolTitle,
			onclick: function ( event ) { player.next(); }

		} );

		controllers.push( {

			/**
			 * Renames the "Play" button of the player's menu.
			 * @function Player.
			 * onRenamePlayButtons
			 * @param {boolean} playing <b>true</b> - pause.
			 * <p><b>false</b> - play</p>
			 */
			onRenamePlayButtons: function ( playing ) {

				var name, title;
				if ( playing ) {

					name = lang.pause;
					title = lang.pauseTitle;

				} else {

					name = lang.playSymbol;
					title = lang.playTitle;

				}
				const elMenuButtonPlay = canvasMenu.querySelector( '#menuButtonPlay' );
				elMenuButtonPlay.innerHTML = name;
				elMenuButtonPlay.title = title;

			},

			/**
			 * Changes "Repeat" button of the player's menu between <b>repeat Off</b> and <b>repeat On</b>.
			 * @function Player.
			 * onChangeRepeat
			 */
			onChangeRepeat: function () {

				canvasMenu.querySelector( '#menuButtonRepeat' ).title = settings.repeat ? lang.repeatOff : lang.repeatOn;

			}

		} );

	}

	/**
	 * Adds slider menu item into [CanvasMenu]{@link https://github.com/anhr/commonNodeJS/tree/master/canvasMenu}.
	 * @function Player.
	 * addSlider
	 */
	this.addSlider = function () {

		if ( settings.max === null )
			return;
			
		_canvasMenu.menu.push( {

//			name: '<input type="range" min="0" max="' + ( this.getSettings().marks - 1 ) + '" value="0" class="slider" id="sliderPosition">',
			name: '<input type="range" min="0" max="' + ( Player.getSettings().marks - 1 ) + '" value="0" class="slider" id="sliderPosition">',
			style: 'float: right;',

		} );

	}

	function getSliderElement() { if ( _canvasMenu ) return _canvasMenu.querySelector( '#sliderPosition' ); }

	/**
	 * Adds an events into slider menu item of the [CanvasMenu]{@link https://github.com/anhr/commonNodeJS/tree/master/canvasMenu}.
	 * @function Player.
	 * addSliderEvents
	 * @returns slider element
	 */
	this.addSliderEvents = function ( /*THREE*/ ) {

		const elSlider = getSliderElement(), player = this;
		if ( elSlider ) {

			elSlider.onchange = function ( event ) { player.selectScene( parseInt( elSlider.value ) ); };
			elSlider.oninput = function ( event ) { player.selectScene( parseInt( elSlider.value ) ); };

			var pointerdown;//, spriteText;
			const player = this;
			elSlider.addEventListener( 'pointerdown', e => { pointerdown = true; } );
			elSlider.addEventListener( 'pointerup', e => { pointerdown = false; } );
			elSlider.addEventListener( 'mousemove', e => {

				if ( !pointerdown )
					return;
				player.selectScene( ( settings.marks - 1 ) * e.offsetX / elSlider.clientWidth );

			} );

		}
		return elSlider;

	}

	/**
	 * Sets <b>index</b> and <b>title</b> of the slider element of the player's menu.
	 * @function Player.
	 * setIndex
	 * @param {string} index
	 * @param {string} title
	 */
	this.setIndex = function ( index, title ) {

		if ( this.PlayController ) this.PlayController.setValue( getTime() );
		const elSlider = getSliderElement();
		if ( elSlider ) {

			elSlider.value = index;
			elSlider.title = title;

		}

	}

	/**
	 * Changes the "max" value of the slider of the player's menu. Moves [Player]{@link https://raw.githack.com/anhr/commonNodeJS/master/player/jsdoc/module-Player.html} to the first scene.
	 * @function Player.
	 * onChangeScale
	 * @param {Object} scale See <b>options.settings</b> of the [Player]{@link https://raw.githack.com/anhr/commonNodeJS/master/player/jsdoc/module-Player.html}.
	 */
	this.onChangeScale = function ( scale ) {

		getSliderElement().max = scale.marks - 1;
		this.selectScene( 0 );

	}

}
/**
 * execute function
 * @function Player.
 * execFunc
 * @param {THREE.Vector4} funcs
 * @param {string} axisName axis name
 * @param {number} t time
 * @param {number} a multiplier. Second parameter of the arrayFuncs item function. Default is 1.
 * @param {number} b addendum. Third parameter of the arrayFuncs item function. Default is 0.
 */
Player.execFunc = function ( funcs, axisName, t, a, b ) {

	if ( a === undefined ) a = 1;
	if ( b === undefined ) b = 0;
	const func = funcs[axisName], typeofFuncs = typeof func;
	switch ( typeofFuncs ) {

		case "undefined":
			return undefined;
		case "function":
			return func( t, a, b );
		case "number":
			return func;
		case "object":
			if ( Array.isArray( func ) ) {

				if ( func.length === 0 ) {

					console.error( 'Player.execFunc: funcs["' + axisName + '"] array is empty' );
					return;

				}
				var a = func,
					l = func.length - 1,
					max = options.player.max,
					min = options.player.min,
					tStep = ( max - min ) / l,
					tStart = min, tStop = max,
					iStart = 0, iStop = l;
				for ( var i = 0; i < func.length; i++ ) {

					if ( tStep * i + min < t ) {

						iStart = i;
						iStop = i + 1;
						tStart = tStep * iStart + min;
						tStop = tStep * iStop + min;

					}

				}
				function execW( i ) {

					if ( typeof a[i] === "function" )
						return a[i]( t, a, b );
					if ( a[i] instanceof THREE.Color )
						return a[i];

				}
				if ( typeof a[iStart] !== "number" ) {

					if ( axisName === 'w' ) {

						return execW( iStart );

					}
					console.error( 'Player.execFunc: funcs["' + axisName + '"] array item ' + iStart + ' typeof = ' + ( typeof a[iStart] ) + ' is not number' );
					return;

				}
				if ( typeof a[iStop] !== "number" ) {

					if ( axisName === 'w' )
						return execW( iStop );
					console.error( 'Player.execFunc: funcs["' + axisName + '"] array item ' + iStop + ' typeof = ' + ( typeof a[iStop] ) + ' is not number' );
					return;

				}
				var x = ( a[iStop] - a[iStart] ) / ( tStop - tStart ),
					y = a[iStart] - x * tStart;
				return x * t + y;

			}
			if ( func.func )
				return func.func instanceof Function ? func.func( t, a, b ) : func.func;
			if ( axisName !== 'w' )
				console.error( 'Player.execFunc: funcs["' + axisName + '"] object is not array' );
			return;
		default:
			console.error( 'Player.execFunc: Invalud typeof funcs["' + axisName + '"]: ' + typeofFuncs );
	}
	return;

}

function palette() {

	var paletteDefault;
	this.get = function() {

		if ( selectPlaySceneOptions && selectPlaySceneOptions.palette )
			return selectPlaySceneOptions.palette;
			
		if ( !paletteDefault )
			paletteDefault = new ColorPicker.palette();
		return paletteDefault;

	}

}
palette = new palette();

/**
 * Select a scene for playing of the mesh
 * @function Player.
 * selectMeshPlayScene
 * @param {THREE} THREE {@link https://github.com/anhr/three.js|THREE}
 * @param {THREE.Mesh} mesh [mech]{@link https://threejs.org/docs/index.html#api/en/objects/Mesh} for playing.
 * @param {number} [t=0] time
 * @param {number} [index=0] index of the time.
 * @param {object} [options] the following options are available:
 * @param {boolean} [options.boPlayer] true - is not select play scene for mesh.userData.boFrustumPoints = true. Default is false.
 * @param {number} [options.a] multiplier. Second parameter of the arrayFuncs item function. Default is 1.
 * @param {number} [options.b] addendum. Third parameter of the arrayFuncs item function. Default is 0.
 * @param {object} [options.scales] axes scales. See {@link https://raw.githack.com/anhr/AxesHelper/master/jsdoc/module-AxesHelper.html|AxesHelper}. Default is {}
 * @param {object} [options.palette=new ColorPicker.palette();//palette: ColorPicker.paletteIndexes.BGRW] See [ColorPicker.palette]{@link https://raw.githack.com/anhr/colorPicker/master/jsdoc/module-ColorPicker.html#~Palette}.
 * @param {object} [options.point={}] point settings. Applies to points with ShaderMaterial.
 * <pre>
 * See [ShaderMaterial]{@link https://threejs.org/docs/index.html#api/en/materials/ShaderMaterial} for details.
 * The size of the point seems constant and does not depend on the distance to the camera.
 * </pre>
 * @param {number} [options.point.size=0.02] The apparent angular size of a point in radians.
*/
Player.selectMeshPlayScene = function ( THREE, mesh, t, index, options ) {

	if ( t === undefined ) t = Player.getSettings().min;
	index = index || 0;
	options = options || selectPlaySceneOptions;
	if (

		!mesh.userData.player ||
		( options && options.boPlayer && mesh.userData.boFrustumPoints )

	)
		return;

	//Эти строки нужны что бы появлялся текст возле точки, если на нее наведена мышка
	//при условии, что до этого точка была передвинута с помошью проигрывателя.
	delete mesh.geometry.boundingSphere;
	mesh.geometry.boundingSphere = null;

	if ( mesh.userData.player.selectPlayScene )
		mesh.userData.player.selectPlayScene( t );

	function setAttributes( a, b ) {

		const attributes = mesh.geometry.attributes,
			arrayFuncs = mesh.userData.player.arrayFuncs;
		if ( arrayFuncs === undefined )
			return;
		if ( t === undefined )
			console.error( 'setPosition: t = ' + t );

		var min, max;
		if ( options && ( options.scales.w !== undefined ) ) {

			min = options.scales.w.min; max = options.scales.w.max;

		} else {

			max = value;
			min = max - 1;

		}

		for ( var i = 0; i < arrayFuncs.length; i++ ) {

			var funcs = arrayFuncs[i], needsUpdate = false;
			function setPosition( axisName, fnName ) {

				var value = Player.execFunc( funcs, axisName, t, a, b );
				if ( value !== undefined ) {

					attributes.position[fnName]( i, value );
					needsUpdate = true;

				}

			}
			setPosition( 'x', 'setX' );
			setPosition( 'y', 'setY' );
			setPosition( 'z', 'setZ' );

			//если тут поставить var то цвет точки, которая определена как THREE.Vector3 будет равет цвету предыдущей точки
			//потому что перемнные типа var видны снаружи блока {}
			let color;

			if ( typeof funcs.w === "function" ) {

				var value = funcs.w( t, a, b );
				attributes.position.setW( i, value );
				needsUpdate = true;

				if ( mesh.userData.player.palette )
					color = mesh.userData.player.palette.toColor( value, min, max );
				else if ( options.palette )
					color = options.palette.toColor( value, min, max );

			} else if ( typeof funcs.w === "object" ) {

				if ( funcs.w instanceof THREE.Color )
					color = funcs.w;
				else if ( options.palette ) {

					if ( typeof funcs.w === 'object' ) {

						if ( funcs.w.min ) min = funcs.w.min;
						if ( funcs.w.max ) max = funcs.w.max;

					}
					color = options.palette.toColor( Player.execFunc( funcs, 'w', t, a, b ), min, max );

				}

			} else if ( ( typeof funcs.w === "number" ) && options.palette )
				color = options.palette.toColor( funcs.w, min, max );
			if ( color ) {

				if ( !mesh.material instanceof THREE.ShaderMaterial && mesh.material.vertexColors !== THREE.VertexColors )
					console.error( 'Player.selectPlayScene: Please set the vertexColors parameter of the THREE.PointsMaterial of your points to THREE.VertexColors. Example: vertexColors: THREE.VertexColors' );
				if ( !Player.setColorAttribute( attributes, i, color ) && funcs instanceof THREE.Vector4 ) {

					mesh.geometry.setAttribute( 'color',
						new THREE.Float32BufferAttribute( Player.getColors( THREE, arrayFuncs,
							{
								positions: mesh.geometry.attributes.position,
								scale: { min: min, max: max },
								palette: options.palette,

							} ), 3 ) );
					if ( !Player.setColorAttribute( attributes, i, color ) )
						console.error( 'Player.selectPlayScene: the color attribute is not exists. Please use THREE.Vector3 instead THREE.Vector4 in the arrayFuncs or add "color" attribute' );

				}

			}
			if ( needsUpdate )
				attributes.position.needsUpdate = true;

			if ( funcs.line !== undefined )
				funcs.line.addPoint( getObjectPosition( mesh, i ), index, color );

		};

	}
	setAttributes( options ? options.a : 1, options ? options.b : 0 );
	const message = 'Player.selectPlayScene: invalid mesh.scale.';
	if ( mesh.scale.x <= 0 ) console.error( message + 'x = ' + mesh.scale.x );
	if ( mesh.scale.y <= 0 ) console.error( message + 'y = ' + mesh.scale.y );
	if ( mesh.scale.z <= 0 ) console.error( message + 'z = ' + mesh.scale.z );

	if ( !options.guiSelectPoint )
		return;

	options.guiSelectPoint.setMesh();

	var selectedPointIndex = options.guiSelectPoint.getSelectedPointIndex();
	if ( ( selectedPointIndex !== -1 ) && options.guiSelectPoint.isSelectedMesh( mesh ) ) {

		options.guiSelectPoint.setPosition( getObjectPosition( mesh, selectedPointIndex ), {

			object: mesh,
			index: selectedPointIndex,

		} );

	}

}
/**
 * Select a scene for playing
 * @function Player.
 * selectPlayScene
 * @param {THREE} THREE {@link https://github.com/anhr/three.js|THREE}
 * @param {THREE.Group} group [THREE.Group]{@link https://threejs.org/docs/index.html#api/en/objects/Group}
 * @param {number} t time
 * @param {number} index index of the time.
 * @param {object} [options] the following options are available
 * @param {boolean} [options.boPlayer] true - is not select play scene for mesh.userData.boFrustumPoints = true. Default is false.
 * @param {number} [options.a] multiplier. Second parameter of the arrayFuncs item function. Default is 1.
 * @param {number} [options.b] addendum. Third parameter of the arrayFuncs item function. Default is 0.
 * @param {object} [options.scales] axes scales. See {@link https://raw.githack.com/anhr/AxesHelper/master/jsdoc/module-AxesHelper.html|AxesHelper}. Default is {}
 * @param {object} [options.palette=new ColorPicker.palette();//palette: ColorPicker.paletteIndexes.BGRW] See [ColorPicker.palette]{@link https://raw.githack.com/anhr/colorPicker/master/jsdoc/module-ColorPicker.html#~Palette}.
 * <pre>
 * Example:
 * new ColorPicker.palette( { palette: ColorPicker.paletteIndexes.bidirectional } );
 * </pre>
 * @param {object} [options.guiSelectPoint] See [GuiSelectPoint]{@link https://raw.githack.com/anhr/commonNodeJS/master/guiSelectPoint/jsdoc/module-GuiSelectPoint.html#~GuiSelectPoint}.
 * <pre>
 * Example:
 * new GuiSelectPoint();
 * </pre>
 */
Player.selectPlayScene = function ( THREE, group, t, index, options ) {

	//Эта строка нужна в случае если в 3D объекте не утанвавливатся аттрибут color.
	//Другими словами если не вызывается Player.getColors
	ColorPicker.palette.setTHREE( THREE );
	
	options = options || {};
/*
	options.boPlayer = options.boPlayer || false;

	options.a = options.a || 1;
	options.b = options.b || 0;

	options.palette = options.palette || palette || palette.get();//paletteDefault;

	options.scales = options.scales || {};
*/
	
	group.userData.t = t;
	group.children.forEach( function ( mesh ) {

		Player.selectMeshPlayScene( THREE, mesh, t, index );//, options );
/*
		if (

			!mesh.userData.player ||
			( options.boPlayer && mesh.userData.boFrustumPoints )

		)
			return;

		//Эти строки нужны что бы появлялся текст возле точки, если на нее наведена мышка
		//при условии, что до этого точка была передвинута с помошью проигрывателя.
		delete mesh.geometry.boundingSphere;
		mesh.geometry.boundingSphere = null;

		if ( mesh.userData.player.selectPlayScene )
			mesh.userData.player.selectPlayScene( t );

		function setAttributes( a, b ) {

			const attributes = mesh.geometry.attributes,
				arrayFuncs = mesh.userData.player.arrayFuncs;
			if ( arrayFuncs === undefined )
				return;
			if ( t === undefined )
				console.error( 'setPosition: t = ' + t );

			var min, max;
			if ( options.scales.w !== undefined ) {

				min = options.scales.w.min; max = options.scales.w.max;

			} else {

				max = value;
				min = max - 1;

			}

			for ( var i = 0; i < arrayFuncs.length; i++ ) {

				var funcs = arrayFuncs[i], needsUpdate = false;
				function setPosition( axisName, fnName ) {

					var value = Player.execFunc( funcs, axisName, t, a, b );
					if ( value !== undefined ) {

						attributes.position[fnName]( i, value );
						needsUpdate = true;

					}

				}
				setPosition( 'x', 'setX' );
				setPosition( 'y', 'setY' );
				setPosition( 'z', 'setZ' );

				//если тут поставить var то цвет точки, которая определена как THREE.Vector3 будет равет цвету предыдущей точки
				//потому что перемнные типа var видны снаружи блока {}
				let color;

				if ( typeof funcs.w === "function" ) {

					var value = funcs.w( t, a, b );
					attributes.position.setW( i, value );
					needsUpdate = true;

					if ( mesh.userData.player.palette )
						color = mesh.userData.player.palette.toColor( value, min, max );
					else if ( options.palette )
						color = options.palette.toColor( value, min, max );

				} else if ( typeof funcs.w === "object" ) {

					if ( funcs.w instanceof THREE.Color )
						color = funcs.w;
					else if ( options.palette ) {

						if ( typeof funcs.w === 'object' ) {

							if ( funcs.w.min ) min = funcs.w.min;
							if ( funcs.w.max ) max = funcs.w.max;
							
						}
						color = options.palette.toColor( Player.execFunc( funcs, 'w', t, a, b ), min, max );

					}

				} else if ( ( typeof funcs.w === "number" ) && options.palette )
					color = options.palette.toColor( funcs.w, min, max );
				if ( color ) {

					if ( ! mesh.material instanceof THREE.ShaderMaterial && mesh.material.vertexColors !== THREE.VertexColors )
						console.error( 'Player.selectPlayScene: Please set the vertexColors parameter of the THREE.PointsMaterial of your points to THREE.VertexColors. Example: vertexColors: THREE.VertexColors' );
					if ( ! Player.setColorAttribute( attributes, i, color ) && funcs instanceof THREE.Vector4 ) {

						mesh.geometry.setAttribute( 'color',
							new THREE.Float32BufferAttribute( Player.getColors( THREE, arrayFuncs,
								{
									positions: mesh.geometry.attributes.position,
									scale: { min: min, max: max },
									palette: options.palette,

								} ), 3 ) );
						if ( ! Player.setColorAttribute( attributes, i, color ) )
							console.error( 'Player.selectPlayScene: the color attribute is not exists. Please use THREE.Vector3 instead THREE.Vector4 in the arrayFuncs or add "color" attribute' );

					}

				}
				if ( needsUpdate )
					attributes.position.needsUpdate = true;

				if ( funcs.line !== undefined )
					funcs.line.addPoint( getObjectPosition( mesh, i ), index, color );

			};

		}
		setAttributes( options.a, options.b );
		const message = 'Player.selectPlayScene: invalid mesh.scale.';
		if ( mesh.scale.x <= 0 ) console.error( message + 'x = ' + mesh.scale.x );
		if ( mesh.scale.y <= 0 ) console.error( message + 'y = ' + mesh.scale.y );
		if ( mesh.scale.z <= 0 ) console.error( message + 'z = ' + mesh.scale.z );

		if ( !options.guiSelectPoint )
			return;

		options.guiSelectPoint.setMesh();

		var selectedPointIndex = options.guiSelectPoint.getSelectedPointIndex();
		if ( ( selectedPointIndex !== -1 ) && options.guiSelectPoint.isSelectedMesh( mesh ) ) {

			options.guiSelectPoint.setPosition( getObjectPosition( mesh, selectedPointIndex ), {

				object: mesh,
				index: selectedPointIndex,

			} );

		}
*/
	} );

}

/**
 * set color attribute 
 * @function Player.
 * setColorAttribute
 * @param {Object} attributes geometry.attributes of the mesh
 * @param {number} i index of the arrayFuncs.
 * @param {THREE.Color} color color.
 * @returns true - success
 * <p>false - colorAttribute was not detected.</p>
 */
Player.setColorAttribute = function ( attributes, i, color ) {

	if ( typeof color === "string" )
		color = new THREE.Color( color );
	const colorAttribute = attributes.color || attributes.ca;
	if ( colorAttribute === undefined )
		return false;
	colorAttribute.setX( i, color.r );
	colorAttribute.setY( i, color.g );
	colorAttribute.setZ( i, color.b );
	colorAttribute.needsUpdate = true;
	return true;

}

/**
 * Get array of THREE.Vector4 points.
 * @function Player.
 * getPoints
 * @param {THREE} THREE {@link https://github.com/anhr/three.js|THREE}
 * @param {THREE.Vector4|THREE.Vector3|THREE.Vector2|object|array} arrayFuncs points.geometry.attributes.position array
 * <pre>
 * THREE.Vector4: 4D point.
 * THREE.Vector3: 3D point. w = 1. Default is white color
 * THREE.Vector2: 2D point. w = 1, z = 0. Default is white color
 * Vector's x, y, z, w is position of the point.
 * Can be as:
 * float - position of the point.
 * [float] - array of positions of the point.
 * [Function]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function} - position of the point is function of the t.
 * Example: new Function( 't', 'a', 'b', 'return Math.sin(t*a*2*Math.PI)*0.5+b' )
 * 
 * Vector.w is index of the [palette]{@link https://github.com/anhr/commonNodeJS/tree/master/colorpicker}.
 * Default range of the Vector.w is from 0 to 100. You can change range by use an object:
 * {
 *   func: Vector.w
 *   max: new max value of tne Vector.w
 *   min: new min value of tne Vector.w
 * }
 * Example:
 * {
 *
 *   func: new Function( 't', 'return 1-2*t' ),
 *   min: -1,
 *   max: 1,
 *
 * }
 * Vector.w can be as THREE.Color. Example: new THREE.Color( "rgb(255, 127, 0)" )
 *
 * object: {
 *   vector: THREE.Vector4|THREE.Vector3|THREE.Vector2 - point position
 *   [name]: point name. Default is undefined.
 *   [trace]: true - displays the trace of the point movement. Default is undefined.
 * }
 * or
 * object: {
 *   x: x axis. Defauilt is 0.
 *   y: y axis. Defauilt is 0.
 *   z: z axis. Defauilt is 0.
 *   w: w axis. Defauilt is 0.
 * }
 *
 * array: [
 *   0: x axis. Defauilt is 0.
 *   1: y axis. Defauilt is 0.
 *   2: z axis. Defauilt is 0.
 *   3: w axis. Defauilt is 0.
 * ]
 * </pre>
 * @param {object} [optionsPoints] followed optionsPoints is available
 * @param {THREE.Group} [optionsPoints.group] {@link https://threejs.org/docs/index.html#api/en/objects/Group|Group}
 * or {@link https://threejs.org/docs/index.html#api/en/scenes/Scene|Scene}.
 * Use only if you want trace lines during playing. See trace of the arrayFuncs param above.
 * Default is undefined.
 * @param {number} [optionsPoints.t] first parameter of the arrayFuncs item function. Start time of animation. Default is 0.
 * @param {object} [optionsPoints.options] the following options are available
 * @param {number} [optionsPoints.options.a] multiplier. Second parameter of the arrayFuncs item function. Default is 1.
 * @param {number} [optionsPoints.options.b] addendum. Third parameter of the arrayFuncs item function. Default is 0.
 * @param {object} [optionsPoints.options.player] See Player method above.
 * @returns array of THREE.Vector4 points.
 */
Player.getPoints = function ( THREE, arrayFuncs, optionsPoints ) {

	GuiSelectPoint.setTHREE( THREE );
	
	optionsPoints = optionsPoints || {};
	if ( optionsPoints.t === undefined ) optionsPoints.t = 0;
	const options = optionsPoints.options || {},
		a = options.a || 1,
		b = options.b || 0;
	for ( var i = 0; i < arrayFuncs.length; i++ ) {

		var item = arrayFuncs[i];
		if ( Array.isArray( item ) )
			arrayFuncs[i] = new THREE.Vector4(

				item[0] === undefined ? 0 : item[0],
				item[1] === undefined ? 0 : item[1],
				item[2] === undefined ? 0 : item[2],
				item[3] === undefined ? 0 : item[3]

			);
		else if (

			( typeof item === "object" )
			&& ( item instanceof THREE.Vector2 === false )
			&& ( item instanceof THREE.Vector3 === false )
			&& ( item instanceof THREE.Vector4 === false )

		) {

			if ( ( item.vector === undefined ) )
				arrayFuncs[i] = new THREE.Vector4(

					item.x === undefined ? 0 : item.x,
					item.y === undefined ? 0 : item.y,
					item.z === undefined ? 0 : item.z,
					item.w === undefined ? 0 : item.w

				);
			else if (

				( item.vector instanceof THREE.Vector2 === true )
				|| ( item.vector instanceof THREE.Vector3 === true )
				|| ( item.vector instanceof THREE.Vector4 === true )

			) {

				if ( item.vector instanceof THREE.Vector2 === true )
					arrayFuncs[i].vector = new THREE.Vector3(

						item.vector.x === undefined ? 0 : item.vector.x,
						item.vector.y === undefined ? 0 : item.vector.y,
						item.vector.z === undefined ? 0 : item.vector.z,

					);

			} else {

				if ( item.vector.length === 4 )
					arrayFuncs[i].vector = new THREE.Vector4(

						item.vector[0] === undefined ? 0 : item.vector[0],
						item.vector[1] === undefined ? 0 : item.vector[1],
						item.vector[2] === undefined ? 0 : item.vector[2],
						item.vector[3] === undefined ? 0 : item.vector[3]

					);
				else if ( item.vector.length === 3 )

					arrayFuncs[i].vector = new THREE.Vector3(

						item.vector[0] === undefined ? 0 : item.vector[0],
						item.vector[1] === undefined ? 0 : item.vector[1],
						item.vector[2] === undefined ? 0 : item.vector[2],

					);
				else console.error( 'options.getPoints(...) falied! item.vector.length = ' + item.vector.length );

			}

		}

	};
	const points = [];
	for ( var i = 0; i < arrayFuncs.length; i++ ) {

		var funcs = arrayFuncs[i];
		function getAxis( axisName ) {

			if ( typeof funcs === "number" )
				funcs = new THREE.Vector4( funcs, 0, 0, 0 );
			if ( ( funcs instanceof THREE.Vector2 ) || ( funcs instanceof THREE.Vector3 ) || ( funcs instanceof THREE.Vector4 ) ) {

				return Player.execFunc( funcs, axisName, optionsPoints.t, a, b );

			}
			if ( funcs.vector === undefined ) {

				console.error( 'options.getPoints: funcs.vector = ' + funcs.vector );
				return;

			}
			if ( funcs.name !== undefined )
				funcs.vector.name = funcs.name;
			if ( funcs.trace ) {

				funcs.vector.line = new Player.traceLine( THREE, optionsPoints.group, options );

			}
			arrayFuncs[i] = funcs.vector;
			funcs = funcs.vector;
			return Player.execFunc( funcs, axisName, optionsPoints.t, a, b );


		}
		const point = funcs.vector instanceof THREE.Vector3 === true ?
			new THREE.Vector3( getAxis( 'x' ), getAxis( 'y' ), getAxis( 'z' ) ) :
			new THREE.Vector4( getAxis( 'x' ), getAxis( 'y' ), getAxis( 'z' ), getAxis( 'w' ) );

		if ( funcs.w === undefined )
			point.w = {};//Если тут поставить NaN то в points.geometry.attributes.position.array он преобразуется в 0.
		//Тогда в gui появится ненужный орган управления controllerW
		//от балды поставил пустой объект что бы при создании points.geometry.attributes.position.array
		//это зачение преобразвалось в NaN.

		points.push( point );

	}
	return points;

}

/**
 * Get array of mesh colors.
 * @function Player.
 * getColors
 * @param {THREE} THREE {@link https://github.com/anhr/three.js|THREE}
 * @param {THREE.Vector4|THREE.Vector3|THREE.Vector2|object|array} arrayFuncs points.geometry.attributes.position array
 * <pre>
 * THREE.Vector4: 4D point.
 * THREE.Vector3: 3D point. w = 1. Default is white color
 * THREE.Vector2: 2D point. w = 1, z = 0. Default is white color
 * Vector's x, y, z, w is position of the point.
 * Can be as:
 * float - position of the point.
 * [float] - array of positions of the point.
 * [Function]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function} - position of the point is function of the t.
 * Example: new Function( 't', 'a', 'b', 'return Math.sin(t*a*2*Math.PI)*0.5+b' )
 *
 * Vector.w is index of the [palette]{@link https://github.com/anhr/commonNodeJS/tree/master/colorpicker}.
 * Default range of the Vector.w is from 0 to 100. You can change range by use an object:
 * {
 *   func: Vector.w
 *   max: new max value of tne Vector.w
 *   min: new min value of tne Vector.w
 * }
 * Example:
 * {
 *
 *   func: new Function( 't', 'return 1-2*t' ),
 *   min: -1,
 *   max: 1,
 *
 * }
 * Vector.w can be as THREE.Color. Example: new THREE.Color( "rgb(255, 127, 0)" )
 *
 * object: {
 *   vector: THREE.Vector4|THREE.Vector3|THREE.Vector2 - point position
 *   [name]: point name. Default is undefined.
 *   [trace]: true - displays the trace of the point movement. Default is undefined.
 * }
 * or
 * object: {
 *   x: x axis. Defauilt is 0.
 *   y: y axis. Defauilt is 0.
 *   z: z axis. Defauilt is 0.
 *   w: w axis. Defauilt is 0.
 * }
 *
 * array: [
 *   0: x axis. Defauilt is 0.
 *   1: y axis. Defauilt is 0.
 *   2: z axis. Defauilt is 0.
 *   3: w axis. Defauilt is 0.
 * ]
 * </pre>
 * @param {object} [optionsColor] the following options are available:
 * @param {object} [optionsColor.palette] [color palette]{@link https://github.com/anhr/commonNodeJS/tree/master/colorpicker}.
 * @param {object} [optionsColor.scale]
 * @param {object} [optionsColor.scale.min] Minimal range of the [color palette]{@link https://github.com/anhr/commonNodeJS/tree/master/colorpicker}.
 * <p>Default is undefined. Minimal palette range is 0.</p>
 * @param {object} [optionsColor.scale.max] Maximal range of the [color palette]{@link https://github.com/anhr/commonNodeJS/tree/master/colorpicker}.
 * <p>Default is undefined. Maximal palette range is 100</p>
 * @param {THREE.BufferAttribute} [optionsColor.positions] geometry.attributes.position of the new mesh. Default is undefined.
 * @param {array} [optionsColor.colors] array for mesh colors. Default is undefined.
 * @param {boolean} [optionsColor.opacity] if true then opacity of the point is depend from distance to all  meshes points from the group with defined mesh.userData.cloud. Default is undefined.
 * @returns array of mesh colors.
 */
Player.getColors = function ( THREE, arrayFuncs, optionsColor ) {

	ColorPicker.palette.setTHREE(THREE);
	optionsColor = optionsColor || {};
//	optionsColor.palette = optionsColor.palette || palette || paletteDefault.get();
	optionsColor.palette = optionsColor.palette || palette.get();
	
	if (
		( optionsColor.positions !== undefined ) &&
		Array.isArray( arrayFuncs ) &&
		( arrayFuncs.length !== optionsColor.positions.count )
	) {

		console.error( 'getColors failed! arrayFuncs.length: ' + arrayFuncs.length + ' != positions.count: ' + optionsColor.positions.count );
		return optionsColor.colors;

	}
	optionsColor.colors = optionsColor.colors || [];

	//не надо убирать const length. Иначе переполнится память
	const length = Array.isArray( arrayFuncs ) ? arrayFuncs.length : optionsColor.positions.count;
	for ( var i = 0; i < length; i++ ) {

		const funcs = Array.isArray( arrayFuncs ) ? arrayFuncs[i] : undefined;
		var vector;
		if (
			( funcs instanceof THREE.Vector4 ) ||//w of the funcs is color of the point
			( optionsColor.positions && ( optionsColor.positions.itemSize === 4 ) )//w position of the positions is color of the point
			) {

			let min, max;
			var w = funcs.w;
			if ( funcs.w instanceof Object && funcs.w.func ) {

				if ( funcs.w.max ) max = funcs.w.max;
				if ( funcs.w.min ) min = funcs.w.min;
				w = funcs.w.func;

			} else if ( optionsColor.scale !== undefined ) {

				min = optionsColor.scale.min; max = optionsColor.scale.max;

			} else {

				if ( funcs instanceof THREE.Vector4 ) {

					if ( typeof funcs.w === 'function' ) {

						max = 100;
						min = 0;

					} else {

console.warn( 'Кажется тут ошибка. Диапазон по умолчанию должен быть от 0 до 100' )
						max = funcs.w;
						min = max - 1;
						
					}

				} else {

					//color is not defined. Set color to white
/*					
console.warn( 'Кажется тут ошибка. Диапазон по умолчанию должен быть от 0 до 100' )
					max = 1;
					min = max - 1;
*/					

				}
/*
				max = funcs instanceof THREE.Vector4 ? funcs.w : 1;
				min = max - 1;
*/				

			}
			if ( w instanceof Function && ! settings ) {

				console.error( 'Player.getColors: remove all functions from all THREE.Vector4.w items of the arrayFuncs.' );
				console.error( ' 	Or create Player.' );
				console.error( '	If you use MyPoints for create of the points, please add Player: Player into settings parameter of the MyPoints function after creating of the Player.' );
				return;
				
			}
			var color = optionsColor.palette.toColor(
				funcs === undefined ?
					new THREE.Vector4().fromBufferAttribute( optionsColor.positions, i ).w :
					w instanceof Function ?
						w( settings.min ) :
						w,
				min, max );
			optionsColor.colors.push( color.r, color.g, color.b );

		} else if ( optionsColor.colors instanceof THREE.Float32BufferAttribute )
			vector = new THREE.Vector3( 1, 1, 1 );
		else optionsColor.colors.push( 1, 1, 1 );//white

		//opacity
		if ( optionsColor.opacity !== undefined ) {

			var opacity = 0,
				standardNormalDistributionZero = getStandardNormalDistribution( 0 );
			group.children.forEach( function ( mesh ) {

				if ( !mesh.userData.cloud )
					return;
				for ( var iMesh = 0; iMesh < mesh.geometry.attributes.position.count; iMesh++ ) {

					var position = getObjectPosition( mesh, iMesh );
					opacity += getStandardNormalDistribution(
						getWorldPosition(//myThreejs.getWorldPosition(
							camera, new THREE.Vector3().fromBufferAttribute( optionsColor.positions, i )
						).distanceTo( position ) * 5
					) / standardNormalDistributionZero;

				}

			} );

			if ( debug.opacity !== undefined )
				opacity = debug.opacity;

			if ( optionsColor.colors instanceof THREE.Float32BufferAttribute ) {

				optionsColor.colors.setXYZW( i, vector.x, vector.y, vector.z, opacity );

			}
			else optionsColor.colors.push( opacity );

		} else optionsColor.colors.push( 1 );

	}
	return optionsColor.colors;

}

/**
 * trace line of moving of the point during playing
 * @function Player.
 * traceLine
 * @param {THREE} THREE {@link https://github.com/anhr/three.js|THREE}
 * @param {THREE.Group} group {@link https://threejs.org/docs/index.html#api/en/objects/Group|Group} or {@link https://threejs.org/docs/index.html#api/en/scenes/Scene|Scene}.
 * @param {object} options the following options are available
 * @param {object} options.player See Player function above.
 */
Player.traceLine = function ( THREE, group, options ) {

	if ( !group ) {

		console.error( 'Player.traceLine: Define optionsPoints.group of the Player.getPoints first.' );
		return;
		
	}
	if ( !settings ) {

		console.error( 'Player.traceLine: Remove all trace: true from arrayFunc parameter of the MyPoints or getShaderMaterialPoints method.' );
		console.error( '	Or call Player(...).' );
		console.error( '	If you use getShaderMaterialPoints or MyPoints for create of the points, please add Player: Player into settings parameter of the getShaderMaterialPoints or MyPoints method after creating of the Player.' );
		return;
		
	}
	var line;
	const arrayLines = [];
	this.addPoint = function ( point, index, color ) {

		if ( settings.max === null ) {

			index = Math.abs( index );
			if ( index < ( arrayLines.length - 1 ) ){

				while ( index < ( arrayLines.length - 1 ) ) {

					group.remove( arrayLines[arrayLines.length - 1] );
					arrayLines.pop();

				}
				return;

			}
			// geometry
			const geometry = new THREE.BufferGeometry(), MAX_POINTS = 2;

			// attributes
			const positions = new Float32Array( MAX_POINTS * 3 ); // 3 coordinates per point
			geometry.setAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
			const colors = new Float32Array( MAX_POINTS * 3 ); // 3 coordinates per point
			geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );

			const line = new THREE.Line( geometry, new THREE.LineBasicMaterial( { vertexColors: THREE.VertexColors } ) );
			group.add( line );

			//point position
			point = new THREE.Vector3().copy( point );
			const itemSize = line.geometry.attributes.position.itemSize;
			point.toArray( line.geometry.attributes.position.array, 1 * itemSize );
			const point0 = arrayLines.length === 0 ? point :
				new THREE.Vector3().fromArray(arrayLines[arrayLines.length-1].geometry.attributes.position.array, 1 * itemSize);
			point0.toArray( line.geometry.attributes.position.array, 0 * itemSize );
			line.geometry.attributes.position.needsUpdate = true;

			//point color
			if ( color === undefined )
				color = new THREE.Color( 1, 1, 1 );//White
			Player.setColorAttribute( line.geometry.attributes, 0, arrayLines.length === 0 ? color :
				 new THREE.Color().fromArray(arrayLines[arrayLines.length-1].geometry.attributes.color.array, 1 * itemSize));
			Player.setColorAttribute( line.geometry.attributes, 1, color );

			arrayLines.push( line );

			return;

		}
/*
		if ( line && ( settings.max === null ) ) {

			group.remove( line );
			line = undefined;
			
		}
*/
		if ( line === undefined ) {

			// geometry
			const geometry = new THREE.BufferGeometry();

			//Thanks to https://stackoverflow.com/questions/31399856/drawing-a-line-with-three-js-dynamically/31411794#31411794
			var MAX_POINTS;
			if ( settings.max !== null ) {

				if ( settings && settings.marks )
					MAX_POINTS = settings.marks;
				else if ( options.player && options.player.marks )
					MAX_POINTS = options.player.marks;
				else {

					console.error( 'Player.traceLine: MAX_POINTS = ' + MAX_POINTS + '. Create Player first or remove all trace = true from all items of the arrayFuncs' );
					return;

				}

			} else MAX_POINTS = index + 1;

			// attributes
			const positions = new Float32Array( MAX_POINTS * 3 ); // 3 coordinates per point
			geometry.setAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
			const colors = new Float32Array( MAX_POINTS * 3 ); // 3 coordinates per point
			geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );

			// draw range
			geometry.setDrawRange( index, index );

			line = new THREE.Line( geometry, new THREE.LineBasicMaterial( { vertexColors: THREE.VertexColors } ) );
			line.visible = true;
			group.add( line );

		}

		//point position
		point = new THREE.Vector3().copy( point );
		point.toArray( line.geometry.attributes.position.array, index * line.geometry.attributes.position.itemSize );
		line.geometry.attributes.position.needsUpdate = true;

		//point color
		if ( color === undefined )
			color = new THREE.Color( 1, 1, 1 );//White
		Player.setColorAttribute( line.geometry.attributes, index, color );

		//set draw range
		var start = line.geometry.drawRange.start, count = index + 1 - start;
		if ( start > index ) {

			var stop = start + line.geometry.drawRange.count;
			start = index;
			count = stop - start;

		}
		line.geometry.setDrawRange( start, count );

	}
	/**
	 * Show or hide trace line.
	 * @function Player.traceLine.
	 * visible
	 * @param {boolean} visible true - show trace line.
	 * <p>false - hide trace line.</p>
	 */
	this.visible = function ( visible ) { line.visible = visible; }
	/**
	 * Is trace line visible?
	 * @function Player.traceLine.
	 * isVisible
	 * @returns true - trace line is visible.
	 * <p>false - trace line is not visible.</p>
	 */
	this.isVisible = function () { return line.visible; }
	/**
	 * Remove trace line.
	 * @function Player.traceLine.
	 * remove
	 */
	this.remove = function () {

		if ( line === undefined )
			return;
		line.geometry.dispose();
		line.material.dispose();
		group.remove( line );

	}

}
function setDT() {

	if ( settings.max === null ) settings.dt = settings.dt || 0.1;
	else settings.dt = ( settings.max - settings.min ) / ( settings.marks - 1 );

}
function setMax() { if ( settings.max !== null ) settings.max = settings.min + settings.dt * ( settings.marks - 1 ); }
function assignSettings() {

	settings = settings || {};
	settings.min = settings.min || 0;
	if ( settings.max !== null ) {

		if ( settings.max === undefined ) settings.max =  1;
		settings.marks = settings.marks || 10;//2;

	} else settings.marks = null;
	//	settings.dt = settings.dt || 0.1;
	setDT();
	settings.repeat = settings.repeat || false;
	settings.interval = settings.interval || 1;//25;
	settings.zoomMultiplier = settings.zoomMultiplier || 1.1;
	settings.offset = settings.offset || 0.1;
	settings.name = settings.name || '';

}

/**
 * @function Player.
 * getSettings
 * @returns Player ettings.
 */
Player.getSettings = function () {

	if ( !settings ) {

		assignSettings();

	}
	return settings;

}

export default Player;
