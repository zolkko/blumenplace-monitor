var gulp = require('gulp'),
    run = require('gulp-run'),
    source = require('vinyl-source-stream'),
    browserify = require('browserify'),
    aliasify = require('aliasify'),
    uglifyify = require('uglifyify'),
    clean = require('gulp-clean'),
    path = require('path');


var srcDir = path.join(__dirname, 'monitor', 'static'),
    dstDir = path.join(__dirname, 'static-dev'),
    dstJsDir = path.join(dstDir, 'js'),
    dstCssDir = path.join(dstDir, 'css');


gulp.task('tests', function () {
    var fullPath = path.join(__dirname, 'monitor', 'static', 'tests', 'buster.js');
    run('buster-test --config=' + fullPath).exec();
});


gulp.task('clean', function () {
    gulp.src(path.join(dstDir, '**', '*.js'), {read: false})
        .pipe(clean());

    gulp.src(path.join(dstDir, '**', '*.css'), {read: false})
        .pipe(clean());
});


/*gulp.task('build-sass', function () {
    gulp.src(path.join(srcDir, 'css/*.scss')
        .pipe(sass())
        .pipe(gulp.dest(path.join(dstDir, 'css')));
});*/


gulp.task('build-js', function () {
    var options = { paths: [ path.join(__dirname, srcDir, 'js'), ] };

    var alias = aliasify.configure({
                aliases: {
                    'underscore': 'lodash'
                },
                configDir: __dirname,
                verbose: false
            });

    browserify(gulp.src('verndor.js', {read: false}), options)
        .require(path.join(__dirname, './bower_components/exoskeleton/exoskeleton.js'), {expose: 'exoskeleton'})
        .require(path.join(__dirname, './bower_components/lodash/dist/lodash.js'), {expose: 'lodash'})
        .transform(alias)
        .external('jquery')
        .transform({global: true}, uglifyify)
        .bundle()
        .pipe(source('vendor.js'))
        .pipe(gulp.dest(path.join(dstDir, 'js')));

    browserify('sign-in.js', options)
        .transform({global: true}, uglifyify)
        .bundle()
        .pipe(source('sign-in.js'))
        .pipe(gulp.dest(path.join(dstDir, 'js')));

    browserify('main.js', options)
        .external('exoskeleton')
        .transform(alias)
        .transform({global: true}, uglifyify)
        .bundle()
        .pipe(source('main.js'))
        .pipe(gulp.dest(path.join(dstDir, 'js')));
});

gulp.task('default', ['build-js', 'build-sass'], function () {
});

