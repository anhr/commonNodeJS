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

/**
 * Creating the new points and adding it into group
 * @param {THREE} THREE {@link https://github.com/anhr/three.js|THREE}
 * @param {array} arrayFuncs points.geometry.attributes.position array.
 * See arrayFuncs parametr of the [Player.getPoints(...)]{@link https://raw.githack.com/anhr/commonNodeJS/master/player/jsdoc/module-Player.html#~Player.getPoints} for details.
 * @param {THREE.Group} group Group for new points
 * @param {object} [settings] the following options are available
 * @param {Player} [settings.Player] [Player]{@link https://raw.githack.com/anhr/commonNodeJS/master/player/jsdoc/index.html}.
 * Define Player only if you want move or/and you want change color of the points during playing.
 * @param {object} [settings.options] the following options are available
 * @param {number} [settings.options.point.size=5.0] point size.
 * @param {object} [settings.options.scales.w] followed w axis scale params is available
 * @param {object} [settings.options.scales.w.min=0] Minimal range of the [color palette]{@link https://github.com/anhr/commonNodeJS/tree/master/colorpicker}.
 * @param {object} [settings.options.scales.w.max=100] Maximal range of the [color palette]{@link https://github.com/anhr/commonNodeJS/tree/master/colorpicker}.
 * @param {object} [settings.options.palette=new ColorPicker.palette();//palette: ColorPicker.paletteIndexes.BGRW] See [ColorPicker.palette]{@link https://raw.githack.com/anhr/colorPicker/master/jsdoc/module-ColorPicker.html#~Palette}.
 * <pre>
 * Example:
 * new ColorPicker.palette( { palette: ColorPicker.paletteIndexes.bidirectional } );
 * </pre>
 * @param {GuiSelectPoint} [settings.options.guiSelectPoint] A dat.gui based graphical user interface for select a point from the mesh.
 * See [GuiSelectPoint]{@link https://raw.githack.com/anhr/commonNodeJS/master/guiSelectPoint/jsdoc/index.html} for details.
 * @param {object} [settings.options.raycaster] followed [raycaster]{@link https://threejs.org/docs/index.html#api/en/core/Raycaster} options is available
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
 * @param {object} [settings.pointsOptions] followed points options is availablee:
 * @param {number} [settings.pointsOptions.tMin=0] start time. Uses for playing of the points..
 * @param {string} [settings.pointsOptions.name=""] Name of the points. Used for displaying of items of the Select drop down control of the Meshes folder of the dat.gui.
 * @param {object} [settings.pointsOptions.shaderMaterial] creates the THREE.Points with [THREE.ShaderMaterial]{@link https://threejs.org/docs/index.html#api/en/materials/ShaderMaterial} material.
 * The size of the each point of the THREE.Points seems the same on canvas
 * because I reduce the size of the points closest to the camera and increase the size of the points farthest to the camera.
 * See var shaderMaterialDefault of the frustumPoints for details.
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
 * @param {array} [settings.pointsOptions.arrayCloud] Array of points with cloud.
 * <pre>
 * If you define the array of points with cloud,
 * then you can define a points with cloud.
 * For example you can define
 * <b>arrayCloud: options.arrayCloud</b>
 * on the params of the
 * <b>getShaderMaterialPoints( params, onReady )</b>
 * function.
 * Or
 * <b>arrayCloud: options.arrayCloud</b>
 * on the <b>pointsOptions</b> of the <b>myThreejs.points</b> function.
 * </pre>
 * @param {boolean} [settings.pointsOptions.opacity] if true then opacity of the point is depend from distance to all  meshes points from the group with defined mesh.userData.cloud. See options.getColors for details.
 * @param {function(THREE.Points)} [settings.pointsOptions.onReady] Callback function that take as input the <b>new THREE.Points</b>.
 * Fires after creating of the points.
 */
