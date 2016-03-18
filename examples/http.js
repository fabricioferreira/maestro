var maestro = require('../maestro');

maestro.carry('http-listen', {
	port: 8889
});

maestro.carry('save-message', {
	output: 'sqlite'
});

maestro.carry('http-response', {
	status: 200,
	text: 'Ok'
});

maestro.carry('enqueue', {})

maestro.carry('external', {
	service: 'http://tool/resources/save',
	min: 1000,
	max: 3000
});

maestro.carry('dequeue', {});

maestro.carry('debug', {
	logFunction: function(msg) {
		return 'finished in ' + (Date.now() - msg._details.start);
	}
});

maestro.report({
	port: 8888
});

maestro.start();