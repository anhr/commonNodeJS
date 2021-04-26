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
* Add your web page into [folderName]. Example:
```
<!DOCTYPE html>

<html>
<head>
	<title>AxesHelper</title>

	<link type="text/css" rel="stylesheet" href="https://threejs.org/examples/main.css">
	<!--<link type="text/css" rel="stylesheet" href="three.js/dev/examples/main.css">-->

</head>
<body>
	<div id="info">
		<a href="https://threejs.org/" target="_blank" rel="noopener">three.js</a> - AxesHelper is an axis object to visualize the 1, 2 or 3 axes.
		By <a href="https://github.com/anhr" target="_blank" rel="noopener">anhr</a>
	</div>
	<div>
		<canvas id="canvas"></canvas>
	</div>

	<script type="module">

		//import * as THREE from 'https://threejs.org/build/three.module.js';
		import * as THREE from 'https://raw.githack.com/anhr/three.js/dev/build/three.module.js';
		//import * as THREE from 'https://raw.githack.com/anhr/three.js/dev/build/three.module.min.js';
		//import { THREE } from 'https://raw.githack.com/anhr/commonNodeJS/master/three.js';
		//import * as THREE from './three.js/dev/build/three.module.js';

		//Uncomment line below if you want use 'https://raw.githack.com/anhr/commonNodeJS/' library in your project.
		import three from 'https://raw.githack.com/anhr/commonNodeJS/master/three.js'
		//Uncomment line below if you want use local commonNodeJS library in your project.
		//import three from './commonNodeJS/master/three.js'
		three.THREE = THREE;

		var camera, scene, renderer, stereoEffect, raycaster;

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
NOTE. Please include `three.THREE = THREE;` line into your project before use my [library](https://github.com/anhr/commonNodeJS). See example above.

The easiest way to use <b>AxesHelper</b> in your code is import <b>AxesHelper</b> from <b>AxesHelper.js</b> file in your JavaScript module.
[Example](../Examples/index.html).
```
import { AxesHelper } from 'https://raw.githack.com/anhr/commonNodeJS/master/AxesHelper/AxesHelper.js';
```
or download [commonNodeJS](https://github.com/anhr/commonNodeJS) repository into your "[folderName]\commonNodeJS\master" folder.
```
import { AxesHelper } from './commonNodeJS/master/AxesHelper/AxesHelper.js';
```

Now you can use <b>AxesHelper</b> in your javascript code.

The simplest <b>AxesHelper</b> has at least one axis.
```
new AxesHelper( THREE, scene, { scales: { x: {} } } );
```

Now we want to create <b>AxesHelper</b> 3 dimensional axes.

Name of the <b>X</b> is 'time'. Number of <b>X</b> scale marks is 5.

Minimum <b>Y</b> is 0.
Please edit line above for it.
```
const axesHelper = new AxesHelper( THREE, scene, {

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

} );
```

<a name="OrbitControls"></a>
## Use the [THREE.OrbitControls](https://threejs.org/docs/index.html#examples/en/controls/OrbitControls) to rotate the camera.

Import <b>OrbitControls</b>,
```
import { OrbitControls } from 'https://raw.githack.com/anhr/three.js/dev/examples/jsm/controls/OrbitControls.js';
```
and edit your code
```
const controls = new OrbitControls( camera, renderer.domElement );
controls.target.set( scene.position.x * 2, scene.position.y * 2, scene.position.z * 2 );
controls.saveState();//For reset of the orbitControls settings in the CameraGui and OrbitControlsGui
controls.update();
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
Import [StereoEffect](https://github.com/anhr/commonNodeJS/blob/master/StereoEffect/README.md).
```
import StereoEffect from 'https://raw.githack.com/anhr/commonNodeJS/master/StereoEffect/StereoEffect.js';
```
or 
download [commonNodeJS](https://github.com/anhr/commonNodeJS) repository into your "[folderName]\commonNodeJS\master" folder.
```
import StereoEffect from './commonNodeJS/master/StereoEffect/StereoEffect.js';
```

* Create the <b>StereoEffect</b> instance.
```
stereoEffect = new StereoEffect( renderer, {

	//spatialMultiplex: StereoEffect.spatialMultiplexsIndexs.SbS,//Side by side stereo effect
	far: camera.far,
	camera: camera,

} );
```
Add code into animate function
```
function animate() {

	requestAnimationFrame( animate );

	if ( stereoEffect === undefined )
		renderer.render( scene, camera );
	else stereoEffect.render( scene, camera );

}
```

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

		if ( typeof axesHelper !== 'undefined' )
			axesHelper.exposePosition( intersect );
		if ( typeof guiSelectPoint !== 'undefined' )
			guiSelectPoint.select( intersect );

	}

}
```

Create the <b>THREE.Raycaster</b> instance.
```
raycaster = new THREE.Raycaster();

