var sqlite3 = require('sqlite3')

var isInitiated = false;
var db = null;

module.exports.init = function(cb) {

	if (isInitiated)
		return cb(null, db);
	isInitiated = true;

	db = new sqlite3.Database('database.db', function(err) {
		if (err) throw err;

		var createTables = [
			[
			'CREATE TABLE',
			'IF NOT EXISTS messages (',
				'message TEXT,',
				'date INTEGER',
			')'
			].join(' \n '),
			[
				'CREATE TABLE',
				'IF NOT EXISTS logs (',
					'spell TEXT,',
					'message TEXT,',
					'date INTEGER',
				');'
			].join(' \n ')
		]

		var count = 0;
		var finished = 0;

		for (var i=0; i<createTables.length; i++) {
			var sql = createTables[count++];

			/*jshint loopfunc: true */
			db.run(sql, function(err) {
				if (err) return cb(err);

				finished++;

				if (finished === createTables.length)
					return cb(null, db)
			});
		}
	})
}

module.exports.query = function(query, parameters, cb) {
	db.serialize(function() {

		db.all(query, parameters, function(err, rows) {
			if (err) return cb(err);

			cb(null, rows);
		});
	});
}