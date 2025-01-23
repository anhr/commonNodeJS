/**
 * @module ND
 * @description N-dimensional graphics.
 *
 * @author [Andrej Hristoliubov]{@link https://github.com/anhr}
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.ND = {}));
})(this, (function (exports) { 'use strict';

	/**
	 * three class for [THREE]{@link https://github.com/anhr/three.js} and [dat.GUI(...)]{@link https://github.com/anhr/dat.gui} variables.
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

	/*если импортировать THREE, то при "npm run build" получу ошибку
	 * (babel plugin) ReferenceError: Unknown plugin "external-helpers" specified in "base" at 1, attempted to resolve relative to 
	//import * as THREE from 'https://threejs.org/build/three.module.js';
	//import * as THREE from '../../../../../three.js/dev/build/three.module.min.js';
	//import * as THREE from '../../three.js/dev/build/three.module.js';
	//import * as THREE from '../../three.js/dev/src/Three.js';
	//import * as THREE from 'https://raw.githack.com/anhr/three.js/dev/build/three.module.js';
	//import * as THREE from 'https://raw.githack.com/anhr/three.js/dev/build/three.module.min.js';
	*/

	var _THREE, _dat, _Three;

	class Three {

		/**
		 * class for [THREE]{@link https://github.com/anhr/three.js} and [dat]{@link https://github.com/dataarts/dat.gui} instances.
		 * */
		constructor() {}
		/**
		 * set [THREE]{@link https://github.com/anhr/three.js}
		 */
		set THREE( THREE ) {

			if ( _THREE ) {

				if ( !Object.is( THREE, _THREE ) )
					console.error( 'three: duplicate THREE. Please use one instance of the THREE library.' );
				return;

			}
			_THREE = THREE;
			_Three = this;

			const //BufferGeometry = THREE.BufferGeometry,
				Float32BufferAttribute = THREE.Float32BufferAttribute,
				Line3 = THREE.Line3,
				Plane = THREE.Plane,
				Triangle = THREE.Triangle,
				Vector3 = THREE.Vector3;

			function ConvexHull() {

				const Visible = 0;
				const Deleted = 1;

				const _v1 = new Vector3();
				const _line3 = new Line3();
				const _plane = new Plane();
				const _closestPoint = new Vector3();
				const _triangle = new Triangle();

				class ConvexHull {

					constructor() {

						this.tolerance = - 1;

						this.faces = []; // the generated faces of the convex hull
						this.newFaces = []; // this array holds the faces that are generated within a single iteration

						// the vertex lists work as follows:
						//
						// let 'a' and 'b' be 'Face' instances
						// let 'v' be points wrapped as instance of 'Vertex'
						//
						//     [v, v, ..., v, v, v, ...]
						//      ^             ^
						//      |             |
						//  a.outside     b.outside
						//
						this.assigned = new VertexList();
						this.unassigned = new VertexList();

						this.vertices = []; 	// vertices of the hull (internal representation of given geometry data)

					}

					setFromPoints( points ) {

						if ( Array.isArray( points ) !== true ) {

							console.error( 'THREE.ConvexHull: Points parameter is not an array.' );

						}

						if ( points.length < 4 ) {

							console.error( 'THREE.ConvexHull: The algorithm needs at least four points.' );

						}

						this.makeEmpty();

						for ( let i = 0, l = points.length; i < l; i++ ) {

							this.vertices.push( new VertexNode( points[i] ) );

						}

						this.compute();

						return this;

					}

					setFromObject( object ) {

						const points = [];

						object.updateMatrixWorld( true );

						object.traverse( function ( node ) {

							const geometry = node.geometry;

							if ( geometry !== undefined ) {

								if ( geometry.isGeometry ) {

									console.error( 'THREE.ConvexHull no longer supports Geometry. Use THREE.BufferGeometry instead.' );
									return;

								} else if ( geometry.isBufferGeometry ) {

									const attribute = geometry.attributes.position;

									if ( attribute !== undefined ) {

										for ( let i = 0, l = attribute.count; i < l; i++ ) {

											const point = new Vector3();

											point.fromBufferAttribute( attribute, i ).applyMatrix4( node.matrixWorld );

											points.push( point );

										}

									}

								}

							}

						} );

						return this.setFromPoints( points );

					}

					containsPoint( point ) {

						const faces = this.faces;

						for ( let i = 0, l = faces.length; i < l; i++ ) {

							const face = faces[i];

							// compute signed distance and check on what half space the point lies

							if ( face.distanceToPoint( point ) > this.tolerance ) return false;

						}

						return true;

					}

					intersectRay( ray, target ) {

						// based on "Fast Ray-Convex Polyhedron Intersection"  by Eric Haines, GRAPHICS GEMS II

						const faces = this.faces;

						let tNear = - Infinity;
						let tFar = Infinity;

						for ( let i = 0, l = faces.length; i < l; i++ ) {

							const face = faces[i];

							// interpret faces as planes for the further computation

							const vN = face.distanceToPoint( ray.origin );
							const vD = face.normal.dot( ray.direction );

							// if the origin is on the positive side of a plane (so the plane can "see" the origin) and
							// the ray is turned away or parallel to the plane, there is no intersection

							if ( vN > 0 && vD >= 0 ) return null;

							// compute the distance from the ray’s origin to the intersection with the plane

							const t = ( vD !== 0 ) ? ( - vN / vD ) : 0;

							// only proceed if the distance is positive. a negative distance means the intersection point
							// lies "behind" the origin

							if ( t <= 0 ) continue;

							// now categorized plane as front-facing or back-facing

							if ( vD > 0 ) {

								//  plane faces away from the ray, so this plane is a back-face

								tFar = Math.min( t, tFar );

							} else {

								// front-face

								tNear = Math.max( t, tNear );

							}

							if ( tNear > tFar ) {

								// if tNear ever is greater than tFar, the ray must miss the convex hull

								return null;

							}

						}

						// evaluate intersection point

						// always try tNear first since its the closer intersection point

						if ( tNear !== - Infinity ) {

							ray.at( tNear, target );

						} else {

							ray.at( tFar, target );

						}

						return target;

					}

					intersectsRay( ray ) {

						return this.intersectRay( ray, _v1 ) !== null;

					}

					makeEmpty() {

						this.faces = [];
						this.vertices = [];

						return this;

					}

					// Adds a vertex to the 'assigned' list of vertices and assigns it to the given face

					addVertexToFace( vertex, face ) {

						vertex.face = face;

						if ( face.outside === null ) {

							this.assigned.append( vertex );

						} else {

							this.assigned.insertBefore( face.outside, vertex );

						}

						face.outside = vertex;

						return this;

					}

					// Removes a vertex from the 'assigned' list of vertices and from the given face

					removeVertexFromFace( vertex, face ) {

						if ( vertex === face.outside ) {

							// fix face.outside link

							if ( vertex.next !== null && vertex.next.face === face ) {

								// face has at least 2 outside vertices, move the 'outside' reference

								face.outside = vertex.next;

							} else {

								// vertex was the only outside vertex that face had

								face.outside = null;

							}

						}

						this.assigned.remove( vertex );

						return this;

					}

					// Removes all the visible vertices that a given face is able to see which are stored in the 'assigned' vertext list

					removeAllVerticesFromFace( face ) {

						if ( face.outside !== null ) {

							// reference to the first and last vertex of this face

							const start = face.outside;
							let end = face.outside;

							while ( end.next !== null && end.next.face === face ) {

								end = end.next;

							}

							this.assigned.removeSubList( start, end );

							// fix references

							start.prev = end.next = null;
							face.outside = null;

							return start;

						}

					}

					// Removes all the visible vertices that 'face' is able to see

					deleteFaceVertices( face, absorbingFace ) {

						const faceVertices = this.removeAllVerticesFromFace( face );

						if ( faceVertices !== undefined ) {

							if ( absorbingFace === undefined ) {

								// mark the vertices to be reassigned to some other face

								this.unassigned.appendChain( faceVertices );


							} else {

								// if there's an absorbing face try to assign as many vertices as possible to it

								let vertex = faceVertices;

								do {

									// we need to buffer the subsequent vertex at this point because the 'vertex.next' reference
									// will be changed by upcoming method calls

									const nextVertex = vertex.next;

									const distance = absorbingFace.distanceToPoint( vertex.point );

									// check if 'vertex' is able to see 'absorbingFace'

									if ( distance > this.tolerance ) {

										this.addVertexToFace( vertex, absorbingFace );

									} else {

										this.unassigned.append( vertex );

									}

									// now assign next vertex

									vertex = nextVertex;

								} while ( vertex !== null );

							}

						}

						return this;

					}

					// Reassigns as many vertices as possible from the unassigned list to the new faces

					resolveUnassignedPoints( newFaces ) {

						if ( this.unassigned.isEmpty() === false ) {

							let vertex = this.unassigned.first();

							do {

								// buffer 'next' reference, see .deleteFaceVertices()

								const nextVertex = vertex.next;

								let maxDistance = this.tolerance;

								let maxFace = null;

								for ( let i = 0; i < newFaces.length; i++ ) {

									const face = newFaces[i];

									if ( face.mark === Visible ) {

										const distance = face.distanceToPoint( vertex.point );

										if ( distance > maxDistance ) {

											maxDistance = distance;
											maxFace = face;

										}

										if ( maxDistance > 1000 * this.tolerance ) break;

									}

								}

								// 'maxFace' can be null e.g. if there are identical vertices

								if ( maxFace !== null ) {

									this.addVertexToFace( vertex, maxFace );

								}

								vertex = nextVertex;

							} while ( vertex !== null );

						}

						return this;

					}

					// Computes the extremes of a simplex which will be the initial hull

					computeExtremes() {

						const min = new Vector3();
						const max = new Vector3();

						const minVertices = [];
						const maxVertices = [];

						// initially assume that the first vertex is the min/max

						for ( let i = 0; i < 3; i++ ) {

							minVertices[i] = maxVertices[i] = this.vertices[0];

						}

						min.copy( this.vertices[0].point );
						max.copy( this.vertices[0].point );

						// compute the min/max vertex on all six directions

						for ( let i = 0, l = this.vertices.length; i < l; i++ ) {

							const vertex = this.vertices[i];
							const point = vertex.point;

							// update the min coordinates

							for ( let j = 0; j < 3; j++ ) {

								if ( point.getComponent( j ) < min.getComponent( j ) ) {

									min.setComponent( j, point.getComponent( j ) );
									minVertices[j] = vertex;

								}

							}

							// update the max coordinates

							for ( let j = 0; j < 3; j++ ) {

								if ( point.getComponent( j ) > max.getComponent( j ) ) {

									max.setComponent( j, point.getComponent( j ) );
									maxVertices[j] = vertex;

								}

							}

						}

						// use min/max vectors to compute an optimal epsilon

						this.tolerance = 3 * Number.EPSILON * (
							Math.max( Math.abs( min.x ), Math.abs( max.x ) ) +
							Math.max( Math.abs( min.y ), Math.abs( max.y ) ) +
							Math.max( Math.abs( min.z ), Math.abs( max.z ) )
						);

						return { min: minVertices, max: maxVertices };

					}

					// Computes the initial simplex assigning to its faces all the points
					// that are candidates to form part of the hull

					computeInitialHull() {

						const vertices = this.vertices;
						const extremes = this.computeExtremes();
						const min = extremes.min;
						const max = extremes.max;

						// 1. Find the two vertices 'v0' and 'v1' with the greatest 1d separation
						// (max.x - min.x)
						// (max.y - min.y)
						// (max.z - min.z)

						let maxDistance = 0;
						let index = 0;

						for ( let i = 0; i < 3; i++ ) {

							const distance = max[i].point.getComponent( i ) - min[i].point.getComponent( i );

							if ( distance > maxDistance ) {

								maxDistance = distance;
								index = i;

							}

						}

						const v0 = min[index];
						const v1 = max[index];
						let v2;
						let v3;

						// 2. The next vertex 'v2' is the one farthest to the line formed by 'v0' and 'v1'

						maxDistance = 0;
						_line3.set( v0.point, v1.point );

						for ( let i = 0, l = this.vertices.length; i < l; i++ ) {

							const vertex = vertices[i];

							if ( vertex !== v0 && vertex !== v1 ) {

								_line3.closestPointToPoint( vertex.point, true, _closestPoint );

								const distance = _closestPoint.distanceToSquared( vertex.point );

								if ( distance > maxDistance ) {

									maxDistance = distance;
									v2 = vertex;

								}

							}

						}

						// 3. The next vertex 'v3' is the one farthest to the plane 'v0', 'v1', 'v2'

						maxDistance = - 1;
						_plane.setFromCoplanarPoints( v0.point, v1.point, v2.point );

						for ( let i = 0, l = this.vertices.length; i < l; i++ ) {

							const vertex = vertices[i];

							if ( vertex !== v0 && vertex !== v1 && vertex !== v2 ) {

								const distance = Math.abs( _plane.distanceToPoint( vertex.point ) );

								if ( distance > maxDistance ) {

									maxDistance = distance;
									v3 = vertex;

								}

							}

						}

						const faces = [];

						if ( _plane.distanceToPoint( v3.point ) < 0 ) {

							// the face is not able to see the point so 'plane.normal' is pointing outside the tetrahedron

							faces.push(
								Face.create( v0, v1, v2 ),
								Face.create( v3, v1, v0 ),
								Face.create( v3, v2, v1 ),
								Face.create( v3, v0, v2 )
							);

							// set the twin edge

							for ( let i = 0; i < 3; i++ ) {

								const j = ( i + 1 ) % 3;

								// join face[ i ] i > 0, with the first face

								faces[i + 1].getEdge( 2 ).setTwin( faces[0].getEdge( j ) );

								// join face[ i ] with face[ i + 1 ], 1 <= i <= 3

								faces[i + 1].getEdge( 1 ).setTwin( faces[j + 1].getEdge( 0 ) );

							}

						} else {

							// the face is able to see the point so 'plane.normal' is pointing inside the tetrahedron

							faces.push(
								Face.create( v0, v2, v1 ),
								Face.create( v3, v0, v1 ),
								Face.create( v3, v1, v2 ),
								Face.create( v3, v2, v0 )
							);

							// set the twin edge

							for ( let i = 0; i < 3; i++ ) {

								const j = ( i + 1 ) % 3;

								// join face[ i ] i > 0, with the first face

								faces[i + 1].getEdge( 2 ).setTwin( faces[0].getEdge( ( 3 - i ) % 3 ) );

								// join face[ i ] with face[ i + 1 ]

								faces[i + 1].getEdge( 0 ).setTwin( faces[j + 1].getEdge( 1 ) );

							}

						}

						// the initial hull is the tetrahedron

						for ( let i = 0; i < 4; i++ ) {

							this.faces.push( faces[i] );

						}

						// initial assignment of vertices to the faces of the tetrahedron

						for ( let i = 0, l = vertices.length; i < l; i++ ) {

							const vertex = vertices[i];

							if ( vertex !== v0 && vertex !== v1 && vertex !== v2 && vertex !== v3 ) {

								maxDistance = this.tolerance;
								let maxFace = null;

								for ( let j = 0; j < 4; j++ ) {

									const distance = this.faces[j].distanceToPoint( vertex.point );

									if ( distance > maxDistance ) {

										maxDistance = distance;
										maxFace = this.faces[j];

									}

								}

								if ( maxFace !== null ) {

									this.addVertexToFace( vertex, maxFace );

								}

							}

						}

						return this;

					}

					// Removes inactive faces

					reindexFaces() {

						const activeFaces = [];

						for ( let i = 0; i < this.faces.length; i++ ) {

							const face = this.faces[i];

							if ( face.mark === Visible ) {

								activeFaces.push( face );

							}

						}

						this.faces = activeFaces;

						return this;

					}

					// Finds the next vertex to create faces with the current hull

					nextVertexToAdd() {

						// if the 'assigned' list of vertices is empty, no vertices are left. return with 'undefined'

						if ( this.assigned.isEmpty() === false ) {

							let eyeVertex, maxDistance = 0;

							// grap the first available face and start with the first visible vertex of that face

							const eyeFace = this.assigned.first().face;
							let vertex = eyeFace.outside;

							// now calculate the farthest vertex that face can see

							do {

								const distance = eyeFace.distanceToPoint( vertex.point );

								if ( distance > maxDistance ) {

									maxDistance = distance;
									eyeVertex = vertex;

								}

								vertex = vertex.next;

							} while ( vertex !== null && vertex.face === eyeFace );

							return eyeVertex;

						}

					}

					// Computes a chain of half edges in CCW order called the 'horizon'.
					// For an edge to be part of the horizon it must join a face that can see
					// 'eyePoint' and a face that cannot see 'eyePoint'.

					computeHorizon( eyePoint, crossEdge, face, horizon ) {

						// moves face's vertices to the 'unassigned' vertex list

						this.deleteFaceVertices( face );

						face.mark = Deleted;

						let edge;

						if ( crossEdge === null ) {

							edge = crossEdge = face.getEdge( 0 );

						} else {

							// start from the next edge since 'crossEdge' was already analyzed
							// (actually 'crossEdge.twin' was the edge who called this method recursively)

							edge = crossEdge.next;

						}

						do {

							const twinEdge = edge.twin;
							const oppositeFace = twinEdge.face;

							if ( oppositeFace.mark === Visible ) {

								if ( oppositeFace.distanceToPoint( eyePoint ) > this.tolerance ) {

									// the opposite face can see the vertex, so proceed with next edge

									this.computeHorizon( eyePoint, twinEdge, oppositeFace, horizon );

								} else {

									// the opposite face can't see the vertex, so this edge is part of the horizon

									horizon.push( edge );

								}

							}

							edge = edge.next;

						} while ( edge !== crossEdge );

						return this;

					}

					// Creates a face with the vertices 'eyeVertex.point', 'horizonEdge.tail' and 'horizonEdge.head' in CCW order

					addAdjoiningFace( eyeVertex, horizonEdge ) {

						// all the half edges are created in ccw order thus the face is always pointing outside the hull

						const face = Face.create( eyeVertex, horizonEdge.tail(), horizonEdge.head() );

						this.faces.push( face );

						// join face.getEdge( - 1 ) with the horizon's opposite edge face.getEdge( - 1 ) = face.getEdge( 2 )

						face.getEdge( - 1 ).setTwin( horizonEdge.twin );

						return face.getEdge( 0 ); // the half edge whose vertex is the eyeVertex


					}

					//  Adds 'horizon.length' faces to the hull, each face will be linked with the
					//  horizon opposite face and the face on the left/right

					addNewFaces( eyeVertex, horizon ) {

						this.newFaces = [];

						let firstSideEdge = null;
						let previousSideEdge = null;

						for ( let i = 0; i < horizon.length; i++ ) {

							const horizonEdge = horizon[i];

							// returns the right side edge

							const sideEdge = this.addAdjoiningFace( eyeVertex, horizonEdge );

							if ( firstSideEdge === null ) {

								firstSideEdge = sideEdge;

							} else {

								// joins face.getEdge( 1 ) with previousFace.getEdge( 0 )

								sideEdge.next.setTwin( previousSideEdge );

							}

							this.newFaces.push( sideEdge.face );
							previousSideEdge = sideEdge;

						}

						// perform final join of new faces

						firstSideEdge.next.setTwin( previousSideEdge );

						return this;

					}

					// Adds a vertex to the hull

					addVertexToHull( eyeVertex ) {

						const horizon = [];

						this.unassigned.clear();

						// remove 'eyeVertex' from 'eyeVertex.face' so that it can't be added to the 'unassigned' vertex list

						this.removeVertexFromFace( eyeVertex, eyeVertex.face );

						this.computeHorizon( eyeVertex.point, null, eyeVertex.face, horizon );

						this.addNewFaces( eyeVertex, horizon );

						// reassign 'unassigned' vertices to the new faces

						this.resolveUnassignedPoints( this.newFaces );

						return this;

					}

					cleanup() {

						this.assigned.clear();
						this.unassigned.clear();
						this.newFaces = [];

						return this;

					}

					compute() {

						let vertex;

						this.computeInitialHull();

						// add all available vertices gradually to the hull

						while ( ( vertex = this.nextVertexToAdd() ) !== undefined ) {

							this.addVertexToHull( vertex );

						}

						this.reindexFaces();

						this.cleanup();

						return this;

					}

				}
				this.ConvexHull = ConvexHull;

				//

				class Face {

					constructor() {

						this.normal = new Vector3();
						this.midpoint = new Vector3();
						this.area = 0;

						this.constant = 0; // signed distance from face to the origin
						this.outside = null; // reference to a vertex in a vertex list this face can see
						this.mark = Visible;
						this.edge = null;

					}

					static create( a, b, c ) {

						const face = new Face();

						const e0 = new HalfEdge( a, face );
						const e1 = new HalfEdge( b, face );
						const e2 = new HalfEdge( c, face );

						// join edges

						e0.next = e2.prev = e1;
						e1.next = e0.prev = e2;
						e2.next = e1.prev = e0;

						// main half edge reference

						face.edge = e0;

						return face.compute();

					}

					getEdge( i ) {

						let edge = this.edge;

						while ( i > 0 ) {

							edge = edge.next;
							i--;

						}

						while ( i < 0 ) {

							edge = edge.prev;
							i++;

						}

						return edge;

					}

					compute() {

						const a = this.edge.tail();
						const b = this.edge.head();
						const c = this.edge.next.head();

						_triangle.set( a.point, b.point, c.point );

						_triangle.getNormal( this.normal );
						_triangle.getMidpoint( this.midpoint );
						this.area = _triangle.getArea();

						this.constant = this.normal.dot( this.midpoint );

						return this;

					}

					distanceToPoint( point ) {

						return this.normal.dot( point ) - this.constant;

					}

				}

				// Entity for a Doubly-Connected Edge List (DCEL).

				class HalfEdge {


					constructor( vertex, face ) {

						this.vertex = vertex;
						this.prev = null;
						this.next = null;
						this.twin = null;
						this.face = face;

					}

					head() {

						return this.vertex;

					}

					tail() {

						return this.prev ? this.prev.vertex : null;

					}

					length() {

						const head = this.head();
						const tail = this.tail();

						if ( tail !== null ) {

							return tail.point.distanceTo( head.point );

						}

						return - 1;

					}

					lengthSquared() {

						const head = this.head();
						const tail = this.tail();

						if ( tail !== null ) {

							return tail.point.distanceToSquared( head.point );

						}

						return - 1;

					}

					setTwin( edge ) {

						this.twin = edge;
						edge.twin = this;

						return this;

					}

				}

				// A vertex as a double linked list node.

				class VertexNode {

					constructor( point ) {

						this.point = point;
						this.prev = null;
						this.next = null;
						this.face = null; // the face that is able to see this vertex

					}

				}

				// A double linked list that contains vertex nodes.

				class VertexList {

					constructor() {

						this.head = null;
						this.tail = null;

					}

					first() {

						return this.head;

					}

					last() {

						return this.tail;

					}

					clear() {

						this.head = this.tail = null;

						return this;

					}

					// Inserts a vertex before the target vertex

					insertBefore( target, vertex ) {

						vertex.prev = target.prev;
						vertex.next = target;

						if ( vertex.prev === null ) {

							this.head = vertex;

						} else {

							vertex.prev.next = vertex;

						}

						target.prev = vertex;

						return this;

					}

					// Inserts a vertex after the target vertex

					insertAfter( target, vertex ) {

						vertex.prev = target;
						vertex.next = target.next;

						if ( vertex.next === null ) {

							this.tail = vertex;

						} else {

							vertex.next.prev = vertex;

						}

						target.next = vertex;

						return this;

					}

					// Appends a vertex to the end of the linked list

					append( vertex ) {

						if ( this.head === null ) {

							this.head = vertex;

						} else {

							this.tail.next = vertex;

						}

						vertex.prev = this.tail;
						vertex.next = null; // the tail has no subsequent vertex

						this.tail = vertex;

						return this;

					}

					// Appends a chain of vertices where 'vertex' is the head.

					appendChain( vertex ) {

						if ( this.head === null ) {

							this.head = vertex;

						} else {

							this.tail.next = vertex;

						}

						vertex.prev = this.tail;

						// ensure that the 'tail' reference points to the last vertex of the chain

						while ( vertex.next !== null ) {

							vertex = vertex.next;

						}

						this.tail = vertex;

						return this;

					}

					// Removes a vertex from the linked list

					remove( vertex ) {

						if ( vertex.prev === null ) {

							this.head = vertex.next;

						} else {

							vertex.prev.next = vertex.next;

						}

						if ( vertex.next === null ) {

							this.tail = vertex.prev;

						} else {

							vertex.next.prev = vertex.prev;

						}

						return this;

					}

					// Removes a list of vertices whose 'head' is 'a' and whose 'tail' is b

					removeSubList( a, b ) {

						if ( a.prev === null ) {

							this.head = b.next;

						} else {

							a.prev.next = b.next;

						}

						if ( b.next === null ) {

							this.tail = a.prev;

						} else {

							b.next.prev = a.prev;

						}

						return this;

					}

					isEmpty() {

						return this.head === null;

					}

				}

			}
			this.ConvexHull = new ConvexHull().ConvexHull;

	/*
			import { Vector3 } from '../math/Vector3.js';
			import { Vector2 } from '../math/Vector2.js';
			import { Box3 } from '../math/Box3.js';
			import { EventDispatcher } from './EventDispatcher.js';
			import { BufferAttribute, Float32BufferAttribute, Uint16BufferAttribute, Uint32BufferAttribute } from './BufferAttribute.js';
			import { Sphere } from '../math/Sphere.js';
			import { Object3D } from './Object3D.js';
			import { Matrix4 } from '../math/Matrix4.js';
			import { Matrix3 } from '../math/Matrix3.js';
			import * as MathUtils from '../math/MathUtils.js';
			import { arrayMax } from '../utils.js';
	*/
			const Vector2 = three.THREE.Vector2,
				Box3 = three.THREE.Box3,

				BufferAttribute = three.THREE.BufferAttribute,
				Uint16BufferAttribute = three.THREE.Uint16BufferAttribute,
				Uint32BufferAttribute = three.THREE.Uint32BufferAttribute,

				Sphere = three.THREE.Sphere,
				Object3D = three.THREE.Object3D,
				Matrix4 = three.THREE.Matrix4,
				Matrix3 = three.THREE.Matrix3,
				arrayMax = three.THREE.arrayMax,
				MathUtils = three.THREE.MathUtils;

			/**
			 * https://github.com/mrdoob/eventdispatcher.js/
			 */

			class EventDispatcher {

				addEventListener( type, listener ) {

					if ( this._listeners === undefined ) this._listeners = {};

					const listeners = this._listeners;

					if ( listeners[type] === undefined ) {

						listeners[type] = [];

					}

					if ( listeners[type].indexOf( listener ) === - 1 ) {

						listeners[type].push( listener );

					}

				}

				hasEventListener( type, listener ) {

					if ( this._listeners === undefined ) return false;

					const listeners = this._listeners;

					return listeners[type] !== undefined && listeners[type].indexOf( listener ) !== - 1;

				}

				removeEventListener( type, listener ) {

					if ( this._listeners === undefined ) return;

					const listeners = this._listeners;
					const listenerArray = listeners[type];

					if ( listenerArray !== undefined ) {

						const index = listenerArray.indexOf( listener );

						if ( index !== - 1 ) {

							listenerArray.splice( index, 1 );

						}

					}

				}

				dispatchEvent( event ) {

					if ( this._listeners === undefined ) return;

					const listeners = this._listeners;
					const listenerArray = listeners[event.type];

					if ( listenerArray !== undefined ) {

						event.target = this;

						// Make a copy, in case listeners are removed while iterating.
						const array = listenerArray.slice( 0 );

						for ( let i = 0, l = array.length; i < l; i++ ) {

							array[i].call( this, event );

						}

						event.target = null;

					}

				}

			}

			let _id = 0;

			const _m1 = /*@__PURE__*/ new Matrix4();
			const _obj = /*@__PURE__*/ new Object3D();
			const _offset = /*@__PURE__*/ new Vector3();
			const _box = /*@__PURE__*/ new Box3();
			const _boxMorphTargets = /*@__PURE__*/ new Box3();
			const _vector = /*@__PURE__*/ new Vector3();

			//Не могу брать BufferGeometry из three.THREE потому что тогда получу ошибку
			//Uncaught TypeError: Class constructor BufferGeometry cannot be invoked without 'new'
			//если буду использовать библиотеку 'myThree/build/myThree.module.js'
			class BufferGeometry extends EventDispatcher {

				constructor() {

					super();

					Object.defineProperty( this, 'id', { value: _id++ } );

					this.uuid = MathUtils.generateUUID();

					this.name = '';
					this.type = 'BufferGeometry';

					this.index = null;
					this.attributes = {};

					this.morphAttributes = {};
					this.morphTargetsRelative = false;

					this.groups = [];

					this.boundingBox = null;
					this.boundingSphere = null;

					this.drawRange = { start: 0, count: Infinity };

					this.userData = {};

				}

				getIndex() {

					return this.index;

				}

				setIndex( index ) {

					if ( Array.isArray( index ) ) {

						this.index = new ( arrayMax( index ) > 65535 ? Uint32BufferAttribute : Uint16BufferAttribute )( index, 1 );

					} else {

						this.index = index;

					}

					return this;

				}

				getAttribute( name ) {

					return this.attributes[name];

				}

				setAttribute( name, attribute ) {

					this.attributes[name] = attribute;

					return this;

				}

				deleteAttribute( name ) {

					delete this.attributes[name];

					return this;

				}

				hasAttribute( name ) {

					return this.attributes[name] !== undefined;

				}

				addGroup( start, count, materialIndex = 0 ) {

					this.groups.push( {

						start: start,
						count: count,
						materialIndex: materialIndex

					} );

				}

				clearGroups() {

					this.groups = [];

				}

				setDrawRange( start, count ) {

					this.drawRange.start = start;
					this.drawRange.count = count;

				}

				applyMatrix4( matrix ) {

					const position = this.attributes.position;

					if ( position !== undefined ) {

						position.applyMatrix4( matrix );

						position.needsUpdate = true;

					}

					const normal = this.attributes.normal;

					if ( normal !== undefined ) {

						const normalMatrix = new Matrix3().getNormalMatrix( matrix );

						normal.applyNormalMatrix( normalMatrix );

						normal.needsUpdate = true;

					}

					const tangent = this.attributes.tangent;

					if ( tangent !== undefined ) {

						tangent.transformDirection( matrix );

						tangent.needsUpdate = true;

					}

					if ( this.boundingBox !== null ) {

						this.computeBoundingBox();

					}

					if ( this.boundingSphere !== null ) {

						this.computeBoundingSphere();

					}

					return this;

				}

				applyQuaternion( q ) {

					_m1.makeRotationFromQuaternion( q );

					this.applyMatrix4( _m1 );

					return this;

				}

				rotateX( angle ) {

					// rotate geometry around world x-axis

					_m1.makeRotationX( angle );

					this.applyMatrix4( _m1 );

					return this;

				}

				rotateY( angle ) {

					// rotate geometry around world y-axis

					_m1.makeRotationY( angle );

					this.applyMatrix4( _m1 );

					return this;

				}

				rotateZ( angle ) {

					// rotate geometry around world z-axis

					_m1.makeRotationZ( angle );

					this.applyMatrix4( _m1 );

					return this;

				}

				translate( x, y, z ) {

					// translate geometry

					_m1.makeTranslation( x, y, z );

					this.applyMatrix4( _m1 );

					return this;

				}

				scale( x, y, z ) {

					// scale geometry

					_m1.makeScale( x, y, z );

					this.applyMatrix4( _m1 );

					return this;

				}

				lookAt( vector ) {

					_obj.lookAt( vector );

					_obj.updateMatrix();

					this.applyMatrix4( _obj.matrix );

					return this;

				}

				center() {

					this.computeBoundingBox();

					this.boundingBox.getCenter( _offset ).negate();

					this.translate( _offset.x, _offset.y, _offset.z );

					return this;

				}

				setFromPoints( points ) {

					const position = [];

					for ( let i = 0, l = points.length; i < l; i++ ) {

						const point = points[i];
						position.push( point.x, point.y, point.z || 0 );

					}

					this.setAttribute( 'position', new Float32BufferAttribute( position, 3 ) );

					return this;

				}

				computeBoundingBox() {

					if ( this.boundingBox === null ) {

						this.boundingBox = new Box3();

					}

					const position = this.attributes.position;
					const morphAttributesPosition = this.morphAttributes.position;

					if ( position && position.isGLBufferAttribute ) {

						console.error( 'THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".', this );

						this.boundingBox.set(
							new Vector3( - Infinity, - Infinity, - Infinity ),
							new Vector3( + Infinity, + Infinity, + Infinity )
						);

						return;

					}

					if ( position !== undefined ) {

						this.boundingBox.setFromBufferAttribute( position );

						// process morph attributes if present

						if ( morphAttributesPosition ) {

							for ( let i = 0, il = morphAttributesPosition.length; i < il; i++ ) {

								const morphAttribute = morphAttributesPosition[i];
								_box.setFromBufferAttribute( morphAttribute );

								if ( this.morphTargetsRelative ) {

									_vector.addVectors( this.boundingBox.min, _box.min );
									this.boundingBox.expandByPoint( _vector );

									_vector.addVectors( this.boundingBox.max, _box.max );
									this.boundingBox.expandByPoint( _vector );

								} else {

									this.boundingBox.expandByPoint( _box.min );
									this.boundingBox.expandByPoint( _box.max );

								}

							}

						}

					} else {

						this.boundingBox.makeEmpty();

					}

					if ( isNaN( this.boundingBox.min.x ) || isNaN( this.boundingBox.min.y ) || isNaN( this.boundingBox.min.z ) ) {

						console.error( 'THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.', this );

					}

				}

				computeBoundingSphere() {

					if ( this.boundingSphere === null ) {

						this.boundingSphere = new Sphere();

					}

					const position = this.attributes.position;
					const morphAttributesPosition = this.morphAttributes.position;

					if ( position && position.isGLBufferAttribute ) {

						console.error( 'THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".', this );

						this.boundingSphere.set( new Vector3(), Infinity );

						return;

					}

					if ( position ) {

						// first, find the center of the bounding sphere

						const center = this.boundingSphere.center;

						_box.setFromBufferAttribute( position );

						// process morph attributes if present

						if ( morphAttributesPosition ) {

							for ( let i = 0, il = morphAttributesPosition.length; i < il; i++ ) {

								const morphAttribute = morphAttributesPosition[i];
								_boxMorphTargets.setFromBufferAttribute( morphAttribute );

								if ( this.morphTargetsRelative ) {

									_vector.addVectors( _box.min, _boxMorphTargets.min );
									_box.expandByPoint( _vector );

									_vector.addVectors( _box.max, _boxMorphTargets.max );
									_box.expandByPoint( _vector );

								} else {

									_box.expandByPoint( _boxMorphTargets.min );
									_box.expandByPoint( _boxMorphTargets.max );

								}

							}

						}

						_box.getCenter( center );

						// second, try to find a boundingSphere with a radius smaller than the
						// boundingSphere of the boundingBox: sqrt(3) smaller in the best case

						let maxRadiusSq = 0;

						for ( let i = 0, il = position.count; i < il; i++ ) {

							_vector.fromBufferAttribute( position, i );

							maxRadiusSq = Math.max( maxRadiusSq, center.distanceToSquared( _vector ) );

						}

						// process morph attributes if present

						if ( morphAttributesPosition ) {

							for ( let i = 0, il = morphAttributesPosition.length; i < il; i++ ) {

								const morphAttribute = morphAttributesPosition[i];
								const morphTargetsRelative = this.morphTargetsRelative;

								for ( let j = 0, jl = morphAttribute.count; j < jl; j++ ) {

									_vector.fromBufferAttribute( morphAttribute, j );

									if ( morphTargetsRelative ) {

										_offset.fromBufferAttribute( position, j );
										_vector.add( _offset );

									}

									maxRadiusSq = Math.max( maxRadiusSq, center.distanceToSquared( _vector ) );

								}

							}

						}

						this.boundingSphere.radius = Math.sqrt( maxRadiusSq );

						if ( isNaN( this.boundingSphere.radius ) ) {

							console.error( 'THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.', this );

						}

					}

				}

				computeTangents() {

					const index = this.index;
					const attributes = this.attributes;

					// based on http://www.terathon.com/code/tangent.html
					// (per vertex tangents)

					if ( index === null ||
						attributes.position === undefined ||
						attributes.normal === undefined ||
						attributes.uv === undefined ) {

						console.error( 'THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)' );
						return;

					}

					const indices = index.array;
					const positions = attributes.position.array;
					const normals = attributes.normal.array;
					const uvs = attributes.uv.array;

					const nVertices = positions.length / 3;

					if ( attributes.tangent === undefined ) {

						this.setAttribute( 'tangent', new BufferAttribute( new Float32Array( 4 * nVertices ), 4 ) );

					}

					const tangents = attributes.tangent.array;

					const tan1 = [], tan2 = [];

					for ( let i = 0; i < nVertices; i++ ) {

						tan1[i] = new Vector3();
						tan2[i] = new Vector3();

					}

					const vA = new Vector3(),
						vB = new Vector3(),
						vC = new Vector3(),

						uvA = new Vector2(),
						uvB = new Vector2(),
						uvC = new Vector2(),

						sdir = new Vector3(),
						tdir = new Vector3();

					function handleTriangle( a, b, c ) {

						vA.fromArray( positions, a * 3 );
						vB.fromArray( positions, b * 3 );
						vC.fromArray( positions, c * 3 );

						uvA.fromArray( uvs, a * 2 );
						uvB.fromArray( uvs, b * 2 );
						uvC.fromArray( uvs, c * 2 );

						vB.sub( vA );
						vC.sub( vA );

						uvB.sub( uvA );
						uvC.sub( uvA );

						const r = 1.0 / ( uvB.x * uvC.y - uvC.x * uvB.y );

						// silently ignore degenerate uv triangles having coincident or colinear vertices

						if ( !isFinite( r ) ) return;

						sdir.copy( vB ).multiplyScalar( uvC.y ).addScaledVector( vC, - uvB.y ).multiplyScalar( r );
						tdir.copy( vC ).multiplyScalar( uvB.x ).addScaledVector( vB, - uvC.x ).multiplyScalar( r );

						tan1[a].add( sdir );
						tan1[b].add( sdir );
						tan1[c].add( sdir );

						tan2[a].add( tdir );
						tan2[b].add( tdir );
						tan2[c].add( tdir );

					}

					let groups = this.groups;

					if ( groups.length === 0 ) {

						groups = [{
							start: 0,
							count: indices.length
						}];

					}

					for ( let i = 0, il = groups.length; i < il; ++i ) {

						const group = groups[i];

						const start = group.start;
						const count = group.count;

						for ( let j = start, jl = start + count; j < jl; j += 3 ) {

							handleTriangle(
								indices[j + 0],
								indices[j + 1],
								indices[j + 2]
							);

						}

					}

					const tmp = new Vector3(), tmp2 = new Vector3();
					const n = new Vector3(), n2 = new Vector3();

					function handleVertex( v ) {

						n.fromArray( normals, v * 3 );
						n2.copy( n );

						const t = tan1[v];

						// Gram-Schmidt orthogonalize

						tmp.copy( t );
						tmp.sub( n.multiplyScalar( n.dot( t ) ) ).normalize();

						// Calculate handedness

						tmp2.crossVectors( n2, t );
						const test = tmp2.dot( tan2[v] );
						const w = ( test < 0.0 ) ? - 1.0 : 1.0;

						tangents[v * 4] = tmp.x;
						tangents[v * 4 + 1] = tmp.y;
						tangents[v * 4 + 2] = tmp.z;
						tangents[v * 4 + 3] = w;

					}

					for ( let i = 0, il = groups.length; i < il; ++i ) {

						const group = groups[i];

						const start = group.start;
						const count = group.count;

						for ( let j = start, jl = start + count; j < jl; j += 3 ) {

							handleVertex( indices[j + 0] );
							handleVertex( indices[j + 1] );
							handleVertex( indices[j + 2] );

						}

					}

				}

				computeVertexNormals() {

					const index = this.index;
					const positionAttribute = this.getAttribute( 'position' );

					if ( positionAttribute !== undefined ) {

						let normalAttribute = this.getAttribute( 'normal' );

						if ( normalAttribute === undefined ) {

							normalAttribute = new BufferAttribute( new Float32Array( positionAttribute.count * 3 ), 3 );
							this.setAttribute( 'normal', normalAttribute );

						} else {

							// reset existing normals to zero

							for ( let i = 0, il = normalAttribute.count; i < il; i++ ) {

								normalAttribute.setXYZ( i, 0, 0, 0 );

							}

						}

						const pA = new Vector3(), pB = new Vector3(), pC = new Vector3();
						const nA = new Vector3(), nB = new Vector3(), nC = new Vector3();
						const cb = new Vector3(), ab = new Vector3();

						// indexed elements

						if ( index ) {

							for ( let i = 0, il = index.count; i < il; i += 3 ) {

								const vA = index.getX( i + 0 );
								const vB = index.getX( i + 1 );
								const vC = index.getX( i + 2 );

								pA.fromBufferAttribute( positionAttribute, vA );
								pB.fromBufferAttribute( positionAttribute, vB );
								pC.fromBufferAttribute( positionAttribute, vC );

								cb.subVectors( pC, pB );
								ab.subVectors( pA, pB );
								cb.cross( ab );

								nA.fromBufferAttribute( normalAttribute, vA );
								nB.fromBufferAttribute( normalAttribute, vB );
								nC.fromBufferAttribute( normalAttribute, vC );

								nA.add( cb );
								nB.add( cb );
								nC.add( cb );

								normalAttribute.setXYZ( vA, nA.x, nA.y, nA.z );
								normalAttribute.setXYZ( vB, nB.x, nB.y, nB.z );
								normalAttribute.setXYZ( vC, nC.x, nC.y, nC.z );

							}

						} else {

							// non-indexed elements (unconnected triangle soup)

							for ( let i = 0, il = positionAttribute.count; i < il; i += 3 ) {

								pA.fromBufferAttribute( positionAttribute, i + 0 );
								pB.fromBufferAttribute( positionAttribute, i + 1 );
								pC.fromBufferAttribute( positionAttribute, i + 2 );

								cb.subVectors( pC, pB );
								ab.subVectors( pA, pB );
								cb.cross( ab );

								normalAttribute.setXYZ( i + 0, cb.x, cb.y, cb.z );
								normalAttribute.setXYZ( i + 1, cb.x, cb.y, cb.z );
								normalAttribute.setXYZ( i + 2, cb.x, cb.y, cb.z );

							}

						}

						this.normalizeNormals();

						normalAttribute.needsUpdate = true;

					}

				}

				merge( geometry, offset ) {

					if ( !( geometry && geometry.isBufferGeometry ) ) {

						console.error( 'THREE.BufferGeometry.merge(): geometry not an instance of THREE.BufferGeometry.', geometry );
						return;

					}

					if ( offset === undefined ) {

						offset = 0;

						console.warn(
							'THREE.BufferGeometry.merge(): Overwriting original geometry, starting at offset=0. '
							+ 'Use BufferGeometryUtils.mergeBufferGeometries() for lossless merge.'
						);

					}

					const attributes = this.attributes;

					for ( const key in attributes ) {

						if ( geometry.attributes[key] === undefined ) continue;

						const attribute1 = attributes[key];
						const attributeArray1 = attribute1.array;

						const attribute2 = geometry.attributes[key];
						const attributeArray2 = attribute2.array;

						const attributeOffset = attribute2.itemSize * offset;
						const length = Math.min( attributeArray2.length, attributeArray1.length - attributeOffset );

						for ( let i = 0, j = attributeOffset; i < length; i++ , j++ ) {

							attributeArray1[j] = attributeArray2[i];

						}

					}

					return this;

				}

				normalizeNormals() {

					const normals = this.attributes.normal;

					for ( let i = 0, il = normals.count; i < il; i++ ) {

						_vector.fromBufferAttribute( normals, i );

						_vector.normalize();

						normals.setXYZ( i, _vector.x, _vector.y, _vector.z );

					}

				}

				toNonIndexed() {

					function convertBufferAttribute( attribute, indices ) {

						const array = attribute.array;
						const itemSize = attribute.itemSize;
						const normalized = attribute.normalized;

						const array2 = new array.constructor( indices.length * itemSize );

						let index = 0, index2 = 0;

						for ( let i = 0, l = indices.length; i < l; i++ ) {

							if ( attribute.isInterleavedBufferAttribute ) {

								index = indices[i] * attribute.data.stride + attribute.offset;

							} else {

								index = indices[i] * itemSize;

							}

							for ( let j = 0; j < itemSize; j++ ) {

								array2[index2++] = array[index++];

							}

						}

						return new BufferAttribute( array2, itemSize, normalized );

					}

					//

					if ( this.index === null ) {

						console.warn( 'THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed.' );
						return this;

					}

					const geometry2 = new BufferGeometry();

					const indices = this.index.array;
					const attributes = this.attributes;

					// attributes

					for ( const name in attributes ) {

						const attribute = attributes[name];

						const newAttribute = convertBufferAttribute( attribute, indices );

						geometry2.setAttribute( name, newAttribute );

					}

					// morph attributes

					const morphAttributes = this.morphAttributes;

					for ( const name in morphAttributes ) {

						const morphArray = [];
						const morphAttribute = morphAttributes[name]; // morphAttribute: array of Float32BufferAttributes

						for ( let i = 0, il = morphAttribute.length; i < il; i++ ) {

							const attribute = morphAttribute[i];

							const newAttribute = convertBufferAttribute( attribute, indices );

							morphArray.push( newAttribute );

						}

						geometry2.morphAttributes[name] = morphArray;

					}

					geometry2.morphTargetsRelative = this.morphTargetsRelative;

					// groups

					const groups = this.groups;

					for ( let i = 0, l = groups.length; i < l; i++ ) {

						const group = groups[i];
						geometry2.addGroup( group.start, group.count, group.materialIndex );

					}

					return geometry2;

				}

				toJSON() {

					const data = {
						metadata: {
							version: 4.5,
							type: 'BufferGeometry',
							generator: 'BufferGeometry.toJSON'
						}
					};

					// standard BufferGeometry serialization

					data.uuid = this.uuid;
					data.type = this.type;
					if ( this.name !== '' ) data.name = this.name;
					if ( Object.keys( this.userData ).length > 0 ) data.userData = this.userData;

					if ( this.parameters !== undefined ) {

						const parameters = this.parameters;

						for ( const key in parameters ) {

							if ( parameters[key] !== undefined ) data[key] = parameters[key];

						}

						return data;

					}

					// for simplicity the code assumes attributes are not shared across geometries, see #15811

					data.data = { attributes: {} };

					const index = this.index;

					if ( index !== null ) {

						data.data.index = {
							type: index.array.constructor.name,
							array: Array.prototype.slice.call( index.array )
						};

					}

					const attributes = this.attributes;

					for ( const key in attributes ) {

						const attribute = attributes[key];

						data.data.attributes[key] = attribute.toJSON( data.data );

					}

					const morphAttributes = {};
					let hasMorphAttributes = false;

					for ( const key in this.morphAttributes ) {

						const attributeArray = this.morphAttributes[key];

						const array = [];

						for ( let i = 0, il = attributeArray.length; i < il; i++ ) {

							const attribute = attributeArray[i];

							array.push( attribute.toJSON( data.data ) );

						}

						if ( array.length > 0 ) {

							morphAttributes[key] = array;

							hasMorphAttributes = true;

						}

					}

					if ( hasMorphAttributes ) {

						data.data.morphAttributes = morphAttributes;
						data.data.morphTargetsRelative = this.morphTargetsRelative;

					}

					const groups = this.groups;

					if ( groups.length > 0 ) {

						data.data.groups = JSON.parse( JSON.stringify( groups ) );

					}

					const boundingSphere = this.boundingSphere;

					if ( boundingSphere !== null ) {

						data.data.boundingSphere = {
							center: boundingSphere.center.toArray(),
							radius: boundingSphere.radius
						};

					}

					return data;

				}

				clone() {

					return new this.constructor().copy( this );

				}

				copy( source ) {

					// reset

					this.index = null;
					this.attributes = {};
					this.morphAttributes = {};
					this.groups = [];
					this.boundingBox = null;
					this.boundingSphere = null;

					// used for storing cloned, shared data

					const data = {};

					// name

					this.name = source.name;

					// index

					const index = source.index;

					if ( index !== null ) {

						this.setIndex( index.clone( data ) );

					}

					// attributes

					const attributes = source.attributes;

					for ( const name in attributes ) {

						const attribute = attributes[name];
						this.setAttribute( name, attribute.clone( data ) );

					}

					// morph attributes

					const morphAttributes = source.morphAttributes;

					for ( const name in morphAttributes ) {

						const array = [];
						const morphAttribute = morphAttributes[name]; // morphAttribute: array of Float32BufferAttributes

						for ( let i = 0, l = morphAttribute.length; i < l; i++ ) {

							array.push( morphAttribute[i].clone( data ) );

						}

						this.morphAttributes[name] = array;

					}

					this.morphTargetsRelative = source.morphTargetsRelative;

					// groups

					const groups = source.groups;

					for ( let i = 0, l = groups.length; i < l; i++ ) {

						const group = groups[i];
						this.addGroup( group.start, group.count, group.materialIndex );

					}

					// bounding box

					const boundingBox = source.boundingBox;

					if ( boundingBox !== null ) {

						this.boundingBox = boundingBox.clone();

					}

					// bounding sphere

					const boundingSphere = source.boundingSphere;

					if ( boundingSphere !== null ) {

						this.boundingSphere = boundingSphere.clone();

					}

					// draw range

					this.drawRange.start = source.drawRange.start;
					this.drawRange.count = source.drawRange.count;

					// user data

					this.userData = source.userData;

					// geometry generator parameters

					if ( source.parameters !== undefined ) this.parameters = Object.assign( {}, source.parameters );

					return this;

				}

				dispose() {

					this.dispatchEvent( { type: 'dispose' } );

				}

			}

			BufferGeometry.prototype.isBufferGeometry = true;
			/*
			import {
				BufferGeometry,
				Float32BufferAttribute
			} from '../../../build/three.module.js';
			*/
			//import { ConvexHull } from '../math/ConvexHull.js';
			//ConvexGeometry

			class ConvexGeometry extends BufferGeometry {

				constructor( points ) {

					super();

					// buffers

					const vertices = [];
					const normals = [];

					if ( ConvexHull === undefined ) {

						console.error( 'THREE.ConvexBufferGeometry: ConvexBufferGeometry relies on ConvexHull' );

					}

					const convexHull = new _Three.ConvexHull().setFromPoints( points );

					// generate vertices and normals

					const faces = convexHull.faces;

					for ( let i = 0; i < faces.length; i++ ) {

						const face = faces[i];
						let edge = face.edge;

						// we move along a doubly-connected edge list to access all face points (see HalfEdge docs)

						do {

							const point = edge.head().point;

							vertices.push( point.x, point.y, point.z );
							normals.push( face.normal.x, face.normal.y, face.normal.z );

							edge = edge.next;

						} while ( edge !== face.edge );

					}

					// build geometry

					this.setAttribute( 'position', new Float32BufferAttribute( vertices, 3 ) );
					this.setAttribute( 'normal', new Float32BufferAttribute( normals, 3 ) );

				}

			}
			this.ConvexGeometry = ConvexGeometry;

			const //EventDispatcher = three.THREE.EventDispatcher,
				MOUSE = three.THREE.MOUSE,
				Quaternion = three.THREE.Quaternion,
				Spherical = three.THREE.Spherical,
				TOUCH = three.THREE.TOUCH;
	//			Vector2 = three.THREE.Vector2,
	//			Vector3 = three.THREE.Vector3;

			// This set of controls performs orbiting, dollying (zooming), and panning.
			// Unlike TrackballControls, it maintains the "up" direction object.up (+Y by default).
			//
			//    Orbit - left mouse / touch: one-finger move
			//    Zoom - middle mouse, or mousewheel / touch: two-finger spread or squish
			//    Pan - right mouse, or left mouse + ctrl/meta/shiftKey, or arrow keys / touch: two-finger move

			const _changeEvent = { type: 'change' };
			const _startEvent = { type: 'start' };
			const _endEvent = { type: 'end' };

			class OrbitControls extends EventDispatcher {

				constructor( object, domElement ) {

					super();

					if ( domElement === undefined ) console.warn( 'THREE.OrbitControls: The second parameter "domElement" is now mandatory.' );
					if ( domElement === document ) console.error( 'THREE.OrbitControls: "document" should not be used as the target "domElement". Please use "renderer.domElement" instead.' );

					this.object = object;
					this.domElement = domElement;
					this.domElement.style.touchAction = 'none'; // disable touch scroll

					// Set to false to disable this control
					this.enabled = true;

					// "target" sets the location of focus, where the object orbits around
					this.target = new Vector3();

					// How far you can dolly in and out ( PerspectiveCamera only )
					this.minDistance = 0;
					this.maxDistance = Infinity;

					// How far you can zoom in and out ( OrthographicCamera only )
					this.minZoom = 0;
					this.maxZoom = Infinity;

					// How far you can orbit vertically, upper and lower limits.
					// Range is 0 to Math.PI radians.
					this.minPolarAngle = 0; // radians
					this.maxPolarAngle = Math.PI; // radians

					// How far you can orbit horizontally, upper and lower limits.
					// If set, the interval [ min, max ] must be a sub-interval of [ - 2 PI, 2 PI ], with ( max - min < 2 PI )
					this.minAzimuthAngle = - Infinity; // radians
					this.maxAzimuthAngle = Infinity; // radians

					// Set to true to enable damping (inertia)
					// If damping is enabled, you must call controls.update() in your animation loop
					this.enableDamping = false;
					this.dampingFactor = 0.05;

					// This option actually enables dollying in and out; left as "zoom" for backwards compatibility.
					// Set to false to disable zooming
					this.enableZoom = true;
					this.zoomSpeed = 1.0;

					// Set to false to disable rotating
					this.enableRotate = true;
					this.rotateSpeed = 1.0;

					// Set to false to disable panning
					this.enablePan = true;
					this.panSpeed = 1.0;
					this.screenSpacePanning = true; // if false, pan orthogonal to world-space direction camera.up
					this.keyPanSpeed = 7.0;	// pixels moved per arrow key push

					// Set to true to automatically rotate around the target
					// If auto-rotate is enabled, you must call controls.update() in your animation loop
					this.autoRotate = false;
					this.autoRotateSpeed = 2.0; // 30 seconds per orbit when fps is 60

					// The four arrow keys
					this.keys = { LEFT: 'ArrowLeft', UP: 'ArrowUp', RIGHT: 'ArrowRight', BOTTOM: 'ArrowDown' };

					// Mouse buttons
					this.mouseButtons = { LEFT: MOUSE.ROTATE, MIDDLE: MOUSE.DOLLY, RIGHT: MOUSE.PAN };

					// Touch fingers
					this.touches = { ONE: TOUCH.ROTATE, TWO: TOUCH.DOLLY_PAN };

					// for reset
					this.target0 = this.target.clone();
					this.position0 = this.object.position.clone();
					this.zoom0 = this.object.zoom;

					// the target DOM element for key events
					this._domElementKeyEvents = null;

					//
					// public methods
					//

					this.getPolarAngle = function () {

						return spherical.phi;

					};

					this.getAzimuthalAngle = function () {

						return spherical.theta;

					};

					this.getDistance = function () {

						return this.object.position.distanceTo( this.target );

					};

					this.listenToKeyEvents = function ( domElement ) {

						domElement.addEventListener( 'keydown', onKeyDown );
						this._domElementKeyEvents = domElement;

					};

					this.saveState = function () {

						scope.target0.copy( scope.target );
						scope.position0.copy( scope.object.position );
						scope.zoom0 = scope.object.zoom;

					};

					this.reset = function () {

						scope.target.copy( scope.target0 );
						scope.object.position.copy( scope.position0 );
						scope.object.zoom = scope.zoom0;

						scope.object.updateProjectionMatrix();
						scope.dispatchEvent( _changeEvent );

						scope.update();

						state = STATE.NONE;

					};

					// this method is exposed, but perhaps it would be better if we can make it private...
					this.update = function () {

						const offset = new Vector3();

						// so camera.up is the orbit axis
						const quat = new Quaternion().setFromUnitVectors( object.up, new Vector3( 0, 1, 0 ) );
						const quatInverse = quat.clone().invert();

						const lastPosition = new Vector3();
						const lastQuaternion = new Quaternion();

						const twoPI = 2 * Math.PI;

						return function update() {

							const position = scope.object.position;

							offset.copy( position ).sub( scope.target );

							// rotate offset to "y-axis-is-up" space
							offset.applyQuaternion( quat );

							// angle from z-axis around y-axis
							spherical.setFromVector3( offset );

							if ( scope.autoRotate && state === STATE.NONE ) {

								rotateLeft( getAutoRotationAngle() );

							}

							if ( scope.enableDamping ) {

								spherical.theta += sphericalDelta.theta * scope.dampingFactor;
								spherical.phi += sphericalDelta.phi * scope.dampingFactor;

							} else {

								spherical.theta += sphericalDelta.theta;
								spherical.phi += sphericalDelta.phi;

							}

							// restrict theta to be between desired limits

							let min = scope.minAzimuthAngle;
							let max = scope.maxAzimuthAngle;

							if ( isFinite( min ) && isFinite( max ) ) {

								if ( min < - Math.PI ) min += twoPI; else if ( min > Math.PI ) min -= twoPI;

								if ( max < - Math.PI ) max += twoPI; else if ( max > Math.PI ) max -= twoPI;

								if ( min <= max ) {

									spherical.theta = Math.max( min, Math.min( max, spherical.theta ) );

								} else {

									spherical.theta = ( spherical.theta > ( min + max ) / 2 ) ?
										Math.max( min, spherical.theta ) :
										Math.min( max, spherical.theta );

								}

							}

							// restrict phi to be between desired limits
							spherical.phi = Math.max( scope.minPolarAngle, Math.min( scope.maxPolarAngle, spherical.phi ) );

							spherical.makeSafe();


							spherical.radius *= scale;

							// restrict radius to be between desired limits
							spherical.radius = Math.max( scope.minDistance, Math.min( scope.maxDistance, spherical.radius ) );

							// move target to panned location

							if ( scope.enableDamping === true ) {

								scope.target.addScaledVector( panOffset, scope.dampingFactor );

							} else {

								scope.target.add( panOffset );

							}

							offset.setFromSpherical( spherical );

							// rotate offset back to "camera-up-vector-is-up" space
							offset.applyQuaternion( quatInverse );

							position.copy( scope.target ).add( offset );

							scope.object.lookAt( scope.target );

							if ( scope.enableDamping === true ) {

								sphericalDelta.theta *= ( 1 - scope.dampingFactor );
								sphericalDelta.phi *= ( 1 - scope.dampingFactor );

								panOffset.multiplyScalar( 1 - scope.dampingFactor );

							} else {

								sphericalDelta.set( 0, 0, 0 );

								panOffset.set( 0, 0, 0 );

							}

							scale = 1;

							// update condition is:
							// min(camera displacement, camera rotation in radians)^2 > EPS
							// using small-angle approximation cos(x/2) = 1 - x^2 / 8

							if ( zoomChanged ||
								lastPosition.distanceToSquared( scope.object.position ) > EPS ||
								8 * ( 1 - lastQuaternion.dot( scope.object.quaternion ) ) > EPS ) {

								scope.dispatchEvent( _changeEvent );

								lastPosition.copy( scope.object.position );
								lastQuaternion.copy( scope.object.quaternion );
								zoomChanged = false;

								return true;

							}

							return false;

						};

					}();

					this.dispose = function () {

						scope.domElement.removeEventListener( 'contextmenu', onContextMenu );

						scope.domElement.removeEventListener( 'pointerdown', onPointerDown );
						scope.domElement.removeEventListener( 'pointercancel', onPointerCancel );
						scope.domElement.removeEventListener( 'wheel', onMouseWheel );

						scope.domElement.removeEventListener( 'pointermove', onPointerMove );
						scope.domElement.removeEventListener( 'pointerup', onPointerUp );


						if ( scope._domElementKeyEvents !== null ) {

							scope._domElementKeyEvents.removeEventListener( 'keydown', onKeyDown );

						}

						//scope.dispatchEvent( { type: 'dispose' } ); // should this be added here?

					};

					//
					// internals
					//

					const scope = this;

					const STATE = {
						NONE: - 1,
						ROTATE: 0,
						DOLLY: 1,
						PAN: 2,
						TOUCH_ROTATE: 3,
						TOUCH_PAN: 4,
						TOUCH_DOLLY_PAN: 5,
						TOUCH_DOLLY_ROTATE: 6
					};

					let state = STATE.NONE;

					const EPS = 0.000001;

					// current position in spherical coordinates
					const spherical = new Spherical();
					const sphericalDelta = new Spherical();

					let scale = 1;
					const panOffset = new Vector3();
					let zoomChanged = false;

					const rotateStart = new Vector2();
					const rotateEnd = new Vector2();
					const rotateDelta = new Vector2();

					const panStart = new Vector2();
					const panEnd = new Vector2();
					const panDelta = new Vector2();

					const dollyStart = new Vector2();
					const dollyEnd = new Vector2();
					const dollyDelta = new Vector2();

					const pointers = [];
					const pointerPositions = {};

					function getAutoRotationAngle() {

						return 2 * Math.PI / 60 / 60 * scope.autoRotateSpeed;

					}

					function getZoomScale() {

						return Math.pow( 0.95, scope.zoomSpeed );

					}

					function rotateLeft( angle ) {

						sphericalDelta.theta -= angle;

					}

					function rotateUp( angle ) {

						sphericalDelta.phi -= angle;

					}

					const panLeft = function () {

						const v = new Vector3();

						return function panLeft( distance, objectMatrix ) {

							v.setFromMatrixColumn( objectMatrix, 0 ); // get X column of objectMatrix
							v.multiplyScalar( - distance );

							panOffset.add( v );

						};

					}();

					const panUp = function () {

						const v = new Vector3();

						return function panUp( distance, objectMatrix ) {

							if ( scope.screenSpacePanning === true ) {

								v.setFromMatrixColumn( objectMatrix, 1 );

							} else {

								v.setFromMatrixColumn( objectMatrix, 0 );
								v.crossVectors( scope.object.up, v );

							}

							v.multiplyScalar( distance );

							panOffset.add( v );

						};

					}();

					// deltaX and deltaY are in pixels; right and down are positive
					const pan = function () {

						const offset = new Vector3();

						return function pan( deltaX, deltaY ) {

							const element = scope.domElement;

							if ( scope.object.isPerspectiveCamera ) {

								// perspective
								const position = scope.object.position;
								offset.copy( position ).sub( scope.target );
								let targetDistance = offset.length();

								// half of the fov is center to top of screen
								targetDistance *= Math.tan( ( scope.object.fov / 2 ) * Math.PI / 180.0 );

								// we use only clientHeight here so aspect ratio does not distort speed
								panLeft( 2 * deltaX * targetDistance / element.clientHeight, scope.object.matrix );
								panUp( 2 * deltaY * targetDistance / element.clientHeight, scope.object.matrix );

							} else if ( scope.object.isOrthographicCamera ) {

								// orthographic
								panLeft( deltaX * ( scope.object.right - scope.object.left ) / scope.object.zoom / element.clientWidth, scope.object.matrix );
								panUp( deltaY * ( scope.object.top - scope.object.bottom ) / scope.object.zoom / element.clientHeight, scope.object.matrix );

							} else {

								// camera neither orthographic nor perspective
								console.warn( 'WARNING: OrbitControls encountered an unknown camera type - pan disabled.' );
								scope.enablePan = false;

							}

						};

					}();

					function dollyOut( dollyScale ) {

						if ( scope.object.isPerspectiveCamera ) {

							scale /= dollyScale;

						} else if ( scope.object.isOrthographicCamera ) {

							scope.object.zoom = Math.max( scope.minZoom, Math.min( scope.maxZoom, scope.object.zoom * dollyScale ) );
							scope.object.updateProjectionMatrix();
							zoomChanged = true;

						} else {

							console.warn( 'WARNING: OrbitControls encountered an unknown camera type - dolly/zoom disabled.' );
							scope.enableZoom = false;

						}

					}

					function dollyIn( dollyScale ) {

						if ( scope.object.isPerspectiveCamera ) {

							scale *= dollyScale;

						} else if ( scope.object.isOrthographicCamera ) {

							scope.object.zoom = Math.max( scope.minZoom, Math.min( scope.maxZoom, scope.object.zoom / dollyScale ) );
							scope.object.updateProjectionMatrix();
							zoomChanged = true;

						} else {

							console.warn( 'WARNING: OrbitControls encountered an unknown camera type - dolly/zoom disabled.' );
							scope.enableZoom = false;

						}

					}

					//
					// event callbacks - update the object state
					//

					function handleMouseDownRotate( event ) {

						rotateStart.set( event.clientX, event.clientY );

					}

					function handleMouseDownDolly( event ) {

						dollyStart.set( event.clientX, event.clientY );

					}

					function handleMouseDownPan( event ) {

						panStart.set( event.clientX, event.clientY );

					}

					function handleMouseMoveRotate( event ) {

						rotateEnd.set( event.clientX, event.clientY );

						rotateDelta.subVectors( rotateEnd, rotateStart ).multiplyScalar( scope.rotateSpeed );

						const element = scope.domElement;

						rotateLeft( 2 * Math.PI * rotateDelta.x / element.clientHeight ); // yes, height

						rotateUp( 2 * Math.PI * rotateDelta.y / element.clientHeight );

						rotateStart.copy( rotateEnd );

						scope.update();

					}

					function handleMouseMoveDolly( event ) {

						dollyEnd.set( event.clientX, event.clientY );

						dollyDelta.subVectors( dollyEnd, dollyStart );

						if ( dollyDelta.y > 0 ) {

							dollyOut( getZoomScale() );

						} else if ( dollyDelta.y < 0 ) {

							dollyIn( getZoomScale() );

						}

						dollyStart.copy( dollyEnd );

						scope.update();

					}

					function handleMouseMovePan( event ) {

						panEnd.set( event.clientX, event.clientY );

						panDelta.subVectors( panEnd, panStart ).multiplyScalar( scope.panSpeed );

						pan( panDelta.x, panDelta.y );

						panStart.copy( panEnd );

						scope.update();

					}

					function handleMouseWheel( event ) {

						if ( event.deltaY < 0 ) {

							dollyIn( getZoomScale() );

						} else if ( event.deltaY > 0 ) {

							dollyOut( getZoomScale() );

						}

						scope.update();

					}

					function handleKeyDown( event ) {

						let needsUpdate = false;

						switch ( event.code ) {

							case scope.keys.UP:
								pan( 0, scope.keyPanSpeed );
								needsUpdate = true;
								break;

							case scope.keys.BOTTOM:
								pan( 0, - scope.keyPanSpeed );
								needsUpdate = true;
								break;

							case scope.keys.LEFT:
								pan( scope.keyPanSpeed, 0 );
								needsUpdate = true;
								break;

							case scope.keys.RIGHT:
								pan( - scope.keyPanSpeed, 0 );
								needsUpdate = true;
								break;

						}

						if ( needsUpdate ) {

							// prevent the browser from scrolling on cursor keys
							event.preventDefault();

							scope.update();

						}


					}

					function handleTouchStartRotate() {

						if ( pointers.length === 1 ) {

							rotateStart.set( pointers[0].pageX, pointers[0].pageY );

						} else {

							const x = 0.5 * ( pointers[0].pageX + pointers[1].pageX );
							const y = 0.5 * ( pointers[0].pageY + pointers[1].pageY );

							rotateStart.set( x, y );

						}

					}

					function handleTouchStartPan() {

						if ( pointers.length === 1 ) {

							panStart.set( pointers[0].pageX, pointers[0].pageY );

						} else {

							const x = 0.5 * ( pointers[0].pageX + pointers[1].pageX );
							const y = 0.5 * ( pointers[0].pageY + pointers[1].pageY );

							panStart.set( x, y );

						}

					}

					function handleTouchStartDolly() {

						const dx = pointers[0].pageX - pointers[1].pageX;
						const dy = pointers[0].pageY - pointers[1].pageY;

						const distance = Math.sqrt( dx * dx + dy * dy );

						dollyStart.set( 0, distance );

					}

					function handleTouchStartDollyPan() {

						if ( scope.enableZoom ) handleTouchStartDolly();

						if ( scope.enablePan ) handleTouchStartPan();

					}

					function handleTouchStartDollyRotate() {

						if ( scope.enableZoom ) handleTouchStartDolly();

						if ( scope.enableRotate ) handleTouchStartRotate();

					}

					function handleTouchMoveRotate( event ) {

						if ( pointers.length == 1 ) {

							rotateEnd.set( event.pageX, event.pageY );

						} else {

							const position = getSecondPointerPosition( event );

							const x = 0.5 * ( event.pageX + position.x );
							const y = 0.5 * ( event.pageY + position.y );

							rotateEnd.set( x, y );

						}

						rotateDelta.subVectors( rotateEnd, rotateStart ).multiplyScalar( scope.rotateSpeed );

						const element = scope.domElement;

						rotateLeft( 2 * Math.PI * rotateDelta.x / element.clientHeight ); // yes, height

						rotateUp( 2 * Math.PI * rotateDelta.y / element.clientHeight );

						rotateStart.copy( rotateEnd );

					}

					function handleTouchMovePan( event ) {

						if ( pointers.length === 1 ) {

							panEnd.set( event.pageX, event.pageY );

						} else {

							const position = getSecondPointerPosition( event );

							const x = 0.5 * ( event.pageX + position.x );
							const y = 0.5 * ( event.pageY + position.y );

							panEnd.set( x, y );

						}

						panDelta.subVectors( panEnd, panStart ).multiplyScalar( scope.panSpeed );

						pan( panDelta.x, panDelta.y );

						panStart.copy( panEnd );

					}

					function handleTouchMoveDolly( event ) {

						const position = getSecondPointerPosition( event );

						const dx = event.pageX - position.x;
						const dy = event.pageY - position.y;

						const distance = Math.sqrt( dx * dx + dy * dy );

						dollyEnd.set( 0, distance );

						dollyDelta.set( 0, Math.pow( dollyEnd.y / dollyStart.y, scope.zoomSpeed ) );

						dollyOut( dollyDelta.y );

						dollyStart.copy( dollyEnd );

					}

					function handleTouchMoveDollyPan( event ) {

						if ( scope.enableZoom ) handleTouchMoveDolly( event );

						if ( scope.enablePan ) handleTouchMovePan( event );

					}

					function handleTouchMoveDollyRotate( event ) {

						if ( scope.enableZoom ) handleTouchMoveDolly( event );

						if ( scope.enableRotate ) handleTouchMoveRotate( event );

					}

					//
					// event handlers - FSM: listen for events and reset state
					//

					function onPointerDown( event ) {

						if ( scope.enabled === false ) return;

						if ( pointers.length === 0 ) {

							scope.domElement.setPointerCapture( event.pointerId );

							scope.domElement.addEventListener( 'pointermove', onPointerMove );
							scope.domElement.addEventListener( 'pointerup', onPointerUp );

						}

						//

						addPointer( event );

						if ( event.pointerType === 'touch' ) {

							onTouchStart( event );

						} else {

							onMouseDown( event );

						}

					}

					function onPointerMove( event ) {

						if ( scope.enabled === false ) return;

						if ( event.pointerType === 'touch' ) {

							onTouchMove( event );

						} else {

							onMouseMove( event );

						}

					}

					function onPointerUp( event ) {

						if ( scope.enabled === false ) return;

						if ( event.pointerType === 'touch' ) {

							onTouchEnd();

						} else {

							onMouseUp();

						}

						removePointer( event );

						//

						if ( pointers.length === 0 ) {

							scope.domElement.releasePointerCapture( event.pointerId );

							scope.domElement.removeEventListener( 'pointermove', onPointerMove );
							scope.domElement.removeEventListener( 'pointerup', onPointerUp );

						}

					}

					function onPointerCancel( event ) {

						removePointer( event );

					}

					function onMouseDown( event ) {

						let mouseAction;

						switch ( event.button ) {

							case 0:

								mouseAction = scope.mouseButtons.LEFT;
								break;

							case 1:

								mouseAction = scope.mouseButtons.MIDDLE;
								break;

							case 2:

								mouseAction = scope.mouseButtons.RIGHT;
								break;

							default:

								mouseAction = - 1;

						}

						switch ( mouseAction ) {

							case MOUSE.DOLLY:

								if ( scope.enableZoom === false ) return;

								handleMouseDownDolly( event );

								state = STATE.DOLLY;

								break;

							case MOUSE.ROTATE:

								if ( event.ctrlKey || event.metaKey || event.shiftKey ) {

									if ( scope.enablePan === false ) return;

									handleMouseDownPan( event );

									state = STATE.PAN;

								} else {

									if ( scope.enableRotate === false ) return;

									handleMouseDownRotate( event );

									state = STATE.ROTATE;

								}

								break;

							case MOUSE.PAN:

								if ( event.ctrlKey || event.metaKey || event.shiftKey ) {

									if ( scope.enableRotate === false ) return;

									handleMouseDownRotate( event );

									state = STATE.ROTATE;

								} else {

									if ( scope.enablePan === false ) return;

									handleMouseDownPan( event );

									state = STATE.PAN;

								}

								break;

							default:

								state = STATE.NONE;

						}

						if ( state !== STATE.NONE ) {

							scope.dispatchEvent( _startEvent );

						}

					}

					function onMouseMove( event ) {

						if ( scope.enabled === false ) return;

						switch ( state ) {

							case STATE.ROTATE:

								if ( scope.enableRotate === false ) return;

								handleMouseMoveRotate( event );

								break;

							case STATE.DOLLY:

								if ( scope.enableZoom === false ) return;

								handleMouseMoveDolly( event );

								break;

							case STATE.PAN:

								if ( scope.enablePan === false ) return;

								handleMouseMovePan( event );

								break;

						}

					}

					function onMouseUp( event ) {

						scope.dispatchEvent( _endEvent );

						state = STATE.NONE;

					}

					function onMouseWheel( event ) {

						if ( scope.enabled === false || scope.enableZoom === false || ( state !== STATE.NONE && state !== STATE.ROTATE ) ) return;

						event.preventDefault();

						scope.dispatchEvent( _startEvent );

						handleMouseWheel( event );

						scope.dispatchEvent( _endEvent );

					}

					function onKeyDown( event ) {

						if ( scope.enabled === false || scope.enablePan === false ) return;

						handleKeyDown( event );

					}

					function onTouchStart( event ) {

						trackPointer( event );

						switch ( pointers.length ) {

							case 1:

								switch ( scope.touches.ONE ) {

									case TOUCH.ROTATE:

										if ( scope.enableRotate === false ) return;

										handleTouchStartRotate();

										state = STATE.TOUCH_ROTATE;

										break;

									case TOUCH.PAN:

										if ( scope.enablePan === false ) return;

										handleTouchStartPan();

										state = STATE.TOUCH_PAN;

										break;

									default:

										state = STATE.NONE;

								}

								break;

							case 2:

								switch ( scope.touches.TWO ) {

									case TOUCH.DOLLY_PAN:

										if ( scope.enableZoom === false && scope.enablePan === false ) return;

										handleTouchStartDollyPan();

										state = STATE.TOUCH_DOLLY_PAN;

										break;

									case TOUCH.DOLLY_ROTATE:

										if ( scope.enableZoom === false && scope.enableRotate === false ) return;

										handleTouchStartDollyRotate();

										state = STATE.TOUCH_DOLLY_ROTATE;

										break;

									default:

										state = STATE.NONE;

								}

								break;

							default:

								state = STATE.NONE;

						}

						if ( state !== STATE.NONE ) {

							scope.dispatchEvent( _startEvent );

						}

					}

					function onTouchMove( event ) {

						trackPointer( event );

						switch ( state ) {

							case STATE.TOUCH_ROTATE:

								if ( scope.enableRotate === false ) return;

								handleTouchMoveRotate( event );

								scope.update();

								break;

							case STATE.TOUCH_PAN:

								if ( scope.enablePan === false ) return;

								handleTouchMovePan( event );

								scope.update();

								break;

							case STATE.TOUCH_DOLLY_PAN:

								if ( scope.enableZoom === false && scope.enablePan === false ) return;

								handleTouchMoveDollyPan( event );

								scope.update();

								break;

							case STATE.TOUCH_DOLLY_ROTATE:

								if ( scope.enableZoom === false && scope.enableRotate === false ) return;

								handleTouchMoveDollyRotate( event );

								scope.update();

								break;

							default:

								state = STATE.NONE;

						}

					}

					function onTouchEnd( event ) {

						scope.dispatchEvent( _endEvent );

						state = STATE.NONE;

					}

					function onContextMenu( event ) {

						if ( scope.enabled === false ) return;

						event.preventDefault();

					}

					function addPointer( event ) {

						pointers.push( event );

					}

					function removePointer( event ) {

						delete pointerPositions[event.pointerId];

						for ( let i = 0; i < pointers.length; i++ ) {

							if ( pointers[i].pointerId == event.pointerId ) {

								pointers.splice( i, 1 );
								return;

							}

						}

					}

					function trackPointer( event ) {

						let position = pointerPositions[event.pointerId];

						if ( position === undefined ) {

							position = new Vector2();
							pointerPositions[event.pointerId] = position;

						}

						position.set( event.pageX, event.pageY );

					}

					function getSecondPointerPosition( event ) {

						const pointer = ( event.pointerId === pointers[0].pointerId ) ? pointers[1] : pointers[0];

						return pointerPositions[pointer.pointerId];

					}

					//

					scope.domElement.addEventListener( 'contextmenu', onContextMenu );

					scope.domElement.addEventListener( 'pointerdown', onPointerDown );
					scope.domElement.addEventListener( 'pointercancel', onPointerCancel );
					scope.domElement.addEventListener( 'wheel', onMouseWheel, { passive: false } );

					// force an update at start

					this.update();

				}

			}
			this.OrbitControls = OrbitControls;

	/*
			// This set of controls performs orbiting, dollying (zooming), and panning.
			// Unlike TrackballControls, it maintains the "up" direction object.up (+Y by default).
			// This is very similar to OrbitControls, another set of touch behavior
			//
			//    Orbit - right mouse, or left mouse + ctrl/meta/shiftKey / touch: two-finger rotate
			//    Zoom - middle mouse, or mousewheel / touch: two-finger spread or squish
			//    Pan - left mouse, or arrow keys / touch: one-finger move
		
			class MapControls extends OrbitControls {
		
				constructor( object, domElement ) {
		
					super( object, domElement );
		
					this.screenSpacePanning = false; // pan orthogonal to world-space direction camera.up
		
					this.mouseButtons.LEFT = MOUSE.PAN;
					this.mouseButtons.RIGHT = MOUSE.ROTATE;
		
					this.touches.ONE = TOUCH.PAN;
					this.touches.TWO = TOUCH.DOLLY_ROTATE;
		
				}
		
			}
	*/

		}
		/**
		 * get [THREE]{@link https://github.com/anhr/three.js}
		 */
		get THREE() {

			if ( _THREE === undefined )
				console.error( 'three: invalid _THREE = ' + _THREE + '. Call three.THREE = THREE first.' );
			return _THREE;

		}
		/**
		 * set [dat]{@link https://github.com/dataarts/dat.gui}
		 */
		set dat( dat ) {

			if ( _dat ) {

				if ( !Object.is( dat, _dat ) )
					console.error( 'three: duplicate dat. Please use one instance of the dat library.' );
				return;

			}
			_dat = dat;

		}
		/**
		 * get [dat]{@link https://github.com/dataarts/dat.gui}
		 */
		get dat() {

	/*Неверно срабатывает когда dat не импортирован
			if ( _dat === undefined && !boSetDat )
				console.error( 'three: invalid _dat = ' + _dat + '. Call three.dat = dat first.' );
	*/			
			return _dat;

		}

	}

	var three;
	window.__myThree__ = window.__myThree__ || {};
	if ( window.__myThree__.three ) {

		//сюда попадает если использовать './commonNodeJS/master/player/build/player.module.js'
		three = window.__myThree__.three;

	} else {

		three = new Three();
		three.isThree = function(){ return _THREE; };
		window.__myThree__.three = three;

	}

	var three$1 = three;

	/**
	 * node.js version of the synchronous download of the file.
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

	//The myRequest is cross-browser XMLHttpRequest wrapper.
	function myRequest( options ) {

		this.loadXMLDoc = function () {
			var req;

			if ( window.XMLHttpRequest ) {
				req = new XMLHttpRequest();
				if ( !req )
					throw "new XMLHttpRequest() failed!"
			}
			else if ( window.ActiveXObject ) {
				req = this.NewActiveXObject();
				if ( !req )
					throw "NewActiveXObject() failed!"
			}
			else throw "myRequest.loadXMLDoc(...) failed!";
			return req;
		};

		this.NewActiveXObject = function () {
			try { return new ActiveXObject( "Msxml2.XMLHTTP.6.0" ); }
			catch ( e ) { }
			try { return new ActiveXObject( "Msxml2.XMLHTTP.3.0" ); }
			catch ( e ) { }
			try { return new ActiveXObject( "Msxml2.XMLHTTP" ); }
			catch ( e ) { }
			try { return new ActiveXObject( "Microsoft.XMLHTTP" ); }
			catch ( e ) { }
			ErrorMessage( 'This browser does not support XMLHttpRequest. Probably, your security settings do not allow Web sites to use ActiveX controls installed on your computer. Refresh your Web page to find out the current status of your Web page or enable the "Initialize and script ActiveX controls not marked as safe" and "Run Active X controls and plug-ins" of the Security settings of the Internet zone of your browser.' );
			return null;
		};

		this.XMLHttpRequestStart = function ( onreadystatechange, async ) {

			this.XMLHttpRequestStop();//For compatibility with IE Windows Phone

			this.req.onreadystatechange = onreadystatechange;

			//ATTENTION!!! do not works in IE
			if ( "onerror" in this.req ) {
				this.req.onerror = function ( event ) {
					ErrorMessage( "XMLHttpRequest error. url: " + this.url);
				};
			}

			this.XMLHttpRequestReStart( async );
		};

		this.getUrl = function () {
			
			if ( ( typeof this.url == 'undefined' ) || ( this.url == null ) ) {

				//непонятно зачем это засунул
	//			this.url = "XMLHttpRequest.xml";
				
				ErrorMessage( 'XMLHttpRequest: Invalid url: ' + this.url );
				
			}
			return this.url + ( this.params ? this.params : "" );
			
		};

		this.XMLHttpRequestReStart = function ( async ) {
			try {
				if ( typeof async == 'undefined' )
					async = true;
				this.req.open( "GET", this.getUrl(), async );
				if ( async ) {
					var timeout = ( 60 + 30 ) * 1000;//Внимание!!! Задержка должна быть больше CSocketWaitEvent::WaitResponse
					if ( "timeout" in this.req )//for IE6
						this.req.timeout = timeout;
					if ( "ontimeout" in this.req )
						this.req.ontimeout = function () {
							ErrorMessage( 'XMLHttpRequest timeout', false, false );
						};
					else {//for Safari, IE6
						clearTimeout( this.timeout_id_SendReq );
						this.timeout_id_SendReq = setTimeout( function () {
							ErrorMessage( 'XMLHttpRequest timeout 2', false, false );
						}
							, timeout );
						//console.log("setTimeout this.req.timeout_id_SendReq = " + this.req.timeout_id_SendReq);
					}
				}
				this.req.send( null );
			} catch ( e ) {
				ErrorMessage( e.message + " url: " + this.url);
			}
		};

		this.XMLHttpRequestStop = function () {
			//console.log("XMLHttpRequestStop(...)");
			if ( this.req == null )
				return;
			this.req.abort();
		};

		this.ProcessReqChange = function ( processStatus200 ) {
			var req = this.req;
			if ( ( typeof isIE === 'undefined' ) || !isIE ) ;
			// only if req shows "complete"
			//http://www.w3schools.com/ajax/ajax_xmlhttprequest_onreadystatechange.asp
			//http://xmlhttprequest.ru/w3c
			switch ( req.readyState ) {
				case 4://request finished and response is ready
					{
						if ( typeof req.status == "unknown" ) {//IE5 timeout
							consoleError( 'typeof XMLHttpRequest status == "unknown"' );
							return true;
						}
						//Я не могу вставлять switch один в другой
						if ( req.status == 200 )//OK)
						{
							clearTimeout( this.timeout_id_SendReq );
							return processStatus200( this );
						}//200://OK
						else {
							ErrorMessage( "Invalid XMLHttpRequest status : " + req.status + " url: " + this.url );
						}
					}
					break;
				case 1://server connection established
				case 2://request received
				case 3://processing request
					break;
				//		case 404:
				case 0://request not initialized
				default:
					throw "processReqChange(); req.readyState = " + req.readyState;
			}//switch(req.readyState)
			return true;
		};

		this.processStatus200Error = function () {
			var error = this.GetElementText( 'error', true );
			if ( error ) {
				ErrorMessage( error );
				return true;
			}
			return false;
		};

		this.GetElementText = function ( tagName, noDisplayErrorMessage ) {
			var xmlhttp = this.req;
			if ( !xmlhttp.responseXML ) {
				if ( noDisplayErrorMessage != true )
					ErrorMessage( 'GetXMLElementText(xmlhttp, ' + tagName + '); xmlhttp.responseXML is null.\nxmlhttp.responseText:\n' + xmlhttp.responseText );
				return null;
			}
			var element = xmlhttp.responseXML.getElementsByTagName( tagName );

			//ATTENTION!!! For IE set the content-type m_HttpResponse.SetContentType("text/xml");

			if ( element.length == 0 ) {
				if ( noDisplayErrorMessage != true )
					ErrorMessage( 'GetXMLElementText(xmlhttp, "' + tagName + '"); element.length == ' + element.length );
				return "";
			}
			var text = "";
			for ( var i = 0; i < element.length; i++ ) {
				if ( typeof ( element[i].textContent ) == 'undefined' ) {
					if ( typeof ( element[i].text ) == 'undefined' ) {
						ErrorMessage( 'GetXMLElementText(xmlhttp, ' + tagName + '); element[' + i + '].text) == undefined' );
						return '';
					}
					if ( text != "" )
						text += " ";
					text += element[i].text;//IE
				}
				else text += element[i].textContent;//Chrome
			}
			return text;
		};

		if ( options.data ) {
			this.req = options.data.req;
			this.url = options.data.url;
			this.params = options.data.params;
		} else {
			try {
				this.req = this.loadXMLDoc();
			} catch ( e ) {
				var message;
				if ( typeof e.message == 'undefined' )
					message = e;
				else message = e.message;
				ErrorMessage( "Your browser is too old and is not compatible with our site.\n\n"
					+ window.navigator.appName + " " + window.navigator.appVersion + "\n\n" + message );
				return;
			}
		}
		if ( !this.req ) {
			consoleError( "Invalid myRequest.req: " + this.req );
			return;
		}

		function ErrorMessage( error ) {

			console.error( error );
			options.onerror( error );

		}

	}

	/**
	 * @callback onerror
	 * @param {string} str - error details
	 */

	/**
	 * Load file synchronously
	 * @param {string} url URL of an external file.
	 * @param {Object} [options] the following options are available.
	 * @param {Function} [options.onload] function () The onload event occurs when a script has been loaded.
	 * @param {onerror} [options.onerror] function ( str ) The onerror event occurs when an error has been occured.
	 * @param {boolean} [options.async=false] true - load file asynchronously. You can use <b>async</b> method instead.
	 * @returns {string} file content
	 * @example
	 * 
		//Simplest example.
		document.getElementById( "elID" ).innerHTML = loadFile.sync('element.html');
	 *
	 * @example
	 *
		//onload, onerror events.
		document.getElementById( "elID").innerHTML = loadFile.sync( 'element.html',
		{
			onload: function ( response ) {

				var str = 'file has been loaded successfully';
				console.log( str );

			},
			onerror: function ( str, e ) {

				console.error( str );

			},
		}, );
	 */
	function sync$1( url, options ) {

		options = options || {};
		if (options.async === true) console.warn('Load file asynchronously is deprecated. Please use fetch.');
		options.onload = options.onload || function () { };
		options.onerror = options.onerror || function () { };

		var response,
			request = new myRequest( options );
		request.url = url;
		request.XMLHttpRequestStart(

			function () {//onreadystatechange

				request.ProcessReqChange( function ( myRequest ) {//processStatus200

					if ( myRequest.processStatus200Error() )
						return;
					response = myRequest.req.responseText;
					//console.log( 'loadFile.sync.onload() ' + url );
					options.onload( response, url );
					return;

				} );

			}
			, options.async === undefined ? false : true//Synchronous mode

		);
		//console.log( 'sync(' + url + ')' );
		return response;

	}

	/**
	 * node.js version of the load JavaScript file
	 * @author [Andrej Hristoliubov]{@link https://github.com/anhr}
	 *
	 * Thanks to:
	 *http://javascript.ru/forum/events/21439-dinamicheskaya-zagruzka-skriptov.html
	 *https://learn.javascript.ru/onload-onerror
	 *
	 * @copyright 2011 Data Arts Team, Google Creative Lab
	 *
	 * @license under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 */

	/**
	 * @callback onerror
	 * @param {string} str - error details
	 */

	/**
	 * Synchronous load JavaScript file
	 * @param {string} src URL of an external script file.
	 * @param {Object} [options] the following options are available.
	 * @param {Function} [options.onload] function () The onload event occurs when a script has been loaded. Optional.
	 * @param {onerror} [options.onerror] function ( str ) The onerror event occurs when an error has been occured. Optional.
	 * @param {string}[options.appendTo] The node to which the new script will be append. Optional. Default is head node
	 * @param {Object|string}[options.tag] The script's tag attributes (Object) or tag type (string). Optional.
	 * Available tag types:
	 *	'style' - load a style file (.css extension)
	 * @param {string} [options.tag.name] tag name. Default is 'script'
	 * @param {Object} [options.tag.attribute] tag attribute. Optional.
	 * @param {string} options.tag.attribute.name attribute name. Default is 'type'
	 * @param {string} options.tag.attribute.value attribute value. Default is 'text/javascript'
	 *
	 * @example
	 * 
		//Simplest example. Append script into head node.
		loadScript.sync( 'sync.js' );

	 * @example
	 * 
		//onload, onerror events. Append script into "appendto" element
		loadScript.sync( 'sync.js',
			{
				onload: function ( response ) {

					var str = 'file has been loaded successfully';
					console.log( str );

				},
				onerror: function ( str, e ) {

					elSync2Res.style.color = 'red';

				},
				appendTo: document.getElementById( "appendto" ),
			},
		);
	 *
	 * @example
	 *
		//Append style into head node.
		loadScript.sync( "controls.css",
		{
			//style rel="stylesheet"
			tag: {

				name: 'style',
				attribute: {

					name: 'rel',
					value: 'stylesheet',

				}

			}

		} );

	 */
	function sync( src, options ) {

		options = options || {};
		options.onload = options.onload || function () { };
		options.onerror = options.onerror || function () { };
		options.appendTo = options.appendTo || document.getElementsByTagName( 'head' )[0];

		if ( isScriptExists( options.appendTo, src ) ) {

			options.onload();
			return;

		}

		if ( src instanceof Array ) {

			var error,
				optionsItem = {

					appendTo: options.appendTo,
					tag: options.tag,
					onload: function ( response, url ) {
					
						console.log( 'loadScript.sync.onload: ' + url );
					
					},
					onerror: function ( str ) {

						options.onerror( str );
						error = str;

					},

				};
			for ( var i = 0; i < src.length; i++ ) {

				var item = src[ i ];
				loadScriptBase( function ( script ) {

					script.setAttribute( "id", item );
					script.innerHTML = sync$1( item, optionsItem );

				}, optionsItem );
				if ( error !== undefined )
					break;

			}		if ( error === undefined )
				options.onload();

		} else loadScriptBase( function ( script ) {

			script.setAttribute( "id", src );
			script.innerHTML = sync$1( src, options );

		}, options );

	}

	/**
	 * @callback onerrorasync
	 * @param {string} str - error details
	 * @param {Object} e - event
	 */

	/**
	 * Asynchronous load JavaScript file
	 * @param {string|string[]} src URL of an external script file or array of the script file names.
	 * @param {Object} [options] the following options are available.
	 * @param {Function} [options.onload] function () The onload event occurs when a script has been loaded. Optional.
	 * @param {onerrorasync} [options.onerror] function ( str, e ) The onerror event occurs when an error has been occured. Optional.
	 * @param {string}[options.appendTo] The node to which the new script will be append. Optional. Default is head node
	 * @param {Object}[options.tag] The script's tag attributes. Optional.
	 * @param {string} options.tag.name tag name. Default is 'script'
	 * @param {Object} [options.tag.attribute] tag attribute. Optional.
	 * @param {string} options.tag.attribute.name attribute name. Default is 'type'
	 * @param {string} options.tag.attribute.value attribute value. Default is 'text/javascript'
	*
	 * @example
	 * 
		//Simplest example. Append script into head node.
		loadScript.async( "JavaScript.js);
	 * 
	 * @example
	 *
		//onload, onerror events. Append script into "appendto" element
		loadScript.async( "JavaScript.js",
		{
	 		onload: function () {
	 
	 			var str = 'file has been loaded successfully';
	 			console.log( str );
	 
	 		},
	 		onerror: function ( str, e ) {
	 
	 			console.error( str );
	 
	 		},
	 		appendTo: document.getElementById( "appendto" ),
	 
	 	}
	 
	  );
	 *
	 * @example
	 *
		//loading of array of JavaScript files. Append script into head node.
		loadScript.async( [
	 		"JavaScript1.js",
	 		"JavaScript2.js",
	 	],
	 	{
	 		onload: function () {
	 
	 			var str = 'file has been loaded successfully';
	 			console.log( str );
	 
	 		},
	 		onerror: function ( str, e ) {
	 
	 			console.error( str );
	 
	 		},
	 
	 	}
	 
	  );
	 */
	function async( src, options ) {

		options = options || {};
		options.appendTo = options.appendTo || document.getElementsByTagName( 'head' )[ 0 ];
		options.onload = options.onload || function () {};

		var isrc;

		function async( srcAsync ) {

			function next() {

				if ( src instanceof Array && ( isrc < ( src.length - 1 ) ) ) {

					isrc++;
					async( src[isrc] );

				} else options.onload();

			}

			if ( isScriptExists( options.appendTo, srcAsync, options.onload ) ) {

				next();
				return;

			}

			loadScriptBase( function ( script ) {

				script.setAttribute( "id", srcAsync );

				function _onload() {

					console.log( 'loadScript.async.onload() ' + srcAsync );
					if ( options.onload !== undefined ) {

						next();

					}

				}

				if ( script.readyState && ! script.onload ) {

					// IE, Opera
					script.onreadystatechange = function () {

						if ( script.readyState == "complete" ) {

							if ( options.onload !== undefined ) options.onload();

						}

						if ( script.readyState == "loaded" ) {

							setTimeout( options.onload, 0 );

							this.onreadystatechange = null;

						}

					};

				} else {

					// Rest
					script.onload = _onload;

					script.onerror = function ( e ) {

						var str = 'loadScript: "' + this.src + '" failed';
						if ( options.onerror !== undefined )
							options.onerror( str, e );
						console.error( str );

					};

				}

				script.src = srcAsync;

			}, options );

		}

		if ( src instanceof Array ) {

			isrc = 0;
			async( src[ isrc ] );

		} else async( src );

	}

	function loadScriptBase( callback, options ) {

		options.tag = options.tag || {};
		if ( typeof options.tag === "string" ) {

			switch ( options.tag ) {

				case 'style':
					options.tag = {

						name: 'style',
						attribute: {

							name: 'rel',
							value: 'stylesheet',

						}

					};
					break;
				default: console.error( 'Invalid options.tag: ' + options.tag );
					return;
			}

		}

		options.tag.name = options.tag.name || 'script';
		var script = document.createElement( options.tag.name );

		options.tag.attribute = options.tag.attribute || {};
		options.tag.attribute.name = options.tag.attribute.name || "type";
		options.tag.attribute.value = options.tag.attribute.value || 'text/javascript';
		script.setAttribute( options.tag.attribute.name, options.tag.attribute.value );

		callback( script );
		options.appendTo.appendChild( script );

	}

	function isScriptExists( elParent, srcAsync, onload ) {

		var scripts = elParent.querySelectorAll( 'script' );
		for ( var i = 0; i < scripts.length; i++ ) {

			var child = scripts[i];
			if ( child.id === srcAsync ) {

				return true;

			}

		}
		return false;

	}

	/**
	 * node.js version of download of the scripts.
	 * 
	 * @author [Andrej Hristoliubov]{@link https://github.com/anhr}
	 *
	 * Copyright 2011 Data Arts Team, Google Creative Lab
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 */

	var loadScript = {

		sync: sync,
		async: async,

	};

	/**
	 * @module ColorPicker
	 * @description Pure JavaScript color picker.
	 * @author [Andrej Hristoliubov]{@link https://github.com/anhr}
	 *
	 * Thanks to https://github.com/DavidDurman/FlexiColorPicker
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

	const optionsStyle = {

		tag: 'style'

	};

	//Thanks to https://stackoverflow.com/a/27369985/5175935
	//Такая же функция есть в frustumPoints.js но если ее использовать то она будет возвращать путь на frustumPoints.js
	const getCurrentScript = function () {

		if ( document.currentScript && ( document.currentScript.src !== '' ) )
			return document.currentScript.src;
		const scripts = document.getElementsByTagName( 'script' ),
			str = scripts[scripts.length - 1].src;
		if ( str !== '' )
			return src;
		//Thanks to https://stackoverflow.com/a/42594856/5175935
		return new Error().stack.match( /(https?:[^:]*)/ )[0];

	};
	//Thanks to https://stackoverflow.com/a/27369985/5175935
	const getCurrentScriptPath = function () {
		const script = getCurrentScript(),
			path = script.substring( 0, script.lastIndexOf( '/' ) );
		return path;
	};
	const currentScriptPath = getCurrentScriptPath();

	loadScript.sync( currentScriptPath + '/colorpicker.css', optionsStyle );

	const type = ( window.SVGAngle || document.implementation.hasFeature( "http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1" ) ? "SVG" : "VML" ),
		svgNS = 'http://www.w3.org/2000/svg';
	var uniqID = 0;

	class ColorPicker {

		/**Pure JavaScript color picker.
		 * @class
		 * @see [FlexiColorPicker]{@link https://github.com/DavidDurman/FlexiColorPicker}
		 * */
		constructor() {

			const _this = this;
			/**
			 * enumeration of available palettes.
			 * @readonly
			 * @enum {number}
			 */
			this.paletteIndexes = {

				/** <a href="../Example/index.html#BGYW" target="_blank">blue, green, yellow, white</a> palette. This is the default palette*/
				BGYW: 0,
				/** <a href="../Example/index.html#Monochrome" target="_blank">monochrome</a> palette */
				monochrome: 1,
				/** <a href="../Example/index.html#Bidirectional" target="_blank">red, black, green</a> palette */
				bidirectional: 2,//
				/** <a href="../Example/index.html#rainbow" target="_blank">rainbow</a> palette */
				rainbow: 3,

			};

			function CreateSVGElement( el, attrs, children ) {

				el = document.createElementNS( svgNS, el );
				for ( var key in attrs )
					el.setAttribute( key, attrs[key] );
				if ( Object.prototype.toString.call( children ) != '[object Array]' ) children = [children];
				var i = 0, len = ( children[0] && children.length ) || 0;
				for ( ; i < len; i++ )
					el.appendChild( children[i] );
				return el;
			}

	//		var boCreated = false;
			/**
			 * @callback callback
			 * @description Called whenever the color is changed provided chosen color in RGB HEX format. See options.sliderIndicator.callback param of the create method.
			 * @param {object} c color
			 * @param {string} c.hex A hexadecimal color is specified with: #RRGGBB, where the RR (red), GG (green) and BB (blue)
			 * <pre>
			 * hexadecimal integers specify the components of the color. All values must be between 00 and FF.
			 * Example #00ff00
			 * </pre>
			 * @param {number} c.r red of RGB color value. Must be between 0 and 255.
			 * @param {number} c.g green of RGB color value. Must be between 0 and 255.
			 * @param {number} c.b blue of RGB color value. Must be between 0 and 255.
			 * @param {number} percent position of the mouse pointer in the percents. See details in options.direction param
			 */

			/**
			 * @callback onError
			 * @param {string} message error message
			 */

			/**
			 * creates an instance of ColorPicker
			 * @param {string|HTMLElement} elSliderWrapper id of the ColorPicker element or ColorPicker element
			 * @param {object} [options] followed options is availablee
			 * @param {paletteIndexes|object[]|Palette} [options.palette] Palette index or palette array or Palette. The following indexes are available:
			 * <pre>
			 * <a href="../Example/index.html#BGYW" target="_blank">ColorPicker.paletteIndexes.BGYW</a>: 0 - blue, green, yellow, white palette.
			 * <a href="../Example/index.html#Monochrome" target="_blank">ColorPicker.paletteIndexes.monochrome</a>: 1,
			 * <a href="../Example/index.html#Bidirectional" target="_blank">ColorPicker.paletteIndexes.bidirectional</a>: 2,//red, black, green
			 * <a href="../Example/index.html#rainbow" target="_blank">ColorPicker.paletteIndexes.rainbow</a>: 3,
			 * Default is paletteIndexes.BGYW index.
			 * Example of palette array:
			[
				{ percent: 0, r: 0, g: 0, b: 0, },
				{ percent: 10, r: 0xff, g: 255, b: 0xff, },
				{ percent: 100, r: 0xff, g: 255, b: 0xff, },
			]
			 * Palette see function Palette( options ) for details
			 * </pre>
			 * @param {object} [options.orientation] orientation of the element. Available "horizontal" or "vertical" orientation
			 * @param {object} [options.direction] true - position of the mouse pointer relative left side for 'horizontal' slider
			 * or bottom side for 'vertical' slider in the percents.
			 * <p>
			 * false - position of the mouse pointer relative right side for 'horizontal' slider
			 * or relative top side for 'vertical' slider in the percents.
			 * </p>
			 * Default is true.
			 * @param {object} [options.style] style statements
			 * @param {object} [options.style.width] width of the element. Default is 200px for options.orientation = "horizontal"
			 * and 30px for options.orientation = "vertical".
			 * @param {object} [options.style.height] height of the element. Default is 30px for options.orientation = "horizontal"
			 * and 200px for options.orientation = "vertical".
			 * @param {string} [options.style.border] elSliderWrapper border. Example: '1px solid black'
			 * @param {object} [options.sliderIndicator] adds a slider-indicator element for choose by mouse a color from palette.
			 * Default is undefuned
			 * @param {callback} [options.sliderIndicator.callback] Called whenever the color is changed provided chosen color in RGB HEX format.
			 * @param {number} [options.sliderIndicator.value] Initial position of the slider indicator in percent. Default is 0.
			 * @param {onError} [options.onError] Called whenever an error has occurred.
			 * @param {boolean} [options.duplicate] true - allow to create two or more palettes on your web page.
			 */
			this.create = function( elSliderWrapper, options ) {

				options = options || {};
				options.orientation = options.orientation || 'horizontal';

				function isHorizontal() { return options.orientation === "horizontal"; }

				if ( options.direction === undefined )
					options.direction = true;
				options.style = options.style || {};
				//		options.style.width = options.style.width || ( isHorizontal() ? '200px' : '30px' );
				options.style.width = options.style.width || ( isHorizontal() ? 200 : 30 );
				options.style.height = options.style.height || ( isHorizontal() ? 30 : 200 );

				options.onError = options.onError || function () { };

				if ( elSliderWrapper instanceof HTMLElement !== true ) {

					if ( typeof elSliderWrapper !== "string" ) {

						console.error( 'ColorPicker.create: invalid elSliderWrapper = ' + elSliderWrapper );
						return;

					}
					elSliderWrapper = document.getElementById( elSliderWrapper );
					if ( elSliderWrapper === null ) {

						console.error( 'ColorPicker.create: invalid elSliderWrapper = ' + elSliderWrapper );
						return;

					}

				}
				elSliderWrapper.classList.add( 'slider-wrapper' );
				for ( var style in options.style ) {

					elSliderWrapper.style[style] = options.style[style];

				}

				const palette = options.palette instanceof this.palette ? options.palette : new this.palette( options );
				var slide;
				function getSlideHeight() {

					if ( typeof options.style.height === "string" )
						return parseInt( options.style.height );
					return options.style.height;

				}
				function getSlideWidth() { return slide.clientWidth; }
				/**
				 * sets color from palette
				 * @param {number} value coordinate of color from palette in percent
				 * @param {number} position coordinate of color from palette
				 */
				function setValue( value, position ) {

					if ( slideIndicator === undefined ) {

						console.error( 'Set value of this instance of the ColorPicker is impossible because options.sliderIndicator is not defined.' );
						return;

					}
					const c = palette.hsv2rgb( value );
					if ( c === undefined ) {

						console.error( 'ColorPicker.setValue: invalud c = ' + c );
						return;

					}

					value = c.percent;
					if ( position === undefined )
						position = isHorizontal() ?
							( getSlideWidth() * value ) / 100 :
							getSlideHeight() - ( getSlideHeight() * ( options.direction ? value : 100 - value ) ) / 100;
					positionIndicators( position );
					if ( options.sliderIndicator.callback !== undefined ) {

						//console.warn( 'callback: ' + c.percent + ' percent c.hex = ' + c.hex );
						options.sliderIndicator.callback( c );

					}

				}

				var slideIndicator;
				if ( options.sliderIndicator !== undefined ) {

					slideIndicator = document.createElement( 'div' );
					slideIndicator.className = 'slider-indicator';
					if ( isHorizontal() )
						slideIndicator.style.width = '10px';
					else slideIndicator.style.height = '10px';
					elSliderWrapper.appendChild( slideIndicator );
					slideIndicator.style.pointerEvents = 'none';

				}

				/**
				 * Helper to position indicators.
				 * @param {number} position Coordinates of the mouse cursor in the slide area.
				 */
				function positionIndicators( position ) {

					if ( slideIndicator === undefined )
						return;

					if ( isHorizontal() ) {

						if ( ( position < 0 ) || ( position > getSlideWidth() ) ) {

							console.error( 'ColorPicker.positionIndicators: Invalid position = ' + position );
							return;

						}
						slideIndicator.style.top = '0px';
						slideIndicator.style.left = ( ( options.direction ? position : getSlideWidth() - position ) - slideIndicator.offsetWidth / 2 ) + 'px';

					} else {

						if ( ( position < 0 ) || ( position > getSlideHeight() ) ) {

							console.error( 'ColorPicker.positionIndicators: Invalid position = ' + position );
							return;

						}
						slideIndicator.style.left = '0px';
						slideIndicator.style.top = ( position - slideIndicator.offsetHeight / 2 ) + 'px';

					}

				}
				if ( type == 'SVG' ) {

					try {

						const linearGradient = 'linearGradient';
						slide = CreateSVGElement( 'svg', {
	//						xmlns: 'http://www.w3.org/2000/svg',
							xmlns: svgNS,
							version: '1.1',
							width: isHorizontal() ? '100%' : options.style.width,
							height: options.style.height,
						},
							[
								CreateSVGElement( 'defs', {},
									CreateSVGElement( linearGradient, {

										id: 'gradient-hsv-' + uniqID,
										x1: isHorizontal() && options.direction ? '100%' : '0%',
										y1: !isHorizontal() && !options.direction ? '100%' : '0%',
										x2: isHorizontal() && !options.direction ? '100%' : '0%',
										y2: !isHorizontal() && options.direction ? '100%' : '0%',

									},
										palette.getPalette()
									)
								),
								CreateSVGElement( 'rect', { x: '0', y: '0', width: '100%', height: '100%', fill: 'url(#gradient-hsv-' + uniqID + ')' } )
							]
						);
						if ( slideIndicator !== undefined ) {

							slide.style.cursor = isHorizontal() ? 'e-resize' : 's-resize';
							slideIndicator.style.cursor = slide.style.cursor;

						}
					} catch ( e ) {

						//I can not get 
						// slide.querySelector( linearGradient );
						//in Safari 5.1.7 browser for Windows
						//Instead I see the error message:
						// 'null' is not an object( evaluating 'hsvGradient.id = 'gradient - hsv - ' + uniqID' )
						console.error( 'Create SVG element failed! ' + e.message );

					}

					elSliderWrapper.appendChild( slide );
					elSliderWrapper.style.height = getSlideHeight() + 'px';

					if ( slideIndicator !== undefined ) {

						if ( isHorizontal() )
							slideIndicator.style.height = ( parseInt( options.style.height ) - 2 ) + 'px';
						else slideIndicator.style.width = ( parseInt( options.style.width ) - 2 ) + 'px';

						options.sliderIndicator.value = options.sliderIndicator.value || 0;
						setValue( options.sliderIndicator.value );

					}
					uniqID++;

				} else {

					console.error( 'Under constraction' );

				}

				function mouseMove( mouse ) {

					//for IE
					mouse.x = parseInt( mouse.x );
					mouse.y = parseInt( mouse.y );

					var position, size, value;
					if ( isHorizontal() ) {

						position = mouse.x;
						size = getSlideWidth() - 1;

						if ( position >= getSlideWidth() )
							position = size;
						value = ( position * 100 ) / size;
						if ( !options.direction ) {

							value = 100 - value;
							position = size - position;

						}

					} else {

						position = mouse.y;
						size = getSlideHeight() - 1;

						if ( position >= getSlideHeight() )
							position = size;
						value = ( 1 - position / size ) * 100;
						if ( !options.direction ) {

							value = 100 - value;

						}

					}
					setValue( value, position );

				}
				if ( slideIndicator !== undefined ) {

					var mouseout = false;

					/**
					 * Return click event handler for the slider.
					 * Sets picker background color and calls options.sliderIndicator.callback if provided.
					 */
					function slideListener() {

						return function ( evt ) {

							if ( mouseout )
								return;

							evt = evt || window.event;

							/**
							 * Return mouse position relative to the element el.
							 */
							function mousePosition( evt ) {
								// IE:
								if ( window.event && window.event.contentOverflow !== undefined ) {
									return { x: window.event.offsetX, y: window.event.offsetY };
								}
								// Webkit:
								if ( evt.offsetX !== undefined && evt.offsetY !== undefined ) {
									return { x: evt.offsetX, y: evt.offsetY };
								}
								// Firefox:
								var wrapper = evt.target.parentNode.parentNode;
								return { x: evt.layerX - wrapper.offsetLeft, y: evt.layerY - wrapper.offsetTop };
							}

							mouseMove( mousePosition( evt ) );

						}
					}
					function addEventListener( element, event, listener ) {

						if ( element === null )
							return;

						if ( element.attachEvent ) {

							element.attachEvent( 'on' + event, listener );

						} else if ( element.addEventListener ) {

							element.addEventListener( event, listener, false );
						}
					}

					addEventListener( slide, 'click', slideListener() );

					/**
					 * @callback listener
					*/

					/**
					 * Enable drag&drop color selection.
					 * @param {object} ctx ColorPicker instance.
					 * @param {listener} listener Function that will be called whenever mouse is dragged over the element with event object as argument.
					 */
					function enableDragging( ctx, listener ) {

						var element = slide;

						//Touchscreen support

						addEventListener( element, 'touchstart', function ( evt ) { } );
						addEventListener( element, 'touchmove', function ( evt ) {

							evt.preventDefault();

							var rect = evt.srcElement.getBoundingClientRect(),
								x = ( evt.touches[0].clientX - rect.left ),
								y = ( evt.touches[0].clientY - rect.top );
							if ( x < 0 ) x = 0;
							if ( y < 0 ) y = 0;
							mouseMove( { x: x, y: y } );

						} );
						addEventListener( element, 'touchend', function ( evt ) {


						} );

						//mouse support
						addEventListener( element, 'mousedown', function ( evt ) {

							const mouseup = 'mouseup', mousemove = 'mousemove';
							function onMouseUp() {

								//console.warn( mouseup );
								function removeEventListener( element, event, listener ) {

									if ( element === null )
										return;

									if ( element.detachEvent ) {

										element.detachEvent( 'on' + event, listener );

									} else if ( element.removeEventListener ) {

										element.removeEventListener( event, listener, false );

									}
								}
								removeEventListener( window, mouseup, onMouseUp );
								removeEventListener( window, mousemove, listener );

							}
							addEventListener( window, mouseup, onMouseUp );
							addEventListener( window, mousemove, listener );

						} );
						addEventListener( element, 'mouseout', function ( evt ) { mouseout = true; } );
						addEventListener( element, 'mouseover', function ( evt ) { mouseout = false; } );
					}
					enableDragging( this, slideListener() );

				}

				return {

					setValue: setValue,

				};
			};
			/**
			 * create palette
			 * @param {object} [options] the following options are available
			 * @param {paletteIndexes|object[]} [options.palette] Palette index or palette array. The following indexes are available:
			 * <pre>
			 * paletteIndexes.BGYW: 0 - blue, green, yellow, white palette.
			 * paletteIndexes.monochrome: 1,
			 * paletteIndexes.bidirectional: 2,//red, black, green
			 * paletteIndexes.rainbow: 3,
			 * Default is paletteIndexes.BGYW index.
			 * Example of palette array:
			[
				{ percent: 0, r: 0, g: 0, b: 0, },
				{ percent: 10, r: 0xff, g: 255, b: 0xff, },
				{ percent: 100, r: 0xff, g: 255, b: 0xff, },
			]
			* </pre>
			*/
			this.palette = function( options ) {


				function paletteitem( percent, r, g, b ) {

					return {

						percent: percent,
						r: r,
						g: g,
						b: b,

					}

				}

				options = options || {};
				if ( options.palette === undefined )
					options.palette = _this.paletteIndexes.BGYW;
				
				/**
				 * @returns Index of palette.
				 * <pre>
				 * 0 - <a href="../Example/index.html#BGYW" target="_blank">BGYW</a>
				 * 1 - <a href="../Example/index.html#Monochrome" target="_blank">monochrome</a>
				 * 2 - <a href="../Example/index.html#Bidirectional" target="_blank">bidirectional</a>
				 * 3 - <a href="../Example/index.html#rainbow" target="_blank">rainbow</a>
				 * </pre>
				 * */
				this.getPaletteIndex = function () { return options.palette; };

				var arrayPalette = [

					new paletteitem( 0, 0x00, 0x00, 0xFF ),//blue
					new paletteitem( 33, 0x00, 0xFF, 0x00 ),//green
					new paletteitem( 66, 0xFF, 0xFF, 0x00 ),//yellow
					new paletteitem( 100, 0xFF, 0xFF, 0xFF ),//white

				];
				switch ( typeof options.palette ) {

					case 'number':
						switch ( options.palette ) {

							case _this.paletteIndexes.BGYW:
								break;//default palette
							case _this.paletteIndexes.monochrome:
								var arrayPalette = [

									new paletteitem( 0, 0x00, 0x00, 0x00 ),//blach
									new paletteitem( 100, 0xFF, 0xFF, 0xFF ),//white

								];
								break;
							case _this.paletteIndexes.bidirectional:
								var arrayPalette = [
									new paletteitem( 0, 0xff, 0x30, 0x30 ),//red
									new paletteitem( 50, 0x30, 0x30, 0x30 ),//gray
									new paletteitem( 100, 0x30, 0xFF, 0x30 ),//green

								];
								break;
							case _this.paletteIndexes.rainbow:
								var arrayPalette = [

									new paletteitem( 0, 0xff, 0x32, 0x32 ),
									new paletteitem( 16, 0xfc, 0xf5, 0x28 ),
									new paletteitem( 32, 0x28, 0xfc, 0x28 ),
									new paletteitem( 50, 0x28, 0xfc, 0xf8 ),
									new paletteitem( 66, 0x27, 0x2e, 0xf9 ),
									new paletteitem( 82, 0xff, 0x28, 0xfb ),
									new paletteitem( 100, 0xff, 0x32, 0x32 ),

								];
								break;
							default: console.error( 'ColorPicker.create.Palette: invalid options.palette = ' + options.palette );

						}
						break;
					case "object":
						if ( Array.isArray( options.palette ) ) {

							//Custom palette
							arrayPalette = options.palette;
							break;

						}
					default:
						var message = 'invalid options.palette = ' + options.palette;
						console.error( 'ColorPicker.create.Palette: ' + message );
						options.onError( message );

				}
				/**
				* @returns true
				*/
				this.isPalette = function () { return true; };
				/**
				* @returns {object[]} palette array
				*/
				this.getPalette = function () {

					const palette = [];
					arrayPalette.forEach( function ( item ) {

						palette.unshift( CreateSVGElement( 'stop', {

							offset: ( 100 - item.percent ) + '%', 'stop-color': '#'
								//Thanks to https://stackoverflow.com/a/13240395/5175935
								+ ( "0" + ( Number( item.r ).toString( 16 ) ) ).slice( -2 ).toUpperCase()
								+ ( "0" + ( Number( item.g ).toString( 16 ) ) ).slice( -2 ).toUpperCase()
								+ ( "0" + ( Number( item.b ).toString( 16 ) ) ).slice( -2 ).toUpperCase(),
							'stop-opacity': '1'

						} ) );

					} );
					return palette;

				};
				/**
				* converts a percent or value from min to max  to object with r, g, b, hex and percent.
				* @param {number} stringPercent coordinate of color from palette in percent or value from min to max
				* @param {number} [min] min stringPercent.
				* @param {number} [max] max stringPercent.
				* @returns {object} object with r, g, b, hex and percent
				*/
				this.hsv2rgb = function ( stringPercent, min, max ) {

					var percent = parseFloat( stringPercent );
					if ( isNaN( percent ) ) {

						//Сюда попадает из http://localhost/anhr/egocentricUniverse/master/Examples/3D.html
						//Когда вместо случайного выбора вершин задаю их вручную и при этом не указываю координату w вершины
						percent = max;
	/*					
						console.error( 'ColorPicker.palette.hsv2rgb: stringPercent = ' + stringPercent );
						return;
	*/	 
						
					}
					if ( min !== undefined && max !== undefined )
						percent = ( 100 / ( max - min ) ) * ( percent - min );
					var lastPalette = arrayPalette[arrayPalette.length - 1];
					if ( lastPalette.percent !== 100 ) {

						//not compatible with Safari for Windows
						//var lastItem = Object.assign( {}, arrayPalette[arrayPalette.length - 1] );

						const lastItem = {};
						Object.keys( lastPalette ).forEach( function ( key ) {

							lastItem[key] = lastPalette[key];

						} );
						lastItem.percent = 100;
						arrayPalette.push( lastItem );

					}
					var itemPrev;
					for ( var i = 0; i < arrayPalette.length; i++ ) {

						const item = arrayPalette[i];
						if ( itemPrev === undefined )
							itemPrev = item;
						if ( ( ( percent >= itemPrev.percent ) && ( percent <= item.percent ) ) ) {

							function color( percentPrev, prev, percentItem, item ) {

								var percentD = percentItem - percentPrev;
								if ( percentD === 0 )
									return prev;
								return Math.round( prev + ( ( item - prev ) / percentD ) * ( percent - percentPrev ) );

							}
							const r = color( itemPrev.percent, itemPrev.r, item.percent, item.r ),
								g = color( itemPrev.percent, itemPrev.g, item.percent, item.g ),
								b = color( itemPrev.percent, itemPrev.b, item.percent, item.b );
							return {

								r: r,
								g: g,
								b: b,
								hex: "#" + ( 16777216 | b | ( g << 8 ) | ( r << 16 ) ).toString( 16 ).slice( 1 ),
								percent: percent

							};

						}
						itemPrev = item;

					}
					if ( options.onError !== undefined )
						options.onError( 'Invalid color value of the ColorPicker: ' + stringPercent );

				};

				/**
				* converts a value in percentages to color.
				* @param {number} value coordinate of color from palette in percent. Default value range from 0 to 100.
				* @param {number} [min] minimal value
				* @param {number} [max] maximal value
				* @returns {THREE.Color} [color]{@link https://threejs.org/docs/index.html?q=Colo#api/en/math/Color}
				*/
				this.toColor = function ( value, min, max ) {

					const THREE = three$1.THREE;
					if ( value instanceof THREE.Color )
						return value;
					var c = this.hsv2rgb( value, min, max );
					if ( c === undefined )
						c = { r: 255, g: 255, b: 255 };
					return new THREE.Color( "rgb(" + c.r + ", " + c.g + ", " + c.b + ")" );

				};

	//			boCreated = true;

			};
		}
	}
	ColorPicker = new ColorPicker();
	var ColorPicker$1 = ColorPicker;

	/**
	 * @module cookie
	 * @description node.js version of the cookie.
	 * Cookies let you store user information in web pages.
	 * @see {@link https://www.w3schools.com/js/js_cookies.asp}
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

	/**
	 * Is the cookie enabled in your web browser?
	 * @returns {boolean} true if cookie enabled
	 * 
	 * @example
		var isCookieEnabled = cookie.isEnabled('age', 25);
	 */
	function isEnabled() {

		return navigator.cookieEnabled;
		//Enable cookie
		//Chrome: Settings/Show advanced settings.../Privacy/Content settings.../Cookies/Allow local data to be set

	}

	/**
	 * Set a cookie.
	 * @param {string} name cookie name.
	 * @param {any} value cookie value.
	 * @param {Date} [cookie_date] expiry date (in UTC time). Optional.
	 * @example
		cookie.set('age', 25);
	 */
	function set( name, value, cookie_date ) {

		if ( !isEnabled() ) {

			consoleCookieEnabled();
			return;

		}
		value = value.toString();
		//http://ruseller.com/lessons.php?rub=28&id=593
		if ( cookie_date === undefined ) {

			cookie_date = new Date();  // Curent date and time
			cookie_date.setTime( cookie_date.getTime() + 1000 * 60 * 60 * 24 * 365 );//expiry date is one year

		}
		document.cookie = name + "=" + value + ( ( typeof settings == 'undefined' ) ? '' : settings ) + "; expires=" + cookie_date.toGMTString();
		if ( document.cookie === '' )
			console.error( 'document.cookie is empty' );

	}

	/**
	 * sets an object into cookie.
	 * @param {string} name cookie name.
	 * @param {any} object an object for saving into cookie.
	 */
	function setObject( name, object ) {

		set( name, JSON.stringify( object ) );

	}
	/**
	 * Get a cookie.
	 * @param {string} name cookie name.
	 * @param {any} [defaultValue] cookie default value. Optional.
	 * @returns {string} cookie value or defaultValue if cookie was not found.
	 * @example
		var age = cookie.get('age', 25);
	 */
	function get$2( name, defaultValue ) {

		if ( !isEnabled() ) {

			consoleCookieEnabled();
			return;

		}
		//http://ruseller.com/lessons.php?rub=28&id=593
		var results = document.cookie.match( '(^|;) ?' + name + '=([^;]*)(;|$)' );

		if ( results ) {
			
			const result = results[2], type = typeof defaultValue;
			return type === "number" ?//number
					result % 1 === 0 ? parseInt(result) : parseFloat(result) :
				type === "boolean" ?//boolean
					result === 'true' ? true : false :
				unescape( result );//string

		}
		if ( typeof defaultValue == 'undefined' )
			return '';
		return defaultValue;

	}

	/**
	 * gets an object from cookie.
	 * @param {string} name name of the object.
	 * @param {Object} options load an object from cookie into options.
	 * @param {Object} [optionsDefault=options] copy to options this default object if named object is not exists in the cookie.
	 */
	function getObject( name, options, optionsDefault ) {

		//uncompatible with ND build
		//optionsDefault ||= options;
		
		if (optionsDefault === undefined) optionsDefault = options;
		new defaultCookie().getObject( name, options, copyObject( name, optionsDefault ) );

	}
	/**
	 * gets an object from cookie and returns a copy of object.
	 * @param {string} name name of the object.
	 * @param {Object} objectDefault copy to options this default object if named object is not exists in the cookie.
	 * @returns copy of object from cookie.
	 */
	function copyObject( name, objectDefault ) {

		return JSON.parse( get$2( name, JSON.stringify( objectDefault ) ) );

	}

	/**
	 * Remove cookie
	 * @param {string} name cookie name.
	 */
	function remove( name ) {

		if ( !isEnabled() ) {

			consoleCookieEnabled();
			return;

		}
		//http://ruseller.com/lessons.php?rub=28&id=593
		var cookie_date = new Date();
		cookie_date.setTime( cookie_date.getTime() - 1 );
		document.cookie = name += "=; expires=" + cookie_date.toGMTString();

	}

	function consoleCookieEnabled() {

		console.error( 'navigator.cookieEnabled = ' + navigator.cookieEnabled );

	}

	/**
	 * Default cookie is not saving settings
	 * @param {any} name is not using
	 */
	class defaultCookie {

		constructor(name) {
			/**
			 * Default cookie is not loading settings
			 * @param {any} defaultValue
			 * @returns defaultValue
			 */
			this.get = function (defaultValue) {

				return defaultValue;

			};

			/**
			 * Default cookie is not saving settings
			 */
			this.set = function () {

			};

			/**
			 * Default cookie is not loading objects
			 * @param {string} name is not using
			 * @param {any} options load an object from optionsDefault into options
			 * @param {Object} optionsDefault source object
			 */
			this.getObject = function (name, options, optionsDefault) {

				if (!optionsDefault)
					return;//object's settings is not saving
				Object.keys(optionsDefault).forEach(function (key) {

					//I cannot modify options[key] if optionsDefault is read only and options[key] is not copy of optionsDefault[key]
					//options[key] = optionsDefault[key];
					//copy key
					var option = optionsDefault[key];
					if (
						(option !== undefined) &&
						(typeof option !== 'function') &&
						
						//Ключь со значением Infinity превращается в null во время JSON преобразования.
						//Для проверки надо установить options.playerOptions.interval = Infinity
						//Поэтому оставляем старое значение options[key] = Infinity
						(option != null)
					)
						options[key] = JSON.parse(JSON.stringify(option));

				});

			};

			/**
			 * copy and returns an object from objectDefault
			 * @param {string} name is not using
			 * @param {any} objectDefault source object
			 */
			this.copyObject = function (name, objectDefault) {

				return JSON.parse(JSON.stringify(objectDefault));

			};

			/**
			 * Default cookie is not saving object's settings
			 */
			this.setObject = function () {

			};

			this.isTrue = function (defaultValue) {

				return defaultValue;

			};

		}

	}

	var cookie = /*#__PURE__*/Object.freeze({
		__proto__: null,
		isEnabled: isEnabled,
		set: set,
		setObject: setObject,
		get: get$2,
		getObject: getObject,
		copyObject: copyObject,
		remove: remove,
		defaultCookie: defaultCookie
	});

	/**
	 * @module Localization.
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

	/**
	 * returns the "primary language" subtag of the version of the browser.
	 * See the "Syntax" paragraph of RFC 4646 https://tools.ietf.org/html/rfc4646#section-2.1 for details.
	 */
	function getLanguageCode() {

		//returns the language version of the browser.
		function _getLocale() {

			if ( !navigator ) {

				console.error( "getLocale() failed! !navigator" );
				return "";

			}

			if (
				( navigator.languages !== undefined )
				&& ( typeof navigator.languages !== 'unknown' )//for IE6
				&& ( navigator.languages.length > 0 )
			)
				return navigator.languages[0];//Chrome

			//IE
			if ( navigator.language ) {

				return navigator.language;

			} else if ( navigator.browserLanguage ) {

				return navigator.browserLanguage;

			} else if ( navigator.systemLanguage ) {

				return navigator.systemLanguage;

			} else if ( navigator.userLanguage ) {

				return navigator.userLanguage;

			}

			console.error( "getLocale() failed!" );
			return "";

		}

		return _getLocale().toLowerCase().match( /([a-z]+)(?:-([a-z]+))?/ )[1];

	}

	/**
	 * dat-gui JavaScript Controller Library
	 * http://code.google.com/p/dat-gui
	 *
	 * Copyright 2011 Data Arts Team, Google Creative Lab
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 */

	function ___$insertStyle$1(css) {
	  if (!css) {
	    return;
	  }
	  if (typeof window === 'undefined') {
	    return;
	  }

	  var style = document.createElement('style');

	  style.setAttribute('type', 'text/css');
	  style.innerHTML = css;
	  document.head.appendChild(style);

	  return css;
	}

	function colorToString$1 (color, forceCSSHex) {
	  var colorFormat = color.__state.conversionName.toString();
	  var r = Math.round(color.r);
	  var g = Math.round(color.g);
	  var b = Math.round(color.b);
	  var a = color.a;
	  var h = Math.round(color.h);
	  var s = color.s.toFixed(1);
	  var v = color.v.toFixed(1);
	  if (forceCSSHex || colorFormat === 'THREE_CHAR_HEX' || colorFormat === 'SIX_CHAR_HEX') {
	    var str = color.hex.toString(16);
	    while (str.length < 6) {
	      str = '0' + str;
	    }
	    return '#' + str;
	  } else if (colorFormat === 'CSS_RGB') {
	    return 'rgb(' + r + ',' + g + ',' + b + ')';
	  } else if (colorFormat === 'CSS_RGBA') {
	    return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
	  } else if (colorFormat === 'HEX') {
	    return '0x' + color.hex.toString(16);
	  } else if (colorFormat === 'RGB_ARRAY') {
	    return '[' + r + ',' + g + ',' + b + ']';
	  } else if (colorFormat === 'RGBA_ARRAY') {
	    return '[' + r + ',' + g + ',' + b + ',' + a + ']';
	  } else if (colorFormat === 'RGB_OBJ') {
	    return '{r:' + r + ',g:' + g + ',b:' + b + '}';
	  } else if (colorFormat === 'RGBA_OBJ') {
	    return '{r:' + r + ',g:' + g + ',b:' + b + ',a:' + a + '}';
	  } else if (colorFormat === 'HSV_OBJ') {
	    return '{h:' + h + ',s:' + s + ',v:' + v + '}';
	  } else if (colorFormat === 'HSVA_OBJ') {
	    return '{h:' + h + ',s:' + s + ',v:' + v + ',a:' + a + '}';
	  }
	  return 'unknown format';
	}

	var ARR_EACH$1 = Array.prototype.forEach;
	var ARR_SLICE$1 = Array.prototype.slice;
	var Common$1 = {
	  BREAK: {},
	  extend: function extend(target) {
	    this.each(ARR_SLICE$1.call(arguments, 1), function (obj) {
	      var keys = this.isObject(obj) ? Object.keys(obj) : [];
	      keys.forEach(function (key) {
	        if (!this.isUndefined(obj[key])) {
	          target[key] = obj[key];
	        }
	      }.bind(this));
	    }, this);
	    return target;
	  },
	  defaults: function defaults(target) {
	    this.each(ARR_SLICE$1.call(arguments, 1), function (obj) {
	      var keys = this.isObject(obj) ? Object.keys(obj) : [];
	      keys.forEach(function (key) {
	        if (this.isUndefined(target[key])) {
	          target[key] = obj[key];
	        }
	      }.bind(this));
	    }, this);
	    return target;
	  },
	  compose: function compose() {
	    var toCall = ARR_SLICE$1.call(arguments);
	    return function () {
	      var args = ARR_SLICE$1.call(arguments);
	      for (var i = toCall.length - 1; i >= 0; i--) {
	        args = [toCall[i].apply(this, args)];
	      }
	      return args[0];
	    };
	  },
	  each: function each(obj, itr, scope) {
	    if (!obj) {
	      return;
	    }
	    if (ARR_EACH$1 && obj.forEach && obj.forEach === ARR_EACH$1) {
	      obj.forEach(itr, scope);
	    } else if (obj.length === obj.length + 0) {
	      var key = void 0;
	      var l = void 0;
	      for (key = 0, l = obj.length; key < l; key++) {
	        if (key in obj && itr.call(scope, obj[key], key) === this.BREAK) {
	          return;
	        }
	      }
	    } else {
	      for (var _key in obj) {
	        if (itr.call(scope, obj[_key], _key) === this.BREAK) {
	          return;
	        }
	      }
	    }
	  },
	  defer: function defer(fnc) {
	    setTimeout(fnc, 0);
	  },
	  debounce: function debounce(func, threshold, callImmediately) {
	    var timeout = void 0;
	    return function () {
	      var obj = this;
	      var args = arguments;
	      function delayed() {
	        timeout = null;
	        if (!callImmediately) func.apply(obj, args);
	      }
	      var callNow = callImmediately || !timeout;
	      clearTimeout(timeout);
	      timeout = setTimeout(delayed, threshold);
	      if (callNow) {
	        func.apply(obj, args);
	      }
	    };
	  },
	  toArray: function toArray(obj) {
	    if (obj.toArray) return obj.toArray();
	    return ARR_SLICE$1.call(obj);
	  },
	  isUndefined: function isUndefined(obj) {
	    return obj === undefined;
	  },
	  isNull: function isNull(obj) {
	    return obj === null;
	  },
	  isNaN: function (_isNaN) {
	    function isNaN(_x) {
	      return _isNaN.apply(this, arguments);
	    }
	    isNaN.toString = function () {
	      return _isNaN.toString();
	    };
	    return isNaN;
	  }(function (obj) {
	    return isNaN(obj);
	  }),
	  isArray: Array.isArray || function (obj) {
	    return obj.constructor === Array;
	  },
	  isObject: function isObject(obj) {
	    return obj === Object(obj);
	  },
	  isNumber: function isNumber(obj) {
	    return obj === obj + 0;
	  },
	  isString: function isString(obj) {
	    return obj === obj + '';
	  },
	  isBoolean: function isBoolean(obj) {
	    return obj === false || obj === true;
	  },
	  isFunction: function isFunction(obj) {
	    return Object.prototype.toString.call(obj) === '[object Function]';
	  }
	};

	var INTERPRETATIONS$1 = [
	{
	  litmus: Common$1.isString,
	  conversions: {
	    THREE_CHAR_HEX: {
	      read: function read(original) {
	        var test = original.match(/^#([A-F0-9])([A-F0-9])([A-F0-9])$/i);
	        if (test === null) {
	          return false;
	        }
	        return {
	          space: 'HEX',
	          hex: parseInt('0x' + test[1].toString() + test[1].toString() + test[2].toString() + test[2].toString() + test[3].toString() + test[3].toString(), 0)
	        };
	      },
	      write: colorToString$1
	    },
	    SIX_CHAR_HEX: {
	      read: function read(original) {
	        var test = original.match(/^#([A-F0-9]{6})$/i);
	        if (test === null) {
	          return false;
	        }
	        return {
	          space: 'HEX',
	          hex: parseInt('0x' + test[1].toString(), 0)
	        };
	      },
	      write: colorToString$1
	    },
	    CSS_RGB: {
	      read: function read(original) {
	        var test = original.match(/^rgb\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\)/);
	        if (test === null) {
	          return false;
	        }
	        return {
	          space: 'RGB',
	          r: parseFloat(test[1]),
	          g: parseFloat(test[2]),
	          b: parseFloat(test[3])
	        };
	      },
	      write: colorToString$1
	    },
	    CSS_RGBA: {
	      read: function read(original) {
	        var test = original.match(/^rgba\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\)/);
	        if (test === null) {
	          return false;
	        }
	        return {
	          space: 'RGB',
	          r: parseFloat(test[1]),
	          g: parseFloat(test[2]),
	          b: parseFloat(test[3]),
	          a: parseFloat(test[4])
	        };
	      },
	      write: colorToString$1
	    }
	  }
	},
	{
	  litmus: Common$1.isNumber,
	  conversions: {
	    HEX: {
	      read: function read(original) {
	        return {
	          space: 'HEX',
	          hex: original,
	          conversionName: 'HEX'
	        };
	      },
	      write: function write(color) {
	        return color.hex;
	      }
	    }
	  }
	},
	{
	  litmus: Common$1.isArray,
	  conversions: {
	    RGB_ARRAY: {
	      read: function read(original) {
	        if (original.length !== 3) {
	          return false;
	        }
	        return {
	          space: 'RGB',
	          r: original[0],
	          g: original[1],
	          b: original[2]
	        };
	      },
	      write: function write(color) {
	        return [color.r, color.g, color.b];
	      }
	    },
	    RGBA_ARRAY: {
	      read: function read(original) {
	        if (original.length !== 4) return false;
	        return {
	          space: 'RGB',
	          r: original[0],
	          g: original[1],
	          b: original[2],
	          a: original[3]
	        };
	      },
	      write: function write(color) {
	        return [color.r, color.g, color.b, color.a];
	      }
	    }
	  }
	},
	{
	  litmus: Common$1.isObject,
	  conversions: {
	    RGBA_OBJ: {
	      read: function read(original) {
	        if (Common$1.isNumber(original.r) && Common$1.isNumber(original.g) && Common$1.isNumber(original.b) && Common$1.isNumber(original.a)) {
	          return {
	            space: 'RGB',
	            r: original.r,
	            g: original.g,
	            b: original.b,
	            a: original.a
	          };
	        }
	        return false;
	      },
	      write: function write(color) {
	        return {
	          r: color.r,
	          g: color.g,
	          b: color.b,
	          a: color.a
	        };
	      }
	    },
	    RGB_OBJ: {
	      read: function read(original) {
	        if (Common$1.isNumber(original.r) && Common$1.isNumber(original.g) && Common$1.isNumber(original.b)) {
	          return {
	            space: 'RGB',
	            r: original.r,
	            g: original.g,
	            b: original.b
	          };
	        }
	        return false;
	      },
	      write: function write(color) {
	        return {
	          r: color.r,
	          g: color.g,
	          b: color.b
	        };
	      }
	    },
	    HSVA_OBJ: {
	      read: function read(original) {
	        if (Common$1.isNumber(original.h) && Common$1.isNumber(original.s) && Common$1.isNumber(original.v) && Common$1.isNumber(original.a)) {
	          return {
	            space: 'HSV',
	            h: original.h,
	            s: original.s,
	            v: original.v,
	            a: original.a
	          };
	        }
	        return false;
	      },
	      write: function write(color) {
	        return {
	          h: color.h,
	          s: color.s,
	          v: color.v,
	          a: color.a
	        };
	      }
	    },
	    HSV_OBJ: {
	      read: function read(original) {
	        if (Common$1.isNumber(original.h) && Common$1.isNumber(original.s) && Common$1.isNumber(original.v)) {
	          return {
	            space: 'HSV',
	            h: original.h,
	            s: original.s,
	            v: original.v
	          };
	        }
	        return false;
	      },
	      write: function write(color) {
	        return {
	          h: color.h,
	          s: color.s,
	          v: color.v
	        };
	      }
	    }
	  }
	}];
	var result$1 = void 0;
	var toReturn$1 = void 0;
	var interpret$1 = function interpret() {
	  toReturn$1 = false;
	  var original = arguments.length > 1 ? Common$1.toArray(arguments) : arguments[0];
	  Common$1.each(INTERPRETATIONS$1, function (family) {
	    if (family.litmus(original)) {
	      Common$1.each(family.conversions, function (conversion, conversionName) {
	        result$1 = conversion.read(original);
	        if (toReturn$1 === false && result$1 !== false) {
	          toReturn$1 = result$1;
	          result$1.conversionName = conversionName;
	          result$1.conversion = conversion;
	          return Common$1.BREAK;
	        }
	      });
	      return Common$1.BREAK;
	    }
	  });
	  return toReturn$1;
	};

	var tmpComponent$1 = void 0;
	var ColorMath$1 = {
	  hsv_to_rgb: function hsv_to_rgb(h, s, v) {
	    var hi = Math.floor(h / 60) % 6;
	    var f = h / 60 - Math.floor(h / 60);
	    var p = v * (1.0 - s);
	    var q = v * (1.0 - f * s);
	    var t = v * (1.0 - (1.0 - f) * s);
	    var c = [[v, t, p], [q, v, p], [p, v, t], [p, q, v], [t, p, v], [v, p, q]][hi];
	    return {
	      r: c[0] * 255,
	      g: c[1] * 255,
	      b: c[2] * 255
	    };
	  },
	  rgb_to_hsv: function rgb_to_hsv(r, g, b) {
	    var min = Math.min(r, g, b);
	    var max = Math.max(r, g, b);
	    var delta = max - min;
	    var h = void 0;
	    var s = void 0;
	    if (max !== 0) {
	      s = delta / max;
	    } else {
	      return {
	        h: NaN,
	        s: 0,
	        v: 0
	      };
	    }
	    if (r === max) {
	      h = (g - b) / delta;
	    } else if (g === max) {
	      h = 2 + (b - r) / delta;
	    } else {
	      h = 4 + (r - g) / delta;
	    }
	    h /= 6;
	    if (h < 0) {
	      h += 1;
	    }
	    return {
	      h: h * 360,
	      s: s,
	      v: max / 255
	    };
	  },
	  rgb_to_hex: function rgb_to_hex(r, g, b) {
	    var hex = this.hex_with_component(0, 2, r);
	    hex = this.hex_with_component(hex, 1, g);
	    hex = this.hex_with_component(hex, 0, b);
	    return hex;
	  },
	  component_from_hex: function component_from_hex(hex, componentIndex) {
	    return hex >> componentIndex * 8 & 0xFF;
	  },
	  hex_with_component: function hex_with_component(hex, componentIndex, value) {
	    return value << (tmpComponent$1 = componentIndex * 8) | hex & ~(0xFF << tmpComponent$1);
	  }
	};

	var _typeof$1 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
	  return typeof obj;
	} : function (obj) {
	  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
	};











	var classCallCheck$1 = function (instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};

	var createClass$1 = function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];
	      descriptor.enumerable = descriptor.enumerable || false;
	      descriptor.configurable = true;
	      if ("value" in descriptor) descriptor.writable = true;
	      Object.defineProperty(target, descriptor.key, descriptor);
	    }
	  }

	  return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);
	    if (staticProps) defineProperties(Constructor, staticProps);
	    return Constructor;
	  };
	}();







	var get$1 = function get(object, property, receiver) {
	  if (object === null) object = Function.prototype;
	  var desc = Object.getOwnPropertyDescriptor(object, property);

	  if (desc === undefined) {
	    var parent = Object.getPrototypeOf(object);

	    if (parent === null) {
	      return undefined;
	    } else {
	      return get(parent, property, receiver);
	    }
	  } else if ("value" in desc) {
	    return desc.value;
	  } else {
	    var getter = desc.get;

	    if (getter === undefined) {
	      return undefined;
	    }

	    return getter.call(receiver);
	  }
	};

	var inherits$1 = function (subClass, superClass) {
	  if (typeof superClass !== "function" && superClass !== null) {
	    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
	  }

	  subClass.prototype = Object.create(superClass && superClass.prototype, {
	    constructor: {
	      value: subClass,
	      enumerable: false,
	      writable: true,
	      configurable: true
	    }
	  });
	  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	};











	var possibleConstructorReturn$1 = function (self, call) {
	  if (!self) {
	    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	  }

	  return call && (typeof call === "object" || typeof call === "function") ? call : self;
	};

	var Color$1 = function () {
	  function Color() {
	    classCallCheck$1(this, Color);
	    this.__state = interpret$1.apply(this, arguments);
	    if (this.__state === false) {
	      throw new Error('Failed to interpret color arguments');
	    }
	    this.__state.a = this.__state.a || 1;
	  }
	  createClass$1(Color, [{
	    key: 'toString',
	    value: function toString() {
	      return colorToString$1(this);
	    }
	  }, {
	    key: 'toHexString',
	    value: function toHexString() {
	      return colorToString$1(this, true);
	    }
	  }, {
	    key: 'toOriginal',
	    value: function toOriginal() {
	      return this.__state.conversion.write(this);
	    }
	  }]);
	  return Color;
	}();
	function defineRGBComponent$1(target, component, componentHexIndex) {
	  Object.defineProperty(target, component, {
	    get: function get$$1() {
	      if (this.__state.space === 'RGB') {
	        return this.__state[component];
	      }
	      Color$1.recalculateRGB(this, component, componentHexIndex);
	      return this.__state[component];
	    },
	    set: function set$$1(v) {
	      if (this.__state.space !== 'RGB') {
	        Color$1.recalculateRGB(this, component, componentHexIndex);
	        this.__state.space = 'RGB';
	      }
	      this.__state[component] = v;
	    }
	  });
	}
	function defineHSVComponent$1(target, component) {
	  Object.defineProperty(target, component, {
	    get: function get$$1() {
	      if (this.__state.space === 'HSV') {
	        return this.__state[component];
	      }
	      Color$1.recalculateHSV(this);
	      return this.__state[component];
	    },
	    set: function set$$1(v) {
	      if (this.__state.space !== 'HSV') {
	        Color$1.recalculateHSV(this);
	        this.__state.space = 'HSV';
	      }
	      this.__state[component] = v;
	    }
	  });
	}
	Color$1.recalculateRGB = function (color, component, componentHexIndex) {
	  if (color.__state.space === 'HEX') {
	    color.__state[component] = ColorMath$1.component_from_hex(color.__state.hex, componentHexIndex);
	  } else if (color.__state.space === 'HSV') {
	    Common$1.extend(color.__state, ColorMath$1.hsv_to_rgb(color.__state.h, color.__state.s, color.__state.v));
	  } else {
	    throw new Error('Corrupted color state');
	  }
	};
	Color$1.recalculateHSV = function (color) {
	  var result = ColorMath$1.rgb_to_hsv(color.r, color.g, color.b);
	  Common$1.extend(color.__state, {
	    s: result.s,
	    v: result.v
	  });
	  if (!Common$1.isNaN(result.h)) {
	    color.__state.h = result.h;
	  } else if (Common$1.isUndefined(color.__state.h)) {
	    color.__state.h = 0;
	  }
	};
	Color$1.COMPONENTS = ['r', 'g', 'b', 'h', 's', 'v', 'hex', 'a'];
	defineRGBComponent$1(Color$1.prototype, 'r', 2);
	defineRGBComponent$1(Color$1.prototype, 'g', 1);
	defineRGBComponent$1(Color$1.prototype, 'b', 0);
	defineHSVComponent$1(Color$1.prototype, 'h');
	defineHSVComponent$1(Color$1.prototype, 's');
	defineHSVComponent$1(Color$1.prototype, 'v');
	Object.defineProperty(Color$1.prototype, 'a', {
	  get: function get$$1() {
	    return this.__state.a;
	  },
	  set: function set$$1(v) {
	    this.__state.a = v;
	  }
	});
	Object.defineProperty(Color$1.prototype, 'hex', {
	  get: function get$$1() {
	    if (!this.__state.space !== 'HEX') {
	      this.__state.hex = ColorMath$1.rgb_to_hex(this.r, this.g, this.b);
	    }
	    return this.__state.hex;
	  },
	  set: function set$$1(v) {
	    this.__state.space = 'HEX';
	    this.__state.hex = v;
	  }
	});

	var Controller$1 = function () {
	  function Controller(object, property) {
	    classCallCheck$1(this, Controller);
	    this.initialValue = object[property];
	    this.domElement = document.createElement('div');
	    this.object = object;
	    this.property = property;
	    this.__onChange = undefined;
	    this.__onFinishChange = undefined;
	  }
	  createClass$1(Controller, [{
	    key: 'onChange',
	    value: function onChange(fnc) {
	      this.__onChange = fnc;
	      return this;
	    }
	  }, {
	    key: 'onFinishChange',
	    value: function onFinishChange(fnc) {
	      this.__onFinishChange = fnc;
	      return this;
	    }
	  }, {
	    key: 'setValue',
	    value: function setValue(newValue) {
	      this.object[this.property] = newValue;
	      if (this.__onChange) {
	        this.__onChange.call(this, newValue);
	      }
	      this.updateDisplay();
	      return this;
	    }
	  }, {
	    key: 'getValue',
	    value: function getValue() {
	      return this.object[this.property];
	    }
	  }, {
	    key: 'updateDisplay',
	    value: function updateDisplay() {
	      return this;
	    }
	  }, {
	    key: 'isModified',
	    value: function isModified() {
	      return this.initialValue !== this.getValue();
	    }
	  }]);
	  return Controller;
	}();

	var EVENT_MAP$1 = {
	  HTMLEvents: ['change'],
	  MouseEvents: ['click', 'mousemove', 'mousedown', 'mouseup', 'mouseover'],
	  KeyboardEvents: ['keydown']
	};
	var EVENT_MAP_INV$1 = {};
	Common$1.each(EVENT_MAP$1, function (v, k) {
	  Common$1.each(v, function (e) {
	    EVENT_MAP_INV$1[e] = k;
	  });
	});
	var CSS_VALUE_PIXELS$1 = /(\d+(\.\d+)?)px/;
	function cssValueToPixels$1(val) {
	  if (val === '0' || Common$1.isUndefined(val)) {
	    return 0;
	  }
	  var match = val.match(CSS_VALUE_PIXELS$1);
	  if (!Common$1.isNull(match)) {
	    return parseFloat(match[1]);
	  }
	  return 0;
	}
	var dom$1 = {
	  makeSelectable: function makeSelectable(elem, selectable) {
	    if (elem === undefined || elem.style === undefined) return;
	    elem.onselectstart = selectable ? function () {
	      return false;
	    } : function () {};
	    elem.style.MozUserSelect = selectable ? 'auto' : 'none';
	    elem.style.KhtmlUserSelect = selectable ? 'auto' : 'none';
	    elem.unselectable = selectable ? 'on' : 'off';
	  },
	  makeFullscreen: function makeFullscreen(elem, hor, vert) {
	    var vertical = vert;
	    var horizontal = hor;
	    if (Common$1.isUndefined(horizontal)) {
	      horizontal = true;
	    }
	    if (Common$1.isUndefined(vertical)) {
	      vertical = true;
	    }
	    elem.style.position = 'absolute';
	    if (horizontal) {
	      elem.style.left = 0;
	      elem.style.right = 0;
	    }
	    if (vertical) {
	      elem.style.top = 0;
	      elem.style.bottom = 0;
	    }
	  },
	  fakeEvent: function fakeEvent(elem, eventType, pars, aux) {
	    var params = pars || {};
	    var className = EVENT_MAP_INV$1[eventType];
	    if (!className) {
	      throw new Error('Event type ' + eventType + ' not supported.');
	    }
	    var evt = document.createEvent(className);
	    switch (className) {
	      case 'MouseEvents':
	        {
	          var clientX = params.x || params.clientX || 0;
	          var clientY = params.y || params.clientY || 0;
	          evt.initMouseEvent(eventType, params.bubbles || false, params.cancelable || true, window, params.clickCount || 1, 0,
	          0,
	          clientX,
	          clientY,
	          false, false, false, false, 0, null);
	          break;
	        }
	      case 'KeyboardEvents':
	        {
	          var init = evt.initKeyboardEvent || evt.initKeyEvent;
	          Common$1.defaults(params, {
	            cancelable: true,
	            ctrlKey: false,
	            altKey: false,
	            shiftKey: false,
	            metaKey: false,
	            keyCode: undefined,
	            charCode: undefined
	          });
	          init(eventType, params.bubbles || false, params.cancelable, window, params.ctrlKey, params.altKey, params.shiftKey, params.metaKey, params.keyCode, params.charCode);
	          break;
	        }
	      default:
	        {
	          evt.initEvent(eventType, params.bubbles || false, params.cancelable || true);
	          break;
	        }
	    }
	    Common$1.defaults(evt, aux);
	    elem.dispatchEvent(evt);
	  },
	  bind: function bind(elem, event, func, newBool) {
	    var bool = newBool || false;
	    if (elem.addEventListener) {
	      elem.addEventListener(event, func, {
	        passive: bool
	      });
	    } else if (elem.attachEvent) {
	      elem.attachEvent('on' + event, func);
	    }
	    return dom$1;
	  },
	  unbind: function unbind(elem, event, func, newBool) {
	    var bool = newBool || false;
	    if (elem.removeEventListener) {
	      elem.removeEventListener(event, func, bool);
	    } else if (elem.detachEvent) {
	      elem.detachEvent('on' + event, func);
	    }
	    return dom$1;
	  },
	  addClass: function addClass(elem, className) {
	    if (elem.className === undefined) {
	      elem.className = className;
	    } else if (elem.className !== className) {
	      var classes = elem.className.split(/ +/);
	      if (classes.indexOf(className) === -1) {
	        classes.push(className);
	        elem.className = classes.join(' ').replace(/^\s+/, '').replace(/\s+$/, '');
	      }
	    }
	    return dom$1;
	  },
	  removeClass: function removeClass(elem, className) {
	    if (className) {
	      if (elem.className === className) {
	        elem.removeAttribute('class');
	      } else {
	        var classes = elem.className.split(/ +/);
	        var index = classes.indexOf(className);
	        if (index !== -1) {
	          classes.splice(index, 1);
	          elem.className = classes.join(' ');
	        }
	      }
	    } else {
	      elem.className = undefined;
	    }
	    return dom$1;
	  },
	  hasClass: function hasClass(elem, className) {
	    return new RegExp('(?:^|\\s+)' + className + '(?:\\s+|$)').test(elem.className) || false;
	  },
	  getWidth: function getWidth(elem) {
	    var style = getComputedStyle(elem);
	    return cssValueToPixels$1(style['border-left-width']) + cssValueToPixels$1(style['border-right-width']) + cssValueToPixels$1(style['padding-left']) + cssValueToPixels$1(style['padding-right']) + cssValueToPixels$1(style.width);
	  },
	  getHeight: function getHeight(elem) {
	    var style = getComputedStyle(elem);
	    return cssValueToPixels$1(style['border-top-width']) + cssValueToPixels$1(style['border-bottom-width']) + cssValueToPixels$1(style['padding-top']) + cssValueToPixels$1(style['padding-bottom']) + cssValueToPixels$1(style.height);
	  },
	  getOffset: function getOffset(el) {
	    var elem = el;
	    var offset = { left: 0, top: 0 };
	    if (elem.offsetParent) {
	      do {
	        offset.left += elem.offsetLeft;
	        offset.top += elem.offsetTop;
	        elem = elem.offsetParent;
	      } while (elem);
	    }
	    return offset;
	  },
	  isActive: function isActive(elem) {
	    return elem === document.activeElement && (elem.type || elem.href);
	  }
	};

	var BooleanController$1 = function (_Controller) {
	  inherits$1(BooleanController, _Controller);
	  function BooleanController(object, property) {
	    classCallCheck$1(this, BooleanController);
	    var _this2 = possibleConstructorReturn$1(this, (BooleanController.__proto__ || Object.getPrototypeOf(BooleanController)).call(this, object, property));
	    var _this = _this2;
	    _this2.__prev = _this2.getValue();
	    _this2.__checkbox = document.createElement('input');
	    _this2.__checkbox.setAttribute('type', 'checkbox');
	    function onChange() {
	      _this.setValue(!_this.__prev);
	    }
	    dom$1.bind(_this2.__checkbox, 'change', onChange, false);
	    _this2.domElement.appendChild(_this2.__checkbox);
	    _this2.updateDisplay();
	    return _this2;
	  }
	  createClass$1(BooleanController, [{
	    key: 'setValue',
	    value: function setValue(v) {
	      var toReturn = get$1(BooleanController.prototype.__proto__ || Object.getPrototypeOf(BooleanController.prototype), 'setValue', this).call(this, v);
	      if (this.__onFinishChange) {
	        this.__onFinishChange.call(this, this.getValue());
	      }
	      this.__prev = this.getValue();
	      return toReturn;
	    }
	  }, {
	    key: 'updateDisplay',
	    value: function updateDisplay() {
	      if (this.getValue() === true) {
	        this.__checkbox.setAttribute('checked', 'checked');
	        this.__checkbox.checked = true;
	        this.__prev = true;
	      } else {
	        this.__checkbox.checked = false;
	        this.__prev = false;
	      }
	      return get$1(BooleanController.prototype.__proto__ || Object.getPrototypeOf(BooleanController.prototype), 'updateDisplay', this).call(this);
	    }
	  }]);
	  return BooleanController;
	}(Controller$1);

	var OptionController$1 = function (_Controller) {
	  inherits$1(OptionController, _Controller);
	  function OptionController(object, property, opts) {
	    classCallCheck$1(this, OptionController);
	    var _this2 = possibleConstructorReturn$1(this, (OptionController.__proto__ || Object.getPrototypeOf(OptionController)).call(this, object, property));
	    var options = opts;
	    var _this = _this2;
	    _this2.__select = document.createElement('select');
	    if (Common$1.isArray(options)) {
	      var map = {};
	      Common$1.each(options, function (element) {
	        map[element] = element;
	      });
	      options = map;
	    }
	    Common$1.each(options, function (value, key) {
	      var opt = document.createElement('option');
	      opt.innerHTML = key;
	      opt.setAttribute('value', value);
	      _this.__select.appendChild(opt);
	    });
	    _this2.updateDisplay();
	    dom$1.bind(_this2.__select, 'change', function () {
	      var desiredValue = this.options[this.selectedIndex].value;
	      _this.setValue(desiredValue);
	    });
	    _this2.domElement.appendChild(_this2.__select);
	    return _this2;
	  }
	  createClass$1(OptionController, [{
	    key: 'setValue',
	    value: function setValue(v) {
	      var toReturn = get$1(OptionController.prototype.__proto__ || Object.getPrototypeOf(OptionController.prototype), 'setValue', this).call(this, v);
	      if (this.__onFinishChange) {
	        this.__onFinishChange.call(this, this.getValue());
	      }
	      return toReturn;
	    }
	  }, {
	    key: 'updateDisplay',
	    value: function updateDisplay() {
	      if (dom$1.isActive(this.__select)) return this;
	      this.__select.value = this.getValue();
	      return get$1(OptionController.prototype.__proto__ || Object.getPrototypeOf(OptionController.prototype), 'updateDisplay', this).call(this);
	    }
	  }]);
	  return OptionController;
	}(Controller$1);

	var StringController$1 = function (_Controller) {
	  inherits$1(StringController, _Controller);
	  function StringController(object, property) {
	    classCallCheck$1(this, StringController);
	    var _this2 = possibleConstructorReturn$1(this, (StringController.__proto__ || Object.getPrototypeOf(StringController)).call(this, object, property));
	    var _this = _this2;
	    function onChange() {
	      _this.setValue(_this.__input.value);
	    }
	    function onBlur() {
	      if (_this.__onFinishChange) {
	        _this.__onFinishChange.call(_this, _this.getValue());
	      }
	    }
	    _this2.__input = document.createElement('input');
	    _this2.__input.setAttribute('type', 'text');
	    dom$1.bind(_this2.__input, 'keyup', onChange);
	    dom$1.bind(_this2.__input, 'change', onChange);
	    dom$1.bind(_this2.__input, 'blur', onBlur);
	    dom$1.bind(_this2.__input, 'keydown', function (e) {
	      if (e.keyCode === 13) {
	        this.blur();
	      }
	    });
	    _this2.updateDisplay();
	    _this2.domElement.appendChild(_this2.__input);
	    return _this2;
	  }
	  createClass$1(StringController, [{
	    key: 'updateDisplay',
	    value: function updateDisplay() {
	      if (!dom$1.isActive(this.__input)) {
	        this.__input.value = this.getValue();
	      }
	      return get$1(StringController.prototype.__proto__ || Object.getPrototypeOf(StringController.prototype), 'updateDisplay', this).call(this);
	    }
	  }]);
	  return StringController;
	}(Controller$1);

	function numDecimals$1(x) {
	  var _x = x.toString();
	  if (_x.indexOf('.') > -1) {
	    return _x.length - _x.indexOf('.') - 1;
	  }
	  return 0;
	}
	var NumberController$1 = function (_Controller) {
	  inherits$1(NumberController, _Controller);
	  function NumberController(object, property, params) {
	    classCallCheck$1(this, NumberController);
	    var _this = possibleConstructorReturn$1(this, (NumberController.__proto__ || Object.getPrototypeOf(NumberController)).call(this, object, property));
	    var _params = params || {};
	    _this.__min = _params.min;
	    _this.__max = _params.max;
	    _this.__step = _params.step;
	    if (Common$1.isUndefined(_this.__step)) {
	      if (_this.initialValue === 0) {
	        _this.__impliedStep = 1;
	      } else {
	        _this.__impliedStep = Math.pow(10, Math.floor(Math.log(Math.abs(_this.initialValue)) / Math.LN10)) / 10;
	      }
	    } else {
	      _this.__impliedStep = _this.__step;
	    }
	    _this.__precision = numDecimals$1(_this.__impliedStep);
	    return _this;
	  }
	  createClass$1(NumberController, [{
	    key: 'setValue',
	    value: function setValue(v) {
	      var _v = v;
	      if (this.__min !== undefined && _v < this.__min) {
	        _v = this.__min;
	      } else if (this.__max !== undefined && _v > this.__max) {
	        _v = this.__max;
	      }
	      if (this.__step !== undefined && _v % this.__step !== 0) {
	        _v = Math.round(_v / this.__step) * this.__step;
	      }
	      return get$1(NumberController.prototype.__proto__ || Object.getPrototypeOf(NumberController.prototype), 'setValue', this).call(this, _v);
	    }
	  }, {
	    key: 'min',
	    value: function min(minValue) {
	      this.__min = minValue;
	      return this;
	    }
	  }, {
	    key: 'max',
	    value: function max(maxValue) {
	      this.__max = maxValue;
	      return this;
	    }
	  }, {
	    key: 'step',
	    value: function step(stepValue) {
	      this.__step = stepValue;
	      this.__impliedStep = stepValue;
	      this.__precision = numDecimals$1(stepValue);
	      return this;
	    }
	  }]);
	  return NumberController;
	}(Controller$1);

	function roundToDecimal$1(value, decimals) {
	  var tenTo = Math.pow(10, decimals);
	  return Math.round(value * tenTo) / tenTo;
	}
	var NumberControllerBox$1 = function (_NumberController) {
	  inherits$1(NumberControllerBox, _NumberController);
	  function NumberControllerBox(object, property, params) {
	    classCallCheck$1(this, NumberControllerBox);
	    var _this2 = possibleConstructorReturn$1(this, (NumberControllerBox.__proto__ || Object.getPrototypeOf(NumberControllerBox)).call(this, object, property, params));
	    _this2.__truncationSuspended = false;
	    var _this = _this2;
	    var prevY = void 0;
	    function onChange() {
	      var attempted = parseFloat(_this.__input.value);
	      if (!Common$1.isNaN(attempted)) {
	        _this.setValue(attempted);
	      }
	    }
	    function onFinish() {
	      if (_this.__onFinishChange) {
	        _this.__onFinishChange.call(_this, _this.getValue());
	      }
	    }
	    function onBlur() {
	      onFinish();
	    }
	    function onMouseDrag(e) {
	      var diff = prevY - e.clientY;
	      _this.setValue(_this.getValue() + diff * _this.__impliedStep);
	      prevY = e.clientY;
	    }
	    function onMouseUp() {
	      dom$1.unbind(window, 'mousemove', onMouseDrag);
	      dom$1.unbind(window, 'mouseup', onMouseUp);
	      onFinish();
	    }
	    function onMouseDown(e) {
	      dom$1.bind(window, 'mousemove', onMouseDrag);
	      dom$1.bind(window, 'mouseup', onMouseUp);
	      prevY = e.clientY;
	    }
	    _this2.__input = document.createElement('input');
	    _this2.__input.setAttribute('type', 'text');
	    dom$1.bind(_this2.__input, 'change', onChange);
	    dom$1.bind(_this2.__input, 'blur', onBlur);
	    dom$1.bind(_this2.__input, 'mousedown', onMouseDown);
	    dom$1.bind(_this2.__input, 'keydown', function (e) {
	      if (e.keyCode === 13) {
	        _this.__truncationSuspended = true;
	        this.blur();
	        _this.__truncationSuspended = false;
	        onFinish();
	      }
	    });
	    _this2.updateDisplay();
	    _this2.domElement.appendChild(_this2.__input);
	    return _this2;
	  }
	  createClass$1(NumberControllerBox, [{
	    key: 'updateDisplay',
	    value: function updateDisplay() {
	      this.__input.value = this.__truncationSuspended ? this.getValue() : roundToDecimal$1(this.getValue(), this.__precision);
	      return get$1(NumberControllerBox.prototype.__proto__ || Object.getPrototypeOf(NumberControllerBox.prototype), 'updateDisplay', this).call(this);
	    }
	  }]);
	  return NumberControllerBox;
	}(NumberController$1);

	function map$1(v, i1, i2, o1, o2) {
	  return o1 + (o2 - o1) * ((v - i1) / (i2 - i1));
	}
	var NumberControllerSlider$1 = function (_NumberController) {
	  inherits$1(NumberControllerSlider, _NumberController);
	  function NumberControllerSlider(object, property, min, max, step, newBool) {
	    classCallCheck$1(this, NumberControllerSlider);
	    var _this2 = possibleConstructorReturn$1(this, (NumberControllerSlider.__proto__ || Object.getPrototypeOf(NumberControllerSlider)).call(this, object, property, { min: min, max: max, step: step }));
	    var _this = _this2;
	    _this2.__background = document.createElement('div');
	    _this2.__foreground = document.createElement('div');
	    _this2.newBool = newBool;
	    dom$1.bind(_this2.__background, 'mousedown', onMouseDown, newBool);
	    dom$1.bind(_this2.__background, 'touchstart', onTouchStart);
	    dom$1.addClass(_this2.__background, 'slider');
	    dom$1.addClass(_this2.__foreground, 'slider-fg');
	    function onMouseDown(e) {
	      document.activeElement.blur();
	      dom$1.bind(window, 'mousemove', onMouseDrag);
	      dom$1.bind(window, 'mouseup', onMouseUp);
	      onMouseDrag(e);
	    }
	    function onMouseDrag(e) {
	      if (!_this.newBool) e.preventDefault();
	      var bgRect = _this.__background.getBoundingClientRect();
	      _this.setValue(map$1(e.clientX, bgRect.left, bgRect.right, _this.__min, _this.__max));
	      return false;
	    }
	    function onMouseUp() {
	      dom$1.unbind(window, 'mousemove', onMouseDrag);
	      dom$1.unbind(window, 'mouseup', onMouseUp);
	      if (_this.__onFinishChange) {
	        _this.__onFinishChange.call(_this, _this.getValue());
	      }
	    }
	    function onTouchStart(e) {
	      if (e.touches.length !== 1) {
	        return;
	      }
	      dom$1.bind(window, 'touchmove', onTouchMove);
	      dom$1.bind(window, 'touchend', onTouchEnd);
	      onTouchMove(e);
	    }
	    function onTouchMove(e) {
	      var clientX = e.touches[0].clientX;
	      var bgRect = _this.__background.getBoundingClientRect();
	      _this.setValue(map$1(clientX, bgRect.left, bgRect.right, _this.__min, _this.__max));
	    }
	    function onTouchEnd() {
	      dom$1.unbind(window, 'touchmove', onTouchMove);
	      dom$1.unbind(window, 'touchend', onTouchEnd);
	      if (_this.__onFinishChange) {
	        _this.__onFinishChange.call(_this, _this.getValue());
	      }
	    }
	    _this2.updateDisplay();
	    _this2.__background.appendChild(_this2.__foreground);
	    _this2.domElement.appendChild(_this2.__background);
	    return _this2;
	  }
	  createClass$1(NumberControllerSlider, [{
	    key: 'updateDisplay',
	    value: function updateDisplay() {
	      var pct = (this.getValue() - this.__min) / (this.__max - this.__min);
	      this.__foreground.style.width = pct * 100 + '%';
	      return get$1(NumberControllerSlider.prototype.__proto__ || Object.getPrototypeOf(NumberControllerSlider.prototype), 'updateDisplay', this).call(this);
	    }
	  }]);
	  return NumberControllerSlider;
	}(NumberController$1);

	var FunctionController$1 = function (_Controller) {
	  inherits$1(FunctionController, _Controller);
	  function FunctionController(object, property, text) {
	    classCallCheck$1(this, FunctionController);
	    var _this2 = possibleConstructorReturn$1(this, (FunctionController.__proto__ || Object.getPrototypeOf(FunctionController)).call(this, object, property));
	    var _this = _this2;
	    _this2.__button = document.createElement('div');
	    _this2.__button.innerHTML = text === undefined ? 'Fire' : text;
	    dom$1.bind(_this2.__button, 'click', function (e) {
	      e.preventDefault();
	      _this.fire();
	      return false;
	    });
	    dom$1.addClass(_this2.__button, 'button');
	    _this2.domElement.appendChild(_this2.__button);
	    return _this2;
	  }
	  createClass$1(FunctionController, [{
	    key: 'fire',
	    value: function fire() {
	      if (this.__onChange) {
	        this.__onChange.call(this);
	      }
	      this.getValue().call(this.object);
	      if (this.__onFinishChange) {
	        this.__onFinishChange.call(this, this.getValue());
	      }
	    }
	  }]);
	  return FunctionController;
	}(Controller$1);

	var ColorController$1 = function (_Controller) {
	    inherits$1(ColorController, _Controller);
	    function ColorController(object, property) {
	        classCallCheck$1(this, ColorController);
	        var _this2 = possibleConstructorReturn$1(this, (ColorController.__proto__ || Object.getPrototypeOf(ColorController)).call(this, object, property));
	        _this2.__color = new Color$1(_this2.getValue());
	        _this2.__temp = new Color$1(0);
	        var _this = _this2;
	        _this2.domElement = document.createElement('div');
	        dom$1.makeSelectable(_this2.domElement, false);
	        _this2.__selector = document.createElement('div');
	        _this2.__selector.className = 'selector';
	        _this2.__saturation_field = document.createElement('div');
	        _this2.__saturation_field.className = 'saturation-field';
	        _this2.__field_knob = document.createElement('div');
	        _this2.__field_knob.className = 'field-knob';
	        _this2.__field_knob_border = '2px solid ';
	        _this2.__hue_knob = document.createElement('div');
	        _this2.__hue_knob.className = 'hue-knob';
	        _this2.__hue_field = document.createElement('div');
	        _this2.__hue_field.className = 'hue-field';
	        _this2.__input = document.createElement('input');
	        _this2.__input.type = 'text';
	        _this2.__input_textShadow = '0 1px 1px ';
	        dom$1.bind(_this2.__input, 'keydown', function (e) {
	            if (e.keyCode === 13) {
	                onBlur.call(this);
	            }
	        });
	        dom$1.bind(_this2.__input, 'blur', onBlur);
	        dom$1.bind(_this2.__selector, 'mousedown', function ()        {
	            dom$1.addClass(this, 'drag').bind(window, 'mouseup', function ()        {
	                dom$1.removeClass(_this.__selector, 'drag');
	            });
	        });
	        dom$1.bind(_this2.__selector, 'touchstart', function ()        {
	            dom$1.addClass(this, 'drag').bind(window, 'touchend', function ()        {
	                dom$1.removeClass(_this.__selector, 'drag');
	            });
	        });
	        var valueField = document.createElement('div');
	        Common$1.extend(_this2.__selector.style, {
	            width: '122px',
	            height: '102px',
	            padding: '3px',
	            backgroundColor: '#222',
	            boxShadow: '0px 1px 3px rgba(0,0,0,0.3)'
	        });
	        Common$1.extend(_this2.__field_knob.style, {
	            position: 'absolute',
	            width: '12px',
	            height: '12px',
	            border: _this2.__field_knob_border + (_this2.__color.v < 0.5 ? '#fff' : '#000'),
	            boxShadow: '0px 1px 3px rgba(0,0,0,0.5)',
	            borderRadius: '12px',
	            zIndex: 1
	        });
	        Common$1.extend(_this2.__hue_knob.style, {
	            position: 'absolute',
	            width: '15px',
	            height: '2px',
	            borderRight: '4px solid #fff',
	            zIndex: 1
	        });
	        Common$1.extend(_this2.__saturation_field.style, {
	            width: '100px',
	            height: '100px',
	            border: '1px solid #555',
	            marginRight: '3px',
	            display: 'inline-block',
	            cursor: 'pointer'
	        });
	        Common$1.extend(valueField.style, {
	            width: '100%',
	            height: '100%',
	            background: 'none'
	        });
	        linearGradient$1(valueField, 'top', 'rgba(0,0,0,0)', '#000');
	        Common$1.extend(_this2.__hue_field.style, {
	            width: '15px',
	            height: '100px',
	            border: '1px solid #555',
	            cursor: 'ns-resize',
	            position: 'absolute',
	            top: '3px',
	            right: '3px'
	        });
	        hueGradient$1(_this2.__hue_field);
	        Common$1.extend(_this2.__input.style, {
	            outline: 'none',
	            textAlign: 'center',
	            color: '#fff',
	            border: 0,
	            fontWeight: 'bold',
	            textShadow: _this2.__input_textShadow + 'rgba(0,0,0,0.7)'
	        });
	        dom$1.bind(_this2.__saturation_field, 'mousedown', fieldDown);
	        dom$1.bind(_this2.__saturation_field, 'touchstart', fieldDown);
	        dom$1.bind(_this2.__field_knob, 'mousedown', fieldDown);
	        dom$1.bind(_this2.__field_knob, 'touchstart', fieldDown);
	        dom$1.bind(_this2.__hue_field, 'mousedown', fieldDownH);
	        dom$1.bind(_this2.__hue_field, 'touchstart', fieldDownH);
	        function fieldDown(e) {
	            setSV(e);
	            dom$1.bind(window, 'mousemove', setSV);
	            dom$1.bind(window, 'touchmove', setSV);
	            dom$1.bind(window, 'mouseup', fieldUpSV);
	            dom$1.bind(window, 'touchend', fieldUpSV);
	        }
	        function fieldDownH(e) {
	            setH(e);
	            dom$1.bind(window, 'mousemove', setH);
	            dom$1.bind(window, 'touchmove', setH);
	            dom$1.bind(window, 'mouseup', fieldUpH);
	            dom$1.bind(window, 'touchend', fieldUpH);
	        }
	        function fieldUpSV() {
	            dom$1.unbind(window, 'mousemove', setSV);
	            dom$1.unbind(window, 'touchmove', setSV);
	            dom$1.unbind(window, 'mouseup', fieldUpSV);
	            dom$1.unbind(window, 'touchend', fieldUpSV);
	            onFinish();
	        }
	        function fieldUpH() {
	            dom$1.unbind(window, 'mousemove', setH);
	            dom$1.unbind(window, 'touchmove', setH);
	            dom$1.unbind(window, 'mouseup', fieldUpH);
	            dom$1.unbind(window, 'touchend', fieldUpH);
	            onFinish();
	        }
	        function onBlur() {
	            var i = interpret$1(this.value);
	            if (i !== false) {
	                _this.__color.__state = i;
	                _this.setValue(_this.__color.toOriginal());
	            } else {
	                this.value = _this.__color.toString();
	            }
	        }
	        function onFinish() {
	            if (_this.__onFinishChange) {
	                _this.__onFinishChange.call(_this, _this.__color.toOriginal());
	            }
	        }
	        _this2.__saturation_field.appendChild(valueField);
	        _this2.__selector.appendChild(_this2.__field_knob);
	        _this2.__selector.appendChild(_this2.__saturation_field);
	        _this2.__selector.appendChild(_this2.__hue_field);
	        _this2.__hue_field.appendChild(_this2.__hue_knob);
	        _this2.domElement.appendChild(_this2.__input);
	        _this2.domElement.appendChild(_this2.__selector);
	        _this2.updateDisplay();
	        function setSV(e) {
	            if (e.type.indexOf('touch') === -1) {
	                e.preventDefault();
	            }
	            var fieldRect = _this.__saturation_field.getBoundingClientRect();
	            var _ref = e.touches && e.touches[0] || e,
	                clientX = _ref.clientX,
	                clientY = _ref.clientY;
	            var s = (clientX - fieldRect.left) / (fieldRect.right - fieldRect.left);
	            var v = 1 - (clientY - fieldRect.top) / (fieldRect.bottom - fieldRect.top);
	            if (v > 1) {
	                v = 1;
	            } else if (v < 0) {
	                v = 0;
	            }
	            if (s > 1) {
	                s = 1;
	            } else if (s < 0) {
	                s = 0;
	            }
	            _this.__color.v = v;
	            _this.__color.s = s;
	            _this.setValue(_this.__color.toOriginal());
	            return false;
	        }
	        function setH(e) {
	            if (e.type.indexOf('touch') === -1) {
	                e.preventDefault();
	            }
	            var fieldRect = _this.__hue_field.getBoundingClientRect();
	            var _ref2 = e.touches && e.touches[0] || e,
	                clientY = _ref2.clientY;
	            var h = 1 - (clientY - fieldRect.top) / (fieldRect.bottom - fieldRect.top);
	            if (h > 1) {
	                h = 1;
	            } else if (h < 0) {
	                h = 0;
	            }
	            _this.__color.h = h * 360;
	            _this.setValue(_this.__color.toOriginal());
	            return false;
	        }
	        return _this2;
	    }
	    createClass$1(ColorController, [{
	        key: 'updateDisplay',
	        value: function updateDisplay() {
	            var i = interpret$1(this.getValue());
	            if (i !== false) {
	                var mismatch = false;
	                Common$1.each(Color$1.COMPONENTS, function (component) {
	                    if (!Common$1.isUndefined(i[component]) && !Common$1.isUndefined(this.__color.__state[component]) && i[component] !== this.__color.__state[component]) {
	                        mismatch = true;
	                        return {};
	                    }
	                }, this);
	                if (mismatch) {
	                    Common$1.extend(this.__color.__state, i);
	                }
	            }
	            Common$1.extend(this.__temp.__state, this.__color.__state);
	            this.__temp.a = 1;
	            var flip = this.__color.v < 0.5 || this.__color.s > 0.5 ? 255 : 0;
	            var _flip = 255 - flip;
	            Common$1.extend(this.__field_knob.style, {
	                marginLeft: 100 * this.__color.s - 7 + 'px',
	                marginTop: 100 * (1 - this.__color.v) - 7 + 'px',
	                backgroundColor: this.__temp.toHexString(),
	                border: this.__field_knob_border + 'rgb(' + flip + ',' + flip + ',' + flip + ')'
	            });
	            this.__hue_knob.style.marginTop = (1 - this.__color.h / 360) * 100 + 'px';
	            this.__temp.s = 1;
	            this.__temp.v = 1;
	            linearGradient$1(this.__saturation_field, 'left', '#fff', this.__temp.toHexString());
	            this.__input.value = this.__color.toString();
	            Common$1.extend(this.__input.style, {
	                backgroundColor: this.__color.toHexString(),
	                color: 'rgb(' + flip + ',' + flip + ',' + flip + ')',
	                textShadow: this.__input_textShadow + 'rgba(' + _flip + ',' + _flip + ',' + _flip + ',.7)'
	            });
	        }
	    }]);
	    return ColorController;
	}(Controller$1);
	var vendors$1 = ['-moz-', '-o-', '-webkit-', '-ms-', ''];
	function linearGradient$1(elem, x, a, b) {
	    elem.style.background = '';
	    Common$1.each(vendors$1, function (vendor) {
	        elem.style.cssText += 'background: ' + vendor + 'linear-gradient(' + x + ', ' + a + ' 0%, ' + b + ' 100%); ';
	    });
	}
	function hueGradient$1(elem) {
	    elem.style.background = '';
	    elem.style.cssText += 'background: -moz-linear-gradient(top,  #ff0000 0%, #ff00ff 17%, #0000ff 34%, #00ffff 50%, #00ff00 67%, #ffff00 84%, #ff0000 100%);';
	    elem.style.cssText += 'background: -webkit-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);';
	    elem.style.cssText += 'background: -o-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);';
	    elem.style.cssText += 'background: -ms-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);';
	    elem.style.cssText += 'background: linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);';
	}

	var ControllerFactory$1 = function ControllerFactory(object, property) {
	  var initialValue = object[property];
	  if (Common$1.isArray(arguments[2]) || Common$1.isObject(arguments[2])) {
	    return new OptionController$1(object, property, arguments[2]);
	  }
	  if (Common$1.isNumber(initialValue)) {
	    if (Common$1.isNumber(arguments[2]) && Common$1.isNumber(arguments[3])) {
	      if (Common$1.isNumber(arguments[4])) {
	        return new NumberControllerSlider$1(object, property, arguments[2], arguments[3], arguments[4], arguments[5]);
	      }
	      return new NumberControllerSlider$1(object, property, arguments[2], arguments[3]);
	    }
	    if (Common$1.isNumber(arguments[4])) {
	      return new NumberControllerBox$1(object, property, { min: arguments[2], max: arguments[3], step: arguments[4] });
	    }
	    return new NumberControllerBox$1(object, property, { min: arguments[2], max: arguments[3] });
	  }
	  if (Common$1.isString(initialValue)) {
	    return new StringController$1(object, property);
	  }
	  if (Common$1.isFunction(initialValue)) {
	    return new FunctionController$1(object, property, '');
	  }
	  if (Common$1.isBoolean(initialValue)) {
	    return new BooleanController$1(object, property);
	  }
	  return null;
	};

	var CustomController$1 = function (_Controller) {
	  inherits$1(CustomController, _Controller);
	  function CustomController(object, property) {
	    classCallCheck$1(this, CustomController);
	    var _this = possibleConstructorReturn$1(this, (CustomController.__proto__ || Object.getPrototypeOf(CustomController)).call(this, object, property));
	    _this.arguments = {
	      object: object, property: property, opts: Array.prototype.slice.call(arguments, 2)
	    };
	    if (object.property) _this.property = object.property(_this);
	    return _this;
	  }
	  createClass$1(CustomController, [{
	    key: 'controller',
	    set: function set$$1(newController) {
	      this._controller = newController;
	    },
	    get: function get$$1() {
	      return this._controller;
	    }
	  }]);
	  return CustomController;
	}(Controller$1);

	var css$1 = {
	  load: function load(url, indoc) {
	    var doc = indoc || document;
	    var link = doc.createElement('link');
	    link.type = 'text/css';
	    link.rel = 'stylesheet';
	    link.href = url;
	    doc.getElementsByTagName('head')[0].appendChild(link);
	  },
	  inject: function inject(cssContent, indoc) {
	    var doc = indoc || document;
	    var injected = document.createElement('style');
	    injected.type = 'text/css';
	    injected.innerHTML = cssContent;
	    var head = doc.getElementsByTagName('head')[0];
	    try {
	      head.appendChild(injected);
	    } catch (e) {
	    }
	  }
	};

	var saveDialogContents$1 = "<div id=\"dg-save\" class=\"dg dialogue\">\n\n  Here's the new load parameter for your <code>GUI</code>'s constructor:\n\n  <textarea id=\"dg-new-constructor\"></textarea>\n\n  <div id=\"dg-save-locally\">\n\n    <input id=\"dg-local-storage\" type=\"checkbox\"/> Automatically save\n    values to <code>localStorage</code> on exit.\n\n    <div id=\"dg-local-explain\">The values saved to <code>localStorage</code> will\n      override those passed to <code>dat.GUI</code>'s constructor. This makes it\n      easier to work incrementally, but <code>localStorage</code> is fragile,\n      and your friends may not see the same values you do.\n\n    </div>\n\n  </div>\n\n</div>";

	function requestAnimationFrame$2(callback) {
	  setTimeout(callback, 1000 / 60);
	}
	var requestAnimationFrame$1$1 = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || requestAnimationFrame$2;

	var CenteredDiv$1 = function () {
	  function CenteredDiv() {
	    classCallCheck$1(this, CenteredDiv);
	    this.backgroundElement = document.createElement('div');
	    Common$1.extend(this.backgroundElement.style, {
	      backgroundColor: 'rgba(0,0,0,0.8)',
	      top: 0,
	      left: 0,
	      display: 'none',
	      zIndex: '1000',
	      opacity: 0,
	      WebkitTransition: 'opacity 0.2s linear',
	      transition: 'opacity 0.2s linear'
	    });
	    dom$1.makeFullscreen(this.backgroundElement);
	    this.backgroundElement.style.position = 'fixed';
	    this.domElement = document.createElement('div');
	    Common$1.extend(this.domElement.style, {
	      position: 'fixed',
	      display: 'none',
	      zIndex: '1001',
	      opacity: 0,
	      WebkitTransition: '-webkit-transform 0.2s ease-out, opacity 0.2s linear',
	      transition: 'transform 0.2s ease-out, opacity 0.2s linear'
	    });
	    document.body.appendChild(this.backgroundElement);
	    document.body.appendChild(this.domElement);
	    var _this = this;
	    dom$1.bind(this.backgroundElement, 'click', function () {
	      _this.hide();
	    });
	  }
	  createClass$1(CenteredDiv, [{
	    key: 'show',
	    value: function show() {
	      var _this = this;
	      this.backgroundElement.style.display = 'block';
	      this.domElement.style.display = 'block';
	      this.domElement.style.opacity = 0;
	      this.domElement.style.webkitTransform = 'scale(1.1)';
	      this.layout();
	      Common$1.defer(function () {
	        _this.backgroundElement.style.opacity = 1;
	        _this.domElement.style.opacity = 1;
	        _this.domElement.style.webkitTransform = 'scale(1)';
	      });
	    }
	  }, {
	    key: 'hide',
	    value: function hide() {
	      var _this = this;
	      var hide = function hide() {
	        _this.domElement.style.display = 'none';
	        _this.backgroundElement.style.display = 'none';
	        dom$1.unbind(_this.domElement, 'webkitTransitionEnd', hide);
	        dom$1.unbind(_this.domElement, 'transitionend', hide);
	        dom$1.unbind(_this.domElement, 'oTransitionEnd', hide);
	      };
	      dom$1.bind(this.domElement, 'webkitTransitionEnd', hide);
	      dom$1.bind(this.domElement, 'transitionend', hide);
	      dom$1.bind(this.domElement, 'oTransitionEnd', hide);
	      this.backgroundElement.style.opacity = 0;
	      this.domElement.style.opacity = 0;
	      this.domElement.style.webkitTransform = 'scale(1.1)';
	    }
	  }, {
	    key: 'layout',
	    value: function layout() {
	      this.domElement.style.left = window.innerWidth / 2 - dom$1.getWidth(this.domElement) / 2 + 'px';
	      this.domElement.style.top = window.innerHeight / 2 - dom$1.getHeight(this.domElement) / 2 + 'px';
	    }
	  }]);
	  return CenteredDiv;
	}();

	var styleSheet$1 = ___$insertStyle$1(".dg ul{list-style:none;margin:0;padding:0;width:100%;clear:both}.dg.ac{position:fixed;top:0;left:0;right:0;height:0;z-index:0}.dg:not(.ac) .main{overflow:hidden}.dg.main{-webkit-transition:opacity .1s linear;-o-transition:opacity .1s linear;-moz-transition:opacity .1s linear;transition:opacity .1s linear}.dg.main.taller-than-window{overflow-y:auto}.dg.main.taller-than-window .close-button{opacity:1;margin-top:-1px;border-top:1px solid #2c2c2c}.dg.main ul.closed .close-button{opacity:1 !important}.dg.main:hover .close-button,.dg.main .close-button.drag{opacity:1}.dg.main .close-button{-webkit-transition:opacity .1s linear;-o-transition:opacity .1s linear;-moz-transition:opacity .1s linear;transition:opacity .1s linear;border:0;line-height:19px;height:20px;cursor:pointer;text-align:center;background-color:#000}.dg.main .close-button.close-top{position:relative}.dg.main .close-button.close-bottom{position:absolute}.dg.main .close-button:hover{background-color:#111}.dg.a{float:right;margin-right:15px;overflow-y:visible}.dg.a.has-save>ul.close-top{margin-top:0}.dg.a.has-save>ul.close-bottom{margin-top:27px}.dg.a.has-save>ul.closed{margin-top:0}.dg.a .save-row{top:0;z-index:1002}.dg.a .save-row.close-top{position:relative}.dg.a .save-row.close-bottom{position:fixed}.dg li{-webkit-transition:height .1s ease-out;-o-transition:height .1s ease-out;-moz-transition:height .1s ease-out;transition:height .1s ease-out;-webkit-transition:overflow .1s linear;-o-transition:overflow .1s linear;-moz-transition:overflow .1s linear;transition:overflow .1s linear}.dg li:not(.folder){cursor:auto;height:27px;line-height:27px;padding:0 4px 0 5px}.dg li.folder{padding:0;border-left:4px solid rgba(0,0,0,0)}.dg li.title{cursor:pointer;margin-left:-4px}.dg .closed li:not(.title),.dg .closed ul li,.dg .closed ul li>*{height:0;overflow:hidden;border:0}.dg .cr{clear:both;padding-left:3px;height:27px;overflow:hidden}.dg .property-name{cursor:default;float:left;clear:left;width:40%;overflow:hidden;text-overflow:ellipsis}.dg .c{float:left;width:60%;position:relative}.dg .c input[type=text]{border:0;margin-top:4px;padding:3px;width:100%;float:right}.dg .has-slider input[type=text]{width:30%;margin-left:0}.dg .slider{float:left;width:66%;margin-left:-5px;margin-right:0;height:19px;margin-top:4px}.dg .slider-fg{height:100%}.dg .c input[type=checkbox]{margin-top:7px}.dg .c select{margin-top:5px}.dg .cr.function,.dg .cr.function .property-name,.dg .cr.function *,.dg .cr.boolean,.dg .cr.boolean *{cursor:pointer}.dg .cr.color{overflow:visible}.dg .selector{display:none;position:absolute;margin-left:-9px;margin-top:23px;z-index:10}.dg .c:hover .selector,.dg .selector.drag{display:block}.dg li.save-row{padding:0}.dg li.save-row .button{display:inline-block;padding:0px 6px}.dg.dialogue{background-color:#222;width:460px;padding:15px;font-size:13px;line-height:15px}#dg-new-constructor{padding:10px;color:#222;font-family:Monaco, monospace;font-size:10px;border:0;resize:none;box-shadow:inset 1px 1px 1px #888;word-wrap:break-word;margin:12px 0;display:block;width:440px;overflow-y:scroll;height:100px;position:relative}#dg-local-explain{display:none;font-size:11px;line-height:17px;border-radius:3px;background-color:#333;padding:8px;margin-top:10px}#dg-local-explain code{font-size:10px}#dat-gui-save-locally{display:none}.dg{color:#eee;font:11px 'Lucida Grande', sans-serif;text-shadow:0 -1px 0 #111}.dg.main::-webkit-scrollbar{width:5px;background:#1a1a1a}.dg.main::-webkit-scrollbar-corner{height:0;display:none}.dg.main::-webkit-scrollbar-thumb{border-radius:5px;background:#676767}.dg li:not(.folder){background:#1a1a1a;border-bottom:1px solid #2c2c2c}.dg li.save-row{line-height:25px;background:#dad5cb;border:0}.dg li.save-row select{margin-left:5px;width:108px}.dg li.save-row .button{margin-left:5px;margin-top:1px;border-radius:2px;font-size:9px;line-height:7px;padding:4px 4px 5px 4px;background:#c5bdad;color:#fff;text-shadow:0 1px 0 #b0a58f;box-shadow:0 -1px 0 #b0a58f;cursor:pointer}.dg li.save-row .button.gears{background:#c5bdad url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAANCAYAAAB/9ZQ7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAQJJREFUeNpiYKAU/P//PwGIC/ApCABiBSAW+I8AClAcgKxQ4T9hoMAEUrxx2QSGN6+egDX+/vWT4e7N82AMYoPAx/evwWoYoSYbACX2s7KxCxzcsezDh3evFoDEBYTEEqycggWAzA9AuUSQQgeYPa9fPv6/YWm/Acx5IPb7ty/fw+QZblw67vDs8R0YHyQhgObx+yAJkBqmG5dPPDh1aPOGR/eugW0G4vlIoTIfyFcA+QekhhHJhPdQxbiAIguMBTQZrPD7108M6roWYDFQiIAAv6Aow/1bFwXgis+f2LUAynwoIaNcz8XNx3Dl7MEJUDGQpx9gtQ8YCueB+D26OECAAQDadt7e46D42QAAAABJRU5ErkJggg==) 2px 1px no-repeat;height:7px;width:8px}.dg li.save-row .button:hover{background-color:#bab19e;box-shadow:0 -1px 0 #b0a58f}.dg li.folder{border-bottom:0}.dg li.title{padding-left:16px;background:#000 url(data:image/gif;base64,R0lGODlhBQAFAJEAAP////Pz8////////yH5BAEAAAIALAAAAAAFAAUAAAIIlI+hKgFxoCgAOw==) 6px 10px no-repeat;cursor:pointer;border-bottom:1px solid rgba(255,255,255,0.2)}.dg .closed li.title{background-image:url(data:image/gif;base64,R0lGODlhBQAFAJEAAP////Pz8////////yH5BAEAAAIALAAAAAAFAAUAAAIIlGIWqMCbWAEAOw==)}.dg .cr.boolean{border-left:3px solid #806787}.dg .cr.color{border-left:3px solid}.dg .cr.function{border-left:3px solid #e61d5f}.dg .cr.number{border-left:3px solid #2FA1D6}.dg .cr.number input[type=text]{color:#2FA1D6}.dg .cr.string{border-left:3px solid #1ed36f}.dg .cr.string input[type=text]{color:#1ed36f}.dg .cr.function:hover,.dg .cr.boolean:hover{background:#111}.dg .c input[type=text]{background:#303030;outline:none}.dg .c input[type=text]:hover{background:#3c3c3c}.dg .c input[type=text]:focus{background:#494949;color:#fff}.dg .c .slider{background:#303030;cursor:ew-resize}.dg .c .slider-fg{background:#2FA1D6;max-width:100%}.dg .c .slider:hover{background:#3c3c3c}.dg .c .slider:hover .slider-fg{background:#44abda}\n");

	css$1.inject(styleSheet$1);
	var CSS_NAMESPACE$1 = 'dg';
	var HIDE_KEY_CODE$1 = 72;
	var CLOSE_BUTTON_HEIGHT$1 = 20;
	var DEFAULT_DEFAULT_PRESET_NAME$1 = 'Default';
	var SUPPORTS_LOCAL_STORAGE$1 = function () {
	  try {
	    return !!window.localStorage;
	  } catch (e) {
	    return false;
	  }
	}();
	var SAVE_DIALOGUE$1 = void 0;
	var autoPlaceVirgin$1 = true;
	var autoPlaceContainer$1 = void 0;
	var hide$1 = false;
	var hideableGuis$1 = [];
	var GUI$1 = function GUI(pars) {
	  var _this = this;
	  var params = pars || {};
	  this.domElement = document.createElement('div');
	  this.__ul = document.createElement('ul');
	  this.domElement.appendChild(this.__ul);
	  dom$1.addClass(this.domElement, CSS_NAMESPACE$1);
	  this.__folders = {};
	  this.__controllers = [];
	  this.__rememberedObjects = [];
	  this.__rememberedObjectIndecesToControllers = [];
	  this.__listening = [];
	  params = Common$1.defaults(params, {
	    closeOnTop: false,
	    autoPlace: true,
	    width: GUI.DEFAULT_WIDTH
	  });
	  params = Common$1.defaults(params, {
	    resizable: params.autoPlace,
	    hideable: params.autoPlace
	  });
	  if (!Common$1.isUndefined(params.load)) {
	    if (params.preset) {
	      params.load.preset = params.preset;
	    }
	  } else {
	    params.load = { preset: DEFAULT_DEFAULT_PRESET_NAME$1 };
	  }
	  if (Common$1.isUndefined(params.parent) && params.hideable) {
	    hideableGuis$1.push(this);
	  }
	  params.resizable = Common$1.isUndefined(params.parent) && params.resizable;
	  if (params.autoPlace && Common$1.isUndefined(params.scrollable)) {
	    params.scrollable = true;
	  }
	  var useLocalStorage = SUPPORTS_LOCAL_STORAGE$1 && localStorage.getItem(getLocalStorageHash$1(this, 'isLocal')) === 'true';
	  var saveToLocalStorage = void 0;
	  var titleRow = void 0;
	  Object.defineProperties(this,
	  {
	    parent: {
	      get: function get$$1() {
	        return params.parent;
	      }
	    },
	    scrollable: {
	      get: function get$$1() {
	        return params.scrollable;
	      }
	    },
	    autoPlace: {
	      get: function get$$1() {
	        return params.autoPlace;
	      }
	    },
	    closeOnTop: {
	      get: function get$$1() {
	        return params.closeOnTop;
	      }
	    },
	    preset: {
	      get: function get$$1() {
	        if (_this.parent) {
	          return _this.getRoot().preset;
	        }
	        return params.load.preset;
	      },
	      set: function set$$1(v) {
	        if (_this.parent) {
	          _this.getRoot().preset = v;
	        } else {
	          params.load.preset = v;
	        }
	        setPresetSelectIndex$1(this);
	        _this.revert();
	      }
	    },
	    width: {
	      get: function get$$1() {
	        return params.width;
	      },
	      set: function set$$1(v) {
	        params.width = v;
	        setWidth$1(_this, v);
	      }
	    },
	    name: {
	      get: function get$$1() {
	        return params.name;
	      },
	      set: function set$$1(v) {
	        params.name = v;
	        if (titleRow) {
	          titleRow.innerHTML = params.name;
	        }
	      }
	    },
	    closed: {
	      get: function get$$1() {
	        return params.closed;
	      },
	      set: function set$$1(v) {
	        params.closed = v;
	        if (params.closed) {
	          dom$1.addClass(_this.__ul, GUI.CLASS_CLOSED);
	        } else {
	          dom$1.removeClass(_this.__ul, GUI.CLASS_CLOSED);
	        }
	        this.onResize();
	        if (_this.__closeButton) {
	          _this.__closeButton.innerHTML = v ? GUI.TEXT_OPEN : GUI.TEXT_CLOSED;
	        }
	      }
	    },
	    load: {
	      get: function get$$1() {
	        return params.load;
	      }
	    },
	    useLocalStorage: {
	      get: function get$$1() {
	        return useLocalStorage;
	      },
	      set: function set$$1(bool) {
	        if (SUPPORTS_LOCAL_STORAGE$1) {
	          useLocalStorage = bool;
	          if (bool) {
	            dom$1.bind(window, 'unload', saveToLocalStorage);
	          } else {
	            dom$1.unbind(window, 'unload', saveToLocalStorage);
	          }
	          localStorage.setItem(getLocalStorageHash$1(_this, 'isLocal'), bool);
	        }
	      }
	    }
	  });
	  if (Common$1.isUndefined(params.parent)) {
	    this.closed = params.closed || false;
	    dom$1.addClass(this.domElement, GUI.CLASS_MAIN);
	    dom$1.makeSelectable(this.domElement, false);
	    if (SUPPORTS_LOCAL_STORAGE$1) {
	      if (useLocalStorage) {
	        _this.useLocalStorage = true;
	        var savedGui = localStorage.getItem(getLocalStorageHash$1(this, 'gui'));
	        if (savedGui) {
	          params.load = JSON.parse(savedGui);
	        }
	      }
	    }
	    this.__closeButton = document.createElement('div');
	    this.__closeButton.innerHTML = GUI.TEXT_CLOSED;
	    dom$1.addClass(this.__closeButton, GUI.CLASS_CLOSE_BUTTON);
	    if (params.closeOnTop) {
	      dom$1.addClass(this.__closeButton, GUI.CLASS_CLOSE_TOP);
	      this.domElement.insertBefore(this.__closeButton, this.domElement.childNodes[0]);
	    } else {
	      dom$1.addClass(this.__closeButton, GUI.CLASS_CLOSE_BOTTOM);
	      this.domElement.appendChild(this.__closeButton);
	    }
	    dom$1.bind(this.__closeButton, 'click', function () {
	      _this.closed = !_this.closed;
	    });
	  } else {
	    if (params.closed === undefined) {
	      params.closed = true;
	    }
	    var titleRowName = document.createTextNode(params.name);
	    dom$1.addClass(titleRowName, 'controller-name');
	    titleRow = addRow$1(_this, titleRowName);
	    var onClickTitle = function onClickTitle(e) {
	      e.preventDefault();
	      _this.closed = !_this.closed;
	      return false;
	    };
	    dom$1.addClass(this.__ul, GUI.CLASS_CLOSED);
	    dom$1.addClass(titleRow, 'title');
	    dom$1.bind(titleRow, 'click', onClickTitle);
	    if (!params.closed) {
	      this.closed = false;
	    }
	  }
	  if (params.autoPlace) {
	    if (Common$1.isUndefined(params.parent)) {
	      if (autoPlaceVirgin$1) {
	        autoPlaceContainer$1 = document.createElement('div');
	        dom$1.addClass(autoPlaceContainer$1, CSS_NAMESPACE$1);
	        dom$1.addClass(autoPlaceContainer$1, GUI.CLASS_AUTO_PLACE_CONTAINER);
	        document.body.appendChild(autoPlaceContainer$1);
	        autoPlaceVirgin$1 = false;
	      }
	      autoPlaceContainer$1.appendChild(this.domElement);
	      dom$1.addClass(this.domElement, GUI.CLASS_AUTO_PLACE);
	    }
	    if (!this.parent) {
	      setWidth$1(_this, params.width);
	    }
	  }
	  this.__resizeHandler = function () {
	    _this.onResizeDebounced();
	  };
	  dom$1.bind(window, 'resize', this.__resizeHandler);
	  dom$1.bind(this.__ul, 'webkitTransitionEnd', this.__resizeHandler);
	  dom$1.bind(this.__ul, 'transitionend', this.__resizeHandler);
	  dom$1.bind(this.__ul, 'oTransitionEnd', this.__resizeHandler);
	  this.onResize();
	  if (params.resizable) {
	    addResizeHandle$1(this);
	  }
	  saveToLocalStorage = function saveToLocalStorage() {
	    if (SUPPORTS_LOCAL_STORAGE$1 && localStorage.getItem(getLocalStorageHash$1(_this, 'isLocal')) === 'true') {
	      localStorage.setItem(getLocalStorageHash$1(_this, 'gui'), JSON.stringify(_this.getSaveObject()));
	    }
	  };
	  this.saveToLocalStorageIfPossible = saveToLocalStorage;
	  function resetWidth() {
	    var root = _this.getRoot();
	    root.width += 1;
	    Common$1.defer(function () {
	      root.width -= 1;
	    });
	  }
	  if (!params.parent) {
	    resetWidth();
	  }
	};
	GUI$1.toggleHide = function () {
	  hide$1 = !hide$1;
	  Common$1.each(hideableGuis$1, function (gui) {
	    gui.domElement.style.display = hide$1 ? 'none' : '';
	  });
	};
	GUI$1.CLASS_AUTO_PLACE = 'a';
	GUI$1.CLASS_AUTO_PLACE_CONTAINER = 'ac';
	GUI$1.CLASS_MAIN = 'main';
	GUI$1.CLASS_CONTROLLER_ROW = 'cr';
	GUI$1.CLASS_TOO_TALL = 'taller-than-window';
	GUI$1.CLASS_CLOSED = 'closed';
	GUI$1.CLASS_CLOSE_BUTTON = 'close-button';
	GUI$1.CLASS_CLOSE_TOP = 'close-top';
	GUI$1.CLASS_CLOSE_BOTTOM = 'close-bottom';
	GUI$1.CLASS_DRAG = 'drag';
	GUI$1.DEFAULT_WIDTH = 245;
	GUI$1.TEXT_CLOSED = 'Close Controls';
	GUI$1.TEXT_OPEN = 'Open Controls';
	GUI$1._keydownHandler = function (e) {
	  if (document.activeElement.type !== 'text' && (e.which === HIDE_KEY_CODE$1 || e.keyCode === HIDE_KEY_CODE$1)) {
	    GUI$1.toggleHide();
	  }
	};
	dom$1.bind(window, 'keydown', GUI$1._keydownHandler, false);
	Common$1.extend(GUI$1.prototype,
	{
	  add: function add(object, property) {
	    return _add$1(this, object, property, {
	      factoryArgs: Array.prototype.slice.call(arguments, 2)
	    });
	  },
	  addColor: function addColor(object, property) {
	    return _add$1(this, object, property, {
	      color: true
	    });
	  },
	  remove: function remove(controller) {
	    this.__ul.removeChild(controller.__li);
	    this.__controllers.splice(this.__controllers.indexOf(controller), 1);
	    var _this = this;
	    Common$1.defer(function () {
	      _this.onResize();
	    });
	  },
	  destroy: function destroy() {
	    if (this.parent) {
	      throw new Error('Only the root GUI should be removed with .destroy(). ' + 'For subfolders, use gui.removeFolder(folder) instead.');
	    }
	    if (this.autoPlace) {
	      autoPlaceContainer$1.removeChild(this.domElement);
	    }
	    var _this = this;
	    Common$1.each(this.__folders, function (subfolder) {
	      _this.removeFolder(subfolder);
	    });
	    dom$1.unbind(window, 'keydown', GUI$1._keydownHandler, false);
	    removeListeners$1(this);
	  },
	  addFolder: function addFolder(name) {
	    if (this.__folders[name] !== undefined) {
	      throw new Error('You already have a folder in this GUI by the' + ' name "' + name + '"');
	    }
	    var newGuiParams = { name: name, parent: this };
	    newGuiParams.autoPlace = this.autoPlace;
	    if (this.load &&
	    this.load.folders &&
	    this.load.folders[name]) {
	      newGuiParams.closed = this.load.folders[name].closed;
	      newGuiParams.load = this.load.folders[name];
	    }
	    var gui = new GUI$1(newGuiParams);
	    this.__folders[name] = gui;
	    var li = addRow$1(this, gui.domElement);
	    dom$1.addClass(li, 'folder');
	    return gui;
	  },
	  removeFolder: function removeFolder(folder) {
	    this.__ul.removeChild(folder.domElement.parentElement);
	    delete this.__folders[folder.name];
	    if (this.load &&
	    this.load.folders &&
	    this.load.folders[folder.name]) {
	      delete this.load.folders[folder.name];
	    }
	    removeListeners$1(folder);
	    var _this = this;
	    Common$1.each(folder.__folders, function (subfolder) {
	      folder.removeFolder(subfolder);
	    });
	    Common$1.defer(function () {
	      _this.onResize();
	    });
	  },
	  open: function open() {
	    this.closed = false;
	  },
	  close: function close() {
	    this.closed = true;
	  },
	  hide: function hide() {
	    this.domElement.style.display = 'none';
	  },
	  show: function show() {
	    this.domElement.style.display = '';
	  },
	  onResize: function onResize() {
	    var root = this.getRoot();
	    if (root.scrollable) {
	      var top = dom$1.getOffset(root.__ul).top;
	      var h = 0;
	      Common$1.each(root.__ul.childNodes, function (node) {
	        if (!(root.autoPlace && node === root.__save_row)) {
	          h += dom$1.getHeight(node);
	        }
	      });
	      if (window.innerHeight - top - CLOSE_BUTTON_HEIGHT$1 < h) {
	        dom$1.addClass(root.domElement, GUI$1.CLASS_TOO_TALL);
	        root.__ul.style.height = window.innerHeight - top - CLOSE_BUTTON_HEIGHT$1 + 'px';
	      } else {
	        dom$1.removeClass(root.domElement, GUI$1.CLASS_TOO_TALL);
	        root.__ul.style.height = 'auto';
	      }
	    }
	    if (root.__resize_handle) {
	      Common$1.defer(function () {
	        root.__resize_handle.style.height = root.__ul.offsetHeight + 'px';
	      });
	    }
	    if (root.__closeButton) {
	      root.__closeButton.style.width = root.width + 'px';
	    }
	  },
	  onResizeDebounced: Common$1.debounce(function () {
	    this.onResize();
	  }, 50),
	  remember: function remember() {
	    if (Common$1.isUndefined(SAVE_DIALOGUE$1)) {
	      SAVE_DIALOGUE$1 = new CenteredDiv$1();
	      SAVE_DIALOGUE$1.domElement.innerHTML = saveDialogContents$1;
	    }
	    if (this.parent) {
	      throw new Error('You can only call remember on a top level GUI.');
	    }
	    var _this = this;
	    Common$1.each(Array.prototype.slice.call(arguments), function (object) {
	      if (_this.__rememberedObjects.length === 0) {
	        addSaveMenu$1(_this);
	      }
	      if (_this.__rememberedObjects.indexOf(object) === -1) {
	        _this.__rememberedObjects.push(object);
	      }
	    });
	    if (this.autoPlace) {
	      setWidth$1(this, this.width);
	    }
	  },
	  getRoot: function getRoot() {
	    var gui = this;
	    while (gui.parent) {
	      gui = gui.parent;
	    }
	    return gui;
	  },
	  getSaveObject: function getSaveObject() {
	    var toReturn = this.load;
	    toReturn.closed = this.closed;
	    if (this.__rememberedObjects.length > 0) {
	      toReturn.preset = this.preset;
	      if (!toReturn.remembered) {
	        toReturn.remembered = {};
	      }
	      toReturn.remembered[this.preset] = getCurrentPreset$1(this);
	    }
	    toReturn.folders = {};
	    Common$1.each(this.__folders, function (element, key) {
	      toReturn.folders[key] = element.getSaveObject();
	    });
	    return toReturn;
	  },
	  save: function save() {
	    if (!this.load.remembered) {
	      this.load.remembered = {};
	    }
	    this.load.remembered[this.preset] = getCurrentPreset$1(this);
	    markPresetModified$1(this, false);
	    this.saveToLocalStorageIfPossible();
	  },
	  saveAs: function saveAs(presetName) {
	    if (!this.load.remembered) {
	      this.load.remembered = {};
	      this.load.remembered[DEFAULT_DEFAULT_PRESET_NAME$1] = getCurrentPreset$1(this, true);
	    }
	    this.load.remembered[presetName] = getCurrentPreset$1(this);
	    this.preset = presetName;
	    addPresetOption$1(this, presetName, true);
	    this.saveToLocalStorageIfPossible();
	  },
	  revert: function revert(gui) {
	    Common$1.each(this.__controllers, function (controller) {
	      if (!this.getRoot().load.remembered) {
	        controller.setValue(controller.initialValue);
	      } else {
	        recallSavedValue$1(gui || this.getRoot(), controller);
	      }
	      if (controller.__onFinishChange) {
	        controller.__onFinishChange.call(controller, controller.getValue());
	      }
	    }, this);
	    Common$1.each(this.__folders, function (folder) {
	      folder.revert(folder);
	    });
	    if (!gui) {
	      markPresetModified$1(this.getRoot(), false);
	    }
	  },
	  listen: function listen(controller) {
	    var init = this.__listening.length === 0;
	    this.__listening.push(controller);
	    if (init) {
	      updateDisplays$1(this.__listening);
	    }
	  },
	  updateDisplay: function updateDisplay() {
	    Common$1.each(this.__controllers, function (controller) {
	      controller.updateDisplay();
	    });
	    Common$1.each(this.__folders, function (folder) {
	      folder.updateDisplay();
	    });
	  }
	});
	function addRow$1(gui, newDom, liBefore) {
	  var li = document.createElement('li');
	  if (newDom) {
	    li.appendChild(newDom);
	  }
	  if (liBefore) {
	    gui.__ul.insertBefore(li, liBefore);
	  } else {
	    gui.__ul.appendChild(li);
	  }
	  gui.onResize();
	  return li;
	}
	function removeListeners$1(gui) {
	  dom$1.unbind(window, 'resize', gui.__resizeHandler);
	  if (gui.saveToLocalStorageIfPossible) {
	    dom$1.unbind(window, 'unload', gui.saveToLocalStorageIfPossible);
	  }
	}
	function markPresetModified$1(gui, modified) {
	  var opt = gui.__preset_select[gui.__preset_select.selectedIndex];
	  if (modified) {
	    opt.innerHTML = opt.value + '*';
	  } else {
	    opt.innerHTML = opt.value;
	  }
	}
	function augmentController$1(gui, li, controller) {
	  controller.__li = li;
	  controller.__gui = gui;
	  Common$1.extend(controller,                                   {
	    options: function options(_options) {
	      if (arguments.length > 1) {
	        var nextSibling = controller.__li.nextElementSibling;
	        controller.remove();
	        return _add$1(gui, controller.object, controller.property, {
	          before: nextSibling,
	          factoryArgs: [Common$1.toArray(arguments)]
	        });
	      }
	      if (Common$1.isArray(_options) || Common$1.isObject(_options)) {
	        var _nextSibling = controller.__li.nextElementSibling;
	        controller.remove();
	        return _add$1(gui, controller.object, controller.property, {
	          before: _nextSibling,
	          factoryArgs: [_options]
	        });
	      }
	    },
	    name: function name(_name) {
	      controller.__li.firstElementChild.firstElementChild.innerHTML = _name;
	      return controller;
	    },
	    listen: function listen() {
	      controller.__gui.listen(controller);
	      return controller;
	    },
	    remove: function remove() {
	      controller.__gui.remove(controller);
	      return controller;
	    }
	  });
	  if (controller instanceof NumberControllerSlider$1) {
	    var box = new NumberControllerBox$1(controller.object, controller.property, { min: controller.__min, max: controller.__max, step: controller.__step });
	    Common$1.each(['updateDisplay', 'onChange', 'onFinishChange', 'step', 'min', 'max'], function (method) {
	      var pc = controller[method];
	      var pb = box[method];
	      controller[method] = box[method] = function () {
	        var args = Array.prototype.slice.call(arguments);
	        pb.apply(box, args);
	        return pc.apply(controller, args);
	      };
	    });
	    dom$1.addClass(li, 'has-slider');
	    controller.domElement.insertBefore(box.domElement, controller.domElement.firstElementChild);
	  } else if (controller instanceof NumberControllerBox$1) {
	    var r = function r(returned) {
	      if (Common$1.isNumber(controller.__min) && Common$1.isNumber(controller.__max)) {
	        var oldName = controller.__li.firstElementChild.firstElementChild.innerHTML;
	        var wasListening = controller.__gui.__listening.indexOf(controller) > -1;
	        controller.remove();
	        var newController = _add$1(gui, controller.object, controller.property, {
	          before: controller.__li.nextElementSibling,
	          factoryArgs: [controller.__min, controller.__max, controller.__step]
	        });
	        newController.name(oldName);
	        if (wasListening) newController.listen();
	        return newController;
	      }
	      return returned;
	    };
	    controller.min = Common$1.compose(r, controller.min);
	    controller.max = Common$1.compose(r, controller.max);
	  } else if (controller instanceof BooleanController$1) {
	    dom$1.bind(li, 'click', function () {
	      dom$1.fakeEvent(controller.__checkbox, 'click');
	    });
	    dom$1.bind(controller.__checkbox, 'click', function (e) {
	      e.stopPropagation();
	    });
	  } else if (controller instanceof FunctionController$1) {
	    dom$1.bind(li, 'click', function () {
	      dom$1.fakeEvent(controller.__button, 'click');
	    });
	    dom$1.bind(li, 'mouseover', function () {
	      dom$1.addClass(controller.__button, 'hover');
	    });
	    dom$1.bind(li, 'mouseout', function () {
	      dom$1.removeClass(controller.__button, 'hover');
	    });
	  } else if (controller instanceof ColorController$1) {
	    dom$1.addClass(li, 'color');
	    controller.updateDisplay = Common$1.compose(function (val) {
	      li.style.borderLeftColor = controller.__color.toString();
	      return val;
	    }, controller.updateDisplay);
	    controller.updateDisplay();
	  }
	  controller.setValue = Common$1.compose(function (val) {
	    if (gui.getRoot().__preset_select && controller.isModified()) {
	      markPresetModified$1(gui.getRoot(), true);
	    }
	    return val;
	  }, controller.setValue);
	}
	function recallSavedValue$1(gui, controller) {
	  var root = gui.getRoot();
	  var matchedIndex = root.__rememberedObjects.indexOf(controller.object);
	  if (matchedIndex !== -1) {
	    var controllerMap = root.__rememberedObjectIndecesToControllers[matchedIndex];
	    if (controllerMap === undefined) {
	      controllerMap = {};
	      root.__rememberedObjectIndecesToControllers[matchedIndex] = controllerMap;
	    }
	    controllerMap[controller.property] = controller;
	    if (root.load && root.load.remembered) {
	      var presetMap = root.load.remembered;
	      var preset = void 0;
	      if (presetMap[gui.preset]) {
	        preset = presetMap[gui.preset];
	      } else if (presetMap[DEFAULT_DEFAULT_PRESET_NAME$1]) {
	        preset = presetMap[DEFAULT_DEFAULT_PRESET_NAME$1];
	      } else {
	        return;
	      }
	      if (preset[matchedIndex] && preset[matchedIndex][controller.property] !== undefined) {
	        var value = preset[matchedIndex][controller.property];
	        controller.initialValue = value;
	        controller.setValue(value);
	      }
	    }
	  }
	}
	function _add$1(gui, object, property, params) {
	  var customObject;
	  if (object.arguments) {
	    customObject = object;
	    object = customObject.arguments.object;
	    property = customObject.arguments.property;
	    params = {
	      factoryArgs: customObject.arguments.opts
	    };
	  }
	  if (customObject === undefined && object[property] === undefined) {
	    throw new Error('Object "' + object + '" has no property "' + property + '"');
	  }
	  var controller = void 0;
	  if (params.color) {
	    controller = new ColorController$1(object, property);
	  } else if (customObject !== undefined && typeof customObject.property === "string") {
	    controller = customObject;
	  } else {
	    var factoryArgs = [object, property].concat(params.factoryArgs);
	    controller = ControllerFactory$1.apply(gui, factoryArgs);
	  }
	  if (controller === null) controller = customObject;else if (customObject !== undefined) customObject.controller = controller;
	  if (params.before instanceof Controller$1) {
	    params.before = params.before.__li;
	  }
	  recallSavedValue$1(gui, controller);
	  dom$1.addClass(controller.domElement, 'c');
	  var name = document.createElement('span');
	  dom$1.addClass(name, 'property-name');
	  if (customObject !== undefined && _typeof$1(customObject.property) === "object") {
	    for (var propertyName in customObject.property) {
	      name.appendChild(customObject.property[propertyName]);
	    }
	  } else name.innerHTML = controller.property;
	  var container = document.createElement('div');
	  container.appendChild(name);
	  container.appendChild(controller.domElement);
	  var li = addRow$1(gui, container, params.before);
	  dom$1.addClass(li, GUI$1.CLASS_CONTROLLER_ROW);
	  if (controller instanceof ColorController$1) {
	    dom$1.addClass(li, 'color');
	  } else {
	    dom$1.addClass(li, _typeof$1(controller.getValue()));
	  }
	  augmentController$1(gui, li, controller);
	  gui.__controllers.push(controller);
	  return controller;
	}
	function getLocalStorageHash$1(gui, key) {
	  return document.location.href + '.' + key;
	}
	function addPresetOption$1(gui, name, setSelected) {
	  var opt = document.createElement('option');
	  opt.innerHTML = name;
	  opt.value = name;
	  gui.__preset_select.appendChild(opt);
	  if (setSelected) {
	    gui.__preset_select.selectedIndex = gui.__preset_select.length - 1;
	  }
	}
	function showHideExplain$1(gui, explain) {
	  explain.style.display = gui.useLocalStorage ? 'block' : 'none';
	}
	function addSaveMenu$1(gui) {
	  var div = gui.__save_row = document.createElement('li');
	  dom$1.addClass(gui.domElement, 'has-save');
	  gui.__ul.insertBefore(div, gui.__ul.firstChild);
	  dom$1.addClass(div, 'save-row');
	  var gears = document.createElement('span');
	  gears.innerHTML = '&nbsp;';
	  dom$1.addClass(gears, 'button gears');
	  var button = document.createElement('span');
	  button.innerHTML = 'Save';
	  dom$1.addClass(button, 'button');
	  dom$1.addClass(button, 'save');
	  var button2 = document.createElement('span');
	  button2.innerHTML = 'New';
	  dom$1.addClass(button2, 'button');
	  dom$1.addClass(button2, 'save-as');
	  var button3 = document.createElement('span');
	  button3.innerHTML = 'Revert';
	  dom$1.addClass(button3, 'button');
	  dom$1.addClass(button3, 'revert');
	  var select = gui.__preset_select = document.createElement('select');
	  if (gui.load && gui.load.remembered) {
	    Common$1.each(gui.load.remembered, function (value, key) {
	      addPresetOption$1(gui, key, key === gui.preset);
	    });
	  } else {
	    addPresetOption$1(gui, DEFAULT_DEFAULT_PRESET_NAME$1, false);
	  }
	  dom$1.bind(select, 'change', function () {
	    for (var index = 0; index < gui.__preset_select.length; index++) {
	      gui.__preset_select[index].innerHTML = gui.__preset_select[index].value;
	    }
	    gui.preset = this.value;
	  });
	  div.appendChild(select);
	  div.appendChild(gears);
	  div.appendChild(button);
	  div.appendChild(button2);
	  div.appendChild(button3);
	  if (SUPPORTS_LOCAL_STORAGE$1) {
	    var explain = document.getElementById('dg-local-explain');
	    var localStorageCheckBox = document.getElementById('dg-local-storage');
	    var saveLocally = document.getElementById('dg-save-locally');
	    saveLocally.style.display = 'block';
	    if (localStorage.getItem(getLocalStorageHash$1(gui, 'isLocal')) === 'true') {
	      localStorageCheckBox.setAttribute('checked', 'checked');
	    }
	    showHideExplain$1(gui, explain);
	    dom$1.bind(localStorageCheckBox, 'change', function () {
	      gui.useLocalStorage = !gui.useLocalStorage;
	      showHideExplain$1(gui, explain);
	    });
	  }
	  var newConstructorTextArea = document.getElementById('dg-new-constructor');
	  dom$1.bind(newConstructorTextArea, 'keydown', function (e) {
	    if (e.metaKey && (e.which === 67 || e.keyCode === 67)) {
	      SAVE_DIALOGUE$1.hide();
	    }
	  });
	  dom$1.bind(gears, 'click', function () {
	    newConstructorTextArea.innerHTML = JSON.stringify(gui.getSaveObject(), undefined, 2);
	    SAVE_DIALOGUE$1.show();
	    newConstructorTextArea.focus();
	    newConstructorTextArea.select();
	  });
	  dom$1.bind(button, 'click', function () {
	    gui.save();
	  });
	  dom$1.bind(button2, 'click', function () {
	    var presetName = prompt('Enter a new preset name.');
	    if (presetName) {
	      gui.saveAs(presetName);
	    }
	  });
	  dom$1.bind(button3, 'click', function () {
	    gui.revert();
	  });
	}
	function addResizeHandle$1(gui) {
	  var pmouseX = void 0;
	  gui.__resize_handle = document.createElement('div');
	  Common$1.extend(gui.__resize_handle.style, {
	    width: '6px',
	    marginLeft: '-3px',
	    height: '200px',
	    cursor: 'ew-resize',
	    position: 'absolute'
	  });
	  function drag(e) {
	    e.preventDefault();
	    gui.width += pmouseX - e.clientX;
	    gui.onResize();
	    pmouseX = e.clientX;
	    return false;
	  }
	  function dragStop() {
	    dom$1.removeClass(gui.__closeButton, GUI$1.CLASS_DRAG);
	    dom$1.unbind(window, 'mousemove', drag);
	    dom$1.unbind(window, 'mouseup', dragStop);
	  }
	  function dragStart(e) {
	    e.preventDefault();
	    pmouseX = e.clientX;
	    dom$1.addClass(gui.__closeButton, GUI$1.CLASS_DRAG);
	    dom$1.bind(window, 'mousemove', drag);
	    dom$1.bind(window, 'mouseup', dragStop);
	    return false;
	  }
	  dom$1.bind(gui.__resize_handle, 'mousedown', dragStart);
	  dom$1.bind(gui.__closeButton, 'mousedown', dragStart);
	  gui.domElement.insertBefore(gui.__resize_handle, gui.domElement.firstElementChild);
	}
	function setWidth$1(gui, w) {
	  gui.domElement.style.width = w + 'px';
	  if (gui.__save_row && gui.autoPlace) {
	    gui.__save_row.style.width = w + 'px';
	  }
	  if (gui.__closeButton) {
	    gui.__closeButton.style.width = w + 'px';
	  }
	}
	function getCurrentPreset$1(gui, useInitialValues) {
	  var toReturn = {};
	  Common$1.each(gui.__rememberedObjects, function (val, index) {
	    var savedValues = {};
	    var controllerMap = gui.__rememberedObjectIndecesToControllers[index];
	    Common$1.each(controllerMap, function (controller, property) {
	      savedValues[property] = useInitialValues ? controller.initialValue : controller.getValue();
	    });
	    toReturn[index] = savedValues;
	  });
	  return toReturn;
	}
	function setPresetSelectIndex$1(gui) {
	  for (var index = 0; index < gui.__preset_select.length; index++) {
	    if (gui.__preset_select[index].value === gui.preset) {
	      gui.__preset_select.selectedIndex = index;
	    }
	  }
	}
	function updateDisplays$1(controllerArray) {
	  if (controllerArray.length !== 0) {
	    requestAnimationFrame$1$1.call(window, function () {
	      updateDisplays$1(controllerArray);
	    });
	  }
	  Common$1.each(controllerArray, function (c) {
	    c.updateDisplay();
	  });
	}
	var controllers$1 = {
	  Controller: Controller$1,
	  BooleanController: BooleanController$1,
	  OptionController: OptionController$1,
	  StringController: StringController$1,
	  NumberController: NumberController$1,
	  NumberControllerBox: NumberControllerBox$1,
	  NumberControllerSlider: NumberControllerSlider$1,
	  FunctionController: FunctionController$1,
	  ColorController: ColorController$1,
	  CustomController: CustomController$1
	};

	/**
	 * custom controller, allow to user to change a value step by step.
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

	var UpDownController = {

		/**
		 * adds new button into controller
		 * @param {string} innerHTML button name
		 * @param {object} [options] the following options are available
		 * @param {String} [options.title] title of the button
		 * @param {Event} [options.onclick] onclick event
		 * @param {Event} [options.onWheel] onWheel event
		 */
		addButton: function ( innerHTML, options ) {

			options = options || {};
			var button = document.createElement( 'span' );
			button.innerHTML = innerHTML;
			if ( options.title !== undefined )
				button.title = options.title;
			if ( options.onclick !== undefined ) {

				button.style.cursor = 'pointer';
				button.onclick = options.onclick;

			}
			if ( options.onwheel !== undefined ) {

				button.style.cursor = 'n-resize';

				//https://learn.javascript.ru/mousewheel
				if ( button.addEventListener ) {
					if ( 'onwheel' in document ) {
						// IE9+, FF17+, Ch31+
						button.addEventListener( "wheel", onWheel, {
							
							passive: true//https://web.dev/i18n/ru/uses-passive-event-listeners/
						
						} );
					} else if ( 'onmousewheel' in document ) {
						// устаревший вариант события
						button.addEventListener( "mousewheel", onWheel );
					} else {
						// Firefox < 17
						button.addEventListener( "MozMousePixelScroll", onWheel );
					}
				} else { // IE8-
					button.attachEvent( "onmousewheel", onWheel );
				}

				function onWheel( e ) {
					e = e || window.event;

					// wheelDelta не дает возможность узнать количество пикселей
					var delta = e.deltaY || e.detail || e.wheelDelta;
					options.onwheel( delta );

				}

			}
			button.style.margin = '0px 2px';
			return button;

		},

	};

	/**
	 * @module ScaleController
	 * @description is dat.GUI graphical user interface controller for control of the scale of threejs 3D object
	 * 
	 * @see {@link https://threejs.org/} about threejs
	 * @see {@link https://github.com/dataarts/dat.gui} about dat.GUI
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

	class ScaleController extends controllers$1.CustomController {

		/**
		* @callback onclick
		* @param {ScaleController} customController this controller
		* @param {Function} action action( value, zoom ) function for multiply or divide value to zoom
		*/

		/**
		 * @description dat.GUI graphical user interface controller for control of the scale of threejs 3D object
		 * @param {onclick} onclick Called whenever user has clicked this controller.
		 * @param {object} [options] the following options are available:
		 * @param {object} [options.settings] settings.
		 * @param {number} [options.settings.zoomMultiplier] control value. Default is 1.1
		 * @param {Function} [options.getLanguageCode=language code of your browser] returns the "primary language" subtag of the version of the browser.
		 * @example 
	//Add new ScaleController to the dat.GUI folder
	folder.add( new ScaleController( function ( customController, action ) {

		var zoom = customController.controller.getValue();

		//Scale a THREE.Mesh object
		mesh.scale.x = action( mesh.scale.x, zoom );
		mesh.scale.y = action( mesh.scale.y, zoom );
		mesh.scale.z = action( mesh.scale.z, zoom );
		mesh.needsUpdate = true;

	},
		{

			settings: { zoomMultiplier: 1.1, },
			getLanguageCode: getLanguageCode,

		} ) );
		 */
		constructor( onclick, options ) {

			options = options || {};
			options.settings = options.settings || {};
			options.settings.zoomMultiplier = options.settings.zoomMultiplier || 1.1;

			super( {

				multiplier: options.settings.zoomMultiplier,//1.1
				property: function ( customController ) {


					//Localization

					var lang = {

						//Zoom
						zoom: 'Zoom',
						in: 'in',
						out: 'out',
						wheelZoom: 'Scroll the mouse wheel to zoom',

					};

					var _languageCode = options.getLanguageCode === undefined ? 'en'//Default language is English
						: options.getLanguageCode();
					switch ( _languageCode ) {

						case 'ru'://Russian language

							//Zoom
							lang.zoom = 'Изменить';
							lang.in = 'увеличить';
							lang.out = 'уменьшить';
							lang.wheelZoom = 'Прокрутите колесико мыши для изменения масштаба';

							break;
						default://Custom language
							if ( ( options.lang === undefined ) || ( options.lang.languageCode != _languageCode ) )
								break;

							Object.keys( options.lang ).forEach( function ( key ) {

								if ( lang[key] === undefined )
									return;
								lang[key] = options.lang[key];

							} );

					}

					//

					var buttons = {},
						addButton = UpDownController.addButton;
					buttons.zoomLabel = addButton( lang.zoom, {

						title: lang.wheelZoom,//Scroll the mouse wheel to zoom
						onwheel: function ( delta ) {

							onclick( customController, function ( value, zoom ) {

								if ( delta > 0 )
									value *= zoom;
								else value /= zoom;
								return value;

							} );

						}

					} );
					buttons.in = addButton( '↑', {

						title: lang.in,
						onclick: function () {

							onclick( customController, function ( value, zoom ) {

								value *= zoom;
								return value;

							} );

						}

					} );
					buttons.out = addButton( '↓', {

						title: lang.out,
						onclick: function () {

							onclick( customController, function ( value, zoom ) {

								value /= zoom;
								return value;

							} );

						}

					} );
					return buttons;

				},

			}, 'multiplier', 1.1, 10, 0.1, options.newBool );
			if ( this.property === undefined )
				console.error( 'init() returns ' + this.property );

		}

	}

	/**
	 * PositionController is dat.GUI graphical user interface controller for control of the position of threejs 3D object
	 * 
	 * @see {@link https://threejs.org/} about threejs
	 * @see {@link https://github.com/dataarts/dat.gui} about dat.GUI
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

	class PositionController extends controllers$1.CustomController {

		/**
		 * dat.GUI graphical user interface for control of the position of threejs 3D object.
		 * Base class <a href="../../dat.gui/CustomController/src/dat/controllers/CustomController.js" target="_blank">CustomController</a>
		 * @extends controllers.CustomController.
		 * @param {Event} onclickController
		 * @param {object} [options={}] the following options are available:
		 * @param {number} [options.settings={}] time settings.
		 * @param {number} [options.settings.offset=0.1] offset.
		 * @param {number} [options.min=0.1] Minimal offset.
		 * @param {number} [options.max=10] Maximal offset.
		 * @param {number} [options.step=0.1] step of offset.
		 * @param {Function} [options.getLanguageCode=language code of your browser] returns the "primary language" subtag of the version of the browser.
		 */
		constructor( onclickController, options ) {

			options = options || {};
			options.settings = options.settings || {}; 
			var settings = options.settings; 

			if ( options.min === undefined ) options.min = 0.1;
			if ( options.max === undefined ) options.max = 10;
			if ( settings.offset === undefined ) settings.offset = 0.1;
			if ( options.step === undefined ) options.step = 0.1;

			super( {

				offset: settings.offset,
				property: function ( customController ) {

					//Localization

					var lang = {

						//Position
						offset: 'Offset',
						add: 'add',
						subtract: 'subtract',
						wheelPosition: 'Scroll the mouse wheel to change the position',

					};

					var _languageCode = options.getLanguageCode === undefined ? 'en'//Default language is English
						: options.getLanguageCode();
					switch ( _languageCode ) {

						case 'ru'://Russian language

							//Position
							lang.offset = 'Сдвиг';
							lang.add = 'добавить';
							lang.subtract = 'вычесть';
							lang.wheelPosition = 'Прокрутите колесико мыши для изменения позиции';

							break;
						default://Custom language
							if ( ( options.lang === undefined ) || ( options.lang.languageCode != _languageCode ) )
								break;

							Object.keys( options.lang ).forEach( function ( key ) {

								if ( lang[key] === undefined )
									return;
								lang[key] = options.lang[key];

							} );

					}

					//

					var buttons = {}, addButton = UpDownController.addButton;
					buttons.Label = addButton( lang.offset, {

						title: lang.wheelPosition,
						onwheel: function ( delta ) {

							var shift = customController.controller.getValue();
							onclickController( delta > 0 ? shift : - shift );

						}

					} );
					buttons.in = addButton( '↑', {

						title: lang.add,
						onclick: function () {

							onclickController( customController.controller.getValue() );

						}

					} );
					buttons.out = addButton( '↓', {

						title: lang.subtract,
						onclick: function () {

							onclickController( - customController.controller.getValue() );

						}

					} );
					return buttons;

				},

			}, 'offset', options.min, options.max, options.step );
			if ( this.property === undefined )
				console.error( 'init() returns ' + this.property );

		}

	}

	/**
	 * dat-gui JavaScript Controller Library
	 * http://code.google.com/p/dat-gui
	 *
	 * Copyright 2011 Data Arts Team, Google Creative Lab
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 */

	function ___$insertStyle(css) {
	  if (!css) {
	    return;
	  }
	  if (typeof window === 'undefined') {
	    return;
	  }

	  var style = document.createElement('style');

	  style.setAttribute('type', 'text/css');
	  style.innerHTML = css;
	  document.head.appendChild(style);

	  return css;
	}

	function colorToString (color, forceCSSHex) {
	  var colorFormat = color.__state.conversionName.toString();
	  var r = Math.round(color.r);
	  var g = Math.round(color.g);
	  var b = Math.round(color.b);
	  var a = color.a;
	  var h = Math.round(color.h);
	  var s = color.s.toFixed(1);
	  var v = color.v.toFixed(1);
	  if (forceCSSHex || colorFormat === 'THREE_CHAR_HEX' || colorFormat === 'SIX_CHAR_HEX') {
	    var str = color.hex.toString(16);
	    while (str.length < 6) {
	      str = '0' + str;
	    }
	    return '#' + str;
	  } else if (colorFormat === 'CSS_RGB') {
	    return 'rgb(' + r + ',' + g + ',' + b + ')';
	  } else if (colorFormat === 'CSS_RGBA') {
	    return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
	  } else if (colorFormat === 'HEX') {
	    return '0x' + color.hex.toString(16);
	  } else if (colorFormat === 'RGB_ARRAY') {
	    return '[' + r + ',' + g + ',' + b + ']';
	  } else if (colorFormat === 'RGBA_ARRAY') {
	    return '[' + r + ',' + g + ',' + b + ',' + a + ']';
	  } else if (colorFormat === 'RGB_OBJ') {
	    return '{r:' + r + ',g:' + g + ',b:' + b + '}';
	  } else if (colorFormat === 'RGBA_OBJ') {
	    return '{r:' + r + ',g:' + g + ',b:' + b + ',a:' + a + '}';
	  } else if (colorFormat === 'HSV_OBJ') {
	    return '{h:' + h + ',s:' + s + ',v:' + v + '}';
	  } else if (colorFormat === 'HSVA_OBJ') {
	    return '{h:' + h + ',s:' + s + ',v:' + v + ',a:' + a + '}';
	  }
	  return 'unknown format';
	}

	var ARR_EACH = Array.prototype.forEach;
	var ARR_SLICE = Array.prototype.slice;
	var Common = {
	  BREAK: {},
	  extend: function extend(target) {
	    this.each(ARR_SLICE.call(arguments, 1), function (obj) {
	      var keys = this.isObject(obj) ? Object.keys(obj) : [];
	      keys.forEach(function (key) {
	        if (!this.isUndefined(obj[key])) {
	          target[key] = obj[key];
	        }
	      }.bind(this));
	    }, this);
	    return target;
	  },
	  defaults: function defaults(target) {
	    this.each(ARR_SLICE.call(arguments, 1), function (obj) {
	      var keys = this.isObject(obj) ? Object.keys(obj) : [];
	      keys.forEach(function (key) {
	        if (this.isUndefined(target[key])) {
	          target[key] = obj[key];
	        }
	      }.bind(this));
	    }, this);
	    return target;
	  },
	  compose: function compose() {
	    var toCall = ARR_SLICE.call(arguments);
	    return function () {
	      var args = ARR_SLICE.call(arguments);
	      for (var i = toCall.length - 1; i >= 0; i--) {
	        args = [toCall[i].apply(this, args)];
	      }
	      return args[0];
	    };
	  },
	  each: function each(obj, itr, scope) {
	    if (!obj) {
	      return;
	    }
	    if (ARR_EACH && obj.forEach && obj.forEach === ARR_EACH) {
	      obj.forEach(itr, scope);
	    } else if (obj.length === obj.length + 0) {
	      var key = void 0;
	      var l = void 0;
	      for (key = 0, l = obj.length; key < l; key++) {
	        if (key in obj && itr.call(scope, obj[key], key) === this.BREAK) {
	          return;
	        }
	      }
	    } else {
	      for (var _key in obj) {
	        if (itr.call(scope, obj[_key], _key) === this.BREAK) {
	          return;
	        }
	      }
	    }
	  },
	  defer: function defer(fnc) {
	    setTimeout(fnc, 0);
	  },
	  debounce: function debounce(func, threshold, callImmediately) {
	    var timeout = void 0;
	    return function () {
	      var obj = this;
	      var args = arguments;
	      function delayed() {
	        timeout = null;
	        if (!callImmediately) func.apply(obj, args);
	      }
	      var callNow = callImmediately || !timeout;
	      clearTimeout(timeout);
	      timeout = setTimeout(delayed, threshold);
	      if (callNow) {
	        func.apply(obj, args);
	      }
	    };
	  },
	  toArray: function toArray(obj) {
	    if (obj.toArray) return obj.toArray();
	    return ARR_SLICE.call(obj);
	  },
	  isUndefined: function isUndefined(obj) {
	    return obj === undefined;
	  },
	  isNull: function isNull(obj) {
	    return obj === null;
	  },
	  isNaN: function (_isNaN) {
	    function isNaN(_x) {
	      return _isNaN.apply(this, arguments);
	    }
	    isNaN.toString = function () {
	      return _isNaN.toString();
	    };
	    return isNaN;
	  }(function (obj) {
	    return isNaN(obj);
	  }),
	  isArray: Array.isArray || function (obj) {
	    return obj.constructor === Array;
	  },
	  isObject: function isObject(obj) {
	    return obj === Object(obj);
	  },
	  isNumber: function isNumber(obj) {
	    return obj === obj + 0;
	  },
	  isString: function isString(obj) {
	    return obj === obj + '';
	  },
	  isBoolean: function isBoolean(obj) {
	    return obj === false || obj === true;
	  },
	  isFunction: function isFunction(obj) {
	    return Object.prototype.toString.call(obj) === '[object Function]';
	  }
	};

	var INTERPRETATIONS = [
	{
	  litmus: Common.isString,
	  conversions: {
	    THREE_CHAR_HEX: {
	      read: function read(original) {
	        var test = original.match(/^#([A-F0-9])([A-F0-9])([A-F0-9])$/i);
	        if (test === null) {
	          return false;
	        }
	        return {
	          space: 'HEX',
	          hex: parseInt('0x' + test[1].toString() + test[1].toString() + test[2].toString() + test[2].toString() + test[3].toString() + test[3].toString(), 0)
	        };
	      },
	      write: colorToString
	    },
	    SIX_CHAR_HEX: {
	      read: function read(original) {
	        var test = original.match(/^#([A-F0-9]{6})$/i);
	        if (test === null) {
	          return false;
	        }
	        return {
	          space: 'HEX',
	          hex: parseInt('0x' + test[1].toString(), 0)
	        };
	      },
	      write: colorToString
	    },
	    CSS_RGB: {
	      read: function read(original) {
	        var test = original.match(/^rgb\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\)/);
	        if (test === null) {
	          return false;
	        }
	        return {
	          space: 'RGB',
	          r: parseFloat(test[1]),
	          g: parseFloat(test[2]),
	          b: parseFloat(test[3])
	        };
	      },
	      write: colorToString
	    },
	    CSS_RGBA: {
	      read: function read(original) {
	        var test = original.match(/^rgba\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\)/);
	        if (test === null) {
	          return false;
	        }
	        return {
	          space: 'RGB',
	          r: parseFloat(test[1]),
	          g: parseFloat(test[2]),
	          b: parseFloat(test[3]),
	          a: parseFloat(test[4])
	        };
	      },
	      write: colorToString
	    }
	  }
	},
	{
	  litmus: Common.isNumber,
	  conversions: {
	    HEX: {
	      read: function read(original) {
	        return {
	          space: 'HEX',
	          hex: original,
	          conversionName: 'HEX'
	        };
	      },
	      write: function write(color) {
	        return color.hex;
	      }
	    }
	  }
	},
	{
	  litmus: Common.isArray,
	  conversions: {
	    RGB_ARRAY: {
	      read: function read(original) {
	        if (original.length !== 3) {
	          return false;
	        }
	        return {
	          space: 'RGB',
	          r: original[0],
	          g: original[1],
	          b: original[2]
	        };
	      },
	      write: function write(color) {
	        return [color.r, color.g, color.b];
	      }
	    },
	    RGBA_ARRAY: {
	      read: function read(original) {
	        if (original.length !== 4) return false;
	        return {
	          space: 'RGB',
	          r: original[0],
	          g: original[1],
	          b: original[2],
	          a: original[3]
	        };
	      },
	      write: function write(color) {
	        return [color.r, color.g, color.b, color.a];
	      }
	    }
	  }
	},
	{
	  litmus: Common.isObject,
	  conversions: {
	    RGBA_OBJ: {
	      read: function read(original) {
	        if (Common.isNumber(original.r) && Common.isNumber(original.g) && Common.isNumber(original.b) && Common.isNumber(original.a)) {
	          return {
	            space: 'RGB',
	            r: original.r,
	            g: original.g,
	            b: original.b,
	            a: original.a
	          };
	        }
	        return false;
	      },
	      write: function write(color) {
	        return {
	          r: color.r,
	          g: color.g,
	          b: color.b,
	          a: color.a
	        };
	      }
	    },
	    RGB_OBJ: {
	      read: function read(original) {
	        if (Common.isNumber(original.r) && Common.isNumber(original.g) && Common.isNumber(original.b)) {
	          return {
	            space: 'RGB',
	            r: original.r,
	            g: original.g,
	            b: original.b
	          };
	        }
	        return false;
	      },
	      write: function write(color) {
	        return {
	          r: color.r,
	          g: color.g,
	          b: color.b
	        };
	      }
	    },
	    HSVA_OBJ: {
	      read: function read(original) {
	        if (Common.isNumber(original.h) && Common.isNumber(original.s) && Common.isNumber(original.v) && Common.isNumber(original.a)) {
	          return {
	            space: 'HSV',
	            h: original.h,
	            s: original.s,
	            v: original.v,
	            a: original.a
	          };
	        }
	        return false;
	      },
	      write: function write(color) {
	        return {
	          h: color.h,
	          s: color.s,
	          v: color.v,
	          a: color.a
	        };
	      }
	    },
	    HSV_OBJ: {
	      read: function read(original) {
	        if (Common.isNumber(original.h) && Common.isNumber(original.s) && Common.isNumber(original.v)) {
	          return {
	            space: 'HSV',
	            h: original.h,
	            s: original.s,
	            v: original.v
	          };
	        }
	        return false;
	      },
	      write: function write(color) {
	        return {
	          h: color.h,
	          s: color.s,
	          v: color.v
	        };
	      }
	    }
	  }
	}];
	var result = void 0;
	var toReturn = void 0;
	var interpret = function interpret() {
	  toReturn = false;
	  var original = arguments.length > 1 ? Common.toArray(arguments) : arguments[0];
	  Common.each(INTERPRETATIONS, function (family) {
	    if (family.litmus(original)) {
	      Common.each(family.conversions, function (conversion, conversionName) {
	        result = conversion.read(original);
	        if (toReturn === false && result !== false) {
	          toReturn = result;
	          result.conversionName = conversionName;
	          result.conversion = conversion;
	          return Common.BREAK;
	        }
	      });
	      return Common.BREAK;
	    }
	  });
	  return toReturn;
	};

	var tmpComponent = void 0;
	var ColorMath = {
	  hsv_to_rgb: function hsv_to_rgb(h, s, v) {
	    var hi = Math.floor(h / 60) % 6;
	    var f = h / 60 - Math.floor(h / 60);
	    var p = v * (1.0 - s);
	    var q = v * (1.0 - f * s);
	    var t = v * (1.0 - (1.0 - f) * s);
	    var c = [[v, t, p], [q, v, p], [p, v, t], [p, q, v], [t, p, v], [v, p, q]][hi];
	    return {
	      r: c[0] * 255,
	      g: c[1] * 255,
	      b: c[2] * 255
	    };
	  },
	  rgb_to_hsv: function rgb_to_hsv(r, g, b) {
	    var min = Math.min(r, g, b);
	    var max = Math.max(r, g, b);
	    var delta = max - min;
	    var h = void 0;
	    var s = void 0;
	    if (max !== 0) {
	      s = delta / max;
	    } else {
	      return {
	        h: NaN,
	        s: 0,
	        v: 0
	      };
	    }
	    if (r === max) {
	      h = (g - b) / delta;
	    } else if (g === max) {
	      h = 2 + (b - r) / delta;
	    } else {
	      h = 4 + (r - g) / delta;
	    }
	    h /= 6;
	    if (h < 0) {
	      h += 1;
	    }
	    return {
	      h: h * 360,
	      s: s,
	      v: max / 255
	    };
	  },
	  rgb_to_hex: function rgb_to_hex(r, g, b) {
	    var hex = this.hex_with_component(0, 2, r);
	    hex = this.hex_with_component(hex, 1, g);
	    hex = this.hex_with_component(hex, 0, b);
	    return hex;
	  },
	  component_from_hex: function component_from_hex(hex, componentIndex) {
	    return hex >> componentIndex * 8 & 0xFF;
	  },
	  hex_with_component: function hex_with_component(hex, componentIndex, value) {
	    return value << (tmpComponent = componentIndex * 8) | hex & ~(0xFF << tmpComponent);
	  }
	};

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
	  return typeof obj;
	} : function (obj) {
	  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
	};











	var classCallCheck = function (instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};

	var createClass = function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];
	      descriptor.enumerable = descriptor.enumerable || false;
	      descriptor.configurable = true;
	      if ("value" in descriptor) descriptor.writable = true;
	      Object.defineProperty(target, descriptor.key, descriptor);
	    }
	  }

	  return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);
	    if (staticProps) defineProperties(Constructor, staticProps);
	    return Constructor;
	  };
	}();







	var get = function get(object, property, receiver) {
	  if (object === null) object = Function.prototype;
	  var desc = Object.getOwnPropertyDescriptor(object, property);

	  if (desc === undefined) {
	    var parent = Object.getPrototypeOf(object);

	    if (parent === null) {
	      return undefined;
	    } else {
	      return get(parent, property, receiver);
	    }
	  } else if ("value" in desc) {
	    return desc.value;
	  } else {
	    var getter = desc.get;

	    if (getter === undefined) {
	      return undefined;
	    }

	    return getter.call(receiver);
	  }
	};

	var inherits = function (subClass, superClass) {
	  if (typeof superClass !== "function" && superClass !== null) {
	    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
	  }

	  subClass.prototype = Object.create(superClass && superClass.prototype, {
	    constructor: {
	      value: subClass,
	      enumerable: false,
	      writable: true,
	      configurable: true
	    }
	  });
	  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	};











	var possibleConstructorReturn = function (self, call) {
	  if (!self) {
	    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	  }

	  return call && (typeof call === "object" || typeof call === "function") ? call : self;
	};

	var Color = function () {
	  function Color() {
	    classCallCheck(this, Color);
	    this.__state = interpret.apply(this, arguments);
	    if (this.__state === false) {
	      throw new Error('Failed to interpret color arguments');
	    }
	    this.__state.a = this.__state.a || 1;
	  }
	  createClass(Color, [{
	    key: 'toString',
	    value: function toString() {
	      return colorToString(this);
	    }
	  }, {
	    key: 'toHexString',
	    value: function toHexString() {
	      return colorToString(this, true);
	    }
	  }, {
	    key: 'toOriginal',
	    value: function toOriginal() {
	      return this.__state.conversion.write(this);
	    }
	  }]);
	  return Color;
	}();
	function defineRGBComponent(target, component, componentHexIndex) {
	  Object.defineProperty(target, component, {
	    get: function get$$1() {
	      if (this.__state.space === 'RGB') {
	        return this.__state[component];
	      }
	      Color.recalculateRGB(this, component, componentHexIndex);
	      return this.__state[component];
	    },
	    set: function set$$1(v) {
	      if (this.__state.space !== 'RGB') {
	        Color.recalculateRGB(this, component, componentHexIndex);
	        this.__state.space = 'RGB';
	      }
	      this.__state[component] = v;
	    }
	  });
	}
	function defineHSVComponent(target, component) {
	  Object.defineProperty(target, component, {
	    get: function get$$1() {
	      if (this.__state.space === 'HSV') {
	        return this.__state[component];
	      }
	      Color.recalculateHSV(this);
	      return this.__state[component];
	    },
	    set: function set$$1(v) {
	      if (this.__state.space !== 'HSV') {
	        Color.recalculateHSV(this);
	        this.__state.space = 'HSV';
	      }
	      this.__state[component] = v;
	    }
	  });
	}
	Color.recalculateRGB = function (color, component, componentHexIndex) {
	  if (color.__state.space === 'HEX') {
	    color.__state[component] = ColorMath.component_from_hex(color.__state.hex, componentHexIndex);
	  } else if (color.__state.space === 'HSV') {
	    Common.extend(color.__state, ColorMath.hsv_to_rgb(color.__state.h, color.__state.s, color.__state.v));
	  } else {
	    throw new Error('Corrupted color state');
	  }
	};
	Color.recalculateHSV = function (color) {
	  var result = ColorMath.rgb_to_hsv(color.r, color.g, color.b);
	  Common.extend(color.__state, {
	    s: result.s,
	    v: result.v
	  });
	  if (!Common.isNaN(result.h)) {
	    color.__state.h = result.h;
	  } else if (Common.isUndefined(color.__state.h)) {
	    color.__state.h = 0;
	  }
	};
	Color.COMPONENTS = ['r', 'g', 'b', 'h', 's', 'v', 'hex', 'a'];
	defineRGBComponent(Color.prototype, 'r', 2);
	defineRGBComponent(Color.prototype, 'g', 1);
	defineRGBComponent(Color.prototype, 'b', 0);
	defineHSVComponent(Color.prototype, 'h');
	defineHSVComponent(Color.prototype, 's');
	defineHSVComponent(Color.prototype, 'v');
	Object.defineProperty(Color.prototype, 'a', {
	  get: function get$$1() {
	    return this.__state.a;
	  },
	  set: function set$$1(v) {
	    this.__state.a = v;
	  }
	});
	Object.defineProperty(Color.prototype, 'hex', {
	  get: function get$$1() {
	    if (!this.__state.space !== 'HEX') {
	      this.__state.hex = ColorMath.rgb_to_hex(this.r, this.g, this.b);
	    }
	    return this.__state.hex;
	  },
	  set: function set$$1(v) {
	    this.__state.space = 'HEX';
	    this.__state.hex = v;
	  }
	});

	var Controller = function () {
	  function Controller(object, property) {
	    classCallCheck(this, Controller);
	    this.initialValue = object[property];
	    this.domElement = document.createElement('div');
	    this.object = object;
	    this.property = property;
	    this.__onChange = undefined;
	    this.__onFinishChange = undefined;
	  }
	  createClass(Controller, [{
	    key: 'onChange',
	    value: function onChange(fnc) {
	      this.__onChange = fnc;
	      return this;
	    }
	  }, {
	    key: 'onFinishChange',
	    value: function onFinishChange(fnc) {
	      this.__onFinishChange = fnc;
	      return this;
	    }
	  }, {
	    key: 'setValue',
	    value: function setValue(newValue) {
	      this.object[this.property] = newValue;
	      if (this.__onChange) {
	        this.__onChange.call(this, newValue);
	      }
	      this.updateDisplay();
	      return this;
	    }
	  }, {
	    key: 'getValue',
	    value: function getValue() {
	      return this.object[this.property];
	    }
	  }, {
	    key: 'updateDisplay',
	    value: function updateDisplay() {
	      return this;
	    }
	  }, {
	    key: 'isModified',
	    value: function isModified() {
	      return this.initialValue !== this.getValue();
	    }
	  }]);
	  return Controller;
	}();

	var EVENT_MAP = {
	  HTMLEvents: ['change'],
	  MouseEvents: ['click', 'mousemove', 'mousedown', 'mouseup', 'mouseover'],
	  KeyboardEvents: ['keydown']
	};
	var EVENT_MAP_INV = {};
	Common.each(EVENT_MAP, function (v, k) {
	  Common.each(v, function (e) {
	    EVENT_MAP_INV[e] = k;
	  });
	});
	var CSS_VALUE_PIXELS = /(\d+(\.\d+)?)px/;
	function cssValueToPixels(val) {
	  if (val === '0' || Common.isUndefined(val)) {
	    return 0;
	  }
	  var match = val.match(CSS_VALUE_PIXELS);
	  if (!Common.isNull(match)) {
	    return parseFloat(match[1]);
	  }
	  return 0;
	}
	var dom = {
	  makeSelectable: function makeSelectable(elem, selectable) {
	    if (elem === undefined || elem.style === undefined) return;
	    elem.onselectstart = selectable ? function () {
	      return false;
	    } : function () {};
	    elem.style.MozUserSelect = selectable ? 'auto' : 'none';
	    elem.style.KhtmlUserSelect = selectable ? 'auto' : 'none';
	    elem.unselectable = selectable ? 'on' : 'off';
	  },
	  makeFullscreen: function makeFullscreen(elem, hor, vert) {
	    var vertical = vert;
	    var horizontal = hor;
	    if (Common.isUndefined(horizontal)) {
	      horizontal = true;
	    }
	    if (Common.isUndefined(vertical)) {
	      vertical = true;
	    }
	    elem.style.position = 'absolute';
	    if (horizontal) {
	      elem.style.left = 0;
	      elem.style.right = 0;
	    }
	    if (vertical) {
	      elem.style.top = 0;
	      elem.style.bottom = 0;
	    }
	  },
	  fakeEvent: function fakeEvent(elem, eventType, pars, aux) {
	    var params = pars || {};
	    var className = EVENT_MAP_INV[eventType];
	    if (!className) {
	      throw new Error('Event type ' + eventType + ' not supported.');
	    }
	    var evt = document.createEvent(className);
	    switch (className) {
	      case 'MouseEvents':
	        {
	          var clientX = params.x || params.clientX || 0;
	          var clientY = params.y || params.clientY || 0;
	          evt.initMouseEvent(eventType, params.bubbles || false, params.cancelable || true, window, params.clickCount || 1, 0,
	          0,
	          clientX,
	          clientY,
	          false, false, false, false, 0, null);
	          break;
	        }
	      case 'KeyboardEvents':
	        {
	          var init = evt.initKeyboardEvent || evt.initKeyEvent;
	          Common.defaults(params, {
	            cancelable: true,
	            ctrlKey: false,
	            altKey: false,
	            shiftKey: false,
	            metaKey: false,
	            keyCode: undefined,
	            charCode: undefined
	          });
	          init(eventType, params.bubbles || false, params.cancelable, window, params.ctrlKey, params.altKey, params.shiftKey, params.metaKey, params.keyCode, params.charCode);
	          break;
	        }
	      default:
	        {
	          evt.initEvent(eventType, params.bubbles || false, params.cancelable || true);
	          break;
	        }
	    }
	    Common.defaults(evt, aux);
	    elem.dispatchEvent(evt);
	  },
	  bind: function bind(elem, event, func, newBool) {
	    var bool = newBool || false;
	    if (elem.addEventListener) {
	      elem.addEventListener(event, func, {
	        passive: bool
	      });
	    } else if (elem.attachEvent) {
	      elem.attachEvent('on' + event, func);
	    }
	    return dom;
	  },
	  unbind: function unbind(elem, event, func, newBool) {
	    var bool = newBool || false;
	    if (elem.removeEventListener) {
	      elem.removeEventListener(event, func, bool);
	    } else if (elem.detachEvent) {
	      elem.detachEvent('on' + event, func);
	    }
	    return dom;
	  },
	  addClass: function addClass(elem, className) {
	    if (elem.className === undefined) {
	      elem.className = className;
	    } else if (elem.className !== className) {
	      var classes = elem.className.split(/ +/);
	      if (classes.indexOf(className) === -1) {
	        classes.push(className);
	        elem.className = classes.join(' ').replace(/^\s+/, '').replace(/\s+$/, '');
	      }
	    }
	    return dom;
	  },
	  removeClass: function removeClass(elem, className) {
	    if (className) {
	      if (elem.className === className) {
	        elem.removeAttribute('class');
	      } else {
	        var classes = elem.className.split(/ +/);
	        var index = classes.indexOf(className);
	        if (index !== -1) {
	          classes.splice(index, 1);
	          elem.className = classes.join(' ');
	        }
	      }
	    } else {
	      elem.className = undefined;
	    }
	    return dom;
	  },
	  hasClass: function hasClass(elem, className) {
	    return new RegExp('(?:^|\\s+)' + className + '(?:\\s+|$)').test(elem.className) || false;
	  },
	  getWidth: function getWidth(elem) {
	    var style = getComputedStyle(elem);
	    return cssValueToPixels(style['border-left-width']) + cssValueToPixels(style['border-right-width']) + cssValueToPixels(style['padding-left']) + cssValueToPixels(style['padding-right']) + cssValueToPixels(style.width);
	  },
	  getHeight: function getHeight(elem) {
	    var style = getComputedStyle(elem);
	    return cssValueToPixels(style['border-top-width']) + cssValueToPixels(style['border-bottom-width']) + cssValueToPixels(style['padding-top']) + cssValueToPixels(style['padding-bottom']) + cssValueToPixels(style.height);
	  },
	  getOffset: function getOffset(el) {
	    var elem = el;
	    var offset = { left: 0, top: 0 };
	    if (elem.offsetParent) {
	      do {
	        offset.left += elem.offsetLeft;
	        offset.top += elem.offsetTop;
	        elem = elem.offsetParent;
	      } while (elem);
	    }
	    return offset;
	  },
	  isActive: function isActive(elem) {
	    return elem === document.activeElement && (elem.type || elem.href);
	  }
	};

	var BooleanController = function (_Controller) {
	  inherits(BooleanController, _Controller);
	  function BooleanController(object, property) {
	    classCallCheck(this, BooleanController);
	    var _this2 = possibleConstructorReturn(this, (BooleanController.__proto__ || Object.getPrototypeOf(BooleanController)).call(this, object, property));
	    var _this = _this2;
	    _this2.__prev = _this2.getValue();
	    _this2.__checkbox = document.createElement('input');
	    _this2.__checkbox.setAttribute('type', 'checkbox');
	    function onChange() {
	      _this.setValue(!_this.__prev);
	    }
	    dom.bind(_this2.__checkbox, 'change', onChange, false);
	    _this2.domElement.appendChild(_this2.__checkbox);
	    _this2.updateDisplay();
	    return _this2;
	  }
	  createClass(BooleanController, [{
	    key: 'setValue',
	    value: function setValue(v) {
	      var toReturn = get(BooleanController.prototype.__proto__ || Object.getPrototypeOf(BooleanController.prototype), 'setValue', this).call(this, v);
	      if (this.__onFinishChange) {
	        this.__onFinishChange.call(this, this.getValue());
	      }
	      this.__prev = this.getValue();
	      return toReturn;
	    }
	  }, {
	    key: 'updateDisplay',
	    value: function updateDisplay() {
	      if (this.getValue() === true) {
	        this.__checkbox.setAttribute('checked', 'checked');
	        this.__checkbox.checked = true;
	        this.__prev = true;
	      } else {
	        this.__checkbox.checked = false;
	        this.__prev = false;
	      }
	      return get(BooleanController.prototype.__proto__ || Object.getPrototypeOf(BooleanController.prototype), 'updateDisplay', this).call(this);
	    }
	  }]);
	  return BooleanController;
	}(Controller);

	var OptionController = function (_Controller) {
	  inherits(OptionController, _Controller);
	  function OptionController(object, property, opts) {
	    classCallCheck(this, OptionController);
	    var _this2 = possibleConstructorReturn(this, (OptionController.__proto__ || Object.getPrototypeOf(OptionController)).call(this, object, property));
	    var options = opts;
	    var _this = _this2;
	    _this2.__select = document.createElement('select');
	    if (Common.isArray(options)) {
	      var map = {};
	      Common.each(options, function (element) {
	        map[element] = element;
	      });
	      options = map;
	    }
	    Common.each(options, function (value, key) {
	      var opt = document.createElement('option');
	      opt.innerHTML = key;
	      opt.setAttribute('value', value);
	      _this.__select.appendChild(opt);
	    });
	    _this2.updateDisplay();
	    dom.bind(_this2.__select, 'change', function () {
	      var desiredValue = this.options[this.selectedIndex].value;
	      _this.setValue(desiredValue);
	    });
	    _this2.domElement.appendChild(_this2.__select);
	    return _this2;
	  }
	  createClass(OptionController, [{
	    key: 'setValue',
	    value: function setValue(v) {
	      var toReturn = get(OptionController.prototype.__proto__ || Object.getPrototypeOf(OptionController.prototype), 'setValue', this).call(this, v);
	      if (this.__onFinishChange) {
	        this.__onFinishChange.call(this, this.getValue());
	      }
	      return toReturn;
	    }
	  }, {
	    key: 'updateDisplay',
	    value: function updateDisplay() {
	      if (dom.isActive(this.__select)) return this;
	      this.__select.value = this.getValue();
	      return get(OptionController.prototype.__proto__ || Object.getPrototypeOf(OptionController.prototype), 'updateDisplay', this).call(this);
	    }
	  }]);
	  return OptionController;
	}(Controller);

	var StringController = function (_Controller) {
	  inherits(StringController, _Controller);
	  function StringController(object, property) {
	    classCallCheck(this, StringController);
	    var _this2 = possibleConstructorReturn(this, (StringController.__proto__ || Object.getPrototypeOf(StringController)).call(this, object, property));
	    var _this = _this2;
	    function onChange() {
	      _this.setValue(_this.__input.value);
	    }
	    function onBlur() {
	      if (_this.__onFinishChange) {
	        _this.__onFinishChange.call(_this, _this.getValue());
	      }
	    }
	    _this2.__input = document.createElement('input');
	    _this2.__input.setAttribute('type', 'text');
	    dom.bind(_this2.__input, 'keyup', onChange);
	    dom.bind(_this2.__input, 'change', onChange);
	    dom.bind(_this2.__input, 'blur', onBlur);
	    dom.bind(_this2.__input, 'keydown', function (e) {
	      if (e.keyCode === 13) {
	        this.blur();
	      }
	    });
	    _this2.updateDisplay();
	    _this2.domElement.appendChild(_this2.__input);
	    return _this2;
	  }
	  createClass(StringController, [{
	    key: 'updateDisplay',
	    value: function updateDisplay() {
	      if (!dom.isActive(this.__input)) {
	        this.__input.value = this.getValue();
	      }
	      return get(StringController.prototype.__proto__ || Object.getPrototypeOf(StringController.prototype), 'updateDisplay', this).call(this);
	    }
	  }]);
	  return StringController;
	}(Controller);

	function numDecimals(x) {
	  var _x = x.toString();
	  if (_x.indexOf('.') > -1) {
	    return _x.length - _x.indexOf('.') - 1;
	  }
	  return 0;
	}
	var NumberController = function (_Controller) {
	  inherits(NumberController, _Controller);
	  function NumberController(object, property, params) {
	    classCallCheck(this, NumberController);
	    var _this = possibleConstructorReturn(this, (NumberController.__proto__ || Object.getPrototypeOf(NumberController)).call(this, object, property));
	    var _params = params || {};
	    _this.__min = _params.min;
	    _this.__max = _params.max;
	    _this.__step = _params.step;
	    if (Common.isUndefined(_this.__step)) {
	      if (_this.initialValue === 0) {
	        _this.__impliedStep = 1;
	      } else {
	        _this.__impliedStep = Math.pow(10, Math.floor(Math.log(Math.abs(_this.initialValue)) / Math.LN10)) / 10;
	      }
	    } else {
	      _this.__impliedStep = _this.__step;
	    }
	    _this.__precision = numDecimals(_this.__impliedStep);
	    return _this;
	  }
	  createClass(NumberController, [{
	    key: 'setValue',
	    value: function setValue(v) {
	      var _v = v;
	      if (this.__min !== undefined && _v < this.__min) {
	        _v = this.__min;
	      } else if (this.__max !== undefined && _v > this.__max) {
	        _v = this.__max;
	      }
	      if (this.__step !== undefined && _v % this.__step !== 0) {
	        _v = Math.round(_v / this.__step) * this.__step;
	      }
	      return get(NumberController.prototype.__proto__ || Object.getPrototypeOf(NumberController.prototype), 'setValue', this).call(this, _v);
	    }
	  }, {
	    key: 'min',
	    value: function min(minValue) {
	      this.__min = minValue;
	      return this;
	    }
	  }, {
	    key: 'max',
	    value: function max(maxValue) {
	      this.__max = maxValue;
	      return this;
	    }
	  }, {
	    key: 'step',
	    value: function step(stepValue) {
	      this.__step = stepValue;
	      this.__impliedStep = stepValue;
	      this.__precision = numDecimals(stepValue);
	      return this;
	    }
	  }]);
	  return NumberController;
	}(Controller);

	function roundToDecimal(value, decimals) {
	  var tenTo = Math.pow(10, decimals);
	  return Math.round(value * tenTo) / tenTo;
	}
	var NumberControllerBox = function (_NumberController) {
	  inherits(NumberControllerBox, _NumberController);
	  function NumberControllerBox(object, property, params) {
	    classCallCheck(this, NumberControllerBox);
	    var _this2 = possibleConstructorReturn(this, (NumberControllerBox.__proto__ || Object.getPrototypeOf(NumberControllerBox)).call(this, object, property, params));
	    _this2.__truncationSuspended = false;
	    var _this = _this2;
	    var prevY = void 0;
	    function onChange() {
	      var attempted = parseFloat(_this.__input.value);
	      if (!Common.isNaN(attempted)) {
	        _this.setValue(attempted);
	      }
	    }
	    function onFinish() {
	      if (_this.__onFinishChange) {
	        _this.__onFinishChange.call(_this, _this.getValue());
	      }
	    }
	    function onBlur() {
	      onFinish();
	    }
	    function onMouseDrag(e) {
	      var diff = prevY - e.clientY;
	      _this.setValue(_this.getValue() + diff * _this.__impliedStep);
	      prevY = e.clientY;
	    }
	    function onMouseUp() {
	      dom.unbind(window, 'mousemove', onMouseDrag);
	      dom.unbind(window, 'mouseup', onMouseUp);
	      onFinish();
	    }
	    function onMouseDown(e) {
	      dom.bind(window, 'mousemove', onMouseDrag);
	      dom.bind(window, 'mouseup', onMouseUp);
	      prevY = e.clientY;
	    }
	    _this2.__input = document.createElement('input');
	    _this2.__input.setAttribute('type', 'text');
	    dom.bind(_this2.__input, 'change', onChange);
	    dom.bind(_this2.__input, 'blur', onBlur);
	    dom.bind(_this2.__input, 'mousedown', onMouseDown);
	    dom.bind(_this2.__input, 'keydown', function (e) {
	      if (e.keyCode === 13) {
	        _this.__truncationSuspended = true;
	        this.blur();
	        _this.__truncationSuspended = false;
	        onFinish();
	      }
	    });
	    _this2.updateDisplay();
	    _this2.domElement.appendChild(_this2.__input);
	    return _this2;
	  }
	  createClass(NumberControllerBox, [{
	    key: 'updateDisplay',
	    value: function updateDisplay() {
	      this.__input.value = this.__truncationSuspended ? this.getValue() : roundToDecimal(this.getValue(), this.__precision);
	      return get(NumberControllerBox.prototype.__proto__ || Object.getPrototypeOf(NumberControllerBox.prototype), 'updateDisplay', this).call(this);
	    }
	  }]);
	  return NumberControllerBox;
	}(NumberController);

	function map(v, i1, i2, o1, o2) {
	  return o1 + (o2 - o1) * ((v - i1) / (i2 - i1));
	}
	var NumberControllerSlider = function (_NumberController) {
	  inherits(NumberControllerSlider, _NumberController);
	  function NumberControllerSlider(object, property, min, max, step, newBool) {
	    classCallCheck(this, NumberControllerSlider);
	    var _this2 = possibleConstructorReturn(this, (NumberControllerSlider.__proto__ || Object.getPrototypeOf(NumberControllerSlider)).call(this, object, property, { min: min, max: max, step: step }));
	    var _this = _this2;
	    _this2.__background = document.createElement('div');
	    _this2.__foreground = document.createElement('div');
	    _this2.newBool = newBool;
	    dom.bind(_this2.__background, 'mousedown', onMouseDown, newBool);
	    dom.bind(_this2.__background, 'touchstart', onTouchStart);
	    dom.addClass(_this2.__background, 'slider');
	    dom.addClass(_this2.__foreground, 'slider-fg');
	    function onMouseDown(e) {
	      document.activeElement.blur();
	      dom.bind(window, 'mousemove', onMouseDrag);
	      dom.bind(window, 'mouseup', onMouseUp);
	      onMouseDrag(e);
	    }
	    function onMouseDrag(e) {
	      if (!_this.newBool) e.preventDefault();
	      var bgRect = _this.__background.getBoundingClientRect();
	      _this.setValue(map(e.clientX, bgRect.left, bgRect.right, _this.__min, _this.__max));
	      return false;
	    }
	    function onMouseUp() {
	      dom.unbind(window, 'mousemove', onMouseDrag);
	      dom.unbind(window, 'mouseup', onMouseUp);
	      if (_this.__onFinishChange) {
	        _this.__onFinishChange.call(_this, _this.getValue());
	      }
	    }
	    function onTouchStart(e) {
	      if (e.touches.length !== 1) {
	        return;
	      }
	      dom.bind(window, 'touchmove', onTouchMove);
	      dom.bind(window, 'touchend', onTouchEnd);
	      onTouchMove(e);
	    }
	    function onTouchMove(e) {
	      var clientX = e.touches[0].clientX;
	      var bgRect = _this.__background.getBoundingClientRect();
	      _this.setValue(map(clientX, bgRect.left, bgRect.right, _this.__min, _this.__max));
	    }
	    function onTouchEnd() {
	      dom.unbind(window, 'touchmove', onTouchMove);
	      dom.unbind(window, 'touchend', onTouchEnd);
	      if (_this.__onFinishChange) {
	        _this.__onFinishChange.call(_this, _this.getValue());
	      }
	    }
	    _this2.updateDisplay();
	    _this2.__background.appendChild(_this2.__foreground);
	    _this2.domElement.appendChild(_this2.__background);
	    return _this2;
	  }
	  createClass(NumberControllerSlider, [{
	    key: 'updateDisplay',
	    value: function updateDisplay() {
	      var pct = (this.getValue() - this.__min) / (this.__max - this.__min);
	      this.__foreground.style.width = pct * 100 + '%';
	      return get(NumberControllerSlider.prototype.__proto__ || Object.getPrototypeOf(NumberControllerSlider.prototype), 'updateDisplay', this).call(this);
	    }
	  }]);
	  return NumberControllerSlider;
	}(NumberController);

	var FunctionController = function (_Controller) {
	  inherits(FunctionController, _Controller);
	  function FunctionController(object, property, text) {
	    classCallCheck(this, FunctionController);
	    var _this2 = possibleConstructorReturn(this, (FunctionController.__proto__ || Object.getPrototypeOf(FunctionController)).call(this, object, property));
	    var _this = _this2;
	    _this2.__button = document.createElement('div');
	    _this2.__button.innerHTML = text === undefined ? 'Fire' : text;
	    dom.bind(_this2.__button, 'click', function (e) {
	      e.preventDefault();
	      _this.fire();
	      return false;
	    });
	    dom.addClass(_this2.__button, 'button');
	    _this2.domElement.appendChild(_this2.__button);
	    return _this2;
	  }
	  createClass(FunctionController, [{
	    key: 'fire',
	    value: function fire() {
	      if (this.__onChange) {
	        this.__onChange.call(this);
	      }
	      this.getValue().call(this.object);
	      if (this.__onFinishChange) {
	        this.__onFinishChange.call(this, this.getValue());
	      }
	    }
	  }]);
	  return FunctionController;
	}(Controller);

	var ColorController = function (_Controller) {
	    inherits(ColorController, _Controller);
	    function ColorController(object, property) {
	        classCallCheck(this, ColorController);
	        var _this2 = possibleConstructorReturn(this, (ColorController.__proto__ || Object.getPrototypeOf(ColorController)).call(this, object, property));
	        _this2.__color = new Color(_this2.getValue());
	        _this2.__temp = new Color(0);
	        var _this = _this2;
	        _this2.domElement = document.createElement('div');
	        dom.makeSelectable(_this2.domElement, false);
	        _this2.__selector = document.createElement('div');
	        _this2.__selector.className = 'selector';
	        _this2.__saturation_field = document.createElement('div');
	        _this2.__saturation_field.className = 'saturation-field';
	        _this2.__field_knob = document.createElement('div');
	        _this2.__field_knob.className = 'field-knob';
	        _this2.__field_knob_border = '2px solid ';
	        _this2.__hue_knob = document.createElement('div');
	        _this2.__hue_knob.className = 'hue-knob';
	        _this2.__hue_field = document.createElement('div');
	        _this2.__hue_field.className = 'hue-field';
	        _this2.__input = document.createElement('input');
	        _this2.__input.type = 'text';
	        _this2.__input_textShadow = '0 1px 1px ';
	        dom.bind(_this2.__input, 'keydown', function (e) {
	            if (e.keyCode === 13) {
	                onBlur.call(this);
	            }
	        });
	        dom.bind(_this2.__input, 'blur', onBlur);
	        dom.bind(_this2.__selector, 'mousedown', function ()        {
	            dom.addClass(this, 'drag').bind(window, 'mouseup', function ()        {
	                dom.removeClass(_this.__selector, 'drag');
	            });
	        });
	        dom.bind(_this2.__selector, 'touchstart', function ()        {
	            dom.addClass(this, 'drag').bind(window, 'touchend', function ()        {
	                dom.removeClass(_this.__selector, 'drag');
	            });
	        });
	        var valueField = document.createElement('div');
	        Common.extend(_this2.__selector.style, {
	            width: '122px',
	            height: '102px',
	            padding: '3px',
	            backgroundColor: '#222',
	            boxShadow: '0px 1px 3px rgba(0,0,0,0.3)'
	        });
	        Common.extend(_this2.__field_knob.style, {
	            position: 'absolute',
	            width: '12px',
	            height: '12px',
	            border: _this2.__field_knob_border + (_this2.__color.v < 0.5 ? '#fff' : '#000'),
	            boxShadow: '0px 1px 3px rgba(0,0,0,0.5)',
	            borderRadius: '12px',
	            zIndex: 1
	        });
	        Common.extend(_this2.__hue_knob.style, {
	            position: 'absolute',
	            width: '15px',
	            height: '2px',
	            borderRight: '4px solid #fff',
	            zIndex: 1
	        });
	        Common.extend(_this2.__saturation_field.style, {
	            width: '100px',
	            height: '100px',
	            border: '1px solid #555',
	            marginRight: '3px',
	            display: 'inline-block',
	            cursor: 'pointer'
	        });
	        Common.extend(valueField.style, {
	            width: '100%',
	            height: '100%',
	            background: 'none'
	        });
	        linearGradient(valueField, 'top', 'rgba(0,0,0,0)', '#000');
	        Common.extend(_this2.__hue_field.style, {
	            width: '15px',
	            height: '100px',
	            border: '1px solid #555',
	            cursor: 'ns-resize',
	            position: 'absolute',
	            top: '3px',
	            right: '3px'
	        });
	        hueGradient(_this2.__hue_field);
	        Common.extend(_this2.__input.style, {
	            outline: 'none',
	            textAlign: 'center',
	            color: '#fff',
	            border: 0,
	            fontWeight: 'bold',
	            textShadow: _this2.__input_textShadow + 'rgba(0,0,0,0.7)'
	        });
	        dom.bind(_this2.__saturation_field, 'mousedown', fieldDown);
	        dom.bind(_this2.__saturation_field, 'touchstart', fieldDown);
	        dom.bind(_this2.__field_knob, 'mousedown', fieldDown);
	        dom.bind(_this2.__field_knob, 'touchstart', fieldDown);
	        dom.bind(_this2.__hue_field, 'mousedown', fieldDownH);
	        dom.bind(_this2.__hue_field, 'touchstart', fieldDownH);
	        function fieldDown(e) {
	            setSV(e);
	            dom.bind(window, 'mousemove', setSV);
	            dom.bind(window, 'touchmove', setSV);
	            dom.bind(window, 'mouseup', fieldUpSV);
	            dom.bind(window, 'touchend', fieldUpSV);
	        }
	        function fieldDownH(e) {
	            setH(e);
	            dom.bind(window, 'mousemove', setH);
	            dom.bind(window, 'touchmove', setH);
	            dom.bind(window, 'mouseup', fieldUpH);
	            dom.bind(window, 'touchend', fieldUpH);
	        }
	        function fieldUpSV() {
	            dom.unbind(window, 'mousemove', setSV);
	            dom.unbind(window, 'touchmove', setSV);
	            dom.unbind(window, 'mouseup', fieldUpSV);
	            dom.unbind(window, 'touchend', fieldUpSV);
	            onFinish();
	        }
	        function fieldUpH() {
	            dom.unbind(window, 'mousemove', setH);
	            dom.unbind(window, 'touchmove', setH);
	            dom.unbind(window, 'mouseup', fieldUpH);
	            dom.unbind(window, 'touchend', fieldUpH);
	            onFinish();
	        }
	        function onBlur() {
	            var i = interpret(this.value);
	            if (i !== false) {
	                _this.__color.__state = i;
	                _this.setValue(_this.__color.toOriginal());
	            } else {
	                this.value = _this.__color.toString();
	            }
	        }
	        function onFinish() {
	            if (_this.__onFinishChange) {
	                _this.__onFinishChange.call(_this, _this.__color.toOriginal());
	            }
	        }
	        _this2.__saturation_field.appendChild(valueField);
	        _this2.__selector.appendChild(_this2.__field_knob);
	        _this2.__selector.appendChild(_this2.__saturation_field);
	        _this2.__selector.appendChild(_this2.__hue_field);
	        _this2.__hue_field.appendChild(_this2.__hue_knob);
	        _this2.domElement.appendChild(_this2.__input);
	        _this2.domElement.appendChild(_this2.__selector);
	        _this2.updateDisplay();
	        function setSV(e) {
	            if (e.type.indexOf('touch') === -1) {
	                e.preventDefault();
	            }
	            var fieldRect = _this.__saturation_field.getBoundingClientRect();
	            var _ref = e.touches && e.touches[0] || e,
	                clientX = _ref.clientX,
	                clientY = _ref.clientY;
	            var s = (clientX - fieldRect.left) / (fieldRect.right - fieldRect.left);
	            var v = 1 - (clientY - fieldRect.top) / (fieldRect.bottom - fieldRect.top);
	            if (v > 1) {
	                v = 1;
	            } else if (v < 0) {
	                v = 0;
	            }
	            if (s > 1) {
	                s = 1;
	            } else if (s < 0) {
	                s = 0;
	            }
	            _this.__color.v = v;
	            _this.__color.s = s;
	            _this.setValue(_this.__color.toOriginal());
	            return false;
	        }
	        function setH(e) {
	            if (e.type.indexOf('touch') === -1) {
	                e.preventDefault();
	            }
	            var fieldRect = _this.__hue_field.getBoundingClientRect();
	            var _ref2 = e.touches && e.touches[0] || e,
	                clientY = _ref2.clientY;
	            var h = 1 - (clientY - fieldRect.top) / (fieldRect.bottom - fieldRect.top);
	            if (h > 1) {
	                h = 1;
	            } else if (h < 0) {
	                h = 0;
	            }
	            _this.__color.h = h * 360;
	            _this.setValue(_this.__color.toOriginal());
	            return false;
	        }
	        return _this2;
	    }
	    createClass(ColorController, [{
	        key: 'updateDisplay',
	        value: function updateDisplay() {
	            var i = interpret(this.getValue());
	            if (i !== false) {
	                var mismatch = false;
	                Common.each(Color.COMPONENTS, function (component) {
	                    if (!Common.isUndefined(i[component]) && !Common.isUndefined(this.__color.__state[component]) && i[component] !== this.__color.__state[component]) {
	                        mismatch = true;
	                        return {};
	                    }
	                }, this);
	                if (mismatch) {
	                    Common.extend(this.__color.__state, i);
	                }
	            }
	            Common.extend(this.__temp.__state, this.__color.__state);
	            this.__temp.a = 1;
	            var flip = this.__color.v < 0.5 || this.__color.s > 0.5 ? 255 : 0;
	            var _flip = 255 - flip;
	            Common.extend(this.__field_knob.style, {
	                marginLeft: 100 * this.__color.s - 7 + 'px',
	                marginTop: 100 * (1 - this.__color.v) - 7 + 'px',
	                backgroundColor: this.__temp.toHexString(),
	                border: this.__field_knob_border + 'rgb(' + flip + ',' + flip + ',' + flip + ')'
	            });
	            this.__hue_knob.style.marginTop = (1 - this.__color.h / 360) * 100 + 'px';
	            this.__temp.s = 1;
	            this.__temp.v = 1;
	            linearGradient(this.__saturation_field, 'left', '#fff', this.__temp.toHexString());
	            this.__input.value = this.__color.toString();
	            Common.extend(this.__input.style, {
	                backgroundColor: this.__color.toHexString(),
	                color: 'rgb(' + flip + ',' + flip + ',' + flip + ')',
	                textShadow: this.__input_textShadow + 'rgba(' + _flip + ',' + _flip + ',' + _flip + ',.7)'
	            });
	        }
	    }]);
	    return ColorController;
	}(Controller);
	var vendors = ['-moz-', '-o-', '-webkit-', '-ms-', ''];
	function linearGradient(elem, x, a, b) {
	    elem.style.background = '';
	    Common.each(vendors, function (vendor) {
	        elem.style.cssText += 'background: ' + vendor + 'linear-gradient(' + x + ', ' + a + ' 0%, ' + b + ' 100%); ';
	    });
	}
	function hueGradient(elem) {
	    elem.style.background = '';
	    elem.style.cssText += 'background: -moz-linear-gradient(top,  #ff0000 0%, #ff00ff 17%, #0000ff 34%, #00ffff 50%, #00ff00 67%, #ffff00 84%, #ff0000 100%);';
	    elem.style.cssText += 'background: -webkit-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);';
	    elem.style.cssText += 'background: -o-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);';
	    elem.style.cssText += 'background: -ms-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);';
	    elem.style.cssText += 'background: linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);';
	}

	var ControllerFactory = function ControllerFactory(object, property) {
	  var initialValue = object[property];
	  if (Common.isArray(arguments[2]) || Common.isObject(arguments[2])) {
	    return new OptionController(object, property, arguments[2]);
	  }
	  if (Common.isNumber(initialValue)) {
	    if (Common.isNumber(arguments[2]) && Common.isNumber(arguments[3])) {
	      if (Common.isNumber(arguments[4])) {
	        return new NumberControllerSlider(object, property, arguments[2], arguments[3], arguments[4], arguments[5]);
	      }
	      return new NumberControllerSlider(object, property, arguments[2], arguments[3]);
	    }
	    if (Common.isNumber(arguments[4])) {
	      return new NumberControllerBox(object, property, { min: arguments[2], max: arguments[3], step: arguments[4] });
	    }
	    return new NumberControllerBox(object, property, { min: arguments[2], max: arguments[3] });
	  }
	  if (Common.isString(initialValue)) {
	    return new StringController(object, property);
	  }
	  if (Common.isFunction(initialValue)) {
	    return new FunctionController(object, property, '');
	  }
	  if (Common.isBoolean(initialValue)) {
	    return new BooleanController(object, property);
	  }
	  return null;
	};

	var CustomController = function (_Controller) {
	  inherits(CustomController, _Controller);
	  function CustomController(object, property) {
	    classCallCheck(this, CustomController);
	    var _this = possibleConstructorReturn(this, (CustomController.__proto__ || Object.getPrototypeOf(CustomController)).call(this, object, property));
	    _this.arguments = {
	      object: object, property: property, opts: Array.prototype.slice.call(arguments, 2)
	    };
	    if (object.property) _this.property = object.property(_this);
	    return _this;
	  }
	  createClass(CustomController, [{
	    key: 'controller',
	    set: function set$$1(newController) {
	      this._controller = newController;
	    },
	    get: function get$$1() {
	      return this._controller;
	    }
	  }]);
	  return CustomController;
	}(Controller);

	var css = {
	  load: function load(url, indoc) {
	    var doc = indoc || document;
	    var link = doc.createElement('link');
	    link.type = 'text/css';
	    link.rel = 'stylesheet';
	    link.href = url;
	    doc.getElementsByTagName('head')[0].appendChild(link);
	  },
	  inject: function inject(cssContent, indoc) {
	    var doc = indoc || document;
	    var injected = document.createElement('style');
	    injected.type = 'text/css';
	    injected.innerHTML = cssContent;
	    var head = doc.getElementsByTagName('head')[0];
	    try {
	      head.appendChild(injected);
	    } catch (e) {
	    }
	  }
	};

	var saveDialogContents = "<div id=\"dg-save\" class=\"dg dialogue\">\n\n  Here's the new load parameter for your <code>GUI</code>'s constructor:\n\n  <textarea id=\"dg-new-constructor\"></textarea>\n\n  <div id=\"dg-save-locally\">\n\n    <input id=\"dg-local-storage\" type=\"checkbox\"/> Automatically save\n    values to <code>localStorage</code> on exit.\n\n    <div id=\"dg-local-explain\">The values saved to <code>localStorage</code> will\n      override those passed to <code>dat.GUI</code>'s constructor. This makes it\n      easier to work incrementally, but <code>localStorage</code> is fragile,\n      and your friends may not see the same values you do.\n\n    </div>\n\n  </div>\n\n</div>";

	function requestAnimationFrame(callback) {
	  setTimeout(callback, 1000 / 60);
	}
	var requestAnimationFrame$1 = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || requestAnimationFrame;

	var CenteredDiv = function () {
	  function CenteredDiv() {
	    classCallCheck(this, CenteredDiv);
	    this.backgroundElement = document.createElement('div');
	    Common.extend(this.backgroundElement.style, {
	      backgroundColor: 'rgba(0,0,0,0.8)',
	      top: 0,
	      left: 0,
	      display: 'none',
	      zIndex: '1000',
	      opacity: 0,
	      WebkitTransition: 'opacity 0.2s linear',
	      transition: 'opacity 0.2s linear'
	    });
	    dom.makeFullscreen(this.backgroundElement);
	    this.backgroundElement.style.position = 'fixed';
	    this.domElement = document.createElement('div');
	    Common.extend(this.domElement.style, {
	      position: 'fixed',
	      display: 'none',
	      zIndex: '1001',
	      opacity: 0,
	      WebkitTransition: '-webkit-transform 0.2s ease-out, opacity 0.2s linear',
	      transition: 'transform 0.2s ease-out, opacity 0.2s linear'
	    });
	    document.body.appendChild(this.backgroundElement);
	    document.body.appendChild(this.domElement);
	    var _this = this;
	    dom.bind(this.backgroundElement, 'click', function () {
	      _this.hide();
	    });
	  }
	  createClass(CenteredDiv, [{
	    key: 'show',
	    value: function show() {
	      var _this = this;
	      this.backgroundElement.style.display = 'block';
	      this.domElement.style.display = 'block';
	      this.domElement.style.opacity = 0;
	      this.domElement.style.webkitTransform = 'scale(1.1)';
	      this.layout();
	      Common.defer(function () {
	        _this.backgroundElement.style.opacity = 1;
	        _this.domElement.style.opacity = 1;
	        _this.domElement.style.webkitTransform = 'scale(1)';
	      });
	    }
	  }, {
	    key: 'hide',
	    value: function hide() {
	      var _this = this;
	      var hide = function hide() {
	        _this.domElement.style.display = 'none';
	        _this.backgroundElement.style.display = 'none';
	        dom.unbind(_this.domElement, 'webkitTransitionEnd', hide);
	        dom.unbind(_this.domElement, 'transitionend', hide);
	        dom.unbind(_this.domElement, 'oTransitionEnd', hide);
	      };
	      dom.bind(this.domElement, 'webkitTransitionEnd', hide);
	      dom.bind(this.domElement, 'transitionend', hide);
	      dom.bind(this.domElement, 'oTransitionEnd', hide);
	      this.backgroundElement.style.opacity = 0;
	      this.domElement.style.opacity = 0;
	      this.domElement.style.webkitTransform = 'scale(1.1)';
	    }
	  }, {
	    key: 'layout',
	    value: function layout() {
	      this.domElement.style.left = window.innerWidth / 2 - dom.getWidth(this.domElement) / 2 + 'px';
	      this.domElement.style.top = window.innerHeight / 2 - dom.getHeight(this.domElement) / 2 + 'px';
	    }
	  }]);
	  return CenteredDiv;
	}();

	var styleSheet = ___$insertStyle(".dg ul{list-style:none;margin:0;padding:0;width:100%;clear:both}.dg.ac{position:fixed;top:0;left:0;right:0;height:0;z-index:0}.dg:not(.ac) .main{overflow:hidden}.dg.main{-webkit-transition:opacity .1s linear;-o-transition:opacity .1s linear;-moz-transition:opacity .1s linear;transition:opacity .1s linear}.dg.main.taller-than-window{overflow-y:auto}.dg.main.taller-than-window .close-button{opacity:1;margin-top:-1px;border-top:1px solid #2c2c2c}.dg.main ul.closed .close-button{opacity:1 !important}.dg.main:hover .close-button,.dg.main .close-button.drag{opacity:1}.dg.main .close-button{-webkit-transition:opacity .1s linear;-o-transition:opacity .1s linear;-moz-transition:opacity .1s linear;transition:opacity .1s linear;border:0;line-height:19px;height:20px;cursor:pointer;text-align:center;background-color:#000}.dg.main .close-button.close-top{position:relative}.dg.main .close-button.close-bottom{position:absolute}.dg.main .close-button:hover{background-color:#111}.dg.a{float:right;margin-right:15px;overflow-y:visible}.dg.a.has-save>ul.close-top{margin-top:0}.dg.a.has-save>ul.close-bottom{margin-top:27px}.dg.a.has-save>ul.closed{margin-top:0}.dg.a .save-row{top:0;z-index:1002}.dg.a .save-row.close-top{position:relative}.dg.a .save-row.close-bottom{position:fixed}.dg li{-webkit-transition:height .1s ease-out;-o-transition:height .1s ease-out;-moz-transition:height .1s ease-out;transition:height .1s ease-out;-webkit-transition:overflow .1s linear;-o-transition:overflow .1s linear;-moz-transition:overflow .1s linear;transition:overflow .1s linear}.dg li:not(.folder){cursor:auto;height:27px;line-height:27px;padding:0 4px 0 5px}.dg li.folder{padding:0;border-left:4px solid rgba(0,0,0,0)}.dg li.title{cursor:pointer;margin-left:-4px}.dg .closed li:not(.title),.dg .closed ul li,.dg .closed ul li>*{height:0;overflow:hidden;border:0}.dg .cr{clear:both;padding-left:3px;height:27px;overflow:hidden}.dg .property-name{cursor:default;float:left;clear:left;width:40%;overflow:hidden;text-overflow:ellipsis}.dg .c{float:left;width:60%;position:relative}.dg .c input[type=text]{border:0;margin-top:4px;padding:3px;width:100%;float:right}.dg .has-slider input[type=text]{width:30%;margin-left:0}.dg .slider{float:left;width:66%;margin-left:-5px;margin-right:0;height:19px;margin-top:4px}.dg .slider-fg{height:100%}.dg .c input[type=checkbox]{margin-top:7px}.dg .c select{margin-top:5px}.dg .cr.function,.dg .cr.function .property-name,.dg .cr.function *,.dg .cr.boolean,.dg .cr.boolean *{cursor:pointer}.dg .cr.color{overflow:visible}.dg .selector{display:none;position:absolute;margin-left:-9px;margin-top:23px;z-index:10}.dg .c:hover .selector,.dg .selector.drag{display:block}.dg li.save-row{padding:0}.dg li.save-row .button{display:inline-block;padding:0px 6px}.dg.dialogue{background-color:#222;width:460px;padding:15px;font-size:13px;line-height:15px}#dg-new-constructor{padding:10px;color:#222;font-family:Monaco, monospace;font-size:10px;border:0;resize:none;box-shadow:inset 1px 1px 1px #888;word-wrap:break-word;margin:12px 0;display:block;width:440px;overflow-y:scroll;height:100px;position:relative}#dg-local-explain{display:none;font-size:11px;line-height:17px;border-radius:3px;background-color:#333;padding:8px;margin-top:10px}#dg-local-explain code{font-size:10px}#dat-gui-save-locally{display:none}.dg{color:#eee;font:11px 'Lucida Grande', sans-serif;text-shadow:0 -1px 0 #111}.dg.main::-webkit-scrollbar{width:5px;background:#1a1a1a}.dg.main::-webkit-scrollbar-corner{height:0;display:none}.dg.main::-webkit-scrollbar-thumb{border-radius:5px;background:#676767}.dg li:not(.folder){background:#1a1a1a;border-bottom:1px solid #2c2c2c}.dg li.save-row{line-height:25px;background:#dad5cb;border:0}.dg li.save-row select{margin-left:5px;width:108px}.dg li.save-row .button{margin-left:5px;margin-top:1px;border-radius:2px;font-size:9px;line-height:7px;padding:4px 4px 5px 4px;background:#c5bdad;color:#fff;text-shadow:0 1px 0 #b0a58f;box-shadow:0 -1px 0 #b0a58f;cursor:pointer}.dg li.save-row .button.gears{background:#c5bdad url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAANCAYAAAB/9ZQ7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAQJJREFUeNpiYKAU/P//PwGIC/ApCABiBSAW+I8AClAcgKxQ4T9hoMAEUrxx2QSGN6+egDX+/vWT4e7N82AMYoPAx/evwWoYoSYbACX2s7KxCxzcsezDh3evFoDEBYTEEqycggWAzA9AuUSQQgeYPa9fPv6/YWm/Acx5IPb7ty/fw+QZblw67vDs8R0YHyQhgObx+yAJkBqmG5dPPDh1aPOGR/eugW0G4vlIoTIfyFcA+QekhhHJhPdQxbiAIguMBTQZrPD7108M6roWYDFQiIAAv6Aow/1bFwXgis+f2LUAynwoIaNcz8XNx3Dl7MEJUDGQpx9gtQ8YCueB+D26OECAAQDadt7e46D42QAAAABJRU5ErkJggg==) 2px 1px no-repeat;height:7px;width:8px}.dg li.save-row .button:hover{background-color:#bab19e;box-shadow:0 -1px 0 #b0a58f}.dg li.folder{border-bottom:0}.dg li.title{padding-left:16px;background:#000 url(data:image/gif;base64,R0lGODlhBQAFAJEAAP////Pz8////////yH5BAEAAAIALAAAAAAFAAUAAAIIlI+hKgFxoCgAOw==) 6px 10px no-repeat;cursor:pointer;border-bottom:1px solid rgba(255,255,255,0.2)}.dg .closed li.title{background-image:url(data:image/gif;base64,R0lGODlhBQAFAJEAAP////Pz8////////yH5BAEAAAIALAAAAAAFAAUAAAIIlGIWqMCbWAEAOw==)}.dg .cr.boolean{border-left:3px solid #806787}.dg .cr.color{border-left:3px solid}.dg .cr.function{border-left:3px solid #e61d5f}.dg .cr.number{border-left:3px solid #2FA1D6}.dg .cr.number input[type=text]{color:#2FA1D6}.dg .cr.string{border-left:3px solid #1ed36f}.dg .cr.string input[type=text]{color:#1ed36f}.dg .cr.function:hover,.dg .cr.boolean:hover{background:#111}.dg .c input[type=text]{background:#303030;outline:none}.dg .c input[type=text]:hover{background:#3c3c3c}.dg .c input[type=text]:focus{background:#494949;color:#fff}.dg .c .slider{background:#303030;cursor:ew-resize}.dg .c .slider-fg{background:#2FA1D6;max-width:100%}.dg .c .slider:hover{background:#3c3c3c}.dg .c .slider:hover .slider-fg{background:#44abda}\n");

	css.inject(styleSheet);
	var CSS_NAMESPACE = 'dg';
	var HIDE_KEY_CODE = 72;
	var CLOSE_BUTTON_HEIGHT = 20;
	var DEFAULT_DEFAULT_PRESET_NAME = 'Default';
	var SUPPORTS_LOCAL_STORAGE = function () {
	  try {
	    return !!window.localStorage;
	  } catch (e) {
	    return false;
	  }
	}();
	var SAVE_DIALOGUE = void 0;
	var autoPlaceVirgin = true;
	var autoPlaceContainer = void 0;
	var hide = false;
	var hideableGuis = [];
	var GUI = function GUI(pars) {
	  var _this = this;
	  var params = pars || {};
	  this.domElement = document.createElement('div');
	  this.__ul = document.createElement('ul');
	  this.domElement.appendChild(this.__ul);
	  dom.addClass(this.domElement, CSS_NAMESPACE);
	  this.__folders = {};
	  this.__controllers = [];
	  this.__rememberedObjects = [];
	  this.__rememberedObjectIndecesToControllers = [];
	  this.__listening = [];
	  params = Common.defaults(params, {
	    closeOnTop: false,
	    autoPlace: true,
	    width: GUI.DEFAULT_WIDTH
	  });
	  params = Common.defaults(params, {
	    resizable: params.autoPlace,
	    hideable: params.autoPlace
	  });
	  if (!Common.isUndefined(params.load)) {
	    if (params.preset) {
	      params.load.preset = params.preset;
	    }
	  } else {
	    params.load = { preset: DEFAULT_DEFAULT_PRESET_NAME };
	  }
	  if (Common.isUndefined(params.parent) && params.hideable) {
	    hideableGuis.push(this);
	  }
	  params.resizable = Common.isUndefined(params.parent) && params.resizable;
	  if (params.autoPlace && Common.isUndefined(params.scrollable)) {
	    params.scrollable = true;
	  }
	  var useLocalStorage = SUPPORTS_LOCAL_STORAGE && localStorage.getItem(getLocalStorageHash(this, 'isLocal')) === 'true';
	  var saveToLocalStorage = void 0;
	  var titleRow = void 0;
	  Object.defineProperties(this,
	  {
	    parent: {
	      get: function get$$1() {
	        return params.parent;
	      }
	    },
	    scrollable: {
	      get: function get$$1() {
	        return params.scrollable;
	      }
	    },
	    autoPlace: {
	      get: function get$$1() {
	        return params.autoPlace;
	      }
	    },
	    closeOnTop: {
	      get: function get$$1() {
	        return params.closeOnTop;
	      }
	    },
	    preset: {
	      get: function get$$1() {
	        if (_this.parent) {
	          return _this.getRoot().preset;
	        }
	        return params.load.preset;
	      },
	      set: function set$$1(v) {
	        if (_this.parent) {
	          _this.getRoot().preset = v;
	        } else {
	          params.load.preset = v;
	        }
	        setPresetSelectIndex(this);
	        _this.revert();
	      }
	    },
	    width: {
	      get: function get$$1() {
	        return params.width;
	      },
	      set: function set$$1(v) {
	        params.width = v;
	        setWidth(_this, v);
	      }
	    },
	    name: {
	      get: function get$$1() {
	        return params.name;
	      },
	      set: function set$$1(v) {
	        params.name = v;
	        if (titleRow) {
	          titleRow.innerHTML = params.name;
	        }
	      }
	    },
	    closed: {
	      get: function get$$1() {
	        return params.closed;
	      },
	      set: function set$$1(v) {
	        params.closed = v;
	        if (params.closed) {
	          dom.addClass(_this.__ul, GUI.CLASS_CLOSED);
	        } else {
	          dom.removeClass(_this.__ul, GUI.CLASS_CLOSED);
	        }
	        this.onResize();
	        if (_this.__closeButton) {
	          _this.__closeButton.innerHTML = v ? GUI.TEXT_OPEN : GUI.TEXT_CLOSED;
	        }
	      }
	    },
	    load: {
	      get: function get$$1() {
	        return params.load;
	      }
	    },
	    useLocalStorage: {
	      get: function get$$1() {
	        return useLocalStorage;
	      },
	      set: function set$$1(bool) {
	        if (SUPPORTS_LOCAL_STORAGE) {
	          useLocalStorage = bool;
	          if (bool) {
	            dom.bind(window, 'unload', saveToLocalStorage);
	          } else {
	            dom.unbind(window, 'unload', saveToLocalStorage);
	          }
	          localStorage.setItem(getLocalStorageHash(_this, 'isLocal'), bool);
	        }
	      }
	    }
	  });
	  if (Common.isUndefined(params.parent)) {
	    this.closed = params.closed || false;
	    dom.addClass(this.domElement, GUI.CLASS_MAIN);
	    dom.makeSelectable(this.domElement, false);
	    if (SUPPORTS_LOCAL_STORAGE) {
	      if (useLocalStorage) {
	        _this.useLocalStorage = true;
	        var savedGui = localStorage.getItem(getLocalStorageHash(this, 'gui'));
	        if (savedGui) {
	          params.load = JSON.parse(savedGui);
	        }
	      }
	    }
	    this.__closeButton = document.createElement('div');
	    this.__closeButton.innerHTML = GUI.TEXT_CLOSED;
	    dom.addClass(this.__closeButton, GUI.CLASS_CLOSE_BUTTON);
	    if (params.closeOnTop) {
	      dom.addClass(this.__closeButton, GUI.CLASS_CLOSE_TOP);
	      this.domElement.insertBefore(this.__closeButton, this.domElement.childNodes[0]);
	    } else {
	      dom.addClass(this.__closeButton, GUI.CLASS_CLOSE_BOTTOM);
	      this.domElement.appendChild(this.__closeButton);
	    }
	    dom.bind(this.__closeButton, 'click', function () {
	      _this.closed = !_this.closed;
	    });
	  } else {
	    if (params.closed === undefined) {
	      params.closed = true;
	    }
	    var titleRowName = document.createTextNode(params.name);
	    dom.addClass(titleRowName, 'controller-name');
	    titleRow = addRow(_this, titleRowName);
	    var onClickTitle = function onClickTitle(e) {
	      e.preventDefault();
	      _this.closed = !_this.closed;
	      return false;
	    };
	    dom.addClass(this.__ul, GUI.CLASS_CLOSED);
	    dom.addClass(titleRow, 'title');
	    dom.bind(titleRow, 'click', onClickTitle);
	    if (!params.closed) {
	      this.closed = false;
	    }
	  }
	  if (params.autoPlace) {
	    if (Common.isUndefined(params.parent)) {
	      if (autoPlaceVirgin) {
	        autoPlaceContainer = document.createElement('div');
	        dom.addClass(autoPlaceContainer, CSS_NAMESPACE);
	        dom.addClass(autoPlaceContainer, GUI.CLASS_AUTO_PLACE_CONTAINER);
	        document.body.appendChild(autoPlaceContainer);
	        autoPlaceVirgin = false;
	      }
	      autoPlaceContainer.appendChild(this.domElement);
	      dom.addClass(this.domElement, GUI.CLASS_AUTO_PLACE);
	    }
	    if (!this.parent) {
	      setWidth(_this, params.width);
	    }
	  }
	  this.__resizeHandler = function () {
	    _this.onResizeDebounced();
	  };
	  dom.bind(window, 'resize', this.__resizeHandler);
	  dom.bind(this.__ul, 'webkitTransitionEnd', this.__resizeHandler);
	  dom.bind(this.__ul, 'transitionend', this.__resizeHandler);
	  dom.bind(this.__ul, 'oTransitionEnd', this.__resizeHandler);
	  this.onResize();
	  if (params.resizable) {
	    addResizeHandle(this);
	  }
	  saveToLocalStorage = function saveToLocalStorage() {
	    if (SUPPORTS_LOCAL_STORAGE && localStorage.getItem(getLocalStorageHash(_this, 'isLocal')) === 'true') {
	      localStorage.setItem(getLocalStorageHash(_this, 'gui'), JSON.stringify(_this.getSaveObject()));
	    }
	  };
	  this.saveToLocalStorageIfPossible = saveToLocalStorage;
	  function resetWidth() {
	    var root = _this.getRoot();
	    root.width += 1;
	    Common.defer(function () {
	      root.width -= 1;
	    });
	  }
	  if (!params.parent) {
	    resetWidth();
	  }
	};
	GUI.toggleHide = function () {
	  hide = !hide;
	  Common.each(hideableGuis, function (gui) {
	    gui.domElement.style.display = hide ? 'none' : '';
	  });
	};
	GUI.CLASS_AUTO_PLACE = 'a';
	GUI.CLASS_AUTO_PLACE_CONTAINER = 'ac';
	GUI.CLASS_MAIN = 'main';
	GUI.CLASS_CONTROLLER_ROW = 'cr';
	GUI.CLASS_TOO_TALL = 'taller-than-window';
	GUI.CLASS_CLOSED = 'closed';
	GUI.CLASS_CLOSE_BUTTON = 'close-button';
	GUI.CLASS_CLOSE_TOP = 'close-top';
	GUI.CLASS_CLOSE_BOTTOM = 'close-bottom';
	GUI.CLASS_DRAG = 'drag';
	GUI.DEFAULT_WIDTH = 245;
	GUI.TEXT_CLOSED = 'Close Controls';
	GUI.TEXT_OPEN = 'Open Controls';
	GUI._keydownHandler = function (e) {
	  if (document.activeElement.type !== 'text' && (e.which === HIDE_KEY_CODE || e.keyCode === HIDE_KEY_CODE)) {
	    GUI.toggleHide();
	  }
	};
	dom.bind(window, 'keydown', GUI._keydownHandler, false);
	Common.extend(GUI.prototype,
	{
	  add: function add(object, property) {
	    return _add(this, object, property, {
	      factoryArgs: Array.prototype.slice.call(arguments, 2)
	    });
	  },
	  addColor: function addColor(object, property) {
	    return _add(this, object, property, {
	      color: true
	    });
	  },
	  remove: function remove(controller) {
	    this.__ul.removeChild(controller.__li);
	    this.__controllers.splice(this.__controllers.indexOf(controller), 1);
	    var _this = this;
	    Common.defer(function () {
	      _this.onResize();
	    });
	  },
	  destroy: function destroy() {
	    if (this.parent) {
	      throw new Error('Only the root GUI should be removed with .destroy(). ' + 'For subfolders, use gui.removeFolder(folder) instead.');
	    }
	    if (this.autoPlace) {
	      autoPlaceContainer.removeChild(this.domElement);
	    }
	    var _this = this;
	    Common.each(this.__folders, function (subfolder) {
	      _this.removeFolder(subfolder);
	    });
	    dom.unbind(window, 'keydown', GUI._keydownHandler, false);
	    removeListeners(this);
	  },
	  addFolder: function addFolder(name) {
	    if (this.__folders[name] !== undefined) {
	      throw new Error('You already have a folder in this GUI by the' + ' name "' + name + '"');
	    }
	    var newGuiParams = { name: name, parent: this };
	    newGuiParams.autoPlace = this.autoPlace;
	    if (this.load &&
	    this.load.folders &&
	    this.load.folders[name]) {
	      newGuiParams.closed = this.load.folders[name].closed;
	      newGuiParams.load = this.load.folders[name];
	    }
	    var gui = new GUI(newGuiParams);
	    this.__folders[name] = gui;
	    var li = addRow(this, gui.domElement);
	    dom.addClass(li, 'folder');
	    return gui;
	  },
	  removeFolder: function removeFolder(folder) {
	    this.__ul.removeChild(folder.domElement.parentElement);
	    delete this.__folders[folder.name];
	    if (this.load &&
	    this.load.folders &&
	    this.load.folders[folder.name]) {
	      delete this.load.folders[folder.name];
	    }
	    removeListeners(folder);
	    var _this = this;
	    Common.each(folder.__folders, function (subfolder) {
	      folder.removeFolder(subfolder);
	    });
	    Common.defer(function () {
	      _this.onResize();
	    });
	  },
	  open: function open() {
	    this.closed = false;
	  },
	  close: function close() {
	    this.closed = true;
	  },
	  hide: function hide() {
	    this.domElement.style.display = 'none';
	  },
	  show: function show() {
	    this.domElement.style.display = '';
	  },
	  onResize: function onResize() {
	    var root = this.getRoot();
	    if (root.scrollable) {
	      var top = dom.getOffset(root.__ul).top;
	      var h = 0;
	      Common.each(root.__ul.childNodes, function (node) {
	        if (!(root.autoPlace && node === root.__save_row)) {
	          h += dom.getHeight(node);
	        }
	      });
	      if (window.innerHeight - top - CLOSE_BUTTON_HEIGHT < h) {
	        dom.addClass(root.domElement, GUI.CLASS_TOO_TALL);
	        root.__ul.style.height = window.innerHeight - top - CLOSE_BUTTON_HEIGHT + 'px';
	      } else {
	        dom.removeClass(root.domElement, GUI.CLASS_TOO_TALL);
	        root.__ul.style.height = 'auto';
	      }
	    }
	    if (root.__resize_handle) {
	      Common.defer(function () {
	        root.__resize_handle.style.height = root.__ul.offsetHeight + 'px';
	      });
	    }
	    if (root.__closeButton) {
	      root.__closeButton.style.width = root.width + 'px';
	    }
	  },
	  onResizeDebounced: Common.debounce(function () {
	    this.onResize();
	  }, 50),
	  remember: function remember() {
	    if (Common.isUndefined(SAVE_DIALOGUE)) {
	      SAVE_DIALOGUE = new CenteredDiv();
	      SAVE_DIALOGUE.domElement.innerHTML = saveDialogContents;
	    }
	    if (this.parent) {
	      throw new Error('You can only call remember on a top level GUI.');
	    }
	    var _this = this;
	    Common.each(Array.prototype.slice.call(arguments), function (object) {
	      if (_this.__rememberedObjects.length === 0) {
	        addSaveMenu(_this);
	      }
	      if (_this.__rememberedObjects.indexOf(object) === -1) {
	        _this.__rememberedObjects.push(object);
	      }
	    });
	    if (this.autoPlace) {
	      setWidth(this, this.width);
	    }
	  },
	  getRoot: function getRoot() {
	    var gui = this;
	    while (gui.parent) {
	      gui = gui.parent;
	    }
	    return gui;
	  },
	  getSaveObject: function getSaveObject() {
	    var toReturn = this.load;
	    toReturn.closed = this.closed;
	    if (this.__rememberedObjects.length > 0) {
	      toReturn.preset = this.preset;
	      if (!toReturn.remembered) {
	        toReturn.remembered = {};
	      }
	      toReturn.remembered[this.preset] = getCurrentPreset(this);
	    }
	    toReturn.folders = {};
	    Common.each(this.__folders, function (element, key) {
	      toReturn.folders[key] = element.getSaveObject();
	    });
	    return toReturn;
	  },
	  save: function save() {
	    if (!this.load.remembered) {
	      this.load.remembered = {};
	    }
	    this.load.remembered[this.preset] = getCurrentPreset(this);
	    markPresetModified(this, false);
	    this.saveToLocalStorageIfPossible();
	  },
	  saveAs: function saveAs(presetName) {
	    if (!this.load.remembered) {
	      this.load.remembered = {};
	      this.load.remembered[DEFAULT_DEFAULT_PRESET_NAME] = getCurrentPreset(this, true);
	    }
	    this.load.remembered[presetName] = getCurrentPreset(this);
	    this.preset = presetName;
	    addPresetOption(this, presetName, true);
	    this.saveToLocalStorageIfPossible();
	  },
	  revert: function revert(gui) {
	    Common.each(this.__controllers, function (controller) {
	      if (!this.getRoot().load.remembered) {
	        controller.setValue(controller.initialValue);
	      } else {
	        recallSavedValue(gui || this.getRoot(), controller);
	      }
	      if (controller.__onFinishChange) {
	        controller.__onFinishChange.call(controller, controller.getValue());
	      }
	    }, this);
	    Common.each(this.__folders, function (folder) {
	      folder.revert(folder);
	    });
	    if (!gui) {
	      markPresetModified(this.getRoot(), false);
	    }
	  },
	  listen: function listen(controller) {
	    var init = this.__listening.length === 0;
	    this.__listening.push(controller);
	    if (init) {
	      updateDisplays(this.__listening);
	    }
	  },
	  updateDisplay: function updateDisplay() {
	    Common.each(this.__controllers, function (controller) {
	      controller.updateDisplay();
	    });
	    Common.each(this.__folders, function (folder) {
	      folder.updateDisplay();
	    });
	  }
	});
	function addRow(gui, newDom, liBefore) {
	  var li = document.createElement('li');
	  if (newDom) {
	    li.appendChild(newDom);
	  }
	  if (liBefore) {
	    gui.__ul.insertBefore(li, liBefore);
	  } else {
	    gui.__ul.appendChild(li);
	  }
	  gui.onResize();
	  return li;
	}
	function removeListeners(gui) {
	  dom.unbind(window, 'resize', gui.__resizeHandler);
	  if (gui.saveToLocalStorageIfPossible) {
	    dom.unbind(window, 'unload', gui.saveToLocalStorageIfPossible);
	  }
	}
	function markPresetModified(gui, modified) {
	  var opt = gui.__preset_select[gui.__preset_select.selectedIndex];
	  if (modified) {
	    opt.innerHTML = opt.value + '*';
	  } else {
	    opt.innerHTML = opt.value;
	  }
	}
	function augmentController(gui, li, controller) {
	  controller.__li = li;
	  controller.__gui = gui;
	  Common.extend(controller,                                   {
	    options: function options(_options) {
	      if (arguments.length > 1) {
	        var nextSibling = controller.__li.nextElementSibling;
	        controller.remove();
	        return _add(gui, controller.object, controller.property, {
	          before: nextSibling,
	          factoryArgs: [Common.toArray(arguments)]
	        });
	      }
	      if (Common.isArray(_options) || Common.isObject(_options)) {
	        var _nextSibling = controller.__li.nextElementSibling;
	        controller.remove();
	        return _add(gui, controller.object, controller.property, {
	          before: _nextSibling,
	          factoryArgs: [_options]
	        });
	      }
	    },
	    name: function name(_name) {
	      controller.__li.firstElementChild.firstElementChild.innerHTML = _name;
	      return controller;
	    },
	    listen: function listen() {
	      controller.__gui.listen(controller);
	      return controller;
	    },
	    remove: function remove() {
	      controller.__gui.remove(controller);
	      return controller;
	    }
	  });
	  if (controller instanceof NumberControllerSlider) {
	    var box = new NumberControllerBox(controller.object, controller.property, { min: controller.__min, max: controller.__max, step: controller.__step });
	    Common.each(['updateDisplay', 'onChange', 'onFinishChange', 'step', 'min', 'max'], function (method) {
	      var pc = controller[method];
	      var pb = box[method];
	      controller[method] = box[method] = function () {
	        var args = Array.prototype.slice.call(arguments);
	        pb.apply(box, args);
	        return pc.apply(controller, args);
	      };
	    });
	    dom.addClass(li, 'has-slider');
	    controller.domElement.insertBefore(box.domElement, controller.domElement.firstElementChild);
	  } else if (controller instanceof NumberControllerBox) {
	    var r = function r(returned) {
	      if (Common.isNumber(controller.__min) && Common.isNumber(controller.__max)) {
	        var oldName = controller.__li.firstElementChild.firstElementChild.innerHTML;
	        var wasListening = controller.__gui.__listening.indexOf(controller) > -1;
	        controller.remove();
	        var newController = _add(gui, controller.object, controller.property, {
	          before: controller.__li.nextElementSibling,
	          factoryArgs: [controller.__min, controller.__max, controller.__step]
	        });
	        newController.name(oldName);
	        if (wasListening) newController.listen();
	        return newController;
	      }
	      return returned;
	    };
	    controller.min = Common.compose(r, controller.min);
	    controller.max = Common.compose(r, controller.max);
	  } else if (controller instanceof BooleanController) {
	    dom.bind(li, 'click', function () {
	      dom.fakeEvent(controller.__checkbox, 'click');
	    });
	    dom.bind(controller.__checkbox, 'click', function (e) {
	      e.stopPropagation();
	    });
	  } else if (controller instanceof FunctionController) {
	    dom.bind(li, 'click', function () {
	      dom.fakeEvent(controller.__button, 'click');
	    });
	    dom.bind(li, 'mouseover', function () {
	      dom.addClass(controller.__button, 'hover');
	    });
	    dom.bind(li, 'mouseout', function () {
	      dom.removeClass(controller.__button, 'hover');
	    });
	  } else if (controller instanceof ColorController) {
	    dom.addClass(li, 'color');
	    controller.updateDisplay = Common.compose(function (val) {
	      li.style.borderLeftColor = controller.__color.toString();
	      return val;
	    }, controller.updateDisplay);
	    controller.updateDisplay();
	  }
	  controller.setValue = Common.compose(function (val) {
	    if (gui.getRoot().__preset_select && controller.isModified()) {
	      markPresetModified(gui.getRoot(), true);
	    }
	    return val;
	  }, controller.setValue);
	}
	function recallSavedValue(gui, controller) {
	  var root = gui.getRoot();
	  var matchedIndex = root.__rememberedObjects.indexOf(controller.object);
	  if (matchedIndex !== -1) {
	    var controllerMap = root.__rememberedObjectIndecesToControllers[matchedIndex];
	    if (controllerMap === undefined) {
	      controllerMap = {};
	      root.__rememberedObjectIndecesToControllers[matchedIndex] = controllerMap;
	    }
	    controllerMap[controller.property] = controller;
	    if (root.load && root.load.remembered) {
	      var presetMap = root.load.remembered;
	      var preset = void 0;
	      if (presetMap[gui.preset]) {
	        preset = presetMap[gui.preset];
	      } else if (presetMap[DEFAULT_DEFAULT_PRESET_NAME]) {
	        preset = presetMap[DEFAULT_DEFAULT_PRESET_NAME];
	      } else {
	        return;
	      }
	      if (preset[matchedIndex] && preset[matchedIndex][controller.property] !== undefined) {
	        var value = preset[matchedIndex][controller.property];
	        controller.initialValue = value;
	        controller.setValue(value);
	      }
	    }
	  }
	}
	function _add(gui, object, property, params) {
	  var customObject;
	  if (object.arguments) {
	    customObject = object;
	    object = customObject.arguments.object;
	    property = customObject.arguments.property;
	    params = {
	      factoryArgs: customObject.arguments.opts
	    };
	  }
	  if (customObject === undefined && object[property] === undefined) {
	    throw new Error('Object "' + object + '" has no property "' + property + '"');
	  }
	  var controller = void 0;
	  if (params.color) {
	    controller = new ColorController(object, property);
	  } else if (customObject !== undefined && typeof customObject.property === "string") {
	    controller = customObject;
	  } else {
	    var factoryArgs = [object, property].concat(params.factoryArgs);
	    controller = ControllerFactory.apply(gui, factoryArgs);
	  }
	  if (controller === null) controller = customObject;else if (customObject !== undefined) customObject.controller = controller;
	  if (params.before instanceof Controller) {
	    params.before = params.before.__li;
	  }
	  recallSavedValue(gui, controller);
	  dom.addClass(controller.domElement, 'c');
	  var name = document.createElement('span');
	  dom.addClass(name, 'property-name');
	  if (customObject !== undefined && _typeof(customObject.property) === "object") {
	    for (var propertyName in customObject.property) {
	      name.appendChild(customObject.property[propertyName]);
	    }
	  } else name.innerHTML = controller.property;
	  var container = document.createElement('div');
	  container.appendChild(name);
	  container.appendChild(controller.domElement);
	  var li = addRow(gui, container, params.before);
	  dom.addClass(li, GUI.CLASS_CONTROLLER_ROW);
	  if (controller instanceof ColorController) {
	    dom.addClass(li, 'color');
	  } else {
	    dom.addClass(li, _typeof(controller.getValue()));
	  }
	  augmentController(gui, li, controller);
	  gui.__controllers.push(controller);
	  return controller;
	}
	function getLocalStorageHash(gui, key) {
	  return document.location.href + '.' + key;
	}
	function addPresetOption(gui, name, setSelected) {
	  var opt = document.createElement('option');
	  opt.innerHTML = name;
	  opt.value = name;
	  gui.__preset_select.appendChild(opt);
	  if (setSelected) {
	    gui.__preset_select.selectedIndex = gui.__preset_select.length - 1;
	  }
	}
	function showHideExplain(gui, explain) {
	  explain.style.display = gui.useLocalStorage ? 'block' : 'none';
	}
	function addSaveMenu(gui) {
	  var div = gui.__save_row = document.createElement('li');
	  dom.addClass(gui.domElement, 'has-save');
	  gui.__ul.insertBefore(div, gui.__ul.firstChild);
	  dom.addClass(div, 'save-row');
	  var gears = document.createElement('span');
	  gears.innerHTML = '&nbsp;';
	  dom.addClass(gears, 'button gears');
	  var button = document.createElement('span');
	  button.innerHTML = 'Save';
	  dom.addClass(button, 'button');
	  dom.addClass(button, 'save');
	  var button2 = document.createElement('span');
	  button2.innerHTML = 'New';
	  dom.addClass(button2, 'button');
	  dom.addClass(button2, 'save-as');
	  var button3 = document.createElement('span');
	  button3.innerHTML = 'Revert';
	  dom.addClass(button3, 'button');
	  dom.addClass(button3, 'revert');
	  var select = gui.__preset_select = document.createElement('select');
	  if (gui.load && gui.load.remembered) {
	    Common.each(gui.load.remembered, function (value, key) {
	      addPresetOption(gui, key, key === gui.preset);
	    });
	  } else {
	    addPresetOption(gui, DEFAULT_DEFAULT_PRESET_NAME, false);
	  }
	  dom.bind(select, 'change', function () {
	    for (var index = 0; index < gui.__preset_select.length; index++) {
	      gui.__preset_select[index].innerHTML = gui.__preset_select[index].value;
	    }
	    gui.preset = this.value;
	  });
	  div.appendChild(select);
	  div.appendChild(gears);
	  div.appendChild(button);
	  div.appendChild(button2);
	  div.appendChild(button3);
	  if (SUPPORTS_LOCAL_STORAGE) {
	    var explain = document.getElementById('dg-local-explain');
	    var localStorageCheckBox = document.getElementById('dg-local-storage');
	    var saveLocally = document.getElementById('dg-save-locally');
	    saveLocally.style.display = 'block';
	    if (localStorage.getItem(getLocalStorageHash(gui, 'isLocal')) === 'true') {
	      localStorageCheckBox.setAttribute('checked', 'checked');
	    }
	    showHideExplain(gui, explain);
	    dom.bind(localStorageCheckBox, 'change', function () {
	      gui.useLocalStorage = !gui.useLocalStorage;
	      showHideExplain(gui, explain);
	    });
	  }
	  var newConstructorTextArea = document.getElementById('dg-new-constructor');
	  dom.bind(newConstructorTextArea, 'keydown', function (e) {
	    if (e.metaKey && (e.which === 67 || e.keyCode === 67)) {
	      SAVE_DIALOGUE.hide();
	    }
	  });
	  dom.bind(gears, 'click', function () {
	    newConstructorTextArea.innerHTML = JSON.stringify(gui.getSaveObject(), undefined, 2);
	    SAVE_DIALOGUE.show();
	    newConstructorTextArea.focus();
	    newConstructorTextArea.select();
	  });
	  dom.bind(button, 'click', function () {
	    gui.save();
	  });
	  dom.bind(button2, 'click', function () {
	    var presetName = prompt('Enter a new preset name.');
	    if (presetName) {
	      gui.saveAs(presetName);
	    }
	  });
	  dom.bind(button3, 'click', function () {
	    gui.revert();
	  });
	}
	function addResizeHandle(gui) {
	  var pmouseX = void 0;
	  gui.__resize_handle = document.createElement('div');
	  Common.extend(gui.__resize_handle.style, {
	    width: '6px',
	    marginLeft: '-3px',
	    height: '200px',
	    cursor: 'ew-resize',
	    position: 'absolute'
	  });
	  function drag(e) {
	    e.preventDefault();
	    gui.width += pmouseX - e.clientX;
	    gui.onResize();
	    pmouseX = e.clientX;
	    return false;
	  }
	  function dragStop() {
	    dom.removeClass(gui.__closeButton, GUI.CLASS_DRAG);
	    dom.unbind(window, 'mousemove', drag);
	    dom.unbind(window, 'mouseup', dragStop);
	  }
	  function dragStart(e) {
	    e.preventDefault();
	    pmouseX = e.clientX;
	    dom.addClass(gui.__closeButton, GUI.CLASS_DRAG);
	    dom.bind(window, 'mousemove', drag);
	    dom.bind(window, 'mouseup', dragStop);
	    return false;
	  }
	  dom.bind(gui.__resize_handle, 'mousedown', dragStart);
	  dom.bind(gui.__closeButton, 'mousedown', dragStart);
	  gui.domElement.insertBefore(gui.__resize_handle, gui.domElement.firstElementChild);
	}
	function setWidth(gui, w) {
	  gui.domElement.style.width = w + 'px';
	  if (gui.__save_row && gui.autoPlace) {
	    gui.__save_row.style.width = w + 'px';
	  }
	  if (gui.__closeButton) {
	    gui.__closeButton.style.width = w + 'px';
	  }
	}
	function getCurrentPreset(gui, useInitialValues) {
	  var toReturn = {};
	  Common.each(gui.__rememberedObjects, function (val, index) {
	    var savedValues = {};
	    var controllerMap = gui.__rememberedObjectIndecesToControllers[index];
	    Common.each(controllerMap, function (controller, property) {
	      savedValues[property] = useInitialValues ? controller.initialValue : controller.getValue();
	    });
	    toReturn[index] = savedValues;
	  });
	  return toReturn;
	}
	function setPresetSelectIndex(gui) {
	  for (var index = 0; index < gui.__preset_select.length; index++) {
	    if (gui.__preset_select[index].value === gui.preset) {
	      gui.__preset_select.selectedIndex = index;
	    }
	  }
	}
	function updateDisplays(controllerArray) {
	  if (controllerArray.length !== 0) {
	    requestAnimationFrame$1.call(window, function () {
	      updateDisplays(controllerArray);
	    });
	  }
	  Common.each(controllerArray, function (c) {
	    c.updateDisplay();
	  });
	}
	var controllers = {
	  Controller: Controller,
	  BooleanController: BooleanController,
	  OptionController: OptionController,
	  StringController: StringController,
	  NumberController: NumberController,
	  NumberControllerBox: NumberControllerBox,
	  NumberControllerSlider: NumberControllerSlider,
	  FunctionController: FunctionController,
	  ColorController: ColorController,
	  CustomController: CustomController
	};

	/**
	 * get position functions library
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

	/**
	 * gets the position from the geometry.attributes.position of the object.
	 * @param {THREE.Mesh} object
	 * @param {number} index index of position in the object.geometry.attributes.position
	 * @returns position
	 */
	function getObjectLocalPosition( object, index ) {

		const getPositionId = object.userData.myObject ? object.userData.myObject.guiPoints.getPositionId : undefined;
		if (getPositionId) index = getPositionId(index);
		const THREE = three$1.THREE,
			geometry = object.geometry,
			attributesPosition = geometry.attributes.position,
			itemSize = attributesPosition.itemSize,
			position = itemSize >= 4 ? new THREE.Vector4( 0, 0, 0, 0 ) : new THREE.Vector3(),
			drawRange = object.geometry.drawRange,
			offset = index * itemSize;
		if ( object.geometry.index === null ) {
			
			//Отображаются вершины
			let sError;
			if ( geometry.index === null ) {
				if ( ( drawRange.count != Infinity ) && ( ( index < drawRange.start ) || ( index >= ( drawRange.start + drawRange.count ) ) ) )
					sError = '';
			} else if ( ( drawRange.count != Infinity ) && ( ( offset < drawRange.start ) || ( offset >= ( drawRange.start + drawRange.count ) ) ) ){
				
	//			console.error( 'getObjectLocalPosition: index = ' + index + '. offset = ' + offset + ' is out of range = { start: ' + drawRange.start + ', count: ' + drawRange.count + ' }' );
	//			return;
				sError = '. offset = ' + offset;
		
			}
			if ( sError != undefined ) console.error( 'getObjectLocalPosition: index = ' + index + sError + ' is out of range = { start: ' + drawRange.start + ', count: ' + drawRange.count + ' }' );
		
		}
		position.fromArray( attributesPosition.array, offset );
		return position;

	}

	/**
	 * gets position of the vector in world coordinates, taking into account the position, scale and rotation of the 3D object
	 * @param {THREE.Object3D} object
	 * @param {THREE.Vector3} pos local position
	 * @returns world position 
	 */
	function getWorldPosition( object, pos ) {

		const THREE = three$1.THREE;
		var position = pos.clone();

		/*
			//https://stackoverflow.com/questions/11495089/how-to-get-the-absolute-position-of-a-vertex-in-three-js
			//Неудачная попытка вычислить абсолютную позицию точки
			object.updateMatrixWorld();
			position.applyMatrix4( object.matrixWorld );
		*/
		function getPosition( object, pos ) {

			var position = new THREE.Vector3(),
				positionAngle = new THREE.Vector3();
			position = pos.clone();
			position.multiply( object.scale );

			//rotation
			positionAngle.copy( position );
			positionAngle.applyEuler( object.rotation );
			position.x = positionAngle.x;
			position.y = positionAngle.y;
			position.z = positionAngle.z;

			position.add( object.position );
			return position;

		}
		do {

			position = getPosition( object, position );
			object = object.parent;

		} while ( object && object.parent );
		return position;

	}

	/**
	 * gets the position from the geometry.attributes.position of the object in world coordinates.
	 * @param {THREE.Mesh} object
	 * @param {number} index index of position in the object.geometry.attributes.position
	 * @returns position
	 */
	function getObjectPosition( object, index ) {

		if ( index === -1 )
			return undefined;
		if ( index === undefined )
			return object.position;
		return getWorldPosition( object, getObjectLocalPosition( object, index ) )
	//	return getWorldPosition( object, getObjectLocalPosition( object, object.userData.myObject.guiPoints.getPositionId(index) ) )

	}

	/**
	 * View and edit some parameters on the web page.
	 *
	 * @author [Andrej Hristoliubov]{@link https://github.com/anhr}
	 * Thanks to https://stackoverflow.com/a/11900218/5175935
	 *
	 * @copyright 2011 Data Arts Team, Google Creative Lab
	 *
	 * @license under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 */

	/**
	 * @description View and edit some parameters on the web page.
	 * @param {Object} [settings] see <b>arrayFuncs.controllers[axisName]</b> parameter of <a href="./player/jsdoc/module-Player-Player.getPoints.html" target="_blank">Player.getPoints</a>
	 * @param {HTMLElement|string} [settings.controller]
	 * <pre>
	 * HTMLElement - for viewing or editing of some value
	 * string - id of HTMLElement
	 * </pre>
	 * @param {HTMLElement|string} [settings.elName]
	 * <pre>
	 * HTMLElement - name of value. See <b>settings.controller</b> above.
	 * string - id of HTMLElement
	 * </pre>
	 * @param {string} controllerId id of controller if <b>settings.controller</b> is not defined.
	 * @param {Function} name returns name of value.
	 * @param {Object} options
	 * @param {Object} [options.elementName='input'] controllers tag name if <b>settings.controller</b> is not defined.
	 * @param {String} [options.value] controllers <b>value</b> or <b>innerHTML</b>.
	 * @param {String} [options.axisName] axis name. For find element by ID.
	 * @param {Function} [options.onchange] callback function is called if user has changed the controllers <b>value</b>.
	 */
	function createController( settings, controllerId, name, options ) {

		if ( !settings ) return;

		//controller

		if ( typeof settings.controller === "string" ) {

			const id = settings.controller;
			settings.controller = document.getElementById( settings.controller );
			if ( !settings.controller ) console.warn( 'createController: invalid settings.controller = "' + id + '"' );

		}
		if ( !settings.controller ) {

			if ( settings.controller === null ) console.warn( 'createController: invalid settings.controller = ' + settings.controller );
			var controller = document.getElementById( controllerId );
			if ( !controller ) {

				controller = document.createElement( options.elementName ? options.elementName : 'input' );
				document.querySelector( 'body' ).appendChild( controller );

			}
			settings.controller = controller;

		}
		function setControllerValue( value ) {

			if( settings.controller.value !== undefined )
				settings.controller.value = value;//input element type
			else settings.controller.innerHTML = value;//other element types. For example span

		}
		if ( options.value !== undefined )
			setControllerValue( options.value );
		if ( ( options.onchange !== undefined ) && settings.controller.onchange === null )
			settings.controller.onchange = options.onchange;
		if ( ( options.title !== undefined ) && settings.controller.title === '' )
			settings.controller.title = options.title;

		//slider
		if( settings.elSlider ) {

			if ( typeof settings.elSlider === "string" ) {

				const id = settings.elSlider;
				settings.elSlider = document.getElementById( settings.elSlider );
				if ( !settings.elSlider ) console.warn( 'createController: invalid settings.elSlider = "' + id + '"' );

			}
			if ( !settings.elSlider || ( settings.elSlider === true ) ) {

				if ( options.axisName ) settings.elSlider = document.getElementById( options.axisName + 'Slider' );
				if ( !settings.elSlider ) {

					settings.elSlider = document.createElement( 'div' );
					if ( settings.controller )
						settings.controller.parentElement.appendChild( settings.elSlider );
					else document.querySelector( 'body' ).appendChild( settings.elSlider );

				}

			}

			settings.boSetValue = true;
			//Horizontal Colorpicker with slider indicator
			if ( !settings.colorpicker ) {

				settings.colorpicker = ColorPicker$1.create( settings.elSlider, {

					//direction: false,
					duplicate: true,
					sliderIndicator: {
						callback: function ( c ) {

							if ( settings.boSetValue || !settings.controller ) return;
							const value = c.percent / 100;
							settings.controller.onchange( { currentTarget: { value: value } } );
							settings.controller.value = value;

						},
						value: options.value * 100,//percent

					},
					style: {

						border: '1px solid black',
						width: settings.controller.clientWidth + 'px',
						height: settings.controller.clientHeight + 'px',

					},
					onError: function ( message ) { alert( 'Horizontal Colorpicker with slider indicator error: ' + message ); }

				} );

				//Непонятно почему если это не сделать, то settings.elSlider не попадает под settings.controller
				//Сейчас после settings.controller ставлю <br>
				//settings.elSlider.style.display = 'none';
				//settings.elSlider.style.display = 'block';

			}
			if ( options.value !== undefined ) {

				var value = options.value * 100;
				if ( value < 0 ) value = 0;
				if ( value > 100 ) value = 100;
				settings.boSetValue = true;
				settings.colorpicker.setValue( value );
				settings.boSetValue = false;

			}
	/*
			document.getElementById( 'enterValueHI' ).onclick = function () {

				settings.colorpicker.setValue( settings.controller.value );

			}
	*/
			
		}

		//name

		if ( settings.elName === false )
			return;

		if ( settings.elName === null ) console.warn( 'createController: invalid settings.elName = ' + settings.elName );
		if ( typeof settings.elName === "string" ) {

			const id = settings.elName;
			settings.elName = document.getElementById( settings.elName );
			if ( !settings.elName ) console.warn( 'createController: invalid settings.elName = "' + id + '"' );

		}
		var str = '';
		if ( !settings.elName ) {

			if ( options.axisName ) settings.elName = document.getElementById( options.axisName + 'Name' );
			if ( !settings.elName ) {

				settings.elName = document.createElement( 'span' );
				settings.controller.parentElement.insertBefore( settings.elName, settings.controller );
				str = ' = ';

			}

		}
		if ( settings.elName.innerHTML !== '' )
			return;
		settings.elName.innerHTML = name() + str;

	}

	/**
	 * @module Player
	 * @description 3D objects animation.
	 * @author [Andrej Hristoliubov]{@link https://github.com/anhr}
	 * @copyright 2011 Data Arts Team, Google Creative Lab
	 *
	 * @license under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 */

	/**
	 * @callback onSelectScene
	 * @description This function is called at each new step of the playing. See <b>settings.onSelectScene</b> parameter of the <a href="../../player/jsdoc/module-Player-Player.html" target="_blank">Player</a> class.
	 * @param {number} index current index of the scene of the animation
	 * @param {number} t current time
	 */

	/**
	 * @callback onChangeScaleT
	 * @description User has updated the time settings. See <b>settings.onChangeScaleT</b> parameter of the <a href="../../player/jsdoc/module-Player-Player.html" target="_blank">Player</a> class.
	 * @param {object} scale the updated time settings
	 */

	class Player$1 {

		/**
		 * 3D objects animation.
		 * @class
		 * @param {THREE.Group|THREE.Scene} group [THREE.Group]{@link https://threejs.org/docs/index.html?q=group#api/en/objects/Group} or [THREE.Scene]{@link https://threejs.org/docs/index.html?q=sce#api/en/scenes/Scene} of the meshes for playing.
		 * @param {Object} [settings={}] the following settings are available
		 * 
		 * @param {Options} [settings.options=new Options()] <a href="../../jsdoc/Options/Options.html" target="_blank">Options</a> instance. The following options are available.
		 * See <b>options</b> parameter of <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
		 * @param {boolean} [settings.options.dat.playerGui] false - do not adds a <a href="../../player/jsdoc/module-Player-Player.html#gui" target="_blank">Player controllers</a> into [dat.gui]{@link https://github.com/dataarts/dat.gui}.
		 * @param {boolean} [settings.options.dat.playController] false - do not adds a <a href="../../player/jsdoc/module-Player-Player_PlayController_PlayController.html" target="_blank">PlayController</a> into [dat.gui]{@link https://github.com/dataarts/dat.gui}.
		 * @param {Object} [settings.options.playerOptions] Player settings.
		 * @param {number} [settings.options.playerOptions.min=0] Start time of the playing.
		 * @param {number} [settings.options.playerOptions.max=1] Stop time of the playing.
		 * @param {number} [settings.options.playerOptions.marks=10] Ticks count of the playing. Number of scenes of 3D objects animation.
		 * Have effect for <b>max</b> is not Infinity.
		 * @param {number} [settings.options.playerOptions.selectSceneIndex=0] current time index.
		 * <pre>
		 * Legal interval from 0 to to <b>marks - 1</b>.
		 * If <b>selectSceneIndex</b> = 0 then time = <b>min</b>.
		 * If <b>selectSceneIndex</b> = <b>marks - 1</b> then time = <b>max</b>.
		 * <pre>
		 * @param {number} [settings.options.playerOptions.dt=0.1] Step of the animation. Have effect only if <b>max</b> is infinity.
		 * @param {boolean} [settings.options.playerOptions.repeat=false] true - Infinitely repeating 3D objects animation.
		 * @param {number} [settings.options.playerOptions.interval=1] Ticks per seconds.
		 * @param {number} [settings.options.playerOptions.zoomMultiplier=1.1] zoom multiplier of the time.
		 * @param {number} [settings.options.playerOptions.offset=0.1] offset of the time.
		 * @param {number} [settings.options.playerOptions.name=""] name of the time.
		 * @param {boolean} [settings.options.player] false - do not create a <b>Player</b> instance.
		 *
		 * @param {onSelectScene} [settings.onSelectScene] This function is called at each new step of the playing. See <a href="../../player/jsdoc/module-Player.html#~onSelectScene" target="_blank">onSelectScene</a>.
		 * @param {onChangeScaleT} [settings.onChangeScaleT] event. User has updated the time settings. See <a href="../../player/jsdoc/module-Player.html#~onChangeScaleT" target="_blank">onChangeScaleT</a>.
		 * @param {FrustumPoints} [settings.frustumPoints] See <a href="../../frustumPoints/jsdoc/index.html" target="_blank">FrustumPoints</a>.
		 * Have effect only if <b>settings.options</b> is not defined.
		 * @param {THREE.PerspectiveCamera} settings.cameraTarget.camera [PerspectiveCamera]{@link https://threejs.org/docs/index.html#api/en/cameras/PerspectiveCamera}.
		 */
		constructor( group, settings={} ) {

			assign$1();

			if ( !settings.options && settings.frustumPoints ) settings.options = settings.frustumPoints.getOptions();
			settings.options = settings.options || new Options$1();
			const options = settings.options;
			if ( !options.boOptions ) {

				console.error( 'Player: call options = new Options( options ) first' );
				return;

			}

			if ( options.player === false ) return;

			options.boPlayer = options.boPlayer || false;

			//если тут создавать палитру то она не создастся если не создается плееер
			//palette = new palette();

			if ( options.player ) {

				console.error( 'Player: duplicate player.' );
				return;

			}
			options.player = this;

			settings.cameraTarget = settings.cameraTarget || {};

			/**
			 * @description This function is called at each new step of the playing.
			 * @param {number} [index=0] current index of the scene of the animation
			 */
			function onSelectScene( index ) {

				index = index || 0;
				const t = _this.getTime(index);
				Player$1.selectPlayScene( group, { t: t, index: index, options: settings.options } );
				_this.setIndex( index, ( options.playerOptions.name === '' ? '' : options.playerOptions.name + ': ' ) + t );
				if ( settings.onSelectScene ) _this.selectScenePause = settings.onSelectScene( index, t );
				if ( options.frustumPoints ) options.frustumPoints.updateCloudPoints();

			}

			//Теперь не нужно создавать color attribute на веб странице что бы цвет точек был верным еще до начала проигрывания
			//Кроме того трассировака начинается с нулевой точки
			setTimeout( function () { onSelectScene(); }, 0 );

			options.playerOptions.selectSceneIndex = options.playerOptions.selectSceneIndex || 0;
			var selectSceneIndex = options.playerOptions.selectSceneIndex;

			const _this = this;

			/**
			 * get time id
			 */
			this.getTimeId = function () { return selectSceneIndex; };
			
			/**
			 * get time
			 * @param {number} [timeId] Index of the time. The default is the time index of the selected scene.
			 */
			this.getTime = function (timeId) {

				const playerOptions = options.playerOptions, t = playerOptions.min + (timeId != undefined ? timeId : selectSceneIndex) * playerOptions.dt;
				if ( isNaN( t ) ) console.error( 'Player.getTime(): t = ' + t );
				if ( ( playerOptions.max !== null ) && ( t > playerOptions.max ) )
					console.error( 'Player.getTime(): t = ' + t + ' playerOptions.max = ' + playerOptions.max );
				if ( ( t < playerOptions.min ) && ( playerOptions.max !== null ) )
					console.error( 'Player.getTime(): t = ' + t + ' playerOptions.min = ' + playerOptions.min );
				return t;

			};

			/**
			 * set time
			 * @param {number} t time
			 * @returns false - invalid <b>t</b>.
			 */
			this.setTime = function ( t ) {

				return this.selectScene( parseInt( ( t - options.playerOptions.min ) / options.playerOptions.dt ) );

			};

			//массив индексов проигрывателя selectSceneIndex для функции onSelectScene
			//Этот массив заполняется когда пользователь нажал на scrollBar проигрывателя и когда очередной шаг проигрывателя выпоняется ассинхронно
			//В этом случае вызывается сразу несколько onSelectScene с разными индексами проигрывателя selectSceneIndex
			//Для того, что бы несколько onSelectScene не выполнялись одновременно сначала выполняется первый onSelectScene, а затем выпоняются остальные только когда выполнится предыдущий onSelectScene
			const aSelectSceneIndex = [];

			/**
			 * select scene for playing
			 * @param {number} index Index of the scene. Range from 0 to options.playerOptions.marks - 1
			 * @returns false - invalid <b>index</b>.
			 */
			this.selectScene = function ( index ) {

				//Пользователь передвинул slider проигрывателя, когда сцена вычисляется асинхронно.
				//Смотри пример http://localhost/anhr/universe/main/hyperSphere/Examples/ когда выполняется hyperSphere.middleVertices
				//В этом случает в aSelectSceneIndex добавляются новые идексы сцен. И дальше начинается путаница, в которой я не разобрался.
				if ( aSelectSceneIndex.length != 0 ) return;

				if ( index === undefined ) {

					onSelectScene( selectSceneIndex );
					return true;

				}
				if ( isNaN( index ) ) {

					console.error( 'Player.selectScene: index = ' + index );
					return false;
					
				}
				index = parseInt( index );
				if ( options.playerOptions.max !== null ) {

					if ( index >= options.playerOptions.marks )
						index = 0;
					else if ( index < 0 )
						index = options.playerOptions.marks - 1;
					if ( selectSceneIndex > options.playerOptions.marks )
						selectSceneIndex = options.playerOptions.marks;

				}
				while ( selectSceneIndex !== index ) {

					if ( selectSceneIndex < index )
						selectSceneIndex++;
					else selectSceneIndex--;
					if (this.selectScenePause === true) 
						//Пользователь нажал scrollBar проигрывателя и когда очередной шаг проигрывателя выпоняется ассинхронно
						//В этом случае сдедующий onSelectScene выполняется только когда выполнится предыдущий onSelectScene
						aSelectSceneIndex.push( selectSceneIndex );
					else onSelectScene( selectSceneIndex );

				}
				return true;

			};

			/**
			 * Go to next animation scene
			 */
			this.next = function () {

				_this.selectScene( selectSceneIndex + 1 );

			};

			/**
			 * Go to previous animation scene
			 */
			this.prev = function () {

				_this.selectScene( selectSceneIndex - 1 );

			};
			/**
			 * Add controller into controllers array
			 * @param {controller} controller
			 */
			this.pushController = function ( controller ) {

				if ( ( controller.object !== undefined ) && ( controller.object.playRate !== undefined ) )
					controller.object.playRate = options.playerOptions.min;
				this.controllers.push( controller );

			};

			//Play/Pause

			this.controllers = [];
			var playing = false, time, timeNext;

			function RenamePlayButtons() {

				options.player.controllers.forEach( function ( controller ) { if ( controller.onRenamePlayButtons ) controller.onRenamePlayButtons( playing ); } );

			}

			function play() {

				if (
					( selectSceneIndex === -1 ) ||
					(
						( selectSceneIndex === options.playerOptions.marks ) &&
						( options.playerOptions.max !== null )
					)
				) {

					selectSceneIndex = 0;

				}
				onSelectScene( selectSceneIndex );

			}

			function pause() {

				playing = false;
				RenamePlayButtons();

				time = undefined;

			}
			function isRepeat() {

				return options.playerOptions.repeat;

			}

			function playNext() {

				selectSceneIndex++;
				if ( ( options.playerOptions.max !== null ) && selectSceneIndex >= options.playerOptions.marks ) {

					if ( isRepeat() )
						selectSceneIndex = 0;
					else {

						//Для вычисления текущего времени в случае:
						//1. Запустить плеер и дождаться когда проигрывание остановится после достижения максимального времени
						//2. В guiSelectPoint выбрать точку, цвет которой зависит от времени
						//Тогда если убрать эту строку, то selectSceneIndex и время окажется за диапазоном допустимых значений
						//и цвет точки окажется неверным
						selectSceneIndex = options.playerOptions.marks - 1;

						pause();
						return;

					}

				}
				play();

			}

			function step(timestamp) {

				if (_this.selectScenePause) return;//При построении сцены был применен ProgressBar. Поэтому возврат из options.onSelectScene произошел еще до построения сцены. Нужно приостановить проигрывание, пока сцена не построится.
				if (playing)
					window.requestAnimationFrame(step);
				else time = undefined;

				if (time === undefined) {

					time = timestamp;
					timeNext = time + 1000 / options.playerOptions.interval;

				}
				if (isNaN(timeNext) || (timeNext === Infinity)) {

					console.error('Player.animate: timeNext = ' + timeNext);
					playing = false;

				}

				if ( (timestamp < timeNext) || !playing )
					return;
				const d = 1000 / options.playerOptions.interval;
				if (d > 0) while (timestamp > timeNext)
					timeNext += d;
				playNext();

			}

			/**
			 * User has clicked the Play ► / Pause ❚❚ button
			 */
			this.play3DObject = function () {

				if ( playing ) {

					pause();
					return;

				}

				playing = true;
				if ( ( options.playerOptions.max !== null ) && ( selectSceneIndex >= ( options.playerOptions.marks - 1 ) ) )
					selectSceneIndex = 0;//-1;
				playNext();
				RenamePlayButtons();

				window.requestAnimationFrame( step );

			};

			/**
			 * <pre>
			 *Continue playing asynchronously.
			 * Usual using if creating new scene to take long time.
			 * Please call it from <b>settings.options.onSelectScene()</b> function after asynchronously creating of the scene.
			 * Return true from <b>settings.options.onSelectScene()</b> function for pause of the playing.
			 * </pre>
			 * @see <a href="../../../../universe/main/jsdoc/" target="_blank">example</a>
			 */
			this.continue = () => {

				if (aSelectSceneIndex.length > 0) {

					onSelectScene(aSelectSceneIndex.shift());
					return;
					
				}
				_this.selectScenePause = false;
				window.requestAnimationFrame(step);
				
			};

			/**
			 * User has clicked the repeat ⥀ button
			 */
			this.repeat = function () {

				options.playerOptions.repeat = !options.playerOptions.repeat;
				this.onChangeRepeat( options.playerOptions.repeat );

			};

			/**
			 * @returns Player settings.
			 */
			this.getSettings = function () { return settings; };
			/**
			 * @returns selected scene index.
			 */
			this.getSelectSceneIndex = function () { return selectSceneIndex; };

			/**@namespace
			 * @descriptionUser has pressed the <b>Repeat</b> button of the <a href="../../player/jsdoc/module-Player-Player_PlayController_PlayController.html" target="_blank">Player.PlayController</a>.
			 * @param {boolean} value true - repeat is off
			 * <p>false - repeat is on</p>
			 */
			this.onChangeRepeat = function ( value ) {

				options.playerOptions.repeat = value;
				this.controllers.forEach( function ( controller ) { if ( controller.onChangeRepeat ) controller.onChangeRepeat(); } );

			};

			//Localization
			function getLang( params ) {

				params = params || {};
				const lang = {

					player: 'Player',
					playerTitle: '3D objects animation.',

					min: 'Min',
					max: 'Max',
					dt: 'Step',
					dtTitle: 'Time between frames',

					marks: 'Frames',
					marksTitle: 'Player frames count',

					interval: 'Rate',
					intervalTitle: 'Rate of changing of animation scenes per second.',

					time: 'Time',

					defaultButton: 'Default',
					defaultTitle: 'Restore default player settings.',

				};

				const _languageCode = params.getLanguageCode === undefined ? 'en'//Default language is English
					: params.getLanguageCode();
				switch ( _languageCode ) {

					case 'ru'://Russian language

						lang.player = 'Проигрыватель';
						lang.playerTitle = 'Анимация 3D объектов.';

						lang.min = 'Минимум';
						lang.max = 'Максимум';
						lang.dt = 'Шаг';
						lang.dtTitle = 'Веремя между кадрами';

						lang.marks = 'Кадры';
						lang.marksTitle = 'Количество кадров проигрывателя';

						lang.interval = 'Темп',
						lang.intervalTitle = 'Скорость смены кадров в секунду.';

						lang.time = 'Время';

						lang.defaultButton = 'Восстановить';
						lang.defaultTitle = 'Восстановить настройки проигрывателя по умолчанию.';

						break;
					default://Custom language
						if ( ( params.lang === undefined ) || ( params.lang._languageCode != _languageCode ) )
							break;

						Object.keys( params.lang ).forEach( function ( key ) {

							if ( _lang[key] === undefined )
								return;
							_lang[key] = params.lang[key];

						} );

				}
				return lang;

			}

			//PlayController localization

			const lang = {

				prevSymbol: '←',
				prevSymbolTitle: 'Go to previous animation scene',
				nextSymbol: '→',
				nextSymbolTitle: 'Go to next animation scene',
				playSymbol: '►',
				playTitle: 'Play',
				pause: '❚❚',
				pauseTitle: 'Pause',
				repeat: '⥀',
				repeatOn: 'Turn repeat on',
				repeatOff: 'Turn repeat off',
				controllerTitle: 'Current time.',
				stereoEffects: 'Stereo effects',
				mono: 'Mono',
				sideBySide: 'Side by side',
				topAndBottom: 'Top and bottom',

			};
			function localization( getLanguageCode ) {
				switch ( getLanguageCode() ) {

					case 'ru'://Russian language
						lang.prevSymbolTitle = 'Кадр назад';//'Go to previous animation scene',
						lang.playTitle = 'Проиграть';//'Play'
						lang.nextSymbolTitle = 'Кадр вперед';//'Go to next animation scene';
						lang.pauseTitle = 'Пауза';//'Pause',
						lang.repeatOn = 'Повторять проигрывание';
						lang.repeatOff = 'Остановить повтор проигрывания';
						lang.controllerTitle = 'Текущее время.';
						lang.stereoEffects = 'Стерео эффекты';
						lang.mono = 'Моно';
						lang.sideBySide = 'Слева направо';
						lang.topAndBottom = 'Сверху вниз';

						break;

				}

			}
			/** <a href="../../player/jsdoc/module-Player-Player_PlayController_PlayController.html" target="_blank">PlayController</a> localization
			* @param {Function} [getLanguageCode="en"] Your custom getLanguageCode() function.
			* <pre>
			* returns the "primary language" subtag of the language version of the browser.
			* Examples: "en" - English language, "ru" Russian.
			* See the {@link https://tools.ietf.org/html/rfc4646#section-2.1|rfc4646 2.1 Syntax} for details.
			* Default returns the 'en' is English language.
			* You can import { getLanguageCode } from '../../commonNodeJS/master/lang.js';
			* </pre>
		    * @returns Names and titles of the <b>PlayController</b> controls
			*/
			this.localization = function ( getLanguageCode = function() { return 'en' } ) {

				localization( getLanguageCode );
				return lang;

			};

			this.PlayController = class extends controllers.CustomController {

				/**
				 * @class playController class for using in my version of [dat.gui]{@link https://github.com/anhr/dat.gui} for animate of 3D objects in my projects.
				 * @extends dat.controllers.CustomController. See [CustomController.js]{@link https://github.com/anhr/commonNodeJS/blob/master/dat.gui/CustomController/src/dat/controllers/CustomController.js}
				 * @param {GUI} [gui] [new dat.GUI(...)]{@link https://github.com/anhr/dat.gui}. Folder for controller
				 */
				constructor( gui ) {

					const player = options.player, getLanguageCode = options.getLanguageCode;
					player.createControllersButtons( options );

					gui = gui || options.dat.gui;
					if ( !gui || options.dat.playController === false ) {

						super( {} );
						return;

					}

					localization( getLanguageCode );

					function addButton( innerHTML, title, onclick ) {

						const button = document.createElement( 'span' );
						button.innerHTML = innerHTML;
						button.title = title;
						button.style.cursor = 'pointer';
						button.style.margin = '0px 2px';
						button.onclick = onclick;
						return button;

					}

					var _renamePlayButtons, _renameRepeatButtons;//_selectScene, _repeat, _getGroup,
					const colorOff = 'rgb(255,255,255)', colorOn = 'rgb(128,128,128)';

					super( {

						playRate: 1,//Default play rate is 1 changes per second
						property: function ( customController ) {

							var buttons = {};
							function RenamePlayButtons( innerHTML, title ) {

								buttons.buttonPlay.innerHTML = innerHTML;
								buttons.buttonPlay.title = title;

							}
							_renamePlayButtons = RenamePlayButtons;

							buttons.buttonPrev = addButton( lang.prevSymbol, lang.prevSymbolTitle, player.prev );
							buttons.buttonPlay = addButton( playing ? lang.pause : lang.playSymbol,
								playing ? lang.pauseTitle : lang.playTitle, player.play3DObject );

							if ( player.getSettings().options.playerOptions.max !== null ) {

								//Repeat button

								function RenameRepeatButtons( isRepeat ) {

									var title, color;
									if ( isRepeat ) {

										title = lang.repeatOff;
										color = colorOff;

									} else {

										title = lang.repeatOn;
										color = colorOn;

									}

									if ( buttons.buttonRepeat.title === title )
										return;//stop of infinite recursive call

									buttons.buttonRepeat.title = title;
									buttons.buttonRepeat.style.color = color;

									player.onChangeRepeat( isRepeat );

								}
								_renameRepeatButtons = RenameRepeatButtons;
								function repeat( value ) {

									RenameRepeatButtons( buttons.buttonRepeat.title === lang.repeatOn );

								}
								var title, color;
								if ( player.getSettings().repeat ) {

									title = lang.repeatOff;
									color = colorOff;

								} else {

									title = lang.repeatOn;
									color = colorOn;

								}
								buttons.buttonRepeat = addButton( lang.repeat, title, repeat );
								buttons.buttonRepeat.style.color = color;

							}
							buttons.buttonNext = addButton( lang.nextSymbol, lang.nextSymbolTitle, player.next );

							return buttons;

						},

					}, 'playRate' );
					player.PlayController = this;
					this.lang = lang;
					
					/** @namespace
					 * @description Get array of THREE.Vector4 points. User has pressed the <b>Play</b> button. Rename the <b>Play</b> putton.
					 * @param {boolean} playing true - name is "❚❚"
					 * <p>false = name is "►"
					 */
					this.onRenamePlayButtons = function ( playing ) {

						var name, title;
						if ( playing ) {

							name = lang.pause;
							title = lang.pauseTitle;

						} else {

							name = lang.playSymbol;
							title = lang.playTitle;

						}
						_renamePlayButtons( name, title, true );

					};
					/** @namespace
					 * @description User has pressed the <b>Repeat</b> button.
					 */
					this.onChangeRepeat = function () {

						_renameRepeatButtons( player.getSettings().options.playerOptions.repeat );

					};
					player.pushController( this );
					/**
					 * @param {number} value current time of the playing
					 */
					this.setValue = function ( value ) {

						this._controller.domElement.childNodes[0].value = value;

					};

					const controler = gui.add( this );
					//что бы можно было вводить цифры после запятой
					controler.__truncationSuspended = true;

				}
				set controller( newController ) {

					this._controller = newController;
					this._controller.onChange( function ( value ) { options.player.setTime( value ); /*_this.onChange( value );*/ } );
					this._controller.domElement.title = this.lang.controllerTitle;

				}
				get controller() { return this._controller; }

			};

			/**
			 * Adds a Player's controllers into [dat.gui]{@link https://github.com/anhr/dat.gui}.
			 * @param {GUI} [folder] Player's folder
			 */
			this.gui = function ( folder ) {

				const cookie = options.dat.cookie,
					cookieName = options.dat.getCookieName( 'Player' ),
					getLanguageCode = options.getLanguageCode,
					dat = three$1.dat;// options.dat.dat;

				folder = folder || options.dat.gui;
				if ( !folder || options.dat.playerGui === false )
					return;

				function setDT() {

					if ( options.playerOptions.max === null ) options.playerOptions.dt = options.playerOptions.dt || 0.1;
					else options.playerOptions.dt = ( options.playerOptions.max - options.playerOptions.min ) / ( options.playerOptions.marks - 1 );

				}

				function setSettings() {

					setDT();
					cookie.setObject( cookieName, options.playerOptions );
					if ( settings.onChangeScaleT ) settings.onChangeScaleT( options.playerOptions );

				}
				function setMax() {

					if ( options.playerOptions.max !== null )
						options.playerOptions.max = options.playerOptions.min + options.playerOptions.dt * ( options.playerOptions.marks - 1 );

				}
				setMax();
				const axesDefault = {},
					lang = getLang( {

						getLanguageCode: getLanguageCode,

					} );
				Object.keys( options.playerOptions ).forEach( ( key ) => { axesDefault[key] = options.playerOptions[key]; } );
				Object.freeze( axesDefault );
				const max = options.playerOptions.max, marks = options.playerOptions.marks;// interval = options.playerOptions.interval,
				cookie.getObject( cookieName, options.playerOptions, axesDefault );
				if ( ( max === null ) || ( max === Infinity ) ||
					( options.playerOptions.max === null )//раньше на веб странице плеер был настроен на бесконечное проигрыванияе а сейчас проигрывание ограничено по времени
				) {

					options.playerOptions.max = max;
					options.playerOptions.marks = marks;

				}

				const fPlayer = folder.addFolder( lang.player );
				dat.folderNameAndTitle( fPlayer, lang.player, lang.playerTitle );

				function scale() {

					const axes = options.playerOptions,
						scaleControllers = {};
					function onclick( customController, action ) {

						var zoom = customController.controller.getValue();

						axes.min = action( axes.min, zoom );
						scaleControllers.min.setValue( axes.min );
						if ( axes.max ) {

							axes.max = action( axes.max, zoom );
							setDT();
							scaleControllers.max.setValue( axes.max );

						}

						setSettings();

					}

					scaleControllers.folder = fPlayer.addFolder( axes.name !== '' ? axes.name : lang.time );

					scaleControllers.scaleController = scaleControllers.folder.add( new ScaleController( onclick,
						{ settings: settings.options.playerOptions, getLanguageCode: getLanguageCode, } ) ).onChange( function ( value ) {

							axes.zoomMultiplier = value;
							setSettings();

						} );

					const positionController = new PositionController( function ( shift ) {

						onclick( positionController, function ( value, zoom ) {

							value += shift;
							return value;

						} );

					}, { settings: settings.options.playerOptions, getLanguageCode: getLanguageCode, } );
					scaleControllers.positionController = scaleControllers.folder.add( positionController ).onChange( function ( value ) {

						axes.offset = value;
						setSettings();

					} );

					//min
					scaleControllers.min = dat.controllerZeroStep( scaleControllers.folder, axes, 'min', function ( value ) { setSettings(); } );
					dat.controllerNameAndTitle( scaleControllers.min, lang.min );

					//max
					//axes.max сейчас используется исключитьельно для удобства пользовательского интерфейса
					//Вместо axes.max используется axes.dt
					setMax();
					if ( axes.max !== null ) {

						scaleControllers.max = dat.controllerZeroStep( scaleControllers.folder, axes, 'max', function ( value ) { setSettings(); } );
						dat.controllerNameAndTitle( scaleControllers.max, lang.max );

					} else {

						//dt
						scaleControllers.dt = dat.controllerZeroStep( scaleControllers.folder, axes, 'dt', function ( value ) { setSettings(); } );
						dat.controllerNameAndTitle( scaleControllers.dt, lang.dt, lang.dtTitle );

					}

					//marks
					if ( axes.marks ) {

						scaleControllers.marks = scaleControllers.folder.add( axes, 'marks' ).onChange( function ( value ) {

							axes.marks = parseInt( axes.marks );
							setSettings();
							const elSlider = getSliderElement();
							if ( elSlider ) elSlider.max = options.playerOptions.marks - 1;

						} );
						dat.controllerNameAndTitle( scaleControllers.marks, axes.marksName === undefined ? lang.marks : axes.marksName,
							axes.marksTitle === undefined ? lang.marksTitle : axes.marksTitle );

					}

					//Ticks per seconds.
					//settings.options.playerOptions.intervalOptions ||= {};uncompatible with myThree.js → ./build/myThree.js, ./build/myThree.module.js...
					if (!settings.options.playerOptions.intervalOptions) settings.options.playerOptions.intervalOptions = {};
					const intervalOptions = settings.options.playerOptions.intervalOptions;
					intervalOptions.min = intervalOptions.min != undefined ? intervalOptions.min : settings.options.playerOptions.interval < 1 ? settings.options.playerOptions.interval : 1;
					intervalOptions.max = intervalOptions.max === null ? Infinity : //Во время JSON преобразования Infinity превращается в null. Поэтому восстанавливаю обратно
						intervalOptions.max != undefined ? intervalOptions.max : settings.options.playerOptions.interval > 25 ? settings.options.playerOptions.interval : 25;
					if (intervalOptions.max === Infinity)
						scaleControllers.interval = scaleControllers.folder.add( settings.options.playerOptions, 'interval' ).onChange( function ( value ) {

							setSettings();

						} );
					else scaleControllers.interval = scaleControllers.folder.add( settings.options.playerOptions, 'interval', intervalOptions.min, intervalOptions.max, 1 ).onChange( function ( value ) {

							setSettings();
		
						} );
					dat.controllerNameAndTitle( scaleControllers.interval, lang.interval, lang.intervalTitle );

					//Default button
					dat.controllerNameAndTitle( scaleControllers.folder.add( {

						defaultF: function ( value ) {

							axes.zoomMultiplier = axesDefault.zoomMultiplier;
							scaleControllers.scaleController.setValue( axes.zoomMultiplier );

							axes.offset = axesDefault.offset;
							scaleControllers.positionController.setValue( axes.offset );

							axes.min = axesDefault.min;
							scaleControllers.min.setValue( axes.min );

							if ( scaleControllers.max ) {

								axes.max = axesDefault.max;
								setDT();
								scaleControllers.max.setValue( axes.max );

							}

							if ( scaleControllers.dt ) {

								axes.dt = axesDefault.dt;
								scaleControllers.dt.setValue( axes.dt );

							}

							if ( axesDefault.marks ) {

								axes.marks = axesDefault.marks;

								//scaleControllers.marks is undefined если программист сначала установил max: Infinity,
								//соханил Player in cookie, например изменил marks
								//удалил max: Infinity,
								//Нажал кнопку Default для проигрывателя
								if ( scaleControllers.marks )
									scaleControllers.marks.setValue( axes.marks );

							}

							axes.interval = axesDefault.interval;
							scaleControllers.interval.setValue( axes.interval );
							if ( ( axesDefault.interval > scaleControllers.interval.__max ) || ( axesDefault.interval < scaleControllers.interval.__min )) {
								
								scaleControllers.interval.domElement.childNodes[0].childNodes[0].value = axesDefault.interval;
								axes.interval = axesDefault.interval;

							}

							setSettings();

						},

					}, 'defaultF' ), lang.defaultButton, lang.defaultTitle );

				}
				scale();

			};

			/**
			 * Adds player buttons into web page.
			 * @param {Object} options the following options are available
			 * @param {Object} [options.controllers.player] player buttons, available from web page
			 * @param {HTMLElement|string} [options.controllers.player.buttonPrev="prev"] Go to previous animation scene.
			 * <pre>
			 * HTMLElement - <b>input</b> element of the "button" type.
			 * string - <b>id</b> of <b>input</b> element.
			 * </pre>
			 * @param {HTMLElement|string} [options.controllers.player.buttonPlay="play"] play or pause of the playing.
			 * <pre>
			 * HTMLElement - <b>input</b> element of the "button" type.
			 * string - <b>id</b> of <b>input</b> element.
			 * </pre>
			 * @param {HTMLElement|string} [options.controllers.player.buttonNext="next"] Go to next animation scene.
			 * <pre>
			 * HTMLElement - <b>input</b> element of the "button" type.
			 * string - <b>id</b> of <b>input</b> element.
			 * </pre>
			*/
			this.createControllersButtons = function ( options ) {

				if ( !options.controllers || !options.controllers.player ) return;
				const settings = options.controllers.player;

				//Previous button

				if ( settings.buttonPrev === null ) console.warn( 'Player.createControllersButtons: invalid options.controllers.player.buttonPrev = ' + settings.buttonPrev );
				if ( settings.buttonPrev ) {

					const buttonPrev = typeof settings.buttonPrev === 'string' ? document.getElementById( settings.buttonPrev ) : settings.buttonPrev;
					if ( buttonPrev === null ) console.warn( 'Player.createControllersButtons: invalid options.controllers.player.buttonPrev = ' + settings.buttonPrev );
					if ( buttonPrev ) {

						buttonPrev.value = lang.prevSymbol;
						buttonPrev.title = lang.prevSymbolTitle;
						buttonPrev.onclick = function ( event ) { if ( options.player ) options.player.prev(); };
						settings.buttonPrev = buttonPrev;

					}

				}

				//Play button
				
				if ( settings.buttonPlay === null ) console.warn( 'Player.createControllersButtons: invalid options.controllers.player.buttonPlay = ' + settings.buttonPlay );
				if ( settings.buttonPlay ) {

					const buttonPlay = typeof settings.buttonPlay === 'string' ? document.getElementById( settings.buttonPlay ) : settings.buttonPlay;
					if ( buttonPlay === null ) console.warn( 'Player.createControllersButtons: invalid options.controllers.player.buttonPlay = ' + settings.buttonPlay );
					if ( buttonPlay ) {

						buttonPlay.value = playing ? lang.pause : lang.playSymbol;
						buttonPlay.title = playing ? lang.pauseTitle : lang.playTitle;
						buttonPlay.onclick = function ( event ) { if ( options.player ) options.player.play3DObject(); };
						settings.buttonPlay = buttonPlay;

					}

				}

				//Next button

				if ( settings.buttonNext === null ) console.warn( 'Player.createControllersButtons: invalid options.controllers.player.buttonNext = ' + settings.buttonNext );
				if ( settings.buttonNext ) {

					const buttonNext = typeof settings.buttonNext === 'string' ? document.getElementById( settings.buttonNext ) : settings.buttonNext;
					if ( buttonNext === null ) console.warn( 'Player.createControllersButtons: invalid options.controllers.player.buttonNext = ' + settings.buttonNext );
					if ( buttonNext ) {

						buttonNext.value = lang.nextSymbol;
						buttonNext.title = lang.nextSymbolTitle;
						buttonNext.onclick = function ( event ) { if ( options.player ) options.player.next(); };
						settings.buttonNext = buttonNext;

					}

				}

			};

			var _canvasMenu;
			/**
			 * Adds a Player's menu item into [CanvasMenu]{@link https://github.com/anhr/commonNodeJS/tree/master/canvasMenu}.
			 * @param {CanvasMenu} canvasMenu [CanvasMenu]{@link https://github.com/anhr/commonNodeJS/tree/master/canvasMenu}.
			* @param {Function} [getLanguageCode="en"] Your custom getLanguageCode() function.
			* <pre>
			* returns the "primary language" subtag of the language version of the browser.
			* Examples: "en" - English language, "ru" Russian.
			* See the {@link https://tools.ietf.org/html/rfc4646#section-2.1|rfc4646 2.1 Syntax} for details.
			* Default returns the 'en' is English language.
			* You can import { getLanguageCode } from '../../commonNodeJS/master/lang.js';
			* </pre>
			*/
			this.createCanvasMenuItem = function ( canvasMenu, getLanguageCode = function() { return 'en' } ) {

				_canvasMenu = canvasMenu;

				const player = this, menu = canvasMenu.menu, lang = player.localization( getLanguageCode );

				//Previous button
				menu.push( {

					name: lang.prevSymbol,
					title: lang.prevSymbolTitle,
					onclick: function ( event ) { player.prev(); }

				} );

				//Play button
				menu.push( {

					name: playing ? lang.pause : lang.playSymbol,
					title: playing ? lang.pauseTitle : lang.playTitle,
					id: "menuButtonPlay",
					onclick: function ( event ) {

						player.play3DObject();

					}

				} );

				if ( options.playerOptions.max !== null ) {

					//Repeat button
					menu.push( {

						name: lang.repeat,
						title: this.getSettings().repeat ? lang.repeatOff : lang.repeatOn,
						id: "menuButtonRepeat",
						onclick: function ( event ) { player.repeat(); }

					} );

				}

				//Next button
				menu.push( {

					name: lang.nextSymbol,
					title: lang.nextSymbolTitle,
					onclick: function ( event ) { player.next(); }

				} );

				this.controllers.push( {

					/* *
					 * Renames the "Play" button of the player's menu.
					 * @param {boolean} playing <b>true</b> - pause.
					 * <p><b>false</b> - play</p>
					 */
					onRenamePlayButtons: function ( playing ) {

						var name, title;
						if ( playing ) {

							name = lang.pause;
							title = lang.pauseTitle;

						} else {

							name = lang.playSymbol;
							title = lang.playTitle;

						}
						const elMenuButtonPlay = canvasMenu.querySelector( '#menuButtonPlay' );
						elMenuButtonPlay.innerHTML = name;
						elMenuButtonPlay.title = title;
						if ( options.controllers && options.controllers.player && options.controllers.player.buttonPlay ) {

							options.controllers.player.buttonPlay.value = name;
							options.controllers.player.buttonPlay.title = title;

						}

					},

					/* *
					 * Changes "Repeat" button of the player's menu between <b>repeat Off</b> and <b>repeat On</b>.
					 */
					onChangeRepeat: function () {

						canvasMenu.querySelector( '#menuButtonRepeat' ).title = options.playerOptions.repeat ? lang.repeatOff : lang.repeatOn;

					}

				} );

			};

			/**
			 * Adds slider menu item into [CanvasMenu]{@link https://github.com/anhr/commonNodeJS/tree/master/canvasMenu}.
			 */
			this.addSlider = function () {

				if ( options.playerOptions.max === null )
					return;

				_canvasMenu.menu.push( {

					name: '<input type="range" min="0" max="' + ( options.playerOptions.marks - 1 ) + '" value="0" class="slider" id="sliderPosition">',
					style: 'float: right;',

				} );

			};

			function getSliderElement() { if ( _canvasMenu ) return _canvasMenu.querySelector( '#sliderPosition' ); }

			/**
			 * Adds an events into slider menu item of the [CanvasMenu]{@link https://github.com/anhr/commonNodeJS/tree/master/canvasMenu}.
			 * @returns slider element
			 */
			this.addSliderEvents = function () {

				const elSlider = getSliderElement();
				if ( elSlider ) {

					elSlider.onchange = function ( event ) { player.selectScene( parseInt( elSlider.value ) ); };
					elSlider.oninput = function ( event ) { player.selectScene( parseInt( elSlider.value ) ); };

					var pointerdown;
					const player = this;
					elSlider.addEventListener( 'pointerdown', e => { pointerdown = true; } );
					elSlider.addEventListener( 'pointerup', e => { pointerdown = false; } );
					elSlider.addEventListener( 'mousemove', e => {

						if ( !pointerdown )
							return;
						player.selectScene( ( options.playerOptions.marks - 1 ) * e.offsetX / elSlider.clientWidth );

					} );

				}
				return elSlider;

			};

			/**
			 * Sets <b>index</b> and <b>title</b> of the slider element of the player's menu.
			 * @param {string} index
			 * @param {string} title
			 */
			this.setIndex = function ( index, title ) {

				const t = this.getTime();
				if ( options.controllers && options.controllers.t )
					options.controllers.t.controller.value = t;
				if ( typeof this.PlayController === "object" ) this.PlayController.setValue( t );
				const elSlider = getSliderElement();
				if ( elSlider ) {

					elSlider.value = index;
					elSlider.title = title;

				}

			};

			/**
			 * Changes the "max" value of the slider of the player's menu. Moves <b>Player</b> to the first scene.
			 * @param {Object} scale See  <b>options.playerOptions</b> parameter of <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
			 */
			this.onChangeScale = function ( scale ) {

				getSliderElement().max = scale.marks - 1;
				this.selectScene( 0 );

			};

		}

	}

	/**
	 * @class
	 */
	Player$1.cameraTarget = class {

		/**
		 * Functions for camera for looking at selected point.
		 */
		constructor() {

			const cameraTargetDefault = { boLook: false, },//По умолчанию не слежу за точкой
				_cameraTarget = {

					boLook: cameraTargetDefault.boLook,
					getDistanceToCamera() {

						if ( typeof this.distanceToCameraCur !== 'undefined' ) return this.distanceToCameraCur;
						return this.distanceToCamera;
						
					}
				};
			var _options;
			cameraTargetDefault.rotation = {};
			_cameraTarget.rotation = {};
			var boTarget = false,//true - target point was detected. For displaying of the console warning if duplicate target point was detected
				boPlayer = false;//true - была попытка получить camera из _options.player. Добавил что бы не выполнялась лишняя работа

			//Если определен ( boCameraTargetLook !== undefined ) , то явно было задано следить или не следить за точкой.
			//Тогда если есть точка, за которой надо следить ( cameraTarget.bodefault === false )
			//и явно не было задано следить или не следить заточкой  ( boCameraTargetLook === undefined ),
			//то надо следить за точкой ( cameraTargetDefault.boLook = true )
			var boCameraTargetLook;

			/**
			 * get camera target
			 * @param {Object} [options] See the <b>options</b> parameter of the <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
			 * @param {Object} [options.player] <a href="../../player/jsdoc/index.html" target="_blank">Player</a> instance.
			 */
			this.get = function ( options ) {

				if ( !options && !_options )
					console.error( 'Player.cameraTarget.get: options = ' + options );
				else if ( _options && options && !Object.is( _options, options ) )
					console.error( 'Player.cameraTarget.get: options is ambiguous' );
				_options = _options || options;
				if ( !_cameraTarget.camera && !boPlayer && _options.player ) {

					cameraTargetDefault.camera = _options.player.getSettings().cameraTarget.camera;
					if ( cameraTargetDefault.camera ) setCameraTarget();
					boPlayer = true;

				}
				if ( _cameraTarget.camera )
					return _cameraTarget;

			};

			/**
			 * Create default camera target
			 * @param {object} cameraTarget the following cameraTarget are available:
			 * @param {THREE.PerspectiveCamera} [cameraTarget.camera] [PerspectiveCamera]{@link https://threejs.org/docs/index.html#api/en/cameras/PerspectiveCamera}
			 * @param {boolean} [cameraTarget.boLook=false] true - camera look at the target.
			 * @param {THREE.Vector3} [cameraTarget.distanceToCamera] Distance from target point to camera.
			   * You can set the distance to the camera depending on the time.
			 * <pre>
			 *	Example 1: new THREE.Vector3( 0, 0, new Function( 't', 'return 2+t' ) )
			 *	Example 2: new THREE.Vector3( 0, 0,
			 *		[ { t: 0, v: 5 }, { t: 1, v: 2 }, { t: 10, v: 2 }, { t: 11, v: 5 } ] )
			 *	Default is camera.position.
			 * </pre>
			 * @param {object} [cameraTarget.rotation] rotation camera around point specified by an axis and an angle. Default is undefined - no rotation
			 * @param {number|function|array} [cameraTarget.rotation.angle=0] Angle of rotation in radians.
			 * <pre>
			 *   number. Example: Math.PI / 2 rotate to 90 degrees.
			 *   function. Example: new Function( 't', 'return 5*t' ).
			 *   array.
			 *     Example 1: [0, Math.PI]
			 *       0 is angle for t = min is start time of the playing.
			 *       Math.PI is rotate to 180 degrees
			 *         for t = max is time of the stopping of the playing.
			 *       If max time is infinity, then angle is for t = min.
			 *     Example 2: [{ t: 0, v: 0 }, { t: 1, v: Math.PI / 2 }
			 *       t is time,
			 *       v is angle for current t.
			 * </pre>
			 * @param {THREE.Vector3} [cameraTarget.rotation.axis] Axis of rotattion.
			 * <pre>
			 *   Example: new THREE.Vector3( 1, 0, 0 ) - rotate around x axis.
			 *   Default is rotate around y axis
			 * </pre>
			 * @param {Object} options See the <b>options</b> parameter of the <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
			 * @param {boolean} [boErrorMessage=true] false - Do not send an error message to the console if <b>cameraTarget.camera</b> is not defined.
			 */
			this.init = function ( cameraTarget, options, boErrorMessage = true ) {

				if ( !cameraTarget ) return;
				
				if ( !options && !_options )
					console.error( 'Player.cameraTarget.init: options = ' + options );
				else if ( _options && options && !Object.is( _options, options ) )
					console.error( 'Player.cameraTarget.init: options is ambiguous' );
				_options = _options || options;

				//cameraTargetDefault.boLook = false по умолчанию камера не смотритт на выбранную точку если:
				// 1 ни разу не вызывается init. Тоесть нет настроек cameraTargetDefault и нет ни однойточки, на которую смотрит камера
				// 2 cameraTarget.bodefault !== false и cameraTarget.boLook = false - программист явно запретил смотреть на точку

				//Если есть хоть одна точка, на которую должна смотреть камера cameraTarget.bodefault === false,
				//то для этой точки не устанавливаем playerCameraTarget.cameraTargetDefault
				//Другими словами если есть точка, на которую должна смотреть камера,
				//то камера будет на нее смотреть если нет запрета смотеть на точку - playerCameraTarget.cameraTargetDefault = false
				if ( cameraTarget.bodefault !== false ) {

					if ( boTarget )
						return;//Не надо устанавливать cameraTargetDefault после того,
					//как были устанвлены настройки cameraTargetDefault из точек
					//Иначе натройки точки не будут приоритетными

					if ( cameraTarget.boLook !== undefined ) {

						cameraTargetDefault.boLook = cameraTarget.boLook;
						boCameraTargetLook = cameraTarget.boLook;

					}

				} else if ( cameraTarget.boLook === true ) {

					//Есть точка, за которой надо следить

					if ( boTarget ) console.warn( 'playerCameraTarget().init(...): duplicate target point' );
					boTarget = true;

					if ( boCameraTargetLook === undefined )
						cameraTargetDefault.boLook = true;//запрета на слежение камерой за точкой не было и есть точка, за которой надо следить

				} else return;
				cameraTargetDefault.camera = cameraTargetDefault.camera ||
					cameraTarget.camera ||
					( _options.player ? _options.player.getSettings().cameraTarget.camera : undefined );
				if ( !cameraTargetDefault.camera && boErrorMessage ) {

					console.error( 'playerCameraTarget().init(...): cameraTargetDefault.camera = ' + cameraTargetDefault.camera );
					return;

				}
				cameraTargetDefault.distanceToCamera = cameraTargetDefault.distanceToCamera || cameraTarget.distanceToCamera;
				cameraTarget.rotation = cameraTarget.rotation || {};
				cameraTargetDefault.rotation.angle = cameraTargetDefault.rotation.angle || cameraTarget.rotation.angle;
				cameraTargetDefault.rotation.axis = cameraTargetDefault.rotation.axis || cameraTarget.rotation.axis;
				setCameraTarget( cameraTarget );

			};
			function setCameraTarget( cameraTarget ) {

				assign$1();

				if ( !cameraTarget )
					cameraTarget = cameraTargetDefault;//У выбранной для слежения точки нет cameraTarget
				if ( !_cameraTarget.boMaual ) {//если не делать эту проверку, то пользователь не сможет изменить вручную _cameraTarget.boLook когда выбрана точка, за которой надо следить

					if ( cameraTarget.boLook !== undefined )
						_cameraTarget.boLook = cameraTarget.boLook;
					else _cameraTarget.boLook = cameraTargetDefault.boLook;

				}
				cameraTargetDefault.camera = cameraTargetDefault.camera || cameraTarget.camera;
				_cameraTarget.camera = cameraTarget.camera || cameraTargetDefault.camera;

				//Если в программе не определены функции distanceToCamera (тоесть cameraTarget.distanceToCamera === undefined и cameraTargetDefault.distanceToCamera === undefined),
				//то при проигрывании каждый раз distanceToCamera будет равна camera.position
				//		_cameraTarget.distanceToCamera = cameraTarget.distanceToCamera || cameraTargetDefault.distanceToCamera || new THREE.Vector3().copy( cameraTargetDefault.camera.position );

				//Если в программе не определены функции distanceToCamera (тоесть cameraTarget.distanceToCamera === undefined и cameraTargetDefault.distanceToCamera === undefined),
				//То сначала _cameraTarget.distanceToCamera будет равна camera.position, а потом при проигрывании не будет меняться
				_cameraTarget.distanceToCamera =
					cameraTarget.distanceToCamera ||
					cameraTargetDefault.distanceToCamera ||
					_cameraTarget.distanceToCamera ||
					new THREE.Vector3().copy( cameraTargetDefault.camera.position );

				if ( !cameraTarget.rotation ) cameraTarget.rotation = {};
				if ( cameraTarget.rotation.angle !== undefined )
					_cameraTarget.rotation.angle = cameraTarget.rotation.angle;
				else _cameraTarget.rotation.angle = cameraTargetDefault.rotation.angle || 0;
				_cameraTarget.rotation.axis = cameraTarget.rotation.axis || cameraTargetDefault.rotation.axis || new THREE.Vector3( 0, 1, 0 );//Rotate around y axis

			}

			/**
			 * Change target.
			 * @param {THREE.Mesh} mesh [Mech]{@link https://threejs.org/docs/index.html#api/en/objects/Mesh} with selected point as target for camera.
			 * @param {number} i index of the point.
			 * @param {Options} [options] See <a href="../../jsdoc/Options/index.html" target="_blank">Options</a>.
			 */
			this.changeTarget = function ( mesh, i, options ) {

				assign$1();

				//Update cameraTarget
				const func = !mesh.userData.player || ( typeof mesh.userData.player.arrayFuncs === "function" ) ? {} :
					mesh.userData.player.arrayFuncs[mesh.userData.myObject.guiPoints.seletedIndex(i)];
				if ( func != undefined ) {
					
					if ( !func.cameraTarget )
						func.cameraTarget = { boLook: false };
					setCameraTarget( func.cameraTarget );

				}

				_options = _options || options;
				const cameraTarget = _options.playerOptions.cameraTarget.get( _options );

				if ( cameraTarget ) {

					if ( cameraTarget && cameraTarget.boLook ) {

						const target = getWorldPosition( mesh, new THREE.Vector3().fromArray( mesh.geometry.attributes.position.array, i * mesh.geometry.attributes.position.itemSize ) );
						cameraTarget.target = target;

					} else delete cameraTarget.target;

				}

			};
			/**
			 * Update camera settings.
			 * @param {Object} options See the <b>options</b> parameter of the <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
			 */
			this.setCameraTarget = function ( options ) {

				assign$1();

				var cameraTarget = options.playerOptions.cameraTarget.get( options );
				if ( !cameraTarget ) cameraTarget = cameraTarget || {};
				const camera = cameraTarget.camera;

				if ( !camera )
					return;//В этом приложении невозможно следить за точкой, потому что ни разу не была вызывана Player.cameraTarget.init()

				//На случай когда не определена ни одна точка как cameraTarget и пользователь поставил птичку в controllerCameraTarget
				if ( !cameraTarget.distanceToCamera )
					cameraTarget.distanceToCamera = new THREE.Vector3().copy( camera.position );

				if ( !cameraTarget.distanceToCameraCur )
					cameraTarget.distanceToCameraCur = new THREE.Vector3();

				const t = options.time,
					distanceToCamera = cameraTarget.distanceToCamera,
					distanceToCameraCur = new THREE.Vector3().copy( cameraTarget.distanceToCameraCur );
				cameraTarget.distanceToCameraCur.set(

					Player$1.execFunc( distanceToCamera, 'x', t, options ),
					Player$1.execFunc( distanceToCamera, 'y', t, options ),
					Player$1.execFunc( distanceToCamera, 'z', t, options )

				);

				if ( !cameraTarget.setCameraPosition )
					cameraTarget.setCameraPosition = function ( /*setCameraDefault*/ ) {

						var target = cameraTarget.target;

						//не менять позицию камеры если
						if (
							!cameraTarget.boLook ||//не следить за точкой
							(//или
								!target &&//нет точки, за которой надо следить
								cameraTarget.distanceToCameraCur.equals( distanceToCameraCur )//и не изменилось расстояние камеры до target
							)
						) {

							return;//Камере не нужно следить за выбранной точкой или ни одна точка не определена как target

						}
						
						distanceToCameraCur.copy( cameraTarget.distanceToCameraCur );
						const t = options.time;
						camera.position.copy( cameraTarget.distanceToCameraCur );
						camera.position.applyAxisAngle( cameraTarget.rotation.axis, Player$1.execFunc( cameraTarget.rotation, 'angle', t, options ) );
						if ( !target ) {

							if ( Player$1.orbitControls ) target = Player$1.orbitControls.target;
							else {

								//console.warn( 'Under constaction' );
								return;

							}

						}
						camera.position.add( target );
						camera.lookAt( target );
						if ( options.orbitControls ) {

							if ( !options.orbitControls.target.equals( target ) ) {

								options.orbitControls.target.copy( target );
								if ( options.orbitControlsGui )
									options.orbitControlsGui.setTarget( target );

							}
							if ( options.orbitControls._listeners )
								options.orbitControls._listeners.change[0]();//move frustumpoints

						}

					};

				if ( options.cameraGui ) options.cameraGui.update();

			};

		}

	};

	/** @namespace
	 * @description execute function
	 * @param {THREE.Vector4} funcs vector of the functions for executing.
	 * @param {string} axisName axis name of the function for executing. Can be as "x", "y", "z", "w".
	 * @param {number} t time. First parameter of the function for executing.
	 * @param {object} [options={}] the following options are available:
	 * @param {number} [options.a=1] multiplier. Second parameter of the function for executing.
	 * @param {number} [options.b=0] addendum. Third parameter of the function for executing.
	 * @returns function execution value.
	 */
	Player$1.execFunc = function ( funcs, axisName, t, options={} ) {

		var func = funcs[axisName];
		const a = options.a, b = options.b, typeofFuncs = typeof func;
		if ( typeof t === "undefined" ) t = options.playerOptions ? options.playerOptions.min : 0;
		switch ( typeofFuncs ) {

			case "undefined":
				return undefined;
			case "number":
				return func;
			case "string":
				func = new Function( 't', 'a', 'b', 'return ' + func );
			case "function":
				try {

					const res = func( t, a, b );
					if ( res === undefined )
						throw 'function returns ' + res;
					if ( !Array.isArray( res ) ) return res;
					else func = res;

				} catch( e ) {

					console.error( e );
					throw e;

				}
			case "object":
				if ( Array.isArray( func ) ) {

					if ( func.length === 0 ) {

						console.error( 'Player.execFunc: funcs["' + axisName + '"] array is empty' );
						return;

					}
					const a = func,
						l = func.length - 1,
						max = options.playerOptions.max === null ? Infinity : options.playerOptions.max,
						min = options.playerOptions.min,
						tStep = ( max - min ) / l;
					var tStart = min, tStop = max,
						iStart = 0, iStop = l;
					for ( var i = 0; i < func.length; i++ ) {

						if ( tStep * i + min < t ) {

							iStart = i;
							iStop = i + 1;
							tStart = tStep * iStart + min;
							tStop = tStep * iStop + min;

						}

					}
					function execW( i ) {

						if ( typeof a[i] === "function" )
							return a[i]( t, a, b );
						if ( a[i] instanceof THREE.Color )
							return a[i];

					}
					if ( typeof a[iStart] !== "number" ) {

						if ( axisName === 'w' ) {

							return execW( iStart );

						}
						if ( typeof a[iStart] === "object" ) {

							for ( var i = 0; i < func.length; i++ ){

								if ( i === ( func.length - 1 ) ) return a[i].v;

								iStart = i; iStop = i + 1;
								tStart = a[iStart].t; tStop = a[iStop].t;
								if ( ( tStart <= t ) && ( tStop > t ) ) {

									var x = ( a[iStop].v - a[iStart].v ) / ( tStop - tStart ),
										y = a[iStart].v - x * tStart;
									return x * t + y;

								}

							}
							console.error( 'Player.execFunc: value is not detected' );
							return;

						} else {

							console.error( 'Player.execFunc: funcs["' + axisName + '"] array item ' + iStart + ' typeof = ' + ( typeof a[iStart] ) + ' is not number' );
							return;

						}

					}
					if ( iStop >= func.length ) iStop = iStart;
					if ( typeof a[iStop] !== "number" ) {

						if ( axisName === 'w' )
							return execW( iStop );
						if ( typeof a[iStop] !== "object" ) {

							console.error( 'Player.execFunc: funcs["' + axisName + '"] array item ' + iStop + ' typeof = ' + ( typeof a[iStop] ) + ' is not number' );
							return;

						}

					}
					var x = ( a[iStop] - a[iStart] ) / ( tStop - tStart ),
						y = a[iStart] - x * tStart;
					if ( isNaN( x ) || isNaN( y ) ) console.error( 'Player.execFunc: invalid x = ' + x + ' or y = ' + y );
					return x * t + y;

				}
				if ( func.func )
					return func.func instanceof Function ? func.func( t, a, b ) : func.func;
				if ( axisName !== 'w' )
					console.error( 'Player.execFunc: funcs["' + axisName + '"] object is not array' );
				return func;
			default:
				console.error( 'Player.execFunc: Invalud typeof funcs["' + axisName + '"]: ' + typeofFuncs );
		}
		return;

	};

	var lang$1;

	class Ids {

		constructor() {

			function addKeys( axisName ) {

				function keyValue( controllerId ) {

					const id = axisName + controllerId;
					return {

						get controllerId() { return this.boUsed ? undefined : id; },
						get elController() { return document.getElementById( this.controllerId ); },

						nameId: id + 'Name',
						get elName() { return document.getElementById( this.nameId ); },

					}

				}
				return {

					func: keyValue( 'Func' ),
					position: keyValue( 'Position' ),
					worldPosition: keyValue( 'WorldPosition' ),

				}

			}
			this.x = addKeys( 'x' );
			this.y = addKeys( 'y' );
			this.z = addKeys( 'z' );
			this.w = addKeys( 'w' );
			/*
				y: addKeys( 'y' ),
				z: addKeys( 'z' ),
				w: addKeys( 'w' ),
			*/

		}

	}
	var ids = new Ids();

	/** @namespace
	 * @description Select a scene for playing of the mesh
	 * @param {THREE.Mesh} mesh [Mech]{@link https://threejs.org/docs/index.html#api/en/objects/Mesh} for playing.
	 * @param {Object} [settings={}] the following settings are available
	 * @param {number} [settings.t=0] time
	 * @param {Object} [settings.options={ dat: false }] See the <b>options</b> parameter of the <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
	 * @param {boolean} [settings.options.boPlayer] true - is not select play scene for mesh.userData.boFrustumPoints = true. Default is false.
	 * @param {object} [settings.options.playerOptions] The <b>settings.options.playerOptions</b> parameter of the <a href="./module-Player-Player.html" target="_blank">Player</a> .
	 * @param {number} [settings.options.a] multiplier. Second parameter of the arrayFuncs item function. Default is 1.
	 * @param {number} [settings.options.b] addendum. Third parameter of the arrayFuncs item function. Default is 0.
	 * @param {object} [settings.options.scales] axes scales.
	 * See <b>options.scales</b> of the <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> for details.
	 * @param {object} [settings.options.palette=new ColorPicker.palette();//palette: ColorPicker.paletteIndexes.BGYW] See <a href="../../colorPicker/jsdoc/module-ColorPicker.html#~Palette" target="_blank">ColorPicker.palette</a>.
	 * @param {object} [settings.options.point={}] point settings. Applies to points with ShaderMaterial.
	 * <pre>
	 * See [ShaderMaterial]{@link https://threejs.org/docs/index.html#api/en/materials/ShaderMaterial} for details.
	 * The size of the point seems constant and does not depend on the distance to the camera.
	 * </pre>
	 * @param {number} [settings.options.point.size=0.02] The apparent angular size of a point in radians.
	*/
	Player$1.selectMeshPlayScene = function ( mesh, settings = {} ) {

		assign$1();

		var t = settings.t, options = settings.options || { dat: false };

		options = new Options$1( options );
		if ( t === undefined ) t = options.playerOptions.min;
		options.scales.setW();
		if (

			!mesh.userData.player ||
			( options && options.boPlayer && mesh.userData.boFrustumPoints )

		)
			return;

		//Эти строки нужны что бы появлялся текст возле точки, если на нее наведена мышка
		//при условии, что до этого точка была передвинута с помошью проигрывателя.
		if ( mesh.geometry ) {//scene do not have geometry

			delete mesh.geometry.boundingSphere;
			mesh.geometry.boundingSphere = null;

		}

		if ( mesh.userData.player.selectPlayScene ) {

			mesh.userData.player.selectPlayScene( t );

			//если не приводить угол поворота в диапазон 0 - 360 градусов,
			//то угол поворота будет равен нулю или Math.PI * 2
			//когда пользователь выберет mesh в guiSelectPoint.js
			//потому что в органе управления угла поворота угол поворота ограничен 0 - 360 градусов,
			//смотри строку
			//cRotations[name] = fRotation.add( new THREE.Vector3(), name, 0, Math.PI * 2, 1 / 360 ).
			//в guiSelectPoint
			function setRotation( axisName ) {

				while ( mesh.rotation[axisName] < 0 ) mesh.rotation[axisName] += Math.PI * 2;
				while ( mesh.rotation[axisName] > Math.PI * 2 ) mesh.rotation[axisName] -= Math.PI * 2;

			}
			setRotation( 'x' );
			setRotation( 'y' );
			setRotation( 'z' );
			
		}

		function setAttributes( a, b ) {

			if ( !mesh.geometry || mesh.userData.nd )
				return;
				
			const attributes = mesh.geometry.attributes,
				arrayFuncs = mesh.userData.player.arrayFuncs;
			if ( arrayFuncs === undefined )
				return;
			if ( t === undefined )
				console.error( 'setPosition: t = ' + t );

			var min, max;
			if ( options && ( options.scales.w !== undefined ) ) {

				min = options.scales.w.min; max = options.scales.w.max;

			} else {

				max = value;
				min = max - 1;

			}

			if ( !mesh.userData.myObject || !mesh.userData.myObject.isSetPosition ) {
				for (var i = 0; i < arrayFuncs.length; i++) {

					var funcs = arrayFuncs[i], needsUpdate = false;
					function setPosition(axisName, fnName) {

						var value = Player$1.execFunc(funcs, axisName, t, options);// a, b );
						if (value !== undefined) {

							attributes.position[fnName](i, value);
							needsUpdate = true;

						}

					}
					setPosition('x', 'setX');
					setPosition('y', 'setY');
					setPosition('z', 'setZ');
					setPosition('w', 'setW');

					//если тут поставить var то цвет точки, которая определена как THREE.Vector3 будет равет цвету предыдущей точки
					//потому что перемнные типа var видны снаружи блока {}
					let color;

					function getColor() {

						if (mesh.userData.player.palette)
							color = mesh.userData.player.palette.toColor(value, min, max);
						else if (options.palette)
							color = options.palette.toColor(value, min, max);
						else {

							const c = { r: 255, g: 255, b: 255 };
							color = new THREE.Color("rgb(" + c.r + ", " + c.g + ", " + c.b + ")");
							return color;

						}

					}

					if (typeof funcs.w === "function") {

						var value = funcs.w(t, a, b);
						if (options.scales.w) {

							min = options.scales.w.min;
							max = options.scales.w.max;

						} else {

							console.warn('Player.selectMeshPlayScene: Кажется эти экстремумы заданы неверно');
							min = 0;
							max = 100;

						}
						if (attributes.position.itemSize >= 4)
							attributes.position.setW(i, value);
						needsUpdate = true;

						getColor();

					} else if (typeof funcs.w === "object") {

						if (funcs.w instanceof THREE.Color)
							color = funcs.w;
						else {

							var value = Player$1.execFunc(funcs, 'w', t, options);
							if (funcs.w.min !== undefined) min = funcs.w.min;
							if (funcs.w.max !== undefined) max = funcs.w.max;
							getColor();

						}

					}
					color = setColorAttibute(
						funcs.w === undefined ?
							new THREE.Vector4().w :
							typeof funcs.w === "number" ? funcs.w : Player$1.execFunc(funcs, 'w', t, options),
						mesh, i, color);
					if (needsUpdate)
						attributes.position.needsUpdate = true;

					if (funcs.trace && !funcs.line) {

						funcs.line = new Player$1.traceLine(options);
						funcs.trace = false;

					}
					if (funcs.line && funcs.line.addPoint)
						funcs.line.addPoint(mesh, i, color);
					if (funcs.cameraTarget && (funcs.cameraTarget.boLook === true))
						options.playerOptions.cameraTarget.changeTarget(mesh, i, options);

				}

			}

		}
		setAttributes( options ? options.a : 1, options ? options.b : 0 );
		const message = 'Player.selectMeshPlayScene: invalid mesh.scale.';
		if ( mesh.scale.x <= 0 ) console.error( message + 'x = ' + mesh.scale.x );
		if ( mesh.scale.y <= 0 ) console.error( message + 'y = ' + mesh.scale.y );
		if ( mesh.scale.z <= 0 ) console.error( message + 'z = ' + mesh.scale.z );

		function setColorAttibute( value, mesh, index , color ){

			if ( 
				//не менять цвет точки если позиция состоит из 3 значений
				//такая ситуация имеется в геометрических фигурах. Например в кубе
				( mesh.geometry.attributes.position.itemSize < 4 )// ||
				//( options.scales.w.isColor === false )//цвет точки не зависит от координаты w точки
			) return;

			if ( options.palette )
				color = options.palette.toColor( value, options.scales.w.min, options.scales.w.max );
			if (!color) return;
			const attributes = mesh.geometry.attributes, arrayFuncs = mesh.userData.player.arrayFuncs;
			if ( !Player$1.setColorAttribute( attributes, index, color ) && arrayFuncs[index] instanceof THREE.Vector4 ) {

				if ( mesh.userData.player && arrayFuncs ) {

					mesh.geometry.setAttribute( 'color',
						new THREE.Float32BufferAttribute( Player$1.getColors( arrayFuncs,
							{

								positions: attributes.position,
								options: options,

							} ), 4 ) );
					if ( !Player$1.setColorAttribute( attributes, index, color ) )
						console.error( 'Player.selectMeshPlayScene: the color attribute is not exists. Please use THREE.Vector3 instead THREE.Vector4 in the arrayFuncs or add "color" attribute' );

				} else console.error( 'Player.selectMeshPlayScene: set color attribute failed. Invalid mesh.userData.player.arrayFuncs' );

			}
			return color;

		}

		if ( mesh.userData.player && mesh.userData.player.arrayFuncs && mesh.userData.player.arrayFuncs instanceof Array )
			mesh.userData.player.arrayFuncs.forEach( function ( func, index ) {

				if ( func.controllers ) {

					//Localization

					if ( !lang$1 ) {
						lang$1 = {


							controllerXTitle: 'X position',
							controllerYTitle: 'Y position',
							controllerZTitle: 'Z position',
							controllerWTitle: 'color index',

							controllerWorld: 'World',

							controllerXWorldTitle: 'X world position',
							controllerYWorldTitle: 'Y world position',
							controllerZWorldTitle: 'Z world position',
							controllerWWorldTitle: 'color index',

							controllerXFunctionTitle: 'X = f(t)',
							controllerYFunctionTitle: 'Y = f(t)',
							controllerZFunctionTitle: 'Z = f(t)',
							controllerWFunctionTitle: 'W = f(t)',

							positionAlert: 'Invalid position fromat: ',

						};
						switch ( options.getLanguageCode() ) {

							case 'ru'://Russian language

								lang$1.controllerXTitle = 'Позиция X';
								lang$1.controllerYTitle = 'Позиция Y';
								lang$1.controllerZTitle = 'Позиция Z';
								lang$1.controllerWTitle = 'Индекс цвета';

								lang$1.controllerWorld = 'Абсолютный';

								lang$1.controllerXWorldTitle = 'Абсолютная позиция X';
								lang$1.controllerYWorldTitle = 'Абсолютная позиция Y';
								lang$1.controllerZWorldTitle = 'Абсолютная позиция Z';
								lang$1.controllerWWorldTitle = 'Индекс цвета';


								lang$1.positionAlert = 'Неправильный формат позиции точки: ';

								break;
							default://Custom language
								if ( ( options.lang === undefined ) || ( options.lang.languageCode != languageCode ) )
									break;

								Object.keys( options.lang ).forEach( function ( key ) {

									if ( lang$1[key] === undefined )
										return;
									lang$1[key] = options.lang[key];

								} );

						}

					}

					const positionLocal = getObjectLocalPosition( mesh, index );
					function setPosition( value, axisName ) {

						const axesId = axisName === 'x' ? 0 : axisName === 'y' ? 1 : axisName === 'z' ? 2 : axisName === 'w' ? 3 : undefined;
						if ( axisName === 'w' ){

							setColorAttibute( value, mesh, index );
							if ( options.guiSelectPoint )
								options.guiSelectPoint.update();

						}

						const indexValue = axesId + mesh.geometry.attributes.position.itemSize * index,
							valueOld = mesh.geometry.attributes.position.array[ indexValue ];
						mesh.geometry.attributes.position.array[ indexValue ] = value;
						const axisControllers = func.controllers[axisName];
						if ( isNaN( mesh.geometry.attributes.position.array[ indexValue ] ) ) {

							alert( lang$1.positionAlert + value );
							const controller = axisControllers.position.controller;
							controller.focus();
							controller.value = valueOld;
							mesh.geometry.attributes.position.array[ indexValue ] = valueOld;
							return;
							
						}
						mesh.geometry.attributes.position.needsUpdate = true;
						if ( options.axesHelper )
							options.axesHelper.updateAxes();
						if ( options.guiSelectPoint )
							options.guiSelectPoint.update();
						if ( axisControllers.worldPosition && axisControllers.worldPosition.controller ) {

							const controller = axisControllers.worldPosition.controller;
							
							controller.innerHTML = getObjectPosition( mesh, index )[axisName];

						}

					}
					function createControllers( axisName ) {

						var axisControllers = func.controllers[axisName];
						if ( axisControllers === false ) return;
						const position = 'position';
						//если Controllers для текущей оси не определен а на веб странице есть Controllers для этой оси
						//то нужно создать axisControllers
						if ( !axisControllers && ( ids[axisName].func.elController || ids[axisName].position.elController || ids[axisName].worldPosition.elController ) ) {

							axisControllers = {};
							func.controllers[axisName] = axisControllers;

						}
						if ( !axisControllers ) return;
						//добавляем в axisControllers те Controllers, которые есть на веб странице для текущей оси
						function addKey( keyName ) {

							if ( !ids[axisName][keyName].elController ) return;
							if ( !axisControllers[keyName] ) {

								if ( !ids[axisName][keyName].boUsed ) {

									axisControllers[keyName] = {

										controller: ids[axisName][keyName].elController,
										elName: ids[axisName][keyName].elName ? ids[axisName][keyName].elName : false,

									};
									ids[axisName][keyName].boUsed = true;
									if ( ( keyName === position ) && ( axisName === 'w' ) )
										axisControllers[keyName].elSlider = true;

								} else console.warn( 'Player.selectMeshPlayScene createControllers: Same controller is using for different points. Controller ID is "' + ids[axisName][keyName].controllerId + '""' );

							}

						}
						addKey( 'func' );
						addKey( position );
						addKey( 'worldPosition' );

						createController( axisControllers.func, ids[axisName].func.controllerId, function () { return options.scales[axisName].name + ' = f(t)'; }, {

							value: func[axisName],
							title: axisName === 'x' ? lang$1.controllerXFunctionTitle : axisName === 'y' ? lang$1.controllerYFunctionTitle : axisName === 'z' ? lang$1.controllerZFunctionTitle : axisName === 'w' ? lang$1.controllerWFunctionTitle : '',
							onchange: function ( event ) {

								try {

									func[axisName] = event.currentTarget.value;
									const value = Player$1.execFunc( func, axisName, options.player.getTime(), options );
									if ( axisControllers.position && axisControllers.position.controller ) {

										const controller = axisControllers.position.controller;
										controller.onchange( { currentTarget: { value: value } } );
										controller.value = value;

									} else
										setPosition( value, axisName );
									if ( options.guiSelectPoint )
										options.guiSelectPoint.update();

								} catch ( e ) {

									alert( 'Axis: ' + options.scales[axisName].name + '. Function: "' + func[axisName] + '". ' + e );
									event.currentTarget.focus();

								}

							},

						} );

						//position
						createController( axisControllers.position, axisName + 'Position', function () { return options.scales[axisName].name; }, {

							value: positionLocal[axisName],
							title: axisName === 'x' ? lang$1.controllerXTitle : axisName === 'y' ? lang$1.controllerYTitle : axisName === 'z' ? lang$1.controllerZTitle : axisName === 'w' ? lang$1.controllerWTitle : '',
							onchange: function ( event ) { setPosition( event.currentTarget.value, axisName ); },
							axisName: axisName,

						} );

						//World position
						createController( axisControllers.worldPosition, axisName + 'WorldPosition', function () { return lang$1.controllerWorld + ' ' + options.scales[axisName].name; }, {

							value: getWorldPosition( mesh, positionLocal )[axisName],
							title: axisName === 'x' ? lang$1.controllerXWorldTitle : axisName === 'y' ? lang$1.controllerYWorldTitle : axisName === 'z' ? lang$1.controllerZWorldTitle : axisName === 'w' ? lang$1.controllerWTitle : '',

						} );

					}

					//point name
					if ( func.name ) {

						if ( !func.controllers.pointName ) func.controllers.pointName = 'pointName';
						const elPointName = typeof func.controllers.pointName === "string" ? document.getElementById( func.controllers.pointName ) : func.controllers.pointName ;
						if ( elPointName ) elPointName.innerHTML = func.name;

					}

					createControllers( 'x' );
					createControllers( 'y' );
					createControllers( 'z' );
					createControllers( 'w' );

				}

			} );

		if ( !options || !options.guiSelectPoint ) {

			if ( options.axesHelper ) options.axesHelper.movePosition();
			return;

		}

		options.guiSelectPoint.setMesh();

		var selectedPointIndex = options.guiSelectPoint.getSelectedPointIndex();
		if ( ( selectedPointIndex !== -1 ) && options.guiSelectPoint.isSelectedMesh( mesh ) ) {

			options.guiSelectPoint.setPosition( {

				object: mesh,
				index: selectedPointIndex,

			} );

		}

	};

	/** @namespace
	 * @description set color attribute
	 * @param {Object} attributes [geometry.attributes]{@link https://threejs.org/docs/index.html?q=geometry#api/en/core/BufferGeometry.attributes} of the mesh
	 * @param {number} i index of the color in the color attribute array.
	 * @param {THREE.Color} color color.
	 * @returns true - success
	 * <p>false - colorAttribute was not detected.</p>
	 */
	Player$1.setColorAttribute = function ( attributes, i, color ) {

		if ( typeof color === "string" )
			color = new THREE.Color( color );
		const colorAttribute = attributes.color;// || attributes.ca;
		if ( colorAttribute === undefined )
			return false;
		colorAttribute.setX( i, color.r );
		colorAttribute.setY( i, color.g );
		colorAttribute.setZ( i, color.b );
		colorAttribute.needsUpdate = true;
		return true;

	};

	/** @namespace
	 * @description Get array of THREE.Vector4 points.
	 * @param {THREE.Vector4|THREE.Vector3|THREE.Vector2|object|array} arrayFuncs <b>points.geometry.attributes.position</b> array
	 * <pre>
	 * THREE.Vector4: 4D point.
	 * THREE.Vector3: 3D point. w = 1. Default is white color
	 * THREE.Vector2: 2D point. w = 1, z = 0. Default is white color
	 * Vector's x, y, z, w is position of the point.
	 * Can be as:
	 * <ul>
	 * <li>float - position of the point.</li>
	 * Example: 0.5
	 * <li>[float] - array of positions of the point.</li>
	 * Example 1: [0.6, 0, -0.5]
	 * 0.6 is positon for t = min is start time of the playing.
	 * 0 is position for t = ( max - min ) / 2
	 * -0.5 is positon for t = max is stop time of the playing.
	 * If stop time of the playing is infinity, then position is equal to the first item of the array or 0.6 in the example 1.
	 * 
	 * Example 2: [{ t: 0, v: 0.6 }, { t: 1, v: -0.6 }]
	 * Every item of array is object with:
	 * t is time
	 * v is position for current t.
	 * <li>[Function]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function} - position of the point is function of the t.
	 * Example: new Function( 't', 'a', 'b', 'return Math.sin(t*a*2*Math.PI)*0.5+b' )</li>
	 * <li>string - text of the function.
	 * Example: 'Math.sin(t*a*2*Math.PI)*0.5+b' )</li>
	 * </ul>
	 * <b>Vector.w</b> is index of the [palette]{@link https://github.com/anhr/commonNodeJS/tree/master/colorpicker}.
	 * Default range of the <b>Vector.w</b> is from 0 to 1. You can change range by use an object:
	 * {
	 *   func: Vector.w
	 *   max: new max value of tne Vector.w
	 *   min: new min value of tne Vector.w
	 * }
	 * Example:
	 * {
	 *
	 *   func: new Function( 't', 'return 1-2*t' ),
	 *   min: -1,
	 *   max: 1,
	 *
	 * }
	 * <b>Vector.w</b> can be as [THREE.Color]{@link https://threejs.org/docs/index.html?q=colo#api/en/math/Color}. Example: new THREE.Color( "rgb(255, 127, 0)" )
	 *
	 * object: {
	 *   vector: THREE.Vector4|THREE.Vector3|THREE.Vector2 - point position
	 *   [name]: point name. Default is undefined.
	 *   [trace]: true - displays the trace of the point movement. Default is undefined.
	 *   
	 *   //You can set the camera to look at a point. Use <b>cameraTarget</b> key for it.
	 *   //ATTENTION!!! Only one point can have <b>cameraTarget</b> key!
	 *   //   You will receive the 
	 *   
	 *   //      Player.getPoints: duplicate cameraTarget
	 *   
	 *   //   console warning if two or more points have <b>cameraTarget</b> key.
	 *   //   Then only last point with <b>cameraTarget</b> key will be have an effect.
	 *   [cameraTarget]: {
	 *
	 *      camera: [camera]{@link https://threejs.org/docs/index.html#api/en/cameras/PerspectiveCamera},
	 *      
	 *      //rotation camera around point specified by an axis and an angle. Default is undefined - no rotation
	 *      [rotation]: {
	 *      
	 *         [angle]: number|function|array. Angle of rotation in radians.
	 *            number. Example: Math.PI / 2 rotate to 90 degrees.
	 *            function. Example: new Function( 't', 'return 5*t' ).
	 *            array. Example 1: [0, Math.PI]
	 *                  0 is angle for t = min is start time of the playing.
	 *                  Math.PI is rotate to 180 degrees for t = max is time of the stopping of the playing.
	 *                  If max time is infinity, then angle is for t = min.
	 *               Example 2: [{ t: 0, v: 0 }, { t: 1, v: Math.PI / 2 }
	 *                  t is time,
	 *                  v is angle for current t.
	 *            
	 *            Default is 0
	 *
	 *         [axis]: THREE.Vector3. Axis of rotattion. Example: new THREE.Vector3( 1, 0, 0 ) - rotate around x axis.
	 *            Default is new THREE.Vector3( 0, 1, 0 );//Rotate around y axis
	 *            
	 *      },
	 *      
	 *      [distanceToCamera]: <b>THREE.Vector3</b>. Distance from point to camera.
	 *         You can set the distance to the camera depending on the time.
	 *         Example 1: new THREE.Vector3( 0, 0, new Function( 't', 'return 2+t' ) )
	 *         Example 2: new THREE.Vector3( 0, 0, [{ t: 0, v: 5 }, { t: 1, v: 2 }, { t: 10, v: 2 }, { t: 11, v: 5 }] )
	 *         Default is camera.position.
	 *      [orbitControls]: [OrbitControls]{@link https://threejs.org/docs/index.html#examples/en/controls/OrbitControls}. Change the <b>OrbitControl</b> setting during playing.
	 *      [orbitControlsGui]: <a href="../../OrbitControls/jsdoc/index.html" target="_blank">OrbitControlsGui</a> instance;
	 *
	 *   },
	 *   //Use controls on the web page for display and edit of the point values.
	 *   [controllers]: {
	 *   
	 *      pointName: HTML element or id of element for point name
	 *      
	 *      //axisName is "x" or "y" or "z" or "w"
	 *      [axisName]: {
	 *
	 *         //Function text controller
	 *         func: {
	 *         
	 *            controller: HTMLElement - <b>input</b> element of function text
	 *               or string - id of the <b>input</b> element. Default id is "[axisName]Func". Example: "xFunc".
	 *            elName: HTMLElement - <b>span</b> element of the function name
	 *               or string - id of the <b>span</b> element. Default id is "[axisName]FuncName". Example: "xFuncName".
	 *               or false - name element is not exists.
	 *
	 *         }
	 *
	 *         //Point position controller
	 *         position: {
	 *
	 *            controller: HTMLElement - <b>input</b> element of the point position
	 *               or string - id of the <b>input</b> element. Default id is "[axisName]Position". Example: "xPosition".
	 *            elName: HTMLElement - <b>span</b> element of the point position name
	 *               or string - id of the <b>span</b> element. Default id is "[axisName]PositionName". Example: "xPositionName".
	 *               or false - name element is not exists.
	 *
	 *         }
	 *
	 *         //World point position controller.
	 *         worldPosition: {
	 *
	 *            controller: HTMLElement - <b>input</b> element of the world point position
	 *               or string - id of the <b>input</b> element. Default id is "[axisName]WorldPosition". Example: "xWorldPosition".
	 *            elName: HTMLElement - <b>span</b> element of the world point position name
	 *               or string - id of the <b>span</b> element. Default id is "[axisName]WorldPositionName". Example: "xWorldPositionName".
	 *               or false - name element is not exists.
	 *
	 *         }
	 *
	 *      }
	 *
	 *   },
	 *
	 * }
	 * or
	 * object: {
	 *   x: x axis. Defauilt is 0.
	 *   y: y axis. Defauilt is 0.
	 *   z: z axis. Defauilt is 0.
	 *   w: w axis. Defauilt is 0.
	 * }
	 *
	 * array: [
	 *   0: x axis. Defauilt is 0.
	 *   1: y axis. Defauilt is 0.
	 *   2: z axis. Defauilt is 0.
	 *   3: w axis. Defauilt is 0.
	 * ]
	 * </pre>
	 * @param {object} [optionsPoints] followed optionsPoints is available
	 * @param {THREE.Group} [optionsPoints.group] {@link https://threejs.org/docs/index.html#api/en/objects/Group|Group}
	 * or {@link https://threejs.org/docs/index.html#api/en/scenes/Scene|Scene}.
	 * Use only if you want trace lines during playing. See <b>trace</b> of the <b>arrayFuncs</b> param above.
	 * @param {number} [optionsPoints.t=0] first parameter of the <b>arrayFuncs</b> item function. Start time of animation.
	 * @param {object} [optionsPoints.options] the following options are available
	 * @param {number} [optionsPoints.options.a=1] multiplier. Second parameter of the <b>arrayFuncs</b> item function.
	 * @param {number} [optionsPoints.options.b=0] addendum. Third parameter of the <b>arrayFuncs</b> item function.
	 * @param {object} [optionsPoints.options.playerOptions] See <b>settings.options.playerOptions</b> parameter of the <a href="../../player/jsdoc/module-Player-Player.html" target="_blank">Player</a> class.
	 * @returns array of <b>THREE.Vector4</b> points.
	 */
	Player$1.getPoints = function ( arrayFuncs, optionsPoints ) {

		assign$1();
		
		if ( !Array.isArray( arrayFuncs ) ) arrayFuncs = [ arrayFuncs ];
		
		optionsPoints = optionsPoints || {};
		if ( optionsPoints.t === undefined ) optionsPoints.t = optionsPoints.options && optionsPoints.options.player ? optionsPoints.options.player.getSettings().options.playerOptions.min : 0;
		const options = optionsPoints.options || new Options$1(),
			optionsDefault = new Options$1( { palette: options.palette } );
		options.setW( optionsDefault );
		const wDefault = optionsDefault.scales.w.max;//new THREE.Vector4().w;//1;//цвет точки по умолчанию равен цвету палитры для максимального значения value,
							//которе по умолчанияю равно 1 и определяется в Options class.
							//Палитра по умолчанию ColorPicker.paletteIndexes.BGYW
							//у которой цвет максимального значения value белый.
		for ( var i = 0; i < arrayFuncs.length; i++ ) {

			var item = arrayFuncs[i];
			if ( Array.isArray( item ) )
				arrayFuncs[i] = new THREE.Vector4(

					item[0] === undefined ? 0 : item[0],
					item[1] === undefined ? 0 : item[1],
					item[2] === undefined ? 0 : item[2],
					item[3] === undefined ? wDefault : item[3]

				);
			else if (

				( typeof item === "object" )
				&& ( item instanceof THREE.Vector2 === false )
				&& ( item instanceof THREE.Vector3 === false )
				&& ( item instanceof THREE.Vector4 === false )

			) {

				if ( ( item.vector === undefined ) )
					arrayFuncs[i] = new THREE.Vector4(

						item.x === undefined ? 0 : item.x,
						item.y === undefined ? 0 : item.y,
						item.z === undefined ? 0 : item.z,
						item.w === undefined ? 0 : item.w

					);
				else if (

					( item.vector instanceof THREE.Vector2 === true )
					|| ( item.vector instanceof THREE.Vector3 === true )
					|| ( item.vector instanceof THREE.Vector4 === true )

				) {

					if ( item.vector instanceof THREE.Vector2 === true )
						arrayFuncs[i].vector = new THREE.Vector3(

							item.vector.x === undefined ? 0 : item.vector.x,
							item.vector.y === undefined ? 0 : item.vector.y,
							item.vector.z === undefined ? 0 : item.vector.z,

						);

				} else {

					if ( item.vector.length === 4 )
						arrayFuncs[i].vector = new THREE.Vector4(

							item.vector[0] === undefined ? 0 : item.vector[0],
							item.vector[1] === undefined ? 0 : item.vector[1],
							item.vector[2] === undefined ? 0 : item.vector[2],
							item.vector[3] === undefined ? 0 : item.vector[3]

						);
					else if ( item.vector.length === 3 )

						arrayFuncs[i].vector = new THREE.Vector3(

							item.vector[0] === undefined ? 0 : item.vector[0],
							item.vector[1] === undefined ? 0 : item.vector[1],
							item.vector[2] === undefined ? 0 : item.vector[2],

						);
					else if ( item.vector.length < 3 )

						arrayFuncs[i].vector = new THREE.Vector4(

							item.vector[0] === undefined ? 0 : item.vector[0],
							item.vector[1] === undefined ? 0 : item.vector[1],

						);
					else console.error( 'Player.getPoints(...) falied! item.vector.length = ' + item.vector.length );

				}

			}

		}	const points = [];
		for ( var i = 0; i < arrayFuncs.length; i++ ) {

			var funcs = arrayFuncs[i];
			function getAxis( axisName ) {

				if ( typeof funcs === "number" )
					funcs = new THREE.Vector4( funcs, 0, 0, 0 );
				if ( ( funcs instanceof THREE.Vector2 ) || ( funcs instanceof THREE.Vector3 ) || ( funcs instanceof THREE.Vector4 ) ) {

					const value = Player$1.execFunc( funcs, axisName, optionsPoints.t, options );
					return value;

				}
				if ( funcs.vector === undefined ) {

					console.error( 'Player.getAxis().getPoints(): funcs.vector = ' + funcs.vector );
					return;

				}
				if ( funcs.name !== undefined )
					funcs.vector.name = funcs.name;

				if ( funcs.trace ) funcs.vector.trace = funcs.trace;
				if ( funcs.controllers ) funcs.vector.controllers = funcs.controllers;
				if ( funcs.cameraTarget ) {

					funcs.vector.cameraTarget = funcs.cameraTarget;
					delete funcs.cameraTarget;

				}
				arrayFuncs[i] = funcs.vector;
				funcs = funcs.vector;
				return Player$1.execFunc( funcs, axisName, optionsPoints.t, options );


			}
			const point = funcs.vector instanceof THREE.Vector3 === true ?
				new THREE.Vector3( getAxis( 'x' ), getAxis( 'y' ), getAxis( 'z' ) ) :
				new THREE.Vector4( getAxis( 'x' ), getAxis( 'y' ), getAxis( 'z' ), getAxis( 'w' ) );

			if ( funcs.cameraTarget ) {

				funcs.cameraTarget.bodefault = false;
				if ( funcs.cameraTarget.boLook === undefined ) funcs.cameraTarget.boLook = true;

				options.playerOptions.cameraTarget.init( funcs.cameraTarget, options );

			}
			points.push( point );

		}
		return points;

	};
	var boColorWarning = true;
	/** @namespace
	 * @description Get array of mesh colors.
	 * @param {THREE.Vector4|THREE.Vector3|THREE.Vector2|object|array} arrayFuncs points.geometry.attributes.position array
	 * <pre>
	 * THREE.Vector4: 4D point.
	 * THREE.Vector3: 3D point. w = 1. Default is white color
	 * THREE.Vector2: 2D point. w = 1, z = 0. Default is white color
	 * Vector's x, y, z, w is position of the point.
	 * Can be as:
	 * float - position of the point.
	 * [float] - array of positions of the point.
	 * [Function]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function} - position of the point is function of the t.
	 * Example: new Function( 't', 'a', 'b', 'return Math.sin(t*a*2*Math.PI)*0.5+b' )
	 *
	 * Vector.w is index of the [palette]{@link https://github.com/anhr/commonNodeJS/tree/master/colorpicker}.
	 * Default range of the Vector.w is from 0 to 1. You can change range by use an object:
	 * {
	 *   func: Vector.w
	 *   max: new max value of tne Vector.w
	 *   min: new min value of tne Vector.w
	 * }
	 * Example:
	 * {
	 *
	 *   func: new Function( 't', 'return 1-2*t' ),
	 *   min: -1,
	 *   max: 1,
	 *
	 * }
	 * Vector.w can be as THREE.Color. Example: new THREE.Color( "rgb(255, 127, 0)" )
	 *
	 * object: {
	 *   vector: THREE.Vector4|THREE.Vector3|THREE.Vector2 - point position
	 *   [name]: point name. Default is undefined.
	 *   [trace]: true - displays the trace of the point movement. Default is undefined.
	 * }
	 * or
	 * object: {
	 *   x: x axis. Defauilt is 0.
	 *   y: y axis. Defauilt is 0.
	 *   z: z axis. Defauilt is 0.
	 *   w: w axis. Defauilt is 0.
	 * }
	 *
	 * array: [
	 *   0: x axis. Defauilt is 0.
	 *   1: y axis. Defauilt is 0.
	 *   2: z axis. Defauilt is 0.
	 *   3: w axis. Defauilt is 0.
	 * ]
	 * </pre>
	 * @param {object} [optionsColor] the following options are available:
	 * @param {object} [optionsColor.options] See the <b>options</b> parameter of the <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
	 * @param {THREE.BufferAttribute} [optionsColor.positions] geometry.attributes.position of the new mesh.
	 * @param {array} [optionsColor.colors=[]] array for mesh colors.
	 * @param {array} [optionsColor.opacity] array of opacities of each geometry position. Each item of array is float value in the range of 0.0 - 1.0 indicating how transparent the material is. A value of 0.0 indicates fully transparent, 1.0 is fully opaque.
	 * @returns array of mesh colors.
	 */
	Player$1.getColors = function ( arrayFuncs, optionsColor ) {

		assign$1();
		
		if ( !Array.isArray( arrayFuncs ) ) arrayFuncs = [ arrayFuncs ];

		optionsColor = optionsColor || {};
		optionsColor.options = optionsColor.options || {};
		
		if (
			( optionsColor.positions !== undefined ) &&
			Array.isArray( arrayFuncs ) &&
			( arrayFuncs.length !== optionsColor.positions.count )
		) {

			console.error( 'getColors failed! arrayFuncs.length: ' + arrayFuncs.length + ' != positions.count: ' + optionsColor.positions.count );
			return optionsColor.colors;

		}

		//не надо убирать const length. Иначе переполнится память
		const length = Array.isArray( arrayFuncs ) ? arrayFuncs.length : optionsColor.positions.count;

		optionsColor.colors = optionsColor.colors || [];
		const colors = [];
		if ( !optionsColor.options.palette )
			optionsColor.options.setPalette();

		for ( var i = 0; i < length; i++ ) {

			const iColor = 3 * i;
			if (iColor >= optionsColor.colors.length) {
				
				const funcs = Array.isArray( arrayFuncs ) ? arrayFuncs[i] : undefined;
				if (
					( funcs instanceof THREE.Vector4 ) ||//w of the funcs is color of the point
					( optionsColor.positions && ( optionsColor.positions.itemSize === 4 ) )//w position of the positions is color of the point
					) {
		
					let min, max;
					var w = funcs.w;
					if ( funcs.w instanceof Object && funcs.w.func ) {
		
						if ( funcs.w.max ) max = funcs.w.max;
						if ( funcs.w.min ) min = funcs.w.min;
						w = funcs.w.func;
		
					} else {
		
						optionsColor.options.setW();
						min = optionsColor.options.scales.w.min; max = optionsColor.options.scales.w.max;
		
					}
					if ( w instanceof Function && !optionsColor.options.player && boColorWarning ) {
		
						boColorWarning = false;
						
					}
					const t = optionsColor.options.playerOptions ? optionsColor.options.playerOptions.min : 0;
					var color = optionsColor.options.palette.toColor(
						funcs === undefined ?
							new THREE.Vector4().fromBufferAttribute( optionsColor.positions, i ).w :
							w instanceof Function ?
								w( t ) :
								typeof w === "string" ?
									Player$1.execFunc( funcs, 'w', t, optionsColor.options ) :
									w === undefined ? new THREE.Vector4().w : w,
						min, max );
					colors.push( color.r, color.g, color.b );
		
				} else if ( optionsColor.colors instanceof THREE.Float32BufferAttribute )
					new THREE.Vector3( 1, 1, 1 );
				else if (optionsColor.color != undefined) {

					const color = new THREE.Color(optionsColor.color);
					colors.push( color.r, color.g, color.b );//white
					
				} else colors.push( 1, 1, 1 );//white

			}
			else colors.push( optionsColor.colors[iColor], optionsColor.colors[iColor + 1], optionsColor.colors[iColor + 2] );

			//opacity
			if ( optionsColor.opacity instanceof Array )
				colors.push( i < optionsColor.opacity.length ? optionsColor.opacity[i] : 1 );
			else colors.push( 1 );

		}
		optionsColor.colors = colors;
		return optionsColor.colors;

	};

	/** @class */
	Player$1.traceLine = class traceLine
	{

		/**
		 * trace line of moving of the point during playing
		 * @param {object} options the following options are available
		 * @param {object} options.player See <a href="../../player/jsdoc/module-Player.html" target="_blank">Player</a>.
		 */
		constructor( options ) {

			var line;
			const arrayLines = [];//сюда добавляются линии когда max: Infinity,

			assign$1();

			if ( !options.player ) {

				return;

			}
			/**
			 * Is trace line visible?
			 * @returns true - trace line is visible.
			 * <p>false - trace line is not visible.</p>
			 */
			this.isVisible = function () {

				if ( !options.player )
					return false;//не запущен Player(...)

				if ( line ) return line.visible;
				if ( arrayLines.length === 0 ) return false;
				//сюда попадает когда t max is Infinity ( options.playerOptions.max === null ) и когда пользователь выбрал точку в guiSelectPoint у которой установлена трассировка
				return arrayLines[0].visible;

			};
			/**
			 * Show or hide trace line.
			 * @param {boolean} visible true - show trace line.
			 * <p>false - hide trace line.</p>
			 */
			this.visible = function ( visible ) {

				if ( !options.player )
					return false;//не запущен Player(...)

				if ( line ) {

					line.visible = visible;
					return;

				}
				//сюда попадает когда t max is Infinity (options.playerOptions.max === null) и когда пользователь в выбранной в guiSelectPoint  точке изменил галочку трассировки
				arrayLines.forEach( function ( line ) {

					line.visible = visible;

				} );

			};

			/**
			 * add point into trace line.
			 * @param {THREE.Mesh} mesh. See [Mech]{@link https://threejs.org/docs/index.html#api/en/objects/Mesh} for tracing.
			 * @param {number} index of the point for tracing.
			 * @param {THREE.Color} color. Line color. See [Color]{@link https://threejs.org/docs/index.html#api/en/math/Color}.
			 */
			this.addPoint = function ( mesh, index, color ) {

				const attributesPosition = mesh.geometry.attributes.position;
				var point = attributesPosition.itemSize >= 4 ? new THREE.Vector4( 0, 0, 0, 0 ) : new THREE.Vector3();
				point.fromArray( attributesPosition.array, index * attributesPosition.itemSize );

				//нельзя ставить const потому что привыполнении npm run build будет ошибка
				// (babel plugin) SyntaxError: D:/My documents/MyProjects/webgl/three.js/GitHub/commonNodeJS/master/player/player.js: "sceneIndex" is read-only
				var sceneIndex = options.player ? options.player.getSelectSceneIndex() : 0;

				if ( options.playerOptions.max === null ) {

					//Infinity play
					
					sceneIndex = Math.abs( sceneIndex );
					if ( sceneIndex < ( arrayLines.length - 1 ) ) {

						while ( sceneIndex < ( arrayLines.length - 1 ) ) {

							mesh.remove( arrayLines[arrayLines.length - 1] );
							arrayLines.pop();

						}
						return;

					}
					// geometry
					const geometry = new THREE.BufferGeometry(), MAX_POINTS = 2;

					// attributes
					const positions = new Float32Array( MAX_POINTS * 3 ); // 3 coordinates per point
					geometry.setAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
					const colors = new Float32Array( MAX_POINTS * 3 ); // 3 coordinates per point
					geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );

					const line = new THREE.Line( geometry, new THREE.LineBasicMaterial( { vertexColors: true } ) );
					//			group.add( line );
					mesh.add( line );

					//на случай когда пользователь изменил флажок трассировки
					//первая линия arrayLines[0] всегда имеет visible = true потому что сюда попадат только если установлена трассировка по умолчанию
					//или пользователь установил флаг трассировки
					if ( arrayLines[0] ) line.visible = arrayLines[0].visible;

					//point position
					point = new THREE.Vector3().copy( point );
					const itemSize = line.geometry.attributes.position.itemSize;
					point.toArray( line.geometry.attributes.position.array, 1 * itemSize );
					const point0 = arrayLines.length === 0 ? point :
						new THREE.Vector3().fromArray( arrayLines[arrayLines.length - 1].geometry.attributes.position.array, 1 * itemSize );
					point0.toArray( line.geometry.attributes.position.array, 0 * itemSize );
					line.geometry.attributes.position.needsUpdate = true;

					//point color
					if ( color === undefined )
						color = new THREE.Color( 1, 1, 1 );//White
					Player$1.setColorAttribute( line.geometry.attributes, 0, arrayLines.length === 0 ? color :
						new THREE.Color().fromArray( arrayLines[arrayLines.length - 1].geometry.attributes.color.array, 1 * itemSize ) );
					Player$1.setColorAttribute( line.geometry.attributes, 1, color );

					arrayLines.push( line );

					return;

				}
				if ( line === undefined ) {

					// geometry
					const geometry = new THREE.BufferGeometry();

					//Thanks to https://stackoverflow.com/questions/31399856/drawing-a-line-with-three-js-dynamically/31411794#31411794
					var MAX_POINTS;
					if ( options.playerOptions.max !== null ) {

						if ( options.playerOptions && options.playerOptions.marks )
							MAX_POINTS = options.playerOptions.marks;
						else if ( options.player && options.player.marks )
							MAX_POINTS = options.player.marks;
						else {

							console.error( 'Player.traceLine: MAX_POINTS = ' + MAX_POINTS + '. Create Player first or remove all trace = true from all items of the arrayFuncs' );
							return;

						}

					} else MAX_POINTS = sceneIndex + 1;

					// attributes
					const positions = new Float32Array( MAX_POINTS * 3 ); // 3 coordinates per point
					geometry.setAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
					const colors = new Float32Array( MAX_POINTS * 3 ); // 3 coordinates per point
					geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );

					// draw range
					geometry.setDrawRange( sceneIndex, sceneIndex );

					line = new THREE.Line( geometry, new THREE.LineBasicMaterial( {
						
						//неудачная попытка исправить frustumPoints после перехода на THREE.REVISION = "145dev"
						vertexColors: true,

						//THREE.Material: 'vertexColors' parameter is undefined.
						//vertexColors: THREE.VertexColors
					
					} ) );
					line.visible = true;
					mesh.add( line );

				}
				//Если не удалять boundingSphere
				//и если двигается камера от проигрывания или ее перемещает пользователь
				//то в некоторых случаях линию не будет видно даже если она не выходит из поля видимости
				//потому что она выходит за рамки frustupoints
				if ( line.geometry ) {//scene do not have geometry

					delete line.geometry.boundingSphere;
					line.geometry.boundingSphere = null;

				}

				//point position
				point = new THREE.Vector3().copy( point );
				point.toArray( line.geometry.attributes.position.array, sceneIndex * line.geometry.attributes.position.itemSize );
				line.geometry.attributes.position.needsUpdate = true;

				//point color
				if ( color === undefined )
					color = new THREE.Color( 1, 1, 1 );//White
				Player$1.setColorAttribute( line.geometry.attributes, sceneIndex, color );

				//set draw range
				var start = line.geometry.drawRange.start, count = sceneIndex + 1 - start;
				if ( start > sceneIndex ) {

					var stop = start + line.geometry.drawRange.count;
					start = sceneIndex;
					count = stop - start;

				}
				line.geometry.setDrawRange( start, count );

			};
			/**
			 * Remove trace line.
			 */
			this.remove = function () {

				if ( line === undefined )
					return;
				line.geometry.dispose();
				line.material.dispose();
				line.parent.remove( line );
				//		group.remove( line );

			};

		}

	};

	/** @namespace
	 * @description get item size of the attribute of the mesh geometry
	 * @param {array} arrayFuncs points.geometry.attributes.position array.
	 * See arrayFuncs parametr of the <a href="../../player/jsdoc/module-Player-Player.getPoints.html" target="_blank">Player.getPoints(...)</a> for details.
	 */
	Player$1.getItemSize = function ( arrayFuncs ) {

		assign$1();

		for ( var i = 0; i < arrayFuncs.length; i++ ) {

			var func = arrayFuncs[i];
			if ( func instanceof THREE.Vector4 )
				return 4;

		}
		return 3;

	};
	/** @namespace
	 * @description Select a scene for playing
	 * @param {THREE.Group} group [THREE.Group]{@link https://threejs.org/docs/index.html#api/en/objects/Group}
	 * @param {Object} [settings={}] the following settings are available.
	 * @param {number} [settings.t=0] time
	 * @param {number} [settings.index] index of the time.
	 * @param {Object} [settings.options={}] See the <b>options</b> parameter of the <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
	 */
	Player$1.selectPlayScene = function ( group, settings = {} ) {

		const t = settings.t !== undefined ? settings.t : 0,
			index = settings.index !== undefined ? settings.index : undefined,
			options = settings.options || new Options$1();
		group.userData.index = index;
		group.userData.t = t;
		if (typeof options.player === "object") options.player.endSelect = () => {
			
			Player$1.selectMeshPlayScene( group, { t: t, options: options } );
			function selectMeshPlayScene( group ) {
		
				group.children.forEach( function ( mesh ) {
		
					if ( mesh instanceof THREE.Group ) selectMeshPlayScene( mesh );
					else Player$1.selectMeshPlayScene( mesh, { t: t, options: options } );
		
				} );
		
			}
			selectMeshPlayScene( group );
			options.playerOptions.cameraTarget.setCameraTarget( options );
			const cameraTarget = options.playerOptions.cameraTarget.get();
		
			//если index === undefined значит пользователь нажал кнопку 'Default' для восстановления положения камеры.
			//Значит надо вызвать camera.userData.default.setDefault()
			//
			//если index !== undefined значит проигрыватель вызывает очередной кадр и не нужно перемещать камеру в исходное положение
			//приуслвии что не выбрана ни одна точка как cameraTarget
			if ( cameraTarget && cameraTarget.setCameraPosition ) cameraTarget.setCameraPosition( index === undefined );
			
		};
		if ( !group.userData.endSelect && (typeof options.player === "object")) options.player.endSelect();

	};
	var THREE;
	/* * @namespace
	 * @description assign some THREE methods
	 */
	function assign$1( ) {

		if ( !three$1.isThree() ) {

			console.warn( 'Player: can not assign. Set THREE first.' );
			return;

		}
		THREE = three$1.THREE;
		Object.assign( THREE.BufferGeometry.prototype, {

			setFromPoints: function ( points, itemSize ) {

				itemSize = itemSize ||
					
					//for testing:
					//Open http://localhost/anhr/commonNodeJS/master/HyperSphere/Examples/hyperSphere.html
					//Set HyperSphere.classSettings.edges is not false - отображать ребра
					//Take one step of the player →
					points.itemSize ||
					
					3;
				var position = [];

				for ( var i = 0, l = points.length; i < l; i++ ) {

					var point = points[i];
					position.push( point.x, point.y, point.z || 0 );
					if ( itemSize >= 4 )
						position.push( point.w || 0 );

				}

				this.setAttribute( 'position', new THREE.Float32BufferAttribute( position, itemSize ) );

				return this;

			},

		} );

		//three.js\dev\src\math\Vector4.js
		Object.assign( THREE.Vector4.prototype, {

			multiply: function ( v ) {

				this.x *= v.x;
				this.y *= v.y;
				this.z *= v.z;
				if ( v.w !== undefined )
					this.w *= v.w;

				return this;

			},

		} );
		//three.js\dev\src\math\Vector4.js
		Object.assign( THREE.Vector4.prototype, {

			add: function ( v, w ) {

				if ( w !== undefined ) {

					console.warn( 'THREE.Vector4: .add() now only accepts one argument. Use .addVectors( a, b ) instead.' );
					return this.addVectors( v, w );

				}

				this.x += v.x;
				this.y += v.y;
				this.z += v.z;
				if ( v.w !== undefined )
					this.w += v.w;

				return this;

			},

		} );
		//three.js\dev\src\objects\Points.js
		Object.assign( THREE.Points.prototype, {

			raycast: function ( raycaster, intersects ) {

				const _inverseMatrix = new THREE.Matrix4();
				const _ray = new THREE.Ray();
				const _sphere = new THREE.Sphere();
				const _position = new THREE.Vector3();
				function testPoint( point, index, localThresholdSq, matrixWorld, raycaster, intersects, object ) {

					const rayPointDistanceSq = _ray.distanceSqToPoint( point );
					if ( rayPointDistanceSq < localThresholdSq ) {

						const intersectPoint = new THREE.Vector3();

						_ray.closestPointToPoint( point, intersectPoint );
						intersectPoint.applyMatrix4( matrixWorld );

						const distance = raycaster.ray.origin.distanceTo( intersectPoint );

						if ( distance < raycaster.near || distance > raycaster.far ) return;

						intersects.push( {

							distance: distance,
							distanceToRay: Math.sqrt( rayPointDistanceSq ),
							point: intersectPoint,
							index: index,
							face: null,
							object: object

						} );

					}

				}

				const geometry = this.geometry;
				const matrixWorld = this.matrixWorld;
				const threshold = raycaster.params.Points.threshold;

				// Checking boundingSphere distance to ray

				if ( geometry.boundingSphere === null ) geometry.computeBoundingSphere();

				_sphere.copy( geometry.boundingSphere );
				_sphere.applyMatrix4( matrixWorld );
				_sphere.radius += threshold;

				if ( raycaster.ray.intersectsSphere( _sphere ) === false ) return;

				//

				_inverseMatrix.copy( matrixWorld ).invert();
				
				_ray.copy( raycaster.ray ).applyMatrix4( _inverseMatrix );

				const localThreshold = threshold / ( ( this.scale.x + this.scale.y + this.scale.z ) / 3 );
				const localThresholdSq = localThreshold * localThreshold;

				if ( geometry.isBufferGeometry ) {

					const index = geometry.index;
					const attributes = geometry.attributes;
					const positions = attributes.position.array;
					const itemSize = attributes.position.itemSize;

					if ( index !== null ) {

						const indices = index.array;

						for ( let i = 0, il = indices.length; i < il; i++ ) {

							const a = indices[i];

							_position.fromArray( positions, a * itemSize );

							testPoint( _position, a, localThresholdSq, matrixWorld, raycaster, intersects, this );

						}

					} else {

						for ( let i = 0, l = positions.length / itemSize; i < l; i++ ) {

							_position.fromArray( positions, i * itemSize );

							testPoint( _position, i, localThresholdSq, matrixWorld, raycaster, intersects, this );

						}

					}

				} else {

					const vertices = geometry.vertices;

					for ( let i = 0, l = vertices.length; i < l; i++ ) {

						testPoint( vertices[i], i, localThresholdSq, matrixWorld, raycaster, intersects, this );

					}

				}

			},

		} );

	}
	//assign();
	/**
	 * @namespace
	 * @description assign some THREE methods
	 * */
	Player$1.assign = function () { assign$1(); };

	/**
	 * @module CreateFullScreenSettings
	 * @description creates functions for resize of the canvas to fullscreen and restore to default size.
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

	/**
	 * @callback onFullScreenToggle
	 * @param {boolean} fullScreen false - full screen mode of the canvas.
	 */

	/**
	 * @class creates functions for resize of the canvas to fullscreen and restore to default size.
	 * @param {THREE} THREE [THREE]{@link https://threejs.org/}
	 * @param {THREE.WebGLRenderer} renderer [WebGLRenderer]{@link https://threejs.org/docs/index.html#api/en/renderers/WebGLRenderer}
	 * @param {THREE.PerspectiveCamera} camera [PerspectiveCamera]{@link https://threejs.org/docs/index.html#api/en/cameras/PerspectiveCamera}
	 * @param {object} options the following options are available:
	 * @param {CanvasMenu} [options.canvasMenu] <a href="../../canvasMenu/jsdoc/index.html" target="_blank">CanvasMenu</a>
	 * @param {StereoEffect} [options.stereoEffect] <a href="../../StereoEffect/jsdoc/index.html" target="_blank">StereoEffect</a> instance.
	 * @param {object} [options.fullScreen] followed fullScreen methods available:
	 * @param {onFullScreenToggle} [options.fullScreen.onFullScreenToggle] user toggled fullscreen mode of the canvas.
	 */
	function CreateFullScreenSettings( THREE, renderer, camera, options ) {

		var fullScreen = false, canvasMenu, stereoEffect;

		options.fullScreen = options.fullScreen || {};
		if ( options.canvasMenu ) canvasMenu = options.canvasMenu;
		if ( options.stereoEffect ) stereoEffect = options.stereoEffect;
		renderer.setSize( renderer.domElement.width, renderer.domElement.height );

		var style;

		/**
		 * @returns <b>true</b> if <b>canvas</b> is full screen.
		 */
		this.isFullScreen = function () { return fullScreen; };
		/**
		 * @param {StereoEffect} _stereoEffect <a href="../../StereoEffect/jsdoc/index.html" target="_blank">StereoEffect</a>.
		 */
		this.setStereoEffect = function ( _stereoEffect ) { stereoEffect = _stereoEffect; };
		/**
		 * Sets the full screen of the canvas.
		 * @param {boolean} [fullScreen=false] false - full screen of the canvas.
		 * @param {boolean} [boTimeout=false] true - set fullScreen after 0 msec timeout.
		 */
		this.setFullScreen = function ( fs = false, boTimeout = false ) {

			setTimeout( function () {

				//Если на веб странице один MyThree то по умолчанию он на всю страницу.
				//Если на веб странице больше одного MyThree то по умолчанию все MyThree не на всю страницу.
				//В противном случае если несколько MyThree на всю страницу то они будут накладываться друг на друга 
				//между ними произойдет путаница
				if ( boTimeout && options.fullScreen.arrayContainersLength && ( options.fullScreen.arrayContainersLength() > 1 ) )
					fs = true;
				const size = new THREE.Vector2();
				renderer.getSize( size );
				fullScreen = fs;
				if ( fullScreen ) {

					if ( style !== undefined ) {

						//restore size of the canvas
						renderer.setSize( style.sizeOriginal.x, style.sizeOriginal.y );
						renderer.domElement.style.position = style.position;
						renderer.domElement.style.left = style.left;
						renderer.domElement.style.top = style.top;
						renderer.domElement.style.width = style.width;
						renderer.domElement.style.height = style.height;

					}

				} else {

					if ( style === undefined ) {

						style = {

							sizeOriginal: new THREE.Vector2(),
							position: renderer.domElement.style.position,
							left: renderer.domElement.style.left,
							top: renderer.domElement.style.top,
							width: renderer.domElement.style.width,
							height: renderer.domElement.style.height,

						};
						renderer.getSize( style.sizeOriginal );
					}

					//Full screen of the canvas
					renderer.setSize( window.innerWidth, window.innerHeight );
					renderer.domElement.style.position = 'fixed';
					renderer.domElement.style.left = 0;
					renderer.domElement.style.top = 0;
					renderer.domElement.style.width = '100%';
					renderer.domElement.style.height = '100%';

				}

				if ( options.fullScreen.onFullScreenToggle !== undefined ) options.fullScreen.onFullScreenToggle( fullScreen );

				camera.aspect = size.x / size.y;
				camera.updateProjectionMatrix();
				fullScreen = !fullScreen;
				if ( canvasMenu && canvasMenu.setFullScreenButton ) canvasMenu.setFullScreenButton( fullScreen );
				CreateFullScreenSettings.RendererSetSize( renderer, options.canvasMenu );

			}, 0 );

		};
		/**
		 * User has clicked the "Full Screen" button on the <a href="../../canvasMenu/jsdoc/index.html" target="_blank">CanvasMenu</a>.
		 * @event
		 */
		this.onclick = function () {

			if (
				( stereoEffect !== undefined )
				&& ( parseInt( stereoEffect.settings.spatialMultiplex ) !== StereoEffect.spatialMultiplexsIndexs.Mono )
			) {

				stereoEffect.settings.spatialMultiplex = StereoEffect.spatialMultiplexsIndexs.Mono;

			}

			this.setFullScreen( fullScreen );
			return fullScreen;

		};

	}
	/** @namespace
	 * @description set size of renderer.
	 * @param {THREE.WebGLRenderer} renderer [THREE.WebGLRenderer]{@link https://threejs.org/docs/index.html#api/en/renderers/WebGLRenderer}.
	 * @param {CanvasMenu} canvasMenu <a href="../../canvasMenu/jsdoc/index.html" target="_blank">CanvasMenu</a>
	 */
	CreateFullScreenSettings.RendererSetSize = function ( renderer, canvasMenu ){

		if ( renderer.setSizeOld )
			return;
			
		renderer.setSizeOld = renderer.setSize;
		renderer.setSize = function ( width, height, updateStyle ) {

			renderer.setSizeOld( width, height, updateStyle );
			const elCanvas = renderer.domElement, elContainer = elCanvas.parentElement;

			setTimeout( function () {

				elContainer.style.height = elCanvas.style.height;
				elContainer.style.width = elCanvas.style.width;
				elContainer.style.left = elCanvas.style.left;
				elContainer.style.top = elCanvas.style.top;
				elContainer.style.position = elCanvas.style.position;
				if ( canvasMenu ) canvasMenu.setSize( width, height );

			}, 0 );

		};

	};

	/**
	 * @module SpriteText
	 * @description A sprite based text component. Text that always faces towards the camera.
	 * @see {@link https://threejs.org/docs/index.html#api/en/objects/Sprite|THREE.Sprite}
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

	/**
	 * A sprite based text component.
	 * @param {string|number} text The text to be displayed on the sprite. You can include a multiline text separated by "\r\n".
	 * @param {THREE.Vector3} [position=new THREE.Vector3()] Position of the text.
	 * @param {options} [options={}] the following options are available
	 * @param {string} [options.name] Name of the <b>SpriteText</b> instance.
	 * @param {THREE.Group} [options.group] Parent group of the SpriteText with common options.
	 * See {@link https://github.com/anhr/SpriteText#groupuserdataoptionsspritetext---common-options-for-the-group-of-the-spritetext|common options for the group of the SpriteText}.
	 * Default is undefined.
	 * @param {number} [options.textHeight=0.04] The height of the text.
	 * @param {number} [options.fov] Camera frustum vertical field of view, from bottom to top of view, in degrees.
	 * {@link https://threejs.org/docs/index.html#api/en/cameras/PerspectiveCamera.fov|PerspectiveCamera.fov}
	 * Set the fov option as camera.fov if you want to see text size is independent from camera.fov. The text height will be calculated as textHeight = fov * textHeight / 50
	 * Default is undefined.
	 * @param {boolean} [options.sizeAttenuation=false] Whether the size of the sprite is attenuated by the camera depth. (Perspective camera only.)
	 * See {@link https://threejs.org/docs/index.html#api/en/materials/SpriteMaterial.sizeAttenuation|SpriteMaterial.sizeAttenuation}
	 * @param {number} [options.rotation=0] The rotation of the sprite in radians.
	 * See {@link https://threejs.org/docs/index.html#api/en/materials/SpriteMaterial.rotation|SpriteMaterial.rotation}
	 * @param {string} [options.fontFace='Arial'] CSS font-family - specifies the font of the text.
	 * @param {string[]} [options.fontFaces] array of fontFaces. Example ['Arial', 'Verdana', 'Times'].
	 * @param {string} [options.fontColor='rgba(255, 255, 255, 1)'] RGBA object or RGB object or HEX value.
	 *	Examples 'rgba(0, 0, 255, 0.5)', '#00FF00'.
	 * @param {boolean} [options.bold=false] CSS font-weight. Equivalent of 700.
	 * @param {boolean} [options.italic=false] CSS font-style.
	 * @param {string} [options.fontProperties] Other font properties. The font property uses the same syntax as the CSS font property.
	 * 	Default is empty string. Example "900", "oblique lighter".
	 * @param {options} [options.rect={}] rectangle around the text.
	 * @param {boolean} [options.rect.displayRect=false] true - the rectangle around the text is visible.
	 * @param {string} [options.rect.backgroundColor='rgba(0, 0, 0, 0)' - black transparent] background color. RGBA object or RGB object or HEX value
	 * <pre>
	 * 	Examples 'rgba(0, 0, 255, 0.5)', '#00FF00'.
	 * </pre>
	 * @param {string} [options.rect.borderColor] border color. RGBA object or RGB object or HEX value. Default is same as options.fontColor 'rgba(255, 255, 255, 1)' - white.
	 * @param {number} [options.rect.borderThickness=0 is invisible border] border thickness.
	 * @param {number} [options.rect.borderRadius=0 is no radius] border corners radius.
	 * @param {THREE.Vector2|object} [options.center] If <b>center.x</b> and <b>center.y</b> is defined, then it the text's anchor point.
	 * <pre>
	 * See {@link https://threejs.org/docs/index.html#api/en/objects/Sprite.center|Sprite.center}
	 * 	A value of (0.5, 0.5) corresponds to the midpoint of the text.
	 * 	A value of (0, 0) corresponds to the left lower corner of the text.
	 * 	A value of (0, 1) corresponds to the left upper corner of the text.
	 * 	
	 * Otherwise, the center is calculated so that the text is always inside the canvas.
	 * Please define <b>center.camera</b> and <b>center.canvas</b> for it. See below for details.
	 * 
	 * If <b>options.center</b> is not defined, center is left upper corner: <b>new THREE.Vector2( 0, 1 )</b>
	 * </pre>
	 * @param {THREE.PerspectiveCamera} [center.camera] [PerspectiveCamera]{@link https://threejs.org/docs/index.html#api/en/cameras/PerspectiveCamera}
	 * @param {HTMLElement} [center.canvas] <b>canvas</b> element.
	 * @see Thanks to {@link https://github.com/vasturiano/three-spritetext|three-spritetext}
	 */
	function SpriteText( text, position,	options = {} ) {

		if ( typeof text === 'number' ) text = text.toString();
		text = text.replaceAll( '\t', '  ' );
		
		const THREE = three$1.THREE;

		position = position || new THREE.Vector3( 0, 0, 0 );

		const sprite = new THREE.Sprite( new THREE.SpriteMaterial( {

			map: new THREE.Texture(),
			sizeAttenuation: options.sizeAttenuation !== undefined ? options.sizeAttenuation :
				false,//The size of the sprite is not attenuated by the camera depth. (Perspective camera only.)

		} ) );
		const canvas = document.createElement( 'canvas' );
		sprite.material.map.minFilter = THREE.LinearFilter;
		const fontSize = 90;
		const context = canvas.getContext( '2d' );

		if ( options.name ) sprite.name = options.name;

		sprite.userData.update = function ( /*optionsUpdate*/ ) {

			const optionsUpdate = {};
			if ( sprite.parent )
				updateOptions( sprite.parent, optionsUpdate );
			else if ( options.group )
				updateOptions( options.group, optionsUpdate );
			var textHeight = options.textHeight || optionsUpdate.textHeight || 0.04;
			const fov = options.fov || optionsUpdate.fov,
				sizeAttenuation = options.sizeAttenuation || optionsUpdate.sizeAttenuation || false,
				rotation = options.rotation || optionsUpdate.rotation || 0,
				fontFace = options.fontFace || optionsUpdate.fontFace || 'Arial',
				bold = options.bold || optionsUpdate.bold || false,
				italic = options.italic || optionsUpdate.italic || false,
				fontProperties = options.fontProperties || optionsUpdate.fontProperties || '',
				rect = options.rect || optionsUpdate.rect || {},
				color = 'rgba(255, 255, 255, 1)',
				fontColor = options.fontColor || optionsUpdate.fontColor || color,
				center = SpriteText.getCenter( options.center || optionsUpdate.center, position );
				
			if ( fov !== undefined )
				textHeight = fov * textHeight / 50;

			rect.displayRect = rect.displayRect || false;
			const borderThickness = rect.borderThickness ? rect.borderThickness : 5,
				font = `${fontProperties}${bold ? 'bold ' : ''}${italic ? 'italic ' : ''}${fontSize}px ${fontFace}`;

			context.font = font;

			var width = 0, linesCount = 1,
				lines;
			if ( typeof text === 'string' ) {

				linesCount = 0;
				lines = text.split( /\r\n|\r|\n/ );
				lines.forEach( function ( line ) {

					var lineWidth = context.measureText( line ).width;
					if ( width < lineWidth )
						width = lineWidth;
					linesCount += 1;

				} );

			} else width = context.measureText( text ).width;

			width += borderThickness * 2;

			const textWidth = width;
			canvas.width = textWidth;
			canvas.height = fontSize * linesCount + borderThickness * 2;

			context.font = font;

			//Rect
			//Thanks to http://stemkoski.github.io/Three.js/Sprite-Text-Labels.html
			if ( rect.displayRect ) {

				// background color
				context.fillStyle = rect.backgroundColor ? rect.backgroundColor : 'rgba(0, 0, 0, 1)';

				// border color
				context.strokeStyle = rect.borderColor ? rect.borderColor : fontColor;

				context.lineWidth = borderThickness;

				// function for drawing rounded rectangles
				function roundRect( ctx, x, y, w, h, r ) {

					ctx.beginPath();
					ctx.moveTo( x + r, y );
					ctx.lineTo( x + w - r, y );
					ctx.quadraticCurveTo( x + w, y, x + w, y + r );
					ctx.lineTo( x + w, y + h - r );
					ctx.quadraticCurveTo( x + w, y + h, x + w - r, y + h );
					ctx.lineTo( x + r, y + h );
					ctx.quadraticCurveTo( x, y + h, x, y + h - r );
					ctx.lineTo( x, y + r );
					ctx.quadraticCurveTo( x, y, x + r, y );
					ctx.closePath();
					ctx.fill();
					ctx.stroke();

				}
				roundRect( context,
					borderThickness / 2,
					borderThickness / 2,
					canvas.width - borderThickness,
					canvas.height - borderThickness,
					rect.borderRadius === undefined ? 0 : rect.borderRadius
				);

			}

			context.fillStyle = fontColor;
			context.textBaseline = 'bottom';
			if ( linesCount > 1 ) {
				for ( var i = 0; i < lines.length; i++ ) {

					const line = lines[i];
					context.fillText( line, borderThickness, canvas.height - ( ( lines.length - i - 1 ) * fontSize ) - borderThickness );

				}

			} else context.fillText( text, borderThickness, canvas.height - borderThickness );

			// Inject canvas into sprite
			sprite.material.map.image = canvas;
			sprite.material.map.needsUpdate = true;

			const th = textHeight * linesCount;// * angleDistance;
			sprite.scale.set( th * canvas.width / canvas.height, th );
			sprite.position.copy( position );
			sprite.center = center;

			//size attenuation. Whether the size of the sprite is attenuated by the camera depth. (Perspective camera only.) Default is false.
			//See https://threejs.org/docs/index.html#api/en/materials/SpriteMaterial.sizeAttenuation
			sprite.material.sizeAttenuation = sizeAttenuation;

			sprite.material.rotation = rotation;
			sprite.material.needsUpdate = true;

		};
		sprite.userData.update();

		sprite.userData.updateText = function ( _text ) {

			text = _text;
			const options = {};
			updateOptions( sprite.parent, options );
			sprite.userData.update( options );

		};
		if ( options.group ) options.group.add( sprite );
		else if ( three$1.group ) three$1.group.add( sprite );
		else if ( three$1.scene ) three$1.scene.add( sprite );

		sprite.userData.optionsSpriteText = options;

		return sprite;

	}
	/**
	 * @namespace
	 * @description Returns {@link https://threejs.org/docs/index.html#api/en/objects/Sprite.center|center}
	 * @param {THREE.Vector2|object} center If <b>center.x</b> and <b>center.y</b> is defined, then it the text's anchor point.
	 * <pre>
	 * Otherwise, the center is calculated so that the text is always inside the canvas.
	 * Please define <b>center.camera</b> and <b>center.canvas</b> for it. See below for details.
	 * </pre>
	 * @param {THREE.PerspectiveCamera} [center.camera] [PerspectiveCamera]{@link https://threejs.org/docs/index.html#api/en/cameras/PerspectiveCamera}
	 * @param {HTMLElement} [center.canvas] <b>canvas</b> element.
	 * @param {THREE.Vector3} [position] Position of the text. Uses only if <b>center.camera</b> and <b>center.canvas</b> is defined
	 * @returns center. If <b>center</b> is not defined, returns the left upper corner: <b>new THREE.Vector2( 0, 1 )</b>;
	 */
	SpriteText.getCenter = function ( center = {}, position ) {

		const THREE = three$1.THREE;
		const canvas = center.canvas ? center.canvas : undefined;
		/**
		 * Converting World coordinates to Screen coordinates
		 * https://stackoverflow.com/questions/11586527/converting-world-coordinates-to-screen-coordinates-in-three-js-using-projection
		 */
		function worldToScreen() {

			const width = canvas.width, height = canvas.height,
				widthHalf = width / 2, heightHalf = height / 2;
	//			pos = position.clone();
			const pos = new THREE.Vector3().copy( position );
			pos.project( center.camera );
			pos.x = ( pos.x * widthHalf ) + widthHalf;
			pos.y = - ( pos.y * heightHalf ) + heightHalf;
			return pos;

		}
		const screenPos = center.canvas ? worldToScreen() : undefined;
		return center instanceof THREE.Vector2 ||
			( ( typeof center === "object" ) && ( center.x !== undefined ) && ( center.y !== undefined )//При копироваении и при чтении из cockie THREE.Vector2 превращается в Object{x: x, y: y}
			) ? center : screenPos ?
				new THREE.Vector2( screenPos.x < ( canvas.width / 2 ) ? 0 : 1, screenPos.y < ( canvas.height / 2 ) ? 1 : 0 ) :
				new THREE.Vector2( 0, 1 );//Default is left upper corner

	};

	function updateOptions( group, options ) {

		if ( group.userData.optionsSpriteText )
			Object.keys( group.userData.optionsSpriteText ).forEach( function ( key ) {

				if ( options[key] === undefined )//Child options have more priority before parent options
					options[key] = group.userData.optionsSpriteText[key];

			} );
		while ( group.parent ) {

			group = group.parent;
			updateOptions( group, options );

		}

	}

	/**
	 * @namespace
	 * @description Call <b>SpriteText.updateSpriteTextGroup</b> if you want to update of the <b>options</b> of all <a href="module-SpriteText.html" target="_blank">SpriteText</a>, added in to <b>group</b> and all <b>child groups</b>.
	 * @param {THREE.Group|THREE.Scene} group [group]{@link https://threejs.org/docs/index.html?q=gr#api/en/objects/Group} or [scene]{@link https://threejs.org/docs/index.html?q=sce#api/en/scenes/Scene} of the <b>SpriteText</b> and of all <b>child groups</b> of the <b>SpriteText</b> for which these settings will have an effect.
	 * @example
	<script>
		optionsSpriteText = {

			textHeight: 0.1,
			sizeAttenuation: false,

		}
		const fSpriteTextAll = SpriteTextGui( scene, options, {

			settings: { zoomMultiplier: 1.5, },
			options: optionsSpriteText

		} );

		//Change of the text height
		optionsSpriteText.textHeight = 0.2;

		//update of the options of all SpriteText, added in to group and all child groups
		SpriteText.updateSpriteTextGroup( group );

		//To do something...

		//Restore options.textHeight to 0.1
		fSpriteTextAll.userData.restore();
	</script>
	*/
	SpriteText.updateSpriteTextGroup = function( group ) {

		const THREE = three$1.THREE;
		group.children.forEach( function ( spriteItem ) {

			if ( spriteItem instanceof THREE.Sprite ) {

				if ( spriteItem.userData.update !== undefined )
					spriteItem.userData.update();

			} //else if ( spriteItem instanceof THREE.Group )
				SpriteText.updateSpriteTextGroup( spriteItem );

		} );

	};

	/**
	 * @module StereoEffect
	 * @description Uses dual PerspectiveCameras for Parallax Barrier effects.
	 * @see About {@link https://en.wikipedia.org/wiki/Parallax_barrier|Parallax barrier}.
	 * 
	 * @author [Andrej Hristoliubov]{@link https://github.com/anhr}
	 * @author {@link http://alteredqualia.com/|alteredq}
	 * @author {@link http://mrdoob.com/|mrdoob}
	 * @author {@link http://aleksandarrodic.com/|arodic}
	 * @author {@link http://fonserbc.github.io/|fonserbc}
	 *
	 * @copyright 2011 Data Arts Team, Google Creative Lab
	 *
	 * @license under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	*/

	class StereoEffect {

		/**
		 * @class
		 * Uses dual PerspectiveCameras for [Parallax Barrier]{@link https://en.wikipedia.org/wiki/Parallax_barrier} effects.
		 * @param {THREE.WebGLRenderer} renderer {@link https://threejs.org/docs/#api/en/renderers/WebGLRenderer|WebGL renderer}
		 * @param {Options} [options=new Options()] <a href="../../jsdoc/Options/Options.html" target="_blank">Options</a> instance.
		 * See <b>options</b> parameter of <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
		 * @param {Function} [options.getLanguageCode=language code of your browser] Your custom getLanguageCode() function.
		 * <pre>
		 * returns the "primary language" subtag of the language version of the browser.
		 * Examples: "en" - English language, "ru" Russian.
		 * See the {@link https://tools.ietf.org/html/rfc4646#section-2.1|Syntax} paragraph of RFC 4646 for details.
		 * </pre>
		 * @param {Object} [options.lang] Object with localized language values.
		 * @param {boolean} [options.dat.cookie] false - do not save to cookie the StereoEffects  settings
		 * @param {string} [options.dat.cookieName] Name of the cookie is "StereoEffect" + options.dat.cookieName.
		 * @param {boolean|Object} [options.stereoEffect] false - do not create a <b>StereoEffect</b> instance.
		 * <p>Or:</p>
		 * @param {number} [options.stereoEffect.spatialMultiplex=spatialMultiplexsIndexs.Mono] spatial multiplex
		 * <pre>
		 * See {@link https://en.wikipedia.org/wiki/DVB_3D-TV|DVB 3D-TV} for details
		 * 	Available values
		 *
		 * 		spatialMultiplexsIndexs.Mono - no stereo effacts
		 *
		 * 		spatialMultiplexsIndexs.SbS - 'Side by side' format just put the left and right images one next to the other.
		 * 			See https://en.wikipedia.org/wiki/DVB_3D-TV#Side_by_side for dretails
		 *
		 * 		spatialMultiplexsIndexs.TaB - 'Top and bottom' format put left and right images one above the other.
		 * 			See //https://en.wikipedia.org/wiki/DVB_3D-TV#Top_and_bottom for details
		 *
		 * 	Example - options.stereoEffect.spatialMultiplex: StereoEffect.spatialMultiplexsIndexs.Mono
		 * </pre>
		 * @param {THREE.PerspectiveCamera} [options.stereoEffect.camera] [PerspectiveCamera]{@link https://threejs.org/docs/index.html#api/en/cameras/PerspectiveCamera}. Use the <b>camera</b> key if you want control cameras focus.
		 * @param {Float} [options.stereoEffect.far=10] Camera frustum far plane. The <b>far</b> key uses for correct calculation default values of Eye separation.
		 * See <b>far</b> parameter of the [PerspectiveCamera]{@link https://threejs.org/docs/index.html?q=PerspectiveCamera#api/en/cameras/PerspectiveCamera.far}
		 * @param {Float} [options.stereoEffect.eyeSep=( new THREE.StereoCamera().eyeSep / 10 ) * options.stereoEffect.far] Eye separation.
		 * See [StereoCamera.eyeSep]{@link https://threejs.org/docs/index.html?q=StereoCamera#api/en/cameras/StereoCamera.eyeSep}.
		 * @param {Float} [options.stereoEffect.stereoAspect=1] [THREE.StereoCamera.aspect]{@link https://threejs.org/docs/index.html?q=StereoCamera#api/en/cameras/StereoCamera.aspect}. Camera frustum aspect ratio.
		 * @param {boolean} [options.stereoEffect.rememberSize] true - remember default size of the canvas. Resize of the canvas to full screen for stereo mode and restore to default size if no stereo effacts.
		 * @param {HTMLElement} [options.stereoEffect.elParent] parent of the canvas.
		 * Use only if you use {@link https://threejs.org/docs/index.html#api/en/core/Raycaster|THREE.Raycaster} (working out what objects in the 3d space the mouse is over)
		 * and your canvas is not full screen.
		 */
		constructor( renderer, options = new Options$1() ) {

			if ( !renderer ) {

				console.error( 'StereoEffect: renderer = ' + renderer );
				return;

			}

			if ( !options.boOptions ) {

				options = new Options$1( options );

			}
			if ( options.stereoEffect === false ) return;

			if( options.dat.gui ) options.dat.mouseenter = false;//true - мышка находится над gui или canvasMenu
					//В этом случае не надо обрабатывать событие elContainer 'pointerdown'
					//по которому выбирается точка на canvas.
					//В противном случае если пользователь щелкнет на gui, то он может случайно выбрать точку на canvas.
					//Тогда открывается папка Meshes и все органы управления сдвигаются вниз. Это неудобно.
					//И вообще нехорошо когда выбирается точка когда пользователь не хочет это делать.

			const THREE = three$1.THREE;
			assign();

			if ( !options.stereoEffect ) options.stereoEffect = {};

			const settings = options.stereoEffect;
			/**
			 * See <b>options.stereoEffect</b> parameter of the <b>StereoEffect</b> class above.
			 * */
			this.settings = settings;
			/**
			 * See <b>options</b> parameter of the <b>StereoEffect</b> class above.
			 * */
			this.options = options;

			options.stereoEffect = this;

			//Убрал spatialMultiplex: settings.spatialMultiplex !== undefined ? settings.spatialMultiplex : spatialMultiplexsIndexs.Mono,//SbS,
			//из const optionsDefault
			//Потому что будет ошибка 
			//THREE.StereoEffect.render: Invalid "Spatial  multiplex" parameter: NaN
			//если в приложении не используется StereoEffect.gui
			//и не определен settings.spatialMultiplex
			if ( settings.spatialMultiplex === undefined ) settings.spatialMultiplex = spatialMultiplexsIndexs.Mono;//SbS

			settings.stereo = new THREE.StereoCamera();
			settings.stereo.aspect = settings.stereoAspect || 1;//0.5;
			if ( settings.far === undefined )
				settings.far = new THREE.PerspectiveCamera().focus;
			settings.focus = settings.camera === undefined ? new THREE.PerspectiveCamera().focus :
				new THREE.Vector3().distanceTo( settings.camera.position );
			settings.zeroParallax = 0;
			settings.eyeSep = settings.eyeSep || ( new THREE.StereoCamera().eyeSep / 10 ) * settings.far;
			if ( settings.camera !== undefined )
				settings.camera.focus = settings.focus;

			/**
			 * Sets eye separation.
			 * @param {any} eyeSep See <b>options.stereoEffect.eyeSep</b> parameter of the <b>StereoEffect</b> class above.
			 */
			this.setEyeSeparation = function ( eyeSep ) {

				settings.stereo.eyeSep = eyeSep;

			};

			this.setEyeSeparation( settings.eyeSep );

			/**
			 * Convert mouse position to renderer coordinates.
			 * @returns <pre>
			 * {
			 *
			 *	getMousePosition:function
			 *
			 * }
			 * </pre>
			 */
			this.getRendererSize = function () {

				return Options$1.raycaster.EventListeners.getRendererSize( renderer, settings.elParent );

			};
			var fullScreenSettings;
			var spatialMultiplexCur;
			/**
			 * Render a scene or another type of object using a camera.
			 * @see [WebGLRenderer.render]{@link https://threejs.org/docs/index.html?q=WebGLRenderer#api/en/renderers/WebGLRenderer.render}
			 * @param {THREE.Scene} scene [Scene]{@link https://threejs.org/docs/index.html#api/en/scenes/Scene}.
			 * @param {THREE.Camera} camera [PerspectiveCamera]{@link https://threejs.org/docs/index.html?q=persp#api/en/cameras/PerspectiveCamera}.
			 */
			this.render = function ( scene, camera ) {

				const spatialMultiplex = parseInt( settings.spatialMultiplex );

				if ( settings.rememberSize && !fullScreenSettings ) {

					if ( _canvasMenu && _canvasMenu.getFullScreenSettings )
						fullScreenSettings = _canvasMenu.getFullScreenSettings( this );
					else fullScreenSettings = new CreateFullScreenSettings( THREE, renderer, camera,
						{
							canvasMenu: _canvasMenu,
							stereoEffect: this,

						} );

				}

				scene.updateMatrixWorld();

				if ( camera.parent === null ) camera.updateMatrixWorld();

				const size = new THREE.Vector2();
				renderer.getSize( size );

				if ( renderer.autoClear ) renderer.clear();
				renderer.setScissorTest( true );

				var xL, yL, widthL, heightL,
					xR, yR, widthR, heightR;
				const parallax = settings.zeroParallax;
				function setMultiplex( stereoEffect ) {

					if ( !fullScreenSettings || ( spatialMultiplexCur === spatialMultiplex ) )
						return false;
					spatialMultiplexCur = spatialMultiplex;
					if ( stereoEffect.setControllerSpatialMultiplex ) stereoEffect.setControllerSpatialMultiplex( spatialMultiplex );
					else if ( stereoEffect.setSpatialMultiplex ) stereoEffect.setSpatialMultiplex( spatialMultiplex );
					return true;

				}
				function setFullScreen( fullScreen, stereoEffect ) {

					if ( setMultiplex( stereoEffect ) )
						fullScreenSettings.setFullScreen( fullScreen );

				}

				switch ( spatialMultiplex ) {

					case spatialMultiplexsIndexs.Mono://Mono

						renderer.setScissor( 0, 0, size.width, size.height );
						renderer.setViewport( 0, 0, size.width, size.height );
						renderer.render( scene, camera );
						renderer.setScissorTest( false );

						//если оствить setFullScreen то canvas не перейдет в full screen
						//если в программе по умолчанию был задан full screen и используется canvasMenu
						//Для провероки
						//в файле "D:\My documents\MyProjects\webgl\three.js\GitHub\commonNodeJS\master\myThree\Examples\html\index.html"
						//	для new MyThree(...)
						//		установить canvasMenu: true,
						//		убрать canvas: { fullScreen: false, }. Тоесть по умолчанию canvas перейдет в full screen
						//открыть http://localhost/anhr/commonNodeJS/master/myThree/Examples/html/

						//setFullScreen( true, this );

						//если оставить setFullScreen то canvas не перейдет в full screen
						//если убрать setFullScreen то canvas перейдет в full screen
						//но тогда будет неправильно выбираться пункт меню stereo Effects в canvasMenu в случае, если 
						//Выбрать пункт "слева направо" меню stereo Effects в canvasMenu.
						//	включится стерео режим.
						//	canvas перейдет в full screen.
						//Выбрать пункт "Восстановить размеры экрана" меню stereo Effects в canvasMenu.
						//	canvas выйдет из full screen.
						//	стерео режим отключится
						//	НО! ОСТАНЕТСЯ ВЫБРАННЫМ пункт "слева направо" меню stereo Effects в canvasMenu.
						//Для решения проблемы вставил строку ниже

						if ( options.canvasMenu ) setMultiplex( this );
						else setFullScreen( true, this );

						//Теперь в режиме full screen при выборе пункта "Моно" меню stereo Effects в canvasMenu
						//canvas не выходит из full screen. Ну и фиг с ним.

						return;

					case spatialMultiplexsIndexs.SbS://'Side by side'

						const _width = size.width / 2;

						xL = 0 + parallax; yL = 0; widthL = _width; heightL = size.height;
						xR = _width - parallax; yR = 0; widthR = _width; heightR = size.height;

						setFullScreen( false, this );

						break;

					case spatialMultiplexsIndexs.TaB://'Top and bottom'

						xL = 0 + parallax; yL = 0; widthL = size.width; heightL = size.height / 2;
						xR = 0 - parallax; yR = size.height / 2; widthR = size.width; heightR = size.height / 2;

						setFullScreen( false, this );

						break;
					default: console.error( 'THREE.StereoEffect.render: Invalid "Spatial  multiplex" parameter: ' + spatialMultiplex );

				}

				settings.stereo.update( camera );

				renderer.setScissor( xL, yL, widthL, heightL );
				renderer.setViewport( xL, yL, widthL, heightL );
				renderer.render( scene, settings.stereo.cameraL );

				renderer.setScissor( xR, yR, widthR, heightR );
				renderer.setViewport( xR, yR, widthR, heightR );
				renderer.render( scene, settings.stereo.cameraR );

				renderer.setScissorTest( false );

			};

			//Localization
			function getLang( params ) {

				params = params || {};
				const _lang = {

					stereoEffects: 'Stereo effects',

					spatialMultiplexName: 'Spatial  multiplex',
					spatialMultiplexTitle: 'Choose a way to do spatial multiplex.',

					spatialMultiplexs: {
						'Mono': spatialMultiplexsIndexs.Mono,
						'Side by side': spatialMultiplexsIndexs.SbS, //https://en.wikipedia.org/wiki/DVB_3D-TV#Side_by_side
						'Top and bottom': spatialMultiplexsIndexs.TaB, //https://en.wikipedia.org/wiki/DVB_3D-TV#Top_and_bottom
					},

					eyeSeparationName: 'Eye separation',
					eyeSeparationTitle: 'The distance between left and right cameras.',

					focus: 'Focus',
					focusTitle: 'Object distance.',

					zeroParallaxName: 'Zero parallax',
					zeroParallaxTitle: 'Distance to objects with zero parallax.',

					defaultButton: 'Default',
					defaultTitle: 'Restore default stereo effects settings.',

				};

				const _languageCode = params.getLanguageCode === undefined ? 'en'//Default language is English
					: params.getLanguageCode();
				switch ( _languageCode ) {

					case 'ru'://Russian language

						_lang.stereoEffects = 'Стерео эффекты';//'Stereo effects'

						_lang.spatialMultiplexName = 'Мультиплекс';//'Spatial  multiplex'
						_lang.spatialMultiplexTitle = 'Выберите способ создания пространственного мультиплексирования.';

						_lang.spatialMultiplexs = {
							'Моно': spatialMultiplexsIndexs.Mono, //Mono
							'Слева направо': spatialMultiplexsIndexs.SbS, //https://en.wikipedia.org/wiki/DVB_3D-TV#Side_by_side
							'Сверху вниз': spatialMultiplexsIndexs.TaB, //https://en.wikipedia.org/wiki/DVB_3D-TV#Top_and_bottom
						};

						_lang.eyeSeparationName = 'Развод камер';
						_lang.eyeSeparationTitle = 'Расстояние между левой и правой камерами.';

						_lang.focus = 'Фокус';
						_lang.focusTitle = 'Расстояние до объекта.';

						_lang.zeroParallaxName = 'Параллакс 0';
						_lang.zeroParallaxTitle = 'Расстояние до объектов с нулевым параллаксом.';

						_lang.defaultButton = 'Восстановить';
						_lang.defaultTitle = 'Восстановить настройки стерео эффектов по умолчанию.';

						break;
					default://Custom language
						if ( ( params.lang === undefined ) || ( params.lang._languageCode != _languageCode ) )
							break;

						Object.keys( params.lang ).forEach( function ( key ) {

							if ( _lang[key] === undefined )
								return;
							_lang[key] = params.lang[key];

						} );

				}
				return _lang;

			}

			/**
			 * Adds StereoEffects folder into dat.GUI.
			 * @see {@link https://github.com/anhr/dat.gui|dat.gui}.
			 * @param {Object} [guiParams={}] the following params are available.
			 * @param {GUI} [guiParams.dat] [dat.GUI()]{@link https://github.com/dataarts/dat.gui}.
			 * @param {GUI} [guiParams.folder] <b>StereoEffects</b> folder. See {@link https://github.com/anhr/dat.gui|dat.gui} for details
			 * @param {Function} [guiParams.onChangeMode] The event is fired if user has changed the stereo mode.
			 * <pre>
			 * parameter is new stereo mode.
			 * See the <b>settings.spatialMultiplex</b> parameter of the <b>StereoEffect</b> class for details.
			 * <pre>
			 * @param {number} [guiParams.scale=1] scale of allowed values.
			 */
			this.gui = function ( guiParams = {} ) {

				const gui = guiParams.folder || options.dat.gui;
				if ( !gui || options.dat.stereoEffectsGui === false )
					return;
				const dat = guiParams.dat || three$1.dat;//options.dat.dat;
				if ( guiParams === undefined ) guiParams = {};
				guiParams.scale = guiParams.scale || 1;
				const stereoEffect = options.dat.getCookieName( 'StereoEffect' ),
					_lang = getLang( { getLanguageCode: options.getLanguageCode, lang: options.lang } );
				
				const optionsDefault = {

					spatialMultiplex: settings.spatialMultiplex,
					eyeSep: ( new THREE.StereoCamera().eyeSep / 10 ) * settings.far,
					focus: settings.focus,
					zeroParallax: 0,

				};
				Object.freeze( optionsDefault );
				options.dat.cookie.getObject( stereoEffect, settings, optionsDefault );
				settings.spatialMultiplex = parseInt( settings.spatialMultiplex );

				if ( this.setSpatialMultiplex ) this.setSpatialMultiplex( settings.spatialMultiplex );

				//

				function displayControllers( value ) {

					const display = value == spatialMultiplexsIndexs.Mono ? 'none' : 'block';
					_fEyeSeparation.domElement.style.display = display;
					if ( _controllerCameraFocus !== undefined )
						_controllerCameraFocus.__li.style.display = display;
					_controllerDefaultF.__li.style.display = display;
					_controllerZeroParallax.__li.style.display = display;

				}

				const _fStereoEffects = gui.addFolder( _lang.stereoEffects );//Stero effects folder

				//Spatial multiplex
				const _controllerSpatialMultiplex = _fStereoEffects.add( settings, 'spatialMultiplex',
					_lang.spatialMultiplexs ).onChange( function ( value ) {

						value = parseInt( value );
						displayControllers( value );
						setObject( stereoEffect );
						if ( guiParams.onChangeMode )
							guiParams.onChangeMode( value );
						if ( menuItemStereoEffect )
							menuItemStereoEffect.select( value );

					} );
				dat.controllerNameAndTitle( _controllerSpatialMultiplex, _lang.spatialMultiplexName, _lang.spatialMultiplexTitle );
				this.setControllerSpatialMultiplex = function ( index ) {

					saveToCookie = false;
					_controllerSpatialMultiplex.setValue( index );
					saveToCookie = true;

				};

				//eyeSeparation
				//http://paulbourke.net/papers/vsmm2007/stereoscopy_workshop.pdf
				const _fEyeSeparation = _fStereoEffects.addFolder( _lang.eyeSeparationName );//Eye Separation
				dat.folderNameAndTitle( _fEyeSeparation, _lang.eyeSeparationName, _lang.eyeSeparationTitle );
				_fEyeSeparation.add( new PositionController( function ( shift ) {

					settings.eyeSep += shift;
					_controllerEyeSep.setValue( settings.eyeSep );

				}, { settings: { offset: 0.01 }, min: 0.0001, max: 0.01, step: 0.0001 }
				) );
				const _controllerEyeSep = dat.controllerZeroStep( _fEyeSeparation, settings.stereo, 'eyeSep', function ( value ) {

					settings.eyeSep = value;
					setObject( stereoEffect );

				} );
				dat.controllerNameAndTitle( _controllerEyeSep, _lang.eyeSeparationName, _lang.eyeSeparationTitle );

				if ( settings.camera !== undefined ) settings.camera.focus = settings.focus;
				
				var _controllerCameraFocus;
				if ( settings.camera ) {

					_controllerCameraFocus = _fStereoEffects.add( settings.camera,
						'focus', optionsDefault.focus / 10, optionsDefault.focus * 2, optionsDefault.focus / 1000 )
						.onChange( function ( value ) {

							settings.focus = value;
							setObject( stereoEffect );

						} );
					dat.controllerNameAndTitle( _controllerCameraFocus, _lang.focus, _lang.focusTitle );

				}

				//Zero parallax
				//http://paulbourke.net/papers/vsmm2007/stereoscopy_workshop.pdf
				const _minMax = ( 60 - ( 400 / 9 ) ) * guiParams.scale + 400 / 9;
				const _controllerZeroParallax = _fStereoEffects.add( settings, 'zeroParallax', - _minMax, _minMax )
					.onChange( function ( value ) {

						settings.zeroParallax = value;
						setObject( stereoEffect );

					} );
				dat.controllerNameAndTitle( _controllerZeroParallax, _lang.zeroParallaxName, _lang.zeroParallaxTitle );

				//default button
				const _controllerDefaultF = _fStereoEffects.add( {
					defaultF: function ( value ) {

						settings.stereo.eyeSep = optionsDefault.eyeSep;
						_controllerEyeSep.setValue( settings.stereo.eyeSep );

						if ( settings.camera ) {

							settings.camera.focus = optionsDefault.focus;
							_controllerCameraFocus.setValue( settings.camera.focus );

						}

						settings.zeroParallax = optionsDefault.zeroParallax;
						_controllerZeroParallax.setValue( settings.zeroParallax );

					},

				}, 'defaultF' );
				dat.controllerNameAndTitle( _controllerDefaultF, _lang.defaultButton, _lang.defaultTitle );

				displayControllers( settings.spatialMultiplex );

				var saveToCookie = true;
				/**
				 * sets an object into cookie.
				 * @param {string} name cookie name.
				 */
				function setObject( name ) {

					if ( !saveToCookie )
						return;
					const object = {};
					Object.keys( optionsDefault ).forEach( function ( key ) {

						object[key] = settings[key];

					} );
					options.dat.cookie.setObject( name, object );

				}
			};

			var _canvasMenu, menuItemStereoEffect;
			/**
			 * Adds a StereoEffect's menu item into [CanvasMenu]{@link https://github.com/anhr/commonNodeJS/tree/master/canvasMenu}.
			 * @param {CanvasMenu} [canvasMenu] [CanvasMenu]{@link https://github.com/anhr/commonNodeJS/tree/master/canvasMenu}.
			 * @param {Object} [params] the following params are available.
			 * @param {Function} [params.getLanguageCode=language code of your browser] Your custom getLanguageCode() function.
			 * <pre>
			   * returns the "primary language" subtag of the language version of the browser.
			 * Examples: "en" - English language, "ru" Russian.
			 * See the {@link https://tools.ietf.org/html/rfc4646#section-2.1|Syntax} paragraph of RFC 4646 for details.
			 * </pre>
			 */
			this.createCanvasMenuItem = function ( canvasMenu, params ) {

				_canvasMenu = canvasMenu;
				params = params || {};
				const _lang = getLang( { getLanguageCode: params.getLanguageCode, lang: params.lang } ),
					spatialMultiplexs = Object.keys( _lang.spatialMultiplexs );
				menuItemStereoEffect = {

					name: '⚭',
					title: _lang.stereoEffects,
					id: 'menuButtonStereoEffects',
					drop: 'up',
					items: [

						{
							name: spatialMultiplexs[spatialMultiplexsIndexs.Mono],//'Mono',
							id: 'menuButtonStereoEffectsMono',
							radio: true,
							checked: settings.spatialMultiplex === spatialMultiplexsIndexs.Mono,
							spatialMultiplex: spatialMultiplexsIndexs.Mono,
							onclick: function ( event ) {

								settings.spatialMultiplex = spatialMultiplexsIndexs.Mono;

							}
						},
						{
							name: spatialMultiplexs[spatialMultiplexsIndexs.SbS],//'Side by side',
							id: 'menuButtonStereoEffectsSbS',
							radio: true,
							checked: settings.spatialMultiplex === spatialMultiplexsIndexs.SbS,
							spatialMultiplex: spatialMultiplexsIndexs.SbS,
							onclick: function ( event ) {

								settings.spatialMultiplex = spatialMultiplexsIndexs.SbS;

							}
						},
						{
							name: spatialMultiplexs[spatialMultiplexsIndexs.TaB],//'Top and bottom',
							id: 'menuButtonStereoEffectsTaB',
							radio: true,
							checked: settings.spatialMultiplex === spatialMultiplexsIndexs.TaB,
							spatialMultiplex: spatialMultiplexsIndexs.TaB,
							onclick: function ( event ) {

								settings.spatialMultiplex = spatialMultiplexsIndexs.TaB;

							}
						},

					],

				};
				menuItemStereoEffect.select = function ( value ) {

					menuItemStereoEffect.items.forEach( function ( item ) {

						if ( item.spatialMultiplex === value ) {

							if ( !item.checked )
								item.elName.onclick( { target: item.elName } );

						}

					} );

				};
				this.setSpatialMultiplex = function ( index ) {

					menuItemStereoEffect.select( index );

				};
				canvasMenu.menu.push( menuItemStereoEffect );

			};

		}

	}/**
	 * Enumeration of available stereo modes. Available as <b>StereoEffect.spatialMultiplexsIndexs</b>.
	 * @see {@link https://en.wikipedia.org/wiki/DVB_3D-TV|DVB 3D-TV} for details
	 * @readonly
	 * @enum {number}
	 */
	StereoEffect.spatialMultiplexsIndexs = {
		/** No stereo effect */
		Mono: 0,
		/** {@link https://en.wikipedia.org/wiki/DVB_3D-TV#Side_by_side|Side by side} */
		SbS: 1, //
		/** {@link https://en.wikipedia.org/wiki/DVB_3D-TV#Top_and_bottom|Top and bottom} */
		TaB: 2, //
	};
	Object.freeze( StereoEffect.spatialMultiplexsIndexs );
	const spatialMultiplexsIndexs = StereoEffect.spatialMultiplexsIndexs;

	/* * @namespace
	 * @description Assigh setStereoEffect to [THREE.Raycaster]{@link https://threejs.org/docs/index.html#api/en/core/Raycaster}
	 */
	function assign() {

		const THREE = three$1.THREE;
		if ( new THREE.Raycaster().setStereoEffect )
			return;
			
		//Modifying of THREE.Raycaster for StereoEffect
		Object.assign( THREE.Raycaster.prototype, {

			/**
			 * @namespace
			 * @description Sets the <b>StereoEffect</b> settings to the {@link https://threejs.org/docs/#api/en/core/Raycaster|THREE.Raycaster}.
			 * Available as <b>THREE.Raycaster.setStereoEffect(...)</b>.
			 * @param {Object} [settings={}]
			 * @param {Options} [settings.options] See <a href="../../jsdoc/Options/Options.html" target="_blank">Options</a>.
			 * @param {THREE.PerspectiveCamera} settings.camera {@link https://threejs.org/docs/index.html#api/en/cameras/PerspectiveCamera|PerspectiveCamera}
			 * @param {THREE.Scene} [settings.scene] [Scene]{@link https://threejs.org/docs/index.html?q=Scene#api/en/scenes/Scene}
			 * @param {StereoEffect} [settings.stereoEffect=no stereo effects] stereoEffect.
			 * @param {THREE.WebGLRenderer} [settings.renderer=renderer parameter of THREE.StereoEffect] renderer. The {@link https://threejs.org/docs/#api/en/renderers/WebGLRenderer|WebGL renderer} displays your beautifully crafted scenes using WebGL.
			 * @param {boolean} [settings.raycasterEvents=true] true - add raycaster events: mousemove and pointerdown.
			 */
			setStereoEffect: function ( settings = {} ) {

				if ( settings.stereoEffect === false ) return;
				settings.raycasterEvents = settings.raycasterEvents === undefined ? true : settings.raycasterEvents;
				const camera = settings.camera, renderer = settings.renderer;

				if ( settings.raycasterEvents ){

					const mouse = new THREE.Vector2();
					window.addEventListener( 'mousemove', function ( event ) {

						// calculate mouse position in normalized device coordinates
						// (-1 to +1) for both components

						mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
						mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

						// update the picking ray with the camera and mouse position
						raycaster.setFromCamera( mouse, camera );

						raycaster.stereo.onDocumentMouseMove( event );

					}, false );
					window.addEventListener( 'pointerdown', function ( event ) {

						raycaster.stereo.onDocumentMouseDown( event );

					}, false );

				}

				const stereoEffect = settings.stereoEffect !== undefined ? settings.stereoEffect : typeof effect !== 'undefined' ? effect :
					new StereoEffect( renderer, settings.options ),
					raycaster = this,
					mouseL = new THREE.Vector2(),
					mouseR = new THREE.Vector2();
				var particles, //The object or array of objects to check for intersection with the ray. See THREE.Raycaster.intersectObject https://threejs.org/docs/index.html#api/en/core/Raycaster.intersectObject for details.
	//				intersects, //An array of intersections is returned by THREE.Raycaster.intersectObject or THREE.Raycaster.intersectObjects.
					mouse; //Attention!!! Do not assign new THREE.Vector2() here
				//for prevention of invalid detection of intersection with zero point ( THREE.Vector3( 0, 0, 0 ) )
				//after opening of the web page and before user has moved mouse.

				function getMousePosition() {

					stereoEffect.getRendererSize().getMousePosition( mouse, event );

					function mousePosition( vectorName, b ) {

						mouseL.copy( mouse );
						mouseR.copy( mouse );
						const a = 0.5;

						mouseL[vectorName] += a;
						mouseL[vectorName] *= 2;

						mouseR[vectorName] -= a;
						mouseR[vectorName] *= 2;

						//zeroParallax
						const size = new THREE.Vector2();
						renderer.getSize( size );
						const zeroParallax = ( stereoEffect.settings.zeroParallax / size.x ) * b;
						mouseL.x -= zeroParallax;
						mouseR.x += zeroParallax;

					}
					switch ( parseInt( stereoEffect.settings.spatialMultiplex ) ) {

						case spatialMultiplexsIndexs.Mono:
							return;
						case spatialMultiplexsIndexs.SbS:
							mousePosition( 'x', 4 );
							break;
						case spatialMultiplexsIndexs.TaB:
							mousePosition( 'y', 2 );
							break;
						default: console.error( 'THREE.Raycaster.setStereoEffect.getMousePosition: Invalid effect.settings.spatialMultiplex = ' + effect.settings.spatialMultiplex );
							return;

					}

				}
				function intersection( optionsIntersection ) {

					if ( mouse === undefined )
						return;//User has not moved mouse
					function isIntersection() { Options$1.raycaster.intersectionsInOut( particles, raycaster, renderer, mouse, settings ); }
					if ( parseInt( stereoEffect.settings.spatialMultiplex ) !== spatialMultiplexsIndexs.Mono ) {

						const mouseCur = mouse;
						mouse = mouseL;
						raycaster.setFromCamera( mouseL, camera );
						if ( !isIntersection() ) {

							mouse = mouseR;
							raycaster.setFromCamera( mouseR, camera );
							isIntersection();

						}
						mouse = mouseCur;
						return;

					}
					raycaster.setFromCamera( mouse, camera );
					isIntersection();

				}

				/**
				 * @namespace
				 * @description
				 * <pre>
				 * [Raycaster]{@link https://threejs.org/docs/index.html#api/en/core/Raycaster} helper.
				 * Available as <b>raycaster.stereo</b>.
				 * <b>raycaster</b> is [Raycaster]{@link https://threejs.org/docs/index.html#api/en/core/Raycaster} instance.
				 * </pre>
				 * */
				this.stereo = {

					/**
					 * [mousemove]{@link https://developer.mozilla.org/en-US/docs/Web/API/Element/mousemove_event} event.
					 * User is moving of mouse over canvas.
					 * @param {object} event
					 */
					onDocumentMouseMove: function ( event ) {

						if ( particles === undefined )
							return;//The object or array of objects to check for intersection with the ray is not defined. See THREE.Raycaster.intersectObject https://threejs.org/docs/index.html#api/en/core/Raycaster.intersectObject for details.
						event.preventDefault();
						if ( mouse === undefined )
							mouse = new THREE.Vector2();
						getMousePosition();
						intersection();

					},
					/**
					 * <pre>
					 * Available as <b>raycaster.stereo.isAddedToParticles( particle )</b>.
					 * <b>raycaster</b> is [Raycaster]{@link https://threejs.org/docs/index.html#api/en/core/Raycaster} instance.
					 * </pre>
					 * @param {THREE.Mesh} particle The [Mech]{@link https://threejs.org/docs/index.html#api/en/objects/Mesh} or derived class instance for check is added to <b>particles</b>.
					 * @returns true if <b>particle</b> is added to <b>particles</b>.
					 */
					isAddedToParticles: function ( particle ) {

						if ( !particles )
							return false;
						return particles.includes( particle );

					},
					/**
					 * <pre>
					 * Adds new particle into array of objects to check for intersection with the ray.
					 * Available as <b>raycaster.stereo.addParticle( particle )</b>.
					 * <b>raycaster</b> is [Raycaster]{@link https://threejs.org/docs/index.html#api/en/core/Raycaster} instance.
					 * </pre>
					 * @see <b>objects</b> parameter of the [Raycaster.intersectObjects]{@link https://threejs.org/docs/index.html#api/en/core/Raycaster.intersectObjects} for details.
					 * @param {THREE.Mesh} particle The [Mech]{@link https://threejs.org/docs/index.html#api/en/objects/Mesh} or derived class instance for check for intersection with the ray.
					 */
					addParticle: function ( particle ) {

						if ( particles === undefined )
							particles = [];
						if ( this.isAddedToParticles( particle ) ) {

							console.error( 'Duplicate particle "' + particle.name + '"' );
							return;

						}
						particles.push( particle );

					},
					/**
					 * <pre>
					 * New array of objects to check for intersection with the ray.
					 * Available as <b>raycaster.stereo.addParticles( particles )</b>.
					 * <b>raycaster</b> is [Raycaster]{@link https://threejs.org/docs/index.html#api/en/core/Raycaster} instance.
					 * </pre>
					 * @see <b>objects</b> parameter of the [Raycaster.intersectObjects]{@link https://threejs.org/docs/index.html#api/en/core/Raycaster.intersectObjects} for details.
					 * @param {array} newParticles New array of objects to check for intersection with the ray.
					 */
					addParticles: function ( newParticles ) {

						if ( particles !== undefined ) {

							if ( !Array.isArray( particles ) ) {

								var particlesCur = particles;
								particles = [];
								particles.push( particlesCur );

							}
							particles.push( newParticles );
							return;

						}
						particles = newParticles;

					},
					/**
					 * <pre>
					 * Remove particle from array of objects to check for intersection with the ray.
					 * Available as <b>raycaster.stereo.removeParticle( particle )</b>.
					 * <b>raycaster</b> is [Raycaster]{@link https://threejs.org/docs/index.html#api/en/core/Raycaster} instance.
					 * </pre>
					 * @see <b>objects</b> parameter of the [Raycaster.intersectObjects]{@link https://threejs.org/docs/index.html#api/en/core/Raycaster.intersectObjects} for details.
					 * @param {THREE.Mesh} particle The [Mech]{@link https://threejs.org/docs/index.html#api/en/objects/Mesh} or derived class instance for removing from array of objects for check for intersection with the ray.
					 */
					removeParticle: function ( particle ) {

						for ( var i = 0; i < particles.length; i++ ) {

							if ( Object.is( particle, particles[i] ) ) {

								particles.splice( i, 1 );
								break;

							}

						}

					},
					/**
					 * <pre>
					 * remove array of objects to check for intersection with the ray.
					 * Available as <b>raycaster.stereo.removeParticles()</b>.
					 * <b>raycaster</b> is [Raycaster]{@link https://threejs.org/docs/index.html#api/en/core/Raycaster} instance.
					 * </pre>
					 * @see <b>objects</b> parameter of the [Raycaster.intersectObjects]{@link https://threejs.org/docs/index.html#api/en/core/Raycaster.intersectObjects} for details.
					 */
					removeParticles: function () { particles = undefined; },
					/**
					 * <pre>
					 * get position of intersected object
					 * Available as <b>raycaster.stereo.getPosition( intersection )</b>.
					 * <b>raycaster</b> is [Raycaster]{@link https://threejs.org/docs/index.html#api/en/core/Raycaster} instance.
					 * </pre>
					 * @param {object} intersection first item of array of intersections.
					 * @See [Raycaster.intersectObject]{@link https://threejs.org/docs/index.html#api/en/core/Raycaster.intersectObject} for details
					 */
					getPosition: function ( intersection ) {

						const attributesPosition = intersection.object.geometry.attributes.position;

						//Если опредедить как const, то при выполнении npm run build появится ошибка
						//(babel plugin) SyntaxError: D:/My documents/MyProjects/webgl/three.js/GitHub/commonNodeJS/master/StereoEffect/StereoEffect.js: "position" is read-only
						var position = attributesPosition.itemSize >= 4 ? new THREE.Vector4( 0, 0, 0, 0 ) : new THREE.Vector3();

						if ( intersection.index !== undefined ) {

							position.fromArray( attributesPosition.array, intersection.index * attributesPosition.itemSize );

							position.multiply( intersection.object.scale );

							position.add( intersection.object.position );

						} else position = intersection.object.position;
						return position;

					}

				};

			}

		} );

	}
	StereoEffect.assign = assign;
	//import { getLanguageCode } from 'https://raw.githack.com/anhr/commonNodeJS/master/lang.js';

	const lang = {

		mesh: 'Mesh',
		pointName: 'Point Name',
		color: 'Сolor',
		opacity: 'Opacity',

	};

	switch ( getLanguageCode() ) {

		case 'ru'://Russian language
			lang.mesh = '3D объект';
			lang.pointName = 'Имя точки';
			lang.color = 'Цвет';
			lang.opacity = 'Непрозрачность';
			break;

	}

	/** @namespace
	 * @description Creates the <a href="../../SpriteText/jsdoc" target="_blank">SpriteText</a> instance with information about point, intersected with mouse cursor.
	 * @param {THREE.Raycaster.intersectObject} intersection See [intersection]{@link https://threejs.org/docs/index.html#api/en/core/Raycaster.intersectObject} for details.
	 * @param {object} options The following options are available
	 * @param {object} [options.scales] axes scales.
	 * See <b>options.scales</b> parameter of the <a href="../../AxesHelper/jsdoc/module-AxesHelper-AxesHelper.html" target="_blank">AxesHelper</a> class for details.
	 * @param {object} options.spriteOptions Options of the <b>SpriteText</b>.
	 * See [SpriteText]{@link https://raw.githack.com/anhr/commonNodeJS/master/SpriteText/jsdoc/module-SpriteText..html} for details.
	 * @returns <b>new SpriteText</b> with information about point, intersected with mouse cursor.
	 */
	StereoEffect.getTextIntersection = function ( intersection, options ) {

		const spriteText = Options$1.findSpriteTextIntersection( options.spriteOptions.group );
		if ( spriteText )
			return spriteText;
			
		const THREE = three$1.THREE,
			myObject = intersection.object.userData.myObject,
			guiPoints = myObject ? myObject.guiPoints : undefined,
			searchNearestEdgeVerticeId = guiPoints ? guiPoints.searchNearestEdgeVerticeId : undefined,
			verticeId = searchNearestEdgeVerticeId ? searchNearestEdgeVerticeId( intersection.index, intersection ) : undefined,
			position = getObjectPosition( intersection.object, verticeId != undefined ? verticeId : intersection.index ),
			scales = options.scales || {},
			isArrayFuncs = (
				( intersection.index !== undefined ) &&
				( intersection.object.userData.player !== undefined ) &&
				( intersection.object.userData.player.arrayFuncs !== undefined ) 
			),
			funcs = !isArrayFuncs ? undefined : intersection.object.userData.player.arrayFuncs,
			funcsIndex = () => { return funcs.intersection ? funcs.intersection(intersection.index) : funcs[intersection.index]; },
			func = ( funcs === undefined ) || ( typeof funcs === "function" ) ? undefined : funcs.intersection ? funcs.intersection(intersection.index) : funcs[intersection.index],
			pointName = isArrayFuncs && func ? func.name : undefined,
			color = !isArrayFuncs || ( func === undefined ) ?
				undefined :
				Array.isArray( func.w ) ?
					Player.execFunc( func, 'w', group.userData.t, options ) ://.a, options.b ) :
					func.w;

		if ( intersection.object.userData.onIntersection ) intersection.object.userData.onIntersection();
		const boXYZ = !scales.x &&  !scales.y &&  !scales.z;
	//	options.spriteOptions.name = Options.findSpriteTextIntersection.spriteTextIntersectionName;
		options.spriteOptions.name = Options$1.findSpriteTextIntersection.spriteTextIntersectionName;
		return new SpriteText(

			//text
			/*lang.mesh + ': ' + */( intersection.object.name === '' ? intersection.object.type : intersection.object.name ) +
			( pointName === undefined ? '' : '\n'+ lang.pointName + ': ' + pointName ) +
			( intersection.index === undefined ? '' : '\nID: ' + ( verticeId != undefined ? verticeId : intersection.index ) ) + 
			( ( !boXYZ && !scales.x ) || ( scales.x && !scales.x.isAxis() ) ? '' :
				'\n\t' + ( ( scales.x && scales.x.name ) || ( scales.x.name === 0 ) ? scales.x.name : 'X' ) + ': ' + position.x ) +
			( ( !boXYZ && !scales.y ) || ( scales.y && !scales.y.isAxis() ) ? '' :
				'\n\t' + ( ( scales.y && scales.y.name ) || ( scales.y.name === 0 ) ? scales.y.name : 'Y' ) + ': ' + position.y ) +
			( ( !boXYZ && !scales.z ) || ( scales.z && !scales.z.isAxis() ) ? '' :
				'\n\t' + ( ( scales.z && scales.z.name ) || ( scales.z.name === 0 ) ? scales.z.name : 'Z' ) + ': ' + position.z ) + 
			(//w
				!isArrayFuncs ?
					'' :
					funcsIndex() instanceof THREE.Vector4 ||
						funcsIndex() instanceof THREE.Vector3 ||
						typeof funcs === "function" ?
						color instanceof THREE.Color ?
							'\n' + lang.color + ': ' + new THREE.Color( color.r, color.g, color.b ).getHexString() :
							position.w !== undefined ? '\n\t' + ( scales.w && scales.w.name ? scales.w.name : 'W' ) + ': ' + position.w : '' :
						''

			) +
			(//opacity
				( intersection.object.geometry.attributes.ca === undefined ) ||
					( intersection.object.geometry.attributes.ca.itemSize < 4 ) ?
					'' :
					'\n' + lang.opacity + ': ' + new THREE.Vector4().fromArray(

						intersection.object.geometry.attributes.ca.array,
						intersection.index * intersection.object.geometry.attributes.ca.itemSize

					).w
			) +
			(//Custom text
				intersection.object.userData.raycaster && intersection.object.userData.raycaster.text ? intersection.object.userData.raycaster.text( intersection ) : ''
			),
			intersection.pointSpriteText ? intersection.pointSpriteText : intersection.point,//position,
			options.spriteOptions
		);

	};

	/**
	 * options of the canvas
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

	var boCreateControllers;

	class Options {

		/**
		 * Options of the canvas
		 * @param {Object} options See the <b>options</b> parameter of the <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
		 */
		constructor( options ) {

			const _this = this;
			options = options || {};
			if ( options.boOptions )
				return options;//duplucate new Options

			var lang;

			if ( options.a === undefined ) options.a = 1;
			if ( options.b === undefined ) options.b = 0;

			/**
			 * set the <b>scales.w</b> key of the <b>options</b>
			 * @param {Object} options
			 * @param {string} [options.scales.w.name="W"] axis name.
			 * @param {number} [options.scales.w.min=0] Minimum range of the <a href="../../colorpicker/jsdoc/index.html" target="_blank">color palette</a> index.
			 * @param {number} [options.scales.w.max=1] Maximum range of the <a href="../../colorpicker/jsdoc/index.html" target="_blank">color palette</a> index.
			 */
			this.setW = function ( optionsCur ) {

				optionsCur = optionsCur || options;
				optionsCur.scales = optionsCur.scales || {};
				optionsCur.scales.w;
				if ( !optionsCur.palette )
					_this.setPalette();// optionsCur );

				//максимальное значение шкалы w по умолчанию беру из THREE.Vector4
				//потому что в противном случае неверно будет отображаться цвет точки, заданной как THREE.Vector4()
	//			scale.max = scale.max === undefined ? new three.THREE.Vector4().w : scale.max;

			};
			options.scales = options.scales || {};
			const boCreateScale = !options.scales.x && !options.scales.y && !options.scales.z;
			function setScale( axisName ) {

				//Не надо создавать ось потому что иначе будут создавться контролы для осей, которые не хочет видеть пользователь и будет рмсоватся пунктирная линия к не существующей оси если пользователь нажал на точку
				if ( boCreateScale )
					options.scales[axisName] = options.scales[axisName] || {};

				if ( !options.scales[axisName] )
					return;

	/*
				options.scales[axisName].name = options.scales[axisName].name || axisName;
				options.scales[axisName].min = options.scales[axisName].min === undefined ? -1 : options.scales[axisName].min;
				options.scales[axisName].max = options.scales[axisName].max === undefined ? 1 : options.scales[axisName].max;
	*/			

			}
			setScale( 'x' );
			setScale( 'y' );
			setScale( 'z' );
	//		options.scales.setW = function () { _this.setW(); }
			options.point = options.point || {};
			if (options.point.size === undefined) options.point.size = 5.0;
			options.point.sizePointsMaterial = options.point.sizePointsMaterial || 100.0;

			/**
			 * set the <b>palette</b> key of the <b>options</b>.
			 * See <a href="../../colorpicker/jsdoc/module-ColorPicker-ColorPicker.html#palette" target="_blank">color palette</a>.
			 * @param {ColorPicker.palette} [palette] new palette.
			 */
			this.setPalette = function ( palette ) {

				if ( palette ) options.palette = palette;
				else if ( !options.palette ) options.palette = new ColorPicker$1.palette();

			};

			/**
			 * Create [OrbitControls]{@link https://threejs.org/docs/index.html#examples/en/controls/OrbitControls}
			 * @param {THREE.PerspectiveCamera} camera [PerspectiveCamera]{@link https://threejs.org/docs/index.html#api/en/cameras/PerspectiveCamera}. Use the <b>camera</b> key if you want control cameras focus.
			 * @param {THREE.WebGLRenderer} renderer [THREE.WebGLRenderer]{@link https://threejs.org/docs/index.html#api/en/renderers/WebGLRenderer}.
			 * @param {THREE.Scene} scene [THREE.Scene]{@link https://threejs.org/docs/index.html?q=sce#api/en/scenes/Scene}.
			 */
			this.createOrbitControls = function ( camera, renderer, scene ) {

				if ( options.orbitControls === false )
					return;

				const settings = options.orbitControls || {};
				_this.orbitControls = new three$1.OrbitControls( camera, renderer.domElement );
				if ( settings.enableRotate !== undefined ) _this.orbitControls.enableRotate = settings.enableRotate;
				_this.orbitControls.target.set( scene.position.x * 2, scene.position.y * 2, scene.position.z * 2 );
				_this.orbitControls.saveState();//For reset of the orbitControls settings in the CameraGui and OrbitControlsGui
				_this.orbitControls.update();

				if ( _this.frustumPoints )
					_this.orbitControls.addEventListener( 'change', function () { _this.frustumPoints.onChangeControls(); } );

			};

			/**
			 * Reset <a href="../../Player/jsdoc" target="_blank">Player</a> and restore [camera]{@link https://threejs.org/docs/index.html#api/en/cameras/PerspectiveCamera} position.
			 * @param {THREE.PerspectiveCamera} camera [PerspectiveCamera]{@link https://threejs.org/docs/index.html#api/en/cameras/PerspectiveCamera}.
			 * @param {THREE.Scene} scene [THREE.Scene]{@link https://threejs.org/docs/index.html?q=sce#api/en/scenes/Scene}.
			 */
			this.restoreSceneController = function ( camera, scene ) {

				if ( !three$1.dat || ( options.dat === false ) )//options.dat.dat
					return;
					
				//Localization

				const lang = {

					defaultButton: 'Default',
					defaultTitle: 'Reset player and restore camera position.',

				};

				switch ( this.getLanguageCode() ) {

					case 'ru'://Russian language

						lang.defaultButton = 'Восстановить';
						lang.defaultTitle = 'Восстановить положение камеры и проигрывателя.';

						break;

				}

				const scenePosition = new three$1.THREE.Vector3().copy( scene.position ),
					cameraPosition = new three$1.THREE.Vector3().copy( camera.position );

				three$1.dat.controllerNameAndTitle( options.dat.gui.add( {
					defaultF: function ( value ) {

						if ( options.player ) options.player.selectScene( options.playerOptions.selectSceneIndex );

						camera.position.copy( cameraPosition );
						scene.position.copy( scenePosition );
						if ( options.orbitControls !== false ) {

							options.orbitControls.target = new three$1.THREE.Vector3();
							options.orbitControls.object.position.copy( camera.position );
							options.orbitControls.update();

						}

					},

				}, 'defaultF' ), lang.defaultButton, lang.defaultTitle );

			};

			Object.defineProperties( this, {

				/**
				 * getter and setter
				 * <pre>
				 * 
				 * playerOptions = {
				 * 
				 *	min: 0,// Minimum range of the axis.
				 *	max: 1,// Maximum range of the axis.
				 *	marks: 10,// Ticks count of the playing. Number of scenes of 3D objects animation.
				 *		//Have effect for <b>max</b> is not Infinity.
				 *	dt: 0.1,// Step of the animation. Have effect only if <b>max</b> is infinity.
				 *	repeat: false,// true - Infinitely repeating 3D objects animation.
				 *	interval: 1,// Ticks per seconds.
				 *	zoomMultiplier: 1.1,// zoom multiplier of the time.
				 *	offset: 0.1,// offset of the time.
				 *	name: "",// name of the time.
				 *
				 * }
				 * </pre>
				 * @param {number} [playerOptions=0] Minimum range of the axis.
				 */
				playerOptions: {

					get: function () {

						options.playerOptions = options.playerOptions || {};
						const playerOptions = options.playerOptions;
						playerOptions.min = playerOptions.min || 0;
						if ( playerOptions.max === Infinity ) playerOptions.max = null;//Заменяю Infinity на null потому что из cockie Infinity читается как null
						if ( playerOptions.max !== null ) {

							if ( playerOptions.max === undefined ) playerOptions.max = 1;
							playerOptions.marks = playerOptions.marks || 10;//2;

						} else playerOptions.marks = null;
						if ( playerOptions.max === null ) playerOptions.dt = playerOptions.dt || 0.1;
						else playerOptions.dt = ( playerOptions.max - playerOptions.min ) / ( playerOptions.marks - 1 );
						playerOptions.repeat = playerOptions.repeat || false;
						playerOptions.interval = playerOptions.interval != undefined ? playerOptions.interval : 1;
						playerOptions.zoomMultiplier = playerOptions.zoomMultiplier || 1.1;
						playerOptions.offset = playerOptions.offset || 0.1;
						playerOptions.name = playerOptions.name || '';
						if ( !playerOptions.cameraTarget ) {

							const cameraTarget = new Player$1.cameraTarget();
							Object.defineProperties( playerOptions, {

								cameraTarget: {

									get: function () {

										return cameraTarget;

									},

								}

							} );

						}
						return options.playerOptions;

					},
					set: function ( playerOptions ) { options.playerOptions = playerOptions; },

				},

				/**
				 * getter
				 * <pre>
				 * See <b>options.a</b> parameter of the <a href="../../player/jsdoc/module-Player-Player.execFunc.html" target="_blank">Player.execFunc</a>.
				 * </pre>
				 **/
				a: {

					get: function () { return options.a; }

				},

				/**
				 * getter
				 * <pre>
				 * See <b>options.b</b> parameter of the <a href="../../player/jsdoc/module-Player-Player.execFunc.html" target="_blank">Player.execFunc</a>.
				 * </pre>
				 **/
				b: {

					get: function () { return options.b; }

				},

				/**
				 * getter and setter
				 * <pre>
				 * See the <b>options.dat</b> parameter of the <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
				 * dat = {
				 * 
				 *	gui: new [dat.GUI()]{@link https://github.com/dataarts/dat.gui} instance,
				 *		undefined - do not use dat-gui JavaScript Controller Library. [dat.gui]{@link https://github.com/dataarts/dat.gui}.
				 *	cookie: false,// do not save to cookie all user settings
				 *	cookieName:,// Name of the cookie.
				 *	axesHelperGui: false,// - do not adds a <a href="../../AxesHelper/jsdoc/module-AxesHelperGui.html" target="_blank">AxesHelperGui</a> into [dat.gui]{@link https://github.com/dataarts/dat.gui}.
				 *	stereoEffectsGui: false,// - do not adds <a href="../../StereoEffect/jsdoc/module-StereoEffect-StereoEffect.html#gui" target="_blank">Stereo Effects folder</a> into [dat.gui]{@link https://github.com/dataarts/dat.gui}.
				 *	folderPoint: false,// - do not adds <a href="../../jsdoc/folderPoint/FolderPoint.html" target="_blank">Point settings folder</a> into [dat.gui]{@link https://github.com/dataarts/dat.gui}.
				 *	playerGui: true,// - adds a <a href="../../player/jsdoc/module-Player.html#~Player.gui" target="_blank">Player controllers</a> into [dat.gui]{@link https://github.com/dataarts/dat.gui}.
				 *	guiSelectPoint: true,// - displays the <a href="../../guiSelectPoint/jsdoc/module-GuiSelectPoint.html" target="_blank">Select Point</a>. [dat.gui]{@link https://github.com/dataarts/dat.gui} based graphical user interface for select a point from the mesh.
				 *	guiFrustumPoints: true,// - Adds <a href="../../FrustumPoints/jsdoc/FrustumPoints.html#gui" target="_blank">Frustum Points folder</a> into [dat.gui]{@link https://github.com/dataarts/dat.gui}.
				 *	cameraGui: true,// - Adds <a href="../../jsdoc/CameraGui/module-CameraGui-CameraGui.html" target="_blank">Camera folder</a> into [dat.gui]{@link https://github.com/dataarts/dat.gui}.
				 *	moveScene: true,// - displays the <a href="../../jsdoc/MoveGroupGui/index.html" target="_blank">move group gui</a>.
				 *	spriteTextGui: true,// - displays the <a href="../../SpriteText/jsdoc/module-SpriteTextGui.html" target="_blank">SpriteTextGui</a>.
				 *
				 * }
				 * </pre>
				 **/
				dat: {

					get: function () {

						class Dat{

							/* *
							 * dat options
							 * @param {dat} dat [dat]{@link https://github.com/dataarts/dat.gui}
							 */
							constructor( dat ) {

								dat = dat || {};
								if ( dat.boDat )
									return dat;//duplucate new Options
								function guiParent() {

									//без elMyGuiContainer не будет скроллинга gui
									const elMyGuiContainer = document.createElement( 'div' );
									dat.parent.appendChild( elMyGuiContainer );
									elMyGuiContainer.appendChild( dat.gui.domElement );
									elMyGuiContainer.style.position = 'absolute';//оставляем gui в пределах canvas
									elMyGuiContainer.style.top = '0px';
									elMyGuiContainer.style.right = '0px';

								}
								Object.defineProperties( this, {


									/* *
									 * getter
									 * <pre>
									 * returns true if <b>dat</b> was converted by <b>new Dat( options );</b>
									 * </pre>
									 **/
									boDat: {

										get: function () { return true; },

									},

									/* *
									 * getter and setter
									 * <pre>
									 * [dat]{@link https://github.com/dataarts/dat.gui}
									 * </pre>
									 **/
									dat: {

										get: function () {

											console.warn('get dat depreacated. Use three.dat = dat.');
											return three$1.dat;

										},
										set: function ( dat ) {

											console.warn('Set dat depreacated. Use three.dat = dat.');
											if (

												dat.dat &&
												( dat.dat.constructor.name === dat.constructor.name ) &&
												( dat.dat.constructor.name !== 'Object' )

											)
												console.error( 'duplicate dat.' );
											dat.dat = dat;

										}

									},

									/* *
									 * getter
									 * <pre>
									 * Name of the cookie.
									 * </pre>
									 **/
									cookieName : {

										get: function () { return dat.cookieName ; },

									},

									/* *
									 * getter
									 * <pre>
									 * [dat.GUI()]{@link https://github.com/dataarts/dat.gui} instance.
									 * </pre>
									 **/
									gui: {

										get: function () {

											if ( !dat.gui && three$1.dat ) {

												//если сделать autoPlace: false то не будет скроллинга для gui
												dat.gui = new three$1.dat.GUI();// options.dat.parent ? { autoPlace: false, } : undefined );
												if ( options.dat.parent ) {

													guiParent();

												}

											}
											return dat.gui;

										},

									},
									cookie: {

										get: function () { return dat.cookie; },
										set: function ( cookie ) { dat.cookie = cookie; },

									},
									guiSelectPoint: {

										get: function () { return dat.guiSelectPoint; },
										set: function ( guiSelectPoint ) { dat.guiSelectPoint = guiSelectPoint; },

									},
									cameraGui: {

										get: function () { return dat.cameraGui; },
										set: function ( cameraGui ) { dat.cameraGui = cameraGui; },

									},
									playerGui: {

										get: function () { return dat.playerGui; },

									},
									orbitControlsGui: {

										get: function () { return dat.orbitControlsGui; },

									},
									axesHelperGui: {

										get: function () { return dat.axesHelperGui; },

									},
									playController: {

										get: function () { return dat.playController; },

									},
									stereoEffectsGui: {

										get: function () { return dat.playController; },

									},
									moveScene: {

										get: function () { return dat.moveScene; },

									},
									spriteTextGui: {

										get: function () { return dat.spriteTextGui; },

									},
									folderPoint: {

										get: function () { return dat.folderPoint; },
										set: function ( folderPoint ) { dat.folderPoint = folderPoint; },

									},
									pointLightGui: {

										get: function () { return dat.pointLightGui; },

									},
									parent: {

										get: function () { return dat.parent; },

									},

								} );

								//For debugging. Find a hidden keys
								for ( var propertyName in dat ) {

									if ( this[propertyName] === undefined ) console.error( 'Dat: dat.' + propertyName + ' key is hidden' );

								}

							}

						}
						if ( options.dat === false )
							return options.dat;
						options.dat = new Dat( options.dat );
						if ( options.dat.gui ) {

							//debug
							setTimeout( function () {

								const className = options.dat.gui.domElement.className;
								var guiCount = 0;
								options.dat.gui.domElement.parentElement.childNodes.forEach( function ( node ) {

									if ( node.className === className ) guiCount++;

								} );
								if ( guiCount > 1 )
									console.error( 'Options: duplicate dat.GUI' );

							}, 0 );

							options.dat.gui.domElement.addEventListener( 'mouseenter', function ( event ) { options.dat.mouseenter = true; } );
							options.dat.gui.domElement.addEventListener( 'mouseleave', function ( event ) { options.dat.mouseenter = false; } );

						}
						if ( options.dat.cookie === false ) options.dat.cookie = new cookie.defaultCookie();
						else if ( options.dat.cookie === undefined ) options.dat.cookie = cookie;
						options.dat.getCookieName = function ( cookieName = '' ) {

							const name = options.dat.cookieName ||
								( options.elContainer ?
									typeof options.elContainer === "object" ?
										options.elContainer.id :
										typeof options.elContainer === "string" ?
											options.elContainer :
											'' :
									'' );
							return cookieName + ( ( cookieName !== '' ) && ( name !== '' ) ? '_' : '' ) + name;

						};
						//axesHelperGui: false,
						//playerGui: false,
						//guiSelectPoint: false,
						//moveScene: false,
						//cameraGui: false,
						//stereoEffectsGui: false,
						//spriteTextGui: false,
						//folderPoint: false,
						return options.dat;

					},
					set: function ( dat ) { options.dat = dat; },

				},

				/**
				 * getter
				 * <pre>
				 * Your custom getLanguageCode() function.
				 * returns the "primary language" subtag of the language version of the browser.
				 * Examples: "en" - English language, "ru" Russian.
				 * See the "Syntax" paragraph of RFC 4646 {@link https://tools.ietf.org/html/rfc4646#section-2.1|rfc4646 2.1 Syntax} for details.
				 * Default returns the language code of your browser.
				 * </pre>
				 **/
				getLanguageCode: {

					get: function () {

						if ( typeof options.getLanguageCode === "string" )
							return function () {

								return options.getLanguageCode;

							}
						return options.getLanguageCode || getLanguageCode;

					}

				},

				/**
				 * getter and setter
				 * <pre>
				 * See <b>options.scales</b> parameter of the <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
				 * </pre>
				 **/
				scales: {

					get: function () {

						class Scales {

							/* *
							 * scales
							 * @param {object} scales
							 */
							constructor( scales ) {

								class Scale {

									/* *
									 * scale
									 * @param {object} scales
									 * @param {string} axisName. 'x' or 'y' or 'z'
									 */
									constructor( scales, axisName ) {

										let scale = scales[axisName];
	//									scale = scale || {};
										this.isAxis = function () {

											if ( !scales || ( !scales.x && !scales.y && !scales.z ) || scale ) return true;
											return false;
											
										};
										const setScale = (callBack) => {

											if ( !scale ) {

												scales[axisName] = {};
												scale = scales[axisName];

											}
											callBack();
											scale.step = Math.abs( options.scales.w.min - options.scales.w.max ) / 100;
											if ( options.guiSelectPoint) options.guiSelectPoint.setAxisControl( 'w', scale );

										};
										Object.defineProperties( this, {

											/* *
											 * getter
											 * <pre>
											 * returns true if <b>scale</b> was converted by <b>new Scale( scale );</b>
											 * </pre>
											 **/
											boScale: { get: function () { return true; }, },
	/*										
											isChangeColor : {
												
												get: () => { return scale ? scale.isChangeColor : undefined; },
												set: ( isChangeColor ) => { scale.isChangeColor = isChangeColor; },
											
											},
	*/										
											isColor : {
												
												get: () => { return scale ? scale.isColor : undefined; },
												set: ( isColor ) => { scale.isColor = isColor; },
											
											},
											min: {

												get: () => {

													if ( !scale || !scale.min ) return axisName === 'w' ? 0 : -1;
													return scale.min;

												},
												set: ( min ) => { setScale( () => { scale.min = min; }); },

											},
											max: {

												get: function () {

													//максимальное значение шкалы w по умолчанию беру из THREE.Vector4
													//потому что в противном случае неверно будет отображаться цвет точки, заданной как THREE.Vector4()
													if ( !scale || !scale.max ) return axisName === 'w' ? new three$1.THREE.Vector4().w : 1;
													return scale.max;

												},
												set: ( max ) => { setScale( () => { scale.max = max; }); },

											},
											name: {

												get: function () {

													if ( !scale || ( scale.name === undefined ) ) return axisName;
													return scale.name;

												},
												set: function ( name ) {

													if ( scale ) {
														
														scale.name = name;
														if ( options.guiSelectPoint ) options.guiSelectPoint.setAxisName( axisName, name );

													}
													
												},

											},
											marks: {

												get: function () {

													if ( !scale ) return undefined;
													if ( !scale.marks ) scale.marks = 3;
													return scale.marks;

												},
	//											set: function ( marks ) { scale.marks = marks; },

											},

										} );

										//For debugging. Find a hidden keys
										for ( var propertyName in scale ) {

											if ( this[propertyName] === undefined ) console.error( 'Options.Scales: scale.' + propertyName + ' key is hidden' );

										}

									}

								}
								const scalesObject = {

									x: new Scale( options.scales, 'x' ),
									y: new Scale( options.scales, 'y' ),
									z: new Scale( options.scales, 'z' ),
									w: new Scale( options.scales, 'w' ),

								};

								Object.defineProperties( this, {

									/* *
									 * getter
									 * <pre>
									 * returns true if <b>scales</b> was converted by <b>new Scales( scales );</b>
									 * </pre>
									 **/
									boScales: {

										get: function () { return true; },

									},
									x: {

										get: function () { return scalesObject.x; },
										set: function ( x ) {

											if ( x === undefined ) {

												delete scales.x;
												delete scalesObject.x;
												scalesObject.x = new Scale( scales, 'x' );

											} else scales.x = x;
											if ( options.guiSelectPoint ) options.guiSelectPoint.updateScale( 'x' );

										},

									},
									y: {

										get: function () { return scalesObject.y; },
										set: function ( y ) {

											if ( y === undefined ) {

												delete scales.y;
												delete scalesObject.y;
												scalesObject.y = new Scale( scales, 'y' );

											} else scales.y = y;
											if ( options.guiSelectPoint ) options.guiSelectPoint.updateScale( 'y' );

										},

									},
									z: {

										get: function () { return scalesObject.z; },
										set: function ( z ) {

											if ( z === undefined ) {

												delete scales.z;
												delete scalesObject.z;
												scalesObject.z = new Scale( scales, 'z' );

											} else scales.z = z;
											if ( options.guiSelectPoint ) options.guiSelectPoint.updateScale( 'z' );

										},

									},
									w: {

										get: function () { return scalesObject.w; },
										set: function ( w ) { scales.w = w; },

									},

									/* *
									 * getter
									 * <pre>
									 * setW
									 * </pre>
									 **/
									setW: {

										get: function () {

	/*
											if ( !scales.setW ) scales.setW = _this.setW;
											return scales.setW;
	*/
											return _this.setW;

										},

									},
									/* *
									 * getter and setter
									 * <pre>
									 * true - displays the label and scale of the axes.
									 * </pre>
									 **/
									display: {

										get: function () {

											if ( scales.display === undefined ) scales.display = true;
											return scales.display;

										},
										set: function ( display ) { scales.display = display; },

									},
									/* *
									 * getter and setter
									 * <pre>
									 * options of the text of the marks of AxesHelper
									 * </pre>
									 **/
									text: {

										get: function () {

											if ( scales.text === undefined ) scales.text = {};
											return scales.text;

										},
										set: function ( text ) { scales.text = text; },

									},
									/* *
									 * getter and setter
									 * <pre>
									 * Position of the axes intersection
									 * </pre>
									 **/
									posAxesIntersection: {

										get: function () { return scales.posAxesIntersection; },
										set: function ( posAxesIntersection ) { scales.posAxesIntersection = posAxesIntersection; },

									},

								} );

								//For debugging. Find a hidden keys
								for ( var propertyName in scales ) {

									if ( this[propertyName] === undefined ) console.error( 'Options: scales.' + propertyName + ' key is hidden' );

								}

							}

						}
						if ( !options.scales.boScales )
							options.scales = new Scales( options.scales );
						return options.scales;

					},
					set: function ( scales ) { options.scales = scales; }

				},

				/**
				 * getter
				 * <pre>
				 * Points сolor.
				 * See <b>options.palette</b> parameter of the <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
				 * </pre>
				 **/
				palette: {

					get: function () {

						if ( options.palette === undefined ) options.palette = true;

						switch ( typeof options.palette ) {

							case 'number':
								options.palette = new ColorPicker$1.palette( { palette: options.palette } );
								break;
							case 'boolean':
								if ( options.palette )
									options.palette = new ColorPicker$1.palette();// { palette: ColorPicker.paletteIndexes.BGYW } );
								break;
							case 'string':
								const color = new three$1.THREE.Color(options.palette);
								options.palette = new ColorPicker$1.palette( { palette: [{ percent: 0, r: color.r * 255, g: color.g * 255, b: color.b * 255, },] } );
								break;
							default: {

								//Это условие не выполняется корректро если использовать myThree.module.js или myThree.module.min.js вместо myThree.js
								//if ( options.palette instanceof ColorPicker.palette === false )
		   
								if ( Array.isArray( options.palette ) )
									options.palette = new ColorPicker$1.palette( { palette: options.palette } );//Custom palette
								else if ( !options.palette.isPalette() )
									console.error( 'MyThree: invalid typeof options.palette: ' + typeof options.palette );

							}

						}
						return options.palette;

					},

				},

				/**
				 * getter
				 * <pre>
				 * returns true if <b>options</b> was converted by <b>new Options( options );</b>
				 * </pre>
				 **/
				boOptions: {

					get: function () { return true;/*options.boOptions;*/ },

				},

				/**
				 * getter
				 * <pre>
				 * returns {
				 *
				 * 	size = 5.0; point size
				 * 	sizePointsMaterial = 100.0; The <b>size</b> property of the parameters of the [THREE.PointsMaterial]{@link https://threejs.org/docs/index.html?q=PointsMaterial#api/en/materials/PointsMaterial}.
				 *
				 * }
				 * </pre>
				 **/
				point: {

					get: function () {
						return {

							get size() { return options.point.size; },
							set size( size ) {

								if ( options.point.size === size ) return;
								options.point.size = size;
								if ( options.dat && options.dat.folderPoint ) options.dat.folderPoint.size.setValue( size );

							},

							get sizePointsMaterial() { return options.point.sizePointsMaterial; },
							set sizePointsMaterial( sizePointsMaterial ) { options.point.sizePointsMaterial = sizePointsMaterial;},

						};

					},

				},

				/**
				 * getter
				 * <pre>
				 * <b>SpriteText</b> options
				 * See <b>options</b> parameter of the <a href="../../SpriteText/jsdoc/module-SpriteText.html" target="_blank">SpriteText</a>.
				 * </pre>
				 **/
				spriteText: {

					get: function () {

						if ( options.spriteText ) return options.spriteText;
						return {};

					},

				},

				/**
				 * getter and setter
				 * [Raycaster]{@link https://threejs.org/docs/index.html#api/en/core/Raycaster}.
				 **/
				raycaster: {

					get: function () {

						if ( options.raycaster ) return options.raycaster;

					},
					set: function ( raycaster ) { options.raycaster = raycaster; }

				},

				/**
				 * getter and setter
				 * <pre>
				 * [PerspectiveCamera]{@link https://threejs.org/docs/index.html#api/en/cameras/PerspectiveCamera}.
				 * See <b>options.camera</b> parameter of the <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
				 * </pre>
				 **/
				camera: {

					get: function () {

						options.camera = options.camera || {};
						if ( !options.camera.position ) options.camera.position = new three$1.THREE.Vector3( 0.4, 0.4, 2 );
						if ( !options.camera.scale ) options.camera.scale = new three$1.THREE.Vector3( 1, 1, 1 );
						return options.camera;

					},
					set: function ( camera ) { options.camera = camera; }

				},

				/**
				 * getter
				 * <pre>
				 * Camera looking at selected point during playing. See the <b>cameraTarget</b> parameter of the <a href="../../player/jsdoc/module-Player-Player.cameraTarget.html#init" target="_blank">Player.cameraTarget.init(...)</a> function for details.
				 * See <b>options.cameraTarget</b> parameter of the <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
				 * </pre>
				 **/
				cameraTarget: {

					get: function () { return options.cameraTarget; },

				},

				/**
				 * getter
				 * <pre>
				 * The <b>HTMLElement</b>, contains a <b>canvas</b>.
				 * See <b>options.elContainer</b> parameter of the <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
				 * </pre>
				 **/
				elContainer: {

					get: function () { return options.elContainer; },

				},

				/**
				 * getter and setter
				 * <pre>
				 * true - use my <a href="../../canvasMenu/jsdoc/index.html" target="_blank">dropdown menu for canvas</a> in my version of [dat.gui]{@link https://github.com/anhr/dat.gui}.
				 * See <b>options.canvasMenu</b> parameter of the <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
				 * </pre>
				 **/
				canvasMenu: {

					get: function () { return options.canvasMenu; },
					set: function ( canvasMenu ) {

						if ( options.canvasMenu && ( options.canvasMenu !== true ) && ( options.canvasMenu !== false ) ) console.warn( 'Duplicate canvasMenu' );
						options.canvasMenu = canvasMenu;

					}

				},

				/**
				 * getter
				 * <pre>
				 * <b>canvas</b> properties.
				 * See <b>options.canvas</b> parameter of the <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
				 * </pre>
				 **/
				canvas: {

					get: function () {

						if ( options.canvas ) return options.canvas;
						return { fullScreen: true, }

					},

				},

				/**
				 * getter and setter
				 * <pre>
				 * Creates a <a href="../../frustumPoints/jsdoc/index.html" target="_blank">FrustumPoints</a> instance.
				 * See <b>options.frustumPoints</b> parameter of the <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
				 * </pre>
				 **/
				frustumPoints: {

					get: function () { return options.frustumPoints; },
					set: function ( frustumPoints ) {

						if (

							options.frustumPoints &&
							( options.frustumPoints.constructor.name === frustumPoints.constructor.name ) &&
							( options.frustumPoints.constructor.name !== 'Object' )

						)
							console.error( 'duplicate frustumPoints.' );
						options.frustumPoints = frustumPoints;

					}

				},

				/**
				 * getter and setter
				 * <pre>
				 * Use <a href="../../StereoEffect/jsdoc/index.html" target="_blank">StereoEffect</a>.
				 * See <b>options.stereoEffect</b> parameter of the <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
				 * </pre>
				 **/
				stereoEffect: {

					get: function () { return options.stereoEffect; },
					set: function ( stereoEffect ) {

						if (

							options.stereoEffect &&
							( options.stereoEffect.constructor.name === stereoEffect.constructor.name ) &&
							( options.stereoEffect.constructor.name !== 'Object' )

						)
							console.error( 'duplicate stereoEffect.' );
						options.stereoEffect = stereoEffect;

					}

				},

				/**
				 * getter and setter
				 * <pre>
				 * Use <a href="../../player/jsdoc/index.html" target="_blank">Player</a>.
				 * See <b>options.player</b> parameter of the <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
				 * </pre>
				 **/
				player: {

					get: function () { return options.player; },
					set: function ( player ) {

						if ( options.player ) console.error( 'duplicate player.' );
						options.player = player;

					}

				},

				/**
				 * getter
				 * <pre>
				 * current time of the <a href="../../player/jsdoc/index.html" target="_blank">Player</a>.
				 * </pre>
				 **/
				time: {

					get: function () {

						if ( options.player )
							return options.player.getTime();
						return 0;

					},

				},

				/**
				 * getter and setter
				 * <pre>
				 * Use <a href="../../axesHelper/jsdoc/index.html" target="_blank">AxesHelper</a>.
				 * See <b>options.axesHelper</b> parameter of the <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
				 * </pre>
				 **/
				axesHelper: {

					get: function () { return options.axesHelper; },
					set: function ( axesHelper ) {

						if ( options.axesHelper ) console.error( 'duplicate axesHelper.' );
						options.axesHelper = axesHelper;

					}

				},

				/**
				 * getter and setter
				 * <pre>
				 * Use <a href="../../canvasMenu/jsdoc/index.html" target="_blank">CanvasMenu</a>.
				 * See <b>options.canvasMenu</b> parameter of the <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
				 * </pre>
				 **/
				canvasMenu: {

					get: function () { return options.canvasMenu; },
					set: function ( canvasMenu ) {

						if ( options.canvasMenu ) console.error( 'duplicate canvasMenu.' );
						options.canvasMenu = canvasMenu;

					}

				},

				/**
				 * getter and setter
				 * <pre>
				 * Use [OrbitControls]{@link https://threejs.org/docs/index.html?q=orb#examples/en/controls/OrbitControls}.
				 * See <b>options.orbitControls</b> parameter of the <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
				 * </pre>
				 **/
				orbitControls: {

					get: function () { return options.orbitControls; },
					set: function ( orbitControls ) {

						if (

							options.orbitControls &&
							( options.orbitControls.constructor.name === orbitControls.constructor.name ) &&
							( options.orbitControls.constructor.name !== 'Object' )

						)
							console.error( 'duplicate orbitControls.' );
						options.orbitControls = orbitControls;

					}

				},

				/**
				 * getter returns 1
				 **/
				scale: {

					get: function () { return 1; },

				},

				/**
				 * getter
				 * <pre>
				 * Use <a href="../../jsdoc/pointLight/index.html" target="_blank">pointLight</a>.
				 * See <b>options.pointLight</b> parameter of the <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
				 * </pre>
				 **/
				pointLight: {

					get: function () { return options.pointLight; },

				},

				/**
				 * getter
				 * <pre>
				 * <a href="../../player/jsdoc/module-Player-Player.cameraTarget.html" target="_blank">Player.cameraTarget</a> class instance. Functions for camera for looking at selected point.
				 * </pre>
				 **/
				cameraTarget: {

					get: function () { return options.cameraTarget; },

				},

				/**
				 * getter and setter
				 * <pre>
				 * Mouse events listeners for [Raycaster]{@link https://threejs.org/docs/index.html?q=Raycaster#api/en/core/Raycaster} instance.
				 * See <a href="../../jsdoc/Options/Raycaster_EventListeners.html" target="_blank">EventListeners</a> class.
				 * </pre>
				 **/
				eventListeners: {

					get: function () {

						if ( options.eventListeners ) return options.eventListeners;
	/*если я это оставлю, то не смогу определить, используется ли raycaster на этом canvas и нужно ли вызывать addParticle
	для проверки создать MyPoints на пустом canvas
						return { addParticle: function(){

							console.error( 'Options.eventListeners.addParticle: call new Options.raycaster.EventListeners(...) first.' );
							
						}, }
	*/					

					},
					set: function ( eventListeners ) {

						if ( options.eventListeners )
							console.error( 'duplicate eventListeners.' );
						options.eventListeners = eventListeners;

					}

				},

				/**
				 * getter and setter
				 * <pre>
				 * Use <a href="../../guiSelectPoint/jsdoc/" target="_blank">GuiSelectPoint</a>.
				 * </pre>
				 **/
				guiSelectPoint: {

					get: function () { return options.guiSelectPoint; },
					set: function ( guiSelectPoint ) {

						if ( options.guiSelectPoint && ( guiSelectPoint != undefined ) )
							console.error( 'duplicate guiSelectPoint.' );
						options.guiSelectPoint = guiSelectPoint;

					}

				},

				/**
				 * getter
				 * <pre>
				 * Controllers list.
				 * User can see and edit some parameters on the web page.
				 * <b>t</b>: Object for view and edit of the current <a href="../../player/jsdoc/index.html" target="_blank">Player</a> time.
				 * 
				 *	Keys:
				 *		<b>controller</b>:
				 *			<b>HTMLElement</b> for view and edit of the current <a href="../../player/jsdoc/index.html" target="_blank">Player</a> time
				 *			or <b>string</b> of <b>HTMLElement</b> id.
				 *		<b>elName</b>:
				 *			<b>HTMLElement</b> name of the time parameter. See <b>settings.options.playerOptions.name</b> parameter of <a href="../../player/jsdoc/module-Player-Player.html" target="_blank">Player</a>
				 *			or <b>string</b> of <b>HTMLElement</b> id.
				 * </pre>
				 *
				 * See <b>options.controllers</b> parameter of <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a>.
				 * </pre>
				 **/
				controllers: {//не засунул это в options.playerOptions потому что при чтение из cockie теряется HTMLElement

					get: function () {

						class Controllers{

							/* *
							 * dat options
							 * @param {dat} dat [dat]{@link https://github.com/dataarts/dat.gui}
							 */
							constructor( controllers ) {
								controllers = controllers || {};
								Object.defineProperties( this, {

									/* *
									 * getter
									 * <pre>
									 * returns true if <b>controllers</b> was converted by <b>new Controllers( controllers );</b>
									 * </pre>
									 **/
									boControllers: {

										get: function () { return true; },

									},

									/* *
									 * getter
									 * <pre>
									 * Object for view and edit of the current <a href="../../player/jsdoc/index.html" target="_blank">Player</a> time.
									 * Keys:
									 *	<b>controller</b>:
									 *		<b>HTMLElement</b> for view and edit of the current <a href="../../player/jsdoc/index.html" target="_blank">Player</a> time
									 *		or <b>string</b> of <b>HTMLElement</b> id.
									 *	<b>elName</b>:
									 *		<b>HTMLElement</b> name of the time parameter. See <b>settings.options.playerOptions.name</b> parameter of <a href="../../player/jsdoc/module-Player-Player.html" target="_blank">Player</a>
									 *		or <b>string</b> of <b>HTMLElement</b> id.
									 * </pre>
									 **/
									t: {

										get: function () {

											if ( controllers.t === null )
												console.error( 'options.controllers.t = ' + controllers.t );
											const elTime = document.getElementById( 'time' );
											if ( !controllers.t ) {

												if ( !elTime ) return;
												controllers.t = { elName: document.getElementById( 'tName' ), };

											}
											if ( !controllers.t.controller && elTime ) controllers.t.controller = elTime;
											if ( controllers.t ) {

												createController( controllers.t, 't',
													function () { return  options.playerOptions && options.playerOptions.name ? options.playerOptions.name : 't'; }, {

													onchange: function ( event ) {

														if ( !options.player ) {

															console.error( 'options.controllers.t.onchange: create Player instance first. ' + controllers.t.value );
															return;

														}
														if ( options.player.setTime( controllers.t.controller.value ) === false ) {

															alert( lang.timeAlert + controllers.t.controller.value );
															controllers.t.controller.focus();

														}

													},

												} );
												if ( ( typeof lang !== 'undefined' ) && ( controllers.t.controller.title === '' ) )
													controllers.t.controller.title = lang.controllerTTitle;
													
											}
											return controllers.t;

										},

									},

									/* *
									 * getter
									 * <pre>
									 * List of <a href="../../player/jsdoc/index.html" target="_blank">Player</a> buttons on the web page.
									 * Keys:
									 *	<b>buttonPrew</b>:
									 *		<b>HTMLElement</b> Previous players tick.
									 *		or <b>string</b> of <b>HTMLElement</b> id.
									 *	<b>buttonPlay</b>:
									 *		<b>HTMLElement</b> play or pause.
									 *		or <b>string</b> of <b>HTMLElement</b> id.
									 *	<b>buttonNext</b>:
									 *		<b>HTMLElement</b> Next players tick.
									 *		or <b>string</b> of <b>HTMLElement</b> id.
									 * </pre>
									 **/
									player: {

										get: function () { return controllers.player; },

									},

								} );

								//For debugging. Find a hidden keys
								for ( var propertyName in controllers ) {

									if ( this[propertyName] === undefined ) console.error( 'Controllers: controllers.' + propertyName + ' key is hidden' );

								}

							}

						}
						if ( boCreateControllers === undefined ) {

							boCreateControllers = true;
							const time = document.getElementById( 'time' ),
								prev = document.getElementById( 'prev' ),
								play = document.getElementById( 'play' ),
								next = document.getElementById( 'next' ),
								boPlayer = prev || play || next ? true : false,
								boControllers = time || boPlayer ? true : false;
							if ( !options.controllers && boControllers ) {

								options.controllers = { t: {} };
								if ( time ) options.controllers.t.controller = time;

							}
							if ( options.controllers ) {

								if ( !options.controllers.player && boPlayer ) options.controllers.player = {};
								if ( options.controllers.player ) {

									if ( !options.controllers.player.buttonPrev && prev ) options.controllers.player.buttonPrev = prev;
									if ( !options.controllers.player.buttonPlay && play ) options.controllers.player.buttonPlay = play;
									if ( !options.controllers.player.buttonNext && next ) options.controllers.player.buttonNext = next;

								}

							}

						}
						if ( options.controllers && !options.controllers.boControllers )
							options.controllers = new Controllers( options.controllers );
						return options.controllers;

					},

				},

				/**
				 * getter
				 * <pre>
				 * title
				 * </pre>
				 **/
				title: {

					get: function () { return options.title; }

				},

				/**
				 * getter and setter
				 * <pre>
				 * traces
				 * </pre>
				 **/
				traces: {

					get: () => { return options.traces; },
					set: ( traces ) => { options.traces = traces; }

				},

			} ); 

			//For debugging. Find a hidden keys
			for( var propertyName in options ) {

			   if ( this[propertyName] === undefined ) console.error( 'Options: options.' + propertyName + ' key is hidden' );

			}
			this.playerOptions.cameraTarget.init( this.cameraTarget, this, false );

			//Localization

			lang = {

				timeAlert: 'Invalid time fromat: ',
				controllerTTitle: 'Current time.',

			};
			switch ( this.getLanguageCode() ) {

				case 'ru'://Russian language

					lang.timeAlert = 'Неправильный формат времени: ';
					lang.controllerTTitle = 'Текущее время.';

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

			if ( !three$1.options ) three$1.options = this;

		}

	} 

	/**
	 * Finds on the [Scene]{@link https://threejs.org/docs/index.html?q=Scene#api/en/scenes/Scene} a child item of the "Sprite" type and "spriteTextIntersection" name.
	 * @param {THREE.Scene} scene [Scene]{@link https://threejs.org/docs/index.html?q=Scene#api/en/scenes/Scene} instance.
	 * @returns item of the "Sprite" type and "spriteTextIntersection" name or undefined.
	 */
	Options.findSpriteTextIntersection = function ( scene ) {

		var spriteTextIntersection;
		scene.children.forEach( function ( item ) {

			if ( ( item.type === "Sprite" ) && ( item.name === Options.findSpriteTextIntersection.spriteTextIntersectionName ) ) {

				spriteTextIntersection = item;
				return;

			}

		} );
		return spriteTextIntersection;

	};
	/**
	 * @returns "spriteTextIntersection"
	 * */
	Options.findSpriteTextIntersection.spriteTextIntersectionName = 'spriteTextIntersection';

	class Raycaster {

		/**
		 * [Raycaster]{@link https://threejs.org/docs/index.html#api/en/core/Raycaster} methods.
		 * */
		constructor() {

			var cursor;
			/**
			 * @description Displays a sprite text if you move mouse over an 3D object
			 * @param {Object} intersection See [.intersectObject]{@link https://threejs.org/docs/index.html#api/en/core/Raycaster.intersectObject} for details.
			 * @param {Options} options the following options are available.
			 * See the <b>options</b> parameter of the <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
			 * @param {object} [options.spriteText] spriteText options. See <a href="../../SpriteText/jsdoc/module-SpriteText.html" target="_blank">SpriteText</a> <b>options</b> parameter for details.
			 * @param {object} [options.scales] axes scales.
			 * See <b>options.scales</b> parameter of the <a href="../../AxesHelper/jsdoc/module-AxesHelper-AxesHelper.html" target="_blank">AxesHelper</a> class for details.
			 * @param {THREE.Scene} scene [Scene]{@link https://threejs.org/docs/index.html?q=sc#api/en/scenes/Scene}.
			 * @param {THREE.Camera} camera [PerspectiveCamera]{@link https://threejs.org/docs/index.html?q=persp#api/en/cameras/PerspectiveCamera}.
			 * @param {THREE.WebGLRenderer} renderer [WebGLRenderer]{@link https://threejs.org/docs/index.html?q=WebGLRenderer#api/en/renderers/WebGLRenderer} instance.
			 */
			this.onIntersection = function ( intersection, options, scene, camera, renderer ) {

				//во вселенной запретить выводить сообщение об ошибке, когда пользователь проводит мышку над вершиной.
				if ( intersection.object.userData.myObject ) intersection.object.userData.myObject.guiPoints.boMouseOver = true;
				
				const drawRange = intersection.object.geometry.drawRange;
				if ((intersection.index < drawRange.start) || ((drawRange.count != Infinity) && (intersection.index >= (drawRange.start + drawRange.count)))) return false;
				const canvas = renderer.domElement;
				if ( intersection.object.userData.isInfo !== undefined && !intersection.object.userData.isInfo() )
					return false;
				var spriteTextIntersection = Options.findSpriteTextIntersection( scene );
				if ( spriteTextIntersection && ( !intersection.pointSpriteText || ( intersection.object.userData.raycaster && intersection.object.userData.raycaster.text ) ) ) {
					
					scene.remove( spriteTextIntersection );
					spriteTextIntersection = undefined;

				}
				if ( spriteTextIntersection === undefined ) {

					options = new Options( options );
					const rect = options.spriteText.rect ? JSON.parse( JSON.stringify( options.spriteText.rect ) ) : {};
					rect.displayRect = true;
					rect.backgroundColor = 'rgba(0, 0, 0, 1)';
					spriteTextIntersection = StereoEffect.getTextIntersection( intersection, {

						scales: options.scales,
						spriteOptions: {

							textHeight: options.spriteText.textHeight,
							fontColor: options.spriteText.fontColor,
							rect: rect,
							group: scene,
							center: {

								camera: camera,
								canvas: canvas,

							}

						}

					} );
					spriteTextIntersection.scale.divide( scene.scale );
					scene.add( spriteTextIntersection );
					
					if ( cursor === undefined ) cursor = renderer.domElement.style.cursor;
					renderer.domElement.style.cursor = 'pointer';

				} else if ( intersection.pointSpriteText ) spriteTextIntersection.position.copy( intersection.pointSpriteText );
				return true;

			};

			/**
			 * @description Hides a sprite text if you move mouse out an object.
			 * @param {THREE.Scene} scene [Scene]{@link https://threejs.org/docs/index.html?q=sc#api/en/scenes/Scene}.
			 * @param {THREE.WebGLRenderer} renderer [WebGLRenderer]{@link https://threejs.org/docs/index.html?q=WebGLRenderer#api/en/renderers/WebGLRenderer} instance.
			 */
			this.onIntersectionOut = function ( scene, renderer ) {

				var detected = false;
				do {

					var spriteTextIntersection = Options.findSpriteTextIntersection( scene );
					if ( spriteTextIntersection !== undefined ) {

						scene.remove( spriteTextIntersection );
						if ( detected )
							console.error( 'Duplicate spriteTextIntersection' );
						detected = true;

					}

				} while ( spriteTextIntersection !== undefined )

				//во вселенной разрешить выводить сообщение об ошибке, когда пользователь проводит мышку над вершиной.
				intersectedObjects.forEach( ( intersectedObject ) => { if ( intersectedObject.object.userData.myObject )delete intersectedObject.object.userData.myObject.guiPoints.boMouseOver; } );			renderer.domElement.style.cursor = cursor;

			};
			/**
			 * @description The [pointerdown]{@link https://developer.mozilla.org/en-US/docs/Web/API/Document/pointerdown_event}
			 * event is fired when a pointer becomes active. For mouse, it is fired when the device transitions from no buttons depressed to at least one button depressed. For touch, it is fired when physical contact is made with the digitizer. For pen, it is fired when the stylus makes physical contact with the digitizer.
			 * @param {Object} intersection See [.intersectObject]{@link https://threejs.org/docs/index.html#api/en/core/Raycaster.intersectObject} for details.
			 * @param {Options} options the following options are available.
			 * @param {GuiSelectPoint} [options.guiSelectPoint] <a href="../../guiSelectPoint/jsdoc/index.html" target="_blank">GuiSelectPoint</a> instance was created.
			 * @param {AxesHelper} [options.axesHelper] <a href="../../AxesHelper/jsdoc/index.html" target="_blank">AxesHelper</a> instance was created.
			 */
			this.onMouseDown = function ( intersection, options ) {

				if ( ( intersection.object.userData.isInfo !== undefined ) && !intersection.object.userData.isInfo() )
					return;//No display information about frustum point
				if ( options.guiSelectPoint && intersection.object.userData.myObject) {
					
	//				intersection.object.userData.myObject.guiPoints.verticeId = intersection.index;
					const guiPoints = intersection.object.userData.myObject.guiPoints, searchNearestEdgeVerticeId = guiPoints.searchNearestEdgeVerticeId;
					guiPoints.verticeId = searchNearestEdgeVerticeId ? searchNearestEdgeVerticeId(intersection.index, intersection) : intersection.index;

					//Заменить индекс ребра на индекс ближайшего конца ребра в гиперсфере
					//Если убрать эту строку, то неправильно отображается гиперсфера если с помощью мыши выбрать ребро
					//Для теста открыть http://localhost/anhr/commonNodeJS/master/HyperSphere/Examples/hyperSphere.html
					//Отобразить ребра
					//Щелкнуть мышом по ребру
					if ( ( guiPoints.isSetIntersectionIndex != false ) && ( guiPoints.verticeId != undefined ) ) intersection.index = guiPoints.verticeId;
					
					options.guiSelectPoint.select( intersection );

					//если не удалить guiPoints.verticeId, то будет неверно изменяться позиция вершины во вселенной
					//Для проверки открыть http://localhost/anhr/universe/main/hyperSphere/Examples/
					//Щелчком мыши выбрать вершину
					//Сделать один шаг проигрывателя, нажав →
					delete guiPoints.verticeId;
					
				} else {

					if ( intersection.object.userData.onMouseDown ) intersection.object.userData.onMouseDown( intersection );
					if ( options.axesHelper ) options.axesHelper.exposePosition( intersection );

				}

			};
			const intersectedObjects = [];
			var intersects;
			/**
			 * @description Intersection of the mouse pointer in or out of a 3D object.
			 * @param {Array} particles array of [Mechs]{@link https://threejs.org/docs/index.html#api/en/objects/Mesh} or derived class objects to check for intersection with the ray.
			 * See <a href="../../jsdoc/Options/Raycaster_EventListeners.html#addParticle" target="_blank">addParticle</a>.
			 * @param {THREE.Raycaster} raycaster [Raycaster]{@link https://threejs.org/docs/index.html?q=Ray#api/en/core/Raycaster}
			 * @param {THREE.WebGLRenderer} renderer [WebGLRenderer]{@link https://threejs.org/docs/index.html?q=Renderer#api/en/renderers/WebGLRenderer}
			 * @param {THREE.Vector2} mouse mouse position.
			 * @param {Object} [settings={}] the following settings are available
			 * @param {Options} [settings.options={}] <b>Options</b> instance
			 * @param {THREE.Camera} settings.camera [PerspectiveCamera]{@link https://threejs.org/docs/index.html?q=persp#api/en/cameras/PerspectiveCamera} instance
			 * @param {THREE.Scene} settings.scene [Scene]{@link https://threejs.org/docs/index.html?q=scene#api/en/scenes/Scene} instance.
			 * @returns Array of interseted with ray 3D objects. 
			 * See [intersectObjects]{@link https://threejs.org/docs/index.html?q=raycaster#api/en/core/Raycaster.intersectObjects}
			 * and [intersectObject]{@link https://threejs.org/docs/index.html?q=raycaster#api/en/core/Raycaster.intersectObject}.
			 */
			this.intersectionsInOut = function ( particles, raycaster, renderer, mouse, settings = {} ) {

				function getIntersects() {

					if ( particles === undefined )
						return;
					intersects = Array.isArray( particles ) ? raycaster.intersectObjects( particles ) : raycaster.intersectObject( particles );

				}
				getIntersects();
	//			intersects.forEach( function ( intersection )
				for (let i = 0; i < intersects.length; i++){

					const intersection = intersects[i];
					
					//Когда создаем SpriteText с информацией об объекте, на которую наведена мышка,
					//иногда этот текст загораживается объектами, которые расположены ближе к камере
					//Для решения проблемы текст надо перенести ближе к камере
					const three = window.__myThree__.three;
					intersection.pointSpriteText = new three.THREE.Vector3();
					//Так и не понял почему в режиме стерео текст отображается в неправильном месте
					if ( settings.options.stereoEffect && ( settings.options.stereoEffect.settings.spatialMultiplex === StereoEffect.spatialMultiplexsIndexs.Mono ) )
						raycaster.ray.at( three.options.camera.near + (three.options.camera.far - three.options.camera.near)/1000, intersection.pointSpriteText );
					//Поэтому оставляю как было раньше
					else intersection.pointSpriteText = intersection.point;

					var boDetected = false;
					intersectedObjects.forEach( function ( intersectedObject ) {

						if ( intersectedObject.object === intersection.object ) {

							boDetected = true;
							return;

						}

					} );
					if ( !boDetected ) {

						intersectedObjects.push( intersection );

					}
					if (
						intersection &&
						intersection.object.userData.raycaster &&
						intersection.object.userData.raycaster.onIntersection
					) 
					intersection.object.userData.raycaster.onIntersection( intersection, mouse );
					else {

						if ( !settings.scene )
							console.error( 'THREE.Raycaster.setStereoEffect(): settings.scene = ' + settings.scene );
						else if (Options.raycaster.onIntersection( intersection, settings.options, settings.scene, settings.camera, renderer )) return;

					}

				}
				intersectedObjects.forEach( function ( intersectedObject ) {

					var boDetected = false;
					intersects.forEach( function ( intersection ) {

						if ( intersectedObject.object === intersection.object )
							boDetected = true;

					} );
					if ( !boDetected ) {

						if (
							intersectedObject.object.userData.raycaster &&
							intersectedObject.object.userData.raycaster.onIntersectionOut
						)
							intersectedObject.object.userData.raycaster.onIntersectionOut();
						else if ( settings.scene ) Options.raycaster.onIntersectionOut( settings.scene, renderer );

						intersectedObjects.splice( intersectedObjects.findIndex( v => v === intersectedObject ), 1 );

					}

				} );
				return intersects;

			};

			/**
			 * @class
			 */
			this.EventListeners = class {

				/**
				 * Create a mouse events listeners for [Raycaster]{@link https://threejs.org/docs/index.html#api/en/core/Raycaster} instance.
				 * <p>
				 * The following events are listening.
				 *	<ul>
				 *		<li><b>mousemove</b>. Is fired at an element when a pointing device (usually a mouse) is moved while the cursor's hotspot is inside it.
				 *			See [Element: mousemove event]{@link https://developer.mozilla.org/en-US/docs/Web/API/Element/mousemove_event}. </li>
				 *		<li><b>pointerdown</b>. Is fired when a pointer becomes active. For mouse, it is fired when the device transitions from no buttons depressed to at least one button depressed. For touch, it is fired when physical contact is made with the digitizer. For pen, it is fired when the stylus makes physical contact with the digitizer.
				 *			See [Document: pointerdown event]{@link https://developer.mozilla.org/en-US/docs/Web/API/Document/pointerdown_event}. </li>
				 *	</ul>
				 * </p>
				 * <p>
				 * You can customize your 3D object for following events by add <b>raycaster</b> property into [Object3D.userData]{@link https://threejs.org/docs/index.html?q=mes#api/en/core/Object3D.userData}.
				 *	<ul>
				 *		<li><b>onIntersection</b>. Callback function that take as input the [intersectObject]{@link https://threejs.org/docs/index.html#api/en/core/Raycaster.intersectObject}, and <b>mouse position</b>.
				 *			Fires after intersection of the mouse pointer with a 3D object. </li>
				 *		<li><b>onIntersectionOut</b>. Callback function.
				 *			Fires if mouse pointer leaves of intersection with the 3D object.</li>
				 *		<li><b>onMouseDown</b>. Callback function that take as input the [intersectObject]{@link https://threejs.org/docs/index.html#api/en/core/Raycaster.intersectObject}.
				 *			User has clicked over 3D object.</li>
				 *	</ul>
				 * </p>
				 * <pre>
				 * Example:<b>
	cube.userData.raycaster = {

		onIntersection: function ( intersection, mouse ) {

			if ( cube.userData.currentHex === undefined )
				cube.userData.currentHex = cube.material.emissive.getHex();
			cube.material.emissive.setHex( 0xff0000 );
			Options.raycaster.onIntersection( intersection, options, group, camera, renderer );

		},
		onIntersectionOut: function () {

			if ( cube.userData.currentHex !== undefined )
				cube.material.emissive.setHex( cube.userData.currentHex );
			cube.userData.currentHex = undefined;
			Options.raycaster.onIntersectionOut( group, renderer );

		},
		onMouseDown: function ( intersection ) {

			alert( 'Clicked over cube.' );

		},

	}
				 * </b></pre>
				 * @param {THREE.Camera} camera [PerspectiveCamera]{@link https://threejs.org/docs/index.html?q=persp#api/en/cameras/PerspectiveCamera} instance
				 * @param {THREE.WebGLRenderer} renderer [WebGLRenderer]{@link https://threejs.org/docs/index.html#api/en/renderers/WebGLRenderer} instance
				 * @param {Object} [settings={}] the following settings are available
				 * @param {Options} [settings.options={}] <b>Options</b> instance
				 * @param {number} [settings.threshold=0.03] Precision of the raycaster when intersecting objects, in world units.
				 * See [Raycaster.params]{@link https://threejs.org/docs/#api/en/core/Raycaster.params}.
				 */
				constructor( camera, renderer, settings = {} ) {

					var intersectedObject;//, intersects;
					const THREE = three$1.THREE, mouse = new THREE.Vector2(), particles = [],
						raycaster = new THREE.Raycaster(), options = settings.options || {};
					raycaster.params.Points.threshold = settings.threshold !== undefined ? settings.threshold : 0.03;
					raycaster.params.Line.threshold = raycaster.params.Points.threshold;

					if ( raycaster.setStereoEffect ) {

						//the precision of the raycaster when intersecting objects, in world units.
						//See https://threejs.org/docs/#api/en/core/Raycaster.params.

						raycaster.setStereoEffect( {

							options: settings.options,
							renderer: renderer,
							camera: camera,
							scene: settings.scene,
							stereoEffect: options.stereoEffect,
							raycasterEvents: false,

						} );

					}

					const domElement = options.renderer ? options.renderer.domElement : window;
					
					//Is fired at an element when a pointing device (usually a mouse) is moved while the cursor's hotspot is inside it.
					//See https://developer.mozilla.org/en-US/docs/Web/API/Element/mousemove_event
					domElement.addEventListener( 'mousemove', function ( event ) {

						if ( raycaster.stereo !== undefined ) {

							raycaster.stereo.onDocumentMouseMove( event );
							return;

						}

						Options.raycaster.EventListeners.getRendererSize( renderer ).getMousePosition( mouse, event );

						//Raycaster https://threejs.org/docs/index.html#api/en/core/Raycaster

						// update the picking ray with the camera and mouse position
						raycaster.setFromCamera( mouse, camera );
						// calculate objects intersecting the picking ray
						intersects = raycaster.intersectObjects( particles );
						if ( !intersects )
							return;
						if ( intersects.length === 0 ) {

							if ( intersectedObject ) {

								if ( intersectedObject.userData.raycaster && intersectedObject.userData.raycaster.onIntersectionOut )
									intersectedObject.userData.raycaster.onIntersectionOut();
								else Options.raycaster.onIntersectionOut( settings.scene, renderer );
								intersectedObject = undefined;

							}

						} else {

							const intersect = intersects[0], object = intersect.object;
							if ( object.userData.raycaster && object.userData.raycaster.onIntersection ) object.userData.raycaster.onIntersection( intersect, mouse );
							else Options.raycaster.onIntersection( intersect, options, settings.scene, camera, renderer );
							intersectedObject = object;

						}

					}, false );

					//ATTENTION!!! The 'mousedown' event is not fired you use new version of the OrbitControls.
					//See "OrbitControls: Implement Pointer events." commit https://github.com/mrdoob/three.js/commit/1422e36e9facbdc5f9d86cf6b97b005a2723a24a#diff-3285de3826a51619836a5c9adc6bee74
					//window.addEventListener( 'mousedown', function( event )
					//is fired when a pointer becomes active. For mouse, it is fired when the device transitions from no buttons depressed to at least one button depressed. For touch, it is fired when physical contact is made with the digitizer. For pen, it is fired when the stylus makes physical contact with the digitizer.
					//See https://developer.mozilla.org/en-US/docs/Web/API/Document/pointerdown_event
					domElement.addEventListener( 'pointerdown', function ( event ) {

						if ( raycaster === undefined )
							return;
						if ( intersects && ( intersects.length > 0 ) ) {

							const intersect = intersects[0];
							if ( intersect.object.userData.raycaster && intersect.object.userData.raycaster.onMouseDown )
								intersect.object.userData.raycaster.onMouseDown( intersect, event );//передаем состояние кнопок мыши
							else Options.raycaster.onMouseDown( intersect, options );

						}

					}, false );
					function isAddedToParticles( particle ) { return particles.includes( particle ); }				/**
					 * Adds new particle into array of objects to check for intersection with the ray.
					 * @see <b>objects</b> parameter of the [Raycaster.intersectObjects]{@link https://threejs.org/docs/index.html#api/en/core/Raycaster.intersectObjects} for details.
					 * @param {THREE.Mesh} particle The [Mech]{@link https://threejs.org/docs/index.html#api/en/objects/Mesh} or derived class instance for check for intersection with the ray.
					 */
					this.addParticle = function ( particle ) {

						if ( particle.userData.boFrustumPoints )
							return;
						if ( raycaster.stereo ) {

							raycaster.stereo.addParticle( particle );
							return;

						}
						if ( isAddedToParticles( particle ) ) {

							console.error( 'Duplicate particle "' + particle.name + '"' );
							return;

						}
						particles.push( particle );

					};
					/**
					 * Removes particle from array of objects to check for intersection with the ray.
					 * @see <b>objects</b> parameter of the [Raycaster.intersectObjects]{@link https://threejs.org/docs/index.html#api/en/core/Raycaster.intersectObjects} for details.
					 * @param {THREE.Mesh} particle The [Mech]{@link https://threejs.org/docs/index.html#api/en/objects/Mesh} for removing.
					 */
					this.removeParticle = function ( particle ) {

						if ( particle.userData.boFrustumPoints )
							return;
						if ( raycaster.stereo ) {

							raycaster.stereo.removeParticle( particle );
							return;

						}
						const index = particles.indexOf( particle );
						if ( index === -1 ) return;
						particles.splice( index, 1 );

					};

				}

				/**
				 * Convert mouse position to renderer coordinates.
				 * @param {THREE.WebGLRenderer} renderer [WebGLRenderer]{@link https://threejs.org/docs/index.html#api/en/renderers/WebGLRenderer}
				 * @param {HTMLElement} [el] parent of the <b>canvas</b>.
				 * @returns <pre>
				 * {
				 *
				 *	getMousePosition:function
				 *
				 * }
				 * </pre>
				 */
				static getRendererSize( renderer, el ) {

					el = el || renderer.domElement;
					({

						position: el.style.position,
						left: el.style.left,
						top: el.style.top,
						width: el.style.width,
						height: el.style.height,

					});
						const rect = el.getBoundingClientRect(),
						left = Math.round( rect.left ),
						top = Math.round( rect.top ),
						size = new three$1.THREE.Vector2();
					renderer.getSize( size );
					return {

						getMousePosition: function ( mouse, event ) {

							mouse.x = ( event.clientX / size.x ) * 2 - 1 - ( left / size.x ) * 2;
							mouse.y = - ( event.clientY / size.y ) * 2 + 1 + ( top / size.y ) * 2;

						},

					};

				}

			};

		}

	}
	/**@namespace
	 * @description [Raycaster]{@link https://threejs.org/docs/index.html#api/en/core/Raycaster} methods.
	 * @See <a href="./Raycaster.html" target="_blank">Raycaster</a> for details.
	 * */
	Options.raycaster = new Raycaster();

	var Options$1 = Options;

	/**
	* @module Matrix
	* @description A matrix (plural matrices) is a rectangular array or table of numbers, arranged in rows and columns, which is used to represent a mathematical object or a property of such an object.
	* @see [Matrix (mathematics)]{@link https://en.wikipedia.org/wiki/Matrix_(mathematics)}
	* @author [Andrej Hristoliubov]{@link https://github.com/anhr}
	*
	* @copyright 2011 Data Arts Team, Google Creative Lab
	*
	* @license under the Apache License, Version 2.0 (the "License");
	* you may not use this file except in compliance with the License.
	* You may obtain a copy of the License at
	*
	* http://www.apache.org/licenses/LICENSE-2.0
	* 
	* */

	class Matrix {

		/** @class
		 * A matrix (plural matrices) is a rectangular array or table of numbers, arranged in rows and columns, which is used to represent a mathematical object or a property of such an object.
		 * @see [Matrix (mathematics)]{@link https://en.wikipedia.org/wiki/Matrix_(mathematics)}
		 * @param {Array} a 2-dimensional array that initializes the matrix.
		 * @example
		 * const matrix = new Matrix( [[1, 2],[3, 4]] );
		 * */
		constructor( a ) {

			/**
			* Multiplies this matrix by another matrix
			* @param {Matrix|Array} b multiplication matrix or 2-dimensional array that is the matrix or 1-dimensional array that is the vector.
			* @returns new matrix as result of multiplication of matrices.
			* @see [Matrix multiplication]{@link https://en.wikipedia.org/wiki/Matrix_multiplication}
			* @example
			* const matrix = new Matrix( [[1, 2], [3, 4], [5, 6]] );
			* const res = matrix.multiply( [[7, 8, 9, 10], [11, 12, 13,14] );
			* res is : [[29, 32, 35, 38], [65, 72, 79, 86], [101, 112, 123, 134]]
			*/
			this.multiply = function ( b ) { };//Эту функцию засунул что бы построить jsdoc
			/**
			 * calls a function for each row in the matrix.
			 * @see [JavaScript Array forEach()]{@link https://www.w3schools.com/jsref/jsref_foreach.asp}
			 * */
			this.forEach = function () { };//Эту функцию засунул что бы построить jsdoc

			/**
			 * returns the number of rows in the matrix.
			 * */
			this.length;//Эту переменную засунул что бы построить jsdoc
			return new Proxy( a, {

				get: function ( target, name ) {

					const i = parseInt( name );
					if ( !isNaN( i ) ) {

						return target[i];

					}
					switch ( name ) {

						//case "isMatrix": return true;
						case "length": return target.length;
						case 'forEach': return target.forEach;
						case "multiply":
							return function ( b ) {

								const c = [],//multiply matrix
									l = a.length,//количество строк a
									m = a[0].length,//количество столбцов a равно количество строк b
									n = Array.isArray( b[0] ) ? b[0].length : 1;//количество столбцов b
								if ( m !== b.length ) {

									console.error('Matrix: Dimension mismatch in multiplication. Matrix A columns (' + m + ') must match Matrix B rows (' + b.length + ')');
									return;
									
								}
								for ( var i = 0; i < l; i++ ) {

									if ( n === 1 ) {

										//b is vector
										var s = 0;
										for ( var k = 0; k < m; k++ ) s = s + a[i][k] * b[k];
										c[i] = s;
										
									} else for ( var j = 0; j < n; j++ ) {

										//b is matrix
										var s = 0;
										for ( var k = 0; k < m; k++ ) s = s + a[i][k] * b[k][j];
										c[i] = c[i] || [];
										c[i][j] = s;
										
									}
									
								}
	/*
								if ( !Array.isArray( b[0] ) ){

									//b is vector
									const t = [];
									b.forEach( item => t.push( [item] ) )
									b = t;
									
								}
								const c = [],//multiply matrix
									l = a.length,//количество строк a
									m = a[0].length;//количество столбцов a равно количество строк b
								var n;
								n = b[0].length;//количество столбцов b
								if ( m !== b.length ) {

									console.error('Matrix: Dimension mismatch in multiplication. Matrix A columns (' + m + ') must match Matrix B rows (' + b.length + ')');
									return;
									
								}
								for ( var i = 0; i < l; i++ ) {

									for ( var j = 0; j < n; j++ ) {

										var s = 0;
										for ( var k = 0; k < m; k++ ) s = s + a[i][k] * b[k][j]
										c[i] = c[i] || [];
										c[i][j] = s;
										
									}
									
								}
	*/
								return new Matrix( c );

							}
						default: console.error( 'Matrix: Invalid name: ' + name );

					}

				},
				set: function ( target, name, value ) {

					target[i] = value;
					return true;

				}

			} );

		}

	}
	new Proxy( [], {

		get: function ( target, name, args ) {

			const i = parseInt( name );
			if ( !isNaN( i ) ) {

				return [target[i]];

			}
			switch ( name ) {

	/*
				case 'push': return target.push;
				case 'length': return target.length;
				case 'forEach': return target.forEach;
				case 'isProxy': return true;
				case 'boPositionError': return target.boPositionError;
				case 'target': return target;
				case "reset":
					return function () {

						target.forEach( item => item.positionWorld = undefined );

					}
	*/
				case "multiply":
					return function ( i ) {

						const v = [];
						return v;

					}
				default: console.error( 'Matrix: Invalid name: ' + name );

			}

		},
		set: function ( target, name, value ) {

			target[name] = value;
			return true;

		},

	} );

	/**
	 * @module MyMath
	 * @description Math library.
	 * @author [Andrej Hristoliubov]{@link https://github.com/anhr}
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

	const MyMath = { Matrix: Matrix, };

	/**
	 * @module myObject
	 * @description Base class for my threejs objects.
	 * @author [Andrej Hristoliubov]{@link https://github.com/anhr}
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

	const sMyObject = 'MyObject';

	/**
	 * @class Base class for my threejs objects.
	 * <pre>
	 * Examples of child classes:
	 *   <a href="../../getShaderMaterialPoints/jsdoc/module-getShaderMaterialPoints-getShaderMaterialPoints.html" target="_blank">getShaderMaterialPoints</a>,
	 *   <a href="../../HyperSphere/jsdoc/module-HyperSphere-HyperSphere.html" target="_blank">HyperSphere</a>,
	 *   <a href="../../myPoints/jsdoc/module-MyPoints-MyPoints.html" target="_blank">MyPoints</a>,
	 *   <a href="../../nD/jsdoc/module-ND-ND.html" target="_blank">ND</a>.
	 * </pre>
	 */
	class MyObject {

		/**
		 * 
		 * @param {object} settings See child class (<a href="../../nD/jsdoc/module-ND-ND.html" target="_blank">ND</a>, <a href="../../myPoints/jsdoc/module-MyPoints-MyPoints.html" target="_blank">MyPoints</a>) <b>settings.
		 * @param {any} vertices
		 */
		constructor(settings={}, vertices) {

			const _this = this;

			//иммитация наследования классов
			//settings.overriddenProperties ||= {};uncompatible with myThree.js → ./build/myThree.js, ./ build / myThree.module.js...
			if (!settings.overriddenProperties) settings.overriddenProperties = {};
			//settings.overriddenProperties.setDrawRange ||= (start, count) => { }uncompatible with myThree.js → ./build/myThree.js, ./ build / myThree.module.js...
			if (!settings.overriddenProperties.setDrawRange) settings.overriddenProperties.setDrawRange = (start, count) => { };
			settings.overriddenProperties.getPlayerTimesLength = () => { return 1; };
			if (!settings.overriddenProperties.positionOffsetId) settings.overriddenProperties.positionOffsetId = (positionId) => { return positionId; };
			
			if (settings.guiPoints) this.guiPoints = settings.guiPoints;

			settings.object = settings.object || {};
			settings.object.geometry = settings.object.geometry || {};

			this.isSetPosition = settings.isSetPosition;

			const timeId = settings.options ? settings.options.player.getTimeId() : 0, geometry = settings.object.geometry,
				geometryPosition = geometry.position;
			if ((timeId === 0) && (!geometryPosition || !geometryPosition.isPositionProxy)) {

				geometry.position = new Proxy(geometryPosition || [], {
		
					get: (positions, name) => {
						
						const positionId = parseInt(name);
						if (!isNaN(positionId)) {
							
							return new Proxy(positions[positionId], {
		
								set: (position, name, value) => {
		
									const axisId = parseInt(name);
									if (!isNaN(axisId)) {
		
										position[axisId] = value;
										settings.bufferGeometry.userData.position[positionId][axisId] = value;
										return true;
										
									}
									position[name] = value;
									return true;
									
								}
								
							});
		
						
						}
						switch (name) {
		
							case 'isPositionProxy': return true;
		
						}
						return positions[name];
						
					},
					
				});

			}
		
			const THREE = three$1.THREE;

			if (!settings.bufferGeometry) {
				
				settings.bufferGeometry = new THREE.BufferGeometry();
				Object.defineProperty(settings.bufferGeometry.userData, 'timeId', {

					get: () => { return 0; },
					set: (timeIdNew) => { },//ignore timeIdNew
					configurable: true,//https://stackoverflow.com/a/25518045/5175935

				});
				
			}
			/**
			 * [BufferGeometry]{@link https://threejs.org/docs/index.html?q=BufferGeometry#api/en/core/BufferGeometry} of the child graphical object.
			 */
			this.bufferGeometry = settings.bufferGeometry;

			if (vertices)
				//for for compatibility with ND
				//Что бы можно было менять позицию и цвет вершины
				if (!settings.object.geometry.position) settings.object.geometry.position = vertices;
			
			//Эту строку нельзя использовать потому что во вселенной будет ошибка
			//TypeError: classSettings.overriddenProperties.position0.angles[verticeId].middleVertice is not a function
			//если:
			//Открыть http://localhost/anhr/universe/main/hyperSphere/Examples/ что бы не было видно ребер classSettings.edges.project = true
			//Сделать один шаг проигрывателя: нажать →
			//Сделать ребра невидимыми: Поставить галочку Гиперсфера\Ребро\Отображать.
			//Сделать один шаг проигрывателя: нажать →
			//Это происходить потому что когда проигрыватель находится не в начальном положении timeId > 0, то в settings.object.geometry.position попадают вершины не из начального времени
			//			settings.object.geometry.position = settings.object.geometry.position || vertices;

			/**
			 * Determines the part of the child graphical object geometry to render. See [BufferGeometry.drawRange]{@link https://threejs.org/docs/index.html?q=BufferGeometry#api/en/core/BufferGeometry.drawRange}.
			 * @param {number} start Identifier of the start vertice to render.
			 * @param {number} count Count of vertices to render.
			 */
			this.setVerticesRange = (start, count) => {
				
				const bufferGeometry = settings.bufferGeometry, position = bufferGeometry.attributes.position;
				
				//Когда bufferGeometry.index != null, и отображаются вершины,
				//то в drawRange задается диапазон видимых вершин без учета размера каждой вершины bufferGeometry.attributes.positionю.itemSize
				const itemSize = ((position && (bufferGeometry.index != null)) ? position.itemSize : 1);
				
				this.setDrawRange(start * itemSize, count * itemSize, bufferGeometry.drawRange.types.vertices);//https://threejs.org/docs/index.html?q=BufferGeometry#api/en/core/BufferGeometry.setDrawRange
				
			};
			/**
			 * Determines the part of edges of the child graphical object geometry to render. See [BufferGeometry.drawRange]{@link https://threejs.org/docs/index.html?q=BufferGeometry#api/en/core/BufferGeometry.drawRange}.
			 * @param {number} [start=0] Identifier of the start edge to render.
			 * @param {number} [timeId] Time identifier of the <a href="../../player/jsdoc/module-Player-Player.html" target="_blank">player</a> that determines of the end edge to render.
			 */
			this.setEdgesRange = (start = 0, timeId) => {

				const drawRange = settings.bufferGeometry.drawRange;
				start = start != undefined ? start : drawRange.start;
				const timeEdgesLength = settings.object.geometry.indices[0].timeEdgesCount * 2;
				this.setDrawRange(timeEdgesLength * start, timeEdgesLength * (((timeId != undefined) ? timeId : settings.options.player.getTimeId() + 1) - start), drawRange.types.edges);
			
			};
			/**
			 * Determines the part of vertices or edges of the child graphical object geometry to render. See [BufferGeometry.drawRange]{@link https://threejs.org/docs/index.html?q=BufferGeometry#api/en/core/BufferGeometry.drawRange}.
			 * @param {number} start Identifier of the start vertice or edge to render.
			 * @param {number} count Count of vertices or edges to render.
			 * @param {number} type For debug. 0 - vertices draw range. 1 - edge's draw range.
			 */
			this.setDrawRange = (start, count, type) => {

				if (settings.debug) {
					
					if (type != undefined) settings.bufferGeometry.drawRange.type = type;
					else console.error(sMyObject + ': setDrawRange(...). Invalid type = ' + type);
					if (!Number.isInteger(start) || ((count != Infinity) && !Number.isInteger(count))) console.error(sMyObject + ': setDrawRange(...). Invalid drawRange = { start: ' + start + ', count: ' + count + ' }');
					
				}
				settings.overriddenProperties.setDrawRange(start, count);
			
			};
			const getPlayerTimesLength = () => { return settings.overriddenProperties.getPlayerTimesLength(); };

			//Для отладки
			const setDrawRangeTypes = () => {

				settings.bufferGeometry.drawRange.types = { vertices: 0, edges: 1 };
				//settings.bufferGeometry.drawRange.type = settings.bufferGeometry.drawRange.types.vertices Установлен диапазон видимых вершин
				//settings.bufferGeometry.drawRange.type = settings.bufferGeometry.drawRange.types.edges Установлен диапазон видимых ребер

			};

			const createPositionAttribute = (pointLength, pointsLength) => {

				//https://stackoverflow.com/questions/31399856/drawing-a-line-with-three-js-dynamically/31411794#31411794
				const isRCount = settings.object.geometry.rCount != undefined, MAX_POINTS = isRCount ?
					//резервирую место для вершин, которые появятся по мере проигрывания player.
					//Это случается когда во вселенной вычисляется очередной шаг по времени. Тоесть пользователь нажал ► или →
					pointLength * pointsLength * settings.object.geometry.rCount :
					settings.object.geometry.MAX_POINTS;

				setDrawRangeTypes();
				
				if (MAX_POINTS != undefined) this.setVerticesRange(0, isRCount ?
					pointLength * pointsLength * getPlayerTimesLength()://зарезервировано место для вершин вселенной с разным радиусом
					//Имеются ребра. В этом случае settings.bufferGeometry.drawRange.count определяет количество отображаемых ребер
					//Сейчас ребра еще не созданы. Поэтому settings.bufferGeometry.drawRange будет установлено после вызова this.setDrawRange
					Infinity//pointsLength * 2 - 1
					);
				if (isRCount) settings.bufferGeometry.userData.drawRange = () => { return settings.bufferGeometry.drawRange; };
				const positions = new Float32Array((MAX_POINTS != undefined ? MAX_POINTS : pointsLength) * pointLength);
				settings.bufferGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, pointLength));
				settings.bufferGeometry.userData.positionOffsetId = (positionId) => { return this.positionOffsetId(positionId) };
				settings.bufferGeometry.userData.position = new Proxy(settings.bufferGeometry.attributes.position, {
		
					get: (position, name) => {
		
						const positionId = parseInt(name);
						if (!isNaN(positionId)) {

							const positionOffset = this.positionOffset(position, positionId),
								array = position.array;
							const verticeProxy = new Proxy([], {

								get: (vertice, name) => {
									
									const axisId = parseInt(name);
									if (!isNaN(axisId)) {

										if (axisId >= position.itemSize) {
											
											//console.error(sMyObject + ': get position axis failed. Invalid axisId = ' + axisId);
											return;

										}
										return array[positionOffset + axisId];
										
									}
									switch (name) {

										case 'forEach': return (item) => {

											for (let axisId = 0; axisId < position.itemSize; axisId++) item(array[positionOffset + axisId], axisId);
												
										}
										case 'length': return position.itemSize;
										case 'toJSON': return (item) => {

											let res = '[';
											verticeProxy.forEach(axis => { res += axis + ', '; });
											return res.substring(0, res.length-2) + ']';
												
										}
										case 'x': return array[positionOffset + 0];
										case 'y': return array[positionOffset + 1];
										case 'z': return array[positionOffset + 2];
										case 'w': {

											if (position.itemSize < 4) return;
											return array[positionOffset + 3];

										}

										//для вывода углов на консоль
										//Если оставить эту строку, то будет исключение в строке
										//return new Proxy(timeAngles[verticeId]
										//в файле hyperSphere.js потому что в массиве timeAngles нет углов с индексом verticeId
										//Для проверки открыть http://localhost/anhr/universe/main/hyperSphere/Examples/
										//Нажать ► проигрывателя
										case 'angles': return settings.object.geometry.times[vertice.timeId][positionId];
										case 'edges':  return settings.object.geometry.times[0][positionId].edges;
										case 'vector':
											const vector = vertice.vector;
											if (vector) {

												console.error('Under constraction');
												return vector;
												
											}
											{//hide vertice
												//для совместимости с Player.getPoints.
												//Открыть вселенную http://localhost/anhr/universe/main/hyperSphere/Examples/ с отображением ребер classSettings.edges.project != false
												//Сделать один шаг проигрывателя. Появятся ребра для вселенной с новым временем.
												//Убрать галочку "Гиперсфера.Вершины.Ребро.Отображать"classSettings.edges.project = false что бы реьа заменить на вершины
												const vertice = verticeProxy;
												switch(vertice.length){

													case 3: return new THREE.Vector3(vertice[0], vertice[1], vertice[2]);
													case 4: return new THREE.Vector4(vertice[0], vertice[1], vertice[2], vertice[3]);
														
												}
												console.error(sMyObject + ': get vertice.vector failed. Invalid vertice.length = ' + vertice.length);
												
											}
											return vertice[name];
					
									}
									if (_this.getPositionItem) {

										const res = _this.getPositionItem(verticeProxy, name);
										if (res != undefined) return res;

									}
									return vertice[name];
									
								},
								set: (vertice, name, value) => {

									//edit vertice in http://localhost/anhr/commonNodeJS/master/nD/Examples/ for testing
									const axisId = parseInt(name);
									if (!isNaN(axisId)) {

										array[positionOffset + axisId] = value;
										return true;
										
									}
									vertice[name] = value;
									return true;
									
								}
								
							});
							return verticeProxy;
		
						}
						switch (name) {
		
							case 'length': return position.count;
							case 'itemSize': return position.itemSize;
		
						}
						console.error(sMyObject + ': get settings.bufferGeometry.userData.position. Invalid name: ' + name);
						return position[name];
		
					}
		
				});			

				//color
				if (_this.setW) _this.setW();
				const itemSize = settings.object.geometry.opacity ? 4 : 3, colors = new Float32Array((MAX_POINTS != undefined ? MAX_POINTS : pointsLength) * itemSize);
				if (itemSize === 4){

					let colorId = itemSize - 1;
					const opacity = settings.object.geometry.opacity;
					//set opacity
					while(colorId < colors.length) {

						colors[colorId] = opacity;
						colorId += itemSize;
						
					}
				}
				settings.bufferGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, itemSize));

			};
			/**
			 * Sets the [BufferGeometry]{@link https://threejs.org/docs/index.html?q=BufferGeometry#api/en/core/BufferGeometry} position attribute from <b>points</b> array.
			 * @param {Array} points Points array.
			 * @param {boolean} boCreatePositionAttribute true - replace old position attribute to new if it exists.
			 */
			this.setPositionAttributeFromPoints = (points, boCreatePositionAttribute) => {

				const bufferAttributes = settings.bufferAttributes, bufferGeometry = settings.bufferGeometry;
				if (bufferAttributes) {

					Object.keys(bufferAttributes).forEach((key) => {

						if (bufferGeometry.attributes[key]) console.error(sMyObject + '.setPositionAttributeFromPoints: Duplicated attribute: ' + key);
						bufferGeometry.setAttribute(key, bufferAttributes[key]);
						
					} );
					settings.overriddenProperties.setTracesIndices(bufferGeometry);
					setDrawRangeTypes();
					return;
					
				}
				if (boCreatePositionAttribute) delete bufferGeometry.attributes.position;
				if (!bufferGeometry.attributes.position) {
					
					createPositionAttribute(
						this.pointLength ? this.pointLength() :
							points[0].w === undefined ? 3 : 4,
						points.length);
					const boLog = this.classSettings && (this.classSettings.debug != undefined) && (this.classSettings.debug.log != false);
					for (let timeId = 0; timeId < getPlayerTimesLength(); timeId++) {
						
						if (boLog) console.log('timeId = ' + timeId);
						for (let i = 0; i < points.length; i++) {

							const vertice = this.setPositionAttributeFromPoint(i, undefined, timeId);
							if (boLog) console.log('\tvertice[' + i + '] = ' + JSON.stringify(vertice));

						}
						if (boLog) console.log('');

					}

				}
				return bufferGeometry;
				
			};
			/**
			 * Vertice color.
			 * @param {number} i Vertice identifier.
			 * @param {Array} vertice Vertice axis array.
			 * @param {number} timeId Time identifier of the <a href="../../player/jsdoc/module-Player-Player.html" target="_blank">player</a> that determines current vertice color.
			 */
			this.verticeColor = (i, vertice, timeId) => {

				const colors = settings.object.geometry.colors;
				if (colors) {
					
					const colorsId = i * 3;
					if (colors[colorsId] != undefined)
						return [colors[colorsId], colors[colorsId + 1], colors[colorsId + 2]];
					
				}
				const color = settings.object.color;
				if (typeof color === "function") return color(timeId);
				if ((color != undefined) && (typeof color != 'object')) return new THREE.Color(_this.color());
				//Вершина не имеет 4 координаты. Установить цвет вершины по умолчанию
				const getDefaultColor = () => { return new THREE.Color(_this.color()); };
				let w;
				if (vertice) w = vertice.w;
				else if (!_this.getPoint) {

					const position = _this.bufferGeometry.attributes.position;
					if (position.itemSize != 4) return getDefaultColor();
					w = new THREE.Vector4().fromBufferAttribute(position, i).w;

				}
				else w = _this.getPoint(i).w;
				if (w === undefined) return getDefaultColor();
				return w;

			};
			/**
			 * Gets a position data.
			 * @param {number} i Vertice identifier for <b>timeId</b> = 0.
			 * @param {number} timeId Time identifier of the <a href="../../player/jsdoc/module-Player-Player.html" target="_blank">player</a> that determines current position data.
			 * @return position data object. Object properties:
			 * <pre>
			 *   verticeId: Vertice identifier for current <b>timeId</b>.
			 *   itemSize: Size of the position axis array.
			 *   positionBlockLength: Positions count for current time.
			 *   positionId: <b>verticeId</b> * <b>itemSize</b>.
			 * <pre>
			 */
			this.getPositionData = (i, timeId) => {

				//Во вселенной, когда пользователь щелкает по вершине, то индекс вершины i будет равен положению вершины в attributes.position
				//а должен быть равен индексу вершины для текущего времени.
				if (_this.guiPoints && _this.guiPoints.verticeId) {
					
					i = _this.guiPoints.verticeId;
					timeId = _this.guiPoints.timeId;

				}
				i = parseInt(i);
				
				if (timeId === undefined) timeId = 0;
				if (i === undefined) console.error(sMyObject + '.getPositionData. Invalid i = ' + i);
				const userData = settings.bufferGeometry.userData,
					positionBlockLength = userData.positionBlockLength === undefined ? 0 : userData.positionBlockLength,
					itemSize = settings.bufferGeometry.attributes.position.itemSize,
					verticeId = positionBlockLength * timeId + i;
				return {

					verticeId: verticeId,
					itemSize: itemSize,
					positionBlockLength: positionBlockLength,
					positionId: verticeId * itemSize,

				}
				
			};
			/**
			 * Sets the [BufferGeometry]{@link https://threejs.org/docs/index.html?q=BufferGeometry#api/en/core/BufferGeometry} position attribute from <b>vertice</b>.
			 * @param {number} i Vertice identifier for <b>timeId</b> = 0.
			 * @param {Array} [vertice] Vertice axis array for current <b>timeId</b>.
			 * @param {number} timeId Time identifier of the <a href="../../player/jsdoc/module-Player-Player.html" target="_blank">player</a> that determines current vertice.
			 */
			this.setPositionAttributeFromPoint = (i, vertice, timeId) => {

				//Position attribute
				
				vertice = vertice || _this.getPoint(i, timeId);
				const attributes = settings.bufferGeometry.attributes, positionData = this.getPositionData(i, timeId),
					positionBlockLength = positionData.positionBlockLength;
				let itemSize = positionData.itemSize, positionId = positionData.positionId, array = attributes.position.array;
				                  array [positionId] = vertice.x != undefined ? vertice.x : vertice[0] != undefined ? vertice[0] : 0;
				if (itemSize > 1) array [++positionId] = vertice.y != undefined ? vertice.y : vertice[1] != undefined ? vertice[1] : 0;
				if (itemSize > 2) array [++positionId] = vertice.z != undefined ? vertice.z : vertice[2] != undefined ? vertice[2] : 0;
				const w = vertice.w;
				if (itemSize > 3) array [++positionId] = w;

				const drawRange = settings.bufferGeometry.drawRange;
				if ((drawRange.count === Infinity) || (((drawRange.start + drawRange.count) * ((settings.bufferGeometry.index === null) ? itemSize : 1)) < positionId)){

					this.setVerticesRange(drawRange.start, (positionId - drawRange.start + 1) / itemSize);
					if (!Number.isInteger(drawRange.count) && (drawRange.count != Infinity)) console.error(sMyObject + '.setPositionAttributeFromPoint failed. Invalid drawRange.count = ' + drawRange.count);

				}

				//Color attribute

				itemSize = attributes.color.itemSize;
				let colorId = i * itemSize + (timeId === undefined ? 0 : positionBlockLength * timeId * itemSize);
				array = attributes.color.array;
				const verticeColor = this.verticeColor(i, vertice, timeId);
				if (typeof verticeColor === 'number'){

					if (settings.options) {
						
						const wScale = settings.options.scales.w;
						Player$1.setColorAttribute(attributes, i + (timeId === undefined ? 0 : positionBlockLength * timeId), settings.options.palette.toColor(verticeColor, wScale.min, wScale.max));

					}
					colorId += attributes.color.itemSize - 1;
					
				} else if (Array.isArray(verticeColor)) verticeColor.forEach(item => array[colorId++] = item);
				else if (verticeColor instanceof THREE.Color) {

					array [colorId++] = verticeColor.r;
					array [colorId++] = verticeColor.g;
					array [colorId++] = verticeColor.b;
					
				}
				else console.error(sMyObject + '.setPositionAttributeFromPoint: Invalid verticeColor = ' + verticeColor);

				//opacity
				if (attributes.color.itemSize > 3) this.verticeOpacity(i);

				return vertice;
				
			};
			/**
			 * Vertice opacity.
			 * @param {number} i Vertice identifier.
			 * @param {Boolean} [transparent] See [transparent]{@link https://threejs.org/docs/index.html?q=LineBasicMaterial#api/en/materials/Material.transparent}.
			 * @param {number} [opacity] See [opacity]{@link https://threejs.org/docs/index.html?q=LineBasicMaterial#api/en/materials/Material.opacity}.
			 */
			this.verticeOpacity = (i, transparent, opacity) => {

				const color = settings.bufferGeometry.attributes.color;
				if (color.itemSize != 4) {

					console.error(sMyObject + '.verticeOpacity: Invalid color.itemSize = ' + color.itemSize);
					return;

				}
				const array = color.array;
				const verticeOpacity = settings.object.geometry.opacity ? settings.object.geometry.opacity[i] : undefined;
				array[color.itemSize * i + 3] = transparent ? opacity : verticeOpacity === undefined ? 1 : verticeOpacity;
				color.needsUpdate = true;

			};
			/**
			 * Opacity for all vertices.
			 * @param {Array} [transparent] See [transparent]{@link https://threejs.org/docs/index.html?q=LineBasicMaterial#api/en/materials/Material.transparent}.
			 * @param {number} [opacity] See [opacity]{@link https://threejs.org/docs/index.html?q=LineBasicMaterial#api/en/materials/Material.opacity}.
			 */
			this.verticesOpacity = (transparent, opacity) => {
				
				const color = settings.bufferGeometry.attributes.color;
				if ( color && ( color.itemSize > 3 ) ) {

					for ( let i = 0; i < color.count; i++ ) { this.verticeOpacity(i, transparent, opacity); }

				} else {

					const object3D = _this.object3D;
					if (object3D) {
						
						object3D.material.transparent = transparent;
						object3D.material.opacity = transparent ? opacity : 1;
						object3D.material.needsUpdate = true;//for THREE.REVISION = "145dev"

					} else console.error(sMyObject + '.verticesOpacity: Invalid object3D');
					
				}
		
			};
			/**
			 * @return The child graphical object color or <a href="../../player/jsdoc/module-Player-Player.html" target="_blank">player</a> time if graphical object color is not defined.
			 */
			this.color = () => {
		
				const color = settings.object.color != undefined ? settings.object.color : settings.pointsOptions != undefined ? settings.pointsOptions.color : undefined;
				return (color != undefined) ? 
					(typeof color === "function") ? color() : color :
					this.defaultColor;//'lime';
			
			};
			/**
			 * @param {number} positionId Position identifier for start time.
			 * @returns Offset of the position identifier for current time.
			 */
			this.positionOffsetId = (positionId) => {

	/*			
				const settings = this.classSettings.settings;
				return settings.bufferGeometry.userData.timeId * settings.object.geometry.angles.length + positionId;
	*/			
				return settings.overriddenProperties.positionOffsetId(positionId);
				
			};
			
		}
		
		//base methods

		/**
		 * Returns 'white'.
		 */
		get defaultColor() { return 'white'; }
		/**
		 * Returns <b>true</b> if a child graphical object can be transparent.
		 */
		get isOpacity() {

			if (this.bufferGeometry.attributes.color && (this.bufferGeometry.attributes.color.itemSize > 3)) {
				
				if (!this.object3D.material.transparent) console.error(sMyObject + '.isOpacity: invalid this.object3D.material.transparent = ' + this.object3D.material.transparent);
				return true;

			}
			return false;
		
		}
		/**
		 * @param {object} position [BufferGeometry]{@link https://threejs.org/docs/index.html?q=BufferGeometry#api/en/core/BufferGeometry} <b>position</b> attribute of the child graphical object.
		 * @param {number} positionId Position identifier for start time.
		 * @returns Offset of the position in the <b>position</b> attribute for current time.
		 */
		positionOffset(position, positionId) {

			this.classSettings.settings;
			return this.positionOffsetId(positionId) * position.itemSize;
	//		return (settings.bufferGeometry.userData.timeId * settings.object.geometry.angles.length + positionId) * position.itemSize;
			
		}

	}

	/**
	 * @module ND
	 * @description N-dimensional graphics
	 * @author [Andrej Hristoliubov]{@link https://github.com/anhr}
	 *
	 * @copyright 2011 Data Arts Team, Google Creative Lab
	 *
	 * @license under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 * 
	 * @see [4D Geometry Viewer]{@link https://github.com/anhr/humke-4d-geometry}
	 * @see [Tesseract]{@link https://ciechanow.ski/tesseract/}
	 * @see [4D-Shapes]{@link https://artemonigiri.github.io/4D-Shapes/}
	 * @see [The Regular Polychora]{@link https://www.qfbox.info/4d/regular}
	*/

	/*
	dimention	geometry	points	edges	faces	bodyes	4D objects
	1			line		2		0
	2			triangle	3		3		1
	3			tetrahedron	4		6		4		1
	4			pentatope	5		10		10		5		1
	*/

	/**
	 * N-dimensional graphics. Extends <a href="../../jsdoc/MyObject/module-myObject-MyObject.html" target="_blank">MyObject</a>.
	 * @class
	 * @extends MyObject
	 */
	class ND extends MyObject {

		/**
		 * N-dimensional graphics.
		 * Creates an N-dimensional graphic object,
		 * checks for a collision between an n-dimensional plane and an n-dimensional graphics object and returns the (n-1)-dimensional intersection geometry if a collision was occurs.
		 * @param {number} n space dimension of the graphical object.
		 * @param {object} [settings={}] The following settings are available
		 * @param {object} [settings.object] geometry, position and rotation of the n-dimensional graphical object.
		 * @param {String} [settings.object.name] name of n-dimensional graphical object.
		 * @param {number|String|object} [settings.object.color='lime'] color of N-dimensional graphic object.
		 * <pre>
		 * number - [Hex triplet]{@link https://en.wikipedia.org/wiki/Web_colors#Hex_triplet} color. Example: 0xffffff - white color
		 * String - color name. See list of available color names in the <b>_colorKeywords</b> object in the [Color.js]{@link https://github.com/mrdoob/three.js/blob/dev/src/math/Color.js} file.
		 * object - Sets the color separately for each vertice.
		 *	You can choose one way for setting of the vertice color from two available:
		 *	
		 *	1. Set the fourth <b>w</b> coordinate of each vertex in a range from
		 *		<b>settings.options.scales.w.min</b> to
		 *		<b>settings.options.scales.w.max</b>
		 *		
		 *		<b>w</b> coordinate is index of palette color. See  method from <b>ColorPicker</b> class.
		 *		Example:
		 *		settings.object.geometry.position: [
		 *			//pyramid
		 *			[0,-0.9428090415820634,0.33333333333333326, 1],
		 *			[0.8164965662730563,0.4714045207910317,0.33333333333333326, 0.5],
		 *			[-0.8164965662730563,0.4714045207910317,0.33333333333333326, 0],
		 *			[7.32733549761259e-9,4.230438555019589e-9,-1.0, -1.0],
		 *		],
		 *	
		 *	2. Set a <b>settings.object.geometry.colors</b> array. 
		 * Have effect only if <b>settings.object.geometry.colors</b> are not defined.
		 * </pre>
		 * @param {boolean|object} [settings.object.faces] true or object - display the n-dimensional graphical object faces instead of edges.
		 * @param {float} [settings.object.faces.opacity=0.5] color Float in the range of 0.0 - 1.0 indicating how transparent the material is.
		 * A value of 0.0 indicates fully transparent, 1.0 is fully opaque.
		 * If the <b>transparent</b> property is not set to true, the material will remain fully opaque and this value will only affect its color.
		 * See [Material.opacity]{@link https://threejs.org/docs/#api/en/materials/Material.opacity}.
		 * @param {boolean} [settings.object.faces.transparent= true] Defines whether this material is transparent.
		 * This has an effect on rendering as transparent objects need special treatment and are rendered after non-transparent objects.
		 * When set to true, the extent to which the material is transparent is controlled by setting its <b>opacity</b> property.
		 * See [Material.transparent]{@link https://threejs.org/docs/#api/en/materials/Material.transparent}.
		 * @param {Array|Object} [settings.object.geometry] Array of vertices and indices of the n-dimensional graphical object.
		 * <pre>
		 * Every item of array is n-dimensional vector of vertice of object.
		 * Or Object. See object's keys below.
		 * </pre>
		 * @param {Array} [settings.object.geometry.position] Array of vertices of the n-dimensional graphical object.
		 * <pre>
		 * Every item of array is n-dimensional vector of vertice of object.
		 * For example, if you want to create a tetrahedron, then you need to create an array of 4 vertices.
		 * <b>settings.object.geometry.position: [
		 * 	[-0.6, 0.1, 0.8],//0
		 * 	[0.7, 0.5, 0.9],//1
		 * 	[0, -0.4, 0.8],//2
		 * 	[0, 0, -0.6]//3
		 * ]</b>,
		 * </pre>
		 * @param {Array} [settings.object.geometry.colors] Array of colors for the each vertex.
		 * <pre>
		 * Every vertex is associated with 3 values of the <b>colors</b> array.
		 * Each value of the <b>colors</b> array is red or green or blue color of the particular vertex in range from 0 to 1.
		 * 
		 * 0 is no color.
		 * 1 is full color.
		 * 
		 * For example:
		 * settings.object.geometry.colors: [
		 * 	1, 0, 0,//red color of the <b>position[0]</b> vertex.
		 * 	0, 1, 0,//green color of the <b>position[1]</b> vertex.
		 * 	0, 0, 1,//blue color of the <b>position[2]</b> vertex.
		 * 	1, 1, 1,//white color of the <b>position[3]</b> vertex.
		 * ],
		 * Have effect only if <b>settings.object.geometry.position</b> points are not <b>THREE.Vector4</b> type.
		 * See <b>arrayFuncs</b> parametr of the <a href="../../player/jsdoc/module-Player-Player.getPoints.html" target="_blank">Player.getPoints(...)</a> for details.
		 * </pre>
		 * @param {array} [settings.object.geometry.opacity] array of opacities for the each vertex. Each item of array is float value in the range of 0.0 - 1.0 indicating how transparent the material is. A value of 0.0 indicates fully transparent, 1.0 is fully opaque.
		 * @param {Array} [settings.object.geometry.boRememberPosition=true] true - Remember vertex positions for higher performance. As result, new vertex positions have no effect.
		 * @param {Array} [settings.object.geometry.indices] Array of <b>indices</b> of vertices of the n-dimensional graphical object.
		 * Allows for vertices to be re-used across multiple segments.
		 * <pre>
		 * <b>Indices</b> is divided to segments:
		 * 
		 * <b>indices[0]</b> is edges. Every edge is two indexes of the edge's vertices. Used in 1D objects and higher.
		 * <b>indices[1]</b> is faces. Every face is three indexes of the edges from <b>indices[0]</b>. Used in 3D objects and higher.
		 * <b>indices[2]</b> is bodies. Every bodie is four face indexes from <b>indices[1]</b>. Used in 4D objects and higher.
		 * For example:
		 * 
		 * <b>n</b> = 1 line.
		 * <b>settings.object.geometry.position</b> = [
		 *	[-0.5, 1],//0
		 *	[0.5]//1
		 *]
		 * <b>settings.object.geometry.indices</b> = [
		 *	[
		 *		0,//index of the settings.object.geometry.position[0] = [-0.5, 1]
		 *		1,//index of the settings.object.geometry.position[1] = [0.5]
		 *	]//0
		 *]//0
		 *
		 * <b>n</b> = 2 triangle
		 * <b>settings.object.geometry.position</b> = [
		 *	[-0.7, 0.2],//0
		 *	[0.8, 0.6],//1
		 *	[0.1, -0.5]//2
		 *],
		 * //edges
		 * <b>settings.object.geometry.indices[0]</b> = [
		 *	[0, 1],//0 index of the settings.object.geometry.positions [-0.7, 0.2] and [0.8, 0.6]
		 *	[0, 2],//1 index of the settings.object.geometry.positions [-0.7, 0.2] and [0.1, -0.5]
		 *	[1, 2] //2 index of the settings.object.geometry.positions [0.8, 0.6] and [0.1, -0.5]
		 *]
		 *
		 * <b>n</b> = 3 tetrahedron.
		 * <b>settings.object.geometry.position</b> = [
		 *	[0.8, -0.6, 0.1],//0
		 * 	[0.9, 0.7, 0.5],//1
		 * 	[0.8, 0, -0.4],//2
		 * 	[-0.6, 0.1, 0.1]//3
		 * ],
		 * //edges
		 * <b>settings.object.geometry.indices[0]</b> = [
		 *	[0, 1]//0 index of the settings.object.geometry.positions [0.8, -0.6, 0.1] and [0.9, 0.7, 0.5]
		 *	[0, 2]//1 index of the settings.object.geometry.positions [0.8, -0.6, 0.1] and [0.8, 0, -0.4]
		 *	[0, 3]//2 index of the settings.object.geometry.positions [0.8, -0.6, 0.1] and [-0.6, 0.1, 0.1]
		 *	[1, 2]//3 index of the settings.object.geometry.positions [0.9, 0.7, 0.5] and [0.8, 0, -0.4]
		 *	[1, 3]//4 index of the settings.object.geometry.positions [0.9, 0.7, 0.5] and [-0.6, 0.1, 0.1]
		 *	[2, 3]//5 index of the settings.object.geometry.positions [0.8, 0, -0.4] and [-0.6, 0.1, 0.1]
		 *]
		 * //faces. Indices of the edges <b>settings.object.geometry.indices[0]</b>
		 * <b>settings.object.geometry.indices[1]</b> = [
		 *	[0, 1, 3]//tetrahedron's face 0
		 *	[0, 2, 4]//tetrahedron's face 1
		 *	[3, 4, 5]//tetrahedron's face 2
		 *	[1, 2, 5]//tetrahedron's face 3
		 *]
		 *
		 * <b>n</b> = 4 pentachoron [5-cell]{@link https://en.wikipedia.org/wiki/5-cell}.
		 * <b>settings.object.geometry.position</b> = [
		 *	[0.8, -0.6, 0.1, -0.85],//0
		 *	[0.9, 0.7, 0.5, -0.55],//1
		 *	[0.8, 0, -0.4, 0],//2
		 *	[-0.6, 0.1, -0.3, 0.55],//3
		 *	[-0.5, 0.2, 0.3, 0.85],//4
		 * ],
		 * //edges
		 * <b>settings.object.geometry.indices[0]</b> = [
		 *	[0, 1]//0 index of the settings.object.geometry.positions [0.8, -0.6, 0.1, -0.85] and [0.9, 0.7, 0.5, -0.55]
		 *	[0, 2]//1 index of the settings.object.geometry.positions [0.8, -0.6, 0.1, -0.85] and [0.8, 0, -0.4, 0]
		 *	[0, 3]//2 index of the settings.object.geometry.positions [0.8, -0.6, 0.1, -0.85] and [-0.6, 0.1, -0.3, 0.55]
		 *	[0, 4]//3 index of the settings.object.geometry.positions [0.8, -0.6, 0.1, -0.85] and [-0.5, 0.2, 0.3, 0.85]
		 *	[1, 2]//4 index of the settings.object.geometry.positions [0.9, 0.7, 0.5, -0.55] and [0.8, 0, -0.4, 0]
		 *	[1, 3]//5 index of the settings.object.geometry.positions [0.9, 0.7, 0.5, -0.55] and [-0.6, 0.1, -0.3, 0.55]
		 *	[1, 4]//6 index of the settings.object.geometry.positions [0.9, 0.7, 0.5, -0.55] and [-0.5, 0.2, 0.3, 0.85]
		 *	[2, 3]//7 index of the settings.object.geometry.positions [0.8, 0, -0.4, 0] and [-0.6, 0.1, -0.3, 0.55]
		 *	[2, 4]//8 index of the settings.object.geometry.positions [0.8, 0, -0.4, 0] and [-0.5, 0.2, 0.3, 0.85]
		 *	[3, 4]//9 index of the settings.object.geometry.positions [-0.6, 0.1, 0.1, 0.55] and [-0.5, 0.2, 0.3, 0.85]
		 *]
		 * //faces. Indices of the edges <b>settings.object.geometry.indices[0]</b>
		 * <b>settings.object.geometry.indices[1]</b> = [
		 *	[7, 8, 9],//0 no 0, 1 vertices
		 *	[5, 6, 9],//1 no 0, 2 vertices
		 *	[4, 6, 8],//2 no 0, 3 vertices
		 *	[4, 5, 7],//3 no 0, 4 vertices
		 *	[2, 3, 9],//4 no 1, 2 vertices
		 *	[1, 3, 8],//5 no 1, 3 vertices
		 *	[1, 2, 7],//6 no 1, 4 vertices
		 *	[0, 3, 6],//7 no 2, 3 vertices
		 *	[0, 2, 5],//8 no 2, 4 vertices
		 *	[0, 1, 4],//9 no 3, 4 vertices
		 *]
		 * //bodies. Indices of the faces <b>settings.object.geometry.indices[1]</b>
		 * <b>settings.object.geometry.indices[2]</b> = [
		 * [2, 1, 3, 0],//0 no 0 vertice
		 * [5, 6, 4, 0],//1 no 1 vertice
		 * [8, 7, 1, 4],//2 no 2 vertice
		 * [9, 7, 2, 5],//3 no 3 vertice
		 * [9, 8, 3, 6],//4 no 4 vertice
		 *]
		 * </pre>
		 * @param {Array|number} [settings.object.position] Array - position of the n-dimensional graphical object in n-dimensional coordinates.
		 * <pre>
		 * number - position of the 0 coordinate of the n-dimensional graphical object.
		 * <pre>
		 * @param {Array|number} [settings.object.rotation] Array - rotation in radians of the n-dimensional graphical object in n-dimensional coordinates.
		 * <table>
			 <tr><td><b>n</b> space dimension</td><td>Array index</td><td>Axis of rotation</td><td>Axis type</td><td>Note</td></tr>
			 <tr><td>0</td><td></td><td></td><td></td><td>no rotation</td></tr>
			 <tr><td>1</td><td></td><td></td><td></td><td>no rotation</td></tr>
			 <tr><td>2</td><td>0</td><td></td><td></td><td>No effect for 2-dimensional space</td></tr>
			 <tr><td></td><td>1</td><td></td><td></td><td>No effect for 2-dimensional space</td></tr>
			 <tr><td></td><td>2</td><td>2(z)</td><td>point</td><td></td></tr>
			 <tr><td>3</td><td>0</td><td>0(x)</td><td>line</td><td></td></tr>
			 <tr><td></td><td>1</td><td>1(y)</td><td></td><td></td></tr>
			 <tr><td></td><td>2</td><td>2(z)</td><td></td><td></td></tr>
			 <tr><td>4</td><td>0</td><td>0, 1(xy)</td><td>plane</td><td></td></tr>
			 <tr><td></td><td>1</td><td>0, 2(xz)</td><td></td><td></td></tr>
			 <tr><td></td><td>2</td><td>0, 3(xw)</td><td></td><td></td></tr>
			 <tr><td></td><td>3</td><td>1, 2(yz)</td><td></td><td></td></tr>
			 <tr><td></td><td>4</td><td>1, 3(yw)</td><td></td><td></td></tr>
			 <tr><td></td><td>5</td><td>2, 3(zw)</td><td></td><td></td></tr>
			 <tr><td>5</td><td>0</td><td>0, 1, 2(xyz)</td><td>3D space</td><td></td></tr>
			 <tr><td></td><td>1</td><td>0, 1, 3(xyw)</td><td></td><td></td></tr>
			 <tr><td></td><td>2</td><td>0, 1, 4(xy4)</td><td></td><td></td></tr>
			 <tr><td></td><td>3</td><td>0, 2, 3(xzw)</td><td></td><td></td></tr>
			 <tr><td></td><td>4</td><td>0, 2, 4(xz4)</td><td></td><td></td></tr>
			 <tr><td></td><td>5</td><td>0, 3, 4(xw4)</td><td></td><td></td></tr>
			 <tr><td></td><td>6</td><td>1, 2, 3(yzw)</td><td></td><td></td></tr>
			 <tr><td></td><td>7</td><td>1, 2, 4(yz4)</td><td></td><td></td></tr>
			 <tr><td></td><td>8</td><td>1, 3, 4(yw4)</td><td></td><td></td></tr>
			 <tr><td></td><td>9</td><td>2, 3, 4(zw4)</td><td></td><td></td></tr>
			</table>
		 * <pre>
		 * number - rotation in radians around axis 0 or rotation around axis 2 for 2D objects i.e. space dimension n = 2.
		 * See [Can rotations in 4D be given an explicit matrix form?]{@link https://math.stackexchange.com/questions/1402362/can-rotations-in-4d-be-given-an-explicit-matrix-form}, [Rotation matrix]{@link https://en.wikipedia.org/wiki/Rotation_matrix}.
		 * Examples:
		 * <b>n = 4</b>, <b>rotation = [Math.PI / 5, 1, 2, 3, 4, 5]</b>
		 * rotation around 0, 1(xy) plane is Math.PI / 5 radians.
		 * rotation around 0, 2(xz) plane is 1 radian.
		 * etc.
		 *
		 * <b>n = 4</b>, <b>rotation = Math.PI / 5</b>
		 * rotation around 0, 1(xy) plane is Math.PI / 5 radians.
		 *
		 * <b>n = 2</b>, <b>rotation = [0, 0, Math.PI / 4]</b>
		 * rotation around 2(z) point is Math.PI / 4 radians.
		 *
		 * <b>n = 2</b>, <b>rotation = Math.PI / 5</b>
		 * rotation around 2(z) point is Math.PI / 5 radians.
		 * <pre>
		 * @param {Array} [settings.object.geometry.iAxes] array of indices of the axes.
		 * For example if <b>iAxes</b> is [1,2], then axis 1 interpret as axis 0 and axis 2 interpret as axis 1.
		 * As result, you can rotate axes around another axis to 90 degrees.
		 * In example above you have rotated axis 1 and 2 around axis 0 to 90 degrees.
		 * @param {Boolean} [settings.plane=false] true - create <b>vectorPlane</b>. See <b>settings.vectorPlane</b> below.
		 * @param {Array} [settings.vectorPlane] n-dimensional position of the panel
		 * intersecting with the <b>settings.object.geometry</b> n-dimensional graphical object. Available only if <b>settings.plane</b> is true.
		 * @param {THREE.Scene} [settings.scene] [THREE.Scene]{@link https://threejs.org/docs/index.html?q=sce#api/en/scenes/Scene}.
		 * Define <b>scene</b> if you want visualise n-dimensional plane and n-dimensional object to 3-D space of the <b>scene</b>.
		 * @param {Options} [settings.options] See <a href="../../jsdoc/Options/Options.html" target="_blank">Options</a>.
		 * Uses only if <b>scene</b> is defined.
		 * @param {Event} [settings.onIntersection] Plane and object intersection event.
		 * The <b>onIntersection</b> function parameter is the (n-1)-dimensional geometry of the intersection if a collision occurred, or undefined if a collision did not occur.
		 * @param {Boolean} [settings.isRaycaster=true] false - Ignoring of the mouse over of the object event or accept of the event if <b>isRaycaster</b> is true or undefined.
		 * @see [4D Geometry Viewer]{@link https://github.com/anhr/humke-4d-geometry}
		 * @see [Tesseract]{@link https://ciechanow.ski/tesseract/}
		 * @see [4D-Shapes]{@link https://artemonigiri.github.io/4D-Shapes/}
		 * @see [The Regular Polychora]{@link https://www.qfbox.info/4d/regular}
		 */
		constructor( n, settings ) {

			super( settings );
			const options = settings.options, _ND = this;
			settings.object.raycaster = settings.object.raycaster || {};
			settings.object.raycaster.text = settings.object.raycaster.text || function( intersection ) {

				//Localization

				const getLanguageCode = settings.options.getLanguageCode;

				const lang = {

					pointId: "point Id",
					edgeId: "edge Id",
					faceId: "face Id",
					bodyId: "body Id",
					segmentId: "segment Id",

				};

				const _languageCode = getLanguageCode();

				switch (_languageCode) {

					case 'ru'://Russian language

						lang.pointId = 'Индекс точки';
						lang.edgeId = 'Индекс ребра';
						lang.faceId = 'Индекс грани';
						lang.bodyId = 'Индекс тела';
						lang.segmentId = 'Индекс сегмента';

						break;

				}

				const index = intersection.object.geometry.index, edge = [
						index.getX(intersection.indexNew),
						index.getY(intersection.indexNew)
					],
					indices = intersection.object.userData.geometry.indices;
				edges = indices[0];

				//find point id
				var minDistance = Infinity, pointId;
				function distance ( i ) {

					const pointIndex = edge[i],
						distance = intersection.point.distanceTo( new THREE.Vector3().fromBufferAttribute( intersection.object.geometry.attributes.position, pointIndex ) );
					if ( minDistance > distance  ) {
		
						minDistance = distance;
						pointId = pointIndex;
						
					}
					
				}
				distance ( 0 );
				distance ( 1 );
				var text = '\n' + lang.pointId + ': ' + pointId;
				
				//Find edge index
				const drawRange = settings.bufferGeometry.drawRange;
				for ( var segmentIndex = drawRange.start; segmentIndex < ( ( drawRange === Infinity) ? edges.length : drawRange.start + drawRange.count ); segmentIndex++ ) {

					const edgeCur = edges[segmentIndex];
					if (
						( ( edgeCur[0] === edge[0] ) && ( edgeCur[1] === edge[1] ) ) ||
						( ( edgeCur[0] === edge[1] ) && ( edgeCur[1] === edge[0] ) )
					) {

						text += '\n' + lang.edgeId + ': ' + segmentIndex;
						edges.selected = segmentIndex;
						
						//find segment id.
						//indices[1] is faces
						//indices[2] is bodies
						var detectedIndex;//индекс элемента текушего сегмента segment = indices[indicesSegment]
							//в котором встечается индекс segmentIndex выбранного сегмента перудыдущего уровня
						for ( var indicesSegment = 1; indicesSegment < indices.length; indicesSegment++ ) {

							const segment = indices[indicesSegment];//текуший сегмент
							//Встречаются ли в текушем сегменте segment индекс segmentIndex выбранного сегмента перудыдущего уровня
							segment.forEach( ( segmentItem, segmentIndexCur ) => {

								//найти в текущем элементе сегмента segmentItem индекс segmentIndex выбранного сегмента перудыдущего уровня
								//и присвоить detectedIndex = segmentIndexCur равному индексу текущего элемента сегмента
								for ( var i = 0; i < segmentItem.length; i++ ) {
									
									//segmentIndex индекс выбранного сегмента перудыдущего уровня
									//для segment = indices[1] is faces это индекс выбранного edge
									//для segment = indices[2] is bodies это индекс выбранного face
									if ( segmentItem[i] === segmentIndex ) {
										
										//if ( detectedIndex != undefined ) console.log( 'Duplicate segment: ' + i );
										detectedIndex = segmentIndexCur;
										break;

									}

								}
								
							} );
							if ( detectedIndex === undefined ) {
								
								console.error( 'ND: mouse move. Index of segment was not detected' );
								break;

							}
							else {
								
								segmentIndex = detectedIndex;
								var segmentName;
								switch( indicesSegment ) {//индекс ткушего сегмета

									case 1: segmentName = lang.faceId; break;
									case 2: segmentName = lang.bodyId; break;
									default: segmentName = lang.segmentId;
										
								}
								text += '\n' + segmentName + ': ' + segmentIndex;
								segment.selected = segmentIndex;

							}
							
						}
						indices[indices.length - 1][segmentIndex];
						break;
						
					}
					
				}
				return text;
				
			};
			settings.object.name = settings.object.name || 'Object';
			if ( settings.object.aObjects ) settings.object.aObjects.nD = this;
			settings.object.geometry = settings.object.geometry || {};
			if ( settings.object.geometry instanceof Array ) {

				const position = settings.object.geometry;
				settings.object.geometry = { position: position, };

			}

			//Эту строку нельзя использовать потому что во вселенной будет ошибка
			//TypeError: classSettings.overriddenProperties.position0.angles[verticeId].middleVertice is not a function
			//если:
			//Открыть http://localhost/anhr/universe/main/hyperSphere/Examples/ что бы не было видно ребер classSettings.edges.project = false
			//Сделать один шаг проигрывателя: нажать →
			//Сделать ребра видимыми: Поставить галочку Гиперсфера\Ребро\Отображать.
			//Сделать один шаг проигрывателя: нажать →
			//Это происходить потому что когда проигрыватель находится не в начальном положении timeId > 0, то в settings.object.geometry.position попадают вершины не из начального времени
			//settings.object.geometry.position = settings.object.geometry.position || [];
			
			if (!settings.object.geometry.position) settings.object.geometry.position = [];

			class Vector extends ND.VectorN {

				/* *
				 * @description
				 * <pre>
				 * An n-dimensional vector is point in an n-dimensional space.
				 * The length of an array is the dimension of the space.
				 * @param {Array} [array=0] array of the values for appropriate axes.
				 * </pre>
				 * @example //Creates a point in 2-dimensional space. -5 is value for 0 axis and 7.8 is value for 1 axis.
				 * const vector = new ND.Vector( [-5, 7.8] );
				 * const point = vector.point;//THREE.Vector3( -5, 7.8, 0 )
				 * const vector0 = vector[0]//-5
				 * const vector1 = vector[1]//7.8
				 */
				constructor( array = 0, vectorSettings = {} ) {

					array = super(n, array).array;
					const _this = this;

					//https://stackoverflow.com/questions/2449182/getter-setter-on-javascript-array
					return new Proxy( array, {

						get: function ( target, name ) {

							var i = parseInt( name );
							if ( isNaN( i ) ) {

								switch ( name ) {

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
									case "point":
										const THREE = three$1.THREE;
										if ((typeof settings.object.color === "object") && (array.length >= 4))
											return new THREE.Vector4( this.get( undefined, 0 ), this.get( undefined, 1 ), this.get( undefined, 2 ), this.get( undefined, 3 ) );//цвет каждой вершины зависить от оси w этой вершины
										return new THREE.Vector3( this.get( undefined, 0 ), this.get( undefined, 1 ), this.get( undefined, 2 ) );//Цвет всех вершин определяется из settings.object.color или из settings.object.geometry.colors или одинаковый по умолчанию
									default: {

										return _this[name];
									
									}

								}

							}
							if ( i >= n )
								return 0;
							if ( ( array.length > n ) && settings.object.geometry.iAxes && ( i < settings.object.geometry.iAxes.length ) )
								i = settings.object.geometry.iAxes[i];
							return array[i];

						},
						set: function ( target, name, value ) {

							const i = parseInt( name );
							if ( !isNaN( i ) ) {
									
								if ( i >= array.length ) {
		
									array.push( value );
									return array.length;
		
								}
								array[i] = value;
								_ND.intersection();
								if ( vectorSettings.onChange ) vectorSettings.onChange();
								return true;
								
							}
							switch ( name ) {
		
								case 'onChange':
									vectorSettings.onChange = value;
									return vectorSettings.onChange;
								default: console.error( 'ND: Vector set. Invalid name: ' + name );
		
							}

						}

					} );

				}
				push( value ) { console.error( 'ND.Vector.push() unavailable' ); }
				pop() { console.error( 'ND.Vector.pop() unavailable' ); }

			}

			function update() {
				
				_ND.intersection();
				object3D.geometry.attributes.position.needsUpdate = true;
				if (options.guiSelectPoint) options.guiSelectPoint.update();
				object3D.children.forEach( child => {
					
					if ( child.type === 'Sprite' ) child.position.copy( geometry.D3.points[child.userData.pointID] );
						
				} );
				
			}
			function proxyPosition() {

				if ( settings.object.position && settings.object.position.isProxy ) return settings.object.position;
				return new Proxy( settings.object.position ? settings.object.position instanceof Array ? settings.object.position : [settings.object.position] : [], {

					get: function ( target, name, args ) {

						const i = parseInt( name );
						if ( !isNaN( i ) ) {

							if ( target instanceof Array ) {

								if ( i < target.length && ( target[i] !== undefined ) )
									return target[i];
								return 0;

							}
							return target;

						}
						switch ( name ) {

							case 'isProxy': return true;
							case 'folders':
								target.folders = target.folders || [];
								return target.folders;
							case 'arguments': return;//for dat.GUI
							case 'clear': return function () {

								target.forEach( ( pos, i ) => target[i] = 0 );

							}
							case 'forEach': return target.forEach;
							case 'length': return target.length;
							default: console.error( 'ND: settings.object.position Proxy. Invalid name: ' + name );

						}

					},
					set: function ( target, name, value ) {

						target[name] = value;

						settings.object.geometry.position.reset();

						const input = target.folders[name].cPosition.domElement.querySelector( 'input' );
						if ( parseFloat( input.value ) !== value ) {

							input.value = value;
							update();

						}
						return true;

					},

				} );

			}
			settings.object.position = proxyPosition();

			function proxyRotation() {

				if ( settings.object.rotation && settings.object.rotation.isProxy ) return settings.object.rotation;
				return new Proxy( settings.object.rotation ? settings.object.rotation instanceof Array ? settings.object.rotation : [settings.object.rotation] : [], {

					get: function ( target, name, args ) {

						const i = parseInt( name );
						if ( !isNaN( i ) ) {

							if ( target instanceof Array ) {

								if ( i < target.length && ( target[i] !== undefined ) ) return target[i];
								return 0;

							}
							return target;

						}
						switch ( name ) {

							case 'isProxy': return true;
							case 'boUseRotation': return target.boUseRotation;
							case 'folders':
								target.folders = target.folders || [];
								return target.folders;
							case 'trigonometry':
								if ( !target.trigonometry ) {

									target.trigonometry = new Proxy( [], {

										get: function ( target, name, args ) {

											const i = parseInt( name );
											if ( !isNaN( i ) ) {

												if ( !target[i] ) {

													settings.object.rotation.boUseRotation = true;
													const angle = settings.object.rotation[i];
													settings.object.rotation.boUseRotation = false;
													target[i] = { sin: Math.sin( angle ), cos: Math.cos( angle ) };

												}
												return target[i];

											}
											switch ( name ) {

												default: console.error( 'ND: settings.object.rotation Proxy. Invalid name: ' + name );

											}

										},
										set: function ( target, name, value ) {

											target[name] = value;
											if ( isNaN( parseInt( name ) ) ) return true;
											return true;

										},


									} );

								}
								return target.trigonometry;
							case 'isRotation': return function () {

								target.boUseRotation = true;
								var boRotation = false;
								for ( var j = 0; j < n; j++ ) {

									if ( settings.object.rotation[j] !== 0 ) {

										boRotation = true;
										break;

									}

								}
								target.boUseRotation = false;
								return boRotation;

							}
							case 'clear': return function () {

								target.forEach( ( angle, i ) => target[i] = 0 );
								target.trigonometry = undefined;

							}
							case 'arguments': return;//for dat.GUI
							case 'forEach': return target.forEach;
							case 'length': return target.length;
							default: console.error( 'ND: settings.object.rotation Proxy. Invalid name: ' + name );

						}

					},
					set: function ( target, name, value ) {

						target[name] = value;
						if ( isNaN( parseInt( name ) ) ) return true;

						settings.object.rotation.trigonometry[name].cos = Math.cos( value );
						settings.object.rotation.trigonometry[name].sin = Math.sin( value );

						settings.object.geometry.position.reset();

						if ( target.folders ) {
							
							const input = target.folders[name].cRotation.domElement.querySelector( 'input' );
							if ( parseFloat( input.value ) !== value ) {
		
								input.value = value;
		
							}

						}
						update();
						return true;

					},


				} );

			}
			if ( !settings.object.rotation || !settings.object.rotation.isProxy ) {

				settings.object.rotation = proxyRotation();
				settings.object.rotation.boUseRotation = false;

			}

			if ( settings.object.geometry.position.target ) settings.object.geometry.position = settings.object.geometry.position.target;
			settings.object.geometry.position.boPositionError = true;
			const rotationAxes = [[]];//массив осей вращения
			function setRotationAxes() {

				if ( n < 2 ) return;
				
				if ( rotationAxes[0].length != 0 ) return;

				//create rotation axies

				//первый ряд

				//индексы рядов и колонок матрицы, в которые заносятся значения тригонометрических функций
				//Тригонометрические функци надо внестив следующие 4 ячейки матрицы:
				//m[tI[0], tI[0]] = cos, m[tI[0], tI[1]] = -sin, m[tI[1], tI[0]] = sin, m[tI[1], tI[1]] = cos.
				//const tI = [0,1];
				//Для первой матрицы получается
				//m[0, 0] = cos, m[0, 1] = -sin, m[1, 0] = sin, m[1, 1] = cos.

				if ( n === 2 ) rotationAxes[0].push( 2 );//в двумерном пространстве вращение вокруг оси 2
				else for ( var j = 0; j < ( n - 2 ); j++ ) rotationAxes[0].push( j );
				rotationAxes[0].tI = [0, 1];

				const iLastColumn = rotationAxes[0].length - 1;

				var boLastRow = false;

				while ( !boLastRow ) {

					const iLastRow = rotationAxes.length - 1, lastRow = rotationAxes[iLastRow],
						row = [];

					for ( var j = iLastColumn; j >= 0; j-- ) {

						const prevColumn = lastRow[j];
						var iAxis;//индекс оси
						if ( j === iLastColumn ) iAxis = prevColumn + 1;//увеличить на 1 последнюю колонку
						else iAxis = prevColumn;
						if ( iAxis >= n ) {

							function createRow( j ) {

								if ( j <= 0 ) return false;//последний ряд
								//если это последняя колонка и если индекс оси больше количества осей в n пространстве
								//увеличить индекс оси в предыдущей колонке
								const prevRowColumn = lastRow[j - 1] + 1;
								//предыдущая колонка не может больше или рано текушей колонке в предыдущем ряде
								if ( prevRowColumn >= lastRow[j] ) return createRow( j - 1 );
								row[j - 1] = prevRowColumn;
								//индекс оси в текущей колонке равен индексу в предыдущей колонке плюс 1
								row[j] = row[j - 1] + 1;

								//все последующие колонки увеличиваются на единицу
								for ( var k = j + 1; k <= iLastColumn; k++ ) row[k] = row[k - 1] + 1;

								//копируем из последнего ряда оставшиеся колонки слева 
								j = j - 2;
								while ( j >= 0 ) {

									row[j] = lastRow[j];
									j--;

								}
								return true;

							}
							boLastRow = !createRow( j );
							break;

						}
						else row[j] = iAxis;

					}
					if ( !boLastRow ) {

						row.tI = [lastRow.tI[0]];
						var tI1 = lastRow.tI[1] + 1;
						if ( tI1 >= n ) {

							row.tI[0]++;
							tI1 = row.tI[0] + 1;

						}
						row.tI[1] = tI1;
						if ( row.length === 0 ) {

							console.error( 'ND positionWorld get: row is empty' );
							break;

						}
						rotationAxes.push( row );

						//debug
						if ( iLastRow === rotationAxes.length - 1 ) {

							console.error( 'ND positionWorld get: row is not added' );
							break;

						}

					}

				}

			}
			const positionWorld = new Proxy( settings.object.geometry.position ? settings.object.geometry.position : [], {
		
				get: function ( target, name ) {

					const i = parseInt( name );
					if ( !isNaN( i ) ) {

						settings.object.geometry.position.boPositionError = false;
						const positionPoint = settings.object.geometry.position[i];
						if ( positionPoint.positionWorld ) {
							
							//не надо снова вычислять мировые координатя точки если они уже вычислены
							settings.object.geometry.position.boPositionError = true;
							return positionPoint.positionWorld;

						}
						const array = [];
						if ( positionPoint !== undefined ) {

							if ( !( settings.object.position instanceof Array ) ) {

								console.error( 'ND positionWorld get: settings.object.position is not array' );
								settings.object.position = [settings.object.position];

							}
							if ( settings.object.rotation.isRotation() ) {

								//https://math.stackexchange.com/questions/1402362/can-rotations-in-4d-be-given-an-explicit-matrix-form
								//https://en.wikipedia.org/wiki/Rotation_matrix
								function getMatrix( index ) {

									const cos = settings.object.rotation.trigonometry[index].cos, sin = settings.object.rotation.trigonometry[index].sin,
										array = [];
									const tI = rotationAxes[index].tI;
									for ( var i = 0; i < n; i++ ) {

										const row = [];
										for ( var j = 0; j < n; j++ ) {

											if ( n === 3 ) {

												const iR = n - i - 1, jR = n - j - 1;

												if ( ( iR === tI[0] ) && ( jR === tI[0] ) ) row.push( cos );
												else if ( ( iR === tI[0] ) && ( jR === tI[1] ) ) row.push( sin );
												else if ( ( iR === tI[1] ) && ( jR === tI[0] ) ) row.push( -sin );
												else if ( ( iR === tI[1] ) && ( jR === tI[1] ) ) row.push( cos );
												else if ( iR === jR ) row.push( 1 );
												else row.push( 0 );

											} else {

												if ( ( i === tI[0] ) && ( j === tI[0] ) ) row.push( cos );
												else if ( ( i === tI[0] ) && ( j === tI[1] ) ) row.push( -sin );
												else if ( ( i === tI[1] ) && ( j === tI[0] ) ) row.push( sin );
												else if ( ( i === tI[1] ) && ( j === tI[1] ) ) row.push( cos );
												else if ( i === j ) row.push( 1 );
												else row.push( 0 );

											}

										}
										array.push( row );

									}
									return new MyMath.Matrix( array );

								}
								var m3;

								setRotationAxes();

								/*
								//test
								{

									const a = [
											[1, 2],
											[3, 4],
											[5, 6],
										],
										b = [
											[7,   8, 9 ,10],
											[11, 12, 13,14],
										],
										v = [15, 16, 17, 18];
									const c = new MyMath.Matrix( a ).multiply( b );
									const cv = c * v;
									//const cv = c.multiply( v );
									console.log(cv);
									
									const m1 = math.matrix( a ),
										m2 = math.matrix( b ),
										c2 = math.multiply( m1, m2 );
									const cv2 = math.multiply( c2, v );
									console.log(cv2);

								}
								*/
								if ( n === 2 ) m3 = getMatrix( 0 );//вращение только вокруг оси 2
								for ( var j = 0; j < rotationAxes.length; j++ ) {

									const m = getMatrix( j );
									if ( m3 ) m3 = m3.multiply( m );//m3 = math.multiply( m3, m );
									else m3 = m;
		
								}
								var position = [];
								for ( var j = 0; j < n; j++ ) position.push( positionPoint[j] );
								const p = m3.multiply( position );
								p.forEach( ( value, i ) => {

									if ( value !== undefined ) {

										array.push( value + settings.object.position[i] );

									} else console.error( 'ND: positionWorld get: invalig array item = ' + value );

								} );

							} else {

								positionPoint.forEach( ( value, j ) => array.push( value + settings.object.position[j] ) );
								setRotationAxes();

							}

						} else console.error('ND positionWorld get index');
						if (settings.object.geometry.boRememberPosition === undefined) settings.object.geometry.boRememberPosition = true;
						if (settings.object.geometry.boRememberPosition) positionPoint.positionWorld = array;
						settings.object.geometry.position.boPositionError = true;
						return array;

					}
					switch ( name ) {

						case 'isProxy': return true;
						case 'target': return;// target; Если вершинрнуть target, то неверно сработает if ( settings.object.geometry.position.target ) и позиция intersection будет неверна
						case 'copy': 
							return function () {

								const v = [];
								settings.object.geometry.position.boPositionError = false;
								settings.object.geometry.position.forEach( ( value, i ) => {
									
									v[i] = positionWorld[i];
									settings.object.geometry.position.boPositionError = false;
								
								} );
								settings.object.geometry.position.boPositionError = true;
								return v;
			
							}

					}
					return settings.object.geometry.position[name];

				},
				
			} );

			//делаю как объект для совместимости с GuiIndices потому что в javascript нельзя передовать ссылки на переменные
			//https://stackoverflow.com/questions/7744611/pass-variables-by-reference-in-javascript
			const _prevLine = {};

			function proxyGeometryPosition() {

				const geometry = settings.object.geometry;
				if ( geometry.position && geometry.position.isProxy ) return geometry.position;
				const playerPosition = geometry.playerPosition, position = playerPosition ? geometry.playerPosition[0] : geometry.position ? geometry.position : [];
				return new Proxy(
					
					//Эту строку нельзя использовать потому что во вселенной будет ошибка
					//TypeError: classSettings.overriddenProperties.position0.angles[verticeId].middleVertice is not a function
					//если:
					//Открыть http://localhost/anhr/universe/main/hyperSphere/Examples/ что бы не было видно ребер classSettings.edges.project = false
					//Сделать один шаг проигрывателя: нажать →
					//Сделать ребра видимыми: Поставить галочку Гиперсфера\Ребро\Отображать.
					//Сделать один шаг проигрывателя: нажать →
					//Это происходить потому что когда проигрыватель находится не в начальном положении timeId > 0, то в settings.object.geometry.position попадают вершины не из начального времени
					//settings.object.geometry.position ? settings.object.geometry.position : [],
					
					position,
					{

					get: function ( target, name, args ) {

						const i = parseInt( name );
						if ( !isNaN( i ) ) {
							if ( settings.object.geometry.position.boPositionError ) ;
							if ( i >= target.length ) {

								console.error( 'ND get settings.object.geometry.position: invalid index = ' + i );
								return;

							}
							if ( target[i] instanceof Array ) {

								return new Proxy( target[i], {

									get: function ( target, name, args ) {

										const i = parseInt( name );
										if ( !isNaN( i ) ) {

											if ( i >= target.length ) return 0;
											const axis = target[i];
											if ( isNaN( axis ) ) console.error( 'ND get settings.object.geometry.position[i][' + i + '] = ' + target[i] );
											return axis;

										}
										switch ( name ) {

											case 'reset': return function() { delete target.positionWorld; }
											case 'distanceTo': return (verticeTo) => {
		
												const vertice = target;
												if (vertice.length != verticeTo.length) {
		
													console.error(sUniverse + ': settings.object.geometry.position[i].distanceTo(...). vertice.length != verticeTo.length');
													return;
		
												}
												//const distance = new three.THREE.Vector3(vertice[0], vertice[1], vertice[2], ).distanceTo(new three.THREE.Vector3(verticeTo[0], verticeTo[1], verticeTo[2], ));
												let sum = 0;
												vertice.forEach((axis, i) => {
		
													const d = axis - verticeTo[i];
													sum += d * d;
		
												});
												return Math.sqrt(sum);
										}

										}
										return target[name];

									},
									set: function ( target, name, value ) {

										const i = parseInt( name );
										target[name] = value;
										if ( !isNaN( i ) ) {

											target.positionWorld = undefined;
											if ( _prevLine.prevLine ) {
												
												_prevLine.prevLine.geometry.attributes.position.array = new THREE.BufferGeometry().setFromPoints( geometry.D3.points ).attributes.position.array;
												_prevLine.prevLine.geometry.attributes.position.needsUpdate = true;

											}
											update();//изменилась позиция вершины

										}
										return true;

									},

								} );

							}
							console.error( 'ND: get settings.object.geometry.position is not array.' );
							return [target[i]];

						}
						switch ( name ) {

							case 'isProxy': return true;
							case 'boPositionError': return target.boPositionError;
							case 'target': return target;
							/*
							* Returns a new vector with the same values as this one.
							*/
							case "clone":
								return function ( i ) {

									const v = [];
									target[i].forEach( ( value, j ) => v[j] = target[i][j] );
									return v;

								}
							case "reset": return function () { target.forEach( item => delete item.positionWorld ); }
							default: return target[name];

						}

					},
					set: function ( target, name, value ) {

						const i = parseInt( name );
						if ( !isNaN( i ) ) {

							//изменилась позиция вершины
							target[name].positionWorld = undefined;

						}
						target[name] = value;

						return true;

					},

				} );

			}
			settings.object.geometry.position = proxyGeometryPosition();

			//indices

			function setIndices() {
				
				if ( settings.object.geometry.indices ) return;

				settings.object.geometry.indices = [];
				settings.object.geometry.indices.boAddIndices = true;
				
			}
			setIndices();

			//edges
			function proxyEdges( newEdges ) {

				edges = newEdges || edges;
				if ( edges && edges.isProxy ) return edges;
				return new Proxy( edges ? edges : [],
					{

						get: function ( edges, name, value ) {

							const i = parseInt( name );
							if (!isNaN(i)) {

								const edge = edges[i];
								edge.intersection = ( geometryIntersection/*, color*/ ) => {

									const i = parseInt(name);
									if (!isNaN(i)) {

										if (i.toString() !== name) {

											console.error('ND: settings.object.geometry.indices[]intersection. invalid name = ' + name);
											return;

										}
										if (edges.length === 0) return;//no edges
										if (i >= edges.length) {

											console.error('ND: settings.object.geometry.indices[]intersection. invalid length: ' + edges.length);
											this.indices = { intersection: {} };
											return;

										}
										var indices = edges[i];

										//Когда размерность графического оъекта меньше 3
										//и когда он создается из объета большей размерности
										//то indices это прокси
										//if (indices.indices) indices = indices.indices;

										if (indices.length !== 2) {

											console.error('ND: settings.object.geometry.indices[]intersection. indices.length = ' + indices.length);
											return;

										}
										if (indices[0] === indices[1]) {

											console.error('ND: settings.object.geometry.indices[]intersection. indices[0] === indices[1] = ' + indices[0]);
											return;

										}
										const position0 = new Vector(positionWorld[indices[0]]),
											position1 = new Vector(positionWorld[indices[1]]);
										function indicesIntersection(position) {

											switch (n) {

												case 2:
													break;
												default:
													if (!position)
														break;
													position.push(vectorPlane[n - 1]);
													break;

											}
											indices.intersection = { position: position, };
											if (indices.intersection.position) indices.intersection.position.iEdge = i;

										}
										switch (n) {

											case 1:
												if (vectorPlane[0].between(position0[0], position1[0], true))
													geometryIntersection.position.push([vectorPlane[0]]);
												break;
											case 2:
												var vector;
												if (vectorPlane[1].between(position0[1], position1[1], true)) {

													const a = (position1[1] - position0[1]) / (position1[0] - position0[0]),
														b = position0[1] - a * position0[0],
														x = (a === 0) || isNaN(a) || (Math.abs(a) === Infinity) ?
															position1[0] :
															(vectorPlane[1] - b) / a;
													if (isNaN(x) || (x === undefined)) { console.error('ND.intersection: x = ' + x + ' position1[0] = ' + position1[0] + ' position0[0] = ' + position0[0]); }

													//Если x почти равно position0[0] и position0[0] то будем считать что x между ними
													const d = 1e-15;//-1.1102230246251565e-16 
													if (!x.between(position0[0], position1[0], true)) {

														if (!((Math.abs(x - position0[0]) < d) && (Math.abs(x - position0[0]) < d))) {

															indices.intersection = {};
															break;

														}
														//else console.log('x почти равно position0[0] и position0[0]');

													}
													vector = [x, vectorPlane[1]];

												}
												indicesIntersection(vector);
												break;
											case 3:

												var pos;

												//Если позиции вершины находится на этом расстоянии от панели, то будем считать, что она находится на панели
												//Для проверки запустить canvas 3D с geometry Variant 1 и проигрыватель в точке t = 0.6.
												//
												//В примере canvas 3D с geometry.position Variant 2 вершина точно находится на панели
												const d = 5.56e-17;

												if (Math.abs(vectorPlane[n - 1] - position1[n - 1]) < d) pos = position1;
												else if (Math.abs(vectorPlane[n - 1] - position0[n - 1]) < d) pos = position0;
												if (pos) {

													//Вершина находится на панели.
													//Для проверки запустить canvas 3D и установить время проигрывателя t = 0.3 так чтобы вершина 2 пирамиды попала на панель
													//В этом случает треугольник пересечения сведется к трем точкам с одинаковыми координатами.
													indicesIntersection([pos[0], pos[1]]);
													indices.intersection.boVerticeOnPanel = true;

												} else {

													const nD02 = new ND(n - 1, {

														plane: true,
														object: {
															
															geometry: {

																position: positionWorld.copy(),//settings.object.geometry.position,
																indices: [[indices]],
																iAxes: [1, 2],

															},
															
														},
														vectorPlane: vectorPlane.array,

													}),
														arrayIntersects02 = nD02.intersection();
													const nD12 = new ND(n - 1, {

														plane: true,
														object: {
															
															geometry: {

																position: positionWorld.copy(),//settings.object.geometry.position,
																indices: [[indices]],
																iAxes: [0, 2],

															},
														
														},
														vectorPlane: vectorPlane.array,

													}),
														arrayIntersects12 = nD12.intersection();
													indicesIntersection(arrayIntersects02.length && arrayIntersects12.length ?
														[arrayIntersects12[0][0], arrayIntersects02[0][0]] : undefined);

												}
												break;
											default:

												function intersectionAxis(axis) {

													const nD0 = new ND(2, {

														plane: true,
														object: {
															
															geometry: {

																position: positionWorld,//settings.object.geometry.position,
																indices: [[indices]],
																iAxes: [axis, n - 1],

															},
														
														},
														vectorPlane: vectorPlane.array,

													});
													return nD0.intersection();

												}
												const arrayIntersections = [];
												var boIntersect = true;
												for (var iIntersection = 0; iIntersection < n - 1; iIntersection++) {

													const item = intersectionAxis(iIntersection);
													if (boIntersect && (item.length === 0)) {

														boIntersect = false;
														break;

													}
													if (item.length) arrayIntersections.push(item[0][0]);

												}
												indicesIntersection(boIntersect ? arrayIntersections : undefined);

										}

									} else console.error('ND: settings.object.geometry.indices[]intersection. invalid name: ' + name);

								};
								return edge;

							}
							switch ( name ) {

								case 'intersection': return undefined;
								case 'edges': return edges;
								case 'isProxy': return true;

							}
							return edges[name];

						},
						set: function ( edges, prop, value ) {

							const index = parseInt( prop );
							if ( isNaN( index ) ) {

								switch ( prop ) {

									case 'length': break;
									case 'edges': settings.object.geometry.indices[0] = proxyEdges( value ); break;
									case 'selected': edges.selected = value; break;
									default: edges[prop] = value;

								}
								return true;

							}

							if ( value instanceof Array ) {

								//Do not add a duplicate edge
								for ( var i = 0; i < edges.length; i++ ) {

									const edge = edges[i];
									if (
										( ( edge[0] === value[0] ) && ( edge[1] === value[1] ) ) ||
										( ( edge[1] === value[0] ) && ( edge[0] === value[1] ) )
									) {

										//console.error('ND.proxyEdges: Duplicate edge: ' + edge);//for http://localhost/anhr/egocentricUniverse/master/Examples/2D.html
										value.index = i;
										return true;

									}

								}

								edges[index] = value;
								value.index = index;
								return true;

							}
							const indices = value;
							if ( indices.length !== 2 ) {

								console.error( 'ND: settings.object.geometry.indices.push invalid indices.length = ' + indices.length );
								return true;

							}

							//find duplicate edge
							for ( var i = 0; i < edges.length; i++ ) {

								const edgeIndices = edges[i];
								if ( ( edgeIndices[0] === indices[0] ) && ( edgeIndices[1] === indices[1] ) ) {

									console.error( 'ND: settings.object.geometry.indices.push under constraction' );
									return;

								}
								if ( ( edgeIndices[0] === indices[1] ) && ( edgeIndices[1] === indices[0] ) ) {


									console.error( 'ND: settings.object.geometry.indices.push under constraction' );
									//у этого ребра есть ребро близнец, у которого индексы вершин поменены местами
									//Поэтому можно не искать точку пересечения а брать ее из близнеца
									indices[0] = settings.object.geometry.indices[i].indices[0];
									indices[1] = settings.object.geometry.indices[i].indices[1];
									return;

								}

							}

							edges[index] = value;
							return true;

						}

					} );

			}
			var edges;
			function setEdges() {
				
				edges = settings.object.geometry.indices[0];
				var boArray = edges instanceof Array;
				if ( !settings.object.geometry.indices[0] || boArray ) {
		
					const indices = settings.object.geometry.indices;
					if ( boArray ) { if ( !indices[0].isProxy ) indices[0] = proxyEdges(); }
					else indices.push( proxyEdges() );
		
				}

			}
			setEdges();
			
			//Сгруппировать индексы ребер объета из settings.object.geometry.edges по сегментам обекта
			//Например если объект это линия:
			//n = 1
			//settings.object.geometry.indices = [0, 1]//одно ребро
			//settings.object.geometry.edges = [0, 1]
			//settings.object.geometry.iEdges = [0]
			//где
			// 0, //индекс ребра [0, 1] из settings.object.geometry.edges 
			//
			//Объект это треугольник:
			//n = 2
			//settings.object.geometry.indices = [[0, 1], [1, 2], [0, 2]]//3 ребра
			//settings.object.geometry.edges = [[0, 1], [1, 2], [0, 2]]
			//settings.object.geometry.iEdges = [0, 1, 2]
			//где
			// 0, //индекс первого  ребра [0, 1] из settings.object.geometry.edges 
			// 1, //индекс второго  ребра [0, 2] из settings.object.geometry.edges 
			// 2, //индекс третьего ребра [1, 2] из settings.object.geometry.edges 
			//
			//Объект это пирамида:
			//n = 3
			//settings.object.geometry.indices = [
			//	[[0, 1], [1, 2], [2, 0]],
			//	[[0, 1], [1, 3], [3, 0]],
			//	[[0, 2], [2, 3], [3, 0]],
			//	[[1, 2], [2, 3], [3, 1]]
			//]
			//4 грани 6 ребер. 
			//settings.object.geometry.edges = 0: (2) [
			//	[0, 1],//0
			//	[1, 2],//1
			//	[2, 0],//2
			//	[1, 3],//3
			//	[3, 0],//4
			//	[2, 3]//5
			//]
			//ребра [0, 2] и [3, 1] заменяю на [2, 0] и [1, 3]
			//settings.object.geometry.iEdges = [[0, 1, 2], [0, 3, 4], [2, 5, 4], [1, 5, 3]]
			
			function addEdge( indices ) {

				if ( settings.object.geometry.position.length < 2 ) return;//одна точка не имеет ребер
				switch ( n ) {

					case 1://Example [[0,1]]
						const edges = settings.object.geometry.indices[0];
						if ( settings.object.geometry.position ) {
							
							indices = [];
							positionWorld.forEach( function ( indice, i ) { indices.push( i ); } );
							edges.push( indices );

						}
						break;
					default: console.error( 'ND: default edges failed! n = ' + n );

				}

			}
			function proxySegments() {

				return new Proxy( [], {

					get: function ( target, name ) {

						const i = parseInt( name );
						if ( !isNaN( i ) )
							return target[i];
						switch ( name ) {

							case 'push': return target.push;
							case 'length': return target.length;
							case 'isProxy': return true;
							case 'forEach': return target.forEach;
							case 'selected': return target.selected;
							default: console.error( 'ND: settings.object.geometry.indices[' + name + ']. Invalid name: ' + name );

						}

					},
					set: function ( target, name, value ) {

						const index = parseInt( name );
						if ( isNaN( index ) ) {

							switch ( name ) {

								case 'length': break;
								case 'selected': target.selected = value; break;
								default: console.error( 'ND settings.object.geometry.indices[' + name + ']: invalid name: ' + name );
									return false;

							}
							return true;

						}
						if ( value instanceof Array === false ) {

							console.error( 'ND settings.object.geometry.indices[' + l + ']: invalid name: ' + name );
							return false;

						}

						//remove duplicate indices from value
						for ( var i = value.length - 1; i >= 0; i--  ) {
							
							for ( var j = i - 1; j >= 0; j--  ) {

								if ( value[i] === value[j] ) {

									console.error( 'nD proxySegments() set: duplicate index = ' + value[i] );
									value.splice( i, 1 );
									continue;
									
								}
								
							}

							
						}

						//Do not add a duplicate segment
						for ( var i = 0; i < target.length; i++ ) {

							const segment = target[i],
								aDetected = [];//список индексов, которые уже встечались в текущем сегменте
							if ( segment.length !== value.length )
								continue;//segment не может быть дупликатным если его длинна не равно длинне value
							for ( var j = 0; j < segment.length; j++ ) {

								aDetected[j] = false;
								for ( var k = 0; k < value.length; k++ ) {

									if ( segment[j] === value[k] ) {

										aDetected[j] = true;
										break;

									}

								}

							}
							var boDetected = true;
							for ( var j = 0; j < aDetected.length; j++ ) {

								if ( !aDetected[j] ) {

									boDetected = false;
									break;

								}

							}
							if ( boDetected ) {

								value.index = i;
								return true;

							}

						}

						target[index] = value;
						value.index = index;
						return true;

					}

				} );

			}
			function addEdges( level, geometry, positionIndices = [], levelIndices ) {

				if ( positionIndices.length === 0 ) positionWorld.forEach( function ( position, i ) { positionIndices.push( i ); } );
				geometry = geometry || settings.object.geometry;
				if ( !geometry.indices[0] ) geometry.indices[0] = [];
				const edges = geometry.indices[0];
				if ( ( n === 2 ) && ( geometry.position.length === 2 ) ) {

					edges.push( [0, 1] );
					return;

				}
				if ( level === undefined ) return;
				if ( level > 2 ) { 
					
					for ( var i = 0; i < positionIndices.length; i++ ) {

						const posIndices = [];
						positionIndices.forEach( function ( indice, j ) { if ( positionIndices[i] !== positionIndices[j] ) posIndices.push( positionIndices[j] ); } );
						const lIndices = [];//тут перечислены индексы всех индексов, котоые были добавлены в settings.object.geometry.indices
						addEdges( level - 1, undefined, posIndices, lIndices );
						if ( lIndices.length ) {

							const l = level - 2;
							if ( l === 0 ) console.error( 'ND addEdges: invalid l = ' + 1 );
							settings.object.geometry.indices[l] = settings.object.geometry.indices[l] === undefined ? proxySegments() : settings.object.geometry.indices[l];
							settings.object.geometry.indices[l].push( lIndices );
							if ( levelIndices ) levelIndices.push( lIndices.index );

						}

					}

				}
				switch ( level ) {

					case 2:
						
						//перечислены индексы вершин, которые образуют грань и которые составляют замкнутую линию ребер грани.
						//По умолчанию для грани в виде треугольника индексы вершин совпадают с положением вершины в 
						//settings.object.geometry.position т.е. positionIndices = [0, 1, 2]
						if ( !positionIndices ) {
							
							positionIndices = [];
							settings.object.geometry.position.forEach( function ( item, i ) { positionIndices.push( i ); } );

						}
						const length = positionIndices.length;
						
						function addItem( start = 0 ) {
							
							for (var i = start; i < length; i++) {

								if (start === 0)
									addItem(i + 1);
								else {

									const edge = [positionIndices[start - 1], positionIndices[i]];
									edges.push(edge);
									if (levelIndices) levelIndices.push(edge.index);

								}

							}
							/*Это было добавлено в commit 'Update ND.js' 'устранил бесконечный цикл добавления ребра'
							 * Но при этом стало некорректно работать intersection
							 * Смотри пример в http://localhost/anhr/commonNodeJS/master/nD/Examples/
							 * Что то не получается воспроизвести бесконечный цикл добавления ребра
							for ( var i = start; i < length; i++ ) {
								
								if ( start === 0 ) {
									
									if (!addItem( i + 1 )) return false;
									
								} else {
									
									const edge = [ positionIndices[start - 1], positionIndices[i] ], length = edges.length;
									edges.push( edge );
									if (length === edges.length) return false;//новое ребро не добавилось. Эта проверка появилась во время отладки http://localhost/anhr/egocentricUniverse/master/Examples/2D.html
																				//Иначе будет бесконечный цикл
									if ( levelIndices ) levelIndices.push( edge.index );

								}
			
							}
							return true;
							*/
			
						}
						addItem();
						break;
					
				}

			}
			function appendEdges() {
				
				switch ( n ) {
		
					case 1://[0, 1]
						addEdge();
						break;
					default: if ( settings.object.geometry.indices[0].length === 0 ) addEdges( n );
		
				}

			}
			appendEdges();

			if ( settings.object.geometry.indices.boAddIndices ) {

				//В каждом сегменте geometry.indices[i] должно встечаться определенное количество индексов из передыдущего сегмента
				//geometry.indices[i - 1]. В противном случае в geometry.indices[i] добавляем новый элемент, в который добавляем
				//индексы из передыдущего сегмента geometry.indices[i - 1].
				//Это нужно для того, что бы во время пересечения объекта с plane появлялся замкнутый intersection.
				//Например после пересечения 3 мерного объекта с plane получалась замкнутая линия, тоесть начало и конец линии соединяем дополнительным ребром.
				//Для проверки в примере запускаем _4D и _3D
				const indices = settings.object.geometry.indices;
				for( var i = 1; i < indices.length; i++ ) {
		
					const indice = indices[i];
					const arrayIndices = [];//Каждый элемент этого массива показывает сколько раз встречается индекс в сегменте geometry.indices[i].
					var max = 0;//максимальное количество сколько раз встречается индекс в сегменте geometry.indices[i].
					for ( var j = 0; j < indice.length; j++ ) {
		
						const segment = indice[j];
						for ( var k = 0; k < segment.length; k++ ) {
		
							const index = segment[k];
							if ( arrayIndices[index] === undefined ) arrayIndices[index] = 0;
							arrayIndices[index]++;
							if ( arrayIndices[index] > max ) max = arrayIndices[index];
		
						}
							
					}
					const arraySegment = [];//сюда добавляю все индексы, котоые встречаются меньше нужного
					for ( var j = 0; j < arrayIndices.length; j++ ) {
		
						if ( arrayIndices[j] < max ) arraySegment.push( j );
						
					}
					if ( arraySegment.length > 0 ) indice.push( arraySegment );
						
				}

			}
			
			var vectorPlane;

			const geometry = {

				get position() {

					//https://stackoverflow.com/questions/2449182/getter-setter-on-javascript-array
					return new Proxy( this, {

						get: function ( target, name ) {

							switch ( name ) {

								case 'length':
									return settings.object.geometry.position.length;

							}
							const i = parseInt( name );
							if ( isNaN( i ) ) {

								console.error( 'ND.geometry.position: invalid name: ' + name );
								return;

							}
							return new Vector( positionWorld[i] );

						},

					} );

				},
				get copy() {
					
					const copySettings = {
						
						geometry: { position: [], indices: [] },
						position: [],
						rotation: [],
						aObjects: settings.object.aObjects,
						name: settings.object.name,
						
					};
					settings.object.geometry.position.forEach( vertice => {
						
						const copy = [];
						vertice.forEach( axis => copy.push(axis) );
						copySettings.geometry.position.push( copy );
						
					} );
					settings.object.geometry.indices.forEach( indexes => {
						
						const copy = [];
						indexes.forEach( arrayIndex => {
							
							const copyArrayIndex = [];
							if ( arrayIndex.indices ) arrayIndex = arrayIndex.indices;
							arrayIndex.forEach( index => copyArrayIndex.push(index) );
							copy.push(copyArrayIndex);
						
						} );
						copySettings.geometry.indices.push( copy );
						
					} );
					function copyItem( array ){
						
						const copy = [];
						array.forEach( item => { copy.push( item ); } );
						return copy;
						
					}
					copySettings.position = copyItem( settings.object.position );
					settings.object.rotation.boUseRotation = true;
					copySettings.rotation = copyItem( settings.object.rotation );
					settings.object.rotation.boUseRotation = false;
					return copySettings;
				
				},
				get geometry() { return settings.object.geometry },
				set geometry( geometry ) {
					
					settings.object.geometry.position = geometry.position;
					if ( geometry.indices ) {
						
						settings.object.geometry.indices.length = 1;
						for ( var i = 0; i < geometry.indices.length; i++ ) {
							
							if ( i === 0 ) {

								//убрать edge.intersection, который был создан в ND более высокого уровня, а поэтому в нем указан неверный settings.object.geometry.iAxes, что приводит к перепутыванию осей
								settings.object.geometry.indices[0].edges.length = 0;
								geometry.indices[0].forEach( edge => settings.object.geometry.indices[0].edges.push( edge.indices === undefined ? edge : edge.indices ) );
								
							} else settings.object.geometry.indices[i] = geometry.indices[i];

						}

					} else delete settings.object.geometry.indices;
					
				},
				//Projection of nD object to 3D space for visualization
				D3: {
					
					//Returns a points of projection
					get points() { return _ND.bufferGeometry.userData.position; },
					//returns indices of the faces vertices
					get faceIndices() {

						const aFaceIndices = [];
						const indices = settings.object.geometry.indices;
						if ( indices.length < 2 ) return aFaceIndices;
						indices[1].forEach( face => {
							
							const faceVertices = [];
							face.forEach( ( edge, iEdge ) => {
								
								if ( iEdge > 2 ) {

									console.error( 'ND: geometry.D3.faceIndices get. invalid face edges count.');
									return;
									
								}
								const edgeVertices = indices[0][edge].indices;
								if ( faceVertices.length === 0 ) {

									faceVertices.push( edgeVertices[0] );
									faceVertices.push( edgeVertices[1] );

								} else {

									var boVertice0 = false, boVertice1 = false;
									for ( var i = 0; i < faceVertices.length; i++ ) {

										const faceVertice = faceVertices[i];
										if ( faceVertice === edgeVertices[0] ) boVertice1 = true;
										else if ( faceVertice === edgeVertices[1] ) boVertice0 = true;
										
									}
									if ( !boVertice0 && !boVertice1 ) console.error( 'ND: geometry.D3.faceIndices get. Missing push');
									else if ( boVertice0 != boVertice1 ) {

										faceVertices.push( edgeVertices[boVertice0 ? 0 : 1] );
										
									}//else вершины третьего ребра совпадают с одной оз вершин первого и второго ребра
									
								}
								
							});
							if ( faceVertices.length === 3 ) aFaceIndices.push( faceVertices[0], faceVertices[1], faceVertices[2] );
							else console.error( 'ND: PolyhedronGeometry: subdivide. Invalid face vertices count');
							
						});
						return aFaceIndices;

					},
					//Returns an indices of projection
					get indices() {

						const indices = [], colors = [];
						//если объект не состоит из одной вершины и имеет ребера
						if ( settings.object.geometry.indices[0].length !== 0 ) {

							const edges = settings.object.geometry.indices[0];
							for ( var i = 0; i < edges.length; i++ ) {
		
								let edge = edges[i];//.indices;
								if ( edge !== undefined ) {
									
									if ( edge.length === undefined ) edge = [0, 1];//for compatibility with EgocentricUniverse
									if ( edge.length !== 2 ) {

										console.error( 'ND.geometry.D3.get indices: invalid edge.length = ' + edge.length );
										return;
		
									}
									if ( edge[0] === edge[1] ) {
		
										console.error( 'ND.geometry.D3.get indices: duplicate edge index = ' + edge[0] );
										return;
		
									}
									
									//indices.push( ...edge );//incompatible with https://raw.githack.com/anhr/egocentricUniverse/dev/1D.html
									edge.forEach( vertice => indices.push( vertice ) );
									
									if ( this.color && ( typeof this.color != "object") ) {

										//одинаковый цвет для всех ребер
										const color = new THREE.Color(this.color);
										function hexToRgb(hex) {
										  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
										  return result ? {
										    r: parseInt(result[1], 16),
										    g: parseInt(result[2], 16),
										    b: parseInt(result[3], 16)
										  } : null;
										}
										const rgb = hexToRgb( color.getHexString() );
										function push() {
											
											colors.push( rgb.r );
											colors.push( rgb.g );
											colors.push( rgb.b );
		
										}
										push();
										if ( edges.length === 1 ) push();//Это линия. Надо установить цвет конца
		
									}
		
								} else console.error( 'ND.geometry.D3.get indices: invalid edge. Возможно вычислены не все точки пересечения' );
								
							}
							if (this.color && (typeof this.color === "object")) {

								//цвет вершин
								if ( colors.length != 0 ) console.error('ND.geometry.D3.get vrtices colors: Invalid colors.length = ' + colors.length);
								settings.object.geometry.position.forEach( vertice => {

									const rgb = settings.options.palette.toColor(vertice.w, settings.options.scales.w.min, settings.options.scales.w.max );
									colors.push(rgb.r);
									colors.push(rgb.g);
									colors.push(rgb.b);

								} );

							}

						}
						_ND.bufferGeometry.setIndex(indices);
						if ( _ND.setDrawRange ) _ND.setDrawRange( 0, indices.length, _ND.bufferGeometry.drawRange.types.edges );//Если тут не установить drawRange, то будут отбражаться не все ребра в http://localhost/anhr/universe/main/hyperSphere/Examples/ 
						return { indices: indices, colors: colors, };

					},

				},

			};
			const points = [];
			for ( var i = 0; i < geometry.position.length; i++ )
				points.push( geometry.position[i].point );
			this.getPoint = (i) => { return points[i]; };
			this.setPositionAttributeFromPoints( points );

			vectorPlane = vectorPlane || new Vector( settings.vectorPlane );
			if ( !vectorPlane || !vectorPlane.point ) vectorPlane = new Vector( vectorPlane );

			var objectIntersect;//порекция объека пересечения панеди с графическим объектом на 3D пространство.

			this.opacity = ( object3D, transparent, opacity ) => { _ND.verticesOpacity( transparent, opacity ); };

			//The user has selected a segment of nD object
			const selectSegment = {

				line: undefined,//segment of nD object, selected by user
				removeLine: function (line) {

							if (line) {

								line.parent.remove(line);
								line = undefined;

							}
					return line;

				},
				opacityDefault: 0.3,
				opacityItem: function (item, parentObject, transparent, opacity = selectSegment.opacityDefault) {

					if (!item.material) return;
					if (transparent && (opacity === 0) && (Object.is(item.parent, parentObject))) parentObject.remove(item);
					else {

						if (!item.parent) parentObject.add(item);
						_ND.opacity( item, transparent, opacity );

					}

				}

			};

			function create3DObject( geometry, settings3D = {} ) {

				let nD;
				if ( !geometry.D3 ) {

					nD = new ND( n, {
						
						plane: true,
						object: { geometry: geometry, color: settings3D.color, },
					
					} );
					geometry = nD.geometry;
					
				} else nD = _ND;
				if (geometry.position.length === 0) return;
				const color = settings3D.color || 'white';//0xffffff
				geometry.D3.color = color;
				const indices3D = geometry.D3.indices, indices = indices3D.indices;

				const buffer = nD.bufferGeometry;
				
				if ( settings3D.faces ) {

					if ( settings3D.faces === true ) settings3D.faces = {};
					if ( settings3D.faces.color === undefined ) settings3D.faces.color = color;
					if ( settings3D.faces.opacity === undefined ) settings3D.faces.opacity = 0.5;
					if ( settings3D.faces.transparent === undefined ) settings3D.faces.transparent = true;
					buffer.setIndex( geometry.D3.faceIndices );
					buffer.computeVertexNormals ();

				} else if ( buffer.index === null ) buffer.setIndex( indices );
				let lineBasicMaterialParameters;
				
				lineBasicMaterialParameters = {
					
					vertexColors: true,
					toneMapped: false,
				
				};
				if ( settings.object.geometry.opacity ) lineBasicMaterialParameters.transparent = true;//установлена прозрачность вершин
				
				const object = indices.length > 1 ?
					settings3D.faces ?
						new THREE.Mesh(buffer, new THREE.MeshLambertMaterial({
							
							color: color,
							opacity: settings3D.faces.opacity,
							transparent: settings3D.faces.transparent,
							side: THREE.DoubleSide
							
						} ) ) :
						new THREE.LineSegments( buffer, new THREE.LineBasicMaterial( lineBasicMaterialParameters ) ) :
					new THREE.Points( buffer, new THREE.PointsMaterial( {
						
						color: color,
						sizeAttenuation: false,
						size: options.point.size / ( options.point.sizePointsMaterial * 2 ),
						
					} ) );
				if ( settings3D.name )
					object.name = settings3D.name;
				
				scene.add( object );

				object.userData.myObject = nD;
				object.userData.geometry = geometry.geometry;
				object.userData.onMouseDown = function ( intersection ) {

					const indices = geometry.geometry.indices, segmentIndex = 0,//edges
						segment = indices[segmentIndex], selectedIndex = segment.selected;

					selectSegment.line = selectSegment.removeLine(selectSegment.line );
					const opacityDefault = intersection.event && intersection.event.button === 0 ? selectSegment.opacityDefault : 1, parentObject = object;
					function opacity( transparent = true, opacity = opacityDefault ) {

						scene.children.forEach(item => selectSegment.opacityItem(item, parentObject, transparent, opacity));

					}
					opacity();
					
					const buffer = new THREE.BufferGeometry().setFromPoints( geometry.D3.points );
					const lineIndices = [];
					function createIndices( item, level ) {

						if ( level > 0 ) {

							level--;
							for ( var i = 0; i < item.length; i++ ) createIndices( indices[level][item[i]], level );
							return;

						}
						const itemIndices = item.indices || item;
						if ( itemIndices.length !== 2 ) console.error( 'ND: createIndices. Invalid itemIndices.length = ' + itemIndices.length );
						var boDetected = false;
						for ( var lineIndicesIndex = 0; lineIndicesIndex < lineIndices.length; lineIndicesIndex += 2 ) {

							if ( ( lineIndices[lineIndicesIndex] === itemIndices[0] ) && ( lineIndices[lineIndicesIndex + 1] === itemIndices[1] ) ) {

								boDetected = true;
								break;
								
							}
							
						}
						if ( !boDetected ) itemIndices.forEach( i => { lineIndices.push( i ); } );

					}
					createIndices( segment[selectedIndex], segmentIndex );
					
					selectSegment.line = new THREE.LineSegments( buffer.setIndex( lineIndices ), new THREE.LineBasicMaterial( { color: object.material.color, } ) );

					parentObject.add( selectSegment.line );
					
				};
				object.userData.nd = function ( fParent, dat, gui = false, boUpdate = false ) {

					if ( !object.userData.nd.update )object.userData.nd.update = function(){ object.userData.nd( fParent, dat, gui, true ); };

					if ( !boUpdate ) {
						
						if ( fParent.parent.fCustom ) {
		
							fParent.parent.fCustom.parent.removeFolder( fParent.parent.fCustom );
							fParent.parent.fCustom = undefined;
							
						}				
						if ( !gui && geometry.geometry.gui )
							fParent.parent.fCustom = geometry.geometry.gui( fParent, dat, settings.options, _ND );

					}

					//Localization

					const getLanguageCode = options.getLanguageCode;

					const lang = {

						vertices: 'Vertices',
						verticesTitle: 'Vertices.',

						edges: 'Edges',
						edgesTitle: 'The selected edge lists the vertex indices of the edge.',
						distance: 'Distance',
						distanceTitle: 'Distance between edge vertices.',

						faces: 'Faces',
						facesTitle: 'The selected face lists the indexes of the edges of that face.',
						bodies: 'Bodies',
						bodiesTitle: 'The selected body lists the indexes of the faces of this body.',
						objects: 'Objects',
						objectsTitle: 'The selected object lists the indexes of the objects that this object consists of. It can be indexes of bodies.',

						position: 'Position',

						rotation: 'Rotation',
						rotationPointTitle: 'Rotation point',
						rotationAxisTitle: 'Rotation axis',
						rotationPlaneTitle: 'Axes of plane of rotation.',
						rotationSpaceTitle: 'Axes of space of rotation.',
						rotationnDSpaceTitle: 'Axes of multi dimensional space of rotation.',

						defaultButton: 'Default',
						defaultPositionTitle: 'Restore default position',
						defaultRotationTitle: 'Restore default rotation',

						notSelected: 'Not selected',

					};

					const _languageCode = getLanguageCode();

					switch ( _languageCode ) {

						case 'ru'://Russian language

							lang.vertices = 'Вершины';
							lang.verticesTitle = 'Вершины.';

							lang.edges = 'Ребра';
							lang.edgesTitle = 'В выбранном ребре перечислены индексы вершин ребра.';
							lang.distance = 'Расстояние';
							lang.distanceTitle = 'Расстояние между вершинами ребра.';

							lang.faces = 'Грани';
							lang.facesTitle = 'В выбранной грани перечислены индексы ребер этой грани.';
							lang.bodies = 'Тела';
							lang.bodiesTitle = 'В выбранном теле перечислены индексы граней этого тела.';
							lang.objects = 'Объекты';
							lang.objectsTitle = 'В выбранном объекте перечислены индексы объектов, из которого состоит этот объект. Это могут быть индексы тел.';

							lang.position = 'Позиция';

							lang.rotation = 'Вращение';
							lang.rotationPointTitle = 'Точка вращения.';
							lang.rotationAxisTitle = 'Ось вращения.';
							lang.rotationPlaneTitle = 'Оси плоскости вращения.';
							lang.rotationSpaceTitle = 'Оси пространства вращения.';
							lang.rotationnDSpaceTitle = 'Оси многомерного пространства вращения..';

							lang.defaultButton = 'Восстановить';
							lang.defaultPositionTitle = 'Восстановить позицию объекта по умолчанию';
							lang.defaultRotationTitle = 'Восстановить вращение объекта по умолчанию';

							lang.notSelected = 'Не выбран';

							break;

					}
					for ( var i = fParent.__controllers.length - 1; i >= 0; i-- ) { fParent.remove( fParent.__controllers[i] ); }
					
					const indices = geometry.geometry.indices, segmentIndex = indices.length - 1;
					function addController(
						segmentIndex,//settings.object.geometry.indices index
						fParent,
						segmentItems,//массив индексов элементов текущего segment, которые выбрал пользователь
						prevLine//выбранный пользователем сегмент объекта на более высоком уровне. Например если пользователь выбрал ребро то prevLine указывает на выбранную пользователем грань
					) {

						_prevLine.prevLine = prevLine;
						var segment;
						if ( segmentItems ) {

							function addItem( item, i ) {

								item.i = i;
								segment.push( item );

							}
							segment = [];
							if ( segmentIndex === -1 ) {

								//vertices
								//непонятно почему, но для 2D вершины перечислены в segmentItems.indices
								if ( segmentItems.forEach )
									segmentItems.forEach( i => addItem( geometry.geometry.position[i], i ) );
								else segmentItems.indices.forEach( i => addItem( geometry.geometry.position[i], i ) );
								
							} else {
								
								//indices
								const index = indices[segmentIndex];
								segmentItems.forEach( i => addItem( index[i].indices ? index[i].indices : index[i], i ) );

							}
							
						}else segment = indices[segmentIndex];
						const items = { Items: [lang.notSelected] };
						var fChildSegment, line;
						var name, title;
						switch ( segmentIndex ) {

							case -1: name = lang.vertices; title = lang.verticesTitle; break;
							case 0: name = lang.edges; title = lang.edgesTitle; break;
							case 1: name = lang.faces; title = lang.facesTitle; break;
							case 2: name = lang.bodies; title = lang.bodiesTitle; break;
							default: name = lang.objects; title = lang.objectsTitle;

						}
						const fSegment = fParent.addFolder( name );
						let cDistance;
						fSegment.userData = { objectItems: true, };
						dat.folderNameAndTitle( fSegment, name, title );
						switch ( segmentIndex ) {

							case 0://edges
								cDistance = dat.controllerZeroStep( fSegment, { value: 0, }, 'value' );
								cDistance.domElement.querySelector( 'input' ).readOnly = true;
								dat.controllerNameAndTitle( cDistance, lang.distance, lang.distanceTitle );
								break;

						}
						const cSegment = fSegment.add( items, 'Items', { [lang.notSelected]: -1 } ).onChange( function ( value ) {

							if ( fChildSegment ) {
								
								fChildSegment.__controllers.forEach( ( item, i ) => {
									
									const controller = fChildSegment.__controllers[i];
									if ( controller.__select && ( controller.__select.selectedIndex != 0 ) ) {
										
										controller.__select.selectedIndex = 0;
										controller.__onChange();
		
									}

								} );
								fSegment.removeFolder( fChildSegment );
								fChildSegment = undefined;

							}
							const selectedIndex = cSegment.__select.selectedIndex - 1;
							line = selectSegment.removeLine(line);
							const parentObject = object;
							function opacity(transparent = true, opacity = selectSegment.opacityDefault ) {

								scene.children.forEach(item => selectSegment.opacityItem(item, parentObject, transparent, opacity));

							}

							//Непонятно почему, но прозрачность линии зависит от индекса текущего сегмента segmentIndex.
							//Для проверки открыть холст 5D.
							//Если в 5D прозрачность делать постоянной 0.3, то при выборе тела (body) из объета, объект буден практически непрозрачным
							function getOpacity() {
								
								return -0.1 * segmentIndex + selectSegment.opacityDefault;
								
							}

							function removeVerticeControls(){

								if ( segmentIndex !== -1 ) return;
								for ( var i = fSegment.__controllers.length - 1; i >=0 ; i-- ) {

									const controller = fSegment.__controllers[i];
									if ( Object.is(cSegment, controller) ) continue;
									fSegment.remove(controller);
									
								}
								
							}

							if ( selectedIndex === -1 ) {

								switch ( segmentIndex ) {
				
									case 0://edges
										cDistance.setValue( '' );
										break;
				
								}
								
								removeVerticeControls();
								if ( prevLine ) {

									selectSegment.opacityItem(prevLine, parentObject, false);
									if (prevLine.userData.prevLine) selectSegment.opacityItem(prevLine.userData.prevLine, parentObject, true, getOpacity() );
									else opacity( true );
									return;
									
								}
								opacity( false );
								return;

							}
							if ( prevLine ) {
								
								opacity(true, 0);
								selectSegment.opacityItem(prevLine, parentObject, true, getOpacity() );
								if (prevLine.userData.prevLine) selectSegment.opacityItem(prevLine.userData.prevLine, parentObject, true, 0 );

							} else opacity();
							if ( segmentIndex === -1 ) {

								//Vertices
								removeVerticeControls();

								//если так сделать, то при выборе объекта пересечения почемуто исчезают _prevLine.prevLine и object3D
								//и как результат появляется ошибка когда пользователь изменяет положение вершины
	//							const vertice = geometry.geometry.position[segment[selectedIndex].i];

								const vertice = settings.object.geometry.position[segment[selectedIndex].i];
								for ( var i = 0; i < vertice.length; i++ ) {
									
									switch(i){

										case 0:
										case 1:
										case 2:
											var axis;
											switch(i){
			
												case 0: axis = options.scales.x; break;
												case 1: axis = options.scales.y; break;
												case 2: axis = options.scales.z; break;
													
											}
											fSegment.add( vertice, i, axis.min, axis.max, ( axis.max - axis.min ) / 100 );
											break;
										default: dat.controllerZeroStep( fSegment, vertice, i );
											
									}

								}
								
							} else {
								
								const buffer = new THREE.BufferGeometry().setFromPoints( geometry.D3.points );
								const lineIndices = [];
								function createIndices( item, level ) {
		
									if ( level > 0 ) {
		
										level--;
										for ( var i = 0; i < item.length; i++ ) createIndices( indices[level][item[i]], level );
										return;
		
									}
									const itemIndices = item.indices || item;
									if ( itemIndices.length !== 2 ) console.error( 'ND: createIndices. Invalid itemIndices.length = ' + itemIndices.length );
									var boDetected = false;
									for ( var lineIndicesIndex = 0; lineIndicesIndex < lineIndices.length; lineIndicesIndex += 2 ) {

										if ( ( lineIndices[lineIndicesIndex] === itemIndices[0] ) && ( lineIndices[lineIndicesIndex + 1] === itemIndices[1] ) ) {

											boDetected = true;
											break;
											
										}
										
									}
									if ( !boDetected ) itemIndices.forEach( i => { lineIndices.push( i ); } );
		
								}
								createIndices(segment[selectedIndex], segmentIndex);
								line = new THREE.LineSegments(buffer.setIndex(lineIndices), new THREE.LineBasicMaterial({ color: object.material.color }));

								switch ( segmentIndex ) {
				
									case 0://edges

										//debug
										if ( lineIndices.length != 2 ) {
											
											console.error( 'ND: Select edge. Invalid lineIndices.length = ' + lineIndices.length );
											break;

										}
											
										const position0 = geometry.geometry.position[lineIndices[0]],
											position1 = settings.object.geometry.position[lineIndices[1]];
										if (position0.length && position1.length) cDistance.setValue( position0.distanceTo(position1) );
										else console.error("ND: Select edge. Invalid edge's vertices distance");
										break;
				
								}

								//debug
								line.userData.name = fSegment.name + ' ' + value;

								parentObject.add( line );

							}
							if (prevLine && line) line.userData.prevLine = prevLine;
							if (segmentIndex >= 0) fChildSegment = addController(segmentIndex - 1, fSegment, segment[selectedIndex], line);

						} );
						dat.controllerNameAndTitle(cSegment, '');
						var selectedItem = 0;

						const selected = segmentIndex >= 0 ? indices[segmentIndex].selected : undefined;
						var selectedOpt;//debug
						for ( var i = 0; i < segment.length; i++ ) {

							const item = segment[i], opt = document.createElement( 'option' ),
								itemIndex = item.index != undefined ? item.index : item.i != undefined ? item.i : i;
							opt.innerHTML = '(' + (item.i === undefined ? i : item.i) + ') ' + (segmentIndex === -1 ? '' : ( item.indices ? item.indices : item ).toString() );
							opt.item = item;
							if ( ( selected != undefined) && ( selected === itemIndex ) ) {
								
								selectedOpt = opt;//debug
								selectedItem = i + 1;

							}
							cSegment.__select.appendChild( opt );

						}
						if ( selected && !selectedOpt ) console.error( 'ND: addController. Selected item was not detected' );
						cSegment.__select[selectedItem].selected = true;
						if ( selectedItem != 0 ) {
							
							cSegment.__select.selectedIndex = selectedItem;
							cSegment.setValue( cSegment.__select[selectedItem].innerHTML );

						}
						return fSegment;

					}
					const childFolders = Object.keys(fParent.__folders);
					childFolders.forEach( folderName => {

						const childFolder = fParent.__folders[folderName];
						childFolder.__controllers.forEach( ( item, i ) => {

							var controller;
							if ( childFolder.userData && childFolder.userData.objectItems ) controller = childFolder.__controllers[i];
							else if ( folderName === 'indices' ) {
								
								//ищем controller в GuiIndices
								Object.keys( childFolder.__folders ).forEach( folderName => {
		
									if ( !controller ) {
		
										const folder = childFolder.__folders[folderName];
										if ( folder.userData && folder.userData.objectItems ) controller = folder.__controllers[i];
		
									}
								});
		
							}
							if ( controller && controller.__select && controller.__select.selectedIndex != 0 ) {
								
								controller.__select.selectedIndex = 0;
								controller.__onChange();
		
							}
							
						} );
						if ( !childFolder.customFolder )  fParent.removeFolder( childFolder );
						
					} );
					const fPosition = fParent.addFolder( lang.position ),
						fRotation = n < 2 ? undefined : fParent.addFolder( lang.rotation );
					function rotation( i ) {
						
						if ( rotationAxes[i].length === 0 ) return;
						settings.object.rotation.boUseRotation = true;
						settings.object.rotation.folders[i] = {

							cRotation: fRotation.add( settings.object.rotation, i, 0, Math.PI * 2, 0.01 ).onChange( function ( value ) { update(); } ),
							default: settings.object.rotation[i],

						};
						var name = '', title = '';
						rotationAxes[i].forEach( axis => name = name + ( name.length === 0 ? '' : ',' ) + axis );
						switch( n ){

							case 2: title = lang.rotationPointTitle; break;
							case 3: title = lang.rotationAxisTitle; break;
							case 4: title = lang.rotationPlaneTitle; break;
							case 5: title = lang.rotationSpaceTitle; break;
							default: title = lang.rotationnDSpaceTitle; break;
								
						}
						dat.controllerNameAndTitle( settings.object.rotation.folders[i].cRotation, n === 2 ? '2' : name, title );
						settings.object.rotation.boUseRotation = false;
						
					}
					for ( var i = 0; i < n; i++ ) {

						const axisName = i;

						//position
						{
							
							const f = fPosition.addFolder( axisName );
							settings.object.position.folders[i] = {
		
								positionController: new PositionController( function ( shift ) { settings.object.position[axisName] += shift; },
									{ getLanguageCode: options.getLanguageCode, } ),
								default: settings.object.position[i],
		
							};
							f.add( settings.object.position.folders[i].positionController );
		
							settings.object.position.folders[i].cPosition = dat.controllerZeroStep( f, settings.object.position, i, function ( value ) { update(); } );
							dat.controllerNameAndTitle( settings.object.position.folders[i].cPosition, axisName );

						}

					}
					
					//rotation
					if ( n === 2 ) rotation( 0 );//поворот только вокруг оси 2
					else rotationAxes.forEach( (item, i ) => rotation( i ) );


					//Restore default position.
					const buttonPositionDefault = fPosition.add( {
		
						defaultF: function ( value ) { settings.object.position.folders.forEach( item => item.cPosition.setValue( item.default ) ); },
		
					}, 'defaultF' );
					dat.controllerNameAndTitle( buttonPositionDefault, lang.defaultButton, lang.defaultPositionTitle );

					//Restore default rotation.
					if ( fRotation ) {
						
						const buttonRotationDefault = fRotation.add( {
		
							defaultF: function ( value ) { settings.object.rotation.folders.forEach( item => item.cRotation.setValue( item.default ) ); },
		
						}, 'defaultF' );
						dat.controllerNameAndTitle( buttonRotationDefault, lang.defaultButton, lang.defaultRotationTitle );

					}
					
					addController( segmentIndex, fParent );
				
				};
				if ( options.guiSelectPoint ) options.guiSelectPoint.addMesh( object );

				//raycaster
				if (settings.isRaycaster != false) {
					
					object.userData.raycaster = {
		
						onIntersection: function ( intersection, mouse ) {
		
							intersection.indexNew = intersection.index;
							//если убрать строку ниже, то будет ошибка
							//Cannot read properties of undefined (reading 'cameraTarget')
							//в строке
							//if (!func.cameraTarget)
							//в функции this.changeTarget класса Player.cameraTarget в файле player.js
							//
							//Но зато будут видны иденксы точек, ребер, граней и т.д. если навести мышку на многомерную фигуру
							//
							//Лень разбираться почему так сделал.
							//Для решения проблемы создаю новую переменную intersection.indexNew. Смотри строку выше.
							//
							//Для тестирования запусить http://localhost/anhr/commonNodeJS/master/nD/Examples/
							//На холсте 5D щелкнуть мышкой на Object или Intersection.
							delete intersection.index;
		
							Options$1.raycaster.onIntersection( intersection, options, scene, options.camera, options.renderer );
		
						},
						onIntersectionOut: function () {
							
							//когда мышка покидает объект, нужно удалить индексы ребер, граней и т.д., над которыми была мышка.
							//В противном случае, когда выбираешь объект в dat.GUI, 
							//автоматически веберется ребро, грань и т.д. над которыми последний раз была мышка
							//Визуально это вызывает недоумение у пользователя
							geometry.geometry.indices.forEach( indice => indice.selected = undefined );
							
							Options$1.raycaster.onIntersectionOut( scene, options.renderer );
						
						},
						onMouseDown: function ( intersection, event ) {
							
							intersection.event = event;//Теперь можно выполнять разные действия в зависимости от нажатой кнопки мыши
							Options$1.raycaster.onMouseDown( intersection, options );
						
						},
						text: settings.object.raycaster ? settings.object.raycaster.text : undefined,
		
					};
					if ( options.eventListeners ) options.eventListeners.addParticle( object );
		
				}
		
				return object;

			}
			/**
			 * @returns an array of intersection points of <b>vectorPlane</b> and <b>geometry</b>. See constructor for details.
			 * @param {geometryIntersection} [geometryIntersection = { position: [], indices: [[]] }] Arrays of vertices and indexes of the result of the intersection of the panel and the nD object. See <b>settings.object.geometry</b> of <b>ND</b> constructor for details.
			 * @param {array} [geometryIntersection.position] Array of vertices of the result of the intersection. See <b>settings.object.geometry.position</b> of <b>ND</b> constructor for details.
			 * @param {array} [geometryIntersection.indices] Array of <b>indices</b> of vertices of the result of the intersection. See <b>settings.object.geometry.indices</b> of <b>ND</b> constructor for details.
			 * @param {array} [iIntersections] Array of indices that have been added to <b>geometryIntersection.indices</b>
			 */
			this.intersection = function ( geometryIntersection = { position: [], indices: [[]] }, iIntersections ) {

				if ( settings.plane === false ) return;
				
				function intersection( iEdge, aEdge ) {
					
					for ( var i = 0; i < geometryIntersection.position.length; i++ ) {
						
						if ( geometryIntersection.position[i].iEdge === iEdge ) {

							//duplicate position
							if (
								aEdge &&
								( aEdge.length < 2 )//Длинна ребра линии пересечения получается больше 2 если ребро объекта лежит на пенели.
													//Для проверки на canvas 3D сделать две вершины по оси z равными -0.4
													//И проиграть проигрыватель на t = 0.3.
							) aEdge.push( i );
							return;

						}

					}
					const edge = settings.object.geometry.indices[0][iEdge];
					edge.intersection( geometryIntersection );//, settings.object.color );
					const position = edge.intersection.position;
					if ( position ) {
						
						var boAdd = true;
						if ( edge.intersection.boVerticeOnPanel ) {

							//Вершина на панели. В этом случае все ребра, сходящиеся к этой вершине буду выдвать одну и ту же точку пересечения
							//Не нужно добавлять повторяющиеся точки.
							for ( var i = 0; i < geometryIntersection.position.length; i++ ) {

								if ( position.equals( geometryIntersection.position[i] ) ) {

									boAdd = false;
									aEdge.boVerticeOnPanel = true;
									break;
									
								}
								
							}
							
						}
						if ( boAdd ) {
							
							geometryIntersection.position.push( position );
							if ( aEdge ) aEdge.push( geometryIntersection.position.length - 1 );

						}

					}
					
				}
				if ( !geometryIntersection.position.isProxy )
					geometryIntersection.position = new Proxy( geometryIntersection.position, {
			
						get: function ( target, name, args ) {

							switch ( name ) {

								case 'isProxy': return true;
								case 'target': return target;
								case "reset":
									return function () {
		
										target.forEach( item => item.positionWorld = undefined );
		
									}
			
							}
							return  target[name];
			
						},
						set: function ( target, name, value ) {
		
							const i = parseInt( name );
							if ( isNaN( i ) ) {
								
								if ( name === "boPositionError" ) {

									target[name] = value;
									return true;

								}
								return target[name];

							}
							if ( i >= target.length ) {
		
								//find duplicate item
								var boDuplicate  = false;
								for ( var j = 0; j < i; j++ ) {
		
									boDuplicate = true;
									for ( var k = 0; k < target[j].length; k++ ) {
		
										if ( target[j][k] !== value[k] ) {
		
											boDuplicate = false;
											break;
											
										}
										
									}
									if ( boDuplicate ) break;
									
								}
								if ( !boDuplicate ) target.push( value );
								return target.length;
		
							}
							target[i] = value;
							return true;
		
						}
						
					} );
				switch ( n ) {

					case 1:
						if ( settings.object.geometry.indices.length !== 1 ) console.error( 'ND.intersection: under constraction. Это не линия.' );
						const edge = settings.object.geometry.indices[0][0];
						edge.intersection( geometryIntersection );
						break;
					case 2:
						const iFaces = settings.object.geometry.indices[1];
						if ( iFaces ) settings.object.geometry.indices[1].forEach( function ( iFace ) { iFace.forEach( function ( iEdge ) { intersection( iEdge ); } ); } );
						else {
							
							for ( var i = 0; i < settings.object.geometry.indices[0].length; i++ ) { intersection( i ); }
							addEdges( undefined, geometryIntersection );

						}
						break;
					default: {

						var iSegments = settings.iSegments || ( n - 2 ),//Индекс массива индексов сегментов settings.object.geometry.indices[iSegments]
												//для которого получаем вершины и индексы
							segments;//массив индексов сегментов для которого получаем вершины и индексы
						while( iSegments >= 0 ) {
							
							segments = settings.object.geometry.indices[iSegments];
							if ( segments ) break;
							iSegments--;

						}
						//settings.indice индекс сегмента в текущем массиве индексов сегментов settings.object.geometry.indices[iSegments][settings.indice]
						if ( settings.indice === undefined ) {

							for ( var i = 0; i < segments.length; i++ ) {

								const nd = new ND( n, {
									
									plane: true,
									object: { geometry: {
									
											indices: settings.object.geometry.indices,
											position: positionWorld.copy(),
										
										},
	//									color: 'white',
											 
									}, indice: i, iSegments: iSegments, } ),
									s = iSegments - 1;
								var iIntersections;
								if ( s !== 0 ) {//Не создавать iIntersections для ребер

									iIntersections = [];

								}
								nd.intersection( geometryIntersection, iIntersections );
								if ( iIntersections && iIntersections.length ) {

									geometryIntersection.indices[s] = geometryIntersection.indices[s] || proxySegments();
									geometryIntersection.indices[s].push( iIntersections );
									
								}

							}

							//Ищем ребра с одной вершиной. Такие ребра появляются если вершина находится на панели
							//Это нужно когда объект пересекается панелью и одна из вершин находтся на панели
							//Тода появляется два ребра с одной вершиной. Я их удаляю и объединяю в одно ребро.
							//Для проверки запустить canvas 3D с geometry Variant 1 и проигрыватель установить на t = 0.6
							const edges = geometryIntersection.indices[0];
							var vertices = [];//список вершин ребер с одной вершиной.
							for ( var i = edges.length - 1; i >= 0; i-- ) {

								const edge = edges[i];
								if ( edge.boVerticeOnPanel && ( edge.length === 1 ) ) {
									
									vertices.push( edge[0] );
									edges.splice( i, 1 ); 

								}

							}
							switch( vertices.length ) {

								case 0:
								case 1://одна вершина находится на панели
									break;
								case 2:
									edges.push( vertices );
									break;
								default: console.error( 'ND.intersection: invalid edge.' );
							}

							if ( edges.length > 1 ) {
								
								//ищем вершины с одним ребром и объединяем такие вершины в новое ребро.
								//Это нужно чтобы линия грани была замкнутая.
								//Для проверки создаем в примере _4D и _3D
								for ( var i = 0; i < geometryIntersection.position.length; i++ ) {
		
									var verticesCount = 0;
									for ( var j = 0; j < edges.length; j++ ) {
		
										const edge = edges[j];
										for ( var k = 0; k < edge.length; k++ ) {
		
											if ( edge[k] === i ) verticesCount++;
											
										}
		
									}
									if ( verticesCount < 2 ) {
		
										if ( verticesCount === 0 ) console.error( 'ND.intersection: Invalid verticesCount = ' + verticesCount );
										else vertices.push( i );
											
									}
		
								}
								if ( vertices.length > 0 ) {
		
									if ( vertices.length != 2 ) console.error( 'ND.intersection: invalid edge.' );
									else edges.push( vertices );
									
								}

							}

						} else {

							var segment = segments[settings.indice];
							if ( iSegments > 1 ) {

								for ( var i = 0; i < segment.length; i++ ) {
		
									const nd = new ND( n, {
										
										plane: true,
										object: settings.object, indice: segment[i], iSegments: iSegments - 1,
										
									} );
									if ( n > 4 ) {

										if ( n === 5 ) {
											var iIntersect = [];
											nd.intersection( geometryIntersection, iIntersect );
											if ( iIntersect.length ) {
												
												if ( iIntersect.length === 1 ) {
													
													iIntersect = iIntersect[0];
													iIntersections.push( iIntersect );
		
												} else {

													const ind = n - 4;
													geometryIntersection.indices[ind] = geometryIntersection.indices[ind] || proxySegments();
													geometryIntersection.indices[ind].push( iIntersect );
													if ( iIntersections ) iIntersections.push( iIntersect.index );
													
												}

											}
		
										} else console.error( 'ND.intersection: n = ' + n + ' under constraction' );

									} else nd.intersection( geometryIntersection, iIntersections );
		
								}

							} else {

								const edge = [];
								if ( segment.indices ) segment = segment.indices;
								for ( var i = 0; i < segment.length; i++ ) { intersection( segment[i], edge ); }
								if ( edge.length > 0 ) {

									if ( ( edge.length !== 2 ) || ( edge[0] === edge[1] ) ) {

										//длинна массива edge может быть меньше 2 если всего одна вершина находится на панели
										//В этом случае линия пересечения geometryIntersection состоит из одной точки и невозможно создать ребро
										if ( !edge.boVerticeOnPanel ) {

											const error = 'ND.intersection: invalid edge';
											console.error( error );
											return;

										}

									}
									const intersectionEdges = geometryIntersection.indices[0];
									var duplicateEdge = false;
									for ( var i = 0; i < intersectionEdges.length; i++ ) {

										const intersectionEdge = intersectionEdges[i];
										if (
											( intersectionEdge[0] === edge[0] ) && ( intersectionEdge[1] === edge[1] ) ||
											( intersectionEdge[0] === edge[1] ) && ( intersectionEdge[1] === edge[0] )
										) {

											duplicateEdge = true;
											if ( iIntersections ) iIntersections.push( i );
											break;
										}
										
									}
									if ( !duplicateEdge ) {
										
										if ( iIntersections ) iIntersections.push( intersectionEdges.length );
										intersectionEdges.push( edge );

									}

								}

							}

						}

					}

				}
				if ( settings.onIntersection )
					settings.onIntersection( geometryIntersection );
				if ( scene ) {

					if ( objectIntersect ) {

						if ( options.guiSelectPoint ) options.guiSelectPoint.removeMesh( objectIntersect );
						scene.remove( objectIntersect );
						if (options.eventListeners) options.eventListeners.removeParticle( objectIntersect );

					}
					if ( geometryIntersection.position.length )
						objectIntersect = create3DObject( geometryIntersection, { name: 'Intersection', color: 'white' } );

				}
				return geometryIntersection.position;

			};

			const THREE = three$1.THREE, scene = settings.scene;

			if ( scene ) {

				//Если есть scene, обязательно должен быть options. Здесь создать options неполучится
				const scales = options.scales;
				if ( n <= 1 ) scales.y = undefined;
				if (n <= 2) scales.z = undefined;
	/*is not compatible with build of the nD.module.min.js
				scales.text ||= {};
				scales.text.rect ||=  {};
	*/
				if (!scales.text) scales.text = {};
				if (!scales.text.rect) scales.text.rect = {};
				scales.text.rect.displayRect = false;
				scales.text.precision = 2;

			}

			var object3D;
			function projectTo3D() {

				if ( !scene ) return;

				//Graphic object. Currenyly is line
				if ( object3D ) {

					for ( var i = object3D.children.length - 1; i >= 0; i-- ) {

						const child = object3D.children[i];
						if ( child instanceof THREE.Sprite ) {

							object3D.remove( child );
							if ( options.guiSelectPoint ) options.guiSelectPoint.removeMesh( child );
							
						}
						
					}
					scene.remove( object3D );
					if ( options.guiSelectPoint ) options.guiSelectPoint.removeMesh( object3D );
					options.eventListeners.removeParticle( object3D );
					object3D = undefined;

				}
				object3D = create3DObject( geometry, {
					
					name: settings.object.name,
					faces: settings.object.faces,
					color: settings.object.color || _ND.defaultColor,//'lime',//0x00ff00,//'green'
				
				} );

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

					var mesh;
					this.createMesh = function () {

						if ( !scene ) return;
						const color = 0x0000FF;//blue
						switch ( n ) {

							case 1://point
								options.point.size = ( options.scales.x.max - options.scales.x.min ) * 500;//10
								mesh = new THREE.Points( new THREE.BufferGeometry().setFromPoints( [
									new THREE.Vector3( 0, 0, 0 )
								], 3 ),
									new THREE.PointsMaterial( {

										color: color,
										sizeAttenuation: false,

									} ) );

								break;
							case 2://line
								mesh = new THREE.Line( new THREE.BufferGeometry().setFromPoints( [
									new THREE.Vector3( options.scales.x.min, 0, 0 ), new THREE.Vector3( options.scales.x.max, 0, 0 )
								] ), new THREE.LineBasicMaterial( { color: color } ) );
								break;
							case 3://plane
								mesh = new THREE.GridHelper( 2, 10, color, color );
								mesh.rotation.x = Math.PI / 2;
								break;
							default: {

								return;//I can not render 4D and higher panel

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
								Options$1.raycaster.onIntersection( intersection, options, scene, options.camera, options.renderer );

							},
							onIntersectionOut: function () { Options$1.raycaster.onIntersectionOut( scene, options.renderer ); },
							onMouseDown: function ( intersection ) { Options$1.raycaster.onMouseDown( intersection, options ); },

						};
						options.eventListeners.addParticle( mesh );

						//

						vectorPlane.onChange = function () {

							mesh.position.copy( vectorPlane.point );
							mesh.updateMatrix();

						};

					};

				}

			}
			if ( settings.plane === undefined ) settings.plane = false;
			if ( settings.plane ) {
				
				const plane = new Plane();
				plane.createMesh();

			}

			/**
			* @description
			* Returns N-dimensional vector of the plane that intersects nD object.
			*/
			this.vectorPlane;
			/**
			* @description
			* <pre>
			* returns geometry of N-dimensional object. See <b>settings.object.geometry</b> parameter of <a href="./module-ND-ND.html" target="_blank">ND</a>.
			*	key <b>geometry</b> - get or set a geometry of nD object. See See <b>settings.object.geometry</b> parameter of <a href="./module-ND-ND.html" target="_blank">ND</a>.
			*	key <b>D3</b> - Projection of nD object to 3D space for visualization.
			*		<b>D3.points</b> - Points of projection. See <a href="https://threejs.org/docs/index.html?q=BufferGeometry#api/en/core/BufferGeometry.setFromPoints" target="_blank">.setFromPoints</a> of <a href="https://threejs.org/docs/index.html?q=BufferGeometry#api/en/core/BufferGeometry" target="_blank">THREE.BufferGeometry</a>.
			*		<b>D3.indices</b> - Indices of points of projection. See <a href="https://threejs.org/docs/index.html?q=BufferGeometry#api/en/core/BufferGeometry.setIndex" target="_blank">.setIndex</a> of <a href="https://threejs.org/docs/index.html?q=BufferGeometry#api/en/core/BufferGeometry" target="_blank">THREE.BufferGeometry</a>.
			*		<b>D3.color</b> - color of projection.
			* </pre>
			*/
			this.geometry;

			Object.defineProperties( this, {

				vectorPlane: {

					get: function () { return vectorPlane; }

				},

				geometry: {

					get: function () { return geometry; },
					set: function ( geometryNew ) {

						geometry.geometry = geometryNew;
						settings.object.name = 'Object';
						settings.object.rotation.clear();
						settings.object.position.clear();
						projectTo3D();
						this.intersection();

					},

				},

				object3D: {

					get: () => { return object3D; },
					
				},

				object: {

					get: function () { return settings.object; },
					set: function ( object ) {

						if ( !object ) {
							
							console.error( 'ND.object set: invalid object' );
							return;//отсутствует холст с размерностью пространства верхнего уровня

						}
						if ( !object.update )
							settings.object = object;
						const p = object.position;
						if ( p ) settings.object.position = [...p];
						const r = object.rotation;
						if ( r ) {
							
							if ( r instanceof Array ) settings.object.rotation = [...r];
							else settings.object.rotation = r;

						}
						settings.object.name = settings.object.name || 'Object';
						
						//copy indices
						if ( object.geometry.indices ) {
							
							const indices = [];
							object.geometry.indices.forEach( array => {

								const item = [];
								indices.push( item );
								array.forEach( index => {

									if ( index.indices ) item.push( index.indices );
									else item.push( index );
									
								} );
								
							} );
							settings.object.geometry.indices = indices;

						}
						setIndices();
						setEdges();
						if ( !settings.object.geometry.indices[0].isProxy ) settings.object.geometry.indices[0] = proxyEdges( object.geometry.indices[0] );

						settings.object.position = proxyPosition();
						settings.object.rotation = proxyRotation();
						settings.object.geometry.position = proxyGeometryPosition();
						settings.object.geometry.position.reset();
						
						appendEdges();
						
						if ( object.update ) {

							object3D.geometry.setFromPoints( geometry.D3.points ).setIndex( geometry.D3.indices.indices );
							if ( settings.options && settings.options.guiSelectPoint ) settings.options.guiSelectPoint.updatePoints();
							return;
							
						}
						projectTo3D();
						this.intersection();

					},

				},

			} );

		}

		//Overridden methods from base class

		get defaultColor() { return 'lime'; }
		positionOffset(position, positionId) { return positionId * position.itemSize; }

	}

	ND.gui = class {

		/**
		 * Custom controllers for N-dimensional graphic object
		 * @param {Options} options See <b>options</b> parameter of <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
		 * @param {GUI} dat [dat.GUI()]{@link https://github.com/dataarts/dat.gui}.
		 * @param {GUI} fParent parent folder.
		 * @example new ND.gui( options, dat, fMesh );
		 */
		constructor( options, dat, fParent ) {

			//Localization

			const getLanguageCode = options.getLanguageCode;

			const lang = {

				nD: 'nD',
				nDTitle: 'n-dimensional object',

			};

			const _languageCode = getLanguageCode();

			switch ( _languageCode ) {

				case 'ru'://Russian language

					lang.nDTitle = 'n-мерный объект';

					break;

			}
			const fND = fParent.addFolder( lang.nD );
			dat.folderNameAndTitle( fND, lang.nD, lang.nDTitle );

			this.object = function( object, dat ) {

				var display = 'none';
				if ( object && object.userData.nd ) {

					display = 'block';
					object.userData.nd( fND, dat );
					
				} else Object.keys( fND.__folders ).forEach( key => {

					const folder = fND.__folders[key];
					if ( !folder.userData || ( folder.userData.objectItems === undefined ) ) return;
					folder.__controllers.forEach( cSegment => {

						if (cSegment.__select) {
							
							const selectedItem = 0;
							cSegment.__select.selectedIndex = selectedItem;
							cSegment.setValue( cSegment.__select[selectedItem].innerHTML );

						}
						
					} );
					
					
				} );
				if (object) fND.domElement.style.display =  display;
				
			};

		}

	};

	ND.VectorN = class {

		/**
		 * base class for n-dimensional vector.
		 * @param {number} n dimension of the vector.
		 * @param {Array} array array of the values of the vector.
		 */
		constructor(n, array) {
			
			if (array.isVector) return array;
			if (array instanceof Array === false) {

				if (typeof array === 'number') array = [array];
				else if (array.array) array = array.array;
				else console.error('FermatSpiral: Vector: invalid array type');

			}
			if (n !== undefined) while (array.length < n) array.push(0);

			//https://stackoverflow.com/questions/2449182/getter-setter-on-javascript-array
			return new Proxy(array, {

				get: function (target, name) {

					var i = parseInt(name);
					if (isNaN(i)) {

						switch (name) {

							case "array": return array;
							/*
							* Adds v to this vector.
							*/
							case "add":
								return function (v) {

									target.forEach((value, i) => target[i] += v[i]);
									return this;

								}
							case "index": return vectorSettings.index;
							case "isVector": return true;
							default: console.error('ND: Vector get. Invalid name: ' + name);

						}
						return;

					}
					if (i >= n)
						return 0;
					if ((array.length > n) && settings.object.geometry.iAxes && (i < settings.object.geometry.iAxes.length))
						i = settings.object.geometry.iAxes[i];
					return array[i];

				},

			});

		}

	};

	//https://stackoverflow.com/a/18881828/5175935
	if ( !Number.prototype.between )
		Number.prototype.between = function ( a, b, inclusive ) {

			var min = Math.min.apply( Math, [a, b] ),
				max = Math.max.apply( Math, [a, b] );
			return inclusive ? this >= min && this <= max : this > min && this < max;

		};

	//Comparing arrays https://stackoverflow.com/a/14853974/5175935
	// Warn if overriding existing method
	if ( Array.prototype.equals )
		console.warn( "Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code." );
	// attach the .equals method to Array's prototype to call it on any array
	Array.prototype.equals = function (array) {

		// if the other array is a falsy value, return
		if ( !array )
			return false;

		// compare lengths - can save a lot of time 
		if ( this.length != array.length )
			return false;

		for (var i = 0, l = this.length; i < l; i++) {

			// Check if we have nested arrays
			if (this[i] instanceof Array && array[i] instanceof Array) {

				// recurse into the nested arrays
				if ( !this[i].equals( array[i] ) )
					return false;

			}
			else if (this[i] != array[i]) {

				// Warning - two different object instances will never be equal: {x:20} != {x:20}
				return false;

			}

		}
		return true;
	};
	// Hide method from for-in loops
	Object.defineProperty( Array.prototype, "equals", { enumerable: false } );

	exports["default"] = ND;

	Object.defineProperty(exports, '__esModule', { value: true });

}));
