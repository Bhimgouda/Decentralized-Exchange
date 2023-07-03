import React, { useState } from 'react';

const PoolModal = ({ closeModal, modalOpen }) => {
  return (
    <>
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="modal-close" onClick={closeModal}>
              &times;
            </button>
            <div className="modal-content">
                
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PoolModal;
