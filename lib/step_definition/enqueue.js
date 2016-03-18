var EE = require('events');
var _ = require('lodash');

var defaultOptions = {
	name: 'default'
};

var _queueHolder = module.exports._queueHolder = {}

module.exports.name = 'enqueue';

module.exports.build = function(options) {

	var step = {
		name: 'enqueue',
		ee: new EE(),
		options: {},
		isReady: false
	}

	step.options = _.extend({}, defaultOptions, options)

	var running = false;

	// called once, on startup
	step.ee.on('init', function() {

		var def = {
			queue: [],
			dequeue: function() {
				if (def.queue.length > 0)
					step.ee.emit('pipe-next', def.queue.shift());
				else
					running = false;
			}
		};

		_queueHolder[step.options.name] = def;

		step.ee.emit('init-finished');
	})

	// called during the message processing
	step.ee.on('pipe', function(msg) {
		var def = _queueHolder[step.options.name];
		def.queue.push(msg);

		if (running === false) {
			running = true;
			step.ee.emit('pipe-next', def.queue.shift());
		}
	})

	return step;
}