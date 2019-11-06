/**
 * node.js version of my common functions.
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
import defaultConfig from './rollup.config';
import uglify from 'rollup-plugin-uglify';

const banner = fs.readFileSync(path.join(__dirname, 'licenseBanner.txt'));

export default Object.assign({}, defaultConfig, {
  output: {
    // TODO: Remove default exports, and this line, in v0.8.0.
    exports: 'named',
	file: './build/lang.min.js',
    format: 'umd',
	name: 'lang',
    banner: banner
  },
  plugins: [...defaultConfig.plugins, uglify({
    output: {
      // Preserve license commenting in minified build.
      comments: function(node, comment) {
        return comment.type === 'comment2';
      }
    }
  })]
});
