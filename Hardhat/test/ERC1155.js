const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ERC1155 contract", function () {
    let token;
    let hardhatToken;
    let owner;
    let account1;
    let account2;
    let accounts;
    let mintPrice = 1;
    let uri = "uri";

    beforeEach(async function () {
        token = await ethers.getContractFactory("ERC1155Update");
        [owner, account1, account2, ...accounts] = await ethers.getSigners();
        hardhatToken = await token.deploy(mintPrice, uri);
        hardhatToken.mint(1, 100, { value: "100" });
    })

    describe("Deployement", function () {

        it("should set right owner", async function () {
            expect(await hardhatToken.owner()).to.equal(owner.address);
        })

        it("should set right minting price", async function () {
            expect(await hardhatToken.mintPrice()).to.equal(mintPrice);
        })

        it("should set right uri", async function () {
            expect(await hardhatToken.uri(1)).to.equal(uri);
        })

    })

    describe("Mint", function () {

        it("should revert if invalid minting price provided", async function () {
            await expect(hardhatToken.mint(2, 100, { value: "50" })).to.be.revertedWith("ERCU1155pdate : invalid price");
        }
        )
        it("should revert if invalid minting quantity", async function () {
            await expect(hardhatToken.mint(2, 0, { value: "0" })).to.be.revertedWith("ERCU1155pdate: invalid quantity");
        })

        it("shoud it mint successfully", async function () {
            hardhatToken.mint(2, 100, { value: "100" });
            expect(await hardhatToken.balanceOf(owner.address, 2)).to.equal(100);

        })

        it("should  mint other account", async function () {
            await hardhatToken.connect(account1).mint(2, 100, { value: "100" });
            expect(await hardhatToken.balanceOf(account1.address, 2)).to.equal(100);
        })

        it("should emit the event for mint", async function () {
            await expect(hardhatToken.mint(2, 100, { value: 100 })).to.emit(hardhatToken, "TransferSingle").withArgs(owner.address, "0x0000000000000000000000000000000000000000", owner.address, 2, 100);
        })

    })

    describe("Mint Batch", function () {

        it("should revert if invalid minting price provided", async function () {
            await expect(hardhatToken.mintBatch([2, 3], [10, 10], { value: 10 })).to.be.revertedWith("ERC1155Update: invalid total amount");
        })

        it("should revert if ids length and amount length mismatch", async function () {
            await expect(hardhatToken.mintBatch([2, 3], [10, 10, 10], { value: 20 })).to.be.revertedWith("ERC1155: ids and amounts length mismatch")
        })

        it("should mint batch successfully", async function () {
            await hardhatToken.mintBatch([2, 3], [10, 10], { value: 20 });
            const balances = await hardhatToken.balanceOfBatch([owner.address, owner.address], [2, 3]);
            const balanceStrings = balances.map(balance => balance.toString());

            expect(await balanceStrings).to.eql(["10", "10"]);
        })

        it("should other account can mint batch", async function () {
            await hardhatToken.connect(account1).mintBatch([2, 3], [10, 10], { value: 20 });
            const balances = await hardhatToken.balanceOfBatch([account1.address, account1.address], [2, 3]);
            const balanceStrings = balances.map(balance => balance.toString());

            expect(await balanceStrings).to.eql(["10", "10"]);
        })

        it("should emit the event for mint batch", async function () {
            await expect(hardhatToken.mintBatch([2, 3], [10, 10], { value: 20 })).to.emit(hardhatToken, "TransferBatch").withArgs(owner.address, "0x0000000000000000000000000000000000000000", owner.address, [2, 3], [10, 10]);
        })

    })

    describe("Burn", async function () {

        it("should revert if insufficient token to burn", async function () {
            await expect(hardhatToken.burn(1, 1000)).to.be.revertedWith("ERC1155: burn amount exceeds balance");
        })

        it("should burn successfully", async function () {
            const intialOwnerBalance = await hardhatToken.balanceOf(owner.address, 1);
            await hardhatToken.burn(1, 10);
            expect(await hardhatToken.balanceOf(owner.address, 1)).to.equal(intialOwnerBalance - 10);
        })

        it("shoud burn other account", async function () {
            await hardhatToken.connect(account1).mint(2, 100, { value: "100" });
            await hardhatToken.connect(account1).burn(2, 50);
            expect(await hardhatToken.balanceOf(account1.address, 2)).to.equal(50);
        })

        it("should emit the event for burn", async function () {
            await expect(hardhatToken.burn(1, 50,)).to.emit(hardhatToken, "TransferSingle").withArgs(owner.address, owner.address, "0x0000000000000000000000000000000000000000", 1, 50);
        })

    })

    describe("Burn batch", async function () {

        it("should revert if insufficient token to burn", async function () {
            await expect(hardhatToken.burnBatch([1, 2], [1000, 50])).to.be.revertedWith("ERC1155: burn amount exceeds balance");
        })

        it("should revert if ids length and amount length mismatch", async function () {
            await expect(hardhatToken.burnBatch([2, 3], [10, 10, 10])).to.be.revertedWith("ERC1155: ids and amounts length mismatch")
        })

        it("should burn batch successfully", async function () {
            await hardhatToken.mintBatch([2, 3], [10, 10], { value: 20 });

            await hardhatToken.burnBatch([2, 3], [10, 10]);

            const balances = await hardhatToken.balanceOfBatch([owner.address, owner.address], [2, 3]);
            const balanceStrings = balances.map(balance => balance.toString());

            expect(await balanceStrings).to.eql(["0", "0"]);
        })

        it("should other account can burn batch", async function () {
            await hardhatToken.connect(account1).mintBatch([2, 3], [10, 10], { value: 20 });

            await hardhatToken.connect(account1).burnBatch([2, 3], [10, 10]);

            const balances = await hardhatToken.balanceOfBatch([account1.address, account1.address], [2, 3]);
            const balanceStrings = balances.map(balance => balance.toString());

            expect(await balanceStrings).to.eql(["0", "0"]);
        })

        it("should emit the event for burn batch", async function () {

            await hardhatToken.mintBatch([2, 3], [10, 10], { value: 20 });

            await expect(hardhatToken.burnBatch([2, 3], [10, 10])).to.emit(hardhatToken, "TransferBatch").withArgs(owner.address, owner.address, "0x0000000000000000000000000000000000000000", [2, 3], [10, 10]);
        })

    })

    describe(" Set approval for all", function () {

        it("should revert if spender is self", async function () {
            await expect(hardhatToken.setApprovalForAll(owner.address, true)).to.be.revertedWith("ERC1155: setting approval status for self");
        })

        it("should set approval for all", async function () {
            await hardhatToken.setApprovalForAll(account1.address, true);

            expect(await hardhatToken.isApprovedForAll(owner.address, account1.address)).to.equal(true);
        })

        it("should emit the event for approval", async function () {
            await expect(hardhatToken.setApprovalForAll(account1.address, true)).to.emit(hardhatToken, "ApprovalForAll").withArgs(owner.address, account1.address, true);
        })
    })

    describe("Safe transfer from", function () {

        it("should revert if caller is not token owner or approved", async function () {
            await expect(hardhatToken.connect(account1).safeTransferFrom(owner.address, account2.address, 1, 50, 0x0000)).to.be.revertedWith("ERC1155: caller is not token owner or approved");
        })

        it("should revert if transfer to the zero address", async function () {
            await expect(hardhatToken.safeTransferFrom(owner.address, "0x0000000000000000000000000000000000000000", 1, 50, 0x0000)).to.be.revertedWith("ERC1155: transfer to the zero address");
        })

        it("should revert if insufficient balance for transfer", async function () {
            await expect(hardhatToken.safeTransferFrom(owner.address, account1.address, 1, 5000, 0x0000)).to.be.revertedWith("ERC1155: insufficient balance for transfer");
        })

        it("should transfer self token", async function () {
            await hardhatToken.safeTransferFrom(owner.address, account1.address, 1, 50, 0x0000);
            expect(await hardhatToken.balanceOf(account1.address, 1)).to.equal(50);
        })

        it("should transfer allowed tokens", async function () {
            await hardhatToken.setApprovalForAll(account1.address, true);
            await hardhatToken.connect(account1).safeTransferFrom(owner.address, account2.address, 1, 50, 0x0000);
            expect(await hardhatToken.balanceOf(account2.address, 1)).to.equal(50);
        })

        it("should update account balance", async function () {
            // const intialOwnerBalance=(hardhatToken.balanceOf(owner.address,1));
            // const intialAccount1Balance=(hardhatToken.balanceOf(account1.address,1));

            await hardhatToken.safeTransferFrom(owner.address, account1.address, 1, 50, 0x0000);

            // const updatedOwnerBalance = (await hardhatToken.balanceOf(owner.address, 1));
            // const updatedAccount1Balance = (await hardhatToken.balanceOf(account1.address, 1));

            expect(await hardhatToken.balanceOf(owner.address, 1)).to.equal(50);
            expect(await hardhatToken.balanceOf(account1.address, 1)).to.equal(50);
        })

        it("should emit event for safe transfer from", async function () {
            await expect(hardhatToken.safeTransferFrom(owner.address, account1.address, 1, 50, 0x000)).to.emit(hardhatToken, "TransferSingle").withArgs(owner.address, owner.address, account1.address, 1, 50);
        })
    })

    describe("Safe batch transfer from", async function () {

        it("should revert if caller is not token owner or approved", async function () {
            await expect(hardhatToken.connect(account1).safeBatchTransferFrom(owner.address, account2.address, [1, 2], [50, 5], 0x0000)).to.be.revertedWith("ERC1155: caller is not token owner or approved");
        })

        it("should revert if transfer to the zero address", async function () {
            await expect(hardhatToken.safeBatchTransferFrom(owner.address, "0x0000000000000000000000000000000000000000", [1, 2], [50, 5], 0x0000)).to.be.revertedWith("ERC1155: transfer to the zero address");
        })

        it("should revert if ids and amounts length mismatch", async function () {
            await expect(hardhatToken.safeBatchTransferFrom(owner.address, account2.address, [1, 2], [50, 5, 3], 0x0000)).to.be.revertedWith("ERC1155: ids and amounts length mismatch");
        })

        it("should revert if insufficient balance for transfer", async function () {
            await expect(hardhatToken.safeBatchTransferFrom(owner.address, account1.address, [1, 2], [5000, 60], 0x0000)).to.be.revertedWith("ERC1155: insufficient balance for transfer");
        })

        it("should transfer self token", async function () {
            await hardhatToken.mint(2, 100, { value: 100 })
            await hardhatToken.safeBatchTransferFrom(owner.address, account1.address, [1, 2], [50, 50], 0x0000);
            expect(await hardhatToken.balanceOf(account1.address, 1)).to.equal(50);
            expect(await hardhatToken.balanceOf(account1.address, 2)).to.equal(50);
        })

        it("should transfer allowed tokens", async function () {
            await hardhatToken.mint(2, 100, { value: 100 })
            await hardhatToken.setApprovalForAll(account1.address, true);
            await hardhatToken.connect(account1).safeBatchTransferFrom(owner.address, account2.address, [1, 2], [50, 50], 0x0000);
            expect(await hardhatToken.balanceOf(account2.address, 1)).to.equal(50);
            expect(await hardhatToken.balanceOf(account2.address, 2)).to.equal(50);
        })

        it("should emit event for safeBatchTransferFrom", async function () {
            await hardhatToken.mint(2, 100, { value: 100 });
            await hardhatToken.mint(3, 100, { value: 100 });
            await expect(hardhatToken.safeBatchTransferFrom(owner.address, account1.address, [2, 3], [50, 50], 0x000)).to.emit(hardhatToken, "TransferBatch").withArgs(owner.address, owner.address, account1.address, [2, 3], [50, 50]);
        })

    })
})