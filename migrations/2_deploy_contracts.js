// 引入合约
const Migrations = artifacts.require("Migrations");
const HotelBooking = artifacts.require("HotelBooking");

module.exports = function(deployer) {
  // 部署 Migrations 合约
  deployer.deploy(Migrations).then(function() {
    // 部署 HotelBooking 合约
    return deployer.deploy(HotelBooking);
  });
};
