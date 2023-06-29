import POOL_ABI from "../constants/poolAbi.json"
import {useWeb3Contract} from "react-moralis"
import { BigNumber } from "@ethersproject/bignumber";
import { formatEther } from "ethers";

const {runContractFunction} = useWeb3Contract()

const poolFunctionParams = {
    abi: POOL_FACTORY_ABI
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
    await tx.wait()

}

export async function addLiquidity(amount0, amount1){
    const tx = await poolCaller("addLiquidity", {amount0, amount1})
    await tx.wait()
}

export async function removeLiquidity(liquidityTokens){
    const tx = await poolCaller("removeLiquidity", {liquidityTokens})
    await tx.wait()
}

export async function getAmountOut(_tokenIn, amountIn){
    const amountOut = await poolCaller("getAmountOut", {_tokenIn, amountIn})
    return formatEther(BigNumber.from(amountOut).toString())
}

export async function getReserves(){
    let reserves = await poolCaller("getReserves", {})
    reserves = reserves.map(reserve=>formatEther(BigNumber.from(reserve).toString()))
    return {reserve0: reserves[0], reserve1: reserves[1]}
}

export async function getTokens(){
    const tokenAddresses = await poolCaller("getTokens", {})
    return {token0: tokenAddresses[0], token1: tokenAddresses[1]}
}
