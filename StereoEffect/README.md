# StereoEffect.

Uses dual PerspectiveCameras for [Parallax Barrier](https://en.wikipedia.org/wiki/Parallax_barrier) effects.

I use StereoEffect in my [three.js](https://threejs.org/) projects.
[Example](https://raw.githack.com/anhr/commonNodeJS/master/StereoEffect/Examples/).

Uses in my projects:
 * [AxesHelper](https://github.com/anhr/AxesHelper)
 * [myThreejs](https://github.com/anhr/myThreejs)

## Quick start

* Create a folder on your localhost named as [folderName].
* Download [three.js](https://github.com/anhr/three.js) repository into your "[folderName]\three.js\dev" folder.
* Download [commonNodeJS](https://github.com/anhr/commonNodeJS) repository into your "[folderName]\commonNodeJS\master" folder.
* Download [cookieNodeJS](https://github.com/anhr/cookieNodeJS) repository into your "[folderName]\cookieNodeJS\master" folder.
* Download [dat.gui](https://github.com/anhr/dat.gui) repository into your "[folderName]\dat.gui\CustomController" folder.
* Open http://localhost/[folderName]/commonNodeJS/master/StereoEffect/Examples/index.html for testing of your downloads.

The easiest way to use StereoEffect in your code is import StereoEffect from StereoEffect.js file in your JavaScript module. [Example](https://raw.githack.com/anhr/commonNodeJS/master/StereoEffect/Examples/)
```
import { StereoEffect, spatialMultiplexsIndexs } from './StereoEffect.js';
```
or
```
import { AxesHelper } from 'https://raw.githack.com/anhr/commonNodeJS/master/StereoEffect/StereoEffect.js';
```

Now you can use StereoEffect in your javascript code. See [StereoEffect API](https://raw.githack.com/anhr/commonNodeJS/master/jsdoc/StereoEffect/index.html) for details.

* Create the StereoEffect instance.
```
var stereoEffect;
stereoEffect = new StereoEffect( THREE, renderer, {

	spatialMultiplex: spatialMultiplexsIndexs.SbS,//Side by side stereo effect
	far: camera.far,
	camera: camera,
	cookie: cookie,//Saves a custom Stereo Effects settings in the cookie

} );
stereoEffect.setSize( window.innerWidth, window.innerHeight );
```
Add code into animate function
```
function animate() {

	requestAnimationFrame( animate );

	if ( stereoEffect === undefined )
		renderer.render( scene, camera );
	else stereoEffect.render( scene, camera );

}
```

## On the following browsers have been successfully tested:

Windows 10

	IE 11 Fatal error: Your browser do not support modular JavaScript code

	Microsoft Edge 44

	Chrome 83

	Opera 68

	Safari 5.1.7 Fatal error: Your browser do not support modular JavaScript code

	FireFox 72

Android 6.0.1

	Chrome 83

	Samsung Internet 12

	FireFox 68

	Opera 59

	Opera Mini 50

LG Smart tv

	Chrome - Fatal error: Your browser do not support modular JavaScript code


 ## Have a job for me?
Please read [About Me](https://anhr.github.io/AboutMe/).
