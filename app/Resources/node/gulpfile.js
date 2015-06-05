// @see http://blog.avisi.nl/2014/04/25/how-to-keep-a-fast-build-with-browserify-and-reactjs/

var gulp = require('gulp');
var browserify = require('browserify');
var watchify = require('watchify');
var source = require('vinyl-source-stream');
//var rename = require('gulp-rename');
var reactify = require('reactify');
var gutil = require('gulp-util');

var production = process.env.NODE_ENV === 'production';
var outputFileName = production ? 'bundle-prod.js' : 'bundle-dev.js';

function scripts(watch) {
    var bundler, rebundle;
    bundler = browserify('./app/app.js', {
        basedir: __dirname,
        debug: !production,
        cache: {}, // required for watchify
        packageCache: {}, // required for watchify
        fullPaths: watch // required to be true only for watchify
    });

    if(watch) {
        bundler = watchify(bundler)
    }

    bundler.transform(reactify);
    rebundle = function() {
        var stream = bundler.bundle();
        stream.on('error', handleError);
        stream = stream.pipe(source(outputFileName));
        //stream.pipe(rename(outputFileName));
        gutil.log('rebundled...');
        return stream.pipe(gulp.dest('./dist'));
    };

    bundler.on('update', rebundle);
    return rebundle();
}

gulp.task('scripts', function() {
    return scripts(false);
});

gulp.task('default', function() {
    gutil.log('watching...');
    return scripts(true);
});

function handleError(error, error2) {
    gutil.log(error);
    gutil.log(error2);
}
