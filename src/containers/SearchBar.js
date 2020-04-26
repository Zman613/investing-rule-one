import { Search, Grid, Header, Segment, Menu, Image, Container } from 'semantic-ui-react'
import React, {Component} from 'react'

const initialState = { isLoading: false, results: [], value: '', tickers: {} }

class SearchBar extends Component {

  state = initialState

  componentDidMount(){
    fetch(`https://financialmodelingprep.com/api/v3/company/stock/list`)
    .then(response => response.json())
    .then(tickers => {
      this.setState({tickers})
      console.log(tickers)
    })
  }
  render(){
    return (
      <div>
        <Menu fixed='top'>
          <Menu.Item active={false}>
            <Image src='/rule-one-logo.png' style={{ marginRight: '1.5em' }} avatar size='mini' />
            Rule One Investing
          </Menu.Item>
        </Menu>
      </div>
    )
  }
}

export default SearchBar