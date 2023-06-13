let web3;
let aAccounts;
let nGasUsed;
let ERC721Contract;
let sepoliaChainId = 11155111;
const contractAddress = "0xf6C356356d3d4fAB1C93f64393164beFDD09E9Ea";
const contractAbi = [
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "symbol",
                "type": "string"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "approved",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "Approval",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "operator",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "bool",
                "name": "approved",
                "type": "bool"
            }
        ],
        "name": "ApprovalForAll",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "_fromTokenId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "_toTokenId",
                "type": "uint256"
            }
        ],
        "name": "BatchMetadataUpdate",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "_tokenId",
                "type": "uint256"
            }
        ],
        "name": "MetadataUpdate",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "_tokenId",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "burn",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "getApproved",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "operator",
                "type": "address"
            }
        ],
        "name": "isApprovedForAll",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "tokenURI",
                "type": "string"
            }
        ],
        "name": "mint",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "ownerOf",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "safeTransferFrom",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            },
            {
                "internalType": "bytes",
                "name": "data",
                "type": "bytes"
            }
        ],
        "name": "safeTransferFrom",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "operator",
                "type": "address"
            },
            {
                "internalType": "bool",
                "name": "approved",
                "type": "bool"
            }
        ],
        "name": "setApprovalForAll",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes4",
                "name": "interfaceId",
                "type": "bytes4"
            }
        ],
        "name": "supportsInterface",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "symbol",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "tokenURI",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]



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

            $("#confirmation").html(`Connected successfully`);
            $("#account").html(`Connected account: ${accounts[0]}`);

            aAccounts = accounts;
            ERC721Contract = new web3.eth.Contract(contractAbi, contractAddress);
            await contractInfo();

        })

        web3.eth.currentProvider.on("accountsChanged", async function (accounts) {
            if (accounts.length === 0) {
                location.reload();
            } else {
                aAccounts = accounts;
                $("#account").text("Address: " + accounts[0]);
                $("#confirmation").text('connected successfully');
                await contractInfo();


            }
        });

        web3.eth.currentProvider.on("chainChanged", async function (newChainId) {
            newChainId = await web3.eth.getChainId();
            $("#network").text("ChainId: " + newChainId);
            await contractInfo();

        });

        $("#connectButton").text("Disconnect MetaMask");
        $("#connectButton").unbind("click", function () {
            connect();
        });
        setTimeout(() => {
            $("#connectButton").bind("click", function () {
                disconnect();
            });
        }, 1000);



        resolve(true);

    }).catch(error => {
        Swal.fire({
            icon: 'error',
            title: 'Metamask not found',
            text: 'install metamask',
        })
        console.log(error);
    })
}

function disconnect() {
    location.reload();
}

async function contractInfo() {
    try {
        console.log(ERC721Contract);
        let TokenName = await ERC721Contract.methods.name().call();
        console.log(TokenName);

        let Symbol = await ERC721Contract.methods.symbol().call();

        let Balance = await ERC721Contract.methods.balanceOf(aAccounts[0]).call();

        $("#tokenName").html(`Token Name: ${TokenName}`);
        $("#tokenSymbol").html(`Token Symbol: ${Symbol}`);
        $("#balance").html(`My Balance: ${Balance}`);
        let maxTId = await ERC721Contract.methods._tokenId().call();
        console.log(maxTId);
    } catch (error) {
        console.log(error);
    }
}

