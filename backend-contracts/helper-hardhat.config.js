const networkConfig = {
    default: {
        name: "hardhat"
    },
    31337: {
        name: "localhost",
    },
    31337: {
        name: "sepolia",
    },
}

const developmentChains = ["hardhat", "localhost", "buildBearEth"]

module.exports = {
    networkConfig,
    developmentChains,
}