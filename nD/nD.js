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
//import { SpriteText } from '../SpriteText/SpriteText.js'

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

		//default indices
		function defaultIndices( geometry, nIndices ) {

			geometry = geometry || settings.geometry;
			if ( !geometry )
				return;
			if ( ( n === 2 ) && ( geometry.position.length === 2 ) ) {
				
				geometry.indices = [[0, 1]];
				return;

			}
			nIndices = nIndices || n;
			geometry.indices = [];
			const length = geometry.position.length;
			const iLength = ( nIndices > 1 ) && ( length < 3 ) ?
				length - 1 ://не соединять последнюю верштну с первой если размерность пространства больше 1 и количество вершин в объекте меньше 3. То есть это линия
				length;
			for ( var i = 0; i < iLength; i++ ) {

				const indice = [];
				for ( var j = 0; j < nIndices; j++ ) {

					var ii = i + j;
					if ( ii >= length ) ii = 0;//соединить последнюю верштну с первой
					indice.push( ii );

				}
				geometry.indices.push( indice );

			}

		}
		if ( !settings.geometry.indices ) {

			switch ( n ) {

				case 1://Example [0,1]
					if ( settings.geometry.position ) {

						settings.geometry.indices = [];
						settings.geometry.position.forEach( function ( indice, i ) { settings.geometry.indices.push( i ) } );

					}
					break;
				case 2://Example [[0, 1],[1, 2],[2, 0]]
					defaultIndices();
					break;
				case 3:
					switch ( settings.geometry.position.length ) {

						case 2:
							settings.geometry.indices = [[0, 1]];
							break;
						case 3://Example [[0, 1],[1, 2],[2, 0]]
							defaultIndices();
							break;
						case 4:
							settings.geometry.indices = ND.tetrahedronIndices();//[[[0, 1], [1, 2], [2, 0]], [[0, 1], [1, 3], [3, 0]], [[0, 2], [2, 3], [3, 0]], [[1, 2], [2, 3], [3, 1]]]
							break;
						default: console.error( 'ND: default indices. settings.geometry.position.length = ' + settings.geometry.position.length + ' under constaction/' );

					}
					break;
				default: console.error( 'ND: default indices failed! n = ' + n );

			}

		}

		//edges
		
		//список всех ребер объекта
		settings.geometry.edges = settings.geometry.edges || new Proxy( [], {
			get: function ( target, name, value ) {

				const i = parseInt( name );
				if ( !isNaN( i ) )
					return {

/*
						position: new Proxy( target[i], {
						
							get: function(target, name) {
							  
								const i = parseInt( name );
								if ( !isNaN( i ) ) {

									if ( i < target.length )
										return new Vector( settings.geometry.position[target[i]] );
									console.error( 'ND: settings.geometry.edges position. invalid length: ' + target.length );

								} else console.error( 'ND: settings.geometry.edges position. invalid name: ' + name );
							  
							},
						
						} ),
*/
						intersection: function ( geometryIntersection ) {

							const i = parseInt( name );
							if ( !isNaN( i ) ) {

								if ( i >= target.length )
									console.error( 'ND: settings.geometry.edges[]intersection. invalid length: ' + target.length );
								const indices = target[i];
/*								
								if ( indices.twin ) {

									//У этого ребра есть близнец, у которого уже определена точка пересечения.
									//Поэтому точку пересечения не надо вычислять
									indices.intersection = target[indices.twin].intersection;
									return;
									
								}
*/
								if ( indices.length !== 2 ) {

									console.error( 'ND: settings.geometry.edges[]intersection. indices.length = ' + indices.length );
									return;
									
								}
								const position0 = new Vector( settings.geometry.position[indices[0]] ),
									position1 = new Vector( settings.geometry.position[indices[1]] );
								function indicesIntersection ( position ) {

									//если indices.intersection существует, значит оно устарело и его надо обновить
									//if ( indices.intersection ) console.error( 'ND: settings.geometry.edges[]intersection. Duplicate indices.intersection' );

									switch ( n ){

										case 2:
											break;
										case 3:
											if ( !position )
												break;
											position.push( vectorPlane[n-1] );
											break;
										default: console.error( 'ND: settings.geometry.edges[]intersection indicesIntersection(). n = ' + n + ' under constaction.' );
											
									}
									indices.intersection = { position: position, }
									if ( indices.intersection.position ) indices.intersection.position.iEdge = i;
									
								}
								switch (n){

									case 1:
										if ( vectorPlane[0].between( position0[0], position1[0], true ) )
											geometryIntersection.position.push( vectorPlane[0] );
										break;
									case 2:
//										if ( indices.intersection ) break;
										var vector;
										if ( vectorPlane[1].between( position0[1], position1[1], true ) ) {
											
											const a = ( position1[1] - position0[1] ) / ( position1[0] - position0[0] ),
												b = position0[1] - a * position0[0],
												x = Math.abs(a) === Infinity ? position1[0] : ( vectorPlane[1] - b ) / a;
											if ( isNaN( x ) ) console.error( 'ND.intersection: x = ' + x );
											if ( !x.between( position0[0], position1[0], true ) )
												break;
											vector = [x, vectorPlane[1]];
	//										vector.segment = [s[0].index, s[1].index];//s.segment;
	//										console.log('vector: ' + vector + ' segment: ' + vector.segment + ' s[0]: ' + s[0][0] + ' ' + s[0][1] + ' s[1]: ' + s[1][0] + ' ' + s[1][1])
//											geometryIntersection.position.push( vector );

										}
										indicesIntersection ( vector );
										break;
									default:
										const nD02 = new ND( n - 1, {
											
												geometry: {
												
													position: settings.geometry.position,
													indices: [indices],//settings.geometry.indices[0],
													iAxes: [1,2],
													
												},
												vectorPlane: vectorPlane.array,
											
											} ),
											arrayIntersects02 = nD02.intersection();
										const nD12 = new ND( n - 1, {
											
												geometry: {
												
													position: settings.geometry.position,
													indices: [indices],//settings.geometry.indices[0],
													iAxes: [0,2],
													
												},
												vectorPlane: vectorPlane.array,
											
											} ),
											arrayIntersects12 = nD12.intersection();
										indicesIntersection ( arrayIntersects02.length && arrayIntersects12.length ?
												[arrayIntersects12[0][0], arrayIntersects02[0][0]] : undefined );
/*										
										indices.intersection = {
											
											position: arrayIntersects02.length && arrayIntersects12.length ?
												[arrayIntersects12[0][0], arrayIntersects02[0][0]] : undefined,
											
										}
*/
/*											
										if ( arrayIntersects02.length && arrayIntersects12.length ) {
				
											console.log('');
											console.log('arrayIntersects02[0]: ' + arrayIntersects02[0][0])
											console.log('arrayIntersects02[1]: ' + arrayIntersects02[1][0])
											console.log('arrayIntersects12[0]: ' + arrayIntersects12[0][0])
											console.log('arrayIntersects12[1]: ' + arrayIntersects12[1][0])
											geometryIntersection.position.push( [arrayIntersects12[0][0], arrayIntersects02[0][0]] );
											console.log(geometryIntersection.position[geometryIntersection.position.length - 1])
											geometryIntersection.position.push( [arrayIntersects12[1][0], arrayIntersects02[1][0]] );
											console.log(geometryIntersection.position[geometryIntersection.position.length - 1])
				
										}
*/
											
								}

							} else console.error( 'ND: settings.geometry.edges[]intersection. invalid name: ' + name );

						},
						indices: target[parseInt( name )],

					};
//					return { position: settings.geometry.position[target[i]] };
				switch( name ){

					case 'push':
						return target.push;
					case 'length':
						return target.length;
					default: console.error( 'ND: settings.geometry.edges getter. Invalid name: ' + name );
						
				}
				
			}
		} );
		
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
		settings.geometry.iEdges = settings.geometry.iEdges || [];
		
		function addEdge( indices, iEdges ) {

			if ( settings.geometry.position.length < 2 ) return;//одна точка не имеет ребер
			indices = indices || settings.geometry.indices;
			if ( indices.length !== 2 ) {

				console.error( 'ND edges addEdge: invalid indices.length = ' + indices.length );
				return;

			}
			if ( indices[0] instanceof Array === true ) {

				console.error( 'ND edges addEdge: invalid indices' );
				return;

			}
			
			iEdges = iEdges || settings.geometry.iEdges;
			
			//find duplicate edge
			for ( var i = 0; i < settings.geometry.edges.length; i++ ) {

				const edgeIndices = settings.geometry.edges[i].indices;
				if ( ( edgeIndices[0] === indices[0] ) && ( edgeIndices[1] === indices[1] ) ) {
					
					iEdges.push( i );
					return;

				}
				if ( ( edgeIndices[0] === indices[1] ) && ( edgeIndices[1] === indices[0] ) ) {
					
					//у этого ребра есть ребро близнец, у которого индексы вершин поменены местами
					//Поэтому можно не искать точку пересечения а брать ее из близнеца
					indices[0] = settings.geometry.edges[i].indices[0];
					indices[1] = settings.geometry.edges[i].indices[1];
					iEdges.push( i );
					return;
//					indices.twin = i;
//					break;

				}
				
			}

			iEdges.push( settings.geometry.edges.push( indices ) - 1 );

		}
		function addEdges( indices, iEdges ) {

			for ( var i = 0; i < indices.length; i++ ) {

				const indice = indices[i];
				if ( indice[0] instanceof Array ) {
					
					const iEdge = [];
					iEdges = iEdges || settings.geometry.iEdges
					iEdges.push( iEdge );
					addEdges( indice, iEdge );
					
				} else addEdge( indice, iEdges );

			}

		}
		switch ( n ) {

			case 1://[[0],[1]]
				addEdge();
				break;
/*				
			case 2://[[0, 1], [0, 2], [1, 2]]
				for ( var i = 0; i < settings.geometry.indices.length; i++ )
					addEdge( settings.geometry.indices[i] );
				break;
*/
			//n = 2 [[0, 1], [0, 2], [1, 2]]
			//n = 3 [[[0, 1], [1, 2], [2, 0]], [[0, 1], [1, 3], [3, 0]], [[0, 2], [2, 3], [3, 0]], [[1, 2], [2, 3], [3, 1]]] or [[0, 1, 2], [0, 1, 3], [0, 2, 3], [1, 2, 3],]
			default: addEdges( settings.geometry.indices );
/*
				for ( var i = 0; i < settings.geometry.indices.length; i++ ) {
					
					const indice = settings.geometry.indices[i];
					if ( indice[0] instanceof Array )
						consol.log('');
					else
						addEdge( indice );

				}
*/

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

//				vectorSettings.axis = vectorSettings.axis || 'x';
				if ( array instanceof Array === false ) {

					if ( typeof array === 'number' ) array = [array];
					else if ( array.array ) array = array.array;
					else console.error( 'ND.Vector: invalid array type' );

				}
				if ( n !== undefined ) while ( array.length < n ) array.push( 0 );

//				Object.defineProperties( this, { } );

				//https://stackoverflow.com/questions/2449182/getter-setter-on-javascript-array
				return new Proxy( this, {

					get: function ( target, name ) {

						switch ( name ) {

							case "length":
								return n + 1;
//								return array.length;
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
						//						return target[name];

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
						//https://github.com/GoogleChrome/proxy-polyfill/issues/20
						return true;//target[i];

					}

				} );

			}
			push( value ) { console.error( 'ND.Vector.push() unavailable' ); }
			pop() { console.error( 'ND.Vector.pop() unavailable' ); }

		}
