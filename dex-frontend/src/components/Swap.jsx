import { useEffect, useState } from "react"
import "../css/swap.css"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { getAllPools } from "../hooks/poolFactory"
import { approveToken, getTokenData } from "../hooks/tokens"
import GetTokensBtn from "./GetTokensBtn"
import { getAmountOut, swap } from "../hooks/pool"
import { error, success } from "../utils/toastWrapper"

const Swap = ({CHAIN_ID}) => {
    // Initial Data
    const [poolAddresses, setPoolAddresses] = useState([])   // [[token0], [token1], [pooladdress]]
    const [tokenAddresses, setTokenAddresses] = useState([]) // addresses
    
    const [tokens, setTokens] = useState({}) // Main object of tokens with pairs

    const [currentPoolAddress, setCurrentPoolAddress] = useState("")        // address

    const [swapStatus, setSwapStatus] = useState({display: "Swap", disabled: true})
    const [swapCount, setSwapCount] = useState(0);

    const [amount0, setAmount0] = useState("") // string numbers
    const [amount1, setAmount1] = useState("") // string numbers
    const [token0, setToken0] = useState({}) // token
    const [token1, setToken1] = useState({}) // token
    
    const {runContractFunction} = useWeb3Contract()
    const {account, web3} = useMoralis()

    const fee = 50; // 0.5
    
    useEffect(()=>{
        fetchPools()
    }, [])

    async function fetchPools(){
        try {
            const pools = await getAllPools(runContractFunction)
            setPoolAddresses(pools)
        } catch(e){
            error(e.error?.message || e.message)
        }
    }

    useEffect(()=>{
        if(!poolAddresses.length) return

        const tokensLookup = {}
        const tempTokenAddresses = []

        poolAddresses.forEach(pool=>{
            if(!tokensLookup[pool[0]]){
                tokensLookup[pool[0]] = true;
                tempTokenAddresses.push(pool[0])
            }
            if(!tokensLookup[pool[1]]){
                tokensLookup[pool[1]] = true;
                tempTokenAddresses.push(pool[1])
            }
        })
        
        setTokenAddresses(tempTokenAddresses)
    }, [poolAddresses])

   

    useEffect(()=>{
        if(!tokenAddresses.length) return

        refreshUiAfterSwap()
        
        
        gettingTokenData()
    },[tokenAddresses, account, swapCount])

    function refreshUiAfterSwap(){
        setAmount0("")
        setAmount1("")
        setSwapStatus({display: "Swap", disabled: true})
    }

    async function gettingTokenData(){
        const tempTokens = {}
        for(let tokenAddress of tokenAddresses){
            const tempToken = await getTokenData(runContractFunction, tokenAddress, account)
            tempTokens[tempToken.address] = {...tempToken, pairs: {}}
        }

        poolAddresses.forEach(pool=>{
            tempTokens[pool[0]].pairs[pool[1]] = pool[2]
            tempTokens[pool[1]].pairs[pool[0]] = pool[2]
        })

        setToken0(tempTokens[tokenAddresses[0]])
        setTokens(tempTokens)
    }

    useEffect(()=>{
        if(!token0.address || !token1.address) return
        setCurrentPoolAddress(token0.pairs[token1.address])
    }, [token0, token1])

    const handleAmount0Change = async(e)=>{
        try{
            setAmount0(e.target.value)
            if(!token1.address) return

            let amountOut;
    
            if(parseInt(e.target.value)) {
                amountOut = await getAmountOut(runContractFunction, currentPoolAddress, token0.address, e.target.value)
                if(amountOut === 0) {
                    setSwapStatus({display: "Insufficient Liquidity", disabled: true})
                }
    
                else if(parseInt(e.target.value) > parseInt(token0.balance)){
                    setSwapStatus({display: "Insufficient Wallet Balance", disabled: true})
                }
    
                setSwapStatus({display: "Swap", disabled: false})
            } else {
                amountOut = 0
                setSwapStatus({display: "Swap", disabled: true})
            }
            
            setAmount1(amountOut)
        } catch(e){
            error(e.error?.message || e.message)
        }
    }

    const handletoken0Select = async(e)=>{
        const selectedToken = tokens[e.target.value]
        setToken0(selectedToken)
    }
    const handletoken1Select = async(e)=>{
        const selectedToken = tokens[e.target.value]
        setToken1(selectedToken)
    }

    const handleSwap = async(e)=>{
        e.preventDefault()
        try{
            if(swapStatus.disabled || !token0.address || !token1.address || !currentPoolAddress ) return error("Please check your swap values")

            setSwapStatus({display: "Swapping", disabled: true})
            await approveToken(token0.address, currentPoolAddress, amount0)
            const amountOut = await swap(runContractFunction, currentPoolAddress, token0.address, amount0)
            setSwapCount(swapCount+1)
            success(`Swapped ${amount0} ${token0.name} for ${amountOut} ${token1.name}`)
        } catch(e){
            error(e.error?.message || e.message)
        }
    }

    return token0?.address ? 
        (<div className="swap">
        <GetTokensBtn tokens={tokens} web3={web3} />
             <h2>Swap with EASE</h2>
             <form onSubmit={handleSwap}>
                 <div className="swap__token">
                     <div style={{display: "flex", flexDirection: "column", alignItems: "flex-start", position: "relative"}}>
                         <input placeholder="0" onChange={handleAmount0Change} value={amount0} name="amount0" type="number" />
                         <div style={{fontSize: "13px", position: "absolute", bottom: "-14px"}}>Balance: {token0.balance - (amount0 || "0")} {token0.name}</div>
                     </div>
                     <select value={token0.address} onChange={handletoken0Select} name="token1" id="token1">
                        {tokenAddresses.map((token, i)=>
                            <option key={i} value={tokens[token].address}>{tokens[token].name}</option>
                        )}
                     </select>
                 </div>
                 <div className="swap__token">
                     <input placeholder="Please select a Token" readOnly value={amount1} name="amount1" type="number" />
                     <select value={token1.address} onChange={handletoken1Select} name="token2" id="token2">
                        <option value={null}>select</option>
                        {Object.keys(token0.pairs).map((token, i)=>
                            <option key={i} value={tokens[token].address}>{tokens[token].name}</option>
                        )}
                     </select>
                 </div>
                 <button onClick={handleSwap} disabled={swapStatus.disabled} className="btn swap__btn">{swapStatus.display}</button>
             </form>
        </div>
    ):
    null
}
 
export default Swap;