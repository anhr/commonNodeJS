/**
 * @module compareArrays
 * @description Compares two arrays and output to the console an error message if arrays is not identical.
 * 
 * @author [Andrej Hristoliubov]{@link https://github.com/anhr}
 *
 * @copyright 2011 Data Arts Team, Google Creative Lab
 *
 * @license under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */

/**
 * Compares two arrays and output to the console an error message if arrays is not identical.
 * @param {Array|Object} a1 
 * <pre>
 * if type is Array then, this array will be compare with <b>a2</b>
 *	Example. The following code:
 *	<b>
 *	const a1 = [1, 2, 3, 'cat'  , [1.1, 1.1000000001], { name: 'Tom'  , age: 20 }];
 *	const a2 = [1, 2, 4, 'mouse', [1.2, 1.1000000002], { name: 'Jerry', age: 20 }];										
 *	a1.i = 5;
 *	compareArrays(a1, a2);
 *	</b>
 *	will output to the console:
 *	<b>
 *	compareArrays: trueArray[2]: 3 !== checkArray[2]: 4
 *	compareArrays: trueArray[3]: cat !== checkArray[3]: mouse
 *	compareArrays: trueArray[4]["0"]: 1.1 !== checkArray[4]["0"]: 1.2
 *	compareArrays: trueArray[5]["name"]: Tom !== checkArray[5]["name"]: Jerry
 *	compareArrays: checkArray["i"] is undefined.
 *	</b>
 *	Note: <b>a1[4]["1"] = 1.1000000001</b> is equal <b>a2[4]["1"] = 1.1000000002</b> because the difference between two floats is less than 1.2e-5.
 *	
 * if type is Object then an object with two keys:
 *	First key is true array.
 *	Second key is array to check.
 *	Example. The following code:
 *	<b>
 *	const a1 = [1, 2, 3, 'cat'  , [1.1, 1.1000000001], { name: 'Tom'  , age: 20 }];
 *	const a2 = [1, 2, 4, 'mouse', [1.2, 1.1000000002], { name: 'Jerry', age: 20 }];										
 *	a1.i = 5;
 *	compareArrays({a1: a1, a2: a2});
 *	</b>
 *	will output to the console:
 *	<b>
 *	compareArrays: a1[2]: 3 !== a2[2]: 4
 *	compareArrays: a1[3]: cat !== a2[3]: mouse
 *	compareArrays: a1[4]["0"]: 1.1 !== a2[4]["0"]: 1.2
 *	compareArrays: a1[5]["name"]: Tom !== a2[5]["name"]: Jerry
 *	compareArrays: a2["i"] is undefined.
 *	</b>
 * </pre>
 * @param {Array} [a2] This array will be compare with <b>a1</b>. Use only if <b>a1</b> is Array type
 */
function compareArrays(a1, a2) {

	if (a1 instanceof Array) {

		compareArrays({ trueArray: a1, checkArray: a2 });
		return;

	}

	const strcompareArrays = 'compareArrays';
	const name2 = Object.keys(a1)[1];
	a2 = a1[name2];
	const name1 = Object.keys(a1)[0];
	a1 = a1[name1];
	if (a1.length !== a2.length) console.error(strcompareArrays + ': ' + name1 + '.length: ' + a1.length + ' !== ' + name2 + '.length: ' + a2.length);
	Object.keys(a1).forEach(i => {

		const i1 = a1[i], i2 = a2[i], type = typeof i1;
		if (i2 !== undefined) {

			if (type === "object")
				Object.keys(i1).forEach(key => {

					if (i1[key] instanceof Array) {

						const a = {};
						a[name1 + '[' + i + '].' + key] = i1[key];
						a[name2 + '[' + i + '].' + key] = i2[key];
						compareArrays(a);

					} else {

						if ( typeof i1[key] === "string" ) {

							if (i1[key] !== i2[key]) console.error(strcompareArrays + ': ' + name1 + '[' + i + ']["' + key + '"]: ' + i1[key] + ' !== ' + name2 + '[' + i + ']["' + key + '"]: ' + i2[key]);
							
						} else if (Math.abs(i1[key] - i2[key]) > 1.2e-5)//4e-6)//3.527606030825914e-7)
							console.error(strcompareArrays + ': ' + name1 + '[' + i + ']["' + key + '"]: ' + i1[key] + ' !== ' + name2 + '[' + i + ']["' + key + '"]: ' + i2[key]);

					}

				});
			else if ( ( a2.length > i ) && (i1 !== i2) ) console.error(strcompareArrays + ': ' + name1 + '[' + i + ']: ' + i1 + ' !== ' + name2 + '[' + i + ']: ' + i2);

		} else console.error(strcompareArrays + ': ' + name2 + '["' + i + '"] is undefined.');

	});

}
export default compareArrays;