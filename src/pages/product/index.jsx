import React, { Component } from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'

import Home from './home'
import Detail from './detail'
import AddUpdate from './addupdate'

export default class Product extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/product" component={Home}/>
        <Route path="/product/detail" component={Detail}/>
        <Route path="/product/addupdate" component={AddUpdate}/>
        <Redirect to="/product"/>
      </Switch>
    )
  }
}
