const { network, ethers } = require("hardhat")
const { developmentChains } = require("../helper-hardhat.config")
const { utils } = require("ethers")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    // if(developmentChains.includes(network.name)){
        log("----------------------------------------")
        const argsMatic = ["100100"]
        const argsUsdc = ["268000"]
        const argsCardano = ["100100"]
        const argsShibaInu = ["100250"]
        const argsSolana = ["100200"]

        await deploy("MaticToken", {
            from: deployer,
            args: argsMatic,
            log: true,
            waitConfirmations: network.config.blockConfirmations || 1,
            gasPrice: 5000000000,
        })
        await deploy("USDCToken", {
            from: deployer,
            args: argsUsdc,
            log: true,
            waitConfirmations: network.config.blockConfirmations || 1,
            gasPrice: 5000000000,
        })
        await deploy("SolanaToken", {
            from: deployer,
            args: argsSolana,
            log: true,
            waitConfirmations: network.config.blockConfirmations || 1,
            gasPrice: 5000000000,
        })
        await deploy("CardanoToken", {
            from: deployer,
            args: argsCardano,
            log: true,
            waitConfirmations: network.config.blockConfirmations || 1,
            gasPrice: 5000000000,
        })
        await deploy("ShibaInuToken", {
            from: deployer,
            args: argsShibaInu,
            log: true,
            waitConfirmations: network.config.blockConfirmations || 1,
            gasPrice: 5000000000,
        })
    // }
}

module.exports.tags = ["all", "testTokens"]
