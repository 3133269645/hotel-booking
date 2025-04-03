import "../stylesheets/app.css";
import {  default as Web3 } from 'web3';
import {  default as contract } from 'truffle-contract';

import conference_artifacts from './Conference.json';

var accounts, sim;
var Conference = contract(conference_artifacts);

window.addEventListener('load', function() {
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
// 替换这里的 Web3 连接代码，使用 Ganache 本地网络
    if (typeof web3 !== 'undefined') {
        console.warn("Using web3 detected from external source.");
        window.web3 = new Web3(web3.currentProvider);
    } else {
        console.warn("No web3 detected. Falling back to http://127.0.0.1:8545.");
        window.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545")); // Ganache 本地网络
    }


    Conference.setProvider(web3.currentProvider);
    App.start();

    // Handle change quota button
    $("#changeQuota").click(function() {
        var newquota = $("#confQuota").val();
        App.changeQuota(newquota);
    });
});

window.App = { 
    start: function() {
        var self = this;

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
        
            // 使用 Ganache 中的账户地址
            accounts = accs; 
            self.initializeConference();
        });
    },

    initializeConference: function() {
        var self = this;

        // 部署智能合约
        Conference.deployed().then(function(instance) {
            sim = instance;
            $("#confAddress").html(sim.address);
            self.checkValues();
        }).catch(function(e) {
            console.log(e);
        });
    },

    checkValues: function() {
        Conference.deployed().then(function(instance) {
            sim = instance;
            return sim.bookRoom(1, { from: accounts[0], value: web3.utils.toWei(amount, "ether"), gas: 3000000 });
        }).then(function() {
            // 更新状态
            return sim.availableRooms.call();
        }).then(function(roomsLeft) {
            // 更新界面
            var msgResult = `预定成功！余下房间: ${roomsLeft}`;
            $("#changeQuotaResult").html(msgResult);
        }).catch(function(error) {
            console.error("Error booking reservation:", error);
            $("#changeQuotaResult").html("发生错误，请稍后再试。");
        });
        
    },

    // 新的预定函数，处理预定逻辑
    bookReservation: function(amount, date) {
        var self = this;
    
        // 显示交易处理中
        $("#changeQuotaResult").html("交易处理中...");
        
        // 调用合约进行预定交易
        Conference.deployed().then(function(instance) {
            sim = instance;
    
            // 转换金额为以太
            var ethAmount = web3.utils.toWei(amount.toString(), "ether"); // 将金额转换为以太单位
    
            return sim.bookRoom(1, { from: accounts[0], value: ethAmount, gas: 3000000 });  // 使用bookRoom处理预定
        }).then(function() {
            // 配额更新成功后，检查配额是否已更改
            return sim.availableRooms.call();
        }).then(function(roomsLeft) {
            var msgResult;
            if (roomsLeft.toString() < 100) {  // 假设房间数减少，预定成功
                msgResult = `预定成功！预定日期: ${date}, 余下房间: ${roomsLeft}`;
            } else {
                msgResult = "预定失败，请重试。";
            }
            $("#changeQuotaResult").html(msgResult);
        }).catch(function(error) {
            console.error("Error booking reservation:", error);
            $("#changeQuotaResult").html("发生错误，请稍后再试。");
        });
    }
    
};

// 预定按钮点击事件
$(".button").click(function() {
    var amount = $(this).data("amount");
    
    // 创建日期选择框
    var datePickerHtml = `
        <div id="datePickerModal" class="modal">
            <div class="modal-content">
                <h3>选择预定日期</h3>
                <input type="date" id="bookingDate" name="bookingDate" required>
                <button id="confirmBooking" class="button">确认预定</button>
                <button id="cancelBooking" class="button">取消</button>
            </div>
        </div>`;
    
    // 将日期选择框添加到body中
    $("body").append(datePickerHtml);
    
    // 显示日期选择框
    $("#datePickerModal").show();

    // 取消预定
    $("#cancelBooking").click(function() {
        $("#datePickerModal").remove();  // 关闭日期选择框
    });

    // 确认预定
    $("#confirmBooking").click(function() {
        var selectedDate = $("#bookingDate").val();
        if (selectedDate) {
            // 调用bookReservation来进行预定，并传递日期和金额
            App.bookReservation(amount, selectedDate);
        } else {
            alert("请选择一个日期！");
        }

        // 关闭日期选择框
        $("#datePickerModal").remove();
    });

});
