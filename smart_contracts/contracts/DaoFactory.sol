// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "./DataDao.sol";

contract DaoFactory {
    struct Deal {
        uint64 dealId;
        address dao;
        uint proposolId;
    }

    struct ProviderDeals {
        uint64 provider;
        Deal[] deals;
    }

    address[] public deployedDaos;
    mapping(address => bool) public isDeployedDao;
    mapping(uint64 => ProviderDeals) public providerDeals;

    function createDao(
        address[] memory proposers,
        address[] memory voters,
        uint minVotesArg,
        string memory name
    ) public {
        address newDao = address(new DataDao(proposers, voters, minVotesArg, name, address(this)));
        deployedDaos.push(newDao);
        isDeployedDao[newDao] = true;
    }

    function addDeal(uint64 provider, uint64 dealId, uint proposolId) public {
        require(isDeployedDao[msg.sender], "This is not a deployed DAO");
        providerDeals[provider].provider = provider;
        providerDeals[provider].deals.push(Deal(dealId, msg.sender, proposolId));
    }

    function getProviderDeals(uint64 provider) public view returns (ProviderDeals memory) {
        return providerDeals[provider];
    }

    function getDeployedDaos() public view returns (address[] memory) {
        return deployedDaos;
    }
}
