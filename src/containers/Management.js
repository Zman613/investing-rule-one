import React, { Component } from 'react'
import { Container, Table, Header } from 'semantic-ui-react'

const initialState = {
  years: [],
  roe: [],
  roic: [],
  totalDebt: [],
  shortDebt: [],
  longDebt: [],
  debtPercentage: [],
  isTrue: false
}

export default class Management extends Component {

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
    let {incomeStatement, balanceSheet} = this.props
    let bs = balanceSheet.financials
    incomeStatement.financials && 
    this.setState(initialState)
    incomeStatement.financials.forEach((year, i) => {
      // let num = parseFloat(bs[i]['Total shareholders equity']) + parseFloat(bs[i]['Total debt'])
      this.setState(prevState => ({
        years: [...prevState.years, year.date],
        roe: bs[i] ? [...prevState.roe, this.formatterP.format(parseFloat(year['Net Income']) / parseFloat(bs[i]['Total shareholders equity']))] : [...prevState.roe, 'Not Available'],
        roic: bs[i] ? [...prevState.roic, this.formatterP.format(parseFloat(year['Net Income']) / (parseFloat(bs[i]['Total shareholders equity']) + parseFloat(bs[i]['Total debt'])))] : [...prevState.roic, 'Not Available'],
        totalDebt: bs[i] ? [...prevState.totalDebt, parseFloat(bs[i]['Total debt'])] : [...prevState.totalDebt, 'Not Available'],
        shortDebt: bs[i] ? [...prevState.shortDebt, parseFloat(bs[i]['Short-term debt'])] : [...prevState.shortDebt, 'Not Available'],
        longDebt: bs[i] ? [...prevState.longDebt, parseFloat(bs[i]['Long-term debt'])] : [...prevState.longDebt, 'Not Available']
      }))
    })
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

  componentDidMount(){
    this.updateState()
    this.setState(prevState => ({
      debtPercentage: this.percentage(prevState.totalDebt)
    }))
  }

  componentDidUpdate(prevProps){
    if (prevProps !== this.props){
      this.updateState()
      this.setState(prevState => ({
        debtPercentage: this.percentage(prevState.totalDebt)
      }))
    }
  }

  show = () => {
    this.setState({isTrue: !this.state.isTrue})
  }

  render(){

    const {currentTicker} = this.props
    const {years, roe, roic, totalDebt, shortDebt, longDebt, debtPercentage, isTrue} = this.state
    return (
      <div>
        <Container style={{paddingBottom: '3em', paddingLeft: '2em', paddingRight: '2em'}} fluid>
          <Header as='h3'>Management</Header>
          <Table celled striped definition selectable>
            <Table.Header>
              <Table.Row textAlign='center'>
                <Table.HeaderCell singleLine>{currentTicker.symbol}</Table.HeaderCell>
                {years.map((year, i) => <Table.HeaderCell key={i}>{years[years.length - (i + 1)]}</Table.HeaderCell>)}
              </Table.Row>
            </Table.Header>

            <Table.Body>
              <Table.Row textAlign='center'>
                <Table.Cell>ROE</Table.Cell>
                {roe.map((year, i) => <Table.Cell style={{wordBreak: 'break-all'}} key={i} positive={parseFloat(roe[roe.length - (i + 1)]) >= 10} negative={Math.sign(parseFloat(roe[roe.length - (i + 1)])) === -1} >{roe[roe.length - (i + 1)]}</Table.Cell>)}
              </Table.Row>
              <Table.Row textAlign='center'>
                <Table.Cell>ROIC</Table.Cell>
                {roic.map((year, i) => <Table.Cell style={{wordBreak: 'break-all'}} key={i} positive={parseFloat(roic[roic.length - (i + 1)]) >= 10} negative={Math.sign(parseFloat(roic[roic.length - (i + 1)])) === -1} >{roic[roic.length - (i + 1)]}</Table.Cell>)}
              </Table.Row>
              <Table.Row textAlign='center'>
                <Table.Cell onClick={() => this.show()}>Debt</Table.Cell>
                {totalDebt.map((year, i) => <Table.Cell style={{wordBreak: 'break-all'}} key={i}>{this.formatter.format(totalDebt[totalDebt.length - (i + 1)])}</Table.Cell>)}
              </Table.Row>
              <Table.Row textAlign='center'>
                <Table.Cell>Percentage</Table.Cell>
                {debtPercentage.map((year, i) => <Table.Cell style={{wordBreak: 'break-all'}} key={i}>{year}</Table.Cell>)}
              </Table.Row>
              {isTrue && <Table.Row textAlign='center'>
                <Table.Cell>Short Term Debt</Table.Cell>
                {shortDebt.map((year, i) => <Table.Cell style={{wordBreak: 'break-all'}} key={i}>{this.formatter.format(shortDebt[shortDebt.length - (i + 1)])}</Table.Cell>)}
              </Table.Row>}
              {isTrue && <Table.Row textAlign='center'>
                <Table.Cell>Long Term Debt</Table.Cell>
                {longDebt.map((year, i) => <Table.Cell style={{wordBreak: 'break-all'}} key={i}>{this.formatter.format(longDebt[longDebt.length - (i + 1)])}</Table.Cell>)}
              </Table.Row>}
            </Table.Body>
          </Table>
        </Container>
      </div>
    )

  }

}