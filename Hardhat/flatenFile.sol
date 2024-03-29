// Sources flattened with hardhat v2.14.0 https://hardhat.org

// File @openzeppelin/contracts/utils/introspection/IERC165.sol@v4.9.0

// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts v4.4.1 (utils/introspection/IERC165.sol)

pragma solidity ^0.8.0;

/**
 * @dev Interface of the ERC165 standard, as defined in the
 * https://eips.ethereum.org/EIPS/eip-165[EIP].
 *
 * Implementers can declare support of contract interfaces, which can then be
 * queried by others ({ERC165Checker}).
 *
 * For an implementation, see {ERC165}.
 */
interface IERC165 {
    /**
     * @dev Returns true if this contract implements the interface defined by
     * `interfaceId`. See the corresponding
     * https://eips.ethereum.org/EIPS/eip-165#how-interfaces-are-identified[EIP section]
     * to learn more about how these ids are created.
     *
     * This function call must use less than 30 000 gas.
     */
    function supportsInterface(bytes4 interfaceId) external view returns (bool);
}


// File @openzeppelin/contracts/token/ERC1155/IERC1155.sol@v4.9.0

// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts (last updated v4.9.0) (token/ERC1155/IERC1155.sol)

pragma solidity ^0.8.0;

/**
 * @dev Required interface of an ERC1155 compliant contract, as defined in the
 * https://eips.ethereum.org/EIPS/eip-1155[EIP].
 *
 * _Available since v3.1._
 */
interface IERC1155 is IERC165 {
    /**
     * @dev Emitted when `value` tokens of token type `id` are transferred from `from` to `to` by `operator`.
     */
    event TransferSingle(address indexed operator, address indexed from, address indexed to, uint256 id, uint256 value);

    /**
     * @dev Equivalent to multiple {TransferSingle} events, where `operator`, `from` and `to` are the same for all
     * transfers.
     */
    event TransferBatch(
        address indexed operator,
        address indexed from,
        address indexed to,
        uint256[] ids,
        uint256[] values
    );

    /**
     * @dev Emitted when `account` grants or revokes permission to `operator` to transfer their tokens, according to
     * `approved`.
     */
    event ApprovalForAll(address indexed account, address indexed operator, bool approved);

    /**
     * @dev Emitted when the URI for token type `id` changes to `value`, if it is a non-programmatic URI.
     *
     * If an {URI} event was emitted for `id`, the standard
     * https://eips.ethereum.org/EIPS/eip-1155#metadata-extensions[guarantees] that `value` will equal the value
     * returned by {IERC1155MetadataURI-uri}.
     */
    event URI(string value, uint256 indexed id);

    /**
     * @dev Returns the amount of tokens of token type `id` owned by `account`.
     *
     * Requirements:
     *
     * - `account` cannot be the zero address.
     */
    function balanceOf(address account, uint256 id) external view returns (uint256);

    /**
     * @dev xref:ROOT:erc1155.adoc#batch-operations[Batched] version of {balanceOf}.
     *
     * Requirements:
     *
     * - `accounts` and `ids` must have the same length.
     */
    function balanceOfBatch(
        address[] calldata accounts,
        uint256[] calldata ids
    ) external view returns (uint256[] memory);

    /**
     * @dev Grants or revokes permission to `operator` to transfer the caller's tokens, according to `approved`,
     *
     * Emits an {ApprovalForAll} event.
     *
     * Requirements:
     *
     * - `operator` cannot be the caller.
     */
    function setApprovalForAll(address operator, bool approved) external;

    /**
     * @dev Returns true if `operator` is approved to transfer ``account``'s tokens.
     *
     * See {setApprovalForAll}.
     */
    function isApprovedForAll(address account, address operator) external view returns (bool);

    /**
     * @dev Transfers `amount` tokens of token type `id` from `from` to `to`.
     *
     * Emits a {TransferSingle} event.
     *
     * Requirements:
     *
     * - `to` cannot be the zero address.
     * - If the caller is not `from`, it must have been approved to spend ``from``'s tokens via {setApprovalForAll}.
     * - `from` must have a balance of tokens of type `id` of at least `amount`.
     * - If `to` refers to a smart contract, it must implement {IERC1155Receiver-onERC1155Received} and return the
     * acceptance magic value.
     */
    function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes calldata data) external;

    /**
     * @dev xref:ROOT:erc1155.adoc#batch-operations[Batched] version of {safeTransferFrom}.
     *
     * Emits a {TransferBatch} event.
     *
     * Requirements:
     *
     * - `ids` and `amounts` must have the same length.
     * - If `to` refers to a smart contract, it must implement {IERC1155Receiver-onERC1155BatchReceived} and return the
     * acceptance magic value.
     */
    function safeBatchTransferFrom(
        address from,
        address to,
        uint256[] calldata ids,
        uint256[] calldata amounts,
        bytes calldata data
    ) external;
}


// File @openzeppelin/contracts/token/ERC1155/extensions/IERC1155MetadataURI.sol@v4.9.0

// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts v4.4.1 (token/ERC1155/extensions/IERC1155MetadataURI.sol)

pragma solidity ^0.8.0;

/**
 * @dev Interface of the optional ERC1155MetadataExtension interface, as defined
 * in the https://eips.ethereum.org/EIPS/eip-1155#metadata-extensions[EIP].
 *
 * _Available since v3.1._
 */
interface IERC1155MetadataURI is IERC1155 {
    /**
     * @dev Returns the URI for token type `id`.
     *
     * If the `\{id\}` substring is present in the URI, it must be replaced by
     * clients with the actual token type ID.
     */
    function uri(uint256 id) external view returns (string memory);
}


// File @openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol@v4.9.0

// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts (last updated v4.5.0) (token/ERC1155/IERC1155Receiver.sol)

pragma solidity ^0.8.0;

/**
 * @dev _Available since v3.1._
 */
interface IERC1155Receiver is IERC165 {
    /**
     * @dev Handles the receipt of a single ERC1155 token type. This function is
     * called at the end of a `safeTransferFrom` after the balance has been updated.
     *
     * NOTE: To accept the transfer, this must return
     * `bytes4(keccak256("onERC1155Received(address,address,uint256,uint256,bytes)"))`
     * (i.e. 0xf23a6e61, or its own function selector).
     *
     * @param operator The address which initiated the transfer (i.e. msg.sender)
     * @param from The address which previously owned the token
     * @param id The ID of the token being transferred
     * @param value The amount of tokens being transferred
     * @param data Additional data with no specified format
     * @return `bytes4(keccak256("onERC1155Received(address,address,uint256,uint256,bytes)"))` if transfer is allowed
     */
    function onERC1155Received(
        address operator,
        address from,
        uint256 id,
        uint256 value,
        bytes calldata data
    ) external returns (bytes4);

    /**
     * @dev Handles the receipt of a multiple ERC1155 token types. This function
     * is called at the end of a `safeBatchTransferFrom` after the balances have
     * been updated.
     *
     * NOTE: To accept the transfer(s), this must return
     * `bytes4(keccak256("onERC1155BatchReceived(address,address,uint256[],uint256[],bytes)"))`
     * (i.e. 0xbc197c81, or its own function selector).
     *
     * @param operator The address which initiated the batch transfer (i.e. msg.sender)
     * @param from The address which previously owned the token
     * @param ids An array containing ids of each token being transferred (order and length must match values array)
     * @param values An array containing amounts of each token being transferred (order and length must match ids array)
     * @param data Additional data with no specified format
     * @return `bytes4(keccak256("onERC1155BatchReceived(address,address,uint256[],uint256[],bytes)"))` if transfer is allowed
     */
    function onERC1155BatchReceived(
        address operator,
        address from,
        uint256[] calldata ids,
        uint256[] calldata values,
        bytes calldata data
    ) external returns (bytes4);
}


// File @openzeppelin/contracts/utils/Address.sol@v4.9.0

// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts (last updated v4.9.0) (utils/Address.sol)

pragma solidity ^0.8.1;

/**
 * @dev Collection of functions related to the address type
 */
