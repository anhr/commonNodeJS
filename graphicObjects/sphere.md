# Sphere.

A class for generating a sphere geometry and projet it to the canvas.

Example of using.
```
<!DOCTYPE html>

<html>
<head>
	<title>Sphere</title>

	<!--for mobile devices-->
	<meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
	<link type="text/css" rel="stylesheet" href="https://raw.githack.com/anhr/three.js/dev/examples/main.css">

</head>
<body>
	<script nomodule>alert('Fatal error: Your browser do not support modular JavaScript code.');</script>
	<div id="info">
		<a href="https://threejs.org/" target="_blank" rel="noopener">three.js</a>
		- <a href="https://github.com/anhr/commonNodeJS/blob/master/graphicObjects/sphere.md" target="_blank" rel="noopener">Sphere</a>.
		By <a href="https://github.com/anhr" target="_blank" rel="noopener">anhr</a>
	</div>

	<script type="module">

		//import * as THREE from 'https://threejs.org/build/three.module.js';
		import * as THREE from 'https://raw.githack.com/anhr/three.js/dev/build/three.module.js';

		//import MyThree from 'https://raw.githack.com/anhr/commonNodeJS/master/myThree/myThree.js';
		//import MyThree from 'https://raw.githack.com/anhr/commonNodeJS/master/myThree/build/myThree.module.js';
		import MyThree from 'https://raw.githack.com/anhr/commonNodeJS/master/myThree/build/myThree.module.min.js';
		MyThree.three.THREE = THREE;

		import Sphere from 'https://raw.githack.com/anhr/commonNodeJS/master/graphicObjects/sphere.js';

		new MyThree(function (scene, options) {

			//The default sphere is a pyramid	
			new Sphere(options).project(scene);

		});

	</script>
</body>
```
[Example](https://raw.githack.com/anhr/commonNodeJS/master/graphicObjects/Examples/sphere.html).
[Sphere API](https://raw.githack.com/anhr/commonNodeJS/master/graphicObjects/jsdoc/sphere/index.html)
