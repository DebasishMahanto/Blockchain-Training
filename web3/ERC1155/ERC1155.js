let web3;
let aAccounts;
let nGasUsed;
let ERC1155Contract;
let chainId;
let sepoliaChainId = 11155111;
const contractAddress = "0xf232db07B9B52684755892f596C731e1EC963276";
const contractAbi = [
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "uri",
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
                "name": "account",
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
                "indexed": true,
                "internalType": "address",
                "name": "operator",
                "type": "address"
            },
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
                "indexed": false,
                "internalType": "uint256[]",
                "name": "ids",
                "type": "uint256[]"
            },
            {
                "indexed": false,
                "internalType": "uint256[]",
                "name": "values",
                "type": "uint256[]"
            }
        ],
        "name": "TransferBatch",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "operator",
                "type": "address"
            },
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
                "indexed": false,
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "TransferSingle",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "string",
                "name": "value",
                "type": "string"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            }
        ],
        "name": "URI",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
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
                "internalType": "address[]",
                "name": "accounts",
                "type": "address[]"
            },
            {
                "internalType": "uint256[]",
                "name": "ids",
                "type": "uint256[]"
            }
        ],
        "name": "balanceOfBatch",
        "outputs": [
            {
                "internalType": "uint256[]",
                "name": "",
                "type": "uint256[]"
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
            },
            {
                "internalType": "uint256",
                "name": "quantity",
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
                "internalType": "uint256[]",
                "name": "ids",
                "type": "uint256[]"
            },
            {
                "internalType": "uint256[]",
                "name": "quantities",
                "type": "uint256[]"
            }
        ],
        "name": "burnBatch",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
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
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "quantity",
                "type": "uint256"
            }
        ],
        "name": "mint",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256[]",
                "name": "ids",
                "type": "uint256[]"
            },
            {
                "internalType": "uint256[]",
                "name": "quentities",
                "type": "uint256[]"
            }
        ],
        "name": "mintBatch",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
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
                "internalType": "uint256[]",
                "name": "ids",
                "type": "uint256[]"
            },
            {
                "internalType": "uint256[]",
                "name": "amounts",
                "type": "uint256[]"
            },
            {
                "internalType": "bytes",
                "name": "data",
                "type": "bytes"
            }
        ],
        "name": "safeBatchTransferFrom",
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
                "name": "id",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "amount",
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
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "uri",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
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
        chainId = await web3.eth.getChainId();

        web3.eth.requestAccounts().then(async function (accounts) {
            console.log("connected to metamask");
            console.log("user account:", accounts[0]);

            $("#confirmation").html(`Connected successfully`);
            $("#account").html(`Connected account: ${accounts[0]}`);
            $("#connectButton").attr("disabled", true);

            aAccounts = accounts;
            ERC1155Contract = new web3.eth.Contract(contractAbi, contractAddress);

        })

        await checkNetwork();

        // if (chainId !== sepoliaChainId) {
        //     let newChainId = "0x" + sepoliaChainId.toString(16);
        //     await window.ethereum.request({
        //         method: "wallet_switchEthereumChain",
        //         params: [{ chainId: newChainId }],
        //     });
        // } else {
        //     $("#network").text("ChainId: " + chainId);
        // }

        web3.eth.currentProvider.on("accountsChanged", function (accounts) {
            if (accounts.length === 0) {
                location.reload();
            } else {
                aAccounts = accounts;
                $("#account").text("Address: " + accounts[0]);
                $("#confirmation").text('connected successfully');

            }
        });

        web3.eth.currentProvider.on("chainChanged", async function (newChainId) {
            newChainId = await web3.eth.getChainId();
            $("#network").text("ChainId: " + newChainId);
        });

        resolve(true);

    }).catch(error => {
        Swal.fire({
            icon: 'error',
            title: 'Metamask not found',
            text: 'install metamask',
        })
    })
}

