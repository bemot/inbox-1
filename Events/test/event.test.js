//assert -> tests for equality
//ganache -> is a 'provider', allows connection to local environment
const assert = require('assert')
const ganache = require('ganache-cli')

//Web3 -> constructor
//web3 instance, use ganache 'provider' connection to local machine
const Web3 = require('web3')
const web3 = new Web3(ganache.provider())

//require compiled contract object
const { bytecode, abi } = require('../compile')

let ADMIN_ADDRESS
let metamask_accounts
let storage_contract
//use 'async' for asychronous methods
beforeEach(async () => {
    //Get a list of all local ganache accounts
    //Need 'await' for an asynchronous method
    metamask_accounts = await web3.eth.getAccounts()

    //store address from accounts[0] for use as contract deployer
    ADMIN_ADDRESS = metamask_accounts[0]

    // Use one account to deploy contract
    storage_contract = await new web3.eth.Contract(abi)
        .deploy({ data: bytecode })
        .send({ gas: '1000000', from: ADMIN_ADDRESS })        
})

describe('Storage Contract', () => {
    it('deploys a contract', () => {        
        assert.ok(storage_contract.options.address)
    })
    it('accepts a 32byte word, and logs event data', async() => {
        var eventAndTypeHash = web3.utils.keccak256('LogDataHash(bytes32)')        

        storage_contract.events.LogDataHash(function(err, results) {
            if(!err){
                console.log(results)
            }
            else {
                console.log(err)
            }
        })       

        const word = '0x000000000000000000000000000000000000000000000000000062616e616e61'
        const transaction_hash = await storage_contract.methods.log(word).call({
            from: ADMIN_ADDRESS
        })            


        assert.ok(transaction_hash) 
    })    
})




