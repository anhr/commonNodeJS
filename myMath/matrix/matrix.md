# Matrix.

A matrix (plural matrices) is a rectangular array or table of numbers, symbols, or expressions, arranged in rows and columns, which is used to represent a mathematical object or a property of such an object.
See [Matrix (mathematics)](https://en.wikipedia.org/wiki/Matrix_(mathematics)).

# Content
* [Quick start.](#Quickstart)
* [Example of your web page.](#WebPage)

<a name="QuickStart"></a>
## Quick start

* Create a folder on your localhost named as [folderName].
	* Download [three.js](https://github.com/anhr/three.js) repository into your "[folderName]\three.js\dev" folder.
	* Download [commonNodeJS](https://github.com/anhr/commonNodeJS) repository into your "[folderName]\commonNodeJS\master" folder.
* Add your web page into [folderName]. Example:
```
<!DOCTYPE html>

<html>
<head>
	<title>Intersections</title>

	<link type="text/css" rel="stylesheet" href="https://threejs.org/examples/main.css">
	<!--<link type="text/css" rel="stylesheet" href="three.js/dev/examples/main.css">-->

	<!-- Three.js Full Screen Issue https://stackoverflow.com/questions/10425310/three-js-full-screen-issue/15633516 -->
	<!--<link type="text/css" rel="stylesheet" href="https://raw.githack.com/anhr/commonNodeJS/master/css/main.css">-->
	<link type="text/css" rel="stylesheet" href="commonNodeJS/master/css/main.css">

	<!--<script src="./three.js/dev/build/three.js"></script>-->
	<!--<script src="./three.js/dev/build/three.min.js"></script>-->
	<!--<script src="https://raw.githack.com/anhr/three.js/dev/build/three.js"></script>-->
	<!--<script src="https://raw.githack.com/anhr/three.js/dev/build/three.min.js"></script>-->
	<!--<script src="https://threejs.org/build/three.js"></script>-->
	<!--<script src="https://threejs.org/build/three.min.js"></script>-->
</head>
<body>
	<script nomodule>alert( 'Fatal error: Your browser do not support modular JavaScript code.' );</script>
	<div id="info">
		<a href="https://threejs.org/" target="_blank" rel="noopener">three.js</a>
		- <a href="https://github.com/anhr/commonNodeJS/tree/master/intersections" target="_blank" rel="noopener">Intersections</a>.
		By <a href="https://github.com/anhr" target="_blank" rel="noopener">anhr</a>
	</div>
	<div>
		<canvas id="canvas"></canvas>
	</div>

	<script type="module">

		import * as THREE from './three.js/dev/build/three.module.js';
		//import * as THREE from 'https://threejs.org/build/three.module.js';
		//import * as THREE from 'https://raw.githack.com/anhr/three.js/dev/build/three.module.js';

		import three from './commonNodeJS/master/three.js'
		three.THREE = THREE;

		import Options from './commonNodeJS/master/Options.js'

		var camera, scene, renderer;

		init();
		animate();

		function init() {

			camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
			camera.position.copy( new THREE.Vector3( 0.4, 0.4, 2 ) );

			scene = new THREE.Scene();

			const options = new Options();

			renderer = new THREE.WebGLRenderer( {

				antialias: true,
				canvas: document.getElementById( 'canvas' ),

			} );
			renderer.setSize( window.innerWidth, window.innerHeight );

			options.createOrbitControls( camera, renderer, scene );

			window.addEventListener( 'resize', onWindowResize, false );

		}
		function onWindowResize() {

			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();

			renderer.setSize( window.innerWidth, window.innerHeight );

		}

		function animate() {

			requestAnimationFrame( animate );

			renderer.render( scene, camera );

		}

	</script>
</body>
</html>
```
NOTE. Please include <b>three.THREE = THREE;</b> line into your project before use my [library](https://github.com/anhr/commonNodeJS). See example above.

The easiest way to use <b>Intersections</b> in your code is import <b>Intersections</b> from <b>Intersections.js</b> file in your JavaScript module.
```
import Intersections from './commonNodeJS/master/Intersections/Intersections.js'
```

Now you can use <b>Intersections</b> in your javascript code for creating of an intersection line for graphic objects.

* First, create a graphical objects, for what you want to see the intersection line. For example plane and dodecahedron.
```
const planeGeom = new THREE.PlaneGeometry( 2, 2 );
const plane = new THREE.Mesh( planeGeom,
	new THREE.MeshBasicMaterial( {

		color: "lightgray",
		opacity: 0.75,
		transparent: true,
		side: THREE.DoubleSide

	} )
);
scene.add( plane );

const objGeom = new THREE.DodecahedronGeometry( 1, 0 );
const obj = new THREE.Mesh( objGeom, new THREE.MeshBasicMaterial( {

	color: "green",
	wireframe: true

} ) );
scene.add( obj );
```

Now you can see, dodecahedron is intersects with plane.

* Create a line of intersection.
```
new Intersections( obj, plane, { scene: scene } );
```

Also you can use <b>new MyThree.Intersections</b> instead of <b>new Intersections</b>. Import <b>MyThree</b> for it.
```
import MyThree from './commonNodeJS/master/myThree/myThree.js';
//import MyThree from './commonNodeJS/master/myThree/build/myThree.module.js';
//import MyThree from './commonNodeJS/master/myThree/build/myThree.module.min.js';
```

<a name="WebPage"></a>
## Example of your web page.
The following code is the result of this tutorial.
```
<!DOCTYPE html>

<html>
<head>
	<title>Intersections</title>

	<link type="text/css" rel="stylesheet" href="https://threejs.org/examples/main.css">
	<!--<link type="text/css" rel="stylesheet" href="three.js/dev/examples/main.css">-->
	<!-- Three.js Full Screen Issue https://stackoverflow.com/questions/10425310/three-js-full-screen-issue/15633516 -->
	<!--<link type="text/css" rel="stylesheet" href="https://raw.githack.com/anhr/commonNodeJS/master/css/main.css">-->
	<link type="text/css" rel="stylesheet" href="commonNodeJS/master/css/main.css">

	<!--<script src="./three.js/dev/build/three.js"></script>-->
	<!--<script src="./three.js/dev/build/three.min.js"></script>-->
	<!--<script src="https://raw.githack.com/anhr/three.js/dev/build/three.js"></script>-->
	<!--<script src="https://raw.githack.com/anhr/three.js/dev/build/three.min.js"></script>-->
	<!--<script src="https://threejs.org/build/three.js"></script>-->
	<!--<script src="https://threejs.org/build/three.min.js"></script>-->
</head>
<body>
	<script nomodule>alert( 'Fatal error: Your browser do not support modular JavaScript code.' );</script>
	<div id="info">
		<a href="https://threejs.org/" target="_blank" rel="noopener">three.js</a>
		- <a href="https://github.com/anhr/commonNodeJS/tree/master/intersections" target="_blank" rel="noopener">Intersections</a>.
		By <a href="https://github.com/anhr" target="_blank" rel="noopener">anhr</a>
	</div>
	<div>
		<canvas id="canvas"></canvas>
	</div>

	<script type="module">

		import * as THREE from './three.js/dev/build/three.module.js';
		//import * as THREE from 'https://threejs.org/build/three.module.js';
		//import * as THREE from 'https://raw.githack.com/anhr/three.js/dev/build/three.module.js';

		import three from './commonNodeJS/master/three.js'
		three.THREE = THREE;

		import Options from './commonNodeJS/master/Options.js'
		import Intersections from './commonNodeJS/master/Intersections/Intersections.js'

		//import MyThree from './commonNodeJS/master/myThree/myThree.js';
		//import MyThree from './commonNodeJS/master/myThree/build/myThree.module.js';
		//import MyThree from './commonNodeJS/master/myThree/build/myThree.module.min.js';

		var camera, scene, renderer;

		init();
		animate();

		function init() {

			camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
			camera.position.copy( new THREE.Vector3( 0.4, 0.4, 2 ) );

			scene = new THREE.Scene();

			const planeGeom = new THREE.PlaneGeometry( 2, 2 );
			const plane = new THREE.Mesh( planeGeom,
				new THREE.MeshBasicMaterial( {

					color: "lightgray",
					opacity: 0.75,
					transparent: true,
					side: THREE.DoubleSide

				} )
			);
			scene.add( plane );

			const objGeom = new THREE.DodecahedronGeometry( 1, 0 );
			const obj = new THREE.Mesh( objGeom, new THREE.MeshBasicMaterial( {

				color: "green",
				wireframe: true

			} ) );
			scene.add( obj );

			new Intersections( obj, plane, { scene: scene } );
			//new MyThree.Intersections( obj, plane, { scene: scene } );

			const options = new Options();

			renderer = new THREE.WebGLRenderer( {

				antialias: true,
				canvas: document.getElementById( 'canvas' ),

			} );
			renderer.setSize( window.innerWidth, window.innerHeight );

			options.createOrbitControls( camera, renderer, scene );

			window.addEventListener( 'resize', onWindowResize, false );

		}
		function onWindowResize() {

			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();

			renderer.setSize( window.innerWidth, window.innerHeight );

		}

		function animate() {

			requestAnimationFrame( animate );

			renderer.render( scene, camera );

		}

	</script>
</body>
</html>
```
