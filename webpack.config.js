var webpack = require('webpack');
var path = require('path');

var entry = ['babel-polyfill', './src/app/main.js'],
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
  entry: entry,
  output: output,
  watch:true,
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
      },
      { test: /\.css$/, loader: 'css-loader' }
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
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    })
  ]
};

//-- PRODUCTION BUILD
module.exports.production = {
  debug: false,
  entry: entry,
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
      },
      { test: /\.css$/, loader: 'css-loader' }
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
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    })
  ]
};
