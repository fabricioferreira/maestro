
var gulp = require('gulp');
var jshint = require('gulp-jshint');
var eslint = require('gulp-eslint');

var sources = [
	'lib/**/*.js',
	'!node_modules/**',
  '!lib/report/public/*'
]

gulp.task('lint', function() {
	gulp.src(sources)
		.pipe(jshint('./.jshintrc'))
		.pipe(jshint.reporter('default'))
})

gulp.task('watch', function() {
  gulp.watch(sources, ['lint']);
})
