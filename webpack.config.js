const Path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ExtractSassPlugin = require("extract-text-webpack-plugin");

const outputDir = Path.join(__dirname, "build/");
const isProd = process.env.NODE_ENV === "production";

module.exports = {
  entry: "./src/Index.bs.js",
  mode: isProd ? "production" : "development",
  output: {
    path: outputDir,
    publicPath: "/",
    filename: "index.js",
  },
  module: {
    rules: [{
      test:  /\.(sa|sc|c)ss$/,
      use: ExtractSassPlugin.extract({
        fallback: "style-loader",
        use: [
          { loader: 'css-loader', options: { minimize: true } },
          { loader: "sass-loader" },
        ],
      }),
    }, {
      test: /\.html$/,
      use: [{
        loader: "html-loader",
        options: {
          minimize: true,
          removeComments: true,
        }
      }]
    }],
  },
  plugins: [
    new ExtractSassPlugin({
      filename: "styles.css"
    }),
    new HtmlWebpackPlugin({
      hash: true,
      template: "./src/index.html",
    }),
    new CopyWebpackPlugin([
      { "from": "./src/img/example.png", "to": "./img/example.png" },
    ]),
    new webpack.DefinePlugin({
      PRODUCTION: isProd,
    })
  ]
};
