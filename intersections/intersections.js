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
 * 
 * @see [How to detect collision in three.js?]{@link https://newbedev.com/how-to-detect-collision-in-three-js}
 * @see [Collision detection example]{@link http://stemkoski.github.io/Three.js/Collision-Detection.html}
 * @see [Three JS - Find all points where a mesh intersects a plane]{@link https://stackoverflow.com/questions/42348495/three-js-find-all-points-where-a-mesh-intersects-a-plane}
*/

import three from '../three.js'
//import MyThree from '../myThree/myThree.js';
import MyPoints from '../myPoints/myPoints.js';
import { SpriteText } from '../SpriteText/SpriteText.js'

/**
 * Creates an array of graphic object [faces]{@link https://threejs.org/docs/index.html?q=fac#examples/en/math/convexhull/Face}.
 * @param {THREE.Mesh} object You can see an array of faces in <b>object.userData.intersections.faces</b> after creating of class.
 * See [Mech]{@link https://threejs.org/docs/index.html#api/en/objects/Mesh}.
 * @param {array} collidableMeshList Array of meshes, which intersects with <b>object</b>.
 */
function Faces( object, collidableMeshList ) {

	const THREE = three.THREE, options = three.options, scene = three.group;
	let faces;
	object.userData.intersections = {};
	const positions = object.geometry.attributes.position;

	if ( object.geometry.index ) {

		//ищщем точки, которые совпадают или почти совпадают с небольшой погрешностью
		//что бы у них был одинаковый индекс
		for ( let i = 1; i < object.geometry.index.count; i++ ) {

			const point1 = new THREE.Vector3().fromBufferAttribute( positions, object.geometry.index.array[i] );
			/*
			console.log( 'index: ' + object.geometry.index.array[i] );
			console.log( point1 );
			*/
			for ( let j = i - 1; j >= 0; j-- ) {

				const point2 = new THREE.Vector3().fromBufferAttribute( positions, object.geometry.index.array[j] );

				// @returns
				// 	0 координаты совпадают
				// 	1 коодинаты с маленьким отклонением
				// 	4 коодинаты с большим отклонением
				function Delta( a, b ) {

					const d = Math.abs( a - b )
					if ( d === 0 ) return 0;
//					if ( ( d > 0 ) && ( d <= 7.347880586115415e-16 ) ) return 1;
					if ( ( d > 0 ) && ( d <= 3.1840817637818772e-15 ) ) return 1;
//					if ( ( d > 0 ) && ( d <= 3.e-10 ) ) return 1;
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

		//У некоторых геометрических фигур нет object.geometry.index. Например THREE.TetrahedronGeometry
		console.error( 'Faces: under constraction' );
		const array = [
			0, 1, 2,
			3, 2, 1,
			3, 1, 0,
			3, 0, 2
		]
/*
		const array = [
			0, 1, 2,
			1, 2, 3,
			2, 3, 4,
			3, 4, 5,
			4, 5, 6
		]
*/
/*
		const array = [];
		for ( var i = 0; i < positions.count; i++ )
			array.push( i );
*/
		object.geometry.index = new THREE.Uint16BufferAttribute( array, 1 );

	}

	/**
	 * @description Marks the selected face in a different color.
	 * @param {Edge} edge <b>face.edge</b> First edge of selected face.
	 * @param {number} lineFaceIndex LineFaceIndex enum item. Example: <b>LineFaceIndex.mouse</b>
	 * @param {number} color Color of the edges of the face. Example: 0xffffff - white color.
	 */
	function DrawFace( edge, lineFaceIndex, color ) {

		const THREE = three.THREE;
		const options = three.options;
		const arrayPoints = [

			edge.vertex.pointLocal,
			edge.prev.vertex.pointLocal,
			edge.prev.prev.vertex.pointLocal,

		];
		/*
		console.log(edge.face.name + ' drawFace points');
		console.log(arrayPoints[0]);
		console.log(arrayPoints[1]);
		console.log(arrayPoints[2]);
		console.log('---------------');
		*/
		if ( faceLines[lineFaceIndex] ) {

			if ( options.guiSelectPoint ) options.guiSelectPoint.removeMesh( faceLines[lineFaceIndex] );
//			three.group.remove( faceLines[lineFaceIndex] );
			object.remove( faceLines[lineFaceIndex] );

		}
		const lineFace = new THREE.LineLoop( new THREE.BufferGeometry().setFromPoints( arrayPoints ), new THREE.LineBasicMaterial( { color: color } ) );
		faceLines[lineFaceIndex] = lineFace;
//		const p = lineFaceIndex === 0 ? 0.1 : 0.2;
//		const p = lineFaceIndex === 0 ? 0.01 : 0.02;
//		lineFace.position.set( p, p, p );
//		three.group.add( lineFace );
		object.add( lineFace );
		if ( options.guiSelectPoint && ( lineFaceIndex === LineFaceIndex.selected ) ) {

			lineFace.name = edge.face.name;
			options.guiSelectPoint.addMesh( lineFace );
			options.guiSelectPoint.select( { object: lineFace } );//, index: index } );

		}

	}
	/**
	 * @description Hide the face, which was drawn by <a href="./module-Intersections-Intersections.DrawFace.html" target="_blank">DrawFace</a>.
	 * @param {number} lineFaceIndex LineFaceIndex enum item. Example: <b>LineFaceIndex.mouse</b>
	 */
	function HideFace( lineFaceIndex ) {

		const lineFace = faceLines[lineFaceIndex];
		if ( !lineFace ) return;
		const options = three.options;
		if ( options.guiSelectPoint ) options.guiSelectPoint.removeMesh( lineFace );
//		three.group.remove( lineFace );
		object.remove( lineFace );

	}
	/**
	 * @description Array of indexes faces, which is drawn in a different color.
	 * @readonly
	 * @enum {number}
	 */
	const LineFaceIndex = {

		/** Draw the face, which user has selected */
		selected: 0,
		/** Draw the face of the twin of the first edge of the face, which user has selected */
		selectedTwin1: 1,
		/** Draw the face of the twin of the second edge of the face, which user has selected */
		selectedTwin2: 2,
		/** Draw the face of the twin of the third edge of the face, which user has selected */
		selectedTwin3: 3,
		/** Draw the face, which mouse is over */
		mouse: 4,

	}
	Object.freeze( LineFaceIndex );

	function DrawSelectedFace( edge ) {

		/*
		console.log( edge.face.name + ' indexes: ' + edge.index + ', ' + edge.prev.index + ', ' + edge.prev.prev.index + ', ' )
		const point1 = new THREE.Vector3().fromBufferAttribute(object.geometry.attributes.position,edge.index);
		console.log(point1);
		const point2 = new THREE.Vector3().fromBufferAttribute(object.geometry.attributes.position,edge.prev.index);
		console.log(point2);
		const point3 = new THREE.Vector3().fromBufferAttribute( object.geometry.attributes.position, edge.prev.prev.index );
		console.log(point3);
		console.log('world points')
		console.log(point1.applyMatrix4( object.matrix ));
		console.log(point2.applyMatrix4( object.matrix ));
		console.log(point3.applyMatrix4( object.matrix ));
		*/

		DrawFace( edge, LineFaceIndex.selected, 0xffffff );
		DrawFace( edge.twin.face.edge, LineFaceIndex.selectedTwin1, 0xffff00 );
		DrawFace( edge.prev.twin.face.edge, LineFaceIndex.selectedTwin2, 0xffff00 );
		DrawFace( edge.prev.prev.twin.face.edge, LineFaceIndex.selectedTwin3, 0xffff00 );

	}
	function HideSelectedFace() {

		HideFace( LineFaceIndex.selected);
		HideFace( LineFaceIndex.selectedTwin1 );
		HideFace( LineFaceIndex.selectedTwin2 );
		HideFace( LineFaceIndex.selectedTwin3 );

	}

	//Raycaster

	var spriteTextIntersection, cursor;
	object.userData.raycaster = {

		onIntersection: function ( intersection, mouse ) {

			const faces = object.userData.intersections.faces;
			DrawFace( faces[intersection.faceIndex].edge, LineFaceIndex.mouse, 0xffffff );
			//Options.raycaster.onIntersection( intersection, options, scene );//, camera, renderer );

			//Sptite text

			if ( spriteTextIntersection && ( spriteTextIntersection.faceIndex != intersection.faceIndex ) ) {

				scene.remove( spriteTextIntersection );
				spriteTextIntersection = undefined;

			}
			if ( !spriteTextIntersection ) {

/*
				const attributesPosition = intersection.object.geometry.attributes.position,
					position = attributesPosition.itemSize >= 4 ? new THREE.Vector4( 0, 0, 0, 0 ) : new THREE.Vector3();
				position.fromArray( attributesPosition.array, intersection.index * attributesPosition.itemSize );
*/
				spriteTextIntersection = new SpriteText( 'Face id = ' + intersection.faceIndex,
					intersection.point//new THREE.Vector3()//position
					, { rect: { displayRect: true, }, }
				);
				spriteTextIntersection.faceIndex = intersection.faceIndex;

			} else spriteTextIntersection.position.copy( intersection.point );

			//cursor

			if ( cursor === undefined ) cursor = options.renderer.domElement.style.cursor;
			options.renderer.domElement.style.cursor = 'pointer';

		},
		onIntersectionOut: function () {

			HideFace( LineFaceIndex.mouse );

			//Options.raycaster.onIntersectionOut( scene, renderer );

			if ( spriteTextIntersection ) {

				scene.remove( spriteTextIntersection );
				spriteTextIntersection = undefined;

			}

			options.renderer.domElement.style.cursor = cursor;

		},
		onMouseDown: function ( intersection ) {

			//alert( 'Clicked over object.' );
			if ( cFaces ) {

				cFaces.__select[intersection.faceIndex + 1].selected = true;
				cFaces.__onChange(intersection.faceIndex);

			} else DrawSelectedFace( object.userData.intersections.faces[intersection.faceIndex].edge );

		},

	}
	options.eventListeners.addParticle( object );

	var cFaces;

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

												get pointLocal() { return vertex.fromBufferAttribute( positions, index ); },
												get point() { return this.pointLocal.applyMatrix4( object.matrix ); },

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

				//gui

				if ( options.dat && options.dat.gui ) {

					//Localization

					const lang = {

						notSelected: 'Not selected',
						faces: 'Faces',

					};
					switch ( options.getLanguageCode() ) {

						case 'ru'://Russian language

							lang.notSelected = 'Не выбрана';
							lang.faces = 'Грани';

							break;
						default://Custom language
							if ( ( options.lang === undefined ) || ( options.lang.languageCode != languageCode ) )
								break;

							Object.keys( options.lang ).forEach( function ( key ) {

								if ( lang[key] === undefined )
									return;
								lang[key] = options.lang[key];

							} );

					}

					const dat = three.dat;
					const selectFace = { [lang.notSelected]: -1 };
					for ( var i = 0; i < faces.length; i++ )
						selectFace[faces[i].name] = i;
					cFaces = options.dat.gui.add( { Faces: 'someName' }, 'Faces', selectFace ).onChange( function ( i ) {

						if ( i != -1 )
							DrawSelectedFace( faces[parseInt( i )].edge );
						else HideSelectedFace();

					} );
					cFaces.setValue( -1 );
					dat.controllerNameAndTitle( cFaces, lang.faces );

				}

				//Player

				var intersectLine;
				var intersectPoints;
				object.userData.player = {

					selectPlayScene: function ( t ) {

						object.position.set( 0, 0, 10 - 30 * t );
						object.updateMatrix();

						const arrayIntersectPoints = [];
						if ( intersectLine ) {

							if ( options.guiSelectPoint ) options.guiSelectPoint.removeMesh( intersectLine );
							scene.remove( intersectLine );

						}
						if ( intersectPoints ) {

							if ( options.guiSelectPoint ) options.guiSelectPoint.removeMesh( intersectPoints );
							scene.remove( intersectPoints );

						}
						faces.forEach( function ( face ) { face.used = false; } );

						let faceIndex = 0;
						function setFace() {

							const face = faces[faceIndex];
							let edge = face.edge;
							function setEdge() {

								function getIntersect( edge, onIntersect ) {

									if ( edge.twin.face.used ) return;
									const globalOriginPoint = edge.head().point,
										globalVertex = edge.prev.head().point,
										directionVector = globalVertex.clone().sub( globalOriginPoint ),
										far = globalVertex.distanceTo( globalOriginPoint ),
										rayOriginPoint = new THREE.Raycaster( globalOriginPoint, directionVector.clone().normalize(), 0, far + ( far / 100 ) ),
										collisionResultsOriginPoint = rayOriginPoint.intersectObjects( collidableMeshList );
									if ( collisionResultsOriginPoint.length > 0 )
//									if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() )
//									if ( collisionResultsOriginPoint.length > 0 && collisionResultsOriginPoint[0].distance < directionVector.length() )
									{

										const point = collisionResultsOriginPoint[0].point;
										arrayIntersectPoints.push( point );
										/*
										console.log( 'intersection. ' + arrayIntersectPoints.length + ' ' + edge.face.name + '. point:' );
										console.log( point );
										console.log( 'origin index = ' + edge.index );
										console.log( globalOriginPoint );
										console.log( 'prev index = ' + edge.prev.index );
										console.log( globalVertex );
										console.log( '-------------' );
										*/
										if ( onIntersect ) onIntersect( point );
										return true;

									}

								}
								if ( getIntersect( edge, function ( point ) {

									while ( true ) {

										const face = edge.twin.face;
										if ( face.used ) return;
										face.used = true;
										edge = face.edge;
										if ( getIntersect( edge ) ) continue;
										edge = edge.prev;
										if ( getIntersect( edge ) ) continue;
										edge = edge.prev;
										if ( getIntersect( edge ) ) continue;

										//нужно если использовать THREE.Line вместо THREE.LineLoop
										//arrayIntersectPoints.push( arrayIntersectPoints[0] );

										break;

									}


								} ) ) return true;
								edge = edge.prev;

							}
							if ( setEdge() ) return true;
							if ( setEdge() ) return true;
							if ( setEdge() ) return true;

						}
						while ( faceIndex < faces.length ) {

							if ( setFace() ) break;
							faceIndex++;

						}

						if ( arrayIntersectPoints.length > 0 ) {

							MyPoints( arrayIntersectPoints, scene, {

								options: options,
								pointsOptions: {

									name: 'intersection',
									onReady: function ( points ) {

										//points

										if ( intersectPoints ) {

											if ( options.guiSelectPoint ) options.guiSelectPoint.removeMesh( intersectPoints );
											scene.remove( intersectPoints );

										}
										intersectPoints = points;

										//lines

										if ( intersectLine ) {

											if ( options.guiSelectPoint ) options.guiSelectPoint.removeMesh( intersectLine );
											scene.remove( intersectLine );

										}
										intersectLine = new THREE.LineLoop( points.geometry, new THREE.LineBasicMaterial( { color: 0xffffff } ) );
										scene.add( intersectLine );

										if ( options.guiSelectPoint ) {

											intersectLine.name = 'intersectLine';
											options.guiSelectPoint.addMesh( intersectLine );

										}

									}

								}

							} );

						}

					},

				}

				return faces;

			}

		},

	} );
	object.userData.intersections.faces;

}

const faceLines = [];

const Intersections = {

	/** @namespace
	 * @description Array of graphic object faces.
	 * @see <a href="./module-Intersections.html" target="_blank">Faces</a> method.
	 */
	Faces: Faces,

};

export default Intersections;
