export const contractAddress = require("./contractAddress.json");
export const daoFactoryAbi = require("./daoFactory.abi.json");
export const dataDaoAbi = require("./dataDao.abi.json");
export const daoFactoryContractAddress = contractAddress.DaoFactory;
export const marketDeals = require("./StateMarketDeals.json").Deals;

import { tabs as tabsImport } from "./tabs";
export const tabs = tabsImport;

export const currency = "TFIL";
export const rpcUrl = "https://api.hyperspace.node.glif.io/rpc/v1";

// module.exports = {
//     currency,
//     daoFactoryContractAddress,
//     daoFactoryAbi,
//     tabs,
// };

// exports = module.exports;
