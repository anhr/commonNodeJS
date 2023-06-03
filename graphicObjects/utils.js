/**
 * @module Utils
 * @description utilities class.
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

import ND from '../nD/nD.js';
//import ND from '../nD/build/nD.module.js';
//import ND from '../nD/build/nD.module.min.js';
//import ND from 'https://raw.githack.com/anhr/commonNodeJS/master/nD/nD.js';
//import ND from 'https://raw.githack.com/anhr/commonNodeJS/master/nD/build/nD.module.js';
//import ND from 'https://raw.githack.com/anhr/commonNodeJS/master/nD/build/nD.module.min.js';
if (ND.default) ND = ND.default;

import three from '../three.js';

const sUtils = 'Utils', sOverride = sUtils + ': Please override the %s method in your child class.';

class Utils {

	//base methods
	
	displayDebug() { console.error(sOverride.replace('%s', 'displayDebug')); }
	isDisplay() { return false; }

	//Project of the circle or triangle into 3D space
//		this.projectUtils =
	project
	(
		scene,
		n,//space dimension
//		settings,
	) {

		const settings = this.classSettings.settings;
		
		//remove previous universe
		this.remove(scene);

		const THREE = three.THREE, indices = settings.object.geometry.indices;

		//edges length
		let l = 0;
		//indices.faces[this.classSettings.faceId].forEach(edgeId => l += indices.edges[edgeId].distance );
		//indices.faceEdges.forEach(edge => l += edge.distance);
		this.edges.forEach(edge => l += edge.distance);
		if (isNaN(l)) {

			console.error(sUtils + ': project(...). Invalid edges length = ' + l);
			return;

		}
		const r = l / (2 * Math.PI),
			center = new THREE.Vector2(0.0, 0.0),
			axis = new THREE.Vector3(0, 0, 1),
			point0 = new THREE.Vector3(0, -r, 0),
			delta = 2 * Math.PI / l;
		let angle = 0.0;//Угол поворота радиуса окружности до текущей вершины
/*		
		settings.object.geometry.position[0] = point0.toArray();
		for (let i = 1; i < indices.faceEdges.length; i++) {

			angle += indices.faceEdges[i].distance * delta;
			if (settings.object.geometry.position[i].length === 0) settings.object.geometry.position[i] = new THREE.Vector3().copy(point0).applyAxisAngle(axis, angle).toArray();

		}
*/
//		indices.faceEdges
		this.edges.forEach( ( edge, i ) => {
			
			if (settings.object.geometry.position[i].length === 0) {
				
				let point;
				if (i === 0) point = point0;
				else {
	
//					angle += indices.faceEdges[i].distance * delta;
					angle += edge.distance * delta;
					point = new THREE.Vector3().copy(point0).applyAxisAngle(axis, angle);
	
				}
				settings.object.geometry.position[i] = point.toArray();

			}
			
		} );

		settings.scene = scene;

		if (this.isDisplay()) this.display(n,// settings,
			this.debug ? this.displayDebug(THREE, center, r, scene) : undefined);
		//			if (this.isDisplay()) this.displayDebug( THREE, center, r );
		/*						 
					this.display(n, settings, this.debug ? 
						new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(new THREE.EllipseCurve(
							center.x, center.y,// Center x, y
							r, r,// x radius, y radius
							0.0, 2.0 * Math.PI,// Start angle, stop angle
						).getSpacedPoints(256)), new THREE.LineBasicMaterial({ color: 'blue' }))
						: undefined
					);
		*/

	}

	get edges() {
		
//			return classSettings.settings.object.geometry.indices.faces[classSettings.faceId];
		const settings = this.classSettings.settings, indices = settings.object.geometry.indices, face = indices.faces[this.classSettings.faceId],
			position = settings.object.geometry.position, _this = this, debug = this.debug;
		return new Proxy( indices.edges, {
		
			get: ( _edges, name ) => {

				const i = parseInt( name );
				if (!isNaN(i)) {
					
//					console.log(this);
//					return _edges[face[i]];
					const edgeId = face[i];
					let edge = _edges[edgeId];
										
					//for compatibility with ND
//					if ( indices.faces[this.classSettings.faceId].find( edgeId => edgeId === i ) === undefined )
					if ( face.find( edgeIdcur => edgeIdcur === edgeId ) === undefined )
						return edge;//Это ребро не входит в данную грань. Его не надо преобразовывать в массив.
					
					if (!edge) {

						if (edgeId != _edges.length) console.error( sCircle + ': get indices.edges: invalid edgeId = ' + edgeId );//добавлять только то ребро, индекс которого в конце массива _edges
						else {
								
							edge = {};
							_edges.push( edge );

						}

					}
					if ( !edge.isProxy )//&& !_edges.isCreateEdge )
					{
						
//											_edges.isCreateEdge = true;
//											edge = Edge( { this: _this, edgeId: edgeId } );
						const vertices = edge.vertices || [];
						Object.keys( edge ).forEach( key => {
			
							if ( key !== 'vertices' ) vertices[key] = edge[key];
			
						} );
						function IdDebug(i) {
						
							if (!debug) return true;
						
							if ((i < 0) || (i > 1)) {
						
								console.error(sVertices + '. Vertices index = ' + i + ' is limit from 0 to 1');
								return false;
						
							}
							return true;
						
						}
						function VerticeIdDebug(i, verticeId) {
						
							if ( (verticeId === position.length) && (//этой вершины нет списке вершин
								( edgeId === undefined ) || //добавлять новую вершину потому что эта грань добавляется с помощью edges.push()
								( edgeId != ( _this.edges.length - 1))//не добалять новую вершину если это последняя грань, потому что у последней грани последняя вершина совпадает с первой вершины первой грани
							)
							)
								position.push();//{edgeId: edgeIndex});
						
							if (!debug) return true;
						
							if (!IdDebug(i)) return false;
						
							if (isNaN(parseInt(verticeId))) {
						
								console.error(sVertices + '[' + i + ']. Invalid vertice index = ' + verticeId);
								return false;
						
							}
							if ((verticeId < 0) || (verticeId >= position.length)) {
						
								console.error(sVertices + '[' + i + ']. Vertice index = ' + verticeId + ' is limit from 0 to ' + (position.length - 1));
								return false;
						
							}
							for (let index = 0; index < 2; index++) {
						
								if (index === i) continue;//не надо сравнивать самого себя
						
								if (verticeId === vertices[index]) {
						
									console.error(sVertices + '[' + i + ']. Duplicate vertice index = ' + verticeId);
									return false;
						
								}
						
							};
							return true;
						
						}
						for (let i = 0; i < 2; i++) {//у каждого ребра 2 вершины
						
							if (vertices[i] === undefined) {
						
								vertices[i] = (
									position.length === 0) ||//первая вершина первого ребра
									((edgeId != undefined) &&//ребро из массива ребер
										(i === 1) && (edgeId === _this.edges.length - 1)) ?//Это последняя вершина последнего ребра. Соеденить последнюю вершину последнего ребра с первой першиной первого ребра
									0 :
									edgeId != undefined ?
										position.length + (i === 0 ? -1 : 0) : //ребро из массива ребер
										//Новое ребро добавляется при помощи edges.push()
										i === 0 ? position.length : //первая вершина
											0//Соеденить последнюю вершину нового ребра с первой першиной первого ребра
									;
						
							}
							VerticeIdDebug(i, vertices[i]);
						
						}
						edge = new Proxy( vertices, {

							get: (_edge, name) => {
			
								const i = parseInt(name);
								if (!isNaN(i)) {
			
									if (name >= _edge.length)
										console.error(sEdge + ' get. Invalid index = ' + name);
									return _edge[name];
			
								}
								switch (name) {
			
									case 'isProxy': return true;
									case 'distance': {
			
										//distance between edge vertices
//															if (_edge.distance === undefined) _edge.distance = 2 * Math.PI / edgeSettings.faceEdges.length;//1.0;//выбрал длинну ребра так, что бы радиус одномерной вселенной с был равен 1.0
										if (_edge.distance === undefined) _edge.distance = 2 * Math.PI / _this.edges.length;//1.0;//выбрал длинну ребра так, что бы радиус одномерной вселенной с был равен 1.0
										return _edge.distance;
			
									}
			
			
								}
								return _edge[name];
			
							},
							set: (_edge, name, value) => {
			
								//не понятно зачем вывел эту ошибку
								//console.error(sEdge + ' set. Hidden method: edges[' + name + '] = ' + JSON.stringify(value) );
			
								_edge[name] = value;
								return true;
			
							},
			
						});

						if (debug)
						
							for (let edgeCurId = ( edgeId === undefined ) ? 0 : edgeId; edgeCurId < _this.edges.length; edgeCurId++) {
						
								if ( ( edgeId != undefined ) && ( edgeId === edgeCurId ) ) continue;//Не сравнивать одно и тоже ребро
						
								const verticesCur = _this.edges[edgeCurId];
//													if (!verticesCur) continue;//в данном ребре еще нет вершин
								const vertices = edge;
								if (
									(vertices[0] === verticesCur[0]) && (vertices[1] === verticesCur[1]) ||
									(vertices[1] === verticesCur[0]) && (vertices[0] === verticesCur[1])
								)
									console.error(sCircle + ': Duplicate edge. Vertices = ' + vertices);
						
							}
/*
						if (edgeSettings.edgeId === undefined) {
						
							//если вставляем новое ребро с помощью edges.push()
							//надо последнюю вершину последнего ребра заменить на новую вершину
							settings.object.geometry.indices.edges[settings.object.geometry.indices.edges.length - 1][1] = position.length - 1;
						
						}
*/
						//Добавляем индекс ребра в каждую вершину, которая используется в этом ребре.
						//что бы потом проверить в vertices.test();
						if (debug) {
						
							const newEdgeId = _this.edges.length;
							edge.forEach(verticeId => {

								position[verticeId].edges.push( edgeId, verticeId );
/*													
								const edges = position[verticeId].edges;
								if (edgeId === undefined) {
						
									//новое ребро добавляется с помощю push
									if (verticeId === 0)
										//в первой вершине заменяем последнее ребро на новое ребро
										edges[1] = newEdgeId
									//В последнюю вершину добавляем новое ребро
									else edges.push(newEdgeId,
										verticeId//for debug
									);
						
								} else edges.push(edgeSettings.edgeId,
									verticeId//for debug
								);
*/			 
						
							});
						
						}
						
						_edges[edgeId] = edge;
//											delete _edges.isCreateEdge;

					}
					return edge;

					
				}
				switch ( name ) {

//						case 'isFaceEdgesProxy': return true;
					case 'length': return face.length;

				}
				return _edges[name];

			},
			set: (_edges, name, value) => {

				const i = parseInt(name);
				if (!isNaN(i)) _edges[face[i]] = value;

				return true;

			}

		});

	}
	
	constructor( options, classSettings ) {

		if (classSettings.faceId === undefined) classSettings.faceId = 0;
		this.classSettings = classSettings;
		
		this.debug = true;
//		this.THREE = three.THREE;

		//display graphic object to the canvas
		this.display = (n,//space dimension
			//settings,
			debugObject
		) => {

			const settings = this.settings;
			settings.options = options;
			settings.object.name = settings.object.name || lang.name;
			new ND(n, settings);

//			const debugObject = this.displayDebug();
			if (debugObject) settings.scene.add(debugObject);

		}

		this.remove = (scene) => {

			for (var i = scene.children.length - 1; i >= 0; i--) {

				const child = scene.children[i];
				scene.remove(child);
				if (options.guiSelectPoint) options.guiSelectPoint.removeMesh(child);

			}
			//remove previous position
			//непонятно зачем эта строка
//			settings.object.geometry.position.forEach(vertice => vertice.length = 0);

		}

	}

}

Utils.ND = ND;

export default Utils;