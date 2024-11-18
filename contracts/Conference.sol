// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

contract Conference {
    address public organizer;
    mapping(address => uint) public registrantsPaid;
    uint public numRegistrants;
    uint public quota;

    event Deposit(address indexed _from, uint _amount);
    event Refund(address indexed _to, uint _amount);

    constructor() public {
        organizer = msg.sender;
        quota = 100;
        numRegistrants = 0;
    }

    function buyTicket() public payable {
        require(numRegistrants < quota, "Registration is closed");
        require(msg.value > 0, "Ticket price must be greater than zero");
        registrantsPaid[msg.sender] = msg.value;
        numRegistrants++;
        emit Deposit(msg.sender, msg.value);
    }

    function changeQuota(uint newQuota) public {
        require(msg.sender == organizer, "Only the organizer can change the quota");
        quota = newQuota;
    }

    function refundTicket(address recipient, uint amount) public {
        require(msg.sender == organizer, "Only the organizer can issue refunds");
        require(registrantsPaid[recipient] == amount, "Invalid ticket purchase");
        require(address(this).balance >= amount, "Insufficient balance for refund");
        payable(recipient).transfer(amount);
        emit Refund(recipient, amount);
        registrantsPaid[recipient] = 0;
        numRegistrants--;
    }

    function destroy() public {
        require(msg.sender == organizer, "Only the organizer can destroy the contract");
        selfdestruct(payable(organizer));
    }
}