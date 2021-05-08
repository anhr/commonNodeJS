/**
 * FolderPoint
 *
 * GUI for changing point settings.
 *
 * @author Andrej Hristoliubov https://anhr.github.io/AboutMe/
 *
 * @copyright 2011 Data Arts Team, Google Creative Lab
 *
 * @license under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
*/

import { dat } from './dat/dat.module.js';
import PositionController from './PositionController.js';

/**
 * @callback setSize
 * @description Set size of the point
 * @param {number} value new size.
 * */

/**
 * GUI for changing point settings.
 * @param {GUI} folder parent folder. See [GUI]{@link https://github.com/anhr/dat.gui}.
 * @param {setSize} setSize Set size of the point
 * @param {Object} [settings={}] the following settings are available
 * @param {Object} [settings.point={}] point options.
 * @param {number} [settings.point.size=0.01] point size.
 * @param {Object} [settings.defaultPoint={}] default point options. Restore point options if user has clicked "Default" button
 * @param {number} [settings.defaultPoint.size=settings.point.size] point size.
 * @param {number} [settings.PCOptions={}] See options parameter of the <a href="../../jsdoc/PositionController/PositionController.html" target="_blank">PositionController</a>
 * @param {Object} [settings.PCOptions.min=0.01] Minimal offset.
 * @param {Object} [settings.PCOptions.max=1] Maximal offset.
 * @param {Object} [settings.PCOptions.step=0.01] step of offset.
 * @param {Object} [settings.PCOptions.settings={}] time settings.
 * @param {Object} [settings.PCOptions.settings.offset=0.1]
 * @param {Function} [settings.getLanguageCode="en"] Your custom getLanguageCode() function.
 * <pre>
 * returns the "primary language" subtag of the language version of the browser.
 * Examples: "en" - English language, "ru" Russian.
 * See the "Syntax" paragraph of RFC 4646 {@link https://tools.ietf.org/html/rfc4646#section-2.1|rfc4646 2.1 Syntax} for details.
 * Default returns the 'en' is English language.
 * You can import { getLanguageCode } from '../../commonNodeJS/master/lang.js';
 * </pre>
 */
class FolderPoint {

	constructor( folder, setSize, settings = {} ) {

		//Localization

		const lang = {

			pointSettings: 'Point',

			size: 'Size',
			sizeTitle: 'Size of the point with "ShaderMaterial" material',

			defaultButton: 'Default',
			defaultPointTitle: 'Restore point.',

		};

		switch ( settings.getLanguageCode ? settings.getLanguageCode() : 'en' ) {

			case 'ru'://Russian language
				lang.pointSettings = 'Точка';

				lang.size = 'Размер';
				lang.sizeTitle = 'Размер точки с материалом типа "ShaderMaterial"';

				lang.defaultButton = 'Восстановить';
				lang.defaultPointTitle = 'Восстановить точку';

				break;

		}

		const point = settings.point || {};
		if ( point.size === undefined ) point.size = 5;//0.01;

		const defaultPoint = settings.defaultPoint || {};
		if ( defaultPoint.size === undefined ) defaultPoint.size = point.size;

		const PCOptions = settings.PCOptions || {};

		if ( PCOptions.min === undefined ) PCOptions.min = 0.01;
		if ( PCOptions.max === undefined ) PCOptions.max = 1;
		PCOptions.settings = PCOptions.settings || {};
		if ( PCOptions.settings.offset === undefined ) PCOptions.settings.offset = 1;//0.1;
		if ( PCOptions.step === undefined ) PCOptions.step = 0.01;
		PCOptions.getLanguageCode = PCOptions.getLanguageCode || settings.getLanguageCode;

		var fPoint = folder.addFolder( lang.pointSettings ),
			fSize = fPoint.addFolder( lang.size );
		dat.folderNameAndTitle( fSize, lang.size, lang.sizeTitle );
		this.display = function ( display ) { fPoint.domElement.style.display = display; }

		fSize.add( new PositionController( function ( shift ) {

			setSize( point.size + shift );

		}, PCOptions//{ offset: 0.01, min: 0.01, max: 0.1, step: 0.01 }
		) );

		//size
		this.size = dat.controllerZeroStep( fSize, point, 'size', function ( value ) {

			setSize( value );

		} );
		dat.controllerNameAndTitle( this.size, lang.size, lang.sizeTitle );

		//point default button
		dat.controllerNameAndTitle( fPoint.add( {

			defaultF: function ( value ) {

				setSize( defaultPoint.size );

			},

		}, 'defaultF' ), lang.defaultButton, lang.defaultPointTitle );

	}

}
export default FolderPoint;