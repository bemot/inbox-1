const assert = require('assert')
const ganache = require('ganache-cli')

//Web3 -> constructor
//web3 instance, use ganache 'provider' connection to local machine
const Web3 = require('web3')
const web3 = new Web3(ganache.provider())

//Mocha -> general purpose test tool
//Functions: 
//it -> run test and make an assertion
//describe -> groups together 'it' functions
//beforeEach -> execute some general setup code

class Car {
    park() {return 'stopped'}
    drive() {return 'vroom'}
}


//mocha test format
//first arg -> organization only
//second arg -> writing tests
describe('Car', () => {
    it('can park', () => {
        const car = new Car()
        //call instance method park, assert that it equals 'stopped'
        assert.equal(car.park(), 'stopped')
    })
})