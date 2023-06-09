// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./IStore.sol";
import "./IERC165.sol";

contract StoreCheck is IStore{
    address storeAddress;

    constructor(address _storeAddress) {
        storeAddress = _storeAddress;
    }

    function getValue() external view returns (uint256) {
        require(
            IERC165(storeAddress).supportsInterface(getInterfaceId()),
            "doesnot support"
        );
        return IStore(storeAddress).getValue();
    }

    function getInterfaceId() public pure returns (bytes4){
          return  this.getValue.selector;
    }
}
