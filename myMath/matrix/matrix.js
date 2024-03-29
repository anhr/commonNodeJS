/**
* @module Matrix
* @description A matrix (plural matrices) is a rectangular array or table of numbers, arranged in rows and columns, which is used to represent a mathematical object or a property of such an object.
* @see [Matrix (mathematics)]{@link https://en.wikipedia.org/wiki/Matrix_(mathematics)}
* @author [Andrej Hristoliubov]{@link https://github.com/anhr}
*
* @copyright 2011 Data Arts Team, Google Creative Lab
*
* @license under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
* 
* */

class Matrix {

	/** @class
	 * A matrix (plural matrices) is a rectangular array or table of numbers, arranged in rows and columns, which is used to represent a mathematical object or a property of such an object.
	 * @see [Matrix (mathematics)]{@link https://en.wikipedia.org/wiki/Matrix_(mathematics)}
	 * @param {Array} a 2-dimensional array that initializes the matrix.
	 * @example
	 * const matrix = new Matrix( [[1, 2],[3, 4]] );
	 * */
	constructor( a ) {

		/**
		* Multiplies this matrix by another matrix
		* @param {Matrix|Array} b multiplication matrix or 2-dimensional array that is the matrix or 1-dimensional array that is the vector.
		* @returns new matrix as result of multiplication of matrices.
		* @see [Matrix multiplication]{@link https://en.wikipedia.org/wiki/Matrix_multiplication}
		* @example
		* const matrix = new Matrix( [[1, 2], [3, 4], [5, 6]] );
		* const res = matrix.multiply( [[7, 8, 9, 10], [11, 12, 13,14] );
		* res is : [[29, 32, 35, 38], [65, 72, 79, 86], [101, 112, 123, 134]]
		*/
		this.multiply = function ( b ) { };//Эту функцию засунул что бы построить jsdoc
		/**
		 * calls a function for each row in the matrix.
		 * @see [JavaScript Array forEach()]{@link https://www.w3schools.com/jsref/jsref_foreach.asp}
		 * */
		this.forEach = function () { };//Эту функцию засунул что бы построить jsdoc

		/**
		 * returns the number of rows in the matrix.
		 * */
		this.length;//Эту переменную засунул что бы построить jsdoc
		return new Proxy( a, {

			get: function ( target, name ) {

				const i = parseInt( name );
				if ( !isNaN( i ) ) {

					return target[i];

				}
				switch ( name ) {

					//case "isMatrix": return true;
					case "length": return target.length;
					case 'forEach': return target.forEach;
					case "multiply":
						return function ( b ) {

							const c = [],//multiply matrix
								l = a.length,//количество строк a
								m = a[0].length,//количество столбцов a равно количество строк b
								n = Array.isArray( b[0] ) ? b[0].length : 1;//количество столбцов b
							if ( m !== b.length ) {

								console.error('Matrix: Dimension mismatch in multiplication. Matrix A columns (' + m + ') must match Matrix B rows (' + b.length + ')');
								return;
								
							}
							for ( var i = 0; i < l; i++ ) {

								if ( n === 1 ) {

									//b is vector
									var s = 0;
									for ( var k = 0; k < m; k++ ) s = s + a[i][k] * b[k];
									c[i] = s;
									
								} else for ( var j = 0; j < n; j++ ) {

									//b is matrix
									var s = 0;
									for ( var k = 0; k < m; k++ ) s = s + a[i][k] * b[k][j]
									c[i] = c[i] || [];
									c[i][j] = s;
									
								}
								
							}
/*
							if ( !Array.isArray( b[0] ) ){

								//b is vector
								const t = [];
								b.forEach( item => t.push( [item] ) )
								b = t;
								
							}
							const c = [],//multiply matrix
								l = a.length,//количество строк a
								m = a[0].length;//количество столбцов a равно количество строк b
							var n;
							n = b[0].length;//количество столбцов b
							if ( m !== b.length ) {

								console.error('Matrix: Dimension mismatch in multiplication. Matrix A columns (' + m + ') must match Matrix B rows (' + b.length + ')');
								return;
								
							}
							for ( var i = 0; i < l; i++ ) {

								for ( var j = 0; j < n; j++ ) {

									var s = 0;
									for ( var k = 0; k < m; k++ ) s = s + a[i][k] * b[k][j]
									c[i] = c[i] || [];
									c[i][j] = s;
									
								}
								
							}
*/
							return new Matrix( c );

						}
					default: console.error( 'Matrix: Invalid name: ' + name );

				}

			},
			set: function ( target, name, value ) {

				target[i] = value;
				return true;

			}

		} );

	}

}
const Matrix2 = new Proxy( [], {

	get: function ( target, name, args ) {

		const i = parseInt( name );
		if ( !isNaN( i ) ) {

			return [target[i]];

		}
		switch ( name ) {

/*
			case 'push': return target.push;
			case 'length': return target.length;
			case 'forEach': return target.forEach;
			case 'isProxy': return true;
			case 'boPositionError': return target.boPositionError;
			case 'target': return target;
			case "reset":
				return function () {

					target.forEach( item => item.positionWorld = undefined );

				}
*/
			case "multiply":
				return function ( i ) {

					const v = [];
					return v;

				}
			default: console.error( 'Matrix: Invalid name: ' + name );

		}

	},
	set: function ( target, name, value ) {

		target[name] = value;
		return true;

	},

} );
export default Matrix;
