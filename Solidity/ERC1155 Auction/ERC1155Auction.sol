// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ERC1155.sol";

struct tokenOnAuction {
    uint256 tokenId;
    uint256 quantity;
    uint256 basePricePerToken;
    uint256 auctionStartTime;
    uint256 auctionEndTime;
    uint256 maxBidAmount;
    address maxBidAddress;
    address seller;
    bool isOnAuction;
}

struct bidders {
    address bidderAddress;
    uint256 biddingAmount;
    //uint256 quantity;
}

contract ERC1155Auction {
    address erc1155;
    mapping(uint256 => mapping(address => tokenOnAuction)) private auctionInfo;
    mapping(uint256 => mapping(address => bidders[])) private biddingHistory;

    constructor(address _erc1155) {
        erc1155 = _erc1155;
    }

    function tokenOnAuctionInfo(uint256 _tokenId)
        external
        view
        returns (tokenOnAuction memory)
    {
        require(
            auctionInfo[_tokenId][msg.sender].isOnAuction,
            "ERC721Auction: token not in Auction"
        );
        return (auctionInfo[_tokenId][msg.sender]);
    }

    function setAuction(
        uint256 _tokenId,
        uint256 _quantity,
        uint256 _basePricePerToken,
        uint256 _auctionStartTime,
        uint256 _auctionEndTime
    ) external {
        require(
            !auctionInfo[_tokenId][msg.sender].isOnAuction,
            "ERC1155Auction: token already in Auction"
        );
        require(
            _basePricePerToken > 0,
            "ERC1155Auction: base price should postive"
        );
        require(_quantity > 0, "ERC1155Auction: quantity should positive");
        require(
            _auctionEndTime > block.timestamp,
            "ERC1155Auction: invalid end time"
        );
        require(
            _auctionStartTime > block.timestamp &&
                _auctionStartTime != _auctionEndTime,
            "ERC1155Auction: invalid time"
        );
        require(
            IERC1155(erc1155).balanceOf(msg.sender, _tokenId) >= _quantity,
            "ERC1155Auction: not enough tokens"
        );
        require(
            IERC1155(erc1155).isApprovedForAll(msg.sender, address(this)),
            "ERC1155Auction: please approve contract first"
        );
        auctionInfo[_tokenId][msg.sender].tokenId = _tokenId;
        auctionInfo[_tokenId][msg.sender].quantity = _quantity;
        auctionInfo[_tokenId][msg.sender]
            .basePricePerToken = _basePricePerToken;
        auctionInfo[_tokenId][msg.sender].auctionStartTime = _auctionStartTime;
        auctionInfo[_tokenId][msg.sender].auctionEndTime = _auctionEndTime;
        auctionInfo[_tokenId][msg.sender].seller = msg.sender;
        auctionInfo[_tokenId][msg.sender].isOnAuction = true;
    }

    function bid(uint256 _tokenId, address _seller) external payable {
        require(
            auctionInfo[_tokenId][_seller].isOnAuction,
            "ERC1155Auction: token not in auction"
        );
        require(
            block.timestamp <= auctionInfo[_tokenId][_seller].auctionEndTime,
            "ERC1155Auction: auction is over"
        );
        require(
            msg.value > auctionInfo[_tokenId][_seller].basePricePerToken,
            "ERC1155Auction: value should greater then base price"
        );
        require(
            msg.value > auctionInfo[_tokenId][_seller].maxBidAmount,
            "ERC1155Auction: bidding amount is not the highest"
        );

        biddingHistory[_tokenId][_seller].push(bidders(msg.sender, msg.value));
        auctionInfo[_tokenId][_seller].maxBidAmount = msg.value;
        auctionInfo[_tokenId][_seller].maxBidAddress = msg.sender;
    }

    function claim(uint256 _tokenId, address _seller) external {
        require(
            auctionInfo[_tokenId][_seller].isOnAuction,
            "ERC1155Auction: token not in auction"
        );
        require(
            block.timestamp > auctionInfo[_tokenId][_seller].auctionEndTime,
            "ERC1155Auction: auction is not over"
        );
        require(
            auctionInfo[_tokenId][_seller].maxBidAddress != address(0),
            "ERC1155Auction: no one bidded"
        );
        require(
            msg.sender == auctionInfo[_tokenId][_seller].maxBidAddress,
            "ERC1155Auction: only winner can access"
        );
        for (
            uint256 index;
            index < biddingHistory[_tokenId][_seller].length;
            index++
        ) {
            if (
                biddingHistory[_tokenId][_seller][index].bidderAddress ==
                msg.sender &&
                IERC1155(erc1155).isApprovedForAll(_seller, address(this)) &&
                IERC1155(erc1155).balanceOf(
                    auctionInfo[_tokenId][_seller].seller,
                    _tokenId
                ) >=
                auctionInfo[_tokenId][_seller].quantity
            ) {
                IERC1155(erc1155).safeTransferFrom(
                    auctionInfo[_tokenId][_seller].seller,
                    msg.sender,
                    _tokenId,
                    auctionInfo[_tokenId][_seller].quantity,
                    "0x00"
                );
            } else {
                payable(biddingHistory[_tokenId][_seller][index].bidderAddress)
                    .transfer(
                        biddingHistory[_tokenId][_seller][index].biddingAmount
                    );
            }
        }
        payable(_seller).transfer(auctionInfo[_tokenId][_seller].maxBidAmount);
        delete auctionInfo[_tokenId][_seller];
        delete biddingHistory[_tokenId][_seller];
    }

    function cancelAuction(uint256 _tokenId) external {
        require(
            auctionInfo[_tokenId][msg.sender].isOnAuction,
            "ERC1155Auction: token not in auction"
        );
        require(
            block.timestamp < auctionInfo[_tokenId][msg.sender].auctionEndTime,
            "ERC1155Auction: auction is over"
        );
        for (
            uint256 index;
            index < biddingHistory[_tokenId][msg.sender].length;
            index++
        ) {
            payable(biddingHistory[_tokenId][msg.sender][index].bidderAddress)
                .transfer(
                    biddingHistory[_tokenId][msg.sender][index].biddingAmount
                );
        }
        delete auctionInfo[_tokenId][msg.sender];
        delete biddingHistory[_tokenId][msg.sender];
    }

    function cancelBid(uint256 _tokenId) external {
        require(
            auctionInfo[_tokenId][msg.sender].isOnAuction,
            "ERC721Auction: token not in Auction"
        );
        uint256 tempBidAmount;
        address tempAddress;
        uint256 tempMaxBidAmount;
        address tempMaxAddress;

        for (
            uint256 index;
            index < biddingHistory[_tokenId][msg.sender].length;
            index++
        ) {
            if (
                biddingHistory[_tokenId][msg.sender][index].bidderAddress ==
                msg.sender
            ) {
                tempBidAmount = biddingHistory[_tokenId][msg.sender][index]
                    .biddingAmount;
                tempAddress = biddingHistory[_tokenId][msg.sender][index]
                    .bidderAddress;
                biddingHistory[_tokenId][msg.sender][index]
                    .bidderAddress = address(0);
                biddingHistory[_tokenId][msg.sender][index].biddingAmount = 0;
            } else {
                if (
                    biddingHistory[_tokenId][msg.sender][index].biddingAmount >
                    tempMaxBidAmount
                ) {
                    tempMaxBidAmount = biddingHistory[_tokenId][msg.sender][
                        index
                    ].biddingAmount;
                    tempMaxAddress = biddingHistory[_tokenId][msg.sender][index]
                        .bidderAddress;
                }
            }

            payable(tempAddress).transfer(tempBidAmount);
            auctionInfo[_tokenId][msg.sender].maxBidAmount = tempMaxBidAmount;
            auctionInfo[_tokenId][msg.sender].maxBidAddress = tempMaxAddress;
            // delete biddingHistory[_tokenId][msg.sender];
        }
    }
}