async function balanceOfToken() {
    try {
        await checkNetwork();
        if (!aAccounts) await connect();

        const owner = $("#BOOwnerAdd").val();
        const tokenId = $("#BOTokenId").val();

        if (!emptyInputValidation(tokenId,)) return
        if (!inputAmountvalidation(tokenId)) return
        if (!emptyInputValidation(owner)) return
        if (!addressValidation(owner)) return

        let balance = await ERC1155Contract.methods.balanceOf(owner, tokenId).call();
        Swal.fire({
            title: 'Available Balance',
            text: balance,
        })

    } catch (err) {
        const msg = (err.message).slice(0, 73);
        Swal.fire({
            icon: 'error',
            title: 'Transaction Fail',
            text: msg,
        })
        console.log(err);
    }

}

async function mintToken() {
    try {
        await checkNetwork();
        if (!aAccounts) await connect();
        $(".my-button").prop("disabled", true);

        Swal.fire({
            position: 'center',
            icon: 'info',
            title: 'Wait!!.. Trasaction is proceed',
            showConfirmButton: false,
            timer: 2000
        })

        const tokenId = $("#MTokenId").val();
        const quantity = $("#MQuantity").val();

        if (!emptyInputValidation(tokenId)) return
        if (!inputAmountvalidation(tokenId)) return
        if (!emptyInputValidation(quantity)) return
        if (!inputAmountvalidation(quantity)) return

        nGasUsed = await ERC1155Contract.methods
            .mint(tokenId, quantity)
            .estimateGas({ from: aAccounts[0] }, function () { });
        console.log(nGasUsed);

        await ERC1155Contract.methods.mint(tokenId, quantity).send({ from: aAccounts[0] });
        console.log("minted successfully");
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Transaction Successfull',
            showConfirmButton: false,
            timer: 1500
        })
        $(".my-button").prop("disabled", false);

    } catch (err) {
        if (err.message.includes("User denied")) {
            Swal.fire({
                icon: 'error',
                title: 'Transaction Fail',
                text: 'You rejected the transaction on Metamask!',
            })
            $(".my-button").prop("disabled", false);
            console.log("You rejected the transaction on Metamask!")
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Transaction Fail',
                text: err,
            })
            console.log(err);
            $(".my-button").prop("disabled", false);
        }
    }
}

async function mintBatchToken() {
    try {
        await checkNetwork();
        if (!aAccounts) await connect();
        $(".my-button").prop("disabled", true);

        Swal.fire({
            position: 'center',
            icon: 'info',
            title: 'Wait!!.. Trasaction is proceed',
            showConfirmButton: false,
            timer: 2000
        })

        const tokenIdsInput = $("#arrayIds").val();
        const quantitiesInput = $("#arrayQuantities").val();

        if (!emptyInputValidation(tokenIdsInput)) return
        if (!emptyInputValidation(quantitiesInput)) return

        const tokenIds = tokenIdsInput.split(',').map(Number);
        const quantities = quantitiesInput.split(',').map(Number);

        // const array1Error = $("#array1Error").val();
        // const array2Error = $("#array2Error").val();


        // array1Error.textContent = '';
        // array2Error.textContent = '';

        if (!isValidArray(tokenIdsInput)) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid input',
                text: "input only contain numbers separated by comma",
            })

            console.log("Invalid input format or non-numeric values")
            $(".my-button").prop("disabled", false);
            return;
        }

        if (!isValidArray(quantitiesInput)) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid input',
                text: "input only contain numbers separated by comma",
            })

            console.log("Invalid input format or non-numeric values")
            $(".my-button").prop("disabled", false);
            return;
        }



        console.log('Array 1:', tokenIds);
        console.log('Array 2:', quantities);

        nGasUsed = await ERC1155Contract.methods
            .mintBatch(tokenIds, quantities)
            .estimateGas({ from: aAccounts[0] }, function () { });
        console.log(nGasUsed);

        await ERC1155Contract.methods.mintBatch(tokenIds, quantities).send({ from: aAccounts[0] });
        console.log("minted successfully");
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Transaction Successfull',
            showConfirmButton: false,
            timer: 1500
        })
        $(".my-button").prop("disabled", false);
    } catch (err) {
        if (err.message.includes("User denied")) {
            Swal.fire({
                icon: 'error',
                title: 'Transaction Fail',
                text: 'You rejected the transaction on Metamask!',
            })
            $(".my-button").prop("disabled", false);
            console.log("You rejected the transaction on Metamask!")
        } else if (err.message.includes("ids and amounts length mismatch")) {
            Swal.fire({
                icon: 'error',
                title: 'Transaction Fail',
                text: 'ids and amounts length mismatch',
            })
            $(".my-button").prop("disabled", false);
            console.log("ids and amounts length mismatch")
        }
        else {
            Swal.fire({
                icon: 'error',
                title: 'Transaction Fail',
                text: err,
            })
            $(".my-button").prop("disabled", false);
            console.log(err);
        }
    }
}

