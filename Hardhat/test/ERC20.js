const {expect}=require("chai");
const { ethers } = require("hardhat");

describe("ERC20 contract",function(){
    let token;
    let hardhatToken;
    let owner;
    let account1;
    let account2;
    let accounts;

    let tokenName_="demoToken";
    let tokenSymbol_="DT";
    let decimal_=18;
    let totalSupply_=1000;


    beforeEach(async function(){
        token=await ethers.getContractFactory("ERC20");
        [owner,account1,account2,...accounts]=await ethers.getSigners();
        hardhatToken= await token.deploy(tokenName_,tokenSymbol_,decimal_,totalSupply_);
    });

    describe("Deployement",function(){

        it("should set right owner",async function(){
            expect(await hardhatToken.owner()).to.equal(owner.address);
        });

        
        it ("should name set properly",async function(){
            expect(await hardhatToken.name()).to.equal(tokenName_);
        })
        
        it ("should symbol set properly",async function(){
            expect(await hardhatToken.symbol()).to.equal(tokenSymbol_);
        })
        
        it ("should decimal set properly",async function(){
            expect(await hardhatToken.decimals()).to.equal(decimal_);
        })
        
        it ("should total supply set properly",async function(){
            expect(await hardhatToken.totalSupply()).to.equal(totalSupply_);
        })
        
        it("should total supply assign to owner",async function(){
            const ownerBalance= await hardhatToken.balanceOf(owner.address);
            //console.log("ownerBAlance:",ownerBalance);
            //console.log("total supply:",await hardhatToken.totalSupply());
            expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
        });
        

    })

    describe("Mint Token", function(){

        it ("should revert for zero quantity to mint",async function(){
            expect (hardhatToken.mint(0)).to.be.revertedWith("ERC20: quantity should something");
        })

        it ("should mint exact amount",async function(){
            const initialOwnerBalance= parseInt(await hardhatToken.balanceOf(owner.address));
            await hardhatToken.mint(100);
            expect (await hardhatToken.balanceOf(owner.address)).to.equal(initialOwnerBalance+100);

        })
        
        it ("should only owner mint",async function(){
            expect( hardhatToken.connect(account1).mint(100)).to.be.revertedWith("ERC20: only owner can access");
            
        })

        it ("should mint in owner account",async function(){
            const initialOwnerBalance= parseInt(await hardhatToken.balanceOf(owner.address));
            await hardhatToken.mint(100);
            expect (await hardhatToken.balanceOf(owner.address)).to.equal(initialOwnerBalance+100);
    
        })

        it("should update total supply",async function(){
            const initialTotalSupply=parseInt(await hardhatToken.totalSupply());
            await hardhatToken.mint(100);
            expect(await hardhatToken.totalSupply()).to.equal(initialTotalSupply+100);
        })

        it ("should emit event for mint",async function(){
            await expect(hardhatToken.mint(100)).to.emit(hardhatToken,"Transfer").withArgs("0x0000000000000000000000000000000000000000",owner.address,100);
        })

        
    })

    describe("transfer",function(){

        it ("should transfer token between accounts",async function(){
            await hardhatToken.transfer(account1.address,10);
            expect(await hardhatToken.balanceOf(account1.address)).to.equal(10);

            await hardhatToken.connect(account1).transfer(account2.address, 2);
            const account2Balance = await hardhatToken.balanceOf(account2.address);
            expect(account2Balance).to.equal(2);
        })


        it ("should revert if sender have insufficient token",async function(){
            const initialOwnerBalance = await hardhatToken.balanceOf(owner.address); 
            const initialAccountBalance = await hardhatToken.balanceOf(account1.address); 
            
            await expect(hardhatToken.connect(account1).transfer(owner.address,100)).to.be.revertedWith("LunaERC20: insufficient tokens to transfer");

            expect(await hardhatToken.balanceOf(owner.address)).to.equal(initialOwnerBalance);
            expect(await hardhatToken.balanceOf(account1.address)).to.equal(initialAccountBalance);
        })

        it ("should reverted for zero receiver addrss", async function(){
            await expect(hardhatToken.transfer("0x0000000000000000000000000000000000000000",100)).to.be.revertedWith("ERC20: receiver address can not be zero");

        })

        it ("should reverted for invalid quantity",async function(){
            await expect(hardhatToken.transfer(account1.address,0)).to.be.revertedWith("ERC20: quantity should not zero");
        })

        it("should update balnce after transactions",async function(){
            const initialOwnerBalance=await hardhatToken.balanceOf(owner.address);
            await hardhatToken.transfer(account1.address,100);
            await hardhatToken.transfer(account2.address,100);

            expect(hardhatToken.balanceOf(owner.address)==initialOwnerBalance-200);

            expect(await hardhatToken.balanceOf(account1.address)).to.equal(100);
            expect(await hardhatToken.balanceOf(account2.address)).to.equal(100);

        })

        it("should event emit for transfer",async function(){
            await expect(hardhatToken.transfer(account1.address,100)).to.emit(hardhatToken,"Transfer").withArgs(owner.address,account1.address,100);
        })

    })

    describe("approve and allowance", async function(){

        it ("should reverted if spender address is zero", async function(){
            await expect(hardhatToken.approve("0x0000000000000000000000000000000000000000",100)).to.be.revertedWith("ERC20: spender address can not zero");
        })

        it ("should reverted if zero number of token to be approve", async function(){
            await expect(hardhatToken.approve(account1.address,0)).to.be.revertedWith("ERC20: quantity should not zero");
        })
        
        it ("should reverted if owner have insufficient token to be approve", async function(){
            await expect(hardhatToken.connect(account1).approve(account2.address,100)).to.be.revertedWith("ERC20: insufficient tokens to approve");
        })

        it("should set the allowance to the given value to the given address",async function(){
            await hardhatToken.approve(account1.address,100);
            expect (await hardhatToken.allowance(owner.address,account1.address)).to.equal(100);
        })

        it("should emit event for approval", async function () {
            await expect(hardhatToken.approve(account1.address,100)).to.emit(hardhatToken, "Approval").withArgs(owner.address, account1.address,100);
        })

    })

    describe("transforFrom",function(){

        it("should reverted if sender address is zero",async function(){
            await hardhatToken.approve(account1.address,100);
            await expect(hardhatToken.transferFrom("0x0000000000000000000000000000000000000000", account2.address,100)).to.be.revertedWith("ERC20: sender address zero");
        })

        it("should reverted if receiver address is zero",async function(){
            await hardhatToken.approve(account1.address,100);
            await expect(hardhatToken.transferFrom(account1.address,"0x0000000000000000000000000000000000000000",10)).to.be.revertedWith("ERC20: receiver address zero");
        })
        
        it("should reverted if amount to transfer is zero",async function(){
            await hardhatToken.approve(account1.address,100);
            await expect(hardhatToken.transferFrom(account1.address,account2.address,0)).to.be.revertedWith("ERC20: quantity to transfer zero");
        })

        it("should reverted if spender have unsufficent allowed token",async function(){
            await hardhatToken.approve(account1.address,100);
            await expect(hardhatToken.transferFrom(account1.address,account2.address,200)).to.be.revertedWith("ERC20: insufficient allowed tokens");
        })

        it("should spender use owner token using transferFrom",async function(){
            await hardhatToken.approve(account1.address,500);
            await hardhatToken.connect(account1).transferFrom(owner.address,account2.address,100);
            expect(await hardhatToken.balanceOf(account2.address)).to.equal(100);
        })

        it("should update token quantity of owner and receiver", async function(){
           // const initialOwnerBalance=hardhatToken.balanceOf(owner.address);
            //const initialAccount2Balance=hardhatToken.balanceOf(account2.address);

            await hardhatToken.approve(account1.address,1000);
            await hardhatToken.connect(account1).transferFrom(owner.address,account2.address,1000);
            
            //const finalOwnerBalance=await hardhatToken.balanceOf(owner.address);

            expect(await hardhatToken.allowance(owner.address, account1.address)).to.equal(0);
            expect(await hardhatToken.balanceOf(owner.address)).to.equal(0);
            expect(await hardhatToken.balanceOf(account2.address)).to.equal(1000);
        })

        it("should emit event for transferFrom", async function () {
            await hardhatToken.approve(account1.address,500);
            // await hardhatToken.connect(account1).transferFrom(owner.address,account2.address,100);
            await expect(hardhatToken.connect(account1).transferFrom(owner.address, account2.address, 150)).to.emit(hardhatToken, "Transfer").withArgs(owner.address, account2.address, 150);

        })

    })

    describe("burn", async function(){

        it ("should only owner can burn",async function(){
           await expect( hardhatToken.connect(account1).burn(100)).to.be.revertedWith("ERC20: only owner can access");

        })

        it ("should revert if zero quantity to burn",async function(){
            await expect (hardhatToken.burn(0)).to.be.revertedWith("ERC20:number of token to burn is zero");
        })

        it("should revert if owner have insufficient token", async function(){
            await expect (hardhatToken.burn(1005)).to.be.revertedWith("LunaERC20: insufficient tokens to burn");
        })

        it ("should burn token successfully and update token amount of owner", async function(){
            await hardhatToken.burn(500);
            expect(await hardhatToken.balanceOf(owner.address)).to.equal(500);
        })

        it("should emit event for burn", async function () {
            await expect(hardhatToken.burn(500)).to.emit(hardhatToken, "Transfer").withArgs(owner.address, "0x0000000000000000000000000000000000000000",500);

        })
  
  
    })



})