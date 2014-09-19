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

gulp.task('sass', function(){
  gulp.src(path.src + '/scss/**/*.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(minify())
    .pipe(gulp.dest(path.tmp + '/css/'));
});

gulp.task('watch', function(){
  gulp.watch([path.src +'/scss/**/*.scss'], ['sass']);
});

gulp.task('default', [
  'sass',
  'watch'
]);