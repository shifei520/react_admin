import React, { Component } from 'react'
import { Card, Button, Space, Table,Modal, Form, Input, Select   } from 'antd';
import { PlusOutlined, ArrowRightOutlined } from '@ant-design/icons';

import {reqCategory, reqUpdateCate, reqAddCate} from '@/api'
const { Option } = Select;

export default class Category extends Component {

  formRef = React.createRef()
  formRef_add = React.createRef()

  state = {
    category: [],// 一级分类列表
    subCategory: [], // 二级分类列表
    parentId: '0',
    subName: '', // 二级分类名称
    visible: 0
  }
  // 获取一级/二级分类列表
  getCategory = (id) => {
    const {parentId} = this.state
    reqCategory(id ? id : parentId).then(res => {
      if(parentId === '0') {
        this.setState({category: res.data})
      } else {
        this.setState({subCategory: res.data})
      }
      
    })
  }
  // 查看子分类按钮
  viewSubCate = (itemObj) => {
    const {_id, name} = itemObj
    this.setState({parentId: _id,subName: name}, () => {
      this.getCategory(_id)
    })
  }
  // 返回一级分类列表
  backFirstList = () => {
    this.setState({parentId: '0'},() => {
      this.getCategory('0')
    })
    
  }
  // 关闭对话框
  closeDialog = () => { 
    this.setState({visible: 0})
    this.formRef.current.resetFields()
  }
  // 关闭添加对话框
  closeAddDialog = () => { 
    this.setState({visible: 0})
  }

  // 修改分类
  updateCategory = () => {
    const {categoryName} = this.formRef.current.getFieldValue()
    const queryInfo =  {categoryId: this.curCategory._id, categoryName }
    reqUpdateCate(queryInfo).then(res => {
      if(res.status===0) {
        this.getCategory()
        this.setState({visible: 0})
      }
    })  
  }
  // 添加分类
  addCategory = () => {
    // console.log(this.formRef.current.getFieldValue());
    reqAddCate(this.formRef_add.current.getFieldValue()).then(res => {
      if(res.status === 0) {
        const {parentId} = this.formRef_add.current.getFieldValue()
        if(parentId === this.state.parentId) {
          this.getCategory()
        }   
        this.closeAddDialog()
      }
    })
  }
  // 打开修改分类对话框
  openUpdate = (itemObj) => {
    this.curCategory = itemObj || null
    this.setState({visible: 1}, () => {
      this.formRef.current.resetFields()
    })
  }
  // 打开添加分类对话框
  openAdd = () => {
    this.setState({visible: 2}, () => {
      this.formRef_add.current.resetFields()
    })
  }

  componentDidMount() {
    this.getCategory('0')
  }

  render() {
    const {parentId, category, subCategory, subName, visible} = this.state
    const title = parentId==='0' ? '一级分类列表' : (<Space size="middle">
        <a onClick={this.backFirstList}>一级分类列表</a>
        <ArrowRightOutlined />
        <span>{subName}</span>
      </Space>)
    const defaultName = this.curCategory ? this.curCategory.name : null

    const columns = [{
      title: "分类的名称",
      dataIndex: 'name'
    },
    {
    title: '操作',
    width: 300,
    render: (itemObj) => (
      <Space size="middle">
        <a onClick={() => this.openUpdate(itemObj)}>修改分类</a>
        {parentId==='0' ? <a onClick={() => this.viewSubCate(itemObj)}>查看子分类</a>: null}
      </Space>
    ),
  }
  ]

    return (
      <Card title={title} extra={<Button type="primary"  icon={<PlusOutlined />} onClick={this.openAdd}>
            添加
          </Button>} >
        <Table columns={columns} dataSource={parentId==='0' ? category : subCategory} rowKey="_id" bordered pagination={{showQuickJumper: true, defaultPageSize: 5}}/>
        {/* 修改分类的弹框 */}
        <Modal title="更新分类" visible={visible === 1} onOk={this.updateCategory} onCancel={this.closeDialog}>
        <Form  ref={this.formRef} name="control-ref" >
          <Form.Item
            name="categoryName"
            initialValue={defaultName}
            rules={[{ required: true, message: '输入内容不能为空' }]}
            >
            <Input />
          </Form.Item>    
        </Form>
      </Modal>
      {/* 添加分类的弹框 */}
      <Modal title="添加分类" visible={visible === 2} onOk={this.addCategory} onCancel={this.closeAddDialog}>
        <Form  ref={this.formRef_add} name="add-ref" >
          <Form.Item
            name="parentId"
            initialValue={parentId}
            >
            <Select>
            <Option value="0">一级分类</Option>
            {
              category.map(itemObj => {
                return <Option value={itemObj._id} key={itemObj._id}>{itemObj.name}</Option>
              })
            }
          </Select>
          </Form.Item>
          <Form.Item
            name="categoryName"
            rules={[{ required: true, message: '输入内容不能为空' }]}
            >
            <Input/>
          </Form.Item>     
        </Form>
      </Modal>
      </Card>
    )
  }
}
