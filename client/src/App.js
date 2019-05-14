import React, { Component } from "react"
import web3 from "./Web3"
import lottery from './Lottery'
import { SSL_OP_NETSCAPE_CA_DN_BUG } from "constants";


class App extends Component {
  state = {
    manager: "",
    players: [],
    pot: '',
    bet: '',
    metamaskOn: false,
    loading: ''
  }      

  async componentDidMount() {
    const manager = await lottery.methods.manager().call()
    const players = await lottery.methods.getPlayers().call()
    const pot = await web3.eth.getBalance(lottery.options.address)
    const metamaskOn = await enableMetamaskUse()

    this.setState({manager, players, pot, metamaskOn})
  }
  
  onSubmit = async (e) => {
    e.preventDefault()
    const accounts = await web3.eth.getAccounts()
    
    this.setState({ loading: 'Waiting on transaction...'})

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.bet, 'ether')
    })

    this.setState({ loading: 'You have been entered!'})
  }

  onClick = async (e) => {
    const accounts = await web3.eth.getAccounts()

    this.setState({ loading: 'Waiting on transaction to pick a winner...'})

    await lottery.methods.pickWinner().send({from: accounts[0]})

    this.setState({ loading: 'A winner has been picked! Check your balance!'})
  }

  render() {    
    return (
      <div>
        <h1>Ethereum Lottery Contract</h1>
        <p>
          Metamask is currently {this.state.metamaskOn === false ? 'disabled. Please turn off privacy mode' : 'enabled'}          
        </p>
        <p>
          This contract is managed by {this.state.manager}.
          <br></br>
          There are currently {this.state.players.length} entered into the lottery.
          <br></br>
          The pot is currently at {web3.utils.fromWei(this.state.pot, 'ether')} ether!
        </p>
        <hr/>   
        <form onSubmit={this.onSubmit}>             
          <h4>Enter for a chance to Win!</h4>
          <div>
          <label>Amount of Ether to enter</label>
          <input
            bet={this.state.bet}  
            onChange={event => this.setState({bet: event.target.value})}            
          />
          </div>
          <button>Enter</button>
        </form>
        <hr/>
        <h2>{this.state.loading}</h2>
        <h4>Ready to pick a random winner?</h4>
        <button onClick={this.onClick}>Pick a winner!</button>
      </div>
    )
  }
}

async function getAccounts() {
  return await web3.eth.getAccounts()
}

function metamaskIsInstalled() {
  if (typeof web3 !== "undefined") {
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
    if (! await metamaskIsLocked()) {
      //metamask is locked
      console.log("metamask is unlocked")  
      return true                
    } else {
      console.log("metamask is locked")
      return false
    }
  } else {
    console.log("metamask is not installed")
  }  
}

export default App
