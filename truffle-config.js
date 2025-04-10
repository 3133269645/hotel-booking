module.exports = {
    networks: {
      development: {
        host: "127.0.0.1",
        port: 8545,
        network_id: "5777",
        accounts: [
          {
            privateKey: '0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d',
            balance: '1000000000000000000000'  // 设置账户余额为 1000 ETH (1 ETH = 10^18 wei)
          },
          {
            privateKey: '0x6cbed15c793ce57650b9877cf6fa156fbef513c4e6134f022a85b1ffdd59b2a1',
            balance: '2000000000000000000000'  // 设置另一个账户余额为 2000 ETH
          }
        ]
      }
    }
  };
  