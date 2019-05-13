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
let inbox
const CONTRACT_STRING = 'contract initialization string'

//use 'async for asychronous methods'
beforeEach(async () => {
    //Get a list of all local ganache accounts
    //Need 'await' for an asynchronous method
    accounts = await web3.eth.getAccounts()
           
    // Use one account to deploy contract
    inbox = await new web3.eth.Contract(abi)
        .deploy({ data: bytecode, arguments: [CONTRACT_STRING]})
        .send({ gas: '1000000', from: accounts[0] })        
})

describe('Inbox', () => {
    it('deploys a contract', () => {        
        assert.ok(inbox.options.address)
    })
    it('has a default message', async() => {
        const message = await inbox.methods.message().call()
        assert.strictEqual(message, CONTRACT_MESSAGE)
    })
    it('can change the message', async() => {
        const NEW_MESSAGE = 'new message'
        await inbox.methods.setMessage(NEW_MESSAGE).send({ from: accounts[0] })
        const message = await inbox.methods.message().call()
        assert.strictEqual(message, NEW_MESSAGE)
    })
})




