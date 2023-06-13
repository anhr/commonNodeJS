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
	project( scene, rotation ) {

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

		const groupFace = new THREE.Group();
		groupFace.rotation.copy( rotation );
		groupFace.updateMatrixWorld( true );//обновить groupFace.matrix и groupFace.matrixWorld после ее поворота

		groupFace.add( triangle );
		triangle.updateMatrixWorld( true );//вычисляем мировые координаты треугольника для вычисления вершин пирамиды
/*		
//if ( this.classSettings.faceId === 1 ) triangle.rotation.z = ( ( 2 * Math.PI ) / 3 ) * 1;//120 degree
		triangle.rotation.copy( rotationFace );

		const group = new THREE.Group();
		group.rotation.copy( rotation );
		group.updateMatrixWorld( true );
		group.add( triangle );
		
		triangle.updateMatrixWorld( true );

		if ( this.debug ) {
			
			scene.add( group );
			if ( options.guiSelectPoint ) {

				triangle.name = 'triangle ' + this.classSettings.faceId;
				options.guiSelectPoint.addMesh( triangle );

			}

		}
*/		
		const attribute = triangle.geometry.attributes.position, position = settings.object.geometry.position;
		this.edges.forEach( ( edge, edgeId ) => {

			edge.forEach( ( positionId, i ) => {

				if ( position[positionId].length != 0 ) return;

				position[positionId] = new THREE.Vector3().
					fromBufferAttribute( attribute, edgeId + i ).
					applyMatrix4( triangle.matrixWorld ).
					toArray();
				
			} )
			
		} );

		if ( this.debug ) {

			const edges = this.edges, vertices = [];
			this.edges.forEach( ( edge, edgeId ) => {
				
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
				
			} );
//			const faceBuffer = new THREE.Triangle(
//				vertices[0].position, vertices[1].position, vertices[2].position
				/*
				//треугольник в плоскости x, y
				//normal = { x = 0, y = 0, z = 1 }
				new THREE.Vector3( 0, 0, 0 ),
				new THREE.Vector3( 1, 0, 0 ),
				new THREE.Vector3( 0, 1, 0 ),
				*/
				/*
				//треугольник в плоскости x, z
				//normal = { x = 0, y = -1, z = 0 }
				new THREE.Vector3( 0, 0, 0 ),
				new THREE.Vector3( 1, 0, 0 ),
				new THREE.Vector3( 0, 0, 1 ),
				*/
				/*
				//треугольник в плоскости y, z
				//normal = { x = 1, y = 0, z = 0 }
				new THREE.Vector3( 0, 0, 0 ),
				new THREE.Vector3( 0, 1, 0 ),
				new THREE.Vector3( 0, 0, 1 ),
				*/
//			);
/*			
				normal = new THREE.Vector3(),
				midpoint =  new THREE.Vector3();
			faceBuffer.getNormal( normal );
			
			faceBuffer.getMidpoint( midpoint );
			scene.add( new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints( [new THREE.Vector3(), midpoint] ), new THREE.LineBasicMaterial({ color: 'yellow' } ) ) );
   
//			scene.add( new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints( [new THREE.Vector3(), normal] ), new THREE.LineBasicMaterial({ color: 'yellow' } ) ) );
			
			const face = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints( [faceBuffer.a, faceBuffer.b, faceBuffer.c] ),
											new THREE.LineBasicMaterial({ color: 'red' } ) );
			scene.add( face );

			if ( options.guiSelectPoint ) {

				face.name = 'face ' + this.classSettings.faceId;
				options.guiSelectPoint.addMesh( face );

			}
*/   
//			const groupFace = new THREE.Group();//, piDev4 = Math.PI / 2;
//			groupFace.up.copy( normal );
//			groupFace.rotation.setFromVector3( normal );

			//Углы прямоугольного треугольника https://poschitat.online/ugly-pryamougolnogo-treugolnika
//			const c = Math.sqrt(midpoint.x * midpoint.x + midpoint.y * midpoint.y + midpoint.z * midpoint.z );
/*			
			groupFace.rotation.x = Math.asin( midpoint.x / c );
			groupFace.rotation.y = Math.asin( midpoint.y / c );
			groupFace.rotation.z = Math.asin( midpoint.z / c );
*/   
/*			
			groupFace.rotation.x = Math.asin( Math.abs( midpoint.x / c ) );
			groupFace.rotation.y = Math.asin( Math.abs( midpoint.y / c ) );
			groupFace.rotation.z = Math.asin( Math.abs( midpoint.z / c ) );
*/   
/*			
			groupFace.rotation.x = Math.asin( Math.abs( normal.x ) );
			groupFace.rotation.y = Math.asin( Math.abs( normal.y ) );
			groupFace.rotation.z = Math.asin( Math.abs( normal.z ) );
*/   
/*			
			groupFace.rotation.x = normal.x;
			groupFace.rotation.y = normal.y;
			groupFace.rotation.z = normal.z;
*/
/*
			groupFace.rotation.x = Math.abs( piDev4 * normal.y );
			groupFace.rotation.y = Math.abs( piDev4 * normal.x );
			groupFace.rotation.z = Math.abs( piDev4 * normal.z );
*/
/*			
			groupFace.rotation.x = Math.abs( piDev4 * normal.x );
			groupFace.rotation.y = Math.abs( piDev4 * normal.y );
			groupFace.rotation.z = Math.abs( piDev4 * normal.z );
*/   
			scene.add( groupFace );
			
			if ( options.guiSelectPoint ) {

				groupFace.name = 'groupFace ' + this.classSettings.faceId;
				options.guiSelectPoint.addMesh( groupFace );
				
				triangle.name = 'triangle ' + this.classSettings.faceId;
				options.guiSelectPoint.addMesh( triangle );

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
			groupFace.add( plane );
			
			const center = new THREE.Vector2(0.0, 0.0);
			const circle = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(new THREE.EllipseCurve(
				center.x, center.y,// Center x, y
				rCircle, rCircle,// x radius, y radius
				0.0, 2.0 * Math.PI,// Start angle, stop angle
			).getSpacedPoints(256)), new THREE.LineBasicMaterial({ color: 'blue' }));
			circle.position.copy( triangle.position );
			groupFace.add( circle );
			
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

		super( options, classSettings );

	}

}

export default Triangle;
