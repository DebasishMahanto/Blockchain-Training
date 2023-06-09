// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./IERC1155Interface.sol";

struct tokenOnSale{
    uint256 quantity;
    uint256 pricePerToken;
    address seller;
    bool isOnSale;
}

contract ERC1155Market{
    address private erc1155;
    mapping(uint256=>mapping (address=>tokenOnSale))public tokenOnSaleInfo;

    constructor(address _erc1155){
        erc1155=_erc1155;
    }

    function setOnSale(uint256 _tokenId, uint256 _quantity, uint256 _price )public {
        require(_price>0,"ERC1155Market: invalid price");
        require(_quantity>0,"ERC1155Market: invalid quantity");
        require(!tokenOnSaleInfo[_tokenId][msg.sender].isOnSale,"ERC1155Market: Already in sale");
         require(
            IERC1155(erc1155).isApprovedForAll(msg.sender, address(this)),
            "ERC1155Market: not approved"
        );
        _setonSale(_tokenId, _quantity, _price);
    }

    function _setonSale(uint _tokenId, uint _quantity, uint _price) internal {
        tokenOnSaleInfo[_tokenId][msg.sender].pricePerToken = _price;
        tokenOnSaleInfo[_tokenId][msg.sender].quantity += _quantity;
        tokenOnSaleInfo[_tokenId][msg.sender].seller = msg.sender;
        tokenOnSaleInfo[_tokenId][msg.sender].isOnSale = true;
    }

     function setBatchOnSale(
        uint[] memory _tokenIds,
        uint[] memory _quantities,
        uint[] memory _price
    ) external {
        require(
            _tokenIds.length == _quantities.length && _quantities.length == _price.length,
            "ERC1155Market: all three inputs needed to be of same length"
        );
        for (uint index = 0; index < _tokenIds.length; index++) {
            require(_price[index] > 0, "ERC1155Market: price must be positive");
            require(!tokenOnSaleInfo[_tokenIds[index]][msg.sender].isOnSale,"ERC155Market: token already in sale");
            _setonSale(_tokenIds[index], _quantities[index], _price[index]);
        }
    }

    function purchase(uint _tokenId, uint256 _quantity, address _sellerAddress) external payable {
        require(
            tokenOnSaleInfo[_tokenId][_sellerAddress].isOnSale,
            "ERC1155Market: token not on sale"
        );
        require(
            msg.sender != tokenOnSaleInfo[_tokenId][_sellerAddress].seller,
            "ERC1155Market: you are the seller"
        );
         require(
            IERC1155(erc1155).isApprovedForAll(_sellerAddress, address(this)),
            "ERC1155Market: not approved"
        );
         require(
            _quantity > 0 && _quantity <= tokenOnSaleInfo[_tokenId][_sellerAddress].quantity,
            "ERC1155Market: invalid amount"
        );
        require(
            msg.value ==
                _quantity * tokenOnSaleInfo[_tokenId][_sellerAddress].pricePerToken,
            "ERC1155Market: invalid price"
        );
        IERC1155(erc1155).safeTransferFrom(
            tokenOnSaleInfo[_tokenId][_sellerAddress].seller,
            msg.sender,
            _tokenId,
            _quantity,
            bytes("Purchased")
        );
        tokenOnSaleInfo[_tokenId][_sellerAddress].quantity -= _quantity;
        if (tokenOnSaleInfo[_tokenId][_sellerAddress].quantity == 0) {
            delete tokenOnSaleInfo[_tokenId][_sellerAddress];
        }

    } 

    
    function stopSale(uint256 _tokenId) external {
        require(
            tokenOnSaleInfo[_tokenId][msg.sender].isOnSale,
            "ERC1155Market: not on sale"
        );
        delete tokenOnSaleInfo[_tokenId][msg.sender];
        
    }

}