const { network, ethers } = require("hardhat")
const { developmentChains } = require("../helper-hardhat.config")
const { utils } = require("ethers")
const { parseEther } = require("ethers/lib/utils")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    // if(developmentChains.includes(network.name)){
        log("----------------------------------------")
        const argsMatic = [parseEther("120100")]
        const argsUsdc = [parseEther("3331726")]
        const argsCardano = [parseEther("885174")]
        const argsShibaInu = [parseEther("109400000")]
        const argsSolana = [parseEther("120306")]

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
    // }
}

module.exports.tags = ["all", "testTokens"]
