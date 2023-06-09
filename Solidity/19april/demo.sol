// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Demo {
    uint256 value = 1;

    function demo() public view returns (uint256) {
        uint256 a = value;
        for (uint256 i; i < 10; i++) {
            a++;
        }
        return a;
    }
}
