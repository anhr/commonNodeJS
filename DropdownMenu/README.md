# DropdownMenu
node.js version of the DropdownMenu.

Adds a dropdown menu into your webpage. [Example.](https://raw.githack.com/anhr/DropdownMenu/master/Examples/html/)


## Packaged Builds
The easiest way to use DropdownMenu in your code is by using the built source at `build/dropdownmenu.js`. These built JavaScript files bundle all the necessary dependencies to run DropdownMenu.

In your `head` tag, include the following code:
```
<script src="https://raw.githack.com/anhr/DropdownMenu/master/build/dropdownMenu.js"></script>
```
or
```
<script src="https://raw.githack.com/anhr/DropdownMenu/master/build/dropdownMenu.min.js"></script>
```

Now you can use window.dropdownMenu for append your dropdown menu into your web page.

### dropdownMenu.create( arrayMenu, options )

Creates new menu.

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| arrayMenu | <code>String[] or Object[]</code> |  | array of menu and submenu items. If string then menu item name. If object then options of the new menu item:|
| [arrayMenuItem.name] | <code>String or HTMLElement</code> | "" | If string then menu item name. If HTMLElement then item element. Optional. |
| [arrayMenuItem.title] | <code>String</code> |  | menu item title. Optional. |
| [arrayMenuItem.id] | <code>String</code> |  | menu item identifier. Optional. |
| [arrayMenuItem.style] | <code>String</code> |  | menu item style. Example: "float: right;" Optional. |
| [arrayMenuItem.items] | <code>Array</code> |  | array of submenu items. Same as menu item. Optional. |
| [arrayMenuItem.onclick] | <code>Function</code> |  | function(event) called when user has clicked a menu item. event - event details. Optional. |
| [arrayMenuItem.drop] | <code>String or Object</code> |  | direction of drop of the submenu. Following directions is available: If string then "up" - drop submenu to up. "left" - shift submenu to left. If object then following members is available: "up: true" and "left: true". |
| [arrayMenuItem.radio] | <code>boolean</code> |  | true - defines a radio menu item. Optional. |
| [arrayMenuItem.checkbox] | <code>boolean</code> |  | true - defines a checkbox menu item. Optional. |
| [arrayMenuItem.checked] | <code>boolean</code> |  | true - checked state of a checkbox or radio menu item. Optional. |
|  |  |  |  |
| [options] | <code>Object</code> |  | Optional. Followed options is available: |
| [options.elParent] | <code>HTMLElement</code> | "body" element | Parent element of new menu. Optional. |
  [options.canvas] | <code>HTMLElement</code> |  | canvas element. Use if you want put a menu inside a canvas. See "button inside canvas" example below for details. Optional. |
| [options.decorations] | <code>String</code> |  | Optional. You can decorate your menu by a built-in style or use your custom style. Currently two built-in styles is available: |
|  | <code>String</code> | 'Gradient' | use gradient.css file for decoration. |
|  | <code>String</code> | 'Transparent' | use transparent.css file for decoration. |
|  |  |  | Custom decoration: |
|  | <code>String</code> | 'Custom' | please edit the custom.css file from my example if you want a custom decoration of your menu. |

#### Example. Simple menu.
```
<script>
dropdownMenu.create( [

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

		name: 'Menu 3',
		onclick: function ( event ) {

			var message = 'Menu 3 onclick';
			//console.log( message );
			alert( message )

		},

	},

] );
</script>
```

#### Example. Drop menu to the left or/and up.
```
<script>
dropdownMenu.create( [

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

], {

		decorations: 'Gradient',

	} );
</script>
```

#### Example. Button inside canvas.
```
<div class="container" id="containerDSE">
	<canvas id="canvas"></canvas>
</div>
<script>
var elContainer = document.getElementById( "containerDSE" ),
elCanvas = elContainer.querySelector( 'canvas' );

dropdownMenu.create( [

	{

		name: 'Button',
		onclick: function ( event ) {

			var message = 'Button onclick';
			//console.log( message );
			alert( message )

		},

	},

], {

	elParent: elContainer,
	canvas: elCanvas,
	decorations: 'Transparent',

} );
</script>
```

## Directory Contents

```
└── build - Compiled source code.
└── styles - Menu styles.
└── Examples/html/ - Example.
```

## Building your own DropdownMenu

In the terminal, enter the following:

```
$ npm install
$ npm run build
```

## npm scripts

- npm run build - Build development and production version of scripts.


## On the following browsers have been successfully tested:

Windows 10

	IE 11

	Microsoft Edge 41

	Chrome 74

	Opera 60

	Safari 5.1.7 

	FireFox 56

Android 6.0.1

	Chrome 74 

	Samsung Galaxy S5 Internet 9.2

	FireFox 67

	Opera 52

	Opera Mini 43

LG Smart tv

	Chrome 


## Thanks
The following libraries / open-source projects were used in the development of DropdownMenu:
 * [Rollup](https://rollupjs.org)
 * [Node.js](http://nodejs.org/)
 * [three.js](https://threejs.org/)

 ## Have a job for me?
Please read [About Me](https://anhr.github.io/AboutMe/).
