"use strict";

var path = require("path");
var precss = require('precss');
var autoprefixer = require('autoprefixer');
var webpack = require("webpack");
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: {
        signin: ["./src/js/signin.js"],
        vendor: ["react", "react-dom"]
    },
    output: {
        path: path.join(__dirname, "static"),
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
                loader: ExtractTextPlugin.extract("style", "!css!postcss"),
                test: /\.css$/
            },
            {
                loader: ExtractTextPlugin.extract("style", "!css!postcss!sass"),
                test: /\.scss$/,
                include: path.join(__dirname, "src/scss")
            },
            {
                loader: 'file?name=[path][name].[ext]',
                test: /\.(gif|svg|jpeg|png|jpg)$/
            },
            {
                loader: 'file?name=[name].[ext]',
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
        new webpack.optimize.UglifyJsPlugin({
            compressor: {
                screw_ie8: true,
                warnings: false
            }
        }),
        new ExtractTextPlugin("css/[name].css")
    ],
    taregt: "web",
    debug: true,
    devtool: "#inline-source-map"
}
