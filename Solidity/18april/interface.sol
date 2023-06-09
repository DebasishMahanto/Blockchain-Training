// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface Calculator{
    function addition() external view returns(uint);
    function substraction() external view returns(uint);
    function multiplication() external view returns(uint);
    function division() external view returns(uint);
}

contract Test is Calculator{
    uint num1;
    uint num2;
     constructor(){
         num1=9;
         num2=3;
     }
    
    function addition() public view override returns (uint){
        return num1+num2;
    }
    function substraction() public view override returns (uint){
        return num1-num2;
    }

    function multiplication() public view override returns (uint){
        return num1*num2;
    }

    function division() public view override returns (uint){
        return num1/num2;
    }
}
