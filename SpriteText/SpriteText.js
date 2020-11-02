/**
 * @module SpriteText.
 * @description A sprite based text component. Text that always faces towards the camera.
 * @see {@link https://threejs.org/docs/index.html#api/en/objects/Sprite|THREE.Sprite}
 * 
 * @author Andrej Hristoliubov. {@link https://anhr.github.io/AboutMe/|AboutMe}
 *
 * @copyright 2011 Data Arts Team, Google Creative Lab
 *
 * @license under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
*/

//import * as THREE from 'https://threejs.org/build/three.module.js';
//import * as THREE from '../../three.js/dev/build/three.module.js';//https://github.com/anhr/three.js;
//import { THREE } from '../../commonNodeJS/master/three.js';//https://github.com/anhr/commonNodeJS
//import * as THREE from 'https://raw.githack.com/anhr/three.js/dev/build/three.module.js';
var THREE;

/**
 * A sprite based text component.
 * @param {string|number} text The text to be displayed on the sprite. You can include a multiline text separated by "\r\n".
 * @param {THREE.Vector3} [position] Position of the text. Default is new THREE.Vector3(0,0,0).
 * @param {object} [options] the following options are available
 * @param {THREE.Group} [options.group] Parent group of the SpriteText with common options.
 * See {@link https://github.com/anhr/SpriteText#groupuserdataoptionsspritetext---common-options-for-the-group-of-the-spritetext|common options for the group of the SpriteText}.
 * Default is undefined.
 * @param {number} [options.textHeight] The height of the text. Default is 0.04.
 * @param {number} [options.fov] Camera frustum vertical field of view, from bottom to top of view, in degrees.
 * {@link https://threejs.org/docs/index.html#api/en/cameras/PerspectiveCamera.fov|PerspectiveCamera.fov}
 * Set the fov option as camera.fov if you want to see text size is independent from camera.fov. The text height will be calculated as textHeight = fov * textHeight / 50
 * Default is undefined.
 * @param {boolean} [options.sizeAttenuation] Whether the size of the sprite is attenuated by the camera depth. (Perspective camera only.) Default is false.
 * See {@link https://threejs.org/docs/index.html#api/en/materials/SpriteMaterial.sizeAttenuation|SpriteMaterial.sizeAttenuation}
 * @param {number} [options.rotation] The rotation of the sprite in radians. Default is 0.
 * See {@link https://threejs.org/docs/index.html#api/en/materials/SpriteMaterial.rotation|SpriteMaterial.rotation}
 * @param {string} [options.fontFace] CSS font-family - specifies the font of the text. Default is 'Arial'.
 * @param {string[]} [options.fontFaces] array of fontFaces. Example ['Arial', 'Verdana', 'Times'].
 * @param {string} [options.fontColor] RGBA object or RGB object or HEX value. Default is 'rgba(255, 255, 255, 1)'.
 *	Examples 'rgba(0, 0, 255, 0.5)', '#00FF00'.
 * @param {boolean} [options.bold] CSS font-weight. Equivalent of 700. Default is false.
 * @param {boolean} [options.italic] CSS font-style. Default is false.
 * @param {string} [options.fontProperties] Other font properties. The font property uses the same syntax as the CSS font property.
 * 	Default is empty string. Example "900", "oblique lighter".
 * @param {THREE.Vector2} [options.center] The text's anchor point.
 * <pre>
 * See {@link https://threejs.org/docs/index.html#api/en/objects/Sprite.center|Sprite.center}
 * 	A value of (0.5, 0.5) corresponds to the midpoint of the text.
 * 	A value of (0, 0) corresponds to the left lower corner of the text.
 * 	A value of (0, 1) corresponds to the left upper corner of the text.
 * 	Default is (0, 1).
 * </pre>
 * @param {object} [options.rect] rectangle around the text.
 * @param {boolean} [options.rect.displayRect] true - the rectangle around the text is visible. Default is false.
 * @param {string} [options.rect.backgroundColor] background color. RGBA object or RGB object or HEX value
 * <pre>
 * 	Default is 'rgba(0, 0, 0, 0)' - black transparent.
 * 	Examples 'rgba(0, 0, 255, 0.5)', '#00FF00'.
 * </pre>
 * @param {string} [options.rect.borderColor] border color. RGBA object or RGB object or HEX value. Default is same as options.fontColor 'rgba(255, 255, 255, 1)' - white.
 * @param {number} [options.rect.borderThickness] border thickness. Default is 0 - invisible border.
 * @param {number} [options.rect.borderRadius] border corners radius. Default is 0 - no radius.
 * @see Thanks to {@link https://github.com/vasturiano/three-spritetext|three-spritetext}
 * @example
<script>

	import * as THREE from 'https://threejs.org/build/three.module.js';
	//import * as THREE from '../../three.js/dev/build/three.module.js';
	//import * as THREE from 'https://raw.githack.com/anhr/three.js/dev/build/three.module.js';

	import { SpriteText } from 'https://raw.githack.com/anhr/SpriteText/master/SpriteText.js';
	//import { SpriteText } from './SpriteText.js';

	SpriteText.setTHREE( THREE );

	// create scene etc
	...

	scene.add( new SpriteText( 'Sprite text', new THREE.Vector3( -10, -15, 2 ), { textHeight: 3 } ) );

</script>
 */
