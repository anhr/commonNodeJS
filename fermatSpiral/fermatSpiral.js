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

import three from '../three.js'
import PositionController from '../PositionController.js';

class FermatSpiral {

	/**
	 * Implementation of Vogel's model of <a href="https://en.wikipedia.org/wiki/Fermat%27s_spiral" target="_blank">Fermat's spiral</a>.
	 * @param {Object} [settings={}] The following settings are available
	 * @param {Number} [settings.count=500] points count.
	 * @param {Float} [settings.c=0.04] constant scaling factor. See <a href="https://en.wikipedia.org/wiki/Fermat%27s_spiral" target="_blank">Fermat's spiral</a> for details.
	 * @param {Array} [settings.center=[0,0]] center of Vogel's model.
	 * @param {Number} [settings.center[0]] x position of the center.
	 * @param {Number} [settings.center[1]] y position of the center.
	 * @param {Object} [settings.object] creates an [LineSegments]{@link https://threejs.org/docs/index.html?q=lines#api/en/objects/LineSegments} object as <b>FermatSpiral</b>.
	 * @param {Group} settings.object.scene [Scene]{@link https://threejs.org/docs/index.html?q=scene#api/en/scenes/Scene}.
	 * @param {Options} [settings.object.options] Add <b>options</b> key if you want to add custom controllers for <b>FermatSpiral</b> object into <a href="../../guiSelectPoint/jsdoc/index.html" target="_blank">GuiSelectPoint</a>.
	 * See the <b>options</b> parameter of the <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
	 * @param {String} [settings.object.color='green'] color of <b>FermatSpiral</b>.
	 */
	constructor( settings = {} ) {

		const points = [], indices = [], THREE = three.THREE, geometry = { position: [], indices: [[]] };
		var object;
		/**
		* @description
		* Returns points of the Fermat's spiral.
		*/
		this.points;
		/**
		* @description
		* Sets new Fermat's spiral [Object3D]{@link https://threejs.org/docs/index.html?q=mesh#api/en/core/Object3D}.
		*/
		this.object;
		/**
		* @description
		* Gets Fermat's spiral [BufferGeometry.index]{@link https://threejs.org/docs/index.html?q=BufferGeometry#api/en/core/BufferGeometry.index}.
		*/
		this.indices;
		/**
		* @description
		* Under constraction
		* returns Fermat's spiral geometry.
		*/
		this.geometry;
		Object.defineProperties( this, {

			geometry: {

				get: function () {

					geometry.position.length = 0;
					for ( var i = 0; i < settings.count; i++ ) {

						const point = points[i], axes = [];
						point.forEach( axis => axes.push( axis ) )
						geometry.position.push( axes );
						
					}
					this.indices;//create edges

					//create faces
					//Каждая грань состоит из петли вершин.
					//Если двигаться по этой петле, то обязательно попадешь на вершину, с которой начинается петля.
					//Грань ищу путем поиска замкнутой петли из вершин.
					//Все грани состоят максимум из 3 или 4 вершин за исключением граней в начале спирали.
					//Если петля слишком длинная, значит это не грань
					geometry.indices.push( [] );//faces array
					var nStep = 0;//количестко вершин в петле
					function loop( verticeStart, vertice ) {

						if ( verticeStart.aNear[0][0] === vertice.aNear[0][0] ) return true;
						if ( nStep > 4 ) return false;//петля слишком длинная
						for ( var i = 1; i < vertice.aNear.length; i++ ) {

							const verticeIndex = vertice.aNear[i];
							const vertice2 = points[verticeIndex[0]];
							if ( !loop( verticeStart, vertice2 ) ) break;
							
						}
						nStep++;
						return false;
						
					}
					points.forEach( vertice => {

						vertice.aNear.forEach( ( verticeIndex, j ) => {

							if ( j !== 0 ) {
								
								const vertice2 = points[verticeIndex[0]];
								loop( vertice, vertice2 );

							}
							
						} );
						
					} );
/*					
					geometry.indices[0].forEach( ( edge, i ) => {
						
						var faceCount = 0;//каждое ребро должно принадлежать двум граням за исключением ребер на краю спирали
						geometry.indices[1].forEach( ( face, j ) => {
						
							for ( var k = 0; k < face.length; k++ ) {
						
								const edgeIndex = face[k];
								if ( edgeIndex === i ) continue;

								const edgeFace = geometry.indices[0][edgeIndex];
								if ( ( edgeFace[0] === edge[0] ) || ( edgeFace[1] === edge[1] ) || ( edgeFace[0] === edge[1] || ( edgeFace[1] === edge[0] ) ) ) {
									
									//два ребра имеют общую вершину. Значит новое ребро надо добавить в грань
									face.push(i);
									faceCount++;
									break;
									
								}
								
							}
							
						} );
						if ( faceCount === 0 ) geometry.indices[1].push([i]);//Ребро не встретилось ни в одной грани. Добавить новую грань с ребром с индексом i
						
					} );
*/					
					return geometry;

				}

			},
			points: {

				get: function () {

//					return points;
					return new Proxy( points, {

						get: function ( target, name ) {

							const i = parseInt( name );
							if ( isNaN( i ) ) {

								switch ( name ) {
	
									case 'length': return settings.count;//target.length;
									case 'forEach': return target.forEach;
	
									//for ND
										
									case 'isProxy': return true;
									case "reset": return function () { target.forEach( item => delete item.positionWorld ); }
										
									default: console.error( 'FermatSpiral: points get. Invalid name: ' + name );
	
								}
								return;

							}
							return target[i];

						},

					} );

				}

			},
			object: {

				set: function ( objectNew ) {

					object = objectNew;
//					if ( !settings.object ) return;//немогу изменять настройки спирали если спираль не создана внутри settings.object
					object.userData.fermatSpiral = function ( fParent, dat, options ) {

						if ( fParent.__controllers.length !== 0 ) return;

						settings.object = settings.object || {};
						settings.object.options = options;

						//Localization
		
						const getLanguageCode = options.getLanguageCode;
		
						const lang = {

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
						
						//Points count
						
						const fCount = fParent.addFolder( lang.count );

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
/*							
							if ( settings.object ) update();
							else console.error( 'FermatSpiral: update. Invalid settings.object' );
*/
						
						}
						const cCount = dat.controllerZeroStep( fCount, settings, 'count', function ( value ) { controllerUpdate(); } );
						dat.controllerNameAndTitle( cCount, lang.count, lang.countTitle );

						//constant scaling factor

						const fC = fParent.addFolder( lang.c );

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
						
					}

				},

			},
			indices: {

				get: function () {
			
					if ( indices.length > 0 ) return indices;
					points.forEach( ( vertice1, i ) => {

						vertice1.aNear = [];//индексы четырех вершин, которые ближе всего расположены к текущей вершине vertice1
						//aNear[0] индекс текущей вершины,
						//aNear[1...4] индексы четырех вершин, которые ближе всего расположены к текущей вершине
						vertice1.aNear.push( [i] );
						//						for ( var j = i + 1; j < points.length; j++ )
						points.forEach( ( vertice2, j ) => {

							//							const vertice2 = points[j];
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
						/*						
						if ( i === ( points.length - 1 ) ) {
							
							var iMax = 0;
							for ( var j = 1; j < vertice1.aNear.length; j++ ) {
						
								if ( iMax < vertice1.aNear[j][0] ) iMax = vertice1.aNear[j][0];
								
							}
							console.log( 'i = ' + i + ' iMax = ' + iMax + ' ' + ( i - iMax ) );
						
						}
						*/
						const i0 = vertice1.aNear[0][0];
						for ( var i = 1; i < vertice1.aNear.length; i++ ) {

							const i1 = vertice1.aNear[i][0];
							var boDuplicate = false;
							for ( var j = 0; j < indices.length; j += 2 ) {

								if (
									( ( indices[j] === i0 ) && ( indices[j + 1] === i1 ) ) ||
									( ( indices[j] === i1 ) && ( indices[j + 1] === i0 ) )
								) {

									boDuplicate = true;
									break;

								}

							}
							if ( !boDuplicate && ( i0 < settings.count ) && ( i1 < settings.count ) ) {

								indices.push( i0 );
								indices.push( i1 );
								geometry.indices[0].push( [i0, i1] );

							}

						}

					} );
					return indices;
			
				}

			},

		} );
		settings.count = settings.count === undefined ? 500 : settings.count;
		settings.center = settings.center || [0, 0];
		settings.c = settings.c === undefined ? 0.04 : settings.c;//constant scaling factor
		settings.center = settings.center || [0, 0];
		const _this = this;
		function update() {

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
			indices.length = 0;
			const golden_angle = 137.5077640500378546463487,//137.508;//https://en.wikipedia.org/wiki/Golden_angle
				a = golden_angle * Math.PI / 180.0, b = 90 * Math.PI / 180.0;
			for ( var i = 0; i < l; i++ ) {

				const angleInRadians = i * a - b;
				const radius = settings.c * Math.sqrt( i );
/*
				points[i] = new THREE.Vector3(

					settings.center[0] + ( radius * Math.cos( angleInRadians ) ),
					settings.center[1] + ( radius * Math.sin( angleInRadians ) )

				);
*/
				class Vector {

					constructor( array ) {

						return new Proxy( array, {

							get: function ( target, name ) {

								var i = parseInt( name );
								if ( isNaN( i ) ) {

									switch ( name ) {

										case 'x': return array[0];
										case 'y': return array[1];
										case 'z': return array[2];
										case "distanceTo":
											return function ( v ) {

												var a = 0;
												array.forEach( ( item, i ) => { const b = item - v[i]; a = a + b * b; } )
												return Math.sqrt( a );

											}
										case "getComponent":
											return function	( index ) {

												switch ( index ) {
										
													case 0: return this.x;
													case 1: return this.y;
													case 2: return this.z;
													default: console.error( 'FermatSpiral: Vector.getComponent(index) index is out of range: ' + index );
										
												}
										
											}
										case 'forEach': return target.forEach;
										case "length": return target.length;
										//									case "array": return array;
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
										case "aNear": return this.aNear;

										default: console.error( 'FermatSpiral: Vector get. Invalid name: ' + name );

									}

								}
								if ( i >= array.length ) {

									//сюда попадает когда спираль создаю из MyThree.MyPoints
									//console.error( 'FermatSpiral: Vector get. Invalid i = ' + i );
									return 0;

								}
/*								
								if ( ( array.length > n ) && settings.object.geometry.iAxes && ( i < settings.object.geometry.iAxes.length ) )
									i = settings.object.geometry.iAxes[i];
*/
								return array[i];

							},
							set: function ( target, name, value ) {

								const i = parseInt( name );
								if ( !isNaN( i ) ) {
									
									if ( i >= array.length ) {

										console.error( 'FermatSpiral: Vector set. Invalid i = ' + i );
//										array.push( value );
										return array.length;
	
									}
									array[i] = value;
									return true;
									
								}
								switch ( name ) {

									case 'aNear': 
										this[name] = value;
										break;
/*										
									case 'onChange':
										vectorSettings.onChange = value;
										return vectorSettings.onChange;
*/
									default: console.error( 'FermatSpiral: Vector set. Invalid name: ' + name );
			
								}
								return true;

							}

						} );

					}

				} 
				points[i] = new Vector ([

					settings.center[0] + ( radius * Math.cos( angleInRadians ) ),
					settings.center[1] + ( radius * Math.sin( angleInRadians ) )

				] );

			}
			
	
			if ( object ) {
					
				object.geometry.setFromPoints( _this.points ).setIndex( _this.indices );//object.parent.remove( object );
				if ( settings.object.options && settings.object.options.guiSelectPoint ) settings.object.options.guiSelectPoint.updatePoints();
					
			} else {
					
				if ( settings.object ) {

					var mesh;
					if ( typeof settings.object === "function" ) mesh = settings.object( _this );
					else {

						settings.object.color = settings.object.color || "green";
						mesh = new THREE.LineSegments(
							new THREE.BufferGeometry().setFromPoints( _this.points ).setIndex( _this.indices ),
							new THREE.LineBasicMaterial( { color: settings.object.color, } ) );
						settings.object.scene.add( mesh );
						if ( settings.object.options && settings.object.options.guiSelectPoint ) settings.object.options.guiSelectPoint.addMesh( mesh );

					}
					_this.object = mesh;

				}

			}

		}
		update();

	}
}

FermatSpiral.gui = class {

	/** @class
	 * Custom controllers for implementation of Vogel's model of <a href="https://en.wikipedia.org/wiki/Fermat%27s_spiral" target="_blank">Fermat's spiral</a>.
	 * @param {Options} options See <b>options</b> parameter of <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
	 * @param {GUI} dat [dat.GUI()]{@link https://github.com/dataarts/dat.gui}.
	 * @param {GUI} fParent parent folder.
	 * @example new FermatSpiral.gui( options, dat, fMesh );
	 */
	constructor( options, dat, fParent ) {

		//Localization

		const getLanguageCode = options.getLanguageCode;

		const lang = {

			fermatSpiral: "Fermat's Spiral",
			fermatSpiralTitle: "Fermat's Spiral Vogel Model.",

		};

		const _languageCode = getLanguageCode();

		switch ( _languageCode ) {

			case 'ru'://Russian language

				lang.fermatSpiral = 'Спираль Ферма';
				lang.fermatSpiralTitle = 'Спираль Ферма. Модель Фогеля.';

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
		const fFermatSpiral = fParent.addFolder( lang.fermatSpiral );
		dat.folderNameAndTitle( fFermatSpiral, lang.fermatSpiral, lang.fermatSpiralTitle );

		this.object = function ( object, dat, options ) {

			var display = 'none';
			if ( object && object.userData.fermatSpiral ) {

				display = 'block';
				object.userData.fermatSpiral( fFermatSpiral, dat, options );

			}
			fFermatSpiral.domElement.style.display = display;

		}

	}

}

//FermatSpiral.objectType = 'FermatSpiral';

export default FermatSpiral;

