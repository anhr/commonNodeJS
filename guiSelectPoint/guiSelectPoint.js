/**
 * @module guiSelectPoint.
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

import { dat } from './dat/dat.module.js';
//import { dat } from 'https://raw.githack.com/anhr/commonNodeJS/master/dat/dat.module.js';

import ScaleController from './ScaleController.js';
//import ScaleController from 'https://raw.githack.com/anhr/commonNodeJS/master/ScaleController.js';

import PositionController from './PositionController.js';
//import PositionController from 'https://raw.githack.com/anhr/commonNodeJS/master/PositionController.js';

import ColorPicker from '../../colorpicker/master/colorpicker.js';//https://github.com/anhr/colorPicker
//import ColorPicker from 'https://raw.githack.com/anhr/colorpicker/master/colorpicker.js';

/**
 * A dat.gui based graphical user interface for select a point from the mesh.
 * @param {THREE} _THREE {@link https://github.com/anhr/three.js|THREE}
 * @param {object} [guiParams] Followed parameters is allowed. Default is no parameters
 * @param {AxesHelper} [guiParams.axesHelper] An axis object to visualize axes. Default is undefined.
 * See {@link https://github.com/anhr/AxesHelper|AxesHelper}.
 * @param {string} [guiParams.options] See {@link https://raw.githack.com/anhr/AxesHelper/master/jsdoc/index.html|axesHelper.options} for details. Default is axesHelper.options if axesHelper is defined or { scales: {...} }
 * @param {string} [guiParams.cFrustumPoints]
 * @param {string} [guiParams.myThreejs] See {@link https://github.com/anhr/myThreejs|myThreejs}.
 * @param {Function} [guiParams.pointControls] pointControls( fPoint, dislayEl, getMesh ) Adds the trace "Display the trace of the point movement" control checkbox into gui.
 * fPoint - parent folder for new control.
 * dislayEl( conrtol, true or false ) - function for dislay or hide of the control.
 * getMesh() returns the mesh, selected in the GuiSelectPoint.
 * Default is undefined.
 * @param {Function} [guiParams.pointsControls] pointsControls( fPoints, dislayEl, getMesh ) Adds the trace "Display the trace of the movement of all points of the mesh." control checkbox into gui.
 * fPoints - parent folder for new control.
 * dislayEl( conrtol, true or false ) - function for dislay or hide of the control.
 * getMesh() returns the mesh, selected in the GuiSelectPoint.
 * Default is undefined.
 * @param {Function} [guiParams.setIntersection] setIntersection( intersection ) sets the intersection value of myThreejs. Default is undefined
 * @param {Function} [guiParams.getLanguageCode] Your custom getLanguageCode() function.
 * returns the "primary language" subtag of the language version of the browser.
 * Examples: "en" - English language, "ru" Russian.
 * See the "Syntax" paragraph of RFC 4646 {@link https://tools.ietf.org/html/rfc4646#section-2.1|rfc4646 2.1 Syntax} for details.
 * Default returns the 'en' is English language.
 * You can import { getLanguageCode } from '../../commonNodeJS/master/lang.js';
 * @param {object} [guiParams.lang] Object with localized language values
 * @example
import { GuiSelectPoint } from 'https://raw.githack.com/anhr/commonNodeJS/master/guiSelectPoint.js';

const guiSelectPoint = new GuiSelectPoint( { axesHelper: axesHelper, } );
guiSelectPoint.add( gui, { getLanguageCode: getLanguageCode, } );
guiSelectPoint.addMesh( points );
 * @example //Using of guiParams.lang:
guiParams = {

	getLanguageCode: function() { return 'az'; },
	lang: { textHeight: 'mətn boyu', languageCode: 'az' },

}
 */
