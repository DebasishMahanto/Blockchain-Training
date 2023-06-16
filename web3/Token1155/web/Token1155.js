let web3;
let aAccounts;
let nGasUsed;
let ERC1155Contract;
let chainId;
let totalMinted;
let sepoliaChainId = 11155111;
const contractAddress = "0x464bFE19c261d77910184e1EA382B87528d6F607";
const contractAbi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "ids",
        type: "uint256[]",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "values",
        type: "uint256[]",
      },
    ],
    name: "TransferBatch",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "TransferSingle",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "value",
        type: "string",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    name: "URI",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "accounts",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "ids",
        type: "uint256[]",
      },
    ],
    name: "balanceOfBatch",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "quantity",
        type: "uint256",
      },
    ],
    name: "burn",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256[]",
        name: "ids",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "quentities",
        type: "uint256[]",
      },
    ],
    name: "burnBatch",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_owner",
        type: "address",
      },
    ],
    name: "getBalances",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    name: "isApprovedForAll",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "isTokenMinted",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    name: "isUsedURI",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "quantity",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "tokenURI",
        type: "string",
      },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256[]",
        name: "ids",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "quentities",
        type: "uint256[]",
      },
      {
        internalType: "string[]",
        name: "uries",
        type: "string[]",
      },
    ],
    name: "mintBatch",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256[]",
        name: "ids",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "amounts",
        type: "uint256[]",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "safeBatchTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalTokenMinted",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "uri",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

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
      ERC1155Contract = new web3.eth.Contract(contractAbi, contractAddress);

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
        totalMinted = await ERC1155Contract.methods.totalTokenMinted().call();

        await updateDetails();
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

async function balanceOfToken() {
  try {
    if (!checkNetwork()) return;

    if (!aAccounts) await connect();

    const owner = $("#BOOwnerAdd").val();
    const tokenId = $("#BOTokenId").val();

    if (!emptyInputValidation(tokenId)) return;
    if (!inputAmountvalidation(tokenId)) return;
    if (!emptyInputValidation(owner)) return;
    if (!addressValidation(owner)) return;

    let balance = await ERC1155Contract.methods
      .balanceOf(owner, tokenId)
      .call();
    Swal.fire({
      title: "Available Balance",
      text: balance,
    });
  } catch (err) {
    let oErrorJSON = JSON.parse(
      err.message.substr(err.message.indexOf("{"), err.message.lastIndexOf("}"))
    );

    // const msg = (err.message).slice(0, 73);
    Swal.fire({
      icon: "error",
      title: "Transaction Fail",
      text: oErrorJSON.originalError.message,
    });
    console.log(err);
  }
}

