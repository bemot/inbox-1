import React, { Component } from 'react';
import web3 from './Web3'

class App extends Component {        
  render() {            
    enableMetamaskUse()
    return (      
      <h1>
        Ethereum Client
      </h1>    
    )
  } 
}

async function getAccounts() {  
  return await web3.eth.getAccounts()  
}

function metamaskIsInstalled() {
  if (typeof web3 !== 'undefined') {
    return true
  }
  return false
}

async function metamaskIsLocked() {    
  const accounts = await getAccounts()
  if (accounts.length !== 0) {
    return false
  }
  return true
}

async function enableMetamaskUse() {
  if (metamaskIsInstalled()) {    
    //metamask is installed
    if (await metamaskIsLocked()) {
      //metamask is locked
      console.log('metamask is locked')

    }
    else {
      console.log('metamask is unlocked')
    }
  }
  else {
    console.log("metamask is not installed")
  }
}

export default App;
