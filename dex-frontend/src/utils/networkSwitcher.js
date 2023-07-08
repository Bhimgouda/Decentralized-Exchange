import { success, error, info } from "./toastWrapper";

const handleNetworkSwitch = async (isWeb3Enabled, chainId, web3, CHAIN_ID) => {
    // Enable Web3 if not already enabled
    if (!isWeb3Enabled) {
      return;
    }

    // Check if the current network is already Sepolia
    if (parseInt(chainId) === CHAIN_ID) {
      info("You're wallet is connected to Sepolia network")
      return;
    }


    // Switch to Sepolia network or add Sepolia and then switch
    async function switchToSepolia() {
      try {
        await web3.provider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0xaa36a7" }],                 
        });
      } catch (e) {
        if (e.code === 4902) {
          try {
            await web3.provider.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: "0xaa36a7",
                  chainName: "Sepolia test network",
                  rpcUrls: [
                    "https://sepolia.infura.io/v3/",
                  ],
                  nativeCurrency: {
                    name: "Sepolia Eth",
                    symbol: "SepoliaETH",
                    decimals: 18,
                  },
                  blockExplorerUrls: ["https://sepolia.etherscan.io"],
                },
              ],
            });
          } catch (e) {
            return error(e.message);
          }
        }
      }
    }

    switchToSepolia();
};

export default handleNetworkSwitch;