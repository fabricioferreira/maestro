
var Perf = module.exports.Perf = function Perf() {
	this._lastCurrentSeccond = -1;
	this._limit = 1000;
	
	this._counter = {};
}

Perf.prototype.getCounter = function(seccond) {
	if (!this._counter[seccond]) {
		this._counter[seccond] = {
			all: 0,
			steps: [],
			count: 0,
			med: 0.0
		}
	}
	
	return this._counter[seccond];
}

Perf.prototype.clearCounter = function(seccond) {
	var keys = Object.keys(this._counter);
	
	keys.sort();
	
	var first = seccond - this._limit;
	
	for (var i=0; i<keys.length; i++) {
		var k = keys[i];
		if (parseInt(k) < first) {
			delete this._counter[k];
		}
	}
}

Perf.prototype.requestToResponse = function (start, end, currentSeccond) {
	var counter = this.getCounter(currentSeccond); 
	
	var diff = end - start;
	
	counter.all += diff;
}

Perf.prototype.stepStartToEnd = function (start, end, stepName, stepPosition, currentSeccond) {
	var counter = this.getCounter(currentSeccond); 
	
	var diff = end - start;
	
	var stepCounter = counter.steps[stepPosition];
	if (!stepCounter) {
		stepCounter = counter.steps[stepPosition] = {
			name: stepName,
			total: 0
		};
	}
	
	stepCounter.total += diff;
}

Perf.prototype.process = function(msg) {
	
	//var currentSeccond = Math.floor((Date.now() % 60000) / 1000);
	//var currentSeccond = Math.floor((msg.start % 60000) / 1000);
	var currentSeccond = Math.floor(msg._details.start / 1000);
	
	if (currentSeccond !== this._lastCurrentSeccond) {
		this._lastCurrentSeccond = currentSeccond;
		this.clearCounter(currentSeccond);
	}

	var counter = this.getCounter(currentSeccond);
	counter.count++;
		
	for (var i=0; i<msg._details.perf.length; i++) {
		var msgStep = msg._details.perf[i];
		this.stepStartToEnd(msgStep.start, msgStep.end, msgStep.name, i, currentSeccond);
	}
	
	this.requestToResponse(msg._details.start, msg._details.end, currentSeccond);
	
	counter.med = counter.all / counter.count;
	
	//console.log('a', JSON.stringify(this._counter, null, 2));
	
}