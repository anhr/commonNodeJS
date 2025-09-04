/**
 * @module getHyperSphere
 * @description Returns a <a href="../../jsdoc/module-HyperSphere-HyperSphere.html" target="_blank">Hypersphere</a> with random vertices.
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
 * 
 * @param {Circle|Sphere|HyperSphere3D} HyperSphere See <a href="../../jsdoc/module-Circle.html" target="_blank">Circle</a>,
 * <a href="../../jsdoc/module-Sphere.html" target="_blank">Sphere</a>,
 * <a href="../../jsdoc/module-HyperSphere3D.html" target="_blank">HyperSphere3D</a>,
 * @param {Options} options See <a href="../../../../master/jsdoc/Options/Options.html" target="_blank">Options</a>.
 * @param {THREE.Scene} scene [THREE.Scene]{@link https://threejs.org/docs/index.html?q=sce#api/en/scenes/Scene}
 * @param {string} randomVertices Array of the random vertices. See <b>classSettings.settings.object.geometry</b> of <a href="../../jsdoc/module-HyperSphere-HyperSphere.html" target="_blank">Hypersphere</a>.
 * @param {object} [settings={}] The following settings are available
 * @param {object} [settings.debug={}] See <b>params.debug</b> of the <a href="../jsdoc/module-RandomVertice-RandomVertice.html" target="_blank">RandomVertice</a>.
 * @param {float} [settings.r=1.0] HyperSphere radius.
 * @param {string} [settings.name] HyperSphere name. Default names see <b>classSettings.settings.object.name</b> of <a href="../../jsdoc/module-HyperSphere-HyperSphere.html" target="_blank">Hypersphere</a>.
 * @param {string} [settings.color] HyperSphere color. Default color see <b>classSettings.settings.object.color</b> of <a href="../../jsdoc/module-HyperSphere-HyperSphere.html" target="_blank">Hypersphere</a>.
 * @returns A <a href="../../jsdoc/module-HyperSphere-HyperSphere.html" target="_blank">Hypersphere</a> with random vertices.
 */
const getHyperSphere = (HyperSphere, options, scene, randomVertices, settings={}) => {

	let hsRandomVertice;
	hsRandomVertice = new HyperSphere(options, {

		boRemove: false,//Если не установить этот флаг, то при замене старого hsRandomVertice на новый будут удаляться все гиперсферы на scene. То есть удалится hsVertices
		r: settings.r,
		edges: false,
		//randomArc: true,
		projectParams: { scene: scene, },
		//				debug: debug,
		debug: settings.debug,
		//debug: false,
		settings: {

			object: {

				name: settings.name,
				color: settings.color,
				geometry: randomVertices,

			},
			overriddenProperties: { setDrawRange: (start, count) => { if (hsRandomVertice) hsRandomVertice.bufferGeometry.setDrawRange(start, count); } },

		},

	});
	return hsRandomVertice;

}
export default getHyperSphere;
