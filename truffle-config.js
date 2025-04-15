module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",  // 本地 Ganache 实例地址
      port: 8546,         // Ganache RPC端口
      network_id: "*",    // 匹配任何网络ID
      gas: 6721975,       // gas限制
      gasPrice: 20000000000, // gas价格
    },
  },
  compilers: {
    solc: {
      version: "0.5.16",  // Solidity编译器版本，根据你的合约版本进行调整
    },
  },
};
