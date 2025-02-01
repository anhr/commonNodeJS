/**
 * node.js version of the cookie.
 * Cookies let you store user information in web pages.
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
import defaultConfig from './rollup.config';
import uglify from 'rollup-plugin-uglify';

//Build cookie.module.min.js
//https://www.npmjs.com/package/uglify-es
const UglifyJS = require("uglify-es"),
    code = fs.readFileSync(path.join(__dirname, 'build/cookie.module.js'), "utf8"),
    result = UglifyJS.minify(code);
if (result.error !== undefined)
    console.log(result.error); // runtime error, or `undefined` if no error
else fs.writeFileSync("build/cookie.module.min.js", result.code, "utf8");

const banner = fs.readFileSync(path.join(__dirname, 'licenseBanner.txt'));

export default Object.assign({}, defaultConfig, {
  output: {
    // TODO: Remove default exports, and this line, in v0.8.0.
    exports: 'named',
	file: './build/cookie.min.js',
    format: 'umd',
	name: 'cookie',
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
