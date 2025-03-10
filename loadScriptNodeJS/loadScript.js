﻿/**
 * node.js version of download of the scripts.
 * 
 * @author [Andrej Hristoliubov]{@link https://github.com/anhr}
 *
 * Copyright 2011 Data Arts Team, Google Creative Lab
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */

import { sync, async, escapeHtml } from './index.js';

var loadScript = {

	sync: sync,
	async: async,
	escapeHtml: escapeHtml,

}
export default loadScript;
