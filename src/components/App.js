import React from 'react';
import '../App.css';
import SearchBar from '../containers/SearchBar';
import BigFour from '../containers/BigFour';


class App extends React.Component {

  state = {
    currentTicker: {},
    incomeStatement: {},
    balanceSheet: {},
    cashFlowStatement: {}
  }

  updateTicker = (ticker) => {
    this.setState({
      currentTicker: ticker
    })
  }

  componentDidUpdate(prevProps, prevState){
    if (prevState.currentTicker !== this.state.currentTicker){
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
  }

  render(){
    console.log('ticker: ', this.state.currentTicker)
    console.log('income: ', this.state.incomeStatement)
    console.log('Balance: ', this.state.balanceSheet)
    console.log('Cash: ', this.state.cashFlowStatement)
    const {incomeStatement, balanceSheet, cashFlowStatement, currentTicker} = this.state
    return (
      <div className="App">
        <SearchBar updateTicker={this.updateTicker} />
        {incomeStatement.financials && balanceSheet.financials && cashFlowStatement.financials && <BigFour currentTicker={currentTicker} incomeStatement={incomeStatement} balanceSheet={balanceSheet} cashFlowStatement={cashFlowStatement} />}
      </div>
    );
  }
}

export default App;
