/**
 * @module loadPositions.
 *
 * @description Loads positions of the Three.js objects
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

import * as fileHandler from './fileHandler.js';
import * as utils from './HyperSphere/utilsHSphere.js'

const sLoadPositions = 'loadPositions';

/**
 * Loads positions of the Three.js objects
 * @param {object} classSettings See <a href="../../HyperSphere/jsdoc/module-HyperSphere-HyperSphere.html" target="_blank">HyperSphere classSettings</a>.
 * @param {object} myThreeOptions See <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> <b>options</b> parameter.
*/
export default async function loadPositions(classSettings, myThreeOptions) {
	const settings = classSettings.settings, geometry = settings.object.geometry;
	if (!geometry.positionsFileName) return;
	const THREE = window.__myThree__.three.THREE;
	try {
		// Получаем массив координат из файла
		geometry.positions = await fileHandler.loadBinary('./' + geometry.positionsFileName);
		delete geometry.angles;
/*		
		const timesCount = myThreeOptions.playerOptions.marks === undefined ? 10 : myThreeOptions.playerOptions.marks,
			itemSize = 4,
			verticesCount = positions.length / itemSize,
			positionLengt = verticesCount * timesCount;
//			anglesLength = positions.length / itemSize;
*/
/*		
//		geometry.positions = positions;
		if (!Number.isInteger(anglesLength)) console.error(sLoadPositions + ': Invalid angles length = ' + anglesLength);
		settings.bufferGeometry = new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(positionLengt * itemSize), itemSize));
		Object.defineProperty(settings.bufferGeometry.userData, 'timeId', {

			get: () => { return 0; },
			set: (timeIdNew) => { },//ignore timeIdNew
			configurable: true,//https://stackoverflow.com/a/25518045/5175935

		});
		const positionsArray = settings.bufferGeometry.attributes.position.array;
		for (let i = 0; i < positions.length; i++)
			positionsArray[i] = positions[i];
		classSettings.settings.object.geometry = new Proxy(geometry, {
			get(target, name) {
				switch (name) {
					case 'angles': return new Proxy([], {
						get(target, name) {
							const positionId = parseInt(name);
							if (!isNaN(positionId)) return ;
							switch (name) {
								case 'length': 
									return anglesLength;
							}
							return target[name];
						}
					});
				}
				return geometry[name];
			}
		});
*/
/*		
		const bufferGeometry = new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(positionLengt * itemSize), itemSize));
		const positionsArray = bufferGeometry.attributes.position.array;
		for (let i = 0; i < positions.length; i++)
			positionsArray[i] = positions[i];
		delete geometry.angles;
		geometry.angles = [];
		for (let verticeId = 0; verticeId < verticesCount; verticeId++)
			geometry.angles.push(utils.cartesianToPolar(new THREE.Vector4().fromBufferAttribute(bufferGeometry.attributes.position, verticeId), true));
		positions = null;
*/		
	} catch (error) {
		let errorMessage = 'Failed to load: ' + error, sHelp = '';
		switch (error.code) {
			case 404: sHelp =
				`<!-- white-space: nowrap запрещает перенос строк, заставляя окно растягиваться -->
<ul style="padding-left: 20px; line-height: 1.6; white-space: nowrap;">
    <li>Rename file name in <b>classSettings.settings.object.geometry.positionsFileName</b>.</li>
    <li>Select <b>"`+ error.baseUrl + `"</b> folder.<br>Go to <b>Settings/Hypersphere/Save</b> in the right top corner of the canvas for it.</li>
</ul>`;
		}
		// Возвращаем Promise, чтобы await приостанавливал выполнение loadPositions
		function showAutoWidthModal() {
			return new Promise((resolve) => {
				const dialog = document.createElement('dialog');

				// Базовые стили для аккуратного вида
				dialog.style.padding = '20px';
				dialog.style.borderRadius = '8px';
				dialog.style.border = '1px solid #ccc';
				dialog.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';

				// ВАЖНО: убираем ограничение maxWidth и ставим width: max-content
				dialog.style.width = 'max-content';
				dialog.style.maxWidth = '90vw'; // Защита от выхода за границы экрана (90% ширины экрана)

				dialog.innerHTML = `
<h3 style="margin-top: 0; color: #333;">` + errorMessage + `</h3>
`+ sHelp + `
    
<div style="text-align: right; margin-top: 15px;">
    <button id="closeModalBtn" style="padding: 6px 12px; cursor: pointer;">Close</button>
</div>
`;

				document.body.appendChild(dialog);

				dialog.querySelector('#closeModalBtn').addEventListener('click', () => {
					dialog.close();
					dialog.remove();
					resolve(); // <-- РАЗРЕШАЕМ Promise ТОЛЬКО ПРИ НАЖАТИИ КНОПКИ
				});

				dialog.showModal();
			});
		}

		// Ждем, пока пользователь нажмет "CLOSE"
		await showAutoWidthModal();
	}
}
//export default loadPositions;