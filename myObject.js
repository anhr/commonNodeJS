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

		if (vertices)
			//for for compatibility with ND
			//Что бы можно было менять позицию и цвет вершины
			settings.object.geometry.position = settings.object.geometry.position || vertices;

		if (!settings.object.geometry.position.isMyObjectPositionProxy)
			settings.object.geometry.position = new Proxy(settings.object.geometry.position, {
	
				get: (positions, name) => {
					
					const positionId = parseInt(name);
					if (!isNaN(positionId)) {
						
						return new Proxy(positions[positionId], {
	
							set: (position, name, value) => {
	
								const axisId = parseInt(name);
								if (!isNaN(axisId)) {
	
									position[axisId] = value;
									_this.bufferGeometry.userData.position[positionId][axisId] = value;
									return true;
									
								}
								position[name] = value;
								return true;
								
							}
							
						});
	
					
					}
					switch (name) {
	
						case 'isMyObjectPositionProxy': return true;
	
					}
					return positions[name];
					
				},
				set: (positions, name, value) => {
					
					const positionId = parseInt(name);
					if (!isNaN(positionId)) {

						const vertice = value, position = settings.object.geometry.position[positionId];
						if (position.length != vertice.length) console.error(sMyObject + ': set positions[' + positionId + ']. Invalid vertice.length = ' + vertice.length);
						vertice.forEach((axis, i) => position[i] = axis);
						return true;
						
					}
					positions[name] = value;
					return true;
					
				}
				
			});

		const THREE = three.THREE;

		if (!settings.bufferGeometry) {
			
			this.bufferGeometry = new THREE.BufferGeometry();
			settings.bufferGeometry = this.bufferGeometry;

		} else this.bufferGeometry = settings.bufferGeometry;
		
		this.createPositionAttribute = (pointLength, pointsLength) => {

			//https://stackoverflow.com/questions/31399856/drawing-a-line-with-three-js-dynamically/31411794#31411794
			const MAX_POINTS = settings.object.geometry.MAX_POINTS;
			if (MAX_POINTS != undefined) this.bufferGeometry.setDrawRange(0, pointsLength * 2 - 1);// * pointLength );//Непонятно почему draw count так вычисляется. Еще смотри class Universe.constructor.project.projectGeometry.gui.addControllers.aAngleControls.createArc
			const positions = new Float32Array(pointsLength * pointLength);
			this.bufferGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, pointLength));
			this.bufferGeometry.userData.position = new Proxy(_this.bufferGeometry.attributes.position, {
	
				get: (position, name) => {
	
					const positionId = parseInt(name);
					if (!isNaN(positionId)) {

						return new Proxy(position.array, {

							get: (array, name) => {
								
								const axisId = parseInt(name);
								if (!isNaN(axisId)) {}
								switch (name) {
				
									case 'x': return array[positionId * position.itemSize + 0];
									case 'y': return array[positionId * position.itemSize + 1];
									case 'z': return array[positionId * position.itemSize + 2];
									case 'w': {

										if (position.itemSize < 4) console.error(sMyObject + ': get this.bufferGeometry.userData.position[' + positionId + ']. Invalid vector axis: ' + name);
										return array[positionId * position.itemSize + 3];

									}
				
								}
								console.error(sMyObject + ': get this.bufferGeometry.userData.position[' + positionId + ']. Invalid name: ' + name);
								
							},
							set: (array, name, value) => {

								const axisId = parseInt(name);
								if (!isNaN(axisId)) {

									array[positionId * position.itemSize + axisId] = value;
//									position.needsUpdate = true;
									return true;
									
								}
								console.error(sMyObject + ': set this.bufferGeometry.userData.position[' + positionId + ']. Invalid name: ' + name);
								return true;
								
							}
							
						});
	
					}
					switch (name) {
	
						case 'length': return position.count;
	
					}
					console.error(sMyObject + ': get this.bufferGeometry.userData.position. Invalid name: ' + name);
					return position[name];
	
				}
	
			});
/*сейчас каждый графический объект аттрибут цвета создает самостоятельно. Например а ND аттрибут цвета имеет имя 'color' а в getShaderMaterialPoints имя 'ca'
			if (pointLength < 4) return;

			//color
			const colors = new Float32Array(pointsLength * pointLength);
			this.bufferGeometry.setAttribute('ca', new THREE.Float32BufferAttribute(colors, pointLength));
*/			

		}
		this.setPositionAttributeFromPoints = (points, pointLength) => {

/*			
			this.createPositionAttribute(points[0].w === undefined ? 3 : 4, points.length);
			for( let i = 0; i < points.length; i++ ) this.setPositionAttributeFromPoint(i);
*/			
			if (!this.bufferGeometry.attributes.position) {
				
				this.createPositionAttribute(pointLength != undefined ? pointLength : points[0].w === undefined ? 3 : 4, points.length);
				for( let i = 0; i < points.length; i++ ) this.setPositionAttributeFromPoint(i);
				
			}
			return this.bufferGeometry;
			
		}
		this.setPositionAttributeFromPoint = (i, vertice) => {

			const attributes = this.bufferGeometry.attributes;
			vertice = vertice || _this.getPoint(i);
			settings.object.geometry.position[i] = vertice;
/*		
			const itemSize = attributes.position.itemSize,
				x = vertice.x != undefined ? vertice.x : vertice[0];
			if (x === undefined) console.error(sMyObject + '.setPositionAttributeFromPoint. Invalid x = ' + x)
			                  attributes.position.array [0 + i * itemSize] = x;
			if (itemSize > 1) attributes.position.array [1 + i * itemSize] = vertice.y != undefined ? vertice.y : vertice[1] != undefined ? vertice[1] : 0;
			if (itemSize > 2) attributes.position.array [2 + i * itemSize] = vertice.z != undefined ? vertice.z : vertice[2] != undefined ? vertice[2] : 0;
			if (itemSize > 3) attributes.position.array [3 + i * itemSize] = vertice.w != undefined ? vertice.w : vertice[3] != undefined ? vertice[3] : 0;
*/			
			if (attributes.position.itemSize < 4) return;

			//Меняем цвет дуги между двумя вершинами в гиперсфере
			//отказался от применения this.setColorAttribute потому что в этом случае для каждого 3D объекта нужно создавать myObject, а это нецелесообразно делать во всех приложениях
			const w = settings.options.scales.w;
			Player.setColorAttribute(attributes, i, settings.options.palette.toColor(vertice.w, w.min, w.max));
			
		}
		this.setPositionAttribute = (i) => { this.setPositionAttributeFromPoint(i); }
		
	}

}
export default MyObject;