async function mintToken() {
  try {
    if (!checkNetwork()) return;

    if (!aAccounts) await connect();

    $(".btn-primary ").prop("disabled", true);
    $("#connectButton ").prop("disabled", true);

    Swal.fire({
      position: "center",
      icon: "info",
      title: "Wait!!.. Trasaction is proceed",
      showConfirmButton: false,
      timer: 2000,
    });

    const tokenId = $("#MTokenId").val();
    const quantity = $("#MQuantity").val();
    const tokenURI = $("#M-URI").val();

    if (!emptyInputValidation(tokenId)) return;
    if (!inputAmountvalidation(tokenId)) return;
    if (!emptyInputValidation(quantity)) return;
    if (!inputAmountvalidation(quantity)) return;

    console.log(await ERC1155Contract.methods.isTokenMinted(tokenId).call());

    if (!(await ERC1155Contract.methods.isTokenMinted(tokenId).call())) {
      if (!validateURI(tokenURI)) return;
      if (!(await checkURI(tokenURI))) return;
    } else {
      Swal.fire({
        icon: "info",
        title: "Token already minted",
        text: "This will minted on same details",
      });
    }

    try {
      nGasUsed = await ERC1155Contract.methods
        .mint(tokenId, quantity, tokenURI)
        .estimateGas({ from: aAccounts[0] }, function () {});
      console.log(nGasUsed);
    } catch (err) {
      let oErrorJSON = JSON.parse(
        err.message.substr(
          err.message.indexOf("{"),
          err.message.lastIndexOf("}")
        )
      );

      Swal.fire({
        icon: "error",
        title: "Transaction Fail",
        text: oErrorJSON.originalError.message,
      });
      console.log(err);
      $(".btn-primary ").prop("disabled", false);
      $("#connectButton ").prop("disabled", false);
      return;
    }

    await ERC1155Contract.methods
      .mint(tokenId, quantity, tokenURI)
      .send({ from: aAccounts[0] });
    console.log("minted successfully");
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Transaction Successfull",
      showConfirmButton: false,
      timer: 1500,
    });
    await updateDetails();
    $(".btn-primary ").prop("disabled", false);
    $("#connectButton ").prop("disabled", false);
  } catch (err) {
    if (err.message.includes("User denied")) {
      Swal.fire({
        icon: "error",
        title: "Transaction Fail",
        text: "You rejected the transaction on Metamask!",
      });
      $(".btn-primary ").prop("disabled", false);
      $("#connectButton ").prop("disabled", false);
      console.log("You rejected the transaction on Metamask!");
    } else {
      // let oErrorJSON = JSON.parse(
      //   err.message.substr(
      //     err.message.indexOf("{"),
      //     err.message.lastIndexOf("}")
      //   )
      // );

      // Swal.fire({
      //   icon: "error",
      //   title: "Transaction Fail",
      //   text: oErrorJSON.originalError.message,
      // });
      console.log(err);
      $(".btn-primary ").prop("disabled", false);
      $("#connectButton ").prop("disabled", false);
    }
  }
}

async function mintBatchToken() {
  try {
    if (!checkNetwork()) return;

    if (!aAccounts) await connect();

    $(".btn-primary ").prop("disabled", true);
    $("#connectButton ").prop("disabled", true);

    Swal.fire({
      position: "center",
      icon: "info",
      title: "Wait!!.. Trasaction is proceed",
      showConfirmButton: false,
      timer: 2000,
    });

    const tokenIdsInput = $("#arrayIds").val();
    const quantitiesInput = $("#arrayQuantities").val();
    const uriInput = $("#arrayURIes").val();

    if (!emptyInputValidation(tokenIdsInput)) return;
    if (!emptyInputValidation(quantitiesInput)) return;
    if (!emptyInputValidation(uriInput)) return;

    const tokenIds = tokenIdsInput.split(",").map(Number);
    const quantities = quantitiesInput.split(",").map(Number);
    const URIes = uriInput.split(",").map((str) => str.trim());

    if (!isValidArray(tokenIdsInput)) {
      Swal.fire({
        icon: "error",
        title: "Invalid input",
        text: "input only contain numbers separated by comma",
      });

      console.log("Invalid input format or non-numeric values");
      $(".btn-primary ").prop("disabled", false);
      $("#connectButton ").prop("disabled", false);
      return;
    }

    if (!isValidArray(quantitiesInput)) {
      Swal.fire({
        icon: "error",
        title: "Invalid input",
        text: "input only contain numbers separated by comma",
      });

      console.log("Invalid input format or non-numeric values");
      $(".btn-primary ").prop("disabled", false);
      $("#connectButton ").prop("disabled", false);
      return;
    }

    if (!checkURIArray(URIes)) return;

    if (!checkQuantities(quantities)) return;

    if (
      !(
        tokenIds.length == quantities.length &&
        quantities.length == URIes.length
      )
    ) {
      Swal.fire({
        icon: "error",
        title: "Invalid input",
        text: "ids, quantity & URIes length mismatched",
      });

      console.log("ids, quantity & URIes length mismatched");
      $(".btn-primary ").prop("disabled", false);
      $("#connectButton ").prop("disabled", false);
      return;
    }

    console.log("Array 1:", tokenIds);
    console.log("Array 2:", quantities);
    console.log("Array 3:", URIes);

    try {
      nGasUsed = await ERC1155Contract.methods
        .mintBatch(tokenIds, quantities, URIes)
        .estimateGas({ from: aAccounts[0] }, function () {});
      console.log(nGasUsed);
    } catch (arr) {
      let oErrorJSON = JSON.parse(
        err.message.substr(
          err.message.indexOf("{"),
          err.message.lastIndexOf("}")
        )
      );

      Swal.fire({
        icon: "error",
        title: "Transaction Fail",
        text: oErrorJSON.originalError.message,
      });
      $(".btn-primary ").prop("disabled", false);
      $("#connectButton ").prop("disabled", false);
      console.log(err);
      return;
    }

    await ERC1155Contract.methods
      .mintBatch(tokenIds, quantities, URIes)
      .send({ from: aAccounts[0] });
    console.log("minted successfully");
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Transaction Successfull",
      showConfirmButton: false,
      timer: 1500,
    });
    await updateDetails();
    $(".btn-primary ").prop("disabled", false);
    $("#connectButton ").prop("disabled", false);
  } catch (err) {
    if (err.message.includes("User denied")) {
      Swal.fire({
        icon: "error",
        title: "Transaction Fail",
        text: "You rejected the transaction on Metamask!",
      });
      $(".btn-primary ").prop("disabled", false);
      $("#connectButton ").prop("disabled", false);
      console.log("You rejected the transaction on Metamask!");
    } else {
      // let oErrorJSON = JSON.parse(
      //   err.message.substr(
      //     err.message.indexOf("{"),
      //     err.message.lastIndexOf("}")
      //   )
      // );

      Swal.fire({
        icon: "error",
        title: "Transaction Fail",
        text: err,
      });
      $(".btn-primary ").prop("disabled", false);
      $("#connectButton ").prop("disabled", false);
      console.log(err);
    }
  }
}

