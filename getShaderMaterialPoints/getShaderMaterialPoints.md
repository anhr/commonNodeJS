# getShaderMaterialPoints.

I use <b>getShaderMaterialPoints</b> in my [three.js](https://threejs.org/) projects for create [THREE.Points](https://threejs.org/docs/index.html?q=Poin#api/en/objects/Points) with [THREE.ShaderMaterial](https://threejs.org/docs/index.html#api/en/materials/ShaderMaterial) material.

## Quick start

* Create a folder on your localhost named as [folderName].
	* Download [three.js](https://github.com/anhr/three.js) repository into your "[folderName]\three.js\dev" folder.
	* Download [commonNodeJS](https://github.com/anhr/commonNodeJS) repository into your "[folderName]\commonNodeJS\master" folder.
* Add your web page into [folderName]. Example:
```
<!DOCTYPE html>

<html>
<head>
	<title>getShaderMaterialPoints</title>

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
		- <a href="./commonNodeJS/master/getShaderMaterialPoints/jsdoc/" target="_blank" rel="noopener">getShaderMaterialPoints</a>.
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

			window.addEventListener( 'resize', onWindowResize, false );

			//Orbit controls allow the camera to orbit around a target.
			//https://threejs.org/docs/index.html#examples/en/controls/OrbitControls
			options.createOrbitControls( camera, renderer, scene );

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
The easiest way to use <b>getShaderMaterialPoints</b> in your code is import <b>getShaderMaterialPoints</b> from <b>getShaderMaterialPoints.js</b> file in your JavaScript module.
```
import getShaderMaterialPoints from './commonNodeJS/master/getShaderMaterialPoints/getShaderMaterialPoints.js';
```
Now you can use <b>getShaderMaterialPoints</b> in your javascript code. Example:
```
new getShaderMaterialPoints( scene, [
	[],//first point. Zero position. White color.
	[0.5, 0.5, 0.5],//second point. White color.
], function ( points ) { scene.add( points ); } );
```
<a name="WebPage"></a>
## Example of your web page.
The following code is the result of this tutorial.
```
<!DOCTYPE html>

<html>
<head>
	<title>getShaderMaterialPoints</title>

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
		- <a href="./commonNodeJS/master/getShaderMaterialPoints/jsdoc/" target="_blank" rel="noopener">getShaderMaterialPoints</a>.
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
		import getShaderMaterialPoints from './commonNodeJS/master/getShaderMaterialPoints/getShaderMaterialPoints.js';

		var camera, scene, renderer;

		init();
		animate();

		function init() {

			camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
			camera.position.copy( new THREE.Vector3( 0.4, 0.4, 2 ) );

			scene = new THREE.Scene();

			new getShaderMaterialPoints( scene, [
				[],//first point. Zero position. White color.
				[0.5, 0.5, 0.5],//second point. White color.
			], function ( points ) { scene.add( points ); } );

			const options = new Options();

			renderer = new THREE.WebGLRenderer( {

				antialias: true,
				canvas: document.getElementById( 'canvas' ),

			} );
			renderer.setSize( window.innerWidth, window.innerHeight );

			window.addEventListener( 'resize', onWindowResize, false );

			//Orbit controls allow the camera to orbit around a target.
			//https://threejs.org/docs/index.html#examples/en/controls/OrbitControls
			options.createOrbitControls( camera, renderer, scene );

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
