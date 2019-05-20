# Research on Storing Data on Ethereum 
Research by Ian on options to store data on the Ethereum blockchain.

---

### Dictionary
+ TXN -> transaction
+ SC -> smart contract

---

### Table Of Contents
+ [Transactions](#transactions)    
+ [Smart Contracts](#smart-contracts)
    + [Price Testing](#testing-data-storage-costs-on-ropsten-sc-storage)
+ [Smart Contract Events and Block Logs](#block-logs)
    + [Price Testing](#testing-data-storage-costs-on-ropsten-sc-event-log)
+ [Pros & Cons](#pros-&-cons)

---

## Transactions
### Writing
**After research, using transactions to store data on the ethereum blockchain in some kind of 'transaction data field' does not seem feasible**

Per the [Ethereum yellow paper](https://ethereum.github.io/yellowpaper/paper.pdf), transactions do not have a field that is dedicated strictly to storing information. The fields of a transaction are as follows:

+ TXN
    + nonce 
    + gasPrice/gasLimit
    + to
        + address of recipient
    + value        
    + v/r/s
        + used to determine sender of TXN
    + **init (SC initialization field)**
        + EVM bytecode fragment used to establish the account of the SC. Returns *body*. *init* is discarded after this
            + body
                + EVM code that executes when the SC account recieves a message call or when internal code is executed in the SC 
    + **data (SC invocation field)**
        + infinite-sized byte array that specifies message call data or SC constructor. The *to* field would be the address of the smart contract

**Can the data field be 'hacked' to contain our hashes? I have not found research to indicate yes or no.**

**Could we send hashes in a TXN to a SC, which does nothing with them, just to immutably record hashes via TXN's?**

---

## Smart Contracts
Have their own address, similar to accounts
+ address is hash determined by sender, using nonce
    + therefore, cannot be deployment of new contract to old contract's address

**Storage on SC is unlike TXNs, in that it is mutable. Care should be taken to not overwrite older information from previous writes**

### SC Writing Data
References (Bold are Optimal):

[**Ethereum Yellow Paper**](https://ethereum.github.io/yellowpaper/paper.pdf)

[**Understanding Ethereum SC Storage**](https://programtheblockchain.com/posts/2018/03/09/understanding-ethereum-smart-contract-storage/)

[**Storing on Ethereum: Analyzing the Costs**](https://medium.com/coinmonks/storing-on-ethereum-analyzing-the-costs-922d41d6b316)

[**Price of Storing a Hash in Ethereum -> eth.stackexchange**](https://ethereum.stackexchange.com/questions/16209/price-of-storing-a-hash-sha3-in-ethereum-and-bitcoin)

[**A Practical Walkthrough of SC Storage**](https://medium.com/coinmonks/a-practical-walkthrough-smart-contract-storage-d3383360ea1b)

[Upgradeablility/Need for Redeployment of SC: StackOverflow ](https://ethereum.stackexchange.com/questions/2404/upgradeable-smart-contracts)

[How are SC stored on the Ethereum Blockchain?: Quora](https://www.quora.com/How-are-smart-contracts-stored-on-the-Ethereum-blockchain-Does-a-smart-contract-also-have-a-public-and-a-private-key)

[Storing a keccak256 hash in a bytes32 field](https://ethereum.stackexchange.com/questions/10115/in-solidity-can-i-store-the-value-of-keccak-256-in-bytes32)

[Solidity Docs: Keccak256, Storing as bytes32](https://solidity.readthedocs.io/en/develop/units-and-global-variables.html#mathematical-and-cryptographic-functions)

---

### SC Data Storage
**Storage on SC is unlike TXNs, in that it is mutable. Care should be taken to not overwrite older information from previous writes**

SC non-volatile data storage is maintaned as part of the system state by nodes (miners). It is formatted as a practically infinite mapping (2<sup>256</sup> available spaces). Each slot in the memory is 32 bytes wide. 

#### Dynamically-sized Arrays in Solditity
+ Dynamic arrays store their size in the first index of the array pointer, values are then stored consecutively after

#### Dynamically-sized Mappings in Solidity
+ The first index is left empty, and is used with the key to make a hash. this hash is the index of the value of the key (ie. apple_quantity = index_of(keccak256(fruit_mapping @ slot #6, 'Granny Smith')) )

#### Opcode Gas Prices for Non-volatile Storage
+ SLOAD: 200 gas/*word*
+ SSTORE: 20000 gas/*word*

*word* is defined in this context to mean 32 bytes, or exactly one slot of storage memory

#### Gas Oracle: Suggested Gas Prices for Time Windows
Gas Prices are the amout of Ether that users pay miners to perform actions. 

Suggested prices will fluctuate with the ETHER -> USD conversion rate. 

**This variable ultimately determines how much money will be spent interacting with miners, and determine the average speed at which our SC invocations will be completed.** 

#### Testing Data Storage Costs on Ropsten SC Storage
Example SC that stores keccak256 hashes in a dynamic array
+ keccak256 hashes are 32 bytes long, the exact size of a memory slot in SC
```solidity
pragma solidity ^0.5.8;

contract Storage {
    //address of admin w/ permissions
    address public admin;
    //hash(user id & hash(data)) : 
    bytes32[] public data_hashes;
    
    constructor() public {
        //set contract creator as admin
        admin = msg.sender;
    }
    
    function addDataHash(bytes32 dh) public restricted {
        data_hashes.push(dh);
    }
    
    modifier restricted() {
        require(msg.sender == admin);
        _;
    }
}
```
**Data Recorded from SC Deployment & Invocation**
https://docs.google.com/spreadsheets/d/1NPnyAFzjLzxKqpAYWBz0Tu2njfdU0mGqrasqMpIHQrE/edit?usp=sharing

### SC Reading Data
References (Bold are Optimal)

[**How to Read Ethereum SC Storage (public view point)**](https://medium.com/aigang-network/how-to-read-ethereum-contract-storage-44252c8af925)

Reading Information via SC calls is free, and is near instantaneous (when tested on Ropsten)

### Bug Fixes
+ Common to use proxy contract to search (and redirect calls) for/to correct contract 
+ Inheritance
    + Old contract has its functions called and data storage accessed (avoiding buggy methods in old contract version)
+ Registry
    + Something like the ENS, Ethereum Name Service can be used to point to resources

### Implementation Ideas
+ Abstracting Smart Contracts
    + Allows data writer contract to be modified (and subsequently redeployed), writing to a (or multiple) storage contracts
    + Storage is lost on contract redeployment (new contract address, new memory) this would allow persistent data storage via concrete storage contract(s)

    + Smart Contract Storage
        + Accepts calls from another smart contract and then stores data
    + Smart Contract Writer
        + calls to storage contract to write data, able to have new write contracts created to write to old contract storage

---

## SC Events and TXN Logs
SCs can trigger *events* after certain method calls. These *events* can have customized parameters. *Events* are broadcast to the network **after a transaction has been mined**, allowing others to listen (often using web3) and filter out relevant data.

These *events* store data as receipts in TXNs known as *logs*, and require some decryption to read. From current research, it seems that web3 does offer ways to both automatically decrypt TXN receipts both manually (for optimization) and through API(s). 

### References
(Solidity Docs: Events)[https://solidity.readthedocs.io/en/v0.5.8/contracts.html#events]

### Event in a SC
1) Can pass information back from a transaction

    TXNs return a hash of the transaction, not a function value. **This is because the transaction has yet to be mined**. An event will return a value after a miner completes the transaction into a block. 

2) An asynchronous trigger

    SC can use events to trigger front ends. Applications can subscribe and listen to these events through the RPC interface of an Ethereum client. A front end can wait, listening for an event and perfrom an action when it hears one

3) Cheaper form of data storage than SC SSTORE

    Logs are associated with the address of the contract, are incorporated into the blockchain, and stay there as long as a block is accessible, **BUT, the log and its event data are not accessible from within contracts (not even from the contract that created them)**

    8 gas/byte vs SSTORE of 20000 gas/32bytes
    8 gas/byte vs SSTORE of 625 gas/byte

    TXN Logs -> 78x cheaper than SC SSTORE
    TXN Logs -> immutable data write vs mutable SC write

### Log in a TXN


### Searching for data through Ethereum TXNs
+ web3
+ Bloom filter

### Testing Data Storage Costs on Ropsten SC Event Log
```solidity
pragma solidity ^0.5.8;

contract Event {
    event LogDataHash(bytes32 datahash);
    
    function log(bytes32 datahash) public payable {
        emit LogDataHash(datahash);
    }
}
```
**Data Recorded from SC Deployment & Invocation**
https://docs.google.com/spreadsheets/d/1NPnyAFzjLzxKqpAYWBz0Tu2njfdU0mGqrasqMpIHQrE/edit#gid=0

---

## Pros & Cons

### SC SSTORE Pros
+ Easy to Write to contract storage
+ Can choose storage implementation (dynamic array/mapping)
+ Easy to Read from SC storage
+ Free to Read from SC storage
+ Can optimize SC through code practice/solidity compiler
+ Offers gas refund for clearing memory spaces

### SC SSTORE Cons
+ Costs 20000 gas/32byte word
+ Verification of content on blockchain hard
    + Access publically available SC, access memory slots, decrypt hex into what is stored
+ Use TXN hash to verify data written? 
    + Create hash of TXN, then search for that TXN hash on blockchain?
+ **SC storage is mutable**

### SC Events & TXN Logs Pros
+ **Can store data directly into logs, immutably**
+ Abstracted data writing
    + Call SC, then SC event data is written by nodes into TXN log
+ Costs 8 gas/byte
+ Can asynchronously trigger FE on successful TXN mine
+ Regex can search for SC address and event name
+ FE can subscribe to listeners through nodes for events
+ Common to do SPV (Simple Payment Verification) through logs
    + Has the TXN from Bob to Alice been recorded?
+ Can *index* topics as 32byte words outside of data field to increase search speed

### SC Events & TXN Logs Cons
+ Decryption required to read from log
    + [Reading from TXN Logs](https://codeburst.io/deep-dive-into-ethereum-logs-a8d2047c7371)
+ SCs cannot access logs and their data     