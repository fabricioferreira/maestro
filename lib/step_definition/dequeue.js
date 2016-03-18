var EE = require('events');
var _ = require('lodash');

var defaultOptions = {
	name: 'default'
};

var _queueHolder = require('./enqueue')._queueHolder;

module.exports.name = 'dequeue';

module.exports.build = function(options) {

	var step = {
		name: 'dequeue',
		ee: new EE(),
		options: {},
		isReady: false
	}

	step.options = _.extend({}, defaultOptions, options)

	var def = null;

	// called once, on startup
	step.ee.on('init', function() {

		def = _queueHolder[step.options.name];

		step.ee.emit('init-finished');
	})

	// called during the message processing
	step.ee.on('pipe', function(msg) {
		def.dequeue();
		step.ee.emit('pipe-next', msg);
	})

	return step;
}