# StereoEffect.

Uses dual PerspectiveCameras for [Parallax Barrier](https://en.wikipedia.org/wiki/Parallax_barrier) effects.

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
	<link type="text/css" rel="stylesheet" href="https://raw.githack.com/anhr/commonNodeJS/master/css/main.css">
	<!--<link type="text/css" rel="stylesheet" href="commonNodeJS/master/css/main.css">-->

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
NOTE. Please include <b>three.THREE = THREE;</b> line into your project before use my [library](https://github.com/anhr/commonNodeJS). See example above.

The easiest way to use StereoEffect in your code is import StereoEffect from StereoEffect.js file in your JavaScript module. [Example](https://raw.githack.com/anhr/commonNodeJS/master/StereoEffect/Examples/).
```
import StereoEffect from 'https://raw.githack.com/anhr/commonNodeJS/master/StereoEffect/StereoEffect.js';
```
or 
* Create a folder on your localhost named as [folderName].
* Add your veb page into [folderName]. See [example](https://raw.githack.com/anhr/commonNodeJS/master/StereoEffect/Examples/) web page.

Download [commonNodeJS](https://github.com/anhr/commonNodeJS) repository into your "[folderName]\commonNodeJS\master" folder.
```
import StereoEffect from './commonNodeJS/master/StereoEffect/StereoEffect.js';
```

Now you can use StereoEffect in your javascript code.

* Create the StereoEffect instance.
```
const stereoEffect = new StereoEffect( renderer, {

	spatialMultiplex: StereoEffect.spatialMultiplexsIndexs.SbS,//Side by side stereo effect
	far: camera.far,
	camera: camera,

} );
stereoEffect.setSize( window.innerWidth, window.innerHeight );
```
Add code into animate function
```
function animate() {

	requestAnimationFrame( animate );

	if ( !stereoEffect )
		renderer.render( scene, camera );
	else stereoEffect.render( scene, camera );

}
```
Now you can see, canvas was divided to left and right scenes.
* Using [dat.gui](https://github.com/anhr/dat.gui) for change of the StereoEffect settings.

Import dat.gui.
```
import { dat } from 'https://raw.githack.com/anhr/commonNodeJS/master/dat/dat.module.js';
```
or download [commonNodeJS](https://github.com/anhr/commonNodeJS) repository into your "[folderName]\commonNodeJS\master" folder.
```
import { dat } from './commonNodeJS/master/dat/dat.module.js';
```
Add StereoEffect setting into gui.
```
const gui =  new dat.GUI();
stereoEffect.gui( gui, {

	//getLanguageCode: getLanguageCode,
	//cookie: cookie,//Saves a custom Stereo Effects settings in the cookie

} );
```
If you want to localize the gui, please uncomment
```
getLanguageCode: getLanguageCode,
```
line above and import getLanguageCode.
```
import { getLanguageCode } from 'https://raw.githack.com/anhr/commonNodeJS/master/lang.js';
```
or download [commonNodeJS](https://github.com/anhr/commonNodeJS) repository into your "[folderName]\commonNodeJS\master" folder.
```
import { getLanguageCode } from './commonNodeJS/master/lang.js';
```
If you want save a custom StereoEffect settings to the cookie, please uncomment
```
cookie: cookie,
```
line in the stereoEffect.gui(...) above and import cookie.
```
import cookie from 'https://raw.githack.com/anhr/commonNodeJS/master/cookieNodeJS/cookie.js';
```
or
* Download [commonNodeJS](https://github.com/anhr/commonNodeJS) repository into your "[folderName]\commonNodeJS\master" folder.
```
import cookie from './commonNodeJS/master/cookieNodeJS/cookie.js';
```

* [Raycaster](https://threejs.org/docs/index.html#api/en/core/Raycaster).

Raycasting is used for mouse picking (working out what objects in the 3d space the mouse is over).

Get default cursor
```
const cursor = renderer.domElement.style.cursor;
```
Define of the actions for objects in the 3d space the mouse is over.
```
points.userData.raycaster = {

	onIntersection: function ( intersection ) {

		renderer.domElement.style.cursor = 'pointer';

	},
	onIntersectionOut: function ( ) {

		renderer.domElement.style.cursor = cursor;

	},
	onMouseDown: function ( intersect ) {

		alert( 'You have clicked over point' );

	}

}
```
points - The [Object3D](https://threejs.org/docs/index.html#api/en/core/Object3D) to check for intersection with the ray.

Create the THREE.Raycaster instance.
```
const raycaster = new THREE.Raycaster();

//the precision of the raycaster when intersecting objects, in world units.
//See https://threejs.org/docs/#api/en/core/Raycaster.params.
raycaster.params.Points.threshold = 0.1;

raycaster.setStereoEffect( {

	renderer: renderer,
	camera: camera,
	stereoEffect: stereoEffect,
	onIntersection: function ( intersects, mouse ) {

		var intersection = intersects[0];
		if (
			( intersection.object.userData.raycaster !== undefined )
			&& ( intersection.object.userData.raycaster.onIntersection !== undefined ) ) {

			intersection.object.userData.raycaster.onIntersection( intersection );

		}

	},
	onIntersectionOut: function ( intersects ) { points.userData.raycaster.onIntersectionOut() },
	onMouseDown: function ( intersects ) {

		var intersection = intersects[0];
		if (
			( intersection.object.userData.raycaster !== undefined )
			&& ( intersection.object.userData.raycaster.onMouseDown !== undefined ) ) {

			intersection.object.userData.raycaster.onMouseDown( intersection );

		}

	}

} );
raycaster.stereo.addParticle( points );
```
For testing please move cursor over point. Cursor will be changing to 'pointer'.
You can see an alert if you click over point.

You can use [MyPoints](https://raw.githack.com/anhr/commonNodeJS/master/myPoints/jsdoc/index.html) for [raycasting](https://threejs.org/docs/index.html#api/en/core/Raycaster).
