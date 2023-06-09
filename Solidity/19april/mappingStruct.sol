// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


struct student{
    string name;
    uint class;
    uint marks;
}

contract Mapping{
    mapping (uint => student) public data;
    function setter(uint _rollnum, string memory _name, uint _class, uint _marks) public {
        data[_rollnum] = student(_name,_class,_marks);
    }
}