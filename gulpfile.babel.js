'use strict';

import gulp from 'gulp';
import path from 'path';
import del from 'del';

var $ = require('gulp-load-plugins')({
  pattern: '*',
});

var environment = $.util.env.type || 'development';
var isProduction = environment === 'production';
var webpackConfig = require('./webpack.config.js')[environment];

var port = $.util.env.port || 3000;
var reload = $.browserSync.reload;

var src = 'src/';
var dist = 'dist/';

var sassOptions = {
  errLogToConsole: true,
  outputStyle: 'compact',
  //outputStyle: 'compressed',
  precision: 10
};

var autoprefixerBrowsers = [
  'ie >= 9',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 6',
  'ios >= 6',
  'android >= 4.4',
  'bb >= 10'
];

gulp.task('scripts', () => {
  return gulp.src(webpackConfig.entry)
    .pipe($.plumber())
    .pipe($.webpackStream(webpackConfig))
    .pipe(gulp.dest(dist + 'js/'))
    .pipe($.size({ title: 'js' }))
    .pipe(reload({ stream: true }));
});

gulp.task('html', () => {
  return gulp.src(src + 'index.html')
    .pipe(gulp.dest(dist))
    .pipe($.size({ title: 'html' }))
    .pipe(reload({ stream: true }));
});

gulp.task('styles', (cb) => {
  return gulp.src(src + 'scss/main.scss')
    .pipe($.sourcemaps.init())
    .pipe($.sassGlob())
    .pipe($.sass(sassOptions)).on('error', function(err) {
      $.notify().write(err);
      this.emit('end');
    })
    .pipe($.sourcemaps.write({ includeContent: false }))
    .pipe($.sourcemaps.init({ loadMaps: true }))
    .pipe($.autoprefixer({ browsers: autoprefixerBrowsers }))
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest(dist + 'css/'))
    .pipe($.size({ title: 'css' }))
    .pipe($.filter("**/*.css"))
    .pipe(reload({ stream: true }));
});

gulp.task('serve', () => {
  $.browserSync.init({
    server: {
      baseDir: 'dist'
    },
    notify: false,
    injectChanges: true
  });
});

gulp.task('static', (cb) => {
  return gulp.src(src + 'static/**/*')
    .pipe($.size({ title: 'static' }))
    .pipe(gulp.dest(dist + './'));
});

gulp.task('watch', () => {
  gulp.watch(src + 'scss/**/*.scss', ['styles']);
  gulp.watch(src + 'index.html', ['html']);
  gulp.watch([
    src + 'app/**/*.js',
    src + 'app/**/*.json',
    src + 'app/**/*.hbs'
  ], ['scripts']);
});

gulp.task('clean', (cb) => {
  del([dist], cb);
});

// by default build project and then watch files in order to trigger livereload
gulp.task('default', ['build', 'serve', 'watch']);

// waits until clean is finished then builds the project
gulp.task('build', ['clean'], () => {
  gulp.start(['static', 'html', 'scripts', 'styles']);
});
