// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ERC1155.sol";
import "./ERC721.sol";

contract MarketPlace {
    address public erc721;
    address public erc1155;
    address public marketOwner;

    struct tokenOnSale {
        uint256 tokenId;
        uint256 quantity;
        uint256 pricePerToken;
        address seller;
        bool isOnSale;
        bool isERC721;
    }

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
        bool isERC721;
    }
    struct bidders {
        address bidderAddress;
        uint256 biddingAmount;
        //uint256 quantity;
    }

    mapping(bool => mapping(uint256 => mapping(address => tokenOnSale)))
        public tokenOnSaleInfo;
    mapping(bool => mapping(uint256 => mapping(address => tokenOnAuction)))
        public auctionInfo;
    mapping(bool => mapping(uint256 => mapping(address => bidders[])))
        public biddingHistory;

    event SetOnSale(
        uint256 _tokenId,
        uint256 _quantity,
        uint256 _pricePerToken,
        address _seller
    );
    event Purchase(
        uint256 _tokenId,
        uint256 _quantity,
        address _sellerAddress,
        address _buyerAddress
    );
    event StopSale(uint256 _tokenId, address _owner);
    event SetAuction(
        uint256 _tokenId,
        uint256 _quantity,
        uint256 _basePricePerToken,
        uint256 _auctionStartTime,
        uint256 _auctionEndTime,
        address _seller
    );

    event Claim(uint256 _tokenId, address _seller, address _winner);

    event CancelAuction(uint256 _tokenId, address _owner);

    constructor(address _erc721, address _erc1155) {
        erc721 = _erc721;
        erc1155 = _erc1155;
        marketOwner = msg.sender;
    }

    function _checkApproval(uint256 _tokenId, bool _isERC721) private view {
        if (_isERC721) {
            require(
                IERC721(erc721).getApproved(_tokenId) == address(this) ||
                    IERC721(erc721).isApprovedForAll(msg.sender, address(this)),
                "MarketPlace: not approved"
            );
        } else {
            require(
                IERC1155(erc1155).isApprovedForAll(msg.sender, address(this)),
                "MarketPlace: not approved"
            );
        }
    }

    function setOnSale(
        uint256 _tokenId,
        uint256 _quantity,
        uint256 _pricePerToken,
        bool _isERC721
    ) external {
        require(_pricePerToken > 0, "MarketPlace: invalid price");
        require(_quantity > 0, "MarketPlace: invalid quantity");
        require(
            !tokenOnSaleInfo[_isERC721][_tokenId][msg.sender].isOnSale &&
                !auctionInfo[_isERC721][_tokenId][msg.sender].isOnAuction,
            "MarketPlace: Already in sale or in auction"
        );
        // require(
        //     !auctionInfo[_isERC721][_tokenId][msg.sender].isOnAuction,
        //     "MarketPlace: token already in auction"
        // );

        // require(!auctionInfo[_isERC721][_tokenId][msg.sender].isOnAuction,"MarketPlace: token already in auction");

        tokenOnSaleInfo[_isERC721][_tokenId][msg.sender].tokenId = _tokenId;
        tokenOnSaleInfo[_isERC721][_tokenId][msg.sender]
            .pricePerToken = _pricePerToken;
        tokenOnSaleInfo[_isERC721][_tokenId][msg.sender].seller = msg.sender;
        tokenOnSaleInfo[_isERC721][_tokenId][msg.sender].isOnSale = true;
        tokenOnSaleInfo[_isERC721][_tokenId][msg.sender].isERC721 = _isERC721;
        _checkApproval(_tokenId, _isERC721);
        if (_isERC721) {
            // require(
            //     IERC721(erc721).getApproved(_tokenId) == address(this) ||
            //         IERC721(erc721).isApprovedForAll(msg.sender, address(this)),
            //     "MarketPlace: not approved"
            // );

            tokenOnSaleInfo[_isERC721][_tokenId][msg.sender].quantity = 1;
        } else {
            // require(
            //     IERC1155(erc1155).isApprovedForAll(msg.sender, address(this)),
            //     "MarketPlace: not approved"
            // );
            require(
                (IERC1155(erc1155).balanceOf(msg.sender, _tokenId)) >=
                    _quantity +
                        auctionInfo[_isERC721][_tokenId][msg.sender].quantity,
                "MarketPlace: token not avilable"
            );
            tokenOnSaleInfo[_isERC721][_tokenId][msg.sender]
                .quantity += _quantity;
        }
        emit SetOnSale(_tokenId, _quantity, _pricePerToken, msg.sender);
    }

    function purchase(
        uint256 _tokenId,
        uint256 _quantity,
        address _sellerAddress,
        bool _isERC721
    ) external payable {
        // bool _isERC721=tokenOnSaleInfo[_isERC721][_tokenId][_sellerAddress].isERC721;
        require(
            tokenOnSaleInfo[_isERC721][_tokenId][_sellerAddress].isOnSale,
            "MarketPlace: token not on sale"
        );
        require(
            msg.sender !=
                tokenOnSaleInfo[_isERC721][_tokenId][_sellerAddress].seller,
            "MarketPlace: you are the seller"
        );
        require(
            msg.value ==
                _quantity *
                    tokenOnSaleInfo[_isERC721][_tokenId][_sellerAddress]
                        .pricePerToken,
            "MarketPlace: invalid price"
        );
        require(
            _quantity <=
                tokenOnSaleInfo[_isERC721][_tokenId][_sellerAddress].quantity,
            "MarketPlace: insufficient token"
        );

        if (tokenOnSaleInfo[_isERC721][_tokenId][_sellerAddress].isERC721) {
            //require(_quantity == 1, "MarketPlace: only one token in sale");

            IERC721(erc721).transferFrom(
                tokenOnSaleInfo[_isERC721][_tokenId][_sellerAddress].seller,
                msg.sender,
                _tokenId
            );
            delete tokenOnSaleInfo[_isERC721][_tokenId][_sellerAddress];
        } else {
            IERC1155(erc1155).safeTransferFrom(
                tokenOnSaleInfo[_isERC721][_tokenId][_sellerAddress].seller,
                msg.sender,
                _tokenId,
                _quantity,
                bytes("Purchased")
            );
            tokenOnSaleInfo[_isERC721][_tokenId][_sellerAddress]
                .quantity -= _quantity;
            if (
                tokenOnSaleInfo[_isERC721][_tokenId][_sellerAddress].quantity ==
                0
            ) {
                delete tokenOnSaleInfo[_isERC721][_tokenId][_sellerAddress];
            }
        }
        emit Purchase(_tokenId, _quantity, _sellerAddress, msg.sender);
    }

    function cancelSale(uint256 _tokenId, bool _isERC721) external {
        require(
            tokenOnSaleInfo[_isERC721][_tokenId][msg.sender].isOnSale,
            "MarketPlace: not on sale"
        );
        delete tokenOnSaleInfo[_isERC721][_tokenId][msg.sender];
        emit StopSale(_tokenId, msg.sender);
    }

    // function tokenOnAuctionInfo(
    //     uint256 _tokenId,
    //     bool _isERC721
    // ) external view returns (tokenOnAuction memory) {
    //     require(
    //         auctionInfo[_isERC721][_tokenId][msg.sender].isOnAuction,
    //         "MarketPlace: token not in Auction"
    //     );
    //     return (auctionInfo[_isERC721][_tokenId][msg.sender]);
    // }

    // function Bidders(
    //     uint256 _tokenId,
    //     bool _isERC721
    // ) external view returns (bidders[] memory) {
    //     bidders[] memory arrayBideers = biddingHistory[_isERC721][_tokenId][
    //         msg.sender
    //     ];
    //     return arrayBideers;
    // }

    function setAuction(
        uint256 _tokenId,
        uint256 _quantity,
        uint256 _basePricePerToken,
        uint256 _auctionStartTime,
        uint256 _auctionEndTime,
        bool _isERC721
    ) external {
        require(
            !auctionInfo[_isERC721][_tokenId][msg.sender].isOnAuction &&
                !tokenOnSaleInfo[_isERC721][_tokenId][msg.sender].isOnSale,
            "MarketPlace: token already in Auction or in sale"
        );
        // require(
        //     !tokenOnSaleInfo[_isERC721][_tokenId][msg.sender].isOnSale,
        //     "MarketPlace: token already in sale"
        // );
        require(
            _basePricePerToken > 0,
            "MarketPlace: base price should postive"
        );
        require(_quantity > 0, "MarketPlace: quantity should positive");
        // require(
        //     _auctionEndTime > block.timestamp,
        //     "MarketPlace: invalid end time"
        // );
        require(
            _auctionStartTime > block.timestamp &&
                _auctionEndTime > _auctionStartTime,
            "MarketPlace: invalid time"
        );
        _checkApproval(_tokenId, _isERC721);

        if (_isERC721) {
            require(
                msg.sender == ERC721(erc721).ownerOf(_tokenId),
                "MarketPlace: not token owner"
            );
            // require(
            //     IERC721(erc721).getApproved(_tokenId) == address(this),
            //     "MarketPlace: not approved"
            // );

            auctionInfo[_isERC721][_tokenId][msg.sender].quantity = 1;
        } else {
            require(
                IERC1155(erc1155).balanceOf(msg.sender, _tokenId) >= _quantity,
                "MarketPlace: not enough tokens"
            );
            // require(
            //     IERC1155(erc1155).isApprovedForAll(msg.sender, address(this)),
            //     "MarketPlace: not approved"
            // );
            // require(
            //     (IERC1155(erc1155).balanceOf(msg.sender, _tokenId)) >=
            //         _quantity +
            //             tokenOnSaleInfo[_isERC721][_tokenId][msg.sender]
            //                 .quantity,
            //     "MarketPlace: token not avilable "
            // );
            auctionInfo[_isERC721][_tokenId][msg.sender].quantity += _quantity;
        }
        auctionInfo[_isERC721][_tokenId][msg.sender].tokenId = _tokenId;
        auctionInfo[_isERC721][_tokenId][msg.sender]
            .basePricePerToken = _basePricePerToken;
        auctionInfo[_isERC721][_tokenId][msg.sender]
            .auctionStartTime = _auctionStartTime;
        auctionInfo[_isERC721][_tokenId][msg.sender]
            .auctionEndTime = _auctionEndTime;
        auctionInfo[_isERC721][_tokenId][msg.sender].seller = msg.sender;
        auctionInfo[_isERC721][_tokenId][msg.sender].isOnAuction = true;
        auctionInfo[_isERC721][_tokenId][msg.sender].isERC721 = _isERC721;
        emit SetAuction(
            _tokenId,
            _quantity,
            _basePricePerToken,
            _auctionStartTime,
            _auctionEndTime,
            msg.sender
        );
    }

    function bid(
        uint256 _tokenId,
        address _seller,
        bool _isERC721
    ) external payable {
        require(
            auctionInfo[_isERC721][_tokenId][_seller].isOnAuction,
            "MarketPlace: token not in Auction"
        );
        require(
            block.timestamp <=
                auctionInfo[_isERC721][_tokenId][_seller].auctionEndTime,
            "MarketPlace: auction is over"
        );
        // require(
        //     msg.value >=
        //         auctionInfo[_isERC721][_tokenId][_seller].basePricePerToken,
        //     "MarketPlace: value should greater then base price"
        // );
        require(
            msg.value >
                auctionInfo[_isERC721][_tokenId][_seller].maxBidAmount &&
                msg.value >=
                auctionInfo[_isERC721][_tokenId][_seller].basePricePerToken,
            "MarketPlace: bidding amount is not the highest"
        );
        biddingHistory[_isERC721][_tokenId][_seller].push(
            bidders(msg.sender, msg.value)
        );
        auctionInfo[_isERC721][_tokenId][_seller].maxBidAmount = msg.value;
        auctionInfo[_isERC721][_tokenId][_seller].maxBidAddress = msg.sender;
    }

    function claimToken(
        uint256 _tokenId,
        address _seller,
        bool _isERC721
    ) external {
        require(
            auctionInfo[_isERC721][_tokenId][_seller].isOnAuction,
            "MarketPlace: token not in auction"
        );
        require(
            block.timestamp >
                auctionInfo[_isERC721][_tokenId][_seller].auctionEndTime,
            "MarketPlace: auction is not over"
        );
        // require(
        //     auctionInfo[_isERC721][_tokenId][_seller].maxBidAddress !=
        //         address(0),
        //     "MarketPlace: no one bidded"
        // );
        require(
            msg.sender ==
                auctionInfo[_isERC721][_tokenId][_seller].maxBidAddress,
            "MarketPlace: only winner can access"
        );
        for (
            uint256 index;
            index < biddingHistory[_isERC721][_tokenId][_seller].length;
            index++
        ) {
            if (
                biddingHistory[_isERC721][_tokenId][_seller][index]
                    .bidderAddress ==
                msg.sender &&
                IERC1155(erc1155).isApprovedForAll(_seller, address(this)) &&
                IERC1155(erc1155).balanceOf(
                    auctionInfo[_isERC721][_tokenId][_seller].seller,
                    _tokenId
                ) >=
                auctionInfo[_isERC721][_tokenId][_seller].quantity
            ) {
                IERC1155(erc1155).safeTransferFrom(
                    auctionInfo[_isERC721][_tokenId][_seller].seller,
                    msg.sender,
                    _tokenId,
                    auctionInfo[_isERC721][_tokenId][_seller].quantity,
                    "0x00"
                );
            } else {
                payable(
                    biddingHistory[_isERC721][_tokenId][_seller][index]
                        .bidderAddress
                ).transfer(
                        biddingHistory[_isERC721][_tokenId][_seller][index]
                            .biddingAmount
                    );
            }
        }
        payable(_seller).transfer(
            auctionInfo[_isERC721][_tokenId][_seller].maxBidAmount
        );
        delete auctionInfo[_isERC721][_tokenId][_seller];
        delete biddingHistory[_isERC721][_tokenId][_seller];
        emit Claim(_tokenId, _seller, msg.sender);
    }

    function cancelAuction(uint256 _tokenId, bool _isERC721) external {
        require(
            auctionInfo[_isERC721][_tokenId][msg.sender].isOnAuction,
            "MarketPlace: token not in auction"
        );
        require(
            block.timestamp <
                auctionInfo[_isERC721][_tokenId][msg.sender].auctionEndTime,
            "MarketPlace: auction is over"
        );

        for (
            uint256 index;
            index < biddingHistory[_isERC721][_tokenId][msg.sender].length;
            index++
        ) {
            payable(
                biddingHistory[_isERC721][_tokenId][msg.sender][index]
                    .bidderAddress
            ).transfer(
                    biddingHistory[_isERC721][_tokenId][msg.sender][index]
                        .biddingAmount
                );
        }
        delete auctionInfo[_isERC721][_tokenId][msg.sender];
        delete biddingHistory[_isERC721][_tokenId][msg.sender];
        emit CancelAuction(_tokenId, msg.sender);
    }

    function cancelBid(
        uint256 _tokenId,
        bool _isERC721,
        address _seller
    ) external {
        require(
            auctionInfo[_isERC721][_tokenId][_seller].isOnAuction,
            "ERC721Auction: token not in Auction"
        );
        uint256 tempBidAmount;
        address tempAddress;
        uint256 tempMaxBidAmount;
        address tempMaxAddress;
        for (
            uint256 index;
            index < biddingHistory[_isERC721][_tokenId][_seller].length;
            index++
        ) {
            if (
                biddingHistory[_isERC721][_tokenId][_seller][index]
                    .bidderAddress == msg.sender
            ) {
                tempBidAmount = biddingHistory[_isERC721][_tokenId][_seller][
                    index
                ].biddingAmount;
                tempAddress = biddingHistory[_isERC721][_tokenId][_seller][
                    index
                ].bidderAddress;
                biddingHistory[_isERC721][_tokenId][_seller][index]
                    .bidderAddress = address(0);
                biddingHistory[_isERC721][_tokenId][_seller][index]
                    .biddingAmount = 0;
            } else {
                if (
                    biddingHistory[_isERC721][_tokenId][_seller][index]
                        .biddingAmount > tempMaxBidAmount
                ) {
                    tempMaxBidAmount = biddingHistory[_isERC721][_tokenId][
                        _seller
                    ][index].biddingAmount;
                    tempMaxAddress = biddingHistory[_isERC721][_tokenId][
                        _seller
                    ][index].bidderAddress;
                }
            }
            payable(tempAddress).transfer(tempBidAmount);
            auctionInfo[_isERC721][_tokenId][_seller]
                .maxBidAmount = tempMaxBidAmount;
            auctionInfo[_isERC721][_tokenId][_seller]
                .maxBidAddress = tempMaxAddress;
        }
    }
}
