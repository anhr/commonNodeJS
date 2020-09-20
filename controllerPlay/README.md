# controllerPlay
node.js version of the controllerPlay.
My custom controller in my version of [dat.gui](https://github.com/anhr/dat.gui) for playing of 3D obects in my projects.
[Example](https://raw.githack.com/anhr/controllerPlay/master/Examples/html/).

Uses in my projects:
 * [DropdownMenu](https://github.com/anhr/DropdownMenu)

## Packaged Builds
The easiest way to use controllerPlay in your code is by using the built source at `build/controllerPlay.js`. These built JavaScript files bundle all the necessary dependencies to run controllerPlay.

In your `head` tag, include the following code:
```
<script src="https://raw.githack.com/anhr/commonNodeJS/master/loadScriptNodeJS/build/loadScript.js"></script>
<script src="https://raw.githack.com/anhr/controllerPlay/master/build/controllerPlay.js"></script>
```
or
```
<script src="https://raw.githack.com/anhr/commonNodeJS/master/loadScriptNodeJS/build/loadScript.min.js"></script>
<script src="https://raw.githack.com/anhr/controllerPlay/master/build/controllerPlay.min.js"></script>
```
or you can import controllerPlay from controllerPlay.js file in your JavaScript module. [Example.](https://raw.githack.com/anhr/myThreejs/master/Examples/html/)
```
import controllerPlay from 'https://raw.githack.com/anhr/controllerPlay/master/controllerPlay.js';
```

Now you can use window.controllerPlay for append to the dat.gui.

### controllerPlay.create( group, events )

Creates new Play controller.

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| group | <code>THREE.Group</code> |  | group of 3D objects for playing. See https://threejs.org/docs/index.html#api/en/objects/Group for details. |
| [events] | <code>Object</code> | "" | controller events. Default no events is sent to your web page. |
| [events.onShowObject3D] | <code>callback</code> |  | The show 3D object event. callback function ( objects3DItem, index ) objects3DItem: showed mesh, index: index of showed mesh.|
| [events.onHideObject3D] | <code>callback</code> |  | The hide 3D object event. callback function ( objects3DItem ). objects3DItem is selected mesh. |
| [events.onRestoreObject3D] | <code>callback</code> |  | Event of restore of 3D object to original state. callback function ( objects3DItem ). objects3DItem is selected mesh. |
| [events.onSelectedObject3D] | <code>callback</code> |  | Event of selecting of 3D object. callback Function( objects3DItem, index ) objects3DItem: selected mesh, index: index of selected mesh. |
| [events.onRenamePlayButton] | <code>callback</code> |  | Event of renaming of the Play button. callback function ( name, title ) name: name of the Play button, title: title, [play] true - start playing. |
| [events.onRenameRepeatButton] | <code>callback</code> |  | Event of renaming of the Repeat button. callback function ( title, color ) title: title of the Repeat button, color: style.color of the Repeat button. |

**Example.**  
```
<script>
group = new THREE.Group();
group.add( new THREE.Points( ... ) );
group.add( new THREE.Mesh( ... ) );

var gui = new dat.GUI();
var colorRed = new THREE.Color( 0xff0000 );
gui.add( controllerPlay.create( group, {

	onShowObject3D: function ( objects3DItem ) {

		objects3DItem.visible = true;

	},
	onHideObject3D: function ( objects3DItem ) {

		objects3DItem.visible = false;//hide object3D

	},
	onSelectedObject3D: function ( objects3DItem ) {

		objects3DItem.material.color = colorRed;
		objects3DItem.visible = true;

	},
	onRestoreObject3D: function ( objects3DItem ) {

		objects3DItem.material.color = objects3DItem.userData.color;
		objects3DItem.visible = true;

	},
	onRenamePlayButton: function ( name, title ) {

		var elMenuButtonPlay = document.getElementById( 'menuButtonPlay' );
		elMenuButtonPlay.innerHTML = name;
		elMenuButtonPlay.title = title;

	},
	onRenameRepeatButton: function ( title, color ) {

		var elMenuButtonRepeat = document.getElementById( 'menuButtonRepeat' );
		elMenuButtonRepeat.style.color = color;;
		elMenuButtonRepeat.title = title;

	},

} ) );
</script>
```

## Directory Contents

```
└── build - Compiled source code.
```

## Building your own controllerPlay

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

	Samsung Galaxy S5

	FireFox 67

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
