/**
 * three class for [THREE]{@link https://github.com/anhr/three.js} and [dat.GUI(...)]{@link https://github.com/anhr/dat.gui} variables.
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

var _THREE, _dat;

class Three {

	/**
	 * class for [THREE]{@link https://github.com/anhr/three.js} and [dat]{@link https://github.com/dataarts/dat.gui} instances.
	 * */
	constructor() {}
	/**
	 * set [THREE]{@link https://github.com/anhr/three.js}
	 */
	set THREE( THREE ) {

		if ( _THREE ) {

			if ( !Object.is( THREE, _THREE ) )
				console.error( 'three: duplicate THREE. Please use one instance of the THREE library.' )
			return;

		}
		_THREE = THREE;

	}
	/**
	 * get [THREE]{@link https://github.com/anhr/three.js}
	 */
	get THREE() {

		if ( _THREE === undefined )
			console.error( 'three: invalid _THREE = ' + _THREE + '. Call three.THREE = THREE first.' );
		return _THREE;

	}
	/**
	 * set [dat]{@link https://github.com/dataarts/dat.gui}
	 */
	set dat( dat ) {

		if ( _dat ) {

			if ( !Object.is( dat, _dat ) )
				console.error( 'three: duplicate dat. Please use one instance of the dat library.' )
			return;

		}
		_dat = dat;

	}
	/**
	 * get [dat]{@link https://github.com/dataarts/dat.gui}
	 */
	get dat() {

/*Неверно срабатывает когда dat не импортирован
		if ( _dat === undefined && !boSetDat )
			console.error( 'three: invalid _dat = ' + _dat + '. Call three.dat = dat first.' );
*/			
		return _dat;

	}

}

var three;
window.__myThree__ = window.__myThree__ || {};
if ( window.__myThree__.three ) {

	//сюда попадает если использовать './commonNodeJS/master/player/build/player.module.js'
//	console.error( 'three: duplicate three. Please use one instance of the three class.' );
	three = window.__myThree__.three;

} else {

	three = new Three();
	three.isThree = function(){ return _THREE; }
	window.__myThree__.three = three;

}

export default three;