const { ethers, deployments, network, getNamedAccounts } = require("hardhat");
const { expect } = require("chai");
const { developmentChains } = require("../helper-hardhat.config");
const poolAbi = require("../artifacts/contracts/Pool.sol/Pool.json");
const { utils } = require("ethers");
const { formatEther } = require("ethers/lib/utils");

!developmentChains.includes(network.name)
  ? describe.skip()
  : describe("Tests for Pool", function () {
      let poolFactory;
      let pool;
      let deployer;
      let user;
      let token0;
      let token1;
      let fee;

      let poolUser

      beforeEach(async function () {
        deployer = (await getNamedAccounts()).deployer;
        user = (await getNamedAccounts()).user;
        
        await deployments.fixture(["all"]);
        poolFactory = await ethers.getContract("PoolFactory", deployer);
        
        token0 = (await ethers.getContract("MaticToken")).address;
        token1 = (await ethers.getContract("USDCToken")).address;
        fee = ethers.utils.parseUnits("1", 2).toString();
        
        const tx = await poolFactory.createPool(token0, token1, fee);
        const receipt = await tx.wait(1);
        const { poolAddress } = receipt.events[0].args;
        pool = await ethers.getContractAt(poolAbi.abi, poolAddress, deployer);
        poolUser = await ethers.getContractAt(poolAbi.abi, poolAddress, user);

        const amount = ethers.utils.parseEther("100")

        await (await ethers.getContract("MaticToken", deployer)).transfer(user, amount)
        await (await ethers.getContract("USDCToken", deployer)).transfer(user, amount)
      });
      
      it("should return address of token0 and token1", async function () {
        const ourTokens = [token0, token1];
        const tokens = await pool.getTokens();
        tokens.forEach((token, i) => expect(token).to.equal(ourTokens[i]));
      });

      describe("After adding Liquidity", function () {
        let liquidityTokens

        beforeEach(async () => {
          const amount0 = ethers.utils.parseEther("10");
          const amount1 = ethers.utils.parseEther("20");

          // Approve token transfers from user
          const token0Contract = await ethers.getContractAt("IERC20", token0, user);
          const token1Contract = await ethers.getContractAt("IERC20", token1, user);

          await token0Contract.approve(pool.address, ethers.utils.parseEther("20"));
          await token1Contract.approve(pool.address, ethers.utils.parseEther("40"));
          
          // Add liquidity
          const addLiquidityTx = await poolUser.addLiquidity(amount0, amount1);
          const addLiquidityReceipt = await addLiquidityTx.wait(1);
          const event = addLiquidityReceipt.events.find(event=> event.event === "AddedLiquidity")
          liquidityTokens = event.args.liquidityToken;
        });

        it("should have correct reserves", async function () {
          const [reserve0, reserve1] = await pool.getReserves();
          expect(reserve0).to.equal(ethers.utils.parseEther("10"));
          expect(reserve1).to.equal(ethers.utils.parseEther("20"));
        });
        
        it("should have minted liquidity tokens", async function () {
          const userLiquidityBalance = await pool.balanceOf(user);
          console.log(userLiquidityBalance)
          expect(userLiquidityBalance).to.equal(liquidityTokens);
        });

        it("should have transferred tokens from user to the pool", async function () {
          const token0Contract = await ethers.getContractAt("IERC20", token0, user);
          const token1Contract = await ethers.getContractAt("IERC20", token1, user);
          const poolToken0Balance = await token0Contract.balanceOf(pool.address);
          const poolToken1Balance = await token1Contract.balanceOf(pool.address);
          expect(poolToken0Balance).to.equal(ethers.utils.parseEther("10"));
          expect(poolToken1Balance).to.equal(ethers.utils.parseEther("20"));
        });
      });
    });
