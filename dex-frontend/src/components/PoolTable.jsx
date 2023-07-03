const PoolTable = ({pools, handleAddLiquidity, handleRemoveLiquidity}) => {

    return ( 
        <div data-testid="test-table" className="custom-table">
            <div className="custom-table-row header-row">
                <div className="custom-table-cell">Pool</div>
                <div className="custom-table-cell">Fee</div>
                <div className="custom-table-cell">TVL</div>
                <div className="custom-table-cell">Volume 24H</div>
                <div className="custom-table-cell"></div>
                <div className="custom-table-cell"></div>
            </div>
            {pools.map((pool, index) => (
                <div className="custom-table-row" key={index}>
                <div className="custom-table-cell">{pool.name}</div>
                <div className="custom-table-cell">{pool.fee}</div>
                <div className="custom-table-cell">--</div>
                <div className="custom-table-cell">--</div>
                <div className="custom-table-cell">
                    <button onClick={()=>handleAddLiquidity(pool)} data-testid="test-button" type="button">Add Liquidity</button>
                </div>
                <div className="custom-table-cell">
                    <button onClick={()=>handleRemoveLiquidity(pool)} data-testid="test-button" type="button">Remove Liquidity</button>
                </div>
                </div>
            ))}
        </div>
     );
}
 
export default PoolTable;