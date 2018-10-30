const gulp = require('gulp');
const htmlmin = require('gulp-htmlmin');
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const webpackConfig = require('./webpack.config.js');


/**
 *
 * @type {{pug: {pages: string[]}, dest: string}}
 */
const CONFIG = {
    src: {
        paths: ['app/src/index.js'],
    },
    pug: {
        paths: ['app/views/**/*'],
    },
    scss: {
        paths: ['app/styles/*.scss']
    },
    resources: {
        paths: ['app/assets/**/*'],
        dest: '/assets'
    },
    dest: 'dist/'
};



// @TODO build process
// @TODO deploy process




gulp.task("copy-views", () => {
    return gulp.src(CONFIG.pug.paths)
        .pipe(pug())
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest(CONFIG.dest))
});

gulp.task("copy-scss", function () {
    return gulp.src(CONFIG.scss.paths)
        .pipe(sass().on('error', sass.logError))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest(CONFIG.dest));
});

gulp.task("copy-assets", () => {
    return gulp.src(CONFIG.resources.paths)
        .pipe(gulp.dest(CONFIG.dest + CONFIG.resources.dest))
});

gulp.task("src", function () {
    return gulp.src(CONFIG.src.paths)
        .pipe(webpackStream(webpackConfig), webpack)
        .pipe(gulp.dest(CONFIG.dest));
});

gulp.task("build", gulp.parallel("src", "copy-views", "copy-scss", "copy-assets"));
