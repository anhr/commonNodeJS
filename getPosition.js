/**
 * get position functions library
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

import three from './three.js'

/**
 * gets the position from the geometry.attributes.position of the object.
 * @param {THREE.Mesh} object
 * @param {number} index index of position in the object.geometry.attributes.position
 * @returns position
 */
export function getObjectLocalPosition( object, index ) {

	const getPositionId = object.userData.myObject ? object.userData.myObject.guiPoints.getPositionId : undefined;
	if (getPositionId) index = getPositionId(index);
	const THREE = three.THREE,
		geometry = object.geometry,
		attributesPosition = geometry.attributes.position,
		itemSize = attributesPosition.itemSize,
		position = itemSize >= 4 ? new THREE.Vector4( 0, 0, 0, 0 ) : new THREE.Vector3(),
		drawRange = object.geometry.drawRange,
		offset = index * itemSize;
	if ( geometry.index === null ) {
		
		//Отображаются вершины
/*		
		let sError;
		if ( geometry.index === null ) {
			if ( ( drawRange.count != Infinity ) && ( ( index < drawRange.start ) || ( index >= ( drawRange.start + drawRange.count ) ) ) )
				sError = '';
		} else if ( ( drawRange.count != Infinity ) && ( ( offset < drawRange.start ) || ( offset >= ( drawRange.start + drawRange.count ) ) ) ){
			
			sError = '. offset = ' + offset;
	
		}
		if ( sError != undefined ) console.error( 'getObjectLocalPosition: index = ' + index + sError + ' is out of range = { start: ' + drawRange.start + ', count: ' + drawRange.count + ' }' );
*/		
		if ( ( drawRange.count != Infinity ) && ( ( index < drawRange.start ) || ( index >= ( drawRange.start + drawRange.count ) ) ) )
			console.error( 'getObjectLocalPosition: index = ' + index + ' is out of range = { start: ' + drawRange.start + ', count: ' + drawRange.count + ' }' );
		
	} else {
		
		//Отображаются ребра. Индекс вершины index не в ходит в диапазон видимых ребер drawRange
	
	}
	position.fromArray( attributesPosition.array, offset );
	return position;

}

/**
 * gets position of the vector in world coordinates, taking into account the position, scale and rotation of the 3D object
 * @param {THREE.Object3D} object
 * @param {THREE.Vector3} pos local position
 * @returns world position 
 */
export function getWorldPosition( object, pos ) {

	const THREE = three.THREE;
	var position = pos.clone();

	/*
		//https://stackoverflow.com/questions/11495089/how-to-get-the-absolute-position-of-a-vertex-in-three-js
		//Неудачная попытка вычислить абсолютную позицию точки
		object.updateMatrixWorld();
		position.applyMatrix4( object.matrixWorld );
	*/
	function getPosition( object, pos ) {

		var position = new THREE.Vector3(),
			positionAngle = new THREE.Vector3();
		position = pos.clone();
		position.multiply( object.scale );

		//rotation
		positionAngle.copy( position );
		positionAngle.applyEuler( object.rotation );
		position.x = positionAngle.x;
		position.y = positionAngle.y;
		position.z = positionAngle.z;

		position.add( object.position );
		return position;

	}
	do {

		position = getPosition( object, position );
		object = object.parent;

	} while ( object && object.parent );
	return position;

}

/**
 * gets the position from the geometry.attributes.position of the object in world coordinates.
 * @param {THREE.Mesh} object
 * @param {number} index index of position in the object.geometry.attributes.position
 * @returns position
 */
export function getObjectPosition( object, index ) {

	if ( index === -1 )
		return undefined;
	if ( index === undefined )
		return object.position;
	return getWorldPosition( object, getObjectLocalPosition( object, index ) )
//	return getWorldPosition( object, getObjectLocalPosition( object, object.userData.myObject.guiPoints.getPositionId(index) ) )

}

