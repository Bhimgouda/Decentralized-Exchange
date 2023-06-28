import { useState } from "react"
import "../css/swap.css"

const Swap = () => {
    const [amount0, setAmount0] = useState(0)
    const [amount1, setAmount1] = useState(0)

    const handleAmount0Change = async(e)=>{
        setAmount0(e.target.value)
    }

    const handleAmount1Change = async(e)=>{
        setAmount1(e.target.value)
    }

    const handleSwap = async(e)=>{
        e.preventDefault();
    }

    return ( 
        <div className="swap">
            <h2>Swap with EASE</h2>
            <form onSubmit={handleSwap}>
                <div className="swap__token">
                    <input onChange={handleAmount0Change} value={amount0} name="amount0" type="number" />
                </div>
                <div className="swap__token">
                    <input onChange={handleAmount1Change} value={amount1} name="amount1" type="number" />
                </div>
                <button className="btn swap__btn">Swap</button>
            </form>
        </div>
    );
}
 
export default Swap;