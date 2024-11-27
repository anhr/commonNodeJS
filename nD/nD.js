/**
 * @module ND
 * @description N-dimensional graphics
 * @author [Andrej Hristoliubov]{@link https://github.com/anhr}
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
import Options from '../Options.js'
import PositionController from '../PositionController.js';
import MyMath from '../myMath/myMath.js'
import MyObject from '../myObject.js'

/*
dimention	geometry	points	edges	faces	bodyes	4D objects
1			line		2		0
2			triangle	3		3		1
3			tetrahedron	4		6		4		1
4			pentatope	5		10		10		5		1
*/

class ND extends MyObject {

	/**
	 * N-dimensional graphics.
	 * Creates an N-dimensional graphic object,
	 * checks for a collision between an n-dimensional plane and an n-dimensional graphics object and returns the (n-1)-dimensional intersection geometry if a collision was occurs.
	 * @param {number} n space dimension of the graphical object.
	 * @param {object} [settings={}] The following settings are available
	 * @param {object} [settings.object] geometry, position and rotation of the n-dimensional graphical object.
	 * @param {String} [settings.object.name] name of n-dimensional graphical object.
	 * @param {number|String|object} [settings.object.color='lime'] color of N-dimensional graphic object.
	 * <pre>
	 * number - [Hex triplet]{@link https://en.wikipedia.org/wiki/Web_colors#Hex_triplet} color. Example: 0xffffff - white color
	 * String - color name. See list of available color names in the <b>_colorKeywords</b> object in the [Color.js]{@link https://github.com/mrdoob/three.js/blob/dev/src/math/Color.js} file.
	 * object - Sets the color separately for each vertice.
	 *	You can choose one way for setting of the vertice color from two available:
	 *	
	 *	1. Set the fourth <b>w</b> coordinate of each vertex in a range from
	 *		<b>settings.options.scales.w.min</b> to
	 *		<b>settings.options.scales.w.max</b>
	 *		
	 *		<b>w</b> coordinate is index of palette color. See <a href="../../colorpicker/jsdoc/module-ColorPicker-ColorPicker.html#toColor" target="_blank">toColor</a> method from <b>ColorPicker</b> class.
	 *		Example:
	 *		settings.object.geometry.position: [
	 *			//pyramid
	 *			[0,-0.9428090415820634,0.33333333333333326, 1],
	 *			[0.8164965662730563,0.4714045207910317,0.33333333333333326, 0.5],
	 *			[-0.8164965662730563,0.4714045207910317,0.33333333333333326, 0],
	 *			[7.32733549761259e-9,4.230438555019589e-9,-1.0, -1.0],
	 *		],
	 *	
	 *	2. Set a <b>settings.object.geometry.colors</b> array. 
	 * Have effect only if <b>settings.object.geometry.colors</b> are not defined.
	 * </pre>
	 * @param {boolean|object} [settings.object.faces] true or object - display the n-dimensional graphical object faces instead of edges.
	 * @param {float} [settings.object.faces.opacity=0.5] color Float in the range of 0.0 - 1.0 indicating how transparent the material is.
	 * A value of 0.0 indicates fully transparent, 1.0 is fully opaque.
	 * If the <b>transparent</b> property is not set to true, the material will remain fully opaque and this value will only affect its color.
	 * See [Material.opacity]{@link https://threejs.org/docs/#api/en/materials/Material.opacity}.
	 * @param {boolean} [settings.object.faces.transparent= true] Defines whether this material is transparent.
	 * This has an effect on rendering as transparent objects need special treatment and are rendered after non-transparent objects.
	 * When set to true, the extent to which the material is transparent is controlled by setting its <b>opacity</b> property.
	 * See [Material.transparent]{@link https://threejs.org/docs/#api/en/materials/Material.transparent}.
	 * @param {Array|Object} [settings.object.geometry] Array of vertices and indices of the n-dimensional graphical object.
	 * <pre>
	 * Every item of array is n-dimensional vector of vertice of object.
	 * Or Object. See object's keys below.
	 * </pre>
	 * @param {Array} [settings.object.geometry.position] Array of vertices of the n-dimensional graphical object.
	 * <pre>
	 * Every item of array is n-dimensional vector of vertice of object.
	 * For example, if you want to create a tetrahedron, then you need to create an array of 4 vertices.
	 * <b>settings.object.geometry.position: [
	 * 	[-0.6, 0.1, 0.8],//0
	 * 	[0.7, 0.5, 0.9],//1
	 * 	[0, -0.4, 0.8],//2
	 * 	[0, 0, -0.6]//3
	 * ]</b>,
	 * </pre>
	 * @param {Array} [settings.object.geometry.colors] Array of colors for the each vertex.
	 * <pre>
	 * Every vertex is associated with 3 values of the <b>colors</b> array.
	 * Each value of the <b>colors</b> array is red or green or blue color of the particular vertex in range from 0 to 1.
	 * 
	 * 0 is no color.
	 * 1 is full color.
	 * 
	 * For example:
	 * settings.object.geometry.colors: [
	 * 	1, 0, 0,//red color of the <b>position[0]</b> vertex.
	 * 	0, 1, 0,//green color of the <b>position[1]</b> vertex.
	 * 	0, 0, 1,//blue color of the <b>position[2]</b> vertex.
	 * 	1, 1, 1,//white color of the <b>position[3]</b> vertex.
	 * ],
	 * Have effect only if <b>settings.object.geometry.position</b> points are not <b>THREE.Vector4</b> type.
	 * See <b>arrayFuncs</b> parametr of the <a href="../../player/jsdoc/module-Player-Player.getPoints.html" target="_blank">Player.getPoints(...)</a> for details.
	 * </pre>
	 * @param {array} [settings.object.geometry.opacity] array of opacities for the each vertex. Each item of array is float value in the range of 0.0 - 1.0 indicating how transparent the material is. A value of 0.0 indicates fully transparent, 1.0 is fully opaque.
	 * @param {Array} [settings.object.geometry.boRememberPosition=true] true - Remember vertex positions for higher performance. As result, new vertex positions have no effect.
	 * @param {Array} [settings.object.geometry.indices] Array of <b>indices</b> of vertices of the n-dimensional graphical object.
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
	 * <b>settings.object.geometry.position</b> = [
	 *	[-0.5, 1],//0
	 *	[0.5]//1
	 *]
	 * <b>settings.object.geometry.indices</b> = [
	 *	[
	 *		0,//index of the settings.object.geometry.position[0] = [-0.5, 1]
	 *		1,//index of the settings.object.geometry.position[1] = [0.5]
	 *	]//0
	 *]//0
	 *
	 * <b>n</b> = 2 triangle
	 * <b>settings.object.geometry.position</b> = [
	 *	[-0.7, 0.2],//0
	 *	[0.8, 0.6],//1
	 *	[0.1, -0.5]//2
	 *],
	 * //edges
	 * <b>settings.object.geometry.indices[0]</b> = [
	 *	[0, 1],//0 index of the settings.object.geometry.positions [-0.7, 0.2] and [0.8, 0.6]
	 *	[0, 2],//1 index of the settings.object.geometry.positions [-0.7, 0.2] and [0.1, -0.5]
	 *	[1, 2] //2 index of the settings.object.geometry.positions [0.8, 0.6] and [0.1, -0.5]
	 *]
	 *
	 * <b>n</b> = 3 tetrahedron.
	 * <b>settings.object.geometry.position</b> = [
	 *	[0.8, -0.6, 0.1],//0
	 * 	[0.9, 0.7, 0.5],//1
	 * 	[0.8, 0, -0.4],//2
	 * 	[-0.6, 0.1, 0.1]//3
	 * ],
	 * //edges
	 * <b>settings.object.geometry.indices[0]</b> = [
	 *	[0, 1]//0 index of the settings.object.geometry.positions [0.8, -0.6, 0.1] and [0.9, 0.7, 0.5]
	 *	[0, 2]//1 index of the settings.object.geometry.positions [0.8, -0.6, 0.1] and [0.8, 0, -0.4]
	 *	[0, 3]//2 index of the settings.object.geometry.positions [0.8, -0.6, 0.1] and [-0.6, 0.1, 0.1]
	 *	[1, 2]//3 index of the settings.object.geometry.positions [0.9, 0.7, 0.5] and [0.8, 0, -0.4]
	 *	[1, 3]//4 index of the settings.object.geometry.positions [0.9, 0.7, 0.5] and [-0.6, 0.1, 0.1]
	 *	[2, 3]//5 index of the settings.object.geometry.positions [0.8, 0, -0.4] and [-0.6, 0.1, 0.1]
	 *]
	 * //faces. Indices of the edges <b>settings.object.geometry.indices[0]</b>
	 * <b>settings.object.geometry.indices[1]</b> = [
	 *	[0, 1, 3]//tetrahedron's face 0
	 *	[0, 2, 4]//tetrahedron's face 1
	 *	[3, 4, 5]//tetrahedron's face 2
	 *	[1, 2, 5]//tetrahedron's face 3
	 *]
	 *
	 * <b>n</b> = 4 pentachoron [5-cell]{@link https://en.wikipedia.org/wiki/5-cell}.
	 * <b>settings.object.geometry.position</b> = [
	 *	[0.8, -0.6, 0.1, -0.85],//0
	 *	[0.9, 0.7, 0.5, -0.55],//1
	 *	[0.8, 0, -0.4, 0],//2
	 *	[-0.6, 0.1, -0.3, 0.55],//3
	 *	[-0.5, 0.2, 0.3, 0.85],//4
	 * ],
	 * //edges
	 * <b>settings.object.geometry.indices[0]</b> = [
	 *	[0, 1]//0 index of the settings.object.geometry.positions [0.8, -0.6, 0.1, -0.85] and [0.9, 0.7, 0.5, -0.55]
	 *	[0, 2]//1 index of the settings.object.geometry.positions [0.8, -0.6, 0.1, -0.85] and [0.8, 0, -0.4, 0]
	 *	[0, 3]//2 index of the settings.object.geometry.positions [0.8, -0.6, 0.1, -0.85] and [-0.6, 0.1, -0.3, 0.55]
	 *	[0, 4]//3 index of the settings.object.geometry.positions [0.8, -0.6, 0.1, -0.85] and [-0.5, 0.2, 0.3, 0.85]
	 *	[1, 2]//4 index of the settings.object.geometry.positions [0.9, 0.7, 0.5, -0.55] and [0.8, 0, -0.4, 0]
	 *	[1, 3]//5 index of the settings.object.geometry.positions [0.9, 0.7, 0.5, -0.55] and [-0.6, 0.1, -0.3, 0.55]
	 *	[1, 4]//6 index of the settings.object.geometry.positions [0.9, 0.7, 0.5, -0.55] and [-0.5, 0.2, 0.3, 0.85]
	 *	[2, 3]//7 index of the settings.object.geometry.positions [0.8, 0, -0.4, 0] and [-0.6, 0.1, -0.3, 0.55]
	 *	[2, 4]//8 index of the settings.object.geometry.positions [0.8, 0, -0.4, 0] and [-0.5, 0.2, 0.3, 0.85]
	 *	[3, 4]//9 index of the settings.object.geometry.positions [-0.6, 0.1, 0.1, 0.55] and [-0.5, 0.2, 0.3, 0.85]
	 *]
	 * //faces. Indices of the edges <b>settings.object.geometry.indices[0]</b>
	 * <b>settings.object.geometry.indices[1]</b> = [
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
	 * //bodies. Indices of the faces <b>settings.object.geometry.indices[1]</b>
	 * <b>settings.object.geometry.indices[2]</b> = [
	 * [2, 1, 3, 0],//0 no 0 vertice
	 * [5, 6, 4, 0],//1 no 1 vertice
	 * [8, 7, 1, 4],//2 no 2 vertice
	 * [9, 7, 2, 5],//3 no 3 vertice
	 * [9, 8, 3, 6],//4 no 4 vertice
	 *]
	 * </pre>
	 * @param {Array|number} [settings.object.position] Array - position of the n-dimensional graphical object in n-dimensional coordinates.
	 * <pre>
	 * number - position of the 0 coordinate of the n-dimensional graphical object.
	 * <pre>
	 * @param {Array|number} [settings.object.rotation] Array - rotation in radians of the n-dimensional graphical object in n-dimensional coordinates.
	 * <table>
		 <tr><td><b>n</b> space dimension</td><td>Array index</td><td>Axis of rotation</td><td>Axis type</td><td>Note</td></tr>
		 <tr><td>0</td><td></td><td></td><td></td><td>no rotation</td></tr>
		 <tr><td>1</td><td></td><td></td><td></td><td>no rotation</td></tr>
		 <tr><td>2</td><td>0</td><td></td><td></td><td>No effect for 2-dimensional space</td></tr>
		 <tr><td></td><td>1</td><td></td><td></td><td>No effect for 2-dimensional space</td></tr>
		 <tr><td></td><td>2</td><td>2(z)</td><td>point</td><td></td></tr>
		 <tr><td>3</td><td>0</td><td>0(x)</td><td>line</td><td></td></tr>
		 <tr><td></td><td>1</td><td>1(y)</td><td></td><td></td></tr>
		 <tr><td></td><td>2</td><td>2(z)</td><td></td><td></td></tr>
		 <tr><td>4</td><td>0</td><td>0, 1(xy)</td><td>plane</td><td></td></tr>
		 <tr><td></td><td>1</td><td>0, 2(xz)</td><td></td><td></td></tr>
		 <tr><td></td><td>2</td><td>0, 3(xw)</td><td></td><td></td></tr>
		 <tr><td></td><td>3</td><td>1, 2(yz)</td><td></td><td></td></tr>
		 <tr><td></td><td>4</td><td>1, 3(yw)</td><td></td><td></td></tr>
		 <tr><td></td><td>5</td><td>2, 3(zw)</td><td></td><td></td></tr>
		 <tr><td>5</td><td>0</td><td>0, 1, 2(xyz)</td><td>3D space</td><td></td></tr>
		 <tr><td></td><td>1</td><td>0, 1, 3(xyw)</td><td></td><td></td></tr>
		 <tr><td></td><td>2</td><td>0, 1, 4(xy4)</td><td></td><td></td></tr>
		 <tr><td></td><td>3</td><td>0, 2, 3(xzw)</td><td></td><td></td></tr>
		 <tr><td></td><td>4</td><td>0, 2, 4(xz4)</td><td></td><td></td></tr>
		 <tr><td></td><td>5</td><td>0, 3, 4(xw4)</td><td></td><td></td></tr>
		 <tr><td></td><td>6</td><td>1, 2, 3(yzw)</td><td></td><td></td></tr>
		 <tr><td></td><td>7</td><td>1, 2, 4(yz4)</td><td></td><td></td></tr>
		 <tr><td></td><td>8</td><td>1, 3, 4(yw4)</td><td></td><td></td></tr>
		 <tr><td></td><td>9</td><td>2, 3, 4(zw4)</td><td></td><td></td></tr>
		</table>
	 * <pre>
	 * number - rotation in radians around axis 0 or rotation around axis 2 for 2D objects i.e. space dimension n = 2.
	 * See [Can rotations in 4D be given an explicit matrix form?]{@link https://math.stackexchange.com/questions/1402362/can-rotations-in-4d-be-given-an-explicit-matrix-form}, [Rotation matrix]{@link https://en.wikipedia.org/wiki/Rotation_matrix}.
	 * Examples:
	 * <b>n = 4</b>, <b>rotation = [Math.PI / 5, 1, 2, 3, 4, 5]</b>
	 * rotation around 0, 1(xy) plane is Math.PI / 5 radians.
	 * rotation around 0, 2(xz) plane is 1 radian.
	 * etc.
	 *
	 * <b>n = 4</b>, <b>rotation = Math.PI / 5</b>
	 * rotation around 0, 1(xy) plane is Math.PI / 5 radians.
	 *
	 * <b>n = 2</b>, <b>rotation = [0, 0, Math.PI / 4]</b>
	 * rotation around 2(z) point is Math.PI / 4 radians.
	 *
	 * <b>n = 2</b>, <b>rotation = Math.PI / 5</b>
	 * rotation around 2(z) point is Math.PI / 5 radians.
	 * <pre>
	 * @param {Array} [settings.object.geometry.iAxes] array of indices of the axes.
	 * For example if <b>iAxes</b> is [1,2], then axis 1 interpret as axis 0 and axis 2 interpret as axis 1.
	 * As result, you can rotate axes around another axis to 90 degrees.
	 * In example above you have rotated axis 1 and 2 around axis 0 to 90 degrees.
	 * @param {Boolean} [settings.plane=false] true - create <b>vectorPlane</b>. See <b>settings.vectorPlane</b> below.
	 * @param {Array} [settings.vectorPlane] n-dimensional position of the panel
	 * intersecting with the <b>settings.object.geometry</b> n-dimensional graphical object. Available only if <b>settings.plane</b> is true.
	 * @param {THREE.Scene} [settings.scene] [THREE.Scene]{@link https://threejs.org/docs/index.html?q=sce#api/en/scenes/Scene}.
	 * Define <b>scene</b> if you want visualise n-dimensional plane and n-dimensional object to 3-D space of the <b>scene</b>.
	 * @param {Options} [settings.options] See <a href="../../jsdoc/Options/Options.html" target="_blank">Options</a>.
	 * Uses only if <b>scene</b> is defined.
	 * @param {Event} [settings.onIntersection] Plane and object intersection event.
	 * The <b>onIntersection</b> function parameter is the (n-1)-dimensional geometry of the intersection if a collision occurred, or undefined if a collision did not occur.
	 * @see [4D Geometry Viewer]{@link https://github.com/anhr/humke-4d-geometry}
	 * @see [Tesseract]{@link https://ciechanow.ski/tesseract/}
	 * @see [4D-Shapes]{@link https://artemonigiri.github.io/4D-Shapes/}
	 * @see [The Regular Polychora]{@link https://www.qfbox.info/4d/regular}
	 */
	constructor( n, settings ) {

		super( settings );
		const options = settings.options, _ND = this;
		settings.object.raycaster = settings.object.raycaster || {};
		settings.object.raycaster.text = settings.object.raycaster.text || function( intersection ) {

			//Localization

			const getLanguageCode = settings.options.getLanguageCode;

			const lang = {

				pointId: "point Id",
				edgeId: "edge Id",
				faceId: "face Id",
				bodyId: "body Id",
				segmentId: "segment Id",

			};

			const _languageCode = getLanguageCode();

			switch (_languageCode) {

				case 'ru'://Russian language

					lang.pointId = 'Индекс точки';
					lang.edgeId = 'Индекс ребра';
					lang.faceId = 'Индекс грани';
					lang.bodyId = 'Индекс тела';
					lang.segmentId = 'Индекс сегмента';

					break;

			}

			const index = intersection.object.geometry.index, edge = [
					index.getX(intersection.indexNew),
					index.getY(intersection.indexNew)
				],
				indices = intersection.object.userData.geometry.indices;
			edges = indices[0];

			//find point id
			var minDistance = Infinity, pointId;
			function distance ( i ) {

				const pointIndex = edge[i],
					distance = intersection.point.distanceTo( new THREE.Vector3().fromBufferAttribute( intersection.object.geometry.attributes.position, pointIndex ) );
				if ( minDistance > distance  ) {
	
					minDistance = distance;
					pointId = pointIndex;
					
				}
				
			}
			distance ( 0 );
			distance ( 1 );
			var text = '\n' + lang.pointId + ': ' + pointId;
			
			//Find edge index
			const drawRange = settings.bufferGeometry.drawRange;
//			for ( var segmentIndex = 0; segmentIndex < edges.length; segmentIndex++ )
//			for ( var segmentIndex = drawRange.start; segmentIndex < (drawRange === Infinity) ? edges.length : (drawRange.start + drawRange.count) / 2; segmentIndex++ ) {
			for ( var segmentIndex = drawRange.start; segmentIndex < ( ( drawRange === Infinity) ? edges.length : drawRange.start + drawRange.count ); segmentIndex++ ) {

				const edgeCur = edges[segmentIndex];
				if (
					( ( edgeCur[0] === edge[0] ) && ( edgeCur[1] === edge[1] ) ) ||
					( ( edgeCur[0] === edge[1] ) && ( edgeCur[1] === edge[0] ) )
				) {

					text += '\n' + lang.edgeId + ': ' + segmentIndex;
					edges.selected = segmentIndex;
					
					//find segment id.
					//indices[1] is faces
					//indices[2] is bodies
					var detectedIndex;//индекс элемента текушего сегмента segment = indices[indicesSegment]
						//в котором встечается индекс segmentIndex выбранного сегмента перудыдущего уровня
					for ( var indicesSegment = 1; indicesSegment < indices.length; indicesSegment++ ) {

						const segment = indices[indicesSegment];//текуший сегмент
						//Встречаются ли в текушем сегменте segment индекс segmentIndex выбранного сегмента перудыдущего уровня
						segment.forEach( ( segmentItem, segmentIndexCur ) => {

							//найти в текущем элементе сегмента segmentItem индекс segmentIndex выбранного сегмента перудыдущего уровня
							//и присвоить detectedIndex = segmentIndexCur равному индексу текущего элемента сегмента
							for ( var i = 0; i < segmentItem.length; i++ ) {
								
								//segmentIndex индекс выбранного сегмента перудыдущего уровня
								//для segment = indices[1] is faces это индекс выбранного edge
								//для segment = indices[2] is bodies это индекс выбранного face
								if ( segmentItem[i] === segmentIndex ) {
									
									//if ( detectedIndex != undefined ) console.log( 'Duplicate segment: ' + i );
									detectedIndex = segmentIndexCur;
									break;

								}

							}
							
						} );
						if ( detectedIndex === undefined ) {
							
							console.error( 'ND: mouse move. Index of segment was not detected' );
							break;

						}
						else {
							
							segmentIndex = detectedIndex;
							var segmentName;
							switch( indicesSegment ) {//индекс ткушего сегмета

								case 1: segmentName = lang.faceId; break;
								case 2: segmentName = lang.bodyId; break;
								default: segmentName = lang.segmentId;
									
							}
							text += '\n' + segmentName + ': ' + segmentIndex;
							segment.selected = segmentIndex;

						}
						
					}
					const segment = indices[indices.length - 1][segmentIndex];
					break;
					
				}
				
			}
			return text;
			
		};
		settings.object.name = settings.object.name || 'Object';
		if ( settings.object.aObjects ) settings.object.aObjects.nD = this;
		settings.object.geometry = settings.object.geometry || {};
		if ( settings.object.geometry instanceof Array ) {

			const position = settings.object.geometry;
			settings.object.geometry = { position: position, }

		}

		//Эту строку нельзя использовать потому что во вселенной будет ошибка
		//TypeError: classSettings.overriddenProperties.position0.angles[verticeId].middleVertice is not a function
		//если:
		//Открыть http://localhost/anhr/universe/main/hyperSphere/Examples/ что бы не было видно ребер classSettings.edges.project = false
		//Сделать один шаг проигрывателя: нажать →
		//Сделать ребра видимыми: Поставить галочку Гиперсфера\Ребро\Отображать.
		//Сделать один шаг проигрывателя: нажать →
		//Это происходить потому что когда проигрыватель находится не в начальном положении timeId > 0, то в settings.object.geometry.position попадают вершины не из начального времени
		//settings.object.geometry.position = settings.object.geometry.position || [];
		
		if (!settings.object.geometry.position) settings.object.geometry.position = [];

		class Vector extends ND.VectorN {

			/* *
			 * @description
			 * <pre>
			 * An n-dimensional vector is point in an n-dimensional space.
			 * The length of an array is the dimension of the space.
			 * @param {Array} [array=0] array of the values for appropriate axes.
			 * </pre>
			 * @example //Creates a point in 2-dimensional space. -5 is value for 0 axis and 7.8 is value for 1 axis.
			 * const vector = new ND.Vector( [-5, 7.8] );
			 * const point = vector.point;//THREE.Vector3( -5, 7.8, 0 )
			 * const vector0 = vector[0]//-5
			 * const vector1 = vector[1]//7.8
			 */
			constructor( array = 0, vectorSettings = {} ) {

				array = super(n, array).array;
				const _this = this;

				//https://stackoverflow.com/questions/2449182/getter-setter-on-javascript-array
				return new Proxy( array, {

					get: function ( target, name ) {

						var i = parseInt( name );
						if ( isNaN( i ) ) {

							switch ( name ) {

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
									if ((typeof settings.object.color === "object") && (array.length >= 4))
										return new THREE.Vector4( this.get( undefined, 0 ), this.get( undefined, 1 ), this.get( undefined, 2 ), this.get( undefined, 3 ) );//цвет каждой вершины зависить от оси w этой вершины
									return new THREE.Vector3( this.get( undefined, 0 ), this.get( undefined, 1 ), this.get( undefined, 2 ) );//Цвет всех вершин определяется из settings.object.color или из settings.object.geometry.colors или одинаковый по умолчанию
								default: {

									return _this[name];
								
								}

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
								
							if ( i >= array.length ) {
	
								array.push( value );
								return array.length;
	
							}
							array[i] = value;
							_ND.intersection();
							if ( vectorSettings.onChange ) vectorSettings.onChange();
							return true;
							
						}
						switch ( name ) {
	
							case 'onChange':
								vectorSettings.onChange = value;
								return vectorSettings.onChange;
							default: console.error( 'ND: Vector set. Invalid name: ' + name );
	
						}

					}

				} );

			}
			push( value ) { console.error( 'ND.Vector.push() unavailable' ); }
			pop() { console.error( 'ND.Vector.pop() unavailable' ); }

		}

		function update() {
			
			_ND.intersection();
//			object3D.geometry.attributes.position.array = new THREE.BufferGeometry().setFromPoints( geometry.D3.points ).attributes.position.array;
			object3D.geometry.attributes.position.needsUpdate = true;
			if (options.guiSelectPoint) options.guiSelectPoint.update();
			object3D.children.forEach( child => {
				
				if ( child.type === 'Sprite' ) child.position.copy( geometry.D3.points[child.userData.pointID] );
					
			} );
			
		}
		function proxyPosition() {

			if ( settings.object.position && settings.object.position.isProxy ) return settings.object.position;
			return new Proxy( settings.object.position ? settings.object.position instanceof Array ? settings.object.position : [settings.object.position] : [], {

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
						case 'clear': return function () {

							target.forEach( ( pos, i ) => target[i] = 0 );

						}
						case 'forEach': return target.forEach;
						case 'length': return target.length;
						default: console.error( 'ND: settings.object.position Proxy. Invalid name: ' + name );

					}

				},
				set: function ( target, name, value ) {

					target[name] = value;

					settings.object.geometry.position.reset();

					const input = target.folders[name].cPosition.domElement.querySelector( 'input' );
					if ( parseFloat( input.value ) !== value ) {

						input.value = value;
						update();

					}
					return true;

				},

			} );

		}
		settings.object.position = proxyPosition();

