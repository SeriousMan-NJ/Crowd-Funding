import React from "react";
import Information from "./Information"
import Web3 from "web3"
import UserDetail from "./UserDetail"

export default class Investor extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      joined: false,
      funded: false,
      sender: "0x0",
      amount: "0",
      passphrase: "",
      showDetail: false,
      userToken: 0,
    }
  }

  async componentDidUpdate() {
    if (this.props.funded) {
      this.setState({
        joined: false,
        funded: false,
        showDetail: true,
      })
      this.props.setFunded(false)

      const userToken = await this.props.tokenContract.methods.balanceOf(this.state.sender).call()
      this.setState({ userToken })
    }
  }

  onSubmit() {
    this.setState({ funded: true })
    const web3 = new Web3('ws://141.223.85.151:8546')
    web3.eth.personal.unlockAccount(this.state.sender, this.state.passphrase, 30, async (err) => {
      if (err) {
        window.alert("unlockAccount failed")
        return
      }

      const transactionConfig = {
        from: this.state.sender,
        to: process.env.REACT_APP_FUNDING_ADDRESS,
        value: web3.utils.toWei(this.state.amount, "ether"),
        gas: 3000000, // XXX: 이렇게 설정하지 않으면 오류가 발생
      }

      web3.eth.sendTransaction(transactionConfig, async (err) => {
        if (err) {
          window.alert("sendTransaction failed")
          return
        }

        const transactionConfig = {
          from: this.state.sender,
          gas: 3000000, // XXX: 이렇게 설정하지 않으면 오류가 발생
        }
        await this.props.tokenContract.methods.transfer(this.state.sender, this.state.amount).send(transactionConfig)
      })
    })
  }

  render() {
    const {
      fundedAmount,
      goalAmount,
      remainingToken,
      ended
    } = this.props

    return (
      <div className="Investor">
        <Information
          fundedAmount={fundedAmount}
          goalAmount={goalAmount}
          remainingToken={remainingToken}
          ended={ended}
        />
        <div>
          {this.state.joined ?
            this.state.funded ?
              <div>Waiting for result...</div>
              :
              <div>
                <div>[Join crowdfunding]</div>
                <div>
                  <div>Account to fund</div>
                  <input onChange={(e) => this.setState({ sender: e.target.value })} placeholder="Sender Account" type="text" />
                </div>
                <div>
                  <div>The amount of funding</div>
                  <input onChange={(e) => this.setState({ amount: e.target.value })} placeholder="Amount (ETH)" type="number" />
                </div>
                <div>
                  <div>Passphrase</div>
                  <input onChange={(e) => this.setState({ passphrase: e.target.value })} placeholder="passphrase" type="password" />
                </div>
                <input onClick={() => this.onSubmit()} type="button" value="Funding!" />
              </div>
            :
            <button onClick={() => this.setState({ joined: true, showDetail: false })}>Join crowdfunding</button>
          }
        </div>
        {this.state.showDetail ?
          <UserDetail
            address={this.state.sender}
            ether={this.state.amount}
            token={this.state.userToken}
          />
          :
          null
        }
      </div>
    );
  }
}
