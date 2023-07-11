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

const sUtils = 'Utils', sOverride = sUtils + ': Please override the %s method in your child class.',
	sVertices = sUtils + ': vertices';
let g_debug;

class Utils {

	//base methods
	
	displayDebug() { console.error(sOverride.replace('%s', 'displayDebug')); }
	isDisplay() { return false; }
	TestFace() {

		//Индексы всех вершин грани должны оборазовать замкнутое кольцо
		const faceId = this.classSettings.faceId,
			sFaceId = 'faces[' + faceId + ']',
			edges = this.edges,
			edge0 = edges[0], edge1 = edges[1],
			
			//Поменять местами вершины нулевого ребра если индекса первой вершины нулевого ребра не имеется в первом ребре
			//Это нужно чтобы цепочка вершин грани не имела разрывов
			vertice0 = (edge0[1] === edge1[0]) || (edge0[1] === edge1[1]) ? edge0[0] : edge0[1], vertice1 = vertice0 === edge0[0] ? edge0[1] : edge0[0],
			
			verticeIds = [vertice0, vertice1];
		for (let edgeId = 1; edgeId < edges.length; edgeId++) {

			const edge = edges[edgeId];
			if (edge.length != 2) {

				console.error(sUtils + '.TestFace: Invalid edges[' + edgeId + '].length = ' + edge.length);
				return;

			}
			let lastVerticeId = verticeIds[verticeIds.length - 1];
			if (lastVerticeId === edge[0])
				verticeIds.push(edge[1]);
			else if (lastVerticeId === edge[1])
				verticeIds.push(edge[0]);
			else console.error(sUtils + '.TestFace: gap between ' + sFaceId + '.edges[' + edgeId + ']');

		}
		if (verticeIds[0] != verticeIds[verticeIds.length - 1]) console.error(sUtils + '.TestFace: The loop of the edges of the ' + sFaceId + ' is broken.');
	}

	boCreate = true;
	get debug() { return g_debug; }
	get edges () {

		if (!this.edgesProxy) {

			const settings = this.classSettings.settings, indices = settings.object.geometry.indices, face = indices.faces[this.classSettings.faceId],
//				position = settings.object.geometry.position,
//				_this = this,
				debug = this.debug;
			this.edgesProxy = new Proxy(indices.edges, {

				get: (_edges, name) => {

					const i = parseInt(name),
						position = settings.object.geometry.position;
					if (!isNaN(i)) {

						const edgeId = face[i];
						let edge = _edges[edgeId];

						//for compatibility with ND
						if (face.find(edgeIdcur => edgeIdcur === edgeId) === undefined)
							return edge;//Это ребро не входит в данную грань. Его не надо преобразовывать в массив.

						if (!edge) {

							if (edgeId != _edges.length) console.error(sUtils + ': get indices.edges: invalid edgeId = ' + edgeId);//добавлять только то ребро, индекс которого в конце массива _edges
							else {

								edge = {};
								_edges.push(edge);

							}

						}
						if (!edge.isProxy) {

							if (!this.boCreate) return edge;
							const vertices = edge.vertices || [];
							Object.keys(edge).forEach(key => {

								if (key !== 'vertices') vertices[key] = edge[key];

							});
							function IdDebug(i) {

								if (!debug) return true;

								if ((i < 0) || (i > 1)) {

									console.error(sVertices + '. Vertices index = ' + i + ' is limit from 0 to 1');
									return false;

								}
								return true;

							}
							function VerticeIdDebug(i, verticeId) {

								if ((verticeId === position.length) && (//этой вершины нет списке вершин
									(edgeId === undefined) || //добавлять новую вершину потому что эта грань добавляется с помощью edges.push()
									(edgeId != face[face.length - 1])//не добалять новую вершину если это последняя грань, потому что у последней грани последняя вершина совпадает с первой вершины первой грани
								)
								)
									position.push();

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
											(i === 1) && (edgeId === face[face.length - 1])) ?//Это последняя вершина последнего ребра. Соеденить последнюю вершину последнего ребра с первой першиной первого ребра
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
							_edges[edgeId] = vertices;
							edge = _edges[edgeId]//converts edge to Proxy

						}
						return edge;


					}
					switch (name) {

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
		return this.edgesProxy;
	
	}
	
	constructor( options, classSettings ) {

		if (classSettings.faceId === undefined) classSettings.faceId = 0;
		this.classSettings = classSettings;
		
		g_debug = classSettings.debug != undefined ? classSettings.debug : g_debug != undefined? g_debug : false;

		//display graphic object to the canvas
		this.display = (n,//space dimension
			params={}
		) => {

			const settings = this.classSettings.settings;
			settings.options = options;
			settings.object.name = settings.object.name || lang.name;
			const nd = new ND(n, settings);
			if (params.position) {
				
				nd.object3D.position.x = params.position.x || 0;
				nd.object3D.position.y = params.position.y || 0;
				nd.object3D.position.z = params.position.z || 0;

			}
			if (params.debugObject) settings.scene.add(params.debugObject);

		}

		this.remove = (scene) => {

			for (var i = scene.children.length - 1; i >= 0; i--) {

				const child = scene.children[i];
				scene.remove(child);
				if (options.guiSelectPoint) options.guiSelectPoint.removeMesh(child);

			}

		}

	}

}

Utils.ND = ND;

export default Utils;