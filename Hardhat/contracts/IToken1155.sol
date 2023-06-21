// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface IToken1155 {
    function mint(
        address to,
        uint256 tokenId,
        uint256 quantity,
        string memory tokenURI
    ) external;

    function checkURI(string memory uri) external view returns (bool);

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        uint256 amount
    ) external;
}
