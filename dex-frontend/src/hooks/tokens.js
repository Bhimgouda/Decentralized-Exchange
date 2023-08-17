import { useMoralis } from "react-moralis";
import ERC20_ABI from "../constants/erc20Abi.json"
import { utils, ethers } from "ethers";

const poolFunctionParams = {
    abi: ERC20_ABI,
}

function poolCaller(runContractFunction, contractAddress, functionName, params, ){
    return runContractFunction({
        params: {...poolFunctionParams, contractAddress, functionName, params},
    })
}

const provider = new ethers.providers.Web3Provider(window.ethereum)
const signer = provider.getSigner();

// HOOKs

export async function getTokenData(runContractFunction, contractAddress, account){
    const name = await poolCaller(runContractFunction, contractAddress, "name", {})
    const symbol = await poolCaller(runContractFunction, contractAddress, "symbol", {})
    let balanceOf;

    if(account){
        balanceOf = await poolCaller(runContractFunction, contractAddress, "balanceOf", {account})
        balanceOf = utils.formatUnits(balanceOf.toString(), "ether")
    }

    return {address: contractAddress ,name, symbol, balance: balanceOf}
}

export async function approveToken(tokenAddress, spenderAddress, amount){
    
    const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, signer);
    const tx = await tokenContract.approve(spenderAddress, utils.parseEther(amount))
    await tx.wait(1)
}

export async function getLiquidityTokens(runContractFunction, contractAddress, account){
    const balance = (await poolCaller(runContractFunction, contractAddress, "balanceOf", {account})).toString()
    if(!parseInt(balance)) return null;
    return balance;
}