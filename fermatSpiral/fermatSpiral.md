# Fermat's spiral.

Implementation of Vogel's model of [Fermat's spiral]{@link https://en.wikipedia.org/wiki/Fermat's_spiral}

# Content
* [Quick start.](#Quickstart)
* [Example of your web page.](#WebPage)

<a name="QuickStart"></a>
## Quick start

* Create a folder on your localhost named as [folderName].
	* Download [three.js](https://github.com/anhr/three.js) repository into your "[folderName]\three.js\dev" folder.
	* Download [commonNodeJS](https://github.com/anhr/commonNodeJS) repository into your "[folderName]\commonNodeJS\master" folder.
* Add your web page into [folderName]. Example:
```
<!DOCTYPE html>

<html>
<head>
	<title>Tesseract</title>

	<link type="text/css" rel="stylesheet" href="https://threejs.org/examples/main.css">
	<!--<link type="text/css" rel="stylesheet" href="three.js/dev/examples/main.css">-->
	<!-- Three.js Full Screen Issue https://stackoverflow.com/questions/10425310/three-js-full-screen-issue/15633516 -->
	<!--<link type="text/css" rel="stylesheet" href="https://raw.githack.com/anhr/commonNodeJS/master/css/main.css">-->
	<link type="text/css" rel="stylesheet" href="commonNodeJS/master/css/main.css">

	<!--
	<script src="./three.js/dev/build/three.js"></script>
	<script src="./three.js/dev/build/three.min.js"></script>
	<script src="https://raw.githack.com/anhr/three.js/dev/build/three.js"></script>
	<script src="https://raw.githack.com/anhr/three.js/dev/build/three.min.js"></script>
	<script src="https://threejs.org/build/three.js"></script>
	<script src="https://threejs.org/build/three.min.js"></script>

	<script src="./commonNodeJS/master/nD/build/nD.js"></script>
	<script src="./commonNodeJS/master/nD/build/nD.min.js"></script>
	<script src="https://raw.githack.com/anhr/commonNodeJS/master/nD/build/nD.js"></script>
	<script src="https://raw.githack.com/anhr/commonNodeJS/master/nD/build/nD.min.js"></script>
	-->
</head>
<body>
	<script nomodule>alert( 'Fatal error: Your browser do not support modular JavaScript code.' );</script>
	<div id="info">
		<a href="https://en.wikipedia.org/wiki/Tesseract" target="_blank">Tesseract</a>.
		<a href="https://threejs.org/" target="_blank" rel="noopener">three.js</a>
		- <a href="https://github.com/anhr/commonNodeJS/tree/master/nD" target="_blank" rel="noopener">N-dimensional graphics</a>.
		By <a href="https://github.com/anhr" target="_blank" rel="noopener">anhr</a>
	</div>
	<div>
		<canvas id="canvas"></canvas>
	</div>
	<script type="module">

		import * as THREE from './three.js/dev/build/three.module.js';
		//import * as THREE from 'https://threejs.org/build/three.module.js';
		//import * as THREE from 'https://raw.githack.com/anhr/three.js/dev/build/three.module.js';

		import MyThree from './commonNodeJS/master/myThree/myThree.js';
		//import MyThree from './commonNodeJS/master/myThree/build/myThree.module.js';
		//import MyThree from './commonNodeJS/master/myThree/build/myThree.module.min.js';
		if ( MyThree.default ) MyThree = MyThree.default;
		MyThree.three.THREE = THREE;

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

			options.createOrbitControls( camera, renderer, scene );

			window.addEventListener( 'resize', onWindowResize, false );

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


	</script></body>
</html>
```
NOTE. Please include <b>MyThree.three.THREE = THREE;</b> line into your project before use my [library](https://github.com/anhr/commonNodeJS). See example above.

The easiest way to use <b>ND</b> in your code is import <b>ND</b> from <b>nD.js</b> file in your JavaScript module.
```
import ND from './commonNodeJS/master/nD/nD.js'
//import ND from './commonNodeJS/master/nD/build/nD.module.js';
//import ND from './commonNodeJS/master/nD/build/nD.module.min.js';
//import ND from 'https://raw.githack.com/anhr/commonNodeJS/master/nD/nD.js';
//import ND from 'https://raw.githack.com/anhr/commonNodeJS/master/nD/build/nD.module.js';
//import ND from 'https://raw.githack.com/anhr/commonNodeJS/master/nD/build/nD.module.min.js';
if ( ND.default ) ND = ND.default;
```

Now you can use <b>ND</b> in your javascript code for creating an N-dimensional graphic object. For example [tesseract](https://en.wikipedia.org/wiki/tesseract).
* Greate tesseract.

Add <b>var _4D</b> before <b>init</b> function.
```
var _4D;
```
Create a tesseract after creating of the <b>scene</b> and <b>options</b> inside of <b>init</b> function.
```
_4D = new ND( 4, {

	object: {

		name: 'tesseract',
		//position: [-0.3],// -0.2, 0.3, 5],
		rotation: [0, 0, 1, 0, 1.1, 1.2],
		geometry: {

			position: [

				//cube 0

				//face 0
				[-0.5, -0.5, -0.5, -0.5],//0
				[-0.5, -0.5, 0.5, -0.5],//1
				[-0.5, 0.5, -0.5, -0.5],//2
				[-0.5, 0.5, 0.5, -0.5],//3

				//face 1
				[0.5, -0.5, -0.5, -0.5],//4
				[0.5, -0.5, 0.5, -0.5],//5

				//face 2
				[0.5, 0.5, -0.5, -0.5],//6

				[0.5, 0.5, 0.5, -0.5],//7

				//cube 1

				//face 6
				[-0.5, -0.5, -0.5, 0.5],//8
				[-0.5, -0.5, 0.5, 0.5],//9
				[-0.5, 0.5, -0.5, 0.5],//10
				[-0.5, 0.5, 0.5, 0.5],//11

				[0.5, -0.5, -0.5, 0.5],//12

				[0.5, -0.5, 0.5, 0.5],//13

				[0.5, 0.5, -0.5, 0.5],//14

				[0.5, 0.5, 0.5, 0.5],//15
			],
			indices: [

				//edges
				[
					//cube 0

					[0, 1],//0
					[1, 3],//1
					[3, 2],//2
					[2, 0],//3

					[4, 0],//4
					[4, 5],//5
					[5, 1],//6

					[6, 2],//7
					[6, 4],//8

					[7, 3],//9
					[7, 5],//10
					[7, 6],//11

					//cube 1

					[8, 9],//12
					[9, 11],//13
					[10, 11],//14
					[10, 8],//15

					[12, 8],//16
					[13, 9],//17
					[13, 12],//18

					[14, 10],//19
					[14, 12],//20

					[15, 11],//21
					[15, 13],//22

					[14, 15],//23

					//cube 2
					[0, 8],//24
					[1, 9],//25
					[2, 10],//26
					[3, 11],//27

					//cube 3
					[4, 12],//28
					[5, 13],//29

					//cube 4
					[6, 14],//30

					//cube 5
					[7, 15],//31
				],
				//faces
				[
					[0, 1, 2, 3],//0
					[0, 4, 5, 6],//1
					[4, 3, 7, 8],//2
					[11, 9, 7, 2],//3
					[6, 1, 9, 10],//4
					[5, 8, 11, 10],//5

					[12, 13, 14, 15],//6
					[16, 17, 18, 12],//7
					[19, 20, 16, 15],//8
					[21, 13, 22, 17],//9
					[14, 19, 23, 21],//10
					[18, 20, 22, 23],//11

					[24, 0, 25, 12],//12
					[3, 24, 26, 15],//13
					[2, 26, 27, 14],//14
					[1, 25, 27, 13],//15

					[24, 4, 28, 16],//16
					[6, 25, 29, 17],//17
					[5, 28, 29, 18],//18

					[8, 28, 30, 20],//19
					[7, 26, 30, 19],//20

					[11, 30, 31, 23],//21
					[10, 29, 31, 22],//22
					[9, 27, 31, 21],//23
				],
				//cubes
				[
					[0, 1, 2, 3, 4, 5],//0
					[6, 7, 8, 9, 10, 11],//1
					[12, 0, 6, 13, 14, 15],//2
					[16, 1, 12, 17, 18, 7],//3
					[2, 16, 13, 19, 20, 8],//4
					[5, 11, 18, 19, 21, 22],//5
					[4, 15, 17, 22, 23, 9],//6
					[3, 10, 14, 20, 21, 23],//7
				],
			]

		}

	},
	//boDisplayVerticeID: true,
	scene: scene,
	options: options,
	//onIntersection: function ( geometryIntersection ) {}

} );
```

Now you can see the tesseract on the canvas as green lines.

* Intersect tesseract with an n-dimensional plane.

Currently n-dimensional plane is 3D space because you have created tesseract in the 4D space. Please move the 3rd axis of the <b>_4D.vectorPlane</b> vector to 0.5 for  collision of tesseract with 3-dimensional plane.
```
_4D.vectorPlane[3] = 0.5;
```
Now you can see an intersection of the tesseract with 3-dimensional plane as white lines.

* Animate

	* Move 3-dimensional plane.

	Add new lines to the <b>animate</b> function.
	```
	_4D.vectorPlane[3] = _4D.vectorPlane[3] + 0.01;
	if ( _4D.vectorPlane[3] > 1 ) _4D.vectorPlane[3] = -1;
	```
	Now you can see the change in the shape of the intersection of the 3-dimensional plane with the tesseract while moving the plane.

	* Rotation of the tesseract.

	Add new lines to the <b>animate</b> function for rotation of tesseract around of 0, 3(xw) plane.
	```
	_4D.object.rotation[2] = _4D.object.rotation[2] + 0.01;
	if ( _4D.object.rotation[2] > Math.PI * 2 ) _4D.object.rotation[2] = 0;
	```

<a name="WebPage"></a>
## Example of your web page.
The following code is the result of this tutorial.
```
<!DOCTYPE html>

<html>
<head>
	<title>Tesseract</title>

	<link type="text/css" rel="stylesheet" href="https://threejs.org/examples/main.css">
	<!--<link type="text/css" rel="stylesheet" href="three.js/dev/examples/main.css">-->
	<!-- Three.js Full Screen Issue https://stackoverflow.com/questions/10425310/three-js-full-screen-issue/15633516 -->
	<!--<link type="text/css" rel="stylesheet" href="https://raw.githack.com/anhr/commonNodeJS/master/css/main.css">-->
	<link type="text/css" rel="stylesheet" href="commonNodeJS/master/css/main.css">

	<!--
	<script src="./three.js/dev/build/three.js"></script>
	<script src="./three.js/dev/build/three.min.js"></script>
	<script src="https://raw.githack.com/anhr/three.js/dev/build/three.js"></script>
	<script src="https://raw.githack.com/anhr/three.js/dev/build/three.min.js"></script>
	<script src="https://threejs.org/build/three.js"></script>
	<script src="https://threejs.org/build/three.min.js"></script>

	<script src="./commonNodeJS/master/nD/build/nD.js"></script>
	<script src="./commonNodeJS/master/nD/build/nD.min.js"></script>
	<script src="https://raw.githack.com/anhr/commonNodeJS/master/nD/build/nD.js"></script>
	<script src="https://raw.githack.com/anhr/commonNodeJS/master/nD/build/nD.min.js"></script>
	-->
</head>
<body>
	<script nomodule>alert( 'Fatal error: Your browser do not support modular JavaScript code.' );</script>
	<div id="info">
		<a href="https://en.wikipedia.org/wiki/Tesseract" target="_blank">Tesseract</a>.
		<a href="https://threejs.org/" target="_blank" rel="noopener">three.js</a>
		- <a href="https://github.com/anhr/commonNodeJS/tree/master/nD" target="_blank" rel="noopener">N-dimensional graphics</a>.
		By <a href="https://github.com/anhr" target="_blank" rel="noopener">anhr</a>
	</div>
	<div>
		<canvas id="canvas"></canvas>
	</div>
	<script type="module">

		import * as THREE from './three.js/dev/build/three.module.js';
		//import * as THREE from 'https://threejs.org/build/three.module.js';
		//import * as THREE from 'https://raw.githack.com/anhr/three.js/dev/build/three.module.js';

		import MyThree from './commonNodeJS/master/myThree/myThree.js';
		//import MyThree from './commonNodeJS/master/myThree/build/myThree.module.js';
		//import MyThree from './commonNodeJS/master/myThree/build/myThree.module.min.js';
		if ( MyThree.default ) MyThree = MyThree.default;
		MyThree.three.THREE = THREE;

		import Options from './commonNodeJS/master/Options.js'

		import ND from './commonNodeJS/master/nD/nD.js'
		//import ND from './commonNodeJS/master/nD/build/nD.module.js';
		//import ND from './commonNodeJS/master/nD/build/nD.module.min.js';
		//import ND from 'https://raw.githack.com/anhr/commonNodeJS/master/nD/nD.js';
		//import ND from 'https://raw.githack.com/anhr/commonNodeJS/master/nD/build/nD.module.js';
		//import ND from 'https://raw.githack.com/anhr/commonNodeJS/master/nD/build/nD.module.min.js';
		if ( ND.default ) ND = ND.default;

		var camera, scene, renderer;

		init();
		animate();

		var _4D;

		function init() {

			camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
			camera.position.copy( new THREE.Vector3( 0.4, 0.4, 2 ) );

			scene = new THREE.Scene();

			const options = new Options();

			_4D = new ND( 4, {

				object: {

					name: 'tesseract',
					//position: [-0.3],// -0.2, 0.3, 5],
					//rotation: [Math.PI / 5, 1, 2.16, 3, 4, 5],
					rotation: [0, 0, 1, 0, 1.1, 1.2],
					geometry: {

						position: [

							//cube 0

							//face 0
							[-0.5, -0.5, -0.5, -0.5],//0
							[-0.5, -0.5, 0.5, -0.5],//1
							[-0.5, 0.5, -0.5, -0.5],//2
							[-0.5, 0.5, 0.5, -0.5],//3

							//face 1
							[0.5, -0.5, -0.5, -0.5],//4
							[0.5, -0.5, 0.5, -0.5],//5

							//face 2
							[0.5, 0.5, -0.5, -0.5],//6

							[0.5, 0.5, 0.5, -0.5],//7

							//cube 1

							//face 6
							[-0.5, -0.5, -0.5, 0.5],//8
							[-0.5, -0.5, 0.5, 0.5],//9
							[-0.5, 0.5, -0.5, 0.5],//10
							[-0.5, 0.5, 0.5, 0.5],//11

							[0.5, -0.5, -0.5, 0.5],//12

							[0.5, -0.5, 0.5, 0.5],//13

							[0.5, 0.5, -0.5, 0.5],//14

							[0.5, 0.5, 0.5, 0.5],//15
						],
						indices: [

							//edges
							[
								//cube 0

								[0, 1],//0
								[1, 3],//1
								[3, 2],//2
								[2, 0],//3

								[4, 0],//4
								[4, 5],//5
								[5, 1],//6

								[6, 2],//7
								[6, 4],//8

								[7, 3],//9
								[7, 5],//10
								[7, 6],//11

								//cube 1

								[8, 9],//12
								[9, 11],//13
								[10, 11],//14
								[10, 8],//15

								[12, 8],//16
								[13, 9],//17
								[13, 12],//18

								[14, 10],//19
								[14, 12],//20

								[15, 11],//21
								[15, 13],//22

								[14, 15],//23

								//cube 2
								[0, 8],//24
								[1, 9],//25
								[2, 10],//26
								[3, 11],//27

								//cube 3
								[4, 12],//28
								[5, 13],//29

								//cube 4
								[6, 14],//30

								//cube 5
								[7, 15],//31
							],
							//faces
							[
								[0, 1, 2, 3],//0
								[0, 4, 5, 6],//1
								[4, 3, 7, 8],//2
								[11, 9, 7, 2],//3
								[6, 1, 9, 10],//4
								[5, 8, 11, 10],//5

								[12, 13, 14, 15],//6
								[16, 17, 18, 12],//7
								[19, 20, 16, 15],//8
								[21, 13, 22, 17],//9
								[14, 19, 23, 21],//10
								[18, 20, 22, 23],//11

								[24, 0, 25, 12],//12
								[3, 24, 26, 15],//13
								[2, 26, 27, 14],//14
								[1, 25, 27, 13],//15

								[24, 4, 28, 16],//16
								[6, 25, 29, 17],//17
								[5, 28, 29, 18],//18

								[8, 28, 30, 20],//19
								[7, 26, 30, 19],//20

								[11, 30, 31, 23],//21
								[10, 29, 31, 22],//22
								[9, 27, 31, 21],//23
							],
							//cubes
							[
								[0, 1, 2, 3, 4, 5],//0
								[6, 7, 8, 9, 10, 11],//1
								[12, 0, 6, 13, 14, 15],//2
								[16, 1, 12, 17, 18, 7],//3
								[2, 16, 13, 19, 20, 8],//4
								[5, 11, 18, 19, 21, 22],//5
								[4, 15, 17, 22, 23, 9],//6
								[3, 10, 14, 20, 21, 23],//7
							],
						]

					}

				},
				//boDisplayVerticeID: true,
				scene: scene,
				options: options,
				//onIntersection: function ( geometryIntersection ) {}

			} );

			_4D.vectorPlane[3] = 0.5;
			_4D.object.rotation[2] = _4D.object.rotation[2] + 0.01;

			renderer = new THREE.WebGLRenderer( {

				antialias: true,
				canvas: document.getElementById( 'canvas' ),

			} );
			renderer.setSize( window.innerWidth, window.innerHeight );

			options.createOrbitControls( camera, renderer, scene );

			window.addEventListener( 'resize', onWindowResize, false );

		}
		function onWindowResize() {

			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();

			renderer.setSize( window.innerWidth, window.innerHeight );

		}

		function animate() {

			requestAnimationFrame( animate );

			_4D.vectorPlane[3] = _4D.vectorPlane[3] + 0.01;
			if ( _4D.vectorPlane[3] > 1 ) _4D.vectorPlane[3] = -1;

			_4D.object.rotation[2] = _4D.object.rotation[2] + 0.01;
			if ( _4D.object.rotation[2] > Math.PI * 2 ) _4D.object.rotation[2] = 0;

			renderer.render( scene, camera );

		}


	</script></body>
</html>
```
