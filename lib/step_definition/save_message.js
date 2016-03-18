var EE = require('events');
var _ = require('lodash');

var db = require('../database');

var defaultOptions = {
	output: 'sqlite'
};

module.exports.name = 'save-message';
module.exports.build = function(options) {

	var step = {
		name: 'save-message',
		ee: new EE(),
		options: {},
		isReady: false
	};

	step.options = _.extend({}, defaultOptions, options);

	// called once, on startup
	step.ee.on('init', function() {
		// initialize the database
		db.init(function(err) {
			if (err)
				throw err;

			step.ee.emit('init-finished');
		});
	});

	// called during the message processing
	step.ee.on('pipe', function(msg) {

		var sql = 'INSERT INTO messages VALUES (?, ?)';

		db.query(sql, [JSON.stringify(msg), new Date()], function(err, rows) {
			if (err) throw err;

			step.ee.emit('pipe-next', msg);
		});
	});

	return step;
};