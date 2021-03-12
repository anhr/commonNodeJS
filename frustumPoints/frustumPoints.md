# FrustumPoints.

Array of points, statically fixed in front of the camera.
I use <b>FrustumPoints</b> for displaying of the clouds around points.
 
For using please define an array of the points with cloud:
 
```
var arrayCloud = [];
```

Then you can define:

```
arrayCloud: options.arrayCloud
```

on the params of the <b>getShaderMaterialPoints( params, onReady )</b> function.

Or

```
arrayCloud: options.arrayCloud
```

on the <b>pointsOptions</b> of the <b>myThreejs.points</b> function.

Or

if <b>points</b> is <b>new THREE.Points(...)</b> then:

```
if ( options.arrayCloud !== undefined )
	points.userData.cloud = {

		indexArray: myThreejs.pushArrayCloud( options.arrayCloud, points.geometry ),

	}
```
