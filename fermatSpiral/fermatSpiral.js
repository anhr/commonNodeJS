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

		const points = [], indices = [], THREE = three.THREE;
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
		Object.defineProperties( this, {

			points: {

				get: function () {

//					return points;
					return new Proxy( points, {

						get: function ( target, name ) {

							switch ( name ) {

								case 'length':
									return settings.count;//target.length;

							}
							const i = parseInt( name );
							if ( isNaN( i ) ) {

								console.error( 'FermatSpiral.points: invalid name: ' + name );
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
					object.userData.fermatSpiral = function ( fParent, dat, options ) {

						if ( fParent.__controllers.length !== 0 ) return;

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
						
						const cCount = dat.controllerZeroStep( fCount, settings, 'count', function ( value ) { update(); } );
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

						const cC = dat.controllerZeroStep( fC, settings, 'c', function ( value ) { update(); } );
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

						const aNear = [];//индексы четырех вершин, которые ближе всего расположены к текущей вершине
							//aNear[0] индекс текущей вершины,
							//aNear[1...4] индексы четырех вершин, которые ближе всего расположены к текущей вершине
						aNear.push( [i] );
//						for ( var j = i + 1; j < points.length; j++ )
						points.forEach( ( vertice2, j ) => {

//							const vertice2 = points[j];
							if ( i != j ) {

								const distance = vertice1.distanceTo( vertice2 );
								function getMax() {

									for ( var iMax = 1; iMax < aNear.length; iMax++ ) {

										const item = aNear[iMax], maxItem = aNear[aNear[0].iMax];
										if ( maxItem.distance < item.distance ) aNear[0].iMax = iMax;

									}
									
								}
								if ( aNear.length < 5 ) {

									const length = aNear.push( [j] );
									aNear[length - 1].distance = distance;
									if ( aNear[0].iMax === undefined ) aNear[0].iMax = length - 1;
									getMax();

								} else {

									if ( aNear[aNear[0].iMax].distance > distance ) {
										
										aNear[aNear[0].iMax] = [j];
										aNear[aNear[0].iMax].distance = distance;
										getMax();

									}
									
								}

							}

						} );
/*						
if ( i === ( points.length - 1 ) ) {
	
	var iMax = 0;
	for ( var j = 1; j < aNear.length; j++ ) {

		if ( iMax < aNear[j][0] ) iMax = aNear[j][0];
		
	}
	console.log( 'i = ' + i + ' iMax = ' + iMax + ' ' + ( i - iMax ) );

}
*/
						const i0 = aNear[0][0];
						for ( var i = 1; i < aNear.length; i++ ) {

							const i1 = aNear[i][0];
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

							}
/*
							indices.push( i0 );
							indices.push( aNear[i][0] );
*/

						}
						
					} )
					return indices;
			
				}

			},

		} );
		settings.count = settings.count === undefined ? 500 : settings.count;
		settings.center = settings.center || [0, 0];
		settings.c = settings.c === undefined ? 0.04 : settings.c;//constant scaling factor
		settings.center = settings.center || [0, 0];
		const golden_angle = 137.508;//140.2554;
		const _this = this;
		function update() {

			function angleFermat( n ) { return n * golden_angle; }
			function radiusFermat( n ) { return settings.c * Math.sqrt( n ); }
			function describeFermatPoint( n ) { return polarToCartesian( radiusFermat( n ), angleFermat( n ) ); }
			function createFermatPlot() {

//				settings.count = settings.count === undefined ? 500 : settings.count;

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
				const l = settings.count + parseInt( 3.8/*2.5*//*1.449378838441997*/ * Math.sqrt( settings.count ) );
				//3.8 выбрал что бы не было лишних ребер при settings.count = 3800

				if ( points.length > 0 ) points.length = 0;
				if ( indices.length > 0 ) indices.length = 0;
				for ( var i = 0; i < l; i++ ) {

					points[i] = describeFermatPoint( i );

				}

			}
			function polarToCartesian( radius, angleInDegrees ) {

				const angleInRadians = ( angleInDegrees - 90 ) * Math.PI / 180.0;

				return new THREE.Vector3(

					settings.center[0] + ( radius * Math.cos( angleInRadians ) ),
					settings.center[1] + ( radius * Math.sin( angleInRadians ) )

				);

			}
			createFermatPlot();
			if ( settings.object ) {
	
				if ( object ) {
					
					object.geometry.setFromPoints( _this.points ).setIndex( _this.indices );//object.parent.remove( object );
					if ( settings.object.options && settings.object.options.guiSelectPoint ) settings.object.options.guiSelectPoint.updatePoints();
					
				} else {
					
					settings.object.color = settings.object.color || "green";
					const mesh = new THREE.LineSegments(
						new THREE.BufferGeometry().setFromPoints( _this.points ).setIndex( _this.indices ),
						new THREE.LineBasicMaterial( { color: settings.object.color, } ) );
		
		//			const mesh = new THREE.Line( new THREE.BufferGeometry().setFromPoints( _this.vertices ), new THREE.LineBasicMaterial( { color: color } ) );
		//			const mesh = new THREE.Mesh( new MyThree.three.ConvexGeometry( _this.vertices ), new THREE.MeshBasicMaterial( { color: color, wireframe: true } ) );
					settings.object.scene.add( mesh );
					if ( settings.object.options && settings.object.options.guiSelectPoint ) settings.object.options.guiSelectPoint.addMesh( mesh );
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

