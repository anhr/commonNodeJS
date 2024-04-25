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

		if (!settings.object.geometry.position || !settings.object.geometry.position.isPositionProxy)
			settings.object.geometry.position = new Proxy(settings.object.geometry.position || [], {
	
				get: (positions, name) => {
					
					const positionId = parseInt(name);
					if (!isNaN(positionId)) {
						
						return new Proxy(positions[positionId], {
	
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
					switch (name) {
	
						case 'isPositionProxy': return true;
	
					}
					return positions[name];
					
				},
				
			});
	
		const THREE = three.THREE;

		if (!settings.bufferGeometry) settings.bufferGeometry = new THREE.BufferGeometry();
		this.bufferGeometry = settings.bufferGeometry;

		if (vertices)
			//for for compatibility with ND
			//Что бы можно было менять позицию и цвет вершины
			settings.object.geometry.position = settings.object.geometry.position || vertices;
		
		const createPositionAttribute = (pointLength, pointsLength) => {

			//https://stackoverflow.com/questions/31399856/drawing-a-line-with-three-js-dynamically/31411794#31411794
			const MAX_POINTS = settings.object.geometry.MAX_POINTS;
			if (MAX_POINTS != undefined) settings.bufferGeometry.setDrawRange(0, pointsLength * 2 - 1);//Непонятно почему draw count так вычисляется. Еще смотри class Universe.constructor.project.projectGeometry.gui.addControllers.aAngleControls.createArc
			const positions = new Float32Array(pointsLength * pointLength);
			settings.bufferGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, pointLength));
			settings.bufferGeometry.userData.position = new Proxy(settings.bufferGeometry.attributes.position, {
	
				get: (position, name) => {
	
					const positionId = parseInt(name);
					if (!isNaN(positionId)) {

						const positionOffset = positionId * position.itemSize, array = position.array;
						const positionItem = new Proxy([], {

							get: (vertice, name) => {
								
								const axisId = parseInt(name);
								if (!isNaN(axisId)) {

									if (axisId >= position.itemSize) {
										
										//console.error(sMyObject + ': get position axis failed. Invalid axisId = ' + axisId);
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

										if (position.itemSize < 4) return;
										return array[positionOffset + 3];

									}
				
								}
								return vertice[name];
								
							},
							set: (vertice, name, value) => {

								//edit vertice in http://localhost/anhr/commonNodeJS/master/nD/Examples/ for testing
								const axisId = parseInt(name);
								if (!isNaN(axisId)) {

									array[positionOffset + axisId] = value;
									return true;
									
								}
								vertice[name] = value;
								return true;
								
							}
							
						});
						return positionItem;
	
					}
					switch (name) {
	
						case 'length': return position.count;
	
					}
					console.error(sMyObject + ': get settings.bufferGeometry.userData.position. Invalid name: ' + name);
					return position[name];
	
				}
	
			});			
//			if (pointLength < 4) return;

			//color
			if (_this.setW) _this.setW();
			const colors = new Float32Array(pointsLength * pointLength);
			settings.bufferGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, pointLength));

		}
		this.setPositionAttributeFromPoints = (points, /*pointLength*/boCreatePositionAttribute) => {

//			if (!settings.bufferGeometry.userData.isReady)
			if (boCreatePositionAttribute) delete settings.bufferGeometry.attributes.position;
			if (!settings.bufferGeometry.attributes.position) {
				
				createPositionAttribute(
					this.pointLength ? this.pointLength() :
						points[0].w === undefined ? 3 : 4,
					points.length);
				for( let i = 0; i < points.length; i++ ) this.setPositionAttributeFromPoint(i);
//				this.bufferGeometry.userData.isReady = true;

			}
			return settings.bufferGeometry;
			
		}
		this.verticeColor = (i, mul = 1, vertice) => {

			const colors = settings.object.geometry.colors;
			const colorsId = i * 3;
			if (colors && colors[colorsId] != undefined) return [colors[colorsId] * mul, colors[colorsId + 1] * mul, colors[colorsId +2] * mul];
			const color = settings.object.color;
			if ((color != undefined) && (typeof color != 'object')) {

				const rgb = new THREE.Color(color);
				return [rgb.r * mul, rgb.g * mul, rgb.b * mul, ];
/*				
				rgb.r *= mul;
				rgb.g *= mul;
				rgb.b *= mul;
				return rgb;
*/				
				
			}
			if (vertice) return vertice.w;
			if (!_this.getPoint) {

				const position = _this.bufferGeometry.attributes.position;
				if (position.itemSize != 4) {
					
					console.error(sMyObject + '.verticeColor: Invalid position.itemSize = ' + position.itemSize);
					return [mul, mul, mul];

				}
				return new THREE.Vector4().fromBufferAttribute(position, i).w;
				
			}
			return _this.getPoint(i).w;
		
		}
		this.setPositionAttributeFromPoint = (i, vertice) => {

			//Position attribute
			
			const attributes = settings.bufferGeometry.attributes, position = attributes.position, itemSize = position.itemSize;
			vertice = vertice || _this.getPoint(i);
			let positionId = i * itemSize, array = position.array;
			                  array [positionId++] = vertice.x != undefined ? vertice.x : vertice[0] != undefined ? vertice[0] : 0;
			if (itemSize > 1) array [positionId++] = vertice.y != undefined ? vertice.y : vertice[1] != undefined ? vertice[1] : 0;
			if (itemSize > 2) array [positionId++] = vertice.z != undefined ? vertice.z : vertice[2] != undefined ? vertice[2] : 0;
//			const w = vertice.w != undefined ? vertice.w : vertice[3] != undefined ? vertice[3] : 0;
			const w = vertice.w;
			if (itemSize > 3) array [positionId] = w;
//			if (attributes.position.itemSize < 4) return;

			//Color attribute
			
			let colorId = i * attributes.color.itemSize;
			array = attributes.color.array;
			const verticeColor = _this.verticeColor(i, 255, vertice);
			if (typeof verticeColor === 'number'){

				if (settings.options) {
					
					const wScale = settings.options.scales.w;
					Player.setColorAttribute(attributes, i, settings.options.palette.toColor(w, wScale.min, wScale.max));

				}
				colorId += attributes.color.itemSize - 1;
				
			} else if (Array.isArray(verticeColor))
				verticeColor.forEach(item => array[colorId++] = item);
			else console.error(sMyObject + '.setPositionAttributeFromPoint: Invalid verticeColor = ' + verticeColor);
/*
			const mul = 255;
			const colors = settings.object.geometry.colors;
			let colorsId = i * 3;
			if (colors && colors[colorId] != undefined) {

				array[colorId++] = colors[colorsId++] * mul;
				array[colorId++] = colors[colorsId++] * mul;
				array[colorId++] = colors[colorsId++] * mul;
				
			} else {
				
				const color = settings.object.color;
				if ((color != undefined) && (typeof color != 'object')) {
	
					const rgb = new THREE.Color(color);
					array [colorId++] = rgb.r * mul;
					array [colorId++] = rgb.g * mul;
					array [colorId++] = rgb.b * mul;
					
				} else {

					if (settings.options) {
						
						const wScale = settings.options.scales.w;
						Player.setColorAttribute(attributes, i, settings.options.palette.toColor(w, wScale.min, wScale.max));

					}
					colorId += attributes.color.itemSize - 1;
					
				}

			}
*/			

			//opacity
			if (attributes.color.itemSize > 3) {
				
				const opacity = settings.object.geometry.opacity;
				array[colorId] = opacity ? opacity[i] != undefined ? opacity[i] : 1 : 1;

			}
			
		}
		this.verticesOpacity = ( transparent, opacity ) => {
			
			const color = settings.bufferGeometry.attributes.color;
			if ( color && ( color.itemSize > 3 ) ) {

				if ( color.itemSize != 4 ) console.error('ND.opacity: Invalid color.itemSize = ' + color.itemSize);
				const array = color.array;
				for ( let i = 0; i < color.count; i++ ) {
	
					const verticeOpacity = settings.object.geometry.opacity ? settings.object.geometry.opacity[i] : undefined;
					array[color.itemSize * i + 3] = transparent ? opacity : verticeOpacity === undefined ? 1 : verticeOpacity;
	
				}
				color.needsUpdate = true;

			} else {

				const object3D = _this.object3D;
				if (object3D) {
					
					object3D.material.transparent = transparent;
					object3D.material.opacity = transparent ? opacity : 1;
					object3D.material.needsUpdate = true;//for THREE.REVISION = "145dev"

				} else console.error(sMyObject + '.verticesOpacity: Invalid object3D');
				
			}
	
		}
		
	}

}
export default MyObject;
