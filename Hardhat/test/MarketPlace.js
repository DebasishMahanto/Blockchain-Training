const { expect } = require("chai");
const { ethers } = require("hardhat");
const helpers = require("@nomicfoundation/hardhat-network-helpers")

describe("MarketPlace contract", function () {

    let ERC721;
    let ERC1155;
    let MarketPlace;
    let erc721;
    let erc1155;
    let marketPlace;
    let owner;
    let account1;
    let account2;
    let accounts;
    let name721 = "demo721";
    let symbol721 = "dm721";
    let name1155 = "demo1155";
    let symbol1155 = "dm1155";

    beforeEach(async function () {
        ERC721 = await ethers.getContractFactory("ERC721");
        ERC1155 = await ethers.getContractFactory("ERC1155CHECK");
        MarketPlace = await ethers.getContractFactory("MarketPlace");
        [owner, account1, account2, ...accounts] = await ethers.getSigners();
        erc721 = await ERC721.deploy(name721, symbol721);
        erc1155 = await ERC1155.deploy(name1155, symbol1155);
        marketPlace = await MarketPlace.deploy(erc721.address, erc1155.address);
        erc721.mintTo(owner.address);
        erc1155.mintTo(owner.address, 1, 100);
    })

    //DEPLOYEMENT

    it("should set right market owner", async function () {
        console.log("Deployement");

        expect(await marketPlace.marketOwner()).to.equal(owner.address);
    })

    it("should set right erc721 contract owner", async function () {
        expect(await marketPlace.erc721()).to.equal(erc721.address);
    }

    )
    it("should set right erc1155 contract owner", async function () {
        expect(await marketPlace.erc1155()).to.equal(erc1155.address);
    })

    //SET ON SALE 

    it("should revert if price per token is zero", async function () {
        console.log("SetOnSale");
        await expect(marketPlace.setOnSale(1, 10, 0, false)).to.be.revertedWith("MarketPlace: invalid price");
    })

    it("should revert if token quantity for sale is zero", async function () {
        await expect(marketPlace.setOnSale(1, 0, 1, false)).to.be.revertedWith("MarketPlace: invalid quantity");
    })

    it("should revert if token is not approved for sale", async function () {
        marketPlace.setOnSale(1, 1, 1, true);
        await expect(marketPlace.setOnSale(1, 1, 1, true)).to.be.revertedWith("MarketPlace: not approved");
    })

    it("should revert if token is already in sale", async function () {
        erc721.approve(marketPlace.address, 1);
        marketPlace.setOnSale(1, 1, 1, true);
        await expect(marketPlace.setOnSale(1, 1, 1, true)).to.be.revertedWith("MarketPlace: Already in sale or in auction");
    })

    it("should revert if token is already in auction", async function () {
        await erc721.approve(marketPlace.address, 1);
        const currentTime = parseInt(await helpers.time.latest());
        await marketPlace.setAuction(1, 1, 1, currentTime + 10, currentTime + 600, true);
        await expect(marketPlace.setOnSale(1, 1, 1, true)).to.be.revertedWith("MarketPlace: Already in sale or in auction");
    })

    it("should revert if insufficient token for sale", async function () {
        erc1155.setApprovalForAll(marketPlace.address, true);
        marketPlace.setOnSale(1, 1, 1, true);
        await expect(marketPlace.setOnSale(1, 101, 1, false)).to.be.revertedWith("MarketPlace: token not avilable");
    })

    it("should set sale for ERC721 token", async function () {
        await erc721.approve(marketPlace.address, 1);
        await marketPlace.setOnSale(1, 1, 1, true);
        const TokenOnSale = await marketPlace.tokenOnSaleInfo(true, 1, owner.address);
        expect(await TokenOnSale.isOnSale).to.equal(true);
    })

    it("should set sale for ERC1155 token", async function () {
        await erc1155.setApprovalForAll(marketPlace.address, true);
        await marketPlace.setOnSale(1, 50, 1, false);
        const TokenOnSale = await marketPlace.tokenOnSaleInfo(false, 1, owner.address);
        expect(await TokenOnSale.isOnSale).to.equal(true);

    })

    it("should update token on sale information", async function () {
        await erc721.approve(marketPlace.address, 1);
        await erc1155.setApprovalForAll(marketPlace.address, true);
        await marketPlace.setOnSale(1, 1, 1, true);
        await marketPlace.setOnSale(1, 50, 1, false);
        const Token721OnSale = await marketPlace.tokenOnSaleInfo(true, 1, owner.address);
        const Token1155OnSale = await marketPlace.tokenOnSaleInfo(false, 1, owner.address);

        expect(await Token721OnSale.isOnSale).to.equal(true);
        expect(await Token721OnSale.tokenId).to.equal(1);
        expect(await Token721OnSale.quantity).to.equal(1);
        expect(await Token721OnSale.pricePerToken).to.equal(1);

        expect(await Token1155OnSale.tokenId).to.equal(1);
        expect(await Token1155OnSale.quantity).to.equal(50);
        expect(await Token1155OnSale.pricePerToken).to.equal(1);
        expect(await Token1155OnSale.isOnSale).to.equal(true);
    })

    it("should emit event for setOnSale", async function () {
        await erc721.approve(marketPlace.address, 1);
        await expect(marketPlace.setOnSale(1, 1, 1, true)).to.emit(marketPlace, "SetOnSale").withArgs(1, 1, 1, owner.address);
    })

    //PURCHASE

    it("should revert if token not on sale", async function () {
        console.log("Purchase");
        await expect(marketPlace.purchase(1, 10, account1.address, false, { value: 10 })).to.be.revertedWith("MarketPlace: token not on sale");
    })

    it("should revert if buyer and seller are same", async function () {
        await erc721.approve(marketPlace.address, 1);
        await marketPlace.setOnSale(1, 1, 1, true);
        await expect(marketPlace.purchase(1, 1, owner.address, true, { value: 1 })).to.be.revertedWith("MarketPlace: you are the seller");
    })

    it("should revert if buyer sent invalid price", async function () {
        await erc721.approve(marketPlace.address, 1);
        await marketPlace.setOnSale(1, 1, 1, true);
        await expect(marketPlace.connect(account1).purchase(1, 1, owner.address, true, { value: 0 })).to.be.revertedWith("MarketPlace: invalid price");
    })

    it("should revert if insufficient token on sale", async function () {
        await erc1155.setApprovalForAll(marketPlace.address, true);
        await marketPlace.setOnSale(1, 50, 1, false);
        await expect(marketPlace.connect(account1).purchase(1, 51, owner.address, false, { value: 51 })).to.be.revertedWith("MarketPlace: insufficient token");
    })

    it("should purchase ERC721 token", async function () {
        await erc721.approve(marketPlace.address, 1);
        await marketPlace.setOnSale(1, 1, 1, true);
        await marketPlace.connect(account1).purchase(1, 1, owner.address, true, { value: 1 });
        expect(await erc721.ownerOf(1)).to.equal(account1.address);
    })

    it("should purchase ERC1155 token", async function () {
        await erc1155.setApprovalForAll(marketPlace.address, true);
        await marketPlace.setOnSale(1, 50, 1, false);
        await marketPlace.connect(account1).purchase(1, 10, owner.address, false, { value: 10 });
        expect(await erc1155.balanceOf(account1.address, 1)).to.equal(10);
    })

    it("should update quantity of token on sale", async function () {
        await erc721.approve(marketPlace.address, 1);
        await erc1155.setApprovalForAll(marketPlace.address, true);
        await marketPlace.setOnSale(1, 1, 1, true);
        await marketPlace.setOnSale(1, 50, 1, false);

        await marketPlace.connect(account1).purchase(1, 1, owner.address, true, { value: 1 });
        await marketPlace.connect(account1).purchase(1, 10, owner.address, false, { value: 10 });

        const Token721OnSale = await marketPlace.tokenOnSaleInfo(true, 1, owner.address);
        const Token1155OnSale = await marketPlace.tokenOnSaleInfo(false, 1, owner.address);

        expect(await Token721OnSale.quantity).to.equal(0);
        expect(await Token1155OnSale.quantity).to.equal(40);

    })

    it("should end sale if token is out of stock", async function () {
        await erc1155.setApprovalForAll(marketPlace.address, true);
        await marketPlace.setOnSale(1, 50, 1, false);
        await marketPlace.connect(account1).purchase(1, 50, owner.address, false, { value: 50 });
        const Token1155OnSale = await marketPlace.tokenOnSaleInfo(false, 1, owner.address);
        expect(Token1155OnSale.isOnSale).to.equal(false);

    })

    it("should emit the event for purchase", async function () {
        await erc1155.setApprovalForAll(marketPlace.address, true);
        await marketPlace.setOnSale(1, 50, 1, false);

        await expect(marketPlace.connect(account1).purchase(1, 10, owner.address, false, { value: 10 })).to.emit(marketPlace, "Purchase").withArgs(1, 10, owner.address, account1.address);
    })

    //CANCEL SALE

    it("reveert if there is no sale", async function () {
        console.log("Cancel Sale");
        await expect(marketPlace.cancelSale(1, true)).to.be.revertedWith("MarketPlace: not on sale");
    })

    it("should stop the sale", async function () {
        await erc1155.setApprovalForAll(marketPlace.address, true);
        await marketPlace.setOnSale(1, 50, 1, false);
        await marketPlace.cancelSale(1, false);

        const Token1155OnSale = await marketPlace.tokenOnSaleInfo(false, 1, owner.address);
        expect(Token1155OnSale.isOnSale).to.equal(false);
    })

    it("should emit the event for cancel sale", async function () {
        await erc1155.setApprovalForAll(marketPlace.address, true);
        await marketPlace.setOnSale(1, 50, 1, false);
        await expect(marketPlace.cancelSale(1, false)).to.emit(marketPlace, "StopSale").withArgs(1, owner.address);
    })

    //SET AUCTION

    it("should revert if caller is not owner", async function () {
        console.log("Set Auction")
        const currentTime = parseInt(await helpers.time.latest());
        await expect(marketPlace.connect(account1).setAuction(1, 1, 1, currentTime + 10, currentTime + 610, true)).to.be.revertedWith("MarketPlace: not approved");
    })

    it("should revert if caller not approved  for ERC721", async function () {
        const currentTime = parseInt(await helpers.time.latest());
        await expect(marketPlace.setAuction(1, 1, 1, currentTime + 10, currentTime + 610, true)).to.be.revertedWith("MarketPlace: not approved");
    })

    it("should revert if caller not approved  for ERC1155", async function () {
        const currentTime = parseInt(await helpers.time.latest());
        await expect(marketPlace.setAuction(1, 1, 1, currentTime + 10, currentTime + 610, false)).to.be.revertedWith("MarketPlace: not approved");
    })

    it("should revert if token already in auction", async function () {
        await erc721.approve(marketPlace.address, 1);
        const currentTime = parseInt(await helpers.time.latest());
        await marketPlace.setAuction(1, 1, 1, currentTime + 10, currentTime + 600, true);
        await expect(marketPlace.setAuction(1, 1, 1, currentTime + 10, currentTime + 610, true)).to.be.revertedWith("MarketPlace: token already in Auction or in sale");

    })

    it("should revert if token already in sale", async function () {
        await erc721.approve(marketPlace.address, 1);
        await marketPlace.setOnSale(1, 1, 1, true);
        const currentTime = parseInt(await helpers.time.latest());
        await expect(marketPlace.setAuction(1, 1, 1, currentTime + 10, currentTime + 610, true)).to.be.revertedWith("MarketPlace: token already in Auction or in sale");

    })

    it("should revert if base price is not positive", async function () {
        await erc721.approve(marketPlace.address, 1);
        const currentTime = parseInt(await helpers.time.latest());
        await expect(marketPlace.setAuction(1, 1, 0, currentTime + 10, currentTime + 610, true)).to.be.revertedWith("MarketPlace: base price should postive");

    })

    it("should revert if number of token to set auction is zero", async function () {
        await erc721.approve(marketPlace.address, 1);
        const currentTime = parseInt(await helpers.time.latest());
        await expect(marketPlace.setAuction(1, 0, 1, currentTime + 10, currentTime + 610, true)).to.be.revertedWith("MarketPlace: quantity should positive");

    })

    it("should revert if invalid start time and end time", async function () {
        await erc721.approve(marketPlace.address, 1);
        const currentTime = parseInt(await helpers.time.latest());
        await expect(marketPlace.setAuction(1, 1, 1, currentTime, currentTime, true)).to.be.revertedWith("MarketPlace: invalid time");

    })

    it("should revert if owner have insufficient token to set auction", async function () {
        await erc1155.setApprovalForAll(marketPlace.address, true);
        const currentTime = parseInt(await helpers.time.latest());
        await expect(marketPlace.setAuction(1, 101, 1, currentTime + 10, currentTime + 610, false)).to.be.revertedWith("MarketPlace: not enough tokens");

    })

    it("should set auction for ERC721 token", async function () {
        await erc721.approve(marketPlace.address, 1);
        const currentTime = parseInt(await helpers.time.latest());
        await marketPlace.setAuction(1, 1, 1, currentTime + 10, currentTime + 600, true);
        const tokenOnAuction = await marketPlace.auctionInfo(true, 1, owner.address);
        expect(tokenOnAuction.isOnAuction).to.equal(true);
    })

    it("should set auction for ERC1155 token", async function () {
        await erc1155.setApprovalForAll(marketPlace.address, true);
        const currentTime = parseInt(await helpers.time.latest());
        await marketPlace.setAuction(1, 15, 1, currentTime + 10, currentTime + 610, false);
        const tokenOnAuction = await marketPlace.auctionInfo(false, 1, owner.address);
        expect(tokenOnAuction.isOnAuction).to.equal(true);
    })

    it("should set right base price for token for auction", async function () {
        await erc1155.setApprovalForAll(marketPlace.address, true);
        const currentTime = parseInt(await helpers.time.latest());
        await marketPlace.setAuction(1, 15, 1, currentTime + 10, currentTime + 610, false);
        const tokenOnAuction = await marketPlace.auctionInfo(false, 1, owner.address);
        expect(tokenOnAuction.basePricePerToken).to.equal(1);
    })

    it("should set right quantity to set for auction", async function () {
        await erc1155.setApprovalForAll(marketPlace.address, true);
        const currentTime = parseInt(await helpers.time.latest());
        await marketPlace.setAuction(1, 15, 1, currentTime + 10, currentTime + 610, false);
        const tokenOnAuction = await marketPlace.auctionInfo(false, 1, owner.address);
        expect(tokenOnAuction.quantity).to.equal(15);
    })

    it("should set right auction start time", async function () {
        await erc1155.setApprovalForAll(marketPlace.address, true);
        const currentTime = parseInt(await helpers.time.latest());
        await marketPlace.setAuction(1, 15, 1, currentTime + 10, currentTime + 610, false);
        const tokenOnAuction = await marketPlace.auctionInfo(false, 1, owner.address);
        expect(tokenOnAuction.auctionStartTime).to.equal(currentTime + 10);
    })

    it("should set right auction end time", async function () {
        await erc1155.setApprovalForAll(marketPlace.address, true);
        const currentTime = parseInt(await helpers.time.latest());
        await marketPlace.setAuction(1, 15, 1, currentTime + 10, currentTime + 610, false);
        const tokenOnAuction = await marketPlace.auctionInfo(false, 1, owner.address);
        expect(tokenOnAuction.auctionEndTime).to.equal(currentTime + 610);
    })

    it("should emit the event for set auction", async function () {
        await erc1155.setApprovalForAll(marketPlace.address, true);
        const currentTime = parseInt(await helpers.time.latest());
        await expect(marketPlace.setAuction(1, 15, 1, currentTime + 10, currentTime + 610, false)).to.emit(marketPlace, "SetAuction").withArgs(1, 15, 1, currentTime + 10, currentTime + 610, owner.address);
    })

    //BID

    it("should revert if token not in auction", async function () {
        console.log("Bid");
        await expect(marketPlace.connect(account1).bid(1, owner.address, true, { value: 5 })).to.be.revertedWith("MarketPlace: token not in Auction");
    })

    it("should revert if auction is over", async function () {
        await erc1155.setApprovalForAll(marketPlace.address, true);
        const currentTime = parseInt(await helpers.time.latest());
        await marketPlace.setAuction(1, 15, 1, currentTime + 10, currentTime + 610, false);
        await helpers.time.increaseTo(currentTime + 610);
        await expect(marketPlace.connect(account1).bid(1, owner.address, false, { value: 6 })).to.be.revertedWith("MarketPlace: auction is over");
    })

    it("should revert if bidding amount value is not greater then base price", async function () {
        await erc1155.setApprovalForAll(marketPlace.address, true);
        const currentTime = parseInt(await helpers.time.latest());
        await marketPlace.setAuction(1, 15, 10, currentTime + 10, currentTime + 610, false);
        await helpers.time.increaseTo(currentTime + 11);
        await expect(marketPlace.connect(account1).bid(1, owner.address, false, { value: 6 })).to.be.revertedWith("MarketPlace: bidding amount is not the highest");
    })

    it("should revert if bidding amount is not highest", async function () {
        await erc1155.setApprovalForAll(marketPlace.address, true);
        const currentTime = parseInt(await helpers.time.latest());
        await marketPlace.setAuction(1, 1, 10, currentTime + 10, currentTime + 610, false);
        await helpers.time.increaseTo(currentTime + 11);
        await marketPlace.connect(account2).bid(1, owner.address, false, { value: 15 })
        await expect(marketPlace.connect(account1).bid(1, owner.address, false, { value: 12 })).to.be.revertedWith("MarketPlace: bidding amount is not the highest");
    })

    it("should update maximum bidding amount", async function () {
        await erc1155.setApprovalForAll(marketPlace.address, true);
        const currentTime = parseInt(await helpers.time.latest());
        await marketPlace.setAuction(1, 1, 10, currentTime + 10, currentTime + 610, false);
        await helpers.time.increaseTo(currentTime + 11);
        await marketPlace.connect(account2).bid(1, owner.address, false, { value: 15 })
        await marketPlace.connect(account2).bid(1, owner.address, false, { value: 20 })
        const tokenOnAuction = await marketPlace.auctionInfo(false, 1, owner.address);
        expect(tokenOnAuction.maxBidAmount).to.equal(20);
    })

    it("should update maximum bidder address", async function () {
        await erc1155.setApprovalForAll(marketPlace.address, true);
        const currentTime = parseInt(await helpers.time.latest());
        await marketPlace.setAuction(1, 1, 10, currentTime + 10, currentTime + 610, false);
        await helpers.time.increaseTo(currentTime + 11);
        await marketPlace.connect(account1).bid(1, owner.address, false, { value: 15 })
        await marketPlace.connect(account2).bid(1, owner.address, false, { value: 20 })
        const tokenOnAuction = await marketPlace.auctionInfo(false, 1, owner.address);
        expect(tokenOnAuction.maxBidAddress).to.equal(account2.address);
    })

    //CLAIM TOKEN

    it("should revert if token not in auction", async function () {
        console.log("Claim token");
        await expect(marketPlace.connect(account1).claimToken(1, owner.address, false)).to.be.revertedWith("MarketPlace: token not in auction");
    })

    it("should revert if auction is not over", async function () {
        await erc1155.setApprovalForAll(marketPlace.address, true);
        const currentTime = parseInt(await helpers.time.latest());
        await marketPlace.setAuction(1, 1, 10, currentTime + 10, currentTime + 610, false);
        await helpers.time.increaseTo(currentTime + 11);
        await marketPlace.connect(account1).bid(1, owner.address, false, { value: 15 })
        await marketPlace.connect(account2).bid(1, owner.address, false, { value: 20 })
        await expect(marketPlace.connect(account2).claimToken(1, owner.address, false)).to.be.revertedWith("MarketPlace: auction is not over");
    })

    it("should revert if no one is bidded", async function () {
        await erc1155.setApprovalForAll(marketPlace.address, true);
        const currentTime = parseInt(await helpers.time.latest());
        await marketPlace.setAuction(1, 1, 10, currentTime + 10, currentTime + 610, false);
        await helpers.time.increaseTo(currentTime + 611);
        // await marketPlace.connect(account2).bid(1, owner.address, false, { value: 20 })
        await expect(marketPlace.connect(account2).claimToken(1, owner.address, false)).to.be.revertedWith("MarketPlace: only winner can access");
    })

    it("should revert if caller is not highest bidder", async function () {
        await erc1155.setApprovalForAll(marketPlace.address, true);
        const currentTime = parseInt(await helpers.time.latest());
        await marketPlace.setAuction(1, 1, 10, currentTime + 10, currentTime + 610, false);
        await helpers.time.increaseTo(currentTime + 11);
        await marketPlace.connect(account1).bid(1, owner.address, false, { value: 15 })
        await marketPlace.connect(account2).bid(1, owner.address, false, { value: 20 })
        await helpers.time.increaseTo(currentTime + 611);
        await expect(marketPlace.connect(account1).claimToken(1, owner.address, false)).to.be.revertedWith("MarketPlace: only winner can access");
    })

    it("should highest bidder claim successfully", async function () {
        await erc1155.setApprovalForAll(marketPlace.address, true);
        const currentTime = parseInt(await helpers.time.latest());
        await marketPlace.setAuction(1, 10, 10, currentTime + 10, currentTime + 610, false);
        await helpers.time.increaseTo(currentTime + 11);
        await marketPlace.connect(account1).bid(1, owner.address, false, { value: 15 })
        await marketPlace.connect(account2).bid(1, owner.address, false, { value: 20 })
        await helpers.time.increaseTo(currentTime + 611);
        await marketPlace.connect(account2).claimToken(1, owner.address, false);
        expect(await erc1155.balanceOf(account2.address, 1)).to.equal(10);

    })

    it("it should delete auction information", async function () {
        await erc1155.setApprovalForAll(marketPlace.address, true);
        const currentTime = parseInt(await helpers.time.latest());
        await marketPlace.setAuction(1, 10, 10, currentTime + 10, currentTime + 610, false);
        await helpers.time.increaseTo(currentTime + 11);
        await marketPlace.connect(account1).bid(1, owner.address, false, { value: 15 })
        await marketPlace.connect(account2).bid(1, owner.address, false, { value: 20 })
        await helpers.time.increaseTo(currentTime + 611);
        await marketPlace.connect(account2).claimToken(1, owner.address, false);
        const tokenOnAuction = await marketPlace.auctionInfo(false, 1, owner.address);
        expect(tokenOnAuction.isOnAuction).to.equal(false);

    })

    it("should delete the bidder information", async function () {
        await erc1155.setApprovalForAll(marketPlace.address, true);
        const currentTime = parseInt(await helpers.time.latest());
        await marketPlace.setAuction(1, 10, 10, currentTime + 10, currentTime + 610, false);
        await helpers.time.increaseTo(currentTime + 11);
        await marketPlace.connect(account1).bid(1, owner.address, false, { value: 15 })
        await marketPlace.connect(account2).bid(1, owner.address, false, { value: 20 })
        await helpers.time.increaseTo(currentTime + 611);
        await marketPlace.connect(account2).claimToken(1, owner.address, false);
        const Bidders = await marketPlace.biddingHistory(false, 1, owner.address)[0];
        //console.log(Bidders);
        // console.log(Bid);
        //expect(await Bidders.biddingAmount).to.equal(0);
    })

    it("it should refund bidding amount to bidders except higer bidder", async function () {

        await erc1155.setApprovalForAll(marketPlace.address, true);
        const currentTime = parseInt(await helpers.time.latest());
        await marketPlace.setAuction(1, 10, 10, currentTime + 10, currentTime + 610, false);
        await helpers.time.increaseTo(currentTime + 11);
        await marketPlace.connect(account1).bid(1, owner.address, false, { value: 15 })
        const Account1Balance = await ethers.provider.getBalance(account1.address);
        await marketPlace.connect(account2).bid(1, owner.address, false, { value: 20 })
        await helpers.time.increaseTo(currentTime + 611);
        await marketPlace.connect(account2).claimToken(1, owner.address, false);
        const afterClaimAccount1Balance = await ethers.provider.getBalance(account1.address);
        expect(Account1Balance).to.be.lt(afterClaimAccount1Balance);

    })

    it("should emit the event for claim Token", async function () {
        await erc1155.setApprovalForAll(marketPlace.address, true);
        const currentTime = parseInt(await helpers.time.latest());
        await marketPlace.setAuction(1, 10, 10, currentTime + 10, currentTime + 610, false);
        await helpers.time.increaseTo(currentTime + 11);
        await marketPlace.connect(account1).bid(1, owner.address, false, { value: 15 })
        await marketPlace.connect(account2).bid(1, owner.address, false, { value: 20 })
        await helpers.time.increaseTo(currentTime + 611);
        await expect(marketPlace.connect(account2).claimToken(1, owner.address, false)).to.be.emit(marketPlace, "Claim").withArgs(1, owner.address, account2.address);

    })

    //CANCEL AUCTION

    it("should revert if token not in auction", async function () {
        console.log("Cancel Auction")
        await expect(marketPlace.connect(account1).cancelAuction(1, false)).to.be.revertedWith("MarketPlace: token not in auction");
    })

    it("should revert if auction is over", async function () {
        await erc1155.setApprovalForAll(marketPlace.address, true);
        const currentTime = parseInt(await helpers.time.latest());
        await marketPlace.setAuction(1, 10, 10, currentTime + 10, currentTime + 610, false);
        await helpers.time.increaseTo(currentTime + 611);
        await expect(marketPlace.cancelAuction(1, false)).to.be.revertedWith("MarketPlace: auction is over");
    })

    it("should revert if caller is not auction owner", async function () {
        await erc1155.setApprovalForAll(marketPlace.address, true);
        const currentTime = parseInt(await helpers.time.latest());
        await marketPlace.setAuction(1, 10, 10, currentTime + 10, currentTime + 610, false);
        await expect(marketPlace.connect(account1).cancelAuction(1, false)).to.be.revertedWith("MarketPlace: token not in auction");
    })

    it("should delete the Auction information", async function () {
        await erc1155.setApprovalForAll(marketPlace.address, true);
        const currentTime = parseInt(await helpers.time.latest());
        await marketPlace.setAuction(1, 10, 10, currentTime + 10, currentTime + 610, false);
        await helpers.time.increaseTo(currentTime + 11);
        await marketPlace.cancelAuction(1, false);
        const tokenOnAuction = await marketPlace.auctionInfo(false, 1, owner.address);
        expect(tokenOnAuction.isOnAuction).to.equal(false);
        //expect(marketPlace.tokenOnAuctionInfo(1, false)).to.be.revertedWith("MarketPlace: token not in Auction");
    })

    it("should return the bidding amount to respective bidders", async function () {
        await erc1155.setApprovalForAll(marketPlace.address, true);
        const currentTime = parseInt(await helpers.time.latest());
        await marketPlace.setAuction(1, 10, 10, currentTime + 10, currentTime + 610, false);
        await helpers.time.increaseTo(currentTime + 11);
        await marketPlace.connect(account1).bid(1, owner.address, false, { value: 15 })
        const Account1Balance = await ethers.provider.getBalance(account1.address);
        await marketPlace.connect(account2).bid(1, owner.address, false, { value: 20 })
        const Account2Balance = await ethers.provider.getBalance(account2.address);
        await marketPlace.cancelAuction(1, false);
        const FAccount1Balance = await ethers.provider.getBalance(account1.address);
        const FAccount2Balance = await ethers.provider.getBalance(account2.address);
        expect(Account1Balance).to.be.lt(FAccount1Balance);
        expect(Account2Balance).to.be.lt(FAccount2Balance);

    })

    // it("should delete the bidder information", async function () {
    //     await erc1155.setApprovalForAll(marketPlace.address, true);
    //     const currentTime = parseInt(await helpers.time.latest());
    //     await marketPlace.setAuction(1, 10, 10, currentTime + 10, currentTime + 610, false);
    //     await helpers.time.increaseTo(currentTime + 11);
    //     await marketPlace.connect(account1).bid(1, owner.address, false, { value: 15 })
    //     await marketPlace.connect(account2).bid(1, owner.address, false, { value: 20 })
    //     await marketPlace.cancelAuction(1, false);
    //     const arrayBidders = await marketPlace.Bidders(1, false);
    //     expect(arrayBidders.length).to.equal(0);
    // })

    it("should emit the event for cancel auction", async function () {
        await erc1155.setApprovalForAll(marketPlace.address, true);
        const currentTime = parseInt(await helpers.time.latest());
        await marketPlace.setAuction(1, 10, 10, currentTime + 10, currentTime + 610, false);
        await helpers.time.increaseTo(currentTime + 11);
        await expect(marketPlace.cancelAuction(1, false)).to.emit(marketPlace, "CancelAuction").withArgs(1, owner.address);

    })

    //CANCEL BID

    it("should reverted if token not in auction", async function () {
        console.log("Cancel Bid");

        expect(marketPlace.connect(account1).cancelBid(1, false)).to.be.revertedWith("ERC721Auction: token not in Auction");
    })


    it("should reverted if caller is not bidder in auction", async function () {
        expect(marketPlace.connect(account1).cancelBid(1, false)).to.be.revertedWith("ERC721Auction: token not in Auction");
    })

    it("should update highest bidder information", async function () {
        await erc1155.setApprovalForAll(marketPlace.address, true);
        const currentTime = parseInt(await helpers.time.latest());
        await marketPlace.setAuction(1, 10, 10, currentTime + 10, currentTime + 610, false);
        await helpers.time.increaseTo(currentTime + 11);
        await marketPlace.connect(account1).bid(1, owner.address, false, { value: 15 })
        await marketPlace.connect(account2).bid(1, owner.address, false, { value: 20 })
        await marketPlace.connect(account2).cancelBid(1, false, owner.address);
        const tokenOnAuction = await marketPlace.auctionInfo(false, 1, owner.address);
        expect(tokenOnAuction.maxBidAddress).to.equal(account1.address);
        expect(tokenOnAuction.maxBidAmount).to.equal(15);


    })

    // it("should return bidding amount to the canceler", async function () {
    //     await erc1155.setApprovalForAll(marketPlace.address, true);
    //     const currentTime = parseInt(await helpers.time.latest());
    //     await marketPlace.setAuction(1, 10, 10, currentTime + 10, currentTime + 610, false);
    //     await helpers.time.increaseTo(currentTime + 11);
    //     await marketPlace.connect(account1).bid(1, owner.address, false, { value: 15 })
    //     //const Account1Balance = await ethers.provider.getBalance(account1.address);
    //     await marketPlace.connect(account2).bid(1, owner.address, false, { value: 20 })
    //     const Account2Balance = await ethers.provider.getBalance(account2.address);
    //     await marketPlace.connect(account2).cancelBid(false, 1, owner.address);
    //     //const FAccount1Balance = await ethers.provider.getBalance(account1.address);
    //     const FAccount2Balance = await ethers.provider.getBalance(account2.address);
    //     //expect(Account1Balance).to.equal(FAccount1Balance);
    //     expect(Account2Balance).to.be.lt(FAccount2Balance);

    // })



})