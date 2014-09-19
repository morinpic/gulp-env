// basic path setting
var path = {
  src : 'assets',
  tmp : '.tmp',
  build : 'build'
};

var gulp = require('gulp');
var sass = require('gulp-sass');
var minify = require('gulp-minify-css');
var plumber = require('gulp-plumber');
var browser = require('browser-sync');
var runSequence = require('run-sequence');

// sass
gulp.task('sass', function(){
  gulp.src(path.src + '/scss/**/*.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(gulp.dest(path.tmp + '/css/'))
    .pipe(browser.reload({stream:true}));
});

// cssmin
gulp.task('cssmin', ['sass'], function() {
  gulp.src(path.tmp + '/css/**/*.css')
    .pipe(minify())
    .pipe(gulp.dest(path.build + '/css/'));
});

// watch
gulp.task('watch', function(){
  gulp.watch([path.src +'/scss/**/*.scss'], ['sass']);
});

// server
gulp.task("server", function() {
    browser({
        server: {
            baseDir: path.tmp
        }
    });
});

// default
gulp.task('default', [
  'server',
  'sass',
  'watch'
]);

// build
gulp.task('build', [
  'cssmin'
]);