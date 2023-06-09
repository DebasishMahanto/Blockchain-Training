// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {
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

contract TerraERC20 is IERC20 {
    string public tokenName;
    string public tokenSymbol;
    uint256 public decimalNum;
    uint256 public totalSupplyToken;
    uint256 public maximumSupplyToken;
    uint256 public tokenPrice;
    address payable internal owner;

    mapping(address => uint256) balances;
    mapping(address => mapping(address => uint256)) allowed;

    event Transfer(address _sender, address _receiver, uint256 _numTokens);

    event Approval(address _owner, address _spender, uint256 _value);

    constructor(
        string memory _tokenName,
        string memory _tokenSymbol,
        uint256 _decimalNum,
        //uint256 _totalSupplyToken,
        uint256 _maximumSupplyToken,
        uint256 _tokenPrice
    ) {
        require(_tokenPrice > 0, "TerraERC20: token price should not 0");
        owner = payable(msg.sender);
        tokenName = _tokenName;
        tokenSymbol = _tokenSymbol;
        decimalNum = _decimalNum;
        maximumSupplyToken = _maximumSupplyToken;
        tokenPrice = _tokenPrice;
        // mint(_totalSupplyToken);
    }

    modifier onlyowner() {
        require(owner == msg.sender, "TerraERC20: only owner can access");
        _;
    }

    function balanceOf(address _owner) external view returns (uint256) {
        return balances[_owner];
    }

    function transfer(address _receiver, uint256 _numTokens) public {
        require(
            balances[msg.sender] >= _numTokens,
            "TerraERC20: insufficient tokens to transfer"
        );
        balances[msg.sender] -= _numTokens;
        balances[_receiver] += _numTokens;
        emit Transfer(msg.sender, _receiver, _numTokens);
    }

    function approve(address _spender, uint256 _tokenNumber) external {
        require(
            balances[msg.sender] >= _tokenNumber,
            "TerraERC20: insufficient tokens to approve"
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
            "TerraERC20: insufficient allowed tokens"
        );
        balances[_from] -= _tokenNumber;
        allowed[_from][msg.sender] -= _tokenNumber;
        balances[_to] += _tokenNumber;
        emit Transfer(_from, _to, _tokenNumber);
    }

    function mint(uint256 _numTokens) public onlyowner {
        require(
            totalSupplyToken + balances[address(0)] + _numTokens <=
                maximumSupplyToken,
            "TerraERC20: exceed limit to mint"
        );
        totalSupplyToken += _numTokens;
        balances[address(this)] += _numTokens;
        emit Transfer(address(0), address(this), _numTokens);
    }

    function burn(uint256 _numTokens) external onlyowner {
        require(
            balances[owner] >= _numTokens,
            "TerraERC20: insufficient tokens to burn"
        );

        // balances[owner] -= _numTokens;

        transfer(address(0), _numTokens);
        totalSupplyToken -= _numTokens;

        emit Transfer(owner, address(0), _numTokens);
    }

    function purchaseToken(uint256 _numTokens) external payable {
        require(
            balances[address(this)] >= _numTokens,
            "TerraERC20: insufficient tokens in stock"
        );
            require(
                msg.value >= _numTokens * tokenPrice/10**decimalNum,
                "TerraERC20: insufficient ether to purchase"
            );
            balances[msg.sender] += _numTokens;
            balances[address(this)] -= _numTokens;
            emit Transfer(address(this), msg.sender, _numTokens);
        
    }

    function trnasferAllBalance() external onlyowner {
        require(
            address(this).balance >= 1,
            "TerraERC20: minimum withdrawal is 1wei"
        );
        owner.transfer(address(this).balance);
    }

    function changePrice(uint _newPrice) external onlyowner{
         require(_newPrice > 0, "TerraERC20: token price should not 0");
        tokenPrice=_newPrice;
    }
}
