import { Route, Routes } from 'react-router-dom/dist/umd/react-router-dom.development';
import './App.css';
import Swap from './components/Swap';
import Pool from './components/Pool';
import Header from './components/Header';
import { useMoralis } from 'react-moralis';
import handleNetworkSwitch from './utils/networkSwitcher';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';

function App() {
  const {isWeb3Enabled, web3, chainId, account} = useMoralis()
  const CHAIN_ID = 31337


  useEffect(()=>{
    handleNetworkSwitch(isWeb3Enabled, chainId, web3, CHAIN_ID)
  }, [isWeb3Enabled, chainId])


  return (
      <div className='app'>
        <Header />
        <Toaster />
        {isWeb3Enabled
        ? parseInt(chainId) === CHAIN_ID
          ?(<Routes>
          <Route path="/" element={<Swap CHAIN_ID={CHAIN_ID} />}/>
          <Route path="/pool" element={<Pool CHAIN_ID={CHAIN_ID} />}/>
          <Route path="*" element={<Swap CHAIN_ID={CHAIN_ID} />}/>
        </Routes>)
          : "Please switch to Sepolia Testnet"
        : "Please Connect your Wallet"}
      </div>
  );
}

export default App;
