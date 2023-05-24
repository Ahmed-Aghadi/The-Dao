# The-Dao

### Deployed website (deployed on vercel): [The Dao](https://the-dao.vercel.app/)

This platform let **Data Dao** have **complex storage deals**. It provides proper **UX** for Filecoin storage providers & clients. DAO can create complex proposal and bounties and the **orchestration** and **aggregation** of the deals will be **programmatically** handled by Smart Contracts.

It helps data dao to create **complex bounties** including **multiple bounties** which will ensure data to be stored **concurrently** for a **longer perioud of time** and also on the basis **on-chain reputation of providers**.

Reputation of storage providers are generated as more bounty deals are completed and on-chain reputation will be generated. This data can be further used by Data DAOs to have **restriction on storage deals** such that only storage provider with a minimum reputation can do the deal. The data sets of the on-chain reputation of storage provider is also stored on **Tableland** from smart contracts. So anyone can use the data sets for their platform to further provide **better ecosystem for FVM**.

A data dao is first to be created. And Owner can assign and unassign proposal and voter role. Owner can also update minimum number of votes required to pass a proposal.

Once dao is created, user with proposal role can create proposals, and once enough votes have been registered, it is supposed to be funded. After funding is done. Client can claim bounties.

Proposer can propose a proposal and voter can vote on proposals.

Schema of Proposal:
  - CID
  - Size of File
  - Bounty Amount
  - Number of bounties
  - Minimum days the storage provider should have store the data before claiming the bounty
  - Maximum number of bounty deals at a time
  - Minimum bounty deals the storage provider should have done before claiming the bounty ( This data will be taken from on-chain reputation generated from our smart contracts )
  - Expiry date and time ( proposal should have enough votes before expiry )

So a Proposal can be created in such a way that **at a time only a particular number of deals can be active**, so **multiple deals** can be active at a time which will make sure data is **stored by multiple providers** and also data will be **stored for a much longer period of time** as **multiple bounties** can be assigned to a proposal.

The DAO also stored **reputation of each storage provider** so a proposal of any data dao can add a condition that only those provider who have done 'x' deals in The DAO can participate in the bounty.

DAO can also create **partial proposal**, where it upload file to Filecoin after the proposal is passsed and then enable the proposal.

So for partial proposal, file will be **uploaded to IFPS** using **Spheron** and after the proposal is accepted, file can be **uploaded to Filecoin Network** using **Lighthouse**.

The IPFS URL of the file for partial proposal will be stored of **Polybase**.

Members of the DAO can also **chat** on the DAO. The logic chats and **access control** for the chats are implemented using **Polybase**.

Reputation of providers are stored on DAO Factory, so all the dao can access that data. [Stored here](https://github.com/Ahmed-Aghadi/The-Dao/blob/main/smart_contracts/contracts/DaoFactory.sol#L18)

Contract Address of Dao Factory: [DAO FACTORY](https://github.com/Ahmed-Aghadi/The-Dao/blob/main/website/constants/contractAddress.json#L2)

### Smart Contracts

There are mainly 2 smart contracts:
  - [DAO Factory](https://github.com/Ahmed-Aghadi/The-Dao/blob/main/smart_contracts/contracts/DaoFactory.sol)
  - [Data Dao](https://github.com/Ahmed-Aghadi/The-Dao/blob/main/smart_contracts/contracts/DataDao.sol)

### Spheron

Spheron is used to upload file for partial proposals to IPFS.

[API to upload to file to spheron](https://github.com/Ahmed-Aghadi/The-Dao/blob/main/website/pages/api/upload-spheron.ts)

### Tableland

Data sets of on-chain reputations of storage providers are stored on tableland

[Store Data Using Smart Contract](https://github.com/Ahmed-Aghadi/The-Dao/blob/main/smart_contracts/contracts/DaoFactory.sol#L74)

[Data Set](https://testnets.tableland.network/api/v1/query?statement=select%20*%20from%20TheDao_3141_193)

### Lighthouse

Lighthouse is used to upload file to filecoin network to enable partial proposal.

[API to upload file to lighthouse](https://github.com/Ahmed-Aghadi/The-Dao/blob/main/website/pages/api/upload-lighthouse.ts)

### Polybase

Polybase is used to have chat system for Data DAOs and file url of partial proposal is stored on polybase.

[DAO Collection](https://explorer.testnet.polybase.xyz/collections/pk%2F0x2c57ac0fb26925e229569ad92eb06f540da113b565ee2943fb53029e44b2a60f0a3333bac53dcb89baf2f0b8fec75f175ceb1bb5bb658d9c24e89b27c06f606f%2FGeneral_Use%2FDAO)

[Message Collection](https://explorer.testnet.polybase.xyz/collections/pk%2F0x2c57ac0fb26925e229569ad92eb06f540da113b565ee2943fb53029e44b2a60f0a3333bac53dcb89baf2f0b8fec75f175ceb1bb5bb658d9c24e89b27c06f606f%2FGeneral_Use%2FMessage)

[Proposal Collection](https://explorer.testnet.polybase.xyz/collections/pk%2F0x2c57ac0fb26925e229569ad92eb06f540da113b565ee2943fb53029e44b2a60f0a3333bac53dcb89baf2f0b8fec75f175ceb1bb5bb658d9c24e89b27c06f606f%2FGeneral_Use%2FProposal)
