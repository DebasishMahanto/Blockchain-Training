const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ERC721 contract", function () {
    let token;
    let hardhatToken;
    let owner;
    let account1;
    let account2;
    let accounts;

    let tokenName_ = "demoToken";
    let tokenSymbol_ = "DT";

    beforeEach(async function () {
        token = await ethers.getContractFactory("ERC721");
        [owner, account1, account2, ...accounts] = await ethers.getSigners();
        hardhatToken = await token.deploy(tokenName_, tokenSymbol_);
        await hardhatToken.mintTo(owner.address);
    });

    describe("deployement", function () {

        it("should set right owner", async function () {
            expect(await hardhatToken.contractOwner()).to.equal(owner.address);
        });

        it("should name set properly", async function () {
            expect(await hardhatToken.name()).to.equal(tokenName_);
        })

        it("should symbol set properly", async function () {
            expect(await hardhatToken.symbol()).to.equal(tokenSymbol_);
        })

    })

    describe("MintTo", async function () {

        // it ("should only owner mint",async function(){
        //     expect( hardhatToken.connect(account1).mintTo(100)).to.be.revertedWith("ERC721: Only owner can mint");

        // })

        it("should revert if zero quantity to mint", async function () {
            expect(hardhatToken.mintTo("0x0000000000000000000000000000000000000000")).to.be.revertedWith("ERC721Token: zero address cannot be owner");
        })

        // it ("should not mint in contract in address", async function(){
        //     expect (hardhatToken.mint(token.address)).to.be.revertedWith("ERC721Token: do not mint in contract address");
        // })

        it("should mint properly ", async function () {

            await hardhatToken.mintTo(owner.address);
            expect(await hardhatToken.balanceOf(owner.address)).to.equal(2);

        })

        it("should set token owner properly", async function () {
            expect(await hardhatToken.ownerOf(1)).to.equal(owner.address);
        })

        it("should emit event for mint", async function () {
            await expect(hardhatToken.mintTo(owner.address)).to.emit(hardhatToken, "Transfer").withArgs("0x0000000000000000000000000000000000000000", owner.address, 2);
        })

    })

    describe("transferFrom", async function () {

        it("should transfer token owner to other", async function () {
            await hardhatToken.transferFrom(owner.address, account1.address, 1);
            expect(await hardhatToken.ownerOf(1)).to.equal(account1.address);
        })

        it("should allow spend token from approved address", async function () {
            await hardhatToken.approve(account1.address, 1);
            await hardhatToken.connect(account1).transferFrom(owner.address, account2.address, 1);
            expect(await (hardhatToken.ownerOf(1))).to.equal(account2.address);
        })

        it("should revert if spender is not allowed", async function () {
            await expect(hardhatToken.connect(account1).transferFrom(owner.address, account2.address, 1)).to.be.revertedWith("ERC721: You are not allowed");

        })

        it("should reverted if not owner", async function () {
            await expect(hardhatToken.transferFrom(account1.address, account2.address, 1)).to.be.revertedWith("ERC721: Not owner");
        })

        it("should revert if receiver address is zero", async function () {
            await expect(hardhatToken.transferFrom(owner.address, "0x0000000000000000000000000000000000000000", 1)).to.be.revertedWith("ERC721: Invalid Receiver address");

        })

        it("should emit event for transferFrom", async function () {
            await expect(await hardhatToken.transferFrom(owner.address, account1.address, 1)).to.emit(hardhatToken, "Transfer").withArgs(owner.address, account1.address, 1);
        })


    })

    describe("approve", async function () {

        it("should approve spender for use token", async function () {
            await hardhatToken.approve(account1.address, 1);
            expect(await hardhatToken.getApproved(1)).to.equal(account1.address);
        })

        it("should revert if approver is not owner", async function () {
            await expect(hardhatToken.connect(account1).approve(account2.address, 1)).to.be.revertedWith("ERC721: not owner");
        })

        it("should revert if spender address is zero", async function () {
            await expect(hardhatToken.approve("0x0000000000000000000000000000000000000000", 1)).to.be.revertedWith("ERC721:invalid spender address");
        })

        it("should emit event for approval", async function () {
            await expect(hardhatToken.approve(account1.address, 1)).to.emit(hardhatToken, "Approval").withArgs(owner.address, account1.address, 1);
        })


    })

    describe("approve all", async function () {

        it("should approve for all token", async function () {
            await hardhatToken.setApprovalForAll(account1.address, true);
            expect(await hardhatToken.isApprovedForAll(owner.address, account1.address)).to.be.true;
        })

        it("should cancel approval for all token", async function () {
            await hardhatToken.setApprovalForAll(account1.address, true);
            expect(await hardhatToken.isApprovedForAll(owner.address, account1.address)).to.be.true;
            await hardhatToken.setApprovalForAll(account1.address, false);
            expect(await hardhatToken.isApprovedForAll(owner.address, account1.address)).to.be.false;
        })

        it("should revered if spender address is zero", async function () {
            await expect(hardhatToken.setApprovalForAll("0x0000000000000000000000000000000000000000", true)).to.be.revertedWith("ERC721:invalid spender address");

        })

        it("should emit the event for approval for all", async function () {
            await expect(hardhatToken.setApprovalForAll(account1.address, true)).to.emit(hardhatToken, "ApprovalForAll").withArgs(owner.address, account1.address, true);
        })
    })

    describe("safeTransferFrom", async function () {

        it("should revert if spender is not allowed", async function () {
            await expect(hardhatToken.connect(account1)["safeTransferFrom(address,address,uint256)"](owner.address, account2.address, 1)).to.be.revertedWith("ERC721: You are not allowed");

        })

        it("should reverted if not owner", async function () {
            await expect(hardhatToken["safeTransferFrom(address,address,uint256)"](account1.address, account2.address, 1)).to.be.revertedWith("ERC721: Not owner");
        })

        it("should revert if receiver address is zero", async function () {
            await expect(hardhatToken["safeTransferFrom(address,address,uint256)"](owner.address, "0x0000000000000000000000000000000000000000", 1)).to.be.revertedWith("ERC721: Invalid Receiver address");

        })

        // it ("should revert if unsafe recipient",async function(){
        //     await expect(hardhatToken["safeTransferFrom(address,address,uint256)"](owner.address,token.address,1)).to.be.revertedWith("ERC721:unsafe recipient");
        // })

    })





})