// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@zondax/filecoin-solidity/contracts/v0.8/MarketAPI.sol";
import "@zondax/filecoin-solidity/contracts/v0.8/types/MarketTypes.sol";
import "@zondax/filecoin-solidity/contracts/v0.8/types/CommonTypes.sol";
import "@zondax/filecoin-solidity/contracts/v0.8/utils/Actor.sol";
import "./DaoFactory.sol";

error ProposalNotEnabled();
error DataSizeMismatch();
error ProposalFundsMissing();
error PolicyCheckFailed();
error MinDealsNotMet();
error DealTooShort();
error MaxDealsReached();
error MaxDealsAtATimeReached();

error NotOwner();
error NotProposer();
error NotVoter();
error ProposersZero();
error VotersZero();
error InvalidMinVotes();
error NoName();

contract DataDao {
    event ProposalCreated(uint id);
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
        uint8 enabled; // 0 = not enabled, 1 = partial and not enabled, 2 = partial and enabled, 3 = totally enabled
        // partial and not enabled: if data is not uploaded to Filecoin yet
        // partial and  enabled: if data was not uploaded to Filecoin but now is uploaded
        // totally enabled: if the amount funded is equal to the bounty amount * number of bounties
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
        // require(proposers.length > 0, "must have at least one proposer");
        if (proposers.length == 0) {
            revert ProposersZero();
        }
        // require(voters.length > 0, "must have at least one voter");
        if (voters.length == 0) {
            revert VotersZero();
        }
        // require(minVotesArg > 0, "must have at least one vote");
        // require(
        //     minVotesArg <= voters.length,
        //     "min votes must be less than or equal to number of voters"
        // );
        if (minVotesArg == 0 || minVotesArg > voters.length) {
            revert InvalidMinVotes();
        }
        // require(bytes(nameArg).length > 0, "must have a name");
        if (bytes(nameArg).length == 0) {
            revert NoName();
        }
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
        // require(msg.sender == owner, "only owner can add proposers");
        if (msg.sender != owner) {
            revert NotOwner();
        }
        // roles[proposer] = Roles.PROPOSER;
        isProposer[proposer] = true;
    }

    function addVoter(address voter) public {
        // require(msg.sender == owner, "only owner can add voters");
        if (msg.sender != owner) {
            revert NotOwner();
        }
        // roles[voter] = Roles.VOTER;
        isVoter[voter] = true;
    }

    function removeProposer(address proposer) public {
        // require(msg.sender == owner, "only owner can remove proposers");
        if (msg.sender != owner) {
            revert NotOwner();
        }
        // roles[proposer] = Roles.VOTER;
        isProposer[proposer] = false;
    }

    function removeVoter(address voter) public {
        // require(msg.sender == owner, "only owner can remove voters");
        if (msg.sender != owner) {
            revert NotOwner();
        }
        // roles[voter] = Roles.PROPOSER;
        isVoter[voter] = false;
    }

    function updateMinVotes(uint minVotesArg) public {
        // require(msg.sender == owner, "only owner can update min votes");
        if (msg.sender != owner) {
            revert NotOwner();
        }
        // require(minVotesArg > 0, "must have at least one vote");
        if (minVotesArg == 0) {
            revert InvalidMinVotes();
        }
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
        uint endTime, // proposal end time
        bool partialEnabled // false if data is not uploaded to Filecoin yet
    ) public {
        // require(isProposer[msg.sender], "only proposers can create proposals");
        if (!isProposer[msg.sender]) {
            revert NotProposer();
        }
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
            enabled: partialEnabled ? 1 : 0
        });
        proposals[proposalCount] = proposal;
        if (!partialEnabled) {
            cidProposalId[cidraw] = proposalCount;
        }
        emit ProposalCreated(proposalCount);
    }

    function enablePartial(uint proposalId, bytes calldata cidraw, uint size) public {
        // require(isProposer[msg.sender], "only proposers can enable partial");
        if (!isProposer[msg.sender]) {
            revert NotProposer();
        }
        require(proposals[proposalId].enabled == 1, "partial already enabled");
        Proposal storage proposal = proposals[proposalId];
        proposal.enabled = 2;
        proposal.cid = cidraw;
        proposal.size = size;
        cidProposalId[cidraw] = proposalId;
    }

    function vote(uint proposalId) public {
        // require(isVoter[msg.sender], "only voters can vote");
        if (!isVoter[msg.sender]) {
            revert NotVoter();
        }
        require(!hasVoted[msg.sender][proposalId], "already voted");
        hasVoted[msg.sender][proposalId] = true;
        Proposal storage proposal = proposals[proposalId];
        require(proposal.endTime > block.timestamp, "proposal has ended");
        proposal.votes++;
    }

    function fund(uint proposalId) public payable {
        Proposal storage proposal = proposals[proposalId];
        require(proposal.votes >= minVotes, "not voted enough times");
        require(msg.value == proposal.bountyAmount, "must fund proposal with exact bounty amount");
        require(
            proposal.amountedFunded < proposal.bountyAmount * proposal.numberOfBounties,
            "proposal has been fully funded"
        );
        require(proposal.endTime < block.timestamp, "proposal has not ended yet");
        require(proposal.enabled != 1, "proposal is partial and not enabled");
        require(proposal.enabled != 3, "proposal has already been enabled");
        proposal.amountedFunded += proposal.bountyAmount;
        if (proposal.amountedFunded == proposal.bountyAmount * proposal.numberOfBounties) {
            proposal.enabled = 3;
        }
    }

    function claimBounty(uint64 dealId) public {
        MarketTypes.GetDealDataCommitmentReturn memory commitmentRet = MarketAPI
            .getDealDataCommitment(dealId);

        uint64 providerRet = MarketAPI.getDealProvider(dealId);

        MarketTypes.GetDealTermReturn memory termRet = MarketAPI.getDealTerm(dealId);

        bytes memory cidraw = commitmentRet.data;

        uint proposalId = cidProposalId[cidraw];
        require(proposalId != 0, "proposal does not exist");
        Proposal storage proposal = proposals[proposalId];

        authorizeData(
            providerRet,
            commitmentRet.size,
            CommonTypes.ChainEpoch.unwrap(termRet.start),
            CommonTypes.ChainEpoch.unwrap(termRet.end),
            proposal
        );

        proposals[proposalId].amountedFunded -= proposal.bountyAmount;

        proposalDealIds[proposalId].push(dealId);
        DaoFactory(daoFactory).addDeal(providerRet, dealId, proposal.id);
        // get dealer (bounty hunter client)
        uint64 clientRet = MarketAPI.getDealClient(dealId);
        send(clientRet, proposal.bountyAmount);
    }

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
        if (proposal.enabled != 3) {
            revert ProposalNotEnabled();
        }
        if (proposal.size != size) {
            revert DataSizeMismatch();
        }
        if (proposal.amountedFunded == 0) {
            revert ProposalFundsMissing();
        }
        if (!policyOK(proposal.id, provider)) {
            revert PolicyCheckFailed();
        }
        if (
            DaoFactory(daoFactory).getProviderDeals(provider).deals.length < proposal.minDealsDone
        ) {
            revert MinDealsNotMet();
        }
        if (uint64(start) + proposal.minDays > block.number) {
            revert DealTooShort();
        }
        if (end - start < int64(proposal.minDays)) {
            revert DealTooShort();
        }
        Deal storage currDeal = cidDeals[proposal.id];
        if (currDeal.end.length >= proposal.numberOfBounties) {
            revert MaxDealsReached();
        }
        if (
            proposal.maxDealAtATime != 0 &&
            currDeal.end.length - currDeal.minIndex >= proposal.maxDealAtATime &&
            currDeal.end[currDeal.minIndex] >= end
        ) {
            revert MaxDealsAtATimeReached();
        }
        if (currDeal.end.length != 0 && currDeal.end[currDeal.minIndex] < end) {
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

    // send 1 FIL to the filecoin actor at actor_id
    function send(uint64 actorID, uint amount) internal {
        bytes memory emptyParams = "";
        delete emptyParams;

        Actor.callByID(
            CommonTypes.FilActorId.wrap(actorID),
            METHOD_SEND,
            Misc.NONE_CODEC,
            emptyParams,
            amount,
            false
        );
    }
}
