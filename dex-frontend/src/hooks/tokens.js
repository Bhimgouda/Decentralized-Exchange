import ERC20_ABI from "../constants/erc20Abi.json"
import { utils } from "ethers";
import { error } from "../utils/toastWrapper";

const poolFunctionParams = {
    abi: ERC20_ABI
}

function handleContractError(e){
    // handleLoading(false)
    error(e.error?.message || e.message)
}

function poolCaller(runContractFunction, contractAddress, functionName, params, ){
    return runContractFunction({
        params: {...poolFunctionParams, contractAddress, functionName, params},
        onError: handleContractError
    })
}

// HOOKs

export async function getTokenData(runContractFunction, contractAddress, account){
    const name = await poolCaller(runContractFunction, contractAddress, "name", {})
    const symbol = await poolCaller(runContractFunction, contractAddress, "symbol", {})
    let balanceOf = await poolCaller(runContractFunction, contractAddress, "balanceOf", {account})

    balanceOf = utils.formatUnits(balanceOf.toString(), "ether")
    return {address: contractAddress ,name, symbol, balance: balanceOf}
}