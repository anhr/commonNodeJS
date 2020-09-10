/**
 * @module myPoints
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

//import * as THREE from '../../../three.js/dev/build/three.module.js';
//import { THREE } from '../../../nodejs/three.js';
//import { THREE } from '../three.js';
//import loadScript from '../../../loadScriptNodeJS/master/loadScript.js';

/**
 * Creating the new points and adding it into group
 * @param {THREE} THREE {@link https://github.com/anhr/three.js|THREE}
 * @param {array} arrayFuncs points.geometry.attributes.position array.
 * See arrayFuncs parametr of the [Player.getColors(...)]{@link https://raw.githack.com/anhr/commonNodeJS/master/player/jsdoc/module-Player.html#~Player.getColors} for details.
 * @param {THREE.Group} group Group for new points
 * @param {Player} Player [Player]{@link https://raw.githack.com/anhr/commonNodeJS/master/player/jsdoc/index.html}
 * @param {object} [options] followed options is available
 * @param {number} [options.point.size] point size. Default is 5.0.
 * @param {object} [options.scales.w] followed w axis scale params is available
 * @param {object} [options.scales.w.min] Minimal range of the [color palette]{@link https://github.com/anhr/colorPicker}.
 * <p>Default is undefined. Minimal palette range is 0.</p>
 * @param {object} [options.scales.w.max] Maximal range of the [color palette]{@link https://github.com/anhr/colorPicker}.
  * <p>Default is undefined. Maximal palette range is 100</p>
 * @param {GuiSelectPoint} [options.guiSelectPoint] A dat.gui based graphical user interface for select a point from the mesh.
 * See [GuiSelectPoint]{@link https://raw.githack.com/anhr/commonNodeJS/master/guiSelectPoint/jsdoc/index.html} for details.
 * Default is undefined.
 * @param {object} [pointsOptions] followed points options is availablee:
 * @param {number} [pointsOptions.tMin] start time. Uses for playing of the points. Default is 0.
 * @param {string} [pointsOptions.name] Name of the points. Used for displaying of items of the Select drop down control of the Meshs folder of the dat.gui. Default is "".
 * @param {object} [pointsOptions.shaderMaterial] creates the THREE.Points with THREE.ShaderMaterial material.
 * The size of the each point of the THREE.Points seems the same on canvas
 * because I reduce the size of the points closest to the camera and increase the size of the points farthest to the camera.
 * See var shaderMaterialDefault of the frustumPoints for details.
 * @param {THREE.Vector3} [pointsOptions.position] position of the points. Default is new THREE.Vector3( 0, 0, 0 ).
 * Vector's x, y, z is position of the points.
 * Can be as:
 * float - position of the points.
 * [float] - array of positions of the points.
 * Function - position of the points is function of the t. Example: new Function( 't', 'return 0.1 + t' )
 * @param {THREE.Vector3} [pointsOptions.scale] scale of the points. Default is new THREE.Vector3( 1, 1, 1 ).
 * Vector's x, y, z is scale of the points.
 * Can be as:
 * float - scale of the points.
 * [float] - array of scales of the points.
 * Function - scale of the points is function of the t. Example: new Function( 't', 'return 1.1 + t' )
 * @param {THREE.Vector3} [pointsOptions.rotation] rotation of the points. Default is new THREE.Vector3( 0, 0, 0 ).
 * Vector's x, y, z is rotation of the points.
 * Can be as:
 * float - rotation of the points.
 * [float] - array of rotations of the points.
 * Function - rotation of the points is function of the t. Example: new Function( 't', 'return Math.PI / 2 + t * Math.PI * 2' )
 * @param {array} [pointsOptions.arrayCloud] Array of points with cloud.
 * If you define the array of points with cloud, then you can define a points with cloud.
 * For example you can define
 * arrayCloud: options.arrayCloud
 * on the params of the getShaderMaterialPoints( params, onReady ) function.
 * Or
 * arrayCloud: options.arrayCloud
 * on the pointsOptions of the myThreejs.points function.
 * Default is undefined
 * @param {boolean} [pointsOptions.opacity] if true then opacity of the point is depend from distance to all  meshes points from the group with defined mesh.userData.cloud. See options.getColors for details. Default is undefined.
 * @param {function(THREE.Points)} onReady Callback function that take as input the new THREE.Points.
 */
