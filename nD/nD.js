/**
 * @module ND
 * @description N-dimensional graphics
 * @author [Andrej Hristoliubov]{@link https://anhr.github.io/AboutMe/}
 *
 * @copyright 2011 Data Arts Team, Google Creative Lab
 *
 * @license under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * @see [4D Geometry Viewer]{@link https://github.com/anhr/humke-4d-geometry}
 * @see [Tesseract]{@link https://ciechanow.ski/tesseract/}
 * @see [4D-Shapes]{@link https://artemonigiri.github.io/4D-Shapes/}
 * @see [The Regular Polychora]{@link https://www.qfbox.info/4d/regular}
*/

import three from '../three.js'

import MyThree from '../myThree/myThree.js';
//import MyThree from '../../build/myThree.module.js';
//import MyThree from '../../build/myThree.module.min.js';

import PositionController from '../PositionController.js';
import { SpriteText } from '../SpriteText/SpriteText.js'
import MyMath from '../myMath/myMath.js'

/**
dimention	geometry	points	edges	triangle	tetrahedron	pentatope
1			line		2		0
2			triangle	3		3		1
3			tetrahedron	4		6		4			1
4			pentatope	5		10		10			5			1
*/

/*
 	 * <b>settings.geometry.segments: [[0, 1, 1, 2, 2, 0], [0, 1, 1, 3, 3, 0], [0, 2, 2, 3, 3, 0], [1, 2, 2, 3, 3, 1],]</b>,
	 * Every segment is array of idexes of 3 edges of the face of the tetrahedron. Every edge is pair of the indices.
	 *
	 * You can use <a href="#.faceToEdgesIndices" target="_blank">ND.faceToEdgesIndices</a> to create edge indices from face vertex indices.
	 * Example:
	 * <b>settings.geometry.segments: [
	 * 	ND.faceToEdgesIndices( [0, 1, 2] ),
	 * 	ND.faceToEdgesIndices( [0, 1, 3] ),
	 * 	ND.faceToEdgesIndices( [0, 2, 3] ),
	 * 	ND.faceToEdgesIndices( [1, 2, 3] ),
	 * ]</b>
	 * The parameter of every <a href="#.faceToEdgesIndices" target="_blank">ND.faceToEdgesIndices</a> function is an array of indices of 3 vertices of the tetrahedron face.
* */

class ND {

