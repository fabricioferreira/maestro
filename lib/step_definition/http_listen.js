

var http = require('http');
var EE = require('events');
var _ = require('lodash');

var MessageFactory = require('../message_factory.js').MessageFactory;

var defaultOptions = {
	port: '8899'
};

var living = module.exports.living = { count: 0 }

module.exports.name = 'http-listen';

module.exports.build = function(options) {
	
	var step = {
		name: 'http-listen',
		ee: new EE(),
		options: {},
		isReady: false
	}

	step.options = _.extend({}, defaultOptions, options)

	// called once, on startup
	step.ee.on('init', function() {
		
		step._server = http.createServer(function(req, res) {
			
			var fullBody = [];
			
			var msg = MessageFactory.build('http-listen', 'http');
		
			req.on('data', function(chunk) {
				// append the current chunk of data to the fullBody variable
				fullBody.push(chunk.toString());
			});
			
			req.on('end', function() {
				
				living.count++;
				
				msg.payload = msg.payload || {};
				
				msg.payload = {
					body: fullBody.join(''),
					trailers: req.trailers,
					headers: req.headers,
					version: req.httpVersion,
					method: req.method,
					statusCode: req.statusCode,
					statusMessage: req.statusMessage,
					url: req.url
				}
				
				var httpResponse = function(status, text) {
					living.count--;
					
					res.writeHead(status, { 'Content-Type': 'text/plain' });
					res.end(text + '\n');
				}
				
				msg.__httpResponse = httpResponse;
								
				step.ee.emit('pipe-next', msg);
			})
		})
		.listen(step.options.port, function() {
			console.log('litening on port ', step.options.port);
			step.ee.emit('init-finished');
		})
	})
	
	// called during the message processing
	step.ee.on('pipe', function(msg) {
		// there is nothing to do, move message forward
		step.ee.emit('pipe-next', msg);
	})
	
	return step;
}