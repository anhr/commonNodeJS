/**
 * @module FibonacciSphereGeometry
 * @description A class for generating sphere geometries by the [Fibonacci]{@link https://en.wikipedia.org/wiki/Fibonacci_number} algorithm.
 * @see [Flickering in mobile with antialias!]{@link https://discourse.threejs.org/t/flickering-in-mobile-with-antialias/27808}
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

		const raio_esfera = 1,//100,
			vertices = [];
			
		for ( var i = 0; i < n; i++ ) {
			var theta = i * Math.PI * ( 1 + Math.sqrt( 5 ) );
			var phi = Math.acos( 1 - 2 * ( i + 0.5 ) / n )
			var x = raio_esfera * Math.sin( phi ) * Math.cos( theta );
			var y = raio_esfera * Math.sin( phi ) * Math.sin( theta );
			var z = -raio_esfera * Math.cos( phi );
			vertices.push( new THREE.Vector3( x, y, z ) );
		}
		return new three.ConvexGeometry( vertices );

	}

	static fromJSON( data ) {

		return new FibonacciSphereGeometry( data.radius, data.n );

	}

}

export { FibonacciSphereGeometry };
