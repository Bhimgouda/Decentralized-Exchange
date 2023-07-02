import { addTestToken } from "../utils/getTestTokens";

const GetTokensBtn = ({web3, tokens}) => {
    const handleGetTestTokens = async()=>{
        for(let token in tokens){
            await addTestToken(web3, tokens[token])
        }
    }

    return ( 
        <button onClick={(handleGetTestTokens)} className="btn btn--tokens" style={{position: "absolute", top: "-100px", left: 160}}>Get Test Tokens</button>
     );
}
 
export default GetTokensBtn;