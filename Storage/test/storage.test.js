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
let storage_contract_address
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
    it('has an admin', async() => {
        const admin_address = await storage_contract.methods.admin().call({
            from: ADMIN_ADDRESS
        })
        assert.strictEqual(admin_address, ADMIN_ADDRESS)
    })
    it('allows input of a data hash into data hash array', async() => {        
        const DATA_HASH = '0x5f16f4c7f149ac4f9510d9cf8cf384038ad348b3bcdc01915f95de12df9d1b02'        
        await storage_contract.methods.addDataHash(DATA_HASH).send({ 
            from: ADMIN_ADDRESS
        })                

        const returned_data_hash = await storage_contract.methods.data_hashes(0).call()
        assert.strictEqual(returned_data_hash, DATA_HASH)
    })    
})




