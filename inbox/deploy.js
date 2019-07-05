const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { bytecode, abi } = require('./compile');

const provider = new HDWalletProvider(
    'swarm smoke winner upgrade swift slot salad steel wagon horn stool nature',
    'https://rinkeby.infura.io/v3/4ac30782020a4060b4d5063b9bc2e699'
);

const web3 = new Web3(provider);

const deploy = async() => {
    //get accounts from mnemonic 
    const accounts = await web3.eth.getAccounts()
        .catch((e) => {console.log(e)})

    console.log('Attempting to deploy from account: ', accounts[0])

    //one Truffle Vx.x.x > V0.0.4 include '0x' in bytecode and remove gas
    const result = await new web3.eth.Contract(abi)
        .deploy({ data: bytecode, arguments: [ 'bobik zdoh!' ] })
        .send({ gas: '5000000', from: accounts[0] })
        

    console.log('Contract deployed to address: ', result.options.address)
};
deploy();