async function mintToken() {
    try {
        if (!checkNetwork()) return;
        if (!aAccounts) await connect();

        const tokenURI = $("#M-URI").val();


        if (!validateURI(tokenURI)) return;

        if (!checkURI(tokenURI)) return;

        nGasUsed = await ERC721Contract.methods
            .mint(tokenURI)
            .estimateGas({ from: aAccounts[0] });
        console.log(nGasUsed);

        await ERC721Contract.methods.mint(tokenURI).send({ from: aAccounts[0] });
        console.log("minted successfully");
        contractInfo();
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Transaction Successfull',
            showConfirmButton: false,
            timer: 1500
        })
    } catch (err) {
        if (err.message.includes("User denied")) {
            Swal.fire({
                icon: 'error',
                title: 'Transaction Fail',
                text: 'You rejected the transaction on Metamask!',
            })
            console.log("You rejected the transaction on Metamask!")
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Transaction Fail',
                text: 'err',
            })
            console.log(err);
        }
    }
}

async function burnToken() {
    try {
        if (!aAccounts) await connect();
        const tokenId = $("#burnId").val();
        if (!emptyInputValidation(tokenId,)) return
        if (!inputAmountvalidation(tokenId)) return

        nGasUsed = await ERC721Contract.methods
            .burn(tokenId)
            .estimateGas({ from: aAccounts[0] }, function () { });
        console.log(nGasUsed);

        await ERC721Contract.methods.burn(tokenId).send({ from: aAccounts[0] });
        console.log("burn successfully");
        contractInfo();
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Transaction Successfull',
            showConfirmButton: false,
            timer: 1500
        })

    } catch (err) {
        if (err.message.includes("User denied")) {
            Swal.fire({
                icon: 'error',
                title: 'Transaction Fail',
                text: 'You rejected the transaction on Metamask!',
            })
            console.log("You rejected the transaction on Metamask!")
        } else {
            //alert((err.message).slice(0, 45))
            const msg = (err.message).slice(0, 45);
            Swal.fire({
                icon: 'error',
                title: 'Transaction Fail',
                text: msg,
            })
            console.log(err);
        }
    }
}

async function ownerOfToken() {
    try {
        if (!aAccounts) await connect();

        const tokenId = $("#BOTokenId").val();

        if (!emptyInputValidation(tokenId,)) return
        if (!inputAmountvalidation(tokenId)) return

        let owner = await ERC721Contract.methods.ownerOf(tokenId).call();
        Swal.fire({
            //icon: 'error',
            title: 'owner is',
            text: owner,
        })

    } catch (err) {
        if (err.message.includes("User denied")) {
            Swal.fire({
                icon: 'error',
                title: 'Transaction Fail',
                text: 'You rejected the transaction on Metamask!',
            })
            console.log("You rejected the transaction on Metamask!")
        } else {
            //alert((err.message).slice(0, 65))
            const msg = (err.message).slice(0, 73);
            Swal.fire({
                icon: 'error',
                title: 'Transaction Fail',
                text: msg,
            })
            console.log(err);
        }
    }
}

async function approveToken() {
    try {
        if (!aAccounts) await connect();
        const spenderAdd = $("#approveSpender").val();
        const tokenId = $("#approveTokenId").val();
        if (!addressValidation(spenderAdd)) return
        if (!emptyInputValidation(tokenId,)) return
        if (!inputAmountvalidation(tokenId)) return
        if (aAccounts[0] == spenderAdd) {
            //alert("you are the spender")
            Swal.fire({
                icon: 'error',
                title: 'Check Properly',
                text: 'you are the spender',
            })
            return
        }
        nGasUsed = await ERC721Contract.methods
            .approve(spenderAdd, tokenId)
            .estimateGas({ from: aAccounts[0] }, function () { });
        console.log(nGasUsed);

        await ERC721Contract.methods.approve(spenderAdd, tokenId).send({ from: aAccounts[0] });
        console.log("token approved successfully");
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Transaction Successfull',
            showConfirmButton: false,
            timer: 1500
        })

    } catch (err) {
        if (err.message.includes("User denied")) {
            Swal.fire({
                icon: 'error',
                title: 'Transaction Fail',
                text: 'You rejected the transaction on Metamask!',
            })
            console.log("You rejected the transaction on Metamask!")
        } else {
            //alert((err.message).slice(0, 65))
            const msg = (err.message).slice(0, 73);
            Swal.fire({
                icon: 'error',
                title: 'Transaction Fail',
                text: msg,
            })
            console.log(err);
        }
    }
}


