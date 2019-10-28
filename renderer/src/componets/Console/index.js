import React, { useState } from 'react'
import { noop } from '../../utils/func'
import './style/index.less'

const ToggleBar = props => {
  const { show, onToggleClick } = props

  return (
    <div className="oce-console__toggle" onClick={onToggleClick}>
      Console
    </div>
  )
}
ToggleBar.defaultProps = {
  show: true,
  onToggleClick: noop
}

const Console = props => {
  const { onToggleClick, children } = props
  const [showConsole, setShowConsole] = useState(false)

  const onConsoleToggleClick = () => {
    onToggleClick(!showConsole)
    setShowConsole(!showConsole)
  }

  return (
    <div className="oce-console">
      <ToggleBar onToggleClick={onConsoleToggleClick} />
      <div className="oce-console__content">
        { children }
      </div>
    </div>
  )
}
Console.defaultProps = {
  children: []
}

export default Console
