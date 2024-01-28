
# [Parametric_equation](https://en.wikipedia.org/wiki/Parametric_equation) curve.

This tutorial example explains how to add a curve on the canvas and use  controls on the web page for display and edit of the curve values.
You will create two curves as function of time:

First curve is trigonometric function of time.

Second curve is line. 

Also you will add to your web page the controls for [Player](../../player/jsdoc/index.html) and the curve function editing.

You will use my [library](https://github.com/anhr/commonNodeJS) in this tutorial.

# Content
* [Quick start.](#Quickstart)
* [Add controls on the web page.](#AddControls)
* [Example of your web page.](#WebPage)

<a name="QuickStart"></a>
## Quick start

* Create a folder on your localhost named as [folderName].
	* Download [three.js](https://github.com/anhr/three.js) repository into your "[folderName]\three.js\dev" folder.
	* Download [commonNodeJS](https://github.com/anhr/commonNodeJS) repository into your "[folderName]\commonNodeJS\master" folder.
* Add your web page into [folderName] and add two points to the canvas. Example:
```
<!DOCTYPE html>

<html>
<head>
	<title>Curve</title>

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

			new MyThree.MyPoints(
				[
					{

						vector: [
							'-1+2*t',//x
							'Math.cos(t*5*Math.PI)*0.5',//y
							'Math.sin(t*5*Math.PI)*0.5',//z
							'1-t',//w
						],
						name: 'Trigonometric functions',
						trace: true,

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
				group, {

					options: options,

				} );

		}, {

			canvas: { fullScreen: false, },
			playerOptions: {

				marks: 110,
				interval: 25,

			},

		} );

	</script>
</body>
</html>
```
See [MyThree](../../myThree/jsdoc/index.html) for details.

You can see, <b>x, y, z</b> and <b>w</b> values is function of the <b>t</b>. Currently <b>t=0</b> is default value.

Please move mouse cursor to the left bottom corner of the canvas and press "►" button for playing of the [Player](../../player/jsdoc/index.html).
Now you can see, your points is moving. Also you can see a trace of moving of the points.
<a name="AddControls"></a>
## Add controls on the web page.

* [Player](../../player/jsdoc/index.html) controls.

By Player controls user can see and edit current Player time. Also user can start/stop playing.

Please add the following tags to your web page to control the player from your web page.
```
<fieldset>
	<legend>Player</legend>
	Parameter <b>t</b> is <input id="time" /> <span id="tName"></span>
	<input id="prev" type="button" value="Prev" />
	<input id="play" type="button" value="Play" />
	<input id="next" type="button" value="Next" />
</fieldset>
```
Default player controls have follow ids:
<table>
	<tr>
		<td><b>Element</b></td>
		<td><b>id</b></td>
		<td><b>Element type</b></td>
	</tr>
	<tr>
		<td>Current Player time</td>
		<td>"time"</td>
		<td>input</td>
	</tr>
	<tr>
		<td>Time name</td>
		<td>"tName"</td>
		<td>span</td>
	</tr>
	<tr>
		<td>Go to previous animation scene</td>
		<td>"prev"</td>
		<td>input element of the button type</td>
	</tr>
	<tr>
		<td>Start/stop of the playing</td>
		<td>"play"</td>
		<td>input element of the button type</td>
	</tr>
	<tr>
		<td>Go to next animation scene</td>
		<td>"next"</td>
		<td>input element of the button type</td>
	</tr>
</table>

You can use another ids. Please see <b>options.controllers</b> parameters of [MyThree](../../myThree/jsdoc/module-MyThree-MyThree.html).

Now you can see the t parameter and some <b>Player</b> control buttjns on your web page.
Also you can see duplicate of the <b>Player</b> controls on the upper right corner of the canvas. Please press the "Open Controls" for it.

* Display and edit of the curve values.

Please add the following tags to your web page for display and edit of your "Trigonometric function" curve values.
```
<fieldset>
	<legend id="pointsName">Points</legend>
	<fieldset>
		<legend id="pointName">Parametric equation controls</legend>
		<table>
			<tr>
				<td>Axis</td>
				<td>f(t)</td>
				<td>Position</td>
				<td title="Point position in the world space">World Position</td>
			</tr>
			<tr>
				<td id="xPositionName"></td>
				<td><input id="xFunc" /></td>
				<td><input id="xPosition" /></td>
				<td id="xWorldPosition"></td>
			</tr>
			<tr>
				<td id="yPositionName"></td>
				<td><input id="yFunc" /></td>
				<td><input id="yPosition" /></td>
				<td id="yWorldPosition"></td>
			</tr>
			<tr>
				<td id="zPositionName"></td>
				<td><input id="zFunc" /></td>
				<td><input id="zPosition" /></td>
				<td id="zWorldPosition"></td>
			</tr>
			<tr>
				<td id="wPositionName"></td>
				<td><input id="wFunc" /></td>
				<td><input id="wPosition" /><br></td>
			</tr>
		</table>
	</fieldset>
</fieldset>
```
Also add <b>controllers: {},</b> key into point, named as "Trigonometric functions".
```
new MyThree.MyPoints(
	[
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
	group, {

	options: options,

} );
```
Now you can see the "Trigonometric functions" area on your web page.
Also you can see duplicate of the point's controls on the upper right corner of the canvas.

1. Please open the "Meshes" folder.
2. Select the "1 Points".
3. Open the "Points" folder.
4. Select the "0 Trigonometric functions" point.

* If you want to control two or more points on your web page, please use other control ids.

For example add tags for point, named as "Line".
```
<fieldset>
	<legend id="pointName2">Parametric equation controls</legend>
	<table>
		<tr>
			<td>Axis</td>
			<td>f(t)</td>
			<td>Position</td>
			<td title="Point position in the world space">World Position</td>
		</tr>
		<tr>
			<td id="yPositionName2"></td>
			<td><input id="yFunc2" /></td>
			<td><input id="yPosition2" /></td>
			<td id="yWorldPosition2"></td>
		</tr>
	</table>
</fieldset>
```
And add <b>controllers</b> key into this point.

```
new MyThree.MyPoints(
	[
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
			controllers: {

				pointName: 'pointName2',
				x: false,
				y: {

					func: {

						controller: 'yFunc2',
						elName: false,

					},
					position: {

						controller: 'yPosition2',
						elName: 'yPositionName2',

					},
					worldPosition: {

						controller: 'yWorldPosition2',
						elName: false,

					},

				},
				z: false,
				w: false,

			},

		},

	],
	group, {

	options: options,

} );
```
See <b>arrayFuncs controllers</b> parameter of the [Player.getPoints](../../player/jsdoc/module-Player-Player.getPoints.html) about <b>controllers</b> key details.

<a name="WebPage"></a>
## Example of your web page.
The following code is the result of this tutorial.
```
<!DOCTYPE html>

<html>
<head>
	<title>Curve</title>

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
	<fieldset>
		<legend>Player</legend>
		Parameter <b>t</b> is <input id="time" /> <span id="tName"></span>
		<input id="prev" type="button" value="Prev" />
		<input id="play" type="button" value="Play" />
		<input id="next" type="button" value="Next" />
	</fieldset>
	<fieldset>
		<legend id="pointsName">Points</legend>
		<fieldset>
			<legend id="pointName">Parametric equation controls</legend>
			<table>
				<tr>
					<td>Axis</td>
					<td>f(t)</td>
					<td>Position</td>
					<td title="Point position in the world space">World Position</td>
				</tr>
				<tr>
					<td id="xPositionName"></td>
					<td><input id="xFunc" /></td>
					<td><input id="xPosition" /></td>
					<td id="xWorldPosition"></td>
				</tr>
				<tr>
					<td id="yPositionName"></td>
					<td><input id="yFunc" /></td>
					<td><input id="yPosition" /></td>
					<td id="yWorldPosition"></td>
				</tr>
				<tr>
					<td id="zPositionName"></td>
					<td><input id="zFunc" /></td>
					<td><input id="zPosition" /></td>
					<td id="zWorldPosition"></td>
				</tr>
				<tr>
					<td id="wPositionName"></td>
					<td><input id="wFunc" /></td>
					<td><input id="wPosition" /><br></td>
				</tr>
			</table>
		</fieldset>
		<fieldset>
			<legend id="pointName2">Parametric equation controls</legend>
			<table>
				<tr>
					<td>Axis</td>
					<td>f(t)</td>
					<td>Position</td>
					<td title="Point position in the world space">World Position</td>
				</tr>
				<tr>
					<td id="yPositionName2"></td>
					<td><input id="yFunc2" /></td>
					<td><input id="yPosition2" /></td>
					<td id="yWorldPosition2"></td>
				</tr>
			</table>
		</fieldset>
	</fieldset>

	<script type="module">

		import * as THREE from './three.js/dev/build/three.module.js';
		//import * as THREE from 'https://threejs.org/build/three.module.js';
		//import * as THREE from 'https://raw.githack.com/anhr/three.js/dev/build/three.module.js';

		import MyThree from './commonNodeJS/master/myThree/myThree.js';
		//import MyThree from './commonNodeJS/master/myThree/build/myThree.module.js';
		//import MyThree from './commonNodeJS/master/myThree/build/myThree.module.min.js';
		MyThree.three.THREE = THREE;

		new MyThree( function ( group, options ) {

			new MyThree.MyPoints(
				[
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
						controllers: {

							pointName: 'pointName2',
							x: false,
							y: {

								func: {

									controller: 'yFunc2',
									elName: false,

								},
								position: {

									controller: 'yPosition2',
									elName: 'yPositionName2',

								},
								worldPosition: {

									controller: 'yWorldPosition2',
									elName: false,

								},

							},
							z: false,
							w: false,

						},

					},

				],
				group, {

				options: options,

			} );

		}, {

			canvas: { fullScreen: false, },
			playerOptions: {

				marks: 110,
				interval: 25,

			},

		} );

	</script>
</body>
</html>
```
