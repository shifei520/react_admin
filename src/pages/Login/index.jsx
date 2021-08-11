import React, { Component } from 'react'
import { Form, Input, Button,message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import {Redirect} from 'react-router-dom'
import './index.less'
import {reqLogin} from '@/api'
import userInfo from '@/utils/userUtils'
import userStorage from "@/utils/localstorageUtils.js";

// 登录界面
export default class Login extends Component {

  // 按钮提交事件
  handleSubmit = async (value) => {
    const response =await reqLogin(value)
    if(response.status === 0) {
      message.success('登陆成功')
      userInfo.user = response.data
      userStorage.saveUser(response.data)
      this.props.history.replace('/')
    } else {
      message.error(response.msg)
    }
  }

  // 密码自定义验证
  pwdValidator = (_ , value) => {
    if(!value) {
      return Promise.reject('请输入密码')
    } else if (value.length < 4) {
      return Promise.reject('密码至少4位')
    } else if (value.length > 12) {
      return Promise.reject('密码最多12位')
    } else if (!/^[a-zA-Z0-9_]+/.test(value)) {
      return Promise.reject('密码必须由数字、字母或下划线组成')
    } else {
      return Promise.resolve()
    }
  }

  render() {

    if(userInfo.user) {
      return <Redirect to="/"/>
    }

    return (
      <div className="login">
        <header className="login-header">
          <h1>后台管理系统</h1>
        </header>
        <section className="login-content">
          <h2>用户登录</h2>
          <Form
            name="normal_login"
            className="login-form"
            onFinish={this.handleSubmit}
          >
            <Form.Item
              name="username"
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: '用户名必须输入！',
                },
                {
                  min: 4,
                  message: '用户名至少4位'
                },
                {
                  max: 12,
                  message: '用户名最多12位'
                },
                {
                  pattern: /^[a-zA-Z0-9_]+/,
                  message: '用户名必须由数字、字母或下划线组成'
                }
              ]}
            >
              <Input prefix={<UserOutlined className="site-form-item-icon" style={{color: 'rgba(0, 0, 0,.25)'}}/>} placeholder="Username" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                {
                  validator: this.pwdValidator
                },
              ]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" style={{color: 'rgba(0, 0, 0,.25)'}}/>}
                type="password"
                placeholder="Password"
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="login-form-button">
                登 录
              </Button>       
            </Form.Item>
          </Form>
        </section>
      </div>
    )
  }
}
