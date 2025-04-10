import Web3 from 'web3';  // 引入 Web3
import contract from 'truffle-contract';  // 引入 Truffle 合约
import conference_artifacts from './HotelBooking.json';  // 引入合约 ABI

let accounts, sim;
const Conference = contract(conference_artifacts);

window.App = {
    start: function(callback) {
        var self = this;

        // 初始化 Web3
        if (typeof window.ethereum !== 'undefined') {
            window.web3 = new Web3(window.ethereum);
            window.ethereum.enable().catch(function(err) {
                console.log("User denied account access");
            });
        } else if (typeof window.web3 !== 'undefined') {
            window.web3 = new Web3(web3.currentProvider);
        } else {
            alert("Non-Ethereum browser detected. You should consider trying MetaMask!");
            return;
        }

        // 获取账户信息
        web3.eth.getAccounts(function(err, accs) {
            if (err != null) {
                alert("There was an error fetching your accounts.");
                return;
            }

            if (accs.length == 0) {
                alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
                return;
            }

            accounts = accs;
            self.initializeConference(callback);  // 将回调传递给initializeConference
        });
    },

    initializeConference: function(callback) {
        var self = this;

        // 部署智能合约
        Conference.setProvider(web3.currentProvider);
        Conference.deployed().then(function(instance) {
            sim = instance;
            $("#confAddress").html(sim.address);
            self.checkValues();
            if (callback) callback(); // 初始化完成后执行回调
        }).catch(function(e) {
            console.log(e);
        });
    },

    checkValues: function(amount) {
        Conference.deployed().then(function(instance) {
            sim = instance;
            return sim.bookRoom(1, { from: accounts[0], value: web3.utils.toWei(amount, "ether"), gas: 3000000 });
        }).then(function() {
            return sim.availableRooms.call();
        }).then(function(roomsLeft) {
            var msgResult = `预定成功！余下房间: ${roomsLeft}`;
            $("#changeQuotaResult").html(msgResult);
        }).catch(function(error) {
            console.error("Error booking reservation:", error);
            $("#changeQuotaResult").html("发生错误，请稍后再试。");
        });
    },

    bookReservation: function(amount, date) {
        var self = this;
        $("#changeQuotaResult").html("交易处理中...");

        Conference.deployed().then(function(instance) {
            sim = instance;
            var ethAmount = web3.utils.toWei(amount.toString(), "ether");
            return sim.bookRoom(1, { from: accounts[0], value: ethAmount, gas: 3000000 });
        }).then(function() {
            return sim.availableRooms.call();
        }).then(function(roomsLeft) {
            var msgResult = roomsLeft.toString() < 100 
                ? `预定成功！预定日期: ${date}, 余下房间: ${roomsLeft}` 
                : "预定失败，请重试。";
            $("#changeQuotaResult").html(msgResult);
        }).catch(function(error) {
            console.error("Error booking reservation:", error);
            $("#changeQuotaResult").html("发生错误，请稍后再试。");
        });
    }
};