async function burnBatchToken() {
  try {
    if (!checkNetwork()) return;

    $(".btn-primary ").prop("disabled", true);
    $("#connectButton ").prop("disabled", true);
    if (!aAccounts) await connect();

    Swal.fire({
      position: "center",
      icon: "info",
      title: "Wait!!.. Trasaction is proceed",
      showConfirmButton: false,
      timer: 2000,
    });

    const tokenIdsInput = $("#BBarrayIds").val();
    const quantitiesInput = $("#BBarrayQuantities").val();

    if (!emptyInputValidation(tokenIdsInput)) return;
    if (!emptyInputValidation(quantitiesInput)) return;

    if (!isValidArray(tokenIdsInput)) {
      Swal.fire({
        icon: "error",
        title: "Invalid input",
        text: "input only contain numbers separated by comma",
      });

      console.log("Invalid input format or non-numeric values");
      $(".btn-primary ").prop("disabled", false);
      $("#connectButton ").prop("disabled", false);
      return;
    }

    if (!isValidArray(quantitiesInput)) {
      Swal.fire({
        icon: "error",
        title: "Invalid input",
        text: "input only contain numbers separated by comma",
      });

      console.log("Invalid input format or non-numeric values");
      $(".btn-primary ").prop("disabled", false);
      $("#connectButton ").prop("disabled", false);
      return;
    }

    const tokenIds = tokenIdsInput.split(",").map(Number);
    const quantities = quantitiesInput.split(",").map(Number);

    if (tokenIds.length != quantities.length) {
      Swal.fire({
        icon: "error",
        title: "Invalid input",
        text: "ids and quantity length mismatched",
      });

      console.log("ids and quantity length mismatched");
      $(".btn-primary ").prop("disabled", false);
      $("#connectButton ").prop("disabled", false);
      return;
    }

    console.log("Array 1:", tokenIds);
    console.log("Array 2:", quantities);

    try {
      nGasUsed = await ERC1155Contract.methods
        .burnBatch(tokenIds, quantities)
        .estimateGas({ from: aAccounts[0] }, function () {});
      console.log(nGasUsed);
    } catch (err) {
      let oErrorJSON = JSON.parse(
        err.message.substr(
          err.message.indexOf("{"),
          err.message.lastIndexOf("}")
        )
      );

      Swal.fire({
        icon: "error",
        title: "Transaction Fail",
        text: oErrorJSON.originalError.message,
      });
      $(".btn-primary ").prop("disabled", false);
      $("#connectButton ").prop("disabled", false);
      console.log(err);
      return;
    }

    await ERC1155Contract.methods
      .burnBatch(tokenIds, quantities)
      .send({ from: aAccounts[0] });
    console.log("successfully burned");
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Transaction Successfull",
      showConfirmButton: false,
      timer: 1500,
    });
    await updateDetails();
    $(".btn-primary ").prop("disabled", false);
    $("#connectButton ").prop("disabled", false);
  } catch (err) {
    if (err.message.includes("User denied")) {
      Swal.fire({
        icon: "error",
        title: "Transaction Fail",
        text: "You rejected the transaction on Metamask!",
      });
      console.log("You rejected the transaction on Metamask!");
      $(".btn-primary ").prop("disabled", false);
      $("#connectButton ").prop("disabled", false);
    } else {
      // let oErrorJSON = JSON.parse(
      //   err.message.substr(
      //     err.message.indexOf("{"),
      //     err.message.lastIndexOf("}")
      //   )
      // );

      // Swal.fire({
      //   icon: "error",
      //   title: "Transaction Fail",
      //   text: oErrorJSON.originalError.message,
      // });
      $(".btn-primary ").prop("disabled", false);
      $("#connectButton ").prop("disabled", false);
      console.log(err);
    }
  }
}

