var webpack = require('webpack');
var polyfill = require('babel-polyfill');
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

module.exports.development = {
  debug: true,
  devtool: 'eval',
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
      libs: 'src/app/libs'
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    })
  ]
};

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
      libs: 'src/app/libs'
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
