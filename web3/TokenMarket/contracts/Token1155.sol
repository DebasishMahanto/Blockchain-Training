// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol";
import "./IToken1155.sol";

contract Token1155 is ERC1155URIStorage, IToken1155 {
    address public owner;
    uint256 public totalTokenMinted;

    mapping(address => uint256[]) private balances;
    mapping(string => bool) public isUsedURI;
    mapping(uint256 => bool) public isTokenMinted;

    // string uri="uri";

    constructor() ERC1155("") {
        owner = msg.sender;
    }

    function mint(
        address to,
        uint256 tokenId,
        uint256 quantity,
        string memory tokenURI
    ) public {
        require(quantity > 0, "Token1155: invalid quantity");
        if (!isTokenMinted[tokenId]) {
            require(!(isUsedURI[tokenURI]), "Token1155: URI already in used");
            _setURI(tokenId, tokenURI);
            isUsedURI[tokenURI] = true;
            totalTokenMinted++;
        }
        if (balanceOf(to, tokenId) == 0) {
            balances[to].push(tokenId);
        }
        _mint(to, tokenId, quantity, "");
        isTokenMinted[tokenId] = true;
    }

    function burn(uint256 tokenId, uint256 quantity) public {
        _burn(msg.sender, tokenId, quantity);
        if (balanceOf(msg.sender, tokenId) == 0) {
            removeId(msg.sender, tokenId);
        }
    }

    function mintBatch(
        address to,
        uint256[] memory ids,
        uint256[] memory quentities,
        string[] memory uries
    ) external {
        require(
            ids.length == quentities.length &&
                quentities.length == uries.length,
            "Token1155: ids,quanties and uries length mismatch"
        );
        for (uint256 i; i < ids.length; i++) {
            mint(to, ids[i], quentities[i], uries[i]);
        }
    }

    function burnBatch(
        uint256[] memory ids,
        uint256[] memory quentities
    ) external {
        require(
            ids.length == quentities.length,
            "Token1155: ids and quanties length mismatch"
        );
        for (uint256 i; i < ids.length; i++) {
            burn(ids[i], quentities[i]);
        }
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        uint256 amount
    ) public {
        require(
            from == _msgSender() || isApprovedForAll(from, _msgSender()),
            "ERC1155: caller is not token owner or approved"
        );

        if (balanceOf(to, tokenId) == 0) {
            balances[from].push(tokenId);
        }

        _safeTransferFrom(from, to, tokenId, amount, "0x00");

        if (balanceOf(from, tokenId) == 0) {
            removeId(from, tokenId);
        }
    }

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

        for (uint256 index = 0; index < ids.length; index++) {
            if (balanceOf(to, ids[index]) == 0) {
                balances[to].push(ids[index]);
            }
        }

        _safeBatchTransferFrom(from, to, ids, amounts, data);

        for (uint256 index = 0; index < ids.length; index++) {
            if (balanceOf(from, ids[index]) == 0) {
                removeId(from, ids[index]);
            }
        }
    }

    function removeId(address tokenOwner, uint256 tokenId) private {
        // uint tempId;
        uint256[] storage tokenIds = balances[tokenOwner];
        for (uint256 i = 0; i < tokenIds.length; i++) {
            if (tokenIds[i] == tokenId) {
                tokenIds[i] = tokenIds[tokenIds.length - 1];
                tokenIds.pop();
                break;
            }
        }
    }

    function getBalances(
        address _owner
    ) external view returns (uint256[] memory) {
        return balances[_owner];
    }

    function checkURI(string memory uri) public view returns (bool) {
        if (isUsedURI[uri]) {
            return true;
        } else {
            return false;
        }
    }
}
