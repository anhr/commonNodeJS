# StereoEffect.

Uses dual [PerspectiveCameras](https://threejs.org/docs/index.html?q=PerspectiveCamera#api/en/cameras/PerspectiveCamera) for [Parallax Barrier](https://en.wikipedia.org/wiki/Parallax_barrier) effects.

# Content
* [Quick start.](#Quickstart)
* [Using dat.gui for change of <b>StereoEffect</b> settings.](#gui)
* [Raycaster.](#Raycaster)
* [Example of your web page.](#WebPage)

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
	<title>StereoEffect</title>

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
		- <a href="https://github.com/anhr/commonNodeJS/tree/master/StereoEffect" target="_blank" rel="noopener">StereoEffect</a>.
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
NOTE. Please include <b>three.THREE = THREE;</b> line into your project before use my [library](https://github.com/anhr/commonNodeJS). See example above.

First, add an object into your scene. For example add two points.

Import [MyPoints](../../../../commonNodeJS/master/myPoints/jsdoc/index.html).
```
import MyPoints from './commonNodeJS/master/myPoints/myPoints.js';
```
Now you can use <b>MyPoints</b> in your javascript code. Please add <b>MyPoints</b> after creating of <b>renderer</b>.
```
MyPoints( [
	[],//first point. Zero position. White color.
	[ 0.5, 0.5, 0.5 ],//second point. White color.
], scene );
```
You can see two white points on your scene.

The easiest way to use <b>StereoEffect</b> in your code is import <b>StereoEffect</b> from <b>StereoEffect.js</b> file in your JavaScript module.
[Example](../../../../commonNodeJS/master/StereoEffect/Examples/).
```
import StereoEffect from './commonNodeJS/master/StereoEffect/StereoEffect.js';
```
Now you can use <b>StereoEffect</b> in your javascript code.
* Add <b>stereoEffect</b> key into <b>options</b> parameter of the [Options](../../../../commonNodeJS/master/jsdoc/Options/index.html).
```
const options = new Options( {

	stereoEffect: {

		spatialMultiplex: StereoEffect.spatialMultiplexsIndexs.SbS,//Side by side stereo effect

} } );
```
Note. You have selected [Side by side](../../../../commonNodeJS/master/StereoEffect/jsdoc/module-StereoEffect-StereoEffect.html#.spatialMultiplexsIndexs) stereo effect mode.

* Create the StereoEffect instance.
```
new StereoEffect( renderer, options );
stereoEffect = options.stereoEffect;
```
* Add code into <b>animate</b> function
```
function animate() {

	requestAnimationFrame( animate );

	if ( !stereoEffect )
		renderer.render( scene, camera );
	else stereoEffect.render( scene, camera );

}
```
Now you can see, canvas was divided to left and right scenes.

<a name="gui"></a>
### Using [dat.gui](https://github.com/anhr/dat.gui) for change of <b>StereoEffect</b> settings.

Import <b>dat.gui</b>.
```
import { dat } from './commonNodeJS/master/dat/dat.module.js';
three.dat = dat;
```
Add <b>StereoEffect</b> setting into gui after ctrating of <b>StereoEffect</b> instance.
```
options.stereoEffect.gui();
```
Now you can see new "Stereo effects" folder in upper right corner of the canvas.

<a name="Raycaster"></a>
### [Raycaster](https://threejs.org/docs/index.html#api/en/core/Raycaster).

Raycasting is used for mouse picking (working out what objects in the 3d space the mouse is over).
* Create [EventListeners](../../../../commonNodeJS/master/jsdoc/Options/Raycaster_EventListeners.html) instance and get default cursor after creating of <b>StereoEffect</b> instance.
```
const eventListeners = new Options.raycaster.EventListeners( camera, renderer, { options: options, scene: scene, } );
//const cursor = renderer.domElement.style.cursor;
```
* Define of the actions for objects in the 3d space the mouse is over.
For example edit the <b>MyPoints</b> so that the cursor is changing to "pointer" of mouse is over point and displays an alert if user click over point.
```
MyPoints( [
		[],//first point. Zero position. White color.
		[ 0.5, 0.5, 0.5 ],//second point. White color.
	], scene, {

	options: {
		raycaster: {

			addParticle: function ( item ) {

				eventListeners.addParticle( item );

			},

		}

	},
	pointsOptions: {

		//shaderMaterial: false,
		raycaster: {
			
			/*
			onIntersection: function ( intersection, mouse ) {

				renderer.domElement.style.cursor = 'pointer';

			},
			onIntersectionOut: function () {

				renderer.domElement.style.cursor = cursor;

			},
			*/
			onMouseDown: function ( intersection ) {

				alert( 'You have clicked over point' );

			},

		}

	}

} );
```
For testing please move cursor over point. Cursor will be changing to 'pointer'.
You can see an alert if you click over point.
<a name="WebPage"></a>
## Example of your web page.
The following code is the result of this tutorial.
```
<!DOCTYPE html>

<html>
<head>
	<title>StereoEffect</title>

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
		- <a href="https://github.com/anhr/commonNodeJS/tree/master/StereoEffect" target="_blank" rel="noopener">StereoEffect</a>.
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
		import MyPoints from './commonNodeJS/master/myPoints/myPoints.js';
		import StereoEffect from './commonNodeJS/master/StereoEffect/StereoEffect.js';
		import { dat } from './commonNodeJS/master/dat/dat.module.js';
		three.dat = dat;

		var camera, scene, renderer, stereoEffect;

		init();
		animate();

		function init() {

			camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
			camera.position.copy( new THREE.Vector3( 0.4, 0.4, 2 ) );

			scene = new THREE.Scene();

			const options = new Options( {

				stereoEffect: {

					spatialMultiplex: StereoEffect.spatialMultiplexsIndexs.SbS,//Side by side stereo effect

			} } );

			renderer = new THREE.WebGLRenderer( {

				antialias: true,
				canvas: document.getElementById( 'canvas' ),

			} );
			
			new StereoEffect( renderer, options );
			stereoEffect = options.stereoEffect;
			options.stereoEffect.gui();

			const eventListeners = new Options.raycaster.EventListeners( camera, renderer, { options: options, scene: scene, } );
			//const cursor = renderer.domElement.style.cursor;

			MyPoints( [
					[],//first point. Zero position. White color.
					[ 0.5, 0.5, 0.5 ],//second point. White color.
				], scene, {

				options: {
					raycaster: {

						addParticle: function ( item ) {

							eventListeners.addParticle( item );

						},

					}

				},
				pointsOptions: {

					//shaderMaterial: false,
					raycaster: {
			
						/*
						onIntersection: function ( intersection, mouse ) {

							renderer.domElement.style.cursor = 'pointer';

						},
						onIntersectionOut: function () {

							renderer.domElement.style.cursor = cursor;

						},
						*/
						onMouseDown: function ( intersection ) {

							alert( 'You have clicked over point' );

						},

					}

				}

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

			if ( !stereoEffect )
				renderer.render( scene, camera );
			else stereoEffect.render( scene, camera );

		}

	</script>
</body>
</html>
```
