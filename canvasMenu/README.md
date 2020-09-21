# CanvasMenu
My dropdown menu for canvas in my version of [dat.gui](https://github.com/anhr/dat.gui).

Uses in my projects:
 * [DropdownMenu](https://github.com/anhr/commonNodeJS/tree/master/DropdownMenu)
 * [myThreejs](https://github.com/anhr/myThreejs)

## Packaged Builds
The easiest way to use CanvasMenu in your code is by using the built source at `build/canvasMenu.js`. These built JavaScript files bundle all the necessary dependencies.

In your `head` tag, include the following code:
```
<script src="https://raw.githack.com/anhr/commonNodeJS/master/canvasMenu/build/canvasMenu.js"></script>
```
or
```
<script src="https://raw.githack.com/anhr/commonNodeJS/master/canvasMenu/build/canvasMenu.min.js"></script>
```
or you can import CanvasMenu from canvasMenu.js file in your JavaScript module. [Example.](https://raw.githack.com/anhr/myThreejs/master/Examples/html/)
```
import CanvasMenu from 'https://raw.githack.com/anhr/commonNodeJS/master/canvasMenu/canvasMenu.js';
```
or
* Create a folder on your localhost named as [folderName].
* Add your web page into [folderName]. See [example](https://raw.githack.com/anhr/commonNodeJS/master/player/Examples/index.html) web page.
* Download [commonNodeJS](https://github.com/anhr/commonNodeJS) repository into your "[folderName]\commonNodeJS\master" folder.
```
import CanvasMenu from './commonNodeJS/master/canvasMenu/canvasMenu.js';
```

Now you can use CanvasMenu for append to the canvas.

### CanvasMenu( elContainer, options );

Creates new menu.

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| elContainer | <code>HTMLElement|String</code> |  | if the HTMLElement is a container element for canvas. If the String is id of a container element for canvas. |
| [options] | <code>Object</code> |  | optional options. |
| [options.stereoEffect] | <code>Object</code> |  | new THREE.StereoEffect(...) https://github.com/anhr/three.js/blob/dev/examples/js/effects/StereoEffect.js |

**Example.**  
```
<div id="canvasContainer"></div>
<script>
var stereoEffect = new THREE.StereoEffect(...);
var playController = controllerPlay.create(...);
var elContainer = document.getElementById( "canvasContainer" )
new CanvasMenu( elContainer, {

	stereoEffect: stereoEffect,

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
