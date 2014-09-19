// basic path setting
var path = {
  src : 'assets',
  tmp : '.tmp',
  build : 'build'
};

var gulp = require('gulp');
var concat = require('gulp-concat');
var del = require('del');
var sass = require('gulp-sass');
var minify = require('gulp-minify-css');
var plumber = require('gulp-plumber');
var browser = require('browser-sync');
var runSequence = require('run-sequence');

// js
gulp.task('js', function(){
  runSequence(
    'js-concat',
    'js-copy',
    'js-clean'
  );
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

// js-clean
gulp.task('js-clean', function(cb) {
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
  'js',
  'watch'
]);

// build
gulp.task('build', [
  'cssmin'
]);