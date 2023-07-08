const { network, ethers } = require("hardhat")
const { developmentChains } = require("../helper-hardhat.config")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    // if(developmentChains.includes(network.name)){

        const fee = ethers.utils.parseUnits("0.5", 2).toString();

        const solanaToken = (await ethers.getContract("SolanaToken", deployer)).address
        const maticToken = (await ethers.getContract("MaticToken", deployer)).address
        const usdcToken = (await ethers.getContract("USDCToken", deployer)).address
        const shibaInuToken = (await ethers.getContract("ShibaInuToken", deployer)).address
        const cardanoToken = (await ethers.getContract("CardanoToken", deployer)).address
        
        const poolFactory = await ethers.getContract("PoolFactory", deployer)

        const pairs = [[solanaToken, usdcToken, fee], [maticToken, usdcToken, fee], [shibaInuToken, usdcToken, fee],[cardanoToken, usdcToken, fee],[maticToken, solanaToken, fee], [solanaToken, cardanoToken, fee], [shibaInuToken, maticToken, fee]]

        for(let pair of pairs){
            const tx = await poolFactory.createPool(pair[0], pair[1], pair[2]);
            await tx.wait(1)
        }
}

module.exports.tags = ["all", "testPools"]
