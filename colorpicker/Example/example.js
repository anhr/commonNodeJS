/**
 * Example of using of ColorPicker.
 *
 * @author Andrej Hristoliubov https://anhr.github.io/AboutMe/
 *
 * @copyright 2011 Data Arts Team, Google Creative Lab
 *
 * @license under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */

function example( ColorPicker ) {

	//Simple Colorpicker
	ColorPicker.create( document.getElementById( "colorpicker" ) );

	//Horizontal Colorpicker with slider indicator
	var elValueHI = document.getElementById( 'valueHI' );
	var colorpickerHI = ColorPicker.create( document.getElementById( "colorpickerHI" ), {

		//direction: false,
		sliderIndicator: {
			callback: function ( c ) {

				//console.warn( 'callback: ' + c.percent + ' percent c.hex = ' + c.hex );
				var elColorHI = document.getElementById( 'colorHI' );
				elColorHI.style.backgroundColor = c.hex;
				document.getElementById( 'colorHItext' ).innerHTML = c.hex;
				elValueHI.value = c.percent; 

			},
			value: 75,//percent

		},
		/*
		style: {

			border: '10px solid black',
			width: '300px',
			height: '20px',

		},
		*/
		onError: function ( message ) { alert( 'Horizontal Colorpicker with slider indicator error: ' + message ); }

	} );
	document.getElementById( 'enterValueHI' ).onclick = function () {

		colorpickerHI.setValue( elValueHI.value );

	}

	//Vertical Colorpicker
	ColorPicker.create( "colorpicker3", {

		orientation: 'vertical',

	} );

	//Vertical Colorpicker with slider indicator
	var elValue4 = document.getElementById( 'value4' );
	var colorpicker4 = ColorPicker.create( "colorpicker4", {

		orientation: 'vertical',
		//direction: false,
		sliderIndicator: {
			callback: function ( c ) {

				//console.warn( 'callback: ' + c.percent + ' percent c.hex = ' + c.hex );
				var color = 'RGB(' + c.r + ', ' + c.g + ', ' + c.b + ')';
//				document.getElementById( 'color4' ).style.backgroundColor = color;
				var elColor4 = document.getElementById( 'color4' );
				elColor4.style.backgroundColor = color;
				document.getElementById( 'color4text' ).innerHTML = color;
				elValue4.value = c.percent;

			},
			value: '10%',//percent
		},
		/*
		style: {

			border: '1px solid black',
			width: '10px',
			height: '100px',

		},
		*/
		onError: function ( message ) { alert( 'Vertical Colorpicker with slider indicator error: ' + message ); }

	} );
	document.getElementById( 'enterValue4' ).onclick = function () {

		colorpicker4.setValue( elValue4.value );

	}

	//Horizontal Colorpicker with slider indicator. Direction from right to left
	var elValue5 = document.getElementById( 'value5' );
	var colorpicker5 = ColorPicker.create( document.getElementById( "colorpicker5" ), {

		direction: false,
		sliderIndicator: {
			callback: function ( c ) {

				//console.warn( 'callback: ' + c.percent + ' percent c.hex = ' + c.hex );
				var elColor5 = document.getElementById( 'color5' );
				elColor5.style.backgroundColor = c.hex;
				document.getElementById( 'color5text' ).innerHTML = c.hex;
				elValue5.value = c.percent;

			},
			value: 25,//percent

		},
		style: {

			border: '10px solid black',
			width: '300px',
			height: '20px',

		},
		onError: function ( message ) { alert( 'Horizontal Colorpicker with direction from right to left error: ' + message ); }

	} );
	document.getElementById( 'enterValue5' ).onclick = function () {

		colorpicker5.setValue( elValue5.value );

	}

	//Vertical Colorpicker with slider indicator. Direction from up to down
	var elValueVUD = document.getElementById( 'valueVUD' );
	var colorpickerVUD = ColorPicker.create( "colorpickerVUD", {

		orientation: 'vertical',
		direction: false,
		sliderIndicator: {
			callback: function ( c ) {

				//console.warn( 'callback: ' + c.percent + ' percent c.hex = ' + c.hex );
				var color = 'RGB(' + c.r + ', ' + c.g + ', ' + c.b + ')';
				var elColorVUD = document.getElementById( 'colorVUD' );
				elColorVUD.style.backgroundColor = color;
				document.getElementById( 'colorVUDtext' ).innerHTML = color;
				elValueVUD.value = c.percent;

			},
			value: 90,//percent
		},
		style: {

			border: '1px solid black',
			width: '10px',
			height: '100px',

		},
		onError: function ( message ) { alert( 'Vertical Colorpicker with direction from up to down error: ' + message ); }

	} );
	document.getElementById( 'enterValueVUD' ).onclick = function () {

		colorpickerVUD.setValue( elValueVUD.value );

	}

	//Blue, green, red, white horizontal Colorpicker with slider indicator.
	var elValueBGRW = document.getElementById( 'valueBGRW' );
	var colorpickerBGRW = ColorPicker.create( "colorpickerBGRW", {

		palette: ColorPicker.paletteIndexes.BGRW,
		sliderIndicator: {
			callback: function ( c ) {

				//console.warn( 'callback: ' + c.percent + ' percent c.hex = ' + c.hex );
				var color = 'RGB(' + c.r + ', ' + c.g + ', ' + c.b + ')';
				var elColorBGRW = document.getElementById( 'colorBGRW' );
				elColorBGRW.style.backgroundColor = color;
				document.getElementById( 'colorBGRWtext' ).innerHTML = color;
				elValueBGRW.value = c.percent;

			},
		},
		style: {

			//border: '1px solid black',
			//width: '10px',
			//height: '100px',

		},
		onError: function ( message ) { 'BGRW palette error: ' + alert( message ); }

	} );
	document.getElementById( 'enterValueBGRW' ).onclick = function () {

		colorpickerBH.setValue( elValueBGRW.value );

	}

	//Monochrome horizontal Colorpicker with slider indicator.
	var elValueMH = document.getElementById( 'valueMH' );
	var colorpickerMH = ColorPicker.create( "colorpickerMH", {

		palette: ColorPicker.paletteIndexes.monochrome,
		sliderIndicator: {
			callback: function ( c ) {

				//console.warn( 'callback: ' + c.percent + ' percent c.hex = ' + c.hex );
				var color = 'RGB(' + c.r + ', ' + c.g + ', ' + c.b + ')';
				var elColorMH = document.getElementById( 'colorMH' );
				elColorMH.style.backgroundColor = color;
				document.getElementById( 'colorMHtext' ).innerHTML = color;
				elValueMH.value = c.percent;

			},
		},
		style: {

			border: '1px solid black',
			width: '100%',//'100px',
			//height: 100,

		},
		onError: function ( message ) { alert( 'Monochrome palette error: ' + message ); }

	} );
	document.getElementById( 'enterValueMH' ).onclick = function () {

		colorpickerMH.setValue( elValueMH.value );

	}

	//Bidirectional horizontal Colorpicker with slider indicator.
	var elValueBH = document.getElementById( 'valueBH' );
	var colorpickerBH = ColorPicker.create( "colorpickerBH", {

		palette: ColorPicker.paletteIndexes.bidirectional,
		sliderIndicator: {
			callback: function ( c ) {

				//console.warn( 'callback: ' + c.percent + ' percent c.hex = ' + c.hex );
				var color = 'RGB(' + c.r + ', ' + c.g + ', ' + c.b + ')';
				var elColorBH = document.getElementById( 'colorBH' );
				elColorBH.style.backgroundColor = color;
				document.getElementById( 'colorBHtext' ).innerHTML = color;
				elValueBH.value = c.percent;

			},
		},
		style: {

			//border: '1px solid black',
			//width: '10px',
			//height: '100px',

		},
		onError: function ( message ) { 'Bidirectional palette error: ' + alert( message ); }

	} );
	document.getElementById( 'enterValueBH' ).onclick = function () {

		colorpickerBH.setValue( elValueBH.value );

	}

	//Rainbow Horizontal Colorpicker with slider indicator.
	var elValueRH = document.getElementById( 'valueRH' );
	var colorpickerRH = ColorPicker.create( "colorpickerRH", {

		palette: ColorPicker.paletteIndexes.rainbow,
		sliderIndicator: {
			callback: function ( c ) {

				//console.warn( 'callback: ' + c.percent + ' percent c.hex = ' + c.hex );
				var color = 'RGB(' + c.r + ', ' + c.g + ', ' + c.b + ')';
				var elColorRH = document.getElementById( 'colorRH' );
				elColorRH.style.backgroundColor = color;
				document.getElementById( 'colorRHtext' ).innerHTML = color;
				elValueRH.value = c.percent;

			},
		},
		style: {

			border: '1px solid black',
			//width: '10px',
			//height: '100px',

		},
		onError: function ( message ) { alert( 'Rainbow palette error: ' + message ); }

	} );
	document.getElementById( 'enterValueRH' ).onclick = function () {

		colorpickerRH.setValue( elValueRH.value );

	}

	//Custom palette Horizontal Colorpicker with slider indicator.
	var elValueCPH = document.getElementById( 'valueCPH' );
	var colorpickerCPH = ColorPicker.create( "colorpickerCPH", {

		palette: [

			{ percent: 0, r: 0, g: 0, b: 0, },
			{ percent: 10, r: 0xff, g: 255, b: 0xff, },
			{ percent: 20, r: 0xff, g: 0, b: 0x0, },
			{ percent: 30, r: 0x0, g: 255, b: 0x0, },
			{ percent: 40, r: 0x0, g: 0, b: 0xff, },
			{ percent: 80, r: 0x0, g: 0, b: 0xff, },
			{ percent: 90, r: 0xff, g: 255, b: 0xff, },

		],
		sliderIndicator: {
			callback: function ( c ) {

				//console.warn( 'callback: ' + c.percent + ' percent c.hex = ' + c.hex );
				var color = 'RGB(' + c.r + ', ' + c.g + ', ' + c.b + ')';
				var elColorCPH = document.getElementById( 'colorCPH' );
				elColorCPH.style.backgroundColor = color;
				document.getElementById( 'colorCPHtext' ).innerHTML = color;
				elValueCPH.value = c.percent;

			},
		},
		style: {

			border: '1px solid black',
			//width: '10px',
			//height: '100px',

		},
		onError: function ( message ) { alert( 'Custom palette error: ' + message ); }

	} );
	document.getElementById( 'enterValueCPH' ).onclick = function () {

		colorpickerCPH.setValue( elValueCPH.value );

	}

}
