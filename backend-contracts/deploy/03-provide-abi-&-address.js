const {ethers, network} = require("hardhat")
const fs = require("fs")

module.exports = async function() {
    if(process.env.UPDATE_CONTRACT_DATA){
        console.log("Updating abi's and addresses in required places>>>>>>>")
        const PoolFactory = await ethers.getContract("PoolFactory")
        
        const poolAddress = PoolFactory.getPool('0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0', 1)
        const Pool = await ethers.getContractAt("Pool", poolAddress, PoolFactory.address)
        await updateAbi(Pool, "../dex-frontend/src/constants/poolAbi.json")

        await updateAbi(PoolFactory, "../dex-frontend/src/constants/PoolFactoryAbi.json")
        await updateContractAddresses(PoolFactory, "../dex-frontend/src/constants/PoolFactoryAddresses.json")

        console.log("Updated abi's and addresses.........")
    }
}

async function updateAbi(contract, file) {
    // Getting the abi
    const abi = contract.interface.format(ethers.utils.FormatTypes.json)

    // Writing the new abi to the file
    fs.writeFileSync(file, abi)
}

async function updateContractAddresses(contract, file){
    
    const chainId = network.config.chainId.toString()
    
    const contractAddresses = JSON.parse(fs.readFileSync(file, "utf8"))
    
    if(contractAddresses[chainId]){
        contractAddresses[chainId] = contract.address
    }
    else {
        contractAddresses[chainId] = contract.address
    }
    
    fs.writeFileSync(file, JSON.stringify(contractAddresses))
}
