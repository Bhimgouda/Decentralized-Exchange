import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useEffect, useState } from 'react';
import { addLiquidity, getLiquidityRatio } from '../hooks/pool';
import { useWeb3Contract } from 'react-moralis';
import { error, success } from '../utils/toastWrapper';
import { approveToken } from '../hooks/tokens';

export const AddLiquidity = ({modalOpen, handleModalClose, pool, handleLoading, refreshUi}) => {
  const {token0, token1} = pool;

  const {runContractFunction} = useWeb3Contract()

  const [initialLiquidity, setInitialLiquidity] = useState(false)

  const [amount0, setAmount0] = useState("0")
  const [amount1, setAmount1] = useState("0")

  useEffect(()=>{
    if(pool.reserve0 == 0){
      setInitialLiquidity(true)
    }
  },[])
  
  const handleAmount0 = async(e)=>{
    setAmount0(e.target.value)
    if(parseInt(e.target.value) && !initialLiquidity){
      const token1Amount = await getLiquidityRatio(runContractFunction, pool.address, token0.address, e.target.value);
      setAmount1(token1Amount)
    } else {setAmount1("0")}
  }

  const handleAmount1 = (e)=>{
    setAmount1(e.target.value)
  }

  const handleAddLiquidity = async(e)=>{
    e.preventDefault()

    if(parseInt(amount0) && parseInt(amount1)){
      if(parseInt(amount0) <= parseInt(token0.balance) && parseInt(amount1) <= parseInt(token1.balance)){
        try{

          handleLoading(true)
          await approveToken(token0.address, pool.address, amount0)
          await approveToken(token1.address, pool.address, amount1)
          const liquidityTokens = await addLiquidity(runContractFunction, pool.address, amount0, amount1)
          success(`You have got ${liquidityTokens} Liquidity Tokens`);
          handleModalClose(true)
          handleLoading(false)
          refreshUi()
          
        } catch(e){
          handleLoading(false)
          console.log(e)
        }
      } else error("You have Invalid Token balance")
    } else error("Please enter a valid Liquidity Amount")
  }

    return (
      <div className='pool__add-liquidity'>
        <Dialog open={modalOpen} onClose={handleModalClose}>
          <DialogTitle>Add Liquidity to <strong>{pool.name}</strong> Pair</DialogTitle>
          <DialogContent>
              <form className='input-area' onSubmit={handleAddLiquidity}>
                <div className="input-area__box" style={{display: "flex", justifyContent: "space-between"}}>
                  <div style={{display: "flex", flexDirection: "column", alignItems: "flex-start", position: "relative"}}>
                    <input style={{fontSize: "18px", width: "350px"}} onChange={handleAmount0} placeholder="Token1 Address" value={amount0} type="number" />
                    <div style={{fontSize: "13px", position: "absolute", bottom: "-14px"}}>Balance: {token0.balance - (amount0 || "0")} {token0.name}</div>
                  </div>
                    <span className="token-name">{token0.name}</span>
                </div>
                <div className="input-area__box" style={{display: "flex", justifyContent: "space-between"}}>
                  <div style={{display: "flex", flexDirection: "column", alignItems: "flex-start", position: "relative"}}>
                    <input style={{fontSize: "18px", width: "350px"}} readOnly={!initialLiquidity} onChange={handleAmount1} placeholder="Token2 Address" value={amount1} type="number" />
                    <div style={{fontSize: "13px", position: "absolute", bottom: "-14px"}}>Balance: {token1.balance - (amount1 || "0")} {token1.name}</div>
                  </div>
                    <span className="token-name">{token1.name}</span>
                </div>
                <button className="btn" type="submit">Add Liquidity</button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    );
}