//import Web3 from 'web3';
let web3;
let aAccounts;
let ERC20Contract;
const contractAddress = "0xD09e2e9C281dcFEb3371533aA640d64902203cDb";
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
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
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
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
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
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
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
        internalType: "uint256",
        name: "amount",
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
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "burnFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "subtractedValue",
        type: "uint256",
      },
    ],
    name: "decreaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "addedValue",
        type: "uint256",
      },
    ],
    name: "increaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
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
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
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
  {
    inputs: [],
    name: "totalSupply",
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
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
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
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

window.addEventListener("load", function () {
  console.log("metamask is installed");

  var connectButton = document.getElementById("connectButton");
  connectButton.addEventListener("click", async function () {
    await connect();
  });
});

async function connect() {
  return new Promise((resolve, reject) => {
    if (!window.ethereum) {
      console.log("metamask not found");
      reject("metamsk not found");
    }
    web3 = new Web3(window.ethereum);
    web3.eth.requestAccounts().then(function (accounts) {
      console.log("connected to metamask");
      console.log("user account:", accounts[0]);
      aAccounts = accounts;

      var accountElement = document.getElementById("account");
      accountElement.innerText = "connected Account: " + accounts[0];

      var confirmationElement = document.getElementById("confirmation");
      confirmationElement.innerText = "connection successfully";

      document.getElementById("connectButton").disabled = true;

      ERC20Contract = new web3.eth.Contract(contractAbi, contractAddress);
      tokenDetails();
      resolve(true);
    });
  }).catch((error) => {
    window.alert(error);
  });
}

async function tokenDetails() {
  const accounts = await web3.eth.getAccounts();
  var getName = document.getElementById("tokenName");
  getName.innerText =
    "Token Name: " + (await ERC20Contract.methods.name().call());

  var getSymbol = document.getElementById("tokenSymbol");
  getSymbol.innerText =
    "Token Symbol: " + (await ERC20Contract.methods.symbol().call());

  var getTotalSupply = document.getElementById("totalSupply");
  getTotalSupply.innerText =
    "Total Supply in wei: " +
    (await ERC20Contract.methods.totalSupply().call());

  var getBalance = document.getElementById("balanceId");
  getBalance.innerText =
    "Balance in wei: " +
    (await ERC20Contract.methods.balanceOf(accounts[0]).call());
}

async function mintToken() {
  try {
    if (!aAccounts) await connect();
    const amount = await document.getElementById("mintAmount").value;
    const accounts = await web3.eth.getAccounts();

    if (!emptyInputValidation(amount)) return;
    if (!inputAmountvalidation(amount)) return;

    nGasUsed = await ERC20Contract.methods
      .mint(aAccounts[0], amount)
      .estimateGas({ from: accounts[0] }, function () {});
    console.log(nGasUsed);
    await ERC20Contract.methods
      .mint(aAccounts[0], amount)
      .send({ from: accounts[0] });
    console.log("Tokens minted:", amount);
    tokenDetails();
  } catch (err) {
    // console.log(err);
    // window.alert(err);

    if (err.message.includes("User denied")) {
      alert("You rejected the transaction on Metamask!");
      console.log("You rejected the transaction on Metamask!");
    } else {
      alert(err);
      console.log(err);
    }
  }
}

// async function burnToken() {
//     try {
//         if (!aAccounts) await connect();

//         const amount = await document.getElementById('burnAmount').value;
//         const accounts = await web3.eth.getAccounts();
//         if (!emptyInputValidation(amount,)) return
//         if (!inputAmountvalidation(amount)) return

//         nGasUsed = await ERC20Contract.methods
//             .burn(amount)
//             .estimateGas({ from: accounts[0] }, function () { });
//         console.log(nGasUsed);
//         await ERC20Contract.methods.burn(amount).send({ from: accounts[0] });
//         console.log('token burned:', amount);
//         tokenDetails();

//     } catch (err) {
//         if (err.message.includes("User denied")) {
//             alert("You rejected the transaction on Metamask!")
//             console.log("You rejected the transaction on Metamask!")
//         } else {
//             alert((err.message).slice(0, 59))
//             console.log(err);
//         }
//     }
// }

async function transferToken() {
  try {
    if (!aAccounts) await connect();

    const amount = await document.getElementById("transferAmount").value;
    const receiverAddress = await document.getElementById("receiverAdd").value;
    const accounts = await web3.eth.getAccounts();

    if (!emptyInputValidation(amount)) return;
    if (!inputAmountvalidation(amount)) return;
    if (!addressValidation(receiverAddress)) return;
    //let element1 = document.getElementById("p-transferamount1");

    if (aAccounts[0] == receiverAddress) {
      alert("you are the receiver");
      return;
    }

    nGasUsed = await ERC20Contract.methods
      .transfer(receiverAddress, amount)
      .estimateGas({ from: accounts[0] }, function () {});
    console.log(nGasUsed);
    await ERC20Contract.methods
      .transfer(receiverAddress, amount)
      .send({ from: accounts[0] });
    console.log("token transferd");
    tokenDetails();
  } catch (err) {
    // console.log(err);
    // window.alert(err);
    if (err.message.includes("User denied")) {
      alert("You rejected the transaction on Metamask!");
      console.log("You rejected the transaction on Metamask!");
    } else {
      alert(err.message.slice(0, 64));
      console.log(err);
    }
  }
}

async function approveToken() {
  try {
    console.log(aAccounts);
    if (!aAccounts) {
      console.log("in if condition");
      await connect();
    }
    const amount = await document.getElementById("approvedQuantity").value;
    const spenderAddress = await document.getElementById("spenderAdd").value;
    if (!emptyInputValidation(amount)) return;
    if (!inputAmountvalidation(amount)) return;
    if (!addressValidation(spenderAddress)) return;
    if (aAccounts[0] == spenderAddress) {
      alert("you are the spender");
      return;
    }

    nGasUsed = await ERC20Contract.methods
      .approve(spenderAddress, amount)
      .estimateGas({ from: aAccounts[0] }, function () {});
    console.log(nGasUsed);
    await ERC20Contract.methods
      .approve(spenderAddress, amount)
      .send({ from: aAccounts[0] });
    console.log("token transferd");
  } catch (err) {
    // console.log(err);
    // window.alert(err);
    if (err.message.includes("User denied")) {
      alert("You rejected the transaction on Metamask!");
      console.log("You rejected the transaction on Metamask!");
    } else {
      alert(err.message.slice(0, 60));
      console.log(err);
    }
  }
}

async function aTransferFrom() {
  try {
    if (!aAccounts) await connect();
    const amount = await document.getElementById("numTransfer").value;
    const senderAddress = await document.getElementById("senderAdd").value;
    const receiverAddress = await document.getElementById("IDreceiverAdd")
      .value;
    console.log("receiver address:" + receiverAddress);
    if (!emptyInputValidation(amount)) return;
    if (!inputAmountvalidation(amount)) return;
    if (!addressValidation(senderAddress)) return;
    if (!addressValidation(receiverAddress)) return;
    if (senderAddress == receiverAddress) {
      alert("sender and receiver are same");
      return;
    }
    if (senderAddress == aAccounts[0]) {
      nGasUsed = await ERC20Contract.methods
        .transfer(receiverAddress, amount)
        .estimateGas({ from: aAccounts[0] }, function () {});
      console.log(nGasUsed);
      await ERC20Contract.methods
        .transfer(receiverAddress, amount)
        .send({ from: aAccounts[0] });
      console.log("token transferd");
      tokenDetails();
    } else {
      nGasUsed = await ERC20Contract.methods
        .transferFrom(senderAddress, receiverAddress, amount)
        .estimateGas({ from: aAccounts[0] }, function () {});
      console.log(nGasUsed);
      await ERC20Contract.methods
        .transferFrom(senderAddress, receiverAddress, amount)
        .send({ from: aAccounts[0] });
      console.log("token transferd");
      tokenDetails();
    }
  } catch (err) {
    if (err.message.includes("User denied")) {
      alert("You rejected the transaction on Metamask!");
    } else {
      alert(err);
    }
  }
}

async function allowanceCheck() {
  if (!aAccounts) connect();
  try {
    let tokenOwnerAddress = $("#ownerAdd").val();
    let approvalAddress = $("#IDspenderAdd").val();
    if (!web3.utils.isAddress(tokenOwnerAddress)) {
      alert("Please enter a valid owner address.");
      return;
    }
    if (!web3.utils.isAddress(approvalAddress)) {
      alert("Please enter a valid spender address.");
      return;
    }
    if (tokenOwnerAddress == approvalAddress) {
      alert("owner and spender are same");
      return;
    }

    let amount = await ERC20Contract.methods
      .allowance(tokenOwnerAddress, approvalAddress)
      .call();
    console.log(
      "allowance:",
      amount,
      "from:",
      tokenOwnerAddress,
      "to:",
      approvalAddress
    );
  } catch (error) {
    alert(error.message);
    console.error("Failed to transfer", error);
  }
}

function inputAmountvalidation(nAmount) {
  if (isNaN(nAmount) || nAmount <= 0 || !nAmount) {
    // $(sErrorMsg).text(
    //     "Entered value is not a number. Please check again properly"
    // );
    window.alert("entered value is not number");
    //$("label").show();
    return false;
  } else {
    return true;
  }
}

function emptyInputValidation(sInput) {
  if (sInput.length == 0) {
    // $(sErrorMsg).text("we can't proceed with empty value");
    window.alert("we can't proceed with empty value");
    // $("label").show();
    return false;
  } else {
    return true;
  }
}

function addressValidation(receiver) {
  if (!Web3.utils.isAddress(receiver)) {
    // $(sErrorMsg).text("invalid address");
    window.alert("invalid address");
    return false;
  } else {
    return true;
  }
}