library Address {
    /**
     * @dev Returns true if `account` is a contract.
     *
     * [IMPORTANT]
     * ====
     * It is unsafe to assume that an address for which this function returns
     * false is an externally-owned account (EOA) and not a contract.
     *
     * Among others, `isContract` will return false for the following
     * types of addresses:
     *
     *  - an externally-owned account
     *  - a contract in construction
     *  - an address where a contract will be created
     *  - an address where a contract lived, but was destroyed
     *
     * Furthermore, `isContract` will also return true if the target contract within
     * the same transaction is already scheduled for destruction by `SELFDESTRUCT`,
     * which only has an effect at the end of a transaction.
     * ====
     *
     * [IMPORTANT]
     * ====
     * You shouldn't rely on `isContract` to protect against flash loan attacks!
     *
     * Preventing calls from contracts is highly discouraged. It breaks composability, breaks support for smart wallets
     * like Gnosis Safe, and does not provide security since it can be circumvented by calling from a contract
     * constructor.
     * ====
     */
    function isContract(address account) internal view returns (bool) {
        // This method relies on extcodesize/address.code.length, which returns 0
        // for contracts in construction, since the code is only stored at the end
        // of the constructor execution.

        return account.code.length > 0;
    }

    /**
     * @dev Replacement for Solidity's `transfer`: sends `amount` wei to
     * `recipient`, forwarding all available gas and reverting on errors.
     *
     * https://eips.ethereum.org/EIPS/eip-1884[EIP1884] increases the gas cost
     * of certain opcodes, possibly making contracts go over the 2300 gas limit
     * imposed by `transfer`, making them unable to receive funds via
     * `transfer`. {sendValue} removes this limitation.
     *
     * https://consensys.net/diligence/blog/2019/09/stop-using-soliditys-transfer-now/[Learn more].
     *
     * IMPORTANT: because control is transferred to `recipient`, care must be
     * taken to not create reentrancy vulnerabilities. Consider using
     * {ReentrancyGuard} or the
     * https://solidity.readthedocs.io/en/v0.8.0/security-considerations.html#use-the-checks-effects-interactions-pattern[checks-effects-interactions pattern].
     */
    function sendValue(address payable recipient, uint256 amount) internal {
        require(address(this).balance >= amount, "Address: insufficient balance");

        (bool success, ) = recipient.call{value: amount}("");
        require(success, "Address: unable to send value, recipient may have reverted");
    }

    /**
     * @dev Performs a Solidity function call using a low level `call`. A
     * plain `call` is an unsafe replacement for a function call: use this
     * function instead.
     *
     * If `target` reverts with a revert reason, it is bubbled up by this
     * function (like regular Solidity function calls).
     *
     * Returns the raw returned data. To convert to the expected return value,
     * use https://solidity.readthedocs.io/en/latest/units-and-global-variables.html?highlight=abi.decode#abi-encoding-and-decoding-functions[`abi.decode`].
     *
     * Requirements:
     *
     * - `target` must be a contract.
     * - calling `target` with `data` must not revert.
     *
     * _Available since v3.1._
     */
    function functionCall(address target, bytes memory data) internal returns (bytes memory) {
        return functionCallWithValue(target, data, 0, "Address: low-level call failed");
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`], but with
     * `errorMessage` as a fallback revert reason when `target` reverts.
     *
     * _Available since v3.1._
     */
    function functionCall(
        address target,
        bytes memory data,
        string memory errorMessage
    ) internal returns (bytes memory) {
        return functionCallWithValue(target, data, 0, errorMessage);
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],
     * but also transferring `value` wei to `target`.
     *
     * Requirements:
     *
     * - the calling contract must have an ETH balance of at least `value`.
     * - the called Solidity function must be `payable`.
     *
     * _Available since v3.1._
     */
    function functionCallWithValue(address target, bytes memory data, uint256 value) internal returns (bytes memory) {
        return functionCallWithValue(target, data, value, "Address: low-level call with value failed");
    }

    /**
     * @dev Same as {xref-Address-functionCallWithValue-address-bytes-uint256-}[`functionCallWithValue`], but
     * with `errorMessage` as a fallback revert reason when `target` reverts.
     *
     * _Available since v3.1._
     */
    function functionCallWithValue(
        address target,
        bytes memory data,
        uint256 value,
        string memory errorMessage
    ) internal returns (bytes memory) {
        require(address(this).balance >= value, "Address: insufficient balance for call");
        (bool success, bytes memory returndata) = target.call{value: value}(data);
        return verifyCallResultFromTarget(target, success, returndata, errorMessage);
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],
     * but performing a static call.
     *
     * _Available since v3.3._
     */
    function functionStaticCall(address target, bytes memory data) internal view returns (bytes memory) {
        return functionStaticCall(target, data, "Address: low-level static call failed");
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-string-}[`functionCall`],
     * but performing a static call.
     *
     * _Available since v3.3._
     */
    function functionStaticCall(
        address target,
        bytes memory data,
        string memory errorMessage
    ) internal view returns (bytes memory) {
        (bool success, bytes memory returndata) = target.staticcall(data);
        return verifyCallResultFromTarget(target, success, returndata, errorMessage);
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],
     * but performing a delegate call.
     *
     * _Available since v3.4._
     */
    function functionDelegateCall(address target, bytes memory data) internal returns (bytes memory) {
        return functionDelegateCall(target, data, "Address: low-level delegate call failed");
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-string-}[`functionCall`],
     * but performing a delegate call.
     *
     * _Available since v3.4._
     */
    function functionDelegateCall(
        address target,
        bytes memory data,
        string memory errorMessage
    ) internal returns (bytes memory) {
        (bool success, bytes memory returndata) = target.delegatecall(data);
        return verifyCallResultFromTarget(target, success, returndata, errorMessage);
    }

    /**
     * @dev Tool to verify that a low level call to smart-contract was successful, and revert (either by bubbling
     * the revert reason or using the provided one) in case of unsuccessful call or if target was not a contract.
     *
     * _Available since v4.8._
     */
    function verifyCallResultFromTarget(
        address target,
        bool success,
        bytes memory returndata,
        string memory errorMessage
    ) internal view returns (bytes memory) {
        if (success) {
            if (returndata.length == 0) {
                // only check isContract if the call was successful and the return data is empty
                // otherwise we already know that it was a contract
                require(isContract(target), "Address: call to non-contract");
            }
            return returndata;
        } else {
            _revert(returndata, errorMessage);
        }
    }

    /**
     * @dev Tool to verify that a low level call was successful, and revert if it wasn't, either by bubbling the
     * revert reason or using the provided one.
     *
     * _Available since v4.3._
     */
    function verifyCallResult(
        bool success,
        bytes memory returndata,
        string memory errorMessage
    ) internal pure returns (bytes memory) {
        if (success) {
            return returndata;
        } else {
            _revert(returndata, errorMessage);
        }
    }

    function _revert(bytes memory returndata, string memory errorMessage) private pure {
        // Look for revert reason and bubble it up if present
        if (returndata.length > 0) {
            // The easiest way to bubble the revert reason is using memory via assembly
            /// @solidity memory-safe-assembly
            assembly {
                let returndata_size := mload(returndata)
                revert(add(32, returndata), returndata_size)
            }
        } else {
            revert(errorMessage);
        }
    }
}


// File @openzeppelin/contracts/utils/Context.sol@v4.9.0

// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts v4.4.1 (utils/Context.sol)

pragma solidity ^0.8.0;

/**
 * @dev Provides information about the current execution context, including the
 * sender of the transaction and its data. While these are generally available
 * via msg.sender and msg.data, they should not be accessed in such a direct
 * manner, since when dealing with meta-transactions the account sending and
 * paying for execution may not be the actual sender (as far as an application
 * is concerned).
 *
 * This contract is only required for intermediate, library-like contracts.
 */
abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes calldata) {
        return msg.data;
    }
}


// File @openzeppelin/contracts/utils/introspection/ERC165.sol@v4.9.0

// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts v4.4.1 (utils/introspection/ERC165.sol)

pragma solidity ^0.8.0;

/**
 * @dev Implementation of the {IERC165} interface.
 *
 * Contracts that want to implement ERC165 should inherit from this contract and override {supportsInterface} to check
 * for the additional interface id that will be supported. For example:
 *
 * ```solidity
 * function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
 *     return interfaceId == type(MyInterface).interfaceId || super.supportsInterface(interfaceId);
 * }
 * ```
 *
 * Alternatively, {ERC165Storage} provides an easier to use but more expensive implementation.
 */
abstract contract ERC165 is IERC165 {
    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
        return interfaceId == type(IERC165).interfaceId;
    }
}


// File @openzeppelin/contracts/token/ERC1155/ERC1155.sol@v4.9.0

// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts (last updated v4.9.0) (token/ERC1155/ERC1155.sol)

pragma solidity ^0.8.0;






/**
 * @dev Implementation of the basic standard multi-token.
 * See https://eips.ethereum.org/EIPS/eip-1155
 * Originally based on code by Enjin: https://github.com/enjin/erc-1155
 *
 * _Available since v3.1._
 */
contract ERC1155 is Context, ERC165, IERC1155, IERC1155MetadataURI {
    using Address for address;

    // Mapping from token ID to account balances
    mapping(uint256 => mapping(address => uint256)) private _balances;

    // Mapping from account to operator approvals
    mapping(address => mapping(address => bool)) private _operatorApprovals;

    // Used as the URI for all token types by relying on ID substitution, e.g. https://token-cdn-domain/{id}.json
    string private _uri;

    /**
     * @dev See {_setURI}.
     */
    constructor(string memory uri_) {
        _setURI(uri_);
    }

    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC165, IERC165) returns (bool) {
        return
            interfaceId == type(IERC1155).interfaceId ||
            interfaceId == type(IERC1155MetadataURI).interfaceId ||
            super.supportsInterface(interfaceId);
    }

    /**
     * @dev See {IERC1155MetadataURI-uri}.
     *
     * This implementation returns the same URI for *all* token types. It relies
     * on the token type ID substitution mechanism
     * https://eips.ethereum.org/EIPS/eip-1155#metadata[defined in the EIP].
     *
     * Clients calling this function must replace the `\{id\}` substring with the
     * actual token type ID.
     */
    function uri(uint256) public view virtual override returns (string memory) {
        return _uri;
    }

    /**
     * @dev See {IERC1155-balanceOf}.
     *
     * Requirements:
     *
     * - `account` cannot be the zero address.
     */
    function balanceOf(address account, uint256 id) public view virtual override returns (uint256) {
        require(account != address(0), "ERC1155: address zero is not a valid owner");
        return _balances[id][account];
    }

    /**
     * @dev See {IERC1155-balanceOfBatch}.
     *
     * Requirements:
     *
     * - `accounts` and `ids` must have the same length.
     */
    function balanceOfBatch(
        address[] memory accounts,
        uint256[] memory ids
    ) public view virtual override returns (uint256[] memory) {
        require(accounts.length == ids.length, "ERC1155: accounts and ids length mismatch");

        uint256[] memory batchBalances = new uint256[](accounts.length);

        for (uint256 i = 0; i < accounts.length; ++i) {
            batchBalances[i] = balanceOf(accounts[i], ids[i]);
        }

        return batchBalances;
    }

    /**
     * @dev See {IERC1155-setApprovalForAll}.
     */
    function setApprovalForAll(address operator, bool approved) public virtual override {
        _setApprovalForAll(_msgSender(), operator, approved);
    }

    /**
     * @dev See {IERC1155-isApprovedForAll}.
     */
    function isApprovedForAll(address account, address operator) public view virtual override returns (bool) {
        return _operatorApprovals[account][operator];
    }

    /**
     * @dev See {IERC1155-safeTransferFrom}.
     */
    function safeTransferFrom(
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public virtual override {
        require(
            from == _msgSender() || isApprovedForAll(from, _msgSender()),
            "ERC1155: caller is not token owner or approved"
        );
        _safeTransferFrom(from, to, id, amount, data);
    }

    /**
     * @dev See {IERC1155-safeBatchTransferFrom}.
     */
    function safeBatchTransferFrom(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) public virtual override {
        require(
            from == _msgSender() || isApprovedForAll(from, _msgSender()),
            "ERC1155: caller is not token owner or approved"
        );
        _safeBatchTransferFrom(from, to, ids, amounts, data);
    }

    /**
     * @dev Transfers `amount` tokens of token type `id` from `from` to `to`.
     *
     * Emits a {TransferSingle} event.
     *
     * Requirements:
     *
     * - `to` cannot be the zero address.
     * - `from` must have a balance of tokens of type `id` of at least `amount`.
     * - If `to` refers to a smart contract, it must implement {IERC1155Receiver-onERC1155Received} and return the
     * acceptance magic value.
     */
    function _safeTransferFrom(
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) internal virtual {
        require(to != address(0), "ERC1155: transfer to the zero address");

        address operator = _msgSender();
        uint256[] memory ids = _asSingletonArray(id);
        uint256[] memory amounts = _asSingletonArray(amount);

        _beforeTokenTransfer(operator, from, to, ids, amounts, data);

        uint256 fromBalance = _balances[id][from];
        require(fromBalance >= amount, "ERC1155: insufficient balance for transfer");
        unchecked {
            _balances[id][from] = fromBalance - amount;
        }
        _balances[id][to] += amount;

        emit TransferSingle(operator, from, to, id, amount);

        _afterTokenTransfer(operator, from, to, ids, amounts, data);

        _doSafeTransferAcceptanceCheck(operator, from, to, id, amount, data);
    }

    /**
     * @dev xref:ROOT:erc1155.adoc#batch-operations[Batched] version of {_safeTransferFrom}.
     *
     * Emits a {TransferBatch} event.
     *
     * Requirements:
     *
     * - If `to` refers to a smart contract, it must implement {IERC1155Receiver-onERC1155BatchReceived} and return the
     * acceptance magic value.
     */
    function _safeBatchTransferFrom(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal virtual {
        require(ids.length == amounts.length, "ERC1155: ids and amounts length mismatch");
        require(to != address(0), "ERC1155: transfer to the zero address");

        address operator = _msgSender();

        _beforeTokenTransfer(operator, from, to, ids, amounts, data);

        for (uint256 i = 0; i < ids.length; ++i) {
            uint256 id = ids[i];
            uint256 amount = amounts[i];

            uint256 fromBalance = _balances[id][from];
            require(fromBalance >= amount, "ERC1155: insufficient balance for transfer");
            unchecked {
                _balances[id][from] = fromBalance - amount;
            }
            _balances[id][to] += amount;
        }

        emit TransferBatch(operator, from, to, ids, amounts);

        _afterTokenTransfer(operator, from, to, ids, amounts, data);

        _doSafeBatchTransferAcceptanceCheck(operator, from, to, ids, amounts, data);
    }

    /**
     * @dev Sets a new URI for all token types, by relying on the token type ID
     * substitution mechanism
     * https://eips.ethereum.org/EIPS/eip-1155#metadata[defined in the EIP].
     *
     * By this mechanism, any occurrence of the `\{id\}` substring in either the
     * URI or any of the amounts in the JSON file at said URI will be replaced by
     * clients with the token type ID.
     *
     * For example, the `https://token-cdn-domain/\{id\}.json` URI would be
     * interpreted by clients as
     * `https://token-cdn-domain/000000000000000000000000000000000000000000000000000000000004cce0.json`
     * for token type ID 0x4cce0.
     *
     * See {uri}.
     *
     * Because these URIs cannot be meaningfully represented by the {URI} event,
     * this function emits no events.
     */
    function _setURI(string memory newuri) internal virtual {
        _uri = newuri;
    }

    /**
     * @dev Creates `amount` tokens of token type `id`, and assigns them to `to`.
     *
     * Emits a {TransferSingle} event.
     *
     * Requirements:
     *
     * - `to` cannot be the zero address.
     * - If `to` refers to a smart contract, it must implement {IERC1155Receiver-onERC1155Received} and return the
     * acceptance magic value.
     */
    function _mint(address to, uint256 id, uint256 amount, bytes memory data) internal virtual {
        require(to != address(0), "ERC1155: mint to the zero address");

        address operator = _msgSender();
        uint256[] memory ids = _asSingletonArray(id);
        uint256[] memory amounts = _asSingletonArray(amount);

        _beforeTokenTransfer(operator, address(0), to, ids, amounts, data);

        _balances[id][to] += amount;
        emit TransferSingle(operator, address(0), to, id, amount);

        _afterTokenTransfer(operator, address(0), to, ids, amounts, data);

        _doSafeTransferAcceptanceCheck(operator, address(0), to, id, amount, data);
    }

    /**
     * @dev xref:ROOT:erc1155.adoc#batch-operations[Batched] version of {_mint}.
     *
     * Emits a {TransferBatch} event.
     *
     * Requirements:
     *
     * - `ids` and `amounts` must have the same length.
     * - If `to` refers to a smart contract, it must implement {IERC1155Receiver-onERC1155BatchReceived} and return the
     * acceptance magic value.
     */
    function _mintBatch(
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal virtual {
        require(to != address(0), "ERC1155: mint to the zero address");
        require(ids.length == amounts.length, "ERC1155: ids and amounts length mismatch");

        address operator = _msgSender();

        _beforeTokenTransfer(operator, address(0), to, ids, amounts, data);

        for (uint256 i = 0; i < ids.length; i++) {
            _balances[ids[i]][to] += amounts[i];
        }

        emit TransferBatch(operator, address(0), to, ids, amounts);

        _afterTokenTransfer(operator, address(0), to, ids, amounts, data);

        _doSafeBatchTransferAcceptanceCheck(operator, address(0), to, ids, amounts, data);
    }

    /**
     * @dev Destroys `amount` tokens of token type `id` from `from`
     *
     * Emits a {TransferSingle} event.
     *
     * Requirements:
     *
     * - `from` cannot be the zero address.
     * - `from` must have at least `amount` tokens of token type `id`.
     */
    function _burn(address from, uint256 id, uint256 amount) internal virtual {
        require(from != address(0), "ERC1155: burn from the zero address");

        address operator = _msgSender();
        uint256[] memory ids = _asSingletonArray(id);
        uint256[] memory amounts = _asSingletonArray(amount);

        _beforeTokenTransfer(operator, from, address(0), ids, amounts, "");

        uint256 fromBalance = _balances[id][from];
        require(fromBalance >= amount, "ERC1155: burn amount exceeds balance");
        unchecked {
            _balances[id][from] = fromBalance - amount;
        }

        emit TransferSingle(operator, from, address(0), id, amount);

        _afterTokenTransfer(operator, from, address(0), ids, amounts, "");
    }

    /**
     * @dev xref:ROOT:erc1155.adoc#batch-operations[Batched] version of {_burn}.
     *
     * Emits a {TransferBatch} event.
     *
     * Requirements:
     *
     * - `ids` and `amounts` must have the same length.
     */
    function _burnBatch(address from, uint256[] memory ids, uint256[] memory amounts) internal virtual {
        require(from != address(0), "ERC1155: burn from the zero address");
        require(ids.length == amounts.length, "ERC1155: ids and amounts length mismatch");

        address operator = _msgSender();

        _beforeTokenTransfer(operator, from, address(0), ids, amounts, "");

        for (uint256 i = 0; i < ids.length; i++) {
            uint256 id = ids[i];
            uint256 amount = amounts[i];

            uint256 fromBalance = _balances[id][from];
            require(fromBalance >= amount, "ERC1155: burn amount exceeds balance");
            unchecked {
                _balances[id][from] = fromBalance - amount;
            }
        }

        emit TransferBatch(operator, from, address(0), ids, amounts);

        _afterTokenTransfer(operator, from, address(0), ids, amounts, "");
    }

    /**
     * @dev Approve `operator` to operate on all of `owner` tokens
     *
     * Emits an {ApprovalForAll} event.
     */
    function _setApprovalForAll(address owner, address operator, bool approved) internal virtual {
        require(owner != operator, "ERC1155: setting approval status for self");
        _operatorApprovals[owner][operator] = approved;
        emit ApprovalForAll(owner, operator, approved);
    }

    /**
     * @dev Hook that is called before any token transfer. This includes minting
     * and burning, as well as batched variants.
     *
     * The same hook is called on both single and batched variants. For single
     * transfers, the length of the `ids` and `amounts` arrays will be 1.
     *
     * Calling conditions (for each `id` and `amount` pair):
     *
     * - When `from` and `to` are both non-zero, `amount` of ``from``'s tokens
     * of token type `id` will be  transferred to `to`.
     * - When `from` is zero, `amount` tokens of token type `id` will be minted
     * for `to`.
     * - when `to` is zero, `amount` of ``from``'s tokens of token type `id`
     * will be burned.
     * - `from` and `to` are never both zero.
     * - `ids` and `amounts` have the same, non-zero length.
     *
     * To learn more about hooks, head to xref:ROOT:extending-contracts.adoc#using-hooks[Using Hooks].
     */
    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal virtual {}

    /**
     * @dev Hook that is called after any token transfer. This includes minting
     * and burning, as well as batched variants.
     *
     * The same hook is called on both single and batched variants. For single
     * transfers, the length of the `id` and `amount` arrays will be 1.
     *
     * Calling conditions (for each `id` and `amount` pair):
     *
     * - When `from` and `to` are both non-zero, `amount` of ``from``'s tokens
     * of token type `id` will be  transferred to `to`.
     * - When `from` is zero, `amount` tokens of token type `id` will be minted
     * for `to`.
     * - when `to` is zero, `amount` of ``from``'s tokens of token type `id`
     * will be burned.
     * - `from` and `to` are never both zero.
     * - `ids` and `amounts` have the same, non-zero length.
     *
     * To learn more about hooks, head to xref:ROOT:extending-contracts.adoc#using-hooks[Using Hooks].
     */
    function _afterTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal virtual {}

    function _doSafeTransferAcceptanceCheck(
        address operator,
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) private {
        if (to.isContract()) {
            try IERC1155Receiver(to).onERC1155Received(operator, from, id, amount, data) returns (bytes4 response) {
                if (response != IERC1155Receiver.onERC1155Received.selector) {
                    revert("ERC1155: ERC1155Receiver rejected tokens");
                }
            } catch Error(string memory reason) {
                revert(reason);
            } catch {
                revert("ERC1155: transfer to non-ERC1155Receiver implementer");
            }
        }
    }

    function _doSafeBatchTransferAcceptanceCheck(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) private {
        if (to.isContract()) {
            try IERC1155Receiver(to).onERC1155BatchReceived(operator, from, ids, amounts, data) returns (
                bytes4 response
            ) {
                if (response != IERC1155Receiver.onERC1155BatchReceived.selector) {
                    revert("ERC1155: ERC1155Receiver rejected tokens");
                }
            } catch Error(string memory reason) {
                revert(reason);
            } catch {
                revert("ERC1155: transfer to non-ERC1155Receiver implementer");
            }
        }
    }

    function _asSingletonArray(uint256 element) private pure returns (uint256[] memory) {
        uint256[] memory array = new uint256[](1);
        array[0] = element;

        return array;
    }
}


// File contracts/IERC1155Interface.sol

// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

interface IERC1155 {
    function safeTransferFrom(
        address _from,
        address _to,
        uint256 _id,
        uint256 _value,
        bytes calldata _data
    ) external;

    function safeBatchTransferFrom(
        address _from,
        address _to,
        uint256[] calldata _ids,
        uint256[] calldata _values,
        bytes calldata _data
    ) external;

    function balanceOf(address _owner, uint256 _id)
        external
        view
        returns (uint256);

    function balanceOfBatch(address[] calldata _owners, uint256[] calldata _ids)
        external
        view
        returns (uint256[] memory);

    function setApprovalForAll(address _operator, bool _approved) external;

    function isApprovedForAll(address _owner, address _operator)
        external
        view
        returns (bool);

    event TransferSingle(
        address indexed _operator,
        address indexed _from,
        address indexed _to,
        uint256 _id,
        uint256 _value
    );

    event TransferBatch(
        address indexed _operator,
        address indexed _from,
        address indexed _to,
        uint256[] _ids,
        uint256[] _values
    );

    event ApprovalForAll(
        address indexed _owner,
        address indexed _operator,
        bool _approved
    );
}


// File contracts/IERC1155Receiver.sol

// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

interface IERC1155Receiver {
    function onERC1155Received(
        address operator,
        address from,
        address to,
        uint256 id,
        uint256 value,
        bytes calldata data
    ) external returns (bytes4);

    
}


// File contracts/ERC1155.sol

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


contract ERC1155CHECK is IERC1155, IERC1155Receiver {
    // token id => (address => balance)
    mapping(uint256 => mapping(address => uint256)) internal _balances;
    // owner => (operator => yes/no)
    mapping(address => mapping(address => bool)) internal _operatorApprovals;
    // token id => supply
    mapping(uint256 => uint256) public totalSupply;

    uint256 public tokenId;
    string public name;
    string public symbol;
    address public owner;

    constructor(string memory _name, string memory _symbol) {
        owner = msg.sender;
        name = _name;
        symbol = _symbol;
        tokenId = 1;
    }

    function balanceOf(
        address _owner,
        uint256 _tokenId
    ) public view returns (uint256) {
        require(_owner != address(0), "ERC1155: invalid address");
        return _balances[_tokenId][_owner];
    }

    function balanceOfBatch(
        address[] calldata _owners,
        uint256[] calldata _ids
    ) public view returns (uint256[] memory) {
        require(
            _owners.length == _ids.length,
            "ERC1155: accounts and ids length mismatch"
        );
        uint256[] memory balances = new uint256[](_owners.length);

        for (uint256 i = 0; i < _owners.length; i++) {
            balances[i] = balanceOf(_owners[i], _ids[i]);
        }

        return balances;
    }

    function setApprovalForAll(address _operator, bool _approved) external {
        _operatorApprovals[msg.sender][_operator] = _approved;
    }

    function isApprovedForAll(
        address _owner,
        address _operator
    ) public view returns (bool) {
        return _operatorApprovals[_owner][_operator];
    }

    function safeTransferFrom(
        address _from,
        address _to,
        uint256 _id,
        uint256 _amount,
        bytes memory _data
    ) public {
        require(
            _from == msg.sender || isApprovedForAll(_from, msg.sender),
            "ERC1155Token: not authorized"
        );

        // transfer
        _transfer(_from, _to, _id, _amount);
        // safe transfer checks

        _doSafeTransferAcceptanceCheck(
            msg.sender,
            _from,
            _to,
            _id,
            _amount,
            _data
        );
        emit TransferSingle(msg.sender, _from, _to, _id, _amount);
    }

    function safeBatchTransferFrom(
        address _from,
        address _to,
        uint256[] memory _ids,
        uint256[] memory _amounts,
        bytes memory _data
    ) public {
        require(
            _from == msg.sender || isApprovedForAll(_from, msg.sender),
            "ERC1155Token: not authorized"
        );
        require(
            _ids.length == _amounts.length,
            "ERC1155Token: length mismatch"
        );

        for (uint256 i = 0; i < _ids.length; i++) {
            _doSafeTransferAcceptanceCheck(
                msg.sender,
                _from,
                _to,
                _ids[i],
                _amounts[i],
                _data
            );
            _transfer(_from, _to, _ids[i], _amounts[i]);
        }

        emit TransferBatch(msg.sender, _from, _to, _ids, _amounts);
    }

    function mintTo(address _to, uint256 _tokenId, uint256 _amount) public {
        require(owner == msg.sender, "ERC1155: not authorized");
        require(_to != address(0), "ERC1155: invalid mint address");
        require(_amount > 0, "ERC1155: amount invalid");
        require(_tokenId > 0, "ERC1155: invalid tokenId");

        uint256 tokenIdToMint;

        if (_tokenId > tokenId) {
            tokenIdToMint = tokenId;
            tokenId += 1;
        } else {
            tokenIdToMint = _tokenId;
        }

        _balances[tokenIdToMint][_to] += _amount;
        totalSupply[tokenIdToMint] += _amount;

        emit TransferSingle(msg.sender, address(0), _to, _tokenId, _amount);
    }

    function _transfer(
        address _from,
        address _to,
        uint256 _ids,
        uint256 _amounts
    ) internal {
        require(_to != address(0), "ERC1155Token: transfer to address 0");

        uint256 id = _ids;
        uint256 amount = _amounts;

        uint256 fromBalance = _balances[id][_from];
        require(
            fromBalance >= amount,
            "ERC1155Token: insufficient balance for transfer"
        );
        _balances[id][_from] -= amount;
        _balances[id][_to] += amount;
    }

    function _doSafeTransferAcceptanceCheck(
        address operator,
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) private {
        if (to.code.length > 0) {
            if (
                IERC1155Receiver(to).onERC1155Received(
                    operator,
                    from,
                    to,
                    id,
                    amount,
                    data
                ) != IERC1155Receiver.onERC1155Received.selector
            ) {
                revert("ERC1155: unsafe recevier address");
            }
        }
    }

    function onERC1155Received(
        address,
        address,
        address,
        uint256,
        uint256,
        bytes calldata
    ) external pure returns (bytes4) {
        return
            bytes4(
                keccak256(
                    "onERC1155Received(address, address, address, uint256, uint256, bytes)"
                )
            );
    }
}


// File contracts/ERC1155Update.sol

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
contract ERC1155Update is ERC1155 {
    uint256 public mintPrice;
    address public owner;

    // string uri="uri";

    constructor(uint256 _mintPrice, string memory uri) ERC1155(uri) {
        mintPrice = _mintPrice;
        owner = msg.sender;
    }

    function mint(uint256 tokenId, uint256 quantity) external payable {
        require(quantity > 0, "ERCU1155pdate: invalid quantity");
        require(
            msg.value == (mintPrice * quantity),
            "ERCU1155pdate : invalid price"
        );
        _mint(msg.sender, tokenId, quantity, "");
    }

    function burn(uint tokenId, uint256 quantity) external {
        _burn(msg.sender, tokenId, quantity);
    }

    function mintBatch(
        uint256[] memory ids,
        uint256[] memory quentities
    ) external payable {
        uint256 totalAmount;
        for (uint256 index = 0; index < ids.length; index++) {
            totalAmount += quentities[index] * mintPrice;
        }
        require(
            msg.value == totalAmount,
            "ERC1155Update: invalid total amount"
        );
        _mintBatch(msg.sender, ids, quentities, "");
        payable(owner).transfer(msg.value);
    }

     function burnBatch(
        uint256[] memory ids,
        uint256[] memory quantities
    ) external {
        _burnBatch(msg.sender, ids, quantities);
    }
}


// File contracts/IERC721TokenReceiver.sol

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC721TokenReceiver
{

  function onERC721Received(
    address _operator,
    address _from,
    uint256 _tokenId,
    bytes calldata _data
  )
    external
    returns(bytes4);

}


// File contracts/ERC721.sol

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC721 {
    function balanceOf(address owner) external view returns (uint256 balance);

    function ownerOf(uint256 tokenId) external view returns (address owner);

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes calldata data
    ) external;

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) external;

    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) external;

    function approve(address to, uint256 tokenId) external;

    function setApprovalForAll(address operator, bool approved) external;

    function getApproved(uint256 tokenId)
        external
        view
        returns (address operator);

    function isApprovedForAll(address owner, address operator)
        external
        view
        returns (bool);

    event Transfer(
        address indexed from,
        address indexed to,
        uint256 indexed tokenId
    );

    event Approval(
        address indexed owner,
        address indexed approved,
        uint256 indexed tokenId
    );

    event ApprovalForAll(
        address indexed owner,
        address indexed operator,
        bool approved
    );
}

