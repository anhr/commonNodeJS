/**
 * @module Circle
 * @description Circle graphical object.
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

import Utils from './utils.js';

const sCircle = 'Circle', sCircleUniverse = sCircle;
let isCircleIndicesProxy = false;

class Circle extends Utils
{

	_edgesSettings;

	//base methods
	
	name( getLanguageCode ) {

		//Localization
		
		const lang = {

			name: "Circle",

		};

		const _languageCode = getLanguageCode();

		switch (_languageCode) {

			case 'ru'://Russian language

				lang.name = 'Окружность';

				break;
			default://Custom language
				if ((guiParams.lang === undefined) || (guiParams.lang.languageCode != _languageCode))
					break;

				Object.keys(guiParams.lang).forEach(function (key) {

					if (lang[key] === undefined)
						return;
					lang[key] = guiParams.lang[key];

				});

		}
		return lang.name;
		
	}
	
	//Overridden methods from base class

	isDisplay() { return true; }
	displayDebug( THREE, center, r ) {
		
		return new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(new THREE.EllipseCurve(
				center.x, center.y,// Center x, y
				r, r,// x radius, y radius
				0.0, 2.0 * Math.PI,// Start angle, stop angle
			).getSpacedPoints(256)), new THREE.LineBasicMaterial({ color: 'blue' }));
		
	}
	get verticeEdgesLengthMax() { return 2; }//нельзя добавлть новое ребро если у вершины уже 3 ребра
	Test( vertice, strVerticeId ){
		
		if (vertice.edges.length !== 2)
			console.error(sCircle + ': Test(). Invalid ' + strVerticeId + '.edges.length = ' + vertice.edges.length);
		
	}
	Indices() {
		
		const _this = this, settings = this.settings,
			position = settings.object.geometry.position;
		const debug = this.debug;

		if (settings.object.geometry.indices.count != undefined) {

			settings.object.geometry.indices[0].count = settings.object.geometry.indices.count;
			delete settings.object.geometry.indices.count;
			
		}

		if (!isCircleIndicesProxy) {
			
			settings.object.geometry.indices = new Proxy( settings.object.geometry.indices, {

				get: ( _indices, name ) => {
	
					switch (name) {
	
						case 'edges': 
							if (!_indices[0].isEdgesProxy) {
								
								_indices[0] = new Proxy(_indices[0] || [], {
			
									get: (_edges, name) => {
					
										const i = parseInt(name);
										if (!isNaN(i)) {
					
											const edgeId = i;
											let edge = _edges[edgeId];
											if (!edge) {
					
												if (edgeId != _edges.length) console.error( sCircle + ': get indices.edges: invalid edgeId = ' + edgeId );//добавлять только то ребро, индекс которого в конце массива _edges
												else {
													
													edge = {};
													_edges.push( edge );
					
												}
					
											}
											return edge;
					
										}
										switch (name) {
					
											case 'isEdgesProxy': return true;
											case 'push': return (edge={}) => {
					
												indices.faces[_this.classSettings.faceId].push( _edges.push(Edge({ edge: edge, edges: settings.object.geometry.indices.edges } ) ) - 1 );
					
											};
					
										}
										return _edges[name];
					
									},
					
								});
								indices.faceEdges.forEach( ( edge, i ) => indices.faceEdges[i] = Edge( { this: _this, edgeId: i } ) );

							}
							return _indices[0];
						case 'faceEdges': return new Proxy(_indices[0], {
			
								get: (_edges, name) => {
				
									const i = parseInt(name);
									if (!isNaN(i)) return _edges[indices.faces[_this.classSettings.faceId][i]];
									switch (name) {
				
										case 'isFaceEdgesProxy': return true;
										case 'length': return indices.faces[_this.classSettings.faceId].length;
				
									}
									return _edges[name];
				
								},
								set: (_edges, name, value) => {
				
									const i = parseInt(name);
									if (!isNaN(i)) _edges[indices.faces[_this.classSettings.faceId][i]] = value;
				
									return true;
				
								}
				
							});
						case 'faces':
							if (!_indices[1].isFacesProxy) {
								
								_indices[1] = new Proxy(_indices[1] || [], {
			
									get: (_faces, name) => {

										const i = parseInt(name);
										if (!isNaN(i)) {
					
											_faces[i] = _faces[i] || [];
											if (!_faces[i].isFaceProxy){

												_faces[i] = new Proxy( _faces[i], {

													get: (_face, name) => {

														switch (name) {
									
															case 'isFaceProxy': return true;
															case 'push': return ( edgeId ) => {

																if (debug) for ( let i = 0; i < _face.length; i++ ) {

																	if (_face[i] === edgeId ) {
																		
																		console.error( sCircle + ': Duplicate face edgeId = ' + edgeId );
																		return;

																	}
																	
																}
																_face.push( edgeId );
																const edges = _indices[0];
																if(edges[edgeId] === undefined) edges[edgeId] = {};
																	
															}
									
														}
														return _face[name];
														
													},
													
												} );
												
											}
											return _faces[i];
					
										}
										switch (name) {
					
											case 'isFacesProxy': return true;
					
										}
										return _faces[name];
					
									},
					
								});
								const edges = _indices[0];
								_indices[1].forEach( face => face.forEach( edgeId => edges[edgeId] = edges[edgeId] || {} ) );
								for ( let i = 0; i < edges.length; i++ ) edges[i] = edges[i] || {};

							}
							return _indices[1];
						
					}
					return _indices[name];
	
				},
				set: (_indices, name, value) => {
	
					switch (name) {
	
						case 'edges': _indices[0] = value; return true;
						
					}
					_indices[name] = value;
					return true;
	
				},
	
			});
			isCircleIndicesProxy = true;

		}
		
		const edgesCount = settings.object.geometry.indices[0].count || 3,//default is triangle
			indices = settings.object.geometry.indices,
			face = indices.faces[this.classSettings.faceId],

			//Тут какая то странная логическая ошибка.
			//Если надо добавлять в пустой массив face, то индекс ребра равен i
			//Если массив face не пустой то индекс ребра на 1 больше
			//Для проверки settings.object.geometry.indices.count = 10
			//settings.object.geometry.indices.faces сделать пустым а потом добавить несколько индексов ребер
			a = face.length === 0 ? 0 : 1;
		
		for ( let i = face.length; i < edgesCount; i++ ) face.push( i + a );
		
		indices.edges;//Convert edges items to Proxy
		
		//у треугольника ребер не должно быть меньше 3
//		for ( let i = indices.edges.length; i < edgesCount; i++ ) indices.edges.push();
		
		function Edge( edgeSettings = {} ) {

			const sEdge = sCircle + ': ' + (edgeSettings.edgeId === undefined ? 'Edge' : 'edges[' + edgeSettings.edgeId + ']'),
				sVertices = sEdge + '.vertices';
			edgeSettings.faceEdges = edgeSettings.edges || edgeSettings.this.settings.object.geometry.indices.faceEdges;
			edgeSettings.edge = edgeSettings.edge || edgeSettings.faceEdges[edgeSettings.edgeId] || {};
			
			if (edgeSettings.edge.isProxy) return edgeSettings.edge;

			//edge vertices

			edgeSettings.edge.vertices = edgeSettings.edge.vertices || [];
			if (debug) {

				if (edgeSettings.edge instanceof Array) {

					console.error(sEdge + '. Invalid edge instance');
					return false;

				}
				if (!(edgeSettings.edge.vertices instanceof Array)) {

					console.error(sEdge + '. Invalid edge.vertices instance');
					return false;

				}

			}
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
					(edgeSettings.edgeId === undefined) || //добавлять новую вершину потому что эта грань добавляется с помощью edges.push()
					(edgeSettings.edgeId != (edgeSettings.faceEdges.length - 1))//не добалять новую вершину если это последняя грань, потому что у последней грани последняя вершина совпадает с первой вершины первой грани
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

					if (verticeId === edgeSettings.edge.vertices[index]) {

						console.error(sVertices + '[' + i + ']. Duplicate vertice index = ' + verticeId);
						return false;

					}

				};
				return true;

			}
			for (let i = 0; i < 2; i++) {//у каждого ребра 2 вершины

				if (edgeSettings.edge.vertices[i] === undefined) {

					edgeSettings.edge.vertices[i] = (
						position.length === 0) ||//первая вершина первого ребра
						((edgeSettings.edgeId != undefined) &&//ребро из массива ребер
							(i === 1) && (edgeSettings.edgeId === edgeSettings.faceEdges.length - 1)) ?//Это последняя вершина последнего ребра. Соеденить последнюю вершину последнего ребра с первой першиной первого ребра
						0 :
						edgeSettings.edgeId != undefined ?
							position.length + (i === 0 ? -1 : 0) : //ребро из массива ребер
							//Новое ребро добавляется при помощи edges.push()
							i === 0 ? position.length : //первая вершина
								0//Соеденить последнюю вершину нового ребра с первой першиной первого ребра
						;

				}
				VerticeIdDebug(i, edgeSettings.edge.vertices[i]);

			}
			edgeSettings.faceEdges = edgeSettings.faceEdges || indices.edges;
			if (debug)

				for (let edgeCurId = (edgeSettings.edgeId === undefined) ? 0 : edgeSettings.edgeId; edgeCurId < edgeSettings.faceEdges.length; edgeCurId++) {

					if ((edgeSettings.edgeId != undefined) && (edgeSettings.edgeId === edgeCurId)) continue;//Не сравнивать одно и тоже ребро

					const edgeCur = edgeSettings.faceEdges[edgeCurId],
						verticesCur = edgeCur.vertices;
					if (!verticesCur) continue;//в данном ребре еще нет вершин
					const vertices = edgeSettings.edge.vertices;
					if (
						(vertices[0] === verticesCur[0]) && (vertices[1] === verticesCur[1]) ||
						(vertices[1] === verticesCur[0]) && (vertices[0] === verticesCur[1])
					)
						console.error(sCircle + ': Duplicate edge. Vertices = ' + vertices);

				}
			edgeSettings.edge.vertices = new Proxy(edgeSettings.edge.vertices, {

				get: (_vertices, name) => {

					const i = parseInt(name);
					if (!isNaN(i)) {

						IdDebug(i);

						return _vertices[i];

					}
					switch (name) {

						case 'length':

							if (!debug) break;
							if (_vertices.length > 2) console.error(sVertices + ' set. Invalid length = ' + _vertices.length);
							break;

					}
					return _vertices[name];

				},
				set: (_vertices, name, value) => {

					const i = parseInt(name);
					if (!isNaN(i) && !VerticeIdDebug(i, value))
						return true;
					_vertices[name] = value;
					return true;

				},

			});


			if (edgeSettings.edgeId === undefined) {

				//если вставляем новое ребро с помощью edges.push()
				//надо последнюю вершину последнего ребра заменить на новую вершину
				settings.object.geometry.indices.edges[settings.object.geometry.indices.edges.length - 1][1] = position.length - 1;

			}

			//Добавляем индекс ребра в каждую вершину, которая используется в этом ребре.
			//что бы потом проверить в vertices.test();
			if (debug) {

				const newEdgeId = edgeSettings.faceEdges.length;
				edgeSettings.edge.vertices.forEach(verticeId => {

					const edges = position[verticeId].edges;
					if (edgeSettings.edgeId === undefined) {

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

				});

			}

			//заменяем объект edgeSettings.edge на массив edgeSettings.edge.vertices для совместимости с ND
			//Сразу делать edgeSettings.edge как массив вершин не стал, потомучто будет неудобно делать edgeSettings.edges аргумент в конструкторе Circle
			Object.keys( edgeSettings.edge ).forEach( key => {

				if ( key !== 'vertices' ) {
					
					edgeSettings.edge.vertices[key] = edgeSettings.edge[key];
					delete edgeSettings.edge[key];

				}

			} );
			return new Proxy(edgeSettings.edge.vertices, {

				get: (edge, name) => {

					const i = parseInt(name);
					if (!isNaN(i)) {

						if (name >= edge.length)
							console.error(sEdge + ' get. Invalid index = ' + name);
						return edge[name];

					}
					switch (name) {

						case 'isProxy': return true;
						case 'distance': {

							//distance between edge vertices
							if (edge.distance === undefined) edge.distance = 2 * Math.PI / edgeSettings.faceEdges.length;//1.0;//выбрал длинну ребра так, что бы радиус одномерной вселенной с был равен 1.0
							return edge.distance;

						}


					}
					return edge[name];

				},
				set: (edge, name, value) => {

					//не понятно зачем вывел эту ошибку
					//console.error(sEdge + ' set. Hidden method: edges[' + name + '] = ' + JSON.stringify(value) );

					edge[name] = value;
					return true;

				},

			});

		}


		if ( debug ) {
		
			//test for duplicate vertice.edges edgeId
			//indices.edges[0].vertices[0] = 1;//error: EgocentricUniverse: Edge.vertices[0]. Duplicate vertice index = 1
			//vertices[1].edges[0] = 1;//на данный момент в vertice.edges можно иметь несколько ссылок на одно ребро потому что это не влияет на результат
			
			//indices.edges.push({});//Error: EgocentricUniverse: Duplicate edge. Vertices = 0,1
			//indices.edges.push({ vertices: [1,0] });//Error: EgocentricUniverse: Duplicate edge. Vertices = 1,0
			//indices.edges.push({ vertices: [1,2] });
			//indices.edges = [];//Error: EgocentricUniverse: indices.edges set. duplicate edges
			//indices.edges[0] = {};//Error: EgocentricUniverse: indices.edges set. Hidden method: edges[0] = {}
			/*
			indices.edges.forEach( ( edge, edgeIndex ) => {

				//indices.edges[0] = edge;//Error: Circle: indices.edges set. Hidden method: edges[0] = {"vertices":[0,1]}
				//indices.edges.push(edge);//Error: Circle: Edge. Duplicate proxy
				//const edgeVertices = edge.vertices;
				//edge.vertices = edgeVertices;
//					const edgeVerticeId = edgeVertices[0];
				//edgeVertices.forEach( ( vertice, i ) => console.log( 'indices.edges[' + edgeIndex + '].vertices[' + i + '] = ' + vertice ) );
				//edgeVertices[1] = 0;//Error: Circle: edges[0].vertices[1]. Duplicate vertice index = 0
			
			} );
		   */

		}
		
	}
	/**
	 * Circle graphical object.
	 * @param {Options} options See <a href="../../../commonNodeJS/master/jsdoc/Options/Options.html" target="_blank">Options</a>.
	 * @param {object} [classSettings] Circle class settings.
	 * @param {number} [classSettings.faceId=0] Identifier of the array of the edges ids in the <b>classSettings.settings.object.geometry.indices.faces</b> array.
	 * @param {object} [classSettings.settings] See <b>EgocentricUniverse <a href="./module-EgocentricUniverse-EgocentricUniverse.html" target="_blank">settings</a></b> parameter.
	 * @param {object} [classSettings.settings.object] edges object.
	 * @param {String} [classSettings.settings.object.name='Universe'] name of universe.
	 * @param {String} [classSettings.settings.object.color='lime'] color of edges.
	 * @param {object} [classSettings.settings.object.geometry] Universe geometry.
	 * @param {object} [classSettings.settings.object.geometry.indices] Array of <b>indices</b> of vertices, edges and faces of universe.
	 * @param {number} [classSettings.settings.object.geometry.indices.count=3] 1D Universe edges count. Default universe is triangle with 3 edges.
	 * @param {Array} [classSettings.settings.object.geometry.indices.edges=[{}, {}, {}]] Edges array. Default edges count is <b>classSettings.settings.object.geometry.indices.count</b>.
	 * @param {object} [classSettings.settings.object.geometry.indices.edges.edge] Edges array item is edge.
	 * @param {Array} [classSettings.settings.object.geometry.indices.edges.edge.vertices] Array of edge vertices indices. Every edge have two vertices.
	 * @param {float} [classSettings.settings.object.geometry.indices.edges.edge.distance=1.0] Edge length. Distance between edge vertices.
	 * @param {Array} [classSettings.settings.object.geometry.indices.faces=[[0, 1, 2]]] Faces array. Every item of the <b>faces</b> array is array of edges indices for current face.
	 * <pre>
	 * Example:
	 * [[0, 2, 3]]
	 * universe contains three edges with 0, 2 and 3 indice.
	 * </pre>
	 **/
	constructor( options, classSettings={} ) {
		
		classSettings.settings = classSettings.settings || {};
		const settings = classSettings.settings;
		settings.object = settings.object || {};
		
		super( options, classSettings );
		
		settings.object.name = settings.object.name || this.name( options.getLanguageCode );
		const _this = this;
		this.options = options;
		this.settings = settings;
		
		settings.object.geometry = settings.object.geometry || {};
		if (settings.object.geometry.indices) {

			if (!settings.object.geometry.indices.isUniversyProxy) {

				const indices = [];
				Object.keys(settings.object.geometry.indices).forEach(key => indices[key] = settings.object.geometry.indices[key]);
				settings.object.geometry.indices = indices;

			}

		} else settings.object.geometry.indices = {};
		if (!settings.object.geometry.indices.isUniversyProxy) {

			settings.object.geometry.indices[0] = settings.object.geometry.indices[0] || settings.object.geometry.indices.edges || [];
			settings.object.geometry.indices[1] = settings.object.geometry.indices[1] || settings.object.geometry.indices.faces || [];
			settings.object.geometry.indices = new Proxy(settings.object.geometry.indices ? settings.object.geometry.indices : [], {

				get: function (_indices, name) {

					const i = parseInt(name);
					if (!isNaN(i)) return _indices[i];

					switch (name) {

						case 'isUniversyProxy': return true;

					}
					return _indices[name];

				}

			});

		}

		/**
		 * @description array of Vertices.
		 **/
		settings.object.geometry.position = settings.object.geometry.position || new Proxy([], {

			get: function (_position, name) {

				const i = parseInt(name);
				if (!isNaN(i)) {

					if (i >= _position.length)
						console.error(sCircleUniverse + ': position get. Invalid index = ' + i + ' position.length = ' + _position.length);
					return _position[i];

				}
				switch (name) {

					case 'push': return (vertice = []) => {

						_position.push(new Proxy(vertice, {

							get: (vertice, name) => {

								switch (name) {

									case 'edges':

										if (!_this.debug) {

											console.error(sCircleUniverse + ': vertice.edges. Set debug = true first.');
											return;

										}
										vertice.edges = vertice.edges || new Proxy([], {

											get: (edges, name) => {

												switch (name) {

													case 'push': return (edgeId, verticeId) => {

														if (_this.debug) {

															const sPush = sCircleUniverse + ': Vertice' + (verticeId === undefined ? '' : '[' + verticeId + ']') + '.edges.push(' + edgeId + '):';

															if (edges.length >= this.verticeEdgesLengthMax) {

																console.error(sPush + ' invalid edges.length = ' + edges.length);
																return;

															}
															//find for duplicate edgeId
															for (let j = 0; j < edges.length; j++) {

																if (edges[j] === edgeId) {

																	console.error(sPush + ' duplicate edgeId: ' + edgeId);
																	return;

																}

															}

														}

														edges.push(edgeId);

													}

												}
												return edges[name];

											},
										});
										return vertice.edges;

								}
								return vertice[name];

							},

						}));

					};
						break;
					//for debug
					case 'test': return () => {

						//соеденить конец последнего ребра с началом первого ребра
						//indices.edges[indices.edges.length - 1].vertices[1] = indices.edges[0].vertices[0];

						if (!_this.debug) return;

						_position.forEach((vertice, verticeId) => {

							const str1 = sCircleUniverse + ': position.test()', strVerticeId = 'position(' + verticeId + ')';
							_this.Test(vertice, strVerticeId);
							vertice.edges.forEach(edgeId => {

								if (typeof edgeId !== "number") console.error(str1 + '. ' + strVerticeId + '. Invalid edgeId = ' + edgeId);

							});

						})
					}
						break;

				}
				return _position[name];

			},
			set: function (_position, name, value) {

				const i = parseInt(name);
				if (!isNaN(i)) {

					value.forEach((axis, j) => {

						if (isNaN(axis)) console.error(sCircleUniverse + ': position set. position[' + i + '][' + j + '] = ' + axis);
						else if ((_position[i].push(axis) - 1) != j)
							console.error(sCircleUniverse + ': position set. position[' + i + '][' + j + '] = ' + axis + ' Invalid new axis index = ' + j);

					});

				}
				return true;

			}

		});

		//settings.count = 'count';//Error: Edges: indices.edges set. Invalid edges array: count
		//settings.count = [{ isProxy: true }];//Error: Faces: faces[0]. Duplicate proxy
		//settings.count = [{ edges: true }];//Error: Faces: faces[0]. Invalid face.edges instance: true
		//settings.count = [[]];//Error: Faces: faces[0]. Invalid face instance
		this.Indices();

		this.pushEdge = (edge) => {
			
			classSettings.settings.object.geometry.indices.edges.push( edge );
			
		}

		this.logCircle = () => {

			if (!_this.debug) return;
			_this.settings.object.geometry.position.forEach((vertice, i) => console.log('position[' + i + '] = ' + JSON.stringify(vertice)));
			_this.settings.object.geometry.indices.edges.forEach((edge, i) => console.log('indices.edges[' + i + '] = ' + JSON.stringify(edge)));
			_this.settings.object.geometry.indices.faces.forEach((face, i) => console.log('indices.faces[' + i + '] = ' + JSON.stringify(face)));

		}
//		this.isDisplay = () => { return true; }
/*		
		this.displayDebug = ( THREE, center, r ) => {

			return new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(new THREE.EllipseCurve(
					center.x, center.y,// Center x, y
					r, r,// x radius, y radius
					0.0, 2.0 * Math.PI,// Start angle, stop angle
				).getSpacedPoints(256)), new THREE.LineBasicMaterial({ color: 'blue' }));
			
		}
*/  
		//Project a circle into 3D space
		this.project = (
			scene,
//			n = 2,//space dimension
		) => {
	
//			this.projectUtils( scene, 2 ;
			super.project( scene, 2 );//, settings );
//			this.display( n, settings );
			this.logCircle();
	
		}

	}

}

export default Circle;
