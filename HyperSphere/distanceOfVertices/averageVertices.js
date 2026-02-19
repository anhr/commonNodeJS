/**
 * @module middleVertices
 * @description Moves vertices to the middle position of the opposite vertices of the vertice edges
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

import ProgressBar from '../../ProgressBar/ProgressBar.js'

const averageVertices = (data) => {

	const timeId = data.timeId,
		classSettings = data.classSettings,
		settings = classSettings.settings,
		_this = data.this,
		options = data.options,
		t = data.t;
	if (timeId === 0) return;//не вычисляется средняя точка когда проигрыватель в начале
	const geometry = settings.object.geometry, position = geometry.position, edges = geometry.indices.edges;
	if (edges.length === 0) {

		//Create edges
		this.onSelectScene = () => {

			//Непонятно как сюда попадает
			options.onSelectScene(t);
			delete this.onSelectScene;

		}
		if (cEdges) cEdges.setValue(true);
		else {

			//нет ручной настройки
			classSettings.edges = cookieOptions.edgesOld || edgesOld;
			_this.projectGeometry();

		}
		return;

	}
	let progressBar, verticeId = 0;
	const overriddenProperties = classSettings.overriddenProperties,
		vertices = overriddenProperties.vertices(),
		timestamp = classSettings.debug ? window.performance.now() : undefined,
		step = () => {

			progressBar.value = verticeId;
			const stepItem = () => {

				const vertice = overriddenProperties.position0.angles[verticeId].averageVertice(undefined, timeId, true, false, false);
				if (vertices) vertices.push(vertice);
				verticeId += 1;
				if (verticeId >= position.length) {

					progressBar.remove();

					if (classSettings.debug) classSettings.debug.logTimestamp('Play step. ', timestamp);

					//Обновление текущей вершины без обновления холста для экономии времени
					overriddenProperties.updateVertices(vertices);

					if (classSettings.debug) {

						classSettings.debug.logTimestamp('Copy vertices. ', timestamp);
						_this.logHyperSphere();

					}
					else _this.oldR = undefined;
					_this.onSelectSceneEnd(timeId);
					return true;

				}

			}
			if (!stepItem()) progressBar.step();

		},
		bufferGeometry = classSettings.settings.bufferGeometry,
		drawRange = bufferGeometry.drawRange,
		sTakeMiddleVertices = 'Take middle vertices';
	if (classSettings.debug.log != false) console.log('\ntimeId = ' + timeId + '. ' + sTakeMiddleVertices + '.')

	//Установить drawRange что бы не появлялась ошибка
	//HyperSphere.angles2Vertice: anglesId = 2. positionId = 28 is out of range from 0 to 24
	_this.setVerticesRange(drawRange.start,
		((drawRange.start + drawRange.count) / (bufferGeometry.index != null ? bufferGeometry.attributes.position.itemSize : 1)) + position.length);

	progressBar = new ProgressBar(options.renderer.domElement.parentElement, step, {

		sTitle: 't = ' + t + '<br> ' + sTakeMiddleVertices,
		max: position.length - 1,

	});

}
averageVertices.verticeProxy = (vertice, classSettings, _this, verticeId, position) => {

	return new Proxy(vertice, {

		get: (angles, name) => {

			switch (name) {

				case 'averageVertice': return (oppositeVerticesId = vertice.oppositeVerticesId, timeId, boPushMiddleVertice = true, boCloud = false, boCreateHypersphere = true) => {

					//find middle vertice between opposite vertices

					const oppositeVertices = [];
					oppositeVerticesId.forEach(oppositeAngleId => {

						const oppositeVertice = classSettings.overriddenProperties.oppositeVertice(oppositeAngleId, timeId);
						oppositeVertices.push(oppositeVertice);

					});

					let middleVertice = _this.vertice2angles(classSettings.distanceOfVertices.averageDistance(oppositeVertices, boCloud, boCreateHypersphere, _this));
					if (boPushMiddleVertice) classSettings.overriddenProperties.pushMiddleVertice(timeId, middleVertice);
					if (classSettings.randomMiddleVertice) {
						
						middleVertice = new averageVertices.RandomVertice({
						
							arc: _this.arc,
							oppositeVertice: middleVertice,
							classSettings: classSettings,//используется для вычисления случайной точки в RandomVerticeHSphere HyperSphereNavigator.calculateNewPoint
							
						}).angles[0];
						
					}
					
					if (classSettings.debug && classSettings.debug.middleVertice) {

						console.log('opposite to vertice[' + verticeId + '] vertices:');
						oppositeVerticesId.forEach(oppositeVerticeId => {

							const verticeAngles = position[oppositeVerticeId].angles;
							console.log('vertice[' + oppositeVerticeId + '] anlges: ' + JSON.stringify(verticeAngles));

						});
						console.log('Middle vertice ' + JSON.stringify(_this.angles2Vertice(middleVertice, timeId)) + ' angles: ' + JSON.stringify(middleVertice));

					}
					
					return middleVertice;

				}

			}
			return angles[name];

		},

	});

}
averageVertices.randomVertices = (middleVerticeAngles, scene, boCloud = false, boCreateHypersphere = true, _this, RandomVertice) => {
	
//	const classSettings = this.classSettings;
	const classSettings = _this.classSettings;
	if (!classSettings.randomArc) return;

	if (!_this.params) _this.params = {
			
			debug: classSettings.debug ? { notRandomVertices: true,} : false,
			classSettings: classSettings,//используется для вычисления случайной точки в RandomVerticeHSphere HyperSphereNavigator.calculateNewPoint
			
		}
	_this.params.oppositeVertice = middleVerticeAngles;
	_this.params.arc = _this.arc;
	
	if (_this.randomVertice && (boCloud === false) && (boCreateHypersphere === false)) _this.randomVertice.params = _this.params;//Делается очередной шаг проигрывателя и это уже не первая точка
	else {
		
		if (_this.randomVertice) _this.randomVertice.paramsVerticeOnChange();
		else _this.randomVertice = new RandomVertice(_this.params, boCloud ? 200 : 1);

	}
	if (boCreateHypersphere) {
		
		if (!_this.hsRandomVertice) _this.hsRandomVertice = _this.randomVertice.getHyperSphere(classSettings, scene, _this.middleVerticeColor);

	}
	
}
export default averageVertices;