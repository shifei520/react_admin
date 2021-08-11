import React, { Component } from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import userInfo from '@/utils/userUtils'
import { Layout } from 'antd'
import LeftNav from '@/components/left-nav'
import Header from '@/components/header'
// 引入路由组件
import Home from '@/pages/home'
import Category from '@/pages/category'
import Product from '@/pages/product'
import Role from '@/pages/role'
import User from '@/pages/user'
import Bar from '@/pages/charts/bar'
import Line from '@/pages/charts/line'
import Pie from '@/pages/charts/pie'


const { Footer, Sider, Content } = Layout;

export default class Admin extends Component {
  render() {
    // 进入首页时判断用户是否登录
    if(!userInfo.user) {
        return <Redirect to='/login'/>
      }

    return (
        <Layout style={{minHeight: '100%'}}>
          <Sider>
            <LeftNav/>
          </Sider>
          <Layout >
            <Header>Header</Header>
            <Content style={{padding: '20px'}}>
              <Switch>
                <Route path='/home' component={Home}/>
                <Route path='/category' component={Category}/>
                <Route path='/product' component={Product}/>
                <Route path='/role' component={Role}/>
                <Route path='/user' component={User}/>
                <Route path='/charts/bar' component={Bar}/>
                <Route path='/charts/line' component={Line}/>
                <Route path='/charts/pie' component={Pie}/>
                <Redirect to="/home"/>
              </Switch>
            </Content>
            <Footer style={{height: '70px', color: 'rgb(204, 204, 204)', textAlign: 'center'}}>推荐使用谷歌浏览器，可以获得更佳页面操作体验</Footer>
          </Layout>
        </Layout>
    )
  }
}
