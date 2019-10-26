import React, { useState } from "react"
import { PageHeader, Icon, Input } from "antd"
import { useHistory } from "react-router-dom"
import "./style/index.less"

const voidFunc = () => {}

const ToggleButton = (props) => {
  const { show = true, onTogglePane = voidFunc } = props

  const getClassName = () => {
    return [
      "oce-project-pane__toggle",
      !show ? "oce-project-pane__toggle_hidden" : ''
    ].join(" ")
  }

  return (
    <div 
      className={getClassName()}
      onClick={onTogglePane}
    >
      <Icon type={ show ? 'left' : 'right' } />
    </div>
  )
}

const ProjectPane = (props) => {
  const { filename = '', show = true, onToggle } = props

  // History
  const history = useHistory()

  // 获得当前样式
  const getClassName = () => {
    return [
      "oce-project-pane",
      !show ? "oce-project-pane_hidden" : ''
    ].join(" ")
  }

  return (
    <div className={getClassName()}>
      <ToggleButton
        show={show}
        onTogglePane={onToggle}
      />

      <PageHeader
        title="项目信息"
        onBack={() => history.push('/explorer')}
      />
      <div className="oce-project-pane__container">
        <Input.TextArea
          rows={4}
          defaultValue={filename} 
        />
      </div>
    </div>
  )
}

export default React.memo(ProjectPane)