const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
  mode: 'development',
  stats: {
    children: true,
  },
  resolve: {
    extensions: ['.js', '.json'],
    alias: {
      process: require.resolve("process/browser"), // 解决 process 模块问题
    },
  },
  devtool: "eval-source-map", // 开发模式下使用 source map
  entry: path.resolve(__dirname, 'app/javascripts/booking.js'), // 确保路径正确

  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].[contenthash].js', // 使用 contenthash 生成文件名，避免缓存问题
    clean: true,
    publicPath: '/',
  },

  optimization: {
    splitChunks: {
      chunks: 'all', // 对所有模块进行代码分割
      maxInitialRequests: Infinity, // 允许任意数量的初始请求
      minSize: 20000, // 文件大于 20KB 才会分割
    },
    runtimeChunk: 'single', // 提取运行时代码，以便共享
    minimize: true, // 启用代码压缩
  },

  devServer: {
    static: [
      path.resolve(__dirname, 'build'), // 确保 build 文件夹的内容能够提供服务
      path.resolve(__dirname, 'app')    // 提供 app 文件夹中的静态资源
    ], // 设置静态文件根目录
    historyApiFallback: true, // 防止单页应用（SPA）中刷新时出现404
    hot: true, // 启用热模块替换（HMR）
    liveReload: true, // 启用实时刷新
    port: 8545, // 本地开发服务器端口
    open: {
      target: 'http://localhost:8545', // 启动时打开的 URL
      browser: 'firefox', // 自动使用 Firefox 打开
    },
    client: {
      logging: 'info', // 控制在浏览器中输出的日志信息
      overlay: true, // 错误时显示覆盖层
      progress: true, // 显示进度
      webSocketURL: {
        hostname: 'localhost',
        pathname: '/ws',
        port: '8545',
      },
    },
    devMiddleware: {
      publicPath: '/', // 设置公共路径
    },
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader",
          },
        ],
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
          },
        ],
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/i,
        type: 'asset', // 使用 Webpack 5 的 asset 类型
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024, // 小于 8KB 的图片会被转换为 Base64
          },
        },
      },
      {
        test: /\.json$/,
        type: 'asset/resource',
        generator: {
          filename: 'app/javascripts/[name][ext][query]', // 输出到 app/javascripts 目录
        },
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "app/index.html"), // 输入HTML文件路径
      filename: "index.html", // 输出文件名
      inject: 'body', // 将脚本注入到body部分
    }),
  ],
};
