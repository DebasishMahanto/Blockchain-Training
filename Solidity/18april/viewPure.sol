// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Demo {
    uint256 age = 20;

    function View() public view returns (uint256) {
        return age;
    }

    function sum() public pure returns (uint256) {
        uint256 num1 = 6;
        uint256 num2 = 3;
        return num1 + num2;
    }

    function increment() public returns (uint256) {
        return age++;
    }
}
