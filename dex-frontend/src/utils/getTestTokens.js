import { success, error } from "./toastWrapper";

export const addTestToken = async (web3, token) => {
    try {
        // Request the user's permission to add the token
        await web3.provider.request({
          method: 'wallet_watchAsset',
          params: {
            type: 'ERC20',
            options: {
              address: token.address,
              symbol: token.symbol,
              decimals: 18,
            },
          },
        });

        success(`Added ${token.name} to your wallet`)
    } catch (e) {
        error(e.message);
    }
};