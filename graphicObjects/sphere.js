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
	Test( vertice, strVerticeId ){
		
		if (vertice.edges.length !== 3)//пирамида
			console.error(sSphere + '. Invalid ' + strVerticeId + '.edges.length = ' + vertice.edges.length);
		
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
		
								get: (_faces, name) => {
				
									const i = parseInt(name);
									if (!isNaN(i)) {
				
										return indices[1][_faces[i]];
				
									}
									return _faces[name];
				
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
		const defaultIndices = [
			//edges
			[
				//будет создано в Utils.edges
				[],
				[],
				[],

				[0,3],//3
				[1,3],//4
				[2,3],//5
			],
			//faces
			[
				[],//уже создано в Circle.Indices
				[0, 3, 4],
				[1, 4, 5],
				[2, 3, 5]
			]
		];
		const edges = settings.object.geometry.indices.edges, defaultEdges = defaultIndices[0], edgesLength = 6;
		for (let edgeId = 3;//вершины первых тех ребер потом будут вычисляться в Utils.edges
			 edgeId < edgesLength; edgeId++) {

			let edge = edges[edgeId];
			if (!edge) {

				edges.vertices(defaultEdges[edgeId]);
				continue;
				
			}
			
			//default edge vertices
			if (!edge.vertices) edge.vertices = defaultEdges[edgeId];
			const verticesCount = 2, vertices = edge.vertices;
			for ( let i = vertices.length; i < verticesCount; i++ ) vertices.push( defaultEdges[edgeId][i] );
			
		}
		settings.object.geometry.indices.faces.forEach( ( face, faceId ) => {
			
			//default face edges
			const edgesCount = 3;
			if ((faceId === 0) && (edgesCount != face.length)) console.error(sIndices + ': Duplicate default faceId = ' + faceId);//эта грань уже была создана в Circle.Indices
			if (faceId > 3) console.error(sIndices + ': Invalid faceId = ' + faceId );
			for ( let i = face.length; i < edgesCount; i++ ) face.push( defaultIndices[1][faceId][i] );
			
			face.face = new Triangle( this.options, {
			
				faceId: faceId,
				settings: settings,
			
			} );
			
		});
		
	}
	/**
	 * Sphere graphical object.
	 * @param {Options} options See <a href="../../../commonNodeJS/master/jsdoc/Options/Options.html" target="_blank">Options</a>.
	 * @param {object} [classSettings] Sphere class settings.
	 **/
	constructor( options, classSettings={} ) {

		if (classSettings.bodyId === undefined) classSettings.bodyId = 0;
		super( options, classSettings );

		//Project sphere into 3D space
		this.project = ( scene ) => {

			const settings = this.classSettings.settings;
			settings.options = options;//for debug. See Triangle.project
			
			//remove previous universe
			this.remove(scene);

			const THREE = three.THREE,
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
					
				);

			settings.object.geometry.indices.faces.forEach( face => {
				
					
				//каждую грань (треугольник) помещаю в пару вложенных друг в друга группы
				const group = new THREE.Group(),
					groupFace = new THREE.Group();
				
				groupFace.add(group);
				const faceId = face.face.classSettings.faceId;
				let boProject = true;//for debug
				switch( faceId ) {

					case 0: break;//нулевой треугольник никуда не поворачиваю. Это будет основание пирамиды
					case 1://Первый треуголник
						//boProject = false;
						group.rotation.copy(rotation1);
//						group.rotation.z *= 5;//300° or 5.235987755982988 radians;
						break;
					case 2://Второй треуголник
						//boProject = false;

						//Сначала повораяиваю как первый треугольник
						group.rotation.copy(rotation1);
//						group.rotation.z *= 5;//300° or 5.235987755982988 radians;
/*						
						group.rotation.x = Math.PI + faceEdgeFaceAngle;//approx. 70.5288° * 2 or 4.372552070930568 radians
						group.rotation.z = Math.PI * ( 2 / 3 + 1 );//300° or 5.235987755982988 radians;
*/	  

						//А потом уже родительску группу поворачиваю на 120° по оси высоты пирамиды которая совпадает с ось z так,
						//что бы треугольник совпал со второй гранью пирамиды
						groupFace.rotation.z = edgeEdgeAngle;//120° or 4.1887902047863905 radians
						break;
					case 3://Третий треуголник
						//boProject = false;

						//Сначала повораяиваю как первый треугольник
						group.rotation.copy(rotation1);
//						group.rotation.z *= 5;//300° or 5.235987755982988 radians;

						//А потом уже родительску группу поворачиваю на 240° по оси высоты пирамиды которая совпадает с ось z так,
						//что бы треугольник совпал с третьей гранью пирамиды
						groupFace.rotation.z = edgeEdgeAngle * 2;//240° or 4.1887902047863905 radians
						break;
					default: console.error(sSphere + '. Invalid faceId = ' + faceId);
						
				}
//				group.rotation.copy( rotationGroup );
				group.updateMatrixWorld( true );//обновить group.matrix и group.matrixWorld после ее поворота
//				groupFace.updateMatrixWorld( true );//обновить group.matrix и group.matrixWorld после ее поворота
				scene.add( groupFace );
				if ( this.debug && options.guiSelectPoint ) {
	
					groupFace.name = 'groupFace ' + faceId;
					options.guiSelectPoint.addMesh( groupFace );
					
				}
				
				if (boProject) face.face.project( scene, group );
			
			} );

			settings.object.geometry.position.test();
			
			settings.scene = scene;
			this.display( 3 );
			
			if (this.debug) {

				const color = "lightgray", opacity = 0.2;

				const sphere = new THREE.Mesh(new FibonacciSphereGeometry(),

					new THREE.MeshLambertMaterial({

						color: color,
						opacity: opacity,
						transparent: true,
						side: THREE.DoubleSide//от этого ключа зависят точки пересечения объектов

					})

				);
				scene.add(sphere);

				if (typeof Intersections != 'undefined') new Intersections(sphere, plane);
				this.logSphere();

			}

		}

	}

}

export default Sphere;
