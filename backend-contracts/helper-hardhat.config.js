const networkConfig = {
    default: {
        name: "hardhat"
    },
    31337: {
        name: "localhost",
    },
    11155111: {
        name: "sepolia",
    },
}

const developmentChains = ["hardhat", "localhost"]

module.exports = {
    networkConfig,
    developmentChains,
}