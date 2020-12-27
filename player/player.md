# Player.

I use <b>Player</b> in my [three.js](https://threejs.org/) projects for 3D objects animation.

# Content
* [Quick start.](#Quickstart)
* [Add trace line of moving of the point during playing.](#AddTrace)
* [Point color.](#PointColor)
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
* [Directory Contents.](#DirectoryContents)
* [Building your own Player.](#Building)

<a name="QuickStart"></a>
## Quick start

* Create a folder on your localhost named as [folderName].
* Add your web page into [folderName]. Example:
```
<!DOCTYPE html>

<html>
<head>
	<title>Player</title>
	<link type="text/css" rel="stylesheet" href="https://threejs.org/examples/main.css">
</head>
<body>
	<div id="info">
		<a href="https://threejs.org/" target="_blank" rel="noopener">three.js</a> - Player - 3D objects animation.
	</div>
	<div>
		<canvas id="canvas"></canvas>
	</div>

	<script type="module">

		import * as THREE from 'https://threejs.org/build/three.module.js';
		//import * as THREE from 'https://raw.githack.com/anhr/three.js/dev/build/three.module.js';
		//import * as THREE from 'https://raw.githack.com/anhr/three.js/dev/build/three.module.min.js';
		//import { THREE } from 'https://raw.githack.com/anhr/commonNodeJS/master/three.js';

		var camera, scene, renderer, guiSelectPoint;

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
<a name="ImportPlayer"></a>
The easiest way to use <b>Player</b> in your code is import <b>Player</b> from <b>Player.js</b> file in your JavaScript module.
[Example](https://raw.githack.com/anhr/commonNodeJS/master/player/Examples/index.html).
```
import Player from 'https://raw.githack.com/anhr/commonNodeJS/master/player/player.js';
```
or
```
import Player from 'https://raw.githack.com/anhr/commonNodeJS/master/player/build/player.module.js';
```
or
```
import Player from 'https://raw.githack.com/anhr/commonNodeJS/master/player/build/player.module.min.js';
```
or download [commonNodeJS](https://github.com/anhr/commonNodeJS) repository into your "[folderName]\commonNodeJS\master" folder.
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

Add <b>Player</b>.
```
const player = new Player( THREE, scene );
```
Currently your player is not doing anything. Please add a 3d object into canvas that you want to play with, for example <b>Points</b>:
```
const arrayFuncs = [
	new THREE.Vector3( 0, 0.5, 0.5 ),//First point
	new THREE.Vector3( -0.5, -0.5, -0.5 ),//Second point
];
const points = new THREE.Points( new THREE.BufferGeometry().setFromPoints( arrayFuncs ),
	new THREE.PointsMaterial( {

		color: 0xffffff,
		size: 0.2,

	} ) );
scene.add( points );
```
Suppose you want to move a point during playing. Change your code for this:
* Edit <b>arrayFuncs</b>
```
const arrayFuncs = [
	new THREE.Vector3(
		new Function( 't', 'a', 'b', 'return Math.sin(t*a*2*Math.PI)*0.5+b' ),//x
		new Function( 't', 'a', 'b', 'return Math.cos(t*a*2*Math.PI)*0.5-b' ),//y
		0.5,//z
	),//First point
	new THREE.Vector3( -0.5, -0.5, -0.5 ),//Second point
];
const points = new THREE.Points( new THREE.BufferGeometry().setFromPoints( Player.getPoints( THREE, arrayFuncs,
	{ group: scene } ) ),
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

The [Player.getPoints(...)](https://raw.githack.com/anhr/commonNodeJS/master/player/jsdoc/module-Player.html#~Player.getPoints) in code above
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
player.play3DObject();
```
Attention! Please start playing after creation of all 3D objects, in current example after creating of the points.

Update your web page. Now you can see moving a point on the canvas.

Default, the playing ticks count is 10. You can change it.
Also you can set your ticks per seconds and other setting.
See [Player](module-Player.html) for details.
Please change your <b>Player</b> for it.
```
const player = new Player( THREE, scene, {

		settings: {

			marks: 100,//Ticks count of the playing.
			interval: 25,//Ticks per seconds.

		},

} );
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
You can see, first value of the array is object with

<b>{

	vector: position of the point
	trace: true - displays the trace of the point movement.

}</b>

Now you can see a trace line of the moving of the first point.

<a name="PointColor"></a>
## Point color.
* In the <b>THREE.PointsMaterial</b> parameters of your <b>points</b> remove the <b>color</b> key and add <b>vertexColors: THREE.VertexColors</b>.
```
const points = new THREE.Points( new THREE.BufferGeometry().setFromPoints( Player.getPoints( THREE, arrayFuncs,
	{ group: scene } ) ),
	new THREE.PointsMaterial( {

		vertexColors: THREE.VertexColors,
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

Change the <b>w</b> coordinate of the <b>THREE.Vector4</b> to <b>new Function( 't', 'return 1-2*t' )</b>.
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
<b>w</b> coordinate of the point is index of the [color palette](https://github.com/anhr/commonNodeJS/tree/master/colorpicker).
Now you can see the color of the first point as blue at the begin of playing and white at the end of playing
because default range of the [color palette](https://github.com/anhr/commonNodeJS/tree/master/colorpicker) from 0 to 100.
But current range of the <b>1-2 * t</b> function from 1 to -1 for default <b>t</b> range from 0 to 1.
You can resolve this issue by change of the palette range.
Replace <b>w</b> coordinate of the first point from <b>new Function( 't', 'return 1-2*t' )</b> to an object as wrote below.
See <b>arrayFuncs</b> parameter of the [Player.getColors(...)](module-Player.html#~Player.getColors) for details.
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
* Select a [color palette](https://github.com/anhr/commonNodeJS/tree/master/colorpicker).

Default color palette index is [ColorPicker.paletteIndexes.BGRW](https://raw.githack.com/anhr/commonNodeJS/master/colorpicker/Example/index.html#Bidirectional#BGRW).
You can select another palette. Please import <b>ColorPicker</b> into your web page for it.
```
import ColorPicker from 'https://raw.githack.com/anhr/commonNodeJS/master/colorpicker/colorpicker.js';
```
or download [commonNodeJS](https://github.com/anhr/commonNodeJS) repository into your "[folderName]\commonNodeJS\master" folder.
```
import ColorPicker from './commonNodeJS/master/colorpicker/colorpicker.js';
```
Set THREE for palette.
```
ColorPicker.palette.setTHREE(THREE);
```
Create a palette. For example [ColorPicker.paletteIndexes.bidirectional](https://raw.githack.com/anhr/commonNodeJS/master/colorpicker/Example/index.html#Bidirectional) palette.
```
const palette = new ColorPicker.palette( { palette: ColorPicker.paletteIndexes.bidirectional } );
```
Add new palette in the <b>Player</b>.
```
const selectPlaySceneOptions = { palette: palette, }
const player = new Player( THREE, scene, {

	selectPlaySceneOptions: selectPlaySceneOptions,
	settings: {

		marks: 100,//Ticks count of the playing.
		interval: 25,//Ticks per seconds.

	},

} );
```
Also you can create your own custom palette.
```
const palette = new ColorPicker.palette( { palette: [

	{ percent: 0, r: 0xff, g: 255, b: 0xff, },
	{ percent: 10, r: 0, g: 0, b: 0, },
	{ percent: 20, r: 0xff, g: 0, b: 0x0, },
	{ percent: 30, r: 0x0, g: 255, b: 0x0, },
	{ percent: 40, r: 0x0, g: 0, b: 0xff, },
	{ percent: 80, r: 0x0, g: 0, b: 0xff, },
	{ percent: 90, r: 0xff, g: 255, b: 0xff, },

] } );
```
Currently your player use same palette for all meshes.
You can set individual palette for any mesh. Add <b>palette</b> key in the <b>mesh.userData.player</b> for it.
For example [ColorPicker.paletteIndexes.rainbow](https://raw.githack.com/anhr/commonNodeJS/master/colorpicker/Example/index.html#rainbow) palette.
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
To do it, please remove your old <b>const points</b> and use <b>getShaderMaterialPoints</b> for creating of new points as described in [getShaderMaterialPoints API](https://raw.githack.com/anhr/commonNodeJS/master/getShaderMaterialPoints/jsdoc/index.html).

First, import <b>getShaderMaterialPoints</b> into your web page.
```
import getShaderMaterialPoints from 'https://raw.githack.com/anhr/commonNodeJS/master/getShaderMaterialPoints/getShaderMaterialPoints.js';
```
or download [commonNodeJS](https://github.com/anhr/commonNodeJS) repository into your "[folderName]\commonNodeJS\master" folder.
```
import getShaderMaterialPoints from './commonNodeJS/master/getShaderMaterialPoints/getShaderMaterialPoints.js';
```

ATTENTION!!! Now positions of the points of the first ticks is not valid because you have ran player before creating of the Points.
For resolving of the problem please remove <b>player.play3DObject();</b> and include it inside of the <b>getShaderMaterialPoints</b>.
```
getShaderMaterialPoints( THREE, scene, arrayFuncs,
	function ( points ) {

		scene.add( points );
		points.userData.player = {

			arrayFuncs: arrayFuncs,
			selectPlayScene: function ( t ) {

				points.position.x = t;
				points.rotation.z = - Math.PI * 2 * t;

			}

		}
		player.play3DObject();

	},
	{ Player: Player, } );
```
<a name="MyPoints"></a>
## Use MyPoints for create points.

Please remove your old <b>const points</b> and <b>getShaderMaterialPoints</b> and use [MyPoints](../../myPoints/jsdoc/index.html) for creating of new points.
Import <b>MyPoints</b> into your web page for it.
```
import MyPoints from 'https://raw.githack.com/anhr/commonNodeJS/master/myPoints/myPoints.js';
```
or download [commonNodeJS](https://github.com/anhr/commonNodeJS) repository into your "[folderName]\commonNodeJS\master" folder.
```
import MyPoints from './commonNodeJS/master/myPoints/myPoints.js';
```
Example.
```
MyPoints( THREE, arrayFuncs, scene, {

	Player: Player,

} );
player.play3DObject();
```
Now you can see, first point is moving and changing color.

Currently all <b>MyPoints</b> settings is default.
You can set your own setting for <b>MyPoints</b>. For example set points size to 15 and move all points to right during playing.
```
MyPoints( THREE, arrayFuncs, scene, {

	Player: Player,
	options: {

		point: { size: 15 },

	},
	pointsOptions: {

		position: new THREE.Vector3( new Function( 't', 'return 8 * t' ), 0, 0 ),
		rotation: new THREE.Vector3( 0, 0, new Function( 't', 'return - Math.PI * 2 * t' ) ),

	}

} );
```
If you want to see the sizes of the points is not depend from distance to camera,
please add <b>shaderMaterial: {}</b> into <b>pointsOptions</b> of the <b>MyPoints</b> for it.
```
MyPoints( THREE, arrayFuncs, scene, {

	Player: Player,
	options: {

		point: { size: 15 },

	},
	pointsOptions: {

		position: new THREE.Vector3( new Function( 't', 'return 8 * t' ), 0, 0 ),
		rotation: new THREE.Vector3( 0, 0, new Function( 't', 'return - Math.PI * 2 * t' ) ),
		shaderMaterial: {}

	}

} );
```
ATTENTION!!! Now positions of the points of the first ticks is not valid because you have ran player before creating of the Points.
For resolving of the problem please remove <b>player.play3DObject();</b> and include it inside of the <b>MyPoints</b>.
```
MyPoints( THREE, arrayFuncs, scene, {

	Player: Player,
	options: {

		point: { size: 15 },

	},
	pointsOptions: {

		position: new THREE.Vector3( new Function( 't', 'return 8 * t' ), 0, 0 ),
		rotation: new THREE.Vector3( 0, 0, new Function( 't', 'return - Math.PI * 2 * t' ) ),
		shaderMaterial: {},
		onReady: function () {

			player.play3DObject();

		}

	}

} );
```

<a name="CanvasMenu"></a>
## Add <b>player</b> item into [CanvasMenu](https://github.com/anhr/commonNodeJS/tree/master/canvasMenu).
Import <b>CanvasMenu</b> into your web page for it.
```
import CanvasMenu from 'https://raw.githack.com/anhr/commonNodeJS/master/canvasMenu/canvasMenu.js';
```
or download [commonNodeJS](https://github.com/anhr/commonNodeJS) repository into your "[folderName]\commonNodeJS\master" folder.
```
import CanvasMenu from './commonNodeJS/master/canvasMenu/canvasMenu.js';
```
Create CanvasMenu. Attention!!! Please create <b>CanvasMenu</b> after creating of the render but before <b>renderer.setSize(...)</b>
```
new CanvasMenu( renderer, {

	player: player,

} );
```
Please move mouse over canvas.
Now you can see a player's menu items on the bottom of the canvas.

<a name="datGuiPlayer"></a>
## Using [dat.gui](https://github.com/anhr/dat.gui) for manual change of the <b>Player</b> settings.

Import <b>dat.gui</b>.
```
import { dat } from 'https://raw.githack.com/anhr/commonNodeJS/master/dat/dat.module.js';
```
or download [commonNodeJS](https://github.com/anhr/commonNodeJS) repository into your "[folderName]\commonNodeJS\master" folder.
```
import { dat } from './commonNodeJS/master/dat/dat.module.js';
```
Add <b>Player</b> settings into gui
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
```
player.gui( gui, {

	getLanguageCode: getLanguageCode,
	cookie: cookie,

} );
```

<a name="datGuiPlayerControl"></a>
### Add player control buttons to the [dat.gui](https://github.com/anhr/dat.gui).

First, import <b>controllerPlay</b>.
```
import controllerPlay from 'https://raw.githack.com/anhr/commonNodeJS/master/controllerPlay/controllerPlay.js';
```
or download [commonNodeJS](https://github.com/anhr/commonNodeJS) repository into your "[folderName]\commonNodeJS\master" folder.
```
import controllerPlay from './commonNodeJS/master/controllerPlay/controllerPlay.js';
```
Add player control buttons.
```
controllerPlay.create( player, gui );
```

<a name="datGuiCamera"></a>
### Using [dat.gui](https://github.com/anhr/dat.gui) for manual change of the <b>camera</b> settings.

First, import <b>CameraGui</b>
```
import CameraGui from 'https://raw.githack.com/anhr/commonNodeJS/master/CameraGui.js';
```
or download [commonNodeJS](https://github.com/anhr/commonNodeJS) repository into your "[folderName]\commonNodeJS\master" folder.
```
import CameraGui from './commonNodeJS/master/CameraGui.js';
```
Add <b>CameraGui</b> into gui 
```
new CameraGui( gui, camera, {

	getLanguageCode: getLanguageCode,
	//orbitControls: controls,

} );
```

<a name="guiSelectPoint"></a>
### A [dat.gui](https://github.com/anhr/dat.gui) based graphical user interface for select a point from the mesh.

User can select a point, camera will be look at. Use [GuiSelectPoint](../../guiSelectPoint/jsdoc/index.html) for it.

* Import <b>GuiSelectPoint</b>
```
import { GuiSelectPoint } from 'https://raw.githack.com/anhr/commonNodeJS/master/guiSelectPoint/guiSelectPoint.js';
```
or download [commonNodeJS](https://github.com/anhr/commonNodeJS) repository into your "[folderName]\commonNodeJS\master" folder.
```
import { GuiSelectPoint } from './commonNodeJS/master/guiSelectPoint/guiSelectPoint.js';
```
* Create instance of the <b>GuiSelectPoint</b>.
```
guiSelectPoint = new GuiSelectPoint( THREE, {

	getLanguageCode: getLanguageCode,
	cameraTarget: { camera: camera, },

} );

//Player changes the guiSelectPoint control's values during playing
selectPlaySceneOptions.guiSelectPoint = guiSelectPoint;
```
Note! Set the <b>cameraTarget</b> above if you want to camera can to look at selected by user point.

Note! Create instance of the <b>GuiSelectPoint</b> before all meshes, from which user can to select point.

* Add mesh into <b>guiSelectPoint</b> if you allow to user to select a point of this mesh.
```
guiSelectPoint.addMesh( points );
```
<b>points</b> is instance of the mesh.

<a name="selectMyPoints"></a>
* If you use [MyPoints](../../myPoints/jsdoc/index.html) for create mesh, please add <b>guiSelectPoint.addMesh( points );</b> into <b>onReady</b> of the <b>MyPoints</b>.
```
MyPoints( THREE, arrayFuncs, scene, {

	Player: Player,
	options: {

		point: { size: 15 },

	},
	pointsOptions: {

		position: new THREE.Vector3( new Function( 't', 'return 8 * t' ), 0, 0 ),
		rotation: new THREE.Vector3( 0, 0, new Function( 't', 'return - Math.PI * 2 * t' ) ),
		shaderMaterial: {},
		onReady: function ( points ) {

			player.play3DObject();
			guiSelectPoint.addMesh( points );

		}

	}

} );
```
<a name="getShaderMaterialPoints"></a>
* If you use [getShaderMaterialPoints](../../getShaderMaterialPoints/jsdoc/index.html) for create of the <b>THREE.Points</b> with [THREE.ShaderMaterial](https://threejs.org/docs/index.html#api/en/materials/ShaderMaterial) material,
please add <b>guiSelectPoint.addMesh( points );</b> into <b>onReady</b> parameter of the <b>getShaderMaterialPoints</b>.
```
getShaderMaterialPoints( THREE, scene, arrayFuncs,
	function ( points ) {

		scene.add( points );
		points.userData.player = {

			arrayFuncs: arrayFuncs,
			selectPlayScene: function ( t ) {

				points.position.x = 8 * t;
				points.rotation.z = - Math.PI * 2 * t;

			}

		}
		player.play3DObject();
		guiSelectPoint.addMesh( points );

	},
	{ Player: Player, } );
```

* Add <b>guiSelectPoint</b> into [dat.gui](https://github.com/anhr/dat.gui).
```
guiSelectPoint.add( gui );
```
Now you can see the "Meshes" folder in the [dat.gui](https://github.com/anhr/dat.gui).

Please open the "Meshes" folder and select a mesh. Now you can see the "Points" folder.

Please open the "Points" folder and select a point of the mesh. Now you can see the "Look" checkbox.

Selected point will be moves to the center of the canvas if you checked the "Look" checkbox.
In  another words, camera will be look at selected point.

<a name="cameraLook"></a>
## Set the camera to look at the point.

Now you can see, all points moves and hides on the right border of the canvas during playing.
You can set the camera to look at a selected point during playing for resolving of issue.
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
		cameraTarget: {

			camera: camera,

		},

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
Also you can rotate camera around on the point. Please add <b>cameraTarget</b> object into <b>camera.userData</b> for it.
```
camera.userData.cameraTarget = {

	
	//boLook: false,//camera do not look at a selected point during playing.
		//User can change this key if you add the CameraGui into dat.gui

	Player: Player,
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
	distanceToCamera: new THREE.Vector3( 0, 0, new Function( 't', 'return 2+t' ) ),
	/*
	distanceToCamera: new THREE.Vector3( 0, 0, [
		{ t: 0, v: 5 },//distance to camera is 5 for time is 0
		{ t: 1, v: 2 },//distance to camera is 2 for time is 1
		{ t: 10, v: 2 },//distance to camera is 2 for time is 10
		{ t: 11, v: 5 }//distance to camera is 5 for time is 11 and great.
	] ),
	*/

}
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
				{ t: 0, v: 10 },//distance to camera is 10 for time is 0
				{ t: 1, v: 2 },//distance to camera is 2 for time is 1
			] ),

		},

	},
	new THREE.Vector3( -0.5, -0.5, -0.5 ),//Second point
];
```
Individual setting for selected point is more priority before camera settings.

<a name="playingTime"></a>
## Time of the playing.

Default time of the playing limited between 0 and 1.
You can set another time limit. Please add <b>min</b> and <b>max</b> keys into settings of the <b>new Player</b> for it
```
const player = new Player( THREE, scene, {

	selectPlaySceneOptions: { palette: palette, },
	settings: {

		marks: 100,//Ticks count of the playing.
		interval: 25,//Ticks per seconds.
		min: 0,
		max: 2,

	},

} );
```
Attention!!! Please press the <b>Default</b> button in the <b>Player/Time</b> foder
if you have set the <b>cookie</b> key in the  <b>player.gui(...)</b> function and want your new <b>Player</b> settings to have an effect.

You can infinity play. Please set <b>max: Infinity</b> for it.
```
const player = new Player( THREE, scene, {

	selectPlaySceneOptions: { palette: palette, },
	settings: {

		marks: 100,//Ticks count of the playing.
		interval: 25,//Ticks per seconds.
		min: 0,
		max: Infinity,

	},

} );
```
Press the <b>Default</b> button again.

Currently, the default playback step is 0.1. You can set another step. Please add <b>dt</b> key for it.
```
const player = new Player( THREE, scene, {

	selectPlaySceneOptions: { palette: palette, },
	settings: {

		marks: 100,//Ticks count of the playing.
		interval: 25,//Ticks per seconds.
		min: 0,
		max: Infinity,
		dt: 0.01,//for max: Infinity

	},

} );
```
Press the <b>Default</b> button again.

Note that the step only matters for <b>max: Infinity</b>.

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
