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

class MyObject {

	constructor( settings={}, vertices ) {

		const _this = this;

		settings.object = settings.object || {};
		settings.object.geometry = settings.object.geometry || {};

		const THREE = three.THREE;

		const buffer = new THREE.BufferGeometry();

		if (vertices)
			//for for compatibility with ND
			//Что бы можно было менять позицию и цвет вершины
			settings.object.geometry.position = settings.object.geometry.position || vertices;
		
		/* * Set color attribute
		 * @param {number} i index of the color in the color attribute array.
		 * @param {THREE.Color|string} color color.
		 * @returns true - success
		 * <p>false - colorAttribute was not detected.</p>
		 */
/*			
		this.setColorAttribute = ( i, color ) => {

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
		
		}
*/
		this.createPositionAttribute = (pointLength, pointsLength) => {

//			const buffer = settings.options.buffer;

			//https://stackoverflow.com/questions/31399856/drawing-a-line-with-three-js-dynamically/31411794#31411794
			const MAX_POINTS = settings.object.geometry.MAX_POINTS;
//				pointsLength = points.length;
			if (MAX_POINTS != undefined) buffer.setDrawRange(0, pointsLength * 2 - 1);// * pointLength );//Непонятно почему draw count так вычисляется. Еще смотри class Universe.constructor.project.projectGeometry.gui.addControllers.aAngleControls.createArc
			const positions = new Float32Array(pointsLength * pointLength);
			buffer.setAttribute('position', new THREE.Float32BufferAttribute(positions, pointLength));
			if (pointLength < 4) return;

			//color
			const colors = new Float32Array(pointsLength * pointLength);
			buffer.setAttribute('ca', new THREE.Float32BufferAttribute(colors, pointLength));

		}
		this.setPositionAttributeFromPoints = (points) => {

/*
			const pointLength = points[0].w === undefined ? 3 : 4,
				buffer = settings.options.buffer;

			//https://stackoverflow.com/questions/31399856/drawing-a-line-with-three-js-dynamically/31411794#31411794
			const MAX_POINTS = settings.object.geometry.MAX_POINTS,
				pointsLength = points.length;
			if ( MAX_POINTS != undefined ) buffer.setDrawRange( 0, pointsLength * 2 - 1);// * pointLength );//Непонятно почему draw count так вычисляется. Еще смотри class Universe.constructor.project.projectGeometry.gui.addControllers.aAngleControls.createArc
			const positions = new Float32Array( pointsLength * pointLength );
			buffer.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, pointLength ) );
*/
			this.createPositionAttribute(points[0].w === undefined ? 3 : 4, points.length);
//			const buffer = settings.options.buffer;
			for( let i = 0; i < points.length; i++ ) this.setPositionAttributeFromPoint(i);//, buffer.attributes);
			return buffer;
			
		}
		this.setPositionAttributeFromPoint = (i, vertice/*, attributes*/) => {

			const attributes = buffer.attributes;
/*			
			const position = points ? points[i] : settings.object.geometry.position[i],
				vertice = position.positionWorld || position,
*/				
			vertice = vertice || _this.getPoint(i);
			const itemSize = attributes.position.itemSize;
			attributes.position.array [0 + i * itemSize] = vertice.x;
			if (itemSize > 1) attributes.position.array [1 + i * itemSize] = vertice.y;
			if (itemSize > 2) attributes.position.array [2 + i * itemSize] = vertice.z;
			if (itemSize > 3) attributes.position.array [3 + i * itemSize] = vertice.w;
			if (attributes.position.itemSize < 4) return;

			//Меняем цвет дуги между двумя вершинами в гиперсфере
			//отказался от применения this.setColorAttribute потому что в этом случае для каждого 3D объекта нужно создавать myObject, а это нецелесообразно делать во всех приложениях
//			this.setColorAttribute( i );
			const w = settings.options.scales.w;
//			Player.setColorAttribute(attributes, i, settings.options.palette.toColor(settings.object.geometry.position[i].w, w.min, w.max));
			Player.setColorAttribute(attributes, i, settings.options.palette.toColor(vertice.w, w.min, w.max));
			
		}
		this.setPositionAttribute = ( i ) => {

			this.setPositionAttributeFromPoint( i, _this.object3D.geometry.attributes );
			
		}
		
	}

}
export default MyObject;
