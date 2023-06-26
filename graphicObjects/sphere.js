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
		
		if (vertice.edges.length !== 3)//пирамида
			console.error(sSphere + '. Invalid ' + strVerticeId + '.edges.length = ' + vertice.edges.length);
		
	}
	TestFace( faceId, sFaceId ){

		const length = this.classSettings.settings.object.geometry.indices[1][faceId].length;
		if (length !== 3)//пирамида
			console.error(sSphere + '. Invalid ' + sFaceId + '.length = ' + length);
		
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

																if (debug) for ( let i = 0; i < _body.length; i++ ) {

																	if (_body[i] === faceId ) {
																		
																		console.error(sIndices + ': Duplicate body faceId = ' + faceId );
																		return;

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
					
//												this.TestFace(indices[1][faceId], 'face[' + faceId + ']');
												this.TestFace(faceId, 'faces[' + faceId + ']');
					
											});
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
/*
		//если число body больше одного, то вычисляем остальные body путем разделения граней нулевого body на 4 новых грани
		//каждое ребро грани делим пополам и полученные 3 вершины соединяем ребрами
		const bodies = settings.object.geometry.indices.bodies,
			faces = settings.object.geometry.indices.faces;
		for (
			let bodyId = 1;//нулевое body уже вычеслено 
			bodyId < bodies.length; bodyId++
		) {

			const bodyNew = bodies[bodyId],
				face = faces[body[bodyId - 1]];
			face.forEach(edgeId => {

				const edge = edges[edgeId];
				console.log(edgeId);
			});
			
		}
*/		
		
	}
	/**
	 * Sphere graphical object.
	 * @param {Options} options See <a href="../../../jsdoc/Options/Options.html" target="_blank">Options</a>.
	 * @param {object} [classSettings] Sphere class settings.
	 * @param {number} [classSettings.bodyId=0] Identifier of the array of the faces ids in the <b>classSettings.settings.object.geometry.indices.bodies</b> array.
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
		 * @param {object} [params={}] The following parameters are available
		 * @param {object} [params.center={x: 0.0, y: 0.0, z: 0.0}] center of the sphere
		 * @param {float} [params.center.x=0.0] X axis of the center
		 * @param {float} [params.center.y=0.0] Y axis of the center
		 * @param {float} [params.center.z=0.0] z axis of the center
		 * @param {float} [params.radius=1.0] radius of the sphere
		 */
		this.project = (scene, params={}) => {

			const settings = this.classSettings.settings;
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
//				let boProject = true;//for debug
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
					default: console.error(sSphere + '. Invalid faceId = ' + faceId);
						
				}
				group.updateMatrixWorld( true );//обновить group.matrix и group.matrixWorld после ее поворота
				groupPosition.add( groupFace );
				if (this.debug && options.guiSelectPoint && Triangle.debug) {
	
					groupFace.name = 'groupFace ' + faceId;
					options.guiSelectPoint.addMesh( groupFace );
					
				}
				
//				if (boProject)
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
			for (let faceId = 0; faceId < this.classSettings.faceGroups; faceId++) {

				const face = faces[faceId];
				const edge0 = edges[face[0]];
				const vertice0 = edge0.vertices[0], vertice1 = edge0.vertices[1];
				if (vertice0.length != vertice1.length) {
					
					console.error(sSphere + '.project: Add faces. invalid edge vertices length.');
					return;
					
				}
				const verticeMid = [];
				for (let i = 0; i < vertice0.length; i++) verticeMid.push((vertice1[i] - vertice0[i]) / 2 + vertice0[i]);
				const edgesLength = edges.push({ vertices: [edge0[1], position.push(verticeMid) - 1] }),
					newEdge = edges[edgesLength - 1];
				console.log(newEdge);
/*
				edges.forEach(edge => {

					const vertice0 = edge.vertices[0], vertice1 = edge.vertices[1];
					
					//const edleLength = edge.positions.length;
					//edge[0] = 5;//error: Utils: set edge vertice. Invalid vertice index = 5
					
					//edge.distance;
					
					if (vertice0.length != vertice1.length) {
						
						console.error(sSphere + '.project: Add faces. invalid edge vertices length.');
						return;
						
					}
					const verticeMid = [];
					for (let i = 0; i < vertice0.length; i++) verticeMid.push((vertice1[i] - vertice0[i]) / 2 + vertice0[i]);
//					const newEdge = edges[edges.push({ vertices: [edge[1], position.push(verticeMid) - 1] }) - 1];
					const edgesLength = edges.push({ vertices: [edge[1], position.push(verticeMid) - 1] }),
						newEdge = edges[edgesLength - 1];
//					const newEdge = face.face.edges[face.face.edges.length - 1];
//					face.face.edges.forEach(edge => {});
//					face.face.project(new THREE.Group(), r);
					console.log(newEdge);
				});
*/				
				
			}
/*			
			for (
				let bodyId = 1;//нулевое body уже вычеслено 
				bodyId < bodies.length; bodyId++
			) {
	
				const bodyNew = bodies[bodyId],
					face = faces[body[bodyId - 1]];
				face.forEach(edgeId => {
	
					const edge = edges[edgeId];
					console.log(edgeId);
				});
				
			}
*/   

			this.Test();
/*			
			settings.object.geometry.position.test();
			settings.object.geometry.indices.faces.test();
*/   
			
			this.display(3, {
				
//				debugObject: this.debug ? this.displayDebug(THREE, new THREE.Vector3(params.center.x, params.center.y), params.center.z), r, scene) : undefined,
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
