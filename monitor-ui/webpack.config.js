"use strict";

var path = require("path");
var precss = require("precss");
var autoprefixer = require("autoprefixer");
var webpack = require("webpack");
var ExtractTextPlugin = require("extract-text-webpack-plugin");


const staticPath = "static";
const staticUrl = "/static/";


module.exports = {
  context: path.join(__dirname, "src/js"),
  entry: {
    vendor: ["lodash", "axios", "babel-polyfill", "react", "react-dom", "react-router", "redux", "react-redux", "redux-thunk"],
    index: ["./index.js"]
  },
  output: {
    path: path.join(__dirname, staticPath),
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
        loader: ExtractTextPlugin.extract("style", "!css?-minimize!postcss"),
        test: /\.css$/
      },
      {
        loader: ExtractTextPlugin.extract("style", "!css!postcss!sass"),
        test: /\.scss$/,
        include: path.join(__dirname, "src/scss")
      },
      {
        loader: "file?name=images/[name].[ext]",
        test: /\.(gif|svg|jpeg|png|jpg)$/
      },
      {
        loader: "file?name=fonts/[name].[ext]",
        test: /\.(woff|woff2|ttf|eot)$/
      }
    ]
  },
  postcss: function () {
      return [autoprefixer, precss];
  },
  resolve: {
      root: [
          path.join(__dirname, "src/js"),
          path.join(__dirname, "src/scss")
      ],
      alias: {
          "semantic-ui": path.join(__dirname, "node_modules/semantic-ui-css/components")
      },
      modulesDirectories: ["node_modules"],
      extensions: ["", ".js", ".jsx"]
  },
  resolveLoader: {
      root: path.join(__dirname, "node_modules")
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin("vendor", "js/vendor.bundle.js"),
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
