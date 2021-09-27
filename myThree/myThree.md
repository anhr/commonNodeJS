
# MyThree.

I use <b>MyThree</b> in my [three.js](https://threejs.org/) projects for displaying of my 3D objects in the canvas.

# Content
* [Quick start.](#Quickstart)
* [Use <b>MyPoints</b> for create points.](#MyPoints)
* [Animate 3D objects.](#animate)
* [Example of your web page.](#WebPage)
* [Directory Contents.](#DirectoryContents)
* [Building your own MyThree.](#Building)
* [Controls on the web page.](./tutorial-WebPageControls.html)

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
	<title>MyThree</title>

	<!--for mobile devices-->
	<meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">

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
		- <a href="https://github.com/anhr/commonNodeJS/tree/master/myThree" target="_blank" rel="noopener">MyThree</a>.
		By <a href="https://github.com/anhr" target="_blank" rel="noopener">anhr</a>
	</div>

	<script type="module">

		import * as THREE from './three.js/dev/build/three.module.js';
		//import * as THREE from 'https://threejs.org/build/three.module.js';
		//import * as THREE from 'https://raw.githack.com/anhr/three.js/dev/build/three.module.js';

	</script>
</body>
</html>
```
The easiest way to use <b>MyThree</b> in your code is import <b>MyThree</b> from <b>myThree.js</b> file in your JavaScript module.
[Example](../../../../commonNodeJS/master/myThree/Examples/html/index.html).
```
import MyThree from './commonNodeJS/master/myThree/myThree.js';
//import MyThree from './commonNodeJS/master/myThree/build/myThree.module.js';
//import MyThree from './commonNodeJS/master/myThree/build/myThree.module.min.js';
MyThree.three.THREE = THREE;
```
Now you can use <b>MyThree</b> in your javascript code.
```
new MyThree();
```
You can see a canvas on your web page. Inside of the canvas you can see:
* [AxesHelper](../../AxesHelper/jsdoc/index.html) in the canvas center.
* [dat.gui](https://github.com/anhr/dat.gui) controllers in the upper left corner of the canvas.
* [CanvasMenu](../../canvasMenu/jsdoc/index.html) in the bottom of the canvas.

Add a 3D object to the canvas. For example points.

<a name="MyPoints"></a>
## Use [MyPoints](../../myPoints/jsdoc/index.html) for create points.

Add [MyPoints](../../myPoints/jsdoc/index.html) instance into <b>createXDobjects</b> callback function of [MyThree](./module-MyThree-MyThree.html).
Example:
```
new MyThree( function ( group, options ) {

	const arrayFuncs = [
		[],//first point. Zero position. White color.
		[-0.5, 0.5, 0.5],//second point. White color.
	];
	MyThree.MyPoints( arrayFuncs, group, { options: options } );

} );
```
<a name="animate"></a>
## Animate 3D objects.
See [Player](../../player/jsdoc/index.html) for details.

Move second point of <b>MyPoints</b>. Edit <b>arrayFuncs</b>:
```
	const arrayFuncs = [
		[],//first point. Zero position. White color.
		[
			'Math.sin(t*2*Math.PI)*0.5',//x
			'Math.cos(t*2*Math.PI)*0.5',//y
			0.5//z
		],//second point. White color.
	];
```
<b>t</b> is current time. Default, current time is changing from 0 to 1 during playing.
See <b>min</b> and <b>max</b> of the <b>settings.options.playerOptions</b> parameter of [Player](../../player/jsdoc/module-Player-Player.html).

Please click "►" button on the left bottom corner of the canvas for playing.

Default, the playing ticks count is 10. You can change it. Also you can set your ticks per seconds and other setting.
Add a <b>playerOptions</b> key into <b>options</b> parameter of [MyThree](../../myThree/jsdoc/module-MyThree-MyThree.html).
```
new MyThree( function ( group, options ) {

	const arrayFuncs = [
		[],//first point. Zero position. White color.
		[
			'Math.sin(t*2*Math.PI)*0.5',//x
			'Math.cos(t*2*Math.PI)*0.5',//y
			0.5//z
		],//second point. White color.
	];
	MyThree.MyPoints( arrayFuncs, group, { options: options } );

}, {

	playerOptions: {

		marks: 110,//Ticks count. Number of scenes of 3D objects animation.
		interval: 25,//Ticks per seconds.

	},

} );
```
See <b>settings.options.playerOptions</b> parameter of the [Player](../../player/jsdoc/module-Player-Player.html) for details. 
<a name="WebPage"></a>
## Example of your web page.
The following code is the result of this tutorial.
```
<!DOCTYPE html>

<html>
<head>
	<title>MyThree</title>

	<!--for mobile devices-->
	<meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">

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
		- <a href="https://github.com/anhr/commonNodeJS/tree/master/myThree" target="_blank" rel="noopener">MyThree</a>.
		By <a href="https://github.com/anhr" target="_blank" rel="noopener">anhr</a>
	</div>

	<script type="module">

		import * as THREE from './three.js/dev/build/three.module.js';
		//import * as THREE from 'https://threejs.org/build/three.module.js';
		//import * as THREE from 'https://raw.githack.com/anhr/three.js/dev/build/three.module.js';

		import MyThree from './commonNodeJS/master/myThree/myThree.js';
		//import MyThree from './commonNodeJS/master/myThree/build/myThree.module.js';
		//import MyThree from './commonNodeJS/master/myThree/build/myThree.module.min.js';
		MyThree.three.THREE = THREE;

		new MyThree( function ( group, options ) {

			const arrayFuncs = [
				[],//first point. Zero position. White color.
				[
					'Math.sin(t*2*Math.PI)*0.5',//x
					'Math.cos(t*2*Math.PI)*0.5',//y
					0.5//z
				],//second point. White color.
			];
			MyThree.MyPoints( arrayFuncs, group, { options: options } );

		}, {

			playerOptions: {

				marks: 110,//Ticks count. Number of scenes of 3D objects animation.
				interval: 25,//Ticks per seconds.

			},

		} );

	</script>
</body>
</html>
```
Also you can read a tutorial, explains how to add a curve on the canvas and use  controls on the web page for display and edit of the curve values. Go to [Controls on the web page.](./tutorial-WebPageControls.html)
<a name="DirectoryContents"></a>
## Directory Contents

```
build - Compiled source code.
```

<a name="Building"></a>
## Building your own MyThree

In the terminal, enter the following:

```
$ npm install
$ npm install uglify-es
$ npm run build
```
