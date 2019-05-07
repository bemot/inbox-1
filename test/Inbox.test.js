const assert = require('assert')
const ganache = require('ganache-cli')

//Web3 -> constructor
//web3 instance, use ganache 'provider' connection to local machine
const Web3 = require('web3')
const web3 = new Web3(ganache.provider())





//##################################
//Mocha -> general purpose test tool
//Functions: 
//it -> run test and make an assertion
//describe -> groups together 'it' functions
//beforeEach -> execute some general setup code

// class Car {
//     park() {return 'stopped'}
//     drive() {return 'vroom'}
// }

//***mocha test formating***
//describe(first arg -> organization only, second arg -> writing 'it' tests)
//it(first arg -> 'title of test', second arg -> assert tests)
//beforeEach(first arg -> arrow function) //will perform arrow function before any 'it' statement

//init var car for 'it' scopes
// let car;
// //init car instance for 'it' statements
// beforeEach(() => {
//     car = new Car()
// })

// describe('Car', () => {
//     //Test method park()
//     it('can park', () => {                
//         assert.equal(car.park(), 'stopped')
//     })

//     //Test method drive()
//     it('can drive', () => {           
//         assert.equal(car.drive(), 'vroom')
//     })
// })