function MyPoints( THREE, arrayFuncs, group,// Player,
	settings ) {

	if ( ( typeof arrayFuncs !== 'function' ) && ( arrayFuncs.length === 0 ) )
		arrayFuncs.push( new THREE.Vector3() );

	settings = settings || {};
	settings.Player = settings.Player || Player;

	const options = settings.options || {};
	options.point = options.point || {};
	options.point.size = options.point.size || 5.0;
	options.point.sizePointsMaterial = options.point.sizePointsMaterial || 100.0;

	options.scales = options.scales || {};
	options.scales.w = options.scales.w || {};
	if ( options.scales.w.min === undefined ) options.scales.w.min = 0;
	if ( options.scales.w.max === undefined ) options.scales.w.max = 100;

	const pointsOptions = settings.pointsOptions || {};
	pointsOptions.tMin = pointsOptions.tMin || 0;
	pointsOptions.name = pointsOptions.name || '';
	pointsOptions.position = pointsOptions.position || new THREE.Vector3( 0, 0, 0 );
	pointsOptions.scale = pointsOptions.scale || new THREE.Vector3( 1, 1, 1 );
	pointsOptions.rotation = pointsOptions.rotation || new THREE.Vector3();
	pointsOptions.group = group;

	if ( pointsOptions.shaderMaterial )
		getShaderMaterialPoints( THREE, group, arrayFuncs,// Player,
			function ( points ) {

				Points( points );

			}, {

			Player: settings.Player,
			options: options,
			pointsOptions: pointsOptions,

		} );
	else {

		const points = new THREE.Points(

			typeof arrayFuncs === 'function' ? arrayFuncs() :
				new THREE.BufferGeometry().setFromPoints( settings.Player.getPoints( THREE, arrayFuncs,
					{ options: options, group: group, t: pointsOptions.tMin } ), 4 ),
			new THREE.PointsMaterial( { size: options.point.size / options.point.sizePointsMaterial, vertexColors: THREE.VertexColors } )

		);
		if ( pointsOptions.arrayCloud !== undefined )
			points.userData.cloud = {

				indexArray: MyPoints.pushArrayCloud( THREE, pointsOptions.arrayCloud, points.geometry ),//индекс массива точек в pointsOptions.arrayCloud которые принадлежат этому points

			}
		points.geometry.setAttribute( 'color',
			new THREE.Float32BufferAttribute( settings.Player.getColors( THREE, arrayFuncs,
				{

					positions: points.geometry.attributes.position,
					scale: options.scales.w,
					palette: options.palette,

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
					options.raycaster.onIntersection( intersection, mouse );

			},
			onIntersectionOut: function () {

				if ( options.raycaster && options.raycaster.onIntersectionOut )
					options.raycaster.onIntersectionOut();

			},
			onMouseDown: function ( intersection ) {

				if ( ( intersection.object.userData.isInfo !== undefined ) && !intersection.object.userData.isInfo() )
					return;//No display information about frustum point
				if ( options.guiSelectPoint )
					options.guiSelectPoint.select( intersection );
				if ( options.raycaster.onMouseDown )
					options.raycaster.onMouseDown( intersection );

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
				while ( points.rotation[axisName] > Math.PI * 2 )
					points.rotation[axisName] -= Math.PI * 2

			}
			setRotation( 'x' );
			setRotation( 'y' );
			setRotation( 'z' );

		}
		setRotations();
		group.add( points );
		if ( pointsOptions.onReady !== undefined )
			pointsOptions.onReady( points );

		if ( options.guiSelectPoint )
			options.guiSelectPoint.addMesh( points );
		if ( !points.userData.boFrustumPoints && options.raycaster && options.raycaster.addParticle )
			options.raycaster.addParticle( points );

	}

}
/**
 * Pushes to clouds array all points from geometry
 * @function MyPoints.
 * pushArrayCloud
 * @param {THREE} THREE {@link https://github.com/anhr/three.js|THREE}
 * @param {array} arrayCloud
 * @param {THREE.BufferGeometry} geometry
 * @returns index of the new array item
 */
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

export default MyPoints;
