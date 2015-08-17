var gulp    = require('gulp');
var $       = require('gulp-load-plugins')();

gulp.task('transpile-app', function() {
  return gulp.src('app/index.es6.js')
    .pipe($.babel())
    .pipe($.rename('index.js'))
    .pipe(gulp.dest('app/'));
});
