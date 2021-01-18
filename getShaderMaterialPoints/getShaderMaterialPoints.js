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

//если тут импортировать Player а где нибудь в дроугом месте делать import Player from '../build/player.module.js';
//то будут несколько экземляров Player и тогда будет не определен settings в одном из экземляров Playerю
//import Player from '../player/player.js';

import MyPoints from '../myPoints/myPoints.js';

// * @param {Player} Player [Player]{@link https://raw.githack.com/anhr/commonNodeJS/master/player/jsdoc/index.html}

/**
 * get THREE.Points with THREE.ShaderMaterial material
 * @param {THREE} THREE {@link https://github.com/anhr/three.js|THREE}
 * @param {THREE.Group|THREE.Scene} group THREE group or scene
 * @param {array} arrayFuncs points.geometry.attributes.position array.
 * See arrayFuncs parametr of the [Player.getPoints(...)]{@link https://raw.githack.com/anhr/commonNodeJS/master/player/jsdoc/module-Player.html#~Player.getPoints} for details.
 * @param {function(THREE.Points)} onReady Callback function that take as input the new THREE.Points.
 * @param {object} [settings]
 * @param {number} [settings.tMin] start time. Uses for playing of the points. Default is 0.
 * @param {Player} [settings.Player] [Player]{@link https://raw.githack.com/anhr/commonNodeJS/master/player/jsdoc/index.html}.
 * Define Player only if you want trace of the moving of the points during playing.
 * @param {object} [settings.pointsOptions] see myPoints pointsOptions for details
 * @param {object} [settings.options] see myThreejs.create options for details
 * @param {number} [settings.options.a] multiplier. Second parameter of the arrayFuncs item function. Default is 1.
 * @param {number} [settings.options.b] addendum. Third parameter of the arrayFuncs item function. Default is 0.
 * @param {number} [settings.options.point.size] point size. Default is 5.0.
 * @param {object} [settings.options.scales.w] followed w axis scale params is available
 * @param {object} [settings.options.scales.w.min] Minimal range of the [color palette]{@link https://github.com/anhr/commonNodeJS/tree/master/colorpicker}.
 * <p>Default is undefined. Minimal palette range is 0.</p>
 * @param {object} [settings.options.scales.w.max] Maximal range of the [color palette]{@link https://github.com/anhr/commonNodeJS/tree/master/colorpicker}.
  * <p>Default is undefined. Maximal palette range is 100</p>
*/
function getShaderMaterialPoints( THREE, group, arrayFuncs, onReady, settings ) {

	settings = settings || {};
//	settings.Player = settings.Player || Player;

	var geometry,
		tMin = settings.pointsOptions === undefined ?
			settings.tMin === undefined ? 0 : settings.tMin :
			settings.pointsOptions.tMin,
		arrayCloud = settings.pointsOptions === undefined ? settings.arrayCloud : settings.pointsOptions.arrayCloud;


	settings.options = settings.options || {};
	settings.options.a = settings.options.a || 1;
	settings.options.b = settings.options.b || 0;
	settings.options.scales = settings.options.scales || {};

	settings.options.point = settings.options.point || {};
	settings.options.point.size = settings.options.point.size || 5.0;

	if ( typeof arrayFuncs === 'function' )
		geometry = arrayFuncs();
	else geometry = new THREE.BufferGeometry().setFromPoints
		( settings.Player.getPoints( /*THREE, */arrayFuncs,
//			{ options: { a: settings.options.a, b: settings.options.b, player: settings.options.player }, group: group, t: tMin, } ),
			{ options: { a: settings.options.a, b: settings.options.b }, group: group, t: tMin, } ),
			arrayFuncs[0] instanceof THREE.Vector3 ? 3 : 4 );
	var indexArrayCloud = arrayCloud === undefined ? undefined : MyPoints.pushArrayCloud( THREE, arrayCloud, geometry );//индекс массива точек в pointsOptions.arrayCloud которые принадлежат этому points
	if ( ( settings.pointsOptions === undefined ) || !settings.pointsOptions.boFrustumPoints )
		geometry.setAttribute( 'ca', new THREE.Float32BufferAttribute( settings.Player.getColors
			( /*THREE, */arrayFuncs,
				{

					opacity: settings.pointsOptions === undefined ? undefined : settings.pointsOptions.opacity,
					positions: geometry.attributes.position,
					scale: settings.options.scales.w,
					palette: settings.options.palette,
					tMin: tMin,

				} ),
			4 ) );

//	var texture = new THREE.TextureLoader().load( "/anhr/myThreejs/master/textures/point.png" );
	var texture = new THREE.TextureLoader().load( "/anhr/commonNodeJS/master/getShaderMaterialPoints/textures/point.png" );
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;

	var uniforms = {

		pointTexture: { value: texture },

		pointSize: {

			value: ( settings.pointsOptions !== undefined ) && ( settings.pointsOptions.shaderMaterial !== undefined ) && ( settings.pointsOptions.shaderMaterial.point !== undefined ) ?
				settings.pointsOptions.shaderMaterial.point.size :
					settings.options.point.size
//					( ( settings.options.point === undefined ) || ( settings.options.point.size === undefined ) ) ? 0.0 : settings.options.point.size

		},

	}

	var cloud;
	if ( ( settings.pointsOptions !== undefined ) && ( settings.pointsOptions.uniforms !== undefined ) )
		cloud = settings.pointsOptions.uniforms( uniforms );//frustumPoints


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
		 * @param {object} [options] the following options are available
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
/*Если тут создавть geometry то не будут видны точки frustumPoints.js. Не разобрался почму это происходит
		const arrayCloud = settings.pointsOptions === undefined ? settings.arrayCloud : settings.pointsOptions.arrayCloud;
		var geometry;
		if ( typeof arrayFuncs === 'function' )
			geometry = arrayFuncs();
		else geometry = new THREE.BufferGeometry().setFromPoints
			( settings.Player.getPoints( arrayFuncs,
				//			{ options: { a: settings.options.a, b: settings.options.b, player: settings.options.player }, group: group, t: tMin, } ),
				{ options: { a: settings.options.a, b: settings.options.b }, group: group, t: Player.getSettings().min, } ),
				arrayFuncs[0] instanceof THREE.Vector3 ? 3 : 4 );
		var indexArrayCloud = arrayCloud === undefined ? undefined : MyPoints.pushArrayCloud( THREE, arrayCloud, geometry );//индекс массива точек в pointsOptions.arrayCloud которые принадлежат этому points
		if ( ( settings.pointsOptions === undefined ) || !settings.pointsOptions.boFrustumPoints )
			geometry.setAttribute( 'ca', new THREE.Float32BufferAttribute( settings.Player.getColors
				( arrayFuncs,
					{

						opacity: settings.pointsOptions === undefined ? undefined : settings.pointsOptions.opacity,
						positions: geometry.attributes.position,
						scale: settings.options.scales.w,
						palette: settings.options.palette,
						tMin: Player.getSettings().min,

					} ),
				4 ) );
*/

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
		points.userData.shaderMaterial = settings.pointsOptions === undefined ? settings.shaderMaterial : settings.pointsOptions.shaderMaterial;
		if ( settings.options.saveMeshDefault !== undefined )
			settings.options.saveMeshDefault( points );
		if ( ( settings.pointsOptions !== undefined ) && ( settings.pointsOptions.arrayCloud !== undefined ) )
			points.userData.cloud = { indexArray: indexArrayCloud, }
		points.userData.shaderMaterial = settings.pointsOptions === undefined ? settings.shaderMaterial : settings.pointsOptions.shaderMaterial;
//		if ( onReady !== undefined )
			onReady( points );
/*если оставить эти строки то в guiSelectPoint будут добавляться точки даже если этого не хочет программист			
		if ( settings.options.guiSelectPoint )
			settings.options.guiSelectPoint.addMesh( points );
*/
		//Convert all points with cloud and shaderMaterial from local to world positions
		// i.e. calculate scales, positions and rotation of the points.
		//Converting of all points with cloud, but not shaderMaterial see updateCloudPoint in the frustumPoints.create function
		if ( points.userData.boFrustumPoints ) {

			settings.pointsOptions.group.children.forEach( function ( mesh ) {

				settings.options.arrayCloud.frustumPoints.updateCloudPoint( mesh );

			} );

		}

		//нужно что бы обновились точки в frustumPoints
		if ( points.material.uniforms.palette !== undefined )
			points.material.uniforms.palette.value.needsUpdate = true;
		if ( points.material.uniforms.cloudPoints !== undefined )
			points.material.uniforms.cloudPoints.value.needsUpdate = true;

		if ( settings.Player ) settings.Player.selectMeshPlayScene( /*THREE, */points, undefined, 0, settings.options );

	}, settings.pointsOptions === undefined ? undefined : settings.pointsOptions.path );

}
export default getShaderMaterialPoints;
