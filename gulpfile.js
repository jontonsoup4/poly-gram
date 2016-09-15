"use strict";

// General
var gulp = require("gulp");
var browserSync = require("browser-sync").create();
var del = require("del");
var htmlmin = require("gulp-htmlmin");
var plumber = require("gulp-plumber");
var reload = browserSync.reload;
var ghPages = require("gulp-gh-pages");

// Paths to project folders
var paths = {
    input: "src/**/*",
    output: "dist/**/*",
    bower: {
        input: "src/bower_components/**/*",
        output: "dist/bower_components/"
    },
    static: {
        input: "src/static/**/*.html",
        output: "dist/"
    }
};

// Gulp Tasks

// Move bower components
gulp.task("build:bower", ["clean:bower"], function () {
    return gulp.src(paths.bower.input)
        .pipe(gulp.dest(paths.bower.output))
        .pipe(reload({stream: true}));
});

// Copy and minify static files into output folder
gulp.task("build:static", ["clean:static"], function () {
    return gulp.src(paths.static.input)
        .pipe(plumber())
        .pipe(htmlmin({
            collapseWhitespace: true,
            minifyCSS: true,
            minifyJS: true,
            removeComments: true
        }))
        .pipe(gulp.dest(paths.static.output))
        .pipe(reload({stream: true}));
});

// Remove pre-existing content from output folders
gulp.task("clean:dist", function () {
    del.sync([
        paths.output
    ]);
});

gulp.task("clean:bower", function () {
    del.sync([
        paths.bower.output
    ]);
});

gulp.task("clean:static", function () {
    del.sync([
        "dist/*.*"
    ]);
});

// Watch all files
gulp.task("watch", function () {
    gulp.watch(paths.static.input, ["build:static"]);
});

// Deploy to Github
gulp.task("deploy", ["build"], function () {
    return gulp.src(paths.output)
        .pipe(ghPages({force: true}));
});

// Compile files
gulp.task("build", [
    "clean:dist",
    "build:bower",
    "build:static"
]);

// Serve
gulp.task("serve", ["watch"], function () {
    browserSync.init({
        server: "dist"
    });
});

// Default
gulp.task("default", [
    "build",
    "serve"
]);
