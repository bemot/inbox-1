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
        const managerAddress = await lottery.methods.manager().call({
            from: MANAGER_ADDRESS            
        })
        assert.strictEqual(managerAddress, MANAGER_ADDRESS)
    })
    it('allows one account to enter lottery', async() => {
        const better = accounts[1]
        const bet = web3.utils.toWei('0.011', 'ether')
        await lottery.methods.enter().send({ 
            from: better,
            value: bet 
        })
        const players = await lottery.methods.getPlayers().call({
            from: better
        })

        assert.strictEqual(players[0], better)
        assert.strictEqual(players.length, 1)
    })
    it('allows multiple accounts to enter lottery', async() => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.02', 'ether')
        })
        await lottery.methods.enter().send({
            from: accounts[1],
            value: web3.utils.toWei('0.02', 'ether')
        })
        await lottery.methods.enter().send({
            from: accounts[2],
            value: web3.utils.toWei('0.02', 'ether')
        })
        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        })

        assert.strictEqual(players[0], accounts[0])
        assert.strictEqual(players[1], accounts[1])
        assert.strictEqual(players[2], accounts[2])
        assert.strictEqual(players.length, 3)
    })
    it('requires a minimum amount of ether', async () => {
        try{
            await lottery.methods.enter().send({
                from: accounts[0],
                value: 0
            })
        assert(false)
        } catch (err) {
            assert.ok(err)
        }
    })
    it('only manager can call pickWinner()', async () => {
        try{
            await lottery.methods.pickWinner().send({
                from: accounts[5]
            })
        assert(false)
        } catch(err) {
            assert.ok(err)
        }
    })
    it('sends money to the winner and resets the contract', async ()=> {
        await lottery.methods.enter().send({
            from: accounts[3],
            value: web3.utils.toWei('2', 'ether')
        })
        const initialBalance = await web3.eth.getBalance(accounts[3])
        await lottery.methods.pickWinner().send({from: MANAGER_ADDRESS})
        const finalBalance = await web3.eth.getBalance(accounts[3])
        const difference = finalBalance - initialBalance

        assert(difference > web3.utils.toWei('1.8', 'ether'))
        
        const players = await lottery.methods.getPlayers().send({
            from: MANAGER_ADDRESS
        })

        assert.strictEqual(players.length, undefined)
    })
})




