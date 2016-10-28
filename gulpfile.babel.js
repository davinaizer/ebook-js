/*
 IMPORTS
 */

import gulp from 'gulp';
import path from 'path';
import del from 'del';

/*
 CONSTANTS
 */

const $ = require('gulp-load-plugins')({pattern: '*'});
const environment = $.util.env.type || 'development';
const isProduction = environment === 'production';
const webpackConfig = require('./webpack.config.js')[environment];
const port = $.util.env.port || 3000;
const reload = $.browserSync.reload;

const src = 'src/';
const dist = 'dist/';
const sassOptions = {
  errLogToConsole: true,
  // outputStyle: 'compact',
  outputStyle: 'compressed',
  precision: 10
};
const autoprefixerBrowsers = [
  'last 2 version', 'safari 5', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'
];

/*
 HELPER FUNTIONS
 */

let getTimeStamp = () => {
  let myDate = new Date();
  let myYear = myDate.getFullYear().toString();
  let myMonth = ('0' + (myDate.getMonth() + 1)).slice(-2);
  let myDay = ('0' + myDate.getDate()).slice(-2);
  let mySeconds = myDate.getSeconds().toString();
  let myFullDate = myYear + myMonth + myDay + mySeconds;

  return myFullDate;
};

/*
 DEFAULT TASK
 */
gulp.task('default', (cb) => {
  $.runSequence('build', 'watch', 'serve', cb);
});

/*
 BUILDING TASKS
 */

gulp.task('build', () => {
  return $.runSequence('clean', 'build:styles', 'build:static', 'build:scripts');
});

gulp.task('build:scripts', () => {
  return gulp.src(webpackConfig.entry)
    .pipe($.plumber())
    .pipe($.webpackStream(webpackConfig))
    .pipe(gulp.dest(dist + 'js/'))
});

gulp.task('build:static', () => {
  return gulp.src(src + 'static/**/*')
    .pipe($.changed(dist))
    .pipe($.size({title: 'static'}))
    .pipe(gulp.dest(dist + './'))
    .pipe(reload({stream: true}));
});

gulp.task('build:styles', () => {
  return gulp.src(src + 'scss/main.scss')
    // .pipe($.sourcemaps.init())
    .pipe($.sassGlob())
    .pipe($.sass(sassOptions)).on('error', function (err) {
      $.notify().write(err);
      this.emit('end');
    })
    // .pipe($.sourcemaps.write({includeContent: false}))
    // .pipe($.sourcemaps.init({loadMaps: true}))
    .pipe($.autoprefixer({browsers: autoprefixerBrowsers}))
    // .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest(dist + 'css/'))
    .pipe($.size({title: 'css'}))
    .pipe($.filter("**/*.css"))
    .pipe(reload({stream: true}));
});

/*
 GLOBAL FUNTIONS
 */

gulp.task('clean', () => {
  return del([dist]);
});

gulp.task('opt-imgs', function () {
  return gulp.src(src + 'static/imgs/**/*')
    .pipe($.imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [$.imageminPngquant()]
    }))
    .pipe(gulp.dest('dist/imgs'));
});

gulp.task('serve', ['webpack:dev-server'], () => {
  $.browserSync({
    //server: {
    //baseDir: 'dist'
    //},
    notify: true,
    //injectChanges: true,
    proxy: 'localhost:8080',
    port: 3000
  });
});

gulp.task('webpack:dev-server', (cb) => {
  let config = Object.assign({}, webpackConfig);
  let compiler = $.webpack(config);
  let devServer = new $.webpackDevServer(compiler, {
    contentBase: dist,
    filename: 'main.js',
    hot: false,
    inline: true,
    progress: true,
    noInfo: true,
    stats: { colors: true }
  });

  devServer.listen(8080, 'localhost', (err) => {
    if (err) throw new $.util.PluginError('webpack-dev-server', err);
    cb();
  });

  return;
});

gulp.task('watch', () => {
  gulp.watch(src + 'static/**.*', ['build:static']);
  gulp.watch(src + 'scss/**/*.scss', ['build:styles']);
});

gulp.task('zip:build', () => {
  return gulp.src(dist + '/**')
    .pipe($.zip('ebookJS-dist_' + getTimeStamp() + '.zip'))
    .pipe(gulp.dest('.'));
});

