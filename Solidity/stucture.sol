// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

struct Student{
    string name;
    uint rollnum;
    uint marks;
}

contract Demo{

    Student public s1;
    constructor(string memory _name, uint _rollnum, uint _marks){
        s1.name=_name;
        s1.rollnum=_rollnum;
        s1.marks=_marks;
    }

    function edit(string memory _name, uint _rollnum, uint _marks) public {
        Student memory newStudent=Student({
            name:_name,
            rollnum:_rollnum,
            marks:_marks
        });
        s1=newStudent;
    }

    mapping (uint=>string) public empID;
    function setter(uint key, string memory value) public {
        empID[key]=value;
    }
}