async function burnBatchToken() {
    try {
        await checkNetwork();
        $(".my-button").prop("disabled", true);
        if (!aAccounts) await connect();

        Swal.fire({
            position: 'center',
            icon: 'info',
            title: 'Wait!!.. Trasaction is proceed',
            showConfirmButton: false,
            timer: 2000
        })

        const tokenIdsInput = $("#BBarrayIds").val();
        const quantitiesInput = $("#BBarrayQuantities").val();

        if (!emptyInputValidation(tokenIdsInput)) return
        if (!emptyInputValidation(quantitiesInput)) return

        if (!isValidArray(tokenIdsInput)) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid input',
                text: "input only contain numbers separated by comma",
            })

            console.log("Invalid input format or non-numeric values")
            $(".my-button").prop("disabled", false);
            return;
        }

        if (!isValidArray(quantitiesInput)) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid input',
                text: "input only contain numbers separated by comma",
            })

            console.log("Invalid input format or non-numeric values")
            $(".my-button").prop("disabled", false);
            return;
        }

        const tokenIds = tokenIdsInput.split(',').map(Number);
        const quantities = quantitiesInput.split(',').map(Number);

        console.log('Array 1:', tokenIds);
        console.log('Array 2:', quantities);

        nGasUsed = await ERC1155Contract.methods
            .burnBatch(tokenIds, quantities)
            .estimateGas({ from: aAccounts[0] }, function () { });
        console.log(nGasUsed);

        await ERC1155Contract.methods.burnBatch(tokenIds, quantities).send({ from: aAccounts[0] });
        console.log("successfully burned");
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Transaction Successfull',
            showConfirmButton: false,
            timer: 1500
        })
        $(".my-button").prop("disabled", false);
    } catch (err) {
        if (err.message.includes("User denied")) {
            Swal.fire({
                icon: 'error',
                title: 'Transaction Fail',
                text: 'You rejected the transaction on Metamask!',
            })
            console.log("You rejected the transaction on Metamask!")
            $(".my-button").prop("disabled", false);
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Transaction Fail',
                text: err,
            })
            $(".my-button").prop("disabled", false);
            console.log(err);
        }
    }
}

async function burnToken() {
    try {
        await checkNetwork();
        if (!aAccounts) await connect();
        $(".my-button").prop("disabled", true);

        Swal.fire({
            position: 'center',
            icon: 'info',
            title: 'Wait!!.. Trasaction is proceed',
            showConfirmButton: false,
            timer: 2000
        })

        const tokenId = $("#BTokenId").val();
        const quantity = $("#BQuantity").val();

        if (!emptyInputValidation(tokenId)) return
        if (!inputAmountvalidation(tokenId)) return
        if (!emptyInputValidation(quantity)) return
        if (!inputAmountvalidation(quantity)) return

        nGasUsed = await ERC1155Contract.methods
            .burn(tokenId, quantity)
            .estimateGas({ from: aAccounts[0] }, function () { });
        console.log(nGasUsed);

        await ERC1155Contract.methods.burn(tokenId, quantity).send({ from: aAccounts[0] });
        console.log("successfully burned");
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Transaction Successfull',
            showConfirmButton: false,
            timer: 1500
        })
        $(".my-button").prop("disabled", false);

    } catch (err) {
        if (err.message.includes("User denied")) {
            Swal.fire({
                icon: 'error',
                title: 'Transaction Fail',
                text: 'You rejected the transaction on Metamask!',
            })
            $(".my-button").prop("disabled", false);
            console.log("You rejected the transaction on Metamask!")
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Transaction Fail',
                text: err,
            })
            $(".my-button").prop("disabled", false);
            console.log(err);
        }
    }
}

