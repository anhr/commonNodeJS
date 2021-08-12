# MyPoints.

I use <b>MyPoints</b> in my [three.js](https://threejs.org/) projects for create [THREE.Points](https://threejs.org/docs/index.html?q=Poi#api/en/objects/Points).


# Content
* [Quick start.](#Quickstart)
* [Points settings.](#PointsSettings)
* [Raycaster.](#Raycaster)

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
	<title>MyPoints</title>

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
		<a href="https://threejs.org/" target="_blank" rel="noopener">three.js</a> MyPoints.
		- <a href="https://github.com/anhr/commonNodeJS/tree/master/myPoints" target="_blank" rel="noopener">MyPoints</a>.
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

		var camera, scene, renderer;

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
The easiest way to use <b>MyPoints</b> in your code is import MyPoints from myPoints.js file in your JavaScript module.
```
import MyPoints from './commonNodeJS/master/myPoints/myPoints.js';
```
Now you can use <b>MyPoints</b> in your javascript code. Please call <b>MyPoints</b> after creating of <b>renderer</b> for your future code. Example:
```
const arrayFuncs = [
	[],//first point. Zero position. White color.
	[ 0.5, 0.5, 0.5 ],//second point. White color.
];
MyPoints( arrayFuncs, scene );
```
You can see two small white points on your canvas.

<a name="PointsSettings"></a>
### Points settings
Change points size to 25 and point color of the second point to green.
```
const arrayFuncs = [
	[],//first point. Zero position. White color.
	[
		0.5,//x
		0.5,//y
		0.5,//z
		0.5//w - color of the point is green
	]//second point
];
MyPoints( arrayFuncs, scene, {

	options: {

		point: { size: 25 },//new size of all points

	}

} );
```
<b>w</b> coordinate of the second point is index of the color of the [color palette](https://github.com/anhr/commonNodeJS/tree/master/colorpicker).
Currently I use default [ColorPicker.paletteIndexes.BGYW](https://raw.githack.com/anhr/commonNodeJS/master/colorpicker/Example/index.html#BGYW) (blue, green, yellow, white) palette.
0.5 value of <b>w</b> coordinate of the second point is index of the green color for default color palette.
You can select another palette. Please import <b>ColorPicker</b> into your web page for it.
```
import ColorPicker from './commonNodeJS/master/colorpicker/colorpicker.js';
```
Create a palette. For example [ColorPicker.paletteIndexes.bidirectional](https://raw.githack.com/anhr/commonNodeJS/master/colorpicker/Example/index.html#Bidirectional) palette
and add new <b>palette</b> into <b>settings.options</b> parameter of <b>MyPoints</b>
```
MyPoints( arrayFuncs, scene, {

	options: {

		point: { size: 25 },//new size of all points
		palette: new ColorPicker.palette( { palette: ColorPicker.paletteIndexes.bidirectional } ),

	}

} );
```
Default 1 value of <b>w</b> coordinate of the first point is index of the green color for [ColorPicker.paletteIndexes.bidirectional](https://raw.githack.com/anhr/commonNodeJS/master/colorpicker/Example/index.html#Bidirectional) palette.

0.5 value of <b>w</b> coordinate of the second point is index of the dark color for [ColorPicker.paletteIndexes.bidirectional](https://raw.githack.com/anhr/commonNodeJS/master/colorpicker/Example/index.html#Bidirectional) palette.

<a name="Raycaster"></a>
### [Raycaster](https://threejs.org/docs/index.html#api/en/core/Raycaster).

First, import [Options](https://raw.githack.com/anhr/commonNodeJS/master/jsdoc/Options/index.html).
```
import Options from './commonNodeJS/master/Options.js'
```
Add event listener for </b>raycaster</b>.

Note. Please create event listener after creating of <b>camera</b> and <b>renderer</b> and before creating of <b>myPoints</b>.
```
const eventListeners = new Options.raycaster.EventListeners( camera, renderer, {

	scene: scene,

} );
```
Add new <b>raycaster</b> key into <b>settings.options</b> parameter of <b>MyPoints</b>.
```
const cursor = renderer.domElement.style.cursor;
MyPoints( arrayFuncs, scene, {

	options: {
		point: { size: 25 },
		palette: new ColorPicker.palette( { palette: ColorPicker.paletteIndexes.bidirectional } ),
		raycaster: {

			addParticle: function ( item ) {

				eventListeners.addParticle( item );

			},
			onIntersection: function ( intersection, mouse ) {

				renderer.domElement.style.cursor = 'pointer';

			},
			onIntersectionOut: function () {

				renderer.domElement.style.cursor = cursor;

			},
			onMouseDown: function ( intersection ) {

				alert( 'You have clicked over point' );

			},

		}

	},

} );
```
Please move mouse over center of any point. Mouse cursor will change to "pointer".
You can see an alert if you click a point.

Currently you see alert only if user click in the center of the point. You can icrease the click area.
Please add new [threshold](https://threejs.org/docs/#api/en/core/Raycaster.params) key into <b>new Options.raycaster.EventListeners</b> for it.
```
const eventListeners = new Options.raycaster.EventListeners( camera, renderer, {

	threshold: 0.1,
	scene: scene,

} );
```
