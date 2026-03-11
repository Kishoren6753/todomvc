'use strict';

var express = require('express');
var fs = require('fs');
var learnJson = require('./learn.json');

var app = module.exports = express();

// `serve-favicon` is a nice-to-have for local browsing, but should not block
// startup in minimal/production installs used by preview environments.
var favicon;
try {
	favicon = require('serve-favicon');
} catch (e) {
	favicon = null;
}

app.use(express.static(__dirname));

if (favicon) {
	app.use(favicon(__dirname + '/site-assets/favicon.ico'));
}

Object.defineProperty(module.exports, 'learnJson', {
	set: function (backend) {
		learnJson.backend = backend;
		fs.writeFile(require.resolve('./learn.json'), JSON.stringify(learnJson, null, 2), function (err) {
			if (err) {
				throw err;
			}
		});
	}
});

// Start the HTTP server when invoked directly (e.g. `node server.js`).
// This is required for the preview environment which expects the process
// to bind to `process.env.PORT` (commonly 3000).
if (require.main === module) {
	var port = Number(process.env.PORT) || 3000;
	var host = process.env.HOST || '0.0.0.0';

	app.listen(port, host, function () {
		// eslint-disable-next-line no-console
		console.log('TodoMVC server listening on http://' + host + ':' + port);
	});
}
