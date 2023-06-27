// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./IToken.sol";

contract DecentralBank {
    address public bankOwner;
    address public erc20;
    uint256 public planId;

    struct StakeInfo {
        uint256 startTS;
        uint256 endTS;
        uint256 amount;
        uint256 profit;
    }

    struct plans {
        uint256 planId;
        uint256 duration;
        uint256 minToken;
        uint256 intrestRate;
    }

    mapping(uint256 => plans) public stakePlans;
    mapping(address => mapping(uint256 => StakeInfo)) public myStack;
    mapping(address => mapping(uint256 => bool)) public isStaked;
    mapping(address => mapping(uint256 => uint256)) private profit;

    constructor(address _erc20) {
        erc20 = _erc20;
        bankOwner = msg.sender;
    }

    function makeStackPlans(
        uint256 duration,
        uint256 minToken,
        uint256 intrestRate
    ) public {
        require(duration >= 60, "decentralBank: minimum duration is 1 min");
        require(minToken > 0, "decentralBank: setting mintoken as 0");
        require(intrestRate > 0, "decentralBank: setting intrest rate as 0");

        planId++;
        stakePlans[planId] = plans(planId, duration, minToken, intrestRate);
    }

    function deposite(uint256 _planId, uint256 _amount) external {
        require(_planId <= planId, "decentralBank: invalid plan id");
        require(
            _amount >= stakePlans[_planId].minToken,
            "decentralBank: staking less than the minimum token"
        );
        require(
            IERC20(erc20).balanceOf(msg.sender) >= _amount,
            "decentralBank: insufficient balance"
        );
        require(
            IERC20(erc20).allowance(msg.sender, address(this)) >= _amount,
            "decentralBank: insufficient allowance"
        );
        if (isStaked[msg.sender][_planId]) {
            profit[msg.sender][_planId] = calculateProfit(_planId, msg.sender);
            myStack[msg.sender][_planId].profit = profit[msg.sender][_planId];
            myStack[msg.sender][_planId].startTS = block.timestamp;
            myStack[msg.sender][_planId].amount += myStack[msg.sender][_planId]
                .amount;
        } else {
            myStack[msg.sender][_planId] = StakeInfo(
                block.timestamp,
                block.timestamp + stakePlans[_planId].duration,
                block.timestamp,
                _amount
            );
            isStaked[msg.sender][_planId] = true;
        }
        IERC20(erc20).transferFrom(msg.sender, address(this), _amount);
    }

    function calculateProfit(uint256 _planId, address user)
        public
        view
        returns (uint256)
    {
        StakeInfo memory tempStakeInfo = myStack[user][_planId];
        uint256 intrestRate = stakePlans[_planId].intrestRate;
        uint256 _profit;
        if (block.timestamp < tempStakeInfo.endTS)
            _profit =
                (tempStakeInfo.amount *
                    (block.timestamp - tempStakeInfo.startTS) *
                    intrestRate) /
                ((tempStakeInfo.endTS - tempStakeInfo.startTS) * 100);
        else
            _profit =
                (tempStakeInfo.amount *
                    (tempStakeInfo.endTS - tempStakeInfo.startTS) *
                    intrestRate) /
                ((tempStakeInfo.endTS - tempStakeInfo.startTS) * 100);

        return _profit + profit[user][_planId];
    }

    function withdrawal(uint256 _planId) external {
        require(isStaked[msg.sender][_planId], "decentralBank: not a staker");
        uint256 amount = calculateProfit(_planId, msg.sender) +
            myStack[msg.sender][_planId].amount;
        if (amount > IERC20(erc20).balanceOf(address(this)))
            IToken(erc20).mint(
                address(this),
                amount - IERC20(erc20).balanceOf(address(this))
            );
        IERC20(erc20).transfer(msg.sender, amount);
        delete myStack[msg.sender][_planId];
        delete isStaked[msg.sender][_planId];
        delete profit[msg.sender][_planId];
    }

    function claimReward(uint256 _planId) external {
        require(
            myStack[msg.sender][_planId].endTS < block.timestamp,
            "decentralBank: staking is not over"
        );
        uint256 amount = myStack[msg.sender][_planId].amount;
        uint256 _profit = calculateProfit(_planId, msg.sender);
        uint256 balance = IERC20(erc20).balanceOf(address(this));
        if (balance < amount + _profit) {
            IToken(erc20).mint(address(this), (amount + _profit - balance));
        }

        IERC20(erc20).transfer(msg.sender, amount + _profit);
        delete myStack[msg.sender][_planId];
        delete isStaked[msg.sender][_planId];
        delete profit[msg.sender][_planId];
    }
}
