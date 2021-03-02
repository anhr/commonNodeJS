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

import { getWorldPosition } from '../guiSelectPoint/guiSelectPoint.js';

//import CameraGui from '../CameraGui.js';
//import CameraGui from 'http://localhost/anhr/commonNodeJS/master/CameraGui.js';

var settings,

	//сделал общим для всех плееров потому что в getShaderMaterialPoints вызывается Player.selectMeshPlayScene
	//что бы установить начальные точки. Т.е. установить цвет и положение точек.
	//Начальные точки в getShaderMaterialPoints устанавливаются отдельно потому что в getShaderMaterialPoints точки создаются в отдельной нити
	//потому что сначала загружаются Shader файлы. Поэтому когда вызывается setTimeout( function () { onSelectScene(); }, 0 );
	//что бы цвет точек был верным еще до начала проигрывания, точки из getShaderMaterialPoints еще не добавлены в группу для проигрывания.
	//Кроме того цвет точек в getShaderMaterialPoints задается аттрибутом 'ca' а не 'color'.
	selectPlaySceneOptions,
	THREE,
	boPlayer = false;//true - player is created
//	selectSceneIndex = 0;//for guiSelectPoint

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
 * @param {THREE.Group|THREE.Scene} group THREE group or scene of the meshes  for playing.
 * @param {object} [options] the following options are available
 * @param {object} [options.selectPlaySceneOptions] See [Player.selectPlayScene]{@link https://raw.githack.com/anhr/commonNodeJS/master/player/jsdoc/module-Player.html#~Player.selectPlayScene} options parameter.
 * @param {onSelectScene} [options.onSelectScene] This function is called at each new step of the playing. See [onSelectScene]{@link https://raw.githack.com/anhr/commonNodeJS/master/player/jsdoc/module-Player.html#~onSelectScene}.
 * @param {onChangeScaleT} [options.onChangeScaleT] event. User has updated the time settings. See [onChangeScaleT]{@link https://raw.githack.com/anhr/commonNodeJS/master/player/jsdoc/module-Player.html#~onChangeScaleT}.
 * @param {object} [options.settings] time settings.
 * @param {number} [options.settings.interval=1] Ticks per seconds.
 * @param {number} [options.settings.min=0] Animation start time.
 * @param {number} [options.settings.max=1] Animation end time. Set to Infinity if you want to play to infinity.
 * @param {number} [options.settings.dt=0.1] Step of the animation. Have effect only if <b>max</b> is infinity.
 * @param {number} [options.settings.marks=10] Ticks count of the playing. Number of scenes of 3D objects animation.
 * Have effect for <b>max</b> is not Infinity.
 * @param {boolean} [options.settings.repeat=false] true - Infinitely repeating 3D objects animation.
 * @param {number} [options.settings.zoomMultiplier=1.1] zoom multiplier of the time.
 * @param {number} [options.settings.offset=0.1] offset of the time.
 * @param {string} [options.settings.name=""] name of the time.
 * @param {THREE.PerspectiveCamera} options.cameraTarget.camera [PerspectiveCamera]{@link https://threejs.org/docs/index.html#api/en/cameras/PerspectiveCamera}.
 */
function Player( group, options ) {

	if ( typeof THREE === 'undefined' ) {

		console.error( 'Call Player.setTHREE(THREE) first.' );
		return;

	}
	ColorPicker.palette.setTHREE( THREE );

	if ( Player.isCreated() ) {

		console.error( 'Player: duplicate player.' );
		return;

	}

	Player.player = this;

	options = options || {};

	selectPlaySceneOptions = options.selectPlaySceneOptions;
	selectPlaySceneOptions = selectPlaySceneOptions || {};
	selectPlaySceneOptions.boPlayer = selectPlaySceneOptions.boPlayer || false;

	selectPlaySceneOptions.a = options.a || 1;
	selectPlaySceneOptions.b = options.b || 0;
//	selectPlaySceneOptions.scales = selectPlaySceneOptions.scales || {};не помню зачем эта строка

	//если тут создавать палитру то она не создастся если не создается плееер
	//palette = new palette();

	settings = options.settings || {};
	assignSettings();

	options.cameraTarget = options.cameraTarget || {};

	/**
	 * Select a scene for playing
	 * @function Player.
	 * selectPlayScene
	 * @param {THREE.Group} group [THREE.Group]{@link https://threejs.org/docs/index.html#api/en/objects/Group}
	 * @param {number} t time
	 * @param {number} index index of the time.
	 * @param {object} [selectPlaySceneOptions] the following options are available
	 * @param {boolean} [selectPlaySceneOptions.boPlayer] true - is not select play scene for mesh.userData.boFrustumPoints = true. Default is false.
	 * @param {number} [selectPlaySceneOptions.a] multiplier. Second parameter of the arrayFuncs item function. Default is 1.
	 * @param {number} [selectPlaySceneOptions.b] addendum. Third parameter of the arrayFuncs item function. Default is 0.
	 * @param {object} [selectPlaySceneOptions.scales] axes scales. See {@link https://raw.githack.com/anhr/AxesHelper/master/jsdoc/module-AxesHelper.html|AxesHelper}. Default is {}
	 * @param {object} [selectPlaySceneOptions.palette=new ColorPicker.palette();//palette: ColorPicker.paletteIndexes.BGRW] See [ColorPicker.palette]{@link https://raw.githack.com/anhr/colorPicker/master/jsdoc/module-ColorPicker.html#~Palette}.
	 * <pre>
	 * Example:
	 * new ColorPicker.palette( { palette: ColorPicker.paletteIndexes.bidirectional } );
	 * </pre>
	 * @param {object} [selectPlaySceneOptions.guiSelectPoint] See [GuiSelectPoint]{@link https://raw.githack.com/anhr/commonNodeJS/master/guiSelectPoint/jsdoc/module-GuiSelectPoint.html#~GuiSelectPoint}.
	 * <pre>
	 * Example:
	 * new GuiSelectPoint();
	 * </pre>
	 */
	function selectPlayScene( group, t, index, selectPlaySceneOptions ) {

		//Эта строка нужна в случае если в 3D объекте не утанвавливатся аттрибут color.
		//Другими словами если не вызывается Player.getColors
		ColorPicker.palette.setTHREE( THREE );

		selectPlaySceneOptions = selectPlaySceneOptions || {};

		group.userData.t = t;
		Player.selectMeshPlayScene( /*THREE, */group, t, index );//, options );
		group.children.forEach( function ( mesh ) {

			Player.selectMeshPlayScene( /*THREE, */mesh, t, index );//, options );

		} );
/*		
//		if ( options.cameraTarget )
//		if ( Player.cameraTarget2 )
		if ( Player.cameraTargetPoint ){

//			Player.setCameraTarget();
			Player.cameraTarget.setCameraTarget();
//			Player.setPlayerCameraTarget();
//			Player.cameraTarget2.setCameraPosition();
			Player.cameraTarget.get().setCameraPosition();

		}
*/		
		Player.cameraTarget.setCameraTarget();

		const cameraTarget = Player.cameraTarget.get();
		if ( cameraTarget && cameraTarget.setCameraPosition ) cameraTarget.setCameraPosition();

		if ( Player.cameraGui ) Player.cameraGui.update();

	}

	//var boSelectFirstScene = true;
	/**
	 * @description This function is called at each new step of the playing.
	 * @param {number} [index=0] current index of the scene of the animation
	 */
	function onSelectScene( index ) {

		index = index || 0;
		const t = _this.getTime();
		selectPlayScene( group, t, index, options.selectPlaySceneOptions );
		_this.setIndex( index, ( settings.name === '' ? '' : settings.name + ': ' ) + t );
		if ( options.onSelectScene ) options.onSelectScene( index, t );

	}

	//Теперь не нужно создавать color attribute на веб странице что бы цвет точек был верным еще до начала проигрывания
	//Кроме того трассировака начинается с нулевой точки
	setTimeout( function () { onSelectScene(); }, 0 );

	var selectSceneIndex = 0;
	const _this = this;

	/**
	 * get time
	 * @function player.
	 * getTime
	 */
	this.getTime = function() {

		const t = settings.min + selectSceneIndex * settings.dt;
		if ( isNaN( t ) ) console.error( 'Player.getTime(): t = ' + t );
		if ( ( settings.max !== null ) && ( t > settings.max ) )
			console.error( 'Player.getTime(): t = ' + t + ' settings.max = ' + settings.max );
		if ( ( t < settings.min ) && ( settings.max !== null ) )
			console.error( 'Player.getTime(): t = ' + t + ' settings.min = ' + settings.min );
		return t;

	}

	/**
	 * set time
	 * @function player.
	 * setTime
	 * @param {number} t time
	 */
	this.setTime = function( t ) {

		this.selectScene( parseInt( ( t - settings.min ) / settings.dt ) );

	}

	/**
	 * select scene for playing
	 * @function player.
	 * selectScene
	 * @param {number} index Index of the scene. Range from 0 to settings.marks - 1
	 */
	this.selectScene = function( index ) {

		if ( index === undefined ) {

			onSelectScene( selectSceneIndex );
			return;

		}
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
	const controllers = this.controllers;

	function RenamePlayButtons() {

		controllers.forEach( function ( controller ) { if (controller.onRenamePlayButtons) controller.onRenamePlayButtons( playing ); } );

	}

	function play() {

		if ( ( selectSceneIndex === -1 ) || ( ( selectSceneIndex === settings.marks ) && ( settings.max !== null ) ) ) {

			selectSceneIndex = 0;

		}
		onSelectScene( selectSceneIndex );

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

				//Для вычисления текущего времени в случае:
				//1. Запустить плеер и дождаться когда проигрывание остановится после достижения максимального времени
				//2. В guiSelectPoint выбрать точку, цвет которой зависит от времени
				//Тогда если убрать эту строку, то selectSceneIndex и время окажется за диапазоном допустимых значений
				//и цвет точки окажется неверным
				selectSceneIndex = settings.marks - 1;

				pause();
				return;

			}

		}
		play();

	}

	/**
	 * User has clicked the Play ► / Pause ❚❚ button
	 * @function player.
	 * play3DObject
	 */
	this.play3DObject = function() {

		if ( playing ) {

			pause();
			return;

		}

		playing = true;
		if ( ( settings.max !== null ) && ( selectSceneIndex >= ( settings.marks - 1 ) ) )
			selectSceneIndex = 0;//-1;
		playNext();
		RenamePlayButtons();

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
	 * @function player.
	 * repeat
	 */
	this.repeat = function () {

		settings.repeat = !settings.repeat;
		this.onChangeRepeat( settings.repeat );

	}

	/**
	 * @function player.
	 * getOptions
	 * @returns Player options.
	 */
	this.getOptions = function () { return options; }
	/**
	 * @function player.
	 * getSelectSceneIndex
	 * @returns selected scene index.
	 */
	this.getSelectSceneIndex = function () { return selectSceneIndex; }

	/**
	 * Event of the changing of the rate of changing of animation scenes per second.
	 * @function player.
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
			dtTitle: 'Time between frames',

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
				lang.dtTitle = 'Веремя между кадрами';

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
	 * @param {object} [guiParams={}] Followed parameters is allowed. Default is no parameters
	 * @param {Function} [guiParams.getLanguageCode="en"] Your custom getLanguageCode() function.
	 * <pre>
	 * returns the "primary language" subtag of the language version of the browser.
	 * Examples: "en" - English language, "ru" Russian.
	 * See the {@link https://tools.ietf.org/html/rfc4646#section-2.1|rfc4646 2.1 Syntax} for details.
	 * Default returns the 'en' is English language.
	 * You can import { getLanguageCode } from '../../commonNodeJS/master/lang.js';
	 * </pre>
	 * @param {object} [guiParams.lang] Object with localized language values
	 * <pre>
	 * Example Using of guiParams.lang:
	 * guiParams = {
	 *
	 * 	getLanguageCode: function() { return 'az'; },
	 * 	lang: { textHeight: 'mətn boyu', languageCode: 'az' },
	 *
	 * }
	 * </pre>
	 * @param {Cookie} [guiParams.cookie=new Cookie.defaultCookie()] Your custom cookie function for saving and loading of the SpriteText settings. Default cookie is not saving settings.
	 * @param {string} [guiParams.cookieName=""] Name of the cookie is "Player" + guiParams.cookieName.
	 */
	this.gui = function ( folder, guiParams = {} ) {

		guiParams.getLanguageCode = guiParams.getLanguageCode || function(){ return "en"; };
		guiParams.cookie = guiParams.cookie || new Cookie.defaultCookie();
		guiParams.cookieName = guiParams.cookieName || '';
		
		const cookie = guiParams.cookie, cookieName = 'Player' + guiParams.cookieName;
		function setSettings() {

			setDT();
			cookie.setObject( cookieName, settings );
			if ( options.onChangeScaleT ) options.onChangeScaleT( settings );

		}
		setMax();
		const axesDefault = JSON.parse( JSON.stringify( settings ) ),
			lang = getLang( {

			getLanguageCode: guiParams.getLanguageCode,
			//lang: guiParams.lang

		} );
		Object.freeze( axesDefault );
		const max = settings.max, marks = settings.marks;
		cookie.getObject( cookieName, settings, settings );
		if ( ( max === null ) || ( max === Infinity ) ||
			( settings.max === null )//раньше на веб странице плеер был настроен на бесконечное проигрыванияе а сейчас проигрывание ограничено по времени
		) {

			settings.max = max;
			settings.marks = marks;

		}

		const fPlayer = folder.addFolder( lang.player );
		dat.folderNameAndTitle( fPlayer, lang.player, lang.playerTitle );

		function scale() {

			const axes = settings,//options.settings,
				scaleControllers = {};
			function onclick( customController, action ) {

				var zoom = customController.controller.getValue();

				axes.min = action( axes.min, zoom );
				scaleControllers.min.setValue( axes.min );
				if ( axes.max ) {

					axes.max = action( axes.max, zoom );
					setDT();
					scaleControllers.max.setValue( axes.max );
					
				}
				
				setSettings();
				
			}

			scaleControllers.folder = fPlayer.addFolder( axes.name !== '' ? axes.name : lang.time );

			scaleControllers.scaleController = scaleControllers.folder.add( new ScaleController( onclick, 
				{ settings: options.settings, getLanguageCode: guiParams.getLanguageCode, } ) ).onChange( function ( value ) {

				axes.zoomMultiplier = value;
				setSettings();

			} );

			const positionController = new PositionController( function ( shift ) {

				onclick( positionController, function ( value, zoom ) {

					value += shift;//zoom;
					return value;

				} );

			}, { settings: options.settings, getLanguageCode: guiParams.getLanguageCode, } );
			scaleControllers.positionController = scaleControllers.folder.add( positionController ).onChange( function ( value ) {

				axes.offset = value;
				setSettings();

			} );

			//min
			scaleControllers.min = dat.controllerZeroStep( scaleControllers.folder, axes, 'min', function ( value ) { setSettings(); } );
			dat.controllerNameAndTitle( scaleControllers.min, lang.min );

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
				dat.controllerNameAndTitle( scaleControllers.dt, lang.dt, lang.dtTitle );

			}

			//marks
			if ( axes.marks ) {

				scaleControllers.marks = scaleControllers.folder.add( axes, 'marks' ).onChange( function ( value ) {

					axes.marks = parseInt( axes.marks );
					setSettings();
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

						//scaleControllers.marks is undefined если программист сначала установил max: Infinity,
						//соханил Player in cookie, например изменил marks
						//удалил max: Infinity,
						//Нажал кнопку Default для проигрывателя
						if ( scaleControllers.marks )
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
			onclick: function ( event ) {

//				if ( selectSceneIndex >= ( settings.marks - 1 ) ) selectSceneIndex =  0;
				player.play3DObject();

			}

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
	this.addSliderEvents = function () {

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

		if ( this.PlayController ) this.PlayController.setValue( this.getTime() );
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

	boPlayer = true;

}
/**
 * Is player created?
 * @function Player.
 * isCreated
 */
Player.isCreated = function () { return boPlayer; }

function playerCameraTarget() {

	const cameraTargetDefault = { boLook: false, },//По умолчанию не слежу за точкой
		_cameraTarget = {

			boLook: cameraTargetDefault.boLook,
//			setCameraPosition: function(){},если это оставить то не будет обновляться setCameraPosition, когда выбрана точка, на которую смотрит камера

		};
//	cameraTargetDefault.boLook = false;
	cameraTargetDefault.rotation = {};
	_cameraTarget.rotation = {};
	var boTarget = false,//true - target point was detected. For displaying of the console warning if duplicate target point was detected
		boPlayer = false;//true - была попытка получить camera из Player.player. Добавил что бы не выполнялась лишняя работа

	//Если определен ( boCameraTargetLook !== undefined ) , то явно было задано следить или не следить за точкой.
	//Тогда если есть точка, за которой надо следить ( cameraTarget.bodefault === false )
	//и явно не было задано следить или не следить заточкой  ( boCameraTargetLook === undefined ),
	//то надо следить за точкой ( cameraTargetDefault.boLook = true )
	var boCameraTargetLook;
	
	/**
	 * get camera target
	 * @function Player.cameraTarget.
	 * get
	 */
	this.get = function () {

		if ( !_cameraTarget.camera && !boPlayer && Player.player ) {

			cameraTargetDefault.camera = Player.player.getOptions().cameraTarget.camera;
			if ( cameraTargetDefault.camera ) setCameraTarget();
			boPlayer = true;

		}
		if ( _cameraTarget.camera )
			return _cameraTarget;

	}

	/**
	 * Create default camera target
	 * @function Player.cameraTarget.
	 * init
	 * @param {object} cameraTarget the following cameraTarget are available:
	 * @param {THREE.PerspectiveCamera} [cameraTarget.camera] [PerspectiveCamera]{@link https://threejs.org/docs/index.html#api/en/cameras/PerspectiveCamera}
	 * @param {boolean} [cameraTarget.boLook] true - camera look at the target.
	 * @param {THREE.Vector3} [cameraTarget.distanceToCamera] Distance from target point to camera.
	   * You can set the distance to the camera depending on the time.
	 * <pre>
	 *	Example 1: new THREE.Vector3( 0, 0, new Function( 't', 'return 2+t' ) )
	 *	Example 2: new THREE.Vector3( 0, 0,
	 *		[ { t: 0, v: 5 }, { t: 1, v: 2 }, { t: 10, v: 2 }, { t: 11, v: 5 } ] )
	 *	Default is camera.position.
	 * </pre>
	 * @param {object} [cameraTarget.rotation] rotation camera around point specified by an axis and an angle. Default is undefined - no rotation
	 * @param {number|function|array} [cameraTarget.rotation.angle=0] Angle of rotation in radians.
	 * <pre>
	 *   number. Example: Math.PI / 2 rotate to 90 degrees.
	 *   function. Example: new Function( 't', 'return 5*t' ).
	 *   array.
	 *     Example 1: [0, Math.PI]
	 *       0 is angle for t = min is start time of the playing.
	 *       Math.PI is rotate to 180 degrees
	 *         for t = max is time of the stopping of the playing.
	 *       If max time is infinity, then angle is for t = min.
	 *     Example 2: [{ t: 0, v: 0 }, { t: 1, v: Math.PI / 2 }
	 *       t is time,
	 *       v is angle for current t.
	 * </pre>
	 * @param {THREE.Vector3} [cameraTarget.rotation.axis] Axis of rotattion.
	 * <pre>
	 *   Example: new THREE.Vector3( 1, 0, 0 ) - rotate around x axis.
	 *   Default is rotate around y axis
	 * </pre>
	 */
	this.init = function ( cameraTarget ) {

		//cameraTargetDefault.boLook = false по умолчанию камера не смотритт на выбранную точку если:
		// 1 ни разу не вызывается init. Тоесть нет настроек cameraTargetDefault и нет ни однойточки, на которую смотрит камера
		// 2 cameraTarget.bodefault !== false и cameraTarget.boLook = false - программист явно запретил смотреть на точку

		//Если есть хоть одна точка, на которую должна смотреть камера cameraTarget.bodefault === false,
		//то для этой точки не устанавливаем playerCameraTarget.cameraTargetDefault
		//Другими словами если есть точка, на которую должна смотреть камера,
		//то камера будет на нее смотреть если нет запрета смотеть на точку - playerCameraTarget.cameraTargetDefault = false
		if ( cameraTarget.bodefault !== false ) {

			if ( boTarget )
				return;//Не надо устанавливать cameraTargetDefault после того,
					//как были устанвлены настройки cameraTargetDefault из точек
					//Иначе натройки точки не будут приоритетными

			if ( cameraTarget.boLook !== undefined ) {

				cameraTargetDefault.boLook = cameraTarget.boLook;
				boCameraTargetLook = cameraTarget.boLook;

			}

		} else if ( cameraTarget.boLook === true ){

			//Есть точка, за которой надо следить

			if ( boTarget ) console.warn( 'playerCameraTarget().init(...): duplicate target point' );
			boTarget = true;
			
			if ( boCameraTargetLook === undefined )
				cameraTargetDefault.boLook = true;//запрета на слежение камерой за точкой не было и есть точка, за которой надо следить

		} else return;
		cameraTargetDefault.camera = cameraTargetDefault.camera || cameraTarget.camera;
		if ( !cameraTargetDefault.camera ) {

			console.error( 'playerCameraTarget().init(...): cameraTargetDefault.camera = ' + cameraTargetDefault.camera );
			return;

		}
		cameraTargetDefault.distanceToCamera = cameraTargetDefault.distanceToCamera || cameraTarget.distanceToCamera;
		cameraTarget.rotation = cameraTarget.rotation || {};
		cameraTargetDefault.rotation.angle = cameraTargetDefault.rotation.angle || cameraTarget.rotation.angle;
		cameraTargetDefault.rotation.axis = cameraTargetDefault.rotation.axis || cameraTarget.rotation.axis;
		setCameraTarget( cameraTarget );

	}
	function setCameraTarget( cameraTarget ) {

		if ( !cameraTarget )
			cameraTarget = cameraTargetDefault;//У выбранной для слежения точки нет cameraTarget
		if ( cameraTarget.boLook !== undefined )
			_cameraTarget.boLook = cameraTarget.boLook;
		else _cameraTarget.boLook = cameraTargetDefault.boLook;

		_cameraTarget.camera = cameraTarget.camera || cameraTargetDefault.camera;

//Если в программе не определены функции distanceToCamera (тоесть cameraTarget.distanceToCamera === undefined и cameraTargetDefault.distanceToCamera === undefined),
//то при проигрывании каждый раз distanceToCamera будет равна camera.position
//		_cameraTarget.distanceToCamera = cameraTarget.distanceToCamera || cameraTargetDefault.distanceToCamera || new THREE.Vector3().copy( cameraTargetDefault.camera.position );

		//Если в программе не определены функции distanceToCamera (тоесть cameraTarget.distanceToCamera === undefined и cameraTargetDefault.distanceToCamera === undefined),
		//То сначала _cameraTarget.distanceToCamera будет равна camera.position, а потом при проигрывании не будет меняться
		_cameraTarget.distanceToCamera =
			cameraTarget.distanceToCamera ||
			cameraTargetDefault.distanceToCamera ||
			_cameraTarget.distanceToCamera ||
			new THREE.Vector3().copy( cameraTargetDefault.camera.position );

		if ( !cameraTarget.rotation ) cameraTarget.rotation = {};
		_cameraTarget.rotation.angle = cameraTarget.rotation.angle || cameraTargetDefault.rotation.angle || 0;
		_cameraTarget.rotation.axis = cameraTarget.rotation.axis || cameraTargetDefault.rotation.axis || new THREE.Vector3( 0, 1, 0 );//Rotate around y axis

	}

	/**
	 * Set a target point, what camera is look at.
	 * @function Player.cameraTarget.
	 * setTarget
	 * @param {THREE.Mesh} mesh [mech]{@link https://threejs.org/docs/index.html#api/en/objects/Mesh} with selected point as target for camera.
	*/
	this.setTarget = function ( mesh ) {

		if ( !mesh.geometry )
			return;

		if ( typeof THREE === 'undefined' ) {

			console.error( 'Call Player.setTHREE(THREE) first.' );
			return;

		}
		const arrayFuncs = mesh.userData.player.arrayFuncs;
		if ( arrayFuncs === undefined )
			return;
		for ( var i = 0; i < arrayFuncs.length; i++ ) {

			var funcs = arrayFuncs[i];
			Player.cameraTarget.changeTarget( mesh, i );

		}

	}
	/**
	 * Change target.
	 * @function Player.cameraTarget.
	 * changeTarget
	 * @param {THREE.Mesh} mesh [mech]{@link https://threejs.org/docs/index.html#api/en/objects/Mesh} with selected point as target for camera.
	 * @param {number} i index of the point.
	 */
	this.changeTarget = function ( mesh, i ) {

		if ( typeof THREE === 'undefined' ) {

			console.error( 'Call Player.setTHREE(THREE) first.' );
			return;

		}
		const cameraTarget = Player.cameraTarget.get();
//			camera = cameraTarget.camera;

		//Update cameraTarget
		const func = mesh.userData.player.arrayFuncs[i];
		if ( !func.cameraTarget )
			func.cameraTarget = { boLook: false };
		setCameraTarget( func.cameraTarget );

		if ( cameraTarget && cameraTarget.boLook ) {

			const target = getWorldPosition( mesh, new THREE.Vector3().fromArray( mesh.geometry.attributes.position.array, i * mesh.geometry.attributes.position.itemSize ) );
			cameraTarget.target = target;

		} else delete cameraTarget.target;

	}
	/**
	 * Update camera settings.
	 * @function Player.cameraTarget.
	 * setCameraTarget
	 * @param {THREE.PerspectiveCamera} camera [PerspectiveCamera]{@link https://threejs.org/docs/index.html#api/en/cameras/PerspectiveCamera}
	 * @param {boolean} [update=false] true - camera look at the target.
	 */
	this.setCameraTarget = function ( camera, update = false ) {

		if ( typeof THREE === 'undefined' ) {

			console.error( 'Call Player.setTHREE(THREE) first.' );
			return;

		}

		var cameraTarget = Player.cameraTarget.get();
		if ( !cameraTarget ) cameraTarget = cameraTarget || {};
		camera = camera || cameraTarget.camera;// || Player.player.getOptions().cameraTarget.camera;

		if ( !camera )
			return;//В этом приложении невозможно следить за точкой, потому что ни разу не была вызывана Player.cameraTarget.init()

		//На случай когда не определена ни одна точка как cameraTarget и пользователь поставил птичку в controllerCameraTarget
		if ( !cameraTarget.distanceToCamera )
			cameraTarget.distanceToCamera = new THREE.Vector3().copy( camera.position );

		if ( !cameraTarget.distanceToCameraCur )
			cameraTarget.distanceToCameraCur = new THREE.Vector3();

		const t = Player.getTime(),
			distanceToCamera = cameraTarget.distanceToCamera;
		cameraTarget.distanceToCameraCur.set(

			Player.execFunc( distanceToCamera, 'x', t ),
			Player.execFunc( distanceToCamera, 'y', t ),
			Player.execFunc( distanceToCamera, 'z', t )

		);

		if ( !cameraTarget.setCameraPosition || update )
			cameraTarget.setCameraPosition = function () {

				const target = cameraTarget.target;
				if ( ( Player.cameraGui && !Player.cameraGui.isLook() ) || !target )
					return;//Камере не нужно следить за выбранной точкой или ни одна точка не определена как target

				const t = Player.getTime();
				camera.position.copy( cameraTarget.distanceToCameraCur );
				camera.position.applyAxisAngle( cameraTarget.rotation.axis, Player.execFunc( cameraTarget.rotation, 'angle', t ) );
				camera.position.add( target );
				camera.lookAt( target );
				if ( Player.orbitControls ) {

					Player.orbitControls.target.copy( target );
					if ( Player.orbitControlsGui )
						Player.orbitControlsGui.setTarget( target );

				}

			}
	}

}
/**
 * Camera look at selected point
 * @function Player.
 * cameraTarget
 */
Player.cameraTarget = new playerCameraTarget();
/* *
 * set camera target
 * @function Player.
 * setPlayerCameraTarget
 * @param {object} options the following options are available:
 * @param {THREE.PerspectiveCamera} [options.camera] [PerspectiveCamera]{@link https://threejs.org/docs/index.html#api/en/cameras/PerspectiveCamera}
 * @param {object} [options.funcs] item of the arrayFuncs. See Player.getPoints(...) for details.
 */
/*
Player.setPlayerCameraTarget = function ( options ) {

	const funcs = options.funcs;
//	const boLook = Player.cameraTarget2 && ( Player.cameraTarget2.boLook !== undefined ) ? Player.cameraTarget2.boLook : true;//по умолчанию камера следит за точкой если для нее определен cameraTarget
	Player.cameraTarget2 = Player.cameraTarget2 || funcs.vector.cameraTarget;
	Player.cameraTarget2.boLook = Player.cameraTarget2.boLook !== undefined ? Player.cameraTarget2.boLook : true;//по умолчанию камера следит за точкой если для нее определен cameraTarget
	Player.cameraTarget2.camera = Player.cameraTarget2.camera || funcs.vector.cameraTarget.camera;
	if ( !Player.cameraTarget2.camera ) {

		console.error( 'Player.getPoints: Player.cameraTarget2.camera = ' + Player.cameraTarget2.camera );
		return;

	}
	//				Player.cameraTarget2.boLook = boLook;
	if ( Player.cameraTarget2.ready ) console.warn( 'Player.getPoints: duplicate cameraTarget' );
	Player.cameraTarget2.ready = true;

	Player.cameraTarget2.distanceToCamera = Player.cameraTarget2.distanceToCamera || ( funcs.vector.cameraTarget.distanceToCamera ?
		funcs.vector.cameraTarget.distanceToCamera : new THREE.Vector3().copy( Player.cameraTarget2.camera.position ) );
	//				Player.setPlayerCameraTarget( undefined, funcs );
	//				Player.cameraTarget2.rotation = funcs.vector.cameraTarget.rotation || Player.cameraTarget2.rotation;
	Player.cameraTarget2.rotation = Player.cameraTarget2.rotation || funcs.vector.cameraTarget.rotation;
	if ( Player.cameraTarget2.rotation ) {

		if ( Player.cameraTarget2.rotation.angle === undefined )
			Player.cameraTarget2.rotation.angle = 0;
		//						Player.cameraTarget2.rotation.angle = new Function( 't', 'return t' );
		Player.cameraTarget2.rotation.axis = Player.cameraTarget2.rotation.axis || new THREE.Vector3( 0, 1, 0 );//Rotate around y axis

	}

}
*/
/**
 * execute function
 * @function Player.
 * execFunc
 * @param {THREE.Vector4} funcs
 * @param {string} axisName axis name
 * @param {number} t time
 * @param {number} [a=1] multiplier. Second parameter of the arrayFuncs item function.
 * @param {number} [b=0] addendum. Third parameter of the arrayFuncs item function.
 */
Player.execFunc = function ( funcs, axisName, t, a = 1, b = 0 ) {

	var func = funcs[axisName], typeofFuncs = typeof func;
	if ( typeof t === "undefined" ) t = settings.min;
	switch ( typeofFuncs ) {

		case "undefined":
			return undefined;
		case "string":
			func = new Function( 't', 'a', 'b', 'return ' + func );
		case "function":
			try {

				const res = func( t, a, b );
				if ( res === undefined )
					throw 'function returns ' + res;
				return res;

			} catch( e ) {

				console.error( e );
				throw e;
//				alert( 'Player.execFunc(): axis: ' + axisName + '. ' + e );
				return;

			}
		case "number":
			return func;
		case "object":
			if ( Array.isArray( func ) ) {

				if ( func.length === 0 ) {

					console.error( 'Player.execFunc: funcs["' + axisName + '"] array is empty' );
					return;

				}
				const a = func,
					l = func.length - 1,
					max = settings.max === null ? Infinity : settings.max,
					min = settings.min,
					tStep = ( max - min ) / l;
				var tStart = min, tStop = max,
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
					if ( typeof a[iStart] === "object" ) {

						for ( var i = 0; i < func.length; i++ ){

							if ( i === ( func.length - 1 ) ) return a[i].v;

							iStart = i; iStop = i + 1;
							tStart = a[iStart].t; tStop = a[iStop].t;
							if ( ( tStart <= t ) && ( tStop > t ) ) {

								var x = ( a[iStop].v - a[iStart].v ) / ( tStop - tStart ),
									y = a[iStart].v - x * tStart;
								return x * t + y;

							}

						}
						console.error( 'Player.execFunc: value is not detected' );
						return;

					} else {

						console.error( 'Player.execFunc: funcs["' + axisName + '"] array item ' + iStart + ' typeof = ' + ( typeof a[iStart] ) + ' is not number' );
						return;

					}

				}
				if ( iStop >= func.length ) iStop = iStart;
				if ( typeof a[iStop] !== "number" ) {

					if ( axisName === 'w' )
						return execW( iStop );
					if ( typeof a[iStop] !== "object" ) {

						console.error( 'Player.execFunc: funcs["' + axisName + '"] array item ' + iStop + ' typeof = ' + ( typeof a[iStop] ) + ' is not number' );
						return;

					}

				}
				var x = ( a[iStop] - a[iStart] ) / ( tStop - tStart ),
					y = a[iStart] - x * tStart;
				if ( isNaN( x ) || isNaN( y ) ) console.error( 'Player.execFunc: invalid x = ' + x + ' or y = ' + y );
				return x * t + y;

			}
			if ( func.func )
				return func.func instanceof Function ? func.func( t, a, b ) : func.func;
			if ( axisName !== 'w' )
				console.error( 'Player.execFunc: funcs["' + axisName + '"] object is not array' );
			return func;
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
Player.selectMeshPlayScene = function ( /*THREE, */mesh, t, index, options ) {

	if ( typeof THREE === 'undefined' ) {

		console.error( 'Call Player.setTHREE(THREE) first.' );
		return;

	}
	if ( t === undefined ) t = Player.getSettings().min;
	index = index || 0;
	options = options || selectPlaySceneOptions || {};
	options.scales = options.scales || {};
	if (

		!mesh.userData.player ||
		( options && options.boPlayer && mesh.userData.boFrustumPoints )

	)
		return;

	//Эти строки нужны что бы появлялся текст возле точки, если на нее наведена мышка
	//при условии, что до этого точка была передвинута с помошью проигрывателя.
	if ( mesh.geometry ) {//scene do not have geometry

		delete mesh.geometry.boundingSphere;
		mesh.geometry.boundingSphere = null;

	}

	if ( mesh.userData.player.selectPlayScene ) {

		mesh.userData.player.selectPlayScene( t );

		//если не приводить угол поворота в диапазон 0 - 360 градусов,
		//то угол поворота будет равен нулю или Math.PI * 2
		//когда пользователь выберет mesh в guiSelectPoint.js
		//потому что в органе управления угла поворота угол поворота ограничен 0 - 360 градусов,
		//смотри строку
		//cRotations[name] = fRotation.add( new THREE.Vector3(), name, 0, Math.PI * 2, 1 / 360 ).
		//в guiSelectPoint
		function setRotation( axisName ) {

			while ( mesh.rotation[axisName] < 0 ) mesh.rotation[axisName] += Math.PI * 2;
			while ( mesh.rotation[axisName] > Math.PI * 2 ) mesh.rotation[axisName] -= Math.PI * 2;

		}
		setRotation( 'x' );
		setRotation( 'y' );
		setRotation( 'z' );
		
	}

	function setAttributes( a, b ) {

		if ( !mesh.geometry )
			return;
			
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

			function getColor() {

				if ( mesh.userData.player.palette )
					color = mesh.userData.player.palette.toColor( value, min, max );
				else if ( options.palette )
					color = options.palette.toColor( value, min, max );
				else {

					const c = { r: 255, g: 255, b: 255 };
					color = new THREE.Color( "rgb(" + c.r + ", " + c.g + ", " + c.b + ")" );
					return color;
/*				
					ColorPicker.palette.setTHREE( THREE );
					color = palette.get().toColor( value, min, max );
*/					

				}

			}

			if ( typeof funcs.w === "function" ) {

				var value = funcs.w( t, a, b );
				if ( options.scales.w ) {

					min = options.scales.w.min;
					max = options.scales.w.max;

				} else {

					min = 0;
					max = 100;

				}
				if ( attributes.position.itemSize >= 4 )
					attributes.position.setW( i, value );
				needsUpdate = true;

				getColor();

			} else if ( typeof funcs.w === "object" ) {

				if ( funcs.w instanceof THREE.Color )
					color = funcs.w;
				else {

					var value = funcs.w.func( t, a, b );
					if ( funcs.w.min !== 'undefined' ) min = funcs.w.min;
					if ( funcs.w.max !== 'undefined' ) max = funcs.w.max;
					getColor();

				}

			} else if ( ( typeof funcs.w === "number" ) && options.palette )
				color = options.palette.toColor( funcs.w, min, max );
			if ( color ) {

				if ( !mesh.material instanceof THREE.ShaderMaterial && mesh.material.vertexColors !== THREE.VertexColors )
					console.error( 'Player.selectPlayScene: Please set the vertexColors parameter of the THREE.PointsMaterial of your points to THREE.VertexColors. Example: vertexColors: THREE.VertexColors' );
				if ( !Player.setColorAttribute( attributes, i, color ) && funcs instanceof THREE.Vector4 ) {

					mesh.geometry.setAttribute( 'color',
						new THREE.Float32BufferAttribute( Player.getColors( /*THREE, */arrayFuncs,
							{
								positions: mesh.geometry.attributes.position,
								scale: { min: min, max: max },
								palette: options.palette,

							} ), 4 ) );
//							} ), 3 ) );//кажется тут ошибочно поставил itemSize = 3
					if ( !Player.setColorAttribute( attributes, i, color ) )
						console.error( 'Player.selectPlayScene: the color attribute is not exists. Please use THREE.Vector3 instead THREE.Vector4 in the arrayFuncs or add "color" attribute' );

				}

			}
			if ( needsUpdate )
				attributes.position.needsUpdate = true;

			if ( funcs.line !== undefined )
				funcs.line.addPoint( mesh, i/*getObjectPosition( mesh, i ), index*/, color );
//			cameraTarget( /*THREE, */mesh, funcs, t, i );
//			Player.cameraTarget.changeTarget( mesh, funcs, t, i );
			if ( funcs.cameraTarget && ( funcs.cameraTarget.boLook === true ) )
				Player.cameraTarget.changeTarget( mesh, i );

		};

	}
	setAttributes( options ? options.a : 1, options ? options.b : 0 );
	const message = 'Player.selectPlayScene: invalid mesh.scale.';
	if ( mesh.scale.x <= 0 ) console.error( message + 'x = ' + mesh.scale.x );
	if ( mesh.scale.y <= 0 ) console.error( message + 'y = ' + mesh.scale.y );
	if ( mesh.scale.z <= 0 ) console.error( message + 'z = ' + mesh.scale.z );

	if ( !options || !options.guiSelectPoint )
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
 * @param {THREE.Vector4|THREE.Vector3|THREE.Vector2|object|array} arrayFuncs points.geometry.attributes.position array
 * <pre>
 * THREE.Vector4: 4D point.
 * THREE.Vector3: 3D point. w = 1. Default is white color
 * THREE.Vector2: 2D point. w = 1, z = 0. Default is white color
 * Vector's x, y, z, w is position of the point.
 * Can be as:
 * <ul>
 * <li>float - position of the point.</li>
 * Example: 0.5
 * <li>[float] - array of positions of the point.</li>
 * Example 1: [0.6, 0, -0.5]
 * 0.6 is positon for t = min is start time of the playing.
 * 0 is position for t = ( max - min ) / 2
 * -0.5 is positon for t = max is stop time of the playing.
 * If stop time of the playing is infinity, then position is equal to the first item of the array or 0.6 in the example 1.
 * 
 * Example 2: [{ t: 0, v: 0.6 }, { t: 1, v: -0.6 }]
 * Every item of array is object with:
 * t is time
 * v is position for current t.
 * <li>[Function]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function} - position of the point is function of the t.
 * Example: new Function( 't', 'a', 'b', 'return Math.sin(t*a*2*Math.PI)*0.5+b' )</li>
 * <li>string - text of the function.
 * Example: 'Math.sin(t*a*2*Math.PI)*0.5+b' )</li>
 * </ul>
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
 *   
 *   //You can set the camera to look at a point. Use <b>cameraTarget</b> key for it.
 *   //ATTENTION!!! Only one point can have <b>cameraTarget</b> key!
 *   //   You will receive the 
 *   
 *   //      Player.getPoints: duplicate cameraTarget
 *   
 *   //   console warning if two or more points have <b>cameraTarget</b> key.
 *   //   Then only last point with <b>cameraTarget</b> key will be have an effect.
 *   [cameraTarget]: {
 *
 *      camera: [camera]{@link https://threejs.org/docs/index.html#api/en/cameras/PerspectiveCamera},
 *      
 *      //rotation camera around point specified by an axis and an angle. Default is undefined - no rotation
 *      [rotation]: {
 *      
 *         [angle]: number|function|array. Angle of rotation in radians.
 *            number. Example: Math.PI / 2 rotate to 90 degrees.
 *            function. Example: new Function( 't', 'return 5*t' ).
 *            array. Example 1: [0, Math.PI]
 *                  0 is angle for t = min is start time of the playing.
 *                  Math.PI is rotate to 180 degrees for t = max is time of the stopping of the playing.
 *                  If max time is infinity, then angle is for t = min.
 *               Example 2: [{ t: 0, v: 0 }, { t: 1, v: Math.PI / 2 }
 *                  t is time,
 *                  v is angle for current t.
 *            
 *            Default is 0
 *
 *         [axis]: THREE.Vector3. Axis of rotattion. Example: new THREE.Vector3( 1, 0, 0 ) - rotate around x axis.
 *            Default is new THREE.Vector3( 0, 1, 0 );//Rotate around y axis
 *            
 *      },
 *      
 *      [distanceToCamera]: THREE.Vector3. Distance from point to camera.
 *         You can set the distance to the camera depending on the time.
 *         Example 1: new THREE.Vector3( 0, 0, new Function( 't', 'return 2+t' ) )
 *         Example 2: new THREE.Vector3( 0, 0, [{ t: 0, v: 5 }, { t: 1, v: 2 }, { t: 10, v: 2 }, { t: 11, v: 5 }] )
 *         Default is camera.position.
 *      [orbitControls]: [OrbitControls]{@link https://threejs.org/docs/index.html#examples/en/controls/OrbitControls}. Change the OrbitControl setting during playing.
 *      [orbitControlsGui]: [OrbitControlsGui]{@link https://raw.githack.com/anhr/commonNodeJS/master/jsdoc/OrbitControlsGui/index.html} instance;
 *
 *   },
 *
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
Player.getPoints = function ( /*THREE, */arrayFuncs, optionsPoints ) {

	if ( typeof THREE === 'undefined' ) {

		console.error( 'Call Player.setTHREE(THREE) first.' );
		return;

	}
	GuiSelectPoint.setTHREE( THREE );
	
	optionsPoints = optionsPoints || {};
	if ( optionsPoints.t === undefined ) optionsPoints.t = optionsPoints.options ? optionsPoints.options.player.player.getOptions().settings.min : 0;
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

				const value = Player.execFunc( funcs, axisName, optionsPoints.t, a, b );
/*				
				if ( value === undefined ) {

					if ( axisName === 'w' )
						return 1;//white color
					else console.error( 'Player.getPoints.getAxis(' + axisName + '): value = ' + value );

				}
*/				
				return value;

			}
			if ( funcs.vector === undefined ) {

				console.error( 'options.getPoints: funcs.vector = ' + funcs.vector );
				return;

			}
			if ( funcs.name !== undefined )
				funcs.vector.name = funcs.name;
			if ( funcs.trace ) funcs.vector.line = new Player.traceLine( /*THREE, optionsPoints.group, */options );
			if ( funcs.cameraTarget ) {

				funcs.vector.cameraTarget = funcs.cameraTarget;
//				funcs.cameraTarget = undefined;
				delete funcs.cameraTarget;
//				Player.cameraTargetPoint = funcs.vector.cameraTarget;
//				Player.cameraTarget.init( { funcs: funcs, } );

				funcs.vector.cameraTarget.bodefault = false;
				if ( funcs.vector.cameraTarget.boLook === undefined ) funcs.vector.cameraTarget.boLook = true;

				Player.cameraTarget.init( funcs.vector.cameraTarget );
//				Player.cameraTarget.init( { funcs : funcs } );
//				Player.setPlayerCameraTarget( { funcs: funcs, } );
/*				
//				const boLook = Player.cameraTarget2 && ( Player.cameraTarget2.boLook !== undefined ) ? Player.cameraTarget2.boLook : true;//по умолчанию камера следит за точкой если для нее определен cameraTarget
				Player.cameraTarget2 = Player.cameraTarget2 || funcs.vector.cameraTarget;
				Player.cameraTarget2.boLook = Player.cameraTarget2.boLook !== undefined ? Player.cameraTarget2.boLook : true;//по умолчанию камера следит за точкой если для нее определен cameraTarget
				Player.cameraTarget2.camera = Player.cameraTarget2.camera || funcs.vector.cameraTarget.camera;
				if ( !Player.cameraTarget2.camera ) {

					console.error( 'Player.getPoints: Player.cameraTarget2.camera = ' + Player.cameraTarget2.camera );
					return;
					
				}
//				Player.cameraTarget2.boLook = boLook;
				if ( Player.cameraTarget2.ready ) console.warn( 'Player.getPoints: duplicate cameraTarget' );
				Player.cameraTarget2.ready = true;

				Player.cameraTarget2.distanceToCamera = Player.cameraTarget2.distanceToCamera || ( funcs.vector.cameraTarget.distanceToCamera ?
					funcs.vector.cameraTarget.distanceToCamera : new THREE.Vector3().copy( Player.cameraTarget2.camera.position ) );
//				Player.setPlayerCameraTarget( undefined, funcs );
//				Player.cameraTarget2.rotation = funcs.vector.cameraTarget.rotation || Player.cameraTarget2.rotation;
				Player.cameraTarget2.rotation = Player.cameraTarget2.rotation || funcs.vector.cameraTarget.rotation;
				if ( Player.cameraTarget2.rotation ) {

					if ( Player.cameraTarget2.rotation.angle === undefined )
						Player.cameraTarget2.rotation.angle = 0;
//						Player.cameraTarget2.rotation.angle = new Function( 't', 'return t' );
					Player.cameraTarget2.rotation.axis = Player.cameraTarget2.rotation.axis || new THREE.Vector3( 0, 1, 0 );//Rotate around y axis

				}
*/				

			}
			arrayFuncs[i] = funcs.vector;
			funcs = funcs.vector;
			return Player.execFunc( funcs, axisName, optionsPoints.t, a, b );


		}
		const point = funcs.vector instanceof THREE.Vector3 === true ?
			new THREE.Vector3( getAxis( 'x' ), getAxis( 'y' ), getAxis( 'z' ) ) :
			new THREE.Vector4( getAxis( 'x' ), getAxis( 'y' ), getAxis( 'z' ), getAxis( 'w' ) );

		if ( funcs.w === undefined ) {

/*
			point.w = {};//Если тут поставить NaN то в points.geometry.attributes.position.array он преобразуется в 0.
			//Тогда в gui появится ненужный орган управления controllerW
			//от балды поставил пустой объект что бы при создании points.geometry.attributes.position.array
			//это зачение преобразвалось в NaN.
*/
//Цвет этой точки не определен и по умолчанию должен быть белым.
//если я определю w то цвет точки будет зависеть от выбранной палитры
//			funcs.w = 1;//white color

		}

		points.push( point );

	}
	return points;

}
var boColorWarning = true;
/**
 * Get array of mesh colors.
 * @function Player.
 * getColors
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
Player.getColors = function ( /*THREE, */arrayFuncs, optionsColor ) {

	if ( typeof THREE === 'undefined' ) {

		console.error( 'Call Player.setTHREE(THREE) first.' );
		return;

	}
	ColorPicker.palette.setTHREE(THREE);
	optionsColor = optionsColor || {};
/*	
	if ( !optionsColor.palette ) {

		console.error( 'Player.getColors: Define palette first.' );
		return;

	}
*/	
//	optionsColor.palette = optionsColor.palette || palette.get();
	
	if (
		( optionsColor.positions !== undefined ) &&
		Array.isArray( arrayFuncs ) &&
		( arrayFuncs.length !== optionsColor.positions.count )
	) {

		console.error( 'getColors failed! arrayFuncs.length: ' + arrayFuncs.length + ' != positions.count: ' + optionsColor.positions.count );
		return optionsColor.colors;

	}

	//не надо убирать const length. Иначе переполнится память
	const length = Array.isArray( arrayFuncs ) ? arrayFuncs.length : optionsColor.positions.count;

	optionsColor.colors = optionsColor.colors || [];
	if ( !optionsColor.palette ) {

		//Все точки белые и непрозрачные
		for ( var i = 0; i < length; i++ ) optionsColor.colors.push( 1, 1, 1, 1 );
		return optionsColor.colors;

	}

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

					}

				} else { }

			}
			if ( w instanceof Function && ! settings && boColorWarning ) {

				console.warn( 'Player.getColors: remove all functions from all THREE.Vector4.w items of the arrayFuncs.' );
				console.warn( '	Or call Player(...) https://raw.githack.com/anhr/commonNodeJS/master/player/jsdoc/module-Player.html' );
				console.warn( '	If you use MyPoints for create of the points, please add Player: Player into settings parameter of the MyPoints function after creating of the Player.' );
				console.warn( '	If you are using MyThree to create the scene, add the player key to the options parameter of the MyThree constructor. See https://raw.githack.com/anhr/commonNodeJS/master/myThree/jsdoc/module-MyThree-MyThree.html' );
//				return;
//				settings = { min: 0 };
				boColorWarning = false;
				
			}
			var color = optionsColor.palette.toColor(
				funcs === undefined ?
					new THREE.Vector4().fromBufferAttribute( optionsColor.positions, i ).w :
					w instanceof Function ?
						w( settings ? settings.min : 0 ) :
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
 * @param {object} options the following options are available
 * @param {object} options.player See Player function above.
 */
Player.traceLine = function ( options ) {

	if ( typeof THREE === 'undefined' ) {

		console.error( 'Call Player.setTHREE(THREE) first.' );
		return;

	}
	if ( !settings ) {

		console.warn( 'Player.traceLine: Remove all trace: true from arrayFunc parameter of the MyPoints or getShaderMaterialPoints method.' );
		console.warn( '	Or call Player(...) https://raw.githack.com/anhr/commonNodeJS/master/player/jsdoc/module-Player.html' );
		console.warn( '	If you use getShaderMaterialPoints or MyPoints for create of the points, please add Player: Player into settings parameter of the getShaderMaterialPoints or MyPoints method after creating of the Player.' );
		console.warn( '	If you are using MyThree to create the scene, add the player key to the options parameter of the MyThree constructor. See https://raw.githack.com/anhr/commonNodeJS/master/myThree/jsdoc/module-MyThree-MyThree.html' );
		return;
		
	}
	var line;
	const arrayLines = [];
	this.addPoint = function ( mesh/*point*/, index, color ) {

		const attributesPosition = mesh.geometry.attributes.position;
		var point = attributesPosition.itemSize >= 4 ? new THREE.Vector4( 0, 0, 0, 0 ) : new THREE.Vector3();
		point.fromArray( attributesPosition.array, index * attributesPosition.itemSize );
//		var point = getObjectPosition( mesh, index ),
		var sceneIndex = Player.getSelectSceneIndex();
		if ( settings.max === null ) {

			sceneIndex = Math.abs( sceneIndex );
			if ( sceneIndex < ( arrayLines.length - 1 ) ){

				while ( sceneIndex < ( arrayLines.length - 1 ) ) {

//					group.remove( arrayLines[arrayLines.length - 1] );
					mesh.remove( arrayLines[arrayLines.length - 1] );
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
//			group.add( line );
			mesh.add( line );

			//на случай когда пользователь изменил флажок трассировки
			//первая линия arrayLines[0] всегда имеет visible = true потому что сюда попадат только если установлена трассировка по умолчанию
			//или пользователь установил флаг трассировки
			if ( arrayLines[0] ) line.visible = arrayLines[0].visible;

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

			} else MAX_POINTS = sceneIndex + 1;

			// attributes
			const positions = new Float32Array( MAX_POINTS * 3 ); // 3 coordinates per point
			geometry.setAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
			const colors = new Float32Array( MAX_POINTS * 3 ); // 3 coordinates per point
			geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );

			// draw range
			geometry.setDrawRange( sceneIndex, sceneIndex );

			line = new THREE.Line( geometry, new THREE.LineBasicMaterial( { vertexColors: THREE.VertexColors } ) );
			line.visible = true;
//			group.add( line );
			mesh.add( line );

		}
/*
		if ( line.geometry ) {//scene do not have geometry

			delete line.geometry.boundingSphere;
			line.geometry.boundingSphere = null;

		}
*/
		//Если не удалять boundingSphere
		//и если двигается камера от проигрывания или ее перемещает пользователь
		//то в некоторых случаях линию не будет видно даже если она не выходит из поля видимости
		//потому что она выходит за рамки frustupoints
		if ( line.geometry ) {//scene do not have geometry

			delete line.geometry.boundingSphere;
			line.geometry.boundingSphere = null;

		}

		//point position
		point = new THREE.Vector3().copy( point );
		point.toArray( line.geometry.attributes.position.array, sceneIndex * line.geometry.attributes.position.itemSize );
		line.geometry.attributes.position.needsUpdate = true;

		//point color
		if ( color === undefined )
			color = new THREE.Color( 1, 1, 1 );//White
		Player.setColorAttribute( line.geometry.attributes, sceneIndex, color );

		//set draw range
		var start = line.geometry.drawRange.start, count = sceneIndex + 1 - start;
		if ( start > sceneIndex ) {

			var stop = start + line.geometry.drawRange.count;
			start = sceneIndex;
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
	this.visible = function ( visible ) {

		if ( line ) {

			line.visible = visible;
			return;

		}
		//сюда попадает когда t max is Infinity (settings.max === null) и когда пользователь в выбранной в guiSelectPoint  точке изменил галочку трассировки
		arrayLines.forEach( function ( line ) {

			line.visible = visible;

		} );

	}
	/**
	 * Is trace line visible?
	 * @function Player.traceLine.
	 * isVisible
	 * @returns true - trace line is visible.
	 * <p>false - trace line is not visible.</p>
	 */
	this.isVisible = function () {

		if ( line ) return line.visible;
		//сюда попадает когда t max is Infinity ( settings.max === null ) и когда пользователь выбрал точку в guiSelectPoint у которой установлена трассировка
		return arrayLines[0].visible;

	}
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
		line.parent.remove( line );
//		group.remove( line );

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
	if ( settings.max === Infinity ) settings.max = null;//Заменяю Infinity на null потому что из cockie Infinity читается как null
	if ( settings.max !== null ) {

		if ( settings.max === undefined ) settings.max =  1;
		settings.marks = settings.marks || 10;//2;

	} else settings.marks = null;
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
/**
 * @function Player.
 * getSelectSceneIndex
 * @returns selected scene index.
 */
Player.getSelectSceneIndex = function () {

	if ( Player.player )
		return Player.player.getSelectSceneIndex();
	return 0;

}
/**
 * get time
 * @function Player.
 * getTime
 */
Player.getTime = function () {

	if ( Player.player )
		return Player.player.getTime();
	return 0;

}

/**
 * get item size of the attribute of the mesh geometry
 * @function Player.
 * getItemSize
 * @param {array} arrayFuncs points.geometry.attributes.position array.
 * See arrayFuncs parametr of the [Player.getPoints(...)]{@link https://raw.githack.com/anhr/commonNodeJS/master/player/jsdoc/module-Player.html#~Player.getPoints} for details.
 */
Player.getItemSize = function ( arrayFuncs ) {

	if ( typeof THREE === 'undefined' ){

		console.error( 'Call Player.setTHREE(THREE) first.' );
		return;

	}
	for ( var i = 0; i < arrayFuncs.length; i++ ) {

		var func = arrayFuncs[i];
		if ( func instanceof THREE.Vector4 )
			return 4;

	}
	return 3;

}
/**
 * set THREE
 * @function Player.
 * setTHREE
 * @param {THREE} THREE {@link https://github.com/anhr/three.js|THREE}
 */
Player.setTHREE = function ( _THREE ) {

	if ( THREE ) {

		if ( !Object.is( THREE, _THREE ) )
			console.error( 'Player.setTHREE: duplicate THREE. Please use one instance of the THREE library.' )
		return;

	}
	if ( !THREE ) {

		THREE = _THREE;
		Object.assign( THREE.BufferGeometry.prototype, {

			setFromPoints: function ( points, itemSize ) {

				itemSize = itemSize || 3;
				var position = [];

				for ( var i = 0, l = points.length; i < l; i++ ) {

					var point = points[i];
					position.push( point.x, point.y, point.z || 0 );
					if ( itemSize >= 4 )
						position.push( point.w || 0 );

				}

				this.setAttribute( 'position', new THREE.Float32BufferAttribute( position, itemSize ) );

				return this;

			},

		} );

		//three.js\dev\src\math\Vector4.js
		Object.assign( THREE.Vector4.prototype, {

			multiply: function ( v ) {

				this.x *= v.x;
				this.y *= v.y;
				this.z *= v.z;
				//		this.w *= v.w || 1;
				if ( v.w !== undefined )
					this.w *= v.w;

				return this;

			},

		} );
		//three.js\dev\src\math\Vector4.js
		Object.assign( THREE.Vector4.prototype, {

			add: function ( v, w ) {

				if ( w !== undefined ) {

					console.warn( 'THREE.Vector4: .add() now only accepts one argument. Use .addVectors( a, b ) instead.' );
					return this.addVectors( v, w );

				}

				this.x += v.x;
				this.y += v.y;
				this.z += v.z;
				if ( v.w !== undefined )
					this.w += v.w;

				return this;

			},

		} );

	}
	//three.js\dev\src\objects\Points.js
	Object.assign( THREE.Points.prototype, {

		raycast: function ( raycaster, intersects ) {

			const _inverseMatrix = new THREE.Matrix4();
			const _ray = new THREE.Ray();
			const _sphere = new THREE.Sphere();
			const _position = new THREE.Vector3();
			function testPoint( point, index, localThresholdSq, matrixWorld, raycaster, intersects, object ) {

				const rayPointDistanceSq = _ray.distanceSqToPoint( point );

				if ( rayPointDistanceSq < localThresholdSq ) {

					const intersectPoint = new THREE.Vector3();

					_ray.closestPointToPoint( point, intersectPoint );
					intersectPoint.applyMatrix4( matrixWorld );

					const distance = raycaster.ray.origin.distanceTo( intersectPoint );

					if ( distance < raycaster.near || distance > raycaster.far ) return;

					intersects.push( {

						distance: distance,
						distanceToRay: Math.sqrt( rayPointDistanceSq ),
						point: intersectPoint,
						index: index,
						face: null,
						object: object

					} );

				}

			}

			const geometry = this.geometry;
			const matrixWorld = this.matrixWorld;
			const threshold = raycaster.params.Points.threshold;

			// Checking boundingSphere distance to ray

			if ( geometry.boundingSphere === null ) geometry.computeBoundingSphere();

			_sphere.copy( geometry.boundingSphere );
			_sphere.applyMatrix4( matrixWorld );
			_sphere.radius += threshold;

			if ( raycaster.ray.intersectsSphere( _sphere ) === false ) return;

			//

//three.module.js:47508 THREE.Matrix4: .getInverse() has been removed. Use matrixInv.copy( matrix ).invert(); instead.
//			_inverseMatrix.getInverse( matrixWorld );
			_inverseMatrix.copy( matrixWorld ).invert();
			
			_ray.copy( raycaster.ray ).applyMatrix4( _inverseMatrix );

			const localThreshold = threshold / ( ( this.scale.x + this.scale.y + this.scale.z ) / 3 );
			const localThresholdSq = localThreshold * localThreshold;

			if ( geometry.isBufferGeometry ) {

				const index = geometry.index;
				const attributes = geometry.attributes;
				const positions = attributes.position.array;
				const itemSize = attributes.position.itemSize;

				if ( index !== null ) {

					const indices = index.array;

					for ( let i = 0, il = indices.length; i < il; i++ ) {

						const a = indices[i];

						_position.fromArray( positions, a * itemSize );

						testPoint( _position, a, localThresholdSq, matrixWorld, raycaster, intersects, this );

					}

				} else {

					for ( let i = 0, l = positions.length / itemSize; i < l; i++ ) {

						_position.fromArray( positions, i * itemSize );

						testPoint( _position, i, localThresholdSq, matrixWorld, raycaster, intersects, this );

					}

				}

			} else {

				const vertices = geometry.vertices;

				for ( let i = 0, l = vertices.length; i < l; i++ ) {

					testPoint( vertices[i], i, localThresholdSq, matrixWorld, raycaster, intersects, this );

				}

			}

		},

	} );

}

export default Player;
