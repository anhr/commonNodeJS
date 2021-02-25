/**
 * @module myThreejs
 * 
 * @description I use myThreejs in my projects for displaying of my 3D objects in the canvas.
 * 
 * @author [Andrej Hristoliubov]{@link https://anhr.github.io/AboutMe/}
 *
 * @copyright 2011 Data Arts Team, Google Creative Lab
 *
 * @license under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */

import loadScript from '../loadScriptNodeJS/loadScript.js';

import loadFile from '../loadFileNodeJS/loadFile.js';

//https://threejs.org/docs/#manual/en/introduction/Import-via-modules
//import * as THREE from '../../three.js/dev/build/three.module.js';
//import * as THREE from 'https://threejs.org/build/three.module.js';
//import { THREE, OrbitControls, StereoEffect, AxesHelper, AxesHelperOptions, SpriteText, SpriteTextGui } from './three.js';
import { THREE, OrbitControls, StereoEffect, AxesHelper, AxesHelperGui, SpriteText, SpriteTextGui } from './three.js';

//import { GUI } from '../../three.js/dev/examples/jsm/libs/dat.gui.module.js';
import { dat } from '../dat/dat.module.js';

//import cookie from 'https://raw.githack.com/anhr/cookieNodeJS/master/cookie.js';
//import cookie from 'https://raw.githack.com/anhr/commonNodeJS/master/cookieNodeJS/cookie.js';
import cookie from '../cookieNodeJS/cookie.js';

import { getLanguageCode } from '../lang.js';
//import { getLanguageCode } from 'https://raw.githack.com/anhr/commonNodeJS/master/lang.js';

//import CanvasMenu from 'https://raw.githack.com/anhr/commonNodeJS/master/canvasMenu/canvasMenu.js';
import CanvasMenu from '../canvasMenu/canvasMenu.js';

import { FrustumPoints, cFrustumPointsF } from '../frustumPoints/frustumPoints.js';

//import Player from './player.js';
import Player from '../player/player.js';
Player.setTHREE( THREE );

//import OrbitControlsGui from 'http://localhost/anhr/commonNodeJS/master/OrbitControlsGui.js';
import OrbitControlsGui from '../OrbitControlsGui.js';
//import OrbitControlsGui from 'https://raw.githack.com/anhr/commonNodeJS/master/OrbitControlsGui.js';

//import CameraGui from 'http://localhost/anhr/commonNodeJS/master/CameraGui.js';
import CameraGui from '../CameraGui.js';
//import CameraGui from 'https://raw.githack.com/anhr/commonNodeJS/master/CameraGui.js';

//import AxesHelperGui from '../../commonNodeJS/master/AxesHelperGui.js';
import clearThree from '../clearThree.js';

import ColorPicker from '../colorpicker/colorpicker.js';
//import ColorPicker from 'https://raw.githack.com/anhr/commonNodeJS/master/colorpicker/colorpicker.js';

import PositionController from '../PositionController.js';

import controllerPlay from '../controllerPlay/controllerPlay.js';
//import controllerPlay from 'https://raw.githack.com/anhr/commonNodeJS/master/controllerPlay/controllerPlay.js';

//import ScaleController from '../../commonNodeJS/master/ScaleController.js';

import { GuiSelectPoint, getWorldPosition, getObjectLocalPosition, getObjectPosition } from '../guiSelectPoint/guiSelectPoint.js';
//import { GuiSelectPoint, getWorldPosition } from 'https://raw.githack.com/anhr/commonNodeJS/master/guiSelectPoint/guiSelectPoint.js';

//import { OrbitControls } from '../../three.js/dev/examples/jsm/controls/OrbitControls.js';
//import { myPoints } from './myPoints/myPoints.js';
import MyPoints from '../myPoints/myPoints.js';

import { MoveGroup } from '../MoveGroup.js';

//https://github.com/mrdoob/stats.js/
//import Stats from '../../three.js/dev/examples/jsm/libs/stats.module.js';

var debug = {

	opacity: 1 //непрозрачность frustumPoints

};
/*
var debug = true,
	url = 'localhost/threejs',//'192.168.1.2'//ATTENTION!!! localhost is not available for debugging of the mobile devices
	min = '';//min.
*/
//var palette = new ColorPicker.palette( { palette: ColorPicker.paletteIndexes.bidirectional } );
/*
palette.toColor = function ( value, min, max ) {

	if ( value instanceof THREE.Color )
		return value;
	var c = this.hsv2rgb( value, min, max );
	if ( c === undefined )
		c = { r: 255, g: 255, b: 255 }
	return new THREE.Color( "rgb(" + c.r + ", " + c.g + ", " + c.b + ")" );

}
*/
function arrayContainersF(){

	var array = [];
	this.push = function ( elContainer ) {

		array.push( elContainer );

	};
	this.display = function ( elContainer, fullScreen ) {

		array.forEach( function ( itemElContainer ) {

			itemElContainer.style.display = ( itemElContainer === elContainer ) || ! fullScreen ? 'block' : 'none';

		} );

	}

};
var arrayContainers = new arrayContainersF();

/*
 * if you asynhronous creates two or more myThreejs same time, then you will receive the error message:
 * 
 * Uncaught ReferenceError: WEBGL is not defined
 * 
 * For resolving of the issue I have remembers myThreejs parameters in the arrayCreates
 * and creates next myThreejs only after creating of previous myThreejs.
 */
var arrayCreates = [];

/**
 * @callback createXDobjects
 * @param {THREE.Group} group group of my 3d or 4d objects. [THREE.Group]{@link https://threejs.org/docs/index.html#api/en/objects/Group}
 */

