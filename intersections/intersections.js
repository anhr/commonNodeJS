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
	
	if ( !object.geometry.index ) {

		//У некоторых геометрических фигур нет object.geometry.index. Например THREE.TetrahedronGeometry
		const array = [];
		for ( var i = 0; i < positions.count; i++ ) array.push( i );
		object.geometry.index = new THREE.Uint16BufferAttribute( array, 1 );

	}
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

	//точки пересечения одного тела с другим могут образовывать несколько замкнутых линий ( Loops ).
	//Например пересечение тора с плоскостью.
	//Здесь перечислены все обнруженные Loops точек пересечения.
	const arrayIntersectLoops = [];

	//edges
	const edges = [];
	for ( var index = 0; index < object.geometry.index.count; index++ ) {

		class Edge {

			constructor( index ) {

				this.twin = function ( face ) {

					if ( this.faces.face1.id === face.id ) return this.faces.face2;
					if ( this.faces.face2.id !== face.id ) console.error( 'Edge.twin: invalud face id' );
					return this.faces.face1;

				}
				this.isSameEdge = function ( i ) {

					if (
						( i + 1 >= object.geometry.index.count ) ||
						(
							( object.geometry.index.array[i] === this.vertex1.index ) &&
							( object.geometry.index.array[i + 1] === this.vertex2.index )
						) ||
						(
							( object.geometry.index.array[i + 1] === this.vertex1.index ) &&
							( object.geometry.index.array[i] === this.vertex2.index )
						)
					) return true;
					return false;

				}
				function Vertex( index ) {

					return {

						get index() { return object.geometry.index.array[index]; },
						get pointLocal() {

							const vertex = positions.itemSize === 3 ? new THREE.Vector3() : positions.itemSize === 4 ? new THREE.Vector3() : undefined;
							return vertex.fromBufferAttribute( positions, this.index );

						},
						get point() { return this.pointLocal.applyMatrix4( object.matrix ); },

					}

				};
				var vertex1, vertex2,

				//THREE.Vecor3 - Точка пересечения edge c объектами из списка collidableMeshList
				//undefined - точка пересечения еще не вычислялась
				//false - не пересекается или уже добавлен в arrayIntersectLoop
				intersectionPoint;
				Object.defineProperties( this, {

					intersection: {

						/**
						 * @returns THREE.Vector3 - intersection point
						 * false - no intersection
						 * */
						get: function () {

							if ( intersectionPoint === undefined ) {

								const globalOriginPoint = this.vertex1.point,
									globalVertex = this.vertex2.point,
									directionVector = globalVertex.clone().sub( globalOriginPoint ),
									far = globalVertex.distanceTo( globalOriginPoint ),
									rayOriginPoint = new THREE.Raycaster( globalOriginPoint, directionVector.clone().normalize(), 0, far ),
									collisionResultsOriginPoint = rayOriginPoint.intersectObjects( collidableMeshList );
								if ( collisionResultsOriginPoint.length > 0 )
//								if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() )
//								if ( collisionResultsOriginPoint.length > 0 && collisionResultsOriginPoint[0].distance < directionVector.length() )
								{

									intersectionPoint = collisionResultsOriginPoint[0].point;
//									arrayIntersectPoints.push( intersectionPoint );
									//console.log( 'intersection. ' + arrayIntersectPoints.length + ' ' + edge.face.name + '. point:' );
									//console.log( point );
									//console.log( 'origin index = ' + edge.index );
									//console.log( globalOriginPoint );
									//console.log( 'prev index = ' + edge.prev.index );
									//console.log( globalVertex );
									//console.log( '-------------' );
									//									if ( onIntersect ) onIntersect( point );

								} else intersectionPoint = false;

							}
							return intersectionPoint;

						},
						set: function ( intersectionPointNew ) { intersectionPoint = intersectionPointNew; },

					},
					vertex1: {

						get: function () {

							if ( !vertex1 ) vertex1 = Vertex( index );;
							return vertex1
						}

					},
					vertex2: {

						get: function () {

							if ( !vertex2 ) vertex2 = Vertex( index + 1 );
							return vertex2
//							return { index: object.geometry.index.array[index + 1] }

						}

					},

				} );
				/*
				console.log( 'Edge: vertex1: { index: ' + this.vertex1.index + ' } vertex2: { index: ' + this.vertex2.index + ' }' );
				object.add( new THREE.Line( new THREE.BufferGeometry().setFromPoints( [this.vertex1.pointLocal, this.vertex2.pointLocal] ),
					new THREE.LineBasicMaterial( { color: 0x0000ff } ) ) );
				*/

			}

		}
		var same = false;
		edges.forEach( function ( edge ) {

			if ( edge.isSameEdge( index ) ) {

				same = true;
				return;

			}

		} );
		if ( !same ) edges.push( new Edge( index ) );

	}

	/**
	 * @description Marks the selected face in a different color.
	 * @param {Face} face face for drawing.
	 * @param {number} lineFaceIndex LineFaceIndex enum item. Example: <b>LineFaceIndex.mouse</b>
	 * @param {number} color Color of the edges of the face. Example: 0xffffff - white color.
	 */
	function DrawFace( face, lineFaceIndex, color ) {

		const THREE = three.THREE;
		const options = three.options;
		const arrayPoints = [

			face.vertices.vertex1.pointLocal,
			face.vertices.vertex2.pointLocal,
			face.vertices.vertex3.pointLocal,

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
		object.add( lineFace );
		if ( options.guiSelectPoint && ( lineFaceIndex === LineFaceIndex.selected ) ) {

			lineFace.name = face.name;
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

	function DrawSelectedFace( face ) {

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

		DrawFace( face, LineFaceIndex.selected, 0xffffff );
		DrawFace( face.faceEdges.edge1.twin( face ), LineFaceIndex.selectedTwin1, 0xffff00 );
		DrawFace( face.faceEdges.edge2.twin( face ), LineFaceIndex.selectedTwin2, 0xffff00 );
		DrawFace( face.faceEdges.edge3.twin( face ), LineFaceIndex.selectedTwin3, 0xffff00 );

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

			const faces = object.userData.intersections.faces,
				face = faces[intersection.faceIndex];
			DrawFace( face, LineFaceIndex.mouse, 0xffffff );

			//Sptite text

			if ( spriteTextIntersection && ( spriteTextIntersection.faceIndex != intersection.faceIndex ) ) {

				scene.remove( spriteTextIntersection );
				spriteTextIntersection = undefined;

			}
			if ( !spriteTextIntersection ) {

				const vertices = face.vertices;
				spriteTextIntersection = new SpriteText( face.name +
					'\nVertices ids: ' + vertices.vertex1.index + ', ' + vertices.vertex2.index + ', ' + vertices.vertex3.index,
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

			if ( spriteTextIntersection ) {

				scene.remove( spriteTextIntersection );
				spriteTextIntersection = undefined;

			}

			options.renderer.domElement.style.cursor = cursor;

		},
		onMouseDown: function ( intersection ) {

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

					/**
					 * [Face]{@link https://threejs.org/docs/index.html?q=Fa#examples/en/math/convexhull/Face}
					 * @param {number} index index of vertices of the face <b>from object.geometry.index</b>
					 * @param {number} id identifier of the face in the <b>faces</b> array.
					 */
					constructor( index, id ) {

						const vectorIndex = new THREE.Vector3();
						vectorIndex.fromBufferAttribute( object.geometry.index, index );
						this.isMyEdge = function ( edge ) {

							function isSameEdge( edgeSame ) {

								return ( edge.vertex1.index === edgeSame.vertex1.index ) && ( edge.vertex2.index === edgeSame.vertex2.index )

							}
							return isSameEdge( edge1 ) || isSameEdge( edge2 ) || isSameEdge( edge3 );

						}
						Object.defineProperties( this, {


							faceEdges: { get: function () { return faceEdges; } },//прилегающие к грани ребра
							id: { get: function () { return id; } },//identifier of the face in the <b>faces</b> array.
							//for debugging
							name: {

								get: function () {

									return 'Face ' + id;

								}

							},
							vertices: {

								get: function () {

									return {

										vertex1: faceEdges.edge1.vertex1,
										vertex2: faceEdges.edge1.vertex2,
										get vertex3() {

											return ( faceEdges.edge1.vertex1.index !== faceEdges.edge3.vertex1.index ) &&
												( faceEdges.edge1.vertex2.index !== faceEdges.edge3.vertex1.index ) ?
												faceEdges.edge3.vertex1 : faceEdges.edge3.vertex2;

										},

									}

								}

							}

						} );
						const faceEdges = {};//прилегающие к грани ребра
						for ( var i = 0; i < edges.length; i++ ) {

							const edge = edges[i];
							function setFace( face ) {

								if ( !edge.faces ) edge.faces = {}
								if ( !edge.faces.face1 ) edge.faces.face1 = face;
								else if ( !edge.faces.face2 ) {

									//не определен face.name
									//if ( edge.faces.face1.name === face.name ) console.error( 'Face: duplicate edge face' );

									edge.faces.face2 = face;

								} else console.error( 'Face: too many edge.faces' );

							}
							if (
								( vectorIndex.x === edge.vertex1.index ) && ( vectorIndex.y === edge.vertex2.index ) ||
								( vectorIndex.x === edge.vertex2.index ) && ( vectorIndex.y === edge.vertex1.index )
							) {

								if ( faceEdges.edge1 ) console.error( 'Face: duplicate faceEdges.edge1' );
								faceEdges.edge1 = edge;
								setFace( this );

							} else if (
								( vectorIndex.z === edge.vertex1.index ) && ( vectorIndex.y === edge.vertex2.index ) ||
								( vectorIndex.z === edge.vertex2.index ) && ( vectorIndex.y === edge.vertex1.index )
							) {

								if ( faceEdges.edge2 ) console.error( 'Face: duplicate faceEdges.edge2' );
								faceEdges.edge2 = edge;
								setFace( this );

							} else if (
								( vectorIndex.z === edge.vertex1.index ) && ( vectorIndex.x === edge.vertex2.index ) ||
								( vectorIndex.z === edge.vertex2.index ) && ( vectorIndex.x === edge.vertex1.index )
							) {

								if ( faceEdges.edge3 ) console.error( 'Face: duplicate faceEdges.edge3' );
								faceEdges.edge3 = edge;
								setFace( this );

							}
							if ( faceEdges.edge1 && faceEdges.edge2 && faceEdges.edge3 )
								break;

						}
						if ( !faceEdges.edge1 ) console.error( 'Face: invalid edge1' );
						if ( !faceEdges.edge2 ) console.error( 'Face: invalid edge2' );
						if ( !faceEdges.edge3 ) console.error( 'Face: invalid edge3' );

					}

				}
				for ( let index = 0; index < object.geometry.index.count; index += 3 )
					faces.push( new Face( index, faces.length ) );

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
							DrawSelectedFace( faces[parseInt( i )] );
						else HideSelectedFace();

					} );
					cFaces.setValue( -1 );
					dat.controllerNameAndTitle( cFaces, lang.faces );

				}

				//Player

				//				var intersectLine;
				//				var intersectPoints;
				object.userData.player = {

					selectPlayScene: function ( t ) {

						object.position.set( 0, 0, 10 - 30 * t );
						object.updateMatrix();
						arrayIntersectLoops.forEach( function ( arrayIntersectLoop ) {

							if ( arrayIntersectLoop.intersectLine ) scene.remove( arrayIntersectLoop.intersectLine );
							if ( arrayIntersectLoop.intersectPoints ) scene.remove( arrayIntersectLoop.intersectPoints );
							if ( options.guiSelectPoint ) {

								if ( arrayIntersectLoop.intersectLine ) options.guiSelectPoint.removeMesh( arrayIntersectLoop.intersectLine );
								if ( arrayIntersectLoop.intersectPoints ) options.guiSelectPoint.removeMesh( arrayIntersectLoop.intersectPoints );

							}
							arrayIntersectLoop.length = 0;

						} );
						arrayIntersectLoops.length = 0;
/*
						if ( intersectLine ) {

							if ( options.guiSelectPoint ) options.guiSelectPoint.removeMesh( intersectLine );
							scene.remove( intersectLine );

						}
						if ( intersectPoints ) {

							if ( options.guiSelectPoint ) options.guiSelectPoint.removeMesh( intersectPoints );
							scene.remove( intersectPoints );

						}
						arrayIntersectPoints.length = 0;
*/

						//найти intersection
						edges.forEach( function ( edge ) {

							edge.intersection = undefined;
							edge.intersection;

						} );

						//Построить линии intersection в arrayIntersectLoops

						arrayIntersectLoops.length = 0;
						edges.forEach( function ( edge ) {

							//некторые edge не принадлежат ни одному face. Их игнорировать
							if ( edge.faces && edge.intersection ) {

								const arrayIntersectLoop = [];
								arrayIntersectLoops.push( arrayIntersectLoop );

								//debugging
								function Log( edge, face ) {

									/*
									console.log( ( face ? face.name + '. ' : '' ) +
										'edge vertex IDs: ' + edge.vertex1.index + ', ' + edge.vertex2.index +
										'. edge.intersection :' );
									console.log( edge.intersection );
									console.log( '--------' );
									*/

								}
								Log( edge );

								while ( true ) {

									arrayIntersectLoop.push( edge.intersection );
									function isNextFace( face ) {

//										const face = edge.faces.face1;
										const faceEdges = face.faceEdges;
										function isNextEdge( edge2 ) {

											const a = ( edge.vertex1.index === edge2.vertex1.index ) && ( edge.vertex2.index === edge2.vertex2.index ),
												b = ( edge.vertex2.index === edge2.vertex1.index ) && ( edge.vertex1.index === edge2.vertex2.index ),
												res = !( a || b ) && edge2.intersection;
											if ( res ) Log( edge2, face );
											return res;

										}
										if ( isNextEdge( faceEdges.edge1 ) ) {

											edge.intersection = false;
											edge = faceEdges.edge1;
											return true;

										}
										if ( isNextEdge( faceEdges.edge2 ) ) {

											edge.intersection = false;
											edge = faceEdges.edge2;
											return true;

										}
										if ( isNextEdge( faceEdges.edge3 ) ) {

											edge.intersection = false;
											edge = faceEdges.edge3;
											return true;

										}
										return false;

									}
									if ( !isNextFace( edge.faces.face1 ) )
										if ( !isNextFace( edge.faces.face2 ) ) {

											edge.intersection = false;
											break;

										}

								}

							}

						} );
						arrayIntersectLoops.forEach( function ( arrayIntersectLoop ) {

							const geometry = new THREE.BufferGeometry().setFromPoints( arrayIntersectLoop );
							arrayIntersectLoop.intersectLine = new THREE.LineLoop(
								geometry,
								new THREE.LineBasicMaterial( { color: 0xffffff } ) );
							scene.add( arrayIntersectLoop.intersectLine );
							if ( options.guiSelectPoint ) {

								arrayIntersectLoop.intersectLine.name = 'intersectLine';
								options.guiSelectPoint.addMesh( arrayIntersectLoop.intersectLine );

							}
							/*
							MyPoints( geometry, scene, {

								options: options,
								pointsOptions: {

									name: 'intersection',
									//shaderMaterial: false,
									onReady: function ( points ) {

										//points
										arrayIntersectLoop.intersectPoints = points;

									}

								}

							} );
							*/

						} );

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
