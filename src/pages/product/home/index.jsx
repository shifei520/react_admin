import React, { Component } from 'react'
import { Card, Select, Input,  Button, Table, message   } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import {reqProductList, reqSearchProduct, reqUpdateStatus} from '@/api'
const { Option } = Select;

export default class Home extends Component {

  state = {
    productsArr: [],
    total: 0,
    productType: 'productName', // 商品描述还是商品类型
    searchKeywords: ''// 搜索的关键字
  }

  constructor(props) {
    super(props)
    this.columns = [
      {
        title: '商品名称',
        dataIndex: 'name',
      },
      {
        title: '商品描述',
        dataIndex: 'desc',
      },
      {
        title: '价格',
        dataIndex: 'price',
        render: (price) => '￥' + price
      },
      {
        title: '状态',
        width: 100,
        render: (product) => {
          const {status, _id} = product
          const newStatus = status === 1 ? 2 : 1
          return (<span><Button type="primary" onClick={() => this.updateStatus(_id, newStatus)}>{status === 1 ? '下架' : '上架'}</Button> <span>{status === 1 ? '在售' : '已下架'}</span></span> )
        }
      },
      {
        title: '操作',
        width: 50,
        render: (itemObj) => (
          <span>
            <Button type="link" onClick={() => this.props.history.push('/product/detail', {itemObj})}>详情</Button>
            <Button type="link" onClick={() => this.props.history.push('/product/addupdate', itemObj)}>修改</Button>
          </span>
    ),
      }
    ]
  }
  // 分页器页数改变时触发
  handleChange =(pageNum) => {
    this.pageNum = pageNum
    const {searchKeywords, productType} = this.state
    if(searchKeywords) {
      this.getSearchProducts(pageNum, this.pageSize,productType, searchKeywords)
    } else {
      this.getProducts(pageNum, this.pageSize)
    }
    
  }
  // 获取分页列表数据
  getProducts = (pageNum,pageSize) => {
    reqProductList({pageNum, pageSize}).then(res => {
      if(res.status === 0) {
        this.setState({productsArr: res.data.list, total: res.data.total})
      }
    })
  }
  // 根据关键词获取分页列表数据
  getSearchProducts = (pageNum,pageSize, productType, searchKeywords) => {
    reqSearchProduct({pageNum, pageSize, [productType]: searchKeywords}).then(res => {
      if(res.status === 0) {
        this.setState({productsArr: res.data.list, total: res.data.total})
      }
    })
  }
  // 更新商品上下架状态
  updateStatus = async (id, status) => {
    const result =await reqUpdateStatus(id, status)
    if(result.status === 0) {
      message.success('更新商品状态成功')
      this.handleChange(this.pageNum)
    }
  }

  componentDidMount() {
    this.pageNum = 1
    this.pageSize = 3
    this.getProducts(this.pageNum, this.pageSize)
  }

  render() {
    const {productsArr, total, searchKeywords, productType} = this.state
    const pageSize = this.pageSize ? this.pageSize : 0
    const title = (
      <span>
        <Select defaultValue="productName" onChange={value => this.setState({productType: value})}>
          <Option value="productName">按名称搜索</Option>
          <Option value="productDesc">按描述搜索</Option>
        </Select>
        <Input placeholder="关键字" style={{width: '150px', margin: '0 15px'}} value={searchKeywords} onChange={e => this.setState({searchKeywords: e.target.value})}/>
        <Button type="primary" onClick={() => this.getSearchProducts(1,3,productType, searchKeywords)}>搜素</Button>
      </span>
    )
    const extra = (
      <Button type="primary"  icon={<PlusOutlined />} onClick={() => this.props.history.push('/product/addupdate')}>
            添加商品
      </Button>
    )

    return (
      <Card title={title} extra={extra} >
      <Table columns={this.columns} dataSource={productsArr} rowKey="_id" bordered pagination={{showQuickJumper: true, total:total, pageSize:pageSize , onChange: this.handleChange}}/>
      {/* <Pagination showQuickJumper total={total} pageSize={pageSize} onChange={this.handleChange}/> */}
    </Card>
    )
  }
}
