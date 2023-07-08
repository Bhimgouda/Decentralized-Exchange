import { useMoralis } from "react-moralis";
import { addTestToken, transferTestToken } from "../utils/getTestTokens";
import { error, info } from "../utils/toastWrapper";

const GetTokensBtn = ({web3, tokens, handleLoading, handleBalanceUpdate}) => {

    const {account} = useMoralis()

    const handleGetTestTokens = async()=>{
        try{
            info("Transfering Test Tokens")
            handleLoading(true)
            const transferSuccess = await transferTestToken(tokens, account)
            if(!transferSuccess) return error("Something went wrong")
    
     
            let i = 0
            info("Please Approve Adding Test Tokens")
            for(let token in tokens){
                if(i===4) break
                await addTestToken(web3, tokens[token])
                i++
            }
            handleLoading(false)
            
        } catch(e){
            handleLoading(false)
        }
        handleBalanceUpdate()
    }

    return ( 
        <button onClick={(handleGetTestTokens)} className="btn btn--tokens" style={{position: "absolute", top: "-100px", left: 160}}>Get Test Tokens</button>
     );
}
 
export default GetTokensBtn;