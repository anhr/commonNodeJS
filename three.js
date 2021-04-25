/**
 * three class for [THREE]{@link https://github.com/anhr/three.js} variable.
 *
 * @author Andrej Hristoliubov https://anhr.github.io/AboutMe/
 *
 * @copyright 2011 Data Arts Team, Google Creative Lab
 *
 * @license under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */

/*если импортировать THREE, то при "npm run build" получу ошибку
 * (babel plugin) ReferenceError: Unknown plugin "external-helpers" specified in "base" at 1, attempted to resolve relative to 
//import * as THREE from 'https://threejs.org/build/three.module.js';
//import * as THREE from '../../../../../three.js/dev/build/three.module.min.js';
//import * as THREE from '../../three.js/dev/build/three.module.js';
//import * as THREE from '../../three.js/dev/src/Three.js';
//import { THREE } from 'https://raw.githack.com/anhr/commonNodeJS/master/three.js';
//import * as THREE from 'https://raw.githack.com/anhr/three.js/dev/build/three.module.js';
//import * as THREE from 'https://raw.githack.com/anhr/three.js/dev/build/three.module.min.js';
*/

var _THREE;
//var _boThree = false;
class three {

	/**
	 * class for [THREE]{@link https://github.com/anhr/three.js} variable
	 * */
	constructor() { }
	/**
	 * set three
	 * @param {THREE} THREE {@link https://github.com/anhr/three.js|THREE}
	 */
	set THREE( THREE ) {

		if ( _THREE ) {

			if ( !Object.is( THREE, _THREE ) )
				console.error( 'three: duplicate THREE. Please use one instance of the THREE library.' )
			return;

		}
		_THREE = THREE;
//		_boThree = true;

	}
	/**
	 * @returns [THREE]{@link https://github.com/anhr/three.js}
	 */
	get THREE() {

		if ( _THREE === undefined ) {

			console.error( 'three: invalid _THREE = ' + _THREE + '. Call three.THREE = THREE first.' );
//			throw( 'three: invalid _THREE = ' + _THREE + '. Call three.THREE = THREE first.' );

		}
		return _THREE;

	}

}
three = new three();

//появляется сообщение об ошибке если вызвать three.isThree и если _THREE === undefined 
//потому что непонятно почему вызывается three.get
//three.isThree = function(){ return _boThree; }

export default three;