/**
 * @module MyPoints
 * @description Array of my points.
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

import Player from '../player/player.js';
import getShaderMaterialPoints from '../getShaderMaterialPoints/getShaderMaterialPoints.js';
import three from '../three.js'
//import setOptions from '../setOptions.js'
import Options from '../Options.js'

/**
 * Creating the new [THREE.Points]{@link https://threejs.org/docs/index.html?q=poi#api/en/objects/Points} and adding it into group.
 * @param {array} arrayFuncs <b>points.geometry.attributes.position</b> array.
 * See <b>arrayFuncs</b> parametr of the <a href="../../player/jsdoc/module-Player-Player.getPoints.html" target="_blank">Player.getPoints(...)</a> for details.
 * @param {THREE.Group} group [Group]{@link https://threejs.org/docs/index.html?q=grou#api/en/objects/Group} for new points.
 * @param {object} [settings] the following settings are available
 * @param {object|Options} [settings.options=new Options()] the following options are available.
 * See the <b>options</b> parameter of the <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
 * @param {Object} [settings.options.point] point options.
 * See <a href="../../jsdoc/setOptions/SetOptions.html#setPoint" target="_blank">setOptions.setPoint(options)</a> for details.
 * @param {object} [settings.options.scales.w] followed w axis scale params is available
 * @param {object} [settings.options.scales.w.min=0] Minimal range of the [color palette]{@link https://github.com/anhr/commonNodeJS/tree/master/colorpicker}.
 * @param {object} [settings.options.scales.w.max=100] Maximal range of the [color palette]{@link https://github.com/anhr/commonNodeJS/tree/master/colorpicker}.
 * @param {object} [settings.options.palette=new ColorPicker.palette();//palette: ColorPicker.paletteIndexes.BGRW] See <a href="../../colorPicker/jsdoc/module-ColorPicker.html#~Palette" target="_blank">ColorPicker.palette</a>.
 * <pre>
 * Example:
 * <b>new ColorPicker.palette( { palette: ColorPicker.paletteIndexes.bidirectional } );</b>
 * </pre>
 * @param {GuiSelectPoint} [settings.options.guiSelectPoint] A [dat.gui]{@link https://github.com/anhr/dat.gui} based graphical user interface for select a point from the mesh.
 * See <a href="../../guiSelectPoint/jsdoc/index.html" target="_blank">GuiSelectPoint</a> for details.
 * @param {object} [settings.options.raycaster] Followed [raycaster]{@link https://threejs.org/docs/index.html#api/en/core/Raycaster} options is available.
 * @param {Function(particle)} [settings.options.raycaster.addParticle] Callback function that take as input the <b>new THREE.Points</b>.
 * Add new particle into array of objects to check for intersection with the ray. See [THREE.Raycaster.intersectObject]{@link https://threejs.org/docs/index.html#api/en/core/Raycaster.intersectObject} for details.
 * @param {Function(particle)} [settings.options.raycaster.removeParticle] Callback function that take as input the <b>new THREE.Points</b>.
 * Remove particle from array of objects to check for intersection with the ray. See [THREE.Raycaster.intersectObject]{@link https://threejs.org/docs/index.html#api/en/core/Raycaster.intersectObject} for details.
 * @param {Function(intersection, mouse)} [settings.options.raycaster.onIntersection] Callback function that take as input the <b>[intersectObject]{@link https://threejs.org/docs/index.html#api/en/core/Raycaster.intersectObject}</b>, and <b>mouse position</b>.
 * Fires after intersection of the mouse pointer with a point.
 * @param {Function()} [settings.options.raycaster.onIntersectionOut] Callback function.
 * Fires if mouse pointer leaves of intersection with the point.
 * @param {Function(intersection)} [settings.options.raycaster.onMouseDown] Callback function that take as input the <b>[intersectObject]{@link https://threejs.org/docs/index.html#api/en/core/Raycaster.intersectObject}</b>.
 * User has clicked over point.
 * @param {object} [settings.pointsOptions={}] followed points options is availablee:
 * @param {FrustumPoints} [settings.pointsOptions.frustumPoints] Include this points into array of points with cloud. See <a href="../../frustumPoints/jsdoc/index.html" target="_blank">FrustumPoints</a>.
 * @param {number} [settings.pointsOptions.tMin=0] start time. Uses for playing of the points..
 * @param {string} [settings.pointsOptions.name=""] Name of the points. Used for displaying of items of the <b>Select</b> drop down control of the <b>Meshes</b> folder of the [dat.gui]{@link https://github.com/anhr/dat.gui}.
 * @param {object|boolean} [settings.pointsOptions.shaderMaterial] creates the [THREE.Points]{@link https://threejs.org/docs/index.html?q=poi#api/en/objects/Points} with [THREE.ShaderMaterial]{@link https://threejs.org/docs/index.html#api/en/materials/ShaderMaterial} material.
 * The size of the each point of the <b>THREE.Points</b> seems the same on canvas
 * because I reduce the size of the points closest to the camera and increase the size of the points farthest to the camera.
 * <p>false - no shaderMaterial.
 * @param {object} [settings.pointsOptions.shaderMaterial.point]
 * @param {number} [settings.pointsOptions.shaderMaterial.point.size] point size.
 * @param {THREE.Vector3} [settings.pointsOptions.position=new THREE.Vector3( 0, 0, 0 )] position of the points.
 * <pre>
 * Vector's x, y, z is position of the points.
 * Can be as:
 * float - position of the points.
 * [float] - array of positions of the points.
 * Function - position of the points is function of the t. Example:
 *	<b>new Function( 't', 'return 0.1 + t' )</b>
 * </pre>
 * Example:
 * <b>new THREE.Vector3 ( new Function( 't', 'return t' ), 0, 0)</b>
 * @param {THREE.Vector3} [settings.pointsOptions.scale=new THREE.Vector3( 1, 1, 1 )] scale of the points.
 * <pre>
 * Vector's x, y, z is scale of the points.
 * Can be as:
 * float - scale of the points.
 * [float] - array of scales of the points.
 * Function - scale of the points is function of the t. Example:
 *	<b>new Function( 't', 'return 1.1 + t' )</b>
 * </pre>
 * Example:
 * <b>new THREE.Vector3 ( new Function( 't', 'return 1 + t' ), 1, 1)</b>
 * @param {THREE.Vector3} [settings.pointsOptions.rotation=new THREE.Vector3( 0, 0, 0 )] rotation of the points.
 * <pre>
 * Vector's x, y, z is rotation of the points.
 * Can be as:
 * float - rotation of the points.
 * [float] - array of rotations of the points.
 * Function - rotation of the points is function of the t. Example:
 *	<b>new Function( 't', 'return Math.PI / 2 + t * Math.PI * 2' )</b>
 * </pre>
 * Example:
 * <b>new THREE.Vector3 ( new Function( 't', 'return Math.PI / 2 + t * Math.PI * 2' ), 0, 0)</b>
 * @param {boolean} [settings.pointsOptions.opacity] if true then opacity of the point is depend from distance to all meshes points from the group with defined <b>mesh.userData.cloud</b>.
 * See <b>optionsColor.opacity</b> parameter of the <a href="../../player/jsdoc/module-Player-Player.getColors.html" target="_blank">Player.getColors(...)</a>ions.getColors for details.
 * @param {function(THREE.Points)} [settings.pointsOptions.onReady] Callback function that take as input the <b>new THREE.Points</b>.
 * Fires after creating of the points.
 */
