<h1>CanvasMenu.</h1>

My [dropdown menu](https://github.com/anhr/commonNodeJS/tree/master/DropdownMenu) for canvas in my [three.js](https://threejs.org/) projects.

[Example of using](../Examples/html/index.html).

## Quick start

* Create a folder on your localhost named as [folderName].
* Add your web page into [folderName]. Example:
```
<!DOCTYPE html>
<html>
<head>
	<title>CanvasMenu</title>
</head>
<body>
	<h1>
		<a href='https://github.com/anhr/commonNodeJS/tree/master/canvasMenu' target="_blank">CanvasMenu</a> inside <a href="https://threejs.org/" target="_blank">Three.js</a> canvas.
	</h1>
	<div>
		<canvas id="canvas"></canvas>
	</div>
	<script type="module">

		import * as THREE from 'https://threejs.org/build/three.module.js';
		//import { THREE } from 'https://raw.githack.com/anhr/commonNodeJS/master/three.js';
		//import * as THREE from './three.js/dev/build/three.module.js';

		var scene = new THREE.Scene();
		var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

		var renderer = new THREE.WebGLRenderer( {

			canvas: document.getElementById( "canvas" ),

		} );
		renderer.setSize( window.innerWidth / 2, window.innerHeight / 2 );

		var geometry = new THREE.BoxGeometry();
		var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
		var cube = new THREE.Mesh( geometry, material );
		scene.add( cube );

		camera.position.z = 5;

		var animate = function () {

			requestAnimationFrame( animate );

			cube.rotation.x += 0.01;
			cube.rotation.y += 0.01;

			renderer.render( scene, camera );

		};

		animate();
	</script>
</body>
</html>
```
* The easiest way to use <b>CanvasMenu</b> in your code is import CanvasMenu from CanvasMenu.js.
```
import CanvasMenu from 'https://raw.githack.com/anhr/commonNodeJS/master/canvasMenu/canvasMenu.js';
```
or download [commonNodeJS](https://github.com/anhr/commonNodeJS) repository into your "[folderName]\commonNodeJS\master" folder.
```
import CanvasMenu from './commonNodeJS/master/canvasMenu/canvasMenu.js';
```
* Now you can use <b>CanvasMenu</b> in your javascript code. Example:
```
new CanvasMenu( renderer );
```
Now your menu does nothing and you don't see it.
* Add some item into your menu:
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

* Add a "Full Screen" button.

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
	fullScreen: {

		camera: camera,
		THREE: THREE,

	},

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
const stereoEffect = new StereoEffect( THREE, renderer );
```
Add code into animate function
```
function animate() {

	requestAnimationFrame( animate );

	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;

	if ( stereoEffect === undefined )
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
const stereoEffect = new StereoEffect( THREE, renderer, { rememberSize: true, } );
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
