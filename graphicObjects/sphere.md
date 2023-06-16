# Sphere.

A class for generating a sphere geometry and projet it to the canvas.

Example of using.
```
import MyThree from '../../myThree/myThree.js';
import Sphere from '../sphere.js';

new MyThree( (scene, options) => {

	const sphere = new Sphere(options);
	sphere.project(scene);

}
```
[Example](https://raw.githack.com/anhr/commonNodeJS/master/graphicObjects/Examples/sphere.html).
