import { Search, Menu, Image, Container } from 'semantic-ui-react'
import React, {Component} from 'react'
import _ from 'lodash'

const initialState = { isLoading: false, results: [], value: '', tickers: {} }

class SearchBar extends Component {

  state = initialState

  componentDidMount(){
    fetch(`https://financialmodelingprep.com/api/v3/company/stock/list`)
    .then(response => response.json())
    .then(tickers => {
      tickers = tickers.symbolsList.map((ticker, i) => ({
        ...ticker,
        title: (ticker.name || ''),
        key: i,
        price: ticker.price.toString(),
        description: ticker.symbol
      }))
      this.setState({tickers})
    })
  }

  handleResultSelect = (e, { result }) => {
    this.props.updateTicker(result)
    this.setState({ value: result.symbol })
  }

  handleSearchChange = (e, { value }) => {
    this.setState({ isLoading: true, value })

    setTimeout(() => {
      if (this.state.value.length < 1) return this.setState({initialState, tickers: this.state.tickers})

      if (this.state.value.length > 1){
        const re = new RegExp(_.escapeRegExp(this.state.value), 'i')
        const isMatch = (result) => re.test(result.symbol + '' + result.name)
  
        this.setState({
          isLoading: false,
          results: _.filter(this.state.tickers, isMatch),
        })
      }
    }, 300)
  }

  render(){
    const { isLoading, value, results } = this.state
    // console.log(this.props)
    return (
      <div>
        <Menu fixed='top' inverted>
          <Container>
          <Menu.Item active={false}>
            <Image src='/warren-buffet.jpg' style={{ marginRight: '1.5em' }} avatar size='mini'  />
            Rule One Investing
          </Menu.Item>
          <Menu.Item position='right'>
            <Search
              loading={isLoading}
              onResultSelect={this.handleResultSelect}
              onSearchChange={_.debounce(this.handleSearchChange, 500, {
                leading: true,
              })}
              results={results}
              value={value}
              {...{}}
            />
          </Menu.Item>
          </Container>
        </Menu>
      </div>
    )
  }
}

export default SearchBar