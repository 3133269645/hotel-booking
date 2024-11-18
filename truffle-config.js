module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*" // Match any network id
    }
  },
  compilers: {
    solc: {
      version: "0.6.0", // 使用与你合约兼容的Solidity版本
      docker: false, // 通常设置为false，除非你需要通过Docker使用特定版本的编译器
      parser: "solcjs", // 使用solc-js解析器来加速解析过程
      settings: {
        optimizer: {
          enabled: false, // 根据需要决定是否开启优化
          runs: 200 // 如果开启优化，这里设置优化运行的次数
        },
        evmVersion: "byzantium" // 设置EVM版本，可以根据需要选择byzantium, constantinople, petersburg, istanbul等
      }
    }
  }
};