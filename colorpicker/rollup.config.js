/**
 * ColorPicker - pure JavaScript color picker.
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

import fs from 'fs';
import path from 'path';
import resolve from 'rollup-plugin-node-resolve';
import cleanup from 'rollup-plugin-cleanup';
import babel from 'rollup-plugin-babel';

const banner = fs.readFileSync(path.join(__dirname, 'licenseBanner.txt'));

export default {

    //При использовании <script src="http://localhost/anhr/ColorPicker/master/build/colorpicker.js"></script>
    //Появляется ошибка:
    //Uncaught TypeError: ColorPicker.create is not a function
  //input: 'colorpicker.js',

    //При использовании import ColorPicker from 'http://localhost/anhr/colorpicker/master/build/colorpicker.module.js';
    //Появляется ошибка:
    //Uncaught SyntaxError: The requested module 'http://localhost/anhr/colorpicker/master/build/colorpicker.module.js' does not provide an export named 'default'
    //Вместо этого надо использовать
    //import ColorPicker from './colorpicker/master/colorpicker.js';
  input: 'index.js',

  output: [{
    // TODO: Remove default exports, and this line, in v0.8.0.
    exports: 'named',
	file: './build/colorpicker.js',
    format: 'umd',
	name: 'ColorPicker',
    sourcemap: true,
    banner: banner
  }, {
	file: './build/colorpicker.module.js',
    format: 'es',
    sourcemap: true,
    banner: banner
  }],
  watch: {
    include: 'src/**'
  },
  plugins: [
	  resolve(),
    babel({
      plugins: ['external-helpers'],
      exclude: 'node_modules/**'
    }),
    cleanup()
  ]
};
