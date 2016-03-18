var expect = require('chai').expect;

describe('Maestro', function() {

	describe('.carry()', function() {

		it('should start with no processes to be carried', function() {
			var maestro = require('../maestro');
			expect(maestro).to.have.property('_steps').with.length(0);
		});

		it('should increment internal list of members', function() {
			var maestro = require('../maestro');
			maestro.carry('debug', {});
			expect(maestro).to.have.property('_steps').with.length(1);
		});
	});

	describe('.start()', function() {
		it('should initialize all processes that were included to be carried', function() {

		});
	});
});