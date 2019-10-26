import React, { useRef, useState } from "react"
import useElementResize from "../../hooks/useElementResize"
import "./style/index.less"

const voidFunc = () => {}

const ToggleBar = (props) => {
  const { show = true, onToggleClick = voidFunc } = props

  return (
    <div className="oce-console__toggle" onClick={onToggleClick}>
      Console
    </div>
  )
}

const Console = (props) => {
  const { onToggleClick } = props
  const [showConsole, setShowConsole] = useState(false)

  const onConsoleToggleClick = () => {
    onToggleClick(!showConsole)
    setShowConsole(!showConsole)
  }

  return (
    <div className="oce-console">
      <ToggleBar onToggleClick={onConsoleToggleClick} />
    </div>
  )
}

export default React.memo(Console)