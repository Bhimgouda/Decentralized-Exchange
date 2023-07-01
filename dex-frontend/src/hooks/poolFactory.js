import POOL_FACTORY_ABI from "../constants/poolFactoryAbi.json"
import POOL_FACTORY_ADDRESSES from "../constants/poolFactoryAddresses.json"
import { error } from "../utils/toastWrapper";
import {utils} from "ethers";

const CHAIN_ID = 31337

const poolFactoryFunctionParams = {
    contractAddress: POOL_FACTORY_ADDRESSES[CHAIN_ID],
    abi: POOL_FACTORY_ABI
}

function poolFactoryCaller(functionName, params, runContractFunction){
    return runContractFunction({
        params: {...poolFactoryFunctionParams, functionName, params},
    })
}

// HOOK


export async function createPool(token0, token1, fee, runContractFunction){
    try{
        fee = utils.parseUnits(fee.toString()).toString()
        const tx = await poolFactoryCaller("createPool", {token0, token1, fee}, runContractFunction)
        const receipt = await tx.wait(1)
        const {poolAddress} = receipt.events[0].args
        return poolAddress
    } catch(e){
        // handleLoading(false)
        error(e.error?.message || e.message)
    }
}

export async function getPool(token0, token1, fee, runContractFunction){
    try {
        fee = utils.parseUnits(fee.toString(), 2).toString()
        return poolFactoryCaller("getPool", {token0, token1, fee}, runContractFunction)
    } catch(e){
        // handleLoading(false)
        error(e.error?.message || e.message)
    }
}

export function getAllPools(runContractFunction){
    try{
        return poolFactoryCaller("getAllPools", {}, runContractFunction);
    } catch(e){
        // handleLoading(false)
        error(e.error?.message || e.message)
    }
}