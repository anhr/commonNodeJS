/**
 * @module ND
 * @description N dimensional graphics
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

//debug
//import { SpriteText } from '../SpriteText/SpriteText.js'

class ND {

	/**
	 * N dimensional graphics
	 */
	constructor( object ) {

		const THREE = three.THREE, options = three.options || {}, scene = three.group;
		options.scales.x.name = 0;
		options.scales.y = undefined;
		options.scales.z = undefined;
		options.scales.text.rect = options.scales.text.rect || {}
		options.scales.text.rect.displayRect = false;
		options.scales.text.precision = 2;
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

	}

}

/** @class
 * @description
 * <pre>
 * An n-dimensional vector is point in an n-dimensional space.
 * The length of an array is the dimension of the space.
 * @param {Array} [array=0] array of the values for appropriate axes.
 * </pre>
 * @example //Creates a point in 2-dimensional space. -5 is value for 0 axis and 7.8 is value for 1 axis.
 * const point = new ND.Vector([-5, 7.8]);
 * const axis0 = point[0]//-5
 * const axis1 = point[1]//7.8
 */
ND.Vector = class extends Array {

	constructor( array = 0, axis = 'x' ) {

		if ( array instanceof Array === false ) array = [array];
		super();

		for ( var i = 0; i < array.length; i++ ) {

			const item = array[i];
			if ( typeof item === "number" )
				super.push( item );
			else console.error( 'ND.Vector: invalid ' + item + ' item ' );
		
		}
		Object.defineProperties( this, {

			point: {

				get: function () {

					const THREE = three.THREE;
					switch ( this.length ) {

						case 1:
							switch ( axis ) {

								case 'x': return new THREE.Vector3( this[0], 0, 0 );
//								case 'y': return new THREE.Vector3( 0, this[0], 0 );
//								case 'z': return new THREE.Vector3( 0, 0, this[0] );
								default: console.error( 'ND.Vector.point: invalid axis: ' + axis );

							}
							return;
						default: console.error( 'ND.Vector.point: invalid length: ' + this.length );

					}

				}

			}

		} );

	}
	push() { console.error( 'ND.Vector.push() unavailable' ); }
	pop() { console.error( 'ND.Vector.pop() unavailable' ); }

}

/** @class
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
ND.Plane = class extends ND.Vector {

	constructor( array ) {

		super( array );

		var mesh;
		this.createMesh = function ( scene ) {

			const THREE = three.THREE, options = three.options || {};
			scene = scene || three.group;
			switch ( this.length ) {

				case 1://point
					options.point.size = ( options.scales.x.max - options.scales.x.min ) * 10;//200;
					mesh = new THREE.Points( new THREE.BufferGeometry().setFromPoints( [new THREE.Vector3( 0, 0, 0 )] ),
						new THREE.PointsMaterial( { color: 0x0000FF, } ) );//blue
					break;
				default: {

					console.error( 'ND.Plane.createMesh: invalid vector.length = ' + this.length );
					return;

				}
				
			}
			scene.add( mesh );
			if ( options.guiSelectPoint ) options.guiSelectPoint.addMesh( mesh );
			mesh.userData.player = {

				selectPlayScene: function ( t ) {

					_this[0] = options.scales.x.min + t * ( options.scales.x.max - options.scales.x.min );
//					_this[0] = -10 + t * 20;

				},

			}

		}

		//https://stackoverflow.com/questions/2449182/getter-setter-on-javascript-array
		const _this = new Proxy( this, {
/*
			get: function(target, name) {
				console.log('Proxy get');
			return target[name];
			},
*/
			set: function ( target, name, value ) {

				target[name] = value;
				if (mesh) {

					mesh.position.x = target[name];
					mesh.updateMatrix();
					
				}
				return target[name];

			}

		} );
		return _this;

	}

}

export default ND;
