import React, { Component } from 'react'
import { Container, Header, Input, Table } from 'semantic-ui-react'

const initialState = {
  years: [],
  wgr: 15,
  paybackTime: [],
  ptShare: [],
  stickerPrice: 0
}

export default class Price extends Component {
  
  state = initialState

  formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  formatterP = new Intl.NumberFormat('en-US', {
    style: 'percent',
    maximumFractionDigits: 2
  });

  changeHandler = (e) => {
    this.setState({
      wgr: e.target.value
    })
  }

  updateState = () => {
    let {incomeStatement, cash, ev, ratio } = this.props
    incomeStatement.financials && 
    this.setState({...initialState, wgr: this.state.wgr})

    // margin of safety price - eps 10 years into future
    let eps = incomeStatement.financials[0]['EPS']
    let pe = 0
    for (let i = 0; i < 10; i++){
      eps = eps * (this.state.wgr / 100 + 1)
    }
    incomeStatement.financials.forEach((year, i) => {
      let shares = !!ev[i] ? parseFloat(ev[i]['Number of Shares']) : 0

      // margin of safety price - highest pe of last 10 years
      if (ratio[i]){
        pe = ratio[i]['investmentValuationRatios']['priceEarningsRatio'] > pe ? ratio[i]['investmentValuationRatios']['priceEarningsRatio'] : pe
      }

      // payback time
      let freeCashFlow = parseFloat(cash[i]['Free Cash Flow']) ? parseFloat(cash[i]['Free Cash Flow']) : 0
      let sum = 0
      let lastNum = freeCashFlow
      for (let x = 0; x < 8; x++) {
        lastNum = lastNum + lastNum * (this.state.wgr / 100);
        sum += lastNum
      }

      // setting state to 
      this.setState(prevState => ({
        years: [...prevState.years, year.date],
        paybackTime: [...prevState.paybackTime, this.formatter.format(sum)],
        ptShare: [...prevState.ptShare, this.formatter.format(sum / shares)]
      }))
    })
    // margin of safety
    // lowest number for pe
    pe = pe <= (this.state.wgr * 2) ? pe : this.state.wgr * 2
    let futueSharePrice = pe * eps
    this.setState({stickerPrice: futueSharePrice / (1.15 ** 10)})
  }

  componentDidMount(){
    this.updateState()
  }

  componentDidUpdate(prevProps, prevState){
    if (prevProps !== this.props || prevState.wgr !== this.state.wgr){
      this.updateState()
    }
  }

  render(){
    const {currentTicker} = this.props
    const {years, wgr, paybackTime, ptShare, stickerPrice} = this.state
    return(
      <div>
        <Container style={{paddingBottom: '3em', paddingLeft: '2em', paddingRight: '2em'}} fluid>
          <Header as='h3'>Price</Header>
          <Input icon='percent' type='number' min='0' step='0.01' onChange={this.changeHandler} size='small' value={wgr}/>
          <Table celled striped definition selectable>
          <Table.Header>
              <Table.Row textAlign='center'>
                <Table.HeaderCell singleLine>{currentTicker.symbol}</Table.HeaderCell>
                {years.map((year, i) => <Table.HeaderCell key={i}>{years[years.length - (i + 1)]}</Table.HeaderCell>)}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <Table.Row textAlign='center'>
                <Table.Cell>Payback Time</Table.Cell>
                {paybackTime.map((year, i) => <Table.Cell style={{wordBreak: 'break-all'}} key={i} >{paybackTime[paybackTime.length - (i + 1)]}</Table.Cell>)}
              </Table.Row>
              <Table.Row textAlign='center'>
                <Table.Cell>Per Share</Table.Cell>
                {ptShare.map((year, i) => <Table.Cell style={{wordBreak: 'break-all'}} key={i} >{ptShare[ptShare.length - (i + 1)]}</Table.Cell>)}
              </Table.Row>
            </Table.Body>
          </Table>
            <Table celled definition selectable>
              <Table.Body>
                <Table.Row>
                  <Table.Cell textAlign='left'>Sticker Price</Table.Cell>
                  <Table.Cell collapsing={true}>{this.formatter.format(stickerPrice)}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell textAlign='left'>Margin of Safety</Table.Cell>
                  <Table.Cell collapsing>{this.formatter.format(stickerPrice / 2)}</Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
        </Container>
      </div>
    )
  }
}