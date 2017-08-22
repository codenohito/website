var gulp        = require('gulp');
var browserSync = require('browser-sync');
var sass        = require('gulp-sass');
var prefix      = require('gulp-autoprefixer');
var plumber     = require('gulp-plumber');
var uglify      = require('gulp-uglify');
var rename      = require("gulp-rename");
var imagemin    = require("gulp-imagemin");
var pngquant    = require('imagemin-pngquant');
var pug         = require('gulp-pug');

gulp.task('sass', function() {
  gulp.src('sass/main.scss')
  .pipe(plumber())
  .pipe(sass({outputStyle: 'compressed'}))
  .pipe(prefix('last 20 versions', '> 1%', 'ie 11'))
  .pipe(gulp.dest('dist/css'));
});

gulp.task('browser-sync', function() {
  browserSync.init(['dist/css/*.css', 'dist/js/*.js', 'dist/ru/index.html', 'dist/en/index.html'], {
    server: {
      baseDir: 'dist/'
    }
  });
});

gulp.task('scripts', function() {
  gulp.src('js/*.js')
  .pipe(plumber())
  .pipe(uglify())
  .pipe(rename({
    suffix: ".min",
  }))
  .pipe(gulp.dest('dist/js/'))
});

gulp.task('icons', function () {
  return gulp.src('favicon.ico')
  .pipe(plumber())
  .pipe(gulp.dest('dist/'));
});

gulp.task('favicon', function () {
  return gulp.src('ico/*')
  .pipe(plumber())
  .pipe(gulp.dest('dist/ico'));
});

gulp.task('images', ['icons', 'favicon'], function () {
  return gulp.src('images/*')
  .pipe(plumber())
  .pipe(imagemin({
    progressive: true,
    svgoPlugins: [{removeViewBox: true}],
    use: [pngquant()]
  }))
  .pipe(gulp.dest('dist/images'));
});

gulp.task('views', function buildHTML() {
  return gulp.src('views/**/*.pug')
  .pipe(plumber())
  .pipe(pug())
  .pipe(gulp.dest('dist/'))
});

gulp.task('default', ['views', 'sass', 'browser-sync', 'scripts', 'images'], function () {
  gulp.watch('sass/**/*.scss', ['sass']);
  gulp.watch('js/**/*.js', ['scripts']);
  gulp.watch('images/*', ['images']);
  gulp.watch('views/**/**/*.pug', ['views']);
});
