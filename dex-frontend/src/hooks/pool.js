import POOL_ABI from "../constants/poolAbi.json"
import { utils } from "ethers";

const poolFunctionParams = {
    abi: POOL_ABI,
}

function poolCaller(runContractFunction, contractAddress, functionName, params, ){
    return runContractFunction({
        params: {...poolFunctionParams, contractAddress, functionName, params}
    })
}

// HOOKs

export async function swap(runContractFunction, contractAddress, _tokenIn, amountIn){
    amountIn = utils.parseEther(amountIn.toString()).toString()
    const tx = await poolCaller(runContractFunction, contractAddress, "swap", {_tokenIn, amountIn})
    const receipt = await tx.wait(1)
    const event = receipt.events.find(event=>event.event === "Swapped")
    const {amountOut} = event.args

    return parseFloat(utils.formatUnits(amountOut, "ether")).toFixed().toString()
}

export async function addLiquidity(runContractFunction, contractAddress, amount0, amount1){
    amount0 = utils.parseEther(amount0.toString()).toString()
    amount1 = utils.parseEther(amount1.toString()).toString()

    const tx = await poolCaller(runContractFunction, contractAddress,"addLiquidity", {amount0, amount1})
    const receipt = await tx.wait(1)
    const event = receipt.events.find(event=>event.event === "AddedLiquidity")
    const {liquidityToken} = event.args
    return parseFloat(utils.formatUnits(liquidityToken, "ether")).toFixed().toString()
}

// come back later for liquidity tokens decimal
export async function removeLiquidity(runContractFunction, contractAddress, liquidityTokens){
    console.log(liquidityTokens)
    const tx = await poolCaller(runContractFunction, contractAddress,"removeLiquidity", {liquidityTokens})
    const receipt = await tx.wait(1)
    const event = receipt.events.find(event=>event.event === "RemovedLiquidity")
    let {amount0, amount1} = event.args
    amount0 = parseFloat(utils.formatUnits(amount0, "ether")).toFixed(2).toString()
    amount1 = parseFloat(utils.formatUnits(amount1, "ether")).toFixed(2).toString()
    return {amount0, amount1}
}

export async function getAmountOut(runContractFunction, contractAddress,_tokenIn, amountIn){
    amountIn = utils.parseEther(amountIn).toString()
    const amountOut = (await poolCaller(runContractFunction, contractAddress, "getAmountOut", {_tokenIn, amountIn}))[0]
    if(amountOut._hex.startsWith("0x00")) return 0
    return parseFloat(utils.formatUnits(amountOut, "ether")).toFixed(2).toString()
}

export async function getReserves(runContractFunction, contractAddress){
    let reserves = await poolCaller(runContractFunction, contractAddress,"getReserves", {})
    reserves = reserves.map(reserve=>parseFloat(utils.formatUnits(reserve, "ether")).toFixed().toString())
    return {reserve0: reserves[0], reserve1: reserves[1]}
}

export function getTokens(runContractFunction, contractAddress){
    return poolCaller(runContractFunction, contractAddress,"getTokens", {})
}

export async function getFee(runContractFunction, contractAddress){
    let fee = await poolCaller(runContractFunction, contractAddress, "getFee", {})
    fee = utils.formatUnits(fee.toString(), 2).toString()
    return fee
}

export async function getLiquidityTokenBalance(runContractFunction, contractAddress, account){
    let balance = await poolCaller(runContractFunction, contractAddress, "balanceOf", {account})
    return parseFloat(utils.formatUnits(balance, "ether")).toFixed(2).toString()
}

export async function getLiquidityRatio(runContractFunction, contractAddress, tokenInAddress, amountIn){
    amountIn = utils.parseEther(amountIn).toString()
    let token1Amount = await poolCaller(runContractFunction, contractAddress, "getLiquidityRatio", {_tokenIn: tokenInAddress, amountIn})
    token1Amount = utils.formatUnits(token1Amount, 18).toString()
    return token1Amount
}

export async function getAmountsOnRemovingLiquidity(runContractFunction, contractAddress, liquidityTokens){
    let amounts = await poolCaller(runContractFunction, contractAddress, "getAmountsOnRemovingLiquidity", {liquidityTokens})
    return amounts.map(amount=>parseFloat(utils.formatUnits(amount, "ether")).toFixed(2).toString())
}

