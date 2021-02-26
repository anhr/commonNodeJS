# myThreejs

node.js version of the myThreejs.

I use myThreejs into my projects for displaying of my 3D objects in the canvas.
[Example](https://raw.githack.com/anhr/myThreejs/master/Examples/html/).

Uses in my projects:
 * [DropdownMenu](https://github.com/anhr/DropdownMenu)
 * [controllerPlay](https://github.com/anhr/controllerPlay)

## Packaged Builds
The easiest way to use myThreejs in your code is by using the built source at `build/myThreejs.js`. These built JavaScript files bundle all the necessary dependencies to run controllerPlay.

In your `head` tag, include the following code:
```
<script src="https://raw.githack.com/anhr/myThreejs/master/build/myThreejs.js"></script>
```
or
```
<script src="https://raw.githack.com/anhr/myThreejs/master/build/myThreejs.min.js"></script>
```
or you can import myThreejs from myThreejs.js file in your JavaScript module. [Example.](https://raw.githack.com/anhr/myThreejs/master/Examples/html/)
```
import myThreejs from 'https://raw.githack.com/anhr/myThreejs/master/myThreejs.js';
```

Now you can use window.myThreejs in your javascript code.

## Methods

* [myThreejs.create( createXDobjects, options )](#mythreejscreate-createxdobjects-options-).
* [myThreejs.Points( arrayFuncs, options, pointsOptions )](#mythreejspoints-arrayfuncs-options-pointsoptions-).
* [myThreejs.setArrayFuncs( mesh )](#mythreejssetarrayfuncs-mesh-).
* [myThreejs.limitAngles( rotation )](#mythreejslimitangles-rotation-).

### myThreejs.create( createXDobjects, options )

Creates new canvas with my 3D objects.

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| createXDobjects | <code>callback</code> |  | creates my 3D objects. callback function ( group ) group: [group](https://threejs.org/docs/index.html#api/en/objects/Group) of my 3d or 4d objects. |
| [options] | <code>object</code> |  | the following options are available: |
| [options.elContainer] | <code>HTMLElement or string</code> | document.getElementById( "containerDSE" ) or a div element, child of body. | If an HTMLElement, then a HTMLElement, contains a canvas and HTMLElement with id="iframe-goes-in-here" for gui. If a string, then is id of the HTMLElement.|
| [options.orbitControls] | <code>object</code> |  | use [orbitControls](https://threejs.org/docs/index.html#examples/en/controls/OrbitControls) allow the camera to orbit around a target.|
| [options.orbitControls.gui] | <code>boolean</code> | false | true - displays the orbit controls gui. |
| [options.axesHelper] | <code>boolean</code> | false | true - displays the AxesHelper. |
| [options.axesHelperGui] | <code>boolean</code> | false | true - displays the AxesHelper gui. |
| [options.stereoEffect] | <code>boolean</code> | false | true - use [stereoEffect](https://github.com/anhr/three.js/blob/dev/examples/jsm/effects/StereoEffect.js). |
| [options.dat] | <code>boolean</code> | false | true - use [dat.gui](https://github.com/dataarts/dat.gui) JavaScript Controller Library. |
| [options.menuPlay] | <code>boolean</code> | false | true - use my dropdown menu for canvas in my version of [dat.gui](https://github.com/anhr/dat.gui) for playing of 3D objects in my projects. |
| [options.player] | <code>object</code> |  | 3D objects animation. |
| [options.player.min] | <code>number</code> | 0 | Animation start time. |
| [options.player.max] | <code>number</code> | 1 | Animation end time. |
| [options.canvas] | <code>object</code> |  | canvas properties. |
| [options.canvas.width] | <code>number</code> |  | width of the canvas. |
| [options.canvas.height] | <code>number</code> |  | height of the canvas. |
| [options.a] | <code>number</code> | 1 | Can be use as 'a' parameter of the Function. See [arrayFuncs](#arrayfuncs-item) for details. |
| [options.b] | <code>number</code> | 0 | Can be use as 'b' parameter of the Function. See [arrayFuncs](#arrayfuncs-item) for details. |
| [options.point] | <code>object</code> |  | point settings. Applies to points with [ShaderMaterial](https://threejs.org/docs/index.html#api/en/materials/ShaderMaterial). The size of the point seems constant and does not depend on the distance to the camera. |
| [options.point.size] | <code>number</code> | 0.02 | The apparent angular size of a point in radians. |
| [options.scales] | <code>object</code> |  | axes scales. |
| [options.scales.display] | <code>boolean</code> | false | true - displays the label and scale of the axes. |
| [options.scales.precision] | <code>number</code> | 4 | Formats a scale marks into a specified length. |
| [options.scales.x] | <code>object</code> |  | x axis scale options of 4D objects. |
| [options.scales.x.name] | <code>string</code> | "X" | axis name. |
| [options.scales.x.zoomMultiplier] | <code>number</code> | 1.1 | zoom multiplier. |
| [options.scales.x.offset] | <code>number</code> | 0.1 | position offset. |
| [options.scales.x.min] | <code>number</code> | -1 | Minimum range of the x axis. |
| [options.scales.x.max] | <code>number</code> | 1 | Maximum range of the x axis. |
| [options.scales.x.marks] | <code>number</code> | 5 | Number of x scale marks. |
| [options.scales.y] | <code>object</code> |  | y axis scale options of 4D objects. |
| [options.scales.y.name] | <code>string</code> | "Y" | axis name. |
| [options.scales.y.zoomMultiplier] | <code>number</code> | 1.1 | zoom multiplier. |
| [options.scales.y.offset] | <code>number</code> | 0.1 | position offset. |
| [options.scales.y.min] | <code>number</code> | -1 | Minimum range of the y axis. |
| [options.scales.y.max] | <code>number</code> | 1 | Maximum range of the y axis. |
| [options.scales.y.marks] | <code>number</code> | 5 | Number of y scale marks. |
| [options.scales.z] | <code>object</code> |  | z axis scale options of 4D objects. |
| [options.scales.z.zoomMultiplier] | <code>number</code> | 1.1 | zoom multiplier. |
| [options.scales.z.offset] | <code>number</code> | 0.1 | position offset. |
| [options.scales.z.name] | <code>string</code> | "Z" | axis name. |
| [options.scales.z.min] | <code>number</code> | -1 | Minimum range of the z axis. |
| [options.scales.z.max] | <code>number</code> | 1 | Maximum range of the z axis. |
| [options.scales.z.marks] | <code>number</code> | 5 | Number of z scale marks. |
| [options.scales.w] | <code>object</code> |  | w axis scale options of 4D objects. |
| [options.scales.w.zoomMultiplier] | <code>number</code> | 1.1 | zoom multiplier. |
| [options.scales.w.offset] | <code>number</code> | 0.1 | position offset. |
| [options.scales.w.name] | <code>string</code> | "W" | axis name. |
| [options.scales.w.min] | <code>number</code> | 0 | Minimum range of the w axis. |
| [options.scales.w.max] | <code>number</code> | 100 | Maximum range of the w axis. |
| [options.scales.t] | <code>object</code> |  | Animation time. |
| [options.scales.t.zoomMultiplier] | <code>number</code> | 2 | zoom multiplier. |
| [options.scales.t.offset] | <code>number</code> | 1 | position offset. |
| [options.scales.t.name] | <code>string</code> | "T" | Time name. |
| [options.scales.t.min] | <code>number</code> | 0 | Animation start time. |
| [options.scales.t.max] | <code>number</code> | 1 | Animation stop time. |
| [options.scales.t.marks] | <code>number</code> | 2 | Number of scenes of 3D objects animation. |

## You can use the following functions in your code:

### options.raycaster.onIntersection( intersection, scene, mouse )

Displays a [sprite text](https://github.com/anhr/three.js/blob/dev/src/objects/SpriteText.js) if you move mouse over an 3D object.

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| intersection | <code>object</code> |  | See [intersectObject](https://threejs.org/docs/index.html#api/en/core/Raycaster.intersectObject) for details. |
| scene | <code>THREE.Scene</code> |  | scene. |
| mouse | <code>THREE.Vector2</code> |  | mouse position. |

* options.raycaster.onIntersectionOut( scene )

Hides a [sprite text](https://github.com/anhr/three.js/blob/dev/src/objects/SpriteText.js) if you move mouse out an object.

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| scene | <code>THREE.Scene</code> |  | scene. |

### options.getPoints( arrayFuncs, optionsPoints )

Get array of THREE.Vector4 points.

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| arrayFuncs | <code>THREE.Vector4 or THREE.Vector3 or THREE.Vector2</code> |  | points.geometry.attributes.position array. See [arrayFuncs](#arrayfuncs-item) for details |
| optionsPoints.options.a | <code>number</code> | 1 | second parameter of the [arrayFuncs](#arrayfuncs-item) item function. |
| optionsPoints.options.b | <code>number</code> | 0 | third parameter of the [arrayFuncs](#arrayfuncs-item) item function. |

returns array of THREE.Vector4 points.

### options.getColors( arrayFuncs, optionsColor )

Get array of mesh colors.

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| arrayFuncs | <code>THREE.Vector4 or THREE.Vector3 or THREE.Vector2</code> |  | points.geometry.attributes.position array. See [arrayFuncs](#arrayfuncs-item) for details |
| optionsColor | <code>object</code> |  |  |

returns array of mesh colors.

**Example.**
```
<script>

	myThreejs.create( function ( group, options ) {

		var playerOptions = {

			marks: 110,//Number of scenes of 3D objects animation.
			name: 'Time (sec.)',
			repeat: true,
			zoomMultiplier: 1.1,
			offset: 0.1,
			min: -10,
			max: 10,

		};

		//Points
		var a = options.a, b = options.b;
		var tMin = playerOptions.min === undefined ? 0 : playerOptions.min;

		var arrayFuncs, sizes;

		//See https://github.com/anhr/myThreejs#arrayfuncs-item for details
		arrayFuncs = [
			{

				vector: new THREE.Vector4(
					new Function( 't', 'a', 'b', 'return Math.sin(t*a*2*Math.PI)*0.5+b' ),//x
					new Function( 't', 'a', 'b', 'return Math.cos(t*a*2*Math.PI)*0.5-b' ),//y
					new Function( 't', 'a', 'b', 'return Math.cos(t*a*2*Math.PI)*0.5-0.1' ),//z
					new Function( 't', 'return 1-2*t' )//w
				),
				name: 'Animated 3D point',
				trace: true,//Displays the trace of the point movement.

			},
			new THREE.Vector4( 0, 0, 0, new Function( 't', 'return 1-2*t' ) ),//color is f(t)
		]
		var points = new THREE.Points( new THREE.BufferGeometry().setFromPoints( options.getPoints( tMin, arrayFuncs, a, b ), 4 ),
			new THREE.PointsMaterial( { size: options.point.size, vertexColors: THREE.VertexColors } ) );
		points.name = 'Points';
		points.geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( options.getColors( arrayFuncs,
			{ scale: options.scales.w } ), 3 ) );
		points.userData.raycaster = {

			onIntersection: function ( raycaster, intersection, scene, mouse ) {

				options.raycaster.onIntersection( raycaster, intersection, scene, mouse );

			},
			onIntersectionOut: function ( scene ) {

				options.raycaster.onIntersectionOut( scene );

			},

		}
		points.userData.player = {

			arrayFuncs: arrayFuncs,
			selectPlayScene: function ( t, setAttributes ) {

				var angle = t * Math.PI * 2 * 1.2;
				points.rotation.set( angle, 0, 0 );
				myThreejs.limitAngles( points.rotation );

			}

		}
		points.position.copy( new THREE.Vector3( 0.1, 0.2, 0.3 ) );
		points.scale.copy( new THREE.Vector3( 1.1, 1.2, 1.3 ) );
		group.add( points );

	},
	{

		elContainer: "canvasContainer1",//document.getElementById("canvasContainer1"),//id of the HTMLElement for canvas and HTMLElement with id="iframe-goes-in-here" for gui.
		orbitControls: { gui: true, },//OrbitControls,//use orbit controls allow the camera to orbit around a target. https://threejs.org/docs/index.html#examples/en/controls/OrbitControls
		axesHelper: true,
		axesHelperGui: true,
		stereoEffect: true,
		menuPlay: true,
		dat: true,//use dat-gui JavaScript Controller Library. https://github.com/dataarts/dat.gui
		player: playerOptions,//3D objects animation.
		a: 1.1,
		b: 0.3,
		point: { size: 0.1 },
		canvas: {

			width: window.innerWidth / 2,
			height: window.innerHeight / 2,

		},
		scales: {

			display: true,
			precision: 4,
			t: playerOptions,
			x: {

				zoomMultiplier: 2,
				offset: 1,
				name: 'latitude(km.)',
				min: -10,
				max: 10,
				marks: 11,

			},
			y: {

				name: 'Temperature(degrees Celsius)',
				min: -4,
				max: 2,

			},
			z: {

				name: 'Radius(m.)',
				min: -110,
				max: -100,
				marks: 11,

			},
			w: {
				name: 'energy',
				min: -1,
				max: 1,
			},

		},

	} );

</script>
```

### myThreejs.Points( arrayFuncs, options, pointsOptions )

Displaying points.

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [arrayFuncs](#arrayfuncs-item) | <code>Array of THREE.Vector4 or THREE.Vector3 or THREE.Vector2 or object</code> |  | points.geometry.attributes.position array |
| [options] | <code>object</code> |  | options. See [myThreejs.create](#mythreejscreate-createxdobjects-options-) options for details |
| [pointsOptions] | <code>object</code> |  | followed points options is availablee: |
| [pointsOptions.tMin] | <code>number</code> | 0 | start time. Uses for playing of the points. |
| [pointsOptions.name] | <code>string</code> | "" | name of the points. Used for displaying of items of the Select drop down control of the Meshes folder of the dat.gui. |
| [pointsOptions.position] | <code>THREE.Vector3</code> | new THREE.Vector3( 0, 0, 0 ) | position of the points.<p>Vector's x, y, z can be as:</p><p>* float - position of the points.</p><p>* [float] - array of positions of the points.</p> * Function - position of the points is function of the t. Example: new Function( 't', 'return 0.1 + t' ) |
| [pointsOptions.scale] | <code>THREE.Vector3</code> | new THREE.Vector3( 1, 1, 1 ) | scale of the points.<p>Vector's x, y, z can be as:</p><p>* float - scale of the points.</p><p>* [float] - array of scales of the points.</p><p> * Function - scale of the points is function of the t. Example: new Function( 't', 'return 1.1 + t' )</p> |
| [pointsOptions.rotation] | <code>THREE.Vector3</code> | new THREE.Vector3( 0, 0, 0 ) | rotation of the points.<p>Vector's x, y, z can be as:</p><p>* float - rotation of the points.</p><p>* [float] - array of rotations of the points.</p><p>* Function - rotation of the points is function of the t. Example: new Function( 't', 'return Math.PI / 2 + t * Math.PI * 2' ) |

**Example.**  
```
	group.add( myThreejs.Points( [ //arrayFuncs. See https://github.com/anhr/myThreejs#arrayfuncs-item for details

		{

			vector: new THREE.Vector4(
				new Function( 't', 'a', 'b', 'return Math.sin(t*a*2*Math.PI)*0.5+b' ),//x
				new Function( 't', 'a', 'b', 'return Math.cos(t*a*2*Math.PI)*0.5-b' ),//y
				new Function( 't', 'a', 'b', 'return t' ),//z
				new Function( 't', 'return 1-2*t' )//w
			),
			name: 'Animated 4D point',
			trace: true,//Displays the trace of the point movement.

		},
		new THREE.Vector2( 0, 0 ),//2D point. White color
		new THREE.Vector3( -0.5, 0.5, -1 ),//3D point. White color
		{

			vector: new THREE.Vector4( 0.5,//new Function( 't', 'a', 'b', 'return 0.5-t' ),
				0.5,
				0.5,
				new THREE.Color( "rgb(255, 0, 0)" ) ),//3D point
			name: 'Red point',
			trace: true,//Displays the trace of the point movement.

		}


	], options, {

		name: 'Wave',
		tMin: 0,
		position: new THREE.Vector3( new Function( 't', 'return 0.1 + t' ), 0.2, 0 ),
		scale: new THREE.Vector3( new Function( 't', 'return 1.1 + t' ), 1.2, 1 ),
		rotation: new THREE.Vector3( new Function( 't', 'return Math.PI / 2 + t * Math.PI * 2' ), Math.PI / 4 ),

	} ) );
```

### myThreejs.setArrayFuncs( mesh )

Converts the mesh.geometry.attributes.position to mesh.userData.[arrayFuncs](#arrayfuncs-item).
Used to restore the default point position.

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| mesh | <code>THREE.Mesh</code> |  | [THREE.Mesh](https://threejs.org/docs/index.html#api/en/objects/Mesh) |

### myThreejs.limitAngles( rotation )

Limits angles of rotations of the mesh between 0 and 360 degrees.

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| rotation | <code>[THREE.Euler](https://threejs.org/docs/index.html#api/en/math/Euler)</code> |  | rotation angles for limitation |

**Example.**  
```
	var angle = t * Math.PI * 2 * 1.2;
	points.rotation.set( angle, 0, 0 );
	myThreejs.limitAngles( points.rotation );
```

 ### arrayFuncs item

 * THREE.Vector4: 4D point.
 * THREE.Vector3: 3D point. w = 1. Default is white color.
 * THREE.Vector2: 2D point. w = 1, z = 0. Default is white color.

  Vector's x, y, z, w is position of the point.

  Can be as:
  float - position of the point.
  [float] - array of positions of the point.
  Function - position of the point is function of the t. Example: new Function( 't', 'a', 'b', 'return Math.sin(t*a*2*Math.PI)*0.5+b' )
  Vector.w can be as THREE.Color. Example: new THREE.Color( "rgb(255, 127, 0)" )
  if arrayFuncs.length === 0 then push new THREE.Vector3().
 * 
 * object: {
 *   vector: THREE.Vector4|THREE.Vector3|THREE.Vector2 - point position
 *   name: point name
 *   trace: true - Displays the trace of the point movement.
 * }
 * or
 * object: {
 *   x: x axis. Defauilt is 0.
 *   y: y axis. Defauilt is 0.
 *   z: z axis. Defauilt is 0.
 *   w: w axis. Defauilt is 0.
 * }
 * 
 * array: [
 *   0: x axis. Defauilt is 0.
 *   1: y axis. Defauilt is 0.
 *   2: z axis. Defauilt is 0.
 *   3: w axis. Defauilt is 0.
 * ]

## Directory Contents

```
└── build - Compiled source code.
```

## Building your own DropdownMenu

In the terminal, enter the following:

```
$ npm install
$ npm run build
```

## npm scripts

- npm run build - Build development and production version of scripts.


## On the following browsers have been successfully tested:

Windows 10

	IE 11

	Microsoft Edge 41

	Chrome 74

	Opera 60

	Safari 5.1.7 "Your browser does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation" style="color:#000">WebGL</a>"

	FireFox 56

Android 6.0.1

	Chrome 74 

	Samsung Galaxy S5 incorrect slider width

	FireFox 67 incorrect slider width

	Opera 52

	Opera Mini 43

LG Smart tv

	Chrome - init failed! WeekMap is not defined


## Thanks
The following libraries / open-source projects were used in the development of DropdownMenu:
 * [Rollup](https://rollupjs.org)
 * [Node.js](http://nodejs.org/)
 * [three.js](https://threejs.org/)

 ## Have a job for me?
Please read [About Me](https://anhr.github.io/AboutMe/).
