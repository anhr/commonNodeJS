/**
 * @module getShaderMaterialPoints
 * @description get THREE.Points with THREE.ShaderMaterial material
 * @author [Andrej Hristoliubov]{@link https://anhr.github.io/AboutMe/}
 * @copyright 2011 Data Arts Team, Google Creative Lab
 *
 * @license under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */

//import Player from '../player/player.js';

/**
 * get THREE.Points with THREE.ShaderMaterial material
 * @param {THREE} THREE {@link https://github.com/anhr/three.js|THREE}
 * @param {THREE.Group|THREE.Scene} group THREE group or scene
 * @param {array} arrayFuncs points.geometry.attributes.position array.
 * See arrayFuncs parametr of the [Player.getColors(...)]{@link https://raw.githack.com/anhr/commonNodeJS/master/player/jsdoc/module-Player.html#~Player.getColors} for details.
 * @param {Player} Player [Player]{@link https://raw.githack.com/anhr/commonNodeJS/master/player/jsdoc/index.html}
 * @param {function(THREE.Points)} onReady Callback function that take as input the new THREE.Points.
 * @param {object} [params]
 * @param {object} [params.options] see myThreejs.create options for details
 * @param {number} [params.options.a] multiplier. Second parameter of the arrayFuncs item function. Default is 1.
 * @param {number} [params.options.b] addendum. Third parameter of the arrayFuncs item function. Default is 0.
 * @param {object} [params.pointsOptions] see myPoints.create pointsOptions for details
 * @param {number} [params.tMin] start time. Uses for playing of the points. Default is 0.
 * @param {number} [params.options.point.size] point size. Default is 5.0.
 */
function getShaderMaterialPoints( THREE, group, arrayFuncs, Player, onReady, params ) {

	params = params || {};

	var geometry, tMin = params.pointsOptions === undefined ?
		params.tMin === undefined ? 0 : params.tMin :
		params.pointsOptions.tMin,
		arrayCloud = params.pointsOptions === undefined ? params.arrayCloud : params.pointsOptions.arrayCloud;

	params.options = params.options || {};
	params.options.a = params.options.a || 1;
	params.options.b = params.options.b || 0;
	params.options.scales = params.options.scales || {};

	params.options.point = params.options.point || {};
	params.options.point.size = params.options.point.size || 5.0;

	if ( typeof arrayFuncs === 'function' )
		geometry = arrayFuncs();
	else geometry = new THREE.BufferGeometry().setFromPoints
//		( params.options.getPoints( THREE, arrayFuncs,
		( Player.getPoints( THREE, arrayFuncs,
			{ options: { a: params.options.a, b: params.options.b }, group: group, t: tMin, } ),
			arrayFuncs[0] instanceof THREE.Vector3 ? 3 : 4 );
	var indexArrayCloud = arrayCloud === undefined ? undefined : pushArrayCloud( arrayCloud, geometry );//индекс массива точек в pointsOptions.arrayCloud которые принадлежат этому points
	if ( ( params.pointsOptions === undefined ) || !params.pointsOptions.boFrustumPoints )
		geometry.setAttribute( 'ca', new THREE.Float32BufferAttribute( Player.getColors
			( THREE, arrayFuncs,
				{

					opacity: params.pointsOptions === undefined ? undefined : params.pointsOptions.opacity,
					positions: geometry.attributes.position,
					scale: params.options.scales.w,

				} ),
			4 ) );

	var texture = new THREE.TextureLoader().load( "/anhr/myThreejs/master/textures/point.png" );
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;

	var uniforms = {

		pointTexture: { value: texture },

		pointSize: {

			value: ( params.pointsOptions !== undefined ) && ( params.pointsOptions.shaderMaterial !== undefined ) && ( params.pointsOptions.shaderMaterial.point !== undefined ) ?
				params.pointsOptions.shaderMaterial.point.size :
					params.options.point.size
//					( ( params.options.point === undefined ) || ( params.options.point.size === undefined ) ) ? 0.0 : params.options.point.size

		},

	}

	var cloud;
	if ( ( params.pointsOptions !== undefined ) && ( params.pointsOptions.uniforms !== undefined ) )
		cloud = params.pointsOptions.uniforms( uniforms );//frustumPoints


	/**
	 * Loading of the vertex and fragment contents from external files.
	 * Thanks to https://stackoverflow.com/a/48188509/5175935
	 * @param {function()} onLoad Callback function that called after success loading.
	 * */
	function loadShaderText( onload, path ) {

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

	loadShaderText( function ( shaderText ) {

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
//		if ( onReady !== undefined )
			onReady( points );

		//Convert all points with cloud and shaderMaterial from local to world positions
		// i.e. calculate scales, positions and rotation of the points.
		//Converting of all points with cloud, but not shaderMaterial see updateCloudPoint in the frustumPoints.create function
		if ( points.userData.boFrustumPoints ) {

			params.pointsOptions.group.children.forEach( function ( mesh ) {

				params.options.arrayCloud.frustumPoints.updateCloudPoint( mesh );

			} );

		}

		//нужно что бы обновились точки в frustumPoints
		if ( points.material.uniforms.palette !== undefined )
			points.material.uniforms.palette.value.needsUpdate = true;
		if ( points.material.uniforms.cloudPoints !== undefined )
			points.material.uniforms.cloudPoints.value.needsUpdate = true;

	}, params.pointsOptions === undefined ? undefined : params.pointsOptions.path );

}
export default getShaderMaterialPoints;
