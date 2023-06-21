// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IToken721 {
    function mint(address to, string memory tokenURI) external;

    function checkURI(string memory uri) external view returns (bool);
}