async function burnToken() {
  try {
    if (!checkNetwork()) return;

    if (!aAccounts) await connect();
    $(".btn-primary ").prop("disabled", true);
    $("#connectButton ").prop("disabled", true);

    Swal.fire({
      position: "center",
      icon: "info",
      title: "Wait!!.. Trasaction is proceed",
      showConfirmButton: false,
      timer: 2000,
    });

    const tokenId = $("#BTokenId").val();
    const quantity = $("#BQuantity").val();

    if (!emptyInputValidation(tokenId)) return;
    if (!inputAmountvalidation(tokenId)) return;
    if (!emptyInputValidation(quantity)) return;
    if (!inputAmountvalidation(quantity)) return;

    try {
      nGasUsed = await ERC1155Contract.methods
        .burn(tokenId, quantity)
        .estimateGas({ from: aAccounts[0] }, function () {});
      console.log(nGasUsed);
    } catch (err) {
      let oErrorJSON = JSON.parse(
        err.message.substr(
          err.message.indexOf("{"),
          err.message.lastIndexOf("}")
        )
      );
      Swal.fire({
        icon: "error",
        title: "Transaction Fail",
        text: oErrorJSON.originalError.message,
      });
      $(".btn-primary ").prop("disabled", false);
      $("#connectButton ").prop("disabled", false);
      console.log(err);
      return;
    }

    await ERC1155Contract.methods
      .burn(tokenId, quantity)
      .send({ from: aAccounts[0] });
    console.log("successfully burned");
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Transaction Successfull",
      showConfirmButton: false,
      timer: 1500,
    });
    await updateDetails();
    $(".btn-primary ").prop("disabled", false);
    $("#connectButton ").prop("disabled", false);
  } catch (err) {
    if (err.message.includes("User denied")) {
      Swal.fire({
        icon: "error",
        title: "Transaction Fail",
        text: "You rejected the transaction on Metamask!",
      });
      $(".btn-primary ").prop("disabled", false);
      $("#connectButton ").prop("disabled", false);
      console.log("You rejected the transaction on Metamask!");
    } else {
      // let oErrorJSON = JSON.parse(
      //   err.message.substr(
      //     err.message.indexOf("{"),
      //     err.message.lastIndexOf("}")
      //   )
      // );
      // Swal.fire({
      //   icon: "error",
      //   title: "Transaction Fail",
      //   text: oErrorJSON.originalError.message,
      // });
      $(".btn-primary ").prop("disabled", false);
      $("#connectButton ").prop("disabled", false);
      console.log(err);
    }
  }
}

