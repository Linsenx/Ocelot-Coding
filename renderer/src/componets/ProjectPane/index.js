import React, { useState } from 'react'
import { noop } from '../../utils/func'
import { Icon, Input } from 'antd'
import { useHistory } from 'react-router-dom'
import './style/index.less'

const ToggleButton = props => {
  const { show, onTogglePane } = props

  const getClassName = () => {
    return [
      'oce-project-pane__toggle',
      !show ? 'oce-project-pane__toggle_hidden' : ''
    ].join(' ')
  }

  return (
    <div className={getClassName()} onClick={onTogglePane}>
      <Icon type={show ? 'left' : 'right'} />
    </div>
  )
}
ToggleButton.defaultProps = {
  show: true,
  onToggle: noop
}

const ProjectPane = props => {
  const { filename, show, onToggle, onFilenameChange } = props

  // History
  const history = useHistory()

  // 获得当前样式
  const getClassName = () => {
    return ['oce-project-pane', !show ? 'oce-project-pane_hidden' : ''].join(
      ' '
    )
  }

  return (
    <div className={getClassName()}>
      <ToggleButton show={show} onTogglePane={onToggle} />

      <div className="oce-project-pane__title">
        <Icon type="left" onClick={() => history.push('/explorer')} />
        <span>项目信息</span>
      </div>

      <div className="oce-project-pane__container">
        <Input.TextArea
          rows={4}
          defaultValue={filename}
          onChange={onFilenameChange}
        />
      </div>
    </div>
  )
}
ProjectPane.defaultProps = {
  show: true,
  filename: '',
  onToggle: noop,
  onFilenameChange: noop
}

export default React.memo(ProjectPane)
