# The-Dao

### Deployed website (deployed on vercel): [The Dao](https://the-dao.vercel.app/)

It helps data dao to create complex bounties including multiple bounties which will ensure data to be stored concurrently for a longer perioud of time and also on the basis on-chain reputation of providers.

This platform let user create DAO which will have list of proposers and voters. Proposer can propose a proposal and voter can vote on proposals.
Schema of Proposal:
  - CID
  - Size of File
  - Bounty Amount
  - Number of bounties
  - Minimum days the storage provider should have store the data before claiming the bounty
  - Maximum number of bounty deals at a time
  - Minimum bounty deals the storage provider should have done before claiming the bounty ( This data will be taken from on-chain reputation generated from our smart contracts )
  - Expiry date and time ( proposal should have enough votes before expiry )

So a Proposal can be created in such a way that at a time only a particular number of deals can be active, so multiple deals can be active at a time which will make sure data is stored by multiple providers and also data will be stored for a much longer period of time as multiple bounties can be assigned to a proposal.

The DAO also stored reputation of each provider so a proposal of any data dao can add a condition that only those provider who have done 'x' deals in The DAO can participate in the bounty.

A data dao is first to be created. And Owner can assign and unassign proposal and voter role. Owner can also update minimum number of votes required to pass a proposal.

Once dao is created, user with proposal role can create proposals, and once enough votes have been registered, it is supposed to be funded. After funding is done. Client can claim bounties.

DAO can also create partial proposal, where it upload file to filecoin after proposal is passsed and then enable the proposal.

Reputation of providers are stored on DAO Factory, so all the dao can access that data. [Stored here](https://github.com/Ahmed-Aghadi/The-Dao/blob/main/smart_contracts/contracts/DaoFactory.sol#L18)

Contract Address of Dao Factory: [DAO FACTORY](https://github.com/Ahmed-Aghadi/The-Dao/blob/main/website/constants/contractAddress.json#L2)

### Spheron

Spheron is used to upload file for partial proposals to IPFS

#### Atleast one example:

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
