/**
 * @module Player
 * @description 3D objects animation.
 * @author [Andrej Hristoliubov]{@link https://github.com/anhr}
 * @copyright 2011 Data Arts Team, Google Creative Lab
 *
 * @license under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */

import ScaleController from '../ScaleController.js';
import PositionController from '../PositionController.js';
import { controllers } from '../dat.gui/CustomController/build/dat.gui.module.js';

import {

	getWorldPosition,
	getObjectLocalPosition,
	getObjectPosition,

} from '../getPosition.js';

import three from '../three.js'
import Options from '../Options.js'
import { createController } from '../controller.js'

/**
 * @callback onSelectScene
 * @description This function is called at each new step of the playing. See <b>settings.onSelectScene</b> parameter of the <a href="../../player/jsdoc/module-Player-Player.html" target="_blank">Player</a> class.
 * @param {number} index current index of the scene of the animation
 * @param {number} t current time
 */

/**
 * @callback onChangeScaleT
 * @description User has updated the time settings. See <b>settings.onChangeScaleT</b> parameter of the <a href="../../player/jsdoc/module-Player-Player.html" target="_blank">Player</a> class.
 * @param {object} scale the updated time settings
 */

class Player {

	/**
	 * 3D objects animation.
	 * @class
	 * @param {THREE.Group|THREE.Scene} group [THREE.Group]{@link https://threejs.org/docs/index.html?q=group#api/en/objects/Group} or [THREE.Scene]{@link https://threejs.org/docs/index.html?q=sce#api/en/scenes/Scene} of the meshes for playing.
	 * @param {Object} [settings={}] the following settings are available
	 * 
	 * @param {Options} [settings.options=new Options()] <a href="../../jsdoc/Options/Options.html" target="_blank">Options</a> instance. The following options are available.
	 * See <b>options</b> parameter of <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
	 * @param {boolean} [settings.options.dat.playerGui] false - do not adds a <a href="../../player/jsdoc/module-Player-Player.html#gui" target="_blank">Player controllers</a> into [dat.gui]{@link https://github.com/dataarts/dat.gui}.
	 * @param {boolean} [settings.options.dat.playController] false - do not adds a <a href="../../player/jsdoc/module-Player-Player_PlayController_PlayController.html" target="_blank">PlayController</a> into [dat.gui]{@link https://github.com/dataarts/dat.gui}.
	 * @param {Object} [settings.options.playerOptions] Player settings.
	 * @param {number} [settings.options.playerOptions.min=0] Start time of the playing.
	 * @param {number} [settings.options.playerOptions.max=1] Stop time of the playing.
	 * @param {number} [settings.options.playerOptions.marks=10] Ticks count of the playing. Number of scenes of 3D objects animation.
	 * Have effect for <b>max</b> is not Infinity.
	 * @param {number} [settings.options.playerOptions.selectSceneIndex=0] current time index.
	 * <pre>
	 * Legal interval from 0 to to <b>marks - 1</b>.
	 * If <b>selectSceneIndex</b> = 0 then time = <b>min</b>.
	 * If <b>selectSceneIndex</b> = <b>marks - 1</b> then time = <b>max</b>.
	 * <pre>
	 * @param {number} [settings.options.playerOptions.dt=0.1] Step of the animation. Have effect only if <b>max</b> is infinity.
	 * @param {boolean} [settings.options.playerOptions.repeat=false] true - Infinitely repeating 3D objects animation.
	 * @param {number} [settings.options.playerOptions.interval=1] Ticks per seconds.
	 * @param {number} [settings.options.playerOptions.zoomMultiplier=1.1] zoom multiplier of the time.
	 * @param {number} [settings.options.playerOptions.offset=0.1] offset of the time.
	 * @param {number} [settings.options.playerOptions.name=""] name of the time.
	 * @param {boolean} [settings.options.player] false - do not create a <b>Player</b> instance.
	 *
	 * @param {onSelectScene} [settings.onSelectScene] This function is called at each new step of the playing. See <a href="../../player/jsdoc/module-Player.html#~onSelectScene" target="_blank">onSelectScene</a>.
	 * @param {onChangeScaleT} [settings.onChangeScaleT] event. User has updated the time settings. See <a href="../../player/jsdoc/module-Player.html#~onChangeScaleT" target="_blank">onChangeScaleT</a>.
	 * @param {FrustumPoints} [settings.frustumPoints] See <a href="../../frustumPoints/jsdoc/index.html" target="_blank">FrustumPoints</a>.
	 * Have effect only if <b>settings.options</b> is not defined.
	 * @param {THREE.PerspectiveCamera} settings.cameraTarget.camera [PerspectiveCamera]{@link https://threejs.org/docs/index.html#api/en/cameras/PerspectiveCamera}.
	 */
	constructor( group, settings={} ) {

		assign();

		if ( !settings.options && settings.frustumPoints ) settings.options = settings.frustumPoints.getOptions();
		settings.options = settings.options || new Options();
		const options = settings.options;
		if ( !options.boOptions ) {

			console.error( 'Player: call options = new Options( options ) first' );
			return;

		}

		if ( options.player === false ) return;

		options.boPlayer = options.boPlayer || false;

		//если тут создавать палитру то она не создастся если не создается плееер
		//palette = new palette();

		if ( options.player ) {

			console.error( 'Player: duplicate player.' );
			return;

		}
		options.player = this;

		settings.cameraTarget = settings.cameraTarget || {};

		/**
		 * @description This function is called at each new step of the playing.
		 * @param {number} [index=0] current index of the scene of the animation
		 */
		function onSelectScene( index ) {

			index = index || 0;
			const t = _this.getTime(index);
			Player.selectPlayScene( group, { t: t, index: index, options: settings.options } );
			_this.setIndex( index, ( options.playerOptions.name === '' ? '' : options.playerOptions.name + ': ' ) + t );
			if ( settings.onSelectScene ) _this.selectScenePause = settings.onSelectScene( index, t );
			if ( options.frustumPoints ) options.frustumPoints.updateCloudPoints();

		}

		//Теперь не нужно создавать color attribute на веб странице что бы цвет точек был верным еще до начала проигрывания
		//Кроме того трассировака начинается с нулевой точки
		setTimeout( function () { onSelectScene(); }, 0 );

		options.playerOptions.selectSceneIndex = options.playerOptions.selectSceneIndex || 0;
		var selectSceneIndex = options.playerOptions.selectSceneIndex;

		const _this = this;

		/**
		 * get time id
		 */
		this.getTimeId = function () { return selectSceneIndex; }
		
		/**
		 * get time
		 * @param {number} [timeId] Index of the time. The default is the time index of the selected scene.
		 */
		this.getTime = function (timeId) {

			const playerOptions = options.playerOptions, t = playerOptions.min + (timeId != undefined ? timeId : selectSceneIndex) * playerOptions.dt;
			if ( isNaN( t ) ) console.error( 'Player.getTime(): t = ' + t );
			if ( ( playerOptions.max !== null ) && ( t > playerOptions.max ) )
				console.error( 'Player.getTime(): t = ' + t + ' playerOptions.max = ' + playerOptions.max );
			if ( ( t < playerOptions.min ) && ( playerOptions.max !== null ) )
				console.error( 'Player.getTime(): t = ' + t + ' playerOptions.min = ' + playerOptions.min );
			return t;

		}

		/**
		 * set time
		 * @param {number} t time
		 * @returns false - invalid <b>t</b>.
		 */
		this.setTime = function ( t ) {

			return this.selectScene( parseInt( ( t - options.playerOptions.min ) / options.playerOptions.dt ) );

		}

		//массив индексов проигрывателя selectSceneIndex для функции onSelectScene
		//Этот массив заполняется когда пользователь нажал на scrollBar проигрывателя и когда очередной шаг проигрывателя выпоняется ассинхронно
		//В этом случае вызывается сразу несколько onSelectScene с разными индексами проигрывателя selectSceneIndex
		//Для того, что бы несколько onSelectScene не выполнялись одновременно сначала выполняется первый onSelectScene, а затем выпоняются остальные только когда выполнится предыдущий onSelectScene
		const aSelectSceneIndex = [];

		/**
		 * select scene for playing
		 * @param {number} index Index of the scene. Range from 0 to options.playerOptions.marks - 1
		 * @returns false - invalid <b>index</b>.
		 */
		this.selectScene = function ( index ) {

			if ( index === undefined ) {

				onSelectScene( selectSceneIndex );
				return true;

			}
			if ( isNaN( index ) ) {

				console.error( 'Player.selectScene: index = ' + index );
				return false;
				
			}
			index = parseInt( index );
			if ( options.playerOptions.max !== null ) {

				if ( index >= options.playerOptions.marks )
					index = 0;
				else if ( index < 0 )
					index = options.playerOptions.marks - 1;
				if ( selectSceneIndex > options.playerOptions.marks )
					selectSceneIndex = options.playerOptions.marks;

			}
			while ( selectSceneIndex !== index ) {

				if ( selectSceneIndex < index )
					selectSceneIndex++;
				else selectSceneIndex--;
				if (this.selectScenePause === true) 
					//Пользователь нажал scrollBar проигрывателя и когда очередной шаг проигрывателя выпоняется ассинхронно
					//В этом случае сдедующий onSelectScene выполняется только когда выполнится предыдущий onSelectScene
					aSelectSceneIndex.push( selectSceneIndex );
				else onSelectScene( selectSceneIndex );

			}
			return true;

		}

		/**
		 * Go to next animation scene
		 */
		this.next = function () {

			_this.selectScene( selectSceneIndex + 1 );

		}

		/**
		 * Go to previous animation scene
		 */
		this.prev = function () {

			_this.selectScene( selectSceneIndex - 1 );

		}
		/**
		 * Add controller into controllers array
		 * @param {controller} controller
		 */
		this.pushController = function ( controller ) {

			if ( ( controller.object !== undefined ) && ( controller.object.playRate !== undefined ) )
				controller.object.playRate = options.playerOptions.min;
			this.controllers.push( controller );

		}

		//Play/Pause

		this.controllers = [];
		var playing = false, time, timeNext;

		function RenamePlayButtons() {

			options.player.controllers.forEach( function ( controller ) { if ( controller.onRenamePlayButtons ) controller.onRenamePlayButtons( playing ); } );

		}

		function play() {

			if (
				( selectSceneIndex === -1 ) ||
				(
					( selectSceneIndex === options.playerOptions.marks ) &&
					( options.playerOptions.max !== null )
				)
			) {

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

			return options.playerOptions.repeat;

		}

		function playNext() {

			selectSceneIndex++;
			if ( ( options.playerOptions.max !== null ) && selectSceneIndex >= options.playerOptions.marks ) {

				if ( isRepeat() )
					selectSceneIndex = 0;
				else {

					//Для вычисления текущего времени в случае:
					//1. Запустить плеер и дождаться когда проигрывание остановится после достижения максимального времени
					//2. В guiSelectPoint выбрать точку, цвет которой зависит от времени
					//Тогда если убрать эту строку, то selectSceneIndex и время окажется за диапазоном допустимых значений
					//и цвет точки окажется неверным
					selectSceneIndex = options.playerOptions.marks - 1;

					pause();
					return;

				}

			}
			play();

		}

		function step(timestamp) {

			if (_this.selectScenePause) return;//При построении сцены был применен ProgressBar. Поэтому возврат из options.onSelectScene произошел еще до построения сцены. Нужно приостановить проигрывание, пока сцена не построится.
			if (playing)
				window.requestAnimationFrame(step);
			else time = undefined;

			if (time === undefined) {

				time = timestamp;
				timeNext = time + 1000 / options.playerOptions.interval;

			}
			if (isNaN(timeNext) || (timeNext === Infinity)) {

				console.error('Player.animate: timeNext = ' + timeNext);
				playing = false;

			}

			if ( (timestamp < timeNext) || !playing )
				return;
			const d = 1000 / options.playerOptions.interval;
			if (d > 0) while (timestamp > timeNext)
				timeNext += d;
			playNext();

		}

		/**
		 * User has clicked the Play ► / Pause ❚❚ button
		 */
		this.play3DObject = function () {

			if ( playing ) {

				pause();
				return;

			}

			playing = true;
			if ( ( options.playerOptions.max !== null ) && ( selectSceneIndex >= ( options.playerOptions.marks - 1 ) ) )
				selectSceneIndex = 0;//-1;
			playNext();
			RenamePlayButtons();

			window.requestAnimationFrame( step );

		}

		/**
		 * <pre>
		 *Continue playing asynchronously.
		 * Usual using if creating new scene to take long time.
		 * Please call it from <b>settings.options.onSelectScene()</b> function after asynchronously creating of the scene.
		 * Return true from <b>settings.options.onSelectScene()</b> function for pause of the playing.
		 * </pre>
		 * @see <a href="../../../../universe/main/jsdoc/" target="_blank">example</a>
		 */
		this.continue = () => {

			if (aSelectSceneIndex.length > 0) {

				onSelectScene(aSelectSceneIndex.shift());
				return;
				
			}
			_this.selectScenePause = false;
			window.requestAnimationFrame(step);
			
		}

		/**
		 * User has clicked the repeat ⥀ button
		 */
		this.repeat = function () {

			options.playerOptions.repeat = !options.playerOptions.repeat;
			this.onChangeRepeat( options.playerOptions.repeat );

		}

		/**
		 * @returns Player settings.
		 */
		this.getSettings = function () { return settings; }
		/**
		 * @returns selected scene index.
		 */
		this.getSelectSceneIndex = function () { return selectSceneIndex; }

		/**@namespace
		 * @descriptionUser has pressed the <b>Repeat</b> button of the <a href="../../player/jsdoc/module-Player-Player_PlayController_PlayController.html" target="_blank">Player.PlayController</a>.
		 * @param {boolean} value true - repeat is off
		 * <p>false - repeat is on</p>
		 */
		this.onChangeRepeat = function ( value ) {

			options.playerOptions.repeat = value;
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

		//PlayController localization

		const lang = {

			prevSymbol: '←',
			prevSymbolTitle: 'Go to previous animation scene',
			nextSymbol: '→',
			nextSymbolTitle: 'Go to next animation scene',
			playSymbol: '►',
			playTitle: 'Play',
			pause: '❚❚',
			pauseTitle: 'Pause',
			repeat: '⥀',
			repeatOn: 'Turn repeat on',
			repeatOff: 'Turn repeat off',
			controllerTitle: 'Current time.',
			stereoEffects: 'Stereo effects',
			mono: 'Mono',
			sideBySide: 'Side by side',
			topAndBottom: 'Top and bottom',

		};
		function localization( getLanguageCode ) {
			switch ( getLanguageCode() ) {

				case 'ru'://Russian language
					lang.prevSymbolTitle = 'Кадр назад';//'Go to previous animation scene',
					lang.playTitle = 'Проиграть';//'Play'
					lang.nextSymbolTitle = 'Кадр вперед';//'Go to next animation scene';
					lang.pauseTitle = 'Пауза';//'Pause',
					lang.repeatOn = 'Повторять проигрывание';
					lang.repeatOff = 'Остановить повтор проигрывания';
					lang.controllerTitle = 'Текущее время.';
					lang.stereoEffects = 'Стерео эффекты';
					lang.mono = 'Моно';
					lang.sideBySide = 'Слева направо';
					lang.topAndBottom = 'Сверху вниз';

					break;

			}

		}
		/** <a href="../../player/jsdoc/module-Player-Player_PlayController_PlayController.html" target="_blank">PlayController</a> localization
		* @param {Function} [getLanguageCode="en"] Your custom getLanguageCode() function.
		* <pre>
		* returns the "primary language" subtag of the language version of the browser.
		* Examples: "en" - English language, "ru" Russian.
		* See the {@link https://tools.ietf.org/html/rfc4646#section-2.1|rfc4646 2.1 Syntax} for details.
		* Default returns the 'en' is English language.
		* You can import { getLanguageCode } from '../../commonNodeJS/master/lang.js';
		* </pre>
	    * @returns Names and titles of the <b>PlayController</b> controls
		*/
		this.localization = function ( getLanguageCode = function() { return 'en' } ) {

			localization( getLanguageCode );
			return lang;

		}

		this.PlayController = class extends controllers.CustomController {

			/**
			 * @class playController class for using in my version of [dat.gui]{@link https://github.com/anhr/dat.gui} for animate of 3D objects in my projects.
			 * @extends dat.controllers.CustomController. See [CustomController.js]{@link https://github.com/anhr/commonNodeJS/blob/master/dat.gui/CustomController/src/dat/controllers/CustomController.js}
			 * @param {GUI} [gui] [new dat.GUI(...)]{@link https://github.com/anhr/dat.gui}. Folder for controller
			 */
			constructor( gui ) {

				const player = options.player, getLanguageCode = options.getLanguageCode;
				player.createControllersButtons( options );

				gui = gui || options.dat.gui;
				if ( !gui || options.dat.playController === false ) {

					super( {} );
					return;

				}

				localization( getLanguageCode );

				function addButton( innerHTML, title, onclick ) {

					const button = document.createElement( 'span' );
					button.innerHTML = innerHTML;
					button.title = title;
					button.style.cursor = 'pointer';
					button.style.margin = '0px 2px';
					button.onclick = onclick;
					return button;

				}

				var _renamePlayButtons, _renameRepeatButtons;//_selectScene, _repeat, _getGroup,
				const colorOff = 'rgb(255,255,255)', colorOn = 'rgb(128,128,128)';

				super( {

					playRate: 1,//Default play rate is 1 changes per second
					property: function ( customController ) {

						var buttons = {};
						function RenamePlayButtons( innerHTML, title ) {

							buttons.buttonPlay.innerHTML = innerHTML;
							buttons.buttonPlay.title = title;

						}
						_renamePlayButtons = RenamePlayButtons;

						buttons.buttonPrev = addButton( lang.prevSymbol, lang.prevSymbolTitle, player.prev );
						buttons.buttonPlay = addButton( playing ? lang.pause : lang.playSymbol,
							playing ? lang.pauseTitle : lang.playTitle, player.play3DObject );

						if ( player.getSettings().options.playerOptions.max !== null ) {

							//Repeat button

							function RenameRepeatButtons( isRepeat ) {

								var title, color;
								if ( isRepeat ) {

									title = lang.repeatOff;
									color = colorOff;

								} else {

									title = lang.repeatOn;
									color = colorOn;

								}

								if ( buttons.buttonRepeat.title === title )
									return;//stop of infinite recursive call

								buttons.buttonRepeat.title = title;
								buttons.buttonRepeat.style.color = color;

								player.onChangeRepeat( isRepeat );

							}
							_renameRepeatButtons = RenameRepeatButtons;
							function repeat( value ) {

								RenameRepeatButtons( buttons.buttonRepeat.title === lang.repeatOn );

							}
							var title, color;
							if ( player.getSettings().repeat ) {

								title = lang.repeatOff;
								color = colorOff;

							} else {

								title = lang.repeatOn;
								color = colorOn;

							}
							buttons.buttonRepeat = addButton( lang.repeat, title, repeat );
							buttons.buttonRepeat.style.color = color;

						}
						buttons.buttonNext = addButton( lang.nextSymbol, lang.nextSymbolTitle, player.next );
						function getGroup() {

							return group;

						}

						return buttons;

					},

				}, 'playRate' );
				player.PlayController = this;
				this.lang = lang;
				
				/** @namespace
				 * @description Get array of THREE.Vector4 points. User has pressed the <b>Play</b> button. Rename the <b>Play</b> putton.
				 * @param {boolean} playing true - name is "❚❚"
				 * <p>false = name is "►"
				 */
				this.onRenamePlayButtons = function ( playing ) {

					var name, title;
					if ( playing ) {

						name = lang.pause;
						title = lang.pauseTitle;

					} else {

						name = lang.playSymbol;
						title = lang.playTitle;

					}
					_renamePlayButtons( name, title, true );

				}
				/** @namespace
				 * @description User has pressed the <b>Repeat</b> button.
				 */
				this.onChangeRepeat = function () {

					_renameRepeatButtons( player.getSettings().options.playerOptions.repeat );

				}
				player.pushController( this );
				/**
				 * @param {number} value current time of the playing
				 */
				this.setValue = function ( value ) {

					this._controller.domElement.childNodes[0].value = value;

				}

				const controler = gui.add( this );
				//что бы можно было вводить цифры после запятой
				controler.__truncationSuspended = true;

			}
			set controller( newController ) {

				this._controller = newController;
				var _this = this;
				this._controller.onChange( function ( value ) { options.player.setTime( value ); /*_this.onChange( value );*/ } );
				this._controller.domElement.title = this.lang.controllerTitle;

			}
			get controller() { return this._controller; }

		}

		/**
		 * Adds a Player's controllers into [dat.gui]{@link https://github.com/anhr/dat.gui}.
		 * @param {GUI} [folder] Player's folder
		 */
		this.gui = function ( folder ) {

			const cookie = options.dat.cookie,
				cookieName = options.dat.getCookieName( 'Player' ),
				getLanguageCode = options.getLanguageCode,
				dat = three.dat;// options.dat.dat;

			folder = folder || options.dat.gui;
			if ( !folder || options.dat.playerGui === false )
				return;

			function setDT() {

				if ( options.playerOptions.max === null ) options.playerOptions.dt = options.playerOptions.dt || 0.1;
				else options.playerOptions.dt = ( options.playerOptions.max - options.playerOptions.min ) / ( options.playerOptions.marks - 1 );

			}

			function setSettings() {

				setDT();
				cookie.setObject( cookieName, options.playerOptions );
				if ( settings.onChangeScaleT ) settings.onChangeScaleT( options.playerOptions );

			}
			function setMax() {

				if ( options.playerOptions.max !== null )
					options.playerOptions.max = options.playerOptions.min + options.playerOptions.dt * ( options.playerOptions.marks - 1 );

			}
			setMax();
//			const axesDefault = JSON.parse( JSON.stringify( options.playerOptions ) ),//JSON преобразует Infinity в null. Поэтому неверно запоминается options.playerOptions.interval = Infinity
			const axesDefault = {},
				lang = getLang( {

					getLanguageCode: getLanguageCode,

				} );
			Object.keys( options.playerOptions ).forEach( ( key ) => { axesDefault[key] = options.playerOptions[key]; } );
			Object.freeze( axesDefault );
			const max = options.playerOptions.max, marks = options.playerOptions.marks;// interval = options.playerOptions.interval,
//				playerOptionsDefault = {};
//			Object.keys( options.playerOptions ).forEach( ( key ) => { playerOptionsDefault[key] = options.playerOptions[key]; } );
			cookie.getObject( cookieName, options.playerOptions, axesDefault );
//			if (interval === Infinity) options.playerOptions.interval = interval;//При копировании объекта свойство со значением Infinity превращается в null а затем я это переделываю в 1. Здесь я возвращаю значение interval = Infinity
			if ( ( max === null ) || ( max === Infinity ) ||
				( options.playerOptions.max === null )//раньше на веб странице плеер был настроен на бесконечное проигрыванияе а сейчас проигрывание ограничено по времени
			) {

				options.playerOptions.max = max;
				options.playerOptions.marks = marks;

			}

			const fPlayer = folder.addFolder( lang.player );
			dat.folderNameAndTitle( fPlayer, lang.player, lang.playerTitle );

			function scale() {

				const axes = options.playerOptions,
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
					{ settings: settings.options.playerOptions, getLanguageCode: getLanguageCode, } ) ).onChange( function ( value ) {

						axes.zoomMultiplier = value;
						setSettings();

					} );

				const positionController = new PositionController( function ( shift ) {

					onclick( positionController, function ( value, zoom ) {

						value += shift;
						return value;

					} );

				}, { settings: settings.options.playerOptions, getLanguageCode: getLanguageCode, } );
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
						if ( elSlider ) elSlider.max = options.playerOptions.marks - 1;

					} );
					dat.controllerNameAndTitle( scaleControllers.marks, axes.marksName === undefined ? lang.marks : axes.marksName,
						axes.marksTitle === undefined ? lang.marksTitle : axes.marksTitle );

				}

