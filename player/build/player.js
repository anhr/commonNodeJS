/**
 * @module Player
 * @description 3D objects animation.
 *
 * @author [Andrej Hristoliubov]{@link https://anhr.github.io/AboutMe/}
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('https://raw.githack.com/anhr/commonNodeJS/master/dat/dat.module.js'), require('https://raw.githack.com/anhr/commonNodeJS/master/ScaleController.js'), require('https://raw.githack.com/anhr/commonNodeJS/master/PositionController.js'), require('https://raw.githack.com/anhr/colorpicker/master/colorpicker.js')) :
	typeof define === 'function' && define.amd ? define(['exports', 'https://raw.githack.com/anhr/commonNodeJS/master/dat/dat.module.js', 'https://raw.githack.com/anhr/commonNodeJS/master/ScaleController.js', 'https://raw.githack.com/anhr/commonNodeJS/master/PositionController.js', 'https://raw.githack.com/anhr/colorpicker/master/colorpicker.js'], factory) :
	(factory((global.player = {}),global.dat_module_js,global.ScaleController,global.PositionController,global.ColorPicker));
}(this, (function (exports,dat_module_js,ScaleController,PositionController,ColorPicker) { 'use strict';

ScaleController = ScaleController && ScaleController.hasOwnProperty('default') ? ScaleController['default'] : ScaleController;
PositionController = PositionController && PositionController.hasOwnProperty('default') ? PositionController['default'] : PositionController;
ColorPicker = ColorPicker && ColorPicker.hasOwnProperty('default') ? ColorPicker['default'] : ColorPicker;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};



















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

/**
 * @module GuiSelectPoint
 *
 * @description A dat.gui based graphical user interface for select a point from the mesh.
 *
 * @see {@link https://github.com/anhr/dat.gui|dat.gui}, {@link https://threejs.org/docs/index.html#api/en/objects/Mesh|three.js mesh}.
 *
 * @author Andrej Hristoliubov. {@link https://anhr.github.io/AboutMe/|AboutMe}
 *
 * @copyright 2011 Data Arts Team, Google Creative Lab
 *
 * @license under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
*/
var THREE$1;
function GuiSelectPoint(_THREE, guiParams) {
	GuiSelectPoint.setTHREE(_THREE);
	guiParams = guiParams || {};
	var axesHelper = guiParams.axesHelper,
	    options = guiParams.options || (axesHelper ? axesHelper.options : undefined) || {
		scales: {
			x: {
				name: 'x',
				min: -1,
				max: 1
			},
			y: {
				name: 'y',
				min: -1,
				max: 1
			},
			z: {
				name: 'z',
				min: -1,
				max: 1
			}
		}
	},
	guiSelectPoint = this;
	var cFrustumPoints;
	var getLanguageCode = guiParams.getLanguageCode || function () {
		return 'en';
	};
	var lang = {
		meshs: 'Meshs',
		notSelected: 'Not selected',
		select: 'Select',
		position: 'Position',
		rotation: 'Rotation',
		points: 'Points',
		point: 'Point Local Position',
		pointTitle: 'The position attribute of the selected point',
		pointWorld: 'Point World Position',
		pointWorldTitle: 'The position of the selected point after scaling, moving and rotation of the mesh',
		mesh: 'Mesh',
		scale: 'Scale',
		color: 'Сolor',
		opacity: 'Opacity',
		opacityTitle: 'Float in the range of 0.0 - 1.0 indicating how transparent the material is. A value of 0.0 indicates fully transparent, 1.0 is fully opaque.',
		defaultButton: 'Default',
		defaultScaleTitle: 'Restore default 3d object scale.',
		defaultPositionTitle: 'Restore default 3d object position.',
		default3DObjectTitle: 'Restore default settings of all 3d objects.',
		defaultRotationTitle: 'Restore default 3d object rotation.',
		defaultLocalPositionTitle: 'Restore default local position.',
		moveGroup: 'Move Scene'
	};
	var _languageCode = getLanguageCode();
	switch (_languageCode) {
		case 'ru':
			lang.meshs = '3D объекты';
			lang.notSelected = 'Не выбран';
			lang.select = 'Выбрать';
			lang.position = 'Позиция';
			lang.rotation = 'Вращение';
			lang.points = 'Точки';
			lang.point = 'Локальная позиция точки';
			lang.pointTitle = 'Position attribute выбранной точки';
			lang.pointWorld = 'Абсолютная позиция точки';
			lang.pointWorldTitle = 'Позиция выбранной точки после масштабирования, перемещения и вращения 3D объекта';
			lang.mesh = '3D объект';
			lang.scale = 'Масштаб';
			lang.color = 'Цвет';
			lang.opacity = 'Непрозрачность';
			lang.opacityTitle = 'Число в диапазоне 0,0 - 1,0, указывающий, насколько прозрачен материал. Значение 0.0 означает полностью прозрачный, 1.0 - полностью непрозрачный.';
			lang.defaultButton = 'Восстановить';
			lang.defaultScaleTitle = 'Восстановить масштаб 3D объекта по умолчанию.';
			lang.defaultPositionTitle = 'Восстановить позицию 3D объекта по умолчанию.';
			lang.default3DObjectTitle = 'Восстановить настройки всех 3D объектов по умолчанию.';
			lang.defaultRotationTitle = 'Восстановить поворот 3D объекта по умолчанию.';
			lang.defaultLocalPositionTitle = 'Восстановить локальную позицию точки по умолчанию.';
			break;
		default:
			if (guiParams.lang === undefined || guiParams.lang.languageCode != _languageCode) break;
			Object.keys(guiParams.lang).forEach(function (key) {
				if (lang[key] === undefined) return;
				lang[key] = guiParams.lang[key];
			});
	}
	var f3DObjects,
	    fPoint,
	    cRestoreDefaultLocalPosition,
	    fPointWorld,
	    fPoints,
	    cMeshs,
	    fMesh,
	intersection,
	    _this = this,
	    cScaleX,
	    cScaleY,
	    cScaleZ,
	    cPosition = new THREE$1.Vector3(),
	    cRotations = new THREE$1.Vector3(),
	    cPoints,
	    selectedPointIndex = -1,
	    controllerX,
	    controllerY,
	    controllerZ,
	    controllerW,
	    cTrace,
	    cTraceAll,
	    controllerColor,
	    controllerOpacity,
	    controllerWorld = new THREE$1.Vector3(),
	    boSetMesh = false;
	if (options.arrayCloud)
		cFrustumPoints = new options.arrayCloud.cFrustumPointsF(_this);
	function dislayEl(controller, displayController) {
		if (controller === undefined) return;
		if (typeof displayController == "boolean") displayController = displayController ? 'block' : 'none';
		var el = controller.domElement;
		while (el.tagName.toUpperCase() !== "LI") {
			el = el.parentElement;
		}el.style.display = displayController;
	}
	function exposePosition(selectedPointIndex) {
		if (selectedPointIndex === undefined) selectedPointIndex = guiSelectPoint.getSelectedPointIndex();
		if (selectedPointIndex === -1) return;
		var mesh = cMeshs.__select.options[cMeshs.__select.options.selectedIndex].mesh,
		    position = getObjectPosition(mesh, selectedPointIndex);
		if (axesHelper !== undefined)
			axesHelper.exposePosition({ object: mesh, index: selectedPointIndex });
		if (controllerWorld.x) controllerWorld.x.setValue(position.x);
		if (controllerWorld.y) controllerWorld.y.setValue(position.y);
		if (controllerWorld.z) controllerWorld.z.setValue(position.z);
	}
	function setValue(controller, v) {
		if (!controller) return;
		var input = controller.domElement.querySelector('input'),
		    readOnly = input.readOnly;
		input.readOnly = false;
		controller.object[controller.property] = v;
		if (controller.__onChange) controller.__onChange.call(controller, v);
		controller.initialValue = v;
		controller.updateDisplay();
		input.readOnly = readOnly;
		return controller;
	}
	function setPosition(intersectionSelected) {
		var positionLocal = getObjectLocalPosition(intersectionSelected.object, intersectionSelected.index);
		setValue(controllerX, positionLocal.x);
		setValue(controllerY, positionLocal.y);
		setValue(controllerZ, positionLocal.z);
		var position = getObjectPosition(intersectionSelected.object, intersectionSelected.index);
		setValue(controllerWorld.x, position.x);
		setValue(controllerWorld.y, position.y);
		setValue(controllerWorld.z, position.z);
		var displayControllerW,
		    displayControllerColor,
		    displayControllerOpacity,
		    none = 'none',
		    block = 'block';
		if (typeof intersection.object.userData.arrayFuncs === "function") console.error('arrayFuncs === "function" under constraction');
		var func = intersectionSelected.object.userData.arrayFuncs ? intersectionSelected.object.userData.arrayFuncs[intersectionSelected.index] : undefined,
		    opasity,
		    color = func === undefined ? undefined : Array.isArray(func.w) || typeof func.w === "function" ? execFunc(func, 'w', group.userData.t, options.a, options.b) : func.w;
		if (color === undefined) {
			if (intersectionSelected.object.geometry.attributes.ca === undefined) console.warn('Under constraction. цвет frustumPoints не известен потому что он вычисляется в шейдере D:\My documents\MyProjects\webgl\three.js\GitHub\myThreejs\master\frustumPoints\vertex.c');else {
				var vColor = new THREE$1.Vector4().fromArray(intersectionSelected.object.geometry.attributes.ca.array, intersectionSelected.index * intersectionSelected.object.geometry.attributes.ca.itemSize);
				color = new THREE$1.Color(vColor.x, vColor.y, vColor.z);
				opasity = vColor.w;
			}
		}
		if (color instanceof THREE$1.Color) {
			displayControllerW = none;
			displayControllerColor = block;
			displayControllerOpacity = block;
			if (intersectionSelected.object.userData.arrayFuncs === undefined) {
				displayControllerColor = none;
				displayControllerOpacity = none;
			} else {
				var strColor = '#' + color.getHexString();
				controllerColor.initialValue = strColor;
				controllerColor.setValue(strColor);
				controllerColor.userData = { intersection: intersectionSelected };
				if (opasity !== undefined) {
					setValue(controllerOpacity, opasity);
				} else displayControllerOpacity = none;
				controllerOpacity.userData = { intersection: intersectionSelected };
			}
		} else {
			if (controllerW === undefined) displayControllerW = none;else {
				if (color === undefined) displayControllerW = none;else {
					setValue(controllerW, color);
					displayControllerW = block;
				}
			}
			displayControllerColor = none;
			displayControllerOpacity = none;
		}
		dislayEl(controllerW, displayControllerW);
		dislayEl(controllerColor, displayControllerColor);
		dislayEl(controllerOpacity, displayControllerOpacity);
		var boReadOnly = intersectionSelected.object.userData.boFrustumPoints === true ? true : false;
		if (controllerX) controllerX.domElement.querySelector('input').readOnly = boReadOnly;
		if (controllerY) controllerY.domElement.querySelector('input').readOnly = boReadOnly;
		if (controllerZ) controllerZ.domElement.querySelector('input').readOnly = boReadOnly;
		if (controllerW) controllerW.domElement.querySelector('input').readOnly = boReadOnly;
		controllerColor.domElement.querySelector('input').readOnly = boReadOnly;
		controllerOpacity.domElement.querySelector('input').readOnly = boReadOnly;
	}
	this.setMesh = function () {
		boSetMesh = true;
		setScaleControllers();
		setPositionControllers();
		setRotationControllers();
		exposePosition();
		boSetMesh = false;
	};
	this.setPosition = function (position, intersectionSelected) {
		for (var i = 0; i < cMeshs.__select.length; i++) {
			var option = cMeshs.__select[i];
			if (option.selected && Object.is(option.mesh, intersectionSelected.object)) {
				setPosition(intersectionSelected);
			}
		}
	};
	this.update = function () {
		var mesh = cMeshs.__select.options[cMeshs.__select.options.selectedIndex].mesh;
		if (!mesh) return;
		var index = this.getSelectedPointIndex();
		if (index === -1) return;
		var position = getObjectPosition(mesh, index);
		controllerWorld.x.setValue(position.x);
		controllerWorld.y.setValue(position.y);
		controllerWorld.z.setValue(position.z);
	};
	this.getMeshIndex = function (mesh) {
		if (mesh === undefined) return mesh;
		var index;
		for (index = 0; index < cMeshs.__select.options.length; index++) {
			var option = cMeshs.__select.options[index];
			if (Object.is(option.mesh, mesh)) return index;
		}
	};
	this.setIndexMesh = function (index, mesh) {
		if (index === undefined) return;
		cMeshs.__select.options[index].mesh = mesh;
		this.selectPoint(-1);
	};
	this.selectPoint = function (index) {
		cPoints.__onChange(index);
		cPoints.__select[index + 1].selected = true;
	};
	this.removeMesh = function (mesh) {
		var index = this.getMeshIndex(mesh),
		    selectedIndex = cMeshs.__select.selectedIndex;
		cMeshs.__select.remove(index);
		if (selectedIndex === index) {
			cPoints.__onChange(-1);
			_this.removePoints();
		}
	};
	this.addMesh = function (mesh) {
		for (var i = 0; i < cMeshs.__select.options.length; i++) {
			var option = cMeshs.__select.options[i];
			if (mesh.userData.boFrustumPoints && option.mesh !== undefined && option.mesh.userData.boFrustumPoints) return;
			if (option.mesh !== undefined && mesh.name !== '' &&
			option.mesh.name === mesh.name) {
				return;
			}
		}
		var opt = document.createElement('option');
		opt.innerHTML = cMeshs.__select.length + ' ' + (mesh.name === '' ? mesh.constructor.name : mesh.name);
		opt.mesh = mesh;
		mesh.userData.default = mesh.userData.default || {
			scale: new THREE$1.Vector3().copy(mesh.scale),
			position: mesh.position instanceof THREE$1.Vector3 ? new THREE$1.Vector3().copy(mesh.position) : mesh.position instanceof THREE$1.Vector4 ? new THREE$1.Vector4().copy(mesh.position) : undefined,
			rotation: new THREE$1.Euler().copy(mesh.rotation)
		};
		cMeshs.__select.appendChild(opt);
	};
	this.select = function (intersectionSelected) {
		var position = getObjectLocalPosition(intersectionSelected.object, intersectionSelected.index);
		if (f3DObjects === undefined) {
			console.error('Не знаю как сюда попасть');
		}
		var index = this.getMeshIndex(intersectionSelected.object);
		if (!index) return;
		if (cMeshs.__select[index].selected === false) {
			cMeshs.__select[index].selected = true;
			cMeshs.__onChange(index - 1);
		}
		this.selectPoint2 = function (selectedMesh) {
			if (intersectionSelected.index === undefined || isNaN(intersectionSelected.index)) return;
			if (selectedMesh !== undefined && !Object.is(intersectionSelected.object, selectedMesh)) return;
			if (!intersectionSelected.object.userData.boFrustumPoints) {
				cPoints.__select[intersectionSelected.index + 1].selected = true;
			} else {
				cFrustumPoints.pointIndexes(intersectionSelected.object.userData.pointIndexes(intersectionSelected.index));
			}
			var block = 'block';
			fPoint.domElement.style.display = block;
			fPointWorld.domElement.style.display = block;
			intersection = intersectionSelected;
			if (guiParams.setIntersection) guiParams.setIntersection(intersectionSelected);
			setPosition(intersectionSelected);
			var mesh = getMesh();
			var line = mesh.userData.arrayFuncs === undefined || typeof intersection.object.userData.arrayFuncs === "function" ? undefined : mesh.userData.arrayFuncs[intersectionSelected.index].line;
			if (cTrace) cTrace.setValue(line === undefined ? false : line.isVisible());
			cRestoreDefaultLocalPosition.domElement.parentElement.parentElement.style.display = intersection.object.userData.arrayFuncs === undefined ? 'none' : block;
		};
		this.selectPoint2();
	};
	this.isSelectedMesh = function (meshCur) {
		return getMesh() === meshCur;
	};
	this.getSelectedPointIndex = function () {
		if (cFrustumPoints !== undefined && cFrustumPoints.isDisplay() &&
		options.arrayCloud.frustumPoints.isDisplay()
		) {
				var selectedIndex = cFrustumPoints.getSelectedIndex();
				return selectedIndex === null ? -1 : selectedIndex;
			}
		if (cPoints === undefined) {
			if (selectedPointIndex === undefined) console.error('myThreejs.create.onloadScripts.init.guiSelectPoint.getSelectedPointIndex:  selectedPointIndex = ' + selectedPointIndex);
			return selectedPointIndex;
		}
		var index = cPoints.__select.selectedOptions[0].index;
		return index - 1;
	};
	function getMesh() {
		var selectedIndex = cMeshs.__select.options.selectedIndex;
		if (selectedIndex !== -1) return cMeshs.__select.options[cMeshs.__select.options.selectedIndex].mesh;
		return undefined;
	}
	function isNotSetControllers() {
		return getMesh() === undefined;
	}
	function setScaleControllers() {
		if (isNotSetControllers()) return;
		var mesh = getMesh();
		if (cScaleX) cScaleX.setValue(mesh.scale.x);
		if (cScaleY) cScaleY.setValue(mesh.scale.y);
		if (cScaleZ) cScaleZ.setValue(mesh.scale.z);
	}
	function setPositionControllers() {
		if (isNotSetControllers()) return;
		var mesh = getMesh();
		if (cPosition.x) cPosition.x.setValue(mesh.position.x);
		if (cPosition.y) cPosition.y.setValue(mesh.position.y);
		if (cPosition.z) cPosition.z.setValue(mesh.position.z);
	}
	function setRotationControllers() {
		if (isNotSetControllers()) return;
		var mesh = getMesh();
		if (cRotations.x) cRotations.x.setValue(mesh.rotation.x);
		if (cRotations.y) cRotations.y.setValue(mesh.rotation.y);
		if (cRotations.z) cRotations.z.setValue(mesh.rotation.z);
	}
	this.add = function (folder) {
		f3DObjects = folder.addFolder(lang.meshs);
		var mesh, buttonScaleDefault, buttonPositionDefault, buttonRotationDefault;
		cMeshs = f3DObjects.add({ Meshs: lang.notSelected }, 'Meshs', defineProperty({}, lang.notSelected, -1)).onChange(function (value) {
			value = parseInt(value);
			mesh = getMesh();
			var display;
			if (mesh === undefined) {
				display = 'none';
				mesh = undefined;
				if (axesHelper !== undefined) axesHelper.exposePosition(getObjectPosition(getMesh(), value));
			} else {
				var displayDefaultButtons = mesh.userData.default === undefined ? 'none' : 'block';
				buttonScaleDefault.domElement.parentElement.parentElement.style.display = displayDefaultButtons;
				buttonPositionDefault.domElement.parentElement.parentElement.style.display = displayDefaultButtons;
				buttonRotationDefault.domElement.parentElement.parentElement.style.display = displayDefaultButtons;
				display = 'block';
				var displayPoints = 'none',
				    displayFrustumPoints = 'block';
				cPoints.__onChange(-1);
				_this.removePoints();
				if (mesh.userData.controllers !== undefined) {
					mesh.userData.controllers();
				} else {
					displayPoints = 'block';
					displayFrustumPoints = 'none';
					for (var iPosition = 0; iPosition < mesh.geometry.attributes.position.count; iPosition++) {
						var opt = document.createElement('option'),
						    name = mesh.userData.arrayFuncs === undefined ? undefined : mesh.userData.pointName === undefined ? typeof mesh.userData.arrayFuncs === "function" ? undefined : mesh.userData.arrayFuncs[iPosition].name : mesh.userData.pointName(iPosition);
						opt.innerHTML = iPosition + (name === undefined ? '' : ' ' + name);
						opt.setAttribute('value', iPosition);
						cPoints.__select.appendChild(opt);
					}
				}
				cPoints.domElement.parentElement.parentElement.style.display = displayPoints;
				if (cTraceAll) cTraceAll.domElement.parentElement.parentElement.style.display = displayPoints;
				if (cFrustumPoints !== undefined) cFrustumPoints.display(displayFrustumPoints);
				setScaleControllers();
				setPositionControllers();
				setRotationControllers();
			}
			fMesh.domElement.style.display = display;
			if (mesh !== undefined && mesh.userData.traceAll !== undefined) cTraceAll.setValue(mesh.userData.traceAll);
		});
		dat_module_js.dat.controllerNameAndTitle(cMeshs, lang.select);
		fMesh = f3DObjects.addFolder(lang.mesh);
		fMesh.domElement.style.display = 'none';
		fMesh.open();
		var fScale = fMesh.addFolder(lang.scale);
		fScale.add(new ScaleController(function (customController, action) {
			var zoom = customController.controller.getValue();
			mesh.scale.x = action(mesh.scale.x, zoom);
			mesh.scale.y = action(mesh.scale.y, zoom);
			mesh.scale.z = action(mesh.scale.z, zoom);
			mesh.needsUpdate = true;
			setScaleControllers();
			exposePosition();
			if (options.arrayCloud !== undefined && options.arrayCloud.frustumPoints !== undefined) options.arrayCloud.frustumPoints.updateCloudPoint(mesh);
		}, {
			settings: { zoomMultiplier: 1.1 },
			getLanguageCode: getLanguageCode
		}));
		var scale = new THREE$1.Vector3();
		function setScale(axesName, value) {
			mesh.scale[axesName] = value;
			mesh.needsUpdate = true;
			exposePosition();
			if (options.arrayCloud !== undefined && options.arrayCloud.frustumPoints !== undefined) options.arrayCloud.frustumPoints.updateCloudPoint(mesh);
		}
		if (options.scales.x) {
			cScaleX = dat_module_js.dat.controllerZeroStep(fScale, scale, 'x', function (value) {
				setScale('x', value);
			});
			dat_module_js.dat.controllerNameAndTitle(cScaleX, options.scales.x.name);
		}
		if (options.scales.y) {
			cScaleY = dat_module_js.dat.controllerZeroStep(fScale, scale, 'y', function (value) {
				setScale('y', value);
			});
			dat_module_js.dat.controllerNameAndTitle(cScaleY, options.scales.y.name);
		}
		if (options.scales.z) {
			cScaleZ = dat_module_js.dat.controllerZeroStep(fScale, scale, 'z', function (value) {
				setScale('z', value);
			});
			dat_module_js.dat.controllerNameAndTitle(cScaleZ, options.scales.z.name);
		}
		buttonScaleDefault = fScale.add({
			defaultF: function defaultF(value) {
				mesh.scale.copy(mesh.userData.default.scale);
				mesh.needsUpdate = true;
				setScaleControllers();
				exposePosition();
			}
		}, 'defaultF');
		dat_module_js.dat.controllerNameAndTitle(buttonScaleDefault, lang.defaultButton, lang.defaultScaleTitle);
		var fPosition = fMesh.addFolder(lang.position);
		function addAxisControllers(name) {
			var scale = options.scales[name];
			if (!scale) return;
			var axesName = scale.name,
			    f = fPosition.addFolder(axesName);
			f.add(new PositionController(function (shift) {
				mesh.position[name] += shift;
				mesh.needsUpdate = true;
				setPositionControllers();
				exposePosition();
				if (options.arrayCloud !== undefined && options.arrayCloud.frustumPoints !== undefined) options.arrayCloud.frustumPoints.updateCloudPoint(mesh);
			}, { getLanguageCode: getLanguageCode }));
			function setPosition(value) {
				mesh.position[name] = value;
				mesh.needsUpdate = true;
				exposePosition();
			}
			var position = new THREE$1.Vector3();
			cPosition[name] = dat_module_js.dat.controllerZeroStep(f, position, name, function (value) {
				setPosition(value);
			});
			dat_module_js.dat.controllerNameAndTitle(cPosition[name], axesName);
		}
		addAxisControllers('x');
		addAxisControllers('y');
		addAxisControllers('z');
		buttonPositionDefault = fPosition.add({
			defaultF: function defaultF(value) {
				mesh.position.copy(mesh.userData.default.position);
				mesh.needsUpdate = true;
				setPositionControllers();
				exposePosition();
			}
		}, 'defaultF');
		dat_module_js.dat.controllerNameAndTitle(buttonPositionDefault, lang.defaultButton, lang.defaultPositionTitle);
		var fRotation = fMesh.addFolder(lang.rotation);
		function addRotationControllers(name) {
			var scale = options.scales[name];
			if (!scale) return;
			cRotations[name] = fRotation.add(new THREE$1.Vector3(), name, 0, Math.PI * 2, 1 / 360).onChange(function (value) {
				var mesh = getMesh();
				if (!mesh.userData.boFrustumPoints) {
					mesh.rotation[name] = value;
					mesh.needsUpdate = true;
				}
				if (!boSetMesh) exposePosition();
				if (options.arrayCloud !== undefined && options.arrayCloud.frustumPoints !== undefined) options.arrayCloud.frustumPoints.updateCloudPoint(mesh);
			});
			dat_module_js.dat.controllerNameAndTitle(cRotations[name], scale.name);
		}
		addRotationControllers('x');
		addRotationControllers('y');
		addRotationControllers('z');
		buttonRotationDefault = fRotation.add({
			defaultF: function defaultF(value) {
				mesh.rotation.copy(mesh.userData.default.rotation);
				mesh.needsUpdate = true;
				setRotationControllers();
				exposePosition();
			}
		}, 'defaultF');
		dat_module_js.dat.controllerNameAndTitle(buttonRotationDefault, lang.defaultButton, lang.defaultRotationTitle);
		fPoints = fMesh.addFolder(lang.points);
		cPoints = fPoints.add({ Points: lang.notSelected }, 'Points', defineProperty({}, lang.notSelected, -1)).onChange(function (value) {
			value = parseInt(value);
			var display;
			if (value === -1) {
				display = 'none';
			} else {
				display = 'block';
				_this.select({ object: getMesh(), index: value });
			}
			if (axesHelper !== undefined) axesHelper.exposePosition(getObjectPosition(getMesh(), value));
			fPoint.domElement.style.display = display;
			fPointWorld.domElement.style.display = display;
		});
		cPoints.__select[0].selected = true;
		dat_module_js.dat.controllerNameAndTitle(cPoints, lang.select);
		if (cFrustumPoints !== undefined) cFrustumPoints.create(fPoints, getLanguageCode());
		if (guiParams.myThreejs) guiParams.myThreejs.cFrustumPoints = cFrustumPoints;
		fPoint = fPoints.addFolder(lang.point);
		dat_module_js.dat.folderNameAndTitle(fPoint, lang.point, lang.pointTitle);
		fPoint.domElement.style.display = 'none';
		fPointWorld = fPoints.addFolder(lang.pointWorld);
		dat_module_js.dat.folderNameAndTitle(fPointWorld, lang.pointWorld, lang.pointWorldTitle);
		fPointWorld.domElement.style.display = 'none';
		fPointWorld.open();
		if (guiParams.pointsControls) cTraceAll = guiParams.pointsControls(fPoints, dislayEl, getMesh);
		dat_module_js.dat.controllerNameAndTitle(f3DObjects.add({
			defaultF: function defaultF(value) {
				for (var i = 0; i < cMeshs.__select.options.length; i++) {
					var _mesh = cMeshs.__select.options[i].mesh;
					if (!_mesh) continue;
					_mesh.scale.copy(_mesh.userData.default.scale);
					_mesh.position.copy(_mesh.userData.default.position);
					_mesh.rotation.copy(_mesh.userData.default.rotation);
					_mesh.needsUpdate = true;
				}
				setScaleControllers();
				setPositionControllers();
				setRotationControllers();
				exposePosition();
			}
		}, 'defaultF'), lang.defaultButton, lang.default3DObjectTitle);
		addPointControllers();
	};
	this.setColorAttribute = function (attributes, i, color) {
		if (typeof color === "string") color = new THREE$1.Color(color);
		var colorAttribute = attributes.color || attributes.ca;
		if (colorAttribute === undefined) return;
		colorAttribute.setX(i, color.r);
		colorAttribute.setY(i, color.g);
		colorAttribute.setZ(i, color.b);
		colorAttribute.needsUpdate = true;
	};
	this.removePoints = function () {
		cPoints.domElement.querySelectorAll('select option').forEach(function (option) {
			return option.remove();
		});
		var opt = document.createElement('option');
		opt.innerHTML = lang.notSelected;
		opt.setAttribute('value', -1);
		cPoints.__select.appendChild(opt);
	};
	function addPointControllers() {
		function isReadOnlyController(controller) {
			if (controller.domElement.querySelector('input').readOnly) {
				if (controller.getValue() !== controller.initialValue) {
					if (controller.boSetValue === undefined) {
						controller.boSetValue = true;
						setValue(controller, controller.initialValue);
						controller.boSetValue = undefined;
						controller.initialValue = controller.getValue();
					}
				}
				return true;
			}
			return false;
		}
		function axesGui(axisName                     ) {
			var scale, controller;
			if (axisName === 'w') {
				if (options.scales.w === undefined) return;
				scale = options.scales.w;
				controller = fPoint.add({
					value: scale.min
				}, 'value', scale.min, scale.max, (scale.max - scale.min) / 100).onChange(function (value) {
					var color = options.palette.toColor(value, controller.__min, controller.__max),
					    attributes = intersection.object.geometry.attributes,
					    i = intersection.index;
					_this.setColorAttribute(attributes, i, color);
					attributes.position.setW(i, value);
					if (options.arrayCloud !== undefined && options.arrayCloud.frustumPoints !== undefined) options.arrayCloud.frustumPoints.updateCloudPointItem(intersection.object, intersection.index);
				});
				if (options.palette instanceof ColorPicker.palette) {
					controller.domElement.querySelector('.slider-fg').style.height = '40%';
					var elSlider = controller.domElement.querySelector('.slider');
					ColorPicker.create(elSlider, {
						palette: options.palette,
						style: {
						}
					});
				}
			} else {
				scale = axesHelper === undefined ? options.scales[axisName] :
				axesHelper.options ? axesHelper.options.scales[axisName] : undefined;
				if (scale) controller = fPoint.add({
					value: scale.min
				}, 'value', scale.min, scale.max, (scale.max - scale.min) / 100).onChange(function (value) {
					if (isReadOnlyController(controller)) return;
					var points = intersection.object,
					    axesId = axisName === 'x' ? 0 : axisName === 'y' ? 1 : axisName === 'z' ? 2 : axisName === 'w' ? 3 : console.error('axisName:' + axisName);
					points.geometry.attributes.position.array[axesId + intersection.index * points.geometry.attributes.position.itemSize] = value;
					points.geometry.attributes.position.needsUpdate = true;
					exposePosition(intersection.index);
					if (options.arrayCloud !== undefined && options.arrayCloud.frustumPoints !== undefined) options.arrayCloud.frustumPoints.updateCloudPointItem(points, intersection.index);
				});
			}
			if (scale) dat_module_js.dat.controllerNameAndTitle(controller, scale.name);
			return controller;
		}
		controllerX = axesGui('x');
		controllerY = axesGui('y');
		controllerZ = axesGui('z');
		controllerW = axesGui('w');
		controllerColor = fPoint.addColor({
			color: '#FFFFFF'
		}, 'color').onChange(function (value) {
			if (isReadOnlyController(controllerColor)) return;
			if (controllerColor.userData === undefined) return;
			var intersection = controllerColor.userData.intersection;
			_this.setColorAttribute(intersection.object.geometry.attributes, intersection.index, value);
		});
		dat_module_js.dat.controllerNameAndTitle(controllerColor, lang.color);
		controllerOpacity = fPoint.add({
			opasity: 1
		}, 'opasity', 0, 1, 0.01).onChange(function (opasity) {
			if (isReadOnlyController(controllerOpacity)) return;
			var intersection = controllerColor.userData.intersection;
			var points = intersection.object;
			if (points.geometry.attributes.ca === undefined) return;
			points.geometry.attributes.ca.array[3 + intersection.index * points.geometry.attributes.ca.itemSize] = opasity;
			points.geometry.attributes.ca.needsUpdate = true;
		});
		dat_module_js.dat.controllerNameAndTitle(controllerOpacity, lang.opacity, lang.opacityTitle);
		if (guiParams.pointControls) cTrace = guiParams.pointControls(fPoint, dislayEl, getMesh, intersection);
		function axesWorldGui(axisName) {
			var scale = axesHelper === undefined ? options.scales[axisName] : axesHelper.options ? axesHelper.options.scales[axisName] : undefined;
			if (!scale) return;
			var controller = dat_module_js.dat.controllerZeroStep(fPointWorld, { value: scale.min }, 'value');
			controller.domElement.querySelector('input').readOnly = true;
			dat_module_js.dat.controllerNameAndTitle(controller, scale.name);
			return controller;
		}
		controllerWorld.x = axesWorldGui('x');
		controllerWorld.y = axesWorldGui('y');
		controllerWorld.z = axesWorldGui('z');
		cRestoreDefaultLocalPosition = fPoint.add({
			defaultF: function defaultF() {
				var positionDefault = intersection.object.userData.arrayFuncs[intersection.index];
				controllerX.setValue(typeof positionDefault.x === "function" ? positionDefault.x(group.userData.t, options.a, options.b) : positionDefault.x);
				controllerY.setValue(typeof positionDefault.y === "function" ? positionDefault.y(group.userData.t, options.a, options.b) : positionDefault.y);
				controllerZ.setValue(typeof positionDefault.z === "function" ? positionDefault.z(group.userData.t, options.a, options.b) : positionDefault.z === undefined ? 0 :
				positionDefault.z);
				if (positionDefault.w !== undefined) {
					if (positionDefault.w.r !== undefined) controllerColor.setValue('#' + new THREE$1.Color(positionDefault.w.r, positionDefault.w.g, positionDefault.w.b).getHexString());else if (typeof positionDefault.w === "function") setValue(controllerW, positionDefault.w(group.userData.t));else console.error('Restore default local position: Invalid W axis.');
				} else {
					controllerColor.setValue(controllerColor.initialValue);
					controllerOpacity.setValue(controllerOpacity.initialValue);
				}
			}
		}, 'defaultF');
		dat_module_js.dat.controllerNameAndTitle(cRestoreDefaultLocalPosition, lang.defaultButton, lang.defaultLocalPositionTitle);
	}
	this.getFrustumPoints = function () {
		return cFrustumPoints;
	};
	this.windowRange = function (options) {
		pointLight1.windowRange(options.scales);
		pointLight2.windowRange(options.scales);
		controllerX.min(options.scales.x.min);
		controllerX.max(options.scales.x.max);
		controllerX.updateDisplay();
		controllerY.min(options.scales.y.min);
		controllerY.max(options.scales.y.max);
		controllerY.updateDisplay();
		controllerZ.min(options.scales.z.min);
		controllerZ.max(options.scales.z.max);
		controllerZ.updateDisplay();
		if (controllerW !== undefined) {
			controllerW.min(options.scales.w.min);
			controllerW.max(options.scales.w.max);
			controllerW.updateDisplay();
		}
	};
	return this;
}
function getObjectLocalPosition(object, index) {
	if (!THREE$1) {
		console.error('getObjectLocalPosition: call GuiSelectPoint.setTHREE( THREE ); first');
		return;
	}
	var attributesPosition = object.geometry.attributes.position,
	    position = attributesPosition.itemSize >= 4 ? new THREE$1.Vector4(0, 0, 0, 0) : new THREE$1.Vector3();
	position.fromArray(attributesPosition.array, index * attributesPosition.itemSize);
	return position;
}
function getWorldPosition$1(object, pos) {
	var position = pos.clone();
	function getPosition(object, pos) {
		var position = new THREE$1.Vector3(),
		    positionAngle = new THREE$1.Vector3();
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
	} while (object);
	return position;
}
function getObjectPosition(object, index) {
	if (index === -1) return undefined;
	if (index === undefined) return object.position;
	return getWorldPosition$1(object, getObjectLocalPosition(object, index));
}
GuiSelectPoint.setTHREE = function (_THREE) {
	if (THREE$1) {
		if (!Object.is(THREE$1, _THREE)) console.error('GuiSelectPoint.setTHREE: duplicate THREE. Please use one instance of the THREE library.');
		return;
	}
	THREE$1 = _THREE;
};

