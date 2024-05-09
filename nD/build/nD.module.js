/**
 * @module ND
 * @description N-dimensional graphics.
 *
 * @author [Andrej Hristoliubov]{@link https://anhr.github.io/AboutMe/}
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */

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





var defineProperty = function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
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



















var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
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
																																								console.warn('WARNING: OrbitControls encountered an unknown camera type - pan disabled.');
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
																																			console.warn('WARNING: OrbitControls encountered an unknown camera type - dolly/zoom disabled.');
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
																																			console.warn('WARNING: OrbitControls encountered an unknown camera type - dolly/zoom disabled.');
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
function myRequest(options) {
	this.loadXMLDoc = function () {
		var req;
		if (window.XMLHttpRequest) {
			req = new XMLHttpRequest();
			if (!req) throw "new XMLHttpRequest() failed!";
		} else if (window.ActiveXObject) {
			req = this.NewActiveXObject();
			if (!req) throw "NewActiveXObject() failed!";
		} else throw "myRequest.loadXMLDoc(...) failed!";
		return req;
	};
	this.NewActiveXObject = function () {
		try {
			return new ActiveXObject("Msxml2.XMLHTTP.6.0");
		} catch (e) {}
		try {
			return new ActiveXObject("Msxml2.XMLHTTP.3.0");
		} catch (e) {}
		try {
			return new ActiveXObject("Msxml2.XMLHTTP");
		} catch (e) {}
		try {
			return new ActiveXObject("Microsoft.XMLHTTP");
		} catch (e) {}
		ErrorMessage('This browser does not support XMLHttpRequest. Probably, your security settings do not allow Web sites to use ActiveX controls installed on your computer. Refresh your Web page to find out the current status of your Web page or enable the "Initialize and script ActiveX controls not marked as safe" and "Run Active X controls and plug-ins" of the Security settings of the Internet zone of your browser.');
		return null;
	};
	this.XMLHttpRequestStart = function (onreadystatechange, async) {
		this.XMLHttpRequestStop();
		this.req.onreadystatechange = onreadystatechange;
		if ("onerror" in this.req) {
			this.req.onerror = function (event) {
				ErrorMessage("XMLHttpRequest error. url: " + this.url, false, false);
			};
		}
		this.XMLHttpRequestReStart(async);
	};
	this.getUrl = function () {
		if (typeof this.url == 'undefined' || this.url == null) {
			ErrorMessage('XMLHttpRequest: Invalid url: ' + this.url);
		}
		return this.url + (this.params ? this.params : "");
	};
	this.XMLHttpRequestReStart = function (async) {
		try {
			if (typeof async == 'undefined') async = true;
			this.req.open("GET", this.getUrl(), async);
			if (async) {
				var timeout = (60 + 30) * 1000;
				if ("timeout" in this.req)
					this.req.timeout = timeout;
				if ("ontimeout" in this.req) this.req.ontimeout = function () {
					ErrorMessage('XMLHttpRequest timeout', false, false);
				};else {
					clearTimeout(this.timeout_id_SendReq);
					this.timeout_id_SendReq = setTimeout(function () {
						ErrorMessage('XMLHttpRequest timeout 2', false, false);
					}, timeout);
				}
			}
			this.req.send(null);
		} catch (e) {
			ErrorMessage(e.message + " url: " + this.url, false, false);
		}
	};
	this.XMLHttpRequestStop = function () {
		if (this.req == null) return;
		this.req.abort();
	};
	this.ProcessReqChange = function (processStatus200) {
		var req = this.req;
		switch (req.readyState) {
			case 4:
				{
					if (typeof req.status == "unknown") {
						consoleError('typeof XMLHttpRequest status == "unknown"');
						return true;
					}
					if (req.status == 200)
						{
							clearTimeout(this.timeout_id_SendReq);
							return processStatus200(this);
						}
					else {
							ErrorMessage("Invalid XMLHttpRequest status : " + req.status + " url: " + this.url);
						}
				}
				break;
			case 1:
			case 2:
			case 3:
				break;
			case 0:
			default:
				throw "processReqChange(); req.readyState = " + req.readyState;
				break;
		}
		return true;
	};
	this.processStatus200Error = function () {
		var error = this.GetElementText('error', true);
		if (error) {
			ErrorMessage(error);
			return true;
		}
		return false;
	};
	this.GetElementText = function (tagName, noDisplayErrorMessage) {
		var xmlhttp = this.req;
		if (!xmlhttp.responseXML) {
			if (noDisplayErrorMessage != true) ErrorMessage('GetXMLElementText(xmlhttp, ' + tagName + '); xmlhttp.responseXML is null.\nxmlhttp.responseText:\n' + xmlhttp.responseText);
			return null;
		}
		var element = xmlhttp.responseXML.getElementsByTagName(tagName);
		if (element.length == 0) {
			if (noDisplayErrorMessage != true) ErrorMessage('GetXMLElementText(xmlhttp, "' + tagName + '"); element.length == ' + element.length);
			return "";
		}
		var text = "";
		for (var i = 0; i < element.length; i++) {
			if (typeof element[i].textContent == 'undefined') {
				if (typeof element[i].text == 'undefined') {
					ErrorMessage('GetXMLElementText(xmlhttp, ' + tagName + '); element[' + i + '].text) == undefined');
					return '';
				}
				if (text != "") text += " ";
				text += element[i].text;
			} else text += element[i].textContent;
		}
		return text;
	};
	if (options.data) {
		this.req = options.data.req;
		this.url = options.data.url;
		this.params = options.data.params;
	} else {
		try {
			this.req = this.loadXMLDoc();
		} catch (e) {
			var message;
			if (typeof e.message == 'undefined') message = e;else message = e.message;
			ErrorMessage("Your browser is too old and is not compatible with our site.\n\n" + window.navigator.appName + " " + window.navigator.appVersion + "\n\n" + message);
			return;
		}
	}
	if (!this.req) {
		consoleError("Invalid myRequest.req: " + this.req);
		return;
	}
	function ErrorMessage(error) {
		console.error(error);
		options.onerror(error);
	}
}
function sync(url, options) {
	options = options || {};
	if (options.async === true) console.warn('Load file asynchronously is deprecated. Please use fetch.');
	options.onload = options.onload || function () {};
	options.onerror = options.onerror || function () {};
	var response,
	    request = new myRequest(options);
	request.url = url;
	request.XMLHttpRequestStart(function () {
		request.ProcessReqChange(function (myRequest) {
			if (myRequest.processStatus200Error()) return;
			response = myRequest.req.responseText;
			options.onload(response, url);
			return;
		});
	}, options.async === undefined ? false : true
	);
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
function sync$1(src, options) {
	options = options || {};
	options.onload = options.onload || function () {};
	options.onerror = options.onerror || function () {};
	options.appendTo = options.appendTo || document.getElementsByTagName('head')[0];
	if (isScriptExists(options.appendTo, src)) {
		options.onload();
		return;
	}
	if (src instanceof Array) {
		var error,
		    optionsItem = {
			appendTo: options.appendTo,
			tag: options.tag,
			onload: function onload(response, url) {
				console.log('loadScript.sync.onload: ' + url);
			},
			onerror: function onerror(str) {
				options.onerror(str);
				error = str;
			}
		};
		for (var i = 0; i < src.length; i++) {
			var item = src[i];
			loadScriptBase(function (script) {
				script.setAttribute("id", item);
				script.innerHTML = sync(item, optionsItem);
			}, optionsItem);
			if (error !== undefined) break;
		}
		if (error === undefined) options.onload();
	} else loadScriptBase(function (script) {
		script.setAttribute("id", src);
		script.innerHTML = sync(src, options);
	}, options);
}
function async$1(src, options) {
	options = options || {};
	options.appendTo = options.appendTo || document.getElementsByTagName('head')[0];
	options.onload = options.onload || function () {};
	var isrc;
	function async$$1(srcAsync) {
		function next() {
			if (src instanceof Array && isrc < src.length - 1) {
				isrc++;
				async$$1(src[isrc]);
			} else options.onload();
		}
		if (isScriptExists(options.appendTo, srcAsync, options.onload)) {
			next();
			return;
		}
		loadScriptBase(function (script) {
			script.setAttribute("id", srcAsync);
			function _onload() {
				console.log('loadScript.async.onload() ' + srcAsync);
				if (options.onload !== undefined) {
					next();
				}
			}
			if (script.readyState && !script.onload) {
				script.onreadystatechange = function () {
					if (script.readyState == "complete") {
						if (options.onload !== undefined) options.onload();
					}
					if (script.readyState == "loaded") {
						setTimeout(options.onload, 0);
						this.onreadystatechange = null;
					}
				};
			} else {
				script.onload = _onload;
				script.onerror = function (e) {
					var str = 'loadScript: "' + this.src + '" failed';
					if (options.onerror !== undefined) options.onerror(str, e);
					console.error(str);
				};
			}
			script.src = srcAsync;
		}, options);
	}
	if (src instanceof Array) {
		isrc = 0;
		async$$1(src[isrc]);
	} else async$$1(src);
}
function loadScriptBase(callback, options) {
	options.tag = options.tag || {};
	if (typeof options.tag === "string") {
		switch (options.tag) {
			case 'style':
				options.tag = {
					name: 'style',
					attribute: {
						name: 'rel',
						value: 'stylesheet'
					}
				};
				break;
			default:
				console.error('Invalid options.tag: ' + options.tag);
				return;
		}
	}
	options.tag.name = options.tag.name || 'script';
	var script = document.createElement(options.tag.name);
	options.tag.attribute = options.tag.attribute || {};
	options.tag.attribute.name = options.tag.attribute.name || "type";
	options.tag.attribute.value = options.tag.attribute.value || 'text/javascript';
	script.setAttribute(options.tag.attribute.name, options.tag.attribute.value);
	callback(script);
	options.appendTo.appendChild(script);
}
function isScriptExists(elParent, srcAsync, onload) {
	var scripts = elParent.querySelectorAll('script');
	for (var i = 0; i < scripts.length; i++) {
		var child = scripts[i];
		if (child.id === srcAsync) {
			return true;
		}
	}
	return false;
}

var loadScript = {
  sync: sync$1,
  async: async$1
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
var optionsStyle = {
	tag: 'style'
};var getCurrentScript = function getCurrentScript() {
	if (document.currentScript && document.currentScript.src !== '') return document.currentScript.src;
	var scripts = document.getElementsByTagName('script'),
	    str = scripts[scripts.length - 1].src;
	if (str !== '') return src;
	return new Error().stack.match(/(https?:[^:]*)/)[0];
};
var getCurrentScriptPath = function getCurrentScriptPath() {
	var script = getCurrentScript(),
	    path = script.substring(0, script.lastIndexOf('/'));
	return path;
};
var currentScriptPath = getCurrentScriptPath();
loadScript.sync(currentScriptPath + '/colorpicker.css', optionsStyle);
var type = window.SVGAngle || document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1") ? "SVG" : "VML";
var svgNS = 'http://www.w3.org/2000/svg';
var uniqID = 0;
var ColorPicker =
function ColorPicker() {
	classCallCheck(this, ColorPicker);
	var _this = this;
	this.paletteIndexes = {
		BGYW: 0,
		monochrome: 1,
		bidirectional: 2,
		rainbow: 3
	};
	function CreateSVGElement(el, attrs, children) {
		el = document.createElementNS(svgNS, el);
		for (var key in attrs) {
			el.setAttribute(key, attrs[key]);
		}if (Object.prototype.toString.call(children) != '[object Array]') children = [children];
		var i = 0,
		    len = children[0] && children.length || 0;
		for (; i < len; i++) {
			el.appendChild(children[i]);
		}return el;
	}
	this.create = function (elSliderWrapper, options) {
		options = options || {};
		options.orientation = options.orientation || 'horizontal';
		function isHorizontal() {
			return options.orientation === "horizontal";
		}
		if (options.direction === undefined) options.direction = true;
		options.style = options.style || {};
		options.style.width = options.style.width || (isHorizontal() ? 200 : 30);
		options.style.height = options.style.height || (isHorizontal() ? 30 : 200);
		options.onError = options.onError || function () {};
		if (elSliderWrapper instanceof HTMLElement !== true) {
			if (typeof elSliderWrapper !== "string") {
				console.error('ColorPicker.create: invalid elSliderWrapper = ' + elSliderWrapper);
				return;
			}
			elSliderWrapper = document.getElementById(elSliderWrapper);
			if (elSliderWrapper === null) {
				console.error('ColorPicker.create: invalid elSliderWrapper = ' + elSliderWrapper);
				return;
			}
		}
		elSliderWrapper.classList.add('slider-wrapper');
		for (var style in options.style) {
			elSliderWrapper.style[style] = options.style[style];
		}
		var palette = options.palette instanceof this.palette ? options.palette : new this.palette(options);
		var slide;
		function getSlideHeight() {
			if (typeof options.style.height === "string") return parseInt(options.style.height);
			return options.style.height;
		}
		function getSlideWidth() {
			return slide.clientWidth;
		}
		function setValue(value, position) {
			if (slideIndicator === undefined) {
				console.error('Set value of this instance of the ColorPicker is impossible because options.sliderIndicator is not defined.');
				return;
			}
			var c = palette.hsv2rgb(value);
			if (c === undefined) {
				console.error('ColorPicker.setValue: invalud c = ' + c);
				return;
			}
			value = c.percent;
			if (position === undefined) position = isHorizontal() ? getSlideWidth() * value / 100 : getSlideHeight() - getSlideHeight() * (options.direction ? value : 100 - value) / 100;
			positionIndicators(position);
			if (options.sliderIndicator.callback !== undefined) {
				options.sliderIndicator.callback(c);
			}
		}
		var slideIndicator;
		if (options.sliderIndicator !== undefined) {
			slideIndicator = document.createElement('div');
			slideIndicator.className = 'slider-indicator';
			if (isHorizontal()) slideIndicator.style.width = '10px';else slideIndicator.style.height = '10px';
			elSliderWrapper.appendChild(slideIndicator);
			slideIndicator.style.pointerEvents = 'none';
		}
		function positionIndicators(position) {
			if (slideIndicator === undefined) return;
			if (isHorizontal()) {
				if (position < 0 || position > getSlideWidth()) {
					console.error('ColorPicker.positionIndicators: Invalid position = ' + position);
					return;
				}
				slideIndicator.style.top = '0px';
				slideIndicator.style.left = (options.direction ? position : getSlideWidth() - position) - slideIndicator.offsetWidth / 2 + 'px';
			} else {
				if (position < 0 || position > getSlideHeight()) {
					console.error('ColorPicker.positionIndicators: Invalid position = ' + position);
					return;
				}
				slideIndicator.style.left = '0px';
				slideIndicator.style.top = position - slideIndicator.offsetHeight / 2 + 'px';
			}
		}
		if (type == 'SVG') {
			try {
				var linearGradient = 'linearGradient';
				slide = CreateSVGElement('svg', {
					xmlns: svgNS,
					version: '1.1',
					width: isHorizontal() ? '100%' : options.style.width,
					height: options.style.height
				}, [CreateSVGElement('defs', {}, CreateSVGElement(linearGradient, {
					id: 'gradient-hsv-' + uniqID,
					x1: isHorizontal() && options.direction ? '100%' : '0%',
					y1: !isHorizontal() && !options.direction ? '100%' : '0%',
					x2: isHorizontal() && !options.direction ? '100%' : '0%',
					y2: !isHorizontal() && options.direction ? '100%' : '0%'
				}, palette.getPalette())), CreateSVGElement('rect', { x: '0', y: '0', width: '100%', height: '100%', fill: 'url(#gradient-hsv-' + uniqID + ')' })]);
				if (slideIndicator !== undefined) {
					slide.style.cursor = isHorizontal() ? 'e-resize' : 's-resize';
					slideIndicator.style.cursor = slide.style.cursor;
				}
			} catch (e) {
				console.error('Create SVG element failed! ' + e.message);
			}
			elSliderWrapper.appendChild(slide);
			elSliderWrapper.style.height = getSlideHeight() + 'px';
			if (slideIndicator !== undefined) {
				if (isHorizontal()) slideIndicator.style.height = parseInt(options.style.height) - 2 + 'px';else slideIndicator.style.width = parseInt(options.style.width) - 2 + 'px';
				options.sliderIndicator.value = options.sliderIndicator.value || 0;
				setValue(options.sliderIndicator.value);
			}
			uniqID++;
		} else {
			console.error('Under constraction');
		}
		function mouseMove(mouse) {
			mouse.x = parseInt(mouse.x);
			mouse.y = parseInt(mouse.y);
			var position, size, value;
			if (isHorizontal()) {
				position = mouse.x;
				size = getSlideWidth() - 1;
				if (position >= getSlideWidth()) position = size;
				value = position * 100 / size;
				if (!options.direction) {
					value = 100 - value;
					position = size - position;
				}
			} else {
				position = mouse.y;
				size = getSlideHeight() - 1;
				if (position >= getSlideHeight()) position = size;
				value = (1 - position / size) * 100;
				if (!options.direction) {
					value = 100 - value;
				}
			}
			setValue(value, position);
		}
		if (slideIndicator !== undefined) {
			var slideListener = function slideListener() {
				return function (evt) {
					if (mouseout) return;
					evt = evt || window.event;
					function mousePosition(evt) {
						if (window.event && window.event.contentOverflow !== undefined) {
							return { x: window.event.offsetX, y: window.event.offsetY };
						}
						if (evt.offsetX !== undefined && evt.offsetY !== undefined) {
							return { x: evt.offsetX, y: evt.offsetY };
						}
						var wrapper = evt.target.parentNode.parentNode;
						return { x: evt.layerX - wrapper.offsetLeft, y: evt.layerY - wrapper.offsetTop };
					}
					mouseMove(mousePosition(evt));
				};
			};
			var addEventListener = function addEventListener(element, event, listener) {
				if (element === null) return;
				if (element.attachEvent) {
					element.attachEvent('on' + event, listener);
				} else if (element.addEventListener) {
					element.addEventListener(event, listener, false);
				}
			};
			var enableDragging = function enableDragging(ctx, listener) {
				var element = slide;
				addEventListener(element, 'touchstart', function (evt) {});
				addEventListener(element, 'touchmove', function (evt) {
					evt.preventDefault();
					var rect = evt.srcElement.getBoundingClientRect(),
					    x = evt.touches[0].clientX - rect.left,
					    y = evt.touches[0].clientY - rect.top;
					if (x < 0) x = 0;
					if (y < 0) y = 0;
					mouseMove({ x: x, y: y });
				});
				addEventListener(element, 'touchend', function (evt) {});
				addEventListener(element, 'mousedown', function (evt) {
					var mouseup = 'mouseup',
					    mousemove = 'mousemove';
					function onMouseUp() {
						function removeEventListener(element, event, listener) {
							if (element === null) return;
							if (element.detachEvent) {
								element.detachEvent('on' + event, listener);
							} else if (element.removeEventListener) {
								element.removeEventListener(event, listener, false);
							}
						}
						removeEventListener(window, mouseup, onMouseUp);
						removeEventListener(window, mousemove, listener);
					}
					addEventListener(window, mouseup, onMouseUp);
					addEventListener(window, mousemove, listener);
				});
				addEventListener(element, 'mouseout', function (evt) {
					mouseout = true;
				});
				addEventListener(element, 'mouseover', function (evt) {
					mouseout = false;
				});
			};
			var mouseout = false;
			addEventListener(slide, 'click', slideListener());
			enableDragging(this, slideListener());
		}
		return {
			setValue: setValue
		};
	};
	this.palette = function (options) {
		function paletteitem(percent, r, g, b) {
			return {
				percent: percent,
				r: r,
				g: g,
				b: b
			};
		}
		options = options || {};
		if (options.palette === undefined) options.palette = _this.paletteIndexes.BGYW;
		this.getPaletteIndex = function () {
			return options.palette;
		};
		var arrayPalette = [new paletteitem(0, 0x00, 0x00, 0xFF),
		new paletteitem(33, 0x00, 0xFF, 0x00),
		new paletteitem(66, 0xFF, 0xFF, 0x00),
		new paletteitem(100, 0xFF, 0xFF, 0xFF)];
		switch (_typeof(options.palette)) {
			case 'number':
				switch (options.palette) {
					case _this.paletteIndexes.BGYW:
						break;
					case _this.paletteIndexes.monochrome:
						var arrayPalette = [new paletteitem(0, 0x00, 0x00, 0x00),
						new paletteitem(100, 0xFF, 0xFF, 0xFF)];
						break;
					case _this.paletteIndexes.bidirectional:
						var arrayPalette = [new paletteitem(0, 0xff, 0x30, 0x30),
						new paletteitem(50, 0x30, 0x30, 0x30),
						new paletteitem(100, 0x30, 0xFF, 0x30)];
						break;
					case _this.paletteIndexes.rainbow:
						var arrayPalette = [new paletteitem(0, 0xff, 0x32, 0x32), new paletteitem(16, 0xfc, 0xf5, 0x28), new paletteitem(32, 0x28, 0xfc, 0x28), new paletteitem(50, 0x28, 0xfc, 0xf8), new paletteitem(66, 0x27, 0x2e, 0xf9), new paletteitem(82, 0xff, 0x28, 0xfb), new paletteitem(100, 0xff, 0x32, 0x32)];
						break;
					default:
						console.error('ColorPicker.create.Palette: invalid options.palette = ' + options.palette);
				}
				break;
			case "object":
				if (Array.isArray(options.palette)) {
					arrayPalette = options.palette;
					break;
				}
			default:
				var message = 'invalid options.palette = ' + options.palette;
				console.error('ColorPicker.create.Palette: ' + message);
				options.onError(message);
		}
		this.isPalette = function () {
			return true;
		};
		this.getPalette = function () {
			var palette = [];
			arrayPalette.forEach(function (item) {
				palette.unshift(CreateSVGElement('stop', {
					offset: 100 - item.percent + '%', 'stop-color': '#'
					+ ("0" + Number(item.r).toString(16)).slice(-2).toUpperCase() + ("0" + Number(item.g).toString(16)).slice(-2).toUpperCase() + ("0" + Number(item.b).toString(16)).slice(-2).toUpperCase(),
					'stop-opacity': '1'
				}));
			});
			return palette;
		};
		this.hsv2rgb = function (stringPercent, min, max) {
			var percent = parseFloat(stringPercent);
			if (isNaN(percent)) {
				percent = max;
			}
			if (min !== undefined && max !== undefined) percent = 100 / (max - min) * (percent - min);
			var lastPalette = arrayPalette[arrayPalette.length - 1];
			if (lastPalette.percent !== 100) {
				var lastItem = {};
				Object.keys(lastPalette).forEach(function (key) {
					lastItem[key] = lastPalette[key];
				});
				lastItem.percent = 100;
				arrayPalette.push(lastItem);
			}
			var itemPrev;
			for (var i = 0; i < arrayPalette.length; i++) {
				var item = arrayPalette[i];
				if (itemPrev === undefined) itemPrev = item;
				if (percent >= itemPrev.percent && percent <= item.percent) {
					var color = function color(percentPrev, prev, percentItem, item) {
						var percentD = percentItem - percentPrev;
						if (percentD === 0) return prev;
						return Math.round(prev + (item - prev) / percentD * (percent - percentPrev));
					};
					var r = color(itemPrev.percent, itemPrev.r, item.percent, item.r),
					    g = color(itemPrev.percent, itemPrev.g, item.percent, item.g),
					    b = color(itemPrev.percent, itemPrev.b, item.percent, item.b);
					return {
						r: r,
						g: g,
						b: b,
						hex: "#" + (16777216 | b | g << 8 | r << 16).toString(16).slice(1),
						percent: percent
					};
				}
				itemPrev = item;
			}
			if (options.onError !== undefined) options.onError('Invalid color value of the ColorPicker: ' + stringPercent);
		};
		this.toColor = function (value, min, max) {
			var THREE = three$1.THREE;
			if (value instanceof THREE.Color) return value;
			var c = this.hsv2rgb(value, min, max);
			if (c === undefined) c = { r: 255, g: 255, b: 255 };
			return new THREE.Color("rgb(" + c.r + ", " + c.g + ", " + c.b + ")");
		};
	};
};
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
function isEnabled() {
	return navigator.cookieEnabled;
}
function set$1(name, value, cookie_date) {
	if (!isEnabled()) {
		consoleCookieEnabled();
		return;
	}
	value = value.toString();
	if (cookie_date === undefined) {
		cookie_date = new Date();
		cookie_date.setTime(cookie_date.getTime() + 1000 * 60 * 60 * 24 * 365);
	}
	document.cookie = name + "=" + value + (typeof settings == 'undefined' ? '' : settings) + "; expires=" + cookie_date.toGMTString();
	if (document.cookie === '') console.error('document.cookie is empty');
}
function setObject(name, object) {
	set$1(name, JSON.stringify(object));
}
function get$1(name, defaultValue) {
	if (!isEnabled()) {
		consoleCookieEnabled();
		return;
	}
	var results = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
	if (results) {
		var result = results[2],
		    type = typeof defaultValue === 'undefined' ? 'undefined' : _typeof(defaultValue);
		return type === "number" ?
		result % 1 === 0 ? parseInt(result) : parseFloat(result) : type === "boolean" ?
		result === 'true' ? true : false : unescape(result);
	}
	if (typeof defaultValue == 'undefined') return '';
	return defaultValue;
}
function getObject(name, options, optionsDefault) {
	if (optionsDefault === undefined) optionsDefault = options;
	new defaultCookie().getObject(name, options, copyObject(name, optionsDefault));
}
function copyObject(name, objectDefault) {
	return JSON.parse(get$1(name, JSON.stringify(objectDefault)));
}
function remove(name) {
	if (!isEnabled()) {
		consoleCookieEnabled();
		return;
	}
	var cookie_date = new Date();
	cookie_date.setTime(cookie_date.getTime() - 1);
	document.cookie = name += "=; expires=" + cookie_date.toGMTString();
}
function consoleCookieEnabled() {
	console.error('navigator.cookieEnabled = ' + navigator.cookieEnabled);
}
var defaultCookie = function defaultCookie(name) {
	classCallCheck(this, defaultCookie);
	this.get = function (defaultValue) {
		return defaultValue;
	};
	this.set = function () {};
	this.getObject = function (name, options, optionsDefault) {
		if (!optionsDefault) return;
		Object.keys(optionsDefault).forEach(function (key) {
			var option = optionsDefault[key];
			if (option !== undefined && typeof option !== 'function') options[key] = JSON.parse(JSON.stringify(option));
		});
	};
	this.copyObject = function (name, objectDefault) {
		return JSON.parse(JSON.stringify(objectDefault));
	};
	this.setObject = function () {};
	this.isTrue = function (defaultValue) {
		return defaultValue;
	};
};



var cookie = Object.freeze({
	isEnabled: isEnabled,
	set: set$1,
	setObject: setObject,
	get: get$1,
	getObject: getObject,
	copyObject: copyObject,
	remove: remove,
	defaultCookie: defaultCookie
});

/**
* node.js version of the cookie.
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
function colorToString(color, forceCSSHex) {
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
  defaults: function defaults$$1(target) {
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
  toArray: function toArray$$1(obj) {
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
var INTERPRETATIONS = [{
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
}, {
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
}, {
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
}, {
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
var _typeof$1 = typeof Symbol === "function" && _typeof(Symbol.iterator) === "symbol" ? function (obj) {
  return typeof obj === 'undefined' ? 'undefined' : _typeof(obj);
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === 'undefined' ? 'undefined' : _typeof(obj);
};
var classCallCheck$1 = function classCallCheck$$1(instance, Constructor) {
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
var get$2 = function get$$1(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);
  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);
    if (parent === null) {
      return undefined;
    } else {
      return get$$1(parent, property, receiver);
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
var inherits$1 = function inherits$$1(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === 'undefined' ? 'undefined' : _typeof(superClass)));
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
var possibleConstructorReturn$1 = function possibleConstructorReturn$$1(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return call && ((typeof call === 'undefined' ? 'undefined' : _typeof(call)) === "object" || typeof call === "function") ? call : self;
};
var Color = function () {
  function Color() {
    classCallCheck$1(this, Color);
    this.__state = interpret.apply(this, arguments);
    if (this.__state === false) {
      throw new Error('Failed to interpret color arguments');
    }
    this.__state.a = this.__state.a || 1;
  }
  createClass$1(Color, [{
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
          evt.initMouseEvent(eventType, params.bubbles || false, params.cancelable || true, window, params.clickCount || 1, 0, 0, clientX, clientY, false, false, false, false, 0, null);
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
    dom.bind(_this2.__checkbox, 'change', onChange, false);
    _this2.domElement.appendChild(_this2.__checkbox);
    _this2.updateDisplay();
    return _this2;
  }
  createClass$1(BooleanController, [{
    key: 'setValue',
    value: function setValue(v) {
      var toReturn = get$2(BooleanController.prototype.__proto__ || Object.getPrototypeOf(BooleanController.prototype), 'setValue', this).call(this, v);
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
      return get$2(BooleanController.prototype.__proto__ || Object.getPrototypeOf(BooleanController.prototype), 'updateDisplay', this).call(this);
    }
  }]);
  return BooleanController;
}(Controller);
var OptionController = function (_Controller) {
  inherits$1(OptionController, _Controller);
  function OptionController(object, property, opts) {
    classCallCheck$1(this, OptionController);
    var _this2 = possibleConstructorReturn$1(this, (OptionController.__proto__ || Object.getPrototypeOf(OptionController)).call(this, object, property));
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
  createClass$1(OptionController, [{
    key: 'setValue',
    value: function setValue(v) {
      var toReturn = get$2(OptionController.prototype.__proto__ || Object.getPrototypeOf(OptionController.prototype), 'setValue', this).call(this, v);
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
      return get$2(OptionController.prototype.__proto__ || Object.getPrototypeOf(OptionController.prototype), 'updateDisplay', this).call(this);
    }
  }]);
  return OptionController;
}(Controller);
var StringController = function (_Controller) {
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
  createClass$1(StringController, [{
    key: 'updateDisplay',
    value: function updateDisplay() {
      if (!dom.isActive(this.__input)) {
        this.__input.value = this.getValue();
      }
      return get$2(StringController.prototype.__proto__ || Object.getPrototypeOf(StringController.prototype), 'updateDisplay', this).call(this);
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
  inherits$1(NumberController, _Controller);
  function NumberController(object, property, params) {
    classCallCheck$1(this, NumberController);
    var _this = possibleConstructorReturn$1(this, (NumberController.__proto__ || Object.getPrototypeOf(NumberController)).call(this, object, property));
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
      return get$2(NumberController.prototype.__proto__ || Object.getPrototypeOf(NumberController.prototype), 'setValue', this).call(this, _v);
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
  inherits$1(NumberControllerBox, _NumberController);
  function NumberControllerBox(object, property, params) {
    classCallCheck$1(this, NumberControllerBox);
    var _this2 = possibleConstructorReturn$1(this, (NumberControllerBox.__proto__ || Object.getPrototypeOf(NumberControllerBox)).call(this, object, property, params));
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
  createClass$1(NumberControllerBox, [{
    key: 'updateDisplay',
    value: function updateDisplay() {
      this.__input.value = this.__truncationSuspended ? this.getValue() : roundToDecimal(this.getValue(), this.__precision);
      return get$2(NumberControllerBox.prototype.__proto__ || Object.getPrototypeOf(NumberControllerBox.prototype), 'updateDisplay', this).call(this);
    }
  }]);
  return NumberControllerBox;
}(NumberController);
function map(v, i1, i2, o1, o2) {
  return o1 + (o2 - o1) * ((v - i1) / (i2 - i1));
}
var NumberControllerSlider = function (_NumberController) {
  inherits$1(NumberControllerSlider, _NumberController);
  function NumberControllerSlider(object, property, min, max, step, newBool) {
    classCallCheck$1(this, NumberControllerSlider);
    var _this2 = possibleConstructorReturn$1(this, (NumberControllerSlider.__proto__ || Object.getPrototypeOf(NumberControllerSlider)).call(this, object, property, { min: min, max: max, step: step }));
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
  createClass$1(NumberControllerSlider, [{
    key: 'updateDisplay',
    value: function updateDisplay() {
      var pct = (this.getValue() - this.__min) / (this.__max - this.__min);
      this.__foreground.style.width = pct * 100 + '%';
      return get$2(NumberControllerSlider.prototype.__proto__ || Object.getPrototypeOf(NumberControllerSlider.prototype), 'updateDisplay', this).call(this);
    }
  }]);
  return NumberControllerSlider;
}(NumberController);
var FunctionController = function (_Controller) {
  inherits$1(FunctionController, _Controller);
  function FunctionController(object, property, text) {
    classCallCheck$1(this, FunctionController);
    var _this2 = possibleConstructorReturn$1(this, (FunctionController.__proto__ || Object.getPrototypeOf(FunctionController)).call(this, object, property));
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
}(Controller);
var ColorController = function (_Controller) {
  inherits$1(ColorController, _Controller);
  function ColorController(object, property) {
    classCallCheck$1(this, ColorController);
    var _this2 = possibleConstructorReturn$1(this, (ColorController.__proto__ || Object.getPrototypeOf(ColorController)).call(this, object, property));
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
    dom.bind(_this2.__selector, 'mousedown', function () {
      dom.addClass(this, 'drag').bind(window, 'mouseup', function () {
        dom.removeClass(_this.__selector, 'drag');
      });
    });
    dom.bind(_this2.__selector, 'touchstart', function () {
      dom.addClass(this, 'drag').bind(window, 'touchend', function () {
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
  createClass$1(ColorController, [{
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
    } catch (e) {}
  }
};
var saveDialogContents = "<div id=\"dg-save\" class=\"dg dialogue\">\n\n  Here's the new load parameter for your <code>GUI</code>'s constructor:\n\n  <textarea id=\"dg-new-constructor\"></textarea>\n\n  <div id=\"dg-save-locally\">\n\n    <input id=\"dg-local-storage\" type=\"checkbox\"/> Automatically save\n    values to <code>localStorage</code> on exit.\n\n    <div id=\"dg-local-explain\">The values saved to <code>localStorage</code> will\n      override those passed to <code>dat.GUI</code>'s constructor. This makes it\n      easier to work incrementally, but <code>localStorage</code> is fragile,\n      and your friends may not see the same values you do.\n\n    </div>\n\n  </div>\n\n</div>";
function requestAnimationFrame(callback) {
  setTimeout(callback, 1000 / 60);
}
var requestAnimationFrame$1 = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || requestAnimationFrame;
var CenteredDiv = function () {
  function CenteredDiv() {
    classCallCheck$1(this, CenteredDiv);
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
  createClass$1(CenteredDiv, [{
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
  Object.defineProperties(this, {
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
Common.extend(GUI.prototype, {
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
    if (this.load && this.load.folders && this.load.folders[name]) {
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
    if (this.load && this.load.folders && this.load.folders[folder.name]) {
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
  Common.extend(controller, {
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
  if (customObject !== undefined && _typeof$1(customObject.property) === "object") {
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
    dom.addClass(li, _typeof$1(controller.getValue()));
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
	addButton: function addButton(innerHTML, options) {
		options = options || {};
		var button = document.createElement('span');
		button.innerHTML = innerHTML;
		if (options.title !== undefined) button.title = options.title;
		if (options.onclick !== undefined) {
			button.style.cursor = 'pointer';
			button.onclick = options.onclick;
		}
		if (options.onwheel !== undefined) {
			var onWheel = function onWheel(e) {
				e = e || window.event;
				var delta = e.deltaY || e.detail || e.wheelDelta;
				options.onwheel(delta);
			};
			button.style.cursor = 'n-resize';
			if (button.addEventListener) {
				if ('onwheel' in document) {
					button.addEventListener("wheel", onWheel, {
						passive: true
					});
				} else if ('onmousewheel' in document) {
					button.addEventListener("mousewheel", onWheel);
				} else {
					button.addEventListener("MozMousePixelScroll", onWheel);
				}
			} else {
				button.attachEvent("onmousewheel", onWheel);
			}
		}
		button.style.margin = '0px 2px';
		return button;
	}
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
var ScaleController = function (_controllers$CustomCo) {
	inherits(ScaleController, _controllers$CustomCo);
	function ScaleController(_onclick, options) {
		classCallCheck(this, ScaleController);
		options = options || {};
		options.settings = options.settings || {};
		options.settings.zoomMultiplier = options.settings.zoomMultiplier || 1.1;
		var _this = possibleConstructorReturn(this, (ScaleController.__proto__ || Object.getPrototypeOf(ScaleController)).call(this, {
			multiplier: options.settings.zoomMultiplier,
			property: function property(customController) {
				var lang = {
					zoom: 'Zoom',
					in: 'in',
					out: 'out',
					wheelZoom: 'Scroll the mouse wheel to zoom'
				};
				var _languageCode = options.getLanguageCode === undefined ? 'en'
				: options.getLanguageCode();
				switch (_languageCode) {
					case 'ru':
						lang.zoom = 'Изменить';
						lang.in = 'увеличить';
						lang.out = 'уменьшить';
						lang.wheelZoom = 'Прокрутите колесико мыши для изменения масштаба';
						break;
					default:
						if (options.lang === undefined || options.lang.languageCode != _languageCode) break;
						Object.keys(options.lang).forEach(function (key) {
							if (lang[key] === undefined) return;
							lang[key] = options.lang[key];
						});
				}
				var buttons = {},
				    addButton = UpDownController.addButton;
				buttons.zoomLabel = addButton(lang.zoom, {
					title: lang.wheelZoom,
					onwheel: function onwheel(delta) {
						_onclick(customController, function (value, zoom) {
							if (delta > 0) value *= zoom;else value /= zoom;
							return value;
						});
					}
				});
				buttons.in = addButton('↑', {
					title: lang.in,
					onclick: function onclick() {
						_onclick(customController, function (value, zoom) {
							value *= zoom;
							return value;
						});
					}
				});
				buttons.out = addButton('↓', {
					title: lang.out,
					onclick: function onclick() {
						_onclick(customController, function (value, zoom) {
							value /= zoom;
							return value;
						});
					}
				});
				return buttons;
			}
		}, 'multiplier', 1.1, 10, 0.1, options.newBool));
		if (_this.property === undefined) console.error('init() returns ' + _this.property);
		return _this;
	}
	return ScaleController;
}(controllers.CustomController);

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
var PositionController = function (_controllers$CustomCo) {
				inherits(PositionController, _controllers$CustomCo);
				function PositionController(onclickController, options) {
								classCallCheck(this, PositionController);
								options = options || {};
								options.settings = options.settings || {};
								var settings = options.settings;
								if (options.min === undefined) options.min = 0.1;
								if (options.max === undefined) options.max = 10;
								if (settings.offset === undefined) settings.offset = 0.1;
								if (options.step === undefined) options.step = 0.1;
								var _this = possibleConstructorReturn(this, (PositionController.__proto__ || Object.getPrototypeOf(PositionController)).call(this, {
												offset: settings.offset,
												property: function property(customController) {
																var lang = {
																				offset: 'Offset',
																				add: 'add',
																				subtract: 'subtract',
																				wheelPosition: 'Scroll the mouse wheel to change the position'
																};
																var _languageCode = options.getLanguageCode === undefined ? 'en'
																: options.getLanguageCode();
																switch (_languageCode) {
																				case 'ru':
																								lang.offset = 'Сдвиг';
																								lang.add = 'добавить';
																								lang.subtract = 'вычесть';
																								lang.wheelPosition = 'Прокрутите колесико мыши для изменения позиции';
																								break;
																				default:
																								if (options.lang === undefined || options.lang.languageCode != _languageCode) break;
																								Object.keys(options.lang).forEach(function (key) {
																												if (lang[key] === undefined) return;
																												lang[key] = options.lang[key];
																								});
																}
																var buttons = {},
																    addButton = UpDownController.addButton;
																buttons.Label = addButton(lang.offset, {
																				title: lang.wheelPosition,
																				onwheel: function onwheel(delta) {
																								var shift = customController.controller.getValue();
																								onclickController(delta > 0 ? shift : -shift);
																				}
																});
																buttons.in = addButton('↑', {
																				title: lang.add,
																				onclick: function onclick() {
																								onclickController(customController.controller.getValue());
																				}
																});
																buttons.out = addButton('↓', {
																				title: lang.subtract,
																				onclick: function onclick() {
																								onclickController(-customController.controller.getValue());
																				}
																});
																return buttons;
												}
								}, 'offset', options.min, options.max, options.step));
								if (_this.property === undefined) console.error('init() returns ' + _this.property);
								return _this;
				}
				return PositionController;
}(controllers.CustomController);

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
function colorToString$1(color, forceCSSHex) {
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
  defaults: function defaults$$1(target) {
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
  toArray: function toArray$$1(obj) {
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
var INTERPRETATIONS$1 = [{
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
}, {
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
}, {
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
}, {
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
var _typeof$2 = typeof Symbol === "function" && _typeof(Symbol.iterator) === "symbol" ? function (obj) {
  return typeof obj === 'undefined' ? 'undefined' : _typeof(obj);
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === 'undefined' ? 'undefined' : _typeof(obj);
};
var classCallCheck$2 = function classCallCheck$$1(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};
var createClass$2 = function () {
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
var get$3 = function get$$1(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);
  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);
    if (parent === null) {
      return undefined;
    } else {
      return get$$1(parent, property, receiver);
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
var inherits$2 = function inherits$$1(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === 'undefined' ? 'undefined' : _typeof(superClass)));
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
var possibleConstructorReturn$2 = function possibleConstructorReturn$$1(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return call && ((typeof call === 'undefined' ? 'undefined' : _typeof(call)) === "object" || typeof call === "function") ? call : self;
};
var Color$1 = function () {
  function Color() {
    classCallCheck$2(this, Color);
    this.__state = interpret$1.apply(this, arguments);
    if (this.__state === false) {
      throw new Error('Failed to interpret color arguments');
    }
    this.__state.a = this.__state.a || 1;
  }
  createClass$2(Color, [{
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
    classCallCheck$2(this, Controller);
    this.initialValue = object[property];
    this.domElement = document.createElement('div');
    this.object = object;
    this.property = property;
    this.__onChange = undefined;
    this.__onFinishChange = undefined;
  }
  createClass$2(Controller, [{
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
var dom$1$1 = {
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
          evt.initMouseEvent(eventType, params.bubbles || false, params.cancelable || true, window, params.clickCount || 1, 0, 0, clientX, clientY, false, false, false, false, 0, null);
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
    return dom$1$1;
  },
  unbind: function unbind(elem, event, func, newBool) {
    var bool = newBool || false;
    if (elem.removeEventListener) {
      elem.removeEventListener(event, func, bool);
    } else if (elem.detachEvent) {
      elem.detachEvent('on' + event, func);
    }
    return dom$1$1;
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
    return dom$1$1;
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
    return dom$1$1;
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
  inherits$2(BooleanController, _Controller);
  function BooleanController(object, property) {
    classCallCheck$2(this, BooleanController);
    var _this2 = possibleConstructorReturn$2(this, (BooleanController.__proto__ || Object.getPrototypeOf(BooleanController)).call(this, object, property));
    var _this = _this2;
    _this2.__prev = _this2.getValue();
    _this2.__checkbox = document.createElement('input');
    _this2.__checkbox.setAttribute('type', 'checkbox');
    function onChange() {
      _this.setValue(!_this.__prev);
    }
    dom$1$1.bind(_this2.__checkbox, 'change', onChange, false);
    _this2.domElement.appendChild(_this2.__checkbox);
    _this2.updateDisplay();
    return _this2;
  }
  createClass$2(BooleanController, [{
    key: 'setValue',
    value: function setValue(v) {
      var toReturn = get$3(BooleanController.prototype.__proto__ || Object.getPrototypeOf(BooleanController.prototype), 'setValue', this).call(this, v);
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
      return get$3(BooleanController.prototype.__proto__ || Object.getPrototypeOf(BooleanController.prototype), 'updateDisplay', this).call(this);
    }
  }]);
  return BooleanController;
}(Controller$1);
var OptionController$1 = function (_Controller) {
  inherits$2(OptionController, _Controller);
  function OptionController(object, property, opts) {
    classCallCheck$2(this, OptionController);
    var _this2 = possibleConstructorReturn$2(this, (OptionController.__proto__ || Object.getPrototypeOf(OptionController)).call(this, object, property));
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
    dom$1$1.bind(_this2.__select, 'change', function () {
      var desiredValue = this.options[this.selectedIndex].value;
      _this.setValue(desiredValue);
    });
    _this2.domElement.appendChild(_this2.__select);
    return _this2;
  }
  createClass$2(OptionController, [{
    key: 'setValue',
    value: function setValue(v) {
      var toReturn = get$3(OptionController.prototype.__proto__ || Object.getPrototypeOf(OptionController.prototype), 'setValue', this).call(this, v);
      if (this.__onFinishChange) {
        this.__onFinishChange.call(this, this.getValue());
      }
      return toReturn;
    }
  }, {
    key: 'updateDisplay',
    value: function updateDisplay() {
      if (dom$1$1.isActive(this.__select)) return this;
      this.__select.value = this.getValue();
      return get$3(OptionController.prototype.__proto__ || Object.getPrototypeOf(OptionController.prototype), 'updateDisplay', this).call(this);
    }
  }]);
  return OptionController;
}(Controller$1);
var StringController$1 = function (_Controller) {
  inherits$2(StringController, _Controller);
  function StringController(object, property) {
    classCallCheck$2(this, StringController);
    var _this2 = possibleConstructorReturn$2(this, (StringController.__proto__ || Object.getPrototypeOf(StringController)).call(this, object, property));
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
    dom$1$1.bind(_this2.__input, 'keyup', onChange);
    dom$1$1.bind(_this2.__input, 'change', onChange);
    dom$1$1.bind(_this2.__input, 'blur', onBlur);
    dom$1$1.bind(_this2.__input, 'keydown', function (e) {
      if (e.keyCode === 13) {
        this.blur();
      }
    });
    _this2.updateDisplay();
    _this2.domElement.appendChild(_this2.__input);
    return _this2;
  }
  createClass$2(StringController, [{
    key: 'updateDisplay',
    value: function updateDisplay() {
      if (!dom$1$1.isActive(this.__input)) {
        this.__input.value = this.getValue();
      }
      return get$3(StringController.prototype.__proto__ || Object.getPrototypeOf(StringController.prototype), 'updateDisplay', this).call(this);
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
  inherits$2(NumberController, _Controller);
  function NumberController(object, property, params) {
    classCallCheck$2(this, NumberController);
    var _this = possibleConstructorReturn$2(this, (NumberController.__proto__ || Object.getPrototypeOf(NumberController)).call(this, object, property));
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
  createClass$2(NumberController, [{
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
      return get$3(NumberController.prototype.__proto__ || Object.getPrototypeOf(NumberController.prototype), 'setValue', this).call(this, _v);
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
  inherits$2(NumberControllerBox, _NumberController);
  function NumberControllerBox(object, property, params) {
    classCallCheck$2(this, NumberControllerBox);
    var _this2 = possibleConstructorReturn$2(this, (NumberControllerBox.__proto__ || Object.getPrototypeOf(NumberControllerBox)).call(this, object, property, params));
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
      dom$1$1.unbind(window, 'mousemove', onMouseDrag);
      dom$1$1.unbind(window, 'mouseup', onMouseUp);
      onFinish();
    }
    function onMouseDown(e) {
      dom$1$1.bind(window, 'mousemove', onMouseDrag);
      dom$1$1.bind(window, 'mouseup', onMouseUp);
      prevY = e.clientY;
    }
    _this2.__input = document.createElement('input');
    _this2.__input.setAttribute('type', 'text');
    dom$1$1.bind(_this2.__input, 'change', onChange);
    dom$1$1.bind(_this2.__input, 'blur', onBlur);
    dom$1$1.bind(_this2.__input, 'mousedown', onMouseDown);
    dom$1$1.bind(_this2.__input, 'keydown', function (e) {
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
  createClass$2(NumberControllerBox, [{
    key: 'updateDisplay',
    value: function updateDisplay() {
      this.__input.value = this.__truncationSuspended ? this.getValue() : roundToDecimal$1(this.getValue(), this.__precision);
      return get$3(NumberControllerBox.prototype.__proto__ || Object.getPrototypeOf(NumberControllerBox.prototype), 'updateDisplay', this).call(this);
    }
  }]);
  return NumberControllerBox;
}(NumberController$1);
function map$1(v, i1, i2, o1, o2) {
  return o1 + (o2 - o1) * ((v - i1) / (i2 - i1));
}
var NumberControllerSlider$1 = function (_NumberController) {
  inherits$2(NumberControllerSlider, _NumberController);
  function NumberControllerSlider(object, property, min, max, step, newBool) {
    classCallCheck$2(this, NumberControllerSlider);
    var _this2 = possibleConstructorReturn$2(this, (NumberControllerSlider.__proto__ || Object.getPrototypeOf(NumberControllerSlider)).call(this, object, property, { min: min, max: max, step: step }));
    var _this = _this2;
    _this2.__background = document.createElement('div');
    _this2.__foreground = document.createElement('div');
    _this2.newBool = newBool;
    dom$1$1.bind(_this2.__background, 'mousedown', onMouseDown, newBool);
    dom$1$1.bind(_this2.__background, 'touchstart', onTouchStart);
    dom$1$1.addClass(_this2.__background, 'slider');
    dom$1$1.addClass(_this2.__foreground, 'slider-fg');
    function onMouseDown(e) {
      document.activeElement.blur();
      dom$1$1.bind(window, 'mousemove', onMouseDrag);
      dom$1$1.bind(window, 'mouseup', onMouseUp);
      onMouseDrag(e);
    }
    function onMouseDrag(e) {
      if (!_this.newBool) e.preventDefault();
      var bgRect = _this.__background.getBoundingClientRect();
      _this.setValue(map$1(e.clientX, bgRect.left, bgRect.right, _this.__min, _this.__max));
      return false;
    }
    function onMouseUp() {
      dom$1$1.unbind(window, 'mousemove', onMouseDrag);
      dom$1$1.unbind(window, 'mouseup', onMouseUp);
      if (_this.__onFinishChange) {
        _this.__onFinishChange.call(_this, _this.getValue());
      }
    }
    function onTouchStart(e) {
      if (e.touches.length !== 1) {
        return;
      }
      dom$1$1.bind(window, 'touchmove', onTouchMove);
      dom$1$1.bind(window, 'touchend', onTouchEnd);
      onTouchMove(e);
    }
    function onTouchMove(e) {
      var clientX = e.touches[0].clientX;
      var bgRect = _this.__background.getBoundingClientRect();
      _this.setValue(map$1(clientX, bgRect.left, bgRect.right, _this.__min, _this.__max));
    }
    function onTouchEnd() {
      dom$1$1.unbind(window, 'touchmove', onTouchMove);
      dom$1$1.unbind(window, 'touchend', onTouchEnd);
      if (_this.__onFinishChange) {
        _this.__onFinishChange.call(_this, _this.getValue());
      }
    }
    _this2.updateDisplay();
    _this2.__background.appendChild(_this2.__foreground);
    _this2.domElement.appendChild(_this2.__background);
    return _this2;
  }
  createClass$2(NumberControllerSlider, [{
    key: 'updateDisplay',
    value: function updateDisplay() {
      var pct = (this.getValue() - this.__min) / (this.__max - this.__min);
      this.__foreground.style.width = pct * 100 + '%';
      return get$3(NumberControllerSlider.prototype.__proto__ || Object.getPrototypeOf(NumberControllerSlider.prototype), 'updateDisplay', this).call(this);
    }
  }]);
  return NumberControllerSlider;
}(NumberController$1);
var FunctionController$1 = function (_Controller) {
  inherits$2(FunctionController, _Controller);
  function FunctionController(object, property, text) {
    classCallCheck$2(this, FunctionController);
    var _this2 = possibleConstructorReturn$2(this, (FunctionController.__proto__ || Object.getPrototypeOf(FunctionController)).call(this, object, property));
    var _this = _this2;
    _this2.__button = document.createElement('div');
    _this2.__button.innerHTML = text === undefined ? 'Fire' : text;
    dom$1$1.bind(_this2.__button, 'click', function (e) {
      e.preventDefault();
      _this.fire();
      return false;
    });
    dom$1$1.addClass(_this2.__button, 'button');
    _this2.domElement.appendChild(_this2.__button);
    return _this2;
  }
  createClass$2(FunctionController, [{
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
  inherits$2(ColorController, _Controller);
  function ColorController(object, property) {
    classCallCheck$2(this, ColorController);
    var _this2 = possibleConstructorReturn$2(this, (ColorController.__proto__ || Object.getPrototypeOf(ColorController)).call(this, object, property));
    _this2.__color = new Color$1(_this2.getValue());
    _this2.__temp = new Color$1(0);
    var _this = _this2;
    _this2.domElement = document.createElement('div');
    dom$1$1.makeSelectable(_this2.domElement, false);
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
    dom$1$1.bind(_this2.__input, 'keydown', function (e) {
      if (e.keyCode === 13) {
        onBlur.call(this);
      }
    });
    dom$1$1.bind(_this2.__input, 'blur', onBlur);
    dom$1$1.bind(_this2.__selector, 'mousedown', function () {
      dom$1$1.addClass(this, 'drag').bind(window, 'mouseup', function () {
        dom$1$1.removeClass(_this.__selector, 'drag');
      });
    });
    dom$1$1.bind(_this2.__selector, 'touchstart', function () {
      dom$1$1.addClass(this, 'drag').bind(window, 'touchend', function () {
        dom$1$1.removeClass(_this.__selector, 'drag');
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
    dom$1$1.bind(_this2.__saturation_field, 'mousedown', fieldDown);
    dom$1$1.bind(_this2.__saturation_field, 'touchstart', fieldDown);
    dom$1$1.bind(_this2.__field_knob, 'mousedown', fieldDown);
    dom$1$1.bind(_this2.__field_knob, 'touchstart', fieldDown);
    dom$1$1.bind(_this2.__hue_field, 'mousedown', fieldDownH);
    dom$1$1.bind(_this2.__hue_field, 'touchstart', fieldDownH);
    function fieldDown(e) {
      setSV(e);
      dom$1$1.bind(window, 'mousemove', setSV);
      dom$1$1.bind(window, 'touchmove', setSV);
      dom$1$1.bind(window, 'mouseup', fieldUpSV);
      dom$1$1.bind(window, 'touchend', fieldUpSV);
    }
    function fieldDownH(e) {
      setH(e);
      dom$1$1.bind(window, 'mousemove', setH);
      dom$1$1.bind(window, 'touchmove', setH);
      dom$1$1.bind(window, 'mouseup', fieldUpH);
      dom$1$1.bind(window, 'touchend', fieldUpH);
    }
    function fieldUpSV() {
      dom$1$1.unbind(window, 'mousemove', setSV);
      dom$1$1.unbind(window, 'touchmove', setSV);
      dom$1$1.unbind(window, 'mouseup', fieldUpSV);
      dom$1$1.unbind(window, 'touchend', fieldUpSV);
      onFinish();
    }
    function fieldUpH() {
      dom$1$1.unbind(window, 'mousemove', setH);
      dom$1$1.unbind(window, 'touchmove', setH);
      dom$1$1.unbind(window, 'mouseup', fieldUpH);
      dom$1$1.unbind(window, 'touchend', fieldUpH);
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
  createClass$2(ColorController, [{
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
  inherits$2(CustomController, _Controller);
  function CustomController(object, property) {
    classCallCheck$2(this, CustomController);
    var _this = possibleConstructorReturn$2(this, (CustomController.__proto__ || Object.getPrototypeOf(CustomController)).call(this, object, property));
    _this.arguments = {
      object: object, property: property, opts: Array.prototype.slice.call(arguments, 2)
    };
    if (object.property) _this.property = object.property(_this);
    return _this;
  }
  createClass$2(CustomController, [{
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
    } catch (e) {}
  }
};
var saveDialogContents$1 = "<div id=\"dg-save\" class=\"dg dialogue\">\n\n  Here's the new load parameter for your <code>GUI</code>'s constructor:\n\n  <textarea id=\"dg-new-constructor\"></textarea>\n\n  <div id=\"dg-save-locally\">\n\n    <input id=\"dg-local-storage\" type=\"checkbox\"/> Automatically save\n    values to <code>localStorage</code> on exit.\n\n    <div id=\"dg-local-explain\">The values saved to <code>localStorage</code> will\n      override those passed to <code>dat.GUI</code>'s constructor. This makes it\n      easier to work incrementally, but <code>localStorage</code> is fragile,\n      and your friends may not see the same values you do.\n\n    </div>\n\n  </div>\n\n</div>";
function requestAnimationFrame$1$1(callback) {
  setTimeout(callback, 1000 / 60);
}
var requestAnimationFrame$1$2 = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || requestAnimationFrame$1$1;
var CenteredDiv$1 = function () {
  function CenteredDiv() {
    classCallCheck$2(this, CenteredDiv);
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
    dom$1$1.makeFullscreen(this.backgroundElement);
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
    dom$1$1.bind(this.backgroundElement, 'click', function () {
      _this.hide();
    });
  }
  createClass$2(CenteredDiv, [{
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
        dom$1$1.unbind(_this.domElement, 'webkitTransitionEnd', hide);
        dom$1$1.unbind(_this.domElement, 'transitionend', hide);
        dom$1$1.unbind(_this.domElement, 'oTransitionEnd', hide);
      };
      dom$1$1.bind(this.domElement, 'webkitTransitionEnd', hide);
      dom$1$1.bind(this.domElement, 'transitionend', hide);
      dom$1$1.bind(this.domElement, 'oTransitionEnd', hide);
      this.backgroundElement.style.opacity = 0;
      this.domElement.style.opacity = 0;
      this.domElement.style.webkitTransform = 'scale(1.1)';
    }
  }, {
    key: 'layout',
    value: function layout() {
      this.domElement.style.left = window.innerWidth / 2 - dom$1$1.getWidth(this.domElement) / 2 + 'px';
      this.domElement.style.top = window.innerHeight / 2 - dom$1$1.getHeight(this.domElement) / 2 + 'px';
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
var GUI$1$1 = function GUI(pars) {
  var _this = this;
  var params = pars || {};
  this.domElement = document.createElement('div');
  this.__ul = document.createElement('ul');
  this.domElement.appendChild(this.__ul);
  dom$1$1.addClass(this.domElement, CSS_NAMESPACE$1);
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
  Object.defineProperties(this, {
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
          dom$1$1.addClass(_this.__ul, GUI.CLASS_CLOSED);
        } else {
          dom$1$1.removeClass(_this.__ul, GUI.CLASS_CLOSED);
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
            dom$1$1.bind(window, 'unload', saveToLocalStorage);
          } else {
            dom$1$1.unbind(window, 'unload', saveToLocalStorage);
          }
          localStorage.setItem(getLocalStorageHash$1(_this, 'isLocal'), bool);
        }
      }
    }
  });
  if (Common$1.isUndefined(params.parent)) {
    this.closed = params.closed || false;
    dom$1$1.addClass(this.domElement, GUI.CLASS_MAIN);
    dom$1$1.makeSelectable(this.domElement, false);
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
    dom$1$1.addClass(this.__closeButton, GUI.CLASS_CLOSE_BUTTON);
    if (params.closeOnTop) {
      dom$1$1.addClass(this.__closeButton, GUI.CLASS_CLOSE_TOP);
      this.domElement.insertBefore(this.__closeButton, this.domElement.childNodes[0]);
    } else {
      dom$1$1.addClass(this.__closeButton, GUI.CLASS_CLOSE_BOTTOM);
      this.domElement.appendChild(this.__closeButton);
    }
    dom$1$1.bind(this.__closeButton, 'click', function () {
      _this.closed = !_this.closed;
    });
  } else {
    if (params.closed === undefined) {
      params.closed = true;
    }
    var titleRowName = document.createTextNode(params.name);
    dom$1$1.addClass(titleRowName, 'controller-name');
    titleRow = addRow$1(_this, titleRowName);
    var onClickTitle = function onClickTitle(e) {
      e.preventDefault();
      _this.closed = !_this.closed;
      return false;
    };
    dom$1$1.addClass(this.__ul, GUI.CLASS_CLOSED);
    dom$1$1.addClass(titleRow, 'title');
    dom$1$1.bind(titleRow, 'click', onClickTitle);
    if (!params.closed) {
      this.closed = false;
    }
  }
  if (params.autoPlace) {
    if (Common$1.isUndefined(params.parent)) {
      if (autoPlaceVirgin$1) {
        autoPlaceContainer$1 = document.createElement('div');
        dom$1$1.addClass(autoPlaceContainer$1, CSS_NAMESPACE$1);
        dom$1$1.addClass(autoPlaceContainer$1, GUI.CLASS_AUTO_PLACE_CONTAINER);
        document.body.appendChild(autoPlaceContainer$1);
        autoPlaceVirgin$1 = false;
      }
      autoPlaceContainer$1.appendChild(this.domElement);
      dom$1$1.addClass(this.domElement, GUI.CLASS_AUTO_PLACE);
    }
    if (!this.parent) {
      setWidth$1(_this, params.width);
    }
  }
  this.__resizeHandler = function () {
    _this.onResizeDebounced();
  };
  dom$1$1.bind(window, 'resize', this.__resizeHandler);
  dom$1$1.bind(this.__ul, 'webkitTransitionEnd', this.__resizeHandler);
  dom$1$1.bind(this.__ul, 'transitionend', this.__resizeHandler);
  dom$1$1.bind(this.__ul, 'oTransitionEnd', this.__resizeHandler);
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
GUI$1$1.toggleHide = function () {
  hide$1 = !hide$1;
  Common$1.each(hideableGuis$1, function (gui) {
    gui.domElement.style.display = hide$1 ? 'none' : '';
  });
};
GUI$1$1.CLASS_AUTO_PLACE = 'a';
GUI$1$1.CLASS_AUTO_PLACE_CONTAINER = 'ac';
GUI$1$1.CLASS_MAIN = 'main';
GUI$1$1.CLASS_CONTROLLER_ROW = 'cr';
GUI$1$1.CLASS_TOO_TALL = 'taller-than-window';
GUI$1$1.CLASS_CLOSED = 'closed';
GUI$1$1.CLASS_CLOSE_BUTTON = 'close-button';
GUI$1$1.CLASS_CLOSE_TOP = 'close-top';
GUI$1$1.CLASS_CLOSE_BOTTOM = 'close-bottom';
GUI$1$1.CLASS_DRAG = 'drag';
GUI$1$1.DEFAULT_WIDTH = 245;
GUI$1$1.TEXT_CLOSED = 'Close Controls';
GUI$1$1.TEXT_OPEN = 'Open Controls';
GUI$1$1._keydownHandler = function (e) {
  if (document.activeElement.type !== 'text' && (e.which === HIDE_KEY_CODE$1 || e.keyCode === HIDE_KEY_CODE$1)) {
    GUI$1$1.toggleHide();
  }
};
dom$1$1.bind(window, 'keydown', GUI$1$1._keydownHandler, false);
Common$1.extend(GUI$1$1.prototype, {
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
    dom$1$1.unbind(window, 'keydown', GUI$1$1._keydownHandler, false);
    removeListeners$1(this);
  },
  addFolder: function addFolder(name) {
    if (this.__folders[name] !== undefined) {
      throw new Error('You already have a folder in this GUI by the' + ' name "' + name + '"');
    }
    var newGuiParams = { name: name, parent: this };
    newGuiParams.autoPlace = this.autoPlace;
    if (this.load && this.load.folders && this.load.folders[name]) {
      newGuiParams.closed = this.load.folders[name].closed;
      newGuiParams.load = this.load.folders[name];
    }
    var gui = new GUI$1$1(newGuiParams);
    this.__folders[name] = gui;
    var li = addRow$1(this, gui.domElement);
    dom$1$1.addClass(li, 'folder');
    return gui;
  },
  removeFolder: function removeFolder(folder) {
    this.__ul.removeChild(folder.domElement.parentElement);
    delete this.__folders[folder.name];
    if (this.load && this.load.folders && this.load.folders[folder.name]) {
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
      var top = dom$1$1.getOffset(root.__ul).top;
      var h = 0;
      Common$1.each(root.__ul.childNodes, function (node) {
        if (!(root.autoPlace && node === root.__save_row)) {
          h += dom$1$1.getHeight(node);
        }
      });
      if (window.innerHeight - top - CLOSE_BUTTON_HEIGHT$1 < h) {
        dom$1$1.addClass(root.domElement, GUI$1$1.CLASS_TOO_TALL);
        root.__ul.style.height = window.innerHeight - top - CLOSE_BUTTON_HEIGHT$1 + 'px';
      } else {
        dom$1$1.removeClass(root.domElement, GUI$1$1.CLASS_TOO_TALL);
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
  dom$1$1.unbind(window, 'resize', gui.__resizeHandler);
  if (gui.saveToLocalStorageIfPossible) {
    dom$1$1.unbind(window, 'unload', gui.saveToLocalStorageIfPossible);
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
  Common$1.extend(controller, {
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
    dom$1$1.addClass(li, 'has-slider');
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
    dom$1$1.bind(li, 'click', function () {
      dom$1$1.fakeEvent(controller.__checkbox, 'click');
    });
    dom$1$1.bind(controller.__checkbox, 'click', function (e) {
      e.stopPropagation();
    });
  } else if (controller instanceof FunctionController$1) {
    dom$1$1.bind(li, 'click', function () {
      dom$1$1.fakeEvent(controller.__button, 'click');
    });
    dom$1$1.bind(li, 'mouseover', function () {
      dom$1$1.addClass(controller.__button, 'hover');
    });
    dom$1$1.bind(li, 'mouseout', function () {
      dom$1$1.removeClass(controller.__button, 'hover');
    });
  } else if (controller instanceof ColorController$1) {
    dom$1$1.addClass(li, 'color');
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
  dom$1$1.addClass(controller.domElement, 'c');
  var name = document.createElement('span');
  dom$1$1.addClass(name, 'property-name');
  if (customObject !== undefined && _typeof$2(customObject.property) === "object") {
    for (var propertyName in customObject.property) {
      name.appendChild(customObject.property[propertyName]);
    }
  } else name.innerHTML = controller.property;
  var container = document.createElement('div');
  container.appendChild(name);
  container.appendChild(controller.domElement);
  var li = addRow$1(gui, container, params.before);
  dom$1$1.addClass(li, GUI$1$1.CLASS_CONTROLLER_ROW);
  if (controller instanceof ColorController$1) {
    dom$1$1.addClass(li, 'color');
  } else {
    dom$1$1.addClass(li, _typeof$2(controller.getValue()));
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
  dom$1$1.addClass(gui.domElement, 'has-save');
  gui.__ul.insertBefore(div, gui.__ul.firstChild);
  dom$1$1.addClass(div, 'save-row');
  var gears = document.createElement('span');
  gears.innerHTML = '&nbsp;';
  dom$1$1.addClass(gears, 'button gears');
  var button = document.createElement('span');
  button.innerHTML = 'Save';
  dom$1$1.addClass(button, 'button');
  dom$1$1.addClass(button, 'save');
  var button2 = document.createElement('span');
  button2.innerHTML = 'New';
  dom$1$1.addClass(button2, 'button');
  dom$1$1.addClass(button2, 'save-as');
  var button3 = document.createElement('span');
  button3.innerHTML = 'Revert';
  dom$1$1.addClass(button3, 'button');
  dom$1$1.addClass(button3, 'revert');
  var select = gui.__preset_select = document.createElement('select');
  if (gui.load && gui.load.remembered) {
    Common$1.each(gui.load.remembered, function (value, key) {
      addPresetOption$1(gui, key, key === gui.preset);
    });
  } else {
    addPresetOption$1(gui, DEFAULT_DEFAULT_PRESET_NAME$1, false);
  }
  dom$1$1.bind(select, 'change', function () {
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
    dom$1$1.bind(localStorageCheckBox, 'change', function () {
      gui.useLocalStorage = !gui.useLocalStorage;
      showHideExplain$1(gui, explain);
    });
  }
  var newConstructorTextArea = document.getElementById('dg-new-constructor');
  dom$1$1.bind(newConstructorTextArea, 'keydown', function (e) {
    if (e.metaKey && (e.which === 67 || e.keyCode === 67)) {
      SAVE_DIALOGUE$1.hide();
    }
  });
  dom$1$1.bind(gears, 'click', function () {
    newConstructorTextArea.innerHTML = JSON.stringify(gui.getSaveObject(), undefined, 2);
    SAVE_DIALOGUE$1.show();
    newConstructorTextArea.focus();
    newConstructorTextArea.select();
  });
  dom$1$1.bind(button, 'click', function () {
    gui.save();
  });
  dom$1$1.bind(button2, 'click', function () {
    var presetName = prompt('Enter a new preset name.');
    if (presetName) {
      gui.saveAs(presetName);
    }
  });
  dom$1$1.bind(button3, 'click', function () {
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
    dom$1$1.removeClass(gui.__closeButton, GUI$1$1.CLASS_DRAG);
    dom$1$1.unbind(window, 'mousemove', drag);
    dom$1$1.unbind(window, 'mouseup', dragStop);
  }
  function dragStart(e) {
    e.preventDefault();
    pmouseX = e.clientX;
    dom$1$1.addClass(gui.__closeButton, GUI$1$1.CLASS_DRAG);
    dom$1$1.bind(window, 'mousemove', drag);
    dom$1$1.bind(window, 'mouseup', dragStop);
    return false;
  }
  dom$1$1.bind(gui.__resize_handle, 'mousedown', dragStart);
  dom$1$1.bind(gui.__closeButton, 'mousedown', dragStart);
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
    requestAnimationFrame$1$2.call(window, function () {
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
function getObjectLocalPosition(object, index) {
	var THREE = three$1.THREE;
	var attributesPosition = object.geometry.attributes.position,
	    position = attributesPosition.itemSize >= 4 ? new THREE.Vector4(0, 0, 0, 0) : new THREE.Vector3();
	position.fromArray(attributesPosition.array, index * attributesPosition.itemSize);
	return position;
}
function getWorldPosition(object, pos) {
	var THREE = three$1.THREE;
	var position = pos.clone();
	function getPosition(object, pos) {
		var position = new THREE.Vector3(),
		    positionAngle = new THREE.Vector3();
		position = pos.clone();
		position.multiply(object.scale);
		positionAngle.copy(position);
		positionAngle.applyEuler(object.rotation);
		position.x = positionAngle.x;
		position.y = positionAngle.y;
		position.z = positionAngle.z;
		position.add(object.position);
		return position;
	}
	do {
		position = getPosition(object, position);
		object = object.parent;
	} while (object && object.parent);
	return position;
}
function getObjectPosition(object, index) {
	if (index === -1) return undefined;
	if (index === undefined) return object.position;
	return getWorldPosition(object, getObjectLocalPosition(object, index));
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
function createController(settings, controllerId, name, options) {
	if (!settings) return;
	if (typeof settings.controller === "string") {
		var id = settings.controller;
		settings.controller = document.getElementById(settings.controller);
		if (!settings.controller) console.warn('createController: invalid settings.controller = "' + id + '"');
	}
	if (!settings.controller) {
		if (settings.controller === null) console.warn('createController: invalid settings.controller = ' + settings.controller);
		var controller = document.getElementById(controllerId);
		if (!controller) {
			controller = document.createElement(options.elementName ? options.elementName : 'input');
			document.querySelector('body').appendChild(controller);
		}
		settings.controller = controller;
	}
	function setControllerValue(value) {
		if (settings.controller.value !== undefined) settings.controller.value = value;
		else settings.controller.innerHTML = value;
	}
	if (options.value !== undefined) setControllerValue(options.value);
	if (options.onchange !== undefined && settings.controller.onchange === null) settings.controller.onchange = options.onchange;
	if (options.title !== undefined && settings.controller.title === '') settings.controller.title = options.title;
	if (settings.elSlider) {
		if (typeof settings.elSlider === "string") {
			var _id = settings.elSlider;
			settings.elSlider = document.getElementById(settings.elSlider);
			if (!settings.elSlider) console.warn('createController: invalid settings.elSlider = "' + _id + '"');
		}
		if (!settings.elSlider || settings.elSlider === true) {
			if (options.axisName) settings.elSlider = document.getElementById(options.axisName + 'Slider');
			if (!settings.elSlider) {
				settings.elSlider = document.createElement('div');
				if (settings.controller) settings.controller.parentElement.appendChild(settings.elSlider);else document.querySelector('body').appendChild(settings.elSlider);
			}
		}
		settings.boSetValue = true;
		if (!settings.colorpicker) {
			settings.colorpicker = ColorPicker$1.create(settings.elSlider, {
				duplicate: true,
				sliderIndicator: {
					callback: function callback(c) {
						if (settings.boSetValue || !settings.controller) return;
						var value = c.percent / 100;
						settings.controller.onchange({ currentTarget: { value: value } });
						settings.controller.value = value;
					},
					value: options.value * 100
				},
				style: {
					border: '1px solid black',
					width: settings.controller.clientWidth + 'px',
					height: settings.controller.clientHeight + 'px'
				},
				onError: function onError(message) {
					alert('Horizontal Colorpicker with slider indicator error: ' + message);
				}
			});
		}
		if (options.value !== undefined) {
			var value = options.value * 100;
			if (value < 0) value = 0;
			if (value > 100) value = 100;
			settings.boSetValue = true;
			settings.colorpicker.setValue(value);
			settings.boSetValue = false;
		}
	}
	if (settings.elName === false) return;
	if (settings.elName === null) console.warn('createController: invalid settings.elName = ' + settings.elName);
	if (typeof settings.elName === "string") {
		var _id2 = settings.elName;
		settings.elName = document.getElementById(settings.elName);
		if (!settings.elName) console.warn('createController: invalid settings.elName = "' + _id2 + '"');
	}
	var str = '';
	if (!settings.elName) {
		if (options.axisName) settings.elName = document.getElementById(options.axisName + 'Name');
		if (!settings.elName) {
			settings.elName = document.createElement('span');
			settings.controller.parentElement.insertBefore(settings.elName, settings.controller);
			str = ' = ';
		}
	}
	if (settings.elName.innerHTML !== '') return;
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
var Player$1 =
function Player(group) {
			var settings = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
			classCallCheck(this, Player);
			assign();
			if (!settings.options && settings.frustumPoints) settings.options = settings.frustumPoints.getOptions();
			settings.options = settings.options || new Options();
			var options = settings.options;
			if (!options.boOptions) {
						console.error('Player: call options = new Options( options ) first');
						return;
			}
			if (options.player === false) return;
			options.boPlayer = options.boPlayer || false;
			if (options.player) {
						console.error('Player: duplicate player.');
						return;
			}
			options.player = this;
			settings.cameraTarget = settings.cameraTarget || {};
			function onSelectScene(index) {
						index = index || 0;
						var t = _this.getTime();
						Player.selectPlayScene(group, { t: t, index: index, options: settings.options });
						_this.setIndex(index, (options.playerOptions.name === '' ? '' : options.playerOptions.name + ': ') + t);
						if (settings.onSelectScene) _this.selectScenePause = settings.onSelectScene(index, t);
						if (options.frustumPoints) options.frustumPoints.updateCloudPoints();
			}
			setTimeout(function () {
						onSelectScene();
			}, 0);
			options.playerOptions.selectSceneIndex = options.playerOptions.selectSceneIndex || 0;
			var selectSceneIndex = options.playerOptions.selectSceneIndex;
			var _this = this;
			this.getTime = function () {
						var playerOptions = options.playerOptions,
						    t = playerOptions.min + selectSceneIndex * playerOptions.dt;
						if (isNaN(t)) console.error('Player.getTime(): t = ' + t);
						if (playerOptions.max !== null && t > playerOptions.max) console.error('Player.getTime(): t = ' + t + ' playerOptions.max = ' + playerOptions.max);
						if (t < playerOptions.min && playerOptions.max !== null) console.error('Player.getTime(): t = ' + t + ' playerOptions.min = ' + playerOptions.min);
						return t;
			};
			this.setTime = function (t) {
						return this.selectScene(parseInt((t - options.playerOptions.min) / options.playerOptions.dt));
			};
			this.selectScene = function (index) {
						if (index === undefined) {
									onSelectScene(selectSceneIndex);
									return true;
						}
						if (isNaN(index)) {
									console.error('Player.selectScene: index = ' + index);
									return false;
						}
						index = parseInt(index);
						if (options.playerOptions.max !== null) {
									if (index >= options.playerOptions.marks) index = 0;else if (index < 0) index = options.playerOptions.marks - 1;
									if (selectSceneIndex > options.playerOptions.marks) selectSceneIndex = options.playerOptions.marks;
						}
						while (selectSceneIndex !== index) {
									if (selectSceneIndex < index) selectSceneIndex++;else selectSceneIndex--;
									onSelectScene(selectSceneIndex);
						}
						return true;
			};
			this.next = function () {
						_this.selectScene(selectSceneIndex + 1);
			};
			this.prev = function () {
						_this.selectScene(selectSceneIndex - 1);
			};
			this.pushController = function (controller) {
						if (controller.object !== undefined && controller.object.playRate !== undefined) controller.object.playRate = options.playerOptions.min;
						this.controllers.push(controller);
			};
			this.controllers = [];
			var playing = false,
			    time,
			    timeNext;
			function RenamePlayButtons() {
						options.player.controllers.forEach(function (controller) {
									if (controller.onRenamePlayButtons) controller.onRenamePlayButtons(playing);
						});
			}
			function play() {
						if (selectSceneIndex === -1 || selectSceneIndex === options.playerOptions.marks && options.playerOptions.max !== null) {
									selectSceneIndex = 0;
						}
						onSelectScene(selectSceneIndex);
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
						if (options.playerOptions.max !== null && selectSceneIndex >= options.playerOptions.marks) {
									if (isRepeat()) selectSceneIndex = 0;else {
												selectSceneIndex = options.playerOptions.marks - 1;
												pause();
												return;
									}
						}
						play();
			}
			function step(timestamp) {
						if (_this.selectScenePause) return;
						if (playing) window.requestAnimationFrame(step);else time = undefined;
						if (time === undefined) {
									time = timestamp;
									timeNext = time + 1000 / options.playerOptions.interval;
						}
						if (isNaN(timeNext) || timeNext === Infinity) {
									console.error('Player.animate: timeNext = ' + timeNext);
									playing = false;
						}
						if (timestamp < timeNext) return;
						while (timestamp > timeNext) {
									timeNext += 1000 / options.playerOptions.interval;
						}playNext();
			}
			this.play3DObject = function () {
						if (playing) {
									pause();
									return;
						}
						playing = true;
						if (options.playerOptions.max !== null && selectSceneIndex >= options.playerOptions.marks - 1) selectSceneIndex = 0;
						playNext();
						RenamePlayButtons();
						window.requestAnimationFrame(step);
			};
			this.continue = function () {
						_this.selectScenePause = false;
						window.requestAnimationFrame(step);
			};
			this.repeat = function () {
						options.playerOptions.repeat = !options.playerOptions.repeat;
						this.onChangeRepeat(options.playerOptions.repeat);
			};
			this.getSettings = function () {
						return settings;
			};
			this.getSelectSceneIndex = function () {
						return selectSceneIndex;
			};
			this.onChangeRepeat = function (value) {
						options.playerOptions.repeat = value;
						this.controllers.forEach(function (controller) {
									if (controller.onChangeRepeat) controller.onChangeRepeat();
						});
			};
			function getLang(params) {
						params = params || {};
						var lang = {
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
									defaultTitle: 'Restore default player settings.'
						};
						var _languageCode = params.getLanguageCode === undefined ? 'en'
						: params.getLanguageCode();
						switch (_languageCode) {
									case 'ru':
												lang.player = 'Проигрыватель';
												lang.playerTitle = 'Анимация 3D объектов.';
												lang.min = 'Минимум';
												lang.max = 'Максимум';
												lang.dt = 'Шаг';
												lang.dtTitle = 'Веремя между кадрами';
												lang.marks = 'Кадры';
												lang.marksTitle = 'Количество кадров проигрывателя';
												lang.interval = 'Темп', lang.intervalTitle = 'Скорость смены кадров в секунду.';
												lang.time = 'Время';
												lang.defaultButton = 'Восстановить';
												lang.defaultTitle = 'Восстановить настройки проигрывателя по умолчанию.';
												break;
									default:
												if (params.lang === undefined || params.lang._languageCode != _languageCode) break;
												Object.keys(params.lang).forEach(function (key) {
															if (_lang[key] === undefined) return;
															_lang[key] = params.lang[key];
												});
						}
						return lang;
			}
			var lang = {
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
						topAndBottom: 'Top and bottom'
			};
			function localization(getLanguageCode) {
						switch (getLanguageCode()) {
									case 'ru':
												lang.prevSymbolTitle = 'Кадр назад';
												lang.playTitle = 'Проиграть';
												lang.nextSymbolTitle = 'Кадр вперед';
												lang.pauseTitle = 'Пауза';
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
			this.localization = function () {
						var getLanguageCode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {
									return 'en';
						};
						localization(getLanguageCode);
						return lang;
			};
			this.PlayController = function (_controllers$CustomCo) {
						inherits(_class, _controllers$CustomCo);
						function _class(gui) {
									classCallCheck(this, _class);
									var player = options.player,
									    getLanguageCode = options.getLanguageCode;
									player.createControllersButtons(options);
									gui = gui || options.dat.gui;
									if (!gui || options.dat.playController === false) {
												var _this2 = possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this, {}));
												return possibleConstructorReturn(_this2);
									}
									localization(getLanguageCode);
									function addButton(innerHTML, title, onclick) {
												var button = document.createElement('span');
												button.innerHTML = innerHTML;
												button.title = title;
												button.style.cursor = 'pointer';
												button.style.margin = '0px 2px';
												button.onclick = onclick;
												return button;
									}
									var _renamePlayButtons, _renameRepeatButtons;
									var colorOff = 'rgb(255,255,255)',
									    colorOn = 'rgb(128,128,128)';
									var _this2 = possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this, {
												playRate: 1,
												property: function property(customController) {
															var buttons = {};
															function RenamePlayButtons(innerHTML, title) {
																		buttons.buttonPlay.innerHTML = innerHTML;
																		buttons.buttonPlay.title = title;
															}
															_renamePlayButtons = RenamePlayButtons;
															buttons.buttonPrev = addButton(lang.prevSymbol, lang.prevSymbolTitle, player.prev);
															buttons.buttonPlay = addButton(playing ? lang.pause : lang.playSymbol, playing ? lang.pauseTitle : lang.playTitle, player.play3DObject);
															if (player.getSettings().options.playerOptions.max !== null) {
																		var RenameRepeatButtons = function RenameRepeatButtons(isRepeat) {
																					var title, color;
																					if (isRepeat) {
																								title = lang.repeatOff;
																								color = colorOff;
																					} else {
																								title = lang.repeatOn;
																								color = colorOn;
																					}
																					if (buttons.buttonRepeat.title === title) return;
																					buttons.buttonRepeat.title = title;
																					buttons.buttonRepeat.style.color = color;
																					player.onChangeRepeat(isRepeat);
																		};
																		var repeat = function repeat(value) {
																					RenameRepeatButtons(buttons.buttonRepeat.title === lang.repeatOn);
																		};
																		_renameRepeatButtons = RenameRepeatButtons;
																		var title, color;
																		if (player.getSettings().repeat) {
																					title = lang.repeatOff;
																					color = colorOff;
																		} else {
																					title = lang.repeatOn;
																					color = colorOn;
																		}
																		buttons.buttonRepeat = addButton(lang.repeat, title, repeat);
																		buttons.buttonRepeat.style.color = color;
															}
															buttons.buttonNext = addButton(lang.nextSymbol, lang.nextSymbolTitle, player.next);
															return buttons;
												}
									}, 'playRate'));
									player.PlayController = _this2;
									_this2.lang = lang;
									_this2.onRenamePlayButtons = function (playing) {
												var name, title;
												if (playing) {
															name = lang.pause;
															title = lang.pauseTitle;
												} else {
															name = lang.playSymbol;
															title = lang.playTitle;
												}
												_renamePlayButtons(name, title, true);
									};
									_this2.onChangeRepeat = function () {
												_renameRepeatButtons(player.getSettings().options.playerOptions.repeat);
									};
									player.pushController(_this2);
									_this2.setValue = function (value) {
												this._controller.domElement.childNodes[0].value = value;
									};
									var controler = gui.add(_this2);
									controler.__truncationSuspended = true;
									return possibleConstructorReturn(_this2);
						}
						createClass(_class, [{
									key: 'controller',
									set: function set$$1(newController) {
												this._controller = newController;
												this._controller.onChange(function (value) {
															options.player.setTime(value);
												});
												this._controller.domElement.title = this.lang.controllerTitle;
									},
									get: function get$$1() {
												return this._controller;
									}
						}]);
						return _class;
			}(controllers$1.CustomController);
			this.gui = function (folder) {
						var cookie = options.dat.cookie,
						    cookieName = options.dat.getCookieName('Player'),
						    getLanguageCode = options.getLanguageCode,
						    dat = three$1.dat;
						folder = folder || options.dat.gui;
						if (!folder || options.dat.playerGui === false) return;
						function setDT() {
									if (options.playerOptions.max === null) options.playerOptions.dt = options.playerOptions.dt || 0.1;else options.playerOptions.dt = (options.playerOptions.max - options.playerOptions.min) / (options.playerOptions.marks - 1);
						}
						function setSettings() {
									setDT();
									cookie.setObject(cookieName, options.playerOptions);
									if (settings.onChangeScaleT) settings.onChangeScaleT(options.playerOptions);
						}
						function setMax() {
									if (options.playerOptions.max !== null) options.playerOptions.max = options.playerOptions.min + options.playerOptions.dt * (options.playerOptions.marks - 1);
						}
						setMax();
						var axesDefault = JSON.parse(JSON.stringify(options.playerOptions)),
						    lang = getLang({
									getLanguageCode: getLanguageCode
						});
						Object.freeze(axesDefault);
						var max = options.playerOptions.max,
						    marks = options.playerOptions.marks;
						cookie.getObject(cookieName, options.playerOptions, options.playerOptions);
						if (max === null || max === Infinity || options.playerOptions.max === null
						) {
												options.playerOptions.max = max;
												options.playerOptions.marks = marks;
									}
						var fPlayer = folder.addFolder(lang.player);
						dat.folderNameAndTitle(fPlayer, lang.player, lang.playerTitle);
						function scale() {
									var axes = options.playerOptions,
									    scaleControllers = {};
									function onclick(customController, action) {
												var zoom = customController.controller.getValue();
												axes.min = action(axes.min, zoom);
												scaleControllers.min.setValue(axes.min);
												if (axes.max) {
															axes.max = action(axes.max, zoom);
															setDT();
															scaleControllers.max.setValue(axes.max);
												}
												setSettings();
									}
									scaleControllers.folder = fPlayer.addFolder(axes.name !== '' ? axes.name : lang.time);
									scaleControllers.scaleController = scaleControllers.folder.add(new ScaleController(onclick, { settings: settings.options.playerOptions, getLanguageCode: getLanguageCode })).onChange(function (value) {
												axes.zoomMultiplier = value;
												setSettings();
									});
									var positionController = new PositionController(function (shift) {
												onclick(positionController, function (value, zoom) {
															value += shift;
															return value;
												});
									}, { settings: settings.options.playerOptions, getLanguageCode: getLanguageCode });
									scaleControllers.positionController = scaleControllers.folder.add(positionController).onChange(function (value) {
												axes.offset = value;
												setSettings();
									});
									scaleControllers.min = dat.controllerZeroStep(scaleControllers.folder, axes, 'min', function (value) {
												setSettings();
									});
									dat.controllerNameAndTitle(scaleControllers.min, lang.min);
									setMax();
									if (axes.max !== null) {
												scaleControllers.max = dat.controllerZeroStep(scaleControllers.folder, axes, 'max', function (value) {
															setSettings();
												});
												dat.controllerNameAndTitle(scaleControllers.max, lang.max);
									} else {
												scaleControllers.dt = dat.controllerZeroStep(scaleControllers.folder, axes, 'dt', function (value) {
															setSettings();
												});
												dat.controllerNameAndTitle(scaleControllers.dt, lang.dt, lang.dtTitle);
									}
									if (axes.marks) {
												scaleControllers.marks = scaleControllers.folder.add(axes, 'marks').onChange(function (value) {
															axes.marks = parseInt(axes.marks);
															setSettings();
															var elSlider = getSliderElement();
															if (elSlider) elSlider.max = options.playerOptions.marks - 1;
												});
												dat.controllerNameAndTitle(scaleControllers.marks, axes.marksName === undefined ? lang.marks : axes.marksName, axes.marksTitle === undefined ? lang.marksTitle : axes.marksTitle);
									}
									scaleControllers.interval = scaleControllers.folder.add(settings.options.playerOptions, 'interval', 1, 25, 1).onChange(function (value) {
												setSettings();
									});
									dat.controllerNameAndTitle(scaleControllers.interval, lang.interval, lang.intervalTitle);
									dat.controllerNameAndTitle(scaleControllers.folder.add({
												defaultF: function defaultF(value) {
															axes.zoomMultiplier = axesDefault.zoomMultiplier;
															scaleControllers.scaleController.setValue(axes.zoomMultiplier);
															axes.offset = axesDefault.offset;
															scaleControllers.positionController.setValue(axes.offset);
															axes.min = axesDefault.min;
															scaleControllers.min.setValue(axes.min);
															if (scaleControllers.max) {
																		axes.max = axesDefault.max;
																		setDT();
																		scaleControllers.max.setValue(axes.max);
															}
															if (scaleControllers.dt) {
																		axes.dt = axesDefault.dt;
																		scaleControllers.dt.setValue(axes.dt);
															}
															if (axesDefault.marks) {
																		axes.marks = axesDefault.marks;
																		if (scaleControllers.marks) scaleControllers.marks.setValue(axes.marks);
															}
															axes.interval = axesDefault.interval;
															scaleControllers.interval.setValue(axes.interval);
															setSettings();
												}
									}, 'defaultF'), lang.defaultButton, lang.defaultTitle);
						}
						scale();
			};
			this.createControllersButtons = function (options) {
						if (!options.controllers || !options.controllers.player) return;
						var settings = options.controllers.player;
						if (settings.buttonPrev === null) console.warn('Player.createControllersButtons: invalid options.controllers.player.buttonPrev = ' + settings.buttonPrev);
						if (settings.buttonPrev) {
									var buttonPrev = typeof settings.buttonPrev === 'string' ? document.getElementById(settings.buttonPrev) : settings.buttonPrev;
									if (buttonPrev === null) console.warn('Player.createControllersButtons: invalid options.controllers.player.buttonPrev = ' + settings.buttonPrev);
									if (buttonPrev) {
												buttonPrev.value = lang.prevSymbol;
												buttonPrev.title = lang.prevSymbolTitle;
												buttonPrev.onclick = function (event) {
															if (options.player) options.player.prev();
												};
												settings.buttonPrev = buttonPrev;
									}
						}
						if (settings.buttonPlay === null) console.warn('Player.createControllersButtons: invalid options.controllers.player.buttonPlay = ' + settings.buttonPlay);
						if (settings.buttonPlay) {
									var buttonPlay = typeof settings.buttonPlay === 'string' ? document.getElementById(settings.buttonPlay) : settings.buttonPlay;
									if (buttonPlay === null) console.warn('Player.createControllersButtons: invalid options.controllers.player.buttonPlay = ' + settings.buttonPlay);
									if (buttonPlay) {
												buttonPlay.value = playing ? lang.pause : lang.playSymbol;
												buttonPlay.title = playing ? lang.pauseTitle : lang.playTitle;
												buttonPlay.onclick = function (event) {
															if (options.player) options.player.play3DObject();
												};
												settings.buttonPlay = buttonPlay;
									}
						}
						if (settings.buttonNext === null) console.warn('Player.createControllersButtons: invalid options.controllers.player.buttonNext = ' + settings.buttonNext);
						if (settings.buttonNext) {
									var buttonNext = typeof settings.buttonNext === 'string' ? document.getElementById(settings.buttonNext) : settings.buttonNext;
									if (buttonNext === null) console.warn('Player.createControllersButtons: invalid options.controllers.player.buttonNext = ' + settings.buttonNext);
									if (buttonNext) {
												buttonNext.value = lang.nextSymbol;
												buttonNext.title = lang.nextSymbolTitle;
												buttonNext.onclick = function (event) {
															if (options.player) options.player.next();
												};
												settings.buttonNext = buttonNext;
									}
						}
			};
			var _canvasMenu;
			this.createCanvasMenuItem = function (canvasMenu) {
						var getLanguageCode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {
									return 'en';
						};
						_canvasMenu = canvasMenu;
						var player = this,
						    menu = canvasMenu.menu,
						    lang = player.localization(getLanguageCode);
						menu.push({
									name: lang.prevSymbol,
									title: lang.prevSymbolTitle,
									onclick: function onclick(event) {
												player.prev();
									}
						});
						menu.push({
									name: playing ? lang.pause : lang.playSymbol,
									title: playing ? lang.pauseTitle : lang.playTitle,
									id: "menuButtonPlay",
									onclick: function onclick(event) {
												player.play3DObject();
									}
						});
						if (options.playerOptions.max !== null) {
									menu.push({
												name: lang.repeat,
												title: this.getSettings().repeat ? lang.repeatOff : lang.repeatOn,
												id: "menuButtonRepeat",
												onclick: function onclick(event) {
															player.repeat();
												}
									});
						}
						menu.push({
									name: lang.nextSymbol,
									title: lang.nextSymbolTitle,
									onclick: function onclick(event) {
												player.next();
									}
						});
						this.controllers.push({
									onRenamePlayButtons: function onRenamePlayButtons(playing) {
												var name, title;
												if (playing) {
															name = lang.pause;
															title = lang.pauseTitle;
												} else {
															name = lang.playSymbol;
															title = lang.playTitle;
												}
												var elMenuButtonPlay = canvasMenu.querySelector('#menuButtonPlay');
												elMenuButtonPlay.innerHTML = name;
												elMenuButtonPlay.title = title;
												if (options.controllers && options.controllers.player && options.controllers.player.buttonPlay) {
															options.controllers.player.buttonPlay.value = name;
															options.controllers.player.buttonPlay.title = title;
												}
									},
									onChangeRepeat: function onChangeRepeat() {
												canvasMenu.querySelector('#menuButtonRepeat').title = options.playerOptions.repeat ? lang.repeatOff : lang.repeatOn;
									}
						});
			};
			this.addSlider = function () {
						if (options.playerOptions.max === null) return;
						_canvasMenu.menu.push({
									name: '<input type="range" min="0" max="' + (options.playerOptions.marks - 1) + '" value="0" class="slider" id="sliderPosition">',
									style: 'float: right;'
						});
			};
			function getSliderElement() {
						if (_canvasMenu) return _canvasMenu.querySelector('#sliderPosition');
			}
			this.addSliderEvents = function () {
						var elSlider = getSliderElement();
						if (elSlider) {
									elSlider.onchange = function (event) {
												_player.selectScene(parseInt(elSlider.value));
									};
									elSlider.oninput = function (event) {
												_player.selectScene(parseInt(elSlider.value));
									};
									var pointerdown;
									var _player = this;
									elSlider.addEventListener('pointerdown', function (e) {
												pointerdown = true;
									});
									elSlider.addEventListener('pointerup', function (e) {
												pointerdown = false;
									});
									elSlider.addEventListener('mousemove', function (e) {
												if (!pointerdown) return;
												_player.selectScene((options.playerOptions.marks - 1) * e.offsetX / elSlider.clientWidth);
									});
						}
						return elSlider;
			};
			this.setIndex = function (index, title) {
						var t = this.getTime();
						if (options.controllers && options.controllers.t) options.controllers.t.controller.value = t;
						if (_typeof(this.PlayController) === "object") this.PlayController.setValue(t);
						var elSlider = getSliderElement();
						if (elSlider) {
									elSlider.value = index;
									elSlider.title = title;
						}
			};
			this.onChangeScale = function (scale) {
						getSliderElement().max = scale.marks - 1;
						this.selectScene(0);
			};
};
Player$1.cameraTarget = function () {
			function _class2() {
						classCallCheck(this, _class2);
						var cameraTargetDefault = { boLook: false },
						_cameraTarget = {
									boLook: cameraTargetDefault.boLook,
									getDistanceToCamera: function getDistanceToCamera() {
												if (typeof this.distanceToCameraCur !== 'undefined') return this.distanceToCameraCur;
												return this.distanceToCamera;
									}
						};
						var _options;
						cameraTargetDefault.rotation = {};
						_cameraTarget.rotation = {};
						var boTarget = false,
						boPlayer = false;
						var boCameraTargetLook;
						this.get = function (options) {
									if (!options && !_options) console.error('Player.cameraTarget.get: options = ' + options);else if (_options && options && !Object.is(_options, options)) console.error('Player.cameraTarget.get: options is ambiguous');
									_options = _options || options;
									if (!_cameraTarget.camera && !boPlayer && _options.player) {
												cameraTargetDefault.camera = _options.player.getSettings().cameraTarget.camera;
												if (cameraTargetDefault.camera) setCameraTarget();
												boPlayer = true;
									}
									if (_cameraTarget.camera) return _cameraTarget;
						};
						this.init = function (cameraTarget, options) {
									var boErrorMessage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
									if (!cameraTarget) return;
									if (!options && !_options) console.error('Player.cameraTarget.init: options = ' + options);else if (_options && options && !Object.is(_options, options)) console.error('Player.cameraTarget.init: options is ambiguous');
									_options = _options || options;
									if (cameraTarget.bodefault !== false) {
												if (boTarget) return;
												if (cameraTarget.boLook !== undefined) {
															cameraTargetDefault.boLook = cameraTarget.boLook;
															boCameraTargetLook = cameraTarget.boLook;
												}
									} else if (cameraTarget.boLook === true) {
												if (boTarget) console.warn('playerCameraTarget().init(...): duplicate target point');
												boTarget = true;
												if (boCameraTargetLook === undefined) cameraTargetDefault.boLook = true;
									} else return;
									cameraTargetDefault.camera = cameraTargetDefault.camera || cameraTarget.camera || (_options.player ? _options.player.getSettings().cameraTarget.camera : undefined);
									if (!cameraTargetDefault.camera && boErrorMessage) {
												console.error('playerCameraTarget().init(...): cameraTargetDefault.camera = ' + cameraTargetDefault.camera);
												return;
									}
									cameraTargetDefault.distanceToCamera = cameraTargetDefault.distanceToCamera || cameraTarget.distanceToCamera;
									cameraTarget.rotation = cameraTarget.rotation || {};
									cameraTargetDefault.rotation.angle = cameraTargetDefault.rotation.angle || cameraTarget.rotation.angle;
									cameraTargetDefault.rotation.axis = cameraTargetDefault.rotation.axis || cameraTarget.rotation.axis;
									setCameraTarget(cameraTarget);
						};
						function setCameraTarget(cameraTarget) {
									assign();
									if (!cameraTarget) cameraTarget = cameraTargetDefault;
									if (!_cameraTarget.boMaual) {
												if (cameraTarget.boLook !== undefined) _cameraTarget.boLook = cameraTarget.boLook;else _cameraTarget.boLook = cameraTargetDefault.boLook;
									}
									cameraTargetDefault.camera = cameraTargetDefault.camera || cameraTarget.camera;
									_cameraTarget.camera = cameraTarget.camera || cameraTargetDefault.camera;
									_cameraTarget.distanceToCamera = cameraTarget.distanceToCamera || cameraTargetDefault.distanceToCamera || _cameraTarget.distanceToCamera || new THREE.Vector3().copy(cameraTargetDefault.camera.position);
									if (!cameraTarget.rotation) cameraTarget.rotation = {};
									if (cameraTarget.rotation.angle !== undefined) _cameraTarget.rotation.angle = cameraTarget.rotation.angle;else _cameraTarget.rotation.angle = cameraTargetDefault.rotation.angle || 0;
									_cameraTarget.rotation.axis = cameraTarget.rotation.axis || cameraTargetDefault.rotation.axis || new THREE.Vector3(0, 1, 0);
						}
						this.changeTarget = function (mesh, i, options) {
									assign();
									var func = !mesh.userData.player || typeof mesh.userData.player.arrayFuncs === "function" ? {} : mesh.userData.player.arrayFuncs[i];
									if (!func.cameraTarget) func.cameraTarget = { boLook: false };
									setCameraTarget(func.cameraTarget);
									_options = _options || options;
									var cameraTarget = _options.playerOptions.cameraTarget.get(_options);
									if (cameraTarget) {
												if (cameraTarget && cameraTarget.boLook) {
															var target = getWorldPosition(mesh, new THREE.Vector3().fromArray(mesh.geometry.attributes.position.array, i * mesh.geometry.attributes.position.itemSize));
															cameraTarget.target = target;
												} else delete cameraTarget.target;
									}
						};
						this.setCameraTarget = function (options) {
									assign();
									var cameraTarget = options.playerOptions.cameraTarget.get(options);
									if (!cameraTarget) cameraTarget = cameraTarget || {};
									var camera = cameraTarget.camera;
									if (!camera) return;
									if (!cameraTarget.distanceToCamera) cameraTarget.distanceToCamera = new THREE.Vector3().copy(camera.position);
									if (!cameraTarget.distanceToCameraCur) cameraTarget.distanceToCameraCur = new THREE.Vector3();
									var t = options.time,
									    distanceToCamera = cameraTarget.distanceToCamera,
									    distanceToCameraCur = new THREE.Vector3().copy(cameraTarget.distanceToCameraCur);
									cameraTarget.distanceToCameraCur.set(Player$1.execFunc(distanceToCamera, 'x', t, options), Player$1.execFunc(distanceToCamera, 'y', t, options), Player$1.execFunc(distanceToCamera, 'z', t, options));
									if (!cameraTarget.setCameraPosition) cameraTarget.setCameraPosition = function ()                     {
												var target = cameraTarget.target;
												if (!cameraTarget.boLook ||
												!target &&
												cameraTarget.distanceToCameraCur.equals(distanceToCameraCur)
												) {
																		return;
															}
												distanceToCameraCur.copy(cameraTarget.distanceToCameraCur);
												var t = options.time;
												camera.position.copy(cameraTarget.distanceToCameraCur);
												camera.position.applyAxisAngle(cameraTarget.rotation.axis, Player$1.execFunc(cameraTarget.rotation, 'angle', t, options));
												if (!target) {
															if (Player$1.orbitControls) target = Player$1.orbitControls.target;else {
																		return;
															}
												}
												camera.position.add(target);
												camera.lookAt(target);
												if (options.orbitControls) {
															if (!options.orbitControls.target.equals(target)) {
																		options.orbitControls.target.copy(target);
																		if (options.orbitControlsGui) options.orbitControlsGui.setTarget(target);
															}
															if (options.orbitControls._listeners) options.orbitControls._listeners.change[0]();
												}
									};
									if (options.cameraGui) options.cameraGui.update();
						};
			}
			return _class2;
}();
Player$1.execFunc = function (funcs, axisName, t) {
			var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
			var func = funcs[axisName];
			var a = options.a,
			    b = options.b,
			    typeofFuncs = typeof func === 'undefined' ? 'undefined' : _typeof(func);
			if (typeof t === "undefined") t = options.playerOptions ? options.playerOptions.min : 0;
			switch (typeofFuncs) {
						case "undefined":
									return undefined;
						case "number":
									return func;
						case "string":
									func = new Function('t', 'a', 'b', 'return ' + func);
						case "function":
									try {
												var res = func(t, a, b);
												if (res === undefined) throw 'function returns ' + res;
												if (!Array.isArray(res)) return res;else func = res;
									} catch (e) {
												console.error(e);
												throw e;
												return;
									}
						case "object":
									if (Array.isArray(func)) {
												var execW = function execW(i) {
															if (typeof _a[i] === "function") return _a[i](t, _a, b);
															if (_a[i] instanceof THREE.Color) return _a[i];
												};
												if (func.length === 0) {
															console.error('Player.execFunc: funcs["' + axisName + '"] array is empty');
															return;
												}
												var _a = func,
												    l = func.length - 1,
												    max = options.playerOptions.max === null ? Infinity : options.playerOptions.max,
												    min = options.playerOptions.min,
												    tStep = (max - min) / l;
												var tStart = min,
												    tStop = max,
												    iStart = 0,
												    iStop = l;
												for (var i = 0; i < func.length; i++) {
															if (tStep * i + min < t) {
																		iStart = i;
																		iStop = i + 1;
																		tStart = tStep * iStart + min;
																		tStop = tStep * iStop + min;
															}
												}
												if (typeof _a[iStart] !== "number") {
															if (axisName === 'w') {
																		return execW(iStart);
															}
															if (_typeof(_a[iStart]) === "object") {
																		for (var i = 0; i < func.length; i++) {
																					if (i === func.length - 1) return _a[i].v;
																					iStart = i;iStop = i + 1;
																					tStart = _a[iStart].t;tStop = _a[iStop].t;
																					if (tStart <= t && tStop > t) {
																								var x = (_a[iStop].v - _a[iStart].v) / (tStop - tStart),
																								    y = _a[iStart].v - x * tStart;
																								return x * t + y;
																					}
																		}
																		console.error('Player.execFunc: value is not detected');
																		return;
															} else {
																		console.error('Player.execFunc: funcs["' + axisName + '"] array item ' + iStart + ' typeof = ' + _typeof(_a[iStart]) + ' is not number');
																		return;
															}
												}
												if (iStop >= func.length) iStop = iStart;
												if (typeof _a[iStop] !== "number") {
															if (axisName === 'w') return execW(iStop);
															if (_typeof(_a[iStop]) !== "object") {
																		console.error('Player.execFunc: funcs["' + axisName + '"] array item ' + iStop + ' typeof = ' + _typeof(_a[iStop]) + ' is not number');
																		return;
															}
												}
												var x = (_a[iStop] - _a[iStart]) / (tStop - tStart),
												    y = _a[iStart] - x * tStart;
												if (isNaN(x) || isNaN(y)) console.error('Player.execFunc: invalid x = ' + x + ' or y = ' + y);
												return x * t + y;
									}
									if (func.func) return func.func instanceof Function ? func.func(t, a, b) : func.func;
									if (axisName !== 'w') console.error('Player.execFunc: funcs["' + axisName + '"] object is not array');
									return func;
						default:
									console.error('Player.execFunc: Invalud typeof funcs["' + axisName + '"]: ' + typeofFuncs);
			}
			return;
};
var lang;
var Ids = function Ids() {
			classCallCheck(this, Ids);
			function addKeys(axisName) {
						function keyValue(controllerId) {
									var id = axisName + controllerId;
									return {
												get controllerId() {
															return this.boUsed ? undefined : id;
												},
												get elController() {
															return document.getElementById(this.controllerId);
												},
												nameId: id + 'Name',
												get elName() {
															return document.getElementById(this.nameId);
												}
									};
						}
						return {
									func: keyValue('Func'),
									position: keyValue('Position'),
									worldPosition: keyValue('WorldPosition')
						};
			}
			this.x = addKeys('x');
			this.y = addKeys('y');
			this.z = addKeys('z');
			this.w = addKeys('w');
};
var ids = new Ids();
Player$1.selectMeshPlayScene = function (mesh) {
			var settings = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
			assign();
			var t = settings.t,
			    options = settings.options || { dat: false };
			options = new Options(options);
			if (t === undefined) t = options.playerOptions.min;
			options.scales.setW();
			if (!mesh.userData.player || options && options.boPlayer && mesh.userData.boFrustumPoints) return;
			if (mesh.geometry) {
						delete mesh.geometry.boundingSphere;
						mesh.geometry.boundingSphere = null;
			}
			if (mesh.userData.player.selectPlayScene) {
						var setRotation = function setRotation(axisName) {
									while (mesh.rotation[axisName] < 0) {
												mesh.rotation[axisName] += Math.PI * 2;
									}while (mesh.rotation[axisName] > Math.PI * 2) {
												mesh.rotation[axisName] -= Math.PI * 2;
									}
						};
						mesh.userData.player.selectPlayScene(t);
						setRotation('x');
						setRotation('y');
						setRotation('z');
			}
			function setAttributes(a, b) {
						if (!mesh.geometry || mesh.userData.nd) return;
						var attributes = mesh.geometry.attributes,
						    arrayFuncs = mesh.userData.player.arrayFuncs;
						if (arrayFuncs === undefined) return;
						if (t === undefined) console.error('setPosition: t = ' + t);
						var min, max;
						if (options && options.scales.w !== undefined) {
									min = options.scales.w.min;max = options.scales.w.max;
						} else {
									max = value;
									min = max - 1;
						}
						var _loop = function _loop() {
									funcs = arrayFuncs[i];
									needsUpdate = false;
									function setPosition(axisName, fnName) {
												var value = Player$1.execFunc(funcs, axisName, t, options);
												if (value !== undefined) {
															attributes.position[fnName](i, value);
															needsUpdate = true;
												}
									}
									setPosition('x', 'setX');
									setPosition('y', 'setY');
									setPosition('z', 'setZ');
									setPosition('w', 'setW');
									var color = void 0;
									function getColor() {
												if (mesh.userData.player.palette) color = mesh.userData.player.palette.toColor(value, min, max);else if (options.palette) color = options.palette.toColor(value, min, max);else {
															var c = { r: 255, g: 255, b: 255 };
															color = new THREE.Color("rgb(" + c.r + ", " + c.g + ", " + c.b + ")");
															return color;
												}
									}
									if (typeof funcs.w === "function") {
												value = funcs.w(t, a, b);
												if (options.scales.w) {
															min = options.scales.w.min;
															max = options.scales.w.max;
												} else {
															console.warn('Player.selectMeshPlayScene: Кажется эти экстремумы заданы неверно');
															min = 0;
															max = 100;
												}
												if (attributes.position.itemSize >= 4) attributes.position.setW(i, value);
												needsUpdate = true;
												getColor();
									} else if (_typeof(funcs.w) === "object") {
												if (funcs.w instanceof THREE.Color) color = funcs.w;else {
															value = Player$1.execFunc(funcs, 'w', t, options);
															if (funcs.w.min !== undefined) min = funcs.w.min;
															if (funcs.w.max !== undefined) max = funcs.w.max;
															getColor();
												}
									}
									color = setColorAttibute(funcs.w === undefined ? new THREE.Vector4().w : typeof funcs.w === "number" ? funcs.w : Player$1.execFunc(funcs, 'w', t, options), mesh, i, color);
									if (needsUpdate) attributes.position.needsUpdate = true;
									if (funcs.trace && !funcs.line) {
												funcs.line = new Player$1.traceLine(options);
												funcs.trace = false;
									}
									if (funcs.line && funcs.line.addPoint) funcs.line.addPoint(mesh, i, color);
									if (funcs.cameraTarget && funcs.cameraTarget.boLook === true) options.playerOptions.cameraTarget.changeTarget(mesh, i, options);
						};
						for (var i = 0; i < arrayFuncs.length; i++) {
									var funcs, needsUpdate;
									var value;
									var value;
									_loop();
						}
			}
			setAttributes(options ? options.a : 1, options ? options.b : 0);
			var message = 'Player.selectMeshPlayScene: invalid mesh.scale.';
			if (mesh.scale.x <= 0) console.error(message + 'x = ' + mesh.scale.x);
			if (mesh.scale.y <= 0) console.error(message + 'y = ' + mesh.scale.y);
			if (mesh.scale.z <= 0) console.error(message + 'z = ' + mesh.scale.z);
			function setColorAttibute(value, mesh, index, color) {
						if (mesh.geometry.attributes.position.itemSize < 4) return;
						if (options.palette) color = options.palette.toColor(value, options.scales.w.min, options.scales.w.max);
						if (!color) return;
						var attributes = mesh.geometry.attributes,
						    arrayFuncs = mesh.userData.player.arrayFuncs;
						if (!Player$1.setColorAttribute(attributes, index, color) && arrayFuncs[index] instanceof THREE.Vector4) {
									if (mesh.userData.player && arrayFuncs) {
												mesh.geometry.setAttribute('color', new THREE.Float32BufferAttribute(Player$1.getColors(arrayFuncs, {
															positions: attributes.position,
															options: options
												}), 4));
												if (!Player$1.setColorAttribute(attributes, index, color)) console.error('Player.selectMeshPlayScene: the color attribute is not exists. Please use THREE.Vector3 instead THREE.Vector4 in the arrayFuncs or add "color" attribute');
									} else console.error('Player.selectMeshPlayScene: set color attribute failed. Invalid mesh.userData.player.arrayFuncs');
						}
						return color;
			}
			if (mesh.userData.player && mesh.userData.player.arrayFuncs && mesh.userData.player.arrayFuncs instanceof Array) mesh.userData.player.arrayFuncs.forEach(function (func, index) {
						if (func.controllers) {
									var setPosition = function setPosition(value, axisName) {
												var axesId = axisName === 'x' ? 0 : axisName === 'y' ? 1 : axisName === 'z' ? 2 : axisName === 'w' ? 3 : undefined;
												if (axisName === 'w') {
															setColorAttibute(value, mesh, index);
															if (options.guiSelectPoint) options.guiSelectPoint.update();
												}
												var indexValue = axesId + mesh.geometry.attributes.position.itemSize * index,
												    valueOld = mesh.geometry.attributes.position.array[indexValue];
												mesh.geometry.attributes.position.array[indexValue] = value;
												var axisControllers = func.controllers[axisName];
												if (isNaN(mesh.geometry.attributes.position.array[indexValue])) {
															alert(lang.positionAlert + value);
															var controller = axisControllers.position.controller;
															controller.focus();
															controller.value = valueOld;
															mesh.geometry.attributes.position.array[indexValue] = valueOld;
															return;
												}
												mesh.geometry.attributes.position.needsUpdate = true;
												if (options.axesHelper) options.axesHelper.updateAxes();
												if (options.guiSelectPoint) options.guiSelectPoint.update();
												if (axisControllers.worldPosition && axisControllers.worldPosition.controller) {
															var _controller = axisControllers.worldPosition.controller;
															_controller.innerHTML = getObjectPosition(mesh, index)[axisName];
												}
									};
									var createControllers = function createControllers(axisName) {
												var axisControllers = func.controllers[axisName];
												if (axisControllers === false) return;
												var position = 'position';
												if (!axisControllers && (ids[axisName].func.elController || ids[axisName].position.elController || ids[axisName].worldPosition.elController)) {
															axisControllers = {};
															func.controllers[axisName] = axisControllers;
												}
												if (!axisControllers) return;
												function addKey(keyName) {
															if (!ids[axisName][keyName].elController) return;
															if (!axisControllers[keyName]) {
																		if (!ids[axisName][keyName].boUsed) {
																					axisControllers[keyName] = {
																								controller: ids[axisName][keyName].elController,
																								elName: ids[axisName][keyName].elName ? ids[axisName][keyName].elName : false
																					};
																					ids[axisName][keyName].boUsed = true;
																					if (keyName === position && axisName === 'w') axisControllers[keyName].elSlider = true;
																		} else console.warn('Player.selectMeshPlayScene createControllers: Same controller is using for different points. Controller ID is "' + ids[axisName][keyName].controllerId + '""');
															}
												}
												addKey('func');
												addKey(position);
												addKey('worldPosition');
												createController(axisControllers.func, ids[axisName].func.controllerId, function () {
															return options.scales[axisName].name + ' = f(t)';
												}, {
															value: func[axisName],
															title: axisName === 'x' ? lang.controllerXFunctionTitle : axisName === 'y' ? lang.controllerYFunctionTitle : axisName === 'z' ? lang.controllerZFunctionTitle : axisName === 'w' ? lang.controllerWFunctionTitle : '',
															onchange: function onchange(event) {
																		try {
																					func[axisName] = event.currentTarget.value;
																					var value = Player$1.execFunc(func, axisName, options.player.getTime(), options);
																					if (axisControllers.position && axisControllers.position.controller) {
																								var controller = axisControllers.position.controller;
																								controller.onchange({ currentTarget: { value: value } });
																								controller.value = value;
																					} else setPosition(value, axisName);
																					if (options.guiSelectPoint) options.guiSelectPoint.update();
																		} catch (e) {
																					alert('Axis: ' + options.scales[axisName].name + '. Function: "' + func[axisName] + '". ' + e);
																					event.currentTarget.focus();
																		}
															}
												});
												createController(axisControllers.position, axisName + 'Position', function () {
															return options.scales[axisName].name;
												}, {
															value: positionLocal[axisName],
															title: axisName === 'x' ? lang.controllerXTitle : axisName === 'y' ? lang.controllerYTitle : axisName === 'z' ? lang.controllerZTitle : axisName === 'w' ? lang.controllerWTitle : '',
															onchange: function onchange(event) {
																		setPosition(event.currentTarget.value, axisName);
															},
															axisName: axisName
												});
												createController(axisControllers.worldPosition, axisName + 'WorldPosition', function () {
															return lang.controllerWorld + ' ' + options.scales[axisName].name;
												}, {
															value: getWorldPosition(mesh, positionLocal)[axisName],
															title: axisName === 'x' ? lang.controllerXWorldTitle : axisName === 'y' ? lang.controllerYWorldTitle : axisName === 'z' ? lang.controllerZWorldTitle : axisName === 'w' ? lang.controllerWTitle : ''
												});
									};
									if (!lang) {
												lang = {
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
															positionAlert: 'Invalid position fromat: '
												};
												switch (options.getLanguageCode()) {
															case 'ru':
																		lang.controllerXTitle = 'Позиция X';
																		lang.controllerYTitle = 'Позиция Y';
																		lang.controllerZTitle = 'Позиция Z';
																		lang.controllerWTitle = 'Индекс цвета';
																		lang.controllerWorld = 'Абсолютный';
																		lang.controllerXWorldTitle = 'Абсолютная позиция X';
																		lang.controllerYWorldTitle = 'Абсолютная позиция Y';
																		lang.controllerZWorldTitle = 'Абсолютная позиция Z';
																		lang.controllerWWorldTitle = 'Индекс цвета';
																		lang.positionAlert = 'Неправильный формат позиции точки: ';
																		break;
															default:
																		if (options.lang === undefined || options.lang.languageCode != languageCode) break;
																		Object.keys(options.lang).forEach(function (key) {
																					if (lang[key] === undefined) return;
																					lang[key] = options.lang[key];
																		});
												}
									}
									var positionLocal = getObjectLocalPosition(mesh, index);
									if (func.name) {
												if (!func.controllers.pointName) func.controllers.pointName = 'pointName';
												var elPointName = typeof func.controllers.pointName === "string" ? document.getElementById(func.controllers.pointName) : func.controllers.pointName;
												if (elPointName) elPointName.innerHTML = func.name;
									}
									createControllers('x');
									createControllers('y');
									createControllers('z');
									createControllers('w');
						}
			});
			if (!options || !options.guiSelectPoint) {
						if (options.axesHelper) options.axesHelper.movePosition();
						return;
			}
			options.guiSelectPoint.setMesh();
			var selectedPointIndex = options.guiSelectPoint.getSelectedPointIndex();
			if (selectedPointIndex !== -1 && options.guiSelectPoint.isSelectedMesh(mesh)) {
						options.guiSelectPoint.setPosition({
									object: mesh,
									index: selectedPointIndex
						});
			}
};
Player$1.setColorAttribute = function (attributes, i, color) {
			if (typeof color === "string") color = new THREE.Color(color);
			var colorAttribute = attributes.color || attributes.ca;
			if (colorAttribute === undefined) return false;
			colorAttribute.setX(i, color.r);
			colorAttribute.setY(i, color.g);
			colorAttribute.setZ(i, color.b);
			colorAttribute.needsUpdate = true;
			return true;
};
Player$1.getPoints = function (arrayFuncs, optionsPoints) {
			assign();
			if (!Array.isArray(arrayFuncs)) arrayFuncs = [arrayFuncs];
			optionsPoints = optionsPoints || {};
			if (optionsPoints.t === undefined) optionsPoints.t = optionsPoints.options && optionsPoints.options.player ? optionsPoints.options.player.getSettings().options.playerOptions.min : 0;
			var options = optionsPoints.options || new Options(),
			    optionsDefault = new Options({ palette: options.palette });
			options.setW(optionsDefault);
			var wDefault = optionsDefault.scales.w.max;
			for (var i = 0; i < arrayFuncs.length; i++) {
						var item = arrayFuncs[i];
						if (Array.isArray(item)) arrayFuncs[i] = new THREE.Vector4(item[0] === undefined ? 0 : item[0], item[1] === undefined ? 0 : item[1], item[2] === undefined ? 0 : item[2], item[3] === undefined ? wDefault : item[3]);else if ((typeof item === 'undefined' ? 'undefined' : _typeof(item)) === "object" && item instanceof THREE.Vector2 === false && item instanceof THREE.Vector3 === false && item instanceof THREE.Vector4 === false) {
									if (item.vector === undefined) arrayFuncs[i] = new THREE.Vector4(item.x === undefined ? 0 : item.x, item.y === undefined ? 0 : item.y, item.z === undefined ? 0 : item.z, item.w === undefined ? 0 : item.w);else if (item.vector instanceof THREE.Vector2 === true || item.vector instanceof THREE.Vector3 === true || item.vector instanceof THREE.Vector4 === true) {
												if (item.vector instanceof THREE.Vector2 === true) arrayFuncs[i].vector = new THREE.Vector3(item.vector.x === undefined ? 0 : item.vector.x, item.vector.y === undefined ? 0 : item.vector.y, item.vector.z === undefined ? 0 : item.vector.z);
									} else {
												if (item.vector.length === 4) arrayFuncs[i].vector = new THREE.Vector4(item.vector[0] === undefined ? 0 : item.vector[0], item.vector[1] === undefined ? 0 : item.vector[1], item.vector[2] === undefined ? 0 : item.vector[2], item.vector[3] === undefined ? 0 : item.vector[3]);else if (item.vector.length === 3) arrayFuncs[i].vector = new THREE.Vector3(item.vector[0] === undefined ? 0 : item.vector[0], item.vector[1] === undefined ? 0 : item.vector[1], item.vector[2] === undefined ? 0 : item.vector[2]);else if (item.vector.length < 3) arrayFuncs[i].vector = new THREE.Vector4(item.vector[0] === undefined ? 0 : item.vector[0], item.vector[1] === undefined ? 0 : item.vector[1]);else console.error('Player.getPoints(...) falied! item.vector.length = ' + item.vector.length);
									}
						}
			}
			var points = [];
			for (var i = 0; i < arrayFuncs.length; i++) {
						var getAxis = function getAxis(axisName) {
									if (typeof funcs === "number") funcs = new THREE.Vector4(funcs, 0, 0, 0);
									if (funcs instanceof THREE.Vector2 || funcs instanceof THREE.Vector3 || funcs instanceof THREE.Vector4) {
												var value = Player$1.execFunc(funcs, axisName, optionsPoints.t, options);
												return value;
									}
									if (funcs.vector === undefined) {
												console.error('Player.getAxis().getPoints(): funcs.vector = ' + funcs.vector);
												return;
									}
									if (funcs.name !== undefined) funcs.vector.name = funcs.name;
									if (funcs.trace) funcs.vector.trace = funcs.trace;
									if (funcs.controllers) funcs.vector.controllers = funcs.controllers;
									if (funcs.cameraTarget) {
												funcs.vector.cameraTarget = funcs.cameraTarget;
												delete funcs.cameraTarget;
									}
									arrayFuncs[i] = funcs.vector;
									funcs = funcs.vector;
									return Player$1.execFunc(funcs, axisName, optionsPoints.t, options);
						};
						var funcs = arrayFuncs[i];
						var point = funcs.vector instanceof THREE.Vector3 === true ? new THREE.Vector3(getAxis('x'), getAxis('y'), getAxis('z')) : new THREE.Vector4(getAxis('x'), getAxis('y'), getAxis('z'), getAxis('w'));
						if (funcs.cameraTarget) {
									funcs.cameraTarget.bodefault = false;
									if (funcs.cameraTarget.boLook === undefined) funcs.cameraTarget.boLook = true;
									options.playerOptions.cameraTarget.init(funcs.cameraTarget, options);
						}
						points.push(point);
			}
			return points;
};
var boColorWarning = true;
Player$1.getColors = function (arrayFuncs, optionsColor) {
			assign();
			if (!Array.isArray(arrayFuncs)) arrayFuncs = [arrayFuncs];
			optionsColor = optionsColor || {};
			optionsColor.options = optionsColor.options || {};
			if (optionsColor.positions !== undefined && Array.isArray(arrayFuncs) && arrayFuncs.length !== optionsColor.positions.count) {
						console.error('getColors failed! arrayFuncs.length: ' + arrayFuncs.length + ' != positions.count: ' + optionsColor.positions.count);
						return optionsColor.colors;
			}
			var length = Array.isArray(arrayFuncs) ? arrayFuncs.length : optionsColor.positions.count;
			optionsColor.colors = optionsColor.colors || [];
			var colors = [];
			if (!optionsColor.options.palette) optionsColor.options.setPalette();
			for (var i = 0; i < length; i++) {
						var iColor = 3 * i;
						if (iColor >= optionsColor.colors.length) {
									var funcs = Array.isArray(arrayFuncs) ? arrayFuncs[i] : undefined;
									var vector;
									if (funcs instanceof THREE.Vector4 ||
									optionsColor.positions && optionsColor.positions.itemSize === 4
									) {
															var min = void 0,
															    max = void 0;
															var w = funcs.w;
															if (funcs.w instanceof Object && funcs.w.func) {
																		if (funcs.w.max) max = funcs.w.max;
																		if (funcs.w.min) min = funcs.w.min;
																		w = funcs.w.func;
															} else {
																		optionsColor.options.setW();
																		min = optionsColor.options.scales.w.min;max = optionsColor.options.scales.w.max;
															}
															if (w instanceof Function && !optionsColor.options.player && boColorWarning) {
																		boColorWarning = false;
															}
															var t = optionsColor.options.playerOptions ? optionsColor.options.playerOptions.min : 0;
															var color = optionsColor.options.palette.toColor(funcs === undefined ? new THREE.Vector4().fromBufferAttribute(optionsColor.positions, i).w : w instanceof Function ? w(t) : typeof w === "string" ? Player$1.execFunc(funcs, 'w', t, optionsColor.options) : w === undefined ? new THREE.Vector4().w : w, min, max);
															colors.push(color.r, color.g, color.b);
												} else if (optionsColor.colors instanceof THREE.Float32BufferAttribute) vector = new THREE.Vector3(1, 1, 1);else if (optionsColor.color != undefined) {
												var _color = new THREE.Color(optionsColor.color);
												colors.push(_color.r, _color.g, _color.b);
									} else colors.push(1, 1, 1);
						} else colors.push(optionsColor.colors[iColor], optionsColor.colors[iColor + 1], optionsColor.colors[iColor + 2]);
						if (optionsColor.opacity instanceof Array) colors.push(i < optionsColor.opacity.length ? optionsColor.opacity[i] : 1);else colors.push(1);
			}
			optionsColor.colors = colors;
			return optionsColor.colors;
};
Player$1.traceLine =
function traceLine(options) {
			classCallCheck(this, traceLine);
			var line;
			var arrayLines = [];
			assign();
			if (!options.player) {
						return;
			}
			this.isVisible = function () {
						if (!options.player) return false;
						if (line) return line.visible;
						if (arrayLines.length === 0) return false;
						return arrayLines[0].visible;
			};
			this.visible = function (visible) {
						if (!options.player) return false;
						if (line) {
									line.visible = visible;
									return;
						}
						arrayLines.forEach(function (line) {
									line.visible = visible;
						});
			};
			this.addPoint = function (mesh, index, color) {
						var attributesPosition = mesh.geometry.attributes.position;
						var point = attributesPosition.itemSize >= 4 ? new THREE.Vector4(0, 0, 0, 0) : new THREE.Vector3();
						point.fromArray(attributesPosition.array, index * attributesPosition.itemSize);
						var sceneIndex = options.player ? options.player.getSelectSceneIndex() : 0;
						if (options.playerOptions.max === null) {
									sceneIndex = Math.abs(sceneIndex);
									if (sceneIndex < arrayLines.length - 1) {
												while (sceneIndex < arrayLines.length - 1) {
															mesh.remove(arrayLines[arrayLines.length - 1]);
															arrayLines.pop();
												}
												return;
									}
									var geometry = new THREE.BufferGeometry(),
									    _MAX_POINTS = 2;
									var positions = new Float32Array(_MAX_POINTS * 3);
									geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
									var colors = new Float32Array(_MAX_POINTS * 3);
									geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
									var _line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ vertexColors: true }));
									mesh.add(_line);
									if (arrayLines[0]) _line.visible = arrayLines[0].visible;
									point = new THREE.Vector3().copy(point);
									var itemSize = _line.geometry.attributes.position.itemSize;
									point.toArray(_line.geometry.attributes.position.array, 1 * itemSize);
									var point0 = arrayLines.length === 0 ? point : new THREE.Vector3().fromArray(arrayLines[arrayLines.length - 1].geometry.attributes.position.array, 1 * itemSize);
									point0.toArray(_line.geometry.attributes.position.array, 0 * itemSize);
									_line.geometry.attributes.position.needsUpdate = true;
									if (color === undefined) color = new THREE.Color(1, 1, 1);
									Player$1.setColorAttribute(_line.geometry.attributes, 0, arrayLines.length === 0 ? color : new THREE.Color().fromArray(arrayLines[arrayLines.length - 1].geometry.attributes.color.array, 1 * itemSize));
									Player$1.setColorAttribute(_line.geometry.attributes, 1, color);
									arrayLines.push(_line);
									return;
						}
						if (line === undefined) {
									var _geometry = new THREE.BufferGeometry();
									var MAX_POINTS;
									if (options.playerOptions.max !== null) {
												if (options.playerOptions && options.playerOptions.marks) MAX_POINTS = options.playerOptions.marks;else if (options.player && options.player.marks) MAX_POINTS = options.player.marks;else {
															console.error('Player.traceLine: MAX_POINTS = ' + MAX_POINTS + '. Create Player first or remove all trace = true from all items of the arrayFuncs');
															return;
												}
									} else MAX_POINTS = sceneIndex + 1;
									var _positions = new Float32Array(MAX_POINTS * 3);
									_geometry.setAttribute('position', new THREE.BufferAttribute(_positions, 3));
									var _colors = new Float32Array(MAX_POINTS * 3);
									_geometry.setAttribute('color', new THREE.Float32BufferAttribute(_colors, 3));
									_geometry.setDrawRange(sceneIndex, sceneIndex);
									line = new THREE.Line(_geometry, new THREE.LineBasicMaterial({
												vertexColors: true
									}));
									line.visible = true;
									mesh.add(line);
						}
						if (line.geometry) {
									delete line.geometry.boundingSphere;
									line.geometry.boundingSphere = null;
						}
						point = new THREE.Vector3().copy(point);
						point.toArray(line.geometry.attributes.position.array, sceneIndex * line.geometry.attributes.position.itemSize);
						line.geometry.attributes.position.needsUpdate = true;
						if (color === undefined) color = new THREE.Color(1, 1, 1);
						Player$1.setColorAttribute(line.geometry.attributes, sceneIndex, color);
						var start = line.geometry.drawRange.start,
						    count = sceneIndex + 1 - start;
						if (start > sceneIndex) {
									var stop = start + line.geometry.drawRange.count;
									start = sceneIndex;
									count = stop - start;
						}
						line.geometry.setDrawRange(start, count);
			};
			this.remove = function () {
						if (line === undefined) return;
						line.geometry.dispose();
						line.material.dispose();
						line.parent.remove(line);
			};
};
Player$1.getItemSize = function (arrayFuncs) {
			assign();
			for (var i = 0; i < arrayFuncs.length; i++) {
						var func = arrayFuncs[i];
						if (func instanceof THREE.Vector4) return 4;
			}
			return 3;
};
Player$1.selectPlayScene = function (group) {
			var settings = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
			var t = settings.t !== undefined ? settings.t : 0,
			    index = settings.index !== undefined ? settings.index : undefined,
			    options = settings.options || new Options();
			group.userData.t = t;
			Player$1.selectMeshPlayScene(group, { t: t, options: options });
			function selectMeshPlayScene(group) {
						group.children.forEach(function (mesh) {
									if (mesh instanceof THREE.Group) selectMeshPlayScene(mesh);else Player$1.selectMeshPlayScene(mesh, { t: t, options: options });
						});
			}
			selectMeshPlayScene(group);
			options.playerOptions.cameraTarget.setCameraTarget(options);
			var cameraTarget = options.playerOptions.cameraTarget.get();
			if (cameraTarget && cameraTarget.setCameraPosition) cameraTarget.setCameraPosition(index === undefined);
};
var THREE;
function assign() {
			if (!three$1.isThree()) {
						console.warn('Player: can not assign. Set THREE first.');
						return;
			}
			THREE = three$1.THREE;
			Object.assign(THREE.BufferGeometry.prototype, {
						setFromPoints: function setFromPoints(points, itemSize) {
									itemSize = itemSize || 3;
									var position = [];
									for (var i = 0, l = points.length; i < l; i++) {
												var point = points[i];
												position.push(point.x, point.y, point.z || 0);
												if (itemSize >= 4) position.push(point.w || 0);
									}
									this.setAttribute('position', new THREE.Float32BufferAttribute(position, itemSize));
									return this;
						}
			});
			Object.assign(THREE.Vector4.prototype, {
						multiply: function multiply(v) {
									this.x *= v.x;
									this.y *= v.y;
									this.z *= v.z;
									if (v.w !== undefined) this.w *= v.w;
									return this;
						}
			});
			Object.assign(THREE.Vector4.prototype, {
						add: function add(v, w) {
									if (w !== undefined) {
												console.warn('THREE.Vector4: .add() now only accepts one argument. Use .addVectors( a, b ) instead.');
												return this.addVectors(v, w);
									}
									this.x += v.x;
									this.y += v.y;
									this.z += v.z;
									if (v.w !== undefined) this.w += v.w;
									return this;
						}
			});
			Object.assign(THREE.Points.prototype, {
						raycast: function raycast(raycaster, intersects) {
									var _inverseMatrix = new THREE.Matrix4();
									var _ray = new THREE.Ray();
									var _sphere = new THREE.Sphere();
									var _position = new THREE.Vector3();
									function testPoint(point, index, localThresholdSq, matrixWorld, raycaster, intersects, object) {
												var rayPointDistanceSq = _ray.distanceSqToPoint(point);
												if (rayPointDistanceSq < localThresholdSq) {
															var intersectPoint = new THREE.Vector3();
															_ray.closestPointToPoint(point, intersectPoint);
															intersectPoint.applyMatrix4(matrixWorld);
															var distance = raycaster.ray.origin.distanceTo(intersectPoint);
															if (distance < raycaster.near || distance > raycaster.far) return;
															intersects.push({
																		distance: distance,
																		distanceToRay: Math.sqrt(rayPointDistanceSq),
																		point: intersectPoint,
																		index: index,
																		face: null,
																		object: object
															});
												}
									}
									var geometry = this.geometry;
									var matrixWorld = this.matrixWorld;
									var threshold = raycaster.params.Points.threshold;
									if (geometry.boundingSphere === null) geometry.computeBoundingSphere();
									_sphere.copy(geometry.boundingSphere);
									_sphere.applyMatrix4(matrixWorld);
									_sphere.radius += threshold;
									if (raycaster.ray.intersectsSphere(_sphere) === false) return;
									_inverseMatrix.copy(matrixWorld).invert();
									_ray.copy(raycaster.ray).applyMatrix4(_inverseMatrix);
									var localThreshold = threshold / ((this.scale.x + this.scale.y + this.scale.z) / 3);
									var localThresholdSq = localThreshold * localThreshold;
									if (geometry.isBufferGeometry) {
												var index = geometry.index;
												var attributes = geometry.attributes;
												var positions = attributes.position.array;
												var itemSize = attributes.position.itemSize;
												if (index !== null) {
															var indices = index.array;
															for (var i = 0, il = indices.length; i < il; i++) {
																		var a = indices[i];
																		_position.fromArray(positions, a * itemSize);
																		testPoint(_position, a, localThresholdSq, matrixWorld, raycaster, intersects, this);
															}
												} else {
															for (var _i = 0, l = positions.length / itemSize; _i < l; _i++) {
																		_position.fromArray(positions, _i * itemSize);
																		testPoint(_position, _i, localThresholdSq, matrixWorld, raycaster, intersects, this);
															}
												}
									} else {
												var vertices = geometry.vertices;
												for (var _i2 = 0, _l = vertices.length; _i2 < _l; _i2++) {
															testPoint(vertices[_i2], _i2, localThresholdSq, matrixWorld, raycaster, intersects, this);
												}
									}
						}
			});
}
Player$1.assign = function () {
			assign();
};

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
function CreateFullScreenSettings(THREE, renderer, camera, options) {
	var fullScreen = false,
	    canvasMenu,
	    stereoEffect;
	options.fullScreen = options.fullScreen || {};
	if (options.canvasMenu) canvasMenu = options.canvasMenu;
	if (options.stereoEffect) stereoEffect = options.stereoEffect;
	renderer.setSize(renderer.domElement.width, renderer.domElement.height);
	var style;
	this.isFullScreen = function () {
		return fullScreen;
	};
	this.setStereoEffect = function (_stereoEffect) {
		stereoEffect = _stereoEffect;
	};
	this.setFullScreen = function () {
		var fs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
		var boTimeout = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
		setTimeout(function () {
			if (boTimeout && options.fullScreen.arrayContainersLength && options.fullScreen.arrayContainersLength() > 1) fs = true;
			var size = new THREE.Vector2();
			renderer.getSize(size);
			fullScreen = fs;
			if (fullScreen) {
				if (style !== undefined) {
					renderer.setSize(style.sizeOriginal.x, style.sizeOriginal.y);
					renderer.domElement.style.position = style.position;
					renderer.domElement.style.left = style.left;
					renderer.domElement.style.top = style.top;
					renderer.domElement.style.width = style.width;
					renderer.domElement.style.height = style.height;
				}
			} else {
				if (style === undefined) {
					style = {
						sizeOriginal: new THREE.Vector2(),
						position: renderer.domElement.style.position,
						left: renderer.domElement.style.left,
						top: renderer.domElement.style.top,
						width: renderer.domElement.style.width,
						height: renderer.domElement.style.height
					};
					renderer.getSize(style.sizeOriginal);
				}
				renderer.setSize(window.innerWidth, window.innerHeight);
				renderer.domElement.style.position = 'fixed';
				renderer.domElement.style.left = 0;
				renderer.domElement.style.top = 0;
				renderer.domElement.style.width = '100%';
				renderer.domElement.style.height = '100%';
			}
			if (options.fullScreen.onFullScreenToggle !== undefined) options.fullScreen.onFullScreenToggle(fullScreen);
			camera.aspect = size.x / size.y;
			camera.updateProjectionMatrix();
			fullScreen = !fullScreen;
			if (canvasMenu && canvasMenu.setFullScreenButton) canvasMenu.setFullScreenButton(fullScreen);
			CreateFullScreenSettings.RendererSetSize(renderer, options.canvasMenu);
		}, 0);
	};
	this.onclick = function () {
		if (stereoEffect !== undefined && parseInt(stereoEffect.settings.spatialMultiplex) !== StereoEffect.spatialMultiplexsIndexs.Mono) {
			stereoEffect.settings.spatialMultiplex = StereoEffect.spatialMultiplexsIndexs.Mono;
		}
		this.setFullScreen(fullScreen);
		return fullScreen;
	};
}
CreateFullScreenSettings.RendererSetSize = function (renderer, canvasMenu) {
	if (renderer.setSizeOld) return;
	renderer.setSizeOld = renderer.setSize;
	renderer.setSize = function (width, height, updateStyle) {
		renderer.setSizeOld(width, height, updateStyle);
		var elCanvas = renderer.domElement,
		    elContainer = elCanvas.parentElement;
		setTimeout(function () {
			elContainer.style.height = elCanvas.style.height;
			elContainer.style.width = elCanvas.style.width;
			elContainer.style.left = elCanvas.style.left;
			elContainer.style.top = elCanvas.style.top;
			elContainer.style.position = elCanvas.style.position;
			if (canvasMenu) canvasMenu.setSize(width, height);
		}, 0);
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
function SpriteText(text, position) {
	var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
	var THREE = three$1.THREE;
	position = position || new THREE.Vector3(0, 0, 0);
	var sprite = new THREE.Sprite(new THREE.SpriteMaterial({
		map: new THREE.Texture(),
		sizeAttenuation: options.sizeAttenuation !== undefined ? options.sizeAttenuation : false
	}));
	var canvas = document.createElement('canvas');
	sprite.material.map.minFilter = THREE.LinearFilter;
	var fontSize = 90;
	var context = canvas.getContext('2d');
	if (options.name) sprite.name = options.name;
	sprite.userData.update = function ()                  {
		var optionsUpdate = {};
		if (sprite.parent) updateOptions(sprite.parent, optionsUpdate);else if (options.group) updateOptions(options.group, optionsUpdate);
		var textHeight = options.textHeight || optionsUpdate.textHeight || 0.04;
		var fov = options.fov || optionsUpdate.fov,
		    sizeAttenuation = options.sizeAttenuation || optionsUpdate.sizeAttenuation || false,
		    rotation = options.rotation || optionsUpdate.rotation || 0,
		    fontFace = options.fontFace || optionsUpdate.fontFace || 'Arial',
		    bold = options.bold || optionsUpdate.bold || false,
		    italic = options.italic || optionsUpdate.italic || false,
		    fontProperties = options.fontProperties || optionsUpdate.fontProperties || '',
		    rect = options.rect || optionsUpdate.rect || {},
		    color = 'rgba(255, 255, 255, 1)',
		    fontColor = options.fontColor || optionsUpdate.fontColor || color,
		    center = SpriteText.getCenter(options.center || optionsUpdate.center, position);
		if (fov !== undefined) textHeight = fov * textHeight / 50;
		rect.displayRect = rect.displayRect || false;
		var borderThickness = rect.borderThickness ? rect.borderThickness : 5,
		    font = '' + fontProperties + (bold ? 'bold ' : '') + (italic ? 'italic ' : '') + fontSize + 'px ' + fontFace;
		context.font = font;
		var width = 0,
		    linesCount = 1,
		    lines;
		if (typeof text === 'string') {
			linesCount = 0;
			lines = text.split(/\r\n|\r|\n/);
			lines.forEach(function (line) {
				var lineWidth = context.measureText(line).width;
				if (width < lineWidth) width = lineWidth;
				linesCount += 1;
			});
		} else width = context.measureText(text).width;
		width += borderThickness * 2;
		var textWidth = width;
		canvas.width = textWidth;
		canvas.height = fontSize * linesCount + borderThickness * 2;
		context.font = font;
		if (rect.displayRect) {
			var roundRect = function roundRect(ctx, x, y, w, h, r) {
				ctx.beginPath();
				ctx.moveTo(x + r, y);
				ctx.lineTo(x + w - r, y);
				ctx.quadraticCurveTo(x + w, y, x + w, y + r);
				ctx.lineTo(x + w, y + h - r);
				ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
				ctx.lineTo(x + r, y + h);
				ctx.quadraticCurveTo(x, y + h, x, y + h - r);
				ctx.lineTo(x, y + r);
				ctx.quadraticCurveTo(x, y, x + r, y);
				ctx.closePath();
				ctx.fill();
				ctx.stroke();
			};
			context.fillStyle = rect.backgroundColor ? rect.backgroundColor : 'rgba(0, 0, 0, 1)';
			context.strokeStyle = rect.borderColor ? rect.borderColor : fontColor;
			context.lineWidth = borderThickness;
			roundRect(context, borderThickness / 2, borderThickness / 2, canvas.width - borderThickness, canvas.height - borderThickness, rect.borderRadius === undefined ? 0 : rect.borderRadius);
		}
		context.fillStyle = fontColor;
		context.textBaseline = 'bottom';
		if (linesCount > 1) {
			for (var i = 0; i < lines.length; i++) {
				var line = lines[i];
				context.fillText(line, borderThickness, canvas.height - (lines.length - i - 1) * fontSize - borderThickness);
			}
		} else context.fillText(text, borderThickness, canvas.height - borderThickness);
		sprite.material.map.image = canvas;
		sprite.material.map.needsUpdate = true;
		var th = textHeight * linesCount;
		sprite.scale.set(th * canvas.width / canvas.height, th);
		sprite.position.copy(position);
		sprite.center = center;
		sprite.material.sizeAttenuation = sizeAttenuation;
		sprite.material.rotation = rotation;
		sprite.material.needsUpdate = true;
	};
	sprite.userData.update();
	sprite.userData.updateText = function (_text) {
		text = _text;
		var options = {};
		updateOptions(sprite.parent, options);
		sprite.userData.update(options);
	};
	if (options.group) options.group.add(sprite);else if (three$1.group) three$1.group.add(sprite);else if (three$1.scene) three$1.scene.add(sprite);
	sprite.userData.optionsSpriteText = options;
	return sprite;
}
SpriteText.getCenter = function () {
	var center = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	var position = arguments[1];
	var THREE = three$1.THREE;
	var canvas = center.canvas ? center.canvas : undefined;
	function worldToScreen() {
		var width = canvas.width,
		    height = canvas.height,
		    widthHalf = width / 2,
		    heightHalf = height / 2;
		var pos = new THREE.Vector3().copy(position);
		pos.project(center.camera);
		pos.x = pos.x * widthHalf + widthHalf;
		pos.y = -(pos.y * heightHalf) + heightHalf;
		return pos;
	}
	var screenPos = center.canvas ? worldToScreen() : undefined;
	return center instanceof THREE.Vector2 || (typeof center === 'undefined' ? 'undefined' : _typeof(center)) === "object" && center.x !== undefined && center.y !== undefined
	? center : screenPos ? new THREE.Vector2(screenPos.x < canvas.width / 2 ? 0 : 1, screenPos.y < canvas.height / 2 ? 1 : 0) : new THREE.Vector2(0, 1);
};
function updateOptions(group, options) {
	if (group.userData.optionsSpriteText) Object.keys(group.userData.optionsSpriteText).forEach(function (key) {
		if (options[key] === undefined)
			options[key] = group.userData.optionsSpriteText[key];
	});
	while (group.parent) {
		group = group.parent;
		updateOptions(group, options);
	}
}
SpriteText.updateSpriteTextGroup = function (group) {
	var THREE = three$1.THREE;
	group.children.forEach(function (spriteItem) {
		if (spriteItem instanceof THREE.Sprite) {
			if (spriteItem.userData.update !== undefined) spriteItem.userData.update();
		}
		SpriteText.updateSpriteTextGroup(spriteItem);
	});
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
var StereoEffect =
function StereoEffect(renderer) {
	var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Options();
	classCallCheck(this, StereoEffect);
	if (!renderer) {
		console.error('StereoEffect: renderer = ' + renderer);
		return;
	}
	if (!options.boOptions) {
		options = new Options(options);
	}
	if (options.stereoEffect === false) return;
	if (options.dat.gui) options.dat.mouseenter = false;
	var THREE = three$1.THREE;
	assign$1();
	if (!options.stereoEffect) options.stereoEffect = {};
	var settings = options.stereoEffect;
	this.settings = settings;
	this.options = options;
	options.stereoEffect = this;
	if (settings.spatialMultiplex === undefined) settings.spatialMultiplex = spatialMultiplexsIndexs.Mono;
	settings.stereo = new THREE.StereoCamera();
	settings.stereo.aspect = settings.stereoAspect || 1;
	if (settings.far === undefined) settings.far = new THREE.PerspectiveCamera().focus;
	settings.focus = settings.camera === undefined ? new THREE.PerspectiveCamera().focus : new THREE.Vector3().distanceTo(settings.camera.position);
	settings.zeroParallax = 0;
	settings.eyeSep = settings.eyeSep || new THREE.StereoCamera().eyeSep / 10 * settings.far;
	if (settings.camera !== undefined) settings.camera.focus = settings.focus;
	this.setEyeSeparation = function (eyeSep) {
		settings.stereo.eyeSep = eyeSep;
	};
	this.setEyeSeparation(settings.eyeSep);
	this.getRendererSize = function () {
		return Options.raycaster.EventListeners.getRendererSize(renderer, settings.elParent);
	};
	var fullScreenSettings;
	var spatialMultiplexCur;
	this.render = function (scene, camera) {
		var spatialMultiplex = parseInt(settings.spatialMultiplex);
		if (settings.rememberSize && !fullScreenSettings) {
			if (_canvasMenu && _canvasMenu.getFullScreenSettings) fullScreenSettings = _canvasMenu.getFullScreenSettings(this);else fullScreenSettings = new CreateFullScreenSettings(THREE, renderer, camera, {
				canvasMenu: _canvasMenu,
				stereoEffect: this
			});
		}
		scene.updateMatrixWorld();
		if (camera.parent === null) camera.updateMatrixWorld();
		var size = new THREE.Vector2();
		renderer.getSize(size);
		if (renderer.autoClear) renderer.clear();
		renderer.setScissorTest(true);
		var xL, yL, widthL, heightL, xR, yR, widthR, heightR;
		var parallax = settings.zeroParallax;
		function setMultiplex(stereoEffect) {
			if (!fullScreenSettings || spatialMultiplexCur === spatialMultiplex) return false;
			spatialMultiplexCur = spatialMultiplex;
			if (stereoEffect.setControllerSpatialMultiplex) stereoEffect.setControllerSpatialMultiplex(spatialMultiplex);else if (stereoEffect.setSpatialMultiplex) stereoEffect.setSpatialMultiplex(spatialMultiplex);
			return true;
		}
		function setFullScreen(fullScreen, stereoEffect) {
			if (setMultiplex(stereoEffect)) fullScreenSettings.setFullScreen(fullScreen);
		}
		switch (spatialMultiplex) {
			case spatialMultiplexsIndexs.Mono:
				renderer.setScissor(0, 0, size.width, size.height);
				renderer.setViewport(0, 0, size.width, size.height);
				renderer.render(scene, camera);
				renderer.setScissorTest(false);
				if (options.canvasMenu) setMultiplex(this);else setFullScreen(true, this);
				return;
			case spatialMultiplexsIndexs.SbS:
				var _width = size.width / 2;
				xL = 0 + parallax;yL = 0;widthL = _width;heightL = size.height;
				xR = _width - parallax;yR = 0;widthR = _width;heightR = size.height;
				setFullScreen(false, this);
				break;
			case spatialMultiplexsIndexs.TaB:
				xL = 0 + parallax;yL = 0;widthL = size.width;heightL = size.height / 2;
				xR = 0 - parallax;yR = size.height / 2;widthR = size.width;heightR = size.height / 2;
				setFullScreen(false, this);
				break;
			default:
				console.error('THREE.StereoEffect.render: Invalid "Spatial  multiplex" parameter: ' + spatialMultiplex);
		}
		settings.stereo.update(camera);
		renderer.setScissor(xL, yL, widthL, heightL);
		renderer.setViewport(xL, yL, widthL, heightL);
		renderer.render(scene, settings.stereo.cameraL);
		renderer.setScissor(xR, yR, widthR, heightR);
		renderer.setViewport(xR, yR, widthR, heightR);
		renderer.render(scene, settings.stereo.cameraR);
		renderer.setScissorTest(false);
	};
	function getLang(params) {
		params = params || {};
		var _lang = {
			stereoEffects: 'Stereo effects',
			spatialMultiplexName: 'Spatial  multiplex',
			spatialMultiplexTitle: 'Choose a way to do spatial multiplex.',
			spatialMultiplexs: {
				'Mono': spatialMultiplexsIndexs.Mono,
				'Side by side': spatialMultiplexsIndexs.SbS,
				'Top and bottom': spatialMultiplexsIndexs.TaB
			},
			eyeSeparationName: 'Eye separation',
			eyeSeparationTitle: 'The distance between left and right cameras.',
			focus: 'Focus',
			focusTitle: 'Object distance.',
			zeroParallaxName: 'Zero parallax',
			zeroParallaxTitle: 'Distance to objects with zero parallax.',
			defaultButton: 'Default',
			defaultTitle: 'Restore default stereo effects settings.'
		};
		var _languageCode = params.getLanguageCode === undefined ? 'en'
		: params.getLanguageCode();
		switch (_languageCode) {
			case 'ru':
				_lang.stereoEffects = 'Стерео эффекты';
				_lang.spatialMultiplexName = 'Мультиплекс';
				_lang.spatialMultiplexTitle = 'Выберите способ создания пространственного мультиплексирования.';
				_lang.spatialMultiplexs = {
					'Моно': spatialMultiplexsIndexs.Mono,
					'Слева направо': spatialMultiplexsIndexs.SbS,
					'Сверху вниз': spatialMultiplexsIndexs.TaB
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
			default:
				if (params.lang === undefined || params.lang._languageCode != _languageCode) break;
				Object.keys(params.lang).forEach(function (key) {
					if (_lang[key] === undefined) return;
					_lang[key] = params.lang[key];
				});
		}
		return _lang;
	}
	this.gui = function () {
		var guiParams = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
		var gui = guiParams.folder || options.dat.gui;
		if (!gui || options.dat.stereoEffectsGui === false) return;
		var dat = guiParams.dat || three$1.dat;
		if (guiParams === undefined) guiParams = {};
		guiParams.scale = guiParams.scale || 1;
		var stereoEffect = options.dat.getCookieName('StereoEffect'),
		    _lang = getLang({ getLanguageCode: options.getLanguageCode, lang: options.lang });
		var optionsDefault = {
			spatialMultiplex: settings.spatialMultiplex,
			eyeSep: new THREE.StereoCamera().eyeSep / 10 * settings.far,
			focus: settings.focus,
			zeroParallax: 0
		};
		Object.freeze(optionsDefault);
		options.dat.cookie.getObject(stereoEffect, settings, optionsDefault);
		settings.spatialMultiplex = parseInt(settings.spatialMultiplex);
		if (this.setSpatialMultiplex) this.setSpatialMultiplex(settings.spatialMultiplex);
		function displayControllers(value) {
			var display = value == spatialMultiplexsIndexs.Mono ? 'none' : 'block';
			_fEyeSeparation.domElement.style.display = display;
			if (_controllerCameraFocus !== undefined) _controllerCameraFocus.__li.style.display = display;
			_controllerDefaultF.__li.style.display = display;
			_controllerZeroParallax.__li.style.display = display;
		}
		var _fStereoEffects = gui.addFolder(_lang.stereoEffects);
		var _controllerSpatialMultiplex = _fStereoEffects.add(settings, 'spatialMultiplex', _lang.spatialMultiplexs).onChange(function (value) {
			value = parseInt(value);
			displayControllers(value);
			setObject(stereoEffect);
			if (guiParams.onChangeMode) guiParams.onChangeMode(value);
			if (menuItemStereoEffect) menuItemStereoEffect.select(value);
		});
		dat.controllerNameAndTitle(_controllerSpatialMultiplex, _lang.spatialMultiplexName, _lang.spatialMultiplexTitle);
		this.setControllerSpatialMultiplex = function (index) {
			saveToCookie = false;
			_controllerSpatialMultiplex.setValue(index);
			saveToCookie = true;
		};
		var _fEyeSeparation = _fStereoEffects.addFolder(_lang.eyeSeparationName);
		dat.folderNameAndTitle(_fEyeSeparation, _lang.eyeSeparationName, _lang.eyeSeparationTitle);
		_fEyeSeparation.add(new PositionController(function (shift) {
			settings.eyeSep += shift;
			_controllerEyeSep.setValue(settings.eyeSep);
		}, { settings: { offset: 0.01 }, min: 0.0001, max: 0.01, step: 0.0001 }));
		var _controllerEyeSep = dat.controllerZeroStep(_fEyeSeparation, settings.stereo, 'eyeSep', function (value) {
			settings.eyeSep = value;
			setObject(stereoEffect);
		});
		dat.controllerNameAndTitle(_controllerEyeSep, _lang.eyeSeparationName, _lang.eyeSeparationTitle);
		if (settings.camera !== undefined) settings.camera.focus = settings.focus;
		var _controllerCameraFocus;
		if (settings.camera) {
			_controllerCameraFocus = _fStereoEffects.add(settings.camera, 'focus', optionsDefault.focus / 10, optionsDefault.focus * 2, optionsDefault.focus / 1000).onChange(function (value) {
				settings.focus = value;
				setObject(stereoEffect);
			});
			dat.controllerNameAndTitle(_controllerCameraFocus, _lang.focus, _lang.focusTitle);
		}
		var _minMax = (60 - 400 / 9) * guiParams.scale + 400 / 9;
		var _controllerZeroParallax = _fStereoEffects.add(settings, 'zeroParallax', -_minMax, _minMax).onChange(function (value) {
			settings.zeroParallax = value;
			setObject(stereoEffect);
		});
		dat.controllerNameAndTitle(_controllerZeroParallax, _lang.zeroParallaxName, _lang.zeroParallaxTitle);
		var _controllerDefaultF = _fStereoEffects.add({
			defaultF: function defaultF(value) {
				settings.stereo.eyeSep = optionsDefault.eyeSep;
				_controllerEyeSep.setValue(settings.stereo.eyeSep);
				if (settings.camera) {
					settings.camera.focus = optionsDefault.focus;
					_controllerCameraFocus.setValue(settings.camera.focus);
				}
				settings.zeroParallax = optionsDefault.zeroParallax;
				_controllerZeroParallax.setValue(settings.zeroParallax);
			}
		}, 'defaultF');
		dat.controllerNameAndTitle(_controllerDefaultF, _lang.defaultButton, _lang.defaultTitle);
		displayControllers(settings.spatialMultiplex);
		var saveToCookie = true;
		function setObject(name) {
			if (!saveToCookie) return;
			var object = {};
			Object.keys(optionsDefault).forEach(function (key) {
				object[key] = settings[key];
			});
			options.dat.cookie.setObject(name, object);
		}
	};
	var _canvasMenu, menuItemStereoEffect;
	this.createCanvasMenuItem = function (canvasMenu, params) {
		_canvasMenu = canvasMenu;
		params = params || {};
		var _lang = getLang({ getLanguageCode: params.getLanguageCode, lang: params.lang }),
		    spatialMultiplexs = Object.keys(_lang.spatialMultiplexs);
		menuItemStereoEffect = {
			name: '⚭',
			title: _lang.stereoEffects,
			id: 'menuButtonStereoEffects',
			drop: 'up',
			items: [{
				name: spatialMultiplexs[spatialMultiplexsIndexs.Mono],
				id: 'menuButtonStereoEffectsMono',
				radio: true,
				checked: settings.spatialMultiplex === spatialMultiplexsIndexs.Mono,
				spatialMultiplex: spatialMultiplexsIndexs.Mono,
				onclick: function onclick(event) {
					settings.spatialMultiplex = spatialMultiplexsIndexs.Mono;
				}
			}, {
				name: spatialMultiplexs[spatialMultiplexsIndexs.SbS],
				id: 'menuButtonStereoEffectsSbS',
				radio: true,
				checked: settings.spatialMultiplex === spatialMultiplexsIndexs.SbS,
				spatialMultiplex: spatialMultiplexsIndexs.SbS,
				onclick: function onclick(event) {
					settings.spatialMultiplex = spatialMultiplexsIndexs.SbS;
				}
			}, {
				name: spatialMultiplexs[spatialMultiplexsIndexs.TaB],
				id: 'menuButtonStereoEffectsTaB',
				radio: true,
				checked: settings.spatialMultiplex === spatialMultiplexsIndexs.TaB,
				spatialMultiplex: spatialMultiplexsIndexs.TaB,
				onclick: function onclick(event) {
					settings.spatialMultiplex = spatialMultiplexsIndexs.TaB;
				}
			}]
		};
		menuItemStereoEffect.select = function (value) {
			menuItemStereoEffect.items.forEach(function (item) {
				if (item.spatialMultiplex === value) {
					if (!item.checked) item.elName.onclick({ target: item.elName });
				}
			});
		};
		this.setSpatialMultiplex = function (index) {
			menuItemStereoEffect.select(index);
		};
		canvasMenu.menu.push(menuItemStereoEffect);
	};
};

StereoEffect.spatialMultiplexsIndexs = {
	Mono: 0,
	SbS: 1,
	TaB: 2
};
Object.freeze(StereoEffect.spatialMultiplexsIndexs);
var spatialMultiplexsIndexs = StereoEffect.spatialMultiplexsIndexs;
function assign$1() {
	var THREE = three$1.THREE;
	if (new THREE.Raycaster().setStereoEffect) return;
	Object.assign(THREE.Raycaster.prototype, {
		setStereoEffect: function setStereoEffect() {
			var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
			if (settings.stereoEffect === false) return;
			settings.raycasterEvents = settings.raycasterEvents === undefined ? true : settings.raycasterEvents;
			var camera = settings.camera,
			    renderer = settings.renderer;
			if (settings.raycasterEvents) {
				var _mouse = new THREE.Vector2();
				window.addEventListener('mousemove', function (event) {
					_mouse.x = event.clientX / window.innerWidth * 2 - 1;
					_mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
					raycaster.setFromCamera(_mouse, camera);
					raycaster.stereo.onDocumentMouseMove(event);
				}, false);
				window.addEventListener('pointerdown', function (event) {
					raycaster.stereo.onDocumentMouseDown(event);
				}, false);
			}
			var stereoEffect = settings.stereoEffect !== undefined ? settings.stereoEffect : typeof effect !== 'undefined' ? effect : new StereoEffect(renderer, settings.options),
			    raycaster = this,
			    mouseL = new THREE.Vector2(),
			    mouseR = new THREE.Vector2();
			var particles,
			mouse;
			function getMousePosition() {
				stereoEffect.getRendererSize().getMousePosition(mouse, event);
				function mousePosition(vectorName, b) {
					mouseL.copy(mouse);
					mouseR.copy(mouse);
					var a = 0.5;
					mouseL[vectorName] += a;
					mouseL[vectorName] *= 2;
					mouseR[vectorName] -= a;
					mouseR[vectorName] *= 2;
					var size = new THREE.Vector2();
					renderer.getSize(size);
					var zeroParallax = stereoEffect.settings.zeroParallax / size.x * b;
					mouseL.x -= zeroParallax;
					mouseR.x += zeroParallax;
				}
				switch (parseInt(stereoEffect.settings.spatialMultiplex)) {
					case spatialMultiplexsIndexs.Mono:
						return;
					case spatialMultiplexsIndexs.SbS:
						mousePosition('x', 4);
						break;
					case spatialMultiplexsIndexs.TaB:
						mousePosition('y', 2);
						break;
					default:
						console.error('THREE.Raycaster.setStereoEffect.getMousePosition: Invalid effect.settings.spatialMultiplex = ' + effect.settings.spatialMultiplex);
						return;
				}
			}
			function intersection(optionsIntersection) {
				if (mouse === undefined) return;
				optionsIntersection = optionsIntersection || settings;
				function isIntersection() {
					Options.raycaster.intersectionsInOut(particles, raycaster, renderer, mouse, settings);
				}
				if (parseInt(stereoEffect.settings.spatialMultiplex) !== spatialMultiplexsIndexs.Mono) {
					var mouseCur = mouse;
					mouse = mouseL;
					raycaster.setFromCamera(mouseL, camera);
					if (!isIntersection()) {
						mouse = mouseR;
						raycaster.setFromCamera(mouseR, camera);
						isIntersection();
					}
					mouse = mouseCur;
					return;
				}
				raycaster.setFromCamera(mouse, camera);
				isIntersection();
			}
			this.stereo = {
				onDocumentMouseMove: function onDocumentMouseMove(event) {
					if (particles === undefined) return;
					event.preventDefault();
					if (mouse === undefined) mouse = new THREE.Vector2();
					getMousePosition();
					intersection();
				},
				isAddedToParticles: function isAddedToParticles(particle) {
					if (!particles) return false;
					return particles.includes(particle);
				},
				addParticle: function addParticle(particle) {
					if (particles === undefined) particles = [];
					if (this.isAddedToParticles(particle)) {
						console.error('Duplicate particle "' + particle.name + '"');
						return;
					}
					particles.push(particle);
				},
				addParticles: function addParticles(newParticles) {
					if (particles !== undefined) {
						if (!Array.isArray(particles)) {
							var particlesCur = particles;
							particles = [];
							particles.push(particlesCur);
						}
						particles.push(newParticles);
						return;
					}
					particles = newParticles;
				},
				removeParticle: function removeParticle(particle) {
					for (var i = 0; i < particles.length; i++) {
						if (Object.is(particle, particles[i])) {
							particles.splice(i, 1);
							break;
						}
					}
				},
				removeParticles: function removeParticles() {
					particles = undefined;
				},
				getPosition: function getPosition(intersection) {
					var attributesPosition = intersection.object.geometry.attributes.position;
					var position = attributesPosition.itemSize >= 4 ? new THREE.Vector4(0, 0, 0, 0) : new THREE.Vector3();
					if (intersection.index !== undefined) {
						position.fromArray(attributesPosition.array, intersection.index * attributesPosition.itemSize);
						position.multiply(intersection.object.scale);
						position.add(intersection.object.position);
					} else position = intersection.object.position;
					return position;
				}
			};
		}
	});
}
StereoEffect.assign = assign$1;
var lang$1 = {
	mesh: 'Mesh',
	pointName: 'Point Name',
	color: 'Сolor',
	opacity: 'Opacity'
};
switch (getLanguageCode()) {
	case 'ru':
		lang$1.mesh = '3D объект';
		lang$1.pointName = 'Имя точки';
		lang$1.color = 'Цвет';
		lang$1.opacity = 'Непрозрачность';
		break;
}
StereoEffect.getTextIntersection = function (intersection, options) {
	var spriteText = Options.findSpriteTextIntersection(options.spriteOptions.group);
	if (spriteText) return spriteText;
	var THREE = three$1.THREE;
	var position = getObjectPosition(intersection.object, intersection.index),
	    scales = options.scales || {},
	    isArrayFuncs = intersection.index !== undefined && intersection.object.userData.player !== undefined && intersection.object.userData.player.arrayFuncs !== undefined,
	    funcs = !isArrayFuncs ? undefined : intersection.object.userData.player.arrayFuncs,
	    func = funcs === undefined || typeof funcs === "function" ? undefined : funcs[intersection.index],
	    pointName = isArrayFuncs && func ? func.name : undefined,
	    color = !isArrayFuncs || func === undefined ? undefined : Array.isArray(func.w) ? Player.execFunc(func, 'w', group.userData.t, options) :
	func.w;
	if (intersection.object.userData.onIntersection) intersection.object.userData.onIntersection();
	var boXYZ = !scales.x && !scales.y && !scales.z;
	options.spriteOptions.name = Options.findSpriteTextIntersection.spriteTextIntersectionName;
	options.spriteOptions.name = Options.findSpriteTextIntersection.spriteTextIntersectionName;
	return new SpriteText(
	lang$1.mesh + ': ' + (intersection.object.name === '' ? intersection.object.type : intersection.object.name) + (pointName === undefined ? '' : '\n' + lang$1.pointName + ': ' + pointName) + (!boXYZ && !scales.x || scales.x && !scales.x.isAxis() ? '' : '\n' + (scales.x && scales.x.name || scales.x.name === 0 ? scales.x.name : 'X') + ': ' + position.x) + (!boXYZ && !scales.y || scales.y && !scales.y.isAxis() ? '' : '\n' + (scales.y && scales.y.name || scales.y.name === 0 ? scales.y.name : 'Y') + ': ' + position.y) + (!boXYZ && !scales.z || scales.z && !scales.z.isAxis() ? '' : '\n' + (scales.z && scales.z.name || scales.z.name === 0 ? scales.z.name : 'Z') + ': ' + position.z) + (
	!isArrayFuncs ? '' : funcs[intersection.index] instanceof THREE.Vector4 || funcs[intersection.index] instanceof THREE.Vector3 || typeof funcs === "function" ? color instanceof THREE.Color ? '\n' + lang$1.color + ': ' + new THREE.Color(color.r, color.g, color.b).getHexString() : position.w !== undefined ? '\n' + (scales.w && scales.w.name ? scales.w.name : 'W') + ': ' + position.w : '' : '') + (
	intersection.object.geometry.attributes.ca === undefined || intersection.object.geometry.attributes.ca.itemSize < 4 ? '' : '\n' + lang$1.opacity + ': ' + new THREE.Vector4().fromArray(intersection.object.geometry.attributes.ca.array, intersection.index * intersection.object.geometry.attributes.ca.itemSize).w) + (
	intersection.object.userData.raycaster && intersection.object.userData.raycaster.text ? intersection.object.userData.raycaster.text(intersection                                                    ) : ''), intersection.pointSpriteText ? intersection.pointSpriteText : intersection.point,
	options.spriteOptions);
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
var Options =
function Options(options) {
			var _Object$definePropert;
			classCallCheck(this, Options);
			var _this = this;
			options = options || {};
			if (options.boOptions) return options;
			var lang;
			if (options.a === undefined) options.a = 1;
			if (options.b === undefined) options.b = 0;
			this.setW = function (optionsCur) {
						optionsCur = optionsCur || options;
						optionsCur.scales = optionsCur.scales || {};
						var scale = optionsCur.scales.w;
						if (!optionsCur.palette) _this.setPalette();
			};
			options.scales = options.scales || {};
			var boCreateScale = !options.scales.x && !options.scales.y && !options.scales.z;
			function setScale(axisName) {
						if (boCreateScale) options.scales[axisName] = options.scales[axisName] || {};
						if (!options.scales[axisName]) return;
			}
			setScale('x');
			setScale('y');
			setScale('z');
			options.point = options.point || {};
			if (options.point.size === undefined) options.point.size = 5.0;
			options.point.sizePointsMaterial = options.point.sizePointsMaterial || 100.0;
			this.setPalette = function (palette) {
						if (palette) options.palette = palette;else if (!options.palette) options.palette = new ColorPicker$1.palette();
			};
			this.createOrbitControls = function (camera, renderer, scene) {
						if (options.orbitControls === false) return;
						var settings = options.orbitControls || {};
						_this.orbitControls = new three$1.OrbitControls(camera, renderer.domElement);
						if (settings.enableRotate !== undefined) _this.orbitControls.enableRotate = settings.enableRotate;
						_this.orbitControls.target.set(scene.position.x * 2, scene.position.y * 2, scene.position.z * 2);
						_this.orbitControls.saveState();
						_this.orbitControls.update();
						if (_this.frustumPoints) _this.orbitControls.addEventListener('change', function () {
									_this.frustumPoints.onChangeControls();
						});
			};
			this.restoreSceneController = function (camera, scene) {
						if (!three$1.dat || options.dat === false)
									return;
						var lang = {
									defaultButton: 'Default',
									defaultTitle: 'Reset player and restore camera position.'
						};
						switch (this.getLanguageCode()) {
									case 'ru':
												lang.defaultButton = 'Восстановить';
												lang.defaultTitle = 'Восстановить положение камеры и проигрывателя.';
												break;
						}
						var scenePosition = new three$1.THREE.Vector3().copy(scene.position),
						    cameraPosition = new three$1.THREE.Vector3().copy(camera.position);
						three$1.dat.controllerNameAndTitle(options.dat.gui.add({
									defaultF: function defaultF(value) {
												if (options.player) options.player.selectScene(options.playerOptions.selectSceneIndex);
												camera.position.copy(cameraPosition);
												scene.position.copy(scenePosition);
												if (options.orbitControls !== false) {
															options.orbitControls.target = new three$1.THREE.Vector3();
															options.orbitControls.object.position.copy(camera.position);
															options.orbitControls.update();
												}
									}
						}, 'defaultF'), lang.defaultButton, lang.defaultTitle);
			};
			Object.defineProperties(this, (_Object$definePropert = {
						playerOptions: {
									get: function get$$1() {
												options.playerOptions = options.playerOptions || {};
												var playerOptions = options.playerOptions;
												playerOptions.min = playerOptions.min || 0;
												if (playerOptions.max === Infinity) playerOptions.max = null;
												if (playerOptions.max !== null) {
															if (playerOptions.max === undefined) playerOptions.max = 1;
															playerOptions.marks = playerOptions.marks || 10;
												} else playerOptions.marks = null;
												if (playerOptions.max === null) playerOptions.dt = playerOptions.dt || 0.1;else playerOptions.dt = (playerOptions.max - playerOptions.min) / (playerOptions.marks - 1);
												playerOptions.repeat = playerOptions.repeat || false;
												playerOptions.interval = playerOptions.interval || 1;
												playerOptions.zoomMultiplier = playerOptions.zoomMultiplier || 1.1;
												playerOptions.offset = playerOptions.offset || 0.1;
												playerOptions.name = playerOptions.name || '';
												if (!playerOptions.cameraTarget) {
															var cameraTarget = new Player$1.cameraTarget();
															Object.defineProperties(playerOptions, {
																		cameraTarget: {
																					get: function get$$1() {
																								return cameraTarget;
																					}
																		}
															});
												}
												return options.playerOptions;
									},
									set: function set$$1(playerOptions) {
												options.playerOptions = playerOptions;
									}
						},
						a: {
									get: function get$$1() {
												return options.a;
									}
						},
						b: {
									get: function get$$1() {
												return options.b;
									}
						},
						dat: {
									get: function get$$1() {
												var Dat =
												function Dat(dat) {
															classCallCheck(this, Dat);
															dat = dat || {};
															if (dat.boDat) return dat;
															function guiParent() {
																		var elMyGuiContainer = document.createElement('div');
																		dat.parent.appendChild(elMyGuiContainer);
																		elMyGuiContainer.appendChild(dat.gui.domElement);
																		elMyGuiContainer.style.position = 'absolute';
																		elMyGuiContainer.style.top = '0px';
																		elMyGuiContainer.style.right = '0px';
															}
															Object.defineProperties(this, {
																		boDat: {
																					get: function get$$1() {
																								return true;
																					}
																		},
																		dat: {
																					get: function get$$1() {
																								console.warn('get dat depreacated. Use three.dat = dat.');
																								return three$1.dat;
																					},
																					set: function set$$1(dat) {
																								console.warn('Set dat depreacated. Use three.dat = dat.');
																								if (dat.dat && dat.dat.constructor.name === dat.constructor.name && dat.dat.constructor.name !== 'Object') console.error('duplicate dat.');
																								dat.dat = dat;
																					}
																		},
																		cookieName: {
																					get: function get$$1() {
																								return dat.cookieName;
																					}
																		},
																		gui: {
																					get: function get$$1() {
																								if (!dat.gui && three$1.dat) {
																											dat.gui = new three$1.dat.GUI();
																											if (options.dat.parent) {
																														guiParent();
																											}
																								}
																								return dat.gui;
																					}
																		},
																		cookie: {
																					get: function get$$1() {
																								return dat.cookie;
																					},
																					set: function set$$1(cookie$$1) {
																								dat.cookie = cookie$$1;
																					}
																		},
																		guiSelectPoint: {
																					get: function get$$1() {
																								return dat.guiSelectPoint;
																					},
																					set: function set$$1(guiSelectPoint) {
																								dat.guiSelectPoint = guiSelectPoint;
																					}
																		},
																		cameraGui: {
																					get: function get$$1() {
																								return dat.cameraGui;
																					},
																					set: function set$$1(cameraGui) {
																								dat.cameraGui = cameraGui;
																					}
																		},
																		playerGui: {
																					get: function get$$1() {
																								return dat.playerGui;
																					}
																		},
																		orbitControlsGui: {
																					get: function get$$1() {
																								return dat.orbitControlsGui;
																					}
																		},
																		axesHelperGui: {
																					get: function get$$1() {
																								return dat.axesHelperGui;
																					}
																		},
																		playController: {
																					get: function get$$1() {
																								return dat.playController;
																					}
																		},
																		stereoEffectsGui: {
																					get: function get$$1() {
																								return dat.playController;
																					}
																		},
																		moveScene: {
																					get: function get$$1() {
																								return dat.moveScene;
																					}
																		},
																		spriteTextGui: {
																					get: function get$$1() {
																								return dat.spriteTextGui;
																					}
																		},
																		folderPoint: {
																					get: function get$$1() {
																								return dat.folderPoint;
																					},
																					set: function set$$1(folderPoint) {
																								dat.folderPoint = folderPoint;
																					}
																		},
																		pointLightGui: {
																					get: function get$$1() {
																								return dat.pointLightGui;
																					}
																		},
																		parent: {
																					get: function get$$1() {
																								return dat.parent;
																					}
																		}
															});
															for (var propertyName in dat) {
																		if (this[propertyName] === undefined) console.error('Dat: dat.' + propertyName + ' key is hidden');
															}
												};
												if (options.dat === false) return options.dat;
												options.dat = new Dat(options.dat);
												if (options.dat.gui) {
															setTimeout(function () {
																		var className = options.dat.gui.domElement.className;
																		var guiCount = 0;
																		options.dat.gui.domElement.parentElement.childNodes.forEach(function (node) {
																					if (node.className === className) guiCount++;
																		});
																		if (guiCount > 1) console.error('Options: duplicate dat.GUI');
															}, 0);
															options.dat.gui.domElement.addEventListener('mouseenter', function (event) {
																		options.dat.mouseenter = true;
															});
															options.dat.gui.domElement.addEventListener('mouseleave', function (event) {
																		options.dat.mouseenter = false;
															});
												}
												if (options.dat.cookie === false) options.dat.cookie = new cookie.defaultCookie();else if (options.dat.cookie === undefined) options.dat.cookie = cookie;
												options.dat.getCookieName = function () {
															var cookieName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
															var name = options.dat.cookieName || (options.elContainer ? _typeof(options.elContainer) === "object" ? options.elContainer.id : typeof options.elContainer === "string" ? options.elContainer : '' : '');
															return cookieName + (cookieName !== '' && name !== '' ? '_' : '') + name;
												};
												return options.dat;
									},
									set: function set$$1(dat) {
												options.dat = dat;
									}
						},
						getLanguageCode: {
									get: function get$$1() {
												if (typeof options.getLanguageCode === "string") return function () {
															return options.getLanguageCode;
												};
												return options.getLanguageCode || getLanguageCode;
									}
						},
						scales: {
									get: function get$$1() {
												var Scales =
												function Scales(scales) {
															classCallCheck(this, Scales);
															var Scale =
															function Scale(scales, axisName) {
																		classCallCheck(this, Scale);
																		var scale = scales[axisName];
																		this.isAxis = function () {
																					if (!scales || !scales.x && !scales.y && !scales.z || scale) return true;
																					return false;
																		};
																		var setScale = function setScale(callBack) {
																					if (!scale) {
																								scales[axisName] = {};
																								scale = scales[axisName];
																					}
																					callBack();
																					scale.step = Math.abs(options.scales.w.min - options.scales.w.max) / 100;
																					if (options.guiSelectPoint) options.guiSelectPoint.setAxisControl('w', scale);
																		};
																		Object.defineProperties(this, {
																					boScale: {
																								get: function get$$1() {
																											return true;
																								}
																					},
																					min: {
																								get: function get$$1() {
																											if (!scale || !scale.min) return axisName === 'w' ? 0 : -1;
																											return scale.min;
																								},
																								set: function set$$1(min) {
																											setScale(function () {
																														scale.min = min;
																											});
																								}
																					},
																					max: {
																								get: function get$$1() {
																											if (!scale || !scale.max) return axisName === 'w' ? new three$1.THREE.Vector4().w : 1;
																											return scale.max;
																								},
																								set: function set$$1(max) {
																											setScale(function () {
																														scale.max = max;
																											});
																								}
																					},
																					name: {
																								get: function get$$1() {
																											if (!scale || scale.name === undefined) return axisName;
																											return scale.name;
																								},
																								set: function set$$1(name) {
																											if (scale) {
																														scale.name = name;
																														if (options.guiSelectPoint) options.guiSelectPoint.setAxisName(axisName, name);
																											}
																								}
																					},
																					marks: {
																								get: function get$$1() {
																											if (!scale) return undefined;
																											if (!scale.marks) scale.marks = 3;
																											return scale.marks;
																								}
																					}
																		});
																		for (var propertyName in scale) {
																					if (this[propertyName] === undefined) console.error('Options.Scales: scale.' + propertyName + ' key is hidden');
																		}
															};
															var scalesObject = {
																		x: new Scale(options.scales, 'x'),
																		y: new Scale(options.scales, 'y'),
																		z: new Scale(options.scales, 'z'),
																		w: new Scale(options.scales, 'w')
															};
															Object.defineProperties(this, {
																		boScales: {
																					get: function get$$1() {
																								return true;
																					}
																		},
																		x: {
																					get: function get$$1() {
																								return scalesObject.x;
																					},
																					set: function set$$1(x) {
																								if (x === undefined) {
																											delete scales.x;
																											delete scalesObject.x;
																											scalesObject.x = new Scale(scales, 'x');
																								} else scales.x = x;
																								if (options.guiSelectPoint) options.guiSelectPoint.updateScale('x');
																					}
																		},
																		y: {
																					get: function get$$1() {
																								return scalesObject.y;
																					},
																					set: function set$$1(y) {
																								if (y === undefined) {
																											delete scales.y;
																											delete scalesObject.y;
																											scalesObject.y = new Scale(scales, 'y');
																								} else scales.y = y;
																								if (options.guiSelectPoint) options.guiSelectPoint.updateScale('y');
																					}
																		},
																		z: {
																					get: function get$$1() {
																								return scalesObject.z;
																					},
																					set: function set$$1(z) {
																								if (z === undefined) {
																											delete scales.z;
																											delete scalesObject.z;
																											scalesObject.z = new Scale(scales, 'z');
																								} else scales.z = z;
																								if (options.guiSelectPoint) options.guiSelectPoint.updateScale('z');
																					}
																		},
																		w: {
																					get: function get$$1() {
																								return scalesObject.w;
																					},
																					set: function set$$1(w) {
																								scales.w = w;
																					}
																		},
																		setW: {
																					get: function get$$1() {
																								return _this.setW;
																					}
																		},
																		display: {
																					get: function get$$1() {
																								if (scales.display === undefined) scales.display = true;
																								return scales.display;
																					},
																					set: function set$$1(display) {
																								scales.display = display;
																					}
																		},
																		text: {
																					get: function get$$1() {
																								if (scales.text === undefined) scales.text = {};
																								return scales.text;
																					},
																					set: function set$$1(text) {
																								scales.text = text;
																					}
																		},
																		posAxesIntersection: {
																					get: function get$$1() {
																								return scales.posAxesIntersection;
																					},
																					set: function set$$1(posAxesIntersection) {
																								scales.posAxesIntersection = posAxesIntersection;
																					}
																		}
															});
															for (var propertyName in scales) {
																		if (this[propertyName] === undefined) console.error('Options: scales.' + propertyName + ' key is hidden');
															}
												};
												if (!options.scales.boScales) options.scales = new Scales(options.scales);
												return options.scales;
									},
									set: function set$$1(scales) {
												options.scales = scales;
									}
						},
						palette: {
									get: function get$$1() {
												if (options.palette === undefined) options.palette = true;
												switch (_typeof(options.palette)) {
															case 'number':
																		options.palette = new ColorPicker$1.palette({ palette: options.palette });
																		break;
															case 'boolean':
																		if (options.palette) options.palette = new ColorPicker$1.palette();
																		break;
															case 'string':
																		var color = new three$1.THREE.Color(options.palette);
																		options.palette = new ColorPicker$1.palette({ palette: [{ percent: 0, r: color.r * 255, g: color.g * 255, b: color.b * 255 }] });
																		break;
															default:
																		{
																					if (Array.isArray(options.palette)) options.palette = new ColorPicker$1.palette({ palette: options.palette });
																					else if (!options.palette.isPalette()) console.error('MyThree: invalid typeof options.palette: ' + _typeof(options.palette));
																		}
												}
												return options.palette;
									}
						},
						boOptions: {
									get: function get$$1() {
												return true;
									}
						},
						point: {
									get: function get$$1() {
												return {
															get size() {
																		return options.point.size;
															},
															set size(size) {
																		if (options.point.size === size) return;
																		options.point.size = size;
																		if (options.dat && options.dat.folderPoint) options.dat.folderPoint.size.setValue(size);
															},
															get sizePointsMaterial() {
																		return options.point.sizePointsMaterial;
															},
															set sizePointsMaterial(sizePointsMaterial) {
																		options.point.sizePointsMaterial = sizePointsMaterial;
															}
												};
									}
						},
						spriteText: {
									get: function get$$1() {
												if (options.spriteText) return options.spriteText;
												return {};
									}
						},
						raycaster: {
									get: function get$$1() {
												if (options.raycaster) return options.raycaster;
									},
									set: function set$$1(raycaster) {
												options.raycaster = raycaster;
									}
						},
						camera: {
									get: function get$$1() {
												options.camera = options.camera || {};
												if (!options.camera.position) options.camera.position = new three$1.THREE.Vector3(0.4, 0.4, 2);
												if (!options.camera.scale) options.camera.scale = new three$1.THREE.Vector3(1, 1, 1);
												return options.camera;
									},
									set: function set$$1(camera) {
												options.camera = camera;
									}
						},
						cameraTarget: {
									get: function get$$1() {
												return options.cameraTarget;
									}
						},
						elContainer: {
									get: function get$$1() {
												return options.elContainer;
									}
						},
						canvasMenu: {
									get: function get$$1() {
												return options.canvasMenu;
									},
									set: function set$$1(canvasMenu) {
												if (options.canvasMenu && options.canvasMenu !== true && options.canvasMenu !== false) console.warn('Duplicate canvasMenu');
												options.canvasMenu = canvasMenu;
									}
						},
						canvas: {
									get: function get$$1() {
												if (options.canvas) return options.canvas;
												return { fullScreen: true };
									}
						},
						frustumPoints: {
									get: function get$$1() {
												return options.frustumPoints;
									},
									set: function set$$1(frustumPoints) {
												if (options.frustumPoints && options.frustumPoints.constructor.name === frustumPoints.constructor.name && options.frustumPoints.constructor.name !== 'Object') console.error('duplicate frustumPoints.');
												options.frustumPoints = frustumPoints;
									}
						},
						stereoEffect: {
									get: function get$$1() {
												return options.stereoEffect;
									},
									set: function set$$1(stereoEffect) {
												if (options.stereoEffect && options.stereoEffect.constructor.name === stereoEffect.constructor.name && options.stereoEffect.constructor.name !== 'Object') console.error('duplicate stereoEffect.');
												options.stereoEffect = stereoEffect;
									}
						},
						player: {
									get: function get$$1() {
												return options.player;
									},
									set: function set$$1(player) {
												if (options.player) console.error('duplicate player.');
												options.player = player;
									}
						},
						time: {
									get: function get$$1() {
												if (options.player) return options.player.getTime();
												return 0;
									}
						},
						axesHelper: {
									get: function get$$1() {
												return options.axesHelper;
									},
									set: function set$$1(axesHelper) {
												if (options.axesHelper) console.error('duplicate axesHelper.');
												options.axesHelper = axesHelper;
									}
						}
			}, defineProperty(_Object$definePropert, 'canvasMenu', {
						get: function get$$1() {
									return options.canvasMenu;
						},
						set: function set$$1(canvasMenu) {
									if (options.canvasMenu) console.error('duplicate canvasMenu.');
									options.canvasMenu = canvasMenu;
						}
			}), defineProperty(_Object$definePropert, 'orbitControls', {
						get: function get$$1() {
									return options.orbitControls;
						},
						set: function set$$1(orbitControls) {
									if (options.orbitControls && options.orbitControls.constructor.name === orbitControls.constructor.name && options.orbitControls.constructor.name !== 'Object') console.error('duplicate orbitControls.');
									options.orbitControls = orbitControls;
						}
			}), defineProperty(_Object$definePropert, 'scale', {
						get: function get$$1() {
									return 1;
						}
			}), defineProperty(_Object$definePropert, 'pointLight', {
						get: function get$$1() {
									return options.pointLight;
						}
			}), defineProperty(_Object$definePropert, 'cameraTarget', {
						get: function get$$1() {
									return options.cameraTarget;
						}
			}), defineProperty(_Object$definePropert, 'eventListeners', {
						get: function get$$1() {
									if (options.eventListeners) return options.eventListeners;
						},
						set: function set$$1(eventListeners) {
									if (options.eventListeners) console.error('duplicate eventListeners.');
									options.eventListeners = eventListeners;
						}
			}), defineProperty(_Object$definePropert, 'guiSelectPoint', {
						get: function get$$1() {
									return options.guiSelectPoint;
						},
						set: function set$$1(guiSelectPoint) {
									if (options.guiSelectPoint && guiSelectPoint != undefined) console.error('duplicate guiSelectPoint.');
									options.guiSelectPoint = guiSelectPoint;
						}
			}), defineProperty(_Object$definePropert, 'controllers', {
						get: function get$$1() {
									var Controllers =
									function Controllers(controllers) {
												classCallCheck(this, Controllers);
												controllers = controllers || {};
												Object.defineProperties(this, {
															boControllers: {
																		get: function get$$1() {
																					return true;
																		}
															},
															t: {
																		get: function get$$1() {
																					if (controllers.t === null) console.error('options.controllers.t = ' + controllers.t);
																					var elTime = document.getElementById('time');
																					if (!controllers.t) {
																								if (!elTime) return;
																								controllers.t = { elName: document.getElementById('tName') };
																					}
																					if (!controllers.t.controller && elTime) controllers.t.controller = elTime;
																					if (controllers.t) {
																								createController(controllers.t, 't', function () {
																											return options.playerOptions && options.playerOptions.name ? options.playerOptions.name : 't';
																								}, {
																											onchange: function onchange(event) {
																														if (!options.player) {
																																	console.error('options.controllers.t.onchange: create Player instance first. ' + controllers.t.value);
																																	return;
																														}
																														if (options.player.setTime(controllers.t.controller.value) === false) {
																																	alert(lang.timeAlert + controllers.t.controller.value);
																																	controllers.t.controller.focus();
																														}
																											}
																								});
																								if (typeof lang !== 'undefined' && controllers.t.controller.title === '') controllers.t.controller.title = lang.controllerTTitle;
																					}
																					return controllers.t;
																		}
															},
															player: {
																		get: function get$$1() {
																					return controllers.player;
																		}
															}
												});
												for (var propertyName in controllers) {
															if (this[propertyName] === undefined) console.error('Controllers: controllers.' + propertyName + ' key is hidden');
												}
									};
									if (boCreateControllers === undefined) {
												boCreateControllers = true;
												var time = document.getElementById('time'),
												    prev = document.getElementById('prev'),
												    play = document.getElementById('play'),
												    next = document.getElementById('next'),
												    boPlayer = prev || play || next ? true : false,
												    boControllers = time || boPlayer ? true : false;
												if (!options.controllers && boControllers) {
															options.controllers = { t: {} };
															if (time) options.controllers.t.controller = time;
												}
												if (options.controllers) {
															if (!options.controllers.player && boPlayer) options.controllers.player = {};
															if (options.controllers.player) {
																		if (!options.controllers.player.buttonPrev && prev) options.controllers.player.buttonPrev = prev;
																		if (!options.controllers.player.buttonPlay && play) options.controllers.player.buttonPlay = play;
																		if (!options.controllers.player.buttonNext && next) options.controllers.player.buttonNext = next;
															}
												}
									}
									if (options.controllers && !options.controllers.boControllers) options.controllers = new Controllers(options.controllers);
									return options.controllers;
						}
			}), defineProperty(_Object$definePropert, 'title', {
						get: function get$$1() {
									return options.title;
						}
			}), _Object$definePropert));
			for (var propertyName in options) {
						if (this[propertyName] === undefined) console.error('Options: options.' + propertyName + ' key is hidden');
			}
			this.playerOptions.cameraTarget.init(this.cameraTarget, this, false);
			lang = {
						timeAlert: 'Invalid time fromat: ',
						controllerTTitle: 'Current time.'
			};
			switch (this.getLanguageCode()) {
						case 'ru':
									lang.timeAlert = 'Неправильный формат времени: ';
									lang.controllerTTitle = 'Текущее время.';
									break;
						default:
									if (options.lang === undefined || options.lang.languageCode != languageCode) break;
									Object.keys(options.lang).forEach(function (key) {
												if (lang[key] === undefined) return;
												lang[key] = options.lang[key];
									});
			}
			if (!three$1.options) three$1.options = this;
};
Options.findSpriteTextIntersection = function (scene) {
			var spriteTextIntersection;
			scene.children.forEach(function (item) {
						if (item.type === "Sprite" && item.name === Options.findSpriteTextIntersection.spriteTextIntersectionName) {
									spriteTextIntersection = item;
									return;
						}
			});
			return spriteTextIntersection;
};
Options.findSpriteTextIntersection.spriteTextIntersectionName = 'spriteTextIntersection';
var Raycaster =
function Raycaster() {
			classCallCheck(this, Raycaster);
			var cursor;
			this.onIntersection = function (intersection, options, scene, camera, renderer) {
						var canvas = renderer.domElement;
						if (intersection.object.userData.isInfo !== undefined && !intersection.object.userData.isInfo()) return;
						var spriteTextIntersection = Options.findSpriteTextIntersection(scene);
						if (spriteTextIntersection && (!intersection.pointSpriteText || intersection.object.userData.raycaster && intersection.object.userData.raycaster.text)) {
									scene.remove(spriteTextIntersection);
									spriteTextIntersection = undefined;
						}
						if (spriteTextIntersection === undefined) {
									options = new Options(options);
									var rect = options.spriteText.rect ? JSON.parse(JSON.stringify(options.spriteText.rect)) : {};
									rect.displayRect = true;
									rect.backgroundColor = 'rgba(0, 0, 0, 1)';
									spriteTextIntersection = StereoEffect.getTextIntersection(intersection, {
												scales: options.scales,
												spriteOptions: {
															textHeight: options.spriteText.textHeight,
															fontColor: options.spriteText.fontColor,
															rect: rect,
															group: scene,
															center: {
																		camera: camera,
																		canvas: canvas
															}
												}
									});
									spriteTextIntersection.scale.divide(scene.scale);
									scene.add(spriteTextIntersection);
									if (cursor === undefined) cursor = renderer.domElement.style.cursor;
									renderer.domElement.style.cursor = 'pointer';
						} else if (intersection.pointSpriteText) spriteTextIntersection.position.copy(intersection.pointSpriteText);
			};
			this.onIntersectionOut = function (scene, renderer) {
						var detected = false;
						do {
									var spriteTextIntersection = Options.findSpriteTextIntersection(scene);
									if (spriteTextIntersection !== undefined) {
												scene.remove(spriteTextIntersection);
												if (detected) console.error('Duplicate spriteTextIntersection');
												detected = true;
									}
						} while (spriteTextIntersection !== undefined);
						renderer.domElement.style.cursor = cursor;
			};
			this.onMouseDown = function (intersection, options) {
						if (intersection.object.userData.isInfo !== undefined && !intersection.object.userData.isInfo()) return;
						if (options.guiSelectPoint) options.guiSelectPoint.select(intersection);else {
									if (intersection.object.userData.onMouseDown) intersection.object.userData.onMouseDown(intersection);
									if (options.axesHelper) options.axesHelper.exposePosition(intersection);
						}
			};
			var intersectedObjects = [];
			var intersects;
			this.intersectionsInOut = function (particles, raycaster, renderer, mouse) {
						var settings = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
						function getIntersects() {
									if (particles === undefined) return;
									intersects = Array.isArray(particles) ? raycaster.intersectObjects(particles) : raycaster.intersectObject(particles);
						}
						getIntersects();
						intersects.forEach(function (intersection) {
									var three = window.__myThree__.three;
									intersection.pointSpriteText = new three.THREE.Vector3();
									if (settings.options.stereoEffect && settings.options.stereoEffect.settings.spatialMultiplex === StereoEffect.spatialMultiplexsIndexs.Mono) raycaster.ray.at(three.options.camera.near + (three.options.camera.far - three.options.camera.near) / 1000, intersection.pointSpriteText);
									else intersection.pointSpriteText = intersection.point;
									var boDetected = false;
									intersectedObjects.forEach(function (intersectedObject) {
												if (intersectedObject.object === intersection.object) {
															boDetected = true;
															return;
												}
									});
									if (!boDetected) {
												intersectedObjects.push(intersection);
									}
									if (intersection && intersection.object.userData.raycaster && intersection.object.userData.raycaster.onIntersection) {
												intersection.object.userData.raycaster.onIntersection(intersection, mouse);
									} else {
												if (!settings.scene) console.error('THREE.Raycaster.setStereoEffect(): settings.scene = ' + settings.scene);else Options.raycaster.onIntersection(intersection, settings.options, settings.scene, settings.camera, renderer);
									}
						});
						intersectedObjects.forEach(function (intersectedObject) {
									var boDetected = false;
									intersects.forEach(function (intersection) {
												if (intersectedObject.object === intersection.object) boDetected = true;
									});
									if (!boDetected) {
												if (intersectedObject.object.userData.raycaster && intersectedObject.object.userData.raycaster.onIntersectionOut) intersectedObject.object.userData.raycaster.onIntersectionOut();else if (settings.scene) Options.raycaster.onIntersectionOut(settings.scene, renderer);
												intersectedObjects.splice(intersectedObjects.findIndex(function (v) {
															return v === intersectedObject;
												}), 1);
									}
						});
						return intersects;
			};
			this.EventListeners = function () {
						function _class(camera, renderer) {
									var settings = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
									classCallCheck(this, _class);
									var intersectedObject;
									var THREE = three$1.THREE,
									    mouse = new THREE.Vector2(),
									    particles = [],
									    raycaster = new THREE.Raycaster(),
									    options = settings.options || {};
									raycaster.params.Points.threshold = settings.threshold !== undefined ? settings.threshold : 0.03;
									raycaster.params.Line.threshold = raycaster.params.Points.threshold;
									if (raycaster.setStereoEffect) {
												raycaster.setStereoEffect({
															options: settings.options,
															renderer: renderer,
															camera: camera,
															scene: settings.scene,
															stereoEffect: options.stereoEffect,
															raycasterEvents: false
												});
									}
									var domElement = options.renderer ? options.renderer.domElement : window;
									domElement.addEventListener('mousemove', function (event) {
												if (raycaster.stereo !== undefined) {
															raycaster.stereo.onDocumentMouseMove(event);
															return;
												}
												Options.raycaster.EventListeners.getRendererSize(renderer).getMousePosition(mouse, event);
												raycaster.setFromCamera(mouse, camera);
												intersects = raycaster.intersectObjects(particles);
												if (!intersects) return;
												if (intersects.length === 0) {
															if (intersectedObject) {
																		if (intersectedObject.userData.raycaster && intersectedObject.userData.raycaster.onIntersectionOut) intersectedObject.userData.raycaster.onIntersectionOut();else Options.raycaster.onIntersectionOut(settings.scene, renderer);
																		intersectedObject = undefined;
															}
												} else {
															var intersect = intersects[0],
															    object = intersect.object;
															if (object.userData.raycaster && object.userData.raycaster.onIntersection) object.userData.raycaster.onIntersection(intersect, mouse);else Options.raycaster.onIntersection(intersect, options, settings.scene, camera, renderer);
															intersectedObject = object;
												}
									}, false);
									domElement.addEventListener('pointerdown', function (event) {
												if (raycaster === undefined) return;
												if (intersects && intersects.length > 0) {
															var intersect = intersects[0];
															if (intersect.object.userData.raycaster && intersect.object.userData.raycaster.onMouseDown) intersect.object.userData.raycaster.onMouseDown(intersect, event);
															else Options.raycaster.onMouseDown(intersect, options);
												}
									}, false);
									function isAddedToParticles(particle) {
												return particles.includes(particle);
									}
									this.addParticle = function (particle) {
												if (particle.userData.boFrustumPoints) return;
												if (raycaster.stereo) {
															raycaster.stereo.addParticle(particle);
															return;
												}
												if (isAddedToParticles(particle)) {
															console.error('Duplicate particle "' + particle.name + '"');
															return;
												}
												particles.push(particle);
									};
									this.removeParticle = function (particle) {
												if (particle.userData.boFrustumPoints) return;
												if (raycaster.stereo) {
															raycaster.stereo.removeParticle(particle);
															return;
												}
												var index = particles.indexOf(particle);
												if (index === -1) return;
												particles.splice(index, 1);
									};
						}
						createClass(_class, null, [{
									key: 'getRendererSize',
									value: function getRendererSize(renderer, el) {
												el = el || renderer.domElement;
												var style = {
															position: el.style.position,
															left: el.style.left,
															top: el.style.top,
															width: el.style.width,
															height: el.style.height
												},
												    rect = el.getBoundingClientRect(),
												    left = Math.round(rect.left),
												    top = Math.round(rect.top),
												    size = new three$1.THREE.Vector2();
												renderer.getSize(size);
												return {
															getMousePosition: function getMousePosition(mouse, event) {
																		mouse.x = event.clientX / size.x * 2 - 1 - left / size.x * 2;
																		mouse.y = -(event.clientY / size.y) * 2 + 1 + top / size.y * 2;
															}
												};
									}
						}]);
						return _class;
			}();
};
Options.raycaster = new Raycaster();

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
var Matrix =
function Matrix(a) {
	classCallCheck(this, Matrix);
	this.multiply = function (b) {};
	this.forEach = function () {};
	this.length;
	return new Proxy(a, {
		get: function get$$1(target, name) {
			var i = parseInt(name);
			if (!isNaN(i)) {
				return target[i];
			}
			switch (name) {
				case "length":
					return target.length;
				case 'forEach':
					return target.forEach;
				case "multiply":
					return function (b) {
						var c = [],
						l = a.length,
						m = a[0].length,
						n = Array.isArray(b[0]) ? b[0].length : 1;
						if (m !== b.length) {
							console.error('Matrix: Dimension mismatch in multiplication. Matrix A columns (' + m + ') must match Matrix B rows (' + b.length + ')');
							return;
						}
						for (var i = 0; i < l; i++) {
							if (n === 1) {
								var s = 0;
								for (var k = 0; k < m; k++) {
									s = s + a[i][k] * b[k];
								}c[i] = s;
							} else for (var j = 0; j < n; j++) {
								var s = 0;
								for (var k = 0; k < m; k++) {
									s = s + a[i][k] * b[k][j];
								}c[i] = c[i] || [];
								c[i][j] = s;
							}
						}
						return new Matrix(c);
					};
				default:
					console.error('Matrix: Invalid name: ' + name);
			}
		},
		set: function set$$1(target, name, value) {
			target[i] = value;
			return true;
		}
	});
};
var Matrix2 = new Proxy([], {
	get: function get$$1(target, name, args) {
		var i = parseInt(name);
		if (!isNaN(i)) {
			return [target[i]];
		}
		switch (name) {
			case "multiply":
				return function (i) {
					var v = [];
					return v;
				};
			default:
				console.error('Matrix: Invalid name: ' + name);
		}
	},
	set: function set$$1(target, name, value) {
		target[name] = value;
		return true;
	}
});

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
var MyMath = { Matrix: Matrix };

/**
 * @module myObject
 * @description base class for my threejs objects
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
var sMyObject = 'MyObject';
var MyObject = function () {
	function MyObject() {
		var _this2 = this;
		var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
		var vertices = arguments[1];
		classCallCheck(this, MyObject);
		var _this = this;
		settings.object = settings.object || {};
		settings.object.geometry = settings.object.geometry || {};
		if (!settings.object.geometry.position || !settings.object.geometry.position.isPositionProxy) settings.object.geometry.position = new Proxy(settings.object.geometry.position || [], {
			get: function get$$1(positions, name) {
				var positionId = parseInt(name);
				if (!isNaN(positionId)) {
					return new Proxy(positions[positionId], {
						set: function set$$1(position, name, value) {
							var axisId = parseInt(name);
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
					case 'isPositionProxy':
						return true;
				}
				return positions[name];
			}
		});
		var THREE = three$1.THREE;
		if (!settings.bufferGeometry) settings.bufferGeometry = new THREE.BufferGeometry();
		this.bufferGeometry = settings.bufferGeometry;
		if (vertices)
			settings.object.geometry.position = settings.object.geometry.position || vertices;
		var createPositionAttribute = function createPositionAttribute(pointLength, pointsLength) {
			var MAX_POINTS = settings.object.geometry.MAX_POINTS;
			if (MAX_POINTS != undefined) settings.bufferGeometry.setDrawRange(0, pointsLength * 2 - 1);
			var positions = new Float32Array((MAX_POINTS != undefined ? MAX_POINTS : pointsLength) * pointLength);
			settings.bufferGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, pointLength));
			settings.bufferGeometry.userData.position = new Proxy(settings.bufferGeometry.attributes.position, {
				get: function get$$1(position, name) {
					var positionId = parseInt(name);
					if (!isNaN(positionId)) {
						var positionOffset = positionId * position.itemSize,
						    array = position.array;
						var positionItem = new Proxy([], {
							get: function get$$1(vertice, name) {
								var axisId = parseInt(name);
								if (!isNaN(axisId)) {
									if (axisId >= position.itemSize) {
										return;
									}
									return array[positionOffset + axisId];
								}
								switch (name) {
									case 'forEach':
										return function (item) {
											for (var _axisId = 0; _axisId < position.itemSize; _axisId++) {
												item(array[positionOffset + _axisId], _axisId);
											}
										};
									case 'length':
										return position.itemSize;
									case 'toJSON':
										return function (item) {
											var res = '[';
											positionItem.forEach(function (axis) {
												res += axis + ', ';
											});
											return res.substring(0, res.length - 2) + ']';
										};
									case 'x':
										return array[positionOffset + 0];
									case 'y':
										return array[positionOffset + 1];
									case 'z':
										return array[positionOffset + 2];
									case 'w':
										{
											if (position.itemSize < 4) return;
											return array[positionOffset + 3];
										}
								}
								return vertice[name];
							},
							set: function set$$1(vertice, name, value) {
								var axisId = parseInt(name);
								if (!isNaN(axisId)) {
									array[positionOffset + axisId] = value;
									return true;
								}
								vertice[name] = value;
								return true;
							}
						});
						return positionItem;
					}
					switch (name) {
						case 'length':
							return position.count;
					}
					console.error(sMyObject + ': get settings.bufferGeometry.userData.position. Invalid name: ' + name);
					return position[name];
				}
			});
			if (_this.setW) _this.setW();
			var itemSize = settings.object.geometry.opacity ? 4 : 3,
			    colors = new Float32Array((MAX_POINTS != undefined ? MAX_POINTS : pointsLength) * itemSize);
			settings.bufferGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, itemSize));
		};
		this.setPositionAttributeFromPoints = function (points, boCreatePositionAttribute) {
			if (boCreatePositionAttribute) delete settings.bufferGeometry.attributes.position;
			if (!settings.bufferGeometry.attributes.position) {
				createPositionAttribute(_this2.pointLength ? _this2.pointLength() : points[0].w === undefined ? 3 : 4, points.length);
				for (var i = 0; i < points.length; i++) {
					_this2.setPositionAttributeFromPoint(i);
				}
			}
			return settings.bufferGeometry;
		};
		this.verticeColor = function (i, vertice) {
			var colors = settings.object.geometry.colors;
			var colorsId = i * 3;
			if (colors && colors[colorsId] != undefined) return [colors[colorsId], colors[colorsId + 1], colors[colorsId + 2]];
			var color = settings.object.color;
			if (color != undefined && (typeof color === 'undefined' ? 'undefined' : _typeof(color)) != 'object') {
				return new THREE.Color(_this.color());
			}
			var getDefaultColor = function getDefaultColor() {
				return new THREE.Color(_this.color());
			};
			var w = void 0;
			if (vertice) w = vertice.w;else if (!_this.getPoint) {
				var position = _this.bufferGeometry.attributes.position;
				if (position.itemSize != 4) return getDefaultColor();
				w = new THREE.Vector4().fromBufferAttribute(position, i).w;
			} else w = _this.getPoint(i).w;
			if (w === undefined) return getDefaultColor();
			return w;
		};
		this.setPositionAttributeFromPoint = function (i, vertice) {
			var attributes = settings.bufferGeometry.attributes,
			    position = attributes.position,
			    itemSize = position.itemSize;
			vertice = vertice || _this.getPoint(i);
			var positionId = i * itemSize,
			    array = position.array;
			array[positionId++] = vertice.x != undefined ? vertice.x : vertice[0] != undefined ? vertice[0] : 0;
			if (itemSize > 1) array[positionId++] = vertice.y != undefined ? vertice.y : vertice[1] != undefined ? vertice[1] : 0;
			if (itemSize > 2) array[positionId++] = vertice.z != undefined ? vertice.z : vertice[2] != undefined ? vertice[2] : 0;
			var w = vertice.w;
			if (itemSize > 3) array[positionId] = w;
			var colorId = i * attributes.color.itemSize;
			array = attributes.color.array;
			var verticeColor = _this2.verticeColor(i, vertice);
			if (typeof verticeColor === 'number') {
				if (settings.options) {
					var wScale = settings.options.scales.w;
					Player$1.setColorAttribute(attributes, i, settings.options.palette.toColor(w, wScale.min, wScale.max));
				}
				colorId += attributes.color.itemSize - 1;
			} else if (Array.isArray(verticeColor)) verticeColor.forEach(function (item) {
				return array[colorId++] = item;
			});else if (verticeColor instanceof THREE.Color) {
				array[colorId++] = verticeColor.r;
				array[colorId++] = verticeColor.g;
				array[colorId++] = verticeColor.b;
			} else console.error(sMyObject + '.setPositionAttributeFromPoint: Invalid verticeColor = ' + verticeColor);
			if (attributes.color.itemSize > 3) _this2.verticeOpacity(i);
		};
		this.verticeOpacity = function (i, transparent, opacity) {
			var color = settings.bufferGeometry.attributes.color;
			if (color.itemSize != 4) {
				console.error(sMyObject + '.verticeOpacity: Invalid color.itemSize = ' + color.itemSize);
				return;
			}
			var array = color.array;
			var verticeOpacity = settings.object.geometry.opacity ? settings.object.geometry.opacity[i] : undefined;
			array[color.itemSize * i + 3] = transparent ? opacity : verticeOpacity === undefined ? 1 : verticeOpacity;
			color.needsUpdate = true;
		};
		this.verticesOpacity = function (transparent, opacity) {
			var color = settings.bufferGeometry.attributes.color;
			if (color && color.itemSize > 3) {
				for (var i = 0; i < color.count; i++) {
					_this2.verticeOpacity(i, transparent, opacity);
				}
			} else {
				var object3D = _this.object3D;
				if (object3D) {
					object3D.material.transparent = transparent;
					object3D.material.opacity = transparent ? opacity : 1;
					object3D.material.needsUpdate = true;
				} else console.error(sMyObject + '.verticesOpacity: Invalid object3D');
			}
		};
		this.color = function () {
			var color = settings.object.color != undefined ? settings.object.color : settings.pointsOptions != undefined ? settings.pointsOptions.color : undefined;
			return color != undefined ? color : _this2.defaultColor;
		};
	}
	createClass(MyObject, [{
		key: 'defaultColor',
		get: function get$$1() {
			return 'white';
		}
	}, {
		key: 'isOpacity',
		get: function get$$1() {
			if (this.bufferGeometry.attributes.color.itemSize > 3) {
				if (!this.object3D.material.transparent) console.error(sMyObject + '.isOpacity: invalid this.object3D.material.transparent = ' + this.object3D.material.transparent);
				return true;
			}
			return false;
		}
	}]);
	return MyObject;
}();

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
var ND = function (_MyObject) {
	inherits(ND, _MyObject);
	function ND(n, settings) {
		classCallCheck(this, ND);
		var _this2 = possibleConstructorReturn(this, (ND.__proto__ || Object.getPrototypeOf(ND)).call(this, settings));
		var options = settings.options,
		    _ND = _this2;
		settings.object.raycaster = settings.object.raycaster || {};
		settings.object.raycaster.text = settings.object.raycaster.text || function (intersection) {
			var getLanguageCode = settings.options.getLanguageCode;
			var lang = {
				pointId: "point Id",
				edgeId: "edge Id",
				faceId: "face Id",
				bodyId: "body Id",
				segmentId: "segment Id"
			};
			var _languageCode = getLanguageCode();
			switch (_languageCode) {
				case 'ru':
					lang.pointId = 'Индекс точки';
					lang.edgeId = 'Индекс ребра';
					lang.faceId = 'Индекс грани';
					lang.bodyId = 'Индекс тела';
					lang.segmentId = 'Индекс сегмента';
					break;
			}
			var index = intersection.object.geometry.index,
			    edge = [index.getX(intersection.indexNew), index.getY(intersection.indexNew)],
			    indices = intersection.object.userData.geometry.indices;
			edges = indices[0];
			var minDistance = Infinity,
			    pointId;
			function distance(i) {
				var pointIndex = edge[i],
				    distance = intersection.point.distanceTo(new THREE.Vector3().fromBufferAttribute(intersection.object.geometry.attributes.position, pointIndex));
				if (minDistance > distance) {
					minDistance = distance;
					pointId = pointIndex;
				}
			}
			distance(0);
			distance(1);
			var text = '\n' + lang.pointId + ': ' + pointId;
			for (var segmentIndex = 0; segmentIndex < edges.length; segmentIndex++) {
				var edgeCur = edges[segmentIndex];
				if (edgeCur[0] === edge[0] && edgeCur[1] === edge[1] || edgeCur[0] === edge[1] && edgeCur[1] === edge[0]) {
					text += '\n' + lang.edgeId + ': ' + segmentIndex;
					edges.selected = segmentIndex;
					var detectedIndex;
					for (var indicesSegment = 1; indicesSegment < indices.length; indicesSegment++) {
						var _segment = indices[indicesSegment];
						_segment.forEach(function (segmentItem, segmentIndexCur) {
							for (var i = 0; i < segmentItem.length; i++) {
								if (segmentItem[i] === segmentIndex) {
									detectedIndex = segmentIndexCur;
									break;
								}
							}
						});
						if (detectedIndex === undefined) {
							console.error('ND: mouse move. Index of segment was not detected');
							break;
						} else {
							segmentIndex = detectedIndex;
							var segmentName;
							switch (indicesSegment) {
								case 1:
									segmentName = lang.faceId;break;
								case 2:
									segmentName = lang.bodyId;break;
								default:
									segmentName = lang.segmentId;
							}
							text += '\n' + segmentName + ': ' + segmentIndex;
							_segment.selected = segmentIndex;
						}
					}
					var segment = indices[indices.length - 1][segmentIndex];
					break;
				}
			}
			return text;
		};
		settings.object.name = settings.object.name || 'Object';
		if (settings.object.aObjects) settings.object.aObjects.nD = _this2;
		settings.object.geometry = settings.object.geometry || {};
		if (settings.object.geometry instanceof Array) {
			var position = settings.object.geometry;
			settings.object.geometry = { position: position };
		}
		settings.object.geometry.position = settings.object.geometry.position || [];
		var Vector = function (_ND$VectorN) {
			inherits(Vector, _ND$VectorN);
			function Vector() {
				var array = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
				var _this3, _ret;
				var vectorSettings = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
				classCallCheck(this, Vector);
				array = (_this3 = possibleConstructorReturn(this, (Vector.__proto__ || Object.getPrototypeOf(Vector)).call(this, n, array)), _this3).array;
				var _this = _this3;
				return _ret = new Proxy(array, {
					get: function get$$1(target, name) {
						var i = parseInt(name);
						if (isNaN(i)) {
							switch (name) {
								case "point":
									var _THREE = three$1.THREE;
									if (_typeof(settings.object.color) === "object" && array.length >= 4) return new _THREE.Vector4(this.get(undefined, 0), this.get(undefined, 1), this.get(undefined, 2), this.get(undefined, 3));
									return new _THREE.Vector3(this.get(undefined, 0), this.get(undefined, 1), this.get(undefined, 2));
								default:
									{
										return _this[name];
									}
							}
							return;
						}
						if (i >= n) return 0;
						if (array.length > n && settings.object.geometry.iAxes && i < settings.object.geometry.iAxes.length) i = settings.object.geometry.iAxes[i];
						return array[i];
					},
					set: function set$$1(target, name, value) {
						var i = parseInt(name);
						if (!isNaN(i)) {
							if (i >= array.length) {
								array.push(value);
								return array.length;
							}
							array[i] = value;
							_ND.intersection();
							if (vectorSettings.onChange) vectorSettings.onChange();
							return true;
						}
						switch (name) {
							case 'onChange':
								vectorSettings.onChange = value;
								return vectorSettings.onChange;
							default:
								console.error('ND: Vector set. Invalid name: ' + name);
						}
					}
				}), possibleConstructorReturn(_this3, _ret);
			}
			createClass(Vector, [{
				key: 'push',
				value: function push(value) {
					console.error('ND.Vector.push() unavailable');
				}
			}, {
				key: 'pop',
				value: function pop() {
					console.error('ND.Vector.pop() unavailable');
				}
			}]);
			return Vector;
		}(ND.VectorN);
		function update() {
			_ND.intersection();
			object3D.geometry.attributes.position.array = new THREE.BufferGeometry().setFromPoints(geometry.D3.points).attributes.position.array;
			object3D.geometry.attributes.position.needsUpdate = true;
			if (options.guiSelectPoint) options.guiSelectPoint.update();
			object3D.children.forEach(function (child) {
				if (child.type === 'Sprite') child.position.copy(geometry.D3.points[child.userData.pointID]);
			});
		}
		function proxyPosition() {
			if (settings.object.position && settings.object.position.isProxy) return settings.object.position;
			return new Proxy(settings.object.position ? settings.object.position instanceof Array ? settings.object.position : [settings.object.position] : [], {
				get: function get$$1(target, name, args) {
					var i = parseInt(name);
					if (!isNaN(i)) {
						if (target instanceof Array) {
							if (i < target.length && target[i] !== undefined) return target[i];
							return 0;
						}
						return target;
					}
					switch (name) {
						case 'isProxy':
							return true;
						case 'folders':
							target.folders = target.folders || [];
							return target.folders;
						case 'arguments':
							return;
						case 'clear':
							return function () {
								target.forEach(function (pos, i) {
									return target[i] = 0;
								});
							};
						case 'forEach':
							return target.forEach;
						case 'length':
							return target.length;
						default:
							console.error('ND: settings.object.position Proxy. Invalid name: ' + name);
					}
				},
				set: function set$$1(target, name, value) {
					target[name] = value;
					settings.object.geometry.position.reset();
					var input = target.folders[name].cPosition.domElement.querySelector('input');
					if (parseFloat(input.value) !== value) {
						input.value = value;
						update();
					}
					return true;
				}
			});
		}
		settings.object.position = proxyPosition();
		function proxyRotation() {
			if (settings.object.rotation && settings.object.rotation.isProxy) return settings.object.rotation;
			return new Proxy(settings.object.rotation ? settings.object.rotation instanceof Array ? settings.object.rotation : [settings.object.rotation] : [], {
				get: function get$$1(target, name, args) {
					var i = parseInt(name);
					if (!isNaN(i)) {
						if (target instanceof Array) {
							if (i < target.length && target[i] !== undefined) return target[i];
							return 0;
						}
						return target;
					}
					switch (name) {
						case 'isProxy':
							return true;
						case 'boUseRotation':
							return target.boUseRotation;
						case 'folders':
							target.folders = target.folders || [];
							return target.folders;
						case 'trigonometry':
							if (!target.trigonometry) {
								target.trigonometry = new Proxy([], {
									get: function get$$1(target, name, args) {
										var i = parseInt(name);
										if (!isNaN(i)) {
											if (!target[i]) {
												settings.object.rotation.boUseRotation = true;
												var angle = settings.object.rotation[i];
												settings.object.rotation.boUseRotation = false;
												target[i] = { sin: Math.sin(angle), cos: Math.cos(angle) };
											}
											return target[i];
										}
										switch (name) {
											default:
												console.error('ND: settings.object.rotation Proxy. Invalid name: ' + name);
										}
									},
									set: function set$$1(target, name, value) {
										target[name] = value;
										if (isNaN(parseInt(name))) return true;
										return true;
									}
								});
							}
							return target.trigonometry;
						case 'isRotation':
							return function () {
								target.boUseRotation = true;
								var boRotation = false;
								for (var j = 0; j < n; j++) {
									if (settings.object.rotation[j] !== 0) {
										boRotation = true;
										break;
									}
								}
								target.boUseRotation = false;
								return boRotation;
							};
						case 'clear':
							return function () {
								target.forEach(function (angle, i) {
									return target[i] = 0;
								});
								target.trigonometry = undefined;
							};
						case 'arguments':
							return;
						case 'forEach':
							return target.forEach;
						case 'length':
							return target.length;
						default:
							console.error('ND: settings.object.rotation Proxy. Invalid name: ' + name);
					}
				},
				set: function set$$1(target, name, value) {
					target[name] = value;
					if (isNaN(parseInt(name))) return true;
					settings.object.rotation.trigonometry[name].cos = Math.cos(value);
					settings.object.rotation.trigonometry[name].sin = Math.sin(value);
					settings.object.geometry.position.reset();
					if (target.folders) {
						var input = target.folders[name].cRotation.domElement.querySelector('input');
						if (parseFloat(input.value) !== value) {
							input.value = value;
						}
					}
					update();
					return true;
				}
			});
		}
		if (!settings.object.rotation || !settings.object.rotation.isProxy) {
			settings.object.rotation = proxyRotation();
			settings.object.rotation.boUseRotation = false;
		}
		if (settings.object.geometry.position.target) settings.object.geometry.position = settings.object.geometry.position.target;
		settings.object.geometry.position.boPositionError = true;
		var rotationAxes = [[]];
		function setRotationAxes() {
			if (n < 2) return;
			if (rotationAxes[0].length != 0) return;
			if (n === 2) rotationAxes[0].push(2);
			else for (var j = 0; j < n - 2; j++) {
					rotationAxes[0].push(j);
				}rotationAxes[0].tI = [0, 1];
			var iLastColumn = rotationAxes[0].length - 1;
			var boLastRow = false;
			var _loop = function _loop() {
				var iLastRow = rotationAxes.length - 1,
				    lastRow = rotationAxes[iLastRow],
				    row = [];
				for (j = iLastColumn; j >= 0; j--) {
					var prevColumn = lastRow[j];
					if (j === iLastColumn) iAxis = prevColumn + 1;
					else iAxis = prevColumn;
					if (iAxis >= n) {
						var _ret3 = function () {
							var createRow = function createRow(j) {
								if (j <= 0) return false;
								var prevRowColumn = lastRow[j - 1] + 1;
								if (prevRowColumn >= lastRow[j]) return createRow(j - 1);
								row[j - 1] = prevRowColumn;
								row[j] = row[j - 1] + 1;
								for (var k = j + 1; k <= iLastColumn; k++) {
									row[k] = row[k - 1] + 1;
								}
								j = j - 2;
								while (j >= 0) {
									row[j] = lastRow[j];
									j--;
								}
								return true;
							};
							boLastRow = !createRow(j);
							return 'break';
						}();
						if (_ret3 === 'break') break;
					} else row[j] = iAxis;
				}
				if (!boLastRow) {
					row.tI = [lastRow.tI[0]];
					tI1 = lastRow.tI[1] + 1;
					if (tI1 >= n) {
						row.tI[0]++;
						tI1 = row.tI[0] + 1;
					}
					row.tI[1] = tI1;
					if (row.length === 0) {
						console.error('ND positionWorld get: row is empty');
						return 'break';
					}
					rotationAxes.push(row);
					if (iLastRow === rotationAxes.length - 1) {
						console.error('ND positionWorld get: row is not added');
						return 'break';
					}
				}
			};
			while (!boLastRow) {
				var j;
				var iAxis;
				var tI1;
				var _ret2 = _loop();
				if (_ret2 === 'break') break;
			}
		}
		var positionWorld = new Proxy(settings.object.geometry.position ? settings.object.geometry.position : [], {
			get: function get$$1(target, name) {
				var i = parseInt(name);
				if (!isNaN(i)) {
					settings.object.geometry.position.boPositionError = false;
					var positionPoint = settings.object.geometry.position[i];
					if (positionPoint.positionWorld) {
						settings.object.geometry.position.boPositionError = true;
						return positionPoint.positionWorld;
					}
					var array = [];
					if (positionPoint !== undefined) {
						if (!(settings.object.position instanceof Array)) {
							console.error('ND positionWorld get: settings.object.position is not array');
							settings.object.position = [settings.object.position];
						}
						if (settings.object.rotation.isRotation()) {
							var getMatrix = function getMatrix(index) {
								var cos = settings.object.rotation.trigonometry[index].cos,
								    sin = settings.object.rotation.trigonometry[index].sin,
								    array = [];
								var tI = rotationAxes[index].tI;
								for (var i = 0; i < n; i++) {
									var _row = [];
									for (var j = 0; j < n; j++) {
										if (n === 3) {
											var iR = n - i - 1,
											    jR = n - j - 1;
											if (iR === tI[0] && jR === tI[0]) _row.push(cos);else if (iR === tI[0] && jR === tI[1]) _row.push(sin);else if (iR === tI[1] && jR === tI[0]) _row.push(-sin);else if (iR === tI[1] && jR === tI[1]) _row.push(cos);else if (iR === jR) _row.push(1);else _row.push(0);
										} else {
											if (i === tI[0] && j === tI[0]) _row.push(cos);else if (i === tI[0] && j === tI[1]) _row.push(-sin);else if (i === tI[1] && j === tI[0]) _row.push(sin);else if (i === tI[1] && j === tI[1]) _row.push(cos);else if (i === j) _row.push(1);else _row.push(0);
										}
									}
									array.push(_row);
								}
								return new MyMath.Matrix(array);
							};
							var m3;
							setRotationAxes();
							if (n === 2) m3 = getMatrix(0);
							for (var j = 0; j < rotationAxes.length; j++) {
								var m = getMatrix(j);
								if (m3) m3 = m3.multiply(m);
								else m3 = m;
							}
							var position = [];
							for (var j = 0; j < n; j++) {
								position.push(positionPoint[j]);
							}var p = m3.multiply(position);
							p.forEach(function (value, i) {
								if (value !== undefined) {
									array.push(value + settings.object.position[i]);
								} else console.error('ND: positionWorld get: invalig array item = ' + value);
							});
						} else {
							positionPoint.forEach(function (value, j) {
								return array.push(value + settings.object.position[j]);
							});
							setRotationAxes();
						}
					} else console.error('ND positionWorld get index');
					if (settings.object.geometry.boRememberPosition === undefined) settings.object.geometry.boRememberPosition = true;
					if (settings.object.geometry.boRememberPosition) positionPoint.positionWorld = array;
					settings.object.geometry.position.boPositionError = true;
					return array;
				}
				switch (name) {
					case 'isProxy':
						return true;
					case 'target':
						return;
					case 'copy':
						return function () {
							var v = [];
							settings.object.geometry.position.boPositionError = false;
							settings.object.geometry.position.forEach(function (value, i) {
								v[i] = positionWorld[i];
								settings.object.geometry.position.boPositionError = false;
							});
							settings.object.geometry.position.boPositionError = true;
							return v;
						};
				}
				return settings.object.geometry.position[name];
			}
		});
		var _prevLine = {};
		function proxyGeometryPosition() {
			if (settings.object.geometry.position && settings.object.geometry.position.isProxy) return settings.object.geometry.position;
			return new Proxy(settings.object.geometry.position ? settings.object.geometry.position : [], {
				get: function get$$1(target, name, args) {
					var i = parseInt(name);
					if (!isNaN(i)) {
						if (settings.object.geometry.position.boPositionError) {
						}
						if (i >= target.length) {
							console.error('ND get settings.object.geometry.position: invalid index = ' + i);
							return;
						}
						if (target[i] instanceof Array) {
							return new Proxy(target[i], {
								get: function get$$1(target, name, args) {
									var i = parseInt(name);
									if (!isNaN(i)) {
										if (i >= target.length) return 0;
										var axis = target[i];
										if (isNaN(axis)) console.error('ND get settings.object.geometry.position[i][' + i + '] = ' + target[i]);
										return axis;
									}
									switch (name) {
										case 'reset':
											return function () {
												delete target.positionWorld;
											};
										case 'distanceTo':
											return function (verticeTo) {
												var vertice = target;
												if (vertice.length != verticeTo.length) {
													console.error(sUniverse + ': settings.object.geometry.position[i].distanceTo(...). vertice.length != verticeTo.length');
													return;
												}
												var sum = 0;
												vertice.forEach(function (axis, i) {
													var d = axis - verticeTo[i];
													sum += d * d;
												});
												return Math.sqrt(sum);
											};
									}
									return target[name];
								},
								set: function set$$1(target, name, value) {
									var i = parseInt(name);
									target[name] = value;
									if (!isNaN(i)) {
										target.positionWorld = undefined;
										if (_prevLine.prevLine) {
											_prevLine.prevLine.geometry.attributes.position.array = new THREE.BufferGeometry().setFromPoints(geometry.D3.points).attributes.position.array;
											_prevLine.prevLine.geometry.attributes.position.needsUpdate = true;
										}
										update();
									}
									return true;
								}
							});
						}
						console.error('ND: get settings.object.geometry.position is not array.');
						return [target[i]];
					}
					switch (name) {
						case 'isProxy':
							return true;
						case 'boPositionError':
							return target.boPositionError;
						case 'target':
							return target;
						case "clone":
							return function (i) {
								var v = [];
								target[i].forEach(function (value, j) {
									return v[j] = target[i][j];
								});
								return v;
							};
						case "reset":
							return function () {
								target.forEach(function (item) {
									return delete item.positionWorld;
								});
							};
						default:
							return target[name];
					}
				},
				set: function set$$1(target, name, value) {
					var i = parseInt(name);
					if (!isNaN(i)) {
						target[name].positionWorld = undefined;
					}
					target[name] = value;
					return true;
				}
			});
		}
		settings.object.geometry.position = proxyGeometryPosition();
		function setIndices() {
			if (settings.object.geometry.indices) return;
			settings.object.geometry.indices = [];
			settings.object.geometry.indices.boAddIndices = true;
		}
		setIndices();
		function proxyEdges(newEdges) {
			edges = newEdges || edges;
			if (edges && edges.isProxy) return edges;
			return new Proxy(edges ? edges : [], {
				get: function get$$1(edges, name, value) {
					var _this4 = this;
					var i = parseInt(name);
					if (!isNaN(i)) {
						var edge = edges[i];
						edge.intersection = function (geometryIntersection            ) {
							var i = parseInt(name);
							if (!isNaN(i)) {
								var indicesIntersection = function indicesIntersection(position) {
									switch (n) {
										case 2:
											break;
										default:
											if (!position) break;
											position.push(vectorPlane[n - 1]);
											break;
									}
									indices.intersection = { position: position };
									if (indices.intersection.position) indices.intersection.position.iEdge = i;
								};
								if (i.toString() !== name) {
									console.error('ND: settings.object.geometry.indices[]intersection. invalid name = ' + name);
									return;
								}
								if (edges.length === 0) return;
								if (i >= edges.length) {
									console.error('ND: settings.object.geometry.indices[]intersection. invalid length: ' + edges.length);
									_this4.indices = { intersection: {} };
									return;
								}
								var indices = edges[i];
								if (indices.length !== 2) {
									console.error('ND: settings.object.geometry.indices[]intersection. indices.length = ' + indices.length);
									return;
								}
								if (indices[0] === indices[1]) {
									console.error('ND: settings.object.geometry.indices[]intersection. indices[0] === indices[1] = ' + indices[0]);
									return;
								}
								var position0 = new Vector(positionWorld[indices[0]]),
								    position1 = new Vector(positionWorld[indices[1]]);
								switch (n) {
									case 1:
										if (vectorPlane[0].between(position0[0], position1[0], true)) geometryIntersection.position.push([vectorPlane[0]]);
										break;
									case 2:
										var vector;
										if (vectorPlane[1].between(position0[1], position1[1], true)) {
											var a = (position1[1] - position0[1]) / (position1[0] - position0[0]),
											    b = position0[1] - a * position0[0],
											    x = a === 0 || isNaN(a) || Math.abs(a) === Infinity ? position1[0] : (vectorPlane[1] - b) / a;
											if (isNaN(x) || x === undefined) {
												console.error('ND.intersection: x = ' + x + ' position1[0] = ' + position1[0] + ' position0[0] = ' + position0[0]);
											}
											var _d = 1e-15;
											if (!x.between(position0[0], position1[0], true)) {
												if (!(Math.abs(x - position0[0]) < _d && Math.abs(x - position0[0]) < _d)) {
													indices.intersection = {};
													break;
												}
											}
											vector = [x, vectorPlane[1]];
										}
										indicesIntersection(vector);
										break;
									case 3:
										var pos;
										var d = 5.56e-17;
										if (Math.abs(vectorPlane[n - 1] - position1[n - 1]) < d) pos = position1;else if (Math.abs(vectorPlane[n - 1] - position0[n - 1]) < d) pos = position0;
										if (pos) {
											indicesIntersection([pos[0], pos[1]]);
											indices.intersection.boVerticeOnPanel = true;
										} else {
											var nD02 = new ND(n - 1, {
												plane: true,
												object: {
													geometry: {
														position: positionWorld.copy(),
														indices: [[indices]],
														iAxes: [1, 2]
													}
												},
												vectorPlane: vectorPlane.array
											}),
											    arrayIntersects02 = nD02.intersection();
											var nD12 = new ND(n - 1, {
												plane: true,
												object: {
													geometry: {
														position: positionWorld.copy(),
														indices: [[indices]],
														iAxes: [0, 2]
													}
												},
												vectorPlane: vectorPlane.array
											}),
											    arrayIntersects12 = nD12.intersection();
											indicesIntersection(arrayIntersects02.length && arrayIntersects12.length ? [arrayIntersects12[0][0], arrayIntersects02[0][0]] : undefined);
										}
										break;
									default:
										var intersectionAxis = function intersectionAxis(axis) {
											var nD0 = new ND(2, {
												plane: true,
												object: {
													geometry: {
														position: positionWorld,
														indices: [[indices]],
														iAxes: [axis, n - 1]
													}
												},
												vectorPlane: vectorPlane.array
											});
											return nD0.intersection();
										};
										var arrayIntersections = [];
										var boIntersect = true;
										for (var iIntersection = 0; iIntersection < n - 1; iIntersection++) {
											var item = intersectionAxis(iIntersection);
											if (boIntersect && item.length === 0) {
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
					switch (name) {
						case 'intersection':
							return undefined;
						case 'edges':
							return edges;
						case 'isProxy':
							return true;
					}
					return edges[name];
				},
				set: function set$$1(edges, prop, value) {
					var index = parseInt(prop);
					if (isNaN(index)) {
						switch (prop) {
							case 'length':
								break;
							case 'edges':
								settings.object.geometry.indices[0] = proxyEdges(value);break;
							case 'selected':
								edges.selected = value;break;
							default:
								console.error('ND settings.object.geometry.indices[0].set: invalid prop: ' + prop);
						}
						return true;
					}
					if (value instanceof Array) {
						for (var i = 0; i < edges.length; i++) {
							var edge = edges[i];
							if (edge[0] === value[0] && edge[1] === value[1] || edge[1] === value[0] && edge[0] === value[1]) {
								value.index = i;
								return true;
							}
						}
						edges[index] = value;
						value.index = index;
						return true;
					}
					var indices = value;
					if (indices.length !== 2) {
						console.error('ND: settings.object.geometry.indices.push invalid indices.length = ' + indices.length);
						return true;
					}
					for (var i = 0; i < edges.length; i++) {
						var edgeIndices = edges[i];
						if (edgeIndices[0] === indices[0] && edgeIndices[1] === indices[1]) {
							console.error('ND: settings.object.geometry.indices.push under constraction');
							return;
						}
						if (edgeIndices[0] === indices[1] && edgeIndices[1] === indices[0]) {
							console.error('ND: settings.object.geometry.indices.push under constraction');
							indices[0] = settings.object.geometry.indices[i].indices[0];
							indices[1] = settings.object.geometry.indices[i].indices[1];
							return;
						}
					}
					edges[index] = value;
					return true;
				}
			});
		}
		var edges;
		function setEdges() {
			edges = settings.object.geometry.indices[0];
			var boArray = edges instanceof Array;
			if (!settings.object.geometry.indices[0] || boArray) {
				var indices = settings.object.geometry.indices;
				if (boArray) {
					if (!indices[0].isProxy) indices[0] = proxyEdges();
				} else indices.push(proxyEdges());
			}
		}
		setEdges();
		function addEdge(indices) {
			if (settings.object.geometry.position.length < 2) return;
			switch (n) {
				case 1:
					var _edges = settings.object.geometry.indices[0];
					if (settings.object.geometry.position) {
						indices = [];
						positionWorld.forEach(function (indice, i) {
							indices.push(i);
						});
						_edges.push(indices);
					}
					break;
				default:
					console.error('ND: default edges failed! n = ' + n);
			}
		}
		function proxySegments() {
			return new Proxy([], {
				get: function get$$1(target, name) {
					var i = parseInt(name);
					if (!isNaN(i)) return target[i];
					switch (name) {
						case 'push':
							return target.push;
						case 'length':
							return target.length;
						case 'isProxy':
							return true;
						case 'forEach':
							return target.forEach;
						case 'selected':
							return target.selected;
						default:
							console.error('ND: settings.object.geometry.indices[' + name + ']. Invalid name: ' + name);
					}
				},
				set: function set$$1(target, name, value) {
					var index = parseInt(name);
					if (isNaN(index)) {
						switch (name) {
							case 'length':
								break;
							case 'selected':
								target.selected = value;break;
							default:
								console.error('ND settings.object.geometry.indices[' + name + ']: invalid name: ' + name);
								return false;
						}
						return true;
					}
					if (value instanceof Array === false) {
						console.error('ND settings.object.geometry.indices[' + l + ']: invalid name: ' + name);
						return false;
					}
					for (var i = value.length - 1; i >= 0; i--) {
						for (var j = i - 1; j >= 0; j--) {
							if (value[i] === value[j]) {
								console.error('nD proxySegments() set: duplicate index = ' + value[i]);
								value.splice(i, 1);
								continue;
							}
						}
					}
					for (var i = 0; i < target.length; i++) {
						var segment = target[i],
						    aDetected = [];
						if (segment.length !== value.length) continue;
						for (var j = 0; j < segment.length; j++) {
							aDetected[j] = false;
							for (var k = 0; k < value.length; k++) {
								if (segment[j] === value[k]) {
									aDetected[j] = true;
									break;
								}
							}
						}
						var boDetected = true;
						for (var j = 0; j < aDetected.length; j++) {
							if (!aDetected[j]) {
								boDetected = false;
								break;
							}
						}
						if (boDetected) {
							value.index = i;
							return true;
						}
					}
					target[index] = value;
					value.index = index;
					return true;
				}
			});
		}
		function addEdges(level, geometry) {
			var positionIndices = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
			var levelIndices = arguments[3];
			if (positionIndices.length === 0) positionWorld.forEach(function (position, i) {
				positionIndices.push(i);
			});
			geometry = geometry || settings.object.geometry;
			if (!geometry.indices[0]) geometry.indices[0] = [];
			var edges = geometry.indices[0];
			if (n === 2 && geometry.position.length === 2) {
				edges.push([0, 1]);
				return;
			}
			if (level === undefined) return;
			if (level > 2) {
				var _loop2 = function _loop2() {
					var posIndices = [];
					positionIndices.forEach(function (indice, j) {
						if (positionIndices[i] !== positionIndices[j]) posIndices.push(positionIndices[j]);
					});
					var lIndices = [];
					addEdges(level - 1, undefined, posIndices, lIndices);
					if (lIndices.length) {
						var _l = level - 2;
						if (_l === 0) console.error('ND addEdges: invalid l = ' + 1);
						settings.object.geometry.indices[_l] = settings.object.geometry.indices[_l] === undefined ? proxySegments() : settings.object.geometry.indices[_l];
						settings.object.geometry.indices[_l].push(lIndices);
						if (levelIndices) levelIndices.push(lIndices.index);
					}
				};
				for (var i = 0; i < positionIndices.length; i++) {
					_loop2();
				}
			}
			switch (level) {
				case 2:
					if (!positionIndices) {
						positionIndices = [];
						settings.object.geometry.position.forEach(function (item, i) {
							positionIndices.push(i);
						});
					}
					var length = positionIndices.length;
					var _addItem = function _addItem() {
						var start = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
						for (var i = start; i < length; i++) {
							if (start === 0) _addItem(i + 1);else {
								var edge = [positionIndices[start - 1], positionIndices[i]];
								edges.push(edge);
								if (levelIndices) levelIndices.push(edge.index);
							}
						}
					};
					_addItem();
					break;
			}
		}
		function appendEdges() {
			switch (n) {
				case 1:
					addEdge();
					break;
				default:
					if (settings.object.geometry.indices[0].length === 0) addEdges(n);
			}
		}
		appendEdges();
		if (settings.object.geometry.indices.boAddIndices) {
			var indices = settings.object.geometry.indices;
			for (var i = 1; i < indices.length; i++) {
				var indice = indices[i];
				var arrayIndices = [];
				var max = 0;
				for (var j = 0; j < indice.length; j++) {
					var segment = indice[j];
					for (var k = 0; k < segment.length; k++) {
						var index = segment[k];
						if (arrayIndices[index] === undefined) arrayIndices[index] = 0;
						arrayIndices[index]++;
						if (arrayIndices[index] > max) max = arrayIndices[index];
					}
				}
				var arraySegment = [];
				for (var j = 0; j < arrayIndices.length; j++) {
					if (arrayIndices[j] < max) arraySegment.push(j);
				}
				if (arraySegment.length > 0) indice.push(arraySegment);
			}
		}
		var vectorPlane;
		var geometry = {
			get position() {
				return new Proxy(this, {
					get: function get$$1(target, name) {
						switch (name) {
							case 'length':
								return settings.object.geometry.position.length;
						}
						var i = parseInt(name);
						if (isNaN(i)) {
							console.error('ND.geometry.position: invalid name: ' + name);
							return;
						}
						return new Vector(positionWorld[i]);
					}
				});
			},
			get copy() {
				var copySettings = {
					geometry: { position: [], indices: [] },
					position: [],
					rotation: [],
					aObjects: settings.object.aObjects,
					name: settings.object.name
				};
				settings.object.geometry.position.forEach(function (vertice) {
					var copy = [];
					vertice.forEach(function (axis) {
						return copy.push(axis);
					});
					copySettings.geometry.position.push(copy);
				});
				settings.object.geometry.indices.forEach(function (indexes) {
					var copy = [];
					indexes.forEach(function (arrayIndex) {
						var copyArrayIndex = [];
						if (arrayIndex.indices) arrayIndex = arrayIndex.indices;
						arrayIndex.forEach(function (index) {
							return copyArrayIndex.push(index);
						});
						copy.push(copyArrayIndex);
					});
					copySettings.geometry.indices.push(copy);
				});
				function copyItem(array) {
					var copy = [];
					array.forEach(function (item) {
						copy.push(item);
					});
					return copy;
				}
				copySettings.position = copyItem(settings.object.position);
				settings.object.rotation.boUseRotation = true;
				copySettings.rotation = copyItem(settings.object.rotation);
				settings.object.rotation.boUseRotation = false;
				return copySettings;
			},
			get geometry() {
				return settings.object.geometry;
			},
			set geometry(geometry) {
				settings.object.geometry.position = geometry.position;
				if (geometry.indices) {
					settings.object.geometry.indices.length = 1;
					for (var i = 0; i < geometry.indices.length; i++) {
						if (i === 0) {
							settings.object.geometry.indices[0].edges.length = 0;
							geometry.indices[0].forEach(function (edge) {
								return settings.object.geometry.indices[0].edges.push(edge.indices === undefined ? edge : edge.indices);
							});
						} else settings.object.geometry.indices[i] = geometry.indices[i];
					}
				} else delete settings.object.geometry.indices;
			},
			D3: {
				get points() {
					return _ND.bufferGeometry.userData.position;
				},
				get faceIndices() {
					var aFaceIndices = [];
					var indices = settings.object.geometry.indices;
					if (indices.length < 2) return aFaceIndices;
					indices[1].forEach(function (face) {
						var faceVertices = [];
						face.forEach(function (edge, iEdge) {
							if (iEdge > 2) {
								console.error('ND: geometry.D3.faceIndices get. invalid face edges count.');
								return;
							}
							var edgeVertices = indices[0][edge].indices;
							if (faceVertices.length === 0) {
								faceVertices.push(edgeVertices[0]);
								faceVertices.push(edgeVertices[1]);
							} else {
								var boVertice0 = false,
								    boVertice1 = false;
								for (var i = 0; i < faceVertices.length; i++) {
									var faceVertice = faceVertices[i];
									if (faceVertice === edgeVertices[0]) boVertice1 = true;else if (faceVertice === edgeVertices[1]) boVertice0 = true;
								}
								if (!boVertice0 && !boVertice1) console.error('ND: geometry.D3.faceIndices get. Missing push');else if (boVertice0 != boVertice1) {
									faceVertices.push(edgeVertices[boVertice0 ? 0 : 1]);
								}
							}
						});
						if (faceVertices.length === 3) aFaceIndices.push(faceVertices[0], faceVertices[1], faceVertices[2]);else console.error('ND: PolyhedronGeometry: subdivide. Invalid face vertices count');
					});
					return aFaceIndices;
				},
				get indices() {
					var _this5 = this;
					var indices = [],
					    colors = [];
					if (settings.object.geometry.indices[0].length !== 0) {
						var _edges2 = settings.object.geometry.indices[0];
						for (var i = 0; i < _edges2.length; i++) {
							var edge = _edges2[i];
							if (edge !== undefined) {
								if (edge.length === undefined) edge = [0, 1];
								if (edge.length !== 2) {
									console.error('ND.geometry.D3.get indices: invalid edge.length = ' + edge.length);
									return;
								}
								if (edge[0] === edge[1]) {
									console.error('ND.geometry.D3.get indices: duplicate edge index = ' + edge[0]);
									return;
								}
								edge.forEach(function (vertice) {
									return indices.push(vertice);
								});
								if (this.color && _typeof(this.color) != "object") {
									(function () {
										var hexToRgb = function hexToRgb(hex) {
											var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
											return result ? {
												r: parseInt(result[1], 16),
												g: parseInt(result[2], 16),
												b: parseInt(result[3], 16)
											} : null;
										};
										var push = function push() {
											colors.push(rgb.r);
											colors.push(rgb.g);
											colors.push(rgb.b);
										};
										var color = new THREE.Color(_this5.color);
										var rgb = hexToRgb(color.getHexString());
										push();
										if (_edges2.length === 1) push();
									})();
								}
							} else console.error('ND.geometry.D3.get indices: invalid edge. Возможно вычислены не все точки пересечения');
						}
						if (this.color && _typeof(this.color) === "object") {
							if (colors.length != 0) console.error('ND.geometry.D3.get vrtices colors: Invalid colors.length = ' + colors.length);
							settings.object.geometry.position.forEach(function (vertice) {
								var rgb = settings.options.palette.toColor(vertice.w, settings.options.scales.w.min, settings.options.scales.w.max);
								colors.push(rgb.r);
								colors.push(rgb.g);
								colors.push(rgb.b);
							});
						}
					}
					return { indices: indices, colors: colors };
				}
			}
		};
		var points = [];
		for (var i = 0; i < geometry.position.length; i++) {
			points.push(geometry.position[i].point);
		}_this2.getPoint = function (i) {
			return points[i];
		};
		_this2.setPositionAttributeFromPoints(points);
		vectorPlane = vectorPlane || new Vector(settings.vectorPlane);
		if (!vectorPlane || !vectorPlane.point) vectorPlane = new Vector(vectorPlane);
		var objectIntersect;
		_this2.opacity = function (object3D, transparent, opacity) {
			_ND.verticesOpacity(transparent, opacity);
		};
		var selectSegment = {
			line: undefined,
			removeLine: function removeLine(line) {
				if (line) {
					line.parent.remove(line);
					line = undefined;
				}
				return line;
			},
			opacityDefault: 0.3,
			opacityItem: function opacityItem(item, parentObject, transparent) {
				var opacity = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : selectSegment.opacityDefault;
				if (!item.material) return;
				if (transparent && opacity === 0 && Object.is(item.parent, parentObject)) parentObject.remove(item);else {
					if (!item.parent) parentObject.add(item);
					_ND.opacity(item, transparent, opacity);
				}
			}
		};
		function create3DObject(geometry) {
			var settings3D = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
			var nD = void 0;
			if (!geometry.D3) {
				nD = new ND(n, {
					plane: true,
					object: { geometry: geometry, color: settings3D.color }
				});
				geometry = nD.geometry;
			} else nD = _ND;
			if (geometry.position.length === 0) return;
			var color = settings3D.color || 'white';
			geometry.D3.color = color;
			var indices3D = geometry.D3.indices,
			    indices = indices3D.indices;
			var buffer = nD.bufferGeometry;
			if (settings3D.faces) {
				if (settings3D.faces === true) settings3D.faces = {};
				if (settings3D.faces.color === undefined) settings3D.faces.color = color;
				if (settings3D.faces.opacity === undefined) settings3D.faces.opacity = 0.5;
				if (settings3D.faces.transparent === undefined) settings3D.faces.transparent = true;
				buffer.setIndex(geometry.D3.faceIndices);
				buffer.computeVertexNormals();
			} else buffer.setIndex(indices);
			var lineBasicMaterialParameters = void 0;
			lineBasicMaterialParameters = {
				vertexColors: true,
				toneMapped: false
			};
			if (settings.object.geometry.opacity) lineBasicMaterialParameters.transparent = true;
			var object = indices.length > 1 ? settings3D.faces ? new THREE.Mesh(buffer, new THREE.MeshLambertMaterial({
				color: color,
				opacity: settings3D.faces.opacity,
				transparent: settings3D.faces.transparent,
				side: THREE.DoubleSide
			})) : new THREE.LineSegments(buffer, new THREE.LineBasicMaterial(lineBasicMaterialParameters)) : new THREE.Points(buffer, new THREE.PointsMaterial({
				color: color,
				sizeAttenuation: false,
				size: options.point.size / (options.point.sizePointsMaterial * 2)
			}));
			if (settings3D.name) object.name = settings3D.name;
			scene.add(object);
			object.userData.myObject = nD;
			object.userData.geometry = geometry.geometry;
			object.userData.onMouseDown = function (intersection) {
				var indices = geometry.geometry.indices,
				    segmentIndex = 0,
				segment = indices[segmentIndex],
				    selectedIndex = segment.selected;
				selectSegment.line = selectSegment.removeLine(selectSegment.line);
				var opacityDefault = intersection.event && intersection.event.button === 0 ? selectSegment.opacityDefault : 1,
				    parentObject = object;
				function opacity() {
					var transparent = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
					var opacity = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : opacityDefault;
					scene.children.forEach(function (item) {
						return selectSegment.opacityItem(item, parentObject, transparent, opacity);
					});
				}
				opacity();
				var buffer = new THREE.BufferGeometry().setFromPoints(geometry.D3.points);
				var lineIndices = [];
				function createIndices(item, level) {
					if (level > 0) {
						level--;
						for (var i = 0; i < item.length; i++) {
							createIndices(indices[level][item[i]], level);
						}return;
					}
					var itemIndices = item.indices || item;
					if (itemIndices.length !== 2) console.error('ND: createIndices. Invalid itemIndices.length = ' + itemIndices.length);
					var boDetected = false;
					for (var lineIndicesIndex = 0; lineIndicesIndex < lineIndices.length; lineIndicesIndex += 2) {
						if (lineIndices[lineIndicesIndex] === itemIndices[0] && lineIndices[lineIndicesIndex + 1] === itemIndices[1]) {
							boDetected = true;
							break;
						}
					}
					if (!boDetected) itemIndices.forEach(function (i) {
						lineIndices.push(i);
					});
				}
				createIndices(segment[selectedIndex], segmentIndex);
				selectSegment.line = new THREE.LineSegments(buffer.setIndex(lineIndices), new THREE.LineBasicMaterial({ color: object.material.color }));
				parentObject.add(selectSegment.line);
			};
			object.userData.nd = function (fParent, dat) {
				var gui = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
				var boUpdate = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
				if (!object.userData.nd.update) object.userData.nd.update = function () {
					object.userData.nd(fParent, dat, gui, true);
				};
				if (!boUpdate) {
					if (fParent.parent.fCustom) {
						fParent.parent.fCustom.parent.removeFolder(fParent.parent.fCustom);
						fParent.parent.fCustom = undefined;
					}
					if (!gui && geometry.geometry.gui) fParent.parent.fCustom = geometry.geometry.gui(fParent, dat, settings.options, _ND);
				}
				var getLanguageCode = options.getLanguageCode;
				var lang = {
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
					notSelected: 'Not selected'
				};
				var _languageCode = getLanguageCode();
				switch (_languageCode) {
					case 'ru':
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
				for (var i = fParent.__controllers.length - 1; i >= 0; i--) {
					fParent.remove(fParent.__controllers[i]);
				}
				var indices = geometry.geometry.indices,
				    segmentIndex = indices.length - 1;
				function addController(segmentIndex,
				fParent, segmentItems,
				prevLine
				) {
					_prevLine.prevLine = prevLine;
					var segment;
					if (segmentItems) {
						var _addItem2 = function _addItem2(item, i) {
							item.i = i;
							segment.push(item);
						};
						segment = [];
						if (segmentIndex === -1) {
							if (segmentItems.forEach) segmentItems.forEach(function (i) {
								return _addItem2(geometry.geometry.position[i], i);
							});else segmentItems.indices.forEach(function (i) {
								return _addItem2(geometry.geometry.position[i], i);
							});
						} else {
							var _index = indices[segmentIndex];
							segmentItems.forEach(function (i) {
								return _addItem2(_index[i].indices ? _index[i].indices : _index[i], i);
							});
						}
					} else segment = indices[segmentIndex];
					var items = { Items: [lang.notSelected] };
					var fChildSegment, line;
					var name, title;
					switch (segmentIndex) {
						case -1:
							name = lang.vertices;title = lang.verticesTitle;break;
						case 0:
							name = lang.edges;title = lang.edgesTitle;break;
						case 1:
							name = lang.faces;title = lang.facesTitle;break;
						case 2:
							name = lang.bodies;title = lang.bodiesTitle;break;
						default:
							name = lang.objects;title = lang.objectsTitle;
					}
					var fSegment = fParent.addFolder(name);
					var cDistance = void 0;
					fSegment.userData = { objectItems: true };
					dat.folderNameAndTitle(fSegment, name, title);
					switch (segmentIndex) {
						case 0:
							cDistance = dat.controllerZeroStep(fSegment, { value: 0 }, 'value');
							cDistance.domElement.querySelector('input').readOnly = true;
							dat.controllerNameAndTitle(cDistance, lang.distance, lang.distanceTitle);
							break;
					}
					var cSegment = fSegment.add(items, 'Items', defineProperty({}, lang.notSelected, -1)).onChange(function (value) {
						if (fChildSegment) {
							fChildSegment.__controllers.forEach(function (item, i) {
								var controller = fChildSegment.__controllers[i];
								if (controller.__select && controller.__select.selectedIndex != 0) {
									controller.__select.selectedIndex = 0;
									controller.__onChange();
								}
							});
							fSegment.removeFolder(fChildSegment);
							fChildSegment = undefined;
						}
						var selectedIndex = cSegment.__select.selectedIndex - 1;
						line = selectSegment.removeLine(line);
						var parentObject = object;
						function opacity() {
							var transparent = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
							var opacity = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : selectSegment.opacityDefault;
							scene.children.forEach(function (item) {
								return selectSegment.opacityItem(item, parentObject, transparent, opacity);
							});
						}
						function getOpacity() {
							return -0.1 * segmentIndex + selectSegment.opacityDefault;
						}
						function removeVerticeControls() {
							if (segmentIndex !== -1) return;
							for (var i = fSegment.__controllers.length - 1; i >= 0; i--) {
								var controller = fSegment.__controllers[i];
								if (Object.is(cSegment, controller)) continue;
								fSegment.remove(controller);
							}
						}
						if (selectedIndex === -1) {
							switch (segmentIndex) {
								case 0:
									cDistance.setValue('');
									break;
							}
							removeVerticeControls();
							if (prevLine) {
								selectSegment.opacityItem(prevLine, parentObject, false);
								if (prevLine.userData.prevLine) selectSegment.opacityItem(prevLine.userData.prevLine, parentObject, true, getOpacity());else opacity(true);
								return;
							}
							opacity(false);
							return;
						}
						if (prevLine) {
							opacity(true, 0);
							selectSegment.opacityItem(prevLine, parentObject, true, getOpacity());
							if (prevLine.userData.prevLine) selectSegment.opacityItem(prevLine.userData.prevLine, parentObject, true, 0);
						} else opacity();
						if (segmentIndex === -1) {
							removeVerticeControls();
							var vertice = settings.object.geometry.position[segment[selectedIndex].i];
							for (var i = 0; i < vertice.length; i++) {
								switch (i) {
									case 0:
									case 1:
									case 2:
										var axis;
										switch (i) {
											case 0:
												axis = options.scales.x;break;
											case 1:
												axis = options.scales.y;break;
											case 2:
												axis = options.scales.z;break;
										}
										fSegment.add(vertice, i, axis.min, axis.max, (axis.max - axis.min) / 100);
										break;
									default:
										dat.controllerZeroStep(fSegment, vertice, i);
								}
							}
						} else {
							var _createIndices = function _createIndices(item, level) {
								if (level > 0) {
									level--;
									for (var i = 0; i < item.length; i++) {
										_createIndices(indices[level][item[i]], level);
									}return;
								}
								var itemIndices = item.indices || item;
								if (itemIndices.length !== 2) console.error('ND: createIndices. Invalid itemIndices.length = ' + itemIndices.length);
								var boDetected = false;
								for (var lineIndicesIndex = 0; lineIndicesIndex < lineIndices.length; lineIndicesIndex += 2) {
									if (lineIndices[lineIndicesIndex] === itemIndices[0] && lineIndices[lineIndicesIndex + 1] === itemIndices[1]) {
										boDetected = true;
										break;
									}
								}
								if (!boDetected) itemIndices.forEach(function (i) {
									lineIndices.push(i);
								});
							};
							var _buffer = new THREE.BufferGeometry().setFromPoints(geometry.D3.points);
							var lineIndices = [];
							_createIndices(segment[selectedIndex], segmentIndex);
							line = new THREE.LineSegments(_buffer.setIndex(lineIndices), new THREE.LineBasicMaterial({ color: object.material.color }));
							switch (segmentIndex) {
								case 0:
									if (lineIndices.length != 2) {
										console.error('ND: Select edge. Invalid lineIndices.length = ' + lineIndices.length);
										break;
									}
									var position0 = geometry.geometry.position[lineIndices[0]],
									    position1 = settings.object.geometry.position[lineIndices[1]];
									if (position0.length && position1.length) cDistance.setValue(position0.distanceTo(position1));else console.error("ND: Select edge. Invalid edge's vertices distance");
									break;
							}
							line.userData.name = fSegment.name + ' ' + value;
							parentObject.add(line);
						}
						if (prevLine && line) line.userData.prevLine = prevLine;
						if (segmentIndex >= 0) fChildSegment = addController(segmentIndex - 1, fSegment, segment[selectedIndex], line);
					});
					dat.controllerNameAndTitle(cSegment, '');
					var selectedItem = 0;
					var selected = segmentIndex >= 0 ? indices[segmentIndex].selected : undefined;
					var selectedOpt;
					for (var i = 0; i < segment.length; i++) {
						var item = segment[i],
						    opt = document.createElement('option'),
						    itemIndex = item.index != undefined ? item.index : item.i != undefined ? item.i : i;
						opt.innerHTML = '(' + (item.i === undefined ? i : item.i) + ') ' + (segmentIndex === -1 ? '' : (item.indices ? item.indices : item).toString());
						opt.item = item;
						if (selected != undefined && selected === itemIndex) {
							selectedOpt = opt;
							selectedItem = i + 1;
						}
						cSegment.__select.appendChild(opt);
					}
					if (selected && !selectedOpt) console.error('ND: addController. Selected item was not detected');
					cSegment.__select[selectedItem].selected = true;
					if (selectedItem != 0) {
						cSegment.__select.selectedIndex = selectedItem;
						cSegment.setValue(cSegment.__select[selectedItem].innerHTML);
					}
					return fSegment;
				}
				var childFolders = Object.keys(fParent.__folders);
				childFolders.forEach(function (folderName) {
					var childFolder = fParent.__folders[folderName];
					childFolder.__controllers.forEach(function (item, i) {
						var controller;
						if (childFolder.userData && childFolder.userData.objectItems) controller = childFolder.__controllers[i];else if (folderName === 'indices') {
							Object.keys(childFolder.__folders).forEach(function (folderName) {
								if (!controller) {
									var folder = childFolder.__folders[folderName];
									if (folder.userData && folder.userData.objectItems) controller = folder.__controllers[i];
								}
							});
						}
						if (controller && controller.__select && controller.__select.selectedIndex != 0) {
							controller.__select.selectedIndex = 0;
							controller.__onChange();
						}
					});
					if (!childFolder.customFolder) fParent.removeFolder(childFolder);
				});
				var fPosition = fParent.addFolder(lang.position),
				    fRotation = n < 2 ? undefined : fParent.addFolder(lang.rotation);
				function rotation(i) {
					if (rotationAxes[i].length === 0) return;
					settings.object.rotation.boUseRotation = true;
					settings.object.rotation.folders[i] = {
						cRotation: fRotation.add(settings.object.rotation, i, 0, Math.PI * 2, 0.01).onChange(function (value) {
							update();
						}),
						default: settings.object.rotation[i]
					};
					var name = '',
					    title = '';
					rotationAxes[i].forEach(function (axis) {
						return name = name + (name.length === 0 ? '' : ',') + axis;
					});
					switch (n) {
						case 2:
							title = lang.rotationPointTitle;break;
						case 3:
							title = lang.rotationAxisTitle;break;
						case 4:
							title = lang.rotationPlaneTitle;break;
						case 5:
							title = lang.rotationSpaceTitle;break;
						default:
							title = lang.rotationnDSpaceTitle;break;
					}
					dat.controllerNameAndTitle(settings.object.rotation.folders[i].cRotation, n === 2 ? '2' : name, title);
					settings.object.rotation.boUseRotation = false;
				}
				var _loop3 = function _loop3() {
					var axisName = i;
					{
						var f = fPosition.addFolder(axisName);
						settings.object.position.folders[i] = {
							positionController: new PositionController(function (shift) {
								settings.object.position[axisName] += shift;
							}, { getLanguageCode: options.getLanguageCode }),
							default: settings.object.position[i]
						};
						f.add(settings.object.position.folders[i].positionController);
						settings.object.position.folders[i].cPosition = dat.controllerZeroStep(f, settings.object.position, i, function (value) {
							update();
						});
						dat.controllerNameAndTitle(settings.object.position.folders[i].cPosition, axisName);
					}
				};
				for (var i = 0; i < n; i++) {
					_loop3();
				}
				if (n === 2) rotation(0);
				else rotationAxes.forEach(function (item, i) {
						return rotation(i);
					});
				var buttonPositionDefault = fPosition.add({
					defaultF: function defaultF(value) {
						settings.object.position.folders.forEach(function (item) {
							return item.cPosition.setValue(item.default);
						});
					}
				}, 'defaultF');
				dat.controllerNameAndTitle(buttonPositionDefault, lang.defaultButton, lang.defaultPositionTitle);
				if (fRotation) {
					var buttonRotationDefault = fRotation.add({
						defaultF: function defaultF(value) {
							settings.object.rotation.folders.forEach(function (item) {
								return item.cRotation.setValue(item.default);
							});
						}
					}, 'defaultF');
					dat.controllerNameAndTitle(buttonRotationDefault, lang.defaultButton, lang.defaultRotationTitle);
				}
				addController(segmentIndex, fParent);
			};
			if (options.guiSelectPoint) options.guiSelectPoint.addMesh(object);
			object.userData.raycaster = {
				onIntersection: function onIntersection(intersection, mouse) {
					intersection.indexNew = intersection.index;
					delete intersection.index;
					Options.raycaster.onIntersection(intersection, options, scene, options.camera, options.renderer);
				},
				onIntersectionOut: function onIntersectionOut() {
					geometry.geometry.indices.forEach(function (indice) {
						return indice.selected = undefined;
					});
					Options.raycaster.onIntersectionOut(scene, options.renderer);
				},
				onMouseDown: function onMouseDown(intersection, event) {
					intersection.event = event;
					Options.raycaster.onMouseDown(intersection, options);
				},
				text: settings.object.raycaster ? settings.object.raycaster.text : undefined
			};
			if (options.eventListeners) options.eventListeners.addParticle(object);
			return object;
		}
		_this2.intersection = function () {
			var geometryIntersection = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { position: [], indices: [[]] };
			var iIntersections = arguments[1];
			if (settings.plane === false) return;
			function intersection(iEdge, aEdge) {
				for (var i = 0; i < geometryIntersection.position.length; i++) {
					if (geometryIntersection.position[i].iEdge === iEdge) {
						if (aEdge && aEdge.length < 2
						) aEdge.push(i);
						return;
					}
				}
				var edge = settings.object.geometry.indices[0][iEdge];
				edge.intersection(geometryIntersection);
				var position = edge.intersection.position;
				if (position) {
					var boAdd = true;
					if (edge.intersection.boVerticeOnPanel) {
						for (var i = 0; i < geometryIntersection.position.length; i++) {
							if (position.equals(geometryIntersection.position[i])) {
								boAdd = false;
								aEdge.boVerticeOnPanel = true;
								break;
							}
						}
					}
					if (boAdd) {
						geometryIntersection.position.push(position);
						if (aEdge) aEdge.push(geometryIntersection.position.length - 1);
					}
				}
			}
			if (!geometryIntersection.position.isProxy) geometryIntersection.position = new Proxy(geometryIntersection.position, {
				get: function get$$1(target, name, args) {
					switch (name) {
						case 'isProxy':
							return true;
						case 'target':
							return target;
						case "reset":
							return function () {
								target.forEach(function (item) {
									return item.positionWorld = undefined;
								});
							};
					}
					return target[name];
				},
				set: function set$$1(target, name, value) {
					var i = parseInt(name);
					if (isNaN(i)) {
						if (name === "boPositionError") {
							target[name] = value;
							return true;
						}
						return target[name];
					}
					if (i >= target.length) {
						var boDuplicate = false;
						for (var j = 0; j < i; j++) {
							boDuplicate = true;
							for (var k = 0; k < target[j].length; k++) {
								if (target[j][k] !== value[k]) {
									boDuplicate = false;
									break;
								}
							}
							if (boDuplicate) break;
						}
						if (!boDuplicate) target.push(value);
						return target.length;
					}
					target[i] = value;
					return true;
				}
			});
			switch (n) {
				case 1:
					if (settings.object.geometry.indices.length !== 1) console.error('ND.intersection: under constraction. Это не линия.');
					var edge = settings.object.geometry.indices[0][0];
					edge.intersection(geometryIntersection);
					break;
				case 2:
					var iFaces = settings.object.geometry.indices[1];
					if (iFaces) settings.object.geometry.indices[1].forEach(function (iFace) {
						iFace.forEach(function (iEdge) {
							intersection(iEdge);
						});
					});else {
						for (var i = 0; i < settings.object.geometry.indices[0].length; i++) {
							intersection(i);
						}
						addEdges(undefined, geometryIntersection);
					}
					break;
				default:
					{
						var iSegments = settings.iSegments || n - 2,
						segments;
						while (iSegments >= 0) {
							segments = settings.object.geometry.indices[iSegments];
							if (segments) break;
							iSegments--;
						}
						if (settings.indice === undefined) {
							for (var i = 0; i < segments.length; i++) {
								var nd = new ND(n, {
									plane: true,
									object: { geometry: {
											indices: settings.object.geometry.indices,
											position: positionWorld.copy()
										}
									}, indice: i, iSegments: iSegments }),
								    s = iSegments - 1;
								var iIntersections;
								if (s !== 0) {
									iIntersections = [];
								}
								nd.intersection(geometryIntersection, iIntersections);
								if (iIntersections && iIntersections.length) {
									geometryIntersection.indices[s] = geometryIntersection.indices[s] || proxySegments();
									geometryIntersection.indices[s].push(iIntersections);
								}
							}
							var _edges3 = geometryIntersection.indices[0];
							var vertices = [];
							for (var i = _edges3.length - 1; i >= 0; i--) {
								var _edge = _edges3[i];
								if (_edge.boVerticeOnPanel && _edge.length === 1) {
									vertices.push(_edge[0]);
									_edges3.splice(i, 1);
								}
							}
							switch (vertices.length) {
								case 0:
								case 1:
									break;
								case 2:
									_edges3.push(vertices);
									break;
								default:
									console.error('ND.intersection: invalid edge.');
							}
							if (_edges3.length > 1) {
								for (var i = 0; i < geometryIntersection.position.length; i++) {
									var verticesCount = 0;
									for (var j = 0; j < _edges3.length; j++) {
										var _edge2 = _edges3[j];
										for (var k = 0; k < _edge2.length; k++) {
											if (_edge2[k] === i) verticesCount++;
										}
									}
									if (verticesCount < 2) {
										if (verticesCount === 0) console.error('ND.intersection: Invalid verticesCount = ' + verticesCount);else vertices.push(i);
									}
								}
								if (vertices.length > 0) {
									if (vertices.length != 2) console.error('ND.intersection: invalid edge.');else _edges3.push(vertices);
								}
							}
						} else {
							var segment = segments[settings.indice];
							if (iSegments > 1) {
								for (var i = 0; i < segment.length; i++) {
									var _nd = new ND(n, {
										plane: true,
										object: settings.object, indice: segment[i], iSegments: iSegments - 1
									});
									if (n > 4) {
										if (n === 5) {
											var iIntersect = [];
											_nd.intersection(geometryIntersection, iIntersect);
											if (iIntersect.length) {
												if (iIntersect.length === 1) {
													iIntersect = iIntersect[0];
													iIntersections.push(iIntersect);
												} else {
													var ind = n - 4;
													geometryIntersection.indices[ind] = geometryIntersection.indices[ind] || proxySegments();
													geometryIntersection.indices[ind].push(iIntersect);
													if (iIntersections) iIntersections.push(iIntersect.index);
												}
											}
										} else console.error('ND.intersection: n = ' + n + ' under constraction');
									} else _nd.intersection(geometryIntersection, iIntersections);
								}
							} else {
								var _edge3 = [];
								if (segment.indices) segment = segment.indices;
								for (var i = 0; i < segment.length; i++) {
									intersection(segment[i], _edge3);
								}
								if (_edge3.length > 0) {
									if (_edge3.length !== 2 || _edge3[0] === _edge3[1]) {
										if (!_edge3.boVerticeOnPanel) {
											var error = 'ND.intersection: invalid edge';
											console.error(error);
											return;
										}
									}
									var intersectionEdges = geometryIntersection.indices[0];
									var duplicateEdge = false;
									for (var i = 0; i < intersectionEdges.length; i++) {
										var intersectionEdge = intersectionEdges[i];
										if (intersectionEdge[0] === _edge3[0] && intersectionEdge[1] === _edge3[1] || intersectionEdge[0] === _edge3[1] && intersectionEdge[1] === _edge3[0]) {
											duplicateEdge = true;
											if (iIntersections) iIntersections.push(i);
											break;
										}
									}
									if (!duplicateEdge) {
										if (iIntersections) iIntersections.push(intersectionEdges.length);
										intersectionEdges.push(_edge3);
									}
								}
							}
						}
					}
			}
			if (settings.onIntersection) settings.onIntersection(geometryIntersection);
			if (scene) {
				if (objectIntersect) {
					if (options.guiSelectPoint) options.guiSelectPoint.removeMesh(objectIntersect);
					scene.remove(objectIntersect);
					if (options.eventListeners) options.eventListeners.removeParticle(objectIntersect);
				}
				if (geometryIntersection.position.length) objectIntersect = create3DObject(geometryIntersection, { name: 'Intersection', color: 'white' });
			}
			return geometryIntersection.position;
		};
		var THREE = three$1.THREE,
		    scene = settings.scene;
		if (scene) {
			if (n <= 1) options.scales.y = undefined;
			if (n <= 2) options.scales.z = undefined;
			options.scales.text.rect = options.scales.text.rect || {};
			options.scales.text.rect.displayRect = false;
			options.scales.text.precision = 2;
		}
		var object3D;
		function projectTo3D() {
			if (!scene) return;
			if (object3D) {
				for (var i = object3D.children.length - 1; i >= 0; i--) {
					var child = object3D.children[i];
					if (child instanceof THREE.Sprite) {
						object3D.remove(child);
						if (options.guiSelectPoint) options.guiSelectPoint.removeMesh(child);
					}
				}
				scene.remove(object3D);
				if (options.guiSelectPoint) options.guiSelectPoint.removeMesh(object3D);
				options.eventListeners.removeParticle(object3D);
				object3D = undefined;
			}
			object3D = create3DObject(geometry, {
				name: settings.object.name,
				faces: settings.object.faces,
				color: settings.object.color || _ND.defaultColor
			});
		}
		projectTo3D();
		var Plane = function Plane() {
			classCallCheck(this, Plane);
			var mesh;
			this.createMesh = function () {
				if (!scene) return;
				var color = 0x0000FF;
				switch (n) {
					case 1:
						options.point.size = (options.scales.x.max - options.scales.x.min) * 500;
						mesh = new THREE.Points(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0)], 3), new THREE.PointsMaterial({
							color: color,
							sizeAttenuation: false
						}));
						break;
					case 2:
						mesh = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(options.scales.x.min, 0, 0), new THREE.Vector3(options.scales.x.max, 0, 0)]), new THREE.LineBasicMaterial({ color: color }));
						break;
					case 3:
						mesh = new THREE.GridHelper(2, 10, color, color);
						mesh.rotation.x = Math.PI / 2;
						break;
					default:
						{
							return;
						}
				}
				mesh.name = 'Plane';
				scene.add(mesh);
				if (options.guiSelectPoint) options.guiSelectPoint.addMesh(mesh);
				mesh.position.copy(vectorPlane.point);
				mesh.userData.raycaster = {
					onIntersection: function onIntersection(intersection, mouse) {
						delete intersection.index;
						Options.raycaster.onIntersection(intersection, options, scene, options.camera, options.renderer);
					},
					onIntersectionOut: function onIntersectionOut() {
						Options.raycaster.onIntersectionOut(scene, options.renderer);
					},
					onMouseDown: function onMouseDown(intersection) {
						Options.raycaster.onMouseDown(intersection, options);
					}
				};
				options.eventListeners.addParticle(mesh);
				vectorPlane.onChange = function () {
					mesh.position.copy(vectorPlane.point);
					mesh.updateMatrix();
				};
			};
		};
		if (settings.plane === undefined) settings.plane = false;
		if (settings.plane) {
			var plane = new Plane();
			plane.createMesh();
		}
		_this2.vectorPlane;
		_this2.geometry;
		Object.defineProperties(_this2, {
			vectorPlane: {
				get: function get$$1() {
					return vectorPlane;
				}
			},
			geometry: {
				get: function get$$1() {
					return geometry;
				},
				set: function set$$1(geometryNew) {
					geometry.geometry = geometryNew;
					settings.object.name = 'Object';
					settings.object.rotation.clear();
					settings.object.position.clear();
					projectTo3D();
					this.intersection();
				}
			},
			object3D: {
				get: function get$$1() {
					return object3D;
				}
			},
			object: {
				get: function get$$1() {
					return settings.object;
				},
				set: function set$$1(object) {
					if (!object) {
						console.error('ND.object set: invalid object');
						return;
					}
					if (!object.update) settings.object = object;
					var p = object.position;
					if (p) settings.object.position = [].concat(toConsumableArray(p));
					var r = object.rotation;
					if (r) {
						if (r instanceof Array) settings.object.rotation = [].concat(toConsumableArray(r));else settings.object.rotation = r;
					}
					settings.object.name = settings.object.name || 'Object';
					if (object.geometry.indices) {
						var _indices = [];
						object.geometry.indices.forEach(function (array) {
							var item = [];
							_indices.push(item);
							array.forEach(function (index) {
								if (index.indices) item.push(index.indices);else item.push(index);
							});
						});
						settings.object.geometry.indices = _indices;
					}
					setIndices();
					setEdges();
					if (!settings.object.geometry.indices[0].isProxy) settings.object.geometry.indices[0] = proxyEdges(object.geometry.indices[0]);
					settings.object.position = proxyPosition();
					settings.object.rotation = proxyRotation();
					settings.object.geometry.position = proxyGeometryPosition();
					settings.object.geometry.position.reset();
					appendEdges();
					if (object.update) {
						object3D.geometry.setFromPoints(geometry.D3.points).setIndex(geometry.D3.indices.indices);
						if (settings.options && settings.options.guiSelectPoint) settings.options.guiSelectPoint.updatePoints();
						return;
					}
					projectTo3D();
					this.intersection();
				}
			}
		});
		return _this2;
	}
	createClass(ND, [{
		key: 'defaultColor',
		get: function get$$1() {
			return 'lime';
		}
	}]);
	return ND;
}(MyObject);
ND.gui = function () {
	function _class(options, dat, fParent) {
		classCallCheck(this, _class);
		var getLanguageCode = options.getLanguageCode;
		var lang = {
			nD: 'nD',
			nDTitle: 'n-dimensional object'
		};
		var _languageCode = getLanguageCode();
		switch (_languageCode) {
			case 'ru':
				lang.nDTitle = 'n-мерный объект';
				break;
		}
		var fND = fParent.addFolder(lang.nD);
		dat.folderNameAndTitle(fND, lang.nD, lang.nDTitle);
		this.object = function (object, dat) {
			var display = 'none';
			if (object && object.userData.nd) {
				display = 'block';
				object.userData.nd(fND, dat);
			} else Object.keys(fND.__folders).forEach(function (key) {
				var folder = fND.__folders[key];
				if (!folder.userData || folder.userData.objectItems === undefined) return;
				folder.__controllers.forEach(function (cSegment) {
					if (cSegment.__select) {
						var selectedItem = 0;
						cSegment.__select.selectedIndex = selectedItem;
						cSegment.setValue(cSegment.__select[selectedItem].innerHTML);
					}
				});
			});
			if (object) fND.domElement.style.display = display;
		};
	}
	return _class;
}();
ND.VectorN = function () {
	function _class2(n, array) {
		classCallCheck(this, _class2);
		if (array.isVector) return array;
		if (array instanceof Array === false) {
			if (typeof array === 'number') array = [array];else if (array.array) array = array.array;else console.error('FermatSpiral: Vector: invalid array type');
		}
		if (n !== undefined) while (array.length < n) {
			array.push(0);
		}
		return new Proxy(array, {
			get: function get$$1(target, name) {
				var i = parseInt(name);
				if (isNaN(i)) {
					switch (name) {
						case "array":
							return array;
						case "add":
							return function (v) {
								target.forEach(function (value, i) {
									return target[i] += v[i];
								});
								return this;
							};
						case "index":
							return vectorSettings.index;
						case "isVector":
							return true;
						default:
							console.error('ND: Vector get. Invalid name: ' + name);
					}
					return;
				}
				if (i >= n) return 0;
				if (array.length > n && settings.object.geometry.iAxes && i < settings.object.geometry.iAxes.length) i = settings.object.geometry.iAxes[i];
				return array[i];
			}
		});
	}
	return _class2;
}();
if (!Number.prototype.between) Number.prototype.between = function (a, b, inclusive) {
	var min = Math.min.apply(Math, [a, b]),
	    max = Math.max.apply(Math, [a, b]);
	return inclusive ? this >= min && this <= max : this > min && this < max;
};
if (Array.prototype.equals) console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
Array.prototype.equals = function (array) {
	if (!array) return false;
	if (this.length != array.length) return false;
	for (var i = 0, l = this.length; i < l; i++) {
		if (this[i] instanceof Array && array[i] instanceof Array) {
			if (!this[i].equals(array[i])) return false;
		} else if (this[i] != array[i]) {
			return false;
		}
	}
	return true;
};
Object.defineProperty(Array.prototype, "equals", { enumerable: false });

export default ND;
//# sourceMappingURL=nD.module.js.map
