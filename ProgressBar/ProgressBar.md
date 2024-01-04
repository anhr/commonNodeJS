# ProgressBar.

Creates a [progress bar element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/range) on your web page.

Sometimes the calculation process takes a long time. As a result, your web page will freeze during processing. You can use my <b>ProgressBar</b> to solve the page freezing issue.
My <b>ProgressBar</b> divides a long process into short parts by timeout.

Example.

You have a long time iteration process:

```
for (let i = 0; i < 10000; i++) {

	let sum = 0;
	for (let j = 0; j < i; j++) sum += array[j];
	console.log('i = ' + i + ', sum = ' + sum);
	array.push(Math.sin(i) + Math.cos(i));

}
```
Same process by ProgressBar iteration:
```
new ProgressBar(renderer.domElement.parentElement, (progressBar, i) =>{

	let sum = 0;
	for (let j = 0; j < i; j++) sum += array[j];
	console.log('ProgressBar. i = ' + i + ', sum = ' + sum);
	array.push(Math.sin(i) + Math.cos(i));
	
}, {

	sTitle: 'Long time iteration process',
	iterationCount: 10000,

});
```
Now your web page is not froze during iteration.

I got the parent element from <b>renderer</b>. See [WebGLRenderer](https://threejs.org/docs/index.html?q=WebGLRenderer#api/en/renderers/WebGLRenderer).

You can operate your iteration process from your code:
```
let i = 0;//current iteration index
new ProgressBar(settings.options.renderer.domElement.parentElement, (progressBar) =>{

	let sum = 0;
	for (let j = 0; j < i; j++) sum += array[j];
	console.log('ProgressBar. i = ' + i + ', sum = ' + sum);
	array.push(Math.sin(i) + Math.cos(i));
	progressBar.value = i;
	i++;
	if (i < 10000)
		progressBar.step();//next iteration
	else progressBar.remove();//stop iteration
	
}, {

	sTitle: 'Long time iteration process',
	max: 10000,

});
```

Example of using:

[Intersects](https://raw.githack.com/anhr/commonNodeJS/master/intersections/jsdoc/index.html).

[Egocentric Universe](https://github.com/anhr/egocentricUniverse).

