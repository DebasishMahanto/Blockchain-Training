// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Value {
    address Address;

    constructor() {
        Address = msg.sender;
    }

    modifier owner() {
        require(Address == msg.sender);
        _;
    }

    function isStudent() public view owner returns (bool) {
        bool student;
        if (Address == msg.sender) {
            student = true;
        }
        //    bool isonwer=true;
        return student;
    }

    function result() public view owner returns (uint256) {
        uint256 marks = 560;
        return (marks);
    }

    string public name = "Debasish";

    bytes1 charcter = "D";

    enum language {
        Solidity,
        Java,
        Python,
        JavaScript
    }

    function Enum() public pure returns (language) {
        return language.Java;
    }

    uint256[4] public arr = [5, 10, 15, 20];

    function Length() public view returns (uint256) {
        return arr.length;
    }

    function editArray(uint256 index, uint256 value) public {
        arr[index] = value;
    }

    uint[] public dArr;
    function pushElement(uint item) public{
        dArr.push(item);
    }
    function len() public view returns (uint){
        return dArr.length;
    }
    function popElement() public 
    {
        dArr.pop();
    }
}
