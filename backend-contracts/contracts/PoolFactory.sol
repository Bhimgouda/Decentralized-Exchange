// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "./Pool.sol";
import "hardhat/console.sol";

error PoolFactory__PairAlreadyExists();

contract PoolFactory {
    address[3][] private s_poolsList;
    mapping(address => mapping(address => PoolStruct)) private s_tokensToPool;

    struct PoolStruct {
        address poolAddress;
        uint8 fee;
    }

    event PoolCreated(
        address indexed token0,
        address indexed token1,
        uint8 fee,
        address indexed poolAddress
    );

    function createPool(address token0, address token1, uint8 fee) external {
        require(fee <= 100, "Fee cannot be more than 1%");
        require(token0 != token1, "Same token Not Allowed");
        require(
            s_tokensToPool[token0][token1].fee != fee &&
                s_tokensToPool[token1][token0].fee != fee,
            "Token Pair Already exists"
        );

        Pool pool = new Pool(token0, token1, fee);
        address poolAddress = address(pool);

        s_tokensToPool[token0][token1] = PoolStruct(poolAddress, fee);
        s_poolsList.push([token0, token1, poolAddress]);

        emit PoolCreated(token0, token1, fee, poolAddress);
    }

    function getPool(
        address token0,
        address token1,
        uint8 fee
    ) external view returns (address) {
        if (s_tokensToPool[token0][token1].fee == fee)
            return s_tokensToPool[token0][token1].poolAddress;
        if (s_tokensToPool[token1][token0].fee == fee)
            return s_tokensToPool[token1][token0].poolAddress;
        else return address(0);
    }

    function getAllPools() external view returns (address[3][] memory) {
        return s_poolsList;
    }
}
