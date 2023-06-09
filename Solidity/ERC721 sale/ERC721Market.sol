// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./IERC721Interface.sol";

struct tokenOnSale {
    uint256 tokenId;
    uint256 tokenPrice;
    address tokenOwner;
    bool isOnSale;
}

contract ERC721Market {
    address erc721;
    uint256 public numOfTokensOnSale;
    mapping(uint256 => tokenOnSale) public onSale;

    constructor(address _erc721) {
        erc721 = _erc721;
    }

    function setOnSale(uint256 _tokenId, uint256 _tokenPrice) public {
        require(
            IERC721(erc721).ownerOf(_tokenId) == msg.sender,
            "ERC721Market: not token owner"
        );
        require(_tokenPrice > 0, "ERC721Market: invalid token price");
        require(
            !onSale[_tokenId].isOnSale,
            "ERC721Market: token already on Sale"
        );
        require(
            IERC721(erc721).getApproved(_tokenId) == address(this) ||
                IERC721(erc721).isApprovedForAll(msg.sender, address(this)),
            "ERC721Market: not approved"
        );
        onSale[_tokenId].tokenId = _tokenId;
        onSale[_tokenId].tokenPrice = _tokenPrice;
        onSale[_tokenId].tokenOwner = msg.sender;
        onSale[_tokenId].isOnSale = true;
        numOfTokensOnSale++;
    }

    function purchase(uint256 _tokenId) public payable {
        require(onSale[_tokenId].isOnSale, "ERC721Market: token not in sale");
        require(
            onSale[_tokenId].tokenPrice == msg.value,
            "ERC721Market: invalid Price"
        );
        IERC721(erc721).transferFrom(
            onSale[_tokenId].tokenOwner,
            msg.sender,
            _tokenId
        );
        delete onSale[_tokenId];
    }

    function setEndSale(uint256 _tokenId) public {
        require(onSale[_tokenId].isOnSale, "ERC721Market: token not in sale");
        require(
            onSale[_tokenId].tokenOwner == msg.sender,
            "ERC721Market: not token owner"
        );
        delete onSale[_tokenId];
    }
}
