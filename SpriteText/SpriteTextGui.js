/**
 * @module SpriteTextGui
 * @description Adds SpriteText settings folder into {@link https://github.com/anhr/dat.gui|dat.gui}.
 * @see {@link https://github.com/anhr/SpriteText|SpriteText}
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

import { ScaleControllers } from '../ScaleController.js';//https://github.com/anhr/commonNodeJS
//import { ScaleControllers } from 'https://raw.githack.com/anhr/commonNodeJS/master/ScaleController.js';

import three from '../three.js'
import Options from '../Options.js'

import { SpriteText } from './SpriteText.js';
//import { SpriteText } from 'https://raw.githack.com/anhr/commonNodeJS/master/SpriteText/SpriteText.js';

//Каждый экземляр SpriteTextGui должен иметь униканое cookieName.
//Иначе если пользователь сделает какое то изменеие в SpriteTextGui, то это изменеие отразится 
//в других экземлярах SpriteTextGui после перезанрузки веб страницы. В частности могут появиться ненужные органы управления
var _spriteTextGuiCount = 0;

/**
 * Adds SpriteText settings folder into dat.gui.
 * @param {THREE.Group|THREE.Scene|THREE.Sprite} group [THREE.Group]{@link https://threejs.org/docs/index.html?q=group#api/en/objects/Group} or [THREE.Scene]{@link https://threejs.org/docs/index.html?q=sce#api/en/scenes/Scene} of the <b>SpriteText</b> and of all child groups of the <b>SpriteText</b> for which these settings will have an effect.
 * Or Sprite returned from <a href="../../AxesHelper/jsdoc/index.html" target="_blank">new SpriteText(...)</a>.
 *
 * @param {Options} [options] See the <b>options</b> parameter of the <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
 * @param {object} [options.dat] use dat-gui JavaScript Controller Library. [dat.gui]{@link https://github.com/dataarts/dat.gui}.
 * @param {GUI} [options.dat.dat] [dat.GUI()]{@link https://github.com/dataarts/dat.gui}.
 * @param {boolean} [options.dat.cookie] false - do not save to cookie all user settings
 * @param {string} [options.dat.cookieName] Name of the cookie.
 * @param {boolean} [options.dat.guiSelectPoint] false - do not displays <b>GuiSelectPoint</b>.
 * @param {Function} [options.getLanguageCode=language code of your browser] Your custom getLanguageCode() function.
 * <pre>
 * returns the "primary language" subtag of the language version of the browser.
 * Examples: "en" - English language, "ru" Russian.
 * See the "Syntax" paragraph of RFC 4646 {@link https://tools.ietf.org/html/rfc4646#section-2.1|rfc4646 2.1 Syntax} for details.
 * You can import { getLanguageCode } from '../../commonNodeJS/master/lang.js';
 * </pre>
 * @param {object} [guiParams={}] Followed parameters is allowed. Default is no parameters
 * @param {GUI} [guiParams.folder] <b>SpriteTextGui</b> folder. See {@link https://github.com/anhr/dat.gui|dat.gui} for details
 * @param {GUI} [guiParams.parentFolder] parent folder, returned by {@link https://github.com/dataarts/dat.gui/blob/master/API.md#GUI+addFolder|gui.addFolder(name)}
 * @param {string} [guiParams.optionsSpriteText] See <b>options</b> of <a href="module-SpriteText.html" target="_blank">SpriteText</a>. Default is <b>group.userData.optionsSpriteText</b> or no options
 * @param {string} [guiParams.spriteFolder] sprite folder name. Default is lang.spriteText
 * @param {string} [guiParams.settings] See <b>options.settings</b> of <a href="../../jsdoc/ScaleController/module-ScaleController-ScaleController.html" target="_blank">ScaleControllers</a> settings
 * @returns {GUI} sprite folder
 */
