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


let accounts
let lottery

//use 'async for asychronous methods'
beforeEach(async () => {
    //Get a list of all local ganache accounts
    //Need 'await' for an asynchronous method
    accounts = await web3.eth.getAccounts()
           
    // Use one account to deploy contract
    lottery = await new web3.eth.Contract(abi)
        .deploy({ data: bytecode, arguments: []})
        .send({ gas: '1000000', from: accounts[0] })
})

describe('Lottery', () => {
    it('deploys a contract', () => {        
        assert.ok(lottery.options.address)
    })
    // it('has a manager', async() => {
    //     const message = await lottery.methods.message().call()
    //     assert.equal(CONTRACT_STRING, message)
    // })
    // it('can record an entry', async() => {
    //     const NEW_MESSAGE = 'new message'
    //     await lottery.methods.setMessage(NEW_MESSAGE).send({ from: accounts[0] })
    //     const message = await lottery.methods.message().call()
    //     assert.equal(message, NEW_MESSAGE)
    // })
})




