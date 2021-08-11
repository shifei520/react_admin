import React, { Component } from 'react'
import { Upload ,Modal,message } from 'antd';
import PropTypes from 'prop-types'
import { PlusOutlined } from '@ant-design/icons';
import {reqDeleteImg} from '@/api'
import {BASE_IMG_URL} from '@/utils/constant.js'

export default class UpLoadImg extends Component {
  static propTypes = {
      imgs: PropTypes.array
    }

  state = {
    previewVisible: false,
    fileList: [
      
    ]
  }
  constructor(props) {
    super(props)
    let fileList = []
    const {imgs} = this.props
    if(imgs&&imgs.length >0) {
      fileList = imgs.map((item, index) => ({
        uid: -index, // 每个file都有自己唯一的id
        name: item, // 图片文件名
        status: 'done', // 图片状态: done-已上传, uploading: 正在上传中, removed: 已删除
        url: BASE_IMG_URL + item
      }))

    this.state = {
      previewVisible: false,
      fileList
    }
    }
  }
  componentDidMount() {
    this.aaaa = '778'
  }
  

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    });
  };

  handleChange =async ({file,  fileList }) => {
    if(file.status === 'done') {
      const result = file.response
      if(result.status === 0) {
        fileList[fileList.length -1].name = result.data.name
        fileList[fileList.length -1].url = result.data.url
        message.success('图片上传成功')
      } else {
        message.error('图片上传失败')
      }
      
      
    }
    if(file.status === 'removed') {
      const result =await reqDeleteImg(file.name)
      if(result.status === 0) {
        message.success("删除图片成功")
      } else {
        message.error("删除图片失败")
      }
    }
    this.setState({ fileList })
  };
  // 获取图片地址数组，供父组件调用获取数组
  getImgsArr = () => {
    const {fileList} = this.state
    return fileList.map(item => item.name)
  }


  render() {
    const { previewVisible, previewImage, fileList, previewTitle } = this.state;
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    );
    return (
      <div>
        <Upload
          action="/manage/img/upload"
          accept="image/*"
          name="image"
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 3 ? null : uploadButton}
        </Upload>
        <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    )
  }
}