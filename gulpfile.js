// basic path setting
var path = {
  src : 'assets',
  tmp : '.tmp',
  build : 'build'
};

var gulp = require('gulp');
var concat = require('gulp-concat');
var del = require('del');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var minify = require('gulp-minify-css');
var plumber = require('gulp-plumber');
var browser = require('browser-sync');
var runSequence = require('run-sequence');

// js
gulp.task('js', ['js-prepare'], function(){
  return gulp.src(path.tmp + '/js/**/*.js', !path.tmp + '/js/lib/***/*.js')
    .pipe(plumber())
    .pipe(browser.reload({stream:true}));
});

// js-prepare
gulp.task('js-prepare', function() {
  runSequence('js-concat', 'js-copy', 'js-del');
});

// js-concat
gulp.task('js-concat', function(){
  return gulp.src(path.src + '/js/common/*js')
    .pipe(concat('common.js'))
    .pipe(gulp.dest(path.tmp + '/js/'));
});

// js-copy
gulp.task('js-copy', function() {
  return gulp.src(path.src + '/js/**')
    .pipe(gulp.dest(path.tmp + '/js/'));
});

// js-del
gulp.task('js-del', function(cb) {
  del(path.tmp + '/js/common', cb);
});

// build-js
gulp.task('build-js', ['js'], function() {
  return gulp.src([path.tmp + '/js/**/*.js', !path.tmp + '/js/lib/**/*.js'])
    .pipe(uglify())
    .pipe(gulp.dest(path.build + '/js/'));
});

// sass
gulp.task('sass', function(){
  gulp.src(path.src + '/scss/**/*.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(gulp.dest(path.tmp + '/css/'))
    .pipe(browser.reload({stream:true}));
});

// build-css
gulp.task('build-css', ['sass'], function() {
  gulp.src(path.tmp + '/css/**/*.css')
    .pipe(minify())
    .pipe(gulp.dest(path.build + '/css/'));
});

// watch
gulp.task('watch', function(){
  gulp.watch([path.src +'/scss/**/*.scss'], ['sass']);
  gulp.watch([path.src +'/js/**/*.js'], ['js']);
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
  'js',
  'watch'
]);

// build
gulp.task('build', [
  'build-js',
  'build-css'
]);