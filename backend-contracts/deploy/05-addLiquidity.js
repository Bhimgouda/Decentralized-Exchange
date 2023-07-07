const { network, ethers } = require("hardhat")
const { developmentChains } = require("../helper-hardhat.config")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    // if(developmentChains.includes(network.name)){

        const fee = ethers.utils.parseUnits("0.5", 2).toString();

        const solanaToken = (await ethers.getContract("SolanaToken", deployer))
        const maticToken = (await ethers.getContract("MaticToken", deployer))
        const usdcToken = (await ethers.getContract("USDCToken", deployer))
        const shibaInuToken = (await ethers.getContract("ShibaInuToken", deployer))
        const cardanoToken = (await ethers.getContract("CardanoToken", deployer))

        const tokens = [solanaToken, maticToken, usdcToken, shibaInuToken, cardanoToken]
        
        const poolFactory = await ethers.getContract("PoolFactory", deployer)
        const poolDeployer = poolFactory.address
        
        const SolUsdc = await ethers.getContractAt("Pool", (await poolFactory.getPool(solanaToken.address, usdcToken.address, fee)), deployer);
        const MaticUsdc = await ethers.getContractAt("Pool", (await poolFactory.getPool(maticToken.address, usdcToken.address, fee)), deployer);
        const ShibUsdc = await ethers.getContractAt("Pool", (await poolFactory.getPool(shibaInuToken.address, usdcToken.address, fee)), deployer);
        const adaUsdc = await ethers.getContractAt("Pool", (await poolFactory.getPool(cardanoToken.address, usdcToken.address, fee)), deployer);
        // const maticSol = await ethers.getContractAt("Pool", (await poolFactory.getPool(maticToken.address, solanaToken.address, fee)), deployer);
        // const solAda = await ethers.getContractAt("Pool", (await poolFactory.getPool(solanaToken.address, cardanoToken.address, fee)), deployer);
        // const shibMatic = await ethers.getContractAt("Pool", (await poolFactory.getPool(shibaInuToken.address, maticToken.address, fee)), deployer);

        const pools = [[solanaToken, usdcToken, SolUsdc], [maticToken, usdcToken, MaticUsdc], [shibaInuToken, usdcToken, ShibUsdc], [cardanoToken, usdcToken, adaUsdc]]
        // ,[maticToken, solanaToken, maticSol], [solanaToken, cardanoToken, solAda], [shibaInuToken, maticToken, shibMatic]]

        const amount0 = ethers.utils.parseUnits("100000", 18).toString();
        const amount1 = ethers.utils.parseUnits("67000", 18).toString();

        for(let pool of pools){
            const spenderAddress = pool[2].address
            const tx0 = await pool[0].approve(spenderAddress, amount0)
            await tx0.wait(1)
            const tx1 = await pool[1].approve(spenderAddress, amount1)
            await tx1.wait(1)
            const tx3 = await pool[2].addLiquidity(amount0, amount1)
            await tx3.wait()
        }
        
    // }
}

module.exports.tags = ["all", "addLiquidity"]
