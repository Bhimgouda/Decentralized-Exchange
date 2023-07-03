import { Route, Routes } from 'react-router-dom/dist/umd/react-router-dom.development';
import './App.css';
import Swap from './components/Swap';
import Pool from './components/Pool';
import Header from './components/Header';
import { useMoralis, useWeb3Contract } from 'react-moralis';
import handleNetworkSwitch from './utils/networkSwitcher';
import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { getAllPools } from "./hooks/poolFactory"
import { getTokenData } from "./hooks/tokens"
import { error } from './utils/toastWrapper';
import { getFee } from './hooks/pool';

const CHAIN_ID = 31337

function App() {
  const [poolAddresses, setPoolAddresses] = useState([])   // [[token0], [token1], [pooladdress]]
  const [tokenAddresses, setTokenAddresses] = useState([]) // addresses
  
  const [tokens, setTokens] = useState({}) // Main object of tokens with pairs

  const [swapCount, setSwapCount] = useState(0);
  
  const {isWeb3Enabled, web3, chainId, account} = useMoralis()
  const {runContractFunction} = useWeb3Contract()
  useEffect(()=>{
    handleNetworkSwitch(isWeb3Enabled, chainId, web3, CHAIN_ID)
  }, [isWeb3Enabled, chainId])


  useEffect(()=>{
    if(!isWeb3Enabled || parseInt(chainId) !== CHAIN_ID) return
    fetchPools()
  }, [isWeb3Enabled, chainId])

  async function fetchPools(){
    try {
      const pools = await getAllPools(runContractFunction)
      const tempPools = []
      for(let pool of pools){
        const poolAddress = pool[2]
        
        const fee = await getFee(runContractFunction, poolAddress)
        tempPools.push([pool[0], pool[1], poolAddress, fee])
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
    if(!tokenAddresses.length) return
      
    gettingTokenData()
  },[tokenAddresses, account, swapCount])

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
  }

  const increaseSwapCount = ()=>{
    setSwapCount(swapCount+1);
  }


  return (
      <div className='app'>
        <Header />
        <Toaster />
        {isWeb3Enabled
        ? parseInt(chainId) === CHAIN_ID && poolAddresses.length
          ?(<Routes>
          <Route path="/" element={<Swap increaseSwapCount={increaseSwapCount} swapCount={swapCount} CHAIN_ID={CHAIN_ID} tokens={tokens} tokenAddresses={tokenAddresses} />}/>
          <Route path="/pool" element={<Pool CHAIN_ID={CHAIN_ID} poolAddresses={poolAddresses} tokenAddresses={tokenAddresses} tokens={tokens} />}/> 
          <Route path="*" element={<Swap increaseSwapCount={increaseSwapCount} swapCount={swapCount} CHAIN_ID={CHAIN_ID} tokens={tokens} tokenAddresses={tokenAddresses} />}/>
        </Routes>)
          : "Please switch to Sepolia Testnet"
        : "Please Connect your Wallet"}
      </div>
  );
}

export default App;