contract ERC721 is IERC721, IERC721TokenReceiver {
    string public name;
    string public symbol;
    uint256 public tokenId;
    address public contractOwner;
    mapping(uint256 => address) private _owners;
    mapping(address => uint256) private _balances;
    mapping(uint256 => address) private _tokenApprovals;
    mapping(address => mapping(address => bool)) private _operatorApprovals;

    constructor(string memory _name, string memory _symbol) {
        name = _name;
        symbol = _symbol;
        contractOwner = msg.sender;
    }

    function balanceOf(address _owner) public view returns (uint256) {
        require(_owner != address(0), "ERC721: Invalid Address");
        return _balances[_owner];
    }

    function ownerOf(uint256 _tokenId) public view returns (address) {
        return _owners[_tokenId];
    }

    function _transfer(
        address _from,
        address _to,
        uint256 _tokenId
    ) internal {
        require(ownerOf(_tokenId) == _from, "ERC721: Not owner");
        require(_to != address(0), "ERC721: Invalid Receiver address");
        delete _tokenApprovals[_tokenId];
        _balances[_from] -= 1;
        _balances[_to] += 1;
        _owners[_tokenId] = _to;
        emit Transfer(_from, _to, _tokenId);
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _tokenId
    ) public {
        require(
            ownerOf(_tokenId) == msg.sender ||
                _tokenApprovals[_tokenId] == msg.sender ||
                _operatorApprovals[ownerOf(_tokenId)][msg.sender],
            "ERC721: You are not allowed"
        );
        _transfer(_from, _to, _tokenId);
    }

    function safeTransferFrom(
        address _from,
        address _to,
        uint256 _tokenId,
        bytes memory data
    ) public {
        require(
            ownerOf(_tokenId) == msg.sender ||
                _tokenApprovals[_tokenId] == msg.sender ||
                _operatorApprovals[ownerOf(_tokenId)][msg.sender],
            "ERC721: You are not allowed"
        );
        _transfer(_from, _to, _tokenId);
        require(
            _to.code.length == 0 ||
                IERC721TokenReceiver(_to).onERC721Received(
                    msg.sender,
                    _from,
                    _tokenId,
                    data
                ) ==
                IERC721TokenReceiver.onERC721Received.selector,
            "ERC721:unsafe recipient"
        );
    }

    function safeTransferFrom(
        address _from,
        address _to,
        uint256 _tokenId
    ) public {
        safeTransferFrom(_from, _to, _tokenId, "");
    }

    function onERC721Received(
        address,
        address,
        uint256,
        bytes memory
    ) external pure returns (bytes4) {
        return
            bytes4(
                keccak256("onERC721Received(address,address,uint256,bytes)")
            );
    }

    function approve(address _to, uint256 _tokenId) public {
        require(ownerOf(_tokenId) == msg.sender, "ERC721: not owner");
        require(_to!=address(0),"ERC721:invalid spender address");
        _tokenApprovals[_tokenId] = _to;
        emit Approval(ownerOf(_tokenId), _to, _tokenId);
    }

    function setApprovalForAll(address _operator, bool _approved) public {
        require(_operator!=address(0),"ERC721:invalid spender address");
        _operatorApprovals[msg.sender][_operator] = _approved;
        emit ApprovalForAll(msg.sender, _operator, _approved);
    }

    function getApproved(uint256 _tokenId)
        external
        view
        returns (address operator)
    {
        return _tokenApprovals[_tokenId];
    }

    function isApprovedForAll(address _owner, address _operator)
        public
        view
        returns (bool)
    {
        return _operatorApprovals[_owner][_operator];
    }

    function mintTo(address _to) public {
        require(contractOwner == msg.sender, "ERC721: Only owner can mint");
        require(_to != address(0), "ERC721Token: zero address cannot be owner");
        // require(
        //     _to.code.length == 0,
        //     "ERC721Token: do not mint in contract address "
        // );
        tokenId++;
        _owners[tokenId] = _to;
        _balances[_to] += 1;
        emit Transfer(address(0), _to, tokenId);
    }
}


