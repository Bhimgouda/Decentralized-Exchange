import { useEffect, useState } from "react";
import { error, success } from "../utils/toastWrapper";
import { createPool } from "../hooks/poolFactory";
import { useWeb3Contract } from "react-moralis";
import "../css/createPool.css"
import { getTokenData } from "../hooks/tokens";

const CreatePool = ({refreshUi, refreshCount, handleLoading}) => {
    const [fee, setFee] = useState("0.1")
    const [token0Address, setToken0Address] = useState("")
    const [token1Address, setToken1Address] = useState("")

    const [token0, setToken0] = useState({})
    const [token1, setToken1] = useState({})

    const {runContractFunction} = useWeb3Contract()

    const feeOptions = ["0.1", "0.5", "1"]

    const handleFeeSelect = (e)=>{
        setFee(e.target.value)
    }

    useEffect(()=>{
        const isValid = token0Address.length === 42 ? true : false
        if(isValid) {
            fetchTokenData(token0Address)
        }
        else if(!isValid && token0.name) setToken0({})
    },[token0Address])

    useEffect(()=>{
        const isValid = token1Address.length === 42 ? true : false
        if(isValid) {
            fetchTokenData(token1Address, )
        }
        else if(!isValid && token1.name) setToken1({})
    },[token1Address])

    async function fetchTokenData(tokenAddress){
        const {name, symbol} = await getTokenData(runContractFunction, tokenAddress)
        if(tokenAddress === token0Address){
            setToken0({name, symbol})
        } else{
            setToken1({name, symbol})
        }
    }
    
    const handleToken0AddressChange = (e)=>{
        setToken0Address(e.target.value)

    }
    const handleToken1AddressChange = (e)=>{
        setToken1Address(e.target.value)
    }
    
    const handleCreatePool = async (e)=>{
        e.preventDefault()
        if(!token0.name || !token1.name) return error("Invalid ERC TOKENS")
        if(token0Address === token1Address) return error("Token addressess cannot be the same")
        
        try{

            handleLoading(true)
            const poolAddress = await createPool(token0Address, token1Address, fee, runContractFunction)
            success(`Created a Pool with address - ${poolAddress}`)
            handleLoading(false)
            refreshUi()

        } catch(e){
            console.log(e)
            handleLoading(false)
            error("Token Pair Already Exists")
        }
    }

    return ( 
        <div className="create-pool input-area">
            <form onSubmit={handleCreatePool}>
                <div className="input-area__box">
                    <input onChange={handleToken0AddressChange} placeholder="Token1 Address" value={token0Address} type="text" />
                    <span className="token-name">{token0.name}</span>
                </div>
                <div className="input-area__box">
                    <input onChange={handleToken1AddressChange} placeholder="Token2 Address" value={token1Address} type="text" />
                    <span className="token-name">{token1.name}</span>
                </div>
                <div className="input-area__select">
                    <span>Swapping Fee</span>
                    <select onChange={handleFeeSelect} name="fee" id="fee" value={fee}>
                        {feeOptions.map((fee, i)=><option key={i} value={fee}>{fee}%</option>)}
                    </select>
                </div>
                <button className="btn" type="submit">Create Pool</button>
            </form>
        </div>
    );
}
 
export default CreatePool;