				//Ticks per seconds.
				settings.options.playerOptions.intervalOptions ||= {};
				const intervalOptions = settings.options.playerOptions.intervalOptions;
				intervalOptions.min = intervalOptions.min != undefined ? intervalOptions.min : settings.options.playerOptions.interval < 1 ? settings.options.playerOptions.interval : 1;
				intervalOptions.max = intervalOptions.max === null ? Infinity : //Во время JSON преобразования Infinity превращается в null. Поэтому восстанавливаю обратно
					intervalOptions.max != undefined ? intervalOptions.max : settings.options.playerOptions.interval > 25 ? settings.options.playerOptions.interval : 25;
/*				
				intervalOptions.max = intervalOptions.max != undefined ? intervalOptions.max :
					intervalOptions.max != null ? 25 : Infinity;//Во время JSON преобразования Infinity превращается в null. Поэтому восстанавливаю обратно
*/					
				if (intervalOptions.max === Infinity)
					scaleControllers.interval = scaleControllers.folder.add( settings.options.playerOptions, 'interval' ).onChange( function ( value ) {

						setSettings();

					} );
				else scaleControllers.interval = scaleControllers.folder.add( settings.options.playerOptions, 'interval', intervalOptions.min, intervalOptions.max, 1 ).onChange( function ( value ) {

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
						if ( ( axesDefault.interval > scaleControllers.interval.__max ) || ( axesDefault.interval < scaleControllers.interval.__min )) {
							
							scaleControllers.interval.domElement.childNodes[0].childNodes[0].value = axesDefault.interval;
							axes.interval = axesDefault.interval;

						}

						setSettings();

					},

				}, 'defaultF' ), lang.defaultButton, lang.defaultTitle );

			}
			scale();

		}

		/**
		 * Adds player buttons into web page.
		 * @param {Object} options the following options are available
		 * @param {Object} [options.controllers.player] player buttons, available from web page
		 * @param {HTMLElement|string} [options.controllers.player.buttonPrev="prev"] Go to previous animation scene.
		 * <pre>
		 * HTMLElement - <b>input</b> element of the "button" type.
		 * string - <b>id</b> of <b>input</b> element.
		 * </pre>
		 * @param {HTMLElement|string} [options.controllers.player.buttonPlay="play"] play or pause of the playing.
		 * <pre>
		 * HTMLElement - <b>input</b> element of the "button" type.
		 * string - <b>id</b> of <b>input</b> element.
		 * </pre>
		 * @param {HTMLElement|string} [options.controllers.player.buttonNext="next"] Go to next animation scene.
		 * <pre>
		 * HTMLElement - <b>input</b> element of the "button" type.
		 * string - <b>id</b> of <b>input</b> element.
		 * </pre>
		*/
		this.createControllersButtons = function ( options ) {

			if ( !options.controllers || !options.controllers.player ) return;
			const settings = options.controllers.player

			//Previous button

			if ( settings.buttonPrev === null ) console.warn( 'Player.createControllersButtons: invalid options.controllers.player.buttonPrev = ' + settings.buttonPrev );
			if ( settings.buttonPrev ) {

				const buttonPrev = typeof settings.buttonPrev === 'string' ? document.getElementById( settings.buttonPrev ) : settings.buttonPrev;
				if ( buttonPrev === null ) console.warn( 'Player.createControllersButtons: invalid options.controllers.player.buttonPrev = ' + settings.buttonPrev );
				if ( buttonPrev ) {

					buttonPrev.value = lang.prevSymbol;
					buttonPrev.title = lang.prevSymbolTitle;
					buttonPrev.onclick = function ( event ) { if ( options.player ) options.player.prev(); }
					settings.buttonPrev = buttonPrev;

				}

			}

			//Play button
			
			if ( settings.buttonPlay === null ) console.warn( 'Player.createControllersButtons: invalid options.controllers.player.buttonPlay = ' + settings.buttonPlay );
			if ( settings.buttonPlay ) {

				const buttonPlay = typeof settings.buttonPlay === 'string' ? document.getElementById( settings.buttonPlay ) : settings.buttonPlay;
				if ( buttonPlay === null ) console.warn( 'Player.createControllersButtons: invalid options.controllers.player.buttonPlay = ' + settings.buttonPlay );
				if ( buttonPlay ) {

					buttonPlay.value = playing ? lang.pause : lang.playSymbol;
					buttonPlay.title = playing ? lang.pauseTitle : lang.playTitle;
					buttonPlay.onclick = function ( event ) { if ( options.player ) options.player.play3DObject(); }
					settings.buttonPlay = buttonPlay;

				}

			}

			//Next button

			if ( settings.buttonNext === null ) console.warn( 'Player.createControllersButtons: invalid options.controllers.player.buttonNext = ' + settings.buttonNext );
			if ( settings.buttonNext ) {

				const buttonNext = typeof settings.buttonNext === 'string' ? document.getElementById( settings.buttonNext ) : settings.buttonNext;
				if ( buttonNext === null ) console.warn( 'Player.createControllersButtons: invalid options.controllers.player.buttonNext = ' + settings.buttonNext );
				if ( buttonNext ) {

					buttonNext.value = lang.nextSymbol;
					buttonNext.title = lang.nextSymbolTitle;
					buttonNext.onclick = function ( event ) { if ( options.player ) options.player.next(); }
					settings.buttonNext = buttonNext;

				}

			}

		}

		var _canvasMenu;
		/**
		 * Adds a Player's menu item into [CanvasMenu]{@link https://github.com/anhr/commonNodeJS/tree/master/canvasMenu}.
		 * @param {CanvasMenu} canvasMenu [CanvasMenu]{@link https://github.com/anhr/commonNodeJS/tree/master/canvasMenu}.
		* @param {Function} [getLanguageCode="en"] Your custom getLanguageCode() function.
		* <pre>
		* returns the "primary language" subtag of the language version of the browser.
		* Examples: "en" - English language, "ru" Russian.
		* See the {@link https://tools.ietf.org/html/rfc4646#section-2.1|rfc4646 2.1 Syntax} for details.
		* Default returns the 'en' is English language.
		* You can import { getLanguageCode } from '../../commonNodeJS/master/lang.js';
		* </pre>
		*/
		this.createCanvasMenuItem = function ( canvasMenu, getLanguageCode = function() { return 'en' } ) {

			_canvasMenu = canvasMenu;

			const player = this, menu = canvasMenu.menu, lang = player.localization( getLanguageCode );

			//Previous button
			menu.push( {

				name: lang.prevSymbol,
				title: lang.prevSymbolTitle,
				onclick: function ( event ) { player.prev(); }

			} );

			//Play button
			menu.push( {

				name: playing ? lang.pause : lang.playSymbol,
				title: playing ? lang.pauseTitle : lang.playTitle,
				id: "menuButtonPlay",
				onclick: function ( event ) {

					player.play3DObject();

				}

			} );

			if ( options.playerOptions.max !== null ) {

				//Repeat button
				menu.push( {

					name: lang.repeat,
					title: this.getSettings().repeat ? lang.repeatOff : lang.repeatOn,
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

			this.controllers.push( {

				/* *
				 * Renames the "Play" button of the player's menu.
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
					if ( options.controllers && options.controllers.player && options.controllers.player.buttonPlay ) {

						options.controllers.player.buttonPlay.value = name;
						options.controllers.player.buttonPlay.title = title;

					}

				},

				/* *
				 * Changes "Repeat" button of the player's menu between <b>repeat Off</b> and <b>repeat On</b>.
				 */
				onChangeRepeat: function () {

					canvasMenu.querySelector( '#menuButtonRepeat' ).title = options.playerOptions.repeat ? lang.repeatOff : lang.repeatOn;

				}

			} );

		}

		/**
		 * Adds slider menu item into [CanvasMenu]{@link https://github.com/anhr/commonNodeJS/tree/master/canvasMenu}.
		 */
		this.addSlider = function () {

			if ( options.playerOptions.max === null )
				return;

			_canvasMenu.menu.push( {

				name: '<input type="range" min="0" max="' + ( options.playerOptions.marks - 1 ) + '" value="0" class="slider" id="sliderPosition">',
				style: 'float: right;',

			} );

		}

		function getSliderElement() { if ( _canvasMenu ) return _canvasMenu.querySelector( '#sliderPosition' ); }

		/**
		 * Adds an events into slider menu item of the [CanvasMenu]{@link https://github.com/anhr/commonNodeJS/tree/master/canvasMenu}.
		 * @returns slider element
		 */
		this.addSliderEvents = function () {

			const elSlider = getSliderElement(), player = this;
			if ( elSlider ) {

				elSlider.onchange = function ( event ) { player.selectScene( parseInt( elSlider.value ) ); };
				elSlider.oninput = function ( event ) { player.selectScene( parseInt( elSlider.value ) ); };

				var pointerdown;
				const player = this;
				elSlider.addEventListener( 'pointerdown', e => { pointerdown = true; } );
				elSlider.addEventListener( 'pointerup', e => { pointerdown = false; } );
				elSlider.addEventListener( 'mousemove', e => {

					if ( !pointerdown )
						return;
					player.selectScene( ( options.playerOptions.marks - 1 ) * e.offsetX / elSlider.clientWidth );

				} );

			}
			return elSlider;

		}

		/**
		 * Sets <b>index</b> and <b>title</b> of the slider element of the player's menu.
		 * @param {string} index
		 * @param {string} title
		 */
		this.setIndex = function ( index, title ) {

			const t = this.getTime();
			if ( options.controllers && options.controllers.t )
				options.controllers.t.controller.value = t;
			if ( typeof this.PlayController === "object" ) this.PlayController.setValue( t );
			const elSlider = getSliderElement();
			if ( elSlider ) {

				elSlider.value = index;
				elSlider.title = title;

			}

		}

		/**
		 * Changes the "max" value of the slider of the player's menu. Moves <b>Player</b> to the first scene.
		 * @param {Object} scale See  <b>options.playerOptions</b> parameter of <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
		 */
		this.onChangeScale = function ( scale ) {

			getSliderElement().max = scale.marks - 1;
			this.selectScene( 0 );

		}

	}

}

/**
 * @class
 */
Player.cameraTarget = class {

	/**
	 * Functions for camera for looking at selected point.
	 */
	constructor() {

		const cameraTargetDefault = { boLook: false, },//По умолчанию не слежу за точкой
			_cameraTarget = {

				boLook: cameraTargetDefault.boLook,
				getDistanceToCamera() {

					if ( typeof this.distanceToCameraCur !== 'undefined' ) return this.distanceToCameraCur;
					return this.distanceToCamera;
					
				}
			};
		var _options;
		cameraTargetDefault.rotation = {};
		_cameraTarget.rotation = {};
		var boTarget = false,//true - target point was detected. For displaying of the console warning if duplicate target point was detected
			boPlayer = false;//true - была попытка получить camera из _options.player. Добавил что бы не выполнялась лишняя работа

		//Если определен ( boCameraTargetLook !== undefined ) , то явно было задано следить или не следить за точкой.
		//Тогда если есть точка, за которой надо следить ( cameraTarget.bodefault === false )
		//и явно не было задано следить или не следить заточкой  ( boCameraTargetLook === undefined ),
		//то надо следить за точкой ( cameraTargetDefault.boLook = true )
		var boCameraTargetLook;

		/**
		 * get camera target
		 * @param {Object} [options] See the <b>options</b> parameter of the <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
		 * @param {Object} [options.player] <a href="../../player/jsdoc/index.html" target="_blank">Player</a> instance.
		 */
		this.get = function ( options ) {

			if ( !options && !_options )
				console.error( 'Player.cameraTarget.get: options = ' + options );
			else if ( _options && options && !Object.is( _options, options ) )
				console.error( 'Player.cameraTarget.get: options is ambiguous' );
			_options = _options || options;
			if ( !_cameraTarget.camera && !boPlayer && _options.player ) {

				cameraTargetDefault.camera = _options.player.getSettings().cameraTarget.camera;
				if ( cameraTargetDefault.camera ) setCameraTarget();
				boPlayer = true;

			}
			if ( _cameraTarget.camera )
				return _cameraTarget;

		}

		/**
		 * Create default camera target
		 * @param {object} cameraTarget the following cameraTarget are available:
		 * @param {THREE.PerspectiveCamera} [cameraTarget.camera] [PerspectiveCamera]{@link https://threejs.org/docs/index.html#api/en/cameras/PerspectiveCamera}
		 * @param {boolean} [cameraTarget.boLook=false] true - camera look at the target.
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
		 * @param {Object} options See the <b>options</b> parameter of the <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
		 * @param {boolean} [boErrorMessage=true] false - Do not send an error message to the console if <b>cameraTarget.camera</b> is not defined.
		 */
		this.init = function ( cameraTarget, options, boErrorMessage = true ) {

			if ( !cameraTarget ) return;
			
			if ( !options && !_options )
				console.error( 'Player.cameraTarget.init: options = ' + options );
			else if ( _options && options && !Object.is( _options, options ) )
				console.error( 'Player.cameraTarget.init: options is ambiguous' );
			_options = _options || options;

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

			} else if ( cameraTarget.boLook === true ) {

				//Есть точка, за которой надо следить

				if ( boTarget ) console.warn( 'playerCameraTarget().init(...): duplicate target point' );
				boTarget = true;

				if ( boCameraTargetLook === undefined )
					cameraTargetDefault.boLook = true;//запрета на слежение камерой за точкой не было и есть точка, за которой надо следить

			} else return;
			cameraTargetDefault.camera = cameraTargetDefault.camera ||
				cameraTarget.camera ||
				( _options.player ? _options.player.getSettings().cameraTarget.camera : undefined );
			if ( !cameraTargetDefault.camera && boErrorMessage ) {

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

			assign();

			if ( !cameraTarget )
				cameraTarget = cameraTargetDefault;//У выбранной для слежения точки нет cameraTarget
			if ( !_cameraTarget.boMaual ) {//если не делать эту проверку, то пользователь не сможет изменить вручную _cameraTarget.boLook когда выбрана точка, за которой надо следить

				if ( cameraTarget.boLook !== undefined )
					_cameraTarget.boLook = cameraTarget.boLook;
				else _cameraTarget.boLook = cameraTargetDefault.boLook;

			}
			cameraTargetDefault.camera = cameraTargetDefault.camera || cameraTarget.camera;
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
			if ( cameraTarget.rotation.angle !== undefined )
				_cameraTarget.rotation.angle = cameraTarget.rotation.angle;
			else _cameraTarget.rotation.angle = cameraTargetDefault.rotation.angle || 0;
			_cameraTarget.rotation.axis = cameraTarget.rotation.axis || cameraTargetDefault.rotation.axis || new THREE.Vector3( 0, 1, 0 );//Rotate around y axis

		}

		/**
		 * Change target.
		 * @param {THREE.Mesh} mesh [Mech]{@link https://threejs.org/docs/index.html#api/en/objects/Mesh} with selected point as target for camera.
		 * @param {number} i index of the point.
		 * @param {Options} [options] See <a href="../../jsdoc/Options/index.html" target="_blank">Options</a>.
		 */
		this.changeTarget = function ( mesh, i, options ) {

			assign();

			//Update cameraTarget
			const func = !mesh.userData.player || ( typeof mesh.userData.player.arrayFuncs === "function" ) ? {} :
//				mesh.userData.player.arrayFuncs[mesh.userData.myObject && mesh.userData.myObject.guiPoints ? mesh.userData.myObject.guiPoints.seletedIndex(i) : i];
				mesh.userData.player.arrayFuncs[mesh.userData.myObject.guiPoints.seletedIndex(i)];
			if ( !func.cameraTarget )
				func.cameraTarget = { boLook: false };
			setCameraTarget( func.cameraTarget );

			_options = _options || options;
			const cameraTarget = _options.playerOptions.cameraTarget.get( _options );

			if ( cameraTarget ) {

				if ( cameraTarget && cameraTarget.boLook ) {

					const target = getWorldPosition( mesh, new THREE.Vector3().fromArray( mesh.geometry.attributes.position.array, i * mesh.geometry.attributes.position.itemSize ) );
					cameraTarget.target = target;

				} else delete cameraTarget.target;

			}

		}
		/**
		 * Update camera settings.
		 * @param {Object} options See the <b>options</b> parameter of the <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
		 */
		this.setCameraTarget = function ( options ) {

			assign();

			var cameraTarget = options.playerOptions.cameraTarget.get( options );
			if ( !cameraTarget ) cameraTarget = cameraTarget || {};
			const camera = cameraTarget.camera;

			if ( !camera )
				return;//В этом приложении невозможно следить за точкой, потому что ни разу не была вызывана Player.cameraTarget.init()

			//На случай когда не определена ни одна точка как cameraTarget и пользователь поставил птичку в controllerCameraTarget
			if ( !cameraTarget.distanceToCamera )
				cameraTarget.distanceToCamera = new THREE.Vector3().copy( camera.position );

			if ( !cameraTarget.distanceToCameraCur )
				cameraTarget.distanceToCameraCur = new THREE.Vector3();

			const t = options.time,
				distanceToCamera = cameraTarget.distanceToCamera,
				distanceToCameraCur = new THREE.Vector3().copy( cameraTarget.distanceToCameraCur );
			cameraTarget.distanceToCameraCur.set(

				Player.execFunc( distanceToCamera, 'x', t, options ),
				Player.execFunc( distanceToCamera, 'y', t, options ),
				Player.execFunc( distanceToCamera, 'z', t, options )

			);

			if ( !cameraTarget.setCameraPosition )
				cameraTarget.setCameraPosition = function ( /*setCameraDefault*/ ) {

					var target = cameraTarget.target;

					//не менять позицию камеры если
					if (
						!cameraTarget.boLook ||//не следить за точкой
						(//или
							!target &&//нет точки, за которой надо следить
							cameraTarget.distanceToCameraCur.equals( distanceToCameraCur )//и не изменилось расстояние камеры до target
						)
					) {

						return;//Камере не нужно следить за выбранной точкой или ни одна точка не определена как target

					}
					
					distanceToCameraCur.copy( cameraTarget.distanceToCameraCur );
					const t = options.time;
					camera.position.copy( cameraTarget.distanceToCameraCur );
					camera.position.applyAxisAngle( cameraTarget.rotation.axis, Player.execFunc( cameraTarget.rotation, 'angle', t, options ) );
					if ( !target ) {

						if ( Player.orbitControls ) target = Player.orbitControls.target;
						else {

							//console.warn( 'Under constaction' );
							return;

						}

					}
					camera.position.add( target );
					camera.lookAt( target );
					if ( options.orbitControls ) {

						if ( !options.orbitControls.target.equals( target ) ) {

							options.orbitControls.target.copy( target );
							if ( options.orbitControlsGui )
								options.orbitControlsGui.setTarget( target );

						}
						if ( options.orbitControls._listeners )
							options.orbitControls._listeners.change[0]();//move frustumpoints

					}

				}

			if ( options.cameraGui ) options.cameraGui.update();

		}

	}

}

/** @namespace
 * @description execute function
 * @param {THREE.Vector4} funcs vector of the functions for executing.
 * @param {string} axisName axis name of the function for executing. Can be as "x", "y", "z", "w".
 * @param {number} t time. First parameter of the function for executing.
 * @param {object} [options={}] the following options are available:
 * @param {number} [options.a=1] multiplier. Second parameter of the function for executing.
 * @param {number} [options.b=0] addendum. Third parameter of the function for executing.
 * @returns function execution value.
 */
Player.execFunc = function ( funcs, axisName, t, options={} ) {

	var func = funcs[axisName];
	const a = options.a, b = options.b, typeofFuncs = typeof func;
	if ( typeof t === "undefined" ) t = options.playerOptions ? options.playerOptions.min : 0;
	switch ( typeofFuncs ) {

		case "undefined":
			return undefined;
		case "number":
			return func;
		case "string":
			func = new Function( 't', 'a', 'b', 'return ' + func );
		case "function":
			try {

				const res = func( t, a, b );
				if ( res === undefined )
					throw 'function returns ' + res;
				if ( !Array.isArray( res ) ) return res;
				else func = res;

			} catch( e ) {

				console.error( e );
				throw e;
				return;

			}
		case "object":
			if ( Array.isArray( func ) ) {

				if ( func.length === 0 ) {

					console.error( 'Player.execFunc: funcs["' + axisName + '"] array is empty' );
					return;

				}
				const a = func,
					l = func.length - 1,
					max = options.playerOptions.max === null ? Infinity : options.playerOptions.max,
					min = options.playerOptions.min,
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

var lang;

class Ids {

	constructor() {

		function addKeys( axisName ) {

			function keyValue( controllerId ) {

				const id = axisName + controllerId;
				return {

					get controllerId() { return this.boUsed ? undefined : id; },
					get elController() { return document.getElementById( this.controllerId ); },

					nameId: id + 'Name',
					get elName() { return document.getElementById( this.nameId ); },

				}

			}
			return {

				func: keyValue( 'Func' ),
				position: keyValue( 'Position' ),
				worldPosition: keyValue( 'WorldPosition' ),

			}

		}
		this.x = addKeys( 'x' );
		this.y = addKeys( 'y' );
		this.z = addKeys( 'z' );
		this.w = addKeys( 'w' );
		/*
			y: addKeys( 'y' ),
			z: addKeys( 'z' ),
			w: addKeys( 'w' ),
		*/

	}

}
var ids = new Ids();

/** @namespace
 * @description Select a scene for playing of the mesh
 * @param {THREE.Mesh} mesh [Mech]{@link https://threejs.org/docs/index.html#api/en/objects/Mesh} for playing.
 * @param {Object} [settings={}] the following settings are available
 * @param {number} [settings.t=0] time
 * @param {Object} [settings.options={ dat: false }] See the <b>options</b> parameter of the <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
 * @param {boolean} [settings.options.boPlayer] true - is not select play scene for mesh.userData.boFrustumPoints = true. Default is false.
 * @param {object} [settings.options.playerOptions] The <b>settings.options.playerOptions</b> parameter of the <a href="./module-Player-Player.html" target="_blank">Player</a> .
 * @param {number} [settings.options.a] multiplier. Second parameter of the arrayFuncs item function. Default is 1.
 * @param {number} [settings.options.b] addendum. Third parameter of the arrayFuncs item function. Default is 0.
 * @param {object} [settings.options.scales] axes scales.
 * See <b>options.scales</b> of the <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> for details.
 * @param {object} [settings.options.palette=new ColorPicker.palette();//palette: ColorPicker.paletteIndexes.BGYW] See <a href="../../colorPicker/jsdoc/module-ColorPicker.html#~Palette" target="_blank">ColorPicker.palette</a>.
 * @param {object} [settings.options.point={}] point settings. Applies to points with ShaderMaterial.
 * <pre>
 * See [ShaderMaterial]{@link https://threejs.org/docs/index.html#api/en/materials/ShaderMaterial} for details.
 * The size of the point seems constant and does not depend on the distance to the camera.
 * </pre>
 * @param {number} [settings.options.point.size=0.02] The apparent angular size of a point in radians.
*/
Player.selectMeshPlayScene = function ( mesh, settings = {} ) {

	assign();

	var t = settings.t, options = settings.options || { dat: false };

	options = new Options( options );
	if ( t === undefined ) t = options.playerOptions.min;
	options.scales.setW();
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

		if ( !mesh.geometry || mesh.userData.nd )
			return;
			
		const attributes = mesh.geometry.attributes,
			arrayFuncs = mesh.userData.player.arrayFuncs;
		if ( arrayFuncs === undefined )
			return;
		if ( t === undefined )
			console.error( 'setPosition: t = ' + t );

/*
		if ( mesh.userData.myObject && mesh.userData.myObject.isSetPosition ) {

			
		}
*/
		var min, max;
		if ( options && ( options.scales.w !== undefined ) ) {

			min = options.scales.w.min; max = options.scales.w.max;

		} else {

			max = value;
			min = max - 1;

		}

		if ( !mesh.userData.myObject || !mesh.userData.myObject.isSetPosition ) {
			for (var i = 0; i < arrayFuncs.length; i++) {

				var funcs = arrayFuncs[i], needsUpdate = false;
				function setPosition(axisName, fnName) {

					var value = Player.execFunc(funcs, axisName, t, options);// a, b );
					if (value !== undefined) {

						attributes.position[fnName](i, value);
						needsUpdate = true;

					}

				}
				setPosition('x', 'setX');
				setPosition('y', 'setY');
				setPosition('z', 'setZ');
				setPosition('w', 'setW');

				//если тут поставить var то цвет точки, которая определена как THREE.Vector3 будет равет цвету предыдущей точки
				//потому что перемнные типа var видны снаружи блока {}
				let color;

				function getColor() {

					if (mesh.userData.player.palette)
						color = mesh.userData.player.palette.toColor(value, min, max);
					else if (options.palette)
						color = options.palette.toColor(value, min, max);
					else {

						const c = { r: 255, g: 255, b: 255 };
						color = new THREE.Color("rgb(" + c.r + ", " + c.g + ", " + c.b + ")");
						return color;

					}

				}

				if (typeof funcs.w === "function") {

					var value = funcs.w(t, a, b);
					if (options.scales.w) {

						min = options.scales.w.min;
						max = options.scales.w.max;

					} else {

						console.warn('Player.selectMeshPlayScene: Кажется эти экстремумы заданы неверно');
						min = 0;
						max = 100;

					}
					if (attributes.position.itemSize >= 4)
						attributes.position.setW(i, value);
					needsUpdate = true;

					getColor();

				} else if (typeof funcs.w === "object") {

					if (funcs.w instanceof THREE.Color)
						color = funcs.w;
					else {

						var value = Player.execFunc(funcs, 'w', t, options);
						if (funcs.w.min !== undefined) min = funcs.w.min;
						if (funcs.w.max !== undefined) max = funcs.w.max;
						getColor();

					}

				}
				color = setColorAttibute(
					funcs.w === undefined ?
						new THREE.Vector4().w :
						typeof funcs.w === "number" ? funcs.w : Player.execFunc(funcs, 'w', t, options),
					mesh, i, color);
				if (needsUpdate)
					attributes.position.needsUpdate = true;

				if (funcs.trace && !funcs.line) {

					funcs.line = new Player.traceLine(options);
					funcs.trace = false;

				}
				if (funcs.line && funcs.line.addPoint)
					funcs.line.addPoint(mesh, i, color);
				if (funcs.cameraTarget && (funcs.cameraTarget.boLook === true))
					options.playerOptions.cameraTarget.changeTarget(mesh, i, options);

			}

		}

	}
	setAttributes( options ? options.a : 1, options ? options.b : 0 );
	const message = 'Player.selectMeshPlayScene: invalid mesh.scale.';
	if ( mesh.scale.x <= 0 ) console.error( message + 'x = ' + mesh.scale.x );
	if ( mesh.scale.y <= 0 ) console.error( message + 'y = ' + mesh.scale.y );
	if ( mesh.scale.z <= 0 ) console.error( message + 'z = ' + mesh.scale.z );

	function setColorAttibute( value, mesh, index , color ){

		if ( 
			//не менять цвет точки если позиция состоит из 3 значений
			//такая ситуация имеется в геометрических фигурах. Например в кубе
			( mesh.geometry.attributes.position.itemSize < 4 )// ||
			//( options.scales.w.isColor === false )//цвет точки не зависит от координаты w точки
		) return;

		if ( options.palette )
			color = options.palette.toColor( value, options.scales.w.min, options.scales.w.max );
		if (!color) return;
		const attributes = mesh.geometry.attributes, arrayFuncs = mesh.userData.player.arrayFuncs;
		if ( !Player.setColorAttribute( attributes, index, color ) && arrayFuncs[index] instanceof THREE.Vector4 ) {

			if ( mesh.userData.player && arrayFuncs ) {

				mesh.geometry.setAttribute( 'color',
					new THREE.Float32BufferAttribute( Player.getColors( arrayFuncs,
						{

							positions: attributes.position,
							options: options,

						} ), 4 ) );
				if ( !Player.setColorAttribute( attributes, index, color ) )
					console.error( 'Player.selectMeshPlayScene: the color attribute is not exists. Please use THREE.Vector3 instead THREE.Vector4 in the arrayFuncs or add "color" attribute' );

			} else console.error( 'Player.selectMeshPlayScene: set color attribute failed. Invalid mesh.userData.player.arrayFuncs' );

		}
		return color;

	}

	if ( mesh.userData.player && mesh.userData.player.arrayFuncs && mesh.userData.player.arrayFuncs instanceof Array )
		mesh.userData.player.arrayFuncs.forEach( function ( func, index ) {

			if ( func.controllers ) {

				//Localization

				if ( !lang ) {
					lang = {


						controllerXTitle: 'X position',
						controllerYTitle: 'Y position',
						controllerZTitle: 'Z position',
						controllerWTitle: 'color index',

						controllerWorld: 'World',

						controllerXWorldTitle: 'X world position',
						controllerYWorldTitle: 'Y world position',
						controllerZWorldTitle: 'Z world position',
						controllerWWorldTitle: 'color index',

						controllerXFunctionTitle: 'X = f(t)',
						controllerYFunctionTitle: 'Y = f(t)',
						controllerZFunctionTitle: 'Z = f(t)',
						controllerWFunctionTitle: 'W = f(t)',

						positionAlert: 'Invalid position fromat: ',

					};
					switch ( options.getLanguageCode() ) {

						case 'ru'://Russian language

							lang.controllerXTitle = 'Позиция X';
							lang.controllerYTitle = 'Позиция Y';
							lang.controllerZTitle = 'Позиция Z';
							lang.controllerWTitle = 'Индекс цвета';

							lang.controllerWorld = 'Абсолютный';

							lang.controllerXWorldTitle = 'Абсолютная позиция X';
							lang.controllerYWorldTitle = 'Абсолютная позиция Y';
							lang.controllerZWorldTitle = 'Абсолютная позиция Z';
							lang.controllerWWorldTitle = 'Индекс цвета';


							lang.positionAlert = 'Неправильный формат позиции точки: ';

							break;
						default://Custom language
							if ( ( options.lang === undefined ) || ( options.lang.languageCode != languageCode ) )
								break;

							Object.keys( options.lang ).forEach( function ( key ) {

								if ( lang[key] === undefined )
									return;
								lang[key] = options.lang[key];

							} );

					}

				}

				const positionLocal = getObjectLocalPosition( mesh, index );
				function setPosition( value, axisName ) {

					const axesId = axisName === 'x' ? 0 : axisName === 'y' ? 1 : axisName === 'z' ? 2 : axisName === 'w' ? 3 : undefined;
					if ( axisName === 'w' ){

						setColorAttibute( value, mesh, index );
						if ( options.guiSelectPoint )
							options.guiSelectPoint.update();

					}

					const indexValue = axesId + mesh.geometry.attributes.position.itemSize * index,
						valueOld = mesh.geometry.attributes.position.array[ indexValue ];
					mesh.geometry.attributes.position.array[ indexValue ] = value;
					const axisControllers = func.controllers[axisName];
					if ( isNaN( mesh.geometry.attributes.position.array[ indexValue ] ) ) {

						alert( lang.positionAlert + value );
						const controller = axisControllers.position.controller;
						controller.focus();
						controller.value = valueOld;
						mesh.geometry.attributes.position.array[ indexValue ] = valueOld;
						return;
						
					}
					mesh.geometry.attributes.position.needsUpdate = true;
					if ( options.axesHelper )
						options.axesHelper.updateAxes();
					if ( options.guiSelectPoint )
						options.guiSelectPoint.update();
					if ( axisControllers.worldPosition && axisControllers.worldPosition.controller ) {

						const controller = axisControllers.worldPosition.controller;
						
						controller.innerHTML = getObjectPosition( mesh, index )[axisName];

					}

				}
				function createControllers( axisName ) {

					var axisControllers = func.controllers[axisName];
					if ( axisControllers === false ) return;
					const position = 'position';
					//если Controllers для текущей оси не определен а на веб странице есть Controllers для этой оси
					//то нужно создать axisControllers
					if ( !axisControllers && ( ids[axisName].func.elController || ids[axisName].position.elController || ids[axisName].worldPosition.elController ) ) {

						axisControllers = {};
						func.controllers[axisName] = axisControllers;

					}
					if ( !axisControllers ) return;
					//добавляем в axisControllers те Controllers, которые есть на веб странице для текущей оси
					function addKey( keyName ) {

						if ( !ids[axisName][keyName].elController ) return;
						if ( !axisControllers[keyName] ) {

							if ( !ids[axisName][keyName].boUsed ) {

								axisControllers[keyName] = {

									controller: ids[axisName][keyName].elController,
									elName: ids[axisName][keyName].elName ? ids[axisName][keyName].elName : false,

								}
								ids[axisName][keyName].boUsed = true;
								if ( ( keyName === position ) && ( axisName === 'w' ) )
									axisControllers[keyName].elSlider = true;

							} else console.warn( 'Player.selectMeshPlayScene createControllers: Same controller is using for different points. Controller ID is "' + ids[axisName][keyName].controllerId + '""' );

						}

					}
					addKey( 'func' );
					addKey( position );
					addKey( 'worldPosition' );

					createController( axisControllers.func, ids[axisName].func.controllerId, function () { return options.scales[axisName].name + ' = f(t)'; }, {

						value: func[axisName],
						title: axisName === 'x' ? lang.controllerXFunctionTitle : axisName === 'y' ? lang.controllerYFunctionTitle : axisName === 'z' ? lang.controllerZFunctionTitle : axisName === 'w' ? lang.controllerWFunctionTitle : '',
						onchange: function ( event ) {

							try {

								func[axisName] = event.currentTarget.value;
								const value = Player.execFunc( func, axisName, options.player.getTime(), options );
								if ( axisControllers.position && axisControllers.position.controller ) {

									const controller = axisControllers.position.controller;
									controller.onchange( { currentTarget: { value: value } } );
									controller.value = value;

								} else
									setPosition( value, axisName );
								if ( options.guiSelectPoint )
									options.guiSelectPoint.update();

							} catch ( e ) {

								alert( 'Axis: ' + options.scales[axisName].name + '. Function: "' + func[axisName] + '". ' + e );
								event.currentTarget.focus();

							}

						},

					} );

					//position
					createController( axisControllers.position, axisName + 'Position', function () { return options.scales[axisName].name; }, {

						value: positionLocal[axisName],
						title: axisName === 'x' ? lang.controllerXTitle : axisName === 'y' ? lang.controllerYTitle : axisName === 'z' ? lang.controllerZTitle : axisName === 'w' ? lang.controllerWTitle : '',
						onchange: function ( event ) { setPosition( event.currentTarget.value, axisName ); },
						axisName: axisName,

					} );

					//World position
					createController( axisControllers.worldPosition, axisName + 'WorldPosition', function () { return lang.controllerWorld + ' ' + options.scales[axisName].name; }, {

						value: getWorldPosition( mesh, positionLocal )[axisName],
						title: axisName === 'x' ? lang.controllerXWorldTitle : axisName === 'y' ? lang.controllerYWorldTitle : axisName === 'z' ? lang.controllerZWorldTitle : axisName === 'w' ? lang.controllerWTitle : '',

					} );

				}

				//point name
				if ( func.name ) {

					if ( !func.controllers.pointName ) func.controllers.pointName = 'pointName';
					const elPointName = typeof func.controllers.pointName === "string" ? document.getElementById( func.controllers.pointName ) : func.controllers.pointName ;
					if ( elPointName ) elPointName.innerHTML = func.name;

				}

				createControllers( 'x' );
				createControllers( 'y' );
				createControllers( 'z' );
				createControllers( 'w' );

			}

		} );

	if ( !options || !options.guiSelectPoint ) {

		if ( options.axesHelper ) options.axesHelper.movePosition();
		return;

	}

	options.guiSelectPoint.setMesh();

	var selectedPointIndex = options.guiSelectPoint.getSelectedPointIndex();
	if ( ( selectedPointIndex !== -1 ) && options.guiSelectPoint.isSelectedMesh( mesh ) ) {

		options.guiSelectPoint.setPosition( {

			object: mesh,
			index: selectedPointIndex,

		} );

	}

}

/** @namespace
 * @description set color attribute
 * @param {Object} attributes [geometry.attributes]{@link https://threejs.org/docs/index.html?q=geometry#api/en/core/BufferGeometry.attributes} of the mesh
 * @param {number} i index of the color in the color attribute array.
 * @param {THREE.Color} color color.
 * @returns true - success
 * <p>false - colorAttribute was not detected.</p>
 */
Player.setColorAttribute = function ( attributes, i, color ) {

	if ( typeof color === "string" )
		color = new THREE.Color( color );
	const colorAttribute = attributes.color;// || attributes.ca;
	if ( colorAttribute === undefined )
		return false;
	colorAttribute.setX( i, color.r );
	colorAttribute.setY( i, color.g );
	colorAttribute.setZ( i, color.b );
	colorAttribute.needsUpdate = true;
	return true;

}

/** @namespace
 * @description Get array of THREE.Vector4 points.
 * @param {THREE.Vector4|THREE.Vector3|THREE.Vector2|object|array} arrayFuncs <b>points.geometry.attributes.position</b> array
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
 * <b>Vector.w</b> is index of the [palette]{@link https://github.com/anhr/commonNodeJS/tree/master/colorpicker}.
 * Default range of the <b>Vector.w</b> is from 0 to 1. You can change range by use an object:
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
 * <b>Vector.w</b> can be as [THREE.Color]{@link https://threejs.org/docs/index.html?q=colo#api/en/math/Color}. Example: new THREE.Color( "rgb(255, 127, 0)" )
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
 *      [distanceToCamera]: <b>THREE.Vector3</b>. Distance from point to camera.
 *         You can set the distance to the camera depending on the time.
 *         Example 1: new THREE.Vector3( 0, 0, new Function( 't', 'return 2+t' ) )
 *         Example 2: new THREE.Vector3( 0, 0, [{ t: 0, v: 5 }, { t: 1, v: 2 }, { t: 10, v: 2 }, { t: 11, v: 5 }] )
 *         Default is camera.position.
 *      [orbitControls]: [OrbitControls]{@link https://threejs.org/docs/index.html#examples/en/controls/OrbitControls}. Change the <b>OrbitControl</b> setting during playing.
 *      [orbitControlsGui]: <a href="../../OrbitControls/jsdoc/index.html" target="_blank">OrbitControlsGui</a> instance;
 *
 *   },
 *   //Use controls on the web page for display and edit of the point values.
 *   [controllers]: {
 *   
 *      pointName: HTML element or id of element for point name
 *      
 *      //axisName is "x" or "y" or "z" or "w"
 *      [axisName]: {
 *
 *         //Function text controller
 *         func: {
 *         
 *            controller: HTMLElement - <b>input</b> element of function text
 *               or string - id of the <b>input</b> element. Default id is "[axisName]Func". Example: "xFunc".
 *            elName: HTMLElement - <b>span</b> element of the function name
 *               or string - id of the <b>span</b> element. Default id is "[axisName]FuncName". Example: "xFuncName".
 *               or false - name element is not exists.
 *
 *         }
 *
 *         //Point position controller
 *         position: {
 *
 *            controller: HTMLElement - <b>input</b> element of the point position
 *               or string - id of the <b>input</b> element. Default id is "[axisName]Position". Example: "xPosition".
 *            elName: HTMLElement - <b>span</b> element of the point position name
 *               or string - id of the <b>span</b> element. Default id is "[axisName]PositionName". Example: "xPositionName".
 *               or false - name element is not exists.
 *
 *         }
 *
 *         //World point position controller.
 *         worldPosition: {
 *
 *            controller: HTMLElement - <b>input</b> element of the world point position
 *               or string - id of the <b>input</b> element. Default id is "[axisName]WorldPosition". Example: "xWorldPosition".
 *            elName: HTMLElement - <b>span</b> element of the world point position name
 *               or string - id of the <b>span</b> element. Default id is "[axisName]WorldPositionName". Example: "xWorldPositionName".
 *               or false - name element is not exists.
 *
 *         }
 *
 *      }
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
 * Use only if you want trace lines during playing. See <b>trace</b> of the <b>arrayFuncs</b> param above.
 * @param {number} [optionsPoints.t=0] first parameter of the <b>arrayFuncs</b> item function. Start time of animation.
 * @param {object} [optionsPoints.options] the following options are available
 * @param {number} [optionsPoints.options.a=1] multiplier. Second parameter of the <b>arrayFuncs</b> item function.
 * @param {number} [optionsPoints.options.b=0] addendum. Third parameter of the <b>arrayFuncs</b> item function.
 * @param {object} [optionsPoints.options.playerOptions] See <b>settings.options.playerOptions</b> parameter of the <a href="../../player/jsdoc/module-Player-Player.html" target="_blank">Player</a> class.
 * @returns array of <b>THREE.Vector4</b> points.
 */
Player.getPoints = function ( arrayFuncs, optionsPoints ) {

	assign();
	
	if ( !Array.isArray( arrayFuncs ) ) arrayFuncs = [ arrayFuncs ];
	
	optionsPoints = optionsPoints || {};
	if ( optionsPoints.t === undefined ) optionsPoints.t = optionsPoints.options && optionsPoints.options.player ? optionsPoints.options.player.getSettings().options.playerOptions.min : 0;
	const options = optionsPoints.options || new Options(),
		optionsDefault = new Options( { palette: options.palette } );
	options.setW( optionsDefault );
	const wDefault = optionsDefault.scales.w.max;//new THREE.Vector4().w;//1;//цвет точки по умолчанию равен цвету палитры для максимального значения value,
						//которе по умолчанияю равно 1 и определяется в Options class.
						//Палитра по умолчанию ColorPicker.paletteIndexes.BGYW
						//у которой цвет максимального значения value белый.
	for ( var i = 0; i < arrayFuncs.length; i++ ) {

		var item = arrayFuncs[i];
		if ( Array.isArray( item ) )
			arrayFuncs[i] = new THREE.Vector4(

				item[0] === undefined ? 0 : item[0],
				item[1] === undefined ? 0 : item[1],
				item[2] === undefined ? 0 : item[2],
				item[3] === undefined ? wDefault : item[3]

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
				else if ( item.vector.length < 3 )

					arrayFuncs[i].vector = new THREE.Vector4(

						item.vector[0] === undefined ? 0 : item.vector[0],
						item.vector[1] === undefined ? 0 : item.vector[1],

					);
				else console.error( 'Player.getPoints(...) falied! item.vector.length = ' + item.vector.length );

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

				const value = Player.execFunc( funcs, axisName, optionsPoints.t, options );
				return value;

			}
			if ( funcs.vector === undefined ) {

				console.error( 'Player.getAxis().getPoints(): funcs.vector = ' + funcs.vector );
				return;

			}
			if ( funcs.name !== undefined )
				funcs.vector.name = funcs.name;

			if ( funcs.trace ) funcs.vector.trace = funcs.trace;
			if ( funcs.controllers ) funcs.vector.controllers = funcs.controllers;
			if ( funcs.cameraTarget ) {

				funcs.vector.cameraTarget = funcs.cameraTarget;
				delete funcs.cameraTarget;

			}
			arrayFuncs[i] = funcs.vector;
			funcs = funcs.vector;
			return Player.execFunc( funcs, axisName, optionsPoints.t, options );


		}
		const point = funcs.vector instanceof THREE.Vector3 === true ?
			new THREE.Vector3( getAxis( 'x' ), getAxis( 'y' ), getAxis( 'z' ) ) :
			new THREE.Vector4( getAxis( 'x' ), getAxis( 'y' ), getAxis( 'z' ), getAxis( 'w' ) );

		if ( funcs.cameraTarget ) {

			funcs.cameraTarget.bodefault = false;
			if ( funcs.cameraTarget.boLook === undefined ) funcs.cameraTarget.boLook = true;

			options.playerOptions.cameraTarget.init( funcs.cameraTarget, options );

		}
		points.push( point );

	}
	return points;

}
var boColorWarning = true;
/** @namespace
 * @description Get array of mesh colors.
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
 * Default range of the Vector.w is from 0 to 1. You can change range by use an object:
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
 * @param {object} [optionsColor.options] See the <b>options</b> parameter of the <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
 * @param {THREE.BufferAttribute} [optionsColor.positions] geometry.attributes.position of the new mesh.
 * @param {array} [optionsColor.colors=[]] array for mesh colors.
 * @param {array} [optionsColor.opacity] array of opacities of each geometry position. Each item of array is float value in the range of 0.0 - 1.0 indicating how transparent the material is. A value of 0.0 indicates fully transparent, 1.0 is fully opaque.
 * @returns array of mesh colors.
 */
Player.getColors = function ( arrayFuncs, optionsColor ) {

	assign();
	
	if ( !Array.isArray( arrayFuncs ) ) arrayFuncs = [ arrayFuncs ];

	optionsColor = optionsColor || {};
	optionsColor.options = optionsColor.options || {};
	
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
	const colors = [];
	if ( !optionsColor.options.palette )
		optionsColor.options.setPalette();

	for ( var i = 0; i < length; i++ ) {

		const iColor = 3 * i;
		if (iColor >= optionsColor.colors.length) {
			
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
	
				} else {
	
					optionsColor.options.setW();
					min = optionsColor.options.scales.w.min; max = optionsColor.options.scales.w.max;
	
				}
				if ( w instanceof Function && !optionsColor.options.player && boColorWarning ) {
	
					boColorWarning = false;
					
				}
				const t = optionsColor.options.playerOptions ? optionsColor.options.playerOptions.min : 0;
				var color = optionsColor.options.palette.toColor(
					funcs === undefined ?
						new THREE.Vector4().fromBufferAttribute( optionsColor.positions, i ).w :
						w instanceof Function ?
							w( t ) :
							typeof w === "string" ?
								Player.execFunc( funcs, 'w', t, optionsColor.options ) :
								w === undefined ? new THREE.Vector4().w : w,
					min, max );
				colors.push( color.r, color.g, color.b );
	
			} else if ( optionsColor.colors instanceof THREE.Float32BufferAttribute )
				vector = new THREE.Vector3( 1, 1, 1 );
			else if (optionsColor.color != undefined) {

				const color = new THREE.Color(optionsColor.color);
				colors.push( color.r, color.g, color.b );//white
				
			} else colors.push( 1, 1, 1 );//white

		}
		else colors.push( optionsColor.colors[iColor], optionsColor.colors[iColor + 1], optionsColor.colors[iColor + 2] );

		//opacity
		if ( optionsColor.opacity instanceof Array )
			colors.push( i < optionsColor.opacity.length ? optionsColor.opacity[i] : 1 );
		else colors.push( 1 );

	}
	optionsColor.colors = colors;
	return optionsColor.colors;

}

