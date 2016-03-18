var EE = require('events');
var _ = require('lodash');

var defaultOptions = {
		min: 10,
		max: 15
}

module.exports.name = 'external';
module.exports.build = function(options) {

	var step = {
		name: 'external',
		ee: new EE(),
		options: {},
		isDirty: false
	}

	step.options = _.extend({}, defaultOptions, options)

	// called once, on startup
	step.ee.on('init', function() {
		step.ee.emit('init-finished');
	})

	// called during the message processing
	step.ee.on('pipe', function(msg) {

		var to = _.random(step.options.min, step.options.max);


		setTimeout(function() {
			step.ee.emit('pipe-next', msg);
		}, to);

	})

	return step;
}