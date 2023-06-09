// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract ERC721update is ERC721 {
    string private _name;
    string private _symbol;
    uint256 private _tokenId;
    address private owner;

    constructor(string memory name, string memory symbol) ERC721(name, symbol) {
        _name = name;
        _symbol = symbol;
        owner = msg.sender;
    }

    function mint() external {
        _tokenId++;
        _mint(msg.sender, _tokenId);
    }

    function burn(uint256 tokenId) external {
        require(ownerOf(tokenId) == msg.sender, "Myerc721: not token owner");
        _burn(tokenId);
    }
}
