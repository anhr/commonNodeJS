/**
 * node.js version of my common functions.
 *
 * @author Andrej Hristoliubov https://anhr.github.io/AboutMe/
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
	(factory((global.common = {})));
}(this, (function (exports) { 'use strict';

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
function getLanguageCode() {
		function _getLocale() {
				if (!navigator) {
						console.error("getLocale() failed! !navigator");
						return "";
				}
				if (navigator.languages !== undefined && typeof navigator.languages !== 'unknown'
				&& navigator.languages.length > 0) return navigator.languages[0];
				if (navigator.language) {
						return navigator.language;
				} else if (navigator.browserLanguage) {
						return navigator.browserLanguage;
				} else if (navigator.systemLanguage) {
						return navigator.systemLanguage;
				} else if (navigator.userLanguage) {
						return navigator.userLanguage;
				}
				console.error("getLocale() failed!");
				return "";
		}
		return _getLocale().toLowerCase().match(/([a-z]+)(?:-([a-z]+))?/)[1];
}

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
var _THREE;
var _dat;
var _Three;
var Three = function () {
					function Three() {
										classCallCheck(this, Three);
					}
					createClass(Three, [{
										key: 'THREE',
										set: function set$$1(THREE) {
															if (_THREE) {
																				if (!Object.is(THREE, _THREE)) console.error('three: duplicate THREE. Please use one instance of the THREE library.');
																				return;
															}
															_THREE = THREE;
															_Three = this;
															var
															Float32BufferAttribute = THREE.Float32BufferAttribute,
															    Line3 = THREE.Line3,
															    Plane = THREE.Plane,
															    Triangle = THREE.Triangle,
															    Vector3 = THREE.Vector3;
															function ConvexHull() {
																				var Visible = 0;
																				var Deleted = 1;
																				var _v1 = new Vector3();
																				var _line3 = new Line3();
																				var _plane = new Plane();
																				var _closestPoint = new Vector3();
																				var _triangle = new Triangle();
																				var ConvexHull = function () {
																									function ConvexHull() {
																														classCallCheck(this, ConvexHull);
																														this.tolerance = -1;
																														this.faces = [];
																														this.newFaces = [];
																														this.assigned = new VertexList();
																														this.unassigned = new VertexList();
																														this.vertices = [];
																									}
																									createClass(ConvexHull, [{
																														key: 'setFromPoints',
																														value: function setFromPoints(points) {
																																			if (Array.isArray(points) !== true) {
																																								console.error('THREE.ConvexHull: Points parameter is not an array.');
																																			}
																																			if (points.length < 4) {
																																								console.error('THREE.ConvexHull: The algorithm needs at least four points.');
																																			}
																																			this.makeEmpty();
																																			for (var i = 0, l = points.length; i < l; i++) {
																																								this.vertices.push(new VertexNode(points[i]));
																																			}
																																			this.compute();
																																			return this;
																														}
																									}, {
																														key: 'setFromObject',
																														value: function setFromObject(object) {
																																			var points = [];
																																			object.updateMatrixWorld(true);
																																			object.traverse(function (node) {
																																								var geometry = node.geometry;
																																								if (geometry !== undefined) {
																																													if (geometry.isGeometry) {
																																																		console.error('THREE.ConvexHull no longer supports Geometry. Use THREE.BufferGeometry instead.');
																																																		return;
																																													} else if (geometry.isBufferGeometry) {
																																																		var attribute = geometry.attributes.position;
																																																		if (attribute !== undefined) {
																																																							for (var i = 0, l = attribute.count; i < l; i++) {
																																																												var point = new Vector3();
																																																												point.fromBufferAttribute(attribute, i).applyMatrix4(node.matrixWorld);
																																																												points.push(point);
																																																							}
																																																		}
																																													}
																																								}
																																			});
																																			return this.setFromPoints(points);
																														}
																									}, {
																														key: 'containsPoint',
																														value: function containsPoint(point) {
																																			var faces = this.faces;
																																			for (var i = 0, l = faces.length; i < l; i++) {
																																								var face = faces[i];
																																								if (face.distanceToPoint(point) > this.tolerance) return false;
																																			}
																																			return true;
																														}
																									}, {
																														key: 'intersectRay',
																														value: function intersectRay(ray, target) {
																																			var faces = this.faces;
																																			var tNear = -Infinity;
																																			var tFar = Infinity;
																																			for (var i = 0, l = faces.length; i < l; i++) {
																																								var face = faces[i];
																																								var vN = face.distanceToPoint(ray.origin);
																																								var vD = face.normal.dot(ray.direction);
																																								if (vN > 0 && vD >= 0) return null;
																																								var t = vD !== 0 ? -vN / vD : 0;
																																								if (t <= 0) continue;
																																								if (vD > 0) {
																																													tFar = Math.min(t, tFar);
																																								} else {
																																													tNear = Math.max(t, tNear);
																																								}
																																								if (tNear > tFar) {
																																													return null;
																																								}
																																			}
																																			if (tNear !== -Infinity) {
																																								ray.at(tNear, target);
																																			} else {
																																								ray.at(tFar, target);
																																			}
																																			return target;
																														}
																									}, {
																														key: 'intersectsRay',
																														value: function intersectsRay(ray) {
																																			return this.intersectRay(ray, _v1) !== null;
																														}
																									}, {
																														key: 'makeEmpty',
																														value: function makeEmpty() {
																																			this.faces = [];
																																			this.vertices = [];
																																			return this;
																														}
																									}, {
																														key: 'addVertexToFace',
																														value: function addVertexToFace(vertex, face) {
																																			vertex.face = face;
																																			if (face.outside === null) {
																																								this.assigned.append(vertex);
																																			} else {
																																								this.assigned.insertBefore(face.outside, vertex);
																																			}
																																			face.outside = vertex;
																																			return this;
																														}
																									}, {
																														key: 'removeVertexFromFace',
																														value: function removeVertexFromFace(vertex, face) {
																																			if (vertex === face.outside) {
																																								if (vertex.next !== null && vertex.next.face === face) {
																																													face.outside = vertex.next;
																																								} else {
																																													face.outside = null;
																																								}
																																			}
																																			this.assigned.remove(vertex);
																																			return this;
																														}
																									}, {
																														key: 'removeAllVerticesFromFace',
																														value: function removeAllVerticesFromFace(face) {
																																			if (face.outside !== null) {
																																								var start = face.outside;
																																								var end = face.outside;
																																								while (end.next !== null && end.next.face === face) {
																																													end = end.next;
																																								}
																																								this.assigned.removeSubList(start, end);
																																								start.prev = end.next = null;
																																								face.outside = null;
																																								return start;
																																			}
																														}
																									}, {
																														key: 'deleteFaceVertices',
																														value: function deleteFaceVertices(face, absorbingFace) {
																																			var faceVertices = this.removeAllVerticesFromFace(face);
																																			if (faceVertices !== undefined) {
																																								if (absorbingFace === undefined) {
																																													this.unassigned.appendChain(faceVertices);
																																								} else {
																																													var vertex = faceVertices;
																																													do {
																																																		var nextVertex = vertex.next;
																																																		var distance = absorbingFace.distanceToPoint(vertex.point);
																																																		if (distance > this.tolerance) {
																																																							this.addVertexToFace(vertex, absorbingFace);
																																																		} else {
																																																							this.unassigned.append(vertex);
																																																		}
																																																		vertex = nextVertex;
																																													} while (vertex !== null);
																																								}
																																			}
																																			return this;
																														}
																									}, {
																														key: 'resolveUnassignedPoints',
																														value: function resolveUnassignedPoints(newFaces) {
																																			if (this.unassigned.isEmpty() === false) {
																																								var vertex = this.unassigned.first();
																																								do {
																																													var nextVertex = vertex.next;
																																													var maxDistance = this.tolerance;
																																													var maxFace = null;
																																													for (var i = 0; i < newFaces.length; i++) {
																																																		var face = newFaces[i];
																																																		if (face.mark === Visible) {
																																																							var distance = face.distanceToPoint(vertex.point);
																																																							if (distance > maxDistance) {
																																																												maxDistance = distance;
																																																												maxFace = face;
																																																							}
																																																							if (maxDistance > 1000 * this.tolerance) break;
																																																		}
																																													}
																																													if (maxFace !== null) {
																																																		this.addVertexToFace(vertex, maxFace);
																																													}
																																													vertex = nextVertex;
																																								} while (vertex !== null);
																																			}
																																			return this;
																														}
																									}, {
																														key: 'computeExtremes',
																														value: function computeExtremes() {
																																			var min = new Vector3();
																																			var max = new Vector3();
																																			var minVertices = [];
																																			var maxVertices = [];
																																			for (var i = 0; i < 3; i++) {
																																								minVertices[i] = maxVertices[i] = this.vertices[0];
																																			}
																																			min.copy(this.vertices[0].point);
																																			max.copy(this.vertices[0].point);
																																			for (var _i = 0, l = this.vertices.length; _i < l; _i++) {
																																								var vertex = this.vertices[_i];
																																								var point = vertex.point;
																																								for (var j = 0; j < 3; j++) {
																																													if (point.getComponent(j) < min.getComponent(j)) {
																																																		min.setComponent(j, point.getComponent(j));
																																																		minVertices[j] = vertex;
																																													}
																																								}
																																								for (var _j = 0; _j < 3; _j++) {
																																													if (point.getComponent(_j) > max.getComponent(_j)) {
																																																		max.setComponent(_j, point.getComponent(_j));
																																																		maxVertices[_j] = vertex;
																																													}
																																								}
																																			}
																																			this.tolerance = 3 * Number.EPSILON * (Math.max(Math.abs(min.x), Math.abs(max.x)) + Math.max(Math.abs(min.y), Math.abs(max.y)) + Math.max(Math.abs(min.z), Math.abs(max.z)));
																																			return { min: minVertices, max: maxVertices };
																														}
																									}, {
																														key: 'computeInitialHull',
																														value: function computeInitialHull() {
																																			var vertices = this.vertices;
																																			var extremes = this.computeExtremes();
																																			var min = extremes.min;
																																			var max = extremes.max;
																																			var maxDistance = 0;
																																			var index = 0;
																																			for (var i = 0; i < 3; i++) {
																																								var distance = max[i].point.getComponent(i) - min[i].point.getComponent(i);
																																								if (distance > maxDistance) {
																																													maxDistance = distance;
																																													index = i;
																																								}
																																			}
																																			var v0 = min[index];
																																			var v1 = max[index];
																																			var v2 = void 0;
																																			var v3 = void 0;
																																			maxDistance = 0;
																																			_line3.set(v0.point, v1.point);
																																			for (var _i2 = 0, l = this.vertices.length; _i2 < l; _i2++) {
																																								var vertex = vertices[_i2];
																																								if (vertex !== v0 && vertex !== v1) {
																																													_line3.closestPointToPoint(vertex.point, true, _closestPoint);
																																													var _distance = _closestPoint.distanceToSquared(vertex.point);
																																													if (_distance > maxDistance) {
																																																		maxDistance = _distance;
																																																		v2 = vertex;
																																													}
																																								}
																																			}
																																			maxDistance = -1;
																																			_plane.setFromCoplanarPoints(v0.point, v1.point, v2.point);
																																			for (var _i3 = 0, _l = this.vertices.length; _i3 < _l; _i3++) {
																																								var _vertex = vertices[_i3];
																																								if (_vertex !== v0 && _vertex !== v1 && _vertex !== v2) {
																																													var _distance2 = Math.abs(_plane.distanceToPoint(_vertex.point));
																																													if (_distance2 > maxDistance) {
																																																		maxDistance = _distance2;
																																																		v3 = _vertex;
																																													}
																																								}
																																			}
																																			var faces = [];
																																			if (_plane.distanceToPoint(v3.point) < 0) {
																																								faces.push(Face.create(v0, v1, v2), Face.create(v3, v1, v0), Face.create(v3, v2, v1), Face.create(v3, v0, v2));
																																								for (var _i4 = 0; _i4 < 3; _i4++) {
																																													var j = (_i4 + 1) % 3;
																																													faces[_i4 + 1].getEdge(2).setTwin(faces[0].getEdge(j));
																																													faces[_i4 + 1].getEdge(1).setTwin(faces[j + 1].getEdge(0));
																																								}
																																			} else {
																																								faces.push(Face.create(v0, v2, v1), Face.create(v3, v0, v1), Face.create(v3, v1, v2), Face.create(v3, v2, v0));
																																								for (var _i5 = 0; _i5 < 3; _i5++) {
																																													var _j2 = (_i5 + 1) % 3;
																																													faces[_i5 + 1].getEdge(2).setTwin(faces[0].getEdge((3 - _i5) % 3));
																																													faces[_i5 + 1].getEdge(0).setTwin(faces[_j2 + 1].getEdge(1));
																																								}
																																			}
																																			for (var _i6 = 0; _i6 < 4; _i6++) {
																																								this.faces.push(faces[_i6]);
																																			}
																																			for (var _i7 = 0, _l2 = vertices.length; _i7 < _l2; _i7++) {
																																								var _vertex2 = vertices[_i7];
																																								if (_vertex2 !== v0 && _vertex2 !== v1 && _vertex2 !== v2 && _vertex2 !== v3) {
																																													maxDistance = this.tolerance;
																																													var maxFace = null;
																																													for (var _j3 = 0; _j3 < 4; _j3++) {
																																																		var _distance3 = this.faces[_j3].distanceToPoint(_vertex2.point);
																																																		if (_distance3 > maxDistance) {
																																																							maxDistance = _distance3;
																																																							maxFace = this.faces[_j3];
																																																		}
																																													}
																																													if (maxFace !== null) {
																																																		this.addVertexToFace(_vertex2, maxFace);
																																													}
																																								}
																																			}
																																			return this;
																														}
																									}, {
																														key: 'reindexFaces',
																														value: function reindexFaces() {
																																			var activeFaces = [];
																																			for (var i = 0; i < this.faces.length; i++) {
																																								var face = this.faces[i];
																																								if (face.mark === Visible) {
																																													activeFaces.push(face);
																																								}
																																			}
																																			this.faces = activeFaces;
																																			return this;
																														}
																									}, {
																														key: 'nextVertexToAdd',
																														value: function nextVertexToAdd() {
																																			if (this.assigned.isEmpty() === false) {
																																								var eyeVertex = void 0,
																																								    maxDistance = 0;
																																								var eyeFace = this.assigned.first().face;
																																								var vertex = eyeFace.outside;
																																								do {
																																													var distance = eyeFace.distanceToPoint(vertex.point);
																																													if (distance > maxDistance) {
																																																		maxDistance = distance;
																																																		eyeVertex = vertex;
																																													}
																																													vertex = vertex.next;
																																								} while (vertex !== null && vertex.face === eyeFace);
																																								return eyeVertex;
																																			}
																														}
																									}, {
																														key: 'computeHorizon',
																														value: function computeHorizon(eyePoint, crossEdge, face, horizon) {
																																			this.deleteFaceVertices(face);
																																			face.mark = Deleted;
																																			var edge = void 0;
																																			if (crossEdge === null) {
																																								edge = crossEdge = face.getEdge(0);
																																			} else {
																																								edge = crossEdge.next;
																																			}
																																			do {
																																								var twinEdge = edge.twin;
																																								var oppositeFace = twinEdge.face;
																																								if (oppositeFace.mark === Visible) {
																																													if (oppositeFace.distanceToPoint(eyePoint) > this.tolerance) {
																																																		this.computeHorizon(eyePoint, twinEdge, oppositeFace, horizon);
																																													} else {
																																																		horizon.push(edge);
																																													}
																																								}
																																								edge = edge.next;
																																			} while (edge !== crossEdge);
																																			return this;
																														}
																									}, {
																														key: 'addAdjoiningFace',
																														value: function addAdjoiningFace(eyeVertex, horizonEdge) {
																																			var face = Face.create(eyeVertex, horizonEdge.tail(), horizonEdge.head());
																																			this.faces.push(face);
																																			face.getEdge(-1).setTwin(horizonEdge.twin);
																																			return face.getEdge(0);
																														}
																									}, {
																														key: 'addNewFaces',
																														value: function addNewFaces(eyeVertex, horizon) {
																																			this.newFaces = [];
																																			var firstSideEdge = null;
																																			var previousSideEdge = null;
																																			for (var i = 0; i < horizon.length; i++) {
																																								var horizonEdge = horizon[i];
																																								var sideEdge = this.addAdjoiningFace(eyeVertex, horizonEdge);
																																								if (firstSideEdge === null) {
																																													firstSideEdge = sideEdge;
																																								} else {
																																													sideEdge.next.setTwin(previousSideEdge);
																																								}
																																								this.newFaces.push(sideEdge.face);
																																								previousSideEdge = sideEdge;
																																			}
																																			firstSideEdge.next.setTwin(previousSideEdge);
																																			return this;
																														}
																									}, {
																														key: 'addVertexToHull',
																														value: function addVertexToHull(eyeVertex) {
																																			var horizon = [];
																																			this.unassigned.clear();
																																			this.removeVertexFromFace(eyeVertex, eyeVertex.face);
																																			this.computeHorizon(eyeVertex.point, null, eyeVertex.face, horizon);
																																			this.addNewFaces(eyeVertex, horizon);
																																			this.resolveUnassignedPoints(this.newFaces);
																																			return this;
																														}
																									}, {
																														key: 'cleanup',
																														value: function cleanup() {
																																			this.assigned.clear();
																																			this.unassigned.clear();
																																			this.newFaces = [];
																																			return this;
																														}
																									}, {
																														key: 'compute',
																														value: function compute() {
																																			var vertex = void 0;
																																			this.computeInitialHull();
																																			while ((vertex = this.nextVertexToAdd()) !== undefined) {
																																								this.addVertexToHull(vertex);
																																			}
																																			this.reindexFaces();
																																			this.cleanup();
																																			return this;
																														}
																									}]);
																									return ConvexHull;
																				}();
																				this.ConvexHull = ConvexHull;
																				var Face = function () {
																									function Face() {
																														classCallCheck(this, Face);
																														this.normal = new Vector3();
																														this.midpoint = new Vector3();
																														this.area = 0;
																														this.constant = 0;
																														this.outside = null;
																														this.mark = Visible;
																														this.edge = null;
																									}
																									createClass(Face, [{
																														key: 'getEdge',
																														value: function getEdge(i) {
																																			var edge = this.edge;
																																			while (i > 0) {
																																								edge = edge.next;
																																								i--;
																																			}
																																			while (i < 0) {
																																								edge = edge.prev;
																																								i++;
																																			}
																																			return edge;
																														}
																									}, {
																														key: 'compute',
																														value: function compute() {
																																			var a = this.edge.tail();
																																			var b = this.edge.head();
																																			var c = this.edge.next.head();
																																			_triangle.set(a.point, b.point, c.point);
																																			_triangle.getNormal(this.normal);
																																			_triangle.getMidpoint(this.midpoint);
																																			this.area = _triangle.getArea();
																																			this.constant = this.normal.dot(this.midpoint);
																																			return this;
																														}
																									}, {
																														key: 'distanceToPoint',
																														value: function distanceToPoint(point) {
																																			return this.normal.dot(point) - this.constant;
																														}
																									}], [{
																														key: 'create',
																														value: function create(a, b, c) {
																																			var face = new Face();
																																			var e0 = new HalfEdge(a, face);
																																			var e1 = new HalfEdge(b, face);
																																			var e2 = new HalfEdge(c, face);
																																			e0.next = e2.prev = e1;
																																			e1.next = e0.prev = e2;
																																			e2.next = e1.prev = e0;
																																			face.edge = e0;
																																			return face.compute();
																														}
																									}]);
																									return Face;
																				}();
																				var HalfEdge = function () {
																									function HalfEdge(vertex, face) {
																														classCallCheck(this, HalfEdge);
																														this.vertex = vertex;
																														this.prev = null;
																														this.next = null;
																														this.twin = null;
																														this.face = face;
																									}
																									createClass(HalfEdge, [{
																														key: 'head',
																														value: function head() {
																																			return this.vertex;
																														}
																									}, {
																														key: 'tail',
																														value: function tail() {
																																			return this.prev ? this.prev.vertex : null;
																														}
																									}, {
																														key: 'length',
																														value: function length() {
																																			var head = this.head();
																																			var tail = this.tail();
																																			if (tail !== null) {
																																								return tail.point.distanceTo(head.point);
																																			}
																																			return -1;
																														}
																									}, {
																														key: 'lengthSquared',
																														value: function lengthSquared() {
																																			var head = this.head();
																																			var tail = this.tail();
																																			if (tail !== null) {
																																								return tail.point.distanceToSquared(head.point);
																																			}
																																			return -1;
																														}
																									}, {
																														key: 'setTwin',
																														value: function setTwin(edge) {
																																			this.twin = edge;
																																			edge.twin = this;
																																			return this;
																														}
																									}]);
																									return HalfEdge;
																				}();
																				var VertexNode = function VertexNode(point) {
																									classCallCheck(this, VertexNode);
																									this.point = point;
																									this.prev = null;
																									this.next = null;
																									this.face = null;
																				};
																				var VertexList = function () {
																									function VertexList() {
																														classCallCheck(this, VertexList);
																														this.head = null;
																														this.tail = null;
																									}
																									createClass(VertexList, [{
																														key: 'first',
																														value: function first() {
																																			return this.head;
																														}
																									}, {
																														key: 'last',
																														value: function last() {
																																			return this.tail;
																														}
																									}, {
																														key: 'clear',
																														value: function clear() {
																																			this.head = this.tail = null;
																																			return this;
																														}
																									}, {
																														key: 'insertBefore',
																														value: function insertBefore(target, vertex) {
																																			vertex.prev = target.prev;
																																			vertex.next = target;
																																			if (vertex.prev === null) {
																																								this.head = vertex;
																																			} else {
																																								vertex.prev.next = vertex;
																																			}
																																			target.prev = vertex;
																																			return this;
																														}
																									}, {
																														key: 'insertAfter',
																														value: function insertAfter(target, vertex) {
																																			vertex.prev = target;
																																			vertex.next = target.next;
																																			if (vertex.next === null) {
																																								this.tail = vertex;
																																			} else {
																																								vertex.next.prev = vertex;
																																			}
																																			target.next = vertex;
																																			return this;
																														}
																									}, {
																														key: 'append',
																														value: function append(vertex) {
																																			if (this.head === null) {
																																								this.head = vertex;
																																			} else {
																																								this.tail.next = vertex;
																																			}
																																			vertex.prev = this.tail;
																																			vertex.next = null;
																																			this.tail = vertex;
																																			return this;
																														}
																									}, {
																														key: 'appendChain',
																														value: function appendChain(vertex) {
																																			if (this.head === null) {
																																								this.head = vertex;
																																			} else {
																																								this.tail.next = vertex;
																																			}
																																			vertex.prev = this.tail;
																																			while (vertex.next !== null) {
																																								vertex = vertex.next;
																																			}
																																			this.tail = vertex;
																																			return this;
																														}
																									}, {
																														key: 'remove',
																														value: function remove(vertex) {
																																			if (vertex.prev === null) {
																																								this.head = vertex.next;
																																			} else {
																																								vertex.prev.next = vertex.next;
																																			}
																																			if (vertex.next === null) {
																																								this.tail = vertex.prev;
																																			} else {
																																								vertex.next.prev = vertex.prev;
																																			}
																																			return this;
																														}
																									}, {
																														key: 'removeSubList',
																														value: function removeSubList(a, b) {
																																			if (a.prev === null) {
																																								this.head = b.next;
																																			} else {
																																								a.prev.next = b.next;
																																			}
																																			if (b.next === null) {
																																								this.tail = a.prev;
																																			} else {
																																								b.next.prev = a.prev;
																																			}
																																			return this;
																														}
																									}, {
																														key: 'isEmpty',
																														value: function isEmpty() {
																																			return this.head === null;
																														}
																									}]);
																									return VertexList;
																				}();
															}
															this.ConvexHull = new ConvexHull().ConvexHull;
															var Vector2 = three.THREE.Vector2,
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
															var EventDispatcher = function () {
																				function EventDispatcher() {
																									classCallCheck(this, EventDispatcher);
																				}
																				createClass(EventDispatcher, [{
																									key: 'addEventListener',
																									value: function addEventListener(type, listener) {
																														if (this._listeners === undefined) this._listeners = {};
																														var listeners = this._listeners;
																														if (listeners[type] === undefined) {
																																			listeners[type] = [];
																														}
																														if (listeners[type].indexOf(listener) === -1) {
																																			listeners[type].push(listener);
																														}
																									}
																				}, {
																									key: 'hasEventListener',
																									value: function hasEventListener(type, listener) {
																														if (this._listeners === undefined) return false;
																														var listeners = this._listeners;
																														return listeners[type] !== undefined && listeners[type].indexOf(listener) !== -1;
																									}
																				}, {
																									key: 'removeEventListener',
																									value: function removeEventListener(type, listener) {
																														if (this._listeners === undefined) return;
																														var listeners = this._listeners;
																														var listenerArray = listeners[type];
																														if (listenerArray !== undefined) {
																																			var index = listenerArray.indexOf(listener);
																																			if (index !== -1) {
																																								listenerArray.splice(index, 1);
																																			}
																														}
																									}
																				}, {
																									key: 'dispatchEvent',
																									value: function dispatchEvent(event) {
																														if (this._listeners === undefined) return;
																														var listeners = this._listeners;
																														var listenerArray = listeners[event.type];
																														if (listenerArray !== undefined) {
																																			event.target = this;
																																			var array = listenerArray.slice(0);
																																			for (var i = 0, l = array.length; i < l; i++) {
																																								array[i].call(this, event);
																																			}
																																			event.target = null;
																														}
																									}
																				}]);
																				return EventDispatcher;
															}();
															var _id = 0;
															var _m1 =              new Matrix4();
															var _obj =              new Object3D();
															var _offset =              new Vector3();
															var _box =              new Box3();
															var _boxMorphTargets =              new Box3();
															var _vector =              new Vector3();
															var BufferGeometry = function (_EventDispatcher) {
																				inherits(BufferGeometry, _EventDispatcher);
																				function BufferGeometry() {
																									classCallCheck(this, BufferGeometry);
																									var _this = possibleConstructorReturn(this, (BufferGeometry.__proto__ || Object.getPrototypeOf(BufferGeometry)).call(this));
																									Object.defineProperty(_this, 'id', { value: _id++ });
																									_this.uuid = MathUtils.generateUUID();
																									_this.name = '';
																									_this.type = 'BufferGeometry';
																									_this.index = null;
																									_this.attributes = {};
																									_this.morphAttributes = {};
																									_this.morphTargetsRelative = false;
																									_this.groups = [];
																									_this.boundingBox = null;
																									_this.boundingSphere = null;
																									_this.drawRange = { start: 0, count: Infinity };
																									_this.userData = {};
																									return _this;
																				}
																				createClass(BufferGeometry, [{
																									key: 'getIndex',
																									value: function getIndex() {
																														return this.index;
																									}
																				}, {
																									key: 'setIndex',
																									value: function setIndex(index) {
																														if (Array.isArray(index)) {
																																			this.index = new (arrayMax(index) > 65535 ? Uint32BufferAttribute : Uint16BufferAttribute)(index, 1);
																														} else {
																																			this.index = index;
																														}
																														return this;
																									}
																				}, {
																									key: 'getAttribute',
																									value: function getAttribute(name) {
																														return this.attributes[name];
																									}
																				}, {
																									key: 'setAttribute',
																									value: function setAttribute(name, attribute) {
																														this.attributes[name] = attribute;
																														return this;
																									}
																				}, {
																									key: 'deleteAttribute',
																									value: function deleteAttribute(name) {
																														delete this.attributes[name];
																														return this;
																									}
																				}, {
																									key: 'hasAttribute',
																									value: function hasAttribute(name) {
																														return this.attributes[name] !== undefined;
																									}
																				}, {
																									key: 'addGroup',
																									value: function addGroup(start, count) {
																														var materialIndex = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
																														this.groups.push({
																																			start: start,
																																			count: count,
																																			materialIndex: materialIndex
																														});
																									}
																				}, {
																									key: 'clearGroups',
																									value: function clearGroups() {
																														this.groups = [];
																									}
																				}, {
																									key: 'setDrawRange',
																									value: function setDrawRange(start, count) {
																														this.drawRange.start = start;
																														this.drawRange.count = count;
																									}
																				}, {
																									key: 'applyMatrix4',
																									value: function applyMatrix4(matrix) {
																														var position = this.attributes.position;
																														if (position !== undefined) {
																																			position.applyMatrix4(matrix);
																																			position.needsUpdate = true;
																														}
																														var normal = this.attributes.normal;
																														if (normal !== undefined) {
																																			var normalMatrix = new Matrix3().getNormalMatrix(matrix);
																																			normal.applyNormalMatrix(normalMatrix);
																																			normal.needsUpdate = true;
																														}
																														var tangent = this.attributes.tangent;
																														if (tangent !== undefined) {
																																			tangent.transformDirection(matrix);
																																			tangent.needsUpdate = true;
																														}
																														if (this.boundingBox !== null) {
																																			this.computeBoundingBox();
																														}
																														if (this.boundingSphere !== null) {
																																			this.computeBoundingSphere();
																														}
																														return this;
																									}
																				}, {
																									key: 'applyQuaternion',
																									value: function applyQuaternion(q) {
																														_m1.makeRotationFromQuaternion(q);
																														this.applyMatrix4(_m1);
																														return this;
																									}
																				}, {
																									key: 'rotateX',
																									value: function rotateX(angle) {
																														_m1.makeRotationX(angle);
																														this.applyMatrix4(_m1);
																														return this;
																									}
																				}, {
																									key: 'rotateY',
																									value: function rotateY(angle) {
																														_m1.makeRotationY(angle);
																														this.applyMatrix4(_m1);
																														return this;
																									}
																				}, {
																									key: 'rotateZ',
																									value: function rotateZ(angle) {
																														_m1.makeRotationZ(angle);
																														this.applyMatrix4(_m1);
																														return this;
																									}
																				}, {
																									key: 'translate',
																									value: function translate(x, y, z) {
																														_m1.makeTranslation(x, y, z);
																														this.applyMatrix4(_m1);
																														return this;
																									}
																				}, {
																									key: 'scale',
																									value: function scale(x, y, z) {
																														_m1.makeScale(x, y, z);
																														this.applyMatrix4(_m1);
																														return this;
																									}
																				}, {
																									key: 'lookAt',
																									value: function lookAt(vector) {
																														_obj.lookAt(vector);
																														_obj.updateMatrix();
																														this.applyMatrix4(_obj.matrix);
																														return this;
																									}
																				}, {
																									key: 'center',
																									value: function center() {
																														this.computeBoundingBox();
																														this.boundingBox.getCenter(_offset).negate();
																														this.translate(_offset.x, _offset.y, _offset.z);
																														return this;
																									}
																				}, {
																									key: 'setFromPoints',
																									value: function setFromPoints(points) {
																														var position = [];
																														for (var i = 0, l = points.length; i < l; i++) {
																																			var point = points[i];
																																			position.push(point.x, point.y, point.z || 0);
																														}
																														this.setAttribute('position', new Float32BufferAttribute(position, 3));
																														return this;
																									}
																				}, {
																									key: 'computeBoundingBox',
																									value: function computeBoundingBox() {
																														if (this.boundingBox === null) {
																																			this.boundingBox = new Box3();
																														}
																														var position = this.attributes.position;
																														var morphAttributesPosition = this.morphAttributes.position;
																														if (position && position.isGLBufferAttribute) {
																																			console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".', this);
																																			this.boundingBox.set(new Vector3(-Infinity, -Infinity, -Infinity), new Vector3(+Infinity, +Infinity, +Infinity));
																																			return;
																														}
																														if (position !== undefined) {
																																			this.boundingBox.setFromBufferAttribute(position);
																																			if (morphAttributesPosition) {
																																								for (var i = 0, il = morphAttributesPosition.length; i < il; i++) {
																																													var morphAttribute = morphAttributesPosition[i];
																																													_box.setFromBufferAttribute(morphAttribute);
																																													if (this.morphTargetsRelative) {
																																																		_vector.addVectors(this.boundingBox.min, _box.min);
																																																		this.boundingBox.expandByPoint(_vector);
																																																		_vector.addVectors(this.boundingBox.max, _box.max);
																																																		this.boundingBox.expandByPoint(_vector);
																																													} else {
																																																		this.boundingBox.expandByPoint(_box.min);
																																																		this.boundingBox.expandByPoint(_box.max);
																																													}
																																								}
																																			}
																														} else {
																																			this.boundingBox.makeEmpty();
																														}
																														if (isNaN(this.boundingBox.min.x) || isNaN(this.boundingBox.min.y) || isNaN(this.boundingBox.min.z)) {
																																			console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.', this);
																														}
																									}
																				}, {
																									key: 'computeBoundingSphere',
																									value: function computeBoundingSphere() {
																														if (this.boundingSphere === null) {
																																			this.boundingSphere = new Sphere();
																														}
																														var position = this.attributes.position;
																														var morphAttributesPosition = this.morphAttributes.position;
																														if (position && position.isGLBufferAttribute) {
																																			console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".', this);
																																			this.boundingSphere.set(new Vector3(), Infinity);
																																			return;
																														}
																														if (position) {
																																			var center = this.boundingSphere.center;
																																			_box.setFromBufferAttribute(position);
																																			if (morphAttributesPosition) {
																																								for (var i = 0, il = morphAttributesPosition.length; i < il; i++) {
																																													var morphAttribute = morphAttributesPosition[i];
																																													_boxMorphTargets.setFromBufferAttribute(morphAttribute);
																																													if (this.morphTargetsRelative) {
																																																		_vector.addVectors(_box.min, _boxMorphTargets.min);
																																																		_box.expandByPoint(_vector);
																																																		_vector.addVectors(_box.max, _boxMorphTargets.max);
																																																		_box.expandByPoint(_vector);
																																													} else {
																																																		_box.expandByPoint(_boxMorphTargets.min);
																																																		_box.expandByPoint(_boxMorphTargets.max);
																																													}
																																								}
																																			}
																																			_box.getCenter(center);
																																			var maxRadiusSq = 0;
																																			for (var _i8 = 0, _il = position.count; _i8 < _il; _i8++) {
																																								_vector.fromBufferAttribute(position, _i8);
																																								maxRadiusSq = Math.max(maxRadiusSq, center.distanceToSquared(_vector));
																																			}
																																			if (morphAttributesPosition) {
																																								for (var _i9 = 0, _il2 = morphAttributesPosition.length; _i9 < _il2; _i9++) {
																																													var _morphAttribute = morphAttributesPosition[_i9];
																																													var morphTargetsRelative = this.morphTargetsRelative;
																																													for (var j = 0, jl = _morphAttribute.count; j < jl; j++) {
																																																		_vector.fromBufferAttribute(_morphAttribute, j);
																																																		if (morphTargetsRelative) {
																																																							_offset.fromBufferAttribute(position, j);
																																																							_vector.add(_offset);
																																																		}
																																																		maxRadiusSq = Math.max(maxRadiusSq, center.distanceToSquared(_vector));
																																													}
																																								}
																																			}
																																			this.boundingSphere.radius = Math.sqrt(maxRadiusSq);
																																			if (isNaN(this.boundingSphere.radius)) {
																																								console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.', this);
																																			}
																														}
																									}
																				}, {
																									key: 'computeTangents',
																									value: function computeTangents() {
																														var index = this.index;
																														var attributes = this.attributes;
																														if (index === null || attributes.position === undefined || attributes.normal === undefined || attributes.uv === undefined) {
																																			console.error('THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)');
																																			return;
																														}
																														var indices = index.array;
																														var positions = attributes.position.array;
																														var normals = attributes.normal.array;
																														var uvs = attributes.uv.array;
																														var nVertices = positions.length / 3;
																														if (attributes.tangent === undefined) {
																																			this.setAttribute('tangent', new BufferAttribute(new Float32Array(4 * nVertices), 4));
																														}
																														var tangents = attributes.tangent.array;
																														var tan1 = [],
																														    tan2 = [];
																														for (var i = 0; i < nVertices; i++) {
																																			tan1[i] = new Vector3();
																																			tan2[i] = new Vector3();
																														}
																														var vA = new Vector3(),
																														    vB = new Vector3(),
																														    vC = new Vector3(),
																														    uvA = new Vector2(),
																														    uvB = new Vector2(),
																														    uvC = new Vector2(),
																														    sdir = new Vector3(),
																														    tdir = new Vector3();
																														function handleTriangle(a, b, c) {
																																			vA.fromArray(positions, a * 3);
																																			vB.fromArray(positions, b * 3);
																																			vC.fromArray(positions, c * 3);
																																			uvA.fromArray(uvs, a * 2);
																																			uvB.fromArray(uvs, b * 2);
																																			uvC.fromArray(uvs, c * 2);
																																			vB.sub(vA);
																																			vC.sub(vA);
																																			uvB.sub(uvA);
																																			uvC.sub(uvA);
																																			var r = 1.0 / (uvB.x * uvC.y - uvC.x * uvB.y);
																																			if (!isFinite(r)) return;
																																			sdir.copy(vB).multiplyScalar(uvC.y).addScaledVector(vC, -uvB.y).multiplyScalar(r);
																																			tdir.copy(vC).multiplyScalar(uvB.x).addScaledVector(vB, -uvC.x).multiplyScalar(r);
																																			tan1[a].add(sdir);
																																			tan1[b].add(sdir);
																																			tan1[c].add(sdir);
																																			tan2[a].add(tdir);
																																			tan2[b].add(tdir);
																																			tan2[c].add(tdir);
																														}
																														var groups = this.groups;
																														if (groups.length === 0) {
																																			groups = [{
																																								start: 0,
																																								count: indices.length
																																			}];
																														}
																														for (var _i10 = 0, il = groups.length; _i10 < il; ++_i10) {
																																			var group = groups[_i10];
																																			var start = group.start;
																																			var count = group.count;
																																			for (var j = start, jl = start + count; j < jl; j += 3) {
																																								handleTriangle(indices[j + 0], indices[j + 1], indices[j + 2]);
																																			}
																														}
																														var tmp = new Vector3(),
																														    tmp2 = new Vector3();
																														var n = new Vector3(),
																														    n2 = new Vector3();
																														function handleVertex(v) {
																																			n.fromArray(normals, v * 3);
																																			n2.copy(n);
																																			var t = tan1[v];
																																			tmp.copy(t);
																																			tmp.sub(n.multiplyScalar(n.dot(t))).normalize();
																																			tmp2.crossVectors(n2, t);
																																			var test = tmp2.dot(tan2[v]);
																																			var w = test < 0.0 ? -1.0 : 1.0;
																																			tangents[v * 4] = tmp.x;
																																			tangents[v * 4 + 1] = tmp.y;
																																			tangents[v * 4 + 2] = tmp.z;
																																			tangents[v * 4 + 3] = w;
																														}
																														for (var _i11 = 0, _il3 = groups.length; _i11 < _il3; ++_i11) {
																																			var _group = groups[_i11];
																																			var _start = _group.start;
																																			var _count = _group.count;
																																			for (var _j4 = _start, _jl = _start + _count; _j4 < _jl; _j4 += 3) {
																																								handleVertex(indices[_j4 + 0]);
																																								handleVertex(indices[_j4 + 1]);
																																								handleVertex(indices[_j4 + 2]);
																																			}
																														}
																									}
																				}, {
																									key: 'computeVertexNormals',
																									value: function computeVertexNormals() {
																														var index = this.index;
																														var positionAttribute = this.getAttribute('position');
																														if (positionAttribute !== undefined) {
																																			var normalAttribute = this.getAttribute('normal');
																																			if (normalAttribute === undefined) {
																																								normalAttribute = new BufferAttribute(new Float32Array(positionAttribute.count * 3), 3);
																																								this.setAttribute('normal', normalAttribute);
																																			} else {
																																								for (var i = 0, il = normalAttribute.count; i < il; i++) {
																																													normalAttribute.setXYZ(i, 0, 0, 0);
																																								}
																																			}
																																			var pA = new Vector3(),
																																			    pB = new Vector3(),
																																			    pC = new Vector3();
																																			var nA = new Vector3(),
																																			    nB = new Vector3(),
																																			    nC = new Vector3();
																																			var cb = new Vector3(),
																																			    ab = new Vector3();
																																			if (index) {
																																								for (var _i12 = 0, _il4 = index.count; _i12 < _il4; _i12 += 3) {
																																													var vA = index.getX(_i12 + 0);
																																													var vB = index.getX(_i12 + 1);
																																													var vC = index.getX(_i12 + 2);
																																													pA.fromBufferAttribute(positionAttribute, vA);
																																													pB.fromBufferAttribute(positionAttribute, vB);
																																													pC.fromBufferAttribute(positionAttribute, vC);
																																													cb.subVectors(pC, pB);
																																													ab.subVectors(pA, pB);
																																													cb.cross(ab);
																																													nA.fromBufferAttribute(normalAttribute, vA);
																																													nB.fromBufferAttribute(normalAttribute, vB);
																																													nC.fromBufferAttribute(normalAttribute, vC);
																																													nA.add(cb);
																																													nB.add(cb);
																																													nC.add(cb);
																																													normalAttribute.setXYZ(vA, nA.x, nA.y, nA.z);
																																													normalAttribute.setXYZ(vB, nB.x, nB.y, nB.z);
																																													normalAttribute.setXYZ(vC, nC.x, nC.y, nC.z);
																																								}
																																			} else {
																																								for (var _i13 = 0, _il5 = positionAttribute.count; _i13 < _il5; _i13 += 3) {
																																													pA.fromBufferAttribute(positionAttribute, _i13 + 0);
																																													pB.fromBufferAttribute(positionAttribute, _i13 + 1);
																																													pC.fromBufferAttribute(positionAttribute, _i13 + 2);
																																													cb.subVectors(pC, pB);
																																													ab.subVectors(pA, pB);
																																													cb.cross(ab);
																																													normalAttribute.setXYZ(_i13 + 0, cb.x, cb.y, cb.z);
																																													normalAttribute.setXYZ(_i13 + 1, cb.x, cb.y, cb.z);
																																													normalAttribute.setXYZ(_i13 + 2, cb.x, cb.y, cb.z);
																																								}
																																			}
																																			this.normalizeNormals();
																																			normalAttribute.needsUpdate = true;
																														}
																									}
																				}, {
																									key: 'merge',
																									value: function merge(geometry, offset) {
																														if (!(geometry && geometry.isBufferGeometry)) {
																																			console.error('THREE.BufferGeometry.merge(): geometry not an instance of THREE.BufferGeometry.', geometry);
																																			return;
																														}
																														if (offset === undefined) {
																																			offset = 0;
																																			console.warn('THREE.BufferGeometry.merge(): Overwriting original geometry, starting at offset=0. ' + 'Use BufferGeometryUtils.mergeBufferGeometries() for lossless merge.');
																														}
																														var attributes = this.attributes;
																														for (var key in attributes) {
																																			if (geometry.attributes[key] === undefined) continue;
																																			var attribute1 = attributes[key];
																																			var attributeArray1 = attribute1.array;
																																			var attribute2 = geometry.attributes[key];
																																			var attributeArray2 = attribute2.array;
																																			var attributeOffset = attribute2.itemSize * offset;
																																			var length = Math.min(attributeArray2.length, attributeArray1.length - attributeOffset);
																																			for (var i = 0, j = attributeOffset; i < length; i++, j++) {
																																								attributeArray1[j] = attributeArray2[i];
																																			}
																														}
																														return this;
																									}
																				}, {
																									key: 'normalizeNormals',
																									value: function normalizeNormals() {
																														var normals = this.attributes.normal;
																														for (var i = 0, il = normals.count; i < il; i++) {
																																			_vector.fromBufferAttribute(normals, i);
																																			_vector.normalize();
																																			normals.setXYZ(i, _vector.x, _vector.y, _vector.z);
																														}
																									}
																				}, {
																									key: 'toNonIndexed',
																									value: function toNonIndexed() {
																														function convertBufferAttribute(attribute, indices) {
																																			var array = attribute.array;
																																			var itemSize = attribute.itemSize;
																																			var normalized = attribute.normalized;
																																			var array2 = new array.constructor(indices.length * itemSize);
																																			var index = 0,
																																			    index2 = 0;
																																			for (var i = 0, l = indices.length; i < l; i++) {
																																								if (attribute.isInterleavedBufferAttribute) {
																																													index = indices[i] * attribute.data.stride + attribute.offset;
																																								} else {
																																													index = indices[i] * itemSize;
																																								}
																																								for (var j = 0; j < itemSize; j++) {
																																													array2[index2++] = array[index++];
																																								}
																																			}
																																			return new BufferAttribute(array2, itemSize, normalized);
																														}
																														if (this.index === null) {
																																			console.warn('THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed.');
																																			return this;
																														}
																														var geometry2 = new BufferGeometry();
																														var indices = this.index.array;
																														var attributes = this.attributes;
																														for (var name in attributes) {
																																			var attribute = attributes[name];
																																			var newAttribute = convertBufferAttribute(attribute, indices);
																																			geometry2.setAttribute(name, newAttribute);
																														}
																														var morphAttributes = this.morphAttributes;
																														for (var _name in morphAttributes) {
																																			var morphArray = [];
																																			var morphAttribute = morphAttributes[_name];
																																			for (var i = 0, il = morphAttribute.length; i < il; i++) {
																																								var _attribute = morphAttribute[i];
																																								var _newAttribute = convertBufferAttribute(_attribute, indices);
																																								morphArray.push(_newAttribute);
																																			}
																																			geometry2.morphAttributes[_name] = morphArray;
																														}
																														geometry2.morphTargetsRelative = this.morphTargetsRelative;
																														var groups = this.groups;
																														for (var _i14 = 0, l = groups.length; _i14 < l; _i14++) {
																																			var group = groups[_i14];
																																			geometry2.addGroup(group.start, group.count, group.materialIndex);
																														}
																														return geometry2;
																									}
																				}, {
																									key: 'toJSON',
																									value: function toJSON() {
																														var data = {
																																			metadata: {
																																								version: 4.5,
																																								type: 'BufferGeometry',
																																								generator: 'BufferGeometry.toJSON'
																																			}
																														};
																														data.uuid = this.uuid;
																														data.type = this.type;
																														if (this.name !== '') data.name = this.name;
																														if (Object.keys(this.userData).length > 0) data.userData = this.userData;
																														if (this.parameters !== undefined) {
																																			var parameters = this.parameters;
																																			for (var key in parameters) {
																																								if (parameters[key] !== undefined) data[key] = parameters[key];
																																			}
																																			return data;
																														}
																														data.data = { attributes: {} };
																														var index = this.index;
																														if (index !== null) {
																																			data.data.index = {
																																								type: index.array.constructor.name,
																																								array: Array.prototype.slice.call(index.array)
																																			};
																														}
																														var attributes = this.attributes;
																														for (var _key in attributes) {
																																			var attribute = attributes[_key];
																																			data.data.attributes[_key] = attribute.toJSON(data.data);
																														}
																														var morphAttributes = {};
																														var hasMorphAttributes = false;
																														for (var _key2 in this.morphAttributes) {
																																			var attributeArray = this.morphAttributes[_key2];
																																			var array = [];
																																			for (var i = 0, il = attributeArray.length; i < il; i++) {
																																								var _attribute2 = attributeArray[i];
																																								array.push(_attribute2.toJSON(data.data));
																																			}
																																			if (array.length > 0) {
																																								morphAttributes[_key2] = array;
																																								hasMorphAttributes = true;
																																			}
																														}
																														if (hasMorphAttributes) {
																																			data.data.morphAttributes = morphAttributes;
																																			data.data.morphTargetsRelative = this.morphTargetsRelative;
																														}
																														var groups = this.groups;
																														if (groups.length > 0) {
																																			data.data.groups = JSON.parse(JSON.stringify(groups));
																														}
																														var boundingSphere = this.boundingSphere;
																														if (boundingSphere !== null) {
																																			data.data.boundingSphere = {
																																								center: boundingSphere.center.toArray(),
																																								radius: boundingSphere.radius
																																			};
																														}
																														return data;
																									}
																				}, {
																									key: 'clone',
																									value: function clone() {
																														return new this.constructor().copy(this);
																									}
																				}, {
																									key: 'copy',
																									value: function copy(source) {
																														this.index = null;
																														this.attributes = {};
																														this.morphAttributes = {};
																														this.groups = [];
																														this.boundingBox = null;
																														this.boundingSphere = null;
																														var data = {};
																														this.name = source.name;
																														var index = source.index;
																														if (index !== null) {
																																			this.setIndex(index.clone(data));
																														}
																														var attributes = source.attributes;
																														for (var name in attributes) {
																																			var attribute = attributes[name];
																																			this.setAttribute(name, attribute.clone(data));
																														}
																														var morphAttributes = source.morphAttributes;
																														for (var _name2 in morphAttributes) {
																																			var array = [];
																																			var morphAttribute = morphAttributes[_name2];
																																			for (var i = 0, l = morphAttribute.length; i < l; i++) {
																																								array.push(morphAttribute[i].clone(data));
																																			}
																																			this.morphAttributes[_name2] = array;
																														}
																														this.morphTargetsRelative = source.morphTargetsRelative;
																														var groups = source.groups;
																														for (var _i15 = 0, _l3 = groups.length; _i15 < _l3; _i15++) {
																																			var group = groups[_i15];
																																			this.addGroup(group.start, group.count, group.materialIndex);
																														}
																														var boundingBox = source.boundingBox;
																														if (boundingBox !== null) {
																																			this.boundingBox = boundingBox.clone();
																														}
																														var boundingSphere = source.boundingSphere;
																														if (boundingSphere !== null) {
																																			this.boundingSphere = boundingSphere.clone();
																														}
																														this.drawRange.start = source.drawRange.start;
																														this.drawRange.count = source.drawRange.count;
																														this.userData = source.userData;
																														if (source.parameters !== undefined) this.parameters = Object.assign({}, source.parameters);
																														return this;
																									}
																				}, {
																									key: 'dispose',
																									value: function dispose() {
																														this.dispatchEvent({ type: 'dispose' });
																									}
																				}]);
																				return BufferGeometry;
															}(EventDispatcher);
															BufferGeometry.prototype.isBufferGeometry = true;
															var ConvexGeometry = function (_BufferGeometry) {
																				inherits(ConvexGeometry, _BufferGeometry);
																				function ConvexGeometry(points) {
																									classCallCheck(this, ConvexGeometry);
																									var _this2 = possibleConstructorReturn(this, (ConvexGeometry.__proto__ || Object.getPrototypeOf(ConvexGeometry)).call(this));
																									var vertices = [];
																									var normals = [];
																									if (ConvexHull === undefined) {
																														console.error('THREE.ConvexBufferGeometry: ConvexBufferGeometry relies on ConvexHull');
																									}
																									var convexHull = new _Three.ConvexHull().setFromPoints(points);
																									var faces = convexHull.faces;
																									for (var i = 0; i < faces.length; i++) {
																														var face = faces[i];
																														var edge = face.edge;
																														do {
																																			var point = edge.head().point;
																																			vertices.push(point.x, point.y, point.z);
																																			normals.push(face.normal.x, face.normal.y, face.normal.z);
																																			edge = edge.next;
																														} while (edge !== face.edge);
																									}
																									_this2.setAttribute('position', new Float32BufferAttribute(vertices, 3));
																									_this2.setAttribute('normal', new Float32BufferAttribute(normals, 3));
																									return _this2;
																				}
																				return ConvexGeometry;
															}(BufferGeometry);
															this.ConvexGeometry = ConvexGeometry;
															var
															MOUSE = three.THREE.MOUSE,
															    Quaternion = three.THREE.Quaternion,
															    Spherical = three.THREE.Spherical,
															    TOUCH = three.THREE.TOUCH;
															var _changeEvent = { type: 'change' };
															var _startEvent = { type: 'start' };
															var _endEvent = { type: 'end' };
															var OrbitControls = function (_EventDispatcher2) {
																				inherits(OrbitControls, _EventDispatcher2);
																				function OrbitControls(object, domElement) {
																									classCallCheck(this, OrbitControls);
																									var _this3 = possibleConstructorReturn(this, (OrbitControls.__proto__ || Object.getPrototypeOf(OrbitControls)).call(this));
																									if (domElement === undefined) console.warn('THREE.OrbitControls: The second parameter "domElement" is now mandatory.');
																									if (domElement === document) console.error('THREE.OrbitControls: "document" should not be used as the target "domElement". Please use "renderer.domElement" instead.');
																									_this3.object = object;
																									_this3.domElement = domElement;
																									_this3.domElement.style.touchAction = 'none';
																									_this3.enabled = true;
																									_this3.target = new Vector3();
																									_this3.minDistance = 0;
																									_this3.maxDistance = Infinity;
																									_this3.minZoom = 0;
																									_this3.maxZoom = Infinity;
																									_this3.minPolarAngle = 0;
																									_this3.maxPolarAngle = Math.PI;
																									_this3.minAzimuthAngle = -Infinity;
																									_this3.maxAzimuthAngle = Infinity;
																									_this3.enableDamping = false;
																									_this3.dampingFactor = 0.05;
																									_this3.enableZoom = true;
																									_this3.zoomSpeed = 1.0;
																									_this3.enableRotate = true;
																									_this3.rotateSpeed = 1.0;
																									_this3.enablePan = true;
																									_this3.panSpeed = 1.0;
																									_this3.screenSpacePanning = true;
																									_this3.keyPanSpeed = 7.0;
																									_this3.autoRotate = false;
																									_this3.autoRotateSpeed = 2.0;
																									_this3.keys = { LEFT: 'ArrowLeft', UP: 'ArrowUp', RIGHT: 'ArrowRight', BOTTOM: 'ArrowDown' };
																									_this3.mouseButtons = { LEFT: MOUSE.ROTATE, MIDDLE: MOUSE.DOLLY, RIGHT: MOUSE.PAN };
																									_this3.touches = { ONE: TOUCH.ROTATE, TWO: TOUCH.DOLLY_PAN };
																									_this3.target0 = _this3.target.clone();
																									_this3.position0 = _this3.object.position.clone();
																									_this3.zoom0 = _this3.object.zoom;
																									_this3._domElementKeyEvents = null;
																									_this3.getPolarAngle = function () {
																														return spherical.phi;
																									};
																									_this3.getAzimuthalAngle = function () {
																														return spherical.theta;
																									};
																									_this3.getDistance = function () {
																														return this.object.position.distanceTo(this.target);
																									};
																									_this3.listenToKeyEvents = function (domElement) {
																														domElement.addEventListener('keydown', onKeyDown);
																														this._domElementKeyEvents = domElement;
																									};
																									_this3.saveState = function () {
																														scope.target0.copy(scope.target);
																														scope.position0.copy(scope.object.position);
																														scope.zoom0 = scope.object.zoom;
																									};
																									_this3.reset = function () {
																														scope.target.copy(scope.target0);
																														scope.object.position.copy(scope.position0);
																														scope.object.zoom = scope.zoom0;
																														scope.object.updateProjectionMatrix();
																														scope.dispatchEvent(_changeEvent);
																														scope.update();
																														state = STATE.NONE;
																									};
																									_this3.update = function () {
																														var offset = new Vector3();
																														var quat = new Quaternion().setFromUnitVectors(object.up, new Vector3(0, 1, 0));
																														var quatInverse = quat.clone().invert();
																														var lastPosition = new Vector3();
																														var lastQuaternion = new Quaternion();
																														var twoPI = 2 * Math.PI;
																														return function update() {
																																			var position = scope.object.position;
																																			offset.copy(position).sub(scope.target);
																																			offset.applyQuaternion(quat);
																																			spherical.setFromVector3(offset);
																																			if (scope.autoRotate && state === STATE.NONE) {
																																								rotateLeft(getAutoRotationAngle());
																																			}
																																			if (scope.enableDamping) {
																																								spherical.theta += sphericalDelta.theta * scope.dampingFactor;
																																								spherical.phi += sphericalDelta.phi * scope.dampingFactor;
																																			} else {
																																								spherical.theta += sphericalDelta.theta;
																																								spherical.phi += sphericalDelta.phi;
																																			}
																																			var min = scope.minAzimuthAngle;
																																			var max = scope.maxAzimuthAngle;
																																			if (isFinite(min) && isFinite(max)) {
																																								if (min < -Math.PI) min += twoPI;else if (min > Math.PI) min -= twoPI;
																																								if (max < -Math.PI) max += twoPI;else if (max > Math.PI) max -= twoPI;
																																								if (min <= max) {
																																													spherical.theta = Math.max(min, Math.min(max, spherical.theta));
																																								} else {
																																													spherical.theta = spherical.theta > (min + max) / 2 ? Math.max(min, spherical.theta) : Math.min(max, spherical.theta);
																																								}
																																			}
																																			spherical.phi = Math.max(scope.minPolarAngle, Math.min(scope.maxPolarAngle, spherical.phi));
																																			spherical.makeSafe();
																																			spherical.radius *= scale;
																																			spherical.radius = Math.max(scope.minDistance, Math.min(scope.maxDistance, spherical.radius));
																																			if (scope.enableDamping === true) {
																																								scope.target.addScaledVector(panOffset, scope.dampingFactor);
																																			} else {
																																								scope.target.add(panOffset);
																																			}
																																			offset.setFromSpherical(spherical);
																																			offset.applyQuaternion(quatInverse);
																																			position.copy(scope.target).add(offset);
																																			scope.object.lookAt(scope.target);
																																			if (scope.enableDamping === true) {
																																								sphericalDelta.theta *= 1 - scope.dampingFactor;
																																								sphericalDelta.phi *= 1 - scope.dampingFactor;
																																								panOffset.multiplyScalar(1 - scope.dampingFactor);
																																			} else {
																																								sphericalDelta.set(0, 0, 0);
																																								panOffset.set(0, 0, 0);
																																			}
																																			scale = 1;
																																			if (zoomChanged || lastPosition.distanceToSquared(scope.object.position) > EPS || 8 * (1 - lastQuaternion.dot(scope.object.quaternion)) > EPS) {
																																								scope.dispatchEvent(_changeEvent);
																																								lastPosition.copy(scope.object.position);
																																								lastQuaternion.copy(scope.object.quaternion);
																																								zoomChanged = false;
																																								return true;
																																			}
																																			return false;
																														};
																									}();
																									_this3.dispose = function () {
																														scope.domElement.removeEventListener('contextmenu', onContextMenu);
																														scope.domElement.removeEventListener('pointerdown', onPointerDown);
																														scope.domElement.removeEventListener('pointercancel', onPointerCancel);
																														scope.domElement.removeEventListener('wheel', onMouseWheel);
																														scope.domElement.removeEventListener('pointermove', onPointerMove);
																														scope.domElement.removeEventListener('pointerup', onPointerUp);
																														if (scope._domElementKeyEvents !== null) {
																																			scope._domElementKeyEvents.removeEventListener('keydown', onKeyDown);
																														}
																									};
																									var scope = _this3;
																									var STATE = {
																														NONE: -1,
																														ROTATE: 0,
																														DOLLY: 1,
																														PAN: 2,
																														TOUCH_ROTATE: 3,
																														TOUCH_PAN: 4,
																														TOUCH_DOLLY_PAN: 5,
																														TOUCH_DOLLY_ROTATE: 6
																									};
																									var state = STATE.NONE;
																									var EPS = 0.000001;
																									var spherical = new Spherical();
																									var sphericalDelta = new Spherical();
																									var scale = 1;
																									var panOffset = new Vector3();
																									var zoomChanged = false;
																									var rotateStart = new Vector2();
																									var rotateEnd = new Vector2();
																									var rotateDelta = new Vector2();
																									var panStart = new Vector2();
																									var panEnd = new Vector2();
																									var panDelta = new Vector2();
																									var dollyStart = new Vector2();
																									var dollyEnd = new Vector2();
																									var dollyDelta = new Vector2();
																									var pointers = [];
																									var pointerPositions = {};
																									function getAutoRotationAngle() {
																														return 2 * Math.PI / 60 / 60 * scope.autoRotateSpeed;
																									}
																									function getZoomScale() {
																														return Math.pow(0.95, scope.zoomSpeed);
																									}
																									function rotateLeft(angle) {
																														sphericalDelta.theta -= angle;
																									}
																									function rotateUp(angle) {
																														sphericalDelta.phi -= angle;
																									}
																									var panLeft = function () {
																														var v = new Vector3();
																														return function panLeft(distance, objectMatrix) {
																																			v.setFromMatrixColumn(objectMatrix, 0);
																																			v.multiplyScalar(-distance);
																																			panOffset.add(v);
																														};
																									}();
																									var panUp = function () {
																														var v = new Vector3();
																														return function panUp(distance, objectMatrix) {
																																			if (scope.screenSpacePanning === true) {
																																								v.setFromMatrixColumn(objectMatrix, 1);
																																			} else {
																																								v.setFromMatrixColumn(objectMatrix, 0);
																																								v.crossVectors(scope.object.up, v);
																																			}
																																			v.multiplyScalar(distance);
																																			panOffset.add(v);
																														};
																									}();
																									var pan = function () {
																														var offset = new Vector3();
																														return function pan(deltaX, deltaY) {
																																			var element = scope.domElement;
																																			if (scope.object.isPerspectiveCamera) {
																																								var position = scope.object.position;
																																								offset.copy(position).sub(scope.target);
																																								var targetDistance = offset.length();
																																								targetDistance *= Math.tan(scope.object.fov / 2 * Math.PI / 180.0);
																																								panLeft(2 * deltaX * targetDistance / element.clientHeight, scope.object.matrix);
																																								panUp(2 * deltaY * targetDistance / element.clientHeight, scope.object.matrix);
																																			} else if (scope.object.isOrthographicCamera) {
																																								panLeft(deltaX * (scope.object.right - scope.object.left) / scope.object.zoom / element.clientWidth, scope.object.matrix);
																																								panUp(deltaY * (scope.object.top - scope.object.bottom) / scope.object.zoom / element.clientHeight, scope.object.matrix);
																																			} else {
																																								console.warn('WARNING: OrbitControls.js encountered an unknown camera type - pan disabled.');
																																								scope.enablePan = false;
																																			}
																														};
																									}();
																									function dollyOut(dollyScale) {
																														if (scope.object.isPerspectiveCamera) {
																																			scale /= dollyScale;
																														} else if (scope.object.isOrthographicCamera) {
																																			scope.object.zoom = Math.max(scope.minZoom, Math.min(scope.maxZoom, scope.object.zoom * dollyScale));
																																			scope.object.updateProjectionMatrix();
																																			zoomChanged = true;
																														} else {
																																			console.warn('WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.');
																																			scope.enableZoom = false;
																														}
																									}
																									function dollyIn(dollyScale) {
																														if (scope.object.isPerspectiveCamera) {
																																			scale *= dollyScale;
																														} else if (scope.object.isOrthographicCamera) {
																																			scope.object.zoom = Math.max(scope.minZoom, Math.min(scope.maxZoom, scope.object.zoom / dollyScale));
																																			scope.object.updateProjectionMatrix();
																																			zoomChanged = true;
																														} else {
																																			console.warn('WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.');
																																			scope.enableZoom = false;
																														}
																									}
																									function handleMouseDownRotate(event) {
																														rotateStart.set(event.clientX, event.clientY);
																									}
																									function handleMouseDownDolly(event) {
																														dollyStart.set(event.clientX, event.clientY);
																									}
																									function handleMouseDownPan(event) {
																														panStart.set(event.clientX, event.clientY);
																									}
																									function handleMouseMoveRotate(event) {
																														rotateEnd.set(event.clientX, event.clientY);
																														rotateDelta.subVectors(rotateEnd, rotateStart).multiplyScalar(scope.rotateSpeed);
																														var element = scope.domElement;
																														rotateLeft(2 * Math.PI * rotateDelta.x / element.clientHeight);
																														rotateUp(2 * Math.PI * rotateDelta.y / element.clientHeight);
																														rotateStart.copy(rotateEnd);
																														scope.update();
																									}
																									function handleMouseMoveDolly(event) {
																														dollyEnd.set(event.clientX, event.clientY);
																														dollyDelta.subVectors(dollyEnd, dollyStart);
																														if (dollyDelta.y > 0) {
																																			dollyOut(getZoomScale());
																														} else if (dollyDelta.y < 0) {
																																			dollyIn(getZoomScale());
																														}
																														dollyStart.copy(dollyEnd);
																														scope.update();
																									}
																									function handleMouseMovePan(event) {
																														panEnd.set(event.clientX, event.clientY);
																														panDelta.subVectors(panEnd, panStart).multiplyScalar(scope.panSpeed);
																														pan(panDelta.x, panDelta.y);
																														panStart.copy(panEnd);
																														scope.update();
																									}
																									function handleMouseWheel(event) {
																														if (event.deltaY < 0) {
																																			dollyIn(getZoomScale());
																														} else if (event.deltaY > 0) {
																																			dollyOut(getZoomScale());
																														}
																														scope.update();
																									}
																									function handleKeyDown(event) {
																														var needsUpdate = false;
																														switch (event.code) {
																																			case scope.keys.UP:
																																								pan(0, scope.keyPanSpeed);
																																								needsUpdate = true;
																																								break;
																																			case scope.keys.BOTTOM:
																																								pan(0, -scope.keyPanSpeed);
																																								needsUpdate = true;
																																								break;
																																			case scope.keys.LEFT:
																																								pan(scope.keyPanSpeed, 0);
																																								needsUpdate = true;
																																								break;
																																			case scope.keys.RIGHT:
																																								pan(-scope.keyPanSpeed, 0);
																																								needsUpdate = true;
																																								break;
																														}
																														if (needsUpdate) {
																																			event.preventDefault();
																																			scope.update();
																														}
																									}
																									function handleTouchStartRotate() {
																														if (pointers.length === 1) {
																																			rotateStart.set(pointers[0].pageX, pointers[0].pageY);
																														} else {
																																			var x = 0.5 * (pointers[0].pageX + pointers[1].pageX);
																																			var y = 0.5 * (pointers[0].pageY + pointers[1].pageY);
																																			rotateStart.set(x, y);
																														}
																									}
																									function handleTouchStartPan() {
																														if (pointers.length === 1) {
																																			panStart.set(pointers[0].pageX, pointers[0].pageY);
																														} else {
																																			var x = 0.5 * (pointers[0].pageX + pointers[1].pageX);
																																			var y = 0.5 * (pointers[0].pageY + pointers[1].pageY);
																																			panStart.set(x, y);
																														}
																									}
																									function handleTouchStartDolly() {
																														var dx = pointers[0].pageX - pointers[1].pageX;
																														var dy = pointers[0].pageY - pointers[1].pageY;
																														var distance = Math.sqrt(dx * dx + dy * dy);
																														dollyStart.set(0, distance);
																									}
																									function handleTouchStartDollyPan() {
																														if (scope.enableZoom) handleTouchStartDolly();
																														if (scope.enablePan) handleTouchStartPan();
																									}
																									function handleTouchStartDollyRotate() {
																														if (scope.enableZoom) handleTouchStartDolly();
																														if (scope.enableRotate) handleTouchStartRotate();
																									}
																									function handleTouchMoveRotate(event) {
																														if (pointers.length == 1) {
																																			rotateEnd.set(event.pageX, event.pageY);
																														} else {
																																			var position = getSecondPointerPosition(event);
																																			var x = 0.5 * (event.pageX + position.x);
																																			var y = 0.5 * (event.pageY + position.y);
																																			rotateEnd.set(x, y);
																														}
																														rotateDelta.subVectors(rotateEnd, rotateStart).multiplyScalar(scope.rotateSpeed);
																														var element = scope.domElement;
																														rotateLeft(2 * Math.PI * rotateDelta.x / element.clientHeight);
																														rotateUp(2 * Math.PI * rotateDelta.y / element.clientHeight);
																														rotateStart.copy(rotateEnd);
																									}
																									function handleTouchMovePan(event) {
																														if (pointers.length === 1) {
																																			panEnd.set(event.pageX, event.pageY);
																														} else {
																																			var position = getSecondPointerPosition(event);
																																			var x = 0.5 * (event.pageX + position.x);
																																			var y = 0.5 * (event.pageY + position.y);
																																			panEnd.set(x, y);
																														}
																														panDelta.subVectors(panEnd, panStart).multiplyScalar(scope.panSpeed);
																														pan(panDelta.x, panDelta.y);
																														panStart.copy(panEnd);
																									}
																									function handleTouchMoveDolly(event) {
																														var position = getSecondPointerPosition(event);
																														var dx = event.pageX - position.x;
																														var dy = event.pageY - position.y;
																														var distance = Math.sqrt(dx * dx + dy * dy);
																														dollyEnd.set(0, distance);
																														dollyDelta.set(0, Math.pow(dollyEnd.y / dollyStart.y, scope.zoomSpeed));
																														dollyOut(dollyDelta.y);
																														dollyStart.copy(dollyEnd);
																									}
																									function handleTouchMoveDollyPan(event) {
																														if (scope.enableZoom) handleTouchMoveDolly(event);
																														if (scope.enablePan) handleTouchMovePan(event);
																									}
																									function handleTouchMoveDollyRotate(event) {
																														if (scope.enableZoom) handleTouchMoveDolly(event);
																														if (scope.enableRotate) handleTouchMoveRotate(event);
																									}
																									function onPointerDown(event) {
																														if (scope.enabled === false) return;
																														if (pointers.length === 0) {
																																			scope.domElement.setPointerCapture(event.pointerId);
																																			scope.domElement.addEventListener('pointermove', onPointerMove);
																																			scope.domElement.addEventListener('pointerup', onPointerUp);
																														}
																														addPointer(event);
																														if (event.pointerType === 'touch') {
																																			onTouchStart(event);
																														} else {
																																			onMouseDown(event);
																														}
																									}
																									function onPointerMove(event) {
																														if (scope.enabled === false) return;
																														if (event.pointerType === 'touch') {
																																			onTouchMove(event);
																														} else {
																																			onMouseMove(event);
																														}
																									}
																									function onPointerUp(event) {
																														if (scope.enabled === false) return;
																														if (event.pointerType === 'touch') {
																																			onTouchEnd();
																														} else {
																																			onMouseUp(event);
																														}
																														removePointer(event);
																														if (pointers.length === 0) {
																																			scope.domElement.releasePointerCapture(event.pointerId);
																																			scope.domElement.removeEventListener('pointermove', onPointerMove);
																																			scope.domElement.removeEventListener('pointerup', onPointerUp);
																														}
																									}
																									function onPointerCancel(event) {
																														removePointer(event);
																									}
																									function onMouseDown(event) {
																														var mouseAction = void 0;
																														switch (event.button) {
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
																																								mouseAction = -1;
																														}
																														switch (mouseAction) {
																																			case MOUSE.DOLLY:
																																								if (scope.enableZoom === false) return;
																																								handleMouseDownDolly(event);
																																								state = STATE.DOLLY;
																																								break;
																																			case MOUSE.ROTATE:
																																								if (event.ctrlKey || event.metaKey || event.shiftKey) {
																																													if (scope.enablePan === false) return;
																																													handleMouseDownPan(event);
																																													state = STATE.PAN;
																																								} else {
																																													if (scope.enableRotate === false) return;
																																													handleMouseDownRotate(event);
																																													state = STATE.ROTATE;
																																								}
																																								break;
																																			case MOUSE.PAN:
																																								if (event.ctrlKey || event.metaKey || event.shiftKey) {
																																													if (scope.enableRotate === false) return;
																																													handleMouseDownRotate(event);
																																													state = STATE.ROTATE;
																																								} else {
																																													if (scope.enablePan === false) return;
																																													handleMouseDownPan(event);
																																													state = STATE.PAN;
																																								}
																																								break;
																																			default:
																																								state = STATE.NONE;
																														}
																														if (state !== STATE.NONE) {
																																			scope.dispatchEvent(_startEvent);
																														}
																									}
																									function onMouseMove(event) {
																														if (scope.enabled === false) return;
																														switch (state) {
																																			case STATE.ROTATE:
																																								if (scope.enableRotate === false) return;
																																								handleMouseMoveRotate(event);
																																								break;
																																			case STATE.DOLLY:
																																								if (scope.enableZoom === false) return;
																																								handleMouseMoveDolly(event);
																																								break;
																																			case STATE.PAN:
																																								if (scope.enablePan === false) return;
																																								handleMouseMovePan(event);
																																								break;
																														}
																									}
																									function onMouseUp(event) {
																														scope.dispatchEvent(_endEvent);
																														state = STATE.NONE;
																									}
																									function onMouseWheel(event) {
																														if (scope.enabled === false || scope.enableZoom === false || state !== STATE.NONE && state !== STATE.ROTATE) return;
																														event.preventDefault();
																														scope.dispatchEvent(_startEvent);
																														handleMouseWheel(event);
																														scope.dispatchEvent(_endEvent);
																									}
																									function onKeyDown(event) {
																														if (scope.enabled === false || scope.enablePan === false) return;
																														handleKeyDown(event);
																									}
																									function onTouchStart(event) {
																														trackPointer(event);
																														switch (pointers.length) {
																																			case 1:
																																								switch (scope.touches.ONE) {
																																													case TOUCH.ROTATE:
																																																		if (scope.enableRotate === false) return;
																																																		handleTouchStartRotate();
																																																		state = STATE.TOUCH_ROTATE;
																																																		break;
																																													case TOUCH.PAN:
																																																		if (scope.enablePan === false) return;
																																																		handleTouchStartPan();
																																																		state = STATE.TOUCH_PAN;
																																																		break;
																																													default:
																																																		state = STATE.NONE;
																																								}
																																								break;
																																			case 2:
																																								switch (scope.touches.TWO) {
																																													case TOUCH.DOLLY_PAN:
																																																		if (scope.enableZoom === false && scope.enablePan === false) return;
																																																		handleTouchStartDollyPan();
																																																		state = STATE.TOUCH_DOLLY_PAN;
																																																		break;
																																													case TOUCH.DOLLY_ROTATE:
																																																		if (scope.enableZoom === false && scope.enableRotate === false) return;
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
																														if (state !== STATE.NONE) {
																																			scope.dispatchEvent(_startEvent);
																														}
																									}
																									function onTouchMove(event) {
																														trackPointer(event);
																														switch (state) {
																																			case STATE.TOUCH_ROTATE:
																																								if (scope.enableRotate === false) return;
																																								handleTouchMoveRotate(event);
																																								scope.update();
																																								break;
																																			case STATE.TOUCH_PAN:
																																								if (scope.enablePan === false) return;
																																								handleTouchMovePan(event);
																																								scope.update();
																																								break;
																																			case STATE.TOUCH_DOLLY_PAN:
																																								if (scope.enableZoom === false && scope.enablePan === false) return;
																																								handleTouchMoveDollyPan(event);
																																								scope.update();
																																								break;
																																			case STATE.TOUCH_DOLLY_ROTATE:
																																								if (scope.enableZoom === false && scope.enableRotate === false) return;
																																								handleTouchMoveDollyRotate(event);
																																								scope.update();
																																								break;
																																			default:
																																								state = STATE.NONE;
																														}
																									}
																									function onTouchEnd(event) {
																														scope.dispatchEvent(_endEvent);
																														state = STATE.NONE;
																									}
																									function onContextMenu(event) {
																														if (scope.enabled === false) return;
																														event.preventDefault();
																									}
																									function addPointer(event) {
																														pointers.push(event);
																									}
																									function removePointer(event) {
																														delete pointerPositions[event.pointerId];
																														for (var i = 0; i < pointers.length; i++) {
																																			if (pointers[i].pointerId == event.pointerId) {
																																								pointers.splice(i, 1);
																																								return;
																																			}
																														}
																									}
																									function trackPointer(event) {
																														var position = pointerPositions[event.pointerId];
																														if (position === undefined) {
																																			position = new Vector2();
																																			pointerPositions[event.pointerId] = position;
																														}
																														position.set(event.pageX, event.pageY);
																									}
																									function getSecondPointerPosition(event) {
																														var pointer = event.pointerId === pointers[0].pointerId ? pointers[1] : pointers[0];
																														return pointerPositions[pointer.pointerId];
																									}
																									scope.domElement.addEventListener('contextmenu', onContextMenu);
																									scope.domElement.addEventListener('pointerdown', onPointerDown);
																									scope.domElement.addEventListener('pointercancel', onPointerCancel);
																									scope.domElement.addEventListener('wheel', onMouseWheel, { passive: false });
																									_this3.update();
																									return _this3;
																				}
																				return OrbitControls;
															}(EventDispatcher);
															this.OrbitControls = OrbitControls;
										}
										,
										get: function get$$1() {
															if (_THREE === undefined) console.error('three: invalid _THREE = ' + _THREE + '. Call three.THREE = THREE first.');
															return _THREE;
										}
					}, {
										key: 'dat',
										set: function set$$1(dat) {
															if (_dat) {
																				if (!Object.is(dat, _dat)) console.error('three: duplicate dat. Please use one instance of the dat library.');
																				return;
															}
															_dat = dat;
										}
										,
										get: function get$$1() {
															return _dat;
										}
					}]);
					return Three;
}();
var three;
window.__myThree__ = window.__myThree__ || {};
if (window.__myThree__.three) {
					three = window.__myThree__.three;
} else {
					three = new Three();
					three.isThree = function () {
										return _THREE;
					};
					window.__myThree__.three = three;
}
var three$1 = three;

/**
 * node.js version of my common functions.
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
var common = {
  getLanguageCode: getLanguageCode,
  three: three$1
};

exports['default'] = common;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=common.js.map
