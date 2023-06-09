// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Bank {
    uint256 public netCrypto = 2 ether;
    address accountHolder;

    constructor() {
        accountHolder = msg.sender;
    }

    modifier check() {
        require(accountHolder == msg.sender);
        _;
    }

    function deposit(uint256 bal) public check returns (uint256) {
        netCrypto = netCrypto + bal;
        return netCrypto;
    }

    function withdrawal(uint256 bal) public check returns (uint256) {
        if (netCrypto > bal) {
            netCrypto = netCrypto - bal;
            return netCrypto;
        }
        return netCrypto;
    }
}
