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
	 * @param {number} n space dimension of the graphical object.
	 * @param {Object} [settings={}] The following settings are available
	 * @param {Array} [settings.geometry] Array of vertices of the n-dimensional graphical object.
	 * Every item of array is n-dimensional vector of vertice of object.
	 * @param {THREE.Scene} [settings.scene] [THREE.Scene]{@link https://threejs.org/docs/index.html?q=sce#api/en/scenes/Scene}.
	 * Define <b>scene</b> if you want visualise n-dimensional plane and n-dimensional object to 3-D space of the <b>scene</b>.
	 * @param {Options} [settings.options] See <a href="../../jsdoc/Options/Options.html" target="_blank">Options</a>.
	 * Uses only if <b>scene</b> is defined.
	 * @param {Event} [settings.onIntersection] Plane and object intersection event.
	 * The <b>onIntersection</b> function parameter is the (n-1)-dimensional geometry of the intersection if a collision occurred, or undefined if a collision did not occur.
	 */
	constructor( n, settings = {} ) {

		const options = settings.options, _ND = this;
		var geometry, vectorPlane;

//		let n;//dimension of the graphic object

		//ND.Vector = class extends Array
		class Vector extends Array {

			/* *
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

					if ( ( n !== undefined ) && ( i >= n ) ) break;//массив точек текущего объекта пришел как результат пересечения панели с объетом более выокого измерения
					const item = array[i];
					if ( typeof item === "number" )
						super.push( item );
					else console.error( 'ND.Vector: invalid ' + item + ' item ' );

				}
				if ( n !== undefined ) while( this.length < n ) super.push( 0 );

				Object.defineProperties( this, {

					/* *
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

					get: function ( target, name ) {

						if ( parseInt( name ) >= n )
							console.log('Vector.get: name = ' + name + ' n = ' + n );
						return target[name];

					},
					set: function ( target, name, value ) {

						if ( name === "onChange" ) {

							settings.onChange = value;
							return settings.onChange;

						}
						const i = parseInt( name );
						if( i >= target.length ) {

							target.push( value );
							return target.length;

						}
						target[i] = value;
						_ND.intersection();
						if ( settings.onChange ) settings.onChange();
						//https://github.com/GoogleChrome/proxy-polyfill/issues/20
						return true;//target[i];

					}

				} );

			}
//			push( value ) { console.error( 'ND.Vector.push() unavailable' ); }
			pop() { console.error( 'ND.Vector.pop() unavailable' ); }

		}

		if ( !vectorPlane || !vectorPlane.point ) vectorPlane = new Vector( vectorPlane );
//		n = vectorPlane.length;//Dimensional of the graphical space

		class Geometry extends Array {

			constructor( geometry = [] ) {

				super();
				const _geometry = this;
				for ( var i = 0; i < geometry.length; i++ ) {

					this[i] = new Vector( geometry[i] );
//					if ( !geometry[i].point ) geometry[i] = new  Vector( geometry[i] );

				}

				Object.defineProperties( this, {

					points: {

						get: function () {

							const points = [];
							for ( var i = 0; i < this.length; i++ )
								points.push( this[i].point );
							return points;

						}

					},
					indices: {

						get: function () {

							const indices = [],//[0,1,1,2,2,0],
								length = this.length;
							for ( var i = 0; i < length; i++ ) {

								indices.push( i );
								indices.push( i < ( length - 1 ) ? i + 1 : 0 );

							}
							return indices;

						}

					},
					segments: {

						get: function () {

							class Segments {

								constructor() {

									//https://stackoverflow.com/questions/2449182/getter-setter-on-javascript-array
									return new Proxy( this, {

										get: function ( target, name ) {

											switch ( name ) {

												case 'length':
													switch ( n ) {

														case 1:
														case 2:
															return geometry.length;

													}
													console.error( 'ND.Plane.onChange.Segments.length: invalid n = ' + n );
													return geometry.length;

											}
											const index = parseInt( name ),
												vectors = [];
											for ( var i = 0; i < n; i++ ) vectors.push( _geometry[( index + i - 1 ) === n ? 0 : index + i] );
											return vectors;

										},
				/*					
										set: function ( target, name, value ) {
										
											target[name] = value;
											//https://github.com/GoogleChrome/proxy-polyfill/issues/20
											return true;//target[name];
										
										}
				*/

									} );

								}

							}
							return new Segments();

						}

					},

				} );

				//https://stackoverflow.com/questions/2449182/getter-setter-on-javascript-array
				return new Proxy( this, {

					get: function ( target, name ) {

						switch ( name ){

							case 'lenght':
								return target.length;
/*
							case 'points':
								const points = [];
								for ( var i = 0; i < target.length; i++ )
									points.push( target[i].point );
								return points;
*/

						}
						return target[name];

					},
/*					
					set: function ( target, name, value ) {

						target[name] = value;
						//https://github.com/GoogleChrome/proxy-polyfill/issues/20
						return trur;//target[name];

					}
*/					

				} );

			}

		}

		var objectIntersect;//порекция объека пересечения панеди с графическим объектом на 3D пространство.
		function create3DObject( geometry, settings = {} ) {

			const indices = geometry.indices;
/*			
			const indices = [],//[0,1,1,2,2,0],
				length = geometry.length;
			for ( var i = 0; i < length; i++ ) {

				indices.push( i );
				indices.push( i < ( length - 1 ) ? i + 1 : 0 );

			}
*/			
			const object = new THREE.LineSegments(
				new THREE.BufferGeometry().setFromPoints( geometry.points ).setIndex( indices ),
				new THREE.LineBasicMaterial( { color: settings.color || 0xffffff } ) );//white
			if ( settings.name )
				object.name = settings.name;
			scene.add( object );
			if ( options.guiSelectPoint ) options.guiSelectPoint.addMesh( object );

			//raycaster

			object.userData.raycaster = {

				onIntersection: function ( intersection, mouse ) {

					delete intersection.index;
					MyThree.Options.raycaster.onIntersection( intersection, options, scene, options.camera, options.renderer//, intersection.object3D.position
					);

				},
				onIntersectionOut: function () { MyThree.Options.raycaster.onIntersectionOut( scene, options.renderer ); },
				onMouseDown: function ( intersection ) { MyThree.Options.raycaster.onMouseDown( intersection, options ); },

			}
			options.eventListeners.addParticle( object );

			return object;

		}
		/**
		 * @returns an array of intersection points of <b>vectorPlane</b> and <b>geometry</b>. See constructor for details.
		 */
		this.intersection = function () {

/*
			class Segments {

				constructor() {

					//https://stackoverflow.com/questions/2449182/getter-setter-on-javascript-array
					return new Proxy( this, {

						get: function ( target, name ) {

							switch ( name ) {

								case 'length':
									switch ( n ) {

										case 1:
										case 2:
											return geometry.length;

									}
									console.error( 'ND.Plane.onChange.Segments.length: invalid n = ' + n );
									return geometry.length;

							}
							const index = parseInt( name ),
								vectors = [];
							for ( var i = 0; i < n; i++ ) vectors.push( geometry[( index + i - 1 ) === n ? 0 : index + i] );
							//							vectors.push( geometry[0] )
							return vectors;

						},

					} );

				}

			}
*/
			const segments = geometry.segments, arrayIntersects = [];
			for ( var i = 0; i < segments.length; i++ ) {

				const s = segments[i];
				switch ( n ) {

					case 1:
						if ( !vectorPlane[0].between( s[0][0], segments[i + 1][0][0], true ) )
							continue;
						arrayIntersects.push( vectorPlane[0] );
						break;
					case 3:
						break;
					default:
						if ( !vectorPlane[1].between( s[0][1], s[1][1], true ) )
							continue;
						const a = ( s[1][1] - s[0][1] ) / ( s[1][0] - s[0][0] ), b = s[0][1] - a * s[0][0],
							x = ( vectorPlane[1] - b ) / a;
						if ( !x.between( s[0][0], s[1][0], true ) )
							continue;
						arrayIntersects.push( [x, vectorPlane[1]] );

				}
				/*
								for ( var j = 0; j < segment.length; j++ ) {
				
									for ( var k = 0; k < n; k++ ) {
				
										const nD = new ND( [segment[j][k], segment[j+1][k]], vectorPlane[k] ),
											intersection = nD.intersection();
										console.log(nD);
				
									}
				
								}
				*/

			}
			if ( settings.onIntersection )
				settings.onIntersection( new Geometry( arrayIntersects ) );
			if ( scene ) {

				//если я не буду копировать массив, то элементы массива arrayIntersects преобразуются в класс Proxy.
				//Если потом этот массив использовать для содания класса ND другой размерности, то получу сообщение об ошибке
				//ND: Invalid vector dimension
//				const arrayIntersectsCopy = [...arrayIntersects];

				if ( objectIntersect ) {

					if ( options.guiSelectPoint ) options.guiSelectPoint.removeMesh( objectIntersect );
					scene.remove( objectIntersect );
					options.eventListeners.removeParticle( objectIntersect );

				}
				if ( arrayIntersects.length )
					objectIntersect = create3DObject( new Geometry( arrayIntersects ), { name: 'Intersect' } );

			}
			return arrayIntersects;

		}
		/**
		 * Converts an array of vectors to the current dimension.
		 * @param {Array|Geometry} geometry
		 * @returns Copy of array of vectors with current dimension.
		 */
		this.convertVectors = function ( geometry ) { return new Geometry( [...geometry] ); }
		geometry = new Geometry( settings.geometry );
