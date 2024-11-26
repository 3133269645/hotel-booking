import Web3 from 'web3';
import contract from 'truffle-contract';
import conference_artifacts from '../../build/contracts/Conference.json'

var accounts, sim;
var Conference = contract(conference_artifacts);

window.addEventListener('load', function() {
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof web3 !== 'undefined') {
        // Use Mist/MetaMask's provider
        window.web3 = new Web3(web3.currentProvider);
    } else {
        // Fallback to localhost if no Web3 injection
        window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8546"));
    }

    Conference.setProvider(web3.currentProvider);
    App.start();
});

window.App = {
    start: function() {
        var self = this;

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

            self.initializeConference();
        });
    },

    initializeConference: function() {
        var self = this;

        Conference.deployed().then(function(instance) {
            sim = instance;
            $("#confAddress").html(sim.address);

            self.checkValues();
            self.bindBuyTicketButton(); // Bind the buy ticket button
        }).catch(function(e) {
            console.log(e);
        });
    },

    checkValues: function() {
        Conference.deployed().then(function(instance) {
            sim = instance;
            sim.quota.call().then(function(quota) { 
                $("input#confQuota").val(quota);
                return sim.organizer.call();
            }).then(function(organizer){
                $("input#confOrganizer").val(organizer);
                return sim.numRegistrants.call();
            }).then(function(num){
                $("#numRegistrants").html(num.toNumber());
            });
        });
    },

    changeQuota: function(newquota){
        Conference.deployed().then(function(instance) {
            sim = instance;
            sim.changeQuota(newquota, {from: accounts[0], gas: 3000000}).then(function() {
                return sim.quota.call(); 
            }).then(function(quota){
                var msgResult = quota == newquota ? "change successful" : "change failed";
                $("#changeQuotaResult").html(msgResult);
            });
        });
    },

    bindBuyTicketButton: function() {
        $("#buyTicketBtn").click(function() {
            var senderAddress = $("#senderAddress").val();
            var ticketPrice = web3.toWei(parseFloat($("#ticketPrice").val()), 'ether'); // Convert ether to wei

            if (!web3.isAddress(senderAddress)) {
                alert('请输入有效的以太坊地址');
                return;
            }

            sim.buyTicket(senderAddress, {from: accounts[0], value: ticketPrice, gas: 3000000}, function(error, result) {
                if (error) {
                    console.error(error);
                    alert('购票失败');
                } else {
                    console.log(result);
                    alert('购票成功！');
                }
            });
        });
    }
};

// HMR - Hot Module Replacement
if (module.hot) {
    module.hot.accept();
}