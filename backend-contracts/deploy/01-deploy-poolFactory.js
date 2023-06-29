const {network, ethers} = require("hardhat");
const {developmentChains, networkConfig} = require("../helper-hardhat.config")
const {verify} = require("../utils/verify")

// hre = hardhat runtime environment gives all this arguments to deploy scripts

module.exports = async ({getNamedAccounts, deployments}) => {
    const {deploy, log, get} = deployments
    const {deployer} = await getNamedAccounts()
    const {name: networkName} = network;

    const args = []

    await deploy("PoolFactory",{
        from: deployer,
        args,
        log: true,
        waitConfirmations: 1
    });

    const poolFactory = await ethers.getContract("PoolFactory");
    
    try{
        const tx = await poolFactory.createPool('0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0', 1)
        await tx.wait(1)
    }
    catch(e){
        console.log(e.message)
    }
}

module.exports.tags = ["all", "PoolFactory", "main"]
