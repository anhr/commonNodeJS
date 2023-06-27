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
import three from '../three.js';

const sCircle = 'Circle';//, sCircleUniverse = sCircle;

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
	Test(){

		const geometry = this.classSettings.settings.object.geometry;
		geometry.position.test();
		geometry.indices.faces.test();
		
	}
	TestVertice( vertice, strVerticeId ){
		
		if (vertice.edges.length !== 2)
			console.error(sCircle + ': Test(). Invalid ' + strVerticeId + '.edges.length = ' + vertice.edges.length);
		
	}
	TestFace( face, sFaceId ){}
	Indices() {
		
		const _this = this, settings = this.classSettings.settings;
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
										case 'pushDefault': return (edge) => {
					
											_edges.push(edge);
					
										};
										case 'push': return (edge={}) => {

//											const edgesLength = _edges.push({ edge: edge, edges: settings.object.geometry.indices.edges } );
											
											const edgesLength = _edges.push(edge),
												facesLength = indices.faces[_this.classSettings.faceId].push(edgesLength - 1);
											if (settings.object.geometry.position.length != 0) 
												//позиции вершин уже вычислены
												this.edges[facesLength -1];//convert edge to Proxy
											return edgesLength;
//											indices.faces[_this.classSettings.faceId].push(_edges.push(edge) - 1);
					
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
															const length = _face.push( edgeId ),
																edges = _indices[0];
															if(edges[edgeId] === undefined) edges[edgeId] = {};
															return length;
																	
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
										case 'test': return () => {}
					
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
		
		indices.edges;//Convert edges to Proxy
		
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
	 * @param {Options} options See <a href="../../../jsdoc/Options/Options.html" target="_blank">Options</a>.
	 * @param {object} [classSettings] Circle class settings.
	 * @param {number} [classSettings.faceId=0] Identifier of the array of the edges ids in the <b>classSettings.settings.object.geometry.indices.faces</b> array.
	 * @param {object} [classSettings.settings] The following settings are available
	 * @param {object} [classSettings.settings.object] circle object.
	 * @param {String} [classSettings.settings.object.name='Circle'] name of circle.
	 * @param {String} [classSettings.settings.object.color='lime'] color of edges.
	 * @param {object} [classSettings.settings.object.geometry] Circle geometry.
	 * @param {object} [classSettings.settings.object.geometry.indices] Array of <b>indices</b> of vertices, edges and faces of circle.
	 * @param {number} [classSettings.settings.object.geometry.indices.count=3] edges count. Default circle is triangle with 3 edges.
	 * @param {Array} [classSettings.settings.object.geometry.indices.edges=[{},{},{}]] Edges array. Default edges count is <b>classSettings.settings.object.geometry.indices.count</b>.
	 * @param {object} [classSettings.settings.object.geometry.indices.edges.edge] Edges array item is edge.
	 * @param {Array} [classSettings.settings.object.geometry.indices.edges.edge.vertices] Array of edge vertices indices. Every edge have two vertices.
	 * @param {float} [classSettings.settings.object.geometry.indices.edges.edge.distance=2.732050807568877] Edge length. Distance between edge vertices.
	 * @param {Array} [classSettings.settings.object.geometry.indices.faces=[[0, 1, 2]]] Faces array. Every item of the <b>faces</b> array is array of edges indices for current face.
	 * <pre>
	 * Example:
	 * [[0, 2, 3]]
	 * circle contains three edges with 0, 2 and 3 indice.
	 * </pre>
	 * @param {boolean} [classSettings.debug=false] Debug mode. Diagnoses your code and display detected errors in console
	 **/
	constructor( options, classSettings={} ) {
		
		classSettings.settings = classSettings.settings || {};
		const settings = classSettings.settings;
		settings.object = settings.object || {};
		
		super( options, classSettings );
		
		settings.object.name = settings.object.name || this.name( options.getLanguageCode );
		const _this = this;
		this.options = options;
		
		settings.object.geometry = settings.object.geometry || {};
		if (settings.object.geometry.indices) {

			if (!settings.object.geometry.indices.isUniversyProxy) {

				const indices = [];
				Object.keys(settings.object.geometry.indices).forEach(key => indices[key] = settings.object.geometry.indices[key]);
				settings.object.geometry.indices = indices;

			}

		} else settings.object.geometry.indices = [];
		
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
						console.error(sCircle + ': position get. Invalid index = ' + i + ' position.length = ' + _position.length);
					return _position[i];

				}
				switch (name) {

					case 'push': return (vertice = []) => {

						return _position.push(new Proxy(vertice, {

							get: (vertice, name) => {

								switch (name) {

									case 'distanceTo': return (verticeTo) => {

										if (vertice.length != verticeTo.length) {
											
											console.error(sCircle + ': settings.object.geometry.position[i].distanceTo(...). vertice.length != verticeTo.length');
											return;
											
										}
										//const distance = new three.THREE.Vector3(vertice[0], vertice[1], vertice[2], ).distanceTo(new three.THREE.Vector3(verticeTo[0], verticeTo[1], verticeTo[2], ));
										let sum = 0;
										vertice.forEach((axis, i) => {

											const d = axis - verticeTo[i];
											sum += d * d;
											
										})
										return Math.sqrt(sum);
									}
									case 'edges':

										if (!_this.debug) {

											console.error(sCircle + ': vertice.edges. Set debug = true first.');
											return;

										}
										vertice.edges = vertice.edges || new Proxy([], {

											get: (edges, name) => {

												switch (name) {

													case 'push': return (edgeId, verticeId) => {

														if (typeof edgeId === "object") {

															//find edgeId
															const edges = settings.object.geometry.indices.edges;
															for (let i = 0; i < edges.length; i++) {

																const edge = edges[i];
																if ((edge[0] === edgeId[0]) && (edge[1] === edgeId[1]) || (edge[0] === edgeId[1]) || (edge[1] === edgeId[0])){

																	edgeId = i;
																	break;
																	
																}
																
															}
															
														}
														if (_this.debug) {

															const sPush = sCircle + ': Vertice' + (verticeId === undefined ? '' : '[' + verticeId + ']') + '.edges.push(' + edgeId + '):';

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

						if (!_this.debug) return;

						_position.forEach( ( vertice, verticeId ) => {

							const strVerticeId = 'position[' + verticeId + ']'
							_this.TestVertice( vertice, strVerticeId );
							vertice.edges.forEach(edgeId => {

								if (typeof edgeId !== "number") console.error(sCircle + ': position.test()', strVerticeId = 'position(' + verticeId + ')' + '. ' + strVerticeId + '. Invalid edgeId = ' + edgeId);

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

						if (isNaN(axis)) console.error(sCircle + ': position set. position[' + i + '][' + j + '] = ' + axis);
						else if ((_position[i].push(axis) - 1) != j)
							console.error(sCircle + ': position set. position[' + i + '][' + j + '] = ' + axis + ' Invalid new axis index = ' + j);

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

		/**
		 * adds a new edge to the circle
		 * @param {object} edge new edge. See <b>classSettings.settings.object.geometry.indices.edges.esge</b> of the <b>Circle</b> parameters for details
		 */
		this.pushEdge = (edge) => {
			
			classSettings.settings.object.geometry.indices.edges.push( edge );
			
		}

		this.logCircle = () => {

			if (!_this.debug) return;
			const settings = _this.classSettings.settings;
			settings.object.geometry.position.forEach( ( vertice, i ) => console.log( 'position[' + i + '] = ' + JSON.stringify(vertice) + ' edges = ' + JSON.stringify(vertice.edges) ) );
			settings.object.geometry.indices[0].forEach( ( edge, i ) => console.log( 'indices.edges[' + i + '] = ' + JSON.stringify(edge) + ' distance = ' + edge.distance ) );
			settings.object.geometry.indices[1].forEach( (face, i ) => console.log( 'indices.faces[' + i + '] = ' + JSON.stringify(face) ) );

		}

		/**
		 * Projects a circle to the canvas 
		 * @param {THREE.Scene} scene [THREE.Scene]{@link https://threejs.org/docs/index.html?q=sce#api/en/scenes/Scene}
		 * @param {object} [params={}] The following parameters are available
		 * @param {object} [params.center={x: 0.0, y: 0.0}] center of the sphere
		 * @param {float} [params.center.x=0.0] X axis of the center
		 * @param {float} [params.center.y=0.0] Y axis of the center
		 * @param {float} [params.radius=1.0] radius of the sphere
		 */
		this.project = (scene, params={}) => {

			const THREE = three.THREE, settings = this.classSettings.settings;

			params.center = params.center || {x: 0.0, y: 0.0}
			
			//remove previous circle
			this.remove(scene);
	
//			const indices = settings.object.geometry.indices;
	
			//edges length
			let l = 0;
			//indices.faces[this.classSettings.faceId].forEach(edgeId => l += indices.edges[edgeId].distance );
			//indices.faceEdges.forEach(edge => l += edge.distance);
			this.edges.forEach(edge => l += edge.distance);
			if ( isNaN( l ) || !isFinite( l ) ) {
	
				console.error(sCircle + ': project(...). Invalid edges length = ' + l);
				return;
	
			}
			const r = params.radius !== undefined ? params.radius : 1.0,//l / (2 * Math.PI),
//				center = new THREE.Vector2(params.center.x, params.center.y),
				axis = new THREE.Vector3(0, 0, 1),
				point0 = new THREE.Vector3(0, -r, 0),
				delta = 2 * Math.PI / l;
			let angle = 0.0;//Угол поворота радиуса окружности до текущей вершины
			this.edges.forEach( ( edge, i ) => {
				
				if (settings.object.geometry.position[i].length === 0) {
					
					let point;
					if (i === 0) point = point0;
					else {
		
						angle += edge.distance * delta;
						point = new THREE.Vector3().copy(point0).applyAxisAngle(axis, angle);
		
					}
					settings.object.geometry.position[i] = point.toArray();
	
				}
				
			} );

/*Непонятно почему то если указать позицию сцены то позиция объектов на этой сцене не изменится			
			settings.scene = scene.add(new THREE.Group());
			settings.scene.position.copy(new THREE.Vector3(params.center.x, params.center.y));
*/   
			settings.scene = scene;
	
			this.Test();
//			settings.object.geometry.position.test();
			
			if (this.isDisplay()) this.display( 2, {
				
				debugObject: this.debug ? this.displayDebug(THREE, new THREE.Vector2(params.center.x, params.center.y), r, scene) : undefined,
//				debugObject: this.debug ? this.displayDebug(THREE, new THREE.Vector2(), r) : undefined,
//				position: [params.center.x, params.center.y],
				position: params.center,
				
			});
				
			this.logCircle();
	
		}

	}

}

export default Circle;
