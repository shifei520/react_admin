import React, { Component } from 'react'
import { Card, Button, List  } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import {BASE_IMG_URL} from '@/utils/constant.js'
import {reqProductName} from '@/api'
import './index.less'

export default class Detail extends Component {

  state = {
    fName: '', // 一级分类名称
    sName: ''  // 二级分类名称
  }

  async componentDidMount() {
    const {categoryId, pCategoryId} = this.props.location.state.itemObj
    if(pCategoryId === '0') {
      const result = await reqProductName(categoryId)
      this.setState({fName: result.data.name})
    } else {
      const results =await Promise.all([reqProductName(categoryId), reqProductName(pCategoryId)])
      this.setState({sName: results[0].data.name, fName: results[1].data.name})
    }
  }

  render() {
    const title =    
    (<span><Button onClick={this.props.history.goBack} type="link" icon={<ArrowLeftOutlined style={{fontSize: '20px', color: '#1da57a', marginRight: '10px'}}/>}/>
      商品详情
      </span>)

    const {name, desc, price, imgs, detail} = this.props.location.state.itemObj
    const {fName, sName} = this.state

    return (
      <Card title={title} className="detail">
      <List>
        <List.Item>
          <span className="detail-item-title">商品名称:</span>
          <span>{name}</span>
        </List.Item>
        <List.Item>
          <span className="detail-item-title">商品描述:</span>
          <span>{desc}</span>
        </List.Item>
        <List.Item>
          <span className="detail-item-title">商品价格:</span>
          <span>
            {price}元
          </span>
        </List.Item>
        <List.Item>
          <span className="detail-item-title">所属分类:</span>
          <span>{fName}{sName ? '-->' +sName : ''}</span>
        </List.Item>
        <List.Item>
          <span className="detail-item-title">商品图片:</span>
          <span className="img-show">
            {
              imgs.map(url => {
                return <img src={BASE_IMG_URL + url} key={url} />
              })
            }
          </span>
        </List.Item>
        <List.Item>
          <span className="detail-item-title">商品详情:</span>
          <span dangerouslySetInnerHTML={{__html: detail}} />
        </List.Item>
      </List>
    </Card>
    )
  }
}
