/**
 * @module GuiSelectPoint
 *
 * @description A dat.gui based graphical user interface for select a point from the mesh.
 * 
 * @see {@link https://github.com/anhr/dat.gui|dat.gui}, {@link https://threejs.org/docs/index.html#api/en/objects/Mesh|three.js mesh}.
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

import ScaleController from '../ScaleController.js';
//import ScaleController from 'https://raw.githack.com/anhr/commonNodeJS/master/ScaleController.js';

import PositionController from '../PositionController.js';
//import PositionController from 'https://raw.githack.com/anhr/commonNodeJS/master/PositionController.js';

import ColorPicker from '../colorpicker/colorpicker.js';
//import ColorPicker from 'https://raw.githack.com/anhr/commonNodeJS/master/colorpicker/colorpicker.js';

//import Player from '../player/build/player.module.js';
//import Player from '../player/build/player.module.min.js';
import Player from '../player/player.js';
//import Player from 'https://raw.githack.com/anhr/commonNodeJS/master/player/player.js';
//import Player from 'https://raw.githack.com/anhr/commonNodeJS/master/player/build/player.module.min.js';

import functionsFolder from '../functionsFolder.js';
import { SpriteText } from '../SpriteText/SpriteText.js'
import {

	getObjectPosition,
	getObjectLocalPosition,

} from '../getPosition.js';

import three from '../three.js'

const none = 'none', block = 'block';

class GuiSelectPoint {

	/**
	 * @class A dat.gui based graphical user interface for select a point from the mesh.
	 * @param {Options} options See the <b>options</b> parameter of the <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
	 * @param {GUI} [options.dat.dat] [dat.GUI()]{@link https://github.com/dataarts/dat.gui}.
	 * @param {boolean|Object} [options.dat.guiSelectPoint] false - do not displays <b>GuiSelectPoint</b>.
	 * @param {Function} [options.dat.guiSelectPoint.point] Callback function to create custom controllers for each point of selected mesh with custom controllers.
	 * <pre>
	 * parameter <b>options</b> See <b>options</b> parameter of <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
	 * parameter <b>dat</b> [dat.GUI()]{@link https://github.com/dataarts/dat.gui}.
	 * parameter <b>fParent</b> parent folder.
	 * example <b>point: function ( options, dat, fMesh ) { return new FermatSpiral.gui( options, dat, fMesh ); },</b>
	 * </pre>
	 * @param {boolean} [options.dat.guiSelectPoint.boDisplayVerticeID] true - display on the scene the point ID near to the point.
	 * @param {AxesHelper} [options.axesHelper] An axis object to visualize axes.
	 * See <a href="../../AxesHelper/jsdoc/index.html" target="_blank">AxesHelper</a>.
	 * @param {Function} [options.getLanguageCode=language code of your browser] Your custom getLanguageCode() function.
	 * <pre>
	 * returns the "primary language" subtag of the language version of the browser.
	 * Examples: "en" - English language, "ru" Russian.
	 * See the "Syntax" paragraph of RFC 4646 {@link https://tools.ietf.org/html/rfc4646#section-2.1|rfc4646 2.1 Syntax} for details.
	 * You can import { getLanguageCode } from '../../commonNodeJS/master/lang.js';
	 * </pre>
	 * @param {object} [options.lang] Object with localized language values
	 * @param {object} [guiParams={}] Followed parameters is allowed.
	 * @param {object} [guiParams.cameraTarget] camera looking at selected point during playing. See the <b>cameraTarget</b> parameter of the <a href="../../player/jsdoc/module-Player-Player.cameraTarget.html#init" target="_blank">Player.cameraTarget.init(...)</a> function for details.
	 * @param {THREE.PerspectiveCamera} guiParams.cameraTarget.camera [PerspectiveCamera]{@link https://threejs.org/docs/index.html#api/en/cameras/PerspectiveCamera}.
	 * @param {Function} [guiParams.pointControls] pointControls( fPoint, dislayEl, getMesh ) Adds the trace "Display the trace of the point movement" control checkbox into gui.
	 * <pre>
	 * fPoint - parent folder for new control.
	 * dislayEl( conrtol, true or false ) - function for dislay or hide of the control.
	 * getMesh() returns the mesh, selected in the GuiSelectPoint.
	 * Default is undefined.
	 * </pre>
	 * @param {Function} [guiParams.pointsControls] pointsControls( fPoints, dislayEl, getMesh ) Adds the trace "Display the trace of the movement of all points of the mesh." control checkbox into gui.
	 * <pre>
	 * fPoints - parent folder for new control.
	 * dislayEl( conrtol, true or false ) - function for dislay or hide of the control.
	 * getMesh() returns the mesh, selected in the GuiSelectPoint.
	 * Default is undefined.
	 * </pre>
	 * @param {Function} [guiParams.setIntersection] setIntersection( intersection ) sets the intersection value of myThreejs. Default is undefined
	 * @example
	import GuiSelectPoint from 'https://raw.githack.com/anhr/commonNodeJS/master/guiSelectPoint/guiSelectPoint.js';

	new GuiSelectPoint( options );
	options.guiSelectPoint.add();
	options.guiSelectPoint.addMesh( points );
	 */
	constructor( options, guiParams = {} ) {

		const guiSelectPoint = this, THREE = three.THREE, folders = {};

		if ( !options.boOptions ) {

			console.error( 'GuiSelectPoint: call options = new Options( options ) first' );
			return;

		}
		if ( ( options.dat.guiSelectPoint === false ) || !options.dat.gui ) {

			//заменяем все функции на пустышки
			this.add = function ( gui ) { };
			this.addMesh = function ( points ) { };
			this.select = function ( intersect ) { };
			return;

		}

		const dat = three.dat;//options.dat.dat;

		//Player changes the guiSelectPoint control's values during playing
		options.guiSelectPoint = guiSelectPoint;

		var cFrustumPoints;

		//Localization

		const getLanguageCode = options.getLanguageCode;

		const lang = {

			meshs: 'Meshes',
			notSelected: 'Not selected',
			select: 'Select',
			position: 'Position',
			rotation: 'Rotation',
			points: 'Points',

			displayVerticeID: 'Point ID',
			displayVerticeIDTitle: 'Display on the scene the point ID near to the point',

			cameraTarget: 'Look',
			cameraTargetTitle: 'Choose this point the camera is looking at.',

			point: 'Point Local Position',
			pointTitle: 'The position attribute of the selected point',

			trace: 'Trace',
			traceTitle: 'Display the trace of the point movement.',
			traceAllTitle: 'Display the trace of the movement of all points of the mesh.',

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

			moveGroup: 'Move Scene',

		};

		const _languageCode = getLanguageCode();

		switch ( _languageCode ) {

			case 'ru'://Russian language

				lang.meshs = '3D объекты';
				lang.notSelected = 'Не выбран';
				lang.select = 'Выбрать';
				lang.position = 'Позиция';
				lang.rotation = 'Вращение';
				lang.points = 'Точки';

				lang.displayVerticeID = 'Номера точек';
				lang.displayVerticeIDTitle = 'На сцене возле каждой точки показать ее идентификатор';

				lang.cameraTarget = 'Следить';
				lang.cameraTargetTitle = 'Выберите эту точку, за которой следит камера.',

				lang.point = 'Локальная позиция точки';
				lang.pointTitle = 'Position attribute выбранной точки';

				lang.trace = 'Трек';
				lang.traceTitle = 'Показать трек перемещения точки.';
				lang.traceAllTitle = 'Показать трек перемещения всех точек выбранного 3D объекта.';

				lang.pointWorld = 'Абсолютная позиция точки';
				lang.pointWorldTitle = 'Позиция выбранной точки после масштабирования, перемещения и вращения 3D объекта';

				lang.mesh = '3D объект';
				lang.scale = 'Масштаб';
				lang.color = 'Цвет';

				lang.opacity = 'Непрозрачность';
				lang.opacityTitle = 'Число в диапазоне 0,0 - 1,0, указывающее, насколько прозрачен материал. Значение 0.0 означает полностью прозрачный, 1.0 - полностью непрозрачный.';

				lang.defaultButton = 'Восстановить';
				lang.defaultScaleTitle = 'Восстановить масштаб 3D объекта по умолчанию.';
				lang.defaultPositionTitle = 'Восстановить позицию 3D объекта по умолчанию.';
				lang.default3DObjectTitle = 'Восстановить настройки всех 3D объектов по умолчанию.';
				lang.defaultRotationTitle = 'Восстановить поворот 3D объекта по умолчанию.';
				lang.defaultLocalPositionTitle = 'Восстановить локальную позицию точки по умолчанию.';
				break;
			default://Custom language

		}

		var f3DObjects, fPoint, cRestoreDefaultLocalPosition, fPointWorld, fPoints, cMeshs, fMesh,// mesh,
			intersection,
			cScaleX, cScaleY, cScaleZ,
			cPoints, selectedPointIndex = -1,
			cX, cY, cZ, cW, cTrace, cTraceAll, cColor, cOpacity, cCameraTarget,
			funcFolder,
			boSetMesh = false,//Для предотвращения лишних вызовов exposePosition если выбрать точку и передвинуть камеру с помошью OrbitControls,
			fRotation,
			cCustom;//Custom point controllers
		const _this = this, cPosition = new THREE.Vector3(), cRotations = new THREE.Vector3(), cWorld = new THREE.Vector3();
		function displayPointControllers( display ) {

			fPointWorld.domElement.style.display = display;
			fPoint.domElement.style.display = display;
			if ( cCameraTarget ) {

				const mesh = getMesh();
				cCameraTarget.domElement.parentElement.parentElement.style.display = mesh && mesh.userData.boFrustumPoints ?
					'none' ://Камера не может следить за frustumPoints
					display;

			}

		}
		if ( options.frustumPoints )
			cFrustumPoints = new options.frustumPoints.guiSelectPoint();
		//сейчас exposePosition вызывается только один раз из this.setMesh
		function getLiEl(controller) {

			var el = controller.domElement;
			while (el.tagName.toUpperCase() !== "LI") el = el.parentElement;
			return el;

		}

		//dislay element

		function dislayEl( controller, displayController ) {

			if ( controller === undefined )
				return;
			if ( typeof displayController === "boolean" )
				displayController = displayController ? 'block' : 'none';
			else if ( displayController === undefined )
				displayController = 'none';
			else if ( typeof displayController !== "string" )
				displayController = 'block';
			getLiEl(controller).style.display = displayController;

		}
		function isDislayEl( controller ) {

			if ( controller === undefined )
				return;
			return getLiEl(controller).style.display === none ? false : true;

		}

		//readOnly controller

		const getInputEl =  ( controller ) => { return controller ? controller.domElement.querySelector( 'input' ) : undefined; },
			readOnlyEl = ( controller, boReadOnly ) => {

			const element = getInputEl( controller );
			if ( element ) element.readOnly = boReadOnly;
		
		},
			isReadOnlyEl = ( controller ) => {
			
			const element = getInputEl( controller );
			if ( element ) return element.readOnly;
		
		},
			isReadOnlyController = (controller) => {

			if (controller.boSetValue) return true;
			if (isReadOnlyEl(controller)) {

				if (controller.getValue() !== controller.initialValue) {

					if (controller.boSetValue === undefined) {

						controller.boSetValue = true;
						setValue(controller, controller.initialValue);
						controller.boSetValue = undefined;
						controller.initialValue = controller.getValue();//Эта строка нужна в случае когда новое зачения невозможно установиь точно таким же, как initialValue
						//Иначе перепонится стек

					}

				}
				return true;

			}
			return false;

		}

		function exposePosition( selectedPointIndex ) {

			if ( selectedPointIndex === undefined )
				selectedPointIndex = guiSelectPoint.getSelectedPointIndex();//Эта строка слишком медленно выполняется если число точек frustumPoints велико
			//Поэтому selectedPointIndex беру из intersection.index индекс точки, над которй щелнул мышью
			if ( selectedPointIndex === -1 )
				return;

			const mesh = cMeshs.__select.options[cMeshs.__select.options.selectedIndex].mesh,
				position = getObjectPosition( mesh, selectedPointIndex );

			if ( ( options.axesHelper !== undefined ) )

				// && ( ( mesh.userData.isInfo === undefined ) || ( mesh.userData.isInfo() ) ) )
				//если делать эту проверку, то будут неправильно отображаться пунктирные линии для frustumPoints точки
				//когда в настройках frustumPoints не стоит галочка info
				//когда в gui пользователь выбрал точку frustumPoints из списка '3D objects'(этот пункт будет недоступен когда я уберу frustumPoints из списка '3D objects' когда в настройках frustumPoints не стоит галочка info)
				//и когда пользователь передвигает камеру с помощью orbitControls

				if ( ( options.axesHelper !== false ) && ( options.axesHelper !== undefined ) )
					options.axesHelper.exposePosition( { object: mesh, index: selectedPointIndex } );

			if ( cWorld.x ) cWorld.x.setValue( position.x );
			if ( cWorld.y ) cWorld.y.setValue( position.y );
			if ( cWorld.z ) cWorld.z.setValue( position.z );

			//Возможно не надо делать такую глубокую проверку. Не тестировал
			if(
				mesh.userData.player &&
				mesh.userData.player.arrayFuncs
			) {

/*				
				const selectedPoint = mesh.userData.player.arrayFuncs[mesh.userData.myObject && mesh.userData.myObject.guiPoints ?
					mesh.userData.myObject.guiPoints.seletedIndex(selectedPointIndex) : selectedPointIndex]
*/
				const selectedPoint = mesh.userData.player.arrayFuncs[mesh.userData.myObject.guiPoints.seletedIndex(selectedPointIndex)];
				if(
					selectedPoint &&
					selectedPoint.controllers
				) {
					
					const controllers = mesh.userData.player.arrayFuncs[selectedPointIndex].controllers;
					if ( controllers.x && controllers.x.controller ) controllers.x.controller.value = position.x;
					if ( controllers.y && controllers.y.controller ) controllers.y.controller.value = position.y;
					if ( controllers.z && controllers.z.controller ) controllers.z.controller.value = position.z;
				}

			}

		}
		this.exposePosition = exposePosition;
		function setValue( controller, v ) {

			if ( !controller )
				return;
			const input = getInputEl( controller ),//controller.domElement.querySelector( 'input' ),
				readOnly = input.readOnly;
			input.readOnly = false;
			controller.object[controller.property] = v;
			if ( controller.__onChange )
				controller.__onChange.call( controller, v );
			controller.initialValue = v;
			controller.updateDisplay();
			input.readOnly = readOnly;
			return controller;

		}
		var wLimitsDefault;
		/**
		 * Sets local position controllers to read-only
		 * @param {boolean} boReadOnly true is read-only
		 */
		this.setReadOnlyPosition = function ( boReadOnly ) {

			readOnlyEl( cX, boReadOnly );
			readOnlyEl( cY, boReadOnly );
			readOnlyEl( cZ, boReadOnly );
			readOnlyEl( cW, boReadOnly );

		}
		function setPosition(intersectionSelected) {

			const player = intersectionSelected.object.userData.player;

			var boDisplayFuncFolder = 'none';
			if (player && player.arrayFuncs) {

				const mesh = getMesh();
//				funcFolder.setFunction(player.arrayFuncs[mesh.userData.myObject && mesh.userData.myObject.guiPoints ? mesh.userData.myObject.guiPoints.seletedIndex(intersectionSelected.index) : intersectionSelected.index]);
				funcFolder.setFunction(player.arrayFuncs[mesh.userData.myObject.guiPoints.seletedIndex(intersectionSelected.index)]);
				boDisplayFuncFolder = 'block';

			}
			funcFolder.displayFolder(boDisplayFuncFolder);
			/*Для установки cCameraTarget после выбора точки. Если это оставить то неправильно учтанавливается галочка cCameraTarget если:
			1 устанвить cCameraTarget для выбранной точки
			2 запустить плеер
			3 уброать cCameraTarget
			4 запустить плеер. Снова установиться cCameraTarget
			*/
			if (cCameraTarget) {

				options.playerOptions.cameraTarget.changeTarget(intersectionSelected.object, intersectionSelected.index);
				cCameraTarget.updateDisplay();

			}

//			const positionLocal = getObjectLocalPosition(intersectionSelected.object, intersectionSelected.index);
/*			
			const myObject = intersectionSelected.object.userData.myObject;
			if (myObject.guiPoints && myObject.guiPoints.verticeId) intersectionSelected.index = myObject.guiPoints.verticeId;
*/			
			const positionLocal = _this.getObjectLocalPosition(intersectionSelected);
			setValue(cX, positionLocal.x);
			setValue(cY, positionLocal.y);
			setValue(cZ, positionLocal.z);

/*			
			if (intersectionSelected.object.userData.gui) intersectionSelected.object.userData.gui.setValues(intersectionSelected.index, myObject? myObject.guiPoints.timeAngles : undefined);
*/			
			if (intersectionSelected.object.userData.gui)
				intersectionSelected.object.userData.gui.setValues(intersectionSelected.index, intersectionSelected.object.userData.myObject.guiPoints.timeAngles);

			const position = _this.getObjectPosition(intersectionSelected.object, intersectionSelected.index);
			setValue(cWorld.x, position.x);
			setValue(cWorld.y, position.y);
			setValue(cWorld.z, position.z);

			var displayControllerW, displayControllerColor;//, displayControllerOpacity;
			if (intersection.object.userData.player && (typeof intersection.object.userData.player.arrayFuncs === "function")) {

				//Сюда попадает когда пользователь выбироает точку в frustumPoints
				//console.error( 'arrayFuncs === "function" under constraction' );

			}
			const func = player && player.arrayFuncs ? 
					player.arrayFuncs.intersection ?
						player.arrayFuncs.intersection(intersectionSelected.index) :
						player.arrayFuncs[intersectionSelected.index] :
					undefined,
				attributes = intersectionSelected.object.geometry.attributes;
			if (!attributes.color) {

				displayControllerW = none;
				displayControllerColor = none;

			} else {

				const setColorControl = (color) => {
					
					const strColor = '#' + color.getHexString();
					//Сначала надо установить initialValue потому что для FrustumPoints я устанвил readOnly для cColor.
					//В этом случае я не могу отобразить цвет следующей точки FrustumPoints потому что в режиме readOnly
					//при изменении цвета восстанвливается старый цвет из initialValue.
					cColor.initialValue = strColor;
					cColor.userData = { intersection: intersectionSelected, };
					cColor.setValue(strColor);
					
				}
				if (attributes.position.itemSize < 4) {

					if (
						intersectionSelected.object.material.vertexColors === true ||
						(intersectionSelected.object.material instanceof THREE.ShaderMaterial === true)
					) {
						
						displayControllerW = none;
						displayControllerColor = block;
						setColorControl( new THREE.Color().fromBufferAttribute(attributes.color, intersectionSelected.index) );

					}
					
				} else {

					function isWObject() { return (typeof func.w === 'object') && (func.w instanceof THREE.Color === false); }
					const mesh = getMesh(), verticeColor = mesh.userData.myObject ? mesh.userData.myObject.verticeColor(intersectionSelected.index) : undefined;
					var color = (func === undefined) || (!attributes.color && !attributes.ca) ?
						undefined :
						Array.isArray(func.w) || (typeof func.w === "function") ?
							Player.execFunc(func, 'w', options.time, options) :
							isWObject() ?
								Player.execFunc(func.w, 'func', options.time, options) :
								typeof func.w === "string" ?
									Player.execFunc(func, 'w', options.time, options) :
									verticeColor != undefined ?
										verticeColor :
										func.w;
					if (Array.isArray(color)) color = new THREE.Color(color[0], color[1], color[2]);
					if (color instanceof THREE.Color) {

						displayControllerW = none;
						displayControllerColor = block;

						//color
						if (intersectionSelected.object.userData.player.arrayFuncs === undefined) {

							displayControllerColor = none;

						} else {

							setColorControl(color);
							cOpacity.userData = { intersection: intersectionSelected, };

						}

					} else {

						if ( cW === undefined )
							displayControllerW = none;
						else {

							if ( color === undefined )
								displayControllerW = none;
							else {
								
								if ( options.scales.w.isColor != false ) {

									if (!wLimitsDefault) {
	
										wLimitsDefault = {
	
											min: cW.__min,
											max: cW.__max,
	
										}
	
									}
									if (isWObject()) {
	
										cW.min(func.w.min !== 'undefined' ? func.w.min : wLimitsDefault.min);
										cW.max(func.w.max !== 'undefined' ? func.w.max : wLimitsDefault.max);
										if ((cW.__min !== 'undefined') && (cW.__max !== 'undefined'))
											cW.step((cW.__max - cW.__min) / 100)
	
									} else {
	
										cW.min(wLimitsDefault.min);
										cW.max(wLimitsDefault.max);
	
									}
									setValue(cW, color);

								}
								displayControllerW = block;

							}

						}
						displayControllerColor = none;

					}

				}

			}
			dislayEl( cW, displayControllerW );
			dislayEl( cColor, displayControllerColor );

			const mesh = getMesh(), boReadOnly = intersectionSelected.object.userData.boFrustumPoints === true ? true : mesh.userData.gui && mesh.userData.gui.isLocalPositionReadOnly ? true : false,
				boOpacity = ( mesh.userData.myObject && mesh.userData.myObject.isOpacity ) || ( mesh.material.transparent && mesh.material.vertexColors),
				attributeColor = mesh.geometry.attributes.color;
			dislayEl( cOpacity, boOpacity ? block : none );
			if ( boOpacity ) {

				if ( attributeColor.itemSize != 4 ) console.error( 'GuiSelectPoint.setPosition: Invalid mesh.geometry.attributes.color.itemSize = ' + attributeColor.itemSize);
				cOpacity.initialValue = attributeColor.array[intersectionSelected.index * attributeColor.itemSize + 3];
				cOpacity.setValue( cOpacity.initialValue );

			}
			_this.setReadOnlyPosition(boReadOnly);
			readOnlyEl( cColor, boReadOnly );
			readOnlyEl( cOpacity, boReadOnly );
			funcFolder.displayFolder( !boReadOnly );

		}
		/**
		 * Specify a maximum, minimum and step value for [NumberController]{@link https://github.com/dataarts/dat.gui/blob/master/API.md#NumberController}.
		 * 
		 * @param {String} axis axis. Currently 'w' axis is available only.
		 * @param {object} scale The following <b>NumberController</b> properties are available:
		 * @param {object} [scale.min] Minimum allowed value.
		 * @param {object} [scale.max] Maximum allowed value.
		 * @param {object} [scale.step] Increment by which to change value.
		 */
		this.setAxisControl = function ( axis, scale ) {

			switch( axis ) {

				case 'w': 
					if ( scale.min != undefined ) cW.min(scale.min);
					if ( scale.max != undefined ) cW.max(scale.max);
					if ( scale.step != undefined ) cW.step(scale.step);
					break;
				default: console.error( 'GuiSelectPoint.setAxisControl. Invalid axis: '  + axis);
					
			}
			
		}
		/**
		 * sets axis name of the controllers
		 * @param {String} axis axis. 'x' or 'y' or 'z'.
		 * @param {String} name new axis name
		 */
		this.setAxisName = function ( axis, name ) {

			//position
			cPosition[axis].name( name );
			folders.position[axis].name = name;

			//scale
			const cScale = axis === 'x' ? cScaleX : axis === 'y' ? cScaleY : axis === 'z' ? cScaleZ : undefined;
			cScale.name( name );

			//rotation
			const cRotation = cRotations[axis];
			if ( cRotation.name ) cRotation.name( name );

		}
		/**Sets controllers to position, scale and rotation of the mesh.  If AxesHelper is exist, expose the mesh to the axes. */
		this.setMesh = function () {

			boSetMesh = true;
			setScaleControllers();
			setPositionControllers();
			setRotationControllers();
			exposePosition();
			boSetMesh = false;

		}
		/**
		 * Sets controllers to position, scale and rotation of the mesh.  If AxesHelper is exist, expose the mesh to the axes.
		 * @param intersectionSelected [THREE.Raycaster.intersectObject]{@link https://threejs.org/docs/index.html#api/en/core/Raycaster.intersectObject}
		 */
		this.setPosition = function ( intersectionSelected ) {

			for ( var i = 0; i < cMeshs.__select.length; i++ ) {

				var option = cMeshs.__select[i];
				if ( option.selected && Object.is( option.mesh, intersectionSelected.object ) ) setPosition( intersectionSelected );

			}

		}
		/**
		 * update the values of the controllers of the world position
		 */
		this.update = function ( boSetInitialValue = false ) {

			const selectedItem = cMeshs.__select.options[cMeshs.__select.options.selectedIndex];
			if ( !selectedItem ) return;
			const mesh = selectedItem.mesh;
			if ( !mesh )
				return;
			const index = this.getSelectedPointIndex();
			if ( index === -1 )
				return;
			const position = getObjectPosition( mesh, index );
			if( cWorld.x ) cWorld.x.setValue( position.x );
			if( cWorld.y ) cWorld.y.setValue( position.y );
			if( cWorld.z ) cWorld.z.setValue( position.z );
			if( cW && ( position instanceof THREE.Vector4 )) cW.setValue( position.w );

			const positionLocal = getObjectLocalPosition( mesh, index );
			if ( boSetInitialValue ) {
				
				if( cX ) cX.initialValue = positionLocal.x;
				if( cY ) cY.initialValue = positionLocal.y;
				if( cZ ) cZ.initialValue = positionLocal.z;
				if( cW ) cW.initialValue = positionLocal.w;
				
			}
			if( cX ) cX.setValue( positionLocal.x );
			if( cY ) cY.setValue( positionLocal.y );
			if( cZ ) cZ.setValue( positionLocal.z );

			funcFolder.update( mesh.userData.player.arrayFuncs[index] );

		}
		/**
		 * get index of the mesh in the cMeshs controller
		 * @param {THREE.Mesh} mesh [Mech]{@link https://threejs.org/docs/index.html#api/en/objects/Mesh}
		 * @returns index of selectred mesh.
		 */
		this.getMeshIndex = function ( mesh ) {

			if ( mesh === undefined )
				return mesh;
			var index;// = intersectionSelected.object.userData.index;
			for ( index = 0; index < cMeshs.__select.options.length; index++ ) {

				var option = cMeshs.__select.options[index];
				if ( Object.is( option.mesh, mesh ) )
					return index;

			}
			//Сюда попадает когда Mesh проверяется с помощью THREE.Raycaster находится ли он под мышью, но этот Mesh не внесен в список GuiSelectPoint

		}
		/**
		 * Set a mesh in the mesh's list control
		 * @param {number} index index of the mesh in the mesh's list control
		 * @param {THREE.Mesh} mesh new [Mech]{@link https://threejs.org/docs/index.html#api/en/objects/Mesh}
		 */
		this.setIndexMesh = function ( index, mesh ) {

			if ( index === undefined )
				return;
			cMeshs.__select.options[index].mesh = mesh;
			this.selectPoint( -1 );

		}
		/**
		 * Selects a point in the points list control
		 * @param {number} index index of the point in the points list control
		 */
		this.selectPoint = function ( index ) {

			cPoints.__onChange( index );
			cPoints.__select[index + 1].selected = true;

		}
		/**
		 * Removes a mesh from the select point GUI
		 * @param {THREE.Mesh} mesh [Mech]{@link https://threejs.org/docs/index.html#api/en/objects/Mesh} for removing.
		 * @param {boolean} [boHideF3DObjects=true] true - hide the 'Meshes' folder if no any mesh exists in the meshs dropdown menu.
		 */
		this.removeMesh = function ( mesh, boHideF3DObjects = true ) {

			const index = this.getMeshIndex( mesh ),
				selectedIndex = cMeshs.__select.selectedIndex;
			if ( index === undefined ) return;
			cMeshs.__select.remove( index );
			if ( selectedIndex === index ) {

				cPoints.__onChange( -1 );
				_this.removePoints();
				cMeshs.__onChange( -1 );

			}

			if ( ( cMeshs.__select.options.length < 2 ) && boHideF3DObjects ) f3DObjects.domElement.style.display = 'none';

		}

		const arrayMeshs = [];//сюда попадают все mesh в случае, когда this.addMesh вызывается до вызова this.add
		//тоесть когда GuiSelectPoint еще не добавлен в dat.gui

		/**
		 * Adds new mesh into select point GUI
		 * @param {THREE.Mesh} mesh new [Mech]{@link https://threejs.org/docs/index.html#api/en/objects/Mesh}.
		 */
		this.addMesh = function ( mesh ) {

			if ( !mesh.parent ) {

				console.error( 'GuiSelectPoint.addMesh: Add mesh into scene first.' );
				return;

			}

			mesh.userData.myObject ||= {

				verticeColor: () => {},
				verticeOpacity: () => {},
				
			};
			mesh.userData.myObject.guiPoints ||= {

				seletedIndex: (guiIndexStr) => { return guiIndexStr; },
				getVerticeId: (index) => { return index; },
//				getVerticeId: () => {},
				create: (fPoints, cPoints, count) => {

					for ( var iPosition = mesh.geometry.drawRange.start; iPosition < count; iPosition++ ) {
		
						const opt = document.createElement( 'option' ),
							name = mesh.userData.player && mesh.userData.player.arrayFuncs ? mesh.userData.player.arrayFuncs[iPosition].name : '';
						opt.innerHTML = iPosition + ( name === undefined ? '' : ' ' + name );
						opt.setAttribute( 'value', iPosition );//Эта строка нужна в случае когда пользователь отменил выбор точки. Иначе при движении камеры будут появляться пунктирные линии, указвающие на несуществующую точку
						cPoints.__select.appendChild( opt );
		
					}
					
				},
				positionOffset: 0,
				getValue: (cPoints) => { return cPoints.__select.selectedOptions[0].index - 1; },
				onChangeAngle: (verticeId, angleId, angle) => { }
				
			};

			if ( !f3DObjects ) this.add();
			f3DObjects.domElement.style.display = 'block';
			
			if ( !cMeshs ) {

				//Test for duplicate item
				for ( var i = 0; i < arrayMeshs.length; i++ ) {

					if ( arrayMeshs[i].uuid === mesh.uuid ) {

						console.error( 'guiSelectPoint.addMesh: Duplicate mesh: ' + mesh.name );
						return;

					}

				}

				arrayMeshs.push( mesh );
				return;

			}

			//Test for duplicate item
			for ( var i = 0; i < cMeshs.__select.options.length; i++ ) {

				var option = cMeshs.__select.options[i];
				if ( mesh.userData.boFrustumPoints && ( option.mesh !== undefined ) && option.mesh.userData.boFrustumPoints )
					return;//duplicate FrustumPoints. Сюда попадает когда пользователь меняет количество слоев или Y точек в FrustumPoints.
				if (
					( option.mesh !== undefined ) &&
					( option.mesh.uuid === mesh.uuid )
				) {

					console.error( 'guiSelectPoint.addMesh(...): Duplicate mesh.' );
					return;

				}

			}
			const opt = document.createElement( 'option' );
			opt.innerHTML = cMeshs.__select.length + ' ' + ( mesh.name === '' ? mesh.constructor.name : mesh.name );
			opt.mesh = mesh;
			mesh.userData.default = mesh.userData.default || {

				scale: new THREE.Vector3().copy( mesh.scale ),
				position: mesh.position instanceof THREE.Vector3 ?
					new THREE.Vector3().copy( mesh.position ) :
					mesh.position instanceof THREE.Vector4 ? new THREE.Vector4().copy( mesh.position ) : undefined,
				rotation: new THREE.Euler().copy( mesh.rotation ),

			}
			cMeshs.__select.appendChild( opt );
			displayVerticeID( mesh );

		}
		this.getObjectLocalPosition = (intersectionSelected) => {

			const myObject = intersectionSelected.object.userData.myObject,
//				positionData = myObject.getPositionData ? myObject.getPositionData( intersectionSelected.index,  myObject.guiPoints.timeId ) : { verticeId: intersectionSelected.index };
				positionData = myObject.getPositionData( intersectionSelected.index,  myObject.guiPoints.timeId );
			return getObjectLocalPosition( intersectionSelected.object, positionData.verticeId );
//			return getObjectLocalPosition( intersectionSelected.object, intersectionSelected.index );
			
		}
		this.getObjectPosition = (object, index) => {

			return getObjectPosition( object, index);
/*			
			const mesh = getMesh();
			return getObjectPosition( object,
				mesh.userData.myObject.guiPoints.positionOffset + index);
*/				
			
		}
		/**
		 * User has selected a point
		 * @param {Object} intersectionSelected See [intersectObject]{@link https://threejs.org/docs/index.html#api/en/core/Raycaster.intersectObject}
		 */
		this.select = function ( intersectionSelected ) {

			const myObject = intersectionSelected.object.userData.myObject;
			if ( !myObject.getPositionData ) 
				myObject.getPositionData = ( index ) => { return { verticeId: index, positionId: index * intersectionSelected.object.geometry.attributes.position.itemSize } }
/*			
			const mesh = getMesh();
//			if (mesh.userData.myObject && mesh.userData.myObject.guiPoints) intersectionSelected.index += mesh.userData.myObject.guiPoints.positionOffset;
			const position = getObjectLocalPosition( intersectionSelected.object,
				(mesh.userData.myObject && mesh.userData.myObject.guiPoints ? mesh.userData.myObject.guiPoints.positionOffset : 0) + intersectionSelected.index );
*/				
//			const position = this.getObjectLocalPosition(intersectionSelected);

			//f3DObjects.close();//если тут не закрывать папку, то ингода прорпадает скроллинг окна dat.GUI
			//for testing:
			//Open https://raw.githack.com/anhr/myThreejs/master/Examples/html/
			//Set browser window height about 500 pixels.
			//Click Full Screen button.
			//Open Controls
			//Click a point.The "Meshes" folder opens and you can see the scrolling of the dat.gui window.

			//select mesh
			const index = this.getMeshIndex( intersectionSelected.object );
			if ( !index )
				return;//Сюда попадает когда Mesh проверяется с помощью THREE.Raycaster находится ли он под мышью, но этот Mesh не внесен в список GuiSelectPoint
			if ( cMeshs.__select[index].selected === false ) {

				cMeshs.__select[index].selected = true;
				cMeshs.__onChange( index - 1, intersectionSelected );

			} else if ( cCustom ) {

				const mesh = getMesh();
				cCustom.object(intersectionSelected.event && intersectionSelected.event.button === 0 ?
						mesh :
						undefined,//Пользователь нажал не левую кнопку мыши. Надо восстановить выбранный nD объект
					dat, options);

			}

//			myObject.guiPoints.verticeId = intersectionSelected.index;
			intersectionSelected.index = myObject.guiPoints.getVerticeId(intersectionSelected.index);
			this.selectPoint2 = function ( selectedMesh ) {

				if ( ( intersectionSelected.index === undefined ) || isNaN( intersectionSelected.index ) )
					return;

				//сделал эту проверку потому что не могу придумать как удалить intersectionSelected.index когда пользователь врусную сменил mesh
				if ( ( selectedMesh !== undefined ) && !Object.is( intersectionSelected.object, selectedMesh ) )
					return;//Сначала пользователь выбрал точку с помошщью мыши
				//Потом сменил Meshes/Select

				if ( !intersectionSelected.object.userData.boFrustumPoints ) {

					//fPoints.open();много времени на открытие когда много точек
/*					
					const guiPoints = intersectionSelected.object.userData.myObject ? intersectionSelected.object.userData.myObject.guiPoints : undefined,
						point = cPoints.__select[guiPoints ? cPoints.__select.selectedIndex : intersectionSelected.index + 1];
*/						
					const point = cPoints.__select[intersectionSelected.index + 1];
					if ( point ) point.selected = true;

				} else {//FrustumPoints

					cFrustumPoints.pointIndexes( intersectionSelected.object.userData.pointIndexes( intersectionSelected.index ) );

				}
				const block = 'block';
				displayPointControllers( block );
				intersection = intersectionSelected;
				if ( guiParams.setIntersection )
					guiParams.setIntersection( intersectionSelected );
				setPosition( intersectionSelected );

				const mesh = getMesh(), arrayFuncs = mesh.userData.player.arrayFuncs,
					line = !mesh.userData.player ||
						( mesh.userData.player.arrayFuncs === undefined ) ||
						( typeof intersection.object.userData.player.arrayFuncs === "function" ) ?
						undefined :
						(arrayFuncs.intersection ? arrayFuncs.intersection(intersectionSelected.index) : arrayFuncs[intersectionSelected.index]).line;//You can not trace points if you do not defined the mesh.userData.player.arrayFuncs
				if ( cTrace )
					cTrace.setValue( ( line === undefined ) ?
						false : line.isVisible() )

				cRestoreDefaultLocalPosition.domElement.parentElement.parentElement.style.display =
					!intersection.object.userData.player || ( intersection.object.userData.player.arrayFuncs === undefined ) ?
						'none' : block;

			}
			this.selectPoint2( undefined );

		}
		/**
		 * Is mesh selected in the GuiSelectPoint?
		 * @param {THREE.Mesh} meshCur [Mech]{@link https://threejs.org/docs/index.html#api/en/objects/Mesh} to be tested
		 * @returns true if <b>meshCur</b> is selected.
		 */
		this.isSelectedMesh = function ( meshCur ) { return getMesh() === meshCur }
		/**
		 * @returns index of the selected point.
		 */
		this.getSelectedPointIndex = function () {

			if ( ( cFrustumPoints !== undefined ) &&
				cFrustumPoints.isDisplay() &&//FrustumPoints folder is visible
				options.frustumPoints &&
				options.frustumPoints.isDisplay()//The cDisplay checkbox of the frustumPoints' is checked
			) {

				var selectedIndex = cFrustumPoints.getSelectedIndex();
				return selectedIndex === null ? - 1 : selectedIndex;

			}
			if ( cPoints === undefined ) {

				if ( selectedPointIndex === undefined )
					console.error( 'myThreejs.create.onloadScripts.init.guiSelectPoint.getSelectedPointIndex:  selectedPointIndex = ' + selectedPointIndex );
				return selectedPointIndex;//options.dat !== true and gui === undefined. Do not use dat.gui

			}
			const mesh = getMesh();
			if ( !mesh ) return -1; //не выбран 3d объект.
/*			
			const index = cPoints.__select.selectedOptions[0].index;
			return index - 1;
*/
//			return mesh.userData.myObject && mesh.userData.myObject.guiPoints ? cPoints.getValue() : cPoints.__select.selectedOptions[0].index - 1;
			return mesh.userData.myObject.guiPoints.getValue(cPoints);

		}
		function getMesh() {

			if ( !cMeshs ) {

				console.error( 'GuiSelectPoint().getSelectedPointIndex().getMesh(): call GuiSelectPoint.add(); first.' );
				return undefined;

			}
			const selectedIndex = cMeshs.__select.options.selectedIndex;
			if ( selectedIndex !== -1 )
				return cMeshs.__select.options[cMeshs.__select.options.selectedIndex].mesh;
			return undefined;

		}
		function isNotSetControllers() {

			return ( getMesh() === undefined );

		}
		function setScaleControllers() {

			if ( isNotSetControllers() )
				return;
			const mesh = getMesh();
			if ( cScaleX ) cScaleX.setValue( mesh.scale.x );
			if ( cScaleY ) cScaleY.setValue( mesh.scale.y );
			if ( cScaleZ ) cScaleZ.setValue( mesh.scale.z );

		}
		function setPositionControllers() {

			if ( isNotSetControllers() )
				return;
			const mesh = getMesh();
			if ( cPosition.x ) cPosition.x.setValue( mesh.position.x );
			if ( cPosition.y ) cPosition.y.setValue( mesh.position.y );
			if ( cPosition.z ) cPosition.z.setValue( mesh.position.z );

		}
		function setRotationControllers() {

			if ( isNotSetControllers() )
				return;
			const mesh = getMesh();
			const setValue = ( controller, angle ) => {

				if ( ( angle < controller.__min ) || ( angle > controller.__max ) ) console.error( 'GuiSelectPoint.setRotationControllers(): Invalid angle = ' + angle + ' range. Available range from ' + controller.__min + ' to ' + controller.__max )
				controller.setValue( angle );
				
			}
			if ( cRotations.x ) setValue( cRotations.x, mesh.rotation.x );
			if ( cRotations.y ) setValue( cRotations.y, mesh.rotation.y );
			if ( cRotations.z ) setValue( cRotations.z, mesh.rotation.z );

		}
		function visibleTraceLine( intersection, value, getMesh ) {

			if ( !intersection || !intersection.object.userData.player || intersection.object.userData.player.arrayFuncs === undefined )
				return;
			const arrayFuncs = intersection.object.userData.player.arrayFuncs;
			var index = intersection.index || 0,
				point = arrayFuncs.intersection ? arrayFuncs.intersection(index) : arrayFuncs[index],
				line = point === undefined ? undefined : point.line;
			if ( ( line !== undefined ) )
				line.visible( value );
			if ( !value )
				return;
			if ( point.line !== undefined )
				return;
			point.line = new Player.traceLine( options );

			//color
			var color = intersection.object.geometry.attributes.color;
			if ( color === undefined )
				color = new THREE.Color( 0xffffff );//white
			else {

				var vector = new THREE.Vector3().fromArray( color.array, index * color.itemSize )
				color = new THREE.Color( vector.x, vector.y, vector.z );

			}

			point.line.addPoint(

				getMesh(), index,
				color

			);

		}

		this.updateScale = function ( axisName ) {

			const none = 'none', block = 'block', display = options.scales[axisName].isAxis() ? block : none;
			
			//Rotation

			const boX = options.scales['x'].isAxis(),
				 boY = options.scales['y'].isAxis(),
				 boZ = options.scales['z'].isAxis();
			var n = 0;//space dimension
			if ( boX ) n++;
			if ( boY ) n++;
			if ( boZ ) n++;
			switch ( n ) {

				case 1:
					if ( fRotation ) fRotation.domElement.style.display = none;
					break;
				case 2:
					fRotation.domElement.style.display = block;
					if ( boX && cRotations.x.domElement ) cRotations.x.domElement.parentElement.parentElement.style.display = none;
					if ( boY && cRotations.y.domElement ) cRotations.y.domElement.parentElement.parentElement.style.display = none;
					if ( boZ && cRotations.z.domElement ) cRotations.z.domElement.parentElement.parentElement.style.display = none;
					break;
				default: console.error( 'GuiSelectPoint.updateScale: Invalid space dimension = ' + n );
					return;

			}
			
			if ( !folders.position[axisName] ) {

				if ( options.scales[axisName].isAxis() ) console.error( 'GuiSelectPoint.updateScale: Under constraction.' );
				return;

			}
			
			//position

			folders.position[axisName].domElement.style.display = display;
			cWorld[axisName].domElement.parentElement.parentElement.style.display = display;

			//Scale, point local position

			var c, cScale;
			switch(axisName) {

				case 'x':
					c = cX;
					cScale = cScaleX;
					break;
				case 'y':
					c = cY;
					cScale = cScaleY;
					break;
				case 'z':
					c = cZ;
					cScale = cScaleZ;
					break;
				default: console.error('GuiSelectPoint.updateScale: Invalid axis name: ' + axisName);
					return;

			}
			c.domElement.parentElement.parentElement.style.display = display;
			cScale.domElement.parentElement.parentElement.style.display = display;

		}
		function displayVerticeID( object ) {

			if ( object.userData.boFrustumPoints ) return;
			if ( !options.dat.guiSelectPoint.boDisplayVerticeID ) {

				for ( var i = object.children.length - 1; i >= 0; i-- ) {

					const child = object.children[i];
					if ( child.type === 'Sprite' ) object.remove( child );

				}
				return;

			}
			if (!object.geometry) return;//Probably this is Group
			let gp = object.geometry.attributes.position;
			object.updateMatrixWorld();
			const drawRange = object.geometry.drawRange, count = (drawRange.count === Infinity) ? gp.count : drawRange.start + drawRange.count;
			for ( let i = drawRange.start; i < count; i++ ) {

				let p = new THREE.Vector3().fromBufferAttribute( gp, i ); // set p from `position`
				//						object.localToWorld(p); // p has wordl coords
				const spriteText = new SpriteText( i, p, { group: object } );
				spriteText.userData.pointID = i;

			}

		}

		function addPoints( mesh, intersectionSelected ) {

			//https://threejs.org/docs/index.html?q=buffer#api/en/core/BufferGeometry.setDrawRange
			const count = mesh.geometry.userData.drawRange ?
				mesh.geometry.userData.drawRange().count ://Во вселенной задал диапазон видимых вершин
				mesh.geometry.index === null ?
					 //геометрия не индексирована. Значит mesh.geometry.drawRange.count указывает на количество видимых вершин
					 (mesh.geometry.drawRange.count + mesh.geometry.drawRange.start) > mesh.geometry.attributes.position.count ?
						 mesh.geometry.attributes.position.count ://диапазон вершин больше количества вершин
						 mesh.geometry.drawRange.count + mesh.geometry.drawRange.start//добавлять только вершины, которые вошли в заданный диапазон
					 :
					 //геометрия индексирована. mesh.geometry.drawRange.count указывает на количество индексов, которые нужно рисовать
					 mesh.geometry.attributes.position.count;//По умолчанию все вершины видно
			mesh.userData.myObject.guiPoints.create( fPoints, cPoints, count, intersectionSelected );
/*			
			if (mesh.userData.myObject && mesh.userData.myObject.guiPoints) mesh.userData.myObject.guiPoints.create( fPoints, cPoints );
			else for ( var iPosition = mesh.geometry.drawRange.start; iPosition < count; iPosition++ ) {

				const opt = document.createElement( 'option' ),
					name = mesh.userData.player && mesh.userData.player.arrayFuncs ? mesh.userData.player.arrayFuncs[iPosition].name : '';
				opt.innerHTML = iPosition + ( name === undefined ? '' : ' ' + name );
				opt.setAttribute( 'value', iPosition );//Эта строка нужна в случае когда пользователь отменил выбор точки. Иначе при движении камеры будут появляться пунктирные линии, указвающие на несуществующую точку
				cPoints.__select.appendChild( opt );

			}
*/			

		}

		function createPlayerArrayFuncs( mesh ) {

			if ( !mesh || mesh.userData.boFrustumPoints  || ( mesh.userData.player.boArrayFuncs === false ) ) return;
			if ( !mesh.userData.player ) mesh.userData.player = {};
			if ( !mesh.userData.player.arrayFuncs && mesh.geometry ) {

				const position = mesh.geometry.attributes.position;
				mesh.userData.player.arrayFuncs = [];
				for ( var i = 0; i < position.count; i++ ) {

					const vector = new THREE.Vector4().fromArray( mesh.geometry.attributes.position.array, i * position.itemSize );

					mesh.userData.player.arrayFuncs.push( vector );

				}

			}

		}

		/**
		 * Adds select point GUI into dat.gui folder
		 * @param {GUI} [folder] [dat.gui]{@link https://github.com/anhr/dat.gui} folder.
		 */
		this.add = function ( folder ) {

			folder = folder || options.dat.gui;
			if ( !folder )
				return;//gui не создан
			f3DObjects = folder.addFolder( lang.meshs );
			f3DObjects.domElement.style.display = 'none';
			var mesh, buttonScaleDefault, buttonPositionDefault, buttonRotationDefault;

			cMeshs = f3DObjects.add( { Meshs: lang.notSelected }, 'Meshs', { [lang.notSelected]: -1 } ).onChange( function ( value, intersectionSelected ) {

				value = parseInt( value );

				cPoints.__onChange( -1 );//сбросить настройки точки
				
				mesh = getMesh();

				const none = 'none', block = 'block';
				if (fPoint.fCustomPoint) {

					fPoint.removeFolder(fPoint.fCustomPoint);
					delete fPoint.fCustomPoint;
					
				}
				if ( mesh && mesh.userData.gui ) { fPoint.fCustomPoint = mesh.userData.gui.addControllers( fPoint, {
					
//					getInputEl: getInputEl,
					readOnlyEl: readOnlyEl,
//					isReadOnlyEl: isReadOnlyEl,
//					setValue: setValue,
					isReadOnlyController: isReadOnlyController,
				
				} ); }
				
				if ( cCustom ) cCustom.object( mesh, dat, value === -1 );//options );

				createPlayerArrayFuncs( mesh );

				var display;
				if ( mesh === undefined ) {

					display = none;
					mesh = undefined;
					if ( options.axesHelper !== undefined )
						options.axesHelper.exposePosition( getObjectPosition( getMesh(), value ) );

				} else {

					const displayDefaultButtons = mesh.userData.default === undefined ? none : block;
					buttonScaleDefault.domElement.parentElement.parentElement.style.display = displayDefaultButtons;
					buttonPositionDefault.domElement.parentElement.parentElement.style.display = displayDefaultButtons;
					if ( buttonRotationDefault ) buttonRotationDefault.domElement.parentElement.parentElement.style.display = displayDefaultButtons;

					display = block;
					var displayPoints = none, displayfPoints = none, displayFrustumPoints = block;

					cPoints.__onChange( -1 );
					_this.removePoints();

					if ( mesh.userData.controllers !== undefined ) {

						//FrustumPoints
						mesh.userData.controllers();

					} else {

						displayPoints = block;
						displayFrustumPoints = none;

						if ( mesh.geometry && mesh.geometry.attributes ) {

							displayfPoints = block;
							addPoints( mesh, intersectionSelected );

						}

					}
					dislayEl( cPoints, displayPoints );
					if ( cTraceAll ) {

						dislayEl( cTraceAll, options.player ? displayPoints : false );

					}
					if ( cFrustumPoints !== undefined )
						cFrustumPoints.display( displayFrustumPoints );
					setScaleControllers();
					setPositionControllers();
					setRotationControllers();
					orbitControlsOptions = undefined;

				}
				fMesh.domElement.style.display = display;

				if ( ( mesh !== undefined ) && ( mesh.userData.traceAll !== undefined ) )
					cTraceAll.setValue( mesh.userData.traceAll );

			} );
			dat.controllerNameAndTitle( cMeshs, lang.select );

			fMesh = f3DObjects.addFolder( lang.mesh );
			fMesh.domElement.style.display = 'none';
			fMesh.open();

			//Scale

			const fScale = fMesh.addFolder( lang.scale );
			fScale.add( new ScaleController( function ( customController, action ) {

				const zoom = customController.controller.getValue();
				mesh.scale.x = action( mesh.scale.x, zoom );
				mesh.scale.y = action( mesh.scale.y, zoom );
				mesh.scale.z = action( mesh.scale.z, zoom );
				mesh.needsUpdate = true;

				setScaleControllers();
				exposePosition();
				if ( options.frustumPoints )
					options.frustumPoints.updateCloudPoint( mesh );

			},
				{

					settings: { zoomMultiplier: 1.1, },
					getLanguageCode: getLanguageCode,
					newBool: true,

				} ) );
			const scale = new THREE.Vector3();
			function setScale( axisName, value ) {

				mesh.scale[axisName] = value;
				mesh.needsUpdate = true;
				exposePosition();
				if ( options.frustumPoints )
					options.frustumPoints.updateCloudPoint( mesh );

			}
			if ( options.scales.x.isAxis() ) {

				cScaleX = dat.controllerZeroStep( fScale, scale, 'x', function ( value ) { setScale( 'x', value ); } );
				dat.controllerNameAndTitle( cScaleX, options.scales.x.name );

			}
			if ( options.scales.y.isAxis() ) {

				cScaleY = dat.controllerZeroStep( fScale, scale, 'y', function ( value ) { setScale( 'y', value ); } );
				dat.controllerNameAndTitle( cScaleY, options.scales.y.name );

			}
			if ( options.scales.z.isAxis() ) {

				cScaleZ = dat.controllerZeroStep( fScale, scale, 'z', function ( value ) { setScale( 'z', value ); } );
				dat.controllerNameAndTitle( cScaleZ, options.scales.z.name );

			}

			//Default scale button
			buttonScaleDefault = fScale.add( {

				defaultF: function ( value ) {

					mesh.scale.copy( mesh.userData.default.scale );
					mesh.needsUpdate = true;

					setScaleControllers();
					exposePosition();

				},

			}, 'defaultF' );
			dat.controllerNameAndTitle( buttonScaleDefault, lang.defaultButton, lang.defaultScaleTitle );

			//Position

			const fPosition = fMesh.addFolder( lang.position );

			function addAxisControllers( name ) {

				const scale = options.scales[name];
				if ( !scale.isAxis() )
					return;
				const axisName = scale.name,
					f = fPosition.addFolder( axisName );
				folders.position = folders.position || {};
				folders.position[axisName] = f;
				f.add( new PositionController( function ( shift ) {

					mesh.position[name] += shift;
					mesh.needsUpdate = true;

					setPositionControllers();
					exposePosition();
					if ( options.frustumPoints )
						options.frustumPoints.updateCloudPoint( mesh );

				}, { getLanguageCode: getLanguageCode, } ) );

				function setPosition( value ) {

					mesh.position[name] = value;
					mesh.needsUpdate = true;
					exposePosition();

				}
				const position = new THREE.Vector3();

				cPosition[name] = dat.controllerZeroStep( f, position, name, function ( value ) { setPosition( value ); } );
				dat.controllerNameAndTitle( cPosition[name], axisName );

			}
			addAxisControllers( 'x' );
			addAxisControllers( 'y' );
			addAxisControllers( 'z' );

			//Restore default position.
			buttonPositionDefault = fPosition.add( {

				defaultF: function ( value ) {

					mesh.position.copy( mesh.userData.default.position );
					mesh.needsUpdate = true;

					setPositionControllers();
					exposePosition();

				},

			}, 'defaultF' );
			dat.controllerNameAndTitle( buttonPositionDefault, lang.defaultButton, lang.defaultPositionTitle );

			//rotation

			function addRotationFolder() {

				const boX = options.scales.x.isAxis(),
					boY = options.scales.y.isAxis(),
					boZ = options.scales.z.isAxis();
				var n = 0;//space dimension
				if ( boX ) n++;
				if ( boY ) n++;
				if ( boZ ) n++;
				if ( n === 1 ) return;
				fRotation = fMesh.addFolder( lang.rotation );
				function addRotationControllers( name ) {

					const scale = options.scales[name];
					cRotations[name] = fRotation.add( new THREE.Vector3(), name, 0, Math.PI * 2, 0.01 ).
						onChange( function ( value ) {

							const mesh = getMesh();
							if ( !mesh.userData.boFrustumPoints ) {

								mesh.rotation[name] = value;
								mesh.needsUpdate = true;

							}

							if ( !boSetMesh )
								exposePosition();
							if ( options.frustumPoints !== undefined )
								options.frustumPoints.updateCloudPoint( mesh );

						} );
					dat.controllerNameAndTitle( cRotations[name], scale.name );

				}
				switch ( n ) {

					case 2:
						addRotationControllers( !boX ? 'x' : !boY ? 'y' : 'z' );
						break;
					case 3:
						addRotationControllers( 'x' );
						addRotationControllers( 'y' );
						addRotationControllers( 'z' );
						break;
					default: console.error( 'GuiSelectPoint.updateScale: Invalid space dimension = ' + n );
						return;

				}

				//Default rotation button
				buttonRotationDefault = fRotation.add( {

					defaultF: function ( value ) {

						mesh.rotation.copy( mesh.userData.default.rotation );
						mesh.needsUpdate = true;

						setRotationControllers();
						exposePosition();

					},

				}, 'defaultF' );
				dat.controllerNameAndTitle( buttonRotationDefault, lang.defaultButton, lang.defaultRotationTitle );

			}
			addRotationFolder();

			//Points

			fPoints = fMesh.addFolder( lang.points );

			let oldMesh;//Нужен когда пользователь сменил выбранный графический объект и когда надо сбрость настройки вершины предыдущего горафического объекта
			cPoints = fPoints.add( { Points: lang.notSelected }, 'Points', { [lang.notSelected]: -1 } );
/*			
			cPoints.domElement.onmousedown = () => {

//				event.returnValue = false;
				console.log('opt.domElement.onmousedown. event.offsetX = ' + event.offsetX);
			}
*/			
			cPoints.onChange( function ( pointId ) {

/*				
				const value = cPoints.__select[cPoints.__select.selectedIndex].getAttribute('value');
				if ( value === null ) {

					console.error('GuiSelectPoint: cPoints.onChange. Under constraction');//выбрать все точки для текущего времени проигрывателя
					return;
					
				}
*/				
				pointId = parseInt( pointId );
				if (isNaN(pointId)){

					const onchange = this.__select[this.__select.selectedIndex].onchange;
					if(onchange) onchange();
					else console.error('GuiSelectPoint: cPoints.onChange. Under constraction');//во вселенной выбрать все точки для текущего времени проигрывателя
					return;
					
				}
				var display, position;
				let mesh = getMesh();
				if ( mesh && mesh.userData.gui && mesh.userData.gui.reset ) oldMesh = mesh;
				if ( pointId === -1 ) display = 'none';
				else {

					display = 'block';
					_this.select( { object: mesh, index: pointId } );

				}
				if ( ( options.axesHelper !== false ) && ( options.axesHelper !== undefined ) )
					options.axesHelper.exposePosition( getObjectPosition(
//						mesh, ((pointId != -1) && mesh.userData.myObject && mesh.userData.myObject.guiPoints ? mesh.userData.myObject.guiPoints.positionOffset : 0) + pointId
						mesh, ((pointId != -1) ? mesh.userData.myObject.guiPoints.positionOffset : 0) + pointId
					) );
				displayPointControllers( display );
				if ( !mesh || !mesh.userData.gui || !mesh.userData.gui.reset) mesh = oldMesh;
				if ( mesh && mesh.userData.gui && mesh.userData.gui.reset ) mesh.userData.gui.reset( pointId );

			} );
			cPoints.__select[0].selected = true;
			dat.controllerNameAndTitle( cPoints, lang.select );

			if ( cFrustumPoints !== undefined )
				cFrustumPoints.create( fPoints, getLanguageCode() );
			if ( guiParams.myThreejs )
				guiParams.myThreejs.cFrustumPoints = cFrustumPoints

			//display vertice ID
			
			options.dat.guiSelectPoint = options.dat.guiSelectPoint || {};
			options.dat.guiSelectPoint.boDisplayVerticeID = options.dat.guiSelectPoint.boDisplayVerticeID || false;
			const cDisplayVerticeID = f3DObjects.add( options.dat.guiSelectPoint, 'boDisplayVerticeID' ).onChange( function ( value ) {
				
				for ( var i = 1; i < cMeshs.__select.options.length; i++ ) {

					var option = cMeshs.__select.options[i];
					if ( option.mesh === undefined ) {

						console.error( 'guiSelectPoint: cDisplayVerticeID.onChange. Invalud option.mesh' );
						continue;

					}
					displayVerticeID( option.mesh );//getMesh() );

				}
				
			} );
			dat.controllerNameAndTitle( cDisplayVerticeID, lang.displayVerticeID, lang.displayVerticeIDTitle );
			
			//Custom point controllers 

			if ( options.dat && options.dat.guiSelectPoint && options.dat.guiSelectPoint.point ) cCustom = options.dat.guiSelectPoint.point( options, dat, fMesh );

			//Camera target
			// Может устанвливаться только если создан проигрыватель options.player,
			//потому что при установке птички 'Look' - Следить, вызывается options.player.selectScene()
			if ( options.player ) {

				var orbitControlsOptions;
				if ( guiParams.cameraTarget ) options.playerOptions.cameraTarget.init( guiParams.cameraTarget, options );
				const playerCameraTarget = options.playerOptions.cameraTarget.get( options );
				if ( playerCameraTarget ) {

					cCameraTarget = fPoints.add( playerCameraTarget, 'boLook' ).onChange( function ( boLook ) {

						const mesh = getMesh();
						if ( mesh.userData.boFrustumPoints ) {

							if ( boLook ) {

								console.warn( 'guiSelectPoint.cCameraTarget.onChange(...). The camera can not look at the frustum point.' );
								cCameraTarget.setValue( false );

							}
							return;

						}
						if ( !mesh.userData.player ) {

							mesh.userData.player = { arrayFuncs: [] }
							for ( var i = 0; i < mesh.geometry.attributes.position.count; i++ ) {

								mesh.userData.player.arrayFuncs.push( new THREE.Vector3().fromArray( mesh.geometry.attributes.position.array,
									i * mesh.geometry.attributes.position.itemSize ) );

							}

						}
						const index = mesh.userData.boFrustumPoints ? cFrustumPoints.getSelectedIndex() : cPoints.__select.options.selectedIndex - 1,
							point = typeof mesh.userData.player.arrayFuncs === "function" ?
								new THREE.Vector3().fromArray( mesh.userData.player.arrayFuncs().attributes.position.array, index * 3 ) :
								mesh.userData.player.arrayFuncs !== undefined ? mesh.userData.player.arrayFuncs[index] :
									new THREE.Vector3().fromArray( mesh.geometry.attributes.position.array, index * 3 );

						//remove boLook from all points
						for ( var i = 0; i < cMeshs.__select.options.length; i++ ) {

							const mesh = cMeshs.__select.options[i].mesh;
							if ( !mesh || !mesh.userData.player || !mesh.userData.player.arrayFuncs )
								continue;
							const arrayFuncs = mesh.userData.player.arrayFuncs;
							for ( var j = 0; j < arrayFuncs.length; j++ )
								if ( arrayFuncs[j].cameraTarget ) arrayFuncs[j].cameraTarget.boLook = false;

						}
						if ( point.cameraTarget ) point.cameraTarget.boLook = boLook;
						if ( options.player ) options.player.selectScene();
						if ( options.cameraGui ) options.cameraGui.look( boLook );
						if ( boLook ) {

							if ( !point.cameraTarget ) {

								if ( playerCameraTarget.boLook === undefined ) Player.cameraTarget2.boLook = false;

								if ( !orbitControlsOptions ) orbitControlsOptions = {}
								if ( !orbitControlsOptions.target )
									orbitControlsOptions.target = new THREE.Vector3();
								if ( options.orbitControls )
									orbitControlsOptions.target.copy( options.orbitControls.target );

								options.playerOptions.cameraTarget.changeTarget( mesh, index );

							}
							return;

						}

						//Если точка имеет индивидуальную cameraTarget, то камера будет следить по этим настройкам
						if ( guiParams.cameraTarget ) guiParams.cameraTarget.camera.userData.cameraTargetPoint = point.cameraTarget;

						//					if ( Player.orbitControls ) Player.orbitControls.reset();
						if ( options.orbitControls ) options.orbitControls.reset();

						if ( orbitControlsOptions ) {

							if ( getCameraTarget() )
								return;

							if ( Player.orbitControls )
								Player.orbitControls.target.copy( orbitControlsOptions.target );
							guiParams.cameraTarget.camera.lookAt( orbitControlsOptions.target );
							point.cameraTarget = undefined;

						}

					} );
					dat.controllerNameAndTitle( cCameraTarget, lang.cameraTarget, lang.cameraTargetTitle );

				}

			}

			//Points attribute position
			fPoint = fPoints.addFolder( lang.point );
			dat.folderNameAndTitle( fPoint, lang.point, lang.pointTitle );

			//Points world position
			fPointWorld = fPoints.addFolder( lang.pointWorld );
			dat.folderNameAndTitle( fPointWorld, lang.pointWorld, lang.pointWorldTitle );
			//fPointWorld.open();

			displayPointControllers( 'none' );

			if ( guiParams.pointsControls ) {

				guiParams.pointsControls( fPoints, dislayEl, getMesh );

			}
			cTraceAll = fPoints.add( { trace: false }, 'trace' ).onChange( function ( value ) {

				var mesh = getMesh();
				mesh.userData.traceAll = value;
				for ( var i = 0; i < mesh.geometry.attributes.position.count; i++ )
					visibleTraceLine( { object: mesh, index: i }, value, getMesh );
				cTrace.setValue( value );

			} );
			dat.controllerNameAndTitle( cTraceAll, lang.trace, lang.traceAllTitle );
			//		dislayEl( cTraceAll, Player.isCreated() );
			dislayEl( cTraceAll, options.player );

			//Restore default settings of all 3d objects button.
			dat.controllerNameAndTitle( f3DObjects.add( {

				defaultF: function ( value ) {

					for ( var i = 0; i < cMeshs.__select.options.length; i++ ) {

						const mesh = cMeshs.__select.options[i].mesh;
						if ( !mesh )
							continue;
						mesh.scale.copy( mesh.userData.default.scale );
						mesh.position.copy( mesh.userData.default.position );
						mesh.rotation.copy( mesh.userData.default.rotation );
						mesh.needsUpdate = true;

					}
					setScaleControllers();
					setPositionControllers();
					setRotationControllers();
					exposePosition();
					if ( options.frustumPoints )
						options.frustumPoints.onChangeControls();

				},

			}, 'defaultF' ), lang.defaultButton, lang.default3DObjectTitle );
			addPointControllers();

			while ( arrayMeshs.length > 0 ) {

				this.addMesh( arrayMeshs[arrayMeshs.length - 1] );
				arrayMeshs.pop();

			}

		}
		/**Removes all points from points list control. */
		this.removePoints = function () {

			//thanks to https://stackoverflow.com/a/48780352/5175935
			cPoints.domElement.querySelectorAll( 'select option' ).forEach( option => option.remove() );
			const opt = document.createElement( 'option' );
			opt.innerHTML = lang.notSelected;
			opt.setAttribute( 'value', -1 );//Эта строка нужна в случае когда пользователь отменил выбор точки. Иначе при движении камеры будут появляться пунктирные линии, указвающие на несуществующую точку
			cPoints.__select.appendChild( opt );

		}
		/**Updates points in the points list control. */
		this.updatePoints = function () {

			const boDisplayVerticeID = options.dat.guiSelectPoint.boDisplayVerticeID,
				mesh = getMesh();

			//убрать с холста идентификаторы точек
			if ( boDisplayVerticeID ) {

				options.dat.guiSelectPoint.boDisplayVerticeID = false;
				displayVerticeID( mesh );

			}

			cPoints.__onChange( -1 );
			this.removePoints();
			mesh.userData.player.arrayFuncs.length = 0;
			delete mesh.userData.player.arrayFuncs;
			createPlayerArrayFuncs( mesh );
			addPoints( mesh );

			//восстановить идентификаторы точек
			if ( boDisplayVerticeID ) {

				options.dat.guiSelectPoint.boDisplayVerticeID = true;
				displayVerticeID( mesh );

			}

			if ( mesh.userData.nd ) mesh.userData.nd.update();

		}
		function addPointControllers() {

			//Point's attribute position axes controllers

			function axesGui( axisName ) {

				var scale, controller;
				if ( axisName === 'w' ) {

					//W axis

					options.scales.setW();
					scale = options.scales.w;
					function onChange( value ) {

						const attributes = intersection.object.geometry.attributes,
							i = intersection.index;
						if ( attributes.position.itemSize < 4 ) {

							console.error( 'guiSelectPoint.addPointControllers().axesGui().controller.onChange(): attributes.position.itemSize = ' + attributes.position.itemSize )
							return;//Точка не имеет цвета. Например это вершина куба. Надо скрыть оган управления координатой w

						}
						if ( options.palette ) Player.setColorAttribute( attributes, i, options.palette.toColor( value, controller.__min, controller.__max ) );
//						if ( !intersection.object.userData.myObject || ( intersection.object.userData.myObject.isColorFromPositionW != false ) )
						if ( options.scales.w.isColor != false )
							attributes.position.setW( i, value );

						if ( options.frustumPoints )
							options.frustumPoints.updateCloudPointItem( intersection.object, intersection.index );

					}
					if ( ( scale.min !== undefined ) && ( scale.max !== undefined ) ) {

						controller = fPoint.add( { value: scale.min, }, 'value',
							scale.min,
							scale.max,
							( scale.max - scale.min ) / 100
						).onChange( function ( value ) {

							if ( isReadOnlyController( controller ) ) return;
							onChange( value );

						} );
						if ( ( options.scales.w.isColor != false ) && ( options.palette instanceof ColorPicker.palette ) ) {

							controller.domElement.querySelector( '.slider-fg' ).style.height = '40%';
							const elSlider = controller.domElement.querySelector( '.slider' );
							ColorPicker.create( elSlider, {

								palette: options.palette,
								style: {

									//border: '2px solid #303030',
									width: '65%',//Непонятно почему без этой строи не видно палиры в http://localhost/anhr/egocentricUniverse/master/Examples/3D.html
									//height: elSlider.offsetHeight / 2,//'50%',

								},
								//onError: function ( message ) { alert( 'Colorpicker error: ' + message ); }

							} );

						}

					} else
						controller = fPoint.add( { value: 0, }, 'value' ).onChange( function ( value ) { onChange( value ); } );

				} else {

					scale = ( options.axesHelper === undefined ) || ( options.axesHelper === false ) ? options.scales[axisName] : //если я буду использовать эту строку то экстремумы шкал буду устанавливатся по умолчанию а не текущие
						options.axesHelper.options ? options.axesHelper.options.scales[axisName] : undefined;
					if ( scale.isAxis() )
						controller = fPoint.add( { value: scale.min, }, 'value',
							scale.min,
							scale.max,
							( scale.max - scale.min ) / 100 ).
							onChange( function ( value ) {

								const points = intersection.object;

								if ( isReadOnlyController( controller ) ) return;
								
								const axesId = axisName === 'x' ? 0 : axisName === 'y' ? 1 : axisName === 'z' ? 2 : axisName === 'w' ? 3 : console.error('axisName:' + axisName);
/*									
									myObject = points.userData.myObject,
									positionData = myObject.getPositionData ? myObject.getPositionData(intersection.index) : { positionId: intersection.index };
								points.geometry.attributes.position.array[axesId + positionData.positionId] = value;
*/
								points.geometry.attributes.position.array[axesId + points.userData.myObject.getPositionData(intersection.index).positionId] = value;
								points.geometry.attributes.position.needsUpdate = true;

								exposePosition( intersection.index );

								if ( options.frustumPoints )
									options.frustumPoints.updateCloudPointItem( points, intersection.index );

							} );

				}
				if ( controller )
					dat.controllerNameAndTitle( controller, scale.name );
				return controller;

			}
			cX = axesGui( 'x' );
			cY = axesGui( 'y' );
			cZ = axesGui( 'z' );
			cW = axesGui( 'w' );
			cColor = fPoint.addColor( { color: '#FFFFFF', }, 'color' ).
				onChange( function ( value ) {

					//for testing
					//Go to http://localhost/anhr/commonNodeJS/master/player/Examples/
					//Select 3 Ponts' 3D object
					//Select a point 2
					//Open 'Point's local position'
					//Change 'color'
					
					if ( isReadOnlyController( cColor ) ) return;
					if ( cColor.userData === undefined ) return;
					var intersection = cColor.userData.intersection;
					Player.setColorAttribute( intersection.object.geometry.attributes, intersection.index, value );

				} );
			dat.controllerNameAndTitle( cColor, options.scales.w ? options.scales.w.name : lang.color );
			cOpacity = fPoint.add( { opasity: 1, }, 'opasity', 0, 1, 0.01 ).
				onChange( function ( opasity ) {

					if ( isReadOnlyController( cOpacity ) )
						return;
					const mesh = getMesh();
					if (mesh.userData.myObject) {
						
						mesh.userData.myObject.verticeOpacity(intersection.index, true, opasity);
						return;

					}
					if (!mesh.material.transparent) {

						console.error( 'GuiSelectPoint: cOpacity.onChange. Invalid mesh.material.transparent = ' + mesh.material.transparent);
						return;
						
					}
					if (!mesh.material.vertexColors) {

						console.error( 'GuiSelectPoint: cOpacity.onChange. Invalid mesh.material.vertexColors = ' + mesh.material.vertexColors);
						return;
						
					}
					const color = mesh.geometry.attributes.color;
					if (color.itemSize < 4) return;
					color.array[3 + intersection.index * color.itemSize] = opasity;
					color.needsUpdate = true;

				} );
			dat.controllerNameAndTitle( cOpacity, lang.opacity, lang.opacityTitle );

			cTrace = fPoint.add( { trace: false }, 'trace' ).onChange( function ( value ) {

				visibleTraceLine( intersection, value, getMesh );

			} );
			dat.controllerNameAndTitle( cTrace, lang.trace, lang.traceTitle ); //guiParams
			dislayEl( cTrace, options.player );

			if ( guiParams.pointControls ) {

				guiParams.pointControls( fPoint, dislayEl, getMesh, intersection );

			}

			//Point's world position axes controllers

			function axesWorldGui( axisName ) {

				const scale = ( options.axesHelper === undefined ) || ( options.axesHelper === false ) ? options.scales[axisName] :
					options.axesHelper.options ? options.axesHelper.options.scales[axisName] : undefined;
				if ( !scale.isAxis() )
					return;
				const controller = dat.controllerZeroStep( fPointWorld, { value: scale.min, }, 'value' );
				readOnlyEl( controller, true );
				dat.controllerNameAndTitle( controller, scale.name );
				return controller;

			}
			cWorld.x = axesWorldGui( 'x' );
			cWorld.y = axesWorldGui( 'y' );
			cWorld.z = axesWorldGui( 'z' );

			//Restore default local position.
			cRestoreDefaultLocalPosition = fPoint.add( {

				defaultF: function () {

					const positionDefault = intersection.object.userData.player.arrayFuncs[intersection.index],
						t = options.time,
						setDefaultValue = ( control, value ) => {
							
							if ( !control ) return;
							control.setValue(
								typeof value === "function" ?
									value( t, options.a, options.b ) :
									typeof value === "string" ?
										Player.execFunc( { w: value } , 'w', options.time, options ) :
										value
							);
							
						};
					setDefaultValue( cX, positionDefault.x );
					setDefaultValue( cY, positionDefault.y );
					setDefaultValue( cZ, positionDefault.z === undefined ? 0 ://default Z axis of 2D point is 0
							positionDefault.z );

					if ( isDislayEl( cOpacity ) ) cOpacity.setValue( cOpacity.initialValue );
					if ( isDislayEl( cColor ) && !isReadOnlyEl( cColor ) ) cColor.setValue( cColor.initialValue );
					
					if ( positionDefault.w !== undefined ) {

						if ( positionDefault.w.r !== undefined )
							cColor.setValue( '#' +
								new THREE.Color( positionDefault.w.r, positionDefault.w.g, positionDefault.w.b ).getHexString() );
						else if ( typeof positionDefault.w === "function" ) {

							setValue( cW, positionDefault.w( t ) );
							return;

						} else if ( positionDefault.w.func ) {

							setValue( cW, positionDefault.w.func( t ) );
							return;

						}
						const float = parseFloat( positionDefault.w );
						if ( float === positionDefault.w ) {

							if ( isDislayEl( cW ) ) setValue( cW, positionDefault.w );
							
						} else if ( typeof positionDefault.w  === "string") {
							
							setValue( cW, Player.execFunc( positionDefault , 'w', options.time, options ) );
							return;
							
						} else console.error( 'Restore default local position: Invalid W axis.' );

					} else cColor.setValue( cColor.initialValue );

				},

			}, 'defaultF' );
			dat.controllerNameAndTitle( cRestoreDefaultLocalPosition, lang.defaultButton, lang.defaultLocalPositionTitle );

			funcFolder = new functionsFolder( fPoint, function ( func, axisName, value ) {

				const mesh = getMesh(),
					index = cPoints.__select.options.selectedIndex - 1,
					funcs = mesh.userData.player.arrayFuncs[index];
				funcs[axisName] = func;

				var parent = mesh.parent, t = 0;
				while ( parent ) {

					if ( parent.userData.t ) {

						t = parent.userData.t;
						break;

					}
					parent = parent.parent;

				}
				var controller;
				switch ( axisName ) {

					case 'x':
						controller = cX;
						break;
					case 'y':
						controller = cY;
						break;
					case 'z':
						controller = cZ;
						break;
					case 'w':
						if ( func instanceof THREE.Color ) {

							cColor.setValue( '#' + func.getHexString() );
							return;

						}
						controller = cW;
						break;
					default: console.error( 'GuiSelectPoint new functionsFolder onFinishChange: axisName = ' + axisName );
						return;

				}
				setValue( controller, Player.execFunc( funcs, axisName, t, options ) );

				if ( funcs.controllers ) {

					//обновить органы управления на веб странице
					const controllerObject = funcs.controllers[axisName];
					if ( controllerObject && controllerObject.func && controllerObject.func.controller )
						controllerObject.func.controller.value = value;
					
				}

			}, options, { x: '', y: '', z: '', w: '' } );/* {

				getLanguageCode: getLanguageCode,
				THREE: THREE,

			} );*/

		}
		/**
		 * get frustum points.
		 */
		this.getFrustumPoints = function () { return cFrustumPoints; }
		return this;

	}

}

export default GuiSelectPoint;
