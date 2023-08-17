import POOL_FACTORY_ABI from "../constants/poolFactoryAbi.json"
import POOL_FACTORY_ADDRESSES from "../constants/poolFactoryAddresses.json"
import {utils} from "ethers";

const CHAIN_ID = 11155111

const poolFactoryFunctionParams = {
    contractAddress: POOL_FACTORY_ADDRESSES[CHAIN_ID],
    abi: POOL_FACTORY_ABI,
}

function poolFactoryCaller(functionName, params, runContractFunction){
    return runContractFunction({
        params: {...poolFactoryFunctionParams, functionName, params},
    })
}

// HOOKs

export async function createPool(token0, token1, fee, runContractFunction){
    fee = utils.parseUnits(fee, 2).toString()
    const tx = await poolFactoryCaller("createPool", {token0, token1, fee}, runContractFunction)
    const receipt = await tx.wait(1)
    const event = receipt.events.find(event=>event.event === "PoolCreated")
    const {poolAddress} = event.args
    return poolAddress
}

export async function getPool(token0, token1, fee, runContractFunction){
    fee = utils.parseUnits(fee.toString(), 2).toString()
    return poolFactoryCaller("getPool", {token0, token1, fee}, runContractFunction)
}

export function getAllPools(runContractFunction){
    return poolFactoryCaller("getAllPools", {}, runContractFunction);
}