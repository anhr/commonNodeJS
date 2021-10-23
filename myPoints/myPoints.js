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
 * See <a href="../../jsdoc/Options/global.html#point" target="_blank">Options.point</a> for details.
 * @param {object} [settings.options.scales.w] followed w axis scale params is available
 * @param {object} [settings.options.scales.w.min=0] Minimal range of the [color palette]{@link https://github.com/anhr/commonNodeJS/tree/master/colorpicker}.
 * @param {object} [settings.options.scales.w.max=1] Maximal range of the [color palette]{@link https://github.com/anhr/commonNodeJS/tree/master/colorpicker}.
 * @param {object} [settings.options.palette=new ColorPicker.palette();//palette: ColorPicker.paletteIndexes.BGYW] See <a href="../../colorPicker/jsdoc/module-ColorPicker.html#~Palette" target="_blank">ColorPicker.palette</a>.
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
 * @param {function} [settings.pointsOptions.onReady] Callback function that take as input the <b>new THREE.Points</b>.
 * Fires after creating of the points.
 * <pre>
 * function( points )
 *	<b>points</b> - [Points]{@link https://threejs.org/docs/index.html?q=Poin#api/en/objects/Points}
 * </pre>
 * @param {object} [settings.pointsOptions.raycaster] Followed [raycaster]{@link https://threejs.org/docs/index.html#api/en/core/Raycaster} options is available.
 * @param {Function(intersection, mouse)} [settings.pointsOptions.raycaster.onIntersection] Callback function that take as input the <b>[intersectObject]{@link https://threejs.org/docs/index.html#api/en/core/Raycaster.intersectObject} </b>, and <b>mouse position</b>.
 * Fires after intersection of the mouse pointer with a point.
 * @param {Function()} [settings.pointsOptions.raycaster.onIntersectionOut] Callback function.
 * Fires if mouse pointer leaves of intersection with the point.
 * @param {Function(intersection)} [settings.pointsOptions.raycaster.onMouseDown] Callback function that take as input the <b>[intersectObject]{@link https://threejs.org/docs/index.html#api/en/core/Raycaster.intersectObject} </b>.
 * User has clicked over point.
 * @param {object} [settings.pointsOptions.elements] Followed elements can display on the web page
 * @param {HTMLElement|string} [settings.pointsOptions.elements.pointsName] Display of the <b>settings.pointsOptions.name</b> on the web page.
 * <pre>
 * HTMLElement - element for displaying.
 * string - <b>id</b> of the element.
 * </pre>
 */
function MyPoints( arrayFuncs, group, settings ) {

	const THREE = three.THREE;
	
	if ( ( typeof arrayFuncs !== 'function' ) && ( arrayFuncs.length === 0 ) )
		arrayFuncs.push( new THREE.Vector3() );

	settings = settings || {};

	settings.pointsOptions = settings.pointsOptions || {};
	const pointsOptions = settings.pointsOptions;
	settings.options = settings.options || new Options();
	var options = settings.options;// || {};
	if ( !options.boOptions ) {

		options = new Options( options );

	}
	pointsOptions.tMin = pointsOptions.tMin || 0;
	pointsOptions.name = pointsOptions.name || '';
	pointsOptions.position = pointsOptions.position || new THREE.Vector3( 0, 0, 0 );
	pointsOptions.scale = pointsOptions.scale || new THREE.Vector3( 1, 1, 1 );
	pointsOptions.rotation = pointsOptions.rotation || new THREE.Vector3();
	pointsOptions.group = group;

	//points name
	if ( pointsOptions.name !== '' && pointsOptions.elements ) {

		if ( pointsOptions.elements.pointsName === null ) console.warn( 'MyPoints: Points name element is not exists' );
		if ( !pointsOptions.elements.pointsName ) pointsOptions.elements.pointsName = 'pointsName';
		const elPointsName = typeof pointsOptions.elements.pointsName === "string" ?
			document.getElementById( pointsOptions.elements.pointsName ) : pointsOptions.elements.pointsName ;
		if ( elPointsName ) elPointsName.innerHTML = pointsOptions.name;
		else console.warn( 'MyPoints: Element with id: "' + pointsOptions.elements.pointsName + '" is not exists' );

	}

	//Эту строку нужно вызывать до создания точек THREE.Points
	//что бы вызывалась моя версия THREE.BufferGeometry().setFromPoints для создания geometry c itemSize = 4
	//потому что в противном случае при добавлени этих точек в FrustumPoints.pushArrayCloud() координата w будет undefined
	Player.assign();

	if ( pointsOptions.shaderMaterial !== false )
		getShaderMaterialPoints( group, arrayFuncs,// Player,
			function ( points ) {

				Points( points );

			}, {

			options: options,
			pointsOptions: pointsOptions,

		} );
	else {

		const points = new THREE.Points(

			typeof arrayFuncs === 'function' ? arrayFuncs() :
				new THREE.BufferGeometry().setFromPoints( Player.getPoints( arrayFuncs,
					{ options: options, group: group, t: pointsOptions.tMin } ), 4 ),
			new THREE.PointsMaterial( { size: options.point.size / options.point.sizePointsMaterial, vertexColors: THREE.VertexColors } )

		);
		if ( pointsOptions.frustumPoints )
			points.userData.cloud = {

				indexArray: pointsOptions.frustumPoints.pushArrayCloud( points.geometry ),//индекс массива точек в FrustumPoints.arrayCloud которые принадлежат этому points

			}
		points.geometry.setAttribute( 'color',
			new THREE.Float32BufferAttribute( Player.getColors( arrayFuncs,
				{

					positions: points.geometry.attributes.position,
					options: options,

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
		if ( settings.pointsOptions.raycaster ) points.userData.raycaster = settings.pointsOptions.raycaster;
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
		if ( options.guiSelectPoint ) options.guiSelectPoint.addMesh( points );
		if ( options.eventListeners ) options.eventListeners.addParticle( points );
		if ( pointsOptions.onReady !== undefined ) pointsOptions.onReady( points );

		if ( !points.userData.boFrustumPoints && options.raycaster && options.raycaster.addParticle )
			options.raycaster.addParticle( points );

	}

}
export default MyPoints;
