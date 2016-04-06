"use strict";

var path = require("path");
var precss = require('precss');
var autoprefixer = require('autoprefixer');
var webpack = require("webpack");
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var staticPath = "/static/";

module.exports = {
  context: path.join(__dirname, "src/js"),
  entry: {
    index: ["babel-polyfill", "./index.js"]
  },
  output: {
    path: path.join(__dirname, "static"),
    outputPath: __dirname,
    filename: "js/[name].js"
  },
  module: {
    loaders: [
      {
        loader: "babel-loader",
        test: /\.jsx?$/,
        include: [
          path.join(__dirname, "src/js")
        ],
        query: {
          plugins: ["transform-runtime"],
          presets: ["es2015", "stage-0", "react"]
        }
      },
      {
        loader: ExtractTextPlugin.extract("style-loader", "!css-loader!sass-loader?sourceMap"),
        test: /\.scss$/,
        include: path.join(__dirname, "src/scss")
      },
      {
        loader: ExtractTextPlugin.extract("style-loader", "!css-loader?sourceMap"),
        test: /\.css$/,
        include: path.join(__dirname, "src/css")
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery",
      _: "lodash"
    }),
    /*new webpack.optimize.UglifyJsPlugin({
      compressor: {
        screw_ie8: true,
        warnings: false
      }
    }),*/
    new ExtractTextPlugin("css/[name].css")
  ],
  taregt: "web",
  debug: true,
  devtool: "#inline-source-map",
  devServer: {
    hot: true,
    publicPath: "/static",
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000 // is this the same as specifying --watch-poll?
    }
  }
}
