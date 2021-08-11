import React, { Component } from 'react'
import {Row, Col, Input, Tree } from 'antd';
import menuList from "@/config/menuConfig.js"

const newMenuList = [{title: "平台权限", key: 'all'}]
newMenuList[0].children = menuList

export default class UpdateAuth extends Component {

  state = {
    checkedAuth: this.props.menus, // 已有的权限或者选中的权限
  }
  // 点击某个树节点时触发
  onCheck = (checkedAuth) => {
    this.setState({checkedAuth})
  }
  // 获取设置的权限列表
  getMenus = () => this.state.checkedAuth

  //不推荐使用
  componentWillReceiveProps(props) {
    const {menus} = props
    this.setState({checkedAuth: menus})
  }

  render() {
    const {name} = this.props
    const {checkedAuth} = this.state
    return (
      <div>
        <Row align="middle">
          <Col span={4} >角色名称</Col>
          <Col span={18}><Input value={name} disabled/></Col>
        </Row>
        <Row style={{marginTop: '30px'}}>
          <Tree
          checkable
          defaultExpandAll
          checkedKeys={checkedAuth}
          treeData={newMenuList}
          onCheck={this.onCheck}
        />
        </Row>
      </div>
    )
  }
}
