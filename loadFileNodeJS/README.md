# loadFile
The loadFile is node.js version of the download of the file.
[Example](https://raw.githack.com/anhr/loadFileNodeJS/master/).

## Packaged Builds
The easiest way to use loadFile in your code is by using the built source at `build/loadFile.js`.
These built JavaScript files bundle all the necessary dependencies to run loadFile.

In your `head` tag, include the following code:
```
<script src="https://raw.githack.com/anhr/commonNodeJS/master/loadFileNodeJS/build/loadFile.js"></script>
```
or
```
<script src="https://raw.githack.com/anhr/commonNodeJS/master/loadFileNodeJS/build/loadFile.min.js">
```
or you can import loadFile from loadFile.js file in your JavaScript module. [Example.](https://raw.githack.com/anhr/TreeElementNodeJS/master/Examples/module/) [Code of example.](https://github.com/anhr/TreeElementNodeJS/blob/master/index.js)
```
import { loadFile } from 'loadFile.js';
```

Now you can use window.loadFile for synchronous download of the file.

### loadFile.sync( url, [options] )

Synchronous download of the file.

	url: URL of an external file for downloading.

	[options]: the following options are available. Default is undefined.

		[options.onload]: function () The onload event occurs when a script has been loaded. Default is undefined.

		[options.onerror]: function ( str ) The onerror event occurs when an error has been occured. Default is undefined.

			str: error details.

	returns file content

#### Example
```
//Synchronous download of the element.html file into "elID" element.
document.getElementById( "elID" ).innerHTML = loadFile.sync('element.html');
```

#### Example 2
```
//Synchronous download of the element.html file into "elID" element with events.
document.getElementById( "elID" ).innerHTML = loadFile.sync(
	'element.html',
	{
		onload: function ( response ) {

			var str = 'file has been loaded successfully';
			console.log( str );

		},
		onerror: function ( str ) {

			console.error( str );

		},
	},
);
```
See [Example](https://raw.githack.com/anhr/loadFileNodeJS/master/).

## Directory Contents

```
└── build - Compiled source code.
```

## Building your own loadFile

In the terminal, enter the following:

```
$ npm install
$ npm run build
```

## npm scripts

- npm run build - Build development and production version of scripts.

## Thanks
The following libraries / open-source projects were used in the development of loadFile:
 * [Rollup](https://rollupjs.org)
 * [Node.js](http://nodejs.org/)

 ## Have a job for me?
Please read [About Me](https://anhr.github.io/AboutMe/).
