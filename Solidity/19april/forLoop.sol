// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ForLoop {
    uint256[10] public arr;

    function PUSH() public {
        for (uint256 i; i < arr.length; i++) {
            arr[i] = i + 1;
        }
    }
}
