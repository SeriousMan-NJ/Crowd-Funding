import React from "react";
import Information from"./Information"
import Web3 from 'web3'

export default class Beneficiary extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      balance: 0,
      balanceContract: 0,
      address: "",
      passphrase: "",
    }
  }
  async withdraw() {
    const web3 = new Web3('ws://141.223.85.151:8546')
    const fundingContract = new web3.eth.Contract(JSON.parse(process.env.REACT_APP_FUNDING_ABI), process.env.REACT_APP_FUNDING_ADDRESS)

    web3.eth.personal.unlockAccount(this.state.address, this.state.passphrase, 30, async (err) => {
      if (err) {
        window.alert("unlockAccount failed")
        return
      }
      await fundingContract.methods.withdraw().send({
        from: this.state.address
      })
    })
  }
  async checkGoalReached() {
    const web3 = new Web3('ws://141.223.85.151:8546')
    const fundingContract = new web3.eth.Contract(JSON.parse(process.env.REACT_APP_FUNDING_ABI), process.env.REACT_APP_FUNDING_ADDRESS)

    const passphrase = window.prompt("Enter passphrase")
    web3.eth.personal.unlockAccount(process.env.REACT_APP_BENEFICIARY_ADDRESS, passphrase, 30, async (err) => {
      if (err) {
        window.alert("unlockAccount failed")
        return
      }
      await fundingContract.methods.checkGoalReached().send({
        from: process.env.REACT_APP_BENEFICIARY_ADDRESS
      })
    })
  }
  async componentDidMount() {
    const web3 = new Web3('ws://141.223.85.151:8546')
    const balance = await web3.eth.getBalance(process.env.REACT_APP_BENEFICIARY_ADDRESS) / 1000000000000000000
    const balanceContract = await web3.eth.getBalance(process.env.REACT_APP_FUNDING_ADDRESS) / 1000000000000000000
    this.setState({ balance, balanceContract })

    const fundingContract = new web3.eth.Contract(JSON.parse(process.env.REACT_APP_FUNDING_ABI), process.env.REACT_APP_FUNDING_ADDRESS)
    fundingContract.events.GoalReached()
      .on('data', async (event) => {
        window.location.reload()
      })
      .on('changed', (event) => {
          // remove event from local database
      })
      .on('error', console.error);
  }
  render() {
    const {
      fundedAmount,
      goalAmount,
      remainingToken,
      ended,
    } = this.props

    return (
      <div className="Beneficiary">
        <Information
          fundedAmount={fundedAmount}
          goalAmount={goalAmount}
          remainingToken={remainingToken}
          ended={ended}
        />
        <h3>@ CrowdFunding Contract's Account:</h3>
        <div>{process.env.REACT_APP_FUNDING_ADDRESS}: {this.state.balanceContract} (ETH), {remainingToken} (CTK)</div>
        <h3>@ Film-maker's Account:</h3>
        <div>{process.env.REACT_APP_BENEFICIARY_ADDRESS}: {this.state.balance} (ETH), 0 (CTK)</div>
        {ended ?
          <div>
            <div>
              <input onChange={(e) => this.setState({ address: e.target.value })} placeholder="address" type="text" />
            </div>
            <div>
              <input onChange={(e) => this.setState({ passphrase: e.target.value })} placeholder="passphrase" type="password" />
            </div>
            <button onClick={() => this.withdraw()}>Withdraw the collection from crowdfunding</button>
          </div>
          :
          <button onClick={() => this.checkGoalReached()}>Check if goal reached</button>
        }
      </div>
    );
  }
}
