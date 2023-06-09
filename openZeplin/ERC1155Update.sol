// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract ERC1155Update is ERC1155 {
    uint256 mintPrice;
    address owner;

    constructor(uint256 _mintPrice, string memory uri) ERC1155(uri) {
        mintPrice = _mintPrice;
        owner = msg.sender;
    }

    function mint(uint _tokenId, uint256 _quantity) external payable {
        require(_quantity > 0, "ERCU1155pdate: invalid quantity");
        require(
            msg.value == (mintPrice * _quantity),
            "ERCU1155pdate : invalid price"
        );
        _mint(msg.sender, _tokenId, _quantity, "");
    }

    function burn(uint _tokenId, uint256 _quantity) external {
        require(_quantity > 0, "ERCU1155pdate: invalid quantity");
        payable(msg.sender).transfer(mintPrice * _quantity);
        _burn(msg.sender, _tokenId, _quantity);
    }
}
