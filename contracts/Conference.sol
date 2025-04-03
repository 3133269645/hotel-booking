// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

contract HotelBooking {
    address public owner;
    mapping(address => uint) public bookingsPaid;
    mapping(address => uint) public roomTypesBooked; // 记录用户预定的房间类型
    uint public availableRooms;
    uint public roomPrice; // 房间价格

    event Booking(address indexed _from, uint _amount);
    event Refund(address indexed _to, uint _amount);

    constructor() public {
        owner = msg.sender;
        availableRooms = 100; // 可供预定的房间数
        roomPrice = 0.01 ether; // 房间价格为0.01 ether
    }

    function bookRoom(uint roomType) public payable {
        require(availableRooms > 0, "No rooms available");
        require(msg.value == roomPrice, "Payment must be equal to room price");

        bookingsPaid[msg.sender] = msg.value;
        roomTypesBooked[msg.sender] = roomType; // 用户预定房间类型
        availableRooms--;

        emit Booking(msg.sender, msg.value);
    }

    function cancelBooking() public {
        uint amount = bookingsPaid[msg.sender];
        require(amount > 0, "No booking found");

        // Refund the user
        payable(msg.sender).transfer(amount);
        emit Refund(msg.sender, amount);

        // Reset booking data
        bookingsPaid[msg.sender] = 0;
        availableRooms++;
    }

    function changeRoomPrice(uint newPrice) public {
        require(msg.sender == owner, "Only the owner can change room price");
        roomPrice = newPrice;
    }

    function destroy() public {
        require(msg.sender == owner, "Only the owner can destroy the contract");
        selfdestruct(payable(owner));
    }
}
