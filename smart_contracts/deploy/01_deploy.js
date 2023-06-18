require("hardhat-deploy")
require("hardhat-deploy-ethers")
// const { networkConfig } = require("../helper-hardhat-config")

const util = require("util")
const request = util.promisify(require("request"))

const DEPLOYER_PRIVATE_KEY = network.config.accounts[0]

const deployer = new ethers.Wallet(DEPLOYER_PRIVATE_KEY, ethers.provider)


async function callRpc(method, params) {
    var options = {
        method: "POST",
        url: "https://api.calibration.node.glif.io/rpc/v1",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            jsonrpc: "2.0",
            method: method,
            params: params,
            id: 1,
        }),
    }
    const res = await request(options)
    return JSON.parse(res.body).result
}

module.exports = async ({ deployments }) => {
    const { deploy } = deployments

    // const priorityFee = await callRpc("eth_maxPriorityFeePerGas")
    // console.log("priorityFee:", priorityFee)

    // Wraps Hardhat's deploy, logging errors to console.
    const deployLogError = async (title, obj) => {
        let ret
        try {
            ret = await deploy(title, obj)
        } catch (error) {
            console.log(error.toString())
            process.exit(1)
        }
        return ret
    }

    console.log("Wallet Ethereum Address:", deployer.address)
    // const chainId = network.config.chainId
    // const tokenToBeMinted = networkConfig[chainId]["tokenToBeMinted"]

    console.log("Deploying DaoFactory...")
    await deployLogError("DaoFactory", {
        from: deployer.address,
        args: [],
        // maxPriorityFeePerGas to instruct hardhat to use EIP-1559 tx format
        // maxPriorityFeePerGas: priorityFee,
        log: true,
        // gasLimit: 1000000000,
    })

    // //deploy DaoFactory
    // const DaoFactory = await ethers.getContractFactory('DaoFactory', deployer);
    // console.log('Deploying DaoFactory...');
    // const df = await DaoFactory.deploy();
    // await df.deployed()
    // console.log('DaoFactory deployed to:', df.address);
}
