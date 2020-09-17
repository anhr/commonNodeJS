# loadScript
The loadScript is node.js version of the load JavaScript file. [Example of using](https://raw.githack.com/anhr/loadScriptNodeJS/master/index.html)

## Packaged Builds
The easiest way to use loadScript in your code is by using the built source at `build/loadScript.js`.
These built JavaScript files bundle all the necessary dependencies to run loadScript.

In your `head` tag, include the following code:
```
<script src="https://raw.githack.com/anhr/loadScriptNodeJS/master/build/loadScript.js"></script>
```
or
```
<script src="https://raw.githack.com/anhr/loadScriptNodeJS/master/build/loadScript.min.js"></script>
```
or you can import loadScript from loadScript.js file into your JavaScript module. [Example.](https://raw.githack.com/anhr/DropdownMenu/master/Examples/html/) [Code of example.](https://github.com/anhr/DropdownMenu/blob/master/index.js)
```
import loadScript from 'loadScript.js';
```

Now you can use window.loadScript for loading of your JavaScript files.

### loadScript.async( src, [options] )

Asynchronous load JavaScript file.

	src: URL of an external script file or array of the script file names.

	options: followed options is available

		[onload]: function () The onload event occurs when a script has been loaded. Default is undefined.

		[onerror]: function ( str, e ) The onerror event occurs when an error has been occured. Default is undefined.

			str: error details

			e: event

		[appendTo]: The node to which the new script will be append. Default is head node.
		[tag]: The script's tag attributes (Object) or tag type (string). Optional.
				tag attributes (Object):
					name: tag name. Default is 'script'
					[attribute]: tag attribute. Optional.
						name: attribute name. Default is 'type'
						value: attribute value. Default is 'text/javascript'
				Available tag types (string):
					'style' - load a style file (.css extension)


#### [Examples](https://raw.githack.com/anhr/loadScriptNodeJS/master/index.html)
```
//Asynchronous load JavaScript file
loadScript.async( "JavaScript.js" );
```
```
//Asynchronous load JavaScript file with events to specified node
loadScript.async( "JavaScript.js",
	{

		onload: function () {

			var str = 'files has been loaded successfully';
			console.log( str );

		},
		onerror: function ( str, e ) {

			console.error( str );

		},
		appendTo: document.getElementById( "appendto" ),

	}
	
);
```
```
//Asynchronous load of array of JavaScript files
loadScript.async( [

		"JavaScript1.js",
		"JavaScript2.js",

	],
	{

		onload: function () {

			var str = 'files has been loaded successfully';
			console.log( str );

		},
		onerror: function ( str, e ) {

			console.error( str );

		},

	}
	
);
```

### loadScript.sync( src, [options] )

Synchronous load JavaScript file.

	src: URL of an external script file or array of the script file names.

	options: followed options is available

		[onload]: function () The onload event occurs when a script has been loaded. Default is undefined.

		[onerror]: function ( str ) The onerror event occurs when an error has been occured. Default is undefined.

			str: error details

		[appendTo]: The node to which the new script will be append. Default is head node.
		[tag]: The script's tag attributes (Object) or tag type (string). Optional.
				tag attributes (Object):
					name: tag name. Default is 'script'
					[attribute]: tag attribute. Optional.
						name: attribute name. Default is 'type'
						value: attribute value. Default is 'text/javascript'
				Available tag types (string):
					'style' - load a style file (.css extension)

#### [Examples](https://raw.githack.com/anhr/loadScriptNodeJS/master/index.html)
```
//Synchronous load JavaScript file
loadScript.sync( "JavaScript.js" );
```
```
//Synchronous load JavaScript file with events
loadScript.sync( 'JavaScript.js',
	{
		onload: function ( response ) {

			console.log( 'JavaScript.js file content: ' + response );

		},
		onerror: function ( str ) {

			console.error( str );

		},
		appendTo: document.getElementById( "appendto" ),
	},
);
```
```
//Synchronous load of array of JavaScript files with events
loadScript.sync( ['JavaScript.js', 'JavaScript2.js'],
	{
		onload: function ( response ) {

			console.log( 'JavaScript.js and JavaScript2.js files has been loaded successfully' );

		},
		onerror: function ( str ) {

			console.error( str );

		},
	},
);
```
```
//Append style into head node.
loadScript.sync( "controls.css",
{
	//style rel="stylesheet"
	tag: {

		name: 'style',
		attribute: {

			name: 'rel',
			value: 'stylesheet',

		}

	}

} );
```

## Directory Contents

```
└── build - Compiled source code.
```

## Building your own loadScript

In the terminal, enter the following:

```
$ npm install
$ npm run build
```

## npm scripts

- npm run build - Build development and production version of scripts.

## Thanks

[Как определить успешно ли подгружен файл (например - что будет если такого файла нет)?](http://javascript.ru/forum/events/21439-dinamicheskaya-zagruzka-skriptov.html)

[Загрузка скриптов, картинок, фреймов: onload и onerror](https://learn.javascript.ru/onload-onerror)

The following libraries / open-source projects were used in the development of loadScript:
 * [Rollup](https://rollupjs.org)
 * [Node.js](http://nodejs.org/)

 ## Have a job for me?
Please read [About Me](https://anhr.github.io/AboutMe/).
