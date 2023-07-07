import React, { useState } from "react";
import { AddLiquidity } from "./AddLiquidity";
import { RemoveLiquidity } from "./RemoveLiquidity";

const PoolTable = ({ pools, handleLoading }) => {
  const [modalType, setModalType] = useState(null);
  const [currentPool, setCurrentPool] = useState()

  const handleModalOpen = (type, pool) => {
    setModalType(type);
    setCurrentPool(pool)
  };

  const handleModalClose = () => {
    setModalType(null);
  };

  const modalComponents = {
    addLiquidity: <AddLiquidity handleLoading={handleLoading} pool={currentPool} modalOpen={true} handleModalClose={handleModalClose} />,
    removeLiquidity: <RemoveLiquidity handleLoading={handleLoading} pool={currentPool} modalOpen={true} handleModalClose={handleModalClose} />
  };

  const renderModalComponent = () => modalComponents[modalType];

  return (
    <>
      {renderModalComponent()}
      <div data-testid="test-table" className="custom-table">
        {/* Table content */}
        <div className="custom-table-row header-row">
                <div className="custom-table-cell">Pool</div>
                <div className="custom-table-cell">Fee</div>
                <div className="custom-table-cell">Token 1 Liquidity</div>
                <div className="custom-table-cell">Token 2 Liquidity</div>
                <div className="custom-table-cell"></div>
                <div className="custom-table-cell"></div>
        </div>
        {pools.map((pool, index) => (
          <div className="custom-table-row" key={index}>
            {/* Pool information */}
            <div className="custom-table-cell"><strong>{pool.name}</strong></div>
            <div className="custom-table-cell">{pool.fee}</div>
            <div className="custom-table-cell">{`${pool.reserve0} ${pool.token0.symbol}`}</div>
            <div className="custom-table-cell">{`${pool.reserve1} ${pool.token1.symbol}`}</div>
            <div className="custom-table-cell">
              <button
                className="btn"
                onClick={() => handleModalOpen("addLiquidity", pool)}
                data-testid="test-button"
                type="button"
              >
                Add Liquidity
              </button>
            </div>
            <div className="custom-table-cell">
              <button
                className="btn"
                onClick={() => handleModalOpen("removeLiquidity", pool)}
                data-testid="test-button"
                type="button"
              >
                Remove Liquidity
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default PoolTable;
