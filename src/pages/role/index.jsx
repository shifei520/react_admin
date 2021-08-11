import React, { Component } from 'react'
import { Card, Button, Table, Modal, Row, Col, Input, message  } from 'antd';
import {reqRoleList, reqAddRole, reqUpdateRoleAuth} from '@/api'
import UpdateAuth from '@/components/update-auth'
import userInfo from '@/utils/userUtils'
import {formateDate} from '@/utils/dateUtils'

export default class Role extends Component {

  state = {
    rolesList: [],
    role: {},
    isAddVisible: false, // 添加用户对话框的显示与隐藏
    isUpdateVisible: false // 设置用户权限对话框的显示与隐藏
  }
  // 点击某一行选中单选按钮
  selectRow = (role) => {
    return {
      onClick: e => {
        this.setState({role})
      }
    }
  }
  // 添加角色成功函数
  handleAddOk = () => {
    const rolename = this.addInputRef.state.value
    if(rolename) {
      reqAddRole(rolename).then(res => {
        if(res.status === 0) {
          message.success("添加角色成功")
          this.setState(state => ({rolesList: [...state.rolesList, res.data]}))
          this.setState({isAddVisible: false})
        }
      })
    }
  }
  // 设置用户权限
  handleUpdateOk = () => {
    const menus = this.updateAuthRef.getMenus()
    const {_id} = this.state.role
    const auth_name = userInfo.user.username
    const auth_time = Date.now()
    const queryInfo = {_id, menus, auth_name, auth_time}
    reqUpdateRoleAuth(queryInfo).then(res => {
      if(res.status === 0) {
        this.setState({isUpdateVisible: false, role: res.data})
        message.success("角色权限设置成功")
      }
    })
  } 

  componentDidMount() {
    reqRoleList().then(res => {
      this.setState({rolesList: res.data})
    })
    this.columns = [
      {
        title: '角色名称',
        dataIndex: 'name',
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        render: (create_time) => {
          return formateDate(create_time)
        }
      },
      {
        title: '授权时间',
        dataIndex: 'auth_time',
        render: (auth_time) => {
          return formateDate(auth_time)
        }
      },
      {
        title: '授权人',
        dataIndex: 'auth_name',
      }
    ]
  }

  render() {
    const {rolesList, role} = this.state
    const title = (
      <span>
        <Button type="primary" onClick={() => this.setState({isAddVisible: true})}>创建角色</Button>&nbsp;&nbsp;
        <Button type="primary" onClick={() => this.setState({isUpdateVisible: true})} disabled={!role._id}>设置角色权限</Button>
      </span>
    )
    const columns = this.columns
    return (
      <Card title={title} >
        <Table
        columns={columns}
        rowKey="_id"
        dataSource={rolesList}
        pagination={{defaultPageSize: 3}}
        rowSelection={{
          type: 'radio',
          selectedRowKeys: [role._id],
          onSelect: (role) => {
          this.setState({role})
        }}}
        onRow={this.selectRow}
      />
      <Modal title="添加角色" visible={this.state.isAddVisible} onOk={this.handleAddOk} onCancel={() => this.setState({isAddVisible: false})}>
        <Row align="middle">
          <Col span={4} >角色名称</Col>
          <Col span={18}><Input placeholder="请输入角色名称" ref={c => this.addInputRef = c}/></Col>
        </Row>
      </Modal>
      <Modal title="设置用户权限" visible={this.state.isUpdateVisible} onOk={this.handleUpdateOk} onCancel={() => this.setState({isUpdateVisible: false})}>
        <UpdateAuth name={role.name} menus={role.menus} ref={c => this.updateAuthRef = c}/>
      </Modal>
      </Card>
    )
  }
}
