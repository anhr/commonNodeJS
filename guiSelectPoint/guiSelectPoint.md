# GuiSelectPoint.

Add guiSelectPoint into [dat.gui](https://github.com/anhr/dat.gui) for select a point from the mesh.
[Example](https://raw.githack.com/anhr/AxesHelper/master/Examples/AxesHelperGui.html).

## Quick start

The easiest way to use GuiSelectPoint in your code is import guiSelectPoint from guiSelectPoint.js file in your JavaScript module.
```
import { GuiSelectPoint, getObjectPosition } from 'https://raw.githack.com/anhr/commonNodeJS/master/guiSelectPoint/guiSelectPoint.js';
```
or 
* Create a folder on your localhost named as [folderName].
* Add your veb page into [folderName]. See [example](https://raw.githack.com/anhr/AxesHelper/master/Examples/AxesHelperGui.html) web page.

* import [three.js](https://github.com/anhr/three.js)
```
import * as THREE from 'https://threejs.org/build/three.module.js';
```
or
```
import { THREE } from 'https://raw.githack.com/anhr/commonNodeJS/master/three.js';
```
or download [three.js](https://github.com/anhr/three.js) repository into your "[folderName]\three.js\dev" folder.
```
import * as THREE from './three.js/dev/build/three.module.js';
```
download [commonNodeJS](https://github.com/anhr/commonNodeJS) repository into your "[folderName]\commonNodeJS\master" folder.
```
import { GuiSelectPoint, getObjectPosition } from './commonNodeJS/master/guiSelectPoint/guiSelectPoint.js';
```

Now you can use GuiSelectPoint in your javascript code.

```
const guiSelectPoint = new GuiSelectPoint( THREE, {

	axesHelper: axesHelper,
	//getLanguageCode: getLanguageCode,

} );
guiSelectPoint.add( gui );

guiSelectPoint.addMesh( points );
//points is [Object3D](https://threejs.org/docs/index.html#api/en/core/Object3D).
//User can manually select a point from the points
```
If you want to localize the gui, please uncomment
```
getLanguageCode: getLanguageCode,
```
line above and import getLanguageCode.
```
import { getLanguageCode } from 'https://raw.githack.com/anhr/commonNodeJS/master/lang.js';
```
or download [commonNodeJS](https://github.com/anhr/commonNodeJS) repository into your "[folderName]\commonNodeJS\master" folder.
```
import { getLanguageCode } from './commonNodeJS/master/lang.js';
```