		function proxyRotation() {

			if ( settings.object.rotation && settings.object.rotation.isProxy ) return settings.object.rotation;
			return new Proxy( settings.object.rotation ? settings.object.rotation instanceof Array ? settings.object.rotation : [settings.object.rotation] : [], {

				get: function ( target, name, args ) {

					const i = parseInt( name );
					if ( !isNaN( i ) ) {

						if ( target instanceof Array ) {

							if ( i < target.length && ( target[i] !== undefined ) ) return target[i];
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
							if ( !target.trigonometry ) {

								target.trigonometry = new Proxy( [], {

									get: function ( target, name, args ) {

										const i = parseInt( name );
										if ( !isNaN( i ) ) {

											if ( !target[i] ) {

												settings.object.rotation.boUseRotation = true;
												const angle = settings.object.rotation[i];
												settings.object.rotation.boUseRotation = false;
												target[i] = { sin: Math.sin( angle ), cos: Math.cos( angle ) };

											}
											return target[i];

										}
										switch ( name ) {

											default: console.error( 'ND: settings.object.rotation Proxy. Invalid name: ' + name );

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
						case 'isRotation': return function () {

							target.boUseRotation = true;
							var boRotation = false
							for ( var j = 0; j < n; j++ ) {

								if ( settings.object.rotation[j] !== 0 ) {

									boRotation = true;
									break;

								}

							}
							target.boUseRotation = false;
							return boRotation;

						}
						case 'clear': return function () {

							target.forEach( ( angle, i ) => target[i] = 0 );
							target.trigonometry = undefined;

						}
						case 'arguments': return;//for dat.GUI
						case 'forEach': return target.forEach;
						case 'length': return target.length;
						default: console.error( 'ND: settings.object.rotation Proxy. Invalid name: ' + name );

					}

				},
				set: function ( target, name, value ) {

					target[name] = value;
					if ( isNaN( parseInt( name ) ) ) return true;

					settings.object.rotation.trigonometry[name].cos = Math.cos( value );
					settings.object.rotation.trigonometry[name].sin = Math.sin( value );

					settings.object.geometry.position.reset();

					if ( target.folders ) {
						
						const input = target.folders[name].cRotation.domElement.querySelector( 'input' );
						if ( parseFloat( input.value ) !== value ) {
	
							input.value = value;
	
						}

					}
					update();
					return true;

				},


			} );

		}
		if ( !settings.object.rotation || !settings.object.rotation.isProxy ) {

			settings.object.rotation = proxyRotation();
			settings.object.rotation.boUseRotation = false;

		}

		if ( settings.object.geometry.position.target ) settings.object.geometry.position = settings.object.geometry.position.target;
		settings.object.geometry.position.boPositionError = true;
		const rotationAxes = [[]];//массив осей вращения
		function setRotationAxes() {

			if ( n < 2 ) return;
			
			if ( rotationAxes[0].length != 0 ) return;

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

				}

			}

		}
		const positionWorld = new Proxy( settings.object.geometry.position ? settings.object.geometry.position : [], {
	
			get: function ( target, name ) {

				const i = parseInt( name );
				if ( !isNaN( i ) ) {

					settings.object.geometry.position.boPositionError = false;
					const positionPoint = settings.object.geometry.position[i];
					if ( positionPoint.positionWorld ) {
						
						//не надо снова вычислять мировые координатя точки если они уже вычислены
						settings.object.geometry.position.boPositionError = true;
						return positionPoint.positionWorld;

					}
					const array = [];
					if ( positionPoint !== undefined ) {

						if ( !( settings.object.position instanceof Array ) ) {

							console.error( 'ND positionWorld get: settings.object.position is not array' );
							settings.object.position = [settings.object.position];

						}
						if ( settings.object.rotation.isRotation() ) {

							//https://math.stackexchange.com/questions/1402362/can-rotations-in-4d-be-given-an-explicit-matrix-form
							//https://en.wikipedia.org/wiki/Rotation_matrix
							function getMatrix( index ) {

								const cos = settings.object.rotation.trigonometry[index].cos, sin = settings.object.rotation.trigonometry[index].sin,
									array = [];
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
								return new MyMath.Matrix( array );

							}
							var m3;

							setRotationAxes();

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
							const p = m3.multiply( position );
							p.forEach( ( value, i ) => {

								if ( value !== undefined ) {

									array.push( value + settings.object.position[i] );

								} else console.error( 'ND: positionWorld get: invalig array item = ' + value );

							} )

						} else {

							positionPoint.forEach( ( value, j ) => array.push( value + settings.object.position[j] ) );
							setRotationAxes();

						}

					} else console.error('ND positionWorld get index')
					if (settings.object.geometry.boRememberPosition === undefined) settings.object.geometry.boRememberPosition = true;
					if (settings.object.geometry.boRememberPosition) positionPoint.positionWorld = array;
					settings.object.geometry.position.boPositionError = true;
					return array;

				}
				switch ( name ) {

					case 'isProxy': return true;
					case 'target': return;// target; Если вершинрнуть target, то неверно сработает if ( settings.object.geometry.position.target ) и позиция intersection будет неверна
					case 'copy': 
						return function () {

							const v = [];
							settings.object.geometry.position.boPositionError = false;
							settings.object.geometry.position.forEach( ( value, i ) => {
								
								v[i] = positionWorld[i];
								settings.object.geometry.position.boPositionError = false;
							
							} );
							settings.object.geometry.position.boPositionError = true;
							return v;
		
						}

				}
				return settings.object.geometry.position[name];

			},
			
		} );

		//делаю как объект для совместимости с GuiIndices потому что в javascript нельзя передовать ссылки на переменные
		//https://stackoverflow.com/questions/7744611/pass-variables-by-reference-in-javascript
		const _prevLine = {};

		function proxyGeometryPosition() {

			const geometry = settings.object.geometry;
			if ( geometry.position && geometry.position.isProxy ) return geometry.position;
			const playerPosition = geometry.playerPosition, position = playerPosition ? geometry.playerPosition[0] : geometry.position ? geometry.position : [];
			return new Proxy(
				
				//Эту строку нельзя использовать потому что во вселенной будет ошибка
				//TypeError: classSettings.overriddenProperties.position0.angles[verticeId].middleVertice is not a function
				//если:
				//Открыть http://localhost/anhr/universe/main/hyperSphere/Examples/ что бы не было видно ребер classSettings.edges.project = false
				//Сделать один шаг проигрывателя: нажать →
				//Сделать ребра видимыми: Поставить галочку Гиперсфера\Ребро\Отображать.
				//Сделать один шаг проигрывателя: нажать →
				//Это происходить потому что когда проигрыватель находится не в начальном положении timeId > 0, то в settings.object.geometry.position попадают вершины не из начального времени
				//settings.object.geometry.position ? settings.object.geometry.position : [],
				
				position,
				{

				get: function ( target, name, args ) {

					const i = parseInt( name );
					if ( !isNaN( i ) ) {

						const positionId = i;
						if ( settings.object.geometry.position.boPositionError ) {

							//срабатывает когда меняется позиция вершины.
							//Не хочу менять boPositionError в этом случае, потому что это может происходить на веб странице пользователя
							//console.error( 'ND: Use positionWorld instread settings.object.geometry.position' );

						}
						if ( i >= target.length ) {

							console.error( 'ND get settings.object.geometry.position: invalid index = ' + i );
							return;

						}
						if ( target[i] instanceof Array ) {

							return new Proxy( target[i], {

								get: function ( target, name, args ) {

									const i = parseInt( name );
									if ( !isNaN( i ) ) {

										if ( i >= target.length ) return 0;
										const axis = target[i];
										if ( isNaN( axis ) ) console.error( 'ND get settings.object.geometry.position[i][' + i + '] = ' + target[i] );
										return axis;

									}
									switch ( name ) {

										case 'reset': return function() { delete target.positionWorld; }
										case 'distanceTo': return (verticeTo) => {
	
											const vertice = target;
											if (vertice.length != verticeTo.length) {
	
												console.error(sUniverse + ': settings.object.geometry.position[i].distanceTo(...). vertice.length != verticeTo.length');
												return;
	
											}
											//const distance = new three.THREE.Vector3(vertice[0], vertice[1], vertice[2], ).distanceTo(new three.THREE.Vector3(verticeTo[0], verticeTo[1], verticeTo[2], ));
											let sum = 0;
											vertice.forEach((axis, i) => {
	
												const d = axis - verticeTo[i];
												sum += d * d;
	
											})
											return Math.sqrt(sum);
									}

									}
									return target[name];

								},
								set: function ( target, name, value ) {

									const i = parseInt( name );
									target[name] = value;
									if ( !isNaN( i ) ) {

//										_ND.bufferGeometry.userData.position[positionId][i] = value;
										target.positionWorld = undefined;
										if ( _prevLine.prevLine ) {
											
											_prevLine.prevLine.geometry.attributes.position.array = new THREE.BufferGeometry().setFromPoints( geometry.D3.points ).attributes.position.array;
											_prevLine.prevLine.geometry.attributes.position.needsUpdate = true;

										}
										update();//изменилась позиция вершины

									}
									return true;

								},

							} );

						}
						console.error( 'ND: get settings.object.geometry.position is not array.' )
						return [target[i]];

					}
					switch ( name ) {

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
						case "reset": return function () { target.forEach( item => delete item.positionWorld ); }
						default: return target[name];

					}

				},
				set: function ( target, name, value ) {

					const i = parseInt( name );
					if ( !isNaN( i ) ) {

						//изменилась позиция вершины
						target[name].positionWorld = undefined;

					}
					target[name] = value;

					return true;

				},

			} );

		}
		settings.object.geometry.position = proxyGeometryPosition();

		//indices

		function setIndices() {
			
			if ( settings.object.geometry.indices ) return;

			settings.object.geometry.indices = [];
			settings.object.geometry.indices.boAddIndices = true;
			
		}
		setIndices();

		//edges
		function proxyEdges( newEdges ) {

			edges = newEdges || edges;
			if ( edges && edges.isProxy ) return edges;
			return new Proxy( edges ? edges : [],
				{

					get: function ( edges, name, value ) {

						const i = parseInt( name );
						if (!isNaN(i)) {

							const edge = edges[i];
							edge.intersection = ( geometryIntersection/*, color*/ ) => {

								const i = parseInt(name);
								if (!isNaN(i)) {

									if (i.toString() !== name) {

										console.error('ND: settings.object.geometry.indices[]intersection. invalid name = ' + name);
										return;

									}
									if (edges.length === 0) return;//no edges
									if (i >= edges.length) {

										console.error('ND: settings.object.geometry.indices[]intersection. invalid length: ' + edges.length);
										this.indices = { intersection: {} };
										return;

									}
									var indices = edges[i];

									//Когда размерность графического оъекта меньше 3
									//и когда он создается из объета большей размерности
									//то indices это прокси
									//if (indices.indices) indices = indices.indices;

									if (indices.length !== 2) {

										console.error('ND: settings.object.geometry.indices[]intersection. indices.length = ' + indices.length);
										return;

									}
									if (indices[0] === indices[1]) {

										console.error('ND: settings.object.geometry.indices[]intersection. indices[0] === indices[1] = ' + indices[0]);
										return;

									}
									const position0 = new Vector(positionWorld[indices[0]]),
										position1 = new Vector(positionWorld[indices[1]]);
									function indicesIntersection(position) {

										switch (n) {

											case 2:
												break;
											default:
												if (!position)
													break;
												position.push(vectorPlane[n - 1]);
												break;

										}
										indices.intersection = { position: position, }
										if (indices.intersection.position) indices.intersection.position.iEdge = i;

									}
									switch (n) {

										case 1:
											if (vectorPlane[0].between(position0[0], position1[0], true))
												geometryIntersection.position.push([vectorPlane[0]]);
											break;
										case 2:
											var vector;
											if (vectorPlane[1].between(position0[1], position1[1], true)) {

												const a = (position1[1] - position0[1]) / (position1[0] - position0[0]),
													b = position0[1] - a * position0[0],
													x = (a === 0) || isNaN(a) || (Math.abs(a) === Infinity) ?
														position1[0] :
														(vectorPlane[1] - b) / a;
												if (isNaN(x) || (x === undefined)) { console.error('ND.intersection: x = ' + x + ' position1[0] = ' + position1[0] + ' position0[0] = ' + position0[0]); }

												//Если x почти равно position0[0] и position0[0] то будем считать что x между ними
												const d = 1e-15;//-1.1102230246251565e-16 
												if (!x.between(position0[0], position1[0], true)) {

													if (!((Math.abs(x - position0[0]) < d) && (Math.abs(x - position0[0]) < d))) {

														indices.intersection = {};
														break;

													}
													//else console.log('x почти равно position0[0] и position0[0]');

												}
												vector = [x, vectorPlane[1]];

											}
											indicesIntersection(vector);
											break;
										case 3:

											var pos;

											//Если позиции вершины находится на этом расстоянии от панели, то будем считать, что она находится на панели
											//Для проверки запустить canvas 3D с geometry Variant 1 и проигрыватель в точке t = 0.6.
											//
											//В примере canvas 3D с geometry.position Variant 2 вершина точно находится на панели
											const d = 5.56e-17;

											if (Math.abs(vectorPlane[n - 1] - position1[n - 1]) < d) pos = position1;
											else if (Math.abs(vectorPlane[n - 1] - position0[n - 1]) < d) pos = position0;
											if (pos) {

												//Вершина находится на панели.
												//Для проверки запустить canvas 3D и установить время проигрывателя t = 0.3 так чтобы вершина 2 пирамиды попала на панель
												//В этом случает треугольник пересечения сведется к трем точкам с одинаковыми координатами.
												indicesIntersection([pos[0], pos[1]]);
												indices.intersection.boVerticeOnPanel = true;

											} else {

												const nD02 = new ND(n - 1, {

													plane: true,
													object: {
														
														geometry: {

															position: positionWorld.copy(),//settings.object.geometry.position,
															indices: [[indices]],
															iAxes: [1, 2],

														},
														
													},
													vectorPlane: vectorPlane.array,

												}),
													arrayIntersects02 = nD02.intersection();
												const nD12 = new ND(n - 1, {

													plane: true,
													object: {
														
														geometry: {

															position: positionWorld.copy(),//settings.object.geometry.position,
															indices: [[indices]],
															iAxes: [0, 2],

														},
													
													},
													vectorPlane: vectorPlane.array,

												}),
													arrayIntersects12 = nD12.intersection();
												indicesIntersection(arrayIntersects02.length && arrayIntersects12.length ?
													[arrayIntersects12[0][0], arrayIntersects02[0][0]] : undefined);

											}
											break;
										default:

											function intersectionAxis(axis) {

												const nD0 = new ND(2, {

													plane: true,
													object: {
														
														geometry: {

															position: positionWorld,//settings.object.geometry.position,
															indices: [[indices]],
															iAxes: [axis, n - 1],

														},
													
													},
													vectorPlane: vectorPlane.array,

												});
												return nD0.intersection();

											}
											const arrayIntersections = [];
											var boIntersect = true;
											for (var iIntersection = 0; iIntersection < n - 1; iIntersection++) {

												const item = intersectionAxis(iIntersection);
												if (boIntersect && (item.length === 0)) {

													boIntersect = false;
													break;

												}
												if (item.length) arrayIntersections.push(item[0][0]);

											}
											indicesIntersection(boIntersect ? arrayIntersections : undefined);

									}

								} else console.error('ND: settings.object.geometry.indices[]intersection. invalid name: ' + name);

							};
							return edge;

						}
						switch ( name ) {

							case 'intersection': return undefined;
							case 'edges': return edges;
							case 'isProxy': return true;

						}
						return edges[name];

					},
					set: function ( edges, prop, value ) {

						const index = parseInt( prop );
						if ( isNaN( index ) ) {

							switch ( prop ) {

								case 'length': break;
								case 'edges': settings.object.geometry.indices[0] = proxyEdges( value ); break;
								case 'selected': edges.selected = value; break;
								default: edges[prop] = value;
//								default: console.error( 'ND settings.object.geometry.indices[0].set: invalid prop: ' + prop );

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

									//console.error('ND.proxyEdges: Duplicate edge: ' + edge);//for http://localhost/anhr/egocentricUniverse/master/Examples/2D.html
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

							console.error( 'ND: settings.object.geometry.indices.push invalid indices.length = ' + indices.length );
							return true;

						}

						//find duplicate edge
						for ( var i = 0; i < edges.length; i++ ) {

							const edgeIndices = edges[i];
							if ( ( edgeIndices[0] === indices[0] ) && ( edgeIndices[1] === indices[1] ) ) {

								console.error( 'ND: settings.object.geometry.indices.push under constraction' );
								return;

							}
							if ( ( edgeIndices[0] === indices[1] ) && ( edgeIndices[1] === indices[0] ) ) {


								console.error( 'ND: settings.object.geometry.indices.push under constraction' );
								//у этого ребра есть ребро близнец, у которого индексы вершин поменены местами
								//Поэтому можно не искать точку пересечения а брать ее из близнеца
								indices[0] = settings.object.geometry.indices[i].indices[0];
								indices[1] = settings.object.geometry.indices[i].indices[1];
								return;

							}

						}

						edges[index] = value;
						return true;

					}

				} );

		}
		var edges;
		function setEdges() {
			
			edges = settings.object.geometry.indices[0];
			var boArray = edges instanceof Array;
			if ( !settings.object.geometry.indices[0] || boArray ) {
	
				const indices = settings.object.geometry.indices;
				if ( boArray ) { if ( !indices[0].isProxy ) indices[0] = proxyEdges(); }
				else indices.push( proxyEdges() );
	
			}

		}
		setEdges();
		
		//Сгруппировать индексы ребер объета из settings.object.geometry.edges по сегментам обекта
		//Например если объект это линия:
		//n = 1
		//settings.object.geometry.indices = [0, 1]//одно ребро
		//settings.object.geometry.edges = [0, 1]
		//settings.object.geometry.iEdges = [0]
		//где
		// 0, //индекс ребра [0, 1] из settings.object.geometry.edges 
		//
		//Объект это треугольник:
		//n = 2
		//settings.object.geometry.indices = [[0, 1], [1, 2], [0, 2]]//3 ребра
		//settings.object.geometry.edges = [[0, 1], [1, 2], [0, 2]]
		//settings.object.geometry.iEdges = [0, 1, 2]
		//где
		// 0, //индекс первого  ребра [0, 1] из settings.object.geometry.edges 
		// 1, //индекс второго  ребра [0, 2] из settings.object.geometry.edges 
		// 2, //индекс третьего ребра [1, 2] из settings.object.geometry.edges 
		//
		//Объект это пирамида:
		//n = 3
		//settings.object.geometry.indices = [
		//	[[0, 1], [1, 2], [2, 0]],
		//	[[0, 1], [1, 3], [3, 0]],
		//	[[0, 2], [2, 3], [3, 0]],
		//	[[1, 2], [2, 3], [3, 1]]
		//]
		//4 грани 6 ребер. 
		//settings.object.geometry.edges = 0: (2) [
		//	[0, 1],//0
		//	[1, 2],//1
		//	[2, 0],//2
		//	[1, 3],//3
		//	[3, 0],//4
		//	[2, 3]//5
		//]
		//ребра [0, 2] и [3, 1] заменяю на [2, 0] и [1, 3]
		//settings.object.geometry.iEdges = [[0, 1, 2], [0, 3, 4], [2, 5, 4], [1, 5, 3]]
		
		function addEdge( indices ) {

			if ( settings.object.geometry.position.length < 2 ) return;//одна точка не имеет ребер
			switch ( n ) {

				case 1://Example [[0,1]]
					const edges = settings.object.geometry.indices[0];
					if ( settings.object.geometry.position ) {
						
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
						case 'forEach': return target.forEach;
						case 'selected': return target.selected;
						default: console.error( 'ND: settings.object.geometry.indices[' + name + ']. Invalid name: ' + name );

					}

				},
				set: function ( target, name, value ) {

					const index = parseInt( name );
					if ( isNaN( index ) ) {

						switch ( name ) {

							case 'length': break;
							case 'selected': target.selected = value; break;
							default: console.error( 'ND settings.object.geometry.indices[' + name + ']: invalid name: ' + name );
								return false;

						}
						return true;

					}
					if ( value instanceof Array === false ) {

						console.error( 'ND settings.object.geometry.indices[' + l + ']: invalid name: ' + name );
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
			geometry = geometry || settings.object.geometry;
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
					const lIndices = [];//тут перечислены индексы всех индексов, котоые были добавлены в settings.object.geometry.indices
					addEdges( level - 1, undefined, posIndices, lIndices );
					if ( lIndices.length ) {

						const l = level - 2;
						if ( l === 0 ) console.error( 'ND addEdges: invalid l = ' + 1 );
						settings.object.geometry.indices[l] = settings.object.geometry.indices[l] === undefined ? proxySegments() : settings.object.geometry.indices[l];
						settings.object.geometry.indices[l].push( lIndices );
						if ( levelIndices ) levelIndices.push( lIndices.index );

					}

				}

			}
			switch ( level ) {

				case 2:
					
					//перечислены индексы вершин, которые образуют грань и которые составляют замкнутую линию ребер грани.
					//По умолчанию для грани в виде треугольника индексы вершин совпадают с положением вершины в 
					//settings.object.geometry.position т.е. positionIndices = [0, 1, 2]
					if ( !positionIndices ) {
						
						positionIndices = [];
						settings.object.geometry.position.forEach( function ( item, i ) { positionIndices.push( i ) } );

					}
					const length = positionIndices.length;
					
					function addItem( start = 0 ) {
						
						for (var i = start; i < length; i++) {

							if (start === 0)
								addItem(i + 1);
							else {

								const edge = [positionIndices[start - 1], positionIndices[i]];
								edges.push(edge);
								if (levelIndices) levelIndices.push(edge.index);

							}

						}
						/*Это было добавлено в commit 'Update ND.js' 'устранил бесконечный цикл добавления ребра'
						 * Но при этом стало некорректно работать intersection
						 * Смотри пример в http://localhost/anhr/commonNodeJS/master/nD/Examples/
						 * Что то не получается воспроизвести бесконечный цикл добавления ребра
						for ( var i = start; i < length; i++ ) {
							
							if ( start === 0 ) {
								
								if (!addItem( i + 1 )) return false;
								
							} else {
								
								const edge = [ positionIndices[start - 1], positionIndices[i] ], length = edges.length;
								edges.push( edge );
								if (length === edges.length) return false;//новое ребро не добавилось. Эта проверка появилась во время отладки http://localhost/anhr/egocentricUniverse/master/Examples/2D.html
																			//Иначе будет бесконечный цикл
								if ( levelIndices ) levelIndices.push( edge.index );

							}
		
						}
						return true;
						*/
		
					}
					addItem();
					break;
				
			}

		}
		function appendEdges() {
			
			switch ( n ) {
	
				case 1://[0, 1]
					addEdge();
					break;
				default: if ( settings.object.geometry.indices[0].length === 0 ) addEdges( n );
	
			}

		}
		appendEdges();

		if ( settings.object.geometry.indices.boAddIndices ) {

			//В каждом сегменте geometry.indices[i] должно встечаться определенное количество индексов из передыдущего сегмента
			//geometry.indices[i - 1]. В противном случае в geometry.indices[i] добавляем новый элемент, в который добавляем
			//индексы из передыдущего сегмента geometry.indices[i - 1].
			//Это нужно для того, что бы во время пересечения объекта с plane появлялся замкнутый intersection.
			//Например после пересечения 3 мерного объекта с plane получалась замкнутая линия, тоесть начало и конец линии соединяем дополнительным ребром.
			//Для проверки в примере запускаем _4D и _3D
			const indices = settings.object.geometry.indices;
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
								return settings.object.geometry.position.length;

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
			get copy() {
				
				const copySettings = {
					
					geometry: { position: [], indices: [] },
					position: [],
					rotation: [],
					aObjects: settings.object.aObjects,
					name: settings.object.name,
					
				};
				settings.object.geometry.position.forEach( vertice => {
					
					const copy = [];
					vertice.forEach( axis => copy.push(axis) );
					copySettings.geometry.position.push( copy );
					
				} );
				settings.object.geometry.indices.forEach( indexes => {
					
					const copy = [];
					indexes.forEach( arrayIndex => {
						
						const copyArrayIndex = [];
						if ( arrayIndex.indices ) arrayIndex = arrayIndex.indices;
						arrayIndex.forEach( index => copyArrayIndex.push(index) );
						copy.push(copyArrayIndex);
					
					} );
					copySettings.geometry.indices.push( copy );
					
				} );
				function copyItem( array ){
					
					const copy = [];
					array.forEach( item => { copy.push( item ); } );
					return copy;
					
				}
				copySettings.position = copyItem( settings.object.position );
				settings.object.rotation.boUseRotation = true;
				copySettings.rotation = copyItem( settings.object.rotation );
				settings.object.rotation.boUseRotation = false;
				return copySettings;
			
			},
			get geometry() { return settings.object.geometry },
			set geometry( geometry ) {
				
				settings.object.geometry.position = geometry.position;
				if ( geometry.indices ) {
					
					settings.object.geometry.indices.length = 1;
					for ( var i = 0; i < geometry.indices.length; i++ ) {
						
						if ( i === 0 ) {

							//убрать edge.intersection, который был создан в ND более высокого уровня, а поэтому в нем указан неверный settings.object.geometry.iAxes, что приводит к перепутыванию осей
							settings.object.geometry.indices[0].edges.length = 0;
							geometry.indices[0].forEach( edge => settings.object.geometry.indices[0].edges.push( edge.indices === undefined ? edge : edge.indices ) );
							
						} else settings.object.geometry.indices[i] = geometry.indices[i];

					}

				} else delete settings.object.geometry.indices;
				
			},
			//Projection of nD object to 3D space for visualization
			D3: {
				
				//Returns a points of projection
				get points() { return _ND.bufferGeometry.userData.position; },
				//returns indices of the faces vertices
				get faceIndices() {

					const aFaceIndices = [];
					const indices = settings.object.geometry.indices;
					if ( indices.length < 2 ) return aFaceIndices;
					indices[1].forEach( face => {
						
						const faceVertices = [];
						face.forEach( ( edge, iEdge ) => {
							
							if ( iEdge > 2 ) {

								console.error( 'ND: geometry.D3.faceIndices get. invalid face edges count.');
								return;
								
							}
							const edgeVertices = indices[0][edge].indices;
							if ( faceVertices.length === 0 ) {

								faceVertices.push( edgeVertices[0] );
								faceVertices.push( edgeVertices[1] );

							} else {

								var boVertice0 = false, boVertice1 = false;
								for ( var i = 0; i < faceVertices.length; i++ ) {

									const faceVertice = faceVertices[i];
									if ( faceVertice === edgeVertices[0] ) boVertice1 = true;
									else if ( faceVertice === edgeVertices[1] ) boVertice0 = true;
									
								}
								if ( !boVertice0 && !boVertice1 ) console.error( 'ND: geometry.D3.faceIndices get. Missing push');
								else if ( boVertice0 != boVertice1 ) {

									faceVertices.push( edgeVertices[boVertice0 ? 0 : 1] );
									
								}//else вершины третьего ребра совпадают с одной оз вершин первого и второго ребра
								
							}
							
						});
						if ( faceVertices.length === 3 ) aFaceIndices.push( faceVertices[0], faceVertices[1], faceVertices[2] );
						else console.error( 'ND: PolyhedronGeometry: subdivide. Invalid face vertices count');
						
					});
					return aFaceIndices;

				},
				//Returns an indices of projection
				get indices() {

					const indices = [], colors = [];
					//если объект не состоит из одной вершины и имеет ребера
					if ( settings.object.geometry.indices[0].length !== 0 ) {

						const edges = settings.object.geometry.indices[0];
						for ( var i = 0; i < edges.length; i++ ) {
	
							let edge = edges[i];//.indices;
							if ( edge !== undefined ) {
								
								if ( edge.length === undefined ) edge = [0, 1];//for compatibility with EgocentricUniverse
								if ( edge.length !== 2 ) {

									console.error( 'ND.geometry.D3.get indices: invalid edge.length = ' + edge.length );
									return;
	
								}
								if ( edge[0] === edge[1] ) {
	
									console.error( 'ND.geometry.D3.get indices: duplicate edge index = ' + edge[0] );
									return;
	
								}
								
								//indices.push( ...edge );//incompatible with https://raw.githack.com/anhr/egocentricUniverse/dev/1D.html
								edge.forEach( vertice => indices.push( vertice ) );
								
								if ( this.color && ( typeof this.color != "object") ) {

									//одинаковый цвет для всех ребер
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
						if (this.color && (typeof this.color === "object")) {

							//цвет вершин
							if ( colors.length != 0 ) console.error('ND.geometry.D3.get vrtices colors: Invalid colors.length = ' + colors.length);
							settings.object.geometry.position.forEach( vertice => {

								const rgb = settings.options.palette.toColor(vertice.w, settings.options.scales.w.min, settings.options.scales.w.max );
								colors.push(rgb.r);
								colors.push(rgb.g);
								colors.push(rgb.b);

							} );

						}

					}
					if ( _ND.setDrawRange ) _ND.setDrawRange( 0, indices.length );//Если тут не установить drawRange, то будут отбражаться не все ребра в http://localhost/anhr/universe/main/hyperSphere/Examples/ 
					return { indices: indices, colors: colors, };

				},

			},

		}
		const points = [];
		for ( var i = 0; i < geometry.position.length; i++ )
			points.push( geometry.position[i].point );
		this.getPoint = (i) => { return points[i]; }
		this.setPositionAttributeFromPoints( points );

		vectorPlane = vectorPlane || new Vector( settings.vectorPlane );
		if ( !vectorPlane || !vectorPlane.point ) vectorPlane = new Vector( vectorPlane );

		var objectIntersect;//порекция объека пересечения панеди с графическим объектом на 3D пространство.

		this.opacity = ( object3D, transparent, opacity ) => { _ND.verticesOpacity( transparent, opacity ); }

		//The user has selected a segment of nD object
		const selectSegment = {

			line: undefined,//segment of nD object, selected by user
			removeLine: function (line) {

						if (line) {

							line.parent.remove(line);
							line = undefined;

						}
				return line;

			},
			opacityDefault: 0.3,
			opacityItem: function (item, parentObject, transparent, opacity = selectSegment.opacityDefault) {

				if (!item.material) return;
				if (transparent && (opacity === 0) && (Object.is(item.parent, parentObject))) parentObject.remove(item);
				else {

					if (!item.parent) parentObject.add(item);
					_ND.opacity( item, transparent, opacity );

				}

			}

		}

		function create3DObject( geometry, settings3D = {} ) {

			let nD;
			if ( !geometry.D3 ) {

				nD = new ND( n, {
					
					plane: true,
					object: { geometry: geometry, color: settings3D.color, },
				
				} );
				geometry = nD.geometry;
				
			} else nD = _ND;
			if (geometry.position.length === 0) return;
			const color = settings3D.color || 'white';//0xffffff
			geometry.D3.color = color;
			const indices3D = geometry.D3.indices, indices = indices3D.indices;

			const buffer = nD.bufferGeometry;
			
			if ( settings3D.faces ) {

				if ( settings3D.faces === true ) settings3D.faces = {};
				if ( settings3D.faces.color === undefined ) settings3D.faces.color = color;
				if ( settings3D.faces.opacity === undefined ) settings3D.faces.opacity = 0.5;
				if ( settings3D.faces.transparent === undefined ) settings3D.faces.transparent = true;
				buffer.setIndex( geometry.D3.faceIndices );
				buffer.computeVertexNormals ();

			} else buffer.setIndex( indices )
			let lineBasicMaterialParameters;
			
			lineBasicMaterialParameters = {
				
				vertexColors: true,
				toneMapped: false,
			
			}
			if ( settings.object.geometry.opacity ) lineBasicMaterialParameters.transparent = true;//установлена прозрачность вершин
			
			const object = indices.length > 1 ?
				settings3D.faces ?
					new THREE.Mesh(buffer, new THREE.MeshLambertMaterial({
						
						color: color,
						opacity: settings3D.faces.opacity,
						transparent: settings3D.faces.transparent,
						side: THREE.DoubleSide
						
					} ) ) :
					new THREE.LineSegments( buffer, new THREE.LineBasicMaterial( lineBasicMaterialParameters ) ) :
				new THREE.Points( buffer, new THREE.PointsMaterial( {
					
					color: color,
					sizeAttenuation: false,
					size: options.point.size / ( options.point.sizePointsMaterial * 2 ),
					
				} ) );
			if ( settings3D.name )
				object.name = settings3D.name;
			
			scene.add( object );

			object.userData.myObject = nD;
			object.userData.geometry = geometry.geometry;
			object.userData.onMouseDown = function ( intersection ) {

				const indices = geometry.geometry.indices, segmentIndex = 0,//edges
					segment = indices[segmentIndex], selectedIndex = segment.selected;

				selectSegment.line = selectSegment.removeLine(selectSegment.line );
				const opacityDefault = intersection.event && intersection.event.button === 0 ? selectSegment.opacityDefault : 1, parentObject = object;
				function opacity( transparent = true, opacity = opacityDefault ) {

					scene.children.forEach(item => selectSegment.opacityItem(item, parentObject, transparent, opacity));

				}
				opacity();
				
				const buffer = new THREE.BufferGeometry().setFromPoints( geometry.D3.points );
				const lineIndices = [];
				function createIndices( item, level ) {

					if ( level > 0 ) {

						level--;
						for ( var i = 0; i < item.length; i++ ) createIndices( indices[level][item[i]], level );
						return;

					}
					const itemIndices = item.indices || item;
					if ( itemIndices.length !== 2 ) console.error( 'ND: createIndices. Invalid itemIndices.length = ' + itemIndices.length );
					var boDetected = false;
					for ( var lineIndicesIndex = 0; lineIndicesIndex < lineIndices.length; lineIndicesIndex += 2 ) {

						if ( ( lineIndices[lineIndicesIndex] === itemIndices[0] ) && ( lineIndices[lineIndicesIndex + 1] === itemIndices[1] ) ) {

							boDetected = true;
							break;
							
						}
						
					}
					if ( !boDetected ) itemIndices.forEach( i => { lineIndices.push( i ); } );

				}
				createIndices( segment[selectedIndex], segmentIndex );
				
				selectSegment.line = new THREE.LineSegments( buffer.setIndex( lineIndices ), new THREE.LineBasicMaterial( { color: object.material.color, } ) );

				parentObject.add( selectSegment.line );
				
			}
			object.userData.nd = function ( fParent, dat, gui = false, boUpdate = false ) {

				if ( !object.userData.nd.update )object.userData.nd.update = function(){ object.userData.nd( fParent, dat, gui, true ) }

				if ( !boUpdate ) {
					
					if ( fParent.parent.fCustom ) {
	
						fParent.parent.fCustom.parent.removeFolder( fParent.parent.fCustom );
						fParent.parent.fCustom = undefined;
						
					}				
					if ( !gui && geometry.geometry.gui )
						fParent.parent.fCustom = geometry.geometry.gui( fParent, dat, settings.options, _ND );

				}

				//Localization

				const getLanguageCode = options.getLanguageCode;

				const lang = {

					vertices: 'Vertices',
					verticesTitle: 'Vertices.',

					edges: 'Edges',
					edgesTitle: 'The selected edge lists the vertex indices of the edge.',
					distance: 'Distance',
					distanceTitle: 'Distance between edge vertices.',

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

					notSelected: 'Not selected',

				};

				const _languageCode = getLanguageCode();

				switch ( _languageCode ) {

					case 'ru'://Russian language

						lang.vertices = 'Вершины';
						lang.verticesTitle = 'Вершины.';

						lang.edges = 'Ребра';
						lang.edgesTitle = 'В выбранном ребре перечислены индексы вершин ребра.';
						lang.distance = 'Расстояние';
						lang.distanceTitle = 'Расстояние между вершинами ребра.';

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

						lang.notSelected = 'Не выбран';

						break;

				}
				for ( var i = fParent.__controllers.length - 1; i >= 0; i-- ) { fParent.remove( fParent.__controllers[i] ); }
				
				const indices = geometry.geometry.indices, segmentIndex = indices.length - 1;
				function addController(
					segmentIndex,//settings.object.geometry.indices index
					fParent,
					segmentItems,//массив индексов элементов текущего segment, которые выбрал пользователь
					prevLine//выбранный пользователем сегмент объекта на более высоком уровне. Например если пользователь выбрал ребро то prevLine указывает на выбранную пользователем грань
				) {

					_prevLine.prevLine = prevLine;
					var segment;
					if ( segmentItems ) {

						function addItem( item, i ) {

							item.i = i;
							segment.push( item );

						}
						segment = [];
						if ( segmentIndex === -1 ) {

							//vertices
							//непонятно почему, но для 2D вершины перечислены в segmentItems.indices
							if ( segmentItems.forEach )
								segmentItems.forEach( i => addItem( geometry.geometry.position[i], i ) );
							else segmentItems.indices.forEach( i => addItem( geometry.geometry.position[i], i ) );
							
						} else {
							
							//indices
							const index = indices[segmentIndex];
							segmentItems.forEach( i => addItem( index[i].indices ? index[i].indices : index[i], i ) );

						}
						
					}else segment = indices[segmentIndex];
					const items = { Items: [lang.notSelected] };
					var fChildSegment, line;
					var name, title;
					switch ( segmentIndex ) {

						case -1: name = lang.vertices; title = lang.verticesTitle; break;
						case 0: name = lang.edges; title = lang.edgesTitle; break;
						case 1: name = lang.faces; title = lang.facesTitle; break;
						case 2: name = lang.bodies; title = lang.bodiesTitle; break;
						default: name = lang.objects; title = lang.objectsTitle;

					}
					const fSegment = fParent.addFolder( name );
					let cDistance;
					fSegment.userData = { objectItems: true, }
					dat.folderNameAndTitle( fSegment, name, title );
					switch ( segmentIndex ) {

						case 0://edges
							cDistance = dat.controllerZeroStep( fSegment, { value: 0, }, 'value' );
							cDistance.domElement.querySelector( 'input' ).readOnly = true;
							dat.controllerNameAndTitle( cDistance, lang.distance, lang.distanceTitle );
							break;

					}
					const cSegment = fSegment.add( items, 'Items', { [lang.notSelected]: -1 } ).onChange( function ( value ) {

						if ( fChildSegment ) {
							
							fChildSegment.__controllers.forEach( ( item, i ) => {
								
								const controller = fChildSegment.__controllers[i];
								if ( controller.__select && ( controller.__select.selectedIndex != 0 ) ) {
									
									controller.__select.selectedIndex = 0;
									controller.__onChange();
	
								}

							} );
							fSegment.removeFolder( fChildSegment );
							fChildSegment = undefined;

						}
						const selectedIndex = cSegment.__select.selectedIndex - 1;
						line = selectSegment.removeLine(line);
						const parentObject = object;
						function opacity(transparent = true, opacity = selectSegment.opacityDefault ) {

							scene.children.forEach(item => selectSegment.opacityItem(item, parentObject, transparent, opacity));

						}

						//Непонятно почему, но прозрачность линии зависит от индекса текущего сегмента segmentIndex.
						//Для проверки открыть холст 5D.
						//Если в 5D прозрачность делать постоянной 0.3, то при выборе тела (body) из объета, объект буден практически непрозрачным
						function getOpacity() {
							
							return -0.1 * segmentIndex + selectSegment.opacityDefault;
							
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

							switch ( segmentIndex ) {
			
								case 0://edges
									cDistance.setValue( '' );
									break;
			
							}
							
							removeVerticeControls();
							if ( prevLine ) {

								selectSegment.opacityItem(prevLine, parentObject, false);
								if (prevLine.userData.prevLine) selectSegment.opacityItem(prevLine.userData.prevLine, parentObject, true, getOpacity() );
								else opacity( true );
								return;
								
							}
							opacity( false );
							return;

						}
						if ( prevLine ) {
							
							opacity(true, 0);
							selectSegment.opacityItem(prevLine, parentObject, true, getOpacity() );
							if (prevLine.userData.prevLine) selectSegment.opacityItem(prevLine.userData.prevLine, parentObject, true, 0 );

						} else opacity();
						if ( segmentIndex === -1 ) {

							//Vertices
							removeVerticeControls();

							//если так сделать, то при выборе объекта пересечения почемуто исчезают _prevLine.prevLine и object3D
							//и как результат появляется ошибка когда пользователь изменяет положение вершины
//							const vertice = geometry.geometry.position[segment[selectedIndex].i];

							const vertice = settings.object.geometry.position[segment[selectedIndex].i];
							for ( var i = 0; i < vertice.length; i++ ) {
								
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
								if ( itemIndices.length !== 2 ) console.error( 'ND: createIndices. Invalid itemIndices.length = ' + itemIndices.length );
								var boDetected = false;
								for ( var lineIndicesIndex = 0; lineIndicesIndex < lineIndices.length; lineIndicesIndex += 2 ) {

									if ( ( lineIndices[lineIndicesIndex] === itemIndices[0] ) && ( lineIndices[lineIndicesIndex + 1] === itemIndices[1] ) ) {

										boDetected = true;
										break;
										
									}
									
								}
								if ( !boDetected ) itemIndices.forEach( i => { lineIndices.push( i ); } );
	
							}
							createIndices(segment[selectedIndex], segmentIndex);
							line = new THREE.LineSegments(buffer.setIndex(lineIndices), new THREE.LineBasicMaterial({ color: object.material.color }));

							switch ( segmentIndex ) {
			
								case 0://edges

									//debug
									if ( lineIndices.length != 2 ) {
										
										console.error( 'ND: Select edge. Invalid lineIndices.length = ' + lineIndices.length );
										break;

									}
										
									const position0 = geometry.geometry.position[lineIndices[0]],
										position1 = settings.object.geometry.position[lineIndices[1]];
									if (position0.length && position1.length) cDistance.setValue( position0.distanceTo(position1) );
									else console.error("ND: Select edge. Invalid edge's vertices distance");
									break;
			
							}

							//debug
							line.userData.name = fSegment.name + ' ' + value;

							parentObject.add( line );

						}
						if (prevLine && line) line.userData.prevLine = prevLine;
						if (segmentIndex >= 0) fChildSegment = addController(segmentIndex - 1, fSegment, segment[selectedIndex], line);

					} );
					dat.controllerNameAndTitle(cSegment, '');
					var selectedItem = 0;

					const selected = segmentIndex >= 0 ? indices[segmentIndex].selected : undefined;
					var selectedOpt;//debug
					for ( var i = 0; i < segment.length; i++ ) {

						const item = segment[i], opt = document.createElement( 'option' ),
							itemIndex = item.index != undefined ? item.index : item.i != undefined ? item.i : i;
						opt.innerHTML = '(' + (item.i === undefined ? i : item.i) + ') ' + (segmentIndex === -1 ? '' : ( item.indices ? item.indices : item ).toString() );
						opt.item = item;
						if ( ( selected != undefined) && ( selected === itemIndex ) ) {
							
							selectedOpt = opt;//debug
							selectedItem = i + 1;

						}
						cSegment.__select.appendChild( opt );

					}
					if ( selected && !selectedOpt ) console.error( 'ND: addController. Selected item was not detected' );
					cSegment.__select[selectedItem].selected = true;
					if ( selectedItem != 0 ) {
						
						cSegment.__select.selectedIndex = selectedItem;
						cSegment.setValue( cSegment.__select[selectedItem].innerHTML );

					}
					return fSegment;

				}
				const childFolders = Object.keys(fParent.__folders);
				childFolders.forEach( folderName => {

					const childFolder = fParent.__folders[folderName];
					childFolder.__controllers.forEach( ( item, i ) => {

						var controller;
						if ( childFolder.userData && childFolder.userData.objectItems ) controller = childFolder.__controllers[i];
						else if ( folderName === 'indices' ) {
							
							//ищем controller в GuiIndices
							Object.keys( childFolder.__folders ).forEach( folderName => {
	
								if ( !controller ) {
	
									const folder = childFolder.__folders[folderName];
									if ( folder.userData && folder.userData.objectItems ) controller = folder.__controllers[i];
	
								}
							});
	
						}
						if ( controller && controller.__select && controller.__select.selectedIndex != 0 ) {
							
							controller.__select.selectedIndex = 0;
							controller.__onChange();
	
						}
						
					} );
					if ( !childFolder.customFolder )  fParent.removeFolder( childFolder );
					
				} );
				const fPosition = fParent.addFolder( lang.position ),
					fRotation = n < 2 ? undefined : fParent.addFolder( lang.rotation );
				function rotation( i ) {
					
					if ( rotationAxes[i].length === 0 ) return;
					settings.object.rotation.boUseRotation = true;
					settings.object.rotation.folders[i] = {

						cRotation: fRotation.add( settings.object.rotation, i, 0, Math.PI * 2, 0.01 ).onChange( function ( value ) { update(); } ),
						default: settings.object.rotation[i],

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
					dat.controllerNameAndTitle( settings.object.rotation.folders[i].cRotation, n === 2 ? '2' : name, title );
					settings.object.rotation.boUseRotation = false;
					
				}
				for ( var i = 0; i < n; i++ ) {

					const axisName = i;

					//position
					{
						
						const f = fPosition.addFolder( axisName );
						settings.object.position.folders[i] = {
	
							positionController: new PositionController( function ( shift ) { settings.object.position[axisName] += shift; },
								{ getLanguageCode: options.getLanguageCode, } ),
							default: settings.object.position[i],
	
						};
						f.add( settings.object.position.folders[i].positionController );
	
						settings.object.position.folders[i].cPosition = dat.controllerZeroStep( f, settings.object.position, i, function ( value ) { update(); } );
						dat.controllerNameAndTitle( settings.object.position.folders[i].cPosition, axisName );

					}

				}
				
				//rotation
				if ( n === 2 ) rotation( 0 );//поворот только вокруг оси 2
				else rotationAxes.forEach( (item, i ) => rotation( i ) );


				//Restore default position.
				const buttonPositionDefault = fPosition.add( {
	
					defaultF: function ( value ) { settings.object.position.folders.forEach( item => item.cPosition.setValue( item.default ) ); },
	
				}, 'defaultF' );
				dat.controllerNameAndTitle( buttonPositionDefault, lang.defaultButton, lang.defaultPositionTitle );

				//Restore default rotation.
				if ( fRotation ) {
					
					const buttonRotationDefault = fRotation.add( {
	
						defaultF: function ( value ) { settings.object.rotation.folders.forEach( item => item.cRotation.setValue( item.default ) ); },
	
					}, 'defaultF' );
					dat.controllerNameAndTitle( buttonRotationDefault, lang.defaultButton, lang.defaultRotationTitle );

				}
				
				addController( segmentIndex, fParent );
			
			}
			if ( options.guiSelectPoint ) options.guiSelectPoint.addMesh( object );

			//raycaster

			object.userData.raycaster = {

				onIntersection: function ( intersection, mouse ) {

					intersection.indexNew = intersection.index;
					//если убрать строку ниже, то будет ошибка
					//Cannot read properties of undefined (reading 'cameraTarget')
					//в строке
					//if (!func.cameraTarget)
					//в функции this.changeTarget класса Player.cameraTarget в файле player.js
					//
					//Но зато будут видны иденксы точек, ребер, граней и т.д. если навести мышку на многомерную фигуру
					//
					//Лень разбираться почему так сделал.
					//Для решения проблемы создаю новую переменную intersection.indexNew. Смотри строку выше.
					//
					//Для тестирования запусить http://localhost/anhr/commonNodeJS/master/nD/Examples/
					//На холсте 5D щелкнуть мышкой на Object или Intersection.
					delete intersection.index;

					Options.raycaster.onIntersection( intersection, options, scene, options.camera, options.renderer );

				},
				onIntersectionOut: function () {
					
					//когда мышка покидает объект, нужно удалить индексы ребер, граней и т.д., над которыми была мышка.
					//В противном случае, когда выбираешь объект в dat.GUI, 
					//автоматически веберется ребро, грань и т.д. над которыми последний раз была мышка
					//Визуально это вызывает недоумение у пользователя
					geometry.geometry.indices.forEach( indice => indice.selected = undefined );
					
					Options.raycaster.onIntersectionOut( scene, options.renderer );
				
				},
				onMouseDown: function ( intersection, event ) {
					
					intersection.event = event;//Теперь можно выполнять разные действия в зависимости от нажатой кнопки мыши
					Options.raycaster.onMouseDown( intersection, options );
				
				},
				text: settings.object.raycaster ? settings.object.raycaster.text : undefined,

			}
			if ( options.eventListeners ) options.eventListeners.addParticle( object );

			return object;

		}
		/**
		 * @returns an array of intersection points of <b>vectorPlane</b> and <b>geometry</b>. See constructor for details.
		 * @param {geometryIntersection} [geometryIntersection = { position: [], indices: [[]] }] Arrays of vertices and indexes of the result of the intersection of the panel and the nD object. See <b>settings.object.geometry</b> of <b>ND</b> constructor for details.
		 * @param {array} [geometryIntersection.position] Array of vertices of the result of the intersection. See <b>settings.object.geometry.position</b> of <b>ND</b> constructor for details.
		 * @param {array} [geometryIntersection.indices] Array of <b>indices</b> of vertices of the result of the intersection. See <b>settings.object.geometry.indices</b> of <b>ND</b> constructor for details.
		 * @param {array} [iIntersections] Array of indices that have been added to <b>geometryIntersection.indices</b>
		 */
		this.intersection = function ( geometryIntersection = { position: [], indices: [[]] }, iIntersections ) {

			if ( settings.plane === false ) return;
			
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
				const edge = settings.object.geometry.indices[0][iEdge];
				edge.intersection( geometryIntersection );//, settings.object.color );
				const position = edge.intersection.position;
				if ( position ) {
					
					var boAdd = true;
					if ( edge.intersection.boVerticeOnPanel ) {

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

						switch ( name ) {

							case 'isProxy': return true;
							case 'target': return target;
							case "reset":
								return function () {
	
									target.forEach( item => item.positionWorld = undefined );
	
								}
		
						}
						return  target[name];
		
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
						target[i] = value;
						return true;
	
					}
					
				} );
			switch ( n ) {

				case 1:
					if ( settings.object.geometry.indices.length !== 1 ) console.error( 'ND.intersection: under constraction. Это не линия.' );
					const edge = settings.object.geometry.indices[0][0];
					edge.intersection( geometryIntersection );
					break;
				case 2:
					const iFaces = settings.object.geometry.indices[1];
					if ( iFaces ) settings.object.geometry.indices[1].forEach( function ( iFace ) { iFace.forEach( function ( iEdge ) { intersection( iEdge ) } ); } );
					else {
						
						for ( var i = 0; i < settings.object.geometry.indices[0].length; i++ ) { intersection( i ); }
						addEdges( undefined, geometryIntersection );

					}
					break;
				default: {

					var iSegments = settings.iSegments || ( n - 2 ),//Индекс массива индексов сегментов settings.object.geometry.indices[iSegments]
											//для которого получаем вершины и индексы
						segments;//массив индексов сегментов для которого получаем вершины и индексы
					while( iSegments >= 0 ) {
						
						segments = settings.object.geometry.indices[iSegments];
						if ( segments ) break;
						iSegments--;

					}
					//settings.indice индекс сегмента в текущем массиве индексов сегментов settings.object.geometry.indices[iSegments][settings.indice]
					if ( settings.indice === undefined ) {

						for ( var i = 0; i < segments.length; i++ ) {

							const nd = new ND( n, {
								
								plane: true,
								object: { geometry: {
								
										indices: settings.object.geometry.indices,
										position: positionWorld.copy(),
									
									},
//									color: 'white',
										 
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
	
								const nd = new ND( n, {
									
									plane: true,
									object: settings.object, indice: segment[i], iSegments: iSegments - 1,
									
								} );
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
					if (options.eventListeners) options.eventListeners.removeParticle( objectIntersect );

				}
				if ( geometryIntersection.position.length )
					objectIntersect = create3DObject( geometryIntersection, { name: 'Intersection', color: 'white' } );

			}
			return geometryIntersection.position;

		}

		const THREE = three.THREE, scene = settings.scene;

		if ( scene ) {

			//Если есть scene, обязательно должен быть options. Здесь создать options неполучится
			const scales = options.scales;
			if ( n <= 1 ) scales.y = undefined;
			if ( n <= 2 ) scales.z = undefined;
			scales.text ||= {};
			scales.text.rect ||=  {};
			scales.text.rect.displayRect = false;
			scales.text.precision = 2;

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
			object3D = create3DObject( geometry, {
				
				name: settings.object.name,
				faces: settings.object.faces,
				color: settings.object.color || _ND.defaultColor,//'lime',//0x00ff00,//'green'
			
			} );

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
							Options.raycaster.onIntersection( intersection, options, scene, options.camera, options.renderer );

						},
						onIntersectionOut: function () { Options.raycaster.onIntersectionOut( scene, options.renderer ); },
						onMouseDown: function ( intersection ) { Options.raycaster.onMouseDown( intersection, options ); },

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
		if ( settings.plane === undefined ) settings.plane = false;
		if ( settings.plane ) {
			
			const plane = new Plane();
			plane.createMesh();

		}

		/**
		* @description
		* Returns N-dimensional vector of the plane that intersects nD object.
		*/
		this.vectorPlane;
		/**
		* @description
		* <pre>
		* returns geometry of N-dimensional object. See <b>settings.object.geometry</b> parameter of <a href="./module-ND-ND.html" target="_blank">ND</a>.
		*	key <b>geometry</b> - get or set a geometry of nD object. See See <b>settings.object.geometry</b> parameter of <a href="./module-ND-ND.html" target="_blank">ND</a>.
		*	key <b>D3</b> - Projection of nD object to 3D space for visualization.
		*		<b>D3.points</b> - Points of projection. See <a href="https://threejs.org/docs/index.html?q=BufferGeometry#api/en/core/BufferGeometry.setFromPoints" target="_blank">.setFromPoints</a> of <a href="https://threejs.org/docs/index.html?q=BufferGeometry#api/en/core/BufferGeometry" target="_blank">THREE.BufferGeometry</a>.
		*		<b>D3.indices</b> - Indices of points of projection. See <a href="https://threejs.org/docs/index.html?q=BufferGeometry#api/en/core/BufferGeometry.setIndex" target="_blank">.setIndex</a> of <a href="https://threejs.org/docs/index.html?q=BufferGeometry#api/en/core/BufferGeometry" target="_blank">THREE.BufferGeometry</a>.
		*		<b>D3.color</b> - color of projection.
		* </pre>
		*/
		this.geometry;

		Object.defineProperties( this, {

			vectorPlane: {

				get: function () { return vectorPlane; }

			},

			geometry: {

				get: function () { return geometry; },
				set: function ( geometryNew ) {

					geometry.geometry = geometryNew;
					settings.object.name = 'Object';
					settings.object.rotation.clear();
					settings.object.position.clear();
					projectTo3D();
					this.intersection()

				},

			},

			object3D: {

				get: () => { return object3D; },
				
			},

			object: {

				get: function () { return settings.object; },
				set: function ( object ) {

					if ( !object ) {
						
						console.error( 'ND.object set: invalid object' );
						return;//отсутствует холст с размерностью пространства верхнего уровня

					}
					if ( !object.update )
						settings.object = object;
					const p = object.position;
					if ( p ) settings.object.position = [...p];
					const r = object.rotation;
					if ( r ) {
						
						if ( r instanceof Array ) settings.object.rotation = [...r];
						else settings.object.rotation = r;

					}
					settings.object.name = settings.object.name || 'Object';
					
					//copy indices
					if ( object.geometry.indices ) {
						
						const indices = [];
						object.geometry.indices.forEach( array => {

							const item = [];
							indices.push( item );
							array.forEach( index => {

								if ( index.indices ) item.push( index.indices );
								else item.push( index );
								
							} );
							
						} );
						settings.object.geometry.indices = indices;

					}
					setIndices();
					setEdges();
					if ( !settings.object.geometry.indices[0].isProxy ) settings.object.geometry.indices[0] = proxyEdges( object.geometry.indices[0] );

					settings.object.position = proxyPosition();
					settings.object.rotation = proxyRotation();
					settings.object.geometry.position = proxyGeometryPosition();
					settings.object.geometry.position.reset();
					
					appendEdges();
					
					if ( object.update ) {

						object3D.geometry.setFromPoints( geometry.D3.points ).setIndex( geometry.D3.indices.indices );
						if ( settings.options && settings.options.guiSelectPoint ) settings.options.guiSelectPoint.updatePoints();
						return;
						
					}
					projectTo3D();
					this.intersection()

				},

			},

		} );

	}

	//Overridden methods from base class

	get defaultColor() { return 'lime'; }
	positionOffset(position, positionId) { return positionId * position.itemSize; }

}

ND.gui = class {

	/**
	 * Custom controllers for N-dimensional graphic object
	 * @param {Options} options See <b>options</b> parameter of <a href="../../myThree/jsdoc/module-MyThree-MyThree.html" target="_blank">MyThree</a> class.
	 * @param {GUI} dat [dat.GUI()]{@link https://github.com/dataarts/dat.gui}.
	 * @param {GUI} fParent parent folder.
	 * @example new ND.gui( options, dat, fMesh );
	 */
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

		}
		const fND = fParent.addFolder( lang.nD );
		dat.folderNameAndTitle( fND, lang.nD, lang.nDTitle );

		this.object = function( object, dat ) {

			var display = 'none';
			if ( object && object.userData.nd ) {

				display = 'block';
				object.userData.nd( fND, dat );
				
			} else Object.keys( fND.__folders ).forEach( key => {

				const folder = fND.__folders[key];
				if ( !folder.userData || ( folder.userData.objectItems === undefined ) ) return;
				folder.__controllers.forEach( cSegment => {

					if (cSegment.__select) {
						
						const selectedItem = 0;
						cSegment.__select.selectedIndex = selectedItem;
						cSegment.setValue( cSegment.__select[selectedItem].innerHTML );

					}
					
				} );
				
				
			} );
			if (object) fND.domElement.style.display =  display;
			
		}

	}

}

ND.VectorN = class {

	/**
	 * base class for n-dimensional vector.
	 * @param {number} n dimension of the vector.
	 * @param {Array} array array of the values of the vector.
	 */
	constructor(n, array) {
		
		if (array.isVector) return array;
		if (array instanceof Array === false) {

			if (typeof array === 'number') array = [array];
			else if (array.array) array = array.array;
			else console.error('FermatSpiral: Vector: invalid array type');

		}
		if (n !== undefined) while (array.length < n) array.push(0);

		//https://stackoverflow.com/questions/2449182/getter-setter-on-javascript-array
		return new Proxy(array, {

			get: function (target, name) {

				var i = parseInt(name);
				if (isNaN(i)) {

					switch (name) {

						case "array": return array;
						/*
						* Adds v to this vector.
						*/
						case "add":
							return function (v) {

								target.forEach((value, i) => target[i] += v[i]);
								return this;

							}
						case "index": return vectorSettings.index;
						case "isVector": return true;
						default: console.error('ND: Vector get. Invalid name: ' + name);

					}
					return;

				}
				if (i >= n)
					return 0;
				if ((array.length > n) && settings.object.geometry.iAxes && (i < settings.object.geometry.iAxes.length))
					i = settings.object.geometry.iAxes[i];
				return array[i];

			},

		});

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
Array.prototype.equals = function (array) {

	// if the other array is a falsy value, return
	if ( !array )
		return false;

	// compare lengths - can save a lot of time 
	if ( this.length != array.length )
		return false;

	for (var i = 0, l = this.length; i < l; i++) {

		// Check if we have nested arrays
		if (this[i] instanceof Array && array[i] instanceof Array) {

			// recurse into the nested arrays
			if ( !this[i].equals( array[i] ) )
				return false;

		}
		else if (this[i] != array[i]) {

			// Warning - two different object instances will never be equal: {x:20} != {x:20}
			return false;

		}

	}
	return true;
}
// Hide method from for-in loops
Object.defineProperty( Array.prototype, "equals", { enumerable: false } );
