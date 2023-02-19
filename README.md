# The-Dao

It helps data dao to create complex bounties including multiple bounties which will ensure data to be stored concurrently for a longer perioud of time and also on the basis reputation of providers.

So a Proposal can be created in such a way that at a time only a particular number of deals can be active, so multiple deals can be active at a time which will make sure data is stored by multiple providers and also data will be stored for a much longer period of time as multiple bounties can be assigned to a proposal.

The DAO also stored reputation of each provider so a proposal of any data dao can add a condition that only those provider who have done 'x' deals in The DAO can participate in the bounty.

A data dao is first to be created. And Owner can assign and unassign proposal and voter role. Owner can also update minimum number of votes required to pass a proposal.

Once dao is created, user with proposal role can create proposals, and once enough votes have been registered, it is supposed to be funded. After funding is done. Client can claim bounties.

Reputation of providers are stored on DAO Factory, so all the dao can access that data. [Stored here](https://github.com/Ahmed-Aghadi/The-Dao/blob/main/smart_contracts/contracts/DaoFactory.sol#L20) [Accessed here](https://github.com/Ahmed-Aghadi/The-Dao/blob/main/smart_contracts/contracts/DataDao.sol#L239)

Contract Address of Dao Factory: [DAO FACTORY](https://github.com/Ahmed-Aghadi/The-Dao/blob/main/website/constants/contractAddress.json#L2)
