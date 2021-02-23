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

//import * as THREE from 'https://threejs.org/build/three.module.js';
//import * as THREE from '../../three.js/dev/build/three.module.js';//https://github.com/anhr/three.js;
//import * as THREE from 'https://raw.githack.com/anhr/three.js/dev/build/three.module.js';
//import { THREE } from './three.js';
var THREE;

import { dat } from '../dat/dat.module.js';
//import { dat } from 'https://raw.githack.com/anhr/commonNodeJS/master/dat/dat.module.js';

import ScaleController from '../ScaleController.js';
//import ScaleController from 'https://raw.githack.com/anhr/commonNodeJS/master/ScaleController.js';

import PositionController from '../PositionController.js';
//import PositionController from 'https://raw.githack.com/anhr/commonNodeJS/master/PositionController.js';

import ColorPicker from '../colorpicker/colorpicker.js';//https://github.com/anhr/commonNodeJS/tree/master/colorpicker
//import ColorPicker from 'https://raw.githack.com/anhr/commonNodeJS/master/colorpicker/colorpicker.js';

//import Player from '../player/build/player.module.js';
//import Player from '../player/build/player.module.min.js';
import Player from '../player/player.js';
//import Player from 'https://raw.githack.com/anhr/commonNodeJS/master/player/player.js';
//import Player from 'https://raw.githack.com/anhr/commonNodeJS/master/player/build/player.module.min.js';

import functionsFolder from '../functionsFolder.js';


/**
 * A dat.gui based graphical user interface for select a point from the mesh.
 * @param {THREE} _THREE {@link https://github.com/anhr/three.js|THREE}
 * @param {object} [guiParams] Followed parameters is allowed. Default is no parameters
 * @param {AxesHelper} [guiParams.axesHelper] An axis object to visualize axes. Default is undefined.
 * See {@link https://github.com/anhr/AxesHelper|AxesHelper}.
 * @param {string} [guiParams.options] See {@link https://raw.githack.com/anhr/AxesHelper/master/jsdoc/index.html|axesHelper.options} for details. Default is axesHelper.options if axesHelper is defined or { scales: {...} }
 * @param {string} [guiParams.cFrustumPoints]
 * @param {string} [guiParams.myThreejs] See {@link https://github.com/anhr/myThreejs|myThreejs}.
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
 * @param {Function} [guiParams.getLanguageCode] Your custom getLanguageCode() function.
 * <pre>
 * returns the "primary language" subtag of the language version of the browser.
 * Examples: "en" - English language, "ru" Russian.
 * See the "Syntax" paragraph of RFC 4646 {@link https://tools.ietf.org/html/rfc4646#section-2.1|rfc4646 2.1 Syntax} for details.
 * Default returns the 'en' is English language.
 * You can import { getLanguageCode } from '../../commonNodeJS/master/lang.js';
 * </pre>
 * @param {object} [guiParams.lang] Object with localized language values
 * @example
import { GuiSelectPoint } from 'https://raw.githack.com/anhr/commonNodeJS/master/guiSelectPoint/guiSelectPoint.js';

const guiSelectPoint = new GuiSelectPoint( { axesHelper: axesHelper, } );
guiSelectPoint.add( gui, { getLanguageCode: getLanguageCode, } );
guiSelectPoint.addMesh( points );
 * @example //Using of guiParams.lang:
guiParams = {

	getLanguageCode: function() { return 'az'; },//Azerbaijani language
	lang: { textHeight: 'mətn boyu', languageCode: 'az' },

}
 */