function create( THREE, arrayFuncs, group, Player, options, pointsOptions ) {

	if ( ( typeof arrayFuncs !== 'function' ) && ( arrayFuncs.length === 0 ) )
		arrayFuncs.push( new THREE.Vector3() );

	options = options || {};
	options.point = options.point || {};
	options.point.size = options.point.size || 5.0;
	options.scales = options.scales || {};

	pointsOptions = pointsOptions || {};
	pointsOptions.tMin = pointsOptions.tMin || 0;
	pointsOptions.name = pointsOptions.name || '';
	pointsOptions.position = pointsOptions.position || new THREE.Vector3( 0, 0, 0 );
	pointsOptions.scale = pointsOptions.scale || new THREE.Vector3( 1, 1, 1 );
	pointsOptions.rotation = pointsOptions.rotation || new THREE.Vector3();
	pointsOptions.group = group;

	if ( pointsOptions.shaderMaterial )
		getShaderMaterialPoints( {

			options: options,
			pointsOptions: pointsOptions,
			arrayFuncs: arrayFuncs,

		}, function ( points ) {

			Points( points );
			if ( !points.userData.boFrustumPoints )
				options.addParticle( points );
			
		} );
	else {

		var points = new THREE.Points(

			typeof arrayFuncs === 'function' ? arrayFuncs() :
//				new THREE.BufferGeometry().setFromPoints( options.getPoints( THREE, arrayFuncs,
				new THREE.BufferGeometry().setFromPoints( Player.getPoints( THREE, arrayFuncs,
					{ options: options, group: group, t: pointsOptions.tMin } ), 4 ),
			new THREE.PointsMaterial( { size: options.point.size / options.point.sizePointsMaterial, vertexColors: THREE.VertexColors } )

		);
		if ( pointsOptions.arrayCloud !== undefined )
			points.userData.cloud = {

				indexArray: pushArrayCloud( pointsOptions.arrayCloud, points.geometry ),//индекс массива точек в pointsOptions.arrayCloud которые принадлежат этому points

			}
/*
		points.geometry.setAttribute( 'color',
			new THREE.Float32BufferAttribute( options.getColors( THREE, pointsOptions.tMin, arrayFuncs, options.scales.w,
				{ positions: points.geometry.attributes.position }), 4 ) );
*/
		points.geometry.setAttribute( 'color',
			new THREE.Float32BufferAttribute( Player.getColors( THREE, arrayFuncs,
				{ positions: points.geometry.attributes.position, scale: options.scales.w } ), 4 ) );
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

				options.addSpriteTextIntersection( intersection, mouse );

			},
			onIntersectionOut: function () {

				options.removeSpriteTextIntersection();

			},
			onMouseDown: function ( intersection/*intersects*/ ) {

				if ( ( intersection.object.userData.isInfo !== undefined ) && !intersection.object.userData.isInfo() )
					return;//No display information about frustum point
				options.guiSelectPoint.select( intersection );

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
/*
		points.userData.arrayFuncs = arrayFuncs;
		points.userData.selectPlayScene = function ( t ) {

			setPositions( t );
			setScales( t );
			setRotations( t );

		}
*/
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
//console.warn('group.add( ' + points.name + ' )');
		if ( pointsOptions.onReady !== undefined )
			pointsOptions.onReady( points );

		if ( options.guiSelectPoint )
			options.guiSelectPoint.addMesh( points );
/*		
		if ( !points.userData.boFrustumPoints )
			options.arrayCloud.frustumPoints.updateCloudPoint( points );
*/			

	}
//	return points;

}

/**
 * Pushes to clouds array all points from geometry
 * @param {array} arrayCloud
 * @param {THREE.BufferGeometry} geometry
 * @returns index of the new array item
 */