function GuiSelectPoint( _THREE, guiParams ) {

	GuiSelectPoint.setTHREE( _THREE );

	guiParams = guiParams || {};

	const axesHelper = guiParams.axesHelper,
		options = guiParams.options || ( axesHelper ? axesHelper.options : undefined ) || {

			scales: {

				x: {

					name: 'x',
					min: -1,
					max: 1,

				},
				y: {

					name: 'y',
					min: -1,
					max: 1,

				},
				z: {

					name: 'z',
					min: -1,
					max: 1,

				},

			}

		},
//		cFrustumPoints = guiParams.cFrustumPoints,
//		gui = undefined,
		guiSelectPoint = this;
//		frustumPoints = undefined;
	var cFrustumPoints;
//	options.scales = options.scales || {};

	//Localization

	const getLanguageCode = guiParams.getLanguageCode || function () { return 'en'; };

	const lang = {

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

		moveGroup: 'Move Scene',

	};

/*
	const _languageCode = guiParams.getLanguageCode === undefined ? 'en'//Default language is English
		: guiParams.getLanguageCode();
*/
	const _languageCode = getLanguageCode();

	switch ( _languageCode ) {

		case 'ru'://Russian language

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
		controllerX, controllerY, controllerZ, controllerW, cTrace, cTraceAll, controllerColor, controllerOpacity,
		controllerWorld = new THREE.Vector3(),
		boSetMesh = false;//Для предотвращения лишних вызовов exposePosition если выбрать точку и передвинуть камеру с помошью OrbitControls,
	if ( options.arrayCloud )//Array of points with cloud
		cFrustumPoints = new options.arrayCloud.cFrustumPointsF( _this );
	//сейчас exposePosition вызывается только один раз из this.setMesh
	function dislayEl( controller, displayController ) {

		if ( controller === undefined )
			return;
		if ( typeof displayController == "boolean" )
			displayController = displayController ? 'block' : 'none';
		var el = controller.domElement;
		while ( el.tagName.toUpperCase() !== "LI" ) el = el.parentElement;
		el.style.display = displayController;

	}
/*
	function visibleTraceLine( intersection, value ) {

		if ( intersection.object.userData.arrayFuncs === undefined )
			return;
		var index = intersection.index || 0,
			point = intersection.object.userData.arrayFuncs[index],
			line = point === undefined ? undefined : point.line;
		if ( line !== undefined )
			line.visible( value );
		if ( !value )
			return;
		if ( point.line !== undefined )
			return;
		point.line = new traceLine();

		//color
		var color = intersection.object.geometry.attributes.color;
		if ( color === undefined )
			color = new THREE.Color( 0xffffff );//white
		else {
			var vector = new THREE.Vector3().fromArray( color.array, index * color.itemSize )
			color = new THREE.Color( vector.x, vector.y, vector.z );
		}

		point.line.addPoint(

			getObjectPosition( getMesh(), index ),
			player.getSelectSceneIndex(),
			color

		);

	}
*/
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
//			axesHelper.exposePosition( position );

		if ( controllerWorld.x ) controllerWorld.x.setValue( position.x );
		if ( controllerWorld.y ) controllerWorld.y.setValue( position.y );
		if ( controllerWorld.z ) controllerWorld.z.setValue( position.z );

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
	function setPosition( intersectionSelected ) {

		const positionLocal = getObjectLocalPosition( intersectionSelected.object, intersectionSelected.index );
		setValue( controllerX, positionLocal.x );
		setValue( controllerY, positionLocal.y );
		setValue( controllerZ, positionLocal.z );

		const position = getObjectPosition( intersectionSelected.object, intersectionSelected.index );
		setValue( controllerWorld.x, position.x );
		setValue( controllerWorld.y, position.y );
		setValue( controllerWorld.z, position.z );

		var displayControllerW, displayControllerColor, displayControllerOpacity, none = 'none', block = 'block';
		if ( typeof intersection.object.userData.arrayFuncs === "function" )
			console.error( 'arrayFuncs === "function" under constraction' );
		var func = intersectionSelected.object.userData.arrayFuncs ? intersectionSelected.object.userData.arrayFuncs[intersectionSelected.index] : undefined,
			opasity,
			color = func === undefined ?
				undefined :
				Array.isArray( func.w ) || ( typeof func.w === "function" ) ?
					execFunc( func, 'w', group.userData.t, options.a, options.b ) :
					func.w;

		if ( color === undefined ) {

			if ( intersectionSelected.object.geometry.attributes.ca === undefined )
				console.warn( 'Under constraction. цвет frustumPoints не известен потому что он вычисляется в шейдере D:\My documents\MyProjects\webgl\three.js\GitHub\myThreejs\master\frustumPoints\vertex.c' )
			else {

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
			if ( intersectionSelected.object.userData.arrayFuncs === undefined ) {

				displayControllerColor = none;
				displayControllerOpacity = none;

			} else {

				const strColor = '#' + color.getHexString();
				//Сначала надо установить initialValue потому что для FrustumPoints я устанвил readOnly для controllerColor.
				//В этом случае я не могу отобразить цвет следующей точки FrustumPoints потому что в режиме readOnly
				//при изменении цвета восстанвливается старый цвет из initialValue.
				controllerColor.initialValue = strColor;
				controllerColor.setValue( strColor );
				controllerColor.userData = { intersection: intersectionSelected, };
				if ( opasity !== undefined ) {

					setValue( controllerOpacity, opasity );

				} else displayControllerOpacity = none;
				controllerOpacity.userData = { intersection: intersectionSelected, };

			}

		} else {

			if ( controllerW === undefined )
				displayControllerW = none;
			else {

				if ( color === undefined )
					displayControllerW = none;
				else {

					setValue( controllerW, color );
					displayControllerW = block;

				}

			}
			displayControllerColor = none;
			displayControllerOpacity = none;

		}
		dislayEl( controllerW, displayControllerW );
		dislayEl( controllerColor, displayControllerColor );
		dislayEl( controllerOpacity, displayControllerOpacity );

		var boReadOnly = intersectionSelected.object.userData.boFrustumPoints === true ? true : false;
		if ( controllerX ) controllerX.domElement.querySelector( 'input' ).readOnly = boReadOnly;
		if ( controllerY ) controllerY.domElement.querySelector( 'input' ).readOnly = boReadOnly;
		if ( controllerZ ) controllerZ.domElement.querySelector( 'input' ).readOnly = boReadOnly;
		if ( controllerW ) controllerW.domElement.querySelector( 'input' ).readOnly = boReadOnly;
		controllerColor.domElement.querySelector( 'input' ).readOnly = boReadOnly;
		controllerOpacity.domElement.querySelector( 'input' ).readOnly = boReadOnly;

	}
	this.setMesh = function () {

		boSetMesh = true;
		setScaleControllers();
		setPositionControllers();
		setRotationControllers();
		exposePosition();
		boSetMesh = false;

	}
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
		controllerWorld.x.setValue( position.x );
		controllerWorld.y.setValue( position.y );
		controllerWorld.z.setValue( position.z );
/*		
		setValue( controllerWorld.x, position.x );
		setValue( controllerWorld.y, position.y );
		setValue( controllerWorld.z, position.z );
*/		

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
		console.error( 'Invalid mesh "' + mesh.name + '" index' );

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
	/**
	 * Adds new mesh into select point GUI
	 * @function GuiSelectPoint.
	 *addMesh
	 * @param {THREE.Mesh} mesh new mesh.
	 */
	this.addMesh = function ( mesh ) {

/*
		if ( !options.dat )
			return;
*/			
		//Test for duplicate item
		for ( var i = 0; i < cMeshs.__select.options.length; i++ ) {

			var option = cMeshs.__select.options[i];
			if ( mesh.userData.boFrustumPoints && ( option.mesh !== undefined ) && option.mesh.userData.boFrustumPoints )
				return;//duplicate FrustumPoints. Сюда попадает когда пользователь меняет количество слоев или Y точек в FrustumPoints. 
			if ( option.mesh !== undefined && ( option.mesh.name === mesh.name ) ) {

				//							console.error('guiSelectPointF.addMesh: Duplicate item ' + mesh.name );
				return;//сюда попадает когда создаются точки без shaderMaterial
				//Сначала вызывается из myPoints create.Points function
				//Потом из guiSelectPointF.addControllers

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

	}
	this.select = function ( intersectionSelected ) {

/*
		if ( !options.dat )
			return;
*/			
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
		//Click a point.The "Meshs" folder opens and you can see the scrolling of the dat.gui window.

		//select mesh
		const index = this.getMeshIndex( intersectionSelected.object );
		if ( cMeshs.__select[index].selected === false ) {

			cMeshs.__select[index].selected = true;
			cMeshs.__onChange( index - 1 );

		}

		this.selectPoint2 = function ( selectedMesh ) {

/*
			if ( ( options.guiSelectPoint.renderPhase !== undefined ) && ( options.guiSelectPoint.renderPhase !== options.guiSelectPoint.renderPhaseEnum.ready ) )
				return;
*/				
			if ( ( intersectionSelected.index === undefined ) || isNaN( intersectionSelected.index ) )
				return;

			//сделал эту проверку потому что не могу придумать как удалить intersectionSelected.index когда пользователь врусную сменил mesh
			if ( ( selectedMesh !== undefined ) && !Object.is( intersectionSelected.object, selectedMesh ) )
				return;//Сначала пользователь выбрал точку с помошщью мыши
			//Потом сменил Meshs/Select

			if ( !intersectionSelected.object.userData.boFrustumPoints ) {

				//fPoints.open();много времени на открытие когда много точек
				cPoints.__select[intersectionSelected.index + 1].selected = true;

			} else {//FrustumPoints

				cFrustumPoints.pointIndexes( intersectionSelected.object.userData.pointIndexes( intersectionSelected.index ) );

			}
			const block = 'block';
			fPoint.domElement.style.display = block;
			fPointWorld.domElement.style.display = block;
			intersection = intersectionSelected;
			if ( guiParams.setIntersection )
				guiParams.setIntersection( intersectionSelected );
			setPosition( intersectionSelected );

			const mesh = getMesh();
			const line = ( mesh.userData.arrayFuncs === undefined ) || ( typeof intersection.object.userData.arrayFuncs === "function" ) ?
				undefined :
				mesh.userData.arrayFuncs[intersectionSelected.index].line;//You can not trace points if you do not defined the mesh.userData.arrayFuncs
			if ( cTrace )
				cTrace.setValue( line === undefined ? false : line.isVisible() )

			cRestoreDefaultLocalPosition.domElement.parentElement.parentElement.style.display =
				intersection.object.userData.arrayFuncs === undefined ? 'none' : block;

		}
		this.selectPoint2();

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

		const selectedIndex = cMeshs.__select.options.selectedIndex;
		if ( selectedIndex !== -1 )
			return cMeshs.__select.options[cMeshs.__select.options.selectedIndex].mesh;
		return undefined;

	}
	function isNotSetControllers() {

		return ( getMesh() === undefined )
//			|| ( gui === undefined )
			;
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

			var display;
			if ( mesh === undefined ) {

				display = 'none';
				mesh = undefined;
				if ( axesHelper !== undefined )
					axesHelper.exposePosition( getObjectPosition( getMesh(), value ) );

			} else {


				const displayDefaultButtons = mesh.userData.default === undefined ? 'none' : 'block';
				buttonScaleDefault.domElement.parentElement.parentElement.style.display = displayDefaultButtons;
				buttonPositionDefault.domElement.parentElement.parentElement.style.display = displayDefaultButtons;
				buttonRotationDefault.domElement.parentElement.parentElement.style.display = displayDefaultButtons;

				display = 'block';
				var displayPoints = 'none', displayFrustumPoints = 'block';

				cPoints.__onChange( -1 );
				_this.removePoints();

				if ( mesh.userData.controllers !== undefined ) {

					//FrustumPoints
					mesh.userData.controllers();// cFrustumPoints );

				} else {

					displayPoints = 'block';
					displayFrustumPoints = 'none';
					
					for ( var iPosition = 0; iPosition < mesh.geometry.attributes.position.count; iPosition++ ) {

						var opt = document.createElement( 'option' ),
							name = mesh.userData.arrayFuncs === undefined ?
								undefined :
								mesh.userData.pointName === undefined ?
									typeof mesh.userData.arrayFuncs === "function" ?
										undefined :
										mesh.userData.arrayFuncs[iPosition].name :
									mesh.userData.pointName( iPosition );
						opt.innerHTML = iPosition + ( name === undefined ? '' : ' ' + name );
						opt.setAttribute( 'value', iPosition );//Эта строка нужна в случае когда пользователь отменил выбор точки. Иначе при движении камеры будут появляться пунктирные линии, указвающие на несуществующую точку
						cPoints.__select.appendChild( opt );
//						iPosition++;

					}

				}
				cPoints.domElement.parentElement.parentElement.style.display = displayPoints;
				if ( cTraceAll )
					cTraceAll.domElement.parentElement.parentElement.style.display = displayPoints;
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
			//						dat.controllerNameAndTitle( cRotations.x, options.scales.x.name );
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
			fPoint.domElement.style.display = display;
			fPointWorld.domElement.style.display = display;

		} );
		cPoints.__select[0].selected = true;
		dat.controllerNameAndTitle( cPoints, lang.select );

		if ( cFrustumPoints !== undefined )
			cFrustumPoints.create( fPoints, getLanguageCode() );
		if ( guiParams.myThreejs )
			guiParams.myThreejs.cFrustumPoints = cFrustumPoints;

		//Points attribute position
		fPoint = fPoints.addFolder( lang.point );
		dat.folderNameAndTitle( fPoint, lang.point, lang.pointTitle );
		fPoint.domElement.style.display = 'none';
		//					fPoint.open();

		//Points world position
		fPointWorld = fPoints.addFolder( lang.pointWorld );
		dat.folderNameAndTitle( fPointWorld, lang.pointWorld, lang.pointWorldTitle );
		fPointWorld.domElement.style.display = 'none';
		fPointWorld.open();

		if ( guiParams.pointsControls )
			cTraceAll = guiParams.pointsControls( fPoints, dislayEl, getMesh );
/*			
		//displays the trace of the movement of all points of the mesh
		cTraceAll = fPoints.add( { trace: false }, 'trace' ).onChange( function ( value ) {

			var mesh = getMesh();
			mesh.userData.traceAll = value;
			for ( var i = 0; i < mesh.geometry.attributes.position.count; i++ )
				visibleTraceLine( { object: mesh, index: i }, value );
			cTrace.setValue( value );

		} );
		dat.controllerNameAndTitle( cTraceAll, lang.trace, lang.traceAllTitle );
		dislayEl( cTraceAll, options.player === undefined ? false : true );
*/		

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
/*				
				group.children.forEach( function ( mesh ) {

					mesh.scale.copy( mesh.userData.default.scale );
					mesh.position.copy( mesh.userData.default.position );
					mesh.rotation.copy( mesh.userData.default.rotation );
					mesh.needsUpdate = true;

				} );
*/				
				setScaleControllers();
				setPositionControllers();
				setRotationControllers();
				exposePosition();

			},

		}, 'defaultF' ), lang.defaultButton, lang.default3DObjectTitle );
		addPointControllers();

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
//			if ( axesId > axesEnum.z )
			if ( axisName === 'w' ){

				//W axis
				if ( options.scales.w === undefined )
					return;
				scale = options.scales.w;
				controller = fPoint.add( {

					value: scale.min,

				}, 'value',
					scale.min,
					scale.max,
					( scale.max - scale.min ) / 100 ).
					onChange( function ( value ) {

						const color = options.palette.toColor( value, controller.__min, controller.__max ),
							attributes = intersection.object.geometry.attributes,
							i = intersection.index;
						_this.setColorAttribute( attributes, i, color );
						attributes.position.setW( i, value );

						if ( ( options.arrayCloud !== undefined ) && ( options.arrayCloud.frustumPoints !== undefined ) )
							options.arrayCloud.frustumPoints.updateCloudPointItem( intersection.object, intersection.index );

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

			} else {

//				axesName = axesEnum.getName( axesId );
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
/*		
		var axesEnum = AxesHelperOptions.axesEnum;
		controllerX = axesGui( axesEnum.x );
		controllerY = axesGui( axesEnum.y );
		controllerZ = axesGui( axesEnum.z );
		controllerW = axesGui( axesEnum.w );
*/		
		controllerX = axesGui( 'x' );
		controllerY = axesGui( 'y' );
		controllerZ = axesGui( 'z' );
		controllerW = axesGui( 'w' );
		controllerColor = fPoint.addColor( {

			color: '#FFFFFF',

		}, 'color' ).
			onChange( function ( value ) {

				if ( isReadOnlyController( controllerColor ) )
					return;
				if ( controllerColor.userData === undefined )
					return;
				var intersection = controllerColor.userData.intersection;
				_this.setColorAttribute( intersection.object.geometry.attributes, intersection.index, value );

			} );
		dat.controllerNameAndTitle( controllerColor, lang.color );
		controllerOpacity = fPoint.add( {

			opasity: 1,

		}, 'opasity', 0, 1, 0.01 ).
			onChange( function ( opasity ) {

				if ( isReadOnlyController( controllerOpacity ) )
					return;
				const intersection = controllerColor.userData.intersection;
				const points = intersection.object;
				if ( points.geometry.attributes.ca === undefined )
					return;//no opasity
				points.geometry.attributes.ca.array
				[3 + intersection.index * points.geometry.attributes.ca.itemSize] = opasity;
				points.geometry.attributes.ca.needsUpdate = true;

			} );
		dat.controllerNameAndTitle( controllerOpacity, lang.opacity, lang.opacityTitle );

		if ( guiParams.pointControls )
			cTrace = guiParams.pointControls( fPoint, dislayEl, getMesh, intersection );
/*			
		//displays the trace of the point movement
		cTrace = fPoint.add( { trace: false }, 'trace' ).onChange( function ( value ) {

			visibleTraceLine( intersection, value );

		} );
		dat.controllerNameAndTitle( cTrace, lang.trace, lang.traceTitle );
		dislayEl( cTrace, options.player === undefined ? false : true );
*/		

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
		controllerWorld.x = axesWorldGui( 'x' );
		controllerWorld.y = axesWorldGui( 'y' );
		controllerWorld.z = axesWorldGui( 'z' );
/*
		function axesWorldGui( axesId, onChange ) {

			var axesName = axesEnum.getName( axesId ),
				scale = axesHelper === undefined ? options.scales[axesName] :
					axesHelper.options ? axesHelper.options.scales[axesName] : undefined;
			if ( !scale )
				return;
			let controller = dat.controllerZeroStep( fPointWorld, { value: scale.min, }, 'value' );
			controller.domElement.querySelector( 'input' ).readOnly = true;
			dat.controllerNameAndTitle( controller, scale.name );
			return controller;

		}
		controllerWorld.x = axesWorldGui( axesEnum.x );
		controllerWorld.y = axesWorldGui( axesEnum.y );
		controllerWorld.z = axesWorldGui( axesEnum.z );
*/

		//Restore default local position.
		cRestoreDefaultLocalPosition = fPoint.add( {

			defaultF: function () {

				const positionDefault = intersection.object.userData.arrayFuncs[intersection.index];
				controllerX.setValue( typeof positionDefault.x === "function" ?
					positionDefault.x( group.userData.t, options.a, options.b ) : positionDefault.x );
				controllerY.setValue( typeof positionDefault.y === "function" ?
					positionDefault.y( group.userData.t, options.a, options.b ) : positionDefault.y );
				controllerZ.setValue( typeof positionDefault.z === "function" ?
					positionDefault.z( group.userData.t, options.a, options.b ) :
					positionDefault.z === undefined ? 0 ://default Z axis of 2D point is 0
						positionDefault.z );

				if ( positionDefault.w !== undefined ) {

					if ( positionDefault.w.r !== undefined )
						controllerColor.setValue( '#' +
							new THREE.Color( positionDefault.w.r, positionDefault.w.g, positionDefault.w.b ).getHexString() );
					else if ( typeof positionDefault.w === "function" )
						setValue( controllerW, positionDefault.w( group.userData.t ) );
					else console.error( 'Restore default local position: Invalid W axis.' );

				} else {

					controllerColor.setValue( controllerColor.initialValue );
					controllerOpacity.setValue( controllerOpacity.initialValue );

				}


			},

		}, 'defaultF' );
		dat.controllerNameAndTitle( cRestoreDefaultLocalPosition, lang.defaultButton, lang.defaultLocalPositionTitle );

	}
	/*Пока что не требуется
	this.addControllers = function ( group ) {

		for ( var i = 0; i < group.children.length; i++ ) {

			var mesh = group.children[i];
			if ( mesh instanceof THREE.Group )
				continue;
			this.addMesh( mesh );

		}
		this.addPointControllers();

	}
	*/
	this.getFrustumPoints = function () { return cFrustumPoints; }
	this.windowRange = function ( options ) {

		pointLight1.windowRange( options.scales );
		pointLight2.windowRange( options.scales );

		controllerX.min( options.scales.x.min );
		controllerX.max( options.scales.x.max );
		controllerX.updateDisplay();

		controllerY.min( options.scales.y.min );
		controllerY.max( options.scales.y.max );
		controllerY.updateDisplay();

		controllerZ.min( options.scales.z.min );
		controllerZ.max( options.scales.z.max );
		controllerZ.updateDisplay();

		if ( controllerW !== undefined ) {

			controllerW.min( options.scales.w.min );
			controllerW.max( options.scales.w.max );
			controllerW.updateDisplay();

		}

	}
	return this;

}

/**
 * gets the position from the geometry.attributes.position of the object.
 * @param {THREE.Mesh} object
 * @param {number} index index of position in the object.geometry.attributes.position
 * @returns position
 */
function getObjectLocalPosition( object, index ) {

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
	function getPosition( object, pos ) {

		var position = new THREE.Vector3(),
			positionAngle = new THREE.Vector3();
		position = pos.clone();
		//position.multiply( new THREE.Vector4(0,0,0,0) );
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
		
	} while ( object );
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