/**
 * Creates new canvas with my 3D objects
 * @param {createXDobjects} createXDobjects callback creates my 3D objects.
 * @param {object} [options] the following options are available:
 * @param {HTMLElement|string} [options.elContainer=document.getElementById( "containerDSE" ) or a div element, child of body] If an HTMLElement, then a HTMLElement, contains a canvas and HTMLElement with id="iframe-goes-in-here" for gui.
 * <pre>
 * If a string, then is id of the HTMLElement.
 * </pre>
 * @param {object} [options.camera] camera
 * @param {THREE.Vector3} [options.camera.position=new THREE.Vector3( 0.4, 0.4, 2 )] camera position.
 * @param {THREE.Vector3} [options.camera.scale=new THREE.Vector3( 1, 1, 1 )] camera scale.
 * @param {object} [options.scene] scene
 * @param {THREE.Vector3} [options.scene.position=new THREE.Vector3( 0, 0, 0 )] scene position.
 * @param {object} [options.orbitControls] use orbit controls allow the camera to orbit around a target. [OrbitControls]{@link https://threejs.org/docs/index.html#examples/en/controls/OrbitControls}
 * @param {boolean} [options.orbitControls.gui=false] true - displays the orbit controls gui.
 * @param {object} [options.axesHelper] add the AxesHelper. Default the axes is not visible.
 * @param {number} [options.axesHelper.dimensions=3] 1 - visualize the X axes
 * <pre>
 * 2 - visualize the X and Y axes
 * 3 - visualize the X, Y and Z axes
 * </pre>
 * @param {number} [options.axesHelper.position] axesHelper position. Default is new THREE.Vector3( 0, 0, 0 )
 * @param {boolean} [options.axesHelperGui=false] true - displays the AxesHelper gui.
 * @param {object} [options.spriteText] spriteText options. See SpriteText options for details. Default undefined.
 * @param {boolean} [options.stereoEffect=false] true - use [StereoEffect]{@link https://github.com/anhr/three.js/blob/dev/examples/js/effects/StereoEffect.js}.
 * @param {boolean} [options.dat=false] true - use dat-gui JavaScript Controller Library. [dat.gui]{@link https://github.com/dataarts/dat.gui}.
 * @param {boolean} [options.canvasMenu=false] true - use my dropdown menu for canvas in my version of [dat.gui]{@link https://github.com/anhr/dat.gui} for playing of 3D objects in my projects.
 * See ..\..\commonNodeJS\master\canvasMenu\canvasMenu.js
 * @param {array} [options.arrayCloud] Array of points with cloud.
 * <pre>
 * If you define the array of points with cloud, then you can define a points with cloud.
 * For example you can define
 * arrayCloud: options.arrayCloud
 * on the params of the getShaderMaterialPoints( params, onReady ) function.
 * Or
 * arrayCloud: options.arrayCloud
 * on the pointsOptions of the myThreejs.points function.
 * Default is undefined
 * </pre>
 * @param {ColorPicker.palette|object} [options.palette=White color of all points] Color of points.
 * <pre>
 * ColorPicker.palette - custom palette
 * object - palette is new ColorPicker.palette( { palette: ColorPicker.paletteIndexes.bidirectional } )
 * </pre>
 * @param {object} [options.player] 3D objects animation. See options.settings param of the [Player]{@link https://raw.githack.com/anhr/commonNodeJS/master/player/jsdoc/module-Player.html}.
 * @param {object} [options.canvas] canvas properties
 * @param {number} [options.canvas.width] width of the canvas
 * @param {number} [options.canvas.height] height of the canvas
 * @param {object} [options.axesHelper.scales] axes scales. See three.js\src\helpers\AxesHelper.js
 * @param {number} [options.a=1] Can be use as 'a' parameter of the Function. See arrayFuncs for details.
 * @param {number} [options.b=0] Can be use as 'b' parameter of the Function. See arrayFuncs for details.
 * @param {boolean} [options.cookie] true - save settings to cookie
 *
 * @param {object} [options.point] point settings. Applies to points with ShaderMaterial.
 * <pre>
 * See [ShaderMaterial]{@link https://threejs.org/docs/index.html#api/en/materials/ShaderMaterial} for details.
 * The size of the point seems constant and does not depend on the distance to the camera.
 * </pre>
 * @param {number} [options.point.size=0.02] The apparent angular size of a point in radians.
 * @param {object} [options.stats] Use JavaScript Performance Monitor. [stats]{@link https://github.com/mrdoob/stats.js/} . Dafault is not defined.
 * @param {object} [options.scales] axes scales. Default is {}
 * @param {boolean} [options.scales.display=false] true - displays the label and scale of the axes.
 * @param {number} [options.scales.precision=4] Formats a scale marks into a specified length.
 *
 * @param {object} [options.scales.x] X axis options.
 * @param {number} [options.scales.x.zoomMultiplier=1.1] zoom multiplier.
 * @param {number} [options.scales.x.offset=0.1] position offset. Default
 * @param {string} [options.scales.x.name="X"] axis name.
 * @param {number} [options.scales.x.min=-1] Minimum range of the x axis.
 * @param {number} [options.scales.x.max=1] Maximum range of the x axis.
 * @param {number} [options.scales.x.marks=5] Number of x scale marks.
 *
 * @param {object} [options.scales.y] Y axis options.
 * @param {number} [options.scales.y.zoomMultiplier=1.1] zoom multiplier.
 * @param {number} [options.scales.y.offset=0.1] position offset.
 * @param {string} [options.scales.y.name="Y"] axis name.
 * @param {number} [options.scales.y.min=-1] Minimum range of the y axis.
 * @param {number} [options.scales.y.max=1] Maximum range of the y axis.
 * @param {number} [options.scales.y.marks=5] Number of y scale marks.
 *
 * @param {object} [options.scales.z] Z axis options.
 * @param {number} [options.scales.z.zoomMultiplier=1.1] zoom multiplier.
 * @param {number} [options.scales.z.offset=0.1] position offset.
 * @param {string} [options.scales.z.name="Z"] axis name.
 * @param {number} [options.scales.z.min=-1] Minimum range of the z axis.
 * @param {number} [options.scales.z.max=1] Maximum range of the z axis.
 * @param {number} [options.scales.z.marks=5] Number of z scale marks.
 *
 * @param {object} [options.scales.w] w axis options.
 * @param {number} [options.scales.w.zoomMultiplier=1.1] zoom multiplier.
 * @param {number} [options.scales.w.offset=0.1] position offset.
 * @param {string} [options.scales.w.name="W"] axis name.
 * @param {number} [options.scales.w.min=-1] Minimum range of the w axis.
 * @param {number} [options.scales.w.max=1] Maximum range of the w axis.
 *
 * @param {object} [options.scales.t={}] Animation time.
 * @param {number} [options.scales.t.zoomMultiplier=2] zoom multiplier.
 * @param {number} [options.scales.t.offset=1] position offset.
 * @param {string} [options.scales.t.name="T"] Time name.
 * @param {number} [options.scales.t.min=0] Animation start time. Default is 0.
 * @param {number} [options.scales.t.max=1] Animation stop time. Default is 1.
 * @param {number} [options.scales.t.marks=2] Number of scenes of 3D objects animation.
 * @param {boolean} [options.scales.t.repeat=false] true - Infinite repeat of animation.
 *
 * @todo If you want to use raycaster (working out what objects in the 3d space the mouse is over) [Raycaster]{@link https://threejs.org/docs/index.html#api/en/core/Raycaster},
 * <pre>
 * please add following object into your 3D Object userdata:
 * your3dObject.userData.raycaster = {

		onIntersection: function ( raycaster, intersection, scene, INTERSECTED ) {

			//Mouse is over of your 3D object event
			//TO DO something
			//For example you can use
			options.raycaster.onIntersection( intersection, scene );
			//for displaying of the position of your 3D object
			//ATTENTION!!! Use onIntersection and onIntersectionOut togethe!

		},
		onIntersectionOut: function ( scene, INTERSECTED ) {

			//Mouse is out of your 3D object event
			//TO DO something
			//For example you can use
			options.raycaster.onIntersectionOut( scene );
			//for hide of the position of your 3D object that was displayed in onIntersection
			//ATTENTION!!! Use onIntersection and onIntersectionOut togethe!

		},
		onMouseDown: function ( raycaster, intersection, scene ) {

			//User has clicked over your 3D object
			//TO DO something
			//For example:
			var position = raycaster.stereo.getPosition( intersection );
			alert( 'You are clicked the "' + intersection.object.type + '" type object.'
				+ ( intersection.index === undefined ? '' : ' Index = ' + intersection.index + '.' )
				+ ' Position( x: ' + position.x + ', y: ' + position.y + ', z: ' + position.z + ' )' );

		},

	}
 * </pre>
 * [Example]{@link https://raw.githack.com/anhr/myThreejs/master/Examples/html/}
 */
