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
*/

import three from '../three.js'

import MyThree from '../myThree/myThree.js';
//import MyThree from '../../build/myThree.module.js';
//import MyThree from '../../build/myThree.module.min.js';

//debug
import { SpriteText } from '../SpriteText/SpriteText.js'

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
	 * <b>indices[0]</b> is edges (lines). Every edge is two indexes of the edge's vertices. Used in 1D objects and higher.
	 * <b>indices[1]</b> is faces (triangles). Every face is three indexes of the edges from <b>indices[0]</b>. Used in 3D objects and higher.
	 * <b>indices[2]</b> is bodies (tetrahedrons). Every bodie is four face indexes from <b>indices[1]</b>. Used in 4D objects and higher.
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
	 * //edges (lines)
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
	 * //edges (lines)
	 * <b>settings.geometry.indices[0]</b> = [
	 *	[0, 1]//0 index of the settings.geometry.positions [0.8, -0.6, 0.1] and [0.9, 0.7, 0.5]
	 *	[0, 2]//1 index of the settings.geometry.positions [0.8, -0.6, 0.1] and [0.8, 0, -0.4]
	 *	[0, 3]//2 index of the settings.geometry.positions [0.8, -0.6, 0.1] and [-0.6, 0.1, 0.1]
	 *	[1, 2]//3 index of the settings.geometry.positions [0.9, 0.7, 0.5] and [0.8, 0, -0.4]
	 *	[1, 3]//4 index of the settings.geometry.positions [0.9, 0.7, 0.5] and [-0.6, 0.1, 0.1]
	 *	[2, 3]//5 index of the settings.geometry.positions [0.8, 0, -0.4] and [-0.6, 0.1, 0.1]
	 *]
	 * //faces (triangles). Indices of the edges <b>settings.geometry.indices[0]</b>
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
	 * //edges (lines)
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
	 * //faces (triangles). Indices of the edges <b>settings.geometry.indices[0]</b>
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
	 * //bodies (tetrahedrons). Indices of the faces <b>settings.geometry.indices[1]</b>
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
	 * @param {THREE.Scene} [settings.scene] [THREE.Scene]{@link https://threejs.org/docs/index.html?q=sce#api/en/scenes/Scene}.
	 * Define <b>scene</b> if you want visualise n-dimensional plane and n-dimensional object to 3-D space of the <b>scene</b>.
	 * @param {Options} [settings.options] See <a href="../../jsdoc/Options/Options.html" target="_blank">Options</a>.
	 * Uses only if <b>scene</b> is defined.
	 * @param {Event} [settings.onIntersection] Plane and object intersection event.
	 * The <b>onIntersection</b> function parameter is the (n-1)-dimensional geometry of the intersection if a collision occurred, or undefined if a collision did not occur.
	 */
	constructor( n, settings = {} ) {

		const options = settings.options, _ND = this;
		settings.geometry = settings.geometry || {};
		if ( settings.geometry instanceof Array ) {

			const position = settings.geometry;
			settings.geometry = { position: position, }

		}
		settings.geometry.position = settings.geometry.position || [];

		//indices
		
		settings.geometry.indices = settings.geometry.indices || [];

		//edges
		var edges = settings.geometry.indices[0], boArray = edges instanceof Array;
		if ( !settings.geometry.indices[0] || boArray ) {

			function proxyEdges( newEdges ) {

//				edges = edges || newEdges;
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
											const position0 = new Vector( settings.geometry.position[indices[0]] ),
												position1 = new Vector( settings.geometry.position[indices[1]] );
											function indicesIntersection( position ) {

												switch ( n ) {

													case 2:
														break;
													default:
														if ( !position )
															break;
														position.push( vectorPlane[n - 1] );
														break;
/*														
													case 2:
														break;
													case 3:
													case 4:
														if ( !position )
															break;
														position.push( vectorPlane[n - 1] );
														break;
													default: console.error( 'ND: settings.geometry.indices[]intersection indicesIntersection(). n = ' + n + ' under constaction.' );
*/

												}
												indices.intersection = { position: position, }
												if ( indices.intersection.position ) indices.intersection.position.iEdge = i;

											}
											switch ( n ) {

												case 1:
													if ( vectorPlane[0].between( position0[0], position1[0], true ) )
														geometryIntersection.position.push( vectorPlane[0] );
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
														if ( !x.between( position0[0], position1[0], true ) )
															break;
														vector = [x, vectorPlane[1]];

													}
													indicesIntersection( vector );
													break;
/*
												case 4:
													const nD0 = new ND( 2, {

														geometry: {

															position: settings.geometry.position,
															indices: [[indices]],
															iAxes: [0, 3],

														},
														vectorPlane: vectorPlane.array,

													} ),
														arrayIntersects0 = nD0.intersection(),
														nD1 = new ND( 2, {

															geometry: {

																position: settings.geometry.position,
																indices: [[indices]],
																iAxes: [1, 3],

															},
															vectorPlane: vectorPlane.array,

														} ),
														arrayIntersects1 = nD1.intersection(),
														nD2 = new ND( 2, {

															geometry: {

																position: settings.geometry.position,
																indices: [[indices]],
																iAxes: [2, 3],

															},
															vectorPlane: vectorPlane.array,

														} ),
														arrayIntersects2 = nD2.intersection();
													indicesIntersection( arrayIntersects0.length && arrayIntersects1.length && arrayIntersects2.length ?
														[arrayIntersects0[0][0], arrayIntersects1[0][0], arrayIntersects2[0][0]] : undefined );
													break;
												case 5: {

													const nD0 = new ND( 2, {

														geometry: {

															position: settings.geometry.position,
															indices: [[indices]],
															iAxes: [0, 4],/////////////////////////////////////

														},
														vectorPlane: vectorPlane.array,

													} ),
														arrayIntersects0 = nD0.intersection(),
														nD1 = new ND( 2, {

															geometry: {

																position: settings.geometry.position,
																indices: [[indices]],
																iAxes: [1, 4],///////////////////////////////

															},
															vectorPlane: vectorPlane.array,

														} ),
														arrayIntersects1 = nD1.intersection(),
														nD2 = new ND( 2, {

															geometry: {

																position: settings.geometry.position,
																indices: [[indices]],
																iAxes: [2, 4],/////////////////////////////////

															},
															vectorPlane: vectorPlane.array,

														} ),
														arrayIntersects2 = nD2.intersection(),
														nD3 = new ND( 2, {

															geometry: {

																position: settings.geometry.position,
																indices: [[indices]],
																iAxes: [3, 4],/////////////////////////////////

															},
															vectorPlane: vectorPlane.array,

														} ),
														arrayIntersects3 = nD3.intersection();
													indicesIntersection( arrayIntersects0.length && arrayIntersects1.length && arrayIntersects2.length && arrayIntersects3.length ?////////////////////////////////
														[arrayIntersects0[0][0], arrayIntersects1[0][0], arrayIntersects2[0][0], arrayIntersects3[0][0]] : undefined );///////////////////////////////
													break;

												}
*/
												case 3:

													var position;
													
													//Если позиции вершины находится на этом расстоянии от панели, то будем считать, что она находится на панели
													//Для проверки запустить canvas 3D с geometry Variant 1 и проигрыватель в точке t = 0.6.
													//
													//В примере canvas 3D с geometry.position Variant 2 вершина точно находится на панели
													const d = 5.56e-17;
													
													if ( Math.abs( vectorPlane[n - 1] - position1[n - 1] ) < d ) position = position1;
													else if ( Math.abs( vectorPlane[n - 1] - position0[n - 1] ) < d ) position = position0;
													if ( position ) {

														//Вершина находится на панели.
														//Для проверки запустить canvas 3D и установить время проигрывателя t = 0.3 так чтобы вершина 2 пирамиды попала на панель
														//В этом случает треугольник пересечения сведется к трем точкам с одинаковыми координатами.
														indicesIntersection( [position[0], position[1]] );
														indices.intersection.boVerticeOnPanel = true;

													} else {

														const nD02 = new ND( n - 1, {

															geometry: {

																position: settings.geometry.position,
																indices: [[indices]],
																iAxes: [1, 2],

															},
															vectorPlane: vectorPlane.array,

														} ),
															arrayIntersects02 = nD02.intersection();
														const nD12 = new ND( n - 1, {

															geometry: {

																position: settings.geometry.position,
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

																position: settings.geometry.position,
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
						settings.geometry.position.forEach( function ( indice, i ) { indices.push( i ) } );
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

			if ( positionIndices.length === 0 ) settings.geometry.position.forEach( function ( position, i ) { positionIndices.push( i ) } );
			geometry = geometry || settings.geometry;
			if ( !geometry.indices[0] ) geometry.indices[0] = [];
			const edges = geometry.indices[0];
/*			
			if ( !geometry || ( edges.length > 0 ) )
				return;
*/
			if ( ( n === 2 ) && ( geometry.position.length === 2 ) ) {

				edges.push( [0, 1] );
				return;

			}
			if ( level === undefined ) return;
			if ( level > 2 ) { 
				
/*				
				if ( edges.length > 0 )
					return;
*/
				for ( var i = 0; i < positionIndices.length; i++ ) {

					const posIndices = [];
					positionIndices.forEach( function ( indice, j ) { if ( positionIndices[i] !== positionIndices[j] ) posIndices.push( positionIndices[j] ); } );
/*
					for ( var j = 0; j < positionIndices.length; j++ ) {

						if ( positionIndices[i] !== positionIndices[j] ) posIndices.push( positionIndices[j] );

					}
*/
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
/*
				const position = settings.geometry.position;
				for ( var i = 0; i < position.length; i++ ) {
					
					const positionIndices = [];
					for ( var j = 0; j < position.length; j++ ) {

						if ( i !== j ) positionIndices.push( j );
						
					}
					const levelIndices = [];//тут перечислены индексы всех индексов, котоые были добавлены в settings.geometry.indices
					addEdges( level - 1, undefined, positionIndices, levelIndices );
					if ( levelIndices.length ) {

						const l = level - 2;
						settings.geometry.indices[l] = settings.geometry.indices[l] || [];
						settings.geometry.indices[l].push( levelIndices );
						
					}

				}
*/

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
//					const length = settings.geometry.position.length;
					
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
		
		var vectorPlane;

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

							case "length":
								return n + 1;
							case "array":
								return array;
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
							case "index":
								return vectorSettings.index;

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
						return new Vector( settings.geometry.position[i] );

					},

				} );

			},
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

					const indices = [];
					if ( settings.geometry.indices[0].length === 0 )
						return indices;//объект состоит из одной вершины и не имеет ребер
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

						} else console.error( 'ND.geometry.D3.get indices: invalid edge. Возможно вычислены не все точки пересечения' );
						
					}
/*
					function getIndices( segment, index, boReturn ) {

						var prevIndex = index;
						for ( var i = segment.length - 1; i >= 0; i-- ) {

							const segmentItem = segment[i];
							if ( segmentItem instanceof Array ) {

								getIndices( segmentItem, index );
								if ( boReturn ) return;

							} else {

								if ( prevIndex === index ) prevIndex--;
								const item = segmentItem.indices ? segmentItem ://settings.geometry.indices.length === 1 перечислены только ребра
									settings.geometry.indices[prevIndex][segmentItem];
								if ( prevIndex > 0 )
									getIndices( item, prevIndex );
								else {

									const edge = item.indices;
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

									} else console.error( 'ND.geometry.D3.get indices: invalid edge. Возможно вычислены не все точки пересечения' );

								}

							}

						}
						index = prevIndex;

					}
					if ( settings.geometry.indices[0].length === 0 )
						return indices;//объект состоит из одной вершины и не имеет ребер
					getIndices( settings.geometry.indices, settings.geometry.indices.length - 1, true );
*/
					return indices;

				},

			},

		}

		vectorPlane = vectorPlane || new Vector( settings.vectorPlane );
		if ( !vectorPlane || !vectorPlane.point ) vectorPlane = new Vector( vectorPlane );

		var objectIntersect;//порекция объека пересечения панеди с графическим объектом на 3D пространство.
		function create3DObject( geometry, settings = {} ) {

			if ( !geometry.D3 ) {

				const nD = new ND( n, { geometry: geometry } );
				geometry = nD.geometry;
				
			}
			if ( geometry.position.length === 0 ) return;
			const indices = geometry.D3.indices;
			const buffer = new THREE.BufferGeometry().setFromPoints( geometry.D3.points ),
				color = settings.color || 0xffffff,//default white
				object = indices.length > 1 ?
					new THREE.LineSegments( buffer.setIndex( indices ), new THREE.LineBasicMaterial( { color: color } ) ) :
					new THREE.Points( buffer, new THREE.PointsMaterial( {
						
						color: color,
						sizeAttenuation: false,
						size: options.point.size / ( options.point.sizePointsMaterial * 2 ),
						
					} ) );
			if ( settings.name )
				object.name = settings.name;
			scene.add( object );
			if ( typeof SpriteText !== "undefined" ) for ( var i = 0; i < geometry.D3.points.length; i++ ) {

				new SpriteText( i, geometry.D3.points[i], { group: object } );

			}
			object.userData.nd = function () { console.log('object.userData.nd') }
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
		 * @param {Object} [geometryIntersection = { position: [], indices: [[]] }] Arrays of vertices and indexes of the result of the intersection of the panel and the nD object. See <b>settings.geometry</b> of <b>ND</b> constructor for details.
		 * @param {Array} [geometryIntersection.position] Array of vertices of the result of the intersection. See <b>settings.geometry.position</b> of <b>ND</b> constructor for details.
		 * @param {Array} [geometryIntersection.indices] Array of <b>indices</b> of vertices of the result of the intersection. See <b>settings.geometry.indices</b> of <b>ND</b> constructor for details.
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
/*
if ( !edge.indices )
	console.error('111');
*/
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

							const nd = new ND( n, { geometry: settings.geometry, indice: i, iSegments: iSegments, } ),
								s = iSegments - 1;
							var iIntersections;
							if ( s !== 0 ) {//Не создавать iIntersections для ребер

/*								
								geometryIntersection.indices[s] = geometryIntersection.indices[s] || [];
								geometryIntersection.indices[s][i] = geometryIntersection.indices[s][i] || [];
								iIntersections = geometryIntersection.indices[s][i];
*/
								iIntersections = [];

							}
							nd.intersection( geometryIntersection, iIntersections );
							if ( iIntersections && iIntersections.length ) {

								geometryIntersection.indices[s] = geometryIntersection.indices[s] || [];
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
/*						
						if ( vertices.length > 0 ) {

							if ( vertices.length != 2 ) console.error( 'ND.intersection: invalid edge.' );
							else edges.push( vertices );
							
						}
*/

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
	
//непонятно зачем это сообщение								console.error( 'ND.intersection: invalid edges count.' );
								if ( vertices.length != 2 ) console.error( 'ND.intersection: invalid edge.' );
								else edges.push( vertices );
								
							}

						}

					} else {

						var segment = segments[settings.indice];
/*
						segment.iIntersections = segment.indices || [];//индексы сегметнов, которые образуются от пересечения с панелью
										//Для iSegments === 1 это индексы ребер, которые образуются от пересечения с панелью
*/
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

									//длинна массива edge модет быть меньше 2 если всего одна вершина находится на панели
									//В этом случае линия пересечения geometryIntersection состоит из одной точки и невозможно создать ребро
									if ( !edge.boVerticeOnPanel ) {
										
										console.error( 'ND.intersection: invalid edge' );
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
									
//									segment.iIntersections.push( intersectionEdges.length );
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

		this.object = function( object ) {

			fND.domElement.style.display = object.userData.nd ?  'block' : 'none';
			
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
