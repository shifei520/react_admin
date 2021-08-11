import React, { Component } from 'react'
import { Card,Button, Form, Input, Cascader, message   } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import {reqCategory, reqAddUpdate} from '@/api'
import UpLoadImg from '@/components/uploadimg'
import EditorDraft from '@/components/editor-draft'

const { TextArea } = Input;


export default class AddUpdate extends Component {

  constructor(props) {
    super(props)
    this.isUpdate = !!this.props.location.state 
    this.product = this.props.location.state || {}
  }
  state = {
    options: []
  }
  loadData =async (selectedOptions) => {
    const targetOption = selectedOptions[0];
    const {options} = this.state
    targetOption.loading = true;
    // load options lazily
    // 点击一级分类列表，懒加载二级列表
    const subCategory = await this.getCategory(targetOption.value)
    if(subCategory &&subCategory.length > 0) {
      const newSubCategory = subCategory.map(item => ({
      value: item._id,
      label: item.name,
      isLeaf: true,
    }))
    
    targetOption.children = newSubCategory
    } else {
      targetOption.isLeaf = true
    }
    targetOption.loading = false;
    
    this.setState({options: [...options]});
    
  };
  // 格式化分类数据，使之能够符合antd组件展示
  initData = async (arr) => {
    const newArr = arr.map(item => ({
      value: item._id,
      label: item.name,
      isLeaf: false,
    }))
    // 这里判断修改商品信息页面的分类是二级分类时的情况
    const {isUpdate, product} = this
    const {pCategoryId} = product
    if(isUpdate && pCategoryId !== '0') {
      const subCategory = await this.getCategory(pCategoryId)
      // 生成二级下拉列表的options
      const childOptions = subCategory.map(c => ({
        value: c._id,
        label: c.name,
        isLeaf: true
      }))
      const newChild = newArr.find(item => item.value === pCategoryId)
      newChild.children = childOptions

    }
    this.setState({options: newArr})
  }
  //获取一级/二级分类列表
  getCategory =async (id) => {
    const result = await reqCategory(id)
      if(result.status===0) {
        if(id === '0') {
          this.initData(result.data)
        } else {
          return result.data
          
        }
      }
   
  }

  // 表单提交事件
  onFinish = (value) => {
    // console.log(value);
    const imgs = this.imgRef.getImgsArr()
    const detail = this.editorRef.getDraftHtml()
    const {name, desc, price, categorys} = value
    let categoryId, pCategoryId
    if(categorys.length === 1) {
      pCategoryId = '0'
      categoryId = categorys[0]
    } else {
      pCategoryId = categorys[0]
      categoryId = categorys[1]
    }
    const product = {name,desc,price,pCategoryId,categoryId,imgs,detail}
    
    if(this.isUpdate) {
      product._id = this.product._id
    }
    reqAddUpdate(product).then(res => {
      if(res.status === 0) {
        message.success((this.isUpdate ? '更新' : '添加') + '商品成功')
        this.props.history.goBack()
      } else {
        message.error(this.isUpdate ? '更新' : '添加' + '商品失败')
      }
    })
  }

  componentDidMount() {
    //加载级联选择框的一级分类列表
    this.getCategory('0')
  }


  render() {
    const {isUpdate, product} = this
    const {pCategoryId, categoryId, imgs, detail} = product
    const title =    
    (<span><Button onClick={this.props.history.goBack} type="link" icon={<ArrowLeftOutlined style={{fontSize: '20px', color: '#1da57a', marginRight: '10px'}}/>}/>
      {isUpdate ? '修改商品' : '添加商品'}
      </span>)
    const categorysId = []
    if(isUpdate) {
      // 商品是一个一级分类的商品
      if(pCategoryId==='0') {
        categorysId.push(categoryId)
      } else {
        // 商品是一个二级分类的商品
        categorysId.push(pCategoryId)
        categorysId.push(categoryId)
      }
    }

    return (
      <Card title={title} >
        <Form     
          onFinish={this.onFinish}
          labelCol={{ span: 2 }}
          wrapperCol={{ span: 8 }}
        >
          <Form.Item
            label="商品名称"
            name="name"
            initialValue={product.name}
            rules={[{ required: true, message: '请输入商品名称' }]}
          >
            <Input placeholder="请输入商品名称"/>
          </Form.Item>
          <Form.Item
            label="商品描述"
            name="desc"
            initialValue={product.desc}
            rules={[{ required: true, message: '请输入商品描述' }]}
          >
            <TextArea placeholder="请输入商品描述"/>
          </Form.Item>
          <Form.Item
            label="商品价格"
            name="price"
            initialValue={product.price}
            rules={[{ required: true, message: '请输入商品价格' }]}
          >
            <Input type="number" addonAfter="元" placeholder="请输入商品价格"/>
          </Form.Item>
          <Form.Item
            label="商品分类"
            name="categorys"
            initialValue= {categorysId}
            rules={[{ required: true, message: '请输入商品分类' }]}
          >
            <Cascader options={this.state.options} loadData={this.loadData} placeholder="请指定商品分类"/>
          </Form.Item>
          <Form.Item
            label="商品图片"
            name="imgs"
            
          >
            <UpLoadImg ref={c => this.imgRef = c} imgs={imgs}/>
          </Form.Item>
          <Form.Item
            label="商品详情"
            name="detail"
            wrapperCol={{ span: 20 }}
          >
            <EditorDraft ref={c => this.editorRef = c} detail={detail}/>
          </Form.Item>
          <Form.Item >
            <Button type="primary" htmlType="submit">
              提交
            </Button>
          </Form.Item>
      </Form>
      </Card>
    )
  }
}