//		geometry = this.geometry( geometry );

		const THREE = three.THREE, scene = settings.scene;// || three.group;//, options = settings.options || three.options || {};
/*
		//debug
		switch( n ) {

			case 1:
				if ( geometry.length !== n + 1 ) console.error( 'ND: geometry.length !== ' + ( n + 1 ) );
				break;
			case 2: break;
			default: console.error( 'nD vectorPlane.onChange: Invalid dimension = ' + n );

		}
*/		
		for ( var i = 0; i < geometry.length; i++ ) {

			if ( geometry[i].length !== n ) {

				console.error( 'ND: Invalid vector dimension' );
				while ( geometry[i].length < n ) geometry[i].push( 0 );
				//return;

			}

		}

		if ( scene ) {

			options.scales.x.name = 0;
			options.scales.y.name = 1;
			options.scales.z.name = 2;
			if ( n <= 1 ) options.scales.y = undefined;
			if ( n <= 2 ) options.scales.z = undefined;
			options.scales.text.rect = options.scales.text.rect || {}
			options.scales.text.rect.displayRect = false;
			options.scales.text.precision = 2;

		}

		var object3D;
		function projectTo3D() {

			if ( !scene ) return;

			//Graphic object. Currenyly is line
			/*
						const points = [];
						for ( var i = 0; i < geometry.length; i++ )
							points.push( geometry[i].point );
			*/
			if ( object3D ) {

				scene.remove( object3D );
				if ( options.guiSelectPoint ) options.guiSelectPoint.removeMesh( object3D );
				options.eventListeners.removeParticle( object3D );
				object3D = undefined;

			}
			if ( geometry.lenght === 0 ) return;
			object3D = create3DObject( geometry, { name: 'Object', color: 0x00ff00 } );//green

		}
		projectTo3D();

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
					switch ( n ) {

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
						case 3://plane
							mesh = new THREE.GridHelper( 2, 10, color, color );// 2000, 20, 0x888888, 0x444444 );
							mesh.rotation.x = Math.PI / 2;
							break;
						default: {

							console.error( 'ND.Plane.createMesh: invalid dimension = ' + n );
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

/*
						switch ( n ) {

							case 1:
								if ( settings.onIntersection )
									settings.onIntersection(
										geometry.length ?
											vectorPlane[0].between( geometry[0][0], geometry[1][0], true ) ? vectorPlane : undefined :
											undefined
									);
								break;
							case 2:
								console.log(_ND);
								break;
							default: console.error( 'nD vectorPlane.onChange: Invalid dimension = ' + n );

						}
*/
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
						//https://github.com/GoogleChrome/proxy-polyfill/issues/20
						return true;//target[name];

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

			/** @namespace
			* @description
			* Returns N-dimensional vector of the plane.
			*/
			vectorPlane: {

				get: function () { return vectorPlane; }

			},

			/** @namespace
			* @description
			* geometry of N-dimensional object. See <b>settings.geometry</b> parameter of <a href="./module-ND-ND.html" target="_blank">ND</a>.
			*/
			geometry: {

				get: function () { return geometry; },
				set: function ( geometryNew ) {

					geometry = new Geometry( geometryNew );
					projectTo3D();
					this.intersection()

				},

			},

		} );

	}

}

export default ND;

//https://stackoverflow.com/a/18881828/5175935
if ( !Number.prototype.between )
	Number.prototype.between = function ( a, b, inclusive ) {

		var min = Math.min.apply( Math, [a, b] ),
			max = Math.max.apply( Math, [a, b] );
		return inclusive ? this >= min && this <= max : this > min && this < max;

	};