async function setApprovalForAllToken() {
    try {
        await checkNetwork();
        if (!aAccounts) await connect();
        $(".my-button").prop("disabled", true);

        Swal.fire({
            position: 'center',
            icon: 'info',
            title: 'Wait!!.. Trasaction is proceed',
            showConfirmButton: false,
            timer: 2000
        })

        const spenderAdd = $("#SAFASpender").val();
        const IsApproved = $("input[name='IsApprovedForAll']:checked").val() === "true" ? true : false;
        let radioButtons = document.querySelectorAll('input[name="IsApprovedForAll"]');

        if (!emptyInputValidation(spenderAdd)) return
        if (!addressValidation(spenderAdd)) return
        if (!radioButtons[0].checked && !radioButtons[1].checked) {
            Swal.fire({
                icon: 'error',
                title: 'Select Option',
                text: 'select approve or revoke as your need',
            })
            $(".my-button").prop("disabled", false);
            return;
        }
        if (aAccounts[0] == spenderAdd) {
            Swal.fire({
                icon: 'error',
                title: 'Check Properly',
                text: 'you are the spender',
            })
            $(".my-button").prop("disabled", false);
            return
        }

        nGasUsed = await ERC1155Contract.methods
            .setApprovalForAll(spenderAdd, IsApproved)
            .estimateGas({ from: aAccounts[0] }, function () { });
        console.log(nGasUsed);

        await ERC1155Contract.methods.setApprovalForAll(spenderAdd, IsApproved).send({ from: aAccounts[0] });
        console.log("All token approved successfully");
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Transaction Successfull',
            showConfirmButton: false,
            timer: 1500
        })
        $(".my-button").prop("disabled", false);

    } catch (err) {
        if (err.message.includes("User denied")) {
            Swal.fire({
                icon: 'error',
                title: 'Transaction Fail',
                text: 'You rejected the transaction on Metamask!',
            })
            $(".my-button").prop("disabled", false);
            console.log("You rejected the transaction on Metamask!")
        } else {
            const msg = (err.message).slice(0, 73);
            Swal.fire({
                icon: 'error',
                title: 'Transaction Fail',
                text: msg,
            })
            $(".my-button").prop("disabled", false);
            console.log(err);
        }
    }
}

async function safeTransferFromToken() {
    try {
        await checkNetwork();
        if (!aAccounts) await connect();
        $(".my-button").prop("disabled", true);

        Swal.fire({
            position: 'center',
            icon: 'info',
            title: 'Wait!!.. Trasaction is proceed',
            showConfirmButton: false,
            timer: 2000
        })

        const senderAdd = $("#STFSender").val();
        const receiverAdd = $("#STFReceiver").val();
        const tokenId = $("#STFTokenId").val();
        const quantity = $("#STFQuantity").val();
        if (!emptyInputValidation(senderAdd)) return
        if (!addressValidation(senderAdd)) return
        if (!emptyInputValidation(receiverAdd)) return
        if (!addressValidation(receiverAdd)) return
        if (!emptyInputValidation(tokenId)) return
        if (!inputAmountvalidation(tokenId)) return
        if (!emptyInputValidation(quantity)) return
        if (!inputAmountvalidation(quantity)) return
        if (senderAdd == receiverAdd) {
            Swal.fire({
                icon: 'error',
                title: 'Check Properly',
                text: 'sender and receiver are same',
            })
            $(".my-button").prop("disabled", false);
            return
        }
        nGasUsed = await ERC1155Contract.methods
            .safeTransferFrom(senderAdd, receiverAdd, tokenId, quantity, "0x00")
            .estimateGas({ from: aAccounts[0] }, function () { });
        console.log(nGasUsed);

        await ERC1155Contract.methods.safeTransferFrom(senderAdd, receiverAdd, tokenId, quantity, "0x00").send({ from: aAccounts[0] });
        console.log("token transfer successfully");
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Transaction Successfull',
            showConfirmButton: false,
            timer: 1500
        })
        $(".my-button").prop("disabled", false);

    } catch (err) {
        if (err.message.includes("User denied")) {
            Swal.fire({
                icon: 'error',
                title: 'Transaction Fail',
                text: 'You rejected the transaction on Metamask!',
            })
            $(".my-button").prop("disabled", false);
            console.log("You rejected the transaction on Metamask!")
        } else {
            const msg = (err.message).slice(0, 73);
            Swal.fire({
                icon: 'error',
                title: 'Transaction Fail',
                text: msg,
            })
            $(".my-button").prop("disabled", false);
            console.log(err);
        }
    }
}