// File contracts/MarketPlace.sol

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


contract MarketPlace {
    address public erc721;
    address public erc1155;
    address public marketOwner;

    struct tokenOnSale {
        uint256 tokenId;
        uint256 quantity;
        uint256 pricePerToken;
        address seller;
        bool isOnSale;
        bool isERC721;
    }

    struct tokenOnAuction {
        uint256 tokenId;
        uint256 quantity;
        uint256 basePricePerToken;
        uint256 auctionStartTime;
        uint256 auctionEndTime;
        uint256 maxBidAmount;
        address maxBidAddress;
        address seller;
        bool isOnAuction;
        bool isERC721;
    }
    struct bidders {
        address bidderAddress;
        uint256 biddingAmount;
        //uint256 quantity;
    }

    mapping(bool => mapping(uint256 => mapping(address => tokenOnSale)))
        public tokenOnSaleInfo;
    mapping(bool => mapping(uint256 => mapping(address => tokenOnAuction)))
        public auctionInfo;
    mapping(bool => mapping(uint256 => mapping(address => bidders[])))
        private biddingHistory;

    event SetOnSale(
        uint256 _tokenId,
        uint256 _quantity,
        uint256 _pricePerToken,
        address _seller
    );
    event Purchase(
        uint256 _tokenId,
        uint256 _quantity,
        address _sellerAddress,
        address _buyerAddress
    );
    event StopSale(uint256 _tokenId, address _owner);
    event SetAuction(
        uint256 _tokenId,
        uint256 _quantity,
        uint256 _basePricePerToken,
        uint256 _auctionStartTime,
        uint256 _auctionEndTime,
        address _seller
    );

    event Claim(uint256 _tokenId, address _seller, address _winner);

    event CancelAuction(uint256 _tokenId, address _owner);

    constructor(address _erc721, address _erc1155) {
        erc721 = _erc721;
        erc1155 = _erc1155;
        marketOwner = msg.sender;
    }

    function setOnSale(
        uint256 _tokenId,
        uint256 _quantity,
        uint256 _pricePerToken,
        bool _isERC721
    ) external {
        require(_pricePerToken > 0, "MarketPlace: invalid price");
        require(_quantity > 0, "MarketPlace: invalid quantity");
        require(
            !tokenOnSaleInfo[_isERC721][_tokenId][msg.sender].isOnSale,
            "MarketPlace: Already in sale"
        );
        require(
            !auctionInfo[_isERC721][_tokenId][msg.sender].isOnAuction,
            "MarketPlace: token already in auction"
        );

        // require(!auctionInfo[_isERC721][_tokenId][msg.sender].isOnAuction,"MarketPlace: token already in auction");

        tokenOnSaleInfo[_isERC721][_tokenId][msg.sender].tokenId = _tokenId;
        tokenOnSaleInfo[_isERC721][_tokenId][msg.sender]
            .pricePerToken = _pricePerToken;
        tokenOnSaleInfo[_isERC721][_tokenId][msg.sender].seller = msg.sender;
        tokenOnSaleInfo[_isERC721][_tokenId][msg.sender].isOnSale = true;
        tokenOnSaleInfo[_isERC721][_tokenId][msg.sender].isERC721 = _isERC721;
        if (_isERC721) {
            require(
                IERC721(erc721).getApproved(_tokenId) == address(this) ||
                    IERC721(erc721).isApprovedForAll(msg.sender, address(this)),
                "MarketPlace: not approved"
            );

            tokenOnSaleInfo[_isERC721][_tokenId][msg.sender].quantity = 1;
        } else {
            require(
                IERC1155(erc1155).isApprovedForAll(msg.sender, address(this)),
                "MarketPlace: not approved"
            );
            require(
                (IERC1155(erc1155).balanceOf(msg.sender, _tokenId)) >=
                    _quantity +
                        auctionInfo[_isERC721][_tokenId][msg.sender].quantity,
                "MarketPlace: token not avilable"
            );
            tokenOnSaleInfo[_isERC721][_tokenId][msg.sender]
                .quantity += _quantity;
        }
        emit SetOnSale(_tokenId, _quantity, _pricePerToken, msg.sender);
    }

    function purchase(
        uint256 _tokenId,
        uint256 _quantity,
        address _sellerAddress,
        bool _isERC721
    ) external payable {
        // bool _isERC721=tokenOnSaleInfo[_isERC721][_tokenId][_sellerAddress].isERC721;
        require(
            tokenOnSaleInfo[_isERC721][_tokenId][_sellerAddress].isOnSale,
            "MarketPlace: token not on sale"
        );
        require(
            msg.sender !=
                tokenOnSaleInfo[_isERC721][_tokenId][_sellerAddress].seller,
            "MarketPlace: you are the seller"
        );
        require(
            msg.value ==
                _quantity *
                    tokenOnSaleInfo[_isERC721][_tokenId][_sellerAddress]
                        .pricePerToken,
            "MarketPlace: invalid price"
        );
        require(
            _quantity <=
                tokenOnSaleInfo[_isERC721][_tokenId][_sellerAddress].quantity,
            "MarketPlace: insufficient token"
        );

        if (tokenOnSaleInfo[_isERC721][_tokenId][_sellerAddress].isERC721) {
            //require(_quantity == 1, "MarketPlace: only one token in sale");

            IERC721(erc721).transferFrom(
                tokenOnSaleInfo[_isERC721][_tokenId][_sellerAddress].seller,
                msg.sender,
                _tokenId
            );
            delete tokenOnSaleInfo[_isERC721][_tokenId][_sellerAddress];
        } else {
            IERC1155(erc1155).safeTransferFrom(
                tokenOnSaleInfo[_isERC721][_tokenId][_sellerAddress].seller,
                msg.sender,
                _tokenId,
                _quantity,
                bytes("Purchased")
            );
            tokenOnSaleInfo[_isERC721][_tokenId][_sellerAddress]
                .quantity -= _quantity;
            if (
                tokenOnSaleInfo[_isERC721][_tokenId][_sellerAddress].quantity ==
                0
            ) {
                delete tokenOnSaleInfo[_isERC721][_tokenId][_sellerAddress];
            }
        }
        emit Purchase(_tokenId, _quantity, _sellerAddress, msg.sender);
    }

    function cancelSale(uint256 _tokenId, bool _isERC721) external {
        require(
            tokenOnSaleInfo[_isERC721][_tokenId][msg.sender].isOnSale,
            "MarketPlace: not on sale"
        );
        delete tokenOnSaleInfo[_isERC721][_tokenId][msg.sender];
        emit StopSale(_tokenId, msg.sender);
    }

    function tokenOnAuctionInfo(
        uint256 _tokenId,
        bool _isERC721
    ) external view returns (tokenOnAuction memory) {
        require(
            auctionInfo[_isERC721][_tokenId][msg.sender].isOnAuction,
            "MarketPlace: token not in Auction"
        );
        return (auctionInfo[_isERC721][_tokenId][msg.sender]);
    }

    function Bidders(
        uint256 _tokenId,
        bool _isERC721
    ) external view returns (bidders[] memory) {
        bidders[] memory arrayBideers = biddingHistory[_isERC721][_tokenId][
            msg.sender
        ];
        return arrayBideers;
    }

    function setAuction(
        uint256 _tokenId,
        uint256 _quantity,
        uint256 _basePricePerToken,
        uint256 _auctionStartTime,
        uint256 _auctionEndTime,
        bool _isERC721
    ) external {
        require(
            !auctionInfo[_isERC721][_tokenId][msg.sender].isOnAuction,
            "MarketPlace: token already in Auction"
        );
        require(
            !tokenOnSaleInfo[_isERC721][_tokenId][msg.sender].isOnSale,
            "MarketPlace: token already in sale"
        );
        require(
            _basePricePerToken > 0,
            "MarketPlace: base price should postive"
        );
        require(_quantity > 0, "MarketPlace: quantity should positive");
        // require(
        //     _auctionEndTime > block.timestamp,
        //     "MarketPlace: invalid end time"
        // );
        require(
            _auctionStartTime > block.timestamp &&
                _auctionEndTime > _auctionStartTime,
            "MarketPlace: invalid time"
        );

        if (_isERC721) {
            require(
                msg.sender == ERC721(erc721).ownerOf(_tokenId),
                "MarketPlace: not token owner"
            );
            require(
                IERC721(erc721).getApproved(_tokenId) == address(this),
                "MarketPlace: not approved"
            );

            auctionInfo[_isERC721][_tokenId][msg.sender].quantity = 1;
        } else {
            require(
                IERC1155(erc1155).balanceOf(msg.sender, _tokenId) >= _quantity,
                "MarketPlace: not enough tokens"
            );
            require(
                IERC1155(erc1155).isApprovedForAll(msg.sender, address(this)),
                "MarketPlace: not approved"
            );
            // require(
            //     (IERC1155(erc1155).balanceOf(msg.sender, _tokenId)) >=
            //         _quantity +
            //             tokenOnSaleInfo[_isERC721][_tokenId][msg.sender]
            //                 .quantity,
            //     "MarketPlace: token not avilable "
            // );
            auctionInfo[_isERC721][_tokenId][msg.sender].quantity += _quantity;
        }
        auctionInfo[_isERC721][_tokenId][msg.sender].tokenId = _tokenId;
        auctionInfo[_isERC721][_tokenId][msg.sender]
            .basePricePerToken = _basePricePerToken;
        auctionInfo[_isERC721][_tokenId][msg.sender]
            .auctionStartTime = _auctionStartTime;
        auctionInfo[_isERC721][_tokenId][msg.sender]
            .auctionEndTime = _auctionEndTime;
        auctionInfo[_isERC721][_tokenId][msg.sender].seller = msg.sender;
        auctionInfo[_isERC721][_tokenId][msg.sender].isOnAuction = true;
        auctionInfo[_isERC721][_tokenId][msg.sender].isERC721 = _isERC721;
        emit SetAuction(
            _tokenId,
            _quantity,
            _basePricePerToken,
            _auctionStartTime,
            _auctionEndTime,
            msg.sender
        );
    }

    function bid(
        uint256 _tokenId,
        address _seller,
        bool _isERC721
    ) external payable {
        require(
            auctionInfo[_isERC721][_tokenId][_seller].isOnAuction,
            "MarketPlace: token not in Auction"
        );
        require(
            block.timestamp <=
                auctionInfo[_isERC721][_tokenId][_seller].auctionEndTime,
            "MarketPlace: auction is over"
        );
        require(
            msg.value >=
                auctionInfo[_isERC721][_tokenId][_seller].basePricePerToken,
            "MarketPlace: value should greater then base price"
        );
        require(
            msg.value > auctionInfo[_isERC721][_tokenId][_seller].maxBidAmount,
            "MarketPlace: bidding amount is not the highest"
        );
        biddingHistory[_isERC721][_tokenId][_seller].push(
            bidders(msg.sender, msg.value)
        );
        auctionInfo[_isERC721][_tokenId][_seller].maxBidAmount = msg.value;
        auctionInfo[_isERC721][_tokenId][_seller].maxBidAddress = msg.sender;
    }

    function claimToken(
        uint256 _tokenId,
        address _seller,
        bool _isERC721
    ) external {
        require(
            auctionInfo[_isERC721][_tokenId][_seller].isOnAuction,
            "MarketPlace: token not in auction"
        );
        require(
            block.timestamp >
                auctionInfo[_isERC721][_tokenId][_seller].auctionEndTime,
            "MarketPlace: auction is not over"
        );
        require(
            auctionInfo[_isERC721][_tokenId][_seller].maxBidAddress !=
                address(0),
            "MarketPlace: no one bidded"
        );
        require(
            msg.sender ==
                auctionInfo[_isERC721][_tokenId][_seller].maxBidAddress,
            "MarketPlace: only winner can access"
        );
        for (
            uint256 index;
            index < biddingHistory[_isERC721][_tokenId][_seller].length;
            index++
        ) {
            if (
                biddingHistory[_isERC721][_tokenId][_seller][index]
                    .bidderAddress ==
                msg.sender &&
                IERC1155(erc1155).isApprovedForAll(_seller, address(this)) &&
                IERC1155(erc1155).balanceOf(
                    auctionInfo[_isERC721][_tokenId][_seller].seller,
                    _tokenId
                ) >=
                auctionInfo[_isERC721][_tokenId][_seller].quantity
            ) {
                IERC1155(erc1155).safeTransferFrom(
                    auctionInfo[_isERC721][_tokenId][_seller].seller,
                    msg.sender,
                    _tokenId,
                    auctionInfo[_isERC721][_tokenId][_seller].quantity,
                    "0x00"
                );
            } else {
                payable(
                    biddingHistory[_isERC721][_tokenId][_seller][index]
                        .bidderAddress
                ).transfer(
                        biddingHistory[_isERC721][_tokenId][_seller][index]
                            .biddingAmount
                    );
            }
        }
        payable(_seller).transfer(
            auctionInfo[_isERC721][_tokenId][_seller].maxBidAmount
        );
        delete auctionInfo[_isERC721][_tokenId][_seller];
        delete biddingHistory[_isERC721][_tokenId][_seller];
        emit Claim(_tokenId, _seller, msg.sender);
    }

    function cancelAuction(uint256 _tokenId, bool _isERC721) external {
        require(
            auctionInfo[_isERC721][_tokenId][msg.sender].isOnAuction,
            "MarketPlace: token not in auction"
        );
        require(
            block.timestamp <
                auctionInfo[_isERC721][_tokenId][msg.sender].auctionEndTime,
            "MarketPlace: auction is over"
        );

        for (
            uint256 index;
            index < biddingHistory[_isERC721][_tokenId][msg.sender].length;
            index++
        ) {
            payable(
                biddingHistory[_isERC721][_tokenId][msg.sender][index]
                    .bidderAddress
            ).transfer(
                    biddingHistory[_isERC721][_tokenId][msg.sender][index]
                        .biddingAmount
                );
        }
        delete auctionInfo[_isERC721][_tokenId][msg.sender];
        delete biddingHistory[_isERC721][_tokenId][msg.sender];
        emit CancelAuction(_tokenId, msg.sender);
    }

    function cancelBid(
        uint256 _tokenId,
        bool _isERC721,
        address _seller
    ) external {
        require(
            auctionInfo[_isERC721][_tokenId][_seller].isOnAuction,
            "ERC721Auction: token not in Auction bid"
        );
        uint256 tempBidAmount;
        address tempAddress;
        uint256 tempMaxBidAmount;
        address tempMaxAddress;
        for (
            uint256 index;
            index < biddingHistory[_isERC721][_tokenId][_seller].length;
            index++
        ) {
            if (
                biddingHistory[_isERC721][_tokenId][_seller][index]
                    .bidderAddress == msg.sender
            ) {
                tempBidAmount = biddingHistory[_isERC721][_tokenId][_seller][
                    index
                ].biddingAmount;
                tempAddress = biddingHistory[_isERC721][_tokenId][_seller][
                    index
                ].bidderAddress;
                biddingHistory[_isERC721][_tokenId][_seller][index]
                    .bidderAddress = address(0);
                biddingHistory[_isERC721][_tokenId][_seller][index]
                    .biddingAmount = 0;
            } else {
                if (
                    biddingHistory[_isERC721][_tokenId][_seller][index]
                        .biddingAmount > tempMaxBidAmount
                ) {
                    tempMaxBidAmount = biddingHistory[_isERC721][_tokenId][
                        _seller
                    ][index].biddingAmount;
                    tempMaxAddress = biddingHistory[_isERC721][_tokenId][
                        _seller
                    ][index].bidderAddress;
                }
            }
            payable(tempAddress).transfer(tempBidAmount);
            auctionInfo[_isERC721][_tokenId][_seller]
                .maxBidAmount = tempMaxBidAmount;
            auctionInfo[_isERC721][_tokenId][_seller]
                .maxBidAddress = tempMaxAddress;
        }
    }
}