export function create( createXDobjects, options ) {

	var myThreejs = this;

	arrayCreates.push( {

		createXDobjects: createXDobjects,
		options: options,

	} );
	if ( arrayCreates.length > 1 )
		return;

	options = options || {};

	options.camera = options.camera || {};
	options.camera.position = options.camera.position || new THREE.Vector3( 0.4, 0.4, 2 );
	options.camera.scale = options.camera.scale || new THREE.Vector3( 1, 1, 1 );

	if ( options.cookie === undefined )
		options.cookie = new cookie.defaultCookie();
	else options.cookie = cookie;

	if ( options.palette !== undefined )
	{

		if ( options.palette instanceof ColorPicker.palette === false ) {

			options.palette = new ColorPicker.palette( { palette: ColorPicker.paletteIndexes.bidirectional } );
			ColorPicker.palette.setTHREE( THREE );

		}

	} else options.palette = { toColor: function () { return new THREE.Color( 0xffffff ) } }//white

	if ( options.arrayCloud !== undefined ) {

		options.arrayCloud.getCloudsCount = function() {

			var count = 0;
			for ( var i = 0; i < options.arrayCloud.length; i++ ) {

				var arrayVectors = options.arrayCloud[i];
				count += arrayVectors.length;

			}
			return count;

		}
		options.arrayCloud.cFrustumPointsF = cFrustumPointsF;

	}
	options.a = options.a || 1;
	options.b = options.b || 0;

	options.scale = 1;

	options.point = options.point || {};
	options.point.size = options.point.size || 5.0;

	options.scales = options.scales || {};
	function getAxis( axix, name, min, max ) {

		//axix = axix || {};
		if ( axix ) {

			axix.name = axix.name || name;
			axix.min = axix.min !== undefined ? axix.min : min === undefined ? - 1 : min;
			axix.max = axix.max !== undefined ? axix.max : max === undefined ?   1 : max;

		}
		return axix;

	}
	options.scales.x = getAxis( options.scales.x, 'X' );
	options.scales.y = getAxis( options.scales.y, 'Y' );
	options.scales.z = getAxis( options.scales.z, 'Z' );
	if ( !options.scales.x && !options.scales.y && !options.scales.z )
		console.warn( 'myThreejs.create: scales is undefined.' );
	if ( options.scales.w === undefined )
		options.scales.w = { name: 'W', min: -1, max: 1 };
	options.scales.w = getAxis( options.scales.w, 'W', options.scales.w.min, options.scales.w.max );
	function getCanvasName() {
		return typeof options.elContainer === "object" ?
			options.elContainer.id :
			typeof options.elContainer === "string" ?
				options.elContainer :
				'';
	}

	var camera, group, scene, canvas;

	function onloadScripts() {

		var elContainer = options.elContainer === undefined ? document.getElementById( "containerDSE" ) :
			typeof options.elContainer === "string" ? document.getElementById( options.elContainer ) : options.elContainer;
		if ( elContainer === null ) {

			if( typeof options.elContainer === "string" )
				console.warn( 'The ' + options.elContainer + ' element was not detected.' );
			elContainer = document.createElement( 'div' );
			document.querySelector( 'body' ).appendChild( elContainer );

		}
		arrayContainers.push( elContainer );
//		elContainer.innerHTML = loadFile.sync( '/anhr/myThreejs/master/canvasContainer.html' );
		elContainer.innerHTML = loadFile.sync( '/anhr/commonNodeJS/master/myThreejs/canvasContainer.html' );
		elContainer = elContainer.querySelector( '.container' );


		//ось z смотрит точно на камеру
		//camera.rotation = 0
		//Камера не повернута
		//camera.position.x = 0;
		//camera.position.y = 0;
		//camera.position.z = 2;
		//options.camera.position = new THREE.Vector3( 0, 0, 2 );

		//ось x смотрит точно на камеру
		//camera.rotation.x = 0
		//camera.rotation.y = 1.5707963267948966 = PI / 2 = 90 degrees
		//camera.rotation.z = 0
		//Поворот камеры по оси y на 90 градусов
		//camera.position.x = 2;
		//camera.position.y = 0;
		//camera.position.z = 0;
//		options.camera.position = new THREE.Vector3( 2, 0, 0 );
																	
		var renderer,

			cursor,//default

			controls, stereoEffect, player, frustumPoints,

			mouseenter = false,//true - мышка находится над gui или canvasMenu
			//В этом случае не надо обрабатывать событие elContainer 'pointerdown'
			//по которому выбирается точка на canvas.
			//В противном случае если пользователь щелкнет на gui, то он может случайно выбрать точку на canvas.
			//Тогда открывается папка Meshes и все органы управления сдвигаются вниз. Это неудобно.
			//И вообще нехорошо когда выбирается точка когда пользователь не хочет это делать.

			canvasMenu, raycaster = new THREE.Raycaster(), INTERSECTED = [], scale = options.scale, axesHelper, colorsHelper = 0x80, fOptions,
			gui, rendererSizeDefault, cameraPosition,// fullScreen,

			//point size
			pointSize, defaultPoint = {},// defaultSize,

			stats,

			//uses only if stereo effects does not exists
			mouse = new THREE.Vector2(), intersects,

			//https://www.khronos.org/webgl/wiki/HandlingContextLost
			requestId,// gl, tex;

			cFrustumPoints;

		canvas = elContainer.querySelector( 'canvas' );
		//https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/webglcontextlost_event
		const gl = canvas.getContext( 'webgl' );

		//raycaster

		elContainer.addEventListener( 'mousemove', onDocumentMouseMove, false );

		//ATTENTION!!! The 'mousedown' event is not fired if you use new version of the OrbitControls.
		//See "OrbitControls: Implement Pointer events." commit https://github.com/mrdoob/three.js/commit/1422e36e9facbdc5f9d86cf6b97b005a2723a24a#diff-3285de3826a51619836a5c9adc6bee74
		//elContainer.addEventListener( 'mousedown', onDocumentMouseDown, { capture: true } );
		elContainer.addEventListener( 'pointerdown', onDocumentMouseDown, { capture: true } );

		function isFullScreen() {

			return canvasMenu.isFullScreen();

		}
		//https://www.khronos.org/webgl/wiki/HandlingContextLost


		if ( typeof WebGLDebugUtils !== 'undefined' )
			canvas = WebGLDebugUtils.makeLostContextSimulatingCanvas( canvas );

		//https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/webglcontextlost_event
		canvas.addEventListener( "webglcontextlost", function ( event ) {

			event.preventDefault();
			if ( requestId !== undefined )
				window.cancelAnimationFrame( requestId );
			else console.error( 'myThreejs.create.onloadScripts: requestId = ' + requestId );
			clearThree( scene );
			raycaster = undefined;
			rendererSizeDefault.onFullScreenToggle( true );
			alert( lang.webglcontextlost );

		}, false );
		canvas.addEventListener( "webglcontextrestored", function () {

			console.warn( 'webglcontextrestored' );
			init();
			animate();

		}, false );

		//

		init();
		animate();

		function init() {

			var optionsScene = { position: new THREE.Vector3() }

			// CAMERA

			camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
			camera.position.copy( options.camera.position );
			camera.scale.copy( options.camera.scale );
			options.point.sizePointsMaterial = 100;//size of points with material is not ShaderMaterial is options.point.size / options.point.sizePointsMaterial

			// SCENE

			scene = new THREE.Scene();
			scene.background = new THREE.Color( 0x000000 );
			scene.fog = new THREE.Fog( 0x000000, 250, 1400 );

			//

			renderer = new THREE.WebGLRenderer( {

				antialias: true,
				canvas: canvas,

			} );
//			renderer.setPixelRatio( window.devicePixelRatio );
			options.renderer = renderer;

			//StereoEffect. https://github.com/anhr/three.js/blob/dev/examples/js/effects/StereoEffect.js
			if ( options.stereoEffect ) {

				if ( StereoEffect !== undefined ) {

					var cookieName = getCanvasName();
					stereoEffect = new StereoEffect( THREE, renderer, {

						spatialMultiplex: StereoEffect.spatialMultiplexsIndexs.Mono, //.SbS,
						far: camera.far,
						camera: camera,
						//stereoAspect: 1,
						cookie: options.cookie,
						cookieName: cookieName === '' ? '' : '_' + cookieName,
						elParent: canvas.parentElement,
						rememberSize: true,

					} );
					stereoEffect.options.spatialMultiplex = StereoEffect.spatialMultiplexsIndexs.Mono;

				} else console.warn( 'stereoEffect = ' + stereoEffect );

			} else StereoEffect.setTHREE( THREE );

			//Light

			//A light that gets emitted from a single point in all directions.
			function pointLight() {

				var strLight = 'mathBoxLight',
					light,// = scene.getObjectByName( strLight ),
					position = new THREE.Vector3( 0.5 * options.scale, 0.5 * options.scale, 0.5 * options.scale ), controllers = {},
					multiplier = 2 * options.scale;

				function isLight() {

					return light !== undefined;

				}
				this.add = function ( positionCur ) {

					position = positionCur || position;
					if ( !isLight() ) {

						light = new THREE.PointLight( 0xffffff, 1 );
						light.position.copy( position );
						light.name = strLight;
						scene.add( light );

					}// else console.error( 'duplicate ' + strLight );
					return light;

				};
				this.remove = function () {

					if ( light == undefined )
						return;
					scene.remove( light );
					//delete light;//Parsing error: Deleting local variable in strict mode
					light = undefined;

				};
				this.controls = function ( group, folder, scales, folderName ) {

					if ( folder === undefined )
						return;

					var fLight = folder.addFolder( folderName || lang.light ),
						lightSource;

					//displayLight
					dat.controllerNameAndTitle( fLight.add( { display: false }, 'display' ).onChange( function ( value ) {

						if ( value ) {

							function getPoints( pointVerticesSrc, color ) {

								var geometry = Array.isArray( pointVerticesSrc ) ?
									new THREE.BufferGeometry().setFromPoints( pointVerticesSrc ) : pointVerticesSrc;
								var threshold = 0.05 * options.scale;
								return new THREE.Points( geometry,
									new THREE.PointsMaterial( {

										color: color === undefined ? 0xffffff : color,
										//map: texture,
										size: threshold,
										alphaTest: 0.5

									} ) );

							}
							lightSource = getPoints( [light.position] );
							group.add( lightSource );

						} else {

							group.remove( lightSource );
							//delete lightSource;//Parsing error: Deleting local variable in strict mode
							lightSource = undefined;

						}

					} ), lang.displayLight, lang.displayLightTitle );

					//move light
					function guiLightAxis( axesName ) {

						const scale = scales[axesName];
						if ( !scale )
							return;
						controllers[axesName] =
							fLight.add( light.position, axesName, scale.min * multiplier, scale.max * multiplier )
								.onChange( function ( value ) {

									if ( lightSource === undefined )
										return;

									lightSource.geometry.attributes.position.array[axesId] = value;
									lightSource.geometry.attributes.position.needsUpdate = true;

								} );
						dat.controllerNameAndTitle( controllers[axesName], scale.name );

					}
					guiLightAxis( 'x' );
					guiLightAxis( 'y' );
					guiLightAxis( 'z' );

					var restore = {

						restore: function () {

							controllers[axesEnum.x].setValue( position.x );
							controllers[axesEnum.y].setValue( position.y );
							controllers[axesEnum.z].setValue( position.z );

						}
					};
					dat.controllerNameAndTitle( fLight.add( restore, 'restore' ), lang.defaultButton, lang.restoreLightTitle );

				};
				this.windowRange = function ( scales ) {

					function setLimits( axisId ) {

						var axisName = axesEnum.getName( axisId );
						controllers[axisId].max( scales[axisName].max * multiplier );
						controllers[axisId].min( scales[axisName].min * multiplier );

					}
					setLimits( axesEnum.x );
					setLimits( axesEnum.y );
					setLimits( axesEnum.z );
				}
				return this;

			};
			var pointLight1 = new pointLight();
			pointLight1.add( new THREE.Vector3( 2 * options.scale, 2 * options.scale, 2 * options.scale ) );
			var pointLight2 = new pointLight();
			pointLight2.add( new THREE.Vector3( -2 * options.scale, -2 * options.scale, -2 * options.scale ) );

			//item.material.size is NaN if item.material is ShaderMaterial
			//Влияет только на точки без ShaderMaterial
			raycaster.params.Points.threshold = 0.02;//0.01;
			if ( raycaster.setStereoEffect !== undefined )
				raycaster.setStereoEffect( {

					renderer: renderer,
					camera: camera,
					stereoEffect: stereoEffect,
					raycasterEvents: false,

				} );
			options.raycaster.addParticle = function ( item ) {

				if ( raycaster.stereo !== undefined )
					raycaster.stereo.addParticle( item );

			}
			options.raycaster.removeParticle = function ( item ) {

				if ( raycaster.stereo !== undefined )
					raycaster.stereo.removeParticle( item );

			}

			//

			group = new THREE.Group();
			scene.add( group );

			//dat-gui JavaScript Controller Library
			//https://github.com/dataarts/dat.gui
			if ( ( options.dat !== undefined ) ) {

				if ( gui !== undefined ) {

					for ( var i = gui.__controllers.length - 1; i >= 0; i-- )
						gui.remove( gui.__controllers[i] );
					var folders = Object.keys( gui.__folders );
					for ( var i = folders.length - 1; i >= 0; i-- )
						gui.removeFolder( gui.__folders[folders[i]] );

				} else {

					gui = new dat.GUI( {

						//autoPlace: false,//Убрать скроллинг когда окно gui не влазит в окно браузера
						//closed: true,//Icorrect "Open Controls" button name

					} );
					gui.domElement.addEventListener( 'mouseenter', function ( event ) { mouseenter = true; } );
					gui.domElement.addEventListener( 'mouseleave', function ( event ) { mouseenter = false; } );

				}

				//for debugging
				if ( typeof WebGLDebugUtils !== "undefined" )
					gui.add( {

						loseContext: function ( value ) {

							canvas.loseContext();
							//https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/webglcontextlost_event
							//gl.getExtension( 'WEBGL_lose_context' ).loseContext();

						},

					}, 'loseContext' );

				//Close gui window
				if ( gui.__closeButton.click !== undefined )//for compatibility with Safari 5.1.7 for Windows
					gui.__closeButton.click();

				//Thanks to https://stackoverflow.com/questions/41404643/place-dat-gui-strictly-inside-three-js-scene-without-iframe
				elContainer.querySelector( '#my-gui-container' ).appendChild( gui.domElement );

			}

			//PlayController https://github.com/anhr/controllerPlay. My custom controller in my version of dat.gui https://github.com/anhr/dat.gui for playing of 3D objects in my projects.

			if ( options.player !== undefined ) {

				player = new Player( group, {

					onSelectScene: function ( index, t ) {

						options.boPlayer = true;
//						player.setIndex( index, options.player.name + ': ' + t );
						if ( frustumPoints !== undefined )
							frustumPoints.updateCloudPoints();

					},
					selectPlaySceneOptions: options,
					settings: options.player,
					cameraTarget: { camera: camera, },
//					cookie: options.cookie,
//					cookieName: '_' + getCanvasName(),
					onChangeScaleT: function ( scale ) {

						if ( player !== undefined )
							player.onChangeScale( scale );
/*
						if ( canvasMenu !== undefined )
							canvasMenu.onChangeScale( scale );
*/							
						group.children.forEach( function ( mesh ) {

							if ( ( mesh.userData.player === undefined ) || ( mesh.userData.player.arrayFuncs === undefined ) || ( typeof mesh.userData.player.arrayFuncs === "function" ) )
								return;
							mesh.userData.player.arrayFuncs.forEach( function ( vector ) {

								if ( vector.line === undefined )
									return;
								vector.line.remove();
								vector.line = new Player.traceLine( /*THREE, scene, */options );

							} );

						} );

					},

				} );
				if ( ( gui !== undefined ) && ( typeof controllerPlay !== 'undefined' ) ) {

					controllerPlay.create( player, gui );
/*
					var playController = controllerPlay.create( player, gui );
					gui.add( playController );
*/					

				}

			}
			if ( gui !== undefined ) {

				fOptions = gui.addFolder( lang.settings );
				if ( player !== undefined )
					player.gui( fOptions, {

						getLanguageCode: getLanguageCode,
						cookie: options.cookie,
						cookieName: '_' + getCanvasName(),

					} );

			}

			//Settings for all SpriteText added to scene and child groups
			if ( ( typeof SpriteTextGui !== "undefined" ) && ( fOptions ) )
				SpriteTextGui( SpriteText, fOptions, scene, {

					getLanguageCode: getLanguageCode,
					//settings: { zoomMultiplier: 1.5, },
					cookie: cookie,
					options: {

						//rotation: 0,
						//textHeight: 0.1 * scale,//0.05,
						textHeight: 0.05,

						//Camera frustum vertical field of view, from bottom to top of view, in degrees. Default is 50.
						//Вертикальное поле обзора камеры, снизу вверх, в градусах.
						//Если добавить эту настройку, то видимый размер текста не будет зависить от изменения camera.fov.
						//Тогда textHeight будет вычисляться как options.fov * textHeight / 50
						//Если не определить поле textHeight (см. выше) то textHeight = 0.04,
						fov: camera.fov,

						//sizeAttenuation: false,//true,//Whether the size of the sprite is attenuated by the camera depth. (Perspective camera only.) Default is false.

					}

				} );

			if ( stereoEffect !== undefined ) {

				stereoEffect.gui( fOptions, {

					getLanguageCode: getLanguageCode,
					gui: gui,
					stereoEffect: stereoEffect,
					onChangeMode: function ( mode ) {

						var fullScreen = true;
						switch ( mode ) {

							case StereoEffect.spatialMultiplexsIndexs.Mono:
								fullScreen = false;
								break;
							case StereoEffect.spatialMultiplexsIndexs.SbS:
							case StereoEffect.spatialMultiplexsIndexs.TaB:
								break;
							default: console.error( 'myThreejs: Invalid spatialMultiplexIndex = ' + mode );
								return;

						}
						//rendererSizeDefault.onFullScreenToggle( !fullScreen );

//						canvasMenu.setSpatialMultiplexs( mode );
						if ( frustumPoints !== undefined )
							frustumPoints.setSpatialMultiplexs( mode );

					},

				} );

			}

			if ( options.canvasMenu ) {

				if ( ( canvasMenu === undefined ) ) {

					canvasMenu = new CanvasMenu( renderer, {

						getLanguageCode: getLanguageCode,
						stereoEffect: stereoEffect,
/*
						stereoEffect: stereoEffect === undefined ? stereoEffect :
							{ stereoEffect: stereoEffect, spatialMultiplexsIndexs: StereoEffect.spatialMultiplexsIndexs },
*/							
						player: player,
						fullScreen: {

							camera: camera,
							THREE: THREE,
							onFullScreenToggle: function ( fullScreen ) {

								rendererSizeDefault.onFullScreenToggle( fullScreen );

							},
							onFullScreen: function ( fullScreen, elContainer ) {

								rendererSizeDefault.onFullScreenToggle( !fullScreen );

							},

						},
						onOver: function ( _mouseenter ) {

							mouseenter = _mouseenter;

						},

					} );
					options.canvasMenu = canvasMenu;
//					if ( player ) player.addCanvasMenuItem( canvasMenu );

				} else canvasMenu.setPlayer( player );
/*
				//resize
				renderer.setSizeOld = renderer.setSize;
				renderer.setSize = function ( width, height, updateStyle ) {

					renderer.setSizeOld( width, height, updateStyle );
					const style = {

						height: canvas.style.height,
						width: canvas.style.width,
						left: canvas.style.left,
						top: canvas.style.top,
						position: canvas.style.position,

					}

					//				timeoutControls =
					setTimeout( function () {

						elContainer.style.height = style.height;
						elContainer.style.width = style.width;
						elContainer.style.left = style.left;
						elContainer.style.top = style.top;
						elContainer.style.position = style.position;

						if ( canvasMenu !== undefined )
							canvasMenu.setSize( width, height );

					}, 0 );

				};
				renderer.setSize( ( options.canvas !== undefined ) && ( options.canvas.width !== undefined ) ? options.canvas.width : canvas.clientWidth,
					( options.canvas !== undefined ) && ( options.canvas.height !== undefined ) ? options.canvas.height : canvas.clientHeight );
*/
			}
			renderer.setSize( ( options.canvas !== undefined ) && ( options.canvas.width !== undefined ) ? options.canvas.width : canvas.clientWidth,
				( options.canvas !== undefined ) && ( options.canvas.height !== undefined ) ? options.canvas.height : canvas.clientHeight );

			//use orbit controls allow the camera to orbit around a target. https://threejs.org/docs/index.html#examples/en/controls/OrbitControls
			if ( options.orbitControls ) {

				controls = new OrbitControls( camera, renderer.domElement );
				controls.target.set( scene.position.x * 2, scene.position.y * 2, scene.position.z * 2 );
				controls.saveState();//For reset of the orbitControls settings in the CameraGui and OrbitControlsGui
				controls.update();
				if ( typeof Player !== 'undefined' ) Player.orbitControls = controls;//for cameraTarget
				controls.addEventListener( 'change', function () {

					//console.log( 'controls.target: ' + controls.target.x + ' ' + controls.target.y + ' ' + controls.target.z )
					/*
					console.warn('camera.position = ' + camera.position.x + ' ' + camera.position.y + ' ' + camera.position.z
						+ '\r\ncamera.quaternion = ' + camera.quaternion.x + ' ' + camera.quaternion.y + ' ' + camera.quaternion.z
						+ '\r\ncamera.scale = ' + camera.scale.x + ' ' + camera.scale.y + ' ' + camera.scale.z
						);
					*/

					//change of size of the points if points is not shaderMaterial and if camera is moving
					var vector = new THREE.Vector3();
					vector.copy( camera.position );
					var quaternion = new THREE.Quaternion( -camera.quaternion.x, -camera.quaternion.y, -camera.quaternion.z, camera.quaternion.w );
					vector.applyQuaternion( quaternion );
					options.point.sizePointsMaterial = 200 / vector.z;
					group.children.forEach( function ( mesh ) {

						if ( ( mesh.material !== undefined ) && ( mesh.material.uniforms === undefined ) )
							mesh.material.size = options.point.size / options.point.sizePointsMaterial;

					} );

					if ( frustumPoints !== undefined )
						frustumPoints.onChangeControls();

				} );

			}

			var moveGroup;
			if ( options.moveScene )
				moveGroup = new MoveGroup( scene, {

					scales: options.scales,
					cookie: options.cookie,
					cookieName: getCanvasName(),

				} );

			// helper

			if ( options.axesHelper ) {

				var cookieName = getCanvasName();
				axesHelper = new AxesHelper ( THREE, scene, {

					cookie: options.cookie,
					cookieName: cookieName === '' ? '' : '_' + cookieName,
					//scene: scene,//сцену не вставляю что бы она не записывалась в cookie а то будет переполняться стек.
					scene: { position: scene.position, },
					position: options.axesHelper.position,
					scale: options.axesHelper.scale,
					color: 'rgba(255, 255, 255, 0.5)',
					scales: options.scales,
					dimensions: options.axesHelper.dimensions,

				} );

				optionsScene.position = scene.position;

				if ( controls !== undefined )
					controls.update();//if scale != 1 and position != 0 of the screen, то после открытия canvas положение картинки смещено. Положение восстанавливается только если подвигать мышью
			}
			if ( gui ) {

/*
				function visibleTraceLine( intersection, value, getMesh ) {

					if ( intersection.object.userData.player.arrayFuncs === undefined )
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

//						getObjectPosition( getMesh(), index ),
						getMesh(), index,
//						player.getSelectSceneIndex(),
						color

					);

				}
*/
				var cTrace, intersection;
				options.guiSelectPoint = new GuiSelectPoint( THREE, {

					axesHelper: axesHelper,
					options: options,
					getLanguageCode: getLanguageCode,
					cameraTarget: {

						camera: camera,
						orbitControls: controls,

					},
					setIntersection: function( _intersection ){ intersection = _intersection; },
					//displays the trace of the movement of all points of the mesh
					pointsControls: function( fPoints, dislayEl, getMesh ){

/*						
						const cTraceAll = fPoints.add( { trace: false }, 'trace' ).onChange( function ( value ) {

							var mesh = getMesh();
							mesh.userData.traceAll = value;
							for ( var i = 0; i < mesh.geometry.attributes.position.count; i++ )
								visibleTraceLine( { object: mesh, index: i }, value, getMesh );
							cTrace.setValue( value );

						} );
						dat.controllerNameAndTitle( cTraceAll, lang.trace, lang.traceAllTitle );
						dislayEl( cTraceAll, options.player === undefined ? false : true );
						return cTraceAll;
*/						

					},
					//displays the trace of the point movement
					pointControls: function( fPoint, dislayEl, getMesh ){

/*
						cTrace = fPoint.add( { trace: false }, 'trace' ).onChange( function ( value ) {

							visibleTraceLine( intersection, value, getMesh );

						} );
						dat.controllerNameAndTitle( cTrace, lang.trace, lang.traceTitle );
						dislayEl( cTrace, options.player === undefined ? false : true );
						return cTrace;
*/						

					},

				} );
				options.guiSelectPoint.add( gui );

			}

			defaultPoint.size = options.point.size;

			var pointName = 'Point_' + getCanvasName();
			options.cookie.getObject( pointName, options.point, options.point );

			options.spriteText = options.spriteText || {};

			createXDobjects( group, options );

			if ( options.arrayCloud ) {//Array of points with cloud

				frustumPoints = FrustumPoints.create( camera, controls,// guiSelectPoint
					group, 'FrustumPoints_' + getCanvasName(), stereoEffect ? stereoEffect.options.spatialMultiplex : undefined,
					renderer, options,
					{//points and lines options.Default is { }

						point: {//points options.Default is {}

							size: 0.01,//Size of each frustum point.Default is 0;

						},

						//Stereo options. Available only if user has selected a stereo mode (spatialMultiplex !== spatialMultiplex.Mono)
						stereo: {

							//lines: false, // Display or hide lines between Frustum Points for more comfortable visualisation in the stereo mode.Default is true
							//hide: 10, // Hide the nearby to the camera points in percentage to all points for more comfortable visualisation.Default is 0
							//opacity: 1,//Float in the range of 0.0 - 1.0 indicating how transparent the lines is. A value of 0.0 indicates fully transparent, 1.0 is fully opaque. Default is 0.3

						},

						//

						//zCount: 5,// The count of layers of the frustum of the camera's field of view. Default is 50
						//yCount: 3,// The count of vertical points for each z level of the  frustum of the camera's field of view.. Default is 30

						//изменение размеров усеченной пирамиды FrustumPoints

						near: 10,// Shift of the frustum layer near to the camera in percents.
						//0 percents - no shift.
						//100 percents - ближний к камере слой усеченной пирамиды приблизился к дальнему от камеры слою усеченной пирамиды.
						//Default is 0
						far: 70,// Shift of the frustum layer far to the camera in percents.
						// 0 percents - no shift.
						// 100 percents - дальний от камеры слоем усеченной пирамиды приблизился к ближнему к камере слою усеченной пирамиды.
						// Default is 0
						base: 70,// Scale of the base of the frustum points in percents.
						// 0 base is null
						// 100 no scale
						// Default is 100
						square: true,// true - Square base of the frustum points.Default is false
					},
					options.guiSelectPoint.getFrustumPoints(),
					options.palette
				);
				options.guiSelectPoint.getFrustumPoints().setFrustumPoints( frustumPoints );
				options.arrayCloud.frustumPoints = frustumPoints;

			}
			options.boPlayer = false;
//			player.selectPlayScene( THREE, group, options.player === undefined ? 0 : options.player.min, 0, options );

			//default setting for each 3D object
			group.children.forEach( function ( mesh ) {

				options.saveMeshDefault( mesh );

			} );
			if ( gui !== undefined ) {

				//THREE.AxesHelper gui
				if ( ( options.scene === undefined ) && ( typeof scene !== 'undefined' ) )
					options.scene = scene;
				if ( options.axesHelperGui === true ) {

					AxesHelperGui( axesHelper, fOptions, {

						cookie: options.cookie,
						//cookieName: 'mySettings',
						getLanguageCode: getLanguageCode,

					} );
				}
				if ( options.spriteText && options.spriteText.gui ) {

					SpriteTextGui( gui, group, {

							parentFolder: fOptions,
							getLanguageCode: getLanguageCode,
							cookie: options.cookie,
							options: options.spriteText,

						} );

				}
				if ( moveGroup )
					moveGroup.gui( fOptions, {

						//cookie: options.cookie,
						getLanguageCode: getLanguageCode,
						lang: { moveGroup: lang.moveGroup, }

					} );

				//OrbitControls gui

				if ( ( options.orbitControls !== undefined ) && ( options.orbitControls.gui ) )
					OrbitControlsGui( fOptions, controls, {

						getLanguageCode: getLanguageCode,
						scales: options.scales,

					} );

				//camera gui

				if ( options.cameraGui )
					CameraGui( fOptions, camera, THREE, Player, {

						getLanguageCode: getLanguageCode,
						scales: options.scales,
						orbitControls: controls,

					} );

				// light

				var scales = axesHelper === undefined ? options.scales : axesHelper.options.scales;
				pointLight1.controls( group, fOptions, scales, lang.light + ' 1' );
				pointLight2.controls( group, fOptions, scales, lang.light + ' 2' );

				//point

				function FolderPoint( folder, point, defaultPoint, setSize, PCOptions ) {

					PCOptions = PCOptions || {};

					PCOptions.min = PCOptions.min || 0.01;
					PCOptions.max = PCOptions.max || 1;
					PCOptions.settings = PCOptions.settings || {}; 
					PCOptions.settings.offset = PCOptions.settings.offset || 1;
					PCOptions.step = PCOptions.step || 0.01;

					var fPoint = folder.addFolder( lang.pointSettings ),
						fSize = fPoint.addFolder( lang.size );
					dat.folderNameAndTitle( fSize, lang.size, lang.sizeTitle );
					this.display = function( display ){ fPoint.domElement.style.display = display; }

					fSize.add( new PositionController( function ( shift ) {

						setSize( point.size + shift );

					}, PCOptions//{ offset: 0.01, min: 0.01, max: 0.1, step: 0.01 }
					) );

					//size
					this.size = dat.controllerZeroStep( fSize, point, 'size', function ( value ) {

						setSize( value );

					} );
					dat.controllerNameAndTitle( this.size, lang.size, lang.sizeTitle );

					//point default button
					dat.controllerNameAndTitle( fPoint.add( {

						defaultF: function ( value ) {

							setSize( defaultPoint.size );

						},

					}, 'defaultF' ), lang.defaultButton, lang.defaultPointTitle );

				}
				var folderPoint = new FolderPoint( fOptions, options.point, defaultPoint, function( value ) {

					if ( value === undefined )
						value = options.point.size;
					if ( value < 0 )
						value = 0;
					group.children.forEach( function ( mesh ) {

						if ( ( mesh.type !== 'Points' ) || mesh.userData.boFrustumPoints )
							return;
						if ( mesh.material.uniforms === undefined )
							mesh.material.size = value / options.point.sizePointsMaterial;//PointsMaterial
						else mesh.material.uniforms.pointSize.value = value;//shaderMaterial

					} );
					//					options.point.size = value;
					folderPoint.size.setValue( value );
					options.cookie.setObject( pointName, options.point );

				} )

				//Frustum points
				if ( frustumPoints )
					frustumPoints.gui( fOptions, getLanguageCode, FolderPoint );

				//default button
				dat.controllerNameAndTitle( gui.add( {
					defaultF: function ( value ) {

						controls.target = new THREE.Vector3();
						camera.position.copy( options.camera.position );
						scene.position.copy( optionsScene.position );
						//scene.position.add( options.axesHelper.position );
						scene.position.add( options.scene.position );
						//scene.position.copy( options.scene.position );
						controls.object.position.copy( camera.position );
						controls.update();

					},

				}, 'defaultF' ), lang.defaultButton, lang.defaultTitle );

			}

			//raycaster

			group.children.forEach( function ( item ) {

				if ( item.userData.raycaster !== undefined ) {

					if ( raycaster.stereo !== undefined ) {

						if ( !raycaster.stereo.isAddedToParticles( item ) )//Если добавляются точки myPoints то в них particle уже добавлен
							raycaster.stereo.addParticle( item );

					}

				}

			} );
			function getRendererSize() {

				var style = {

					position: renderer.domElement.style.position,
					left: renderer.domElement.style.left,
					top: renderer.domElement.style.top,
					width: renderer.domElement.style.width,
					height: renderer.domElement.style.height,

				},
					sizeOriginal = new THREE.Vector2();
				renderer.getSize( sizeOriginal );
				return {

					onFullScreenToggle: function ( fs ) {

						arrayContainers.display( elContainer.parentElement, !fs );//fullScreen );
						//return { renderer: renderer, camera: camera };

					},

				};

			};
			rendererSizeDefault = getRendererSize();

			//https://github.com/mrdoob/stats.js/
			if ( options.stats !== undefined ) {

				try {

					stats = new Stats();
					elContainer.appendChild( stats.dom );

				} catch (e) {


				}

			}

			window.addEventListener( 'resize', onResize, false );

		}
		function onResize() {

			var size;
			if ( isFullScreen() )
				size = new THREE.Vector2( window.innerWidth, window.innerHeight );
			else {

				size = new THREE.Vector2();
				renderer.getSize( size );

			}
			camera.aspect = size.x / size.y;
			camera.updateProjectionMatrix();

			renderer.setSize( size.x, size.y );
/*
			if ( typeof se === 'undefined' )
				renderer.setSize( size.x, size.y );
			else
				stereoEffect.setSize( size.x, size.y );
*/
			if ( frustumPoints !== undefined )
				frustumPoints.update();

		}
		function onDocumentMouseMove( event ) {

			if ( raycaster !== undefined ) {

				if ( raycaster.stereo !== undefined )
					raycaster.stereo.onDocumentMouseMove( event );
				else {

					// Test of the old version of THREE.Raycaster
					event.preventDefault();
					var left = renderer.domElement.offsetLeft,
						top = renderer.domElement.offsetTop,
						size = new THREE.Vector2;
					renderer.getSize( size );
					mouse.x = ( event.clientX / size.x ) * 2 - 1 - ( left / size.x ) * 2;
					mouse.y = -( event.clientY / size.y ) * 2 + 1 + ( top / size.y ) * 2;

				}

			}
			if ( event.buttons != 1 )
				return;

			render();

		}
		function onObjectMouseDown( position, intersection ) {

			if ( ( axesHelper !== undefined ) && ( intersection.object.type === "Points" ) )
				axesHelper.exposePosition( position );
			else alert( 'You are clicked the "' + intersection.object.type + '" type object.'
				+ ( intersection.index === undefined ? '' : ' Index = ' + intersection.index + '.' )
				+ ' Position( x: ' + position.x + ', y: ' + position.y + ', z: ' + position.z + ' )' );

			if ( typeof gui !== 'undefined' )
				console.warn( 'qqq' );

		}
		function onDocumentMouseDown( event ) {

			if ( raycaster === undefined )
				return;

			if ( mouseenter )
				return;

			if ( raycaster.stereo !== undefined ) {

				raycaster.stereo.onDocumentMouseDown( event );
				return;

			}
			raycaster.setFromCamera( mouse, camera );
			intersects = raycaster.intersectObjects( group.children );//particles );
			if ( intersects.length > 0 ) {

				var intersection = intersects[0],
					position = getPosition( intersection );
				onObjectMouseDown( position, intersection );

			}

		}
		function animate() {

			if ( stats !== undefined )
				stats.begin();

			requestId = requestAnimationFrame( animate );

/*			
			if ( player !== undefined )
				player.animate();
*/				
			render();

			if ( stats !== undefined )
				stats.end();

		}
		function render() {

			if ( typeof stereoEffect === 'undefined' )
				renderer.render( scene, camera );
			else stereoEffect.render( scene, camera );
/*
			if ( ( raycaster !== undefined ) && ( raycaster.stereo === undefined ) ) {

				raycaster.setFromCamera( mouse, camera );
				intersects = raycaster.intersectObjects( group.children );//particles );
				if ( intersects.length > 0 ) {

					onIntersection( intersects, mouse );
				} else {

					onIntersectionOut( intersects );
//					options.raycaster.onIntersectionOut();

				}

			}
*/
			if( cameraPosition === undefined )
				cameraPosition = new THREE.Vector3(); 
			if ( pointSize === undefined )
				pointSize = options.point.size;
			if(
				!cameraPosition.equals(camera.position) ||
				( pointSize != options.point.size ) ||
				( ( frustumPoints !== undefined ) && frustumPoints.animate() )
			) {

				cameraPosition.copy( camera.position );
				pointSize = options.point.size;

				group.children.forEach( function ( mesh ) {

					if ( mesh instanceof THREE.Points === false )
						return;

					if ( mesh.geometry.attributes.size === undefined ) {

						mesh.material.size = pointSize / options.point.sizePointsMaterial;
						return;

					}
					if ( options.point.opacity !== undefined )
						mesh.material.uniforms.opacity.value = options.point.opacity;

					//scale
					var scale = myPoints.getGlobalScale( mesh );
					var cameraPosition = new THREE.Vector3( camera.position.x / scale.x, camera.position.y / scale.y, camera.position.z / scale.z );
					scale = ( scale.x + scale.y + scale.z ) / 3;

					//set size of points with ShaderMaterial
					//https://threejs.org/docs/index.html#api/en/materials/ShaderMaterial
					//Example https://threejs.org/examples/?q=points#webgl_custom_attributes_points2

					//points with ShaderMaterial
					for ( var i = 0; i < mesh.geometry.attributes.position.count; i++ ) {

						var position = getObjectPosition( mesh, i ),//getObjectLocalPosition( mesh, i ),
							position3d = new THREE.Vector3( position.x, position.y, position.z ),
							distance = position3d.distanceTo( cameraPosition ),
							y = 1;
						//дальние точки очень маленькие
						//	angle = cameraPosition.angleTo( position3d ),
						//	cameraFov = ( Math.PI / 180 ) * 0.5 * camera.fov,
						//	y = 1 - 0.4 * ( angle / cameraFov );
						
						mesh.geometry.attributes.size.setX( i, Math.tan(

								mesh.userData.shaderMaterial.point !== undefined &&
								mesh.userData.shaderMaterial.point.size !== undefined ?
									mesh.userData.shaderMaterial.point.size : options.point.size
									
							) * distance * scale * y );
						mesh.geometry.attributes.size.needsUpdate = true;

					}


				} );

			}
			if ( options.guiSelectPoint && options.guiSelectPoint.render )
				options.guiSelectPoint.render();

		}

//		var timeoutControls;

		arrayCreates.shift();
		var params = arrayCreates.shift();
		if ( params === undefined )
			return;
		myThreejs.create( params.createXDobjects, params.options );

	}

	var optionsStyle = {

		tag: 'style',

	}

	if ( options.dat !== undefined ) {


		//Thanks to https://stackoverflow.com/a/27369985/5175935
		//Такая же функция есть в frustumPoints.js но если ее использовать то она будет возвращать путь на frustumPoints.js
		const getCurrentScript = function () {

			if ( document.currentScript && ( document.currentScript.src !== '' ) )
				return document.currentScript.src;
			const scripts = document.getElementsByTagName( 'script' ),
				str = scripts[scripts.length - 1].src;
			if ( str !== '' )
				return src;
			//Thanks to https://stackoverflow.com/a/42594856/5175935
			return new Error().stack.match( /(https?:[^:]*)/ )[0];

		};
		//Thanks to https://stackoverflow.com/a/27369985/5175935
		const getCurrentScriptPath = function () {
			const script = getCurrentScript(),
				path = script.substring( 0, script.lastIndexOf( '/' ) );
			return path;
		};
		//console.warn( 'getCurrentScriptPath = ' + getCurrentScriptPath() );
		const currentScriptPath = getCurrentScriptPath();

		loadScript.sync( currentScriptPath + '/../DropdownMenu/styles/gui.css', optionsStyle );

		//for .container class
		loadScript.sync( currentScriptPath + '/../DropdownMenu/styles/menu.css', optionsStyle );

	}

	/**
	 * Save scale, position and rotation to the userData.default of the mesh
	 * @param {any} mesh
	 */
	options.saveMeshDefault = function ( mesh ) {

		mesh.userData.default = mesh.userData.default || {};

		mesh.userData.default.scale = new THREE.Vector3();
		mesh.userData.default.scale.copy( mesh.scale );

		mesh.userData.default.position = new THREE.Vector3();
		mesh.userData.default.position.copy( mesh.position );

		mesh.userData.default.rotation = new THREE.Euler();
		mesh.userData.default.rotation.copy( mesh.rotation );

	}
	options.getPoints = Player.getPoints;
	options.getColors = Player.getColors;
	options.getItemSize = Player.getItemSize;

	//for Raycaster https://threejs.org/docs/index.html#api/en/core/Raycaster
	options.raycaster = {

		/**
		 * Displays a sprite text if you move mouse over an 3D object
		 * @param {object} intersection. See https://threejs.org/docs/index.html#api/en/core/Raycaster.intersectObject for details.
		 * @param {THREE.Scene} scene.
		 * @param {THREE.Vector2} mouse mouse position.
		*/
		//options.addSpriteTextIntersection = function ( intersection, mouse )
		onIntersection: function ( intersection, mouse ) {

			if ( intersection.object.userData.isInfo !== undefined && !intersection.object.userData.isInfo() )
				return;
			var spriteTextIntersection = findSpriteTextIntersection( scene );
/*
			var textColor = 'rgb( 128, 128, 128 )',
				position = getPosition( intersection );
*/
/*
			// Make the spriteText follow the mouse
			//https://stackoverflow.com/questions/36033879/three-js-object-follows-mouse-position
			var vector = new THREE.Vector3( mouse.x, mouse.y, 0 );
			vector.unproject( camera );
			var dir = vector.sub( camera.position ).normalize();
			var pos = camera.position.clone().add( dir.multiplyScalar( 1 ) );

			var parent = intersection.object.parent;
			while ( parent !== null ) {

				pos.sub( parent.position );
				pos.divide( parent.scale );
				parent = parent.parent;

			}
*/
			if ( spriteTextIntersection === undefined ) {

/*
				const isArrayFuncs = ( ( intersection.index !== undefined ) && ( intersection.object.userData.player.arrayFuncs !== undefined ) ),
					funcs = !isArrayFuncs ? undefined : intersection.object.userData.player.arrayFuncs,
					func = ( funcs === undefined ) || ( typeof funcs === "function" ) ? undefined : funcs[intersection.index];
*/
					/*Кажется это устарело. Сейчас имя точки беру из intersection.object.userData.player
					pointName = !isArrayFuncs ?
						undefined :
						intersection.object.userData.pointName === undefined ?
							func === undefined ?
								undefined :
								func.name :
							intersection.object.userData.pointName( intersection.index ),
					*/
//					pointName = intersection.object.userData.player.arrayFuncs[intersection.index].name,
/*
					color = !isArrayFuncs || ( func === undefined ) ?
						undefined :
						Array.isArray( func.w ) ?
							Player.execFunc( func, 'w', group.userData.t, options.a, options.b ) :
							func.w;
*/
/*
				if ( ( color === undefined ) && ( intersection.object.geometry.attributes.ca !== undefined ) ) {

					const vector = new THREE.Vector3().fromArray( intersection.object.geometry.attributes.ca.array, intersection.index * intersection.object.geometry.attributes.ca.itemSize );
					color = new THREE.Color( vector.x, vector.y, vector.z );

				}
*/
//				var cookieName = getCanvasName();

				const rect = options.spriteText.rect ? JSON.parse( JSON.stringify( options.spriteText.rect ) ) : {};
				rect.displayRect = true;
				rect.backgroundColor = 'rgba(0, 0, 0, 1)';
				spriteTextIntersection = StereoEffect.getTextIntersection( intersection, {

					scales: options.scales,
					spriteOptions: {

						textHeight: options.spriteText.textHeight,
						fontColor: options.spriteText.fontColor,
						rect: rect,
						center: {

							camera: camera,
							canvas: canvas,

						}

					}

				} );
/*
				spriteTextIntersection = new SpriteText(
					StereoEffect.getTextIntersection( intersection ),
					pos, {

					textHeight: options.spriteText.textHeight,// || 0.2,
					fontColor: options.spriteText.fontColor,// || textColor,
					rect: rect,
					center: {

						camera: camera,
						canvas: canvas,

					}
					//					center: new THREE.Vector2( screenPos.x < ( canvas.width / 2 ) ? 0 : 1, screenPos.y < ( canvas.height / 2 ) ? 1 : 0 ),

				}
				);
*/
/*
				spriteTextIntersection = new SpriteText(
					( intersection.object.name === '' ? '' : lang.mesh + ': ' + intersection.object.name + '\n' ) +
					( pointName === undefined ? '' : lang.pointName + ': ' + pointName + '\n' ) +
					( !options.scales.x ? '' : options.scales.x.name + ': ' + position.x ) +
					( !options.scales.y ? '' : '\n' + options.scales.y.name + ': ' + position.y ) +
					( !options.scales.z ? '' : '\n' + options.scales.z.name + ': ' + position.z ) +
					(//w
						!isArrayFuncs ?
							'' :
							funcs[intersection.index] instanceof THREE.Vector4 ||
								funcs[intersection.index] instanceof THREE.Vector3 ||
								typeof funcs === "function" ?
								color instanceof THREE.Color ?
									'\n' + lang.color + ': ' + new THREE.Color( color.r, color.g, color.b ).getHexString() :
									'\n' + options.scales.w.name + ': ' + position.w :
								''

					) +
					(//opacity
						( intersection.object.geometry.attributes.ca === undefined ) ||
							( intersection.object.geometry.attributes.ca.itemSize < 4 ) ?
							'' :
							'\n' + lang.opacity + ': ' + new THREE.Vector4().fromArray(

								intersection.object.geometry.attributes.ca.array,
								intersection.index * intersection.object.geometry.attributes.ca.itemSize

							).w
					)
					, pos, {

					textHeight: options.spriteText.textHeight,// || 0.2,
					fontColor: options.spriteText.fontColor,// || textColor,
					rect: rect,
					center : {

						camera: camera,
						canvas: canvas,

					}
//					center: new THREE.Vector2( screenPos.x < ( canvas.width / 2 ) ? 0 : 1, screenPos.y < ( canvas.height / 2 ) ? 1 : 0 ),

				}
				);
*/
				spriteTextIntersection.name = spriteTextIntersectionName;
				spriteTextIntersection.scale.divide( scene.scale );
				scene.add( spriteTextIntersection );

			} else spriteTextIntersection.position.copy( pos );

		},

		/**
		 * Hides a sprite text if you move mouse out an object
		 * @param {THREE.Scene} scene.
		 */
		//options.removeSpriteTextIntersection = function () 
		onIntersectionOut: function () {

			var detected = false;
			do {

				var spriteTextIntersection = findSpriteTextIntersection( scene );
				if ( spriteTextIntersection !== undefined ) {

					scene.remove( spriteTextIntersection );
					if ( detected )
						console.error( 'Duplicate spriteTextIntersection' );
					detected = true;

				}

			} while ( spriteTextIntersection !== undefined )

		}

	}
	onloadScripts();

}
var spriteTextIntersectionName = 'spriteTextIntersection';
function findSpriteTextIntersection( scene ) {

	var spriteTextIntersection;
	scene.children.forEach( function ( item ) {

		if ( ( item.type === "Sprite" ) && ( item.name === spriteTextIntersectionName ) ) {

			spriteTextIntersection = item;
			return;

		}

	} );
	return spriteTextIntersection;

}

