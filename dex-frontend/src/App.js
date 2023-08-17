import { Route, Routes } from 'react-router-dom/dist/umd/react-router-dom.development';
import './App.css';
import Swap from './pages/Swap';
import Header from './components/Header';
import { useMoralis, useWeb3Contract } from 'react-moralis';
import handleNetworkSwitch from './utils/networkSwitcher';
import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { getAllPools } from "./hooks/poolFactory"
import { getTokenData } from "./hooks/tokens"
import { error } from './utils/toastWrapper';
import { getFee, getReserves } from './hooks/pool';
import CreatePool from './pages/CreatePool';
import LoadingOverlay from './components/LoadingOverlay';
import Pools from './pages/Pools';
import { getGasPrice, transferSepEth } from './utils/getTestTokens';

const CHAIN_ID = 11155111

function App() {
  const [poolAddresses, setPoolAddresses] = useState([])   // [[token0], [token1], [pooladdress]]
  const [tokenAddresses, setTokenAddresses] = useState([]) // addresses
  
  const [tokens, setTokens] = useState({}) // Main object of tokens with pairs

  // For fetching and rendering data after on-chain activity
  const [refreshCount, setRefreshCount] = useState(0)
  const [loading, setLoading] = useState(false);
  const [balanceUpdate, setBalanceUpdate] = useState(0)
  
  const {isWeb3Enabled, web3, chainId, account} = useMoralis()
  const {runContractFunction} = useWeb3Contract()
  useEffect(()=>{
    handleNetworkSwitch(isWeb3Enabled, chainId, web3, CHAIN_ID)
  }, [isWeb3Enabled, chainId])


  const handleLoading = (value)=>{
      setLoading(value)
  }

  useEffect(()=>{
    if(!isWeb3Enabled || parseInt(chainId) !== CHAIN_ID) return

    getGasPrice()
  }, [isWeb3Enabled, chainId, account])

  useEffect(()=>{
    if(!isWeb3Enabled || parseInt(chainId) !== CHAIN_ID) return

    if(!poolAddresses.length) setLoading(true)
    fetchPools()
  }, [isWeb3Enabled, chainId, refreshCount, account])

  async function fetchPools(){
    try {
      const pools = await getAllPools(runContractFunction)
      const tempPools = []
      for(let pool of pools){
        const poolAddress = pool[2]
        
        const fee = await getFee(runContractFunction, poolAddress)
        const reserves = await getReserves(runContractFunction, poolAddress)
        tempPools.push([pool[0], pool[1], poolAddress, fee, reserves])
      }

      setPoolAddresses(tempPools)
    } catch(e){
      error(e.error?.message || e.message)
    }
  }

  useEffect(()=>{
    if(!poolAddresses.length) return

    const tokensLookup = {}
    const tempTokenAddresses = []

    poolAddresses.forEach(pool=>{
      if(!tokensLookup[pool[0]]){
          tokensLookup[pool[0]] = true;
          tempTokenAddresses.push(pool[0])
      }
      if(!tokensLookup[pool[1]]){
          tokensLookup[pool[1]] = true;
          tempTokenAddresses.push(pool[1])
      }
    })
      
    setTokenAddresses(tempTokenAddresses)
  }, [poolAddresses])



  useEffect(()=>{
    console.log(balanceUpdate)
    if(!tokenAddresses.length) return

      
    gettingTokenData()
  },[tokenAddresses, account, balanceUpdate])

  async function gettingTokenData(){
    const tempTokens = {}
    for(let tokenAddress of tokenAddresses){
        const tempToken = await getTokenData(runContractFunction, tokenAddress, account)
        tempTokens[tempToken.address] = {...tempToken, pairs: {}}
    }

    poolAddresses.forEach(pool=>{
        tempTokens[pool[0]].pairs[pool[1]] = pool[2]
        tempTokens[pool[1]].pairs[pool[0]] = pool[2]
    })
    setTokens(tempTokens)
    setLoading(false)
  }

  const refreshUi = ()=>{
    setRefreshCount(refreshCount+1)
  }
  const handleBalanceUpdate = ()=>{
    setBalanceUpdate(balanceUpdate+1)
  }


  return (
      <div className='app'>
        <Header />
        <Toaster />
        {isWeb3Enabled
        ? parseInt(chainId) === CHAIN_ID
          ?(<Routes>
          <Route path="/" element={<Swap handleBalanceUpdate={handleBalanceUpdate} handleLoading={handleLoading} refreshCount={refreshCount} refreshUi={refreshUi} CHAIN_ID={CHAIN_ID} tokens={tokens} tokenAddresses={tokenAddresses} />}/>
          <Route path="/pool" element={<Pools handleLoading={handleLoading} refreshUi={refreshUi} CHAIN_ID={CHAIN_ID} poolAddresses={poolAddresses} tokenAddresses={tokenAddresses} tokens={tokens} />}/>
          <Route path="/create-pool" element={<CreatePool refreshUi={refreshUi} handleLoading={handleLoading}/>} />
          <Route path="*" element={<Swap handleBalanceUpdate={handleBalanceUpdate} handleLoading={handleLoading} refreshCount={refreshCount} refreshUi={refreshUi} CHAIN_ID={CHAIN_ID} tokens={tokens} tokenAddresses={tokenAddresses} />}/>
        </Routes>)
          : "Please switch to Sepolia Testnet"
        : "Please Connect your Wallet"}
        <LoadingOverlay loading={loading} />
        <p style={{position: 'absolute', bottom: "20px"}}>Made with ❤️ by <a target="_blank" href='https://github.com/Bhimgouda'>Bhimgouda D Patil</a></p>
      </div>
  );
}

export default App;
