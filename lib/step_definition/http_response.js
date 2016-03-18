var EE = require('events');
var _ = require('lodash');

var defaultOptions = {
	status: 200,
	text: 'Finished'
}

module.exports.name = 'http-response';

module.exports.build = function(options) {

	var step = {
		name: 'http-response',
		ee: new EE(),
		options: {},
		isReady: false
	}

	step.options = _.extend({}, defaultOptions, options)

	// called once, on startup
	step.ee.on('init', function() {
		step.ee.emit('init-finished');
	})

	// called during the message processing
	step.ee.on('pipe', function(msg) {

		msg.__httpResponse(step.options.status, step.options.text);

		step.ee.emit('pipe-next', msg);
	})

	return step;
}