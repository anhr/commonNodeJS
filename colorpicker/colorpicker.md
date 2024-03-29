# ColorPicker.

Pure JavaScript color picker.

[Example of using](../Example/index.html).
[Module version](../Example/modular.html).

## Packaged Builds
The easiest way to use ColorPicker in your code is by using the built source at `build/colorpicker.js`.
These built JavaScript files bundle all the necessary dependencies to run ColorPicker.

In your `head` tag, include the following code:
```
<script src="https://raw.githack.com/anhr/commonNodeJS/master/colorpicker/build/colorpicker.js"></script>
```
or
```
<script src="https://raw.githack.com/anhr/commonNodeJS/master/colorpicker/build/colorpicker.min.js"></script>
```
or if your browser support modular JavaScript code, in your `script type="module"` tag, include the following code:
```
import ColorPicker from 'https://raw.githack.com/anhr/commonNodeJS/master/colorpicker/colorpicker.js';
```
or

* Create a folder on your localhost named as [folderName].
* Add your web page into [folderName]. See [example](https://raw.githack.com/anhr/commonNodeJS/master/colorpicker/Example/modular.html) web page.
* Download [commonNodeJS](https://github.com/anhr/commonNodeJS) repository into your "[folderName]\commonNodeJS\master" folder.
```
import ColorPicker from './commonNodeJS/master/colorpicker/colorpicker.js';
```

In your `body` tag, include the following code:
```
<div id="colorpicker"></div>
```

Now you can use <b>window.ColorPicker</b> for select a color from picker.

Example of the simple ColorPicker
```
ColorPicker.create( document.getElementById( "colorpicker" ) );
```
Add a slider, and an event when the user changed color.
```
ColorPicker.create( "colorpicker", {

	sliderIndicator: {

		callback: function ( c ) {

			console.log( 'color: ' + c.percent + ' percent c.hex = ' + c.hex );

		}

	},

} );
```
Now you have created a default [ColorPicker.paletteIndexes.BGYW](../Example/index.html#BGYW) (blue, green, yellow, white) palette.
You can select another palette. For example [ColorPicker.paletteIndexes.bidirectional](../Example/index.html#Bidirectional) palette.
Please add <b>palette: ColorPicker.paletteIndexes.bidirectional,</b> key to the <b>options</b> parameter of <b>ColorPicker.create</b> for it.
```
ColorPicker.create( "colorpicker", {

	sliderIndicator: {

		callback: function ( c ) {

			console.log( 'color: ' + c.percent + ' percent c.hex = ' + c.hex );

		}

	},
	palette: ColorPicker.paletteIndexes.bidirectional,

} );
```
Create palette.
```
const palette = new ColorPicker.palette();
```
[ColorPicker.paletteIndexes.bidirectional](../Example/index.html#Bidirectional") palette.
```
const palette = new ColorPicker.palette( { palette: ColorPicker.paletteIndexes.bidirectional } );
```
[Available palettes](../jsdoc/module-ColorPicker-ColorPicker.html#paletteIndexes).

Also you can create your own custom palette.
```
const palette = new ColorPicker.palette( { palette: [

	{ percent: 0, r: 0, g: 0, b: 0, },
	{ percent: 10, r: 0xff, g: 255, b: 0xff, },
	{ percent: 20, r: 0xff, g: 0, b: 0x0, },
	{ percent: 30, r: 0x0, g: 255, b: 0x0, },
	{ percent: 40, r: 0x0, g: 0, b: 0xff, },
	{ percent: 80, r: 0x0, g: 0, b: 0xff, },
	{ percent: 90, r: 0xff, g: 255, b: 0xff, },

] } );
```
## Directory Contents

```
build - Compiled source code.
```

## Building your own ColorPicker

In the terminal, enter the following:

```
$ npm install
$ npm run build
```
