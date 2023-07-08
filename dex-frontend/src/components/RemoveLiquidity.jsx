import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useEffect, useState } from 'react';
import { useMoralis, useWeb3Contract } from 'react-moralis';
import { getLiquidityTokens } from '../hooks/tokens';
import { utils, BigNumber } from "ethers";
import { getAmountsOnRemovingLiquidity, removeLiquidity } from '../hooks/pool';
import { error, success } from '../utils/toastWrapper';

export const RemoveLiquidity = ({modalOpen, handleModalClose, pool, handleLoading, refreshUi}) => {
    const {token0, token1} = pool
    const [selectedPercentage, setSelectedPercentage] = useState("10")
    const [liquidityTokens, setLiquidityTokens] = useState("")
    const [liquidityPercentage, setLiquidityPercentage] = useState("")
    
    const percentages = ["10", "25", "50", "75", "100"]
    
    const [amount0, setAmount0] = useState("0")
    const [amount1, setAmount1] = useState("0")

    const {account} = useMoralis()
    const {runContractFunction} = useWeb3Contract()

    useEffect(()=>{
      if(!account) return
      fetchLiquidityTokens()
    }, [account])

    async function fetchLiquidityTokens(){
      const liquidityTokenBalance = await getLiquidityTokens(runContractFunction, pool.address, account);
      if(liquidityTokenBalance) {
        setLiquidityTokens(liquidityTokenBalance)
      }
    }

    useEffect(()=>{
      if(!liquidityTokens) return
      getAmounts(selectedPercentage)

    },[liquidityTokens])

    async function getAmounts(percentage){
      const liquidityInPercent = BigNumber.from(liquidityTokens).mul(percentage).div("100").toString()
      const amounts = await getAmountsOnRemovingLiquidity(runContractFunction, pool.address, liquidityInPercent)
      setLiquidityPercentage(liquidityInPercent)
      setAmount0(amounts[0])
      setAmount1(amounts[1])
    }


    const handlePercentageSelect = async(e)=>{
      setSelectedPercentage(e.target.value)

      getAmounts(e.target.value)
    }

    const handleRemoveLiquidity = async(e)=>{
      e.preventDefault()
      
      try{
        if(parseInt(amount0) && parseInt(amount1)){

          handleLoading(true)
          const {amount0, amount1} = await removeLiquidity(runContractFunction, pool.address, liquidityPercentage)
          success(`Burnt ${selectedPercentage}% of Your Liquidity tokens for ${amount0} ${token0.name} ${amount1} ${token1.name}`)
          handleModalClose(true)
          handleLoading(false)
          refreshUi()

        }
      } catch(e){
        handleLoading(false)
        console.log(e)
      }
    }

    return (
      <div className='pool__remove-liquidity'>
        <Dialog open={modalOpen} onClose={handleModalClose}>
          <DialogTitle><h2>Remove Liquidity</h2></DialogTitle>
          <DialogContent>
            {liquidityTokens
             ?             <form onSubmit={handleRemoveLiquidity}>
             <div style={{display: 'flex', justifyContent: "space-between", alignItems: 'center'}}>
               <select value={selectedPercentage} onChange={handlePercentageSelect}
                 style={{background: "var(--color-primary-dark)", color: "white", fontSize: "21px", width: "50%", padding: "10px", height: "50px"}}
               name="token1" id="token1">
                 {percentages.map((percentage, i)=>
                     <option key={i} value={percentage}>{percentage}%</option>
                 )}
               </select>
               <div>
               <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                   <span className='amount-display'>{amount0}</span>
                   <span className="token-name">{token0.name}</span>
                 </div>
                 <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                     <span className='amount-display'>{amount1}</span>
                     <span className="token-name">{token1.name}</span>
                 </div>
               </div>
              </div>
               <button style={{width: "500px"}} className="btn" type="submit">Remove Liquidity</button>
            </form>
            : <div>
                <p>You Have 0 Liquidity in This Pool</p>
                <button onClick={handleModalClose}>Close</button>
              </div>}
          </DialogContent>
        </Dialog>
      </div>
    );
}