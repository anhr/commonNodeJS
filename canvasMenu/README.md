# menuPlay
node.js version of the menuPlay.
My dropdown menu for canvas in my version of [dat.gui](https://github.com/anhr/dat.gui) for playing of 3D obects in my projects.

Uses in my projects:
 * [DropdownMenu](https://github.com/anhr/DropdownMenu)

## Packaged Builds
The easiest way to use menuPlay in your code is by using the built source at `build/menuPlay.js`. These built JavaScript files bundle all the necessary dependencies to run controllerPlay.

In your `head` tag, include the following code:
```
<script src="https://raw.githack.com/anhr/menuPlay/master/build/menuPlay.js"></script>
```
or
```
<script src="https://raw.githack.com/anhr/menuPlay/master/build/menuPlay.min.js"></script>
```
or you can import menuPlay from menuPlay.js file in your JavaScript module. [Example.](https://raw.githack.com/anhr/myThreejs/master/Examples/html/)
```
import menuPlay from 'https://raw.githack.com/anhr/menuPlay/master/menuPlay.js';
```

Now you can use window.menuPlay for append to the dat.gui.

### menuPlay.create(  )

Creates new menu.

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| elContainer | <code>HTMLElement|String</code> |  | if the HTMLElement is a container element for canvas. If the String is id of a container element for canvas. |
| [options] | <code>Object</code> |  | optional options. |
| [options.stereoEffect] | <code>Object</code> |  | new THREE.StereoEffect(...) https://github.com/anhr/three.js/blob/dev/examples/js/effects/StereoEffect.js |
| [options.playController] | <code>Object</code> |  | playController https://github.com/anhr/controllerPlay - my custom controller in my version of [dat.gui](https://github.com/anhr/dat.gui) for playing of 3D obects in my projects. |

**Example.**  
```
<div id="canvasContainer"></div>
<script>
var stereoEffect = new THREE.StereoEffect(...);
var playController = controllerPlay.create(...);
var elContainer = document.getElementById( "canvasContainer" )
menuPlay.create( elContainer, {

	stereoEffect: stereoEffect,
	playController: playController,

} );
</script>
```

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
