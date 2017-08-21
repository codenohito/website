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
  .pipe(sass({outputStyle: 'compressed'}))
  .pipe(prefix('last 20 versions', '> 1%', 'ie 11'))
  .pipe(plumber())
  .pipe(gulp.dest('css'));
});

gulp.task('browser-sync', function() {
  browserSync.init(['css/*.css', 'js/**/*.js', 'index.html'], {
    server: {
      baseDir: './'
    },
    notify: false
  });
});

gulp.task('scripts', function() {
  gulp.src('js/*.js')
  .pipe(uglify())
  .pipe(rename({
    dirname: "min",
    suffix: ".min",
  }))
  .pipe(gulp.dest('js'))
});

gulp.task('images', function () {
  return gulp.src('images/*')
  .pipe(imagemin({
    progressive: true,
    svgoPlugins: [{removeViewBox: false}],
    use: [pngquant()]
  }))
  .pipe(gulp.dest('images'));
});

gulp.task('views', function buildHTML() {
  return gulp.src('views/**/*.pug')
  .pipe(pug())
  .pipe(gulp.dest('./'))
});

gulp.task('default', ['views', 'sass', 'browser-sync', 'scripts', 'images'], function () {
  gulp.watch('sass/**/*.scss', ['sass']);
  gulp.watch('js/**/*.js', ['scripts']);
  gulp.watch('images/*', ['images']);
  gulp.watch('views/**/*.pug', ['views']);
});
