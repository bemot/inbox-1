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


let accounts;
let inbox;

//use 'async for asychronous methods'
beforeEach(async () => {
    //Get a list of all local ganache accounts
    //Need 'await' for an asynchronous method
    accounts = await web3.eth.getAccounts()
       
    inbox = bytecode + abi
    //Use one account to deploy contract
    // inbox = await new web3.eth.Contract(JSON.parse(abi))
    //     .deploy({ data: bytecode, arguments: ['contract init string']})
    //     .send({ from: accounts[0], gas: '1000000' })        
})

describe('Inbox', () => {
    it('deploys a contract', () => {
        console.log(inbox)
    })
})


