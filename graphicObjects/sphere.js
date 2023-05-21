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

const sFaces = 'Sphere';
let isFacesIndicesProxy = false;

class Sphere extends Circle
{

	//Overridden methods from base class

	log() {

		if (!this.debug) return;
		this.settings.object.geometry.position.forEach((vertice, i) => console.log('position[' + i + ']. ' + JSON.stringify( vertice )));
		this.settings.object.geometry.indices.edges.forEach((edge, i) => console.log('indices.edges[' + i + ']. ' + JSON.stringify( edge )));
		this.settings.object.geometry.indices.faces.forEach((face, i) => console.log('indices.faces[' + i + ']. ' + JSON.stringify( face )));
		
	}
	
	//Project universe into 3D space
	project(
		scene,
		bLog = true//log positions and indices to cnosole 
	){

//		const indices = this.settings.object.geometry.indices, scene = this.scene, options = this.options;

		//remove previous universe
		this.remove( scene );
		
		const THREE = three.THREE;

		this.settings.object.geometry.indices.faces.forEach( face => face.face.project( scene, 3,//Если размерность вселенной задать меньше 3 то исчезнут оси коодинат
		   //false
		) );
		
		if ( this.debug ) {

//			if (bLog) this.log();
			
			const color = "lightgray", opacity = 0.2;
				
			const sphere = new THREE.Mesh( new FibonacciSphereGeometry(),//new THREE.SphereGeometry( 1 ),

				new THREE.MeshLambertMaterial( {
	
					color: color,
					opacity: opacity,
					transparent: true,
					side: THREE.DoubleSide//от этого ключа зависят точки пересечения объектов
	
				} )
	
			);			
			scene.add( sphere );

			const plane = new THREE.Mesh( new THREE.PlaneGeometry( 2.0, 2.0 ),

				new THREE.MeshLambertMaterial( {

					color: color,
					opacity: opacity,
					transparent: true,
					side: THREE.DoubleSide//от этого ключа зависят точки пересечения объектов

				} )

			);
			scene.add( plane );
//			plane.name = name;
			
			if (typeof Intersections != 'undefined') new Intersections( sphere, plane );
			
		}

	}
	get verticeEdgesLengthMax() { return 6 }//нельзя добавлять новое ребро если у вершины уже 6 ребер
	Test( vertice, strVerticeId ){
		
		if (vertice.edges.length !== 3)//пирамида
			console.error(sFaces + '. Invalid ' + strVerticeId + '.edges.length = ' + vertice.edges.length);
		
	}
	Indices(){

		const settings = this.settings;
		if (settings.object.geometry.indices.count != undefined) {

			settings.object.geometry.indices[1].count = settings.object.geometry.indices.count;
			delete settings.object.geometry.indices.count;
			
		}
		super.Indices();
		const position = settings.object.geometry.position;
		const debug = this.debug;
		const sIndicesFacesSet = ': indices.faces set. ';
		
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
																		
																		console.error( sFaces + ': Duplicate body faceId = ' + faceId );
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
/*							
							const bodyfaces = settings.object.geometry.indices.bodies[this.classSettings.bodyId];
							return bodyfaces;
*/
							return new Proxy(settings.object.geometry.indices.bodies[this.classSettings.bodyId], {
		
								get: (_faces, name) => {
				
									const i = parseInt(name);
									if (!isNaN(i)) {
				
										return indices[1][_faces[i]];
				
									}
/*									
									switch (name) {
				
										case 'isBodyFacesProxy': return true;
				
									}
*/		 
									return _faces[name];
				
								},
/*								
								set: (_faces, name, value) => {
				
									const i = parseInt(name);
									if (!isNaN(i)) _faces[indices.faces[_this.classSettings.faceId][i]] = value;
				
									return true;
				
								}
*/		
				
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
		
		//у пирамиды граней не должно быть меньше 4
		//for ( let i = body.length; i < facesCount; i++ ) body.push( i );

		//for ( let i = settings.faces.length; i < settings.count; i++ ) settings.faces.push({});

		//сразу заменяем все грани на прокси, потому что в противном случае, когда мы создаем прокси грани в get, каждый раз,
		//когда вызывается get, в результате может получться бесконечная вложенная конструкция и появится сообщение об ошибке:
		//EgocentricUniverse: Face get. Duplicate proxy
		settings.object.geometry.indices.faces.forEach( ( face, faceId ) => face.face = new Triangle/*Circle*/( this.options, {
			
			faceId: faceId,
			settings: settings,
		
		} ));

		if ( debug ) {
		

		}
		
	}
	/**
	 * Sphere graphical object.
	 * @param {Options} options See <a href="../../../commonNodeJS/master/jsdoc/Options/Options.html" target="_blank">Options</a>.
	 * @param {object} [classSettings] Sphere class settings.
	 **/
	constructor( options, classSettings={} ) {

		if (classSettings.bodyId === undefined) classSettings.bodyId = 0;
		super( options, classSettings );

	}

}

export default Sphere;
