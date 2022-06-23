/**
 * Size of object in bytes.
 *
 * @author [Andrej Hristoliubov]{@link https://github.com/anhr}
 * Thanks to https://stackoverflow.com/a/11900218/5175935
 *
 * @copyright 2011 Data Arts Team, Google Creative Lab
 *
 * @license under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */

/**
 * 
 * @param {object} object The object whose size you want to know
 * @returns size of object in bytes
 */
export default function roughSizeOfObject( object ) {

	var objectList = [];
	var stack = [object];
	var bytes = 0;

	while ( stack.length ) {
		var value = stack.pop();

		if ( typeof value === 'boolean' ) {
			bytes += 4;
		}
		else if ( typeof value === 'string' ) {
			bytes += value.length * 2;
		}
		else if ( typeof value === 'number' ) {
			bytes += 8;
		}
		else if
			(
			typeof value === 'object'
			&& objectList.indexOf( value ) === -1
		) {
			objectList.push( value );

			for ( var i in value ) {
				stack.push( value[i] );
			}
		} else if ( ( typeof value !== "function" ) && ( value !== null ) )
			console.error( 'typeof value = ' + typeof value );
	}
	return bytes;
}
