/**
 * @module FermatSpiral
 * @description Implementation of Vogel's model of [Fermat's spiral]{@link https://en.wikipedia.org/wiki/Fermat's_spiral}.
 * Thanks to [Fermat_Spiral_Vogel_Model]{@link https://github.com/ceme/Fermat_Spiral_Vogel_Model}
 *
 * @author [Andrej Hristoliubov]{@link https://github.com/anhr}
 *
 * @copyright 2011 Data Arts Team, Google Creative Lab
 *
 * @license under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
*/

import PositionController from '../PositionController.js';

import ND from '../nD/nD.js';
//import ND from '../nD/build/nD.module.js';
//import ND from '../nD/build/nD.module.min.js';
//import ND from 'https://raw.githack.com/anhr/commonNodeJS/master/nD/nD.js';
//import ND from 'https://raw.githack.com/anhr/commonNodeJS/master/nD/build/nD.module.js';
//import ND from 'https://raw.githack.com/anhr/commonNodeJS/master/nD/build/nD.module.min.js';
if ( ND.default ) ND = ND.default;

class FermatSpiral {

	/**
	 * Implementation of Vogel's model of <a href="https://en.wikipedia.org/wiki/Fermat%27s_spiral" target="_blank">Fermat's spiral</a>.
	 * @param {object} [settings={}] The following settings are available
	 * @param {number} [settings.n=2] space dimension of Fermat's spiral.
	 * @param {number} [settings.count=500] points count.
	 * @param {Float} [settings.c=0.04] constant scaling factor. See <a href="https://en.wikipedia.org/wiki/Fermat%27s_spiral" target="_blank">Fermat's spiral</a> for details.
	 * @param {Array|number} [settings.position] Array - position of Fermat's spiral in n-dimensional coordinates.
	 * <pre>
	 * number - position of the 0 coordinate of Fermat's spiral.
	 * See <b>settings.object.position</b> parameter of the <a href="../../nD/jsdoc/module-ND-ND.html" target="_blank">ND</a> class.
	 * <pre>
	 * @param {Array|number} [settings.rotation] Array - rotation in radians of Fermat's spiral in n-dimensional coordinates.
	 * <pre>
	 * number - rotation in radians around axis 0 or rotation around axis 2 for 2D Fermat's spiral i.e. space dimension n = 2.
	 * See <b>settings.object.rotation</b> parameter of the <a href="../../nD/jsdoc/module-ND-ND.html" target="_blank">ND</a> class.
	 * <pre>
	 * @param {object} [settings.object] creates an [LineSegments]{@link https://threejs.org/docs/index.html?q=lines#api/en/objects/LineSegments} object as <b>FermatSpiral</b>.
	 * @param {Group} settings.object.scene [Scene]{@link https://threejs.org/docs/index.html?q=scene#api/en/scenes/Scene}.
	 * @param {Options} [settings.object.options] Add <b>options</b> key if you want to add custom controllers for <b>FermatSpiral</b> object into <a href="../../guiSelectPoint/jsdoc/index.html" target="_blank">GuiSelectPoint</a>.
	 * See the <b>options</b> parameter of the <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
	 * @param {String} [settings.object.color='green'] color of <b>FermatSpiral</b>.
	 */
	constructor( settings = {} ) {

		const points = [],//, indices = [[]];
			n = settings.n === undefined ? 2 : settings.n;
		settings.count = settings.count === undefined ? 500 : settings.count;
		settings.c = settings.c === undefined ? 0.04 : settings.c;//constant scaling factor
		const _this = this;
		this.geometry = {

			gui: function( fParent, dat, /*ndGui, */options, nd ){
				
				settings.object = settings.object || {};
				settings.object.options = options;

				//Localization

				const getLanguageCode = options.getLanguageCode;

				const lang = {

					fermatSpiral: "Fermat's Spiral",
					fermatSpiralTitle: "Fermat's Spiral Vogel Model.",
					
					count: 'Points',
					countTitle: 'Spiral points count.',

					c: 'scaling factor',
					cTitle: "constant scaling factor of of Vogel's model of Fermat's spiral.",

					defaultButton: 'Default',
					defaultPositionTitle: 'Restore default spiral',

					notSelected: 'Not selected',

				};

				const _languageCode = getLanguageCode();

				switch ( _languageCode ) {

					case 'ru'://Russian language

						lang.fermatSpiral = 'Спираль Ферма';
						lang.fermatSpiralTitle = 'Спираль Ферма. Модель Фогеля.';
						
						lang.count = 'Точки';
						lang.countTitle = 'Количестао точек спирали';

						lang.c = 'Масштаб';
						lang.cTitle = 'Масштабный коэффициент модели Фогеля спирали Ферма';

						lang.defaultButton = 'Восстановить';
						lang.defaultPositionTitle = 'Восстановить параметры спирали';

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
				fParent = fParent.addFolder( lang.fermatSpiral );
				fParent.customFolder = true;
				dat.folderNameAndTitle( fParent, lang.fermatSpiral, lang.fermatSpiralTitle );

				//Points count

				const fCount = fParent.addFolder( lang.count );
				dat.folderNameAndTitle( fCount, lang.count, lang.countTitle );

				fCount.add( new PositionController( function ( shift ) {

					settings.count += shift;
					if ( settings.count < 1 ) settings.count = 1;
					cCount.setValue( settings.count, true );

				},
					{

						getLanguageCode: getLanguageCode,
						min: 1, max: 100, step: 1, settings: { offset: 1 },

					}
				) );

				function controllerUpdate() {
				
					update();
					nd.object = { 
					
						update: true,
						geometry: _this.geometry,
					
					}
			
				}
				const cCount = dat.controllerZeroStep( fCount, settings, 'count', function ( value ) { controllerUpdate(); } );
				dat.controllerNameAndTitle( cCount, lang.count, lang.countTitle );

				//constant scaling factor

				const fC = fParent.addFolder( lang.c );
				dat.folderNameAndTitle( fC, lang.c, lang.cTitle );

				fC.add( new PositionController( function ( shift ) {

					settings.c += shift;
					if ( settings.c < 0 ) settings.c = 0;
					cC.setValue( settings.c, true );

				},
					{

						getLanguageCode: getLanguageCode,
						min: 0, max: 0.1, step: 0.001, settings: { offset: 0.001 },

					}
				) );

				const cC = dat.controllerZeroStep( fC, settings, 'c', function ( value ) { controllerUpdate(); } );
				dat.controllerNameAndTitle( cC, lang.c, lang.cTitle );

				//Restore Fermat's spiral.
				const defaultValues = {

					count: settings.count,
					c: settings.c,

				}
				const buttonDefault = fParent.add( {

					defaultF: function ( value ) {

						settings.count = defaultValues.count;
						cCount.setValue( settings.count );
						settings.c = defaultValues.c;
						cC.setValue( settings.c );
						update();

					},

				}, 'defaultF' );
				dat.controllerNameAndTitle( buttonDefault, lang.defaultButton, lang.defaultPositionTitle );

				return fParent;
				
			},
			position: new Proxy( points, {

				get: function ( points, name, args ) {

					const i = parseInt( name );
					if ( !isNaN( i ) ) {

						if ( points instanceof Array ) {

							if ( i < points.length && ( points[i] !== undefined ) )
								return points[i];
							return 0;

						}
						return points;

					}
					switch ( name ) {

						case 'target': return points.target;
						case 'isProxy': return points.isProxy;
						case 'length': return settings.count;
						case 'boPositionError': return points.boPositionError;
						case 'forEach': return points.forEach;
						default: console.error( 'FermatSpiral: geometry.position get : ' + name );

					}

				},

			} ),
			indices: [],

		}

		function update() {

			const maxLength = 6;//максимальное количество ремер вершины

			class Vector {

				/* *
				 * @description
				 * <pre>
				 * An n-dimensional vector is point in an n-dimensional space.
				 * The length of an array is the dimension of the space.
				 * @param {Array} [array=0] array of the values for appropriate axes.
				 * </pre>
				 */
				constructor( array = 0, vectorSettings = {} ) {

					if ( array.isVector ) return array;
					if ( array instanceof Array === false ) {

						if ( typeof array === 'number' ) array = [array];
						else if ( array.array ) array = array.array;
						else console.error( 'FermatSpiral: Vector: invalid array type' );

					}
					if ( n !== undefined ) while ( array.length < n ) array.push( 0 );
					
					//индексы вершин, которые ближе всего расположены к текущей вершине
					array.aNear = new Proxy([], {

						get: function ( aNear, name ) {

							const i = parseInt(name);
							if (!isNaN(i)) {

								if (name >= aNear.length)
									console.error('FermatSpiral: Vector aNear get. Invalid index = ' + name);
								return aNear[i];

							}
							function getMax() {

								var iMax;
								for (var i = 0; i < aNear.length; i++) {

									if ( iMax === undefined ) iMax = i;
									else if ( aNear[iMax].distance < aNear[i].distance) iMax = i;

								}
								if ( iMax != undefined )  aNear.iMax = iMax;
								else console.error( 'FermatSpiral: Vector aNear add getMax. Invalid iMax = ' + iMax );

							}
							switch (name) {

								case 'length': return aNear.length;
								case 'add': return function ( i, distance ) {

									//debug
									for( var j = 0; j < aNear.length; j++ ) {

										if ( aNear[j].i === i ) {

											console.error( 'FermatSpiral: Vector aNear add. Duplicate index = ' + i );
											return;
											
										}
										
									}
									
									const newItem = { i: i, distance: distance, };
									if ( aNear.length < 6 ) {
										
										aNear.push( newItem );
										getMax();
										
									} else {

										if ( aNear[aNear.iMax].distance > distance ) {
											
											aNear[aNear.iMax] = newItem;
											getMax();

										}
			
									}
									
									
								}
								default: console.error('FermatSpiral: Update Vector get. name: ' + name);

							}

						},
						set: function (target, name, value) {

							target[name] = value;
							return true;

						},

					});

					//https://stackoverflow.com/questions/2449182/getter-setter-on-javascript-array
					return new Proxy( array, {

						get: function (array, name ) {

							var i = parseInt( name );
							if ( isNaN( i ) ) {

								switch ( name ) {

									case "array": return array;
									/* *
									* @description
									* <pre>
									* Projection of the <b>Vector</b> object into 3D space.
									* Returns <b>THREE.Vector3</b> object.
									* Projection of 1-dimensional vector into 3D space: <b>THREE.Vector3( vector[0], 0, 0 ) </b>.
									* Projection of 2-dimensional vector into 3D space: <b>THREE.Vector3( vector[0], vector[1], 0 ) </b>.
									* Projection of 3-dimensional vector into 3D space: <b>THREE.Vector3( vector[0], vector[1], vector[2] ) </b>.
									* </pre>
									*/
									case "point":
										const THREE = three.THREE;
										return new THREE.Vector3( this.get( undefined, 0 ), this.get( undefined, 1 ), this.get( undefined, 2 ) );
									/*
									* Adds v to this vector.
									*/
									case "add":
										return function ( v ) {

											array.forEach((value, i) => array[i] += v[i] );
											return this;

										}
									case "index": return vectorSettings.index;
									case "isVector": return true;
									/*
									* Computes the distance from this vector to v.
									*/
									case "distanceTo":
										return function ( v ) {

											var a = 0;
											array.forEach( ( item, i ) => { const b = item - v[i]; a = a + b * b; } )
											return Math.sqrt( a );

										}
									case "aNear": return array.aNear;
									case "positionWorld": return array.positionWorld;
									case "forEach": return array.forEach;
									case "length": return array.length;
									case "edges": 
										
										if (!array.edges )
											array.edges = new Proxy([], {

												get: function (edges, name, args) {
							
													const i = parseInt(name);
													if (!isNaN(i)) {
							
														if (edges instanceof Array) {
							
															if (i < edges.length && (edges[i] !== undefined))
																return edges[i];
															return 0;
							
														}
														return edges;
							
													}
													switch (name) {
							
														case 'push': return edges.push;
														case 'length': return edges.length;
														case 'name': return edges.name;
														case 'forEach': return edges.forEach;
														case 'add': return function(id){ edges.push(id); }
														default: console.error('FermatSpiral: Vector.edges get : ' + name);
							
													}
							
												},
												set: function (edges, name, value) {
							
													const i = parseInt(name);//индекс ребра
													if (!isNaN(i)) {
							
														//value - индекс ребра
//														const maxLength = 6;
														if (edges.length >= maxLength ) {

															throw new MyError('FermatSpiral: update Vector get edges set. Edges length > ' + maxLength, MyError.IDS.edgesCountOverflow );

														}
//if ( ( array.i === 9 ) && ( value === 40 ) )
//	console.log( 'vertice ' + array.i );
														if (i >= edges.length) edges.push(value);
														else edges[i] = value;
														return edges.length;
							
													}
													switch (name) {
							
														case 'length': edges.length = value; return true;
														default: console.error('fermatSpiral: Vector edges set. Invalid name: ' + name);
							
													}
							
												}
							
											});
										return array.edges;
									case 'indices': return array.indices;
									case 'i': return array.i;
									case 'arguments': return array.arguments;
									default: console.error( 'fermatSpiral: Vector get. Invalid name: ' + name );

								}
								return;

							}
							if ( i >= n )
								return 0;
							if ( ( array.length > n ) && settings.object.geometry.iAxes && ( i < settings.object.geometry.iAxes.length ) )
								i = settings.object.geometry.iAxes[i];
							return array[i];

						},
						set: function ( array, name, value ) {

							const i = parseInt( name );
							if ( !isNaN( i ) ) {
								
								if ( i >= array.length ) {
	
									array.push( value );
									return array.length;
	
								}
								array[i] = value;
								if ( vectorSettings.onChange ) vectorSettings.onChange();
								return true;
							
							}
							switch ( name ) {
	
								case 'onChange': vectorSettings.onChange = value; break;
								case 'positionWorld': array.positionWorld = value; break;
								case 'i': array.i = value; break;
								default: console.error( 'fermatSpiral: Vector set. Invalid name: ' + name );
	
							}
							return true;

						}

					} );

				}
				push( value ) { console.error( 'FermatSpiral Vector.push() unavailable' ); }
				pop() { console.error( 'FermatSpiral Vector.pop() unavailable' ); }

			}

			//График для последней точки спирали x ближайшая точка с максимальным индексом y
			//https://www.kontrolnaya-rabota.ru/s/grafik/tochka/
			//формула: y = 1.449378838441997 * Math.sqrt (x)
			//x; y;
			//0.0; 0.0
			//1.0; 1.0
			//5; 2
			//7; 3
			//17; 5
			//38; 8
			//95; 13
			//234; 21
			//583; 34
			//1480; 55
			//9871;144

			//Точки спирали, находящиеся на краю спирали, иногда имеют лишние ребра, напраленные внутрь спирали.
			//Это происходит потому, что нет ближайших точек, которые находятся за пределами спирали.
			//Для решения проблемы увеличиваю количество точек спирали l больше settings.count для того что бы точки, расположенные на краю спирали имели ребра
			//направленные к этим лишним точкам.
			const l = settings.count + parseInt( 3.8 * Math.sqrt( settings.count ) );
			//3.8 выбрал что бы не было лишних ребер при settings.count = 3800

			points.length = 0;
			const golden_angle = 137.5077640500378546463487,//137.508;//https://en.wikipedia.org/wiki/Golden_angle
				a = golden_angle * Math.PI / 180.0, b = 90 * Math.PI / 180.0;
			for ( var i = 0; i < l; i++ ) {

				const angleInRadians = i * a - b;
				const radius = settings.c * Math.sqrt( i );
				points.push( new Vector([radius * Math.cos( angleInRadians ), radius * Math.sin( angleInRadians )]) );

			}

			//indices

			//edges
			_this.geometry.indices[0] = new Proxy([], {

				get: function (edges, name, args) {

					const i = parseInt(name);
					if (!isNaN(i)) {

						const edge = edges[i];
						if ((edge === undefined) || edge.length != 2) {

							//								console.error( 'FermatSpiral; indices edges get. invalid edge: ' + edge );
							throw new Error('FermatSpiral: indices edges get. Invalid edge: ' + edge + ' i = ' + i);

						}
						return edge;

					}
					switch (name) {

						case 'forEach': return edges.forEach;
						case 'length': return edges.length;
						case 'push': return edges.push;
						case 'isProxy': return edges.isProxy;
						case 'selected': return edges.selected;
						case 'hidden': return edges.hidden;
						case 'add': return function(edge) { edges.push(edge); }
						default: console.error('FermatSpiral: geometry edges get : ' + name);

					}

				},
				set: function (edges, name, value) {

					//value - массив с индексами вершин ребра
					const i = parseInt(name);//индекс ребра
					if (!isNaN(i)) {

/*
						const i0 = value[0], i1 = value[1]
						if (
							((i0 === 0) && (i1 === 4)) || ((i0 === 4) && (i1 === 0)) ||
							((i0 === 0) && (i1 === 6)) || ((i0 === 6) && (i1 === 0))
						)
							throw new MyError('FermatSpiral: indices set. Invalid edge.', MyError.IDS.invalidEdge);
*/
						//добавить индекс ребра в список ребер двух вершин, которые составляют ребро
						function addIndex(edgeIndex) {

							if( points[value[edgeIndex]].edges.length >= maxLength ) return false;
/*							
							try {

								points[value[edgeIndex]].edges.push(i);

							} catch (e) {

								if (e.id === e.IDS.edgesCountOverflow)
									return false;
								else console.error(e.message);

							}
*/
							return true;

						}
/*						
						if ( !addIndex(0) || !addIndex(1) )
							throw new MyError('FermatSpiral: geometry.indices edges set. Invalid edge.', MyError.IDS.edgesCountOverflow);
*/
						const edgesCountOverflow = !addIndex(0) || !addIndex(1); 
						if ( edgesCountOverflow ) {

							edges.hidden = edges.hidden || [];
							edges.hidden.push( value );
							throw new MyError('FermatSpiral: geometry.indices edges set. Invalid edge.', MyError.IDS.edgesCountOverflow);

						}
/*
						//найти две вершины edgeCross, которые вместе с вершинами edge образуют ромб.
						//Если ребро edgeCross существует, значит edgeCross пересекает ромб и ребро edge будет пересекаться с edgeCross.
						//Значит edge добавлять не надо.
						function findCrossEdge(edges0, edges1, edge) {

							//Найти вторую пару вершин ромба edgeCross
							//и идентификатор вершины verticeCross, через которую возможно проходит ребро edgeCross, пересекающее ромб
							const edgeCross = [];
							var verticeCross;
							for (var edges0Id = 0; edges0Id < edges0.length; edges0Id++) {

								const vertices0 = edges[edges0[edges0Id]],
									vertice0Id = (vertices0[0] === edge[0]) || (vertices0[0] === edge[1]) ? vertices0[1] : vertices0[0];
								for (var edges1Id = 0; edges1Id < edges1.length; edges1Id++) {

									const vertices1 = edges[edges1[edges1Id]],
										vertice1Id = (vertices1[0] === edge[0]) || (vertices1[0] === edge[1]) ? vertices1[1] : vertices1[0];
									if (vertice1Id === vertice0Id) {

										edgeCross.push(vertice1Id);
										break;

									}

								}
								if (edgeCross.length > 1) {

									verticeCross = vertice0Id;
									break;

								}

							}
							if ( verticeCross === undefined )
								return false;

							//ищем ребро, которое пересекает ромб
							const verticeCrossEdges = points[verticeCross].edges;
							var boDetected = false;
							for (var verticeCrossEdgeId = 0; verticeCrossEdgeId < verticeCrossEdges.length; verticeCrossEdgeId++) {

								const id = verticeCrossEdges[verticeCrossEdgeId],
									verticeCrossEdge = edges[id];
								if (
									((verticeCrossEdge[0] === edgeCross[0]) && (verticeCrossEdge[1] === edgeCross[1])) ||
									((verticeCrossEdge[0] === edgeCross[0]) && (verticeCrossEdge[1] === edgeCross[1]))
								) 
									return true;

							}
							return false;
							
						}
						const edges0 = points[value[0]].edges, edges1 = points[value[1]].edges;
						if ( !findCrossEdge(edges0, edges1, value) ) {
							
							edges0.push(i);
							edges1.push(i);
							
							value.i = edges.length;
							edges.push(value);

						}
						throw new MyError('FermatSpiral: geometry.indices edges set. Crossed edge detected.', MyError.IDS.edgesCountOverflow);
*/
						points[value[0]].edges.push(i);
						points[value[1]].edges.push(i);

						value.i = edges.length;
						edges.push(value);

						return edges.length;
//						return true;

					}
					switch (name) {

						case 'length': edges.length = value; break;
						case 'selected': edges.selected = value; break;
						default: console.error('fermatSpiral: geometry.indices edges set. Invalid name: ' + name);

					}
					return true;

				}

			} );

			const edges = _this.geometry.indices[0];
			edges.length = 0;//удалить все ребра
			points.forEach((vertice1, i) => {

				vertice1.i = i;

				points.forEach( ( vertice2, j ) => {

					if ( i != j ) {

						const distance = vertice1.distanceTo( vertice2 );
						vertice1.aNear.add( j, distance );

					}

				} );
				const i0 = vertice1.i;
				for ( var k = 0; k < vertice1.aNear.length; k++ ) {

					const i1 = vertice1.aNear[k].i;
					var boDuplicate = false;
					for ( var j = 0; j < edges.length; j++ ) {

						if (
							( ( edges[j][0] === i0 ) && ( edges[j][1] === i1 ) ) ||
							( ( edges[j][0] === i1 ) && ( edges[j][1] === i0 ) )
						) {

							boDuplicate = true;
							break;

						}

					}
					if ( !boDuplicate && ( i0 < settings.count ) && ( i1 < settings.count ) ) {

						try {
							
							edges.push( [i0, i1] );

						} catch ( e ) {

							switch ( e.id ) {

								case e.IDS.edgesCountOverflow:
								case e.IDS.invalidEdge:
									break;
								default: console.error( e.message );	
							}
							
						}
						
					}

				}

			});

			//В спирали есть дырки, тоесть не хватает граней. Это потому что некотрые ребра скрыты для того чтобы не было перекресчивающихся ребер.
			//Ищем ребра, котрые были скрыты, потому что если их добавить к вершине, то количество ребер для одной вкршины будет больше допустимого.
			//У некторых таких скрытых ребер одна из вершин имеет количество ребер меньше допустимого, поэтому в спирали появляются дырки.
			//Если скрытое ребро имеет вершину, у которой количество ребер меньше допустимого,
			//то делаем это ребро видимым, несмотря на то, что у противоположной вершины количество ребер будет больше доустимого.
			if (edges.hidden)
//				for (var i = edges.hidden.length - 1; i >= 0; i-- )
				for (var i = 0; i < edges.hidden.length; i++ ) {

					const edgeHidden = edges.hidden[i];
					//поиск скрытого ребра edgeHidden в вершине
					const edges0 = points[edgeHidden[0]].edges, edges1 = points[edgeHidden[1]].edges;
					if ((edges0.length < maxLength) || (edges1.length < maxLength)) {

//console.log( 'edges0.length = ' + edges0.length + ' edges1.length = ' + edges1.length + ' edgeHidden ' + edgeHidden );
if ( ( edgeHidden[0] === 22 ) && ( edgeHidden[1] === 17 ) )
	console.log(edgeHidden);
						
						//найти две вершины edgeCross, которые вместе с вершинами edgeHidden образуют ромб.
						//Если ребро edgeCross существует, значит edgeCross пересекает ромб и ребро edgeHidden будет пересекаться с edgeCross.
						//Значит edgeHidden добавлять не надо.

						//Найти вторую пару вершин ромба edgeCross
						//и идентификатор вершины verticeCross, через которую возможно проходит ребро edgeCross, пересекающее ромб
						const edgeCross = [];
						let verticeCross;
						for ( var edges0Id = 0; edges0Id < edges0.length; edges0Id++ ) {

							const vertices0 = edges[edges0[edges0Id]],
								vertice0Id = ( vertices0[0] === edgeHidden[0] ) || ( vertices0[0] === edgeHidden[1] ) ? vertices0[1] : vertices0[0];
							for ( var edges1Id = 0; edges1Id < edges1.length; edges1Id++ ) {

								const vertices1 = edges[edges1[edges1Id]],
									vertice1Id = ( vertices1[0] === edgeHidden[0] ) || ( vertices1[0] === edgeHidden[1] ) ? vertices1[1] : vertices1[0];
								if ( vertice1Id === vertice0Id ) {
									
									edgeCross.push( vertice1Id );
									break;

								}
								
							}
							if ( edgeCross.length > 1 ) {

								verticeCross = vertice0Id;
								break;

							}
							
						}
						
						//ищем ребро, которое пересекает ромб
						const verticeCrossEdges = points[verticeCross].edges;
//						verticeCross = undefined;
						var boDetected = false;
						for ( var verticeCrossEdgeId = 0; verticeCrossEdgeId < verticeCrossEdges.length; verticeCrossEdgeId++ ) {

							const id = verticeCrossEdges[verticeCrossEdgeId],
								verticeCrossEdge = edges[id];
							if (
								( ( verticeCrossEdge[0] === edgeCross[0] ) && ( verticeCrossEdge[1] === edgeCross[1] ) ) ||
								( ( verticeCrossEdge[0] === edgeCross[1] ) && ( verticeCrossEdge[1] === edgeCross[0] ) )
							) {
								
								boDetected = true;
								break;

							}
							
						}
						if (!boDetected) {

							const edgeId = edges.length;
							edges0.add(edgeId);
							edges1.add(edgeId);
							
							edgeHidden.i = edgeId;
console.log('Add hidden edge ' + edgeHidden.i + ' (' + edgeHidden + ')' )
							edges.add(edgeHidden);

						}
						
					}
					
				}

			//faces
			_this.geometry.indices[1] = new Proxy([], {

				get: function (faces, name, args) {

					const i = parseInt(name);
					if (!isNaN(i)) {

						const face = faces[i];
						if ( ( face === undefined ) || face.length != 3 ) {

							//								console.error( 'FermatSpiral; indices faces get. invalid face: ' + face );
							throw new Error('FermatSpiral: indices faces get. Invalid face: ' + face + ' i = ' + i);

						}
						return face;

					}
					switch (name) {

						case 'length': return faces.length;
						case 'push': return faces.push;
						case 'forEach': return faces.forEach;
//						case 'isProxy': return faces.isProxy;
						case 'selected': return faces.selected;
						default: console.error('FermatSpiral: geometry faces get : ' + name);

					}

				},
				set: function (faces, name, value) {

					//value - массив с индексами ребер грани
					const i = parseInt(name);//индекс ребра
					if (!isNaN(i)) {

						if ( value.length != 3 )
							throw 'FermatSpiral: update faces set. Invalid edges length';
						const i0 = value[0], i1 = value[1], i2 = value[2];
						if ( ( i0 === i1 ) || ( i0 === i2 ) || ( i2 === i1 ) )
							throw 'FermatSpiral: update faces set. Invalid face';

						//find duplicate face
						faces.forEach( ( face, faceId ) => {

							var count = 0;
							face.forEach( edge => {
								
								for ( var i = 0; i < value.length; i++ ) {
									
									if ( edge === value[i] ) {

										count++;
										if ( count > 2 )
											throw new MyError('FermatSpiral: geometry faces set. Duplicate face: (' + faceId + ') ' + value, MyError.IDS.invalidFace);
//											throw 'FermatSpiral: geometry faces set. Duplicate face: (' + faceId + ') ' + value;
										break;
										
									}
									
								}
								
							} );
							
						} );
						value.forEach( edgeId => {
							
							const edge = edges[edgeId];
							edge.faces = edge.faces || [];
							if ( edge.faces.length > 1 ) throw 'FermatSpiral: geometry faces set. Invalid edge.faces.length = ' + edge.faces.length;
							else edge.faces.push( faces.length );
							
						} );
						faces.push(value);
//						return faces.length;
						return true;

					}
					switch (name) {

						case 'length': faces.length = value; break;
						case 'selected': faces.selected = value; break;
						default: console.error('fermatSpiral: indices faces set. Invalid name: ' + name);

					}
					return true;

				}

			});
			const faces = _this.geometry.indices[1];
			//Грань состоит из 3 ребер.
			//Надо найти цепочку ребер у котрой вторая вершина третьего ребра грани совпадает с первой вершиной point0 первого ребра грани edge
			for (var edgeId = 0; edgeId < edges.length; edgeId++ ) {

				const edge = edges[edgeId];//первое ребро грани
				if ( edge.faces && ( edge.faces.length > 1 ) ) continue;
				const point0 = points[edge[0]];//первая вершина первого ребра edge
//					point1 = points[edge[1]];//вторая вершина первого ребра edge
				
				//перебираем все ребра первой вершины point0 первого ребра edge
				point0.edges.forEach( edgeIndex0 => {
					
					//edgeIndex0 индекс текущего ребра первой вершины point0 первого ребра edge
					const edge0 = edges[edgeIndex0];//текущее ребро, принадлежащее вершине point0. Возможно это второе ребро грани
					if ( edge0[0] === edge[0] ){

						//edge0[0] и edge[0] это индекс первой вершины первого ребра edge
						//если edge0[1] === edge[1] то edge0 и edge это одно и тоже ребро
						if ( edge0[1] !== edge[1] ) {

							//edge0 и edge это не одно и тоже ребро
							//edge0[1] индекс вершины на втором конце текущего ребра edge0, которое первым концом edge0[0] указывает на вершину point0
							//Возможно это второе ребро грани
							//Поищем третье ребро грани edge1
							const point1 = points[edge0[1]];//вторая вершина второго ребра edge0
							for (var edgeId1 = 0; edgeId1 < point1.edges.length; edgeId1++ ) {

								if (edge.faces && (edge.faces.length > 1)) break;
								const edgeIndex1 = point1.edges[edgeId1]//индекс текущего ребра второй вершины point1 второго ребра edge0
								const edge1 = edges[edgeIndex1];//текущее ребро, принадлежащее вершине point1. Возможно это третье ребро грани
								if ( edge1[0] === edge0[0] ) {

									//edge1[0] и edge0[0] это индекс первой вершины первого ребра edge
									//если edge0[1] === edge[1] то edge0 и edge это одно и тоже ребро
									if ( edge1[1] !== edge0[1] ) {

										console.log('');
										
									}
									
								} else if ( edge1[1] === edge0[1] ) {
									
									if ( edge1[0] === edge[1] ) {

										//обнаружена грань
										try {
			
/*
faces.push( [1, 2, 3] );
faces.push( [2, 3, 1] );
*/
											faces.push( [edge.i, edge0.i, edge1.i, ] );
			
										} catch (e) {

											if ( e.id && ( e.id === e.IDS.invalidFace ) )
												return false;
											else console.error(e);
			
										}
										
									}
									
								}
								
							}
								
						}
						
					} //else console.error('Under constraction');
					
				} );
				
			}
			points.forEach( ( vertice, i ) => {

				if ( vertice.aNear.length > vertice.edges.length ) {
					
					console.log('vertice');

				}
				
			} );

		}
		update();

		if ( settings.object )
			new ND( n, {

				plane: false,
				object: {

					name: 'Fermat Spiral',
					/*
					faces: {
						
						transparent: false,
						//opacity: 1,
						
					},//true,
					*/
					faces: settings.object.faces,
					position: settings.position,
					rotation: settings.rotation,
					geometry: this.geometry,

				},
				scene: settings.object.scene,
				options: settings.object.options,

			} );

	}
}

//https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Error
function MyError(message, id) {

	this.name = 'MyError';
	this.message = message;
	this.IDS = MyError.IDS;
	this.id = id;
	this.stack = (new Error()).stack;

}
MyError.IDS = {

	edgesCountOverflow: 0,//Edges length > maxLength
	invalidEdge: 1,//вручную не добавляю некоторые ребра, что бы не было пересекающихся ребер
	invalidFace: 2,//индексы ребер в грани не должны совпадать. Duplicate face.

}
MyError.prototype = Object.create(Error.prototype);
MyError.prototype.constructor = MyError;

/** @namespace
 * @description N-dimensional graphics.
 * @see <a href="../../nD/jsdoc/index.html" target="_blank">ND</a>.
 */
FermatSpiral.ND = ND;

export default FermatSpiral;

