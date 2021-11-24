# FibonacciSphereGeometry.

A class for generating sphere geometries by the [Fibonacci]{@link https://en.wikipedia.org/wiki/Fibonacci_number} algorithm.

Example of using.
```
import FibonacciSphereGeometry from 'FibonacciSphereGeometry.js'
const geometry = new FibonacciSphereGeometry( 1, 320 );
const sphere = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( {

	color: "green",
	wireframe: true

} ) );
scene.add( sphere );
```
