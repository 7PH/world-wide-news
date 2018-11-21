const gulp = require("gulp");
const htmlmin = require("gulp-htmlmin");
const pug = require("gulp-pug");
const sass = require("gulp-sass");
const cleanCSS = require("gulp-clean-css");
const webpack = require("webpack");
const webpackStream = require("webpack-stream");
const webpackConfig = require("./webpack.config.js");
const terser = require("gulp-terser");
const jsObfuscator = require("gulp-javascript-obfuscator");


/**
 *
 */
const CONFIG = {
    src: {
        paths: ["app/client/src/index.js"],
    },
    pug: {
        paths: ["app/client/views/**/*.pug"],
    },
    scss: {
        paths: ["app/client/styles/*.scss"]
    },
    resources: {
        paths: ["app/client/assets/**/*"]
    },
    mode: process.env.mode === "prod" ? "production" : "development",
    dest: "docs/"
};

gulp.task("copy-views", () =>
    gulp.src(CONFIG.pug.paths)
        .pipe(pug())
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest(CONFIG.dest))
);

gulp.task("copy-scss", function () {
    return gulp.src(CONFIG.scss.paths)
        .pipe(sass().on("error", sass.logError))
        .pipe(cleanCSS({compatibility: "ie8"}))
        .pipe(gulp.dest(CONFIG.dest));
});

gulp.task("copy-assets", () => {
    return gulp.src(CONFIG.resources.paths)
        .pipe(gulp.dest(CONFIG.dest));
});

gulp.task("src", function () {

    let bundled = gulp.src(CONFIG.src.paths)
        .pipe(webpackStream(webpackConfig), webpack);

    if (CONFIG.mode !== "development")
        bundled = bundled
            .pipe(terser())
            .pipe(jsObfuscator());

    return bundled.pipe(gulp.dest(CONFIG.dest));
});

gulp.task("build", gulp.parallel("src", "copy-views", "copy-scss", "copy-assets"));