function pushArrayCloud( arrayCloud, geometry ) {

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
//	var index = arrayCloud.length,
	var index = arrayCloud.getCloudsCount(),
		points = [];
	arrayCloud.push( points );
	for ( var i = 0; i < geometry.attributes.position.count; i++ )
		points.push( new THREE.Vector4().fromArray( geometry.attributes.position.array, i * geometry.attributes.position.itemSize ) );
	return index;

}

/**
 * get THREE.Points with THREE.ShaderMaterial material
 * @param {object} params
 * @param {object} params.options see myThreejs.create options for details
 * @param {object} params.pointsOptions see myPoints.create pointsOptions for details
 * @param {number} params.tMin start time. Uses for playing of the points. Default is 0.
 * @param {array} params.arrayFuncs points.geometry.attributes.position array.
 * See https://github.com/anhr/myThreejs#arrayfuncs-item  for details.
 * @param {function(THREE.Points)} [onReady] Callback function that take as input the new THREE.Points. Default is undefined.
 */
function getShaderMaterialPoints( params, onReady ) {

	var geometry, tMin = params.pointsOptions === undefined ?
			params.tMin === undefined ? 0: params.tMin :
			params.pointsOptions.tMin,
		arrayCloud = params.pointsOptions === undefined ? params.arrayCloud : params.pointsOptions.arrayCloud;
	if ( typeof params.arrayFuncs === 'function' )
		geometry = params.arrayFuncs();
	else geometry = new THREE.BufferGeometry().setFromPoints
		//		( params.options.getPoints( THREE, scene, tMin, params.arrayFuncs, params.options.a, params.options.b ),
		( params.options.getPoints( THREE, params.arrayFuncs,
			{ options: { a: params.options.a, b: params.options.b }, group: scene, t: tMin, } ),
		params.arrayFuncs[0] instanceof THREE.Vector3 ? 3 : 4 );
	var indexArrayCloud = arrayCloud === undefined ? undefined : pushArrayCloud( arrayCloud, geometry );//индекс массива точек в pointsOptions.arrayCloud которые принадлежат этому points
	if ( ( params.pointsOptions === undefined ) || !params.pointsOptions.boFrustumPoints )
		geometry.setAttribute( 'ca', new THREE.Float32BufferAttribute( params.options.getColors
			( THREE, params.arrayFuncs,
				{

					opacity: params.pointsOptions === undefined ? undefined : params.pointsOptions.opacity,
					positions: geometry.attributes.position,
					scale: params.options.scales.w,

				} ),
			4 ) );
/*
 			( THREE, tMin, params.arrayFuncs, params.options.scales.w,
				{

					opacity: params.pointsOptions === undefined ? undefined : params.pointsOptions.opacity,
					positions: geometry.attributes.position

				} ),
			4 ) );
*/

	var texture = new THREE.TextureLoader().load( "/anhr/myThreejs/master/textures/point.png" );
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;

	var uniforms = {

//		color: { value: new THREE.Color( 0xffffff ) },
		pointTexture: { value: texture },

/*
		//если убрать эту переменную, то размер точек невозможно будет регулировать
		opacity: {
			value: ( params.shaderMaterial !== undefined ) &&
				( params.shaderMaterial.point !== undefined ) &&
				( params.shaderMaterial.point.opacity !== undefined ) ?
				params.shaderMaterial.point.opacity : 1.0
		},//Float in the range of 0.0 - 1.0 indicating how transparent the material is. A value of 0.0 indicates fully transparent, 1.0 is fully opaque.
*/		
		pointSize: {

			value: ( params.pointsOptions !== undefined ) && ( params.pointsOptions.shaderMaterial !== undefined ) && ( params.pointsOptions.shaderMaterial.point !== undefined ) ?
				params.pointsOptions.shaderMaterial.point.size :
				params.options.point.size === undefined ? 0.0 : params.options.point.size

		},

	}

	var cloud;
	if ( ( params.pointsOptions !== undefined ) && ( params.pointsOptions.uniforms !== undefined ) )
		cloud = params.pointsOptions.uniforms( uniforms );//frustumPoints

	loadShaderText(function ( shaderText ) {

		//See description of the
		//const int cloudPointsWidth = %s;
		//in the \frustumPoints\vertex.c
		if ( cloud !== undefined ) {

			cloud.editShaderText( shaderText );

		}

		var points = new THREE.Points( geometry, new THREE.ShaderMaterial( {

			//See https://threejs.org/examples/webgl_custom_attributes_points2.html
			//D: \My documents\MyProjects\webgl\three.js\GitHub\three.js\dev\examples\webgl_custom_attributes_points2.html
			//OpenGL Shading Language https://www.khronos.org/opengl/wiki/OpenGL_Shading_Language
			//Обзор спецификации GLSL ES 2.0 http://a-gro-pro.blogspot.com/2013/06/glsl-es-20.html
			//Open GL 4. Язык шейдеров. Книга рецептов http://www.cosmic-rays.ru/books61/2015ShadingLanguage.pdf
			//OpenGL® 4.5 Reference Pages. Ключевые слова по алфавиту https://www.khronos.org/registry/OpenGL-Refpages/gl4/

			uniforms: uniforms,
			vertexShader: shaderText.vertex,
			fragmentShader: shaderText.fragment,
			transparent: true,
			//		opacity: 0.1,

		} ) );
		points.userData.shaderMaterial = params.pointsOptions === undefined ? params.shaderMaterial : params.pointsOptions.shaderMaterial;
		if ( params.options.saveMeshDefault !== undefined )
			params.options.saveMeshDefault( points );
		if ( ( params.pointsOptions !== undefined ) && ( params.pointsOptions.arrayCloud !== undefined ) )
			points.userData.cloud = { indexArray: indexArrayCloud, }
		points.userData.shaderMaterial = params.pointsOptions === undefined ? params.shaderMaterial : params.pointsOptions.shaderMaterial;
		if ( onReady !== undefined )
			onReady( points );
			
		//Convert all points with cloud and shaderMaterial from local to world positions
		// i.e. calculate scales, positions and rotation of the points.
		//Converting of all points with cloud, but not shaderMaterial see updateCloudPoint in the frustumPoints.create function
/*		
		if (
			!points.userData.boFrustumPoints &&
			(
				(
					( params.pointsOptions !== undefined ) && ( params.pointsOptions.arrayCloud !== undefined )
				)
				|| ( params.arrayCloud !== undefined )
			)
		)
			params.pointsOptions.arrayCloud.frustumPoints.updateCloudPoint( points );
*/
		if ( points.userData.boFrustumPoints ) {

			params.pointsOptions.group.children.forEach( function ( mesh ){

				params.options.arrayCloud.frustumPoints.updateCloudPoint( mesh );
				
			});

		}

		//нужно что бы обновились точки в frustumPoints
		if ( points.material.uniforms.palette !== undefined )
			points.material.uniforms.palette.value.needsUpdate = true;
		if ( points.material.uniforms.cloudPoints !== undefined )
			points.material.uniforms.cloudPoints.value.needsUpdate = true;

	}, params.pointsOptions === undefined ? undefined : params.pointsOptions.path );

}

