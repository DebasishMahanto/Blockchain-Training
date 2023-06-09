// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol";

contract ERC20Update is ERC20{
    // string public tokenName;
    // string public tokenSymbol;
    uint256 public tokenPrice;
    address owner;
    //uint256 public totalSupply;

    constructor(uint256 _tokenPrice) ERC20("luna","ln"){
        tokenPrice=_tokenPrice;
        owner=msg.sender;
        //quantity=_quantity;
    }

    function mint(uint256 _quantity) external payable {
        require(_quantity>0,"ERC20Update: invalid quantity");
        require(msg.value== (tokenPrice*_quantity)/10**decimals(),"ERCUpdate : invalid price");
        _mint(msg.sender, _quantity);
    }

    function burn(uint256 _quantity) external {
        require(_quantity>0 ,"ERC20Update: invalid quantity");
        // require(balanceOf(msg.sender)>=_quantity,"ERC20Update: insufficient token");
        payable (msg.sender).transfer((tokenPrice*_quantity)/10**decimals());
        _burn(msg.sender, _quantity);

    }

    function transferContractBalance() external {
        require(msg.sender==owner,"ERC20Update: Only owner can access");
        payable (owner).transfer(address(this).balance);
    }

}