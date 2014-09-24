// basic paths setting
var paths = {
  src : 'assets',
  tmp : '.tmp',
  build : 'build'
};

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require('del');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var runSequence = require('run-sequence');

// clean
gulp.task('clean', function (cb) {
  del(paths.tmp, cb);
});

// html
gulp.task('html', function() {
  gulp.src(paths.src + '/**/*.html')
    .pipe(gulp.dest(paths.tmp))
    .pipe(reload({stream:true}));
});

// js
gulp.task('js', ['js-prepare'], function(){
  return gulp.src(paths.tmp + '/js/**/*.js', !paths.tmp + '/js/lib/***/*.js')
    .pipe($.plumber())
    .pipe(reload({stream:true}));
});

// js-prepare
gulp.task('js-prepare', function() {
  runSequence('js-concat', 'js-copy', 'js-del');
});

// js-concat
gulp.task('js-concat', function(){
  return gulp.src(paths.src + '/js/common/*js')
    .pipe($.concat('common.js'))
    .pipe(gulp.dest(paths.tmp + '/js/'));
});

// js-copy
gulp.task('js-copy', function() {
  return gulp.src(paths.src + '/js/**')
    .pipe(gulp.dest(paths.tmp + '/js/'));
});

// js-del
gulp.task('js-del', function(cb) {
  del(paths.tmp + '/js/common', cb);
});

// sass
gulp.task('sass', function(){
  gulp.src(paths.src + '/scss/**/*.scss')
    .pipe($.plumber())
    .pipe($.sass())
    .pipe($.autoprefixer({
      browsers: ['last 2 versions'],
      cascade: true
    }))
    .pipe(gulp.dest(paths.tmp + '/css/'))
    .pipe(reload({stream:true}));
});

// img
gulp.task('img', function() {
  gulp.src(paths.src + '/img/**')
    .pipe(gulp.dest(paths.tmp + '/img/'));
});

// build-clean
gulp.task('build-clean', function (cb) {
  del(paths.build, cb);
});

// build-js
gulp.task('build-js', ['js'], function() {
  return gulp.src([paths.tmp + '/js/**/*.js', !paths.tmp + '/js/lib/**/*.js'])
    .pipe($.uglify())
    .pipe(gulp.dest(paths.build + '/js/'))
    .pipe($.size({title: 'javascripts'}));
});

// build-css
gulp.task('build-css', ['sass'], function() {
  gulp.src(paths.tmp + '/css/**/*.css')
    .pipe($.minifyCss())
    .pipe(gulp.dest(paths.build + '/css/'))
    .pipe($.size({title: 'styles'}));
});

// build-img
gulp.task('build-img', ['img'], function() {
  gulp.src(paths.tmp + '/img/**')
    .pipe($.imagemin())
    .pipe(gulp.dest(paths.build + '/img/'))
    .pipe($.size({title: 'images'}));
});

// watch
gulp.task('watch', ['server'], function(){
  gulp.watch([paths.src +'/**/*.html'], ['html']);
  gulp.watch([paths.src +'/js/**/*.js'], ['js']);
  gulp.watch([paths.src +'/scss/**/*.scss'], ['sass']);
});

// server
gulp.task("server", function() {
  browserSync({
    server: {
      baseDir: paths.tmp
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