// File contracts/ERC20.sol

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {
    function name() external view returns (string memory);

    function symbol() external view returns (string memory);

    function decimals() external view returns (uint256);

    function totalSupply() external view returns (uint256);

    function balanceOf(address _owner) external view returns (uint256);

    function transfer(address _receiver, uint256 _numTokens) external;

    function approve(address _spender, uint256 _value) external;

    function allowance(address _owner, address _spender)
        external
        view
        returns (uint256 remaining);

    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) external;
}

contract ERC20 is IERC20 {
    string public tokenName;
    string public tokenSymbol;
    uint256 public decimalNum;
    uint256 public totalSupplyToken;
    address public owner;

    mapping(address => uint256) balances;
    mapping(address => mapping(address => uint256)) allowed;

    event Transfer(address _sender, address _receiver, uint256 _numTokens);

    event Approval(address _owner, address _spender, uint256 _value);

    constructor(
        string memory _tokenName,
        string memory _tokenSymbol,
        uint256 _decimalNum,
        uint256 _totalSupplyToken
    ) {
        owner = msg.sender;
        tokenName = _tokenName;
        tokenSymbol = _tokenSymbol;
        decimalNum = _decimalNum;
        mint(_totalSupplyToken);
    }

    modifier onlyowner() {
        require(owner == msg.sender, "ERC20: only owner can access");
        _;
    }

    function name() external view returns (string memory) {
        return tokenName;
    }

    function symbol() external view returns (string memory) {
        return tokenSymbol;
    }

    function decimals() external view returns (uint256) {
        return decimalNum;
    }

    function totalSupply() external view returns (uint256) {
        return totalSupplyToken;
    }

    function balanceOf(address _owner) external view returns (uint256) {
        return balances[_owner];
    }

    function transfer(address _receiver, uint256 _numTokens) external {
        require(_receiver!=address(0),"ERC20: receiver address can not be zero");
        require(_numTokens>0,"ERC20: quantity should not zero");
        require(
            balances[msg.sender] >= _numTokens,
            "LunaERC20: insufficient tokens to transfer"
        );

        balances[msg.sender] -= _numTokens;
        balances[_receiver] += _numTokens;
        emit Transfer(msg.sender, _receiver, _numTokens);
    }

    function approve(address _spender, uint256 _tokenNumber) external {
        require(
            balances[msg.sender] >= _tokenNumber,
            "ERC20: insufficient tokens to approve"
        );
        require(_spender!=address(0),"ERC20: spender address can not zero");
        require(_tokenNumber>0,"ERC20: quantity should not zero");

        allowed[msg.sender][_spender] += _tokenNumber;
        emit Approval(msg.sender, _spender, _tokenNumber);
    }

    function allowance(address _owner, address _spender)
        external
        view
        returns (uint256 remaining)
    {
        return allowed[_owner][_spender];
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _tokenNumber
    ) external {
        require(_from!=address(0),"ERC20: sender address zero");
        require(_to!=address(0),"ERC20: receiver address zero");
        require(_tokenNumber!=0,"ERC20: quantity to transfer zero");

        require(
            allowed[_from][msg.sender] >= _tokenNumber,
            "ERC20: insufficient allowed tokens"
        );
        balances[_from] -= _tokenNumber;
        allowed[_from][msg.sender] -= _tokenNumber;
        balances[_to] += _tokenNumber;
        emit Transfer(_from, _to, _tokenNumber);
    }

    function mint(uint256 _numTokens) public onlyowner {
        require(_numTokens>0,"ERC20: quantity should something");
        totalSupplyToken += _numTokens;
        balances[owner] += _numTokens;
        emit Transfer(address(0), owner, _numTokens);
    }

    function burn(uint256 _numTokens) external onlyowner {
        require(
            balances[owner] >= _numTokens,
            "LunaERC20: insufficient tokens to burn"
        );
        require(_numTokens!=0,"ERC20:number of token to burn is zero");
        totalSupplyToken -= _numTokens;
        balances[owner] -= _numTokens;
        emit Transfer(owner, address(0), _numTokens);
    }
}


// File contracts/IERC721Interface.sol

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
interface IERC721 {
    function balanceOf(address owner) external view returns (uint256 balance);

    function ownerOf(uint256 tokenId) external view returns (address owner);

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes calldata data
    ) external;

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) external;

    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) external;

    function approve(address to, uint256 tokenId) external;

    function setApprovalForAll(address operator, bool approved) external;

    function getApproved(uint256 tokenId)
        external
        view
        returns (address operator);

    function isApprovedForAll(address owner, address operator)
        external
        view
        returns (bool);

    event Transfer(
        address indexed from,
        address indexed to,
        uint256 indexed tokenId
    );

    event Approval(
        address indexed owner,
        address indexed approved,
        uint256 indexed tokenId
    );

    event ApprovalForAll(
        address indexed owner,
        address indexed operator,
        bool approved
    );
}


// File contracts/IERC721Receiver.sol

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC721TokenReceiver
{

  function onERC721Received(
    address _operator,
    address _from,
    uint256 _tokenId,
    bytes calldata _data
  )
    external
    returns(bytes4);

}
