# StereoEffect.

Uses dual PerspectiveCameras for [Parallax Barrier](https://en.wikipedia.org/wiki/Parallax_barrier) effects.

## Quick start

* Create a folder on your localhost named as [folderName].
* Add your veb page into [folderName]. See [example](https://raw.githack.com/anhr/commonNodeJS/master/StereoEffect/Examples/) web page.

* import [three.js](https://github.com/anhr/three.js)
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

The easiest way to use StereoEffect in your code is import StereoEffect from StereoEffect.js file in your JavaScript module. [Example](https://raw.githack.com/anhr/commonNodeJS/master/StereoEffect/Examples/)
```
import { StereoEffect, spatialMultiplexsIndexs } from 'https://raw.githack.com/anhr/commonNodeJS/master/StereoEffect/StereoEffect.js';
```
or download [commonNodeJS](https://github.com/anhr/commonNodeJS) repository into your "[folderName]\commonNodeJS\master" folder.
```
import { StereoEffect, spatialMultiplexsIndexs } from './commonNodeJS/master/StereoEffect/StereoEffect.js';
```

Now you can use StereoEffect in your javascript code. See [StereoEffect API](https://raw.githack.com/anhr/commonNodeJS/master/StereoEffect/jsdoc/index.html) for details.

* Create the StereoEffect instance.
```
var stereoEffect;
stereoEffect = new StereoEffect( THREE, renderer, {

	spatialMultiplex: spatialMultiplexsIndexs.SbS,//Side by side stereo effect
	far: camera.far,
	camera: camera,

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
Now you can see, canvas was divided to left and right scenes.
* Using [dat.gui](https://github.com/anhr/dat.gui) for change of the StereoEffect settings.

Import dat.gui.
```
import { dat } from 'https://raw.githack.com/anhr/commonNodeJS/master/dat/dat.module.js';
```
or download [commonNodeJS](https://github.com/anhr/commonNodeJS) repository into your "[folderName]\commonNodeJS\master" folder.
```
import { dat } from './commonNodeJS/master/dat/dat.module.js';
```
Add StereoEffect setting into gui.
```
const gui =  new dat.GUI();
stereoEffect.gui( gui, {

	//getLanguageCode: getLanguageCode,
	//cookie: cookie,//Saves a custom Stereo Effects settings in the cookie

} );
```
If you want to localize the gui, please uncomment
```
getLanguageCode: getLanguageCode,
```
line above and import getLanguageCode.
```
import { getLanguageCode } from 'https://raw.githack.com/anhr/commonNodeJS/master/lang.js';
```
or download [commonNodeJS](https://github.com/anhr/commonNodeJS) repository into your "[folderName]\commonNodeJS\master" folder.
```
import { getLanguageCode } from './commonNodeJS/master/lang.js';
```
If you want save a custom StereoEffect settings to the cookie, please uncomment
```
cookie: cookie,
```
line in the stereoEffect.gui(...) above and import cookie.
```
import cookie from 'https://raw.githack.com/anhr/cookieNodeJS/master/cookie.js';
```
or download [cookieNodeJS](https://github.com/anhr/cookieNodeJS) repository into your "[folderName]\cookieNodeJS\master" folder.
```
import cookie from './cookieNodeJS/master/cookie.js';
```

* [Raycaster](https://threejs.org/docs/index.html#api/en/core/Raycaster). Raycasting is used for mouse picking (working out what objects in the 3d space the mouse is over) amongst other things.

Get default cursor
```
const cursor = renderer.domElement.style.cursor;
```
Define of the actions for objects in the 3d space the mouse is over.
```
points.userData.raycaster = {

	onIntersection: function ( intersection ) {

		renderer.domElement.style.cursor = 'pointer';

	},
	onIntersectionOut: function ( ) {

		renderer.domElement.style.cursor = cursor;

	},
	onMouseDown: function ( intersect ) {

		alert( 'You have clicked over point' );

	}

}
```
points - The [Object3D](https://threejs.org/docs/index.html#api/en/core/Object3D) to check for intersection with the ray.

Create the THREE.Raycaster instance.
```
var raycaster;
raycaster = new THREE.Raycaster();

//the precision of the raycaster when intersecting objects, in world units.
//See https://threejs.org/docs/#api/en/core/Raycaster.params.
raycaster.params.Points.threshold = 0.1;

raycaster.setStereoEffect( {

	renderer: renderer,
	camera: camera,
	stereoEffect: stereoEffect,
	onIntersection: function ( intersects, mouse ) {

		var intersection = intersects[0];
		if (
			( intersection.object.userData.raycaster !== undefined )
			&& ( intersection.object.userData.raycaster.onIntersection !== undefined ) ) {

			intersection.object.userData.raycaster.onIntersection( intersection );

		}

	},
	onIntersectionOut: function ( intersects ) { points.userData.raycaster.onIntersectionOut() },
	onMouseDown: function ( intersects ) {

		var intersection = intersects[0];
		if (
			( intersection.object.userData.raycaster !== undefined )
			&& ( intersection.object.userData.raycaster.onMouseDown !== undefined ) ) {

			intersection.object.userData.raycaster.onMouseDown( intersection );

		}

	}

} );
raycaster.stereo.addParticle( points );
```
Add event listeners.
```
const mouse = new THREE.Vector2();
window.addEventListener( 'mousemove', function( event ) {

	// calculate mouse position in normalized device coordinates
	// (-1 to +1) for both components

	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

	// update the picking ray with the camera and mouse position
	raycaster.setFromCamera( mouse, camera );

	raycaster.stereo.onDocumentMouseMove( event );

}, false );
window.addEventListener( 'mousedown', function( event ) {

	raycaster.stereo.onDocumentMouseDown( event );

}, false );
```
For testing please move cursor over point. Cursor will be changing to 'pointer'.
You can see an alert if you click over point.
