let web3;
let aAccounts;
let nGasUsed;
let Contract;
let chainId;
let sepoliaChainId = 11155111;

async function connect() {
  return new Promise(async (resolve, reject) => {
    if (!window.ethereum) {
      console.log("metamask not found");
      reject("Metamask not found");
    }
    web3 = new Web3(window.ethereum);
    web3.eth.requestAccounts().then(async function (accounts) {
      console.log("connected to metamask");
      console.log("user account:", accounts[0]);

      aAccounts = accounts;
      ERC721Contract = new web3.eth.Contract(ERC721Abi, ERC721Address);
      ERC1155Contract = new web3.eth.Contract(ERC1155Abi, ERC1155Address);
      MarketContract = new web3.eth.Contract(MarketAbi, MArketAddress);

      await updateDetails();

      //   totalMinted = await ERC1155Contract.methods.totalTokenMinted().call();

      //   $("#confirmation").html(`Connected successfully`);
      //   $("#account").html(`Connected account: ${accounts[0]}`);
      //   $("#totalTokenMintedId").html(`Total token minted: ${totalMinted}`);
    });

    web3.eth.currentProvider.on("accountsChanged", async function (accounts) {
      if (accounts.length === 0) {
        location.reload();
      } else {
        aAccounts = accounts;
        await updateDetails();
        // totalMinted = await ERC1155Contract.methods.totalTokenMinted().call();

        // $("#confirmation").html(`Connected successfully`);
        // $("#account").html(`Connected account: ${accounts[0]}`);
        // $("#totalTokenMintedId").html(`Total token minted: ${totalMinted}`);
      }
    });

    // web3.eth.currentProvider.on("chainChanged", async function (newChainId) {
    //     newChainId = await web3.eth.getChainId();
    //     $("#network").text("ChainId: " + newChainId);
    // });

    $("#connectButton").unbind("click", function () {
      connect();
    });
    $("#connectButton").text("Disconnect MetaMask");
    setTimeout(() => {
      $("#connectButton").bind("click", function () {
        disconnect();
      });
    }, 0);

    resolve(true);
  }).catch((error) => {
    Swal.fire({
      icon: "error",
      title: "Metamask not found",
      text: "install metamask",
    });
    console.log(error);
  });
}

function disconnect() {
  location.reload();
}
