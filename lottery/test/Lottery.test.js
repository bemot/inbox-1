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

//Wei per Ether constant
const WEI_PER_ETHER = 1000000000000000000

let MANAGER_ADDRESS
let accounts
let lottery
//use 'async' for asychronous methods
beforeEach(async () => {
    //Get a list of all local ganache accounts
    //Need 'await' for an asynchronous method
    accounts = await web3.eth.getAccounts()

    //store address from accounts[0] for use as contract deployer
    MANAGER_ADDRESS = accounts[0]

    // Use one account to deploy contract
    lottery = await new web3.eth.Contract(abi)
        .deploy({ data: bytecode })
        .send({ gas: '1000000', from: MANAGER_ADDRESS })        
})

describe('Lottery', () => {
    it('deploys a contract', () => {        
        assert.ok(lottery.options.address)
    })
    it('has a manager', async() => {
        const managerAddress = await lottery.methods.manager().call()
        assert.strictEqual(MANAGER_ADDRESS, managerAddress)
    })
    it('can enter the lottery', async() => {
        const better = accounts[1]
        const bet = 0.011 * WEI_PER_ETHER
        await lottery.methods.enter().send({ from: better, value: bet })
        const playerAddress = await lottery.methods.players(0).call()
        assert.strictEqual(playerAddress, better)
    })
})




