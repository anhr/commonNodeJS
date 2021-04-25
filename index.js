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

import { getLanguageCode } from './lang.js';
import three from './three.js';
const common = {

    getLanguageCode: getLanguageCode,
    three: three,

}

export default common;
