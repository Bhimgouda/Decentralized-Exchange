import POOL_ABI from "../constants/poolAbi.json"
import {useWeb3Contract} from "react-moralis"
import { BigNumber } from "@ethersproject/bignumber";
import { formatEther } from "ethers";

const {runContractFunction} = useWeb3Contract()

const poolFunctionParams = {
    abi: POOL_ABI
}

function handleContractError(e){
    handleLoading(false)
    error(e.error?.message || e.message)
}

function poolCaller(functionName, params){
    return runContractFunction({
        params: {...poolFunctionParams, functionName, params},
        onError: handleContractError
    })
}

// HOOK

export async function swap(_tokenIn, amountIn){
    const tx = await poolCaller("swap", {_tokenIn, amountIn})
    const receipt = await tx.wait(1)
    const {amountOut} = receipt.events[0].args
    return formatEther(BigNumber.toFixed(amountOut, 2).toString())
}

export async function addLiquidity(amount0, amount1){
    const tx = await poolCaller("addLiquidity", {amount0, amount1})
    const receipt = await tx.wait(1)
    const {liquidityToken} = receipt.events[0].args
    return formatEther(BigNumber.toFixed(liquidityToken, 2).toString())
}

export async function removeLiquidity(liquidityTokens){
    const tx = await poolCaller("removeLiquidity", {liquidityTokens})
    const receipt = await tx.wait(1)
    let {token0, amount0, token1, amount1} = receipt.events[0].args
    amount0 = formatEther(BigNumber.toFixed(amount0, 2).toString())
    amount1 = formatEther(BigNumber.toFixed(amount1, 2).toString())
    return {token0, amount0, token1, amount1}
}

export async function getAmountOut(_tokenIn, amountIn){
    const amountOut = await poolCaller("getAmountOut", {_tokenIn, amountIn})
    return formatEther(BigNumber.toFixed(amountOut, 2).toString())
}

export async function getReserves(){
    let reserves = await poolCaller("getReserves", {})
    reserves = reserves.map(reserve=>formatEther(BigNumber.toFixed(reserve, 2).toString()))
    return {reserve0: reserves[0], reserve1: reserves[1]}
}

export async function getTokens(){
    const tokenAddresses = await poolCaller("getTokens", {})
    return {token0: tokenAddresses[0], token1: tokenAddresses[1]}
}
