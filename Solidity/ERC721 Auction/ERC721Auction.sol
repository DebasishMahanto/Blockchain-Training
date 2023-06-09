// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./ERC721.sol";

contract ERC721Auction {
    address erc721;

    struct tokenOnAuction {
        uint256 tokenId;
        uint256 basePrice;
        uint256 auctionStartTime;
        uint256 auctionEndTime;
        uint256 maxBidAmount;
        address maxBidAddress;
        address tokenOwner;
        bool isOnAuction;
    }

    struct bidders {
        address bidderAddress;
        uint256 biddingAmount;
    }

    mapping(uint256 => tokenOnAuction) private AuctionInfo;
    mapping(uint256 => bidders[]) private biddingHistory;

    event SetAuction(
        address seller,
        uint256 tokenId,
        uint256 startTime,
        uint256 endTime
    );
    event Bid(address bidderAddress, uint256 _tokenId);
    event Claim(address winner, uint256 _tokenId);
    event CancelAuction(address owner, uint256 _tokenId);
    event CancelBid(address bidderaddress, uint256 _tokenId);

    constructor(address _erc721) {
        erc721 = _erc721;
    }

    function tokenOnAuctionInfo(uint256 _tokenId)
        external
        view
        returns (tokenOnAuction memory)
    {
        require(
            AuctionInfo[_tokenId].isOnAuction,
            "ERC721Auction: token not in Auction"
        );
        return (AuctionInfo[_tokenId]);
    }

    function setAuction(
        uint256 _tokenId,
        uint256 _basePrice,
        uint256 _auctionStartTime,
        uint256 _auctionEndTime
    ) external {
        require(
            !AuctionInfo[_tokenId].isOnAuction,
            "ERC721Auction: token already in Auction"
        );
        require(_basePrice > 0, "ERC721Auction: base price should postive");
        require(
            _auctionEndTime > block.timestamp,
            "ERC721Auction: invalid end time"
        );
        require(
            _auctionStartTime > block.timestamp &&
                _auctionStartTime != _auctionEndTime,
            "ERC721Auction: invalid time"
        );
        require(
            msg.sender == ERC721(erc721).ownerOf(_tokenId),
            "ERC721Auction: not token owner"
        );
        require(
            IERC721(erc721).getApproved(_tokenId) == address(this),
            "ERC721Auction: not approved"
        );
        AuctionInfo[_tokenId].tokenId = _tokenId;
        AuctionInfo[_tokenId].basePrice = _basePrice;
        AuctionInfo[_tokenId].auctionStartTime = _auctionStartTime;
        AuctionInfo[_tokenId].auctionEndTime = _auctionEndTime;

        AuctionInfo[_tokenId].tokenOwner = msg.sender;
        AuctionInfo[_tokenId].isOnAuction = true;

        emit SetAuction(
            msg.sender,
            _tokenId,
            _auctionStartTime,
            _auctionEndTime
        );
    }

    function bid(uint256 _tokenId) external payable {
        require(
            AuctionInfo[_tokenId].isOnAuction,
            "ERC721Auction: token not in Auction"
        );
        require(
            block.timestamp < AuctionInfo[_tokenId].auctionEndTime,
            "ERC721Auction: Auction end"
        );
        require(
            block.timestamp > AuctionInfo[_tokenId].auctionStartTime,
            "ERC721Auction: auction not start"
        );
        require(
            msg.value > AuctionInfo[_tokenId].maxBidAmount,
            "ERC721Auction: your bid is not the highest"
        );
        require(
            msg.value > AuctionInfo[_tokenId].basePrice,
            "ERC721Auction:less than base price"
        );

        biddingHistory[_tokenId].push(bidders(msg.sender, msg.value));

        AuctionInfo[_tokenId].maxBidAmount = msg.value;
        AuctionInfo[_tokenId].maxBidAddress = msg.sender;

        emit Bid(msg.sender, _tokenId);
    }

    function claim(uint256 _tokenId) external {
        require(
            AuctionInfo[_tokenId].isOnAuction,
            "ERC721Auction: token not in Auction"
        );
        require(
            block.timestamp > AuctionInfo[_tokenId].auctionEndTime,
            "ERC721Auction: auction is not over"
        );
        require(
            block.timestamp > AuctionInfo[_tokenId].auctionStartTime,
            "ERC721Auction: auction not start"
        );
        require(
            AuctionInfo[_tokenId].maxBidAddress != address(0),
            "ERC721Auction: no one bidded"
        );
        require(
            msg.sender == AuctionInfo[_tokenId].maxBidAddress,
            "ERC721Auction: not higest bidder"
        );
        uint256 tempBidAmount;
        address tempTokenOwner;
        for (uint256 index; index < biddingHistory[_tokenId].length; index++) {
            if (
                biddingHistory[_tokenId][index].bidderAddress == msg.sender &&
                IERC721(erc721).getApproved(_tokenId) == address(this)
            ) {
                tempTokenOwner = AuctionInfo[_tokenId].tokenOwner;
                tempBidAmount = AuctionInfo[_tokenId].maxBidAmount;
                IERC721(erc721).transferFrom(
                    tempTokenOwner,
                    msg.sender,
                    _tokenId
                );
            } else {
                payable(biddingHistory[_tokenId][index].bidderAddress).transfer(
                    biddingHistory[_tokenId][index].biddingAmount
                );
            }
        }
        payable(tempTokenOwner).transfer(tempBidAmount);
        delete AuctionInfo[_tokenId];
        delete biddingHistory[_tokenId];

        emit Claim(AuctionInfo[_tokenId].maxBidAddress, _tokenId);
    }

    function cancelAuction(uint256 _tokenId) external {
        address owner = IERC721(erc721).ownerOf(_tokenId);
        require(
            AuctionInfo[_tokenId].isOnAuction,
            "ERC721Auction: token not in Auction"
        );
        require(
            block.timestamp < AuctionInfo[_tokenId].auctionEndTime,
            "ERC721Auction: auction is over"
        );
        require(
            block.timestamp > AuctionInfo[_tokenId].auctionStartTime,
            "ERC721Auction: auction not start"
        );
        require(
            AuctionInfo[_tokenId].tokenOwner == owner,
            "ERC721Auction: owner is different"
        );
        require(msg.sender == owner, "ERC721Auction: not owner");

        for (uint256 index; index < biddingHistory[_tokenId].length; index++) {
            payable(biddingHistory[_tokenId][index].bidderAddress).transfer(
                biddingHistory[_tokenId][index].biddingAmount
            );
        }

        delete AuctionInfo[_tokenId];
        delete biddingHistory[_tokenId];

        emit CancelAuction(msg.sender, _tokenId);
    }

    function cancelBid(uint256 _tokenId) external {
        require(
            AuctionInfo[_tokenId].isOnAuction,
            "ERC721Auction: token not in Auction"
        );
        uint256 tempBidAmount;
        address tempAddress;
        uint256 tempMaxBidAmount;
        address tempMaxAddress;

        for (uint256 index; index < biddingHistory[_tokenId].length; index++) {
            if (biddingHistory[_tokenId][index].bidderAddress == msg.sender) {
                tempBidAmount = biddingHistory[_tokenId][index].biddingAmount;
                tempAddress = biddingHistory[_tokenId][index].bidderAddress;
                biddingHistory[_tokenId][index].bidderAddress = address(0);
                biddingHistory[_tokenId][index].biddingAmount = 0;
            } else {
                if (
                    biddingHistory[_tokenId][index].biddingAmount >
                    tempMaxBidAmount
                ) {
                    tempMaxBidAmount = biddingHistory[_tokenId][index]
                        .biddingAmount;
                    tempMaxAddress = biddingHistory[_tokenId][index]
                        .bidderAddress;
                }
            }
        }
        payable(tempAddress).transfer(tempBidAmount);

        AuctionInfo[_tokenId].maxBidAmount = tempMaxBidAmount;
        AuctionInfo[_tokenId].maxBidAddress = tempMaxAddress;

        emit CancelBid(msg.sender, _tokenId);
    }
}
