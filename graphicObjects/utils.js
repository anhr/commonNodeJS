/**
 * @module Utils
 * @description utilities class.
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

import ND from '../nD/nD.js';
//import ND from '../nD/build/nD.module.js';
//import ND from '../nD/build/nD.module.min.js';
//import ND from 'https://raw.githack.com/anhr/commonNodeJS/master/nD/nD.js';
//import ND from 'https://raw.githack.com/anhr/commonNodeJS/master/nD/build/nD.module.js';
//import ND from 'https://raw.githack.com/anhr/commonNodeJS/master/nD/build/nD.module.min.js';
if (ND.default) ND = ND.default;

import three from '../three.js'

class Utils {

	constructor( options, settings ) {

		this.debug = true;

		//display graphic object to the canvas
		this.display = (n,//space dimension
			settings, debugObject) => {

			settings.options = options;
			settings.object.name = settings.object.name || lang.name;
			new ND(n, settings);

			if (debugObject) settings.scene.add(debugObject);

		}

		this.remove = (scene) => {

			for (var i = scene.children.length - 1; i >= 0; i--) {

				const child = scene.children[i];
				scene.remove(child);
				if (options.guiSelectPoint) options.guiSelectPoint.removeMesh(child);

			}
			//remove previous position
			//непонятно зачем эта строка
//			settings.object.geometry.position.forEach(vertice => vertice.length = 0);

		}

		//Project a graphic object into 3D space
		this.projectUtils = (
			scene,
			n = 2,//space dimension
		) => {

			//remove previous universe
			this.remove(scene);

			const THREE = three.THREE, indices = settings.object.geometry.indices;

			//universe length
			let l = 0;
			indices.faceEdges.forEach(edge => l += edge.distance);
			if (isNaN(l)) {

				console.error(sEdges + ': project(...). Invalid universe length = ' + l);
				return;

			}
			const r = l / (2 * Math.PI),
				center = new THREE.Vector2(0.0, 0.0),
				axis = new THREE.Vector3(0, 0, 1),
				point0 = new THREE.Vector3(0, -r, 0),
				delta = 2 * Math.PI / l;
			settings.object.geometry.position[0] = point0.toArray();
			let angle = 0.0;//Угол поворота радиуса вселенной до текущей вершины
			for (let i = 1; i < indices.faceEdges.length; i++) {

				angle += indices.faceEdges[i].distance * delta;
				if (settings.object.geometry.position[i].length === 0) settings.object.geometry.position[i] = new THREE.Vector3().copy(point0).applyAxisAngle(axis, angle).toArray();

			}

			settings.scene = scene;

			this.display(n, settings, this.debug ?
				new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(new THREE.EllipseCurve(
					center.x, center.y,// Center x, y
					r, r,// x radius, y radius
					0.0, 2.0 * Math.PI,// Start angle, stop angle
				).getSpacedPoints(256)), new THREE.LineBasicMaterial({ color: 'blue' }))
				: undefined
			);

		}

	}

}

Utils.ND = ND;

export default Utils;