'use strict';

import fs from 'fs';
import nconf from 'nconf';

nconf.argv()
	.env()
	.file({
		file: 'conf/conf.json',
	});

export default nconf;
