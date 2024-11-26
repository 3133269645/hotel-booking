// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

contract Conference {
    address public organizer;
    mapping(address => uint) public registrantsPaid;
    mapping(address => address) public registrantsDefaultRecipient;
    uint public numRegistrants;
    uint public quota;
    uint public ticketPrice; // 新增票价变量

    event Deposit(address indexed _from, uint _amount);
    event Refund(address indexed _to, uint _amount);

    constructor() public {
        organizer = msg.sender;
        quota = 100;
        numRegistrants = 0;
        ticketPrice = 0.00001 ether; // 设置默认票价为1 ether，可以根据需要修改
    }

    function buyTicket(address recipient) public payable {
        require(numRegistrants < quota, "Registration is closed");
        require(msg.value == ticketPrice, "Ticket price must be equal to or greater than the set price");
        registrantsPaid[msg.sender] = msg.value;
        registrantsDefaultRecipient[msg.sender] = recipient; // 设置默认收获地址
        numRegistrants++;
        emit Deposit(msg.sender, msg.value);
    }

    function changeQuota(uint newQuota) public {
        require(msg.sender == organizer, "Only the organizer can change the quota");
        quota = newQuota;
    }

    function changeTicketPrice(uint newPrice) public {
        require(msg.sender == organizer, "Only the organizer can change the ticket price");
        ticketPrice = newPrice; // 允许组织者更改票价
    }

    function refundTicket() public {
        require(msg.sender == organizer, "Only the organizer can issue refunds");
        address recipient = registrantsDefaultRecipient[msg.sender];
        require(recipient != address(0), "No default recipient set");
        uint amount = registrantsPaid[recipient];
        require(amount > 0, "Invalid ticket purchase");
        require(address(this).balance >= amount, "Insufficient balance for refund");
        payable(recipient).transfer(amount);
        emit Refund(recipient, amount);
        registrantsPaid[recipient] = 0;
        numRegistrants--;
        registrantsDefaultRecipient[recipient] = address(0); // 重置默认收获地址
    }

    function destroy() public {
        require(msg.sender == organizer, "Only the organizer can destroy the contract");
        selfdestruct(payable(organizer));
    }
}