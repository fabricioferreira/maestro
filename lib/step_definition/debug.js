var EE = require('events');
var _ = require('lodash');

var defaultOptions = {
	output: 'console'
};

module.exports.name = 'debug';

module.exports.build = function(options) {

	var step = {
		name: 'debug',
		ee: new EE(),
		options: {},
		isReady: false,
		logFunction: null
	}

	step.options = _.extend({}, defaultOptions, options)

	step.options.logFunction = options.logFunction || function(msg) {
		return '***' + msg + '***';
	}

	// called once, on startup
	step.ee.on('init', function() {
		step.ee.emit('init-finished');
	})

	// called during the message processing
	step.ee.on('pipe', function(msg) {
		var str = step.options.logFunction(msg);

		if (step.options.output === 'console') {
			console.log(str);
		}
		else {
			throw new Error('debug: could not find desired output ' + step.options.output);
		}

		// var sql = `
		// 	INSERT INTO logs VALUES (?, ?, ?)
		// `;
		//
		// db.query(sql, [step.name, str, new Date()], function(err, rows) {
		// 	if (err) throw err;
		// })

		step.ee.emit('pipe-next', msg);
	})

	return step;
}