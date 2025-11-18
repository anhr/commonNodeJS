/**
 * @module Position
 * @description Adds a x, y, z, w property to the vertice position array.
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
 * Adds a x, y, z, w property to the vertice position array.
 * @param {array} position array of the vertice position.
 * position[0] is x coordinate.
 * position[1] is y coordinate.
 * position[2] is z coordinate.
 * position[3] is w coordinate.
 * @returns {array} Array x, y, z, w properties.
 */
const Position = (position) => {

	Object.defineProperty(position, 'x', {

		get: () => { return position[0]; },
		set: (x) => {

			if (position[0] === x) return true;
			position[0] = x;
			return true;

		},

	});
	Object.defineProperty(position, 'y', {

		get: () => { return position[1]; },
		set: (y) => {

			if (position[1] === y) return true;
			position[1] = y;
			return true;

		},

	});
	Object.defineProperty(position, 'z', {

		get: () => { return position[2]; },
		set: (z) => {

			if (position[2] === z) return true;
			position[2] = z;
			return true;

		},

	});
	Object.defineProperty(position, 'w', {

		get: () => { return position[3]; },
		set: (w) => {

			if (position[3] === w) return true;
			position[3] = w;
			return true;

		},

	});
	return position;

}

export default Position;
