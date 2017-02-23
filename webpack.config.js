var path = require('path');
var webpack = require('webpack');

var entry = {
    development: [
      'webpack/hot/dev-server',
      'webpack-dev-server/client?http://localhost:8080/',
      'babel-polyfill',
      './src/app/main.js'
    ],
    production: [
      'babel-polyfill',
      './src/app/main.js'
    ]
  },

  output = {
    path: __dirname,
    filename: 'main.js'
  },
  uglifyJsPlugin = new webpack.optimize.UglifyJsPlugin({
    compressor: {
      screw_ie8: true,
      warnings: false
    },
    output: {
      comments: false
    }
  });

//-- DEVELOPMENT BUILD
module.exports.development = {
  debug: true,
  devtool: 'eval',
  entry: entry.development,
  output: output,
  watch: true,
  module: {
    loaders: [
      { test: /\.js?$/, exclude: /node_modules/, loader: 'babel-loader' },
      { test: /\.json$/, exclude: /node_modules/, loader: 'json' }, {
        test: /\.hbs$/,
        exclude: /node_modules/,
        loader: 'handlebars-loader',
        query: {
          helperDirs: [__dirname + '/src/app/libs/HbsHelpers']
        }
      }
    ]
  },
  resolve: {
    root: path.resolve(__dirname),
    alias: {
      app: 'src/app',
      content: 'src/app/content',
      core: 'src/app/core',
      libs: 'src/app/libs',

      //-- SCROLLMAGIC fix
      'TweenLite': path.resolve('node_modules', 'gsap/src/uncompressed/TweenLite.js'),
      'TweenMax': path.resolve('node_modules', 'gsap/src/uncompressed/TweenMax.js'),
      'TimelineLite': path.resolve('node_modules', 'gsap/src/uncompressed/TimelineLite.js'),
      'TimelineMax': path.resolve('node_modules', 'gsap/src/uncompressed/TimelineMax.js'),
      'ScrollMagic': path.resolve('node_modules', 'scrollmagic/scrollmagic/uncompressed/ScrollMagic.js'),
      'animation.gsap': path.resolve('node_modules', 'scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap.js'),
      'debug.addIndicators': path.resolve('node_modules', 'scrollmagic/scrollmagic/uncompressed/plugins/debug.addIndicators.js')
    }
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin('main', null, false),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    })
  ]
};

//-- PRODUCTION BUILD
module.exports.production = {
  debug: false,
  entry: entry.production,
  output: output,
  module: {
    loaders: [
      { test: /\.js?$/, exclude: /node_modules/, loader: 'babel-loader' },
      { test: /\.json$/, exclude: /node_modules/, loader: 'json' }, {
        test: /\.hbs$/,
        exclude: /node_modules/,
        loader: 'handlebars-loader',
        query: {
          helperDirs: [__dirname + '/src/app/libs/HbsHelpers']
        }
      }
    ]
  },
  resolve: {
    root: path.resolve(__dirname),
    alias: {
      app: 'src/app',
      content: 'src/app/content',
      core: 'src/app/core',
      libs: 'src/app/libs',

      //-- SCROLLMAGIC fix
      'TweenLite': path.resolve('node_modules', 'gsap/src/uncompressed/TweenLite.js'),
      'TweenMax': path.resolve('node_modules', 'gsap/src/uncompressed/TweenMax.js'),
      'TimelineLite': path.resolve('node_modules', 'gsap/src/uncompressed/TimelineLite.js'),
      'TimelineMax': path.resolve('node_modules', 'gsap/src/uncompressed/TimelineMax.js'),
      'ScrollMagic': path.resolve('node_modules', 'scrollmagic/scrollmagic/uncompressed/ScrollMagic.js'),
      'animation.gsap': path.resolve('node_modules', 'scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap.js'),
      'debug.addIndicators': path.resolve('node_modules', 'scrollmagic/scrollmagic/uncompressed/plugins/debug.addIndicators.js')
    }
  },
  plugins: [
    uglifyJsPlugin,
    new webpack.optimize.CommonsChunkPlugin('main', null, false),
    new webpack.optimize.DedupePlugin(),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    })
  ]
};