async function safeBatchTransferFromToken() {
    try {
        await checkNetwork();
        if (!aAccounts) await connect();
        $(".my-button").prop("disabled", true);

        Swal.fire({
            position: 'center',
            icon: 'info',
            title: 'Wait!!.. Trasaction is proceed',
            showConfirmButton: false,
            timer: 2000
        })

        const senderAdd = $("#SBTFSender").val();
        const receiverAdd = $("#SBTFReceiver").val();

        const tokenIdsInput = $("#SBTFarrayIds").val();
        const quantitiesInput = $("#SBTFarrayQuantities").val();

        if (!emptyInputValidation(senderAdd)) return
        if (!addressValidation(senderAdd)) return
        if (!emptyInputValidation(receiverAdd)) return
        if (!addressValidation(receiverAdd)) return
        if (!emptyInputValidation(tokenIdsInput)) return
        if (!emptyInputValidation(quantitiesInput)) return
        if (senderAdd == receiverAdd) {
            Swal.fire({
                icon: 'error',
                title: 'Check Properly',
                text: 'sender and receiver are same',
            })
            $(".my-button").prop("disabled", false);
            return
        }

        if (!isValidArray(tokenIdsInput)) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid input',
                text: "input only contain numbers separated by comma",
            })
            $(".my-button").prop("disabled", false);

            console.log("Invalid input format or non-numeric values")
            return;
        }

        if (!isValidArray(quantitiesInput)) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid input',
                text: "input only contain numbers separated by comma",
            })
            $(".my-button").prop("disabled", false);

            console.log("Invalid input format or non-numeric values")
            return;
        }

        const tokenIds = tokenIdsInput.split(',').map(Number);
        const quantities = quantitiesInput.split(',').map(Number);

        console.log('Array 1:', tokenIds);
        console.log('Array 2:', quantities);

        nGasUsed = await ERC1155Contract.methods
            .safeBatchTransferFrom(senderAdd, receiverAdd, tokenIds, quantities, "0x00")
            .estimateGas({ from: aAccounts[0] }, function () { });
        console.log(nGasUsed);

        await ERC1155Contract.methods.safeBatchTransferFrom(senderAdd, receiverAdd, tokenIds, quantities, "0x00").send({ from: aAccounts[0] });
        console.log("token transfer successfully");
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Transaction Successfull',
            showConfirmButton: false,
            timer: 1500
        })
        $(".my-button").prop("disabled", false);

    } catch (err) {
        if (err.message.includes("User denied")) {
            Swal.fire({
                icon: 'error',
                title: 'Transaction Fail',
                text: 'You rejected the transaction on Metamask!',
            })
            $(".my-button").prop("disabled", false);
            console.log("You rejected the transaction on Metamask!")
        } else {
            const msg = (err.message).slice(0, 73);
            Swal.fire({
                icon: 'error',
                title: 'Transaction Fail',
                text: msg,
            })
            $(".my-button").prop("disabled", false);
            console.log(err);
        }
    }
}


function addressValidation(receiver) {
    if (!web3.utils.isAddress(receiver)) {
        Swal.fire({
            icon: 'error',
            title: 'Invalid Address',
            text: 'enter valid address',
        })
        $(".my-button").prop("disabled", false);
        return false;
    } else {
        return true;
    }

}

function inputAmountvalidation(nAmount) {
    if (isNaN(nAmount) || !nAmount) {
        Swal.fire({
            icon: 'error',
            title: 'Value is not number',
            text: 'enter valid number',
        })
        $(".my-button").prop("disabled", false);
        return false;
    } else {
        return true;
    }
}

function emptyInputValidation(sInput) {
    if (!sInput.length) {
        Swal.fire({
            icon: 'error',
            title: 'Empty value',
            text: 'we cant proceed with empty value',
        })
        $(".my-button").prop("disabled", false);
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
    if (chainId !== sepoliaChainId) {
        let newChainId = "0x" + sepoliaChainId.toString(16);
        await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: newChainId }],
        });
    } else {
        $("#network").text("ChainId: " + chainId);
    }

}