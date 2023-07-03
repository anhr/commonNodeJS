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
					
//												this.TestFace(indices[1][faceId], 'face[' + faceId + ']');
//												this.TestFace(faceId, 'faces[' + faceId + ']');
												settings.object.geometry.indices.faces[faceId].face.TestFace();
					
											});
										}
										case 'push': return (face=[]) => {

											const faces = _indices[1],
//											const faces = indices.faces;
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

				const face = faces[faceId],
					edge0Id = face[0], edge0 = edges[edge0Id];
				
				//edge1 всегда должно быть напротив вершины edge0[0]
				//Другими словами у edge1 не должно быть вершины edge0[0]
				let fe1 = 1,//индекс ребра, которое расположено напротив вершины edge0[0]
					fe2 = 2,//индекс ребра, которое прилегает к ребру edge0. Дугими словами индекс ребра, у которого есть вершина с индексом edge0[0]
					edge1Id = face[1], edge1 = edges[edge1Id],
					edge2Id = face[2], edge2 = edges[edge2Id],
					edge2V0Id = 0;//индекс вершины edge2, которая является общей с edge0

				//Для этого ищем ребро, у которого индекс вершины совпадает с индексом вершины edge0[0]
				if ((edge0[0] === edge1[0]) || (edge0[0] === edge1[1])){

					//edge1 прилегает к edge0. Поэтому меняем местами edge1 и edge2
					fe1 = 2; fe2 = 1;
					edge1Id = face[fe1]; edge1 = edges[edge1Id];
					edge2Id = face[fe2], edge2 = edges[edge2Id];
					edge2V0Id = 1;
				
				}
/*				
				const //edge1Id = face[1],
					edge2Id = face[2],
//					edge1 = edges[edge1Id],
					edge2 = edges[edge2Id];
*/	 
				const //vertice1Id = edge1[0],
					verticeMid0 = edge0.verticeMid(1),//position[4] = [0.40824828313652817,-0.2357022603955159,0.33333333333333326] edges = [0,6]
					verticeMid1 = edge1.verticeMid(0),//position[5] = [0,0.4714045207910317,0.33333333333333326] edges = [1,8]
					verticeMid2 = edge2.verticeMid(edge2V0Id),//position[6] = [-0.40824828313652817,-0.23570226039551578,0.33333333333333326] edges = [0,6]
					vertice1Id = edge1.oldVertice.value;

				//replace edge 1 of the face[0] to a new edge.
				//new vertices:
				//position[4] = [0.40824828313652817,-0.2357022603955159,0.33333333333333326] edges = [0,6]
				//position[6] = [-0.40824828313652817,-0.23570226039551578,0.33333333333333326] edges = [0,6]
				//
				//new edge: indices.edges[6] = [4,6] distance = 0.8164965662730563
				//replace indices.faces[0] = [0,1,2] to indices.faces[0] = [0,6,2]
//				edge0[1] = verticeMid0;
//				edge2[0] = verticeMid2;
				const edge6Id = edges.push({ vertices: [edge0[1], edge2[edge2V0Id]] }) - 1;//indices.edges[6] = [4,6] distance = 0.8164965662730563
				face[fe1] = edge6Id;
//				this.edges[fe1];//converts edge to Proxy
				face.face.edges[fe1];//converts edge to Proxy

				//create a new face 4
				//new vertice: position[5] = [0,0.4714045207910317,0.33333333333333326] edges = [1,8]
				//New edges:
				//indices.edges[7] = [2,6]
				//indices.edges[8] = [5,6]
				//new face: indices.faces[4] = [1,7,8]
				let newFaceId = faces.push() - 1,
//					newFace = settings.object.geometry.indices[1][newFaceId];
					newFace = faces[newFaceId];
//				edge1[0] = verticeMid1;//vertice[5]
				
				newFace.push(edge1Id);//indices.edges[1] = [5,2] distance = 0.8164965662730563

				//indices.edges[7] = [2,6] distance = 0.8164965772640586
				let newEdgeId = newFace.push(edges.push({ vertices: [
					edge1[1],//vertice[2]
					verticeMid2//vertice[6]
				] }) - 1) - 1;
				newFace.face.edges[newEdgeId];//converts edge to Proxy
//				this.edges[newFace[newEdgeId]];//converts edge to Proxy

				//indices.edges[8] = [5,6]
				const edge8Id = edges.push({ vertices: [
					verticeMid1,//vertice[5]
					verticeMid2//vertice[6]
				] }) - 1;
				newEdgeId = newFace.push(edge8Id) - 1;
				newFace.face.edges[newEdgeId];//converts edge to Proxy
				
				//create a new face 5
				//New edges:
				//indices.edges[9] = [4,5]
				//new face: indices.faces[5] = [6,8,9]
				newFaceId = faces.push() - 1;
				newFace = faces[newFaceId];
				newFace.push(edge6Id);//indices.edges[6] = [5,2] distance = 0.8164965662730563
				newFace.push(edge8Id);//indices.edges[8] = [5,6] distance = 0.8164965662730563

				//indices.edges[9] = [4,5]
				const edge9Id = edges.push({ vertices: [
					verticeMid0,//vertice[4]
					verticeMid1//vertice[5]
				] }) - 1;
				newEdgeId = newFace.push(edge9Id) - 1;
				newFace.face.edges[newEdgeId];//converts edge to Proxy

				//create a new face 6
				//New edges:
				//indices.edges[10] = [1,5]
				//indices.edges[11] = [1,4]
				//new face: indices.faces[6] = [9,10,11]
				newFaceId = faces.push() - 1;
				newFace = faces[newFaceId];
				newFace.push(edge9Id);//indices.edges[9] = [4,5] distance = 0.8164965662730563

				//indices.edges[10] = [1,5]
				const edge10Id = edges.push({
					vertices: [
						vertice1Id,//vertice[1]
						verticeMid1//vertice[5]
					]
				}) - 1;
				newEdgeId = newFace.push(edge10Id) - 1;
				newFace.face.edges[newEdgeId];//converts edge to Proxy

				//indices.edges[11] = [1,4]
				const edge11Id = edges.push({
					vertices: [
						vertice1Id,//vertice[1]
						verticeMid0//vertice[4]
					]
				}) - 1;
				newEdgeId = newFace.push(edge11Id) - 1;
				newFace.face.edges[newEdgeId];//converts edge to Proxy
				
				console.log(newFaceId);
				
			}

			this.Test();//for debug
			
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
