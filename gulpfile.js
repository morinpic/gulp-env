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
var clean = require('gulp-clean');
var imagemin = require('gulp-imagemin');

// html
gulp.task('html', function() {
  gulp.src(path.src + '/**/*.html')
    .pipe(gulp.dest(path.tmp))
    .pipe(browser.reload({stream:true}));
});

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

// sass
gulp.task('sass', function(){
  gulp.src(path.src + '/scss/**/*.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(gulp.dest(path.tmp + '/css/'))
    .pipe(browser.reload({stream:true}));
});

// img
gulp.task('img', function() {
  gulp.src(path.src + '/img/**')
    .pipe(gulp.dest(path.tmp + '/img/'));
});

// clean
gulp.task('clean', function() {
  return gulp.src(path.tmp)
    .pipe(clean());
});

// build-clean
gulp.task('build-clean', function() {
  return gulp.src(path.build)
    .pipe(clean());
});

// build-js
gulp.task('build-js', ['js'], function() {
  return gulp.src([path.tmp + '/js/**/*.js', !path.tmp + '/js/lib/**/*.js'])
    .pipe(uglify())
    .pipe(gulp.dest(path.build + '/js/'));
});

// build-css
gulp.task('build-css', ['sass'], function() {
  gulp.src(path.tmp + '/css/**/*.css')
    .pipe(minify())
    .pipe(gulp.dest(path.build + '/css/'));
});

// build-img
gulp.task('build-img', ['img'], function() {
  gulp.src(path.tmp + '/img/**')
    .pipe(imagemin())
    .pipe(gulp.dest(path.build + '/img/'));
});

// watch
gulp.task('watch', ['server'], function(){
  gulp.watch([path.src +'/**/*.html'], ['html']);
  gulp.watch([path.src +'/js/**/*.js'], ['js']);
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
gulp.task('default', ['clean'], function() {
  runSequence(
    ['html', 'js', 'sass', 'img'],
    'watch'
  );
});

// build
gulp.task('build', ['build-clean'], function() {
  runSequence(
    ['build-js', 'build-css', 'build-img']
  );
});
