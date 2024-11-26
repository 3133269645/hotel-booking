const HtmlWebPackPlugin = require("html-webpack-plugin");
const path = require('path');
module.exports = {
  devtool: 'eval-source-map',

  entry:  __dirname + "/app/javascripts/app.js",
  output: {
    path: __dirname + "/build",
    filename: "bundle.js"
  },
  devServer: {
    index: 'index.html',
    contentBase: "./build",
    historyApiFallback: true,
    inline: true, // 这个选项启用了 HMR
    port: 8080,
    open: false,
    hot: true, 
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader"
          }
        ]
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            options: { minimize: true }
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./app/index.html",
      filename: "index.html" // 注意这里的路径应该是相对于输出目录的
    })
  ]
};