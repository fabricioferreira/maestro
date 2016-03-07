

var EE = require('events');
var _ = require('lodash');

var MessageFactory = require('../message_factory.js').MessageFactory;

module.exports.name = 'timer-scheduler';
module.exports.build = function(timer) {
	
	var step = {
		name: 'timer-scheduler',
		ee: new EE(),
		options: {},
		isReady: false
	}

	// called once, on startup
	step.ee.on('init', function() {
		
		function trigger() {
			if (!step.isReady) {
				return;	
			}
			
			var msg = MessageFactory.build(step.name, 'cron');
			step.ee.emit('pipe-next', msg);
		}
		
		setInterval(trigger, timer);
			
		step.ee.emit('init-finished');		
	})
	
	// called during the message processing
	step.ee.on('pipe', function(msg) {
		
		// just move the message forward
		step.ee.emit('pipe-next', msg);		
	})
		
	return step;
}