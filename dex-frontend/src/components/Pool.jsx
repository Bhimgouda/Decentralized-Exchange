import PoolTable from "./PoolTable";
import "../css/pool.css"
import { useEffect, useState } from "react";
import PoolModal from "./PoolModal";

const Pool = ({poolAddresses, tokens, tokenAddresses, modalOpen, closeModal, openModal}) => {
    const [pools, setPools] = useState([])

    const handleAddLiquidity = ()=>{
        openModal()
    }
    const handleRemoveLiquidity = ()=>{
        openModal()
    }


    useEffect(()=>{
        if(!tokens[tokenAddresses[0]]) return

        const tempPools = poolAddresses.map(poolAddress=>{
            const pool = {}
            const token0 = tokens[poolAddress[0]] 
            const token1 = tokens[poolAddress[1]]

            pool.token0 = token0
            pool.token1 = token1
            pool.address = poolAddress[2]
            pool.name = `${token0.symbol}/${token1.symbol}`
            pool.fee = poolAddress[3]

            return pool
        })

        setPools(tempPools)
        
    }, [tokens])

    console.log(pools)

    return ( 
        <div className="pool">
            <PoolTable handleAddLiquidity={handleAddLiquidity} handleRemoveLiquidity={handleRemoveLiquidity} pools={pools} openModal={openModal} />
        </div>
     );
}
 
export default Pool;