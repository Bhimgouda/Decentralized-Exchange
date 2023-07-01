const { network, ethers } = require("hardhat")
const { developmentChains } = require("../helper-hardhat.config")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    if(developmentChains.includes(network.name)){
        log("----------------------------------------")
        const argsMatic = ["10000"]
        const argsUsdc = ["1000000"]
        const argsCardano = ["11000"]
        const argsShibaInu = ["1000000"]
        const argsSolana = ["21000"]

        await deploy("MaticToken", {
            from: deployer,
            args: argsMatic,
            log: true,
            waitConfirmations: network.config.blockConfirmations || 1,
        })
        await deploy("USDCToken", {
            from: deployer,
            args: argsUsdc,
            log: true,
            waitConfirmations: network.config.blockConfirmations || 1,
        })
        await deploy("SolanaToken", {
            from: deployer,
            args: argsSolana,
            log: true,
            waitConfirmations: network.config.blockConfirmations || 1,
        })
        await deploy("CardanoToken", {
            from: deployer,
            args: argsCardano,
            log: true,
            waitConfirmations: network.config.blockConfirmations || 1,
        })
        await deploy("ShibaInuToken", {
            from: deployer,
            args: argsShibaInu,
            log: true,
            waitConfirmations: network.config.blockConfirmations || 1,
        })
    }
}

module.exports.tags = ["all", "testTokens"]