export function SpriteTextGui( group, options, guiParams = {} ) {

	options = new Options( options );
	const gui = guiParams.folder || options.dat.gui;
	if ( !gui || options.dat.spriteTextGui === false )
		return;
	const optionsSpriteText = guiParams.optionsSpriteText || group.userData.optionsSpriteText || {},
		THREE = three.THREE,
		dat = three.dat;//options.dat.dat;

	if ( Object.keys(optionsSpriteText).length === 0 ) console.warn( 'SpriteTextGui: optionsSpriteText is empty.' );
		
	if ( THREE.Color.NAMES[optionsSpriteText.fontColor] ) {

		const color = new THREE.Color( optionsSpriteText.fontColor );
		optionsSpriteText.fontColor = 'rgba(' + color.r * 255 + ',' + color.g * 255 + ',' + color.b * 255 + ',1)'

	}
	const optionsDefault = JSON.parse( JSON.stringify( optionsSpriteText ) );
	Object.freeze( optionsDefault );

	//Localization

	const lang = {

		spriteText: 'Sprite Text',
		spriteTextTitle: 'Settings for text that always faces towards the camera.',

		text: 'Text',
		textTitle: 'The text to be displayed on the sprite.',

		textHeight: 'Height',
		textHeightTitle: 'Text Height.',

		fontFace: 'Font Face',

		fontFaces: 'Font Faces',
		fontFaceTitle: 'Choose text font.',

		bold: 'Bold',

		italic: 'Italic',

		rotation: 'Rotation',
		rotationTitle: 'Sprite rotation',

		fontProperties: 'Font Properties',
		fontPropertiesTitle: 'Other font properties. The font property uses the same syntax as the CSS font property.',

		fontStyle: 'Font Style',
		fontStyleTitle: 'Text style being used when drawing text. Read only.',

		displayRect: 'Border',
		displayRectTitle: 'Display a border around the text.',
		borderColor: 'Border Color',
		backgroundColor: 'Background Color',
		borderRadius: 'Border Radius',
		borderThickness: 'Border Thickness',

		fontColor: 'Font Color',

		anchor: 'Anchor',
		anchorTitle: 'The text anchor point.',

		sizeAttenuation: 'Size Attenuation',
		sizeAttenuationTitle: 'Whether the size of the sprite is attenuated by the camera depth. (Perspective camera only.)',

		defaultButton: 'Default',
		defaultTitle: 'Restore default Sprite Text settings.',

	};
	switch ( options.getLanguageCode() ) {

		case 'ru'://Russian language

			lang.spriteText = 'Текстовый спрайт';//'Sprite Text'
			lang.spriteTextTitle = 'Настройки для текста, который всегда обращен к камере.';

			lang.text = 'Текст';
			lang.textTitle = 'Текст, который будет отображен в спрайте.';

			lang.textHeight = 'Высота';
			lang.textHeightTitle = 'Высота текста.';

			lang.fontFace = 'Имя шрифта';

			lang.fontFaces = 'Имена шрифтов';
			lang.fontFaceTitle = 'Выберите шрифта текста.';

			lang.bold = 'Жирный';

			lang.italic = 'Наклонный';

			lang.rotation = 'Вращение';
			lang.rotationTitle = 'Вращение текстового спрайта';

			lang.fontProperties = 'Дополнительно';
			lang.fontPropertiesTitle = 'Дополнительные свойства шрифта. Свойство шрифта использует тот же синтаксис, что и свойство шрифта CSS.';

			lang.fontStyle = 'Стиль шрифта';
			lang.fontStyleTitle = 'Стиль шрифта, используемый при рисовании текста. Не редактируется.';

			lang.displayRect = 'Рамка';
			lang.displayRectTitle = 'Отобразить рамку вокруг текста.';
			lang.borderColor = 'Цвет рамки';
			lang.backgroundColor = 'Цвет фона';
			lang.borderRadius = 'Зкругление углов';
			lang.borderThickness = 'Толщина рамки';

			lang.fontColor = 'Цвет шрифта';

			lang.anchor = 'Якорь';
			lang.anchorTitle = 'Точка привязки текста.';

			lang.sizeAttenuation = 'Размер';
			lang.sizeAttenuationTitle = 'Будет ли размер спрайта зависеть от расстояния до камеры. (Только перспективная камера.)';

			lang.defaultButton = 'Восстановить';
			lang.defaultTitle = 'Восстановить настройки текстового спрайта по умолчанию.';
			break;
		default://Custom language
			if ( ( guiParams.lang === undefined ) || ( guiParams.lang.languageCode != _languageCode ) )
				break;

			Object.keys( guiParams.lang ).forEach( function ( key ) {

				if ( lang[key] === undefined )
					return;
				lang[key] = guiParams.lang[key];

			} );

	}

	guiParams.spriteFolder = guiParams.spriteFolder || lang.spriteText;
	_spriteTextGuiCount++;
	const cookieName = options.dat.getCookieName( 'SpriteText' + _spriteTextGuiCount ),
		cookie = options.dat.cookie,
		optionsGroup = optionsSpriteText.group;
	cookie.getObject( cookieName, optionsSpriteText, optionsSpriteText );
	optionsSpriteText.group = optionsGroup;
	if ( group instanceof THREE.Sprite !== true ) {

		if ( group.userData.optionsSpriteText === undefined )
			group.userData.optionsSpriteText = optionsSpriteText;
		else if ( guiParams.optionsSpriteText !== undefined ) console.warn( 'SpriteTextGui: duplicate group.userData.optionsSpriteText' );

	}

	//updateSpriteText function is repeatedly called during restore settings to default values.
	//See fSpriteText.userData.restore() function for details.
	//I have set to false before restoring and set to true again and called function once after restoring for resolving of problem.
	var boUpdateSpriteText = true;
	function updateSpriteText( noSave ) {

		if ( !boUpdateSpriteText )
			return;
		SpriteText.updateSpriteTextGroup( group );
		if ( group.userData.update )
			group.userData.update();// optionsSpriteText );

		if ( controllerFont !== undefined )
			controllerFont.setValue( optionsSpriteText.font );

		if ( !noSave )
			cookie.setObject( cookieName, optionsSpriteText );

	}

	if ( !guiParams.hasOwnProperty( 'parentFolder' ) )
		guiParams.parentFolder = gui;

	//Sprite folder
	const fSpriteText = guiParams.parentFolder.addFolder( guiParams.spriteFolder );
	dat.folderNameAndTitle( fSpriteText, guiParams.spriteFolder, lang.spriteTextTitle );

	//Sprite text height
	const textHeight = 'textHeight';
	if ( optionsSpriteText.hasOwnProperty( textHeight ) && ( optionsSpriteText[textHeight] !== undefined ) ) {

		ScaleControllers( fSpriteText, optionsSpriteText, textHeight, function () { updateSpriteText(); }, {

			text: lang.textHeight, textTitle: lang.textHeightTitle,
			getLanguageCode: guiParams.getLanguageCode,
			settings: guiParams.settings,

		} );

	}

	//font  face
	if ( optionsSpriteText.fontFace !== undefined ) {

		dat.controllerNameAndTitle(
			fSpriteText.add( optionsSpriteText, 'fontFace' ).onChange( function ( value ) {

				updateSpriteText();

			} ), lang.fontFace );

	}

	//font faces
	if ( optionsSpriteText.fontFaces !== undefined ) {

		dat.controllerNameAndTitle(
			fSpriteText.add( optionsSpriteText, 'fontFace', optionsSpriteText.fontFaces ).onChange( function ( value ) {

				updateSpriteText();

			} ), lang.fontFaces, lang.fontFaceTitle );

	}

	//bold
	if ( optionsSpriteText.hasOwnProperty( 'bold' ) ) {

		dat.controllerNameAndTitle(
			fSpriteText.add( optionsSpriteText, 'bold' ).onChange( function ( value ) {

				updateSpriteText();

			} ), lang.bold );

	}

	//italic
	if ( optionsSpriteText.hasOwnProperty( 'italic' ) ) {

		dat.controllerNameAndTitle(
			fSpriteText.add( optionsSpriteText, 'italic' ).onChange( function ( value ) {

				updateSpriteText();

			} ), lang.italic );

	}

	//rotation
	const rotation = 'rotation';
	if ( optionsSpriteText.hasOwnProperty( rotation ) ) {

		var min = 0,
			max = Math.PI * 2;
		dat.controllerNameAndTitle(
			fSpriteText.add( optionsSpriteText, rotation, min, max, ( max - min ) / 360 ).onChange( function ( value ) {

				updateSpriteText();

			} ), lang.rotation, lang.rotationTitle );

	}

	//font properties
	if ( optionsSpriteText.hasOwnProperty( 'fontProperties' ) ) {

		dat.controllerNameAndTitle(
			fSpriteText.add( optionsSpriteText, 'fontProperties' ).onChange( function ( value ) {

				updateSpriteText();

			} ), lang.fontProperties, lang.fontPropertiesTitle );

	}

	//font style
	if ( optionsSpriteText.hasOwnProperty( 'font' ) ) {

		var controllerFont = fSpriteText.add( optionsSpriteText, 'font' );
		controllerFont.__input.readOnly = true;
		dat.controllerNameAndTitle( controllerFont, lang.fontStyle, lang.fontStyleTitle );

	}

	//text rectangle
	if ( optionsSpriteText.hasOwnProperty( 'rect' ) ) {

		if ( optionsSpriteText.rect.displayRect === undefined ) optionsSpriteText.rect.displayRect = false;
		dat.controllerNameAndTitle( fSpriteText.add( optionsSpriteText.rect, 'displayRect' ).onChange( function ( value ) {

			updateSpriteText();
			fRect.domElement.style.display = optionsSpriteText.rect.displayRect ? 'block' : 'none';

		} ), lang.displayRect, lang.displayRectTitle );
		const fRect = fSpriteText.addFolder( lang.displayRect );//'Border'
		fRect.domElement.style.display = optionsSpriteText.rect.displayRect ? 'block' : 'none';

		//border thickness
		const borderThickness = 'borderThickness';
		if ( optionsSpriteText.rect.hasOwnProperty( borderThickness ) ) {

			dat.controllerNameAndTitle(
				fRect.add( optionsSpriteText.rect, borderThickness, 1, optionsSpriteText.rect.borderThickness * 30, 1 ).onChange( function ( value ) {

					updateSpriteText();

				} ), lang.borderThickness );

		}

		//border сolor
		const borderColor = 'borderColor';
		if ( optionsSpriteText.rect.hasOwnProperty( borderColor ) ) {

			dat.controllerNameAndTitle( fRect.addColor( optionsSpriteText.rect, borderColor ).onChange( function ( value ) {

				updateSpriteText();

			} ), lang.borderColor );

		}

		//background color
		const backgroundColor = 'backgroundColor';
		if ( optionsSpriteText.rect.hasOwnProperty( backgroundColor ) ) {

			dat.controllerNameAndTitle( fRect.addColor( optionsSpriteText.rect, backgroundColor ).onChange( function ( value ) {

				updateSpriteText();

			} ), lang.backgroundColor );

		}

		//border radius
		const borderRadius = 'borderRadius';
		if ( optionsSpriteText.rect.hasOwnProperty( borderRadius ) ) {

			dat.controllerNameAndTitle(
				fRect.add( optionsSpriteText.rect, borderRadius, 0, 100, 1 ).onChange( function ( value ) {

					updateSpriteText();

				} ), lang.borderRadius );

		}

	}

	//font сolor
	if ( optionsSpriteText.hasOwnProperty( 'fontColor' ) ) {

		dat.controllerNameAndTitle( fSpriteText.addColor( optionsSpriteText, 'fontColor' ).onChange( function ( value ) {

			updateSpriteText();

		} ), lang.fontColor );

	}

	//anchor. https://threejs.org/docs/index.html#api/en/objects/Sprite.center
	if ( optionsSpriteText.hasOwnProperty( 'center' ) ) {

		optionsSpriteText.center = SpriteText.getCenter( optionsSpriteText.center );

		//anchor folder
		const fAnchor = fSpriteText.addFolder( 'center' );
		dat.folderNameAndTitle( fAnchor, lang.anchor, lang.anchorTitle );

		//anchor x
		fAnchor.add( optionsSpriteText.center, 'x', 0, 1, 0.1 ).onChange( function ( value ) {

			updateSpriteText();

		} );

		//anchor y
		fAnchor.add( optionsSpriteText.center, 'y', 0, 1, 0.1 ).onChange( function ( value ) {

			updateSpriteText();

		} );

	}

	//size attenuation. Whether the size of the sprite is attenuated by the camera depth. (Perspective camera only.) Default is false.
	//See https://threejs.org/docs/index.html#api/en/materials/SpriteMaterial.sizeAttenuation
	const sizeAttenuation = 'sizeAttenuation';
	if ( optionsSpriteText.hasOwnProperty( sizeAttenuation ) && ( optionsSpriteText[sizeAttenuation] !== undefined ) ) {

		dat.controllerNameAndTitle( fSpriteText.add( optionsSpriteText, sizeAttenuation ).onChange( function ( value ) {

			updateSpriteText();

		} ), lang.sizeAttenuation, lang.sizeAttenuationTitle );

	}

	//default button
	fSpriteText.userData = {

		options: options,
		restore: function ( value ) {

			boUpdateSpriteText = false;
			function setValues( folder, key, optionsDefault ) {

				folder.__controllers.forEach( function ( controller ) {

					if ( controller.property !== key ) {

						if ( typeof optionsDefault[key] !== "object" )
							return;
						Object.keys( optionsDefault[key] ).forEach( function ( optionKey ) {

							if ( controller.property !== optionKey )
								return;
							controller.setValue( optionsDefault[key][optionKey] );

						} );
						return;

					}
					controller.setValue( optionsDefault[key] );

				} );

			}

			Object.keys( optionsDefault ).forEach( function ( key ) {

				setValues( fSpriteText, key, optionsDefault );
				if ( typeof optionsDefault[key] === "object" ) {

					Object.keys( optionsDefault[key] ).forEach( function ( keyObject ) {

						Object.keys( fSpriteText.__folders ).forEach( function ( keyFolder ) {

							setValues( fSpriteText.__folders[keyFolder], keyObject, optionsDefault[key] );

						} );

					} );

				}

				Object.keys( fSpriteText.__folders ).forEach( function ( keyFolder ) {

					if ( keyFolder !== key )
						return;
					Object.keys( optionsDefault[keyFolder] ).forEach( function ( key ) {

						setValues( fSpriteText.__folders[keyFolder], key, optionsDefault[keyFolder] );

					} );

				} );

			} );

			boUpdateSpriteText = true;
			updateSpriteText();

		}

	}
	const defaultParams = { defaultF: fSpriteText.userData.restore, };
	if ( optionsDefault === undefined ) console.error( 'SpriteTextGui: optionsDefault = ' + optionsDefault );
	dat.controllerNameAndTitle( fSpriteText.add( defaultParams, 'defaultF' ), lang.defaultButton, lang.defaultTitle );

	updateSpriteText( true );

	return fSpriteText;

};
