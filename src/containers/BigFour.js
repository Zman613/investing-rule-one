import React, { Component } from 'react'
import { Container, Header, Table } from 'semantic-ui-react'

const initialState = {
  years: [],
  netIncome: [],
  niPercentage: [],
  equity: [],
  dividends: []
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
    this.props.incomeStatement.financials && 
    this.setState(initialState)
    this.props.incomeStatement.financials.forEach((year, i) => {
      this.setState(prevState => ({
        years: [...prevState.years, year.date],
        netIncome: [...prevState.netIncome, parseFloat(year['Net Income'])]
      }))
    })
  }

  componentDidMount(){
    console.log('hit')
    this.updateState()
    this.setState(prevState => ({
      niPercentage: this.percentage(prevState.netIncome)
    }))
  }

  componentDidUpdate(prevProps){
    if (prevProps !== this.props){
      console.log('ping')
      this.updateState()
      this.setState(prevState => ({
        niPercentage: this.percentage(prevState.netIncome)
      }))
    }
  }

  percentage = (array) => {
    let newArr = ['']
    let l = array.length
    for (let i = 0; i < l - 1; i++) {
      if (Math.sign(array[l - (i + 1)]) === 1 || 0 ){
        let s = array[l - (i + 2)] - array[l - (i + 1)]
        newArr.push(this.formatterP.format(s / array[l - (i + 1)]))
      } else if (Math.sign(array[l - 1]) === -1 || -0){
        let s = array[l - (i + 1)] - array[l - (i + 2)]
        newArr.push(this.formatterP.format(s / array[l - (i + 1)]))
      } else {
        newArr.push('NaN')
      }
    }
    return newArr
  }

  render(){
    const {currentTicker} = this.props
    const {years, netIncome, niPercentage, equity, dividends} = this.state
    console.log('net income: ', this.state.netIncome)
    console.log('state: ', this.state)
    return(
      <div>
        <Container style={{ marginTop: '7em', marginLeft: '2em', marginRight: '2em', paddingLeft: '2em', paddingRight: '2em' }} fluid>
          <Header as='h1'>{currentTicker.name}</Header>
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
              <Table.Row>
                <Table.Cell>Percentage</Table.Cell>
                {niPercentage.map((year, i) => <Table.Cell key={i} positive={parseFloat(year) >= 10} negative={Math.sign(parseFloat(year)) === -1 || -0} >{year}</Table.Cell>)}
              </Table.Row>
            </Table.Body>
          </Table>
        </Container>
      </div>
    )
  }

}