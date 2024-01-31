/**
 * @module myObject
 * @description base class for my threejs objects
 * @author [Andrej Hristoliubov]{@link https://github.com/anhr}
 *
 * @copyright 2011 Data Arts Team, Google Creative Lab
 *
 * @license under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
*/

import three from './three.js'
import Player from './player/player.js'

class myObject {

	constructor( settings ) {

		const _this = this;

		settings.object = settings.object || {};
		
		/** Set color attribute
		 * @param {number} i index of the color in the color attribute array.
		 * @param {THREE.Color|string} color color.
		 * @returns true - success
		 * <p>false - colorAttribute was not detected.</p>
		 */
		this.setColorAttribute = ( i, color ) => {

			const w = settings.options.scales.w;
			return Player.setColorAttribute(
				_this.object3D.geometry.attributes,
				i,
				color || settings.options.palette.toColor(settings.object.geometry.position[i].w, w.min, w.max)
			);
/*			
			const object = settings.object, object3D = _this.object3D;
			color = color || settings.options.palette.toColor(object.geometry.position[i].w, settings.options.scales.w.min, settings.options.scales.w.max);
			if ( typeof color === "string" )
				color = new three.THREE.Color( color );
			const attributes = object3D.geometry.attributes, colorAttribute = attributes.color || attributes.ca;
			if ( colorAttribute === undefined )
				return false;
			colorAttribute.setX( i, color.r );
			colorAttribute.setY( i, color.g );
			colorAttribute.setZ( i, color.b );
			colorAttribute.needsUpdate = true;
			return true;
*/			
		
		}
		this.setPositionAttribute = ( i ) => {

			const object = settings.object, object3D = _this.object3D, position = object.geometry.position;
			const vertice = position[i], itemSize = object3D.geometry.attributes.position.itemSize;
			for (let j = 0; j < itemSize; j++) 
				object3D.geometry.attributes.position.array [j + i * itemSize] = vertice[j];
			this.setColorAttribute( i );
			
		}
		
	}

}
export default myObject;
