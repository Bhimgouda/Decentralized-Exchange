// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./LiquidityToken.sol";

error Pool__InvalidTokenRatio();
error Pool__ZeroLiquidityToken();
error Pool__InvalidToken();

contract Pool is LiquidityToken {
    IERC20 private immutable i_token0;
    IERC20 private immutable i_token1;

    uint256 private s_reserve0;
    uint256 private s_reserve1;

    uint private immutable i_fee;

    event AddedLiquidity(
        uint256 indexed liquidityToken,
        address token0,
        uint256 indexed amount0,
        address token1,
        uint256 indexed amount1
    );
    event RemovedLiquidity(
        uint256 indexed liquidityToken,
        address token0,
        uint256 indexed amount0,
        address token1,
        uint256 indexed amount1
    );
    event Swapped(
        address tokenIn,
        uint256 indexed amountIn,
        address tokenOut,
        uint256 indexed amountOut
    );

    constructor(
        address token0,
        address token1,
        uint8 fee
    ) LiquidityToken("LiquidityToken", "LT") {
        i_token0 = IERC20(token0);
        i_token1 = IERC20(token1);
        i_fee = fee;
    }

    function _updateLiquidity(uint256 reserve0, uint256 reserve1) internal {
        s_reserve0 = reserve0;
        s_reserve1 = reserve1;
    }

    function swap(address _tokenIn, uint256 amountIn) external {
        // Objective: To Find amount of Token Out

        require(
            _tokenIn == address(i_token0) || _tokenIn == address(i_token1),
            "Invalid Token"
        );

        bool isToken0 = _tokenIn == address(i_token0) ? true : false;

        (
            IERC20 tokenIn,
            IERC20 tokenOut,
            uint256 resIn,
            uint256 resOut
        ) = isToken0
                ? (i_token0, i_token1, s_reserve0, s_reserve1)
                : (i_token1, i_token0, s_reserve1, s_reserve0);

        tokenIn.transferFrom(msg.sender, address(this), amountIn);

        // xy = k
        // (x + dx)(y - dy) = k
        // xy - xdy + dxy -dxdy = xy (k=xy)
        // dy(x + dx) = dxy
        // dy = dxy/(x+dx)
        uint amountInWithFee = (amountIn * (10000 - i_fee)) / 1000;
        uint256 amountOut = (amountInWithFee * resOut) /
            (resIn + amountInWithFee);

        (uint256 res0, uint256 res1) = isToken0
            ? (resIn + amountIn, resOut - amountOut)
            : (resOut - amountOut, resIn + amountIn);

        _updateLiquidity(res0, res1);
        tokenOut.transfer(msg.sender, amountOut);

        emit Swapped(address(tokenIn), amountIn, address(tokenOut), amountOut);
    }

    function addLiquidity(uint256 amount0, uint256 amount1) external {
        // x/y = dx/dy
        if (s_reserve0 > 0 || s_reserve1 > 0) {
            if (s_reserve0 / s_reserve1 != amount0 / amount1)
                revert Pool__InvalidTokenRatio();
        }

        i_token0.transferFrom(msg.sender, address(this), amount0);
        i_token1.transferFrom(msg.sender, address(this), amount1);

        // The Liquidity token minted should be proportional to Liquidity Provided
        // x + dx/x = y + dy/y
        // y(x + dx) = x(y + dy)
        // yx + dxy = xy + dyx
        // dxy = dyx
        // dxy/x = dy

        uint256 liquidityTokenSupply = totalSupply();
        uint256 liquidityTokens;
        if (liquidityTokenSupply > 0) {
            liquidityTokens = (amount0 * liquidityTokenSupply) / s_reserve0;
        } else {
            liquidityTokens = _sqrt(amount0 * amount1);
        }

        if (liquidityTokens == 0) revert Pool__ZeroLiquidityToken();
        _mint(msg.sender, liquidityTokens);
        _updateLiquidity(s_reserve0 + amount0, s_reserve1 + amount1);

        emit AddedLiquidity(
            liquidityTokens,
            address(i_token0),
            amount0,
            address(i_token1),
            amount1
        );
    }

    function removeLiquidity(uint256 liquidityTokens) external {
        require(liquidityTokens > 0, "0 Liquidity Tokens");

        // t = totalSupply of shares
        // s = shares
        // l = liquidity (reserve0 || reserve1)
        // dl = liquidity to be removed (amount0 || amount1)

        // The change in liquidity/token reserves should be propotional to shares burned
        // t - s/t = l - dl/l
        // dl = ls/t

        uint256 tokenBalance = balanceOf(msg.sender);

        uint256 amount0 = (s_reserve0 * tokenBalance) / totalSupply();
        uint256 amount1 = (s_reserve1 * tokenBalance) / totalSupply();

        _burn(msg.sender, liquidityTokens);
        _updateLiquidity(s_reserve0 - amount0, s_reserve1 - amount1);

        i_token0.transfer(msg.sender, amount0);
        i_token1.transfer(msg.sender, amount1);

        emit RemovedLiquidity(
            liquidityTokens,
            address(i_token0),
            amount0,
            address(i_token1),
            amount1
        );
    }

    function _sqrt(uint y) private pure returns (uint z) {
        if (y > 3) {
            z = y;
            uint x = y / 2 + 1;
            while (x < z) {
                z = x;
                x = (y / x + x) / 2;
            }
        } else if (y != 0) {
            z = 1;
        }
    }

    function getAmountOut(
        address _tokenIn,
        uint256 amountIn
    ) public view returns (uint256 amountOut) {
        require(
            _tokenIn == address(i_token0) || _tokenIn == address(i_token1),
            "Invalid Token"
        );

        bool isToken0 = _tokenIn == address(i_token0) ? true : false;

        (uint256 resIn, uint256 resOut) = isToken0
            ? (s_reserve0, s_reserve1)
            : (s_reserve1, s_reserve0);
        uint amountInWithFee = (amountIn * (10000 - i_fee)) / 10000;
        amountOut = (amountInWithFee * resOut) / (resIn + amountInWithFee);
    }

    function getReserves() public view returns (uint256, uint256) {
        return (s_reserve0, s_reserve1);
    }

    function getTokens() public view returns (address, address) {
        return (address(i_token0), address(i_token1));
    }
}
