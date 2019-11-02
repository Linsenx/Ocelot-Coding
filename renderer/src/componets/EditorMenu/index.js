import React from 'react'
import { Menu, Icon } from 'antd'
import { noop } from '../../utils/func'

const EditorMenu = props => {
  const { onRun, onSave, onSetting, currentEditor, onSwitchEditor } = props

  // 功能类菜单事件
  const onFunctionMenuClick = ({ key }) => {
    switch (key) {
      case 'run':
        onRun()
        break
      case 'save':
        onSave()
        break
      case 'setting':
        onSetting()
        break
    }
  }

  const onEditorMenuClick = ({ key }) => {
    if (key !== currentEditor) {
      onSwitchEditor(key)
    }
  }

  return (
    <div className="oce-editor-menu">
      <style jsx>{`
        .oce-editor-menu {
          display: flex;
          border-bottom: 1px solid #e8e8e8;
        }
        :global(.ant-menu-horizontal) {
          border-bottom: none;
        }
      `}</style>
      <Menu
        mode="horizontal"
        defaultSelectedKeys={[currentEditor]}
        onClick={onEditorMenuClick}
        style={{ WebkitAppRegion: 'no-drag' }}
      >
        <Menu.Item key="html">HTML</Menu.Item>
        <Menu.Item key="css">CSS</Menu.Item>
        <Menu.Item key="javascript">JS</Menu.Item>
      </Menu>
      <Menu
        mode="horizontal"
        selectable={false}
        onClick={onFunctionMenuClick}
        style={{ WebkitAppRegion: 'no-drag' }}
      >
        <Menu.Item key="run">
          <Icon type="play-circle" />
          运行
        </Menu.Item>
        <Menu.Item key="save">
          <Icon type="save" />
          保存
        </Menu.Item>
        {/* <Menu.Item key="setting">
          <Icon type="setting" />
          设置
        </Menu.Item> */}
      </Menu>
    </div>
  )
}

EditorMenu.defaultProps = {
  onRun: noop,
  onSave: noop,
  onSetting: noop,
  onSwitchEditor: noop,
  currentEditor: ''
}

export default React.memo(EditorMenu)
