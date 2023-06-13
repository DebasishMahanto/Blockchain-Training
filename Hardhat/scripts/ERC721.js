const { ethers, run } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("Token721");
    const token = await Token.deploy("Token721", "tkn721");
    console.log("Token721 address:", token.address);

    // await token.deployTransaction.wait(5);

    // //verify

    // await hre.run("verify:verify", {
    //     address: token.address,
    //     contract: "contracts/ERC721.sol:ERC721", //Filename.sol:ClassName
    //     constructorArguments: ["demo", "dm"],
    // });
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

