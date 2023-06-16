# Circle.

A class for generating a circle geometry and projet it to the canvas.

Example of using.
```
import MyThree from '../../myThree/myThree.js';
import Circle from '../circle.js';

new MyThree( (scene, options) => {

	const circle = new Circle(options);
	circle.project(scene);

}
```
[Example](../Examples/circle.html).
