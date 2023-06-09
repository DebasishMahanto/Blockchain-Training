// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract ERC1155Update is ERC1155 {
    uint256 public mintPrice;
    address public owner;

    // string uri="uri";

    constructor(uint256 _mintPrice, string memory uri) ERC1155(uri) {
        mintPrice = _mintPrice;
        owner = msg.sender;
    }

    function mint(uint256 tokenId, uint256 quantity) external payable {
        require(quantity > 0, "ERCU1155pdate: invalid quantity");
        require(
            msg.value == (mintPrice * quantity),
            "ERCU1155pdate : invalid price"
        );
        _mint(msg.sender, tokenId, quantity, "");
    }

    function burn(uint tokenId, uint256 quantity) external {
        _burn(msg.sender, tokenId, quantity);
    }

    function mintBatch(
        uint256[] memory ids,
        uint256[] memory quentities
    ) external payable {
        uint256 totalAmount;
        for (uint256 index = 0; index < ids.length; index++) {
            totalAmount += quentities[index] * mintPrice;
        }
        require(
            msg.value == totalAmount,
            "ERC1155Update: invalid total amount"
        );
        _mintBatch(msg.sender, ids, quentities, "");
        payable(owner).transfer(msg.value);
    }

     function burnBatch(
        uint256[] memory ids,
        uint256[] memory quantities
    ) external {
        _burnBatch(msg.sender, ids, quantities);
    }
}
