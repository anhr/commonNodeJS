/**
 * node.js version of the myThreejs
 * 
 * http://code.google.com/p/dat-gui
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
	  globals: {
/*
		'http://localhost/anhr/three.js/dev/build/three.module.js': 'THREE',
		'http://localhost/anhr/three.js/dev/src/objects/SpriteText.js': 'SpriteText_js',
		'https://raw.githack.com/anhr/commonNodeJS/master/lang.js': 'lang_js',
		'http://localhost/anhr/commonNodeJS/master/OrbitControlsGui.js': 'OrbitControlsGui',
		'https://raw.githack.com/anhr/commonNodeJS/master/OrbitControlsGui.js': 'OrbitControlsGui',
*/
    },
    // TODO: Remove default exports, and this line, in v0.8.0.
    exports: 'named',
    file: './build/myThreejs.js',
    format: 'umd',
    name: 'myThreejs',
    sourcemap: true,
    banner: banner
  }, {
    file: './build/myThreejs.module.js',
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
  ],
	external: [
//		'../../three.js/src/math/Vector3.js',
//		'../../three.js/src/math/',
/*
		'http://localhost/anhr/three.js/dev/build/three.module.js',
		'http://localhost/anhr/three.js/dev/src/objects/SpriteText.js',
		'https://raw.githack.com/anhr/commonNodeJS/master/lang.js',
		'http://localhost/anhr/commonNodeJS/master/OrbitControlsGui.js',
		'https://raw.githack.com/anhr/commonNodeJS/master/OrbitControlsGui.js',
*/
	],

};

