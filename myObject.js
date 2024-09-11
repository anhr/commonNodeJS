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

	constructor(settings={}, vertices) {

		const _this = this;

//		if (settings.guiPoints) this.guiPoints = (cPoints) => { settings.guiPoints(cPoints); }
		if (settings.guiPoints) this.guiPoints = settings.guiPoints;

		settings.object = settings.object || {};
		settings.object.geometry = settings.object.geometry || {};

		this.isSetPosition = settings.isSetPosition;

//		this.isColorFromPositionW = settings.object.isColorFromPositionW;

		const geometryPosition = settings.object.geometry.position;
		if (!geometryPosition || !geometryPosition.isPositionProxy)
			settings.object.geometry.position = new Proxy(geometryPosition || [], {
	
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

		if (!settings.bufferGeometry) {
			
			settings.bufferGeometry = new THREE.BufferGeometry();
			Object.defineProperty(settings.bufferGeometry.userData, 'timeId', {

				get: () => { return 0; },
				set: (timeIdNew) => { },//ignore timeIdNew
				configurable: true,//https://stackoverflow.com/a/25518045/5175935

			});
			
		}
		this.bufferGeometry = settings.bufferGeometry;

		if (vertices)
			//for for compatibility with ND
			//Что бы можно было менять позицию и цвет вершины
			settings.object.geometry.position = settings.object.geometry.position || vertices;

		this.setDrawRange = (start, count) => { settings.bufferGeometry.setDrawRange(start, count); }
//		const getPlayerAnglesLength = () => { return (settings.object.geometry.playerAnglesLength != undefined ? settings.object.geometry.playerAnglesLength : 1);}
		const getPlayerAnglesLength = () => { return (settings.object.geometry.timesAngles != undefined ? settings.object.geometry.timesAngles.length : 1);}
		const createPositionAttribute = (pointLength, pointsLength) => {

			//https://stackoverflow.com/questions/31399856/drawing-a-line-with-three-js-dynamically/31411794#31411794
			const isRCount = settings.object.geometry.rCount != undefined, MAX_POINTS = isRCount ?
				//резервирую место для вершин, которые появятся по мере проигрывания player.
				//Это случается когда во вселенной вычисляется очередной шаг по времени. Тоесть пользователь нажал ► или →
				pointLength * pointsLength * settings.object.geometry.rCount :
				settings.object.geometry.MAX_POINTS;
			if (MAX_POINTS != undefined) settings.bufferGeometry.setDrawRange(0, isRCount ?
				  pointsLength * getPlayerAnglesLength()://зарезервировано место для вершин вселенной с разным радиусом
//				  pointsLength://зарезервировано место для вершин вселенной с разным радиусом
				  //Имеются ребра. В этом случае settings.bufferGeometry.drawRange.count определяет количество отображаемых ребер
				  //Сейчас ребра еще не созданы. Поэтому settings.bufferGeometry.drawRange будет установлено после вызова this.setDrawRange
				  Infinity//pointsLength * 2 - 1
				  );
			if (isRCount) settings.bufferGeometry.userData.drawRange = () => { return settings.bufferGeometry.drawRange; }
			const positions = new Float32Array((MAX_POINTS != undefined ? MAX_POINTS : pointsLength) * pointLength);
			settings.bufferGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, pointLength));
			settings.bufferGeometry.userData.position = new Proxy(settings.bufferGeometry.attributes.position, {
	
				get: (position, name) => {
	
					const positionId = parseInt(name);
					if (!isNaN(positionId)) {

						const timeId = settings.bufferGeometry.userData.timeId,
//							positionOffset = (settings.object.geometry.timesAngles != undefined ? timeId * settings.object.geometry.timesAngles[0].length * position.itemSize : 0) + positionId * position.itemSize,
							positionOffset = (timeId * settings.object.geometry.angles.length + positionId) * position.itemSize,
							array = position.array;
						const verticeProxy = new Proxy([], {

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
//										vertice.forEach(axis => { res += axis + ', ' });
										verticeProxy.forEach(axis => { res += axis + ', ' });
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
								if (_this.getPositionItem) {

									const res = _this.getPositionItem(verticeProxy, name);
									if (res != undefined) return res;

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
						return verticeProxy;
	
					}
					switch (name) {
	
						case 'length': return position.count;
						case 'itemSize': return position.itemSize;
	
					}
					console.error(sMyObject + ': get settings.bufferGeometry.userData.position. Invalid name: ' + name);
					return position[name];
	
				}
	
			});			

			//color
			if (_this.setW) _this.setW();
			const itemSize = settings.object.geometry.opacity ? 4 : 3, colors = new Float32Array((MAX_POINTS != undefined ? MAX_POINTS : pointsLength) * itemSize);
			settings.bufferGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, itemSize));

		}
		this.setPositionAttributeFromPoints = (points, boCreatePositionAttribute) => {

			if (boCreatePositionAttribute) delete settings.bufferGeometry.attributes.position;
			if (!settings.bufferGeometry.attributes.position) {
				
				createPositionAttribute(
					this.pointLength ? this.pointLength() :
						points[0].w === undefined ? 3 : 4,
					points.length);
				for (let timeId = 0; timeId < getPlayerAnglesLength(); timeId++)
					for (let i = 0; i < points.length; i++) this.setPositionAttributeFromPoint(i, undefined, timeId);

			}
			return settings.bufferGeometry;
			
		}
		this.verticeColor = (i, vertice, timeId) => {

			const colors = settings.object.geometry.colors;
			const colorsId = i * 3;
			if (colors && colors[colorsId] != undefined)
				return [colors[colorsId], colors[colorsId + 1], colors[colorsId + 2]];
			const color = settings.object.color;
			if (typeof color === "function") return color(timeId);
			if ((color != undefined) && (typeof color != 'object')) return new THREE.Color(_this.color());
			//Вершина не имеет 4 координаты. Установить цвет вершины по умолчанию
			const getDefaultColor = () => { return new THREE.Color(_this.color()); }
			let w
			if (vertice) w = vertice.w;
			else if (!_this.getPoint) {

				const position = _this.bufferGeometry.attributes.position;
				if (position.itemSize != 4) return getDefaultColor();
				w = new THREE.Vector4().fromBufferAttribute(position, i).w;

			}
			else w = _this.getPoint(i).w;
			if (w === undefined) return getDefaultColor();
			return w;

		}
		this.getPositionData = (i, timeId) => {

			//Во вселенной, когда пользователь щелкает по вершине, то индекс вершины i будет равен положению вершины в attributes.position
			//а должен быть равен индексу вершины для текущего времени.
			if (_this.guiPoints && _this.guiPoints.verticeId) {
				
				i = _this.guiPoints.verticeId;
				timeId = _this.guiPoints.timeId;

			}
			
			if (timeId === undefined) timeId = 0;
			if (i === undefined) console.error(sMyObject + '.getPositionData. Invalid i = ' + i);
			const userData = settings.bufferGeometry.userData,
//				positionBlockLength = (timeId === undefined) ? undefined : userData.positionBlockLength === undefined ? 0 : userData.positionBlockLength,
				positionBlockLength = userData.positionBlockLength === undefined ? 0 : userData.positionBlockLength,
				itemSize = settings.bufferGeometry.attributes.position.itemSize,
				verticeId = positionBlockLength * timeId + i;
			return {

				verticeId: verticeId,
				itemSize: itemSize,
				positionBlockLength: positionBlockLength,
//				positionId: i * itemSize + (timeId === undefined ? 0 : positionBlockLength * timeId * itemSize),
				positionId: verticeId * itemSize,

			}
			
		}
		this.setPositionAttributeFromPoint = (i, vertice, timeId) => {

			//Position attribute
			
			vertice = vertice || _this.getPoint(i, timeId);
/*			
			const attributes = settings.bufferGeometry.attributes, position = attributes.position,
//				anglesLength = (timeId === undefined) ? undefined : settings.object.geometry.angles.length;
				userData = settings.bufferGeometry.userData,
				positionBlockLength = (timeId === undefined) ? undefined : userData.positionBlockLength === undefined ? 0 : userData.positionBlockLength;
			let itemSize = position.itemSize, positionId = i * itemSize + (timeId === undefined ? 0 :
//					anglesLength * timeId * itemSize),
					positionBlockLength * timeId * itemSize),
				array = position.array;
*/
			const attributes = settings.bufferGeometry.attributes, positionData = this.getPositionData(i, timeId),
				positionBlockLength = positionData.positionBlockLength;
			let itemSize = positionData.itemSize, positionId = positionData.positionId, array = attributes.position.array;
			                  array [positionId] = vertice.x != undefined ? vertice.x : vertice[0] != undefined ? vertice[0] : 0;
			if (itemSize > 1) array [++positionId] = vertice.y != undefined ? vertice.y : vertice[1] != undefined ? vertice[1] : 0;
			if (itemSize > 2) array [++positionId] = vertice.z != undefined ? vertice.z : vertice[2] != undefined ? vertice[2] : 0;
			const w = vertice.w;
			if (itemSize > 3) array [++positionId] = w;

			const drawRange = settings.bufferGeometry.drawRange;
			if ((drawRange.start + drawRange.count * itemSize) < positionId) {

				settings.bufferGeometry.setDrawRange(drawRange.start, (positionId - drawRange.start + 1) / itemSize);
//				drawRange.count = (positionId - drawRange.start + 1) / itemSize;
				if (!Number.isInteger(drawRange.count)) console.error(sMyObject + '.setPositionAttributeFromPoint failed. Invalid drawRange.count = ' + drawRange.count);

			}

			//Color attribute

			itemSize = attributes.color.itemSize;
//			let colorId = i * itemSize + (timeId === undefined ? 0 : anglesLength * timeId * itemSize);
			let colorId = i * itemSize + (timeId === undefined ? 0 : positionBlockLength * timeId * itemSize);
			array = attributes.color.array;
			const verticeColor = this.verticeColor(i, vertice, timeId);
			if (typeof verticeColor === 'number'){

				if (settings.options) {
					
					const wScale = settings.options.scales.w;
//					Player.setColorAttribute(attributes, i + (timeId === undefined ? 0 : anglesLength * timeId), settings.options.palette.toColor(verticeColor, wScale.min, wScale.max));
					Player.setColorAttribute(attributes, i + (timeId === undefined ? 0 : positionBlockLength * timeId), settings.options.palette.toColor(verticeColor, wScale.min, wScale.max));

				}
				colorId += attributes.color.itemSize - 1;
				
			} else if (Array.isArray(verticeColor)) verticeColor.forEach(item => array[colorId++] = item);
			else if (verticeColor instanceof THREE.Color) {

				array [colorId++] = verticeColor.r;
				array [colorId++] = verticeColor.g;
				array [colorId++] = verticeColor.b;
				
			}
			else console.error(sMyObject + '.setPositionAttributeFromPoint: Invalid verticeColor = ' + verticeColor);

			//opacity
			if (attributes.color.itemSize > 3) this.verticeOpacity(i);
			
		}
		this.verticeOpacity = (i, transparent, opacity) => {

			const color = settings.bufferGeometry.attributes.color;
			if (color.itemSize != 4) {

				console.error(sMyObject + '.verticeOpacity: Invalid color.itemSize = ' + color.itemSize);
				return;

			}
			const array = color.array;
			const verticeOpacity = settings.object.geometry.opacity ? settings.object.geometry.opacity[i] : undefined;
			array[color.itemSize * i + 3] = transparent ? opacity : verticeOpacity === undefined ? 1 : verticeOpacity;
			color.needsUpdate = true;

		}
		this.verticesOpacity = ( transparent, opacity ) => {
			
			const color = settings.bufferGeometry.attributes.color;
			if ( color && ( color.itemSize > 3 ) ) {

				for ( let i = 0; i < color.count; i++ ) { this.verticeOpacity(i, transparent, opacity); }

			} else {

				const object3D = _this.object3D;
				if (object3D) {
					
					object3D.material.transparent = transparent;
					object3D.material.opacity = transparent ? opacity : 1;
					object3D.material.needsUpdate = true;//for THREE.REVISION = "145dev"

				} else console.error(sMyObject + '.verticesOpacity: Invalid object3D');
				
			}
	
		}
		this.color = () => {
	
			const color = settings.object.color != undefined ? settings.object.color : settings.pointsOptions != undefined ? settings.pointsOptions.color : undefined;
			return (color != undefined) ? 
				(typeof color === "function") ? color() : color :
				this.defaultColor;//'lime';
		
		}
		
	}
//	get isSetPosition() { return false; }
	get defaultColor() { return 'white'; }
	get isOpacity() {

		if (this.bufferGeometry.attributes.color && (this.bufferGeometry.attributes.color.itemSize > 3)) {
			
			if (!this.object3D.material.transparent) console.error(sMyObject + '.isOpacity: invalid this.object3D.material.transparent = ' + this.object3D.material.transparent);
			return true;

		}
		return false;
	
	}

}
export default MyObject;
