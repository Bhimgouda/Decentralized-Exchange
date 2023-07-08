import { success, error } from "./toastWrapper";
import { ethers, utils, Contract, Wallet  } from "ethers";
import ERC20_ABI from "../constants/erc20Abi.json"

export const addTestToken = async (web3, token) => {
    try {
        // Request the user's permission to add the token
        await web3.provider.request({
          method: 'wallet_watchAsset',
          params: {
            type: 'ERC20',
            options: {
              address: token.address,
              symbol: token.symbol,
              decimals: 18,
            },
          },
        });

        success(`Added ${token.name} to your wallet`)
    } catch (e) {
        error(e.message);
    }
};

// This is a Test project
// which Is why I have added private key at the client side, otherwise would have used a server


// Changes on production RPX + PRIVATE KEY (is of account 5)
const RPC_URL="http://127.0.0.1:8545/"
const PRIVATE_KEY="0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"

export const transferTestToken = async (tokens, account) => {
        // try{
          const provider = new ethers.providers.JsonRpcProvider("") 
          const WALLET = new Wallet(PRIVATE_KEY, provider)

          const transferAmount = utils.parseEther("100")

          let i = 0
          console.log(tokens)
          for(let token in tokens){
            if(i < 4) {
              const testToken = new Contract(tokens[token].address, ERC20_ABI, WALLET);
              const tx = await testToken.transfer(account, transferAmount)
              i++
            } else break
          }
          
          return true;
        // }
        // catch(e){
        //     console.log(e)
        // }
}