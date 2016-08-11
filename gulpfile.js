var gulp = require('gulp');
var cssvalidate = require('gulp-w3c-css');
var gutil = require('gulp-util');
var map = require('map-stream');

gulp.task('cssvalid', function () {
  return gulp.src('testcss/*css')
    .pipe(cssvalidate())
    .pipe(map(function(file, done) {
      if (file.contents.length == 0) {
        console.log('Success: ' + file.path);
        console.log(gutil.colors.green('No errors or warnings\n'));
      } else {
        var results = JSON.parse(file.contents.toString());
        results.errors.forEach(function(error) {
          console.log('Error: ' + file.path + ': line ' + error.line);
          console.log(gutil.colors.red(error.message) + '\n');
        });
        results.warnings.forEach(function(warning) {
          console.log('Warning: ' + file.path + ': line ' + warning.line);
          console.log(gutil.colors.yellow(warning.message) + '\n');
        });
      }
      done(null, file);
    }));
});