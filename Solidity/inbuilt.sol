// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


contract inbuilt{

    function viewSha256() public pure returns (bytes32){
        return sha256("hello");
    }

    function viewKeccak256() public pure returns(bytes32){
        return keccak256("hello");
    }

    function viewRipemd160() public pure returns(bytes32){
        return ripemd160("hello");
    }


}