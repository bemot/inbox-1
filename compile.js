//import path to resolve file paths
//... fs to read in file src code
//... solc to compile solidity src code
const path = require('path')
const fs = require('fs')
const solc = require('solc')

//resolves path to files on computer of 'Inbox.sol'
//Read-in source code of file
const inboxPath = path.resolve(__dirname, 'contracts', 'Inbox.sol')
const source = fs.readFile(inboxPath, 'utf-8')

//compile src code w/ errors to console
console.log(solc.compile(source, 1))