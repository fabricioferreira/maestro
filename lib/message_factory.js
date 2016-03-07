
var uuid = require('uuid');

module.exports.MessageFactory = {
	
	build: function(stepName, messageType) {
		
		var msg = {
			_details: {
				createdOn: new Date(),
				start: Date.now(),
				end: null,
				id: uuid.v4(),
				perf: []
			},
			type: messageType
		}
		
		msg._details.perf.push({
			name: stepName,
			start: Date.now()
		})
		
		return msg;
	}
}