/**
 * node.js version of the synchronous download of the file.
 * @author Andrej Hristoliubov https://anhr.github.io/AboutMe/
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
			this.url = "XMLHttpRequest.xml";
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
	}, false
	);
	return response;
}

/**
 * node.js version of the load JavaScript file
 * @author Andrej Hristoliubov https://anhr.github.io/AboutMe/
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
function async(src, options) {
	options = options || {};
	options.appendTo = options.appendTo || document.getElementsByTagName('head')[0];
	options.onload = options.onload || function () {};
	var isrc;
	function async(srcAsync) {
		function next() {
			if (src instanceof Array && isrc < src.length - 1) {
				isrc++;
				async(src[isrc]);
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
		async(src[isrc]);
	} else async(src);
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
  async: async
};

/**
 * @module ColorPicker
 * @description Pure JavaScript color picker.
 * @author [Andrej Hristoliubov]{@link https://anhr.github.io/AboutMe/}
 * @See Thanks to [FlexiColorPicker]{@link https://github.com/DavidDurman/FlexiColorPicker}
 *
 * @copyright 2011 Data Arts Team, Google Creative Lab
 *
 * @license under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */
var optionsStyle = {
	tag: 'style'
};loadScript.sync('/anhr/colorpicker/master/colorpicker.css', optionsStyle);
var type = window.SVGAngle || document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1") ? "SVG" : "VML";
var svgNS = 'http://www.w3.org/2000/svg';
var uniqID = 0;
var paletteIndexes = {
	BGRW: 0,
	monochrome: 1,
	bidirectional: 2,
	rainbow: 3
};function create(elSliderWrapper, options) {
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
	var palette = options.palette instanceof Palette ? options.palette : new Palette(options);
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
				xmlns: 'http://www.w3.org/2000/svg',
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
}
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
function Palette(options) {
	function paletteitem(percent, r, g, b) {
		return {
			percent: percent,
			r: r,
			g: g,
			b: b
		};
	}
	options = options || {};
	if (options.palette === undefined) options.palette = paletteIndexes.BGRW;
	var arrayPalette = [new paletteitem(0, 0x00, 0x00, 0xFF),
	new paletteitem(33, 0x00, 0xFF, 0x00),
	new paletteitem(66, 0xFF, 0xFF, 0x00),
	new paletteitem(100, 0xFF, 0xFF, 0xFF)];
	switch (_typeof(options.palette)) {
		case 'number':
			switch (options.palette) {
				case paletteIndexes.BGRW:
					break;
				case paletteIndexes.monochrome:
					var arrayPalette = [new paletteitem(0, 0x00, 0x00, 0x00),
					new paletteitem(100, 0xFF, 0xFF, 0xFF)];
					break;
				case paletteIndexes.bidirectional:
					var arrayPalette = [new paletteitem(0, 0xff, 0x30, 0x30),
					new paletteitem(50, 0x30, 0x30, 0x30),
					new paletteitem(100, 0x30, 0xFF, 0x30)];
					break;
				case paletteIndexes.rainbow:
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
		if (typeof THREE$2 === 'undefined') {
			console.error('Call ColorPicker.palette.setTHREE(THREE) first.');
			return;
		}
		if (value instanceof THREE$2.Color) return value;
		var c = this.hsv2rgb(value, min, max);
		if (c === undefined) c = { r: 255, g: 255, b: 255 };
		return new THREE$2.Color("rgb(" + c.r + ", " + c.g + ", " + c.b + ")");
	};
}
var THREE$2;
Palette.setTHREE = function (_THREE) {
	if (THREE$2) {
		if (!Object.is(THREE$2, _THREE)) console.error('Palette.setTHREE: duplicate THREE. Please use one instance of the THREE library.');
		return;
	}
	THREE$2 = _THREE;
};

/**
* @module ColorPicker
* @description Pure JavaScript color picker.
* @author Andrej Hristoliubov https://anhr.github.io/AboutMe/
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
var ColorPicker$1 = {
  create: create,
  paletteIndexes: paletteIndexes,
  palette: Palette
};

/**
 * @module Player
 * @description 3D objects animation.
 * @author [Andrej Hristoliubov]{@link https://anhr.github.io/AboutMe/}
 * @copyright 2011 Data Arts Team, Google Creative Lab
 *
 * @license under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */
var settings;
function Player(options, onSelectScene) {
	settings = options.settings || {};
	settings.min = settings.min || 0;
	settings.max = settings.max || 1;
	settings.marks = settings.marks || 2;
	settings.repeat = settings.repeat || false;
	settings.interval = settings.interval || 25;
	settings.zoomMultiplier = settings.zoomMultiplier || 1.1;
	settings.offset = settings.offset || 0.1;
	var selectSceneIndex = 0,
	_this = this;
	function getTime() {
		return (settings.max - settings.min) / (settings.marks - 1) * selectSceneIndex + settings.min;
	}
	this.selectScene = function (index) {
		if (index >= settings.marks) index = 0;else if (index < 0) index = settings.marks - 1;
		if (selectSceneIndex > settings.marks) selectSceneIndex = settings.marks;
		while (selectSceneIndex !== index) {
			if (selectSceneIndex < index) selectSceneIndex++;else selectSceneIndex--;
			onSelectScene(selectSceneIndex, getTime());
		}
	};
	this.next = function () {
		_this.selectScene(selectSceneIndex + 1);
	};
	this.prev = function () {
		_this.selectScene(selectSceneIndex - 1);
	};
	this.pushController = function (controller) {
		if (controller.object !== undefined && controller.object.playRate !== undefined) controller.object.playRate = settings.interval;
		controllers.push(controller);
	};
	this.controllers = [];
	var playing = false,
	    controllers = this.controllers,
	    time,
	    timeNext;
	function RenamePlayButtons() {
		controllers.forEach(function (controller) {
			controller.onRenamePlayButtons(playing);
		});
	}
	function play() {
		if (selectSceneIndex === -1 || selectSceneIndex === settings.marks) {
			selectSceneIndex = 0;
		}
		onSelectScene(selectSceneIndex, getTime());
	}
	function pause() {
		playing = false;
		RenamePlayButtons();
		time = undefined;
	}
	function isRepeat() {
		return settings.repeat;
	}
	function playNext() {
		selectSceneIndex++;
		if (selectSceneIndex >= settings.marks) {
			if (isRepeat()) selectSceneIndex = 0;else {
				pause();
				return;
			}
		}
		play();
	}
	this.animate = function () {
		if (time === undefined) return;
		var timeCur = new Date().getTime();
		if (isNaN(timeNext)) console.error('Player.animate: timeNext = ' + timeNext);
		if (timeCur < timeNext) return;
		while (timeCur > timeNext) {
			timeNext += 1000 / settings.interval;
		}playNext();
	};
	this.play3DObject = function () {
		if (playing) {
			pause();
			return;
		}
		playing = true;
		if (selectSceneIndex >= settings.marks) selectSceneIndex = -1;
		playNext();
		RenamePlayButtons();
		controllers.forEach(function (controller) {
			if (controller.controller !== undefined) {
				settings.interval = controller.controller.getValue();
				return;
			}
		});
		time = new Date().getTime();
		timeNext = time + 1000 / settings.interval;
	};
	this.repeat = function () {
		settings.repeat = !settings.repeat;
		this.onChangeRepeat(settings.repeat);
	};
	this.getOptions = function () {
		return options;
	};
	this.getSettings = function () {
		return options.settings;
	};
	this.getSelectSceneIndex = function () {
		return selectSceneIndex;
	};
	function setSettings() {
		cookie.setObject(cookieName, options.settings);
		options.onChangeScaleT(options.settings);
	}
	this.onChangeTimerId = function (value) {
		settings.interval = value;
		setSettings();
	};
	this.onChangeRepeat = function (value) {
		settings.repeat = value;
		this.controllers.forEach(function (controller) {
			controller.onChangeRepeat();
		});
	};
}
Player.execFunc = function (funcs, axisName, t, a, b) {
	a = a || 1;
	b = b || 0;
	var func = funcs[axisName],
	    typeofFuncs = typeof func === 'undefined' ? 'undefined' : _typeof(func);
	switch (typeofFuncs) {
		case "undefined":
			return undefined;
		case "function":
			return func(t, a, b);
		case "number":
			return func;
		case "object":
			if (Array.isArray(func)) {
				var execW = function execW(i) {
					if (typeof a[i] === "function") return a[i](t, a, b);
					if (a[i] instanceof THREE.Color) return a[i];
				};
				if (func.length === 0) {
					console.error('Player.execFunc: funcs["' + axisName + '"] array is empty');
					return;
				}
				var a = func,
				    l = func.length - 1,
				    max = options.player.max,
				    min = options.player.min,
				    tStep = (max - min) / l,
				    tStart = min,
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
				if (typeof a[iStart] !== "number") {
					if (axisName === 'w') {
						return execW(iStart);
					}
					console.error('Player.execFunc: funcs["' + axisName + '"] array item ' + iStart + ' typeof = ' + _typeof(a[iStart]) + ' is not number');
					return;
				}
				if (typeof a[iStop] !== "number") {
					if (axisName === 'w') return execW(iStop);
					console.error('Player.execFunc: funcs["' + axisName + '"] array item ' + iStop + ' typeof = ' + _typeof(a[iStop]) + ' is not number');
					return;
				}
				var x = (a[iStop] - a[iStart]) / (tStop - tStart),
				    y = a[iStart] - x * tStart;
				return x * t + y;
			}
			if (func.func) {
				return func.func(t, a, b);
			}
			if (axisName !== 'w') console.error('Player.execFunc: funcs["' + axisName + '"] object is not array');
			return;
		default:
			console.error('Player.execFunc: Invalud typeof funcs["' + axisName + '"]: ' + typeofFuncs);
	}
	return;
};
var paletteDefault = new ColorPicker$1.palette();
Player.selectPlayScene = function (THREE, group, t, index, options) {
	options.boPlayer = options.boPlayer || false;
	options = options || {};
	options.a = options.a || 1;
	options.b = options.b || 0;
	options.palette = options.palette || paletteDefault;
	options.scales = options.scales || {};
	group.userData.t = t;
	group.children.forEach(function (mesh) {
		if (mesh.userData.selectPlayScene === undefined || options.boPlayer && mesh.userData.boFrustumPoints) return;
		delete mesh.geometry.boundingSphere;
		mesh.geometry.boundingSphere = null;
		mesh.userData.selectPlayScene(t);
		function setAttributes(a, b) {
			var attributes = mesh.geometry.attributes,
			    arrayFuncs = mesh.userData.arrayFuncs;
			if (arrayFuncs === undefined) return;
			if (t === undefined) console.error('setPosition: t = ' + t);
			for (var i = 0; i < arrayFuncs.length; i++) {
				var setPosition = function setPosition(axisName, fnName) {
					var value = Player.execFunc(funcs, axisName, t, a, b);
					if (value !== undefined) {
						attributes.position[fnName](i, value);
						needsUpdate = true;
					}
				};
				var funcs = arrayFuncs[i],
				    needsUpdate = false;
				setPosition('x', 'setX');
				setPosition('y', 'setY');
				setPosition('z', 'setZ');
				var color = void 0;
				var min, max;
				if (options.scales.w !== undefined) {
					min = options.scales.w.min;max = options.scales.w.max;
				} else {
					max = value;
					min = max - 1;
				}
				if (typeof funcs.w === "function") {
					var value = funcs.w(t, a, b);
					attributes.position.setW(i, value);
					needsUpdate = true;
					if (options.palette) color = options.palette.toColor(value, min, max);
				} else if (_typeof(funcs.w) === "object") {
					if (funcs.w instanceof THREE.Color) color = funcs.w;else if (options.palette) {
						if (_typeof(funcs.w) === 'object') {
							if (funcs.w.min) min = funcs.w.min;
							if (funcs.w.max) max = funcs.w.max;
						}
						color = options.palette.toColor(Player.execFunc(funcs, 'w', t, a, b), min, max);
					}
				} else if (typeof funcs.w === "number" && options.palette) color = options.palette.toColor(funcs.w, min, max);
				if (color) {
					if (mesh.material.vertexColors !== THREE.VertexColors) console.error('Player.selectPlayScene: Please set the vertexColors parameter of the THREE.PointsMaterial of your points to THREE.VertexColors. Example: vertexColors: THREE.PointsMaterial');
					if (!Player.setColorAttribute(attributes, i, color) && funcs instanceof THREE.Vector4) {
						mesh.geometry.setAttribute('color', new THREE.Float32BufferAttribute(Player.getColors(THREE, arrayFuncs, {
							positions: mesh.geometry.attributes.position,
							scale: { min: min, max: max },
							palette: options.palette
						}), 3));
						if (!Player.setColorAttribute(attributes, i, color)) console.error('Player.selectPlayScene: the color attribute is not exists. Please use THREE.Vector3 instead THREE.Vector4 in the arrayFuncs or add "color" attribute');
					}
				}
				if (needsUpdate) attributes.position.needsUpdate = true;
				if (funcs.line !== undefined) funcs.line.addPoint(getObjectPosition(mesh, i), index, color);
			}
		}
		setAttributes(options.a, options.b);
		var message = 'Player.selectPlayScene: invalid mesh.scale.';
		if (mesh.scale.x <= 0) console.error(message + 'x = ' + mesh.scale.x);
		if (mesh.scale.y <= 0) console.error(message + 'y = ' + mesh.scale.y);
		if (mesh.scale.z <= 0) console.error(message + 'z = ' + mesh.scale.z);
		if (!options.guiSelectPoint) return;
		options.guiSelectPoint.setMesh();
		var selectedPointIndex = options.guiSelectPoint.getSelectedPointIndex();
		if (selectedPointIndex !== -1 && options.guiSelectPoint.isSelectedMesh(mesh)) {
			var position = getObjectPosition(mesh, selectedPointIndex);
			options.guiSelectPoint.setPosition(position, {
				object: mesh,
				index: selectedPointIndex
			});
		}
	});
};
Player.setColorAttribute = function (attributes, i, color) {
	if (typeof color === "string") color = new THREE.Color(color);
	var colorAttribute = attributes.color || attributes.ca;
	if (colorAttribute === undefined) return false;
	colorAttribute.setX(i, color.r);
	colorAttribute.setY(i, color.g);
	colorAttribute.setZ(i, color.b);
	colorAttribute.needsUpdate = true;
	return true;
};
Player.getPoints = function (THREE, arrayFuncs, optionsPoints) {
	GuiSelectPoint.setTHREE(THREE);
	optionsPoints = optionsPoints || {};
	optionsPoints.t = optionsPoints.t || 0;
	var options = optionsPoints.options || {},
	    a = options.a || 1,
	    b = options.b || 0;
	for (var i = 0; i < arrayFuncs.length; i++) {
		var item = arrayFuncs[i];
		if (Array.isArray(item)) arrayFuncs[i] = new THREE.Vector4(item[0] === undefined ? 0 : item[0], item[1] === undefined ? 0 : item[1], item[2] === undefined ? 0 : item[2], item[3] === undefined ? 0 : item[3]);else if ((typeof item === 'undefined' ? 'undefined' : _typeof(item)) === "object" && item instanceof THREE.Vector2 === false && item instanceof THREE.Vector3 === false && item instanceof THREE.Vector4 === false) {
			if (item.vector === undefined) arrayFuncs[i] = new THREE.Vector4(item.x === undefined ? 0 : item.x, item.y === undefined ? 0 : item.y, item.z === undefined ? 0 : item.z, item.w === undefined ? 0 : item.w);else if (item.vector instanceof THREE.Vector2 === true || item.vector instanceof THREE.Vector3 === true || item.vector instanceof THREE.Vector4 === true) {
				if (item.vector instanceof THREE.Vector2 === true) arrayFuncs[i].vector = new THREE.Vector3(item.vector.x === undefined ? 0 : item.vector.x, item.vector.y === undefined ? 0 : item.vector.y, item.vector.z === undefined ? 0 : item.vector.z);
			} else {
				if (item.vector.length === 4) arrayFuncs[i].vector = new THREE.Vector4(item.vector[0] === undefined ? 0 : item.vector[0], item.vector[1] === undefined ? 0 : item.vector[1], item.vector[2] === undefined ? 0 : item.vector[2], item.vector[3] === undefined ? 0 : item.vector[3]);else if (item.vector.length === 3) arrayFuncs[i].vector = new THREE.Vector3(item.vector[0] === undefined ? 0 : item.vector[0], item.vector[1] === undefined ? 0 : item.vector[1], item.vector[2] === undefined ? 0 : item.vector[2]);else console.error('options.getPoints(...) falied! item.vector.length = ' + item.vector.length);
			}
		}
	}
	var points = [];
	for (var i = 0; i < arrayFuncs.length; i++) {
		var getAxis = function getAxis(axisName) {
			if (typeof funcs === "number") funcs = new THREE.Vector4(funcs, 0, 0, 0);
			if (funcs instanceof THREE.Vector2 || funcs instanceof THREE.Vector3 || funcs instanceof THREE.Vector4) {
				return Player.execFunc(funcs, axisName, optionsPoints.t, a, b);
			}
			if (funcs.vector === undefined) {
				console.error('options.getPoints: funcs.vector = ' + funcs.vector);
				return;
			}
			if (funcs.name !== undefined) funcs.vector.name = funcs.name;
			if (funcs.trace) {
				funcs.vector.line = new Player.traceLine(THREE, optionsPoints.group, options);
			}
			arrayFuncs[i] = funcs.vector;
			funcs = funcs.vector;
			return Player.execFunc(funcs, axisName, optionsPoints.t, a, b);
		};
		var funcs = arrayFuncs[i];
		var point = funcs.vector instanceof THREE.Vector3 === true ? new THREE.Vector3(getAxis('x'), getAxis('y'), getAxis('z')) : new THREE.Vector4(getAxis('x'), getAxis('y'), getAxis('z'), getAxis('w'));
		if (funcs.w === undefined) point.w = {};
		points.push(point);
	}
	return points;
};
Player.getColors = function (THREE, arrayFuncs, optionsColor) {
	optionsColor = optionsColor || {};
	optionsColor.palette = optionsColor.palette || paletteDefault;
	if (optionsColor.positions !== undefined && Array.isArray(arrayFuncs) && arrayFuncs.length !== optionsColor.positions.count) {
		console.error('getColors failed! arrayFuncs.length: ' + arrayFuncs.length + ' != positions.count: ' + optionsColor.positions.count);
		return optionsColor.colors;
	}
	optionsColor.colors = optionsColor.colors || [];
	var length = Array.isArray(arrayFuncs) ? arrayFuncs.length : optionsColor.positions.count;
	for (var i = 0; i < length; i++) {
		var funcs = Array.isArray(arrayFuncs) ? arrayFuncs[i] : undefined,
		    vector;
		if (funcs instanceof THREE.Vector4 ||
		optionsColor.positions.itemSize === 4
		) {
				var min, max;
				if (optionsColor.scale !== undefined) {
					min = optionsColor.scale.min;max = optionsColor.scale.max;
				} else {
					max = funcs instanceof THREE.Vector4 ? funcs.w : 1;
					min = max - 1;
				}
				var color = optionsColor.palette.toColor(funcs === undefined ? new THREE.Vector4().fromBufferAttribute(optionsColor.positions, i).w : funcs.w, min, max);
				optionsColor.colors.push(color.r, color.g, color.b);
			} else if (optionsColor.colors instanceof THREE.Float32BufferAttribute) vector = new THREE.Vector3(1, 1, 1);else optionsColor.colors.push(1, 1, 1);
		if (optionsColor.opacity !== undefined) {
			var opacity = 0,
			    standardNormalDistributionZero = getStandardNormalDistribution(0);
			group.children.forEach(function (mesh) {
				if (!mesh.userData.cloud) return;
				for (var iMesh = 0; iMesh < mesh.geometry.attributes.position.count; iMesh++) {
					var position = getObjectPosition(mesh, iMesh);
					opacity += getStandardNormalDistribution(getWorldPosition(
					camera, new THREE.Vector3().fromBufferAttribute(optionsColor.positions, i)).distanceTo(position) * 5) / standardNormalDistributionZero;
				}
			});
			if (debug.opacity !== undefined) opacity = debug.opacity;
			if (optionsColor.colors instanceof THREE.Float32BufferAttribute) {
				optionsColor.colors.setXYZW(i, vector.x, vector.y, vector.z, opacity);
			} else optionsColor.colors.push(opacity);
		} else optionsColor.colors.push(1);
	}
	return optionsColor.colors;
};
Player.traceLine = function (THREE, group, options) {
	if (!group) {
		console.error('Player.traceLine: Define optionsPoints.group of the Player.getPoints first.');
		return;
	}
	if (!settings) {
		console.error('Player.traceLine: call Player(...) first.');
		return;
	}
	var MAX_POINTS = settings.marks,
	    line;
	this.addPoint = function (point, index, color) {
		if (line === undefined) {
			var geometry = new THREE.BufferGeometry();
			var positions = new Float32Array(MAX_POINTS * 3);
			geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
			var colors = new Float32Array(MAX_POINTS * 3);
			geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
			geometry.setDrawRange(index, index);
			line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ vertexColors: THREE.VertexColors }));
			line.visible = true;
			group.add(line);
		}
		point = new THREE.Vector3().copy(point);
		point.toArray(line.geometry.attributes.position.array, index * line.geometry.attributes.position.itemSize);
		line.geometry.attributes.position.needsUpdate = true;
		if (color === undefined) color = new THREE.Color(1, 1, 1);
		Player.setColorAttribute(line.geometry.attributes, index, color);
		var start = line.geometry.drawRange.start,
		    count = index + 1 - start;
		if (start > index) {
			var stop = start + line.geometry.drawRange.count;
			start = index;
			count = stop - start;
		}
		line.geometry.setDrawRange(start, count);
	};
	this.visible = function (visible) {
		line.visible = visible;
	};
	this.isVisible = function () {
		return line.visible;
	};
	this.remove = function () {
		if (line === undefined) return;
		line.geometry.dispose();
		line.material.dispose();
		group.remove(line);
	};
};

exports['default'] = Player;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=player.js.map
