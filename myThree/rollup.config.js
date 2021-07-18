/**
 * @module MyThree
 * @description I use MyThree in my projects for displaying of my 3D objects in the canvas.
 *
 * @author [Andrej Hristoliubov]{@link https://anhr.github.io/AboutMe/}
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

const banner = fs.readFileSync( path.join( __dirname, 'licenseBanner.txt' ) );
function callback( err ) {
    if ( err ) throw err;
//    console.log( 'colorpicker.css was copied' );
}
//fs.rmdirSync( path.join( __dirname, 'build' ), { recursive: true, force: true } );
fs.mkdirSync( path.join( __dirname, 'build' ), { recursive: true, force: true } );
fs.copyFile( path.join( __dirname, '..\\colorpicker\\colorpicker.css' ), 'build\\colorpicker.css', callback );
const styles = 'styles';
//fs.rmdirSync( path.join( __dirname, styles ), { recursive: true, force: true } );
fs.mkdirSync( path.join( __dirname, styles ), { recursive: true, force: true } );
const DropdownMenu = 'DropdownMenu';
fs.copyFile( path.join( __dirname, '..\\' + DropdownMenu + '\\' + styles + '\\menu.css' ), styles + '\\menu.css', callback );
fs.copyFile( path.join( __dirname, '..\\' + DropdownMenu + '\\' + styles + '\\gui.css' ), styles + '\\gui.css', callback );
const Decorations = 'Decorations';
fs.mkdirSync( path.join( __dirname, styles + '\\' + Decorations ), { recursive: true, force: true } );
fs.copyFile( path.join( __dirname, '..\\' + DropdownMenu + '\\' + styles + '\\' + Decorations + '\\transparent.css' ), styles + '\\' + Decorations + '\\transparent.css', callback );
fs.copyFile( path.join( __dirname, '..\\' + DropdownMenu + '\\' + styles + '\\' + Decorations + '\\gradient.css' ), styles + '\\' + Decorations + '\\gradient.css', callback );
//fs.rmdirSync( path.join( __dirname, DropdownMenu ), { recursive: true, force: true } );
fs.mkdirSync( path.join( __dirname, DropdownMenu ), { recursive: true, force: true } );
fs.mkdirSync( path.join( __dirname, DropdownMenu + '\\' + styles ), { recursive: true, force: true } );
fs.copyFile( path.join( __dirname, '..\\' + DropdownMenu + '\\' + styles + '\\gui.css' ), DropdownMenu + '\\' + styles + '\\gui.css', callback );
fs.copyFile( path.join( __dirname, '..\\' + DropdownMenu + '\\' + styles + '\\menu.css' ), DropdownMenu + '\\' + styles + '\\menu.css', callback );
fs.copyFile( path.join( __dirname, '\\canvasContainer.html' ), 'build\\canvasContainer.html', callback );
/*
fs.copyFile( path.join( __dirname, '..\\getShaderMaterialPoints\\vertex.c' ), 'build\\vertex.c', callback );
fs.copyFile( path.join( __dirname, '..\\getShaderMaterialPoints\\fragment.c' ), 'build\\fragment.c', callback );
*/
fs.mkdirSync( path.join( __dirname, 'build\\frustumPoints' ), { recursive: true, force: true } );
fs.copyFile( path.join( __dirname, '..\\frustumPoints\\frustumPoints\\vertex.c' ), 'build\\frustumPoints\\vertex.c', callback );
fs.copyFile( path.join( __dirname, '..\\frustumPoints\\frustumPoints\\fragment.c' ), 'build\\frustumPoints\\fragment.c', callback );

fs.mkdirSync( path.join( __dirname, 'build\\getShaderMaterialPoints' ), { recursive: true, force: true } );
fs.copyFile( path.join( __dirname, '..\\getShaderMaterialPoints\\getShaderMaterialPoints\\vertex.c' ), 'build\\getShaderMaterialPoints\\vertex.c', callback );
fs.copyFile( path.join( __dirname, '..\\getShaderMaterialPoints\\getShaderMaterialPoints\\fragment.c' ), 'build\\getShaderMaterialPoints\\fragment.c', callback );
const textures = 'textures';
//fs.rmdirSync( path.join( __dirname, 'build\\' + textures ), { recursive: true, force: true } );
fs.mkdirSync( path.join( __dirname, 'build\\' + textures ), { recursive: true, force: true } );
fs.copyFile( path.join( __dirname, '..\\getShaderMaterialPoints\\' + textures + '\\point.png' ), 'build\\' + textures + '\\point.png', callback );

export default {

  input: 'myThree.js',

  output: [{
    // TODO: Remove default exports, and this line, in v0.8.0.
    exports: 'named',
    file: './build/myThree.js',
    format: 'umd',
    name: 'myThree',
    sourcemap: true,
    banner: banner
  }, {
    file: './build/myThree.module.js',
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