async function setApprovalForAllToken() {
  try {
    if (!checkNetwork()) return;

    if (!aAccounts) await connect();
    $(".btn-primary ").prop("disabled", true);
    $("#connectButton ").prop("disabled", true);

    Swal.fire({
      position: "center",
      icon: "info",
      title: "Wait!!.. Trasaction is proceed",
      showConfirmButton: false,
      timer: 2000,
    });

    const spenderAdd = $("#SAFASpender").val();
    const IsApproved =
      $("input[name='IsApprovedForAll']:checked").val() === "true"
        ? true
        : false;

    if (!emptyInputValidation(spenderAdd)) return;
    if (!addressValidation(spenderAdd)) return;

    if (aAccounts[0] == spenderAdd) {
      Swal.fire({
        icon: "error",
        title: "Check Properly",
        text: "you are the spender",
      });
      $(".btn-primary ").prop("disabled", false);
      $("#connectButton ").prop("disabled", false);
      return;
    }

    try {
      nGasUsed = await ERC1155Contract.methods
        .setApprovalForAll(spenderAdd, IsApproved)
        .estimateGas({ from: aAccounts[0] });
      console.log(nGasUsed);
    } catch (err) {
      let oErrorJSON = JSON.parse(
        err.message.substr(
          err.message.indexOf("{"),
          err.message.lastIndexOf("}")
        )
      );

      Swal.fire({
        icon: "error",
        title: "Transaction Fail",
        text: oErrorJSON.originalError.message,
      });
      $(".btn-primary ").prop("disabled", false);
      $("#connectButton ").prop("disabled", false);
      console.log(err);
      return;
    }

    await ERC1155Contract.methods
      .setApprovalForAll(spenderAdd, IsApproved)
      .send({ from: aAccounts[0] });
    console.log("All token approved successfully");
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Transaction Successfull",
      showConfirmButton: false,
      timer: 1500,
    });
    $(".btn-primary ").prop("disabled", false);
    $("#connectButton ").prop("disabled", false);
  } catch (err) {
    if (err.message.includes("User denied")) {
      Swal.fire({
        icon: "error",
        title: "Transaction Fail",
        text: "You rejected the transaction on Metamask!",
      });
      $(".btn-primary ").prop("disabled", false);
      $("#connectButton ").prop("disabled", false);
      console.log("You rejected the transaction on Metamask!");
    } else {
      // const msg = (err.message).slice(0, 73);
      // let oErrorJSON = JSON.parse(
      //   err.message.substr(
      //     err.message.indexOf("{"),
      //     err.message.lastIndexOf("}")
      //   )
      // );

      // Swal.fire({
      //   icon: "error",
      //   title: "Transaction Fail",
      //   text: oErrorJSON.originalError.message,
      // });
      $(".btn-primary ").prop("disabled", false);
      $("#connectButton ").prop("disabled", false);
      console.log(err);
    }
  }
}

async function safeTransferFromToken() {
  try {
    if (!checkNetwork()) return;

    if (!aAccounts) await connect();
    $(".btn-primary ").prop("disabled", true);
    $("#connectButton ").prop("disabled", true);

    Swal.fire({
      position: "center",
      icon: "info",
      title: "Wait!!.. Trasaction is proceed",
      showConfirmButton: false,
      timer: 2000,
    });

    const senderAdd = $("#STFSender").val();
    const receiverAdd = $("#STFReceiver").val();
    const tokenId = $("#STFTokenId").val();
    const quantity = $("#STFQuantity").val();
    if (!emptyInputValidation(senderAdd)) return;
    if (!addressValidation(senderAdd)) return;
    if (!emptyInputValidation(receiverAdd)) return;
    if (!addressValidation(receiverAdd)) return;
    if (!emptyInputValidation(tokenId)) return;
    if (!inputAmountvalidation(tokenId)) return;
    if (!emptyInputValidation(quantity)) return;
    if (!inputAmountvalidation(quantity)) return;
    if (senderAdd == receiverAdd) {
      Swal.fire({
        icon: "error",
        title: "Check Properly",
        text: "sender and receiver are same",
      });
      $(".btn-primary ").prop("disabled", false);
      $("#connectButton ").prop("disabled", false);
      return;
    }

    try {
      nGasUsed = await ERC1155Contract.methods
        .safeTransferFrom(senderAdd, receiverAdd, tokenId, quantity)
        .estimateGas({ from: aAccounts[0] }, function () {});
      console.log(nGasUsed);
    } catch (err) {
      let oErrorJSON = JSON.parse(
        err.message.substr(
          err.message.indexOf("{"),
          err.message.lastIndexOf("}")
        )
      );

      Swal.fire({
        icon: "error",
        title: "Transaction Fail",
        text: oErrorJSON.originalError.message,
      });
      $(".btn-primary ").prop("disabled", false);
      $("#connectButton ").prop("disabled", false);
      console.log(err);
      return;
    }

    await ERC1155Contract.methods
      .safeTransferFrom(senderAdd, receiverAdd, tokenId, quantity)
      .send({ from: aAccounts[0] });
    console.log("token transfer successfully");
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Transaction Successfull",
      showConfirmButton: false,
      timer: 1500,
    });
    $(".btn-primary ").prop("disabled", false);
    $("#connectButton ").prop("disabled", false);
    await updateDetails();
  } catch (err) {
    if (err.message.includes("User denied")) {
      Swal.fire({
        icon: "error",
        title: "Transaction Fail",
        text: "You rejected the transaction on Metamask!",
      });
      $(".btn-primary ").prop("disabled", false);
      $("#connectButton ").prop("disabled", false);
      console.log("You rejected the transaction on Metamask!");
    } else {
      // let oErrorJSON = JSON.parse(
      //   err.message.substr(
      //     err.message.indexOf("{"),
      //     err.message.lastIndexOf("}")
      //   )
      // );

      // Swal.fire({
      //   icon: "error",
      //   title: "Transaction Fail",
      //   text: oErrorJSON.originalError.message,
      // });
      $(".btn-primary ").prop("disabled", false);
      $("#connectButton ").prop("disabled", false);
      console.log(err);
    }
  }
}