async function setApprovalForAllToken() {
    try {
        if (!aAccounts) await connect();
        const spenderAdd = $("#SAFASpender").val();
        const IsApproved = $("input[name='IsApprovedForAll']:checked").val() === "true" ? true : false;
        let radioButtons = document.querySelectorAll('input[name="IsApprovedForAll"]');
        if (!addressValidation(spenderAdd)) return
        if (!radioButtons[0].checked && !radioButtons[1].checked) {
            Swal.fire({
                icon: 'error',
                title: 'Select Option',
                text: 'select approve or revoke as your need',
            })
            return;
        }
        if (aAccounts[0] == spenderAdd) {
            // alert("you are the spender")
            Swal.fire({
                icon: 'error',
                title: 'Check Properly',
                text: 'you are the spender',
            })
            return
        }
        if (await ERC721Contract.methods.balanceOf(aAccounts[0]).call() == 0) {
            Swal.fire({
                icon: 'error',
                title: 'FAIL!!',
                text: 'you have no token for approve',
            })
            return
        }
        nGasUsed = await ERC721Contract.methods
            .setApprovalForAll(spenderAdd, IsApproved)
            .estimateGas({ from: aAccounts[0] }, function () { });
        console.log(nGasUsed);

        await ERC721Contract.methods.setApprovalForAll(spenderAdd, IsApproved).send({ from: aAccounts[0] });
        console.log("All token approved successfully");
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Transaction Successfull',
            showConfirmButton: false,
            timer: 1500
        })

    } catch (err) {
        if (err.message.includes("User denied")) {
            Swal.fire({
                icon: 'error',
                title: 'Transaction Fail',
                text: 'You rejected the transaction on Metamask!',
            })
            console.log("You rejected the transaction on Metamask!")
        } else {
            // alert((err.message).slice(0, 59))
            const msg = (err.message).slice(0, 73);
            Swal.fire({
                icon: 'error',
                title: 'Transaction Fail',
                text: msg,
            })
            console.log(err);
        }
    }
}

async function transferFromToken() {
    try {
        if (!aAccounts) await connect();

        const senderAdd = $("#TFSender").val();
        const receiverAdd = $("#TFReceiver").val();
        const tokenId = $("#TFTokenId").val();

        if (!addressValidation(senderAdd)) return
        if (!addressValidation(receiverAdd)) return
        if (!emptyInputValidation(tokenId,)) return
        if (!inputAmountvalidation(tokenId)) return
        if (senderAdd == receiverAdd) {
            Swal.fire({
                icon: 'error',
                title: 'Check Properly',
                text: 'sender and receiver are same',
            })
        }

        nGasUsed = await ERC721Contract.methods
            .transferFrom(senderAdd, receiverAdd, tokenId)
            .estimateGas({ from: aAccounts[0] }, function () { });
        console.log(nGasUsed);

        await ERC721Contract.methods.transferFrom(senderAdd, receiverAdd, tokenId).send({ from: aAccounts[0] });
        console.log("token transfer successfully");

        contractInfo();

        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Transaction Successfull',
            showConfirmButton: false,
            timer: 1500
        })

    } catch (err) {
        if (err.message.includes("User denied")) {
            Swal.fire({
                icon: 'error',
                title: 'Transaction Fail',
                text: 'You rejected the transaction on Metamask!',
            })

            console.log("You rejected the transaction on Metamask!")
        } else {
            //alert((err.message).slice(0, 59))
            const msg = (err.message).slice(0, 73);
            Swal.fire({
                icon: 'error',
                title: 'Transaction Fail',
                text: msg,
            })
            console.log(err);
        }
    }
}

