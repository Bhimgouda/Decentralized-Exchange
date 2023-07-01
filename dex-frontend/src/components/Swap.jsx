import { useEffect, useState } from "react"
import "../css/swap.css"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { getAllPools, getPool } from "../hooks/poolFactory"
import truncateStr from "../utils/truncate"
import { getTokenData } from "../hooks/tokens"
import GetTokensBtn from "./GetTokensBtn"
import { getAmountOut } from "../hooks/pool"

const Swap = ({CHAIN_ID}) => {
    const [tokenAddresses, setTokenAddresses] = useState([])
    const [tokens, setTokens] = useState([])
    const [poolAddress, setPoolAddress] = useState("")

    const [swapStatus, setSwapStatus] = useState({display: "Swap", disabled: false})

    const [amount0, setAmount0] = useState("0")
    const [amount1, setAmount1] = useState("0")
    const [token0, setToken0] = useState({})
    const [token1, setToken1] = useState({})
    
    const {runContractFunction} = useWeb3Contract()
    const {account, web3} = useMoralis()

    const fee = 50; // 0.5

    useEffect(()=>{
        gettingPools()
    }, [])

    useEffect(()=>{
        if(!tokenAddresses.length) return

        gettingTokenData()
    },[tokenAddresses, account])

    useEffect(()=>{
        if(!token0.address || !token1.address) return
        gettingPool()
    }, [token0, token1])

    async function gettingPools(){
        const tokensLookup = {}
        const allTokenAddresses = []
        const pools = await getAllPools(runContractFunction)
        pools.forEach(pool=>{
            if(!tokensLookup[pool[0]]){
                tokensLookup[pool[0]] = true;
                allTokenAddresses.push(pool[0])
            }
            if(!tokensLookup[pool[1]]){
                tokensLookup[pool[1]] = true;
                allTokenAddresses.push(pool[1])
            }
        })
        setTokenAddresses(allTokenAddresses)
    }
 
    async function gettingTokenData(){
        const tempTokens = []
        for(let tokenAddress of tokenAddresses){
            const temptoken = await getTokenData(runContractFunction, tokenAddress, account)
            tempTokens.push(temptoken)
        }
        setTokens(tempTokens)
        setToken0(tempTokens[0])
        setToken1(tempTokens[1])
    }

    async function gettingPool(){
        const address = await getPool(token0.address, token1.address, 0.5, runContractFunction);
        if(address.startsWith("0x00")) return setSwapStatus({display: "Insufficient Funds in Pool", disabled: true})
        if(swapStatus.disabled){
            setSwapStatus({display: "Swap", disabled: false})
        }
        setPoolAddress(address)
    }

    const handleAmount0Change = async(e)=>{
        setAmount0(e.target.value)
        if(e.target.value === "0" || e.target.value === "") return
        const amountOut = await getAmountOut(runContractFunction, poolAddress, token0.address, e.target.value)
        if(amountOut === 0) return setSwapStatus({display: "Insufficient Liquidity", disabled: true})
        if(swapStatus.disabled){
            setSwapStatus({display: "Swap", disabled: false})
        }
        setAmount1(amountOut)
    }
    const handleAmount1Change = async(e)=>{
        setAmount1(e.target.value)
    }

    const handletoken0Select = async(e)=>{
        const selectedToken = tokens.find(token=>token.address === e.target.value)
        setToken0(selectedToken)
    }
    const handletoken1Select = async(e)=>{
        const selectedToken = tokens.find(token=>token.address === e.target.value)
        setToken1(selectedToken)
    }

    const handleSwap = async(e)=>{
        e.preventDefault();
        console.log("swapping Baby")
    }

    return ( 
        <div className="swap">
            <GetTokensBtn tokens={tokens} web3={web3} />
            <h2>Swap with EASE</h2>
            <form onSubmit={handleSwap}>
                <div className="swap__token">
                    <div style={{display: "flex", flexDirection: "column", alignItems: "flex-start", position: "relative"}}>
                        <input onChange={handleAmount0Change} value={amount0} name="amount0" type="number" />
                        <div style={{fontSize: "13px", position: "absolute", bottom: "-14px"}}>Balance: {token0.balance} {token0.name}</div>
                    </div>
                    <select value={token0.address} onChange={handletoken0Select} name="token1" id="token1">
                        {tokens.map((token, i)=><option key={i} value={token.address}>{token.name}</option>)}
                    </select>
                </div>
                <div className="swap__token">
                    <input readOnly onChange={handleAmount1Change} value={amount1} name="amount1" type="number" />
                    <select value={token1.address} onChange={handletoken1Select} name="token2" id="token2">
                        {tokens.map((token, i)=>token.address !== token0.address && <option key={i} value={token.address}>{token.name}</option>)}
                    </select>
                </div>
                <button onClick={handleSwap} disabled={swapStatus.disabled} className="btn swap__btn">{swapStatus.display}</button>
            </form>
        </div>
    );
}
 
export default Swap;