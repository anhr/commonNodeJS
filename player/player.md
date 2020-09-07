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
* Download [colorPicker](https://github.com/anhr/colorPicker) repository into your "[folderName]\colorPicker\master" folder.
* Download [loadScriptNodeJS](https://github.com/anhr/loadScriptNodeJS) repository into your "[folderName]\loadScriptNodeJS\master" folder.
* Download [loadFileNodeJS](https://github.com/anhr/loadFileNodeJS) repository into your "[folderName]\loadFileNodeJS\master" folder.
```
import Player from './commonNodeJS/master/player/player.js';
```

Now you can use Player in your javascript code.

First create a 3d object, for example Points:

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

Add Player.

```
const player = new Player();
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
	s
		color: 0xffffff,
		size: 0.2,

	} ) );
```
Currently [Player.getPoints(...)](https://raw.githack.com/anhr/commonNodeJS/master/player/jsdoc/module-Player.html#~Player.getPoints) returns an array of the vectors for t = 0.

* Define the `points.userData.player` object in your code for including of the points into Player.
Include `arrayFuncs` into `points.userData.player` object if you want to move points during playing.
```
points.userData.player = {

	arrayFuncs: arrayFuncs,

}
```
* Edit Player
```
const player = new Player(function ( index, t ) {

		Player.selectPlayScene( THREE, scene, t, index );

	});
```
Start playing.
```
player.play3DObject();
```
* Add `player.animate();` into animate function.
```
var animate = function () {

	requestAnimationFrame( animate );

	renderer.render( scene, camera );

	if ( player !== undefined )
		player.animate();

};
```

## Directory Contents

```
└── build - Compiled source code.
```

## Building your own Player

In the terminal, enter the following:

```
$ npm install
$ npm run build
```
