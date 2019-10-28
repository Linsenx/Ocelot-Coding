import React, { useState } from 'react'
import { noop } from '../../utils/func'
import { PageHeader, Icon, Input } from 'antd'
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
  const { filename = '', show = true, onToggle } = props

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

      <PageHeader title="项目信息" onBack={() => history.push('/explorer')} />
      <div className="oce-project-pane__container">
        <Input.TextArea rows={4} defaultValue={filename} />
      </div>
    </div>
  )
}

export default React.memo(ProjectPane)
