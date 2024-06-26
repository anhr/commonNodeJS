/**
 * @module Sphere
 * @description Sphere graphical object.
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

//import Edges from './edges.js';
import Circle from './circle.js';
import Triangle from './triangle.js';

//debug

import FibonacciSphereGeometry from '../FibonacciSphere/FibonacciSphereGeometry.js'
import three from '../three.js'

const sSphere = 'Sphere';
let isFacesIndicesProxy = false;

class Sphere extends Circle
{

	//Overridden methods from base class

	displayDebug( THREE, center, r, scene ) {

		return super.displayDebug( THREE, center, r );
		
	}
	name( getLanguageCode ) {

		//Localization
		
		const lang = {

			name: "Sphere",

		};

		const _languageCode = getLanguageCode();

		switch (_languageCode) {

			case 'ru'://Russian language

				lang.name = 'Сфера';

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
	logSphere() {

		if (!this.debug) return;
		this.logCircle();
		this.classSettings.settings.object.geometry.indices.bodies.forEach((body, i) => console.log('indices.bodies[' + i + '] = ' + JSON.stringify( body )));
		
	}
	get verticeEdgesLengthMax() { return 6 }//нельзя добавлять новое ребро если у вершины уже 6 ребер
	TestVertice( vertice, strVerticeId ){
		
		if ((vertice.edges.length !== 3)//пирамида
			&& (vertice.edges.length !== 6))
			console.error(sSphere + '. Invalid ' + strVerticeId + '.edges.length = ' + vertice.edges.length);
		
	}
	TestFace( faceId, sFaceId ){

		const length = this.classSettings.settings.object.geometry.indices[1][faceId].length;
		if (length !== 3)//пирамида
			console.error(sSphere + '. Invalid ' + sFaceId + '.length = ' + length);
		super.TestFace( faceId, sFaceId );
		
	}
	Indices(){

		const settings = this.classSettings.settings,
			sIndices = sSphere + '.Indices';
		if (settings.object.geometry.indices.count != undefined) {

			settings.object.geometry.indices[1].count = settings.object.geometry.indices.count;
			delete settings.object.geometry.indices.count;
			
		}
		
		settings.object.geometry.indices[2] = settings.object.geometry.indices[2] || settings.object.geometry.indices.bodies || [];
		
		super.Indices();
		const debug = this.debug;
		
		if (!isFacesIndicesProxy) {

			settings.object.geometry.indices = new Proxy(settings.object.geometry.indices, {

				get: (_indices, name) => {

					switch (name) {

						case 'bodies':
							
							if (!_indices[2] || !_indices[2].isBodiesProxy) {
								
								_indices[2] = new Proxy(_indices[2] || [], {
			
									get: function (_bodies, name) {

										const i = parseInt(name);
										if (!isNaN(i)) {
					
											_bodies[i] = _bodies[i] || [];
											if (!_bodies[i].isBodyProxy){

												_bodies[i] = new Proxy( _bodies[i], {

													get: (_body, name) => {

														switch (name) {
									
															case 'isBodyProxy': return true;
															case 'push': return ( faceId ) => {

																if (debug) {
																	
																	if (faceId === undefined) console.error(sIndices + ': Invalid faceId = ' + faceId );
																	for ( let i = 0; i < _body.length; i++ ) {

																		if (_body[i] === faceId ) {
																			
																			console.error(sIndices + ': Duplicate body faceId = ' + faceId );
																			return;
	
																		}
																		
																	}
																	
																}
																_body.push( faceId );
																const faces = _indices[1];
																if(faces[faceId] === undefined) faces[faceId] = {};
																	
															}
									
														}
														return _body[name];
														
													},
													
												} );
												
											}
											return _bodies[i];
					
										}
										switch (name) {
					
											case 'isBodiesProxy': return true;
					
										}
										return _bodies[name];
					
									},
					
								});
								const faces = _indices[1];
								_indices[2].forEach( body => body.forEach( faceId => faces[faceId] = faces[faceId] || {} ) );
								for ( let i = 0; i < faces.length; i++ ) faces[i] = faces[i] || {};

							}
							return _indices[2];
						case 'faces':
							return new Proxy(settings.object.geometry.indices.bodies[this.classSettings.bodyId], {
		
								get: (body, name) => {
				
									const i = parseInt(name);
									if (!isNaN(i)) {
				
										return indices[1][body[i]];
				
									}
									switch (name) {
				
										case 'test': return () => {

											if (!this.debug) return;
											body.forEach(faceId => {
					
												settings.object.geometry.indices.faces[faceId].face.TestFace();
					
											});
										}
										case 'push': return (face=[]) => {

											const faces = _indices[1],
												facesLength = faces.push(face),
												faceId = facesLength - 1;
												face = faces[faceId];//converts face to Proxy
											face.face = new Triangle( this.options, {
											
												faceId: faceId,
												settings: settings,
											
											} );
											body.push(faceId);
											return facesLength;
												
										}
				
									}
									return body[name];
				
								},
				
							});

					}
					return _indices[name];

				},

			});
			isFacesIndicesProxy = true;

		}

		const facesCount = settings.object.geometry.indices[1].count || 4,//default is pyramid
			indices = settings.object.geometry.indices,
			body = indices.bodies[this.classSettings.bodyId];
		
		for ( let i = body.length; i < facesCount; i++ ) body.push( i );
		
		//сразу заменяем все грани на прокси, потому что в противном случае, когда мы создаем прокси грани в get, каждый раз,
		//когда вызывается get, в результате может получться бесконечная вложенная конструкция и появится сообщение об ошибке:
		//EgocentricUniverse: Face get. Duplicate proxy
		const defaultIndices = {
			
			edges:
			[
				//будет создано в Utils.edges
				{},
				{},
				{},

				{ vertices: [0,3] },//3
				{ vertices: [1,3] },//4
				{ vertices: [2,3] },//5
			],
			faces:
			[
				[],//уже создано в Circle.Indices
				[0, 3, 4],
				[1, 4, 5],
				[2, 3, 5]
			]
		}
		const edges = settings.object.geometry.indices.edges, defaultEdges = defaultIndices.edges, edgesLength = 6;
		for (let edgeId = 3;//вершины первых тех ребер потом будут вычисляться в Utils.edges
			 edgeId < edgesLength; edgeId++) {

			let edge = edges[edgeId];
			if (!edge) {

				edges.pushDefault(defaultEdges[edgeId]);
				continue;
				
			}
			
			//default edge vertices
			if (!edge.vertices) edge.vertices = defaultEdges[edgeId].vertices;
			const verticesCount = 2, vertices = edge.vertices;
			for ( let i = vertices.length; i < verticesCount; i++ ) vertices.push( defaultEdges[edgeId].vertices[i] );
			
		}
		settings.object.geometry.indices.faces.forEach( ( face, faceId ) => {
			
			//default face edges
			const edgesCount = 3;
			if ((faceId === 0) && (edgesCount != face.length)) console.error(sIndices + ': Duplicate default faceId = ' + faceId);//эта грань уже была создана в Circle.Indices
			if (faceId > 3) console.error(sIndices + ': Invalid faceId = ' + faceId );
			for ( let i = face.length; i < edgesCount; i++ ) face.push( defaultIndices.faces[faceId][i] );
			
			face.face = new Triangle( this.options, {
			
				faceId: faceId,
				settings: settings,
			
			} );
			
		});
		
	}
	/**
	 * Sphere graphical object.
	 * @param {Options} options See <a href="../../../jsdoc/Options/Options.html" target="_blank">Options</a>.
	 * @param {object} [classSettings] Sphere class settings.
	 * @param {number} [classSettings.bodyId=0] Identifier of the array of the faces ids in the <b>classSettings.settings.object.geometry.indices.bodies</b> array.
	 * @param {number} [classSettings.faceGroups=0] Face groups level. You can define sphere's faces count (fc) as <b>fc = 2 ^ ((faceGroups + 1) * 2</b>.
	 * <pre>
	 * Examples:
	 * <table>
		 <tr><td><b>faceGroups</b></td><td>faces count</td></tr>
		 <tr><td>0</td><td>4</td></tr>
		 <tr><td>1</td><td>16</td></tr>
		 <tr><td>2</td><td>64</td></tr>
		 <tr><td>3</td><td>256</td></tr>
		 <tr><td>4</td><td>1024</td></tr>
		 <tr><td>5</td><td>4096</td></tr>
		</table>
	 * </pre>
	 * 
	 * @param {object} [classSettings.settings] The following settings are available
	 * @param {object} [classSettings.settings.object] Sphere object.
	 * @param {String} [classSettings.settings.object.name='Sphere'] name of sphere.
	 * @param {String} [classSettings.settings.object.color='lime'] color of edges.
	 * @param {object} [classSettings.settings.object.geometry] Sphere geometry.
	 * @param {object} [classSettings.settings.object.geometry.indices] Array of <b>indices</b> of vertices, edges, faces and bodies of sphere.
	 * @param {number} [classSettings.settings.object.geometry.indices.count=4] facess count. Default sphere is pyramid with 4 faces.
	 * @param {Array} [classSettings.settings.object.geometry.indices.edges=[{}, {}, {}, {vertices: [0,3]}, {vertices: [1,3]}, {vertices: [2,3]}]] Edges array. Default edges count is <b>classSettings.settings.object.geometry.indices.count</b>.
	 * @param {object} [classSettings.settings.object.geometry.indices.edges.edge] Edges array item is edge.
	 * @param {Array} [classSettings.settings.object.geometry.indices.edges.edge.vertices] Array of edge vertices indices. Every edge have two vertices.
	 * @param {float} [classSettings.settings.object.geometry.indices.edges.edge.distance=1.632993154528117] Edge length. Distance between edge vertices.
	 * @param {Array} [classSettings.settings.object.geometry.indices.faces=[[0, 1, 2], [0, 3, 4], [1, 4, 5], [2, 3, 5]]] Faces array. Every item of the <b>faces</b> array is array of edges indices for current face.
	 * @param {Array} [classSettings.settings.object.geometry.indices.bodies=[[0, 1, 2, 3]]] Bodies array. Every item of the <b>bodies</b> array is array of facess indices for current body.
	 * @param {boolean} [classSettings.debug=false] Debug mode. Diagnoses your code and display detected errors in console
	 **/
	constructor( options, classSettings={} ) {

		if (classSettings.bodyId === undefined) classSettings.bodyId = 0;
		super( options, classSettings );

		/**
		 * Projects a sphere to the canvas 
		 * @param {THREE.Scene} scene [THREE.Scene]{@link https://threejs.org/docs/index.html?q=sce#api/en/scenes/Scene}
		 * @param {object} [params] The following parameters are available
		 * @param {object} [params.center] center of the sphere
		 * @param {float} [params.center.x=0.0] X axis of the center
		 * @param {float} [params.center.y=0.0] Y axis of the center
		 * @param {float} [params.center.z=0.0] z axis of the center
		 * @param {float} [params.radius=1.0] radius of the sphere
		 */
		this.project = (scene, params={}) => {

			const sProject = sSphere + '.project', settings = this.classSettings.settings;
			settings.options = options;//for debug. See Triangle.project
			params.center = params.center || {x: 0.0, y: 0.0, z: 0.0}
			
			//remove previous sphere
			this.remove(scene);

			const THREE = three.THREE,
				r = params.radius !== undefined ? params.radius : 1.0,
				center = new THREE.Vector3(params.center.x, params.center.y, params.center.z),
				faceEdgeFaceAngle = Math.acos( 1 / 3 ),//Face-edge-face angle. approx. 70.5288° or 1.2309594173407747 radians https://en.wikipedia.org/wiki/Tetrahedron
				edgeEdgeAngle = 2 * Math.PI / 3,//120° or 2.0943951023931953 radians
					
				//углы поворота первого треугольника
				rotation1 = new THREE.Euler(
					
					//x
					//наклоняю на угол, равный углу между гранями пирамиды
					Math.PI + faceEdgeFaceAngle,//approx. 70.5288° * 2 or 4.372552070930568 radians

					//y
					0,

					//z
					//И поворачиваю так, что бы новая вершина треугольника оказалась на вершине приамиды
					Math.PI * ( 2 / 3 + 1 )//300° or 5.235987755982988 radians;
					
				),
				groupPosition = new THREE.Group();//сюда помещаем все грани и отладочные объекты что бы у них была одинаковая позиция
				
			groupPosition.position.copy(center);
			scene.add(groupPosition);

			settings.object.geometry.indices.faces.forEach( face => {
				
					
				//каждую грань (треугольник) помещаю в пару вложенных друг в друга группы что бы было удобно их поворачивать
				const group = new THREE.Group(), groupFace = new THREE.Group();
				groupFace.add(group);
				const faceId = face.face.classSettings.faceId;
				switch( faceId ) {

					case 0: break;//нулевой треугольник никуда не поворачиваю. Это будет основание пирамиды
					case 1://Первый треуголник
						//boProject = false;
						group.rotation.copy(rotation1);
						break;
					case 2://Второй треуголник

						//Сначала поворачиваю как первый треугольник
						group.rotation.copy(rotation1);

						//А потом уже родительску группу поворачиваю на 120° по оси высоты пирамиды которая совпадает с ось z так,
						//что бы треугольник совпал со второй гранью пирамиды
						groupFace.rotation.z = edgeEdgeAngle;//120° or 4.1887902047863905 radians
						break;
					case 3://Третий треуголник

						//Сначала повораяиваю как первый треугольник
						group.rotation.copy(rotation1);

						//А потом уже родительску группу поворачиваю на 240° по оси высоты пирамиды которая совпадает с ось z так,
						//что бы треугольник совпал с третьей гранью пирамиды
						groupFace.rotation.z = edgeEdgeAngle * 2;//240° or 4.1887902047863905 radians
						break;
					default: console.error(sProject + ': Invalid faceId = ' + faceId);
						
				}
				group.updateMatrixWorld( true );//обновить group.matrix и group.matrixWorld после ее поворота
				groupPosition.add( groupFace );
				if (this.debug && options.guiSelectPoint && Triangle.debug) {
	
					groupFace.name = 'groupFace ' + faceId;
					options.guiSelectPoint.addMesh( groupFace );
					
				}
				
				face.face.project(group, r);
			
			} );
			
			settings.scene = scene;
			
			//add faces
			//вычисляем новые грани путем разделения граней нулевого body на 4 новых грани
			//каждое ребро грани делим пополам и полученные 3 вершины соединяем ребрами
			const indices = settings.object.geometry.indices,
				position = settings.object.geometry.position,
				bodies = indices.bodies,
				body = bodies[this.classSettings.bodyId],
				faces = indices.faces,
				edges = indices.edges;
			this.classSettings.faceGroups = this.classSettings.faceGroups || 0;
			for (let faceGroupsId = 0; faceGroupsId < this.classSettings.faceGroups; faceGroupsId++) {

				if (this.debug) console.log('faceGroupsId' + faceGroupsId)
				edges.forEach(edge => delete edge.halfEdgeId);
				
				//divide all edges to two half edges
				edges.forEach(edge => edge.halfEdge);

				//divide all faces to 4 faces
				const newEdges = [];
				faces.forEach((face, faceId) => {

					//console.log('face = ' + face + ' faceId = ' + faceId);
//if (faceId != 0) return;
//return;
					const commonVertice = (edge1, edge2) => {

						if ((edge1[0] === edge2[0]) || (edge1[0] === edge2[1])) return edge1[0];
						if ((edge1[1] === edge2[0]) || (edge1[1] === edge2[1])) return edge1[1];
						console.error(sProject + ': no common vertices for [' + edge1 + '] and [' + edge2 + '] edges.');
						
					},
						getEdgeId = (v1, v2) => {

							for (let i = 0; i < newEdges.length; i++) {

								const edgeId = newEdges[i], edge = edges[edgeId];
								if (((edge[0] === v1) && (edge[1] === v2)) || ((edge[0] === v2) && (edge[1] === v1))) return edgeId;
								
							}
							const edgeIndex = edges.push([v1, v2]) - 1;
							newEdges.push(edgeIndex);
							return edgeIndex;
							
						}
					const edge0Id = face[0], edge0 = edges[edge0Id], halfEdge0Id = edge0.halfEdgeId, edge0Old = edge0.old,// halfEdge0 = edges[halfEdge0Id],
						edge1Id = face[1], edge1 = edges[edge1Id], edge1Old = edge1.old,// halfEdge1Id = edge1.halfEdgeId, halfEdge1 = edges[halfEdge1Id],
						edge2Id = face[2], edge2 = edges[edge2Id], halfEdge2Id = edge2.halfEdgeId, edge2Old = edge2.old,// halfEdge2 = edges[halfEdge2Id],
						v0 = commonVertice(edge0Old, edge2Old), v1 = commonVertice(edge0Old, edge1Old), v2 = commonVertice(edge1Old, edge2Old),
						v4 = edge0[1], v5 = edge1[1], v6 = edge2[1],
						edge12Id = getEdgeId(v4, v6),// edge12 = edges[edge12Id],
						edge13Id = getEdgeId(v4, v5),// edge13 = edges[edge13Id],
						edge14Id = getEdgeId(v5, v6);// edge14 = edges[edge14Id];

					//replace face edges
					if (v0 !== edge0[0]) face[0] = halfEdge0Id;
					face[1] = edge12Id;
					if (v0 !== edge2[0]) face[2] = halfEdge2Id;

					//create new faces
					const createFace = (edgeIds, vertice) => {

						const faceEdges = [edges[edgeIds[0]], edges[edgeIds[1]], edges[edgeIds[2]]];
						const edge0 = faceEdges[0][0] === vertice ? edgeIds[0] : faceEdges[0].halfEdgeId,
							edge1 = faceEdges[1][0] === vertice ? edgeIds[1] : faceEdges[1].halfEdgeId;
						faces.push([edge0, edge1, edgeIds[2]]);
						
					}
					createFace([edge2Id, edge1Id, edge14Id], v2);
					createFace([edge1Id, edge0Id, edge13Id], v1);
					faces.push([edge12Id, edge13Id, edge14Id]);//face Id = 4
					
				});
				
			}

			this.Test();//for debug
			
			this.display(3, {
				
				position: params.center,
				
			});
			
			if (this.debug && Triangle.debug) {

				const color = "lightgray", opacity = 0.2;

				const sphere = new THREE.Mesh(new FibonacciSphereGeometry(r),

					new THREE.MeshLambertMaterial({

						color: color,
						opacity: opacity,
						transparent: true,
						side: THREE.DoubleSide//от этого ключа зависят точки пересечения объектов

					})

				);
				groupPosition.add(sphere);

				if (typeof Intersections != 'undefined') new Intersections(sphere, plane);

			}
			this.logSphere();

		}

	}

}

export default Sphere;