/** @class */
Player.traceLine = class traceLine
{

	/**
	 * trace line of moving of the point during playing
	 * @param {object} options the following options are available
	 * @param {object} options.player See <a href="../../player/jsdoc/module-Player.html" target="_blank">Player</a>.
	 */
	constructor( options ) {

		var line;
		const arrayLines = [];//сюда добавляются линии когда max: Infinity,

		assign();

		if ( !options.player ) {

			return;

		}
		/**
		 * Is trace line visible?
		 * @returns true - trace line is visible.
		 * <p>false - trace line is not visible.</p>
		 */
		this.isVisible = function () {

			if ( !options.player )
				return false;//не запущен Player(...)

			if ( line ) return line.visible;
			if ( arrayLines.length === 0 ) return false;
			//сюда попадает когда t max is Infinity ( options.playerOptions.max === null ) и когда пользователь выбрал точку в guiSelectPoint у которой установлена трассировка
			return arrayLines[0].visible;

		}
		/**
		 * Show or hide trace line.
		 * @param {boolean} visible true - show trace line.
		 * <p>false - hide trace line.</p>
		 */
		this.visible = function ( visible ) {

			if ( !options.player )
				return false;//не запущен Player(...)

			if ( line ) {

				line.visible = visible;
				return;

			}
			//сюда попадает когда t max is Infinity (options.playerOptions.max === null) и когда пользователь в выбранной в guiSelectPoint  точке изменил галочку трассировки
			arrayLines.forEach( function ( line ) {

				line.visible = visible;

			} );

		}

		/**
		 * add point into trace line.
		 * @param {THREE.Mesh} mesh. See [Mech]{@link https://threejs.org/docs/index.html#api/en/objects/Mesh} for tracing.
		 * @param {number} index of the point for tracing.
		 * @param {THREE.Color} color. Line color. See [Color]{@link https://threejs.org/docs/index.html#api/en/math/Color}.
		 */
		this.addPoint = function ( mesh, index, color ) {

			const attributesPosition = mesh.geometry.attributes.position;
			var point = attributesPosition.itemSize >= 4 ? new THREE.Vector4( 0, 0, 0, 0 ) : new THREE.Vector3();
			point.fromArray( attributesPosition.array, index * attributesPosition.itemSize );

			//нельзя ставить const потому что привыполнении npm run build будет ошибка
			// (babel plugin) SyntaxError: D:/My documents/MyProjects/webgl/three.js/GitHub/commonNodeJS/master/player/player.js: "sceneIndex" is read-only
			var sceneIndex = options.player ? options.player.getSelectSceneIndex() : 0;

			if ( options.playerOptions.max === null ) {

				//Infinity play
				
				sceneIndex = Math.abs( sceneIndex );
				if ( sceneIndex < ( arrayLines.length - 1 ) ) {

					while ( sceneIndex < ( arrayLines.length - 1 ) ) {

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

				const line = new THREE.Line( geometry, new THREE.LineBasicMaterial( { vertexColors: true } ) );
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
					new THREE.Vector3().fromArray( arrayLines[arrayLines.length - 1].geometry.attributes.position.array, 1 * itemSize );
				point0.toArray( line.geometry.attributes.position.array, 0 * itemSize );
				line.geometry.attributes.position.needsUpdate = true;

				//point color
				if ( color === undefined )
					color = new THREE.Color( 1, 1, 1 );//White
				Player.setColorAttribute( line.geometry.attributes, 0, arrayLines.length === 0 ? color :
					new THREE.Color().fromArray( arrayLines[arrayLines.length - 1].geometry.attributes.color.array, 1 * itemSize ) );
				Player.setColorAttribute( line.geometry.attributes, 1, color );

				arrayLines.push( line );

				return;

			}
			if ( line === undefined ) {

				// geometry
				const geometry = new THREE.BufferGeometry();

				//Thanks to https://stackoverflow.com/questions/31399856/drawing-a-line-with-three-js-dynamically/31411794#31411794
				var MAX_POINTS;
				if ( options.playerOptions.max !== null ) {

					if ( options.playerOptions && options.playerOptions.marks )
						MAX_POINTS = options.playerOptions.marks;
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

				line = new THREE.Line( geometry, new THREE.LineBasicMaterial( {
					
					//неудачная попытка исправить frustumPoints после перехода на THREE.REVISION = "145dev"
					vertexColors: true,

					//THREE.Material: 'vertexColors' parameter is undefined.
					//vertexColors: THREE.VertexColors
				
				} ) );
				line.visible = true;
				mesh.add( line );

			}
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
		 * Remove trace line.
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

}

/** @namespace
 * @description get item size of the attribute of the mesh geometry
 * @param {array} arrayFuncs points.geometry.attributes.position array.
 * See arrayFuncs parametr of the <a href="../../player/jsdoc/module-Player-Player.getPoints.html" target="_blank">Player.getPoints(...)</a> for details.
 */
Player.getItemSize = function ( arrayFuncs ) {

	assign();

	for ( var i = 0; i < arrayFuncs.length; i++ ) {

		var func = arrayFuncs[i];
		if ( func instanceof THREE.Vector4 )
			return 4;

	}
	return 3;

}
/** @namespace
 * @description Select a scene for playing
 * @param {THREE.Group} group [THREE.Group]{@link https://threejs.org/docs/index.html#api/en/objects/Group}
 * @param {Object} [settings={}] the following settings are available.
 * @param {number} [settings.t=0] time
 * @param {number} [settings.index] index of the time.
 * @param {Object} [settings.options={}] See the <b>options</b> parameter of the <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
 */
Player.selectPlayScene = function ( group, settings = {} ) {

	const t = settings.t !== undefined ? settings.t : 0,
		index = settings.index !== undefined ? settings.index : undefined,
		options = settings.options || new Options();
	group.userData.index = index;
	group.userData.t = t;
	if (typeof options.player === "object") options.player.endSelect = () => {
		
		Player.selectMeshPlayScene( group, { t: t, options: options } );
		function selectMeshPlayScene( group ) {
	
			group.children.forEach( function ( mesh ) {
	
				if ( mesh instanceof THREE.Group ) selectMeshPlayScene( mesh );
				else Player.selectMeshPlayScene( mesh, { t: t, options: options } );
	
			} );
	
		}
		selectMeshPlayScene( group );
		options.playerOptions.cameraTarget.setCameraTarget( options );
		const cameraTarget = options.playerOptions.cameraTarget.get();
	
		//если index === undefined значит пользователь нажал кнопку 'Default' для восстановления положения камеры.
		//Значит надо вызвать camera.userData.default.setDefault()
		//
		//если index !== undefined значит проигрыватель вызывает очередной кадр и не нужно перемещать камеру в исходное положение
		//приуслвии что не выбрана ни одна точка как cameraTarget
		if ( cameraTarget && cameraTarget.setCameraPosition ) cameraTarget.setCameraPosition( index === undefined );
		
	}
	if ( !group.userData.endSelect && (typeof options.player === "object")) options.player.endSelect();

}
var THREE;
/* * @namespace
 * @description assign some THREE methods
 */
function assign( ) {

	if ( !three.isThree() ) {

		console.warn( 'Player: can not assign. Set THREE first.' )
		return;

	}
	THREE = three.THREE;
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
//assign();
/**
 * @namespace
 * @description assign some THREE methods
 * */
Player.assign = function () { assign(); }

export default Player;