//Localization

const lang = {

	defaultButton: 'Default',
	defaultTitle: 'Restore Orbit controls settings.',

//	mesh: 'Mesh',
//	pointName: 'Point Name',
	settings: 'Settings',
	webglcontextlost: 'The user agent has detected that the drawing buffer associated with a WebGLRenderingContext object has been lost.',

	light: 'Light',
	displayLight: 'Display',
	displayLightTitle: 'Display or hide the light source.',
	restoreLightTitle: 'Restore position of the light source',

	pointSettings: 'Point',
	size: 'Size',
	sizeTitle: 'Size of the point with "ShaderMaterial" material',
	defaultPointTitle: 'Restore point.',
/*	
	trace: 'Trace',
	traceTitle: 'Display the trace of the point movement.',
	traceAllTitle: 'Display the trace of the movement of all points of the mesh.',
*/
	opacity: 'Opacity',

};

switch ( getLanguageCode() ) {

	case 'ru'://Russian language
		lang.defaultButton = 'Восстановить';
		lang.defaultTitle = 'Восстановить положение осей координат по умолчанию.';

//		lang.mesh = '3D объект';
//		lang.pointName = 'Имя точки';
		lang.name = 'Имя';
		lang.settings = 'Настройки';
		lang.webglcontextlost = 'Пользовательский агент обнаружил, что буфер рисунка, связанный с объектом WebGLRenderingContext, потерян.';

		lang.light = 'Свет';
		lang.displayLight = 'Показать';
		lang.displayLightTitle = 'Показать или скрыть источник света.';
		lang.restoreLightTitle = 'Восстановить положение источника света';

		lang.pointSettings = 'Точка';
		lang.size = 'Размер';
		lang.sizeTitle = 'Размер точки с материалом типа "ShaderMaterial"';
		lang.defaultPointTitle = 'Восстановить точку';
/*
		lang.trace = 'Трек';
		lang.traceTitle = 'Показать трек перемещения точки.';
		lang.traceAllTitle = 'Показать трек перемещения всех точек выбранного 3D объекта.';
*/
		lang.opacity = 'Непрозрачность';
		break;

}

