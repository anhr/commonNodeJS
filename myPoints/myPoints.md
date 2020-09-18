# MyPoints.

I use <b>MyPoints</b> in my [three.js](https://threejs.org/) projects for create THREE.Points.

## Quick start

Create your web page. [Example](https://threejs.org/docs/index.html#manual/en/introduction/Creating-a-scene).

* First, import [three.js](https://github.com/anhr/three.js) in your JavaScript module.
```
import * as THREE from 'https://threejs.org/build/three.module.js';
```
or
```
import { THREE } from 'https://raw.githack.com/anhr/commonNodeJS/master/three.js';
```
or download [three.js](https://github.com/anhr/three.js) repository into your "[folderName]\three.js\dev" folder.
```
import * as THREE from './three.js/dev/build/three.module.js';
```

The easiest way to use <b>MyPoints</b> in your code is import MyPoints from myPoints.js file in your JavaScript module.
```
import MyPoints from 'https://raw.githack.com/anhr/commonNodeJS/master/myPoints/myPoints.js';
```
or
* Create a folder on your localhost named as [folderName].
* Add your web page into [folderName].
* Download [commonNodeJS](https://github.com/anhr/commonNodeJS) repository into your "[folderName]\commonNodeJS\master" folder.
```
import MyPoints from './commonNodeJS/master/myPoints/myPoints.js';
```
Now you can use <b>MyPoints</b> in your javascript code. Example:
```
const arrayFuncs = [
	new THREE.Vector3( 0.5, 0.5, 0.5 ),//first point
	new THREE.Vector3( -0.5, -0.5, -0.5 ),//second point
];
MyPoints( THREE, arrayFuncs, scene );
```
You can see two small white points on your canvas.

### Change points size to 25 and point color of the first point to green.
```
const arrayFuncs = [
	new THREE.Vector4(
		0.5,//x
		0.5,//y
		0.5,//z
		33//w - color of the point is green
	),//first point
	new THREE.Vector3( -0.5, -0.5, -0.5 ),//second point
];
MyPoints( THREE, arrayFuncs, scene, {

	options: {

		point: { size: 25 },//new size of all points

	}

} );
```
Attention please: I have changed first point from <b>THREE.Vector3</b> to <b>THREE.Vector4</b>. 
<b>w</b> coordinate of the first point is index of the color of the [color palette](https://github.com/anhr/commonNodeJS/tree/master/colorpicker).
Currently I use default [ColorPicker.paletteIndexes.BGRW](https://raw.githack.com/anhr/commonNodeJS/master/colorpicker/Example/index.html#BGRW) (blue, green, red, white) palette.
33 value of <b>w</b> coordinate of the first point is index of the green color for default color palette.
You can select another palette. Please import <b>ColorPicker</b> into your web page for it.
```
import ColorPicker from 'https://raw.githack.com/anhr/commonNodeJS/master/colorpicker/colorpicker.js';
```
or download [commonNodeJS](https://github.com/anhr/commonNodeJS) repository into your "[folderName]\commonNodeJS\master" folder.
```
import ColorPicker from './commonNodeJS/master/colorpicker/colorpicker.js';
```
Set <b>THREE</b> for palette.
```
ColorPicker.palette.setTHREE(THREE);
```
Create a palette. For example [ColorPicker.paletteIndexes.bidirectional](https://raw.githack.com/anhr/commonNodeJS/master/colorpicker/Example/index.html#Bidirectional) palette
and add new <b>palette</b> into <b>options</b> of the <b>MyPoints</b>
```
MyPoints( THREE, arrayFuncs, scene, {

	options: {

		point: { size: 25 },//new size of all points
		palette: new ColorPicker.palette( { palette: ColorPicker.paletteIndexes.bidirectional } ),

	}

} );
```
33 value of <b>w</b> coordinate of the first point is index of the dark color for [ColorPicker.paletteIndexes.bidirectional](https://raw.githack.com/anhr/commonNodeJS/master/colorpicker/Example/index.html#Bidirectional) palette.
### [Raycaster](https://threejs.org/docs/index.html#api/en/core/Raycaster).

First, import <b>StereoEffect</b>.
```
import { StereoEffect } from 'https://raw.githack.com/anhr/commonNodeJS/master/StereoEffect/StereoEffect.js';
```
or download [commonNodeJS](https://github.com/anhr/commonNodeJS) repository into your "[folderName]\commonNodeJS\master" folder.
```
import { StereoEffect } from './commonNodeJS/master/StereoEffect/StereoEffect.js';
```
Create raycaster.
```
//Raycaster.

const stereoEffect = new StereoEffect( THREE, renderer );
stereoEffect.setSize( window.innerWidth, window.innerHeight );

const raycaster = new THREE.Raycaster();
raycaster.setStereoEffect( {

	renderer: renderer,
	camera: camera,

} );

//the precision of the raycaster when intersecting objects, in world units.
//See https://threejs.org/docs/#api/en/core/Raycaster.params.
raycaster.params.Points.threshold = 0.1;
```
Add new <b>raycaster</b> into <b>options</b> of the <b>MyPoints</b>.
```
const cursor = renderer.domElement.style.cursor;
MyPoints( THREE, arrayFuncs, scene, {

	options: {
		point: { size: 25 },
		palette: new ColorPicker.palette( { palette: ColorPicker.paletteIndexes.bidirectional } ),
		raycaster: {

			addParticle: function ( item ) {

				if ( raycaster.stereo !== undefined )
					raycaster.stereo.addParticle( item );

			},
			onIntersection: function ( intersection, mouse ) {

				renderer.domElement.style.cursor = 'pointer';

			},
			onIntersectionOut: function () {

				renderer.domElement.style.cursor = cursor;

			},
			onMouseDown: function ( intersection ) {

				alert( 'You have clicked over point' );

			},

		}

	},

} );
```
Please move mouse over any point. Mouse cursor will change to "pointer".
You can see an alert if you click a point.
