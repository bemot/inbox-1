# Research on Storing Data on Ethereum 

## Consensus Protocol
GHOST Protocol by Somponlinsky & Zohar [2]()

## Transactions
Multiple transactions grouped per block [1](https://ethereum.github.io/yellowpaper/paper.pdf)

Field: 
+ init
    + Contract-creation-only field, specifies evm bytecode for the contract account initialization, whose evm bytecode allows redirection to contract code
+ data
    + unlimited size byte array that specifies the input data of the message call [1](https://ethereum.github.io/yellowpaper/paper.pdf)

## World State
Nodes store world state
+ gas fee for nodes to update contract info
    + only nodes that get first to block publish are compenstated
        + other nodes then update contract in their storage

Field: 
+ Code Hash
    + Stores hash of EVM code
        + This code gets executed when address gets a message call
        + Code fragments stored in state db under hashes for retrieval

## Smart Contracts
Have their own address, similar to accounts
+ address is determined by sender, using nonce
    + therefore, there cannot be deployment of new contract to old contract's address
**Seems that code is immutable, but storage is mutable**

Bug Fixes
+ Common to use proxy contract to search (and redirect calls) for/to correct contract 
+ Inheritance
    + Old contract has its functions called and data storage accessed (avoiding buggy methods in old contract version)
+ Registry
    + Something like the ENS, Ethereum Name Service can be used to point to resources
    

Gas refund
+ Smart contracts have infinite storage, or an array of 2^256 values
+ Setting contract storage location as empty result in gas refund? [3](https://programtheblockchain.com/posts/2018/03/09/understanding-ethereum-smart-contract-storage/)
+ solidity uses hash to store dynamically-sized data, with the first slot of in the array storing the size of the array [3](https://programtheblockchain.com/posts/2018/03/09/understanding-ethereum-smart-contract-storage/)


## Implementation Ideas
+ Abstracting Smart Contracts
    + Allows data writer contract to be modified (and subsequently redeployed), writing to a (or multiple) storage contracts
    + Storage is lost on contract redeployment (new contract address, new memory) this would allow persistent data storage via concrete storage contract(s)

    + Smart Contract Storage
        + Accepts calls from another smart contract and then stores data
    + Smart Contract Writer
        + 