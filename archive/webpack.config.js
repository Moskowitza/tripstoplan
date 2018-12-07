const webpack = require("webpack");
const nodeEnv = process.env.NODE_ENV || "production";
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

module.exports = {
  optimization: {
    minimizer: [
      // we specify a custom UglifyJsPlugin here to get source maps in production
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        uglifyOptions: {
          compress: false,
          ecma: 6,
          mangle: true
        },
        sourceMap: true
      })
    ]
  }
};
module.exports = {
  devtool: "source-map",
  entry: {
    filename: "./js/application.js"
  },
  output: {
    filename: "_build/bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        query: {
          presets: ["es2015-native-modules"]
        }
      }
    ]
  },
  plugins: [
    // uglify js
    // new webpack.optimize.UglifyJsPlugin({
    //   compress: { warnings: false },
    //   output: { comments: false },
    //   sourceMap: true
    // }),
    // env plugin
    new webpack.DefinePlugin({
      "proccess.env": { NODE_ENV: JSON.stringify(nodeEnv) }
    })
  ]
};
