import { Tabs, Tab } from 'react-bootstrap'
import dBank from '../abis/dBank.json'
import React, {Component} from 'react';
import Token from '../abis/Token.json'
import dbank from '../dbank.png';
import Web3 from 'web3';
import './App.css';

//h0m3w0rk - add new tab to check accrued interest
class App extends Component {

  async componentWillMount() {
    await this.loadBlockchainData(this.props.dispatch)
  }

  async loadBlockchainData(dispatch) {

    //check if MetaMask exists
    if(typeof window.ethereum !== 'undefined'){

        const web3 = new Web3(window.ethereum)
        const netId = await web3.eth.net.getId()
        const accounts = await web3.eth.getAccounts()
//         const chainId = await web3.eth.chainId
        const balance = await web3.eth.getBalance(accounts[0])
        this.setState({account: accounts[0], balance: balance, web3: web3})
        try {
            window.ethereum.enable().then(function() {
                console.log('acct;', web3.eth.getAccounts())
            // User has allowed account access to DApp...
            });
        } catch (e) {
            // User has denied account access to DApp...
        }
        try{
            const token = new web3.eth.Contract(Token.abi, Token.networks[netId].address)
            console.log('token addr: ', token);
            const dbank = new web3.eth.Contract(dBank.abi, dBank.networks[netId].address)
            const dBankAddress = dBank.networks[netId].address
            const tokenBalance = await token.methods.balanceOf(this.state.account).call()
            console.log('tokenBalance:', web3.utils.fromWei(tokenBalance))
            this.setState({token: token, dbank: dbank, dBankAddress: dBankAddress})

        }catch(e){
            window.alert('error with token/contract:', e)
        }

    } else {
        window.alert('Please install metamask')
    }

      //assign to values to variables: web3, netId, accounts

      //check if account is detected, then load balance&setStates, elsepush alert

      //in try block load contracts

    //if MetaMask not exists push alert
  }

  async deposit(amount) {
    //check if this.state.dbank is ok
      //in try block call dBank deposit();
      try{
        await this.state.dbank.methods.deposit().send({value: amount.toString(), from: this.state.account})
      } catch(e) {
        console.log('error depositing')
      }

      console.log('depositing...', amount)
  }

  async withdraw(e) {
    //prevent button from default click
    e.preventDefault()
    //check if this.state.dbank is ok
    //in try block call dBank withdraw();
    try{
        await this.state.dbank.methods.withdraw().send({from: this.state.account})
    } catch(e) {
        console.log('error withdrawing')
    }
    console.log('withdrawing...', e);
  }

  constructor(props) {
    super(props)
    this.state = {
      web3: 'undefined',
      account: '',
      token: null,
      dbank: null,
      balance: 0,
      dBankAddress: null
    }
  }

  render() {
return(
      <div className='text-monospace'>
        <nav className='navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow'>
          <a
            className='navbar-brand col-sm-3 col-md-2 mr-0'
            target='_blank'
            rel='noopener noreferrer'
          >
        <div>💰💵  </div>
          <b>dBank</b>
        </a>
        </nav>
        <div className='container-fluid mt-5 text-center'>
        <br></br>
          <h1>Welcome to dBank</h1>
          <h2>{this.state.account}</h2>
          <br></br>
          <div className='row'>
            <main role='main' className='col-lg-12 d-flex text-center'>
              <div className='content mr-auto ml-auto'>
              <Tabs defaultActiveKey='profile' id='uncontrolled-tab-example'>
                {deposit(this)}
                {withdrawal(this)}
              </Tabs>
              </div>
            </main>
          </div>
        </div>
      </div>
  )}
};

function withdrawal(thing) {return (<Tab eventKey="withdrawal" title="Withdrawal">
                    <div>
                        <br/>
                        Do you want to withdraw + take interest?
                        <br/>
                        <div>
                        <button type='submit' className='btn btn-primary' onClick={(e) => thing.withdraw(e)}>WITHDRAW</button>
                      </div>
                    </div>
                </Tab>)}

function deposit(thing) { return (<Tab eventKey="deposit" title="Deposit">
 <div>
     <br/>
     How much do you want to deposit?
     <br/>
     (min. amount is 0.01 ETH)
     <form onSubmit={(e) => {
       e.preventDefault()
       let amount = thing.depositAmount.value
       amount = amount * 10**18 //convert to wei
       thing.deposit(amount)
     }}>
       <div className='form-group mr-sm-2'>
       <br></br>
         <input
           id='depositAmount'
           step="0.01"
           type='number'
           ref={(input) => { thing.depositAmount = input }}
           className="form-control form-control-md"
           placeholder='amount...'
           required />
       </div>
       <button type='submit' className='btn btn-primary'>DEPOSIT</button>
     </form>
 </div>
 </Tab>)}
export default App;