//for raycaster
function getPosition( intersection ) {

	return getObjectPosition( intersection.object, intersection.index );

}
export { getWorldPosition }
/**
 * Displaying points
 * @param {THREE.Vector4|THREE.Vector3|THREE.Vector2|object|array} arrayFuncs points.geometry.attributes.position array
 * <pre>
 * THREE.Vector4: 4D point.
 * THREE.Vector3: 3D point. w = 1. Default is white color
 * THREE.Vector2: 2D point. w = 1, z = 0. Default is white color
 * Vector's x, y, z, w is position of the point.
 * Can be as:
 * float - position of the point.
 * [float] - array of positions of the point.
 * Function - position of the point is function of the t. Example: new Function( 't', 'a', 'b', 'return Math.sin(t*a*2*Math.PI)*0.5+b' )
 * Vector.w can be as THREE.Color. Example: new THREE.Color( "rgb(255, 127, 0)" )
 * if arrayFuncs.length === 0 then push new THREE.Vector3().
 * 
 * object: {
 *   vector: THREE.Vector4|THREE.Vector3|THREE.Vector2 - point position
 *   name: point name
 *   trace: true - Displays the trace of the point movement. Default is false
 * }
 * or
 * object: {
 *   x: x axis. Defauilt is 0.
 *   y: y axis. Defauilt is 0.
 *   z: z axis. Defauilt is 0.
 *   w: w axis. Defauilt is 0.
 * }
 * 
 * array: [
 *   0: x axis. Defauilt is 0.
 *   1: y axis. Defauilt is 0.
 *   2: z axis. Defauilt is 0.
 *   3: w axis. Defauilt is 0.
 * ]
 * </pre>
 * @param {object} options see myThreejs.create options for details
 * @param {object} [pointsOptions] followed points options is availablee:
 * @param {number} [pointsOptions.tMin] start time. Uses for playing of the points. Default is 0.
 * @param {string} [pointsOptions.name] Name of the points. Used for displaying of items of the Select drop down control of the Meshes folder of the dat.gui. Default is "".
 * @param {object} [pointsOptions.shaderMaterial] creates the THREE.Points with THREE.ShaderMaterial material.
 * <pre>
 * The size of the each point of the THREE.Points seems the same on canvas
 * because I reduce the size of the points closest to the camera and increase the size of the points farthest to the camera.
 * See var shaderMaterialDefault of the frustumPoints for details.
 * </pre>
 * @param {THREE.Vector3} [pointsOptions.position] position of the points. Default is new THREE.Vector3( 0, 0, 0 ).
 * <pre>
 * Vector's x, y, z is position of the points.
 * Can be as:
 * float - position of the points.
 * [float] - array of positions of the points.
 * Function - position of the points is function of the t. Example: new Function( 't', 'return 0.1 + t' )
 * </pre>
 * @param {THREE.Vector3} [pointsOptions.scale] scale of the points. Default is new THREE.Vector3( 1, 1, 1 ).
 * <pre>
 * Vector's x, y, z is scale of the points.
 * Can be as:
 * float - scale of the points.
 * [float] - array of scales of the points.
 * Function - scale of the points is function of the t. Example: new Function( 't', 'return 1.1 + t' )
 * </pre>
 * @param {THREE.Vector3} [pointsOptions.rotation] rotation of the points. Default is new THREE.Vector3( 0, 0, 0 ).
 * <pre>
 * Vector's x, y, z is rotation of the points.
 * Can be as:
 * float - rotation of the points.
 * [float] - array of rotations of the points.
 * Function - rotation of the points is function of the t. Example: new Function( 't', 'return Math.PI / 2 + t * Math.PI * 2' )
 * </pre>
 * @param {array} [pointsOptions.arrayCloud] Array of points with cloud.
 * <pre>
 * If you define the array of points with cloud, then you can define a points with cloud.
 * For example you can define
 * arrayCloud: options.arrayCloud
 * on the params of the getShaderMaterialPoints( params, onReady ) function.
 * Or
 * arrayCloud: options.arrayCloud
 * on the pointsOptions of the myThreejs.points function.
 * Default is undefined
 * </pre>
 * @param {boolean} [pointsOptions.opacity] if true then opacity of the point is depend from distance to all  meshes points from the group with defined mesh.userData.cloud. See options.getColors for details. Default is undefined.
 */
