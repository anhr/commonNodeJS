/**
 * node.js version of my common functions.
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

import fs from 'fs';
import path from 'path';
import resolve from 'rollup-plugin-node-resolve';
import cleanup from 'rollup-plugin-cleanup';
import babel from 'rollup-plugin-babel';

const banner = fs.readFileSync(path.join(__dirname, 'licenseBanner.txt'));

export default {
	input: 'index.js',
  output: [{
    // TODO: Remove default exports, and this line, in v0.8.0.
    exports: 'named',
	file: './build/common.js',
    format: 'umd',
	name: 'common',
    sourcemap: true,
    banner: banner
  }, {
	file: './build/common.module.js',
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
