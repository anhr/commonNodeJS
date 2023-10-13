/**
 * @module getShaderMaterialPoints
 * @description get THREE.Points with THREE.ShaderMaterial material
 * @author [Andrej Hristoliubov]{@link https://github.com/anhr}
 * @copyright 2011 Data Arts Team, Google Creative Lab
 *
 * @license under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */

import three from '../three.js'
import Player from '../player/player.js';
import Options from '../Options.js'
//import vertex from './getShaderMaterialPoints/vertex.glsl'

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
const currentScriptPath = getCurrentScriptPath(),
	_vertex_text = {

		array: [],
		setItem: function ( path, text ) { this.array.push( { path: path, text: text } ) },
		getItem: function ( path ) {

			for ( var i = 0; i < this.array.length; i++ ) { if ( this.array[i].path === path ) return this.array[i].text; }

		}

	},
	_fragment_text = {

		array: [],
		setItem: function ( path, text ) { this.array.push( { path: path, text: text } ) },
		getItem: function ( path ) {

			for ( var i = 0; i < this.array.length; i++ ) { if ( this.array[i].path === path ) return this.array[i].text; }

		}

	};

/**
 * get THREE.Points with THREE.ShaderMaterial material
 * @param {THREE.Group|THREE.Scene} group [THREE.Group]{@link https://threejs.org/docs/index.html?q=group#api/en/objects/Group} or [THREE.Scene]{@link https://threejs.org/docs/index.html?q=sce#api/en/scenes/Scene}.
 * @param {array} arrayFuncs <b>points.geometry.attributes.position</b> array.
 * See <b>arrayFuncs</b> parametr of the <a href="../../player/jsdoc/module-Player-Player.getPoints.html" target="_blank">Player.getPoints(...)</a> for details.
 * @param {function(THREE.Points)} onReady Callback function that take as input the new THREE.Points.
 * @param {object} [settings={}]
 * @param {number} [settings.tMin=0] start time. Uses for playing of the points.
 * @param {object} [settings.pointsOptions] points options.
 * See <b>settings.pointsOptions</b> of <a href="../../MyPoints/jsdoc/module-MyPoints.html" target="_blank">MyPoints</a> for details.
 * @param {object} [settings.options={}] see <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> <b>options</b> parameter for details
 * @param {Object} [settings.options.point] point options.
 * See <a href="../../jsdoc/Options/Options.html#point" target="_blank">Options get point</a> member for details.
 * @param {number} [settings.options.scales] Axis scales.
 * See  <b>options.scales</b> of the <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> for details.
 * @param {object} [settings.options.scales.w] w axis scale.
 * See <a href="../../jsdoc/Options/Options.html#setW" target="_blank">Options.setW(options)</a> for details.
*/
function getShaderMaterialPoints( group, arrayFuncs, onReady, settings ) {

	settings = settings || {};

	var geometry;
	const THREE = three.THREE, tMin = settings.pointsOptions === undefined ?
			settings.tMin === undefined ? 0 : settings.tMin :
			settings.pointsOptions.tMin === undefined ? 0 : settings.pointsOptions.tMin;

	settings.options = settings.options || new Options();

	settings.pointsOptions = settings.pointsOptions || {};

	//Эту строку нужно вызывать до создания точек THREE.Points
	//что бы вызывалась моя версия THREE.BufferGeometry().setFromPoints для создания geometry c itemSize = 4
	//потому что в противном случае при добавлени этих точек в FrustumPoints.pushArrayCloud() координата w будет undefined
	Player.assign();
	
	var geometry;
	if ( arrayFuncs instanceof THREE.BufferGeometry ) {

		geometry = arrayFuncs;
		arrayFuncs = [];
		for ( var i = 0; i < geometry.attributes.position.count; i++ )
			arrayFuncs.push( new THREE.Vector3().fromBufferAttribute( geometry.attributes.position, i ) );

	} else if ( typeof arrayFuncs === 'function' )
		geometry = arrayFuncs();
	else geometry = new THREE.BufferGeometry().setFromPoints
		( Player.getPoints( arrayFuncs,
			{ options: settings.options, group: group, t: tMin, } ),
			arrayFuncs[0].vector instanceof THREE.Vector3 ? 3 : 4 );
	const indexArrayCloud = settings.pointsOptions.frustumPoints ? settings.pointsOptions.frustumPoints.pushArrayCloud( geometry ) :  undefined;//индекс массива точек в FrustumPoints.arrayCloud которые принадлежат этому points
	if ( ( settings.pointsOptions === undefined ) || !settings.pointsOptions.boFrustumPoints ) {

		//если не делать эту проверку, то будет неправильный цвет точки, если не задана палитра и шкала w
		if ( !settings.options.scales.w ) settings.options.scales.setW();
		
		geometry.setAttribute( 'ca', new THREE.Float32BufferAttribute( Player.getColors
			( arrayFuncs,
				{

					color: settings.pointsOptions.color,
					colors: settings.pointsOptions.colors,
					opacity: settings.pointsOptions === undefined ? undefined : settings.pointsOptions.opacity,
					positions: geometry.attributes.position,
					options: settings.options,

				} ),
			4 ) );

	}

	const texture = new THREE.TextureLoader().load( currentScriptPath + "/textures/point.png",
		function( texture ){}, function(){}, function(){ console.error('THREE.TextureLoader: error'); } );
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;

	const uniforms = {

		pointTexture: { value: texture },

		pointSize: {

			value: ( settings.pointsOptions !== undefined ) && ( settings.pointsOptions.shaderMaterial !== undefined ) && ( settings.pointsOptions.shaderMaterial.point !== undefined ) ?
				settings.pointsOptions.shaderMaterial.point.size :
					settings.options.point.size

		},

	}

	var cloud;
	if ( ( settings.pointsOptions !== undefined ) && ( settings.pointsOptions.uniforms !== undefined ) )
		cloud = settings.pointsOptions.uniforms( uniforms );


	/**
	 * Loading of the vertex and fragment contents from external files.
	 * Thanks to https://stackoverflow.com/a/48188509/5175935
	 * @param {function()} onLoad Callback function that called after success loading.
	 * */
	function loadShaderText( onload, path ) {

		const shaderText = {};

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

			var vertex_text = _vertex_text.getItem( vertex_url );
			function loadFragment() {

				const fragment_text = _fragment_text.getItem( fragment_url );
				if ( !fragment_text ) {

					//load fragment.c file
					const fragment_loader = new THREE.FileLoader( THREE.DefaultLoadingManager );
					fragment_loader.setResponseType( 'text' );
					fragment_loader.load( fragment_url, function ( fragment_text ) {

						_fragment_text.setItem( fragment_url, fragment_text );
						onLoad( vertex_text, fragment_text );

					}, options.onProgress, options.onError );

				} else onLoad( vertex_text, fragment_text );

			}
			if ( !vertex_text ) {

				//load vertex.c file
				const vertex_loader = new THREE.FileLoader( THREE.DefaultLoadingManager );
				vertex_loader.setResponseType( 'text' );
				vertex_loader.load( vertex_url, function ( vertex_text_new ) {

					_vertex_text.setItem( vertex_url, vertex_text_new );
					vertex_text = vertex_text_new;
					loadFragment();

				}, options.onProgress, options.onError );

			} else {

				loadFragment();

			}

		}

		path = path || {};
		path.vertex = path.vertex || currentScriptPath + "/getShaderMaterialPoints/vertex.c";
		path.fragment = path.fragment || currentScriptPath + "/getShaderMaterialPoints/fragment.c";
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

		const points = new THREE.Points( geometry, new THREE.ShaderMaterial( {

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

		} ) );
		points.userData.shaderMaterial = settings.pointsOptions === undefined ? settings.shaderMaterial : settings.pointsOptions.shaderMaterial;
		if ( settings.options.saveMeshDefault !== undefined )
			settings.options.saveMeshDefault( points );
		if ( ( settings.pointsOptions ) && ( settings.pointsOptions.frustumPoints ) )
			points.userData.cloud = { indexArray: indexArrayCloud, }
		points.userData.shaderMaterial = settings.pointsOptions === undefined ? settings.shaderMaterial : settings.pointsOptions.shaderMaterial;
		onReady( points );

		//Convert all points with cloud and shaderMaterial from local to world positions
		// i.e. calculate scales, positions and rotation of the points.
		//Converting of all points with cloud, but not shaderMaterial see updateCloudPoint in the frustumPoints.create function
		if ( points.userData.boFrustumPoints ) {

			settings.pointsOptions.group.children.forEach( function ( mesh ) {

				settings.options.frustumPoints.updateCloudPoint( mesh );

			} );

		}

		//нужно что бы обновились точки в frustumPoints
		if ( points.material.uniforms.palette !== undefined )
			points.material.uniforms.palette.value.needsUpdate = true;
		if ( points.material.uniforms.cloudPoints !== undefined )
			points.material.uniforms.cloudPoints.value.needsUpdate = true;
		Player.selectMeshPlayScene( points, { options: settings.options } );
		//Что бы камера смотрела на выбранную точку сразу после запуска приложения
		const cameraTarget = settings.options.playerOptions.cameraTarget.get( settings.options );
		if ( cameraTarget && cameraTarget.setCameraPosition ) cameraTarget.setCameraPosition();

	}, settings.pointsOptions === undefined ? undefined : settings.pointsOptions.path );

}
export default getShaderMaterialPoints;
