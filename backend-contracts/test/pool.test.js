const {ethers, deployments, network, getNamedAccounts} = require("hardhat")
const {expect, assert} = require("chai")
const { developmentChains } = require("../helper-hardhat.config")
const poolAbi = require("../artifacts/contracts/Pool.sol/Pool.json")

!developmentChains.includes(network.name)
  ? describe.skip()
  : describe("Tests for Pool", function(){
      let poolFactory
      let pool
      let deployer
      let user
      let token0
      let token1
      let fee

      beforeEach(async function(){
        deployer = await getNamedAccounts().deployer
        user = await getNamedAccounts().user

        await deployments.fixture(["all"])
        poolFactory = await ethers.getContract("PoolFactory", deployer)

        token0 = (await ethers.getContract("MaticToken")).address;
        token1 = (await ethers.getContract("USDCToken")).address;
        fee = ethers.utils.parseUnits("1", 2).toString();
        
        const tx = await poolFactory.createPool(token0, token1, fee)
        const receipt = await tx.wait(1)
        const {poolAddress} = receipt.events[0].args
        pool = await ethers.getContractAt(poolAbi.abi, poolAddress, deployer)
      })

      it("should return address of token0 and token1", async function(){
        const ourTokens = [token0, token1]
        const tokens = await pool.getTokens()
        tokens.forEach((token,i)=> expect(token).to.equal(ourTokens[i]))
      })

      describe("After adding Liquidity", function(){
        this.beforeEach(async()=>{
          
        })
      })
})