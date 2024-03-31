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

const sMyObject = 'MyObject';

class MyObject {

	constructor( settings={}, vertices ) {

		const _this = this;

		settings.object = settings.object || {};
		settings.object.geometry = settings.object.geometry || {};

		settings.object.geometry.position = new Proxy(settings.object.geometry.position || [], {

			get: (positions, name) => {
				
				const positionId = parseInt(name);
				if (!isNaN(positionId)) {
					
					return new Proxy(positions[positionId], {

/*						
						get: (position, name) => {
							
							const axisId = parseInt(name);
							if (!isNaN(axisId)) {
								
								return position[axisId];
							
							}
							return position[name];
							
						},
*/						
						set: (position, name, value) => {

							const axisId = parseInt(name);
							if (!isNaN(axisId)) {

								position[axisId] = value;
								settings.bufferGeometry.userData.position[positionId][axisId] = value;
								return true;
								
							}
							position[name] = value;
							return true;
							
						}
						
					});

				
				}
				return positions[name];
				
			},
			
		});

		const THREE = three.THREE;

		settings.bufferGeometry = new THREE.BufferGeometry();
		this.bufferGeometry = settings.bufferGeometry;

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
			if (MAX_POINTS != undefined) settings.bufferGeometry.setDrawRange(0, pointsLength * 2 - 1);// * pointLength );//Непонятно почему draw count так вычисляется. Еще смотри class Universe.constructor.project.projectGeometry.gui.addControllers.aAngleControls.createArc
			const positions = new Float32Array(pointsLength * pointLength);
			settings.bufferGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, pointLength));
			settings.bufferGeometry.userData.position = new Proxy(settings.bufferGeometry.attributes.position, {
	
				get: (position, name) => {
	
					const positionId = parseInt(name);
					if (!isNaN(positionId)) {

						const positionOffset = positionId * position.itemSize,// vertice = [],
							array = position.array;
//						for (let axisId = 0; axisId < position.itemSize; axisId++) vertice.push(0);//array[positionOffset + axisId]);
						const positionItem = new Proxy([], {

							get: (vertice, name) => {
								
//console.log('name: ' + name)
								const axisId = parseInt(name);
								if (!isNaN(axisId)) {

									if (axisId >= position.itemSize) {
										
										console.error(sMyObject + ': get position axis failed. Invalid axisId = ' + axisId);
										return;

									}
									return array[positionOffset + axisId];
									
								}
								switch (name) {

									case 'forEach': return (item) => {

										for (let axisId = 0; axisId < position.itemSize; axisId++) item(array[positionOffset + axisId], axisId);
											
									}
									case 'length': return position.itemSize;
									case 'toJSON': return (item) => {

										let res = '[';
										positionItem.forEach(axis => { res += axis + ', ' })
										return res.substring(0, res.length-2) + ']';
											
									}
									case 'x': return array[positionOffset + 0];
									case 'y': return array[positionOffset + 1];
									case 'z': return array[positionOffset + 2];
									case 'w': {

										if (position.itemSize < 4) {
											
//											console.error(sMyObject + ': get settings.bufferGeometry.userData.position[' + positionId + ']. Invalid vector axis: ' + name);
											return;

										}
										return array[positionOffset + 3];

									}
				
								}
								return vertice[name];
//								console.error(sMyObject + ': get settings.bufferGeometry.userData.position[' + positionId + ']. Invalid name: ' + name);
								
							},
							set: (vertice, name, value) => {

								const axisId = parseInt(name);
								if (!isNaN(axisId)) {

									array[positionOffset + axisId] = value;
//									position.needsUpdate = true;
									return true;
									
								}
//								console.error(sMyObject + ': set settings.bufferGeometry.userData.position[' + positionId + ']. Invalid name: ' + name);
								vertice[name] = value;
								return true;
								
							}
							
						});
						return positionItem;

/*						
						const vector = position.itemSize === 4 ? new THREE.Vector4() : position.itemSize === 3 ? new THREE.Vector3() : undefined;
						vector.fromBufferAttribute(position, positionId);
//						return vector;
						return new Proxy(vector, {

							set: (vector, name, value) => {

								const axisId = parseInt(name);
								if (!isNaN(axisId)) {

									const position = settings.bufferGeometry.attributes.position;
									position.array[positionId * position.itemSize + axisId] = value;
//									position.needsUpdate = true;
									
								}
								return true;
								
							}
							
						});
*/						
	
					}
					switch (name) {
	
						case 'length': return position.count;
	
					}
					console.error(sMyObject + ': get settings.bufferGeometry.userData.position. Invalid name: ' + name);
					return position[name];
	
				}
	
			});			
			if (pointLength < 4) return;

			//color
			const colors = new Float32Array(pointsLength * pointLength);
			settings.bufferGeometry.setAttribute('ca', new THREE.Float32BufferAttribute(colors, pointLength));

		}
		this.setPositionAttributeFromPoints = (points, pointLength) => {

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
			this.createPositionAttribute(pointLength != undefined ? pointLength : points[0].w === undefined ? 3 : 4, points.length);
//			const buffer = settings.options.buffer;
			for( let i = 0; i < points.length; i++ ) this.setPositionAttributeFromPoint(i);//, buffer.attributes);
			this.bufferGeometry.userData.isReady = true;
			//return settings.bufferGeometry;
			
		}
		this.setPositionAttributeFromPoint = (i, vertice/*, attributes*/) => {

			const attributes = settings.bufferGeometry.attributes;
/*			
			const position = points ? points[i] : settings.object.geometry.position[i],
				vertice = position.positionWorld || position,
*/				
			vertice = vertice || _this.getPoint(i);
			const itemSize = attributes.position.itemSize;
			                  attributes.position.array [0 + i * itemSize] = vertice.x != undefined ? vertice.x : vertice[0] != undefined ? vertice[0] : 0;
			if (itemSize > 1) attributes.position.array [1 + i * itemSize] = vertice.y != undefined ? vertice.y : vertice[1] != undefined ? vertice[1] : 0;
			if (itemSize > 2) attributes.position.array [2 + i * itemSize] = vertice.z != undefined ? vertice.z : vertice[2] != undefined ? vertice[2] : 0;
			if (itemSize > 3) attributes.position.array [3 + i * itemSize] = vertice.w != undefined ? vertice.w : vertice[3] != undefined ? vertice[3] : 0;
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