export function points( arrayFuncs, group, options, pointsOptions ) {

//	myPoints.create( arrayFuncs, group, options, pointsOptions);
	MyPoints( THREE, arrayFuncs, group,// Player,
		{ options: options, pointsOptions: pointsOptions } );

}

/*кажктся не используется*
 * Converts the mesh.geometry.attributes.position to mesh.userData.player.arrayFuncs.
 * Used to restore the default point position.
 * @param {THREE.Mesh} mesh
 */
/*
export function setArrayFuncs( mesh ) {

	if ( !mesh.userData.player ) {

		console.error( 'setArrayFuncs(): mesh.userData.player = ' + mesh.userData.player );
		return;

	}
	mesh.userData.player.arrayFuncs = [];//Display the "Restore default local position" button.
	for ( var i = 0; i < mesh.geometry.attributes.position.count; i++ )
		mesh.userData.player.arrayFuncs.push( getObjectLocalPosition( mesh, i ) );

}
*/
/**
 * Limits angles of rotations of the mesh between 0 and 360 degrees.
 * @param {THREE.Euler} rotation angles for limitation
 */
export function limitAngles( rotation ) {

	function limitAngle( axisName ) {

		while ( rotation[axisName] > Math.PI * 2 )
			rotation[axisName] -= Math.PI * 2

	}
	limitAngle( 'x' );
	limitAngle( 'y' );
	limitAngle( 'z' );

}
/**
 * get THREE.Points with THREE.ShaderMaterial material
 * @param {object} params
 * @param {object} params.options see myThreejs.create options for details
 * @param {object} params.pointsOptions see myPoints.create pointsOptions for details
 * @param {number} params.tMin start time. Uses for playing of the points. Default is 0.
 * @param {array} params.arrayFuncs points.geometry.attributes.position array.
 * See https://github.com/anhr/myThreejs#arrayfuncs-item  for details.
 * @param {function(THREE.Points)} onReady Callback function that take as input the new THREE.Points.
 */
export function getShaderMaterialPoints( params ) {

	myPoints.getShaderMaterialPoints( params );
	
}
