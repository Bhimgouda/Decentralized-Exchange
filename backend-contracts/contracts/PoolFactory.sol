// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "./Pool.sol";

error PoolFactory__PairAlreadyExists();

struct PoolStruct {
    address poolAddress;
    uint8 fee;
}

contract PoolFactory {
    mapping(address => mapping(address => PoolStruct)) private s_pools;

    constructor() {}

    function createPool(
        address token0,
        address token1,
        uint8 fee
    ) external returns (address) {
        require(fee > 100, "Fee cannot be more than 1%");
        require(token0 != token1, "Same token Not Allowed");
        if (
            s_pools[token0][token1].fee == fee ||
            s_pools[token0][token1].fee == fee
        ) {
            revert PoolFactory__PairAlreadyExists();
        }

        Pool pool = new Pool(token0, token1, fee);
        s_pools[token0][token1] = PoolStruct(address(pool), fee);
        return address(pool);
    }

    function getPool(
        address token0,
        address token1,
        uint8 fee
    ) external view returns (address) {
        if (s_pools[token0][token1].fee == fee)
            return s_pools[token0][token1].poolAddress;
        if (s_pools[token1][token0].fee == fee)
            return s_pools[token1][token0].poolAddress;
        else return address(0);
    }
}