function GuiSelectPoint( _THREE, guiParams ) {

	GuiSelectPoint.setTHREE( _THREE );

	guiParams = guiParams || {};

	const axesHelper = guiParams.axesHelper,
		options = guiParams.options || ( axesHelper ? axesHelper.options : undefined ) || {
		},
		guiSelectPoint = this;

	//Player changes the guiSelectPoint control's values during playing
	options.guiSelectPoint = guiSelectPoint;
				
	options.scales = options.scales || {};
	function setScale( axisName ) {

		options.scales[axisName] = options.scales[axisName] || {};
		options.scales[axisName].name = options.scales[axisName].name || axisName;
		options.scales[axisName].min = options.scales[axisName].min === undefined ? -1 : options.scales[axisName].min;
		options.scales[axisName].max = options.scales[axisName].max === undefined ?  1 : options.scales[axisName].max;

	}
	setScale( 'x' );
	setScale( 'y' );
	setScale( 'z' );
	if ( options.a === undefined ) options.a = 1;
	if ( options.b === undefined ) options.b = 0;
	var cFrustumPoints;

	//Localization

	const getLanguageCode = guiParams.getLanguageCode || function () { return 'en'; };

	const lang = {

		meshs: 'Meshes',
		notSelected: 'Not selected',
		select: 'Select',
		position: 'Position',
		rotation: 'Rotation',
		points: 'Points',

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
			if ( ( guiParams.lang === undefined ) || ( guiParams.lang.languageCode != _languageCode ) )
				break;

			Object.keys( guiParams.lang ).forEach( function ( key ) {

				if ( lang[key] === undefined )
					return;
				lang[key] = guiParams.lang[key];

			} );

	}

	var f3DObjects, fPoint, cRestoreDefaultLocalPosition, fPointWorld, fPoints, cMeshs, fMesh,// mesh,
		intersection, _this = this,
		cScaleX, cScaleY, cScaleZ, cPosition = new THREE.Vector3(), cRotations = new THREE.Vector3(),
		cPoints, selectedPointIndex = -1,
		cX, cY, cZ, cW, cTrace, cTraceAll, cColor, cOpacity, cCameraTarget,
		funcFolder,//cFunctions = new THREE.Vector3(),
		cWorld = new THREE.Vector3(),
		boSetMesh = false;//Для предотвращения лишних вызовов exposePosition если выбрать точку и передвинуть камеру с помошью OrbitControls,
	function displayPointControllers( display ) {

		fPointWorld.domElement.style.display = display;
		fPoint.domElement.style.display = display;
		if ( cCameraTarget )
			cCameraTarget.domElement.parentElement.parentElement.style.display = display;
//		funcFolder.displayFolder( display );

	}
	if ( options.arrayCloud )//Array of points with cloud
		cFrustumPoints = new options.arrayCloud.cFrustumPointsF( _this );
	//сейчас exposePosition вызывается только один раз из this.setMesh
	function dislayEl( controller, displayController ) {

		if ( controller === undefined )
			return;
		if ( typeof displayController === "boolean" )
			displayController = displayController ? 'block' : 'none';
		var el = controller.domElement;
		while ( el.tagName.toUpperCase() !== "LI" ) el = el.parentElement;
		el.style.display = displayController;

	}
	function exposePosition( selectedPointIndex ) {

		if ( selectedPointIndex === undefined )
			selectedPointIndex = guiSelectPoint.getSelectedPointIndex();//Эта строка слишком медленно выполняется если число точек frustumPoints велико
		//Поэтому selectedPointIndex беру из intersection.index индекс точки, над которй щелнул мышью
		if ( selectedPointIndex === -1 )
			return;

		const mesh = cMeshs.__select.options[cMeshs.__select.options.selectedIndex].mesh,
			position = getObjectPosition( mesh, selectedPointIndex );

		if ( ( axesHelper !== undefined ) )

			// && ( ( mesh.userData.isInfo === undefined ) || ( mesh.userData.isInfo() ) ) )
			//если делать эту проверку, то будут неправильно отображаться пунктирные линии для frustumPoints точки
			//когда в настройках frustumPoints не стоит галочка info
			//когда в gui пользователь выбрал точку frustumPoints из списка '3D objects'(этот пункт будет недоступен когда я уберу frustumPoints из списка '3D objects' когда в настройках frustumPoints не стоит галочка info)
			//и когда пользователь передвигает камеру с помощью orbitControls

			axesHelper.exposePosition( { object: mesh, index: selectedPointIndex } );

		if ( cWorld.x ) cWorld.x.setValue( position.x );
		if ( cWorld.y ) cWorld.y.setValue( position.y );
		if ( cWorld.z ) cWorld.z.setValue( position.z );

	}
	function setValue( controller, v ) {

		if ( !controller )
			return;
		const input = controller.domElement.querySelector( 'input' ),
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
	function setPosition( intersectionSelected/*, boDefault*/ ) {

		const player = intersectionSelected.object.userData.player;

		if ( player ) {

			funcFolder.setFunction( player.arrayFuncs[intersectionSelected.index]/*, boDefault*/ );

		}
/*Для установки cCameraTarget после выбора точки. Если это оставить то неправильно учтанавливается галочка cCameraTarget если:
1 устанвить cCameraTarget для выбранной точки
2 запустить плеер
3 уброать cCameraTarget
4 запустить плеер. Снова установиться cCameraTarget
*/
		if ( cCameraTarget ) {

/*
			const value = player && player.arrayFuncs[intersectionSelected.index].cameraTarget ? true : false;
			if ( cCameraTarget.getValue() !== value )//Если не делать эту проверку то будет бесконечный вызов cCameraTarget.onChange при выборе точки в guiSelectPoint
				cCameraTarget.setValue( value );
*/
//			Player.cameraTarget.get();//Обновить cameraTarget
			Player.cameraTarget.changeTarget( intersectionSelected.object, intersectionSelected.index );
			cCameraTarget.updateDisplay();
/*
			const boLook = player && player.arrayFuncs[intersectionSelected.index].cameraTarget ? 
				player.arrayFuncs[intersectionSelected.index].cameraTarget.boLook : false;
			if ( cCameraTarget.getValue() !== boLook )//Если не делать эту проверку то будет бесконечный вызов cCameraTarget.onChange при выборе точки в guiSelectPoint
				cCameraTarget.setValue( boLook );
*/				

		}

		const positionLocal = getObjectLocalPosition( intersectionSelected.object, intersectionSelected.index );
		setValue( cX, positionLocal.x );
		setValue( cY, positionLocal.y );
		setValue( cZ, positionLocal.z );

		const position = getObjectPosition( intersectionSelected.object, intersectionSelected.index );
		setValue( cWorld.x, position.x );
		setValue( cWorld.y, position.y );
		setValue( cWorld.z, position.z );

		var displayControllerW, displayControllerColor, displayControllerOpacity;
		const none = 'none', block = 'block';
		if ( typeof intersection.object.userData.player.arrayFuncs === "function" )
			console.error( 'arrayFuncs === "function" under constraction' );
		var opasity;
		const func = player && player.arrayFuncs ? player.arrayFuncs[intersectionSelected.index] : undefined;
		function isWObject() { return ( typeof func.w === 'object' ) && ( func.w instanceof THREE.Color === false ); }
		var color = func === undefined ?
				undefined :
				Array.isArray( func.w ) || ( typeof func.w === "function" ) ?
					Player.execFunc( func, 'w', Player.getTime(), options.a, options.b ) :
					isWObject() ? 
						Player.execFunc( func.w, 'func', Player.getTime(), options.a, options.b ) :
						func.w;

		if ( color === undefined ) {

			if ( intersectionSelected.object.geometry.attributes.ca === undefined ) {

//				console.warn( 'Under constraction. цвет frustumPoints не известен потому что он вычисляется в шейдере D:\My documents\MyProjects\webgl\three.js\GitHub\myThreejs\master\frustumPoints\vertex.c' )
				
			} else {

				const vColor = new THREE.Vector4().fromArray(
					intersectionSelected.object.geometry.attributes.ca.array,
					intersectionSelected.index * intersectionSelected.object.geometry.attributes.ca.itemSize );
				color = new THREE.Color( vColor.x, vColor.y, vColor.z );
				opasity = vColor.w;

			}

		}

		if ( color instanceof THREE.Color ) {

			displayControllerW = none;
			displayControllerColor = block;
			displayControllerOpacity = block;

			//color
			if ( intersectionSelected.object.userData.player.arrayFuncs === undefined ) {

				displayControllerColor = none;
				displayControllerOpacity = none;

			} else {

				const strColor = '#' + color.getHexString();
				//Сначала надо установить initialValue потому что для FrustumPoints я устанвил readOnly для cColor.
				//В этом случае я не могу отобразить цвет следующей точки FrustumPoints потому что в режиме readOnly
				//при изменении цвета восстанвливается старый цвет из initialValue.
				cColor.initialValue = strColor;
				cColor.setValue( strColor );
				cColor.userData = { intersection: intersectionSelected, };
				if ( opasity !== undefined ) {

					setValue( cOpacity, opasity );

				} else displayControllerOpacity = none;
				cOpacity.userData = { intersection: intersectionSelected, };

			}

		} else {

			if ( cW === undefined )
				displayControllerW = none;
			else {

				if ( color === undefined )
					displayControllerW = none;
				else {

					if ( !wLimitsDefault ) {

						wLimitsDefault = {

							min: cW.__min,
							max: cW.__max,

						}

					}
					if ( isWObject() ) {

						cW.min( func.w.min !== 'undefined' ? func.w.min : wLimitsDefault.min );
						cW.max( func.w.max !== 'undefined' ? func.w.max : wLimitsDefault.max );
						if ( ( cW.__min !== 'undefined' ) && ( cW.__max !== 'undefined' ) )
							cW.step( ( cW.__max - cW.__min ) / 100 )

					} else {

						cW.min( wLimitsDefault.min );
						cW.max( wLimitsDefault.max );

					}
					setValue( cW, color );
					displayControllerW = block;

				}

			}
			displayControllerColor = none;
			displayControllerOpacity = none;

		}
		dislayEl( cW, displayControllerW );
		dislayEl( cColor, displayControllerColor );
		dislayEl( cOpacity, displayControllerOpacity );

		var boReadOnly = intersectionSelected.object.userData.boFrustumPoints === true ? true : false;
		if ( cX ) cX.domElement.querySelector( 'input' ).readOnly = boReadOnly;
		if ( cY ) cY.domElement.querySelector( 'input' ).readOnly = boReadOnly;
		if ( cZ ) cZ.domElement.querySelector( 'input' ).readOnly = boReadOnly;
		if ( cW ) cW.domElement.querySelector( 'input' ).readOnly = boReadOnly;
		cColor.domElement.querySelector( 'input' ).readOnly = boReadOnly;
		cOpacity.domElement.querySelector( 'input' ).readOnly = boReadOnly;

	}
	/**
	 * Sets controllers to position, scale and rotation of the mesh.  If AxesHelper is exist, expose the mesh to the axes.
	 * @function GuiSelectPoint.
	 *setMesh
	 */
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
	 * @function GuiSelectPoint.
	 *setPosition
	 * @param position deprecated
	 * @param intersectionSelected [THREE.Raycaster.intersectObject]{@link https://threejs.org/docs/index.html#api/en/core/Raycaster.intersectObject}
	 */
	this.setPosition = function ( position, intersectionSelected ) {

		for ( var i = 0; i < cMeshs.__select.length; i++ ) {

			var option = cMeshs.__select[i];
			//						if ( option.selected && ( parseInt( option.getAttribute( 'value' ) ) === intersectionSelected.object.userData.index - 1 ) )
			if ( option.selected && Object.is( option.mesh, intersectionSelected.object ) ) {

				setPosition( intersectionSelected );

			}

		}

	}
	/**
	 * update the values of the controllers of the world position
	 * @function GuiSelectPoint.
	 *update 
	 */
	this.update = function () {

		const mesh = cMeshs.__select.options[cMeshs.__select.options.selectedIndex].mesh;
		if ( !mesh )
			return;
		const index = this.getSelectedPointIndex();
		if ( index === -1 )
			return;
		const position = getObjectPosition( mesh, index );
		cWorld.x.setValue( position.x );
		cWorld.y.setValue( position.y );
		cWorld.z.setValue( position.z );

	}
	/**
	 * get index of the mesh in the cMeshs controller
	 * @function GuiSelectPoint.
	 *getMeshIndex
	 * @param {THREE.Mesh} mesh
	 * See {@link https://threejs.org/docs/index.html#api/en/objects/Mesh|THREE.Mesh}.
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
//		console.error( 'Invalid mesh "' + mesh.name + '" index' );
		//Сюда попадает когда Mesh проверяется с помощью THREE.Raycaster находится ли он под мышью, но этот Mesh не внесен в список GuiSelectPoint

	}
	this.setIndexMesh = function ( index, mesh ) {

		if ( index === undefined )
			return;
		cMeshs.__select.options[index].mesh = mesh;
		this.selectPoint( -1 );

	}
	this.selectPoint = function ( index ) {

		cPoints.__onChange( index );
		cPoints.__select[index + 1].selected = true;

	}
	/**
	 * Removes a mesh from the select point GUI
	 * @function GuiSelectPoint.
	 *removeMesh
	 * @param {THREE.Mesh} mesh mesh for removing.
	 */
	this.removeMesh = function ( mesh ) {

		const index = this.getMeshIndex( mesh ),
			selectedIndex = cMeshs.__select.selectedIndex;
		cMeshs.__select.remove( index );
		if ( selectedIndex === index ) {

			cPoints.__onChange( -1 );
			_this.removePoints();

		}

	}

	const arrayMeshs = [];//сюда попадают все mesh в случае, когда this.addMesh вызывается до вызова this.add
							//тоесть когда GuiSelectPoint еще не добавлен в dat.gui

	/**
	 * Adds new mesh into select point GUI
	 * @function GuiSelectPoint.
	 *addMesh
	 * @param {THREE.Mesh} mesh new mesh.
	 */
	this.addMesh = function ( mesh ) {

		if ( !cMeshs ) {

			//Test for duplicate item
			for ( var i = 0; i < arrayMeshs.length; i++ ) {

				if ( arrayMeshs[i].uuid === mesh.uuid )
					return;

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
/*				
			if (
				( option.mesh !== undefined ) &&
				( mesh.name !== '' ) && //если не делать эту проверку то невозможно вставить два mesh без имени
				( option.mesh.name === mesh.name )
			) {

				//Нельза добалять два mesh с одинаковым именем
				return;//сюда попадает когда создаются точки без shaderMaterial
				//Сначала вызывается из myPoints create.Points function
				//Потом из guiSelectPointF.addControllers

			}
*/			

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

	}
	this.select = function ( intersectionSelected ) {

		const position = getObjectLocalPosition( intersectionSelected.object, intersectionSelected.index );
		if ( f3DObjects === undefined ) {

			console.error( 'Не знаю как сюда попасть' );

		}

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
			cMeshs.__onChange( index - 1 );

		}

		this.selectPoint2 = function ( selectedMesh/*, boDefault*/ ) {

			if ( ( intersectionSelected.index === undefined ) || isNaN( intersectionSelected.index ) )
				return;

			//сделал эту проверку потому что не могу придумать как удалить intersectionSelected.index когда пользователь врусную сменил mesh
			if ( ( selectedMesh !== undefined ) && !Object.is( intersectionSelected.object, selectedMesh ) )
				return;//Сначала пользователь выбрал точку с помошщью мыши
			//Потом сменил Meshes/Select

			if ( !intersectionSelected.object.userData.boFrustumPoints ) {

				//fPoints.open();много времени на открытие когда много точек
				cPoints.__select[intersectionSelected.index + 1].selected = true;

			} else {//FrustumPoints

				cFrustumPoints.pointIndexes( intersectionSelected.object.userData.pointIndexes( intersectionSelected.index ) );

			}
			const block = 'block';
			displayPointControllers( block );
			intersection = intersectionSelected;
			if ( guiParams.setIntersection )
				guiParams.setIntersection( intersectionSelected );
			setPosition( intersectionSelected/*, boDefault*/ );

			const mesh = getMesh();
			const line = ( mesh.userData.player.arrayFuncs === undefined ) || ( typeof intersection.object.userData.player.arrayFuncs === "function" ) ?
				undefined :
				mesh.userData.player.arrayFuncs[intersectionSelected.index].line;//You can not trace points if you do not defined the mesh.userData.player.arrayFuncs
			if ( cTrace )
				cTrace.setValue( line === undefined ? false : line.isVisible() )

			cRestoreDefaultLocalPosition.domElement.parentElement.parentElement.style.display =
				intersection.object.userData.player.arrayFuncs === undefined ? 'none' : block;

		}
		this.selectPoint2( undefined/*, true*/ );

	}
	/**
	 * Is mesh selected in the GuiSelectPoint.
	 * @function GuiSelectPoint.
	 *isSelectedMesh
	 * @param {THREE.Mesh} meshCur mesh to be tested
	 * @returns true if meshCur is selected.
	 */
	this.isSelectedMesh = function ( meshCur ) { return getMesh() === meshCur }
	/**
	 * Returns the index of the selected point.
	 * @function GuiSelectPoint.
	 *getSelectedPointIndex
	 * @returns index of the selected point.
	 */
	this.getSelectedPointIndex = function () {

		if ( ( cFrustumPoints !== undefined ) &&
			cFrustumPoints.isDisplay() &&//FrustumPoints folder id not visible
			options.arrayCloud.frustumPoints &&
			options.arrayCloud.frustumPoints.isDisplay()//The cDisplay checkbox of the frustumPoints' is checked
		) {

			var selectedIndex = cFrustumPoints.getSelectedIndex();
			return selectedIndex === null ? - 1 : selectedIndex;

		}
		if ( cPoints === undefined ) {

			if ( selectedPointIndex === undefined )
				console.error( 'myThreejs.create.onloadScripts.init.guiSelectPoint.getSelectedPointIndex:  selectedPointIndex = ' + selectedPointIndex );
			return selectedPointIndex;//options.dat !== true and gui === undefined. Do not use dat.gui

		}
		const index = cPoints.__select.selectedOptions[0].index;
		return index - 1;

	}
	function getMesh() {

		if ( !cMeshs ) {

			console.error( 'GuiSelectPoint().getSelectedPointIndex().getMesh(): call GuiSelectPoint.add( gui ); first.' );
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
		if ( cRotations.x ) cRotations.x.setValue( mesh.rotation.x );
		if ( cRotations.y ) cRotations.y.setValue( mesh.rotation.y );
		if ( cRotations.z ) cRotations.z.setValue( mesh.rotation.z );

	}
	function visibleTraceLine( intersection, value, getMesh ) {

		if ( !intersection || intersection.object.userData.player.arrayFuncs === undefined )
			return;
		var index = intersection.index || 0,
			point = intersection.object.userData.player.arrayFuncs[index],
			line = point === undefined ? undefined : point.line;
		if ( line !== undefined )
			line.visible( value );
		if ( !value )
			return;
		if ( point.line !== undefined )
			return;
		point.line = new Player.traceLine( /*THREE, intersection.object, */options );

		//color
		var color = intersection.object.geometry.attributes.color;
		if ( color === undefined )
			color = new THREE.Color( 0xffffff );//white
		else {

			var vector = new THREE.Vector3().fromArray( color.array, index * color.itemSize )
			color = new THREE.Color( vector.x, vector.y, vector.z );

		}

		point.line.addPoint(

//			getObjectPosition( getMesh(), index ),
			getMesh(), index,
//			Player.getSelectSceneIndex(),
			color

		);

	}

	/**
	 * Adds select point GUI into dat.gui folder
	 * @function GuiSelectPoint.
	 *add
	 * @param {GUI} folder dat.gui folder.
	 */
	this.add = function ( folder ) {

		f3DObjects = folder.addFolder( lang.meshs );
		var mesh, buttonScaleDefault, buttonPositionDefault, buttonRotationDefault;

		cMeshs = f3DObjects.add( { Meshs: lang.notSelected }, 'Meshs', { [lang.notSelected]: -1 } ).onChange( function ( value ) {

			value = parseInt( value );
			mesh = getMesh();

			const none = 'none', block = 'block';
			var display;
			if ( mesh === undefined ) {

				display = none;
				mesh = undefined;
				if ( axesHelper !== undefined )
					axesHelper.exposePosition( getObjectPosition( getMesh(), value ) );

			} else {

				const displayDefaultButtons = mesh.userData.default === undefined ? none : block;
				buttonScaleDefault.domElement.parentElement.parentElement.style.display = displayDefaultButtons;
				buttonPositionDefault.domElement.parentElement.parentElement.style.display = displayDefaultButtons;
				buttonRotationDefault.domElement.parentElement.parentElement.style.display = displayDefaultButtons;

				display = block;
				var displayPoints = none, displayfPoints = none, displayFrustumPoints = block;

				cPoints.__onChange( -1 );
				_this.removePoints();

				if ( mesh.userData.controllers !== undefined ) {

					//FrustumPoints
					mesh.userData.controllers();// cFrustumPoints );

				} else {

					displayPoints = block;
					displayFrustumPoints = none;
					
					if ( mesh.geometry.attributes ) {

						displayfPoints = block;
						for ( var iPosition = 0; iPosition < mesh.geometry.attributes.position.count; iPosition++ ) {

							const opt = document.createElement( 'option' ),
								name = mesh.userData.player && mesh.userData.player.arrayFuncs ? mesh.userData.player.arrayFuncs[iPosition].name : '';
							opt.innerHTML = iPosition + ( name === undefined ? '' : ' ' + name );
							opt.setAttribute( 'value', iPosition );//Эта строка нужна в случае когда пользователь отменил выбор точки. Иначе при движении камеры будут появляться пунктирные линии, указвающие на несуществующую точку
							cPoints.__select.appendChild( opt );

						}

					}

				}
				fPoints.domElement.parentElement.style.display = displayfPoints;
//				cPoints.domElement.parentElement.parentElement.style.display = displayPoints;
				dislayEl( cPoints, displayPoints );
				if ( cTraceAll ) {

//					cTraceAll.domElement.parentElement.parentElement.style.display = displayPoints;
					dislayEl( cTraceAll, Player.isCreated() ? displayPoints : false );

				}
				if ( cFrustumPoints !== undefined )
					cFrustumPoints.display( displayFrustumPoints );

				setScaleControllers();
				setPositionControllers();
				setRotationControllers();

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
			if ( ( options.arrayCloud !== undefined ) && ( options.arrayCloud.frustumPoints !== undefined ) )
				options.arrayCloud.frustumPoints.updateCloudPoint( mesh );

		},
			{

				settings: { zoomMultiplier: 1.1, },
				getLanguageCode: getLanguageCode,

			} ) );
		const scale = new THREE.Vector3();
		function setScale( axesName, value ) {

			mesh.scale[axesName] = value;
			mesh.needsUpdate = true;
			exposePosition();
			if ( ( options.arrayCloud !== undefined ) && ( options.arrayCloud.frustumPoints !== undefined ) )
				options.arrayCloud.frustumPoints.updateCloudPoint( mesh );

		}
		if ( options.scales.x ) {

			cScaleX = dat.controllerZeroStep( fScale, scale, 'x', function ( value ) { setScale( 'x', value ); } );
			dat.controllerNameAndTitle( cScaleX, options.scales.x.name );

		}
		if ( options.scales.y ) {

			cScaleY = dat.controllerZeroStep( fScale, scale, 'y', function ( value ) { setScale( 'y', value ); } );
			dat.controllerNameAndTitle( cScaleY, options.scales.y.name );

		}
		if ( options.scales.z ) {

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
			if ( !scale )
				return;
			const axesName = scale.name,
				f = fPosition.addFolder( axesName );
			f.add( new PositionController( function ( shift ) {

				mesh.position[name] += shift;
				mesh.needsUpdate = true;

				setPositionControllers();
				exposePosition();
				if ( ( options.arrayCloud !== undefined ) && ( options.arrayCloud.frustumPoints !== undefined ) )
					options.arrayCloud.frustumPoints.updateCloudPoint( mesh );

			}, { getLanguageCode: getLanguageCode, } ) );

			function setPosition( value ) {

				mesh.position[name] = value;
				mesh.needsUpdate = true;
				exposePosition();

			}
			const position = new THREE.Vector3();

			cPosition[name] = dat.controllerZeroStep( f, position, name, function ( value ) { setPosition( value ); } );
			dat.controllerNameAndTitle( cPosition[name], axesName );

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

		var fRotation = fMesh.addFolder( lang.rotation );
		function addRotationControllers( name ) {

			const scale = options.scales[name];
			if ( !scale )
				return;
			cRotations[name] = fRotation.add( new THREE.Vector3(), name, 0, Math.PI * 2, 1 / 360 ).
				onChange( function ( value ) {

					const mesh = getMesh();
					if ( !mesh.userData.boFrustumPoints ) {

						mesh.rotation[name] = value;
						mesh.needsUpdate = true;

					}

					if ( !boSetMesh )
						exposePosition();
					if ( ( options.arrayCloud !== undefined ) && ( options.arrayCloud.frustumPoints !== undefined ) )
						options.arrayCloud.frustumPoints.updateCloudPoint( mesh );

				} );
			dat.controllerNameAndTitle( cRotations[name], scale.name );

		}
		addRotationControllers( 'x' );
		addRotationControllers( 'y' );
		addRotationControllers( 'z' );

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

		//Points

		fPoints = fMesh.addFolder( lang.points );

		cPoints = fPoints.add( { Points: lang.notSelected }, 'Points', { [lang.notSelected]: -1 } ).onChange( function ( value ) {

			value = parseInt( value );
			var display, position;
			if ( value === -1 ) {

				display = 'none';

			} else {

				display = 'block';
				_this.select( { object: getMesh(), index: value } );

			}
			if ( axesHelper !== undefined )
				axesHelper.exposePosition( getObjectPosition( getMesh(), value ) );
			displayPointControllers( display );

		} );
		cPoints.__select[0].selected = true;
		dat.controllerNameAndTitle( cPoints, lang.select );

		if ( cFrustumPoints !== undefined )
			cFrustumPoints.create( fPoints, getLanguageCode() );
		if ( guiParams.myThreejs )
			guiParams.myThreejs.cFrustumPoints = cFrustumPoints;

		//Camera target
		var orbitControlsOptions,
			cameraTarget;//здесь хранится cameraTarget когда ни одна точка не выбрана как camera target
		if ( guiParams.cameraTarget ) Player.cameraTarget.init( guiParams.cameraTarget );
		const playerCameraTarget = Player.cameraTarget.get();
//		if ( guiParams.cameraTarget )
//		if ( Player.cameraTarget2
		if ( playerCameraTarget ) {

			cCameraTarget = fPoints.add( playerCameraTarget, 'boLook' ).onChange( function ( boLook ) {

				const mesh = getMesh();
				if ( !mesh.userData.player ) {

					mesh.userData.player = { arrayFuncs: [] }
					for( var i = 0; i < mesh.geometry.attributes.position.count; i++ ) {

						mesh.userData.player.arrayFuncs.push( new THREE.Vector3().fromArray( mesh.geometry.attributes.position.array,
							i * mesh.geometry.attributes.position.itemSize ) );

					}

				}
				const index = cPoints.__select.options.selectedIndex-1,
					point = mesh.userData.player.arrayFuncs[index];
/*
				function getCameraTarget(){

					for ( var i = 0; i < cMeshs.__select.options.length; i++ ) {

						const mesh = cMeshs.__select.options[i].mesh;
						if( !mesh || !mesh.userData.player || !mesh.userData.player.arrayFuncs )
							continue;
						const arrayFuncs = mesh.userData.player.arrayFuncs;
						for ( var j = 0; j < arrayFuncs.length; j++ ) {

							const CT = cameraTarget = arrayFuncs[j].cameraTarget;
							if ( CT ) {

								cameraTarget = CT;
								return cameraTarget;

							}

						}

					}

				}
*/				
				//remove boLook from all points
				for ( var i = 0; i < cMeshs.__select.options.length; i++ ) {

					const mesh = cMeshs.__select.options[i].mesh;
					if( !mesh || !mesh.userData.player || !mesh.userData.player.arrayFuncs )
						continue;
					const arrayFuncs = mesh.userData.player.arrayFuncs;
					for ( var j = 0; j < arrayFuncs.length; j++ )
						if ( arrayFuncs[j].cameraTarget ) arrayFuncs[j].cameraTarget.boLook = false;

				}
				point.cameraTarget.boLook = boLook;
				if ( Player.player ) Player.player.selectScene();
				if ( boLook ) {

					if ( Player.cameraGui ) Player.cameraGui.look();
					if ( !point.cameraTarget ) {

						getCameraTarget();// true );
//						if ( guiParams.cameraTarget.boLook === undefined ) guiParams.cameraTarget.boLook = true;
//						if ( Player.cameraTarget2.boLook === undefined ) Player.cameraTarget2.boLook = false;
						if ( playerCameraTarget.boLook === undefined ) Player.cameraTarget2.boLook = false;
						
//не помню зачем вставил эту строку
//Но если оставить эту строку то неверно будет устанавливаться дистанция и угол камеры когда порльзователь меняет точку, за которой наблюдает камера
//						guiParams.cameraTarget.camera.userData.cameraTarget = guiParams.cameraTarget;

//						point.cameraTarget = { camera: guiParams.cameraTarget.camera, }
//						point.cameraTarget = { camera: Player.cameraTarget2.camera, }
//						point.cameraTarget = { camera: playerCameraTarget.camera, }
//						Player.cameraTarget.init(  );

						if ( !orbitControlsOptions ) orbitControlsOptions = {}
						if ( !orbitControlsOptions.target )
							orbitControlsOptions.target = new THREE.Vector3();
						if ( Player.orbitControls )
							orbitControlsOptions.target.copy( Player.orbitControls.target );
							
						cameraTarget = undefined;
//						Player.setCameraTarget( mesh );
//						Player.setMeshCameraTarget( mesh );
//						Player.cameraTarget.setTarget( mesh );
						Player.cameraTarget.changeTarget( mesh, index );

					}
					return;

				}
/*				
				cameraTarget = point.cameraTarget;
				if ( point.cameraTarget ) point.cameraTarget = undefined;
*/
				//Если точка имеет индивидуальную cameraTarget, то камера будет следить по этим настройкам
				if ( guiParams.cameraTarget ) guiParams.cameraTarget.camera.userData.cameraTargetPoint = point.cameraTarget;

				if ( Player.orbitControls ) Player.orbitControls.reset();

				if ( orbitControlsOptions ) {

					if ( getCameraTarget() )
						return;

/*
					if ( guiParams.cameraTarget.orbitControls )
						guiParams.cameraTarget.orbitControls.target.copy( orbitControlsOptions.target );
*/						
					if ( Player.orbitControls )
						Player.orbitControls.target.copy( orbitControlsOptions.target );
					guiParams.cameraTarget.camera.lookAt( orbitControlsOptions.target );
					point.cameraTarget = undefined;

				}

			} );
			dat.controllerNameAndTitle( cCameraTarget, lang.cameraTarget, lang.cameraTargetTitle );

		}

		//Points attribute position
		fPoint = fPoints.addFolder( lang.point );
		dat.folderNameAndTitle( fPoint, lang.point, lang.pointTitle );

		//Points world position
		fPointWorld = fPoints.addFolder( lang.pointWorld );
		dat.folderNameAndTitle( fPointWorld, lang.pointWorld, lang.pointWorldTitle );
		fPointWorld.open();

		displayPointControllers( 'none' );

		if ( guiParams.pointsControls ) {

//			cTraceAll = guiParams.pointsControls( fPoints, dislayEl, getMesh );
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
		dislayEl( cTraceAll, Player.isCreated() );

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

			},

		}, 'defaultF' ), lang.defaultButton, lang.default3DObjectTitle );
		addPointControllers();

		while ( arrayMeshs.length > 0 ) {

			this.addMesh( arrayMeshs[arrayMeshs.length - 1] );
			arrayMeshs.pop();

		}

	}
	this.setColorAttribute = function( attributes, i, color ) {

		if ( typeof color === "string" )
			color = new THREE.Color( color );
		const colorAttribute = attributes.color || attributes.ca;
		if ( colorAttribute === undefined )
			return;
		colorAttribute.setX( i, color.r );
		colorAttribute.setY( i, color.g );
		colorAttribute.setZ( i, color.b );
		colorAttribute.needsUpdate = true;

	}
	this.removePoints = function () {

		//thanks to https://stackoverflow.com/a/48780352/5175935
		cPoints.domElement.querySelectorAll( 'select option' ).forEach( option => option.remove() );
		const opt = document.createElement( 'option' );
		opt.innerHTML = lang.notSelected;
		opt.setAttribute( 'value', -1 );//Эта строка нужна в случае когда пользователь отменил выбор точки. Иначе при движении камеры будут появляться пунктирные линии, указвающие на несуществующую точку
		cPoints.__select.appendChild( opt );

	}
/*
	function movePoint( axisName, value ) {

		const points = intersection.object,
			axesId = axisName === 'x' ? 0 : axisName === 'y' ? 1 : axisName === 'z' ? 2 : axisName === 'w' ? 3 : console.error( 'axisName:' + axisName );
		points.geometry.attributes.position.array
		[axesId + intersection.index * points.geometry.attributes.position.itemSize] = value;
		points.geometry.attributes.position.needsUpdate = true;

		exposePosition( intersection.index );

		if ( ( options.arrayCloud !== undefined ) && ( options.arrayCloud.frustumPoints !== undefined ) )
			options.arrayCloud.frustumPoints.updateCloudPointItem( points, intersection.index );

	}
*/
	function addPointControllers() {

		function isReadOnlyController( controller ) {

			if ( controller.domElement.querySelector( 'input' ).readOnly ) {

				if ( controller.getValue() !== controller.initialValue ) {

					if ( controller.boSetValue === undefined ) {

						controller.boSetValue = true;
						setValue( controller, controller.initialValue );
						controller.boSetValue = undefined;
						controller.initialValue = controller.getValue();//Эта строка нужна в случае когда новое зачения невозможно установиь точно таким же, как initialValue
						//Иначе перепонится стек

					}

				}
				return true;

			}
			return false;

		}

		//Point's attribute position axes controllers

		function axesGui( axisName/*axesId, onChange*/ ) {

			var scale, controller;
			if ( axisName === 'w' ){

				//W axis
/*				
				if ( options.scales.w === undefined ) {

					return;

				}
*/				
				scale = options.scales.w;
				scale = scale || {};
				scale.name = scale.name || axisName;
				if ( options.palette instanceof ColorPicker.palette ) {

					scale.min = scale.min === undefined ? 0 : scale.min;
					scale.max = scale.max === undefined ? 100 : scale.max;

				}
				function onChange( value ) {

//						options.palette = options.palette || new ColorPicker.palette();
					const attributes = intersection.object.geometry.attributes,
						i = intersection.index;
					if ( attributes.position.itemSize < 4 ) {

						console.error( 'guiSelectPoint.addPointControllers().axesGui().controller.onChange(): attributes.position.itemSize = ' + attributes.position.itemSize )
						return;

					}
					if ( options.palette ) {

						const color = options.palette.toColor( value, controller.__min, controller.__max );
						_this.setColorAttribute( attributes, i, color );

					}
					attributes.position.setW( i, value );

					if ( ( options.arrayCloud !== undefined ) && ( options.arrayCloud.frustumPoints !== undefined ) )
						options.arrayCloud.frustumPoints.updateCloudPointItem( intersection.object, intersection.index );

				}
				if ( ( scale.min !== undefined ) &&  ( scale.max !== undefined ) ) {

					controller = fPoint.add( {

							value: scale.min,

						}, 'value',
							scale.min,
							scale.max,
							( scale.max - scale.min ) / 100
					).onChange( function ( value ) {

						onChange( value );
/*
//						options.palette = options.palette || new ColorPicker.palette();
						const attributes = intersection.object.geometry.attributes,
							i = intersection.index;
						if ( options.palette ) {

							const color = options.palette.toColor( value, controller.__min, controller.__max );
							_this.setColorAttribute( attributes, i, color );

						}
						attributes.position.setW( i, value );

						if ( ( options.arrayCloud !== undefined ) && ( options.arrayCloud.frustumPoints !== undefined ) )
							options.arrayCloud.frustumPoints.updateCloudPointItem( intersection.object, intersection.index );
*/

					} );
					if ( options.palette instanceof ColorPicker.palette ) {

						controller.domElement.querySelector( '.slider-fg' ).style.height = '40%';
						const elSlider = controller.domElement.querySelector( '.slider' );
						ColorPicker.create( elSlider, {

							palette: options.palette,
							style: {

								//border: '2px solid #303030',
								//width: '65%',
								//height: elSlider.offsetHeight / 2,//'50%',

							},
							//onError: function ( message ) { alert( 'Colorpicker error: ' + message ); }

						} );

					}
					
				} else 
					controller = fPoint.add( {

							value: 0,

						}, 'value'
					).onChange( function ( value ) {

						onChange( value );
/*
						const attributes = intersection.object.geometry.attributes,
							i = intersection.index;
						if ( attributes.position.itemSize < 4 ) {

							console.error( 'guiSelectPoint.addPointControllers().axesGui().controller.onChange(): attributes.position.itemSize = ' + attributes.position.itemSize )
							return;
							
						}
						attributes.position.setW( i, value );

						if ( ( options.arrayCloud !== undefined ) && ( options.arrayCloud.frustumPoints !== undefined ) )
							options.arrayCloud.frustumPoints.updateCloudPointItem( intersection.object, intersection.index );
*/

					} );

			} else {

				scale = axesHelper === undefined ? options.scales[axisName] : //если я буду использовать эту строку то экстремумы шкал буду устанавливатся по умолчанию а не текущие
					axesHelper.options ? axesHelper.options.scales[axisName] : undefined;
				if ( scale )
					controller = fPoint.add( {

						value: scale.min,

					}, 'value',
						scale.min,
						scale.max,
						( scale.max - scale.min ) / 100 ).
						onChange( function ( value ) {

							if ( isReadOnlyController( controller ) )
								return;
//							movePoint( axisName, value );
							const points = intersection.object,
								axesId = axisName === 'x' ? 0 : axisName === 'y' ? 1 : axisName === 'z' ? 2 : axisName === 'w' ? 3 : console.error( 'axisName:' + axisName );
							points.geometry.attributes.position.array
							[axesId + intersection.index * points.geometry.attributes.position.itemSize] = value;
							points.geometry.attributes.position.needsUpdate = true;

							exposePosition( intersection.index );

							if ( ( options.arrayCloud !== undefined ) && ( options.arrayCloud.frustumPoints !== undefined ) )
								options.arrayCloud.frustumPoints.updateCloudPointItem( points, intersection.index );

						} );

			}
			if ( scale )
				dat.controllerNameAndTitle( controller, scale.name );
			return controller;

		}
		cX = axesGui( 'x' );
		cY = axesGui( 'y' );
		cZ = axesGui( 'z' );
		cW = axesGui( 'w' );
		cColor = fPoint.addColor( {

			color: '#FFFFFF',

		}, 'color' ).
			onChange( function ( value ) {

				if ( isReadOnlyController( cColor ) )
					return;
				if ( cColor.userData === undefined )
					return;
				var intersection = cColor.userData.intersection;
				_this.setColorAttribute( intersection.object.geometry.attributes, intersection.index, value );

			} );
		dat.controllerNameAndTitle( cColor, options.scales.w ? options.scales.w.name : lang.color );
//		dat.controllerNameAndTitle( cColor, lang.color );
		cOpacity = fPoint.add( {

			opasity: 1,

		}, 'opasity', 0, 1, 0.01 ).
			onChange( function ( opasity ) {

				if ( isReadOnlyController( cOpacity ) )
					return;
				if ( cColor.userData === undefined )
					return;
				const intersection = cColor.userData.intersection;
				const points = intersection.object;
				if ( points.geometry.attributes.ca === undefined )
					return;//no opasity
				points.geometry.attributes.ca.array
				[3 + intersection.index * points.geometry.attributes.ca.itemSize] = opasity;
				points.geometry.attributes.ca.needsUpdate = true;

			} );
		dat.controllerNameAndTitle( cOpacity, lang.opacity, lang.opacityTitle );
		
		cTrace = fPoint.add( { trace: false }, 'trace' ).onChange( function ( value ) {

			visibleTraceLine( intersection, value, getMesh );

		} );
		dat.controllerNameAndTitle( cTrace, lang.trace, lang.traceTitle );
		dislayEl( cTrace, Player.isCreated() );

		if ( guiParams.pointControls ) {

//			cTrace = guiParams.pointControls( fPoint, dislayEl, getMesh, intersection );
			guiParams.pointControls( fPoint, dislayEl, getMesh, intersection );

		}
		
		//Point's world position axes controllers

		function axesWorldGui( axisName ) {

			const scale = axesHelper === undefined ? options.scales[axisName] :
					axesHelper.options ? axesHelper.options.scales[axisName] : undefined;
			if ( !scale )
				return;
			const controller = dat.controllerZeroStep( fPointWorld, { value: scale.min, }, 'value' );
			controller.domElement.querySelector( 'input' ).readOnly = true;
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
					t = Player.getTime();
				cX.setValue( typeof positionDefault.x === "function" ?
					positionDefault.x( t, options.a, options.b ) : positionDefault.x );
				cY.setValue( typeof positionDefault.y === "function" ?
					positionDefault.y( t, options.a, options.b ) : positionDefault.y );
				cZ.setValue( typeof positionDefault.z === "function" ?
					positionDefault.z( t, options.a, options.b ) :
					positionDefault.z === undefined ? 0 ://default Z axis of 2D point is 0
						positionDefault.z );

				if ( positionDefault.w !== undefined ) {

					if ( positionDefault.w.r !== undefined )
						cColor.setValue( '#' +
							new THREE.Color( positionDefault.w.r, positionDefault.w.g, positionDefault.w.b ).getHexString() );
					else if ( typeof positionDefault.w === "function" )
						setValue( cW, positionDefault.w( t ) );
					else if ( positionDefault.w.func ) {

						setValue( cW, positionDefault.w.func( t ) );
						return;

					}
					const float = parseFloat( positionDefault.w );
					if ( float === positionDefault.w )
						setValue( cW, positionDefault.w );
					else console.error( 'Restore default local position: Invalid W axis.' );

				} else {

					cColor.setValue( cColor.initialValue );
					cOpacity.setValue( cOpacity.initialValue );

				}


			},

		}, 'defaultF' );
		dat.controllerNameAndTitle( cRestoreDefaultLocalPosition, lang.defaultButton, lang.defaultLocalPositionTitle );

		funcFolder = new functionsFolder( fPoint, options.scales, THREE, function ( func, axisName ) {

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
			const position = mesh.geometry.attributes.position,
				itemSize = position.itemSize;
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
			setValue( controller, Player.execFunc( funcs, axisName, t ) );
/*			
			try {
			
				setValue( controller, Player.execFunc( funcs, axisName, t ) );
			
			} catch ( e ) {
			
				alert( e.message );
				funcFolder.setFocus( axisName );
			
			}
*/

		}, {

			getLanguageCode: getLanguageCode,
			THREE: THREE,

		} );

	}
	/**
	 * get frustum points
	 * @function GuiSelectPoint.
	 * getFrustumPoints
	 */
	this.getFrustumPoints = function () { return cFrustumPoints; }
	this.windowRange = function ( options ) {

		pointLight1.windowRange( options.scales );
		pointLight2.windowRange( options.scales );

		cX.min( options.scales.x.min );
		cX.max( options.scales.x.max );
		cX.updateDisplay();

		cY.min( options.scales.y.min );
		cY.max( options.scales.y.max );
		cY.updateDisplay();

		cZ.min( options.scales.z.min );
		cZ.max( options.scales.z.max );
		cZ.updateDisplay();

		if ( cW !== undefined ) {

			cW.min( options.scales.w.min );
			cW.max( options.scales.w.max );
			cW.updateDisplay();

		}

	}
//	this.setOrbitControls = function ( orbitControls ) { guiParams.cameraTarget.orbitControls = orbitControls; }
	return this;

}

