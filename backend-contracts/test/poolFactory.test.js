const { assert, expect } = require("chai");
const { ethers, deployments, getNamedAccounts, network } = require("hardhat");
const { developmentChains, networkConfig } = require("../helper-hardhat.config");
const { describe, beforeEach, it } = require("mocha");

if (developmentChains.includes(network.name)) {
  describe("Decentralized Exchange Tests", function () {

    let deployer;
    let poolFactory;
    let token0;
    let token1;
    let fee;

    beforeEach(async function () {
      ({ deployer } = await getNamedAccounts());
      await deployments.fixture(["all"]);
      poolFactory = await ethers.getContract("PoolFactory", deployer);

      token0 = (await ethers.getContract("MaticToken")).address;
      token1 = (await ethers.getContract("USDCToken")).address;
      fee = ethers.utils.parseUnits("1", 2).toString();
    });

    it("Should create a Pool", async function () {
      const tx = await poolFactory.createPool(token0, token1, fee);
      expect(tx).to.emit(poolFactory, "PoolCreated").withArgs(token0, token1, fee)
    });

    it("should not create Duplicate Pool", async function(){
        await poolFactory.createPool(token0, token1, fee)
        await expect(poolFactory.createPool(token0, token1, fee)).to.be.revertedWith("Token Pair Already exists")
    })

    it("Fee needs to be less than 1%", async function(){
        await expect(poolFactory.createPool(token0, token1, ethers.utils.parseUnits("2", 2).toString())).to.be.revertedWith("Fee cannot be more than 1%")
    })

    it("Same Token Pair Not Allowed", async function(){
        await expect(poolFactory.createPool(token0, token0, fee)).to.be.revertedWith("Same token Not Allowed")
    })

    it("Should return the same pool Address", async function(){
        const tx = await poolFactory.createPool(token0, token1, fee);
        const receipt = await tx.wait(1)

        const {poolAddress} = receipt.events[0].args

        let returnValue = await poolFactory.getPool(token0, token1, fee)
        expect(returnValue).to.equal(poolAddress)

        returnValue = await poolFactory.getPool(token1, token0, fee)
        expect(returnValue).to.equal(poolAddress)
    })

    it("should return 0x when args are different", async function(){
        const tx = await poolFactory.createPool(token0, token1, fee);
        await tx.wait(1)

        const differentFee = ethers.utils.parseUnits("0.1", 2).toString()
        const expectedAddress = "0x0000000000000000000000000000000000000000"

        let returnValue = await poolFactory.getPool(token0, token1, differentFee)
        expect(returnValue).to.equal(expectedAddress)
    })

    it("should return the same length of array with exact values", async function(){
        const fee1 = ethers.utils.parseUnits("0.1", 2).toString()
        const fee2 = ethers.utils.parseUnits("0.2", 2).toString()
        const fee3 = ethers.utils.parseUnits("0.3", 2).toString()

        const tx1 = await poolFactory.createPool(token0, token1, fee1);
        const tx2 = await poolFactory.createPool(token0, token1, fee2);
        const tx3 = await poolFactory.createPool(token0, token1, fee3);

        const {poolAddress: poolAddress1} = (await tx1.wait(1)).events[0].args
        const {poolAddress: poolAddress2} = (await tx2.wait(1)).events[0].args
        const {poolAddress: poolAddress3} = (await tx3.wait(1)).events[0].args

        const expectedPoolAddresses = [poolAddress1, poolAddress2, poolAddress3]

        const pools = await poolFactory.getAllPools()
        expect(pools.length).to.equal(3)
        
        pools.forEach((pool,index)=>expect(pool[2]).to.equal(expectedPoolAddresses[index]));
    })

  });
}
