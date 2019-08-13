var gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync').create(),
    useref = require('gulp-useref'),
    uglify = require('gulp-uglify'),
    gulpIf = require('gulp-if'),
    cssnano = require('gulp-cssnano'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    fileinclude = require('gulp-file-include'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    del = require('del'),
    runSequence = require('run-sequence');

// SASS
var distAssets = 'src/css/';
var sassOptions = { outputStyle: 'compressed' };
var autoprefixerOptions = { browsers: ['last 2 versions', '> 1%', 'Firefox ESR', 'ie >= 9'] };
gulp.task('sass', function () {
  return gulp
    .src('app/src/scss/**/*.scss')
    .pipe(sass(sassOptions))
    .pipe(sourcemaps.init())
    .pipe(autoprefixer(autoprefixerOptions))
    .pipe(concat('styles.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

// SCSS BUILD
gulp.task('sass-build', function() {
  return gulp
  .src('app/src/scss/**/*.scss')
  .pipe(sass(sassOptions))
  .pipe(sourcemaps.init())
  .pipe(autoprefixer(autoprefixerOptions))
  .pipe(concat('styles.css'))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest('dist/css'))
});

// JS
var jsFiles = 'app/src/js/**/*.js',
    jsDest = 'app/js';
gulp.task('scripts', function() {
    return gulp.src(jsFiles)
        .pipe(concat('scripts.js'))
        .pipe(gulp.dest(jsDest))
        .pipe(rename('scripts.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(jsDest))
        .pipe(browserSync.reload({
        stream: true
      }))
});

// JS BUILD
gulp.task('scripts-build', function() {
  return gulp.src(jsFiles)
    .pipe(concat('scripts.js'))
    .pipe(uglify())
    .pipe(rename('scripts.min.js'))
    .pipe(gulp.dest('dist/js'))
});

// USEREF
gulp.task('useref', function(){
  return gulp.src('app/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('dist'))
});

// IMAGES
gulp.task('images', function(){
  return gulp.src('app/images/**/*.+(png|jpg|jpeg|gif|svg|ico)')
  .pipe(gulp.dest('dist/images'))
});

// FONTS
gulp.task('fonts', function() {
  return gulp.src('app/fonts/**/*')
  .pipe(gulp.dest('dist/fonts'))
})

// CLEAN
gulp.task('clean:dist', function() {
  return del.sync('dist');
})

// LIVE RELOAD
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'app'
    },
    port: 3010
  })
})

// FILE INCLUDE
gulp.task('fileinclude', function() {
  gulp.src(['app/src/*.html'])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file',
    }))
    .pipe(gulp.dest('app/'))
    .pipe(browserSync.reload({
        stream: true
    }));
});

// WATCH
gulp.task('watch', ['sass', 'scripts','fileinclude', 'browserSync'], function (){
  gulp.watch('app/src/scss/**/*.scss', ['sass']);
  gulp.watch('app/src/js/**/*.js', ['scripts']);
  gulp.watch('app/src/**/*.html', ['fileinclude']);
  gulp.watch('app/src/*.html', ['fileinclude']);
});

gulp.task('build', function (callback) {
  runSequence('clean:dist',
    ['sass-build', 'scripts-build', 'useref', 'images', 'fonts'],
    callback
  )
});
