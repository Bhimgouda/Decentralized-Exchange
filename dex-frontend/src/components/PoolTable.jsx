const PoolTable = () => {

    const exampleValues = [
        {
          pool: 'WETH/DAI',
          fee: '0.3%',
          tvl: '2000999.92 M',
          volume24h: '20010.00 M'
        },
        {
          pool: 'USDC/DAI',
          fee: '0.01%',
          tvl: '2000.00 M',
          volume24h: '20.00 M'
        },
        {
          pool: 'WBTC/DAI',
          fee: '0.02%',
          tvl: '1000.00 M',
          volume24h: '10.00 M'
        }
      ];

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
            {exampleValues.map((value, index) => (
                <div className="custom-table-row" key={index}>
                <div className="custom-table-cell">{value.pool}</div>
                <div className="custom-table-cell">{value.fee}</div>
                <div className="custom-table-cell">{value.tvl}</div>
                <div className="custom-table-cell">{value.volume24h}</div>
                <div className="custom-table-cell">
                    <button data-testid="test-button" type="button">Add Liquidity</button>
                </div>
                <div className="custom-table-cell">
                    <button data-testid="test-button" type="button">Remove Liquidity</button>
                </div>
                </div>
            ))}
        </div>
     );
}
 
export default PoolTable;