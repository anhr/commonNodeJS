/**
 * @module GraphicObject
 * @description Base class for egocentric universe.
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
import ND from '../nD/nD.js';
//import ND from '../nD/build/nD.module.js';
//import ND from '../nD/build/nD.module.min.js';
//import ND from 'https://raw.githack.com/anhr/commonNodeJS/master/nD/nD.js';
//import ND from 'https://raw.githack.com/anhr/commonNodeJS/master/nD/build/nD.module.js';
//import ND from 'https://raw.githack.com/anhr/commonNodeJS/master/nD/build/nD.module.min.js';
if (ND.default) ND = ND.default;
*/
import Utils from './utils.js';

const debug = true;
//const debug = false;

const sEgocentricUniverse = 'GraphicObject', sOverride = sEgocentricUniverse + ': Please override the %s method in your child class.';
let lang;

class GraphicObject extends Utils {

	//base methods
	
	get verticeEdgesLengthMax() { console.error(sOverride.replace('%s', 'Indices')); }
	log() { console.error(sOverride.replace('%s', 'log')); }
	project() { console.error(sOverride.replace('%s', 'project')); }
	Indices() { console.error(sOverride.replace('%s', 'Indices')); }
	Test() { console.error(sOverride.replace('%s', 'Test')); }
	
