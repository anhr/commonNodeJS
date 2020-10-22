/**
 * @module PlayController
 * @description PlayController class for using in my version of dat.gui(https://github.com/anhr/dat.gui) for playing of 3D objects in my projects.
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

//import { GUI, controllers } from 'D:/My documents/MyProjects/webgl/three.js/GitHub/dat.gui';
//Please download https://github.com/anhr/dat.gui/tree/CustomController to '../../dat.gui' folder
//import { GUI, controllers } from '../../dat.gui';
import { GUI, controllers } from '../dat.gui/CustomController/build/dat.gui.module.js';

//import { getLanguageCode } from '../../commonNodeJS/master/build/common.module.js';
import { getLanguageCode } from '../lang.js';
//import { getLanguageCode } from 'http://localhost/anhr/commonNodeJS/master/lang.js';

//Localization

export var lang = {

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
	fullScreen: 'Full Screen',
	nonFullScreen: 'Non Full Screen',
	stereoEffects: 'Stereo effects',
	mono: 'Mono',
	sideBySide: 'Side by side',
	topAndBottom: 'Top and bottom',

};

//try {
	//switch ( ( ( typeof THREE === 'undefined' ) || ( typeof THREE.getLanguageCode === 'undefined' ) ) ? 'en' : THREE.getLanguageCode() )
	switch ( getLanguageCode() ) {

		case 'ru'://Russian language
			lang.prevSymbolTitle = 'Кадр назад';//'Go to previous animation scene',
			lang.playTitle = 'Проиграть';//'Play'
			lang.nextSymbolTitle = 'Кадр вперед';//'Go to next animation scene';
			lang.pauseTitle = 'Пауза';//'Pause',
			lang.repeatOn = 'Повторять проигрывание';
			lang.repeatOff = 'Остановить повтор проигрывания';
			lang.controllerTitle = 'Текущее время.';
			lang.fullScreen = 'На весь экран';
			lang.nonFullScreen = 'Восстановить размеры экрана';
			lang.stereoEffects = 'Стерео эффекты';
			lang.mono = 'Моно';
			lang.sideBySide = 'Слева направо';
			lang.topAndBottom = 'Сверху вниз';

			break;

	}
//} catch ( e ) {}

function addButton( innerHTML, title, onclick ) {

	var button = document.createElement( 'span' );
	button.innerHTML = innerHTML;
	button.title = title;
	button.style.cursor = 'pointer';
	button.style.margin = '0px 2px';
	button.onclick = onclick;
	return button;

}

/**
 * PlayController class for using in my version of dat.gui(https://github.com/anhr/dat.gui) for playing of 3D objects in my projects.
 * 
 * @class PlayController
 *
 * @extends dat.controllers.CustomController
 *
 */
export class PlayController extends controllers.CustomController {

	/**
	 * PlayController class for using in my version of dat.gui(https://github.com/anhr/dat.gui) for animate of 3D objects in my projects.
	 * @param {object} player 3D objects animation. See [Player]{@link https://github.com/anhr/commonNodeJS/tree/master/player}
	 * @param {GUI} [gui] [new dat.GUI(...)]{@link https://github.com/anhr/dat.gui}. Folder for controller
	 */
	constructor( player, gui ) {

		var _getGroup, _selectScene, _renamePlayButtons, _renameRepeatButtons, _repeat;//,_playNext, timerId, _prev, _play, _next;
		var colorOff = 'rgb(255,255,255)', colorOn = 'rgb(128,128,128)';//'rgb(200,200,200)';
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
				buttons.buttonPlay = addButton( lang.playSymbol, lang.playTitle, player.play3DObject );

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
				_repeat = repeat;
				var title, color;
				if ( player.getOptions().repeat ) {

					title = lang.repeatOff;
					color = colorOff;

				} else {

					title = lang.repeatOn;
					color = colorOn;

				}
				buttons.buttonRepeat = addButton( lang.repeat, title, repeat );
				buttons.buttonRepeat.style.color = color;
				buttons.buttonNext = addButton( lang.nextSymbol, lang.nextSymbolTitle, player.next );
				function getGroup() {

					return group;

				}
				_getGroup = getGroup;

				return buttons;

			},

		}, 'playRate');//, 1, 25, 1 );
		player.PlayController = this;
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
		this.onChangeRepeat = function () {

			_renameRepeatButtons( player.getSettings().repeat );

		}
		player.pushController( this );
		this.onChange = function ( value ){

//			player.onChangeTimerId( value );
			player.setTime( value );

		}
		this.getGroup = function () {

			return _getGroup();

		}
		this.selectScene = function ( index ) {

			_selectScene( parseInt( index ) );

		}
		this.setValue = function ( value ) {

/*
			if ( this._controller.getValue() === value )
				return;//иначе переполнение стека
			this._controller.setValue( value );
*/			
			this._controller.domElement.childNodes[0].value = value;

		}

		const controler = gui.add( this );
		//что бы можно было вводить цифры после запятой
		controler.__truncationSuspended = true;

	}
	set controller( newController ) {

		this._controller = newController;
		var _this = this;
		this._controller.onChange( function ( value ) {

			_this.onChange( value );

		} );
		this._controller.domElement.title = lang.controllerTitle;

	}
	get controller() {

		return this._controller;

	}

}
export function create( player, gui ) {

	return new PlayController( player, gui );

}
