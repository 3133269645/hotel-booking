const Web3 = require('web3');

const web3 = new Web3('http://127.0.0.1:8546');

web3.eth.getAccounts()
  .then(accounts => {
    console.log('Accounts:', accounts);
  })
  .catch(err => {
    console.error('Error:', err);
  });