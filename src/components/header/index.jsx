import React, { Component } from 'react'
import { withRouter } from 'react-router-dom';
import './index.less'
import { Button, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import menuList from '@/config/menuConfig.js'
import userInfo from '@/utils/userUtils.js'
import userStorage from "@/utils/localstorageUtils.js";
import {formateDate} from '@/utils/dateUtils.js'

class Header extends Component {

  state = {
    province: '',
    adcode: '',
    city: '',
    nowTime: formateDate(new Date()),
    weather: ''
  }

  getTitle = () => { // 点击相应路由标签后右侧显示对应名称
    const path = this.props.location.pathname
    let title = null
    menuList.forEach(item_1 => {
      if(path === item_1.key) {
        title = item_1.title
      } else if (item_1.children) {
        const itemObj = item_1.children.find(item_2 => path.indexOf(item_2.key) === 0)
        if(itemObj) {
          title = itemObj.title
        }
      }
    });
    return title
  }
  
  confirmOut = () => { // 确认是否退出登录
    Modal.confirm({
    title: '确认退出吗',
    icon: <ExclamationCircleOutlined />,
    okText: '确认',
    cancelText: '取消',
    onOk: () => {
          userInfo.user = null
          userStorage.removeUser()
          this.props.history.replace('/login')
        }
  });
  }

  async componentDidMount() {
    // 开启定时器动态展示时间
    this.timer = setInterval(() => {
      const nowTime = formateDate(new Date())
      this.setState({nowTime})
    }, 1000)
    // 获取地理位置信息
    const response = await fetch('https://restapi.amap.com/v3/ip?key=fee4d89b546ee6441948944ae97f6a8e')
    const res = await response.json()
    const {province,adcode, city} = res
    
    // 获取天气信息
    const weatherPromise = await fetch(`https://restapi.amap.com/v3/weather/weatherInfo?key=fee4d89b546ee6441948944ae97f6a8e&city=${adcode}`)
    const weatherInfo = await weatherPromise.json()
    const {weather} = weatherInfo.lives[0]
    this.setState({province, adcode, city, weather})
  }

  componentWillUnmount() {
    // 组件卸载时清除定时器
    clearInterval(this.timer)
  }

  render() {
    const title = this.getTitle()
    const {username} = userInfo.user
    const {province, city, nowTime, weather} = this.state
    return (
      <div className="header">
        <div className="header-top">
          欢迎您, {username}<Button type="link" onClick={this.confirmOut}>
          退出
        </Button>
        </div>
        <div className="header-bottom">
          <div className="header-bottom-left">{title}</div>
          <div className="header-bottom-right">{nowTime}---{province},{city} <span>{weather}</span> </div>
        </div>
      </div>
    )
  }
}

export default withRouter(Header)