//const a = new Vector( [1,2] ), b = a[0], l = a.length, p = a.point/*, t = a.pop(); a.push(3);*/

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
			set position( position ) { settings.geometry.position = position; },
			get segments() {

				//https://stackoverflow.com/questions/2449182/getter-setter-on-javascript-array
				return new Proxy( this, {

					get: function ( target, name ) {

						switch ( name ) {

							case 'length':
								return settings.geometry.indices.length;

						}
						function indice() { return settings.geometry.indices[parseInt( name )] }
						switch ( n ) {

							case 1:
							case 2:
							case 3:
								return {
									
									position:
										new Proxy( this, {
						
											get: function ( target, name ) {

												const i = parseInt( name );
												if ( isNaN( i ) ) {

													switch ( name ) {
							
														case 'length':
															return indice().length;
														default: console.error( 'ND.geometry.segments.position: invalid name: ' + name );
							
													}
													return;
													
												}
												const ip = indice()[i];
												if ( ip === undefined ) {

													console.error( 'ND.geometry.segments.position: Invalid position index = ' + i );
													return;
													
												}
												return new Vector( settings.geometry.position[ip] );
						
											},
						
										} ),
									indices: indice(),
								
								}
							default: console.error( 'ND.geometry.segments[]: n = ' + n + ' under constraction' );
								return;

						}
						return new Vector( settings.geometry.position[i] );

					},

				} );

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
/*
					switch ( n ) {

						case 1://[[0]	,	[1]]							to [0, 1]
						case 2://[[0, 1],	[0, 2],	  [1, 2]]				to [0, 1, 0, 2, 1, 2],
						case 3://[[0, 1, 2],[0, 1, 3],[0, 2, 3],[1, 2, 3],] to [0, 1, 0, 2, 1, 2, 0, 1, 0, 3, 1, 3, 0, 2, 0, 3, 2, 3, 1, 2, 1, 3, 2, 3]
							function getIndices( sIndices ) {

								sIndices.forEach( function ( indice ) {
									
									switch ( indice.length ) {

										case 1:
										case 2:
											break;
										case 3:
											const indiceNew = [];
											for ( var i = 0; i < indice.length; i++ ) {
												
												for ( var j = i + 1; j < indice.length; j++ ) {
													
//													indiceNew.push( [indice[i], indice[j]] );
													indiceNew.push( indice[i] );
													indiceNew.push( indice[j] );

												}
												
											}
											getIndices( indiceNew );
											return;
										default: console.error( 'ND.geometry.D3.indices: under constraction.' );
											return;
										
									}
									indice.forEach( function ( i ) {

										if ( i >= settings.geometry.position.length ) console.error( 'ND.geometry.D3: invalid indice = ' + i );
										else indices.push( i );

									} );
									
								} );
							}
							getIndices( settings.geometry.indices );
							break;
						default: console.error( 'ND.Geometry.indices: under constaction. n = ' + n );

					}
*/
					for ( var i = 0; i < settings.geometry.edges.length; i++ )
						settings.geometry.edges[i].indices.forEach( function ( i ) { indices.push( i ) } );
					return indices;

				},

			},

		}