function MyPoints( arrayFuncs, group, settings ) {

	//	Player.setTHREE( THREE );
	const THREE = three.THREE;
	
	if ( ( typeof arrayFuncs !== 'function' ) && ( arrayFuncs.length === 0 ) )
		arrayFuncs.push( new THREE.Vector3() );

	settings = settings || {};
//	settings.Player = settings.Player || Player;

	const pointsOptions = settings.pointsOptions || {};
//	settings.options = settings.options || ( pointsOptions.frustumPoints ? pointsOptions.frustumPoints.getOptions() : new Options() );
	settings.options = settings.options || new Options();
	var options = settings.options;// || {};
	if ( !options.boOptions ) {

		options = new Options( options );
/*
		console.error( 'MyPoints: call options = new Options( options ) first' );
		return;
*/		

	}
//	setOptions.setPoint( options );
/*Убрал потому что когда нет AxesHelper и не запущен Player и пользователь навел мышку на точку
то в текстовой строке не отобрахаются x, y, z.
Это сделано на тот случай, когда в AxesHelper отображаются не все координаты
Для решения проблемы решил вообще не создавть options.scales без AxesHelper,
что будет означать что надо выводить все x, y, z для точки, на которую наведена мышка
	options.scales = options.scales || {};
	options.scales.w = options.scales.w || {};
	if ( options.scales.w.min === undefined ) options.scales.w.min = 0;
	if ( options.scales.w.max === undefined ) options.scales.w.max = 100;
*/	

/*
	if ( !options.palette && pointsOptions.frustumPoints )
		options.palette = pointsOptions.frustumPoints.getOptions().palette;
*/
	pointsOptions.tMin = pointsOptions.tMin || 0;
	pointsOptions.name = pointsOptions.name || '';
	pointsOptions.position = pointsOptions.position || new THREE.Vector3( 0, 0, 0 );
	pointsOptions.scale = pointsOptions.scale || new THREE.Vector3( 1, 1, 1 );
	pointsOptions.rotation = pointsOptions.rotation || new THREE.Vector3();
	pointsOptions.group = group;

	//Эту строку нужно вызывать до создания точек THREE.Points
	//что бы вызывалась моя версия THREE.BufferGeometry().setFromPoints для создания geometry c itemSize = 4
	//потому что в противном случае при добавлени этих точек в FrustumPoints.pushArrayCloud() координата w будет undefined
	Player.assign();
//	settings.Player.assign();

	if ( pointsOptions.shaderMaterial !== false )
		getShaderMaterialPoints( group, arrayFuncs,// Player,
			function ( points ) {

				Points( points );

			}, {

//			Player: settings.Player,
//			Player: Player,
			options: options,
			pointsOptions: pointsOptions,

		} );
	else {

		const points = new THREE.Points(

			typeof arrayFuncs === 'function' ? arrayFuncs() :
//				new THREE.BufferGeometry().setFromPoints( settings.Player.getPoints( arrayFuncs,
				new THREE.BufferGeometry().setFromPoints( Player.getPoints( arrayFuncs,
					{ options: options, group: group, t: pointsOptions.tMin } ), 4 ),
			new THREE.PointsMaterial( { size: options.point.size / options.point.sizePointsMaterial, vertexColors: THREE.VertexColors } )

		);
		if ( pointsOptions.frustumPoints )
			points.userData.cloud = {

				indexArray: pointsOptions.frustumPoints.pushArrayCloud( points.geometry ),//индекс массива точек в FrustumPoints.arrayCloud которые принадлежат этому points

			}
/*
		if ( pointsOptions.frustumPoints )
			points.userData.cloud = {

				indexArray: pointsOptions.frustumPoints.pushArrayCloud( points.geometry ),//индекс массива точек в FrustumPoints.arrayCloud которые принадлежат этому points

			}
*/
		points.geometry.setAttribute( 'color',
//			new THREE.Float32BufferAttribute( settings.Player.getColors( arrayFuncs,
			new THREE.Float32BufferAttribute( Player.getColors( arrayFuncs,
				{

					positions: points.geometry.attributes.position,
					options: options,
/*
					scale: options.scales ? options.scales.w : { min: 0, max: 100 },
					palette: options.palette,
*/					

				} ), 4 ) );
		Points( points );

	}
	function Points( points ) {
		
		points.name = pointsOptions.name;//'Wave';
		if ( pointsOptions.pointIndexes !== undefined )
			points.userData.pointIndexes = function ( pointIndex ) { return pointsOptions.pointIndexes( pointIndex ); }
		if ( pointsOptions.pointName !== undefined )
			points.userData.pointName = function ( pointIndex ) { return pointsOptions.pointName( pointIndex ); }
		if ( pointsOptions.controllers !== undefined ) {

			points.userData.addControllers = pointsOptions.addControllers;
			points.userData.controllers = function ( /*cFrustumPoints*/ ) { return pointsOptions.controllers( /*cFrustumPoints*/ ); }

		}
		points.userData.raycaster = {

			onIntersection: function ( intersection, mouse ) {

				if ( options.raycaster && options.raycaster.onIntersection )
					options.raycaster.onIntersection( intersection, mouse, points.parent );

			},
			onIntersectionOut: function () {

				if ( options.raycaster && options.raycaster.onIntersectionOut )
					options.raycaster.onIntersectionOut();

			},
			onMouseDown: function ( intersection ) {

				if ( options.raycaster && options.raycaster.onMouseDown )
					options.raycaster.onMouseDown( intersection, options );
				else Options.raycaster.onMouseDown( intersection, options );
/*				
				if ( ( intersection.object.userData.isInfo !== undefined ) && !intersection.object.userData.isInfo() )
					return;//No display information about frustum point
				if ( options.guiSelectPoint )
					options.guiSelectPoint.select( intersection );
				else if ( options.axesHelper )
					options.axesHelper.exposePosition( intersection );
				if ( options.raycaster.onMouseDown )
					options.raycaster.onMouseDown( intersection );
*/
			}

		}
		points.userData.player = {

			arrayFuncs: arrayFuncs,
			selectPlayScene: function ( t ) {

				setPositions( t );
				setScales( t );
				setRotations( t );

			}

		}
		function setPositions( t ) {

			t = t || pointsOptions.tMin;
			function setPosition( axisName ) {

				points.position[axisName] = typeof pointsOptions.position[axisName] === "function" ?
					pointsOptions.position[axisName]( t, options.a, options.b ) :
					pointsOptions.position[axisName];

			}
			setPosition( 'x' );
			setPosition( 'y' );
			setPosition( 'z' );

		}
		setPositions();
		function setScales( t ) {

			t = t || pointsOptions.tMin;
			function setScale( axisName ) {

				points.scale[axisName] = typeof pointsOptions.scale[axisName] === "function" ?
					pointsOptions.scale[axisName]( t, options.a, options.b ) :
					pointsOptions.scale[axisName];

			}
			setScale( 'x' );
			setScale( 'y' );
			setScale( 'z' );

		}
		setScales();
		function setRotations( t ) {

			t = t || pointsOptions.tMin;
			function setRotation( axisName ) {

				points.rotation[axisName] = typeof pointsOptions.rotation[axisName] === "function" ?
					pointsOptions.rotation[axisName]( t, options.a, options.b ) :
					pointsOptions.rotation[axisName];
				while ( points.rotation[axisName] < 0 ) points.rotation[axisName] += Math.PI * 2;
				while ( points.rotation[axisName] > Math.PI * 2 ) points.rotation[axisName] -= Math.PI * 2

			}
			setRotation( 'x' );
			setRotation( 'y' );
			setRotation( 'z' );

		}
		setRotations();
		group.add( points );

		if ( pointsOptions.boFrustumPoints ) points.userData.boFrustumPoints = pointsOptions.boFrustumPoints;
		
		if ( pointsOptions.onReady !== undefined )
			pointsOptions.onReady( points );

/*если оставить эти строки то в guiSelectPoint будут добавляться точки даже если этого не хочет программист			
		if ( options.guiSelectPoint )
			options.guiSelectPoint.addMesh( points );
*/			
		if ( !points.userData.boFrustumPoints && options.raycaster && options.raycaster.addParticle )
			options.raycaster.addParticle( points );

	}

}
/* *
 * Pushes to clouds array all points from geometry
 * @function MyPoints.
 * pushArrayCloud
 * @param {THREE} THREE {@link https://github.com/anhr/three.js|THREE}
 * @param {array} arrayCloud
 * @param {THREE.BufferGeometry} geometry
 * @returns index of the new array item
 */
/*See FrustumPoints.pushArrayCloud
MyPoints.pushArrayCloud = function( THREE, arrayCloud, geometry ) {

	if ( arrayCloud === undefined ) {

		console.error( 'pushArrayCloud function failed! arrayCloud = ' + arrayCloud );
		return;

	}

	//Массив точек, имеющих облако params.arrayCloud, разбил на группы points
	//В каждой группе points содержатся все точки, из одного mesh
	//Это сделал потому что если одновременно имеются точки с 
	// shaderMaterial и без shaderMaterial, то порядок добавления точек в params.arrayCloud
	// Не совпадает с порядком расположения mesh в group
	// потому что точки без shaderMaterial добавляются сразу после создания
	// а точки с shaderMaterial добаляются только после вызова loadShaderText в function getShaderMaterialPoints
	var index = arrayCloud.getCloudsCount(),
		points = [];
	arrayCloud.push( points );
	for ( var i = 0; i < geometry.attributes.position.count; i++ )
		points.push( new THREE.Vector4().fromArray( geometry.attributes.position.array, i * geometry.attributes.position.itemSize ) );
	return index;

}
*/
export default MyPoints;