export function SpriteText( text, position, options ) {

	if ( typeof THREE === "undefined" ) {

		console.error( 'SpriteText: Please call SpriteText.setTHREE( THREE ) first.' );
		return;
		
	}
	position = position || new THREE.Vector3( 0, 0, 0 );
	options = options || {};

	const sprite = new THREE.Sprite( new THREE.SpriteMaterial( {

		map: new THREE.Texture(),
		sizeAttenuation: options.sizeAttenuation !== undefined ? options.sizeAttenuation :
			false,//The size of the sprite is not attenuated by the camera depth. (Perspective camera only.)

	} ) );
	const canvas = document.createElement( 'canvas' );
	sprite.material.map.minFilter = THREE.LinearFilter;
	const fontSize = 90;
	const context = canvas.getContext( '2d' );

	sprite.userData.update = function ( /*optionsUpdate*/ ) {

		const optionsUpdate = {};
		if ( sprite.parent )
			updateOptions( sprite.parent, optionsUpdate );
		else if ( options.group )
			updateOptions( options.group, optionsUpdate );
		var textHeight = options.textHeight || optionsUpdate.textHeight || 0.04;
		const fov = options.fov || optionsUpdate.fov,
			sizeAttenuation = options.sizeAttenuation || optionsUpdate.sizeAttenuation || false,
			rotation = options.rotation || optionsUpdate.rotation || 0,
			fontFace = options.fontFace || optionsUpdate.fontFace || 'Arial',
			bold = options.bold || optionsUpdate.bold || false,
			italic = options.italic || optionsUpdate.italic || false,
			fontProperties = options.fontProperties || optionsUpdate.fontProperties || '',
			rect = options.rect || optionsUpdate.rect || {},
			color = 'rgba(255, 255, 255, 1)',
			fontColor = options.fontColor || optionsUpdate.fontColor || color,
			center = SpriteText.getCenter( options.center || optionsUpdate.center );
			
		if ( fov !== undefined )
			textHeight = fov * textHeight / 50;

		rect.displayRect = rect.displayRect || false;
		const borderThickness = rect.borderThickness ? rect.borderThickness : 5,
			font = `${fontProperties}${bold ? 'bold ' : ''}${italic ? 'italic ' : ''}${fontSize}px ${fontFace}`;

		context.font = font;

		var width = 0, linesCount = 1,
			lines;
		if ( typeof text === 'string' ) {

			linesCount = 0;
			lines = text.split( /\r\n|\r|\n/ );
			lines.forEach( function ( line ) {

				var lineWidth = context.measureText( line ).width;
				if ( width < lineWidth )
					width = lineWidth;
				linesCount += 1;

			} );

		} else width = context.measureText( text ).width;

		width += borderThickness * 2;

		const textWidth = width;
		canvas.width = textWidth;
		canvas.height = fontSize * linesCount + borderThickness * 2;

		context.font = font;

		//Rect
		//Thanks to http://stemkoski.github.io/Three.js/Sprite-Text-Labels.html
		if ( rect.displayRect ) {

			// background color
			context.fillStyle = rect.backgroundColor ? rect.backgroundColor : 'rgba(0, 0, 0, 1)';

			// border color
			context.strokeStyle = rect.borderColor ? rect.borderColor : fontColor;

			context.lineWidth = borderThickness;

			// function for drawing rounded rectangles
			function roundRect( ctx, x, y, w, h, r ) {

				ctx.beginPath();
				ctx.moveTo( x + r, y );
				ctx.lineTo( x + w - r, y );
				ctx.quadraticCurveTo( x + w, y, x + w, y + r );
				ctx.lineTo( x + w, y + h - r );
				ctx.quadraticCurveTo( x + w, y + h, x + w - r, y + h );
				ctx.lineTo( x + r, y + h );
				ctx.quadraticCurveTo( x, y + h, x, y + h - r );
				ctx.lineTo( x, y + r );
				ctx.quadraticCurveTo( x, y, x + r, y );
				ctx.closePath();
				ctx.fill();
				ctx.stroke();

			}
			roundRect( context,
				borderThickness / 2,
				borderThickness / 2,
				canvas.width - borderThickness,
				canvas.height - borderThickness,
				rect.borderRadius === undefined ? 0 : rect.borderRadius
			);

		}

		context.fillStyle = fontColor;
		context.textBaseline = 'bottom';
		if ( linesCount > 1 ) {
			for ( var i = 0; i < lines.length; i++ ) {

				const line = lines[i];
				context.fillText( line, borderThickness, canvas.height - ( ( lines.length - i - 1 ) * fontSize ) - borderThickness );

			}

		} else context.fillText( text, borderThickness, canvas.height - borderThickness );

		// Inject canvas into sprite
		sprite.material.map.image = canvas;
		sprite.material.map.needsUpdate = true;

		const th = textHeight * linesCount;// * angleDistance;
		sprite.scale.set( th * canvas.width / canvas.height, th );
		sprite.position.copy( position );
		sprite.center = center;

		//size attenuation. Whether the size of the sprite is attenuated by the camera depth. (Perspective camera only.) Default is false.
		//See https://threejs.org/docs/index.html#api/en/materials/SpriteMaterial.sizeAttenuation
		sprite.material.sizeAttenuation = sizeAttenuation;

		sprite.material.rotation = rotation;
		sprite.material.needsUpdate = true;

	};
	sprite.userData.update();

	sprite.userData.updateText = function ( _text ) {

		text = _text;
		const options = {}
		updateOptions( sprite.parent, options );
		sprite.userData.update( options );

	}
	if ( options.group )
		options.group.add( sprite );

	sprite.userData.optionsSpriteText = options;

	return sprite;

};

