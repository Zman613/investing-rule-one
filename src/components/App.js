import React from 'react';
import '../App.css';
import SearchBar from '../containers/SearchBar';
import BigFour from '../containers/BigFour';
import {Image, Header} from 'semantic-ui-react'
import Management from '../containers/Management';
import Price from '../containers/Price';


class App extends React.Component {

  state = {
    currentTicker: {},
    incomeStatement: {},
    balanceSheet: {},
    cashFlowStatement: {},
    enterpriseValue: {},
    financialRatio: {}
  }

  updateTicker = (ticker) => {
    this.setState({
      currentTicker: ticker
    })
  }

  componentDidUpdate(prevProps, prevState){
    if (this.state.currentTicker !== {} && prevState.currentTicker !== this.state.currentTicker){
      this.setState({
        incomeStatement: {},
        balanceSheet: {},
        cashFlowStatement: {},
        enterpriseValue: {}
      })
      this.fetchStock()
    }
  }

  fetchStock = () => {
    fetch(`https://financialmodelingprep.com/api/v3/financials/income-statement/${this.state.currentTicker.symbol}`)
    .then(response => response.json())
    .then(stock => this.setState({incomeStatement: stock}))
    fetch(`https://financialmodelingprep.com/api/v3/financials/balance-sheet-statement/${this.state.currentTicker.symbol}`)
    .then(response => response.json())
    .then(stock => this.setState({balanceSheet: stock}))
    fetch(`https://financialmodelingprep.com/api/v3/financials/cash-flow-statement/${this.state.currentTicker.symbol}`)
    .then(response => response.json())
    .then(stock => this.setState({cashFlowStatement: stock}))
    fetch(`https://financialmodelingprep.com/api/v3/enterprise-value/${this.state.currentTicker.symbol}`)
    .then(response => response.json())
    .then(stock => this.setState({enterpriseValue: stock}))
    fetch(`https://financialmodelingprep.com/api/v3/financial-ratios/${this.state.currentTicker.symbol}`)
    .then(response => response.json())
    .then(stock => this.setState({financialRatio: stock}))
  }

  render(){
    // console.log('ticker: ', this.state.currentTicker)
    // console.log('income: ', this.state.incomeStatement)
    // console.log('Balance: ', this.state.balanceSheet)
    // console.log('Cash: ', this.state.cashFlowStatement)
    // console.log('Ev: ', this.state.enterpriseValue)
    const {incomeStatement, balanceSheet, cashFlowStatement, currentTicker, enterpriseValue, financialRatio} = this.state
    return (
      <div className="App">
        <SearchBar updateTicker={this.updateTicker} ticker={currentTicker} />
        {incomeStatement.financials && balanceSheet.financials && cashFlowStatement.financials && enterpriseValue.enterpriseValues && financialRatio['ratios'] ? 
        <div>
          <BigFour currentTicker={currentTicker} incomeStatement={incomeStatement} balanceSheet={balanceSheet} cashFlowStatement={cashFlowStatement} />
          <Management currentTicker={currentTicker} incomeStatement={incomeStatement} balanceSheet={balanceSheet} />
          <Price incomeStatement={incomeStatement} cash={cashFlowStatement.financials} ev={enterpriseValue.enterpriseValues} currentTicker={currentTicker} ratio={financialRatio['ratios']} />
        </div> : 
        <div>
          <Header as='h1' style={{marginTop: '7em !important', paddingTop: '7em'}}>Rule One Investing</Header>
          <Image src='/warren-buffet.jpg' centered circular size='medium' />
        </div>}
      </div>
    );
  }
}

export default App;
