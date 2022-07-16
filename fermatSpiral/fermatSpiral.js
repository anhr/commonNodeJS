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
/*
import three from '../three.js'
import PositionController from '../PositionController.js';
import GuiIndices from '../guiIndices.js';
*/
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
	 * @param {Object} [settings={}] The following settings are available
	 * @param {Number} [settings.count=500] points count.
	 * @param {Float} [settings.c=0.04] constant scaling factor. See <a href="https://en.wikipedia.org/wiki/Fermat%27s_spiral" target="_blank">Fermat's spiral</a> for details.
	 * @param {Array} [settings.position=[0,0]] center of Vogel's model.
	 * @param {Number} [settings.position[0]] x position of the center.
	 * @param {Number} [settings.position[1]] y position of the center.
	 * @param {Object} [settings.object] creates an [LineSegments]{@link https://threejs.org/docs/index.html?q=lines#api/en/objects/LineSegments} object as <b>FermatSpiral</b>.
	 * @param {Group} settings.object.scene [Scene]{@link https://threejs.org/docs/index.html?q=scene#api/en/scenes/Scene}.
	 * @param {Options} [settings.object.options] Add <b>options</b> key if you want to add custom controllers for <b>FermatSpiral</b> object into <a href="../../guiSelectPoint/jsdoc/index.html" target="_blank">GuiSelectPoint</a>.
	 * See the <b>options</b> parameter of the <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
	 * @param {String} [settings.object.color='green'] color of <b>FermatSpiral</b>.
	 */
	constructor( settings = {} ) {

		const points = [], indices = [];//, THREE = three.THREE, geometry = { position: [], indices: [[]] };
		settings.count = settings.count === undefined ? 500 : settings.count;
		settings.position = settings.position || [0, 0];
		settings.c = settings.c === undefined ? 0.04 : settings.c;//constant scaling factor
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
				points.push( [radius * Math.cos( angleInRadians ), radius * Math.sin( angleInRadians )] );
/*
				points[i] = new Vector( [

					settings.position[0] + ( radius * Math.cos( angleInRadians ) ),
					settings.position[1] + ( radius * Math.sin( angleInRadians ) )

				] );
*/

			}

/*
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
*/
			//indices

			points.forEach( ( vertice1, i ) => {

				vertice1.aNear = [];//индексы четырех вершин, которые ближе всего расположены к текущей вершине vertice1
				//aNear[0] индекс текущей вершины,
				//aNear[1...4] индексы четырех вершин, которые ближе всего расположены к текущей вершине
				vertice1.aNear.push( [i] );
				//						for ( var j = i + 1; j < points.length; j++ )
				points.forEach( ( vertice2, j ) => {

					if ( i != j ) {

						function distanceTo( v, array ) {

							var a = 0;
							array.forEach( ( item, i ) => { const b = item - v[i]; a = a + b * b; } )
							return Math.sqrt( a );

						}
//						const distance = vertice1.distanceTo( vertice2 );
						const distance = distanceTo( vertice2, vertice1 );
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

/*
						indices.push( i0 );
						indices.push( i1 );
						geometry.indices[0].push( [i0, i1] );
*/
						indices.push( [i0, i1] );

					}

				}

			} );

		}
		update();
		new ND( 5, {

			object: {

				position: settings.position,
				//rotation: settings.rotation,
				geometry: {

					position: points,
					indices: [indices],

				},

			},
			scene: settings.object.scene,
			options: settings.object.options,
/*
			onIntersection: function ( geometryIntersection ) {

				controls.c5Dto4D.geometry = geometryIntersection;
				if ( _4D && controls.c5Dto4D.checked ) _4D.geometry = geometryIntersection;

			}
*/

		} );

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

