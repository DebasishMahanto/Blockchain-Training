const { ethers, run } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("MarketPlace");
    const token = await Token.deploy("0xB5a28D7eCfaD2451F1cE2effD7f06660Cd552541", "0x55c90eD6efF5153f883dA8Eb5a8ecB770a2352D4");
    console.log("Token address:", token.address);

    await token.deployTransaction.wait(5);

    //verify

    await hre.run("verify:verify", {
        address: token.address,
        contract: "contracts/MarketPlace.sol:MarketPlace", //Filename.sol:ClassName
        constructorArguments: ["0xB5a28D7eCfaD2451F1cE2effD7f06660Cd552541", "0x55c90eD6efF5153f883dA8Eb5a8ecB770a2352D4"],
    });
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
