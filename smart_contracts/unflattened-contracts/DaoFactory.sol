// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "./DataDao.sol";

import "@tableland/evm/contracts/utils/TablelandDeployments.sol";
import "@tableland/evm/contracts/utils/SQLHelpers.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract DaoFactory {
    event DaoCreated(address dao);
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

    uint256 private _tableId;
    string private _tableName;
    string private _prefix = "TheDao";

    constructor() {
        _tableId = TablelandDeployments.get().create(
            address(this),
            /*
             *  CREATE TABLE {prefix}_{chainId} (
             *    id integer primary key,
             *    message text
             *  );
             */
            string.concat(
                "CREATE TABLE ",
                _prefix,
                "_",
                Strings.toString(block.chainid),
                " (id integer primary key, provider text NOT NULL, dealId text NOT NULL, dao text NOT NULL, proposolId text NOT NULL);"
            )
        );

        _tableName = string.concat(
            _prefix,
            "_",
            Strings.toString(block.chainid),
            "_",
            Strings.toString(_tableId)
        );
    }

    function createDao(
        address[] memory proposers,
        address[] memory voters,
        uint minVotesArg,
        string memory name
    ) public returns (address newDao) {
        newDao = address(new DataDao(proposers, voters, minVotesArg, name, address(this)));
        deployedDaos.push(newDao);
        isDeployedDao[newDao] = true;
        emit DaoCreated(newDao);
    }

    function addDeal(uint64 provider, uint64 dealId, uint proposolId) public {
        require(isDeployedDao[msg.sender], "This is not a deployed DAO");
        providerDeals[provider].provider = provider;
        providerDeals[provider].deals.push(Deal(dealId, msg.sender, proposolId));
        TablelandDeployments.get().mutate(
            address(this),
            _tableId,
            SQLHelpers.toInsert(
                _prefix,
                _tableId,
                "provider,dealId,dao,proposolId",
                string.concat(
                    SQLHelpers.quote(Strings.toString(provider)),
                    ",",
                    SQLHelpers.quote(Strings.toString(dealId)),
                    ",",
                    SQLHelpers.quote(_addressToString(msg.sender)),
                    ",",
                    SQLHelpers.quote(Strings.toString(proposolId))
                )
            )
        );
    }

    function _addressToString(address x) public pure returns (string memory) {
        bytes memory s = new bytes(40);
        for (uint256 i = 0; i < 20; i++) {
            bytes1 b = bytes1(uint8(uint256(uint160(x)) / (2 ** (8 * (19 - i)))));
            bytes1 hi = bytes1(uint8(b) / 16);
            bytes1 lo = bytes1(uint8(b) - 16 * uint8(hi));
            s[2 * i] = char(hi);
            s[2 * i + 1] = char(lo);
        }
        return string.concat("0x", string(s));
    }

    function char(bytes1 b) public pure returns (bytes1 c) {
        if (uint8(b) < 10) return bytes1(uint8(b) + 0x30);
        else return bytes1(uint8(b) + 0x57);
    }

    function getProviderDeals(uint64 provider) public view returns (ProviderDeals memory) {
        return providerDeals[provider];
    }

    function getDeployedDaos() public view returns (address[] memory) {
        return deployedDaos;
    }

    function getTableName() public view returns (string memory) {
        return _tableName;
    }

    function getTableId() public view returns (uint256) {
        return _tableId;
    }
}
