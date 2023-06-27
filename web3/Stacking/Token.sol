// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./IToken.sol";

contract MyToken is ERC20, ERC20Burnable, Ownable, IToken {
    constructor() ERC20("TOKEN20", "TKN20") {}

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}
