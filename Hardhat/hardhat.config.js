/** @type import('hardhat/config').HardhatUserConfig */
// require("@nomiclabs/hardhat-waffle")
require("hardhat-contract-sizer");
require("hardhat-gas-reporter");
require('hardhat-abi-exporter');
require("@nomicfoundation/hardhat-toolbox")
const INFURA_API_KEY = "78fd4749b45149edabbe0f70089d39bf";
const SEPOLIA_PRIVATE_KEY = "8674355dd1fec85bdf379cc14abe9eabd63f53495ea6d00c0757fc6d8e82d82a";

module.exports = {
  solidity: "0.8.18",
  contractSizer: {
    alphaSort: true,
    disambiguatePaths: false,
    runOnCompile: true,
    strict: true,
    // only: [':MarketPlace$'],
  },


  gasReporter: {
    currency: 'INR',
    gasPrice: 21,
    enabled: 'true',
    coinmarketcap: "e5fbf638-1fa1-45a5-9d56-9aeb0376a67f"

  },
  abiExporter: {
    path: './data/abi',
    runOnCompile: true,
    clear: true,
    flat: true,
    only: [':ERC721update$'],
    spacing: 2,
    pretty: false,
    // format: "minimal",
  },


  // module.exports = {
  //   // ...rest of the config...

  // };

  // Go to https://infura.io, sign up, create a new API key
  // in its dashboard, and replace "KEY" with it


  // Replace this private key with your Sepolia account private key
  // To export your private key from Coinbase Wallet, go to
  // Settings > Developer Settings > Show private key
  // To export your private key from Metamask, open Metamask and
  // go to Account Details > Export Private Key
  // Beware: NEVER put real Ether into testing accounts

  etherscan: {
    apiKey: "MXB62B2D6DBU5FH1TPQ6JDJVEZ52MXKGXV",
  },
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [SEPOLIA_PRIVATE_KEY],
    },
  },
};

