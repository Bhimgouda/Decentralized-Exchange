import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from 'react';

export const RemoveLiquidity = ({modalOpen, handleModalClose, pool}) => {
    const [selectedPercentage, setSelectedPercentage] = useState("10")

    const [amount0, setAmount0] = useState("0")
    const [amount1, setAmount1] = useState("0")

    const handlePercentageSelect = (e)=>{
      setSelectedPercentage(e.target.value)
    }

    const percentages = ["10", "25", "50", "75", "100"]

    const handleRemoveLiquidity = async()=>{

    }

    return (
      <div className='pool__remove-liquidity'>
        <Dialog open={modalOpen} onClose={handleModalClose}>
          <DialogTitle><h2>Remove Liquidity</h2></DialogTitle>
          <DialogContent>
            <form onSubmit={handleRemoveLiquidity}>
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
                          <span className='amount-display'>xx</span>
                          <span className="token-name">{pool.token0.name}</span>
                        </div>
                        <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                            <span className='amount-display'>xx</span>
                            <span className="token-name">{pool.token1.name}</span>
                        </div>
                      </div>
                     </div>
                      <button style={{width: "500px"}} className="btn" type="submit">Remove Liquidity</button>
                     <div className='info'>
                      <h2>Your Total Liquidity</h2>

                      </div>
              </form>
          </DialogContent>
        </Dialog>
      </div>
    );
}