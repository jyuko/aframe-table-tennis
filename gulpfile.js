var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');

gulp.task('js', function(){
    browserify({
        entries: ['index.js']
    })
        .bundle()
        .pipe(source('app.min.js'))
        .pipe(gulp.dest('dist/'));
});

gulp.task('default', ['js']);
