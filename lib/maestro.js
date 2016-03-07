
var EE = require('events');
var fs = require('fs');

var Perf = require('./perf').Perf;
var report = require('./report/report');

var db = require('./database');

var Maestro = function Maestro() {
	this._knowSteps = [];
	this._steps = [];
	this._renderDirty = {};
	this._ee = new EE();
	this._perf = new Perf();
}

Maestro.prototype.push = function (stepName, options) {
	var step = this._knowSteps[stepName].build(options);
	step._id = this._steps.length;
	this._steps.push(step);
}

function initAll(steps, cb) {

	function init(step, next) {
		step.ee.on('init-finished', function() {
			step.isReady = true;
			
			console.log(step.name, ' is initiated')
			
			next.ee.emit('init');
		})
	}
	
	function initLast(step, cb) {
		step.ee.on('init-finished', function() {
			console.log(step.name, ' is loaded')
			
			// execute callback only when the last step is finished
			// the last-step init-finished is executed only when
			// all steps from the pipeline are finished (startup)
			cb();
		})
	}
	
	for (var i=0; i < steps.length - 1; i++) {
		var step = steps[i];
		var next = steps[i+1];
		
		init(step, next);
	}
	
	var lastStep = steps[steps.length - 1];
	initLast(lastStep, cb);
	
	steps[0].ee.emit('init');
}

function bindAll(steps, perf, cb) {
	
	function bind(step, next) {
		step.ee.on('pipe-next', function(msg) {
			msg._details.perf[step._id].end = Date.now();
			msg._details.perf[next._id] = {
				name: next.name,
				start: Date.now()
			}
			
			next.ee.emit('pipe', msg);
		})
	}
	
	function bindLast(step) {
		step.ee.on('pipe-next', function(msg) {
			msg._details.perf[step._id].end = Date.now();
			msg._details.end = Date.now();
			
			perf.process(msg);
		})
	}
	
	for (var i=0; i < steps.length - 1; i++) {
		var step = steps[i];
		var next = steps[i+1];
		
		bind(step, next);
	}
	
	var lastStep = steps[steps.length - 1];
	bindLast(lastStep);
	
	cb();
}

Maestro.prototype.start = function () {
	var steps = this._steps;
	var perf = this._perf;
	
	db.init(function(err) {
		if (err) throw err;
		
		console.log('startup: connected with the database');
		
		bindAll(steps, perf, function() {
			console.log('startup: finished bind on all steps');
			
			initAll(steps, function() {
				console.log('startup: finished init on all steps');
			})
		})
	})
}

Maestro.prototype.report = function (options) {
	report.build(options);
	
	var self = this;
	
	setInterval(function() {
		report.emit('update', self._perf);
	}, 500);
}

Maestro.prototype.load = function (path) {
	var step = require(path);
	this._knowSteps[step.name] = step;
}

function loadDefaultSteps (sb) {
	
	var files = fs.readdirSync('./lib/step_definition/');
	
	for (var i=0; i < files.length; i++) {
		var name = files[i];
		var stepPath = './step_definition/' + name;
		sb.load(stepPath);
	}
}

module.exports.build = function() {
	var sb = new Maestro();
	loadDefaultSteps(sb);
	return sb;
}
