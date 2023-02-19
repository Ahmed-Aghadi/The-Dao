// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@zondax/filecoin-solidity/contracts/v0.8/MarketAPI.sol";
import "@zondax/filecoin-solidity/contracts/v0.8/types/MarketTypes.sol";
import "@zondax/filecoin-solidity/contracts/v0.8/utils/Actor.sol";
import "./DaoFactory.sol";

// import {MarketAPI} from "./lib/filecoin-solidity/contracts/v0.8/MarketAPI.sol";
// import {CommonTypes} from "./lib/filecoin-solidity/contracts/v0.8/types/CommonTypes.sol";
// import {MarketTypes} from "./lib/filecoin-solidity/contracts/v0.8/types/MarketTypes.sol";
// import {Actor, HyperActor} from "./lib/filecoin-solidity/contracts/v0.8/utils/Actor.sol";
// import {Misc} from "./lib/filecoin-solidity/contracts/v0.8/utils/Misc.sol";

contract DataDao {
    // enum Roles {
    //     PROPOSER,
    //     VOTER
    // }

    struct Deal {
        uint minIndex; // minimum index from where current deal exists
        int64[] end; // sorted end time of deals from min to max value of end time
    }

    // mapping(bytes => bool) public cidSet;
    // mapping(bytes => uint) public cidSizes;
    mapping(uint => mapping(uint64 => bool)) public cidProviders; // proposal id => provider => bool
    mapping(uint => Deal) public cidDeals; // proposal id => deal

    address public owner;
    // address constant CALL_ACTOR_ID = 0xfe00000000000000000000000000000000000005;
    // uint64 constant DEFAULT_FLAG = 0x00000000;
    uint64 constant METHOD_SEND = 0;

    // mapping(address => Roles) public roles;
    mapping(address => bool) public isProposer;
    mapping(address => bool) public isVoter;

    struct Proposal {
        uint id;
        bytes cid;
        uint size;
        uint bountyAmount;
        uint numberOfBounties;
        uint amountedFunded;
        uint votes;
        uint64 minDays; // minimum number of days the storage provider should have stored the data ( in blocks )
        uint64 maxDealAtATime; // maximum number of deals that can be made at a time ( 0 = unlimited )
        uint minDealsDone; // minimum number of deals that provider has already done in all the Daos under the DaoFactory
        uint endTime; // proposal end time
        bool enabled; // true if the amount funded is equal to the bounty amount * number of bounties
    }

    string public name;
    uint public minVotes;
    uint public proposalCount = 0;
    address public daoFactory;

    mapping(uint => Proposal) public proposals;
    mapping(bytes => uint) public cidProposalId;
    mapping(address => mapping(uint => bool)) public hasVoted;
    mapping(uint => uint64[]) public proposalDealIds; // proposal id => deal ids

    constructor(
        address[] memory proposers,
        address[] memory voters,
        uint minVotesArg,
        string memory nameArg,
        address daoFactoryArg
    ) {
        require(proposers.length > 0, "must have at least one proposer");
        require(voters.length > 0, "must have at least one voter");
        require(minVotesArg > 0, "must have at least one vote");
        require(
            minVotesArg <= voters.length,
            "min votes must be less than or equal to number of voters"
        );
        require(bytes(nameArg).length > 0, "must have a name");
        name = nameArg;
        daoFactory = daoFactoryArg;
        owner = msg.sender;
        minVotes = minVotesArg;
        for (uint i = 0; i < proposers.length; i++) {
            // roles[proposers[i]] = Roles.PROPOSER;
            isProposer[proposers[i]] = true;
        }
        for (uint i = 0; i < voters.length; i++) {
            // roles[voters[i]] = Roles.VOTER;
            isVoter[voters[i]] = true;
        }
    }

    function addProposer(address proposer) public {
        require(msg.sender == owner, "only owner can add proposers");
        // roles[proposer] = Roles.PROPOSER;
        isProposer[proposer] = true;
    }

    function addVoter(address voter) public {
        require(msg.sender == owner, "only owner can add voters");
        // roles[voter] = Roles.VOTER;
        isVoter[voter] = true;
    }

    function removeProposer(address proposer) public {
        require(msg.sender == owner, "only owner can remove proposers");
        // roles[proposer] = Roles.VOTER;
        isProposer[proposer] = false;
    }

    function removeVoter(address voter) public {
        require(msg.sender == owner, "only owner can remove voters");
        // roles[voter] = Roles.PROPOSER;
        isVoter[voter] = false;
    }

    function updateMinVotes(uint minVotesArg) public {
        require(msg.sender == owner, "only owner can update min votes");
        require(minVotesArg > 0, "must have at least one vote");
        minVotes = minVotesArg;
    }

    function createProposol(
        bytes calldata cidraw,
        uint size,
        uint bountyAmount,
        uint numberOfBounties,
        uint64 minDays, // minimum number of days the storage provider should have stored the data ( in blocks )
        uint64 maxDealAtATime, // maximum number of deals that can be made at a time ( 0 = unlimited )
        uint minDealsDone, // minimum number of deals that provider has already done in all the Daos under the DaoFactory
        uint endTime // proposal end time
    ) public {
        // require(roles[msg.sender] == Roles.PROPOSER, "only proposers can create proposals");
        require(isProposer[msg.sender], "only proposers can create proposals");
        proposalCount++;
        Proposal memory proposal = Proposal({
            id: proposalCount,
            cid: cidraw,
            size: size,
            bountyAmount: bountyAmount,
            numberOfBounties: numberOfBounties,
            amountedFunded: 0,
            votes: 0,
            minDays: minDays,
            maxDealAtATime: maxDealAtATime,
            minDealsDone: minDealsDone,
            endTime: endTime,
            enabled: false
        });
        proposals[proposalCount] = proposal;
        cidProposalId[cidraw] = proposalCount;
    }

    function vote(uint proposalId) public {
        // require(roles[msg.sender] == Roles.VOTER, "only voters can vote");
        require(isVoter[msg.sender], "only voters can vote");
        require(!hasVoted[msg.sender][proposalId], "voter has already voted on this proposal");
        hasVoted[msg.sender][proposalId] = true;
        Proposal storage proposal = proposals[proposalId];
        require(proposal.endTime > block.timestamp, "proposal has ended");
        proposal.votes++;
    }

    function fund(uint proposalId) public payable {
        Proposal storage proposal = proposals[proposalId];
        require(proposal.votes >= minVotes, "proposal has not been voted on enough times");
        require(msg.value == proposal.bountyAmount, "must fund proposal with exact bounty amount");
        require(
            proposal.amountedFunded < proposal.bountyAmount * proposal.numberOfBounties,
            "proposal has been fully funded"
        );
        require(proposal.endTime < block.timestamp, "proposal has not ended yet");
        require(!proposal.enabled, "proposal has already been enabled");
        proposal.amountedFunded += proposal.bountyAmount;
        if (proposal.amountedFunded == proposal.bountyAmount * proposal.numberOfBounties) {
            proposal.enabled = true;
        }
    }

    function claimBounty(uint64 dealId) public {
        MarketTypes.GetDealDataCommitmentReturn memory commitmentRet = MarketAPI
            .getDealDataCommitment(dealId);

        MarketTypes.GetDealProviderReturn memory providerRet = MarketAPI.getDealProvider(dealId);

        MarketTypes.GetDealTermReturn memory termRet = MarketAPI.getDealTerm(dealId);

        bytes memory cidraw = commitmentRet.data;

        uint proposalId = cidProposalId[cidraw];
        require(proposalId != 0, "proposal does not exist");
        Proposal memory proposal = proposals[proposalId];

        authorizeData(
            providerRet.provider,
            commitmentRet.size,
            termRet.start,
            termRet.end,
            proposal
        );
        proposalDealIds[proposalId].push(dealId);
        DaoFactory(daoFactory).addDeal(providerRet.provider, dealId, proposal.id);
        // get dealer (bounty hunter client)
        MarketTypes.GetDealClientReturn memory clientRet = MarketAPI.getDealClient(dealId);
        send(clientRet.client, proposal.bountyAmount);
    }

    // function fund(uint64 unused) public payable {}

    // function addCID(bytes calldata cidraw, uint size) public {
    //     require(msg.sender == owner);
    //     cidSet[cidraw] = true;
    //     cidSizes[cidraw] = size;
    // }

    function policyOK(uint id, uint64 provider) internal view returns (bool) {
        bool alreadyStoring = cidProviders[id][provider];
        return !alreadyStoring;
    }

    function authorizeData(
        uint64 provider,
        uint size,
        int64 start,
        int64 end,
        Proposal memory proposal
    ) public {
        // require(cidSet[cidraw], "cid must be added before authorizing");
        // require(cidSizes[cidraw] == size, "data size must match expected");
        require(proposal.enabled, "proposal must be enabled");
        require(proposal.size == size, "data size must match expected");
        require(proposal.amountedFunded != 0, "proposal must have funds");
        require(
            policyOK(proposal.id, provider),
            "deal failed policy check: has provider already claimed this cid?"
        );
        require(
            DaoFactory(daoFactory).getProviderDeals(provider).deals.length >= proposal.minDealsDone,
            "deal failed policy check: minDealsDone"
        );
        require(
            uint64(start) + proposal.minDays <= block.number,
            "deal must be longer than minDays"
        );
        require(end - start >= int64(proposal.minDays), "deal must be longer than minDays");
        Deal storage currDeal = cidDeals[proposal.id];
        require(
            currDeal.end.length < proposal.numberOfBounties,
            "deal failed policy check: max deals"
        );
        require(
            proposal.maxDealAtATime == 0 ||
                currDeal.end.length - currDeal.minIndex < proposal.maxDealAtATime ||
                currDeal.end[currDeal.minIndex] < end,
            "deal failed policy check: maxDealAtATime"
        );
        if (currDeal.end[currDeal.minIndex] < end) {
            currDeal.minIndex++;
        }

        cidProviders[proposal.id][provider] = true;
        // add deal to cidDeals in sorted order
        for (uint i = currDeal.minIndex; i < currDeal.end.length; i++) {
            if (end < currDeal.end[i]) {
                int64 temp = end;
                end = currDeal.end[i];
                currDeal.end[i] = temp;
            }
        }
        currDeal.end.push(end);
    }

    // function claim_bounty(uint64 deal_id) public {
    //     MarketTypes.GetDealDataCommitmentReturn memory commitmentRet = MarketAPI
    //         .getDealDataCommitment(MarketTypes.GetDealDataCommitmentParams({id: deal_id}));
    //     MarketTypes.GetDealProviderReturn memory providerRet = MarketAPI.getDealProvider(
    //         MarketTypes.GetDealProviderParams({id: deal_id})
    //     );

    //     authorizeData(commitmentRet.data, providerRet.provider, commitmentRet.size);

    //     // get dealer (bounty hunter client)
    //     MarketTypes.GetDealClientReturn memory clientRet = MarketAPI.getDealClient(
    //         MarketTypes.GetDealClientParams({id: deal_id})
    //     );

    //     // send reward to client
    //     send(clientRet.client);
    // }

    // function call_actor_id(
    //     uint64 method,
    //     uint256 value,
    //     uint64 flags,
    //     uint64 codec,
    //     bytes memory params,
    //     uint64 id
    // ) public returns (bool, int256, uint64, bytes memory) {
    //     (bool success, bytes memory data) = address(CALL_ACTOR_ID).delegatecall(
    //         abi.encode(method, value, flags, codec, params, id)
    //     );
    //     (int256 exit, uint64 return_codec, bytes memory return_value) = abi.decode(
    //         data,
    //         (int256, uint64, bytes)
    //     );
    //     return (success, exit, return_codec, return_value);
    // }

    // send 1 FIL to the filecoin actor at actor_id
    function send(uint64 actorID, uint amount) internal {
        bytes memory emptyParams = "";
        delete emptyParams;

        Actor.callByID(actorID, METHOD_SEND, Misc.NONE_CODEC, emptyParams, amount);
    }

    function getCurrentBlockNumber() public view returns (uint) {
        return (block.number);
    }

    function getCurrentTimestamp() public view returns (uint) {
        return (block.timestamp);
    }
}
