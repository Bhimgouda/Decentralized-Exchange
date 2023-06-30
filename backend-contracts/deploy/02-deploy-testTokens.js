const { network, ethers } = require("hardhat")
const { developmentChains } = require("../helper-hardhat.config")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    if(developmentChains.includes(network.name)){
        log("----------------------------------------")
        const argsMatic = [ethers.utils.parseEther("1000").toString()]
        const argsUsdc = [ethers.utils.parseEther("10000").toString()]

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
    }
}

module.exports.tags = ["all", "testTokens"]
