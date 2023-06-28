// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract LiquidityToken is ERC20 {
    uint private s_totalSupply;
    mapping(address => uint) private s_balances;

    constructor(string memory name, string memory symbol) ERC20(name, symbol) {}

    function _mint(address to, uint amount) internal override {
        s_totalSupply += amount;
        s_balances[to] += amount;
    }

    function _burn(address from, uint amount) internal override {
        s_totalSupply -= amount;
        s_balances[from] -= amount;
    }

    //////////////////////////
    ////// GETTERS //////////
    ////////////////////////

    function _getTokenSupply() internal view returns (uint256) {
        return s_totalSupply;
    }

    function _getBalanceOf(address account) internal view returns (uint256) {
        return s_balances[account];
    }
}
