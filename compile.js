//import path to resolve file paths
//... fs to read in file src code
//... solc to compile solidity src code
const path = require('path')
const fs = require('fs')
const solc = require('solc')

//resolves path to files on computer of 'Inbox.sol' using 'path'
//Read-in source code of file with 'fs'
const inboxPath = path.resolve(__dirname, 'contracts', 'Inbox.sol')
const source = fs.readFile(inboxPath, 'utf-8', (err) => {
    if (err) throw err;
})

//compile src code w/ errors to console using 'solc'
console.log(solc.compile(source))