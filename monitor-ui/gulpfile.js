var path = require("path"),
    gulp = require("gulp"),
    sourcemaps = require("gulp-sourcemaps"),
    babel = require("gulp-babel"),
    concat = require("gulp-concat"),
    connect = require("gulp-connect"),
    minifyHTML = require('gulp-minify-html');


var distDir = path.join(__dirname, "dist");


gulp.task("build-html", function () {
    gulp.src(path.join(__dirname, "*.html"))
        .pipe(minifyHTML({quotes: true}))
        .pipe(gulp.dest(distDir))
        .pipe(connect.reload());
});

gulp.task("build-js", function () {
    var browserify = require("browserify");
    var browserifyCss = require('browserify-css');
    var babelify = require("babelify");
    var source = require('vinyl-source-stream');

    // b.plugin('factor-bundle', { outputs: [ 'bundle/x.js', 'bundle/y.js' ] });

    /*var cssBundle = null;
    var bundleStream = browserify({
        entries: [
            "./src/js/main.js"
        ],
        extensions: [".js", ".jsx", ".css", ".sass"]
    })
    .transform(babelify, {presets: ["es2015", "stage-0", "react"]})
    .transform(browserifyCss, {
        onFlush: function(options, done) {
            var File = require("vinyl");
            var cssBundle = new File({
                cwd: options.rootDir,
                base: options.relativePath,
                path: options.filename,
                contents: new Buffer(options.data)
            });
            console.log(options.data);
            done(null);
        }
    })
    .bundle()
    .pipe(source("signin.js"))
    .pipe(gulp.dest("./static/js"));*/

    var r = require("thought2")

});

gulp.task("build-css", function () {
});

gulp.task("build-sass", function () {
});

gulp.task("watch", function () {
    gulp.watch(["index.html", "signin.html"], ["build-html"]);
});

gulp.task("connect", ["watch"], function () {
    connect.server({
        root: distDir,
        port: 9495,
        livereload: true
    });
});

gulp.task("default", ["build-html", "build-js", "build-css", "build-sass"], function () {
});
