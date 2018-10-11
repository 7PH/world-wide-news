const gulp = require('gulp');
const htmlmin = require('gulp-htmlmin');
const pug = require('gulp-pug');


/**
 *
 * @type {{pug: {pages: string[]}, dest: string}}
 */
const CONFIG = {
    pug: {
        pages: ['app/view/**/*'],
    },
    dest: 'docs/'
};



// @TODO build process
// @TODO deploy process




gulp.task("copy-views", () => {
    return gulp.src(CONFIG.pug.pages)
        .pipe(pug())
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest(CONFIG.dest))
});