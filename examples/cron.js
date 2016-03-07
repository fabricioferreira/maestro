
var maestro = require('../maestro.js');

maestro.push('cron-scheduler', {
	cron: '*/2 * * * * *' // every 2 second
})

maestro.push('enqueue', {})

maestro.push('external', {
	service: 'http://tool/resources/save',
	min: 1000, 
	max: 3000
})

maestro.push('dequeue', {})

maestro.push('debug', {
	logFunction: function(msg) {
		return 'finished in ' + (Date.now() - msg._details.start);
	}
})

maestro.report({
	port: 8888
})

maestro.start()

