export default class load {

	constructor( THREE ) {

		//Thanks to https://stackoverflow.com/a/27369985/5175935
		//Такая же функция есть в frustumPoints.js но если ее использовать то она будет возвращать путь на frustumPoints.js
		const getCurrentScript = function () {

			if ( document.currentScript && ( document.currentScript.src !== '' ) )
				return document.currentScript.src;
			const scripts = document.getElementsByTagName( 'script' ),
				str = scripts[scripts.length - 1].src;
			if ( str !== '' )
				return src;
			//Thanks to https://stackoverflow.com/a/42594856/5175935
			return new Error().stack.match( /(https?:[^:]*)/ )[0];

		};
		//Thanks to https://stackoverflow.com/a/27369985/5175935
		const getCurrentScriptPath = function () {
			const script = getCurrentScript(),
				path = script.substring( 0, script.lastIndexOf( '/' ) );
			return path;
		};
		//console.warn( 'getCurrentScriptPath = ' + getCurrentScriptPath() );
		const currentScriptPath = getCurrentScriptPath();

		const loader = new THREE.FileLoader();

		//load a text file and output the result to the console
		loader.load(
			// resource URL
//			currentScriptPath + '/example.txt',
			'example.txt',

			// onLoad callback
			function ( data ) {
				// output the text to the console
				console.log( data )
			},

			// onProgress callback
			function ( xhr ) {
				console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
			},

			// onError callback
			function ( err ) {
				console.error( 'An error happened' );
			}
		);

	}
}