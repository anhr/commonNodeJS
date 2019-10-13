/**
 * Remove all child objects of the object and call dispose on their geometry, material and texture.
 * 
 * Thanks to https://stackoverflow.com/a/48768960/5175935
 *
 * @author Andrej Hristoliubov https://anhr.github.io/AboutMe/
 * @author 欧阳维杰 https://stackoverflow.com/users/6045817/%e6%ac%a7%e9%98%b3%e7%bb%b4%e6%9d%b0
 *
 * @copyright 2011 Data Arts Team, Google Creative Lab
 *
 * @license under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */
function clearThree( obj ) {
	while ( obj.children.length > 0 ) {
		clearThree( obj.children[0] )
		obj.remove( obj.children[0] );
	}
	if ( obj.geometry ) obj.geometry.dispose()

	if ( obj.material ) {
		//in case of map, bumpMap, normalMap, envMap ...
		Object.keys( obj.material ).forEach( prop => {

			if ( obj.material[prop] !== null && typeof obj.material[prop].dispose === 'function' )
				obj.material[prop].dispose()

		} )
		obj.material.dispose()
	}
}
export default clearThree;
