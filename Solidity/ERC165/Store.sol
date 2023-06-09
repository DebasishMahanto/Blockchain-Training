// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./IERC165.sol";
import "./IStore.sol";

contract Store is IStore,IERC165{
    uint256 internal value;

    function setValue(uint256 num) external {
        value = num;
    }

    function getValue() external view returns (uint256) {
        return value;
    }

    function supportsInterface(
        bytes4 interfaceId
    ) external pure returns (bool) {
        return (interfaceId == this.getValue.selector);
    }
}
