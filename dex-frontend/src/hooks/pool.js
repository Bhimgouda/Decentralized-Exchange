import POOL_ABI from "../constants/poolAbi.json"
import { utils } from "ethers";

const poolFunctionParams = {
    abi: POOL_ABI
}

function poolCaller(runContractFunction, contractAddress, functionName, params, ){
    return runContractFunction({
        params: {...poolFunctionParams, contractAddress, functionName, params},
    })
}

// HOOKs

export async function swap(runContractFunction, contractAddress, _tokenIn, amountIn){
    amountIn = utils.parseEther(amountIn.toString()).toString()
    const tx = await poolCaller(runContractFunction, contractAddress, "swap", {_tokenIn, amountIn})
    const receipt = await tx.wait(1)
    const {amountOut} = receipt.events[2].args

    return parseFloat(utils.formatUnits(amountOut, "ether")).toFixed().toString()
}

export async function addLiquidity(runContractFunction, contractAddress, amount0, amount1){
    amount0 = utils.parseEther(amount0.toString()).toString()
    amount1 = utils.parseEther(amount1.toString()).toString()

    const tx = await poolCaller(runContractFunction, contractAddress,"addLiquidity", {amount0, amount1})
    const receipt = await tx.wait(1)
    const {liquidityToken} = receipt.events[0].args
    return utils.formatUnits(liquidityToken, "ether")
}

// come back later for liquidity tokens decimal
export async function removeLiquidity(runContractFunction, contractAddress, liquidityTokens){
    const tx = await poolCaller(runContractFunction, contractAddress,"removeLiquidity", {liquidityTokens})
    const receipt = await tx.wait(1)
    let {token0, amount0, token1, amount1} = receipt.events[0].args
    amount0 = utils.formatUnits(amount0, "ether")
    amount1 = utils.formatUnits(amount1, "ether")
    return {token0, amount0, token1, amount1}
}

export async function getAmountOut(runContractFunction, contractAddress,_tokenIn, amountIn){
    amountIn = utils.parseEther(amountIn).toString()
    const amountOut = await poolCaller(runContractFunction, contractAddress, "getAmountOut", {_tokenIn, amountIn})
    if(amountOut._hex.startsWith("0x00")) return 0
    return parseFloat(utils.formatUnits(amountOut, "ether")).toFixed(2).toString()
}

export async function getReserves(runContractFunction, contractAddress){
    let reserves = await poolCaller(runContractFunction, contractAddress,"getReserves", {})
    reserves = reserves.map(reserve=>utils.formatUnits(reserve, "ether"))
    return {reserve0: reserves[0], reserve1: reserves[1]}
}

export async function getTokens(runContractFunction, contractAddress){
    return poolCaller(runContractFunction, contractAddress,"getTokens", {})
}
