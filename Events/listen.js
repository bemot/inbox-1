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
const contract = {
    address: process.env.ROPSTEN_DEPLOYED_ADDRESS
}
//Import mnemonic & "'https://' + infura" endpoint from .env
const provider = new HDWalletProvider(
    config.mnemonic,
    'https://' + config.endpoint   
)

const web3 = new Web3(provider)

function listen () {        
    const eventContract = new web3.eth.Contract(abi, contract.address)    

    eventContract.getPastEvents('allEvents', (err, result) => {
        if(err){
            console.log(err)            
        }
        else {        
            console.log(result)            
        }
    })
}
listen()