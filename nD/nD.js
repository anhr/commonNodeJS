/**
 * @module ND
 * @description N-dimensional graphics
 * @author [Andrej Hristoliubov]{@link https://anhr.github.io/AboutMe/}
 *
 * @copyright 2011 Data Arts Team, Google Creative Lab
 *
 * @license under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * @see [How to detect collision in three.js?]{@link https://newbedev.com/how-to-detect-collision-in-three-js}
 * @see [Collision detection example]{@link http://stemkoski.github.io/Three.js/Collision-Detection.html}
 * @see [Three JS - Find all points where a mesh intersects a plane]{@link https://stackoverflow.com/questions/42348495/three-js-find-all-points-where-a-mesh-intersects-a-plane}
*/

import three from '../three.js'

import MyThree from '../myThree/myThree.js';
//import MyThree from '../../build/myThree.module.js';
//import MyThree from '../../build/myThree.module.min.js';

//debug
//import { SpriteText } from '../SpriteText/SpriteText.js'

class ND {

	/** @class
	 * N-dimensional graphics.
	 * Checks for a collision between an n-dimensional plane and an n-dimensional graphics object and returns the (n-1)-dimensional intersection geometry if a collision was occurs.
	 * @param {Array} vectorsObject Array of vertices of the n-dimensional graphical object.
	 * Every item of array is <a href="./NDVector.ND.Vector.html" target="_blank">ND.Vector</a>.
	 * @param {ND.Vector} vectorPlane N-dimensional <a href="./NDVector.ND.Vector.html" target="_blank">ND.Vector</a> of the plane
	 * that intersects with n-dimensional graphical object.
	 * Dimensional of the graphical space is defined from <b>vectorPlane.length</b>.
	 * @param {Options} options See <a href="../../jsdoc/Options/Options.html" target="_blank">Options</a>.
	 * @param {Object} [settings={}] The following settings are available
	 * @param {THREE.Scene} [settings.scene] [THREE.Scene]{@link https://threejs.org/docs/index.html?q=sce#api/en/scenes/Scene}.
	 * Define <b>scene</b> if you want visualise n-dimensional plane and n-dimensional object to 3-D space of the <b>scene</b>.
	 * @param {Event} [settings.onIntersection] Plane and object intersection event.
	 * The <b>onIntersection</b> function parameter is the (n-1)-dimensional geometry of the intersection if a collision occurred, or undefined if a collision did not occur.
	 */
	constructor( vectorsObject, vectorPlane, options, settings = {} ) {

		if ( !vectorPlane.point ) vectorPlane = new ND.Vector( vectorPlane );
		const THREE = three.THREE, scene = settings.scene;// || three.group;//, options = settings.options || three.options || {};
		const n = vectorPlane.length;//Dimensional of the graphical space

		//debug
		switch( n ) {

			case 1:
				if ( vectorsObject.length !== n + 1 ) console.error( 'ND: vectorsObject.length !== ' + ( n + 1 ) );
				break;
			case 2: break;
			default: console.error( 'nD vectorPlane.onChange: Invalid dimension = ' + n );

		}
		for ( var i = 0; i < vectorsObject.length; i++ ) {

			if ( vectorsObject[i].length !== n ) {

				console.error( 'ND: Invalid vector dimension' );
				//return;

			}

		}

		if ( scene ) {

			//Graphic object. Currenyly is line

			const object = new THREE.Line( new THREE.BufferGeometry().setFromPoints( [
				vectorsObject[0].point,
				vectorsObject[1].point
			] ), new THREE.LineBasicMaterial( { color: 0x00ff00 } ) );//green
			object.name = 'Object';
//object.position.copy( new THREE.Vector3( 0.1, 0, 0 ) );
			scene.add( object );
			if ( options.guiSelectPoint ) options.guiSelectPoint.addMesh( object );

			//raycaster

			object.userData.raycaster = {

				onIntersection: function ( intersection, mouse ) {

					delete intersection.index;
					MyThree.Options.raycaster.onIntersection( intersection, options, scene, options.camera, options.renderer//, intersection.object.position
					);

				},
				onIntersectionOut: function () { MyThree.Options.raycaster.onIntersectionOut( scene, options.renderer ); },
				onMouseDown: function ( intersection ) { MyThree.Options.raycaster.onMouseDown( intersection, options ); },

			}
			options.eventListeners.addParticle( object );

		}
		
		options.scales.x.name = 0;
		options.scales.y.name = 1;
		options.scales.z.name = 2;
		if ( n <= 1 ) options.scales.y = undefined;
		if ( n <= 2 ) options.scales.z = undefined;
		options.scales.text.rect = options.scales.text.rect || {}
		options.scales.text.rect.displayRect = false;
		options.scales.text.precision = 2;

		//Plane

		/* * @class
		 * @description 
		 * <pre>
		 * N-dimensional intersection plane.
		 * Used to create a section with an n-dimensional graphic object.
		 * For 1 dimensional space <b>ND.Plane</b> is point.
		 * For 2 dimensional space <b>ND.Plane</b> is line.
		 * For 3 dimensional space <b>ND.Plane</b> is plane.
		 * For n-dimensional space <b>ND.Plane</b> is n-dimensional plane.
		 * </pre>
		 */
		class Plane {

			constructor() {

//				const THREE = three.THREE, options = three.options || {};

//				super( array );

				var mesh;
				this.createMesh = function ( /*scene*/ ) {

//					scene = scene || three.group;
					if ( !scene ) return;
					const color = 0x0000FF;//blue
					switch ( vectorPlane.length ) {

						case 1://point
							options.point.size = ( options.scales.x.max - options.scales.x.min ) * 500;//10
							mesh = new THREE.Points( new THREE.BufferGeometry().setFromPoints( [
//								new THREE.Vector4( 0, 0, 0, new THREE.Color( "rgb( 0, 0, 255)" ) )
								new THREE.Vector3( 0, 0, 0 )
							], 3 ),
								new THREE.PointsMaterial( {

									color: color,
//									vertexColors: THREE.VertexColors,
//									size: 500,//0.05,
									sizeAttenuation: false,

								} ) );

							break;
						case 2://line
							mesh = new THREE.Line( new THREE.BufferGeometry().setFromPoints( [
								new THREE.Vector3( options.scales.x.min, 0, 0 ), new THREE.Vector3( options.scales.x.max, 0, 0 )
							] ), new THREE.LineBasicMaterial( { color: color } ) );
							break;
						default: {

							console.error( 'ND.Plane.createMesh: invalid vector.length = ' + vectorPlane.length );
							return;

						}

					}
					mesh.name = 'Plane';
					scene.add( mesh );
					if ( options.guiSelectPoint ) options.guiSelectPoint.addMesh( mesh );

					mesh.position.copy( vectorPlane.point );

					//raycaster

					mesh.userData.raycaster = {

						onIntersection: function ( intersection, mouse ) {

							delete intersection.index;
							MyThree.Options.raycaster.onIntersection( intersection, options, scene, options.camera, options.renderer );

						},
						onIntersectionOut: function () { MyThree.Options.raycaster.onIntersectionOut( scene, options.renderer ); },
						onMouseDown: function ( intersection ) { MyThree.Options.raycaster.onMouseDown( intersection, options ); },

					}
					options.eventListeners.addParticle( mesh );

					//

					vectorPlane.onChange = function () {

						switch( n ) {

							case 1:
								//https://stackoverflow.com/a/18881828/5175935
								if ( !Number.prototype.between )
									Number.prototype.between = function( a, b, inclusive ) {

										var min = Math.min.apply( Math, [a, b] ),
										max = Math.max.apply( Math, [a, b] );
										return inclusive ? this >= min && this <= max : this > min && this < max;

									};

								//if ( ( vectorPlane[0] >= vectorsObject[0][0] ) && ( vectorPlane[0] <= vectorsObject[1][0] ) )
/*								
								if ( vectorPlane[0].between( vectorsObject[0][0], vectorsObject[1][0], true ) ) {

									if ( settings.onIntersection ) settings.onIntersection();

								}
*/								
								if ( settings.onIntersection )
									settings.onIntersection( vectorPlane[0].between( vectorsObject[0][0], vectorsObject[1][0], true ) ? vectorPlane : undefined );
								break;
							case 2:
								break;
							default: console.error( 'nD vectorPlane.onChange: Invalid dimension = ' + n );

						}
//						if ( !mesh ) return;
						mesh.position.copy( vectorPlane.point );
						mesh.updateMatrix();

					}

				}
/*
				//https://stackoverflow.com/questions/2449182/getter-setter-on-javascript-array
				const _this = new Proxy( this, {
					set: function ( target, name, value ) {

						target[name] = value;
						if ( mesh ) {

							mesh.position.x = target[name];
							mesh.updateMatrix();

						}
						return target[name];

					}

				} );
				return _this;
*/

			}

		}
		const plane = new Plane();
		plane.createMesh();
/*
		function createIntersections() {

			console.log( 'createIntersections' );

		}

		//список всех объектов, которые могут перемещаться и сталкиваться
		const arrayMovingObjects = [object, panel];
		arrayMovingObjects.forEach( function ( object ) {

			object.userData.position = object.position.clone();
			object.userData.rotation = object.rotation.clone();
			object.userData.scale = object.scale.clone();

		} );
		function movingObjects() {

			for ( var i = 0; i < arrayMovingObjects.length; i++ ) {

				const object = arrayMovingObjects[i];
				if (
					!object.userData.position.equals( object.position ) ||
					!object.userData.rotation.equals( object.rotation ) ||
					!object.userData.scale.equals( object.scale )
				) {

					object.userData.position = object.position.clone();
					object.userData.rotation = object.rotation.clone();
					object.userData.scale = object.scale.clone();

					createIntersections();

					break;

				}

			}
			window.requestAnimationFrame( movingObjects );

		}
		window.requestAnimationFrame( movingObjects );
*/

		Object.defineProperties( this, {

			/**
			* @description
			* Returns N-dimensional <a href="./NDVector.ND.Vector.html" target="_blank">ND.Vector</a> of the plane.
			*/
			vectorPlane: {

				get: function () { return vectorPlane; }

			},

		} );

	}

}

