# AxesHelper.

An axis object to visualize the 1, 2 or 3 axes. I use <b>AxesHelper</b> in my [three.js](https://threejs.org/) projects.

# Content
* [Quick start.](#Quickstart)
* [Use the THREE.OrbitControls to rotate the camera.](#OrbitControls)
* [Use Raycaster for mouse picking (working out what objects in the 3d space the mouse is over).](#Raycaster)
* [Choose a point at which the camera is looking.](#CameraTarget)
* [Graphical user interface for changing settings.](#Gui)
	* [AxesHelper settings.](#AxesHelperGui)
	* [Select a point from the mesh.](#guiSelectPoint)
	* [Move group of meshes.](#MoveGroup)

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
	<title>AxesHelper</title>

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
		- <a href="https://github.com/anhr/commonNodeJS/tree/master/AxesHelper" target="_blank" rel="noopener">AxesHelper</a>.
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

The easiest way to use <b>AxesHelper</b> in your code is import <b>AxesHelper</b> from <b>AxesHelper.js</b> file in your JavaScript module.
[Example](../Examples/index.html).
```
import AxesHelper from './commonNodeJS/master/AxesHelper/AxesHelper.js';
```

Now you can use <b>AxesHelper</b> in your javascript code.

The simplest <b>AxesHelper</b> has at least one axis.
```
new AxesHelper( scene, options );
```

Now we want to create <b>AxesHelper</b> 3 dimensional axes.

Name of the <b>X</b> is 'time'. Number of <b>X</b> scale marks is 5.

Minimum <b>Y</b> is 0.

See <b>options.scales</b> of the [AxesHelper](../../AxesHelper/jsdoc/module-AxesHelper-AxesHelper.html) for details.

Please edit <b>options</b> above for it.
```
const options = new Options({

	scales: {

		text: {

			//Please specify the textHeight if you want the changing of the text height is available in gui.
			//Default textHeight is 0.04
			textHeight: 0.04,

			//fov: camera.fov,

			//Precision of the scale marks is 3 digit.
			//Please specify the precision if you want the changing of the precision is available in gui.
			//Default precision is 4.
			precision: 3,

		},
		x: {
		
			name: 'time',
			marks: 5
		
		},
		y: {
		
			min: 0,
		
		},
		z: {}

	}

});
```

<a name="OrbitControls"></a>
## Use the [THREE.OrbitControls](https://threejs.org/docs/index.html#examples/en/controls/OrbitControls) to rotate the camera.

Add line after creating of the <b>renderer</b> in your code.
```
options.createOrbitControls( camera, renderer, scene );
```

<a name="Raycaster"></a>
## Use [Raycaster](https://threejs.org/docs/index.html#api/en/core/Raycaster) for mouse picking (working out what objects in the 3d space the mouse is over).

Please create an 3D object, for example points.
```
const arrayFuncs = [
	new THREE.Vector3( 0.5, 0.5 ,0.5 ),
	new THREE.Vector3( -0.4, -0.5 ,-0.5 )
]
const points = new THREE.Points( new THREE.BufferGeometry().setFromPoints( arrayFuncs ),
	new THREE.PointsMaterial( {

		color: 0xffffff,
		size: 5,//0.05,
		sizeAttenuation: false,
		alphaTest: 0.5,

	} ) );
scene.add( points );
```
Add [event listeners](../../jsdoc/Options/Raycaster_EventListeners.html) and [add points to particles](../../jsdoc/Options/Raycaster_EventListeners.html#addParticle).
```
options.eventListeners = new Options.raycaster.EventListeners( camera, renderer, { options: options, scene: scene } );
options.eventListeners.addParticle( points );
```
For testing please move cursor over point. Cursor will be changing to 'pointer'.

You can see a dot lines from point to axes if you click over point.
* You can customize the <b>raycaster</b> events. For example you can display an alert message if user has click over point.
```
points.userData.raycaster = {

	onMouseDown: function ( intersection ) {

		alert( 'You have clicked over point.' );
		Options.raycaster.onMouseDown( intersection, options );

	}

}
```
See more details 
<a name="CameraTarget"></a>
## Choose a point at which the camera is looking.

First, import <b>Player</b>.
```
import Player from 'https://raw.githack.com/anhr/commonNodeJS/master/player/player.js';
```
See [Player API](../../player/jsdoc/index.html#ImportPlayer) for details.

Please, add the <b>cameraTarget</b> key into <b>arrayFuncs</b> array and use <b>Player.getPoints</b> for get of the points array for creation of the <b>THREE.Points</b>.
```
const arrayFuncs = [
	new THREE.Vector3( 0.5, 0.5 ,0.5 ),//First point
	{

		vector: new THREE.Vector3( -0.5, -0.5 ,-0.5 ),
		cameraTarget: { camera: camera, },

	}//Second point
]
const points = new THREE.Points( new THREE.BufferGeometry().setFromPoints(
		Player.getPoints( arrayFuncs, { group: scene, } ),
		Player.getItemSize( arrayFuncs ) ),
	new THREE.PointsMaterial( {

		color: 0xffffff,
		size: 5,//0.05,
		sizeAttenuation: false,
		alphaTest: 0.5,

	} ) );
```
Define <b>points.userData.player</b> and call <b>Player.selectMeshPlayScene(...)</b>.
```
points.userData.player = { arrayFuncs: arrayFuncs, }
Player.selectPlayScene( scene );
```
ATTENTION!!! Call <b>Player.selectPlayScene( scene );</b> after creation of the <b>OrbitControls</b> instance.

Now you can see the second point in the center of the canvas. In other words, camera look at the second point.

<a name="Gui"></a>
## Graphical user interface for changing settings.

<a name="AxesHelperGui"></a>
### AxesHelper settings.

Import <b>dat.gui</b>.
```
import { dat } from 'https://raw.githack.com/anhr/commonNodeJS/master/dat/dat.module.js';
```
or download [commonNodeJS](https://github.com/anhr/commonNodeJS) repository into your "[folderName]\commonNodeJS\master" folder.
```
import { dat } from './commonNodeJS/master/dat/dat.module.js';
```
Add <b>dat.dat</b> key into <b>options</b> parameter of the <a href="../../jsdoc/Options/Options.html" target="_blank">Options</a> class;
```
dat: {

	dat: dat,

}
```

Add <b>AxesHelperGui</b> into [dat.gui](https://github.com/anhr/dat.gui) for manual change settings of the <b>AxesHelper</b>.
[Example](../Examples/index.html)
Import <b>AxesHelperGui</b>.
```
import AxesHelperGui from 'https://raw.githack.com/anhr/commonNodeJS/master/AxesHelper/AxesHelperGui.js';
```
or download [commonNodeJS](https://github.com/anhr/commonNodeJS) repository into your "[folderName]\commonNodeJS\master" folder.
```
import AxesHelperGui from './commonNodeJS/master/AxesHelper/AxesHelperGui.js';
```

Now you can use <b>AxesHelperGui</b> in your javascript code.
```
const gui =  new dat.GUI();
AxesHelperGui( axesHelper.options, gui );
```
Now you can see the "Axes Helper" folder in the dat.gui.

* If you want to localize the gui, please uncomment
```
getLanguageCode: getLanguageCode,
```
line above and import <b>getLanguageCode</b>.
```
import { getLanguageCode } from 'https://raw.githack.com/anhr/commonNodeJS/master/lang.js';
```
or download [commonNodeJS](https://github.com/anhr/commonNodeJS) repository into your "[folderName]\commonNodeJS\master" folder.
```
import { getLanguageCode } from './commonNodeJS/master/lang.js';
```
* If you want save a custom <b>AxesHelper</b> settings to the cookie, please uncomment
```
cookie: cookie,
```
line in the <b>SpriteTextGui.gui(...)</b> above and import cookie.
```
import cookie from 'https://raw.githack.com/anhr/commonNodeJS/master/cookieNodeJS/cookie.js';
```
or download [commonNodeJS](https://github.com/anhr/commonNodeJS) repository into your "[folderName]\commonNodeJS\master" folder.
```
import cookie from './commonNodeJS/master/cookieNodeJS/cookie.js';
```

<a name="guiSelectPoint"></a>
### Select a point from the mesh.

Add [guiSelectPoint](../../guiSelectPoint/jsdoc/index.html) into [dat.gui](https://github.com/anhr/dat.gui) for select a point from the mesh.

<a name="MoveGroup"></a>
### Move a group of meshes.
Sometimes you need to move a group of meshes for better visualization. Use [MoveGroupGui](../../jsdoc/MoveGroupGui) for it.

Import <b>MoveGroupGui</b>.
```
import MoveGroupGui from 'https://raw.githack.com/anhr/commonNodeJS/master/MoveGroupGui.js';
```
or download [commonNodeJS](https://github.com/anhr/commonNodeJS) repository into your "[folderName]\commonNodeJS\master" folder.
```
import MoveGroupGui from './commonNodeJS/master/MoveGroupGui.js';
```
Create the <b>MoveGroupGui</b> instance.
```
new MoveGroupGui( scene, axesHelper.options, { folder: gui, } );
```
Now you can see the 'Move points' folder in the dat.gui.
You can move, scale and rotate the scene. Unfortunately, you also move the axes.
For resolving of the issue, create <b>groupMove</b> and move all your meshes from scene to <b>groupMove</b>.
```
const groupMove = new THREE.Group();
scene.add( groupMove );

//Remove points from scene
//scene.add( points );

groupMove.add( points );
```
Move <b>groupMove</b> instead of the <b>scene</b>. Replace <b>scene</b> to <b>groupMove</b> in the <b>new MoveGroup</b>
```
new MoveGroupGui( groupMove, axesHelper.options, { folder: gui, } );
```

Enjoy my code :)
