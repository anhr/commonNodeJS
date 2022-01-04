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
	<title>FrustumPoints</title>

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
		- <a href="./commonNodeJS/master/frustumPoints/jsdoc/index.html" target="_blank" rel="noopener">FrustumPoints</a>.
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
			camera.position.copy( new THREE.Vector3( 0, 0, 0.4 ) );

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

<a name="CreateFrustumPoints"></a>
## Create FrustumPoints

* The easiest way to use <b>FrustumPoints</b> in your code is import <b>FrustumPoints</b> from <b>FrustumPoints.js</b> file in your JavaScript module.
[Example](../Examples/index.html).
```
import FrustumPoints from './commonNodeJS/master/frustumPoints/frustumPoints.js';
```
Add <b>frustumPoints</b> key to the <b>options</b> parameter of [Options](../../jsdoc/Options/Options.html).
```
const options = new Options( {

	frustumPoints: {},

} );
```

* Now you can use <b>FrustumPoints</b> in your javascript code.

```
const canvas = document.getElementById( 'canvas' );
new FrustumPoints( camera, scene, canvas, { options: options, } );
```
Currently your <b>FrustumPoints</b> is not visible. Please add points to highlight the <b>FrustumPoints</b> for visualisation.
A <b>FrustumPoints</b> cloud will be visible around each new point.