async function safeBatchTransferFromToken() {
  try {
    if (!checkNetwork()) return;

    if (!aAccounts) await connect();
    $(".btn-primary ").prop("disabled", true);
    $("#connectButton ").prop("disabled", true);

    Swal.fire({
      position: "center",
      icon: "info",
      title: "Wait!!.. Trasaction is proceed",
      showConfirmButton: false,
      timer: 2000,
    });

    const senderAdd = $("#SBTFSender").val();
    const receiverAdd = $("#SBTFReceiver").val();

    const tokenIdsInput = $("#SBTFarrayIds").val();
    const quantitiesInput = $("#SBTFarrayQuantities").val();

    if (!emptyInputValidation(senderAdd)) return;
    if (!addressValidation(senderAdd)) return;
    if (!emptyInputValidation(receiverAdd)) return;
    if (!addressValidation(receiverAdd)) return;
    if (!emptyInputValidation(tokenIdsInput)) return;
    if (!emptyInputValidation(quantitiesInput)) return;
    if (senderAdd == receiverAdd) {
      Swal.fire({
        icon: "error",
        title: "Check Properly",
        text: "sender and receiver are same",
      });
      $(".btn-primary ").prop("disabled", false);
      $("#connectButton ").prop("disabled", false);
      return;
    }

    if (!isValidArray(tokenIdsInput)) {
      Swal.fire({
        icon: "error",
        title: "Invalid input",
        text: "input only contain numbers separated by comma",
      });
      $(".btn-primary ").prop("disabled", false);
      $("#connectButton ").prop("disabled", false);

      console.log("Invalid input format or non-numeric values");
      return;
    }

    if (!isValidArray(quantitiesInput)) {
      Swal.fire({
        icon: "error",
        title: "Invalid input",
        text: "input only contain numbers separated by comma",
      });
      $(".btn-primary ").prop("disabled", false);
      $("#connectButton ").prop("disabled", false);

      console.log("Invalid input format or non-numeric values");
      return;
    }

    const tokenIds = tokenIdsInput.split(",").map(Number);
    const quantities = quantitiesInput.split(",").map(Number);

    if (tokenIds.length != quantities.length) {
      Swal.fire({
        icon: "error",
        title: "Invalid input",
        text: "ids and quantity length mismatched",
      });

      console.log("ids and quantity length mismatched");
      $(".btn-primary ").prop("disabled", false);
      $("#connectButton ").prop("disabled", false);
      return;
    }

    console.log("Array 1:", tokenIds);
    console.log("Array 2:", quantities);

    try {
      nGasUsed = await ERC1155Contract.methods
        .safeBatchTransferFrom(
          senderAdd,
          receiverAdd,
          tokenIds,
          quantities,
          "0x00"
        )
        .estimateGas({ from: aAccounts[0] }, function () {});
      console.log(nGasUsed);
    } catch (err) {
      let oErrorJSON = JSON.parse(
        err.message.substr(
          err.message.indexOf("{"),
          err.message.lastIndexOf("}")
        )
      );
      Swal.fire({
        icon: "error",
        title: "Transaction Fail",
        text: oErrorJSON.originalError.message,
      });
      $(".btn-primary ").prop("disabled", false);
      $("#connectButton ").prop("disabled", false);
      console.log(err);
      return;
    }

    await ERC1155Contract.methods
      .safeBatchTransferFrom(
        senderAdd,
        receiverAdd,
        tokenIds,
        quantities,
        "0x00"
      )
      .send({ from: aAccounts[0] });
    console.log("token transfer successfully");
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Transaction Successfull",
      showConfirmButton: false,
      timer: 1500,
    });
    await updateDetails();
    $(".btn-primary ").prop("disabled", false);
    $("#connectButton ").prop("disabled", false);
  } catch (err) {
    if (err.message.includes("User denied")) {
      Swal.fire({
        icon: "error",
        title: "Transaction Fail",
        text: "You rejected the transaction on Metamask!",
      });
      $(".btn-primary ").prop("disabled", false);
      $("#connectButton ").prop("disabled", false);
      console.log("You rejected the transaction on Metamask!");
    } else {
      // let oErrorJSON = JSON.parse(
      //   err.message.substr(
      //     err.message.indexOf("{"),
      //     err.message.lastIndexOf("}")
      //   )
      // );
      // Swal.fire({
      //   icon: "error",
      //   title: "Transaction Fail",
      //   text: oErrorJSON.originalError.message,
      // });
      $(".btn-primary ").prop("disabled", false);
      $("#connectButton ").prop("disabled", false);
      console.log(err);
    }
  }
}

