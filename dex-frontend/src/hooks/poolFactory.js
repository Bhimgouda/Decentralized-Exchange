import POOL_FACTORY_ABI from "../constants/poolFactoryAbi.json"
import POOL_FACTORY_ADDRESSES from "../constants/poolFactoryAddresses.json"
import {useWeb3Contract} from "react-moralis"

const CHAIN_ID = 9709

const {runContractFunction} = useWeb3Contract()

const poolFactoryFunctionParams = {
    contractAddress: POOL_FACTORY_ADDRESSES[CHAIN_ID],
    abi: POOL_FACTORY_ABI
}

function handleContractError(e){
    handleLoading(false)
    error(e.error?.message || e.message)
}

// HOOK

function poolFactoryCaller(functionName, params){
    return runContractFunction({
        params: {...poolFactoryFunctionParams, functionName, params},
        onError: handleContractError
    })
}

export async function createPool(token0, token1, fee){
    const tx = await poolFactoryCaller("createPool", {token0, token1, fee})
    const receipt = await tx.wait(1)
    const {poolAddress} = receipt.events[0].args
    return poolAddress
}

export async function getPool(token0, token1, fee){
    return poolFactoryCaller("getPool", {token0, token1, fee})
}

export async function getAllPools(){
    const allPools = await poolFactoryCaller("getAllPools", {});
}