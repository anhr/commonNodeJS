# ColorPicker.

Pure JavaScript color picker.

[Example of using](https://raw.githack.com/anhr/ColorPicker/master/Example/index.html).
[Module version](https://raw.githack.com/anhr/ColorPicker/master/Example/modular.html).

## Packaged Builds
The easiest way to use ColorPicker in your code is by using the built source at `build/colorpicker.js`.
These built JavaScript files bundle all the necessary dependencies to run ColorPicker.

In your `head` tag, include the following code:
```
<script src="https://raw.githack.com/anhr/ColorPicker/master/build/colorpicker.js"></script>
```
or
```
<script src="https://raw.githack.com/anhr/ColorPicker/master/build/colorpicker.min.js"></script>
```
or if your browser support modular JavaScript code, in your `script type="module"` tag, include the following code:
```
import ColorPicker from 'https://raw.githack.com/anhr/colorpicker/master/colorpicker.js';
```
or

* Create a folder on your localhost named as [folderName].
* Add your web page into [folderName]. See [example](https://raw.githack.com/anhr/ColorPicker/master/Example/modular.html) web page.
* Download [loadFileNodeJS](https://github.com/anhr/loadFileNodeJS) repository into your "[folderName]\loadFileNodeJS\master" folder.
* Download [loadScriptNodeJS](https://github.com/anhr/loadScriptNodeJS) repository into your "[folderName]\loadScriptNodeJS\master" folder.
* Download [colorPicker](https://github.com/anhr/colorPicker) repository into your "[folderName]\colorPicker\master" folder.
```
import ColorPicker from './colorpicker/master/colorpicker.js';
```

In your `body` tag, include the following code:
```
<div id="colorpicker"></div>
```

Now you can use window.ColorPicker for select a color from picker.

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
Create palette.
```
new ColorPicker.palette( { palette: ColorPicker.paletteIndexes.bidirectional } )
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
