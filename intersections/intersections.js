/**
 * @module Intersections
 * @description Creates an intersection lines for graphic objects.
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
//import MyPoints from '../myPoints/myPoints.js';
import { SpriteText } from '../SpriteText/SpriteText.js'

class Intersections {

	/**
	 * Creates an array of graphic object [faces]{@link https://threejs.org/docs/index.html?q=fac#examples/en/math/convexhull/Face}.
	 * @param {THREE.Mesh} object You can see an array of faces in <b>object.userData.intersections.faces</b> after creating of <b>Faces</b>.
	 * See [Mech]{@link https://threejs.org/docs/index.html#api/en/objects/Mesh}.
	 * @param {THREE.Mesh|array} collidableMeshList [Mech]{@link https://threejs.org/docs/index.html#api/en/objects/Mesh} or array of meshes, which intersects with <b>object</b>.
	 * @param {object} [settings] the following settings are available:
	 * @param {THREE.Scene} [settings.scene] [THREE.Scene]{@link https://threejs.org/docs/index.html?q=sce#api/en/scenes/Scene}.
	 * @param {function(arrayIntersectLoops)} [settings.onReady] Callback function that called if intersection lines is ready and that take as input an array of all intersect lines.
	 * Every item of array is array of line vertices of <b>THREE.Vector3</b> type.
	 */
	constructor( object, collidableMeshList, settings = {} ) {

		if ( !Array.isArray( collidableMeshList ) ) collidableMeshList = [collidableMeshList];

		const THREE = three.THREE, options = three.options, scene = settings.scene || three.group;
		const positions = object.geometry.attributes.position;

		//У некоторых геометрических фигур нет object.geometry.index. Например THREE.TetrahedronGeometry
		if ( !object.geometry.index ) {

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
					//				if ( ( d > 0 ) && ( d <= 3.1840817637818772e-15 ) ) return 1;
					//				if ( ( d > 0 ) && ( d <= 3.394278283598952e-15 ) ) return 1;//use THREE.SphereGeometry for testing
					if ( ( d > 0 ) && ( d <= 4e-15 ) ) return 1;//use THREE.SphereGeometry for testing
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

		function createIntersections() {

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

			//Ищем точки пересечения объектов
			const edges = [];//список ребер, имеющих точки пересечения
			for ( var index = 0; index < object.geometry.index.count; index++ ) {

				class Edge {

					constructor() {

						function Vertex( index ) {

							return {

								get index() {

									if ( index >= object.geometry.index.array.length )
										index = 0;//сюда попадает когда ищу индекс второй точки ребра edge.vertex2
													//и когда ребро последнее в объекте.
													//Я предполагаю что вторая точка ребра edge.vertex2 это первая точка в object.geometry.index
													//Для проверки использовать const geometry = new THREE.BufferGeometry();
									const i = object.geometry.index.array[index];
									if ( i === undefined )
										console.error( 'Intersections.createIntersections.Edge.Vertex: i = ' + i );
									return index;

								},
								get pointLocal() {

									const vertex = positions.itemSize === 3 ? new THREE.Vector3() : positions.itemSize === 4 ? new THREE.Vector3() : undefined;
									return vertex.fromBufferAttribute( positions, this.index );

								},
								get point() { return this.pointLocal.applyMatrix4( object.matrix ); },

							}

						};
						var vertex1, vertex2;
						Object.defineProperties( this, {

							intersection: { get: function () { return collisionResultsOriginPoint; }, },
							vertex1: {

								get: function () {

									if ( !vertex1 )
										vertex1 = Vertex( index );
									return vertex1
								}

							},
							vertex2: {

								get: function () {

									if ( !vertex2 )
										vertex2 = Vertex( index + 1 );
									return vertex2

								}

							},

						} );
						const rayOriginPoint = new THREE.Raycaster( this.vertex1.point,
							this.vertex2.point.clone().sub( this.vertex1.point ).clone().normalize(), 0,
							this.vertex2.point.distanceTo( this.vertex1.point ) ),

							//array - список точек пересечения, возвращенный THREE.Raycaster.intersectObjects
							//collisionResultsOriginPoint.length === 0 пересечений не обнаружено
							//undefined - точка пересечения еще не вычислялась
							//collisionResultsOriginPoint[i] = false - уже добавлен в arrayIntersectLoop
							collisionResultsOriginPoint = rayOriginPoint.intersectObjects( collidableMeshList );
						this.isCollision = function ( edge ) { return collisionResultsOriginPoint.length > 0; }

					}

				}
				const edge = new Edge();
				if ( edge.isCollision() ) edges.push( edge );

			}

			//список граней, пересекающихся с объектом
			const faces = [];
			class Face {

				/* *
				 * [Face]{@link https://threejs.org/docs/index.html?q=Fa#examples/en/math/convexhull/Face}
				 * @param {number} index index of vertices of the face <b>from object.geometry.index</b>
				 * @param {number} id identifier of the face in the <b>faces</b> array.
				 */
				constructor( index, id ) {

					const vectorIndex = new THREE.Vector3();
					vectorIndex.fromBufferAttribute( object.geometry.index, index );
					/*
									this.isMyEdge = function ( edge ) {
					
										function isSameEdge( edgeSame ) {
					
											return ( edge.vertex1.index === edgeSame.vertex1.index ) && ( edge.vertex2.index === edgeSame.vertex2.index )
					
										}
										return isSameEdge( edge1 ) || isSameEdge( edge2 ) || isSameEdge( edge3 );
					
									}
					*/
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

										if ( !faceEdges.edge3 ) {

											console.error( 'faceEdges.edge3 = ' + faceEdges.edge3 );
											if ( faceEdges.edge1.vertex1.index === faceEdges.edge2.vertex1.index )
												return faceEdges.edge2.vertex2;
											if ( faceEdges.edge1.vertex1.index === faceEdges.edge2.vertex2.index )
												return faceEdges.edge2.vertex1;
											if ( faceEdges.edge1.vertex2.index === faceEdges.edge2.vertex1.index )
												return faceEdges.edge2.vertex2;
											if ( faceEdges.edge1.vertex2.index === faceEdges.edge2.vertex2.index )
												return faceEdges.edge2.vertex1;
											return;

										}
										return ( faceEdges.edge1.vertex1.index !== faceEdges.edge3.vertex1.index ) &&
											( faceEdges.edge1.vertex2.index !== faceEdges.edge3.vertex1.index ) ?
											faceEdges.edge3.vertex1 : faceEdges.edge3.vertex2;

									},

								}

							}

						}

					} );
					//прилегающие к грани ребра
					function emtyIntersection() { return { intersection: { length: 0, }, } }
					const intersectionEdges = {};//список ребер, имеющих пересечения
					//список всех ребер грани
					const faceEdges = {

						set edge1( edge1 ) { intersectionEdges.edge1 = edge1 },
						get edge1() {

							if ( intersectionEdges.edge1 ) return intersectionEdges.edge1;
							return emtyIntersection();

						},
						set edge2( edge2 ) { intersectionEdges.edge2 = edge2 },
						get edge2() {

							if ( intersectionEdges.edge2 ) return intersectionEdges.edge2;
							return emtyIntersection();

						},
						set edge3( edge3 ) { intersectionEdges.edge3 = edge3 },
						get edge3() {

							if ( intersectionEdges.edge3 ) return intersectionEdges.edge3;
							return emtyIntersection();

						},

					};

					//Каждый face имеет три вершины vectorIndex
					//в этом цикле из списка всех ребер edges, полученных из object.geometry.index,
					//для face ищем три ребра faceEdges.edge1, faceEdges.edge2, faceEdges.edge3
					//и для каждого ребра ищем два face, которым принадлежит это ребро edge.faces.face1 и edge.faces.face2
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

							//if ( faceEdges.edge1 ) console.error( 'Face: duplicate faceEdges.edge1' );
							faceEdges.edge1 = edge;
							setFace( this );

						} else if (
							( vectorIndex.z === edge.vertex1.index ) && ( vectorIndex.y === edge.vertex2.index ) ||
							( vectorIndex.z === edge.vertex2.index ) && ( vectorIndex.y === edge.vertex1.index )
						) {

							//if ( faceEdges.edge2 ) console.error( 'Face: duplicate faceEdges.edge2' );
							faceEdges.edge2 = edge;
							setFace( this );

						} else if (
							( vectorIndex.z === edge.vertex1.index ) && ( vectorIndex.x === edge.vertex2.index ) ||
							( vectorIndex.z === edge.vertex2.index ) && ( vectorIndex.x === edge.vertex1.index )
						) {

							//if ( faceEdges.edge3 ) console.error( 'Face: duplicate faceEdges.edge3' );
							faceEdges.edge3 = edge;
							setFace( this );

						}
						if ( faceEdges.edge1.intersection.length && faceEdges.edge2.intersection.length && faceEdges.edge3.intersection.length )
							break;

					}
					//				this.isCollision = function () { return faceEdges.edge1 || faceEdges.edge2 || faceEdges.edge3; }
					this.isCollision = function () {

						return faceEdges.edge1.intersection.length || faceEdges.edge2.intersection.length || faceEdges.edge3.intersection.length;

					}
					//console.log( this.name + ' intersections: edge1 ' + faceEdges.edge1.intersection.length + ' edge2 ' + faceEdges.edge2.intersection.length + ' edge3 ' + faceEdges.edge3.intersection.length )
					//если эта грань имеет пересечения с объектом, то строим линии пересечения грани с объектом
					if ( this.isCollision() ) {

						const points = [];
						Object.keys( faceEdges ).forEach( key => {

							const edge = faceEdges[key];
							if ( edge.intersection.length ) {

								if ( edge.intersection.length > 1 ) console.error( 'under consraction' );
								if ( points.length > 1 ) console.error( 'Too many points in the intersection line' );
								points.push( edge.intersection[0].point );

							}

						} );
						const arrayIntersectLoop = [];//список точек, которые образуют линию пересечения объектов
						arrayIntersectLoops.push( arrayIntersectLoop );
						arrayIntersectLoop.intersectLine = new THREE.Line( new THREE.BufferGeometry().setFromPoints( points ),
							new THREE.LineBasicMaterial( { color: 0xffffff } ) );
						scene.add( arrayIntersectLoop.intersectLine );

					}

				}

			}
			for ( let index = 0; index < object.geometry.index.count; index += 3 ) {

				const face = new Face( index, faces.length );
				if ( face.isCollision() )
					faces.push( face );

			}
			console.log( 'faces' )

		}
		createIntersections();

		//список всех объектов, которые могут перемещаться и сталкиваться
		const arrayMovingObjects = [object];
		collidableMeshList.forEach( function ( object ) { arrayMovingObjects.push( object ); } );
		arrayMovingObjects.forEach( function ( object ) {

			object.userData.position = object.position.clone();
			object.userData.rotation = object.rotation.clone();
			object.userData.scale = object.scale.clone();

		} );
		if ( !options.intersections ) {

			options.intersections = function () {

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

						return;

					}

				}

			}

		} else console.error( 'Faces: Duplicate options.intersections' );

	}

}
export default Intersections;
