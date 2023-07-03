import { useState } from "react";
import { error, success } from "../utils/toastWrapper";
import { createPool } from "../hooks/poolFactory";
import { useWeb3Contract } from "react-moralis";

const CreatePool = () => {
    const [fee, setFee] = useState("")
    const [token0Address, setToken0Address] = useState("")
    const [token1Address, setToken1Address] = useState("")

    const [valid1, setValid0] = useState(false)
    const [valid0, setValid1] = useState(false)

    const {runContractFunction} = useWeb3Contract()

    const feeOptions = ["0.1", "0.5", "1"]

    const handleFeeSelect = (e)=>{
        setFee(e.target.value)
    }
    
    const handleToken0AddressChange = (e)=>{
        setToken0Address(e.target.value)
        const isValid = e.target.value.length === 42 ? true : false
        if(isValid) setValid0(true)
        else if(!isValid && valid0) setValid0(false)
    }
    const handleToken1AddressChange = (e)=>{
        setToken1Address(e.target.value)
        const isValid = e.target.value.length === 42 ? true : false
        if(isValid) setValid1(true)
        else if(!isValid && valid1) setValid1(false)
    }
    
    const handleCreatePool = async (e)=>{
        e.preventDefault()
        if(!valid0 || !valid1) return error("Invalid ERC TOKENS")
        if(token0Address === token1Address) return error("Token addressess cannot be the same")
        
        try{
            const poolAddress = await createPool(token0Address, token1Address, fee, runContractFunction)
            success(`Created a Pool with address - ${poolAddress}`)
        } catch(e){
            console.log(e)
        }
    }

    return ( 
        <div className="create-pool swap">
            <form onSubmit={handleCreatePool}>
                <div className="swap__token">
                    <input onChange={handleToken0AddressChange} value={token0Address} type="text" />
                </div>
                <div className="swap__token">
                    <input onChange={handleToken1AddressChange} value={token1Address} type="text" />
                </div>
                <div>
                    <select onChange={handleFeeSelect}  name="fee" id="fee" value={fee}>
                        {feeOptions.map(fee=><option value={fee}>{fee}</option>)}
                    </select>
                </div>
                <button className="btn" type="submit">Create Pool</button>
            </form>
        </div>
    );
}
 
export default CreatePool;