//const l = geometry.position.length, p0 = geometry.position[0], p = geometry.points;

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
/*			
			const indices = [],//[0,1,1,2,2,0],
				length = geometry.length;
			for ( var i = 0; i < length; i++ ) {

				indices.push( i );
				indices.push( i < ( length - 1 ) ? i + 1 : 0 );

			}
*/			
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
			if ( typeof SpriteText !== "undefined" ) for ( var i = 0; i < geometry.points.length; i++ ) {

/*				
				const point = geometry.points[i];
				if ( point.spriteText ) {

					object.remove( point.spriteText );
					if ( options.guiSelectPoint ) options.guiSelectPoint.removeMesh( spriteText );
					
				}
*/
				const spriteText = new SpriteText( i, geometry.points[i], { group: object } );
//				object.add( spriteText );
//				if ( options.guiSelectPoint ) options.guiSelectPoint.addMesh( spriteText );
/*				
				geometry.spriteTexts = geometry.spriteTexts || [];
				geometry.spriteTexts.push( spriteText );
				geometry.object = object;
*/

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
		 */
		this.intersection = function ( usedSegmentsPrev ) {

/*
			const segments = geometry.segments,
				usedSegments = [];
*/
			const geometryIntersection = { position: [] };//, segments };
			switch ( n ) {

				case 1:
					if ( ( settings.geometry.edges.length !== 1 ) || ( settings.geometry.iEdges.length !== 1 ) ) console.error( 'ND.intersection: under constraction. Это не линия.' );
					const edge = settings.geometry.edges[settings.geometry.iEdges];
					edge.intersection( geometryIntersection );
/*					
						position0 = edge.position[0], position1 = edge.position[1];
//						position0 = settings.geometry.position[edge[0]], position1 = settings.geometry.position[edge[1]];
					if ( vectorPlane[0].between( position0[0], position1[0], true ) )
						geometryIntersection.position.push( vectorPlane[0] );
					if ( segments.length !== 2 ) console.error( 'ND.intersection: under constraction. Это не линия.' );
					if ( vectorPlane[0].between( segments[0].position[0][0], segments[1].position[0][0], true ) )
						geometryIntersection.position.push( vectorPlane[0] );
*/
					break;
				default: {

					function iEdgeIntersection( edges ) {

						for ( var i = 0; i < edges.length; i++ ) {

							const iEdge = edges[i];
							if ( iEdge instanceof Array ) iEdgeIntersection( iEdge )
							else settings.geometry.edges[iEdge].intersection( geometryIntersection );

						}

					}
					iEdgeIntersection( settings.geometry.iEdges );
/*
					for ( var i = 0; i < settings.geometry.iEdges.length; i++ ) {
						
						if ( settings.geometry.iEdges[i] instanceof Array ) {

							console.log('settings.geometry.iEdge is array');
							
						}else settings.geometry.edges[settings.geometry.iEdges[i]].intersection( geometryIntersection );

					}
*/
					function getGeometryIntersection( segment, nSegment ) {

/*						
						if ( segment.length !== nSegment ) {

							console.error( 'ND.intersection: invalid settings.geometry.indices segment = ' + segment.length );
							return;

						}
*/
						if ( nSegment > 2 ) {

							segment.forEach( function ( item ) { getGeometryIntersection( item, nSegment - 1 ) } );
							return;
							
						}
						const vertices = [];
						segment.forEach( function ( i ) {

							const edgeIndices = settings.geometry.edges[i].indices;
							if ( edgeIndices.intersection.position ) {
								
/*								
								for ( var iIntersection = 0; iIntersection < geometryIntersection.position.length; iIntersection++ ) {

									if ( geometryIntersection.position[iIntersection].iEdge === i ) return;
										
								}
*/
								if ( !edgeIndices.intersection.position.boUsed ) {
									
									edgeIndices.intersection.position.boUsed = true;
									vertices.push( edgeIndices.intersection.position );

								}

							}

						} );
/*						
						segment.forEach( function ( edge ) {

							if ( edge.intersection.position )
								vertices.push( edge.intersection.position );

						} );
*/
						if ( vertices.length > 0 ) geometryIntersection.position.push( ...vertices );
//						if ( vertices.length === 2 ) geometryIntersection.position.push( [...vertices] );
/*						
						if ( vertices.length === ( segment.length - 1 ) ) geometryIntersection.position.push( ...vertices );
						else if ( vertices.length !== 0 ) console.error( 'ND.intersection: invalid intersection vertices count = ' + vertices.length );
*/

					}
//					getGeometryIntersection( settings.geometry.indices, n );
					getGeometryIntersection( settings.geometry.iEdges, n );
					defaultIndices( geometryIntersection, n - 1 );
/*
					settings.geometry.indices.forEach( function ( segment ) {

						if ( segment.length !== 3 ) {

							console.error( 'ND.intersection: invalid settings.geometry.indices segment = ' + segment.length );
							return;

						}
						const vertices = [];
						segment.forEach( function ( edge ) {

							if ( edge.intersection.position )
								vertices.push( edge.intersection.position );

						} );
						if ( vertices.length === 2 ) geometryIntersection.position.push( [...vertices] );
						else if ( vertices.length !== 0 ) console.error( 'ND.intersection: invalid intersection vertices count = ' + vertices.length );

					} );
*/

				}

			}
			if ( settings.onIntersection ) {

/*
				const array = [];
				geometryIntersection.position.forEach( function ( intersect ) { array.push( intersect instanceof Array ? [...intersect] : intersect ); } );
				settings.onIntersection( new Geometry( array ) );
*/
				settings.onIntersection( geometryIntersection );

			}
			if ( scene ) {

				//если я не буду копировать массив, то элементы массива arrayIntersects преобразуются в класс Proxy.
				//Если потом этот массив использовать для содания класса ND другой размерности, то получу сообщение об ошибке
				//ND: Invalid vector dimension
//				const arrayIntersectsCopy = [...arrayIntersects];

				if ( objectIntersect ) {

					if ( options.guiSelectPoint ) options.guiSelectPoint.removeMesh( objectIntersect );
					scene.remove( objectIntersect );
					options.eventListeners.removeParticle( objectIntersect );

				}
				if ( geometryIntersection.position.length )
					objectIntersect = create3DObject( geometryIntersection, { name: 'Intersection' } );
//					objectIntersect = create3DObject( new Geometry( geometryIntersection.position ), { name: 'Intersection' } );

			}
			if ( geometryIntersection.position.length > n ){

/*				
				//remove duplicate points
				for ( var i = 0; i < arrayIntersects.length; i++ ) {

					for ( var j = i + 1; j < arrayIntersects.length; j ++ ) {

						//https://stackoverflow.com/a/19746771/5175935
						if ( arrayIntersects[i].every( function(value, index) { return value === arrayIntersects[j][index]} ) )
							arrayIntersects.splice(j, 1);

					}

				}
*/				

			}
//			if ( geometryIntersection.position.length === ( n - 1 ) ) geometryIntersection.position.pop();//грань коснулась панели одной вершиной
//			else if ( ( geometryIntersection.position.length !== n ) && ( geometryIntersection.position.length !== 0 ) ) console.error( 'ND.intersection: geometryIntersection.position.length !== ' + n );
//			return arrayIntersects;
			return geometryIntersection.position;

		}

		const THREE = three.THREE, scene = settings.scene;// || three.group;//, options = settings.options || three.options || {};
/*
		//debug
		switch( n ) {

			case 1:
				if ( geometry.length !== n + 1 ) console.error( 'ND: geometry.length !== ' + ( n + 1 ) );
				break;
			case 2: break;
			default: console.error( 'nD vectorPlane.onChange: Invalid dimension = ' + n );

		}
*/		
/*
		for ( var i = 0; i < geometry.position.length; i++ ) {

			if ( geometry.position[i].length !== n ) {

				console.error( 'ND: Invalid vector dimension' );
				while ( geometry[i].length < n ) geometry[i].push( 0 );
				//return;

			}

		}
*/		

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
			/*
						const points = [];
						for ( var i = 0; i < geometry.length; i++ )
							points.push( geometry[i].point );
			*/
			if ( object3D ) {

				for ( var i = object3D.children.length - 1; i >= 0; i-- ) {

					const child = object3D.children[i];
					if ( child instanceof THREE.Sprite ) {

						object3D.remove( child );
						if ( options.guiSelectPoint ) options.guiSelectPoint.removeMesh( child );
						
					}
					
				}
//				console.log('object3D.children.length = ' + object3D.children.length);
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
				this.createMesh = function ( /*scene*/ ) {

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
							mesh = new THREE.GridHelper( 2, 10, color, color );// 2000, 20, 0x888888, 0x444444 );
							mesh.rotation.x = Math.PI / 2;
							break;
						default: {

							console.error( 'ND.Plane.createMesh: invalid dimension = ' + n );
							return;

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

//					geometry = new Geometry( geometryNew.geometry );
					geometry.position = geometryNew.position;
					projectTo3D();
					this.intersection()

				},

			},

		} );

	}

}