ND.Vector = class extends Array {

	/**
	 * @description
	 * <pre>
	 * An n-dimensional vector is point in an n-dimensional space.
	 * The length of an array is the dimension of the space.
	 * @param {Array} [array=0] array of the values for appropriate axes.
	 * </pre>
	 * @example //Creates a point in 2-dimensional space. -5 is value for 0 axis and 7.8 is value for 1 axis.
	 * const vector = new ND.Vector( [-5, 7.8] );
	 * const n_dimension = vector.length//2
	 * const point = vector.point;//THREE.Vector3( -5, 7.8, 0 )
	 * const vector0 = vector[0]//-5
	 * const vector1 = vector[1]//7.8
	 * @memberof NDVector
	 */
	constructor( array = 0, settings = {} ) {

		settings.axis = settings.axis || 'x';
		if ( array instanceof Array === false ) array = [array];
		super();

		for ( var i = 0; i < array.length; i++ ) {

			const item = array[i];
			if ( typeof item === "number" )
				super.push( item );
			else console.error( 'ND.Vector: invalid ' + item + ' item ' );
		
		}

		Object.defineProperties( this, {

			/**
			* @description
			* <pre>
			* <b><a href="./NDVector.ND.Vector.html" target="_blank">ND.Vector</a>.point</b>.
			* Projection of the <b>ND.Vector</b> object into 3D space.
			* Returns <b>THREE.Vector3</b> object.
			* Projection of 1-dimensional vector into 3D space: <b>THREE.Vector3( vector[0], 0, 0 ) </b>.
			* Projection of 2-dimensional vector into 3D space: <b>THREE.Vector3( vector[0], vector[1], 0 ) </b>.
			* Projection of 3-dimensional vector into 3D space: <b>THREE.Vector3( vector[0], vector[1], vector[2] ) </b>.
			* </pre>
			* @See <a href="./NDVector.ND.Vector.html" target="_blank">ND.Vector</a>
			*/
			point: {

				get: function () {

					const THREE = three.THREE;
					switch ( this.length ) {

						case 1:
							switch ( settings.axis ) {

								case 'x': return new THREE.Vector3( this[0], 0, 0 );
//								case 'y': return new THREE.Vector3( 0, this[0], 0 );
//								case 'z': return new THREE.Vector3( 0, 0, this[0] );
								default: console.error( 'ND.Vector.point: invalid axis: ' + axis );

							}
							return;
						case 2: return new THREE.Vector3( this[0], this[1], 0 );
						case 3: return new THREE.Vector3( this[0], this[1], this[2] );
						default: console.error( 'ND.Vector.point: invalid length: ' + this.length );

					}

				}

			},
/*see Proxy.set
			onChange: {

				set: function ( onChange ) {

					settings.onChange = onChange;

				},

			},
*/

		} );

		//https://stackoverflow.com/questions/2449182/getter-setter-on-javascript-array
		return new Proxy( this, {
			/*
						get: function(target, name) {
							console.log('Proxy get');
						return target[name];
						},
			*/
			set: function ( target, name, value ) {

				if ( name === "onChange" ) {

					settings.onChange = value;
					return settings.onChange;

				}
				target[name] = value;
				if ( settings.onChange ) settings.onChange();
				return target[name];

			}

		} );

	}
	push() { console.error( 'ND.Vector.push() unavailable' ); }
	pop() { console.error( 'ND.Vector.pop() unavailable' ); }

}

export default ND;
