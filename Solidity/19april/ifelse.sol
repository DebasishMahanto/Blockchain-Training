// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Condition{
    function check(uint value) public pure returns(string memory){
        if(value % 2==0)
        {
            return "Even Number";
        }
        else 
        {
            return "Odd Number";
        }
    }
}