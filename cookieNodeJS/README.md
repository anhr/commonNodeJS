﻿# cookie
The node.js version of the [cookie](https://www.w3schools.com/js/js_cookies.asp).
Cookies let you store user information in web pages.
[Example of using](https://raw.githack.com/anhr/commonNodeJS/master/cookieNodeJS/Examples/index.html).

## Packaged Builds
The easiest way to use cookie in your code is by using the built source at `build/cookie.js`.
These built JavaScript files bundle all the necessary dependencies to run cookie.

In your `head` tag, include the following code:
```
<script src="https://raw.githack.com/anhr/commonNodeJS/master/cookieNodeJS/build/cookie.js"></script>
```
or
```
<script src="https://raw.githack.com/anhr/commonNodeJS/master/cookieNodeJS/build/cookie.min.js"></script>
```

or

* Create a folder on your localhost named as [folderName].
* Add your web page into [folderName].
* Download [commonNodeJS](https://github.com/anhr/commonNodeJS) repository into your "[folderName]\commonNodeJS\master" folder.

```
<script src="../build/cookie.js"></script>
```
or
```
<script src="../build/cookie.min.js"></script>
```

or you can import cookie from cookie.js file in your JavaScript module. [Example.](https://raw.githack.com/anhr/commonNodeJS/master/cookieNodeJS/Examples/index.html)
```
import cookie from 'https://raw.githack.com/anhr/commonNodeJS/master/cookieNodeJS/cookie.js';
```
or
```
import cookie from './commonNodeJS/master/cookieNodeJS/cookie.js';
```
or
```
import * as cookie from 'https://raw.githack.com/anhr/commonNodeJS/master/cookieNodeJS/build/cookie.module.js';
```
or
```
import * as cookie from 'https://raw.githack.com/anhr/commonNodeJS/master/cookieNodeJS/build/cookie.module.min.js';
```
or
```
import * as cookie from '../build/cookie.module.js'
```
or
```
import * as cookie from '../build/cookie.module.min.js'
```

Now you can use window.cookie for store user information in web pages.

### cookie.isEnabled()

Is the cookie enabled in your web browser?

	returns {boolean} true if cookie enabled

#### Example
```
if ( cookie.isEnabled() )
	console.log('cookie is enabled on your browser');
else
	console.error('cookie is disabled on your browser');
```

### cookie.set( name, value )

Set a cookie.

	name: cookie name.
	value: cookie value.

#### Example
```
cookie.set('age', 25);
```

### cookie.get( name[, defaultValue] );

get a cookie.

	name: cookie name.
	defaultValue: cookie default value. Default is undefined.
	returns cookie value or defaultValue if cookie was not found

#### Example
```
const age = cookie.get('age', 25);
```

### cookie.setObject( name, object );

sets an object into cookie.

	name: cookie name.
	object: an object for saving into cookie.

#### Example
```
const user = {

	name: 'Ivan',
	age: 25,
				
}
cookie.setObject('user', user);
```

### getObject( name, options, optionsDefault );

gets an object from cookie.

	name: name of the object.
	options: load an object from cookie into options
	optionsDefault: copy to options this default object if named object is not exists in the cookie.

#### Example
```
const user = {};
cookie.getObject( 'user', user );
```

### copyObject( name, objectDefault )

gets an object from cookie and returns a copy of object.

	name: name of the object.
	objectDefault: copy to options this default object if named object is not exists in the cookie.
	returns copy of object from cookie.

#### Example
```
const user = cookie.copyObject( 'user', {
	name: 'Lisa',
	age: 19
} );
```

### cookie.defaultCookie( name );

Default cookie is not saving settings.

	name: is not using.

#### Example
```
const defaultCookie = new cookie.defaultCookie('user');
const user = defaultCookie.copyObject('user', {});
```

### cookie.remove( name );

Remove cookie.

	name: cookie name.

#### Example
```
cookie.remove( 'age' );
```

See [Example of using](https://raw.githack.com/anhr/cookieNodeJS/master/).

## Directory Contents

```
└── build - Compiled source code.
```

## Building your own cookie

In the terminal, enter the following:

```
$ npm install
$ npm install uglify-es
$ npm run build
```

## npm scripts

- npm run build - Build scripts.

## Thanks
The following libraries / open-source projects were used in the development of cookie:
 * [Rollup](https://rollupjs.org)
 * [Node.js](http://nodejs.org/)

 ## Have a job for me?
Please read [About Me](https://anhr.github.io/AboutMe/).
