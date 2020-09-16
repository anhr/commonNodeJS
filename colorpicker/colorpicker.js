/**
 * @module ColorPicker
 * @description Pure JavaScript color picker.
 * @author Andrej Hristoliubov https://anhr.github.io/AboutMe/
 *
 * Thanks to https://github.com/DavidDurman/FlexiColorPicker
 *
 * @copyright 2011 Data Arts Team, Google Creative Lab
 *
 * @license under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */

import { create, paletteIndexes, Palette } from './index.js';
/**
 * pure JavaScript color picker without using images, external CSS or 1px divs.
 */
var ColorPicker = {

	create: create,
	paletteIndexes: paletteIndexes,
	palette: Palette,

}
export default ColorPicker;
