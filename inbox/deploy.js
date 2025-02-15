
const HDWalletProvider = require('truffle-hdwallet-provider')
const Web3 = require('web3')
const { bytecode, abi } = require('./compile')

//library dotenv to support .env files
require("dotenv").config()
//import mnemonic from .env file
const config = {
    mnemonic: process.env.MNEMONIC,
    endpoint: process.env.INFURA_ENDPOINT
}
//Import mnemonic & "'https://' + infura" endpoint from .env
const provider = new HDWalletProvider(
    config.mnemonic,
    'https://' + config.endpoint   
)

const web3 = new Web3(provider)

const deploy = async() => {
    //get accounts from mnemonic 
    const accounts = await web3.eth.getAccounts()
        .catch((e) => {console.log(e)})

    console.log('Attempting to deploy from account: ', accounts[0])

    //one Truffle Vx.x.x > V0.0.4 include '0x' in bytecode and remove gas
    const result = await new web3.eth.Contract(abi)
        .deploy({ data: bytecode, arguments: [ 'hi there!' ] })
        .send({ gas: '1000000', from: accounts[0] })
        .catch((e) => {console.log(e)})

    console.log('Contract deployed to address: ', result.options.address)
}
deploy()


