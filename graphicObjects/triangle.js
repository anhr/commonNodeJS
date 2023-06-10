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
	a = Math.sqrt( 8 / 3 ),//edge length
	h = Math.sqrt( 6 ) * a / 3,//Height of pyramid
	z = h - r,//расстояние от центра пирамиды до грани
	scale = a / 1.7320508075688774,//= new THREE.Vector3( 0.0, -1.0, 0.0 ).distanceTo(new THREE.Vector3( 0.8660254037844388, 0.5, 0 ))
	rCircle = Math.sqrt( r * r - z * z );//радиус окружности, которая получается от пересечения плоскости грани пирамиды со сферой https://en.wikipedia.org/wiki/Circle_of_a_sphere

class Triangle extends Utils
{

	//Project of triangle to the 3D space
	project( scene, rotation ) {

		const settings = this.classSettings.settings;
		const THREE = three.THREE;
		const buffer = new THREE.BufferGeometry().setFromPoints( [
			new THREE.Vector3( 0.0, -1.0, 0.0 ),
			new THREE.Vector3( 0.8660254037844388, 0.5, 0 ),
			new THREE.Vector3( -0.8660254037844388, 0.5, 0 ),
		] );
		buffer.setIndex( [0, 1, 1, 2, 2, 0] );
		const object = new THREE.LineSegments( buffer, new THREE.LineBasicMaterial( { color: 'white', } ) );
		
		object.position.z += z;
if ( this.classSettings.faceId === 1 ) object.rotation.z = ( ( 2 * Math.PI ) / 3 ) * 1;//120 degree
		object.scale.multiplyScalar ( scale );

		const group = new THREE.Group();
		group.rotation.copy( rotation );
		group.updateMatrixWorld( true );
		group.add( object );
		
		object.updateMatrixWorld( true );
		
		if ( this.debug ) {
			
			scene.add( group );
			const options = settings.options;
			if ( options.guiSelectPoint ) {

				object.name = 'triangle ' + this.classSettings.faceId;
				options.guiSelectPoint.addMesh( object );

			}

		}
		
		const attribute = object.geometry.attributes.position, points = [];
		this.edges().forEach( ( edge, edgeId ) => {

			edge.forEach( ( positionId, i ) => {

				if (settings.object.geometry.position[positionId].length != 0) return;

				settings.object.geometry.position[positionId] = new THREE.Vector3().
					fromBufferAttribute( attribute, edgeId + i ).
					applyMatrix4( object.matrixWorld ).
					toArray();
				
			} )
			
		} );

		if ( this.debug ) {

			const color = "lightgray", opacity = 0.2;
			const plane = new THREE.Mesh( new THREE.PlaneGeometry( 2.0, 2.0 ),
	
				new THREE.MeshLambertMaterial( {
	
					color: color,
					opacity: opacity,
					transparent: true,
					side: THREE.DoubleSide//от этого ключа зависят точки пересечения объектов
	
				} )
	
			)
			plane.position.copy( object.position );
			scene.add( plane );
			
			const center = new THREE.Vector2(0.0, 0.0);
			const circle = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(new THREE.EllipseCurve(
				center.x, center.y,// Center x, y
				rCircle, rCircle,// x radius, y radius
				0.0, 2.0 * Math.PI,// Start angle, stop angle
			).getSpacedPoints(256)), new THREE.LineBasicMaterial({ color: 'blue' }));
			circle.position.copy( object.position );
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
