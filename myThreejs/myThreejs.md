# AxesHelper.

An axis object to visualize the 1, 2 or 3 axes. I use AxesHelper in my [three.js](https://threejs.org/) projects.

## Quick start

### AxesHelper.

The easiest way to use AxesHelper in your code is import AxesHelper from AxesHelper.js file in your JavaScript module.
[Example](https://github.com/anhr/AxesHelper/blob/master/Examples/AxesHelper.html).
```
import { AxesHelper } from 'https://raw.githack.com/anhr/AxesHelper/master/AxesHelper.js';
```
or

* Create a folder on your localhost named as [folderName].
* Add your web page into [folderName]. See [example](https://github.com/anhr/AxesHelper/blob/master/Examples/AxesHelper.html) web page.
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
* Download [AxesHelper](https://github.com/anhr/AxesHelper) repository into your "[folderName]\AxesHelper\master" folder.
```
import { AxesHelper } from './AxesHelper/master/AxesHelper.js';
```

Now you can use AxesHelper in your javascript code.

The simplest AxesHelper has at least one axis.
```
new AxesHelper( THREE, scene, { scales: { x: {} } } );
```

Now we want to create AxesHelper 3 dimensional axes.

Name of the X is 'time'. Number of X scale marks is 5.

Minimum Y is 0.
Please edit line above for it.
```
const axesHelper = new AxesHelper( THREE, scene, {

	scales: {

		text: {

			//Please specify the textHeight if you want the changing of the text height is available in gui.
			//Default textHeight is 0.04
			textHeight: 0.04,

			//fov: camera.fov,

			//Precision of the scale marks is 3 digit.
			//Please specify the precision if you want the changing of the precision is available in gui.
			//Default precision is 4.
			precision: 3,

		},
		x: {
		
			name: 'time',
			marks: 5
		
		},
		y: {
		
			min: 0,
		
		},
		z: {}

	}

} );
```
Currently the z axis is exists but not visible. Move camera for resolving of issue.
```
camera.position.copy( new THREE.Vector3( 0.4, 0.4, 2 ) );
camera.rotation.set( -0.1973955598498808, 0.19365830044432672, 0.03847102740732835 );
```
You can use the [THREE.OrbitControls](https://threejs.org/docs/index.html#examples/en/controls/OrbitControls) to rotate the camera.

Import OrbitControls,
```
import { OrbitControls } from 'https://raw.githack.com/anhr/three.js/dev/examples/jsm/controls/OrbitControls.js';
```
and edit your code
```
//camera.rotation.set( -0.1973955598498808, 0.19365830044432672, 0.03847102740732835 );
const controls = new OrbitControls( camera, renderer.domElement );
controls.target.set( scene.position.x * 2, scene.position.y * 2, scene.position.z * 2 );
controls.update();
```

You can use [Raycaster](https://threejs.org/docs/index.html#api/en/core/Raycaster) for mouse picking (working out what objects in the 3d space the mouse is over).

Please create an 3D object, for example points.
```
const points = new THREE.Points( new THREE.BufferGeometry().setFromPoints( [
		new THREE.Vector3( 0.5, 0.5 ,0.5 ),
		new THREE.Vector3( -0.4, -0.5 ,-0.5 )
	] ),
	new THREE.PointsMaterial( {

		color: 0xffffff,
		size: 5,//0.05,
		sizeAttenuation: false,
		alphaTest: 0.5,

	} ) );
scene.add( points );
```
Import [StereoEffect](https://github.com/anhr/commonNodeJS/blob/master/StereoEffect/README.md).
```
import StereoEffect from 'https://raw.githack.com/anhr/commonNodeJS/master/StereoEffect/StereoEffect.js';
```
or 
download [commonNodeJS](https://github.com/anhr/commonNodeJS) repository into your "[folderName]\commonNodeJS\master" folder.
```
import StereoEffect from './commonNodeJS/master/StereoEffect/StereoEffect.js';
```

* Create the StereoEffect instance.
```
const stereoEffect = new StereoEffect( THREE, renderer, {

	//spatialMultiplex: StereoEffect.spatialMultiplexsIndexs.SbS,//Side by side stereo effect
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

		if ( axesHelper )
			axesHelper.exposePosition( intersect );
		if ( guiSelectPoint )
			guiSelectPoint.select( intersect );

	}

}
```

Create the THREE.Raycaster instance.
```
const raycaster = new THREE.Raycaster();

//the precision of the raycaster when intersecting objects, in world units.
//See https://threejs.org/docs/#api/en/core/Raycaster.params.
raycaster.params.Points.threshold = 0.1;

raycaster.setStereoEffect( {

	renderer: renderer,
	camera: camera,
	stereoEffect: stereoEffect,

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
window.addEventListener( 'pointerdown', function( event ) {

	raycaster.stereo.onDocumentMouseDown( event );

}, false );
```
For testing please move cursor over point. Cursor will be changing to 'pointer'.

You can see a dot lines from point to axes if you click over point.

You can display a text if mouse is over to object in the 3d space.

Import SpriteText for it.
```
import { SpriteText } from 'https://raw.githack.com/anhr/SpriteText/master/SpriteText.js';
```
or
download [SpriteText](https://github.com/anhr/SpriteText) repository into your "[folderName]\SpriteText\master" folder.
```
import { SpriteText } from './SpriteText/master/SpriteText.js';
```
Set THREE to SpriteText.
```
SpriteText.setTHREE( THREE );
```
and edit points.userData.raycaster
```
points.userData.raycaster = {

	onIntersection: function ( intersection ) {

		if ( ( typeof SpriteText !== 'undefined' ) && !this.spriteText ) {

			function getIntersectionPosition( intersection )
				{ return new THREE.Vector3().fromArray( points.geometry.attributes.position.array, intersection.index * points.geometry.attributes.position.itemSize ); }

			const position = getIntersectionPosition( intersection );
			//console.warn( 'onIntersection x = ' + position.x + ' y =  ' + position.y + ' z = ' +  position.z );

			var x, y, z;
			if ( axesHelper ) {

				const scales = axesHelper.options.scales;
				x = scales.x.name;
				y = scales.y.name;
				z = scales.z.name;

			} else {

				x = 'x';
				y = 'y';
				z = 'z';

			}
			this.spriteText = new SpriteText(
				( intersection.object.name === '' ? '' : intersection.object.name + '\n' ) +
				'Point\n' + x + ' = ' + position.x + '\n' + y + ' =  ' + position.y + '\n' + z + ' = ' +  position.z,
				position, {

					group: scene,
					rect: {

						displayRect: true,
						borderRadius: 15,

					},
					center: new THREE.Vector2( 1, 0 ),
					//sizeAttenuation: true,

				}
			);

		}
		renderer.domElement.style.cursor = 'pointer';

	},
	onIntersectionOut: function ( ) {

		if ( this.spriteText ) {

			scene.remove( this.spriteText );
			delete this.spriteText;

		}
		renderer.domElement.style.cursor = cursor;

	},
	onMouseDown: function ( intersect ) {

		if ( axesHelper )
			axesHelper.exposePosition( intersect );
		if ( guiSelectPoint )
			guiSelectPoint.select( intersect );

	}

}
```
### AxesHelperGui

Add AxesHelperGui into [dat.gui](https://github.com/anhr/dat.gui) for manual change settings of the AxesHelper.
[Example](https://raw.githack.com/anhr/AxesHelper/master/Examples/AxesHelperGui.html)

Import dat.gui.
```
import { dat } from 'https://raw.githack.com/anhr/commonNodeJS/master/dat/dat.module.js';
```
or download [commonNodeJS](https://github.com/anhr/commonNodeJS) repository into your "[folderName]\commonNodeJS\master" folder.
```
import { dat } from './commonNodeJS/master/dat/dat.module.js';
```
Import AxesHelperGui.
```
import { AxesHelperGui } from 'https://raw.githack.com/anhr/AxesHelper/master/AxesHelperGui.js';
```
or

* Download [AxesHelper](https://github.com/anhr/AxesHelper) repository into your "[folderName]\AxesHelper\master" folder.
```
import { AxesHelperGui } from './AxesHelper/master/AxesHelperGui.js';
```

Now you can use AxesHelperGui in your javascript code.
```
const gui =  new dat.GUI();
AxesHelperGui( axesHelper, gui, {

	//cookie: cookie,
	//getLanguageCode: getLanguageCode,

} );
```
Now you can see the "Axes Helper" folder in the dat.gui.

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
If you want save a custom AxesHelper settings to the cookie, please uncomment
```
cookie: cookie,
```
line in the SpriteTextGui.gui(...) above and import cookie.
```
import cookie from 'https://raw.githack.com/anhr/commonNodeJS/master/cookieNodeJS/cookie.js';
```
or download [commonNodeJS](https://github.com/anhr/commonNodeJS) repository into your "[folderName]\commonNodeJS\master" folder.
```
import cookie from './commonNodeJS/master/cookieNodeJS/cookie.js';
```

Add [guiSelectPoint](../../../commonNodeJS/master/guiSelectPoint/jsdoc/index.html) into [dat.gui](https://github.com/anhr/dat.gui) for select a point from the mesh.

Sometimes you need to move a group of meshes for better visualization. Use [MoveGroup](../../../commonNodeJS/master/MoveGroup.js) for it.

Import MoveGroup.
```
import { MoveGroup } from 'https://raw.githack.com/anhr/commonNodeJS/master/MoveGroup.js';
```
or download [commonNodeJS](https://github.com/anhr/commonNodeJS) repository into your "[folderName]\commonNodeJS\master" folder.
```
import { MoveGroup } from './commonNodeJS/master/MoveGroup.js';
```
```
const moveGroup = new MoveGroup( scene, {

	//cookie: cookie,
	axesHelper: axesHelper,

} );
moveGroup.gui( gui, {

	//getLanguageCode: getLanguageCode,
	lang: { moveGroup: 'Move points', },//name of the moveGroup folder. Default is 'Move Group'
	guiSelectPoint: guiSelectPoint,

} );
```
Now you can see the 'Move points' folder in the dat.gui.
You can move, scale and rotate the scene. Unfortunately, you also move the axes.
For resolving of the issue, create groupMove and move all your meshs from scene to groupMove.
```
const groupMove = new THREE.Group();
scene.add( groupMove );

//Remove points from scene
//scene.add( points );

groupMove.add( points );
```
Move groupMove instead of the scene. Replace scene to groupMove in the new MoveGroup
```
const moveGroup = new MoveGroup( groupMove, {

	//cookie: cookie,
	axesHelper: axesHelper,

} );
```
Enjoy my code :)
