# SpriteText.

A [sprite](https://threejs.org/docs/index.html#api/en/objects/Sprite) based text component. SpriteText is a text that always faces towards the camera.

## Quick start

* Create a folder on your localhost named as [folderName].
	* Download [three.js](https://github.com/anhr/three.js) repository into your "[folderName]\three.js\dev" folder.
	* Download [commonNodeJS](https://github.com/anhr/commonNodeJS) repository into your "[folderName]\commonNodeJS\master" folder.
* Add your web page into [folderName]. Example:
```
<!DOCTYPE html>

<html>
<head>
	<title>SpriteText</title>

	<link type="text/css" rel="stylesheet" href="https://threejs.org/examples/main.css">
	<!--<link type="text/css" rel="stylesheet" href="three.js/dev/examples/main.css">-->

	<!-- Three.js Full Screen Issue https://stackoverflow.com/questions/10425310/three-js-full-screen-issue/15633516 -->
	<link type="text/css" rel="stylesheet" href="https://raw.githack.com/anhr/commonNodeJS/master/css/main.css">
	<!--<link type="text/css" rel="stylesheet" href="commonNodeJS/master/css/main.css">-->

	<!--<script src="./three.js/dev/build/three.js"></script>-->
	<!--<script src="./three.js/dev/build/three.min.js"></script>-->
	<!--<script src="https://raw.githack.com/anhr/three.js/dev/build/three.js"></script>-->
	<!--<script src="https://raw.githack.com/anhr/three.js/dev/build/three.min.js"></script>-->
	<!--<script src="https://threejs.org/build/three.js"></script>-->
	<!--<script src="https://threejs.org/build/three.min.js"></script>-->
</head>
<body>
	<script nomodule>alert( 'Fatal error: Your browser do not support modular JavaScript code.' );</script>
	<div id="info">
		<a href="https://threejs.org/" target="_blank" rel="noopener">three.js</a>
		- <a href="https://github.com/anhr/commonNodeJS/tree/master/SpriteText" target="_blank" rel="noopener">SpriteText</a>.
		By <a href="https://github.com/anhr" target="_blank" rel="noopener">anhr</a>
	</div>
	<div>
		<canvas id="canvas"></canvas>
	</div>

	<script type="module">

		import * as THREE from './three.js/dev/build/three.module.js';
		//import * as THREE from 'https://threejs.org/build/three.module.js';
		//import * as THREE from 'https://raw.githack.com/anhr/three.js/dev/build/three.module.js';

		import three from './commonNodeJS/master/three.js'
		three.THREE = THREE;

		import Options from './commonNodeJS/master/Options.js'

		var camera, scene, renderer;

		init();
		animate();

		function init() {

			camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
			camera.position.copy( new THREE.Vector3( 0.4, 0.4, 2 ) );

			scene = new THREE.Scene();

			const options = new Options();

			renderer = new THREE.WebGLRenderer( {

				antialias: true,
				canvas: document.getElementById( 'canvas' ),

			} );
			renderer.setSize( window.innerWidth, window.innerHeight );

			window.addEventListener( 'resize', onWindowResize, false );

			//Orbit controls allow the camera to orbit around a target.
			//https://threejs.org/docs/index.html#examples/en/controls/OrbitControls
			options.createOrbitControls( camera, renderer, scene );

		}
		function onWindowResize() {

			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();

			renderer.setSize( window.innerWidth, window.innerHeight );

		}

		function animate() {

			requestAnimationFrame( animate );

			renderer.render( scene, camera );

		}

	</script>
</body>
</html>
```
NOTE. Please include <b>three.THREE = THREE;</b> line into your project before use my [library](https://github.com/anhr/commonNodeJS). See example above.

The easiest way to use <b>SpriteText</b> in your code is import <b>SpriteText</b> from <b>SpriteText.js</b> file in your JavaScript module.

```
import { SpriteText } from './commonNodeJS/master/SpriteText/SpriteText.js';
```

Now you can use <b>SpriteText</b> in your javascript code.

Add to <b>scene</b> a <b>SpriteText</b> with default settings.
```
scene.add( new SpriteText( 'Scene', new THREE.Vector3( 1, 0, 0 ) ) );
```
Please click and drag your mouse over canvas. You can see the "Scene" text that always faces towards the camera.

Define the <b>SpriteText</b> options for all sprite texts you add to the <b>scene</b>. For example:
```
scene.userData.optionsSpriteText = {

	fontColor: 'rgba(0, 255, 0, 1)', //green
	textHeight: 0.2,
	fontFace: 'Times',

};
```
See <b>options</b> parameter of [SpriteText](./module-SpriteText.html) for details.

Plase call
```
SpriteText.updateSpriteTextGroup( scene );
```
after creating of all <b>SpriteText</b> instances for new <b>scene.userData.optionsSpriteText</b> have effect.
Now you can see, your "Scene" text is green, text height is 0.2 and font name is "Times".
* You can create a group of texts with specific settings.
```
const group = new THREE.Group();
group.userData.optionsSpriteText = {

	textHeight: 0.1,

};
scene.add( group );
const spriteTextGroup = new SpriteText( 'group', new THREE.Vector3( -4, 0, 0 ) );
group.add( spriteTextGroup );
```
All <b>SpriteText</b> instances, added into <b>group</b>, have text height is 0.1.
Other settings takes from parent group i.e. from <b>scene</b>. You can see, child group setting have more priority before parent settings.

### SpriteTextGui

Add <b>SpriteTextGui</b> into [dat.gui](https://github.com/anhr/dat.gui) for manual change settings of the <b>SpriteText</b>.
[Example](../Examples/SpriteTextGui.html).

Import <b>dat.gui</b> and add <b>dat</b> into <b>three</b>.
```
import { dat } from './commonNodeJS/master/dat/dat.module.js';
three.dat = dat;
```
Import <b>SpriteTextGui</b>.
```
import { SpriteTextGui } from './commonNodeJS/master/SpriteText/SpriteTextGui.js';
```
Now you can use <b>SpriteTextGui</b> in your javascript code.
```
SpriteTextGui( scene, options );
```
Now you can see new "Sprite Text" folder in upper right corner of the canvas.
User can change <b>Height</b>, <b>Font Face</b> and <b>Font Color</b> of the text.

Note. User can change <b>Height</b> of the "Scene" text, but not "Group" because <b>group</b> have another sprite text height.
If you want the user can to change the height of the "Group" text, please add another <b>SpriteTextGui</b>.
```
SpriteTextGui( group, options, { spriteFolder: 'Sprite Text Setting for group' } );
```
You can add <b>SpriteTextGui</b> for changing options of each sprite test separately. For example edit the "group" </b>SpriteText</b> for it.
```
const optionsIndividual = {

	fontColor: 'rgba(255, 0, 0, 1)',//red

}
const spriteTextGroup = new SpriteText( 'group', new THREE.Vector3( -4, 0, 0 ), optionsIndividual );
```
Now the "group" text is red.

Add new <b>SpriteTextGui</b>.
```
SpriteTextGui( spriteTextGroup, options, {

	spriteFolder: 'Sprite with individual options',
	options: optionsIndividual,

} );
```
Now user can select another color of the "group" text in the "Sprite with individual options" folder.
