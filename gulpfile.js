var gulp = require('gulp'),
  injectPartials = require('gulp-inject-partials'),
  htmlmin = require('gulp-htmlmin'),
  sass = require('gulp-sass'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify')
  imagemin = require('gulp-imagemin'),
  autoPrefixer = require('gulp-autoprefixer'),
  browserSync = require('browser-sync').create();

gulp.task('compile-html', () => {
  return gulp.src('./app/html/*.html')
    .pipe(injectPartials())
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true
    }))
    .pipe(gulp.dest('./dist/'))
    .pipe(browserSync.stream());
});

/** Compile SASS */
gulp.task('sass', () => {
  return gulp.src('./app/sass/**/*.scss')
    .pipe(sass({
      outputStyle: 'compressed',
      precision: 10
    }).on('error', sass.logError))
    .pipe(autoPrefixer({
      browsers: ['last 2 versions', 'Explorer >= 11', 'Safari >= 7.1', 'iOS >= 7'],
      cascade: false
    }))
    .pipe(gulp.dest('./dist/css/'))
    .pipe(browserSync.stream());
});

gulp.task('scripts', () => {
  return gulp.src('./app/scripts/*.js')
    .pipe(concat('app.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/js'))
    .pipe(browserSync.stream());
});

gulp.task('vendors', () => {
  return gulp.src([
    './node_modules/jquery/dist/jquery.js',
    './node_modules/bootstrap-sass/assets/javascripts/bootstrap.js',
  ])
    .pipe(concat('vendor.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/js'));
});

gulp.task('images', () => {
  return gulp.src('./app/images/*')
    .pipe(imagemin())
    .pipe(gulp.dest('./dist/img'))
    .pipe(browserSync.stream());
});

gulp.task('server', ['sass', 'compile-html', 'scripts', 'images'], () => {
    browserSync.init({
        server: "./dist",
        open: false
    });

    gulp.watch("./app/sass/**/*.scss", ['sass']);
    gulp.watch("./app/html/**/*.html", ['compile-html']);
    gulp.watch("./app/scripts/**/*.js", ['scripts']);
    gulp.watch("./app/images/**/*", ['images']);
});

gulp.task('default', ['server']);