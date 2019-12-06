pragma solidity ^0.4.18;

contract CustomToken {
  string public name;
  string public symbol;
  uint8 public decimals;
  address owner;

  mapping (address => uint256) public balanceOf;

  event Transfer(address _from, address _to, uint _value);

  constructor(string _tokenName, string _tokenSymbol, uint8 _decimalUnits, uint256 _initialSupply, address _owner) public {
    name = _tokenName;
    symbol = _tokenSymbol;
    decimals = _decimalUnits;
    balanceOf[_owner] = _initialSupply;
    owner = _owner;
  }

  function transfer(address _to, uint256 _value) public {
    require(balanceOf[owner] >= _value);
    require(balanceOf[owner] + _value >= balanceOf[_to]);
    balanceOf[owner] -= _value;
    balanceOf[_to] += _value;
    emit Transfer(owner, _to, _value);
  }
}
