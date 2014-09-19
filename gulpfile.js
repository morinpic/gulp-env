// basic path setting
var path = {
  src : 'assets',
  tmp : '.tmp',
  dist : 'build'
};

var gulp = require('gulp');
var sass = require('gulp-sass');
var minify = require('gulp-minify-css');

gulp.task('sass', function(){
  gulp.src(path.src + '/scss/**/*.scss')
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