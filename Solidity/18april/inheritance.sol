// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


contract Main{
    function f1() public pure returns(string memory){
        return "from contract Main";
    }
    function f2() public pure returns(string memory){
        return "from contract Main";
    }
    function f3() public pure virtual returns(string memory){
        return "from contract Main";
    }
    function f4() public pure virtual returns(string memory){
        return "from contract Main";
    }
}

contract Value{
    uint public value1=6;
    uint public value2=3;
}


contract Sub1 is Main{
    function f4() public pure virtual  override returns(string memory){
        return "from contract Sub1";
    }

}


contract Sub2 is Sub1{
    function f4() public pure override  returns(string memory){
        return "from contract Sub2";
    }

}

contract D is Main{
    function f3() public pure override returns(string memory){
        return "from contract D";
    }

}

contract Final is Main,Value{
    uint public value3=45;
}