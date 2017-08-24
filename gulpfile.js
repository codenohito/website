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

gulp.task('sass', function() {
  gulp.src('src/sass/main.scss')
  .pipe(plumber())
  .pipe(sass({outputStyle: 'compressed'}))
  .pipe(prefix('last 20 versions', '> 1%', 'ie 11'))
  .pipe(gulp.dest('dist/css'));
});

gulp.task('browser-sync', function() {
  browserSync.init(['dist/css/*.css', 'dist/js/*.js',
                    'dist/ru/index.html', 'dist/en/index.html'], {
    server: {
      baseDir: 'dist/'
    }
  });
});

gulp.task('scripts', function() {
  gulp.src('src/js/*.js')
    .pipe(plumber())
    .pipe(uglify())
    .pipe(concat('main.js'))
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest('dist/js/'));
});

gulp.task('favicon', function () {
  return gulp.src('src/favicon.ico').pipe(plumber()).pipe(gulp.dest('dist'));
});
gulp.task('icons', function () {
  return gulp.src('src/ico/*').pipe(plumber()).pipe(gulp.dest('dist/ico'));
});
gulp.task('images', ['favicon', 'icons'], function () {
  return gulp.src('src/images/*')
  .pipe(plumber())
  .pipe(imagemin({
    progressive: true,
    svgoPlugins: [{removeViewBox: true}],
    use: [pngquant()]
  }))
  .pipe(gulp.dest('dist/images'));
});

gulp.task('views', function buildHTML() {
  return gulp.src('src/views/**/*.pug')
  .pipe(plumber())
  .pipe(pug())
  .pipe(gulp.dest('dist/'))
});

// gulp.task('production_views', function buildHTML() {
//   return gulp.src('src/views/**/*.pug')
//   .pipe(plumber())
//   .pipe(pug({ data: { production_env: true } }))
//   .pipe(gulp.dest('dist/'))
// });

// gulp.task('build', ['production_views', 'sass', 'scripts', 'images'], function () {
//   return true;
// });

gulp.task('default', ['views', 'sass', 'browser-sync', 'scripts', 'images'], function () {
  gulp.watch('src/sass/**/*.scss', ['sass']);
  gulp.watch('src/js/**/*.js', ['scripts']);
  gulp.watch('src/images/*', ['images']);
  gulp.watch('src/views/**/**/*.pug', ['views']);
});
