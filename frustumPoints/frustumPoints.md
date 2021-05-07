# FrustumPoints.

Array of points, statically fixed in front of the camera.
I use <b>FrustumPoints</b> for displaying of the clouds around points.
[Example](https://raw.githack.com/anhr/commonNodeJS/master/frustumPoints/Examples/index.html).

# Content
* [Quick start.](#Quickstart)
* [CreateFrustumPoints.](#CreateFrustumPoints)
* [Points Settings](#PointsSettings)
* [Using <b>dat.gui</b> for manual change of the <b>FrustumPoints</b> settings.](#datGui)
 
<a name="QuickStart"></a>
## Quick start

* Create a folder on your localhost named as [folderName].
* Download [commonNodeJS](https://github.com/anhr/commonNodeJS) repository into your "[folderName]\commonNodeJS\master" folder.
* Add your web page into [folderName]. Example:
```
<!DOCTYPE html>

<html>
<head>
	<title>FrustumPoints</title>

	<link type="text/css" rel="stylesheet" href="https://raw.githack.com/anhr/three.js/dev/examples/main.css">
	<!--<link type="text/css" rel="stylesheet" href="https://threejs.org/examples/main.css">-->
	<!--<link type="text/css" rel="stylesheet" href="three.js/dev/examples/main.css">-->

	<!-- Three.js Full Screen Issue https://stackoverflow.com/questions/10425310/three-js-full-screen-issue/15633516 -->
	<!--<link type="text/css" rel="stylesheet" href="https://raw.githack.com/anhr/commonNodeJS/master/css/main.css">-->
	<link type="text/css" rel="stylesheet" href="commonNodeJS/master/css/main.css">

</head>
<body>
	<div id="info">
		<a href="https://threejs.org/" target="_blank" rel="noopener">three.js</a> - FrustumPoints - Array of points, statically fixed in front of the camera.
	</div>
	<div>
		<canvas id="canvas"></canvas>
	</div>

	<script type="module">

		//import * as THREE from 'https://threejs.org/build/three.module.js';
		import * as THREE from 'https://raw.githack.com/anhr/three.js/dev/build/three.module.js';
		//import * as THREE from 'https://raw.githack.com/anhr/three.js/dev/build/three.module.min.js';
		//import * as THREE from './three.js/dev/build/three.module.js';

		import three from './commonNodeJS/master/three.js'
		three.THREE = THREE;

		import { OrbitControls } from 'https://threejs.org/examples/jsm/controls/OrbitControls.js';

		var camera, scene, renderer, controls, frustumPoints;

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
NOTE. Please include `three.THREE = THREE;` line into your project before use my [library](https://github.com/anhr/commonNodeJS). See example above.

<a name="CreateFrustumPoints"></a>
## Create FrustumPoints

* The easiest way to use <b>FrustumPoints</b> in your code is import <b>FrustumPoints</b> from <b>FrustumPoints.js</b> file in your JavaScript module.
[Example](https://raw.githack.com/anhr/commonNodeJS/master/frustumPoints/Examples/index.html).
```
import FrustumPoints from './commonNodeJS/master/frustumPoints/frustumPoints.js';
```

* Now you can use <b>FrustumPoints</b> in your javascript code.

```
const canvas = document.getElementById( 'canvas' );

frustumPoints = new FrustumPoints( camera, scene, canvas );
```
Currently your <b>FrustumPoints</b> is not visible. Please add points to highlight the <b>FrustumPoints</b> for visualisation.
A <b>FrustumPoints</b> cloud will be visible around each new point.

* First, include [MyPoints](https://raw.githack.com/anhr/commonNodeJS/master/myPoints/jsdoc/index.html).
```
import MyPoints from './commonNodeJS/master/myPoints/myPoints.js';
```
Now you can use <b>MyPoints</b> for create points. For example:
```
const arrayFuncs = [
	[],//point with zero position and palette index = max = 1 is white color for ColorPicker.paletteIndexes.BGRW. See https://github.com/anhr/commonNodeJS/tree/master/colorpicker
	[
		0.5,//x
		0.5,//y
		0.5,//z
		0.5//w. Palette index. Default range from 0 to 1. See https://github.com/anhr/commonNodeJS/tree/master/colorpicker
	]
];
MyPoints( arrayFuncs, scene, {

		pointsOptions: {

			frustumPoints: frustumPoints,

		}

} );
```
* Next, create <b>frustumPoints</b> after creating of <b>MyPoints</b>, <b>renderer</b> and <b>OrbitControls</b>.
```
frustumPoints.create( renderer, { orbitControls: controls } );
```
* And last, please edit the </b>animate()</b> funtion.
```
function animate() {

	requestAnimationFrame( animate );

	renderer.render( scene, camera );

	if ( frustumPoints !== undefined )
		frustumPoints.animate();

}
```
Now you can see a cloud of the small dots around two points, you have created by <b>MyPoints</b>.
Please move by mouse your points to near of the camera. You can see the cloud around points more details.

<a name="PointsSettings"></a>
## Points Settings

Currently you use default settings of the <b>frustumPoints</b>. You can set you own settings. Plase edit you <b>frustumPoints</b> instance for it.
For example you can to display clouds around each point more details. Please change the following settings:

<b>zCount</b> - the count of layers of the frustum of the camera's field of view.

<b>yCount</b> - The count of vertical points for each z level of the frustum of the camera's field of view.
```
frustumPoints = new FrustumPoints( camera, scene, canvas, {

	optionsShaderMaterial: {

		zCount: 100,
		yCount: 100,

	}
				
} );
```
See [FrustumPoints](FrustumPoints.html) class for details.

NOTE! More details clouds takes huge resources of your GPU. You can see delays of visualization in this case.

<a name="datGui"></a>
## Using <b>dat.gui</b> for manual change of the <b>FrustumPoints</b> settings.

* First, import <b>dat.gui</b>.
```
import { dat } from './commonNodeJS/master/dat/dat.module.js';
```
Add <b>FrustumPoints</b> settings into gui
```
const gui =  new dat.GUI();
player.gui( gui );
```
If you want to localize the gui, please import <b>getLanguageCode</b>.
```
import { getLanguageCode } from 'https://raw.githack.com/anhr/commonNodeJS/master/lang.js';
```
or download [commonNodeJS](https://github.com/anhr/commonNodeJS) repository into your "[folderName]\commonNodeJS\master" folder.
```
import { getLanguageCode } from './commonNodeJS/master/lang.js';
```
and edit <b>player.gui(...)</b>.
```
player.gui( gui, {

	getLanguageCode: getLanguageCode

} );
```
If you want save a custom <b>Player</b> settings to the cookie, please import <b>cookie</b>
```
import cookie from 'https://raw.githack.com/anhr/commonNodeJS/master/cookieNodeJS/cookie.js';
```
or download [commonNodeJS](https://github.com/anhr/commonNodeJS) repository into your "[folderName]\commonNodeJS\master" folder.
```
import cookie from './commonNodeJS/master/cookieNodeJS/cookie.js';
```
and edit <b>player.gui(...)</b>.

