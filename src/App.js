import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Main from './Main'
import Beneficiary from './Beneficiary'
import Investor from './Investor'
import Web3 from 'web3'
import './App.css';

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      fundedAmount: 0,
      goalAmount: 0,
      remainingToken: 0,
      ended: false,
      tokenContract: null,
      fundingContract: null,
      funded: false,
    }
  }
  async componentDidMount() {
    const web3 = new Web3('ws://141.223.85.151:8546')

    const tokenContract = new web3.eth.Contract(JSON.parse(process.env.REACT_APP_TOKEN_ABI), process.env.REACT_APP_TOKEN_ADDRESS)
    const remainingToken = await tokenContract.methods.balanceOf(process.env.REACT_APP_BENEFICIARY_ADDRESS).call()
    this.setState({ remainingToken, tokenContract })

    const fundingContract = new web3.eth.Contract(JSON.parse(process.env.REACT_APP_FUNDING_ABI), process.env.REACT_APP_FUNDING_ADDRESS)
    const fundedAmount = await fundingContract.methods.totalAmount().call() / 1000000000000000000
    const goalAmount = await fundingContract.methods.goalAmount().call() / 1000000000000000000
    const ended = await fundingContract.methods.ended().call()
    this.setState({ fundedAmount, goalAmount, ended, fundingContract })

    fundingContract.events.FundTransfer()
      .on('data', async (event) => {
        const fundedAmount = await fundingContract.methods.totalAmount().call() / 1000000000000000000
        this.setState({ fundedAmount })
      })
      .on('changed', (event) => {
          // remove event from local database
      })
      .on('error', console.error);

    tokenContract.events.Transfer()
      .on('data', async (event) => {
        const remainingToken = await tokenContract.methods.balanceOf(process.env.REACT_APP_BENEFICIARY_ADDRESS).call()
        this.setState({ remainingToken, funded: true })
      })
      .on('changed', (event) => {
          // remove event from local database
      })
      .on('error', console.error);

    // DEBUG
    window.tokenContract = tokenContract
    window.fundingContract = fundingContract
  }
  render() {
    const {
      fundedAmount,
      goalAmount,
      remainingToken,
      ended,
      tokenContract,
    } = this.state

    return (
      <Router>
        <div>
          <nav>
            <Link to="/">Go to the main page for crowdfunding</Link>
          </nav>

          {/* A <Switch> looks through its children <Route>s and
              renders the first one that matches the current URL. */}
          <Switch>
            <Route path="/beneficiary">
              <Beneficiary
                fundedAmount={fundedAmount}
                goalAmount={goalAmount}
                remainingToken={remainingToken}
                ended={ended}
              />
            </Route>
            <Route path="/investor">
              <Investor
                fundedAmount={fundedAmount}
                goalAmount={goalAmount}
                remainingToken={remainingToken}
                ended={ended}
                tokenContract={tokenContract}
                setFunded={(funded) => this.setState({ funded })}
                funded={this.state.funded}
              />
            </Route>
            <Route path="/">
              <Main />
            </Route>
          </Switch>
        </div>
      </Router>
    );
  }
}
