import PoolTable from "./PoolTable";
import "../css/pool.css"
import { useEffect, useState } from "react";

const Pool = ({poolAddresses, tokens, tokenAddresses}) => {

    const [pools, setPools] = useState([])

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
        <PoolTable pools={pools} />
     );
}
 
export default Pool;