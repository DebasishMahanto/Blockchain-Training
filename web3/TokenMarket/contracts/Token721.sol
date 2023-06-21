// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "./IToken721.sol";

contract Token721 is ERC721URIStorage, IToken721 {
    string private _name;
    string private _symbol;
    uint256 public _tokenId;
    address private owner;

    mapping(address => uint256[]) public balances;
    mapping(string => bool) public givenURI;

    constructor(string memory name, string memory symbol) ERC721(name, symbol) {
        _name = name;
        _symbol = symbol;
        owner = msg.sender;
    }

    function mint(address to, string memory tokenURI) external {
        _tokenId++;
        _mint(to, _tokenId);
        _setTokenURI(_tokenId, tokenURI);
        balances[to].push(_tokenId);
        givenURI[tokenURI] = true;
    }

    function burn(uint256 tokenId) external {
        require(ownerOf(tokenId) == msg.sender, "Token721: not token owner");
        _burn(tokenId);
        removeId(msg.sender, tokenId);
        // givenURI[tokenURI]=;
    }

    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public virtual override(ERC721, IERC721) {
        _transfer(from, to, tokenId);
        balances[to].push(tokenId);
        removeId(from, tokenId);
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public virtual override(ERC721, IERC721) {
        safeTransferFrom(from, to, tokenId, "");
        balances[to].push(tokenId);
        removeId(from, tokenId);
    }

    function getBalances(
        address _owner
    ) external view returns (uint256[] memory) {
        return balances[_owner];
    }

    function checkURI(string memory uri) public view returns (bool) {
        if (givenURI[uri]) {
            return true;
        } else {
            return false;
        }
    }

    function removeId(address tokenOwner, uint256 tokenId) private {
        // uint tempId;
        uint256[] storage tokenIds = balances[tokenOwner];
        for (uint256 i = 0; i < tokenIds.length; i++) {
            if (tokenIds[i] == tokenId) {
                tokenIds[i] = tokenIds[tokenIds.length - 1];
                tokenIds.pop();
                return;
            }
        }
    }
}