/**
 * gets the position from the geometry.attributes.position of the object.
 * @param {THREE.Mesh} object
 * @param {number} index index of position in the object.geometry.attributes.position
 * @returns position
 */
function getObjectLocalPosition( object, index ) {

	if ( !THREE ) {

		console.error( 'getObjectLocalPosition: call GuiSelectPoint.setTHREE( THREE ); first' );
		return;
		
	}
	const attributesPosition = object.geometry.attributes.position,
		position = attributesPosition.itemSize >= 4 ? new THREE.Vector4( 0, 0, 0, 0 ) : new THREE.Vector3();
	position.fromArray( attributesPosition.array, index * attributesPosition.itemSize );
	return position;

}

/**
 * gets position of the vector in world coordinates, taking into account the position, scale and rotation of the 3D object
 * @param {THREE.Object3D} object
 * @param {THREE.Vector3} pos local position
 * @returns world position 
 */
function getWorldPosition( object, pos ) {

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
		
	} while ( object.parent );
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

}

/**
 * set THREE
 * @function GuiSelectPoint.
 * setTHREE
 * @param {THREE} _THREE {@link https://github.com/anhr/three.js|THREE}
 */
GuiSelectPoint.setTHREE = function ( _THREE ) {

	if ( THREE ) {

		if ( !Object.is(THREE, _THREE) )
			console.error( 'GuiSelectPoint.setTHREE: duplicate THREE. Please use one instance of the THREE library.' )
		return;

	}
	THREE = _THREE;

}
export { GuiSelectPoint, getWorldPosition, getObjectLocalPosition, getObjectPosition };
