"use strict";

var path = require("path");
var webpack = require("webpack");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var RewriteImportPlugin = require("less-plugin-rewrite-import");
var autoprefixer = require("autoprefixer");


const staticPath = "static";
const staticUrl = "/" + staticPath;


module.exports = {
    context: path.join(__dirname, "src/js"),
    entry: {
        index: ["./index.js"]
    },
    output: {
        path: path.join(__dirname, staticPath),
        outputPath: __dirname,
        filename: "[name].js"
    },
    resolve: {
        root: [
            path.join(__dirname, "src"),
            path.join(__dirname, "src/js")
        ],
        alias: {
        },
        modulesDirectories: ["node_modules"],
        extensions: ["", ".js", ".jsx"]
    },
    resolveLoader: {
        root: path.join(__dirname, "node_modules")
    },
    lessLoader: {
        lessPlugins: [
            new RewriteImportPlugin({
                paths: {
                    "../../theme.config": path.join(__dirname, "src/less/theme.config")
                }
            })
        ]
    },
    module: {
        loaders: [
            {
                loader: "babel-loader",
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                include: [
                    path.join(__dirname, "src/js")
                ],
                query: {
                    plugins: ["transform-runtime"],
                    presets: ["es2015", "stage-0", "react"]
                }
            },
            {
                loader: ExtractTextPlugin.extract("style", "!css!postcss!less", {
                    publicPath: ""
                }),
                test: /(\.less|theme\.config)$/
            },
            {
                loader: ExtractTextPlugin.extract("style", "!css!sass"),
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
    postcss: function () { return [autoprefixer]; },
    plugins: [
        // new webpack.optimize.CommonsChunkPlugin("vendor", "js/vendor.bundle.js"),
        // new webpack.optimize.UglifyJsPlugin({compressor: {screw_ie8: true, warnings: false}}),
        new ExtractTextPlugin("[name].css"),
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify("DEVELOPMENT")
            }
        })
    ],
    target: "web",
    debug: true,
    devtool: "#inline-source-map",
    devServer: {
        hot: true,
        publicPath: staticUrl,
        watchOptions: {
            aggregateTimeout: 300,
            poll: 1000
        }
    }
};
