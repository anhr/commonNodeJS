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
	 * @param {settings} [settings={}] The following settings are available
	 * @param {number} [settings.n=2] space dimension of Fermat's spiral.
	 * @param {Number} [settings.count=500] points count.
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
	 * @param {settings} [settings.object] creates an [LineSegments]{@link https://threejs.org/docs/index.html?q=lines#api/en/objects/LineSegments} object as <b>FermatSpiral</b>.
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

						case 'target': return target.target;
						case 'isProxy': return target.isProxy;
						case 'length': return settings.count;
						case 'boPositionError': return target.boPositionError;
						case 'forEach': return target.forEach;
						default: console.error( 'FermatSpiral: geometry.position get : ' + name );

					}

				},

			} ),
			indices: [

				//edges
				new Proxy([], {

					get: function (edges, name, args) {

						const i = parseInt(name);
						if (!isNaN(i)) {

							const edge = edges[i];
//							console.log( edge );
							if ( ( edge === undefined ) || edge.length != 2 ) {
								
//								console.error( 'FermatSpiral; indices edges get. invalid edge: ' + edge );
								throw new Error('FermatSpiral: indices edges get. Invalid edge: ' + edge + ' i = ' + i );

							}
							return edge;
/*							
							if (edges instanceof Array) {

								if (i < edges.length && (edges[i] !== undefined))
									return edges[i];
								return 0;

							}
							return edges;
*/

						}
						switch (name) {

/*
							case 'edges': return edges.edges;
							case 'isProxy': return edges.isProxy;
							case 'boPositionError': return edges.boPositionError;
							case 'forEach': return edges.forEach;
*/
							case 'length': return edges.length;
							case 'push': return edges.push;
							case 'isProxy': return edges.isProxy;
							case 'selected': return edges.selected;
							default: console.error('FermatSpiral: geometry.position get : ' + name);

						}

					},
					set: function (edges, name, value) {

						//value - массив с индексами вершин ребра
						const i = parseInt(name);//индекс ребра
						if (!isNaN(i)) {

							//добавить индекс ребра в список ребер двух вершин, которые составляют ребро
							function addIndex( edgeIndex ) {
								
								try {

									points[value[edgeIndex]].edges.push( i );
					
								} catch ( e ) {
	
									if ( e.id === e.IDS.edgesCountOverflow )
										return false;
									else console.error( e.message );
									
								}
								return true;

							}
							if ( !addIndex( 0 ) || !addIndex( 1 ) )
								throw new Error( 'FermatSpiral: indices edges set' );
//								return true;
/*
							if (i >= edges.length) {

								edges.push(value);
//								return edges.length;

							} else edges[i] = value;
*/
							edges.push(value);
							return edges.length;
//							return true;

						}
						switch (name) {

							case 'length': edges.length = value; break;
							case 'selected': edges.selected = value; break;
							default: console.error('fermatSpiral: indices set. Invalid name: ' + name);

						}
						return true;

					}

				}),
			],

		}

		function update() {

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
					
					const aNear = [];//индексы вершин, которые ближе всего расположены к текущей вершине vertice1
					//aNear[0] индекс текущей вершины,
					//aNear[1...4] индексы вершин, которые ближе всего расположены к текущей вершине
					//vertice1.aNear.push( [i] );

					//https://stackoverflow.com/questions/2449182/getter-setter-on-javascript-array
					return new Proxy( array, {

						get: function ( target, name ) {

							var i = parseInt( name );
							if ( isNaN( i ) ) {

								switch ( name ) {

									//case "length": return n + 1;
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

											target.forEach( ( value, i ) => target[i] += v[i] );
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
									case "aNear": return aNear;
									case "positionWorld": return target.positionWorld;
									case "forEach": return target.forEach;
									case "length": return target.length;
									case "edges": 
										
										if ( !target.edges )
											target.edges = new Proxy([], {

												get: function (target, name, args) {
							
													const i = parseInt(name);
													if (!isNaN(i)) {
							
														if (target instanceof Array) {
							
															if (i < target.length && (target[i] !== undefined))
																return target[i];
															return 0;
							
														}
														return target;
							
													}
													switch (name) {
							
							/*
														case 'target': return target.target;
														case 'isProxy': return target.isProxy;
														case 'boPositionError': return target.boPositionError;
														case 'forEach': return target.forEach;
							*/
														case 'push': return target.push;
														case 'length': return target.length;
														case 'name': return target.name;
														case 'forEach': return target.forEach;
														default: console.error('FermatSpiral: Vector.edges get : ' + name);
							
													}
							
												},
												set: function (target, name, value) {
							
													const i = parseInt(name);//индекс ребра
													if (!isNaN(i)) {
							
														//value - индекс ребра
														const maxLength = 6;
														if ( target.length >= maxLength ) {

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

															}
															MyError.prototype = Object.create(Error.prototype);
															MyError.prototype.constructor = MyError;
															
															throw new MyError('FermatSpiral: update Vector get edges set. Edges length > ' + maxLength, MyError.IDS.edgesCountOverflow );

														}
														if (i >= target.length) target.push(value);
														else target[i] = value;
														return target.length;
							
													}
													switch (name) {
							
														case 'length': target.length = value; return true;
														default: console.error('fermatSpiral: Vector set. Invalid name: ' + name);
							
													}
							
												}
							
											});
										return target.edges;
									case 'indices': return target.indices;
									case 'i': return target.i;
									case 'arguments': return target.arguments;
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
						set: function ( target, name, value ) {

							const i = parseInt( name );
							if ( !isNaN( i ) ) {
								
//								target.positionWorld = undefined;
								if ( i >= array.length ) {
	
									array.push( value );
									return array.length;
	
								}
								array[i] = value;
//								_ND.intersection();
								if ( vectorSettings.onChange ) vectorSettings.onChange();
								return true;
							
							}
							switch ( name ) {
	
								case 'onChange': vectorSettings.onChange = value; break;
								case 'positionWorld': target.positionWorld = value; break;
								case 'i': target.i = value; break;
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
			const edges = _this.geometry.indices[0];
			edges.length = 0;//удалить все ребра
//			_this.geometry.indices[0].length = 0;//удалить все ребра
			const golden_angle = 137.5077640500378546463487,//137.508;//https://en.wikipedia.org/wiki/Golden_angle
				a = golden_angle * Math.PI / 180.0, b = 90 * Math.PI / 180.0;
			for ( var i = 0; i < l; i++ ) {

				const angleInRadians = i * a - b;
				const radius = settings.c * Math.sqrt( i );
				points.push( new Vector([radius * Math.cos( angleInRadians ), radius * Math.sin( angleInRadians )]) );

			}

			//indices
			points.forEach((vertice1, i) => {

				vertice1.aNear.push( [i] );

				points.forEach( ( vertice2, j ) => {

					if ( i != j ) {

						const distance = vertice1.distanceTo( vertice2 );
						function getMax() {

							for ( var iMax = 1; iMax < vertice1.aNear.length; iMax++ ) {

								const item = vertice1.aNear[iMax], maxItem = vertice1.aNear[vertice1.aNear[0].iMax];
								if ( maxItem.distance < item.distance ) vertice1.aNear[0].iMax = iMax;

							}

						}
						if ( vertice1.aNear.length < 7 ) {

							const length = vertice1.aNear.push( [j] );
							vertice1.aNear[length - 1].distance = distance;
							if ( vertice1.aNear[0].iMax === undefined ) vertice1.aNear[0].iMax = length - 1;
							getMax();

						} else {

							if ( vertice1.aNear[vertice1.aNear[0].iMax].distance > distance ) {

								vertice1.aNear[vertice1.aNear[0].iMax] = [j];
								vertice1.aNear[vertice1.aNear[0].iMax].distance = distance;
								getMax();

							}

						}

					}

				} );
				const i0 = vertice1.aNear[0][0];
				for ( var k = 1; k < vertice1.aNear.length; k++ ) {

					const i1 = vertice1.aNear[k][0];
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

/*							
							if ( e.id === e.IDS.edgesCountOverflow )
								return false;
							else console.error( e.message );
*/
							
						}
						
					}

				}

			});

		}
		update();

		if ( settings.object )
			new ND( n, {

				plane: false,
				object: {

					name: 'Fermat Spiral',
					position: settings.position,
					rotation: settings.rotation,
					geometry: this.geometry,

				},
				scene: settings.object.scene,
				options: settings.object.options,

			} );

	}
}

/** @namespace
 * @description N-dimensional graphics.
 * @see <a href="../../nD/jsdoc/index.html" target="_blank">ND</a>.
 */
FermatSpiral.ND = ND;

export default FermatSpiral;