async function showToken() {
  try {
    let uri;
    let id;
    if (!checkNetwork()) return;

    if (!aAccounts) await connect();

    let myTokens = await ERC1155Contract.methods
      .getBalances(aAccounts[0])
      .call();
    if (myTokens.length == 0) {
      Swal.fire({
        icon: "error",
        title: "You have no NFT ",
      });
      $(".btn-primary ").prop("disabled", false);
      $("#connectButton ").prop("disabled", false);
      return;
    }

    $(".btn-primary ").prop("disabled", true);
    $("#connectButton ").prop("disabled", true);
    $("#showTokens").empty();

    Swal.fire({
      position: "center",
      icon: "info",
      title: "Wait!!.. your NFT will listed bellow",
      showConfirmButton: false,
      timer: 2000,
    });

    // let myTokens = await ERC721Contract.methods
    //   .getBalances(aAccounts[0])
    //   .call();

    for (let count = 0; count < myTokens.length; count++) {
      try {
        id = myTokens[count];

        let quantity = await ERC1155Contract.methods
          .balanceOf(aAccounts[0], id)
          .call();

        uri = await ERC1155Contract.methods.uri(id).call();
        let response;
        try {
          response = await fetch(uri);
        } catch (err) {
          console.log(err);
          continue;
        }

        let jsonData = await response.json();

        $("#showTokens").append(
          `<div id=${id} class="card" style="width: 15rem;">
                  <img src="${jsonData.image}" class="card-img-top" alt="...">
                  <div class="card-body">
                    <h5 class="card-title">ID: ${id}</h5>
                    <h5 class="card-title">Name: ${jsonData.name}</h5>
                    <h5 class="card-title">Quantity: ${quantity}</h5>
                    <p class="card-text">Description: ${jsonData.description}</p>
                    
                  </div>
                </div>`
        );
      } catch (err) {
        console.log(err);
        continue;
      }
    }
    $(".btn-primary ").prop("disabled", false);
    $("#connectButton ").prop("disabled", false);
  } catch (err) {
    if (err.message.includes("User denied")) {
      Swal.fire({
        icon: "error",
        title: "Transaction Fail",
        text: "You rejected the transaction on Metamask!",
      });
      $(".btn-primary ").prop("disabled", false);
      $("#connectButton ").prop("disabled", false);
      console.log("You rejected the transaction on Metamask!");
    } else {
      // let oErrorJSON = JSON.parse(
      //   err.message.substr(
      //     err.message.indexOf("{"),
      //     err.message.lastIndexOf("}")
      //   )
      // );
      Swal.fire({
        icon: "error",
        title: "Transaction Fail",
        text: err,
      });
      $(".btn-primary ").prop("disabled", false);
      $("#connectButton ").prop("disabled", false);
      console.log(err);
    }
  }
}