/* *
 * Converts face vertex indices to an array of pairs of face edge vertex index.
 * @param {Array} faceIndices face vertex indices
 * @returns array of pairs of face edge vertex index.
 * @example //Converting an array of triangle vertex indices:
 * ND.faceToEdgesIndices( [0, 1, 2] ) //returns followed array [[0, 1], [1, 2], [2, 0]]
 */
ND.faceToEdgesIndices = function ( faceIndices ) {

	const edgesIndices = [],
		length = faceIndices.length;
	for ( var i = 0; i < length; i++ ) {

		edgesIndices.push( [faceIndices[i], i < ( length - 1 ) ? faceIndices[i + 1] : faceIndices[0]] );
/*		
		edgesIndices.push( faceIndices[i] );
		edgesIndices.push( i < ( length - 1 ) ? faceIndices[i + 1] : faceIndices[0] );
*/

	}
	return edgesIndices;

}

/* *
 *@returns
 * <pre>
 * An array of vertex indices of 4 tetrahedron faces
 * <b>[[0, 1, 2], [0, 1, 3], [0, 2, 3], [1, 2, 3]]</b>
 * </pre>
 * */
/**
 *@returns
 * <pre>
 * An array of segments of pairs of vertex indices of edges of tetrahedron faces
 * <b>[[[0, 1], [1, 2], [2, 0]], [[0, 1], [1, 3], [3, 0]], [[0, 2], [2, 3], [3, 0]], [[1, 2], [2, 3], [3, 1]]]</b>
 * </pre>
 * */
ND.tetrahedronIndices = function () {

//	return [[0, 1, 2], [0, 1, 3], [0, 2, 3], [1, 2, 3]];
	return [
		ND.faceToEdgesIndices( [0, 1, 2] ),
		ND.faceToEdgesIndices( [0, 1, 3] ),
		ND.faceToEdgesIndices( [0, 2, 3] ),
		ND.faceToEdgesIndices( [1, 2, 3] ),
	];

}

export default ND;

//https://stackoverflow.com/a/18881828/5175935
if ( !Number.prototype.between )
	Number.prototype.between = function ( a, b, inclusive ) {

		var min = Math.min.apply( Math, [a, b] ),
			max = Math.max.apply( Math, [a, b] );
		return inclusive ? this >= min && this <= max : this > min && this < max;

	};
