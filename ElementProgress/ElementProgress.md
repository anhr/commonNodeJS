# ElementProgress.

Creates a [progress bar element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/range) on your web page.

[Example of using](https://raw.githack.com/anhr/commonNodeJS/master/DropdownMenu/Examples/html/index.html).

## Packaged Builds
The easiest way to use DropdownMenu in your code is by using the built source at `build/dropdownMenu.js`.
These built JavaScript files bundle all the necessary dependencies to run DropdownMenu.

In your `head` tag, include the following code:
```
<script src="https://raw.githack.com/anhr/commonNodeJS/master/DropdownMenu/build/dropdownMenu.js"></script>
```
or
```
<script src="https://raw.githack.com/anhr/commonNodeJS/master/DropdownMenu/build/dropdownMenu.min.js"></script>
```
or
* Create a folder on your localhost named as [folderName].
* Add your web page into [folderName].
* Download [commonNodeJS](https://github.com/anhr/commonNodeJS) repository into your "[folderName]\commonNodeJS\master" folder.
```
<script src="./commonNodeJS/master/DropdownMenu/build/dropdownMenu.js"></script>
```
or
```
<script src="./commonNodeJS/master/DropdownMenu/build/dropdownMenu.min.js"></script>
```
or if your browser support modular JavaScript code, in your `script type="module"` tag, include the following code:
```
import DropdownMenu from 'https://raw.githack.com/anhr/commonNodeJS/master/DropdownMenu/dropdownMenu.js';
```
or

* Create a folder on your localhost named as [folderName].
* Add your web page into [folderName].
* Download [commonNodeJS](https://github.com/anhr/commonNodeJS) repository into your "[folderName]\commonNodeJS\master" folder.
```
import DropdownMenu from './commonNodeJS/master/DropdownMenu/dropdownMenu.js';
```

Now you can use <b>DropdownMenu</b> for creation of the drop down menu.

Example of the simple <b>DropdownMenu</b>.
```
DropdownMenu.create( [

	'Menu 1 ',
	{

		name: 'Menu 2 ',
		items: [

			'Item 2.1',
			{
				name: 'Item 2.2',
				onclick: function ( event ) {

					var message = 'Item 2.2 onclick';
					//console.log( message );
					alert( message )

				}

			},

		],

	},
	{

		name: 'Menu 3 ',
		onclick: function ( event ) {

			var message = 'Menu 3 onclick';
			//console.log( message );
			alert( message )

		},

	},
	{

		name: 'Selector ',
		title: 'Please select menu items',
		items: [

			{

				name: 'Checked',
				checked: true,
				onclick: function ( event ) {

					var message = 'Checked onclick';
					//console.log( message );
					alert( message )

				}

			},
			{

				name: 'Radio 1',
				radio: true,

			},
			{

				name: 'Radio 2',
				radio: true,
				checked: true,

			},
			{

				name: 'Checkbox 1',
				checkbox: true,

			},
			{

				name: 'Checkbox 2',
				checkbox: true,
				checked: true,

			},
			'Unselectable Item',

		],

	},

] );
```
Drop menu to the left or/and up. Gradient decoration.
```
DropdownMenu.create( [

	{

		name: 'Drop up',
		drop: 'up',
		items: [

			'up item 1',
			{

				name: 'up item 2',
				onclick: function ( event ) {

					var message = 'up item 2 onclick';
					//console.log( message );
					alert( message )

				}

			},

		],

	},
	{

		name: 'Left',
		drop: 'left',
		items: [

			'left item 1',
			{

				name: 'left item 2',
				onclick: function ( event ) {

					var message = 'left item 2 onclick';
					//console.log( message );
					alert( message )

				}

			},

		],

	},
	{

		name: 'Up left',
		drop:
		{

			left: true,
			up: true,

		},
		items: [

			'up left item 1',
			{

				name: 'up left item 2',
				onclick: function ( event ) {

					var message = 'up left item 2 onclick';
					//console.log( message );
					alert( message )

				}

			},

		],

	},
	{

		name: 'Radio ',
		title: 'Please select menu items',
		drop:
		{

			left: true,
			up: false,

		},
		items: [

			{

				name: 'Radio 1',
				radio: true,

			},
			{

				name: 'Radio 2',
				radio: true,
				checked: true,

			},

		],

	},
	{

		name: 'Checkbox ',
		title: 'Please select menu items',
		drop:
		{

			left: true,
			up: false,

		},
		items: [

			{

				name: 'Checkbox 1',
				checkbox: true,

			},
			{

				name: 'Checkbox 2',
				checkbox: true,
				checked: true,

			},

		],

	},

], {

		decorations: 'Gradient',

	} );
```
Custom decoration.

Please create your own [custom.css](https://raw.githack.com/anhr/commonNodeJS/master/DropdownMenu/Examples/html/custom.css) file and copy it into your web page folder.

Add
```
<link rel="stylesheet" href="custom.css" type="text/css">
```
line into <b>head</b> tag.

Set <b>decorations: 'Custom'</b> in your code.
```
DropdownMenu.create( [

	{

		name: 'Drop up',
		drop: 'up',
		items: [

			'up item 1',
			{

				name: 'up item 2',
				onclick: function ( event ) {

					var message = 'up item 2 onclick';
					//console.log( message );
					alert( message )

				}

			},

		],

	},
	{

		name: 'Left',
		drop: 'left',
		items: [

			'left item 1',
			{

				name: 'left item 2',
				onclick: function ( event ) {

					var message = 'left item 2 onclick';
					//console.log( message );
					alert( message )

				}

			},

		],

	},
	{

		name: 'Up left',
		drop:
		{

			left: true,
			up: true,

		},
		items: [

			'up left item 1',
			{

				name: 'up left item 2',
				onclick: function ( event ) {

					var message = 'up left item 2 onclick';
					//console.log( message );
					alert( message )

				}

			},

		],

	},
	{

		name: 'Radio ',
		title: 'Please select menu items',
		drop:
		{

			left: true,
			up: false,

		},
		items: [

			{

				name: 'Radio 1',
				radio: true,

			},
			{

				name: 'Radio 2',
				radio: true,
				checked: true,

			},

		],

	},
	{

		name: 'Checkbox ',
		title: 'Please select menu items',
		drop:
		{

			left: true,
			up: false,

		},
		items: [

			{

				name: 'Checkbox 1',
				checkbox: true,

			},
			{

				name: 'Checkbox 2',
				checkbox: true,
				checked: true,

			},

		],

	},

], {

		decorations: 'Custom',

	} );
```

## Directory Contents

```
build - Compiled source code.
```

## Building your own DropdownMenu

In the terminal, enter the following:

```
$ npm install
$ npm run build
```