function addressValidation(receiver) {
  if (!web3.utils.isAddress(receiver)) {
    Swal.fire({
      icon: "error",
      title: "Invalid Address",
      text: "enter valid address",
    });
    $(".btn-primary ").prop("disabled", false);
    $("#connectButton ").prop("disabled", false);
    return false;
  } else {
    return true;
  }
}

function inputAmountvalidation(nAmount) {
  if (isNaN(nAmount) || !nAmount) {
    Swal.fire({
      icon: "error",
      title: "Value is not number",
      text: "enter valid number",
    });
    $(".btn-primary ").prop("disabled", false);
    $("#connectButton ").prop("disabled", false);
    return false;
  } else {
    return true;
  }
}

function emptyInputValidation(sInput) {
  if (!sInput.length) {
    Swal.fire({
      icon: "error",
      title: "Empty value",
      text: "we cant proceed with empty value",
    });
    $(".btn-primary ").prop("disabled", false);
    $("#connectButton ").prop("disabled", false);
    return false;
  } else {
    return true;
  }
}

function isValidArray(input) {
  // Check if the input matches the required format and contains only numeric values
  const regex = /^\d+(,\d+)*$/;
  return regex.test(input);
}

async function checkNetwork() {
  try {
    chainId = await web3.eth.getChainId();

    if (chainId !== sepoliaChainId) {
      let newChainId = "0x" + sepoliaChainId.toString(16);
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: newChainId }],
      });
      return true;
    } else {
      await updateDetails();
      // $("#network").text("ChainId: " + chainId);
      return true;
    }
  } catch (error) {
    console.log("Error:", error);
    if (error.code === 4001) {
      console.log(error.code);
      Swal.fire({
        icon: "warning",
        title:
          "you have changed your Network to another. Please select sepolia ",
      });
      return false;
    }
  }
}

function checkQuantities(array) {
  // console.log("hhhhh");
  for (let i = 0; i < array.length; i++) {
    if (array[i] == 0) {
      Swal.fire({
        icon: "error",
        title: "Invalid input",
        text: "you enterd zero quantity",
      });
      return false;
    }
  }
  return true;
}

function validateURI(uri) {
  try {
    new URL(uri);
    return true; // URI is valid
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Invalid URI",
      text: "Enter valid URI",
    });
    $(".btn-primary ").prop("disabled", false);
    $("#connectButton ").prop("disabled", false);
    return false; // URI is invalid
  }
}

async function checkURI(_tokenURI) {
  if (await ERC1155Contract.methods.isUsedURI(_tokenURI).call()) {
    Swal.fire({
      icon: "error",
      title: "Invalid URI",
      text: "URI exist in another token",
    });
    $(".btn-primary ").prop("disabled", false);
    $("#connectButton ").prop("disabled", false);
    return false;
  } else {
    return true;
  }
}

async function checkURIArray(uriArray) {
  for (let count = 0; count < uriArray.length; count++) {
    if (!validateURI(uriArray[count])) {
      Swal.fire({
        icon: "error",
        title: `URI ${count + 1} is Invalid`,
        text: "Enter valid URI",
      });
      return false;
    }
  }
  return true;
}

async function updateDetails() {
  totalMinted = await ERC1155Contract.methods.totalTokenMinted().call();

  $("#confirmation").html(`Connected successfully`);
  $("#account").html(`Connected account: ${aAccounts[0]}`);
  $("#totalTokenMintedId").html(`Total token minted: ${totalMinted}`);
  $("#showTokens").empty();
}
