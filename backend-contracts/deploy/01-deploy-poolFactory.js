const {network} = require("hardhat");
const {developmentChains} = require("../helper-hardhat.config")
const {verify} = require("../utils/verify")

// hre = hardhat runtime environment gives all this arguments to deploy scripts

module.exports = async ({getNamedAccounts, deployments}) => {
    const {deploy, log, get} = deployments
    const {deployer} = await getNamedAccounts()
    const {name: networkName} = network;

    const args = []
    const waitConfirmations = networkName === "hardhat" ? 0 : 2

    const poolFactory = await deploy("PoolFactory",{
        from: deployer,
        args,
        log: true,
        waitConfirmations,
    });

    if(!developmentChains.includes(network.name)){
        console.log("Verifying...")
        await verify(poolFactory.address, args)
    }
    log("--------------------------------")
}

module.exports.tags = ["all", "PoolFactory", "main"]
