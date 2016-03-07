
var _io = null;

module.exports.build = function (io) {
	
	_io = io;
	
	io.on('connection', function (socket) {
		
		socket.emit('news', { hello: 'world' });
		
		socket.on('my other event', function (data) {
			console.log(data);
		});
	});
}

module.exports.emit = function(name, data) {
	_io.emit(name, data);
}
