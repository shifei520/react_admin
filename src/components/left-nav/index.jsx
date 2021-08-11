import React, { Component } from 'react'
import {Link, withRouter} from 'react-router-dom'
import './index.less'
import logo from './images/logo.png'
import { Menu } from 'antd';
import { SettingOutlined } from '@ant-design/icons';

import menuList from '@/config/menuConfig.js'


const { SubMenu } = Menu;

const LeftNav = class LeftNav extends Component {
  
  render() {
    let path = this.props.location.pathname
    if(path.indexOf('/product') === 0) {
      path = '/product'
    }
    return (
      <div className="left-nav">
        <header className="left-nav-header">
          <img src={logo} alt="" />
          <h1>硅谷后台</h1>
        </header>
        <Menu
          selectedKeys={[path]}
          mode="inline"
          theme="dark"
        >
          {
            menuList.map(item => {
              if(!item.children) {
                return (
                  <Menu.Item key={item.key} icon={<SettingOutlined />}>                  
                    <Link to={item.key}>{item.title}</Link>
                  </Menu.Item>
                )
              } else {
                return (
                  <SubMenu key={item.key} icon={<SettingOutlined />} title={item.title}>                  
                    {
                      item.children.map(item1 => {                     
                        return (
                          <Menu.Item key={item1.key} icon={<SettingOutlined />}><Link to={item1.key}>{item1.title}</Link></Menu.Item>
                        )
                      })
                    }
                  </SubMenu>
                )
              }
            })
          }
        </Menu>
      </div>
    )
  }
}

export default withRouter(LeftNav)