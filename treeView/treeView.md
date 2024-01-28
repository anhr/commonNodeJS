<h1>TreeView.</h1>

Tree view with CSS and JavaScript. Thanks to [Learn how to create a tree view with CSS and JavaScript.]{@link https://www.w3schools.com/howto/howto_js_treeview.asp}.

[Example of using](../Examples/index.html).

# Content
* [Quick start.](#Quickstart)
* [Include canvas into tree branch.](#IncludeCanvas)
* [Example of your web page.](#WebPage)

<a name="QuickStart"></a>
## Quick start

* Create a folder on your localhost named as [folderName].
	* Download [commonNodeJS](https://github.com/anhr/commonNodeJS) repository into your "[folderName]\commonNodeJS\master" folder.
* Add your web page into [folderName]. Example:
```
<!DOCTYPE html>

<html>
<head>
	<title>tree view</title>
</head>
<body>
	<script nomodule>alert( 'Fatal error: Your browser do not support modular JavaScript code.' );</script>
	<div id="info">
		<a href="https://github.com/anhr/commonNodeJS/tree/master/treeViev" target="_blank" rel="noopener">TreeView</a>.
		By <a href="https://github.com/anhr" target="_blank" rel="noopener">anhr</a>
	</div>
</body>
</html>
```
* Add a tree HTML with one branch:
```
<ul id="myUL">
	<li>
		<span class="caret">Introduction</span>
		<ul class="nested">
			<li>
				Tree view with CSS and JavaScript. Thanks to <a href="https://www.w3schools.com/howto/howto_js_treeview.asp" target="_blank">Learn how to create a tree view with CSS and JavaScript.</a>
			</li>
		</ul>
	</li>
</ul>
```
* Add CSS into <b>head</b> tag:
```
<link type="text/css" rel="stylesheet" href="./commonNodeJS/master/treeView/treeView.css">
```
Now you can see a tree with one opened branch. You can hide a branch by default. Please add the <b>nide</b> class to nested <b>ul</b> tag for it.
```
<ul id="myUL">
	<li>
		<span class="caret">Introduction</span>
		<ul class="nested hide">
			<li>
				Tree view with CSS and JavaScript. Thanks to <a href="https://www.w3schools.com/howto/howto_js_treeview.asp" target="_blank">Learn how to create a tree view with CSS and JavaScript.</a>
			</li>
		</ul>
	</li>
</ul>
```
* Add a javascript code so the user can interact with the tree.
```
<script type="module">
	import TreeView from './commonNodeJS/master/treeView/treeView.js';
	new TreeView();
</script>
```
<a name="IncludeCanvas"></a>
## Include canvas into tree branch.
* Add new <b>Canvas</b> branch into tree.
```
<ul id="myUL">
	<li>
		<span class="caret">Introduction</span>
		<ul class="nested hide">
			<li>
				Tree view with CSS and JavaScript. Thanks to <a href="https://www.w3schools.com/howto/howto_js_treeview.asp" target="_blank">Learn how to create a tree view with CSS and JavaScript.</a>
			</li>
		</ul>
	</li>
	<li>
		<span class="caret">Canvas.</span>
		<ul class="nested hide" id="articleCanvas">
			<li>
				Example of including a canvas in the tree branch.
				<div class="canvas" id="canvasPoints">
					<img src="../../img/wait.gif">
				</div>
			</li>
		</ul>
	</li>
</ul>
```
* Download [three.js](https://github.com/anhr/three.js) repository into your "[folderName]\three.js\dev" folder.
* Import <b>THREE</b> and <b>MyThree</b>.
```
import * as THREE from './three.js/dev/build/three.module.js';
//import * as THREE from 'https://threejs.org/build/three.module.js';
//import * as THREE from 'https://raw.githack.com/anhr/three.js/dev/build/three.module.js';

import MyThree from './commonNodeJS/master/myThree/myThree.js';
//import MyThree from './commonNodeJS/master/myThree/build/myThree.module.js';
//import MyThree from './commonNodeJS/master/myThree/build/myThree.module.min.js';
if ( MyThree.default ) MyThree = MyThree.default;
MyThree.three.THREE = THREE;
```
* Replace <b>new TreeView();</b> to
```
new TreeView().setCanvas( 'articleCanvas', new MyThree( function ( scene, options ) {

	new MyThree.MyPoints(

		[
			[],
			{

				vector: [
					'-1+2*t',//x
					'Math.cos(t*5*Math.PI)*0.5',//y
					'Math.sin(t*5*Math.PI)*0.5',//z
					'1-t',//w
				],
				name: 'Trigonometric functions',
				trace: true,
				controllers: {},

			},
			{

				vector: [
					0.4,//x
					'1-2*t',//y
				],
				name: 'Line',
				trace: true,

			},

		],
		scene, {

			options: options,
			pointsOptions: { 

				name: 'Points',

			},

	} );

}, {

	elContainer: "canvasPoints",
	playerOptions: {

		marks: 111,//Number of scenes of 3D objects animation.
		interval: 25,//Ticks per seconds.

	},
	dat: {},
	canvas: { fullScreen: false },

} ) );
```
* Now you can use <b>new MyThree.TreeView</b> instead <b>new TreeView</b> and can remove <b>import TreeView from './commonNodeJS/master/treeView/treeView.js';</b> line.
<a name="WebPage"></a>
## Example of your web page.
The following code is the result of this tutorial.
```
<!DOCTYPE html>

<html>
<head>
	<title>tree view</title>
	<link type="text/css" rel="stylesheet" href="./commonNodeJS/master/treeView/treeView.css">
</head>
<body>
	<script nomodule>alert( 'Fatal error: Your browser do not support modular JavaScript code.' );</script>
	<div id="info">
		<a href="https://github.com/anhr/commonNodeJS/tree/master/treeViev" target="_blank" rel="noopener">TreeView</a>.
		By <a href="https://github.com/anhr" target="_blank" rel="noopener">anhr</a>
	</div>
	<ul id="myUL">
		<li>
			<span class="caret">Introduction</span>
			<ul class="nested hide">
				<li>
					Tree view with CSS and JavaScript. Thanks to <a href="https://www.w3schools.com/howto/howto_js_treeview.asp" target="_blank">Learn how to create a tree view with CSS and JavaScript.</a>
				</li>
			</ul>
		</li>
		<li>
			<span class="caret">Canvas.</span>
			<ul class="nested hide" id="articleCanvas">
				<li>
					Example of including a canvas in the tree branch.
					<div class="canvas" id="canvasPoints">
						<img src="../../img/wait.gif">
					</div>
				</li>
			</ul>
		</li>
	</ul>
	<script type="module">
		import * as THREE from './three.js/dev/build/three.module.js';
		//import * as THREE from 'https://threejs.org/build/three.module.js';
		//import * as THREE from 'https://raw.githack.com/anhr/three.js/dev/build/three.module.js';

		import MyThree from './commonNodeJS/master/myThree/myThree.js';
		//import MyThree from './commonNodeJS/master/myThree/build/myThree.module.js';
		//import MyThree from './commonNodeJS/master/myThree/build/myThree.module.min.js';
		if ( MyThree.default ) MyThree = MyThree.default;
		MyThree.three.THREE = THREE;

		//import TreeView from './commonNodeJS/master/treeView/treeView.js';
		new MyThree.TreeView().setCanvas( 'articleCanvas', new MyThree( function ( scene, options ) {

			new MyThree.MyPoints(

				[
					[],
					{

						vector: [
							'-1+2*t',//x
							'Math.cos(t*5*Math.PI)*0.5',//y
							'Math.sin(t*5*Math.PI)*0.5',//z
							'1-t',//w
						],
						name: 'Trigonometric functions',
						trace: true,
						controllers: {},

					},
					{

						vector: [
							0.4,//x
							'1-2*t',//y
						],
						name: 'Line',
						trace: true,

					},

				],
				scene, {

					options: options,
					pointsOptions: { 

						name: 'Points',

					},

			} );

		}, {

			elContainer: "canvasPoints",
			playerOptions: {

				marks: 111,//Number of scenes of 3D objects animation.
				interval: 25,//Ticks per seconds.

			},
			dat: {},
			canvas: { fullScreen: false },

		} ) );
	</script></body>
</html>
```
