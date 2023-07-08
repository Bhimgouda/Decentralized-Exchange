const { ethers } = require("ethers")

require("@nomiclabs/hardhat-waffle")
require("hardhat-gas-reporter")
require("@nomiclabs/hardhat-etherscan")
require("dotenv").config()
require("solidity-coverage")
require("hardhat-deploy")

// RPC URLs
const MAINNET_RPC_URL = process.env.ETHEREUM_MAINNET_RPC_URL || ""
const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL || ""
const POLYGON_MAINNET_RPC_URL = process.env.POLYGON_MAINNET_RPC_URL || ""
const BUILDBEAR_ETH_RPC_URL = process.env.BUILDBEAR_ETH_RPC_URL || ""

// PRIVATE KEY
const PRIVATE_KEY = process.env.PRIVATE_KEY || "0x"

// API KEYS
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "Your etherscan API key"
const POLYGONSCAN_API_KEY = process.env.POLYGONSCAN_API_KEY || "Your polygonscan API key"
const REPORT_GAS = process.env.REPORT_GAS || false

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
        {
            version: "0.8.7",
        },
        {
            version: "0.7.5",
        },
    ],
  },
  networks:{
    hardhat: {
      chainId: 31337
    },
    localhost: {
      chainId:31337
    },
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      saveDeployments: true,
      chainId: 11155111,
      blockConfirmations: 1,
      gasPrice: 2000
    },
    mainnet:{
      url: MAINNET_RPC_URL,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      saveDeployments: true,
      chainId: 1,
      blockConfirmations: 5
    },
    polygon: {
      url: POLYGON_MAINNET_RPC_URL,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      saveDeployments: true,
      chainId: 137,
      blockConfirmations: 5
    },
    buildBearEth: {
      url: BUILDBEAR_ETH_RPC_URL,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      saveDeployments: true,
      chainId: 9709,
      blockConfirmations: 1
    }
  },
  namedAccounts: {
    deployer: {
        default: 0, // here this will by default take the first account as deployer
        1: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
    },
    user: {
      default: 1,
    }
  },  
  etherscan: {
    apiKey: {
      sepolia: ETHERSCAN_API_KEY,
      polgon: POLYGONSCAN_API_KEY
    }
  },
  gasReporter: {
    enabled: REPORT_GAS,
    currency: "USD",
    outputFile: "gas-report.txt",
    noColors: true,
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
  },
  contractSizer: {
    runOnCompile: false,
  },
};