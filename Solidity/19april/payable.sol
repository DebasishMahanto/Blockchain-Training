// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Payable {
    address payable user = payable(0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2);

    function receiveEther() public payable {}

    function getEther() public view returns (uint256) {
        return address(this).balance;
    }

    function sendEther() public {
        user.transfer(1 ether);
    }
}
