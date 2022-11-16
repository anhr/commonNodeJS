# Load file.

First, import loadFile module
```
import loadFile from './commonNodeJS/master/loadFileNodeJS/loadFile.js'
```
Load file asynchronously.
```
loadFile.async('fileName', {
	onload: function (text, url ) { console.log(text) }
});
```
Load file synchronously.
```
loadFile.sync('fileName', {
	onload: function (text, url ) { console.log(text) }
});
```
