import React from 'react'
import { noop } from '../../utils/func'
import './style/index.less'

const ToggleBar = props => {
  const { onToggleClick } = props

  return (
    <div className="oce-console__toggle" onClick={onToggleClick}>
      Console
    </div>
  )
}
ToggleBar.defaultProps = {
  onToggleClick: noop
}

const Console = props => {
  const { onToggleClick, children } = props

  return (
    <div className="oce-console">
      <ToggleBar onToggleClick={onToggleClick} />
      <div className="oce-console__content">{children}</div>
    </div>
  )
}
Console.defaultProps = {
  children: [],
  onToggleClick: noop
}

export default Console
