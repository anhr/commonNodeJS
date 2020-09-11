# MyPoints.

I use <b>MyPoints</b> in my [three.js](https://threejs.org/) projects for create THREE.Points.

## Quick start

Create your web page. [Example](https://threejs.org/docs/index.html#manual/en/introduction/Creating-a-scene).

The easiest way to use <b>MyPoints</b> in your code is import MyPoints from myPoints.js file in your JavaScript module.
```
import MyPoints from 'https://raw.githack.com/anhr/commonNodeJS/master/myPoints/myPoints.js';
```
or
* Create a folder on your localhost named as [folderName].
* Add your web page into [folderName].
* Download [cookieNodeJS](https://github.com/anhr/cookieNodeJS) repository into your "[folderName]\cookieNodeJS\master" folder.
* Download [commonNodeJS](https://github.com/anhr/commonNodeJS) repository into your "[folderName]\commonNodeJS\master" folder.
```
import Player from './commonNodeJS/master/player/player.js';
import getShaderMaterialPoints from './commonNodeJS/master/getShaderMaterialPoints/getShaderMaterialPoints.js';
```
Now you can use <b>getShaderMaterialPoints</b> in your javascript code. Example:
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

			}

		),
		trace: true,//Displays the trace of the point movement.

	},
	new THREE.Vector3( -0.5, -0.5, -0.5 ),
];
getShaderMaterialPoints( THREE, scene, arrayFuncs, Player, function ( points ) {

	scene.add( points );
	points.userData.player = {

		arrayFuncs: arrayFuncs,
		selectPlayScene: function ( t ) {

			points.position.x = t;
			points.rotation.z = - Math.PI * 2 * t;

		}

	}

} );
```

