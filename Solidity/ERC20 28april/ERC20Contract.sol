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

contract LunaERC20 is IERC20 {
    string public tokenName;
    string public tokenSymbol;
    uint256 public decimalNum;
    uint256 public totalSupplyToken;

    mapping(address => uint256) private balances;
    mapping(address => mapping(address => uint256)) private allowed;

    event Transfer(address _sender, address _receiver, uint256 _numTokens);

    event Approval(address _owner, address _spender, uint256 _value);

    constructor(
        string memory _tokenName,
        string memory _tokenSymbol,
        uint256 _decimalNum,
        uint256 _totalSupplyToken
    ) {
        tokenName = _tokenName;
        tokenSymbol = _tokenSymbol;
        decimalNum = _decimalNum;
        mint(_totalSupplyToken);
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
            "LunaERC20: insufficient tokens to approve"
        );
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
        require(
            allowed[_from][msg.sender] >= _tokenNumber,
            "LunaERC20: insufficient allowed tokens"
        );
        balances[_from] -= _tokenNumber;
        allowed[_from][msg.sender] -= _tokenNumber;
        balances[_to] += _tokenNumber;
        emit Transfer(_from, _to, _tokenNumber);
    }

    function mint(uint256 _numTokens) private {
        totalSupplyToken += _numTokens;
        balances[msg.sender] += _numTokens;
        emit Transfer(address(0),msg.sender, _numTokens);
    }
}
