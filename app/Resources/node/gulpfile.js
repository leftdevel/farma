// twaeked from http://blog.avisi.nl/2014/04/25/how-to-keep-a-fast-build-with-browserify-and-reactjs/

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var gutil = require('gulp-util');
var browserify = require('browserify');
var watchify = require('watchify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var reactify = require('reactify');

function scripts(prod) {
    var outputFileName = prod ? 'bundle-prod.js' : 'bundle-dev.js';

    var bundler, bundle;
    bundler = browserify('./app/app.js', {
        basedir: __dirname,
        debug: !prod,
        cache: {},
        packageCache: {},
        fullPaths: !prod
    });

    if(!prod) {
        bundler = watchify(bundler)
    }

    bundler.transform(reactify);

    bundle = function() {
        var stream = bundler.bundle();
        stream.on('error', handleError);
        stream = stream.pipe(source(outputFileName));

        if (prod) {
            stream = stream.pipe(buffer());
            stream = stream.pipe(uglify());
        }

        return stream.pipe(gulp.dest('./dist'));
    };

    bundler.on('update', bundle);
    return bundle();
}

gulp.task('prod', function() {
    gutil.log('bundling for production...');
    return scripts(true);
});

gulp.task('default', function() {
    gutil.log('watching...');
    return scripts(false);
});

function handleError(error) {
    gutil.log(error);
}
