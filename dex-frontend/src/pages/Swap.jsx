import { useEffect, useState } from "react"
import "../css/swap.css"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { approveToken } from "../hooks/tokens"
import GetTokensBtn from "../components/GetTokensBtn"
import { getAmountOut, swap } from "../hooks/pool"
import { error, success } from "../utils/toastWrapper"

const Swap = ({tokenAddresses, tokens, handleLoading, refreshUi, refreshCount}) => {
    // Initial Data
    const [currentPoolAddress, setCurrentPoolAddress] = useState("")        // address

    const [swapStatus, setSwapStatus] = useState({display: "Swap", disabled: true})

    const [amount0, setAmount0] = useState("") // string numbers
    const [amount1, setAmount1] = useState("") // string numbers
    const [token0, setToken0] = useState({}) // token
    const [token1, setToken1] = useState({}) // token
    
    const {runContractFunction} = useWeb3Contract()
    const {web3} = useMoralis()

    useEffect(()=>{
        if(!tokens[tokenAddresses[0]]) return

        setToken0(tokens[tokenAddresses[0]])
    }, [tokens])

    useEffect(()=>{
        refreshUiAfterSwap()
    }, [refreshCount])

    function refreshUiAfterSwap(){
        setAmount0("")
        setAmount1("")
        setSwapStatus({display: "Swap", disabled: true})
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
    
                else setSwapStatus({display: "Swap", disabled: false})
            } else {
                amountOut = 0
                setSwapStatus({display: "Swap", disabled: true})
            }
            
            setAmount1(amountOut)
        } catch(e){
            handleLoading(false)
            setSwapStatus({display: "Swap", disabled: true})
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
            if(swapStatus.disabled || !token0.address || !token1.address || !currentPoolAddress || parseInt(amount0) > parseInt(token0.balance)) return error("Please check your swap values")

            handleLoading(true)
            setSwapStatus({display: "Swapping", disabled: true})
            await approveToken(token0.address, currentPoolAddress, amount0)
            const amountOut = await swap(runContractFunction, currentPoolAddress, token0.address, amount0)
            success(`Swapped ${amount0} ${token0.name} for ${amountOut} ${token1.name}`)
            refreshUi()
            handleLoading(false)
            
        } catch(e){
            handleLoading(false)
            setSwapStatus({display: "Swap", disabled: false})
            error(e.error?.message || e.message)
        }
    }

    return token0?.address ? 
        (<div className="input-area">
        <GetTokensBtn tokens={tokens} web3={web3} />
             <h2>Swap with EASE</h2>
             <form onSubmit={handleSwap}>
                 <div className="input-area__box">
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
                 <div className="input-area__box">
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