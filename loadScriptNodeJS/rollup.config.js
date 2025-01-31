/**
 * @module loadScript
 * @description node.js version of the load JavaScript file.
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

const banner = fs.readFileSync( path.join( __dirname, 'licenseBanner.txt' ) );

export default {

    input: 'loadScript.js',

    output: [{
        // TODO: Remove default exports, and this line, in v0.8.0.
        exports: 'named',
        file: './build/loadScript.js',
        format: 'umd',
        name: 'loadScript',
        sourcemap: true,
        banner: banner
    }, {
        file: './build/loadScript.module.js',
        format: 'es',
        sourcemap: true,
        banner: banner
    }],
};
