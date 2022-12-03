# Player.

I use <b>Player</b> in my [three.js](https://threejs.org/) projects for 3D objects animation.

# Content
* [Quick start.](#Quickstart)
* [Add trace line of moving of the point during playing.](#AddTrace)
* [Points color.](#PointsColor)
* [Move points position.](#MovePoints)
* [Create <b>THREE.Points</b> with <b>THREE.ShaderMaterial</b>.](#ShaderMaterialPoints)
* [Use <b>MyPoints</b> for create points.](#MyPoints)
* [Add <b>player</b> item into <b>CanvasMenu</b>.](#CanvasMenu)
* [Using <b>dat.gui</b> for manual change of the <b>Player</b> settings.](#datGuiPlayer)
	* [Add player control buttons to the <b>dat.gui</b>.](#datGuiPlayerControl)
	* [Using <b>dat.gui</b> for manual change of the <b>camera</b> settings.](#datGuiCamera)
	* [A <b>dat.gui</b> based graphical user interface for select a point from the mesh.](#guiSelectPoint)
* [Set the camera to look at the point.](#cameraLook)
* [Time of the playing.](#playingTime)
* [Use Raycaster for mouse picking (working out what objects in the 3d space the mouse is over).](#Raycaster)
* [Example of your web page.](#WebPage)
* [Directory Contents.](#DirectoryContents)
* [Building your own Player.](#Building)

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
	<title>Player</title>

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
		- <a href="https://github.com/anhr/commonNodeJS/tree/master/player" target="_blank" rel="noopener">Player</a>.
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

The easiest way to use <b>Player</b> in your code is import <b>Player</b> from <b>Player.js</b> file in your JavaScript module.
[Example](../../../../commonNodeJS/master/player/Examples/index.html).
```
import Player from './commonNodeJS/master/player/player.js';
```
or
```
import Player from './commonNodeJS/master/player/build/player.module.js';
```
or
```
import Player from './commonNodeJS/master/player/build/player.module.min.js';
```

Now you can use <b>Player</b> in your javascript code.

Add <b>Player</b> after creating of the <b>options</b> and before creation of the <b>renderer</b>.
```
new Player( scene, { options: options, } );
```
Currently your player is not doing anything. Please add a 3d object into canvas that you want to play with, for example [Points](https://threejs.org/docs/index.html?q=Points#api/en/objects/Points).
Suppose you want to move a point during playing.
```
const arrayFuncs = [
	new THREE.Vector3(
		new Function( 't', 'a', 'b', 'return Math.sin(t*a*2*Math.PI)*0.5+b' ),//x
		new Function( 't', 'a', 'b', 'return Math.cos(t*a*2*Math.PI)*0.5-b' ),//y
		0.5,//z
	),//First point
	new THREE.Vector3( -0.5, -0.5, -0.5 ),//Second point
];
const points = new THREE.Points( new THREE.BufferGeometry().setFromPoints(
		Player.getPoints( arrayFuncs,{ group: scene, options: options } ),
		Player.getItemSize( arrayFuncs ) ),
	new THREE.PointsMaterial( {

		color: 0xffffff,
		size: 0.2,

	} ) );
scene.add( points );
```
You can see, the <b>X</b> and <b>Y</b> values of the first point of the <b>arrayFuncs</b> is function of the <b>t</b>.

<b>X</b> is <b>sin(t)</b>

<b>Y</b> is <b>cos(t)</b>.

<b>t</b> is current time of the playing.

Default start time <b>t = 0</b>, <b>a = 1</b>, <b>b = 0</b>.

Read about [Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function).

The [Player.getPoints(...)](../../../../commonNodeJS/master/player/jsdoc/module-Player-Player.getPoints.html) in code above
returns an array of the vectors for <b>t = 0</b>.

* Define the <b>points.userData.player</b> object in your code for including of the points into <b>Player</b>.
Include <b>arrayFuncs</b> into <b>points.userData.player</b> object if you want to move points during playing.
```
points.userData.player = {

	arrayFuncs: arrayFuncs,

}
```
* Start playing.
```
options.player.play3DObject();
```
Attention! Please start playing after creation of all 3D objects and after creating of <b>new Player</b> instance, in current example after creating of the points.

Update your web page. Now you can see moving a point on the canvas.

Default, the playing ticks count is 10. You can change it.
Also you can set your ticks per seconds and other setting.
See <b>settings.options.playerOptions</b> parameter of the [Player](module-Player-Player.html) for details.
Please edit <b>options</b> for it.
```
const options = new Options(

	{

		playerOptions: {//create a Player instance. 3D objects animation.

			marks: 100,//Ticks count of the playing.
			interval: 25,//Ticks per seconds.

		},

	}

);
```
<a name="AddTrace"></a>
## Add trace line of moving of the point during playing.
* Edit <b>arrayFuncs</b>
```
const arrayFuncs = [
	{

		vector: new THREE.Vector3(
			new Function( 't', 'a', 'b', 'return Math.sin(t*a*2*Math.PI)*0.5+b' ),//x
			new Function( 't', 'a', 'b', 'return Math.cos(t*a*2*Math.PI)*0.5-b' ),//y
			0.5,//z
		),//First point
		trace: true,//Displays the trace of the first point movement.

	},
	new THREE.Vector3( -0.5, -0.5, -0.5 ),//Second point
];
```
Note. Please add <b>options: options</b> key in the <b>settings</b> parameter
of the new [Player](../../../../commonNodeJS/master/player/jsdoc/module-Player-Player.html) for <b>trace</b> have effect. See above.

You can see, first value of the array is object with

<b>{

	vector: position of the point
	trace: true - displays the trace of the point movement.

}</b>

Now you can see a trace line of the moving of the first point.

<a name="PointsColor"></a>
## Points color.
* In the <b>THREE.PointsMaterial</b> parameters of your <b>points</b> remove the <b>color</b> key and add <b>vertexColors: true</b>.
```
const points = new THREE.Points( new THREE.BufferGeometry().setFromPoints(
		Player.getPoints( arrayFuncs,{ group: scene, options: options } ),
		Player.getItemSize( arrayFuncs ) ),
	new THREE.PointsMaterial( {

		vertexColors: true,
		size: 0.2,

	} ) );
```
* In the first point of the arrayFuncs change vector from <b>THREE.Vector3</b> to <b>THREE.Vector4</b>.
```
const arrayFuncs = [
	{

		vector: new THREE.Vector4(
			new Function( 't', 'a', 'b', 'return Math.sin(t*a*2*Math.PI)*0.5+b' ),//x
			new Function( 't', 'a', 'b', 'return Math.cos(t*a*2*Math.PI)*0.5-b' ),//y
			0.5,//z
			new THREE.Color( "rgb( 0, 255, 0)" )//w is green color
		),//First point
		trace: true,//Displays the trace of the first point movement.

	},
	new THREE.Vector3( -0.5, -0.5, -0.5 ),//Second point
];
```
You can see the <b>w</b> coordinate of the <b>THREE.Vector4</b> is green color.
* Make the point color is function of the time.

Change the <b>w</b> coordinate of the first point to <b>new Function( 't', 'return 1-2*t' )</b>.
```
const arrayFuncs = [
	{

		vector: new THREE.Vector4(
			new Function( 't', 'a', 'b', 'return Math.sin(t*a*2*Math.PI)*0.5+b' ),//x
			new Function( 't', 'a', 'b', 'return Math.cos(t*a*2*Math.PI)*0.5-b' ),//y
			0.5,//z
			new Function( 't', 'return 1-2*t' )//w
		),//First point
		trace: true,//Displays the trace of the first point movement.

	},
	new THREE.Vector3( -0.5, -0.5, -0.5 ),//Second point
];
```
<b>w</b> patameter of the <b>new THREE.Vector4</b> of the <b>vector</b> key of the first point of the <b>arrayFuncs</b>
is index of the [color palette](../../../../commonNodeJS/master/colorpicker/jsdoc/).
Trace of the first point is circle.

First half of the trace is alternation of colors from white to red, then green and blue
because default palette is [ColorPicker.paletteIndexes.BGYW](../../../../commonNodeJS/master/colorpicker/Example/index.html#BGYW) (blue, green, yellow, white) palette.

Last half of the trace is white because default range of the [color palette](https://github.com/anhr/commonNodeJS/tree/master/colorpicker) from 0 to 1
(See [Options.setW(options)](../../../../commonNodeJS/master/jsdoc/Options/Options.html#setW) method for details).
But current range of the <b>1-2 * t</b> function from 1 to -1 for default <b>t</b> range from 0 to 1.
You can resolve this issue by change of the palette range.
Replace <b>w</b> coordinate of the first point from <b>new Function( 't', 'return 1-2*t' )</b> to an object as wrote below.
See <b>arrayFuncs</b> parameter of the [Player.getColors(...)](module-Player-Player.getColors.html) for details.
```
const arrayFuncs = [
	{

		vector: new THREE.Vector4(
			new Function( 't', 'a', 'b', 'return Math.sin(t*a*2*Math.PI)*0.5+b' ),//x
			new Function( 't', 'a', 'b', 'return Math.cos(t*a*2*Math.PI)*0.5-b' ),//y
			0.5,//z
			{

				func: new Function( 't', 'return 1-2*t' ),
				min: -1,
				max: 1,

			},//w
		),//First point
		trace: true,//Displays the trace of the first point movement.

	},
	new THREE.Vector3( -0.5, -0.5, -0.5 ),//Second point
];
```
* Select a [color palette](../../../../commonNodeJS/master/colorpicker/jsdoc/module-ColorPicker-ColorPicker.html#palette).

Default color palette index is [ColorPicker.paletteIndexes.BGYW](../../../../commonNodeJS/master/colorpicker/Example/index.html#BGYW).
You can select another palette. For example [ColorPicker.paletteIndexes.bidirectional](../../../../commonNodeJS/master/colorpicker/Example/index.html#Bidirectional) palette.
Add the <b>palette</b> key of the <b>options</b> for it.

First, import <b>ColorPicker</b>.
```
import ColorPicker from './commonNodeJS/master/colorpicker/colorpicker.js';
```
Then edit <b>options</b>.
```
const options = new Options(

	{

		playerOptions: {//create a Player instance. 3D objects animation.

			marks: 100,//Ticks count of the playing.
			interval: 25,//Ticks per seconds.

		},
		palette: new ColorPicker.palette( { palette: ColorPicker.paletteIndexes.bidirectional } ),

	}

);
```
Now the color of the first point is changing from green to dark and red during playing.

Also you can create your own custom palette.
```
const options = new Options(

	{

		playerOptions: {//create a Player instance. 3D objects animation.

			marks: 100,//Ticks count of the playing.
			interval: 25,//Ticks per seconds.

		},
		palette: new ColorPicker.palette( { palette: [

				{ percent: 0, r: 0xff, g: 255, b: 0xff, },
				{ percent: 10, r: 0, g: 0, b: 0, },
				{ percent: 20, r: 0xff, g: 0, b: 0x0, },
				{ percent: 30, r: 0x0, g: 255, b: 0x0, },
				{ percent: 40, r: 0x0, g: 0, b: 0xff, },
				{ percent: 80, r: 0x0, g: 0, b: 0xff, },
				{ percent: 90, r: 0xff, g: 255, b: 0xff, },

			]
			
		} ),

	}

);
```
* Currently your player use same palette for all meshes.
You can set individual palette for any mesh. Add <b>palette</b> key in the <b>mesh.userData.player</b> for it.
For example [ColorPicker.paletteIndexes.rainbow](../../../../commonNodeJS/master/colorpicker/Example/index.html#rainbow) palette.
```
points.userData.player = {

	arrayFuncs: arrayFuncs,
	palette: new ColorPicker.palette( { palette: ColorPicker.paletteIndexes.rainbow } ),

}
```
<a name="MovePoints"></a>
## Move points position.
* Add <b>selectPlayScene</b> key to the <b>points.userData.player</b> object.
```
points.userData.player = {

	arrayFuncs: arrayFuncs,
	selectPlayScene: function ( t ) {

		points.position.x = 8*t;

	}

}
```
<b>t</b> is current time.

Now all points in your canvas moving to the right.

Also you can scale and rotate any mesh on your canvas. For example.
```
points.rotation.z = - Math.PI * 2 * t;
```
<a name="ShaderMaterialPoints"></a>
## Create THREE.Points with [THREE.ShaderMaterial](https://threejs.org/docs/index.html#api/en/materials/ShaderMaterial) material.
Currently, it seems to you that the size of the first point changes during of the the playing because point moves near or far from camera.
Sometimes you want to see the sizes of the points is not depend from distance to camera.
To do it, please remove your old <b>const points</b> and use <b>getShaderMaterialPoints</b> for creating of new points as described
in [getShaderMaterialPoints API](../../../../commonNodeJS/master/getShaderMaterialPoints/jsdoc/index.html).

First, import <b>getShaderMaterialPoints</b> into your web page.
```
import getShaderMaterialPoints from './commonNodeJS/master/getShaderMaterialPoints/getShaderMaterialPoints.js';
```
Please remove <b>options.player.play3DObject();</b> line and include it into <b>getShaderMaterialPoints</b> parameters.
```
getShaderMaterialPoints( scene, arrayFuncs,
	function ( points ) {

		scene.add( points );
		points.userData.player = {

			arrayFuncs: arrayFuncs,
			selectPlayScene: function ( t ) {

				points.position.x = 8 * t;
				points.rotation.z = - Math.PI * 2 * t;

			}

		}
		options.player.play3DObject();

	},
	{
	
		options: options,

	} );
```
<a name="MyPoints"></a>
## Use MyPoints for create points.

Simplest way of creations of the points is using of the <b>MyPoints</b>.
Please remove your old <b>const points</b> and <b>getShaderMaterialPoints</b> and use [MyPoints](../../myPoints/jsdoc/index.html) for creating of new points.
Import <b>MyPoints</b> into your web page for it.
```
import MyPoints from './commonNodeJS/master/myPoints/myPoints.js';
```
Now you can use <b>MyPoints</b> in your javascript code. Please call <b>MyPoints</b> after creating of <b>renderer</b> for your future code. Example:
```
MyPoints( arrayFuncs, scene, {

	Player: Player,
	options: options,

} );
options.player.play3DObject();
```
Now you can see, first point is moving and changing color.

Currently all <b>MyPoints</b> settings is default.
You can set your own setting for <b>MyPoints</b>. For example set points size to 15 and move all points to right during playing.

Add <b>point</b> key into <b>options</b> above.
```
const options = new Options(

	{

		playerOptions: {//create a Player instance. 3D objects animation.

			marks: 100,//Ticks count of the playing.
			interval: 25,//Ticks per seconds.

		},
		point: { size: 15 },

	}

);
```
Edit <b>MyPoints</b>.
```
MyPoints( arrayFuncs, scene, {

	options: options,
	pointsOptions: {

		position: new THREE.Vector3( new Function( 't', 'return 8 * t' ), 0, 0 ),
		rotation: new THREE.Vector3( 0, 0, new Function( 't', 'return - Math.PI * 2 * t' ) ),

	}

} );
```
If you want to see the sizes of the points is depend from distance to camera,
please add <b>shaderMaterial: false</b> into <b>pointsOptions</b> of the <b>MyPoints</b> for it.
```
MyPoints( arrayFuncs, scene, {

	options: options,
	pointsOptions: {

		position: new THREE.Vector3( new Function( 't', 'return 8 * t' ), 0, 0 ),
		rotation: new THREE.Vector3( 0, 0, new Function( 't', 'return - Math.PI * 2 * t' ) ),
		shaderMaterial: false,

	}

} );
```
ATTENTION!!! Now positions of the points of the first ticks is not valid because you have ran player before creating of the Points.
For resolving of the problem please remove <b>options.player.play3DObject();</b> and include it inside of the <b>MyPoints</b>.
```
MyPoints( arrayFuncs, scene, {

	options: options,
	pointsOptions: {

		position: new THREE.Vector3( new Function( 't', 'return 8 * t' ), 0, 0 ),
		rotation: new THREE.Vector3( 0, 0, new Function( 't', 'return - Math.PI * 2 * t' ) ),
		shaderMaterial: false,
		onReady: function ( points ) {

			options.player.play3DObject();

		}

	}

} );
```

<a name="CanvasMenu"></a>
## Add <b>player</b> item into [CanvasMenu](https://github.com/anhr/commonNodeJS/tree/master/canvasMenu).
```
import CanvasMenu from './commonNodeJS/master/canvasMenu/canvasMenu.js';
```
Create CanvasMenu. Attention!!! Please create <b>CanvasMenu</b> after creating of the render but before <b>renderer.setSize(...)</b>
```
new CanvasMenu( renderer, {

	options: options,

} );
```
Please move mouse over canvas.
Now you can see a player's menu items on the bottom of the canvas.

<a name="datGuiPlayer"></a>
## Using [dat.gui](https://github.com/anhr/dat.gui) for manual change of the <b>Player</b> settings.

Import <b>dat.gui</b>.
```
import { dat } from './commonNodeJS/master/dat/dat.module.js';
three.dat = dat;
```
And call <b>player.gui()</b> after creating of <b>new Player</b> instance.
```
options.player.gui();
```
You can see the "Player" folder in the upper right corner of the canvas.

<a name="datGuiPlayerControl"></a>
### Add [player control](../../player/jsdoc/module-Player-Player_PlayController_PlayController.html) buttons to the [dat.gui](https://github.com/anhr/dat.gui).

```
new options.player.PlayController();
```
You can see the player control in the upper right corner of the canvas.

<a name="datGuiCamera"></a>
### Using [dat.gui](https://github.com/anhr/dat.gui) for manual change of the <b>camera</b> settings.

First, import [CameraGui](../../jsdoc/CameraGui/).
```
import CameraGui from './commonNodeJS/master/CameraGui.js';
```
Add <b>CameraGui</b> after <b>new Player</b>.
```
new CameraGui( camera, options );
```

You can see the "Camera" folder in the upper right corner of the canvas.

<a name="guiSelectPoint"></a>
### A [dat.gui](https://github.com/anhr/dat.gui) based graphical user interface for select a point from the mesh.

* Import [GuiSelectPoint](../../guiSelectPoint/jsdoc/).
```
import GuiSelectPoint from './commonNodeJS/master/guiSelectPoint/guiSelectPoint.js';
```
* Create instance of the <b>GuiSelectPoint</b>.

Note! Create instance of the <b>GuiSelectPoint</b> before all meshes, from which user can to select point and after creating of <b>new Player</b>.
```
new GuiSelectPoint( options );
if ( options.guiSelectPoint ) options.guiSelectPoint.add();
```

You can see the "Meshes" folder in the upper right corner of the canvas.

* If you use <b>const points = new [THREE.Points](https://threejs.org/docs/index.html?q=poin#api/en/objects/Points)</b> for create points,
please add
```
options.guiSelectPoint.addMesh( points );
```
line after <b>scene.add( points );</b> and after creating of <b>new GuiSelectPoint</b> instance.
* If you use [getShaderMaterialPoints](../../getShaderMaterialPoints/jsdoc/module-getShaderMaterialPoints.html) for create points, please 
add <b>options.guiSelectPoint.addMesh( points );</b>
line into <b>onReady</b> callback function of <b>getShaderMaterialPoints</b>.
```
getShaderMaterialPoints( scene, arrayFuncs,
	function ( points ) {

		scene.add( points );
		points.userData.player = {

			arrayFuncs: arrayFuncs,
			selectPlayScene: function ( t ) {

				points.position.x = 8 * t;
				points.rotation.z = - Math.PI * 2 * t;

			}

		}
		options.player.play3DObject();
		options.guiSelectPoint.addMesh( points );

	},
	{
	
		options: options,

	} );
```

* If you are using <b>MyPoints</b>, do nothing to add points to <b>guiSelectPoint</b>.

<a name="cameraLook"></a>
## Set the camera to look at the point.

Now you can see, all points moves and hides on the right border of the canvas during playing. For resolving of issue you can:

* Select the point at which the camera is looking during playing from your program code.
Please, add the <b>cameraTarget</b> key into <b>arrayFuncs</b> array for it.
```
const arrayFuncs = [
	{

		vector: new THREE.Vector4(
			new Function( 't', 'a', 'b', 'return Math.sin(t*a*2*Math.PI)*0.5+b' ),//x
			new Function( 't', 'a', 'b', 'return Math.cos(t*a*2*Math.PI)*0.5-b' ),//y
			0.5,//z
			{

				func: new Function( 't', 'return 1-2*t' ),
				min: -1,
				max: 1,

			},//w
		),//First point
		trace: true,//Displays the trace of the first point movement.

		//Set the camera to look at the first point.
		cameraTarget: { camera: camera, },

	},
	new THREE.Vector3( -0.5, -0.5, -0.5 ),//Second point
];
```
ATTENTION!!! Only one point can have <b>cameraTarget</b> key!
You will receive the 
 
<i>Player.getPoints: duplicate cameraTarget</i>

console warning if two or more points have <b>cameraTarget</b> key.
Then only last point with <b>cameraTarget</b> key will be have an effect.

Currently uses default value of the distance from camera to selected point.
You can change distance from camera to selected point from your program code.
Also you can rotate camera around the point. Please add <b>cameraTarget</b> key into <b>options</b> for it.
```
const options = new Options(

	{

		playerOptions: {//create a Player instance. 3D objects animation.

			marks: 100,//Ticks count of the playing.
			interval: 25,//Ticks per seconds.

		},
		point: { size: 15 },
		cameraTarget: {

	
			//boLook: false,//camera do not look at a selected point during playing.
				//User can change this key if you add the CameraGui into dat.gui
			camera: camera,
			rotation: {

				//rotate camera to 180 degrees
				//angle: Math.PI,

				//Camera rotation is function of the time.
				angle: new Function( 't', 'return 2*t' ),

				/*
				angle: [
					0,//rotation is 0 degrees for time is 0
					Math.PI / 2//rotation is 90 degrees for time is max time
				],
				*/
				/*
				angle: [
					{ t: 0, v: 0 },//rotation is 0 degrees for time is 0
					{ t: 1, v: Math.PI / 2 },//rotation is 90 degrees for time is 1
					{ t: 10, v: Math.PI / 2 },//rotation is 90 degrees for time is 10
					{ t: 11, v: 0 }//rotation is 0 degrees for time is 11 and great.
				],
				*/
				//axis: new THREE.Vector3( 1, 0, 0 ),//Rotate around x axis

			},
			//distanceToCamera: new THREE.Vector3( 0, 0, 5 ),
			distanceToCamera: new THREE.Vector3( 0, 0, new Function( 't', 'return 2 + 4 * t' ) ),
			/*
			distanceToCamera: new THREE.Vector3( 0, 0, [
				{ t: 0, v: 5 },//distance to camera is 5 for time is 0
				{ t: 1, v: 2 },//distance to camera is 2 for time is 1
				{ t: 10, v: 2 },//distance to camera is 2 for time is 10
				{ t: 11, v: 5 }//distance to camera is 5 for time is 11 and great.
			] ),
			*/

		}

	}

);
```
You can set individual setting for selected point. Please add <b>rotation</b>, <b>distanceToCamera</b>, <b>boLook</b> keys into <b>cameraTarget</b> object for selected point
```
const arrayFuncs = [
	{

		vector: new THREE.Vector4(
			new Function( 't', 'a', 'b', 'return Math.sin(t*a*2*Math.PI)*0.5+b' ),//x
			new Function( 't', 'a', 'b', 'return Math.cos(t*a*2*Math.PI)*0.5-b' ),//y
			0.5,//z
			{

				func: new Function( 't', 'return 1-2*t' ),
				min: -1,
				max: 1,

			},//w
		),//First point
		trace: true,//Displays the trace of the first point movement.

		//Set the camera to look at the first point.
		cameraTarget: {

			camera: camera,
			rotation: {

				angle: 0,
				//angle: new Function( 't', 'return 5*t' ),
				//angle: [0, Math.PI / 2],
				//angle: [{ t: 0, v: 0 }, { t: 1, v: Math.PI / 2 }, { t: 10, v: Math.PI / 2 },  { t: 11, v: 0 }],
				//axis: new THREE.Vector3( 1, 0, 0 ),//Rotate around x axis

			},
			distanceToCamera: new THREE.Vector3( 0, 0, [
				{ t: 0, v: 9 },//distance to camera is 9 for time is 0
				{ t: 1, v: 2 },//distance to camera is 2 for time is 1
			] ),

		},

	},
	new THREE.Vector3( -0.5, -0.5, -0.5 ),//Second point
];
```
Individual setting for selected point is more priority before camera settings.

### The user can select the point at which the camera is looking during playing.

* If you do not setted the <b>cameraTarget</b> key into <b>arrayFuncs</b> and did not create a <b>CameraGui</b> instance, please add <b>cameraTarget</b> for the <b>Player</b>.
```
new Player( scene, {

	options: options,
	cameraTarget: { camera: camera, },

} );
```

* Or add <b>cameraTarget</b> key for creating of <b>guiSelectPoint</b> instance.
```
new GuiSelectPoint( options, {

	cameraTarget: { camera: camera, },

} );
```

Please open the "Meshes" folder and select a mesh. Now you can see the "Points" folder.

Please open the "Points" folder and select a point of the mesh. Now you can see the "Look" checkbox.

Selected point will be moves to the center of the canvas if you checked the "Look" checkbox.
In  another words, camera will be look at selected point.

<a name="playingTime"></a>
## Time of the playing.

Default time of the playing limited between 0 and 1.
You can set another time limit. Please add <b>min</b> and <b>max</b> keys into <b>playerOptions</b> key of the <b>new Options</b> for it
```
const options = new Options(

	{

		playerOptions: {//create a Player instance. 3D objects animation.

			min: 0,
			max: 2,
			marks: 100,//Ticks count of the playing.
			interval: 25,//Ticks per seconds.

		},
		point: { size: 15 },
		cameraTarget: {

	
			//boLook: false,//camera do not look at a selected point during playing.
				//User can change this key if you add the CameraGui into dat.gui
			camera: camera,
			rotation: {

				//rotate camera to 180 degrees
				//angle: Math.PI,

				//Camera rotation is function of the time.
				angle: new Function( 't', 'return 2*t' ),

				/*
				angle: [
					0,//rotation is 0 degrees for time is 0
					Math.PI / 2//rotation is 90 degrees for time is max time
				],
				*/
				/*
				angle: [
					{ t: 0, v: 0 },//rotation is 0 degrees for time is 0
					{ t: 1, v: Math.PI / 2 },//rotation is 90 degrees for time is 1
					{ t: 10, v: Math.PI / 2 },//rotation is 90 degrees for time is 10
					{ t: 11, v: 0 }//rotation is 0 degrees for time is 11 and great.
				],
				*/
				//axis: new THREE.Vector3( 1, 0, 0 ),//Rotate around x axis

			},
			//distanceToCamera: new THREE.Vector3( 0, 0, 5 ),
			distanceToCamera: new THREE.Vector3( 0, 0, new Function( 't', 'return 2 + 4 * t' ) ),
			/*
			distanceToCamera: new THREE.Vector3( 0, 0, [
				{ t: 0, v: 5 },//distance to camera is 5 for time is 0
				{ t: 1, v: 2 },//distance to camera is 2 for time is 1
				{ t: 10, v: 2 },//distance to camera is 2 for time is 10
				{ t: 11, v: 5 }//distance to camera is 5 for time is 11 and great.
			] ),
			*/

		}

	}

);
```
Attention!!! Please press the <b>Default</b> button in the <b>Player/Time</b> folder
if you have set the <b>dat.cookie</b> key is not false in the  <b>options</b> parameter of the new <b>Options(...)</b> and want your new <b>Options</b> settings to have an effect.

You can infinity play.
Please edit <b>max: Infinity</b> key in <b>playerOptions</b> key of the <b>new Options</b> for it.
```
const options = new Options(

	{

		playerOptions: {//create a Player instance. 3D objects animation.

			min: 0,
			max: Infinity,
			marks: 100,//Ticks count of the playing.
			interval: 25,//Ticks per seconds.

		},
		point: { size: 15 },
		cameraTarget: {

	
			//boLook: false,//camera do not look at a selected point during playing.
				//User can change this key if you add the CameraGui into dat.gui
			camera: camera,
			rotation: {

				//rotate camera to 180 degrees
				//angle: Math.PI,

				//Camera rotation is function of the time.
				angle: new Function( 't', 'return 2*t' ),

				/*
				angle: [
					0,//rotation is 0 degrees for time is 0
					Math.PI / 2//rotation is 90 degrees for time is max time
				],
				*/
				/*
				angle: [
					{ t: 0, v: 0 },//rotation is 0 degrees for time is 0
					{ t: 1, v: Math.PI / 2 },//rotation is 90 degrees for time is 1
					{ t: 10, v: Math.PI / 2 },//rotation is 90 degrees for time is 10
					{ t: 11, v: 0 }//rotation is 0 degrees for time is 11 and great.
				],
				*/
				//axis: new THREE.Vector3( 1, 0, 0 ),//Rotate around x axis

			},
			//distanceToCamera: new THREE.Vector3( 0, 0, 5 ),
			distanceToCamera: new THREE.Vector3( 0, 0, new Function( 't', 'return 2 + 4 * t' ) ),
			/*
			distanceToCamera: new THREE.Vector3( 0, 0, [
				{ t: 0, v: 5 },//distance to camera is 5 for time is 0
				{ t: 1, v: 2 },//distance to camera is 2 for time is 1
				{ t: 10, v: 2 },//distance to camera is 2 for time is 10
				{ t: 11, v: 5 }//distance to camera is 5 for time is 11 and great.
			] ),
			*/

		}

	}

);
```
Press the <b>Default</b> button again.

Currently, the default playback step is 0.1. You can set another step.
Please add <b>dt</b> key into <b>playerOptions</b> key of the <b>new Options</b> for it.
```
const options = new Options(

	{

		playerOptions: {//create a Player instance. 3D objects animation.

			min: 0,
			max: Infinity,
			dt: 0.01,//Have effect for max: Infinity
			marks: 100,//Ticks count of the playing.
			interval: 25,//Ticks per seconds.

		},
		point: { size: 15 },
		cameraTarget: {

	
			//boLook: false,//camera do not look at a selected point during playing.
				//User can change this key if you add the CameraGui into dat.gui
			camera: camera,
			rotation: {

				//rotate camera to 180 degrees
				//angle: Math.PI,

				//Camera rotation is function of the time.
				angle: new Function( 't', 'return 2*t' ),

				/*
				angle: [
					0,//rotation is 0 degrees for time is 0
					Math.PI / 2//rotation is 90 degrees for time is max time
				],
				*/
				/*
				angle: [
					{ t: 0, v: 0 },//rotation is 0 degrees for time is 0
					{ t: 1, v: Math.PI / 2 },//rotation is 90 degrees for time is 1
					{ t: 10, v: Math.PI / 2 },//rotation is 90 degrees for time is 10
					{ t: 11, v: 0 }//rotation is 0 degrees for time is 11 and great.
				],
				*/
				//axis: new THREE.Vector3( 1, 0, 0 ),//Rotate around x axis

			},
			//distanceToCamera: new THREE.Vector3( 0, 0, 5 ),
			distanceToCamera: new THREE.Vector3( 0, 0, new Function( 't', 'return 2 + 4 * t' ) ),
			/*
			distanceToCamera: new THREE.Vector3( 0, 0, [
				{ t: 0, v: 5 },//distance to camera is 5 for time is 0
				{ t: 1, v: 2 },//distance to camera is 2 for time is 1
				{ t: 10, v: 2 },//distance to camera is 2 for time is 10
				{ t: 11, v: 5 }//distance to camera is 5 for time is 11 and great.
			] ),
			*/

		}

	}

);
```
Press the <b>Default</b> button again.

Note that the step only matters for <b>max: Infinity</b>.

<a name="Raycaster"></a>
## Use [Raycaster](https://threejs.org/docs/index.html#api/en/core/Raycaster) for mouse picking (working out what objects in the 3d space the mouse is over).

Go to [Raycaster](../../AxesHelper/jsdoc/index.html#Raycaster) for details.

<a name="WebPage"></a>
## Example of your web page.
The following code is the result of this tutorial.
```
<!DOCTYPE html>

<html>
<head>
	<title>Player</title>

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
		- <a href="https://github.com/anhr/commonNodeJS/tree/master/player" target="_blank" rel="noopener">Player</a>.
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

		import Player from './commonNodeJS/master/player/player.js';
		//import Player from './commonNodeJS/master/player/build/player.module.js';
		//import Player from './commonNodeJS/master/player/build/player.module.min.js';

		//import ColorPicker from './commonNodeJS/master/colorpicker/colorpicker.js';
		//import getShaderMaterialPoints from './commonNodeJS/master/getShaderMaterialPoints/getShaderMaterialPoints.js';
		import MyPoints from './commonNodeJS/master/myPoints/myPoints.js';
		import CanvasMenu from './commonNodeJS/master/canvasMenu/canvasMenu.js';
		import { dat } from './commonNodeJS/master/dat/dat.module.js';
		three.dat = dat;
		import CameraGui from './commonNodeJS/master/CameraGui.js';
		import GuiSelectPoint from './commonNodeJS/master/guiSelectPoint/guiSelectPoint.js';

		var camera, scene, renderer;

		init();
		animate();

		function init() {

			camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
			camera.position.copy( new THREE.Vector3( 0.4, 0.4, 2 ) );

			scene = new THREE.Scene();

			const options = new Options(

				{

					playerOptions: {//create a Player instance. 3D objects animation.

						min: 0,
						max: 1,//Infinity,
						dt: 0.01,//Have effect for max: Infinity
						marks: 100,//Ticks count of the playing.
						interval: 25,//Ticks per seconds.

					},
					point: { size: 15 },
					cameraTarget: {

	
						//boLook: false,//camera do not look at a selected point during playing.
							//User can change this key if you add the CameraGui into dat.gui
						camera: camera,
						rotation: {

							//rotate camera to 180 degrees
							//angle: Math.PI,

							//Camera rotation is function of the time.
							angle: new Function( 't', 'return 2*t' ),

							/*
							angle: [
								0,//rotation is 0 degrees for time is 0
								Math.PI / 2//rotation is 90 degrees for time is max time
							],
							*/
							/*
							angle: [
								{ t: 0, v: 0 },//rotation is 0 degrees for time is 0
								{ t: 1, v: Math.PI / 2 },//rotation is 90 degrees for time is 1
								{ t: 10, v: Math.PI / 2 },//rotation is 90 degrees for time is 10
								{ t: 11, v: 0 }//rotation is 0 degrees for time is 11 and great.
							],
							*/
							//axis: new THREE.Vector3( 1, 0, 0 ),//Rotate around x axis

						},
						//distanceToCamera: new THREE.Vector3( 0, 0, 5 ),
						distanceToCamera: new THREE.Vector3( 0, 0, new Function( 't', 'return 2 + 4 * t' ) ),
						/*
						distanceToCamera: new THREE.Vector3( 0, 0, [
							{ t: 0, v: 5 },//distance to camera is 5 for time is 0
							{ t: 1, v: 2 },//distance to camera is 2 for time is 1
							{ t: 10, v: 2 },//distance to camera is 2 for time is 10
							{ t: 11, v: 5 }//distance to camera is 5 for time is 11 and great.
						] ),
						*/

					}

				}

			);

			const arrayFuncs = [
				{

					vector: new THREE.Vector4(
						new Function( 't', 'a', 'b', 'return Math.sin(t*a*2*Math.PI)*0.5+b' ),//x
						new Function( 't', 'a', 'b', 'return Math.cos(t*a*2*Math.PI)*0.5-b' ),//y
						0.5,//z
						{

							func: new Function( 't', 'return 1-2*t' ),
							min: -1,
							max: 1,

						},//w
					),//First point
					trace: true,//Displays the trace of the first point movement.

					//Set the camera to look at the first point.
					cameraTarget: {

						camera: camera,
						rotation: {

							angle: 0,
							//angle: new Function( 't', 'return 5*t' ),
							//angle: [0, Math.PI / 2],
							//angle: [{ t: 0, v: 0 }, { t: 1, v: Math.PI / 2 }, { t: 10, v: Math.PI / 2 },  { t: 11, v: 0 }],
							//axis: new THREE.Vector3( 1, 0, 0 ),//Rotate around x axis

						},
						distanceToCamera: new THREE.Vector3( 0, 0, [
							{ t: 0, v: 9 },//distance to camera is 9 for time is 0
							{ t: 1, v: 2 },//distance to camera is 2 for time is 1
						] ),

					},

				},
				new THREE.Vector3( -0.5, -0.5, -0.5 ),//Second point
			];
			/*
			const points = new THREE.Points( new THREE.BufferGeometry().setFromPoints(
					Player.getPoints( arrayFuncs,{ group: scene, options: options } ),
					Player.getItemSize( arrayFuncs ) ),
				new THREE.PointsMaterial( {

					vertexColors: true,
					size: 0.2,

				} ) );
			scene.add( points );
			points.userData.player = {

				arrayFuncs: arrayFuncs,
				selectPlayScene: function ( t ) {

					points.position.x = 8*t;

				}

			}
			*/
			/*
			getShaderMaterialPoints( scene, arrayFuncs,
				function ( points ) {

					scene.add( points );
					points.userData.player = {

						arrayFuncs: arrayFuncs,
						selectPlayScene: function ( t ) {

							points.position.x = 8 * t;
							points.rotation.z = - Math.PI * 2 * t;

						}

					}
					options.player.play3DObject();
					options.guiSelectPoint.addMesh( points );

				},
				{
	
					options: options,

				} );
			*/

			new Player( scene, {

				options: options,
				cameraTarget: { camera: camera, },

			} );

			new GuiSelectPoint( options, {

				cameraTarget: { camera: camera, },

			} );
			if ( options.guiSelectPoint ) options.guiSelectPoint.add();
			//options.guiSelectPoint.addMesh( points );

			new CameraGui( camera, options );

			options.player.gui();
			new options.player.PlayController();
			//options.player.play3DObject();

			renderer = new THREE.WebGLRenderer( {

				antialias: true,
				canvas: document.getElementById( 'canvas' ),

			} );

			options.eventListeners = new Options.raycaster.EventListeners( camera, renderer, { options: options, scene: scene } );
			//options.eventListeners.addParticle( points );

			MyPoints( arrayFuncs, scene, {

				options: options,
				pointsOptions: {

					position: new THREE.Vector3( new Function( 't', 'return 8 * t' ), 0, 0 ),
					rotation: new THREE.Vector3( 0, 0, new Function( 't', 'return - Math.PI * 2 * t' ) ),
					shaderMaterial: false,
					onReady: function ( points ) {

						options.player.play3DObject();

					}

				}

			} );

			new CanvasMenu( renderer, {

				options: options,

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
<a name="DirectoryContents"></a>
## Directory Contents

```
build - Compiled source code.
```

<a name="Building"></a>
## Building your own Player

In the terminal, enter the following:

```
$ npm install
$ npm install uglify-es
$ npm run build
```
