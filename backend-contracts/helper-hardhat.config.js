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

const developmentChains = ["hardhat", "localhost"]

module.exports = {
    networkConfig,
    developmentChains,
}