require("@nomicfoundation/hardhat-toolbox")
require("hardhat-deploy")
require("hardhat-deploy-ethers")
require("./tasks")
require("dotenv").config()


const MUMBAI_RPC_URL = process.env.MUMBAI_RPC_URL || "https://rpc-mumbai.matic.today"

const POLYGONSCAN_API_KEY = process.env.POLYGONSCAN_API_KEY || "Your polygonscan API key"

const FANTOM_TESTNET_RPC_URL =
    process.env.FANTOM_TESTNET_RPC_URL || "https://rpc.testnet.fantom.network"

const FANTOMSCAN_API_KEY = process.env.FANTOMSCAN_API_KEY || "Your polygonscan API key"

const PRIVATE_KEY = process.env.PRIVATE_KEY
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    // solidity: "0.8.17",
    defaultNetwork: "hyperspace",
    networks: {
        hyperspace: {
            chainId: 3141,
            url: "https://api.hyperspace.node.glif.io/rpc/v1",
            accounts: [PRIVATE_KEY],
            timeout: 300000, // 300 seconds
        },
        mumbai: {
            url: MUMBAI_RPC_URL,
            accounts: [PRIVATE_KEY],
            saveDeployments: true,
            chainId: 80001,
            gas: 500000,
        },
        fantomtest: {
            url: FANTOM_TESTNET_RPC_URL,
            accounts: [PRIVATE_KEY],
            saveDeployments: true,
            chainId: 4002,
            gas: 500000,
        },
    },
    etherscan: {
        // npx hardhat verify --network <NETWORK> <CONTRACT_ADDRESS> <CONSTRUCTOR_PARAMETERS>
        apiKey: {
            polygonMumbai: POLYGONSCAN_API_KEY,
            fantomtest: FANTOMSCAN_API_KEY,
            ftmTestnet: FANTOMSCAN_API_KEY,
        },
    },
    paths: {
        sources: "./contracts",
        tests: "./test",
        cache: "./cache",
        artifacts: "./artifacts",
    },
    solidity: {
        version: "0.8.17",
        settings: {
            optimizer: {
                enabled: true,
                runs: 1000,
                details: { yul: false },
            },
        },
    },
    mocha: {
        timeout: 300000, // 300 seconds max for running tests
    },
}
