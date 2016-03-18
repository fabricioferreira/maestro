

var EE = require('events');
var _ = require('lodash');

var CronJob = require('cron').CronJob;

var MessageFactory = require('../message_factory').MessageFactory;

var defaultOptions = {
	cron: '* * * * * *' // every second
};

module.exports.name = 'cron-scheduler';

module.exports.build = function(options) {

	var step = {
		name: 'cron-scheduler',
		ee: new EE(),
		options: {},
		cron: null,
		isReady: false
	}

	step.options = _.extend({}, defaultOptions, options)

	// called once, on startup
	step.ee.on('init', function() {

		// create the CronJob
		// very time that the cronjob triggers a empty message will be created to start the pipeline
		step.cron = new CronJob(step.options.cron, function() {

			if (!step.isReady) {
				throw new Error('cron_scheduler tryied to start a new message but is not ready yet');
			}

			console.log('cron firing')

			var msg = MessageFactory.build(step.name, 'cron');

			// fire next step
			step.ee.emit('pipe-next', msg);
		})

		step.cron.start();

		step.ee.emit('init-finished');
	})

	// called during the message processing
	step.ee.on('pipe', function(msg) {

		// just move the message forward
		step.ee.emit('pipe-next', msg);
	})

	return step;
}