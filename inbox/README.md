### Setup
```
$ npm install --save mocha ganache-cli web3
```
web3 MUST be >= v1.0.0
+ If any issues on web3 install for 'MSBUILD Errors' -> ask Ian
### Compile
```
$ node compile.js
```
### Testing
```
$ npm run test
```
#### Mocha
General purpose test tool
+ Functions: 
    + it -> run test and make an assertion
    + describe -> groups together 'it' functions
    + beforeEach -> execute some general setup code

#### Mocha test formating
+ describe(first arg -> organization only, second arg -> writing 'it' tests)
    + houses 'it' functions and their assertions
+ it(first arg -> 'title of test', second arg -> assert tests)
    + used to assert tests
+ beforeEach(first arg -> arrow function)
    + will perform arrow function before any 'it' statement

#### Mocha example
```javascript
 class Car {
     park() {return 'stopped'}
     drive() {return 'vroom'}
 }
//init var car for 'it' scopes
let car;
//init car instance for 'it' statements
beforeEach(() => {
    car = new Car()
})

describe('Car', () => {
    //Test method park()
    it('can park', () => {                
        assert.equal(car.park(), 'stopped')
    })

    //Test method drive()
    it('can drive', () => {           
        assert.equal(car.drive(), 'vroom')
    })
})
```