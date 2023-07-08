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
        
        const SolUsdc = await ethers.getContractAt("Pool", (await poolFactory.getPool(solanaToken.address, usdcToken.address, fee)), deployer);
        const MaticUsdc = await ethers.getContractAt("Pool", (await poolFactory.getPool(maticToken.address, usdcToken.address, fee)), deployer);
        const ShibUsdc = await ethers.getContractAt("Pool", (await poolFactory.getPool(shibaInuToken.address, usdcToken.address, fee)), deployer);
        const adaUsdc = await ethers.getContractAt("Pool", (await poolFactory.getPool(cardanoToken.address, usdcToken.address, fee)), deployer);
        const maticSol = await ethers.getContractAt("Pool", (await poolFactory.getPool(maticToken.address, solanaToken.address, fee)), deployer);
        const solAda = await ethers.getContractAt("Pool", (await poolFactory.getPool(solanaToken.address, cardanoToken.address, fee)), deployer);
        const shibMatic = await ethers.getContractAt("Pool", (await poolFactory.getPool(shibaInuToken.address, maticToken.address, fee)), deployer);

        const pools = [
        [solanaToken, usdcToken, SolUsdc],
        [maticToken, usdcToken, MaticUsdc],
        [shibaInuToken, usdcToken, ShibUsdc],
        [cardanoToken, usdcToken, adaUsdc],
        [maticToken, solanaToken, maticSol],
        [solanaToken, cardanoToken, solAda],
        [shibaInuToken, maticToken, shibMatic]
    ]

        const amount0 = ["100000","100000","100000000", "100000", "10000", "10000", "9300000"]
        const amount1 = ["3200000", "67000", "726","44000", "306", "775174", "100"]

        poolCount = 0;
        for(let pool of pools){
            const spenderAddress = pool[2].address
            const tx0 = await pool[0].approve(spenderAddress, ethers.utils.parseEther(amount0[poolCount]))
            await tx0.wait(1)
            const tx1 = await pool[1].approve(spenderAddress, ethers.utils.parseEther(amount1[poolCount]))
            await tx1.wait(1)
            const tx3 = await pool[2].addLiquidity(ethers.utils.parseEther(amount0[poolCount]), ethers.utils.parseEther(amount1[poolCount]))
            await tx3.wait()
            poolCount++
        }
        
    // }
}

module.exports.tags = ["all", "addLiquidity"]
