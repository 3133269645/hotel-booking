const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'development',
  resolve: {
    extensions: ['.js', '.json'],
    alias: {
      process: require.resolve('process/browser'),   // Polyfill for process
      buffer: require.resolve('buffer'),              // Polyfill for buffer
      crypto: require.resolve('crypto-browserify'),   // Polyfill for crypto
      stream: require.resolve('stream-browserify'),   // Polyfill for stream
      util: require.resolve('util/'),                 // Polyfill for util
      path: require.resolve('path-browserify'),       // Polyfill for path module
    },
  },
  entry: path.resolve(__dirname, 'app/javascripts/app.js'),  // 确保入口是 app.js
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].js',
    clean: true,
    publicPath: '/',
  },
  devServer: {
    static: [
      path.resolve(__dirname, 'build'),  // Serve static files from the build folder
      path.resolve(__dirname, 'app'),    // Also serve files from the app folder
    ],
    historyApiFallback: true,
    hot: true,
    liveReload: true,
    port: 8545,
    open: {
      target: 'http://localhost:8545',
      browser: 'firefox',
    },
    client: {
      logging: 'info',
      overlay: true,
      progress: true,
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'app/index.html'),
    }),
  ],
  optimization: {
    splitChunks: {
      chunks: 'all', // 拆分所有模块（包括应用代码和第三方库）
    },
  },
};
