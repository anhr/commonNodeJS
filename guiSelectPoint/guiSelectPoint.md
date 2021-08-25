# GuiSelectPoint.

Add <b>GuiSelectPoint</b> into [dat.gui](https://github.com/anhr/dat.gui) for select a point from the mesh.
[Example](../../AxesHelper/Examples/index.html).

<a name="Quickstart"></a>
## Quick start

* Create a folder on your localhost named as [folderName].
	* Download [three.js](https://github.com/anhr/three.js) repository into your "[folderName]\three.js\dev" folder.
	* Download [commonNodeJS](https://github.com/anhr/commonNodeJS) repository into your "[folderName]\commonNodeJS\master" folder.
* Add your web page into [folderName]. Example:
```
<!DOCTYPE html>

<html>
<head>
	<title>GuiSelectPoint</title>

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
		- <a href="./commonNodeJS/master/guiSelectPoint/jsdoc/" target="_blank" rel="noopener">GuiSelectPoint</a>.
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

		var camera, scene, renderer, stereoEffect;

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
The easiest way to use <b>GuiSelectPoint</b> in your code is import <b>dat</b> and import <b>GuiSelectPoint</b> from <b>guiSelectPoint.js</b> file in your JavaScript module.
```
import { dat } from './commonNodeJS/master/dat/dat.module.js';
three.dat = dat;
import GuiSelectPoint from './commonNodeJS/master/guiSelectPoint/guiSelectPoint.js';
```
Now you can use <b>GuiSelectPoint</b> in your javascript code.
```
new GuiSelectPoint( options );
options.guiSelectPoint.add();
```
Now you can see new "Meshes" folder in upper right corner of the canvas.

Currently the "Select" dropdown menu is empty. Please create an object on your canvas after creating of <b>GuiSelectPoint</b>
and call <b>options.guiSelectPoint.addMesh( points );</b> for add it into <b>GuiSelectPoint</b>.
For example, create two points.
```
const points = new THREE.Points( new THREE.BufferGeometry().setFromPoints( [
		new THREE.Vector3( -0.5, 0.5, 0.5 ),
		new THREE.Vector3( -0.5, -0.5, -0.5 )
	] ),
	new THREE.PointsMaterial( {

		color: 0xffffff,
		size: 5,
		sizeAttenuation: false,
		alphaTest: 0.5,

	} ) );
points.name = 'THREE.Points';
scene.add( points );
options.guiSelectPoint.addMesh( points );
```
Simplest way of creating of the points is use [MyPoints](../../../../commonNodeJS/master/myPoints/jsdoc/index.html).

Import </b>MyPoints</b>.
```
import MyPoints from './commonNodeJS/master/myPoints/myPoints.js';
```
Add <b>MyPoints</b> after creating of <b>GuiSelectPoint</b>.
```
MyPoints( [
	[],//first point. Zero position. White color.
	[0.5, 0.5, 0.5],//second point. White color.
], scene, {

	options: options,
	pointsOptions: { name: 'MyPoints' },

} );
```
