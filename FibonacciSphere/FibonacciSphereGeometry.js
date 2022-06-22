/**
 * @module FibonacciSphereGeometry
 * @description A class for generating sphere geometries by the [Fibonacci]{@link https://en.wikipedia.org/wiki/Fibonacci_number} algorithm.
 * @see [fibonacci-sphere]{@link https://github.com/GDOR-11/fibonacci-sphere}
 * @example [Thanks]{@link https://gdor-11.github.io/fibonacci-sphere/program.html}
 * 
 * @author [Andrej Hristoliubov]{@link https://anhr.github.io/AboutMe/}
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

class FibonacciSphereGeometry {

	/**
	 * A class for generating sphere geometries by the [Fibonacci]{@link https://en.wikipedia.org/wiki/Fibonacci_number} algorithm.
	 * @param {number} radius Sphere radius
	 * @param {number} n Vertices number.
	 */
	constructor( radius = 1, n = 500 ) {

		const THREE = three.THREE;

		this.type = 'FibonacciSphereGeometry';

		const vertices = [], a = Math.PI * ( 1 + Math.sqrt( 5 ) );
			
		//https://github.com/GDOR-11/fibonacci-sphere/blob/main/program.html
		for ( var i = 0; i < n; i++ ) {

			const theta = i * a,
				phi = Math.acos( 1 - 2 * ( i + 0.5 ) / n ),
				x = radius * Math.sin( phi ) * Math.cos( theta ),
				y = radius * Math.sin( phi ) * Math.sin( theta ),
				z = -radius * Math.cos( phi );
			vertices.push( new THREE.Vector3( x, y, z ) );

		}
		return new three.ConvexGeometry( vertices );

	}

	static fromJSON( data ) {

		return new FibonacciSphereGeometry( data.radius, data.n );

	}

}

export default FibonacciSphereGeometry;
