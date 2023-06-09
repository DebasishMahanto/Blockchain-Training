// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract WhileLoop {
    uint256[10] public arr;

    function PUSH(uint256 startValue) public {
        uint256 index;
        while (index < arr.length) {
            arr[index] = startValue;
            index++;
            startValue++;
        }
    }
}