/**
 * Loading of the vertex and fragment contents from external files.
 * Thanks to https://stackoverflow.com/a/48188509/5175935
 * @param {function()} onLoad Callback function that called after success loading.
 * */
function loadShaderText ( onload, path ) {

	var shaderText = {};

	/**
	 * This is a basic asyncronous shader loader for THREE.js.
	 * Thanks to https://www.davideaversa.it/2016/10/three-js-shader-loading-external-file/
	 * https://github.com/THeK3nger/threejs-async-shaders-example
	 * 
	 * It uses the built-in THREE.js async loading capabilities to load shaders from files!
	 * 
	 * `onProgress` and `onError` are stadard TREE.js stuff. Look at 
	 * https://threejs.org/examples/webgl_loader_obj.html for an example. 
	 * 
	 * @param {String} vertex_url URL to the vertex shader code.
	 * @param {String} fragment_url URL to fragment shader code
	 * @param {function(String, String)} onLoad Callback function(vertex, fragment) that take as input the loaded vertex and fragment contents.
	 * @param {object} [options] followed options is available
	 * @param {function(event)} [options.onProgress] Callback for the `onProgress` event.
	 * @param {function(event)} [options.onError] Callback for the `onError` event.
	 */
	function ShaderLoader( vertex_url, fragment_url, onLoad, options ) {

		options = options || {};
/*
		var vertex_text, fragment_text;
		function loaded() {

			if ( ( fragment_text === undefined ) || ( vertex_text === undefined ) )
				return;
			onLoad( vertex_text, fragment_text );

		}
*/
		//load vertex.c file
		var vertex_loader = new THREE.FileLoader( THREE.DefaultLoadingManager );
		vertex_loader.setResponseType( 'text' );
		vertex_loader.load( vertex_url, function ( vertex_text ) {
/*
			vertex_text = _vertex_text;
			loaded();
*/
		//load fragment.c file
			var fragment_loader = new THREE.FileLoader( THREE.DefaultLoadingManager );
			fragment_loader.setResponseType( 'text' );
			fragment_loader.load( fragment_url, function ( fragment_text ) {

				onLoad( vertex_text, fragment_text );

			}, options.onProgress, options.onError );

		}, options.onProgress, options.onError );
/*
		//load fragment.c file
		var fragment_loader = new THREE.FileLoader( THREE.DefaultLoadingManager );
		fragment_loader.setResponseType( 'text' );
		fragment_loader.load( fragment_url, function ( _fragment_text ) {

			fragment_text = _fragment_text;
			loaded();

		}, options.onProgress, options.onError );
*/

	}

	//Thanks to https://stackoverflow.com/a/27369985/5175935
	//Такая же функция есть в frustumPoints.js но если ее использовать то она будет возвращать путь на frustumPoints.js
	var getCurrentScript = function () {

		if ( document.currentScript && ( document.currentScript.src !== '' ) )
			return document.currentScript.src;
		var scripts = document.getElementsByTagName( 'script' ),
			str = scripts[scripts.length - 1].src;
		if ( str !== '' )
			return src;
		//Thanks to https://stackoverflow.com/a/42594856/5175935
		return new Error().stack.match( /(https?:[^:]*)/ )[0];

	};
	//Thanks to https://stackoverflow.com/a/27369985/5175935
	var getCurrentScriptPath = function () {
		var script = getCurrentScript(),
			path = script.substring( 0, script.lastIndexOf( '/' ) );
		return path;
	};
	//console.warn( 'getCurrentScriptPath = ' + getCurrentScriptPath() );
	var currentScriptPath = getCurrentScriptPath();

	path = path || {};
/*	
currentScriptPath = "https://raw.githack.com/anhr/myThreejs/master/myPoints";
console.warn( 'currentScriptPath = ' + currentScriptPath );
*/
	path.vertex = path.vertex || currentScriptPath + "/vertex.c";
	path.fragment = path.fragment || currentScriptPath + "/fragment.c";
	ShaderLoader( path.vertex, path.fragment,
		function ( vertex, fragment ) {

			shaderText.vertex = vertex;
			shaderText.fragment = fragment;
			onload( shaderText );

		},
		{

			onError: function ( event ) {

				console.error( event.srcElement.responseURL + ' status = ' + event.srcElement.status + ' ' + event.srcElement.statusText );

			}

		}

	);

}

/**
 * The vertex and fragment contents
 * */
//var shaderText;
/**
 * Loading of the vertex and fragment contents from external files.
 * Creating the new points and adding it into group
 * */
export var myPoints = {

	/**
	 * Creating the new points and adding it into group
	 * */
	create: create,
	getGlobalScale: function ( mesh ) {

		var parent = mesh.parent, scale = new THREE.Vector3( 1, 1, 1 );
		while ( parent !== null ) {

			scale.multiply( parent.scale );
			parent = parent.parent;

		}
		return scale;

	},
	/**
	* get THREE.Points with THREE.ShaderMaterial material
	* */
	getShaderMaterialPoints: getShaderMaterialPoints,
	/**
	 * Pushes to clouds array all point from geometry
	 */
	pushArrayCloud: pushArrayCloud,

}