	/** @class
	 * N-dimensional graphics.
	 * Checks for a collision between an n-dimensional plane and an n-dimensional graphics object and returns the (n-1)-dimensional intersection geometry if a collision was occurs.
	 * @param {number} n space dimension of the graphical object.
	 * @param {Object} [settings={}] The following settings are available
	 * @param {Array|Object} [settings.geometry] Array of vertices of the n-dimensional graphical object.
	 * <pre>
	 * Every item of array is n-dimensional vector of vertice of object.
	 * Or Object. See object's keys below.
	 * </pre>
	 * @param {Array} [settings.geometry.position] Array of vertices of the n-dimensional graphical object.
	 * <pre>
	 * Every item of array is n-dimensional vector of vertice of object.
	 * For example, if you want to create a tetrahedron, then you need to create an array of 4 vertices.
	 * <b>settings.geometry.position: [
	 * 	[-0.6, 0.1, 0.8],//0
	 * 	[0.7, 0.5, 0.9],//1
	 * 	[0, -0.4, 0.8],//2
	 * 	[0, 0, -0.6]//3
	 * ]</b>,
	 * </pre>
	 * @param {Array} [settings.geometry.indices] Array of <b>indices</b> of vertices of the n-dimensional graphical object.
	 * Allows for vertices to be re-used across multiple segments.
	 * <pre>
	 * <b>Indices</b> is divided to segments:
	 * 
	 * <b>indices[0]</b> is edges. Every edge is two indexes of the edge's vertices. Used in 1D objects and higher.
	 * <b>indices[1]</b> is faces. Every face is three indexes of the edges from <b>indices[0]</b>. Used in 3D objects and higher.
	 * <b>indices[2]</b> is bodies. Every bodie is four face indexes from <b>indices[1]</b>. Used in 4D objects and higher.
	 * For example:
	 * 
	 * <b>n</b> = 1 line.
	 * <b>settings.geometry.position</b> = [
	 *	[-0.5, 1],//0
	 *	[0.5]//1
	 *]
	 * <b>settings.geometry.indices</b> = [
	 *	[
	 *		0,//index of the settings.geometry.position[0] = [-0.5, 1]
	 *		1,//index of the settings.geometry.position[1] = [0.5]
	 *	]//0
	 *]//0
	 *
	 * <b>n</b> = 2 triangle
	 * <b>settings.geometry.position</b> = [
	 *	[-0.7, 0.2],//0
	 *	[0.8, 0.6],//1
	 *	[0.1, -0.5]//2
	 *],
	 * //edges
	 * <b>settings.geometry.indices[0]</b> = [
	 *	[0, 1],//0 index of the settings.geometry.positions [-0.7, 0.2] and [0.8, 0.6]
	 *	[0, 2],//1 index of the settings.geometry.positions [-0.7, 0.2] and [0.1, -0.5]
	 *	[1, 2] //2 index of the settings.geometry.positions [0.8, 0.6] and [0.1, -0.5]
	 *]
	 *
	 * <b>n</b> = 3 tetrahedron.
	 * <b>settings.geometry.position</b> = [
	 *	[0.8, -0.6, 0.1],//0
	 * 	[0.9, 0.7, 0.5],//1
	 * 	[0.8, 0, -0.4],//2
	 * 	[-0.6, 0.1, 0.1]//3
	 * ],
	 * //edges
	 * <b>settings.geometry.indices[0]</b> = [
	 *	[0, 1]//0 index of the settings.geometry.positions [0.8, -0.6, 0.1] and [0.9, 0.7, 0.5]
	 *	[0, 2]//1 index of the settings.geometry.positions [0.8, -0.6, 0.1] and [0.8, 0, -0.4]
	 *	[0, 3]//2 index of the settings.geometry.positions [0.8, -0.6, 0.1] and [-0.6, 0.1, 0.1]
	 *	[1, 2]//3 index of the settings.geometry.positions [0.9, 0.7, 0.5] and [0.8, 0, -0.4]
	 *	[1, 3]//4 index of the settings.geometry.positions [0.9, 0.7, 0.5] and [-0.6, 0.1, 0.1]
	 *	[2, 3]//5 index of the settings.geometry.positions [0.8, 0, -0.4] and [-0.6, 0.1, 0.1]
	 *]
	 * //faces. Indices of the edges <b>settings.geometry.indices[0]</b>
	 * <b>settings.geometry.indices[1]</b> = [
	 *	[0, 1, 3]//tetrahedron's face 0
	 *	[0, 2, 4]//tetrahedron's face 1
	 *	[3, 4, 5]//tetrahedron's face 2
	 *	[1, 2, 5]//tetrahedron's face 3
	 *]
	 *
	 * <b>n</b> = 4 pentachoron [5-cell]{@link https://en.wikipedia.org/wiki/5-cell}.
	 * <b>settings.geometry.position</b> = [
	 *	[0.8, -0.6, 0.1, -0.85],//0
	 *	[0.9, 0.7, 0.5, -0.55],//1
	 *	[0.8, 0, -0.4, 0],//2
	 *	[-0.6, 0.1, -0.3, 0.55],//3
	 *	[-0.5, 0.2, 0.3, 0.85],//4
	 * ],
	 * //edges
	 * <b>settings.geometry.indices[0]</b> = [
	 *	[0, 1]//0 index of the settings.geometry.positions [0.8, -0.6, 0.1, -0.85] and [0.9, 0.7, 0.5, -0.55]
	 *	[0, 2]//1 index of the settings.geometry.positions [0.8, -0.6, 0.1, -0.85] and [0.8, 0, -0.4, 0]
	 *	[0, 3]//2 index of the settings.geometry.positions [0.8, -0.6, 0.1, -0.85] and [-0.6, 0.1, -0.3, 0.55]
	 *	[0, 4]//3 index of the settings.geometry.positions [0.8, -0.6, 0.1, -0.85] and [-0.5, 0.2, 0.3, 0.85]
	 *	[1, 2]//4 index of the settings.geometry.positions [0.9, 0.7, 0.5, -0.55] and [0.8, 0, -0.4, 0]
	 *	[1, 3]//5 index of the settings.geometry.positions [0.9, 0.7, 0.5, -0.55] and [-0.6, 0.1, -0.3, 0.55]
	 *	[1, 4]//6 index of the settings.geometry.positions [0.9, 0.7, 0.5, -0.55] and [-0.5, 0.2, 0.3, 0.85]
	 *	[2, 3]//7 index of the settings.geometry.positions [0.8, 0, -0.4, 0] and [-0.6, 0.1, -0.3, 0.55]
	 *	[2, 4]//8 index of the settings.geometry.positions [0.8, 0, -0.4, 0] and [-0.5, 0.2, 0.3, 0.85]
	 *	[3, 4]//9 index of the settings.geometry.positions [-0.6, 0.1, 0.1, 0.55] and [-0.5, 0.2, 0.3, 0.85]
	 *]
	 * //faces. Indices of the edges <b>settings.geometry.indices[0]</b>
	 * <b>settings.geometry.indices[1]</b> = [
	 *	[7, 8, 9],//0 no 0, 1 vertices
	 *	[5, 6, 9],//1 no 0, 2 vertices
	 *	[4, 6, 8],//2 no 0, 3 vertices
	 *	[4, 5, 7],//3 no 0, 4 vertices
	 *	[2, 3, 9],//4 no 1, 2 vertices
	 *	[1, 3, 8],//5 no 1, 3 vertices
	 *	[1, 2, 7],//6 no 1, 4 vertices
	 *	[0, 3, 6],//7 no 2, 3 vertices
	 *	[0, 2, 5],//8 no 2, 4 vertices
	 *	[0, 1, 4],//9 no 3, 4 vertices
	 *]
	 * //bodies. Indices of the faces <b>settings.geometry.indices[1]</b>
	 * <b>settings.geometry.indices[2]</b> = [
	 * [2, 1, 3, 0],//0 no 0 vertice
	 * [5, 6, 4, 0],//1 no 1 vertice
	 * [8, 7, 1, 4],//2 no 2 vertice
	 * [9, 7, 2, 5],//3 no 3 vertice
	 * [9, 8, 3, 6],//4 no 4 vertice
	 *]
	 * </pre>
	 * @param {Array} [settings.geometry.segments] Array of segments of indices of vertices of the n-dimensional graphical object.
	 * <pre>
	 * For example, if you want to create a tetrahedron, then you need to create an array of 4 segments.
	 * <b>settings.geometry.segments: [[0, 1, 2],[0, 1, 3],[0, 2, 3],[1, 2, 3],]</b>,
	 * Every segment is array of idexes of the face of the tetrahedron.
	 * 
	 * An easier way to get an array of segments of tetrahedron indices is to use the <a href="#.tetrahedronIndices" target="_blank">ND.tetrahedronSegments</a> method.
	 * <b>settings.geometry.segments: ND.tetrahedronIndices(),</b>
	 * </pre>
	 * @param {Array} [settings.geometry.iAxes] array of indices of the axes.
	 * For example if <b>iAxes</b> is [1,2], then axis 1 interpret as axis 0 and axis 2 interpret as axis 1.
	 * As result, you can rotate axes around another axis to 90 degrees.
	 * In example above you have rotated axis 1 and 2 around axis 0 to 90 degrees.
	 * @param {Array} [settings.vectorPlane] n-dimensional position of the panel
	 * intersecting with the <b>settings.geometry</b> n-dimensional graphical object.
	 * @param {Array|number} [settings.position] Array - position of the n-dimensional graphical object in n-dimensional coordinates.
	 * <pre>
	 * number - position of the 0 coordinate of the n-dimensional graphical object.
	 * <pre>
	 * @param {Array|number} [settings.rotation] Array - rotation in radians of the n-dimensional graphical object in n-dimensional coordinates.
	 * <table>
		 <tr><td><b>n</b> space dimension</td><td>Array index</td><td>Axis of rotation</td><td>Axis type</td></tr>
		 <tr><td>0 no rotation</td></tr>
		 <tr><td>1 no rotation</td></tr>
		 <tr><td>2</td><td>0</td><td></td><td>No effect for 2-dimensional space</td></tr>
		 <tr><td></td><td>1</td><td></td><td>No effect for 2-dimensional space</td></tr>
		 <tr><td></td><td>2</td><td>2(z)</td><td>point</td></tr>
		 <tr><td>3</td><td>0</td>0<td></td><td>No effect for 2-dimensional space</td></tr>
		</table>
	 * <pre>
	 * number - rotation in radians around axis 0 or rotation around axis 2 for 2D objects i.e. space dimension n = 2.
	 * See [Can rotations in 4D be given an explicit matrix form?]{@link https://math.stackexchange.com/questions/1402362/can-rotations-in-4d-be-given-an-explicit-matrix-form}, [Rotation matrix]{@link https://en.wikipedia.org/wiki/Rotation_matrix.}.
	 * <pre>
	 * @param {THREE.Scene} [settings.scene] [THREE.Scene]{@link https://threejs.org/docs/index.html?q=sce#api/en/scenes/Scene}.
	 * Define <b>scene</b> if you want visualise n-dimensional plane and n-dimensional object to 3-D space of the <b>scene</b>.
	 * @param {Options} [settings.options] See <a href="../../jsdoc/Options/Options.html" target="_blank">Options</a>.
	 * Uses only if <b>scene</b> is defined.
	 * @param {Event} [settings.onIntersection] Plane and object intersection event.
	 * The <b>onIntersection</b> function parameter is the (n-1)-dimensional geometry of the intersection if a collision occurred, or undefined if a collision did not occur.
	 * @param {boolean} [settings.boDisplayVerticeID=false] true - displays on the scene the vertice ID near to the vertice.
	 * @see [4D Geometry Viewer]{@link https://github.com/anhr/humke-4d-geometry}
	 * @see [Tesseract]{@link https://ciechanow.ski/tesseract/}
	 * @see [4D-Shapes]{@link https://artemonigiri.github.io/4D-Shapes/}
	 * @see [The Regular Polychora]{@link https://www.qfbox.info/4d/regular}
	 */
	constructor( n, settings = {} ) {

		const options = settings.options, _ND = this;
		settings.geometry = settings.geometry || {};
		if ( settings.geometry instanceof Array ) {

			const position = settings.geometry;
			settings.geometry = { position: position, }

		}

		class Vector {

			/* *
			 * @description
			 * <pre>
			 * An n-dimensional vector is point in an n-dimensional space.
			 * The length of an array is the dimension of the space.
			 * @param {Array} [array=0] array of the values for appropriate axes.
			 * </pre>
			 * @example //Creates a point in 2-dimensional space. -5 is value for 0 axis and 7.8 is value for 1 axis.
			 * const vector = new ND.Vector( [-5, 7.8] );
			 * const n_dimension = vector.length//2
			 * const point = vector.point;//THREE.Vector3( -5, 7.8, 0 )
			 * const vector0 = vector[0]//-5
			 * const vector1 = vector[1]//7.8
			 * @memberof NDVector
			 */
			constructor( array = 0, vectorSettings = {} ) {

				if ( array.isVector ) return array;
				if ( array instanceof Array === false ) {

					if ( typeof array === 'number' ) array = [array];
					else if ( array.array ) array = array.array;
					else console.error( 'ND.Vector: invalid array type' );

				}
				if ( n !== undefined ) while ( array.length < n ) array.push( 0 );

				//https://stackoverflow.com/questions/2449182/getter-setter-on-javascript-array
				return new Proxy( array, {

					get: function ( target, name ) {

						switch ( name ) {

							case "length": return n + 1;
							case "array": return array;
							/* *
							* @description
							* <pre>
							* <b><a href="./NDVector.ND.Vector.html" target="_blank">ND.Vector</a>.point</b>.
							* Projection of the <b>ND.Vector</b> object into 3D space.
							* Returns <b>THREE.Vector3</b> object.
							* Projection of 1-dimensional vector into 3D space: <b>THREE.Vector3( vector[0], 0, 0 ) </b>.
							* Projection of 2-dimensional vector into 3D space: <b>THREE.Vector3( vector[0], vector[1], 0 ) </b>.
							* Projection of 3-dimensional vector into 3D space: <b>THREE.Vector3( vector[0], vector[1], vector[2] ) </b>.
							* </pre>
							* @See <a href="./NDVector.ND.Vector.html" target="_blank">ND.Vector</a>
							*/
							case "point":
								const THREE = three.THREE;
								return new THREE.Vector3( this.get( undefined, 0 ), this.get( undefined, 1 ), this.get( undefined, 2 ) );
							/*
							* Copies the values of the v to this vector.
							*/
/*								
							case "copy":
								return function ( v ) {

									target.forEach( ( value, i ) => target[i] = v[i] );
									return this;

								}
*/
							/*
							* Adds v to this vector.
							*/
							case "add":
								return function ( v ) {

									target.forEach( ( value, i ) => target[i] += v[i] );
									return this;
				
								}
							case "index": return vectorSettings.index;
							case "isVector": return true;

						}
						var i = parseInt( name );
						if ( isNaN( i ) ) {

							console.error( 'Vector.get: invalid name: ' + name );
							return;

						}
						if ( i >= n )
							return 0;
						if ( ( array.length > n ) && settings.geometry.iAxes && ( i < settings.geometry.iAxes.length ) )
							i = settings.geometry.iAxes[i];
						return array[i];

					},
					set: function ( target, name, value ) {

						if ( name === "onChange" ) {

							vectorSettings.onChange = value;
							return vectorSettings.onChange;

						}
						const i = parseInt( name );
						if ( i >= array.length ) {

							array.push( value );
							return array.length;

						}
						array[i] = value;
						_ND.intersection();
						if ( vectorSettings.onChange ) vectorSettings.onChange();
						return true;

					}

				} );

			}
			push( value ) { console.error( 'ND.Vector.push() unavailable' ); }
			pop() { console.error( 'ND.Vector.pop() unavailable' ); }

		}

		function update() {
			
			_ND.intersection();
			object3D.geometry.attributes.position.array = new THREE.BufferGeometry().setFromPoints( geometry.D3.points ).attributes.position.array;
			object3D.geometry.attributes.position.needsUpdate = true;
			options.guiSelectPoint.update();
			object3D.children.forEach( child => {
				
				if ( child.type === 'Sprite' ) child.position.copy( geometry.D3.points[child.userData.pointID] );
					
			} );
			
		}
		if ( !settings.position || !settings.position.isProxy )
			settings.position = new Proxy( settings.position ? settings.position instanceof Array ? settings.position : [settings.position] : [], {

				get: function ( target, name, args ) {

					const i = parseInt( name );
					if ( !isNaN( i ) ) {

						if ( target instanceof Array ) {
							
							if ( i < target.length && ( target[i] !== undefined ) )
								return target[i];
							return 0;

						}
						return target;

					}
					switch ( name ) {

						case 'isProxy': return true;
						case 'folders':
							target.folders = target.folders || [];
							return target.folders;
						case 'arguments': return;//for dat.GUI
						default: console.error( 'ND: settings.position Proxy. Invalid name: ' + name );

					}

				},
				set: function ( target, name, value ) {

					target[name] = value;

					settings.geometry.position.reset();
					
					const input = target.folders[name].cPosition.domElement.querySelector('input');
					if ( parseFloat( input.value ) !== value ) {
						
						input.value = value;
						update();

					}
					return true;
					
				},


			} );

		if ( !settings.rotation || !settings.rotation.isProxy ) {

			settings.rotation = new Proxy( settings.rotation ? settings.rotation instanceof Array ? settings.rotation : [settings.rotation] : [], {

				get: function ( target, name, args ) {

					const i = parseInt( name );
					if ( !isNaN( i ) ) {

						if ( target instanceof Array ) {

							if ( i < target.length && ( target[i] !== undefined ) ) {

								if ( !target.boUseRotation ) {
									
									//https://stackoverflow.com/a/57023880/5175935
									const strFunction = (new Error()).stack.split("\n")[3].trim().split(" ")[1];
									if ( ( strFunction !== "NumberControllerSlider.updateDisplay" ) && ( strFunction !== "NumberControllerBox.updateDisplay" ) )//пользователь изменил угол вращения из dat.GUI
										console.error( 'ND settings.rotation get: use settings.rotation.trigonometry unstead settings.rotation. ' + strFunction )

								}
								return target[i];

							}
							return 0;

						}
						return target;

					}
					switch ( name ) {

						case 'isProxy': return true;
						case 'boUseRotation': return target.boUseRotation;
						case 'folders':
							target.folders = target.folders || [];
							return target.folders;
						case 'trigonometry':
							if ( !target.trigonometry ){

								target.trigonometry = new Proxy( [], {

									get: function ( target, name, args ) {

										const i = parseInt( name );
										if ( !isNaN( i ) ) {

											if ( !target[i] ) {

												settings.rotation.boUseRotation = true;
												const angle = settings.rotation[i];
												settings.rotation.boUseRotation = false;
												target[i] = { sin: Math.sin( angle ), cos: Math.cos( angle ) };
												
											}
											return target[i];

										}
										switch ( name ) {

											default: console.error( 'ND: settings.rotation Proxy. Invalid name: ' + name );

										}

									},
									set: function ( target, name, value ) {

										target[name] = value;
										if ( isNaN( parseInt( name ) ) ) return true;
										return true;

									},


								} );
								
							}
							return target.trigonometry;
						case 'isRotation': return function() {
							
							target.boUseRotation = true;
							var boRotation = false
							for ( var j = 0; j < n; j++ ) {
									
								if ( settings.rotation[j] !== 0 ) {
									
									boRotation = true;
									break;

								}
									
							}
							target.boUseRotation = false;
							return boRotation;
						
						}
						case 'arguments': return;//for dat.GUI
						default: console.error( 'ND: settings.rotation Proxy. Invalid name: ' + name );

					}

				},
				set: function ( target, name, value ) {

					target[name] = value;
					if ( isNaN( parseInt( name ) ) ) return true;

					settings.rotation.trigonometry[name].cos = Math.cos( value );
					settings.rotation.trigonometry[name].sin = Math.sin( value );
					
					settings.geometry.position.reset();

					const input = target.folders[name].cRotation.domElement.querySelector( 'input' );
					if ( parseFloat( input.value ) !== value ) {

						input.value = value;
						update();

					}
					return true;

				},


			} );
			settings.rotation.boUseRotation = false;

		}

		if ( settings.geometry.position.target ) settings.geometry.position = settings.geometry.position.target;
		settings.geometry.position.boPositionError = true;
		const rotationAxes = [[]];//массив осей вращения
		const positionWorld = new Proxy( settings.geometry.position ? settings.geometry.position : [], {
	
			get: function ( target, name ) {

				const i = parseInt( name );
				if ( !isNaN( i ) ) {

					settings.geometry.position.boPositionError = false;
					const positionPoint = settings.geometry.position[i];
					if ( positionPoint.positionWorld ) {
						
						//не надо снова вычислять мировые координатя точки если они уже вычислены
						settings.geometry.position.boPositionError = true;
						return positionPoint.positionWorld;

					}
					const array = [];
					if ( positionPoint !== undefined ) {

						if ( !( settings.position instanceof Array ) ) {

							console.error( 'ND positionWorld get: settings.position is not array' );
							settings.position = [settings.position];

						}
						if ( settings.rotation.isRotation() ) {

							//https://math.stackexchange.com/questions/1402362/can-rotations-in-4d-be-given-an-explicit-matrix-form
							//https://en.wikipedia.org/wiki/Rotation_matrix
							function getMatrix( index ) {

								const cos = settings.rotation.trigonometry[index].cos, sin = settings.rotation.trigonometry[index].sin,
									array = [];
								/*
								if ( n === 5 ) {

									switch ( index ) {

										case 0://0,1,2
											array.push( [cos, -sin, 0, 0, 0] );
											array.push( [sin, cos, 0, 0, 0] );
											array.push( [0, 0, 1, 0, 0] );
											array.push( [0, 0, 0, 1, 0] );
											array.push( [0, 0, 0, 0, 1] );
											break;
										case 1://0,1,3
											array.push( [cos, 0, -sin, 0, 0] );
											array.push( [0, 1, 0, 0, 0] );
											array.push( [sin, 0, cos, 0, 0] );
											array.push( [0, 0, 0, 1, 0] );
											array.push( [0, 0, 0, 0, 1] );
											break;
										case 2://0,1,4
											array.push( [cos, 0, 0, -sin, 0] );
											array.push( [0, 1, 0, 0, 0] );
											array.push( [0, 0, 1, 0, 0] );
											array.push( [sin, 0, 0, cos, 0] );
											array.push( [0, 0, 0, 0, 1] );
											break;
										case 3://0,2,3
											array.push( [cos, 0, 0, 0, -sin] );
											array.push( [0, 1, 0, 0, 0] );
											array.push( [0, 0, 1, 0, 0] );
											array.push( [0, 0, 0, 1, 0] );
											array.push( [sin, 0, 0, 0, cos] );
											break;
										case 4://0,2,4
											array.push( [1, 0, 0, 0, 0] );
											array.push( [0, cos, -sin, 0, 0] );
											array.push( [0, sin, cos, 0, 0] );
											array.push( [0, 0, 0, 1, 0] );
											array.push( [0, 0, 0, 0, 1] );
											break;
										case 5://0,3,4
											array.push( [1, 0, 0, 0, 0] );
											array.push( [0, cos, 0, -sin, 0] );
											array.push( [0, 0, 1, 0, 0] );
											array.push( [0, sin, 0, cos, 0] );
											array.push( [0, 0, 0, 0, 1] );
											break;
										case 6://1,2,3
											array.push( [1, 0, 0, 0, 0] );
											array.push( [0, cos, 0, 0, -sin] );
											array.push( [0, 0, 1, 0, 0] );
											array.push( [0, 0, 0, 1, 0] );
											array.push( [0, sin, 0, 0, cos] );
											break;
										case 7://1,2,4
											array.push( [1, 0, 0, 0, 0] );
											array.push( [0, 1, 0, 0, 0] );
											array.push( [0, 0, cos, -sin, 0] );
											array.push( [0, 0, sin, cos, 0] );
											array.push( [0, 0, 0, 0, 1] );
											break;
										case 8://1,3,4
											array.push( [1, 0, 0, 0, 0] );
											array.push( [0, 1, 0, 0, 0] );
											array.push( [0, 0, cos, 0, -sin] );
											array.push( [0, 0, 0, 1, 0] );
											array.push( [0, 0, sin, 0, cos] );
											break;
										case 9://2,3,4
											array.push( [1, 0, 0, 0, 0] );
											array.push( [0, 1, 0, 0, 0] );
											array.push( [0, 0, 1, 0, 0] );
											array.push( [0, 0, 0, cos, -sin] );
											array.push( [0, 0, 0, sin, cos] );
											break;
										default: console.error( 'nD: positionWorld getMatrix. n = ' + n + ' invalid index =  ' + index );

									}

								} else if ( n === 4 ) {

									switch( index ) {

										case 0://xy
											array.push( [cos, -sin, 0, 0] );
											array.push( [sin,  cos, 0, 0] );
											array.push( [0,      0, 1, 0] );
											array.push( [0,      0, 0, 1] );
											break;
										case 1://xz
											array.push( [cos, 0, -sin, 0] );
											array.push( [0,   1,    0, 0] );
											array.push( [sin, 0,  cos, 0] );
											array.push( [0,   0,    0, 1] );
											break;
										case 2://xw
											array.push( [cos, 0, 0, -sin] );
											array.push( [0,   1, 0,    0] );
											array.push( [0,   0, 1,    0] );
											array.push( [sin, 0, 0,  cos] );
											break;
										case 3://yz
											array.push( [1,   0,    0, 0] );
											array.push( [0, cos, -sin, 0] );
											array.push( [0, sin,  cos, 0] );
											array.push( [0,   0,    0, 1] );
											break;
										case 4://yw
											array.push( [1,   0, 0,    0] );
											array.push( [0, cos, 0, -sin] );
											array.push( [0,   0, 1,    0] );
											array.push( [0, sin, 0,  cos] );
											break;
										case 5://zw
											array.push( [1, 0,   0,    0] );
											array.push( [0, 1,   0,    0] );
											array.push( [0, 0, cos, -sin] );
											array.push( [0, 0, sin,  cos] );
											break;
										default: console.error( 'nD: positionWorld getMatrix. n = ' + n + ' invalid index =  ' + index );
			
									}
									
								} else if ( n === 2 ) {

									//https://ru.wikipedia.org/wiki/%D0%9C%D0%B0%D1%82%D1%80%D0%B8%D1%86%D0%B0_%D0%BF%D0%BE%D0%B2%D0%BE%D1%80%D0%BE%D1%82%D0%B0
									array.push( [cos, -sin] );
									array.push( [sin, cos] );
									
								}*/
								const tI = rotationAxes[index].tI;
								for ( var i = 0; i < n; i++ ) {

									const row = [];
									for ( var j = 0; j < n; j++ ) {

										if ( n === 3 ) {

											const iR = n - i - 1, jR = n - j - 1;

											if ( ( iR === tI[0] ) && ( jR === tI[0] ) ) row.push( cos );
											else if ( ( iR === tI[0] ) && ( jR === tI[1] ) ) row.push( sin );
											else if ( ( iR === tI[1] ) && ( jR === tI[0] ) ) row.push( -sin );
											else if ( ( iR === tI[1] ) && ( jR === tI[1] ) ) row.push( cos );
											else if ( iR === jR ) row.push( 1 );
											else row.push( 0 );

										} else {

											if ( ( i === tI[0] ) && ( j === tI[0] ) ) row.push( cos );
											else if ( ( i === tI[0] ) && ( j === tI[1] ) ) row.push( -sin );
											else if ( ( i === tI[1] ) && ( j === tI[0] ) ) row.push( sin );
											else if ( ( i === tI[1] ) && ( j === tI[1] ) ) row.push( cos );
											else if ( i === j ) row.push( 1 );
											else row.push( 0 );

										}

									}
									array.push( row );

								}
//								return math.matrix( array );
								return new MyMath.Matrix( array );

							}
							var m3;

							if ( rotationAxes[0].length === 0 ) {

								//create rotation axies

								//первый ряд

								//индексы рядов и колонок матрицы, в которые заносятся значения тригонометрических функций
								//Тригонометрические функци надо внестив следующие 4 ячейки матрицы:
								//m[tI[0], tI[0]] = cos, m[tI[0], tI[1]] = -sin, m[tI[1], tI[0]] = sin, m[tI[1], tI[1]] = cos.
								//const tI = [0,1];
								//Для первой матрицы получается
								//m[0, 0] = cos, m[0, 1] = -sin, m[1, 0] = sin, m[1, 1] = cos.

								if ( n === 2 ) rotationAxes[0].push( 2 );//в двумерном пространстве вращение вокруг оси 2
								else for ( var j = 0; j < ( n - 2 ); j++ ) rotationAxes[0].push( j );
								rotationAxes[0].tI = [0, 1];

								const iLastColumn = rotationAxes[0].length - 1;

								var boLastRow = false;

								while ( !boLastRow ) {

									const iLastRow = rotationAxes.length - 1, lastRow = rotationAxes[iLastRow],
										row = [];

									for ( var j = iLastColumn; j >= 0; j-- ) {

										const prevColumn = lastRow[j];
										var iAxis;//индекс оси
										if ( j === iLastColumn ) iAxis = prevColumn + 1;//увеличить на 1 последнюю колонку
										else iAxis = prevColumn;
										if ( iAxis >= n ) {

											function createRow( j ) {

												if ( j <= 0 ) return false;//последний ряд
												//если это последняя колонка и если индекс оси больше количества осей в n пространстве
												//увеличить индекс оси в предыдущей колонке
												const prevRowColumn = lastRow[j - 1] + 1;
												//предыдущая колонка не может больше или рано текушей колонке в предыдущем ряде
												if ( prevRowColumn >= lastRow[j] ) return createRow( j - 1 );
												row[j - 1] = prevRowColumn;
												//индекс оси в текущей колонке равен индексу в предыдущей колонке плюс 1
												row[j] = row[j - 1] + 1;

												//все последующие колонки увеличиваются на единицу
												for ( var k = j + 1; k <= iLastColumn; k++ ) row[k] = row[k - 1] + 1;

												//копируем из последнего ряда оставшиеся колонки слева 
												j = j - 2;
												while ( j >= 0 ) {

													row[j] = lastRow[j];
													j--;

												}
												return true;

											}
											boLastRow = !createRow( j );
											break;

										}
										else row[j] = iAxis;

									}
									if ( !boLastRow ) {

										row.tI = [lastRow.tI[0]];
										var tI1 = lastRow.tI[1] + 1;
										if ( tI1 >= n ) {

											row.tI[0]++;
											tI1 = row.tI[0] + 1;

										}
										row.tI[1] = tI1;
										if ( row.length === 0 ) {

											console.error( 'ND positionWorld get: row is empty' );
											break;

										}
										rotationAxes.push( row );

										//debug
										if ( iLastRow === rotationAxes.length - 1 ) {

											console.error( 'ND positionWorld get: row is not added' );
											break;

										}
										/*
										if ( iLastRow >= 100 ) {
		
											console.error( 'ND positionWorld get: Invalid iLastRow = ' + iLastRow );
											break;
		
										}
										*/

									}

								}

							}

							/*
							//test
							{

								const a = [
										[1, 2],
										[3, 4],
										[5, 6],
									],
									b = [
										[7,   8, 9 ,10],
										[11, 12, 13,14],
									],
									v = [15, 16, 17, 18];
								const c = new MyMath.Matrix( a ).multiply( b );
								const cv = c * v;
								//const cv = c.multiply( v );
								console.log(cv);
								
								const m1 = math.matrix( a ),
									m2 = math.matrix( b ),
									c2 = math.multiply( m1, m2 );
								const cv2 = math.multiply( c2, v );
								console.log(cv2);

							}
							*/
							if ( n === 2 ) m3 = getMatrix( 0 );//вращение только вокруг оси 2
							for ( var j = 0; j < rotationAxes.length; j++ ) {

								const m = getMatrix( j );
								if ( m3 ) m3 = m3.multiply( m );//m3 = math.multiply( m3, m );
								else m3 = m;
	
							}
							var position = [];
							for ( var j = 0; j < n; j++ ) position.push( positionPoint[j] );
//							const p2 = math.multiply( m3, position );
							const p = m3.multiply( position );
							p.forEach( ( value, i ) => {

								if ( value !== undefined ) {

									array.push( value + settings.position[i] );

								} else console.error( 'ND: positionWorld get: invalig array item = ' + value );

							} )

						} else {

							positionPoint.forEach( ( value, j ) => array.push( positionPoint[j] + settings.position[j] ) );

						}

					} else console.error('ND positionWorld get index')
					positionPoint.positionWorld = array;
					settings.geometry.position.boPositionError = true;
					return array;

				}
				switch ( name ) {

					case 'push': return settings.geometry.position.push;
					case 'length': return settings.geometry.position.length;
					case 'forEach': return settings.geometry.position.forEach;
					case 'isProxy': return true;
					case 'target': return;// target; Если вершинрнуть target, то неверно сработает if ( settings.geometry.position.target ) и позиция intersection будет неверна
					case 'copy': 
						return function () {

							const v = [];
							settings.geometry.position.boPositionError = false;
							settings.geometry.position.forEach( ( value, i ) => {
								
								v[i] = positionWorld[i];
								settings.geometry.position.boPositionError = false;
							
							} );
							settings.geometry.position.boPositionError = true;
							return v;
		
						}
					default: console.error( 'ND: positionWorld Proxy. Invalid name: ' + name );

				}

			},
			
		} );

		var _prevLine;

		//For debug Вылавливает случаи вызова settings.geometry.position вместо positionWorld
		if ( !settings.geometry.position.isProxy )
			settings.geometry.position = new Proxy( settings.geometry.position ? settings.geometry.position : [], {
	
				get: function ( target, name, args ) {
	
					const i = parseInt( name );
					if ( !isNaN( i ) ) {
	
						if ( settings.geometry.position.boPositionError ) {

							//срабатывает когда меняется позиция вершины.
							//Не хочу менять boPositionError в этом случае, потому что это может происходить на веб странице пользователя
							//console.error( 'ND: Use positionWorld instread settings.geometry.position' );

						}
						if ( i >= target.length ) {

							console.error( 'ND get settings.geometry.position: invalid index = ' + i );
							return;
							
						}
						if ( target[i] instanceof Array ) {

//							return target[i];
							return new Proxy( target[i], {

								get: function ( target, name, args ) {

									const i = parseInt( name );
									if ( !isNaN( i ) ) {

										return target[i];

									}
									switch ( name ) {

										case 'positionWorld': return target.positionWorld;
										case 'forEach': return target.forEach;
										case 'length': return target.length;
										case 'indices': return target.indices;
										case 'i': return target.i;
										case 'arguments': return target.arguments;
/*
										case 'push': return target.push;
										case 'forEach': return target.forEach;
										case 'isProxy': return true;
										case 'boPositionError': return target.boPositionError;
										case 'target': return target;
*/
										default: console.error( 'ND: settings.geometry.position[i] Proxy. Invalid name: ' + name );

									}

								},
								set: function ( target, name, value ) {

									const i = parseInt( name );
									target[name] = value;
									if ( !isNaN( i ) ) {
										
										target.positionWorld = undefined;
/*
										_prevLine.children.forEach( item => {

											if ( item.type != 'Sprite' ) {
												
												item.geometry.attributes.position.array = new THREE.BufferGeometry().setFromPoints( geometry.D3.points ).attributes.position.array;
												item.geometry.attributes.position.needsUpdate = true;

											}
												
										} )
*/
										_prevLine.geometry.attributes.position.array = new THREE.BufferGeometry().setFromPoints( geometry.D3.points ).attributes.position.array;
										_prevLine.geometry.attributes.position.needsUpdate = true;
										update();//изменилась позиция вершины

									}
									return true;

								},

							} );

						}
						console.error( 'ND: get settings.geometry.position is not array.' )
						return  [target[i]];
	
					}
					switch ( name ) {
	
						case 'push': return target.push;
						case 'length': return target.length;
						case 'forEach': return target.forEach;
						case 'isProxy': return true;
						case 'boPositionError': return target.boPositionError;
						case 'target': return target;
						/*
						* Returns a new vector with the same values as this one.
						*/
						case "clone":
							return function ( i ) {

								const v = [];
								target[i].forEach( ( value, j ) => v[j] = target[i][j] );
								return v;
			
							}
						case "reset":
							return function () {

								target.forEach( item => item.positionWorld = undefined );

							}
						default: console.error( 'ND: settings.geometry.position Proxy. Invalid name: ' + name );
	
					}
	
				},
				set: function ( target, name, value ) {

					const i = parseInt( name );
					if ( !isNaN( i ) ) {

						//изменилась позиция вершины
						return true;
						
					}
					target[name] = value;

//if ( name != 'boPositionError' )
//	console.log('ND settings.geometry.position set: name = ' + name );
					
//					settings.geometry.position.reset();

					return true;

				},
				
			} );

		//indices

		if ( !settings.geometry.indices ) {

			settings.geometry.indices = [];
			settings.geometry.indices.boAddIndices = true;
			
		}
//		settings.geometry.indices = settings.geometry.indices || [];

		//edges
		var edges = settings.geometry.indices[0], boArray = edges instanceof Array;
		if ( !settings.geometry.indices[0] || boArray ) {

			function proxyEdges( newEdges ) {

				edges = newEdges || edges;
				return new Proxy( edges ? edges : [],
					{

						get: function ( target, name, value ) {

							const i = parseInt( name );
							if ( !isNaN( i ) )
								return {

									intersection: function ( geometryIntersection ) {

										const i = parseInt( name );
										if ( !isNaN( i ) ) {

											if ( i.toString() !== name ) {

												console.error( 'ND: settings.geometry.indices[]intersection. invalid name = ' + name );
												return;

											}
											if ( target.length === 0 ) return;//no edges
											if ( i >= target.length ) {
												
												console.error( 'ND: settings.geometry.indices[]intersection. invalid length: ' + target.length );
												this.indices = { intersection: {} };
												return;

											}
											var indices = target[i];
											
											//Когда размерность графического оъекта меньше 3
											//и когда он создается из объета большей размерности
											//то indices это прокси
											if ( indices.indices ) indices = indices.indices;
											
											if ( indices.length !== 2 ) {

												console.error( 'ND: settings.geometry.indices[]intersection. indices.length = ' + indices.length );
												return;

											}
											if ( indices[0] === indices[1] ) {

												console.error( 'ND: settings.geometry.indices[]intersection. indices[0] === indices[1] = ' + indices[0] );
												return;

											}
											const position0 = new Vector( positionWorld[indices[0]] ),
												position1 = new Vector( positionWorld[indices[1]] );
											function indicesIntersection( position ) {

												switch ( n ) {

													case 2:
														break;
													default:
														if ( !position )
															break;
														position.push( vectorPlane[n - 1] );
														break;

												}
												indices.intersection = { position: position, }
												if ( indices.intersection.position ) indices.intersection.position.iEdge = i;

											}
											switch ( n ) {

												case 1:
													if ( vectorPlane[0].between( position0[0], position1[0], true ) )
														geometryIntersection.position.push( [vectorPlane[0]] );
													break;
												case 2:
													var vector;
													if ( vectorPlane[1].between( position0[1], position1[1], true ) ) {

														const a = ( position1[1] - position0[1] ) / ( position1[0] - position0[0] ),
														b = position0[1] - a * position0[0],
														x = ( a === 0 ) || isNaN( a ) || ( Math.abs( a ) === Infinity ) ?
															position1[0] :
															( vectorPlane[1] - b ) / a;
														if ( isNaN( x ) || ( x === undefined ) ) { console.error( 'ND.intersection: x = ' + x + ' position1[0] = ' + position1[0] + ' position0[0] = ' + position0[0] ); }

														//Если x почти равно position0[0] и position0[0] то будем считать что x между ними
														const d = 1e-15;//-1.1102230246251565e-16 
														if ( !x.between( position0[0], position1[0], true ) ) {
															
															if ( ! ( ( Math.abs( x - position0[0] ) < d ) && ( Math.abs( x - position0[0] ) < d ) ) ) {
																
																indices.intersection = {};
																break;

															}
//else console.log('x почти равно position0[0] и position0[0]');

														}
														vector = [x, vectorPlane[1]];

													}
													indicesIntersection( vector );
													break;
												case 3:

													var pos;
													
													//Если позиции вершины находится на этом расстоянии от панели, то будем считать, что она находится на панели
													//Для проверки запустить canvas 3D с geometry Variant 1 и проигрыватель в точке t = 0.6.
													//
													//В примере canvas 3D с geometry.position Variant 2 вершина точно находится на панели
													const d = 5.56e-17;
													
													if ( Math.abs( vectorPlane[n - 1] - position1[n - 1] ) < d ) pos = position1;
													else if ( Math.abs( vectorPlane[n - 1] - position0[n - 1] ) < d ) pos = position0;
													if ( pos ) {

														//Вершина находится на панели.
														//Для проверки запустить canvas 3D и установить время проигрывателя t = 0.3 так чтобы вершина 2 пирамиды попала на панель
														//В этом случает треугольник пересечения сведется к трем точкам с одинаковыми координатами.
														indicesIntersection( [pos[0], pos[1]] );
														indices.intersection.boVerticeOnPanel = true;

													} else {

														const nD02 = new ND( n - 1, {

															geometry: {

																position: positionWorld.copy(),//settings.geometry.position,
																indices: [[indices]],
																iAxes: [1, 2],

															},
															vectorPlane: vectorPlane.array,

														} ),
															arrayIntersects02 = nD02.intersection();
														const nD12 = new ND( n - 1, {

															geometry: {

																position: positionWorld.copy(),//settings.geometry.position,
																indices: [[indices]],
																iAxes: [0, 2],

															},
															vectorPlane: vectorPlane.array,

														} ),
															arrayIntersects12 = nD12.intersection();
														indicesIntersection( arrayIntersects02.length && arrayIntersects12.length ?
															[arrayIntersects12[0][0], arrayIntersects02[0][0]] : undefined );

													}
													break;
												default:

													function intersectionAxis( axis ) {

														const nD0 = new ND( 2, {

															geometry: {

																position: positionWorld,//settings.geometry.position,
																indices: [[indices]],
																iAxes: [axis, n - 1],

															},
															vectorPlane: vectorPlane.array,

														} );
														return nD0.intersection();

													}
													const arrayIntersections = [];
													var boIntersect = true;
													for ( var iIntersection = 0; iIntersection < n - 1; iIntersection++ ) {
														
														const item = intersectionAxis( iIntersection );
														if ( boIntersect && ( item.length === 0 ) ) {
															
															boIntersect = false;
															break;

														}
														if ( item.length ) arrayIntersections.push( item[0][0] );

													}
													indicesIntersection( boIntersect ? arrayIntersections : undefined );

											}

										} else console.error( 'ND: settings.geometry.indices[]intersection. invalid name: ' + name );

									},
									indices: target[parseInt( name )],

								};
							switch ( name ) {

								case 'push': return target.push;
								case 'length': return target.length;
								case 'intersection': return undefined;
								case 'edges': return target;
								case 'isProxy': return true;
								default: console.error( 'ND: settings.geometry.indices getter. Invalid name: ' + name );

							}

						},
						set: function ( edges, prop, value ) {

							const index = parseInt( prop );
							if ( isNaN( index ) ) {

								switch ( prop ) {

									case 'length':
										break;
									case 'edges':
										settings.geometry.indices[0] = proxyEdges( value );
										break;
									default: console.error( 'ND settings.geometry.indices[0].set: invalid prop: ' + prop );

								}
								return true;

							}

							if ( value instanceof Array ) {

								//Do not add a duplicate edge
								for ( var i = 0; i < edges.length; i++ ) { 

									const edge = edges[i];
									if (
										( ( edge[0] === value[0] ) && ( edge[1] === value[1] ) ) ||
										( ( edge[1] === value[0] ) && ( edge[0] === value[1] ) )
									) {
										
										value.index = i;
										return true;

									}
										
								}
								
								edges[index] = value;
								value.index = index;
								return true;

							}
							const indices = value;
							if ( indices.length !== 2 ) {

								console.error( 'ND: settings.geometry.indices.push invalid indices.length = ' + indices.length );
								return true;

							}

							//find duplicate edge
							for ( var i = 0; i < edges.length; i++ ) {

								const edgeIndices = edges[i];
								if ( ( edgeIndices[0] === indices[0] ) && ( edgeIndices[1] === indices[1] ) ) {

									console.error( 'ND: settings.geometry.indices.push under constraction' );
									return;

								}
								if ( ( edgeIndices[0] === indices[1] ) && ( edgeIndices[1] === indices[0] ) ) {


									console.error( 'ND: settings.geometry.indices.push under constraction' );
									//у этого ребра есть ребро близнец, у которого индексы вершин поменены местами
									//Поэтому можно не искать точку пересечения а брать ее из близнеца
									indices[0] = settings.geometry.indices[i].indices[0];
									indices[1] = settings.geometry.indices[i].indices[1];
									return;

								}

							}

							edges[index] = value;
							return true;

						}

					} );

			}
			const indices = settings.geometry.indices;
			if ( boArray ) { if ( !indices[0].isProxy ) indices[0] = proxyEdges(); }
			else indices.push( proxyEdges() );

		}
		
		//Сгруппировать индексы ребер объета из settings.geometry.edges по сегментам обекта
		//Например если объект это линия:
		//n = 1
		//settings.geometry.indices = [0, 1]//одно ребро
		//settings.geometry.edges = [0, 1]
		//settings.geometry.iEdges = [0]
		//где
		// 0, //индекс ребра [0, 1] из settings.geometry.edges 
		//
		//Объект это треугольник:
		//n = 2
		//settings.geometry.indices = [[0, 1], [1, 2], [0, 2]]//3 ребра
		//settings.geometry.edges = [[0, 1], [1, 2], [0, 2]]
		//settings.geometry.iEdges = [0, 1, 2]
		//где
		// 0, //индекс первого  ребра [0, 1] из settings.geometry.edges 
		// 1, //индекс второго  ребра [0, 2] из settings.geometry.edges 
		// 2, //индекс третьего ребра [1, 2] из settings.geometry.edges 
		//
		//Объект это пирамида:
		//n = 3
		//settings.geometry.indices = [
		//	[[0, 1], [1, 2], [2, 0]],
		//	[[0, 1], [1, 3], [3, 0]],
		//	[[0, 2], [2, 3], [3, 0]],
		//	[[1, 2], [2, 3], [3, 1]]
		//]
		//4 грани 6 ребер. 
		//settings.geometry.edges = 0: (2) [
		//	[0, 1],//0
		//	[1, 2],//1
		//	[2, 0],//2
		//	[1, 3],//3
		//	[3, 0],//4
		//	[2, 3]//5
		//]
		//ребра [0, 2] и [3, 1] заменяю на [2, 0] и [1, 3]
		//settings.geometry.iEdges = [[0, 1, 2], [0, 3, 4], [2, 5, 4], [1, 5, 3]]
		
		function addEdge( indices ) {

			if ( settings.geometry.position.length < 2 ) return;//одна точка не имеет ребер
			switch ( n ) {

				case 1://Example [[0,1]]
					const edges = settings.geometry.indices[0];
					if ( settings.geometry.position ) {
						
						indices = [];
						positionWorld.forEach( function ( indice, i ) { indices.push( i ) } );
						edges.push( indices );

					}
					break;
				default: console.error( 'ND: default edges failed! n = ' + n );

			}

		}
		function proxySegments() {

			return new Proxy( [], {

				get: function ( target, name ) {

					const i = parseInt( name );
					if ( !isNaN( i ) )
						return target[i];
					switch ( name ) {

						case 'push': return target.push;
						case 'length': return target.length;
						case 'isProxy': return true;
						default: console.error( 'ND: settings.geometry.indices[' + l + ']. Invalid name: ' + name );

					}

				},
				set: function ( target, name, value ) {

					const index = parseInt( name );
					if ( isNaN( index ) ) {

						switch ( name ) {

							case 'length':
								break;
							default: console.error( 'ND settings.geometry.indices[' + l + ']: invalid name: ' + name );
								return false;

						}
						return true;

					}
					if ( value instanceof Array === false ) {

						console.error( 'ND settings.geometry.indices[' + l + ']: invalid name: ' + name );
						return false;

					}

					//remove duplicate indices from value
					for ( var i = value.length - 1; i >= 0; i--  ) {
						
						for ( var j = i - 1; j >= 0; j--  ) {

							if ( value[i] === value[j] ) {

								console.error( 'nD proxySegments() set: duplicate index = ' + value[i] );
								value.splice( i, 1 );
								continue;
								
							}
							
						}

						
					}

					//Do not add a duplicate segment
					for ( var i = 0; i < target.length; i++ ) {

						const segment = target[i],
							aDetected = [];//список индексов, которые уже встечались в текущем сегменте
						if ( segment.length !== value.length )
							continue;//segment не может быть дупликатным если его длинна не равно длинне value
						for ( var j = 0; j < segment.length; j++ ) {

							aDetected[j] = false;
							for ( var k = 0; k < value.length; k++ ) {

								if ( segment[j] === value[k] ) {

									aDetected[j] = true;
									break;

								}

							}

						}
						var boDetected = true;
						for ( var j = 0; j < aDetected.length; j++ ) {

							if ( !aDetected[j] ) {

								boDetected = false;
								break;

							}

						}
						if ( boDetected ) {

							value.index = i;
							return true;

						}

					}

					target[index] = value;
					value.index = index;
					return true;

				}

			} );

		}
		function addEdges( level, geometry, positionIndices = [], levelIndices ) {

			if ( positionIndices.length === 0 ) positionWorld.forEach( function ( position, i ) { positionIndices.push( i ) } );
			geometry = geometry || settings.geometry;
			if ( !geometry.indices[0] ) geometry.indices[0] = [];
			const edges = geometry.indices[0];
			if ( ( n === 2 ) && ( geometry.position.length === 2 ) ) {

				edges.push( [0, 1] );
				return;

			}
			if ( level === undefined ) return;
			if ( level > 2 ) { 
				
				for ( var i = 0; i < positionIndices.length; i++ ) {

					const posIndices = [];
					positionIndices.forEach( function ( indice, j ) { if ( positionIndices[i] !== positionIndices[j] ) posIndices.push( positionIndices[j] ); } );
					const lIndices = [];//тут перечислены индексы всех индексов, котоые были добавлены в settings.geometry.indices
					addEdges( level - 1, undefined, posIndices, lIndices );
					if ( lIndices.length ) {

						const l = level - 2;
						if ( l === 0 ) console.error( 'ND addEdges: invalid l = ' + 1 );
						settings.geometry.indices[l] = settings.geometry.indices[l] === undefined ? proxySegments() : settings.geometry.indices[l];
						settings.geometry.indices[l].push( lIndices );
						if ( levelIndices ) levelIndices.push( lIndices.index );

					}

				}

			}
			switch ( level ) {

				case 2:
					
					//перечислены индексы вершин, которые образуют грань и которые составляют замкнутую линию реьер грани.
					//По умолчанию для грани в виде треугольника индексы вершин совпадают с положением вершины в 
					//settings.geometry.position т.е. positionIndices = [0, 1, 2]
					if ( !positionIndices ) {
						
						positionIndices = [];
						settings.geometry.position.forEach( function ( item, i ) { positionIndices.push( i ) } );

					}
					const length = positionIndices.length;
					
					function addItem( start = 0 ) {
						
						for ( var i = start; i < length; i++ ) {
							
							if ( start === 0 )
								addItem( i + 1 );
							else {
								
								const edge = [ positionIndices[start - 1], positionIndices[i] ];
								edges.push( edge );
								if ( levelIndices ) levelIndices.push( edge.index );

							}
		
						}
		
					}
					addItem();
					break;
				
			}

		}
		switch ( n ) {

			case 1://[0, 1]
				addEdge();
				break;
			default: if ( settings.geometry.indices[0].length === 0 )  addEdges( n );

		}

		if ( settings.geometry.indices.boAddIndices ) {
			//В каждом сегменте geometry.indices[i] должно встечаться определенное количество индексов из передыдущего сегмента
			//geometry.indices[i - 1]. В противном случае в geometry.indices[i] добавляем новый элемент, в который добавляем
			//индексы из передыдущего сегмента geometry.indices[i - 1].
			//Это нужно для того, что бы во время пересечения объекта с plane появлялся замкнутый intersection.
			//Например после пересечения 3 мерного объекта с plane получалась замкнутая линия, тоесть начало и конец линии соединяем дополнительным ребром.
			//Для проверки в примере запускаем _4D и _3D
			const indices = settings.geometry.indices;
			for( var i = 1; i < indices.length; i++ ) {
	
				const indice = indices[i];
				const arrayIndices = [];//Каждый элемент этого массива показывает сколько раз встречается индекс в сегменте geometry.indices[i].
				var max = 0;//максимальное количество сколько раз встречается индекс в сегменте geometry.indices[i].
				for ( var j = 0; j < indice.length; j++ ) {
	
					const segment = indice[j];
					for ( var k = 0; k < segment.length; k++ ) {
	
						const index = segment[k];
						if ( arrayIndices[index] === undefined ) arrayIndices[index] = 0;
						arrayIndices[index]++;
						if ( arrayIndices[index] > max ) max = arrayIndices[index];
	
					}
						
				}
				const arraySegment = [];//сюда добавляю все индексы, котоые встречаются меньше нужного
				for ( var j = 0; j < arrayIndices.length; j++ ) {
	
					if ( arrayIndices[j] < max ) arraySegment.push( j );
					
				}
				if ( arraySegment.length > 0 ) indice.push( arraySegment );
					
			}

		}
		
		var vectorPlane;

		const geometry = {

			get position() {

				//https://stackoverflow.com/questions/2449182/getter-setter-on-javascript-array
				return new Proxy( this, {

					get: function ( target, name ) {

						switch ( name ) {

							case 'length':
								return settings.geometry.position.length;

						}
						const i = parseInt( name );
						if ( isNaN( i ) ) {

							console.error( 'ND.geometry.position: invalid name: ' + name );
							return;

						}
						return new Vector( positionWorld[i] );

					},

				} );

			},
			get geometry() { return settings.geometry },
			set geometry( geometry ) {
				
				settings.geometry.position = geometry.position;
				if ( geometry.indices ) {
					
					settings.geometry.indices.length = 1;
					for ( var i = 0; i < geometry.indices.length; i++ ) {
						
						if ( i === 0 ) settings.geometry.indices[0].edges = geometry.indices[0];
						else settings.geometry.indices[i] = geometry.indices[i];

					}

				}
				
			},
			D3: {
				
				get points() {

					const points = [];
					for ( var i = 0; i < geometry.position.length; i++ )
						points.push( geometry.position[i].point );
					return points;

				},
				get indices() {

					const indices = [], colors = [];
					//если объект не состоит из одной вершины и имеет ребера
					if ( settings.geometry.indices[0].length !== 0 ) {
						
						const edges = settings.geometry.indices[0];
						for ( var i = 0; i < edges.length; i++ ) {
	
							const edge = edges[i].indices;
							if ( edge ) {
								
								if ( edge.length !== 2 ) {
	
									console.error( 'ND.geometry.D3.get indices: invalid edge.length = ' + edge.length );
									return;
	
								}
								if ( edge[0] === edge[1] ) {
	
									console.error( 'ND.geometry.D3.get indices: duplicate edge index = ' + edge[0] );
									return;
	
								}
								indices.push( ...edge );
								if ( this.color ) {
	
									const color = new THREE.Color(this.color);
									function hexToRgb(hex) {
									  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
									  return result ? {
									    r: parseInt(result[1], 16),
									    g: parseInt(result[2], 16),
									    b: parseInt(result[3], 16)
									  } : null;
									}
									const rgb = hexToRgb( color.getHexString() );
									function push() {
										
										colors.push( rgb.r );
										colors.push( rgb.g );
										colors.push( rgb.b );
	
									}
									push();
									if ( edges.length === 1 ) push();//Это линия. Надо установить цвет конца
	
								}
	
							} else console.error( 'ND.geometry.D3.get indices: invalid edge. Возможно вычислены не все точки пересечения' );
							
						}

					}
					return { indices: indices, colors: colors, };

				},

			},

		}

		vectorPlane = vectorPlane || new Vector( settings.vectorPlane );
		if ( !vectorPlane || !vectorPlane.point ) vectorPlane = new Vector( vectorPlane );

		var objectIntersect;//порекция объека пересечения панеди с графическим объектом на 3D пространство.
		function displayVerticeID( object, geometry ) {
			
			if ( !settings.boDisplayVerticeID ) {
				
				for ( var i = object.children.length - 1; i >= 0; i-- ) {

					const child = object.children[i];
					if ( child.type === 'Sprite' ) object.remove( child );

				}
				return;

			}
			for ( var i = 0; i < geometry.D3.points.length; i++ ) {

				const spriteText = new SpriteText( i, geometry.D3.points[i], { group: object } );
				spriteText.userData.pointID = i;

			}
			
		}
		function create3DObject( geometry, settings3D = {} ) {

			if ( !geometry.D3 ) {

				const nD = new ND( n, { geometry: geometry, } );
				geometry = nD.geometry;
				
			}
			if ( geometry.position.length === 0 ) return;
			const color = settings3D.color || 0xffffff;//default white
			geometry.D3.color = color;
			const indices3D = geometry.D3.indices, indices = indices3D.indices, colors = indices3D.colors;

			const buffer = new THREE.BufferGeometry().setFromPoints( geometry.D3.points );

			const object = indices.length > 1 ?
					new THREE.LineSegments( buffer.setIndex( indices ), new THREE.LineBasicMaterial( {

						color: color,

					} ) ) :
					new THREE.Points( buffer, new THREE.PointsMaterial( {
						
						color: color,
						sizeAttenuation: false,
						size: options.point.size / ( options.point.sizePointsMaterial * 2 ),
						
					} ) );
			if ( settings3D.name )
				object.name = settings3D.name;
			scene.add( object );

//			if ( typeof SpriteText !== "undefined" )
			displayVerticeID( object, geometry );
			
			object.userData.nd = function ( fParent, dat ) {

				//Localization

				const getLanguageCode = options.getLanguageCode;

				const lang = {

					vertices: 'Vertices',
					verticesTitle: 'Vertices.',
					edges: 'Edges',
					edgesTitle: 'The selected edge lists the vertex indices of the edge.',
					faces: 'Faces',
					facesTitle: 'The selected face lists the indexes of the edges of that face.',
					bodies: 'Bodies',
					bodiesTitle: 'The selected body lists the indexes of the faces of this body.',
					objects: 'Objects',
					objectsTitle: 'The selected object lists the indexes of the objects that this object consists of. It can be indexes of bodies.',

					position: 'Position',

					rotation: 'Rotation',
					rotationPointTitle: 'Rotation point',
					rotationAxisTitle: 'Rotation axis',
					rotationPlaneTitle: 'Axes of plane of rotation.',
					rotationSpaceTitle: 'Axes of space of rotation.',
					rotationnDSpaceTitle: 'Axes of multi dimensional space of rotation.',

					defaultButton: 'Default',
					defaultPositionTitle: 'Restore default position',
					defaultRotationTitle: 'Restore default rotation',
					
					displayVerticeID: 'Vertice ID',
					displayVerticeIDTitle: 'Display on the scene the vertice ID near to the vertice',

					notSelected: 'Not selected',

				};

				const _languageCode = getLanguageCode();

				switch ( _languageCode ) {

					case 'ru'://Russian language

						lang.vertices = 'Вершины';
						lang.verticesTitle = 'Вершины.';
						lang.edges = 'Ребра';
						lang.edgesTitle = 'В выбранном ребре перечислены индексы вершин ребра.';
						lang.faces = 'Грани';
						lang.facesTitle = 'В выбранной грани перечислены индексы ребер этой грани.';
						lang.bodies = 'Тела';
						lang.bodiesTitle = 'В выбранном теле перечислены индексы граней этого тела.';
						lang.objects = 'Объекты';
						lang.objectsTitle = 'В выбранном объекте перечислены индексы объектов, из которого состоит этот объект. Это могут быть индексы тел.';

						lang.position = 'Позиция';

						lang.rotation = 'Вращение';
						lang.rotationPointTitle = 'Точка вращения.';
						lang.rotationAxisTitle = 'Ось вращения.';
						lang.rotationPlaneTitle = 'Оси плоскости вращения.';
						lang.rotationSpaceTitle = 'Оси пространства вращения.';
						lang.rotationnDSpaceTitle = 'Оси многомерного пространства вращения..';

						lang.defaultButton = 'Восстановить';
						lang.defaultPositionTitle = 'Восстановить позицию объекта по умолчанию';
						lang.defaultRotationTitle = 'Восстановить вращение объекта по умолчанию';

						lang.displayVerticeID = 'Номера вершин';
						lang.displayVerticeIDTitle = 'На сцене возле каждой вершины показать ее идентификатор';

						lang.notSelected = 'Не выбран';

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
				for ( var i = fParent.__controllers.length - 1; i >= 0; i-- ) { fParent.remove( fParent.__controllers[i] ); }

				settings.boDisplayVerticeID = settings.boDisplayVerticeID || false;
				const cDisplayVerticeID = fParent.add( settings, 'boDisplayVerticeID' ).onChange( function ( value ) {
					
					update();
					displayVerticeID( object, geometry );
					
				} );
				dat.controllerNameAndTitle( cDisplayVerticeID, lang.displayVerticeID, lang.displayVerticeIDTitle );
				
				const indices = geometry.geometry.indices, segmentIndex = indices.length - 1;
				function addController(
					segmentIndex,//settings.geometry.indices index
					fParent,
					segmentItems,//массив индексов элементов текущего segment, которые выбрал пользователь
					prevLine//выбранный пользователем сегмент объекта на более высоком уровне. Например если пользователь выбрал ребро то prevLine указывает на выбранную пользователем грань
				) {

					_prevLine = prevLine;
					var segment;
					if ( segmentItems ) {

						function addItem( item, i ) {

							item.i = i;
							segment.push( item );

						}
						segment = [];
						if ( segmentIndex === -1 ) {

							//vertices
							
							settings.geometry.position.boPositionError = false;
							
							//непонятно почему, но для 2D вершины перечислены в segmentItems.indices
							if ( segmentItems.forEach )
								segmentItems.forEach( i => addItem( settings.geometry.position[i], i ) );
							else segmentItems.indices.forEach( i => addItem( settings.geometry.position[i], i ) );
							
							settings.geometry.position.boPositionError = true;
							
						} else {
							
							//indices
							const index = indices[segmentIndex];
							segmentItems.forEach( i => addItem( index[i].indices ? index[i].indices : index[i], i ) );

						}
						
					}else segment = indices[segmentIndex];
					const items = { Items: [lang.notSelected] };
					var line, fChildSegment;
					var name, title;
					switch ( segmentIndex ) {

						case -1: name = lang.vertices; title = lang.verticesTitle; break;
						case 0: name = lang.edges; title = lang.edgesTitle; break;
						case 1: name = lang.faces; title = lang.facesTitle; break;
						case 2: name = lang.bodies; title = lang.bodiesTitle; break;
						default: name = lang.objects; title = lang.objectsTitle;

					}
					const fSegment = fParent.addFolder( name );
					fSegment.userData = { objectItems: true, }
					dat.folderNameAndTitle( fSegment, name, title );
					const cSegment = fSegment.add( items, 'Items', { [lang.notSelected]: -1 } ).onChange( function ( value ) {

						if ( fChildSegment ) {
							
							const controller = fChildSegment.__controllers[0];
							if ( controller.__select.selectedIndex != 0 ) {
								
								controller.__select.selectedIndex = 0;
								controller.__onChange();

							}
							fSegment.removeFolder( fChildSegment );
							fChildSegment = undefined;

						}
						const selectedIndex = cSegment.__select.selectedIndex - 1;
						if ( line ) {

							line.parent.remove( line );
							line = undefined;

						}
						const opacityDefault = 0.3, parentObject = object;
						function opacityItem( item, transparent, opacity = opacityDefault ) {
							
							if ( !item.material ) return;
							if ( transparent && ( opacity === 0 ) && ( Object.is( item.parent, parentObject ) ) ) parentObject.remove( item ); 
							else {
								
								if ( !item.parent ) parentObject.add( item );
								item.material.transparent = transparent;
								item.material.opacity = transparent ? opacity : 1;

							}
							
						}
						function opacity( transparent = true, opacity = opacityDefault ) {

							scene.children.forEach( item => opacityItem( item, transparent, opacity ) );

						}

						//Непонятно почему, но прозрачность линии зависит от индекса текущего сегмента segmentIndex.
						//Для проверки открыть холст 5D.
						//Если в 5D прозрачность делать постоянной 0.3, то при выборе тела (body) из объета, объект буден практически непрозрачным
						function getOpacity() {
							
							return -0.1 * segmentIndex + opacityDefault;
							
						}

						function removeVerticeControls(){

							if ( segmentIndex !== -1 ) return;
							for ( var i = fSegment.__controllers.length - 1; i >=0 ; i-- ) {

								const controller = fSegment.__controllers[i];
								if ( Object.is(cSegment, controller) ) continue;
								fSegment.remove(controller);
								
							}
							
						}

						if ( selectedIndex === -1 ) {

							removeVerticeControls();
							if ( prevLine ) {

								opacityItem( prevLine, false );
								if ( prevLine.userData.prevLine ) opacityItem( prevLine.userData.prevLine, true, getOpacity() );
								else opacity( true );
								return;
								
							}
							opacity( false );
							return;

						}
						if ( prevLine ) {
							
							opacity( true, 0 );
							opacityItem( prevLine, true, getOpacity() );
							if ( prevLine.userData.prevLine ) {

								opacityItem( prevLine.userData.prevLine, true, 0 );
								
							}

						} else opacity();
						if ( segmentIndex === -1 ) {

							//Vertices
							removeVerticeControls();
							settings.geometry.position.boPositionError = false;
							const vertice = settings.geometry.position[segment[selectedIndex].i];
							settings.geometry.position.boPositionError = true;
							for ( var i = 0; i < vertice.length; i++ ) {
								
//								dat.controllerZeroStep( fSegment, vertice, i ).domElement.querySelector( 'input' ).readOnly = true;
								switch(i){

									case 0:
									case 1:
									case 2:
										var axis;
										switch(i){
		
											case 0: axis = options.scales.x; break;
											case 1: axis = options.scales.y; break;
											case 2: axis = options.scales.z; break;
												
										}
										fSegment.add( vertice, i, axis.min, axis.max, ( axis.max - axis.min ) / 100 );
										break;
									default: dat.controllerZeroStep( fSegment, vertice, i );
										
								}

							}
							
						} else {
							
							const buffer = new THREE.BufferGeometry().setFromPoints( geometry.D3.points );
							const lineIndices = [];
							function createIndices( item, level ) {
	
								if ( level > 0 ) {
	
									level--;
									for ( var i = 0; i < item.length; i++ ) createIndices( indices[level][item[i]], level );
									return;
	
								}
								const itemIndices = item.indices || item;
								itemIndices.forEach( i => { lineIndices.push( i ); } );
	
							}
							createIndices( segment[selectedIndex], segmentIndex );
	//если вместо buffer использовать object.geometry то при выборе сегмета объекта становятся невидимыми все остальные сегменты объекта
	//						line = new THREE.LineSegments( object.geometry.setIndex( indices ), new THREE.LineBasicMaterial( { color: object.material.color } ) );
							line = new THREE.LineSegments( buffer.setIndex( lineIndices ), new THREE.LineBasicMaterial( { color: object.material.color } ) );
//							segment[selectedIndex].line = line;//для изенения положения вершины
	
							//debug
							line.userData.name = fSegment.name + ' ' + value;
							
							parentObject.add( line );
//							_prevLine = parentObject;

						}
						if ( prevLine && line ) line.userData.prevLine = prevLine;
						if ( segmentIndex >= 0 ) fChildSegment = addController( segmentIndex - 1, fSegment, segment[selectedIndex], line );

					} );
					dat.controllerNameAndTitle( cSegment, '' );
					cSegment.__select[0].selected = true;

					for ( var i = 0; i < segment.length; i++ ) {

						const item = segment[i], opt = document.createElement( 'option' ), indices = item.indices ? item.indices : item;
						opt.innerHTML = '(' + ( item.i === undefined ? i : item.i ) + ') ' + ( segmentIndex === -1 ? '' : indices.toString() );
						opt.item = item;
						cSegment.__select.appendChild( opt );

					}
					return fSegment;

				}
				const childFolders = Object.keys(fParent.__folders);
				childFolders.forEach( folderName => {

					const childFolder = fParent.__folders[folderName];
					if ( childFolder.userData && childFolder.userData.objectItems ) {
						
						const controller = childFolder.__controllers[0];
						if ( controller && controller.__select.selectedIndex != 0 ) {
							
							controller.__select.selectedIndex = 0;
							controller.__onChange();

						}
						
					}
					fParent.removeFolder( childFolder );
					
				} );
				const fPosition = fParent.addFolder( lang.position ),
					fRotation = n < 2 ? undefined : fParent.addFolder( lang.rotation );
//					fRotation = rotationAxes[0].length === 0 ? undefined : fParent.addFolder( lang.rotation );
				function rotation( i ) {
					
					if ( rotationAxes[i].length === 0 ) return;
					settings.rotation.boUseRotation = true;
					settings.rotation.folders[i] = {

						cRotation: fRotation.add( settings.rotation, i, 0, Math.PI * 2, 0.01 ).onChange( function ( value ) { update(); } ),
						default: settings.rotation[i],

					}
					var name = '', title = '';
					rotationAxes[i].forEach( axis => name = name + ( name.length === 0 ? '' : ',' ) + axis );
					switch( n ){

						case 2: title = lang.rotationPointTitle; break;
						case 3: title = lang.rotationAxisTitle; break;
						case 4: title = lang.rotationPlaneTitle; break;
						case 5: title = lang.rotationSpaceTitle; break;
						default: title = lang.rotationnDSpaceTitle; break;
							
					}
					dat.controllerNameAndTitle( settings.rotation.folders[i].cRotation, n === 2 ? '2' : name, title );
					settings.rotation.boUseRotation = false;
					
				}
				for ( var i = 0; i < n; i++ ) {

					const axisName = i;

					//position
					{
						
						const f = fPosition.addFolder( axisName );
						settings.position.folders[i] = {
	
							positionController: new PositionController( function ( shift ) { settings.position[axisName] += shift; },
								{ getLanguageCode: options.getLanguageCode, } ),
							default: settings.position[i],
	
						};
						f.add( settings.position.folders[i].positionController );
	
						settings.position.folders[i].cPosition = dat.controllerZeroStep( f, settings.position, i, function ( value ) { update(); } );
						dat.controllerNameAndTitle( settings.position.folders[i].cPosition, axisName );

					}
/*
					//rotation
					if ( n > 2 ) {

						rotation( i );

					}
*/

				}
				
				//rotation
				if ( n === 2 ) rotation( 0 );//поворот только вокруг оси 2
				else rotationAxes.forEach( (item, i ) => rotation( i ) );


				//Restore default position.
				const buttonPositionDefault = fPosition.add( {
	
					defaultF: function ( value ) { settings.position.folders.forEach( item => item.cPosition.setValue( item.default ) ); },
	
				}, 'defaultF' );
				dat.controllerNameAndTitle( buttonPositionDefault, lang.defaultButton, lang.defaultPositionTitle );

				//Restore default rotation.
				if ( fRotation ) {
					
					const buttonRotationDefault = fRotation.add( {
	
						defaultF: function ( value ) { settings.rotation.folders.forEach( item => item.cRotation.setValue( item.default ) ); },
	
					}, 'defaultF' );
					dat.controllerNameAndTitle( buttonRotationDefault, lang.defaultButton, lang.defaultRotationTitle );

				}
				
				addController( segmentIndex, fParent );
			
			}
			if ( options.guiSelectPoint ) options.guiSelectPoint.addMesh( object );

			//raycaster

			object.userData.raycaster = {

				onIntersection: function ( intersection, mouse ) {

					delete intersection.index;
					MyThree.Options.raycaster.onIntersection( intersection, options, scene, options.camera, options.renderer//, intersection.object3D.position
					);

				},
				onIntersectionOut: function () { MyThree.Options.raycaster.onIntersectionOut( scene, options.renderer ); },
				onMouseDown: function ( intersection ) { MyThree.Options.raycaster.onMouseDown( intersection, options ); },

			}
			options.eventListeners.addParticle( object );

			return object;

		}
		/**
		 * @returns an array of intersection points of <b>vectorPlane</b> and <b>geometry</b>. See constructor for details.
		 * @param {object} [geometryIntersection = { position: [], indices: [[]] }] Arrays of vertices and indexes of the result of the intersection of the panel and the nD object. See <b>settings.geometry</b> of <b>ND</b> constructor for details.
		 * @param {array} [geometryIntersection.position] Array of vertices of the result of the intersection. See <b>settings.geometry.position</b> of <b>ND</b> constructor for details.
		 * @param {array} [geometryIntersection.indices] Array of <b>indices</b> of vertices of the result of the intersection. See <b>settings.geometry.indices</b> of <b>ND</b> constructor for details.
		 * @param {array} [iIntersections] Array of indices that have been added to <b>geometryIntersection.indices</b>
		 */
		this.intersection = function ( geometryIntersection = { position: [], indices: [[]] }, iIntersections ) {

			function intersection( iEdge, aEdge ) {
				
				for ( var i = 0; i < geometryIntersection.position.length; i++ ) {
					
					if ( geometryIntersection.position[i].iEdge === iEdge ) {

						//duplicate position
						if (
							aEdge &&
							( aEdge.length < 2 )//Длинна ребра линии пересечения получается больше 2 если ребро объекта лежит на пенели.
												//Для проверки на canvas 3D сделать две вершины по оси z равными -0.4
												//И проиграть проигрыватель на t = 0.3.
						) aEdge.push( i );
						return;

					}

				}
				const edge = settings.geometry.indices[0][iEdge];
				edge.intersection( geometryIntersection );
				const position = edge.indices.intersection.position;
				if ( position ) {
					
					var boAdd = true;
					if ( edge.indices.intersection.boVerticeOnPanel ) {

						//Вершина на панели. В этом случае все ребра, сходящиеся к этой вершине буду выдвать одну и ту же точку пересечения
						//Не нужно добавлять повторяющиеся точки.
						for ( var i = 0; i < geometryIntersection.position.length; i++ ) {

							if ( position.equals( geometryIntersection.position[i] ) ) {

								boAdd = false;
								aEdge.boVerticeOnPanel = true;
								break;
								
							}
							
						}
						
					}
					if ( boAdd ) {
						
						geometryIntersection.position.push( position );
						if ( aEdge ) aEdge.push( geometryIntersection.position.length - 1 );

					}

				}
				
			}
			if ( !geometryIntersection.position.isProxy )
				geometryIntersection.position = new Proxy( geometryIntersection.position, {
		
					get: function ( target, name, args ) {
		
						const i = parseInt( name );
						if ( !isNaN( i ) ) {
		
							return  target[i];
		
						}
						switch ( name ) {

							case 'push': return target.push;
							case 'length': return target.length;
							case 'forEach': return target.forEach;
							case 'isProxy': return true;
							case 'target': return target;
							case "reset":
								return function () {
	
									target.forEach( item => item.positionWorld = undefined );
	
								}
							default: console.error( 'ND: settings.geometry.position Proxy. Invalid name: ' + name );
		
						}
		
					},
					set: function ( target, name, value ) {
	
						const i = parseInt( name );
						if ( isNaN( i ) ) {
							
							if ( name === "boPositionError" ) {

								target[name] = value;
								return true;

							}
							return target[name];

						}
						if ( i >= target.length ) {
	
							//find duplicate item
							var boDuplicate  = false;
							for ( var j = 0; j < i; j++ ) {
	
								boDuplicate = true;
								for ( var k = 0; k < target[j].length; k++ ) {
	
									if ( target[j][k] !== value[k] ) {
	
										boDuplicate = false;
										break;
										
									}
									
								}
								if ( boDuplicate ) break;
								
							}
							if ( !boDuplicate ) target.push( value );
							return target.length;
	
						}
//console.log('geometryIntersection.position: i = ' + i + ' value = ' + value);
						target[i] = value;
						return true;
	
					}
					
				} );
			switch ( n ) {

				case 1:
					if ( settings.geometry.indices.length !== 1 ) console.error( 'ND.intersection: under constraction. Это не линия.' );
					const edge = settings.geometry.indices[0][0];
					edge.intersection( geometryIntersection );
					break;
				case 2:
					const iFaces = settings.geometry.indices[1];
					if ( iFaces ) settings.geometry.indices[1].forEach( function ( iFace ) { iFace.forEach( function ( iEdge ) { intersection( iEdge ) } ); } );
					else {
						
						for ( var i = 0; i < settings.geometry.indices[0].length; i++ ) { intersection( i ); }
						addEdges( undefined, geometryIntersection );

					}
					break;
				default: {

					var iSegments = settings.iSegments || ( n - 2 ),//Индекс массива индексов сегментов settings.geometry.indices[iSegments]
											//для которого получаем вершины и индексы
						segments;//массив индексов сегментов для которого получаем вершины и индексы
					while( iSegments >= 0 ) {
						
						segments = settings.geometry.indices[iSegments];
						if ( segments ) break;
						iSegments--;

					}
					//settings.indice индекс сегмента в текущем массиве индексов сегментов settings.geometry.indices[iSegments][settings.indice]
					if ( settings.indice === undefined ) {

						for ( var i = 0; i < segments.length; i++ ) {

							const nd = new ND( n, { geometry: {
								
								indices: settings.geometry.indices,
								position: positionWorld.copy(),
							
							}, indice: i, iSegments: iSegments, } ),
								s = iSegments - 1;
							var iIntersections;
							if ( s !== 0 ) {//Не создавать iIntersections для ребер

								iIntersections = [];

							}
							nd.intersection( geometryIntersection, iIntersections );
							if ( iIntersections && iIntersections.length ) {

								geometryIntersection.indices[s] = geometryIntersection.indices[s] || proxySegments();
								geometryIntersection.indices[s].push( iIntersections );
								
							}

						}

						//Ищем ребра с одной вершиной. Такие ребра появляются если вершина находится на панели
						//Это нужно когда объект пересекается панелью и одна из вершин находтся на панели
						//Тода появляется два ребра с одной вершиной. Я их удаляю и объединяю в одно ребро.
						//Для проверки запустить canvas 3D с geometry Variant 1 и проигрыватель установить на t = 0.6
						const edges = geometryIntersection.indices[0];
						var vertices = [];//список вершин ребер с одной вершиной.
						for ( var i = edges.length - 1; i >= 0; i-- ) {

							const edge = edges[i];
							if ( edge.boVerticeOnPanel && ( edge.length === 1 ) ) {
								
								vertices.push( edge[0] );
								edges.splice( i, 1 ); 

							}

						}
						switch( vertices.length ) {

							case 0:
							case 1://одна вершина находится на панели
								break;
							case 2:
								edges.push( vertices );
								break;
							default: console.error( 'ND.intersection: invalid edge.' );
						}

						if ( edges.length > 1 ) {
							
							//ищем вершины с одним ребром и объединяем такие вершины в новое ребро.
							//Это нужно чтобы линия грани была замкнутая.
							//Для проверки создаем в примере _4D и _3D
							for ( var i = 0; i < geometryIntersection.position.length; i++ ) {
	
								var verticesCount = 0;
								for ( var j = 0; j < edges.length; j++ ) {
	
									const edge = edges[j];
									for ( var k = 0; k < edge.length; k++ ) {
	
										if ( edge[k] === i ) verticesCount++;
										
									}
	
								}
								if ( verticesCount < 2 ) {
	
									if ( verticesCount === 0 ) console.error( 'ND.intersection: Invalid verticesCount = ' + verticesCount );
									else vertices.push( i );
										
								}
	
							}
							if ( vertices.length > 0 ) {
	
								if ( vertices.length != 2 ) console.error( 'ND.intersection: invalid edge.' );
								else edges.push( vertices );
								
							}

						}

					} else {

						var segment = segments[settings.indice];
						if ( iSegments > 1 ) {

							for ( var i = 0; i < segment.length; i++ ) {
	
								const nd = new ND( n, { geometry: settings.geometry, indice: segment[i], iSegments: iSegments - 1, } );
								if ( n > 4 ) {

									if ( n === 5 ) {
										var iIntersect = [];
										nd.intersection( geometryIntersection, iIntersect );
										if ( iIntersect.length ) {
											
											if ( iIntersect.length === 1 ) {
												
												iIntersect = iIntersect[0];
												iIntersections.push( iIntersect );
	
											} else {

												const ind = n - 4;
												geometryIntersection.indices[ind] = geometryIntersection.indices[ind] || proxySegments();
												geometryIntersection.indices[ind].push( iIntersect );
												if ( iIntersections ) iIntersections.push( iIntersect.index );
												
											}

										}
	
									} else console.error( 'ND.intersection: n = ' + n + ' under constraction' );

								} else nd.intersection( geometryIntersection, iIntersections );
	
							}

						} else {

							const edge = [];
							if ( segment.indices ) segment = segment.indices;
							for ( var i = 0; i < segment.length; i++ ) { intersection( segment[i], edge ); }
							if ( edge.length > 0 ) {

								if ( ( edge.length !== 2 ) || ( edge[0] === edge[1] ) ) {

									//длинна массива edge может быть меньше 2 если всего одна вершина находится на панели
									//В этом случае линия пересечения geometryIntersection состоит из одной точки и невозможно создать ребро
									if ( !edge.boVerticeOnPanel ) {

										const error = 'ND.intersection: invalid edge';
										console.error( error );
//										throw error;
										return;

									}

								}
								const intersectionEdges = geometryIntersection.indices[0];
								var duplicateEdge = false;
								for ( var i = 0; i < intersectionEdges.length; i++ ) {

									const intersectionEdge = intersectionEdges[i];
									if (
										( intersectionEdge[0] === edge[0] ) && ( intersectionEdge[1] === edge[1] ) ||
										( intersectionEdge[0] === edge[1] ) && ( intersectionEdge[1] === edge[0] )
									) {

										duplicateEdge = true;
										if ( iIntersections ) iIntersections.push( i );
										break;
									}
									
								}
								if ( !duplicateEdge ) {
									
									if ( iIntersections ) iIntersections.push( intersectionEdges.length );
									intersectionEdges.push( edge );

								}

							}

						}

					}

				}

			}
			if ( settings.onIntersection )
				settings.onIntersection( geometryIntersection );
			if ( scene ) {

				if ( objectIntersect ) {

					if ( options.guiSelectPoint ) options.guiSelectPoint.removeMesh( objectIntersect );
					scene.remove( objectIntersect );
					options.eventListeners.removeParticle( objectIntersect );

				}
				if ( geometryIntersection.position.length )
					objectIntersect = create3DObject( geometryIntersection, { name: 'Intersection' } );

			}
			return geometryIntersection.position;

		}

		const THREE = three.THREE, scene = settings.scene;

		if ( scene ) {

			options.scales.x.name = 0;
			options.scales.y.name = 1;
			options.scales.z.name = 2;
			if ( n <= 1 ) options.scales.y = undefined;
			if ( n <= 2 ) options.scales.z = undefined;
			options.scales.text.rect = options.scales.text.rect || {}
			options.scales.text.rect.displayRect = false;
			options.scales.text.precision = 2;

		}

		var object3D;
		function projectTo3D() {

			if ( !scene ) return;

			//Graphic object. Currenyly is line
			if ( object3D ) {

				for ( var i = object3D.children.length - 1; i >= 0; i-- ) {

					const child = object3D.children[i];
					if ( child instanceof THREE.Sprite ) {

						object3D.remove( child );
						if ( options.guiSelectPoint ) options.guiSelectPoint.removeMesh( child );
						
					}
					
				}
				scene.remove( object3D );
				if ( options.guiSelectPoint ) options.guiSelectPoint.removeMesh( object3D );
				options.eventListeners.removeParticle( object3D );
				object3D = undefined;

			}
			object3D = create3DObject( geometry, { name: 'Object', color: 0x00ff00 } );//green

			//сейчас позиция объекта складывается с позицией каздой точки в settings.geometry.position = new Proxy
			//object3D.position.copy( settings.position.point );

		}
		projectTo3D();

		//Plane

		/* * @class
		 * @description 
		 * <pre>
		 * N-dimensional intersection plane.
		 * Used to create a section with an n-dimensional graphic object.
		 * For 1 dimensional space <b>ND.Plane</b> is point.
		 * For 2 dimensional space <b>ND.Plane</b> is line.
		 * For 3 dimensional space <b>ND.Plane</b> is plane.
		 * For n-dimensional space <b>ND.Plane</b> is n-dimensional plane.
		 * </pre>
		 */
		class Plane {

			constructor() {

				var mesh;
				this.createMesh = function () {

					if ( !scene ) return;
					const color = 0x0000FF;//blue
					switch ( n ) {

						case 1://point
							options.point.size = ( options.scales.x.max - options.scales.x.min ) * 500;//10
							mesh = new THREE.Points( new THREE.BufferGeometry().setFromPoints( [
								new THREE.Vector3( 0, 0, 0 )
							], 3 ),
								new THREE.PointsMaterial( {

									color: color,
									sizeAttenuation: false,

								} ) );

							break;
						case 2://line
							mesh = new THREE.Line( new THREE.BufferGeometry().setFromPoints( [
								new THREE.Vector3( options.scales.x.min, 0, 0 ), new THREE.Vector3( options.scales.x.max, 0, 0 )
							] ), new THREE.LineBasicMaterial( { color: color } ) );
							break;
						case 3://plane
							mesh = new THREE.GridHelper( 2, 10, color, color );
							mesh.rotation.x = Math.PI / 2;
							break;
						default: {

//							console.error( 'ND.Plane.createMesh: invalid dimension = ' + n );
							return;//I can not render 4D and higher panel

						}

					}
					mesh.name = 'Plane';
					scene.add( mesh );
					if ( options.guiSelectPoint ) options.guiSelectPoint.addMesh( mesh );

					mesh.position.copy( vectorPlane.point );

					//raycaster

					mesh.userData.raycaster = {

						onIntersection: function ( intersection, mouse ) {

							delete intersection.index;
							MyThree.Options.raycaster.onIntersection( intersection, options, scene, options.camera, options.renderer );

						},
						onIntersectionOut: function () { MyThree.Options.raycaster.onIntersectionOut( scene, options.renderer ); },
						onMouseDown: function ( intersection ) { MyThree.Options.raycaster.onMouseDown( intersection, options ); },

					}
					options.eventListeners.addParticle( mesh );

					//

					vectorPlane.onChange = function () {

						mesh.position.copy( vectorPlane.point );
						mesh.updateMatrix();

					}

				}

			}

		}
		const plane = new Plane();
		plane.createMesh();

		Object.defineProperties( this, {

			/** @namespace
			* @description
			* Returns N-dimensional vector of the plane.
			*/
			vectorPlane: {

				get: function () { return vectorPlane; }

			},

			/** @namespace
			* @description
			* geometry of N-dimensional object. See <b>settings.geometry</b> parameter of <a href="./module-ND-ND.html" target="_blank">ND</a>.
			*/
			geometry: {

				get: function () { return geometry; },
				set: function ( geometryNew ) {

					geometry.geometry = geometryNew;
//					settings.geometry = geometryNew;
					projectTo3D();
					this.intersection()

				},

			},

		} );

	}

}

ND.gui = class {

	constructor( options, dat, fParent ) {

		//Localization

		const getLanguageCode = options.getLanguageCode;

		const lang = {

			nD: 'nD',
			nDTitle: 'n-dimensional object',

		};

		const _languageCode = getLanguageCode();

		switch ( _languageCode ) {

			case 'ru'://Russian language

				lang.nDTitle = 'n-мерный объект';

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
		const fND = fParent.addFolder( lang.nD );
		dat.folderNameAndTitle( fND, lang.nD, lang.nDTitle );

		this.object = function( object, dat ) {

			var display = 'none';
			if ( object && object.userData.nd ) {

				display = 'block';
				object.userData.nd( fND, dat );
				
			}
			fND.domElement.style.display =  display;
			
		}

	}

}

export default ND;

//https://stackoverflow.com/a/18881828/5175935
if ( !Number.prototype.between )
	Number.prototype.between = function ( a, b, inclusive ) {

		var min = Math.min.apply( Math, [a, b] ),
			max = Math.max.apply( Math, [a, b] );
		return inclusive ? this >= min && this <= max : this > min && this < max;

	};

//Comparing arrays https://stackoverflow.com/a/14853974/5175935
// Warn if overriding existing method
if ( Array.prototype.equals )
	console.warn( "Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code." );
// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function ( array ) {
	// if the other array is a falsy value, return
	if ( !array )
		return false;

	// compare lengths - can save a lot of time 
	if ( this.length != array.length )
		return false;

	for ( var i = 0, l = this.length; i < l; i++ ) {
		// Check if we have nested arrays
		if ( this[i] instanceof Array && array[i] instanceof Array ) {
			// recurse into the nested arrays
			if ( !this[i].equals( array[i] ) )
				return false;
		}
		else if ( this[i] != array[i] ) {
			// Warning - two different object instances will never be equal: {x:20} != {x:20}
			return false;
		}
	}
	return true;
}
// Hide method from for-in loops
Object.defineProperty( Array.prototype, "equals", { enumerable: false } );
