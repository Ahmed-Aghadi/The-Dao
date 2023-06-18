# The-Dao

### Deployed website (deployed on vercel): [The Dao](https://the-dao.vercel.app/)

<br>

The-Dao is a powerful platform designed for Data Dao to facilitate complex storage deals. It offers a user-friendly experience (UX) for both Filecoin storage providers and clients. Through the use of smart contracts, the platform enables the orchestration and aggregation of deals in a programmatically handled manner.

Key Features:

1. Complex Bounties: Data Dao can create sophisticated proposals and bounties on The-Dao. These proposals can include multiple bounties, allowing for concurrent storage of data for extended periods of time through perpetual deals.

2. On-Chain Reputation: The platform generates reputation for storage providers based on the completion of bounty deals. This on-chain reputation data can be leveraged by Data Dao to impose restrictions on storage deals. For example, only storage providers with a minimum reputation level can participate in certain deals. The on-chain reputation of storage providers is securely stored on Tableland, which allows other platforms to utilize this data and contribute to a better ecosystem for Filecoin Verified Markets (FVM).

3. DAO Governance: A Data Dao is created on the platform, with the owner having the ability to assign and unassign proposal and voter roles. The owner can also update the minimum number of votes required to pass a proposal.

4. Proposal Workflow: Once a Data Dao is established, users with the proposal role can create proposals. When a sufficient number of votes are registered, the proposal is considered funded. After funding, clients can claim bounties.

5. Proposal Schema: Proposals consist of various attributes, including the CID (Content Identifier) of the data, file size, bounty amount, number of bounties, minimum storage duration before claiming the bounty, maximum number of active bounty deals, minimum bounty deal requirements based on on-chain reputation, and expiry date and time (proposals must receive enough votes before expiry).

6. Active Deals: Proposals can be configured to allow a specific number of active deals at a given time. This enables multiple providers to store the data concurrently, ensuring redundancy and longer-term storage through the assignment of multiple bounties.

7. Partial Proposals: The platform supports partial proposals, where files are uploaded to IPFS (InterPlanetary File System) using Spheron. After a proposal is accepted, the file can be uploaded to the Filecoin Network using Lighthouse. The IPFS URL of the file for partial proposals is stored on Polybase.

8. Chat Functionality: Members of the Data Dao can engage in real-time communication through the integrated chat feature. The logic and access control for the chats are implemented using Polybase.

9. Reputation Management: The reputation of storage providers is stored on DAO Factory, allowing all Data Dao instances to access this data. [Stored here](https://github.com/Ahmed-Aghadi/The-Dao/blob/main/smart_contracts/contracts/DaoFactory.sol#L18)

The-Dao offers a comprehensive solution for Data Dao entities to streamline complex storage deals, manage reputation, and foster collaboration within the ecosystem.

Contract Address of Dao Factory: [DAO FACTORY](https://github.com/Ahmed-Aghadi/The-Dao/blob/main/website/constants/contractAddress.json#L2)

<br>

## Smart Contracts

There are mainly 2 smart contracts:

- [DAO Factory](https://github.com/Ahmed-Aghadi/The-Dao/blob/main/smart_contracts/contracts/DaoFactory.sol)
- [Data Dao](https://github.com/Ahmed-Aghadi/The-Dao/blob/main/smart_contracts/contracts/DataDao.sol)

## Spheron

Spheron is used to upload file for partial proposals to IPFS.

[API to upload to file to spheron](https://github.com/Ahmed-Aghadi/The-Dao/blob/main/website/pages/api/upload-spheron.ts)

## Tableland

Data sets of on-chain reputations of storage providers are stored on tableland

[Store Data Using Smart Contract](https://github.com/Ahmed-Aghadi/The-Dao/blob/main/smart_contracts/contracts/DaoFactory.sol#L74)

[Data Set](https://testnets.tableland.network/api/v1/query?statement=select%20*%20from%20TheDao_3141_193)

## Lighthouse

Lighthouse is used to upload file to filecoin network to enable partial proposal.

[API to upload file to lighthouse](https://github.com/Ahmed-Aghadi/The-Dao/blob/main/website/pages/api/upload-lighthouse.ts)

## Polybase

Polybase is used to have chat system for Data DAOs and file url of partial proposal is stored on polybase.

[DAO Collection](https://explorer.testnet.polybase.xyz/collections/pk%2F0x2c57ac0fb26925e229569ad92eb06f540da113b565ee2943fb53029e44b2a60f0a3333bac53dcb89baf2f0b8fec75f175ceb1bb5bb658d9c24e89b27c06f606f%2FGeneral_Use%2FDAO)

[Message Collection](https://explorer.testnet.polybase.xyz/collections/pk%2F0x2c57ac0fb26925e229569ad92eb06f540da113b565ee2943fb53029e44b2a60f0a3333bac53dcb89baf2f0b8fec75f175ceb1bb5bb658d9c24e89b27c06f606f%2FGeneral_Use%2FMessage)

[Proposal Collection](https://explorer.testnet.polybase.xyz/collections/pk%2F0x2c57ac0fb26925e229569ad92eb06f540da113b565ee2943fb53029e44b2a60f0a3333bac53dcb89baf2f0b8fec75f175ceb1bb5bb658d9c24e89b27c06f606f%2FGeneral_Use%2FProposal)
