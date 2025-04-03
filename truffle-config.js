module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545, // Ganache 默认端口
      network_id: "*", // 任何网络 ID
    },
  },
  compilers: {
    solc: {
      version: "0.6.0", // 确保使用与合约代码兼容的版本
    },
  },
};
