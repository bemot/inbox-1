//assert -> tests for equality
//ganache -> is a 'provider', allows connection to local environment
const assert = require('assert')
const ganache = require('ganache-cli')

//Web3 -> constructor
//web3 instance, use ganache 'provider' connection to local machine
const Web3 = require('web3')
const provider = ganache.provider()
const OPTIONS = {
    defaultBlock: "latest",
    transactionConfirmationBlocks: 1,
    transactionBlockTimeout:5
};
const web3 = new Web3(provider, null, OPTIONS);

//require compiled contract object
const { bytecode, abi } = require('../compile')


let accounts
let inbox
const CONTRACT_STRING = 'bobik zdoh'

//use 'async for asychronous methods'
beforeEach(async () => {
    //Get a list of all local ganache accounts
    //Need 'await' for an asynchronous method
    accounts = await web3.eth.getAccounts();

    // Use one account to deploy contract
    inbox = await new web3.eth.Contract(abi)
	.deploy({ data: bytecode, arguments: [CONTRACT_STRING]})
	.send({ gas: '1000000', from: accounts[0] });

});

describe('Inbox', () => {
    it('deploys a contract', () => {
//	console.log(inbox);
	assert.ok(inbox.options.address);
    });

    it('has default message', async () => {
        const message = await inbox.methods.message().call();
        assert.equal(message, CONTRACT_STRING);
    });

    const newMessage = 'bobik is alive again'
    it('can change the message', async () => {
        await inbox.methods.setMessage(newMessage).send({from: accounts[0]});
        const message = await inbox.methods.message().call();
<<<<<<< HEAD
        console.log('new message is - ' + '"'+message+'"');
=======
        console.log(message);
>>>>>>> c5d68e6b4a4582438291dec3c823541e6e05a49a
        assert.equal(message,newMessage);    

    });
});




