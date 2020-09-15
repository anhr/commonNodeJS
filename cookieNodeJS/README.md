# cookie
The node.js version of the [cookie](https://www.w3schools.com/js/js_cookies.asp).
Cookies let you store user information in web pages.
[Example of using](https://raw.githack.com/anhr/cookieNodeJS/master/).

## Packaged Builds
The easiest way to use cookie in your code is by using the built source at `build/cookie.js`.
These built JavaScript files bundle all the necessary dependencies to run cookie.

In your `head` tag, include the following code:
```
<script src="https://raw.githack.com/anhr/cookieNodeJS/master/build/cookie.js"></script>
```
or
```
<script src="https://raw.githack.com/anhr/cookieNodeJS/master/build/cookie.min.js"></script>
```
or you can import cookie from cookie.js file in your JavaScript module. [Example.](https://raw.githack.com/anhr/myThreejs/master/Examples/html/)
```
import cookie from 'https://raw.githack.com/anhr/cookieNodeJS/master/cookie.js';
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
var age = cookie.get('age', 25);
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
$ npm run build
```

## npm scripts

- npm run build - Build development and production version of scripts.

## Thanks
The following libraries / open-source projects were used in the development of cookie:
 * [Rollup](https://rollupjs.org)
 * [Node.js](http://nodejs.org/)

 ## Have a job for me?
Please read [About Me](https://anhr.github.io/AboutMe/).
