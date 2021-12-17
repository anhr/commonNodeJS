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
//import { SpriteText } from '../SpriteText/SpriteText.js'
//import { getWorldPosition } from '../getPosition.js';

//медленно работает
//import clearThree from '../clearThree.js';

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
		/*
		//debug
		if ( typeof SpriteText !== "undefined" ) {

			collidableMeshList.forEach( function ( mesh ) {

				for ( var i = 0; i < mesh.geometry.attributes.position.count; i++ )
					mesh.add( new SpriteText( i, new THREE.Vector3().fromBufferAttribute( mesh.geometry.attributes.position, i ) ) );

			} );

		}
		*/
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
			//console.log( 'index: ' + object.geometry.index.array[i] );
			//console.log( point1 );
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
/*
		function isSamePoint( point1, point2 ) {

			function isSameAxis( axis1, axis2 ) { return axis1 === axis2 }
			return isSameAxis( point1.x, point2.x ) && isSameAxis( point1.y, point2.y ) && isSameAxis( point1.z, point2.z );

		}
*/
		function arrayIntersectionsPush( intersection, array ) {

			const point1 = intersection.point;
			for ( var i = 0; i < array.length; i++ ) {

				function isSameAxis( axis1, axis2 ) { return axis1 === axis2 }
				const point2 = array[i].point;
				if ( isSameAxis( point1.x, point2.x ) && isSameAxis( point1.y, point2.y ) && isSameAxis( point1.z, point2.z ) )
					return;//не надо добавлять точки с одинаковым положением

			}
			array.push( intersection );

		}

		//точки пересечения одного тела с другим могут образовывать несколько замкнутых линий ( Loops ).
		//Например пересечение тора с плоскостью.
		//Здесь перечислены все обнруженные Loops точек пересечения.
		const arrayIntersectLoops = [];

		const edges = [];//список ребер
		//Заполнить список ребер
		for ( var index = 0; index < object.geometry.index.count; index += 3 ) {

			class Edge {

				constructor( index, index2 ) {

					function Vertex( index ) {

						//debug
						if ( typeof SpriteText !== "undefined" ) var spriteText;

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
								return i;
								//									return index;

							},
							get pointLocal() {

								const vertex = positions.itemSize === 3 ? new THREE.Vector3() : positions.itemSize === 4 ? new THREE.Vector3() : undefined;
								return vertex.fromBufferAttribute( positions, this.index );

							},
							get point() {

								const point = this.pointLocal.applyMatrix4( object.matrix );
//								const point = getWorldPosition( object, this.pointLocal );

								//debug
								if ( typeof SpriteText !== "undefined" && !spriteText ) {

									spriteText = new SpriteText( this.index, this.pointLocal );
									object.add( spriteText );

								}

								return point;

							},
							//debug
							set update( a ) { if ( typeof SpriteText !== "undefined" ) spriteText = a; },

						}

					};
					var vertex1, vertex2, collisionResultsOriginPoint, intersectionObject;

						//индексы точек пересечения, положение которых совпадает с положением точек пересечения на соседних ребрах грани.
						//Эти точи пересечения надо игнорировать, что бы количество точек пересечения на грани было четным.
						//Подробности в Face.intersections
					const arraySpliceIntersection = [],
						array = [];//только точки пересечения, которые нужно учитывать

					this.spliceIntersection = function ( index ) {

						arraySpliceIntersection.push( index );
						array.length = 0;

					}
//					this.emptySpliceIntersection = function () { arraySpliceIntersection.length = 0; }

					//debug
					if ( typeof SpriteText !== "undefined" ) { var groupSpriteText; }

					Object.defineProperties( this, {

						intersection: {
							get: function () {

								if ( !collisionResultsOriginPoint ) {

//if ( ( this.vertex1.index === 22 ) || ( this.vertex2.index === 22 ) )
//	console.log( 'this.vertex.index === 22' );
									const direction = this.vertex2.point.clone().sub( this.vertex1.point ).clone().normalize(),
										rayOriginPoint = new THREE.Raycaster( this.vertex1.point, direction, 0,
											this.vertex2.point.distanceTo( this.vertex1.point ) );
									//console.log( ' origin: ' + this.vertex1.point.x + ', ' + this.vertex1.point.y + ', ' + this.vertex1.point.z +
									//	' vertex2: ' + this.vertex2.point.x + ', ' + this.vertex2.point.y + ', ' + this.vertex2.point.z )
//										' direction: ' + direction.x + ', ' + direction.y + ', ' + direction.z )

									//array - список точек пересечения, возвращенный THREE.Raycaster.intersectObjects
									//collisionResultsOriginPoint.length === 0 пересечений не обнаружено
									//undefined - точка пересечения еще не вычислялась
									//collisionResultsOriginPoint[i] = false - уже добавлен в arrayIntersectLoop
									collisionResultsOriginPoint = rayOriginPoint.intersectObjects( collidableMeshList );//, false );//recursive = false на тот случай когда для отладки в пересекаемые объекты добавляю текст с номером вершины
/*
									//Возможно луч угодил в ребро.
									//Тогда появится две точки пересечения с разными гранями но с одинаковым положением.
									//Одну точку надо убрать
									for ( var index1 = 0; index1 < collisionResultsOriginPoint.length - 1; index1++ ){

										for ( var index2 = index1 + 1; index2 < collisionResultsOriginPoint.length; index2++ ){

											if ( collisionResultsOriginPoint[index1].distance === collisionResultsOriginPoint[index2].distance )
												collisionResultsOriginPoint.splice( index2, 1 );

										}

									}
*/

									if ( !this.faces )
										console.error( 'edge ' + this.vertex1.index + ' ' + this.vertex2.index + ' intersects ' + collisionResultsOriginPoint.length )

								}
								var res;
								if ( this.intersectionObject ) {

									if ( array.length === 0 ) {

										//Надо вывести только точки пересечения с объектом this.intersectionObject
										//и если в начале или конце соседнего ребра нет точки пересечения с такми же положением
										const intersectionObject = this.intersectionObject;
										collisionResultsOriginPoint.forEach( function ( intersection, index ) {

											if ( intersection.object.uuid === intersectionObject.uuid ) {


												//не добавлять точку пересечения в array если в другом ребре грани есть точка пересечения с тем же положением
												var boSpliceIntersection = false;
												for ( var i = 0; i < arraySpliceIntersection.length; i++ ) {

													if ( arraySpliceIntersection[i] === index ) {

														boSpliceIntersection = true;
														break;

													}

												}
												if ( !boSpliceIntersection )
													arrayIntersectionsPush( intersection, array );

											}

										} );

									}
									res = array;

								} else res = collisionResultsOriginPoint;
								/*
								//debug
								if ( typeof SpriteText !== "undefined" ) {

									if ( !groupSpriteText ) {

										groupSpriteText = new THREE.Group();
										object.parent.add( groupSpriteText );

									}
									groupSpriteText.children.forEach( function ( item ) { groupSpriteText.remove( item ); } );
									res.forEach( function ( intersection, index ) { groupSpriteText.add( new SpriteText( 'i' + index, intersection.point ) ); } );

								}
								*/
								return res;

							},
							set: function ( intersection ) {

								//debug
								this.vertex1.update = undefined;
								this.vertex2.update = undefined;

								collisionResultsOriginPoint = intersection;

							},

						},
						intersectionObject: {

							get: function () { return intersectionObject; },
							set: function ( intersectionObjectNew ) {

								intersectionObject = intersectionObjectNew;
								arraySpliceIntersection.length = 0;
								array.length = 0;

							},

						},
						vertex1: {

							get: function () {

								if ( !vertex1 )
									vertex1 = Vertex( index );
								return vertex1;
							}

						},
						vertex2: {

							get: function () {

								if ( !vertex2 )
									vertex2 = Vertex( index2 );
								return vertex2;

							}

						},

					} );

					/*
					//debug
					const index1 = object.geometry.index.array[this.vertex1.index], index2 = object.geometry.index.array[this.vertex2.index],
						edgeIndex1 = 9, edgeIndex2 = 18;
					//console.log( 'index1 = ' + index1 + ' index2 = ' + index2 );
					if (
						( ( index1 === edgeIndex1 ) && ( index2 === edgeIndex2 ) ) ||
						( ( index1 === edgeIndex2 ) && ( index2 === edgeIndex1 ) )
					)
						console.log( edgeIndex1 + ',' + edgeIndex2 );
					*/
					this.isCollision = function () { return collisionResultsOriginPoint.length > 0; }
					this.isSame = function ( edge ) {

						const boSame = ( ( this.vertex1.index === edge.vertex1.index ) && ( this.vertex2.index === edge.vertex2.index ) ) ||
							( ( this.vertex1.index === edge.vertex2.index ) && ( this.vertex2.index === edge.vertex1.index ) );
						if ( boSame === undefined ) boSame = false;
						return boSame;

					}

				}

			}
			edges.push( new Edge( index, index + 1 ) );
			edges.push( new Edge( index + 1, index + 2 ) );

			//Если поменять порядок индексов, то в edges появятся одинаковые ребра,
			//которые будут отличатся только переставленными edge.vector1 и edge.vector2
			//а это приведет к тому что в некоторых случаях не будет пересечения с объектом
			//если ребро пересекается с объектом одним из концов непонятно почему.
			//Как результат, могут появиться разрывы в линии пересечения.
			//Для проверки в примере установить plane( 'plane', new THREE.PlaneGeometry( 30, 30 ) ).rotation.y = Math.PI / 2;
			//и const objGeom = new THREE.DodecahedronGeometry( 10, 0 );
			//и obj.position.z = 8.9;
			edges.push( new Edge( index, index + 2 ) );

		}

		//список граней
		const faces = [];
		//Заполнить список граней
		for ( let index = 0; index < object.geometry.index.count; index += 3 ) {

			class Face {

				/* *
				 * [Face]{@link https://threejs.org/docs/index.html?q=Fa#examples/en/math/convexhull/Face}
				 * @param {number} index index of vertices of the face <b>from object.geometry.index</b>
				 * @param {number} id identifier of the face in the <b>faces</b> array.
				 */
				constructor( index, id ) {

					const vectorIndex = new THREE.Vector3();
					vectorIndex.fromBufferAttribute( object.geometry.index, index );
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
					function emtyIntersection() {
						return {

							intersection: [],
							isSame: function () { return true; },

						}
					}
					const intersectionEdges = {};//список ребер, имеющих пересечения
					//список всех ребер грани
					const faceEdges = {

						set edge1( edge1 ) { intersectionEdges.edge1 = edge1; },
						get edge1() {

							if ( intersectionEdges.edge1 ) return intersectionEdges.edge1;
							return emtyIntersection();

						},
						set edge2( edge2 ) { intersectionEdges.edge2 = edge2; },
						get edge2() {

							if ( intersectionEdges.edge2 ) return intersectionEdges.edge2;
							return emtyIntersection();

						},
						set edge3( edge3 ) { intersectionEdges.edge3 = edge3; },
						get edge3() {

							if ( intersectionEdges.edge3 ) return intersectionEdges.edge3;
							return emtyIntersection();

						},
						get intersectionObjects() {

							const intersectionObjects = [];
							function getObects( intersections ) {

								intersections.forEach( function ( intersection ) {

									var boAdded = false;
									for ( var i = 0; i < intersectionObjects.length; i++ ) {

										if ( intersection.object.uuid === intersectionObjects[i].uuid ) {

											boAdded = true;
											break;

										}

									}
									if ( !boAdded ) intersectionObjects.push( intersection.object );

								} );

							}
							getObects( faceEdges.edge1.intersection );
							getObects( faceEdges.edge2.intersection );
							getObects( faceEdges.edge3.intersection );
							return intersectionObjects;

						},
						set intersectionObject( intersectionObject ) {

							faceEdges.edge1.intersectionObject = intersectionObject;
							faceEdges.edge2.intersectionObject = intersectionObject;
							faceEdges.edge3.intersectionObject = intersectionObject;

						},
						get intersectionObject() { return faceEdges.edge1.intersectionObject; },

					}; 

					//Каждый face имеет три вершины vectorIndex
					//в этом цикле из списка всех ребер edges, полученных из object.geometry.index,
					//для face ищем три ребра faceEdges.edge1, faceEdges.edge2, faceEdges.edge3
					//и для каждого ребра ищем два face, которым принадлежит это ребро edge.faces.face1 и edge.faces.face2
					for ( var i = 0; i < edges.length; i++ ) {

						const edge = edges[i],
							vertex1Index = edge.vertex1.index,//object.geometry.index.array[edge.vertex1.index],
							vertex2Index = edge.vertex2.index;//object.geometry.index.array[edge.vertex2.index];
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
							( vectorIndex.x === vertex1Index ) && ( vectorIndex.y === vertex2Index ) ||
							( vectorIndex.x === vertex2Index ) && ( vectorIndex.y === vertex1Index )
						) {

							if ( !faceEdges.edge1.isSame( edge ) ) console.error( 'Face: duplicate faceEdges.edge1' );
							else {

								faceEdges.edge1 = edge;
								setFace( this );

							}

						} else if (
							( vectorIndex.z === vertex1Index ) && ( vectorIndex.y === vertex2Index ) ||
							( vectorIndex.z === vertex2Index ) && ( vectorIndex.y === vertex1Index )
						) {

							const boSame = faceEdges.edge2.isSame( edge );
							if ( !boSame ) console.error( 'Face: duplicate faceEdges.edge2' );
							else {

								faceEdges.edge2 = edge;
								setFace( this );

							}

						} else if (
							( vectorIndex.z === vertex1Index ) && ( vectorIndex.x === vertex2Index ) ||
							( vectorIndex.z === vertex2Index ) && ( vectorIndex.x === vertex1Index )
						) {

							if ( !faceEdges.edge3.isSame( edge ) ) console.error( 'Face: duplicate faceEdges.edge3' );
							else {

								faceEdges.edge3 = edge;
								setFace( this );

							}

						}

					}

					this.isCollision = function () {

						return faceEdges.edge1.intersection.length || faceEdges.edge2.intersection.length || faceEdges.edge3.intersection.length;

					}

					//debug
					if ( typeof SpriteText !== "undefined" ) { var groupSpriteText; }
					//console.log( this.name + ' intersections: edge1 ' + faceEdges.edge1.intersection.length + ' edge2 ' + faceEdges.edge2.intersection.length + ' edge3 ' + faceEdges.edge3.intersection.length )
					//если эта грань имеет пересечения с объектом, то строим линии пересечения грани с объектом
					this.intersections = function () {
						/*
						//debug
						if ( typeof SpriteText !== "undefined" ) {

							object.add( new SpriteText( 'e1v1 ' + faceEdges.edge1.vertex1.index, faceEdges.edge1.vertex1.pointLocal ) );
							object.add( new SpriteText( 'e1v2 ' + faceEdges.edge1.vertex2.index, faceEdges.edge1.vertex2.pointLocal ) );

							object.add( new SpriteText( 'e2v1 ' + faceEdges.edge2.vertex1.index, faceEdges.edge2.vertex1.pointLocal, { center: { x: 0, y: 0, } } ) );
							object.add( new SpriteText( 'e2v2 ' + faceEdges.edge2.vertex2.index, faceEdges.edge2.vertex2.pointLocal, { center: { x: 0, y: 0, } } ) );

							object.add( new SpriteText( 'e3v1 ' + faceEdges.edge3.vertex1.index, faceEdges.edge3.vertex1.pointLocal, { center: { x: 1, y: 0, } } ) );
							object.add( new SpriteText( 'e3v2 ' + faceEdges.edge3.vertex2.index, faceEdges.edge3.vertex2.pointLocal, { center: { x: 1, y: 0, } } ) );

						}
						*/
//if ( vectorIndex.equals( new THREE.Vector3( 18, 19, 10 ) ) )
if ( vectorIndex.equals( new THREE.Vector3( 0, 2, 40 ) ) )
	console.log( vectorIndex );
						//список объектов пересечения 
						const intersectionObjects = faceEdges.intersectionObjects;
						//Для каждого объекта пересечения делаем отдельные линии пересечения
						for ( var iIntersectionObject = 0; iIntersectionObject < intersectionObjects.length; iIntersectionObject++ ) {

							//Линии переаечения начинаем строить с faceEdges.edge1.vertex1.
							faceEdges.intersectionObject = intersectionObjects[iIntersectionObject];
							if ( !this.isCollision() )
								continue;//не пересекается

							//Надо убрать точки пересечения с одинаковыми координатами но в разных ребрах.
							//Это может произойти если начало или конец ребра пересекается с объектом
							//Тогда одна и таже точка будет в начале одного ребра и в конце другого
							//и количество точек будет нечетным. А это означает что грань вроде бы попала на край объекта
							//а я не рисую линию пересечения на краю объекта потому что не знаю как это делать
							function equals( point1, point2 ) {

								return point1.distanceTo( point2 ) <= 9.0e-10;//8.881784197001252e-16;

							}
							for ( var i = faceEdges.edge1.intersection.length - 1; i >= 0; i-- ) {

								for ( var j = faceEdges.edge2.intersection.length - 1; j >= 0; j-- ) {

									if ( ( faceEdges.edge1.intersection.length > i ) && ( faceEdges.edge2.intersection.length > j ) &&
										equals( faceEdges.edge1.intersection[i].point, faceEdges.edge2.intersection[j].point ) )
									{

										faceEdges.edge2.spliceIntersection( j );

									}
									for ( var k = faceEdges.edge3.intersection.length - 1; k >= 0; k-- ) {

										if ( ( faceEdges.edge1.intersection.length > i ) && ( faceEdges.edge3.intersection.length > k ) &&
											equals( faceEdges.edge1.intersection[i].point, faceEdges.edge3.intersection[k].point ) )
										{

											faceEdges.edge3.spliceIntersection( k );

										}
										if ( ( faceEdges.edge2.intersection.length > j ) && ( faceEdges.edge3.intersection.length > k ) &&
											equals( faceEdges.edge2.intersection[j].point, faceEdges.edge3.intersection[k].point ) )
										{

											faceEdges.edge3.spliceIntersection( k );

										}

									}

								}

							}

							function isOdd( num ) { return num % 2; }
							function isOddOrZero( num ) {

//								return num === 0 ? true : isOdd( num );
								return isOdd( num );

							}
//							const intersectionCount = faceEdges.edge1.intersection.length + faceEdges.edge2.intersection.length + faceEdges.edge3.intersection.length;

							function arrayIntersectionsPushEdge( vertexIndex, edge ) {

								switch ( vertexIndex ) {

									case edge.vertex1.index:

										for ( var i = 0; i < edge.intersection.length; i++ )
											arrayIntersectionsPush( edge.intersection[i], arrayIntersections );
										break;

									case edge.vertex2.index:

										for ( var i = edge.intersection.length - 1; i >= 0; i-- )
											arrayIntersectionsPush( edge.intersection[i], arrayIntersections );
										break;

									default: console.error( 'Face.intersections: arrayIntersections push failed!' );

								}

							}
							function arrayIntersectionsPushEdge3( vertexIndex ) {

								arrayIntersectionsPushEdge( vertexIndex, faceEdges.edge3 );
/*
								switch ( vertexIndex ) {

									case faceEdges.edge3.vertex1.index:

										for ( var i = 0; i < faceEdges.edge3.intersection.length; i++ )
											arrayIntersectionsPush( faceEdges.edge3.intersection[i], arrayIntersections );
										break;

									case faceEdges.edge3.vertex2.index:

										for ( var i = faceEdges.edge3.intersection.length - 1; i >= 0; i-- )
											arrayIntersectionsPush( faceEdges.edge3.intersection[i], arrayIntersections );
										break;

									default: console.error( 'Face.intersections: arrayIntersections push failed!' );

								}
*/

							}
							function arrayIntersectionsPushEdge2( vertexIndex ) {

								arrayIntersectionsPushEdge( vertexIndex, faceEdges.edge2 );
/*
								switch ( vertexIndex ) {

									case faceEdges.edge2.vertex1.index:

										for ( var i = 0; i < faceEdges.edge2.intersection.length; i++ )
											arrayIntersectionsPush( faceEdges.edge2.intersection[i], arrayIntersections );
										break;

									case faceEdges.edge2.vertex2.index:

										for ( var i = faceEdges.edge2.intersection.length - 1; i >= 0; i-- )
											arrayIntersectionsPush( faceEdges.edge2.intersection[i], arrayIntersections );
										break;

									default: console.error( 'Face.intersections: arrayIntersections push failed!' );

								}
*/

							}
							//Все точки пересечения, начиная с faceEdges.edge1
							const arrayIntersections = [];
							var lastEdge;//ребро, которое имеет общую точку с faceEdges.edge1.vertex1
							for ( var i = 0; i < faceEdges.edge1.intersection.length; i++ )
								arrayIntersectionsPush( faceEdges.edge1.intersection[i], arrayIntersections );
							switch ( faceEdges.edge1.vertex2.index ) {

								case faceEdges.edge2.vertex1.index:

									lastEdge = faceEdges.edge3;
									//первая точка пересечения в faceEdges.edge2.intersection находтся ближе к faceEdges.edge1.vertex2
									for ( var i = 0; i < faceEdges.edge2.intersection.length; i++ )
										arrayIntersectionsPush( faceEdges.edge2.intersection[i], arrayIntersections );
									arrayIntersectionsPushEdge3( faceEdges.edge2.vertex2.index );
/*
									switch ( faceEdges.edge2.vertex2.index ) {

										case faceEdges.edge3.vertex1.index:

											for ( var i = 0; i < faceEdges.edge3.intersection.length; i++ )
												arrayIntersectionsPush( faceEdges.edge3.intersection[i], arrayIntersections );
											break;

										case faceEdges.edge3.vertex2.index:

											for ( var i = faceEdges.edge3.intersection.length - 1; i >= 0; i-- )
												arrayIntersectionsPush( faceEdges.edge3.intersection[i], arrayIntersections );
											break;

										default: console.error( 'Face.intersections: arrayIntersections push failed!' );

									}
*/
									break;

								case faceEdges.edge2.vertex2.index:

									lastEdge = faceEdges.edge3;
									//первая точка пересечения в faceEdges.edge2.intersection находтся дальше от faceEdges.edge1.vertex2
									for ( var i = faceEdges.edge2.intersection.length - 1; i >= 0; i-- )
										arrayIntersectionsPush( faceEdges.edge2.intersection[i], arrayIntersections );
									arrayIntersectionsPushEdge3( faceEdges.edge2.vertex1.index );
/*
									switch ( faceEdges.edge2.vertex1.index ) {

										case faceEdges.edge3.vertex1.index:

											for ( var i = 0; i < faceEdges.edge3.intersection.length; i++ )
												arrayIntersectionsPush( faceEdges.edge3.intersection[i], arrayIntersections );
											break;

										case faceEdges.edge3.vertex2.index:

											for ( var i = faceEdges.edge3.intersection.length - 1; i >= 0; i-- )
												arrayIntersectionsPush( faceEdges.edge3.intersection[i], arrayIntersections );
											break;

										default: console.error( 'Face.intersections: arrayIntersections push failed!' );

									}
*/
									break;

								case faceEdges.edge3.vertex1.index:

									lastEdge = faceEdges.edge2;
									//первая точка пересечения в faceEdges.edge3.intersection находтся ближе к faceEdges.edge1.vertex2
									for ( var i = 0; i < faceEdges.edge3.intersection.length; i++ )
										arrayIntersectionsPush( faceEdges.edge3.intersection[i], arrayIntersections );
									arrayIntersectionsPushEdge2( faceEdges.edge3.vertex2.index );
/*
									switch ( faceEdges.edge3.vertex2.index ) {

										case faceEdges.edge2.vertex1.index:

											for ( var i = 0; i < faceEdges.edge2.intersection.length; i++ )
												arrayIntersectionsPush( faceEdges.edge2.intersection[i], arrayIntersections );
											break;

										case faceEdges.edge2.vertex2.index:

											for ( var i = faceEdges.edge2.intersection.length - 1; i >= 0; i-- )
												arrayIntersectionsPush( faceEdges.edge2.intersection[i], arrayIntersections );
											break;

										default: console.error( 'Face.intersections: arrayIntersections push failed!' );

									}
*/
									break;

								case faceEdges.edge3.vertex2.index:

									lastEdge = faceEdges.edge2;
									//первая точка пересечения в faceEdges.edge3.intersection находтся дальше от faceEdges.edge1.vertex2
									for ( var i = faceEdges.edge3.intersection.length - 1; i >= 0; i-- )
										arrayIntersectionsPush( faceEdges.edge3.intersection[i], arrayIntersections );
									arrayIntersectionsPushEdge2( faceEdges.edge3.vertex1.index );
/*
									switch ( faceEdges.edge3.vertex1.index ) {

										case faceEdges.edge2.vertex1.index:

											for ( var i = 0; i < faceEdges.edge2.intersection.length; i++ )
												arrayIntersectionsPush( faceEdges.edge2.intersection[i], arrayIntersections );
											break;

										case faceEdges.edge2.vertex2.index:

											for ( var i = faceEdges.edge2.intersection.length - 1; i >= 0; i-- )
												arrayIntersectionsPush( faceEdges.edge2.intersection[i], arrayIntersections );
											break;

										default: console.error( 'Face.intersections: arrayIntersections push failed!' );

									}
*/
									break;

								default: console.error( 'Face.intersections: arrayIntersections push failed!' );

							}
/*
							if ( faceEdges.edge2.vertex1.index === faceEdges.edge1.vertex2.index ) {

								//первая точка пересечения в faceEdges.edge2.intersection находтся ближе к faceEdges.edge1
								for ( var i = 0; i < faceEdges.edge2.intersection.length; i++ )
									arrayIntersectionsPush( faceEdges.edge2.intersection[i], arrayIntersections );

							} else {

								//первая точка пересечения в faceEdges.edge2.intersection находтся ближе к faceEdges.edge2
								for ( var i = faceEdges.edge2.intersection.length - 1; i >= 0; i-- )
									arrayIntersectionsPush( faceEdges.edge2.intersection[i], arrayIntersections );

							}
							if ( faceEdges.edge3.vertex1.index === faceEdges.edge2.vertex2.index ) {

								//первая точка пересечения в faceEdges.edge3.intersection находтся ближе к faceEdges.edge2
								for ( var i = 0; i < faceEdges.edge3.intersection.length; i++ )
									arrayIntersectionsPush( faceEdges.edge3.intersection[i], arrayIntersections );

							} else {

								//первая точка пересечения в faceEdges.edge3.intersection находтся ближе к faceEdges.edge1
								for ( var i = faceEdges.edge3.intersection.length - 1; i >= 0; i-- )
									arrayIntersectionsPush( faceEdges.edge3.intersection[i], arrayIntersections );

							}
*/
							/*
							//debug
							if ( typeof SpriteText !== "undefined" ) {

								if ( !groupSpriteText ) {

									groupSpriteText = new THREE.Group();
									object.parent.add( groupSpriteText );

								}
								for ( var i = groupSpriteText.children.length - 1; i >= 0; i-- )
									groupSpriteText.remove( groupSpriteText.children[i] );
								arrayIntersections.forEach( function ( intersection, index ) { groupSpriteText.add( new SpriteText( index, intersection.point, { center: { x: 0, y: 0, } } ) ); } );

							}
							*/
							const intersectionCount = arrayIntersections.length;
							if ( isOdd( intersectionCount ) ) {

								//console.log( 'Нечетное количество точек пересечения. Край объекта' );
								continue;

							}
							function createIntersectLineSegment( points ) {

								const arrayIntersectLoop = [];//список точек, которые образуют линию пересечения объектов
								arrayIntersectLoops.push( arrayIntersectLoop );
								arrayIntersectLoop.intersectLine = new THREE.Line( new THREE.BufferGeometry().setFromPoints( points ),
									new THREE.LineBasicMaterial( { color: 0xffffff } ) );
								scene.add( arrayIntersectLoop.intersectLine );
								if ( options.guiSelectPoint ) {

									arrayIntersectLoop.intersectLine.name = 'line segment ' + arrayIntersectLoops.length;
									options.guiSelectPoint.addMesh( arrayIntersectLoop.intersectLine );

								}

							}
							if ( intersectionCount === 2 )
								createIntersectLineSegment( [arrayIntersections[0].point, arrayIntersections[1].point] );
							else if ( !isOddOrZero( faceEdges.edge1.intersection.length ) || !isOddOrZero( lastEdge.intersection.length ) ) {

								//faceEdges.edge1.vertex1 нахоится снаружи объекта.
								//Тогда первую линию пересечения проводим через ближайшие к faceEdges.edge1.vertex1 точки пересечения
								//console.log( faceEdges.intersectionObject.name + ' faceEdges.edge1.vertex1 нахоится снаружи объекта.' );
								for ( var i = 0; i < intersectionCount / 2; i++ )
									createIntersectLineSegment( [arrayIntersections[i].point, arrayIntersections[intersectionCount - 1 - i].point] );

							} else {

								//faceEdges.edge1.vertex1 нахоится внутри объекта.
								//Тогда сегметы линий пересечения делаем последовательно из точек arrayIntersections
								//console.log( faceEdges.intersectionObject.name + ' faceEdges.edge1.vertex1 нахоится внутри объекта.' );
								for ( var i = 0; i < intersectionCount; i += 2 )
									createIntersectLineSegment( [arrayIntersections[i].point, arrayIntersections[i + 1].point] );

							}
/*
							if ( !isOddOrZero( faceEdges.edge1.intersection.length ) || !isOddOrZero( faceEdges.edge3.intersection.length ) ) {

								//faceEdges.edge1.vertex1 нахоится снаружи объекта.
								//Тогда первую линию пересечения проводим через ближайшие к faceEdges.edge1.vertex1 точки пересечения
								//console.log( faceEdges.intersectionObject.name + ' faceEdges.edge1.vertex1 нахоится снаружи объекта.' );
								if ( !isOddOrZero( faceEdges.edge1.intersection.length ) )
									for ( var i = 0; i < intersectionCount / 2; i++ )
										createIntersectLineSegment( [arrayIntersections[i].point, arrayIntersections[intersectionCount - 1 - i].point] );
								else {

									if ( intersectionCount === 2 )
										createIntersectLineSegment( [arrayIntersections[0].point, arrayIntersections[1].point] );
									else for ( var i = 0; i < intersectionCount - 2; i++ )
										createIntersectLineSegment( [arrayIntersections[i].point, arrayIntersections[i + 2].point] );

								}

							} else {

								//faceEdges.edge1.vertex1 нахоится внутри объекта.
								//console.log( faceEdges.intersectionObject.name + ' faceEdges.edge1.vertex1 нахоится внутри объекта.' );
								for ( var i = 0; i < intersectionCount; i += 2 ) {

									createIntersectLineSegment( [arrayIntersections[i].point, arrayIntersections[i + 1].point] );

								}

							}
*/

						}
						faceEdges.intersectionObject = undefined;
/*
						faceEdges.edge1.emptySpliceIntersection();
						faceEdges.edge2.emptySpliceIntersection();
						faceEdges.edge3.emptySpliceIntersection();
*/

					}

				}

			}
			faces.push( new Face( index, faces.length ) );

		}
		//console.log( 'faces' )

		function createIntersections() {

			//Во время отладки у объекта могут быть дочение SpriteText с индксами вершин
			while ( object.children.length > 0 ) { object.remove( object.children[0] ); };

			for ( var i = arrayIntersectLoops.length - 1; i >= 0; i-- ) {

				//https://stackoverflow.com/a/68004442/5175935
				function removeObject3D( object3D ) {

					if ( !( object3D instanceof THREE.Object3D ) ) return false;

					// for better memory management and performance
					object3D.geometry.dispose();
					if ( object3D.material instanceof Array ) {
						// for better memory management and performance
						object3D.material.forEach( material => material.dispose() );
					} else {
						// for better memory management and performance
						object3D.material.dispose();
					}
					object3D.removeFromParent(); // the parent might be the scene or another Object3D, but it is sure to be removed this way
					return true;

				}
				const arrayIntersectLoop = arrayIntersectLoops[i];
				if ( arrayIntersectLoop.intersectLine ) {

//					scene.remove( arrayIntersectLoop.intersectLine );
					removeObject3D( arrayIntersectLoop.intersectLine );
//					clearThree( arrayIntersectLoop.intersectLine );
					if ( options.guiSelectPoint ) options.guiSelectPoint.removeMesh( arrayIntersectLoop.intersectLine );
					arrayIntersectLoop.intersectLine = null;

				}
				if ( arrayIntersectLoop.intersectPoints ) {

//					scene.remove( arrayIntersectLoop.intersectPoints );
					removeObject3D( arrayIntersectLoop.intersectPoints );
//					clearThree( arrayIntersectLoop.intersectPoints );
					if ( options.guiSelectPoint ) options.guiSelectPoint.removeMesh( arrayIntersectLoop.intersectPoints );
					arrayIntersectLoop.intersectPoints = null;

				}
				arrayIntersectLoops.pop();

			}
/*
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
*/

			//ищем точки пересечения
			edges.forEach( function ( edge ) {

				edge.intersection = undefined;
				edge.intersection;

			} );

			//Строим линии пересечения
			faces.forEach( function ( face ) {

				face.intersections();

			} );

		}
		setTimeout( function () { createIntersections(); }, 0 );//Таймаут нужен что бы установился matrixWorld объектов из collidableMeshList.
		//Иначе линии пересечения будут строиться без учета реального положения, повррота и масштаба объектов из collidableMeshList.

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