async function safeTransferFromToken() {
    try {
        if (!aAccounts) await connect();
        const senderAdd = $("#STFSender").val();
        const receiverAdd = $("#STFReceiver").val();
        const tokenId = $("#STFTokenId").val();
        if (!addressValidation(senderAdd)) return
        if (!addressValidation(receiverAdd)) return
        if (!emptyInputValidation(tokenId,)) return
        if (!inputAmountvalidation(tokenId)) return
        if (senderAdd == receiverAdd) {
            // alert("sender and receiver are same")
            Swal.fire({
                icon: 'error',
                title: 'Check Properly',
                text: 'sender and receiver are same',
            })
            return
        }
        nGasUsed = await ERC721Contract.methods
            .safeTransferFrom(senderAdd, receiverAdd, tokenId)
            .estimateGas({ from: aAccounts[0] }, function () { });
        console.log(nGasUsed);

        await ERC721Contract.methods.safeTransferFrom(senderAdd, receiverAdd, tokenId).send({ from: aAccounts[0] });
        console.log("token transfer successfully");
        contractInfo();
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Transaction Successfull',
            showConfirmButton: false,
            timer: 1500
        })

    } catch (err) {
        if (err.message.includes("User denied")) {
            Swal.fire({
                icon: 'error',
                title: 'Transaction Fail',
                text: 'You rejected the transaction on Metamask!',
            })
            console.log("You rejected the transaction on Metamask!")
        } else {
            // alert((err.message).slice(0, 59))
            const msg = (err.message).slice(0, 73);
            Swal.fire({
                icon: 'error',
                title: 'Transaction Fail',
                text: msg,
            })
            console.log(err);
        }
    }
}

async function showToken() {
    let maxTId = await ERC721Contract.methods._tokenId().call();

    for (let id = 0; id <= maxTId; id++) {
        try {
            let owner = await ERC721Contract.methods.ownerOf(id).call();
            let uri = await ERC721Contract.methods.tokenURI(id).call();
            if (owner == aAccounts[0]) {
                $("#showTokens").append(`<img src=${uri} class="card-img-top" alt="..." style= width:25%>`);

            }
        } catch (err) {
            continue;
        }
    }


}



function addressValidation(receiver) {
    if (!web3.utils.isAddress(receiver)) {
        // $(sErrorMsg).text("invalid address");
        //window.alert("invalid address");
        Swal.fire({
            icon: 'error',
            title: 'Invalid Address',
            text: 'enter valid address',
        })
        return false;
    } else {
        return true;
    }

}

function inputAmountvalidation(nAmount) {
    if (isNaN(nAmount) || nAmount < 0 || !nAmount) {
        // $(sErrorMsg).text(
        //     "Entered value is not a number. Please check again properly"
        // );
        //window.alert("entered value is not number");
        //$("label").show();
        Swal.fire({
            icon: 'error',
            title: 'Value is not number',
            text: 'enter valid number',
        })
        return false;
    } else {
        return true;
    }
}

function emptyInputValidation(sInput) {
    if (!sInput.length) {
        // $(sErrorMsg).text("we can't proceed with empty value");
        // window.alert("we can't proceed with empty value")
        // $("label").show();
        Swal.fire({
            icon: 'error',
            title: 'Empty value',
            text: 'we cant proceed with empty value',
        })
        return false;
    } else {
        return true;
    }
}

function validateURI(uri) {
    try {
        new URL(uri);
        return true; // URI is valid
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Invalid URI',
            text: 'Enter valid URI',
        })
        return false; // URI is invalid
    }
}

async function checkURI(_tokenURI) {

    let maxTId = await ERC721Contract.methods._tokenId().call();

    for (let id = 1; id <= maxTId; i++) {
        if (await ERC721Contract.methods.tokenURI(id).call() == _tokenURI) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid URI',
                text: 'URI exist in another token',
            })
            return false;

        }
    }
    return true;
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
            $("#network").text("ChainId: " + chainId);
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