# FrustumPoints.

Array of points, statically fixed in front of the camera.
I use <b>FrustumPoints</b> for displaying of the clouds around points.
[Example](https://raw.githack.com/anhr/commonNodeJS/master/frustumPoints/Examples/index.html).

# Content
* [Quick start.](#Quickstart)
 
<a name="QuickStart"></a>
## Quick start

* Create a folder on your localhost named as [folderName].
* Add your web page into [folderName]. Example:
```
<!DOCTYPE html>

<html>
<head>
	<title>FrustumPoints</title>

	<link type="text/css" rel="stylesheet" href="https://threejs.org/examples/main.css">
	<!--<link type="text/css" rel="stylesheet" href="three.js/dev/examples/main.css">-->

	<!-- Three.js Full Screen Issue https://stackoverflow.com/questions/10425310/three-js-full-screen-issue/15633516 -->
	<link type="text/css" rel="stylesheet" href="https://raw.githack.com/anhr/commonNodeJS/master/css/main.css">
	<!--<link type="text/css" rel="stylesheet" href="commonNodeJS/master/css/main.css">-->

</head>
<body>
	<div id="info">
		<a href="https://threejs.org/" target="_blank" rel="noopener">three.js</a> - FrustumPoints - Array of points, statically fixed in front of the camera.
	</div>
	<div>
		<canvas id="canvas"></canvas>
	</div>

	<script type="module">

		import * as THREE from 'https://threejs.org/build/three.module.js';
		//import * as THREE from 'https://raw.githack.com/anhr/three.js/dev/build/three.module.js';
		//import * as THREE from 'https://raw.githack.com/anhr/three.js/dev/build/three.module.min.js';
		//import * as THREE from './three.js/dev/build/three.module.js';

		import { OrbitControls } from 'https://threejs.org/examples/jsm/controls/OrbitControls.js';
		//import { OrbitControls } from 'https://raw.githack.com/anhr/three.js/dev/examples/jsm/controls/OrbitControls.js';

		var camera, scene, renderer, controls;

		init();
		animate();

		function init() {

			camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
			camera.position.copy( new THREE.Vector3( 0.4, 0.4, 2 ) );

			scene = new THREE.Scene();

			renderer = new THREE.WebGLRenderer( {

				antialias: true,
				canvas: document.getElementById( 'canvas' ),

			} );
			renderer.setSize( window.innerWidth, window.innerHeight );

			controls = new OrbitControls( camera, renderer.domElement );
			controls.target.set( 0, 0, 0 );
			controls.saveState();//For reset of the orbitControls settings in the CameraGui and OrbitControlsGui
			controls.update();

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
<a name="ImportFrustumPoints"></a>
The easiest way to use <b>FrustumPoints</b> in your code is import <b>FrustumPoints</b> from <b>FrustumPoints.js</b> file in your JavaScript module.
[Example](https://raw.githack.com/anhr/commonNodeJS/master/frustumPoints/Examples/index.html).
```
import FrustumPoints from 'https://raw.githack.com/anhr/commonNodeJS/master/frustumPoints/frustumPoints.js';
```
or download [commonNodeJS](https://github.com/anhr/commonNodeJS) repository into your "[folderName]\commonNodeJS\master" folder.
```
import FrustumPoints from '../frustumPoints/frustumPoints.js';
```

Now you can use <b>FrustumPoints</b> in your javascript code.
