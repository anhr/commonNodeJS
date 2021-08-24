<h1>CanvasMenu.</h1>

My [dropdown menu](https://github.com/anhr/commonNodeJS/tree/master/DropdownMenu) for canvas in my [three.js](https://threejs.org/) projects.

[Example of using](../Examples/html/index.html).

## Quick start


* Create a folder on your localhost named as [folderName].
	* Download [three.js](https://github.com/anhr/three.js) repository into your "[folderName]\three.js\dev" folder.
	* Download [commonNodeJS](https://github.com/anhr/commonNodeJS) repository into your "[folderName]\commonNodeJS\master" folder.
* Add your web page into [folderName]. Example:
```
<!DOCTYPE html>

<html>
<head>
	<title>CanvasMenu</title>

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
		- <a href="https://github.com/anhr/commonNodeJS/tree/master/canvasMenu" target="_blank" rel="noopener">CanvasMenu</a>.
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

The easiest way to use <b>CanvasMenu</b> in your code is import CanvasMenu from CanvasMenu.js.
```
import CanvasMenu from './commonNodeJS/master/canvasMenu/canvasMenu.js';
```
Now you can use <b>CanvasMenu</b> in your javascript code. Example:
```
new CanvasMenu( renderer );
```
Now your menu does nothing and you don't see it.

Also you can see

<i>CanvasMenu: menu is empty.</i>

warning in console.

Add some item into your menu:
```
new CanvasMenu( renderer, {

	menu: [

		{

			name: 'Button',
			onclick: function ( event ) {

				var message = 'Button onclick';
				//console.log( message );
				alert( message )

			},

		},

	],

} );
```
Please move mouse over canvas. Now you can see "Button" button on the bottom of the canvas. Click the "Button". An alert will be displayed.

Add a "Full Screen" button.

Insert the <b>fullScreen</b> key into <b>options</b> parameter of the <b>CanvasMenu</b>.
```
new CanvasMenu( renderer, {

	menu: [

		{

			name: 'Button',
			onclick: function ( event ) {

				var message = 'Button onclick';
				//console.log( message );
				alert( message )

			},

		},

	],
	fullScreen: { camera: camera, },

} );
```
Please move mouse over canvas.
Now you can see "⤢" button on the bottom right corner of the canvas.
Please click the "⤢" button if you want to see your canvas on the full screen.

* Add a [Stereo Effect](https://github.com/anhr/commonNodeJS/blob/master/StereoEffect/README.md) menu item.

First, import <b>StereoEffect</b> into your code
```
import StereoEffect from "https://raw.githack.com/anhr/commonNodeJS/master/StereoEffect/StereoEffect.js";
```
or download [commonNodeJS](https://github.com/anhr/commonNodeJS) repository into your "[folderName]\commonNodeJS\master" folder.
```
import StereoEffect from "./commonNodeJS/master/StereoEffect/StereoEffect.js";
```
Now you can use <b>StereoEffect</b> in your code.
```
const stereoEffect = new StereoEffect( renderer );
```
Add code into animate function
```
function animate() {

	requestAnimationFrame( animate );

	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;

	if ( !stereoEffect )
		renderer.render( scene, camera );
	else stereoEffect.render( scene, camera );

}
```
For including of the <b>StereoEffect</b> into <b>CanvasMenu</b>, add the <b>stereoEffect: stereoEffect</b> key into <b>options</b> parameter of the <b>CanvasMenu</b>.
```
new CanvasMenu( renderer, {

	menu: [

		{

			name: 'Button',
			onclick: function ( event ) {

				var message = 'Button onclick';
				//console.log( message );
				alert( message )

			},

		},

	],
	fullScreen: {

		camera: camera,
		THREE: THREE,

	},
	stereoEffect: stereoEffect,

} );
```
Please move mouse over canvas.
Now you can see "⚭" menu item on the bottom of the canvas.
Please click the "⚭" if you want to change of stereo mode.

Currently your canvas is not full screen in the stereo mode.
I think is is bad, because your stereo device can not to display stereo correctly if your canvas is not full screen.
For resolving of issue please add <b>rememberSize: true</b> key into <b>options</b> parameter of the <b>StereoEffect</b>.
```
const stereoEffect = new StereoEffect( renderer, {

	stereoEffect: { rememberSize: true, }

} );
```
Now your canvas will be changing to full screen automatically if you choice a stereo mode.

* If you want to localize menu, please import <b>getLanguageCode</b>
```
import { getLanguageCode } from 'https://raw.githack.com/anhr/commonNodeJS/master/lang.js';
```
or download [commonNodeJS](https://github.com/anhr/commonNodeJS) repository into your "[folderName]\commonNodeJS\master" folder.
```
import { getLanguageCode } from './commonNodeJS/master/lang.js';
```
Add <b>getLanguageCode: getLanguageCode,</b> key into <b>options</b> parameter of the <b>CanvasMenu</b>.
```
new CanvasMenu( renderer, {

	menu: [

		{

			name: 'Button',
			onclick: function ( event ) {

				var message = 'Button onclick';
				//console.log( message );
				alert( message )

			},

		},

	],
	fullScreen: {

		camera: camera,
		THREE: THREE,

	},
	stereoEffect: stereoEffect,
	getLanguageCode: getLanguageCode,

} );

```
* Add [Player](https://github.com/anhr/commonNodeJS/tree/master/player) menu item.

See "Add player item into CanvasMenu." header in [Player API](https://raw.githack.com/anhr/commonNodeJS/master/player/jsdoc/index.html).
