// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract A{
    function f1() public pure returns (uint){
        return 1;
    }
    function f2() private pure returns (uint){
        return 2;
    }
    function f3() internal pure returns (uint){
        return 3;
    }
    function f4() external pure returns (uint){
        return 4;
    }
}

contract B is A{
    uint public value1=f1();
   // uint public value2=f2();
    uint public value3=f3();
    // uint public value4=f4();
}

contract C{

    A obj=new A();
     uint public value1c=obj.f1();
    // uint public value2c=obj.f2();
    // uint public value3c=obj.f3();
     uint public value4c=obj.f4();

}