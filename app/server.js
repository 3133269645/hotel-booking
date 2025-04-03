const express = require('express');
const path = require('path');
const app = express();
const port = 8080;
const cors = require('cors');

// 启用 CORS 以允许跨域请求
app.use(cors());

// 设置静态文件目录，可以访问整个 /app 文件夹及其子文件夹
app.use(express.static(path.join(__dirname, 'app')));  // 提供 app 文件夹的所有文件

app.use((req, res, next) => {
  console.log('Request URL:', req.url);  // 输出请求的 URL
  next();
});
// 设置访问根路径时返回 index.html 文件
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'app', 'index.html'));  // 返回 /app/index.html 文件
});

// 启动服务器
app.listen(port, () => {
  console.log(`Server is running at http://127.0.0.1:${port}`);
});