* First, include [MyPoints](https://raw.githack.com/anhr/commonNodeJS/master/myPoints/jsdoc/index.html).
```
import MyPoints from './commonNodeJS/master/myPoints/myPoints.js';
```
Add <b>MyPoints</b> after creating of <b>FrustumPoints</b> instance for create of points. For example:
```
const arrayFuncs = [
	[],//point with zero position and palette index = max = 1 is white color for ColorPicker.paletteIndexes.BGYW. See https://github.com/anhr/commonNodeJS/tree/master/colorpicker
	[
		-0.5,//x
		0,//y
		0,//z
		0//w. Palette index. Default range from 0 to 1. See https://github.com/anhr/commonNodeJS/tree/master/colorpicker
	]
];
MyPoints( arrayFuncs, scene, { pointsOptions: { frustumPoints: options.frustumPoints, } } );
```
Now you can see two points on your canvas.

First point have palette index is 1 and white color.

Second point have palette index is 0 and blue color.

If you use [THREE.Points]{@link https://threejs.org/docs/index.html?q=Poin#api/en/objects/Points} for creating of the points, plase call
```
options.frustumPoints.pushArrayCloud( points );
```
<b>points</b> is instance of the THREE.Points.
* Next, create <b>frustumPoints</b> after creating of <b>MyPoints</b>, <b>renderer</b> and <b>options.createOrbitControls( camera, renderer, scene );</b>.
```
options.frustumPoints.create( renderer );
```
Now you can see a cloud of the small dots around two points, you have created by <b>MyPoints</b>.
Please move by mouse your points to near of the camera. You can see the cloud around points more details.

<a name="FrustumPointsSettings"></a>
## FrustumPoints Settings

Currently you use default settings of the <b>frustumPoints</b>. You can set you own settings.
Plase edit <b>frustumPoints</b> key of the <b>options</b> for it.
For example you can to display clouds around each point more details. Please change the following settings:

<b>zCount</b> - the count of layers of the frustum of the camera's field of view.

<b>yCount</b> - The count of vertical points for each z level of the frustum of the camera's field of view.
```
const options = new Options( {

	frustumPoints: {

		zCount: 100,
		yCount: 100,

	},

} );
```
See <b>settings.options.frustumPoints</b> parameter of [FrustumPoints](FrustumPoints.html) class for details.

NOTE! More details clouds takes huge resources of your GPU. You can see delays of visualization in this case.

<a name="datGui"></a>
## Using dat.gui for manual change of the FrustumPoints settings.

First, import [dat.gui](https://github.com/anhr/dat.gui).
```
import { dat } from './commonNodeJS/master/dat/dat.module.js';
three.dat = dat;
```
Add <b>FrustumPoints</b> settings into gui after <b><i>options.frustumPoints.create( renderer );</i></b> line.
```
options.frustumPoints.gui();
```
<a name="Player"></a>
## Add [Player](https://github.com/anhr/commonNodeJS/tree/master/player).

First, import <b>Player</b>.
```
import Player from './commonNodeJS/master/player/player.js';
```
Add <b>playerOptions</b> key to the <b>Options</b> parameter. See <b>settings.options.playerOptions</b> of the [Player](../../player/jsdoc/module-Player-Player.html) for details.
```
const options = new Options( {

	frustumPoints: {

		zCount: 100,
		yCount: 100,

	},
	playerOptions: {

		marks: 100,//Ticks count of the playing.
		interval: 25,//Ticks per seconds.

	},

} );
```
Add <b>Player</b> after creating of the <b>scene</b> and <b>frustumPoints</b> and before creation of the points and <b>renderer</b>.
```
new Player( scene, { options: options, } );
```
Currently your player is not doing anything. Suppose you want to move point during playback. Plase edit <b>arrayFuncs</b> and <b>MyPoints</b> for it.
```
const arrayFuncs = [
	[],//point with zero position and palette index = max = 1 is white color for ColorPicker.paletteIndexes.BGYW. See https://github.com/anhr/commonNodeJS/tree/master/colorpicker
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

			frustumPoints: options.frustumPoints,
			//shaderMaterial: false,
			onReady: function ( points ) {

				options.player.play3DObject();

			}
		},

} );
```
You can see above, the second point is moving from [-0.5, 0, 0] for t = 0 to [0.5, 0, 0] for t = 1. Color of the second point is changing from blue to white.

Player is start playing after creation of the points: <b><i>options.player.play3DObject();</i></b>. See <b>onReady</b> callback above.

<a name="PointsColor"></a>
## Points color.

* Current [palette](https://github.com/anhr/commonNodeJS/tree/master/colorpicker) of the points colors is default.
Default color palette index is [ColorPicker.paletteIndexes.BGYW](https://raw.githack.com/anhr/commonNodeJS/master/colorpicker/Example/index.html#Bidirectional#BGYW).
You can select another palette. For example [ColorPicker.paletteIndexes.bidirectional](https://raw.githack.com/anhr/commonNodeJS/master/colorpicker/Example/index.html#Bidirectional) palette.
Please import <b>ColorPicker</b>.
```
import ColorPicker from './commonNodeJS/master/colorpicker/colorpicker.js';
```
and add <b>palette</b> key to <b>Options</b>.
```
const options = new Options( {

	palette: new ColorPicker.palette( { palette: ColorPicker.paletteIndexes.bidirectional } ),
	frustumPoints: {

		zCount: 100,
		yCount: 100,

	},
	playerOptions: {

		marks: 100,//Ticks count of the playing.
		interval: 25,//Ticks per seconds.

	},

} );
```
Color of the first point is green.

Color of the second point is changing from red to green during playing.

* Currently you use default range of the palette indexes from 0 to 1. You can set another range. For example from -1 to 1.
Please add a <b>scales</b> key into <b>Options</b> parameter for it.
```
const options = new Options( {

	palette: new ColorPicker.palette( { palette: ColorPicker.paletteIndexes.bidirectional } ),
	frustumPoints: {

		zCount: 100,
		yCount: 100,

	},
	playerOptions: {

		marks: 100,//Ticks count of the playing.
		interval: 25,//Ticks per seconds.

	},
	scales: {

		w: {

			min: -1,
			max: 1,

		},

	}

} );
```
and change palette index of the second point to -1 is red color.
```
const arrayFuncs = [
	[],//point with zero position and palette index = max = 1 is white color for ColorPicker.paletteIndexes.BGYW. See https://github.com/anhr/commonNodeJS/tree/master/colorpicker
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
<a name="WebPage"></a>
## Example of your web page.
The following code is the result of this tutorial.
```
<!DOCTYPE html>

<html>
<head>
	<title>FrustumPoints</title>

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
		- <a href="./commonNodeJS/master/frustumPoints/jsdoc/index.html" target="_blank" rel="noopener">FrustumPoints</a>.
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
		import FrustumPoints from './commonNodeJS/master/frustumPoints/frustumPoints.js';
		import MyPoints from './commonNodeJS/master/myPoints/myPoints.js';
		import { dat } from './commonNodeJS/master/dat/dat.module.js';
		three.dat = dat;
		import Player from './commonNodeJS/master/player/player.js';
		import ColorPicker from './commonNodeJS/master/colorpicker/colorpicker.js';

		var camera, scene, renderer, stereoEffect;

		init();
		animate();

		function init() {

			camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
			camera.position.copy( new THREE.Vector3( 0, 0, 0.4 ) );

			scene = new THREE.Scene();

			const options = new Options( {

				palette: new ColorPicker.palette( { palette: ColorPicker.paletteIndexes.bidirectional } ),
				frustumPoints: {

					zCount: 100,
					yCount: 100,

				},
				playerOptions: {

					marks: 100,//Ticks count of the playing.
					interval: 25,//Ticks per seconds.

				},
				scales: {

					w: {

						min: -1,
						max: 1,

					},

				}

			} );

			const canvas = document.getElementById( 'canvas' );

			new FrustumPoints( camera, scene, canvas, { options: options, } );

			new Player( scene, { options: options, } );

			const arrayFuncs = [
				[],//point with zero position and palette index = max = 1 is white color for ColorPicker.paletteIndexes.BGYW. See https://github.com/anhr/commonNodeJS/tree/master/colorpicker
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
			MyPoints( arrayFuncs, scene, {

					pointsOptions: {

						frustumPoints: options.frustumPoints,
						//shaderMaterial: false,
						onReady: function ( points ) {

							options.player.play3DObject();

						}
					},

			} );

			renderer = new THREE.WebGLRenderer( {

				antialias: true,
				canvas: document.getElementById( 'canvas' ),

			} );
			renderer.setSize( window.innerWidth, window.innerHeight );

			window.addEventListener( 'resize', onWindowResize, false );

			//Orbit controls allow the camera to orbit around a target.
			//https://threejs.org/docs/index.html#examples/en/controls/OrbitControls
			options.createOrbitControls( camera, renderer, scene );

			options.frustumPoints.create( renderer );
			options.frustumPoints.gui();

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
