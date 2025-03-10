/**
 * node.js version of the download of the file.
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

import { sync, async, escapeHtml } from './index.js';

var loadFile = {

	sync: sync,
	async: async,
	escapeHtml: escapeHtml,

}

export default loadFile;
