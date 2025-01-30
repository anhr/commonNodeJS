/**
 * @module Player
 * @description 3D objects animation.
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

function callback(err) {
    if (err) throw err;
    //    console.log( 'colorpicker.css was copied' );
}
fs.mkdirSync(path.join(__dirname, 'build'), { recursive: true, force: true });
fs.copyFile(path.join(__dirname, '..\\colorpicker\\colorpicker.css'), 'build\\colorpicker.css', callback);

export default {

    input: 'player.js',

    output: [{
        // TODO: Remove default exports, and this line, in v0.8.0.
        exports: 'named',
        file: './build/player.js',
        format: 'umd',
        name: 'Player',
        sourcemap: true,
        banner: banner
    }, {
        file: './build/player.module.js',
        format: 'es',
        sourcemap: true,
        banner: banner
    }],
};
