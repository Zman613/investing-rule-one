import React, { Component } from 'react'
import { Container, Header, Table } from 'semantic-ui-react'

const initialState = {
  years: [],
  netIncome: [],
  niPercentage: [],
  bookValue: [],
  bvPercentage: [],
  sales: [],
  sPercentage: [],
  profit: [],
  pPercentage: [],
  operatingCash: [],
  ocPercentage: [],
  isTrue: false
}
export default class BigFour extends Component {

  state = initialState

  formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  formatterP = new Intl.NumberFormat('en-US', {
    style: 'percent',
    maximumFractionDigits: 2
  });

  updateState = () => {
    let {incomeStatement, balanceSheet, cashFlowStatement } = this.props
    incomeStatement.financials && 
    this.setState(initialState)
    incomeStatement.financials.forEach((year, i) => {
      this.setState(prevState => ({
        years: [...prevState.years, year.date],
        netIncome: [...prevState.netIncome, parseFloat(year['Net Income'])],
        bookValue: balanceSheet.financials[i] ? [...prevState.bookValue, parseFloat(balanceSheet.financials[i]['Total shareholders equity']) + Math.abs(parseFloat(cashFlowStatement.financials[i]['Dividend payments']))] : [...prevState.bookValue, 'Not Available'],
        sales: [...prevState.sales, parseFloat(year['Revenue'])],
        profit: [...prevState.profit, parseFloat(year['Gross Profit'])],
        operatingCash: [...prevState.operatingCash, parseFloat(cashFlowStatement.financials[i]['Operating Cash Flow'])]
      }))
    })
  }

  componentDidMount(){
    this.updateState()
    this.setState(prevState => ({
      niPercentage: this.percentage(prevState.netIncome),
      bvPercentage: this.percentage(prevState.bookValue),
      sPercentage: this.percentage(prevState.sales),
      pPercentage: this.percentage(prevState.profit),
      ocPercentage: this.percentage(prevState.operatingCash)
    }))
  }

  componentDidUpdate(prevProps){
    if (prevProps !== this.props){
      this.updateState()
      this.setState(prevState => ({
        niPercentage: this.percentage(prevState.netIncome),
        bvPercentage: this.percentage(prevState.bookValue),
        sPercentage: this.percentage(prevState.sales),
        pPercentage: this.percentage(prevState.profit),
        ocPercentage: this.percentage(prevState.operatingCash)
      }))
    }
  }

  percentage = (array) => {
    let newArr = ['']
    let l = array.length
    for (let i = 0; i < l - 1; i++) {
      if (Math.sign(array[l - (i + 1)]) === 1 || Math.sign(array[l - (i + 1)]) === 0 ){
        let s = array[l - (i + 2)] - array[l - (i + 1)]
        let a = ((array[l - (i + 1)]) === 0) ? 1 : array[l - (i + 1)]
        newArr.push(this.formatterP.format(s / a))
      } else if (Math.sign(array[l - (i + 1)]) === -1 || Math.sign(array[l - (i + 1)]) ===  -0){
        let s = array[l - (i + 1)] - array[l - (i + 2)]
        let a = ((array[l - (i + 1)]) === 0) ? -1 : array[l - (i + 1)]
        newArr.push(this.formatterP.format(s / a))
      } else {
        newArr.push('NaN')
      }
    }
    return newArr
  }

  show = () => {
    this.setState({isTrue: !this.state.isTrue})
  }

