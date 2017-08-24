var gulp        = require('gulp');
var browserSync = require('browser-sync');
var sass        = require('gulp-sass');
var prefix      = require('gulp-autoprefixer');
var plumber     = require('gulp-plumber');
var uglify      = require('gulp-uglify');
var concat      = require('gulp-concat');
var rename      = require("gulp-rename");
var imagemin    = require("gulp-imagemin");
var pngquant    = require('imagemin-pngquant');
var pug         = require('gulp-pug');

var config = {
  prod: false,
  destination: 'tmp/'
};

gulp.task('production', function() {
  config.prod = true;
  config.destination = 'dist/';
});

gulp.task('sass', function() {
  gulp.src('src/sass/main.scss')
  .pipe(plumber())
  .pipe(sass({outputStyle: 'compressed'}))
  .pipe(prefix('last 20 versions', '> 1%', 'ie 11'))
  .pipe(gulp.dest(config.destination + 'css'));
});

gulp.task('browser-sync', function() {
  browserSync.init(['tmp/css/*.css', 'tmp/js/*.js',
                    'tmp/ru/index.html', 'tmp/en/index.html'], {
    server: {
      baseDir: 'tmp/'
    }
  });
});

gulp.task('scripts', function() {
  gulp.src('src/js/*.js')
    .pipe(plumber())
    .pipe(uglify())
    .pipe(concat('main.js'))
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest(config.destination + 'js'));
});

gulp.task('favicon', function () {
  return gulp.src('src/favicon.ico')
    .pipe(plumber())
    .pipe(gulp.dest(config.destination));
});
gulp.task('icons', function () {
  return gulp.src('src/ico/*')
    .pipe(plumber())
    .pipe(gulp.dest(config.destination + 'ico'));
});
gulp.task('images', ['favicon', 'icons'], function () {
  return gulp.src('src/images/*')
  .pipe(plumber())
  .pipe(imagemin({
    progressive: true,
    svgoPlugins: [{removeViewBox: true}],
    use: [pngquant()]
  }))
  .pipe(gulp.dest(config.destination + 'images'));
});

gulp.task('views', function buildHTML() {
  return gulp.src('src/views/**/index.pug')
  .pipe(plumber())
  .pipe(pug({ data: { production_env: config.prod } }))
  .pipe(gulp.dest(config.destination))
});

gulp.task('build', ['views', 'sass', 'scripts', 'images']);

gulp.task('default', ['views', 'sass', 'browser-sync', 'scripts', 'images'], function () {
  gulp.watch('src/sass/**/*.scss', ['sass']);
  gulp.watch('src/js/**/*.js', ['scripts']);
  gulp.watch('src/images/*', ['images']);
  gulp.watch('src/views/**/**/*.pug', ['views']);
});
