//import path to resolve file paths
//... fs to read in file src code
//... solc to compile solidity src code
const path = require('path')
const fs = require('fs')
const solc = require('solc')
const CONTRACT_FILE = 'storage.sol'

//resolves path to files on computer of 'Inbox.sol' using 'path'
//Read-in source code of file with 'fs' as string
const filePath = path.resolve(__dirname, 'contracts', CONTRACT_FILE)
const content = fs.readFileSync(filePath).toString()

//configure input for compiling
const input = {
    language: 'Solidity',
    sources: {
        [CONTRACT_FILE]: {
            content: content
        }
    },
    settings: {
        outputSelection: {
            '*' : {'*' : ['*']}
        }
    }
}

//prints out compiled contract
//output is a nested dictionary. Console output is the opcodes of the compiled contract
const output = JSON.parse(solc.compile(JSON.stringify(input)))
const bytecode = output.contracts[CONTRACT_FILE]["Storage"].evm.bytecode.object
const abi = output.contracts[CONTRACT_FILE]["Storage"].abi

module.exports = { bytecode: bytecode, abi: abi }