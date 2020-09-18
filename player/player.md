# Player.

I use Player in my [three.js](https://threejs.org/) projects for 3D objects animation.

## Quick start

### Player.

Create your web page. [Example](https://threejs.org/docs/index.html#manual/en/introduction/Creating-a-scene).

The easiest way to use Player in your code is import Player from Player.js file in your JavaScript module.
[Example](https://raw.githack.com/anhr/commonNodeJS/master/player/Examples/index.html).
```
import Player from 'https://raw.githack.com/anhr/commonNodeJS/master/player/player.js';
```
or
* Create a folder on your localhost named as [folderName].
* Add your web page into [folderName]. See [example](https://raw.githack.com/anhr/commonNodeJS/master/player/Examples/index.html) web page.
* Download [commonNodeJS](https://github.com/anhr/commonNodeJS) repository into your "[folderName]\commonNodeJS\master" folder.
```
import Player from './commonNodeJS/master/player/build/player.module.js';
```
or
```
import Player from './commonNodeJS/master/player/player.js';
```

Now you can use Player in your javascript code.

Add Player.
```
const player = new Player();
```
Create a 3d object, for example Points:

```
const arrayFuncs = [
	new THREE.Vector3( 0.5, 0.5, 0.5 ),
	new THREE.Vector3( -0.5, -0.5, -0.5 ),
];
const points = new THREE.Points( new THREE.BufferGeometry().setFromPoints( arrayFuncs ),
	new THREE.PointsMaterial( {

		color: 0xffffff,
		size: 0.2,

	} ) );
scene.add( points );
```

Now your player does nothing. Suppose you want to move a point during playing. Change your code for this:
* Edit arrayFuncs
```
const arrayFuncs = [
	new THREE.Vector3( 
		new Function( 't', 'a', 'b', 'return Math.sin(t*a*2*Math.PI)*0.5+b' ),//x
		new Function( 't', 'a', 'b', 'return Math.cos(t*a*2*Math.PI)*0.5-b' ),//y
		0.5 ),
	new THREE.Vector3( -0.5, -0.5, -0.5 ),
];
```
You can see, the X and Y values of the first point of the arrayFuncs is function of the t. X is sin(t) and Y is cos(t).
t is current time of the playing. Default start time t = 0, a = 1, b = 0.
Read about [Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function).
* Edit points
```
const points = new THREE.Points( new THREE.BufferGeometry().setFromPoints( Player.getPoints( THREE, arrayFuncs,
	{ group: scene } ) ),
	new THREE.PointsMaterial( {

		color: 0xffffff,
		size: 0.2,

	} ) );
```
Currently [Player.getPoints(...)](https://raw.githack.com/anhr/commonNodeJS/master/player/jsdoc/module-Player.html#~Player.getPoints) returns an array of the vectors for t = 0.

* Define the <b>points.userData.player</b> object in your code for including of the points into Player.
Include <b>arrayFuncs</b> into <b>points.userData.player</b> object if you want to move points during playing.
```
points.userData.player = {

	arrayFuncs: arrayFuncs,

}
```
* Edit Player
```
const player = new Player( function ( index, t ) {

		Player.selectPlayScene( THREE, scene, t, index );

	});
```
<b>Player.selectPlayScene( THREE, scene, t, index );</b> function call during every new step of the playing.
See [onSelectScene](https://raw.githack.com/anhr/commonNodeJS/master/player/jsdoc/module-Player.html#~onSelectScene) for details.
* Start playing.
```
player.play3DObject();
```
Update your web page. Now you can see moving a point on the canvas.

Default, the playing ticks count is 10. You can change it.
Also you can set your ticks per seconds and other setting.
See [Player](https://raw.githack.com/anhr/commonNodeJS/master/player/jsdoc/module-Player.html) for details.
Please change your Player for it.
```
const player = new Player(function ( index, t ) {

		Player.selectPlayScene( THREE, scene, t, index, { palette: palette } );

}, {

	settings: {

		marks: 100,//Ticks count of the playing.
		interval: 25,//Ticks per seconds.

	}
} );
```
#### Add trace line of moving of the point during playing.
* Edit arrayFuncs
```
const arrayFuncs = [
	{

		vector: new THREE.Vector3( 
			new Function( 't', 'a', 'b', 'return Math.sin(t*a*2*Math.PI)*0.5+b' ),//x
			new Function( 't', 'a', 'b', 'return Math.cos(t*a*2*Math.PI)*0.5-b' ),//y
			0.5//z
		),
		trace: true,//Displays the trace of the point movement.

	},
	new THREE.Vector3( -0.5, -0.5, -0.5 ),
];
```
You can see, first value of the array is object with

{

	vector: position of the point

	trace: true - displays the trace of the point movement.

}

Now you can see a trace line of the moving of the first point.
#### Point color.
* In the <b>THREE.PointsMaterial</b> parameters of your points remove the <b>color</b> value and add <b>vertexColors: THREE.VertexColors</b>.
```
const points = new THREE.Points( new THREE.BufferGeometry().setFromPoints( Player.getPoints( THREE, arrayFuncs,
	{ group: scene } ) ),
	new THREE.PointsMaterial( {

		vertexColors: THREE.VertexColors,
		size: 0.2,

	} ) );
```
* In the first point of the arrayFuncs change vector from THREE.Vector3 to THREE.Vector4.
```
const arrayFuncs = [
	{

		vector: new THREE.Vector4( 
			new Function( 't', 'a', 'b', 'return Math.sin(t*a*2*Math.PI)*0.5+b' ),//x
			new Function( 't', 'a', 'b', 'return Math.cos(t*a*2*Math.PI)*0.5-b' ),//y
			0.5,//z
			new THREE.Color( "rgb( 0, 255, 0)" )//w is green color
		),
		trace: true,//Displays the trace of the point movement.

	},
	new THREE.Vector3( -0.5, -0.5, -0.5 ),
];
```
You can see the <b>w</b> coordinate of the <b>THREE.Vector4</b> is green color.
* Point color is function of the time.

Change the <b>w</b> coordinate of the <b>THREE.Vector4</b> to <b>new Function( 't', 'return 1-2*t' )</b>.
```
const arrayFuncs = [
	{

		vector: new THREE.Vector4( 
			new Function( 't', 'a', 'b', 'return Math.sin(t*a*2*Math.PI)*0.5+b' ),//x
			new Function( 't', 'a', 'b', 'return Math.cos(t*a*2*Math.PI)*0.5-b' ),//y
			0.5,//z
			new Function( 't', 'return 1-2*t' )//w
		),
		trace: true,//Displays the trace of the point movement.

	},
	new THREE.Vector3( -0.5, -0.5, -0.5 ),
];
```
Now you can see the color of the first point as blue at the begin of playing and white at the end of playing
because default range of the [color palette](https://github.com/anhr/commonNodeJS/tree/master/colorpicker) from 0 to 100.
But current range of the function from 1 to -1 for default <b>t</b> range from 0 to 1.
You can resolve this issue by change of the palette range.
Replace <b>w</b> coordinate of the <b>THREE.Vector4</b> from <b>new Function( 't', 'return 1-2*t' )</b> to an object as wrote below.
See arrayFuncs parametr of the [Player.getColors(...)](https://raw.githack.com/anhr/commonNodeJS/master/player/jsdoc/module-Player.html#~Player.getColors) for details.
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
		),
		trace: true,//Displays the trace of the point movement.

	},
	new THREE.Vector3( -0.5, -0.5, -0.5 ),
];
```
* Select a [color palette](https://github.com/anhr/commonNodeJS/tree/master/colorpicker).

Default color palette index is [ColorPicker.paletteIndexes.BGRW](https://raw.githack.com/anhr/commonNodeJS/master/colorpicker/Example/index.html#Bidirectional#BGRW).
You can select another palette. Please import ColorPicker into your web page for it.
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
And use your new palette in <b>Player.selectPlayScene</b>.
```
const palette = new ColorPicker.palette( { palette: ColorPicker.paletteIndexes.bidirectional } );
const player = new Player(function ( index, t ) {

		Player.selectPlayScene( THREE, scene, t, index, { palette: palette } );

	});
```
Also you can create your own custom palette.
```
const palette = new ColorPicker.palette( { palette: [

	{ percent: 0, r: 0, g: 0, b: 0, },
	{ percent: 10, r: 0xff, g: 255, b: 0xff, },
	{ percent: 20, r: 0xff, g: 0, b: 0x0, },
	{ percent: 30, r: 0x0, g: 255, b: 0x0, },
	{ percent: 40, r: 0x0, g: 0, b: 0xff, },
	{ percent: 80, r: 0x0, g: 0, b: 0xff, },
	{ percent: 90, r: 0xff, g: 255, b: 0xff, },

] } );
```
#### Move points position.
* Add <b>selectPlayScene</b> value to the <b>points.userData.player</b> object.
```
points.userData.player = {

	arrayFuncs: arrayFuncs,
	selectPlayScene: function ( t ) {

		points.position.x = t;

	}

}
```
<b>t</b> is current time.

Now all points in your canvas moving to the left.

Also you can scale and rotate any mesh on your canvas. For example.
```
points.rotation.z = - Math.PI * 2 * t;
```
#### Create THREE.Points with [THREE.ShaderMaterial material](https://raw.githack.com/anhr/commonNodeJS/master/getShaderMaterialPoints/jsdoc/index.html).

Please remove your old <b>const points</b> and use <b>getShaderMaterialPoints</b> for creating of new points as described in [getShaderMaterialPoints API](https://raw.githack.com/anhr/commonNodeJS/master/getShaderMaterialPoints/jsdoc/index.html).
#### Use myPoints for create points.

Please remove your old <b>const points</b> and <b>getShaderMaterialPoints</b> and use [myPoints](https://raw.githack.com/anhr/commonNodeJS/master/myPoints/jsdoc/index.html) for creating of new points.
Example.
```
MyPoints( THREE, arrayFuncs, scene );
```
Now you can see, first point is moving and changing color.

Currently all <b>myPoints</b> settings is default.
You can set your own setting for <b>myPoints</b>. For example set points size to 15 and move all points to right during playing.
```
MyPoints( THREE, arrayFuncs, scene, {

	options: {

		point: { size: 15 }

	},
	pointsOptions: {

		position: new THREE.Vector3 ( new Function( 't', 'return t' ), 0, 0)

	}

} );
```
## Directory Contents

```
build - Compiled source code.
```

## Building your own Player

In the terminal, enter the following:

```
$ npm install
$ npm run build
```
