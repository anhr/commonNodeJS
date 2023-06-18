/**
 * @module Triangle
 * @description Triangle graphical object.
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
import three from '../three.js'

//https://en.wikipedia.org/wiki/Tetrahedron
const r = 1,//Unit sphere https://en.wikipedia.org/wiki/Unit_sphere radius
	a = Math.sqrt(8 / 3),//edge length
	h = Math.sqrt(6) * a / 3,//Height of pyramid
	z = h - r,//расстояние от центра пирамиды до грани
	rCircle = Math.sqrt(r * r - z * z),//радиус окружности, которая получается от пересечения плоскости грани пирамиды со сферой https://en.wikipedia.org/wiki/Circle_of_a_sphere
	scale = a / 1.7320508075688774;//= new THREE.Vector3( 0.0, -1.0, 0.0 ).distanceTo(new THREE.Vector3( 0.8660254037844388, 0.5, 0 )) это длинна ребра до масштабирования
//	scale = rCircle / r;

class Triangle extends Utils
{

	//Project of triangle to the 3D space
	project(scene) {

		const settings = this.classSettings.settings, THREE = three.THREE, options = settings.options;
		
		const buffer = new THREE.BufferGeometry().setFromPoints( [
			new THREE.Vector3( 0.0, -1.0, 0.0 ),
			new THREE.Vector3( 0.8660254037844388, 0.5, 0 ),
			new THREE.Vector3( -0.8660254037844388, 0.5, 0 ),
		] );
		buffer.setIndex( [0, 1, 1, 2, 2, 0] );
		const triangle = new THREE.LineSegments( buffer, new THREE.LineBasicMaterial( { color: 'white', } ) );
		
		triangle.position.z += z;
		triangle.scale.multiplyScalar( scale );
/*
		const scene = new THREE.Group();
		scene.rotation.copy( rotation );
		scene.updateMatrixWorld( true );//обновить scene.matrix и scene.matrixWorld после ее поворота
*/
		//обязательно добавлять треугольник в группу
		scene.add(triangle);
		
		triangle.updateMatrixWorld(true);//вычисляем мировые координаты треугольника для вычисления вершин пирамиды
		
		//Если не хочешь видеть треуголник на холсте
		if (!this.debug)//закоментировать это условие если хочешь всегда удалять треугольник с холста
			scene.remove(triangle);
		
		if (triangle.parent) {
			
			triangle.name = 'triangle ' + this.classSettings.faceId;
			options.guiSelectPoint.addMesh( triangle );

		}

		const position = settings.object.geometry.position;
		this.edges.forEach( ( edge, edgeId ) => {

			edge.forEach( ( positionId, i ) => {

				if ( position[positionId].length != 0 ) return;

				position[positionId] = new THREE.Vector3().
					fromBufferAttribute( triangle.geometry.attributes.position, edgeId + i ).
					applyMatrix4( triangle.matrixWorld ).
					toArray();
				
			} )
			
		} );

		if ( this.debug ) {

			const vertices = [];
			this.edges.forEach( ( edge ) => {
				
				edge.forEach( verticeId => {
					
					let boNewVertice = true;
					for ( let i = 0; i < vertices.length; i ++ ) {

						if ( vertices[i].Id === verticeId ) {

							boNewVertice = false;
							break;
							
						}
						
					}
					if ( boNewVertice ) {

						const vertice = position[verticeId];
						vertices.push( { position: new THREE.Vector3( vertice[0], vertice[1], vertice[2] ), Id: verticeId } );

					}
					
				} );
				
			});

//			scene.add( scene );
			
			if ( options.guiSelectPoint ) {

				scene.name = 'scene ' + this.classSettings.faceId;
				options.guiSelectPoint.addMesh( scene );

			}
			
			const color = "lightgray", opacity = 0.2;
			const plane = new THREE.Mesh( new THREE.PlaneGeometry( 2.0, 2.0 ),
	
				new THREE.MeshLambertMaterial( {
	
					color: color,
					opacity: opacity,
					transparent: true,
					side: THREE.DoubleSide//от этого ключа зависят точки пересечения объектов
	
				} )
	
			)
			plane.position.copy( triangle.position );
			scene.add( plane );
			
			const center = new THREE.Vector2(0.0, 0.0);
			const circle = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(new THREE.EllipseCurve(
				center.x, center.y,// Center x, y
				rCircle, rCircle,// x radius, y radius
				0.0, 2.0 * Math.PI,// Start angle, stop angle
			).getSpacedPoints(256)), new THREE.LineBasicMaterial({ color: 'blue' }));
			circle.position.copy( triangle.position );
			scene.add( circle );
			
		}
//		super.project( scene, n );

	}
	/**
	 * Circle graphical object.
	 * @param {Options} options See <a href="../../../commonNodeJS/master/jsdoc/Options/Options.html" target="_blank">Options</a>.
	 * @param {object} [classSettings] Circle class settings.
	 * @param {number} [classSettings.faceId=0] Identifier of the array of the edges ids in the <b>classSettings.settings.object.geometry.indices.faces</b> array.
	 * @param {object} [classSettings.settings] See <b>EgocentricUniverse <a href="./module-EgocentricUniverse-EgocentricUniverse.html" target="_blank">settings</a></b> parameter.
	 * @param {object} [classSettings.settings.object] edges object.
	 * @param {String} [classSettings.settings.object.name] name of triangle.
	 * @param {String} [classSettings.settings.object.color='lime'] color of edges.
	 * @param {object} [classSettings.settings.object.geometry] riangle geometry.
	 * @param {object} [classSettings.settings.object.geometry.indices] Array of <b>indices</b> of vertices, edges and face of triangle.
	 * @param {number} [classSettings.settings.object.geometry.indices.count=3] triangle edges count.
	 * @param {Array} [classSettings.settings.object.geometry.indices.edges=[{}, {}, {}]] Edges array.
	 * @param {object} [classSettings.settings.object.geometry.indices.edges.edge] Edges array item is edge.
	 * @param {Array} [classSettings.settings.object.geometry.indices.edges.edge.vertices] Array of edge vertices indices. Every edge have two vertices.
	 * @param {float} [classSettings.settings.object.geometry.indices.edges.edge.distance=2.732050807568877] Edge length. Distance between edge vertices.
	 * @param {Array} [classSettings.settings.object.geometry.indices.faces=[[0, 1, 2]]] Faces array. Every item of the <b>faces</b> array is array of edges indices for current face.
	 * <pre>
	 * Example:
	 * [[0, 2, 3]]
	 * triangle contains three edges with 0, 2 and 3 indice.
	 * </pre>
	 **/
	constructor( options, classSettings={} ) {

		super( options, classSettings );

	}

}

export default Triangle;