//the precision of the raycaster when intersecting objects, in world units.
//See https://threejs.org/docs/#api/en/core/Raycaster.params.
raycaster.params.Points.threshold = 0.1;

if ( raycaster.setStereoEffect ) {

	raycaster.setStereoEffect( {

		renderer: renderer,
		camera: camera,
		stereoEffect: stereoEffect,

	} );
	raycaster.stereo.addParticle( points );

} else console.error( 'Create StereoEffect instance first.' );
```
Add event listeners.
```
const mouse = new THREE.Vector2();
window.addEventListener( 'mousemove', function( event ) {

	// calculate mouse position in normalized device coordinates
	// (-1 to +1) for both components

	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

	// update the picking ray with the camera and mouse position
	raycaster.setFromCamera( mouse, camera );

	raycaster.stereo.onDocumentMouseMove( event );

}, false );
window.addEventListener( 'pointerdown', function( event ) {

	raycaster.stereo.onDocumentMouseDown( event );

}, false );
```
For testing please move cursor over point. Cursor will be changing to 'pointer'.

You can see a dot lines from point to axes if you click over point.

* You can display a text if mouse is over to object in the 3d space.

Edit <b>points.userData.raycaster</b>.
```
points.userData.raycaster = {

	onIntersection: function ( intersection ) {

		this.spriteText = StereoEffect.getTextIntersection( intersection, {

			scales: typeof axesHelper !== 'undefined' ? axesHelper.options.scales : { x: {}, y: {}, z: {} },
			spriteOptions: {

				group: scene,
				rect: {

					displayRect: true,
					borderRadius: 15,

				},
				center: {

					camera: camera,
					canvas: canvas,

				}
				//center: new THREE.Vector2( 1, 0 ),
				//sizeAttenuation: true,

			}

		} );
		renderer.domElement.style.cursor = 'pointer';

	},
	onIntersectionOut: function ( ) {

		if ( this.spriteText ) {

			scene.remove( this.spriteText );
			delete this.spriteText;

		}
		renderer.domElement.style.cursor = cursor;

	},
	onMouseDown: function ( intersect ) {

		if ( typeof axesHelper !== 'undefined' )
			axesHelper.exposePosition( intersect );
		if ( typeof guiSelectPoint !== 'undefined' )
			guiSelectPoint.select( intersect );

	}

}
```
Note! If you want to see the text is always inside  the canvas,
in another words if you want the text is not moves outside the canvas border,
plase define a <b>camera</b> and <b>canvas</b> keys in the <b>center</b> object as you see above.

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
Plaese set <b>Player.orbitControls</b> if you use [THREE.OrbitControls](https://threejs.org/docs/index.html#examples/en/controls/OrbitControls).
```
if ( typeof Player !== 'undefined' ) Player.orbitControls = controls;
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

Import [dat.gui](https://github.com/anhr/dat.gui).
```
import { dat } from 'https://raw.githack.com/anhr/commonNodeJS/master/dat/dat.module.js';
```
or download [commonNodeJS](https://github.com/anhr/commonNodeJS) repository into your "[folderName]\commonNodeJS\master" folder.
```
import { dat } from './commonNodeJS/master/dat/dat.module.js';
```

<a name="AxesHelperGui"></a>
### AxesHelper settings.

Add <b>AxesHelperGui</b> into [dat.gui](https://github.com/anhr/dat.gui) for manual change settings of the <b>AxesHelper</b>.
[Example](../Examples/index.html)
Import <b>AxesHelperGui</b>.
```
import { AxesHelperGui } from 'https://raw.githack.com/anhr/commonNodeJS/master/AxesHelper/AxesHelperGui.js';
```
or download [commonNodeJS](https://github.com/anhr/commonNodeJS) repository into your "[folderName]\commonNodeJS\master" folder.
```
import { AxesHelperGui } from './commonNodeJS/master/AxesHelper/AxesHelperGui.js';
```

Now you can use <b>AxesHelperGui</b> in your javascript code.
```
const gui =  new dat.GUI();
AxesHelperGui( axesHelper, gui, {

	//cookie: cookie,
	//getLanguageCode: getLanguageCode,

} );
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
new MoveGroupGui( scene, gui, {

	//cookie: cookie,
	//cookieName: 'AxesHelper',
	//getLanguageCode: getLanguageCode,
	//lang: { moveGroup: 'Move points', },//name of the moveGroup folder. Default is 'Move Group'
	guiSelectPoint: guiSelectPoint,
	axesHelper: axesHelper,

} );
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
new MoveGroupGui( groupMove, gui, {

	//cookie: cookie,
	//cookieName: 'AxesHelper',
	//getLanguageCode: getLanguageCode,
	//lang: { moveGroup: 'Move points', },//name of the moveGroup folder. Default is 'Move Group'
	guiSelectPoint: guiSelectPoint,
	axesHelper: axesHelper,

} );
```

Enjoy my code :)
