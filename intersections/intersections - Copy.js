/**
 * @module Intersections
 * @description Creates an intersection line for graphic objects.
 * @author [Andrej Hristoliubov]{@link https://anhr.github.io/AboutMe/}
 *
 * @copyright 2011 Data Arts Team, Google Creative Lab
 *
 * @license under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
*/

import three from '../three.js'

class Faces {

	/**
	 * Creates an array of graphic object [faces]{@link https://threejs.org/docs/index.html?q=fac#examples/en/math/convexhull/Face}.
	 * @param {THREE.Mesh} object You can see an array of faces in <b>object.userData.intersections.faces</b> after creating of class.
	 * See [Mech]{@link https://threejs.org/docs/index.html#api/en/objects/Mesh}.
	 */
	constructor( object ) {

		const THREE = three.THREE;
		let faces;
		object.userData.intersections = {};
		const positions = object.geometry.attributes.position;

		if ( object.geometry.index ) {

			//ищщем точки, которые совпадают или почти совпадают с небольшой погрешностью
			//что бы у них был одинаковый индекс
			for ( let i = 1; i < object.geometry.index.count; i++ ) {

				const point1 = new THREE.Vector3().fromBufferAttribute( positions, object.geometry.index.array[i] );
				console.log( 'index: ' + object.geometry.index.array[i] );
				console.log( point1 );
				for ( let j = i - 1; j >= 0; j-- ) {

					const point2 = new THREE.Vector3().fromBufferAttribute( positions, object.geometry.index.array[j] );

					// @returns
					// 	0 координаты совпадают
					// 	1 коодинаты с маленьким отклонением
					// 	4 коодинаты с большим отклонением
					function Delta( a, b ) {

						const d = Math.abs( a - b )
						if ( d === 0 ) return 0;
						//								if ( ( d > 0 ) && ( d <= 7.347880586115415e-16 ) ) return 1;
						if ( ( d > 0 ) && ( d <= 3.1840817637818772e-15 ) ) return 1;
						//								if ( ( d > 0 ) && ( d <= 3.e-10 ) ) return 1;
						return 4;

					}
					const res = Delta( point2.x, point1.x ) + Delta( point2.y, point1.y ) + Delta( point2.z, point1.z );
					//0 координаты совпадают
					//1,2,3 одна, две или три коодинаты с маленьким отклонением. Остальные совпадают.
					//4 есть хоть одна коодината с большим отклонением
					//if ( ( res > 0 ) && ( res < 4 ) )
					if ( res < 4 ) {

						object.geometry.index.array[i] = object.geometry.index.array[j];
						break;

					}

				}

			}

		} else {

			const array = []
			for ( var i = 0; i < positions.count; i++ )
				array.push( i );
			object.geometry.index = new THREE.Uint16BufferAttribute( array, 1 );

		}
		Object.defineProperties( object.userData.intersections, {

			faces: {

				get: function () {

					if ( faces ) return faces;
					faces = [];
					class Face {

						constructor( index ) {

							var edge;
							const vectorIndex = new THREE.Vector3();
							vectorIndex.fromBufferAttribute( object.geometry.index, index );
							Object.defineProperties( this, {

								//for debugging
								name: {

									get: function () {

										for ( var i = 0; i < faces.length; i++ ) {

											if ( Object.is( faces[i], this ) ) return 'Face ' + i;

										}

									}

								},

								edge: {

									get: function () {

										if ( edge ) return edge;
										class Edge {

											constructor( index, face, prev ) {

												const vertex = positions.itemSize === 3 ? new THREE.Vector3() : positions.itemSize === 4 ? new THREE.Vector3() : undefined;
												this.vertex = {

													get point() {

														return vertex.fromBufferAttribute( positions, index ).applyMatrix4( object.matrix );

													}

												};
												this.face = face;
												//this.prev = prev;
												this.index = index;
												this.head = function () { return this.vertex; }
												let twin;
												Object.defineProperties( this, {

													prev: { get: function () { return prev ? prev : this.face.edge; } },
													twin: {

														get: function () {

															if ( twin ) return twin;
															//console.log('vectorIndex');
															//console.log(vectorIndex);
															for ( var i = 0; i < faces.length; i++ ) {

																const item = faces[i];
																const vectorIndexCur = new THREE.Vector3( item.edge.index, item.edge.prev.index, item.edge.prev.prev.index );
																if ( vectorIndexCur.equals( vectorIndex ) ) {

																	//console.log( 'vectorIndexCur = vectorIndex' );
																	if ( !Object.is( face, item ) )
																		console.error( 'Under constraction' )

																} else {

																	function getTwin( s, e ) {

																		twin = item.edge;
																		if ( ( s !== twin.index ) || ( e !== twin.prev.index ) ) {

																			twin = twin.prev;
																			if ( ( s !== twin.index ) || ( e !== twin.prev.index ) ) {

																				twin = twin.prev;
																				if ( ( s !== twin.index ) || ( e !== item.edge.index ) )
																					twin = undefined;//twin.prev;

																			}

																		}
																		return twin;

																	}
																	//const prev = this.prev ? this.prev : this.face.edge;
																	const prev = this.prev;
																	if ( !getTwin( this.index, prev.index ) )
																		getTwin( prev.index, this.index )
																	/*
																																						if ( !getTwin( prev.index, this.index ) )
																																							if ( !getTwin( prev.index, prev.prev.index ) )
																																								getTwin( prev.prev.index, prev.index )
																	*/
																	if ( twin ) break;

																}

															}
															if ( !twin ) {

																console.error( face.name + ' Edge.twin = ' + twin );
																console.error( 'index = ' + this.index );
																console.error( this.vertex.point );
																console.error( 'index = ' + this.prev.index );
																console.error( this.prev.vertex.point );
																console.error( '----------------------' );
																twin = { face: { used: true } };

															}
															return twin;

														}

													}

												} );

											}

										}
										edge = new Edge( vectorIndex.x, this, new Edge( vectorIndex.y, this, new Edge( vectorIndex.z, this ) ) );
										return edge;

									},

								},

							} );

						}

					}
					for ( let index = 0; index < object.geometry.index.count; index += 3 )
						faces.push( new Face( index ) );
					return faces;

				}

			},

		} );

	}

}

const Intersections = {

	/** @namespace
	 * @description Array of graphic object faces.
	 * @see <a href="../../intersections/jsdoc/module-Intersections-Faces.html" target="_blank">Faces</a> class.
	 */
	Faces: Faces,

};
export default Intersections;
