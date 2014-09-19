// basic path setting
var path = {
  src : 'assets',
  tmp : '.tmp',
  dist : 'build'
};

var gulp = require('gulp');
var sass = require('gulp-sass');
var minify = require('gulp-minify-css');
var plumber = require('gulp-plumber');
var browser = require("browser-sync");

// server
gulp.task("server", function() {
    browser({
        server: {
            baseDir: path.tmp
        }
    });
});

// sass
gulp.task('sass', function(){
  gulp.src(path.src + '/scss/**/*.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(minify())
    .pipe(gulp.dest(path.tmp + '/css/'))
    .pipe(browser.reload({stream:true}));
});

// watch
gulp.task('watch', function(){
  gulp.watch([path.src +'/scss/**/*.scss'], ['sass']);
});

gulp.task('default', ['server'], function() {
  gulp.watch([path.src +'/scss/**/*.scss'], ['sass']);
});