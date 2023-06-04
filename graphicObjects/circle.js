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
		
		const _this = this, settings = this.settings;
		const debug = this.debug;

		if (settings.object.geometry.indices.count != undefined) {

			settings.object.geometry.indices[0].count = settings.object.geometry.indices.count;
			delete settings.object.geometry.indices.count;
			
		}

		settings.object.geometry.indices = new Proxy( settings.object.geometry.indices, {

			get: ( _indices, name ) => {
	
				switch (name) {
	
					case 'edges': 
						if (!_indices[0].isEdgesProxy) {
								
							_indices[0] = new Proxy(_indices[0] || [], {
			
								get: (_edges, name) => {
					
									const i = parseInt(name);
									if (!isNaN(i)) return _edges[i];
									switch (name) {
					
										case 'isEdgesProxy': return true;
										case 'push': return (edge={}) => {
					
											indices.faces[_this.classSettings.faceId].push( _edges.push({ edge: edge, edges: settings.object.geometry.indices.edges } ) - 1 );
					
										};
					
									}
									return _edges[name];
					
								},
					
							});

						}
						return _indices[0];
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
		
		settings.object.geometry.indices[0] = settings.object.geometry.indices[0] || settings.object.geometry.indices.edges || [];
		settings.object.geometry.indices[1] = settings.object.geometry.indices[1] || settings.object.geometry.indices.faces || [];

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

							_this.Test(vertice, strVerticeId);
							vertice.edges.forEach(edgeId => {

								if (typeof edgeId !== "number") console.error(sCircleUniverse + ': position.test()', strVerticeId = 'position(' + verticeId + ')' + '. ' + strVerticeId + '. Invalid edgeId = ' + edgeId);

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
			_this.settings.object.geometry.position.forEach( ( vertice, i ) => console.log( 'position[' + i + '] = ' + JSON.stringify(vertice) + ' edges = ' + JSON.stringify(vertice.edges) ) );
			_this.settings.object.geometry.indices.edges.forEach( ( edge, i ) => console.log( 'indices.edges[' + i + '] = ' + JSON.stringify(edge) + ' distance = ' + edge.distance ) );
			_this.settings.object.geometry.indices.faces.forEach( (face, i ) => console.log( 'indices.faces[' + i + '] = ' + JSON.stringify(face) ) );

		}

		//Project a circle into 3D space
		this.project = (
			scene,
		) => {

			this.settings.object.geometry.position.test();
			super.project( scene, 2 );
			this.logCircle();
	
		}

	}

}

export default Circle;