/**
 * set THREE
 * @function SpriteText.
 * setTHREE
 * @param {THREE} THREE {@link https://github.com/anhr/three.js|THREE}
 */
SpriteText.setTHREE = function ( _THREE ) { THREE = _THREE; }

/**
 * get THREE
 * @function SpriteText.
 * getTHREE
 * @returns {@link https://github.com/anhr/three.js|THREE}
 */
SpriteText.getTHREE = function () {

	if ( !THREE )
		console.error( 'Call SpriteText.setTHREE( THREE ) first.');
	return THREE;

}

/**
 * Returns {@link https://threejs.org/docs/index.html#api/en/objects/Sprite.center|center}
 * @function SpriteText.
 * getCenter
 * @param {THREE.Vector2} center
 * @returns center
 */
SpriteText.getCenter = function ( center ) {

	return center instanceof THREE.Vector2 ||
		( ( typeof center === "object" ) && ( center.x !== undefined ) && ( center.y !== undefined )//При копироваении и при чтении из cockie THREE.Vector2 превращается в Object{x: x, y: y}
		) ? center :
		new THREE.Vector2( 0, 1 );//Default is left upper corner

}

function updateOptions( group, options ) {

	if ( group.userData.optionsSpriteText )
		Object.keys( group.userData.optionsSpriteText ).forEach( function ( key ) {

			if ( options[key] === undefined )//Child options have more priority before parent options
				options[key] = group.userData.optionsSpriteText[key];

		} );
	while ( group.parent ) {

		group = group.parent;
		updateOptions( group, options );

	}

}

/**
 * Call SpriteText.updateSpriteTextGroup if you want to update of the options of all SpriteText, added in to group and all child groups
 * @function SpriteText.
 * updateSpriteTextGroup
 * @param {THREE.Group|THREE.Scene} group group or scene of SpriteText and of all child groups of SpriteText for which these settings will have an effect.
 * @example
<script>
	options = {

		textHeight: 0.1,
		sizeAttenuation: false,

	}
	const fSpriteTextAll = SpriteTextGui( gui, scene, {

		getLanguageCode: getLanguageCode,
		settings: { zoomMultiplier: 1.5, },
		options: options

	} );

	//Change of the text height
	options.textHeight = 0.2;

	//update of the options of all SpriteText, added in to group and all child groups
	SpriteText.updateSpriteTextGroup( group );

	//To do something...

	//Restore options.textHeight to 0.1
	fSpriteTextAll.userData.restore();
</script>
*/
SpriteText.updateSpriteTextGroup = function( group ) {

	group.children.forEach( function ( spriteItem ) {

		if ( spriteItem instanceof THREE.Sprite ) {

			if ( spriteItem.userData.update !== undefined )
				spriteItem.userData.update();

		} //else if ( spriteItem instanceof THREE.Group )
			SpriteText.updateSpriteTextGroup( spriteItem );

	} );

}

//export { SpriteText };
