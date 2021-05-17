# FrustumPoints.

Array of points, statically fixed in front of the camera.
I use <b>FrustumPoints</b> for displaying of the clouds around points.
[Example](https://raw.githack.com/anhr/commonNodeJS/master/frustumPoints/Examples/index.html).

# Content
* [Quick start.](#Quickstart)
* [Create FrustumPoints.](#CreateFrustumPoints)
* [<b>FrustumPoints</b> Settings](#FrustumPointsSettings)
* [Using <b>dat.gui</b> for manual change of the <b>FrustumPoints</b> settings.](#datGui)
* [Add <b>Player</b>.](#Player)
* [Points color.](#PointsColor)
 
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

	<!--<link type="text/css" rel="stylesheet" href="https://raw.githack.com/anhr/three.js/dev/examples/main.css">-->
	<link type="text/css" rel="stylesheet" href="https://threejs.org/examples/main.css">
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

		import * as THREE from 'https://threejs.org/build/three.module.js';
		//import * as THREE from 'https://raw.githack.com/anhr/three.js/dev/build/three.module.js';
		//import * as THREE from 'https://raw.githack.com/anhr/three.js/dev/build/three.module.min.js';
		//import * as THREE from './three.js/dev/build/three.module.js';

		import three from './commonNodeJS/master/three.js'
		three.THREE = THREE;

		import { OrbitControls } from 'https://threejs.org/examples/jsm/controls/OrbitControls.js';
		//import { OrbitControls } from 'https://raw.githack.com/anhr/three.js/dev/examples/jsm/controls/OrbitControls.js';

		var camera, scene, renderer, controls, frustumPoints;

		init();
		animate();

		function init() {

			camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
			camera.position.copy( new THREE.Vector3( 0.4, 0.4, 0.4 ) );

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
[Example](../Examples/index.html).
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
		-0.5,//x
		0,//y
		0,//z
		0//w. Palette index. Default range from 0 to 1. See https://github.com/anhr/commonNodeJS/tree/master/colorpicker
	]
];
MyPoints( arrayFuncs, scene, {

		pointsOptions: {

			frustumPoints: frustumPoints,

		}

} );
```
Now you can see two points on your canvas.

First point have palette index is 1 and white color.

Second point have palette index is 0 and blue color.

If you use [THREE.Points]{@link https://threejs.org/docs/index.html?q=Poin#api/en/objects/Points} for creating of the points, plase call
```
frustumPoints.pushArrayCloud( points );
```
<b>points</b> is instance of the THREE.Points.
* Next, create <b>frustumPoints</b> after creating of <b>MyPoints</b>, <b>renderer</b> and <b>OrbitControls</b>.
```
frustumPoints.create( renderer, { orbitControls: controls } );
```
Now you can see a cloud of the small dots around two points, you have created by <b>MyPoints</b>.
Please move by mouse your points to near of the camera. You can see the cloud around points more details.

<a name="FrustumPointsSettings"></a>
## FrustumPoints Settings

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
## Using dat.gui for manual change of the FrustumPoints settings.

* First, import [dat.gui](https://github.com/dataarts/dat.gui).
```
import { dat } from './commonNodeJS/master/dat/dat.module.js';
```
Add <b>FrustumPoints</b> settings into gui after <b><i>frustumPoints.create( renderer, { orbitControls: controls } );</i></b> line.
```
const gui =  new dat.GUI();
frustumPoints.gui( gui );
```
If you want to localize the gui, please import <b>getLanguageCode</b>.
```
import { getLanguageCode } from './commonNodeJS/master/lang.js';
```
and edit <b>frustumPoints.gui(...)</b>.
```
frustumPoints.gui( gui, {

	getLanguageCode: getLanguageCode,

} );
```
If you want to save a custom <b>FrustumPoints</b> settings to the cookie, please import <b>cookie</b>
```
import cookie from './commonNodeJS/master/cookieNodeJS/cookie.js';
```
and edit the new <b>FrustumPoints(...)</b> instance.
```
frustumPoints = new FrustumPoints( camera, scene, canvas, {

	optionsShaderMaterial: {

		zCount: 100,
		yCount: 100,
		cookie: cookie,

	}

} );
```

<a name="Player"></a>
## Add [Player](https://github.com/anhr/commonNodeJS/tree/master/player).

First, import <b>Player</b>.
```
import Player from './commonNodeJS/master/player/player.js';
```
Add <b>Player</b> after creating of the <b>scene</b> and <b>frustumPoints</b> and before creation of the points and <b>renderer</b>.
```
const player = new Player( scene, {

		frustumPoints: frustumPoints,
		timeSettings: {

			marks: 100,//Ticks count of the playing.
			interval: 25,//Ticks per seconds.

		},

} );
```
Currently your player is not doing anything. Suppose you want to move point during playback. Plase edit <b>arrayFuncs</b> and <b>MyPoints</b> for it.
```
const arrayFuncs = [
	[],//point with zero position and palette index = max = 1 is white color for ColorPicker.paletteIndexes.BGRW. See https://github.com/anhr/commonNodeJS/tree/master/colorpicker
	{

		//move second point from [-0.5, -0.5, -0.5, ] for t = 0 to [0.5, 0.5, 0.5, ] for t = 1
		vector: new THREE.Vector4(
			new Function( 't', 'return t-0.5' ),//x
			0,//new Function( 't', 'return t-0.5' ),//y
			0,//new Function( 't', 'return t-0.5' ),//z
			new Function( 't', 'return t' ),//w palette index from 0 for t = 0 to 1 for t = 1
		),
		trace: true,

	}
];
MyPoints( arrayFuncs, scene, {

		pointsOptions: {

			frustumPoints: frustumPoints,
			//shaderMaterial: false,
			onReady: function ( points ) {

				player.play3DObject();

			}
		},

} );
```
You can see above, the second point is moving from [-0.5, 0, 0] for t = 0 to [0.5, 0, 0] for t = 1. Color of the second point is changing from blue to white.

Player is start playing after creation of the points: <b><i>player.play3DObject();</i></b>

<a name="PointsColor"></a>
## Points color.

* Current [palette](https://github.com/anhr/commonNodeJS/tree/master/colorpicker) of the points colors is default.
Default color palette index is [ColorPicker.paletteIndexes.BGRW](https://raw.githack.com/anhr/commonNodeJS/master/colorpicker/Example/index.html#Bidirectional#BGRW).
You can select another palette. For example [ColorPicker.paletteIndexes.bidirectional](https://raw.githack.com/anhr/commonNodeJS/master/colorpicker/Example/index.html#Bidirectional) palette.
Please import <b>ColorPicker</b>.
```
import ColorPicker from './commonNodeJS/master/colorpicker/colorpicker.js';
```
and edit the new <b>FrustumPoints(...)</b> instance.
```
frustumPoints = new FrustumPoints( camera, scene, canvas, {

	options: { palette: new ColorPicker.palette( { palette: ColorPicker.paletteIndexes.bidirectional } ) },
	optionsShaderMaterial: {

		zCount: 100,
		yCount: 100,
		cookie: cookie,

	}

} );
```
Color of the first point is green.

Color of the second point is changing from red to green.

* Currently you use default range of the palette indexes from 0 to 1. You can set another range. For example from -1 to 1.
Please add a <b>scales</b> key into <b>options</b> parameter of the <b>new FrustumPoints</b> for it.
```
frustumPoints = new FrustumPoints( camera, scene, canvas, {

	options: {

		palette: new ColorPicker.palette( { palette: ColorPicker.paletteIndexes.bidirectional } ),
		scales: {

			w: {

				min: -1,
				max: 1,

			},

		}

	},
	optionsShaderMaterial: {

		zCount: 100,
		yCount: 100,
		cookie: cookie,

	}

} );
```
and change palette index of the second point to -1 is red color.
```
const arrayFuncs = [
	[],//point with zero position and palette index = max = 1 is white color for ColorPicker.paletteIndexes.BGRW. See https://github.com/anhr/commonNodeJS/tree/master/colorpicker
	{

		//move second point from [-0.5, -0.5, -0.5, ] for t = 0 to [0.5, 0.5, 0.5, ] for t = 1
		vector: new THREE.Vector4(
			new Function( 't', 'return t-0.5' ),//x
			0,//new Function( 't', 'return t-0.5' ),//y
			0,//new Function( 't', 'return t-0.5' ),//z
			-1,//new Function( 't', 'return t' ),//w red color for ColorPicker.paletteIndexes.bidirectional and palette index min = -1
		),
		trace: true,

	}
];
```
Now you can see the interference of the clouds color of the first and second points.
Green color of the cloud of the first point is interferencing with red color of  the cloud of the second point.
As result you can see the dark color of the cloud if the second point is come near the first point.
