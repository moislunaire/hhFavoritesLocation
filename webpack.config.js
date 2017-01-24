'use strict';

const NODE_ENV = process.env.NODE_ENV || "dev";
const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');

function addHash(template, hash) {
  return NODE_ENV == 'prod' ?
    template.replace(/\.[^.]+$/, `.[${hash}]$&`) : template;
}

function buildDist() {
  return NODE_ENV == 'prod' ? 'prod' : 'dist'
}

module.exports = {
  context: __dirname + '/src',
  entry: {
    scripts: "./script",
    mdl: "./mdl",
    styles: "./style"
  },
  
  output: {
    path: __dirname + '/' + buildDist(),
    publicPath: "/",
    filename: addHash("[name].js", 'chunkhash')
  },
  
  watch: NODE_ENV == "dev",
  
  watchOptions: {
    aggregateTimeout: 100
  },
  
  devtool: NODE_ENV == "dev" ? "source-map" : null,
  
  plugins: [
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      NODE_ENV: JSON.stringify(NODE_ENV)
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: "common"
    }),
    new webpack.HotModuleReplacementPlugin(),
    new ExtractTextPlugin(addHash('[name].css', 'contenthash'), {allChunks: true, disable: NODE_ENV == 'dev'}),
    new HtmlWebpackPlugin({
      title: '',
      filename: './index.html',
      chunks: ['common', 'mdl', 'scripts', 'styles'],
      template: 'index.pug'
    }),
    new ScriptExtHtmlWebpackPlugin({
      defaultAttribute: 'defer'
    })
  ],
  
  resolve: {
    root: __dirname + '/vendor',
    modulesDirectories: ['node_modules'],
    extensions: ['', '.js', '.styl', '.pug']
  },
  
  resolveLoader: {
    modulesDirectories: ['node_modules'],
    //moduleTemplates: ['*-loader'],
    extensions: ['', '.js']
  },
  
  module: {
    loaders: [
      {
        test: /\.js$/,
        include: __dirname + '/src',
        loader: 'babel?presets[]=es2015'
      },
      {
        test: /\.styl$/,
        include: __dirname + '/src',
        loader: ExtractTextPlugin.extract('style', 'css?importLoaders=1!postcss!stylus?resolve url')
      },
      {
        test: /\.(svg|woff|woff2)$/,
        include: __dirname + '/src',
        loader: addHash('url?name=[path][name].[ext]&limit=1240', 'hash:6')
      },
      {
        test: /\.pug$/,
        include: __dirname + '/src',
        loader: 'pug'
      }
    ]
  },
  
  devServer: {
    port: 3000,
    contentBase: __dirname + '/dist',
    hot: true
  }
};

if (NODE_ENV == 'prod') {
  module.exports.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        drop_console: true,
        unsafe: true
      }
    })
  );
  module.exports.plugins.push(
    new CleanWebpackPlugin(['prod'], {
      verbose: true,
      //exclude: []
    })
  )
}