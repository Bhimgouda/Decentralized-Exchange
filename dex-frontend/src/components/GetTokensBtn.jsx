import { addTestToken } from "../utils/getTestTokens";
import { info } from "../utils/toastWrapper";

const GetTokensBtn = ({web3, tokens}) => {
    const handleGetTestTokens = async()=>{
        let i = 0
        for(let token in tokens){
            if(i===0){
                i++
                continue
            } 
            if(i===3) break;
            info("Getting Test Tokens")
            await addTestToken(web3, tokens[token])
            i++
        }
    }

    return ( 
        <button onClick={(handleGetTestTokens)} className="btn btn--tokens" style={{position: "absolute", top: "-100px", left: 160}}>Get Test Tokens</button>
     );
}
 
export default GetTokensBtn;