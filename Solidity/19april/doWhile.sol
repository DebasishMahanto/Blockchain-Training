// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DoWhile{
    uint[10] public arr;
    function PUSH() public{
        uint count;
        do{
            arr[count]=count+1;
            count++;
        }while(count<arr.length);
    }
}