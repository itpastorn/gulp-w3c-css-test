var gulp = require('gulp');
var cssvalidate = require('gulp-w3c-css');
var htmlvalidate = require("gulp-html-validator");
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

gulp.task("htmlvalid", () =>
    gulp.src("testhtml/*")
    .pipe(htmlvalidate())
    .pipe(map(function(file, done) {
        var messages = JSON.parse(file.contents.toString()).messages;
        if (messages.length === 0) {
            gutil.log("Success: " + file.path);
            gutil.log(gutil.colors.green("Inga problem funna\n"));
        } else {
            gutil.log("Problem upptäckta i " + file.path + "\n");
            for ( var msg of messages ) {
                gutil.log("Fil: " + file.path);
                if ( msg.firstLine ) {
                    gutil.log("Rader: " + msg.firstLine + " till " + msg.lastLine);
                } else {
                    gutil.log("Rad: " + msg.lastLine);
                    if ( msg.firstColumn != null ) {
                        gutil.log("Kolumner " + msg.firstColumn + " till " + msg.lastColumn);
                    } else {
                        gutil.log("Kolumn: " + msg.lastColumn);
                    }
                }
                if ( msg.type === "error" ) {
                    gutil.log(gutil.colors.red("Error: " + msg.message));
                } else if ( msg.type === "info" ) {
                    gutil.log(gutil.colors.gray("Info: " + msg.message));
                } else {
                    gutil.log(gutil.colors.yellow(msg.type + ": " + msg.message));
                }
                if ( msg.extract ) {
                    gutil.log(msg.extract.substring(0, msg.hiliteStart-1).trim() +
                        gutil.colors.yellow.bold(msg.extract.substr(msg.hiliteStart, msg.hiliteLength).trim()) +
                        msg.extract.substring(msg.hiliteStart + msg.hiliteLength).trim());
                }
                gutil.log("\n");

            }
        }
        gutil.log("------------------------------\n");
        done(null, file);
    }))
);

gulp.task('watch', () => {
    gulp.watch('testhtml', ['htmlvalid']);
    gulp.watch('testcss', ['cssvalid']);
})