  render(){
    const {currentTicker} = this.props
    const {years, netIncome, niPercentage, bookValue, bvPercentage, sales, sPercentage, profit, pPercentage, operatingCash, ocPercentage, isTrue} = this.state
    return(
      <div>
        <Container style={{ marginTop: '7em', marginLeft: '2em', marginRight: '2em', paddingLeft: '2em', paddingRight: '2em', paddingBottom: '3em' }} fluid>
          <Header as='h1' style={{marginBottom: '0'}}>{currentTicker.name}</Header>
          <span>{this.formatter.format(currentTicker.price)}</span>
          <Header as='h3'>The Big Four Numbers</Header>
          <Table celled striped definition selectable>
            <Table.Header>
              <Table.Row textAlign='center'>
                <Table.HeaderCell singleLine>{currentTicker.symbol}</Table.HeaderCell>
                {years.map((year, i) => <Table.HeaderCell key={i}>{years[years.length - (i + 1)]}</Table.HeaderCell>)}
              </Table.Row>
            </Table.Header>

            <Table.Body>
              <Table.Row textAlign='center'> 
                <Table.Cell>Net Income</Table.Cell>
                {netIncome.map((year, i) => <Table.Cell key={i} style={{wordBreak: 'break-all'}}>{this.formatter.format(netIncome[netIncome.length - (i + 1)])}</Table.Cell>)}
              </Table.Row>
              <Table.Row textAlign='center'>
                <Table.Cell>Percentage</Table.Cell>
                {niPercentage.map((year, i) => <Table.Cell style={{wordBreak: 'break-all'}} key={i} positive={parseFloat(year) >= 10} negative={Math.sign(parseFloat(year)) === -1} >{year}</Table.Cell>)}
              </Table.Row>
              <Table.Row textAlign='center'>
                <Table.Cell>Book Value</Table.Cell>
                {bookValue.map((year, i) => <Table.Cell key={i} style={{wordBreak: 'break-all'}}>{typeof(bookValue[bookValue.length - (i + 1)]) === 'number' ? this.formatter.format(bookValue[bookValue.length - (i + 1)]) : bookValue[bookValue.length - (i + 1)]}</Table.Cell>)}
              </Table.Row>
              <Table.Row textAlign='center'>
                <Table.Cell>Percentage</Table.Cell>
                {bvPercentage.map((year, i) => <Table.Cell style={{wordBreak: 'break-all'}} key={i} positive={parseFloat(year) >= 10} negative={Math.sign(parseFloat(year)) === -1} >{year}</Table.Cell>)}
              </Table.Row>
              <Table.Row textAlign='center'> 
                <Table.Cell onClick={() => this.show()}>Sales</Table.Cell>
                {sales.map((year, i) => <Table.Cell key={i} style={{wordBreak: 'break-all'}}>{this.formatter.format(sales[sales.length - (i + 1)])}</Table.Cell>)}
              </Table.Row>
              <Table.Row textAlign='center'>
                <Table.Cell>Percentage</Table.Cell>
                {sPercentage.map((year, i) => <Table.Cell style={{wordBreak: 'break-all'}} key={i} positive={parseFloat(year) >= 10} negative={Math.sign(parseFloat(year)) === -1} >{year}</Table.Cell>)}
              </Table.Row>
              {isTrue && <Table.Row textAlign='center'> 
                <Table.Cell>Profit</Table.Cell>
                {profit.map((year, i) => <Table.Cell key={i} style={{wordBreak: 'break-all'}}>{this.formatter.format(profit[profit.length - (i + 1)])}</Table.Cell>)}
              </Table.Row>}
              {isTrue && <Table.Row textAlign='center'>
                <Table.Cell>Percentage</Table.Cell>
                {pPercentage.map((year, i) => <Table.Cell style={{wordBreak: 'break-all'}} key={i} positive={parseFloat(year) >= 10} negative={Math.sign(parseFloat(year)) === -1} >{year}</Table.Cell>)}
              </Table.Row>}
              <Table.Row textAlign='center'> 
                <Table.Cell>Operating Cash</Table.Cell>
                {operatingCash.map((year, i) => <Table.Cell key={i} style={{wordBreak: 'break-all'}}>{this.formatter.format(operatingCash[operatingCash.length - (i + 1)])}</Table.Cell>)}
              </Table.Row>
              <Table.Row textAlign='center'>
                <Table.Cell>Percentage</Table.Cell>
                {ocPercentage.map((year, i) => <Table.Cell style={{wordBreak: 'break-all'}} key={i} positive={parseFloat(year) >= 10} negative={Math.sign(parseFloat(year)) === -1} >{year}</Table.Cell>)}
              </Table.Row>
            </Table.Body>
          </Table>

        </Container>
      </div>
    )
  }

}