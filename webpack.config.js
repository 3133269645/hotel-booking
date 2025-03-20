const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
  mode: 'development',
  stats: {
    children: true
  },
  resolve: {
    extensions: ['.js', '.json'],
    alias: {
      process: require.resolve("process/browser")
    }
  },
  devtool: "eval-source-map", // 开发模式下使用 source map
  entry: path.resolve(__dirname, 'app/javascripts/app.js'), // 修正入口文件路径
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js', // 输出文件为 bundle.js
    clean: true,
    publicPath: '/',  // 确保资源加载正确
  },
  devServer: {
    static: path.resolve(__dirname, 'build'),
    historyApiFallback: true, // 防止单页应用（SPA）中刷新时出现404
    hot: true, // 启用热模块替换（HMR）
    liveReload: true, // 启用实时刷新
    port: 8080, // 本地开发服务器端口
    open: {
      target: 'http://localhost:8080', // 启动时打开的 URL
      browser: 'firefox', // 自动使用 Firefox 打开
    },
    client: {
      logging: 'info', // 控制在浏览器中输出的日志信息
      overlay: true, // 错误时显示覆盖层
      progress: true, // 显示进度
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        }
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader",
          }
        ]
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
          }
        ]
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        type: 'asset', // 使用 Webpack 5 的 asset 类型
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024 // 小于 8KB 的图片会被转换为 Base64
          }
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "app/index.html"), // 输入HTML文件路径
      filename: "index.html", // 输出文件名
      inject: 'body', // 将脚本注入到body部分
    })
  ]
};
