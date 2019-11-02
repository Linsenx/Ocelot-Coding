import React from 'react'
import { Modal, Menu, Form, Switch } from 'antd'
import './style/index.less'
import { noop } from '../../utils/func'

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
  },
};

const EditorSetting = props => {
  const { show, onClose } = props

  return (
    <Modal
      title="编辑器设置"
      visible={show}
      maskClosable={false}
      onOk={onClose}
      okText="保存"
      onCancel={onClose}
      cancelText="取消"
      style={{ width: 400 }}
    >
      <div class="oce-editor-setting">
        <Menu mode="inline" style={{ width: 100 }}>
          <Menu.Item>通用</Menu.Item>
          <Menu.Item>JS</Menu.Item>
          <Menu.Item>CSS</Menu.Item>
          <Menu.Item>HTML</Menu.Item>
        </Menu>
        <div className="oce-editor-setting__rightside">
          <Form {...formItemLayout}>
            <Form.Item label="自动运行">
              <Switch />
            </Form.Item>
          </Form>
        </div>
      </div>
    </Modal>
  )
}
EditorSetting.defaultProps = {
  show: false,
  onClose: noop
}

export default React.memo(EditorSetting)