	/**
	 * Base class for egocentric universe.
	 * @param {Options} options See <a href="../../../commonNodeJS/master/jsdoc/Options/Options.html" target="_blank">Options</a>.
	 * @param {object} [classSettings] Class settings.
	 * @param {object} [classSettings.settings] The following settings are available
	 * @param {object} [classSettings.settings.object] universe object.
	 * @param {String} [classSettings.settings.object.name='Universe'] name of universe.
	 * @param {String} [classSettings.settings.object.color='lime'] color of edges.
	 * @param {object} [classSettings.settings.object.geometry] Universe geometry.
	 * @param {object} [classSettings.settings.object.geometry.indices] Array of <b>indices</b> of vertices, edges, faces and bodies of universe.
	 * @param {number} [classSettings.settings.object.geometry.indices.сount] If dimension of the universe space is 1 then <b>сount</b> is edges count. Default is 3.
	 * <pre>
	 * If dimension of the universe space is 2 then under constraction.
	 * If dimension of the universe space is 3 then under constraction.
	 * </pre>
	 * @param {Array} [classSettings.settings.object.geometry.indices.edges] Edges array.
	 * @param {object} [classSettings.settings.object.geometry.indices.edges.edge] Edges array item is edge.
	 * @param {Array} [classSettings.settings.object.geometry.indices.edges.edge.vertices] Array of edge vertices indices. Every edge have two vertices.
	 * @param {float} [classSettings.settings.object.geometry.indices.edges.edge.distance=1.0] Edge length. Distance between edge vertices.
	 * @param {Array} [classSettings.settings.object.geometry.indices.faces] Faces array. Every item of the <b>faces</b> array is array of edges indices for current face.
	 * <pre>
	 * Example:
	 * [
	 *	[0, 2, 3]
	 *	[0, 4, 5]
	 * ]
	 * universe contains two faces.
	 * First face is triangle and have three edges with 0, 2 and 3 indice.
	 * Second face is triangle and have three edges with 0, 4 and 5 indice.
	 * First and second faces have same edge with 0 indice.
	 * @param {Array} [classSettings.settings.object.geometry.indices.bodies] Bodies array. Every item of the <b>bodies</b> array is array of faces indices for current body.
	 * </pre>
	 **/
	constructor( options, classSettings ) {

		super( options, classSettings.settings );
		const egocentricUniverse = this, settings = classSettings.settings;
		this.options = options;
		this.settings = settings;
		this.classSettings = classSettings;
		this.debug = debug;

		if (!lang) {

			//Localization

			const getLanguageCode = options.getLanguageCode;

			lang = {

				universe: "Universe",

			};

			const _languageCode = getLanguageCode();

			switch (_languageCode) {

				case 'ru'://Russian language

					lang.universe = 'Вселенная';

					break;
				default://Custom language
					if ((guiParams.lang === undefined) || (guiParams.lang.languageCode != _languageCode))
						break;

					Object.keys(guiParams.lang).forEach(function (key) {

						if (lang[key] === undefined)
							return;
						lang[key] = guiParams.lang[key];

					});

			}

		}

		/*не нужно если вселенную отображать с помощью ND
		scene = new Proxy( scene, {

			get: function (scene, name) {

				switch (name) {

					case 'addUniverse': return ( universe3D ) => {

						scene.add( universe3D );
						
						if ( options.guiSelectPoint ) {
							
							if ( universe3D.name === '' ) universe3D.name = lang.universe;
							options.guiSelectPoint.addMesh( universe3D );
				
						}
						
					}
					case 'remove': return ( child ) => {

						scene.remove( child );
						
						if ( options.guiSelectPoint ) options.guiSelectPoint.removeMesh( child );
						
					}
						
				}
				return scene[name];

			}
			
		} );
		*/		
		
//		this.scene = scene;
		
		settings.object = settings.object || {};
		settings.object.geometry = settings.object.geometry || {};
		if (settings.object.geometry.indices) {

			if (!settings.object.geometry.indices.isUniversyProxy) {
				
				const indices = [];
				Object.keys( settings.object.geometry.indices ).forEach( key => indices[key] = settings.object.geometry.indices[key] );
				settings.object.geometry.indices = indices;

			}
			
		} else settings.object.geometry.indices = {};
		if (!settings.object.geometry.indices.isUniversyProxy) {
			
			settings.object.geometry.indices[0] = settings.object.geometry.indices[0] || settings.object.geometry.indices.edges || [];
			delete settings.object.geometry.indices.edges;
			settings.object.geometry.indices[1] = settings.object.geometry.indices[1] || settings.object.geometry.indices.faces || [];
			delete settings.object.geometry.indices.faces;
			settings.object.geometry.indices[2] = settings.object.geometry.indices[2] || settings.object.geometry.indices.bodies || [];
			delete settings.object.geometry.indices.bodies;
			settings.object.geometry.indices = new Proxy(settings.object.geometry.indices ? settings.object.geometry.indices : [], {
	
				get: function (_indices, name) {
	
					const i = parseInt(name);
					if (!isNaN(i)) return _indices[i];
	
					switch (name) {
	
	//					case '_indices': return _indices;
	//					case 'edges': return _indices[0];
	//					case 'faces': return _indices[1];
						case 'isUniversyProxy': return true;
						case 'count': return _indices.count;
/*							
							return ( error, minCount = 3 ) => {
							if (_indices.count === undefined) _indices.count = minCount;
							if (_indices.count < minCount) {
					
								console.error( error + minCount );
								_indices.count = minCount;
								
							}
							return _indices.count;
						}
*/	  
						case 'boAddIndices':
						case 'length': 
						case 'forEach': return _indices[name];//for compatibility with ND
						default: console.error(sEgocentricUniverse + ': indices get: invalid name: ' + name);
						
					}
					return _indices[name];
	
				}
	
			});
	
		}

		/**
		 * @description array of Vertices.
		 **/
		settings.object.geometry.position = settings.object.geometry.position || new Proxy( [], {

			get: function (_position, name) {

				const i = parseInt(name);
				if (!isNaN(i)) {

					if (i >= _position.length)
						console.error(sEgocentricUniverse + ': position get. Invalid index = ' + i + ' position.length = ' + _position.length);
					return _position[i];

				}
				switch (name) {

					case 'push': return ( vertice=[] ) => {

						_position.push( new Proxy( vertice, {

							get: (vertice, name) => {

								switch (name) {
										
								case 'edges':
										
									if (!debug) {

										console.error(sEgocentricUniverse + ': vertice.edges. Set debug = true first.');
										return;
										
									}
									vertice.edges = vertice.edges || new Proxy( [], {

										get: (edges, name) => {
			
											switch (name) {
													
												case 'push': return ( edgeId, verticeId ) => {

													if (debug) {

														const sPush = sEgocentricUniverse + ': Vertice' + (verticeId === undefined ? '' : '[' + verticeId + ']') + '.edges.push(' + edgeId + '):';

														if (edges.length >= this.verticeEdgesLengthMax) {
															
															console.error(sPush + ' invalid edges.length = ' + edges.length);
															return;
															
														}
														//find for duplicate edgeId
														for ( let j = 0; j < edges.length; j++ ) {
															
															if (edges[j] === edgeId) {
	
																console.error(sPush + ' duplicate edgeId: ' + edgeId);
																return;
																
															}
	
														}

													}
													
													edges.push( edgeId );
													
												}
	
											}
											return edges[name];
												
										}, 
									} );
									return vertice.edges;

								}
								return vertice[name];
								
							},
												  
						} ) );

					};
					break;
					//for debug
					case 'test': return () => {

						//соеденить конец последнего ребра с началом первого ребра
						//indices.edges[indices.edges.length - 1].vertices[1] = indices.edges[0].vertices[0];

						if (!debug) return;

						_position.forEach( ( vertice, verticeId ) => {
	
							const str1 = sEgocentricUniverse + ': position.test()', strVerticeId = 'position(' + verticeId + ')';
							egocentricUniverse.Test(vertice, strVerticeId);
							vertice.edges.forEach( edgeId => {
	
								if (typeof edgeId !== "number") console.error(str1 + '. ' + strVerticeId + '. Invalid edgeId = ' + edgeId);
								
							} );
							
						} )
					}
					break;

				}
				return _position[name];

			},
			set: function (_position, name, value) {

				const i = parseInt(name);
				if (!isNaN(i)) {

//					console.error(sEgocentricUniverse + ': position set. Hidden method: position[' + i + '] = ' + value);
					value.forEach( ( axis, j ) => {
						
						if (isNaN( axis )) console.error(sEgocentricUniverse + ': position set. position[' + i + '][' + j + '] = ' + axis );
						else if (( _position[i].push(axis) - 1 ) != j)
							console.error(sEgocentricUniverse + ': position set. position[' + i + '][' + j + '] = ' + axis + ' Invalid new axis index = ' + j );
						
					} );

				}
				return true;

			}

		});

		//settings.count = 'count';//Error: Edges: indices.edges set. Invalid edges array: count
		//settings.count = [{ isProxy: true }];//Error: Faces: faces[0]. Duplicate proxy
		//settings.count = [{ edges: true }];//Error: Faces: faces[0]. Invalid face.edges instance: true
		//settings.count = [[]];//Error: Faces: faces[0]. Invalid face instance
		this.Indices();
		
//		this.log();
/*			
		if ( debug ) {
			
			settings.object.geometry.position.forEach((vertice, i) => console.log('position[' + i + ']. ' + JSON.stringify( vertice )));
			settings.object.geometry.indices.edges.forEach((edge, i) => console.log('indices.edges[' + i + ']. ' + JSON.stringify( edge )));
			settings.object.geometry.indices.faces.forEach((face, i) => console.log('indices.faces[' + i + ']. ' + JSON.stringify( face )));

		}
*/   
/*
		//Project universe into 3D space
		this.display = ( n,//universe dimension
						settings, debugObject ) => { 
			
//			settings.scene = scene;
			settings.options = options;
			if (!settings.object.name) settings.object.name = lang.universe;
			new ND( n, settings );

			if (debugObject) settings.scene.add( debugObject );
		
		}
*/
/*
		this.remove = ( scene ) => {

			for (var i = scene.children.length - 1; i >= 0; i--) {
				
				const child  = scene.children[i];
				scene.remove( child );
				if ( options.guiSelectPoint ) options.guiSelectPoint.removeMesh( child );

			}
			//remove previous position
			this.settings.object.geometry.position.forEach( vertice => vertice.length = 0 );
			
		}
*/
//		if (!settings.noTest) this.project();
		
	}

}

//GraphicObject.ND = ND;

export default GraphicObject;

